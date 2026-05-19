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
        <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.25em]">
          資料來源:MLB Stats API(官方公開、完全免費) ·
          ZONE 27 不修改任何原始資料
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

      <Footer />
    </div>
  );
}

// ── MlbCard ───────────────────────────────────────────
function MlbCard({ game }: { game: MlbGame }) {
  const stateLabel = STATE_LABEL[game.state];
  const stateClass = STATE_COLOR[game.state];

  return (
    <article className="bg-slate/60 border border-line/70 hover:border-gold/40 transition-colors p-5">
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
        <TeamRow label="AWAY" team={game.away} />
        <TeamRow label="HOME" team={game.home} />
      </div>

      {/* venue + status detail */}
      <div className="pt-4 border-t border-line/40 flex items-baseline justify-between">
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em] truncate">
          {game.venue}
        </span>
        <span className="font-mono text-mute/60 text-[9px] tracking-[0.2em] shrink-0 ml-2">
          {game.dateTaipei}
        </span>
      </div>
    </article>
  );
}

function TeamRow({
  label,
  team,
}: {
  label: "HOME" | "AWAY";
  team: MlbGame["home"];
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="font-mono text-gold/60 text-[9px] tracking-[0.25em] shrink-0 w-10">
          {label}
        </span>
        <span className="text-bone text-base truncate">{team.zhName}</span>
        <span className="font-mono text-mute/50 text-[10px] tracking-[0.2em] shrink-0">
          {team.abbr}
        </span>
      </div>
      <span className="font-mono text-mute/70 text-xs tabular shrink-0">
        {team.wins}-{team.losses}
      </span>
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
