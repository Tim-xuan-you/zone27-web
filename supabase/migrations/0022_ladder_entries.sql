-- ── ZONE 27 · Migration 0022 · 海選天梯地基(跨用戶準度榜)──────────────
-- Created: 2026-06-11
-- Purpose: 開「海選天梯」—— 把每個人公開的押注帳本跨用戶聚合成一張「誰比機器準」的榜。
--   讀「現成」資料(0003 predictions 表)· 比對與排名全在 app 端算(賽果與引擎開盤線在
--   程式碼裡、不在 DB)→ 這支只負責「把所有人的押注一次撈出來、附上公開署名」。
--   0 用戶就成立:榜空 → /ladder 維持「王座上只有機器」優雅空榜(不假裝熱鬧、不上空榜)。
--
-- 🔴 安全姿態(重要):100% 純加法 —— 只「新增」一支讀取函式 · 完全不碰
--    submit_prediction / get_my_predictions / get_match_prediction_tally /
--    get_predictions_by_code · 既有押注 / 市場線 / 公開檔一律照常運作 · 可重複安全跑。
--
-- 隱私模型(同 0019 公開檔 · 不新增 PII 外洩):
--   · 只回「本就公開」的東西 —— 永久碼(公開署名 key · 創作者/公開檔早就用它)+ 公開顯示
--     handle(預設匿名「球迷 #碼」· 只有會員自己 opt-in 設了顯示名才露名)+ 押注
--     (match_id / pick / 時戳)。 0 email · 0 其他 PII。
--   · 原始逐筆押注只在 server 端被聚合成「榜」· app 不把它逐筆送到瀏覽器(只送算好的名次)。
--
-- 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額欄位 · 0 金流。
--
-- 設計(同 0019):predictions 表維持 RLS-locked · 一支 SECURITY DEFINER 函式 · anon 可讀
--   (公開海選 = 品牌核心 disclosure)· 全欄位 qualify 表別名(防 42702 ambiguous · 同
--   0003/0019 教訓)· create or replace 冪等可重跑。 helper z27_author_code /
--   z27_display_handle(0014/0015)已存在,本檔不重建,只新增一支讀取函式。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(可重複安全)。
-- ─────────────────────────────────────────────────────

-- ── get_ladder_entries · 跨用戶撈所有押注 + 公開署名(海選榜的唯一資料來源)──────
-- 回所有人的押注 · 每列附上該員的永久碼 + 公開 handle · app 端按永久碼分組 → 各自套
-- aggregateIdentity 算準度/贏不贏引擎 → 排名 + 套門檻(≥10 場、≥N 人才上榜)。
-- 刻意「不回 confidence」:天梯排名不吃信心值(那是 /member 校準大師的料)· 不選它 →
--   本檔對 0021 零依賴、套用順序不挑(任何順序跑都安全 · 只靠 0003 表 + 0014/0015 helper)。
-- 效能備忘(未來再優化 · 早期不急):z27_display_handle 會逐列查 auth.users · 資料量大時改成
--   「只對上榜 ≤100 人解 handle」(app 端二次解析)· 現在 ISR 每小時一打 + 列數少 = 無感。
-- limit 防爆(早期規模綽綽有餘)。
create or replace function public.get_ladder_entries()
returns table (
  author_code text,
  handle      text,
  match_id    text,
  pick        text,
  created_at  timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    public.z27_author_code(p.user_id)    as author_code,
    public.z27_display_handle(p.user_id)  as handle,
    p.match_id,
    p.pick,
    p.created_at
  from public.predictions p
  order by p.created_at desc
  limit 100000;
$$;

revoke execute on function public.get_ladder_entries() from public;
grant  execute on function public.get_ladder_entries() to anon;
grant  execute on function public.get_ladder_entries() to authenticated;
