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
  // R101 W1 · NEW /cpbl-pitchers family entry · used by /cpbl-pitchers
  // leaderboard + /cpbl-pitchers/[acnt] player profile + /cpbl-teams/[teamId]
  // team page · all 3 pass currentPath="/cpbl-pitchers" to RelatedReading.
  "/cpbl-pitchers": [
    {
      href: "/cpbl-teams",
      kicker: "cpbl-teams",
      title: "CPBL 6 球團 投手 aggregation · 球迷 tribal home base",
    },
    {
      href: "/matches",
      kicker: "matches",
      title: "今日 CPBL 賽事 + 引擎模擬 · 看誰先發",
    },
    {
      href: "/methodology",
      kicker: "methodology",
      title: "這些指標怎麼餵進引擎 · 蒙地卡羅 程式碼公開",
    },
  ],
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
  // Round 52 W-A · Agent 3 #7 fix · /terms ORPHAN · 之前 RelatedReading
  // 完全沒 entry · 每個 trust artifact 都有 3-link spokes 但 /terms 沒。
  // Siblings:/ethics(9 binding NOT-DO · 法律 + ethics 軸線通 · R80 加 #09)· /privacy
  // (0 tracking · TOS + Privacy 標準成對)· /coverage(NEVER list · TOS
  // scope statement 同邏輯)。
  "/terms": [
    {
      href: "/ethics",
      kicker: "ethics",
      title: "9 binding NOT-DO commitments · 違反 = 紅字永久標",
    },
    {
      href: "/privacy",
      kicker: "privacy",
      title: "0 tracking · 完整 anti-tracker inventory",
    },
    {
      href: "/coverage",
      kicker: "coverage",
      title: "NEVER list · 永遠不涵蓋什麼",
    },
  ],
  // R164 DELETE /transparency · collapsed into /audit canonical hub per Apple discipline
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
  // R168 W1 · /glossary DELETED · Z27 LEXICON ported to /audit §08 · 27 industry stats removed per Tim canary 3「使用者不是工程師」
  // R167 W1b · /signal-board DELETED · daily promise we don't keep per Agent P TIER B #7 + Tim canary 3「每個網頁滑不到底 · 大部分不必要」
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
      title: "加入 270 個創始席位",
    },
  ],
  "/track-record": [
    // Round 52 W-A · Agent 3 #10 fix · /track-record(global aggregate)→
    // /member/calibration(personal mirror)cross-link · Endowment Effect +
    // Loss Aversion psychology · 訪客看 global PROVED rate 後可對照 personal
    // accuracy · conversion moment · 之前 /calibration 已 link · 但
    // /member/calibration personal-mode 沒 cross-link from /track-record。
    {
      href: "/member/calibration",
      kicker: "member/calibration",
      title: "您的 personal mirror · 與 global aggregate 對照",
    },
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
  ],
  "/ladder": [
    {
      href: "/matches",
      kicker: "matches",
      title: "今日賽事 · 進場鎖預測 · 開始爬天梯",
    },
    {
      href: "/calibration",
      kicker: "calibration",
      title: "引擎自評 · 你要贏過的對手",
    },
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 · 王座那張卡的數字來源",
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
      title: "BLACK CARD 完整介紹 · NT$ 500/31 天",
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
      title: "6 strongest objections against ZONE 27",
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
      title: "9 binding NOT-DO commitments",
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
      href: "/methodology",
      kicker: "methodology",
      title: "完整方法論白皮書 · sabermetric 指標 inline",
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
  // /pricing/why(R64 W-B NEW · 自然下一步:pricing rationale 一頁說清楚 ·
  // 「為什麼這個 tier 是這個價」 訪客 next question)· /founders(Founders
  // 27 deep dive)· /track-record(物理 proof points)。
  // Round 65 W-A · swapped /manifesto for /pricing/why(R64 W-B NEW page 更
  // direct sibling · 同 buy decision context)。
  // R165 W1 · /pricing/why DELETED R164 · swap to /annual/2026(Year 0 honest empty
  // state report · 同 buy decision context · Defector radical-transparency parallel)。
  "/membership": [
    {
      href: "/annual/2026",
      kicker: "annual/2026",
      title: "Year 0 honest report · 0 paid · NT$ 0 rev · empty state pattern",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "Founders 27 詳情頁 · 限量 270 · 年度",
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
      title: "4-tier ladder 全景 · 從匿名到 NT$ 2,700/年",
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
      title: "我們 0 tracking · email 只用於 login + 通知",
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
      href: "/now",
      kicker: "now",
      title: "Tim 親手 curate journal · ship cadence transparent",
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
      title: "Founders 27 銷售頁 · 限量 270 · 創始席位",
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
  // payment infra 就緒後上線(milestone-triggered)。 Siblings: /membership(parent · 4-tier ladder ←)·
  // /founders(可對照 4-tier 第 4 階終身席位)· /privacy(0 信用卡資訊在
  // ZONE 27 server · token via payment gateway)。
  "/membership/black-card": [
    {
      href: "/membership",
      kicker: "membership",
      title: "4-tier ladder 全景 · 從匿名到 NT$ 2,700/年",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "Founders 27 · 對照第 4 階 NT$ 2,700/年",
    },
    {
      href: "/privacy",
      kicker: "privacy",
      title: "0 信用卡資訊 in ZONE 27 server · 完整 anti-tracker inventory",
    },
  ],
  // R164 DELETE /pricing/why · collapsed into /founders + /membership/black-card per Apple discipline
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
  // R170 W1 · /rewards RESTORED · Tim 38th 同 mandate explicit Q4 endorsement removes R166 W1 削 reason
  "/rewards": [
    {
      href: "/matches",
      kicker: "matches",
      title: "今日賽事 · 您 prediction 源頭 · UserPredictionPicker 在這",
    },
    {
      href: "/member/calibration",
      kicker: "member/calibration",
      title: "您 personal calibration mirror · PROVED rate breakdown",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · S05 PRE-COMMIT 同 rules-binding pattern",
    },
  ],
  // R166 W1 · /rewards DELETED · then R170 W1 RESTORED per Tim explicit endorse
  // R165 W1 · /pricing/why DELETED R164 · swap to /annual/2026(Year 0 empty state ·
  // 同 transparency axis · 申請者可 audit Founders 27 真實狀態)。
  "/founders/apply": [
    {
      href: "/founders",
      kicker: "founders",
      title: "Founders 27 銷售頁 · 6 件什麼不買到 + benefits",
    },
    {
      href: "/founders/ledger",
      kicker: "founders/ledger",
      title: "Public allocation ledger · 5-step rules · 通過率",
    },
    {
      href: "/annual/2026",
      kicker: "annual/2026",
      title: "Year 0 honest report · 0 paid · 申請前可 audit 真實狀態",
    },
  ],
  // R164 DELETE /founders/first-five-minutes · onboarding collapsed into /founders + /audit
  // R164 DELETE /founders/from-one-current-founder · empty scaffold collapsed into /founders/apply
  // R164 DELETE /founders/inheritance · Patek Generations protocol collapsed into /founders body
  // R164 DELETE /founders/why-270 · 270 cap justification collapsed into /founders hero
  // R164 DELETE /engine-log · Stripe Status pattern collapsed into /audit
  // R164 DELETE /year-zero · Year 0 commitments collapsed into /audit + /annual/2026
  // R164 DELETE /heritage · DELTA-of-CPBL collapsed into /about
  // R165 W1 · /transparency DELETED R164 · swap to /steelman(6 strongest objections ·
  // same self-exposure axis · same Pratfall + Costly Signaling fire)。
  "/integrity": [
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 7 sections + DISCLOSURE block",
    },
    {
      href: "/ethics",
      kicker: "ethics",
      title: "9 binding ethics commitments · canonical source",
    },
    {
      href: "/steelman",
      kicker: "steelman",
      title: "6 strongest objections · self-exposure pattern",
    },
  ],
  // R80 W-A · NEW /receipts/[receiptId] dynamic route group · per-receipt
  // permalink object · Patek Reference Number permanence pattern · Siblings:
  // /track-record(parent ledger)· /matches/[gameId](match page)·
  // /audit(model report)· /methodology(white paper)。 Note · keyed by
  // sample cpbl-260521-01 entry · other receipts inherit empty(allowed)。
  "/receipts/cpbl-260521-01": [
    {
      href: "/track-record",
      kicker: "track-record",
      title: "全部 receipts ledger · PROVED + DIVERGED 等大列出",
    },
    {
      href: "/matches/cpbl-260521-01",
      kicker: "matches",
      title: "Match page · 完整 7 LIVE LENS CANVAS",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 為什麼 PROVED/DIVERGED 等大",
    },
  ],
  // R164 DELETE /founders/seat-card/[seatNumber] · 270 SSG cards gimmick
  // R165 W1 · /letter DELETED R164 · swap to /about(7-chapter brand methodology ·
  // same Tim singular voice axis · same long-form essay grammar)。
  "/hey-tim": [
    {
      href: "/about",
      kicker: "about",
      title: "Tim singular voice · 7-chapter brand methodology",
    },
    {
      href: "/faq",
      kicker: "faq",
      title: "14 pre-anticipated Qs · monologue · already-known answers",
    },
    {
      href: "/integrity",
      kicker: "integrity",
      title: "22 binding rules · rule #9 mandatory-ledger discipline binding",
    },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
