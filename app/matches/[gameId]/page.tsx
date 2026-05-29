import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import {
  getMatchById,
  getAllMatchIds,
  getMatchPhase,
  getCalibration,
  getEnginePctOnWinner,
  getTodayMatches,
  type Match,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";
import StatPercentileBar from "@/components/StatPercentileBar";
import AdvancedStatBar from "@/components/AdvancedStatBar";
import ConfidenceStars from "@/components/ConfidenceStars";
import VibeCheck from "@/components/VibeCheck";
import ParkFactorLens from "@/components/ParkFactorLens";
import PitcherFatigueLens from "@/components/PitcherFatigueLens";
import UnderdogLens from "@/components/UnderdogLens";
import BullpenDepthLens from "@/components/BullpenDepthLens";
import MatchupHistoryLens from "@/components/MatchupHistoryLens";
import LensTrace, { ENGINE_V02_TRACE_STEPS } from "@/components/LensTrace";
import MatchViewTracker from "@/components/MatchViewTracker";
import AnonPickWidget from "@/components/AnonPickWidget";
import LensFocusVote from "@/components/LensFocusVote";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import TonightMatchRail from "@/components/TonightMatchRail";
import EngineStamp from "@/components/EngineStamp";
import CopyLinkButton from "@/components/CopyLinkButton";
import ReceiptForwardButton from "@/components/ReceiptForwardButton";
import { getCpblAdvancedByName } from "@/lib/cpbl-advanced";
import RelatedReading from "@/components/RelatedReading";
import GameThread from "@/components/GameThread";
import FollowMatchButton from "@/components/FollowMatchButton";
import MatchNoteEditor from "@/components/MatchNoteEditor";
import MyTeamMatchNote from "@/components/MyTeamMatchNote";
import UserPredictionPicker from "@/components/UserPredictionPicker";
import TeamPickPanel from "@/components/TeamPickPanel";

// ── ISR · Re-render daily so updates to lib/matches.ts ship within
// 24h without a full redeploy. Pairs with isMatchDataStale() rendering
// an "ARCHIVED" badge when data is no longer today's slate.
export const revalidate = 86400; // 24 hours

// ── Pre-render all match pages at build time ───────────
export function generateStaticParams() {
  return getAllMatchIds().map((gameId) => ({ gameId }));
}

// ── Per-match page metadata (browser tab + OG) ─────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>;
}): Promise<Metadata> {
  const { gameId } = await params;
  const match = getMatchById(gameId);
  if (!match) return { title: "Match not found" };
  return {
    title: `${match.home.name} vs ${match.away.name} · ${match.league}`,
    description: `蒙地卡羅 10,000 次模擬 — ${match.home.name} ${match.home.winRate}% / ${match.away.name} ${match.away.winRate}%。${match.home.pitcher.name} vs ${match.away.pitcher.name}。`,
  };
}

