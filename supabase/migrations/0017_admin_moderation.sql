-- ── ZONE 27 · Migration 0017 · 後台審核看全文 + 刪除留痕 ──────────────
-- Created: 2026-06-05 · R201
-- Purpose: Tim「我審核時看不到全文(尤其付費分析只給標題40字)· 怎麼判斷該不該刪?」
--   0011 的 admin_recent_content 只回 left(...,40) snippet → 讀不到完整內容 = 無法審核。
--   大公司(Substack/Patreon/Apple)後台都看得到所有內容含付費(執行政策+法規必要)·
--   ZONE 27 的靈魂版 = 看得到 + 但「公開揭露 + 刪除留痕」(不做秘密上帝視角)。
--
-- 三件:
--   1. admin_view_content(kind,id) → 回完整內文(含付費分析 body · admin override 付費牆)。
--   2. admin_audit 表 → 每次刪除留痕(誰/何時/刪什麼/原因/被刪內容快照)。
--   3. admin_delete_logged(kind,id,reason) → 先寫 audit 再刪(取代裸 admin_delete · 留痕)。
--
-- 全 is_admin() gate(同 0011)· SECURITY DEFINER · 只 grant authenticated(函式內把關)。
-- 依賴:0011(is_admin / app_admins)· 0005 creator_posts · 0010 creator_comments · 0004 game_posts。
-- 新函式/新表 · create or replace / if not exists 冪等可重跑。
-- ─────────────────────────────────────────────────────

-- ── 1 · admin_view_content · 看完整內文(含付費 · 審核用)──────────────
create or replace function public.admin_view_content(p_kind text, p_id uuid)
returns table (
  kind       text,
  id         uuid,
  handle     text,
  title      text,
  body       text,
  ref        text,
  price_ntd  int,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_kind = 'creator_post' then
    return query
      select 'creator_post'::text, p.id,
             ('球迷 #' || substr(md5(p.user_id::text), 1, 8))::text,
             p.title, p.body, p.match_id, p.price_ntd, p.created_at
      from public.creator_posts p where p.id = p_id;
  elsif p_kind = 'creator_comment' then
    return query
      select 'creator_comment'::text, c.id,
             ('球迷 #' || substr(md5(c.user_id::text), 1, 8))::text,
             null::text, c.body, c.post_id::text, null::int, c.created_at
      from public.creator_comments c where c.id = p_id;
  elsif p_kind = 'game_post' then
    return query
      select 'game_post'::text, g.id,
             ('球迷 #' || substr(md5(g.user_id::text), 1, 8))::text,
             null::text, g.body, g.game_id, null::int, g.created_at
      from public.game_posts g where g.id = p_id;
  else
    raise exception 'invalid_kind';
  end if;
end; $$;

revoke execute on function public.admin_view_content(text, uuid) from public;
grant  execute on function public.admin_view_content(text, uuid) to authenticated;

-- ── 2 · admin_audit · 刪除留痕表(誰/何時/刪什麼/原因/快照)──────────────
create table if not exists public.admin_audit (
  id             uuid primary key default gen_random_uuid(),
  admin_id       uuid not null references auth.users(id) on delete cascade,
  action         text not null,
  target_kind    text,
  target_id      uuid,
  target_snippet text,        -- 被刪內容快照(刪了還查得到刪了什麼)
  reason         text,
  created_at     timestamptz not null default now()
);
create index if not exists admin_audit_created_idx on public.admin_audit (created_at desc);
alter table public.admin_audit enable row level security;
-- (No RLS policies = 無直接存取 · 只走下方 SECURITY DEFINER admin RPC)

-- ── 3 · admin_delete_logged · 先留痕再刪(取代裸 admin_delete)──────────────
create or replace function public.admin_delete_logged(
  p_kind text, p_id uuid, p_reason text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid  uuid;
  v_snip text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  v_uid := auth.uid();

  if p_kind = 'creator_post' then
    select left(coalesce(p.title, '') || ' / ' || coalesce(p.body, ''), 240)
      into v_snip from public.creator_posts p where p.id = p_id;
    delete from public.creator_posts where id = p_id;
  elsif p_kind = 'creator_comment' then
    select left(coalesce(c.body, ''), 240)
      into v_snip from public.creator_comments c where c.id = p_id;
    delete from public.creator_comments where id = p_id;
  elsif p_kind = 'game_post' then
    select left(coalesce(g.body, ''), 240)
      into v_snip from public.game_posts g where g.id = p_id;
    delete from public.game_posts where id = p_id;
  else
    raise exception 'invalid_kind';
  end if;

  insert into public.admin_audit (admin_id, action, target_kind, target_id, target_snippet, reason)
    values (v_uid, 'delete', p_kind, p_id, v_snip,
            nullif(trim(coalesce(p_reason, '')), ''));
  return true;
end; $$;

revoke execute on function public.admin_delete_logged(text, uuid, text) from public;
grant  execute on function public.admin_delete_logged(text, uuid, text) to authenticated;

-- ── 4 · admin_audit_recent · 看最近審核紀錄(透明 · 自己對自己留痕)──────────
create or replace function public.admin_audit_recent()
returns table (action text, target_kind text, target_snippet text, reason text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select a.action, a.target_kind, a.target_snippet, a.reason, a.created_at
    from public.admin_audit a
    order by a.created_at desc
    limit 50;
end; $$;

revoke execute on function public.admin_audit_recent() from public;
grant  execute on function public.admin_audit_recent() to authenticated;
