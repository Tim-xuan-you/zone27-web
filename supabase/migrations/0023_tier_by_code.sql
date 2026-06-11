-- ── ZONE 27 · Migration 0023 · 用永久碼查付費身分(看得見的支持者標記)──────
-- Created: 2026-06-11
-- Purpose: 讓公開檔 /u/[code](以及未來的創作者署名 / 留言 / 天梯)能顯示「這個人是
--   付費支持者(BLACK / GOLD)」的低調金環 —— 把「付費身分」從只有自己看得到,變成
--   別人也看得見 = 真正讓人想戴的那一下。 回答「引擎全免費,為什麼還要付費」:你買的是
--   一個看得見的身分 + 養活開放引擎,不是買功能。
--
--   🔴 紅線:這標記是「贊助開放引擎」的身分,**不是準度**。 app 端永不把它跟校準/勝率
--   混在一起、永不暗示「付費比較準」(守 57% 誠實王牌)。 視覺上永遠次於校準大數字。
--
-- 🔴 安全姿態:100% 純加法 —— 只「新增」一支讀取函式 · 完全不碰 get_profile_by_code /
--    get_predictions_by_code / 任何既有函式或表 · 可重複安全跑。 對 0021/0022 零依賴。
--
-- 隱私模型(同 0019):tier 存在 auth.users.raw_user_meta_data.tier(手動轉帳入帳後 Tim
--   在 Supabase Studio 標 · 0 auto-charge)· 只回 'black'/'founder'/''(免費)· 0 email、
--   0 其他 PII。 永久碼本就公開(公開檔/署名早在用)· 多回一個「是不是付費支持者」不增 PII。
--
-- 設計同 0019:SECURITY DEFINER 讀 auth.users · anon 可讀 · 全欄位 qualify · 冪等可重跑。
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN(可重複安全)。
-- ─────────────────────────────────────────────────────

-- get_tier_by_code · 回該碼對應使用者(最早註冊者 · 同 get_profile_by_code 取法)的付費 tier。
-- 'black' | 'founder' = 付費支持者;'' = 免費 / 無 / 查無此碼(app 端一律當免費 · 不顯示金環)。
create or replace function public.get_tier_by_code(p_code text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(u.raw_user_meta_data ->> 'tier', '')
  from auth.users u
  where substr(md5(u.id::text), 1, 8) = lower(trim(p_code))
  order by u.created_at asc
  limit 1;
$$;

revoke execute on function public.get_tier_by_code(text) from public;
grant  execute on function public.get_tier_by_code(text) to anon;
grant  execute on function public.get_tier_by_code(text) to authenticated;
