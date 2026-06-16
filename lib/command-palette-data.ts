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
// R239(Tim canary 再起「資訊轟炸 · 極簡再極簡 · Apple」)· 13 隨功能慢慢長回 17 → 收回 13。
// 砍 4 條「子頁 / 重複」(頁面不刪 · 從父項到得了 · 關鍵字併進父項不漏搜):
//   · /matches/mlb → 併進「今日賽事板 · CPBL + MLB」(本來就含 MLB · 搜 mlb/大聯盟 落這)
//   · /calibration/test → 併進「引擎校準」(那頁就有大顆「玩一次校準練習」鈕 + 首頁也連)
//   · /member/inbox · /member/leagues → 會員子頁 · 從 /member 儀表板到得了(非會員不會搜)
// 留下的就是「一個球迷真正會搜的東西」· 同 Apple top-nav ~10 紀律(深度頁靠內文連結 + 直打網址)。
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
      // 球員 / 球隊 slang(搜這些 → 落 /matches 看板)
      "投手", "pitcher", "球員", "球員卡", "球員數據",
      "統一獅", "中信兄弟", "富邦悍將", "樂天桃猿", "味全龍", "台鋼雄鷹",
      "獅迷", "象迷", "兄弟", "悍將", "桃猿", "龍迷", "雄鷹", "球隊", "支持的球隊",
      // R239 · /matches/mlb 併進來(同一個賽事板含 CPBL + MLB · 搜這些落這)
      "mlb", "美國職棒", "大聯盟", "即時", "stats api",
    ],
  },
  {
    label: "開盤 · 群眾預測市場",
    kicker: "/markets",
    path: "/markets",
    group: "賽事 · 引擎",
    keywords: [
      "markets", "開盤", "群眾盤", "市場", "預測市場", "群眾共識", "押任一場",
      "polymarket", "其他聯賽", "冰島", "任何球", "開一張",
    ],
  },
  {
    label: "足球 · 世界盃/巴甲 引擎開盤(勝/平/負)",
    kicker: "/soccer",
    path: "/soccer",
    group: "賽事 · 引擎",
    keywords: [
      "soccer", "football", "足球", "世界盃", "world cup", "wc",
      "巴甲", "巴西", "brazil", "歐冠", "英超", "勝平負", "和局", "draw",
    ],
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
    label: "公開戰績 · 每一場對錯的帳本",
    kicker: "/track-record",
    path: "/track-record",
    group: "信任文件",
    keywords: [
      "track", "record", "戰績", "proved", "diverged", "ledger", "準不準",
      "對了", "錯了", "命中", "中沒中", "命中率", "準度", "歷史紀錄",
      "對錯", "預測紀錄", "賭神", "報明牌", "誰才是神", "audit", "稽核",
      "方法公開", "methodology", "白皮書",
    ],
  },
  {
    label: "引擎校準 · 說七成、實際中幾成",
    kicker: "/calibration",
    path: "/calibration",
    group: "信任文件",
    // R239 · /calibration/test(免登入「換你當引擎」鉤子)併進關鍵字 —— 搜「練習/測自己」
    // 仍落這頁,那頁頂端就有大顆「玩一次校準練習」鈕(+ 首頁也連)· 不需在快搜各佔一條。
    keywords: [
      "calibration", "校準", "準度", "57%", "天花板", "你有多準",
      "練習", "校準練習", "測自己", "測你自己", "換你當引擎", "互動", "玩玩看", "self test", "quiz",
    ],
  },
  {
    label: "我們搞砸過的事 · 公開認錯、不刪",
    kicker: "/corrections",
    path: "/corrections",
    group: "信任文件",
    keywords: [
      "corrections", "mistakes", "搞砸", "認錯", "錯誤", "犯錯", "修正", "糾錯",
      "我們的錯", "改過", "誠實", "honest", "我們搞砸過的事",
    ],
  },
  {
    label: "我們怎麼算贏輸 · 一場都刪不掉",
    kicker: "/how-we-grade",
    path: "/how-we-grade",
    group: "信任文件",
    keywords: [
      "結算", "規則", "怎麼算", "贏輸", "判定", "grade", "grading", "settlement",
      "rule", "刪不掉", "改不了", "back-date", "賽果", "官方", "公平", "怎麼判贏",
    ],
  },
  {
    label: "查驗一份戰績 · 貼碼看 live 含輸帳本",
    kicker: "/verify",
    path: "/verify",
    group: "信任文件",
    keywords: [
      "verify", "查驗", "驗證", "查證", "貼碼", "永久碼", "code", "真的嗎",
      "怎麼驗", "查他", "查這個人", "認證", "憑證", "credential", "查戰績", "徽章",
    ],
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
