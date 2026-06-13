// ── ZONE 27 · 個人校準成績編碼 / 解析(/calibration/result/[r])──────────────
// r 編碼 = `${把握avgConf}-${實際youHitPct}-${場數decided}`(全非負整數)。
// 分享端(CalibrationGame)、OG 卡、落地頁三方共用此單一來源,口徑零漂移。
// 🔴 練習成績、非戰績:URL 可被改 = 像 Wordle 分享分數,刻意不防(這不是可驗證憑證)·
//   解析只負責「壞參數退場」(不 crash、不 500),不做真實性背書。
// ─────────────────────────────────────────────────────

export type ParsedResult = {
  /** 平均把握 % */
  conf: number;
  /** 實際中的成數 % */
  hit: number;
  /** 計入的場數(銅板局不算)*/
  n: number;
  /** 把握 − 實際(正 = 過度自信)*/
  gap: number;
  /** over = 過度自信 · under = 太保守 · calibrated = 算誠實 */
  tone: "over" | "under" | "calibrated";
};

export function parseResult(r: string): ParsedResult | null {
  if (typeof r !== "string") return null;
  const parts = r.split("-");
  if (parts.length !== 3) return null;
  const [confS, hitS, nS] = parts;
  // 純數字字串才收(擋掉 "70.5" / "70a" / 負號等)
  if (!/^\d{1,3}$/.test(confS) || !/^\d{1,3}$/.test(hitS) || !/^\d{1,3}$/.test(nS)) {
    return null;
  }
  const conf = Number(confS);
  const hit = Number(hitS);
  const n = Number(nS);
  if (conf > 100 || hit > 100) return null;
  if (n < 1 || n > 50) return null;
  const gap = conf - hit;
  const tone: ParsedResult["tone"] =
    gap > 12 ? "over" : gap < -8 ? "under" : "calibrated";
  return { conf, hit, n, gap, tone };
}

/** 把一場校準結果編成 URL 片段(分享端用)· decided=0 / 缺值 → null(改連通用頁)。 */
export function encodeResult(
  avgConf: number | null,
  youHitPct: number | null,
  decided: number,
): string | null {
  if (avgConf === null || youHitPct === null || decided < 1) return null;
  const c = Math.max(0, Math.min(100, Math.round(avgConf)));
  const h = Math.max(0, Math.min(100, Math.round(youHitPct)));
  const n = Math.max(1, Math.min(50, Math.round(decided)));
  return `${c}-${h}-${n}`;
}
