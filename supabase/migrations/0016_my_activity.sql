-- ── ZONE 27 · Migration 0016 · 「你的東西」· 買過的分析 + 回過的留言 ──────────
-- Created: 2026-06-05 · R201
-- Purpose: Tim 2026-06-05 dogfood 命門:「我買了人家的分析卻找不到回去看 · 我在哪
--   回過別人我也找不到 · 賽事太多了!」= 會員做完動作(買/回)就蒸發 · 找不回 =
--   點數像丟進水裡(下次不買)+ 留言像被吞掉(下次不回)= 直接傷 retention/收入。
--
--   解法:給「你做過的事」一個家。 兩支本人專屬 RPC,讓 /member 一頁列出:
--     · get_my_purchases() —— 你買過的每篇分析(可一鍵回該場重看)
--     · get_my_comments()  —— 你回過的每則留言(可一鍵回該串)
--   = Steam 書架 + Robinhood 持倉 的「你的東西隨時找得回」帳戶感(對比賭場做完即蒸發)。
--
-- 設計(same pattern · 同 0006 get_my_predictions「本人專屬」證明過的寫法):
--   · plpgsql · SECURITY DEFINER · v_uid := auth.uid() · 未登入早退回空(graceful)。
--   · 全欄位 qualify 表別名(p. / cp. / c.)防 42702 ambiguous(同 0003/0005 教訓)。
--   · 作者身分走 0015 的 z27_* helper(永久碼 + 顯示名 · 改名洗不掉)。
--   · 只 grant authenticated(本人專屬 · 不給 anon)。
-- 依賴:0015 helpers(z27_display_handle / z27_author_code / z27_display_name_raw)·
--   0008 creator_purchases · 0010 creator_comments · 0005 creator_posts(title/match_id)。
-- 都是新函式(沒有舊版可撞型別)· create or replace 冪等可重跑。
-- ─────────────────────────────────────────────────────

-- ── 0 · index · 本人查詢用(buyer_id / user_id 過濾 + created_at 排序)──────────
-- 0008/0010 原本只建了 post 維度的 index;這兩支 RPC 走 buyer_id / user_id 過濾 →
-- 補 composite(過濾欄 + created_at desc)避免未來規模化 seq scan。 if not exists 冪等。
create index if not exists creator_purchases_buyer_idx
  on public.creator_purchases (buyer_id, created_at desc);
create index if not exists creator_comments_user_idx
  on public.creator_comments (user_id, created_at desc);

-- ── 1 · get_my_purchases · 本人買過的分析(新到舊)──────────────
-- 回足夠「找回去重看」+「想起跟誰買的」:標題 + 該場 match_id + 作者(永久碼/顯示名)
-- + 推薦邊 + 價格 + 購買時間。 body 不在這回(重看走該場 get_creator_posts · 已 gate 解鎖)。
create or replace function public.get_my_purchases()
returns table (
  post_id      uuid,
  match_id     text,
  title        text,
  handle       text,
  author_code  text,
  display_name text,
  pick         text,
  price_ntd    int,
  purchased_at timestamptz
)
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
    select
      p.id                                   as post_id,
      p.match_id                             as match_id,
      p.title                                as title,
      public.z27_display_handle(p.user_id)   as handle,
      public.z27_author_code(p.user_id)      as author_code,
      public.z27_display_name_raw(p.user_id) as display_name,
      p.pick                                 as pick,
      p.price_ntd                            as price_ntd,
      cp.created_at                          as purchased_at
    from public.creator_purchases cp
    join public.creator_posts p on p.id = cp.post_id
    where cp.buyer_id = v_uid
    order by cp.created_at desc
    limit 200;
end;
$$;

revoke execute on function public.get_my_purchases() from public;
grant  execute on function public.get_my_purchases() to authenticated;

-- ── 2 · get_my_comments · 本人回過的留言(新到舊)──────────────
-- 回足夠「找回那串對話」:留言本體 + 它在哪篇分析(post_title)+ 那篇在哪場(match_id)
-- + 留言時間。 連回 /matches/{match_id}#say 就能看到整串。
create or replace function public.get_my_comments()
returns table (
  comment_id uuid,
  post_id    uuid,
  match_id   text,
  post_title text,
  body       text,
  created_at timestamptz
)
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
    select
      c.id         as comment_id,
      c.post_id    as post_id,
      p.match_id   as match_id,
      p.title      as post_title,
      c.body       as body,
      c.created_at as created_at
    from public.creator_comments c
    join public.creator_posts p on p.id = c.post_id
    where c.user_id = v_uid
    order by c.created_at desc
    limit 200;
end;
$$;

revoke execute on function public.get_my_comments() from public;
grant  execute on function public.get_my_comments() to authenticated;
