import Link from "next/link";

// ── ZONE 27 · Long Read Handoff ──────────────────────────
// R69 W-E · Agent A SHIP 5(XS)· Tom Tango sabermetrics blog + Aeon +
// Astral Codex Ten end-of-post pattern · long-form journalism trust
// research:reader at end of 8-min read is in HIGHEST trust state of
// their session · honor the time investment with「next deep read」
// link · NOT「subscribe modal」 · NOT「follow on Twitter」 · NOT「join
// our community」。
//
// 3-line block · pure typographic:
//   第 1 行 · "讀完了 X 分鐘 · {date}" computed from ArticleMeta props
//   第 2 行 · "下一篇深度: {next-canonical}" cross-link
//   第 3 行 · "想被通知?加 /feed.xml · 不需要 email" Atom RSS only
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · uses already-shipped /feed.xml
//     RSS(R51 W-E)as the ONLY「subscription」 surface · 0 new infra ·
//     0 email capture surface
//   - per 「不打擾就是禮物」 axiom · NOT modal · NOT scroll-lock · NOT
//     push · pure inline typographic handoff
//   - per [[feedback-zone27-audience-fans-not-engineers]] · RSS = fan-
//     grammar(Stratechery / FanGraphs reader cohort)NOT engineer-grammar
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「不需要 email」
//     surface acknowledges visitor agency · 不 forced opt-in
//
// 不做 anti-pattern(per Agent A SHIP 5 anti-list):
//   ✕ no email capture field at end-of-post
//   ✕ no「Follow on Twitter / Threads / X」 social CTA
//   ✕ no「N other readers also liked...」 social proof
//   ✕ no「Share this article」 broadcast buttons(separate from
//     QuietHandoffCard which is mailto-only one-to-one share)
//
// Used: /methodology Section 07(after FOOTNOTES)+ /about Chapter 07 ·
// future deep pages can drop-in same component。
// ─────────────────────────────────────────────────────

type Props = {
  /** Reading time in minutes · matches ArticleMeta value · for honesty */
  readingMin: number;
  /** Next deep page cross-link href · e.g. "/methodology/diff" */
  nextHref: string;
  /** Next deep page label · short title visible in link · e.g. "v0.2 → v0.3 entire delta" */
  nextLabel: string;
  /** Optional override default RSS link · default `/feed.xml` */
  feedHref?: string;
};

export default function LongReadHandoff({
  readingMin,
  nextHref,
  nextLabel,
  feedHref = "/feed.xml",
}: Props) {
  return (
    <aside
      aria-label="End-of-read handoff · next deep page + RSS subscription"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-8 sm:py-10 border-t border-line/40"
    >
      <div className="border-l-2 border-gold/40 pl-5 sm:pl-6 max-w-2xl">
        <p
          lang="en"
          className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3"
        >
          / END OF DEEP READ · HANDOFF
        </p>
        <p className="font-mono text-mute/85 text-[12px] sm:text-[13px] tracking-[0.15em] leading-relaxed mb-2 tabular">
          您讀完了 <strong className="text-bone">~{readingMin} 分鐘</strong>{" "}
          · 您現在 trust state 是 session 最高 · 不浪費 attention 跟您要
          email 訂閱 · 給您下一個 deep read:
        </p>
        <p className="text-mute leading-relaxed mb-3 text-sm sm:text-base">
          下一篇 →{" "}
          <Link
            href={nextHref}
            className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors font-medium"
          >
            {nextLabel}
          </Link>
        </p>
        <p className="font-mono text-mute/70 text-[11px] tracking-[0.2em] leading-relaxed">
          想被通知未來更新? 加{" "}
          <Link
            href={feedHref}
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /feed.xml
          </Link>{" "}
          Atom RSS · 不需要 email · 您 reader pull · 不 push · 0 tracking ·
          per /privacy 0-tracker promise + R51 W-E ship。
        </p>
      </div>
    </aside>
  );
}