// ── The Page ───────────────────────────────────────────
export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const match = getMatchById(gameId);
  if (!match) notFound();

  const m = match as Match;
  const homeFavored = m.home.winRate > m.away.winRate;
  const phase = getMatchPhase(m);
  const calibration = getCalibration(m);
  const enginePctOnWinner = getEnginePctOnWinner(m);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

      <main id="main">

      {/* Round 40 W-G · Agent F #5 · MatchViewTracker · client-only side
          effect · pushes current match to localStorage recent-matches list ·
          0 server write · 0 PII · per disclosure axiom storage key 公開 in
          /audit · WhatsApp landers 升 multi-game readers without cookies。 */}
      <MatchViewTracker
        gameId={m.id}
        title={`${m.home.name} vs ${m.away.name}`}
      />

      {/* ── BREADCRUMB ─────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
          <Link href="/" className="hover:text-gold transition-colors">
            HOME
          </Link>
          <span className="text-mute/60">/</span>
          <Link href="/matches" className="hover:text-gold transition-colors">
            MATCHES
          </Link>
          <span className="text-mute/60">/</span>
          <span className="text-gold">{m.league}</span>
        </div>
      </section>

      {/* ── HERO: TEAMS + META ───────────────────────
          Round 11: header label was static "LIVE AI MODEL" · misleading
          for past matches in receipt mode or stale-archived state.
          Now phase-aware: shows ENGINE RECEIPT / LIVE AI MODEL /
          ARCHIVED based on actual phase. Heartbeat dot only animates
          when phase is "live" or "today-pregame" (signals true live).
          R109 W4 · viewTransitionName match-{id} 配對 MiniMatchCard 跨頁
          morph · 訪客從 /matches grid 點進 detail page · browser 自動
          smooth 220ms morph card position → hero position(per R109 W1
          @view-transition navigation: auto · cubic-bezier easing)·
          老 browser 完全 ignore property · prefers-reduced-motion 必 respect。 */}
      <section
        style={{ viewTransitionName: `match-${m.id}` } as React.CSSProperties}
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10 pb-6"
      >
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span
            className={`w-1.5 h-1.5 rounded-full bg-gold ${
              phase === "today-pregame" || phase === "today-live"
                ? "shimmer"
                : ""
            }`}
            aria-hidden="true"
          />
          <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
            {phase === "final"
              ? `ENGINE RECEIPT · ${m.league} · ${m.date}`
              : phase === "stale-archived"
              ? `ARCHIVED · ${m.league} · ${m.date}`
              : `LIVE AI MODEL · ${m.league} · ${m.date}`}
          </span>
          <PhaseBadgeLg phase={phase} calibration={calibration} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-12">
          {/* R142 W1 · a11y fix · 之前 HOME + AWAY 都 <h1> 同 page · WCAG
              1.3.1 + 2.4.6 violation · screen-reader 用戶 hears 2 「Heading
              level 1」 cannot identify page topic · fix · add sr-only parent
              <h1> matchup title + demote both team names to <h2> · semantic
              hierarchy 一致。 */}
          <h1 className="sr-only">
            {m.home.name} vs {m.away.name} · {m.date} · {m.startTime} · {m.venue}
          </h1>

          {/* HOME */}
          <div>
            <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
              HOME
            </p>
            <h2 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1]">
              {m.home.name}
            </h2>
            <p className="font-mono text-gold/60 text-xs tracking-[0.3em] mt-2">
              {m.home.en}
            </p>
          </div>

          {/* VS */}
          <div className="text-center">
            <p className="font-mono text-gold/70 text-xl tracking-[0.3em]">
              VS
            </p>
          </div>

          {/* AWAY */}
          <div className="text-right">
            <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
              AWAY
            </p>
            <h2 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1]">
              {m.away.name}
            </h2>
            <p className="font-mono text-gold/60 text-xs tracking-[0.3em] mt-2">
              {m.away.en}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-mute">
          <span>{m.venue}</span>
          <span>FIRST PITCH · {m.startTime}</span>
        </div>

        {/* R153 W1 · GameThread MOVED TO TOP · Tim 13-fire same canary
            confirmed buried at bottom · 點 Nav 討論室 anchor 沒 reliably
            surface(7-LENS CANVAS 長 scroll labyrinth)· MOVE to top right
            after team headline + venue · before TeamPickPanel + 7-LENS ·
            visitor cannot miss · per Tim 13-fire trust founder + nuclear
            placement demand。 */}
      </section>
      <GameThread gameId={m.id} />
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
        {/* ── Round 38 W-B · TeamPickPanel header variant · Agent C P1
            ship · 對你說話 hook for first-time WhatsApp-link landers ·
            未 set localStorage z27_team 的訪客在這裡 inline pick ·
            picked 後 MyTeamMatchNote 自動 fire 對你的隊說話 · 不對球迷
            說話 · fan-grammar moat per [[feedback-zone27-audience-fans-
            not-engineers]]。 Brand IP:0 cookie · 0 server · 純 localStorage
            same as /track-record TeamPickPanel pattern。 */}
        <div className="mt-6 pt-4 border-t border-line/40">
          <TeamPickPanel variant="header" />
        </div>

        {/* ── Round 30 Wave 6 · FOLLOW BUTTON ───────────────
            First unlock feature for FREE TIER members(per Tim 4th
            canary「使用 · 解鎖功能」)。 Anonymous visitors 看「→ 登入
            解鎖 FOLLOW」連到 /login(帶 next param 登入後回此頁)。
            Logged-in 看「☆ FOLLOW」 / 「★ FOLLOWED」 toggle。 賽後
            這場 finalized 進您 /member follows list · /member/calibration
            personal mode(Round 30+)的資料 source。 */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-line/40">
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-snug">
            ★ Follow 這場 · 賽後 receipt 自動進您 <span lang="en">/member</span>
          </p>
          <FollowMatchButton matchId={m.id} />
        </div>

        {/* Round 31 Wave N · 「您支持的 X 在這場是 favorite/underdog」
            personal narrative · 對你說話 · 不對球迷說話 · client-hydrate
            after myTeam set in localStorage(z27_team)。 */}
        <MyTeamMatchNote
          homeName={m.home.name}
          awayName={m.away.name}
          homeWinRate={m.home.winRate}
          awayWinRate={m.away.winRate}
          finalWinner={m.finalResult?.winner ?? null}
        />

        {/* Round 31 W-W1 · User Prediction Picker · 您自己也猜 · 對照
            engine + 實際 · 純精神 epistemic mirror · Metaculus pattern。 */}
        <UserPredictionPicker
          matchId={m.id}
          homeName={m.home.name}
          awayName={m.away.name}
          engineHomePicked={m.home.winRate >= m.away.winRate}
          finalWinner={m.finalResult?.winner ?? null}
        />
      </section>

      {/* ── R45 W-D · Agent L DEEPEST · Anonymous Lens-Pick Loop ─────
          Pre-engine-reveal pick widget · IKEA effect 訪客 invested 個人
          calibration vs engine · localStorage-only · 0 auth · 0 server ·
          per [[zone27-disclosure-philosophy]] storage key zone27_anon_picks_v1
          公開 in /audit S06。 0 gating · skip 隨時可達 · brand IP「不打擾就是
          禮物」 axiom 守。 client component · SSR-safe discriminated union
          mount pattern。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
        {/* R73 W-A · ClientErrorBoundary wrap · localStorage operations + form
            state hydrate risk-bearing client components · brand-pure fallback
            UI prevents whole-page crash · per code-quality deferred R66+。 */}
        <ClientErrorBoundary fallbackLabel="AnonPickWidget · Epistemic Gym">
          <AnonPickWidget match={m} />
        </ClientErrorBoundary>
      </section>

      {/* ── THE MASSIVE WIN BAR ────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
        <div className="bg-slate/70 border border-line/80 glow-soft p-8 sm:p-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
            AI PROBABILITY · MONTE CARLO N = 10,000
          </p>

          {/* The numbers */}
          <div className="flex items-baseline justify-between mb-4">
            <span
              className={`font-mono tabular tracking-tight ${
                homeFavored ? "text-gold" : "text-mute"
              } text-6xl sm:text-7xl font-light`}
            >
              {m.home.winRate}
              <span className="text-2xl sm:text-3xl opacity-60 ml-1">%</span>
            </span>
            <span
              className={`font-mono tabular tracking-tight ${
                !homeFavored ? "text-gold" : "text-mute"
              } text-6xl sm:text-7xl font-light`}
            >
              {m.away.winRate}
              <span className="text-2xl sm:text-3xl opacity-60 ml-1">%</span>
            </span>
          </div>

          {/* THE BAR */}
          <div className="relative h-1 bg-line/80">
            <div
              className="absolute top-0 left-0 h-full bg-gold glow-gold shimmer"
              style={{ width: `${m.home.winRate}%` }}
            />
            <div
              className="absolute -top-1.5 h-[16px] w-px bg-gold"
              style={{ left: `${m.home.winRate}%` }}
            />
          </div>

          {/* Confidence · Round 33 W-A · ConfidenceStars 1-5 升 authority-bias
              + decision-cost-collapse hook(per agent customer-driven product
              redesign · canonical sports-betting subscription benchmark)。
              Vocabulary: STRONG/CLEAR/DECENT/WEAK SIGNAL · COIN-FLIP · 不用
              「LOCK」 報明牌 grifter vocab。 mechanical mapping derives from
              aiConfidence · /audit S02 ESTIMATION DISCLOSURE 公開。 */}
          <div className="mt-8 flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                AI CONFIDENCE
              </p>
              <ConfidenceStars
                confidence={m.aiConfidence}
                variant="stack"
              />
            </div>
            <div
              className="text-right"
              title={`EDGE · ${Math.abs(m.home.winRate - m.away.winRate)} PP = percentage points · 引擎對 favorite 的信心強度(機率差距)· per /audit S02 ESTIMATION DISCLOSURE`}
            >
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                EDGE
              </p>
              <p className="font-mono text-gold text-2xl tabular">
                +{Math.abs(m.home.winRate - m.away.winRate)} PP
              </p>
            </div>
          </div>
          {/* ── Round 38 W-E · Coin-Flip Baseline 對照 strip · Agent A #2 ship
              FanGraphs 4-mode pattern · 「null hypothesis 永遠 visible」 brand
              IP · 不只 publish 引擎信心 · 也 publish coin-flip baseline 該
              比賽如果沒 information 信號 = 50%/50% · 引擎 number 減去 50%
              才是 real edge claim · Pratfall + Method Public 同時 fire ·
              displacement mission 對 玩運彩+報馬仔:他們從不 publish baseline
              因為 publishing 等於暴露「跟 coin flip 一樣」。 brand-pure
              static · 0 deps · 0 cost · 1 SVG-free row。
              R119 W3 · Tversky & Kahneman 1974 anchoring 重排 · NULL cell
              移到左(reading-order 第一視覺 anchor)· 加 2px gold/70 左邊框
              accent · 訪客 first cognitive anchor = 50% baseline · 然後 ENGINE %
              呈現為 baseline 上方的 delta(edge claim 顯式 derive)· 「不藏
              baseline · 反而 amplify visual prominence」 brand IP Pratfall
              maximum 火力 · 玩運彩+報馬仔 結構性無法 ship 此排序 · 因為若
              他們 publish baseline first · 整個 tipster business 公開等於
              「我們只比 coin flip 強 X pp」 自我否定。 */}
          <div className="mt-6 pt-5 border-t border-line/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-line/40 border-l-2 border-l-gold/70 bg-slate/40 p-3">
              <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-1">
                NULL · COIN-FLIP BASELINE
              </p>
              <p className="font-mono text-bone text-base tabular">
                50% / 50%
              </p>
              <p className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1">
                0 信息 · 純機率 · 引擎邊際 = {Math.abs(Math.max(m.home.winRate, m.away.winRate) - 50)} pp
              </p>
            </div>
            <div className="border border-line/40 bg-slate/50 p-3">
              <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1">
                ENGINE MODE · v0.2 PITCHER-ONLY MC
              </p>
              <p className="font-mono text-gold text-base tabular">
                {Math.max(m.home.winRate, m.away.winRate)}% / {Math.min(m.home.winRate, m.away.winRate)}%
              </p>
              <p className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1">
                K/9 · BB/9 · HR/9 · N=10,000 sim
              </p>
            </div>
          </div>

          {/* Round 31 Wave B · datestamped engine stamp · 預測 lock-in 物理證據
              + BUILD chip 直連 GitHub commit · audit trail 1-click 可達 */}
          <div className="mt-6 pt-5 border-t border-line/40 flex flex-wrap items-baseline justify-between gap-3">
            <EngineStamp />
            {/* Round 44 W-D · Agent L GAP-1 fix · CopyLinkButton on /matches/
                [gameId] · highest-volume share route(WhatsApp / LINE landings)
                previously had no share button · CopyLinkButton 已 wired
                /methodology · /audit · /founders · /coverage · /manifesto ·
                /discipline · 此處 finally 補上 · refTag=match-{gameId} 帶
                per-match attribution(0 tracking · 純 URL query)。 */}
            <CopyLinkButton refTag={`match-${m.id}`} />
          </div>
        </div>
      </section>

      {/* ── CALIBRATION RECEIPT (only when finalResult ingested) ──
          Largest single-purpose disclosure block on the page when
          present. Renders engine prediction vs actual outcome at
          equal visual weight. Maps to /audit S05 DISCLOSURE PHILOSOPHY
          + /manifesto S II + /discipline Section 01 (Buffett "track
          record visible"). Section "/ 00" intentionally precedes the
          canonical /01-/05 flow — it's the receipt headline when one
          exists.
          R62 W-B · ReceiptForwardButton inserted below the
          tagline · Stratechery + Defector + Athletic plain-text share
          pattern · 0 tracking artifact-share。 */}
      {m.finalResult && calibration && (
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
          <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
            / 00 · ENGINE RECEIPT · 預測 vs 實際
          </h2>
          <div
            className={`bg-slate/70 border p-8 sm:p-12 ${
              calibration === "proved"
                ? "border-gold/60 glow-soft"
                : calibration === "diverged"
                ? "border-loss/50"
                : "border-line/70"
            }`}
          >
            <div className="grid sm:grid-cols-2 gap-10 mb-10">
              <div>
                <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-4">
                  ENGINE PREDICTED · PRE-GAME
                </p>
                <p className="font-mono text-bone text-5xl sm:text-6xl tabular tracking-tight font-light">
                  {Math.max(m.home.winRate, m.away.winRate)}
                  <span className="text-2xl sm:text-3xl opacity-60 ml-1">
                    %
                  </span>
                </p>
                <p className="font-mono text-gold/70 text-sm tracking-[0.25em] mt-3">
                  {m.home.winRate >= m.away.winRate
                    ? `${m.home.name} (HOME)`
                    : `${m.away.name} (AWAY)`}{" "}
                  WIN
                </p>
                <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-2">
                  N = 10,000 · 10K Monte Carlo · 賽前公開鎖定
                </p>
              </div>
              <div className="sm:text-right">
                <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-4">
                  ACTUAL RESULT · POST-GAME
                </p>
                <p className="font-mono text-bone text-5xl sm:text-6xl tabular tracking-tight font-light">
                  {m.finalResult.homeScore}
                  <span className="text-mute mx-3">:</span>
                  {m.finalResult.awayScore}
                </p>
                <p className="font-mono text-gold/70 text-sm tracking-[0.25em] mt-3">
                  {m.finalResult.winner === "home"
                    ? `${m.home.name} W`
                    : m.finalResult.winner === "away"
                    ? `${m.away.name} W`
                    : "TIE"}
                </p>
                <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-2">
                  {m.finalResult.innings ?? 9} 局 · 收錄 ·{" "}
                  {m.finalResult.ingestedAt}
                </p>
              </div>
            </div>

            <div className="border-t border-line/50 pt-8">
              <CalibrationVerdictLg
                calibration={calibration}
                enginePctOnWinner={enginePctOnWinner}
              />
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-6 leading-relaxed">
                這條收據永遠在公開頁面 · 不刪 · 不修飾 · 不過濾。
                所有 ZONE 27 引擎產生的預測,賽後都會在{" "}
                <Link
                  href="/track-record"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /track-record
                </Link>{" "}
                找到對應的 PROVED 或 DIVERGED 行 — 含這場。
              </p>
              {/* R62 W-B · Receipt forward button · plain-text artifact share ·
                  Stratechery + Defector + Athletic non-tracking pattern · per
                  Pokemon TCG「show off receipt」 mechanic 延伸。 */}
              <div className="mt-6 pt-5 border-t border-line/40 flex items-center justify-center">
                <ReceiptForwardButton match={m} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ENGINE TRACE · Round 42 W-E · Agent I dogfood deepest fix
          MOVED from /01A to /00B per Agent I deepest call:LensTrace
          5-step pipeline 描述 produces MASSIVE WIN BAR + EngineNarrative
          (上方 sections)· not the 6 lenses below(those are separate
          components from different libs)· 放在 hero 後 立刻 satisfy
          「prediction → trace」 1-click adjacency per LensTrace 設計 axiom。
          Renumber 從 /01A → /00B(conditional /00 calibration receipt 後
          followed by always-rendered /00B trace · before /01 pitcher matchup)。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          / 00B · ENGINE TRACE · 5 步 deterministic pipeline(GitHub 可驗證)
        </h2>
        <LensTrace
          steps={ENGINE_V02_TRACE_STEPS}
          engineLabel="v0.2 PITCHER-ONLY MC"
        />
      </section>

      {/* ── PITCHER MATCHUP ────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / 01 · STARTING PITCHER MATCHUP
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <PitcherCard side="HOME" team={m.home.name} pitcher={m.home.pitcher} />
          <PitcherCard side="AWAY" team={m.away.name} pitcher={m.away.pitcher} />
        </div>
      </section>

      {/* ── ENGINE NARRATIVE · Round 31 Wave G S1 critic patch ──
          Critic agent surface:「比賽頁 narrative 是 0 — 純表格 stack ·
          沒有一句中文敘述為什麼這代表 X 隊 N% 勝率。 對 CPBL 球迷,這幾乎是
          侮辱 — 因為他們就是來看故事的。」 fan grammar match · 主動承認
          引擎不吃什麼 = Pratfall。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <EngineNarrative match={m} />
      </section>

      {/* ── LENS FOCUS VOTE · R67 W-A · Agent R66 ship #1 deferred ──
          Cialdini & Trope 1976 commitment-consistency 物理 codify ·
          pre-canvas 1-tap pre-commit「您認為哪個 lens 對今晚這場最 matter」 ·
          後 visitor read /02A-/02F 帶 own bet mentally active · 比 cold
          scroll 更高 retention。 brand IP 全 ✓:0 server / 0 PII / 0
          leaderboard / 0 「X% voters」 social proof feed · 純 personal
          pre-commitment artifact。 同 AnonPickWidget pattern · localStorage
          zone27_lens_focus_votes_v1 · /audit S06 disclose。
          Placement · BEFORE /02 LENS CANVAS hub · 順序:AnonPick(team) →
          LensFocusVote(angle) → 7-lens canvas → 兩個 commitments 同時
          mentally active · Cialdini foot-in-the-door 物理 codify。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-12">
        {/* R73 W-A · ClientErrorBoundary wrap · LensFocusVote localStorage
            commitment-consistency widget · 不 take down whole page on
            quota/disabled localStorage crash。 */}
        <ClientErrorBoundary fallbackLabel="LensFocusVote · pre-canvas commit">
          <LensFocusVote matchId={m.id} />
        </ClientErrorBoundary>
      </section>

      {/* ── /02 · LENS CANVAS · Round 42 W-E · Agent I dogfood F1.2 fix
          One Tier-1 header introduces the 6 lens sub-sections collectively ·
          內個 lens sub-section 從 /01B-/01G outdented to /02A-/02F at Tier-2
          visual weight(text-[9px] · tracking-[0.3em] · border-l-2 border-
          gold/30 pl-3)· WhatsApp landers 看清 hierarchy(/01 STARTING
          PITCHER 是 Tier-1 · 6 lens 是 nested under Tier-1 /02 LENS CANVAS
          parent)· 「all 7 sections equal volume」 wall fix。 */}
      {/* Round 43 W-D · Agent J N1 fix · Tier-1 hub vs Tier-2 sub-lenses
          visual hierarchy strengthen · 之前 /02 hub + /02A-02F sub-lenses
          都 text-[10px] · 訪客看 mobile 視覺 collapse · 修:hub 升 text-xs
          + larger gold-glow underline + 不 tracking-[0.4em] 過 tight · 父
          子關係 visible at glance not requiring body prose to decode。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-6 pt-2">
        <div className="border-l-4 border-gold pl-4 mb-4">
          <h2 className="font-mono text-gold text-xs sm:text-sm tracking-[0.3em] mb-1">
            / 02 · LENS CANVAS
          </h2>
          <p className="font-mono text-bone text-[10px] tracking-[0.25em]">
            6 個獨立 analytical angles · 集合 view
          </p>
        </div>
        <p className="text-mute text-sm leading-relaxed max-w-2xl">
          以下 6 個 sub-lens(下方 02A-02F)· 各自 publish methodology +
          open code + educational explainer · 共同回答「<strong className="text-bone">這場 多角度 看 什麼？</strong>」
          · 不替代 Win Probability prediction(/00B engine trace 是 prediction layer)。
          Patek Philippe complication 模式 · per /methodology Section 05。
        </p>
      </section>

      {/* ── VIBE CHECK LENS · Round 37 W-B · 1st of 6 sub-lenses under
          /02 LENS CANVAS · outdented to Tier-2 visual weight per Agent I
          F1.2 fix(text-gold/80 text-[9px] · tracking-[0.3em] · border-l-2
          border-gold/30 pl-3 · pb-12 不 pb-20 較緊湊)。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12 pt-10 border-t border-line/30 [content-visibility:auto] [contain-intrinsic-size:0_600px]">
        <h3 className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-4 border-l-2 border-gold/30 pl-3">
          / 02A · VIBE CHECK · 氣勢 lens(streak descriptive · 非 prediction)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VibeCheck teamName={m.home.en} recent={m.home.recent} />
          <VibeCheck teamName={m.away.en} recent={m.away.recent} />
        </div>
      </section>

      {/* ── PARK FACTOR LENS · Round 37 W-C 第 2 個 Lens Variety 真實 LIVE ──
          per [[feedback-no-waiting-rule]] iron rule「任何現在能做就做」 ·
          R36 W-A Lens Variety table 第 3 個 candidate 落地。 純 data viz
          from existing match.venue + lib/cpbl-parks.ts reference data ·
          「park factor ≠ outcome predictor」 educational disclaimer · brand-
          pure 不假 prediction · ESTIMATE methodology + PR invitation per
          /audit Section 02 ESTIMATION DISCLOSURE pattern · 同 Section 05
          Lens Variety axiom。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12 pt-10 border-t border-line/30 [content-visibility:auto] [contain-intrinsic-size:0_600px]">
        <h3 className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-4 border-l-2 border-gold/30 pl-3">
          / 02B · PARK FACTOR · 場館 lens(home advantage · 非 prediction)
        </h3>
        <ParkFactorLens venue={m.venue} />
      </section>

      {/* ── PITCHER FATIGUE LENS(v0.1 proxy) · Round 38 W-A 第 3 個 Lens
          Variety 真實 LIVE · per [[feedback-no-waiting-rule]] · R36 W-A
          Lens Variety table 第 4 個 candidate 落地。 v0.1 PROXY · 用 existing
          WHIP + BB9 + K9 季累計 derive command stability proxy(不是
          true fatigue · v0.2 需 ingest rest_days + season_ip)· brand IP
          Pratfall + Costly Signaling + Disclosure 三 axiom 同時 fire。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12 pt-10 border-t border-line/30 [content-visibility:auto] [contain-intrinsic-size:0_600px]">
        <h3 className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-4 border-l-2 border-gold/30 pl-3">
          / 02C · WORKLOAD PROXY · 投手負荷 lens(v0.1 · 命名 vocabulary per /steelman Obj 03)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PitcherFatigueLens pitcher={m.home.pitcher} teamName={m.home.en} />
          <PitcherFatigueLens pitcher={m.away.pitcher} teamName={m.away.en} />
        </div>
      </section>

      {/* ── UNDERDOG LENS · Round 39 W-B 第 5 個 Lens Variety LIVE ─────
          per [[feedback-no-waiting-rule]] · R36 W-A Lens Variety table
          第 5 個 candidate「Underdog Tracker · 黑馬機率」 落地。 不是「黑馬
          精選」 contrarian play(grifter pattern)· 是「surface 引擎信心
          spread reality」 educational lens · Pratfall「upset probability
          ≠ underdog 會贏」 主動 surface · displacement mission 對 玩運彩
          「冷門大爆」 marketing 反向 · 0 contrarian play · 0 prediction
          偏置 · 純 viz from existing winRate data。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12 pt-10 border-t border-line/30 [content-visibility:auto] [contain-intrinsic-size:0_600px]">
        <h3 className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-4 border-l-2 border-gold/30 pl-3">
          / 02D · UNDERDOG TRACKER · 黑馬機率 lens(upset probability · 非 contrarian)
        </h3>
        <UnderdogLens match={m} />
      </section>

      {/* ── BULLPEN DEPTH LENS(v0.1 PROXY) · Round 40 W-A 第 6 個 ──
          per [[feedback-no-waiting-rule]] · R36 W-A Lens Variety table
          第 6 個 candidate「Bullpen Depth · 兩隊牛棚深度比較」 落地 · v0.1
          PROXY · 用 existing team recent W-L 推測 late-inning resilience
          (不是 true bullpen depth · v0.2 需 ingest bullpen ERA + IP usage
          + last 7 days workload)· brand IP Pratfall + Costly Signaling +
          Disclosure 三 axiom 同時 fire · 同 PitcherFatigueLens v0.1 PROXY
          pattern。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12 pt-10 border-t border-line/30 [content-visibility:auto] [contain-intrinsic-size:0_600px]">
        <h3 className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-4 border-l-2 border-gold/30 pl-3">
          / 02E · BULLPEN DEPTH · 牛棚 lens(v0.1 PROXY · 非 prediction)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BullpenDepthLens team={m.home} side="HOME" />
          <BullpenDepthLens team={m.away} side="AWAY" />
        </div>
      </section>

      {/* ── MATCHUP HISTORY LENS · Round 40 W-B 第 7 個(canvas 完成)──
          per [[feedback-no-waiting-rule]] · R36 W-A Lens Variety table
          第 7 個 candidate「Matchup History · 此 matchup 過去 H2H + 趨勢」
          落地 · 完成 7-lens canvas。 跟 Bullpen Depth 不同 · 此 lens 是
          REAL DATA(不是 v0.1 PROXY)· auto-derive from existing finalized
          matches.ts data · 同 team-pair 查 historical encounters · N=0/1
          stage 顯 educational lens explaining「為什麼 H2H 重要」 · N≥10
          後 surface 真實 trend。 displacement narrative 物理閉環:
          /methodology Section 05 「We're building 7」 → 「WE BUILT 7」 LIVE
          truth not future promise · displacement battle 對 玩運彩+報馬仔
          1 fake angle vs ZONE 27 7 honest 物理閉合。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20 pt-10 border-t border-line/30 [content-visibility:auto] [contain-intrinsic-size:0_600px]">
        <h3 className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-4 border-l-2 border-gold/30 pl-3">
          / 02F · MATCHUP HISTORY · H2H lens(real data · 6th sub-lens · 7-LENS CANVAS COMPLETE)
        </h3>
        <MatchupHistoryLens match={m} />
      </section>

      {/* ── R125 W6 · CONTEXT-AWARE FOUNDERS 27 CTA · Agent C R125 Friction 4 fix ──
          per audit「7 LIVE LENS shipped on /matches/[gameId] · zero Founders 27
          tie-in · visitor 跑完 calibration loop 後 no upgrade trigger」 · per
          Forrester 2024「context-aware CTAs on detail pages convert 2.4x higher
          than universal navigation」 + R125 [[feedback-zone27-paid-model-is-
          support-not-features]] memory · Defector $690K day-1 cite · brand-pure
          inline strip · NOT modal · NOT FOMO counter · just appropriate-moment
          quiet invitation post-7-lens canvas complete。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <div className="max-w-2xl mx-auto border-l-2 border-gold/60 pl-5 sm:pl-6 py-3 bg-slate/20">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.35em] mb-2"
          >
            ⚓ POST-7-LENS · 您可能在想
          </p>
          <p className="text-bone text-base sm:text-lg leading-relaxed font-light mb-3">
            「我已經 spend 5 分鐘 lock 預測 + 跑 7 lens · 我想 own 完整 ledger」
          </p>
          <p className="text-mute text-sm sm:text-base leading-relaxed mb-3">
            Founders 27 不是 unlock engine(<strong className="text-bone">engine FREE forever</strong>)·
            是 270 個 founding seats 之一 · 同 Defector 2020 founding subs $69/年(產品 6 週後才上線 · 訂戶 fund 不是 access)。
          </p>
          <div className="flex items-baseline gap-4 flex-wrap">
            <Link
              href="/founders"
              className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline"
            >
              讀完整 Founders 27 →
            </Link>
            <Link
              href="/founders/apply"
              className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline"
            >
              直接申請席位 → /founders/apply
            </Link>
            <Link
              href="/founders"
              className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline"
            >
              為什麼定這價 → /founders §定價推導
            </Link>
          </div>
        </div>
      </section>

      {/* ── SCORE DISTRIBUTION ─────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / 03 · TOP 5 PROJECTED FINAL SCORES
        </h2>

        <div className="space-y-3">
          {m.topScores.map((s, i) => (
            <ScoreRow key={s.score} rank={i + 1} score={s.score} pct={s.probability} />
          ))}
        </div>
        <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-6">
          AGGREGATED FROM 10,000 SIMULATED FULL GAMES.
        </p>
      </section>

      {/* ── RECENT FORM ────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / 04 · LAST 5 GAMES
        </h2>
        <div className="grid sm:grid-cols-2 gap-12">
          <FormRow team={m.home.name} recent={m.home.recent} />
          <FormRow team={m.away.name} recent={m.away.recent} />
        </div>
      </section>

      {/* ── AI METHODOLOGY ─────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / 05 · HOW WE COMPUTE
        </h2>

        <div className="space-y-6">
          <MethodStep
            no="A"
            title="公開資料先驗"
            body="投手 K/9 · BB/9 · HR/9 三項基礎指標 — MLB Stats API(MLB)或創辦人親手 curate(CPBL,詳見 /coverage)。"
          />
          <MethodStep
            no="B"
            title="投打對決機率矩陣"
            body="每個打席依投手三項指標推導 8 種互斥結果(K · BB · HR · 1B · 2B · 3B · GO · FO)的條件機率,滾亂數選一個。"
          />
          <MethodStep
            no="C"
            title="蒙地卡羅萬次推演"
            body="引擎在您的瀏覽器內跑 10,000 場虛擬 9 局比賽(~ 1.5 - 2.0 秒收斂),ZONE 27 伺服器零運算。"
          />
          <MethodStep
            no="D"
            title="結果分布加總"
            body="統計 10,000 場虛擬比賽中各隊獲勝次數與最終比分,輸出本頁所有機率與信心指標。"
          />
        </div>

        <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
          ▸ 引擎範圍說明(範圍外事項 · 訪客判讀時可加上直觀調整)在{" "}
          <Link href="/audit" className="text-gold hover:underline">
            /audit
          </Link>{" "}
          Section 03 · 完整工程白皮書見{" "}
          <Link href="/methodology" className="text-gold hover:underline">
            /methodology
          </Link>
          。
        </p>
      </section>

      {/* ── /06 · RUN IT YOURSELF (embedded live sim) ─ */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-16">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          / 06 · RUN IT YOURSELF
        </h2>
        <p className="text-mute text-sm leading-relaxed mb-10 max-w-xl">
          別只看我們的數字。直接在瀏覽器裡跑一輪完整的 Monte Carlo,
          看 10,000 次模擬從亂數收斂成穩定的勝率分布,再按 REPLAY
          看一場 9 局逐打席文字直播。
        </p>
        <MatchSimulator key={m.id} match={m} />
      </section>

      {/* ── Round 30 Wave 9 · Personal note editor · logged-in only ─── */}
      <MatchNoteEditor matchId={m.id} />

      {/* ── Round 30 Wave 11 · DELETED · DISCUSSION LOCK placeholder ──
          原 large gold-bordered「PRE-LAUNCH · FOUNDERS + BLACK CARD ROOM」
          panel(10+ lines · 「即時討論室將在創始名冊啟動時上線」)違反 brand
          axiom「沒有『即將推出 · 敬請期待』」。 而且 W6 ★ Follow · W9 ✏️ Note ·
          W10 ↗ Submit · W10 Personal Mirror 已 ship 真實 unlocks · placeholder
          完全多餘。 Conversion path 到 /founders 保留在 RelatedReading +
          Footer + Cmd-K · 此 section 刪除無損 conversion。 */}

      {/* R153 W1 · GameThread MOVED TO TOP of page · removed from this
          position(was after 7-LENS CANVAS before RelatedReading)· Tim
          13-fire screenshot confirmed buried position 沒 reliably surface ·
          now visible at TOP right after team headline + venue per Tim
          nuclear placement demand。 */}

      {/* ── RELATED READING · Round 11 audit fix ──────
          Was: lone「← 回到今日賽事板」retreat link · dead-end.
          Per Round 11 agent: visitor scrolled past Founders CTA ·
          died at back link. Now forward CTAs · loss-aversion respect. */}
      <RelatedReading currentPath="/matches/[gameId]" />

      {/* ── BACK · subdued footnote · was the only nav ───────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
        <Link
          href="/matches"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
        >
          ← 回到今日賽事板
        </Link>
      </section>

      </main>

      {/* R70 W-D · TonightMatchRail · Agent A R70 SHIP 1 · mobile-first
          persistent match-switcher above StickyFoundersCTA · CPBL 80% of
          nights have 3 games · 1-tap lateral nav between tonight's
          matches · MLB At Bat scoreboard ribbon + Bloomberg watchlist
          rail pattern · pre-locked engine % NOT live odds(brand-pure
          per Costly Signaling)· <= 1 match · component returns null。
          R71 W-E · Agent B audit F5 fix · phase guard · 只 render on
          today-pregame + today-live(現場相關 phases)· 不 render on
          final · stale-archived · future(archived match 不該 surface
          tonight switcher · visual confusion + brand IP noise creep)。 */}
      {(phase === "today-pregame" || phase === "today-live") && (
        <TonightMatchRail
          currentMatchId={m.id}
          matches={getTodayMatches().map((tm) => ({
            id: tm.id,
            homeName: tm.home.name,
            awayName: tm.away.name,
            homeWinRate: tm.home.winRate,
            awayWinRate: tm.away.winRate,
            startTime: tm.startTime,
          }))}
        />
      )}

      <Footer />
    </div>
  );
}

// ── EngineNarrative · Round 31 Wave G S1 critic patch ──
// Fan-grammar narrative explaining engine's prediction in plain Chinese ·
// 同時 surface 引擎不吃什麼(individual batter quality · head-to-head ·
// ballpark · bullpen)= Pratfall axiom 物理產出。 Generic across all
// matches — derives the 3-stat comparison from match data · no per-game
// hardcoded narrative。 Cross-link 到 /audit S03 ENGINE SCOPE + /changelog
// for future v0.3 commits。
function EngineNarrative({ match }: { match: Match }) {
  const homeFav = match.home.winRate > match.away.winRate;
  const fav = homeFav ? match.home : match.away;
  const dog = homeFav ? match.away : match.home;
  const favPct = homeFav ? match.home.winRate : match.away.winRate;

  // Parse three rate stats(strings to numbers · graceful fallback)
  const eraGap = parseFloat(dog.pitcher.era) - parseFloat(fav.pitcher.era);
  const k9Gap = parseFloat(fav.pitcher.k9) - parseFloat(dog.pitcher.k9);
  const bb9Gap = parseFloat(dog.pitcher.bb9) - parseFloat(fav.pitcher.bb9);
  const hr9Gap = parseFloat(dog.pitcher.hr9) - parseFloat(fav.pitcher.hr9);

  const gapStr = (n: number) =>
    Number.isFinite(n) ? (n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2)) : "—";

  // R108 W3 · NaN guard helper · 防 silent fall-through masking malformed
  // data per Agent 1 audit · 若 parseFloat → NaN · 每個 comparison return
  // false → defaults to「差不多 · 非關鍵」 label(masks bad data · violation
  // of Disclosure axiom)· 加 explicit isFinite check 顯式 surface「(資料未補)」。
  const tieredLabel = (
    n: number,
    threshold: number,
    strong: string,
    mid: string,
    weak: string
  ): string => {
    if (!Number.isFinite(n)) return "(資料未補)";
    return n > threshold ? strong : n > 0 ? mid : weak;
  };

  return (
    <blockquote className="border-l-2 border-gold/50 pl-6 sm:pl-8 py-3 max-w-3xl">
      <p className="font-mono text-gold text-[10px] tracking-[0.35em] mb-4">
        / WHY THE ENGINE PICKS {fav.en} {favPct}%
      </p>
      <p className="text-bone text-base sm:text-lg leading-relaxed mb-4">
        引擎只吃三個數字 — <span className="font-mono text-gold/90">K/9 · BB/9 · HR/9</span>
        (per <Link href="/audit" className="text-gold hover:underline underline-offset-4">/audit</Link>
        {" "}S02 INPUTS)。 這場 <strong className="text-bone">{fav.name}</strong> 的{" "}
        <strong className="text-bone">{fav.pitcher.name}</strong> vs{" "}
        <strong className="text-bone">{dog.name}</strong> 的{" "}
        <strong className="text-bone">{dog.pitcher.name}</strong> · 三個數字差:
      </p>
      <ul className="space-y-2 text-mute text-sm leading-relaxed mb-5 font-mono tabular">
        <li>
          <span className="text-gold/80">ERA</span> · {fav.pitcher.era} vs {dog.pitcher.era}
          {" · "}{gapStr(eraGap)}{" "}{tieredLabel(eraGap, 0.5, "(favorite 控分明顯)", "(favorite 略勝)", "(差不多 · 非關鍵)")}
        </li>
        <li>
          <span className="text-gold/80">K/9</span> · {fav.pitcher.k9} vs {dog.pitcher.k9}
          {" · "}{gapStr(k9Gap)}{" "}{tieredLabel(k9Gap, 1, "(每 9 局多吃 1 次以上三振)", "(favorite 略勝)", "(差不多)")}
        </li>
        <li>
          <span className="text-gold/80">BB/9</span> · {fav.pitcher.bb9} vs {dog.pitcher.bb9}
          {" · "}{gapStr(bb9Gap)}{" "}{tieredLabel(bb9Gap, 0.8, "(每 9 局少給 1 隻保送)", "(favorite 略勝控球)", "(差不多)")}
        </li>
        <li>
          <span className="text-gold/80">HR/9</span> · {fav.pitcher.hr9} vs {dog.pitcher.hr9}
          {" · "}{gapStr(hr9Gap)}{" "}{tieredLabel(hr9Gap, 0.3, "(favorite 被轟少)", "(略勝)", "(差不多)")}
        </li>
      </ul>
      <p className="text-mute text-sm leading-relaxed mb-3">
        <strong className="text-bone">引擎不吃</strong>:本季對戰史 · 球員傷停 ·
        守備站位 · 教練調度 · 場地適應。 per{" "}
        <Link href="/audit" className="text-gold hover:underline underline-offset-4">
          /audit
        </Link>
        {" "}S03 ENGINE SCOPE · 這幾項通常 ±15-25pp 影響真實 winRate · 同 {favPct}%
        在不同場景的「真實機率」可以漂移到 {Math.max(0, favPct - 20)}-{Math.min(100, favPct + 20)}% 區間。
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
        v0.3 roadmap 將陸續加入 ballpark factors · bullpen depth · 那時這段
        caveat 縮小。 完整 plans 見{" "}
        <Link href="/methodology" className="text-gold hover:underline underline-offset-4">
          /methodology
        </Link>
        {" "}+ commits 在{" "}
        <Link href="/changelog" className="text-gold hover:underline underline-offset-4">
          /changelog
        </Link>
        。
      </p>
    </blockquote>
  );
}

// ── Sub-components ─────────────────────────────────────

function PitcherCard({
  side,
  team,
  pitcher,
}: {
  side: "HOME" | "AWAY";
  team: string;
  pitcher: ReturnType<typeof getMatchById> extends infer T
    ? T extends { home: { pitcher: infer P } }
      ? P
      : never
    : never;
}) {
  // Pitcher type is loose for brevity — runtime shape is guaranteed by lib/matches.ts
  const p = pitcher as {
    name: string;
    era: string;
    k9: string;
    whip: string;
    bb9: string;
    hr9: string;
  };
  return (
    <div className="bg-slate/60 border border-line/70 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.3em]">
          {side}
        </span>
        <span className="text-mute text-xs">{team}</span>
      </div>
      <h3 className="text-2xl text-bone font-light tracking-tight mb-6">{p.name}</h3>

      {/* Round 31 Wave B · Baseball Savant percentile bars
          替換原 plain StatRow · brand IP grammar match for hardcore
          baseball fans · CPBL league reference range positioning
          per /audit S02 ESTIMATION DISCLOSURE pattern。 */}
      <div className="space-y-0.5">
        <StatPercentileBar stat="ERA" value={p.era} />
        <StatPercentileBar stat="K/9" value={p.k9} />
        <StatPercentileBar stat="WHIP" value={p.whip} />
        <StatPercentileBar stat="BB/9" value={p.bb9} />
        <StatPercentileBar stat="HR/9" value={p.hr9} />
      </div>
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mt-4 leading-relaxed">
        BASIC · TIER vs CPBL league ref range · 估計值 / 真實值 dot color 同等 ·{" "}
        <Link
          href="/audit"
          className="text-mute/60 hover:text-gold underline-offset-4 hover:underline transition-colors"
        >
          /audit
        </Link>{" "}
        S02 disclosure
      </p>

      {/* Round 31 Wave U · ADVANCED · Trackman radar 中職百分位
          整合 stats.cpbl.com.tw advanced data · 野球革命 + Trackman
          radar 整合 試營運上線資料 · Statcast-grade · 100=elite */}
      <PitcherAdvancedSection pitcherName={p.name} />
    </div>
  );
}

// ── Round 31 W-U · Trackman advanced metrics section ──
// 接 lib/cpbl-advanced.ts auto-fetched percentile data · 不在 leaderboard 的
// 投手(尚無 Trackman 累計 sample)render "尚無進階數據" honest gap state。
function PitcherAdvancedSection({ pitcherName }: { pitcherName: string }) {
  const adv = getCpblAdvancedByName(pitcherName);
  if (!adv) {
    return (
      <div className="mt-6 pt-4 border-t border-line/30">
        <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em]">
          ADVANCED · TRACKMAN 數據累計中 · 待 sample 達 threshold 後落地 ·{" "}
          <Link
            href="/audit"
            className="text-mute/60 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            see /audit S02
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="mt-6 pt-4 border-t border-gold/30">
      <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-3">
        / ADVANCED · TRACKMAN 中職百分位
      </p>
      <div className="space-y-0.5">
        <AdvancedStatBar label="wOBA-against" percentile={adv.wobaAgainst} />
        <AdvancedStatBar label="K%" percentile={adv.kPct} />
        <AdvancedStatBar label="揮空%" percentile={adv.whiffPct} />
        <AdvancedStatBar label="強擊球%" percentile={adv.hardHitPct} />
        <AdvancedStatBar label="擊球初速" percentile={adv.exitVeloAvg} />
      </div>
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mt-3 leading-relaxed">
        source{" "}
        <a
          href={`https://stats.cpbl.com.tw/players/${adv.acnt}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mute/60 hover:text-gold underline-offset-4 hover:underline transition-colors"
        >
          stats.cpbl.com.tw
        </a>
        {" "}+ Trackman radar · 100 = elite · {adv.team}
      </p>
    </div>
  );
}

function ScoreRow({
  rank,
  score,
  pct,
}: {
  rank: number;
  score: string;
  pct: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-mute text-[10px] tracking-[0.3em] w-8">
        / {String(rank).padStart(2, "0")}
      </span>
      <span className="font-mono text-bone tabular text-lg w-20">{score}</span>
      <div className="flex-1 relative h-[2px] bg-line/80">
        <div
          className="absolute top-0 left-0 h-full bg-gold glow-gold"
          style={{ width: `${(pct / 20) * 100}%` }}
        />
      </div>
      <span className="font-mono text-gold tabular text-sm w-16 text-right">
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

function FormRow({ team, recent }: { team: string; recent: ("W" | "L")[] }) {
  const wins = recent.filter((r) => r === "W").length;
  const losses = recent.length - wins;
  return (
    <div>
      <p className="text-mute text-xs mb-3">{team}</p>
      {/* R108 W3 · a11y · wrap W/L row in role=group + aria-label per Agent 1
          audit · 之前 SR 用戶聽到 "W L W W L" 無 context · 加 group label 給
          team + win/loss count 整體 announce。 */}
      <div
        role="group"
        aria-label={`${team} 近 ${recent.length} 場 ${wins} 勝 ${losses} 敗`}
        className="flex items-center gap-2 mb-4"
      >
        {recent.map((r, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`w-9 h-9 flex items-center justify-center font-mono text-sm border ${
              r === "W"
                ? "border-gold text-gold bg-gold/5"
                : "border-line text-mute"
            }`}
          >
            {r}
          </span>
        ))}
      </div>
      <p className="font-mono text-bone text-sm tabular">
        {wins} - {recent.length - wins}
        <span className="font-mono text-mute text-[10px] tracking-[0.25em] ml-3">
          LAST 5
        </span>
      </p>
    </div>
  );
}

function MethodStep({
  no,
  title,
  body,
}: {
  no: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-6">
      <span className="font-mono text-gold/70 text-sm tabular w-6 pt-1">{no}.</span>
      <div className="flex-1">
        <h4 className="text-bone text-lg font-light tracking-tight mb-2">{title}</h4>
        <p className="text-mute text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

// ── PhaseBadgeLg ─────────────────────────────────────
// Larger version of HeroLiveCard's badge — same 5 phases · sized for
// the detail page hero. Phase logic is identical · only sizing diverges.

function PhaseBadgeLg({
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
      proved: "✓ PROVED · 引擎言中",
      diverged: "✕ DIVERGED · 引擎落空",
      push: "= PUSH · 平局",
    } as const;
    return (
      <span
        lang="en"
        className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ml-2 ${styles[calibration]}`}
        title="賽後實際結果 · /track-record 公開戰績有完整收據"
      >
        {labels[calibration]}
      </span>
    );
  }

  if (phase === "today-pregame") {
    return (
      <span
        lang="en"
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold text-gold ml-2 shimmer"
        title="今晚開賽 · 預測已公開鎖定 · 賽後將進入 /track-record"
      >
        TODAY · 今晚開賽
      </span>
    );
  }

  if (phase === "today-live") {
    return (
      <span
        lang="en"
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold text-gold ml-2"
        title="賽事進行中 · 引擎預測已無法再改 · 結果出爐後自動入帳"
      >
        LIVE · 賽事進行中
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        lang="en"
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold ml-2"
        title="這場比賽尚未開打 — 為 pre-game preview"
      >
        DATA · PREVIEW
      </span>
    );
  }

  // stale-archived
  return (
    <span
      lang="en"
      className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-mute/60 text-mute ml-2"
      title="這場比賽日期早於今日 — 為 archived 資料(未補錄收據)"
    >
      ARCHIVED · 無收據
    </span>
  );
}

