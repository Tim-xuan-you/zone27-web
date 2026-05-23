import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import FounderSignOff from "@/components/FounderSignOff";
import {
  getMatchById,
  getFinalizedMatches,
  getCalibration,
  getEnginePctOnWinner,
  getMatchDateIso,
} from "@/lib/matches";

// ── ZONE 27 · /receipts/[receiptId] · Single Receipt Object Page ──
// R75 W-F · Agent A R75 SHIP 1 ★★★★★ BIGGEST GAP CLOSURE · Stripe Press
// 3D book detail pages + Patek Philippe Reference Number permanence +
// Defector citation permalink + Anthropic Transparency Hub model card
// archive pattern。 ZONE 27 had 0 visitor-grabbable receipt objects · ALL
// pages were narrative surfaces(/track-record · /audit · /methodology ·
// /founders/ledger · /calibration)none was a single-object page。 此 NEW
// dynamic route group converts every PROVED/DIVERGED finalized match into
// its own dedicated URL · object-as-receipt · share-as-thing。
//
// The cognitive frame this closes:
//   - Visitor wants to share/screenshot/audit a SPECIFIC receipt
//   - Existing /track-record shows ALL receipts inline · not a single OBJECT
//   - /matches/[gameId] is the LIVE/PRE/POST match page · not a receipt page
//   - /audit is the model report · not a receipt page
//   - Stripe Press treats each book as its own URL · Patek Reference Number
//     each watch · Defector each annual report · ZONE 27 needed the analog
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · receipt-as-object publishes
//     entire engine evaluation history in shareable form · 同 Stripe Press
//     book detail page grammar
//   - per [[feedback-zone27-pratfall-brand-ip]] · PROVED + DIVERGED same
//     visual weight on this page · Aronson 1966 Pratfall axiom 物理 codify
//   - per /audit S05 PRE-COMMIT clause · receipts append-only · never
//     retroactively deleted · git diff log = source of truth
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     audience wants to share「我跟的 ZONE 27 cpbl-260521-01 receipt」
//     · single URL == single grabbable thing
//   - per [[zone27-payment-architecture]] · static SSG no dynamic rendering
//     · 0 server cost · 0 PII · 0 tracking
//
// 不做 anti-pattern:
//   ✕ NO「share with bonus credits」 incentive(violates 11-NEVER #4 MLM)
//   ✕ NO「view count · X people seen this receipt」 social proof
//   ✕ NO comment section / discussion(violates 11-NEVER #1 user-to-user social)
//   ✕ NO push notification「your followed match has a receipt」
//   ✕ NO retroactive edit · per /audit S05 PRE-COMMIT · 修改 receipt content
//     需 30 天前 /changelog 公告
//
// Architecture(per Agent A R75 SHIP 1 spec):
//   - Static SSG · generateStaticParams returns only finalized match IDs
//   - 404 if id not found or not yet finalized(receipt only exists post-final)
//   - Reference number format · Z27-{league}-{date-short}-{seq}
//     e.g. Z27-CPBL-260521-01 · Patek Reference grammar
//   - TIM signature footer + ingest timestamp
//   - <CopyLinkButton /> reuses /founders pattern
//   - Cross-links · /track-record(parent ledger)+ /matches/[gameId]
//     (match page)+ /audit(model report)
//
// Inspiration sources(per Agent A R75 SHIP 1 spec):
//   - Stripe Press(books.stripe.com)· each book = own URL · 3D parallax
//   - Patek Philippe Reference Number archive(patek.com/en/collection)
//   - Defector annual report PDFs(2020/2021/2022 · each = own permalink)
//   - Anthropic Transparency Hub model card revisions(each = own page)
//   - The Athletic beat-writer column permalink(each = own URL)
// ─────────────────────────────────────────────────────

type Params = Promise<{ receiptId: string }>;

export async function generateStaticParams(): Promise<{ receiptId: string }[]> {
  // Pre-render ONLY finalized matches · receipts only exist post-final ·
  // pre-game / live / future / archived matches resolve to 404。 Per /audit
  // S05 disclosure parity · receipt-page existence IS the proof of finalization。
  return getFinalizedMatches().map((m) => ({ receiptId: m.id }));
}

