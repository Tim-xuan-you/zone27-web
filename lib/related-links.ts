// ── ZONE 27 · Related Reading mapping ──────────────────
// Hand-curated hub-and-spoke · 3 hand-picked sibling links per content page.
// NEVER algorithmic ranking · NEVER engagement-based · just three honest
// pointers to where to read next. Footer placement only.
//
// R199 · 配合「砍多餘頁」cull · 移除指向已刪頁的 further-reading 卡。
// R255 · 大刀闊斧:砍掉所有「解釋理念」的頁(宣言/鐵律/路線圖/反方/誠信/方法 diff/
//   科普三篇/黑卡帳本)· 出口卡一律指向「會給看」的證據頁(戰績/校準/認錯/audit)。
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
const HOW_WE_GRADE: RelatedLink = {
  href: "/how-we-grade",
  kicker: "how-we-grade",
  title: "怎麼算中 / 沒中 · 規則先綁死",
};
const PRIVACY_OWN: RelatedLink = {
  href: "/privacy",
  kicker: "privacy",
  title: "你的資料屬於你 · 0 追蹤、不販售",
};
// 深度頁尾「延伸閱讀」的出口卡:讀夠了就回去玩一場,而不是再扇出第 3 篇文章。
const PLAY_CALIBRATION: RelatedLink = {
  href: "/calibration",
  kicker: "calibration",
  title: "讀夠了 · 回去玩一場 · 測你自己有多準",
};

export const RELATED_LINKS: Record<string, RelatedLink[]> = {
  "/audit": [
    TRACK_RECORD,
    { href: "/methodology", kicker: "methodology", title: "完整工程白皮書" },
    PLAY_CALIBRATION,
  ],
  "/methodology": [TRACK_RECORD, AUDIT, PLAY_CALIBRATION],
  "/terms": [
    { href: "/ethics", kicker: "ethics", title: "永遠不做的承諾 · 違反 = 紅字永久標" },
    PRIVACY_OWN,
    { href: "/coverage", kicker: "coverage", title: "目前覆蓋什麼 · 怎麼擴" },
  ],
  "/coverage": [TRACK_RECORD, AUDIT, PLAY_CALIBRATION],
  "/about": [
    TRACK_RECORD,
    { href: "/methodology", kicker: "methodology", title: "推演引擎白皮書" },
    PLAY_CALIBRATION,
  ],
  "/faq": [TRACK_RECORD, AUDIT, PLAY_CALIBRATION],
  "/matches/[gameId]": [
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 引擎每場預測 vs 實際" },
    { href: "/lab", kicker: "lab", title: "親手跑一場推演引擎模擬" },
    { href: "/membership", kicker: "membership", title: "會員制 · BLACK 黑卡 · NT$ 500/31 天" },
  ],
  "/track-record": [
    { href: "/member", kicker: "member", title: "你的準度 · 押注命中率從第一注算起" },
    { href: "/calibration", kicker: "calibration", title: "引擎自評 · 公開我們準不準" },
    HOW_WE_GRADE,
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
  "/ethics": [CORRECTIONS, AUDIT, { href: "/coverage", kicker: "coverage", title: "目前覆蓋什麼 · 怎麼擴" }],
  "/corrections": [TRACK_RECORD, HOW_WE_GRADE, AUDIT],
  "/learn": [
    { href: "/lab", kicker: "lab", title: "親手跑一場推演引擎模擬" },
    { href: "/calibration", kicker: "calibration", title: "引擎準不準 · 公開校準" },
    { href: "/methodology", kicker: "methodology", title: "完整方法論白皮書 · 進階指標逐一解釋" },
  ],
  "/membership": [
    AUDIT,
    { href: "/membership/black-card", kicker: "black-card", title: "BLACK 黑卡 · NT$ 500/31 天" },
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 訂閱前先看 N 場 PROVED" },
  ],
  "/member": [
    { href: "/calibration", kicker: "calibration", title: "引擎準不準 · 你要贏過的那台機器自評" },
    { href: "/membership", kicker: "membership", title: "會員全景 · 免費到 BLACK NT$ 500" },
    PRIVACY_OWN,
  ],
  "/login": [
    { href: "/member", kicker: "member", title: "註冊後 · /member 變你的儀表板" },
    { href: "/membership", kicker: "membership", title: "會員全景 · 為什麼你要註冊" },
    { href: "/privacy", kicker: "privacy", title: "我們 0 追蹤 · email 只用於登入 + 通知" },
  ],
  "/member/submit": [
    { href: "/member", kicker: "member", title: "你的儀表板 · 準度 + 點數錢包" },
    { href: "/membership", kicker: "membership", title: "撐著它的人 · 支持者金環 + 會員房間" },
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 引擎每場預測 vs 實際" },
  ],
  "/membership/black-card": [
    { href: "/membership", kicker: "membership", title: "會員全景 · 免費到 BLACK NT$ 500" },
    { href: "/track-record", kicker: "track-record", title: "公開戰績 · 訂閱前先看 N 場 PROVED" },
    { href: "/privacy", kicker: "privacy", title: "付款走手動轉帳 · 0 卡號經過我們" },
  ],
  "/receipts/cpbl-260521-01": [
    { href: "/track-record", kicker: "track-record", title: "全部賽後收據 · PROVED + DIVERGED 等大列出" },
    { href: "/matches/cpbl-260521-01", kicker: "matches", title: "賽事頁 · 完整 7 種即時透視" },
    { href: "/audit", kicker: "audit", title: "Model Report · 為什麼 PROVED/DIVERGED 等大" },
  ],
};

export function getRelatedLinks(currentPath: string): RelatedLink[] {
  return RELATED_LINKS[currentPath] ?? [];
}
