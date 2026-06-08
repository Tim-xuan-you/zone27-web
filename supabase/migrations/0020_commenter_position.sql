-- ── ZONE 27 · Migration 0020 · 留言者本場持倉（costly signal）──────────
-- Created: 2026-06-08 · R206
-- Purpose: soul-roadmap #5 ——「留言徽章」。 分析底下的留言串(0010)現在每個人都
--   只是一行字 = 跟報馬仔/玩運彩那種匿名嘴砲沒兩樣。 ZONE 27 的命門差異是「有帳本」:
--   如果這個留言者在**本場**自己也鎖了一注(押了不能改 · 賽後當眾對帳 · 連輸都掛),
--   那他的意見就不是嘴砲 —— 他有 skin in the game。 把這件事標出來 + 頭像連到他
--   公開的含輸戰績(/u/[code]) = 讀者一眼分得出「下了注的人」vs「只動嘴的人」。
--
-- 改動:get_creator_comments 多回兩欄(LEFT JOIN 同一張 predictions 表 0003/0018)──
--   · has_position boolean:這位留言者在本場(= 該分析掛的 match_id)有沒有鎖死的押注。
--   · position_pick text :押了哪邊('home'/'away'/'draw' · 棒球兩向、足球三向 · null=沒押)。
--   predictions 對 (user_id, match_id) 有唯一索引(0003)→ LEFT JOIN 最多配到一列 · 無 N+1。
--   押注本來就半公開(群眾市場線 aggregate + 本人 /u/[code] 攤開含輸)→ 在他自己的留言旁
--   標出來不洩新隱私 · 純點數無金流(法律邊界同 0003)。 沒押 = 不標(留白本身就是訊號)。
--
-- GRACEFUL:本檔未套用前,RPC 仍回 6 欄(無 has_position)→ 前端 hasPosition 預設 false ·
--   留言照常顯示、徽章不出現。 套用後 → 徽章自動補上(留言者不必重發)。
--   ⚠ Layer A(留言者頭像連到 /u/[code])是純前端 · 0 migration · 已先上線(這支只解鎖徽章)。
--
-- 風險/慣例(同 0015 教訓):
--   · 回傳型別「有變」(多兩欄)→ 觸發 42P13 cannot-change-return-type → 先 drop 再 create。
--   · drop 連 grants 一起清 → 重建後重設 revoke/grant(anon 可讀 · 同 0010/0015)。
--   · 全欄位 qualify 表別名(防 42702 ambiguous · 同 0003/0005/0015 的 created_at 教訓)。
-- 依賴(prod 已是這些版本):0010 creator_comments 表 · 0015 get_creator_comments(6 欄版)·
--   0003/0018 predictions 表(pick in home/away/draw)· 0015 helpers z27_*。
-- 套用:Tim 在 Supabase SQL Editor 貼整支跑一次(可重複安全 · drop-then-create 冪等)。
-- ─────────────────────────────────────────────────────

-- ── get_creator_comments · 多回 has_position + position_pick(其餘同 0015)──
drop function if exists public.get_creator_comments(uuid);
create function public.get_creator_comments(p_post_id uuid)
returns table (
  handle        text,
  author_code   text,
  display_name  text,
  is_author     boolean,
  body          text,
  created_at    timestamptz,
  has_position  boolean,
  position_pick text
)
language sql
security definer
set search_path = public
as $$
  select
    public.z27_display_handle(c.user_id)   as handle,
    public.z27_author_code(c.user_id)      as author_code,
    public.z27_display_name_raw(c.user_id) as display_name,
    (c.user_id = cp.user_id)               as is_author,
    c.body,
    c.created_at,
    -- 本場持倉:這位留言者對「該分析掛的同一場」有沒有鎖死的押注。
    -- LEFT JOIN → 沒押則 pr 為 null → has_position=false · position_pick=null(graceful)。
    (pr.id is not null)                    as has_position,
    pr.pick                                as position_pick
  from public.creator_comments c
  join public.creator_posts cp on cp.id = c.post_id
  left join public.predictions pr
    on pr.user_id = c.user_id
   and pr.match_id = cp.match_id
  where c.post_id = p_post_id
  order by c.created_at asc
  limit 200;
$$;

revoke execute on function public.get_creator_comments(uuid) from public;
grant  execute on function public.get_creator_comments(uuid) to anon;
grant  execute on function public.get_creator_comments(uuid) to authenticated;
