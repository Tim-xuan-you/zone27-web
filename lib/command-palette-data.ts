// ── ZONE 27 · Command Palette Index ─────────────────────
// PRIMARY routes only · ~26 entries · power-user search · Hick's Law-aware
// editorial priority。 Secondary routes accessed via /transparency aggregator
// + Footer + parent-page cross-links(e.g. /founders/* sub-pages 從 /founders
// 探索 · /letter + /year-zero + /heritage + /hey-tim + /engine-log + /annual
// 從 /transparency aggregator · /methodology/diff 從 /methodology · /receipts/*
// 從 /track-record · /member/calibration + /member/submit 從 /member)。
// (/admin + /poster + /auth/* intentionally NOT indexed · 同 framing。)

export type CommandItem = {
  label: string;
  /** Short English / mono kicker shown above label · disambiguates */
  kicker: string;
  /** Route path (internal) or full URL (external · opens new tab) */
  path: string;
  /** Group label · controls section ordering in palette */
  group:
    | "入門"
    | "賽事 · 引擎"
    | "品牌 IP"
    | "信任文件"
    | "轉換"
    | "工具 · 外部";
  /** Searchable aliases · Chinese + English + abbrev */
  keywords?: string[];
  external?: boolean;
};

export const COMMAND_ITEMS: CommandItem[] = [
  // ── 入門 ───────────────────────────────────────────
  {
    label: "首頁 · ZONE 27 主入口",
    kicker: "/",
    path: "/",
    group: "入門",
    keywords: ["home", "zone 27", "hero", "首頁", "主頁"],
  },
  {
    label: "5 分鐘入門",
    kicker: "/learn",
    path: "/learn",
    group: "入門",
    keywords: ["learn", "primer", "bill james", "入門", "新手", "introduction"],
  },
  {
    label: "FAQ · 誠實回答",
    kicker: "/faq",
    path: "/faq",
    group: "入門",
    keywords: ["faq", "questions", "常見問題", "問與答"],
  },
  {
    label: "關於 · 品牌方法論",
    kicker: "/about",
    path: "/about",
    group: "入門",
    keywords: ["about", "story", "關於"],
  },

  // ── 賽事 · 引擎 ────────────────────────────────────
  {
    label: "今日賽事板 · CPBL",
    kicker: "/matches",
    path: "/matches",
    group: "賽事 · 引擎",
    keywords: [
      "matches",
      "cpbl",
      "今日賽事",
      "賽程",
      "板",
      "今晚",
      "下午",
      "比賽",
      "戰況",
      "賽況",
      "對戰",
      "對戰組合",
      "戰報",
      "看球",
      "選邊",
      "誰贏",
      "今晚誰贏",
      "預測",
      "賽前",
      "盤口",
    ],
  },
  {
    label: "MLB · 即時資料",
    kicker: "/matches/mlb",
    path: "/matches/mlb",
    group: "賽事 · 引擎",
    keywords: ["mlb", "美國職棒", "即時", "stats api"],
  },
  {
    label: "即時引擎 · 模擬實驗室",
    kicker: "/lab",
    path: "/lab",
    group: "賽事 · 引擎",
    keywords: [
      "lab",
      "engine",
      "simulator",
      "蒙地卡羅",
      "引擎",
      "模擬",
      "勝率",
      "預測",
      "誰贏",
      "推算",
      "演算",
      "勝負",
      "賠率",
      "monte carlo",
    ],
  },
  {
    label: "自訂實驗室 · Power User",
    kicker: "/lab/custom",
    path: "/lab/custom",
    group: "賽事 · 引擎",
    keywords: ["custom", "power", "自訂", "投手", "pitcher"],
  },
  {
    label: "每日量化早報",
    kicker: "/signal-board",
    path: "/signal-board",
    group: "賽事 · 引擎",
    keywords: [
      "signal",
      "board",
      "早報",
      "daily",
      "brief",
      "晨報",
      "賽前情報",
      "頭條",
      "今日重點",
      "戰況預覽",
    ],
  },
  {
    label: "CPBL 投手排行 · 6 stat tabs · URL-shareable",
    kicker: "/cpbl-pitchers",
    path: "/cpbl-pitchers",
    group: "賽事 · 引擎",
    keywords: [
      "cpbl pitchers",
      "排行",
      "leaderboard",
      "投手",
      "pitchers",
      "k9",
      "bb9",
      "hr9",
      "whip",
      "era",
      "ip",
      "stat",
      "ranking",
      "baseball savant",
      "savant",
      "ace",
      "control",
      "波球",
      "勝投",
      "防禦率",
      "三振",
      "保送",
      "王牌",
      "頭號投手",
      "頂尖",
      "球速",
      "球威",
      "速球",
      "變化球",
      "牛棚",
      "終結者",
      "守護神",
      "救援",
      "先發",
      "中繼",
      "外籍投手",
      "洋投",
      "本土投手",
      "球員卡",
      "球員數據",
      "進階數據",
      "進階指標",
      "trackman",
      "advanced",
    ],
  },
  {
    label: "CPBL 6 隊伍 投手 aggregation · 球迷 tribal home base",
    kicker: "/cpbl-teams",
    path: "/cpbl-teams",
    group: "賽事 · 引擎",
    keywords: [
      "cpbl teams",
      "teams",
      "隊伍",
      "球團",
      "team page",
      "tribal",
      "統一獅",
      "中信兄弟",
      "富邦悍將",
      "樂天桃猿",
      "味全龍",
      "台鋼雄鷹",
      "lions",
      "brothers",
      "guardians",
      "monkeys",
      "dragons",
      "hawks",
      "獅迷",
      "象迷",
      "兄弟象",
      "兄迷",
      "悍將",
      "猿迷",
      "桃猿",
      "龍迷",
      "鷹迷",
      "鋼鷹",
      "雄鷹",
      "魔猴",
      "球迷",
      "鄉民",
      "支持的球隊",
      "母隊",
    ],
  },

  // ── 品牌 IP ────────────────────────────────────────
  {
    label: "倒置宣言 · 4 個刻意倒置",
    kicker: "/manifesto",
    path: "/manifesto",
    group: "品牌 IP",
    keywords: ["manifesto", "倒置", "inversion", "philosophy", "宣言"],
  },
  {
    label: "鐵律 · Buffett · Musk · Costco · Jobs 共識",
    kicker: "/discipline",
    path: "/discipline",
    group: "品牌 IP",
    keywords: ["discipline", "鐵律", "buffett", "musk", "costco", "jobs"],
  },
  {
    label: "公開路線圖 · 含「永遠不做」清單",
    kicker: "/roadmap",
    path: "/roadmap",
    group: "品牌 IP",
    keywords: ["roadmap", "路線圖", "未來", "永遠不做"],
  },
  {
    label: "Now · craft journal · SHIPPED / DISCOVERED / UNRESOLVED",
    kicker: "/now",
    path: "/now",
    group: "品牌 IP",
    keywords: ["now", "現在", "craft", "journal", "本週", "工藝"],
  },
  {
    label: "Changelog · git source of truth",
    kicker: "/changelog",
    path: "/changelog",
    group: "品牌 IP",
    keywords: ["changelog", "版本", "git", "歷史", "log"],
  },

  // ── 信任文件 ───────────────────────────────────────
  {
    label: "Transparency · 完整 audit 一頁可見 · aggregator",
    kicker: "/transparency",
    path: "/transparency",
    group: "信任文件",
    keywords: [
      "transparency",
      "audit",
      "aggregator",
      "anthropic",
      "limits",
      "never",
      "公開",
      "稽核",
    ],
  },
  {
    label: "Model Report · 引擎範圍 + 揭露哲學",
    kicker: "/audit",
    path: "/audit",
    group: "信任文件",
    keywords: ["audit", "model", "report", "稽核"],
  },
  {
    label: "技術白皮書 · GitHub 程式碼",
    kicker: "/methodology",
    path: "/methodology",
    group: "信任文件",
    keywords: ["methodology", "技術", "白皮書", "whitepaper"],
  },
  {
    label: "公開戰績 · PROVED vs DIVERGED ledger",
    kicker: "/track-record",
    path: "/track-record",
    group: "信任文件",
    keywords: [
      "track",
      "record",
      "戰績",
      "proved",
      "diverged",
      "ledger",
      "準不準",
      "對了",
      "錯了",
      "命中",
      "Brier",
      "中沒中",
      "命中率",
      "準度",
      "歷史紀錄",
      "對錯",
      "對中",
      "預測紀錄",
      "賭神",
      "報明牌",
      "誰才是神",
    ],
  },
  {
    label: "Calibration · epistemic mirror · reliability diagram",
    kicker: "/calibration",
    path: "/calibration",
    group: "信任文件",
    keywords: ["calibration", "brier", "校準", "538", "tetlock"],
  },
  {
    label: "Integrity · 22 永久不會變 · Berkshire 1996",
    kicker: "/integrity",
    path: "/integrity",
    group: "信任文件",
    keywords: [
      "integrity",
      "誠信",
      "berkshire",
      "buffett",
      "22 binding",
      "redlines",
      "ethics",
      "binding rules",
      "承諾",
      "保證",
      "不會變",
      "永遠",
    ],
  },
  {
    label: "Ethics · 9 binding NOT-DO commitments",
    kicker: "/ethics",
    path: "/ethics",
    group: "信任文件",
    keywords: ["ethics", "policy", "倫理", "承諾", "stratechery", "binding"],
  },
  {
    label: "Steelman · 反 ZONE 27 最強 5 個論證",
    kicker: "/steelman",
    path: "/steelman",
    group: "信任文件",
    keywords: ["steelman", "objection", "反方", "論證", "pratfall"],
  },
  {
    label: "覆蓋範圍 · NEVER 清單",
    kicker: "/coverage",
    path: "/coverage",
    group: "信任文件",
    keywords: ["coverage", "覆蓋", "範圍", "scope", "never"],
  },
  {
    label: "隱私政策 · 0 trackers",
    kicker: "/privacy",
    path: "/privacy",
    group: "信任文件",
    keywords: ["privacy", "隱私", "tracker", "cookie", "ga", "pixel"],
  },
  {
    label: "服務條款",
    kicker: "/terms",
    path: "/terms",
    group: "信任文件",
    keywords: ["terms", "條款", "tos", "service"],
  },

  // ── 轉換 ───────────────────────────────────────────
  {
    label: "Founders 27 · 創始終身 · 限量 270 預售",
    kicker: "/founders",
    path: "/founders",
    group: "轉換",
    keywords: [
      "founders",
      "創始",
      "創始會員",
      "27",
      "lifetime",
      "終身",
      "2700",
      "270",
      "贊助",
      "支持",
      "入主",
      "限量",
      "席位",
      "席次",
      "終身會員",
      "ico",
      "天使",
      "patreon",
    ],
  },
  {
    label: "申請 Founders 27 · Patek-style · Tim 親手 review",
    kicker: "/founders/apply",
    path: "/founders/apply",
    group: "轉換",
    keywords: [
      "apply",
      "application",
      "申請",
      "founders",
      "patek",
      "申請表",
      "submit",
    ],
  },
  {
    label: "會員制 · 4-tier ladder 總覽",
    kicker: "/membership",
    path: "/membership",
    group: "轉換",
    keywords: [
      "會員",
      "membership",
      "tier",
      "ladder",
      "訂閱",
      "免費",
      "free",
    ],
  },
  {
    label: "BLACK CARD · CPBL 季票 · ≈ NT$ 6/場",
    kicker: "/membership/black-card",
    path: "/membership/black-card",
    group: "轉換",
    keywords: [
      "black card",
      "blackcard",
      "subscribe",
      "訂閱",
      "黑卡",
      "季票",
      "season pass",
      "1500",
    ],
  },
  {
    label: "為什麼 NT$ 1,500/season / NT$ 2,700 · pricing rationale",
    kicker: "/pricing/why",
    path: "/pricing/why",
    group: "轉換",
    keywords: [
      "pricing",
      "why",
      "為什麼",
      "定價",
      "price",
      "1500",
      "2700",
      "math",
    ],
  },

  // ── 工具 · 外部 ────────────────────────────────────
  {
    label: "Member · 您的引擎時間軸",
    kicker: "/member",
    path: "/member",
    group: "工具 · 外部",
    keywords: ["member", "dashboard", "會員頁", "個人", "時間軸"],
  },
  {
    label: "Login · Email + 密碼 註冊 · FREE TIER",
    kicker: "/login",
    path: "/login",
    group: "工具 · 外部",
    keywords: [
      "login",
      "登入",
      "註冊",
      "register",
      "signup",
      "password",
      "密碼",
      "email",
      "auth",
    ],
  },
  {
    label: "GitHub · 完整原始碼開源",
    kicker: "github.com/Tim-xuan-you/zone27-web",
    path: "https://github.com/Tim-xuan-you/zone27-web",
    group: "工具 · 外部",
    keywords: ["github", "source", "code", "原始碼", "open source", "mit"],
    external: true,
  },
];

/** Group display order — palette renders headers in this sequence. */
export const COMMAND_GROUP_ORDER = [
  "入門",
  "賽事 · 引擎",
  "品牌 IP",
  "信任文件",
  "轉換",
  "工具 · 外部",
] as const;

/** Returns filtered items matching the query (case-insensitive substring). */
export function filterCommandItems(
  query: string,
  items: CommandItem[] = COMMAND_ITEMS
): CommandItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;
  return items.filter((item) => {
    if (item.label.toLowerCase().includes(trimmed)) return true;
    if (item.kicker.toLowerCase().includes(trimmed)) return true;
    if (item.path.toLowerCase().includes(trimmed)) return true;
    if (
      item.keywords?.some((k) => k.toLowerCase().includes(trimmed))
    ) {
      return true;
    }
    return false;
  });
}
