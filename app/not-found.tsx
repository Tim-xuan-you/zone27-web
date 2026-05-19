import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "404 — 這個頁面不在板上",
  description: "您要找的頁面沒有出現在今日的賽程板上。",
};

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      {/* ── 404 HERO ─────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-32 pb-12 text-center flex-1 flex flex-col items-center justify-center">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.45em] mb-8">
          ERROR · ROUTE NOT FOUND
        </p>

        {/* The massive 4 0 4 */}
        <div
          className="font-mono tabular text-gold font-light leading-none tracking-[0.05em]"
          style={{
            fontSize: "clamp(120px, 20vw, 220px)",
            textShadow: "0 0 80px rgba(212,175,55,0.35)",
          }}
        >
          4 0 4
        </div>

        <h1 className="mt-10 text-2xl sm:text-3xl text-bone font-light tracking-tight">
          這個頁面不在板上。
        </h1>

        <p className="mt-4 font-mono text-mute text-sm tracking-[0.3em]">
          LIKE A WILD PITCH — OVERTHROWN THE ZONE.
        </p>

        <p className="mt-8 max-w-md mx-auto text-mute leading-relaxed">
          您可能打錯了網址,或這個頁面已經被引退。回今日賽程板繼續看球。
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/matches"
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
          >
            ← 回到今日賽事板
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-gold/40 text-gold text-xs tracking-[0.3em] hover:bg-gold/10 transition-colors"
          >
            回首頁
          </Link>
        </div>

        {/* Tiny meta */}
        <p className="mt-16 font-mono text-mute/50 text-[10px] tracking-[0.3em]">
          STRIKE THREE. YOU&apos;RE OUT.
        </p>
      </section>

      <Footer />
    </div>
  );
}
