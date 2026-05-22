import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderPickForm from "@/components/FounderPickForm";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
  FOUNDERS_NEXT,
  FOUNDERS_PROGRESS,
  claimedFounders,
  isClaimed,
  formatBadge,
} from "@/lib/founders-stats";
import { getReservedNumbersServer } from "@/lib/founder-reservations-server";

export const metadata: Metadata = {
  title: "The 27 Wall — 創始會員之牆",
  description:
    "視覺化全台最稀缺的 270 個席位。#001 一旦被認領,就永遠屬於某個棒球迷。",
};

// ── ZONE 27 · /leaderboard — THE 27 WALL ──────────────
// All numerics (TOTAL, CLAIMED, NEXT, claimedFounders) live in
// lib/founders-stats.ts so they stay in sync with ScarcityStrip,
// /founders sales page, and OG cards.
//
// Six empty seats glint at staggered intervals via the
// .scintillate-* CSS classes in globals.css — purely
// decorative, never on claimed/NEXT seats. The wall reads
// as a *system at rest, not a static image*.
// ─────────────────────────────────────────────────────

// Hand-picked seats that glint — spread evenly across the 270.
// Each gets a different .scintillate-N timing offset so glints
// never overlap. Tweak freely — pure cosmetic.
const SCINTILLATE_SEATS = new Map<number, string>([
  [29, "scintillate-1"],
  [83, "scintillate-2"],
  [134, "scintillate-3"],
  [187, "scintillate-4"],
  [223, "scintillate-5"],
  [261, "scintillate-6"],
]);

