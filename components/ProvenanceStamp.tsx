import { COMMIT_SHA, COMMIT_PERMALINK } from "@/lib/build-meta";

// ── ZONE 27 · Provenance Stamp ─────────────────────────
// Citation-grade footer for every page that shows engine output.
// Renders the engine version + build commit SHA + optional match ID,
// so a visitor screenshot of /lab / /lab/custom / /matches/[gameId]
// becomes a CITABLE artifact:
//
//   ENGINE v0.2 · BUILD a4b3c91 · MATCH cpbl-260521-01
//
// Why this exists (per Round 12 Agent A research):
//   - Patek Philippe engraves serial numbers on every case/movement.
//     Each watch is provenance-stamped at the factory; collectors
//     can verify authenticity 50 years later. The engraving IS the
//     authentication.
//   - Bloomberg terminals carry a timestamp + build version in every
//     screenshot — it's how traders prove "this is what the screen
//     said at X moment."
//   - Academic papers carry DOI + version + date in every PDF page
//     footer for the same reason.
//
// ZONE 27 brand axiom mapping:
//   - [[zone27-disclosure-philosophy]] "publish the entire model" —
//     every screenshot reveals which version produced this output.
//   - [[user-tim]] non-coder · screenshot UX must work without dev tools.
//   - Brand IP "method public · taste private" — engine commit hash
//     IS the method; sharing the screenshot IS publishing the method.
//
// Why no timestamp:
//   - SSG/ISR pages get rendered at build time · timestamp would
//     differ on every revalidation = visitor screenshots inconsistent.
//   - Client-rendered timestamp would cause hydration mismatch.
//   - The commit SHA already encodes "when" indirectly (one click
//     to GitHub shows commit date) — visitors who care can verify.
//
// Render anywhere — server component, no client APIs. Safe to import
// from "use client" files (no hooks, no client-only references).
// ─────────────────────────────────────────────────────

const ENGINE_VERSION = "v0.2";

type Props = {
  /** Match ID if this page is showing a specific match's output.
   *  Renders inline · screenshots become per-match citable. */
  matchId?: string;
  /** Extra Tailwind classes for spacing in host context */
  className?: string;
};

export default function ProvenanceStamp({ matchId, className = "" }: Props) {
  return (
    <div
      className={`font-mono text-mute/60 text-[10px] tracking-[0.25em] leading-relaxed tabular ${className}`}
    >
      <p>
        <span lang="en" className="text-mute/80">
          ENGINE {ENGINE_VERSION}
        </span>
        <span className="text-mute/40 mx-2" aria-hidden="true">
          ·
        </span>
        <span lang="en">BUILD </span>
        <a
          href={COMMIT_PERMALINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mute/80 hover:text-gold underline-offset-4 hover:underline"
          title={`此頁產出的 commit · GitHub permalink · ${COMMIT_SHA}`}
        >
          {COMMIT_SHA}
        </a>
        {matchId && (
          <>
            <span className="text-mute/40 mx-2" aria-hidden="true">
              ·
            </span>
            <span lang="en">MATCH </span>
            <span className="text-mute/80 tabular">{matchId}</span>
          </>
        )}
      </p>
      <p className="mt-1 text-mute/50">
        引擎產出可截圖引用 · 任何結果可重現 ·{" "}
        <a
          href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mute/70 hover:text-gold underline-offset-4 hover:underline"
        >
          fork lib/simulator.ts
        </a>
      </p>
    </div>
  );
}
