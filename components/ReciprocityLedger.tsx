import Link from "next/link";
import { RECIPROCITY_LEDGER, RECIPROCITY_COUNT } from "@/lib/reciprocity-ledger";

// ── ZONE 27 · Reciprocity Ledger ────────────────────────
// R74 W-A · Agent A R73 SHIP 3 · Cialdini Reciprocity Principle(1984)·
// 16 concrete artifacts ZONE 27 PUBLISHED before asking for NT$ 2,700 /
// NT$ 1,500/season(R81 pivot 自 NT$ 299/月)。 give-first triggers
// obligation-to-reciprocate · same axis
// as Berkshire Hathaway annual letter library + Patek Philippe Movement
// Schematic Library + Anthropic Model Card library · ZONE 27 differentiator
// is concentrating the give in one navigable receipt(competitors give but
// don't publish the give-list)。
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · 「方法公開」 grammar 物理 codify
//   - per [[feedback-zone27-pratfall-brand-ip]] · same publish-weakness axiom
//   - per /audit S05 PRE-COMMIT clause · append-only discipline · 修改需 30 天
//     /changelog notice
//   - per Cialdini Influence(1984)Ch 2 Reciprocity · pre-gift before ask
//
// Surfaces:
//   - /pricing/why §06(compact)· buy-line reciprocity surface
//   - /transparency NEW section(manifest full)· aggregator surface
//
// Defaults to「ledger」 variant(full)· /pricing/why §06 may use「compact」。
// ─────────────────────────────────────────────────────

type Props = {
  /** Visual density · "ledger"(full · for /transparency)or "compact"
   *  (top-6 inline list · for /pricing/why §06)· same architecture as
   *  R73 W-D NoPushManifest 2-variant pattern。 */
  variant?: "ledger" | "compact";
};

export default function ReciprocityLedger({ variant = "ledger" }: Props) {
  if (variant === "compact") {
    // Compact inline · single block for /pricing/why §06 buy-line surface
    return (
      <section
        aria-label="Reciprocity Ledger · 16 artifacts"
        className="border border-line/50 bg-slate/30 px-5 sm:px-6 py-4 sm:py-5"
      >
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3"
        >
          ⚓ RECIPROCITY LEDGER · {RECIPROCITY_COUNT} ARTIFACTS PUBLISHED FIRST
        </p>
        <p className="text-mute text-sm leading-relaxed mb-3">
          ZONE 27 在 NT$ 1,500/season + NT$ 2,700 一次性 ASK 之前 ·{" "}
          <strong className="text-bone">已 publish {RECIPROCITY_COUNT} 件</strong>{" "}
          · Cialdini Reciprocity Principle(1984)· give-first triggers
          obligation-to-reciprocate · LINE 老師 / 報馬仔 是 ASK-first-give-never
          · 我們是 inverse。 同 Berkshire 70 年 annual letters + Patek 200 年
          movement schematics + Anthropic model cards public library pattern。
        </p>
        <ul className="font-mono text-mute/85 text-[11px] tracking-[0.18em] leading-relaxed space-y-1 tabular">
          {RECIPROCITY_LEDGER.slice(0, 6).map((item, idx) => (
            <li key={idx}>
              <span className="text-gold/85 mr-2" aria-hidden="true">▸</span>
              {item.what}
            </li>
          ))}
          <li className="text-mute/60 italic mt-2">
            + {RECIPROCITY_COUNT - 6} more · see{" "}
            <Link
              href="/transparency#reciprocity-ledger"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              /transparency
            </Link>
          </li>
        </ul>
      </section>
    );
  }

  // Default · ledger full variant · for /transparency section
  return (
    <section
      id="reciprocity-ledger"
      aria-label="Reciprocity Ledger · 16 artifacts published before asking"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14 pt-10 border-t border-line/40 scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <span
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
        >
          / RECIPROCITY LEDGER
        </span>
        <span
          lang="en"
          className="font-mono text-mute text-[10px] tracking-[0.3em] tabular"
        >
          {RECIPROCITY_COUNT} PUBLISHED-BEFORE-ASK · APPEND-ONLY
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-4">
        {RECIPROCITY_COUNT} 件 ZONE 27{" "}
        <span className="text-gold">已 publish</span> 之後才 ask
      </h2>

      <p className="text-mute leading-relaxed mb-4">
        Berkshire Hathaway / Patek Philippe / Anthropic · 它們 retain customer
        trust at premium price WITH publish-first-ask-later grammar ·{" "}
        <strong className="text-bone">
          give triggers obligation-to-reciprocate
        </strong>{" "}
        · Cialdini Influence(1984)Chapter 2 Reciprocity Rule · pre-gift
        compulsion is universal · CPBL fan audience burned by LINE 老師
        ask-first-give-never pattern-match this inversion instantly。
      </p>
      <p className="text-mute leading-relaxed mb-6">
        差別是 · 它們 invisible give-list(不 publish what they already published)·
        ZONE 27{" "}
        <strong className="text-bone">PUBLISH the give-list itself</strong> ·
        因為 hardcore CPBL fans burned by LINE 老師「pre-cap 推銷 / 收佣後消失」
        pattern · receipt-of-already-given 即 trust。 同 11「永遠不做」 +
        NO-PUSH MANIFEST + Tim Response SLA 集中 surface 一個 navigable receipt。
      </p>

      <ol className="space-y-3 mt-6">
        {RECIPROCITY_LEDGER.map((item, idx) => {
          const isExternal = item.surface.startsWith("http");
          return (
            <li
              key={idx}
              className="border-l-2 border-gold/40 pl-4 py-2 bg-slate/20"
            >
              <div className="flex items-baseline gap-3 flex-wrap mb-1">
                <span
                  lang="en"
                  className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                >
                  ▸ {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                  <strong>{item.what}</strong>
                </p>
              </div>
              <p className="text-mute text-[12px] sm:text-sm leading-relaxed mb-1.5">
                {item.why}
              </p>
              <p className="font-mono text-mute/60 text-[9px] tracking-[0.22em] flex items-baseline gap-2 flex-wrap">
                <span aria-hidden="true">→</span>
                {isExternal ? (
                  <a
                    href={item.surface}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                  >
                    {item.surface}
                  </a>
                ) : (
                  <Link
                    href={item.surface}
                    className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                  >
                    {item.surface}
                  </Link>
                )}
                <span className="text-mute/50">·</span>
                <span>compete pattern · {item.source}</span>
              </p>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
        ⚓ Append-only per /audit S05 PRE-COMMIT clause · 修改任一 entry 需
        30 天前 /changelog 公告 · 同 ENGINE_DIFF_BEACONS R71 W-C + NO_PUSH_INVENTORY
        R73 W-D + founders-stats claimedFounders canonical single-source pattern
        · Costly Signaling 100× per Spence 1973。 您讀到第 {RECIPROCITY_COUNT} 行 ·
        您 conclude 自己 · 我們不 sell。
      </p>
    </section>
  );
}
