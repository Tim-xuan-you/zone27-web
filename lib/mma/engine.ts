// ── ZONE 27 · UFC / MMA 推演引擎 v0.1(Elo · 純函式)────────────────────────────
// 方法 = Elo 評等(同我們的網球 / 羽球引擎),但 MMA 的單場變異遠大於球拍運動 —— 一拳 KO、
// 一個失誤、一次抱摔就翻盤。 所以曲線刻意「壓平」:標準 Elo 用 /400(大實力差會喊到 97%),
// 我們用 /700,讓再大的實力差也不喊超過 ~90%。 這不是把引擎調弱,是誠實:MMA 連 -400~-900 的
// 重磅大熱門,實際也只贏 88-93%(沒有「穩贏」這種事)。 壓平的曲線把「MMA 是帶傾向的銅板」這個
// 事實寫進數學本身 —— 同棒球 / 足球 / 網球 / 羽球引擎的單一真相紀律(純函式、deterministic、零 drift)。
//
// 🔴 紅線(這顆引擎跟全站引擎同一套誠實鐵律):
//   · 沒有神準。 全世界最強的賽前預測 = 盤口本身,單場命中率大約就 ~65%;最好的學術模型也卡在
//     60-66%,跟「無腦押大熱門」(~65-70%)幾乎一樣。 ⚠️ 網路上「UFC AI 準 80-89%」的數字
//     全是資料洩漏 / 訓練集準度 / 場中模型(打到第三回合看即時數據),不是賽前預測,絕不當天花板。
//     我們公開的誠實天花板 ≈ 63%(區間 62-66%)。 每 3 個大熱門就有 1 個會輸 —— 賣的是校準,不是鐵口。
//   · 「兩向、無和局」是**預測**面(我們只預測誰贏、不預測怎麼贏:KO / 降伏 / 判定不是我們的商品)。
//     但 MMA 真的會有和局 / 無效比賽(eye poke、誤犯規、判定平手 —— 罕見但存在,不像網球永遠分勝負)
//     → **結算**面必須能吞和局、不硬判一邊贏(在 matches 層處理 · 同足球三向結算的直覺)。
//   · 實力分 = 從公開戰績 + FightMatrix 風格 Elo 種子化的編輯估計(同網球 / 羽球種子分)· 認不出 /
//     資料太薄(新人) / 久未出賽(手感生鏽看不到) / 臨時換對手 → 不硬開盤(誠實「算不出」)。
//     這條米其林克制在 MMA 比任何運動都重要:Fight Night 卡上一堆是我們認不出的區域選手。
// ─────────────────────────────────────────────────────

export type MmaFighterRating = {
  /** 實力分 · Elo 風格(只有「差距」有意義,絕對值不重要)· 見 rating.ts 錨點。 */
  overall: number;
};

export type MmaPrediction = {
  /** A 角(主視角)勝率 0-1 */
  aWin: number;
  /** B 角勝率 0-1(= 1 − aWin · 預測面兩向無和局) */
  bWin: number;
};

// 🔴 MMA 變異大 → 壓平曲線:標準 Elo /400 改 /700。 對齊重磅熱門的真實上限(-400~-900 只贏 88-93%):
//    300 分差 ≈ 73%、450 分差 ≈ 81%、600 分差 ≈ 88%、800 分差 ≈ 93%(自然封頂,不需硬 clamp、不喊穩贏)。
export const MMA_ELO_DIVISOR = 700;

/** Elo 邏輯函數(MMA 壓平版):A 對 B 的期望勝率 0-1。 deterministic 純函式。 */
export function eloWinProb(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / MMA_ELO_DIVISOR));
}

// 一位選手要算進「可誠實開盤」門檻的最低真實樣本(同棒球 / 足球 / 網球 / 羽球 Elo 誠實鐵律)。
// MMA 資料薄、臨時換人多 → 這條 gate 比別運動更常觸發,觸發就誠實「算不出」,不灌水。
export const MIN_FIGHTS_FOR_RATING = 3;

/** 用兩位選手的實力分算兩向勝率。 deterministic 純函式(A = 主視角)。 */
export function predictFight(a: MmaFighterRating, b: MmaFighterRating): MmaPrediction {
  const aWin = eloWinProb(a.overall, b.overall);
  return { aWin, bWin: 1 - aWin };
}

/** 展示用整數百分比(兩向相加恰 100 · 四捨五入 A、B 補滿 → 永不出現 99 或 101)。 */
export function toDisplayPercents(p: MmaPrediction): { aWin: number; bWin: number } {
  const a = Math.max(0, Math.min(100, Math.round(p.aWin * 100)));
  return { aWin: a, bWin: 100 - a };
}

/** 引擎看好哪邊(原始機率 argmax · 平手 tie-break 給 A · 單一真相 · 不從展示整數%重算)。 */
export function enginePickOf(p: MmaPrediction): "a" | "b" {
  return p.aWin >= p.bWin ? "a" : "b";
}
