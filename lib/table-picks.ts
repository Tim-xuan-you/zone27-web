// ── ZONE 27 · 今晚這桌 · 誠實收據(會員賽前公開鎖的「任意一注」)──────────────────
// 緣起(2026-06-20 · Tim + 朋友 Ron/Lewi 真的在賭世界盃/MLB 的角球、總分、讓分、BTTS)。
// 真正的賭徒不只賭「誰贏」· 他們賭角球大小、兩隊都得分、讓分、總分 —— 而我們的引擎**有些盤
// 根本沒有模型**(例如角球:Dixon-Coles 建模進球、不建模角球)。
//
// 🔴 本檔的靈魂 = 米其林式克制:對「沒有模型」的盤,大聲說「沒有」,然後**照樣鎖下、賽後
//    誠實對帳**,連輸的都留著、不挑好的講。 賣明牌的站對什麼都裝懂;我們敢承認自己不懂哪些 ——
//    那份克制就是信任護城河。 過那把尺:會刪輸單的老師,絕不可能採用「連自己沒把握的那注都
//    鎖下、賽後攤開」。 不對勁 → 所以正是該做的。
// 🔴 誠實邊界(R 修):這是 Tim 手記的桌、名字目前只是標籤(還沒接永久碼 /u),所以站上文案
//    不講「掛你名下 · 刪不掉」(那是引擎自己 graded 帳本才扛得住的話)· 只講真的:「連輸的都
//    留著」+ 出處攤開(Tim 手記)。 之後接永久碼連 /u 時,再升級成可查證的個人帳本。
//
// MVP 紀律:
//   · engineModels = 引擎是否真的對「這個盤」有模型(進球/勝負/總分/讓分/BTTS = 有 · 角球 = 無)。
//     🔴 不捏造機率數字:有模型的標「引擎有模型」、無模型的標「無模型 · 只對帳」· 真實 % 待接活引擎。
//   · result = 賽後對帳(pending 待對帳 / win 命中 / lose 落空 / push 退注 / void 取消)· Tim curate,
//     同 CPBL 賽果手抄紀律(賽後比分一進來就誠實標、改不了)。
//   · 站上不指名運彩平台、不顯運彩編號、不掛賠率(守品牌:我們不是賭場、不接受下注 · 這是「公開
//     鎖的判斷 + 誠實對帳」,不是明牌牌咖)。
//   · 之後接真帳號永久碼 → 每個名字連 /u 公開含輸校準檔(「點名字看他到底準不準」)。
// ─────────────────────────────────────────────────────

export type CallResult = "pending" | "win" | "lose" | "push" | "void";

export type TableCall = {
  /** 公開署名(顯示名)· MVP 先純標籤 · 之後接永久碼連 /u */
  handle: string;
  /** 聯盟顯示標籤(世界盃 / 美國職棒 …) */
  league: string;
  /** 對戰(客 vs 主 · 不含運彩編號) */
  match: string;
  /** 鎖的那一注(白話 · 例:角球 大 8.5 / 兩隊都得分 · 是 / 響尾蛇 -1.5) */
  call: string;
  /** 引擎對「這個盤」是否有模型 · true=有看法 · false=無模型只對帳(誠實的沉默) */
  engineModels: boolean;
  /** 無模型時的一句誠實註腳(為什麼引擎閉嘴) */
  engineNote?: string;
  /** 賽後對帳的依據(秀做法:幾顆角球、幾分、誰進球 → 為什麼中/落空) */
  resultNote?: string;
  /** 賽後對帳 · 預設 pending(待對帳) */
  result: CallResult;
};

