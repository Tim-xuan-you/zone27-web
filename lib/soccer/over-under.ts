// ── ZONE 27 · 足球大小分(Over/Under)押注 · 純函式核心(server + client 共用)──────────
// Phase 1:讓會員賽前鎖「總分大小 2.5 · 看大 / 看小」。 引擎已算這條線(deriveSoccerMarkets)·
// 賽後用 90 分鐘正規賽終場總分對帳。
//
// 🔴 0 migration · 重用既有押注系統:把「玩法押注」掛在帶後綴的場號 `{fd-id}~ou25`,二選一
//   映射進現有 home/away(看大 = home · 看小 = away)→ submit_prediction / get_my_prediction /
//   get_match_prediction_tally 全部照用、pick CHECK(home/away/draw)一個字都不用改。
// 🔴 鐵律隔離:`~` 後綴的玩法押注**絕不**能混進「誰贏」的永久戰績 / 校準。 已在每個「誰贏」
//   消費端加 !includes("~") 守門(getMySoccerPicks · settlement-data · profile-server · pulse)。
//   漏一個 = 一筆大小分被當「誰贏」算 = 污染不可刪的帳本(品牌命門)。 改這支務必同步檢查那幾處。
// 🔴 線固定 2.5(運彩最常押 · 引擎也在 2.5 推導)→ 整數總分永遠不等於 2.5 = 無 push,乾淨二分。
// ─────────────────────────────────────────────────────

export const OU_LINE = 2.5;
const OU_SUFFIX = "~ou25";

/** 大小分玩法的場號(掛在原 fd- 場號後)· 跟「誰贏」場號區隔、又跟既有 RPC 相容。 */
export function ouMarketId(matchId: string): string {
  return `${matchId}${OU_SUFFIX}`;
}

/** 是否為大小分玩法場號(後綴判定)。 */
export function isOuMarketId(id: string): boolean {
  return id.endsWith(OU_SUFFIX);
}

export type OuSide = "over" | "under";

/** 內部映射:看大 = home · 看小 = away(二選一塞進既有 home/away · 0 migration)。 */
export function ouSideToPick(side: OuSide): "home" | "away" {
  return side === "over" ? "home" : "away";
}
export function pickToOuSide(pick: unknown): OuSide | null {
  if (pick === "home") return "over";
  if (pick === "away") return "under";
  return null;
}

/** 90 分鐘正規賽終場總分 → 大 / 小(2.5 線 · 整數無 push)。 */
export function ouResultFromScore(homeGoals: number, awayGoals: number): OuSide {
  return homeGoals + awayGoals >= 3 ? "over" : "under";
}
