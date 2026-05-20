-- ── ZONE 27 · Migration 0001 · Founders 27 Waitlist ────
-- Created: 2026-05-20
-- Purpose: Replace Vercel-logs-based waitlist with proper DB persistence.
--
-- Design notes:
--   1. RLS is locked down — nobody (not even anon) gets direct table access.
--   2. All writes go through `reserve_waitlist_spot()` (security definer
--      function) that validates email + dedupes + returns queue position.
--   3. All reads go through `get_waitlist_count()` (aggregate-only) — anon
--      cannot enumerate emails, names, or timestamps.
--   4. This matches the /privacy promise: anon cannot exfiltrate waitlist
--      data even if the publishable key leaks. Service_role bypasses RLS
--      and is the only path to bulk reads (Supabase Studio + future /admin).
-- ─────────────────────────────────────────────────────

-- ── 1 · Table ─────────────────────────────────────────
create table if not exists public.waitlist (
  id              uuid primary key default gen_random_uuid(),
  queue_position  bigint generated always as identity unique,
  email           text not null unique,
  name            text,
  source          text,
  created_at      timestamptz not null default now()
);

create index if not exists waitlist_email_idx on public.waitlist (email);

alter table public.waitlist enable row level security;

-- (No RLS policies = no direct access for anon/authenticated.
--  All access goes through the security-definer functions below.)

-- ── 2 · RPC · reserve_waitlist_spot ───────────────────
-- Insert a new email or return existing queue position if duplicate.
-- Email validation lives here too — matches the regex in lib/waitlist.ts.

create or replace function public.reserve_waitlist_spot(
  p_email  text,
  p_name   text default null,
  p_source text default null
)
returns table (queue_position bigint, was_existing boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email             text;
  v_name              text;
  v_source            text;
  v_existing_position bigint;
  v_new_position      bigint;
begin
  if p_email is null then
    raise exception 'missing_email';
  end if;

  v_email := lower(trim(p_email));

  if v_email = '' then
    raise exception 'missing_email';
  end if;

  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$' then
    raise exception 'invalid_email';
  end if;

  v_name   := nullif(trim(coalesce(p_name,   '')), '');
  v_source := nullif(trim(coalesce(p_source, '')), '');

  select w.queue_position
    into v_existing_position
    from public.waitlist w
   where w.email = v_email
   limit 1;

  if v_existing_position is not null then
    return query select v_existing_position, true;
    return;
  end if;

  insert into public.waitlist (email, name, source)
  values (v_email, v_name, v_source)
  returning public.waitlist.queue_position
  into v_new_position;

  return query select v_new_position, false;
end;
$$;

revoke execute on function public.reserve_waitlist_spot(text, text, text) from public;
grant  execute on function public.reserve_waitlist_spot(text, text, text) to anon;
grant  execute on function public.reserve_waitlist_spot(text, text, text) to authenticated;

-- ── 3 · RPC · get_waitlist_count ──────────────────────
-- Aggregate-only read for ScarcityStrip / future /admin headline.
-- Does NOT expose any PII.

create or replace function public.get_waitlist_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*)::bigint from public.waitlist;
$$;

revoke execute on function public.get_waitlist_count() from public;
grant  execute on function public.get_waitlist_count() to anon;
grant  execute on function public.get_waitlist_count() to authenticated;