// 真實的桌(Tim 賽前轉述 · 賽後對帳)。 新增一注就往這裡加;賽果出來就改 result。
// 🔴 角球(角球大小)= 唯一「無模型」的盤 —— 那正是這張桌想證明的克制。
const TABLE: TableCall[] = [
  // ── 2026-06-21 這一桌(今晚 · 賽前鎖)· Tim/Ron/Lewi 報的注 · 賽後逐筆對帳 ──
  {
    handle: "Tim",
    league: "美國職棒",
    match: "大都會 vs 費城人",
    call: "費城人 不讓分（勝）",
    engineModels: true,
    result: "pending",
  },
  {
    handle: "Ron",
    league: "美國職棒",
    match: "大都會 vs 費城人",
    call: "總分 小 7.5",
    engineModels: true,
    result: "pending",
  },
  {
    handle: "Lewi",
    league: "世界盃",
    match: "埃及 vs 紐西蘭",
    call: "埃及 不讓分（勝）",
    engineModels: true,
    result: "pending",
  },
  {
    handle: "Lewi",
    league: "世界盃",
    match: "伊朗 vs 比利時",
    call: "總分 大 2.5",
    engineModels: true,
    result: "pending",
  },
  // ── 2026-06-20 起這一桌 ──────────────────────────────
  {
    handle: "Tim",
    league: "世界盃",
    match: "日本 vs 突尼西亞",
    call: "角球 大 8.5",
    engineModels: false,
    engineNote: "角球不在進球模型內 · 引擎不裝懂",
    resultNote: "角球 8 顆(日本 5 + 突尼西亞 3)· 不到 8.5 → 落空",
    result: "lose",
  },
  {
    handle: "Ron",
    league: "世界盃",
    match: "瑞典 vs 荷蘭",
    call: "兩隊都得分 · 是",
    engineModels: true,
    resultNote: "荷蘭 5:1 瑞典 · 兩隊都進球 → 命中",
    result: "win",
  },
  {
    handle: "Lewi",
    league: "美國職棒",
    match: "天使 vs 運動家",
    call: "運動家 不讓分（勝）",
    engineModels: true,
    resultNote: "天使 7:0 運動家 · 運動家被完封 → 落空",
    result: "lose",
  },
  {
    handle: "Tim",
    league: "美國職棒",
    match: "雙城 vs 響尾蛇",
    call: "總分 大 8.5",
    engineModels: true,
    resultNote: "兩隊合計 14 分 · 過 8.5 → 命中",
    result: "win",
  },
  {
    handle: "Ron",
    league: "美國職棒",
    match: "雙城 vs 響尾蛇",
    call: "響尾蛇 −1.5（讓分）",
    engineModels: true,
    resultNote: "響尾蛇贏 4 分 · 過 1.5 → 命中",
    result: "win",
  },
  {
    handle: "Lewi",
    league: "世界盃",
    match: "海地 vs 巴西",
    call: "角球 大 9.5",
    engineModels: false,
    engineNote: "角球不在進球模型內 · 引擎不裝懂",
    resultNote: "角球 8 顆(海地 4 + 巴西 4)· 不到 9.5 → 落空",
    result: "lose",
  },
  {
    handle: "Tim",
    league: "世界盃",
    match: "澳洲 vs 美國",
    call: "總分 大 2.5",
    engineModels: true,
    resultNote: "全場 2 分 · 不到 2.5 → 落空",
    result: "lose",
  },
  {
    handle: "Ron",
    league: "世界盃",
    match: "澳洲 vs 美國",
    call: "兩隊都得分 · 是",
    engineModels: true,
    resultNote: "只有美國進球 · 非兩隊都進 → 落空",
    result: "lose",
  },
];

export type TableSummary = {
  calls: TableCall[];
  total: number;
  pending: number;
  settled: number;
  win: number; // 命中幾注
  lose: number; // 落空幾注(贏輸都掛 · 落空照亮)
  noModel: number; // 「無模型 · 只對帳」幾注(誠實克制的計數)
  faces: string[]; // 不重複的人(給首頁頭像列 · 最多幾顆由 consumer 決定)
};

/** 取整桌 + 計數(graceful · 空桌也回得了)。 待對帳排前(這桌的「現在進行式」),已對帳排後。 */
export function getTableCalls(): TableSummary {
  const order: Record<CallResult, number> = {
    pending: 0,
    win: 1,
    lose: 1,
    push: 1,
    void: 2,
  };
  const calls = [...TABLE].sort((a, b) => order[a.result] - order[b.result]);
  const faces: string[] = [];
  for (const c of TABLE) if (!faces.includes(c.handle)) faces.push(c.handle);
  return {
    calls,
    total: TABLE.length,
    pending: TABLE.filter((c) => c.result === "pending").length,
    settled: TABLE.filter((c) => c.result === "win" || c.result === "lose" || c.result === "push").length,
    win: TABLE.filter((c) => c.result === "win").length,
    lose: TABLE.filter((c) => c.result === "lose").length,
    noModel: TABLE.filter((c) => !c.engineModels).length,
    faces,
  };
}
