import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  LETTER_BODY,
  LAST_EDITED_AT,
  EDIT_HISTORY,
  EDIT_HISTORY_COUNT,
} from "@/lib/letter-content";

export const metadata: Metadata = {
  title: "The Letter · Tim 親手 voice artifact · ZONE 27",
  description:
    "DHH HEY World + Berkshire annual letter + Bret Victor replace-in-place + Maciej Cegłowski Pinboard blog pattern · ZONE 27 第一個 singular voice artifact · Tim 親手 letter · edited-in-place not feed · APPEND-ONLY edit history · NO comment thread · NO share button · NO email subscribe · NO related-reading rail · 不 push · reader pulls。",
  openGraph: {
    title: "The Letter · Tim 親手 voice · ZONE 27",
    description:
      "Tim 親手 letter · edited-in-place · DHH HEY World + Berkshire pattern · NO email · NO push · NO comment thread",
    images: ["/transparency/opengraph-image"],
  },
};

// ── ZONE 27 · /letter · The Singular Voice Artifact ────
// R77 W-D · Agent A R77 SHIP B ★★★★★ · 「biggest invisible gap」 third-
// pass honest answer · DHH HEY World + Berkshire annual letter + Bret
// Victor replace-in-place + Maciej Cegłowski Pinboard blog + Substack-pre-
// Substack Ben Thompson(2013-2014)pattern。
//
// Per Agent A R77 third-pass honest answer:
//   - Tim has 49 routes · 6 canonical ledgers · 0 singular voice artifact
//   - Every pre-launch brand that survived had one(Buffett letter · DHH
//     HEY World · Stratechery About · Cegłowski Pinboard · Bret Victor)
//   - The brand-defining artifact is never /about · 是 singular letter
//     that gets edited and re-edited until it BECOMES the brand voice
//
// This page architecture(per Agent A R77 SHIP B spec):
//   - Single static page · reads lib/letter-content.ts canonical source
//   - LETTER_BODY rendered as serif prose · max-w-prose · plain text feel
//   - LAST_EDITED_AT stamp at top
//   - EDIT_HISTORY table at bottom · transparency-friendly cadence audit
//   - NO comment thread · NO share button · NO related-reading rail · NO
//     email subscribe · NO push · NO「next letter」 navigation
//   - Reader pulls; nothing pushes
//   - LineKeepHint mobile hint at bottom(per R75 W-B + R77 W-B mobile
//     long-press → LINE Keep grammar)
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · singular voice IS disclosure
//     axis 物理 codify
//   - per [[feedback-zone27-pratfall-brand-ip]] · vulnerable + brief +
//     edited-in-place IS Pratfall · 不 craft「perfect launch piece」
//   - per [[feedback-zone27-audience-fans-not-engineers]] · Tim 親手 voice
//     speaks fan-grammar instantly
//   - per /audit S05 PRE-COMMIT · EDIT_HISTORY append-only · same Costly
//     Signaling discipline as 7-ledger family canonical pattern
//
// 不做 anti-pattern(per Agent A R77 SHIP B spec + R75 W-B
// UnscheduledLetterChip framing):
//   ✕ NO comment thread / discussion(11-NEVER #1 user-to-user social)
//   ✕ NO share buttons(reader 自己 long-press / copy URL)
//   ✕ NO related-reading rail(letter IS the artifact · 不 cross-link)
//   ✕ NO email subscribe / newsletter / RSS push(per /transparency
//     #no-push-manifest R73 W-D · per UnscheduledLetterChip R75 W-B
//     「您 OWN arrival」 axis)
//   ✕ NO「join Substack」 / 「subscribe to receive next letter」 CTA
//   ✕ NO「Print this letter」 PDF download(letter IS the URL artifact)
//
// Inspiration sources:
//   - DHH world.hey.com/dhh(replacing-in-place letter pattern)
//   - Berkshire Hathaway annual letter(Buffett 60-yr cadence)
//   - Stratechery About page(Ben Thompson singular voice)
//   - Maciej Cegłowski Pinboard blog(idlewords.com · 17 yr durable)
//   - Bret Victor worrydream.com/about(non-incremental publishing)
//
// LineKeepHint reused from R77 W-B · mobile long-press → LINE Keep grammar
// · 不需加好友 · session-only dismiss(NOT localStorage · per 11-key cap)。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily revalidate(content freshness)

// Render LETTER_BODY paragraphs · split by double newlines · brand-pure
// plain-text rendering · NO markdown library dependency · 0 deps · serif
// prose for letter-letter feel(Berkshire + Patek tagline aesthetic)。
function renderLetterBody(body: string): React.ReactElement[] {
  return body
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph, idx) => (
      <p
        key={idx}
        className="text-bone text-base sm:text-lg leading-relaxed mb-5 font-light"
        style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
      >
        {paragraph}
      </p>
    ));
}

