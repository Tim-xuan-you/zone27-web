import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroLiveCard from "@/components/HeroLiveCard";
import TonightReceiptsCard from "@/components/TonightReceiptsCard";
import DailyReturnRail from "@/components/DailyReturnRail";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import RecentMatchesRow from "@/components/RecentMatchesRow";
import AnonCalibrationStrip from "@/components/AnonCalibrationStrip";
import AnonPickWidget from "@/components/AnonPickWidget";
import LivingCoverHero from "@/components/LivingCoverHero";
import HomepageGameThreadPreview from "@/components/HomepageGameThreadPreview";
import {
  getFeaturedMatch,
  getTodayMatches,
  getTrackRecordStats,
} from "@/lib/matches";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
  FOUNDERS_CLAIMED,
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
//   ▸ Cmd-K / Ctrl-K palette(54 visitor-discoverable routes indexed)
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
  // R115 W3 · per Tim 2026-05-25 dogfood「一般使用者一進來,從來沒來過的人,
  // 也能看到有人分享、推薦賽事?」 social proof gap · agent research synthesize
  // (Defector annual report + Plausible 3-stat row + Berkshire letters archive
  // + Patek Generations + patio11 archive + Pinboard operator quote + Apple
  // 「Designed in California」 signature pattern)· brand-IP-pure social proof
  // = engine track record ledger · NOT testimonial / NOT live FOMO / NOT
  // 「X 人在看」 · 「0 hidden」 is the killer line per agent unique-opportunity
  // (competitors structurally 無法 match · 因為他們業務 model 需要藏 misses)。
  const heroTrackRecord = getTrackRecordStats();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">

      {/* ── HERO · R82 RADICAL CUT(per Tim「太複雜」 founder-dogfood
          canary fire · Apple iPhone product page pattern · 1 screen 1 thing)

          Cut(R82 simplification per founder-dogfood-canary trump):
          ❌ kicker line「AI 量化棒球引擎 · QUANTITATIVE BASEBALL AI ·
             EST. 2026」(engineer-grammar · move to Footer)
          ❌「信號強度 5★ → 1★ COIN-FLIP」 jargon → 「對了/錯了 全公開」 plain
          ❌「公開可驗證 · 不收下注佣 · 不推薦投注」 regulatory line →
             move to Footer(brand IP 仍 surface · 但 hero 不 carry)
          ❌「270 = Tim 一年親手 sign-off 上限」 filter line → only on
             /founders page(per pratfall-brand-ip 守住 · 但 hero 不 carry)

          Kept(brand IP 守住 per pratfall axiom):
          ✓ H1 slogan「不靠直覺, 只看演算法。」
          ✓ Cold Gold Hairline signature
          ✓ EN slogan「WE DON'T GUESS. WE COMPUTE.」
          ✓ Founders 27 CTA pill
          ✓ ↓ 今晚的引擎 scroll hint

          Apple/Stripe/Linear precedent: hero = 1 brand statement +
          1 primary CTA + 1 secondary action. No philosophy. No
          regulatory disclaimer. No filter copy. Those live deeper. */}
      <section className="mx-auto max-w-4xl px-6 sm:px-10 pt-12 sm:pt-32 pb-10 sm:pb-20 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          不靠直覺,
          <br />
          <span className="text-gold">只看演算法。</span>
        </h1>
        <div className="zone27-rule mx-auto max-w-[280px]" aria-hidden="true" />

        <p
          lang="en"
          className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-5 sm:mt-8"
        >
          WE DON&apos;T GUESS. WE COMPUTE.
        </p>

        {/* R121 W1+W3 · NEW value prop one-liner per Tim 第二級 founder-dogfood-canary
            fire(R32 W-C precedent)· Tim 自己 R121 問「我們的網站到底能幹嘛 ·
            有何優點 · 有本錢收費」 → founder cannot articulate own value prop
            = homepage value prop 沒 land for founder himself · per Stripe
            (「Payments infrastructure for the internet」)/ Plausible(「Simple
            and privacy-friendly Google Analytics alternative」)/ Linear(「Built
            for the world's best teams」)/ Defector(「Worker-owned · ad-free」)
            pattern · world-class brands 都有 crystal-clear ONE-sentence
            「what we are + why different」 在 hero 顯示 · ZONE 27 之前 只有
            H1 philosophy slogan + 行動 subtitle · 缺 category-defining
            one-liner · 此 NEW line 補。 brand IP triple-fire: Disclosure(公開)
            + Pratfall(不藏結果)+ 倒置 SaaS(不抽下注分成 vs 玩運彩+報馬仔
            業務 model 直接 OR 間接 來自 sportsbook conversion fee)。 */}
        {/* R125 W4 · sharpen value prop with sharp differentiator per R125 agent
            killer insight · 「Every other gambling/tipster site in Taiwan charges
            for engine access · ZONE 27 is the only one that doesn't」 · 加
            「不收明牌費」 直接對標 玩運彩 / 報馬仔 / LINE 老師 業務 model · per
            [[feedback-zone27-paid-model-is-support-not-features]] memory「Engine
            FREE 是 paid tier 的賣點 · NOT 削弱付費價值」 axiom 物理 codify。 */}
        <p className="mt-5 sm:mt-7 max-w-xl mx-auto text-bone leading-relaxed text-base sm:text-lg font-light">
          公開的 CPBL 量化引擎 · <span className="text-gold">不藏結果</span> ·{" "}
          <span className="text-gold">不抽下注分成</span> ·{" "}
          <span className="text-gold">不收明牌費</span>。
        </p>

        <p className="mt-3 sm:mt-4 max-w-md mx-auto text-mute leading-relaxed text-sm sm:text-base">
          今晚 CPBL · 我跑 1 萬次模擬給您看 · 對了 / 錯了 全進 ledger。
        </p>

        {/* R142 W8 · TONIGHT micro-receipt above-the-fold · Agent C R142 TOP
            friction-point fix · Picture Superiority Effect(Paivio 1971「Imagery
            and Verbal Processes」+ Nelson/Reed/Walling 1976「Pictorial superiority
            effect」 JEP:HLM 2(5):523-528)· 65% retention concrete numbers vs
            ~10% declarative text after 72h · 之前 hero 6 stacked text blocks
            push prediction below mobile fold · CPBL fan at 18:00 wants ONE thing
            「今晚誰會贏」 但 must scroll 750-900px on iPhone 13 mini to see ·
            INSERT 1-line above-fold micro-receipt · reuse existing todayMatches
            (line 110)· 0 new fetch · 0 new feature(per [[feedback-zone27-
            paid-model-is-support-not-features]])· real engine % NOT fake social
            proof · hides gracefully when 0 matches today · click → #tonight-engine
            anchor scroll · 對 CPBL fan = instant proof「ZONE 27 talks baseball
            不是 philosophy」 · per Tim「整個網站的操作邏輯、人的心理學很重要」
            mandate canonical fulfillment。 */}
        {todayMatches.length > 0 && (
          <p className="mt-4 sm:mt-5 mx-auto">
            <Link
              href="#tonight-engine"
              className="inline-flex items-baseline gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] tabular text-mute hover:text-bone transition-colors flex-wrap justify-center"
              aria-label={`Tonight's first CPBL match · ${todayMatches[0].startTime} · ${todayMatches[0].home.name} engine ${todayMatches[0].home.winRate}% vs ${todayMatches[0].away.name} ${todayMatches[0].away.winRate}% · scroll to engine detail`}
            >
              <span className="text-gold/85">今晚 {todayMatches[0].startTime}</span>
              <span className="text-mute/60">·</span>
              <span className="text-bone">{todayMatches[0].home.en}</span>
              <span className="text-gold">{todayMatches[0].home.winRate}%</span>
              <span className="text-mute/60">vs</span>
              <span className="text-bone">{todayMatches[0].away.en}</span>
              <span className="text-mute">{todayMatches[0].away.winRate}%</span>
              {todayMatches.length > 1 && (
                <span className="text-mute/60">{`+ ${todayMatches.length - 1} 場`}</span>
              )}
              <span className="text-gold/70 ml-0.5">↓</span>
            </Link>
          </p>
        )}

        {/* R150 W1 · Tim 9-fire same canary · 賽事討論室 hero pill same axis
            as Founders 27 pill · viewport 1 永遠 visible · NOT buried · per
            Tim explicit「(賽事討論室)到底在哪裡? 大家都可以看到? 在首頁?
            簡易點擊?」 demand · BLACK CARD-gated brand IP 維持 per R148
            6 constraints minimum-violation · per [[feedback-no-waiting-rule]]
            ship NOW · per Tim 8-9 fire pattern reach apex 必須 hero-level
            visibility 不再 inline strip。 */}
        <p className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/founders"
            className="inline-block px-5 py-2.5 border border-gold/40 hover:border-gold hover:bg-gold/5 transition-colors font-mono text-xs sm:text-sm tracking-[0.2em] tabular"
            aria-label={`Founders 27 · NEXT IS #${FOUNDERS_CLAIMED + 1} of ${FOUNDERS_TOTAL} · 永不再開`}
          >
            <span className="text-gold">FOUNDERS · 27</span>
            <span className="text-mute/60 mx-2">·</span>
            <span className="text-bone">{FOUNDERS_REMAINING}</span>
            <span className="text-mute/60">/{FOUNDERS_TOTAL}</span>
            <span className="text-mute/60 mx-2">·</span>
            <span className="text-mute">NT$ 2,700 終身</span>
            <span className="text-gold/70 ml-2">→</span>
          </Link>
          <Link
            href={`/matches/${todayMatches[0]?.id ?? "cpbl-260526-01"}#game-thread`}
            className="inline-block px-5 py-2.5 border border-gold/40 hover:border-gold hover:bg-gold/5 transition-colors font-mono text-xs sm:text-sm tracking-[0.2em] tabular"
            aria-label="賽事討論室 · BLACK CARD-gated · R148 NEW · scroll to game thread scaffold"
          >
            <span className="text-gold">💬 賽事討論室</span>
            <span className="text-mute/60 mx-2">·</span>
            <span className="text-bone">BLACK CARD</span>
            <span className="text-loss/70 ml-2 text-[10px]">⏳ R148</span>
            <span className="text-gold/70 ml-2">→</span>
          </Link>
        </p>

        {/* R115 W3 brand-IP-pure social proof line · per agent research
            unique opportunity「0 hidden」 = engine PROVED + DIVERGED + 0 hidden
            · 同 Plausible「260B pageviews · 18k subs · 99.99% uptime」 static
            3-stat row pattern · NOT live ticker · NOT FOMO counter · 「0 hidden」
            是 unfakeable costly signal · 競爭者(玩運彩 / 報馬仔)結構性無法
            match 因為他們業務 model 需要藏 misses · Pratfall + Costly Signaling
            + Disclosure axiom 三 fire 同時 · 8 chars 數字 compressed brand IP。
            R121 W2 · Tim 第二級 founder-dogfood-canary fire 升級 · Tim R121
            問「我一進這個網站,看不到有人在討論、分享、推薦賽事呀!以心理學角度
            怎麼看?」 · Cialdini 1984 Social Proof psychology 期待 vs ZONE 27
            11-NEVER #1(no user-to-user social)brand IP 結構性衝突 surfacing ·
            per [[feedback-zone27-social-proof-costly-signal]] axiom · brand-pure
            答案 = explicitly preempt psychology gap + redirect to unfakeable
            costly signal(Spence 1973)NOT 加 fake social proof · 此 line 從
            「↘ TRACK RECORD」 改 「↘ 不靠社群聲量 · 靠 ledger」 · framing
            absence as brand IP strength · 同時保留 numbers · 配對 R120 W3
            /engine-log#live-state numeric dashboard hash anchor。 */}
        {heroTrackRecord.total > 0 && (
          <p className="mt-4 sm:mt-5">
            <Link
              href="/track-record"
              className="inline-flex items-baseline gap-2 font-mono text-mute/85 hover:text-gold text-[10px] sm:text-[11px] tracking-[0.25em] tabular transition-colors"
              aria-label={`不靠社群聲量 · 靠 ledger · ${heroTrackRecord.proved} PROVED · ${heroTrackRecord.diverged} DIVERGED · 0 hidden · 查看 /track-record 完整 ledger`}
            >
              <span className="text-gold/80">↘ 不靠社群聲量 · 靠 ledger</span>
              <span className="text-gold">{heroTrackRecord.proved}</span>
              <span className="text-mute/60">✓</span>
              <span className="text-mute/40">·</span>
              <span className="text-loss/80">{heroTrackRecord.diverged}</span>
              <span className="text-mute/60">✕</span>
              <span className="text-mute/40">·</span>
              <span className="text-gold">0</span>
              <span className="text-mute/60">hidden</span>
              <span className="text-gold/70 ml-1">→</span>
            </Link>
          </p>
        )}

        {/* R123 W1 · Tim 第三級 founder-dogfood-canary fire · Tim 問「使用者
            怎麼互動?都是單向的不是嗎?哪裡可以互動?」 · per
            [[feedback-zone27-one-way-by-design]] memory · 8 user interaction
            surfaces 早已 ship 但 invisible to first-time visitor · 加 visible
            actionable strip 列 4 個主要 verbs · 直接答「哪裡可以互動」 ·
            brand IP one-way by design 守(reader↔writer NOT reader↔reader)·
            同 Stratechery / Bloomberg / Buffett / Defector profitable
            subscription model · 11-NEVER #1 全程 honored · NOT 加 community
            / comments / forum · ONLY surface existing interactions。 */}
        <p className="mt-3 sm:mt-4 font-mono text-mute/85 text-[10px] sm:text-[11px] tracking-[0.22em] tabular leading-relaxed">
          <span className="text-gold/80">⚡ 您可以</span>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/lab"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /lab 跑模擬
          </Link>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/matches"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /matches 猜對賬
          </Link>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/member/submit"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /member 投稿
          </Link>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/founders/apply"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /founders/apply 申請席位
          </Link>
          <span className="text-mute/40 mx-1.5">·</span>
          {/* R143 W2 · cross-link to canonical /interact route · Tim 3rd
              same canary fire(R123 + R139 + R143「討論區在哪裡」)response ·
              /interact enumerates 10 reader↔writer surfaces + explains
              one-way by design · per Cialdini Consistency 1984 + Pirolli &
              Card 1995 Information Foraging Theory · brand IP iron rule
              preserved + discoverability gap fixed。 */}
          <Link
            href="/interact"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /interact 看 10 互動通道
          </Link>
        </p>

        {/* R144 W1 · NEW homepage community strip · Tim 5th-fire same canary +
            explicit homepage demand「我在網站首頁就要能直接大家看到可以討論
            的地方 · 大家熱絡的地方」 · brand-pure 2-lane answer surface · per
            Reference Class Anchoring(Tversky & Kahneman 1974)球迷已用 LINE 看
            球 → ZONE 27 是 publication · LINE 是 community 並存 · per Mere
            Exposure Effect(Zajonc 1968)顯式 cite 既有球迷聚集地 normalizes
            ZONE 27 alongside · per Pratfall Effect(Aronson 1966)顯式承認
            「我們不 host community」 + point at 球迷已聚的地方 · per Information
            Foraging Theory(Pirolli & Card 1995 Psychological Review 106(4):
            643-675)reduce search cost · 您找 community 0-click 看到 2 lanes ·
            brand IP iron rule preserved · all infrastructure OFF-SITE(LINE +
            FB + PTT not on ZONE 27 web)· Lane 1 inner circle Founders 27
            LINE 群 · Lane 2 既有 CPBL 球迷聚集 LINE/FB/PTT。 */}
        <p className="mt-3 sm:mt-4 font-mono text-mute/85 text-[10px] sm:text-[11px] tracking-[0.22em] tabular leading-relaxed">
          <span className="text-gold/80">💬 球迷熱絡的地方</span>
          <span className="text-mute/40 mx-1.5">·</span>
          <span className="text-mute">Founders 27 LINE 群</span>
          <span className="text-loss/70 mx-1 text-[9px]">⏳ Q3</span>
          <span className="text-mute/40 mx-1.5">·</span>
          <span className="text-mute">球迷已聚(LINE/FB/PTT)</span>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/interact"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /interact 全 lanes
          </Link>
        </p>

        {/* R155 W2 cut-1+4 · per Agent B mobile 3-viewport audit · MERGED R146 W1
            「🤔 為何沒有」 + R148 W2「💬 賽事討論室 LIVE」 into 單一 strip ·
            「為何沒有 X · 但 LIVE Y」 contrastive grammar · per [[feedback-zone27-
            mobile-first]] ≤3 viewports compaction · iron rules preserved · R148
            narrowed scope GameThread still surfaced at homepage layer · R146 Pratfall
            meta-business honesty preserved · ALSO removed standalone「↓ 今晚的引擎」
            chip(line 213 micro-receipt #tonight-engine anchor 已 provide path)· ~80px
            saved per Agent B iPhone SE measurement(R142 hero micro-receipt + sticky
            CTA + Founders pill 3 paths still reach engine + GameThread)。 */}
        <p className="mt-2 sm:mt-3 font-mono text-mute/85 text-[10px] sm:text-[11px] tracking-[0.22em] tabular leading-relaxed">
          <span className="text-loss/85">🤔 為何沒有</span>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/faq#no-user-recommendations"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            用戶推薦賽事
          </Link>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/faq#no-commission"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            抽傭 commission
          </Link>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/faq"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /faq 全 17 答
          </Link>
          <span className="text-mute/40 mx-1.5">⚓</span>
          <span className="text-gold/80">💬 賽事討論室 LIVE</span>
          <span className="text-mute/40 mx-1.5">·</span>
          <Link
            href="/matches/cpbl-260526-01#game-thread"
            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /matches/[gameId]
          </Link>
        </p>
      </section>

      {/* Hairline divider — visual breath. Tighter on mobile. */}
      <div className="mx-auto w-32 gold-line mb-8 sm:mb-20" />

      {/* R149 W1 · NEW HomepageGameThreadPreview · Tim 8-fire explicit
          「(賽事討論室)大家都可以看到! 到底在哪裡? 可以直接出現在首頁
          可以讓人簡易點擊?」 · /matches/[gameId] 30-sec scroll 太深 ·
          ship BIG visible homepage section · gold-border card · 1 mockup
          post + big CTA「→ 看完整 賽事討論室 + 3 mockup posts」 · 自由可讀
          + BLACK CARD 可發言 · per R148 6 constraints minimum-violation
          preserved · per [[feedback-no-waiting-rule]] ship NOW · per
          [[feedback-zone27-mobile-first]] trade-off for Tim 8-fire
          explicit demand · 0-click 顯式 visible on homepage 不再 buried。 */}
      <HomepageGameThreadPreview match={todayMatches[0] ?? null} />

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
        {/* R97 W2 · LivingCoverHero · Stripe Press signature pattern · 算法
            生成 SVG sparkline · 永遠 render 引擎活著的 visual proof · 0 JS ·
            0 animation · deterministic per match.id / build date · 同 Anthropic
            interactive model card visual signature axis。 */}
        <LivingCoverHero
          match={featuredMatch ?? todayMatches[0] ?? undefined}
          className="mb-6 sm:mb-8 -mt-2 sm:-mt-4"
        />

        {useMultiMatch && trackRecord ? (
          <TonightReceiptsCard
            matches={todayMatches}
            trackRecord={trackRecord}
          />
        ) : featuredMatch ? (
          <>
            {/* R86 W-A · Surface AnonPickWidget on homepage as「我 vs
                引擎」 visceral feedback loop · per Tim 「使用者要看 AI
                答案 + 其他使用者明牌」 brand-pure replacement(NOT 違反
                11 NEVER #1 social-leaderboard · 是 personal calibration
                mirror per Bill James「Hey Bill」 + FiveThirtyEight
                pattern)· localStorage · 0 PII · 0 server · IKEA effect
                retention loop · 訪客 first-touch 立刻 click 「我選 X」
                → 看 engine number 對照 · 來日看自己 PROVED/DIVERGED
                track record。 已 R45 W-B ship on /matches/[gameId] ·
                R86 surface 升 homepage hero conversion path · 同 brand
                IP「Engine FREE + visitor calibration mirror」 axis。
                ClientErrorBoundary wrap per R73 W-A risk-bearing client
                pattern · TZ edge / localStorage quota crash 不 take
                down homepage。 */}
            <ClientErrorBoundary fallbackLabel="AnonPickWidget · homepage pick">
              <div className="mb-6 sm:mb-8">
                <p className="font-mono text-gold/70 text-[10px] sm:text-[11px] tracking-[0.3em] mb-2 text-center">
                  ↓ 先猜再看引擎 · IKEA effect
                </p>
                <AnonPickWidget match={featuredMatch} />
              </div>
            </ClientErrorBoundary>
            <HeroLiveCard match={featuredMatch} />
          </>
        ) : (
          <EmptyHeroCard />
        )}

        {/* R70 W-B · DailyReturnRail · Agent A R69 SHIP 2 deferred ·
            Letterboxd diary + Are.na slow-web + Pinboard.in 「your last
            login: X days ago」 pattern · honest past-tense check-in for
            returning visitors · NOT streak counter · NOT daily-login
            farming · localStorage zone27_last_visit_v1 11th key · /audit
            S06 disclosed · 不打擾就是禮物 axiom 物理 codify。 conditional
            render(first-time + same-day return = empty)。
            R73 W-A · ClientErrorBoundary wrap · TZ edge / localStorage
            quota crash 不 take down homepage · 同 risk pattern as
            /matches/[gameId] AnonPickWidget+LensFocusVote wraps。 */}
        <ClientErrorBoundary fallbackLabel="DailyReturnRail · return chip">
          <DailyReturnRail />
        </ClientErrorBoundary>

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

      {/* F6 declarative-absence strip · 6 brand-IP negations · pratfall axiom
          protected · compressed per 3-viewport rule (R95)。 */}
      <section className="mx-auto max-w-3xl px-6 sm:px-10 pb-10 sm:pb-14 text-center border-t border-line/40 pt-10 sm:pt-12">
        <p className="font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.18em] leading-relaxed">
          <span className="text-bone">不顯示賠率</span>
          <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
          <span className="text-bone">不賣明牌</span>
          <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
          <Link
            href="/learn#why-not-gambling"
            className="text-bone underline decoration-mute/40 underline-offset-4 hover:decoration-gold hover:text-gold transition-colors"
          >
            不分潤博彩
          </Link>
          <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
          <span className="text-bone">不藏 DIVERGED</span>
          <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
          <span className="text-bone">不追蹤您</span>
          <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
          <span className="text-gold">不自動續扣</span>
        </p>
        <p className="mt-4 font-mono text-[10px] sm:text-[11px] tracking-[0.3em]">
          <Link
            href="/transparency"
            className="text-gold/80 hover:text-gold underline decoration-mute/40 underline-offset-4 hover:decoration-gold transition-colors"
          >
            完整 audit · /transparency →
          </Link>
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
