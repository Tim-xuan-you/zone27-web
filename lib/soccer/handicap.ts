// ── ZONE 27 · 足球讓分(Asian Handicap ±0.5)押注 · 純函式核心(server + client 共用)──────
// Phase 2:賽前押「主 -0.5(主隊要贏)」或「客 +0.5(客隊不輸 = 贏或和)」。 引擎已算這條線。
//
// 🔑 用固定 0.5 線(最簡讓分):整數比分永遠不會剛好打平讓分 → 無 push、乾淨二分(同大小分 2.5)。
//   因此**不必把線值凍進場號**(更大的 1.5 / 2.5 讓分線會變、需凍線 → 留未來)。 Ron 那注
//   「奧地利 +0.5」= 客 +0.5 = 客隊贏或和,正好對上這條線。
//
// 🔴 0 migration · 同大小分:掛帶後綴場號 `{fd-id}~ah05`,pick 直接用 home/away(讓分側本來就是隊)·
//   重用 submit_prediction / get_my_prediction / get_match_prediction_tally。 `~ah05` 含 `~` → 已被
//   既有 5 處 `!includes("~")` 隔離守門擋在「誰贏」戰績/校準外(見 lib/soccer/over-under.ts 隔離說明)。
// ─────────────────────────────────────────────────────

export const AH_LINE = 0.5;
const AH_SUFFIX = "~ah05";

/** 讓分玩法的場號。 */
export function ahMarketId(matchId: string): string {
  return `${matchId}${AH_SUFFIX}`;
}
/** 是否為讓分玩法場號。 */
export function isAhMarketId(id: string): boolean {
  return id.endsWith(AH_SUFFIX);
}

/** home = 主 -0.5(主隊要贏才過)· away = 客 +0.5(客隊贏或和都過)。 pick 直接就是隊側。 */
export type AhSide = "home" | "away";

/**
 * 90 分鐘終場 → 讓分 ±0.5 的贏家側。
 *   主隊贏(fh > fa)→ 主 -0.5 過(home);平或客隊贏(fh ≤ fa)→ 客 +0.5 過(away)。 無 push。
 */
export function ahResultFromScore(homeGoals: number, awayGoals: number): AhSide {
  return homeGoals > awayGoals ? "home" : "away";
}
