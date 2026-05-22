// ── ZONE 27 · Monte Carlo Engine v0.3 (DEV PREVIEW) ─────
// Round 41 W-A · Engine Lineup #2 從 DEV → LIVE · per [[feedback-no-
// waiting-rule]] 鐵律「不等 Q3」。
//
// v0.3 = v0.2 base + Park Factor adjustment on HR rate。
//
// Architecture decision per [[Lens Lifetime Pledge]] (R38 W-G):
//   - v0.2 stays viewable forever · 不 silently rotate · 不 modify
//   - v0.3 是 NEW file · wraps v0.2 atBatProbs() with park adjustment
//   - Default 仍 v0.2 · v0.3 opt-in via /lab dropdown(future ship)
//   - /audit Section 02 加 v0.3 ESTIMATION DISCLOSURE block
//   - /track-record + /calibration 將分別 ingest 每 engine version 的
//     calibration receipts · N≥30 後決定 v0.3 是否 promote default
//
// Park Factor adjustment mechanism:
//   - 每場 venue → lib/cpbl-parks.ts getParkFactorByVenue()
//   - Park R/G delta from CPBL baseline 9.5 → HR rate multiplier
//   - Formula:hrRateAdjusted = hrRate × (1 + (parkRunsPerGame - 9.5) /
//     9.5 × HR_PARK_SENSITIVITY)
//   - HR_PARK_SENSITIVITY = 0.5(保守 · 半 R/G delta 反映在 HR rate)·
//     全 effect 上 BABIP + 在外野 dimension factor 留 v0.4
//
// Brand IP 全 ✓:
//   - 0 prediction promise(visualizer · 不假 accuracy improvement)
//   - Pratfall · 主動承認 v0.3 only adjusts HR rate · 不 adjust BABIP /
//     in-play hit distribution / dimensions
//   - Costly Signaling · publish code + cite Park Factor source +
//     pre-commit「v0.3 → v0.4 accuracy delta TBD until N≥30 per engine」
//   - Disclosure · 延伸 /audit S02 ESTIMATION DISCLOSURE pattern
//   - Method Public · GitHub link in LensTrace v0.3 variant
// ─────────────────────────────────────────────────────

import type { PitcherStats } from "./matches";
import {
  atBatProbs as atBatProbsV02,
  sampleAtBat,
  type AtBatProbs,
  type GameResult,
} from "./simulator";
import {
  getParkFactorByVenue,
  CPBL_PARK_BASELINE_RUNS_PER_GAME,
} from "./cpbl-parks";

// ── v0.3 Park Factor sensitivity ────────────────────────
// 保守 sensitivity · 半 R/G delta 反映在 HR rate · 不全 effect 推上
// HR rate(避免 overcorrection)。 v0.4 將分 split:
//   - HR rate × park HR factor(更 fine-grained · 從 ballpark factor LD%)
//   - BABIP × park BABIP factor(green monster · marine layer 等地理)
//   - Run environment multiplier post-hoc(temperature · wind data)
const HR_PARK_SENSITIVITY = 0.5;

/**
 * v0.3 atBatProbs · v0.2 base + Park HR rate adjustment。
 *
 * 公開於 /audit Section 02 ESTIMATION DISCLOSURE block(v0.3 specific):
 *   - v0.2 base hrRate from K/9 BB/9 HR/9 等 pitcher stats(unchanged)
 *   - v0.3 multiplier:hrRate × (1 + (parkRG - 9.5) / 9.5 × 0.5)
 *   - Neutral park(9.5 R/G)= 1.0 multiplier · v0.3 ≡ v0.2 output
 *   - Hitter park(10.1 R/G in 樂天桃園)= 1.032 multiplier · ~3.2% HR
 *     rate boost
 *   - Pitcher park(9.0 R/G hypothetical)= 0.974 multiplier · ~2.6% HR
 *     rate reduction
 */
