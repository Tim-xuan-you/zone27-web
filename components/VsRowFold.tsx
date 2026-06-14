import Link from "next/link";

// ── ZONE 27 · VsRowFold ─────────────────────────────────
// R138 W5 · Agent A R138 SHIP 2 · Contrast Principle (Cialdini ch.1) +
// Decoy Effect (Ariely 2008 "Predictably Irrational"). 3-column visual
// comparison · 付費明牌 vs 黑箱模型 vs ZONE 27 · ZONE 27 column 唯一
// 接近全亮(per Pratfall axiom · 我們 column 包含 ◐ sample-debt honest)。
//
// Brand IP safety:
//   - Per Agent A R138 risk mitigation · label columns by CATEGORY mode
//     not specific brand names · 「付費明牌」 vs 「黑箱模型」 taxonomy
//     instead of 玩運彩 / Stratechery-named callout · Stratechery pattern
//     ("incumbent media" not specific outlets)
//   - Dotted-circle icons (●◐○) not values · visual contrast does work
//   - Pratfall preserved · ZONE 27 column includes ◐(sample-debt N=1
//     honest empty)so column 不讀 as 自吹自擂 · per
//     [[feedback-zone27-pratfall-brand-ip]]
//   - 「源頭可 verify」 axis 加 Link to /audit + /integrity + /track-record
//     · 訪客 click 自己 audit · brand IP「方法公開」 8-字 grammar 守
//   - per [[feedback-zone27-audience-fans-not-engineers]] · uses 球迷
//     grammar 不 academic taxonomy(「付費明牌」 球迷 listen-know)
//
// Psychology axis:
//   - Contrast Principle (Cialdini Influence ch.1) · row-by-row visual
//     contrast triggers anchoring shift · 訪客 sees ZONE 27 as obviously
//     superior across 全 axis NOT 1 axis
//   - Decoy Effect (Ariely 2008) · 「黑箱模型」 middle column acts as
//     asymmetric dominance decoy · 訪客 sees ZONE 27 dominates middle
//     column on more axes than middle column dominates 付費明牌 · pushes
//     choice to ZONE 27 by structural asymmetry
//   - per [[feedback-zone27-psychology-ux-axis]] · academic mechanism
//     cited per ship discipline
//
// Surface placement(per Agent A R138 recommendation):
//   - /founders pre-WaitlistForm · primary revenue page conversion fold
//   - /pricing/why post-§07 12-fact data table · visual companion to text
//     wall · pairs Contrast + Costly Signaling
// ─────────────────────────────────────────────────────

type RowState = "full" | "partial" | "none";

type ComparisonRow = {
  axis: string;
  /** 付費明牌 / LINE 老師 / 報馬仔 / 玩運彩 paid tipster 模式 typical state */
  paidTip: RowState;
  /** Generic 黑箱分析平台 closed-model 模式 typical state */
  closedModel: RowState;
  /** ZONE 27 */
  zone27: RowState;
  /** Optional honest annotation on ZONE 27 cell · per Pratfall axiom */
  zone27Note?: string;
};

const ROWS: ComparisonRow[] = [
  {
    axis: "公開引擎方法(演算法 · 假設 · 排除清單)",
    paidTip: "none",
    closedModel: "none",
    zone27: "full",
  },
  {
    axis: "公開自己的弱點與失誤(/integrity · /steelman)",
    paidTip: "none",
    closedModel: "none",
    zone27: "full",
  },
  {
    axis: "賽後 receipt(PROVED · DIVERGED 等大 公開 ledger)",
    paidTip: "none",
    closedModel: "partial",
    zone27: "full",
  },
  {
    axis: "拒絕原因公開(/founders/ledger #refusals)",
    paidTip: "none",
    closedModel: "none",
    zone27: "full",
  },
  {
    axis: "創辦人具名 + 一手 maintain(by Tim · 100% solo)",
    paidTip: "partial",
    closedModel: "partial",
    zone27: "full",
  },
  {
    axis: "0 抽下注分成 · 0 affiliate revenue",
    paidTip: "none",
    closedModel: "partial",
    zone27: "full",
  },
  {
    axis: "Sample-debt 公開(N=X / N≥30 thresholds 透明)",
    paidTip: "none",
    closedModel: "none",
    zone27: "partial",
    zone27Note: "N=1 honest",
  },
];

const STATE_TO_GLYPH: Record<RowState, string> = {
  full: "●",
  partial: "◐",
  none: "○",
};

