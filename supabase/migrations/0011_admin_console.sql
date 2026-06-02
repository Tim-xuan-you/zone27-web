-- ── ZONE 27 · Migration 0011 · Admin Console(WordPress 式點擊後台 · 零 SQL)──
-- Created: 2026-06-02
-- Tim 2026-06-02:「完全看不懂…這麼難…不會操作…沒辦法像 WordPress 點擊就行?」
-- = founder-dogfood-canary。 之前給「複製貼上 SQL」對非工程師是錯的。
--
-- 重要釐清:鐵律 #13「手動金流」= Tim 親自決定每一筆、不自動扣款。 **不是** Tim 手寫 SQL。
-- 點按鈕確認「給某人加 N 點」一樣是手動 + 留痕(wallet_ledger 記一筆)· 不違反 #13。
--
-- 設計:app_admins allowlist + is_admin() gate。 所有 admin RPC 都 server 端檢查 is_admin
--   (即使有人拿 anon key 直接打 admin_give_points 也擋掉 → 'not_admin')。
--   bootstrap = claim_admin()(表空 + 登入即可認領第一個 admin · 認領後永遠鎖死 · 0 SQL)。
--   全 SECURITY DEFINER · RETURNING 一律 qualify(R185 教訓)。 這是 Tim 唯一要套的 SQL,
--   之後管理全在 /admin 點按鈕。
-- ─────────────────────────────────────────────────────

create table if not exists public.app_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.app_admins enable row level security;
-- (No RLS policies = 無直接存取 · 全走下方 SECURITY DEFINER)

-- ── is_admin · 當前登入者是否為 admin(內部 gate)──
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.app_admins a where a.user_id = auth.uid()); $$;

-- ── claim_admin · 表空 + 登入 → 認領第一個 admin(零 SQL bootstrap · 認領後鎖死)──
create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public
as $$
declare v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not_logged_in'; end if;
  if exists (select 1 from public.app_admins) then
    return false; -- 已有 admin · 不能再認領(防搶)
  end if;
  insert into public.app_admins (user_id) values (v_uid) on conflict do nothing;
  return true;
end; $$;

-- ── am_i_admin · 給前端問「我是 admin 嗎 + 有沒有人認領過」──
create or replace function public.am_i_admin()
returns table (is_admin boolean, has_any_admin boolean)
language sql security definer set search_path = public stable
as $$
  select
    exists (select 1 from public.app_admins a where a.user_id = auth.uid()),
    exists (select 1 from public.app_admins);
$$;

-- ── admin_give_points · 加點數(儲值)· email + 金額 + 備註 ──
create or replace function public.admin_give_points(p_email text, p_amount int, p_ref text)
returns boolean language plpgsql security definer set search_path = public
as $$
declare v_uid uuid;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_amount is null or p_amount = 0 then raise exception 'invalid_amount'; end if;
  select u.id into v_uid from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if v_uid is null then raise exception 'user_not_found'; end if;
  insert into public.wallet_ledger (user_id, delta_ntd, kind, ref)
  values (v_uid, p_amount, 'topup', nullif(trim(coalesce(p_ref, '')), ''));
  return true;
end; $$;

-- ── admin_set_tier · 標記付費等級 · free / black / founder ──
create or replace function public.admin_set_tier(p_email text, p_tier text)
returns boolean language plpgsql security definer set search_path = public
as $$
declare v_uid uuid; v_tier text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  v_tier := lower(trim(coalesce(p_tier, '')));
  if v_tier not in ('free', 'black', 'founder') then raise exception 'invalid_tier'; end if;
  select u.id into v_uid from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if v_uid is null then raise exception 'user_not_found'; end if;
  if v_tier = 'free' then
    update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) - 'tier' where id = v_uid;
  else
    update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('tier', v_tier) where id = v_uid;
  end if;
  return true;
end; $$;

-- ── admin_members · 全會員列表(email + 等級 + 餘額 + 加入時間)──
create or replace function public.admin_members()
returns table (email text, tier text, balance_ntd int, created_at timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select
      u.email::text,
      coalesce(u.raw_user_meta_data->>'tier', 'free') as tier,
      coalesce((select sum(w.delta_ntd) from public.wallet_ledger w where w.user_id = u.id), 0)::int as balance_ntd,
      u.created_at
    from auth.users u
    order by u.created_at desc
    limit 500;
end; $$;

-- ── admin_recent_content · 最近文章/留言/發言(審核用)──
create or replace function public.admin_recent_content()
returns table (kind text, id uuid, handle text, snippet text, created_at timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select x.kind, x.id, x.handle, x.snippet, x.created_at
    from (
      select 'creator_post'::text as kind, p.id,
             ('球迷 #' || substr(md5(p.user_id::text), 1, 4))::text as handle,
             left(p.title, 40) as snippet, p.created_at
      from public.creator_posts p
      union all
      select 'creator_comment'::text, c.id,
             ('球迷 #' || substr(md5(c.user_id::text), 1, 4))::text,
             left(c.body, 40), c.created_at
      from public.creator_comments c
      union all
      select 'game_post'::text, g.id,
             ('球迷 #' || substr(md5(g.user_id::text), 1, 4))::text,
             left(g.body, 40), g.created_at
      from public.game_posts g
    ) x
    order by x.created_at desc
    limit 80;
end; $$;

-- ── admin_delete · 刪一篇/一則(kind + id)──
create or replace function public.admin_delete(p_kind text, p_id uuid)
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_kind = 'creator_post' then delete from public.creator_posts where id = p_id;
  elsif p_kind = 'creator_comment' then delete from public.creator_comments where id = p_id;
  elsif p_kind = 'game_post' then delete from public.game_posts where id = p_id;
  else raise exception 'invalid_kind'; end if;
  return true;
end; $$;

-- ── grants · 全 authenticated 可呼叫,但函式內 is_admin() gate 把關 ──
revoke execute on function public.is_admin()                              from public;
revoke execute on function public.claim_admin()                           from public;
revoke execute on function public.am_i_admin()                            from public;
revoke execute on function public.admin_give_points(text, int, text)      from public;
revoke execute on function public.admin_set_tier(text, text)              from public;
revoke execute on function public.admin_members()                         from public;
revoke execute on function public.admin_recent_content()                  from public;
revoke execute on function public.admin_delete(text, uuid)                from public;

grant execute on function public.is_admin()                              to authenticated;
grant execute on function public.claim_admin()                           to authenticated;
grant execute on function public.am_i_admin()                            to authenticated;
grant execute on function public.admin_give_points(text, int, text)      to authenticated;
grant execute on function public.admin_set_tier(text, text)              to authenticated;
grant execute on function public.admin_members()                         to authenticated;
grant execute on function public.admin_recent_content()                  to authenticated;
grant execute on function public.admin_delete(text, uuid)                to authenticated;
