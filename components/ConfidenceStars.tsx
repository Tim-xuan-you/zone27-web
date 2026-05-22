import Link from "next/link";

// ── ZONE 27 · AI Confidence Stars ──────────────────────
// Round 33 W-A · Customer-driven product redesign per agent verdict
// (commercial pivot for prediction-seeking audience)。
//
// Psychological hook(canonical · sports-betting subscription benchmark):
//   - Authority bias + expert simplification(#1 reason bettors pay)
//   - Decision-cost collapse from raw % → discrete 1-5 stars
//   - "Confidence-priming" — give 信號強度 not certainty
//
// Mechanical mapping(NO editorial judgment · derives from engine
// aiConfidence field directly · /audit S02 ESTIMATION DISCLOSURE
// canonical cross-link):
//   - aiConfidence >= 80 → ★★★★★ STRONG SIGNAL
//   - aiConfidence 70-79 → ★★★★☆ CLEAR SIGNAL
//   - aiConfidence 60-69 → ★★★☆☆ DECENT SIGNAL
//   - aiConfidence 50-59 → ★★☆☆☆ WEAK SIGNAL
//   - aiConfidence < 50  → ★☆☆☆☆ COIN-FLIP
//
// Vocabulary discipline(per agent brand-IP redline verdict):
//   - 「STRONG SIGNAL」 NOT「LOCK」(LOCK is 報明牌 grifter literal vocab)
//   - 「COIN-FLIP」 NOT「不押」(scientist not tipster)
//   - Tooltip cross-link /audit S02 makes ESTIMATION DISCLOSURE one-click
//
// Brand IP compatibility:
//   - ✓ Authority bias + Confidence-priming(2 of 7 canonical hooks)
//   - ✓ No vocabulary slip toward 老師 ecosystem
//   - ✓ Pratfall axiom honored(tooltip surfaces ESTIMATION DISCLOSURE)
//   - ✓ Mechanical from engine variance · no human curation
//
// References:
//   - Round 31 W-B StatPercentileBar canonical pattern
//   - Baseball Savant percentile aesthetic
//   - FanGraphs + Baseball Prospectus star-rating convention
// ─────────────────────────────────────────────────────

type Props = {
  /** Engine's aiConfidence field · 0-100 integer */
  confidence: number;
  /** Optional layout · "inline" 緊湊 (HeroLiveCard / MiniMatchCard) · "stack" 大 (match detail page hero) */
  variant?: "inline" | "stack";
  /** Optional · disable tooltip (default false) */
  noTooltip?: boolean;
};

type Tier = {
  stars: 1 | 2 | 3 | 4 | 5;
  label: string;
};

function tierFor(confidence: number): Tier {
  if (confidence >= 80) return { stars: 5, label: "STRONG SIGNAL" };
  if (confidence >= 70) return { stars: 4, label: "CLEAR SIGNAL" };
  if (confidence >= 60) return { stars: 3, label: "DECENT SIGNAL" };
  if (confidence >= 50) return { stars: 2, label: "WEAK SIGNAL" };
  return { stars: 1, label: "COIN-FLIP" };
}

export default function ConfidenceStars({
  confidence,
  variant = "inline",
  noTooltip = false,
}: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(confidence)));
  const { stars, label } = tierFor(clamped);

  const tooltipText = noTooltip
    ? undefined
    : `AI Confidence ${clamped}/100 · derived mechanically from engine variance · 不是 editorial 不是 個人 tipster · ESTIMATION DISCLOSURE 見 /audit S02`;

  const filled = "★";
  const empty = "☆";
  const starString =
    filled.repeat(stars) + empty.repeat(5 - stars);

  if (variant === "stack") {
    return (
      <div
        className="inline-flex flex-col items-start gap-1"
        title={tooltipText}
      >
        <div className="flex items-baseline gap-3">
          <span
            aria-label={`AI Confidence ${stars} of 5 stars · ${label}`}
            className="font-mono text-gold text-2xl sm:text-3xl tabular tracking-[0.1em] leading-none"
          >
            {starString}
          </span>
          <span className="font-mono text-mute text-[10px] tracking-[0.25em] tabular">
            {clamped}/100
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-bone text-[10px] tracking-[0.35em]">
            {label}
          </span>
          {!noTooltip && (
            <Link
              href="/audit#section-02"
              className="font-mono text-mute/60 hover:text-gold text-[9px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
              title="ESTIMATION DISCLOSURE · 引擎置信度怎麼算"
            >
              方法?
            </Link>
          )}
        </div>
      </div>
    );
  }

  // inline variant · 緊湊 1 行
  return (
    <span
      className="inline-flex items-baseline gap-2"
      title={tooltipText}
    >
      <span
        aria-label={`AI Confidence ${stars} of 5 stars · ${label}`}
        className="font-mono text-gold text-base tabular tracking-[0.08em] leading-none"
      >
        {starString}
      </span>
      <span className="font-mono text-mute text-[9px] tracking-[0.3em]">
        {label}
      </span>
    </span>
  );
}
