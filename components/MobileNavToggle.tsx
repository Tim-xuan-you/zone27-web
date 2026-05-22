import MembershipNavCTA from "@/components/MembershipNavCTA";

// ── ZONE 27 · Mobile Nav CTA ───────────────────────────
// Round 32 W-D · 2026-05-22 · 此 component 從靜態「會員 → /membership」
// pill 升 auth-aware · delegates 到 MembershipNavCTA(client island)·
// session probe 後切 /member + label「您的引擎 →」。
//
// 保留此 file 是為了 Nav.tsx import path stability + 將來再用 mobile-only
// 特化 nav 變體時 wrapper 不必新建。 內部純 thin wrapper · 0 logic 重複。
//
// History(pre-Round-32):
// (Component name retained for backwards compatibility · file was
//  previously the hamburger overlay; rewritten 2026-05-20 PM after
//  Tim flagged the overlay as "very cramped, ugly". Round 23 → Round 25
//  href 改 /founders → /membership · Round 32 W-D 升 auth-aware。)
//
// Why minimal-nav pattern still works for ZONE 27:
//   1. Every visitor lands via Tim's hand-shared link → came for specific
//      page · not random navigation
//   2. Content has inline cross-links · contextual nav 保留
//   3. Footer 有 every route · 想 wander find it there
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
  return (
    <div className={className}>
      <MembershipNavCTA
        active={active === "founders"}
        variant="mobile"
      />
    </div>
  );
}
