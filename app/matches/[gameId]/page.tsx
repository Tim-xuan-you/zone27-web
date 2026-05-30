import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import StatPercentileBar from "@/components/StatPercentileBar";
import ConfidenceStars from "@/components/ConfidenceStars";
import GameThread from "@/components/GameThread";
import CreatorAnalysis from "@/components/CreatorAnalysis";
import UserPredictionPicker from "@/components/UserPredictionPicker";
import ReceiptForwardButton from "@/components/ReceiptForwardButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import TonightMatchRail from "@/components/TonightMatchRail";
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

// ── ZONE 27 · /matches/[gameId] · 市場頁(R175 Polymarket pivot)──
// Tim 2026-05-30「資訊多到爆炸 · 划不到底 · 該刪就刪 · 變成 Polymarket」·
// per memory/project_zone27_polymarket_pivot.md + [[feedback-zone27-homepage-minimalism]]。
//
// 從 1286 行 · 20 段 · 7 lens widget 砍成一張乾淨的市場頁:
//   隊伍 → 引擎開盤線 + 進場(群眾線)→ 賽後結果 → 討論 → 投手(精簡)→ 比分 → 自己跑。
// 砍掉:7 LENS CANVAS · ENGINE TRACE · narrative essay · team panel · follow/
//   note/founders CTA · how-we-compute · recent form · coin-flip strip · related
//   reading。 元件全保留(其他頁可能用)· 一個 git revert 可回。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // 24h ISR