export function atBatProbsV03(
  pitcher: PitcherStats,
  venue: string
): AtBatProbs {
  const baseProbs = atBatProbsV02(pitcher);
  const park = getParkFactorByVenue(venue);

  if (!park) {
    // Venue not in cpbl-parks.ts data · gracefully fall back to v0.2
    // (per [[Lens Lifetime Pledge]] · don't silently rotate · publish
    //  「unknown venue → v0.2 fallback」 disclosure on /audit)
    return baseProbs;
  }

  const parkDelta = park.estimatedRunsPerGame - CPBL_PARK_BASELINE_RUNS_PER_GAME;
  const hrMultiplier = 1 + (parkDelta / CPBL_PARK_BASELINE_RUNS_PER_GAME) * HR_PARK_SENSITIVITY;

  // Apply HR adjustment · re-distribute removed/added probability mass
  // proportionally across all other outcomes(maintain Σ = 1)
  const newHr = baseProbs.HR * hrMultiplier;
  const hrDelta = newHr - baseProbs.HR;
  const otherTotal = 1 - baseProbs.HR;

  if (otherTotal <= 0) return baseProbs; // edge case · shouldn't happen

  // Scale all non-HR outcomes proportionally
  const scaleFactor = (otherTotal - hrDelta) / otherTotal;

  return {
    HR: newHr,
    K: baseProbs.K * scaleFactor,
    BB: baseProbs.BB * scaleFactor,
    "1B": baseProbs["1B"] * scaleFactor,
    "2B": baseProbs["2B"] * scaleFactor,
    "3B": baseProbs["3B"] * scaleFactor,
    GO: baseProbs.GO * scaleFactor,
    FO: baseProbs.FO * scaleFactor,
  };
}

// ── Half-inning simulation · v0.3 ───────────────────────
// Same as v0.2 but uses v0.3 probs
type Bases = [boolean, boolean, boolean];
const EMPTY: Bases = [false, false, false];

function applyOutcomeV03(
  outcome: "K" | "BB" | "HR" | "1B" | "2B" | "3B" | "GO" | "FO",
  bases: Bases
): { bases: Bases; runs: number; outs: number } {
  switch (outcome) {
    case "K":
    case "GO":
    case "FO":
      return { bases, runs: 0, outs: 1 };
    case "BB": {
      const [b1, b2, b3] = bases;
      if (b1 && b2 && b3) return { bases: [true, true, true], runs: 1, outs: 0 };
      if (b1 && b2) return { bases: [true, true, true], runs: 0, outs: 0 };
      if (b1) return { bases: [true, true, b3], runs: 0, outs: 0 };
      return { bases: [true, b2, b3], runs: 0, outs: 0 };
    }
    case "1B": {
      const [b1, b2, b3] = bases;
      let runs = 0;
      const next: Bases = [true, false, false];
      if (b3) runs++;
      if (b2) {
        if (Math.random() < 0.6) runs++;
        else next[2] = true;
      }
      if (b1) {
        if (Math.random() < 0.2) next[2] = true;
        else next[1] = true;
      }
      return { bases: next, runs, outs: 0 };
    }
    case "2B": {
      const [b1, b2, b3] = bases;
      let runs = 0;
      const next: Bases = [false, true, false];
      if (b3) runs++;
      if (b2) runs++;
      if (b1) {
        if (Math.random() < 0.5) runs++;
        else next[2] = true;
      }
      return { bases: next, runs, outs: 0 };
    }
    case "3B": {
      const [b1, b2, b3] = bases;
      const runs = (b1 ? 1 : 0) + (b2 ? 1 : 0) + (b3 ? 1 : 0);
      return { bases: [false, false, true], runs, outs: 0 };
    }
    case "HR": {
      const [b1, b2, b3] = bases;
      const runs = 1 + (b1 ? 1 : 0) + (b2 ? 1 : 0) + (b3 ? 1 : 0);
      return { bases: [false, false, false], runs, outs: 0 };
    }
  }
}

