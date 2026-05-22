// ── ZONE 27 · Lens Trace · Dynamic Pipeline Disclosure ─
// Round 38 W-H · Agent A #4 ship · Smashing Magazine 2026「AI Transparency
// Patterns」「Dynamic Checklist」 pattern for high-stakes ML workflows ·
// per [[feedback-no-waiting-rule]] iron rule。
//
// Brand IP「不靠直覺 · 只看演算法 · We Don't Guess. We Compute.」 literally
// visualized · 多數「AI」 sites 只 show output(prediction X%)· ZONE 27 開
// 給看 actual deterministic pipeline 跑了 N 步 · static trace · NOT 假
// loading spinner · NOT chatbot widget(rejected pattern per Agent A
// reject list)· 純 server-rendered breadcrumb of deterministic compute。
//
// 4 lenses 對應 4 trace 步驟集合(都從 existing data derived · 0 new compute):
//   - WinProbability · 10K Monte Carlo
//   - VibeCheck · streak count from last-5 array
//   - ParkFactor · venue lookup + baseline delta
//   - PitcherFatigue · WHIP + BB9 + K9 tier classify
//
// Brand-pure 結構:
//   1. Header「ENGINE TRACE · v0.2 PIPELINE」 mono
//   2. N-step checklist · 每步 monoFont + ✓ + 1-line plain language explainer
//   3. Footer「ALL STEPS DETERMINISTIC · 重跑 N=10K seed-fixed 相同結果」
//   4. Link to lib/simulator.ts on GitHub(method-public literal verification)
//
// Render placement:/matches/[gameId] · 之後考慮其他 lens pages。
// ─────────────────────────────────────────────────────

type TraceStep = {
  /** Short mono uppercase label · 同 LensRow pattern */
  step: string;
  /** 1-line plain language explainer · fan grammar 不 academic */
  explainer: string;
  /** Optional source data citation · file or function name */
  source?: string;
};

type Props = {
  steps: TraceStep[];
  /** Engine variant label · 同 EngineStamp 「v0.2 PITCHER-ONLY MC」 etc. */
  engineLabel: string;
  /** Optional GitHub source link · default /lib/simulator.ts canonical */
  sourceLink?: string;
};

const DEFAULT_SOURCE_LINK =
  "https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts";

export default function LensTrace({
  steps,
  engineLabel,
  sourceLink = DEFAULT_SOURCE_LINK,
}: Props) {
  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          / ENGINE TRACE · {engineLabel}
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          DETERMINISTIC · OPEN PIPELINE
        </span>
      </div>

      <ol className="space-y-2.5">
        {steps.map((s, i) => (
          <li
            key={i}
            className="grid grid-cols-[auto_1fr] gap-3 items-baseline"
          >
            <span
              lang="en"
              className="font-mono text-gold/80 text-[10px] tracking-[0.3em] tabular"
            >
              ✓ {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                lang="en"
                className="font-mono text-bone text-xs tracking-[0.2em]"
              >
                {s.step}
              </p>
              <p className="text-mute text-xs leading-relaxed mt-1">
                {s.explainer}
              </p>
              {s.source && (
                <p className="font-mono text-mute/60 text-[9px] tracking-[0.22em] mt-1">
                  ← {s.source}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Brand IP · deterministic literal verification */}
      <div className="mt-5 pt-4 border-t border-line/40 flex items-baseline justify-between gap-3 flex-wrap">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] leading-relaxed flex-1 min-w-0">
          ALL STEPS DETERMINISTIC · 重跑 N=10,000 seed-fixed 相同結果 ·
          0 LLM · 0 chatbot · 純 deterministic compute。
        </p>
        <a
          href={sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-gold/80 hover:text-gold text-[9px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors shrink-0"
        >
          GITHUB · lib/simulator.ts →
        </a>
      </div>
    </article>
  );
}

// ── Pre-baked step recipes · used in /matches/[gameId] section 02.5 ────
// Stays in same file for now · split when 5+ recipes accumulate。
// ─────────────────────────────────────────────────────

export const ENGINE_V02_TRACE_STEPS: TraceStep[] = [
  {
    step: "PULL PITCHER STATS",
    explainer:
      "從 lib/cpbl-pitchers.ts 抓投手 K/9 · BB/9 · HR/9 · ERA · WHIP(npm run fetch-cpbl 從 cpbl.com.tw daily refresh)",
    source: "lib/cpbl-pitchers.ts",
  },
  {
    step: "RUN MONTE CARLO N=10,000",
    explainer:
      "瀏覽器內 10,000 場逐打席模擬 · 每打席用 K/9 · BB/9 · HR/9 抽結果 · 90% CI 從 binomial SE = √(p̂(1-p̂)/N) 算",
    source: "lib/simulator.ts",
  },
  {
    step: "AGGREGATE WIN PROBABILITY",
    explainer:
      "10K 場結果累加 · home 贏佔比 = win probability · NOT 「我們覺得」 · 是 10K 次重複實驗的相對頻率",
    source: "lib/simulator.ts · runMonteCarlo()",
  },
  {
    step: "COMPUTE AI CONFIDENCE",
    explainer:
      "Sim variance derive confidence(低 variance · 兩隊差距大 = high confidence ★★★★★)· 映射 ConfidenceStars 1-5",
    source: "components/ConfidenceStars.tsx",
  },
  {
    step: "BOUND UNCERTAINTY · BINOMIAL CI",
    explainer:
      "在 win probability 下方畫 Uncertainty Stripe(Bank of England fan-chart pattern)· 90% CI band 視覺顯示「引擎不給命運 · 只給機率」",
    source: "components/UncertaintyStripe.tsx",
  },
];