export function generateStaticParams() {
  return getAllMatchIds().map((gameId) => ({ gameId }));
}

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
        {/* ── breadcrumb ─────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-8">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link href="/matches" className="hover:text-gold transition-colors">
              市場
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">{m.league}</span>
          </div>
        </section>

        {/* ── HERO · teams ───────────────────────────── */}
        <section
          style={{ viewTransitionName: `match-${m.id}` } as React.CSSProperties}
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-6 pb-4"
        >
          <div className="flex items-center gap-2 mb-6 flex-wrap font-mono text-gold text-[10px] tracking-[0.3em]">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-gold ${
                phase === "today-pregame" || phase === "today-live" ? "shimmer" : ""
              }`}
              aria-hidden="true"
            />
            <span>
              {m.date} · {m.startTime}
            </span>
            <PhaseBadgeLg phase={phase} calibration={calibration} />
          </div>
          <h1 className="sr-only">
            {m.home.name} vs {m.away.name} · {m.date} · {m.venue}
          </h1>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            <div>
              <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">主 HOME</p>
              <h2 className="text-2xl sm:text-4xl text-bone font-light tracking-tight leading-[1]">
                {m.home.name}
              </h2>
              <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mt-1.5">
                {m.home.en}
              </p>
            </div>
            <p className="font-mono text-gold/70 text-lg tracking-[0.2em]">VS</p>
            <div className="text-right">
              <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">客 AWAY</p>
              <h2 className="text-2xl sm:text-4xl text-bone font-light tracking-tight leading-[1]">
                {m.away.name}
              </h2>
              <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mt-1.5">
                {m.away.en}
              </p>
            </div>
          </div>
          <p className="mt-5 font-mono text-mute text-[10px] tracking-[0.3em] text-center">
            {m.venue}
          </p>
        </section>

        {/* ── THE MARKET · 引擎開盤線 + 進場 ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8">
          <div className="bg-slate/60 border border-line/70 p-6 sm:p-8">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono text-gold/80 text-[9px] tracking-[0.35em]">
                引擎機率 · 10K MONTE CARLO
              </span>
              <ConfidenceStars confidence={m.aiConfidence} variant="inline" />
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span
                className={`font-mono tabular tracking-tight ${
                  homeFavored ? "text-gold" : "text-mute"
                } text-5xl sm:text-6xl font-light`}
              >
                {m.home.winRate}
                <span className="text-xl opacity-60 ml-0.5">%</span>
              </span>
              <span
                className={`font-mono tabular tracking-tight ${
                  !homeFavored ? "text-gold" : "text-mute"
                } text-5xl sm:text-6xl font-light`}
              >
                {m.away.winRate}
                <span className="text-xl opacity-60 ml-0.5">%</span>
              </span>
            </div>
            <div
              className="relative h-2 flex overflow-hidden rounded-full bg-line/60"
              role="img"
              aria-label={`引擎開盤線 · ${m.home.en} ${m.home.winRate}% / ${m.away.en} ${m.away.winRate}%`}
            >
              <div
                className={`h-full ${homeFavored ? "bg-gold glow-gold" : "bg-mute/45"}`}
                style={{ width: `${m.home.winRate}%` }}
              />
              <div
                className={`h-full ${!homeFavored ? "bg-gold glow-gold" : "bg-mute/45"}`}
                style={{ width: `${m.away.winRate}%` }}
              />
            </div>
            <p className="mt-2 text-center font-mono text-mute/55 text-[8px] tracking-[0.3em]">
              引擎開盤線 · ENGINE LINE
            </p>
          </div>

          {/* 進場預測 · 群眾線 + 你的一手 */}
          <UserPredictionPicker
            matchId={m.id}
            homeName={m.home.name}
            awayName={m.away.name}
            engineHomePicked={m.home.winRate >= m.away.winRate}
            finalWinner={m.finalResult?.winner ?? null}
          />
          <div className="mt-3 flex justify-end">
            <CopyLinkButton refTag={`match-${m.id}`} />
          </div>
        </section>

        {/* ── RECEIPT · 賽後結果(only when final)─────── */}
        {m.finalResult && calibration && (
          <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8">
            <div
              className={`bg-slate/60 border p-6 sm:p-8 ${
                calibration === "proved"
                  ? "border-gold/60"
                  : calibration === "diverged"
                  ? "border-loss/50"
                  : "border-line/70"
              }`}
            >
              <p className="font-mono text-gold text-[9px] tracking-[0.35em] mb-4">
                賽後結果 · ENGINE RECEIPT
              </p>
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">引擎賽前</p>
                  <p className="font-mono text-bone text-3xl tabular font-light">
                    {Math.max(m.home.winRate, m.away.winRate)}%
                  </p>
                  <p className="font-mono text-gold/70 text-[10px] mt-1">
                    {m.home.winRate >= m.away.winRate ? m.home.name : m.away.name} W
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">實際比分</p>
                  <p className="font-mono text-bone text-3xl tabular font-light">
                    {m.finalResult.homeScore}:{m.finalResult.awayScore}
                  </p>
                  <p className="font-mono text-gold/70 text-[10px] mt-1">
                    {m.finalResult.winner === "home"
                      ? m.home.name + " W"
                      : m.finalResult.winner === "away"
                      ? m.away.name + " W"
                      : "TIE"}
                  </p>
                </div>
              </div>
              <div className="border-t border-line/50 pt-5">
                <CalibrationVerdictLg
                  calibration={calibration}
                  enginePctOnWinner={enginePctOnWinner}
                />
                <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                  <Link
                    href="/track-record"
                    className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
                  >
                    完整戰績 →
                  </Link>
                  <ReceiptForwardButton match={m} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CREATOR ANALYSIS · 創作者分析(發文 + 選邊 + 賽後自動評準度)── */}
        <CreatorAnalysis
          matchId={m.id}
          homeName={m.home.name}
          awayName={m.away.name}
          finalWinner={m.finalResult?.winner ?? null}
        />

        {/* ── DISCUSSION · 賽事討論室(免費看 · 登入發言)── */}
        <GameThread gameId={m.id} />

        {/* ── PITCHER MATCHUP · 精簡 ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8">
          <p className="font-mono text-gold text-[9px] tracking-[0.4em] mb-5">/ 先發投手</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <PitcherCard side="HOME" team={m.home.name} pitcher={m.home.pitcher} />
            <PitcherCard side="AWAY" team={m.away.name} pitcher={m.away.pitcher} />
          </div>
        </section>

        {/* ── SCORE DISTRIBUTION · top 5 ─────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8">
          <p className="font-mono text-gold text-[9px] tracking-[0.4em] mb-5">
            / 最可能比分 · TOP 5
          </p>
          <div className="space-y-2.5">
            {m.topScores.map((s, i) => (
              <ScoreRow key={s.score} rank={i + 1} score={s.score} pct={s.probability} />
            ))}
          </div>
        </section>

        {/* ── RUN IT YOURSELF · 自己跑引擎 ───────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-8">
          <p className="font-mono text-gold text-[9px] tracking-[0.4em] mb-3">
            / 自己跑一次引擎
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6 max-w-xl">
            別只看數字 · 在你瀏覽器裡跑一輪 10,000 次蒙地卡羅 · 看勝率怎麼收斂。
          </p>
          <MatchSimulator key={m.id} match={m} />
        </section>

        {/* ── back ───────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/matches"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回市場看板
          </Link>
        </section>
      </main>

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

// ── Sub-components ─────────────────────────────────────

function PitcherCard({
  side,
  team,
  pitcher,
}: {
  side: "HOME" | "AWAY";
  team: string;
  pitcher: Match["home"]["pitcher"];
}) {
  const p = pitcher;
  return (
    <div className="bg-slate/60 border border-line/70 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-gold/70 text-[9px] tracking-[0.3em]">{side}</span>
        <span className="text-mute text-xs">{team}</span>
      </div>
      <h3 className="text-xl text-bone font-light tracking-tight mb-4">{p.name}</h3>
      <div className="space-y-0.5">
        <StatPercentileBar stat="ERA" value={p.era} />
        <StatPercentileBar stat="K/9" value={p.k9} />
        <StatPercentileBar stat="BB/9" value={p.bb9} />
        <StatPercentileBar stat="HR/9" value={p.hr9} />
      </div>
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
      <span className="font-mono text-bone tabular text-base w-16">{score}</span>
      <div className="flex-1 relative h-[2px] bg-line/80">
        <div
          className="absolute top-0 left-0 h-full bg-gold glow-gold"
          style={{ width: `${(pct / 20) * 100}%` }}
        />
      </div>
      <span className="font-mono text-gold tabular text-sm w-14 text-right">
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

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
        className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ml-1 ${styles[calibration]}`}
      >
        {labels[calibration]}
      </span>
    );
  }

  if (phase === "today-pregame") {
    return (
      <span
        lang="en"
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold text-gold ml-1 shimmer"
      >
        TODAY · 今晚開賽
      </span>
    );
  }

  if (phase === "today-live") {
    return (
      <span
        lang="en"
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold text-gold ml-1"
      >
        LIVE · 進行中
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        lang="en"
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold ml-1"
      >
        PREVIEW · 預覽
      </span>
    );
  }

  return (
    <span
      lang="en"
      className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-mute/60 text-mute ml-1"
    >
      ARCHIVED
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
    diverged: "引擎方向落空 · 賽前預測與實際贏家相反 · 不修飾照掛",
    push: "平局或 50/50 預測 · 無方向可驗證",
  } as const;
  return (
    <div className="flex items-start gap-4 flex-wrap">
      <span
        lang="en"
        className={`font-mono text-sm tracking-[0.3em] px-3 py-2 border ${styles[calibration]}`}
      >
        {headlines[calibration]}
        {enginePctOnWinner !== null && calibration === "proved" && (
          <span className="ml-2 opacity-70 text-xs">({enginePctOnWinner}%→W)</span>
        )}
        {enginePctOnWinner !== null && calibration === "diverged" && (
          <span className="ml-2 opacity-70 text-xs">(僅 {enginePctOnWinner}%→W)</span>
        )}
      </span>
      <p className="text-mute text-sm leading-relaxed flex-1 max-w-md mt-1">
        {subtexts[calibration]}
      </p>
    </div>
  );
}
