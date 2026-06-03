-- ── ZONE 27 · Migration 0008 · 賣分析「買了才解鎖」(creator_purchases)──
-- Created: 2026-06-01
-- Purpose: 把「創作者賣分析、平台抽傭」做成誠實版(同 玩運彩 高手賣預測流程,
--          但乾淨)。 付費分析的「完整內文」賽前不進公開 payload —— 只有
--          免費文 / 作者本人 / 已購買者 拿得到 body。 標題 + 推薦哪一邊 +
--          作者準度 badge 永遠公開(讓讀者決定買不買)= 賣得出去的前提
--          (內文不鎖好 = 一貼出去就被複製,沒人會買)。
--
--          購買 v1 = 手動(同會員轉帳模式):買家轉帳 → Tim 在 Supabase Studio
--          記一筆 creator_purchases(buyer_id, post_id)→ 買家刷新即解鎖。
--          0 自動金流 · 0 公司必要(小規模 = 個人所得)· 規模化真錢 payout
--          才要公司 + 會計 + 發票(per memory/zone27-legal-redline 🏢 段)。
--
-- 法律邊界(per memory/zone27-legal-redline):賣的是「分析內容」(Substack 式)·
--   0 賠率 · 0 簽賭明牌 · 不接賭注 · 不抽賭注傭。 點數市場(0003)維持 0 金錢。
--
-- 設計 same pattern as 0005:RLS-locked · SECURITY DEFINER · 全欄位 qualify
--   表別名(p. / cp.)防 42702 ambiguous(同 0003/0005 created_at 教訓)。
-- ─────────────────────────────────────────────────────

-- ── 1 · 購買紀錄表 ────────────────────────────────────
create table if not exists public.creator_purchases (
  id         uuid primary key default gen_random_uuid(),
  buyer_id   uuid not null references auth.users(id) on delete cascade,
  post_id    uuid not null references public.creator_posts(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 一人一篇一次(防重複記帳)
create unique index if not exists creator_purchases_one_per_buyer_post_idx
  on public.creator_purchases (buyer_id, post_id);

alter table public.creator_purchases enable row level security;
-- (No RLS policies = 無直接存取 · 全走下方 SECURITY DEFINER)

-- ── 2 · get_creator_posts 升級 · 付費未購 → body 不回 ──
-- 回傳欄位新增 post_id / is_paid / purchased → 改了 return shape · 先 drop 再 create。
-- body gating:免費(price=0)/ 作者本人 / 已購買者 → 回完整 body;其餘 → null。
drop function if exists public.get_creator_posts(text);
create or replace function public.get_creator_posts(p_match_id text)
returns table (
  post_id    uuid,
  handle     text,
  title      text,
  body       text,
  pick       text,
  price_ntd  int,
  created_at timestamptz,
  is_paid    boolean,
  purchased  boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  return query
  select
    p.id as post_id,
    '球迷 #' || substr(md5(p.user_id::text), 1, 8) as handle,
    p.title,
    case
      when p.price_ntd = 0 then p.body
      when v_uid = p.user_id then p.body
      when v_uid is not null and exists (
        select 1 from public.creator_purchases cp
        where cp.post_id = p.id and cp.buyer_id = v_uid
      ) then p.body
      else null
    end as body,
    p.pick,
    p.price_ntd,
    p.created_at,
    (p.price_ntd > 0) as is_paid,
    (
      v_uid is not null and (
        v_uid = p.user_id or exists (
          select 1 from public.creator_purchases cp
          where cp.post_id = p.id and cp.buyer_id = v_uid
        )
      )
    ) as purchased
  from public.creator_posts p
  where p.match_id = p_match_id
  order by p.created_at desc
  limit 50;
end;
$$;

revoke execute on function public.get_creator_posts(text) from public;
grant  execute on function public.get_creator_posts(text) to anon;
grant  execute on function public.get_creator_posts(text) to authenticated;
