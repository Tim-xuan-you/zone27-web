// ── ZONE 27 · 校準分箱(共用)· 棒球 + 網球 ───────────────────────────────────
// /calibration 與 /engines 共用同一份「引擎說的 vs 實際發生」分箱數學。
// 足球的同名邏輯在 lib/soccer/calibration.ts(隔離在 soccer 模組)· 三者回傳的箱形狀
// 結構相同(CalibrationBin)· 同一個 <ReliabilityDiagram /> 三運動共畫。
//
// 「favorite」= 引擎開盤裡機率最高的那一邊 · favoriteWon = 那邊真的中。 含輸照算
// (diverged 一樣進分母)· 各運動各自分箱、絕不混池(混池會遮掉各運動真實校準)。
// ─────────────────────────────────────────────────────

import { type Match } from "@/lib/matches";
import { TENNIS_DRAW, drawLine } from "@/lib/tennis/matches";
import mlbLocked from "@/lib/mlb-locked.json";

/** 一個校準箱 · 三運動共用形狀(soccer 的 SoccerCalibrationBin 結構相同)。 */
export type CalibrationBin = {
  centerPct: number;
  count: number;
  /** 該箱內引擎看好邊實際中的比例 0-100 */
  favoriteActualPct: number;
};

/** 把整組分箱壓成一句白話判決用的數字(/calibration hero「答案先講」)。 */
export type CalibrationSummary = {
  /** 引擎明確看好一邊(fav>50)、且已結算非和局的總場數 = 分箱場數加總。 */
  decided: number;
  /** 這些場裡、引擎看好邊實際中的整體比例 0-100(場數加權)。 */
  favoriteHitPct: number;
};

/**
 * 把 computeBaseballBins / computeTennisBins / computeSoccerBins 任一輸出
 * 壓成單一「喊看好的那邊、實際中幾成」總結 · 純函式 · 不挑運動。
 * 散點圖逐桶細節留在 <ReliabilityDiagram /> · 這個只給最上方一句話用。
 */
export function summarizeBins(bins: CalibrationBin[]): CalibrationSummary {
  let decided = 0;
  let favWins = 0;
  for (const b of bins) {
    decided += b.count;
    // favoriteActualPct = favWins/count*100 · 還原整數場數避免浮點誤差。
    favWins += Math.round((b.favoriteActualPct / 100) * b.count);
  }
  return {
    decided,
    favoriteHitPct: decided > 0 ? (favWins / decided) * 100 : 0,
  };
}

/**
 * 共用分箱骨架:一筆 = { favPct, favoriteWon } → 10 寬箱(center 5,15,...,95)。
 * 🔴 真・五五波(favPct ≤ 50)一律不進 —— 不讓銅板局假裝有 favorite(全運動同一把尺;
 *   舊版網球漏了這道閘,50/50 的線會灌進 55 箱當假 favorite · R296 碼審修)。
 * 各運動只負責「怎麼取出 favPct / favoriteWon」· 箱寬/門檻/排序永遠只有這一份。
 */
function binFavoriteOutcomes(
  rows: Iterable<{ favPct: number; favoriteWon: boolean }>,
): CalibrationBin[] {
  const buckets = new Map<number, { favoriteWins: number; total: number }>();
  for (const r of rows) {
    if (r.favPct <= 50) continue;
    const centerPct = Math.min(Math.floor(r.favPct / 10), 9) * 10 + 5;
    if (!buckets.has(centerPct)) buckets.set(centerPct, { favoriteWins: 0, total: 0 });
    const b = buckets.get(centerPct)!;
    b.total++;
    if (r.favoriteWon) b.favoriteWins++;
  }
  return Array.from(buckets.entries())
    .map(
      ([centerPct, { favoriteWins, total }]): CalibrationBin => ({
        centerPct,
        count: total,
        favoriteActualPct: (favoriteWins / total) * 100,
      })
    )
    .sort((a, b) => a.centerPct - b.centerPct);
}

/**
 * 棒球(CPBL)校準分箱 · 由 getFinalizedMatches() 餵入(同 /calibration)。
 * favorite = winRate > 50 的那邊 · 和局 = push 不進分母 · 含輸照算 · 純函式。
 */
export function computeBaseballBins(finalized: Match[]): CalibrationBin[] {
  const rows: { favPct: number; favoriteWon: boolean }[] = [];
  for (const m of finalized) {
    const fr = m.finalResult;
    if (!fr || fr.winner === "tie") continue; // 和局 = push(同 getCalibration tie→push)
    const homeFav = m.home.winRate >= m.away.winRate;
    rows.push({
      favPct: Math.max(m.home.winRate, m.away.winRate),
      favoriteWon:
        (homeFav && fr.winner === "home") || (!homeFav && fr.winner === "away"),
    });
  }
  return binFavoriteOutcomes(rows);
}

/**
 * MLB 校準分箱 · 同一套骨架,資料源是 lib/mlb-locked.json(Action 賽前鎖 · 賽後 grade)。
 * verdict 就是「引擎看好邊中沒中」對鎖定值的判定(proved/diverged 進箱 · push/tie/void/null
 * 不進)—— 直接用它,零重算 = 跟 /track-record 同一份判定零漂移。
 * 🔴 跟 CPBL 絕不混池(混池會遮掉各聯盟真實校準)· 各畫各的。
 * module memo:JSON 是 build 時靜態 import、部署前不變 → 每 process 算一次就夠
 * (/calibration + /engines 每次 ISR 各重掃一輪 ~500+ 筆是純浪費)。
 */
let mlbBinsMemo: CalibrationBin[] | null = null;
export function computeMlbBins(): CalibrationBin[] {
  if (mlbBinsMemo) return mlbBinsMemo;
  type MlbPred = { engineWinHomePct?: number; verdict?: string | null };
  const rows: { favPct: number; favoriteWon: boolean }[] = [];
  for (const p of (mlbLocked.predictions ?? []) as MlbPred[]) {
    if (p.verdict !== "proved" && p.verdict !== "diverged") continue;
    if (typeof p.engineWinHomePct !== "number") continue;
    rows.push({
      favPct: Math.max(p.engineWinHomePct, 100 - p.engineWinHomePct),
      favoriteWon: p.verdict === "proved",
    });
  }
  mlbBinsMemo = binFavoriteOutcomes(rows);
  return mlbBinsMemo;
}

/**
 * 網球校準分箱 · 兩向(無和局)· 同一套骨架。
 * favorite = drawLine 兩向裡機率較高的一邊 · 只算「引擎有開盤且已結算」的場 · 含輸照算。
 * 賽果空 → 空陣列(誠實 N=0)。 純函式 · server-safe。
 */
export function computeTennisBins(): CalibrationBin[] {
  const rows: { favPct: number; favoriteWon: boolean }[] = [];
  for (const m of TENNIS_DRAW) {
    const line = drawLine(m);
    const fr = m.finalResult;
    if (!line || !fr) continue; // 沒開盤 / 沒結算 → 略過
    rows.push({
      favPct: Math.max(line.aWin, line.bWin),
      favoriteWon: line.pick === fr.winner,
    });
  }
  return binFavoriteOutcomes(rows);
}
