-- ── ZONE 27 · Migration 0018 · 足球三向押注(放寬 pick 允許 'draw')─────
-- Created: 2026-06-05
-- Purpose: 足球是三向(主勝 / 和 / 客勝)· 現在押注表 0003 的 pick 只允許
--          'home'/'away'(棒球兩向)。 放寬成允許 'draw',讓足球能押「和局」。
--          棒球不受影響(照樣只押 home/away)· 同一張表 · 用 match_id 開頭分運動
--          (fd-* = 足球 · cpbl-*/mlb-* = 棒球)· 不另建表 · 不存金額(同 0003 法律邊界)。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支跑一次即可(可重複安全)。
-- ─────────────────────────────────────────────────────

-- ── 1 · 放寬 CHECK 約束 · 允許 'draw' ────────────────────
alter table public.predictions
  drop constraint if exists predictions_pick_check;

alter table public.predictions
  add constraint predictions_pick_check
  check (pick in ('home', 'away', 'draw'));

-- ── 2 · submit_prediction · 接受 'draw' ─────────────────
-- (只改驗證那一行 'home'/'away' → 加 'draw';其餘同 0003 · 登入/一場一次/不可改)
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

  if p_pick is null or p_pick not in ('home', 'away', 'draw') then
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

-- ── 3 · get_match_prediction_tally · 加 draw_count(足球群眾市場線)──
-- 回傳型別改變(多一欄 draw_count)→ 必須先 drop 再建(避免 42P13 return type 錯)。
drop function if exists public.get_match_prediction_tally(text);

create function public.get_match_prediction_tally(
  p_match_id text
)
returns table (home_count bigint, draw_count bigint, away_count bigint, total bigint)
language sql
security definer
set search_path = public
as $$
  select
    count(*) filter (where p.pick = 'home')::bigint as home_count,
    count(*) filter (where p.pick = 'draw')::bigint as draw_count,
    count(*) filter (where p.pick = 'away')::bigint as away_count,
    count(*)::bigint                                as total
  from public.predictions p
  where p.match_id = p_match_id;
$$;

revoke execute on function public.get_match_prediction_tally(text) from public;
grant  execute on function public.get_match_prediction_tally(text) to anon;
grant  execute on function public.get_match_prediction_tally(text) to authenticated;
