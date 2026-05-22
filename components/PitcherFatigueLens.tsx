// ── ZONE 27 · Pitcher Fatigue Lens(v0.1 proxy) ─────────
// Round 38 W-A · 第 3 個 BLACK CARD analytical lens 真實 LIVE · 不 scaffold
// mode · per [[feedback-no-waiting-rule]] iron rule「任何現在能做就做 · 不
// 等 Q3」。 接 R37 W-B Vibe Check + R37 W-D Park Factor 之後。
//
// 從 R36 W-A Lens Variety table 第 4 個 candidate 落地真實。
//
// IMPORTANT brand-pure scope decision:
// /methodology Section 05 Pitcher Fatigue 寫的 angle 是「休息天數 + IP
// load · 投手疲勞警訊」 · ZONE 27 目前 ingestion 沒 rest_days + season_ip
// 真實 fields(matches.ts PitcherStats type 只有 era/k9/bb9/hr9/whip 5 個
// 季統計)。 brand-pure 不能假裝有這 data · 兩個選擇:
//
//   (A) 砍 lens 等到 schema 升 · violate「不等」 鐵律
//   (B) Ship v0.1 PROXY · 用 existing WHIP + BB9 derived「command
//        stability」 proxy · v0.2 roadmap commit upgrade real fatigue
//        when schema extended
//
// 選 (B) per Tim「不等 Q3」 directive · 同 /methodology Section 04 Engine
// Lineup v0.2 → v0.3 → v0.4 progression accuracy axiom · Section 05 lens
// 自己也 version progress。 disclaimer 必須 crystal clear v0.1 = proxy ·
// 不是 true fatigue。
//
// Brand IP 全 ✓:
//   - 0 prediction promise(visualizer · 不問「誰會贏」)
//   - 0 cash · 0 referral · 0 social transfer
//   - Pratfall · 主動承認 v0.1 = proxy · 不是 real fatigue · 邀請 PR
//   - Costly Signaling · 公開 v0.2 upgrade requirement(rest_days +
//     season_ip ingestion)·「我們不假裝有」
//   - Disclosure Philosophy · 延伸 /audit Section 02 ESTIMATION DISCLOSURE
//     pattern · 此處從「不是 estimate」 升「proxy methodology 公開」
//
// Render placement:/matches/[gameId] 接 ParkFactor 之後 · 同 lens stacking
// section 01D。 2 pitchers 各 render 一次(home + away parallel)。
// ─────────────────────────────────────────────────────

import type { PitcherStats } from "@/lib/matches";

type Props = {
  pitcher: PitcherStats;
  teamName: string;
};

// ── Fatigue Proxy 計算邏輯(v0.1) ───────────────────────
// 用 existing 季 stats derive「command stability」 proxy:
//   · BB/9 高 → 命中 zone 比例低 → command 不穩 → 可能 mechanics 疲勞
//   · WHIP 高 → 整體上壘率高 → effectiveness 降低 → 累積疲勞 signal
//   · K/9 高 → stuff intact → fresh signal · counterbalance
//
// 三 tier composite scoring(CPBL baseline calibrated):
//   FRESH  · 球路活 · 控球穩 · BB9 < 2.5 + WHIP < 1.30 + K9 > 7.5
//   NORMAL · 季中均值 · WHIP 1.30-1.50
//   LOADED · 命中率上升 · 可能進入疲勞區 · WHIP > 1.50 OR BB9 > 4.0
//
// IMPORTANT · 此 proxy 是季累計 derived · 不反映「最近一場後到今天」
// 真實 fatigue · disclaimer 必須 surface this limitation。
// ─────────────────────────────────────────────────────

type FatigueTier = "fresh" | "normal" | "loaded";

function classifyFatigue(p: PitcherStats): FatigueTier {
  const bb9 = parseFloat(p.bb9);
  const whip = parseFloat(p.whip);
  const k9 = parseFloat(p.k9);

  if (!Number.isFinite(bb9) || !Number.isFinite(whip) || !Number.isFinite(k9)) {
    return "normal";
  }

  // FRESH: low BB9 + low WHIP + high K9
  if (bb9 < 2.5 && whip < 1.3 && k9 > 7.5) return "fresh";

  // LOADED: high WHIP OR high BB9(command degradation)
  if (whip > 1.5 || bb9 > 4.0) return "loaded";

  return "normal";
}

