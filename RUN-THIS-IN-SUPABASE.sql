-- ZONE 27 · 一次跑這 6 支(押注+發分析+個人準度+作者戰績+買了才解鎖+點數錢包)
-- 貼進 Supabase SQL Editor 按 Run → 看到 Success 就成功


-- ================= 0003_predictions_market.sql =================

-- ── ZONE 27 · Migration 0003 · Predictions Market ─────
-- Created: 2026-05-29
-- Purpose: 把「使用者預測」從 per-user user_metadata(各自孤島 · 無法跨人
--          統計)升級成一張 SHARED table → 才能長出兩個東西:
--            (a) 市場線 · 每場「X% 進場買主隊」群眾即時機率(aggregate)
--            (b) 公開海選 · 每個人的預測被公開累積打分(未來 brick)
--
--          這是「免費玩 → 公開海選 → 變付費高手」整條龍的脊椎。
--
-- 法律邊界(硬守):
--   · pick 只進「點數/虛擬預測」· 此表 0 金額欄位 · 不存賭注 · 不存金流
--   · 真錢只在未來「賣分析內容」那側走(完全分離的另一套)· 兩邊永不打通
--   · 純精神預測 = 遊戲 · 不觸發賭博罪 / 運彩條例(同 lib/predictions.ts 精神)
--
-- 設計 same pattern as 0001 / 0002:
--   1. RLS locked · nobody direct table access
--   2. 寫入只走 SECURITY DEFINER submit_prediction()(需登入 · 一場一次 · 不可改)
--   3. 市場線只走 SECURITY DEFINER get_match_prediction_tally()
--      (只回 home/away 計數 · 0 PII · anon 可讀)
--   4. 本人讀自己預測走 get_my_prediction()
--   5. 一場一人一次 · 不可改(committed pick = 誠信 + 防作弊)
--   6. created_at 記下「何時押」· 賽後結算時 app-side 只採計「開賽前」的預測
--      (防止賽後補登 · 對齊 /track-record「先鎖後結」誠信)
-- ─────────────────────────────────────────────────────

-- ── 1 · Table ────────────────────────────────────────
create table if not exists public.predictions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  match_id    text not null,
  pick        text not null check (pick in ('home', 'away')),
  created_at  timestamptz not null default now()
);

-- 一場一人一次(committed · 不可改 · 防作弊)
create unique index if not exists predictions_one_per_user_match_idx
  on public.predictions (user_id, match_id);

-- 市場線 tally 用 · 依 match_id 快速聚合
create index if not exists predictions_match_id_idx
  on public.predictions (match_id);

alter table public.predictions enable row level security;

-- (No RLS policies = no direct access · all via SECURITY DEFINER below)

-- ── 2 · RPC · submit_prediction ──────────────────────
-- 登入 user 對一場比賽押一邊。 失敗條件:
--   · 未登入 → 'not_logged_in'
--   · p_pick 不是 'home'/'away' → 'invalid_pick'
--   · 此 user 對此 match 已押過 → 'already_predicted'(committed · 不可改)

