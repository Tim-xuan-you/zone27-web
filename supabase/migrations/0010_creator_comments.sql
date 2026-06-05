-- ── ZONE 27 · Migration 0010 · Creator Post Comments(分析下的回覆串)──
-- ⚠️⚠️ 切勿在裝完 0015(2026-06-05)後「整支」重跑這支 ⚠️⚠️
--   本檔的 §3 get_creator_comments 是舊的 4 欄版;0015 已把它升級成 6 欄版
--   (加 author_code + display_name)。 整支重跑會把 0015 的升級打回去(倒退/或 42P13)。
--   42702 修復只需單獨套 §2 submit_creator_comment(寫入函式 · 0015 沒碰)= 已於 2026-06-05 套上。
--   全新 DB 從 0001 依序套到 0015 沒問題(0015 在後面會贏);landmine 只在「0015 後整支重跑 0010」。
-- Created: 2026-06-02
-- Purpose: Tim 2026-06-02 dogfood 抓到的真缺口 —— 創作者分析「只能發一篇、不能互動」:
--          「用戶要針對某人的文章回覆怎麼辦?賣文章的人要回覆買的人怎麼辦?」
--          報馬仔/玩運彩有討論串(2樓、推、回覆)但 0 問責(輸了刪文)。
--
--          關鍵設計分離(brand IP · 不可混淆):
--            · 預測(選邊 pick)仍「一場一篇 · 鎖死 · 賽後自動評」= ✓已驗證準度 章的根基(0005 不動)
--            · 回覆(comment)無上限 · 純文字 · 不選邊 · 不評分 = 純對話層(本 migration)
--          → 拿到玩運彩的互動性,又不丟掉它永遠做不到的「賽後賴不掉的戰績」。
--
-- 法律邊界(per memory/project_zone27_legal_redline.md):
--   · 此表 0 金額欄位 · 0 金流 · 純文字。 真錢只在「賣分析內容」那側(0008/0009)走。
--
-- 設計 same pattern as 0004 game_posts:RLS locked · SECURITY DEFINER submit/get ·
--   handle = 「球迷 #XXXX」(user_id md5 前 4 碼 · 0 PII · 跟分析署名同一碼)。
--   作者本人的回覆 is_author = true(UI 標「作者」· 解 Tim「賣家回覆買家」需求)。
--   Moderation v1 = Tim 用 Supabase Studio 刪 row · in-app 刪 = Phase 3(需 ADMIN_EMAIL)。
-- ─────────────────────────────────────────────────────

-- ── 1 · Table ────────────────────────────────────────
create table if not exists public.creator_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.creator_posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

-- 依 post_id 讀一篇分析的回覆串(舊到新)
create index if not exists creator_comments_post_idx
  on public.creator_comments (post_id, created_at asc);

alter table public.creator_comments enable row level security;

-- (No RLS policies = no direct table access · 全走下方 SECURITY DEFINER)

-- ── 2 · RPC · submit_creator_comment ─────────────────
-- 登入 user 對某篇分析回覆 ≤500 字。 無「一場一篇」限制(可多次回覆 = 真互動)。
--   · 未登入 → 'not_logged_in'
--   · body trim 後空 或 >500 → 'invalid_body'
--   · post 不存在 → 'post_not_found'
create or replace function public.submit_creator_comment(
  p_post_id uuid,
  p_body    text
)
returns table (comment_id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid  uuid;
  v_body text;
  v_id   uuid;
  v_at   timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_logged_in';
  end if;

  v_body := trim(coalesce(p_body, ''));
  if v_body = '' or char_length(v_body) > 500 then
    raise exception 'invalid_body';
  end if;

  if not exists (select 1 from public.creator_posts cp where cp.id = p_post_id) then
    raise exception 'post_not_found';
  end if;

  -- ⚠️ qualify 表名:RETURNS TABLE 的 out 欄 created_at 會跟表的 created_at 撞名
  -- → 42702 ambiguous(同 R181 教訓)。 必須 creator_comments.created_at 點出來。
  insert into public.creator_comments (post_id, user_id, body)
  values (p_post_id, v_uid, v_body)
  returning creator_comments.id, creator_comments.created_at
  into v_id, v_at;

  return query select v_id, v_at;
end;
$$;

revoke execute on function public.submit_creator_comment(uuid, text) from public;
grant  execute on function public.submit_creator_comment(uuid, text) to authenticated;

-- ── 3 · RPC · get_creator_comments ───────────────────
-- 一篇分析的回覆串 · anon 可讀(免費看)· 舊到新 · 上限 200。
-- handle = 球迷 #XXXX(跟 0005 分析署名同碼)· is_author = 回覆者是否為原 po 主。
create or replace function public.get_creator_comments(
  p_post_id uuid
)
returns table (handle text, is_author boolean, body text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    '球迷 #' || substr(md5(c.user_id::text), 1, 8) as handle,
    (c.user_id = cp.user_id)                        as is_author,
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
