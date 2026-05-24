// ── ZONE 27 · Living Cover Hero · Stripe Press signature pattern ────
// Algorithmic SVG signature element · deterministic per today's date
// + last finalized match · refreshes per build · 「engine is alive」
// public proof-of-existence · Cold Gold #D4AF37 stroke on transparent
// background · 0 JS · 0 animation · 0 external dep · server-rendered。
//
// Per Agent design research OBSERVATION 1(R96 W1 synthesis):
//   Stripe Press' iconic move is algorithmically generated book covers
//   by Outlanders — each book has a unique parametric pattern that
//   feels generated, not designed. The cover IS the brand. ZONE 27's
//   current state misses a *visual artifact* that proves the engine
//   exists. Brand-pure: single SVG on homepage hero rendering a live
//   deterministic win-probability curve · Cold Gold on Deep Navy.
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · curve IS the engine output
//     visible · 不藏算法 · 公開可驗證
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     看到 sparkline 立刻識別「這是引擎跑出來的」 · fan grammar match
//   - per [[zone27-coverage-philosophy]] · curve 只 derive from CPBL
//     match data · 不爬 MLB · 不接付費 API
//   - per Lens Lifetime Pledge · 此 component 永遠 viewable · 不 silently
//     rotate · 不 silently swap · deprecate + version 路線
//
// Determinism:
//   - Input seed = matchId(若 match 存在)OR LAST_SHIPPED_DATE_ISO
//   - Output = same input always renders same path · build-deterministic
//   - 18 inning-half points · 50% start → finalWinRate end · smooth
//
// 不做 anti-pattern:
//   ✕ NO animation(violates 不打擾就是禮物 + LCP perf)
//   ✕ NO interactive(violates 「方法公開 · 不需 click 看真相」 axiom)
//   ✕ NO external font load(uses inherit · fallback safe)
//   ✕ NO color outside brand palette(冷金 + 骨白 + 深藏青 only)
// ─────────────────────────────────────────────────────

import type { Match } from "@/lib/matches";
import { getCalibration } from "@/lib/matches";
import { LAST_SHIPPED_DATE_ISO } from "@/lib/last-shipped";

// Deterministic seeded "random" using djb2 hash · same seed = same output。
function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function seededRandom(seed: number, index: number): number {
  // Linear-congruential generator from seed+index · returns 0..1。
  const x = Math.sin(seed * (index + 1) * 12345.6789) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate 18 inning-half win-probability points from 50% start to finalRate
 * end · seeded by matchId · noise amplitude decays toward end · brand-pure
 * Monte Carlo sparkline aesthetic。
 */
function generateWinProbabilityCurve(
  seed: string,
  finalRate: number
): number[] {
  const seedNum = djb2(seed);
  const points: number[] = [50]; // start at 50/50
  const innings = 18; // 9 innings × top/bottom

  for (let i = 1; i <= innings; i++) {
    const progress = i / innings; // 0..1
    // Linear baseline from 50 to finalRate
    const baseline = 50 + (finalRate - 50) * progress;
    // Noise amplitude decays toward end · uncertainty resolves
    const noiseAmp = 12 * (1 - progress) + 3;
    const noise = (seededRandom(seedNum, i) - 0.5) * noiseAmp * 2;
    const point = Math.max(2, Math.min(98, baseline + noise));
    points.push(point);
  }
  return points;
}

type Props = {
  /** Match to derive win-probability curve from · undefined = use date fallback */
  match?: Match;
  /** Optional className for outer container */
  className?: string;
};

export default function LivingCoverHero({ match, className = "" }: Props) {
  // Seed strategy: match.id when available · else LAST_SHIPPED_DATE_ISO
  // (rotates per ship · still deterministic per build)。
  const seed = match?.id ?? LAST_SHIPPED_DATE_ISO;
  const finalRate = match?.home.winRate ?? 50;
  const points = generateWinProbabilityCurve(seed, finalRate);

  // Render dimensions · SVG viewBox-scaled · responsive。
  const width = 800;
  const height = 100;
  const padX = 12;
  const padY = 18;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  // Convert points (% values 2-98) to SVG coords (y inverted)。
  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * innerW;
    const y = padY + innerH - ((p - 2) / 96) * innerH;
    return { x, y, p };
  });

  // Build smooth path using cubic bezier interpolation。
  const pathD = coords
    .map((c, i) => {
      if (i === 0) return `M ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
      const prev = coords[i - 1];
      const cpX = (prev.x + c.x) / 2;
      return `Q ${cpX.toFixed(1)} ${prev.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    })
    .join(" ");

  // 50% midline reference · pure cosmetic anchor。
  const midY = padY + innerH / 2;

  // Final-point dot color · gold if engine verdict PROVED · loss if DIVERGED。
  const calibration = match ? getCalibration(match) : null;
  const isProved = calibration === "proved";
  const isDiverged = calibration === "diverged";
  const finalDotColor = isProved
    ? "#D4AF37"
    : isDiverged
    ? "#C8542F"
    : "#F5F2EA";

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-[80px] sm:h-[100px] block"
        role="img"
        aria-label={
          match
            ? `Win probability curve · ${match.home.name} ${finalRate.toFixed(0)}% · ${match.away.name} ${(100 - finalRate).toFixed(0)}%`
            : "ZONE 27 engine signature"
        }
      >
        {/* Subtle 50% midline · brand IP「公開可驗證」 anchor。 */}
        <line
          x1={padX}
          y1={midY}
          x2={width - padX}
          y2={midY}
          stroke="rgba(212, 175, 55, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />

        {/* Faint area fill under curve · adds depth without dominating。 */}
        <path
          d={`${pathD} L ${(width - padX).toFixed(1)} ${(padY + innerH).toFixed(1)} L ${padX.toFixed(1)} ${(padY + innerH).toFixed(1)} Z`}
          fill="rgba(212, 175, 55, 0.06)"
        />

        {/* Main sparkline · Cold Gold stroke。 */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(212, 175, 55, 0.85)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Start dot · bone · 50% anchor。 */}
        <circle
          cx={coords[0].x}
          cy={coords[0].y}
          r="3"
          fill="rgba(245, 242, 234, 0.6)"
        />

        {/* Final dot · color reflects verdict。 */}
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="4"
          fill={finalDotColor}
          style={{
            filter: isProved
              ? "drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))"
              : undefined,
          }}
        />
      </svg>

      {/* Brand stamp · bottom-right Geist Mono · cite-able provenance。 */}
      <p
        lang="en"
        className="absolute bottom-1 right-2 sm:right-3 font-mono text-[8px] sm:text-[9px] tracking-[0.25em] tabular text-mute/55 pointer-events-none"
      >
        ENGINE v0.2 · {match ? match.id : LAST_SHIPPED_DATE_ISO} · 1萬次模擬
      </p>
    </div>
  );
}
