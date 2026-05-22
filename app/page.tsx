import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroLiveCard from "@/components/HeroLiveCard";
import TonightReceiptsCard from "@/components/TonightReceiptsCard";
import RecentMatchesRow from "@/components/RecentMatchesRow";
import AnonCalibrationStrip from "@/components/AnonCalibrationStrip";
import {
  getFeaturedMatch,
  getTodayMatches,
  getTrackRecordStats,
} from "@/lib/matches";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

// ── ISR · re-evaluate featured match every 10 minutes. ─────
// Without revalidate the homepage is fully static · frozen at
// build time · which breaks every lifecycle transition that
// isn't accompanied by a git push:
//   · 18:35 today-pregame → today-live(badge stays as PREGAME)
//   · 22:00+ today-live → today-final WHEN Tim's ingest runs
//     a git push(handled · build refreshes)BUT also when Tim
//     ingests via Supabase Studio without a deploy(future state)
//   · 00:00 day rollover · today → stale-archived · next-day
//     future → today-pregame(homepage shows yesterday's data
//     all morning until manual deploy)
// 600 s mirrors /matches/mlb · same「lifecycle-state page」cadence.
export const revalidate = 600;

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
//   ▸ Cmd-K / Ctrl-K palette(34 visitor-discoverable routes indexed)
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
  // Round 31 Wave A · Multi-match Costly Signaling moment.
  //
  // When today has 2+ matches (CPBL 3-game nights · MLB doubleheaders ·
  // future cross-league days), the homepage switches from the
  // single-match HeroLiveCard cinematic to TonightReceiptsCard — a
  // 2-or-3-card grid that shows all of tonight's PRE-LOCKED engine
  // predictions side-by-side. Brand IP physics:
  //
  //   - One night = N receipts. The bigger N, the more chance to be
  //     visibly wrong. Putting them all on the front door is the
  //     Costly Signaling move.
  //   - Cumulative track record (TRACK RECORD · N=X · ✓Y ✕Z) lives
  //     in the card footer · visitor sees the audit trail growing.
  //   - "Engine published BEFORE first pitch" timestamp = pre-lock-in
  //     proof. Static engine output (no live re-simulation) ensures
  //     we cannot game the receipt by re-sampling.
  //
  // When today has 1 or 0 matches, we fall back to the existing
  // getFeaturedMatch() priority chain (today active → today final →
  // recent finalized → future) which HeroLiveCard renders with its
  // live 1000-sim Monte Carlo cinematic. Single-match days keep the
  // single-match theatre · multi-match days get the multi-receipt
  // grid · brand IP soul preserved across both modes.
  const todayMatches = getTodayMatches();
  const useMultiMatch = todayMatches.length >= 2;
  const featuredMatch = useMultiMatch ? null : getFeaturedMatch();
  const trackRecord = useMultiMatch ? getTrackRecordStats() : null;

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
          className="font-mono text-gold text-[10px] sm:text-xs tracking-[0.4em] mb-5 sm:mb-10"
        >
          AI 量化棒球引擎 · QUANTITATIVE BASEBALL AI · EST. 2026
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

        {/* Round 33 W-B · agent customer-driven product redesign verdict:
            hero explainer 加 AI prominence + 信號強度語法 + regulatory
            framing。 connects to ConfidenceStars(Round 33 W-A)downstream.
            「公開可驗證 · 不收下注佣 · 不推薦投注」 = Taiwan 投顧 license
            analogy defense + brand IP「data publisher」 not「advisor」 positioning. */}
        <p className="mt-6 sm:mt-10 max-w-md mx-auto text-mute leading-relaxed text-sm sm:text-base">
          今晚 CPBL · AI 引擎告訴您信號強度<span className="text-gold">5 ★ STRONG → 1 ★ COIN-FLIP</span>。 結果存進公開戰績。
        </p>
        <p
          lang="en"
          className="mt-3 max-w-md mx-auto font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.3em] leading-relaxed"
        >
          公開可驗證 · 不收下注佣 · 不推薦投注
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

        {/* Round 50 W-C · subtle scroll-to-prediction hint · per Hick's
            Law deeper formulation · 訪客 first-touch 必須是 PRIMARY
            product moment · 不是 brand declaration。 此 link 不奪 hero
            焦點(mute color · -2 text size · 純文字 + ↓ 符號)· 但給
            fan「我來看 prediction」 的明確 path · 不必猜「prediction 在
            哪滑」。 */}
        <p className="mt-4 sm:mt-5">
          <a
            href="#tonight-engine"
            className="inline-flex items-center gap-2 font-mono text-mute/70 hover:text-gold text-[10px] sm:text-[11px] tracking-[0.3em] transition-colors group"
            aria-label="scroll 到今晚的引擎 prediction"
          >
            <span className="text-gold/60 group-hover:text-gold transition-colors">↓</span>
            <span>今晚的引擎</span>
          </a>
        </p>
      </section>

      {/* Hairline divider — visual breath. Tighter on mobile. */}
      <div className="mx-auto w-32 gold-line mb-8 sm:mb-20" />

      {/* Round 40 W-G · Agent F #5 · RecentMatchesRow · client-only ·
          conditional render when localStorage has entries · 0 SSR /
          0 server state / 0 cookies / 0 tracking · brand IP homepage
          minimalism preserved(無 entries 時不 render)· Day One「On This
          Day」 pattern transplant to baseball matches · WhatsApp landers
          升 multi-game readers without account · Agent F deepest sharp
          call「3-step funnel: precise landing → instant exploration →
          return-visit recall」 完整 close。 */}
      <RecentMatchesRow />

      {/* R45 W-E · Agent L DEEPEST · Anonymous Calibration Strip compact
          homepage variant · 訪客 own track record vs engine summary chip ·
          only renders when localStorage zone27_anon_picks_v1 has picks ·
          0 server · 0 PII · 0 cookies · brand IP homepage minimalism
          preserved(無 picks 時不 render)· Link to /calibration full strip。 */}
      <AnonCalibrationStrip variant="homepage" />

      {/* ── THE ENGINE · 主視覺 · 即時跑這場 ─────────
          This is the soul. Engine output IS the product · IS the
          credibility · IS the homepage. Visitors arrive, see the
          algorithm converge in 2 seconds, get it.
          HeroLiveCard embeds its own CTAs (/matches and /matches/[gameId])
          — those carry visitors to depth on their own gradient.
          Round 31 Wave A: multi-match days swap in TonightReceiptsCard
          for the same hero slot · 3-card grid of pre-locked receipts.
          Round 50 W-C · #tonight-engine id anchor for hero scroll hint
          (per Hick's Law deeper formulation · fan-first audience axiom). */}
      <section
        id="tonight-engine"
        className="mx-auto w-full max-w-3xl px-6 sm:px-10 pb-20 sm:pb-28 scroll-mt-8"
      >
        {useMultiMatch && trackRecord ? (
          <TonightReceiptsCard
            matches={todayMatches}
            trackRecord={trackRecord}
          />
        ) : featuredMatch ? (
          <HeroLiveCard match={featuredMatch} />
        ) : (
          <EmptyHeroCard />
        )}

        <p className="text-center font-mono text-mute text-[10px] tracking-[0.25em] mt-8">
          AI 計算的是機率 · 不是命運
        </p>

        {/* Round 19 soul addition · Tim signature 取代 homepage 從前的
            「100% product · 0 founder」狀態。極小 mute/60 一行 · 不破
            Apple-grade 3-section minimalism · 卻給整個首頁人性錨點。
            Links to /about Chapter 00 PROLOGUE — full founder narrative
            一鍵可達。Per Round 19 Tim 直覺「我們缺必要靈魂」之回應。 */}
        <p className="text-center font-mono text-mute/60 text-[9px] tracking-[0.3em] mt-3">
          —{" "}
          <Link
            href="/about"
            className="hover:text-gold transition-colors"
            aria-label="讀 Tim 創辦人筆記 · /about Chapter 00 PROLOGUE"
          >
            TIM · CPBL 球迷 27 年
          </Link>
        </p>
      </section>

      {/* ── F6 「ZONE 27 不做」 declarative-absence strip ────────────
          Round 33 W-B · agent A 帶回 top success pattern across 13 niche
          subscription wins(Stratechery「no ads」 · Defector「no PE no
          billionaire」 · Aftermath「worker-owned」)+ ZONE 27 既有
          [[feedback-zone27-pratfall-brand-ip]] · 「declarative absence
          is brand moat(Aronson 1966 + Spence 1973 costly signaling)」。
          Codify 5 redlines 物理 visible on home · 1 hr ship · 0 hr/wk ·
          permanent brand asset · differentiation 對 玩運彩 / 報馬仔 /
          LINE 老師生態 instant clarity。 5 items 為 ConfidenceStars(W-A)
          的 inverse twin:「我們不是 sportsbook」 declarative。
          Round 38 W-I · Agent C P3 ship · 「不分潤博彩」 加 escape hatch
          link 到 /learn#why-not-gambling · P3 casual visitor 不再 dead-
          end declaration · 而是 clickable explainer。

          Round 50 W-C · 2026-05-22 evening · Tim 26+ canary fire 高情緒
          push「點出來的頁面都是無關緊要的」 surface 真實 funnel-order
          bug · F6 strip 從 hero 下方 移到 THE ENGINE section 之後 ·
          per Hick's Law deeper formulation:訪客 first-touch 必須是
          PRIMARY product moment · 不是 brand declaration。 fan filter-in
          先見 prediction(THE ENGINE)· 賭徒 filter-out 後看到「不做」
          declarative redline · 兩端 funnel 同時改善 · brand-IP 0 修改 ·
          純 JSX 重 order。 declarative-absence 仍 first-fold below(若
          訪客 scroll 不到 = anyway 不是 audience)· 對齊
          [[feedback-zone27-audience-fans-not-engineers]] axiom。 */}
      <section className="mx-auto max-w-3xl px-6 sm:px-10 pb-12 sm:pb-16 text-center border-t border-line/40 pt-12 sm:pt-16">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em] mb-3 sm:mb-4"
        >
          / WHAT ZONE 27 DOES NOT DO
        </p>
        <p className="font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.18em] leading-relaxed">
          <span className="text-bone">不顯示賠率</span>
          <span className="text-mute/50 mx-2">·</span>
          <span className="text-bone">不賣明牌</span>
          <span className="text-mute/50 mx-2">·</span>
          <Link
            href="/learn#why-not-gambling"
            className="text-bone underline decoration-mute/40 underline-offset-4 hover:decoration-gold hover:text-gold transition-colors"
          >
            不分潤博彩
          </Link>
          <span className="text-mute/50 mx-2">·</span>
          <span className="text-bone">不藏 DIVERGED</span>
          <span className="text-mute/50 mx-2">·</span>
          <span className="text-bone">不追蹤您</span>
          <span className="text-mute/50 mx-2">·</span>
          <span className="text-gold">不等 Q3</span>
        </p>
        <p className="mt-3 font-mono text-mute/60 text-[9px] sm:text-[10px] tracking-[0.28em] leading-relaxed">
          NO ODDS · NO LOCK · NO AFFILIATE · NO HIDDEN MISSES · 0 TRACKERS · <span className="text-gold/80">NO WAITING</span>
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
