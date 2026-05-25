import Link from "next/link";
import { getStatDefinition } from "@/lib/stat-definitions";

// ── ZONE 27 · StatTerm tooltip ──────────────────────────
// Inline glossary at point-of-use, inspired by Baseball Savant's
// "[▸ Definition]" links next to every advanced metric. Improves
// comprehension for visitors who aren't fluent in K/9, BB/9, wRC+
// without forcing a navigation round-trip to /glossary.
//
// Design:
//   - Term wrapped with a dotted gold underline (signals interactivity)
//   - Hover (desktop) OR focus (keyboard) reveals the definition card
//   - Definition card is absolutely positioned, breaks out of line
//   - Mobile: tap-able via tabIndex=0 + focus state
//   - Tooltip card includes "→ 完整定義" deep link to /glossary#slug
//
// Accessibility:
//   - Term has role="button" + tabIndex=0 so it's reachable via keyboard
//   - aria-describedby connects term to definition card
//   - Tooltip uses CSS group-hover + group-focus-within for reveal
//   - prefers-reduced-motion: transitions still happen (no movement,
//     just opacity), so users see the same affordance
//
// Server-component friendly: no useState, no useEffect — pure JSX +
// Tailwind classes for the reveal logic.
// ─────────────────────────────────────────────────────

let tooltipIdCounter = 0;

export default function StatTerm({
  term,
  children,
}: {
  /** The stat abbreviation, e.g. "K/9". Must exist in STAT_DEFINITIONS. */
  term: string;
  /** Optional display children — defaults to {term}. Useful when the
   *  visible text differs slightly (e.g. uppercase variants). */
  children?: React.ReactNode;
}) {
  const def = getStatDefinition(term);

  // Graceful degradation — if the term isn't in our dictionary,
  // just render its text unwrapped (no broken tooltip).
  if (!def) {
    return <>{children ?? term}</>;
  }

  const instanceId = ++tooltipIdCounter;
  const tooltipId = `stat-tooltip-${def.slug}-${instanceId}`;
  // R109 W2 · Unique anchor-name per StatTerm instance · multiple StatTerm 同
  // page 不衝突(CSS spec「最後 tree-order anchor wins if shared name」 解決)。
  const anchorName = `--stat-anchor-${def.slug}-${instanceId}`;

  return (
    <span className="relative inline-block group">
      <span
        role="button"
        tabIndex={0}
        aria-describedby={tooltipId}
        style={{ anchorName } as React.CSSProperties}
        className="stat-term-anchor font-mono border-b border-dotted border-gold/50 cursor-help text-bone hover:text-gold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      >
        {children ?? def.abbr}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        style={{ positionAnchor: anchorName } as React.CSSProperties}
        className="
          stat-tooltip-anchored
          absolute left-0 bottom-full mb-2 z-30
          w-72 max-w-[calc(100vw-3rem)]
          invisible opacity-0
          group-hover:visible group-hover:opacity-100
          group-focus-within:visible group-focus-within:opacity-100
          transition-opacity duration-150
          bg-ink/95 border border-gold/40 p-4
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
          text-left font-sans whitespace-normal
          pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto
        "
      >
        <span className="block font-mono text-gold text-[10px] tracking-[0.3em] mb-1">
          {def.abbr}
        </span>
        <span
          lang="en"
          className="block font-mono text-mute text-[10px] tracking-[0.2em] mb-2"
        >
          {def.en}
        </span>
        <span className="block text-bone text-sm font-light leading-snug mb-2">
          {def.zh}
        </span>
        <span className="block text-mute text-xs leading-relaxed mb-3">
          {def.def}
        </span>
        {def.bench && (
          <span className="block font-mono text-gold/70 text-[10px] tabular tracking-[0.15em] mb-3">
            ▸ {def.bench}
          </span>
        )}
        <Link
          href={`/glossary#${def.slug}`}
          className="block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.25em] pt-2 border-t border-line/60"
        >
          讀完整定義 → /glossary
        </Link>
      </span>
    </span>
  );
}
