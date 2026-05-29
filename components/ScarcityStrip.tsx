import Link from "next/link";
import {
  FOUNDERS_CLAIMED,
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";

// ── ZONE 27 · Site-wide scarcity strip ─────────────────
// Sits just below the Nav on every page. Shows the *real*
// founder-seat count — not marketing copy, a fact in the chrome.
// Research signal: deterministic scarcity converts ~2.3× vs
// fake-urgency copy ("hurry, only 3 left!"). The wall is the
// proof; this strip is the persistent reminder.
//
// Hidden when:
//   - users prefer reduced motion: still shown (it's static text)
//   - the count reaches 270: copy flips to "FORGED · CLOSED"
// ─────────────────────────────────────────────────────

export default function ScarcityStrip() {
  const isClosed = FOUNDERS_REMAINING === 0;

  return (
    <Link
      href="/founders"
      aria-label={
        isClosed
          ? "Founder seats closed — 270 of 270 forged"
          : `Founders 27 — ${FOUNDERS_CLAIMED} of ${FOUNDERS_TOTAL} founder seats forged, ${FOUNDERS_REMAINING} remain, next badge ${formatBadge(FOUNDERS_NEXT)}`
      }
      data-print-hide="true"
      className="block w-full border-b border-gold/15 bg-ink/40 hover:bg-ink/60 transition-colors group"
    >
      <div
        lang="en"
        className="mx-auto max-w-6xl px-4 sm:px-10 py-2.5 flex items-center justify-center gap-3 sm:gap-5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.28em] text-mute group-hover:text-bone transition-colors"
      >
        {/* Live heartbeat */}
        <span
          className="w-1.5 h-1.5 rounded-full bg-gold/80 shrink-0"
          style={{ boxShadow: "0 0 8px rgba(212, 175, 55, 0.6)" }}
          aria-hidden="true"
        />

        {/* Forged count */}
        <span className="tabular">
          <span className="text-gold">{FOUNDERS_CLAIMED}</span>
          <span className="text-mute/50"> / </span>
          <span>{FOUNDERS_TOTAL}</span>
        </span>

        <span className="hidden sm:inline">FOUNDER SEATS FORGED</span>
        <span className="sm:hidden">FORGED</span>

        <span className="text-mute/30" aria-hidden="true">·</span>

        {isClosed ? (
          <span className="text-gold">1ST EDITION CLOSED</span>
        ) : (
          <>
            <span className="tabular">
              <span className="text-bone">{FOUNDERS_REMAINING}</span> REMAIN
            </span>
            <span className="text-mute/30" aria-hidden="true">·</span>
            <span className="hidden sm:inline">2026 班售完關閉</span>
            <span className="sm:hidden">2026 班關閉</span>
            <span className="hidden md:inline text-mute/30" aria-hidden="true">·</span>
            <span className="hidden md:inline tabular text-mute group-hover:text-gold transition-colors">
              NEXT {formatBadge(FOUNDERS_NEXT)} →
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
