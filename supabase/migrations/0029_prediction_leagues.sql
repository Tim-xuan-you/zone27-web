-- ── ZONE 27 · Migration 0029 · 私人預測聯盟(leagues + league_members)──────────
-- Created: 2026-06-14 · R236
-- Purpose: 北極星「私人聯盟」第一刀 —— 讓一群朋友開一個盟,整季比「誰最會讀 CPBL+MLB」。
--   貨幣不是錢、不是連勝,是「公開含輸帳本 + 校準」(誰真的準,帳本證明)= fantasy 的上癮
--   機制,裝我們的誠實靈魂。 棒球(CPBL+MLB · 都兩選一 · 校準可比)合成一個榜;足球三選一
--   基準不同 → 之後當獨立賽道,不混進這個榜(同 R235② 才修的「不把三選一混進兩選一」紀律)。
--
-- 🔴 資料/計分架構(重要 · 為什麼這支很小):
--   · 一個盟 = 「一群永久碼的私密分組」。 排名 / 校準 / 贏不贏引擎 **完全重用** 既有公開天梯
--     的計分(lib/ladder-server aggregateIdentity · 賽果與引擎開盤線在程式碼裡)→ 這支 DB 只
--     負責「成員關係」,一個計分欄位都不存。
--   · 因為每個人的押注本來就公開(0022 天梯)· 盟只是「把公開帳本篩成這幾個碼的私密視圖」·
--     不外洩任何新東西。 RPC 一律 member-gated(非盟員不能列舉某盟的成員 = 結構性隱私)。
--
-- 🔴 紅線(別把護城河燒成賭場 · 同 liveness / ladder 設計):
--   · 排名按校準 / 贏過引擎的幅度(app 端算)· **不是** 裸勝率 / 連勝 / 盈虧 / 人氣。
--   · 0 金額欄位 · 0 點數 · 0 入會費 · 0 現金獎 —— 純精神預測 = 遊戲(同 0003 法律邊界)·
--     永遠不碰真錢對賭(那才是唯一會坐牢的紅線)。
--   · 不存 email / 0 PII —— 只存 league_members.member_id(uuid · 同 predictions.user_id)·
--     對外一律用永久碼 z27_author_code(member_id)(公開署名 key · 全站身分慣例)。
--
-- 隱私/安全姿態(同 0025 follows · RLS-locked + SECURITY DEFINER · 全欄位 qualify 表別名
--   防 42702 · create or replace / if not exists 冪等可重跑):
--   · 兩張表 RLS-locked **不開任何 policy** → 直接 SELECT/INSERT/DELETE 一律被擋,只能走
--     SECURITY DEFINER 函式(伺服器認定 auth.uid() · 不信前端)。
--   · 讀取函式(get_league / get_league_members)**member-gated**:呼叫者不是該盟成員 → 回 0 列。
--   · 全部只 grant authenticated(未登入由前端先攔下不打 · 加盟本來就要登入)。
--   · invite_code 不是敏感安全邊界(盟內看到的全是「本就公開」的押注帳本)· 但仍用 gen_random_uuid()
--     衍生的不可預測 6 碼 16 進位(0-9A-F · 無 O/I/0/1 混淆)· 撞號迴圈重生。
--
-- 依賴(prod 已是這些版本):helper z27_author_code / z27_display_handle / z27_display_name_raw
--   (0014/0015)已存在,本檔不重建,只新增兩張表 + 七支函式。
--
-- GRACEFUL:本檔未套用前 —— /member/leagues 與 /member/leagues/[id] 的 RPC 一律 catch → 回空 →
--   頁面顯示「聯盟功能建置中 / 套用後開通」,絕不 crash。 套完即活。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(可重複安全)。
-- ─────────────────────────────────────────────────────────────

