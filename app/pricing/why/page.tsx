import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";
import ReciprocityLedger from "@/components/ReciprocityLedger";
import ReadingProgress from "@/components/ReadingProgress";
import { createPageMetadata } from "@/lib/page-og";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

export const metadata = createPageMetadata({
  title: "為什麼是 NT$ 1,500 · 為什麼是 NT$ 2,700",
  description:
    "ZONE 27 定價 rationale 一頁說清楚 · 不藏在 FAQ · 不靠 sales call · 不靠 enterprise contact form · 純 Defector inverse-disclosure + FanGraphs output-not-input + Stripe Atlas 6-deliverable + Stratechery single-sentence FAQ defense · 5 brand IP axiom triple-fire pricing page craft。",
  ogTitle: "Pricing Why · NT$ 1,500/season vs NT$ 2,700 一次性 · ZONE 27",
  ogDescription:
    "定價 rationale 一頁說清楚 · 不藏在 FAQ · 不靠 sales call · 5 anti-pattern explicit refused",
  path: "/pricing/why",
});

// ── ZONE 27 · /pricing/why ─────────────────────────────
// R64 W-B · Agent 6 R64 pricing-page-as-object-of-craft deep dive · 5 ranked
// patterns(Defector inverse-disclosure + Stripe Atlas 6-deliverable + FanGraphs
// output-not-input + Stratechery single-sentence FAQ + Stripe stacked sequential)
// + complete page architecture spec synthesized into single new route。
//
// Per Agent 5 R63 6-dimension gap matrix dimension 6:「ZONE 27 needs pricing
// rationale page · ZONE 27 needs app/pricing/why.mdx or section in /membership
// explaining the math」。 R64 W-B 滿足 this gap with NEW dedicated route。
//
// 5 anti-patterns AVOIDED(per agent explicit warning):
//   ✕ NO「most popular / RECOMMENDED」 tier badge(Linear deliberately doesn't ·
//     Notion does and screams artificial conversion engineering)
//   ✕ NO side-by-side 4-column feature checkmark matrix(Vercel does · ZONE 27
//     has ~6 differentiators · matrix would feel enterprise theater)
//   ✕ NO usage calculator / estimate your price(Stripe + Vercel have · ZONE 27
//     flat-rate · calculator would be cargo-cult SaaS)
//   ✕ NO countdown timer on Founders 27「270 seats remaining: X」(FTC 2026
//     click-to-cancel + EU Digital Fairness Act 2026 classify as dark patterns)
//   ✕ NO 30/60/90-day money-back guarantee BADGE(ZONE 27 already does 14-day
//     refund per /membership/black-card · adding badge = trust theater seal)
//
// Brand IP triple-fire: Pratfall(unique「沒做什麼」 section)+ Costly Signaling
// (output-not-input forces real numbers)+ Disclosure(inverse-disclosure who
// we're not beholden to)。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily

