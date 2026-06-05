-- ── ZONE 27 · Migration 0013 · Creator Records 加 created_at(先鎖後結徽章)──
-- ⛔⛔ SUPERSEDED BY 0015(2026-06-05)· 切勿在裝完 0015 後單獨重跑這支 ⛔⛔
--   0013 只給 get_creator_records 加 created_at(4 欄版)。 0015 已把同一支 RPC 重建成
--   5 欄版(author_code + created_at 都有)· 完全涵蓋並超越本檔。 單獨重跑本檔會 drop +
--   重建回舊 4 欄版,把 0015 的永久碼洗掉(倒退)。 全新 DB 從 0001 依序套到 0015 沒問題
--   (0015 在後面會贏);只有「0015 之後再單獨跑 0013」才有害。 保留本檔僅為歷史順序完整性。
-- Created: 2026-06-04
-- Purpose: 補「✓ 已驗證準度」徽章的命門洞 —— 0007 的 get_creator_records 只回
--          (handle, match_id, pick),沒有發文時間戳,所以 app 端的 gradeAuthorRecords
--          無法判斷「這篇分析是不是賽前就鎖的」。 後果:有人直接打 RPC(或開賽後)
--          對「已經打完的比賽」發分析、選對的邊,就刷出完美徽章 + 爬天梯 = 正好反轉
--          品牌命門(招牌寫「賽前選邊鎖死、賴不掉」,徽章卻不驗「賽前」)。
--
--          這支把 created_at 加進回傳 → app 端 gradeAuthorRecords 就能丟掉「發文
--          時間 ≥ 開賽」的那些(同預測側 lib/predictions.ts isLatePick 的創作者鏡像)。
--          開賽時間在 app 端(lib/matches.ts),不在 DB,所以過濾在 app 端做;這支
--          只負責把時間戳交出來。 ⚠ server 端 RPC 寫入閘門(match_locks)仍是待補的
--          belt-and-suspenders(公開天梯/徽章正式上線前)。
--
-- ⚠ 改 RETURNS TABLE 形狀(加一欄)會撞 42P13「cannot change return type」→ 必須
--   先 drop 再建(同 0005 get_creator_posts 的教訓)。 create or replace 冪等可重跑。
-- ─────────────────────────────────────────────────────

drop function if exists public.get_creator_records();

create or replace function public.get_creator_records()
returns table (handle text, match_id text, pick text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    '球迷 #' || substr(md5(p.user_id::text), 1, 8) as handle,
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
