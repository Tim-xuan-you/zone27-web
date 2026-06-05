// ── ZONE 27 · 足球推演引擎 v0.1(Dixon-Coles 雙變量 Poisson)──────────
// 棒球那顆引擎是「逐打席模擬一萬次」。 足球不一樣 —— 進球是一個 Poisson 過程,
// 有「閉式解」(closed form)· 所以我們直接「精算」整張比分機率表(0:0、1:0、
// 2:1 … 每一個比分的機率),比用亂數模擬更準、而且每次跑都一模一樣(可重現)。
//
// 方法白話講(站上就這樣寫,不藏):
//   1. 先估兩隊「這場大概各進幾球」(用國際實力分 + 主場優勢)。
//   2. 把每邊的進球當成 Poisson 機率分布,鋪出每一種比分的機率。
//   3. 加一個「Dixon-Coles 修正」,因為純 Poisson 會低估足球的平手與低比分。
//   4. 把所有比分加總成 勝 / 平 / 負 三種結果的機率。
//
// 權威來源:Dixon & Coles (1997),足球預測的學術標準(被引用 500+ 次)。
//   我們不發明數學 —— 我們實作公開的標準方法,再逐場對帳。 跟棒球同一個原則:
//   方法公開、可重現、連輸都掛、不裝神祕。
//
// 🔴 紅線:這顆引擎的天花板跟棒球一樣低(足球進球少、平手多 → 更難預測)。
//   賣點是「誠實校準 + 含輸帳本」,不是「神準」。 任何「我們比莊家準」的話術都禁。
//
// 自我隔離:本檔 0 import、0 外部依賴(純數學),不碰棒球的 Match 模型,
//   方便獨立單元驗證 + 不會弄壞正在運作的棒球產品。
// ─────────────────────────────────────────────────────

export type SoccerScore = {
  home: number;
  away: number;
  /** 此比分的機率 0-1 */
  p: number;
};

export type SoccerPrediction = {
  /** 主隊獲勝機率 0-1 */
  homeWin: number;
  /** 平手機率 0-1 */
  draw: number;
  /** 客隊獲勝機率 0-1 */
  awayWin: number;
  /** 主隊預期進球(λ) */
  xgHome: number;
  /** 客隊預期進球(λ) */
  xgAway: number;
  /** 最可能的幾個終場比分(機率高 → 低,取前 5) */
  topScores: SoccerScore[];
};

export type SoccerEngineParams = {
  /** 主場優勢(以實力分計;中立球場傳 0)。 預設 60。 */
  homeAdvantage?: number;
  /** 本賽事每場平均總進球(世界盃 ≈ 2.6;高分聯賽可調高)。 預設 2.6。 */
  avgTotalGoals?: number;
  /** Dixon-Coles 低比分相依修正 ρ(典型 −0.03 ~ −0.13)。 預設 −0.08。 */
  rho?: number;
  /** 比分表計算上限(每邊 0..maxGoals;再高的機率可忽略)。 預設 8。 */
  maxGoals?: number;
  /** 實力分差 → 預期進球差 的換算(每 100 分 ≈ 0.45 球)。 預設 0.0045。 */
  supremacyPerRating?: number;
};

const DEFAULTS: Required<SoccerEngineParams> = {
  homeAdvantage: 60,
  avgTotalGoals: 2.6,
  rho: -0.08,
  maxGoals: 8,
  supremacyPerRating: 0.0045,
};

function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

/** Poisson 機率質量函數 P(X = k | λ)。 */
function poisson(lambda: number, k: number): number {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

/** Dixon-Coles 低比分相依修正 τ(只動 0/1 球那四格,修純 Poisson 對平手的低估)。 */
function dcTau(
  x: number,
  y: number,
  lambdaHome: number,
  lambdaAway: number,
  rho: number,
): number {
  if (x === 0 && y === 0) return 1 - lambdaHome * lambdaAway * rho;
  if (x === 0 && y === 1) return 1 + lambdaHome * rho;
  if (x === 1 && y === 0) return 1 + lambdaAway * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

/**
 * 用兩隊「國際實力分」算出 勝 / 平 / 負 機率 + 預期進球 + 最可能比分。
 * rating 越高越強(國際 Elo 風格:~1500 平庸、~2100 頂尖)。
 *
 * 純函式、deterministic:同樣輸入永遠同樣輸出(可重現 = 品牌證據層)。
 */
export function predictSoccer(
  ratingHome: number,
  ratingAway: number,
  params: SoccerEngineParams = {},
): SoccerPrediction {
  const { homeAdvantage, avgTotalGoals, rho, maxGoals, supremacyPerRating } = {
    ...DEFAULTS,
    ...params,
  };

  // 實力分差(含主場)→ 預期進球差(supremacy)。
  const adjDiff = ratingHome - ratingAway + homeAdvantage;
  const supremacy = adjDiff * supremacyPerRating;
  // 把「平均總進球」依 supremacy 拆成兩邊的預期進球 λ(下限 0.15 防止為 0/負)。
  const xgHome = Math.max(0.15, avgTotalGoals / 2 + supremacy / 2);
  const xgAway = Math.max(0.15, avgTotalGoals / 2 - supremacy / 2);

  // 鋪出整張比分機率表,順手加總成 勝/平/負。
  let pHome = 0;
  let pDraw = 0;
  let pAway = 0;
  let total = 0;
  const grid: SoccerScore[] = [];
  for (let x = 0; x <= maxGoals; x++) {
    for (let y = 0; y <= maxGoals; y++) {
      const p =
        poisson(xgHome, x) * poisson(xgAway, y) * dcTau(x, y, xgHome, xgAway, rho);
      grid.push({ home: x, away: y, p });
      total += p;
      if (x > y) pHome += p;
      else if (x === y) pDraw += p;
      else pAway += p;
    }
  }

  // Dixon-Coles 的 τ 修正會讓總和略偏離 1 → 正規化,讓三個機率精準加總為 1。
  const norm = total > 0 ? total : 1;
  const topScores = grid
    .map((g) => ({ home: g.home, away: g.away, p: g.p / norm }))
    .sort((a, b) => b.p - a.p)
    .slice(0, 5);

  return {
    homeWin: pHome / norm,
    draw: pDraw / norm,
    awayWin: pAway / norm,
    xgHome,
    xgAway,
    topScores,
  };
}

/**
 * 把預測轉成「四捨五入到整數百分比、且三者相加恰為 100」的展示用數字。
 * (最大餘數法 · 避免「48 + 31 + 22 = 101」這種顯示瑕疵。)
 */
export function toDisplayPercents(pred: SoccerPrediction): {
  homeWin: number;
  draw: number;
  awayWin: number;
} {
  const raw = [
    { k: "homeWin" as const, v: pred.homeWin * 100 },
    { k: "draw" as const, v: pred.draw * 100 },
    { k: "awayWin" as const, v: pred.awayWin * 100 },
  ];
  const floored = raw.map((r) => ({ ...r, f: Math.floor(r.v), rem: r.v - Math.floor(r.v) }));
  let remainder = 100 - floored.reduce((s, r) => s + r.f, 0);
  // 餘數分給小數部分最大的那幾個
  floored
    .slice()
    .sort((a, b) => b.rem - a.rem)
    .forEach((r) => {
      if (remainder > 0) {
        r.f += 1;
        remainder -= 1;
      }
    });
  const out = { homeWin: 0, draw: 0, awayWin: 0 };
  for (const r of floored) out[r.k] = r.f;
  return out;
}