function CalibrationVerdictLg({
  calibration,
  enginePctOnWinner,
}: {
  calibration: Calibration;
  enginePctOnWinner: number | null;
}) {
  const styles = {
    proved: "text-gold border-gold",
    diverged: "text-loss border-loss/70",
    push: "text-mute border-mute/60",
  } as const;
  const headlines = {
    proved: "✓ ENGINE PROVED",
    diverged: "✕ ENGINE DIVERGED",
    push: "= PUSH",
  } as const;
  const subtexts = {
    proved: "引擎方向言中 · 賽前公開預測命中實際贏家",
    diverged: "引擎方向落空 · 賽前公開預測與實際贏家相反 · 寫進公開戰績不修飾",
    push: "平局或 50/50 預測 · 無方向可驗證",
  } as const;
  return (
    <div className="flex items-start gap-6 flex-wrap">
      <span
        lang="en"
        className={`font-mono text-sm tracking-[0.35em] px-3 py-2 border ${styles[calibration]}`}
      >
        {headlines[calibration]}
        {enginePctOnWinner !== null && calibration === "proved" && (
          <span className="ml-2 opacity-70 text-xs">
            ({enginePctOnWinner}%→W)
          </span>
        )}
        {enginePctOnWinner !== null && calibration === "diverged" && (
          <span className="ml-2 opacity-70 text-xs">
            (僅 {enginePctOnWinner}%→W)
          </span>
        )}
      </span>
      <p className="text-mute text-sm leading-relaxed flex-1 max-w-md mt-1">
        {subtexts[calibration]}
      </p>
    </div>
  );
}
