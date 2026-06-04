// ── ZONE 27 · Command Palette Index ─────────────────────
// R199(2026-06-04 · Tim canary fire「37 個頁面太多太扯 · 一堆內部討論的東西 ·
// 幾乎沒人要看 · 極簡再極簡 · 看 Apple / Polymarket」)· 37 → 13 essentials。
//
// 原則(Apple / Polymarket IA):全站快搜不是「把所有頁面倒出來」· 是「一個球迷
// 真正會搜的東西」。 Apple 有上萬頁 · top nav 只放 ~10。 我們同理:這裡只留
// 用戶動線(入門 → 看賽事/押注 → 信任證據 → 帳號)· 品牌哲學長文(宣言/鐵律/
// 反方/誠信/倫理/路線圖…)+ 內部 voice(年報/驗屍/Hey Tim/craft journal)+
// 設計者工具(/admin)全部退出「快搜」—— 頁面不刪(護城河仍在 · footer + 內文
// 交叉連結 + 直接打網址到得了)· 只是不再對每個訪客轟炸 37 條。
//
// /admin(設計者切 tier 預覽)退出快搜:它是內部工具 · render 在公開搜尋裡像漏餡 ·
// 仍可直接打 /admin 進(dogfood 不斷)· 同 footer 早就沒列它的紀律。
//
// Design principles(per [[zone27-disclosure-philosophy]]):
//   - No external deps · plain substring filter · no telemetry / personalization
//   - Group-order editorial(入門 → 賽事 → 信任 → 轉換 → 帳號)
// ─────────────────────────────────────────────────────

export type CommandItem = {
  label: string;
  /** Short English / mono kicker shown above label · disambiguates */
  kicker: string;
  /** Route path (internal) or full URL (external · opens new tab) */
  path: string;
  /** Group label · controls section ordering in palette */
  group: "入門" | "賽事 · 引擎" | "信任文件" | "轉換" | "工具 · 外部";
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
    keywords: ["home", "zone 27", "hero", "首頁", "主頁", "今晚"],
  },
  {
    label: "5 分鐘入門 · 給沒聽過的人",
    kicker: "/learn",
    path: "/learn",
    group: "入門",
    keywords: ["learn", "primer", "bill james", "入門", "新手", "introduction", "怎麼玩", "怎麼用"],
  },
  {
    label: "FAQ · 誠實回答",
    kicker: "/faq",
    path: "/faq",
    group: "入門",
    keywords: ["faq", "questions", "常見問題", "問與答", "為什麼"],
  },

  // ── 賽事 · 引擎 ────────────────────────────────────
  {
    label: "今日賽事板 · CPBL + MLB",
    kicker: "/matches",
    path: "/matches",
    group: "賽事 · 引擎",
    keywords: [
      "matches", "cpbl", "今日賽事", "賽程", "板", "今晚", "下午", "比賽",
      "戰況", "賽況", "對戰", "對戰組合", "戰報", "看球", "選邊", "誰贏",
      "今晚誰贏", "預測", "賽前", "盤口", "押注", "押", "下注",
      "分享", "share", "我也猜", "您也猜", "猜輸贏", "投票", "推薦",
      "recommend", "贏家", "黑馬",
      // 場館 + 季事
      "洲際", "天母", "新莊", "澄清湖", "場館", "球場", "主場", "客場",
      "台灣大賽", "季後賽", "明星賽", "總冠軍",
      // 高張力時刻 slang
      "滿貫砲", "再見全壘打", "再見", "sayonara", "牛棚崩盤", "救援失敗", "失火", "炸裂",
      // 球員 / 球隊 slang(/cpbl-pitchers · /cpbl-teams 從這探索)
      "投手", "pitcher", "球員", "球員卡", "球員數據",
      "統一獅", "中信兄弟", "富邦悍將", "樂天桃猿", "味全龍", "台鋼雄鷹",
      "獅迷", "象迷", "兄弟", "悍將", "桃猿", "龍迷", "雄鷹", "球隊", "支持的球隊",
    ],
  },
  {
    label: "MLB · 即時資料",
    kicker: "/matches/mlb",
    path: "/matches/mlb",
    group: "賽事 · 引擎",
    keywords: ["mlb", "美國職棒", "即時", "stats api", "大聯盟"],
  },
  {
    label: "海選天梯 · 準度排行(新秀 → 神諭)",
    kicker: "/ladder",
    path: "/ladder",
    group: "賽事 · 引擎",
    keywords: [
      "ladder", "天梯", "海選", "排行榜", "leaderboard", "神諭", "oracle",
      "準度", "ranking", "市場", "market", "贏過引擎", "升階",
    ],
  },
  {
    label: "推演引擎 · 模擬實驗室",
    kicker: "/lab",
    path: "/lab",
    group: "賽事 · 引擎",
    keywords: [
      "lab", "engine", "simulator", "推演引擎", "推演", "引擎", "模擬",
      "勝率", "預測", "誰贏", "推算", "演算", "勝負", "賠率", "自訂", "custom",
    ],
  },

  // ── 信任文件(只留用戶真正會搜的兩張「證據」)──────────────
  {
    label: "公開戰績 · 引擎準不準的帳本",
    kicker: "/track-record",
    path: "/track-record",
    group: "信任文件",
    keywords: [
      "track", "record", "戰績", "proved", "diverged", "ledger", "準不準",
      "對了", "錯了", "命中", "中沒中", "命中率", "準度", "歷史紀錄",
      "對錯", "預測紀錄", "賭神", "報明牌", "誰才是神", "audit", "稽核",
      "方法公開", "methodology", "白皮書", "開源",
    ],
  },
  {
    label: "引擎自評 · 準不準一目了然",
    kicker: "/calibration",
    path: "/calibration",
    group: "信任文件",
    keywords: ["calibration", "校準", "準度", "57%", "天花板", "你有多準", "練習", "校準練習"],
  },

  // ── 轉換 ───────────────────────────────────────────
  {
    label: "會員制 · OPEN / BLACK / GOLD",
    kicker: "/membership",
    path: "/membership",
    group: "轉換",
    keywords: [
      "會員", "membership", "tier", "訂閱", "免費", "free", "付費",
      "black", "黑卡", "gold", "founder", "創始", "方案", "升級", "賣分析",
    ],
  },

  // ── 工具 · 外部 ────────────────────────────────────
  {
    label: "你的儀表板 · 校準身分 + 持倉",
    kicker: "/member",
    path: "/member",
    group: "工具 · 外部",
    keywords: ["member", "dashboard", "會員頁", "個人", "儀表板", "我的準度", "持倉", "帳本"],
  },
  {
    label: "登入 · Email + 密碼 · 免費會員",
    kicker: "/login",
    path: "/login",
    group: "工具 · 外部",
    keywords: [
      "login", "登入", "註冊", "register", "signup", "password", "密碼", "email", "auth",
    ],
  },
  {
    label: "GitHub · 完整原始碼開源",
    kicker: "github.com/Tim-xuan-you/zone27-web",
    path: "https://github.com/Tim-xuan-you/zone27-web",
    group: "工具 · 外部",
    keywords: ["github", "source", "code", "原始碼", "open source", "mit", "公開", "驗證"],
    external: true,
  },
];

/** Group display order — palette renders headers in this sequence. */
export const COMMAND_GROUP_ORDER = [
  "入門",
  "賽事 · 引擎",
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
    if (item.keywords?.some((k) => k.toLowerCase().includes(trimmed))) {
      return true;
    }
    return false;
  });
}