function simulateHalfInningV03(probs: AtBatProbs): number {
  let outs = 0;
  let bases: Bases = [...EMPTY] as Bases;
  let runs = 0;
  while (outs < 3) {
    const outcome = sampleAtBat(probs);
    const res = applyOutcomeV03(outcome, bases);
    bases = res.bases;
    runs += res.runs;
    outs += res.outs;
  }
  return runs;
}

/**
 * Simulate a single 9-inning game using v0.3 engine。
 *
 * Same architecture as v0.2 simulateGame() but uses Park Factor-adjusted
 * at-bat probabilities · venue parameter is REQUIRED · falls back to v0.2
 * if venue not in cpbl-parks.ts data。
 *
 * Per [[Lens Lifetime Pledge]] · 此 function 永遠 callable · v0.4 ship
 * 後仍 viewable · 不 silently rotate。
 */
export function simulateGameV03(
  homePitcher: PitcherStats,
  awayPitcher: PitcherStats,
  venue: string
): GameResult {
  // v0.3 logic:venue is the home team's park · home pitcher 在自己場
  // 上 pitches · 但 visiting batters 也吃到 park environment(球場 affects
  // both teams)· apply same park factor to both half-inning probs。
  const homeOnMound = atBatProbsV03(homePitcher, venue);
  const awayOnMound = atBatProbsV03(awayPitcher, venue);

  let homeRuns = 0;
  let awayRuns = 0;

  for (let inning = 1; inning <= 9; inning++) {
    awayRuns += simulateHalfInningV03(homeOnMound);
    homeRuns += simulateHalfInningV03(awayOnMound);
  }

  return {
    homeRuns,
    awayRuns,
    winner:
      homeRuns > awayRuns
        ? "home"
        : awayRuns > homeRuns
        ? "away"
        : "tie",
  };
}

/**
 * Engine v0.3 trace steps · used in LensTrace component for v0.3 mode。
 * Same shape as ENGINE_V02_TRACE_STEPS · 加 1 step for Park Factor。
 */
export const ENGINE_V03_TRACE_STEPS = [
  {
    step: "PULL PITCHER STATS",
    explainer:
      "從 lib/cpbl-pitchers.ts 抓投手 K/9 · BB/9 · HR/9 · ERA · WHIP(npm run fetch-cpbl 從 cpbl.com.tw daily refresh)",
    source: "lib/cpbl-pitchers.ts",
  },
  {
    step: "PULL PARK FACTOR",
    explainer:
      "從 lib/cpbl-parks.ts 抓場館 R/G environment + tilt(4 CPBL 主場 reference data · estimate methodology 公開 in /audit)",
    source: "lib/cpbl-parks.ts",
  },
  {
    step: "ADJUST HR RATE BY PARK",
    explainer:
      "hrRate × (1 + parkDelta / 9.5 × 0.5) · 保守 sensitivity 0.5 · 不 BABIP / dimensions 全 effect(留 v0.4 split)· 其他 outcome 機率按比例 rescale 維持 Σ = 1",
    source: "lib/simulator-v03.ts · atBatProbsV03()",
  },
  {
    step: "RUN MONTE CARLO N=10,000",
    explainer:
      "瀏覽器內 10,000 場逐打席模擬 · 每打席用 v0.3 adjusted 機率抽結果 · 90% CI 從 binomial SE 算",
    source: "lib/simulator-v03.ts · simulateGameV03()",
  },
  {
    step: "AGGREGATE WIN PROBABILITY",
    explainer:
      "10K 場結果累加 · home 贏佔比 = win probability · 10K 次重複實驗的相對頻率",
    source: "lib/simulator-v03.ts",
  },
  {
    step: "PUBLISH v0.3 vs v0.2 DELTA",
    explainer:
      "Per /audit S02 PRE-COMMIT · 每 engine version 獨立 ingest calibration receipts on /track-record · N≥30 finalized matches per engine 後 publish v0.2 vs v0.3 Brier score 對照 · 不 silently rotate default engine",
    source: "/audit · /calibration",
  },
];
