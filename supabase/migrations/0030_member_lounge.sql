-- ── ZONE 27 · Migration 0030 · 會員之間的房間(member_lounge)──────────────────
-- Created: 2026-06-17 · R248
-- Purpose: Defector 式「會員專屬空間」—— 出錢養著免費引擎的那一群,有一間只有他們進得去的
--   房間,聊球、聊判斷、彼此打招呼。 這不是功能、不是明牌、不押注 = 純身分/社群(回答「引擎
--   全免費為什麼付費」:你買的是歸屬,不是 access)。 引擎/押注/天梯/校準/戰績永遠對所有人免費,
--   這間房間不碰那些,只是「會員的客廳」。
--
-- 🔴 紅線:這間房間是「身分制」不是「功能制」—— 進不去不影響任何預測能力(那些全免費)。
--   排序純時間(最新在上)· 0 連勝 / 0 PnL / 0 排名 / 0 按讚數。 只是一面會員的留言牆。
--
-- 🔴 安全姿態(比 supporter 金環更嚴):金環(0023)讀 user_metadata.tier = 使用者可自己用
--   updateUser 改(金環只是裝飾,改了也只是「謊稱有贊助」,不解鎖任何東西,可接受)。 但這間
--   房間是「access 邊界」→ 必須擋得住自助 spoof。 解法 = tier 同時鏡到 raw_app_meta_data
--   (app_metadata · **使用者改不了**,只有 service_role / SECURITY DEFINER 寫得進),房間一律
--   認 app_metadata。 admin_set_tier 升級成同時寫 user_metadata(金環)+ app_metadata(房門)·
--   一個動作兩處同步。 房間 RPC 再各自 z27_is_member 二次把關(defense in depth)。
--
-- 隱私:不存 email / 0 PII · 作者一律 z27_author_code(member_id)對外(全站身分慣例)。 房間
--   RLS-locked 不開 policy → 只能走 SECURITY DEFINER 函式。 讀/寫一律 member-gated(非會員打不到)。
--
-- GRACEFUL:本檔未套前 —— /member/lounge 的 RPC 一律 catch → 會員看到「建置中」、非會員看到房間
--   介紹 + 升級邀請,絕不 crash。 套完即活。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(可重複安全)。 套完後,既有付費會員
--   需用 /admin「設定等級」重設一次(讓 app_metadata 補上房門鑰匙;現階段付費會員 ≈ 0,無痛)。
-- ─────────────────────────────────────────────────────────────

-- ── 1 · admin_set_tier 升級 · tier 同時寫 user_metadata(金環)+ app_metadata(房門)──────
-- 與 0011 行為相同,只多一步:把 tier 鏡到 raw_app_meta_data(使用者 updateUser 改不到 = 安全
-- access 邊界)。 'free' 兩處都清掉。 create or replace 冪等 · is_admin 仍是唯一入口。
create or replace function public.admin_set_tier(p_email text, p_tier text)
returns boolean language plpgsql security definer set search_path = public
as $$
declare v_uid uuid; v_tier text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  v_tier := lower(trim(coalesce(p_tier, '')));
  if v_tier not in ('free', 'black', 'founder') then raise exception 'invalid_tier'; end if;
  select u.id into v_uid from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if v_uid is null then raise exception 'user_not_found'; end if;
  if v_tier = 'free' then
    update auth.users set
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) - 'tier',
      raw_app_meta_data  = coalesce(raw_app_meta_data, '{}'::jsonb) - 'tier'
    where id = v_uid;
  else
    update auth.users set
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('tier', v_tier),
      raw_app_meta_data  = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('tier', v_tier)
    where id = v_uid;
  end if;
  return true;
end; $$;

revoke execute on function public.admin_set_tier(text, text) from public;
grant  execute on function public.admin_set_tier(text, text) to authenticated;

-- ── 2 · z27_is_member · 安全的會員判定(app_metadata · 使用者改不了)──────────────────
-- true = 該 uid 是付費會員(BLACK / GOLD)或站方 admin(Tim 可進場 seed / 看 / 管)。 房門只認此函式。
-- 🔴 讀 raw_app_meta_data(非 user_metadata)→ 自助 updateUser spoof 無效。
-- 🔴 用法約定:房間 RPC 一律傳 auth.uid()(p_uid = 呼叫者本人)→「p_uid 付費 OR 呼叫者是 admin」
--    收斂成「我是會員或 admin」。 別拿別人的 uid 呼叫(admin 呼叫對任何 uid 都回 true · 這裡刻意不需要)。
create or replace function public.z27_is_member(p_uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select (u.raw_app_meta_data ->> 'tier') in ('black', 'founder') or public.is_admin()
     from auth.users u where u.id = p_uid),
    false
  );
