import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── ZONE 27 · /lab loading skeleton ───────────────────
// Shown while the lab page resolves. Brand-matched skeleton
// so the layout doesn't flash blank during cold start.
// ─────────────────────────────────────────────────────

export default function LabLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="lab" />

      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-12">
        <div className="text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8 shimmer">
            ▸ INITIALIZING ENGINE
          </p>
          <div className="h-12 sm:h-16 w-3/4 mx-auto bg-slate/40 border border-line/40 rounded-sm animate-pulse mb-4" />
          <div className="h-12 sm:h-16 w-2/3 mx-auto bg-slate/30 border border-line/40 rounded-sm animate-pulse" />
        </div>
      </section>

      {/* Match selector skeleton */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 bg-slate/30 border border-line/40 rounded-sm animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </section>

      {/* Simulator panel skeleton */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
        <div className="bg-slate/30 border border-line/40 rounded-sm p-8 sm:p-10 space-y-4">
          <div className="h-4 w-24 bg-line/50 rounded-sm animate-pulse" />
          <div className="h-10 w-1/2 bg-line/40 rounded-sm animate-pulse" />
          <div className="h-2 bg-line/30 rounded-sm animate-pulse mt-8" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="h-20 bg-line/30 rounded-sm animate-pulse" />
            <div className="h-20 bg-line/30 rounded-sm animate-pulse" />
          </div>
        </div>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-8 text-center">
          ENGINE WARMING UP · 10,000 SIM BUDGET LOADING
        </p>
      </section>

      <Footer />
    </div>
  );
}
