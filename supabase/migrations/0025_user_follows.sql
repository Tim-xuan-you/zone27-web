-- ── ZONE 27 · Migration 0025 · 追蹤一份帳本(user_follows · 私密追蹤)──────────
-- Created: 2026-06-12 · R229
-- Purpose: liveness 層最後一塊 —— 讓一個會員「追蹤」另一位的公開含輸帳本,使 /pulse
--   能切「只看我追的」、一眼看到你信得過的人剛在哪場賽前鎖了手。 R210 設計、R226-227
--   有真人(Tim 找來 10 個朋友 · 世界盃夜集中押注)後才建,不空殼。
--
-- 🔴 紅線(熱鬧但不變人氣場 · 同 liveness 設計):
--   · 追的是「校準曲線」不是人氣 —— 全站永遠不顯示粉絲數 / 追蹤數(名字旁只掛校準分)。
--   · 追蹤名單**私密** —— 你追了誰只有你自己看得到(RLS:follower_id = auth.uid())·
--     沒有任何 RPC 回「某人有幾個粉絲 / 誰追了誰」· 結構上爬不到、做不成人氣榜。
--   · 絕不一鍵跟單 —— 這支只記「我追了哪些碼」· 不碰押注、不複製單(盲跟老師是報馬仔之禍)。
--
-- 隱私 / 安全姿態(刻意比 0019 / 0022 更嚴 · 名單私密是本功能的命門):
--   · user_follows 維持 RLS-locked + 自己只讀自己那幾列的 SELECT policy(結構性私密)·
--     寫入一律走 SECURITY DEFINER 函式(toggle_follow)· anon / authenticated 都不能直接
--     對表 INSERT / DELETE。
--   · 三支函式**全部只 grant authenticated**(不像 0019/0022/0023 公開檔 grant anon)——
--     未登入由前端先攔下、根本不打這幾支 · 沒有任何「誰追了誰 / 某人幾個粉絲」的讀法。
--     刻意不做 get_follower_count / get_followers / 最多人追排行(一做就破「追校準非人氣」魂)。
--   · 只存「追蹤者 uuid → 被追蹤者永久碼」· 0 email · 0 PII(永久碼本就是公開署名 key)。
--   · 被追蹤者用「永久碼」而非 uid 記錄 —— 同全站身分慣例(天梯 / 公開檔 / 創作者署名都用碼)·
--     toggle_follow 內把目前登入者解成碼來擋「追蹤自己」· 呼叫端永遠不需要知道任何人的 uid。
--
-- 法律邊界(同 0003):純社群關係 · 0 金額欄位 · 不碰真錢。
--
-- 設計(同 0019 / 0022):helper z27_author_code(0014/0015)已存在,本檔不重建。
--   全欄位 qualify 表別名 uf(防 42702 ambiguous · 同 0003/0019 教訓)· create or replace /
--   if not exists 冪等可重跑。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(可重複安全)。
--   沒套之前:/u/[code] 的「追蹤這份帳本」鈕整顆 graceful 隱藏、/pulse「只看我追的」退空狀態
--   —— 頁面一律不破。 套完即活。
-- ─────────────────────────────────────────────────────

-- ── 1 · user_follows 表(追蹤者 → 被追蹤者永久碼)─────────────────────────
create table if not exists public.user_follows (
  follower_id   uuid        not null references auth.users (id) on delete cascade,
  -- 永久碼一律 8 碼小寫 hex(= substr(md5(uid),1,8))· CHECK 擋畸形 / 注入式輸入入庫。
  followed_code text        not null check (followed_code ~ '^[0-9a-f]{8}$'),
  created_at    timestamptz not null default now(),
  primary key (follower_id, followed_code)
);

-- 查「我追了誰」的列(get_my_following · pulse 篩選)會用 follower_id 過濾 · 加索引。
create index if not exists user_follows_follower_idx
  on public.user_follows (follower_id);

