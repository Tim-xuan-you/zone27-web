import Link from "next/link";
import MiniMatchCard from "@/components/MiniMatchCard";
import {
  getMatchPhase,
  type Match,
} from "@/lib/matches";

// ── ZONE 27 · Tonight Receipts Card ──────────────────────
// Round 31 Wave A · The Costly Signaling brand IP physical
// moment for multi-game CPBL days. When 2+ matches share a
// day, the homepage HeroLiveCard single-game cinematic gets
// REPLACED by this multi-match grid:
//
//   ┌──────────────────────────────────────────────────────┐
//   │ ● 今晚 · 3 場引擎預測已 LOCKED                        │
//   │ ENGINE PUBLISHED · 2026-05-22 · 18:35 同步開賽       │
//   │                                                       │
//   │ ┌────────┐ ┌────────┐ ┌────────┐                     │
//   │ │ Card 1 │ │ Card 2 │ │ Card 3 │                     │
//   │ └────────┘ └────────┘ └────────┘                     │
//   │                                                       │
//   │ TRACK RECORD · N=1 · ✓1 ✕0 → 22:30 後 +3             │
//   │                                  完整公開戰績 →       │
//   └──────────────────────────────────────────────────────┘
//
// Why this matters (brand IP physics moment):
//
//   1. Costly Signaling at scale. 3 pre-locked predictions in
//      one night = 3x the chance to be visibly wrong. ZONE 27
//      chooses to put all 3 on the front door anyway. That's
//      what "方法公開" looks like at multi-game cadence.
//
//   2. Cumulative track record visible AT THE MOMENT OF LOCK-IN.
//      Visitors see "N=1 today, +3 by 22:30" and understand the
//      growth trajectory of the public ledger. Stratechery-style
//      transparency of the audit trail itself.
//
//   3. Brand-IP grammar "ONE thing" survives. The ONE thing is
//      not "one match" — it's "the receipt loop". When the day
//      has 3 receipts pending, showing all 3 IS the ONE thing.
//
// Phase logic (per matches in this card):
//   - All 3 pregame: "今晚 · LOCKED · 等待開賽"
//   - Mixed pregame/live: "賽事陸續開打"
//   - All live: "賽事進行中 · 結果即將揭曉"
//   - Mixed live/final: "部分收據已入帳"
//   - All final: "今晚 3 場 · 引擎收據已入帳"
// ─────────────────────────────────────────────────────

export default function TonightReceiptsCard({
  matches: todayMatches,
  trackRecord,
}: {
  matches: Match[];
  trackRecord: {
    total: number;
    proved: number;
    diverged: number;
    push: number;
  };
}) {
  const count = todayMatches.length;
  if (count === 0) return null;

  // Aggregate today's phase distribution for header copy.
  const phases = todayMatches.map((m) => getMatchPhase(m));
  const allPregame = phases.every((p) => p === "today-pregame");
  const allLive = phases.every((p) => p === "today-live");
  const allFinal = phases.every((p) => p === "final");
  const hasFinal = phases.some((p) => p === "final");
  const hasLive = phases.some((p) => p === "today-live");
  const finalTodayCount = phases.filter((p) => p === "final").length;
  const pendingTodayCount = count - finalTodayCount;

  // Pre-game expected resolution window. CPBL games typically last
  // ~3h · 18:35 start → ~21:30 end · with ingestion lag → 22:30 TPE
  // is the canonical "receipts in by" wall-clock.
  const expectedResolutionTime = "22:30 TPE";

  // Today's match date — all matches share the same date in this card.
  // Use the first match's display date.
  const matchDate = todayMatches[0].date;

  // Header copy by phase distribution.
  const { statusLine, accentLine } = (() => {
    if (allPregame) {
      return {
        statusLine: `今晚 · ${count} 場引擎預測已 LOCKED`,
        accentLine: `ENGINE PUBLISHED · ${matchDate} · 開賽前公開 · ${expectedResolutionTime} 收驗`,
      };
    }
    if (allLive) {
      return {
        statusLine: `今晚 · ${count} 場賽事進行中`,
        accentLine: `引擎預測已無法再改 · ${expectedResolutionTime} 收驗 receipt`,
      };
    }
    if (allFinal) {
      return {
        statusLine: `今晚 · ${count} 場引擎收據已入帳`,
        accentLine: `${matchDate} · 全數 receipt 入 /track-record · 不刪不藏`,
      };
    }
    if (hasFinal && (hasLive || phases.some((p) => p === "today-pregame"))) {
      return {
        statusLine: `今晚 · ${finalTodayCount}/${count} 場收據入帳`,
        accentLine: `${pendingTodayCount} 場仍進行中 · ${expectedResolutionTime} 全數收驗`,
      };
    }
    // Mixed pregame + live (no final yet)
    return {
      statusLine: `今晚 · ${count} 場賽事陸續開打`,
      accentLine: `引擎預測已 LOCKED · ${expectedResolutionTime} 收驗 receipt`,
    };
  })();

  // Cumulative N after tonight (current track record + tonight's pending).
  const projectedTotal = trackRecord.total + pendingTodayCount;

  return (
    <article
      aria-label={`Tonight's ${count} engine predictions · cumulative track record N=${trackRecord.total}`}
      className="bg-slate/70 border border-line/80 glow-soft p-5 sm:p-10"
    >
      {/* Header ─────────────────────────────────────────── */}
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-gold glow-gold"
          />
          <span
            className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.35em]"
          >
            ● {statusLine}
          </span>
        </div>
        <p
          lang="en"
          className="font-mono text-mute/80 text-[9px] sm:text-[10px] tracking-[0.3em] tabular leading-relaxed"
        >
          {accentLine}
        </p>
      </header>

      {/* Grid ───────────────────────────────────────────── */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          count === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : count >= 3
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {todayMatches.map((m) => (
          <MiniMatchCard key={m.id} match={m} />
        ))}
      </div>

      {/* Cumulative track record footer ─────────────────── */}
      <footer className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-line/60">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
            <span className="text-gold/80">TRACK RECORD</span>
            <span className="text-mute/60 mx-2">·</span>
            <span className="text-bone">N={trackRecord.total}</span>
            {trackRecord.total > 0 && (
              <>
                <span className="text-mute/60 mx-2">·</span>
                <span className="text-gold/90">✓{trackRecord.proved}</span>
                <span className="text-mute/60 mx-1">/</span>
                <span className="text-loss/80">✕{trackRecord.diverged}</span>
                {trackRecord.push > 0 && (
                  <>
                    <span className="text-mute/60 mx-1">/</span>
                    <span className="text-mute">={trackRecord.push}</span>
                  </>
                )}
              </>
            )}
            {pendingTodayCount > 0 && (
              <>
                <span className="text-mute/60 mx-2">→</span>
                <span className="text-gold/70">
                  {expectedResolutionTime} 後 N={projectedTotal}
                </span>
              </>
            )}
          </div>
          <Link
            href="/track-record"
            className="font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80 transition-opacity"
          >
            完整公開戰績 →
          </Link>
        </div>
      </footer>
    </article>
  );
}
