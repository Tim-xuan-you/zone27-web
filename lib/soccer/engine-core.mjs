// ── ZONE 27 · 足球推演引擎 v0.1 核心數學(共用純 JS · 站上 .ts 與 Node 賽前鎖定 script 同源)──
// 為什麼是 .mjs 而不是 .ts:賽前鎖定 script(scripts/lock-soccer-predictions.mjs)跑在
// GitHub Action 的純 Node 裡,不能 import .ts。 若 script 自己「另抄一份」引擎公式,站上
// 顯示的數字跟鎖進 JSON 的數字就會 drift → 「你 vs 引擎」對帳變不誠實(品牌命門)。
// 解法:把純數學抽成這支 .mjs,站上的 engine.ts 與 script 都 import 它 = 同一份、零 drift。
//
// 方法 = Dixon-Coles 雙變量 Poisson(Dixon & Coles 1997 · 足球預測學術標準)。 進球是
// Poisson 過程、有閉式解 → 直接精算整張比分機率表(可重現,比亂數模擬更準),加 DC 低比分
// 修正(純 Poisson 低估足球平手)→ 勝 / 平 / 負。 純函式、0 外部依賴。
// ─────────────────────────────────────────────────────

/**
 * @typedef {Object} SoccerScore
 * @property {number} home
 * @property {number} away
 * @property {number} p  此比分的機率 0-1
 */

/**
 * @typedef {Object} SoccerPrediction
 * @property {number} homeWin  主隊獲勝機率 0-1
 * @property {number} draw     平手機率 0-1
 * @property {number} awayWin  客隊獲勝機率 0-1
 * @property {number} xgHome   主隊預期進球(λ)
 * @property {number} xgAway   客隊預期進球(λ)
 * @property {SoccerScore[]} topScores  最可能的前 5 個終場比分
 */

/**
 * @typedef {Object} SoccerEngineParams
 * @property {number} [homeAdvantage]      主場優勢(以實力分計;中立球場 0)。 預設 60。
 * @property {number} [avgTotalGoals]      本賽事每場平均總進球。 預設 2.6。
 * @property {number} [rho]                Dixon-Coles 低比分相依修正 ρ。 預設 −0.08。
 * @property {number} [maxGoals]           比分表計算上限(每邊 0..maxGoals)。 預設 8。
 * @property {number} [supremacyPerRating] 實力分差 → 預期進球差 的換算。 預設 0.0045。
 */

/** @type {Required<SoccerEngineParams>} */
const DEFAULTS = {
  homeAdvantage: 60,
  avgTotalGoals: 2.6,
  rho: -0.08,
  maxGoals: 8,
  supremacyPerRating: 0.0045,
};

/** @param {number} n */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

/** Poisson 機率質量函數 P(X = k | λ)。 @param {number} lambda @param {number} k */
function poisson(lambda, k) {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

/** Dixon-Coles 低比分相依修正 τ(只動 0/1 球那四格)。
 * @param {number} x @param {number} y @param {number} lambdaHome @param {number} lambdaAway @param {number} rho */
function dcTau(x, y, lambdaHome, lambdaAway, rho) {
  if (x === 0 && y === 0) return 1 - lambdaHome * lambdaAway * rho;
  if (x === 0 && y === 1) return 1 + lambdaHome * rho;
  if (x === 1 && y === 0) return 1 + lambdaAway * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

/**
 * 用兩隊「國際實力分」算出 勝 / 平 / 負 機率 + 預期進球 + 最可能比分。
 * 純函式、deterministic:同樣輸入永遠同樣輸出(可重現 = 品牌證據層)。
 * @param {number} ratingHome
 * @param {number} ratingAway
 * @param {SoccerEngineParams} [params]
 * @returns {SoccerPrediction}
 */
export function predictSoccer(ratingHome, ratingAway, params = {}) {
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
  return gridFromLambda(xgHome, xgAway, rho, maxGoals);
}

/**
 * 引擎核心:給定兩邊預期進球 λ → 鋪整張比分機率表 → 勝/平/負 + 預期進球 + 最可能比分。
 * predictSoccer(實力分→λ · 國家隊用)與 predictFromGoals(攻防→λ · 俱樂部用)共用這段
 * (同一套 Dixon-Coles 數學 · 零 drift)。
 * @param {number} xgHome @param {number} xgAway @param {number} rho @param {number} maxGoals
 * @returns {SoccerPrediction}
 */
function gridFromLambda(xgHome, xgAway, rho, maxGoals) {
  // 鋪出整張比分機率表,順手加總成 勝/平/負。
  let pHome = 0;
  let pDraw = 0;
  let pAway = 0;
  let total = 0;
  /** @type {SoccerScore[]} */
  const grid = [];
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
 * 直接用兩邊預期進球 λ 開盤(俱樂部攻防模型用:λ 由各隊攻擊力 × 對手防守力算出,
 * 進球總數會隨對戰變 → 強攻弱守開大比分/大勝率、龜縮對龜縮開低比分,告別「每場都 ~40%/1-1」)。
 * λ 下限 0.15(同 predictSoccer)。
 * @param {number} xgHome @param {number} xgAway @param {SoccerEngineParams} [params]
 * @returns {SoccerPrediction}
 */
export function predictFromGoals(xgHome, xgAway, params = {}) {
  const { rho, maxGoals } = { ...DEFAULTS, ...params };
  return gridFromLambda(Math.max(0.15, xgHome), Math.max(0.15, xgAway), rho, maxGoals);
}

/**
 * 把預測轉成「四捨五入到整數百分比、且三者相加恰為 100」的展示用數字(最大餘數法)。
 * @param {SoccerPrediction} pred
 * @returns {{ homeWin: number, draw: number, awayWin: number }}
 */
export function toDisplayPercents(pred) {
  const raw = [
    { k: "homeWin", v: pred.homeWin * 100 },
    { k: "draw", v: pred.draw * 100 },
    { k: "awayWin", v: pred.awayWin * 100 },
  ];
  const floored = raw.map((r) => ({ ...r, f: Math.floor(r.v), rem: r.v - Math.floor(r.v) }));
  let remainder = 100 - floored.reduce((s, r) => s + r.f, 0);
  floored
    .slice()
    .sort((a, b) => b.rem - a.rem)
    .forEach((r) => {
      if (remainder > 0) {
        r.f += 1;
        remainder -= 1;
      }
    });
  /** @type {{ homeWin: number, draw: number, awayWin: number }} */
  const out = { homeWin: 0, draw: 0, awayWin: 0 };
  for (const r of floored) out[/** @type {"homeWin"|"draw"|"awayWin"} */ (r.k)] = r.f;
  return out;
}
