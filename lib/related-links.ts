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
      title: "CPBL 6 球團投手總覽 · 你支持的球隊在這",
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
      title: "9 條永遠不做的承諾 · 違反 = 紅字永久標",
    },
    {
      href: "/privacy",
      kicker: "privacy",
      title: "0 追蹤 · 完整不追蹤清單",
    },
    {
      href: "/coverage",
      kicker: "coverage",
      title: "永遠不涵蓋什麼",
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
      title: "回完整白皮書 · 4 章 + 引擎陣容",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 改規則前先公告 30 天",
    },
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績 · 每一場賽後收據",
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
      title: "公開戰績 · 倒置 II 的物理證據",
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
      title: "讀完了 · 成為最早一批創始會員之一",
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
      title: "加入 FOUNDER · 前 270 拿創始編號",
    },
  ],
  "/track-record": [
    // 訪客看完全站 PROVED rate · 下一步 = 對照自己的命中率(Endowment +
    // Loss Aversion · conversion moment)· R189 收合後個人準度在 /member
    // 儀表板(不再是 /member/calibration · 那頁已 redirect 到 /calibration)。
    {
      href: "/member",
      kicker: "member",
      title: "你的準度 · 押注命中率從第一注算起",
    },
    {
      href: "/calibration",
      kicker: "calibration",
      title: "引擎自評 · 公開我們準不準",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何公開戰績這麼重要",
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
      title: "PROVED vs DIVERGED 賽事帳本",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 全部假設公開",
    },
    {
      href: "/methodology",
      kicker: "methodology",
      title: "準度怎麼算 · 完整公式",
    },
  ],
  "/membership/black-card/ledger": [
    {
      href: "/membership/black-card",
      kicker: "black-card",
      title: "BLACK 完整介紹 · NT$ 500/31 天",
    },
    {
      href: "/founders/ledger",
      kicker: "founders/ledger",
      title: "FOUNDER 公開名額帳本",
    },
    {
      href: "/annual/2026",
      kicker: "annual",
      title: "Year 0 誠實報告 · 0 付費 · NT$ 0 營收",
    },
  ],
  "/ethics": [
    {
      href: "/steelman",
      kicker: "steelman",
      title: "反對 ZONE 27 最強的 6 個論點",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 揭露哲學",
    },
    {
      href: "/coverage",
      kicker: "coverage",
      title: "永遠不做的事 · 品牌界線",
    },
  ],
  "/steelman": [
    {
      href: "/ethics",
      kicker: "ethics",
      title: "9 條永遠不做的承諾",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 揭露哲學",
    },
    {
      href: "/calibration",
      kicker: "calibration",
      title: "引擎自評 · 公開我們準不準",
    },
  ],
  "/roadmap": [
    {
      href: "/changelog",
      kicker: "changelog",
      title: "過去的事實 · 以 git 為準",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為何公開「永遠不做」",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 完整揭露證據",
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
      title: "完整方法論白皮書 · 進階指標逐一解釋",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "看完了 · 加入 FOUNDER",
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
      title: "Year 0 誠實報告 · 0 付費 · NT$ 0 營收",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "FOUNDER 詳情頁 · 最早一批創始會員 · 年度",
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
      title: "過去的事實 · 以 git 為準",
    },
    {
      href: "/roadmap",
      kicker: "roadmap",
      title: "未來的承諾 · 品牌界線",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "倒置宣言 · 為什麼當下的工藝也重要",
    },
  ],
  // /member 的下一步 sibling。 R189:原本指 /member/calibration(個人對照圖)·
  // 那頁收合後個人準度直接在儀表板 · 改指公開的 /calibration「引擎準不準」·
  // 讓會員看到自己要追平/贏過的那台機器的自評。
  "/member": [
    {
      href: "/calibration",
      kicker: "calibration",
      title: "引擎準不準 · 你要贏過的那台機器自評",
    },
    {
      href: "/membership",
      kicker: "membership",
      title: "會員全景 · 從免費到 NT$ 2,700/年",
    },
    {
      href: "/manifesto",
      kicker: "manifesto",
      title: "為什麼你的資料屬於你自己",
    },
  ],
  // Round 30 Wave 5 · /login NEW · Phase 1 magic link auth。 3 sibling:
  // /member(註冊後 session 啟動會去的地方)· /membership(4-tier ladder
  // 全景 · 為什麼要註冊)· /privacy(0-tracking · email 怎麼處理)。
  "/login": [
    {
      href: "/member",
      kicker: "member",
      title: "註冊後 · /member 變你的儀表板",
    },
    {
      href: "/membership",
      kicker: "membership",
      title: "會員全景 · 為什麼你要註冊",
    },
    {
      href: "/privacy",
      kicker: "privacy",
      title: "我們 0 追蹤 · email 只用於登入 + 通知",
    },
  ],
  // Round 30 Wave 10 · /member/submit NEW · OPEN 投稿 · Tim 1/週
  // curate · Stratechery Guest Post pattern。 Siblings: /member(回 dashboard)
  // · /membership Creator Permissions section · /signal-board(過稿落點)。
  "/member/submit": [
    {
      href: "/member",
      kicker: "member",
      title: "你的儀表板 · 準度 + 點數錢包",
    },
    {
      href: "/membership",
      kicker: "membership",
      title: "升級會員 · 賣分析抽成 5-10%",
    },
    {
      href: "/now",
      kicker: "now",
      title: "Tim 親手挑選 · 公開更新節奏",
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
      title: "FOUNDER 銷售頁 · 最早一批創始會員 · 年度",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 改規則前先公告 30 天",
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
      title: "會員全景 · 從免費到 NT$ 2,700/年",
    },
    {
      href: "/founders",
      kicker: "founders",
      title: "FOUNDER · 對照第 4 階 NT$ 2,700/年",
    },
    {
      href: "/privacy",
      kicker: "privacy",
      title: "付款走手動轉帳 · 0 卡號經過我們 · 完整不追蹤清單",
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
      title: "公開名額帳本 · 公布拒絕原因 + 通過率",
    },
    {
      href: "/track-record",
      kicker: "track-record",
      title: "公開戰績帳本 · 年度報告的數字來源",
    },
  ],
  // R170 W1 · /rewards RESTORED · Tim 38th 同 mandate explicit Q4 endorsement removes R166 W1 削 reason
  "/rewards": [
    {
      href: "/matches",
      kicker: "matches",
      title: "今日賽事 · 你下預測的地方",
    },
    {
      href: "/member",
      kicker: "member",
      title: "你的準度 · 你押的命中率細項",
    },
    {
      href: "/audit",
      kicker: "audit",
      title: "Model Report · 改規則前先公告 30 天",
    },
  ],
  // R166 W1 · /rewards DELETED · then R170 W1 RESTORED per Tim explicit endorse
  // R165 W1 · /pricing/why DELETED R164 · swap to /annual/2026(Year 0 empty state ·
  // 同 transparency axis · 申請者可 audit FOUNDER 真實狀態)。
  "/founders/apply": [
    {
      href: "/founders",
      kicker: "founders",
      title: "FOUNDER 介紹 · 6 件買不到的東西 + 權益",
    },
    {
      href: "/founders/ledger",
      kicker: "founders/ledger",
      title: "公開名額帳本 · 5 步規則 · 通過率",
    },
    {
      href: "/annual/2026",
      kicker: "annual/2026",
      title: "Year 0 誠實報告 · 0 付費 · 申請前可查真實狀態",
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
      title: "Model Report · 7 章 + 揭露區塊",
    },
    {
      href: "/ethics",
      kicker: "ethics",
      title: "9 條倫理承諾 · 正式出處",
    },
    {
      href: "/steelman",
      kicker: "steelman",
      title: "反對 ZONE 27 最強的 6 個論點",
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
      title: "全部賽後收據 · PROVED + DIVERGED 等大列出",
    },
    {
      href: "/matches/cpbl-260521-01",
      kicker: "matches",
      title: "賽事頁 · 完整 7 種即時透視",
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
      title: "Tim 親筆 · 七章節品牌方法論",
    },
    {
      href: "/faq",
      kicker: "faq",
      title: "14 個常見問題 · 先想好的誠實回答",
    },
    {
      href: "/integrity",
      kicker: "integrity",
      title: "22 條永遠不變的規則 · 第 9 條:強制公開戰績",
    },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
