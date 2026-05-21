import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroLiveCard from "@/components/HeroLiveCard";
import { matches } from "@/lib/matches";

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
//   ▸ Cmd-K / Ctrl-K palette(23 routes indexed)
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
  // matches[0] is undefined-safe — if lib/matches.ts is empty
  // (migration in progress), the Hero falls back to EmptyHeroCard
  // instead of crashing.
  const featuredMatch = matches[0];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">

      {/* ── HERO · 一句話定義品牌 ────────────────────
          Apple/Stratechery rule: hero is brand statement, NOT
          conversion funnel. ONE primary CTA. Secondary CTAs were
          competing with HeroLiveCard's own embedded CTAs (which
          drove to /matches and /matches/[gameId]) — redundant. */}
      <section className="mx-auto max-w-4xl px-6 sm:px-10 pt-24 sm:pt-32 pb-16 sm:pb-20 text-center">
        <p
          lang="en"
          className="font-mono text-gold/70 text-xs tracking-[0.4em] mb-10"
        >
          A QUANTITATIVE SPORTS INTELLIGENCE CLUB · EST. 2026
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          不靠直覺,
          <br />
          <span className="text-gold">只看演算法。</span>
        </h1>

        <p
          lang="en"
          className="font-mono text-mute text-sm tracking-[0.3em] mt-8"
        >
          WE DON&apos;T GUESS. WE COMPUTE.
        </p>

        <p className="mt-12 max-w-md mx-auto text-mute leading-relaxed text-base">
          引擎為您跑這場 · 結果存進公開戰績。
          其他都是支持證據。
        </p>
      </section>

      {/* Hairline divider — single visual breath between hero and demo */}
      <div className="mx-auto w-32 gold-line mb-16 sm:mb-20" />

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

      {/* ── THE OFFER · Founders 27 · 唯一的 ask ─────
          ONE place on homepage where a sale-intent CTA lives.
          Anything pre-this point earned the click via the engine demo.
          Below this point: footer + done. No more sections fighting
          for attention. */}
      <section
        aria-labelledby="founders-strip-heading"
        className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 sm:py-24 text-center border-t border-line/40"
      >
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
        >
          FOUNDERS · 27
        </p>
        <h2
          id="founders-strip-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight"
        >
          僅限 270 位創始會員
        </h2>
        <p className="text-mute mt-5 max-w-md mx-auto leading-relaxed">
          一次性 NT$ 2,700 終身會員資格 · 個人 ID 鑲入 #001 ~ #270 編號徽章
          · 售完永久關閉。
        </p>
        <Link
          href="/founders"
          className="inline-block mt-10 px-10 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          加入創始名冊 →
        </Link>

        {/* The quiet door · for visitors who want the depth.
            One line, no fanfare. Cmd-K + Footer + /manifesto are
            also discoverable but this is the most-likely-clicked
            secondary path. */}
        <div className="mt-12 pt-8 border-t border-line/40 max-w-sm mx-auto">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
          >
            <span>想先讀為什麼這樣做 · /manifesto</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

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
