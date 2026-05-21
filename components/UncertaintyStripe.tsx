// ── ZONE 27 · Uncertainty Stripe ────────────────────────
// Round 28 Wave 3 · Agent A pattern #1 · the 2026 canonical visual
// moat for quantitative analytics brands.
//
// The brand IP "AI 計算的是機率 · 不是命運" was previously TEXT only.
// This component makes it VISUAL — a thin gradient band below each
// win-probability % showing the 50% and 90% binomial confidence
// intervals around the point estimate.
//
// Math:
//   p̂ = estimate / 100
//   SE = sqrt(p̂ × (1 - p̂) / N)
//   50% CI half-width = 0.6745 × SE
//   90% CI half-width = 1.6449 × SE
//
// Visual encoding (Bank of England fan-chart convention):
//   - Outer band (90% CI · light gold/15) = "in 90% of repeated
//     simulations, the estimate would land in this range"
//   - Inner band (50% CI · darker gold/35) = "central tendency"
//   - No median tick (the surrounding signature bar already
//     marks p̂ with its own indicator)
//
// Why this differentiates ZONE 27 in 2026:
//   - Every gambling platform shows point estimates without
//     uncertainty (false certainty)
//   - Every Bayesian / academic / FiveThirtyEight-grade analytics
//     publishes uncertainty visually (Bank of England fan charts,
//     pyMC, FiveThirtyEight election forecasts)
//   - ZONE 27 already has the data for free (10K Monte Carlo)
//   - Communicates epistemic humility as brand IP, not text
//
// Below N=30, CI is meaningless (per Z27 LEXICON SAMPLE DEBT).
// Renders an empty same-height div so layout stays stable.
// ─────────────────────────────────────────────────────

type Props = {
  /** Point estimate · 0-100 */
  estimate: number;
  /** Sample size used for binomial CI calculation */
  n: number;
  /** Visual height in pixels · default 4 */
  height?: number;
};

const Z_50 = 0.6745;
const Z_90 = 1.6449;

export default function UncertaintyStripe({
  estimate,
  n,
  height = 4,
}: Props) {
  // Guard: pre-convergence and impossible-edge values render no stripe.
  if (n < 30 || estimate <= 0 || estimate >= 100) {
    return (
      <div
        style={{ height: `${height}px` }}
        aria-hidden="true"
      />
    );
  }

  const p = estimate / 100;
  const se = Math.sqrt((p * (1 - p)) / n);
  // Clamp to [0, 50] to avoid overflow at near-50/50 estimates with low N.
  const halfWidth90 = Math.min(50, Z_90 * se * 100);
  const halfWidth50 = Math.min(50, Z_50 * se * 100);

  return (
    <div
      className="relative"
      style={{ height: `${height}px` }}
      role="img"
      aria-label={`90% 信賴區間 ${(estimate - halfWidth90).toFixed(1)}% 至 ${(estimate + halfWidth90).toFixed(1)}% · N=${n}`}
      title={`90% CI: ±${halfWidth90.toFixed(2)}% · 50% CI: ±${halfWidth50.toFixed(2)}% · N = ${n.toLocaleString()}`}
    >
      {/* Outer 90% confidence band · light gold */}
      <div
        className="absolute top-0 bottom-0 rounded-sm transition-[left,right] duration-150 ease-out"
        style={{
          left: `${Math.max(0, estimate - halfWidth90)}%`,
          right: `${Math.max(0, 100 - estimate - halfWidth90)}%`,
          background: "rgba(212, 175, 55, 0.15)",
        }}
      />
      {/* Inner 50% confidence band · darker gold */}
      <div
        className="absolute top-0 bottom-0 rounded-sm transition-[left,right] duration-150 ease-out"
        style={{
          left: `${Math.max(0, estimate - halfWidth50)}%`,
          right: `${Math.max(0, 100 - estimate - halfWidth50)}%`,
          background: "rgba(212, 175, 55, 0.35)",
        }}
      />
    </div>
  );
}
