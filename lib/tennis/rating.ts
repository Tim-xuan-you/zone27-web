// ── ZONE 27 · 網球種子分:世界排名 → 實力分(誠實估計)──────────────────────────
// v0.2 真實賽程沒有每位球員的完整 Elo 歷史(尤其資格賽 / 低排名球員)→ 用「現時世界排名」
// 換算一個 Elo 風格的種子分。 這是公認的合理 baseline(學界:純排名預測已 ~65% 準度)·
// 我們誠實揭露「這是排名換算的估計值,不是磨厚的 Elo」· 隨真實賽果一場一場更新(Wave 3)。
//
// 單調遞減(排名數字越小越強):rank1 ≈ 2180、rank10 ≈ 1961、rank50 ≈ 1808、rank100 ≈ 1743、
// rank200 ≈ 1677。 對數曲線 = 頂尖之間差距大、長尾趨平(符合 Elo 與排名的實證關係)。
// ─────────────────────────────────────────────────────

const BASE = 2180;
const SLOPE = 95;

/** 世界排名 → 種子實力分(估計)。 rank 夾在 ≥1。 deterministic 純函式。 */
export function ratingFromRank(rank: number): number {
  const r = Math.max(1, rank);
  return Math.round(BASE - SLOPE * Math.log(r));
}
