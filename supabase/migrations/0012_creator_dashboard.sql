-- ── ZONE 27 · migration 0012 · 創作者後台 get_my_creator_posts ──────────
-- Tim GOLD dogfood(2026-06-05):「會員介面看不到我發了哪些文章/幾人買/有人回嗎」。
--
-- 一支 RPC 回「我自己的」所有分析 + 每篇:
--   · buyer_count  = 幾個人買了(public.creator_purchases · 0008)
--   · reply_count  = 幾則「別人」的回覆(public.creator_comments · 0010 · 排除作者自己)
-- 取代前端逐場 getMyCreatorPost 的 N 次呼叫(規模化會慢)。
--
-- 安全:SECURITY DEFINER + auth.uid() gate · 只回「呼叫者本人」的文(p.user_id = v_uid)·
--       沒登入回空。 只 grant authenticated(不給 anon · 這是私人後台)。
-- 隱私:只回「N 人買了」的『數字』· 不回買家身分(守站上 0-PII 原則 · per Tim 2026-06-05
--       未明確要露名單 → 走隱私安全預設)。
-- 防雷:① 所有欄位 qualify(p./cp./cc.)避 42702 ambiguous-column。 ② 全新 function 名 ·
--       無舊版可撞 42P13(return-type change)· 直接 create or replace 即冪等可重跑。
-- 依賴:需先套過 0005(creator_posts)· 0008(creator_purchases)· 0010(creator_comments)。
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.get_my_creator_posts()
returns table (
  post_id     uuid,
  match_id    text,
  title       text,
  pick        text,
  price_ntd   int,
  created_at  timestamptz,
  buyer_count bigint,
  reply_count bigint
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
    return; -- 沒登入 → 空(前端會藏掉整個後台 panel)
  end if;
  return query
  select
    p.id          as post_id,
    p.match_id    as match_id,
    p.title       as title,
    p.pick        as pick,
    p.price_ntd   as price_ntd,
    p.created_at  as created_at,
    (
      select count(*) from public.creator_purchases cp
      where cp.post_id = p.id
    ) as buyer_count,
    (
      select count(*) from public.creator_comments cc
      where cc.post_id = p.id and cc.user_id <> p.user_id
    ) as reply_count
  from public.creator_posts p
  where p.user_id = v_uid
  order by p.created_at desc
  limit 100;
end;
$$;

revoke execute on function public.get_my_creator_posts() from public;
revoke execute on function public.get_my_creator_posts() from anon;
grant  execute on function public.get_my_creator_posts() to authenticated;
