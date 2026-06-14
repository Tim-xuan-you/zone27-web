// ── ZONE 27 · Related Reading mapping ──────────────────
// Hand-curated hub-and-spoke · 3 hand-picked sibling links per content page.
// NEVER algorithmic ranking · NEVER engagement-based · just three honest
// pointers to where to read next. Footer placement only.
//
// R199 · 配合「砍多餘頁」cull · 移除指向已刪頁(/annual·/now·/changelog·
// /methodology-diff·/hey-tim·/rewards)的 further-reading 卡 · 換成保留的兄弟頁。
// ─────────────────────────────────────────────────────

export type RelatedLink = {
  href: string;
  /** Path-like kicker shown in mono above the title (e.g. "methodology") */
  kicker: string;
  /** Short Chinese description shown as the main link text */
  title: string;
};

const TRACK_RECORD: RelatedLink = {
  href: "/track-record",
  kicker: "track-record",
  title: "公開戰績 · 引擎每場預測 vs 實際",
};
const AUDIT: RelatedLink = {
  href: "/audit",
  kicker: "audit",
  title: "Model Report · 全部假設公開",
};
const CORRECTIONS: RelatedLink = {
  href: "/corrections",
  kicker: "corrections",
  title: "我們搞砸過的事 · 公開認錯、不刪",
};