create or replace function public.submit_prediction(
  p_match_id text,
  p_pick     text
)
returns table (prediction_id uuid, match_id text, pick text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_id  uuid;
  v_match text;
  v_at  timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_match := nullif(trim(coalesce(p_match_id, '')), '');
  if v_match is null then
    raise exception 'invalid_match';
  end if;

  if p_pick is null or p_pick not in ('home', 'away') then
    raise exception 'invalid_pick';
  end if;

  if exists (
    select 1 from public.predictions
    where user_id = v_uid and predictions.match_id = v_match
  ) then
    raise exception 'already_predicted';
  end if;

  insert into public.predictions (user_id, match_id, pick)
  values (v_uid, v_match, p_pick)
  returning id, predictions.created_at
  into v_id, v_at;

  return query select v_id, v_match, p_pick, v_at;
end;
$$;

revoke execute on function public.submit_prediction(text, text) from public;
grant  execute on function public.submit_prediction(text, text) to authenticated;

-- ── 3 · RPC · get_match_prediction_tally ─────────────
-- 市場線 · 公開 aggregate · 回某場 home/away 押注計數 + total。
-- 0 PII · anon 可讀(看得到「幾人押主隊」· 看不到「誰押」)。
-- App-side 把 total/home 算成百分比 = 群眾即時機率。

create or replace function public.get_match_prediction_tally(
  p_match_id text
)
returns table (home_count bigint, away_count bigint, total bigint)
language sql
security definer
set search_path = public
as $$
  select
    count(*) filter (where p.pick = 'home')::bigint as home_count,
    count(*) filter (where p.pick = 'away')::bigint as away_count,
    count(*)::bigint                                as total
  from public.predictions p
  where p.match_id = p_match_id;
$$;

revoke execute on function public.get_match_prediction_tally(text) from public;
grant  execute on function public.get_match_prediction_tally(text) to anon;
grant  execute on function public.get_match_prediction_tally(text) to authenticated;

-- ── 4 · RPC · get_my_prediction ──────────────────────
-- 本人讀自己對某場的預測(或 null)。

create or replace function public.get_my_prediction(
  p_match_id text
)
returns table (pick text, created_at timestamptz)
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
    select p.pick, p.created_at
    from public.predictions p
    where p.user_id = v_uid and p.match_id = p_match_id
    limit 1;
end;
$$;

revoke execute on function public.get_my_prediction(text) from public;
grant  execute on function public.get_my_prediction(text) to authenticated;


-- ================= 0005_creator_posts.sql =================

-- ── ZONE 27 · Migration 0005 · Creator Analysis Posts(創作者賣分析)──
-- Created: 2026-05-30
-- Purpose: Polymarket pivot 第 5 根支柱「創作者賣分析」的 backend。 Tim 2026-05-30
--          screenshot 報馬仔/明燈平台 + 明確要:創作者「發文 + 推薦賽事(選邊)+
--          寫分析 + 賣文章」· 賽後自動評勝敗。 per memory/project_zone27_polymarket_pivot.md。
--
--          ZONE 27 版的差別(displacement weapon):報馬仔輸了刪文藏戰績 · 這裡
--          創作者押的邊「賽前鎖死 + 賽後自動掛準/不準 + 刪不掉」= 賴不掉的戰績。
--          每篇分析綁一個 match + 一個 pick(home/away)· app-side 對 finalResult
--          自動 grade。 創作者準度 = 海選天梯名次(/ladder)。
--
-- 法律邊界(per memory/project_zone27_legal_redline.md):
--   · 賣的是「分析內容」訂閱/單篇傭金(灰色可做)· 不是賭注抽傭(紅線)。
--   · price_ntd 欄位 ready · 但「購買=手動銀行轉帳」flow 是 Phase 2(需 Tim 提供
--     收款帳戶到 Vercel 私密 env · 碰真錢上線前找律師)。 v1 全免費(price 0)。
--
-- 設計 same pattern as 0003 / 0004:RLS locked · SECURITY DEFINER RPCs · handle
--   = user_id md5 短碼(0 PII)· 一場一人一篇(anti-spam)。
-- ─────────────────────────────────────────────────────

create table if not exists public.creator_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  match_id    text not null,
  title       text not null,
  body        text not null,
  pick        text not null check (pick in ('home', 'away')),
  price_ntd   int  not null default 0 check (price_ntd >= 0), -- 0=免費 · >0=賣(購買 flow = Phase 2)
  created_at  timestamptz not null default now()
);

create unique index if not exists creator_posts_one_per_user_match_idx
  on public.creator_posts (user_id, match_id);

create index if not exists creator_posts_match_id_idx
  on public.creator_posts (match_id, created_at desc);

create index if not exists creator_posts_user_id_idx
  on public.creator_posts (user_id, created_at desc);

alter table public.creator_posts enable row level security;

