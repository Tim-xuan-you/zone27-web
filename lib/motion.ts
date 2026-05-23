// ── ZONE 27 · Motion Timing Constants ───────────────────
// R66 W-B · Agent psychology synthesize code improvement #1。
// Per agent finding · animation timing magic numbers scattered across
// app/globals.css(320ms ease-out at :399 · 200/20 spring constants etc)·
// hard to keep consistent across components · future Framer Motion port
// would require global rewrite。
//
// Single source of truth for motion constants · enables:
//   1. Consistency across components(verdict-reveal 480ms ALL places)
//   2. Easy a11y review(can audit all motion in one file)
//   3. prefers-reduced-motion override single point(future R67+)
//   4. Future Framer Motion port without rewrite
//
// Use in components via:
//   import { MOTION } from "@/lib/motion";
//   <div style={{ animation: `fadeUp ${MOTION.fadeUp}ms ${MOTION.easeOut}` }} />
//
// Or in globals.css via CSS custom properties(R67+):
//   :root { --motion-fade-up: 320ms; --motion-ease-out: ease-out; }
// ─────────────────────────────────────────────────────

export const MOTION = {
  // ── DURATION constants(milliseconds)──
  /** Standard fade-up · used by .enter-fade-up class · `app/globals.css:399` */
  fadeUp: 320,
  /** Verdict reveal · peak-end rule moment · R66 W-B agent ship #2 deferred */
  verdictReveal: 480,
  /** Verdict hold pause · pre-reveal anticipation · per agent peak-end ship */
  verdictHoldMs: 800,
  /** Toast / flash duration · GlobalShortcuts visual flash + ReceiptForward done state */
  flashMs: 1200,
  /** Form success state · WaitlistForm + FounderPickForm + MatchNoteEditor */
  formSuccessMs: 2500,
  /** Section reveal scroll-driven · `app/globals.css:362` */
  sectionRevealMs: 800,

  // ── EASING strings(CSS timing-function values)──
  /** Standard easing for most ZONE 27 motion · ease-out feel */
  easeOut: "ease-out",
  /** Cubic bezier exit · agent recommended for verdict-reveal peak moment */
  easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Spring-like easing for AnonPickWidget · feels more reactive */
  easeOutBack: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Linear for scroll-driven section-reveal · per existing pattern */
  linear: "linear",

  // ── PIXEL constants(transform offsets)──
  /** Standard fade-up translate · 8px lift per Apple/Linear pattern */
  fadeUpTranslateY: 8,
} as const satisfies Readonly<Record<string, number | string>>;

/**
 * Helper · format a CSS animation shorthand from MOTION constants。
 * Example · `motionShorthand(MOTION.fadeUp, MOTION.easeOut)` →
 *   `"320ms ease-out"`.
 */
export function motionShorthand(
  durationMs: number,
  easing: string = MOTION.easeOut,
): string {
  return `${durationMs}ms ${easing}`;
}
