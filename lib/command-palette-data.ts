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
  group: "看球 · 引擎" | "證據 · 帳號";
  /** Searchable aliases · Chinese + English + abbrev */
  keywords?: string[];
  external?: boolean;
};

// R255 大刀闊斧(Tim 第 7+ 次「還是超多 · 國小生想逛 · 極簡再極簡」)· 15 → 6。
// 真正讓 Tim「沒感覺」的是這份快搜 + footer = 他每天看到的選單,不是被砍的深頁。
// 快搜不是 sitemap,是「一個人真的會搜的 6 件事」。 被收起的頁(入門/faq/開盤/天梯/校準/認錯/
// 個人頁)全留、footer/內文/直打網址/nav 到得了 · 關鍵字併進 survivor → 搜「校準/天梯/開盤/登入」
// 仍落到對的頁、不漏搜。 護城河(戰績/校準/認錯頁本身)一頁沒動。
export const COMMAND_ITEMS: CommandItem[] = [
  // ── 看球 · 引擎 ────────────────────────────────────
  {
    label: "今日賽事 · 棒球",
    kicker: "/matches",
    path: "/matches",
    group: "看球 · 引擎",
    keywords: [
      "matches", "cpbl", "今日賽事", "賽程", "今晚", "比賽", "看球", "選邊", "誰贏",
      "預測", "賽前", "押注", "押", "下注", "贏家", "黑馬",
      "投手", "pitcher", "球員", "球隊",
      "統一獅", "中信兄弟", "富邦悍將", "樂天桃猿", "味全龍", "台鋼雄鷹",
      "mlb", "美國職棒", "大聯盟",
      // 收起的「開盤·群眾市場」+「入門/怎麼玩」關鍵字併進來(搜這些落今日賽事)
      "markets", "開盤", "群眾盤", "市場", "預測市場", "開一張",
      "learn", "入門", "新手", "怎麼玩", "怎麼用",
    ],
  },
  {
    label: "足球 · 世界盃",
    kicker: "/soccer",
    path: "/soccer",
    group: "看球 · 引擎",
    keywords: [
      "soccer", "football", "足球", "世界盃", "world cup", "巴甲", "巴西",
      "勝平負", "和局", "draw",
    ],
  },
  {
    label: "今晚這桌 · 誠實收據",
    kicker: "/table",
    path: "/table",
    group: "看球 · 引擎",
    keywords: [
      "table", "今晚這桌", "誠實收據", "收據", "receipt", "對帳", "鎖手",
      "角球", "corner", "總分", "大小", "讓分", "兩隊都得分", "btts",
      "任意一注", "這桌", "無模型", "只對帳",
    ],
  },
  {
    label: "推演引擎 · 自己跑一場",
    kicker: "/lab",
    path: "/lab",
    group: "看球 · 引擎",
    keywords: [
      "lab", "engine", "simulator", "推演引擎", "引擎", "模擬",
      "勝率", "推算", "賠率", "自訂", "custom",
    ],
  },

  // ── 證據 · 帳號 ────────────────────────────────────
  {
    label: "公開戰績 · 每場對錯",
    kicker: "/track-record",
    path: "/track-record",
    group: "證據 · 帳號",
    keywords: [
      "track", "record", "戰績", "proved", "diverged", "ledger", "準不準",
      "命中", "中沒中", "命中率", "對錯", "預測紀錄", "audit", "稽核",
      "方法公開", "methodology", "白皮書", "結算", "規則", "怎麼算", "判定",
      "grade", "settlement", "刪不掉", "改不了", "賽果", "verify", "查驗", "驗證",
      "永久碼", "憑證", "徽章",
      // 收起的「校準/認錯/常見問題/天梯」關鍵字併進證據(搜這些落公開戰績,再一鍵到對應頁)
      "calibration", "校準", "57%", "你有多準", "練習", "測自己",
      "corrections", "搞砸", "認錯", "錯誤", "誠實", "honest",
      "faq", "常見問題", "為什麼", "問與答",
      "ladder", "天梯", "海選", "排行榜", "leaderboard", "神諭", "準度",
    ],
  },
  {
    label: "會員 · 登入註冊",
    kicker: "/membership",
    path: "/membership",
    group: "證據 · 帳號",
    keywords: [
      "會員", "membership", "tier", "訂閱", "免費", "free", "付費",
      "black", "黑卡", "方案", "升級", "支持", "金環", "會員房間",
      // 收起的「登入/註冊/個人儀表板」關鍵字併進來
      "login", "登入", "註冊", "register", "signup", "password", "密碼", "email",
      "member", "dashboard", "會員頁", "儀表板", "我的準度", "持倉",
    ],
  },
];

/** Group display order — palette renders headers in this sequence. */
export const COMMAND_GROUP_ORDER = ["看球 · 引擎", "證據 · 帳號"] as const;

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
