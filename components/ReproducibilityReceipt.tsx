// ── ZONE 27 · Reproducibility Receipt ───────────────────
// Round 42 W-B · Agent H #4 ship · per [[feedback-no-waiting-rule]]。
//
// Per I-TEC framework + IJCAI 2026 reproducibility standard · the 4
// minimum elements to make any published number reproducible:
//   1. CODE COMMIT SHA · which git revision produced this number
//   2. DATA AS-OF TIMESTAMP · which data snapshot was used
//   3. RANDOM SEED · what RNG seed(if any · Monte Carlo)
//   4. SAMPLE N · how many observations went into this number
//
// drop-in component for use beside any specific number on /methodology
// /calibration /track-record · hover shows full receipt · clickable
// commit chip opens GitHub permalink。
//
// Brand IP 物理 codify:
//   - 「We Don't Guess. We Compute.」 literal · 每個數字都有 git +
//     data + seed + N audit trail
//   - Disclosure Philosophy · 延伸 LensTrace 5-step pipeline pattern
//     到 individual number level
//   - Costly Signaling · 玩運彩+報馬仔 從不 publish reproducibility
//     receipts(他們 publish 等於暴露 cherry-picking + retroactive
//     curation)· ZONE 27 ship 等於 displacement narrative concrete
// ─────────────────────────────────────────────────────

import { COMMIT_SHA } from "@/lib/build-meta";

type Props = {
  /** RNG seed used · null for deterministic non-MC computations */
  seed?: number | null;
  /** Data as-of date · ISO YYYY-MM-DD format · when underlying data was snapshotted */
  dataAt?: string;
  /** Sample size · null for derived constants(e.g. CPBL baseline) */
  n?: number | null;
  /** Deprecated · no longer rendered as a link · kept for caller compatibility */
  fileLink?: string;
  /** Compact mode · smaller chip without full hover detail · use inline beside numbers */
  compact?: boolean;
};

export default function ReproducibilityReceipt({
  seed = null,
  dataAt,
  n = null,
  compact = false,
}: Props) {
  // Compact variant · single-line inline chip · uses semantic HTML for screen readers
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 font-mono text-mute/70 text-[9px] tracking-[0.22em] tabular"
        title={`Reproducibility receipt · commit ${COMMIT_SHA} · ${
          dataAt ? `data ${dataAt}` : ""
        } · ${seed !== null ? `seed ${seed}` : "deterministic"} · ${
          n !== null ? `n=${n}` : "derived constant"
        }`}
        aria-label={`Reproducibility receipt: commit ${COMMIT_SHA}, ${
          dataAt ? `data as of ${dataAt}, ` : ""
        }${seed !== null ? `seed ${seed}, ` : "deterministic, "}${
          n !== null ? `sample size ${n}` : "derived constant"
        }`}
      >
        <span>⌗ {COMMIT_SHA}</span>
        {seed !== null && (
          <>
            <span aria-hidden="true" className="text-mute/40">·</span>
            <span>seed {seed}</span>
          </>
        )}
        {dataAt && (
          <>
            <span aria-hidden="true" className="text-mute/40">·</span>
            <span>{dataAt}</span>
          </>
        )}
        {n !== null && (
          <>
            <span aria-hidden="true" className="text-mute/40">·</span>
            <span>n={n}</span>
          </>
        )}
      </span>
    );
  }

  // Full variant · displayed below a published number · 4-row receipt block
  return (
    <div
      className="font-mono text-mute/80 text-[10px] tracking-[0.22em] tabular border-l border-gold/30 pl-3 sm:pl-4 py-2 bg-slate/20"
      role="region"
      aria-label="Reproducibility receipt"
    >
      <p
        lang="en"
        className="text-gold/80 text-[9px] tracking-[0.3em] mb-2"
      >
        ⌗ REPRODUCIBILITY RECEIPT
      </p>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <span className="text-mute/60">COMMIT</span>
        <span className="text-bone">{COMMIT_SHA}</span>
        {dataAt && (
          <>
            <span className="text-mute/60">DATA AS-OF</span>
            <span className="text-bone">{dataAt}</span>
          </>
        )}
        <span className="text-mute/60">SEED</span>
        <span className="text-bone">
          {seed !== null ? seed : "deterministic"}
        </span>
        <span className="text-mute/60">SAMPLE N</span>
        <span className="text-bone">{n !== null ? n : "derived constant"}</span>
      </div>
    </div>
  );
}
