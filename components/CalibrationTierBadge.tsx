"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readAnonPicks } from "@/lib/anon-picks";
import {
  computeCalibrationState,
  CALIBRATION_TIERS,
  type CalibrationState,
} from "@/lib/calibration-tiers";

// ── ZONE 27 · Calibration Tier Badge ────────────────────
// Round 53 W-A · Tim asked「會員分級 · 獎章 · 等級」 question · agent
// research synthesize → brand-pure 7-tier epistemic discipline system。 此
// component 是 visitor-facing surface · 渲染在 /member/calibration personal
// mode only(per agent's anti-leaderboard guard · 永遠不在 public surface
// /calibration global page)。
//
// brand IP fire:
//   - per [[zone27-disclosure-philosophy]] · tier 算法公開 · 不藏 black box
//   - per Pratfall(Aronson 1966)· badge 附帶 honest「您 X% bucket 過自信
//     Y pp」 line · 不藏 over-confidence · 直接 show drift
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 「校準學徒」
//     「守紀者」 fan-grammar · 不 engineering-grammar「Tier 1」 「Level 5」
//   - per Hanus & Fox 2015 · 純 private localStorage mirror · NO social
//     leaderboard · 不違反 11「永遠不做」 第 2 條 engagement gamification
//   - per Tetlock 2015 Superforecaster pattern · 「您 vs 5,000 forecasters」
//     context · brand IP「方法公開」 延伸到 personal calibration layer
//
// SSR-safe(typeof window guard via readAnonPicks)· hydration-safe
// (discriminated union mount pattern from R40 W-G · R45 W-B)。
// ─────────────────────────────────────────────────────

type MountState =
  | { mounted: false }
  | { mounted: true; state: CalibrationState };

