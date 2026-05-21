import Link from "next/link";

// ── ZONE 27 · Mobile Nav CTA ───────────────────────────
// (Component name retained for backwards compatibility · file was
//  previously the hamburger overlay; rewritten 2026-05-20 PM after
//  Tim flagged the overlay as "very cramped, ugly".)
//
// Mobile minimal-nav pattern · Linear / Stripe / Apple marketing:
//   - Top header: ZONE 27 wordmark + 創始會員 CTA · nothing else
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
        href="/founders"
        aria-current={isFoundersActive ? "page" : undefined}
        aria-label="加入會員 · FREE TIER 免費訂閱 + BLACK CARD + Founders 27 三層 ladder"
        /* Round 9: py-1.5 → py-3 ensures ≥44px tap target per
           Apple HIG / WCAG 2.5.5. Pill height was ~28-32px before.
           Round 23(Tim 問「一般人加入會員從哪裡按」)· "創始會員 →"
           label → "會員 →" · 一般訪客 wayfinding 修(per Nav.tsx
           comment)· FREE TIER 等所有 tier 在 /founders 都有。Pill
           gold-filled 維持 brand IP visual hierarchy(mobile 主 CTA)。 */
        className="px-3.5 py-3 bg-gold text-navy text-[10px] tracking-[0.22em] font-mono font-medium whitespace-nowrap hover:bg-gold-soft transition-colors"
      >
        會員 →
      </Link>
    </div>
  );
}
