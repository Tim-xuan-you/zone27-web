-- ── ZONE 27 · Migration 0002 · Founders 27 Number Reservations ─
-- Created: 2026-05-22 · Round 30 Wave 12
-- Purpose: Visitor 註冊 → 選 #008-#270 → public RESERVED 落 /leaderboard。
--          Patek allocation pattern · Costly Signaling pre-payment ·
--          per agent W2B #2 deepest call。
--
-- 設計 same pattern as 0001_waitlist.sql:
--   1. RLS locked · nobody direct table access
--   2. All writes via SECURITY DEFINER reserve_founder_number()
--   3. Public reads via SECURITY DEFINER get_reserved_numbers()
--      (returns int[] · no PII leak)
--   4. Owner read of own reservation via get_my_reservation()
--   5. Numbers 001-270 hardcoded constraint
--   6. #001-#007 是 Tim hardcoded forged · don't insert via this table ·
--      handled by lib/founders-stats.ts CLAIMED constant
-- ─────────────────────────────────────────────────────

-- ── 1 · Table ────────────────────────────────────────
create table if not exists public.founder_reservations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  number          int not null unique check (number between 1 and 270),
  reserved_at     timestamptz not null default now(),
  state           text not null default 'pending'
                    check (state in ('pending', 'confirmed', 'cancelled'))
);

create index if not exists founder_reservations_user_id_idx
  on public.founder_reservations (user_id);
create unique index if not exists founder_reservations_one_per_user_idx
  on public.founder_reservations (user_id)
  where state in ('pending', 'confirmed');

alter table public.founder_reservations enable row level security;

-- (No RLS policies = no direct access · all via SECURITY DEFINER below)

-- ── 2 · RPC · reserve_founder_number ─────────────────
-- 當前 logged-in user reserve 一個 number · 失敗條件:
--   · p_number 不在 1-270 → 'invalid_number'
--   · p_number 在 Tim hardcoded forged set (1-7) → 'reserved_by_founder'
--   · p_number 已被 reserved → 'number_taken'
--   · user 已有 active reservation → 'already_reserved'

create or replace function public.reserve_founder_number(
  p_number int
)
returns table (
  reservation_id uuid,
  number int,
  state text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_id uuid;
begin
  -- Require auth
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  -- Validate range
  if p_number < 1 or p_number > 270 then
    raise exception 'invalid_number';
  end if;

  -- Block Tim hardcoded #001-#007 forged set
  if p_number between 1 and 7 then
    raise exception 'reserved_by_founder';
  end if;

  -- Block existing taken numbers (any non-cancelled state)
  if exists (
    select 1 from public.founder_reservations
    where number = p_number and state != 'cancelled'
  ) then
    raise exception 'number_taken';
  end if;

  -- Block users with existing active reservation
  if exists (
    select 1 from public.founder_reservations
    where user_id = v_uid and state in ('pending', 'confirmed')
  ) then
    raise exception 'already_reserved';
  end if;

  -- Insert
  insert into public.founder_reservations (user_id, number)
  values (v_uid, p_number)
  returning id into v_id;

  return query
    select v_id, p_number, 'pending'::text;
end;
$$;

revoke execute on function public.reserve_founder_number(int) from public;
grant execute on function public.reserve_founder_number(int) to authenticated;

-- ── 3 · RPC · cancel_my_reservation ───────────────────
-- Owner cancels their own active reservation。 Sets state='cancelled'
-- rather than delete · so number becomes available again · audit trail kept。

create or replace function public.cancel_my_reservation()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  update public.founder_reservations
  set state = 'cancelled'
  where user_id = v_uid
    and state in ('pending', 'confirmed');
end;
$$;

revoke execute on function public.cancel_my_reservation() from public;
grant execute on function public.cancel_my_reservation() to authenticated;

-- ── 4 · RPC · get_reserved_numbers ────────────────────
-- Public read for /leaderboard THE 27 WALL display。 Returns int[] only ·
-- no user PII。 Anon can see which numbers are taken but not who took them。

create or replace function public.get_reserved_numbers()
returns table (number int, state text)
language sql
security definer
set search_path = public
as $$
  select fr.number, fr.state
  from public.founder_reservations fr
  where fr.state in ('pending', 'confirmed')
  order by fr.number;
$$;

revoke execute on function public.get_reserved_numbers() from public;
grant execute on function public.get_reserved_numbers() to anon;
grant execute on function public.get_reserved_numbers() to authenticated;

-- ── 5 · RPC · get_my_reservation ──────────────────────
-- Authenticated own-data read。 Returns own active reservation or null。

create or replace function public.get_my_reservation()
returns table (number int, state text, reserved_at timestamptz)
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
    select fr.number, fr.state, fr.reserved_at
    from public.founder_reservations fr
    where fr.user_id = v_uid
      and fr.state in ('pending', 'confirmed')
    limit 1;
end;
$$;

revoke execute on function public.get_my_reservation() from public;
grant execute on function public.get_my_reservation() to authenticated;
