-- ── ZONE 27 · Migration 0006 · get_my_predictions ─────
-- Created: 2026-05-31
-- Purpose: 接通「押注 → 個人準度」迴路。
--   問題:賽事頁 UserPredictionPicker 把 picks 寫進 0003 predictions 表,
--         但 /member 儀表板還在讀舊的 user_metadata(lib/predictions.ts)→
--         球迷在賽事頁押了一邊,回儀表板看不到自己累積的準度 = retention
--         迴路斷(押完就斷線 · 不會回訪 · 直接傷訂閱轉換)。
--   解法:加一個 RPC 撈「本人所有 picks(跨場)」· /member app-side 對
--         lib/matches.ts 的 finalResult grade 算累積準度(grade 在 app-side ·
--         比賽結果不在 DB)。
--
-- 法律邊界不變:純精神預測 · 0 金額 · 0 金流(同 0003)。
-- Pattern same as 0003:RLS locked · 只走 SECURITY DEFINER · 本人只讀自己 ·
-- auth.uid() 綁定 · 0 PII broadcast。
-- ─────────────────────────────────────────────────────

-- ── RPC · get_my_predictions ─────────────────────────
-- 本人讀自己所有預測(跨場 · newest first)。未登入回空集合。
-- 對齊 get_my_prediction(單場)· 升級成跨場 = /member 累積準度的資料源。

create or replace function public.get_my_predictions()
returns table (match_id text, pick text, created_at timestamptz)
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
    select p.match_id, p.pick, p.created_at
    from public.predictions p
    where p.user_id = v_uid
    order by p.created_at desc;
end;
$$;

revoke execute on function public.get_my_predictions() from public;
grant  execute on function public.get_my_predictions() to authenticated;
