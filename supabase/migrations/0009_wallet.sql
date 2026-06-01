-- ── ZONE 27 · Migration 0009 · 點數錢包(儲值 → 買文章)──────────
-- Created: 2026-06-01
-- Purpose: Tim 拍板的模式 = 用戶「儲值」(充值)→ 用點數買付費分析。 同 Steam
--          錢包 / iTunes 儲值:真錢 → 點數 → 只能買 ZONE 27 內容。
--
--          法律邊界(per memory/zone27-legal-redline · Tim 確認的鐵則):
--            ① 點數「單向」· 只能買文章 · 永遠不能換回現金、不能轉給別人
--               (= 預付/禮券,不是賭場籌碼)。 錢包 ledger 沒有任何「提現」路徑。
--            ② 買的是分析「內容」· 不是賭注 · 0 賠率 · 0 簽賭。
--            ③ 儲值 = 手動轉帳(v1):用戶轉帳 → Tim 在 Studio 記一筆 'topup'。
--               0 自動扣款 · 0 金流商。 規模化(自動儲值/賣家提領)= 碰真錢 →
--               設公司 + 會計師 + 律師(per legal-redline 🏢 段 · TIER 3)。
--
-- 設計:RLS-locked ledger + SECURITY DEFINER RPC · 餘額 = ledger 加總(audit
--   trail · 不存單一可竄改餘額欄)· 扣款用 pg_advisory_xact_lock 鎖 per-user
--   防 double-spend · 全欄位 qualify(防 ambiguous · 同 0003/0005 教訓)。
-- ─────────────────────────────────────────────────────

-- ── 1 · 錢包帳本 · 每筆 +儲值 / −消費 · 餘額 = 加總 ──
create table if not exists public.wallet_ledger (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  delta_ntd  int  not null,            -- +儲值 · −買文章(NT$ · 1 點 = NT$1)
  kind       text not null check (kind in ('topup', 'spend', 'refund', 'adjust')),
  ref        text,                      -- spend → post_id · topup → 轉帳備註
  created_at timestamptz not null default now()
);

create index if not exists wallet_ledger_user_idx
  on public.wallet_ledger (user_id, created_at desc);

alter table public.wallet_ledger enable row level security;
-- (No RLS policies = 無直接存取 · 全走下方 SECURITY DEFINER · 餘額不可被竄改)

-- ── 2 · 餘額 = 本人 ledger 加總 ───────────────────────
create or replace function public.get_wallet_balance()
returns int
language sql
security definer
set search_path = public
as $$
  select coalesce(sum(w.delta_ntd), 0)::int
  from public.wallet_ledger w
  where w.user_id = auth.uid();
$$;

revoke execute on function public.get_wallet_balance() from public;
grant  execute on function public.get_wallet_balance() to authenticated;

-- ── 3 · 用點數買一篇付費分析(原子:檢查餘額 → 扣 → 記購買)──
-- 回 (ok, reason, new_balance)。 reason:
--   not_logged_in / not_found / free(免費不需買)/ own_post(自己的)/
--   already_purchased(已買 · ok=true)/ insufficient(餘額不足 · ok=false)/ ok
create or replace function public.buy_creator_post(p_post_id uuid)
returns table (ok boolean, reason text, new_balance int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid     uuid;
  v_price   int;
  v_author  uuid;
  v_balance int;
begin
  v_uid := auth.uid();
  if v_uid is null then
    return query select false, 'not_logged_in', 0; return;
  end if;

  -- per-user 序列化 · 防同時雙擊 double-spend
  perform pg_advisory_xact_lock(hashtext(v_uid::text));

  select p.price_ntd, p.user_id into v_price, v_author
  from public.creator_posts p where p.id = p_post_id;
  if not found then
    return query select false, 'not_found', 0; return;
  end if;
  if v_price <= 0 then
    return query select false, 'free', 0; return;       -- 免費文不需購買
  end if;
  if v_author = v_uid then
    return query select false, 'own_post', 0; return;   -- 自己的文
  end if;

  select coalesce(sum(w.delta_ntd), 0)::int into v_balance
  from public.wallet_ledger w where w.user_id = v_uid;

  -- 已買過 → 直接回 ok(冪等 · 不重複扣)
  if exists (
    select 1 from public.creator_purchases cp
    where cp.post_id = p_post_id and cp.buyer_id = v_uid
  ) then
    return query select true, 'already_purchased', v_balance; return;
  end if;

  if v_balance < v_price then
    return query select false, 'insufficient', v_balance; return;
  end if;

  -- 原子:記購買(0008 表)+ 扣點(本表)· 同一交易
  insert into public.creator_purchases (buyer_id, post_id)
  values (v_uid, p_post_id);
  insert into public.wallet_ledger (user_id, delta_ntd, kind, ref)
  values (v_uid, -v_price, 'spend', p_post_id::text);

  return query select true, 'ok', (v_balance - v_price);
end;
$$;

revoke execute on function public.buy_creator_post(uuid) from public;
grant  execute on function public.buy_creator_post(uuid) to authenticated;
