// ── ZONE 27 · Command Palette Index ─────────────────────
// All user-visible routes indexed for Cmd-K / Ctrl-K search.
// Source of truth for "what does this site have" — when adding
// a new route, add an entry here so it's discoverable.
//
// Keywords drive substring matching. Lower-case both query and
// keywords before compare. Order within group preserves
// editorial sequence (newcomers first → power users last).
//
// Inspired by Linear / Vercel / Stripe command palettes,
// but DELIBERATELY thin: no fuse.js, no telemetry, no
// recently-used persistence. Simple substring filter on a
// hand-curated 28-row list is sufficient and brand-pure
// (per [[zone27-disclosure-philosophy]]: no hidden ranking).
// (/admin is intentionally NOT indexed here · Tim bookmarks it ·
// keeping it out of visitor Cmd-K aligns with its noindex framing.)
// ─────────────────────────────────────────────────────

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
    label: "FAQ · 14 個誠實回答",
    kicker: "/faq",
    path: "/faq",
    group: "入門",
    keywords: ["faq", "questions", "常見問題", "問與答"],
  },
  {
    label: "關於 · 6 章節品牌方法論",
    kicker: "/about",
    path: "/about",
    group: "入門",
    keywords: ["about", "story", "關於", "story"],
  },

  // ── 賽事 · 引擎 ────────────────────────────────────
  {
    label: "今日賽事板 · CPBL",
    kicker: "/matches",
    path: "/matches",
    group: "賽事 · 引擎",
    keywords: ["matches", "cpbl", "今日賽事", "賽程", "板"],
  },
  {
    label: "統一 vs 富邦 · 2026-05-21 · 18:35 新莊",
    kicker: "/matches/cpbl-260521-01",
    path: "/matches/cpbl-260521-01",
    group: "賽事 · 引擎",
    keywords: ["統一", "富邦", "lions", "guardians", "李東洛", "郭俊麟", "新莊"],
  },
  {
    label: "MLB · 即時資料",
    kicker: "/matches/mlb",
    path: "/matches/mlb",
    group: "賽事 · 引擎",
    keywords: ["mlb", "美國職棒", "即時", "stats api"],
  },
  {
    label: "即時引擎 · Monte Carlo 模擬器",
    kicker: "/lab",
    path: "/lab",
    group: "賽事 · 引擎",
    keywords: ["lab", "engine", "monte carlo", "蒙地卡羅", "引擎", "模擬"],
  },
  {
    label: "自訂實驗室 · Power User",
    kicker: "/lab/custom",
    path: "/lab/custom",
    group: "賽事 · 引擎",
    keywords: ["custom", "power", "自訂", "投手", "pitcher", "lab custom"],
  },
  {
    label: "每日量化早報",
    kicker: "/signal-board",
    path: "/signal-board",
    group: "賽事 · 引擎",
    keywords: ["signal", "board", "早報", "daily", "brief"],
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
    label: "鐵律 · Buffett · Musk · Costco 共識",
    kicker: "/discipline",
    path: "/discipline",
    group: "品牌 IP",
    keywords: ["discipline", "鐵律", "buffett", "musk", "costco", "operating"],
  },
  {
    label: "公開路線圖 · 含「永遠不做」清單",
    kicker: "/roadmap",
    path: "/roadmap",
    group: "品牌 IP",
    keywords: ["roadmap", "路線圖", "未來", "explicit no", "永遠不做"],
  },
  {
    label: "版本紀錄 · git 為 source of truth",
    kicker: "/changelog",
    path: "/changelog",
    group: "品牌 IP",
    keywords: ["changelog", "版本", "git", "歷史", "log"],
  },
  {
    label: "Now · 現在 craft journal · SHIPPED / DISCOVERED / UNRESOLVED",
    kicker: "/now",
    path: "/now",
    group: "品牌 IP",
    keywords: [
      "now",
      "現在",
      "craft",
      "journal",
      "linear",
      "本週",
      "this week",
      "蜘蛛網",
      "工藝",
    ],
  },

  // ── 信任文件 ───────────────────────────────────────
  {
    label: "Model Report · 5 sections · 引擎範圍 + 揭露哲學",
    kicker: "/audit",
    path: "/audit",
    group: "信任文件",
    keywords: ["audit", "model", "report", "稽核", "report"],
  },
  {
    label: "技術白皮書 · 4 sections + GitHub 程式碼",
    kicker: "/methodology",
    path: "/methodology",
    group: "信任文件",
    keywords: ["methodology", "技術", "白皮書", "whitepaper", "method"],
  },
  {
    label: "覆蓋範圍 · NEVER 清單",
    kicker: "/coverage",
    path: "/coverage",
    group: "信任文件",
    keywords: ["coverage", "覆蓋", "範圍", "scope", "never"],
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
      "calibration",
      "ledger",
    ],
  },
  {
    label: "27 種進階指標 glossary",
    kicker: "/glossary",
    path: "/glossary",
    group: "信任文件",
    keywords: ["glossary", "詞彙", "k/9", "whip", "era", "wOBA", "babip"],
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

  // ── 工具 · 外部 ────────────────────────────────────
  // Round 25 split(Tim 揭示 wayfinding):/membership 跟 /founders 各自獨立 ·
  // 各自 keyword set · 訪客搜「會員」優先 /membership(ladder overview)·
  // 搜「founders」「創始」「終身」優先 /founders(Founders 27 deep dive)。
  {
    label: "會員制 · 4-tier ladder 總覽 · FREE TIER + BLACK CARD + Founders 27",
    kicker: "/membership",
    path: "/membership",
    group: "工具 · 外部",
    keywords: [
      "會員",
      "會員制",
      "加入會員",
      "membership",
      "tier",
      "ladder",
      "訂閱",
      "free tier",
      "免費",
      "免費訂閱",
      "black card",
      "黑金",
      "一般會員",
      "free",
      "subscribe",
    ],
  },
  {
    label: "Founders 27 · 創始終身 · 限量 270 預售詳情",
    kicker: "/founders",
    path: "/founders",
    group: "工具 · 外部",
    keywords: [
      "founders",
      "創始",
      "創始會員",
      "27",
      "lifetime",
      "終身",
      "預訂",
      "2700",
      "270",
    ],
  },
  {
    label: "27 之牆 · 270 席位視覺化",
    kicker: "/leaderboard",
    path: "/leaderboard",
    group: "工具 · 外部",
    keywords: ["leaderboard", "wall", "27", "席位", "之牆"],
  },
  {
    label: "Member · 您的引擎時間軸(FREE TIER dashboard preview)",
    kicker: "/member",
    path: "/member",
    group: "工具 · 外部",
    keywords: [
      "member",
      "dashboard",
      "會員頁",
      "個人",
      "時間軸",
      "sim history",
      "endowment",
      "psychology",
      "preview",
    ],
  },
  {
    label: "Calibration · epistemic mirror · reliability diagram",
    kicker: "/member/calibration",
    path: "/member/calibration",
    group: "工具 · 外部",
    keywords: [
      "calibration",
      "校準",
      "reliability",
      "diagram",
      "45 度",
      "45°",
      "epistemic",
      "mirror",
      "鏡子",
      "sabermetric",
      "fangraphs",
      "savant",
      "drift",
      "校準曲線",
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
