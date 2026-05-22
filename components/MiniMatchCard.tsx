import Link from "next/link";
import {
  getMatchPhase,
  getCalibration,
  getEnginePctOnWinner,
  type Match,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";

// ── ZONE 27 · Mini Match Card ────────────────────────────
// Round 31 Wave A · Compact static-engine card for the homepage
// TonightReceiptsCard multi-match grid. Companion to HeroLiveCard:
// HeroLiveCard runs the live 1000-game Monte Carlo cinematic for
// single-match days (visitor sees the algorithm converge in real
// time · brand IP soul). MiniMatchCard is the LOCK-IN viewer for
// multi-match days — shows the engine's pre-locked prediction
// (`match.home.winRate` / `match.away.winRate`) without re-running
// the simulation. This is INTENTIONAL brand IP discipline:
//
//   1. Costly Signaling purity. The predictions were locked in
//      BEFORE first pitch (when Tim screenshot the pregame and
//      Claude ingested via lib/matches.ts). Re-running a fresh
//      simulation on every visitor's browser would let us game
//      the receipt by sampling until we like the answer. Static
//      output proves the lock-in is real and immutable.
//
//   2. CPU budget. 3 simultaneous 1000-sim cards = 3000 sims on
//      mount = ~3-6 sec on mobile. The grid is a glance-mode
//      viewer · not a full-engine experience. Visitors who want
//      the full sim click through to /matches/[gameId] where
//      MatchSimulator runs the full theatre.
//
//   3. Visual hierarchy. The grid's job is to show 3 LOCKED bets
//      at once for the Costly Signaling brand IP moment. The
//      single-card cinematic (HeroLiveCard) is preserved for
//      receipt-mode days when there's ONE thing to focus on.
//
// Phase badge logic mirrors HeroLiveCard's PhaseBadge for
// consistency · same 5-state lifecycle. Final-state cards show
// PROVED ✓ / DIVERGED ✕ inline (compact receipt) without the
// full pitcher-stats panel that HeroLiveCard has room for.
// ─────────────────────────────────────────────────────

export default function MiniMatchCard({ match }: { match: Match }) {
  const matchPhase: MatchPhase | null = getMatchPhase(match);
  const calibration = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);

  // Static engine output — the pre-locked prediction. Brand-IP
  // critical: these came from match.home.winRate which was set at
  // ingestion time · NOT re-sampled per visitor.
  const homePct = match.home.winRate;
  const awayPct = match.away.winRate;
  const homeFav = homePct >= awayPct;

  return (
    <article
      aria-label={`${match.home.name} versus ${match.away.name} · engine prediction ${homePct}-${awayPct}`}
      className="bg-slate/40 border border-line/60 p-4 sm:p-5 flex flex-col gap-3 transition-colors hover:border-gold/40"
    >
      {/* Time + venue + phase badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-mute text-[9px] tracking-[0.25em] tabular">
          {match.startTime} · {match.venue.replace("棒球場", "").replace("大巨蛋", "巨蛋")}
        </span>
        <MiniPhaseBadge phase={matchPhase} calibration={calibration} />
      </div>

      {/* Team labels — symmetric layout */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        <div>
          <p className="font-mono text-mute text-[8px] tracking-[0.3em] mb-0.5">
            HOME
          </p>
          <h3 className="text-bone text-sm sm:text-base font-light tracking-tight leading-snug">
            {match.home.name}
          </h3>
          <p className="font-mono text-gold/60 text-[9px] tracking-[0.25em] mt-0.5">
            {match.home.en}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute text-[8px] tracking-[0.3em] mb-0.5">
            AWAY
          </p>
          <h3 className="text-bone text-sm sm:text-base font-light tracking-tight leading-snug">
            {match.away.name}
          </h3>
          <p className="font-mono text-gold/60 text-[9px] tracking-[0.25em] mt-0.5">
            {match.away.en}
          </p>
        </div>
      </div>

      {/* Engine static bar — pre-locked output */}
      <div className="mt-2">
        <div className="flex items-baseline justify-between mb-1.5">
          <span
            className={`font-mono text-xl sm:text-2xl tabular tracking-tight ${
              homeFav ? "text-gold" : "text-mute"
            }`}
          >
            {homePct}
            <span className="text-xs opacity-60 ml-0.5">%</span>
          </span>
          <span
            className={`font-mono text-xl sm:text-2xl tabular tracking-tight ${
              !homeFav ? "text-gold" : "text-mute"
            }`}
          >
            {awayPct}
            <span className="text-xs opacity-60 ml-0.5">%</span>
          </span>
        </div>

        {/* Static signature bar */}
        <div className="relative h-[2px] bg-line/80 overflow-visible">
          <div
            className="absolute top-0 left-0 h-full bg-gold glow-gold"
            style={{ width: `${homePct}%` }}
          />
          <div
            className="absolute -top-1 h-[8px] w-px bg-gold/80"
            style={{ left: `${homePct}%` }}
          />
        </div>
      </div>

      {/* Final result strip — only when ingested */}
      {match.finalResult && calibration && (
        <div className="mt-2 pt-2 border-t border-gold/20">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="font-mono text-mute text-[9px] tracking-[0.25em]">
              ACTUAL
            </span>
            <span className="font-mono text-bone text-base tabular tracking-tight">
              {match.finalResult.homeScore}:{match.finalResult.awayScore}
              <span className="text-mute text-[10px] ml-1.5">
                {match.finalResult.winner === "home"
                  ? match.home.en + " W"
                  : match.finalResult.winner === "away"
                  ? match.away.en + " W"
                  : "TIE"}
              </span>
            </span>
          </div>
          <MiniCalibrationVerdict
            calibration={calibration}
            enginePctOnWinner={enginePctOnWinner}
          />
        </div>
      )}

      {/* Click-through to full sim */}
      <Link
        href={`/matches/${match.id}`}
        className="mt-auto pt-2 font-mono text-gold/70 text-[10px] tracking-[0.3em] hover:text-gold transition-colors text-right"
      >
        完整分析 →
      </Link>
    </article>
  );
}

// ── Mini phase badge ────────────────────────────────────
// Smaller variant of HeroLiveCard's PhaseBadge · same 5-state
// logic · tighter padding for grid cells.

function MiniPhaseBadge({
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
      proved: "✓ PROVED",
      diverged: "✕ DIVERGED",
      push: "= PUSH",
    } as const;
    return (
      <span
        lang="en"
        className={`px-1 py-0.5 text-[7px] tracking-[0.2em] border font-mono whitespace-nowrap ${styles[calibration]}`}
      >
        {labels[calibration]}
      </span>
    );
  }

  if (phase === "today-pregame") {
    return (
      <span
        lang="en"
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap"
      >
        PREGAME
      </span>
    );
  }

  if (phase === "today-live") {
    return (
      <span
        lang="en"
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap shimmer"
      >
        LIVE
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        lang="en"
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold/50 text-gold font-mono whitespace-nowrap"
      >
        PREVIEW
      </span>
    );
  }

  return (
    <span
      lang="en"
      className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-mute/60 text-mute font-mono whitespace-nowrap"
    >
      ARCHIVED
    </span>
  );
}

function MiniCalibrationVerdict({
  calibration,
  enginePctOnWinner,
}: {
  calibration: Calibration;
  enginePctOnWinner: number | null;
}) {
  if (calibration === "push") {
    return (
      <p className="font-mono text-mute text-[9px] tracking-[0.25em] mt-1">
        無 favorite · PUSH
      </p>
    );
  }
  return (
    <p
      className={`font-mono text-[9px] tracking-[0.25em] mt-1 ${
        calibration === "proved" ? "text-gold/80" : "text-loss/80"
      }`}
    >
      {calibration === "proved" ? "✓ 引擎言中" : "✕ 引擎落空"}
      {enginePctOnWinner !== null && (
        <span className="opacity-70 ml-1">
          ({enginePctOnWinner}% → {calibration === "proved" ? "WIN" : "卻贏"})
        </span>
      )}
    </p>
  );
}
