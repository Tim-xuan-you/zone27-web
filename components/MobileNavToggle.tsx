import Link from "next/link";

// ── ZONE 27 · Mobile Nav CTA ───────────────────────────
// (Component name retained for backwards compatibility · file was
//  previously the hamburger overlay; rewritten 2026-05-20 PM after
//  Tim flagged the overlay as "very cramped, ugly".)
//
// Mobile minimal-nav pattern · Linear / Stripe / Apple marketing:
//   - Top header: ZONE 27 wordmark + 會員 CTA · nothing else
//   - All secondary nav lives in Footer + inline content links +
//     Related Reading hub-and-spoke on trust-artifact pages
//   - ScarcityStrip continues to render directly under Nav
//
// Why this works for ZONE 27 (stealth + premium brand):
//   1. Every visitor lands via Tim's hand-shared link → they came
//      for a specific page, not random navigation
//   2. Content has inline cross-links (/audit + /methodology +
//      /coverage on most pages) so contextual nav is preserved
//   3. Footer has every route — visitors who want to wander find
//      it there
//   4. Top stays minimum-cognitive-load · maximum reading focus
// ─────────────────────────────────────────────────────

type Props = {
  active?: string;
  className?: string;
};

export default function MobileNavToggle({
  active,
  className = "",
}: Props) {
  const isFoundersActive = active === "founders";
  return (
    <div className={className}>
      <Link
        href="/membership"
        aria-current={isFoundersActive ? "page" : undefined}
        aria-label="加入會員 · FREE TIER 免費訂閱 + BLACK CARD + Founders 27 三層 ladder"
        /* Round 9: py-1.5 → py-3 ensures ≥44px tap target per
           Apple HIG / WCAG 2.5.5. Pill height was ~28-32px before.
           Round 23 → Round 25(Tim 揭示 wayfinding 根本問題):
           href 改 /founders → /membership · /founders 視覺上仍是
           Founders 27 sales page · /membership 才是 4-tier ladder
           平等視覺權重的入口頁。Mobile sticky bottom CTA 仍指
           /founders(paid-focused conversion)· Nav pill = inclusive
           入口 · 兩條路徑各服務不同 stage。 */
        className="px-3.5 py-3 bg-gold text-navy text-[10px] tracking-[0.22em] font-mono font-medium whitespace-nowrap hover:bg-gold-soft transition-colors"
      >
        會員 →
      </Link>
    </div>
  );
}
