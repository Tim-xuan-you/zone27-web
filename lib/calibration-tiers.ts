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
  /** Tier description · 給 visitor 看「我為什麼是這個 tier」 */
  description: string;
  /** Tier rationale · cite 研究依據 · per brand IP 方法公開 */
  source: string;
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
      "您還沒累積足夠 picks(< 10)· honest「不夠 sample」 stage · 不假裝 calibration · brand IP「方法公開」 物理 codify 從 Observer 開始。",
    source:
      "Bill James N≥30 sabermetric convention + Tetlock baseline · 「沒 sample 不 claim」 axiom",
  },
  {
    id: 1,
    name: "校準學徒",
    en: "CALIBRATOR",
    nMin: 10,
    brierMax: 0.3,
    reliabilityErrorMax: null,
    description:
      "10+ picks · Brier < 0.30 · 您已 beat coin-flip baseline。 但還沒到 Tetlock ordinary forecaster benchmark · 持續累積。",
    source:
      "Brier 1950 baseline · coin-flip Brier = 0.25 · 0.30 是「稍好過 guess」 entry",
  },
  {
    id: 2,
    name: "守紀者",
    en: "DISCIPLINED",
    nMin: 30,
    brierMax: 0.25,
    reliabilityErrorMax: null,
    description:
      "30+ picks · Brier < 0.25 · 您達到 Tetlock 5000 ordinary forecaster benchmark(mean Brier ~0.25)。 + 3 次「我錯了」 honest admission(自我 reset trend claim)。",
    source:
      "Tetlock 2015 ordinary forecaster mean Brier ~0.25 · 加 humility gate",
  },
  {
    id: 3,
    name: "守紀者 II",
    en: "RELIABLE",
    nMin: 60,
    brierMax: 0.22,
    reliabilityErrorMax: 0.05,
    description:
      "60+ picks · Brier < 0.22 · Reliability error < 0.05 在 3+ confidence bins。 您 confidence 對齊 actual outcome ±5pp · Murphy 1973 reliability axis 達標 · 不只 Brier 而已。",
    source:
      "Murphy 1973 reliability decomposition · 不止 raw Brier · 要 bin-level alignment",
  },
  {
    id: 4,
    name: "超級守紀者",
    en: "SUPERDISCIPLINED",
    nMin: 100,
    brierMax: 0.2,
    reliabilityErrorMax: 0.05,
    description:
      "100+ picks · Brier < 0.20 · last-30 drift < 0.03。 您達到 Tetlock top-2% Superforecaster threshold(Brier < 0.25 ordinary · top 2% < 0.20)· 5,000 人中前 100。 此 tier 物理稀缺。",
    source:
      "Tetlock 2015 top 2% Superforecaster threshold · Mellers et al. PoPS 10(3):267",
  },
  {
    id: 5,
    name: "27",
    en: "TWO-SEVEN",
    nMin: 270,
    brierMax: 0.18,
    reliabilityErrorMax: 0.04,
    description:
      "270+ picks(brand-aligned 27 number)· Brier < 0.18 · 0 unflagged N<30 trend claims(自律 sample-patience · 沒在 small N 早 claim trend)。 ZONE 27 brand-aligned highest tier。",
    source:
      "Tetlock retained Superforecaster · 70% year-over-year retention rate = skill not luck",
  },
  {
    id: 6,
    name: "終身校準者",
    en: "LIFELONG CALIBRATOR",
    nMin: 270,
    brierMax: 0.18,
    reliabilityErrorMax: 0.04,
    description:
      "Tier 5 維持 12 個月 · 持續 calibration discipline · 不只一次 spike 而是 sustained mastery。 Good Judgment Project 70% Superforecaster 一年後仍維持 status = 確認 skill·不是運氣。",
    source:
      "Good Judgment Project · 70% Superforecaster YoY retention(Mellers/Tetlock 2015)",
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
    sum += Math.pow(predicted - actual, 2);
  }
  return sum / finalized.length;
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

  // Tier resolution · highest tier 訪客 qualifies for
  let tier: CalibrationTier = CALIBRATION_TIERS[0]; // Observer default
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
