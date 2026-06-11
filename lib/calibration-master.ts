// ── ZONE 27 · 校準大師 · 個人信心 vs 實際命中(純函式)──────────────────
// 把「你押注時宣告的把握(confidence)」對「賽後實際中沒中」逐桶比對 →
// 「你說 8 成的那些場、是不是真的中 8 成」。 538「Checking Our Work」的個人版。
//
// 🔴 誠實:
//   · 先鎖後結:押注時間 ≥ 開賽 → 不計(同戰績 late 剔除 · 賽後補登不算)。
//   · 含輸:沒中照進分母(校準的全部意義就是面對自己高估的地方)。
//   · 小樣本不亂下判語:verdict 要 ≥ VERDICT_MIN 場才給(圖/桶可早點顯示但標小樣本)。
// 純函式 deterministic · 0 import · 好測。
// ─────────────────────────────────────────────────────

export type CalibrationPick = {
  matchId: string;
  /** 三向:home / draw / away */
  pick: string;
  /** 宣告把握 1-99(整數百分比) */
  confidence: number;
  /** 押注時間 ISO(先鎖後結) */
  ts: string;
};

export type CalibrationResult = {
  /** 賽果:home / draw / away · null/"" = 還沒結算 */
  result: string | null;
  /** 開賽 ISO(先鎖後結 late 剔除) */
  startISO: string;
};

export type CalibrationBucket = {
  /** 桶代表的把握值(例如 80 = 你說 8 成的那些) */
  confidence: number;
  n: number;
  hits: number;
  /** 實際命中率 0-100 */
  actualPct: number;
};

export type CalibrationReport = {
  /** 有信心值的押注總數(含未結算 + late) */
  total: number;
  /** 已結算、先鎖後結後計入校準的場 */
  decided: number;
  /** 還沒結算 */
  pending: number;
  /** 開賽後才押 · 不計(看得見的剔除) */
  late: number;
  /** 平手 = push · 不計入分母(同全站 aggregateIdentity 口徑 · 棒球押 home/away 永不等於 tie) */
  push: number;
  buckets: CalibrationBucket[];
  /** 已結算場「平均宣告把握」%（整體一句話用) */
  statedAvg: number | null;
  /** 已結算場「實際命中率」% */
  actualAvg: number | null;
  /** over=過度自信(實際<宣告)· under=偏保守(實際>宣告)· good=蠻準 · null=資料不足 */
  verdict: "over" | "under" | "good" | null;
};

/** 個人軟判讀門檻:夠講一句「你偏向過度自信」· 圖上的點更早就畫但會標小樣本。 */
export const VERDICT_MIN = 10;
/** 判「準」的容差(實際與宣告差在 ±8 分內算蠻準)。 */
const GOOD_TOLERANCE = 8;

export function computeConfidenceCalibration(
  picks: CalibrationPick[],
  results: Record<string, CalibrationResult>,
): CalibrationReport {
  const byConf = new Map<number, { n: number; hits: number }>();
  let decided = 0;
  let pending = 0;
  let late = 0;
  let push = 0;
  let statedSum = 0;
  let hitSum = 0;

  for (const p of picks) {
    const r = results[p.matchId];
    if (!r || r.result === null || r.result === "") {
      pending += 1;
      continue;
    }
    // 平手 = push:全站口徑(aggregateIdentity / computeAccuracySeries)都把 tie 排除分母。
    // 棒球押注只有 home/away(0003/0018 約束),tie 永不等於 pick → 不能當「沒中」算進去。
    // (足球的 'draw' 是合法 pick · 不在此列 · 押和、結果和 = 真命中。)
    if (r.result === "tie") {
      push += 1;
      continue;
    }
    const t = Date.parse(p.ts);
    const k = Date.parse(r.startISO);
    if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) {
      late += 1;
      continue;
    }
    decided += 1;
    const hit = p.pick === r.result;
    statedSum += p.confidence;
    if (hit) hitSum += 1;
    const b = byConf.get(p.confidence) ?? { n: 0, hits: 0 };
    b.n += 1;
    if (hit) b.hits += 1;
    byConf.set(p.confidence, b);
  }

  const buckets: CalibrationBucket[] = [...byConf.entries()]
    .map(([confidence, { n, hits }]) => ({
      confidence,
      n,
      hits,
      actualPct: n > 0 ? (hits / n) * 100 : 0,
    }))
    .sort((a, b) => a.confidence - b.confidence);

  const statedAvg = decided > 0 ? statedSum / decided : null;
  const actualAvg = decided > 0 ? (hitSum / decided) * 100 : null;

  let verdict: CalibrationReport["verdict"] = null;
  if (decided >= VERDICT_MIN && statedAvg !== null && actualAvg !== null) {
    const gap = actualAvg - statedAvg; // 正 = 比說的準(保守)· 負 = 比說的差(過度自信)
    verdict = gap < -GOOD_TOLERANCE ? "over" : gap > GOOD_TOLERANCE ? "under" : "good";
  }

  return {
    total: picks.length,
    decided,
    pending,
    late,
    push,
    buckets,
    statedAvg,
    actualAvg,
    verdict,
  };
}
