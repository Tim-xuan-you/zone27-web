-- ── ZONE 27 · Migration 0021 · 預測信心值(校準大師)──────────────────
-- Created: 2026-06-11
-- Purpose: 開「校準大師」靈魂功能 —— 讓會員押注時順手宣告「我幾成把握」,賽後攤開
--          「你說 8 成的那些場、是不是真的中 8 成」。 這是 538/Metaculus 那種誠實預測
--          平台最高級的信任證明,也是把「贏不贏」轉成「準不準」的核心(玩運彩不敢做)。
--
-- 🔴 安全姿態(重要):本 migration **100% 純加法** —— 只「新增」一個欄位 + 兩個新函式,
--    **完全不碰** 現有的 submit_prediction / get_my_predictions / get_match_prediction_tally。
--    所以就算這支有任何問題,現有的押注、戰績、市場線一律照常運作,絕不會壞。 可重複安全跑。
--
-- 法律邊界不變:純精神預測 · 0 金額 · 0 金流(同 0003)。
-- Pattern same as 0003/0006:RLS locked · 只走 SECURITY DEFINER · 本人只動自己 · auth.uid() 綁定。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(可重複安全)。
-- ─────────────────────────────────────────────────────

-- ── 1 · 加欄位 · confidence(可為 null · 舊資料不受影響)─────────────────
-- 信心值 = 用戶估計「我這手命中的機率」百分比。 null = 沒填(不計入校準,完全 OK)。
alter table public.predictions
  add column if not exists confidence smallint;

-- 範圍守門:1-99(0 與 100 不收 —— 沒有「絕對確定」· 守 57% 天花板的誠實基調)。
-- 三向足球可低到約 34(三選一最佳猜測)· 兩向棒球通常 ≥50 · DB 只擋極端值,UI 給合理選項。
alter table public.predictions
  drop constraint if exists predictions_confidence_range;
alter table public.predictions
  add constraint predictions_confidence_range
  check (confidence is null or (confidence between 1 and 99));

-- ── 2 · 新 RPC · set_prediction_confidence ────────────────────────────
-- 本人對「自己已押的某場」補上信心值。 一次性(confidence 仍為 null 才寫 → 已設過不覆蓋)=
-- 先鎖後結誠信(不能看了部分結果再回頭改把握)。 只動自己那一列。 沒押這場 / 已設過 → 靜默不動。
-- 跟 submit_prediction 完全分離 → 對既有押注路徑零風險。
create or replace function public.set_prediction_confidence(
  p_match_id   text,
  p_confidence smallint
)
returns table (match_id text, confidence smallint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_match text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_match := nullif(trim(coalesce(p_match_id, '')), '');
  if v_match is null then
    raise exception 'invalid_match';
  end if;

  if p_confidence is null or p_confidence < 1 or p_confidence > 99 then
    raise exception 'invalid_confidence';
  end if;

  -- 一次性寫入:只在 confidence 還是 null 時寫(已設過不覆蓋 = 先鎖後結)。
  update public.predictions p
    set confidence = p_confidence
    where p.user_id = v_uid
      and p.match_id = v_match
      and p.confidence is null;

  -- 回傳目前狀態(無論有沒有更新到)· app graceful 用 · 不報錯洗版。
  return query
    select p.match_id, p.confidence
    from public.predictions p
    where p.user_id = v_uid and p.match_id = v_match
    limit 1;
end;
$$;

revoke execute on function public.set_prediction_confidence(text, smallint) from public;
grant  execute on function public.set_prediction_confidence(text, smallint) to authenticated;

-- ── 3 · 新 RPC · get_my_calibration_picks ─────────────────────────────
-- 本人所有「有填信心值」的預測(跨場)· 給 app 端算個人校準(信心 vs 實際命中)。
-- 跟 get_my_predictions 分開(那支是押注/戰績的讀取路徑 · 一個字都不動 → 零回歸風險)。
-- 只回有 confidence 的列(校準只看有宣告把握的場)。
create or replace function public.get_my_calibration_picks()
returns table (match_id text, pick text, confidence smallint, created_at timestamptz)
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
    select p.match_id, p.pick, p.confidence, p.created_at
    from public.predictions p
    where p.user_id = v_uid and p.confidence is not null
    order by p.created_at desc;
end;
$$;

revoke execute on function public.get_my_calibration_picks() from public;
grant  execute on function public.get_my_calibration_picks() to authenticated;
