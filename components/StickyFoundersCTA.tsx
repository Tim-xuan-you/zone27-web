"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FOUNDERS_CLAIMED,
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

// ── ZONE 27 · Sticky Founders 27 CTA Bar(mobile-only)──
// Persistent conversion lever for mobile. Visible on every viewport
// while scrolling · removes the need for Founders 27 strip section
// (Round 5 moved that off homepage entirely).
//
// Research backing (Round 5 agent · Baymard / HubSpot 2026):
//   - "CTA above the fold = +30% conversion" (HubSpot · 40k landing pages)
//   - 80% mobile abandonment driven by preventable UX · sticky CTA mitigates
//   - Booking.com / Airbnb / Substack mobile pattern · proven
//
// Hidden on desktop (already has Nav CTA + Founders strip on /founders).
// Hidden on the /founders page itself (would compete with primary CTA).
// Hidden when sold out (FOUNDERS_REMAINING === 0).
//
// Spec:
//   - fixed bottom · z-30 above content · backdrop-blur for legibility
//   - 56px tall · respects iPhone home indicator with env(safe-area-inset)
//   - tap target ≥ 48px (Apple HIG)
//   - reduced-motion safe (no animation)
//
// Render strategy: ALWAYS render the DOM; toggle hidden via Tailwind
// `sm:hidden` so server-rendered HTML matches client. Page-specific
// hiding handled by parent (don't render at all on /founders).
// ─────────────────────────────────────────────────────

export default function StickyFoundersCTA() {
  const pathname = usePathname();
  // Hide on /founders (would compete with the page's own CTA form)
  // and on /lab/custom (power-user pitcher input form has bottom
  // controls · sticky CTA would obscure them).
  //
  // Round 9 hid /lab + /lab/custom both. Round 12 agent (conversion
  // funnel audit) flagged that as over-correction: /lab itself has
  // NO bottom controls — its completion card is THE highest-intent
  // moment in funnel (visitor just watched engine converge live).
  // Suppressing the sticky CTA there killed the dopamine-spike →
  // conversion handoff. /lab/custom still suppresses (real bottom
  // form). One-line refinement of Round 9.
  if (pathname === "/founders" || pathname === "/lab/custom") return null;
  if (FOUNDERS_REMAINING === 0) return null;

  return (
    <div
      role="region"
      aria-label="Sticky Founders 27 conversion CTA"
      data-print-hide="true"
      className="fixed bottom-0 inset-x-0 z-30 sm:hidden border-t border-gold/40 bg-ink/85 backdrop-blur-md"
      style={{
        // All four insets honored for landscape iPhone notches (USB-C
        // side cutout). Apple HIG requires safe-area on every edge,
        // not just bottom. Round 12 a11y sweep finding.
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <Link
        href="/founders"
        className="flex items-center justify-between gap-3 px-4 py-3 group"
        aria-label={`加入 Founders 27 · ${FOUNDERS_CLAIMED} 已認領 · ${FOUNDERS_REMAINING} 剩 · NT$ 2,700 終身`}
      >
        <div className="flex flex-col min-w-0 flex-1">
          <span
            lang="en"
            className="font-mono text-gold text-[9px] tracking-[0.3em] leading-tight"
          >
            FOUNDERS 27 · NT$ 2,700 終身
          </span>
          <span className="font-mono text-bone text-[11px] tracking-[0.15em] tabular leading-snug mt-0.5">
            <span className="text-gold">{FOUNDERS_CLAIMED}</span>
            <span className="text-mute/60"> / </span>
            <span>{FOUNDERS_TOTAL}</span>
            <span className="text-mute/40 mx-1.5">·</span>
            <span>{FOUNDERS_REMAINING} 席</span>
            <span className="text-mute/40 mx-1.5">·</span>
            <span className="text-mute">永久關閉</span>
          </span>
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 px-3 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] group-active:bg-gold-soft transition-colors"
        >
          加入 →
        </span>
      </Link>
    </div>
  );
}
