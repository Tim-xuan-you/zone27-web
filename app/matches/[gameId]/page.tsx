import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import { getMatchById, getAllMatchIds, type Match } from "@/lib/matches";

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

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

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

      {/* ── HERO: TEAMS + META ─────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold shimmer" />
          <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
            LIVE AI MODEL · {m.league} · {m.date}
          </span>
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
        </div>
      </section>

      {/* ── PITCHER MATCHUP ────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / 01 · STARTING PITCHER MATCHUP
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <PitcherCard side="HOME" team={m.home.name} pitcher={m.home.pitcher} />
          <PitcherCard side="AWAY" team={m.away.name} pitcher={m.away.pitcher} />
        </div>
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
        <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-6">
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
            title="Trackman 雷達追蹤先驗"
            body="從 stats.cpbl.com.tw 拉取投手球路轉速、進壘角度,以及打者本壘板紀律(PR)作為機率矩陣的初始參數。"
          />
          <MethodStep
            no="B"
            title="投打對決機率矩陣"
            body="每個打席計算「三振 / 保送 / 一壘安打 / 長打 / 全壘打 / 出局」的條件機率,左右投對左右打獨立拆解。"
          />
          <MethodStep
            no="C"
            title="蒙地卡羅萬次推演"
            body="後端引擎以 < 1 ms 跑完一場完整虛擬比賽(含換投、代打、跑壘推進),連續執行 10,000 次。"
          />
          <MethodStep
            no="D"
            title="結果分布加總"
            body="統計 10,000 場虛擬比賽中各隊獲勝次數與最終比分,輸出本頁所有機率與信心指標。"
          />
        </div>
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

      {/* ── DISCUSSION LOCK ────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20">
        <div className="bg-slate/40 border border-gold/30 p-10 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            BLACK CARD · LIVE DEBATE
          </p>
          <h3 className="text-2xl text-bone font-light tracking-tight mb-3">
            7 位創始會員正在熱議這場比賽
          </h3>
          <p className="text-mute text-sm mb-8 max-w-md mx-auto">
            黑金會員專屬即時討論室。看 #001 ~ #007 的創始 ID
            如何拆解今晚 AI 模型的關鍵變數。
          </p>
          <Link
            href="/founders"
            className="inline-block px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            NT$ 2,700 解鎖終身會員 →
          </Link>
        </div>
      </section>

      {/* ── BACK ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
        <Link
          href="/matches"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
        >
          ← 回到今日賽事板
        </Link>
      </section>

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
    <div className="bg-slate/60 border border-line/70 p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.3em]">
          {side}
        </span>
        <span className="text-mute text-xs">{team}</span>
      </div>
      <h3 className="text-2xl text-bone font-light tracking-tight mb-6">{p.name}</h3>

      <dl className="space-y-3 font-mono text-sm">
        <StatRow label="ERA" value={p.era} />
        <StatRow label="K / 9" value={p.k9} />
        <StatRow label="WHIP" value={p.whip} />
        <StatRow label="BB / 9" value={p.bb9} />
        <StatRow label="HR / 9" value={p.hr9} />
      </dl>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line/40 pb-2">
      <dt className="text-mute tracking-[0.25em] text-[10px]">{label}</dt>
      <dd className="text-bone tabular">{value}</dd>
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
