-- ── ZONE 27 · Migration 0019 · 公開含輸 Profile 讀取(/u/[code])──────────
-- Created: 2026-06-08 · R204
-- Purpose: soul-roadmap P0 keystone —— 公開「含輸」個人檔案頁 /u/[code]。
--   任何人(anon · 免登入)用永久碼(z27_author_code = md5(user_id) 前 8 碼)看一位
--   會員攤開的、刪不掉的、含贏含輸的押注帳本(校準身分 + 對帳紀律 + 榮譽牆)。
--   = costly signal:敢把輸的也公開 = 報馬仔結構上做不到(他們靠藏輸活)。
--
--   讀「現成」資料(0003 predictions 表)· app 端用 aggregateIdentity / aggregateStreak /
--   gradeSoccerPicks 算 · 0 用戶就成立(Tim 今天就能把 URL 丟給一個懷疑者)。
--
-- 隱私模型(同既有公開面 · 不新增 PII 外洩):
--   · 預設匿名 —— 顯示「球迷 #碼」· 只有會員自己 opt-in 設了顯示名才露名字(同
--     0014/0015 get_creator_posts / get_creator_records 的既有公開規則)。
--   · 永久碼本就公開(創作者公開戰績早就用它當署名 key)· 把 profile 連到「真人」的唯一
--     方式 = 會員自己設顯示名,或自己把連結分享出去 = 全由用戶主動(隱私 by construction)。
--   · 0 email · 0 其他 PII · 只回押注(match_id / pick / created_at)+ 公開顯示身分。
--
-- 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額欄位 · 不碰真錢。
--
-- 設計(同 0007 / 0014 / 0015):predictions 表維持 RLS-locked · 兩支 SECURITY DEFINER
--   函式 · anon 可讀(公開戰績 = 品牌核心 disclosure)· 全欄位 qualify 表別名(防 42702
--   ambiguous · 同 0003/0005/0007 created_at 教訓)· create or replace 冪等可重跑。
--   helper z27_author_code / z27_display_name_raw / z27_display_handle(0014/0015)已存在,
--   本檔不重建,只新增兩支讀取函式。
--
-- 碰撞(birthday problem · 兩 uid 同前 8 碼):同 0015「同名不撞」風險聲明 —— 永久碼是
--   問責標記非唯一性保證。 get_profile_by_code 取最早註冊者顯示;get_predictions_by_code
--   會把同碼者的押注一起回(app 端按 matchId 去重 · 取最近一筆)= 與徽章/天梯既有行為一致。
-- ─────────────────────────────────────────────────────

-- ── 1 · get_profile_by_code · 用永久碼查公開身分(存在性 gate)──────────
-- 回該碼對應使用者的公開身分(永久碼 + 顯示名 raw + 顯示 handle)· 查無 → 0 列(前端 404)。
-- 掃 auth.users 比對 md5 前 8 碼(同 z27_author_code)· hex 統一小寫比對。
create or replace function public.get_profile_by_code(p_code text)
returns table (author_code text, display_name text, handle text)
language sql
security definer
set search_path = public
stable
as $$
  select
    public.z27_author_code(u.id)       as author_code,
    public.z27_display_name_raw(u.id)  as display_name,
    public.z27_display_handle(u.id)     as handle
  from auth.users u
  where substr(md5(u.id::text), 1, 8) = lower(trim(p_code))
  order by u.created_at asc
  limit 1;
$$;

revoke execute on function public.get_profile_by_code(text) from public;
grant  execute on function public.get_profile_by_code(text) to anon;
grant  execute on function public.get_profile_by_code(text) to authenticated;

-- ── 2 · get_predictions_by_code · 用永久碼查該員所有押注(含輸帳本)──────
-- 回該碼對應使用者的所有押注 · app 端按 match_id 開頭分運動:
--   · 棒球(cpbl-* / mlb-*)→ UserPredictionsMap → aggregateIdentity + aggregateStreak
--   · 足球(fd-*)        → SoccerPickRow      → gradeSoccerPicks
-- pick 含 'home' / 'away' / 'draw'(0018 已放寬)· created_at 給「先鎖後結」+ streak 日曆。
-- 不挑窗、不藏輸、全撈(同 get_creator_records 精神)· limit 5000 防爆。
create or replace function public.get_predictions_by_code(p_code text)
returns table (match_id text, pick text, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select p.match_id, p.pick, p.created_at
  from public.predictions p
  where substr(md5(p.user_id::text), 1, 8) = lower(trim(p_code))
  order by p.created_at desc
  limit 5000;
$$;

revoke execute on function public.get_predictions_by_code(text) from public;
grant  execute on function public.get_predictions_by_code(text) to anon;
grant  execute on function public.get_predictions_by_code(text) to authenticated;
