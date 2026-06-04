-- ── ZONE 27 · Migration 0015 · 創作者永久碼(問責命門修復)──────────
-- Created: 2026-06-04 · R200
-- Purpose: 修「改名洗掉戰績」的架構命門 bug。
--   0014 讓三支 RPC 的 `handle` = coalesce(顯示名, 球迷#碼)· 前端用 `handle` 當
--   戰績 key(gradeAuthorRecords[r.handle])。 ⇒ 創作者攢了爛戰績後改名 → handle 變
--   → key 變 → 舊紀錄孤兒、變回「新分析師」= 改名 = 洗掉問責 = 報馬仔刪輸文的反面。
--   附帶:兩人同名 → 戰績 merge(撞號)。
--
--   正解(全平台標準 · X/Discord/Reddit/Polymarket 都靠「永久 ID 一直顯示 + 紀錄黏
--   ID」做問責 · 沒人靠限制改名):戰績綁**永久碼**(md5(user_id) 前 8 碼 · 改名洗不掉、
--   同名不撞),顯示名純裝飾標籤。 改名永遠免費無限次(永久碼扛問責)。
--
-- 改動:三支讀取 RPC 各**多回兩欄** ——
--   · author_code text:永久碼 substr(md5(user_id::text),1,8)· 戰績 key + 永久身分。
--   · display_name text:會員自填的顯示名(trim 後;沒設 = 空字串)· 純展示 label。
--   原有 `handle`(0014 的 coalesce 值)**保留不動** = 舊前端 / fallback 仍可用(不破)。
--
-- GRACEFUL:本檔未套用前,RPC 仍回舊 9/4 欄(無 author_code)→ 前端 fallback 用 handle
--   keying(行為同舊版)。 套用後 → 前端改用 author_code keying(改名不再洗戰績)。
--
-- 風險/慣例(同 0014 教訓):
--   · 回傳型別「有變」(多兩欄)→ 觸發 42P13 cannot-change-return-type · 故每支先
--     `drop function if exists`(精確簽章)再 create = 冪等可重跑。
--   · drop 會連同 grants 一起清 → 重建後逐支重設 revoke/grant(同 0005/0014)。
--   · 全欄位 qualify 表別名(防 42702 ambiguous · 同 0003/0005/0007 的 created_at 教訓)。
--   · 新 helper z27_author_code 是 immutable 純函式(只算 md5 · 不讀表)。
-- 依賴(prod 已是這些版本):0008 get_creator_posts(9 欄)· 0010 get_creator_comments ·
--   0013/0014 get_creator_records(4 欄)· 0014 z27_display_handle(handle 欄沿用它)。
-- ─────────────────────────────────────────────────────

-- ── 0 · helpers · uid → 永久碼 / 顯示名(純展示)──────────────
-- 永久碼:md5(user_id) 前 8 碼 · 跟 lib/identity anonHandle 的 slice(0,8) + member 頁
-- createHash("md5") 完全一致 → 後台臉 = 公開署名臉 = 戰績 key 同一把。 純函式 immutable。
create or replace function public.z27_author_code(p_uid uuid)
returns text
language sql
immutable
as $$
  select substr(md5(p_uid::text), 1, 8);
$$;

revoke execute on function public.z27_author_code(uuid) from public;
grant  execute on function public.z27_author_code(uuid) to anon;
grant  execute on function public.z27_author_code(uuid) to authenticated;

-- 顯示名(raw · 純標籤)· 會員自填 opt-in · trim 後為空 → 回空字串(前端不顯示)。
-- 跟 z27_display_handle 的差別:這支「不」退回匿名代號 · 純回名字本身(讓前端自己決定
-- 沒名字時怎麼呈現 = 只顯示永久碼,不重複「球迷#碼 · #碼」)。 SECURITY DEFINER 讀 auth.users。
create or replace function public.z27_display_name_raw(p_uid uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    nullif(
      trim((select u.raw_user_meta_data ->> 'display_name'
            from auth.users u where u.id = p_uid)),
      ''
    ),
    ''
  );
$$;

revoke execute on function public.z27_display_name_raw(uuid) from public;
grant  execute on function public.z27_display_name_raw(uuid) to anon;
grant  execute on function public.z27_display_name_raw(uuid) to authenticated;

-- ── 1 · get_creator_posts · 多回 author_code + display_name(其餘同 0014)──
drop function if exists public.get_creator_posts(text);
create function public.get_creator_posts(p_match_id text)
returns table (
  post_id      uuid,
  handle       text,
  author_code  text,
  display_name text,
  title        text,
  body         text,
  pick         text,
  price_ntd    int,
  created_at   timestamptz,
  is_paid      boolean,
  purchased    boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  return query
  select
    p.id as post_id,
    public.z27_display_handle(p.user_id)   as handle,
    public.z27_author_code(p.user_id)      as author_code,
    public.z27_display_name_raw(p.user_id) as display_name,
    p.title,
    case
      when p.price_ntd = 0 then p.body
      when v_uid = p.user_id then p.body
      when v_uid is not null and exists (
        select 1 from public.creator_purchases cp
        where cp.post_id = p.id and cp.buyer_id = v_uid
      ) then p.body
      else null
    end as body,
    p.pick,
    p.price_ntd,
    p.created_at,
    (p.price_ntd > 0) as is_paid,
    (
      v_uid is not null and (
        v_uid = p.user_id or exists (
          select 1 from public.creator_purchases cp
          where cp.post_id = p.id and cp.buyer_id = v_uid
        )
      )
    ) as purchased
  from public.creator_posts p
  where p.match_id = p_match_id
  order by p.created_at desc
  limit 50;
end;
$$;

revoke execute on function public.get_creator_posts(text) from public;
grant  execute on function public.get_creator_posts(text) to anon;
grant  execute on function public.get_creator_posts(text) to authenticated;

-- ── 2 · get_creator_comments · 多回 author_code + display_name(其餘同 0014)──
drop function if exists public.get_creator_comments(uuid);
create function public.get_creator_comments(p_post_id uuid)
returns table (
  handle       text,
  author_code  text,
  display_name text,
  is_author    boolean,
  body         text,
  created_at   timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    public.z27_display_handle(c.user_id)   as handle,
    public.z27_author_code(c.user_id)      as author_code,
    public.z27_display_name_raw(c.user_id) as display_name,
    (c.user_id = cp.user_id)               as is_author,
    c.body,
    c.created_at
  from public.creator_comments c
  join public.creator_posts cp on cp.id = c.post_id
  where c.post_id = p_post_id
  order by c.created_at asc
  limit 200;
$$;

revoke execute on function public.get_creator_comments(uuid) from public;
grant  execute on function public.get_creator_comments(uuid) to anon;
grant  execute on function public.get_creator_comments(uuid) to authenticated;

-- ── 3 · get_creator_records · 多回 author_code(戰績 key · 其餘同 0014)──
-- 徽章/天梯用 author_code 當 key(永久碼)→ 改名洗不掉、同名不撞。 handle 保留供 fallback。
drop function if exists public.get_creator_records();
create function public.get_creator_records()
returns table (
  handle      text,
  author_code text,
  match_id    text,
  pick        text,
  created_at  timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    public.z27_display_handle(p.user_id) as handle,
    public.z27_author_code(p.user_id)    as author_code,
    p.match_id,
    p.pick,
    p.created_at
  from public.creator_posts p
  order by p.created_at desc
  limit 2000;
$$;

revoke execute on function public.get_creator_records() from public;
grant  execute on function public.get_creator_records() to anon;
grant  execute on function public.get_creator_records() to authenticated;
