// ── ZONE 27 · Last Shipped Anchor ───────────────────────
// R67 W-C · Agent R66 ship #4 deferred reframed · Zajonc 1968 Mere
// Exposure 機制 · 但 brand IP「不打擾就是禮物」 + /now 「無 weekly
// schedule promise」 axiom 衝突 · 故 NOT「next update typically X」
// (cadence promise · 違反 brand IP)· 改 LAST-shipped + 「不承諾節奏」
// honesty chip · 同 Pratfall pattern。
//
// Single source of truth · update 每次 R67+ closure 同步:
//   1. Touch this constant
//   2. Touch /now page LAST_UPDATED(已是同 date · double-source 為了
//      /now 顯示 + CadencePulseChip 顯示分離 · 若未來 /now 用此 lib
//      之後 single-source)
//
// 不做 anti-pattern:
//   ✕「下週四前可期待 X」 commitment language
//   ✕「ETA next update: 5 days」 countdown
//   ✕「Subscribe to get notified」 push CTA
//   ✕「X 訪客在線」 social proof
//
// 純做:
//   ✓ 最後 ship 日期 honest surface
//   ✓ /changelog cross-link for actual physical cadence
//   ✓「節奏由 craft 決定 · 不承諾」 brand-pure copy
// ─────────────────────────────────────────────────────

/** Last visitor-meaningful ship date · ISO YYYY-MM-DD · TPE timezone *
 *  · update each R67+ closure wave。
 *  Note · 此 anchor 不是 git HEAD commit date(那 GitHub.commits 已 surface)
 *  · 此 anchor 是「Tim 認為 visitor 可以 sense 的最新變化」 · 故 R67 closure
 *  即使包含 internal refactor commit · 此 const 標 visitor-facing date。 */
export const LAST_SHIPPED_DATE_ISO = "2026-05-24";

/** Compute days elapsed since LAST_SHIPPED_DATE_ISO at server-render time。
 *  Server timezone is UTC(Vercel)but answer is rounded · 用 Asia/Taipei
 *  以對齊 TPE-centric brand · 不 race-condition 因為 round-to-day。 */
export function getDaysSinceLastShipped(now: Date = new Date()): number {
  const shipped = new Date(`${LAST_SHIPPED_DATE_ISO}T00:00:00+08:00`);
  const ms = now.getTime() - shipped.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/** Human-readable「N 天前」 / 「剛剛 ship」 label · 用於 chip body。 */
export function formatTimeSinceLastShipped(now: Date = new Date()): string {
  const days = getDaysSinceLastShipped(now);
  if (days === 0) return "今天";
  if (days === 1) return "1 天前";
  if (days < 7) return `${days} 天前`;
  if (days < 14) return "1 週前";
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  if (days < 60) return "1 個月前";
  return `${Math.floor(days / 30)} 個月前`;
}
