import Link from "next/link";
import { matches, type Match } from "@/lib/matches";

export default function MatchesPage() {
  const todaysMatches = matches;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* ── NAV ─────────────────────────────── */}
      <nav className="w-full border-b border-line/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-mono text-gold text-xl tracking-[0.22em] font-medium group-hover:opacity-80">
              ZONE
            </span>
            <span className="font-mono text-bone text-xl tracking-[0.22em] font-medium group-hover:opacity-80">
              27
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/matches"
              className="font-mono text-gold text-xs tracking-[0.22em]"
            >
              MATCHES
            </Link>
            <Link
              href="/founders"
              className="font-mono text-mute hover:text-gold text-xs tracking-[0.22em] transition-colors"
            >
              FOUNDERS · 27
            </Link>
            <button className="px-4 py-2 border border-gold/30 text-gold text-xs tracking-[0.18em] hover:bg-gold/10 transition-colors">
              LOGIN
            </button>
          </div>
        </div>
      </nav>

      {/* ── HEADER ──────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-10">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">
          DAILY BOARD · {todaysMatches[0].league}
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            2026 · 05 · 19{" "}
            <span className="text-mute text-2xl sm:text-3xl">· 週二</span>
          </h1>
          <p className="font-mono text-mute text-xs tracking-[0.25em]">
            {todaysMatches.length} GAMES · AI MODELS LOCKED 15:00
          </p>
        </div>
        <div className="mt-6 w-full h-px bg-line/60" />
      </section>

      {/* ── MATCH GRID ──────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {todaysMatches.map((m) => (
            <MiniMatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="mt-auto border-t border-line/40">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-gold text-sm tracking-[0.22em]">ZONE</span>
            <span className="font-mono text-bone text-sm tracking-[0.22em]">27</span>
            <span className="text-mute text-xs ml-2">© 2026</span>
          </div>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            BUILT FOR THOSE WHO READ THE NUMBERS.
          </p>
        </div>
      </footer>
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
        <span className="text-mute">10,000 SIMS</span>
        <span className="text-gold/70 group-hover:text-gold transition-colors">
          BREAKDOWN →
        </span>
      </div>
    </Link>
  );
}
