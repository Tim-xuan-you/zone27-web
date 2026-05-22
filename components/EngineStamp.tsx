import Link from "next/link";
import {
  COMMIT_SHA,
  COMMIT_PERMALINK,
  DEPLOYED_AT,
} from "@/lib/build-meta";

// ── ZONE 27 · Engine Stamp ─────────────────────────────
// Round 31 Wave B · Vercel + Plausible datestamped trust signal
// pattern · ESLINT pattern「校準於 timestamp · BUILD hash」 visible
// under every probability surface · 2026 fan-grade freshness
// signal grammar(per agent A research pattern #5)。
//
// 跟 ProvenanceStamp 差別:
//   - ProvenanceStamp 是 academic-citation 格式 · 給 /lab + /lab/custom
//     + /matches/[gameId] 的 MatchSimulator 用 · 帶 MATCH id reference。
//   - EngineStamp 是 site-wide trust signal · generic · 不需 match id ·
//     可任何 page 級 surface 用(homepage · /track-record · /audit · ...)。
//     Bloomberg「last updated」風 + Vercel「real-time rankings dated」 風。
//
// 例:
//   ┌──────────────────────────────────────────────────┐
//   │ ENGINE v0.2 · LOCKED 2026-05-22 · BUILD a1b2c3d │
//   └──────────────────────────────────────────────────┘
//
// BUILD chip is a link to the exact GitHub commit that produced the
// running bundle · 同 /audit BUILD chip pattern · disclosure 鏡像。
// 任何 visitor 可以 click 看「我們現在 serving 的 code 真實是這一刻
// 的 git history」 · 不可篡改 audit trail。
//
// Modes:
//   - default · "ENGINE v0.2 · LOCKED {date} · BUILD {sha}"
//   - compact · "v0.2 · {date} · {sha}"
//   - showBuild=false · 去掉 BUILD chip · 用於 mobile 緊湊 hero strip
// ─────────────────────────────────────────────────────

type Props = {
  /** Engine version label · default "v0.2" */
  engineVersion?: string;
  /** Override the "locked" date · default = build deploy date */
  lockedAt?: string;
  /** Show BUILD chip · default true(GitHub permalink) */
  showBuild?: boolean;
  /** Compact mode strips「ENGINE」/「LOCKED」 prefix labels · for tight slots */
  compact?: boolean;
  /** Extra Tailwind classes appended */
  className?: string;
};

export default function EngineStamp({
  engineVersion = "v0.2",
  lockedAt,
  showBuild = true,
  compact = false,
  className = "",
}: Props) {
  const dateStr = lockedAt ?? DEPLOYED_AT;
  const isLocalDev = COMMIT_SHA === "local";

  return (
    <p
      lang="en"
      className={`font-mono text-mute/60 text-[9px] sm:text-[10px] tracking-[0.3em] tabular leading-relaxed ${className}`}
      title={`ENGINE ${engineVersion} · LOCKED ${dateStr} (Asia/Taipei) · BUILD ${COMMIT_SHA} · click BUILD chip to view the exact commit on GitHub`}
    >
      {compact ? (
        <>
          <span className="text-gold/70">{engineVersion}</span>
          <span className="text-mute/40 mx-2">·</span>
          <span>{dateStr}</span>
          {showBuild && (
            <>
              <span className="text-mute/40 mx-2">·</span>
              {isLocalDev ? (
                <span className="text-mute/50">{COMMIT_SHA}</span>
              ) : (
                <Link
                  href={COMMIT_PERMALINK}
                  className="text-mute/70 hover:text-gold underline-offset-4 hover:underline transition-colors"
                  title="View the exact GitHub commit producing this bundle"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {COMMIT_SHA}
                </Link>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <span className="text-gold/70">ENGINE {engineVersion}</span>
          <span className="text-mute/40 mx-2">·</span>
          <span>LOCKED {dateStr}</span>
          {showBuild && (
            <>
              <span className="text-mute/40 mx-2">·</span>
              <span className="text-mute/60">BUILD </span>
              {isLocalDev ? (
                <span className="text-mute/50">{COMMIT_SHA}</span>
              ) : (
                <Link
                  href={COMMIT_PERMALINK}
                  className="text-mute/70 hover:text-gold underline-offset-4 hover:underline transition-colors"
                  title="View the exact GitHub commit producing this bundle"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {COMMIT_SHA}
                </Link>
              )}
            </>
          )}
        </>
      )}
    </p>
  );
}
