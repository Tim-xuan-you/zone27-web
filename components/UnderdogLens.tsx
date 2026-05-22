// ── ZONE 27 · Underdog Lens ─────────────────────────────
// Round 39 W-B · 第 5 個 BLACK CARD analytical lens 真實 LIVE · 接 R37 W-B
// Vibe Check + R37 W-D Park Factor + R38 W-A Pitcher Fatigue 之後 · per
// [[feedback-no-waiting-rule]] iron rule「任何現在能做就做」。
//
// 從 R36 W-A Lens Variety table 第 5 個 candidate「Underdog Tracker · 黑馬
// 獵手 · 今晚 upset 機率最高賽事」 落地真實。
//
// Brand-pure interpretation:
//   - 「Underdog identification」 不是「我們押 underdog 會贏」(預測偏置 ·
//     violate brand IP) · 是「surface 數字 reality:今晚這場 favorite 不
//     dominant · 引擎也覺得 close」
//   - 純 viz · 不假 prediction · 不 contrarian play
//   - 「upset coefficient」 = 100 - max(home%, away%) = underdog win
//     probability(per engine v0.2 base)
//   - 「dominance gap」 = abs(home% - away%) = 引擎信心 spread
//
// 對標 displacement mission:
//   - 玩運彩+報馬仔 push「黑馬精選 9 連發」「冷門大爆」 · contrarian gambling
//     marketing · ZONE 27 倒置:「不是黑馬精選 · 是引擎信心透明」 ·
//     Pratfall「upset probability ≠ underdog 會贏」 axiom 主動 surface。
//
// 用 existing match data · 0 new schema · 0 new compute · 0 new dep。
//
// Render placement:/matches/[gameId] 接 PitcherFatigueLens 之後 ·
// section 01E。
// ─────────────────────────────────────────────────────

import type { Match } from "@/lib/matches";

type Props = {
  match: Match;
};

// Verdict tiers per upset coefficient(underdog win probability):
//   COIN-FLIP · 45-55% · 「兩隊伯仲 · 任何分歧 都 巨大」
//   COMPETITIVE · 35-45% · 「underdog 不弱 · 引擎 say 35-45% win」
//   FAVORITE LEAN · 25-35% · 「engine 信 favorite · 但 underdog 機率 not negligible」
//   STRONG FAVORITE · <25% · 「dominance · upset 罕見 但 不為 0」
type UpsetTier = "coin-flip" | "competitive" | "favorite-lean" | "strong-favorite";

function classifyUpset(underdogWinPct: number): UpsetTier {
  if (underdogWinPct >= 45) return "coin-flip";
  if (underdogWinPct >= 35) return "competitive";
  if (underdogWinPct >= 25) return "favorite-lean";
  return "strong-favorite";
}

const TIER_META: Record<
  UpsetTier,
  { icon: string; label: string; color: string; explainer: string }
> = {
  "coin-flip": {
    icon: "🔥",
    label: "COIN-FLIP TIER",
    color: "text-gold",
    explainer: "兩隊伯仲 · 引擎信心 spread 最小 · 任何 random factor 都 巨大",
  },
  competitive: {
    icon: "⚖",
    label: "COMPETITIVE",
    color: "text-gold/80",
    explainer: "underdog 不弱 · 引擎仍 say 35-45% win · 大量 sample 才有意義",
  },
  "favorite-lean": {
    icon: "▸",
    label: "FAVORITE LEAN",
    color: "text-bone",
    explainer: "引擎信 favorite · 但 underdog 機率 not negligible · upset 仍可能",
  },
  "strong-favorite": {
    icon: "▪",
    label: "STRONG FAVORITE",
    color: "text-mute",
    explainer: "dominance · 引擎信心高 · upset 罕見但不為 0",
  },
};

export default function UnderdogLens({ match }: Props) {
  const homePct = match.home.winRate;
  const awayPct = match.away.winRate;
  const favoritePct = Math.max(homePct, awayPct);
  const underdogPct = Math.min(homePct, awayPct);
  const dominanceGap = Math.abs(homePct - awayPct);

  const homeFav = homePct >= awayPct;
  const favorite = homeFav ? match.home : match.away;
  const underdog = homeFav ? match.away : match.home;
  const favoriteSide = homeFav ? "HOME" : "AWAY";
  const underdogSide = homeFav ? "AWAY" : "HOME";

  const tier = classifyUpset(underdogPct);
  const meta = TIER_META[tier];

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          / UNDERDOG TRACKER · 黑馬機率 lens
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          LENS · LIVE
        </span>
      </div>

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

      {/* Underdog identification + probability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="border border-line/40 bg-slate/50 p-3">
          <p
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1"
          >
            UNDERDOG · {underdogSide}
          </p>
          <p className="text-bone text-base">{underdog.name}</p>
          <p
            lang="en"
            className="font-mono text-gold text-2xl sm:text-3xl tabular tracking-tight mt-1"
          >
            {underdogPct}
            <span className="text-base sm:text-lg opacity-60 ml-1">%</span>
          </p>
          <p
            lang="en"
            className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
          >
            UPSET PROBABILITY · engine v0.2
          </p>
        </div>
        <div className="border border-line/40 bg-slate/30 p-3">
          <p
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1"
          >
            FAVORITE · {favoriteSide}
          </p>
          <p className="text-mute text-base">{favorite.name}</p>
          <p
            lang="en"
            className="font-mono text-mute text-2xl sm:text-3xl tabular tracking-tight mt-1"
          >
            {favoritePct}
            <span className="text-base sm:text-lg opacity-60 ml-1">%</span>
          </p>
          <p
            lang="en"
            className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
          >
            ENGINE CONFIDENCE · LEADING
          </p>
        </div>
      </div>

      {/* Dominance gap visual */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <p
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            DOMINANCE GAP · |home% − away%|
          </p>
          <p
            lang="en"
            className="font-mono text-bone text-xs tabular"
          >
            {dominanceGap} pp
          </p>
        </div>
        <div className="relative h-2 bg-slate/60 border border-line/40">
          <div
            className={`absolute top-0 left-0 h-full ${
              dominanceGap < 10
                ? "bg-gold glow-gold"
                : dominanceGap < 20
                ? "bg-gold/70"
                : "bg-mute"
            }`}
            style={{ width: `${Math.min(dominanceGap * 2, 100)}%` }}
            role="img"
            aria-label={`Dominance gap ${dominanceGap} percentage points`}
          />
        </div>
        <p
          lang="en"
          className="mt-2 font-mono text-mute/60 text-[9px] tracking-[0.22em]"
        >
          0 pp = COIN-FLIP · &gt;30 pp = STRONG FAVORITE · CPBL season mean ~15 pp
        </p>
      </div>

      {/* Pratfall axiom · educational disclaimer */}
      <p className="font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.22em] leading-relaxed">
        ⚠ <strong className="text-mute">Upset Probability ≠「黑馬會贏」</strong>{" "}
        · 引擎仍 favor favorite · ZONE 27 不 contrarian play · 不推「黑馬精選 9
        連發」 grifter marketing · 純 surface 數字 reality:「今晚 favorite 多
        dominant?」 educational lens · 引擎 prediction 仍由{" "}
        <span className="text-gold/80">Win Probability lens(v0.2)</span> drive。
        underdog 真正贏 · /track-record 自動 ingest DIVERGED entry · 不藏。
      </p>
    </article>
  );
}
