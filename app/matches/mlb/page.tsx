import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { fetchTodayMlb, type MlbGame } from "@/lib/mlb";

export const metadata: Metadata = {
  title: "今日 MLB 賽程 — 即時資料來自 MLB 官方 API",
  description:
    "MLB 美國職棒今日全部賽程,即時資料來自 MLB Stats API,每 10 分鐘更新。台北時區顯示。",
};

// Force this page to use ISR cache from lib/mlb's revalidate setting
export const revalidate = 600;

export default async function MlbMatchesPage() {
  const games = await fetchTodayMlb();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HEADER ──────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-10">
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
            今日賽事板 · MLB
          </p>
          <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-win/40 text-win">
            即時資料
          </span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            美國職棒大聯盟
            <span className="text-mute text-2xl sm:text-3xl ml-3">
              · {games.length} 場
            </span>
          </h1>
          <p className="font-mono text-mute text-xs tracking-[0.25em]">
            時間以台北時區顯示 · 每 10 分鐘更新
          </p>
        </div>
        <p className="mt-3 font-mono text-mute text-[10px] tracking-[0.25em]">
          資料來源:MLB Stats API(官方公開、完全免費) ·
          ZONE 27 不修改任何原始資料
        </p>
        {/* R48 W-B · Honest disclosure · MLB grading discipline 跟 CPBL 不同
            · LIVE re-compute · NOT pre-game lock-in · NOT 算 /track-record · 為什麼
            見 /coverage data pipeline transparency。 brand IP「方法公開」延伸。 */}
        <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.22em] leading-relaxed max-w-2xl">
          ⚓ MLB engine pick = LIVE re-compute from K9/BB9/HR9/ERA(每 10
          min revalidate) · 賽後 verdict 對照在 card 上顯示 · 但 NOT 算進
          /track-record(brand IP 區分:CPBL = pre-game lock-in 受 PROVED
          / DIVERGED 計分 · MLB = live grading · 見{" "}
          <Link
            href="/coverage"
            className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
          >
            /coverage data pipeline
          </Link>
          )
        </p>
        <div className="mt-6 w-full h-px bg-line/60" />
      </section>

      {/* ── EMPTY STATE ─────────────────────── */}
      {games.length === 0 ? (
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20">
          <div className="bg-slate/40 border border-line/60 p-12 text-center">
            <p className="font-mono text-mute text-xs tracking-[0.25em] mb-4">
              MLB API · 今日無排定賽事
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
              可能是季外、明星週、或目前美國時間還沒進入比賽日。
              <br />
              台灣晚上看 MLB 通常會在隔天清晨抓到比賽,可以稍後再來看看。
            </p>
            <Link
              href="/matches"
              className="inline-block mt-8 font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
            >
              ← 回到 CPBL 賽事板
            </Link>
          </div>
        </section>
      ) : (
        /* ── GAMES GRID ──────────────────────── */
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games.map((g) => (
              <MlbCard key={g.gamePk} game={g} />
            ))}
          </div>
        </section>
      )}

      {/* ── BACK LINK ───────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-20 text-center border-t border-line/40 pt-12">
        <Link
          href="/matches"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
        >
          ← 回到 CPBL 賽事板
        </Link>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── MlbCard ───────────────────────────────────────────
function MlbCard({ game }: { game: MlbGame }) {
  const stateLabel = STATE_LABEL[game.state];
  const stateClass = STATE_COLOR[game.state];

  // R48 W-B · Determine engine pick winner + favorite team for display
  const enginePickHome =
    game.engineWinHomePct !== null && game.engineWinHomePct > 50;
  const favoriteTeam = enginePickHome ? game.home : game.away;
  const favoriteWinPct = game.engineWinHomePct
    ? enginePickHome
      ? game.engineWinHomePct
      : 100 - game.engineWinHomePct
    : null;

  return (
    <article className="bg-slate/60 border border-line/70 hover:border-gold/40 transition-colors p-5 flex flex-col">
      {/* meta */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${stateClass}`}
        >
          {stateLabel}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
          台北 {game.startTaipei}
        </span>
      </div>

      {/* teams */}
      <div className="space-y-3 mb-5">
        <TeamRow
          label="AWAY"
          team={game.away}
          finalScore={game.finalScore?.away}
        />
        <TeamRow
          label="HOME"
          team={game.home}
          finalScore={game.finalScore?.home}
        />
      </div>

      {/* R48 W-B · ENGINE PICK row · live re-compute · NOT lock-in */}
      {game.engineWinHomePct !== null && favoriteWinPct !== null && (
        <div className="pt-3 mt-1 border-t border-line/40">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span
              lang="en"
              className="font-mono text-gold/70 text-[9px] tracking-[0.3em]"
            >
              ENGINE NOW
            </span>
            <span className="font-mono text-mute/60 text-[9px] tracking-[0.22em]">
              live re-compute · 非 lock-in
            </span>
          </div>
          <p className="text-sm text-bone leading-snug">
            押{" "}
            <strong className="text-gold">
              {favoriteTeam.zhName} {favoriteWinPct}%
            </strong>
          </p>
        </div>
      )}

      {/* R48 W-B · VERDICT row · only when status=Final + engine pick + score */}
      {game.verdict !== null && game.finalScore !== null && (
        <div
          className={`mt-3 px-3 py-2 border ${
            game.verdict === "proved"
              ? "border-gold/60 bg-gold/10"
              : game.verdict === "diverged"
              ? "border-loss/50 bg-loss/10"
              : "border-line/60 bg-slate/40"
          }`}
        >
          <p
            lang="en"
            className={`font-mono text-[9px] tracking-[0.3em] mb-1 ${
              game.verdict === "proved"
                ? "text-gold"
                : game.verdict === "diverged"
                ? "text-loss/85"
                : "text-mute"
            }`}
          >
            {game.verdict === "proved"
              ? "✓ ENGINE PROVED"
              : game.verdict === "diverged"
              ? "✕ ENGINE DIVERGED"
              : "▪ TIE"}
          </p>
          <p className="text-mute/85 text-[11px] leading-relaxed">
            賽後 {game.finalScore.away} : {game.finalScore.home} ·{" "}
            {game.verdict === "tie"
              ? "tie · 不分勝負"
              : (game.verdict === "proved"
                  ? "engine pick 對中"
                  : "engine pick 沒對中")}{" "}
            · NOT 算 /track-record(live re-compute · 不 lock-in · 同
            <Link
              href="/coverage"
              className="text-gold/80 hover:text-gold underline-offset-2 hover:underline ml-1"
            >
              /coverage data pipeline
            </Link>
            )
          </p>
        </div>
      )}

      {/* venue + date */}
      <div className="pt-3 mt-3 border-t border-line/40 flex items-baseline justify-between">
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em] truncate">
          {game.venue}
        </span>
        <span className="font-mono text-mute text-[9px] tracking-[0.2em] shrink-0 ml-2">
          {game.dateTaipei}
        </span>
      </div>

      {/* SIMULATE CTA — only if both probable pitchers + stats available */}
      {game.simulateUrl && (
        <Link
          href={game.simulateUrl}
          className="mt-4 block font-mono text-[10px] tracking-[0.3em] text-center text-gold border border-gold/40 px-3 py-2.5 hover:bg-gold hover:text-navy transition-colors"
        >
          ▶ 用引擎模擬這場(10K MC) →
        </Link>
      )}
    </article>
  );
}

function TeamRow({
  label,
  team,
  finalScore,
}: {
  label: "HOME" | "AWAY";
  team: MlbGame["home"];
  /** R48 W-B · Optional final-game runs · displayed inline when state=Final */
  finalScore?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-gold/60 text-[9px] tracking-[0.25em] shrink-0 w-10">
            {label}
          </span>
          <span className="text-bone text-base truncate">{team.zhName}</span>
          <span className="font-mono text-mute text-[10px] tracking-[0.2em] shrink-0">
            {team.abbr}
          </span>
        </div>
        <div className="flex items-baseline gap-2 shrink-0">
          {finalScore !== undefined && (
            <span className="font-mono text-gold text-base tabular font-light">
              {finalScore}
            </span>
          )}
          <span className="font-mono text-mute/70 text-xs tabular">
            {team.wins}-{team.losses}
          </span>
        </div>
      </div>
      {/* Probable pitcher row */}
      {team.probablePitcher && (
        <p className="font-mono text-mute text-[10px] tracking-[0.2em] mt-1 pl-[3.25rem] flex items-baseline gap-2">
          <span className="text-bone/80 normal-case">
            {team.probablePitcher.fullName}
          </span>
          {team.probablePitcher.era !== "—" && (
            <span className="text-gold/60 tabular">
              ERA {team.probablePitcher.era}
            </span>
          )}
        </p>
      )}
    </div>
  );
}

// ── State badge styling ──────────────────────────────
const STATE_LABEL: Record<MlbGame["state"], string> = {
  preview: "即將開打",
  live: "進行中",
  final: "已結束",
  other: "—",
};

const STATE_COLOR: Record<MlbGame["state"], string> = {
  preview: "border-mute/60 text-mute/80",
  live: "border-win text-win",
  final: "border-line text-mute",
  other: "border-line text-mute",
};
