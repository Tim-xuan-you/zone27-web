import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroLiveCard from "@/components/HeroLiveCard";
import { getFeaturedMatch } from "@/lib/matches";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

// ── ZONE 27 · Homepage(Round 3 · Apple-grade compression)──
//
// Round 1-2 had 8 sections trying to prove credibility on the
// homepage. Tim's critique on 2026-05-21 PM:
//   「我們網站好雜...走極簡風...心理學怎麼看?」
//
// He's right. Apple homepage doesn't list features — it shows
// ONE product at a time. Stratechery's homepage is the latest
// article, not a credentials wall. Linear's homepage is a product
// demo. ZONE 27's parallel is:
//
//   1. Hero  — the soul statement(一句話)
//   2. Live engine card — THE demo(receipt of credibility)
//   3. Founders 27 — the offer
//
// Everything else(/manifesto · /audit · /coverage · /privacy ·
// /track-record · /roadmap · /discipline · /methodology · /glossary ·
// /faq · /about · /learn · /changelog · /signal-board · /lab · ...)
// is still reachable via:
//   ▸ Cmd-K / Ctrl-K palette(24 routes indexed)
//   ▸ Footer 4-column nav
//   ▸ Inline links from /manifesto + /audit + each trust artifact
//
// The brand-IP「方法公開」isn't broken — it's just no longer SHOUTED
// on the homepage. Depth lives behind clicks · visitors who want it
// earn it · visitors who don't get a clean front door.
//
// Psychology backing:
//   - Hick's Law(more choices = slower decisions)
//   - Cognitive load theory(more elements = less retention)
//   - F-pattern reading(top-down scanning · we own the top 2 rows)
//   - Apple's「一畫面一件事」after Norman 1988 + 2019 nngroup updates
//
// Sections removed from homepage(content preserved on other pages):
//   ❌ CREDIBILITY STRIP(3-cell DATA·ENGINE·METHOD)
//      → covered by HeroLiveCard methodology line + /audit
//   ❌ THREE PILLARS(會員制低抽成 · 不可篡改 · Monte Carlo)
//      → covered by /manifesto + /discipline canonical
//   ❌ BRAND INVERSION THESIS(4 倒置 TLDR)
//      → fully covered by /manifesto canonical
//   ❌ BY THE NUMBERS bento(6 proof tiles)
//      → covered by /audit Section 00 BUILD chip + /track-record
//   ❌ TRUST STACK(8-doc grid)
//      → covered by Footer + Cmd-K palette + Footer FUNDED-BY line
//
// Reversibility: one `git revert` brings everything back. Components
// were inline · purged with the section that used them · no orphan code.
// ─────────────────────────────────────────────────────

