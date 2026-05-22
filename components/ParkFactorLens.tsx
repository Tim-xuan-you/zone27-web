// ── ZONE 27 · Park Factor Lens ──────────────────────────
// Round 37 W-C · 第 2 個 BLACK CARD analytical lens 真實 LIVE ship · 不
// scaffold mode · per [[feedback-no-waiting-rule]] iron rule「任何現在能
// 做就做 · 不等 Q3」。 接 R37 W-B Vibe Check after。
//
// 從 R36 W-A Lens Variety table 第 3 個 candidate 落地真實:
//   - 用 existing match.venue field + lib/cpbl-parks.ts reference data
//   - 純 data viz · 不假 prediction accuracy promise(visualizer 不 predictor)
//   - 「park factor ≠ outcome predictor」 educational disclaimer
//   - brand IP「方法公開」 延伸:cite estimate methodology + PR 邀請
//
// Brand IP 全 ✓:
//   - 0 prediction promise(同 Lens Variety axiom · 不問「誰會贏」 ·
//     問「哪些 factor 影響」)
//   - 0 cash · 0 referral · 0 social transfer
//   - Pratfall · 主動承認 estimate · 邀請 community PR 修正
//   - 0「自研理論包裝」 · cite CPBL aggregate league baseline +
//     observable stadium dimensions
//
// Render placement:/matches/[gameId] hero 下方 · 接 VibeCheck 之後 ·
// 同 Section 05 lens stacking pattern。 BLACK CARD-gated 是 future ·
// 現在 free render(per /membership/black-card 月卡手動 LIVE 但無
// 自動 gating · Tim 親手 onboard 觀察 actual paid user)。
// ─────────────────────────────────────────────────────

import {
  cpblParks,
  getParkFactorByVenue,
  getHomeAdvantageDelta,
  getRunsDelta,
  CPBL_PARK_BASELINE_HOME_WIN_PCT,
  CPBL_PARK_BASELINE_RUNS_PER_GAME,
  type ParkFactor,
} from "@/lib/cpbl-parks";

type Props = {
  venue: string;
};

const TILT_META: Record<ParkFactor["tilt"], { icon: string; label: string; color: string }> = {
  hitter: {
    icon: "⚾",
    label: "HITTER-FRIENDLY",
    color: "text-gold",
  },
  pitcher: {
    icon: "🥎",
    label: "PITCHER-FRIENDLY",
    color: "text-bone",
  },
  neutral: {
    icon: "▪",
    label: "NEUTRAL",
    color: "text-mute",
  },
};