export default function CalibrationTierBadge() {
  const [mountState, setMountState] = useState<MountState>({ mounted: false });

  useEffect(() => {
    const picks = readAnonPicks();
    const state = computeCalibrationState(picks);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMountState({ mounted: true, state });
  }, []);

  if (!mountState.mounted) {
    // SSR placeholder · same height as badge to avoid layout shift
    return (
      <div
        className="bg-slate/30 border border-line/60 px-5 py-6 min-h-[180px]"
        aria-hidden="true"
      />
    );
  }

  const { state } = mountState;
  const { tier, nFinalized, brierLifetime, brierLast30, maxBinReliabilityError, pratfallBin } = state;

  // Observer state(N < 10)· honest「沒 sample」 UI · 不假裝 progress
  if (tier.id === 0) {
    return (
      <div className="bg-slate/40 border border-line/70 p-5 sm:p-6">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
        >
          / TIER 00 · OBSERVER
        </p>
        <h3 className="text-2xl text-bone font-light tracking-tight mb-2">
          觀測者 · 還沒累積 sample
        </h3>
        <p className="text-mute/85 text-sm leading-relaxed mb-4">
          您目前有{" "}
          <strong className="text-bone tabular">{nFinalized}</strong>{" "}
          場 finalized picks · 還未達 N=10 enter「校準學徒」 tier。
          honest「不夠 sample」 state · 不假裝 calibration · brand IP
          「方法公開」 從 Observer 開始。
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em]">
          下個 tier(校準學徒)· 還需{" "}
          <span className="text-gold">{Math.max(0, 10 - nFinalized)}</span>{" "}
          場 finalized picks
        </p>
        <p className="mt-4 text-mute/70 text-xs leading-relaxed">
          想開始累積 picks?{" "}
          <Link
            href="/matches"
            className="text-gold underline-offset-4 hover:underline"
          >
            /matches · 選一場 CPBL 對戰
          </Link>
          {" "}· anonymous pick · localStorage only · 0 server · 0 PII
        </p>
      </div>
    );
  }

  // Active tier display
  const tierClass = tier.id >= 4 ? "border-gold/60 bg-gold/5 glow-soft" : "border-gold/40 bg-slate/40";
  const tierColor = tier.id >= 4 ? "text-gold" : "text-bone";

  return (
    <div className={`border p-5 sm:p-6 ${tierClass}`} role="status">
      <p
        lang="en"
        className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
      >
        / TIER {String(tier.id).padStart(2, "0")} · {tier.en}
      </p>
      <h3 className={`text-2xl sm:text-3xl font-light tracking-tight mb-3 ${tierColor}`}>
        {tier.name}
      </h3>

      {/* Stats grid · 4 key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono text-[10px] tracking-[0.2em]">
        <StatCell
          label="PICKS FINALIZED"
          value={String(nFinalized)}
          tone="bone"
        />
        <StatCell
          label="BRIER LIFETIME"
          value={brierLifetime.toFixed(3)}
          tone={brierLifetime < 0.25 ? "gold" : "mute"}
          help="Brier 1950 · strictly proper · 0=完美 · 0.25=ordinary · <0.20=top 2%"
        />
        <StatCell
          label="BRIER LAST-30"
          value={nFinalized >= 30 ? brierLast30.toFixed(3) : "—"}
          tone={nFinalized >= 30 && brierLast30 < 0.25 ? "gold" : "mute"}
          help="last 30 picks rolling Brier · drift signal"
        />
        <StatCell
          label="RELIABILITY ERR"
          value={maxBinReliabilityError < 1 ? maxBinReliabilityError.toFixed(3) : "—"}
          tone={maxBinReliabilityError < 0.05 ? "gold" : "mute"}
          help="Murphy 1973 reliability · max bin error · <0.05=excellent"
        />
      </div>

      {/* Pratfall surface · honest over-confidence display */}
      {pratfallBin && (
        <div className="bg-loss/[0.06] border-l-2 border-loss/40 px-4 py-3 mb-5">
          <p
            lang="en"
            className="font-mono text-loss/85 text-[9px] tracking-[0.35em] mb-1.5"
          >
            ⚠ PRATFALL · OVER-CONFIDENCE DETECTED
          </p>
          <p className="text-mute/90 text-[13px] leading-relaxed">
            您在{" "}
            <strong className="text-bone">{pratfallBin.range}</strong>{" "}
            confidence bucket · 命中率僅{" "}
            <strong className="text-bone tabular">{pratfallBin.observed.toFixed(0)}%</strong>{" "}
            ·{" "}
            <span className={pratfallBin.errorPp > 0 ? "text-loss/85" : "text-gold/85"}>
              {pratfallBin.errorPp > 0 ? "過自信" : "過保守"}{" "}
              {Math.abs(pratfallBin.errorPp).toFixed(0)} pp
            </span>
            。 honest mirror · per Pratfall axiom · 不藏。
          </p>
        </div>
      )}

      {/* Tier rationale + research backing */}
      <p className="text-mute/90 text-[13px] sm:text-sm leading-relaxed mb-3">
        {tier.description}
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mb-4">
        ⚓ source · {tier.source}
      </p>

      {/* Next tier hint(if not max tier)*/}
      {tier.id < 6 && (
        <div className="pt-4 border-t border-line/40">
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] mb-1">
            NEXT TIER · {CALIBRATION_TIERS[tier.id + 1].en}
          </p>
          <p className="text-mute/85 text-[13px] leading-relaxed">
            {CALIBRATION_TIERS[tier.id + 1].name}({CALIBRATION_TIERS[tier.id + 1].en})·
            need N ≥ <strong className="text-bone tabular">{CALIBRATION_TIERS[tier.id + 1].nMin}</strong>
            {CALIBRATION_TIERS[tier.id + 1].brierMax !== null && (
              <>
                {" "}+ Brier &lt;{" "}
                <strong className="text-bone tabular">
                  {CALIBRATION_TIERS[tier.id + 1].brierMax}
                </strong>
              </>
            )}
            {CALIBRATION_TIERS[tier.id + 1].reliabilityErrorMax !== null && (
              <>
                {" "}+ reliability error &lt;{" "}
                <strong className="text-bone tabular">
                  {CALIBRATION_TIERS[tier.id + 1].reliabilityErrorMax}
                </strong>
              </>
            )}
          </p>
        </div>
      )}

      {/* Anti-leaderboard guard reminder · brand IP 物理 codify */}
      <p className="mt-4 pt-4 border-t border-line/40 font-mono text-mute/60 text-[9px] tracking-[0.3em] leading-relaxed">
        🔒 此 tier 純 private mirror · localStorage only · 0 server · 0 social
        leaderboard · per Hanus & Fox 2015(badges + public ranking REDUCED
        intrinsic motivation)· brand IP 物理 codify
      </p>
    </div>
  );
}

function StatCell({
  label,
  value,
  tone,
  help,
}: {
  label: string;
  value: string;
  tone: "bone" | "gold" | "mute";
  help?: string;
}) {
  const valueColor =
    tone === "gold" ? "text-gold" : tone === "bone" ? "text-bone" : "text-mute";
  return (
    <div title={help}>
      <p className="text-mute/70 mb-1">{label}</p>
      <p className={`text-base sm:text-lg tabular ${valueColor}`}>{value}</p>
    </div>
  );
}
