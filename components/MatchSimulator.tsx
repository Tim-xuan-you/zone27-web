"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReplayBroadcast from "@/components/ReplayBroadcast";
import ProvenanceStamp from "@/components/ProvenanceStamp";
import UncertaintyStripe from "@/components/UncertaintyStripe";
import type { Match } from "@/lib/matches";
import {
  simulateGame,
  applyBatch,
  initialStats,
  topScores,
  buildRunDiffBuckets,
  type RunningStats,
  type GameResult,
  type RunDiffBucket,
} from "@/lib/simulator";
import { saveSimHistory } from "@/lib/sim-history";
import { FOUNDERS_REMAINING } from "@/lib/founders-stats";

// ── ZONE 27 · Match Simulator (shared) ────────────────
// 把 /lab 的核心互動 UI 抽出來,讓任何給定一場比賽的頁面
// (例如 /matches/[gameId])都可以內嵌完整的 Live Sim 體驗。
//
// 內含:
//   - RUN 10,000 SIMULATIONS 按鈕 + 進度條
//   - Live Win Probability 區塊
//   - Score Distribution 區塊
//   - Completion Card(收斂結果與鎖定 AI 預測對比)
//   - ReplayBroadcast(整場 9 局文字直播)
//
// Parent MUST pass `key={match.id}` so the component remounts on
// matchup change — that's how internal state resets cleanly.
// All current callers (/lab, /lab/custom, /matches/[gameId],
// /methodology) already do this.
// ─────────────────────────────────────────────────────

const TOTAL_SIMS = 10_000;
// R156 W2 · Agent F INP fix · BATCH 200 → 50 · 之前 200 sims per RAF tick crossed
// Long Task threshold(50ms+ on low-end Android per Pixel 4a baseline)· tap on
// stat row mid-sim → P75 INP > 200ms · per web.dev INP optimization canonical
// anti-pattern。 NEW 50 sims per tick → each tick stays < 50ms · 10K sims = 200
// ticks ≈ 3-4s total(vs 2s before)· tradeoff worth it for INP improvement ·
// progressive enhancement · low-end Android visitor experience canonical fix。
const BATCH = 50;

type Props = {
  match: Match;
};

