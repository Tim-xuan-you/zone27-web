import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { matches, isMatchDataStale, type Match } from "@/lib/matches";

export const metadata: Metadata = {
  title: "今日 CPBL 賽事板",
  description:
    "今日中華職棒比賽列表 · AI 勝率模型每天 15:00 鎖定 · 點進任一場看完整 10,000 次模擬與重播。",
};

// ── ISR · Re-render daily so the today/archived state stays honest.
export const revalidate = 86400; // 24 hours

export default function MatchesPage() {
  const todaysMatches = matches;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

      <main id="main">

      {/* ── HEADER ──────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-10">
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
            今日賽事板 · {todaysMatches[0]?.league ?? "CPBL"}
          </p>
          <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30 text-gold/70">
            示範資料
          </span>
          {isMatchDataStale(todaysMatches[0]) && (
            <span
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-mute/60 text-mute"
              title="本頁資料寫入時間早於今日 — 為 archived 範例"
            >
              DATA · ARCHIVED
            </span>
          )}
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            2026 · 05 · 19{" "}
            <span className="text-mute text-2xl sm:text-3xl">· 星期二</span>
          </h1>
          <p className="font-mono text-mute text-xs tracking-[0.25em]">
            {todaysMatches.length} 場比賽 · AI 模型 15:00 鎖定
          </p>
        </div>
        <p className="mt-3 font-mono text-mute text-[10px] tracking-[0.25em]">
          目前 stealth mode 階段,資料為示範用途;正式上線後將為當日真實 CPBL 賽程
        </p>
        <div className="mt-6 w-full h-px bg-line/60" />
      </section>

      {/* ── MATCH GRID ──────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
        {todaysMatches.length === 0 ? (
          <div className="bg-slate/40 border border-line/60 p-12 text-center">
            <p className="font-mono text-mute text-xs tracking-[0.25em] mb-4">
              今日 CPBL · 無排定賽事
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
              可能是季外或休賽日。改看美國職棒今日全部賽程?
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {todaysMatches.map((m) => (
              <MiniMatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </section>

      {/* ── MLB CTA(即時資料) ───────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
        <Link
          href="/matches/mlb"
          className="block bg-slate/40 border border-win/30 hover:border-win/70 transition-colors p-6 sm:p-8 group"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-baseline gap-2 mb-2 font-mono text-[10px] tracking-[0.35em]">
                <span className="text-win">MLB · 即時資料</span>
                <span className="px-1.5 py-0.5 border border-win/40 text-win">
                  LIVE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight">
                想看美國職棒今日全部賽程?
              </h3>
              <p className="text-mute text-sm mt-2 max-w-xl">
                資料直接來自 MLB 官方 Stats API,每 10 分鐘更新。
                ~15 場比賽含戰績、開賽時間(台北時區)、即時比分。
              </p>
            </div>
            <span className="font-mono text-win text-xs tracking-[0.3em] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
              今日 MLB 賽程 →
            </span>
          </div>
        </Link>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── MiniMatchCard ──────────────────────────────────────
function MiniMatchCard({ match }: { match: Match }) {
  const homeFavored = match.home.winRate > match.away.winRate;
  return (
    <Link
      href={`/matches/${match.id}`}
      className="block bg-slate/60 border border-line/70 hover:border-gold/40 transition-colors p-6 group"
    >
      {/* meta */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-gold text-[10px] tracking-[0.3em]">
          {match.league}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
          {match.venue.replace("棒球場", "").replace("洲際", "洲際")} · {match.startTime}
        </span>
      </div>

      {/* teams row */}
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <p className="text-bone text-lg font-light">{match.home.name}</p>
          <p className="font-mono text-gold/50 text-[10px] tracking-[0.25em] mt-0.5">
            {match.home.en}
          </p>
        </div>
        <div className="text-right">
          <p className="text-bone text-lg font-light">{match.away.name}</p>
          <p className="font-mono text-gold/50 text-[10px] tracking-[0.25em] mt-0.5">
            {match.away.en}
          </p>
        </div>
      </div>

      {/* win rates */}
      <div className="flex items-baseline justify-between mt-4 mb-2">
        <span
          className={`font-mono text-2xl tabular ${
            homeFavored ? "text-gold" : "text-mute"
          }`}
        >
          {match.home.winRate}
          <span className="text-xs opacity-60 ml-0.5">%</span>
        </span>
        <span
          className={`font-mono text-2xl tabular ${
            !homeFavored ? "text-gold" : "text-mute"
          }`}
        >
          {match.away.winRate}
          <span className="text-xs opacity-60 ml-0.5">%</span>
        </span>
      </div>

      {/* glow bar */}
      <div className="relative h-[2px] bg-line/80">
        <div
          className="absolute top-0 left-0 h-full bg-gold glow-gold"
          style={{ width: `${match.home.winRate}%` }}
        />
        <div
          className="absolute -top-1 h-[10px] w-px bg-gold/80"
          style={{ left: `${match.home.winRate}%` }}
        />
      </div>

      {/* pitcher line */}
      <div className="mt-5 pt-4 border-t border-line/50 flex justify-between text-xs">
        <div>
          <p className="text-bone">{match.home.pitcher.name}</p>
          <p className="font-mono text-gold/60 tabular mt-0.5">
            ERA · {match.home.pitcher.era}
          </p>
        </div>
        <div className="text-right">
          <p className="text-bone">{match.away.pitcher.name}</p>
          <p className="font-mono text-gold/60 tabular mt-0.5">
            ERA · {match.away.pitcher.era}
          </p>
        </div>
      </div>

      {/* footer cta */}
      <div className="mt-5 flex items-center justify-between text-[10px] font-mono tracking-[0.25em]">
        <span className="text-mute">10,000 場模擬</span>
        <span className="text-gold/70 group-hover:text-gold transition-colors">
          完整分析 →
        </span>
      </div>
    </Link>
  );
}
