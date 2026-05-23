import Link from "next/link";
import { ENGINE_OPS_LOG } from "@/lib/engine-log-entries";

// ── ZONE 27 · Engine Rerun Badge ────────────────────────
// R77 W-A · Agent A R76 SHIP F · Cloudflare 2025-11-18 postmortem applied
// per-receipt · pairs with R76 W-C /engine-log canonical operational artifact
// spine · per-receipt VERSION CHIP rendered on /receipts/[receiptId] when
// engine has re-run for that match · Pratfall extreme · publish version
// openly · Costly Signaling 100× per Spence 1973。
//
// The mechanic:
//   - lib/engine-log-entries.ts ENGINE_OPS_LOG has 7 event types including
//     「receipt-correction」 · entries reference receiptId
//   - This component counts receipt-correction events for given receiptId
//   - If count == 0(initial v1)render NOTHING(quiet by default · 不打擾)
//   - If count >= 1 render small badge「v{n+1} · {latest date} · why」
//     with deep-link to /engine-log section showing the correction
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · version chip 公開 = 不藏
//     re-runs · same Pratfall axis as /track-record DIVERGED 等大
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「Engine version published
//     openly」 IS the Costly Signaling · 競爭對手 LINE 老師 / 報馬仔
//     結構性不可能 publish revision history
//   - per /audit S05 PRE-COMMIT clause · ENGINE_OPS_LOG entries append-
//     only · this component is pure derivation · 不能 mutate state
//   - per Cloudflare 2025-11-18 postmortem(blog.cloudflare.com)+ Anthropic
//     2025-09 postmortem · canonical PostmortemPattern「what + when + why」
//     1-line chip is the canonical 5-second self-debunk surface
//
// 不做 anti-pattern:
//   ✕ NO「DIFF this version」 button(visitor can click to /engine-log entry
//     · 那是 deep-dive surface · 此 component 是 ambient signal not detail)
//   ✕ NO red error color(brand IP「不藏 broken state but ALSO 不 panic」 ·
//     re-runs are normal · 用 mute/loss subtle border not alarm red)
//   ✕ NO「subscribe to receipt updates」 push CTA(per NoPushManifest R73 W-D)
//   ✕ NO localStorage / sessionStorage state(component is pure derivation
//     · 0 PII · 0 side effect)
//
// Inspiration sources(per Agent A R76 SHIP F spec):
//   - Cloudflare 2025-11-18 postmortem timeline format · dated + UTC + why
//   - Anthropic 2025-09 postmortem「7-week delay = trust spent on speed」
//   - Stripe Status incident archive · per-incident dated chip
//   - GitHub commit hash badge per change · always linked + always dated
// ─────────────────────────────────────────────────────

type Props = {
  /** Receipt ID(canonical match.id e.g. "cpbl-260521-01")· used to count
   *  re-run events in ENGINE_OPS_LOG。 */
  receiptId: string;
};

export default function EngineRerunBadge({ receiptId }: Props) {
  // Count receipt-correction events for this receiptId · derive version
  // from count(0 corrections = v1 · 1 correction = v2 etc · canonical
  // version starts at 1 not 0)。
  const corrections = ENGINE_OPS_LOG.filter(
    (e) => e.eventType === "receipt-correction" && e.receiptId === receiptId,
  );

  // Quiet by default · only render when version > 1(at least 1 correction)
  if (corrections.length === 0) {
    return null;
  }

  // Latest correction event for date + deep-link
  const latest = corrections[corrections.length - 1];
  const version = corrections.length + 1; // v1 + N corrections

  return (
    <aside
      role="status"
      aria-label={`Engine receipt revision · v${version} · last correction ${latest.date} · click for /engine-log detail`}
      className="inline-flex items-center gap-2 px-2 py-1 border border-loss/40 bg-slate/40 font-mono text-loss/85 text-[10px] tracking-[0.25em] tabular"
    >
      <span aria-hidden="true">⟳</span>
      <span lang="en">v{version}</span>
      <span className="text-mute/60" aria-hidden="true">·</span>
      <span>{latest.date}</span>
      {latest.href && (
        <>
          <span className="text-mute/60" aria-hidden="true">·</span>
          <Link
            href={latest.href}
            className="text-gold/85 hover:text-gold underline-offset-2 hover:underline"
          >
            why →
          </Link>
        </>
      )}
    </aside>
  );
}
