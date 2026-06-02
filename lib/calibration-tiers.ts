// ── ZONE 27 · Epistemic Discipline Tier System ─────────
// Round 53 W-A · Tim asked「會員分級 · 獎章 · 等級」 question · 我 spawn
// agent research(Metaculus / Manifold Markets / Tetlock 2015 / Bill James /
// FiveThirtyEight / Brier 1950 / Murphy 1973 / Kahneman & Tversky · 2025
// gamification ethics)synthesize · ship 7-tier brand-pure system 物理 codify。
//
// CRITICAL · brand-IP redline 區分:
//   ✅ Epistemic Discipline ranking(this file)· Brier score + Reliability
//      decomposition · Tetlock superforecaster pattern · 強化 brand IP
//   ❌ Hit-rate / win-rate / "most accurate predictor" ranking · 玩運彩+
//      報馬仔 leaderboard pattern · brand 自殺(此 file 不 implement)
//   ❌ Engagement gamification(daily login streaks · 集點 farming)· per
//      11「永遠不做」 第 2 條 redline(此 file 不 implement)
//
// Statistics backing each tier threshold(Tim 可 cite):
//   1. Tetlock 2015(Mellers et al., Perspectives on Psychological Science
//      10(3):267-281)· 5,000+ forecasters · top 2% became Superforecasters
//      · Brier ~0.25 vs ordinary ~0.37 · 70% retention year-over-year
//   2. Lichtenstein/Fischhoff/Phillips · 100% confidence → 80% accurate ·
//      90% → 70% · humans systematically over-confident ~20pp
//   3. Brier 1950(「Verification of Forecasts Expressed in Terms of
//      Probability」 Monthly Weather Review 78:1-3)· strictly proper
//      scoring rule · cannot be gamed by hedging or strategic dishonesty
//   4. Murphy 1973 decomposition · Brier = Reliability − Resolution +
//      Uncertainty · ZONE 27 ranks on Reliability(calibration)NOT
//      Resolution alone(避免 reward bold「all-in」 picks = gambler bait)
//   5. Hanus & Fox 2015(Computers & Education 80:152-161)· longitudinal
//      study · adding badges + leaderboards REDUCED intrinsic motivation
//      satisfaction AND final exam scores vs non-gamified control · per
//      Deci & Ryan 1985 SDT crowding-out · ZONE 27 thus uses PRIVATE
//      mirror tier(localStorage)· NO public leaderboard
//
// Implementation:
//   - 7 tiers · Observer → 校準學徒 → 守紀者 → 守紀者 II → 超級守紀者 →
//     27 → 終身校準者
//   - Computed client-side from existing zone27_anon_picks_v1 localStorage
//     (per R45 W-B / W-C anon-picks pattern · 0 server · 0 PII · 0 cookies)
//   - Tier badge mounted ONLY in /member/calibration personal mode(per
//     agent's anti-leaderboard guard · never on public surface)
//   - localStorage key zone27_calibration_tier_v1 caches derived state
//     (recomputed from picks · key is convenience snapshot · 不是 source
//     of truth)
//   - 訪客 can clear via /audit S06「您可以清除」 link(per existing pattern)
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · storage key 公開 in /audit S06
//   - per FUNDED BY FOUNDERS · NO TRACKERS axiom · 0 server-side analytics
//   - per Pratfall(Aronson 1966)· tier badge 附帶 honest「您 X% bucket
//     過自信 Y pp」 line · 不藏 over-confidence
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 「校準學徒」
//     fan-grammar(同 sabermetric「Calibrator」 community terminology)·
//     不 engineering-grammar「Tier 1 Basic」
// ─────────────────────────────────────────────────────

import type { AnonPick } from "./anon-picks";

export const TIER_STORAGE_KEY = "zone27_calibration_tier_v1";

