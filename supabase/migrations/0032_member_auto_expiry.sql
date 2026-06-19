-- ── ZONE 27 · Migration 0032 · BLACK 到期「自動」回到免費(零手動 · 零自動扣款)──────────────
-- Created: 2026-06-19 · R252
-- Tim:「會員時間到期,會自動變回一般會員?不用我手動吧?」 → 對,應該自動。
--
-- 🔴 重要釐清:「0 自動續扣」(/integrity #13)= 永遠不自動「收錢」。 它不等於不能自動「到期」。
--   兩件事相反:
--     · 自動扣款(我們永遠不做)= 第 31 天偷偷再刷一次卡。 ← 黑暗手法。
--     · 自動到期(本來就該這樣)= 第 31 天付費期自然結束、安靜回到免費層,我們「什麼都不收」。 ← 誠實。
--   所以到期 = 自動回免費,Tim 不用手動降級任何人,而且我們不碰他一毛錢。 免費層本來就有引擎/戰績/
--   校準全部,只是少了支持者專屬的金環 + 會員房間。 想回來 → 再轉一次帳、Tim 按一下 BLACK 就接上。
--
-- 做法:把「現在這一刻是不是有效會員」改成「即時從到期日算出來」,不再是需要手動翻的靜態旗標。
--   · 會員房間門禁 z27_is_member → 認 app_metadata.tier(使用者改不到)+ app_metadata.member_until,
--     過期自動擋(門禁是 access 邊界,日期必須非 spoofable)。
--   · /u 公開檔金環 get_tier_by_code → 認 user_metadata(金環是裝飾,spoof 只是謊稱有贊助、不解鎖任何
--     東西 · 同 0023 姿態),過期自動不顯示。
--   · admin_set_tier 設 BLACK 時把到期日「同時」寫進 user_metadata(顯示)+ app_metadata(門禁)。
--   · 會員自己 /member 的顯示(等級字、金環、房間入口)由 app 端 effectiveTier 即時回退(見 lib/membership.ts)。
--
-- GRACEFUL / 不鎖死既有會員:app/user_metadata 裡若「沒有」member_until(0032 前設的舊會員 · 現 ≈ 0)→
--   一律當「未到期」,不會誤鎖。 既有會員不用重設;以後設 BLACK 自動兩處都蓋日期。 格式不對(萬一手 spoof)
--   也當未到期、永不丟例外。 全部 create or replace、回傳形狀不變 → 不需 drop、可重複安全跑。
--
-- 套用順序:0030 → 0031 → 0032,都在 Supabase SQL Editor 貼整支按 RUN。
-- ─────────────────────────────────────────────────────────────

-- ── 1 · admin_set_tier · 設 BLACK 時到期日「同時」寫 user_metadata(顯示)+ app_metadata(門禁)──────
-- = 0031 版,只多一步:把 member_until 也鏡到 app_metadata(門禁要非 spoofable 的日期才能自動到期)。
create or replace function public.admin_set_tier(p_email text, p_tier text)
returns boolean language plpgsql security definer set search_path = public
as $$
declare
  v_uid     uuid;
  v_tier    text;
  v_today   date := (now() at time zone 'Asia/Taipei')::date;
  v_existing date;
  v_until   text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  v_tier := lower(trim(coalesce(p_tier, '')));
  if v_tier not in ('free', 'black', 'founder') then raise exception 'invalid_tier'; end if;
  select u.id into v_uid from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if v_uid is null then raise exception 'user_not_found'; end if;

  if v_tier = 'free' then
    -- 降回 OPEN:兩處 tier + 到期日都清。
    update auth.users set
      raw_user_meta_data = (coalesce(raw_user_meta_data, '{}'::jsonb) - 'tier') - 'member_until',
      raw_app_meta_data  = (coalesce(raw_app_meta_data, '{}'::jsonb) - 'tier') - 'member_until'
    where id = v_uid;
  else
    -- 續期公平:從 max(現有到期日, 今天) +31(早續不少算);到期日兩處同步寫。
    select nullif(raw_user_meta_data->>'member_until', '')::date into v_existing
      from auth.users where id = v_uid;
    v_until := to_char(greatest(coalesce(v_existing, v_today), v_today) + 31, 'YYYY-MM-DD');
    update auth.users set
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
                           || jsonb_build_object('tier', v_tier, 'member_until', v_until),
      raw_app_meta_data  = coalesce(raw_app_meta_data, '{}'::jsonb)
                           || jsonb_build_object('tier', v_tier, 'member_until', v_until)
    where id = v_uid;
  end if;
  return true;
end; $$;

revoke execute on function public.admin_set_tier(text, text) from public;
grant  execute on function public.admin_set_tier(text, text) to authenticated;

-- ── 2 · z27_is_member · 會員房間門禁改「即時看到期日」(過期自動擋 · 無需手動降級)──────────────
-- 讀 app_metadata(使用者改不到)· tier 付費 AND 到期日 >= 台北今天 → true;過期 → false(自動回免費)。
-- 沒填/格式不對的 member_until → 當「未到期」(不誤鎖既有會員 · 永不丟例外)。 is_admin 永遠可進(Tim 管理)。
create or replace function public.z27_is_member(p_uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select
       (
         (u.raw_app_meta_data ->> 'tier') in ('black', 'founder')
         and (
           (u.raw_app_meta_data ->> 'member_until') is null
           or (u.raw_app_meta_data ->> 'member_until') !~ '^\d{4}-\d{2}-\d{2}$'
           or (u.raw_app_meta_data ->> 'member_until')::date >= (now() at time zone 'Asia/Taipei')::date
         )
       )
       or public.is_admin()
     from auth.users u where u.id = p_uid),
    false
  );
$$;

revoke execute on function public.z27_is_member(uuid) from public;
grant  execute on function public.z27_is_member(uuid) to authenticated;

-- ── 3 · get_tier_by_code · /u 公開檔金環改「即時看到期日」(過期自動不顯示金環)──────────────────
-- 讀 user_metadata(金環是裝飾 · spoof 只是謊稱有贊助、不解鎖任何東西 · 同 0023 姿態)。 回傳契約不變:
-- 'black'/'founder' = 顯示金環;'' = 不顯示。 過期 / 格式不對處理見上。 anon 可讀不變。
create or replace function public.get_tier_by_code(p_code text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select case
    when (u.raw_user_meta_data ->> 'tier') in ('black', 'founder')
         and (
           (u.raw_user_meta_data ->> 'member_until') is null
           or (u.raw_user_meta_data ->> 'member_until') !~ '^\d{4}-\d{2}-\d{2}$'
           or (u.raw_user_meta_data ->> 'member_until')::date >= (now() at time zone 'Asia/Taipei')::date
         )
    then (u.raw_user_meta_data ->> 'tier')
    else ''
  end
  from auth.users u
  where substr(md5(u.id::text), 1, 8) = lower(trim(p_code))
  order by u.created_at asc
  limit 1;
$$;

revoke execute on function public.get_tier_by_code(text) from public;
grant  execute on function public.get_tier_by_code(text) to anon;
grant  execute on function public.get_tier_by_code(text) to authenticated;
