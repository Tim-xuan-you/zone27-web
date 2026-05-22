// ── ZONE 27 · Format Helpers ────────────────────────────
// Round 55 W-A · Agent C(2026 SaaS pricing page craft)synthesize · NT$
// notation canonical spec · per Wikipedia 「New Taiwan dollar」 + GuideToTaiwan
// convention(NT$ = Taiwan domestic pricing standard · TWD = FX-only)。
//
// Adopt single canonical convention across 30+ price mentions:
//   - One-time / lifetime:  NT$ 2,700           (non-breaking space)
//   - Recurring monthly:    NT$ 299/月          (Chinese suffix · audience-fans-not-engineers)
//   - 4+ digits always 逗號 separator(2,700 · 17,940)
//   - Never NTD / TWD / $ alone / 2700元 mixed
//   - 非斷行 space   between NT$ and number(防 mobile orphan wrap)
//
// brand IP fit:
//   - audience-fans-not-engineers(/月 Chinese suffix · 不是 SaaS English /mo)
//   - 方法公開 · 不藏(統一 notation = 不混淆 visitor pricing parse)
//   - costly signaling(consistent typography = craft signal)
// ─────────────────────────────────────────────────────

/** Non-breaking space between NT$ and digit · 防 mobile orphan wrap。 */
const NBSP = " ";

/**
 * Format Taiwan dollar amount with canonical ZONE 27 convention。
 *
 * @example
 * formatNT(2700)           → "NT$ 2,700"
 * formatNT(299, "monthly") → "NT$ 299/月"
 * formatNT(2700, "lifetime") → "NT$ 2,700"
 * formatNT(17940)          → "NT$ 17,940"
 */
export function formatNT(
  amount: number,
  cadence: "one-time" | "monthly" | "lifetime" = "one-time"
): string {
  if (!Number.isFinite(amount)) {
    // Defensive · NaN / Infinity 不 silently format · 返 placeholder
    return `NT$${NBSP}?`;
  }
  const formatted = Math.round(amount).toLocaleString("en-US"); // en-US gives comma separator
  const base = `NT$${NBSP}${formatted}`;
  if (cadence === "monthly") return `${base}/月`;
  return base;
}

/**
 * Format break-even / saving math · 「9 個月即達損益平衡」 style。
 *
 * @example
 * formatNTSaving(3588) → "NT$ 3,588 /年省"
 */
export function formatNTSaving(amount: number): string {
  return `${formatNT(amount)}${NBSP}/年省`;
}
