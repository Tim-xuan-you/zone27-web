// ── ZONE 27 · Predictions (server-side read) ────────────
// 接通「押注 → 個人準度」迴路的最後一段接線。
//
// 問題(三路 audit agent 一致 #1 · migration 0006 header 也親自診斷):
//   賽事頁 / 首頁卡押注 → submitPrediction → 寫進 0003 `predictions` 表。
//   但 /member · /rewards 儀表板還在讀舊的 user_metadata.predictions
//   (lib/predictions.ts · 已無任何程式寫入)→ 球迷押了一邊,回儀表板
//   永遠看到 0 = 「押完斷線」· retention 迴路斷 · 直接傷訂閱轉換。
//
// 解法:這支 server-side wrapper 呼叫 migration 0006 的 get_my_predictions
//   RPC(本人跨場所有 picks)· 轉成 dashboard 早就看得懂的 UserPredictionsMap
//   形狀 → /member · /rewards 直接重用既有 aggregatePredictionStats grade。
//
// GRACEFUL:任何 error(0006 還沒套用 · 未登入 · Supabase 不可達)→ 回 {} ·
//   儀表板退回空狀態而非 crash · 且不再顯示誤導性的死讀數字。
//   ⚠ 要完全點亮需 Tim 在 Supabase Studio 套用 migration 0006。
// ─────────────────────────────────────────────────────

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserPredictionsMap } from "@/lib/predictions";

type RpcRow = {
  match_id?: unknown;
  pick?: unknown;
  created_at?: unknown;
};

/**
 * Read the logged-in user's predictions from the `predictions` table
 * (migration 0006 `get_my_predictions` RPC) and shape them into the same
 * UserPredictionsMap the dashboard already understands. Returns {} on any
 * error so callers degrade to the empty state instead of crashing.
 *
 * NOTE: the predictions table only stores "home" | "away" (no "skip"), so
 * the map's pick is always a decided side here.
 */
export async function getMyPredictionsMap(): Promise<UserPredictionsMap> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return {};
    const map: UserPredictionsMap = {};
    for (const row of data as RpcRow[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : null;
      // 🔴 足球(fd-*)走完全獨立的計算(三向 + 自己的結算/天梯 · 準度分開算)·
      //   絕不混進棒球帳本 —— 否則世界盃押注會灌爆首頁戰績條 / /ladder 入場門檻 /
      //   /member 校準身分(且足球沒結算 = 永遠 pending 灌不掉)。 棒球只認 cpbl-*/mlb-*。
      if (!matchId || matchId.startsWith("fd-")) continue;
      const pick =
        row.pick === "home" || row.pick === "away" ? row.pick : null;
      const ts = typeof row.created_at === "string" ? row.created_at : "";
      // ts(created_at)缺失/非字串 → 整列丟棄 · 讓「數天數」(aggregateStreak)與
      // 「算準度」(aggregateIdentity)對同一壞列一致(否則 identity fail-open 計入、
      // streak 卻丟掉 = 兩面數字打架)。 timestamptz 實務上必為字串 · 純防禦不變既有行為。
      if (pick && ts) map[matchId] = { pick, ts };
    }
    return map;
  } catch {
    return {};
  }
}