-- ── submit_creator_post ──────────────────────────────
-- 登入 · 一場一篇 · title ≤80 · body ≤2000 · pick home/away · price≥0
create or replace function public.submit_creator_post(
  p_match_id text,
  p_title    text,
  p_body     text,
  p_pick     text,
  p_price    int
)
returns table (post_id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid;
  v_match text;
  v_title text;
  v_body  text;
  v_price int;
  v_id    uuid;
  v_at    timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_match := nullif(trim(coalesce(p_match_id, '')), '');
  if v_match is null then
    raise exception 'invalid_match';
  end if;

  v_title := trim(coalesce(p_title, ''));
  if v_title = '' or char_length(v_title) > 80 then
    raise exception 'invalid_title';
  end if;

  v_body := trim(coalesce(p_body, ''));
  if v_body = '' or char_length(v_body) > 2000 then
    raise exception 'invalid_body';
  end if;

  if p_pick is null or p_pick not in ('home', 'away') then
    raise exception 'invalid_pick';
  end if;

  v_price := greatest(0, coalesce(p_price, 0));

  if exists (
    select 1 from public.creator_posts
    where user_id = v_uid and creator_posts.match_id = v_match
  ) then
    raise exception 'already_posted';
  end if;

  insert into public.creator_posts (user_id, match_id, title, body, pick, price_ntd)
  values (v_uid, v_match, v_title, v_body, p_pick, v_price)
  returning id, creator_posts.created_at
  into v_id, v_at;

  return query select v_id, v_at;
end;
$$;

revoke execute on function public.submit_creator_post(text, text, text, text, int) from public;
grant  execute on function public.submit_creator_post(text, text, text, text, int) to authenticated;

-- ── get_creator_posts ────────────────────────────────
-- 一場的創作者分析 · anon 可讀 · handle + title + body + pick + price + created_at。
-- v1 全免費 · body 直接回。 Phase 2 selling:price_ntd>0 時 body gated until purchased。
create or replace function public.get_creator_posts(
  p_match_id text
)
returns table (handle text, title text, body text, pick text, price_ntd int, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    '球迷 #' || substr(md5(p.user_id::text), 1, 4) as handle,
    p.title,
    p.body,
    p.pick,
    p.price_ntd,
    p.created_at
  from public.creator_posts p
  where p.match_id = p_match_id
  order by p.created_at desc
  limit 50;
$$;

revoke execute on function public.get_creator_posts(text) from public;
grant  execute on function public.get_creator_posts(text) to anon;
grant  execute on function public.get_creator_posts(text) to authenticated;

-- ── get_my_creator_post ──────────────────────────────
-- 本人對某場的分析(控制 UI「一場一篇」state)
create or replace function public.get_my_creator_post(
  p_match_id text
)
returns table (title text, body text, pick text)
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
    select p.title, p.body, p.pick
    from public.creator_posts p
    where p.user_id = v_uid and p.match_id = p_match_id
    limit 1;
end;
$$;

revoke execute on function public.get_my_creator_post(text) from public;
grant  execute on function public.get_my_creator_post(text) to authenticated;


-- ================= 0006_my_predictions.sql =================

-- ── ZONE 27 · Migration 0006 · get_my_predictions ─────
-- Created: 2026-05-31
-- Purpose: 接通「押注 → 個人準度」迴路。
--   問題:賽事頁 UserPredictionPicker 把 picks 寫進 0003 predictions 表,
--         但 /member 儀表板還在讀舊的 user_metadata(lib/predictions.ts)→
--         球迷在賽事頁押了一邊,回儀表板看不到自己累積的準度 = retention
--         迴路斷(押完就斷線 · 不會回訪 · 直接傷訂閱轉換)。
--   解法:加一個 RPC 撈「本人所有 picks(跨場)」· /member app-side 對
--         lib/matches.ts 的 finalResult grade 算累積準度(grade 在 app-side ·
--         比賽結果不在 DB)。
--
-- 法律邊界不變:純精神預測 · 0 金額 · 0 金流(同 0003)。
-- Pattern same as 0003:RLS locked · 只走 SECURITY DEFINER · 本人只讀自己 ·
-- auth.uid() 綁定 · 0 PII broadcast。
-- ─────────────────────────────────────────────────────

-- ── RPC · get_my_predictions ─────────────────────────
-- 本人讀自己所有預測(跨場 · newest first)。未登入回空集合。
-- 對齊 get_my_prediction(單場)· 升級成跨場 = /member 累積準度的資料源。

create or replace function public.get_my_predictions()
returns table (match_id text, pick text, created_at timestamptz)
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
    select p.match_id, p.pick, p.created_at
    from public.predictions p
    where p.user_id = v_uid
    order by p.created_at desc;
end;
$$;

revoke execute on function public.get_my_predictions() from public;
grant  execute on function public.get_my_predictions() to authenticated;


-- ================= 0007_creator_records.sql =================

-- ── ZONE 27 · Migration 0007 · Creator Records(作者公開戰績)──────
-- Created: 2026-06-01
-- Purpose: 讓「每篇分析旁邊,作者有多準」一眼可見 —— 玩運彩/報馬仔讓 tipster
--          掛「近 N 日 X 過 Y」當招牌賣明牌;ZONE 27 做誠實版:撈出每位創作者
--          鎖過的所有 (handle, match_id, pick) · app-side 對 finalResult 自動評
--          準/不準 → 算每人命中率 + 海選天梯名次。
--
--          差別(displacement weapon · per memory/project_zone27_polymarket_pivot):
--            報馬仔挑「近 15 天好看的窗」+ 輸了刪文藏戰績;這支 RPC 全撈、不挑窗、
--            連輸的都算 · 押的邊賽前鎖死(0003/0005)· 賴不掉。
--
-- 法律邊界(per memory/project_zone27_legal_redline):
--   · 0 金額欄位 · 0 PII(handle = md5 短碼 · 跟 get_creator_posts 同格式可對應)·
--     純精神預測準度 · 不碰真錢紅線。
--
-- 設計 same pattern as 0005 get_creator_posts:RLS-locked 表 · SECURITY DEFINER ·
--   anon 可讀(公開戰績 = 品牌核心 disclosure)· 所有欄位 qualify 表別名 p.(避免
--   42702 ambiguous · 同 0003/0005 的 created_at 教訓)。
-- ─────────────────────────────────────────────────────

-- 回傳所有創作者鎖過的選邊 · anon 可讀 · app 端 grade vs finalResult。
-- handle 格式跟 0005 get_creator_posts 完全一致(可在前端用 handle 對應)。
create or replace function public.get_creator_records()
returns table (handle text, match_id text, pick text)
language sql
security definer
set search_path = public
as $$
  select
    '球迷 #' || substr(md5(p.user_id::text), 1, 4) as handle,
    p.match_id,
    p.pick
  from public.creator_posts p
  order by p.created_at desc
  limit 2000;
$$;

revoke execute on function public.get_creator_records() from public;
grant  execute on function public.get_creator_records() to anon;
grant  execute on function public.get_creator_records() to authenticated;


-- ================= 0008_creator_purchases.sql =================

-- ── ZONE 27 · Migration 0008 · 賣分析「買了才解鎖」(creator_purchases)──
-- Created: 2026-06-01
-- Purpose: 把「創作者賣分析、平台抽傭」做成誠實版(同 玩運彩 高手賣預測流程,
--          但乾淨)。 付費分析的「完整內文」賽前不進公開 payload —— 只有
--          免費文 / 作者本人 / 已購買者 拿得到 body。 標題 + 推薦哪一邊 +
--          作者準度 badge 永遠公開(讓讀者決定買不買)= 賣得出去的前提
--          (內文不鎖好 = 一貼出去就被複製,沒人會買)。
--
--          購買 v1 = 手動(同會員轉帳模式):買家轉帳 → Tim 在 Supabase Studio
--          記一筆 creator_purchases(buyer_id, post_id)→ 買家刷新即解鎖。
--          0 自動金流 · 0 公司必要(小規模 = 個人所得)· 規模化真錢 payout
--          才要公司 + 會計 + 發票(per memory/zone27-legal-redline 🏢 段)。
--
-- 法律邊界(per memory/zone27-legal-redline):賣的是「分析內容」(Substack 式)·
--   0 賠率 · 0 簽賭明牌 · 不接賭注 · 不抽賭注傭。 點數市場(0003)維持 0 金錢。
--
-- 設計 same pattern as 0005:RLS-locked · SECURITY DEFINER · 全欄位 qualify
--   表別名(p. / cp.)防 42702 ambiguous(同 0003/0005 created_at 教訓)。
-- ─────────────────────────────────────────────────────

-- ── 1 · 購買紀錄表 ────────────────────────────────────
create table if not exists public.creator_purchases (
  id         uuid primary key default gen_random_uuid(),
  buyer_id   uuid not null references auth.users(id) on delete cascade,
  post_id    uuid not null references public.creator_posts(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 一人一篇一次(防重複記帳)
create unique index if not exists creator_purchases_one_per_buyer_post_idx
  on public.creator_purchases (buyer_id, post_id);

alter table public.creator_purchases enable row level security;
-- (No RLS policies = 無直接存取 · 全走下方 SECURITY DEFINER)

-- ── 2 · get_creator_posts 升級 · 付費未購 → body 不回 ──
-- 回傳欄位新增 post_id / is_paid / purchased → 改了 return shape · 先 drop 再 create。
-- body gating:免費(price=0)/ 作者本人 / 已購買者 → 回完整 body;其餘 → null。
drop function if exists public.get_creator_posts(text);
create or replace function public.get_creator_posts(p_match_id text)
returns table (
  post_id    uuid,
  handle     text,
  title      text,
  body       text,
  pick       text,
  price_ntd  int,
  created_at timestamptz,
  is_paid    boolean,
  purchased  boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  return query
  select
    p.id as post_id,
    '球迷 #' || substr(md5(p.user_id::text), 1, 4) as handle,
    p.title,
    case
      when p.price_ntd = 0 then p.body
      when v_uid = p.user_id then p.body
      when v_uid is not null and exists (
        select 1 from public.creator_purchases cp
        where cp.post_id = p.id and cp.buyer_id = v_uid
      ) then p.body
      else null
    end as body,
    p.pick,
    p.price_ntd,
    p.created_at,
    (p.price_ntd > 0) as is_paid,
    (
      v_uid is not null and (
        v_uid = p.user_id or exists (
          select 1 from public.creator_purchases cp
          where cp.post_id = p.id and cp.buyer_id = v_uid
        )
      )
    ) as purchased
  from public.creator_posts p
  where p.match_id = p_match_id
  order by p.created_at desc
  limit 50;
end;
$$;

revoke execute on function public.get_creator_posts(text) from public;
grant  execute on function public.get_creator_posts(text) to anon;
grant  execute on function public.get_creator_posts(text) to authenticated;


-- ================= 0009_wallet.sql =================

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
