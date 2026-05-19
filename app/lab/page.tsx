"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { matches } from "@/lib/matches";
import {
  simulateGame,
  applyBatch,
  initialStats,
  topScores,
  type RunningStats,
  type GameResult,
} from "@/lib/simulator";

const TOTAL_SIMS = 10_000;
const BATCH = 200;

export default function LabPage() {
  // Default to the first match
  const [matchId, setMatchId] = useState(matches[0].id);
  const match = matches.find((m) => m.id === matchId)!;

  const [stats, setStats] = useState<RunningStats>(initialStats);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Clean up animation frame on unmount / matchup change
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Reset whenever user picks a new matchup
  function selectMatch(id: string) {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setMatchId(id);
    setStats(initialStats);
    setRunning(false);
    setDone(false);
  }

  function start() {
    if (running) return;
    setStats(initialStats);
    setRunning(true);
    setDone(false);

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

      if (acc.completed < TOTAL_SIMS) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setRunning(false);
        setDone(true);
        rafRef.current = null;
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

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="lab" />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.35em]">
          <span className="text-gold">LIVE AI LABORATORY</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            v0.2 · REAL AT-BAT
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          親眼看
          <span className="text-gold">演算法</span>
          跑。
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed text-base">
          每場虛擬比賽都是{" "}
          <span className="font-mono text-gold/80">逐打席</span>
          模擬:9 局、27 個出局數、滿壘保送會推進跑者。
          選一場 CPBL 比賽,按下執行,看 10,000 次模擬如何在
          兩秒內從亂數收斂成穩定的勝率分布。
        </p>
      </section>

      {/* ── MATCH SELECTOR ───────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-8">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / 01 · SELECT A MATCHUP
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {matches.map((m) => {
            const active = m.id === matchId;
            return (
              <button
                key={m.id}
                onClick={() => selectMatch(m.id)}
                disabled={running}
                className={`text-left p-4 border transition-colors ${
                  active
                    ? "border-gold bg-gold/10 text-bone"
                    : "border-line/60 text-mute hover:border-gold/40 hover:text-bone"
                } ${running ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <p className="text-base font-light leading-tight">
                  {m.home.name}
                </p>
                <p className="font-mono text-[10px] text-mute tracking-[0.2em] my-1">
                  VS
                </p>
                <p className="text-base font-light leading-tight">
                  {m.away.name}
                </p>
                <p className="font-mono text-[10px] text-gold/70 tabular mt-3 tracking-[0.2em]">
                  HISTORICAL · {m.home.winRate}% / {m.away.winRate}%
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── RUN BUTTON ───────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-12">
        <button
          onClick={start}
          disabled={running}
          className={`w-full py-6 border text-sm tracking-[0.35em] font-medium transition-colors ${
            running
              ? "border-gold/40 text-gold/60 cursor-not-allowed bg-gold/5"
              : "border-gold bg-gold text-navy hover:bg-gold-soft"
          }`}
        >
          {running
            ? `▸ SIMULATING ${stats.completed.toLocaleString()} / ${TOTAL_SIMS.toLocaleString()}`
            : done
            ? "▸ RUN AGAIN"
            : "▶ RUN 10,000 SIMULATIONS"}
        </button>

        {/* Progress bar */}
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

      {/* ── LIVE RESULTS ─────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-16">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-6">
          / 02 · LIVE WIN PROBABILITY
        </p>

        <div className="bg-slate/70 border border-line/80 glow-soft p-8 sm:p-10">
          {/* Big numbers */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                HOME · {match.home.name}
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
                {match.away.name} · AWAY
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

          {/* Counters */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Counter
              label="HOME WINS"
              value={stats.homeWins}
              color={homePct >= awayPct ? "gold" : "mute"}
            />
            <Counter
              label="AWAY WINS"
              value={stats.awayWins}
              color={awayPct > homePct ? "gold" : "mute"}
            />
            <Counter label="TIES" value={stats.ties} color="mute" />
            <Counter
              label="AVG TOTAL RUNS"
              value={avgRuns}
              decimals={2}
              color="bone"
            />
          </div>
        </div>
      </section>

      {/* ── SCORE DISTRIBUTION ───────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-20">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-6">
          / 03 · EMERGING SCORE DISTRIBUTION
        </p>

        {distribution.length === 0 ? (
          <div className="bg-slate/40 border border-line/60 p-10 text-center">
            <p className="font-mono text-mute text-xs tracking-[0.25em]">
              PRESS RUN TO BEGIN SAMPLING.
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

      {/* ── COMPLETION CARD ──────────────────────── */}
      {done && (
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20">
          <div className="bg-slate/40 border border-gold/50 p-10 text-center">
            <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
              ✓ SIMULATION COMPLETE · N = 10,000 · v0.2 ENGINE
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
              v0.2 引擎使用投手 K/9 · BB/9 · HR/9 推導打席結果機率,
              純由壘上跑者推進物理累計分數。
              <br />
              <span className="text-gold">這次,連棒球都是真的。</span>
            </p>
          </div>
        </section>
      )}

      {/* ── METHODOLOGY NOTE ─────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-12">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / METHODOLOGY · v0.2 — REAL AT-BAT
        </p>
        <div className="space-y-4 text-mute text-sm leading-relaxed">
          <p>
            v0.2 引擎升級為<strong className="text-bone">逐打席對決模型</strong>。
            每個打席依該投手的 K/9 · BB/9 · HR/9 推導出 8 種互斥結果
            (K · BB · HR · 1B · 2B · 3B · GO · FO)的機率,滾亂數選一個,
            執行對應的壘上推進物理(滿壘保送強制得分、二壘安打 + 一壘跑者
            50% 機率回本壘等),累計分數與出局數。
          </p>
          <p>
            一場虛擬比賽需要模擬約 <strong className="text-bone">70 個打席</strong>(9 局
            × 約 8 次半局打席)。10,000 場 = 約 70 萬次亂數採樣,全部在
            瀏覽器端執行,&lt; 2 秒收斂。
          </p>
          <p>
            <strong className="text-bone">下一站 v0.3:</strong>
            加入打者個別進階數據 (OPS / wRC+ / Platoon Splits) 細化結果機率;
            v0.4 接上 Trackman 球速 + 轉軸的物理先驗。
          </p>
        </div>
      </section>

      <Footer />
    </div>
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
