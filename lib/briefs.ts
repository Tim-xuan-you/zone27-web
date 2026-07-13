// ── ZONE 27 · 戰報(米其林式賽前評鑑)· 期刊登記簿 ─────────────────────────────
// Tim 2026-07-12「米其林指南!GO」:戰報從門店 A4 手抄物升格為站上第一手內容 ——
// 當天的擺首頁、過刊摺疊在 /brief、舊刊可下架(hidden)。 A4 原版就是產品
// (public/briefs/no{NNN}.html 靜態原稿 · 不重排版):星星評「價格」不評輸贏 ·
// 每一期賽後賽果自己會說話 —— 這是跟只曬贏的明牌站的分水嶺。
//
// 🔴 出刊流程:① A4 檔丟 public/briefs/no{NNN}.html ② 這裡加一列。
// 🔴 「收掉」舊刊 = 把那列標 hidden: true(檔案仍在 · 收進倉庫不是銷毀 —— 對過帳的
//    刊物永不消失,只是不再擺上架)。 點擊式後台等 DB migration 那一輪再接。
// ─────────────────────────────────────────────────────

export type BriefIssue = {
  /** 期號(三位字串 · 檔名 no{no}.html) */
  no: string;
  /** 賽事日(台北)YYYY-MM-DD */
  date: string;
  /** 排球 / 棒球 / 籃球 / 足球 */
  sport: string;
  /** 對戰(客 @ 主 · 同 A4 報頭) */
  matchup: string;
  /** 特殊刊注記(例:賽後對帳版) */
  note?: string;
  /** 頭版一句(該期的鉤子 · 首頁/指南卡上顯示 · 沒填就只秀對戰)· 出刊時從 A4 的
   *  10 秒看完/大數字句抽一句,≤20 字。 */
  hook?: string;
  /** 頭版海報數字(= 該期 A4 的大數字 · 首頁卡的視覺錨,取代一牆字)· 選填。 */
  bigNum?: string;
  /** 大數字單位(分 / % …)· 跟在 bigNum 後面小字。 選填。 */
  bigNumUnit?: string;
  /** Tim 下架 → 不再示人(檔案不刪) */
  hidden?: boolean;
};

export const BRIEFS: BriefIssue[] = [
  { no: "000", date: "2026-07-06", sport: "足球", matchup: "英格蘭 @ 墨西哥" },
  { no: "001", date: "2026-07-06", sport: "籃球", matchup: "中華台北 @ 中國" },
  { no: "002", date: "2026-07-06", sport: "籃球", matchup: "關島 @ 紐西蘭" },
  { no: "003", date: "2026-07-06", sport: "籃球", matchup: "菲律賓 @ 澳洲" },
  { no: "004", date: "2026-07-06", sport: "籃球", matchup: "日本 @ 南韓" },
  { no: "005", date: "2026-07-06", sport: "籃球", matchup: "首五期 · 賽後對帳版", note: "對帳版" },
  { no: "006", date: "2026-07-07", sport: "棒球", matchup: "響尾蛇 @ 教士" },
  { no: "007", date: "2026-07-07", sport: "棒球", matchup: "藍鳥 @ 巨人" },
  { no: "008", date: "2026-07-07", sport: "籃球", matchup: "風暴 @ 火花" },
  { no: "009", date: "2026-07-07", sport: "棒球", matchup: "阪神虎 @ 讀賣巨人" },
  { no: "010", date: "2026-07-07", sport: "棒球", matchup: "軟銀鷹 @ 歐力士" },
  { no: "011", date: "2026-07-07", sport: "棒球", matchup: "中日龍 @ 橫濱DeNA" },
  { no: "012", date: "2026-07-07", sport: "棒球", matchup: "養樂多 @ 廣島" },
  { no: "013", date: "2026-07-07", sport: "棒球", matchup: "火腿 @ 羅德" },
  { no: "014", date: "2026-07-08", sport: "棒球", matchup: "多倫多藍鳥 @ 舊金山巨人" },
  { no: "015", date: "2026-07-09", sport: "棒球", matchup: "亞歷桑那響尾蛇 @ 聖地牙哥教士" },
  { no: "016", date: "2026-07-09", sport: "棒球", matchup: "科羅拉多落磯 @ 洛杉磯道奇" },
  { no: "017", date: "2026-07-09", sport: "籃球", matchup: "塔拉納基山脈 @ 坎特伯里公羊" },
  { no: "018", date: "2026-07-09", sport: "棒球", matchup: "阪神虎 @ 讀賣巨人" },
  { no: "019", date: "2026-07-09", sport: "排球", matchup: "波蘭 @ 美國" },
  { no: "020", date: "2026-07-09", sport: "棒球", matchup: "中日龍 @ 橫濱海灣之星" },
  { no: "021", date: "2026-07-11", sport: "足球", matchup: "比利時 @ 西班牙" },
  { no: "022", date: "2026-07-10", sport: "籃球", matchup: "威靈頓聖徒 @ 懷伊" },
  { no: "023", date: "2026-07-10", sport: "棒球", matchup: "歐力士猛牛 @ 羅德海洋" },
  { no: "024", date: "2026-07-11", sport: "足球", matchup: "馬卡拉 @ 理工大學競技" },
  { no: "025", date: "2026-07-11", sport: "足球", matchup: "塞伊奈約基 @ 瓦薩" },
  { no: "026", date: "2026-07-11", sport: "籃球", matchup: "芝加哥天空 @ 洛杉磯火花" },
  { no: "027", date: "2026-07-11", sport: "足球", matchup: "富川1995 @ 金泉尚武" },
  { no: "028", date: "2026-07-11", sport: "足球", matchup: "維拉諾瓦 @ 青年人體育會" },
  { no: "029", date: "2026-07-12", sport: "排球", matchup: "捷克 @ 法國",
    bigNum: "4.5", bigNumUnit: "分", hook: "門檻矮 · 只怕被拖進第五局" },
  { no: "030", date: "2026-07-13", sport: "籃球", matchup: "尼爾森巨人 @ 馬納瓦圖噴射機",
    bigNum: "13", bigNumUnit: "分", hook: "上月贏 13 分 · 這桌卻不值得押" },
  { no: "031", date: "2026-07-13", sport: "棒球", matchup: "洛杉磯天使 @ 明尼蘇達雙城",
    bigNum: "53", bigNumUnit: "%", hook: "機器只給主隊 · 市場當它強隊" },
  { no: "032", date: "2026-07-13", sport: "籃球", matchup: "印第安那狂熱 @ 拉斯維加斯王牌",
    bigNum: "48", bigNumUnit: "分", hook: "招牌回歸 · 別買上週沒他的大勝" },
];

/** A4 原版的靜態網址(public/briefs)。 */
export function briefHref(b: BriefIssue): string {
  return `/briefs/no${b.no}.html`;
}

/** 可見期刊 · 新到舊(期號降冪 = 出刊順序)。 */
export function visibleBriefs(): BriefIssue[] {
  return BRIEFS.filter((b) => !b.hidden).sort((a, b) => b.no.localeCompare(a.no));
}

/** 「M/D」短日期(給首頁條 · 過刊列)。 */
export function briefShortDate(b: BriefIssue): string {
  const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(b.date);
  return m ? `${Number(m[1])}/${Number(m[2])}` : b.date;
}
