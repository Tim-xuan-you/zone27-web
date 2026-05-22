// ── ZONE 27 · Advanced Stat Bar(percentile mode)─────
// Round 31 W-U · Sister to W-B StatPercentileBar · 直接接 stats.cpbl.com.tw
// 中職百分位(0-100)Trackman radar 數據 · 不需自己估 league range。
//
// 差異:
//   - StatPercentileBar takes value + uses internal CPBL ref range
//     (early-season estimate · 隨季 progress 越精確)
//   - AdvancedStatBar takes percentile directly · stats.cpbl.com.tw
//     已經算好 league context · 100 = elite · 0 = poor(投手 context:
//     wOBA-against 高 percentile 也是好的 · CPBL UI convention)
//
// 配色同 W-B:冷金 (elite) → 骨白 (mid) → mute (poor) gradient
// ─────────────────────────────────────────────────────

type Props = {
  /** Stat label · 中文 short name */
  label: string;
  /** Percentile 0-100 · null = no data */
  percentile: number | null;
  /** Optional raw value display (e.g. "25.3%") */
  rawValue?: string;
};

export default function AdvancedStatBar({ label, percentile, rawValue }: Props) {
  if (percentile === null || !Number.isFinite(percentile)) {
    return (
      <div className="grid grid-cols-[5.5rem_3.5rem_1fr_3.5rem] sm:grid-cols-[6rem_4rem_1fr_4rem] items-center gap-3 py-1.5">
        <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
          {label}
        </span>
        <span className="font-mono text-mute/50 text-sm">—</span>
        <div className="h-[6px] bg-line/30 rounded-sm" />
        <span className="font-mono text-mute/50 text-[9px] tracking-[0.25em] text-right">
          NO DATA
        </span>
      </div>
    );
  }

  const tier: "elite" | "mid" | "poor" =
    percentile >= 70 ? "elite" : percentile >= 30 ? "mid" : "poor";
  const dotColor =
    tier === "elite" ? "#D4AF37" : tier === "mid" ? "#F5F2EA" : "#8A93A8";
  const tierLabel =
    tier === "elite" ? "ELITE" : tier === "mid" ? "MID" : "POOR";

  return (
    <div
      className="grid grid-cols-[5.5rem_3.5rem_1fr_3.5rem] sm:grid-cols-[6rem_4rem_1fr_4rem] items-center gap-3 py-1.5"
      title={`${label} · 中職百分位 ${percentile}(投手 context:100 = elite · 0 = poor)· source stats.cpbl.com.tw + Trackman radar`}
    >
      <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
        {label}
      </span>
      <span className="font-mono text-bone tabular text-sm sm:text-base tracking-tight">
        {rawValue ?? `${percentile}%`}
      </span>
      <div className="relative h-[6px] bg-line/40 rounded-sm overflow-visible">
        <div
          className="absolute inset-0 rounded-sm opacity-40"
          style={{
            background:
              "linear-gradient(to right, rgba(138, 147, 168, 0.4), rgba(245, 242, 234, 0.5), rgba(212, 175, 55, 0.6))",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-sm"
          style={{
            left: `${percentile}%`,
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
