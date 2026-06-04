-- ── ZONE 27 · Migration 0014 · 公開顯示名(取代「球迷 #hash」)──
-- Created: 2026-06-04 · R197
-- Purpose: Tim dogfood「球迷 #46f6741a 根本不知道是誰 · 用戶能不能自己設名字?」。
--   現在 handle = user_id 的 md5 前 8 碼(0 PII 預設 · 沒人味 · 賣分析也難讓人記住)。
--   會員可在 /member 設「公開顯示名」(存 auth user_metadata.display_name · 前端已做)。
--   本檔讓三支讀取 RPC 把 handle 換成 coalesce(顯示名, 球迷 #hash):
--     設了名字 → 顯示名;沒設 → 維持匿名代號(隱私預設不變)。
--
-- 隱私:顯示名是會員「主動 opt-in」公開的(預設仍匿名代號)· 只讀
--   raw_user_meta_data->>'display_name' 這一欄(user 自己填的)· 0 email / 0 其他 PII。
-- 風險:回傳型別「完全不變」(handle 仍 text · 欄位數不變)→ 無 42P13 cannot-change-return。
--   全欄位 qualify 表別名(防 42702)· create or replace 冪等可重跑(無需先 drop)。
-- 依賴(prod 已是這些版本):0008 get_creator_posts(9 欄)· 0010 get_creator_comments ·
--   0013 get_creator_records。 本檔只換 handle 運算式 + 加一支 helper · 其餘邏輯原封不動。
-- ─────────────────────────────────────────────────────

-- ── 0 · helper · uid → 公開 handle(顯示名 or 匿名代號)──
-- SECURITY DEFINER:以 owner 身分讀 auth.users(一般 role 讀不到)。 STABLE。
-- 顯示名 trim 後為空 → 退回匿名代號(防有人存空字串把署名洗掉)。
create or replace function public.z27_display_handle(p_uid uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    nullif(
      trim((select u.raw_user_meta_data ->> 'display_name'
            from auth.users u where u.id = p_uid)),
      ''
    ),
    '球迷 #' || substr(md5(p_uid::text), 1, 8)
  );
$$;

revoke execute on function public.z27_display_handle(uuid) from public;
grant  execute on function public.z27_display_handle(uuid) to anon;
grant  execute on function public.z27_display_handle(uuid) to authenticated;

-- ── 1 · get_creator_posts · 換 handle(其餘同 0008 原封不動)──
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
    public.z27_display_handle(p.user_id) as handle,
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

-- ── 2 · get_creator_comments · 換 handle(其餘同 0010 原封不動)──
create or replace function public.get_creator_comments(p_post_id uuid)
returns table (handle text, is_author boolean, body text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    public.z27_display_handle(c.user_id) as handle,
    (c.user_id = cp.user_id)             as is_author,
    c.body,
    c.created_at
  from public.creator_comments c
  join public.creator_posts cp on cp.id = c.post_id
  where c.post_id = p_post_id
  order by c.created_at asc
  limit 200;
$$;

revoke execute on function public.get_creator_comments(uuid) from public;
grant  execute on function public.get_creator_comments(uuid) to anon;
grant  execute on function public.get_creator_comments(uuid) to authenticated;

-- ── 3 · get_creator_records · 換 handle(其餘同 0013 原封不動)──
-- 徽章用 handle 當 key(records[p.handle])· 三支都用同一 helper → key 才對得上。
create or replace function public.get_creator_records()
returns table (handle text, match_id text, pick text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    public.z27_display_handle(p.user_id) as handle,
    p.match_id,
    p.pick,
    p.created_at
  from public.creator_posts p
  order by p.created_at desc
  limit 2000;
$$;

revoke execute on function public.get_creator_records() from public;
grant  execute on function public.get_creator_records() to anon;
grant  execute on function public.get_creator_records() to authenticated;
