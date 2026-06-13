-- ── ZONE 27 · Migration 0026 · 把「為什麼看好」變公開的賽前論點 ────────────────────
-- Created: 2026-06-13 · R231 「Polymarket go」
-- Purpose: 0024 已讓會員賽前鎖一句「我為什麼看好」,但那支(get_my_rationales)只回本人 —— 理由
--   等於私藏。 Polymarket / Manifold 的命脈是「公開的論點」:你看一場比賽,看到的不只是『誰押了
--   哪邊』,而是『誰押了哪邊、因為什麼』,而且那句話賽前就鎖死、連著他的公開含輸校準檔。
--   這支把「誰賽前鎖了這場」segment 從一排名字,升級成一張賽前論點記分板 = 報馬仔最撐不住的東西
--   (他事後才編故事;這裡賽前把話講死、賽後攤開看打不打臉)。
--
-- 做法:get_ladder_entries(0022 · segment / 天梯 / 脈動的共用資料源)多回一欄 rationale。
--   segment 元件讀這欄顯示一句理由 · 天梯/脈動忽略它(只多一欄、不改排名口徑)。
--
-- 🔴 安全 / 隱私姿態(重要 · 同 0022):
--   · 純加法 —— 只在 get_ladder_entries 的 returns table 多一欄 rationale(0024 已加的欄)·
--     完全不碰 submit_prediction / set_prediction_rationale / get_my_*。
--   · ⚠️ 改 returns table 的「欄位形狀」→ 不能光 create or replace(Postgres 會丟 42P13
--     「cannot change return type」)· 必須先 drop function if exists 再 create(同 0013 / 0020 / 0005
--     既有慣例)。 drop-if-exists + 重建 = 仍冪等可重跑(Tim 重貼也安全)。
--   · rationale 是「opt-in 才存在」:沒寫 = null = segment 不顯示那行(只有自己選擇講的人才公開)。
--     RationalePicker 已同步把 UI 文案講明「公開掛在這場」= 知情才寫(informed consent)。
--   · 只回本就公開的東西(永久碼公開署名 + 公開 handle + 賽前鎖死的一句理由)· 0 email · 0 uid · 0 PII。
--   · ≤200 字硬上限由 0024 的 check constraint 把關 · 純文字(前端 React 預設跳脫 · 不 set innerHTML)。
--
-- 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額 · 0 金流。
--
-- ⚠️ 知情同意(一次性 · 套用本 migration「之前」做):0024 的寫入 RPC 是這個窗才套用的,
--    所以理論上「舊文案(沒寫『公開』)下寫的理由」幾乎不存在(寫入路徑在今天之前是壞的)。
--    但「攤開前先驗、別假設」—— 套 0026 前先在 SQL Editor 跑一次:
--        select count(*) from public.predictions where rationale is not null;
--    · 回 0(幾乎確定)→ 沒有舊理由,直接套本 migration 即可。
--    · 回 >0(例如你自己測過)→ 那幾筆是「公開」文案上線前寫的、同意基礎不清楚 · 先跑一次:
--        update public.predictions set rationale = null where rationale is not null;
--      把它們清掉(清掉後該欄變 null · 用戶能在新『公開』文案下重寫)· 再套本 migration。
--    🔴 這條 NULL 是「一次性前置」· 故意不放進本 migration(否則重跑會把日後公開寫的理由也清掉)。
--
-- 套用:Tim 在 Supabase SQL Editor 貼整支、按 RUN 跑一次即可(drop+建 · 冪等可重貼)。
-- ─────────────────────────────────────────────────────

-- get_ladder_entries · 跨用戶撈所有押注 + 公開署名 + 賽前鎖死的理由(多 rationale 一欄)。
-- 其餘與 0022 同口徑(刻意仍不回 confidence · 天梯排名不吃信心值)。
-- 🔴 先 drop 再建:returns table 多了一欄 = 形狀變了 · 不 drop 直接 create or replace 會 42P13
--   (同 0013:24 的 get_creator_records · 無參數函式)。 drop if exists → 沒有也不報錯,冪等。
drop function if exists public.get_ladder_entries();
create or replace function public.get_ladder_entries()
returns table (
  author_code text,
  handle      text,
  match_id    text,
  pick        text,
  rationale   text,
  created_at  timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    public.z27_author_code(p.user_id)     as author_code,
    public.z27_display_handle(p.user_id)  as handle,
    p.match_id,
    p.pick,
    p.rationale,
    p.created_at
  from public.predictions p
  order by p.created_at desc
  limit 100000;
$$;

revoke execute on function public.get_ladder_entries() from public;
grant  execute on function public.get_ladder_entries() to anon;
grant  execute on function public.get_ladder_entries() to authenticated;
