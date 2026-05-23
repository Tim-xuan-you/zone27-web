// ── ZONE 27 · Consent Defaults ──────────────────────────
// R66 W-B · Agent psychology synthesize ship #5 · Default Bias
// (Thaler 2003)pre-commit code-level guardrail。
//
// Per agent psychology ship #5 · ZONE 27 must NEVER use pre-checked
// opt-in boxes(LinkedIn dark-default pattern)· must always default
// OFF · let user explicitly opt-in · per UX Magazine「transparency,
// reversibility, user-centric design」 axiom + Apple privacy default
// posture(cross-app tracking OFF by default · OS-wide)。
//
// This constant is the SINGLE SOURCE OF TRUTH for user consent
// defaults · imported anywhere we ask for opt-in(WaitlistForm ·
// future /member profile · future BLACK CARD signup · future
// /founders/apply form when payment infra ships)。
//
// TypeScript `const`-asserted defaults can be exported but NEVER
// overridden at write-time · ensuring no future ship accidentally
// flips a default to true。 Refactoring this constant requires
// touching this file · which highlights the change in PR review。
//
// Per /privacy Section 6B PDPA(R64 W-A)· 「處理 / 利用之特定目的」
// PDPA § 19 + § 20 · 不超出 launch 通知 + onboarding 兩個目的 ·
// 任何擴張需 30 天 /changelog 公告 + 您可選 opt-out。
//
// Brand IP fit:
//   - [[zone27-disclosure-philosophy]] · 「方法公開」 延伸到 consent
//     defaults · brand 不裝 default-opt-in 而後再「請您 opt-out」
//   - [[feedback-zone27-pratfall-brand-ip]] · 公開承認「我們 default
//     OFF · 您必須主動勾選」 · self-imposed constraint is costly signal
//   - Apple privacy default posture analog · cross-app tracking OFF
// ─────────────────────────────────────────────────────

/**
 * Default consent state for any NEW user signup · ALL OPT-INS OFF。
 * Per agent psychology ship #5 + Thaler 2003 default-bias research +
 * Apple privacy default posture。
 *
 * Use in any signup form via:
 *   const [consent, setConsent] = useState(DEFAULT_CONSENT);
 *
 * Or as defaultChecked={DEFAULT_CONSENT.marketingEmail} on checkbox。
 */
export const DEFAULT_CONSENT = {
  /** Marketing email · weekly /now updates + BLACK CARD promotion · OFF by default */
  marketingEmail: false,
  /** Product updates · engine version ship notifications · OFF by default */
  productUpdates: false,
  /** Calibration digest · weekly /track-record summary · OFF by default */
  calibrationDigest: false,
  /** Founders 27 LINE group invite(once payment infra ships)· OFF by default */
  founders27LineGroup: false,
  /** Tim 工程筆記 weekly · BLACK CARD subscriber benefit · OFF by default */
  weeklyEngineeringNotes: false,
} as const satisfies Readonly<Record<string, boolean>>;

/** Type for consent preferences · all boolean keys from DEFAULT_CONSENT */
export type ConsentPreferences = Readonly<{
  [K in keyof typeof DEFAULT_CONSENT]: boolean;
}>;

/**
 * Helper · check if ALL consents are still default OFF。 Use for
 * 「您 0 個 opt-in · 退出 maximum」 reassurance UI on /member profile。
 */
export function hasAllDefaultConsent(consent: ConsentPreferences): boolean {
  return Object.values(consent).every((v) => v === false);
}
