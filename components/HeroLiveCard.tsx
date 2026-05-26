"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getMatchPhase,
  getCalibration,
  getEnginePctOnWinner,
  type Match,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";
import {
  simulateGame,
  applyBatch,
  initialStats,
  type RunningStats,
  type GameResult,
} from "@/lib/simulator";
import {
  FOUNDERS_REMAINING,
  FOUNDERS_TOTAL,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";
import UncertaintyStripe from "@/components/UncertaintyStripe";
import ConfidenceStars from "@/components/ConfidenceStars";
import EngineStamp from "@/components/EngineStamp";

// ── ZONE 27 · Hero Live Card ───────────────────────────
// 首頁的活化版預測卡。Mount 時 client-side 跑 1000 場
// mini-Monte-Carlo,~1 秒內讓勝率條從 50/50 真實收斂到
// 約 62/38 — 訪客打開首頁第一秒就親眼看到「演算法在跑」。
//
// 每次重新整理都會跑出略微不同的結果(因為是真實隨機採樣),
// 這是 feature,不是 bug — 證明後面真的是亂數而非寫死。
// ─────────────────────────────────────────────────────

const TOTAL_HERO_SIMS = 1000;
const BATCH = 50;

export default function HeroLiveCard({ match }: { match: Match }) {
  const [stats, setStats] = useState<RunningStats>(initialStats);
  const [simPhase, setSimPhase] = useState<"simulating" | "converged">(
    "simulating"
  );
  // R140 W3 · hydration mismatch fix · 之前 matchPhase 直接 compute at
  // render time · getMatchPhase() 內部 call getTodayTaipei() + getTaipeiNowMinutes()
  // 全 time-dependent · SSR 18:34 TPE → client 18:35 TPE → 不同 phase string ·
  // React hydration mismatch + PhaseBadge text/className 不同 · per Agent B
  // HIGH-CONFIDENCE bug · fix · mount flag pattern · matchPhase null on SSR
  // (PhaseBadge 已 handle null · 不破)· compute after mount · 一致 render。
  // calibration 同 enginePctOnWinner 不受影響(只 depend on match.finalResult
  // static value · 0 time dependency)。
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const rafRef = useRef<number | null>(null);
  // Five-state lifecycle: future · today-pregame · today-live · stale-archived · final.
  // Engine output is always real (runs in visitor's browser); the badge
  // tells visitors which timeline this prediction sits in.
  const matchPhase: MatchPhase | null = mounted ? getMatchPhase(match) : null;
  const calibration = getCalibration(match); // proved | diverged | push | null
  const enginePctOnWinner = getEnginePctOnWinner(match);

  // Start the mini-sim once on mount
  useEffect(() => {
    let acc: RunningStats = initialStats;

    const tick = () => {
      const remaining = TOTAL_HERO_SIMS - acc.completed;
      const n = Math.min(BATCH, remaining);
      const batch: GameResult[] = [];
      for (let i = 0; i < n; i++) {
        batch.push(simulateGame(match.home.pitcher, match.away.pitcher));
      }
      acc = applyBatch(acc, batch);
      setStats(acc);
      if (acc.completed < TOTAL_HERO_SIMS) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setSimPhase("converged");
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute display values
  const decided = stats.homeWins + stats.awayWins;
  const homePct = decided > 0 ? (stats.homeWins / decided) * 100 : 50;
  const awayPct = 100 - homePct;
  const homeFav = homePct >= awayPct;

  return (
    <article
      aria-label={`Live Monte Carlo simulation: ${match.home.name} versus ${match.away.name}`}
      className="bg-slate/70 border border-line/80 glow-soft p-5 sm:p-12"
    >
      {/* Card header — tighter mb on mobile */}
      <div className="flex items-center justify-between mb-5 sm:mb-10 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full bg-gold ${
              simPhase === "simulating" ? "shimmer" : ""
            } glow-gold`}
          />
          <span
            role="status"
            aria-live="polite"
            className="font-mono text-gold text-[10px] tracking-[0.35em]"
          >
            {simPhase === "simulating"
              ? "● 即時模擬中"
              : "● AI 模型 · 已收斂"}
          </span>
          <PhaseBadge phase={matchPhase} calibration={calibration} />
        </div>
        <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
          {match.date} · {match.startTime}
        </span>
      </div>

      {/* Team labels — tighter on mobile */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-1 sm:mb-2">
            HOME
          </p>
          <h2 className="text-xl sm:text-3xl text-bone font-light tracking-tight">
            {match.home.name}
          </h2>
          <p className="font-mono text-gold/60 text-[10px] sm:text-xs tracking-[0.25em] mt-1">
            {match.home.en}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-1 sm:mb-2">
            AWAY
          </p>
          <h2 className="text-xl sm:text-3xl text-bone font-light tracking-tight">
            {match.away.name}
          </h2>
          <p className="font-mono text-gold/60 text-[10px] sm:text-xs tracking-[0.25em] mt-1">
            {match.away.en}
          </p>
        </div>
      </div>

      {/* Live win percentages — smaller on mobile to keep card compact */}
      <div className="flex items-baseline justify-between mb-2 sm:mb-3">
        <span
          className={`font-mono text-2xl sm:text-4xl tabular tracking-tight ${
            homeFav ? "text-gold" : "text-mute"
          }`}
          style={{ transition: "color 200ms ease" }}
        >
          {homePct.toFixed(1)}
          <span className="text-sm sm:text-base opacity-60 ml-0.5">%</span>
        </span>
        <span
          className={`font-mono text-2xl sm:text-4xl tabular tracking-tight ${
            !homeFav ? "text-gold" : "text-mute"
          }`}
          style={{ transition: "color 200ms ease" }}
        >
          {awayPct.toFixed(1)}
          <span className="text-sm sm:text-base opacity-60 ml-0.5">%</span>
        </span>
      </div>

      {/* The signature bar */}
      <div className="relative h-[3px] bg-line/80 overflow-visible">
        <div
          className={`absolute top-0 left-0 h-full bg-gold glow-gold ${
            simPhase === "converged" ? "shimmer" : ""
          }`}
          style={{
            width: `${homePct}%`,
            transition: "width 120ms ease-out",
          }}
        />
        <div
          className="absolute -top-1 h-[11px] w-px bg-gold/80"
          style={{
            left: `${homePct}%`,
            transition: "left 120ms ease-out",
          }}
        />
      </div>

      {/* Round 28 Wave 3 · Uncertainty Stripe (Agent A #1 canonical
          2026 visual moat for quantitative analytics brands). Thin
          gradient band beneath the signature bar shows the 50% (dark)
          and 90% (light) binomial confidence intervals around homePct.
          Renders only when N≥30 (matches Z27 LEXICON SAMPLE DEBT
          threshold). Bank of England fan-chart convention applied to
          baseball forecast. Makes the brand IP「AI 計算的是機率 · 不是
          命運」 VISUAL not text. */}
      <div className="mt-1">
        <UncertaintyStripe estimate={homePct} n={stats.completed} height={4} />
      </div>

      {/* Round 34 W-A · ConfidenceStars 補 homepage hero gap(R33 W-A 只 ship
          /matches/[gameId] + /signal-board · 漏 hero · 是 R32 W-C OTP path 反向
          over-promise pattern · homepage 寫 「AI 引擎告訴您信號強度 5★ STRONG → 1★
          COIN-FLIP」 promise 必須兌現)。 Static aiConfidence 跟 live Monte Carlo
          並排 dual signal:Live % = visitor 瀏覽器即時運算(open methodology)·
          Static ★ = 賽前 locked engine confidence(costly signaling · pre-locked
          at ingest time · 不可 game)。 兩個並存 = brand IP「方法公開 · 同時 lock-in」。 */}
      <div className="mt-5 sm:mt-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-1.5">
            AI CONFIDENCE · 賽前 locked
          </p>
          <ConfidenceStars confidence={match.aiConfidence} variant="inline" />
        </div>
        <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] tabular leading-relaxed text-right">
          static locked vs<br />
          live ↑ converging
        </p>
      </div>
      {simPhase === "converged" && stats.completed >= 30 && (
        <p
          aria-hidden="true"
          className="font-mono text-mute/50 text-[9px] tracking-[0.25em] mt-1 tabular leading-relaxed"
        >
          /\ 軌跡 = 引擎不確定度 ·{" "}
          <span lang="en" className="text-mute/60">深 = 50% CI · 淺 = 90% CI</span>
          {" "}· 引擎只給機率 · 不給命運
        </p>
      )}

      {/* Methodology line — with live counter · tighter mt on mobile.
          Round 28 Agent C fixes (P2.1 · P2.2 · P4.2): (1) "蒙地卡羅" 是
          /learn 入口,讓 friend-referred 休閒球迷有 on-ramp(此前只能從
          footer 找)·(2) "不接受下注" defang gambling-card grammar 誤判 ·
          (3) "賽後收據在 /track-record" permanent 連結讓 skeptic 任何時候
          (pre-game · live · final 都看得到)都有 above-the-fold 證據路徑. */}
      <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] mt-3 sm:mt-5 tabular leading-relaxed">
        <Link href="/learn" className="text-mute/80 hover:text-gold underline-offset-4 hover:underline transition-colors" title="5 分鐘看懂模擬原理 → /learn">
          我跑 1 萬次模擬
        </Link>
        {" "}·{" "}
        <span className="text-gold/80">
          {stats.completed.toLocaleString()}
        </span>{" "}
        / {TOTAL_HERO_SIMS.toLocaleString()} 場 · 在您瀏覽器即時運算 · 不接受下注
        <span className="block mt-1 text-mute/60">
          賽後收據在{" "}
          <Link href="/track-record" className="text-mute/60 hover:text-gold underline-offset-4 hover:underline transition-colors">
            /track-record
          </Link>
          {" "}累積中
        </span>
      </p>

      {/* Calibration receipt — only when finalResult ingested.
          Equal visual weight for PROVED and DIVERGED per /audit S05
          disclosure philosophy. This is the public receipt that powers
          /track-record · single source of truth for engine track record. */}
      {match.finalResult && calibration && (
        <div className="mt-8 pt-6 border-t border-gold/30">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            / RECEIPT · ENGINE vs ACTUAL
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                ENGINE PREDICTED
              </p>
              <p className="font-mono text-bone text-2xl tabular tracking-tight">
                {Math.max(match.home.winRate, match.away.winRate)}
                <span className="text-sm opacity-60 ml-0.5">%</span>{" "}
                <span className="text-mute text-sm">
                  {match.home.winRate >= match.away.winRate
                    ? match.home.en
                    : match.away.en}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                ACTUAL RESULT
              </p>
              <p className="font-mono text-bone text-2xl tabular tracking-tight">
                {match.finalResult.homeScore}:{match.finalResult.awayScore}{" "}
                <span className="text-mute text-sm">
                  {match.finalResult.winner === "home"
                    ? match.home.en + " W"
                    : match.finalResult.winner === "away"
                    ? match.away.en + " W"
                    : "TIE"}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
            <CalibrationVerdict
              calibration={calibration}
              enginePctOnWinner={enginePctOnWinner}
            />
            <Link
              href="/track-record"
              className="font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
            >
              完整公開戰績 →
            </Link>
          </div>
        </div>
      )}

      {/* Pitcher matchup — tighter mt + pt on mobile */}
      <div className="mt-5 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-line/60">
        <div>
          <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-1 sm:mb-2">
            HOME STARTER
          </p>
          <p className="text-bone text-base sm:text-lg">{match.home.pitcher.name}</p>
          <p className="font-mono text-gold/70 text-[10px] sm:text-xs tabular mt-1">
            ERA · {match.home.pitcher.era}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-1 sm:mb-2">
            AWAY STARTER
          </p>
          <p className="text-bone text-base sm:text-lg">{match.away.pitcher.name}</p>
          <p className="font-mono text-gold/70 text-[10px] sm:text-xs tabular mt-1">
            ERA · {match.away.pitcher.era}
          </p>
        </div>
      </div>

      {/* CTA — single CTA on mobile (the one that drives engagement),
          two on desktop. Mobile: tap card link → /matches/[gameId] for
          the full breakdown; the sticky bottom Founders CTA handles
          the conversion ask without competing here.

          Round 12 funnel-audit: card earned the right to ask once.
          Tertiary text line below the buttons routes high-intent
          visitors (just saw engine converge live) → /founders. Brand-
          pure: 10px mono · doesn't compete with primary CTAs · respects
          card's existing visual rhythm. */}
      <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 justify-center">
        <Link
          href={`/matches/${match.id}`}
          className="px-6 sm:px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
        >
          完整分析 →
        </Link>
        <Link
          href="/matches"
          className="hidden sm:inline-block px-8 py-3 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
        >
          查看今日完整賽事板 →
        </Link>
      </div>
      {FOUNDERS_REMAINING > 0 && (
        <p
          className="mt-5 sm:mt-6 text-center font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular"
          title={`Founders 27 · 限量 ${FOUNDERS_TOTAL} 名 · 已認領 ${FOUNDERS_TOTAL - FOUNDERS_REMAINING} 名 · NEXT IS ${formatBadge(FOUNDERS_NEXT)} · 一次性 NT$ 2,700 · 終身`}
        >
          想成為{" "}
          <Link
            href="/founders"
            className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
          >
            {formatBadge(FOUNDERS_NEXT)}
          </Link>
          ?
        </p>
      )}
      {/* Round 31 Wave B · Vercel + Plausible datestamped trust signal */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-line/40 text-center">
        <EngineStamp />
      </div>
    </article>
  );
}

// ── Phase badge ────────────────────────────────────────
// Five visually distinct badges, one per MatchPhase. Gold-intensity
// scales with prediction stakes: future is dim (still abstract),
// today-pregame full-bright (this is the moment), today-live full-
// bright shimmer (clock running), final goes to calibration colors,
// stale-archived dims to grey (no receipt was ever filed).

function PhaseBadge({
  phase,
  calibration,
}: {
  phase: MatchPhase | null;
  calibration: Calibration | null;
}) {
  if (!phase) return null;

  if (phase === "final" && calibration) {
    const styles = {
      proved: "border-gold text-gold",
      diverged: "border-loss/70 text-loss",
      push: "border-mute/60 text-mute",
    } as const;
    const labels = {
      proved: "✓ PROVED · 引擎言中",
      diverged: "✕ DIVERGED · 引擎落空",
      push: "= PUSH · 平局",
    } as const;
    return (
      <span
        lang="en"
        className={`px-1.5 py-0.5 text-[8px] tracking-[0.2em] border font-mono whitespace-nowrap ${styles[calibration]}`}
        title="賽後實際結果 · /track-record 公開戰績有完整收據"
      >
        {labels[calibration]}
      </span>
    );
  }

  if (phase === "today-pregame") {
    return (
      <span
        lang="en"
        className="px-1.5 py-0.5 text-[8px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap shimmer"
        title="今晚開賽 · 預測已公開鎖定 · 賽後將進入 /track-record"
      >
        TODAY · 今晚開賽
      </span>
    );
  }

  if (phase === "today-live") {
    // Round 29 Wave 10 polish · adds subtle shimmer(opacity 0.85↔1.0 over
    // 3.2s · per globals.css)so the LIVE badge feels「actively pulsing」
    // during the game window · brand IP「engine is alive」visual signal。
    // 反差 today-pregame(also shimmer) · 但 today-live 加 shimmer 更對 ·
    // LIVE 應該比 PREGAME 視覺強度更高 · 不是平等。Tonight 22:00+ 之前的
    // 18:35-22:00 window · badge will be in this state · brand 物理時刻 visible。
    return (
      <span
        lang="en"
        className="px-1.5 py-0.5 text-[8px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap shimmer"
        title="賽事進行中 · 引擎預測已無法再改 · 結果出爐後自動入帳"
      >
        LIVE · 賽事進行中
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        lang="en"
        className="px-1.5 py-0.5 text-[8px] tracking-[0.2em] border border-gold/50 text-gold font-mono whitespace-nowrap"
        title="這場比賽未開打 · 預告階段 · Monte Carlo 為真實預測"
      >
        PREVIEW · 預告
      </span>
    );
  }

  // stale-archived
  return (
    <span
      lang="en"
      className="px-1.5 py-0.5 text-[8px] tracking-[0.2em] border border-mute/60 text-mute font-mono whitespace-nowrap"
      title="這場比賽已結束 · 未補錄最終比分 · 不會出現在 /track-record"
    >
      ARCHIVED · 無收據
    </span>
  );
}

function CalibrationVerdict({
  calibration,
  enginePctOnWinner,
}: {
  calibration: Calibration;
  enginePctOnWinner: number | null;
}) {
  const styles = {
    proved: "text-gold border-gold",
    diverged: "text-loss border-loss/70",
    push: "text-mute border-mute/60",
  } as const;
  // Round 56 W-A · Agent A Vector 3 fix · CRITICAL · 之前 「✓ ENGINE PROVED」
  // 在 N=1 sample 是 cherry-pick optics(/track-record 自己 disclaim N<30 NOT
  // EVIDENCE)· adversarial critic 1-second reads as「他們 know N=1 不夠 但
  // 還是放首頁宣傳」 hypocrisy。 改為「✓ MATCHED」 weaker verb · 更 Aronson
  // Pratfall 一致 · brand IP「方法公開 · 不誇大」 axiom 物理 codify · 仍
  // 顯示 receipt 但 vocabulary honest given sample size。
  const labels = {
    proved: "✓ MATCHED · 引擎方向對齊(N<30 樣本)",
    diverged: "✕ DIVERGED · 引擎方向落空(N<30 樣本)",
    push: "= PUSH · 無 favorite 或平局",
  } as const;
  return (
    <span
      lang="en"
      className={`font-mono text-[10px] tracking-[0.3em] px-2 py-1 border ${styles[calibration]}`}
    >
      {labels[calibration]}
      {enginePctOnWinner !== null && calibration === "proved" && (
        <span className="ml-2 opacity-70">
          ({enginePctOnWinner}% → WIN)
        </span>
      )}
      {enginePctOnWinner !== null && calibration === "diverged" && (
        <span className="ml-2 opacity-70">
          (僅 {enginePctOnWinner}% → 卻贏)
        </span>
      )}
    </span>
  );
}
