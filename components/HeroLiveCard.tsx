"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Match } from "@/lib/matches";
import {
  simulateGame,
  applyBatch,
  initialStats,
  type RunningStats,
  type GameResult,
} from "@/lib/simulator";

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
  const [phase, setPhase] = useState<"simulating" | "converged">("simulating");
  const rafRef = useRef<number | null>(null);

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
        setPhase("converged");
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
      className="bg-slate/70 border border-line/80 glow-soft p-8 sm:p-12"
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full bg-gold ${
              phase === "simulating" ? "shimmer" : ""
            } glow-gold`}
          />
          <span
            role="status"
            aria-live="polite"
            className="font-mono text-gold text-[10px] tracking-[0.35em]"
          >
            {phase === "simulating"
              ? "● 即時模擬中"
              : "● AI 模型 · 已收斂"}
          </span>
        </div>
        <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
          {match.date} · {match.startTime}
        </span>
      </div>

      {/* Team labels */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
            HOME
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
            {match.home.name}
          </h2>
          <p className="font-mono text-gold/60 text-xs tracking-[0.25em] mt-1">
            {match.home.en}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
            AWAY
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
            {match.away.name}
          </h2>
          <p className="font-mono text-gold/60 text-xs tracking-[0.25em] mt-1">
            {match.away.en}
          </p>
        </div>
      </div>

      {/* Live win percentages */}
      <div className="flex items-baseline justify-between mb-3">
        <span
          className={`font-mono text-3xl sm:text-4xl tabular tracking-tight ${
            homeFav ? "text-gold" : "text-mute"
          }`}
          style={{ transition: "color 200ms ease" }}
        >
          {homePct.toFixed(1)}
          <span className="text-base opacity-60 ml-0.5">%</span>
        </span>
        <span
          className={`font-mono text-3xl sm:text-4xl tabular tracking-tight ${
            !homeFav ? "text-gold" : "text-mute"
          }`}
          style={{ transition: "color 200ms ease" }}
        >
          {awayPct.toFixed(1)}
          <span className="text-base opacity-60 ml-0.5">%</span>
        </span>
      </div>

      {/* The signature bar */}
      <div className="relative h-[3px] bg-line/80 overflow-visible">
        <div
          className={`absolute top-0 left-0 h-full bg-gold glow-gold ${
            phase === "converged" ? "shimmer" : ""
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

      {/* Methodology line — with live counter */}
      <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] mt-5 tabular">
        蒙地卡羅 ·{" "}
        <span className="text-gold/80">
          {stats.completed.toLocaleString()}
        </span>{" "}
        / {TOTAL_HERO_SIMS.toLocaleString()} 場 · 在您瀏覽器即時運算
      </p>

      {/* Pitcher matchup */}
      <div className="mt-10 grid grid-cols-2 gap-6 pt-6 border-t border-line/60">
        <div>
          <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
            HOME STARTER
          </p>
          <p className="text-bone text-lg">{match.home.pitcher.name}</p>
          <p className="font-mono text-gold/70 text-xs tabular mt-1">
            ERA · {match.home.pitcher.era}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
            AWAY STARTER
          </p>
          <p className="text-bone text-lg">{match.away.pitcher.name}</p>
          <p className="font-mono text-gold/70 text-xs tabular mt-1">
            ERA · {match.away.pitcher.era}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link
          href="/matches"
          className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
        >
          查看今日完整賽事板 →
        </Link>
        <Link
          href={`/matches/${match.id}`}
          className="px-8 py-3 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
        >
          完整分析 →
        </Link>
      </div>
    </article>
  );
}
