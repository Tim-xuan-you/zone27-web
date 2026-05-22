// ── ZONE 27 · Stat Percentile Bar ─────────────────────────
// Round 31 Wave B · Baseball Savant 視覺移植 · 2026 hardcore
// CPBL/MLB fan 看到 percentile bar 1.2 秒就識別「這是真的」
// brand IP grammar match。
//
// 跟 Savant 原版差別:
//   - Savant 用 red→white→blue percentile gradient,我們用品牌
//     色 冷金 #D4AF37(elite) → 骨白 #F5F2EA(median) → 深藏青
//     mute(poor)。 dot 是金色 hexagon-feel pixel(brand mark)。
//   - Savant percentile 來自 ranked league dataset · ZONE 27 暫無
//     完整 CPBL ranked data · 用 ESTIMATED league min/max range
//     positioning。 per /audit Section 02 ESTIMATION DISCLOSURE
//     pattern · honest disclosure 在 component header tooltip。
//
// 視覺 layout(緊湊 stacked · 一張卡 5 bars 不爆):
//   ERA   2.61  ▓▓▓▓▓▓▓░░░░░░░░░░  低 = 強(elite)
//   K/9   8.5   ░░░░░░░░▓▓▓▓▓▓▓░░  高 = 強(elite)
//   WHIP  1.30  ▓▓▓▓▓░░░░░░░░░░░░  低 = 強
//   BB/9  2.5   ▓▓▓▓░░░░░░░░░░░░░  低 = 強
//   HR/9  0.29  ▓░░░░░░░░░░░░░░░░  低 = 強
//
// CPBL league reference(2024 stats.cpbl 公開資料 derived):
//   - ERA   [2.00 elite · 6.00 poor]  LOWER better
//   - K/9   [5.00 poor  · 11.00 elite] HIGHER better
//   - WHIP  [1.00 elite · 1.70 poor]  LOWER better
//   - BB/9  [1.50 elite · 5.00 poor]  LOWER better
//   - HR/9  [0.30 elite · 2.00 poor]  LOWER better
//
// 任何 CPBL 數據工作者可發 PR 修正 ranges(brand IP pattern: 數據
// 範圍可被 audited / corrected · 同 /coverage NEVER list · 同
// /audit ESTIMATION DISCLOSURE)。
// ─────────────────────────────────────────────────────

import StatTerm from "@/components/StatTerm";

type StatKey = "ERA" | "K/9" | "WHIP" | "BB/9" | "HR/9";

const REFERENCE: Record<
  StatKey,
  { min: number; max: number; higherBetter: boolean }
> = {
  ERA: { min: 2.0, max: 6.0, higherBetter: false },
  "K/9": { min: 5.0, max: 11.0, higherBetter: true },
  WHIP: { min: 1.0, max: 1.7, higherBetter: false },
  "BB/9": { min: 1.5, max: 5.0, higherBetter: false },
  "HR/9": { min: 0.3, max: 2.0, higherBetter: false },
};

type Props = {
  /** Stat label · drives reference range lookup */
  stat: StatKey;
  /** Pitcher's actual value(string from lib/matches.ts) */
  value: string;
};

export default function StatPercentileBar({ stat, value }: Props) {
  const ref = REFERENCE[stat];
  const numeric = parseFloat(value);

  // Position 0-100 along the bar(left = min · right = max)
  let positionPct: number;
  if (Number.isNaN(numeric)) {
    positionPct = 50; // fallback to midpoint
  } else {
    const clamped = Math.max(ref.min, Math.min(ref.max, numeric));
    positionPct = ((clamped - ref.min) / (ref.max - ref.min)) * 100;
  }

  // "Strength" tier 用來決定 dot 色階(brand IP 配色:elite = 冷金 ·
  // mid = 骨白 · poor = mute)。 higherBetter 決定 strength 方向。
  const strength = ref.higherBetter ? positionPct : 100 - positionPct;
  const tier: "elite" | "mid" | "poor" =
    strength >= 70 ? "elite" : strength >= 30 ? "mid" : "poor";

  const dotColor =
    tier === "elite" ? "#D4AF37" : tier === "mid" ? "#F5F2EA" : "#8A93A8";
  const tierLabel =
    tier === "elite" ? "ELITE" : tier === "mid" ? "MID" : "REBUILD";

  const referenceTitle = ref.higherBetter
    ? `${stat} 高 = 強 · CPBL ref range ${ref.min}(poor)→ ${ref.max}(elite)· per /audit S02 ESTIMATION DISCLOSURE`
    : `${stat} 低 = 強 · CPBL ref range ${ref.min}(elite)→ ${ref.max}(poor)· per /audit S02 ESTIMATION DISCLOSURE`;

  return (
    <div
      className="grid grid-cols-[3.5rem_3rem_1fr_3rem] sm:grid-cols-[4rem_3.5rem_1fr_3.5rem] items-center gap-3 py-1.5"
      title={referenceTitle}
    >
      <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
        <StatTerm term={stat} />
      </span>
      <span className="font-mono text-bone tabular text-sm sm:text-base tracking-tight">
        {value}
      </span>
      <div
        className="relative h-[6px] bg-line/40 rounded-sm overflow-visible"
        role="img"
        aria-label={`${stat} ${value} · tier ${tierLabel}`}
      >
        {/* Brand-tier gradient backdrop · mute(left)→ bone(mid)→ gold(right).
            Direction matches "good" semantics: gold is always the elite end.
            For lower-better stats we flip the bar visually so the gold end
            stays on the LEFT(low values = good). */}
        <div
          className="absolute inset-0 rounded-sm opacity-40"
          style={{
            background: ref.higherBetter
              ? "linear-gradient(to right, rgba(138, 147, 168, 0.4), rgba(245, 242, 234, 0.5), rgba(212, 175, 55, 0.6))"
              : "linear-gradient(to right, rgba(212, 175, 55, 0.6), rgba(245, 242, 234, 0.5), rgba(138, 147, 168, 0.4))",
          }}
        />
        {/* Dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-sm"
          style={{
            left: `${positionPct}%`,
            backgroundColor: dotColor,
            boxShadow:
              tier === "elite" ? "0 0 6px rgba(212, 175, 55, 0.5)" : "none",
          }}
        />
      </div>
      <span
        className={`font-mono text-[9px] tracking-[0.25em] text-right ${
          tier === "elite"
            ? "text-gold"
            : tier === "mid"
            ? "text-bone/80"
            : "text-mute"
        }`}
      >
        {tierLabel}
      </span>
    </div>
  );
}
