-- ── ZONE 27 · Migration 0004 · Game Posts(賽事討論室)─────
-- Created: 2026-05-30
-- Purpose: 把「賽事討論室」從 R148 的 pre-launch mockup(SAMPLE_POSTS 假資料 +
--          disabled form + BLACK CARD 付費牆)升級成 REAL · OPEN discussion。
--
--          R174 Polymarket pivot 拍板:討論「打開 —— 免費看 + 天梯名次發言」。
--          舊的「BLACK CARD 付費牆才能發言」是精品時代設定 · 大眾版 Polymarket
--          要的是網路效應 · 門檻改成「登入 + 信用(海選天梯名次)」· 不是付錢。
--          per memory/feedback_zone27_one_way_by_design.md(2026-05-30 superseded)
--          + memory/project_zone27_polymarket_pivot.md。
--
-- 法律邊界(硬守 · per memory/project_zone27_legal_redline.md):
--   · 此表 0 金額欄位 · 0 金流 · 純文字討論。 真錢只在「賣分析內容」那側走。
--   · 顯示賠率 / 討論機率 = 灰色可做(pivot 後 audience = 會下注的球迷)·
--     不再 keyword-reject 賠率/下注(那是舊精品 displacement 設定)。
--
-- 設計 same pattern as 0001 / 0002 / 0003:
--   1. RLS locked · nobody direct table access
--   2. 寫入只走 SECURITY DEFINER submit_game_post()(需登入 · 一場一篇 · ≤200字)
--   3. 讀取走 SECURITY DEFINER get_game_posts()(anon 可讀 · 免費看)
--   4. handle = user_id 衍生的不可逆短碼「球迷 #XXXX」· 0 PII · 不洩 email
--   5. 一場一人一篇(committed · anti-spam · 同 R148 constraint)
--   6. Moderation v1 = Tim 用 Supabase Studio 刪 row · in-app admin 刪文 = Phase 3
--      (需 ADMIN_EMAIL decision)· per TODO.md
-- ─────────────────────────────────────────────────────

-- ── 1 · Table ────────────────────────────────────────
create table if not exists public.game_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  game_id     text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

-- 一場一人一篇(anti-spam · 同 R148 1-post-per-game constraint)
create unique index if not exists game_posts_one_per_user_game_idx
  on public.game_posts (user_id, game_id);

-- 依 game_id 快速讀取一場的討論串
create index if not exists game_posts_game_id_idx
  on public.game_posts (game_id, created_at desc);

alter table public.game_posts enable row level security;

-- (No RLS policies = no direct access · all via SECURITY DEFINER below)

-- ── 2 · RPC · submit_game_post ───────────────────────
-- 登入 user 對一場比賽發一篇 ≤200 字討論。 失敗條件:
--   · 未登入 → 'not_logged_in'
--   · body trim 後空 或 >200 字 → 'invalid_body'
--   · 此 user 對此 game 已發過 → 'already_posted'(一場一篇)

create or replace function public.submit_game_post(
  p_game_id text,
  p_body    text
)
returns table (post_id uuid, game_id text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid  uuid;
  v_game text;
  v_body text;
  v_id   uuid;
  v_at   timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_game := nullif(trim(coalesce(p_game_id, '')), '');
  if v_game is null then
    raise exception 'invalid_game';
  end if;

  v_body := trim(coalesce(p_body, ''));
  if v_body = '' or char_length(v_body) > 200 then
    raise exception 'invalid_body';
  end if;

  if exists (
    select 1 from public.game_posts
    where user_id = v_uid and game_posts.game_id = v_game
  ) then
    raise exception 'already_posted';
  end if;

  -- ⚠️ qualify 表名:RETURNS TABLE out 欄 created_at 撞表的 created_at → 42702
  -- ambiguous(R181 同 bug · 實測 R185 確認此函式 prod 一直壞、發言其實送不出)。
  insert into public.game_posts (user_id, game_id, body)
  values (v_uid, v_game, v_body)
  returning game_posts.id, game_posts.created_at
  into v_id, v_at;

  return query select v_id, v_game, v_at;
end;
$$;

revoke execute on function public.submit_game_post(text, text) from public;
grant  execute on function public.submit_game_post(text, text) to authenticated;

-- ── 3 · RPC · get_game_posts ─────────────────────────
-- 一場的討論串 · 公開 anon 可讀(免費看)。 回 handle(不可逆短碼 · 0 PII)
-- + body + created_at · 新到舊 · 上限 100 篇。 handle = 「球迷 #」+ user_id
-- md5 前 4 碼 · 同一人在同場一致 · 但不可反推 email。

create or replace function public.get_game_posts(
  p_game_id text
)
returns table (handle text, body text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    '球迷 #' || substr(md5(p.user_id::text), 1, 4) as handle,
    p.body,
    p.created_at
  from public.game_posts p
  where p.game_id = p_game_id
  order by p.created_at desc
  limit 100;
$$;

revoke execute on function public.get_game_posts(text) from public;
grant  execute on function public.get_game_posts(text) to anon;
grant  execute on function public.get_game_posts(text) to authenticated;

-- ── 4 · RPC · get_my_game_post ───────────────────────
-- 本人讀自己對某場的留言(或 null)· 控制 UI「已發言 · 一場一篇」狀態。

create or replace function public.get_my_game_post(
  p_game_id text
)
returns table (body text, created_at timestamptz)
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
    select p.body, p.created_at
    from public.game_posts p
    where p.user_id = v_uid and p.game_id = p_game_id
    limit 1;
end;
$$;

revoke execute on function public.get_my_game_post(text) from public;
grant  execute on function public.get_my_game_post(text) to authenticated;