// R75 W-F · canonical Patek-style reference number derivation · Z27-{league}-
// {date-YYMMDD}-{seq}。 date pulled from match.id "cpbl-YYMMDD-NN" pattern ·
// seq from same。 brand IP 「不藏 / 不假裝」 · reference IS the match.id
// with cosmetic Z27- prefix · 5-second DevTools verify。
//
// R76 W-G · Agent B R76 audit M-4 fix · strict CPBL-only guard · matchId
// format MUST be exactly「cpbl-YYMMDD-NN」 3-part shape · MLB matches
// (hypothetical「mlb-2026-05-21-LAD-vs-SF」)would break the date+seq slot
// assumption。 此 fix:require parts.length === 3 + 「cpbl」 league exact ·
// fallback to full matchId for other leagues · per Agent A R76 spec
// 「Patek Reference grammar」 only CPBL ID shape conforms today。
function deriveReferenceNumber(matchId: string, league: string): string {
  const parts = matchId.split("-");
  // Strict CPBL 3-part shape · cpbl-YYMMDD-NN · Patek-style 4-segment ref
  if (parts.length === 3 && parts[0] === "cpbl") {
    const date = parts[1];
    const seq = parts[2];
    return `Z27 · ${league.toUpperCase()} · ${date} · ${seq}`;
  }
  // Fallback for non-CPBL or non-standard shapes · 不假裝 Patek grammar
  // 適用 · 直接 use full matchId · per /audit S05 disclosure parity。
  return `Z27 · ${league.toUpperCase()} · ${matchId}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { receiptId } = await params;
  const match = getMatchById(receiptId);
  if (!match || !match.finalResult) {
    return {
      title: "Receipt not found · ZONE 27",
      description: "此 receipt 不存在或未 finalized · 完整 ledger 在 /track-record。",
    };
  }
  const ref = deriveReferenceNumber(match.id, match.league);
  const cal = getCalibration(match) ?? "push";
  const verdict = cal === "proved" ? "PROVED ✓" : cal === "diverged" ? "DIVERGED ✕" : "PUSH";
  return {
    title: `${ref} · ${verdict} · ZONE 27 Receipt`,
    description: `${match.home.name} vs ${match.away.name} · ${match.date} · ${verdict} · ZONE 27 engine receipt · single-object page · per /audit S05 PRE-COMMIT clause · append-only。`,
    openGraph: {
      title: `${ref} · ${verdict}`,
      description: `${match.home.name} vs ${match.away.name} · ${match.date} · ZONE 27 engine receipt object`,
      images: ["/track-record/opengraph-image"],
    },
  };
}

export default async function ReceiptPage({ params }: { params: Params }) {
  const { receiptId } = await params;
  const match = getMatchById(receiptId);
  // Receipt page only exists for finalized matches · 404 for live/pre/future
  // matches · per /audit S05 disclosure parity · 不假裝 pre-final receipt。
  if (!match || !match.finalResult) {
    notFound();
  }

  const fr = match.finalResult;
  const cal = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);
  if (!cal) {
    notFound();
  }

  const ref = deriveReferenceNumber(match.id, match.league);
  const dateIso = getMatchDateIso(match) ?? "—";
  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);

  const verdictColor = {
    proved: "text-gold",
    diverged: "text-loss",
    push: "text-mute",
  }[cal];
  const verdictBorder = {
    proved: "border-gold",
    diverged: "border-loss/70",
    push: "border-mute/60",
  }[cal];
  const verdictLabel = {
    proved: "✓ PROVED · ENGINE 言中",
    diverged: "✕ DIVERGED · ENGINE 落空",
    push: "= PUSH · 平局或無 favorite",
  }[cal];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/track-record"
              className="hover:text-gold transition-colors"
            >
              TRACK RECORD
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold tabular">{receiptId}</span>
          </div>
        </section>

        {/* ── HERO · Patek-style reference number ──── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            ZONE 27 ENGINE RECEIPT · OBJECT PAGE · APPEND-ONLY
          </p>
          <h1 className="font-mono text-bone tabular text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4 break-all">
            {ref}
          </h1>
          {/* Cold gold hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[320px] mb-6" aria-hidden="true" />
          <p className="text-mute text-base leading-relaxed">
            這個 page IS the receipt · 不是 marketing wrapper · 不是 narrative
            section · 是 the object 本身。 per /audit S05 PRE-COMMIT clause ·
            append-only · 修改 receipt content 需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold underline-offset-4 hover:underline"
            >
              /changelog
            </Link>{" "}
            公告 · 同 Stripe Press book detail page + Patek Reference Number
            archive pattern。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── RECEIPT OBJECT · Stripe Press-style detail ── */}
        <article
          aria-label={`ZONE 27 receipt ${ref}`}
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12"
        >
          <div className="border-2 border-mute/40 bg-slate/30">
            {/* ── TOP-LINE · TCG card anatomy(R60 W-B established pattern) ── */}
            <div className="border-b border-gold/40 bg-gold/5 px-5 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
              <p
                lang="en"
                className="font-mono text-gold tracking-[0.35em] text-[10px] sm:text-[11px]"
              >
                ZONE 27 ENGINE · v0.2 · RECEIPT OBJECT
              </p>
              <p
                lang="en"
                className="font-mono text-gold/80 tracking-[0.3em] text-[9px] sm:text-[10px] tabular"
              >
                {match.league} SEASON {dateIso.slice(0, 4)}
              </p>
            </div>

            {/* ── REFERENCE BAND ─────────────────────── */}
            <div className="border-b border-mute/30 px-5 sm:px-8 py-4 flex items-baseline justify-between flex-wrap gap-3">
              <p
                lang="en"
                className="font-mono text-mute/85 text-[10px] sm:text-xs tracking-[0.4em]"
              >
                ★ REFERENCE · {ref}
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
                {dateIso} · INGEST
              </p>
            </div>

            {/* ── MATCH SUMMARY ──────────────────────── */}
            <div className="px-5 sm:px-8 pt-7 pb-6">
              <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-3">
                / MATCHUP
              </p>
              <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-1">
                <span className="text-gold">{match.home.name}</span>
                <span className="text-mute/60 mx-3 text-base">vs</span>
                <span className="text-mute">{match.away.name}</span>
              </h2>
              <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-1">
                {match.home.en}{" "}
                <span aria-hidden="true" className="text-mute/85">
                  ·
                </span>{" "}
                {match.away.en} · {match.venue}
              </p>
            </div>

            {/* ── ENGINE vs ACTUAL GRID ──────────────── */}
            <div className="px-5 sm:px-8 pb-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="border-l-2 border-gold/30 pl-5 pr-2 py-2">
                  <p
                    lang="en"
                    className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
                  >
                    ENGINE PREDICTED · 賽前鎖定
                  </p>
                  <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
                    {favoritePct}
                    <span className="text-lg opacity-60 ml-1">%</span>
                    <span className="text-mute text-base ml-3">
                      {homeFavored ? match.home.en : match.away.en}
                    </span>
                  </p>
                  <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
                    FAVORITE · {favoriteName} · CONF{" "}
                    {match.aiConfidence ?? 0}/100
                  </p>
                </div>
                <div className="border-l-2 border-bone/30 pl-5 pr-2 py-2 sm:text-right sm:border-l-0 sm:border-r-2 sm:pr-5 sm:pl-2">
                  <p
                    lang="en"
                    className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
                  >
                    ACTUAL RESULT · 賽後
                  </p>
                  <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
                    {fr.homeScore}:{fr.awayScore}
                    <span className="text-mute text-base ml-3">
                      {fr.winner === "home"
                        ? `${match.home.en} W`
                        : fr.winner === "away"
                          ? `${match.away.en} W`
                          : "TIE"}
                    </span>
                  </p>
                  <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
                    {fr.innings ?? 9} 局 · {fr.ingestedAt} INGEST
                  </p>
                </div>
              </div>
            </div>

            {/* ── VERDICT BAND · R67 W-B Peak-End rule axiom 物理 codify ─── */}
            <div
              className={`border-t-2 ${verdictBorder} px-5 sm:px-8 py-6 sm:py-7 text-center enter-verdict-reveal`}
            >
              <p
                lang="en"
                className={`font-mono ${verdictColor} text-lg sm:text-2xl tracking-[0.3em] font-medium`}
              >
                {verdictLabel}
              </p>
              {enginePctOnWinner !== null && (
                <p
                  className={`font-mono ${verdictColor} text-[11px] sm:text-xs tracking-[0.3em] tabular mt-3 opacity-80`}
                >
                  {cal === "proved" && (
                    <>
                      ENGINE 鎖 {favoritePct}% · {favoriteName} 勝
                    </>
                  )}
                  {cal === "diverged" && (
                    <>
                      ENGINE 鎖 {favoritePct}% · {favoriteName} 落空
                    </>
                  )}
                  {cal === "push" && <>無 favorite · 平局或同分</>}
                </p>
              )}
            </div>

            {/* ── TIM SIGNATURE FOOTER ───────────────── */}
            <div className="border-t border-line/40 px-5 sm:px-8 py-5 flex items-baseline justify-between flex-wrap gap-3">
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
                — TIM · ZONE 27 FOUNDER · {dateIso}
              </p>
              <p
                lang="en"
                className="font-mono text-gold/70 text-[9px] tracking-[0.3em] tabular"
              >
                APPEND-ONLY · /audit S05 PRE-COMMIT
              </p>
            </div>
          </div>
        </article>

        {/* ── COPY-LINK + CROSS-LINKS ─────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border border-line/40 bg-slate/20 p-5 sm:p-6">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4">
              ⚓ SHARE THIS RECEIPT · NO TRACKING · NO REFERRAL CODE
            </p>
            <p className="text-mute text-sm leading-relaxed mb-5">
              此 URL 是 receipt 的 permanent home · 您可直接 share · 0 UTM
              parameter · 0 referral code · 0 tracking pixel · 同 /privacy
              0-tracker promise。 ZONE 27 不 track 誰 share 給誰 · 不會
              發 push 提醒「您 share 的 receipt 收到 N views」。
            </p>
            <CopyLinkButton />
          </div>
        </section>

        {/* ── RELATED CROSS-LINKS ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-mute text-[10px] tracking-[0.4em] mb-4">
            / RELATED · TRACEABILITY CROSS-LINKS
          </p>
          <ul className="space-y-2 text-mute text-sm">
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href="/track-record"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /track-record
              </Link>
              <span className="text-mute/70">
                · parent ledger · all receipts in chronological order
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href={`/matches/${match.id}`}
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /matches/{match.id}
              </Link>
              <span className="text-mute/70">
                · match page · pre-game / live / post-final detail
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href="/audit"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /audit
              </Link>
              <span className="text-mute/70">
                · model report · engine v0.2 description + estimation
                disclosure
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href="/methodology"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /methodology
              </Link>
              <span className="text-mute/70">
                · engineering paper · how this prediction was computed
              </span>
            </li>
          </ul>
        </section>

        <FounderSignOff>
          <p>
            這個 page 是 Stripe Press / Patek Reference Number / Defector
            permalink pattern 對標 · receipt-as-object 不 receipt-in-narrative。
            ZONE 27 第一個 visitor-grabbable thing。
          </p>
          <p>
            每場 finalized match 自動 generate own /receipts/[id] page ·
            generateStaticParams 從 lib/matches.ts 拉 · 0 server cost · 0
            dynamic rendering · 0 PII transit · 0 tracking。 您 share 此 URL ·
            ZONE 27 不知道誰 click · 同 /privacy 0-tracker promise。
          </p>
          <p>
            修改此 receipt 內容需 30 天前 /changelog 公告 · per /audit S05
            PRE-COMMIT · append-only · git diff log = source of truth。
            違反 = brand 信用 collapse 永久 audit trail。
          </p>
        </FounderSignOff>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/track-record"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← /track-record · 完整 ledger
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