export const RELATED_LINKS: Record<string, RelatedLink[]> = {
  // R202 · /cpbl-pitchers + /cpbl-teams 微站已砍(手動靜態快照會發霉 · 引擎仍吃資料 ·
  // 只是不再有公開排行頁)· 此處 further-reading 入口連帶移除。
  "/audit": [
    TRACK_RECORD,
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 4 個刻意倒置" },
    { href: "/methodology", kicker: "methodology", title: "完整工程白皮書" },
  ],
  "/methodology": [
    { href: "/methodology/diff", kicker: "methodology/diff", title: "v0.2 → v0.3 逐行 diff · 14 unchanged + 1 new" },
    AUDIT,
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 為何完整公開" },
  ],
  "/methodology/diff": [
    { href: "/methodology", kicker: "methodology", title: "回完整白皮書 · 4 章 + 引擎陣容" },
    { href: "/audit", kicker: "audit", title: "Model Report · 改規則前先公告 30 天" },
    TRACK_RECORD,
  ],
  "/terms": [
    { href: "/ethics", kicker: "ethics", title: "9 條永遠不做的承諾 · 違反 = 紅字永久標" },
    { href: "/privacy", kicker: "privacy", title: "0 追蹤 · 完整不追蹤清單" },
    { href: "/coverage", kicker: "coverage", title: "永遠不涵蓋什麼" },
  ],
  "/coverage": [
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 為何不擴大覆蓋" },
    AUDIT,
    { href: "/methodology", kicker: "methodology", title: "完整工程白皮書" },
  ],
  "/about": [
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 4 個刻意倒置" },
    AUDIT,
    { href: "/methodology", kicker: "methodology", title: "推演引擎白皮書" },
  ],
  "/faq": [
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 為何這樣做" },
    AUDIT,
    { href: "/methodology", kicker: "methodology", title: "完整工程白皮書" },
  ],
  "/manifesto": [
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 倒置 II 的物理證據" },
    { href: "/audit", kicker: "audit", title: "Model Report · 倒置 I 的完整證據" },
    { href: "/founders", kicker: "founders", title: "讀完了 · 成為 GOLD 會員之一" },
  ],
  "/matches/[gameId]": [
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 引擎每場預測 vs 實際" },
    { href: "/lab", kicker: "lab", title: "親手跑一場推演引擎模擬" },
    { href: "/founders", kicker: "founders", title: "加入 GOLD · 最高階年度會員" },
  ],
  "/track-record": [
    { href: "/member", kicker: "member", title: "你的準度 · 押注命中率從第一注算起" },
    { href: "/calibration", kicker: "calibration", title: "引擎自評 · 公開我們準不準" },
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 為何公開戰績這麼重要" },
  ],
  "/ladder": [
    { href: "/matches", kicker: "matches", title: "今日賽事 · 進場鎖預測 · 開始爬天梯" },
    { href: "/calibration", kicker: "calibration", title: "引擎自評 · 你要贏過的對手" },
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 王座那張卡的數字來源" },
  ],
  "/calibration": [
    { href: "/track-record", kicker: "track-record", title: "PROVED vs DIVERGED 賽事帳本" },
    AUDIT,
    { href: "/methodology", kicker: "methodology", title: "準度怎麼算 · 完整公式" },
  ],
  // /annual/2026 已刪 → 換 /audit
  "/membership/black-card/ledger": [
    { href: "/membership/black-card", kicker: "black-card", title: "BLACK 完整介紹 · NT$ 500/31 天" },
    { href: "/founders/ledger", kicker: "founders/ledger", title: "GOLD 公開名額帳本" },
    AUDIT,
  ],
  "/ethics": [
    { href: "/steelman", kicker: "steelman", title: "反對 ZONE 27 最強的 6 個論點" },
    { href: "/audit", kicker: "audit", title: "Model Report · 揭露哲學" },
    { href: "/coverage", kicker: "coverage", title: "永遠不做的事 · 品牌界線" },
  ],
  "/steelman": [
    CORRECTIONS,
    { href: "/ethics", kicker: "ethics", title: "9 條永遠不做的承諾" },
    { href: "/audit", kicker: "audit", title: "Model Report · 揭露哲學" },
  ],
  "/corrections": [
    { href: "/steelman", kicker: "steelman", title: "反對我們最強的 6 個論點 · 假設性的反方" },
    { href: "/integrity", kicker: "integrity", title: "22 件永久不會變的事 · 含 3 條已修訂" },
    AUDIT,
  ],
  // /changelog 已刪 → 換 /track-record
  "/roadmap": [
    TRACK_RECORD,
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 為何公開「永遠不做」" },
    AUDIT,
  ],
  "/learn": [
    { href: "/lab", kicker: "lab", title: "親手跑一場推演引擎模擬" },
    { href: "/calibration", kicker: "calibration", title: "引擎準不準 · 公開校準" },
    { href: "/methodology", kicker: "methodology", title: "完整方法論白皮書 · 進階指標逐一解釋" },
  ],
  // 「誠實讀一個機率」系列(3 篇 · 變異數 → 樣本 → 讀一個機率)· 互相串成迴圈 + 各自接證據頁。
  "/learn/streaks": [
    { href: "/learn/sample-size", kicker: "learn/sample-size", title: "下一篇 · 一個準度要打幾場才算數" },
    { href: "/calibration", kicker: "calibration", title: "校準怎麼量 · 說的把握 vs 實際中的" },
    TRACK_RECORD,
  ],
  "/learn/sample-size": [
    { href: "/learn/reading-a-probability", kicker: "learn/reading-a-probability", title: "下一篇 · 62% 不是「他會贏」的意思" },
    { href: "/calibration", kicker: "calibration", title: "引擎說幾成 · 實際中幾成" },
    TRACK_RECORD,
  ],
  "/learn/reading-a-probability": [
    { href: "/learn/streaks", kicker: "learn/streaks", title: "回系列第一篇 · 連勝為什麼會騙你" },
    { href: "/calibration", kicker: "calibration", title: "引擎說幾成 · 實際中幾成" },
    TRACK_RECORD,
  ],
  "/discipline": [
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 4 個品牌軸線" },
    { href: "/audit", kicker: "audit", title: "Model Report · 紀律的執行證據" },
    { href: "/about", kicker: "about", title: "關於 · 我們是誰" },
  ],
  // /annual/2026 已刪 → 換 /audit
  "/membership": [
    AUDIT,
    { href: "/founders", kicker: "founders", title: "GOLD 詳情頁 · GOLD 會員 · 年度" },
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 訂閱前先看 N 場 PROVED" },
  ],
  "/member": [
    { href: "/calibration", kicker: "calibration", title: "引擎準不準 · 你要贏過的那台機器自評" },
    { href: "/membership", kicker: "membership", title: "會員全景 · 從免費到 NT$ 2,700/年" },
    { href: "/manifesto", kicker: "manifesto", title: "為什麼你的資料屬於你自己" },
  ],
  "/login": [
    { href: "/member", kicker: "member", title: "註冊後 · /member 變你的儀表板" },
    { href: "/membership", kicker: "membership", title: "會員全景 · 為什麼你要註冊" },
    { href: "/privacy", kicker: "privacy", title: "我們 0 追蹤 · email 只用於登入 + 通知" },
  ],
  // /now 已刪 → 換 /track-record
  "/member/submit": [
    { href: "/member", kicker: "member", title: "你的儀表板 · 準度 + 點數錢包" },
    { href: "/membership", kicker: "membership", title: "升級會員 · 賣分析抽成 5-10%" },
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 引擎每場預測 vs 實際" },
  ],
  "/founders/ledger": [
    { href: "/founders", kicker: "founders", title: "GOLD 銷售頁 · GOLD 會員 · 年度" },
    { href: "/audit", kicker: "audit", title: "Model Report · 改規則前先公告 30 天" },
    { href: "/manifesto", kicker: "manifesto", title: "倒置宣言 · 為什麼「方法公開 · 品味私藏」" },
  ],
  "/membership/black-card": [
    { href: "/membership", kicker: "membership", title: "會員全景 · 從免費到 NT$ 2,700/年" },
    { href: "/founders", kicker: "founders", title: "GOLD · 對照第 4 階 NT$ 2,700/年" },
    { href: "/privacy", kicker: "privacy", title: "付款走手動轉帳 · 0 卡號經過我們 · 完整不追蹤清單" },
  ],
  "/integrity": [
    CORRECTIONS,
    { href: "/audit", kicker: "audit", title: "Model Report · 7 章 + 揭露區塊" },
    { href: "/steelman", kicker: "steelman", title: "反對 ZONE 27 最強的 6 個論點" },
  ],
  "/receipts/cpbl-260521-01": [
    { href: "/track-record", kicker: "track-record", title: "全部賽後收據 · PROVED + DIVERGED 等大列出" },
    { href: "/matches/cpbl-260521-01", kicker: "matches", title: "賽事頁 · 完整 7 種即時透視" },
    { href: "/audit", kicker: "audit", title: "Model Report · 為什麼 PROVED/DIVERGED 等大" },
  ],
  // /annual/2026 已刪 → 換 /track-record
  "/founders/apply": [
    { href: "/founders", kicker: "founders", title: "GOLD 介紹 · 6 件買不到的東西 + 權益" },
    { href: "/founders/ledger", kicker: "founders/ledger", title: "公開名額帳本 · 5 步規則 · 通過率" },
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 申請前先看引擎真實命中" },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
