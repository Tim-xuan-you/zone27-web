import Link from "next/link";
import CardBetStrip from "@/components/CardBetStrip";
import BaseballOverUnderStrip from "@/components/BaseballOverUnderStrip";
import MarketSplitBar from "@/components/MarketSplitBar";
import Avatar from "@/components/Avatar";
import { getTeamCrest } from "@/lib/identity";
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
import { getEngineReasoning } from "@/lib/reasoning";
import { deriveBaseballTotal, offersBaseballTotals } from "@/lib/baseball-totals";
import type { HeatDisplay } from "@/lib/match-heat";

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

export default function MiniMatchCard({
  match,
  analysisCount = 0,
  heat,
}: {
  match: Match;
  /** 這場有幾篇創作者分析(看板用 · >0 顯金色「N 篇分析」讓用戶一眼看出哪場有大神可跟單)*/
  analysisCount?: number;
  /** 這場熱度(鎖定人數 + 分析篇數 + 相對條寬 + 是否最熱)· 傳了就顯示熱度列、取代分析 chip ·
   *  讓賭徒一眼看出哪場在燒 → 點進去那場討論(lib/match-heat)。 沒傳 → 維持原本只顯分析 chip。 */
  heat?: HeatDisplay;
}) {
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
  // soul R209 · 看板主因縮影:把詳情頁已算好的「為什麼」(getEngineReasoning)往看板前擺
  // 一格 —— 訪客看到一堆 % 卻不知憑什麼,給 top-1 與 favorite 同向的因子標籤(純衍生)。
  // MLB 缺 ERA/BB9 時,沒有與 fav 同向的因子 → null → graceful 不顯示(不硬編假數據)。
  const topFactor = fav
    ? getEngineReasoning(match).factors.find((f) => f.lean === fav) ?? null
    : null;
  // 隊徽:CPBL = 中文單字 + 真隊色;MLB = 英文官方縮寫(LAD/NYY)+ 真招牌色。
  // 球迷靠縮寫 + 顏色秒認隊(MLB 中文首字毫無辨識度)· per getTeamCrest。
  const homeTeam = getTeamCrest(match.home.name, match.home.en, match.league);
  const awayTeam = getTeamCrest(match.away.name, match.away.en, match.league);
  // 大小分玩法線(棒球 CPBL/MLB · 引擎用各自全季真實得分基準挑公平線)· null = 不該開
  // (非棒球聯盟 / 延賽 / 無公平線)。
  const bouTotal = deriveBaseballTotal(match);

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
        <div className="flex items-center gap-1.5">
          {/* 有分析 = 金色 chip · 看板一眼看出哪場有人分析可跟單(賺抽傭的入口)·
              有傳 heat 時這顆併進下方熱度列(避免分析數顯示兩次)。 */}
          {!heat && analysisCount > 0 && (
            <span
              aria-label={`這場有 ${analysisCount} 篇創作者分析可看`}
              className="px-1 py-px text-[8px] tracking-[0.15em] border border-gold/60 text-gold font-mono tabular whitespace-nowrap"
            >
              {analysisCount} 篇分析
            </span>
          )}
          <MiniPhaseBadge phase={matchPhase} calibration={calibration} />
        </div>
      </div>

      {/* 熱度列(R228)· 讓賭徒一眼看出哪場在燒 → 點進去那場討論。 金色條寬 = 相對熱度,
          「最熱」標掛在這組最熱、且夠熱(≥5)的那場。 只在有真實活動時出現(graceful · 不假裝熱鬧)。 */}
      {heat && (heat.locks > 0 || heat.analyses > 0) && (
        <div className="flex items-center gap-2 -mt-0.5">
          {heat.hottest && (
            <span className="shrink-0 bg-gold text-navy font-mono text-[8px] tracking-[0.15em] px-1.5 py-px font-medium">
              最熱
            </span>
          )}
          <div className="flex-1 h-[3px] bg-line/40 rounded-sm overflow-hidden" aria-hidden="true">
            <div className="h-full bg-gold/70" style={{ width: `${Math.max(8, heat.barPct)}%` }} />
          </div>
          <span className="shrink-0 font-mono text-mute/70 text-[9px] tracking-[0.1em] tabular whitespace-nowrap">
            {heat.locks > 0 && `${heat.locks} 人已鎖定`}
            {heat.locks > 0 && heat.analyses > 0 && " · "}
            {heat.analyses > 0 && `${heat.analyses} 篇分析`}
          </span>
        </div>
      )}

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

        {/* soul R209 · 主因縮影:給數字一個「為什麼」(不喊去押 · 只解釋機率)*/}
        {topFactor && conviction.tier !== "tossup" && (
          <p className="mt-1 text-center font-mono text-mute text-[9px] tracking-[0.08em] leading-snug">
            主因 · {topFactor.label}
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
          engineHomePct={match.home.winRate}
        />
      )}

      {/* 棒球大小分押注(CPBL/MLB 未結算 · 引擎用各聯盟全季真實得分基準挑公平線 · 走 ~bou 隔離
          不污染「誰贏」)· bouTotal null(非棒球 / 延賽 / 無公平線)→ 自動不顯。 */}
      {bouTotal && !match.finalResult && (
        <BaseballOverUnderStrip
          matchId={match.id}
          dateISO={getMatchStartIso(match)}
          line={bouTotal.line}
          overPct={bouTotal.overPct}
          underPct={bouTotal.underPct}
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

      {/* 大小分賽後對帳(CPBL/MLB 已結算 · 本人有押才顯 · hideIfNoPick)· 🔴 線**不重算**:賽季基線
          會位移 → deriveBaseballTotal 賽後可能跳到另一條線 →「顯示沒押過的線 / 整條消失」。 改傳終場
          比分,strip 內讀本人這手、用 bouLineFromMarketId 解出當初凍住的線再對帳。 gate 用
          offersBaseballTotals(非 bouTotal)→ 即使現在重算不出公平線,用戶當初押的那手照樣顯示。
          ~bou 隔離不污染「誰贏」。 */}
      {offersBaseballTotals(match) && match.finalResult && (
        <BaseballOverUnderStrip
          matchId={match.id}
          dateISO={getMatchStartIso(match)}
          finalScore={{
            home: match.finalResult.homeScore,
            away: match.finalResult.awayScore,
          }}
          hideIfNoPick
        />
      )}

      <div className="mt-auto pt-2 flex items-baseline justify-end gap-2">
        <Link
          href={`/matches/${match.id}`}
          className={`font-mono text-[10px] tracking-[0.3em] transition-colors hover:text-gold ${
            analysisCount > 0 ? "text-gold" : "text-gold/70"
          }`}
        >
          {analysisCount > 0 ? `看 ${analysisCount} 篇分析 →` : "完整分析 →"}
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
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap"
      >
        即將開賽
      </span>
    );
  }

  if (phase === "today-live") {
    return (
      <span
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold text-gold font-mono whitespace-nowrap shimmer"
      >
        賽事中
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-gold/50 text-gold font-mono whitespace-nowrap"
      >
        尚未開打
      </span>
    );
  }

  // 「ARCHIVED」對中文訪客讀起來像系統錯誤(不是品牌詞 · 跟 PROVED/DIVERGED 的
  //  Z27 LEXICON 不同)→ 改白話「已結束」(plain Chinese visitor 鐵律)。
  return (
    <span
      className="px-1 py-0.5 text-[7px] tracking-[0.2em] border border-mute/60 text-mute font-mono whitespace-nowrap"
    >
      已結束
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
