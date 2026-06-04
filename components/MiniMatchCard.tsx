import Link from "next/link";
import CardBetStrip from "@/components/CardBetStrip";
import MarketSplitBar from "@/components/MarketSplitBar";
import Avatar from "@/components/Avatar";
import { teamIdentity } from "@/lib/identity";
import {
  getMatchPhase,
  getCalibration,
  getEnginePctOnWinner,
  getEngineFavorite,
  getMatchStartIso,
  type Match,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";
import { getEngineConviction } from "@/lib/conviction";

// ── ZONE 27 · Mini Match Card ────────────────────────────
// Round 31 Wave A · Compact static-engine card for the homepage
// TonightReceiptsCard multi-match grid. Companion to HeroLiveCard:
// HeroLiveCard runs the live 1000-game Monte Carlo cinematic for
// single-match days (visitor sees the algorithm converge in real
// time · brand IP soul). MiniMatchCard is the LOCK-IN viewer for
// multi-match days — shows the engine's pre-locked prediction
// (`match.home.winRate` / `match.away.winRate`) without re-running
// the simulation. This is INTENTIONAL brand IP discipline:
//
//   1. Costly Signaling purity. The predictions were locked in
//      BEFORE first pitch (when Tim screenshot the pregame and
//      Claude ingested via lib/matches.ts). Re-running a fresh
//      simulation on every visitor's browser would let us game
//      the receipt by sampling until we like the answer. Static
//      output proves the lock-in is real and immutable.
//
//   2. CPU budget. 3 simultaneous 1000-sim cards = 3000 sims on
//      mount = ~3-6 sec on mobile. The grid is a glance-mode
//      viewer · not a full-engine experience. Visitors who want
//      the full sim click through to /matches/[gameId] where
//      MatchSimulator runs the full theatre.
//
//   3. Visual hierarchy. The grid's job is to show 3 LOCKED bets
//      at once for the Costly Signaling brand IP moment. The
//      single-card cinematic (HeroLiveCard) is preserved for
//      receipt-mode days when there's ONE thing to focus on.
//
// Phase badge logic mirrors HeroLiveCard's PhaseBadge for
// consistency · same 5-state lifecycle. Final-state cards show
// PROVED ✓ / DIVERGED ✕ inline (compact receipt) without the
// full pitcher-stats panel that HeroLiveCard has room for.
// ─────────────────────────────────────────────────────

// 卡片緊湊日期 · "2026 · 06 · 02  ·  星期二" → "06/02（二）"。 per Tim R185 dogfood:
// 每張賽事卡都要帶日期 —— 卡片會被截圖、分享、跟別天的卡並排,沒日期就搞混。
function compactMatchDate(dateStr: string): string {
  const parts = dateStr.split("·").map((s) => s.trim());
  if (parts.length >= 4 && parts[1] && parts[2]) {
    return `${parts[1]}/${parts[2]}（${parts[3].replace("星期", "")}）`;
  }
  return dateStr;
}

export default function MiniMatchCard({ match }: { match: Match }) {
  const matchPhase: MatchPhase | null = getMatchPhase(match);
  const calibration = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);

  // Static engine output — the pre-locked prediction. Brand-IP
  // critical: these came from match.home.winRate which was set at
  // ingestion time · NOT re-sampled per visitor.
  const homePct = match.home.winRate;
  const awayPct = match.away.winRate;
  // 統一 favorite 判定(平手回 null = 兩邊都不上金 · 不硬塞一邊)· per getEngineFavorite
  const fav = getEngineFavorite(match);
  const homeFav = fav === "home";
  const awayFav = fav === "away";
  // 引擎信心溫度 · 純衍生(favorite 的 %)· per lib/conviction.ts
  const favPct = Math.max(homePct, awayPct);
  const dogPct = Math.min(homePct, awayPct);
  const conviction = getEngineConviction(favPct);
  // 隊徽:真隊色(調過 · 深藍底可辨)+ 中文單字 · 球迷靠顏色秒認隊(辨識度)
  const homeTeam = teamIdentity(match.home.name);
  const awayTeam = teamIdentity(match.away.name);

  return (
    <article
      aria-label={`${match.home.name} versus ${match.away.name} · engine prediction ${homePct}-${awayPct}`}
      // R109 W2 · view-transition-name per-card · unique 用 match.id · 當訪客
      // 從 /matches → /matches/[gameId] 跨頁 · 若 detail page 也加 matching name
      // browser morphs card position smoothly · 否則 fallback whole-doc fade
      // (per @view-transition navigation: auto in globals.css R109 W1)。
      // Older browsers ignore property completely · 0 risk · 純 progressive enhancement。
      style={{ viewTransitionName: `match-${match.id}` } as React.CSSProperties}
      data-match-card
      data-final={match.finalResult ? "true" : "false"}
      className="@container/card bg-slate/40 border border-line/60 p-4 sm:p-5 flex flex-col gap-2.5 transition-colors hover:border-gold/40"
    >
      {/* 日期 + 時間 + phase badge · 日期每卡必帶(per Tim R185 · 跨日不搞混) */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-mute text-[9px] tracking-[0.25em] tabular">
          <span className="text-mute/90">{compactMatchDate(match.date)}</span>
          <span className="text-mute/50 mx-1">·</span>
          {match.startTime}
        </span>
        <MiniPhaseBadge phase={matchPhase} calibration={calibration} />
      </div>

      {/* Team labels — symmetric layout · Round 31 Wave G A1 fix:加投手名
          Critic agent surface「3 場 grid 沒投手名 = LOCK 沒重量 · skeptic
          會嗆『連投手都沒確認就 LOCK 機率?』」。 投手名是 brand IP claim
          的物理錨點 — 引擎吃 K/9 BB/9 HR/9 · 該 surface「機率綁定哪個投手」。 */}
      <div className="grid grid-cols-2 gap-3 mt-0.5">
        <div>
          <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">
            HOME
          </p>
          <div className="flex items-center gap-1.5">
            <Avatar seed={match.home.name} size={22} glyph={homeTeam?.glyph} color={homeTeam?.color} />
            <h3 className="text-bone text-sm @[260px]/card:text-base font-light tracking-tight leading-snug">
              {match.home.name}
            </h3>
          </div>
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.2em] mt-1 leading-snug">
            P · {match.home.pitcher.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">
            AWAY
          </p>
          <div className="flex items-center justify-end gap-1.5">
            <h3 className="text-bone text-sm @[260px]/card:text-base font-light tracking-tight leading-snug">
              {match.away.name}
            </h3>
            <Avatar seed={match.away.name} size={22} glyph={awayTeam?.glyph} color={awayTeam?.color} />
          </div>
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.2em] mt-1 leading-snug">
            P · {match.away.pitcher.name}
          </p>
        </div>
      </div>

      {/* Engine static bar — pre-locked output */}
      <div className="mt-2">
        <div className="flex items-baseline justify-between mb-1.5">
          <span
            className={`font-mono text-xl sm:text-2xl font-light tabular tracking-tight ${
              homeFav ? "text-gold" : "text-mute"
            }`}
          >
            {homePct}
            <span className="text-xs opacity-60 ml-0.5">%</span>
          </span>
          <span
            className={`font-mono text-xl sm:text-2xl font-light tabular tracking-tight ${
              awayFav ? "text-gold" : "text-mute"
            }`}
          >
            {awayPct}
            <span className="text-xs opacity-60 ml-0.5">%</span>
          </span>
        </div>

        {/* Polymarket-style market line · two-sided split · favorite in gold ·
            underdog muted(replaces the thin one-sided 2px line)。 Reads instantly
            as「63 / 37」。 This is the ENGINE opening line now · crowd-driven
            movement layers on once migration 0003(predictions table)is applied。
            Any gap = tie probability(home%+away% < 100)· honest residual。 */}
        <MarketSplitBar
          homePct={homePct}
          awayPct={awayPct}
          goldSide={fav}
          variant="engine"
          ariaLabel={`引擎開盤線 · ${match.home.en} ${homePct}% / ${match.away.en} ${awayPct}%`}
        />
        {conviction.tier === "tossup" ? (
          // 銅板局:把「連引擎都難分」當主打 · gold 讓它在看板 grid 裡跳出來
          //(Polymarket「勢均力敵盤=主角」+ /calibration 57% 誠實護城河 · 不裝鐵口)
          <p className="mt-1.5 text-center font-mono text-gold/90 text-[9px] tracking-[0.12em] leading-snug">
            勢均力敵 · 連推演都只敢說 {favPct} / {dogPct}
          </p>
        ) : (
          <p className="mt-1.5 text-center font-mono text-mute/65 text-[9px] tracking-[0.12em] leading-snug">
            推演開盤{conviction.tier === "strong" ? "重壓" : "看好"}{" "}
            <span className="text-gold/80">
              {homeFav ? match.home.name : match.away.name}
            </span>
          </p>
        )}

      </div>

      {/* 卡上押注(未結算場)· R188:押注要登入(看免費 · 押要免費會員)*/}
      {!match.finalResult && (
        <CardBetStrip
          matchId={match.id}
          homeName={match.home.name}
          awayName={match.away.name}
          startISO={getMatchStartIso(match)}
        />
      )}

      {/* Final result strip — only when ingested */}
      {match.finalResult && calibration && (
        <div className="mt-2 pt-2 border-t border-gold/20">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="font-mono text-mute text-[9px] tracking-[0.25em]">
              ACTUAL
            </span>
            <span className="font-mono text-bone text-base font-light tabular tracking-tight">
              {match.finalResult.homeScore}:{match.finalResult.awayScore}
              <span className="text-mute text-[10px] ml-1.5">
                {match.finalResult.winner === "home"
                  ? match.home.en + " W"
                  : match.finalResult.winner === "away"
                  ? match.away.en + " W"
                  : "TIE"}
              </span>
            </span>
          </div>
          <MiniCalibrationVerdict
            calibration={calibration}
            enginePctOnWinner={enginePctOnWinner}
          />
        </div>
      )}

      <div className="mt-auto pt-2 flex items-baseline justify-end gap-2">
        <Link
          href={`/matches/${match.id}`}
          className="font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
        >
          完整分析 →
        </Link>
      </div>
    </article>
  );
}