-- ── 1 · leagues 表(盟本體 · 名稱 + 邀請碼 + 建立者)──────────────────────────
create table if not exists public.leagues (
  id          uuid        primary key default gen_random_uuid(),
  -- 盟名 1-40 字(RPC 先 trim + 驗 · 此 CHECK 為入庫最後一道)。
  name        text        not null check (char_length(name) between 1 and 40),
  -- 邀請碼:6 碼大寫 16 進位(gen_random_uuid 衍生 · 不可預測 · 無 O/I 混淆)· 全域唯一。
  invite_code text        not null unique check (invite_code ~ '^[0-9A-F]{6}$'),
  -- 建立者 uuid(刪帳號 → 盟保留 · 建立者標記轉 null · 成員不受影響)。
  created_by  uuid        references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ── 2 · league_members 表(盟 ↔ 成員 uuid · 多對多)──────────────────────────
create table if not exists public.league_members (
  league_id uuid        not null references public.leagues (id) on delete cascade,
  -- 成員 uuid(同 predictions.user_id · 對外一律解成永久碼)· 刪帳號 → 該成員列 cascade 清掉。
  member_id uuid        not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (league_id, member_id)
);

-- 「我在哪些盟」(get_my_leagues)會用 member_id 過濾 · 加索引。
create index if not exists league_members_member_idx
  on public.league_members (member_id);

-- ── 3 · RLS:兩張表 locked · 不開 policy → 只能走 SECURITY DEFINER 函式 ──────────
alter table public.leagues        enable row level security;
alter table public.league_members enable row level security;

-- ── 4 · create_league · 建一個盟(回 id + 名 + 邀請碼)────────────────────────
-- auth.uid() 認定建立者 · 產生不撞號邀請碼 · 建立者自動入盟。 防濫建:每人最多 30 個自建盟。
create or replace function public.create_league(p_name text)
returns table (id uuid, name text, invite_code text)
language plpgsql
security definer
set search_path = public
volatile
as $$
declare
  v_uid   uuid := auth.uid();
  v_name  text := trim(coalesce(p_name, ''));
  v_code  text;
  v_id    uuid;
  v_count int;
  v_try   int := 0;
begin
  if v_uid is null then
    raise exception 'auth_required' using errcode = 'P0001';
  end if;
  if char_length(v_name) < 1 or char_length(v_name) > 40 then
    raise exception 'bad_name' using errcode = 'P0001';
  end if;
  -- 防濫建:每人最多 30 個自建盟。
  select count(*) into v_count from public.leagues l where l.created_by = v_uid;
  if v_count >= 30 then
    raise exception 'too_many_leagues' using errcode = 'P0001';
  end if;
  -- 產生不撞號邀請碼(gen_random_uuid 衍生 6 碼大寫 hex · 撞號迴圈重生 · 最多 20 次)。
  loop
    v_try := v_try + 1;
    v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (select 1 from public.leagues l where l.invite_code = v_code);
    if v_try > 20 then
      raise exception 'code_gen_failed' using errcode = 'P0001';
    end if;
  end loop;
  insert into public.leagues (name, invite_code, created_by)
    values (v_name, v_code, v_uid)
    returning leagues.id into v_id;
  insert into public.league_members (league_id, member_id)
    values (v_id, v_uid)
    on conflict do nothing;
  return query
    select l.id, l.name, l.invite_code
    from public.leagues l
    where l.id = v_id;
end;
$$;

revoke execute on function public.create_league(text) from public;
grant  execute on function public.create_league(text) to authenticated;

-- ── 5 · join_league · 用邀請碼加入(回 id + 名 + 邀請碼)──────────────────────
-- 碼正規化大寫 · 找不到 → no_such_league · 盟員上限 100 · 個人最多加 50 盟。 冪等(已在 → 無誤)。
create or replace function public.join_league(p_invite_code text)
returns table (id uuid, name text, invite_code text)
language plpgsql
security definer
set search_path = public
volatile
as $$
declare
  v_uid     uuid := auth.uid();
  v_code    text := upper(trim(coalesce(p_invite_code, '')));
  v_league  uuid;
  v_members int;
  v_joined  int;
begin
  if v_uid is null then
    raise exception 'auth_required' using errcode = 'P0001';
  end if;
  if v_code !~ '^[0-9A-F]{6}$' then
    raise exception 'bad_code' using errcode = 'P0001';
  end if;
  select l.id into v_league from public.leagues l where l.invite_code = v_code;
  if v_league is null then
    raise exception 'no_such_league' using errcode = 'P0001';
  end if;
  -- 已是盟員 → 冪等成功回傳(不報錯 · 重複貼碼不爆)。
  if exists (
    select 1 from public.league_members lm
    where lm.league_id = v_league and lm.member_id = v_uid
  ) then
    return query select l.id, l.name, l.invite_code from public.leagues l where l.id = v_league;
    return;
  end if;
  -- 盟員上限(防爆 · 私人友群足夠)。
  select count(*) into v_members from public.league_members lm where lm.league_id = v_league;
  if v_members >= 100 then
    raise exception 'league_full' using errcode = 'P0001';
  end if;
  -- 個人加入上限。
  select count(*) into v_joined from public.league_members lm where lm.member_id = v_uid;
  if v_joined >= 50 then
    raise exception 'too_many_joined' using errcode = 'P0001';
  end if;
  insert into public.league_members (league_id, member_id)
    values (v_league, v_uid)
    on conflict do nothing;
  return query select l.id, l.name, l.invite_code from public.leagues l where l.id = v_league;
end;
$$;

revoke execute on function public.join_league(text) from public;
grant  execute on function public.join_league(text) to authenticated;

-- ── 6 · leave_league · 退出一個盟(刪自己那列 · 冪等)──────────────────────────
create or replace function public.leave_league(p_league_id uuid)
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
  delete from public.league_members lm
    where lm.league_id = p_league_id and lm.member_id = v_uid;
  return 'left';
end;
$$;

revoke execute on function public.leave_league(uuid) from public;
grant  execute on function public.leave_league(uuid) to authenticated;

-- ── 7 · get_my_leagues · 我在哪些盟(含成員數 + 是否我建的)──────────────────────
create or replace function public.get_my_leagues()
returns table (
  id           uuid,
  name         text,
  invite_code  text,
  member_count bigint,
  is_creator   boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select
    l.id,
    l.name,
    l.invite_code,
    (select count(*) from public.league_members lm2 where lm2.league_id = l.id) as member_count,
    (l.created_by = auth.uid()) as is_creator
  from public.leagues l
  join public.league_members lm on lm.league_id = l.id
  where lm.member_id = auth.uid()
  order by l.created_at desc
  limit 100;
$$;

revoke execute on function public.get_my_leagues() from public;
grant  execute on function public.get_my_leagues() to authenticated;

-- ── 8 · get_league · 單一盟的 meta(member-gated · 非盟員回 0 列)──────────────
create or replace function public.get_league(p_league_id uuid)
returns table (
  id           uuid,
  name         text,
  invite_code  text,
  member_count bigint,
  is_creator   boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select
    l.id,
    l.name,
    l.invite_code,
    (select count(*) from public.league_members lm2 where lm2.league_id = l.id) as member_count,
    (l.created_by = auth.uid()) as is_creator
  from public.leagues l
  where l.id = p_league_id
    and exists (
      select 1 from public.league_members lm
      where lm.league_id = l.id and lm.member_id = auth.uid()
    );
$$;

revoke execute on function public.get_league(uuid) from public;
grant  execute on function public.get_league(uuid) to authenticated;

-- ── 9 · get_league_members · 盟成員清單(member-gated · 回永久碼 + 公開 handle)────
-- 回永久碼(app 端拿去跟公開天梯帳本 join → 算每人校準/戰績)+ 顯示 handle / 顯示名。
-- 🔴 非盟員(含未登入)→ 回 0 列(結構性隱私 · 防列舉某盟成員)。
create or replace function public.get_league_members(p_league_id uuid)
returns table (
  member_code  text,
  handle       text,
  display_name text,
  joined_at    timestamptz
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return;
  end if;
  if not exists (
    select 1 from public.league_members lm
    where lm.league_id = p_league_id and lm.member_id = v_uid
  ) then
    return;  -- 非盟員 · 0 列
  end if;
  return query
    select
      public.z27_author_code(lm.member_id)      as member_code,
      public.z27_display_handle(lm.member_id)   as handle,
      public.z27_display_name_raw(lm.member_id) as display_name,
      lm.joined_at
    from public.league_members lm
    where lm.league_id = p_league_id
    order by lm.joined_at asc
    limit 200;
end;
$$;

revoke execute on function public.get_league_members(uuid) from public;
grant  execute on function public.get_league_members(uuid) to authenticated;

-- ── 10 · get_league_by_code · 加入前預覽(authed · 回名 + 成員數 + 我是否已在)──────
-- 邀請連結落地頁用:讓人在按「加入」前看到要加入哪個盟。 邀請碼即存取權杖(同 Google Doc 連結)·
-- 故只回最小資訊(名 + 成員數)· 不回成員清單。 找不到 → 0 列。
create or replace function public.get_league_by_code(p_invite_code text)
returns table (
  id             uuid,
  name           text,
  member_count   bigint,
  already_member boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select
    l.id,
    l.name,
    (select count(*) from public.league_members lm2 where lm2.league_id = l.id) as member_count,
    exists (
      select 1 from public.league_members lm
      where lm.league_id = l.id and lm.member_id = auth.uid()
    ) as already_member
  from public.leagues l
  where l.invite_code = upper(trim(coalesce(p_invite_code, '')));
$$;

revoke execute on function public.get_league_by_code(text) from public;
grant  execute on function public.get_league_by_code(text) to authenticated;
