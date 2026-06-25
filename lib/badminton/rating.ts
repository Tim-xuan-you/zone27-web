// ── ZONE 27 · 羽球種子分:BWF 世界排名 → 實力分(誠實估計)──────────────────────
// v0.1 還沒有每位球員磨厚的 Elo 歷史 → 用「BWF 世界排名」換算一個 Elo 風格的種子分。 這是
// 公認的合理 baseline(racket-sport 文獻:純排名預測已 ~62-66% 準度)· 我們誠實揭露「這是
// 排名換算的估計值,不是磨厚的 Elo」· 隨真實賽果一場一場更新(Wave 2)。 同網球 rating.ts 紀律。
//
// 單調遞減(排名數字越小越強):rank1 ≈ 2120、rank10 ≈ 1913、rank30 ≈ 1814、rank50 ≈ 1768、
// rank100 ≈ 1706、rank200 ≈ 1643。 對數曲線 = 頂尖之間差距大、長尾趨平(符合 Elo 與排名的
// 實證關係)· 比網球曲線略平(羽球賽前可預測度跟網球同級,不假裝更陡 = 更敢喊)。
// ─────────────────────────────────────────────────────

const BASE = 2120;
const SLOPE = 90;

/** BWF 世界排名 → 種子實力分(估計)· rank 夾在 ≥1 · deterministic 純函式。 */
export function ratingFromRank(rank: number): number {
  const r = Math.max(1, rank);
  return Math.round(BASE - SLOPE * Math.log(r));
}
