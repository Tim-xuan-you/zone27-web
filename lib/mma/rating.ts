// ── ZONE 27 · MMA 種子分:戰力錨點(Elo 風格 · 誠實估計)──────────────────────────
// v0.1 還沒有每位選手磨厚的逐戰 Elo → 用「公開戰績 + FightMatrix 風格排名」種子化一個 Elo 風格
// 實力分(完全等同網球從 ATP、羽球從 BWF 起手的種子分)。 誠實揭露:這是估計值、不是官方數據,
// 隨真實賽果一場一場更新(Wave 2)。 同網球 / 羽球 rating.ts 紀律。
//
// 錨點(Elo 風格 · 只有「差距」有意義,絕對值不重要 · 配 engine.ts 壓平的 /700 曲線):
//   冠軍 / P4P 級 ~2150、頂尖排名(前 5)~2000、排名內(前 15)~1850、門將 / 邊緣排名 ~1700、
//   一般名單 / 淘汰邊緣 ~1550。 新人 / 資料太薄 / 認不出 → 不是給一個保底分,是誠實「算不出、不開盤」。
//   壓平曲線下:冠軍(2150) vs 一般名單(1550)= 600 分差 ≈ 88%(對齊重磅熱門真實上限,不喊穩贏)。
//   隔壁等級之間(~150 分差)≈ 70/30,同等級(~0 分差)≈ 銅板 —— MMA 本來就接近銅板帶傾向。
// ─────────────────────────────────────────────────────

/** 編輯種子用的戰力等級(配真實戰績判斷 · 認不出就別硬塞,走「算不出」)。 */
export type MmaTier =
  | "champion" // 冠軍 / P4P 級
  | "elite" // 頂尖排名(前 5)
  | "ranked" // 排名內(前 15)
  | "gatekeeper" // 門將 / 邊緣排名
  | "roster"; // 一般名單 / 淘汰邊緣

/** 等級 → Elo 風格種子分(估計)· deterministic 純函式。 */
export const MMA_ANCHORS: Record<MmaTier, number> = {
  champion: 2150,
  elite: 2000,
  ranked: 1850,
  gatekeeper: 1700,
  roster: 1550,
};

/** 戰力等級 → 種子實力分(估計)。 認不出 / 資料太薄的選手不該叫這支(走「算不出、不開盤」)。 */
export function ratingFromTier(tier: MmaTier): number {
  return MMA_ANCHORS[tier];
}

// UFC 官方排名(分量級 · 冠軍 + 前 15)→ 種子分(只有「排名得出來」的選手能用;絕大多數名單外選手
// 沒有官方排名 → 用 ratingFromTier 編輯判斷,或誠實「算不出」)。 champion(rank 0)~2150、
// rank1 ~2000、rank15 ~1820 · 線性內插(排名內差距不大,符合「前 15 都很強、互有勝負」)。
export function ratingFromUfcRank(rank: number): number {
  if (rank <= 0) return MMA_ANCHORS.champion; // 冠軍
  const r = Math.max(1, Math.min(15, rank));
  // rank1 = 2000(elite),rank15 = 1820(剛進排名)· 線性。
  return Math.round(2000 - ((r - 1) / 14) * 180);
}
