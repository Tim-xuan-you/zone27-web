// ── ZONE 27 · Reading Progress Bar · CSS Scroll-Driven Animations ────
// Pure server-render utility · 0 JS · 0 props · gracefully degrades in
// browsers without animation-timeline support via @supports guard in
// globals.css。 Fixed-top hairline Cold Gold · auto-fills as visitor
// scrolls · indie-premium UX polish · 2026 canonical pattern。
//
// Inspiration:
//   - Substack premium publishers · top-of-window progress signal
//   - Defector worker-owned content sites · same micro-interaction
//   - Stratechery long-form readers · progress affordance
//
// Brand IP:
//   - per [[zone27-disclosure-philosophy]] · no telemetry · no JS reads
//     scroll position · CSS-only via animation-timeline: scroll()
//   - per [[feedback-zone27-mobile-first]] · prefers-reduced-motion
//     respected via @media guard in globals.css
//   - 同 LivingCoverHero R97 W2 axis · server-rendered visual signature
//
// Mount: add to long-form content pages by including `<ReadingProgress />`
// near top of <main>。 Don't mount on every page · only ones where reading
// progress is meaningful(/audit · /methodology · /letter · /year-zero ·
// /heritage · /integrity · /steelman · /track-record · etc)。
// ─────────────────────────────────────────────────────

export default function ReadingProgress() {
  return (
    <div
      className="reading-progress-bar"
      role="presentation"
      aria-hidden="true"
    />
  );
}