export default function Home() {
  // Round 10: getFeaturedMatch picks via lifecycle priority:
  //   today-pregame/live → future → most-recent-finalized → orphan
  // After game day · cpbl-260521-01 transitions from "today" to
  // "final" automatically (if Tim ingested finalResult) · homepage
  // then features the next day's match · or shows yesterday's
  // receipt if no new match is yet ingested.
  // Receipt-mode (showing PROVED/DIVERGED) is a STRONGER conversion
  // signal than upcoming-prediction-mode · so this fallback chain
  // is brand-IP-aligned: engine + receipt = the soul.
  const featuredMatch = getFeaturedMatch();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">

      {/* ── HERO · Mobile-first compressed ────────────────
          Round 5: mobile vertical density was too high. Padding
          pt-24 + pb-16 + text-5xl meant hero alone = 1.7 viewports
          on iPhone, pushing HeroLiveCard demo entirely below fold.
          Cut by ~50% on mobile · desktop preserves the breathing
          room. Owner-as-visitor test: hero + first half of demo
          must fit in 1st mobile viewport. */}
      <section className="mx-auto max-w-4xl px-6 sm:px-10 pt-10 sm:pt-32 pb-10 sm:pb-20 text-center">
        <p
          lang="en"
          className="font-mono text-gold/70 text-[10px] sm:text-xs tracking-[0.4em] mb-5 sm:mb-10"
        >
          A QUANTITATIVE SPORTS INTELLIGENCE CLUB · EST. 2026
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          不靠直覺,
          <br />
          <span className="text-gold">只看演算法。</span>
        </h1>

        <p
          lang="en"
          className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-5 sm:mt-8"
        >
          WE DON&apos;T GUESS. WE COMPUTE.
        </p>

        <p className="mt-6 sm:mt-10 max-w-md mx-auto text-mute leading-relaxed text-sm sm:text-base">
          引擎為您跑這場 · 結果存進公開戰績。
        </p>

        {/* Round 11 agent fix: desktop hero had no Founders CTA above
            the fold · sticky CTA covered mobile but desktop visitors
            had to scan Nav to find /founders. Add inline scarcity
            anchor (desktop-visible · mobile too · doesn't conflict
            with sticky bar).
            Round 12 conversion-funnel agent: bare mono text at -0.2em
            tracking parsed as label, not CTA (Fitts's Law violation).
            Wrap in hairline-bordered pill — still brand-pure (canonical
            ZONE 27 visual idiom), now reads as interactive at first
            glance without breaking minimalism. */}
        <p className="mt-6 sm:mt-8">
          <Link
            href="/founders"
            className="inline-block px-5 py-2.5 border border-gold/40 hover:border-gold hover:bg-gold/5 transition-colors font-mono text-xs sm:text-sm tracking-[0.2em] tabular"
            aria-label={`Founders 27 · ${FOUNDERS_REMAINING} of ${FOUNDERS_TOTAL} seats remain`}
          >
            <span className="text-gold">FOUNDERS · 27</span>
            <span className="text-mute/60 mx-2">·</span>
            <span className="text-bone">{FOUNDERS_REMAINING}</span>
            <span className="text-mute/60">/{FOUNDERS_TOTAL}</span>
            <span className="text-mute/60 mx-2">·</span>
            <span className="text-mute">NT$ 2,700 終身</span>
            <span className="text-gold/70 ml-2">→</span>
          </Link>
        </p>
      </section>

      {/* Hairline divider — visual breath. Tighter on mobile. */}
      <div className="mx-auto w-32 gold-line mb-8 sm:mb-20" />

      {/* ── THE ENGINE · 主視覺 · 即時跑這場 ─────────
          This is the soul. Engine output IS the product · IS the
          credibility · IS the homepage. Visitors arrive, see the
          algorithm converge in 2 seconds, get it.
          HeroLiveCard embeds its own CTAs (/matches and /matches/[gameId])
          — those carry visitors to depth on their own gradient. */}
      <section className="mx-auto w-full max-w-3xl px-6 sm:px-10 pb-20 sm:pb-28">
        {featuredMatch ? (
          <HeroLiveCard match={featuredMatch} />
        ) : (
          <EmptyHeroCard />
        )}

        <p className="text-center font-mono text-mute text-[10px] tracking-[0.25em] mt-8">
          AI 計算的是機率 · 不是命運
        </p>
      </section>

      {/* Round 5: Founders 27 strip REMOVED from homepage.
          Research recommendation (agent · Baymard / HubSpot 2026):
          - Sticky bottom CTA bar (StickyFoundersCTA · mobile only)
            replaces this section's function with +30% conversion
            uplift vs static strip below fold.
          - Saves ~500-600px on mobile · pushes total scroll closer
            to 3-viewport target.
          - /founders page itself is the canonical offer destination ·
            sticky bar drives directly there.
          - "Quiet door to /manifesto" moved to footer link group.
          One git revert brings this strip back if needed. */}

      </main>

      <Footer />
    </div>
  );
}

// ── EmptyHeroCard ─────────────────────────────────────
// Fallback when matches array is empty (migration / pre-launch /
// scheduled outage). The "ENGINE READY · NO MATCHES LOADED" framing
// is honest — not "Coming soon" marketing fluff.

function EmptyHeroCard() {
  return (
    <div className="bg-slate/40 border border-line/60 p-10 sm:p-14 text-center">
      <p
        lang="en"
        className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-8"
      >
        ENGINE READY · NO MATCHES LOADED
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
        範例賽事尚未排定
      </h2>
      <p className="mt-6 text-mute text-sm max-w-md mx-auto leading-relaxed">
        資料寫入中(可能是季外或資料遷移)。引擎已就緒 · 可在自訂模式自由跑模擬。
      </p>
      <Link
        href="/lab/custom"
        className="inline-block mt-8 font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
      >
        進入自訂實驗室 →
      </Link>
    </div>
  );
}