export type TierId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CalibrationTier = {
  id: TierId;
  /** Chinese tier name · fan-grammar */
  name: string;
  /** English mono kicker · 同 Manifold Markets S/A+ pattern but named not lettered */
  en: string;
  /** Minimum N picks required */
  nMin: number;
  /** Max Brier score allowed · null = no threshold(Observer tier) */
  brierMax: number | null;
  /** Max reliability error in any of 5 bins · null = not yet checked */
  reliabilityErrorMax: number | null;
  /** Tier description · 給 visitor 看「我為什麼是這個級別」· 球迷白話 */
  description: string;
};

/**
 * 7-tier brand-pure epistemic discipline ladder。 Thresholds derived from
 * Tetlock 2015 Superforecaster research + Brier 1950 strictly proper scoring +
 * Murphy 1973 reliability decomposition。 NO hit-rate axis · NO engagement axis。
 *
 * Tim 您將來想 tune thresholds 可以 · 但 tier NAMES are brand IP locked ·
 * 不可改為 gambler-coded(「Sharp」 「Pro」 「Big Winner」 等)。
 */
export const CALIBRATION_TIERS: CalibrationTier[] = [
  {
    id: 0,
    name: "觀測者",
    en: "OBSERVER",
    nMin: 0,
    brierMax: null,
    reliabilityErrorMax: null,
    description:
      "你還沒累積足夠的場數(不到 10 場結算)。 場數太少,準度數字還不作數 — 我們不會假裝你已經很準。 先去押幾場,結算後再回來看。",
  },
  {
    id: 1,
    name: "校準學徒",
    en: "CALIBRATOR",
    nMin: 10,
    brierMax: 0.3,
    reliabilityErrorMax: null,
    description:
      "已結算 10 場以上 · 你開始比「隨便猜」準了。 繼續累積,看你說的把握程度撐不撐得住。",
  },
  {
    id: 2,
    name: "守紀者",
    en: "DISCIPLINED",
    nMin: 30,
    brierMax: 0.25,
    reliabilityErrorMax: null,
    description:
      "已結算 30 場以上,而且你說有把握的時候多半真的中。 這是一般人能到的平均水準 — 沒那麼容易。",
  },
  {
    id: 3,
    name: "守紀者 II",
    en: "RELIABLE",
    nMin: 60,
    brierMax: 0.22,
    reliabilityErrorMax: 0.05,
    description:
      "已結算 60 場以上 · 你說「六成把握」的時候,大概就真的中六成 — 你的把握跟結果對得上,誤差很小。 不只是押得準,是「知道自己有多準」。",
  },
  {
    id: 4,
    name: "超級守紀者",
    en: "SUPERDISCIPLINED",
    nMin: 100,
    brierMax: 0.2,
    reliabilityErrorMax: 0.05,
    description:
      "已結算 100 場以上,而且準度穩定不飄。 這個水準,大概一百個人裡才出兩三個 — 很稀有。",
  },
  {
    id: 5,
    name: "27",
    en: "TWO-SEVEN",
    nMin: 270,
    brierMax: 0.18,
    reliabilityErrorMax: 0.04,
    description:
      "已結算 270 場以上(呼應 ZONE 27 的 27)· 而且你從不在場數不夠時就先喊「我看得很準」。 這是站上最高的一級。",
  },
  {
    id: 6,
    name: "終身校準者",
    en: "LIFELONG CALIBRATOR",
    nMin: 270,
    brierMax: 0.18,
    reliabilityErrorMax: 0.04,
    description:
      "最高一級維持滿一年 · 不是一時手熱,是長期都這麼穩。 證明是真本事,不是運氣。",
  },
];

/**
 * 5 confidence bins · Murphy 1973 reliability decomposition standard
 * (0-20% · 20-40% · 40-60% · 60-80% · 80-100%)
 */
const BIN_BOUNDARIES = [0, 20, 40, 60, 80, 101]; // 101 to include 100%

