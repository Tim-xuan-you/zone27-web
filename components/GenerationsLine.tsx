import Link from "next/link";

// ── ZONE 27 · Generations Line ─────────────────────────
// R75 W-G · Agent A R75 SHIP 3 · Patek Philippe 1996 "Generations" campaign
// tagline localized to Taiwan CPBL fan culture + Hanshin Tigers 二代目ファン
// generational handoff grammar + family-recording-coach skill territory
// (Tim's own 5-year-old son context)。
//
// The cognitive frame this opens:
//   - Patek "Generations" 1996 tagline · canonical luxury "you don't own ·
//     you look after for next generation" · 60-year continuity statement
//   - Hanshin Tigers fan culture · "二代目阪神ファン"(2nd-generation fan)
//     is real identity category in Japan · generational handoff IS the
//     brand
//   - Taiwan CPBL fan culture has same axis but no brand explicitly captures
//     it · "兒子問我為什麼" is canonical fan dialogue
//   - ZONE 27 Founders 27 NT$ 2,700 lifetime seat is structurally inherit-
//     able · 但 brand has not surfaced this language
//
// Brand IP fit:
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan audience
//     pattern-match generational identity grammar instantly
//   - per [[zone27-monetization-philosophy]] · identity-paid · inheritance
//     IS the deepest identity statement
//   - per [[feedback-zone27-pratfall-brand-ip]] · publish-weakness · "Tim
//     may not be around · seat survives via family member" admits mortality
//     · same Pratfall axis as BUS_FACTOR R69 W-F
//   - per [[zone27-payment-architecture]] · Founders 27 closed state =
//     SHADOWLESS RUN · inheritance only · no resale · no public market
//
// 不做 anti-pattern:
//   ✕ NO "passing it down on your deathbed" Hallmark-card sentimentality
//   ✕ NO "send to a friend who'll appreciate it" affiliate framing
//   ✕ NO "transfer history" public ledger(privacy redline)
//   ✕ NO fake testimonial "Tim, my dad bought #001"(11-NEVER redline)
//   ✕ NO "annual gift this membership" upsell
//
// Placement(per Agent A R75 SHIP 3 spec):
//   - Chip on /founders top · between hero and PreTransferReceipt(or
//     mounted on /pricing/why)· compact framing chip
//   - Full /founders/inheritance route · 4-section deep dive
//
// Inspiration sources:
//   - Patek Philippe "Generations" 1996 campaign(canonical luxury inheritance tagline)
//   - Hanshin Tigers Japan 公式 site · 二代目ファン identity language
//   - patio11 Kalzumeus · "I write what I want my kids to read"
//   - DHH world.hey.com · multi-generational letter framing
//   - Tim's family-recording-coach skill(父子錄音 weekly · 親情維繫)
// ─────────────────────────────────────────────────────

export default function GenerationsLine() {
  return (
    <aside
      aria-label="Generations Line · Patek 1996 tagline localized · ZONE 27 Founders 27 inheritance grammar"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 pt-2"
    >
      <div className="border-l-2 border-gold/60 bg-slate/30 pl-5 sm:pl-6 py-4 sm:py-5">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
        >
          ⚓ GENERATIONS · PATEK 1996 PATTERN
        </p>
        <h3 className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-3">
          您不是<span className="text-mute/70 line-through">買</span>{" "}
          ZONE 27 ·{" "}
          <span className="text-gold">您只是替下一代守 27 號席位</span>
        </h3>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3">
          Patek Philippe 1996 「Generations」 campaign canonical line:{" "}
          <em className="text-bone not-italic">
            &ldquo;You never actually own a Patek Philippe · you merely look
            after it for the next generation&rdquo;
          </em>{" "}
          · 60-year continuity statement。 ZONE 27 Founders 27 seat NT$ 2,700
          一次性 終身 + closed state = same axis · 同 Hanshin Tigers 「二代目
          ファン」 + Berkshire shareholder continuity grammar。
        </p>
        <p className="text-mute/85 text-sm leading-relaxed">
          兒子問我為什麼您 follow ZONE 27?{" "}
          <Link
            href="/founders/inheritance"
            className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
          >
            → /founders/inheritance
          </Link>{" "}
          · seat transfer rules + 永久 lifetime + 不開公開市場 + Tim 親手
          executor protocol。
        </p>
      </div>
    </aside>
  );
}
