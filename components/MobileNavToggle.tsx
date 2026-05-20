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

type NavItem = {
  key: string;
  href: string;
  label: string;
  badge?: string;
};

type Props = {
  items?: NavItem[]; // retained but unused — kept so Nav.tsx signature is unchanged
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
        className="px-3.5 py-1.5 bg-gold text-navy text-[10px] tracking-[0.22em] font-mono font-medium whitespace-nowrap hover:bg-gold-soft transition-colors"
      >
        創始會員 →
      </Link>
    </div>
  );
}
