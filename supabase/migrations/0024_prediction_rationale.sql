-- ── ZONE 27 · Migration 0024 · 押注理由 / 一句你為什麼看好(賽前鎖死的 thesis)──────
-- Created: 2026-06-11
-- Purpose: 讓會員押注時順手寫一句「我為什麼看好這一手」—— 賽前鎖死、改不了。
--          這是 Polymarket / Manifold 那種「不只押一邊,還把你的論點公開壓上去」的 DNA:
--          對一個賣「誠實對帳」的品牌,公開且鎖死的『理由』比單純選邊更重的 costly signal
--          (報馬仔事後才編故事;我們賽前就把話講死、賽後攤開看打不打臉)。 也讓單場收據從
--          「我押了 X」升級成「我押了 X,因為 Y —— 開賽前就鎖了」= 更會被截圖外傳的東西。
--
-- 🔴 安全姿態(同 0021 · 重要):本 migration **100% 純加法** —— 只「新增」一個欄位 + 兩個新
--    函式,**完全不碰** submit_prediction / get_my_predictions / get_match_prediction_tally /
--    set_prediction_confidence。 就算這支有任何問題,現有押注/戰績/市場線/校準一律照常運作。
--    可重複安全跑(idempotent)。
--
-- 法律邊界不變:純精神預測 · 0 金額 · 0 金流(同 0003)。
-- Pattern same as 0021:RLS locked · 只走 SECURITY DEFINER · set search_path · 本人只動自己 ·
-- auth.uid() 綁定 · 一次性寫入(先鎖後結 · 設過不覆蓋)。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(可重複安全)。
-- ─────────────────────────────────────────────────────

-- ── 1 · 加欄位 · rationale(可為 null · 舊資料不受影響)─────────────────
-- 一句話的理由(選填)。 null = 沒寫(完全 OK · 不強迫)。
alter table public.predictions
  add column if not exists rationale text;

-- 長度守門:1–200 字(一句話、不是一篇文 —— 逼出精煉的論點 · 也擋超長濫用/儲存爆量)。
-- 空字串視同沒寫(由寫入函式 trim → null,這裡只擋已寫入值的長度上限)。
alter table public.predictions
  drop constraint if exists predictions_rationale_len;
alter table public.predictions
  add constraint predictions_rationale_len
  check (rationale is null or char_length(rationale) between 1 and 200);

-- ── 2 · 新 RPC · set_prediction_rationale ─────────────────────────────
-- 本人對「自己已押的某場」補上一句理由。 一次性(rationale 仍為 null 才寫 → 設過不覆蓋)=
-- 先鎖後結誠信(不能看了部分結果再回頭改說法)。 trim 後超過 200 字截斷(不報錯洗版)。
-- 只動自己那一列。 沒押這場 / 已寫過 → 靜默不動。 跟 submit_prediction 完全分離 = 零風險。
create or replace function public.set_prediction_rationale(
  p_match_id   text,
  p_rationale  text
)
returns table (match_id text, rationale text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_match text;
  v_text text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_match := nullif(trim(coalesce(p_match_id, '')), '');
  if v_match is null then
    raise exception 'invalid_match';
  end if;

  -- 去頭尾空白 · 空 → 視同沒寫(不寫入)· 超過 200 字截斷(防爆量 · 不報錯)。
  v_text := nullif(trim(coalesce(p_rationale, '')), '');
  if v_text is null then
    raise exception 'empty_rationale';
  end if;
  v_text := left(v_text, 200);

  -- 一次性寫入:只在 rationale 還是 null 時寫(設過不覆蓋 = 先鎖後結)。
  update public.predictions p
    set rationale = v_text
    where p.user_id = v_uid
      and p.match_id = v_match
      and p.rationale is null;

  -- 回傳目前狀態(無論有沒有更新到)· app graceful 用。
  return query
    select p.match_id, p.rationale
    from public.predictions p
    where p.user_id = v_uid and p.match_id = v_match
    limit 1;
end;
$$;

revoke execute on function public.set_prediction_rationale(text, text) from public;
grant  execute on function public.set_prediction_rationale(text, text) to authenticated;

-- ── 3 · 新 RPC · get_my_rationales ────────────────────────────────────
-- 本人所有「有寫理由」的預測(跨場)· 給收據島蓋上「你賽前寫的理由」。
-- 跟 get_my_predictions / get_my_calibration_picks 分開(那些一個字不動 → 零回歸風險)。
create or replace function public.get_my_rationales()
returns table (match_id text, rationale text)
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
    select p.match_id, p.rationale
    from public.predictions p
    where p.user_id = v_uid and p.rationale is not null;
end;
$$;

revoke execute on function public.get_my_rationales() from public;
grant  execute on function public.get_my_rationales() to authenticated;
