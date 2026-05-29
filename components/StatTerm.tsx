import Link from "next/link";
import { useId } from "react";
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
//   - Tooltip uses CSS group-hover + group-focus-within for reveal(keyboard
//     focus 觸發 :focus-within on outer .group · 不需要 Space/Enter handler
//     因 focus IS the reveal action · per WCAG 2.1 SC 2.4.7 focus visible)
//   - prefers-reduced-motion: transitions still happen (no movement,
//     just opacity), so users see the same affordance
//
// Server-component friendly: useId() works in RSC + client components ·
// Tailwind classes for the reveal logic.
//
// R120 W2 · Agent B R120 audit HIGH 1 fix · 之前 `let tooltipIdCounter = 0`
// module-level mutable counter · 在 SSR concurrent render OR multiple
// StatTerm 同 page 可能 ID collision · 改用 React 18+ useId() canonical hook ·
// auto-collision-free per React semantics · 同 anchor-name custom-ident sanitize
// (useId returns `:r0:` 含 colons · CSS custom-ident 不允許 colons · 改 :→_)。
// ─────────────────────────────────────────────────────

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
  // useId() called BEFORE conditional return per Rules of Hooks · graceful
  // degradation path still hits the hook · 0 perf impact since hook is cheap。
  const reactId = useId();

  // Graceful degradation — if the term isn't in our dictionary,
  // just render its text unwrapped (no broken tooltip).
  if (!def) {
    return <>{children ?? term}</>;
  }

  // useId returns `:r0:` 含 colons · HTML id allow colons · BUT CSS
  // custom-ident(anchor-name)disallow colons · sanitize to `_` 統一。
  const safeId = reactId.replace(/:/g, "_");
  const tooltipId = `stat-tooltip-${def.slug}-${safeId}`;
  // R109 W2 · Unique anchor-name per StatTerm instance · multiple StatTerm 同
  // page 不衝突(CSS spec「最後 tree-order anchor wins if shared name」 解決)。
  // R120 W2 · useId-derived 取代 module-level mutable counter · auto-collision-free。
  const anchorName = `--stat-anchor-${def.slug}-${safeId}`;

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
          href="/methodology"
          className="block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.25em] pt-2 border-t border-line/60"
        >
          深入了解 → /methodology
        </Link>
      </span>
    </span>
  );
}
