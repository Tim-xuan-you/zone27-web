import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ReadingProgress from "@/components/ReadingProgress";
import Footer from "@/components/Footer";
import {
  LETTER_BODY,
  LAST_EDITED_AT,
  EDIT_HISTORY,
  EDIT_HISTORY_COUNT,
} from "@/lib/letter-content";

export const metadata: Metadata = {
  title: "The Letter · Tim 親手 voice · singular artifact",
  description:
    "DHH HEY World + Berkshire annual letter + Bret Victor replace-in-place + Maciej Cegłowski Pinboard blog pattern · ZONE 27 第一個 singular voice artifact · Tim 親手 letter · edited-in-place not feed · APPEND-ONLY edit history · NO comment thread · NO share button · NO email subscribe · NO related-reading rail · 不 push · reader pulls。",
  openGraph: {
    title: "The Letter · Tim 親手 voice · ZONE 27",
    description:
      "Tim 親手 letter · edited-in-place · DHH HEY World + Berkshire pattern · NO email · NO push · NO comment thread",
    type: "article",
    url: "/letter",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Letter · Tim 親手 voice · ZONE 27",
    description:
      "Tim 親手 letter · edited-in-place · DHH HEY World + Berkshire pattern · NO email · NO push · NO comment thread",
  },
  alternates: {
    canonical: "/letter",
  },
};

// /letter · DHH HEY World + Berkshire annual letter + Bret Victor replace-in-
// place + Pinboard blog pattern · singular voice artifact · reader pulls ·
// nothing pushes · EDIT_HISTORY append-only。

export const revalidate = 86400; // daily revalidate

function renderLetterBody(body: string): React.ReactElement[] {
  return body
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph, idx) => (
      // .zh-body applies Typotheque CJK canonical(17px / 1.78 leading / 38ch
      // max width / hanging-punctuation)· per R96 W1 utility · Chinese
      // long-form prose readability。
      <p
        key={idx}
        className="zh-body text-bone mb-5 font-light"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {paragraph}
      </p>
    ));
}

export default function LetterPage() {
  const body = renderLetterBody(LETTER_BODY);
  const editsNewestFirst = [...EDIT_HISTORY].reverse();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

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
              ⚓ EDIT_HISTORY append-only · 修改任 entry 需 30 天前{" "}
              <Link
                href="/changelog"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /changelog
              </Link>{" "}
              公告。 LETTER_BODY 是 replace-in-place(this IS the design)·
              但 EDIT_HISTORY 不可 retroactively 修改 · reader audits the
              edit cadence。
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
                  · 您 OWN arrival
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
