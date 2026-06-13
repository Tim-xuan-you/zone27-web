-- ── ZONE 27 · Migration 0028 · 結算推播訂閱 + 窄權限送出端(web-push)──────────
-- Created: 2026-06-14 · R233
-- Purpose: 留存第一槓桿 —— 賽果結算後,瀏覽器主動推「你押的 N 場有結果了 · 回來對帳」。
--   訂閱端(收):會員在 /member 開啟 → 存 push endpoint + 兩把瀏覽器金鑰到 push_subscriptions。
--   送出端(送):GitHub Action(push-settlements.yml)賽果落地後,撈「押了這幾場、還沒推過」
--   的人,送一則平靜對帳推播。 站內收件匣(SettlementBell / 0 migration)已是顯示面;這支是把
--   「該回來了」主動送出去。
--
-- 🔴 隱私承諾守住(Tim 拍板「窄權限鑰匙、不動 service_role 承諾」· /privacy 那句照樣成立):
--   送出端**不用 service_role**(它留在 Tim 本機不變)。 改用「秘密 token 閘門 + SECURITY DEFINER
--   函式」的最小權限路徑:自動化只拿一把 push token,只能呼叫本檔三支送出函式(撈投送對象 / 記已送 /
--   清失效訂閱),碰不到 auth.users、改不了押注、做不了別的事。 token 存 app_config(只 definer 讀)。
--
-- 🔴 紅線(對齊 settlement-inbox + liveness 設計):
--   · 推播只播「結算事件」· 命中+落空同權重 · 文案無 PnL/連勝/紅綠/FOMO/慫恿再押(送出端文案守)。
--   · 送出與站內顯示完全解耦 —— push 送出失敗永不影響站上結算顯示(鐵律:顯示永不靠 cron)。
--   · push payload 0 PII:只帶「N 場結算了 + /member/inbox 連結」· 不帶 email/隊名/比分/輸贏/碼。
--
-- 安全姿態(沿用 0003/0019/0025 慣例 + 0028 資安稽核):
--   · 三張表全 RLS-locked。 push_subscriptions 只開「自己讀自己」SELECT(同 0025)· 寫入一律走
--     SECURITY DEFINER 函式(認 auth.uid()· 不信前端傳 user_id)。 push_deliveries / app_config
--     無任何 policy → 前端碰不到,只 definer 函式進得去。
--   · 訂閱欄位入庫前驗格式(endpoint 必須 https://· 金鑰必須 base64url · 同 0025 的 CHECK 精神)·
--     擋畸形 / SSRF 式 endpoint。
--   · 送出端三支函式以 p_secret 閘門(比中 app_config.push_secret 才回資料 · 比不中回空、不報錯不當
--     oracle)· grant 給 anon(自動化用 anon key + token 呼叫 · 0 service_role)。
--   · 全欄位 qualify 別名(防 42702)· create or replace / if not exists 冪等可重跑。
--
-- 法律邊界(同 0003):純通知通道 · 0 金額欄位 · 不碰真錢。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN(可重複安全)。 套完後另跑一行設 push token
--   (見 Claude 給的步驟)。 沒套之前:/member「開啟結算提醒」整顆 graceful 隱藏(也還沒設 VAPID
--   金鑰前本來就不顯示)· 送出端 Action 沒 token 會空跑不送 —— 一律不破。 套完 + 設金鑰才活。
-- ─────────────────────────────────────────────────────

-- ── 1 · push_subscriptions 表(一個 endpoint 一列 · 同一人可多裝置)──────────────
create table if not exists public.push_subscriptions (
  endpoint   text        primary key check (endpoint ~ '^https://'),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  -- 瀏覽器訂閱金鑰(web-push 加密用)· base64url(含 - _ · 末端可省略 padding)。
  p256dh     text        not null check (p256dh ~ '^[A-Za-z0-9_-]+$'),
  auth       text        not null check (auth ~ '^[A-Za-z0-9_-]+$'),
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_idx
  on public.push_subscriptions (user_id);

-- ── 2 · push_deliveries 表(per-(user,match) 已推紀錄 · 防同場重複推)─────────────
-- 與站內「已讀」完全分開(刻意不重用 last_seen)· 一個 (user,match) 一輩子最多推一次。
create table if not exists public.push_deliveries (
  user_id  uuid        not null references auth.users (id) on delete cascade,
  match_id text        not null,
  sent_at  timestamptz not null default now(),
  primary key (user_id, match_id)
);

-- ── 3 · app_config 表(只放送出端的 push token · 只 definer 函式讀得到)──────────
create table if not exists public.app_config (
  key   text primary key,
  value text not null
);

-- ── RLS:三張表全鎖 · push_subscriptions 只開自己讀自己 ──────────────────────
alter table public.push_subscriptions enable row level security;
alter table public.push_deliveries   enable row level security;
alter table public.app_config        enable row level security;

-- 自己只讀自己的訂閱(同 0025 私密慣例)· 寫入不開 policy → 只能走 SECURITY DEFINER 函式。
drop policy if exists push_subscriptions_self_select on public.push_subscriptions;
create policy push_subscriptions_self_select
  on public.push_subscriptions
  for select
  using (user_id = auth.uid());
-- push_deliveries / app_config:不開任何 policy(前端完全碰不到 · 只 definer 函式進得去)。

-- ── 4 · save_push_subscription · 訂閱(會員開啟提醒)────────────────────────────
-- user_id = auth.uid()(server 認定 · 不信前端)。 upsert on endpoint:同瀏覽器重訂 → 更新金鑰
-- + 改綁目前登入者。 回 'ok' / 'anon'(未登入)/ 'invalid'(格式不對)。
create or replace function public.save_push_subscription(
  p_endpoint text,
  p_p256dh   text,
  p_auth     text
)
returns text
language plpgsql
security definer
set search_path = public
volatile
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return 'anon';
  end if;
  if coalesce(p_endpoint, '') !~ '^https://'
     or coalesce(p_p256dh, '') !~ '^[A-Za-z0-9_-]+$'
     or coalesce(p_auth, '') !~ '^[A-Za-z0-9_-]+$' then
    return 'invalid';
  end if;
  insert into public.push_subscriptions (endpoint, user_id, p256dh, auth)
  values (p_endpoint, v_uid, p_p256dh, p_auth)
  on conflict (endpoint) do update
    set user_id = excluded.user_id,
        p256dh  = excluded.p256dh,
        auth    = excluded.auth,
        created_at = now();
  return 'ok';
end;
$$;

revoke execute on function public.save_push_subscription(text, text, text) from public;
grant  execute on function public.save_push_subscription(text, text, text) to authenticated;

-- ── 5 · delete_push_subscription · 取消訂閱(只能刪自己的)──────────────────────
create or replace function public.delete_push_subscription(p_endpoint text)
returns text
language plpgsql
security definer
set search_path = public
volatile
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return 'anon';
  end if;
  delete from public.push_subscriptions ps
    where ps.endpoint = p_endpoint and ps.user_id = v_uid;
  return 'ok';
end;
$$;

revoke execute on function public.delete_push_subscription(text) from public;
grant  execute on function public.delete_push_subscription(text) to authenticated;

-- ── 6 · _push_secret_ok · 送出端 token 閘門(內部 helper)─────────────────────────
-- 比中 app_config.push_secret 才放行。 token 未設(null)一律 false(沒設 = 鎖死)。
create or replace function public._push_secret_ok(p_secret text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select value from public.app_config where key = 'push_secret') = p_secret
    and length(coalesce(p_secret, '')) >= 24,  -- 太短的 token 一律不認(擋空字串/弱猜)
    false
  );
$$;
revoke execute on function public._push_secret_ok(text) from public;
-- 不 grant 給任何人:只被下面三支同 definer 函式內部呼叫(同 owner · 不需 grant)。

-- ── 7 · get_pending_push_targets · 撈「押了這幾場、還沒推過」的投送對象 ────────────
-- 回 (user_id, endpoint, p256dh, auth, match_id)· 只回給「押了 p_match_ids 其中之一」且該
-- (user,match) 尚未在 push_deliveries 的訂閱。 token 不對 → 回空(不報錯 · 不當 oracle)。
-- 🔴 data minimization:不回 pick / email / 任何站內可推回身分的東西(payload 也不用 pick)。
-- returns table 形狀若未來要改(加欄位)必先 drop(否則 42P13)· 同 0026/0027 慣例 · 先 drop 保險。
drop function if exists public.get_pending_push_targets(text, text[]);
create or replace function public.get_pending_push_targets(
  p_secret    text,
  p_match_ids text[]
)
returns table (
  user_id  uuid,
  endpoint text,
  p256dh   text,
  auth     text,
  match_id text
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not public._push_secret_ok(p_secret) then
    return;  -- 空 result · 不洩漏
  end if;
  return query
    select distinct s.user_id, s.endpoint, s.p256dh, s.auth, p.match_id
    from public.predictions p
    join public.push_subscriptions s on s.user_id = p.user_id
    where p.match_id = any(p_match_ids)
      and not exists (
        select 1 from public.push_deliveries d
        where d.user_id = p.user_id and d.match_id = p.match_id
      );
end;
$$;

revoke execute on function public.get_pending_push_targets(text, text[]) from public;
grant  execute on function public.get_pending_push_targets(text, text[]) to anon;  -- 自動化用 anon key + token

-- ── 8 · record_push_delivery · 記「已推」(送成功後寫 · 冪等)────────────────────
create or replace function public.record_push_delivery(
  p_secret   text,
  p_user_id  uuid,
  p_match_id text
)
returns text
language plpgsql
security definer
set search_path = public
volatile
as $$
begin
  if not public._push_secret_ok(p_secret) then
    return 'denied';
  end if;
  insert into public.push_deliveries (user_id, match_id)
  values (p_user_id, p_match_id)
  on conflict (user_id, match_id) do nothing;
  return 'ok';
end;
$$;

revoke execute on function public.record_push_delivery(text, uuid, text) from public;
grant  execute on function public.record_push_delivery(text, uuid, text) to anon;

-- ── 9 · prune_push_subscription · 清失效訂閱(送出端收到 404/410 時)──────────────
create or replace function public.prune_push_subscription(
  p_secret   text,
  p_endpoint text
)
returns text
language plpgsql
security definer
set search_path = public
volatile
as $$
begin
  if not public._push_secret_ok(p_secret) then
    return 'denied';
  end if;
  delete from public.push_subscriptions ps where ps.endpoint = p_endpoint;
  return 'ok';
end;
$$;

revoke execute on function public.prune_push_subscription(text, text) from public;
grant  execute on function public.prune_push_subscription(text, text) to anon;
