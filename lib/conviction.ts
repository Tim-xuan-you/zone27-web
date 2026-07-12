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
 * 🔴 這把尺是替「兩向」favPct 校準的 —— 三向(足球主/和/客)請走 getThreeWayConviction,
 *   別直接拿 pick 機率進來(48/27/25 的明顯偏好會被誤讀成銅板局)。
 */
export function getEngineConviction(favPct: number): EngineConviction {
  if (favPct <= 53) return { tier: "tossup", label: "勢均力敵" };
  if (favPct >= 61) return { tier: "strong", label: "推演重壓" };
  return { tier: "lean", label: "推演看好" };
}

/**
 * 三向 pick 對「次高結果」的頭對頭 %(48 對 27 → 64)· 分母壞掉回 50(銅板 · 誠實預設)。
 * 🔴 這是全站唯一的三向→兩向換算(watch-points 的「敢的一手」排序也走這裡)——
 *   別在頁面層自己發明第二把(pick vs 次高 ≠ 主 vs 客:和局常常就是次高,漏掉它會高估)。
 */
export function threeWayHeadToHeadPct(pickPct: number, secondPct: number): number {
  const denom = pickPct + secondPct;
  if (!Number.isFinite(denom) || denom <= 0) return 50;
  return (pickPct / denom) * 100;
}

/** 三向線裡「pick 以外的次高結果」%(pick 值只剔除一次 · 平手值不會被誤刪)。 */
export function threeWaySecondPct(
  pickPct: number,
  pcts: { homeWin: number; draw: number; awayWin: number },
): number {
  const rest = [pcts.homeWin, pcts.draw, pcts.awayWin];
  const i = rest.indexOf(pickPct);
  if (i >= 0) rest.splice(i, 1);
  return Math.max(...rest);
}

/**
 * 三向(足球)信心溫度:把「pick vs 次高結果」壓成頭對頭比例,再套同一把兩向尺。
 * 例 48/27/25:48/(48+27) = 64% → 重壓(三向裡 48% 對次高 27% 就是機器最敢的一手);
 * 40/35/25:40/75 = 53% → 銅板局。 顯示的 % 不變(仍照實秀三向真實機率)· 這裡只校
 * 「機器有多敢」的口氣,不放大任何數字 —— 低估自己是誠實,唸錯尺是 bug(R296 修)。
 */
export function getThreeWayConviction(
  pickPct: number,
  secondPct: number,
): EngineConviction {
  return getEngineConviction(threeWayHeadToHeadPct(pickPct, secondPct));
}

/** 便利式:給 pick % + 三向全率,自動取次高 →信心溫度(/today 對決 · /vs 戰帖 · 同一把尺)。 */
export function getSoccerLineConviction(
  pickPct: number,
  pcts: { homeWin: number; draw: number; awayWin: number },
): EngineConviction {
  return getThreeWayConviction(pickPct, threeWaySecondPct(pickPct, pcts));
}