-- ── 2 · RLS:私密 —— 你只看得到自己追了誰 ──────────────────────────────
alter table public.user_follows enable row level security;

-- 自己只讀自己那幾列(結構性私密 · 防任何人撈別人的追蹤名單做人氣榜)。
-- 寫入不開 policy → 直接 INSERT/DELETE 一律被擋,只能走 toggle_follow(SECURITY DEFINER)。
drop policy if exists user_follows_self_select on public.user_follows;
create policy user_follows_self_select
  on public.user_follows
  for select
  using (follower_id = auth.uid());

-- ── 3 · toggle_follow · 追蹤 / 取消追蹤(冪等切換)────────────────────────
-- 回傳新狀態文字:'following'(剛追)/ 'not_following'(剛取消)/ 'self'(不能追自己 · 不寫入)/
--   'anon'(未登入 · 不寫入)/ 'invalid'(碼非 8 碼 hex)。 追蹤者 = auth.uid()(server 認定 · 不信前端)。
create or replace function public.toggle_follow(p_code text)
returns text
language plpgsql
security definer
set search_path = public
volatile
as $$
declare
  v_uid    uuid := auth.uid();
  v_code   text := lower(trim(coalesce(p_code, '')));
  v_self   text;
  v_exists boolean;
begin
  if v_uid is null then
    return 'anon';
  end if;
  -- 永久碼一律 8 碼小寫 hex · 擋畸形輸入(同 CHECK constraint)。
  if v_code !~ '^[0-9a-f]{8}$' then
    return 'invalid';
  end if;
  -- 把目前登入者解成永久碼 · 擋「追蹤自己」(同碼)。
  v_self := public.z27_author_code(v_uid);
  if v_code = v_self then
    return 'self';
  end if;

  select exists (
    select 1 from public.user_follows uf
    where uf.follower_id = v_uid and uf.followed_code = v_code
  ) into v_exists;

  if v_exists then
    delete from public.user_follows uf
      where uf.follower_id = v_uid and uf.followed_code = v_code;
    return 'not_following';
  else
    insert into public.user_follows (follower_id, followed_code)
      values (v_uid, v_code)
      on conflict (follower_id, followed_code) do nothing;
    return 'following';
  end if;
end;
$$;

revoke execute on function public.toggle_follow(text) from public;
grant  execute on function public.toggle_follow(text) to authenticated;

-- ── 4 · get_follow_state · 這份帳本我追了沒(按鈕初始狀態)──────────────────
-- 回:'anon'(未登入)/ 'self'(自己的檔案 · 不顯示鈕)/ 'following' / 'not_following'。
create or replace function public.get_follow_state(p_code text)
returns text
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_uid  uuid := auth.uid();
  v_code text := lower(trim(coalesce(p_code, '')));
  v_self text;
begin
  if v_uid is null then
    return 'anon';
  end if;
  v_self := public.z27_author_code(v_uid);
  if v_code = v_self then
    return 'self';
  end if;
  if exists (
    select 1 from public.user_follows uf
    where uf.follower_id = v_uid and uf.followed_code = v_code
  ) then
    return 'following';
  end if;
  return 'not_following';
end;
$$;

revoke execute on function public.get_follow_state(text) from public;
grant  execute on function public.get_follow_state(text) to authenticated;  -- 只給登入者 · 未登入由前端攔下不打

-- ── 5 · get_my_following · 我追蹤的永久碼集合(私密 · pulse 篩選用)──────────
-- 只回「我自己」追的碼(follower_id = auth.uid())· 永遠不回別人追了誰。 未登入 → 0 列。
create or replace function public.get_my_following()
returns table (followed_code text)
language sql
security definer
set search_path = public
stable
as $$
  select uf.followed_code
  from public.user_follows uf
  where uf.follower_id = auth.uid();
$$;

revoke execute on function public.get_my_following() from public;
grant  execute on function public.get_my_following() to authenticated;  -- 私人名單 · 只給登入者 · 未登入由前端攔下不打
