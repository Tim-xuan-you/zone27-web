import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  FOUNDERS_SEATS,
  getSeatByNumber,
  formatSeatNumber,
  type FounderSeat,
} from "@/lib/founders-seats";

// ── ZONE 27 · /founders/seat-card/[seatNumber] ─────────
// R78 W-A · Agent A R77 SHIP A ★★★★★ · Patek 1996「Generations」 campaign
// altercasting(Weinstein & Deutschberger 1963)+ Belk 1988 Extended Self
// + Defector 2020 worker-owners-named launch + Linear named-invitee 2019
// pre-launch pattern · 270 dedicated permalinks · each seat IS the
// identity vehicle · empty seats publicly visible per Pratfall axiom。
//
// The altercasting mechanism in this page:
//   - Empty seat: 「This seat is held by ____. They believed the engine
//     before it had a stadium.」 = visitor casts SELF into the ____ role
//   - SYSTEM-TEST seat #001-#007: 「Tim 親手 forged · 等真實 Founder #001
//     onboard 後 reset · per /founders/ledger SHADOWLESS RUN axiom」 ·
//     honest disclosure of forged placeholder per Pratfall
//   - Claimed seat(future): 「[Name] · [City] · joined [date]. They
//     believed before...」 · NOT marketing testimonial · simple receipt
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · 263 empty seats publicly URL-
//     addressable IS the disclosure axis strongest application
//   - per [[feedback-zone27-pratfall-brand-ip]] · empty seats are NOT a
//     deficit · ARE the costly signal · 同 /track-record DIVERGED 等大
//   - per [[zone27-payment-architecture]] · SHADOWLESS RUN axiom · 270
//     closed state binding · each seat permanent identity vehicle
//   - per /audit S05 PRE-COMMIT clause · holder names append-only · 不可
//     retroactively edit
//
// 不做 anti-pattern(per Agent A R77 SHIP A spec):
//   ✕ NO「X seats left」 live counter on individual seat-card page(per
//     11-NEVER #5 live FOMO counter redline)
//   ✕ NO countdown to seat-close(brand IP「不催」)
//   ✕ NO「reserve this seat」 button(seat-card 是 identity surface · not
//     purchase form · /founders/apply is separate)
//   ✕ NO fake testimonial / fake holder name(per 11-NEVER #11)
//   ✕ NO social-share button to brag about empty seats(per UnscheduledLetterChip
//     R75 W-B「您 OWN arrival」 axis)
//
// Static SSG · generateStaticParams returns 270 seat numbers · build emits
// 270 pages all on-server pre-rendered · per Patek Reference Number
// permanence model + R75 W-F /receipts/[receiptId] pattern。
//
// Inspiration sources:
//   - Patek Philippe 1996「Generations」 campaign(altercasting canonical)
//   - Belk 1988「Possessions and the Extended Self」 paper
//   - Defector 2020 launch with 19 worker-owners NAMED on page
//   - Linear 2019 invite-only with named-invitee signal
//   - Bottega Veneta 1978「your own initials are enough」 Warhol tagline
// ─────────────────────────────────────────────────────

type Params = Promise<{ seatNumber: string }>;

export async function generateStaticParams(): Promise<
  { seatNumber: string }[]
