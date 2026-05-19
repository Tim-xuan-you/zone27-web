import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The 27 Wall — 創始會員之牆",
  description:
    "視覺化全台最稀缺的 270 個席位。#001 一旦被認領,就永遠屬於某個棒球迷。",
};

const TOTAL = 270;
const CLAIMED = 7;
const NEXT = CLAIMED + 1;

// 已認領的創始會員 — 為保護隱私,只公布編號與認領日,不公布身分
const claimedFounders = [
  { id: 1, claimedOn: "2026-05-12" },
  { id: 2, claimedOn: "2026-05-13" },
  { id: 3, claimedOn: "2026-05-13" },
  { id: 4, claimedOn: "2026-05-14" },
  { id: 5, claimedOn: "2026-05-16" },
  { id: 6, claimedOn: "2026-05-17" },
  { id: 7, claimedOn: "2026-05-18" },
];

function isClaimed(n: number) {
  return claimedFounders.some((f) => f.id === n);
}

export default function LeaderboardPage() {
  const slots = Array.from({ length: TOTAL }, (_, i) => i + 1);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="leaderboard" />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          THE 27 WALL
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          全台最稀缺的
          <br />
          <span className="text-gold">270 個席位</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute text-base leading-relaxed">
          每一個編號一旦被認領,就永遠屬於某個棒球迷,終身不可轉讓。
          這面牆只填滿一次。
        </p>
      </section>

      {/* ── STATS BAR ────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
        <div className="bg-slate/60 border border-line/70 p-6 sm:p-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <Stat label="CLAIMED" value={`${CLAIMED} / ${TOTAL}`} accent={false} />
            <Stat label="REMAINING" value={String(TOTAL - CLAIMED)} accent={false} />
            <Stat label="NEXT BADGE" value={`#${String(NEXT).padStart(3, "0")}`} accent />
          </div>
          <div className="relative mt-6 h-[2px] bg-line/80">
            <div
              className="absolute top-0 left-0 h-full bg-gold glow-gold shimmer"
              style={{ width: `${(CLAIMED / TOTAL) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── THE WALL ─────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
        <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-10 gap-1.5 sm:gap-2">
          {slots.map((n) => (
            <Slot key={n} n={n} claimed={isClaimed(n)} isNext={n === NEXT} />
          ))}
        </div>
      </section>

      {/* ── RECENT ACTIVITY ──────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
        <h2 className="font-mono text-gold text-[10px] tracking-[0.4em] mb-8">
          / RECENT ACTIVITY
        </h2>
        <div className="space-y-3">
          {[...claimedFounders].reverse().map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between border-b border-line/40 pb-3"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-gold tabular text-lg">
                  #{String(f.id).padStart(3, "0")}
                </span>
                <span className="text-mute text-sm">FORGED</span>
              </div>
              <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
                {f.claimedOn}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          THE NEXT NUMBER IS WAITING.
        </p>
        <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          您要成為
          <span className="text-gold mx-2 tabular">#{String(NEXT).padStart(3, "0")}</span>
          嗎?
        </h3>
        <p className="mt-6 text-mute text-sm max-w-md mx-auto">
          當 #270 被認領,這扇門將永遠關閉。
        </p>
        <Link
          href="/founders"
          className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          CLAIM #{String(NEXT).padStart(3, "0")} →
        </Link>
      </section>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-2">
        {label}
      </p>
      <p
        className={`font-mono tabular tracking-tight text-xl sm:text-2xl ${
          accent ? "text-gold" : "text-bone"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Slot({
  n,
  claimed,
  isNext,
}: {
  n: number;
  claimed: boolean;
  isNext: boolean;
}) {
  const label = String(n).padStart(3, "0");

  if (claimed) {
    return (
      <div
        title={`Founder #${label} · forged`}
        className="aspect-square flex flex-col items-center justify-center border border-gold/70 bg-gold/10 text-gold font-mono"
      >
        <span className="text-[11px] sm:text-sm tabular leading-none">{label}</span>
        <span className="text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5 opacity-70">
          FORGED
        </span>
      </div>
    );
  }

  if (isNext) {
    return (
      <Link
        href="/founders"
        title={`Claim Founder #${label}`}
        className="aspect-square flex flex-col items-center justify-center border-2 border-gold bg-gold/5 text-gold font-mono shimmer glow-gold hover:bg-gold hover:text-navy transition-colors"
      >
        <span className="text-[11px] sm:text-sm tabular leading-none">{label}</span>
        <span className="text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5">NEXT</span>
      </Link>
    );
  }

  return (
    <div
      title={`Founder #${label} · available`}
      className="aspect-square flex flex-col items-center justify-center border border-line/60 text-mute/50 font-mono hover:border-gold/40 hover:text-gold/70 transition-colors"
    >
      <span className="text-[11px] sm:text-sm tabular leading-none">{label}</span>
      <span className="text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5 opacity-50">
        OPEN
      </span>
    </div>
  );
}
