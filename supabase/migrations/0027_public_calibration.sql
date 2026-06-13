-- ── ZONE 27 · Migration 0027 · 把「個人校準曲線」搬上公開檔 /u ──────────────────
-- Created: 2026-06-13 · R231 「Polymarket go」(承接窗)
-- Purpose: 0021 已讓會員押注時宣告「幾成把握」(confidence)· /member 的校準大師卡也已把
--   「你說 8 成的場、真的中 8 成嗎」攤給本人看。 但公開檔 /u 的 RPC(get_predictions_by_code ·
--   0019)只回 match_id / pick / created_at —— **不回 confidence** → 公開檔做不出校準曲線。
--   這支補上:讓公開檔也能畫「信心桶 vs 實際命中率」= Metaculus / FiveThirtyEight「Checking
--   Our Work」的個人公開版 = 報馬仔最不敢攤的東西(他只喊「篤定」· 我們把「說的把握 vs 真的中」
--   逐桶公開、含輸照算)。 這是「賭徒的 Bloomberg Terminal」最重的一塊信任護城河。
--
-- 做法:get_predictions_by_code 多回一欄 confidence(0021 已加的欄)· 其餘口徑不動。
--
-- 🔴 安全 / 隱私姿態(同 0019 / 0026):
--   · 純加法 —— returns table 多一欄 confidence。 ⚠️ 改 returns table 形狀必須先 drop function
--     再建(否則 Postgres 42P13「cannot change return type」· 同 0013/0020/0026 慣例)· drop-if-exists
--     仍冪等可重貼。 完全不碰 submit_prediction / set_prediction_confidence / get_my_*。
--   · confidence 是「opt-in 才有值」(沒宣告 = null)· 且只是「對一個本就公開的 pick 宣告的機率」=
--     比自由文字理由(0026)更不敏感(是個數字、不是私密心事)· 故不清舊資料(都是真校準料、非垃圾)。
--     ConfidencePicker 文案已同步點明「賽後公開攤開」= 知情。 只回本就公開的(碼/pick/把握)· 0 PII。
--
-- 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額 · 0 金流。
--
-- 套用:在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(drop+建 · 冪等可重貼 · 同 0024-0026)。
-- ─────────────────────────────────────────────────────

-- get_predictions_by_code · 某公開碼的所有押注 + 賽前宣告的把握(多 confidence 一欄)。
-- 🔴 先 drop 再建:returns table 多一欄 = 形狀變了(同 0026 的 get_ladder_entries)。
drop function if exists public.get_predictions_by_code(text);
create or replace function public.get_predictions_by_code(p_code text)
returns table (
  match_id    text,
  pick        text,
  confidence  smallint,
  created_at  timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select p.match_id, p.pick, p.confidence, p.created_at
  from public.predictions p
  where substr(md5(p.user_id::text), 1, 8) = lower(trim(p_code))
  order by p.created_at desc
  limit 5000;
$$;

revoke execute on function public.get_predictions_by_code(text) from public;
grant  execute on function public.get_predictions_by_code(text) to anon;
grant  execute on function public.get_predictions_by_code(text) to authenticated;
