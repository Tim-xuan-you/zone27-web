-- ── ZONE 27 · Migration 0007 · Creator Records(作者公開戰績)──────
-- Created: 2026-06-01
-- Purpose: 讓「每篇分析旁邊,作者有多準」一眼可見 —— 玩運彩/報馬仔讓 tipster
--          掛「近 N 日 X 過 Y」當招牌賣明牌;ZONE 27 做誠實版:撈出每位創作者
--          鎖過的所有 (handle, match_id, pick) · app-side 對 finalResult 自動評
--          準/不準 → 算每人命中率 + 海選天梯名次。
--
--          差別(displacement weapon · per memory/project_zone27_polymarket_pivot):
--            報馬仔挑「近 15 天好看的窗」+ 輸了刪文藏戰績;這支 RPC 全撈、不挑窗、
--            連輸的都算 · 押的邊賽前鎖死(0003/0005)· 賴不掉。
--
-- 法律邊界(per memory/project_zone27_legal_redline):
--   · 0 金額欄位 · 0 PII(handle = md5 短碼 · 跟 get_creator_posts 同格式可對應)·
--     純精神預測準度 · 不碰真錢紅線。
--
-- 設計 same pattern as 0005 get_creator_posts:RLS-locked 表 · SECURITY DEFINER ·
--   anon 可讀(公開戰績 = 品牌核心 disclosure)· 所有欄位 qualify 表別名 p.(避免
--   42702 ambiguous · 同 0003/0005 的 created_at 教訓)。
-- ─────────────────────────────────────────────────────

-- 回傳所有創作者鎖過的選邊 · anon 可讀 · app 端 grade vs finalResult。
-- handle 格式跟 0005 get_creator_posts 完全一致(可在前端用 handle 對應)。
create or replace function public.get_creator_records()
returns table (handle text, match_id text, pick text)
language sql
security definer
set search_path = public
as $$
  select
    '球迷 #' || substr(md5(p.user_id::text), 1, 8) as handle,
    p.match_id,
    p.pick
  from public.creator_posts p
  order by p.created_at desc
  limit 2000;
$$;

revoke execute on function public.get_creator_records() from public;
grant  execute on function public.get_creator_records() to anon;
grant  execute on function public.get_creator_records() to authenticated;