export default async function LeaderboardPage() {
  const slots = Array.from({ length: FOUNDERS_TOTAL }, (_, i) => i + 1);
  // Round 30 Wave 12 · server-side fetch reserved numbers · graceful
  // degrade to [] if migration 0002 not yet applied(Tim 5-min Supabase
  // Studio task)。
  const reservedSlots = await getReservedNumbersServer();
  const reservedSet = new Set(reservedSlots.map((r) => r.number));
  const reservedNumbers = Array.from(reservedSet);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="leaderboard" />

      <main id="main">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          THE 27 WALL
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          全台最稀缺的
          <br />
          <span className="text-gold tabular">{FOUNDERS_TOTAL}</span> 個席位
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
            <Stat
              label="CLAIMED"
              value={`${FOUNDERS_CLAIMED} / ${FOUNDERS_TOTAL}`}
              accent={false}
            />
            <Stat
              label="REMAINING"
              value={String(FOUNDERS_REMAINING)}
              accent={false}
            />
            <Stat
              label="NEXT BADGE"
              value={formatBadge(FOUNDERS_NEXT)}
              accent
            />
          </div>
          <div
            role="progressbar"
            aria-label={`Founder seats progress: ${FOUNDERS_CLAIMED} of ${FOUNDERS_TOTAL} forged`}
            aria-valuenow={FOUNDERS_CLAIMED}
            aria-valuemin={0}
            aria-valuemax={FOUNDERS_TOTAL}
            className="relative mt-6 h-[2px] bg-line/80"
          >
            <div
              className="absolute top-0 left-0 h-full bg-gold glow-gold shimmer"
              style={{ width: `${FOUNDERS_PROGRESS * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── PUBLIC ROLL CALL · Round 31 W-V2 agent ONE sharp call ──
          Conversion research agent verdict:「Tim 您以為缺的是會員之間
          互動 · 數據說真正缺的是會員身份對外可見」。 FanGraphs · Stratechery
          · Bits-about-Money · Defector 4 個 case 全部「幾乎 0 user-to-user
          social · 高轉換」 · 全靠 creator authority + identity-as-supporter。
          ship Public Roll Call · 270 序號公開展示 · 7 forged 顯示 alias +
          rationale · 263 visible「待認領」 = Cialdini scarcity + Aronson
          costly signaling = 預期 Founders 27 認領 +40-60% boost 12 個月。
          Brand IP:0 PII broadcast · alias 自選 · brand IP「方法公開·品味
          私藏」 物理產出(身份對外可見 · 內心動機私藏)。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
        <div className="bg-slate/40 border border-gold/40 p-5 sm:p-7">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em]"
            >
              ★ PUBLIC ROLL CALL · 已 forged 公開
            </p>
            <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
              {FOUNDERS_CLAIMED}/{FOUNDERS_TOTAL} forged · {FOUNDERS_REMAINING} 待認領
            </p>
          </div>
          <p className="text-mute text-sm leading-relaxed mb-5">
            <strong className="text-bone">身份對外可見 · 動機私藏</strong> ·
            這是 brand IP「方法公開·品味私藏」 8 字 grammar 的物理產出。
            7 已 forged 為 Tim system test placeholders(honest 公開狀態 ·
            真實 Founders Q3 onboard 後 forge 取代)· 263 個編號等真實 founders。
          </p>
          <ul className="space-y-2 mb-5">
            {claimedFounders.map((f) => (
              <li
                key={f.id}
                className="flex items-baseline gap-3 sm:gap-4 flex-wrap py-1.5 border-b border-line/30"
              >
                <span className="font-mono text-gold text-base sm:text-lg tabular tracking-tight min-w-[3.5rem]">
                  {formatBadge(f.id)}
                </span>
                <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em] tabular">
                  {f.claimedOn}
                </span>
                <span className="font-mono text-bone/90 text-[11px] tracking-[0.2em]">
                  {f.alias ?? "—"}
                </span>
                <span className="text-mute text-xs sm:text-sm leading-snug flex-1 min-w-[15rem]">
                  {f.rationale ?? "—"}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ▸ 真實 founders Q3 認領後 · 在 onboard email 自選 alias(不強制
            實名)+ 1-2 句 rationale Tim 親手記錄 · transfer 自 SYSTEM-TEST。
            <br />
            ▸ 公開 audit trail · 7 個 SYSTEM-TEST 位置何時被 real founder
            取代會在{" "}
            <Link
              href="/founders/ledger"
              className="text-gold hover:underline underline-offset-4"
            >
              /founders/ledger
            </Link>
            {" "}本週 review log 顯示。
          </p>
        </div>
      </section>

      {/* ── THE WALL ─────────────────────────────── */}
      <section
        aria-label="THE 27 WALL — 270 founder seats"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12"
      >
        <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-10 gap-1.5 sm:gap-2">
          {slots.map((n) => (
            <Slot
              key={n}
              n={n}
              claimed={isClaimed(n)}
              reserved={reservedSet.has(n)}
              isNext={n === FOUNDERS_NEXT}
              scintillateClass={SCINTILLATE_SEATS.get(n)}
            />
          ))}
        </div>
      </section>

      {/* ── Round 30 Wave 12 · Founder Pick Form ──────
          Patek allocation pattern · logged-in member 可選 008-270 ·
          公開 RESERVED 落 wall above。 Anon / no-reservation / has-
          reservation 三 state · graceful degrade if migration 未 apply。 */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4 text-center"
        >
          / RESERVE YOUR NUMBER · Patek allocation
        </p>
        <FounderPickForm reservedNumbers={reservedNumbers} />
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
                  {formatBadge(f.id)}
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
          <span className="text-gold mx-2 tabular">
            {formatBadge(FOUNDERS_NEXT)}
          </span>
          嗎?
        </h3>
        <p className="mt-6 text-mute text-sm max-w-md mx-auto">
          當 #270 被認領,這扇門將永遠關閉。
        </p>
        <Link
          href="/founders"
          className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          CLAIM {formatBadge(FOUNDERS_NEXT)} →
        </Link>
      </section>
      </main>

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
  reserved,
  isNext,
  scintillateClass,
}: {
  n: number;
  claimed: boolean;
  reserved: boolean;
  isNext: boolean;
  scintillateClass?: string;
}) {
  const label = String(n).padStart(3, "0");

  if (claimed) {
    return (
      <div
        title={`Founder #${label} · forged`}
        aria-label={`Founder seat ${label} · forged`}
        className="aspect-square flex flex-col items-center justify-center border border-gold/70 bg-gold/10 text-gold font-mono"
      >
        <span className="text-[11px] sm:text-sm tabular leading-none">
          {label}
        </span>
        <span className="text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5 opacity-70">
          FORGED
        </span>
      </div>
    );
  }

  if (reserved) {
    // Round 30 Wave 12 · Patek allocation pattern · 「RESERVED · pending
    // wire」 = visitor 已 reserved · 等銀行轉帳 confirm · Costly Signaling
    // 公開 commitment 在轉帳之前。
    return (
      <div
        title={`Founder #${label} · reserved · pending wire`}
        aria-label={`Founder seat ${label} · reserved · pending wire transfer`}
        className="aspect-square flex flex-col items-center justify-center border border-gold/50 bg-gold/5 text-gold/80 font-mono shimmer"
      >
        <span className="text-[11px] sm:text-sm tabular leading-none">
          {label}
        </span>
        <span className="text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5 opacity-80">
          RESERVED
        </span>
      </div>
    );
  }

  if (isNext) {
    return (
      <Link
        href="/founders"
        title={`Claim Founder #${label}`}
        aria-label={`Claim Founder seat ${label} — next available`}
        className="aspect-square flex flex-col items-center justify-center border-2 border-gold bg-gold/5 text-gold font-mono shimmer glow-gold hover:bg-gold hover:text-navy transition-colors"
      >
        <span className="text-[11px] sm:text-sm tabular leading-none">
          {label}
        </span>
        <span className="text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5">
          NEXT
        </span>
      </Link>
    );
  }

  return (
    <div
      title={`Founder #${label} · available`}
      aria-label={`Founder seat ${label} · available`}
      className={`aspect-square flex flex-col items-center justify-center border border-line/60 text-mute font-mono hover:border-gold/60 hover:text-gold transition-colors${
        scintillateClass ? ` scintillate ${scintillateClass}` : ""
      }`}
    >
      <span className="text-[11px] sm:text-sm tabular leading-none">
        {label}
      </span>
      <span className="text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5 opacity-50">
        OPEN
      </span>
    </div>
  );
}
