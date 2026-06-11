// ── ZONE 27 · 足球引擎校準分箱(soul-roadmap R208 #4 · /calibration 運動 filter)──────
// 鏡 app/calibration/page.tsx 的棒球 computeBins,但吃足球的三向引擎開盤
// (homeWinPct / drawPct / awayWinPct · 鎖在 lib/soccer-locked.json)。
//
// 「favorite」= 引擎開盤裡機率最高的那一邊(可能是和局)· 跟棒球「>50% 那邊」同精神。
// 已結算(outcome !== null)才進箱;verdict==="proved" = 引擎看好的邊真的中。
//
// 🔴 紅線(同棒球):
//   · 含輸照算 —— diverged 一樣進分母 · 不藏。
//   · 跟棒球分開算 —— 各運動各自套 N≥30 門檻 · 絕不把兩運動混成一條曲線。
//   · 目前足球 0 場已結算(世界盃 6/11 才開賽)→ 回空陣列 · UI 顯示誠實「已鎖未結算」frame。
// ─────────────────────────────────────────────────────

import { getLockedSoccerPredictions } from "@/lib/soccer/locked";

/** 一個校準箱 · 同棒球 Bin 形狀(視覺對齊)。 */
export type SoccerCalibrationBin = {
  centerPct: number;
  count: number;
  /** 該箱內引擎看好邊實際中的比例 0-100 */
  favoriteActualPct: number;
};

/** 已結算(可評分)的足球場數 · 給 /calibration 的 N 門檻誠實判定。
 *  ⚠ 條件必須跟 computeSoccerBins 完全一致(outcome 且 verdict 都齊)· 否則
 *  「顯示 N」會比實際畫進圖的點多 —— 且 outcome 有、verdict 還沒(評分中途)會讓
 *  n≠0,害足球側顯示空圖而不是「已鎖未結算」frame。 */
export function getSoccerGradedCount(): number {
  return getLockedSoccerPredictions().filter(
    (p) => p.outcome !== null && p.verdict !== null && p.verdict !== "push"
  ).length;
}

/**
 * 把已結算的足球鎖定盤分箱(10 寬 · center 5,15,...,95 · 同棒球)。
 * favorite = 三向開盤裡機率最高的一邊;favoriteWon = verdict==="proved"
 * (引擎 enginePick 就是看好的最高機率邊 · grade 時已對 outcome 算出 verdict)。
 * 0 場已結算 → 空陣列。
 */
export function computeSoccerBins(): SoccerCalibrationBin[] {
  const buckets = new Map<number, { favoriteWins: number; total: number }>();

  for (const p of getLockedSoccerPredictions()) {
    if (p.outcome === null || p.verdict === null) continue; // 未結算 · 略過
    if (p.verdict === "push") continue; // 三向平手無偏向 · 不進分母(同 SoccerEngineRecord · 全站「push 不算」口徑)
    // 三向市場:favorite = 引擎開盤機率最高的那一邊(常落在 35-55% · 不套棒球二元
    // 的「>50 才算 favorite」· 否則三向的方向性判斷會被整批丟掉)。 校準問的是
    // 「引擎說最高那邊 X% · 真的中 X% 嗎」· 對任何信心水平都成立。
    const favPct = Math.max(p.homeWinPct, p.drawPct, p.awayWinPct);
    const binIndex = Math.min(Math.floor(favPct / 10), 9);
    const centerPct = binIndex * 10 + 5;

    if (!buckets.has(centerPct)) buckets.set(centerPct, { favoriteWins: 0, total: 0 });
    const b = buckets.get(centerPct)!;
    b.total++;
    if (p.verdict === "proved") b.favoriteWins++; // 引擎看好的那邊中了
  }

  return Array.from(buckets.entries())
    .map(
      ([centerPct, { favoriteWins, total }]): SoccerCalibrationBin => ({
        centerPct,
        count: total,
        favoriteActualPct: (favoriteWins / total) * 100,
      })
    )
    .sort((a, b) => a.centerPct - b.centerPct);
}
