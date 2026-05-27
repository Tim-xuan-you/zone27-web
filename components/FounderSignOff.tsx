// ── ZONE 27 · Founder Sign-Off ─────────────────────────
// Round 28 Wave 2A · Agent A pattern #7 (patio11/DHH/Ben Thompson).
// Every trust-artifact page closes with a short 3-sentence first-
// person 「我」 paragraph signed by Tim. The trust doc reads
// institutional ("ZONE 27 reports..."); a 3-line founder sign-off
// transforms each into a personal commitment.
//
// Memory [[feedback_zone27_audience_fans_not_engineers]]: audience is
// hardcore baseball fans. Fans trust a person, not an institution.
// Memory [[zone27-disclosure-philosophy]]: the soul (founder) is part
// of "方法公開". Memory [[feedback_zone27_pratfall_brand_ip]]: signed
// paragraphs are PERMANENT (Pratfall+Costly Signaling section
// reinforcement) · only neutral relabel allowed.
//
// Visual hierarchy: small (text-sm), mute/90 body, gold/40 left
// border, mono signature kicker — secondary to main content but
// distinct from generic body copy. Same visual rhythm as quote
// blockquotes in /about Chapter 05 + /founders FROM THE FOUNDER.
// ─────────────────────────────────────────────────────

import { LAST_BRAND_REVIEW } from "@/lib/brand-constants";

type Props = {
  /** Paragraph(s) — first person · max 3 short sentences total */
  children: React.ReactNode;
  /** ISO date · default = LAST_BRAND_REVIEW from lib/brand-constants.ts · per
   * R166 W1 Agent Q bug audit MEDIUM #2 stale-date fix · centralized to avoid
   * 30+ trust pages all rendering 2026-05-21 forever。 */
  signedAt?: string;
};

export default function FounderSignOff({
  children,
  signedAt = LAST_BRAND_REVIEW,
}: Props) {
  return (
    <section
      aria-labelledby="founder-signoff-heading"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-14 border-t border-line/40"
    >
      <div className="border-l-2 border-gold/40 pl-5 sm:pl-6 max-w-2xl">
        <p
          id="founder-signoff-heading"
          lang="en"
          className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-4"
        >
          / FROM TIM · 親筆說明
        </p>
        <div className="text-mute/90 text-sm sm:text-base leading-relaxed space-y-3 [&_strong]:text-bone">
          {children}
        </div>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-6 tabular">
          — TIM · FOUNDER · {signedAt}
        </p>
      </div>
    </section>
  );
}
