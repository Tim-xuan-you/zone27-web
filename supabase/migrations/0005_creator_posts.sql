-- ── ZONE 27 · Migration 0005 · Creator Analysis Posts(創作者賣分析)──
-- Created: 2026-05-30
-- Purpose: Polymarket pivot 第 5 根支柱「創作者賣分析」的 backend。 Tim 2026-05-30
--          screenshot 報馬仔/明燈平台 + 明確要:創作者「發文 + 推薦賽事(選邊)+
--          寫分析 + 賣文章」· 賽後自動評勝敗。 per memory/project_zone27_polymarket_pivot.md。
--
--          ZONE 27 版的差別(displacement weapon):報馬仔輸了刪文藏戰績 · 這裡
--          創作者押的邊「賽前鎖死 + 賽後自動掛準/不準 + 刪不掉」= 賴不掉的戰績。
--          每篇分析綁一個 match + 一個 pick(home/away)· app-side 對 finalResult
--          自動 grade。 創作者準度 = 海選天梯名次(/ladder)。
--
-- 法律邊界(per memory/project_zone27_legal_redline.md):
--   · 賣的是「分析內容」訂閱/單篇傭金(灰色可做)· 不是賭注抽傭(紅線)。
--   · price_ntd 欄位 ready · 但「購買=手動銀行轉帳」flow 是 Phase 2(需 Tim 提供
--     收款帳戶到 Vercel 私密 env · 碰真錢上線前找律師)。 v1 全免費(price 0)。
--
-- 設計 same pattern as 0003 / 0004:RLS locked · SECURITY DEFINER RPCs · handle
--   = user_id md5 短碼(0 PII)· 一場一人一篇(anti-spam)。
-- ─────────────────────────────────────────────────────

create table if not exists public.creator_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  match_id    text not null,
  title       text not null,
  body        text not null,
  pick        text not null check (pick in ('home', 'away')),
  price_ntd   int  not null default 0 check (price_ntd >= 0), -- 0=免費 · >0=賣(購買 flow = Phase 2)
  created_at  timestamptz not null default now()
);

create unique index if not exists creator_posts_one_per_user_match_idx
  on public.creator_posts (user_id, match_id);

create index if not exists creator_posts_match_id_idx
  on public.creator_posts (match_id, created_at desc);

create index if not exists creator_posts_user_id_idx
  on public.creator_posts (user_id, created_at desc);

alter table public.creator_posts enable row level security;

-- ── submit_creator_post ──────────────────────────────
-- 登入 · 一場一篇 · title ≤80 · body ≤2000 · pick home/away · price≥0
create or replace function public.submit_creator_post(
  p_match_id text,
  p_title    text,
  p_body     text,
  p_pick     text,
  p_price    int
)
returns table (post_id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid;
  v_match text;
  v_title text;
  v_body  text;
  v_price int;
  v_id    uuid;
  v_at    timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_match := nullif(trim(coalesce(p_match_id, '')), '');
  if v_match is null then
    raise exception 'invalid_match';
  end if;

  v_title := trim(coalesce(p_title, ''));
  if v_title = '' or char_length(v_title) > 80 then
    raise exception 'invalid_title';
  end if;

  v_body := trim(coalesce(p_body, ''));
  if v_body = '' or char_length(v_body) > 2000 then
    raise exception 'invalid_body';
  end if;

  if p_pick is null or p_pick not in ('home', 'away') then
    raise exception 'invalid_pick';
  end if;

  -- 🔒 安全(碼審 MEDIUM):server 端夾上限。 前端 max=2000 只是 client cap ·
  --    直接拿 anon key 打這支可塞 int max(→「🔒 NT$ 2147483647」破 UI / 溢位)。
  --    夾在 0–10000(高於前端 2000 的寬鬆天花板 · 防荒謬值)。
  v_price := least(10000, greatest(0, coalesce(p_price, 0)));

  if exists (
    select 1 from public.creator_posts
    where user_id = v_uid and creator_posts.match_id = v_match
  ) then
    raise exception 'already_posted';
  end if;

  insert into public.creator_posts (user_id, match_id, title, body, pick, price_ntd)
  values (v_uid, v_match, v_title, v_body, p_pick, v_price)
  returning id, creator_posts.created_at
  into v_id, v_at;

  return query select v_id, v_at;
end;
$$;

revoke execute on function public.submit_creator_post(text, text, text, text, int) from public;
grant  execute on function public.submit_creator_post(text, text, text, text, int) to authenticated;

-- ── get_creator_posts ────────────────────────────────
-- 一場的創作者分析 · anon 可讀 · handle + title + body + pick + price + created_at。
-- v1 全免費 · body 直接回。 Phase 2 selling:price_ntd>0 時 body gated until purchased。
create or replace function public.get_creator_posts(
  p_match_id text
)
returns table (handle text, title text, body text, pick text, price_ntd int, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    '球迷 #' || substr(md5(p.user_id::text), 1, 8) as handle,
    p.title,
    p.body,
    p.pick,
    p.price_ntd,
    p.created_at
  from public.creator_posts p
  where p.match_id = p_match_id
  order by p.created_at desc
  limit 50;
$$;

revoke execute on function public.get_creator_posts(text) from public;
grant  execute on function public.get_creator_posts(text) to anon;
grant  execute on function public.get_creator_posts(text) to authenticated;

-- ── get_my_creator_post ──────────────────────────────
-- 本人對某場的分析(控制 UI「一場一篇」state)
create or replace function public.get_my_creator_post(
  p_match_id text
)
returns table (title text, body text, pick text)
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
    select p.title, p.body, p.pick
    from public.creator_posts p
    where p.user_id = v_uid and p.match_id = p_match_id
    limit 1;
end;
$$;

revoke execute on function public.get_my_creator_post(text) from public;
grant  execute on function public.get_my_creator_post(text) to authenticated;