// ── Mini phase badge ────────────────────────────────────
// Smaller variant of HeroLiveCard's PhaseBadge · same 5-state
// logic · tighter padding for grid cells.

function MiniPhaseBadge({
  phase,
  calibration,
}: {
  phase: MatchPhase | null;
  calibration: Calibration | null;
}) {
  if (!phase) return null;

  if (phase === "final" && calibration) {
    const styles = {
      proved: "border-gold text-gold",
      diverged: "border-loss/70 text-loss",
      push: "border-mute/60 text-mute",
    } as const;
    const labels = {
      proved: "✓ PROVED",
      diverged: "✕ DIVERGED",
      push: "= PUSH",
    } as const;
    return (
      <span
        lang="en"
        className={`px-1 py-0.5 text-[7px] tracking-[0.2em] border font-mono whitespace-nowrap ${styles[calibration]}`}
      >
        {labels[calibration]}
      </span>
    );
  }

  if (phase === "today-pregame") {
    return (
      <span
        lang="en"
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap"
      >
        PREGAME
      </span>
    );
  }

  if (phase === "today-live") {
    return (
      <span
        lang="en"
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap shimmer"
      >
        LIVE
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        lang="en"
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold/50 text-gold font-mono whitespace-nowrap"
      >
        PREVIEW
      </span>
    );
  }

  return (
    <span
      lang="en"
      className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-mute/60 text-mute font-mono whitespace-nowrap"
    >
      ARCHIVED
    </span>
  );
}

function MiniCalibrationVerdict({
  calibration,
  enginePctOnWinner,
}: {
  calibration: Calibration;
  enginePctOnWinner: number | null;
}) {
  if (calibration === "push") {
    return (
      <p className="font-mono text-mute text-[9px] tracking-[0.25em] mt-1">
        無 favorite · PUSH
      </p>
    );
  }
  return (
    <p
      className={`font-mono text-[9px] tracking-[0.25em] mt-1 ${
        calibration === "proved" ? "text-gold/80" : "text-loss/80"
      }`}
    >
      {calibration === "proved" ? "✓ 引擎命中" : "✕ 引擎落空"}
      {enginePctOnWinner !== null && (
        <span className="opacity-70 ml-1">
          ({enginePctOnWinner}% → {calibration === "proved" ? "WIN" : "卻贏"})
        </span>
      )}
    </p>
  );
}
