// ── ZONE 27 · Article Meta ─────────────────────────────
// Round 28 Wave 2C · Agent A pattern #8 (Medium/Substack reading
// time + academic sample-size convention). Two micro-signals at the
// top of trust-artifact pages:
//   1. Reading time (cognitive-load opt-in · helps visitors decide)
//   2. SAMPLE DEBT chip (Z27 LEXICON term elevated from text to
//      real UI primitive · per memory [[zone27-coverage-philosophy]]
//      "we know we don't have enough samples yet · we count
//      anyway · publicly")
//
// SAMPLE DEBT semantics (defined in /glossary Z27 LEXICON):
//   - threshold default 30 (Bill James sabermetrics convention)
//   - if N < threshold: chip shows in loss color · displays deficit
//   - if N ≥ threshold: chip shows in bone (statistically meaningful)
//
// Visual rhythm: matches existing mono-tracking kicker style at top
// of every trust doc · brand-pure · 0 new dependencies.
// ─────────────────────────────────────────────────────

type Props = {
  /** Estimated reading time in minutes · rounded to nearest int */
  readingMin: number;
  /**
   * If provided, render an N= SAMPLE DEBT chip beside reading time.
   * - current: actual sample count (e.g. finalized matches)
   * - threshold: statistical-significance threshold (default 30)
   */
  sample?: { current: number; threshold?: number };
};

export default function ArticleMeta({ readingMin, sample }: Props) {
  const threshold = sample?.threshold ?? 30;
  const belowThreshold = sample !== undefined && sample.current < threshold;
  const sampleDeficit =
    sample !== undefined ? Math.max(0, threshold - sample.current) : 0;

  return (
    <div
      className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular flex flex-wrap items-center gap-x-5 gap-y-2"
      aria-label="文章 metadata"
    >
      <span aria-label={`預計閱讀時間 ${readingMin} 分鐘`}>
        <span aria-hidden="true" className="text-gold/60">▌</span>{" "}
        <span lang="en">{readingMin} MIN READ</span> · 閱讀 {readingMin} 分鐘
      </span>
      {sample !== undefined && (
        <span
          className={belowThreshold ? "text-loss/80" : "text-bone/80"}
          title="Z27 LEXICON · SAMPLE DEBT — N < 30 時 PROVED rate 受 sample bias 影響大 · 任何百分比皆需打折判讀"
        >
          <span aria-hidden="true" className="text-gold/60">▌</span>{" "}
          N ={" "}
          <span className={belowThreshold ? "text-loss" : "text-bone"}>
            {sample.current}
          </span>
          {belowThreshold ? (
            <>
              {" "}·{" "}
              <span lang="en">SAMPLE DEBT</span> {sampleDeficit}{" "}
              <span lang="en" className="text-mute/60">
                BEFORE STATISTICAL
              </span>
            </>
          ) : (
            <>
              {" "}·{" "}
              <span lang="en" className="text-bone/70">
                STATISTICALLY MEANINGFUL
              </span>
            </>
          )}
        </span>
      )}
    </div>
  );
}
