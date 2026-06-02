import Link from "next/link";

// ── ZONE 27 · 引擎信號強度 meter(前身 ConfidenceStars · 已去五星)──
// 五星「★★★★★ STRONG SIGNAL」是報馬仔 / 賣明牌生態的視覺語彙 —— 一個會
// 公開自己過度自信、連 DIVERGED 都掛的量化品牌,不該在「單場」掛五顆金星
// 喊「強烈訊號」。 改成 quant 原生的分段強度條(同 StatPercentileBar /
// UncertaintyStripe 的語言):階梯式 5 段、亮金填滿 = 訊號越強,讀起來像
// 終端機儀表,不像算命仙的明牌。 機械對應(NO editorial · 純從引擎
// aiConfidence 推):
//   >=80 → 5 段 STRONG · 70-79 → 4 段 CLEAR · 60-69 → 3 段 DECENT ·
//   50-59 → 2 段 WEAK · <50 → 1 段 COIN-FLIP
// tooltip 仍一鍵連 /audit 的算法揭露(Pratfall 不藏)。
// ─────────────────────────────────────────────────────

type Props = {
  /** 引擎 aiConfidence 欄 · 0-100 整數 */
  confidence: number;
  /** "inline" 緊湊(賽事頁 hero)· "stack" 大 */
  variant?: "inline" | "stack";
  noTooltip?: boolean;
};

type Tier = { level: 1 | 2 | 3 | 4 | 5; label: string };

function tierFor(confidence: number): Tier {
  if (confidence >= 80) return { level: 5, label: "STRONG SIGNAL" };
  if (confidence >= 70) return { level: 4, label: "CLEAR SIGNAL" };
  if (confidence >= 60) return { level: 3, label: "DECENT SIGNAL" };
  if (confidence >= 50) return { level: 2, label: "WEAK SIGNAL" };
  return { level: 1, label: "COIN-FLIP" };
}

// 階梯式訊號條(equalizer 樣) · 越右越高、填滿到 level 為止
function Segments({ level, tall = false }: { level: number; tall?: boolean }) {
  const heights = tall
    ? ["h-2", "h-3", "h-4", "h-5", "h-6"]
    : ["h-1.5", "h-2", "h-2.5", "h-3", "h-3.5"];
  return (
    <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
      {heights.map((h, idx) => (
        <span
          key={idx}
          className={`block w-[3px] ${tall ? "sm:w-1" : ""} ${h} ${
            idx < level ? "bg-gold glow-gold" : "bg-line/60"
          }`}
        />
      ))}
    </span>
  );
}

export default function ConfidenceStars({
  confidence,
  variant = "inline",
  noTooltip = false,
}: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(confidence)));
  const { level, label } = tierFor(clamped);

  const tooltipText = noTooltip
    ? undefined
    : `引擎信號強度 ${clamped}/100 · 純從引擎變異數機械推算 · 不是編輯也不是個人明牌 · 算法見 /audit`;

  if (variant === "stack") {
    return (
      <div className="inline-flex flex-col items-start gap-1.5" title={tooltipText}>
        <div className="flex items-end gap-2.5">
          <span aria-label={`引擎信號強度 ${level}/5 · ${label}`}>
            <Segments level={level} tall />
          </span>
          <span className="font-mono text-bone text-[10px] tracking-[0.35em] leading-none">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-mute text-[9px] tracking-[0.25em] tabular">
            信號強度 {clamped}/100
          </span>
          {!noTooltip && (
            <Link
              href="/audit#disclosure"
              className="font-mono text-mute/60 hover:text-gold text-[9px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
              title="這個強度怎麼算出來的"
            >
              方法?
            </Link>
          )}
        </div>
      </div>
    );
  }

  // inline · 緊湊 1 行
  return (
    <span className="inline-flex items-center gap-2" title={tooltipText}>
      <span aria-label={`引擎信號強度 ${level}/5 · ${label}`}>
        <Segments level={level} />
      </span>
      <span className="font-mono text-mute text-[9px] tracking-[0.3em]">{label}</span>
    </span>
  );
}