const TIER_META: Record<FatigueTier, { icon: string; label: string; color: string; explainer: string }> = {
  fresh: {
    icon: "🟢",
    label: "FRESH",
    color: "text-gold",
    explainer: "WHIP < 1.30 · BB/9 < 2.5 · K/9 > 7.5 · 季累計 command 穩定",
  },
  normal: {
    icon: "▪",
    label: "NORMAL",
    color: "text-bone",
    explainer: "WHIP / BB9 在 CPBL 中段範圍 · 季累計 effectiveness 均值",
  },
  loaded: {
    icon: "🔴",
    label: "LOADED",
    color: "text-loss/85",
    explainer: "WHIP > 1.50 或 BB/9 > 4.0 · 命中率上升 · 命中 zone 降低 · 可能進入累計疲勞區",
  },
};

export default function PitcherFatigueLens({ pitcher, teamName }: Props) {
  const tier = classifyFatigue(pitcher);
  const meta = TIER_META[tier];

  const bb9 = parseFloat(pitcher.bb9);
  const whip = parseFloat(pitcher.whip);
  const k9 = parseFloat(pitcher.k9);

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          / FATIGUE PROXY · {pitcher.name}
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          LENS · LIVE · v0.1
        </span>
      </div>

      <p className="text-mute/80 text-xs mb-3">
        {teamName} 先發
      </p>

      {/* Tier verdict band */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          lang="en"
          className={`font-mono text-[11px] sm:text-xs tracking-[0.3em] ${meta.color}`}
        >
          {meta.icon} {meta.label}
        </span>
        <span className="text-mute/85 text-xs leading-relaxed">
          {meta.explainer}
        </span>
      </div>

      {/* 3-stat composite display */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <FatigueStatBox
          label="WHIP"
          value={whip}
          fmt={(v) => v.toFixed(2)}
          best="<1.30"
          tier={whip > 1.5 ? "bad" : whip < 1.3 ? "good" : "mid"}
        />
        <FatigueStatBox
          label="BB/9"
          value={bb9}
          fmt={(v) => v.toFixed(1)}
          best="<2.5"
          tier={bb9 > 4 ? "bad" : bb9 < 2.5 ? "good" : "mid"}
        />
        <FatigueStatBox
          label="K/9"
          value={k9}
          fmt={(v) => v.toFixed(1)}
          best=">7.5"
          tier={k9 > 7.5 ? "good" : k9 < 6 ? "bad" : "mid"}
        />
      </div>

      {/* Pratfall axiom · v0.1 proxy disclaimer · v0.2 upgrade commitment */}
      <p className="font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.22em] leading-relaxed">
        ⚠ <strong className="text-mute">v0.1 PROXY · 不是 true fatigue</strong>{" "}
        · 從季累計 WHIP + BB/9 + K/9 derive「command stability」 proxy ·
        反映 season-cumulative stress · 不反映「最近一場後到今天」 real fatigue。
        v0.2 upgrade 需 ingest rest_days + season_ip · roadmap commit ·
        當 schema 擴 + CPBL 工作者發 PR 提供 rest/IP data{" "}
        <code className="text-bone/80 text-[9px]">lib/matches.ts PitcherStats</code>{" "}
        立即 swap real fatigue。 引擎 prediction 仍由{" "}
        <span className="text-gold/80">Win Probability lens(v0.2)</span> drive。
      </p>
    </article>
  );
}

// ── Stat box sub-component ──────────────────────────────
function FatigueStatBox({
  label,
  value,
  fmt,
  best,
  tier,
}: {
  label: string;
  value: number;
  fmt: (v: number) => string;
  best: string;
  tier: "good" | "mid" | "bad";
}) {
  const tierColor = {
    good: "text-gold",
    mid: "text-bone",
    bad: "text-loss/85",
  }[tier];

  return (
    <div className="bg-slate/60 border border-line/40 px-2 py-2">
      <div className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-1">
        {label}
      </div>
      <div className={`font-mono tabular text-base sm:text-lg ${tierColor}`}>
        {Number.isFinite(value) ? fmt(value) : "—"}
      </div>
      <div className="font-mono text-mute/50 text-[8px] tracking-[0.22em] mt-1">
        BEST {best}
      </div>
    </div>
  );
}
