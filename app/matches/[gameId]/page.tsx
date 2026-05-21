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
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";

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

      {/* ── HERO: TEAMS + META ─────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="w-1.5 h-1.5 rounded-full bg-gold shimmer" />
          <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
            LIVE AI MODEL · {m.league} · {m.date}
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
          ▸ 刻意排除的輸入(打者個別品質 / Platoon / 投手疲勞 / 球場因素 / 代打換投決策)
          完整列於{" "}
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

      {/* ── DISCUSSION LOCK (pre-launch · honest state) ─── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20">
        <div className="bg-slate/40 border border-gold/30 p-10 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            PRE-LAUNCH · FOUNDERS + BLACK CARD ROOM
          </p>
          <h3 className="text-2xl text-bone font-light tracking-tight mb-3">
            即時討論室將在創始名冊啟動時上線
          </h3>
          <p className="text-mute text-sm mb-4 max-w-md mx-auto leading-relaxed">
            Founders 27(終身)+ BLACK CARD(月費)兩層訂閱者皆可進入,
            拆解每晚 AI 模型輸出。沒有 LINE 群組黑箱,沒有刪文截圖。
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-8 tabular">
            CURRENT · {FOUNDERS_CLAIMED} / {FOUNDERS_TOTAL} FORGED ·
            NEXT IS {formatBadge(FOUNDERS_NEXT)}
          </p>
          <Link
            href="/founders"
            className="inline-block px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            加入創始名冊 →
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

      </main>

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
