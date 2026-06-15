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

// 🔴🔴 命門鐵律(R238 學到的最貴一課 · 永遠別違反):
//   只放「在 ZONE 27、開賽『前』」鎖的手 —— commit 時間戳就是『賽前』的公開證明。
//   **絕對不准 back-date**(事後把已經比完的場填進來、標成「賽前鎖定」)。 那是明牌老師
//   「我早就說了!」的詐術,而且 commit 時間在賽後、任何人一比對就拆穿 → 整個記分板的
//   「賽前鎖定」承諾當場自爆、後面每一筆真的也被懷疑。
//   2026-06-15 Tim 給的第一批 10 手 = 他『在別處、賽前』推薦但「已經比完」的舊單 →
//   我們無法在這裡證明賽前鎖定 → 移除(這不是刪輸單;它們從來沒在這裡被合法鎖過)。
//   從 0 乾淨開始:只收 Tim 「現在、開賽前」給的手,當場 commit 鎖死。
export const FOUNDER_CALLS: FounderCall[] = [];

/** 拆「鎖定中(待對帳)」vs「已對帳(含輸)」· 已對帳的新→舊。 */
export function splitFounderCalls(calls: FounderCall[] = FOUNDER_CALLS) {
  const pending = calls.filter((c) => !c.result);
  const settled = calls.filter((c) => c.result);
  const hits = settled.filter((c) => c.result === "hit").length;
  const misses = settled.filter((c) => c.result === "miss").length;
  return { pending, settled, hits, misses, total: calls.length };
}
