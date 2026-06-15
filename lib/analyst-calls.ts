// ── ZONE 27 · 分析師跨運動賽前鎖定(R239 · 單一創辦人帳本 → 3 位平權分析師)──────────
// 把原本「只有 Tim(創辦人/版主)」的人類賽道,改成 3 位平起平坐的分析師。
// 🔴 沒有版主、沒有老大、沒有「站長報明牌」· 大家一樣 · 不一定每天發(零每日壓力)。
//
// honest 規則跟引擎一模一樣(這是護城河 · 別動):
//   · 賽前鎖死(commit 時間戳 = 開賽『前』的公開鐵證)· 賽後逐場打分 · 連輸都留 · 看長期校準。
//   · 🔴🔴 絕不 back-date(事後把比完的場填進來標「賽前鎖定」= 明牌老師詐術 · commit 時間一比就拆穿)。
//   · 絕不顯示賠率/盤口/運彩編號(ref 只當內部對帳 key · 不 render)· 絕不寫「推薦你跟單」措辭 ·
//     框成「某位分析師的看法」非明牌 · 引擎仍是招牌,這是旁邊的「人類賽道」(視覺/可信度分離)。
//
// curate = 分析師動嘴、Claude 動手:某位「開賽前」給「賽事 + 看法」→ Claude 寫進這支檔
//   commit(送出那刻 = 公開、改不了的鎖定證明)· 賽後給結果 → 標 result · 永不刪(連輸都留)。
// 0 DB / 0 migration / 0 帳號(commit-curated · 分析師不需要各自有 ZONE 27 帳號)。
//
// 想加 / 減分析師 → 改 ANALYSTS;想換顯示名(壓力大就把 Tim 換成別的名字)→ 改 name 一字即可。
// ─────────────────────────────────────────────────────

export type AnalystId = "tim" | "ron" | "lewi";

export type Analyst = { id: AnalystId; name: string };

// 🔴 3 位平權分析師 · 陣列順序不代表名次(大家一樣)。 改名只改 name。
export const ANALYSTS: Analyst[] = [
  { id: "tim", name: "Tim" },
  { id: "ron", name: "Ron" },
  { id: "lewi", name: "Lewi" },
];

export type AnalystCallResult = "hit" | "miss" | "push";

export type AnalystCall = {
  /** 哪位分析師鎖的(平權 · 無版主) */
  analyst: AnalystId;
  /** 內部對帳 key(運彩編號 · 只用來配對賽果 · 不 render 給訪客) */
  ref: string;
  sport: "足球" | "籃球" | "棒球" | "電競" | "其他";
  /** 「主隊 vs 客隊」 */
  event: string;
  /** 看法(白話 forecast · 非賠率非「推薦」措辭) */
  read: string;
  /** 賽前鎖定日(台北 · 公開提交時間為實證) */
  lockedAt: string;
  /** 幾成把握(選填 · 之後接校準用) */
  confidence?: number | null;
  /** null = 賽前鎖定中 · 待對帳 */
  result?: AnalystCallResult | null;
  /** 對帳日(result 有值才填) */
  settledAt?: string;
};

// 🔴 從 0 乾淨開始:只收「現在、開賽前」鎖的手,當場 commit。 別 back-date(見上方命門鐵律)。
export const ANALYST_CALLS: AnalystCall[] = [];

export type AnalystRecord = {
  analyst: Analyst;
  pending: AnalystCall[];
  /** 已對帳(commit 順序;最早收的在前) */
  settled: AnalystCall[];
  hits: number;
  misses: number;
  total: number;
};

/** 按分析師分組(全 3 位都回 · 沒鎖手的 total=0)。 */
export function analystRecords(
  calls: AnalystCall[] = ANALYST_CALLS,
): AnalystRecord[] {
  return ANALYSTS.map((analyst) => {
    const mine = calls.filter((c) => c.analyst === analyst.id);
    const pending = mine.filter((c) => !c.result);
    const settled = mine.filter((c) => c.result);
    return {
      analyst,
      pending,
      settled,
      hits: settled.filter((c) => c.result === "hit").length,
      misses: settled.filter((c) => c.result === "miss").length,
      total: mine.length,
    };
  });
}

/** 全體合計(panel 用)。 */
export function analystTotals(calls: AnalystCall[] = ANALYST_CALLS) {
  const settled = calls.filter((c) => c.result);
  return {
    total: calls.length,
    pending: calls.filter((c) => !c.result).length,
    hits: settled.filter((c) => c.result === "hit").length,
    misses: settled.filter((c) => c.result === "miss").length,
  };
}
