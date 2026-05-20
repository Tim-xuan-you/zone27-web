// ── ZONE 27 · Related Reading mapping ──────────────────
// Hard-coded hub-and-spoke for the 6 content-rich pages.
// 3 hand-picked sibling links per page.
//
// Research basis: Wikipedia featured-articles study (~1 link per
// 16 words inline) + 2026 SaaS docs convention (Stripe / Vercel)
// — curated "next step" links, NEVER algorithmic ranking,
// NEVER engagement-based recommendation.
//
// No sidebar TOC · no "you might also like" widget · no analytics.
// Just three honest pointers to where to read next.
// ─────────────────────────────────────────────────────

export type RelatedLink = {
  href: string;
  /** Path-like kicker shown in mono above the title (e.g. "methodology") */
  kicker: string;
  /** Short Chinese description shown as the main link text */
  title: string;
};

export const RELATED_LINKS: Record<string, RelatedLink[]> = {
  "/audit": [
    {
      href: "/methodology",
      kicker: "methodology",
      title: "完整工程白皮書",
    },
    {
      href: "/faq",
      kicker: "faq",
      title: "14 題誠實掃雷",
    },
    {
      href: "/glossary",
      kicker: "glossary",
      title: "27 種進階數據",
    },
  ],
  "/methodology": [
    {
      href: "/audit",
      kicker: "audit",
      title: "精簡版 Model Report",
    },
    {
      href: "/glossary",
      kicker: "glossary",
      title: "27 種進階數據",
    },
    {
      href: "/signal-board",
      kicker: "signal-board",
      title: "今日量化早報",
    },
  ],
  "/about": [
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 全部假設公開",
    },
    {
      href: "/methodology",
      kicker: "methodology",
      title: "蒙地卡羅引擎白皮書",
    },
    {
      href: "/faq",
      kicker: "faq",
      title: "14 題誠實掃雷",
    },
  ],
  "/faq": [
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 全部假設公開",
    },
    {
      href: "/methodology",
      kicker: "methodology",
      title: "完整工程白皮書",
    },
    {
      href: "/about",
      kicker: "about",
      title: "六章節品牌方法論",
    },
  ],
  "/glossary": [
    {
      href: "/methodology",
      kicker: "methodology",
      title: "進階數據如何進引擎",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 哪些 stat 我們不用",
    },
    {
      href: "/faq",
      kicker: "faq",
      title: "14 題誠實掃雷",
    },
  ],
  "/signal-board": [
    {
      href: "/methodology",
      kicker: "methodology",
      title: "信號如何建構",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 已知失效模式",
    },
    {
      href: "/faq",
      kicker: "faq",
      title: "14 題誠實掃雷",
    },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
