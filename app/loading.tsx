import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── ZONE 27 · Root Loading Skeleton ─────────────────────
// Next.js App Router automatically wraps page boundaries in
// Suspense and renders this file as the fallback. Triggered:
//   1. Cross-route nav while data fetches (matches/mlb · etc.)
//   2. Slow network on initial paint of any page
//   3. Streaming SSR before main content hydrates
//
// Design principles (per brand IP):
//   - Same Nav + Footer chrome (continuity)
//   - Subtle gold pulse on a single dot (alive · not chaotic)
//   - Mono "ENGINE WARMING UP" copy (sabermetric-literate)
//   - No spinner / no rotating GIF (those say 「等」 not 「準備中」)
//   - Reduced-motion safe (animate-pulse respects user preference)
//
// Reference: Linear / Vercel both use thin skeletons over spinners
// in 2026 · spinners signal generic-SaaS, skeletons signal craft.
// ─────────────────────────────────────────────────────

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-gold glow-gold animate-pulse"
            />
            <span
              lang="en"
              role="status"
              aria-live="polite"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              ENGINE WARMING UP
            </span>
          </div>

          {/* Hairline pulse · placeholder for hero typography */}
          <div className="w-48 h-8 bg-line/30 mx-auto mb-3 animate-pulse" />
          <div className="w-32 h-3 bg-line/20 mx-auto animate-pulse" />

          <p
            className="font-mono text-mute text-[10px] tracking-[0.3em] mt-10"
          >
            載入中 · 通常 &lt; 0.5 秒
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
