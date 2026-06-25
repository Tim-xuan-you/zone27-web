// ── ZONE 27 · 羽球推演引擎 v0.1(Elo · 純函式)──────────────────────────────
// 方法 = Elo 評等(racket-sport 業界標準 · 同我們的網球引擎)。 羽球室內、無風、無場地差 →
// 比網球更單純:每位球員只要一個「實力分」,對戰時用標準 Elo 邏輯函數算出兩人各自勝率。
// 純函式、deterministic、0 外部依賴 → 站上算出來的數字 = 之後鎖定 script 算的數字,零 drift
//(同棒球 / 足球 / 網球引擎的單一真相紀律)。
//
// 🔴 紅線(這顆引擎跟全站引擎同一套誠實鐵律):
//   · 羽球熱門贏面高,但「沒有神準」這種引擎:全世界最強的賽前模型(連職業盤口)單場命中率
//     大約就是 62-66% —— 跟網球同級、只比棒球(57%)高一點點,不是「超好預測」。 ⚠️ 別被
//     「羽球 87% 準確率」這種數字騙了:那些是「比賽打到一半、看點數差」的場中模型,不是賽前
//     預測,不能當我們的天花板。 賣點永遠是校準:喊 70% 長期就該中 70%,不喊穩贏、不顯盤口、
//     不接受下注。
//   · 球員實力分 = 從「BWF 世界排名 + 近況戰績」種子化的編輯估計(完全等同網球 / 足球的種子
//     分)· 隨真實賽果一場一場更新 · 公開揭露是估計值、不是官方數據。 兩向、無和局(退賽另計、
//     不灌水)。
// ─────────────────────────────────────────────────────

export type BadmintonPlayerRating = {
  /** 實力分 · Elo 風格:~1500 巡迴賽中段、~1900 頂尖十強、~2100 球后 / 球王。
      羽球無場地差 → 單一總分(網球有草地 / 硬地 / 紅土分,羽球不需要)。 */
  overall: number;
};

export type BadmintonPrediction = {
  /** A 球員勝率 0-1 */
  aWin: number;
  /** B 球員勝率 0-1(= 1 − aWin · 羽球兩向、無和局) */
  bWin: number;
};

/** Elo 邏輯函數:A 對 B 的期望勝率(0-1)。 每 400 分 ≈ 勝率差 10 倍(標準 Elo)。 */
export function eloWinProb(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

// 一位球員要算進「可誠實開盤」門檻的最低真實樣本(同棒球 / 足球 / 網球 Elo 誠實鐵律)。
// v0.1 種子分尚未由真實賽果磨厚之前,頁面層誠實標「種子估計值 · 隨戰績更新」。
export const MIN_MATCHES_FOR_RATING = 10;

/** 用兩位球員的實力分算出兩向勝率。 deterministic 純函式(A = 主視角)。 */
export function predictBadminton(
  a: BadmintonPlayerRating,
  b: BadmintonPlayerRating,
): BadmintonPrediction {
  const aWin = eloWinProb(a.overall, b.overall);
  return { aWin, bWin: 1 - aWin };
}

/** 展示用整數百分比(兩向相加恰 100 · 四捨五入 A、B 補滿 → 永不出現 99 或 101)。 */
export function toDisplayPercents(p: BadmintonPrediction): {
  aWin: number;
  bWin: number;
} {
  const a = Math.max(0, Math.min(100, Math.round(p.aWin * 100)));
  return { aWin: a, bWin: 100 - a };
}

/** 引擎看好哪邊(原始機率 argmax · 平手 tie-break 給 A · 單一真相 · 不從展示整數%重算)。 */
export function enginePickOf(p: BadmintonPrediction): "a" | "b" {
  return p.aWin >= p.bWin ? "a" : "b";
}
