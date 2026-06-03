// ── ZONE 27 · Founder Application SLA ───────────────────
// R72 W-B · Agent A R72 SHIP 6 · Patek dealer「personal call」 promise +
// Stripe Atlas application response SLA + Linear 2019 invite-only response
// time pattern。 Single-source constant for FoundersApplicationForm
// TimResponseSLA chip · same architecture as lib/last-shipped.ts(R67 W-C)
// + lib/diff-commits.ts(R71 W-C)single-source append-only discipline。
//
// Tim manually updates these per-application throughput · weekly cadence ·
// pre-launch state honest empty values · post-Founder-#001 numerical
// updates · brand IP yield「what Tim physically commits to」 visible at
// submit-button friction point。
//
// brand IP fit:
//   - per [[feedback-founder-dogfood-canary]] · Tim 親手 capacity disclosed ·
//     不裝「instant review system」
//   - per [[zone27-disclosure-philosophy]] · 「1-3 business days · solo
//     founder · 不外包」 binding commitment · per /audit S05 PRE-COMMIT
//   - per [[feedback-zone27-pratfall-brand-ip]] · pre-launch empty values
//     honest「TBD until first application」 · 不假裝 numbers
//   - per [[zone27-payment-architecture]] · Tim manual review IS the spam
//     filter(per Agent B R69 verified PASS list)· 此 SLA chip 物理 codify
//
// 不做 anti-pattern:
//   ✕ no fake「2,847 founders reviewed」 vanity metric
//   ✕ no「9 minutes average response」 marketing lie
//   ✕ no live-counter「3 applications in queue right now」 FOMO
//   ✕ no Calendly-style「book a 30-min call」 — Tim solo founder
// ─────────────────────────────────────────────────────

/** SLA binding commitment · permanent · per /audit S05 PRE-COMMIT clause
 *  · 修改需 30 天 /changelog 公告 · same Costly Signaling 100× pattern。 */
export const GOLD_SLA_COMMITMENT = "1-3 business days · TIM 親手 · 不外包";

/** Pre-launch state · numerical fields HONEST empty until first real
 *  application lands · Tim updates manually post-Founder-#001 onboard ·
 *  brand IP「不藏 pre-launch」 axiom 物理 codify。 */
export type FounderSlaState = {
  /** Date of Tim's most recent application reply · null = pre-launch */
  lastReplyDate: string | null;
  /** Average reply hours · null = insufficient sample · target 24-72h */
  avgReplyHours: number | null;
  /** Current queue depth · null = pre-launch · honest 0 OK post-launch */
  queueDepth: number | null;
  /** Number of historical refusals with brand-pure rationale published
   *  per /founders/ledger 5-step allocation rules · null = pre-launch */
  publishedRefusalCount: number | null;
};

/** Manual single-source state · Tim updates weekly per CadencePulseChip
 *  cadence pattern · pre-launch all null values · 4-cell shows TBD/honest
 *  empty until first real application。 */
export const GOLD_SLA_STATE: FounderSlaState = {
  lastReplyDate: null,
  avgReplyHours: null,
  queueDepth: null,
  publishedRefusalCount: null,
};

/** Helper · returns true when ALL numerical fields are pre-launch null ·
 *  used by TimResponseSLA to swap UI to honest「pre-launch · TBD」 state。 */
export function isPreLaunchSlaState(s: FounderSlaState = GOLD_SLA_STATE): boolean {
  return (
    s.lastReplyDate === null &&
    s.avgReplyHours === null &&
    s.queueDepth === null &&
    s.publishedRefusalCount === null
  );
}
