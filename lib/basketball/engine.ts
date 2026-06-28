// ── ZONE 27 · 籃球推演引擎 v0.1(效率模型 · 純函式 · 刻意不是 Elo)──────────────────
// Tim 2026-06-28「哪個運動有非-Elo 的權威引擎?」的答案 = 籃球。 理由:籃球一場 ~100 個回合,
// 勝負是「分差」磨出來的 → 看「每場淨得分(效率)」的模型,真的比只看勝負的 Elo 準(連 538
// 算籃球都加分差)。 所以籃球跟棒球(逐打席)、足球(進球卜瓦松)並列「真·非-Elo 深引擎」。
//
// 方法(白話):每隊一個「淨得分」= 平均每場贏/輸對手幾分(對上聯盟平均)。 兩隊對戰:
//   預期分差 = 主隊淨得分 − 客隊淨得分 + 主場優勢 → 用單場分差的常態分布換算成勝率。
//   單場分差標準差 ~11 分(WNBA/NBA 實證)· 用 logistic 近似常態 CDF(1.702 係數 → 尺度 ~6.5)。
//
// 🔴 紅線(同全站引擎誠實鐵律):
//   · 籃球比棒球好預測(回合多→變異小→強隊穩贏 ~68%),但**沒有神準** —— 一場照樣翻盤。 賣校準不喊穩贏。
//   · 隊伍淨得分 = 從真實賽季得失分種子化的**估計值**(同其他運動種子分)· 隨真實賽果更新 · 公開揭露非官方。
//   · 認不出/查不到隊伍數據 → 不硬開(誠實「算不出」· 同羽球/MMA 克制)。 純函式 deterministic 0 依賴(零 drift)。
// ─────────────────────────────────────────────────────

export type BasketballPick = "home" | "away";

export type BasketballPrediction = {
  /** 主隊勝率 0-1 */
  homeWin: number;
  /** 客隊勝率 0-1(= 1 − homeWin · 籃球無和局) */
  awayWin: number;
};

// WNBA 主場優勢 ~2.5 分(NBA 約 2.5-3 · 近年縮小)· 公開揭露是估計、隨賽果校正。
export const HOME_COURT_ADV = 2.5;

// 單場分差 SD ~11 分 → logistic 尺度 = SD / 1.702 ≈ 6.5(1.702 = logistic 近似標準常態 CDF 的係數)。
// 把「分差→勝率」綁在真實單場變異上 = 不會因為淨得分差一點就喊到 90%(籃球單場本來就會翻)。
export const MARGIN_SCALE = 6.5;

/** 兩隊淨得分 → 主隊預期分差(含主場優勢)。 deterministic 純函式。 */
export function expectedMargin(homeNet: number, awayNet: number): number {
  return homeNet - awayNet + HOME_COURT_ADV;
}

/** 兩隊淨得分 → 兩向勝率(效率模型 · 非 Elo)。 deterministic 純函式(主視角)。 */
export function predictBasketball(
  homeNet: number,
  awayNet: number,
): BasketballPrediction {
  const margin = expectedMargin(homeNet, awayNet);
  const homeWin = 1 / (1 + Math.exp(-margin / MARGIN_SCALE));
  return { homeWin, awayWin: 1 - homeWin };
}

/** 展示用整數百分比(兩向相加恰 100 · 四捨五入主隊、客隊補滿 → 永不出現 99 或 101)。 */
export function toDisplayPercents(p: BasketballPrediction): {
  homeWin: number;
  awayWin: number;
} {
  const h = Math.max(0, Math.min(100, Math.round(p.homeWin * 100)));
  return { homeWin: h, awayWin: 100 - h };
}

/** 引擎看好哪邊(原始機率 argmax · 平手 tie-break 給主隊 · 單一真相 · 不從展示整數%重算)。 */
export function enginePickOf(p: BasketballPrediction): BasketballPick {
  return p.homeWin >= p.awayWin ? "home" : "away";
}