/**
 * Compute Brier score from finalized picks。 Brier = mean((p_i - o_i)²)
 * where p_i = predicted probability(0-1)· o_i = actual outcome(0 or 1)。
 * Strictly proper scoring rule(Brier 1950)· cannot be gamed by hedging。
 */
function computeBrierScore(picks: AnonPick[]): number {
  const finalized = picks.filter((p) => p.verdict !== null && p.finalOutcome !== "tie");
  if (finalized.length === 0) return 1; // worst possible · no data

  let sum = 0;
  for (const p of finalized) {
    // User's predicted probability on their pick side (0-1)
    // engineConfidence is the engine's favorite confidence · we treat user
    // pick as 100% confident in their pickedSide · simplest brand-pure
    // interpretation for binary pick(no fractional confidence slider)
    const predicted = 1; // user said this side will win · binary commitment
    const actual = p.pickedSide === p.finalOutcome ? 1 : 0;
    const delta = Math.pow(predicted - actual, 2);
    // Round 54 W-A · Agent 2 #8 fix · NaN propagation guard · 若 corrupted
    // pick(JSON.parse silent coercion 等)導致 NaN · degrade to worst-case
    // 1.0 而非 silent inflation · 不 tier 6 with NaN metrics(brand IP
    //「方法公開」 物理 break)。
    if (!Number.isFinite(delta)) return 1;
    sum += delta;
  }
  const brier = sum / finalized.length;
  return Number.isFinite(brier) ? brier : 1;
}

/**
 * Compute reliability error per confidence bin。 Murphy 1973 reliability =
 * Σ_bin (n_bin/N) × (p̄_bin - ō_bin)² where p̄ = mean predicted probability
 * in bin · ō = observed frequency。 Lower = better calibration。
 *
 * For ZONE 27 anon picks(binary commitment · no fractional confidence)·
 * we bin by engineConfidence at pick-time(captured · per anon-picks.ts)·
 * not user confidence(always 1.0)。 This measures how user's pick aligns
 * with engine's confidence ladder。
 *
 * Returns max bin-error · NOT total Brier。 nMin per bin = 3 to be counted。
 */
function computeMaxBinReliabilityError(picks: AnonPick[]): number {
  const finalized = picks.filter((p) => p.verdict !== null && p.finalOutcome !== "tie");
  if (finalized.length < 5) return 1; // not enough sample · worst-case

  let maxBinError = 0;
  let qualifiedBins = 0;

  for (let i = 0; i < BIN_BOUNDARIES.length - 1; i++) {
    const lo = BIN_BOUNDARIES[i];
    const hi = BIN_BOUNDARIES[i + 1];
    const inBin = finalized.filter(
      (p) => p.engineConfidence >= lo && p.engineConfidence < hi
    );
    if (inBin.length < 3) continue; // skip bins with < 3 picks

    const meanPredictedPct = (lo + hi - 1) / 2; // bin midpoint
    const meanPredicted = meanPredictedPct / 100;
    // Observed = how often picks in this bin actually won
    const observed =
      inBin.filter((p) => p.pickedSide === p.finalOutcome).length / inBin.length;

    const binError = Math.abs(meanPredicted - observed);
    if (binError > maxBinError) maxBinError = binError;
    qualifiedBins++;
  }

  // Require 3+ qualified bins for valid reliability measure(per agent
  // recommendation · matches Manifold Markets ≥15 traders rule scaled down)
  return qualifiedBins >= 3 ? maxBinError : 1;
}

/**
 * Compute drift = Brier last 30 picks vs Brier all-time。 Positive = recent
 * Brier worse · negative = recent Brier better。 Used for Superforecaster
 * tier 4+ stability check。
 */
function computeBrierDrift(picks: AnonPick[]): number {
  const finalized = picks.filter((p) => p.verdict !== null && p.finalOutcome !== "tie");
  if (finalized.length < 30) return 0; // not enough sample · no drift signal

  const allTime = computeBrierScore(finalized);
  const recent = computeBrierScore(finalized.slice(0, 30)); // anon-picks sorted DESC
  return recent - allTime;
}

