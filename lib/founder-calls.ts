// ── ZONE 27 · 創辦人跨運動個人鎖定(R238 · Michelin 記分板「人類賽道」)──────────
// Tim(創辦人 · 前運彩分析師)親手賽前鎖定的「個人看法」· 引擎沒覆蓋的運動也能鎖。
// 🔴 這是「人類預測者的公開戰績」(FiveThirtyEight / Tetlock 模式)· 不是引擎算的、
//    也不是「推薦你去押」。 honest 規則跟引擎一模一樣:賽前鎖死、賽後逐場打分、
//    連輸都留、看的是長期校準(不是勝率、不是連勝)。
//
// 🔴 守紅線:① 絕不顯示賠率/盤口/運彩編號(運彩編號只當內部對帳 key · 不 render)
//    ② 絕不「推薦你跟單」措辭 · 框成「Tim 的看法」非明牌 ③ 引擎仍是招牌 · 這是旁邊的
//    人類賽道(視覺/可信度分離)。
//
// curate 方式 = Tim 動嘴、Claude 動手(同 CPBL 親手 curate):Tim 給「賽事 + 看法」→
//    Claude 寫進這支檔 commit(送出那刻 = 公開、改不了的鎖定證明)· 賽後 Tim 給結果 →
//    Claude 標 result(hit/miss/push)· 永不刪(連輸都留)。
// ─────────────────────────────────────────────────────

export type FounderCallResult = "hit" | "miss" | "push";

export type FounderCall = {
  /** 內部對帳 key(Tim 給的運彩編號 · 只用來配對賽果 · 不 render 給訪客) */
  ref: string;
  sport: "足球" | "籃球" | "棒球" | "電競" | "其他";
  /** 「主隊 vs 客隊」 */
  event: string;
  /** Tim 的看法(白話 forecast · 非賠率非「推薦」措辭) */
  read: string;
  /** 賽前鎖定日(台北 · 公開提交時間為實證) */
  lockedAt: string;
  /** 幾成把握(選填 · 之後接校準用) */
  confidence?: number | null;
  /** null = 賽前鎖定中 · 待對帳 */
  result?: FounderCallResult | null;
  /** 對帳日(result 有值才填) */
  settledAt?: string;
};

// 2026-06-15 Tim 第一批親手鎖定(10 手 · 跨足球/籃球/棒球/電競)。
export const FOUNDER_CALLS: FounderCall[] = [
  { ref: "1035", sport: "足球", event: "厄瓜多 vs 象牙海岸", read: "總進球 偏少 · 小於 1.5", lockedAt: "2026-06-15", result: null },
  { ref: "1034", sport: "足球", event: "日本 vs 荷蘭", read: "兩隊都會進球", lockedAt: "2026-06-15", result: null },
  { ref: "1033", sport: "足球", event: "古拉索 vs 德國", read: "總進球 偏多 · 大於 4.5", lockedAt: "2026-06-15", result: null },
  { ref: "319", sport: "籃球", event: "紐約尼克 vs 聖安東尼奧馬刺", read: "首節 馬刺 有贏面", lockedAt: "2026-06-15", result: null },
  { ref: "1032", sport: "足球", event: "土耳其 vs 澳洲", read: "總進球 偏少 · 小於 2.5", lockedAt: "2026-06-15", result: null },
  { ref: "1030", sport: "足球", event: "摩洛哥 vs 巴西", read: "兩隊都會進球", lockedAt: "2026-06-15", result: null },
  { ref: "110", sport: "棒球", event: "聖路易紅雀 vs 明尼蘇達雙城", read: "紅雀 贏面較大", lockedAt: "2026-06-15", result: null },
  { ref: "1016", sport: "足球", event: "巴拉圭 vs 美國", read: "兩隊都會進球", lockedAt: "2026-06-15", result: null },
  { ref: "1015", sport: "足球", event: "波赫 vs 加拿大", read: "總進球 偏少 · 小於 2.5", lockedAt: "2026-06-15", result: null },
  { ref: "3600", sport: "電競", event: "T1 vs HLE", read: "HLE 有贏面", lockedAt: "2026-06-15", result: null },
];

/** 拆「鎖定中(待對帳)」vs「已對帳(含輸)」· 已對帳的新→舊。 */
export function splitFounderCalls(calls: FounderCall[] = FOUNDER_CALLS) {
  const pending = calls.filter((c) => !c.result);
  const settled = calls.filter((c) => c.result);
  const hits = settled.filter((c) => c.result === "hit").length;
  const misses = settled.filter((c) => c.result === "miss").length;
  return { pending, settled, hits, misses, total: calls.length };
}
