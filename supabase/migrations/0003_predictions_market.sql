-- ── ZONE 27 · Migration 0003 · Predictions Market ─────
-- Created: 2026-05-29
-- Purpose: 把「使用者預測」從 per-user user_metadata(各自孤島 · 無法跨人
--          統計)升級成一張 SHARED table → 才能長出兩個東西:
--            (a) 市場線 · 每場「X% 進場買主隊」群眾即時機率(aggregate)
--            (b) 公開海選 · 每個人的預測被公開累積打分(未來 brick)
--
--          這是「免費玩 → 公開海選 → 變付費高手」整條龍的脊椎。
--
-- 法律邊界(硬守):
--   · pick 只進「點數/虛擬預測」· 此表 0 金額欄位 · 不存賭注 · 不存金流
--   · 真錢只在未來「賣分析內容」那側走(完全分離的另一套)· 兩邊永不打通
--   · 純精神預測 = 遊戲 · 不觸發賭博罪 / 運彩條例(同 lib/predictions.ts 精神)
--
-- 設計 same pattern as 0001 / 0002:
--   1. RLS locked · nobody direct table access
--   2. 寫入只走 SECURITY DEFINER submit_prediction()(需登入 · 一場一次 · 不可改)
--   3. 市場線只走 SECURITY DEFINER get_match_prediction_tally()
--      (只回 home/away 計數 · 0 PII · anon 可讀)
--   4. 本人讀自己預測走 get_my_prediction()
--   5. 一場一人一次 · 不可改(committed pick = 誠信 + 防作弊)
--   6. created_at 記下「何時押」· 賽後結算時 app-side 只採計「開賽前」的預測
--      (防止賽後補登 · 對齊 /track-record「先鎖後結」誠信)
-- ─────────────────────────────────────────────────────

-- ── 1 · Table ────────────────────────────────────────
create table if not exists public.predictions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  match_id    text not null,
  pick        text not null check (pick in ('home', 'away')),
  created_at  timestamptz not null default now()
);

-- 一場一人一次(committed · 不可改 · 防作弊)
create unique index if not exists predictions_one_per_user_match_idx
  on public.predictions (user_id, match_id);

-- 市場線 tally 用 · 依 match_id 快速聚合
create index if not exists predictions_match_id_idx
  on public.predictions (match_id);

alter table public.predictions enable row level security;

-- (No RLS policies = no direct access · all via SECURITY DEFINER below)

-- ── 2 · RPC · submit_prediction ──────────────────────
-- 登入 user 對一場比賽押一邊。 失敗條件:
--   · 未登入 → 'not_logged_in'
--   · p_pick 不是 'home'/'away' → 'invalid_pick'
--   · 此 user 對此 match 已押過 → 'already_predicted'(committed · 不可改)

create or replace function public.submit_prediction(
  p_match_id text,
  p_pick     text
)
returns table (prediction_id uuid, match_id text, pick text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_id  uuid;
  v_match text;
  v_at  timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_match := nullif(trim(coalesce(p_match_id, '')), '');
  if v_match is null then
    raise exception 'invalid_match';
  end if;

  if p_pick is null or p_pick not in ('home', 'away') then
    raise exception 'invalid_pick';
  end if;

  if exists (
    select 1 from public.predictions
    where user_id = v_uid and predictions.match_id = v_match
  ) then
    raise exception 'already_predicted';
  end if;

  insert into public.predictions (user_id, match_id, pick)
  values (v_uid, v_match, p_pick)
  returning id, predictions.created_at
  into v_id, v_at;

  return query select v_id, v_match, p_pick, v_at;
end;
$$;

revoke execute on function public.submit_prediction(text, text) from public;
grant  execute on function public.submit_prediction(text, text) to authenticated;

-- ── 3 · RPC · get_match_prediction_tally ─────────────
-- 市場線 · 公開 aggregate · 回某場 home/away 押注計數 + total。
-- 0 PII · anon 可讀(看得到「幾人押主隊」· 看不到「誰押」)。
-- App-side 把 total/home 算成百分比 = 群眾即時機率。

create or replace function public.get_match_prediction_tally(
  p_match_id text
)
returns table (home_count bigint, away_count bigint, total bigint)
language sql
security definer
set search_path = public
as $$
  select
    count(*) filter (where p.pick = 'home')::bigint as home_count,
    count(*) filter (where p.pick = 'away')::bigint as away_count,
    count(*)::bigint                                as total
  from public.predictions p
  where p.match_id = p_match_id;
$$;

revoke execute on function public.get_match_prediction_tally(text) from public;
grant  execute on function public.get_match_prediction_tally(text) to anon;
grant  execute on function public.get_match_prediction_tally(text) to authenticated;

-- ── 4 · RPC · get_my_prediction ──────────────────────
-- 本人讀自己對某場的預測(或 null)。

create or replace function public.get_my_prediction(
  p_match_id text
)
returns table (pick text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    return;
  end if;

  return query
    select p.pick, p.created_at
    from public.predictions p
    where p.user_id = v_uid and p.match_id = p_match_id
    limit 1;
end;
$$;

revoke execute on function public.get_my_prediction(text) from public;
grant  execute on function public.get_my_prediction(text) to authenticated;
