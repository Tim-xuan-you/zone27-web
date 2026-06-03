// ── ZONE 27 · 引擎信心溫度(Engine Conviction）─────────────
// 2026-06-04 · Polymarket 方向行銷-設計 move(Tim「Polymarket, go」)。
// 每場給一個「引擎有多敢」的溫度:勢均力敵 / 看好 / 重壓。
//
// 設計 insight(breakthrough · 心理學 per [[feedback-zone27-psychology-ux-axis]]):
//   Polymarket 最被盯著看的市場 = 接近 50/50 那種 —— 不確定性 = 最大張力 = 最多人看。
//   別的明牌站「藏不確定 / 裝鐵口神準」;ZONE 27 反過來把「連我們引擎都難分」當賣點 surface。
//   同時打中(a)Polymarket「勢均力敵的盤才是主角」(b)/calibration 57% 護城河「誠實校準不裝準」。
//   顯式 flaunt uncertainty = 對手結構性學不來(他們一誠實就露餡 = costly signal）。
//
// 純衍生 · 只看 favorite 的開盤勝率 % · 0 新資料 · 不 vapor · plain words(不 render 學術詞）。
// ─────────────────────────────────────────────────────

export type ConvictionTier = "tossup" | "lean" | "strong";

export type EngineConviction = {
  tier: ConvictionTier;
  label: string; // 短籤 · 球迷白話
};

/**
 * @param favPct 開盤線上 favorite 那一邊的 %(= max(home%, away%))· 0-100。
 * tossup ≤53(銅板局 · 主打誠實不確定)· strong ≥61(引擎敢重壓)· 其餘 lean。
 */
export function getEngineConviction(favPct: number): EngineConviction {
  if (favPct <= 53) return { tier: "tossup", label: "勢均力敵" };
  if (favPct >= 61) return { tier: "strong", label: "引擎重壓" };
  return { tier: "lean", label: "引擎看好" };
}
