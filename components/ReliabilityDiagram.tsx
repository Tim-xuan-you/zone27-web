import { type CalibrationBin } from "@/lib/calibration";

// ── ZONE 27 · 引擎校準散點圖(reliability diagram)· 三運動共用 ────────────────
// 「引擎說的 vs 實際發生」· 橫軸=引擎賽前看好的成數,直軸=實際真的中的成數。
// 點越靠 45° 金色斜線 = 引擎「說幾成、就真的中幾成」。 純 SVG(0 deps · server
// component · 不 share local state)· /calibration 與 /engines 同畫一張、零 drift。
//
// 之前內嵌在 app/calibration/page.tsx · R263 抽出共用(那頁註解早就預告此 refactor)。
// 538「Checking Our Work」式:含命中也含落空、滿 30 場才算數的誠實由呼叫端的 frame 處理,
// 本元件只負責畫圖 + 「喊幾成、真的中幾成」的白話判決層。
// ─────────────────────────────────────────────────────

export default function ReliabilityDiagram({
  bins,
  n,
  engineVersion,
  sportLabel,
}: {
  bins: CalibrationBin[];
  n: number;
  engineVersion: string;
  /** 選填運動別(/engines 同頁 3 張圖時 · 讓 screen reader 分得出哪一運動)。 */
  sportLabel?: string;
}) {
  const sportPrefix = sportLabel ? `${sportLabel} · ` : "";
  // SVG coordinate system: 400x400 with 40px left/bottom margin · 20px top/right
  const px = (pct: number) => 40 + (pct / 100) * 340;
  const py = (pct: number) => 360 - (pct / 100) * 340;

  return (
    <div className="bg-slate/30 border border-line/60 p-5 sm:p-8">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          / 引擎說的 vs 實際發生
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
          引擎 {engineVersion} · 已 {n} 場
        </p>
      </div>
      <div className="aspect-square max-w-md mx-auto">
        <svg
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          role="img"
          aria-label={
            n === 0
              ? `${sportPrefix}引擎準度對照圖 · 引擎說的成數對上實際中的成數 · 目前還沒有資料`
              : `${sportPrefix}引擎準度對照圖 · 已畫上 ${n} 場 · 引擎說的成數對上實際中的成數`
          }
        >
          {/* Grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={px(0)}
                y1={py(v)}
                x2={px(100)}
                y2={py(v)}
                stroke="rgba(138, 147, 168, 0.12)"
                strokeWidth="1"
              />
              <line
                x1={px(v)}
                y1={py(0)}
                x2={px(v)}
                y2={py(100)}
                stroke="rgba(138, 147, 168, 0.12)"
                strokeWidth="1"
              />
            </g>
          ))}
          {/* Axes */}
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(100)}
            y2={py(0)}
            stroke="rgba(138, 147, 168, 0.6)"
            strokeWidth="1"
          />
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(0)}
            y2={py(100)}
            stroke="rgba(138, 147, 168, 0.6)"
            strokeWidth="1"
          />
          {/* 45° perfect calibration line */}
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(100)}
            y2={py(100)}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Bins */}
          {n === 0
            ? [55, 65, 75, 85].map((v) => (
                <circle
                  key={v}
                  cx={px(v)}
                  cy={py(v)}
                  r="3"
                  fill="none"
                  stroke="rgba(138, 147, 168, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              ))
            : bins.map((b) => {
                const radius = Math.min(3 + b.count * 1.5, 12);
                // 每個金點可聚焦 + 語音/hover 讀出該桶白話判決(details-on-demand · 鍵盤可達)。
                const low = Math.max(0, b.centerPct - 5);
                const high = Math.min(100, b.centerPct + 5);
                const dotLabel = `引擎喊 ${low}–${high}% 看好的那 ${b.count} 場 · 真的中了 ${Math.round(b.favoriteActualPct)}%`;
                return (
                  <g key={b.centerPct} tabIndex={0} role="img" aria-label={dotLabel}>
                    <title>{dotLabel}</title>
                    <circle
                      cx={px(b.centerPct)}
                      cy={py(b.favoriteActualPct)}
                      r={radius}
                      fill="#D4AF37"
                      fillOpacity={0.85}
                      stroke="#0F1A2E"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
          {/* Axis tick labels */}
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <text
                x={px(v)}
                y={py(0) + 18}
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(138, 147, 168, 0.85)"
                textAnchor="middle"
              >
                {v}%
              </text>
              <text
                x={px(0) - 8}
                y={py(v) + 3}
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(138, 147, 168, 0.85)"
                textAnchor="end"
              >
                {v}%
              </text>
            </g>
          ))}
          {/* Axis labels */}
          <text
            x={px(50)}
            y={py(0) + 36}
            fontSize="9"
            fontFamily="monospace"
            fill="rgba(212, 175, 55, 0.85)"
            textAnchor="middle"
            letterSpacing="0.18em"
          >
            引擎看好幾成
          </text>
          <text
            x={px(0) - 32}
            y={py(50)}
            fontSize="9"
            fontFamily="monospace"
            fill="rgba(212, 175, 55, 0.85)"
            textAnchor="middle"
            letterSpacing="0.18em"
            transform={`rotate(-90 ${px(0) - 32} ${py(50)})`}
          >
            實際中幾成
          </text>
        </svg>
      </div>

      {/* ── 白話判決層(538「Checking Our Work」caption)─────────────────
          散點圖只有座標軸 + 金點,賭徒(非分析師)讀不出「引擎說 70% 的時候、實際贏多少?」。
          這層用「一句一桶」的白話直接回答 —— 引擎喊幾成看好、那幾場真的中幾成。
          🔴 誠實:每行掛場數 + N<30 caveat · 不下精確結論 · 純白話不出現 Brier / 校準
          等術語 · 無紅綠(實際命中率一律金)。 */}
      {n > 0 && bins.length > 0 && (
        <div className="mt-5 pt-5 border-t border-line/40">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-3">
            / 白話講 · 喊幾成、真的中幾成
          </p>
          <ul className="space-y-1.5">
            {bins.map((b) => {
              const low = Math.max(0, b.centerPct - 5);
              const high = Math.min(100, b.centerPct + 5);
              return (
                <li
                  key={b.centerPct}
                  className="text-mute text-[13px] sm:text-sm leading-relaxed"
                >
                  引擎喊{" "}
                  <span className="font-mono tabular text-bone">
                    {low}–{high}%
                  </span>{" "}
                  看好的那 <span className="font-mono tabular text-bone">{b.count}</span> 場
                  —— 真的中了{" "}
                  <span className="font-mono tabular text-gold">
                    {Math.round(b.favoriteActualPct)}%
                  </span>
                  。
                </li>
              );
            })}
          </ul>
          <p className="mt-3 font-mono text-mute text-[10px] tracking-[0.15em] leading-relaxed">
            ▸ 「喊幾成」越貼近「中幾成」· 引擎就越誠實 —— 這正是上面那條金色斜線的意思。
            {n < 30 && <> 目前才 {n} 場 · 還看不出穩定名堂,多打幾場才算數。</>}
          </p>
        </div>
      )}
    </div>
  );
}