export default function ParkFactorLens({ venue }: Props) {
  const thisPark = getParkFactorByVenue(venue);

  // Sort parks: hitter-tilt → neutral → pitcher-tilt(visual gradient)
  const sortedParks = [...cpblParks].sort((a, b) => b.estimatedRunsPerGame - a.estimatedRunsPerGame);

  // Max bar width based on max delta absolute value(visual scaling)
  const maxRunsDelta = Math.max(...cpblParks.map((p) => Math.abs(getRunsDelta(p)))) || 1;

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          / PARK FACTOR · 4 CPBL 場館 home advantage
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          LENS · LIVE
        </span>
      </div>

      {/* ── 本場場館 highlight ────────────────────────── */}
      {thisPark && (
        <div className="mb-5 border border-gold/40 bg-slate/60 p-3 sm:p-4">
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <span
              lang="en"
              className="font-mono text-gold/90 text-[9px] tracking-[0.3em]"
            >
              TONIGHT
            </span>
            <span className="text-bone text-sm sm:text-base">{thisPark.venue}</span>
            <span
              lang="en"
              className={`font-mono text-[9px] tracking-[0.3em] ${TILT_META[thisPark.tilt].color}`}
            >
              {TILT_META[thisPark.tilt].icon} {TILT_META[thisPark.tilt].label}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-[11px] sm:text-xs font-mono">
            <div>
              <div className="text-mute/70 text-[9px] tracking-[0.25em] mb-1">主隊勝率</div>
              <div className="text-bone tabular">
                {thisPark.estimatedHomeWinPct}%
                <span className="text-mute/60 ml-1 text-[10px]">
                  ({fmtDelta(getHomeAdvantageDelta(thisPark))})
                </span>
              </div>
            </div>
            <div>
              <div className="text-mute/70 text-[9px] tracking-[0.25em] mb-1">R/G 環境</div>
              <div className="text-bone tabular">
                {thisPark.estimatedRunsPerGame.toFixed(1)}
                <span className="text-mute/60 ml-1 text-[10px]">
                  ({fmtDelta(getRunsDelta(thisPark))})
                </span>
              </div>
            </div>
            <div>
              <div className="text-mute/70 text-[9px] tracking-[0.25em] mb-1">啟用</div>
              <div className="text-bone tabular">{thisPark.openedYear}</div>
            </div>
          </div>
          <p className="mt-3 text-mute/85 text-xs leading-relaxed">
            {thisPark.rationale}
          </p>
        </div>
      )}

      {/* ── 4 場館 R/G 比較 bars ────────────────────── */}
      <div className="mb-4">
        <p
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-3"
        >
          4 CPBL VENUES · R/G ENVIRONMENT(估值)
        </p>
        <div className="space-y-2">
          {sortedParks.map((p) => {
            const delta = getRunsDelta(p);
            const width = (Math.abs(delta) / maxRunsDelta) * 100;
            const isCurrent = thisPark?.venue === p.venue;
            const tilt = TILT_META[p.tilt];
            return (
              <div
                key={p.venue}
                className={`grid grid-cols-[1fr_auto] gap-3 items-center ${
                  isCurrent ? "border-l-2 border-gold pl-2" : "pl-2"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <span
                      className={`text-xs sm:text-sm ${
                        isCurrent ? "text-bone" : "text-mute"
                      }`}
                    >
                      {p.venue}
                    </span>
                    <span
                      lang="en"
                      className={`font-mono text-[9px] tracking-[0.25em] ${tilt.color}`}
                    >
                      {tilt.icon}
                    </span>
                  </div>
                  <div className="relative h-2 bg-slate/60 border border-line/40">
                    <div
                      className={`absolute top-0 bottom-0 ${
                        delta >= 0 ? "left-1/2 bg-gold/70" : "right-1/2 bg-mute/60"
                      }`}
                      style={{ width: `${width / 2}%` }}
                      role="img"
                      aria-label={`${p.venue} R/G delta ${fmtDelta(delta)}`}
                    />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-line/80" />
                  </div>
                </div>
                <div className="font-mono tabular text-[10px] sm:text-[11px] text-mute/85 text-right whitespace-nowrap">
                  <span className={isCurrent ? "text-bone" : ""}>
                    {p.estimatedRunsPerGame.toFixed(1)} R/G
                  </span>
                  <span className="text-mute/60 ml-1">
                    ({fmtDelta(getRunsDelta(p))})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p
          lang="en"
          className="mt-3 font-mono text-mute/60 text-[9px] tracking-[0.22em]"
        >
          BASELINE · CPBL AGGREGATE {CPBL_PARK_BASELINE_RUNS_PER_GAME} R/G · HOME WIN {CPBL_PARK_BASELINE_HOME_WIN_PCT}%
        </p>
      </div>

      {/* Pratfall axiom · educational disclaimer */}
      <p className="mt-4 font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.22em] leading-relaxed">
        ⚠ <strong className="text-mute">Park Factor ≠ 預測信號</strong>{" "}
        · 場館 tilt 只是 multiplier on team-level skills · 不是 outcome
        predictor。 引擎 prediction 仍由{" "}
        <span className="text-gold/80">Win Probability lens(v0.2)</span>{" "}
        drive。 數值為 ESTIMATE · derive from CPBL aggregate league baseline +
        stadium dimension observables · 任何 park-factor 工作者可發 PR 修正{" "}
        <code className="text-bone/80 text-[9px]">lib/cpbl-parks.ts</code>。
      </p>
    </article>
  );
}

function fmtDelta(d: number): string {
  if (d === 0) return "±0";
  const sign = d > 0 ? "+" : "";
  return `${sign}${d.toFixed(1)}`;
}
