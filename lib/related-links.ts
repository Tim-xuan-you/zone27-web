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
      href: "/methodology/diff",
      kicker: "methodology/diff",
      title: "v0.2 → v0.3 逐行 diff · 14 unchanged + 1 new",
    },
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
  ],
  // Round 51 W-D · /transparency NEW · audit aggregator · Anthropic pattern。
  // Siblings: /audit(parent trust artifact · model report)· /ethics(8
  // binding commitments · 同 transparency 軸線)· /steelman(5 strongest
  // objections · 同 self-exposure pattern)。
  "/transparency": [
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 5 sections + DISCLOSURE PHILOSOPHY",
    },
    {
      href: "/ethics",
      kicker: "ethics",
      title: "8 binding commitments · 違反 = 紅字標",
    },
    {
      href: "/steelman",
      kicker: "steelman",
      title: "5 strongest objections · self-exposure pattern",
    },
  ],
  // Round 50 W-A · /methodology/diff NEW · v0.2 → v0.3 entire delta ·
  // brand IP triple-fire(Disclosure + Pratfall + Costly Signaling)。
  // Siblings: /methodology(parent · 完整白皮書)· /audit(S05 PRE-COMMIT
  // 同 rules-binding pattern)· /track-record(per-engine calibration
  // receipts 在那 ingest)。
  "/methodology/diff": [
    {
      href: "/methodology",
      kicker: "methodology",
      title: "回完整白皮書 · 4 sections + ENGINE LINEUP",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · S05 PRE-COMMIT 同 rules-binding pattern",
    },
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 · per-engine calibration receipts ingest 處",
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
      href: "/calibration",
      kicker: "calibration",
      title: "Checking Our Work · Brier score 引擎自評",
    },
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
  ],
  "/calibration": [
    {
      href: "/track-record",
      kicker: "track-record",
      title: "PROVED vs DIVERGED 賽事 ledger",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 全部假設公開",
    },
    {
      href: "/methodology",
      kicker: "methodology",
      title: "Brier score + reliability math 完整",
    },
  ],
  "/membership/black-card/ledger": [
    {
      href: "/membership/black-card",
      kicker: "black-card",
      title: "BLACK CARD 完整介紹 · NT$ 299/月",
    },
    {
      href: "/founders/ledger",
      kicker: "founders/ledger",
      title: "Founders 27 公開 allocation ledger",
    },
    {
      href: "/annual/2026",
      kicker: "annual",
      title: "Year 0 honest report · 0 paid · NT$ 0 rev",
    },
  ],
  "/ethics": [
    {
      href: "/steelman",
      kicker: "steelman",
      title: "5 strongest objections against ZONE 27",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report S05 · Disclosure Philosophy",
    },
    {
      href: "/coverage",
      kicker: "coverage",
      title: "00 BRAND BOUNDARY · NEVER list",
    },
  ],
  "/steelman": [
    {
      href: "/ethics",
      kicker: "ethics",
      title: "8 binding NOT-DO commitments",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report S05 · Disclosure Philosophy",
    },
    {
      href: "/calibration",
      kicker: "calibration",
      title: "Brier score 引擎自評 · FiveThirtyEight pattern",
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
  // Round 30 Wave 5 · /login NEW · Phase 1 magic link auth。 3 sibling:
  // /member(註冊後 session 啟動會去的地方)· /membership(4-tier ladder
  // 全景 · 為什麼要註冊)· /privacy(0-tracking · email 怎麼處理)。
  "/login": [
    {
      href: "/member",
      kicker: "member",
      title: "註冊後 session 啟動 · /member 變您 dashboard",
    },
    {
      href: "/membership",
      kicker: "membership",
      title: "4-tier ladder 全景 · 為什麼您要註冊",
    },
    {
      href: "/privacy",
      kicker: "privacy",
      title: "我們 0 tracking · email 只用於 magic link + 通知",
    },
  ],
  // Round 30 Wave 10 · /member/submit NEW · FREE TIER 投稿 · Tim 1/週
  // curate · Stratechery Guest Post pattern。 Siblings: /member(回 dashboard)
  // · /membership Creator Permissions section · /signal-board(過稿落點)。
  "/member/submit": [
    {
      href: "/member",
      kicker: "member",
      title: "回 dashboard · 看 follow / note / calibration",
    },
    {
      href: "/membership#creator-permissions",
      kicker: "membership",
      title: "Creator Permissions FAQ · 不同 tier 發文權限",
    },
    {
      href: "/signal-board",
      kicker: "signal-board",
      title: "過稿落點 · Tim 親手 publish 到此",
    },
  ],
  // Round 31 Wave S · /founders/ledger NEW · Open Allocation Ledger ·
  // 4 brand IP axiom 同時 fire(Pratfall + Costly Signaling + Disclosure
  // + 倒置 SaaS)。 Siblings: /founders(parent · 銷售頁 ←)· /audit(S05
  // PRE-COMMIT cross-link · 同 PRE-COMMIT pattern)· /manifesto(為什麼
  // 「方法公開 · 品味私藏」 延伸到 allocation 本身)。
  "/founders/ledger": [
    {
      href: "/founders",
      kicker: "founders",
      title: "Founders 27 銷售頁 · 限量 270 · 終身席位",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · S05 PRE-COMMIT 同 disclosure pattern",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為什麼「方法公開 · 品味私藏」",
    },
  ],
  // Round 31 Wave X3 · /membership/black-card NEW · UI mockup preview ·
  // 2026 Q3 上線。 Siblings: /membership(parent · 4-tier ladder ←)·
  // /founders(可對照 4-tier 第 4 階終身席位)· /privacy(0 信用卡資訊在
  // ZONE 27 server · token via payment gateway)。
  "/membership/black-card": [
    {
      href: "/membership",
      kicker: "membership",
      title: "4-tier ladder 全景 · 從匿名到 NT$ 2,700 終身",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "Founders 27 · 對照第 4 階終身 NT$ 2,700",
    },
    {
      href: "/privacy",
      kicker: "privacy",
      title: "0 信用卡資訊 in ZONE 27 server · 完整 anti-tracker inventory",
    },
  ],
  // Round 33 W-E · /annual/2026 NEW · Year 0 honest empty state report ·
  // Defector + Hell Gate + Aftermath radical-transparency pattern · agent A
  // F2 #2 priority。 Siblings:/audit(model report parallel)· /founders/ledger
  // (allocation report parallel · 同 radical-transparency)· /track-record
  // (engine PROVED/DIVERGED ledger feeding annual report metrics)。
  "/annual/2026": [
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 引擎範圍 + 揭露哲學",
    },
    {
      href: "/founders/ledger",
      kicker: "founders/ledger",
      title: "Open Allocation Ledger · 公布拒絕原因 + 通過率",
    },
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 ledger · 此 annual report 的 metric 源頭",
    },
  ],
  // Round 35 W-A · /rewards NEW · PROVED 預測兌換實體獎品 · ZONE 27 ↔
  // 恆美攝影 ecosystem cross-promotion · Tim 11+ canary「集點兌換」 push
  // axiom revisit · brand-pure skill-based fantasy league prize 結構。
  // Siblings:/matches(預測來源)· /member(您 calibration mirror + total
  // prediction stats)· /audit(S05 PRE-COMMIT rules-binding pattern 同邏輯)。
  "/rewards": [
    {
      href: "/matches",
      kicker: "matches",
      title: "今日賽事 · 您 prediction 源頭 · UserPredictionPicker 在這",
    },
    {
      href: "/member",
      kicker: "member",
      title: "您 calibration mirror + 完整 prediction stats breakdown",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · S05 PRE-COMMIT 同 rules-binding pattern",
    },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