const STATE_TO_CLASS: Record<RowState, string> = {
  full: "text-gold",
  partial: "text-mute",
  none: "text-mute/35",
};

export default function VsRowFold() {
  return (
    <section
      aria-label="ZONE 27 vs 黑箱模型 vs 付費明牌 · 7-axis 公開度對照"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-y border-line/40"
    >
      <p
        lang="en"
        className="font-mono text-gold/85 text-[10px] tracking-[0.45em] mb-3"
      >
        / 公開度 ROW BY ROW · WHAT ACTUALLY DIFFERS
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
        7 條 axis · ZONE 27 唯一接近全亮
      </h2>
      <p className="text-mute text-sm leading-relaxed mb-8 max-w-xl">
        不講對手名字 · 直接看 mode 對照。
        <span className="font-mono text-gold mx-1">●</span>= 完整公開 ·
        <span className="font-mono text-mute mx-1">◐</span>= 部份公開 ·
        <span className="font-mono text-mute/35 mx-1">○</span>= 不公開 / 不存在。
        ZONE 27 這欄不是完美 · 樣本數那一條我們也只給半亮 ◐
        (目前只有 1 場驗證過 · 老實標出來 · 不假裝全部做到)。
      </p>

      <div className="overflow-x-auto -mx-6 sm:-mx-10 px-6 sm:px-10">
        <table className="w-full text-sm tabular border-collapse">
          <thead>
            <tr className="border-b border-line/50">
              <th className="text-left py-3 pr-4 font-mono text-mute text-[10px] tracking-[0.3em] font-normal align-bottom">
                axis
              </th>
              <th className="text-center py-3 px-2 font-mono text-mute/70 text-[10px] tracking-[0.25em] font-normal align-bottom">
                付費明牌
                <span className="block text-[9px] tracking-[0.2em] text-mute/50 mt-1 normal-case">
                  收費老師 · 明牌站
                </span>
              </th>
              <th className="text-center py-3 px-2 font-mono text-mute/70 text-[10px] tracking-[0.25em] font-normal align-bottom">
                黑箱模型
                <span className="block text-[9px] tracking-[0.2em] text-mute/50 mt-1 normal-case">
                  closed-source
                </span>
              </th>
              <th className="text-center py-3 px-2 font-mono text-gold text-[10px] tracking-[0.25em] font-normal align-bottom">
                ZONE 27
                <span className="block text-[9px] tracking-[0.2em] text-gold/60 mt-1 normal-case">
                  by Tim
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.axis} className="border-b border-line/20">
                <td className="text-mute py-3 pr-4 leading-snug align-middle">
                  {row.axis}
                </td>
                <td
                  className={`text-center py-3 px-2 text-lg align-middle ${STATE_TO_CLASS[row.paidTip]}`}
                >
                  {STATE_TO_GLYPH[row.paidTip]}
                </td>
                <td
                  className={`text-center py-3 px-2 text-lg align-middle ${STATE_TO_CLASS[row.closedModel]}`}
                >
                  {STATE_TO_GLYPH[row.closedModel]}
                </td>
                <td
                  className={`text-center py-3 px-2 text-lg align-middle ${STATE_TO_CLASS[row.zone27]}`}
                >
                  {STATE_TO_GLYPH[row.zone27]}
                  {row.zone27Note && (
                    <span className="block font-mono text-[8px] tracking-[0.2em] text-mute mt-1 normal-case">
                      {row.zone27Note}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-mute/70 text-xs leading-relaxed mt-6 max-w-xl">
        Source · 全 axis 對應 公開頁面 · 您可 click 自己 verify:
        {" "}
        <Link href="/audit" className="text-gold/85 underline-offset-4 hover:underline">
          /audit
        </Link>
        {" · "}
        <Link href="/integrity" className="text-gold/85 underline-offset-4 hover:underline">
          /integrity
        </Link>
        {" · "}
        <Link href="/track-record" className="text-gold/85 underline-offset-4 hover:underline">
          /track-record
        </Link>
        {" · "}
        <Link
          href="/founders/ledger"
          className="text-gold/85 underline-offset-4 hover:underline"
        >
          /founders/ledger
        </Link>
        {" · "}
        <Link href="/about" className="text-gold/85 underline-offset-4 hover:underline">
          /about
        </Link>
        。
      </p>
      {/* R165 W1 · R164 deleted /heritage + /pricing/why · 2 surface-specific CTAs removed
        (12-fact PRECEDENT BENCHMARKS + DELTA-of-CPBL anchors) per Apple discipline */}
    </section>
  );
}
