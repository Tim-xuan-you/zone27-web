import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── ZONE 27 · /matches/[gameId] loading skeleton ──────
// Match detail page loading state. Mirrors the eventual
// structure so layout doesn't shift on resolve.
// ─────────────────────────────────────────────────────

export default function MatchLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-16 pb-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-3 w-16 bg-line/50 rounded-sm animate-pulse" />
          <div className="h-3 w-2 bg-line/30 rounded-sm" />
          <div className="h-3 w-24 bg-line/40 rounded-sm animate-pulse" />
        </div>

        {/* Title + matchup skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 bg-gold/20 rounded-sm animate-pulse" />
          <div className="h-10 sm:h-14 w-3/4 bg-line/50 rounded-sm animate-pulse" />
          <div className="h-4 w-1/2 bg-line/30 rounded-sm animate-pulse" />
        </div>

        {/* Pitcher panels skeleton */}
        <div className="grid sm:grid-cols-2 gap-6 mt-12">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-slate/40 border border-line/40 p-6 rounded-sm space-y-3 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="h-3 w-20 bg-gold/20 rounded-sm" />
              <div className="h-6 w-32 bg-line/50 rounded-sm" />
              <div className="h-3 w-24 bg-line/30 rounded-sm" />
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="h-8 bg-line/30 rounded-sm" />
                <div className="h-8 bg-line/30 rounded-sm" />
                <div className="h-8 bg-line/30 rounded-sm" />
              </div>
            </div>
          ))}
        </div>

        {/* Simulator panel skeleton */}
        <div className="bg-slate/40 border border-line/40 rounded-sm p-8 mt-10 animate-pulse">
          <div className="h-2 bg-line/30 rounded-sm mt-2 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-line/30 rounded-sm" />
            <div className="h-20 bg-line/30 rounded-sm" />
          </div>
        </div>

        <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-8 text-center shimmer">
          ▸ FETCHING MATCH DATA · ENGINE PRELOADING
        </p>
      </section>

      <Footer />
    </div>
  );
}