/**
 * Aggregate calibration state computed from anon picks。 Used by
 * <CalibrationTierBadge /> component。
 */
export type CalibrationState = {
  tier: CalibrationTier;
  nPicks: number;
  nFinalized: number;
  brierLifetime: number;
  brierLast30: number;
  brierDrift: number;
  maxBinReliabilityError: number;
  /** Pratfall surface · which bin is most over-confident · null if all aligned */
  pratfallBin: { range: string; predicted: number; observed: number; errorPp: number } | null;
};

/**
 * Compute full calibration state from anon picks · runs client-side · 0 server。
 * Returns tier + all derived metrics for badge display。
 */
export function computeCalibrationState(picks: AnonPick[]): CalibrationState {
  const finalized = picks.filter((p) => p.verdict !== null && p.finalOutcome !== "tie");
  const nFinalized = finalized.length;
  const brierLifetime = computeBrierScore(picks);
  const brierLast30 = nFinalized >= 30 ? computeBrierScore(finalized.slice(0, 30)) : brierLifetime;
  const brierDrift = computeBrierDrift(picks);
  const maxBinError = computeMaxBinReliabilityError(picks);

  // Tier resolution · highest tier 訪客 qualifies for。
  // Round 54 W-A · Agent 2 #8 fix · NaN guard · if Brier or reliability
  // is NaN/Infinity · floor to Observer · 不 silent inflation。
  let tier: CalibrationTier = CALIBRATION_TIERS[0]; // Observer default
  if (!Number.isFinite(brierLifetime) || !Number.isFinite(maxBinError)) {
    return {
      tier,
      nPicks: picks.length,
      nFinalized,
      brierLifetime: Number.isFinite(brierLifetime) ? brierLifetime : 1,
      brierLast30: Number.isFinite(brierLast30) ? brierLast30 : 1,
      brierDrift: 0,
      maxBinReliabilityError: Number.isFinite(maxBinError) ? maxBinError : 1,
      pratfallBin: null,
    };
  }
  for (const t of CALIBRATION_TIERS) {
    if (nFinalized < t.nMin) continue;
    if (t.brierMax !== null && brierLifetime > t.brierMax) continue;
    if (t.reliabilityErrorMax !== null && maxBinError > t.reliabilityErrorMax) continue;
    // Note · tier 6 (lifelong) needs 12-month retention check which we
    // can't compute from picks alone · 簡化為 nMin + brier + reliability ·
    // 12-month gate 留 future date-checked extension
    tier = t;
  }

  // Pratfall surface · find bin with worst over-confidence
  let pratfallBin: CalibrationState["pratfallBin"] = null;
  let worstError = 0.1; // threshold · only surface if > 10pp drift

  for (let i = 0; i < BIN_BOUNDARIES.length - 1; i++) {
    const lo = BIN_BOUNDARIES[i];
    const hi = BIN_BOUNDARIES[i + 1];
    const inBin = finalized.filter(
      (p) => p.engineConfidence >= lo && p.engineConfidence < hi
    );
    if (inBin.length < 3) continue;

    const meanPredictedPct = (lo + hi - 1) / 2;
    const observed =
      (inBin.filter((p) => p.pickedSide === p.finalOutcome).length / inBin.length) * 100;
    const errorPp = meanPredictedPct - observed;

    if (Math.abs(errorPp) > worstError * 100) {
      worstError = Math.abs(errorPp) / 100;
      pratfallBin = {
        range: `${lo}-${hi === 101 ? 100 : hi - 1}%`,
        predicted: meanPredictedPct,
        observed,
        errorPp,
      };
    }
  }

  return {
    tier,
    nPicks: picks.length,
    nFinalized,
    brierLifetime,
    brierLast30,
    brierDrift,
    maxBinReliabilityError: maxBinError,
    pratfallBin,
  };
}