export default function LetterPage() {
  const body = renderLetterBody(LETTER_BODY);
  // Reverse for newest-first display in EDIT_HISTORY · same canonical
  // pattern as /engine-log render layer(R76 W-C)· lib stays ASCENDING。
  const editsNewestFirst = [...EDIT_HISTORY].reverse();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HEADER · minimal · letter-like feel ─────── */}
        <article className="mx-auto max-w-prose w-full px-6 sm:px-10 pt-20 pb-12">
          <header className="pb-8 border-b border-line/40">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
              THE LETTER · 親手 · 邊寫邊改 · 不發新文
            </p>
            <h1
              className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-snug mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Tim 親手寫的 letter
            </h1>
            {/* Cold Gold Hairline · R54 W-C signature moat */}
            <div className="zone27-rule max-w-[200px] mb-4" aria-hidden="true" />
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.3em] tabular"
            >
              LAST EDITED · {LAST_EDITED_AT} · {EDIT_HISTORY_COUNT} TOTAL EDITS · APPEND-ONLY HISTORY
            </p>
          </header>

          {/* ── BODY · serif prose · letter feel ──────── */}
          <div className="pt-10 pb-12">{body}</div>

          {/* ── EDIT HISTORY · transparency cadence audit ── */}
          <section className="pt-8 border-t border-line/40">
            <p
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-4"
            >
              / EDIT HISTORY · APPEND-ONLY · NEWEST FIRST
            </p>
            <ul className="space-y-3">
              {editsNewestFirst.map((entry, idx) => (
                <li
                  key={`${entry.date}-${idx}`}
                  className="flex gap-4 items-baseline text-mute text-sm leading-relaxed"
                >
                  <span
                    lang="en"
                    className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular shrink-0 w-24"
                  >
                    {entry.date}
                  </span>
                  <span className="flex-1">{entry.summary}</span>
                </li>
              ))}
            </ul>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mt-6">
              ⚓ EDIT_HISTORY append-only per /audit S05 PRE-COMMIT clause ·
              修改任 entry 需 30 天前{" "}
              <Link
                href="/changelog"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /changelog
              </Link>{" "}
              公告 · same Costly Signaling discipline as ENGINE_OPS_LOG R76
              W-C + ENGINE_DIFF_BEACONS R71 W-C canonical 7-ledger family
              pattern。 LETTER_BODY 是 replace-in-place(this IS the
              design)· 但 EDIT_HISTORY 不可 retroactively 修改 · reader
              audits the edit cadence。
            </p>
          </section>

          {/* ── ANTI-PATTERN DISCLOSURE · what this page DOESN'T do ── */}
          <section className="pt-8 mt-8 border-t border-line/40">
            <p
              lang="en"
              className="font-mono text-mute/60 text-[9px] tracking-[0.3em] mb-4"
            >
              / WHAT THIS PAGE DELIBERATELY DOESN&apos;T HAVE
            </p>
            <ul className="space-y-2 text-mute/70 text-[12px] leading-relaxed">
              <li className="flex gap-3 items-baseline">
                <span className="text-loss/60" aria-hidden="true">✕</span>
                <span className="flex-1">
                  Comment thread · per 11-「永遠不做」 #1 user-to-user social platform redline
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="text-loss/60" aria-hidden="true">✕</span>
                <span className="flex-1">
                  Share buttons · reader 自己 long-press / copy URL · 不
                  funnel social platform
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="text-loss/60" aria-hidden="true">✕</span>
                <span className="flex-1">
                  Related-reading rail · letter IS the artifact · 不
                  cross-link to siblings
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="text-loss/60" aria-hidden="true">✕</span>
                <span className="flex-1">
                  Email subscribe / push permission / RSS push · per{" "}
                  <Link
                    href="/transparency#no-push-manifest"
                    className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                  >
                    NO-PUSH MANIFEST
                  </Link>{" "}
                  R73 W-D · per UnscheduledLetterChip R75 W-B「您 OWN arrival」 axis
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="text-loss/60" aria-hidden="true">✕</span>
                <span className="flex-1">
                  「Next letter」 / archive navigation · letter is REPLACE-in-
                  place not feed · 不 accumulate
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="text-loss/60" aria-hidden="true">✕</span>
                <span className="flex-1">
                  「Print this letter」 / PDF download · letter IS the URL
                  artifact · long-press save / screenshot OK · per LineKeepHint
                  mobile hint below
                </span>
              </li>
            </ul>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