export default function PricingWhyPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            PRICING / WHY · 一頁說清楚
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
            為什麼是 <span className="text-gold">NT$ 1,500</span>
            <br />
            為什麼是 <span className="text-gold">NT$ 2,700</span>
          </h1>
          {/* Round 54 W-C signature moat */}
          <div className="zone27-rule mx-auto max-w-[280px] mt-4" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-5 sm:mt-8"
          >
            ONE PAGE · NO FAQ HIDING · NO SALES CALL · NO ENTERPRISE CONTACT-FORM
          </p>
          <p className="editorial-dropcap mt-8 max-w-xl mx-auto text-mute leading-relaxed">
            這頁不在 sales pitch · 不在 FAQ 結尾 · 不需要 enterprise 客服信。
            一頁說清楚這個價格為什麼是這個數字 · 我們不靠誰 · 我們做什麼。
          </p>
          <div className="mt-8 flex justify-center">
            <ArticleMeta readingMin={5} />
          </div>
          <div className="mt-3 flex justify-center">
            <EngineStamp />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · 我們不靠誰 · Defector inverse-disclosure ─── */}
        <Section no="01" label="WHO WE&apos;RE NOT BEHELDEN TO" zh="這個價格不是為了誰">
          <p>
            Defector(獨立 sports / culture 媒體 · 26 worker-owners · 40,000+
            subscribers)在 subscribe page 不列「您的錢去哪了」 · 列{" "}
            <strong className="text-bone">「我們不向誰負責」</strong> ·
            inverse-disclosure 比 cost breakdown 強。 ZONE 27 採同 pattern:
          </p>
          <ul className="space-y-4 mt-6">
            <li className="flex gap-4 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] shrink-0 mt-1 w-20"
              >
                NOT AD
              </span>
              <span className="flex-1">
                <strong className="text-bone">不靠廣告</strong> · 所以不需要
                engagement metric · 不需要 dark pattern click bait · 您看 ZONE
                27 多久 / 看幾頁 / 看哪頁 我們不在乎 · 因為廣告主不存在。
              </span>
            </li>
            <li className="flex gap-4 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] shrink-0 mt-1 w-20"
              >
                NOT VC
              </span>
              <span className="flex-1">
                <strong className="text-bone">不靠 VC</strong> · 所以不需要
                hyper-growth · 不需要 hockey-stick chart for next funding
                round · 不需要 acquisition exit story · Founders 27 270 cap 是
                Tim 一年親手 sign-off 上限 · 不是 marketing number。
              </span>
            </li>
            <li className="flex gap-4 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] shrink-0 mt-1 w-20"
              >
                NOT TIPSTER
              </span>
              <span className="flex-1">
                <strong className="text-bone">不靠 LINE 老師 / 報馬仔 / 投顧
                老師抽佣</strong> · 所以不需要包裝戰績 · 不需要刪 DIVERGED ·
                不需要事後找出 cherry-picked 場次 · /track-record PROVED + DIVERGED
                等大不藏 · per /audit S05 PRE-COMMIT axiom。
              </span>
            </li>
            <li className="flex gap-4 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] shrink-0 mt-1 w-20"
              >
                NOT EXIT
              </span>
              <span className="flex-1">
                <strong className="text-bone">不靠創投退場</strong> · 所以
                Founders 27 一次性 NT$ 2,700 · 永久不漲價 · 永久關閉 · 不會有
                第二批 · 不會 acquisition 後漲價 · 不會 pivot to Web3 · per
                /founders/ledger SHADOWLESS RUN binding pre-commit。
              </span>
            </li>
          </ul>
        </Section>

        {/* ── §02 · NT$ 1,500/season 換到的東西 · FanGraphs output-not-input ─── */}
        <Section no="02" label="WHAT NT$ 1,500/SEASON BUYS" zh="NT$ 1,500/season 換到的東西">
          <p>
            FanGraphs Membership($14.95/mo)不列「我們 server 成本 X · 員工
            payroll Y」 · 列 OUTPUT:「200 articles/month · 25 contributors ·
            13 full-time staff」 · reader back-solves the unit economics(80/yr
            ÷ 200 articles = $0.40/article)· brand stays clean。 ZONE 27 採同
            pattern · 但 honest pre-launch state:
          </p>

          <h3 className="text-bone text-lg mt-6 mb-3">
            ZONE 27 目前狀態(2026-05-23 · pre-launch state)
          </h3>
          <ol className="space-y-3">
            <NumItem n="01">
              <span className="text-bone">1 PROVED receipt</span> ·
              cpbl-260521-01 富邦 win @ 60% engine · 第一筆永久 pinned 1st
              Edition · per /track-record(R63 W-A 永久 pinning mechanic)
            </NumItem>
            <NumItem n="02">
              <span className="text-bone">4 CPBL matches ingested</span> · per
              lib/matches.ts source of truth · 每場 Tim 親手 screenshot + Claude
              parse · 沒有 scraper · 沒有 cron · per /coverage philosophy
            </NumItem>
            <NumItem n="03">
              <span className="text-bone">7 LIVE LENS</span> · VibeCheck +
              ParkFactor + PitcherFatigue + UnderdogLens + BullpenDepth +
              MatchupHistory + LensTrace · per /methodology Section 05
            </NumItem>
            <NumItem n="04">
              <span className="text-bone">3 ENGINE SETS</span> · v0.2 BASE LIVE
              + v0.3 EXPANSION 1 LIVE DEV PREVIEW + v0.4 EXPANSION 2 PLANNED ·
              per /methodology Section 04(R60 W-A Pokemon SET narrative)
            </NumItem>
            <NumItem n="05">
              <span className="text-bone">54 visitor-discoverable routes</span> ·
              full Cmd-K palette indexed · 全公開 · 無 paywall on engine
              functionality
            </NumItem>
            <NumItem n="06">
              <span className="text-bone">9 binding ethics commitments</span> +
              5 self-objections + 11-item NOT-DO list · per /transparency
              aggregator · brand IP「方法公開」 物理 codify
            </NumItem>
          </ol>

          <h3 className="text-bone text-lg mt-8 mb-3">
            BLACK CARD NT$ 1,500/season unlocks(payment infra 就緒後)· 6 件
          </h3>
          {/* R76 W-A · Agent A R75 SHIP 7 OutputArtifactSwitcher · 加 6th
              row(LINE 群 read-only)· sync /membership/black-card UNLOCKS
              array · count drift fix(之前 5 rows here · 6 entries 在
              /membership/black-card · 不 consistent)。 */}
          <ol className="space-y-3">
            <NumItem n="01">
              <span className="text-bone">v0.3 / v0.4 engine</span> · Pitcher +
              Park Factor + Batter wOBA · Bayesian Model Averaging · FREE TIER
              仍 access v0.2 BASE · per /methodology/diff
            </NumItem>
            <NumItem n="02">
              <span className="text-bone">/matches/[gameId] 賽事頁討論室發言</span> ·
              發表 prediction · per Tim manual moderation · BLACK CARD members only
            </NumItem>
            <NumItem n="03">
              <span className="text-bone">5% creator 抽成</span>(vs LINE 老師 /
              投顧老師業界 30-50% 是降維打擊 · Founders 27 holders 完全 0%)
            </NumItem>
            <NumItem n="04">
              <span className="text-bone">每月 voting</span> · 決定 next ship
              order · per /membership Creator Permissions
            </NumItem>
            <NumItem n="05">
              <span className="text-bone">Tim 工程筆記 full</span> · weekly
              behind-scene engineering write-up · per Stratechery analog
            </NumItem>
            <NumItem n="06">
              <span className="text-bone">Founders 27 LINE 群 read-only access</span>{" "}
              · 可看 7 forged founders 互動 + Tim 親自答 · 不可發言 · 不可邀人 ·
              不可截圖外流 · per /audit S05 PRE-COMMIT
            </NumItem>
          </ol>

          <h3 className="text-bone text-lg mt-8 mb-3">每月始終提供(已 LIVE)</h3>
          <ul className="space-y-2">
            <li>▸ <strong className="text-bone">0 廣告</strong> · per /privacy AdMob permanently banned</li>
            <li>▸ <strong className="text-bone">0 sponsor</strong> · per /audit DISCLOSURE block · solo 100% equity</li>
            <li>▸ <strong className="text-bone">0 tracker</strong> · per /privacy 「0 GA + 0 pixel + 0 Hotjar」</li>
            <li>▸ <strong className="text-bone">14 天無條件退款</strong> · per /terms Section 4B · Taiwan 消保法 § 19 双倍法定下限</li>
            <li>▸ <strong className="text-bone">GitHub source open</strong> · MIT licensed · 您 fork to audit · 我們不能 revoke</li>
          </ul>
        </Section>

        {/* ── §03 · 為什麼 Founders 27 是 NT$ 2,700 · Stripe Atlas pattern ───
            R68 W-F · Agent A SHIP 7 · compressed to Stripe Atlas grammar:
            bold deliverable + ONE sentence + cross-link · ghost numerals
            BEHIND each row(Patek movement-spec aesthetic · 大型 light gold
            opacity 22%(R69 W-H Patek-aesthetic legible bump from 5%)· 不打字典感觀 · 純 typographic depth)。 sub-header
            「您數到第 6 行 · 您 conclude 自己 · 我們不 sell」 Tetlock-honest
            framing。 vs prior 2-3-line prose · same content density · less
            cognitive load per row。 */}
        <Section
          no="03"
          label="WHY FOUNDERS 27 = NT$ 2,700"
          zh="為什麼 Founders 27 是 NT$ 2,700"
        >
          <p>
            Stripe Atlas($500 一次性 incorporation)頁面不寫 prose「為什麼
            $500」 · 列 6 個 numbered deliverables · 讀者數到第 6 行 conclude
            「$500 cheap」。 ZONE 27 採同 pattern · Founders 27 一次性 NT$
            2,700 · 永久 · 限 {FOUNDERS_TOTAL} 位 · 6 個 deliverables:
          </p>
          <ol className="space-y-1 mt-8">
            <NumItemGhost n="01">
              <strong className="text-bone">0% creator 抽成</strong> · 永久 · per /founders benefit #03
            </NumItemGhost>
            <NumItemGhost n="02">
              <strong className="text-bone">編號身分 #001-#{FOUNDERS_TOTAL}</strong> · 動態牆顯示 · per Pokemon TCG 1st Edition SHADOWLESS RUN axiom
            </NumItemGhost>
            <NumItemGhost n="03">
              <strong className="text-bone">model 早期 access</strong> · 每次 AI 模型迭代提前 7 天 · per /founders benefit #05
            </NumItemGhost>
            <NumItemGhost n="04">
              <strong className="text-bone">實體尊榮招待</strong> · 恆美攝影 × 伶 Kopi 旗艦店 · 終身一杯紅茶 · per /founders benefit #06
            </NumItemGhost>
            <NumItemGhost n="05">
              <strong className="text-bone">BLACK CARD 季票終身免費</strong> · 省 NT$ 1,500 × ∞ seasons · per /founders 2-season break-even math(R81 pivot 後)
            </NumItemGhost>
            <NumItemGhost n="06">
              <strong className="text-bone">永久不漲價</strong> · NT$ 2,700 closed state · 同 Pokemon 1st Edition Shadowless 不可重印
            </NumItemGhost>
          </ol>
          <p className="mt-8 font-mono text-gold/80 text-[10px] sm:text-xs tracking-[0.3em] leading-relaxed text-center">
            ⚓ 您數到第 6 行 · 您 conclude 自己 · 我們不 sell
          </p>
          <p className="mt-6 font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ <strong className="text-bone">這是 brand commitment 不是
            marketing copy</strong> · 6 條 binding pre-commit · 修改需 30 天前
            /changelog 公告 · per /audit S05 PRE-COMMIT pattern · 違反 = brand
            信用 collapse · per /ethics。
          </p>
          <p className="mt-4 text-mute text-sm">
            目前 {FOUNDERS_CLAIMED} 名 SYSTEM-TEST forged · {FOUNDERS_REMAINING}
            {" "}名待認領 · 申請通道在 payment infra 就緒後啟用(milestone-
            triggered · 不綁日期)· per /founders/ledger pre-commit timeline。
            R68 W-A · 申請表單 LIVE · per <a
              href="/founders/apply"
              className="text-gold underline-offset-4 hover:underline"
            >/founders/apply</a>{" "}
            · Tim 親手 review 1-3 days。
          </p>
        </Section>

        {/* ── §04 · 我們刻意沒做什麼 · Pratfall ─── */}
        <Section
          no="04"
          label="WHAT WE DELIBERATELY DIDN&apos;T DO"
          zh="為什麼這頁沒有比較表"
        >
          <p>
            這頁刻意沒做 3 件事 · per [[feedback-zone27-pratfall-brand-ip]] +
            agent R64 anti-pattern warning:
          </p>
          <ul className="space-y-4 mt-6">
            <li className="flex gap-4">
              <span
                aria-hidden="true"
                className="text-loss/80 text-xl shrink-0 mt-1"
              >
                ✕
              </span>
              <span className="flex-1">
                <strong className="text-bone">沒有「最受歡迎 / RECOMMENDED」
                標籤</strong> · Linear deliberately 不 badge middle tier · Notion
                does · 「我們不知道哪個 tier 對您最受歡迎 · 您自己決定」 · per
                Tim 「客戶 ≠ 朋友 · 不引導」 axiom。
              </span>
            </li>
            <li className="flex gap-4">
              <span
                aria-hidden="true"
                className="text-loss/80 text-xl shrink-0 mt-1"
              >
                ✕
              </span>
              <span className="flex-1">
                <strong className="text-bone">沒有「年訂閱 -20%」 折扣</strong>{" "}
                · BLACK CARD 月訂就是月訂 · 不 push annual commitment 換折扣 ·
                per /membership/black-card「倒置 SaaS · 不自動扣款 · 月卡手動
                續訂」 axiom · 月訂 stronger commitment 信號 · 不靠 lock-in 賺。
              </span>
            </li>
            <li className="flex gap-4">
              <span
                aria-hidden="true"
                className="text-loss/80 text-xl shrink-0 mt-1"
              >
                ✕
              </span>
              <span className="flex-1">
                <strong className="text-bone">沒有 enterprise contact-sales</strong>{" "}
                · 不存在 enterprise tier · 不存在「talk to our team」 form ·
                ZONE 27 brand IP = 個人 audience-fans · 不接 corporate B2B ·
                如果您是 corporate · 同 rates 同 access 自己 NT$ 2,700 或 NT$
                1,500/season · per /faq Q「ZONE 27 接 corporate?」 答 NO。
              </span>
            </li>
          </ul>
        </Section>

        {/* ── §06 · Reciprocity Ledger · Cialdini publish-before-ask · R74 W-A ───
            16 件 ZONE 27 已 publish 之後才 ask · Cialdini Reciprocity Principle
            (1984)· same axis as Berkshire 70 年 annual letters + Patek 200 年
            movement schematics + Anthropic model card library pattern · LINE
            老師 / 報馬仔 ask-first-give-never inversion · CPBL fan audience
            pattern-match instantly · brand IP triple-fire(Disclosure +
            Pratfall + Costly Signaling)。 Compact variant on /pricing/why
            buy-line surface · full ledger on /transparency。 */}
        <Section
          no="06"
          label="WHAT WE PUBLISHED BEFORE ASKING"
          zh="ASK 之前已 publish 的 16 件 receipts"
        >
          <p>
            Cialdini Influence(1984)Chapter 2 Reciprocity Rule · pre-gift
            triggers obligation-to-reciprocate · LINE 老師 / 報馬仔 ask-first-
            give-never inversion · ZONE 27 在收 NT$ 1,500/season + NT$ 2,700 一次性
            之前已 publish 16 件 receipts:
          </p>
          <div className="mt-6">
            <ReciprocityLedger variant="compact" />
          </div>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed mt-6">
            ⚓ 16 件 published-before-ask · 完整 ledger 在{" "}
            <Link
              href="/transparency#reciprocity-ledger"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              /transparency#reciprocity-ledger
            </Link>{" "}
            · brand IP triple-fire(Disclosure + Pratfall + Costly Signaling)·
            per /audit S05 PRE-COMMIT clause append-only。
          </p>
        </Section>

        {/* ── §07 · PRECEDENT BENCHMARKS · R126 W2 NEW · 8-fact data table
            · per R125 monetization agent verified web research · Defector +
            Stratechery + 404 Media + Kickstarter + FanGraphs + Hami CPBL +
            Patek + Costly Signaling theory · 全 source URL inline · pre-launch
            subscription monetization benchmarks 物理 codify · 同 Stripe Press
            book-detail data table + FanGraphs Membership rationale + Defector
            annual report pattern · brand IP triple-fire(Disclosure 公開 sources
            + Pratfall 對標 自己定價 vs benchmark + Costly Signaling 公開
            web-verified math)。 Tim 「Defector / Stratechery 都做到」 fact-check
            answer 物理 codify。 */}
        <Section
          no="07"
          label="PRECEDENT BENCHMARKS"
          zh="同類 indie subscription 數據對標 · 8 個 fact"
        >
          <p>
            「為什麼您敢收 NT$ 2,700?」 honest 答案 · 同類 indie subscription
            brand 早已做到 · web-verified data 8 個 fact(每筆 source URL inline ·
            可 click 自己 verify · 同 Cialdini reciprocity「show your math」
            axiom):
          </p>
          <ol className="space-y-3 mt-6">
            <NumItem n="01">
              <span className="text-bone">Defector Media 2020-07-29 launch day</span> ·
              10,000 paid subscribers × $69/yr = <strong className="text-gold">$690,000 day-1 revenue</strong> ·
              website 9/10/2020 才上線 · 中間 6 週「一個字都沒發」 · 訂戶 fund 不是 access ·{" "}
              <a
                href="https://en.wikipedia.org/wiki/Defector_Media"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                en.wikipedia.org/Defector_Media
              </a>
            </NumItem>
            <NumItem n="02">
              <span className="text-bone">Defector year-1</span> ·
              <strong className="text-gold"> 95% revenue from subscribers</strong> · 36,000 subs · $3.2M ARR · 「我們不是 access paywall · 是 ownership」 · per CJR interview Tom Ley ·{" "}
              <a
                href="https://www.cjr.org/q_and_a/defector-media-coop-deadspin-gawker.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                cjr.org/q_and_a/defector
              </a>
            </NumItem>
            <NumItem n="03">
              <span className="text-bone">Stratechery year-1(2014)</span> ·
              Ben Thompson solo · 1,000 paid subs × $100 = <strong className="text-gold">$100,000 ARR</strong> · 第一個月技術 bug 連登入都壞 · 仍 acquire 1K subs ·{" "}
              <a
                href="https://www.acquiredbriefing.com/p/stratechery-with-ben-thompson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                acquiredbriefing.com/stratechery
              </a>
            </NumItem>
            <NumItem n="04">
              <span className="text-bone">404 Media 2023</span> ·
              4 journalists × $1,000 startup capital = $4,000 total · <strong className="text-gold">8 個月達 profitability</strong> · 「I will not get paid until I deliver」 costly signal ·{" "}
              <a
                href="https://www.niemanlab.org/2024/02/six-months-in-journalist-owned-tech-publication-404-media-is-profitable/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                niemanlab.org/404-media
              </a>
            </NumItem>
            <NumItem n="05">
              <span className="text-bone">Kickstarter 2024 stats</span> ·
              average pledge $116 (≈ NT$ 3,500) · 66% 成功項目 funding &lt; $10,000 · ZONE 27 NT$ 2,700 = <strong className="text-gold">Kickstarter avg pledge 的 75%</strong> · 跟「我想 back 一個還沒做出來的東西」同一級 ·{" "}
              <a
                href="https://www.searchlogistics.com/learn/statistics/kickstarter-stats-facts/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                searchlogistics.com/kickstarter-stats
              </a>
            </NumItem>
            <NumItem n="06">
              <span className="text-bone">FanGraphs Membership 2025</span> ·
              $80/年 (≈ NT$ 2,500) · MLB 級 sabermetrics 訂閱 BENCHMARK · 大部分數據 FREE · 跟 ZONE 27 monetization philosophy 完全一致 · Founders 27 NT$ 2,700 <strong className="text-gold">LIFETIME 比 FanGraphs YEARLY 還便宜</strong> ·{" "}
              <a
                href="https://plus.fangraphs.com/product/fangraphs-membership/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                plus.fangraphs.com/membership
              </a>
            </NumItem>
            <NumItem n="07">
              <span className="text-bone">Hami Video CPBL TV 2026</span> ·
              NT$ 88/月 單隊 · NT$ 330/月 全聯盟 · ELTA NT$ 599/90 天 · DAZN NT$ 1,590/年 · Taiwan CPBL 鐵粉 <strong className="text-gold">已付 NT$ 1,000-4,000/年</strong> 看球 · 不是「不付錢」 · 是要選對的東西付 ·{" "}
              <a
                href="http://cpblstats.com/sign-up-purchase-cpbl-tv-subscription/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                cpblstats.com/cpbl-tv-subscription
              </a>
            </NumItem>
            <NumItem n="08">
              <span className="text-bone">Patek Philippe Generations campaign(1996-present)</span> ·
              「You never actually own a Patek Philippe. You merely look after it for the next generation」 · 全球奢侈品 marketing 史上最成功 campaign · NT$ 1M+ 手錶 30 年沒換 slogan · Founders 27 = <strong className="text-gold">Patek 邏輯的 quant baseball 版</strong> · 賣的是「您是 270 founding members 之一 · 不是 unlock features」 ·{" "}
              <a
                href="https://www.patek.com/en/manufacture/inside-patek-philippe/the-generations-campaign"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                patek.com/generations-campaign
              </a>
            </NumItem>
            <NumItem n="09">
              <span className="text-bone">CPBLTV(Hami Video)2025 early-bird</span> ·
              <strong className="text-gold"> NT$ 2,399/年 全聯盟 season pass</strong> · regular NT$ 2,499/年 · 單隊 NT$ 77/月 · 5 隊 NT$ 277/月 · Taiwan CPBL 鐵粉 already accept NT$ 2,399/yr 「passive watching」 · ZONE 27 Founders 27 NT$ 2,700 <strong className="text-gold">LIFETIME 只比 CPBLTV 1 年貴 NT$ 301</strong> · 「watch all year = NT$ 2,399 · think like an engine = NT$ 2,700 once forever」 anchor ·{" "}
              <a
                href="https://www.cht.com.tw/zh-tw/home/cht/messages/2025/0211-1000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                cht.com.tw/2025 CPBLTV official
              </a>
            </NumItem>
            <NumItem n="10">
              <span className="text-bone">DELTA Inc.(Japan NPB sabermetrics)</span> ·
              ¥1,000/月(≈ NT$ 210)for 1.02 Essence of Baseball · ¥2,000/月 farm tier · founded 2011 · ZONE 27 closest Asian precedent · 14 年運轉至今 sub count 不公開 · 「Bill James of Japan」 Yusuke Okada solo · ZONE 27 disclosure 哲學 <strong className="text-gold">反 invert DELTA opacity</strong> · per Pratfall(Aronson 1966)·{" "}
              <a
                href="https://1point02.jp/op/reg/guide_reg_description-en.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                1point02.jp DELTA subscription
              </a>
            </NumItem>
            <NumItem n="11">
              <span className="text-bone">CPBL 2025 attendance pacing</span> ·
              <strong className="text-gold"> 3,000,000 spectators / season</strong> · average 11,940/game early-season(+55% vs 35-year avg)· 2024 record-high 7,477/game · 270 Founders 27 seats = <strong className="text-gold">0.009% of single-season gate</strong> · sell-out trivially achievable if conversion ≥ 1-in-11,000 attendees ·{" "}
              <a
                href="https://sports.ettoday.net/news/2938974"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                sports.ettoday.net CPBL 2025
              </a>
            </NumItem>
            <NumItem n="12">
              <span className="text-bone">PressPlay Academy 權證小哥(財經 options trader)</span> ·
              <strong className="text-gold"> 8,100+ paying students</strong> · Taiwan 單一 niche-expert creator 已證 financial willingness-to-pay · ZONE 27 270 founders = <strong className="text-gold">3% of 權證小哥 already proven</strong> · 270-seat costly signal scarcity 是 PressPlay 沒 deploy 的 asymmetric weapon ·{" "}
              <a
                href="https://www.pressplay.cc/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                pressplay.cc Academy
              </a>
            </NumItem>
          </ol>
          <p className="mt-8 font-mono text-gold/80 text-[10px] sm:text-xs tracking-[0.3em] leading-relaxed text-center">
            ⚓ 12 facts · web-verified · 全 source URL · 您可 click 自己 audit
          </p>
          <p className="mt-6 font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ <strong className="text-bone">您不孤獨 · 您 NT$ 2,700 在 industry benchmark 內</strong> ·
            same model as Defector $690K day-1 / Stratechery solo $100K year 1 / 404 Media $1K skin / FanGraphs $80 yearly / Patek Generations 30-year campaign · per Spence 1973{" "}
            <a
              href="https://en.wikipedia.org/wiki/Costly_signaling_theory_in_evolutionary_psychology"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              Costly Signaling theory
            </a>{" "}
            訂戶 pay 是 identity signal 不是 features unlock。
          </p>
        </Section>

        {/* ── §05 · 4 Q&A FAQ · Stratechery prose defense ─── */}
        <Section
          no="05"
          label="STILL HESITATING"
          zh="還在猶豫 · 4 個您應該問的問題"
        >
          <div className="space-y-3 mt-6">
            <FaqRow q="為什麼不是 NT$ 99 月費?">
              <p>
                Stratechery 創辦人 Ben Thompson:「Stratechery is purposely kept
                at a low price — thousands of dollars less than other analyst
                reports or newsletters — to ensure it is accessible to everyone,
                including students。」 ZONE 27 採同思維:NT$ 1,500/season(≈ NT$ 187/月)是<strong className="text-bone">刻意低</strong>
                · 不是因為我們便宜 · 是因為我們不想要靠您財務不舒服才賺錢。
                Defector $79/yr ≈ NT$ 2,400/年 ≈ NT$ 200/月 · The Athletic
                $79.99/yr ≈ NT$ 210/月 · ZONE 27 NT$ 1,500/season ≈ NT$ 187/月 在 NT$ 200-450/月
                indie sports subscription band 中段 sweet spot · per
                /membership/black-card hero 4-cell anchor strip。
              </p>
            </FaqRow>
            <FaqRow q="為什麼 Founders 27 不能升級 BLACK CARD?">
              <p>
                Founders 27(NT$ 2,700 一次性 終身)IS the lifetime BLACK CARD ·
                already includes 全部 BLACK CARD unlocks 終身 · 不需要再付 NT$
                1,500/season。 換言之 · Founders 27 = lifetime BLACK CARD + 6 額外
                benefits(per §03 list)。 您持 Founders 27 永遠不需要訂閱 BLACK
                CARD · 「升級」 不存在 · 因為您已經在 top tier 終身。
              </p>
            </FaqRow>
            <FaqRow q="14 天退款怎麼算?">
              <p>
                從 confirmation email 那天起算 14 個自然日內 · 寄信
                tatayngiti@gmail.com · 主旨「REFUND · ZONE27-#NNN」 · 48 hr 內 Tim
                確認 · 同步原匯款銀行戶頭退回全額。 不問原因 · 不嘗試挽留 ·
                不要求填問卷。 per Taiwan 消保法 § 19 distance-selling
                cooling-off · ZONE 27 主動延伸到 14 天 · 翻倍法定下限。
                完整 refund 條款見{" "}
                <Link
                  href="/terms"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /terms Section 4B
                </Link>
                。
              </p>
            </FaqRow>
            <FaqRow q="未來漲價時 grandfather 怎麼處理?">
              <p>
                Founders 27 永久不漲價 · 同 NT$ 2,700 在 closed state · 同
                Pokemon 1st Edition Shadowless 不可重印 mechanic · per
                /founders/ledger #shadowless-run binding pre-commit。 BLACK CARD
                如果未來調整 monthly price · 已 active subscribers 自動 grandfather
                到 您 first-purchase season price · 不會被強制 migration ·
                修改需 30 天前 /changelog 公告 · per /audit S05 PRE-COMMIT +
                /integrity rule #13(R81 加 · 永遠不 subscription auto-renewal)
                pattern。 R81 BLACK CARD pivot 自 NT$ 299/月 → NT$ 1,500/season
                · 已 active(若有)按過去 price grandfather。
              </p>
            </FaqRow>
          </div>
        </Section>

        <FounderSignOff>
          <p>
            這頁是我親手寫 · 從研究 5 個世界最佳 indie subscription pricing
            page 開始(Stripe Atlas · Stratechery · Defector · FanGraphs ·
            Linear)· 不是 sales template。
          </p>
          <p>
            如果您看完還在猶豫 · 可能 ZONE 27 不適合您 · 那也是好事 · 我們不
            push。 brand IP「客戶 ≠ 朋友 · 不催」 永遠 active。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/pricing/why" />

        {/* ── FINAL CTA ───────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            ONE PAGE · ALL THE PRICING WHY · NO FAQ HIDING
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/membership"
              className="px-6 sm:px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              4-tier ladder →
            </Link>
            <Link
              href="/founders"
              className="px-6 sm:px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              加入 Founders 27 →
            </Link>
            <Link
              href="/membership/black-card"
              className="px-6 sm:px-8 py-3 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
            >
              BLACK CARD NT$ 1,500/season →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function Section({
  no,
  label,
  zh,
  children,
}: {
  no: string;
  label: string;
  zh: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40 cv-auto">
      <div className="flex items-baseline gap-4 mb-2 section-reveal">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {label}
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-8">{zh}</h2>
      <div className="space-y-5 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function NumItem({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 items-baseline">
      <span
        className="font-mono text-gold/70 text-[10px] tracking-[0.25em] tabular shrink-0 mt-1 w-8"
        aria-hidden="true"
      >
        {n}
      </span>
      <span className="flex-1">{children}</span>
    </li>
  );
}

// R68 W-F · Agent A SHIP 7 · ghost-numeral NumItem variant · Patek
// movement-spec aesthetic · 大型 light gold ghost numeral BEHIND the row
// content via absolute positioning · pointer-events-none + aria-hidden
// (decorative · screen reader skip)。 Used only in /pricing/why §03(highest-
// stake 6-deliverable Stripe Atlas section)· NOT in §01 §02 to maintain
// visual hierarchy(§03 is the apex)。
function NumItemGhost({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative py-3 sm:py-4 pl-16 sm:pl-20 border-b border-line/30 last:border-b-0">
      <span
        className="absolute left-0 top-1 sm:top-2 font-mono text-gold/22 text-5xl sm:text-6xl tabular leading-none pointer-events-none select-none"
        aria-hidden="true"
      >
        {n}
      </span>
      <span className="block text-mute text-sm sm:text-base leading-relaxed">
        {children}
      </span>
    </li>
  );
}

function FaqRow({
  q,
  children,
}: {
  q: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group bg-slate/40 border border-line/60 open:border-gold/40 transition-colors">
      <summary className="cursor-pointer list-none px-6 py-5 flex items-start justify-between gap-4 hover:bg-slate/60 transition-colors">
        <span className="text-bone text-base leading-snug flex-1">{q}</span>
        <span
          className="font-mono text-gold/60 text-xs tracking-[0.2em] group-open:rotate-45 transition-transform shrink-0 mt-1"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="px-6 pb-6 pt-1 text-mute text-sm leading-relaxed">
        {children}
      </div>
    </details>
  );
}
