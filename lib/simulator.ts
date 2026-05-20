// ── ZONE 27 · Monte Carlo Engine v0.2 ──────────────────
// 升級成「逐打席對決」(Real At-Bat) 引擎:
//
//   每場虛擬比賽從上 1 局開始,直到雙方各打 27 個出局數。
//   每個打席依投手 K/9 · BB/9 · HR/9 推導出 8 種結果的條件機率,
//   滾亂數選一種結果,執行對應的壘上推進規則,累計分數與出局。
//   滿壘保送強制得分。延長賽以平手結束(這版只跑 9 局)。
//
// 與 v0.1 (Poisson 總得分模型) 相比:
//   ✓ 結果分布更逼近真實棒球(沒有 12 比 2 的離譜雜訊)
//   ✓ 每場約 70 個打席,所有亂數來自真實 PA 機率矩陣
//   ✓ 收斂後勝率反映「投手對決強度」,而非 winRate 提示
//
// 介面與 v0.1 相容: simulateGame / applyBatch / topScores 簽名不變,
// /lab 頁面 UI 零變動。
// ─────────────────────────────────────────────────────

import type { PitcherStats } from "./matches";

// ── Random helpers ─────────────────────────────────────

/** Knuth Poisson sampler (kept for backward compat with anything that needs it). */
export function samplePoisson(lambda: number): number {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

// ── At-bat probability model ───────────────────────────
// 8 個互斥的打席結果:K, BB, HR, 1B, 2B, 3B, GO, FO

export type AtBatOutcome = "K" | "BB" | "HR" | "1B" | "2B" | "3B" | "GO" | "FO";

export type AtBatProbs = {
  K: number;
  BB: number;
  HR: number;
  "1B": number;
  "2B": number;
  "3B": number;
  GO: number;
  FO: number;
};

// ── Model constants ────────────────────────────────────
// 公開於 /audit Section 02 (INPUTS WE USE) + /methodology Section 03.
// 抽出為 named constants 而非 magic numbers · 一個地方改 = 模型行為改。
const PA_PER_9 = 38;            // CPBL/MLB 平均每 9 局期望打席數

// Outcome rate clamps · 防範極端投手數據造成的數值崩潰
const K_RATE_MIN = 0.15, K_RATE_MAX = 0.35;
const BB_RATE_MIN = 0.04, BB_RATE_MAX = 0.16;
const HR_RATE_MIN = 0.008, HR_RATE_MAX = 0.06;

// In-play split · 剩餘機率分配給「場內出局」vs「場內安打」
const OUTS_IN_PLAY_RATIO = 0.65;  // CPBL 聯盟 BABIP ~.300 對應
const HITS_IN_PLAY_RATIO = 0.35;

// Hit-type distribution · 場內安打的細分
const SINGLE_RATIO = 0.75;
const DOUBLE_RATIO = 0.20;
const TRIPLE_RATIO = 0.05;

// Out-type distribution · 場內出局的滾飛比
const GROUND_OUT_RATIO = 0.55;
const FLY_OUT_RATIO = 0.45;

/**
 * 從投手的 K/9 · BB/9 · HR/9 推導每打席的結果機率。
 * 大聯盟 CPBL 平均 ~38 PA / 9 innings (全棒次數)。
 *
 * 模型刻意保守:
 * - 直接把率/9 除以 38 得到該結果機率
 * - 剩餘機率 65% 給場內出局(GO + FO,55:45 分),35% 給場內安打
 * - 場內安打中 75% 一壘安打、20% 二壘安打、5% 三壘安打
 */
export function atBatProbs(pitcher: PitcherStats): AtBatProbs {
  const kRate = clamp(parseFloat(pitcher.k9) / PA_PER_9, K_RATE_MIN, K_RATE_MAX);
  const bbRate = clamp(parseFloat(pitcher.bb9) / PA_PER_9, BB_RATE_MIN, BB_RATE_MAX);
  const hrRate = clamp(parseFloat(pitcher.hr9) / PA_PER_9, HR_RATE_MIN, HR_RATE_MAX);

  const remaining = Math.max(0, 1 - kRate - bbRate - hrRate);
  const outsInPlay = remaining * OUTS_IN_PLAY_RATIO;
  const hitsInPlay = remaining * HITS_IN_PLAY_RATIO;

  return {
    K: kRate,
    BB: bbRate,
    HR: hrRate,
    "1B": hitsInPlay * SINGLE_RATIO,
    "2B": hitsInPlay * DOUBLE_RATIO,
    "3B": hitsInPlay * TRIPLE_RATIO,
    GO: outsInPlay * GROUND_OUT_RATIO,
    FO: outsInPlay * FLY_OUT_RATIO,
  };
}

export function sampleAtBat(probs: AtBatProbs): AtBatOutcome {
  const r = Math.random();
  let acc = 0;
  const order: AtBatOutcome[] = ["K", "BB", "HR", "1B", "2B", "3B", "GO", "FO"];
  for (const k of order) {
    acc += probs[k];
    if (r < acc) return k;
  }
  return "FO";
}

// ── Baserunner state & advancement ─────────────────────
// bases tuple: [1B occupied, 2B occupied, 3B occupied]

type Bases = [boolean, boolean, boolean];
const EMPTY: Bases = [false, false, false];

type Result = { bases: Bases; runs: number; outs: number };

function applyOutcome(outcome: AtBatOutcome, bases: Bases): Result {
  switch (outcome) {
    case "K":
    case "GO":
    case "FO":
      return { bases, runs: 0, outs: 1 };

    case "BB": {
      // Force runners only if needed
      const [b1, b2, b3] = bases;
      if (b1 && b2 && b3) {
        // bases loaded → forced run
        return { bases: [true, true, true], runs: 1, outs: 0 };
      }
      if (b1 && b2) return { bases: [true, true, true], runs: 0, outs: 0 };
      if (b1) return { bases: [true, true, b3], runs: 0, outs: 0 };
      return { bases: [true, b2, b3], runs: 0, outs: 0 };
    }

    case "1B": {
      // Always: batter to 1B
      // 3B → home always
      // 2B → home 60%, else 3B
      // 1B → 3B 20%, else 2B
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
      // Batter to 2B
      // 3B → home; 2B → home; 1B → home 50%, else 3B
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

// ── Half-inning & full-game simulation ─────────────────

function simulateHalfInning(probs: AtBatProbs): number {
  let outs = 0;
  let bases: Bases = [...EMPTY] as Bases;
  let runs = 0;

  while (outs < 3) {
    const outcome = sampleAtBat(probs);
    const res = applyOutcome(outcome, bases);
    bases = res.bases;
    runs += res.runs;
    outs += res.outs;
  }
  return runs;
}

// ── Verbose half-inning (for replay mode) ──────────────
// Same logic as above, but records every plate appearance as a
// PlayLog entry so we can stream them back to the UI like a real
// CPBL text broadcast.

export type PlayLog = {
  inning: number;
  half: "top" | "bottom";
  battingTeam: "home" | "away";
  /** 1..9, cycling through the lineup */
  batterNum: number;
  outcome: AtBatOutcome;
  /** outs in the half-inning AFTER this plate appearance (0-3) */
  outsAfter: number;
  /** runs scored on THIS plate appearance */
  runsScored: number;
  /** cumulative scores AFTER this play */
  homeScoreAfter: number;
  awayScoreAfter: number;
  /** baserunner state AFTER this play */
  basesAfter: Bases;
};

type HalfInningCtx = {
  inning: number;
  half: "top" | "bottom";
  battingTeam: "home" | "away";
  /** starting batter index for this half-inning (0..8) */
  startingBatter: number;
  homeScoreBefore: number;
  awayScoreBefore: number;
};

function simulateHalfInningVerbose(
  probs: AtBatProbs,
  ctx: HalfInningCtx
): { runs: number; nextBatter: number; log: PlayLog[] } {
  let outs = 0;
  let bases: Bases = [...EMPTY] as Bases;
  let runs = 0;
  let batterIdx = ctx.startingBatter;
  const log: PlayLog[] = [];

  while (outs < 3) {
    const outcome = sampleAtBat(probs);
    const res = applyOutcome(outcome, bases);
    bases = res.bases;
    runs += res.runs;
    outs += res.outs;

    log.push({
      inning: ctx.inning,
      half: ctx.half,
      battingTeam: ctx.battingTeam,
      batterNum: batterIdx + 1, // 1..9 for display
      outcome,
      outsAfter: outs,
      runsScored: res.runs,
      homeScoreAfter:
        ctx.battingTeam === "home"
          ? ctx.homeScoreBefore + runs
          : ctx.homeScoreBefore,
      awayScoreAfter:
        ctx.battingTeam === "away"
          ? ctx.awayScoreBefore + runs
          : ctx.awayScoreBefore,
      basesAfter: [...bases] as Bases,
    });

    batterIdx = (batterIdx + 1) % 9;
  }

  return { runs, nextBatter: batterIdx, log };
}

/**
 * Like simulateGame() but also returns a play-by-play log of every
 * plate appearance — for /lab REPLAY MODE.
 *
 * Lineups cycle 1..9 continuously through each half-inning.
 */
export function simulateGameWithLog(
  homePitcher: PitcherStats,
  awayPitcher: PitcherStats
): { result: GameResult; log: PlayLog[] } {
  const homeOnMound = atBatProbs(homePitcher);
  const awayOnMound = atBatProbs(awayPitcher);

  let homeRuns = 0;
  let awayRuns = 0;
  let homeNextBatter = 0;
  let awayNextBatter = 0;
  const log: PlayLog[] = [];

  for (let inning = 1; inning <= 9; inning++) {
    // ── Top of inning: away batting against home pitcher ──
    const top = simulateHalfInningVerbose(homeOnMound, {
      inning,
      half: "top",
      battingTeam: "away",
      startingBatter: awayNextBatter,
      homeScoreBefore: homeRuns,
      awayScoreBefore: awayRuns,
    });
    awayRuns += top.runs;
    awayNextBatter = top.nextBatter;
    log.push(...top.log);

    // ── Bottom of inning: home batting against away pitcher ──
    const bot = simulateHalfInningVerbose(awayOnMound, {
      inning,
      half: "bottom",
      battingTeam: "home",
      startingBatter: homeNextBatter,
      homeScoreBefore: homeRuns,
      awayScoreBefore: awayRuns,
    });
    homeRuns += bot.runs;
    homeNextBatter = bot.nextBatter;
    log.push(...bot.log);
  }

  return {
    result: {
      homeRuns,
      awayRuns,
      winner:
        homeRuns > awayRuns
          ? "home"
          : awayRuns > homeRuns
          ? "away"
          : "tie",
    },
    log,
  };
}

// ── Human-readable description for a single play (for UI) ──

const OUTCOME_VERB: Record<AtBatOutcome, string> = {
  K: "strikes out",
  BB: "walks",
  HR: "homers",
  "1B": "singles",
  "2B": "doubles",
  "3B": "triples",
  GO: "grounds out",
  FO: "flies out",
};

const OUTCOME_TIER: Record<
  AtBatOutcome,
  "out" | "onbase" | "extra" | "homer"
> = {
  K: "out",
  GO: "out",
  FO: "out",
  BB: "onbase",
  "1B": "onbase",
  "2B": "extra",
  "3B": "extra",
  HR: "homer",
};

export function describePlay(
  play: PlayLog,
  teamLabel: "BROTHERS" | string,
  awayLabel?: string
): string {
  void awayLabel;
  const verb = OUTCOME_VERB[play.outcome];
  let base = `${teamLabel} #${play.batterNum} ${verb}`;
  if (play.runsScored > 0) {
    base += `, ${play.runsScored} run${play.runsScored > 1 ? "s" : ""} score${
      play.runsScored > 1 ? "" : "s"
    }`;
  }
  return base;
}

export function outcomeTier(o: AtBatOutcome) {
  return OUTCOME_TIER[o];
}

// ── Public API ─────────────────────────────────────────

export type GameResult = {
  homeRuns: number;
  awayRuns: number;
  winner: "home" | "away" | "tie";
};

/**
 * Simulate a single 9-inning game between two teams.
 *
 * Home pitches when away is batting, and vice versa. So:
 *   - top of inning N: away batters face HOME pitcher's probs
 *   - bot of inning N: home batters face AWAY pitcher's probs
 *
 * Ties happen (~5–8 %) — we surface them as a third category. Real CPBL
 * goes to extras, but for the demo it's cleaner to show three buckets.
 */
export function simulateGame(
  homePitcher: PitcherStats,
  awayPitcher: PitcherStats
): GameResult {
  const homeOnMound = atBatProbs(homePitcher);
  const awayOnMound = atBatProbs(awayPitcher);

  let homeRuns = 0;
  let awayRuns = 0;

  for (let inning = 1; inning <= 9; inning++) {
    awayRuns += simulateHalfInning(homeOnMound);
    homeRuns += simulateHalfInning(awayOnMound);
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

// ── Running stats aggregator (interface unchanged from v0.1) ──

export type RunningStats = {
  completed: number;
  homeWins: number;
  awayWins: number;
  ties: number;
  totalRuns: number;
  scoreCounts: Record<string, number>; // "4-3" -> N
};

export const initialStats: RunningStats = {
  completed: 0,
  homeWins: 0,
  awayWins: 0,
  ties: 0,
  totalRuns: 0,
  scoreCounts: {},
};

export function applyBatch(
  prev: RunningStats,
  results: GameResult[]
): RunningStats {
  const scoreCounts = { ...prev.scoreCounts };
  let homeWins = prev.homeWins;
  let awayWins = prev.awayWins;
  let ties = prev.ties;
  let totalRuns = prev.totalRuns;

  for (const r of results) {
    if (r.winner === "home") homeWins++;
    else if (r.winner === "away") awayWins++;
    else ties++;

    totalRuns += r.homeRuns + r.awayRuns;

    const key = `${r.homeRuns}-${r.awayRuns}`;
    scoreCounts[key] = (scoreCounts[key] ?? 0) + 1;
  }

  return {
    completed: prev.completed + results.length,
    homeWins,
    awayWins,
    ties,
    totalRuns,
    scoreCounts,
  };
}

export function topScores(
  scoreCounts: Record<string, number>,
  limit = 5
): { score: string; count: number; pct: number }[] {
  const total = Object.values(scoreCounts).reduce((s, n) => s + n, 0);
  if (total === 0) return [];
  return Object.entries(scoreCounts)
    .map(([score, count]) => ({
      score,
      count,
      pct: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