export default function MatchSimulator({ match }: Props) {
  const [stats, setStats] = useState<RunningStats>(initialStats);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [liveMsg, setLiveMsg] = useState("");
  const rafRef = useRef<number | null>(null);
  // Tracks which 25% milestone we've already announced to screen readers.
  // Polite ARIA region only updates at 25/50/75/100% — not on every tick.
  const lastMilestoneRef = useRef(0);

  // Cleanup any in-flight RAF on unmount (covers normal unmount AND
  // the remount triggered by parent's key change).
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // When a simulation completes, save a snapshot to localStorage so the
  // user can see "RECENT SIMS" on revisit. Doesn't fire on initial mount.
  const homePctForSave =
    stats.completed > 0 && stats.homeWins + stats.awayWins > 0
      ? (stats.homeWins / (stats.homeWins + stats.awayWins)) * 100
      : 50;
  const awayPctForSave = 100 - homePctForSave;
  useEffect(() => {
    if (!done) return;
    if (stats.completed < 10_000) return;
    saveSimHistory({
      matchId: match.id,
      matchupName: `${match.home.name} vs ${match.away.name}`,
      homePct: Math.round(homePctForSave * 10) / 10,
      awayPct: Math.round(awayPctForSave * 10) / 10,
      homeName: match.home.name,
      awayName: match.away.name,
      ranAt: Date.now(),
      totalSims: stats.completed,
      isCustom: match.id.startsWith("custom-"),
    });
    // Dispatch a custom event so RecentSims components on the same page
    // can refresh without polling.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("zone27:sim-history-updated"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function start() {
    if (running) return;
    setStats(initialStats);
    setRunning(true);
    setDone(false);
    lastMilestoneRef.current = 0;
    setLiveMsg(
      `Starting Monte Carlo simulation: ${TOTAL_SIMS.toLocaleString()} games for ${match.home.name} versus ${match.away.name}.`
    );

    const homePitcher = match.home.pitcher;
    const awayPitcher = match.away.pitcher;

    let acc: RunningStats = initialStats;

    const tick = () => {
      const remaining = TOTAL_SIMS - acc.completed;
      const n = Math.min(BATCH, remaining);

      const batch: GameResult[] = [];
      for (let i = 0; i < n; i++) {
        batch.push(simulateGame(homePitcher, awayPitcher));
      }
      acc = applyBatch(acc, batch);
      setStats(acc);

      // Announce milestone progress to screen readers (polite, every 25%)
      const milestone = Math.floor(acc.completed / 2500);
      if (milestone > lastMilestoneRef.current && milestone <= 4) {
        lastMilestoneRef.current = milestone;
        const totalDecided = acc.homeWins + acc.awayWins;
        if (totalDecided > 0) {
          const home = ((acc.homeWins / totalDecided) * 100).toFixed(1);
          const away = (100 - parseFloat(home)).toFixed(1);
          setLiveMsg(
            `${milestone * 25}% complete. ${match.home.name} ${home}%, ${match.away.name} ${away}%.`
          );
        }
      }

      if (acc.completed < TOTAL_SIMS) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setRunning(false);
        setDone(true);
        rafRef.current = null;
        const totalDecided = acc.homeWins + acc.awayWins;
        if (totalDecided > 0) {
          const home = ((acc.homeWins / totalDecided) * 100).toFixed(1);
          const away = (100 - parseFloat(home)).toFixed(1);
          setLiveMsg(
            `Simulation complete. Final: ${match.home.name} ${home}%, ${match.away.name} ${away}%.`
          );
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  const progressPct = (stats.completed / TOTAL_SIMS) * 100;
  const totalDecided = stats.homeWins + stats.awayWins;
  const homePct =
    totalDecided > 0 ? (stats.homeWins / totalDecided) * 100 : 50;
  const awayPct = 100 - homePct;
  const avgRuns =
    stats.completed > 0 ? stats.totalRuns / stats.completed : 0;
  const distribution = topScores(stats.scoreCounts, 5);
  const diffBuckets = buildRunDiffBuckets(stats.scoreCounts);
  // Max bucket pct for normalizing bar widths in histogram
  const maxBucketPct = diffBuckets.reduce(
    (m, b) => Math.max(m, b.pct),
    0
  );

  return (
    <>
      {/* ── ARIA LIVE REGION (screen-reader only) ───
          Announces milestone progress at 25 / 50 / 75 / 100%
          rather than on every batch — polite, not assertive.
      */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMsg}
      </div>

      {/* ── RUN BUTTON ───────────────────────────── */}
      <section className="pb-10">
        <button
          type="button"
          onClick={start}
          disabled={running}
          aria-label={
            running
              ? `Running ${stats.completed.toLocaleString()} of ${TOTAL_SIMS.toLocaleString()} simulations`
              : done
              ? `Re-run ${TOTAL_SIMS.toLocaleString()} Monte Carlo simulations`
              : `Run ${TOTAL_SIMS.toLocaleString()} Monte Carlo simulations for ${match.home.name} vs ${match.away.name}`
          }
          className={`w-full py-6 border text-sm tracking-[0.35em] font-medium transition-colors ${
            running
              ? "border-gold/40 text-gold/60 cursor-not-allowed bg-gold/5"
              : "border-gold bg-gold text-navy hover:bg-gold-soft"
          }`}
        >
          {running
            ? `▸ 演算法收斂中 · ${stats.completed.toLocaleString()} / ${TOTAL_SIMS.toLocaleString()} 次採樣`
            : done
            ? "▸ 再跑一次"
            : "▶ 跑 10,000 次模擬"}
        </button>

        <div className="relative mt-3 h-[2px] bg-line/80">
          <div
            className={`absolute top-0 left-0 h-full bg-gold ${
              running ? "glow-gold" : ""
            }`}
            style={{
              width: `${progressPct}%`,
              transition: "width 80ms linear",
            }}
          />
        </div>
      </section>

      {/* ── LIVE WIN PROBABILITY ─────────────────── */}
      <section className="pb-14">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-6">
          / 即時勝率
        </p>

        <div className={`bg-slate/70 border border-line/80 glow-soft p-8 sm:p-10 ${running ? "card-breathing" : ""}`}>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                主隊 · {match.home.name}
              </p>
              <p
                className={`font-mono tabular tracking-tight text-5xl sm:text-6xl font-light ${
                  homePct >= awayPct ? "text-gold" : "text-mute"
                }`}
                style={{ transition: "color 200ms ease" }}
              >
                {homePct.toFixed(1)}
                <span className="text-xl opacity-60 ml-0.5">%</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                {match.away.name} · 客隊
              </p>
              <p
                className={`font-mono tabular tracking-tight text-5xl sm:text-6xl font-light ${
                  awayPct > homePct ? "text-gold" : "text-mute"
                }`}
                style={{ transition: "color 200ms ease" }}
              >
                {awayPct.toFixed(1)}
                <span className="text-xl opacity-60 ml-0.5">%</span>
              </p>
            </div>
          </div>

          {/* Live bar */}
          <div className="relative h-1 bg-line/80 mt-4">
            <div
              className={`absolute top-0 left-0 h-full bg-gold ${
                running || done ? "glow-gold" : ""
              } ${done ? "shimmer" : ""}`}
              style={{
                width: `${homePct}%`,
                transition: "width 120ms ease-out",
              }}
            />
            <div
              className="absolute -top-1.5 h-[16px] w-px bg-gold"
              style={{
                left: `${homePct}%`,
                transition: "left 120ms ease-out",
              }}
            />
          </div>

          {/* Round 28 Wave 3 · Uncertainty Stripe (Agent A #1 · canonical
              2026 visual moat). 10K Monte Carlo gives a tight binomial
              CI (~±0.8% at 90%) · stripe is subtle but present as brand
              IP statement「AI 計算的是機率 · 不是命運」 turned VISUAL.
              No legend here (already explained on homepage HeroLiveCard);
              keeps power-user surface clean. */}
          <div className="mt-2">
            <UncertaintyStripe estimate={homePct} n={stats.completed} height={4} />
          </div>

          {/* Counters */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Counter
              label="主隊勝場"
              value={stats.homeWins}
              color={homePct >= awayPct ? "gold" : "mute"}
            />
            <Counter
              label="客隊勝場"
              value={stats.awayWins}
              color={awayPct > homePct ? "gold" : "mute"}
            />
            <Counter label="平手" value={stats.ties} color="mute" />
            <Counter
              label="平均總得分"
              value={avgRuns}
              decimals={2}
              color="bone"
            />
          </div>
        </div>
      </section>

      {/* ── SCORE DISTRIBUTION ───────────────────── */}
      <section className="pb-14">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-6">
          / 比分分布(收斂中)
        </p>

        {distribution.length === 0 ? (
          <div className="bg-slate/40 border border-line/60 p-10 text-center">
            <p className="font-mono text-mute text-xs tracking-[0.25em]">
              按下「跑模擬」開始採樣
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {distribution.map((row, i) => (
              <div key={row.score} className="flex items-center gap-4">
                <span className="font-mono text-mute text-[10px] tracking-[0.3em] w-8">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-bone tabular text-lg w-20">
                  {row.score.replace("-", " : ")}
                </span>
                <div className="flex-1 relative h-[2px] bg-line/80">
                  <div
                    className="absolute top-0 left-0 h-full bg-gold glow-gold"
                    style={{
                      width: `${Math.min(100, (row.pct / 20) * 100)}%`,
                      transition: "width 200ms ease-out",
                    }}
                  />
                </div>
                <span className="font-mono text-gold tabular text-sm w-20 text-right">
                  {row.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── RUN DIFFERENTIAL HISTOGRAM ────────────
          Round 29 Wave 6 · Resolves Round 28 UNRESOLVED「N=10K
          Uncertainty Stripe 太窄」(±0.8% CI 視覺不可見)。10K trials
          自帶 score-level distribution · 從 scoreCounts 拉 7-bucket
          histogram(主場 7+/4-6/1-3 · TIE · 客場 1-3/4-6/7+)·
          暴露真實 spread。
          視覺:HOME 領先 gold gradient · TIE neutral · AWAY 領先 mute ·
          center-anchored layout(0 line 在中央 · 對稱兩側)·
          Bank of England fan chart + Baseball Savant EV histogram 結合。
          只 render when 至少有 1 場 sim · 同 score distribution 條件。 */}
      {diffBuckets.length > 0 && diffBuckets.some((b) => b.count > 0) && (
        <section className="pb-14" aria-labelledby="run-diff-heading">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
            <p
              id="run-diff-heading"
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em]"
            >
              / 比分差距分布(score-level uncertainty)
            </p>
            <p
              lang="en"
              className="font-mono text-mute/60 text-[9px] tracking-[0.3em]"
              title="N=10K trials 自帶 distribution · 不需 bootstrap · 不需額外 sims"
            >
              N = {stats.completed.toLocaleString()} · 0 EXTRA COMPUTE
            </p>
          </div>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mb-6 leading-relaxed">
            ▸ Round 28 Uncertainty Stripe 顯示 winRate 的 ±0.8% binomial CI
            (太窄) · 這裡顯示真正的 spread:同樣 winRate 可能 4:3 也可能 12:1。
          </p>
          <div className="bg-slate/40 border border-line/70 p-5 sm:p-7">
            <ul className="space-y-2.5 list-none pl-0">
              {diffBuckets.map((bucket) => (
                <RunDiffRow
                  key={bucket.id}
                  bucket={bucket}
                  maxPct={maxBucketPct}
                />
              ))}
            </ul>
            <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em] leading-relaxed mt-5 pt-4 border-t border-line/40">
              ▸ <span lang="en">GOLD</span> = 主場勝 ·{" "}
              <span lang="en">MUTE</span> = 客場勝 · TIE = 9 局結束 0:0(極罕見)
              · 7+ 分差 = blowout tail(不藏)
            </p>
          </div>
        </section>
      )}

      {/* ── COMPLETION CARD ──────────────────────── */}
      {done && (
        <section className="pb-14">
          {/* Round 18 motion polish (Agent A #5 · @starting-style) ·
              card fade-ups 320ms when sim finishes · matches the
              "compute settled" moment per Bloomberg-terminal pattern.
              Pure CSS · 0 JS · prefers-reduced-motion safe. */}
          <div className="bg-slate/40 border border-gold/50 p-10 text-center enter-fade-up">
            <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
              ✓ 模擬完成 · N = 10,000 · v0.2 引擎
            </p>
            <h3 className="text-2xl text-bone font-light tracking-tight mb-4">
              逐打席引擎收斂:
              <span className="text-gold font-mono tabular mx-2">
                {homePct.toFixed(1)}% / {awayPct.toFixed(1)}%
              </span>
            </h3>
            <p className="text-mute text-sm max-w-md mx-auto leading-relaxed">
              鎖定的 AI 預測為{" "}
              <span className="font-mono text-bone tabular">
                {match.home.winRate}% / {match.away.winRate}%
              </span>
              。
              <br />
              每一個打席 · 引擎用 K/9 · BB/9 · HR/9 滾出 8 種結果(三振/保送/全壘打/單打/二壘/三壘/滾飛/高飛)·
              跑者照棒球規則推進累計分數。
              <br />
              <span className="text-gold">連棒球本身,都是真的算的。</span>
            </p>
            {/* Round 12 funnel-audit: completion card is THE highest-
                intent moment in the funnel · visitor just watched
                10K sims converge in 2s · commitment-consistency peak
                (Cialdini). Tertiary Founders link catches the dopamine
                spike inside the card · doesn't compete with /matches CTA. */}
            {FOUNDERS_REMAINING > 0 && (
              <p className="mt-6 pt-5 border-t border-gold/20 font-mono text-mute/80 text-[10px] tracking-[0.3em] tabular">
                喜歡這個引擎? ·{" "}
                <Link
                  href="/founders"
                  className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
                >
                  加入 {FOUNDERS_REMAINING} 個剩下的位置 →
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── REPLAY MODE ──────────────────────────── */}
      <section className="pb-10 border-t border-line/40 pt-12">
        <ReplayBroadcast
          homeName={match.home.name}
          homeEn={match.home.en}
          homePitcher={match.home.pitcher}
          awayName={match.away.name}
          awayEn={match.away.en}
          awayPitcher={match.away.pitcher}
          keyId={match.id}
        />
      </section>

      {/* ── PROVENANCE STAMP ─────────────────────────────
          Round 12 brand-IP amplification (Agent A #6 · Patek/Bloomberg
          citation pattern). Every screenshot of engine output now
          carries the commit SHA + match ID — verifiable, citable,
          fork-able. The provenance IS the proof of "method public". */}
      <section className="pb-10 border-t border-line/30 pt-8">
        <ProvenanceStamp
          matchId={match.id.startsWith("custom-") ? "synthetic" : match.id}
        />
      </section>
    </>
  );
}

// ── Run Differential Histogram row ─────────────────────
// Round 29 Wave 6 · One row in the 7-bucket run-differential histogram.
// Bar width normalized against the max bucket pct in the set so visual
// differences read clearly even at low sample counts.
function RunDiffRow({
  bucket,
  maxPct,
}: {
  bucket: RunDiffBucket;
  maxPct: number;
}) {
  const widthPct = maxPct > 0 ? (bucket.pct / maxPct) * 100 : 0;
  const sideColor =
    bucket.side === "home"
      ? "bg-gold"
      : bucket.side === "tie"
      ? "bg-bone/60"
      : "bg-mute/70";
  const labelColor =
    bucket.side === "home"
      ? "text-gold"
      : bucket.side === "tie"
      ? "text-bone/80"
      : "text-mute";
  const pctColor =
    bucket.side === "home"
      ? "text-gold"
      : bucket.side === "tie"
      ? "text-bone/80"
      : "text-mute";
  return (
    <li className="grid grid-cols-[140px_1fr_60px] sm:grid-cols-[180px_1fr_70px] gap-3 items-center">
      <div>
        <p className={`text-xs sm:text-sm leading-tight ${labelColor}`}>
          {bucket.label}
        </p>
        <p
          lang="en"
          className="font-mono text-mute/60 text-[9px] tracking-[0.2em] mt-0.5"
        >
          {bucket.labelEn}
        </p>
      </div>
      <div
        className="relative h-2 bg-line/40 rounded-sm overflow-hidden"
        role="img"
        aria-label={`${bucket.label} · ${bucket.pct.toFixed(1)}% of 10K trials`}
      >
        <div
          className={`absolute top-0 left-0 h-full ${sideColor} ${
            bucket.side === "home" ? "glow-gold" : ""
          }`}
          style={{
            width: `${widthPct}%`,
            transition: "width 250ms ease-out",
          }}
        />
      </div>
      <span
        className={`font-mono tabular text-xs sm:text-sm text-right ${pctColor}`}
      >
        {bucket.pct.toFixed(1)}%
      </span>
    </li>
  );
}

// ── Counter mini-component ─────────────────────────────
function Counter({
  label,
  value,
  decimals = 0,
  color,
}: {
  label: string;
  value: number;
  decimals?: number;
  color: "gold" | "bone" | "mute";
}) {
  const colorClass =
    color === "gold"
      ? "text-gold"
      : color === "bone"
      ? "text-bone"
      : "text-mute";
  return (
    <div>
      <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
        {label}
      </p>
      <p className={`font-mono tabular text-2xl ${colorClass}`}>
        {decimals > 0
          ? value.toFixed(decimals)
          : value.toLocaleString()}
      </p>
    </div>
  );
}
