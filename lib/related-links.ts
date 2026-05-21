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
      // Round 11 agent finding: visitors who read full manifesto are
      // warmest possible · /founders bridge was missing from this 3-link
      // slot. Swapped /discipline (still in Footer + Cmd-K) for the
      // conversion-warmth link.
      href: "/founders",
      kicker: "founders",
      title: "讀完了 · 加入 270 個席位之一",
    },
  ],
  "/matches/[gameId]": [
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 · 引擎每場預測 vs 實際",
    },
    {
      href: "/lab",
      kicker: "lab",
      title: "親手跑一場 Monte Carlo",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "加入 270 個終身席位",
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
  // Round 26 · /membership 新 route(Round 25 ship)需要 RelatedReading
  // entries · 否則 page 內 component 顯示空 array。3 個 sibling 選:
  // /founders(自然下一步:Founders 27 deep dive)· /manifesto(為什麼
  // 4-tier 結構 · 倒置 II MONETIZATION)· /track-record(物理 proof
  // points 給 FREE TIER 訂閱者「為什麼相信這個 ladder」)。
  "/membership": [
    {
      href: "/founders",
      kicker: "founders",
      title: "Founders 27 詳情頁 · 限量 270 · 終身",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為什麼工具免費 · 身分付費",
    },
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 · 訂閱前先看 N 場 PROVED",
    },
  ],
  // Round 28 Wave 4 · /now NEW · 3 sibling: /changelog(過去事實 · git
  // SOURCE)· /roadmap(未來承諾 · BRAND BOUNDARIES)· /manifesto(現在
  // 的工藝為什麼是 brand IP · 倒置 SaaS scheduled marketing)。
  "/now": [
    {
      href: "/changelog",
      kicker: "changelog",
      title: "過去的事實 · git source of truth",
    },
    {
      href: "/roadmap",
      kicker: "roadmap",
      title: "未來的承諾 · BRAND BOUNDARIES",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為什麼當下的工藝也是 brand IP",
    },
  ],
  // Round 29 Wave 2 · /member NEW · 3 sibling
  // Round 30 Wave 2B updated · 把 /now sibling 換 /member/calibration ·
  // /member 的下一步是 epistemic mirror · 不是工程現狀(/now 仍在 Footer
  // + Cmd-K 主動 reach)。
  "/member": [
    {
      href: "/member/calibration",
      kicker: "calibration",
      title: "您的 epistemic mirror · sabermetric 45° reliability diagram",
    },
    {
      href: "/membership",
      kicker: "membership",
      title: "4-tier ladder 全景 · 從匿名到 NT$ 2,700 終身",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "為什麼 data ownership 是 brand IP 不是 feature",
    },
  ],
  // Round 30 Wave 2B · /member/calibration NEW · 3 sibling: /track-record
  // (data source · 同一份 finalized matches drive both)· /methodology
  // (calibration math 完整白皮書)· /member(回 4-bias dashboard preview)。
  "/member/calibration": [
    {
      href: "/track-record",
      kicker: "track-record",
      title: "完整 receipt ledger · diagram data source",
    },
    {
      href: "/methodology",
      kicker: "methodology",
      title: "完整 calibration math 白皮書",
    },
    {
      href: "/member",
      kicker: "member",
      title: "回 4-bias 會員儀表板 preview",
    },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
