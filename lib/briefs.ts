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
  /** 電文呼號(v23 起 · `Z27·[運動][儒略日][當日序]` · 如 Z27·H197A)· 取代訪客面的「NO.序號」門面
   *  (Tim「按順序編號很爛 · 想要類似摩斯密碼的酷編號」)。 沒填的舊刊 graceful 退回 NO.序號。
   *  🔴 序號 `no` 仍是檔名/排序的單一真相,呼號只是門面顯示。 */
  code?: string;
  /** Tim 下架 → 不再示人(檔案不刪) */
  hidden?: boolean;
};

export const BRIEFS: BriefIssue[] = [
  { no: "000", date: "2026-07-06", sport: "足球", matchup: "英格蘭 @ 墨西哥", hidden: true },
  { no: "001", date: "2026-07-06", sport: "籃球", matchup: "中華台北 @ 中國", hidden: true },
  { no: "002", date: "2026-07-06", sport: "籃球", matchup: "關島 @ 紐西蘭" },
  { no: "003", date: "2026-07-06", sport: "籃球", matchup: "菲律賓 @ 澳洲" },
  { no: "004", date: "2026-07-06", sport: "籃球", matchup: "日本 @ 南韓" },
  { no: "005", date: "2026-07-06", sport: "籃球", matchup: "首五期 · 賽後對帳版", note: "對帳版", hidden: true },
  { no: "006", date: "2026-07-07", sport: "棒球", matchup: "響尾蛇 @ 教士", hidden: true },
  { no: "007", date: "2026-07-07", sport: "棒球", matchup: "藍鳥 @ 巨人", hidden: true },
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
  { no: "018", date: "2026-07-09", sport: "棒球", matchup: "阪神虎 @ 讀賣巨人", hidden: true },
  { no: "019", date: "2026-07-09", sport: "排球", matchup: "波蘭 @ 美國" },
  { no: "020", date: "2026-07-09", sport: "棒球", matchup: "中日龍 @ 橫濱海灣之星", hidden: true },
  { no: "021", date: "2026-07-11", sport: "足球", matchup: "比利時 @ 西班牙" },
  { no: "022", date: "2026-07-10", sport: "籃球", matchup: "威靈頓聖徒 @ 懷伊" },
  { no: "023", date: "2026-07-10", sport: "棒球", matchup: "歐力士猛牛 @ 羅德海洋" },
  { no: "024", date: "2026-07-11", sport: "足球", matchup: "馬卡拉 @ 理工大學競技", hidden: true },
  { no: "025", date: "2026-07-11", sport: "足球", matchup: "塞伊奈約基 @ 瓦薩" },
  { no: "026", date: "2026-07-11", sport: "籃球", matchup: "芝加哥天空 @ 洛杉磯火花" },
  { no: "027", date: "2026-07-11", sport: "足球", matchup: "富川1995 @ 金泉尚武" },
  { no: "028", date: "2026-07-11", sport: "足球", matchup: "維拉諾瓦 @ 青年人體育會", hidden: true },
  { no: "029", date: "2026-07-12", sport: "排球", matchup: "捷克 @ 法國",
    bigNum: "4.5", bigNumUnit: "分", hook: "門檻矮 · 只怕被拖進第五局" },
  { no: "030", date: "2026-07-13", sport: "籃球", matchup: "尼爾森巨人 @ 馬納瓦圖噴射機",
    bigNum: "13", bigNumUnit: "分", hook: "上月贏 13 分 · 這桌卻不值得押" },
  { no: "031", date: "2026-07-13", sport: "棒球", matchup: "洛杉磯天使 @ 明尼蘇達雙城",
    bigNum: "53", bigNumUnit: "%", hook: "機器只給主隊 · 市場當它強隊", hidden: true },
  { no: "032", date: "2026-07-13", sport: "籃球", matchup: "印第安那狂熱 @ 拉斯維加斯王牌",
    bigNum: "48", bigNumUnit: "分", hook: "招牌回歸 · 別買上週沒他的大勝", hidden: true },
  { no: "033", date: "2026-07-14", sport: "足球", matchup: "隆德里納 @ 米內羅美洲",
    bigNum: "6", bigNumUnit: "分", hook: "墊底隊拿 6 分 · 主場卻是熱門" },
  { no: "034", date: "2026-07-14", sport: "籃球", matchup: "洛杉磯火花 @ 亞特蘭大美夢",
    bigNum: "22", bigNumUnit: "塊", hook: "賭最明顯那邊 · 押 100 只賺 22" },
  { no: "035", date: "2026-07-14", sport: "足球", matchup: "聖若昂德雷競技 @ 塞阿拉",
    bigNum: "4", bigNumUnit: "敗", hook: "主隊近 5 場輸 4 · 主場卻是熱門" },
  { no: "036", date: "2026-07-14", sport: "棒球", matchup: "福岡軟銀鷹 @ 日本火腿鬥士",
    bigNum: "10", bigNumUnit: "勝1敗", hook: "軟銀整季壓著打 · 好價不在最明顯那格" },
  { no: "037", date: "2026-07-17", sport: "足球", matchup: "溫哥華白浪 @ 芝加哥火焰",
    bigNum: "13", bigNumUnit: "球", hook: "原稿沒提的主場射手 · 全聯盟進球王" },
  { no: "038", date: "2026-07-17", sport: "足球", matchup: "堪薩斯城體育 @ 聖路易城",
    bigNum: "36", bigNumUnit: "失球", hook: "墊底隊丟 36 球 · 便宜的大分早沒了" },
  { no: "039", date: "2026-07-17", sport: "足球", matchup: "多倫多 @ 蒙特婁",
    bigNum: "9", bigNumUnit: "球", hook: "得分王進 9 球 · 卻停賽踢不到" },
  { no: "040", date: "2026-07-15", sport: "足球", matchup: "西班牙 @ 法國",
    bigNum: "39", bigNumUnit: "%", hook: "世界盃四強 · 機器看好客隊西班牙" },
  { no: "041", date: "2026-07-14", sport: "棒球", matchup: "歐力士猛牛 @ 樂天金鷲",
    bigNum: "2.10", bigNumUnit: "防禦率", hook: "墊底隊卻被開成熱門 · 全因今晚這張先發" },
  { no: "042", date: "2026-07-14", sport: "棒球", matchup: "讀賣巨人 @ 養樂多燕子",
    bigNum: "286", bigNumUnit: "天", hook: "王牌傷癒回歸首戰 · 神宮全壘打天堂" },
  { no: "043", date: "2026-07-14", sport: "棒球", matchup: "阪神虎 @ 中日龍",
    bigNum: "2", bigNumUnit: "度完封", hook: "龍頭派王牌作客墊底 · 這桌重點在低分" },
  { no: "044", date: "2026-07-14", sport: "棒球", matchup: "羅德海洋 @ 西武獅",
    bigNum: "0.99", bigNumUnit: "防禦率", hook: "先發防禦率不到 1 · 一分定生死的悶戰" },
  { no: "045", date: "2026-07-15", sport: "足球", matchup: "雷克雅未克體育會 @ 科帕沃古",
    bigNum: "31", bigNumUnit: "失球", hook: "客隊後防漏勺 · 但進球上次都來得晚" },
  { no: "046", date: "2026-07-15", sport: "籃球", matchup: "尼爾森巨人 @ 塔拉納基山脈",
    code: "Z27·H196A", bigNum: "50", bigNumUnit: "分鐘", hook: "客隊兩天前打了雙延長 · 腿還沒回來" },
  { no: "047", date: "2026-07-15", sport: "籃球", matchup: "華盛頓神秘 @ 多倫多節奏",
    code: "Z27·H196B", bigNum: "20.7", bigNumUnit: "分", hook: "頭號得分手傷停 · 猛轟火力打了折" },
  { no: "048", date: "2026-07-15", sport: "棒球", matchup: "福岡軟銀鷹 @ 日本火腿鬥士",
    code: "Z27·B196A", bigNum: "5", bigNumUnit: "次四壞", hook: "制球王對上剛從二軍回來的洋將" },
  { no: "049", date: "2026-07-15", sport: "棒球", matchup: "讀賣巨人 @ 養樂多燕子",
    code: "Z27·B196B", bigNum: "9", bigNumUnit: "勝", hook: "第 3 名的主隊 · 對第 2 名贏很兇" },
  // 🔴 排球 VNL 大阪站 = 中立場地(只有日本是地主)→ matchup 用「vs」不用「@」(客@主不成立)。
  { no: "050", date: "2026-07-15", sport: "排球", matchup: "阿根廷 vs 加拿大",
    code: "Z27·V196A", bigNum: "8", bigNumUnit: "分", hook: "積分比對手高 · 排名卻更低" },
  { no: "051", date: "2026-07-15", sport: "排球", matchup: "古巴 vs 比利時",
    code: "Z27·V196B", bigNum: "89", bigNumUnit: "分", hook: "分數比對手多 · 還是輸了整場" },
  { no: "052", date: "2026-07-15", sport: "棒球", matchup: "阪神虎 @ 中日龍",
    code: "Z27·B196C", bigNum: "6", bigNumUnit: "公尺", hook: "圍牆往內搬了 · 墳場印象被拆掉" },
  { no: "053", date: "2026-07-15", sport: "棒球", matchup: "歐力士猛牛 @ 樂天金鷲",
    code: "Z27·B196D", bigNum: "99", bigNumUnit: "勝", hook: "差一勝滿百 · 但隊友給不了分" },
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

/** 訪客面顯示的編號:v23 起有「電文呼號」用呼號,舊刊 graceful 退回「NO.序號」。 */
export function briefLabel(b: BriefIssue): string {
  return b.code ?? `NO.${b.no}`;
}
