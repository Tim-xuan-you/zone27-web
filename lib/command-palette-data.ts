// ── ZONE 27 · Command Palette Index ─────────────────────
// PRIMARY routes only · ~26 → 38 entries · power-user search · Hick's Law-aware
// editorial priority。 Secondary routes accessed via /transparency aggregator
// + Footer + parent-page cross-links(e.g. /founders/* sub-pages 從 /founders
// 探索 · /letter + /year-zero + /heritage + /hey-tim + /annual 從 /transparency
// aggregator · /methodology/diff 從 /methodology · /receipts/* 從 /track-record ·
// /member/calibration + /member/submit 從 /member · /engine-log direct since R120 W5)。
// (/poster + /auth/* intentionally NOT indexed · 同 framing。)
// R122 W1 · /admin 從 「NOT indexed」 改 indexed · per founder-dogfood-canary
// 第 N 次 fire · designer 需要 1-click access to tier preview · per
// [[feedback-zone27-tier-dogfood-method]] memory · client-side spoofable BUT 0
// risk(R113 W1 Kerckhoffs')· /admin still noindex on Vercel(meta robots)·
// 但 Cmd-K visible for designer。

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
  // R168 W1 · /glossary DELETED · Tim canary 3「使用者不是工程師」 · 27 industry stat 字典 = engineer-grammar dump · Z27 LEXICON 5 terms ported to /audit §08 · Cmd-K entry removed · per Agent P TIER A #4
  // R170 W1 · /rewards RESTORED · Tim 38th 同 mandate explicit endorse Q4 launch · R166 W1 削 reason(Q4 vapor)obsolete · revive with Cmd-K entry
  {
    label: "Rewards · PROVED 預測兌換實體獎品(底片 / 咖啡 / 沖洗)",
    kicker: "/rewards",
    path: "/rewards",
    group: "入門",
    keywords: [
      "rewards",
      "獎品",
      "兌換",
      "集點",
      "底片",
      "咖啡",
      "沖洗",
      "護照代辦",
      "點數",
      "proved",
      "預測兌換",
      "恆美",
      "伶 Kopi",
      "skill prize",
      "fantasy league",
    ],
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
      // R115 W2 · Tim 2026-05-25 dogfood「在哪裡可以分享、推薦賽事? 找不到呀!」
      // /matches/[gameId] 內 UserPredictionPicker + AnonPickWidget + ReceiptForwardButton
      // 都 ship 但 share/predict 動作 keywords 之前不 surface · 加 keyword sets
      // 讓 Cmd-K 搜索「分享」「我也猜」「投票」「推薦」 都能找到 → /matches。
      "分享",
      "share",
      "我也猜",
      "您也猜",
      "猜輸贏",
      "投票",
      "推薦",
      "recommend",
      "贏家",
      "黑馬",
      "AnonPick",
      "UserPrediction",
      // R137 W6 · 場館暱稱 + 季事關鍵詞 per Agent C 球迷 slang gap audit
      // (filtered to brand-IP-fit only · CPBL fan audience grammar per
      // [[feedback-zone27-audience-fans-not-engineers]])
      "洲際",
      "天母",
      "新莊",
      "澄清湖",
      "場館",
      "球場",
      "主場",
      "客場",
      "台灣大賽",
      "季後賽",
      "明星賽",
      "總冠軍",
      // R155 W3e · Agent C 5 new 球迷 slang per CPBL/PTT/FB 粉專 vernacular
      // (filtered to brand-IP-fit · 0 betting term · per
      // [[feedback-zone27-audience-fans-not-engineers]])· 滿貫砲 + 再見全壘打 +
      // sayonara = high-leverage moments · 牛棚崩盤 + 救援失敗 + 失火 = late-inning
      // event grammar
      "滿貫砲",
      "再見全壘打",
      "再見",
      "sayonara",
      "牛棚崩盤",
      "救援失敗",
      "失火",
      "炸裂",
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
    label: "海選天梯 · 準度排行(新秀 → 神諭)",
    kicker: "/ladder",
    path: "/ladder",
    group: "賽事 · 引擎",
    keywords: [
      "ladder",
      "天梯",
      "海選",
      "排行榜",
      "leaderboard",
      "神諭",
      "oracle",
      "準度",
      "ranking",
      "市場",
      "market",
    ],
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
    keywords: [
      "custom",
      "power",
      "自訂",
      "投手",
      "pitcher",
      // R155 W3e · Agent C 球迷 slang · 二刀流 / Ohtani 大谷 SHO power-user
      // simulation · CPBL fan 想 mock two-way player · brand IP fit
      "二刀流",
      "大谷",
      "sho",
      "ohtani",
      "two-way",
    ],
  },
  // R167 W1b · /signal-board DELETED · daily promise we don't keep(violates [[feedback-no-waiting-rule]] same as /rewards Q4 vapor)· per Agent P TIER B #7 + Tim canary 3 · Cmd-K entry removed
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
      // R137 W6 · 投手 archetype 球迷 slang per Agent C · CPBL/Asian baseball
      // 文化 reference · 火球男 = fastball specialist · 控球魔術師 = command
      // specialist · brand IP fit per [[feedback-zone27-audience-fans-not-engineers]]
      "火球男",
      "火球",
      "控球魔術師",
      "控球",
      "魔術師",
      "怪力男",
      "養生球路",
      "肩傷",
      "復出",
      "球速王",
      // R155 W3e · Agent C 球迷 slang · pitcher-vulnerability narrative ·
      // 「誰被開轟」 是 CPBL fan canonical pitcher rank question · HR9 leaderboard
      // 已 on /cpbl-pitchers 但這些 fan grammar keywords 之前未 surface
      "開轟",
      "全壘打",
      "場外開花",
      "被打爆",
      "失分王",
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
      // R137 W6 · 場館暱稱 per Agent C 球迷 slang gap audit · CPBL ballpark
      // affinity = team loyalty hinge · brand IP fit per
      // [[feedback-zone27-audience-fans-not-engineers]]
      "洲際",
      "天母",
      "新莊",
      "澄清湖",
      "場館",
      "球場",
      "主場",
      // R155 W3e · Agent C 球迷 slang · team-form tribal query · 「兄弟連敗」
      // 「獅子王朝」 是 fan 查 team-aggregation page 的 canonical narrative ·
      // brand IP fit per [[feedback-zone27-audience-fans-not-engineers]]
      "連敗",
      "連勝",
      "王朝",
      "氣勢",
      "低潮",
      "翻身",
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
    label: "Changelog · git source of truth",
    kicker: "/changelog",
    path: "/changelog",
    group: "品牌 IP",
    keywords: ["changelog", "版本", "git", "歷史", "log"],
  },
  // R164 NUCLEAR DELETE · /heritage + /transparency + /engine-log Cmd-K
  // entries removed per Tim canary fire「頁面多到一個離譜」 · Apple discipline
  // 12-page max · pages deleted from app/ · cross-references redirected to
  // canonical parents(/heritage→/about · /transparency→/audit · /engine-log→
  // /audit)。

  // ── 信任文件 ───────────────────────────────────────
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
    label: "Interact · 10 reader↔writer channels · one-way by design",
    kicker: "/interact",
    path: "/interact",
    group: "信任文件",
    keywords: [
      "interact",
      "互動",
      "討論",
      "討論區",
      "留言板",
      "comment",
      "forum",
      "community",
      "社群",
      "推薦賽事",
      "分享",
      "share",
      "推薦",
      "talk",
      "talk to tim",
      "聊天",
      "chat",
      "互相",
      "彼此",
      "其他人",
      "球迷區",
      "讀者",
      "reader",
      "writer",
      "single voice",
      "stratechery",
      "bill james",
      "hey bill",
      "delta japan",
      "one-way",
      "10 channels",
      "投稿",
      "submit",
      "申請",
      "意見",
      "feedback",
      "為什麼沒有",
      "沒有 community",
      "沒有 forum",
      "沒有討論區",
      "在哪",
      "where",
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
    label: "Steelman · 反 ZONE 27 最強 6 個論證",
    kicker: "/steelman",
    path: "/steelman",
    group: "信任文件",
    keywords: [
      "steelman",
      "objection",
      "反方",
      "論證",
      "pratfall",
      // R109 W5 · LLM / Quark NBA / AI 對立面 keywords 指 Objection #06(R108 W7)·
      // 搜「為什麼不用 AI」 / 「Quark」 / 「LLM」 / 「ChatGPT」 → 直接跳 /steelman ·
      // brand IP「LLM hallucination ≠ deterministic Monte Carlo」 positioning surface。
      "llm",
      "ai 對話",
      "ai 看球",
      "ai 助手",
      "quark",
      "夸克",
      "千问",
      "chatgpt",
      "gpt",
      "claude",
      "豆包",
      "deepseek",
      "為什麼不用 AI",
      "為什麼不用 LLM",
      "natural language",
      "自然語言",
      "多模態",
      "multimodal",
    ],
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
    label: "Founders 27 · 年度創始席位 · 前 270 創始編號",
    kicker: "/founders",
    path: "/founders",
    group: "轉換",
    keywords: [
      "founders",
      "創始",
      "創始會員",
      "27",
      "annual",
      "年度",
      "2700",
      "270",
      "贊助",
      "支持",
      "入主",
      "席位",
      "席次",
      "年度會員",
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
  // R167 W1a · /leaderboard DELETED · Tim canary 3「每個網頁滑不到底 · 大部分不必要」 · per Agent P TIER A #3 · Cmd-K entry removed · 「席位」 keyword now points to /founders/ledger
  {
    label: "Open Allocation Ledger · 公開拒絕原因 · 4 axiom",
    kicker: "/founders/ledger",
    path: "/founders/ledger",
    group: "轉換",
    keywords: [
      "ledger",
      "allocation",
      "open allocation",
      "refusal",
      "refusals",
      "拒絕",
      "拒絕原因",
      "rejection",
      "rejected",
      "approval",
      "approval rate",
      "通過率",
      "weekly review",
      "review log",
      "patek",
      "hermes",
      "tesla",
      "process transparency",
      "我會被拒絕嗎",
      "誰被拒絕",
      "為什麼被拒",
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
    label: "BLACK CARD · CPBL 季票 · NT$ 500/31 天",
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
      "500",
    ],
  },
  // R164 NUCLEAR DELETE · /pricing/why Cmd-K entry removed · /pricing route
  // deleted per Tim canary fire · NT$ 2,700 justification 已在 /founders body +
  // BreakEvenCell + MultiYearAnchor + GenerationsLine consolidated · 不需獨立 page。

  // ── 工具 · 外部 ────────────────────────────────────
  {
    label: "Member · 您的引擎時間軸",
    kicker: "/member",
    path: "/member",
    group: "工具 · 外部",
    keywords: ["member", "dashboard", "會員頁", "個人", "時間軸"],
  },
  {
    label: "Login · Email + 密碼 · FREE TIER",
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
  {
    // R122 W1 · Tim 第 N 次 founder-dogfood-canary fire(R36 / R47 / R60 / R113 / R122)
    // 問「設計者怎麼切換 tier 方案?」 · 此非 missing feature · 是 discoverability bug ·
    // /admin AdminTierSwitcher + PreviewModeBanner + Cmd+Shift+P + URL deep link 4 個 entry
    // points 全 ship since R36 W-D · 但 Tim 仍 forget · 加 Cmd-K entry 1-click 可達 ·
    // per [[feedback-zone27-tier-dogfood-method]] memory codify · DO NOT rebuild · DO NOT
    // create separate accounts · ONLY surface existing infrastructure。 安全:per R113 W1
    // Kerckhoffs' principle · client-side spoofable but 0 risk · 0 paid features built。
    label: "🎭 Designer · 切換 tier preview(設計者 dogfood 工具)",
    kicker: "/admin",
    path: "/admin",
    group: "工具 · 外部",
    keywords: [
      "admin",
      "tier",
      "切換",
      "preview",
      "dogfood",
      "設計者",
      "designer",
      "anonymous",
      "free",
      "black",
      "founders",
      "切到 black",
      "切到 founders",
      "切到 free",
      "切到 anonymous",
      "tier switcher",
      "預覽",
      "身份切換",
      "視角",
      "方案",
      "看 BLACK CARD",
      "看 FREE TIER",
      "看訪客",
      "看 Founders",
      "cmd shift p",
      "ctrl shift p",
      "keyboard shortcut",
    ],
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
