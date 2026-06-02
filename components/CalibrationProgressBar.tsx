// ── ZONE 27 · Calibration Progress Bar ──────────────────
// R66 W-B · Agent psychology synthesize ship #3 · Goal Gradient
// effect(Hull 1932 · Kivetz/Urminsky/Zheng 2006)applied to ZONE 27
// N≥30 statistical-meaningfulness threshold。
//
// Per agent ship #3 · 「motivation increases as goal nears · 20%
// purchase acceleration near reward threshold(Kivetz 2006 cafe study)」
// · ZONE 27 analog = return-visit acceleration as N approaches 30。
//
// CRITICAL anti-pattern avoided(per agent #2 of 5):
//   ✕ NO illusionary head-start dots · NO「fake N=4 when it's N=1」 ·
//     transparent statistical meaningfulness · 不裝 progress · per
//     [[zone27-disclosure-philosophy]] axiom
//   ✕ NO streak farming · NO daily-login bait · NO「您 streak 47 天
//     將失去!」 · counter naturally fills as Tim ingests real receipts
//   ✕ NO「badge unlock」 dopamine · counter is just statistics literacy ·
//     N≥30 is Bill James 1985 convention(per /glossary Z27 LEXICON)
//
// Single source of truth:N value passed from parent · uses same
// math as `app/track-record/page.tsx:733` (moreToThreshold = max(0, 30-N))。
// Mounted ABOVE FirstReceiptHero(/track-record)+ /calibration header。
//
// Brand IP fit:
//   - [[zone27-disclosure-philosophy]] · transparent progress · honest count
//   - [[feedback-zone27-pratfall-brand-ip]] · N=1 shown small · 不藏 sample
//     debt · counter IS pratfall surface itself
//   - [[zone27-musk-methodology]] · 5-step「reduce part count」 · 1 progress
//     bar · 0 gamification · pure statistics literacy
// ─────────────────────────────────────────────────────

type Props = {
  /** Current finalized match count · from getFinalizedMatches().length */
  totalN: number;
  /** Optional · target threshold(default 30 · Bill James convention)*/
  threshold?: number;
  /** Optional · "compact" variant for sidebar / inline display */
  variant?: "default" | "compact";
};

export default function CalibrationProgressBar({
  totalN,
  threshold = 30,
  variant = "default",
}: Props) {
  const pct = Math.min(100, Math.round((totalN / threshold) * 100));
  const remaining = Math.max(0, threshold - totalN);
  const isMet = totalN >= threshold;

  return (
    <section
      aria-labelledby="calibration-progress-heading"
      className={
        variant === "compact"
          ? "mx-auto max-w-md w-full"
          : "mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8"
      }
    >
      <div className="flex items-baseline justify-between gap-2 flex-wrap mb-2">
        <p
          id="calibration-progress-heading"
          className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em]"
        >
          / 樣本累積 · 滿 30 場才算數
        </p>
        <p className="font-mono text-mute text-[10px] sm:text-[11px] tracking-[0.25em] tabular">
          {isMet ? (
            <span className="text-gold">已 {totalN} 場 · 達標 ✓</span>
          ) : (
            <>
              已 <span className="text-bone">{totalN}</span>
              <span className="text-mute/60"> / {threshold} 場</span>
              <span className="text-mute/60 mx-2">·</span>
              <span className="text-loss/80">還差 {remaining} 場</span>
            </>
          )}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={totalN}
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-label={`樣本累積進度 · 已結算 ${totalN} / ${threshold} 場 · 距離滿 30 場還有 ${pct}%`}
        className="relative h-[3px] bg-line/60 overflow-hidden"
      >
        <div
          /* R159 W3.K4 · Agent K · transition-all → explicit list · 之前 sole
             site-wide transition-all violation · Vercel Geist canonical anti-
             pattern · animates every changing property including future bg/
             color toggles risking unintended layout · 改 [width,background-
             color,box-shadow] explicit per UncertaintyStripe.tsx:79 pattern。 */
          className={`absolute top-0 left-0 h-full transition-[width,background-color,box-shadow] duration-700 ease-out ${
            isMet ? "bg-gold glow-gold" : "bg-gold/80"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.25em] leading-relaxed">
        {isMet ? (
          <>
            ✓ <span className="text-bone">已滿 30 場</span> ·
            到這裡準度數字才真的有意義 · 在這之前任何結論都可能只是運氣。
          </>
        ) : (
          <>
            ▸ 老實的計數器 · 不灌水 · 每一場都是賽後親手登錄真實比分 ·
            不回填、不挑好看的。 滿 30 場之前 · 準度數字先別當真。
          </>
        )}
      </p>
    </section>
  );
}