> {
  // Pre-render all 270 seat permalinks · static SSG · 0 dynamic rendering
  // per /receipts/[receiptId] R75 W-F pattern · same generateStaticParams
  // pre-render axis · seats are permanent identity vehicles。
  return FOUNDERS_SEATS.map((s) => ({
    seatNumber: formatSeatNumber(s.seatNumber),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { seatNumber } = await params;
  const n = parseInt(seatNumber, 10);
  const seat = getSeatByNumber(n);
  if (!seat) {
    return {
      title: "Seat not found · ZONE 27 Founders 27",
      description: "此 seat number 不存在 · Founders 27 limited 270 · per /founders/ledger SHADOWLESS RUN axiom。",
    };
  }
  const formattedNum = formatSeatNumber(seat.seatNumber);
  const stateLabel = seat.isSystemTest
    ? "SYSTEM-TEST · 等真實 Founder #001 onboard 後 reset"
    : seat.holderName
      ? `Held by ${seat.holderName}`
      : "AWAITING · empty seat · 等真實 Founder";
  return {
    title: `Seat #${formattedNum} · Founders 27 · ${stateLabel} · ZONE 27`,
    description: `Founders 27 seat #${formattedNum} · Patek 1996「Generations」 altercasting + Defector worker-owners-named pattern · 270 limited · SHADOWLESS RUN axiom · ${stateLabel}`,
    openGraph: {
      title: `Seat #${formattedNum} · Founders 27 · ZONE 27`,
      description: stateLabel,
      images: ["/founders/opengraph-image"],
    },
  };
}

export default async function SeatCardPage({ params }: { params: Params }) {
  const { seatNumber } = await params;
  const n = parseInt(seatNumber, 10);
  const seat = getSeatByNumber(n);
  if (!seat) {
    notFound();
  }

  const formattedNum = formatSeatNumber(seat.seatNumber);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/founders"
              className="hover:text-gold transition-colors"
            >
              FOUNDERS 27
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/founders/ledger"
              className="hover:text-gold transition-colors"
            >
              LEDGER
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold tabular">SEAT #{formattedNum}</span>
          </div>
        </section>

        {/* ── HERO · seat card ─────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-12">
          <SeatCard seat={seat} formattedNum={formattedNum} />
        </section>

        {/* ── CONTEXT · why this page exists ────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / WHY THIS PAGE EXISTS · PATEK 1996 ALTERCASTING
          </p>
          <p className="text-mute text-sm sm:text-base leading-relaxed mb-4">
            Patek Philippe 1996「Generations」 campaign canonical line:{" "}
            <em className="text-bone not-italic">
              &ldquo;You never actually own a Patek Philippe · you merely
              look after it for the next generation&rdquo;
            </em>
            。 Mechanism = altercasting(Weinstein & Deutschberger 1963):
            DOESN&rsquo;T tell visitor「BE generational」 · PRE-CASTS visitor
            INTO the role and lets them opt in by recognition。
          </p>
          <p className="text-mute text-sm sm:text-base leading-relaxed mb-4">
            ZONE 27 採同 axis · 270 seats with permanent URLs ·{" "}
            <strong className="text-bone">每 seat 是 identity vehicle</strong>
            (per Belk 1988 Extended Self · possessions don&rsquo;t display
            identity · they CONSTITUTE it)· 263 empty seats publicly URL-
            addressable per Pratfall axiom · 不藏 unsold inventory · 同 /track-
            record DIVERGED 等大 disclosure parity。
          </p>
          <p className="text-mute/85 text-sm sm:text-base leading-relaxed mb-4">
            「This seat is held by ____」 = visitor casts SELF into the ____
            role · NOT marketing exclusivity · IS identity assumption。
            Defector 2020 launch採同 axis(19 worker-owners NAMED on
            page · names ARE the announcement)· Linear 2019 invite-only
            pre-launch採同 axis(named-invitee signal)。
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mt-6">
            ⚓ per /audit S05 PRE-COMMIT clause · holder names append-only ·
            不可 retroactively edit · same Costly Signaling discipline as
            ENGINE_DIFF_BEACONS R71 W-C + canonical 7-ledger family pattern。
            修改 SEAT roll 需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              /changelog
            </Link>{" "}
            公告。
          </p>
        </section>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/founders/ledger"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /founders/ledger · 完整 270 grid
            </Link>
            {seat.seatNumber > 1 && (
              <Link
                href={`/founders/seat-card/${formatSeatNumber(seat.seatNumber - 1)}`}
                className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
              >
                ← seat #{formatSeatNumber(seat.seatNumber - 1)}
              </Link>
            )}
            {seat.seatNumber < 270 && (
              <Link
                href={`/founders/seat-card/${formatSeatNumber(seat.seatNumber + 1)}`}
                className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
              >
                seat #{formatSeatNumber(seat.seatNumber + 1)} →
              </Link>
            )}
            <Link
              href="/founders/why-270"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /founders/why-270 · decision log →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── SeatCard component · Patek Reference Number aesthetic ───
function SeatCard({
  seat,
  formattedNum,
}: {
  seat: FounderSeat;
  formattedNum: string;
}) {
  const isClaimed = seat.holderName !== null && !seat.isSystemTest;
  const isSystemTest = seat.isSystemTest;
  const isEmpty = seat.holderName === null && !seat.isSystemTest;

  const stateBorder = isClaimed
    ? "border-gold"
    : isSystemTest
      ? "border-dashed border-mute/60"
      : "border-dashed border-line/60";

  const stateLabel = isClaimed
    ? "✦ HELD · REAL FOUNDER · APPEND-ONLY"
    : isSystemTest
      ? "◌ SYSTEM-TEST · TIM 親手 forged · pre-launch"
      : "— AWAITING · 等真實 Founder · empty seat";

  const stateLabelColor = isClaimed
    ? "text-gold"
    : isSystemTest
      ? "text-mute"
      : "text-mute/60";

  return (
    <article
      aria-label={`Founders 27 Seat #${formattedNum} · ${stateLabel}`}
      className={`border-2 ${stateBorder} bg-slate/30`}
    >
      {/* ── TOP-LINE · Patek Reference grammar ───── */}
      <div className="border-b border-line/40 px-6 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
        <p
          lang="en"
          className="font-mono text-gold tracking-[0.35em] text-[10px] sm:text-[11px]"
        >
          ZONE 27 · FOUNDERS 27 · SHADOWLESS RUN
        </p>
        <p
          lang="en"
          className="font-mono text-gold/80 tracking-[0.3em] text-[9px] sm:text-[10px] tabular"
        >
          REFERENCE · Z27 · FNDR · {formattedNum} / 270
        </p>
      </div>

      {/* ── SEAT NUMBER · huge typography ───────── */}
      <div className="px-6 sm:px-10 pt-12 pb-8 text-center">
        <p
          lang="en"
          className="font-mono text-mute/70 text-[10px] tracking-[0.45em] mb-4"
        >
          SEAT NUMBER
        </p>
        <p className="font-mono text-bone tabular text-7xl sm:text-8xl md:text-9xl font-light tracking-tight leading-none">
          #{formattedNum}
        </p>
        <p
          lang="en"
          className={`font-mono ${stateLabelColor} text-xs sm:text-sm tracking-[0.3em] mt-6 font-medium`}
        >
          {stateLabel}
        </p>
      </div>

      {/* ── ALTERCASTING LINE · the canonical Patek-style pre-cast ── */}
      <div className="border-t border-line/40 px-6 sm:px-10 py-8 sm:py-10 bg-navy/40">
        {isEmpty && (
          <p
            className="text-bone text-base sm:text-lg leading-relaxed text-center font-light"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這個 seat 由{" "}
            <span className="text-mute/70 italic">________</span>{" "}
            守。 他/她 believed the engine before it had a stadium ·
            before the first PROVED receipt landed · before {270 - 7}{" "}
            empty seats had any name on them。
          </p>
        )}
        {isSystemTest && (
          <p
            className="text-bone text-base sm:text-lg leading-relaxed text-center font-light"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這個 seat 是 Tim 親手{" "}
            <span className="text-mute italic">SYSTEM-TEST</span>{" "}
            forged · 不是 fake claim · 等真實 Founder #001 onboard 後 ·
            Tim 親手 reset · per{" "}
            <Link
              href="/founders/ledger#shadowless-run"
              className="text-gold hover:text-gold-soft underline-offset-4 hover:underline"
            >
              SHADOWLESS RUN axiom
            </Link>{" "}
            + Pratfall「不藏 SYSTEM-TEST state」 grammar。
          </p>
        )}
        {isClaimed && (
          <p
            className="text-bone text-base sm:text-lg leading-relaxed text-center font-light"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這個 seat 由{" "}
            <strong className="text-gold">{seat.holderName}</strong>
            {seat.holderCity && <> · {seat.holderCity}</>}
            {" "}守 · since{" "}
            <span className="font-mono tabular">{seat.claimedAt}</span> ·
            They believed the engine before...(per /founders/from-one-
            current-founder R69 W-B real letter pattern)。
          </p>
        )}
      </div>

      {/* ── METADATA · honest state ──────────────── */}
      <div className="border-t border-line/40 px-6 sm:px-8 py-4 grid grid-cols-2 gap-4 text-[11px]">
        <div>
          <p className="font-mono text-mute/70 tracking-[0.25em] mb-1">
            CLAIMED AT
          </p>
          <p className="font-mono text-bone/85 tabular">
            {seat.claimedAt ?? "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute/70 tracking-[0.25em] mb-1">
            STATE
          </p>
          <p className="font-mono text-bone/85 tabular">
            {isClaimed ? "REAL" : isSystemTest ? "SYSTEM-TEST" : "EMPTY"}
          </p>
        </div>
      </div>

      {/* ── PATEK-FOOTER · binding pre-commit ────── */}
      <div className="border-t border-gold/40 px-6 sm:px-8 py-3 bg-gold/5 flex items-center justify-between flex-wrap gap-2 font-mono text-gold/80 text-[9px] tracking-[0.28em] tabular">
        <span lang="en">PATEK 1996 ALTERCASTING</span>
        <span lang="en">APPEND-ONLY · /AUDIT S05 PRE-COMMIT</span>
      </div>
    </article>
  );
}
