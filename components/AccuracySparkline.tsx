import type { AccuracyPoint } from "@/lib/predictions";

// ── ZONE 27 · 準度歷程 sparkline(soul-roadmap R208 #2 · 會動的數字 = 回訪鉤)──────
// 一條極簡的線:隨著一場一場結算,你的累積命中率怎麼爬/掉。 inline SVG · 0 依賴
// (鏡 /calibration ReliabilityDiagram 的做法)· 暗金單線 + 一條淡淡的「亂猜 50%」
// 基準虛線(同校準卡的語言)。 無格線、無座標軸標籤、無動畫、無漸層 —— 克制。
//
// Y 軸固定 0-100(不放大小差距 = 不捏造精確度)· X 軸 = 累積場數。 序列怎麼算 =
// lib/predictions.ts computeAccuracySeries(按比賽日累計 · 先鎖後結)。 低樣本由
// caller 決定要不要掛(這裡只負責畫;< 2 點畫不成線 → 回 null)。
// ─────────────────────────────────────────────────────

const W = 300;
const H = 52;
const PAD_X = 5;
const PAD_Y = 7;

export default function AccuracySparkline({
  series,
  className = "",
}: {
  series: AccuracyPoint[];
  className?: string;
}) {
  if (series.length < 2) return null; // 一個點畫不成歷程

  const n = series.length;
  const x = (i: number) => PAD_X + (i / (n - 1)) * (W - 2 * PAD_X);
  const y = (acc: number) => H - PAD_Y - (acc / 100) * (H - 2 * PAD_Y);

  const linePts = series.map((p, i) => `${x(i).toFixed(1)},${y(p.accuracy).toFixed(1)}`).join(" ");
  const last = series[n - 1];
  const first = series[0];

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        preserveAspectRatio="none"
        aria-label={`準度歷程 · 從 ${first.accuracy}% 到目前 ${last.accuracy}% · 累積 ${n} 場已結算`}
      >
        {/* 亂猜 50% 基準虛線(同校準卡語言) */}
        <line
          x1={x(0)}
          y1={y(50)}
          x2={x(n - 1)}
          y2={y(50)}
          stroke="rgba(138, 147, 168, 0.35)"
          strokeWidth="1"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
        {/* 準度線 · 暗金 */}
        <polyline
          points={linePts}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeOpacity="0.85"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* 終點 · 現在落點 */}
        <circle cx={x(n - 1)} cy={y(last.accuracy)} r="2.6" fill="#D4AF37" />
      </svg>
    </div>
  );
}
