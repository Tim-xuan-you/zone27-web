// ── ZONE 27 · Bullpen Depth Lens(v0.1 PROXY) ──────────
// Round 40 W-A · 第 6 個 BLACK CARD analytical lens 真實 LIVE · 接 R39 W-B
// Underdog Tracker · per [[feedback-no-waiting-rule]] iron rule。 從 R36
// W-A Lens Variety table 第 6 個 candidate「Bullpen Depth · 兩隊牛棚深度
// 比較」 落地。
//
// IMPORTANT brand-pure scope decision:
// /methodology Section 05 Bullpen Depth 寫的 angle 是「兩隊牛棚深度比較 ·
// 後援戰力 audit」 · 但 matches.ts 沒 bullpen schema(沒中繼/救援投手 ERA ·
// 沒 bullpen total IP · 沒 last 7 days bullpen usage)。 brand-pure 不能
// 假裝有 data · 兩個選擇:
//
//   (A) 砍 lens 等到 schema 升 · violate「不等」 鐵律
//   (B) Ship v0.1 PROXY · 用 existing team recent W-L 推測 bullpen game
//        impact · v0.2 roadmap commit upgrade real bullpen ingestion
//
// 選 (B) per Tim「不等 Q3」 directive · 同 Pitcher Fatigue v0.1 PROXY
// pattern · disclaimer 必須 crystal clear v0.1 = late-inning team
// resilience proxy · 不是 true bullpen depth。
//
// v0.1 PROXY calculation:
//   - team recent 5 games W-L · 變動 = bullpen 介入後比賽容易翻盤 signal
//   - L 多 = late-inning 失分多 · bullpen 可能 burdened
//   - W 多 + close games = bullpen 救援成功穩定
//
// 5-tier classification:
//   STRONG · 4-5W in last 5 · 多 close W · bullpen 救援穩定
//   STEADY · 3W · neutral usage
//   LOADED · 1-2W · multiple late-inning collapses possible
//   THIN · 0W last 5 · bullpen 可能極度疲憊
//
// Brand IP 全 ✓(同 Pitcher Fatigue 三 axiom 重複 fire):
//   - 0 prediction promise(visualizer · 不問「誰會贏」)
//   - 0 cash · 0 referral
//   - Pratfall · 主動承認 v0.1 = proxy · 不是 real bullpen depth · 邀請 PR
//   - Costly Signaling · 公開 v0.2 upgrade requirement(bullpen ERA + IP
//     usage + last 7d ingestion)·「我們不假裝有」
//   - Disclosure · 延伸 /audit S02 ESTIMATION DISCLOSURE pattern
//
// Render placement:/matches/[gameId] 接 UnderdogLens 之後 · section 01F。
// ─────────────────────────────────────────────────────

import type { TeamSide } from "@/lib/matches";

type Props = {
  team: TeamSide;
  side: "HOME" | "AWAY";
};

type BullpenTier = "strong" | "steady" | "loaded" | "thin";

function classifyBullpen(recent: ("W" | "L")[]): BullpenTier {
  const wins = recent.filter((r) => r === "W").length;
  // 5 場戰績判斷 · close games 推測
  if (wins >= 4) return "strong";
  if (wins === 3) return "steady";
  if (wins === 0) return "thin";
  return "loaded";
}

const TIER_META: Record<
  BullpenTier,
  { icon: string; label: string; color: string; explainer: string }
> = {
  strong: {
    icon: "🟢",
    label: "STRONG PROXY",
    color: "text-gold",
    explainer: "4-5 W in last 5 · 多場 close W · late-inning resilience 良好 · bullpen 救援穩定 signal",
  },
  steady: {
    icon: "▪",
    label: "STEADY PROXY",
    color: "text-bone",
    explainer: "3 W in last 5 · neutral usage · bullpen 表現 在 CPBL 中段範圍",
  },
  loaded: {
    icon: "🟡",
    label: "LOADED PROXY",
    color: "text-loss/70",
    explainer: "1-2 W in last 5 · multiple late-inning collapses possible · bullpen 可能 burdened",
  },
  thin: {
    icon: "🔴",
    label: "THIN PROXY",
    color: "text-loss/85",
    explainer: "0 W in last 5 · 連敗 · bullpen 可能極度疲憊 · 救援 reliability 嚴重降低",
  },
};

export default function BullpenDepthLens({ team, side }: Props) {
  const tier = classifyBullpen(team.recent);
  const meta = TIER_META[tier];
  const wins = team.recent.filter((r) => r === "W").length;
  const losses = team.recent.length - wins;

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          / BULLPEN PROXY · {team.en}
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          LENS · LIVE · v0.1
        </span>
      </div>

      <p className="text-mute/80 text-xs mb-3">
        {team.name} · {side}
      </p>

      {/* Tier verdict band */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          lang="en"
          className={`font-mono text-[11px] sm:text-xs tracking-[0.3em] ${meta.color}`}
          aria-label={`Bullpen depth tier ${meta.label} based on team recent 5-game record ${wins} wins ${losses} losses`}
        >
          {meta.icon} {meta.label}
        </span>
      </div>

      <p className="text-mute/85 text-xs leading-relaxed mb-4">
        {meta.explainer}
      </p>

      {/* Recent record · proxy data viz · 5-dot pattern same as VibeCheck */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          LAST 5 ·{" "}
        </span>
        <div
          className="flex gap-1.5"
          role="img"
          aria-label={`Last 5 games: ${wins} wins, ${losses} losses`}
        >
          {team.recent.map((r, i) => (
            <span
              key={i}
              className={`inline-block w-3 h-3 rounded-full ${
                r === "W"
                  ? "bg-gold glow-soft"
                  : "border border-mute/50 bg-transparent"
              }`}
              title={r === "W" ? "WIN" : "LOSS"}
              aria-hidden="true"
            />
          ))}
        </div>
        <span
          lang="en"
          className="font-mono text-bone text-[10px] tracking-[0.25em] tabular"
        >
          {wins}W-{losses}L
        </span>
      </div>

      {/* Pratfall axiom · v0.1 PROXY disclaimer · v0.2 upgrade commitment */}
      <p className="font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.22em] leading-relaxed">
        ⚠ <strong className="text-mute">v0.1 PROXY · 不是 true bullpen depth</strong>{" "}
        · 從 team recent 5-game W-L 推測 late-inning resilience · 不是 ingest
        過的 bullpen ERA / IP usage / last 7 days workload。 v0.2 upgrade
        需 ingest bullpen schema(reliever roster + ERA + last-7d IP)·
        roadmap commit · 當 CPBL 工作者發 PR 提供 bullpen data{" "}
        <code className="text-bone/80 text-[9px]">lib/matches.ts</code> 立即
        swap real bullpen lens。 引擎 prediction 仍由{" "}
        <span className="text-gold/80">Win Probability lens(v0.2)</span> drive。
      </p>
    </article>
  );
}
