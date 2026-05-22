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
  type Match,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";
import StatPercentileBar from "@/components/StatPercentileBar";
import AdvancedStatBar from "@/components/AdvancedStatBar";
import EngineStamp from "@/components/EngineStamp";
import { getCpblAdvancedByName } from "@/lib/cpbl-advanced";
import RelatedReading from "@/components/RelatedReading";
import FollowMatchButton from "@/components/FollowMatchButton";
import MatchNoteEditor from "@/components/MatchNoteEditor";
import MyTeamMatchNote from "@/components/MyTeamMatchNote";
import UserPredictionPicker from "@/components/UserPredictionPicker";

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
  if (!match) return { title: "Match not found · ZONE 27" };
  return {
    title: `${match.home.name} vs ${match.away.name} · ${match.league} · ZONE 27`,
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

      {/* ── BREADCRUMB ─────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
          <Link href="/" className="hover:text-gold transition-colors">
            HOME
          </Link>
          <span className="text-mute/40">/</span>
          <Link href="/matches" className="hover:text-gold transition-colors">
            MATCHES
          </Link>
          <span className="text-mute/40">/</span>
          <span className="text-gold">{m.league}</span>
        </div>
      </section>

      {/* ── HERO: TEAMS + META ───────────────────────
          Round 11: header label was static "LIVE AI MODEL" · misleading
          for past matches in receipt mode or stale-archived state.
          Now phase-aware: shows ENGINE RECEIPT / LIVE AI MODEL /
          ARCHIVED based on actual phase. Heartbeat dot only animates
          when phase is "live" or "today-pregame" (signals true live). */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10 pb-6">
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
          {/* HOME */}
          <div>
            <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
              HOME
            </p>
            <h1 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1]">
              {m.home.name}
            </h1>
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
            <h1 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1]">
              {m.away.name}
            </h1>
            <p className="font-mono text-gold/60 text-xs tracking-[0.3em] mt-2">
              {m.away.en}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-mute">
          <span>{m.venue}</span>
          <span>FIRST PITCH · {m.startTime}</span>
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

          {/* Confidence */}
          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                MODEL CONFIDENCE
              </p>
              <p className="font-mono text-bone text-2xl tabular">
                {m.aiConfidence}
                <span className="text-sm text-mute ml-1">/ 100</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                EDGE
              </p>
              <p className="font-mono text-gold text-2xl tabular">
                +{Math.abs(m.home.winRate - m.away.winRate)} PP
              </p>
            </div>
          </div>
          {/* Round 31 Wave B · datestamped engine stamp · 預測 lock-in 物理證據
              + BUILD chip 直連 GitHub commit · audit trail 1-click 可達 */}
          <div className="mt-6 pt-5 border-t border-line/40">
            <EngineStamp />
          </div>
        </div>
      </section>

      {/* ── CALIBRATION RECEIPT (only when finalResult ingested) ──
          Largest single-purpose disclosure block on the page when
          present. Renders engine prediction vs actual outcome at
          equal visual weight. Maps to /audit S08 + /manifesto S II
          + /discipline Section 01 (Buffett "track record visible").
          Section "/ 00" intentionally precedes the canonical /01-/05
          flow — it's the receipt headline when one exists. */}
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
            </div>
          </div>
        </section>
      )}

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

      {/* ── SCORE DISTRIBUTION ─────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / 02 · TOP 5 PROJECTED FINAL SCORES
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
          / 03 · LAST 5 GAMES
        </h2>
        <div className="grid sm:grid-cols-2 gap-12">
          <FormRow team={m.home.name} recent={m.home.recent} />
          <FormRow team={m.away.name} recent={m.away.recent} />
        </div>
      </section>

      {/* ── AI METHODOLOGY ─────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / 04 · HOW WE COMPUTE
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

      {/* ── /05 · RUN IT YOURSELF (embedded live sim) ─ */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-16">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          / 05 · RUN IT YOURSELF
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
          {" · "}{gapStr(eraGap)}{" "}{eraGap > 0.5 ? "(favorite 控分明顯)" : eraGap > 0 ? "(favorite 略勝)" : "(差不多 · 非關鍵)"}
        </li>
        <li>
          <span className="text-gold/80">K/9</span> · {fav.pitcher.k9} vs {dog.pitcher.k9}
          {" · "}{gapStr(k9Gap)}{" "}{k9Gap > 1 ? "(每 9 局多吃 1 次以上三振)" : k9Gap > 0 ? "(favorite 略勝)" : "(差不多)"}
        </li>
        <li>
          <span className="text-gold/80">BB/9</span> · {fav.pitcher.bb9} vs {dog.pitcher.bb9}
          {" · "}{gapStr(bb9Gap)}{" "}{bb9Gap > 0.8 ? "(每 9 局少給 1 隻保送)" : bb9Gap > 0 ? "(favorite 略勝控球)" : "(差不多)"}
        </li>
        <li>
          <span className="text-gold/80">HR/9</span> · {fav.pitcher.hr9} vs {dog.pitcher.hr9}
          {" · "}{gapStr(hr9Gap)}{" "}{hr9Gap > 0.3 ? "(favorite 被轟少)" : hr9Gap > 0 ? "(略勝)" : "(差不多)"}
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
  return (
    <div>
      <p className="text-mute text-xs mb-3">{team}</p>
      <div className="flex items-center gap-2 mb-4">
        {recent.map((r, i) => (
          <span
            key={i}
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
