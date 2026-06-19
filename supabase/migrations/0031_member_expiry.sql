-- ── ZONE 27 · Migration 0031 · BLACK 會員到期日(member_until)──────────────────
-- Created: 2026-06-19 · R252
-- Purpose: BLACK 會員 NT$ 500 / 31 天 · 手動轉帳 · 0 自動續扣。 在這之前 tier 只是一個
--   字串、沒有任何「到期日」—— 會員看不到自己撐到哪天、Tim 也看不出誰快到期該提醒。
--   這支 migration 補上「有效到哪天」這件事,做法 = Defector 式「誠實日期、零催繳」:
--     · 不自動扣款(本來就是 /integrity 第 13 條鐵律)→ 永遠不會偷偷收錢。
--     · 不做焦慮倒數 / 不紅字 / 不 FOMO → 只平靜顯示「有效到 X · 還有 N 天」。
--     · 到期靠 Tim 親手提醒 + 會員自己決定要不要再轉一次(早續不少算天數)。
--
-- 🔴 自動算日期(Tim 不用自己算):在 /admin 點「設為 BLACK」時,系統自動蓋上
--   「今天 + 31 天(台北時區)」當到期日。 早一點續(對方又轉帳、Tim 再點一次 BLACK)→
--   從「現有到期日」與「今天」較晚者起算 +31,絕不少算剩餘天數。 設回 OPEN(free)→ 清掉到期日。
--
-- 🔴 安全姿態:到期日存 user_metadata(會員自己改得到,但那只是「顯示給自己看」· 改了不解鎖
--   任何東西 —— 房間/金環的真正門檻仍是 0030 寫進 app_metadata 的 tier,使用者改不到)。
--   所以「謊報到期日」只會騙到自己,可接受;真正的 access 邊界不靠這個欄位。
--
-- GRACEFUL:本檔未套前 —— /member 的到期卡讀不到 member_until → 顯示「有效期待設定」、不 crash;
--   /admin 會員列表「到期」欄空白。 套完即活。 既有付費會員(現 ≈ 0)下次用 /admin 重設一次 BLACK
--   就會補上到期日(同 0030 重設補房門鑰匙那一步,一次做完)。
--
-- 套用順序:先套 0030(member_lounge)、再套這支 0031。 兩支都在 Supabase SQL Editor 貼整支按 RUN,
--   可重複安全。 0031 的 admin_set_tier 已包含 0030 的 app_metadata 房門寫入(獨立也正確)。
-- ─────────────────────────────────────────────────────────────

-- ── 1 · admin_set_tier 升級 · 設付費等級時自動蓋 31 天到期日 ──────────────────────────
-- = 0030 版(tier 同時寫 user_metadata 金環 + app_metadata 房門)+ 多一步:付費 → 蓋 member_until。
-- create or replace 冪等 · 簽名不變(text, text)· grant 沿用。 is_admin() 仍是唯一入口。
create or replace function public.admin_set_tier(p_email text, p_tier text)
returns boolean language plpgsql security definer set search_path = public
as $$
declare
  v_uid     uuid;
  v_tier    text;
  v_today   date := (now() at time zone 'Asia/Taipei')::date;  -- 台北「今天」(UTC+8 無 DST)
  v_existing date;
  v_until   text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  v_tier := lower(trim(coalesce(p_tier, '')));
  if v_tier not in ('free', 'black', 'founder') then raise exception 'invalid_tier'; end if;
  select u.id into v_uid from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if v_uid is null then raise exception 'user_not_found'; end if;

  if v_tier = 'free' then
    -- 降回 OPEN:兩處 tier 都清 + 清掉到期日(不留 stale 顯示)。
    update auth.users set
      raw_user_meta_data = (coalesce(raw_user_meta_data, '{}'::jsonb) - 'tier') - 'member_until',
      raw_app_meta_data  = coalesce(raw_app_meta_data, '{}'::jsonb) - 'tier'
    where id = v_uid;
  else
    -- 續期公平:從 max(現有到期日, 今天) 起算 +31 天(早續不少算 · 過期後續 = 今天 +31)。
    select nullif(raw_user_meta_data->>'member_until', '')::date into v_existing
      from auth.users where id = v_uid;
    v_until := to_char(greatest(coalesce(v_existing, v_today), v_today) + 31, 'YYYY-MM-DD');
    update auth.users set
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
                           || jsonb_build_object('tier', v_tier, 'member_until', v_until),
      raw_app_meta_data  = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('tier', v_tier)
    where id = v_uid;
  end if;
  return true;
end; $$;

revoke execute on function public.admin_set_tier(text, text) from public;
grant  execute on function public.admin_set_tier(text, text) to authenticated;

-- ── 2 · admin_members 加回「到期日」欄(改 returns table 形狀 → 必須先 drop)──────────────
-- 🔴 改函式 returns table 形狀必先 drop（否則 42P13 cannot change return type · 同 0013/0020/0030 慣例）。
drop function if exists public.admin_members();
create function public.admin_members()
returns table (email text, tier text, balance_ntd int, member_until text, created_at timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select
      u.email::text,
      coalesce(u.raw_user_meta_data->>'tier', 'free')                                              as tier,
      coalesce((select sum(w.delta_ntd) from public.wallet_ledger w where w.user_id = u.id), 0)::int as balance_ntd,
      coalesce(u.raw_user_meta_data->>'member_until', '')                                          as member_until,
      u.created_at
    from auth.users u
    order by u.created_at desc
    limit 500;
end; $$;

revoke execute on function public.admin_members() from public;
grant  execute on function public.admin_members() to authenticated;
