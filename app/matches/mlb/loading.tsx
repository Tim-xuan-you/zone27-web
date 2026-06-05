import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── ZONE 27 · /matches/mlb loading skeleton ───────────
// Shown while MLB Stats API fetches resolve (revalidate = 600s
// in lib/mlb.ts). Brand-matched skeleton so layout doesn't flash
// blank on cold load.
// ─────────────────────────────────────────────────────

export default function MlbMatchesLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-10">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
              今日賽事板 · MLB
            </p>
            {/* R201:載入徽章從綠框改金色 = 守「不紅綠對比」鐵律(冷載入時也不閃綠)。 */}
            <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/70 shimmer">
              載入中
            </span>
          </div>
          <div className="h-12 sm:h-16 w-3/4 bg-slate/40 border border-line/40 rounded-sm animate-pulse mt-3" />
          <p className="mt-3 font-mono text-mute text-[10px] tracking-[0.25em]">
            ▸ 正在從 MLB Stats API 抓取今日賽程 · 約 1-2 秒
          </p>
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <article
                key={i}
                className="bg-slate/30 border border-line/40 p-5 flex flex-col animate-pulse"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-3 w-16 bg-line/50 rounded-sm" />
                  <div className="h-3 w-20 bg-line/30 rounded-sm" />
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-4 w-1/2 bg-line/40 rounded-sm" />
                    <div className="h-3 w-10 bg-line/30 rounded-sm" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-4 w-1/2 bg-line/40 rounded-sm" />
                    <div className="h-3 w-10 bg-line/30 rounded-sm" />
                  </div>
                </div>
                <div className="pt-4 border-t border-line/40 flex items-baseline justify-between">
                  <div className="h-2.5 w-24 bg-line/30 rounded-sm" />
                  <div className="h-2.5 w-12 bg-line/30 rounded-sm" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
