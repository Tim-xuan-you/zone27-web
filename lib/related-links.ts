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
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 · 引擎預測 vs 實際",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 4 個刻意倒置",
    },
    {
      href: "/methodology",
      kicker: "methodology",
      title: "完整工程白皮書",
    },
  ],
  "/methodology": [
    {
      href: "/audit",
      kicker: "audit",
      title: "精簡版 Model Report",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何完整公開",
    },
    {
      href: "/glossary",
      kicker: "glossary",
      title: "27 種進階數據",
    },
  ],
  "/coverage": [
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何不擴大覆蓋",
    },
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
  ],
  "/about": [
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 4 個刻意倒置",
    },
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
  ],
  "/faq": [
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何這樣做",
    },
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
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 4 個刻意倒置",
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
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何這樣做",
    },
  ],
  "/manifesto": [
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 · 倒置 II receipts 的物理證據",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 倒置 I 的完整證據",
    },
    {
      href: "/discipline",
      kicker: "discipline",
      title: "鐵律 · Buffett+Musk+Costco 共識",
    },
  ],
  "/track-record": [
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何公開戰績是品牌 IP",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 全部假設公開",
    },
    {
      href: "/discipline",
      kicker: "discipline",
      title: "鐵律 · Buffett「track record visible」",
    },
  ],
  "/roadmap": [
    {
      href: "/changelog",
      kicker: "changelog",
      title: "過去的事實 · git source of truth",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何公開「永遠不做」",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · DISCLOSURE 完整證據",
    },
  ],
  "/learn": [
    {
      href: "/lab",
      kicker: "lab",
      title: "親手跑一場 Monte Carlo 模擬",
    },
    {
      href: "/glossary",
      kicker: "glossary",
      title: "27 種進階數據完整詞彙",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "看完了 · 加入 270 名創始會員",
    },
  ],
  "/discipline": [
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 4 個品牌軸線",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 紀律的執行證據",
    },
    {
      href: "/about",
      kicker: "about",
      title: "品牌方法論 · 6 章節",
    },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