$$;

revoke execute on function public.z27_is_member(uuid) from public;
grant  execute on function public.z27_is_member(uuid) to authenticated;

-- ── 3 · member_lounge 表(會員留言牆 · RLS-locked)──────────────────────────────
create table if not exists public.member_lounge (
  id         uuid        primary key default gen_random_uuid(),
  -- 作者 uuid(刪帳號 → 留言 cascade 清掉)· 對外一律解成永久碼。
  author_id  uuid        not null references auth.users (id) on delete cascade,
  -- 內文 1-1000 字(RPC 先 trim + 驗 · 此 CHECK 為入庫最後一道)。
  body       text        not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists member_lounge_created_idx
  on public.member_lounge (created_at desc);

alter table public.member_lounge enable row level security;
-- 不開任何 policy → 直接 SELECT/INSERT/DELETE 一律被擋,只能走下面的 SECURITY DEFINER 函式。

-- ── 4 · post_lounge_message · 發一則(會員 only · 長度 + 速率把關)─────────────────────
create or replace function public.post_lounge_message(p_body text)
returns uuid
language plpgsql
security definer
set search_path = public
volatile
as $$
declare
  v_uid    uuid := auth.uid();
  v_body   text := btrim(coalesce(p_body, ''));
  v_recent int;
  v_id     uuid;
begin
  if v_uid is null then
    raise exception 'auth_required' using errcode = 'P0001';
  end if;
  if not public.z27_is_member(v_uid) then
    raise exception 'members_only' using errcode = 'P0001';
  end if;
  if char_length(v_body) < 1 then
    raise exception 'empty' using errcode = 'P0001';
  end if;
  if char_length(v_body) > 1000 then
    raise exception 'too_long' using errcode = 'P0001';
  end if;
  -- 速率:每人每小時最多 30 則(防洗版 · 友群足夠)。
  select count(*) into v_recent from public.member_lounge m
    where m.author_id = v_uid and m.created_at > now() - interval '1 hour';
  if v_recent >= 30 then
    raise exception 'rate_limit' using errcode = 'P0001';
  end if;
  insert into public.member_lounge (author_id, body)
    values (v_uid, v_body)
    returning member_lounge.id into v_id;
  return v_id;
end;
$$;

revoke execute on function public.post_lounge_message(text) from public;
grant  execute on function public.post_lounge_message(text) to authenticated;

-- ── 5 · get_lounge_messages · 讀房間(會員 only · 回作者永久碼 + 顯示名 + 金環 tier)────────
-- 非會員(含未登入)→ raise members_only(前端據此顯示房間介紹 + 升級邀請)。 最新在上 · 分頁用 p_before。
create or replace function public.get_lounge_messages(p_limit int default 50, p_before timestamptz default null)
returns table (
  id           uuid,
  body         text,
  created_at   timestamptz,
  author_code  text,
  author_name  text,
  author_tier  text,
  is_mine      boolean
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or not public.z27_is_member(v_uid) then
    raise exception 'members_only' using errcode = 'P0001';
  end if;
  return query
    select
      m.id,
      m.body,
      m.created_at,
      public.z27_author_code(m.author_id)                          as author_code,
      coalesce(
        nullif(public.z27_display_name_raw(m.author_id), ''),
        '球迷 #' || public.z27_author_code(m.author_id)
      )                                                            as author_name,
      coalesce(u.raw_app_meta_data ->> 'tier', '')                 as author_tier,
      (m.author_id = v_uid)                                        as is_mine
    from public.member_lounge m
    join auth.users u on u.id = m.author_id
    where (p_before is null or m.created_at < p_before)
    order by m.created_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 100);
end;
$$;

revoke execute on function public.get_lounge_messages(int, timestamptz) from public;
grant  execute on function public.get_lounge_messages(int, timestamptz) to authenticated;

-- ── 6 · delete_lounge_message · 撤回自己的(或 admin 撤任何一則 · 純內容審核)────────────
create or replace function public.delete_lounge_message(p_id uuid)
returns text
language plpgsql
security definer
set search_path = public
volatile
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return 'anon';
  end if;
  delete from public.member_lounge m
    where m.id = p_id
      and (m.author_id = v_uid or public.is_admin());
  return 'ok';
end;
$$;

revoke execute on function public.delete_lounge_message(uuid) from public;
grant  execute on function public.delete_lounge_message(uuid) to authenticated;
