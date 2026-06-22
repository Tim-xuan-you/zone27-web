-- ── ZONE 27 · Migration 0033 · 標付費等級時記「轉帳末5碼」+ 寫審核留痕 ──────────────
-- Created: 2026-06-22 · R255
-- Tim 缺口:收一筆銀行轉帳後常做兩件事 —— 標 BLACK 等級 +(若有)加點數。 加點數那張卡早就
--   有「轉帳末5碼」備註 + 點數帳本留痕;但「標付費等級」完全沒有備註、也不留痕,所以日後
--   對帳「這個人的會員費我到底收了沒」只能旁敲側擊。 這支補上:設等級時可選填轉帳末5碼,並把
--   每次設等級寫進既有的 admin_audit 留痕表(action = 'set_tier')→ 每筆收款都有一條可查紀錄。
--
-- 🔴 不改任何金流行為:仍是 Tim 親手點按鈕確認(#13 不自動扣款)· 不碰真錢 · 只是多記一條備註。
-- 🔴 完全沿用 0032 的到期日邏輯(早續從 max(現有到期,今天)+31 · 兩處 metadata 同步)· 一字不改,
--    只在最後多一行寫 admin_audit。 回傳仍 boolean。
--
-- GRACEFUL(不卡 · 可先部署前端再套這支):前端 adminSetTier 先打 3 參數版(本檔),找不到
--   (PGRST202 · 還沒套)就自動退回舊 2 參數版 → 設等級永遠不會壞,只是套之前那段時間沒留痕。
--
-- 依賴:0017(admin_audit 表 + admin_audit_recent)· 0032(admin_set_tier 現行版)· 0011(is_admin)。
-- 套用:Tim 在 Supabase SQL Editor 貼整支按 RUN(可重複安全)。 套完後「標付費會員」就會記末5碼 +
--   在「審核紀錄」看到「設等級」條目。
-- ─────────────────────────────────────────────────────────────

-- 舊 2 參數版收掉,改成單一「3 參數(末5碼可省略)」版 —— 省略第 3 參數時用預設空字串,
-- 所以舊式 {p_email, p_tier} 呼叫照樣相容(PostgREST 支援預設參數)。
drop function if exists public.admin_set_tier(text, text);

create or replace function public.admin_set_tier(
  p_email text,
  p_tier  text,
  p_ref   text default ''
)
returns boolean language plpgsql security definer set search_path = public
as $$
declare
  v_uid     uuid;
  v_tier    text;
  v_today   date := (now() at time zone 'Asia/Taipei')::date;
  v_existing date;
  v_until   text;
  v_snip    text;
  v_ref     text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  v_tier := lower(trim(coalesce(p_tier, '')));
  if v_tier not in ('free', 'black', 'founder') then raise exception 'invalid_tier'; end if;
  select u.id into v_uid from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if v_uid is null then raise exception 'user_not_found'; end if;

  if v_tier = 'free' then
    -- 降回 OPEN:兩處 tier + 到期日都清(同 0032)。
    update auth.users set
      raw_user_meta_data = (coalesce(raw_user_meta_data, '{}'::jsonb) - 'tier') - 'member_until',
      raw_app_meta_data  = (coalesce(raw_app_meta_data, '{}'::jsonb) - 'tier') - 'member_until'
    where id = v_uid;
    v_snip := lower(trim(p_email)) || ' → 取消付費(回 OPEN)';
  else
    -- 續期公平:從 max(現有到期日, 今天) +31;到期日兩處同步寫(同 0032)。
    select nullif(raw_user_meta_data->>'member_until', '')::date into v_existing
      from auth.users where id = v_uid;
    v_until := to_char(greatest(coalesce(v_existing, v_today), v_today) + 31, 'YYYY-MM-DD');
    update auth.users set
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
                           || jsonb_build_object('tier', v_tier, 'member_until', v_until),
      raw_app_meta_data  = coalesce(raw_app_meta_data, '{}'::jsonb)
                           || jsonb_build_object('tier', v_tier, 'member_until', v_until)
    where id = v_uid;
    v_snip := lower(trim(p_email)) || ' → ' || upper(v_tier) || ' · 有效到 ' || v_until;
  end if;

  -- 新增:每次設等級寫一條審核留痕(action='set_tier')· 轉帳末5碼(若有)進 reason。
  -- 與刪除留痕共用 admin_audit(0017)· 「審核紀錄」面會一起列出。
  v_ref := nullif(trim(coalesce(p_ref, '')), '');
  insert into public.admin_audit (admin_id, action, target_kind, target_id, target_snippet, reason)
    values (auth.uid(), 'set_tier', 'member', v_uid, v_snip, v_ref);

  return true;
end; $$;

revoke execute on function public.admin_set_tier(text, text, text) from public;
grant  execute on function public.admin_set_tier(text, text, text) to authenticated;
