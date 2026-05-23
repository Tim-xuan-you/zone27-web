import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "為什麼是 NT$ 299 · 為什麼是 NT$ 2,700 · ZONE 27 Pricing Why",
  description:
    "ZONE 27 定價 rationale 一頁說清楚 · 不藏在 FAQ · 不靠 sales call · 不靠 enterprise contact form · 純 Defector inverse-disclosure + FanGraphs output-not-input + Stripe Atlas 6-deliverable + Stratechery single-sentence FAQ defense · 5 brand IP axiom triple-fire pricing page craft。",
};

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

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            PRICING / WHY · 一頁說清楚
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
            為什麼是 <span className="text-gold">NT$ 299</span>
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

        {/* ── §02 · NT$ 299 換到的東西 · FanGraphs output-not-input ─── */}
        <Section no="02" label="WHAT NT$ 299 BUYS" zh="NT$ 299 換到的東西">
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
              <span className="text-bone">40 visitor-discoverable routes</span> ·
              full Cmd-K palette indexed · 全公開 · 無 paywall on engine
              functionality
            </NumItem>
            <NumItem n="06">
              <span className="text-bone">8 binding ethics commitments</span> +
              5 self-objections + 11-item NOT-DO list · per /transparency
              aggregator · brand IP「方法公開」 物理 codify
            </NumItem>
          </ol>

          <h3 className="text-bone text-lg mt-8 mb-3">
            BLACK CARD NT$ 299/月 unlocks(payment infra 就緒後)
          </h3>
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

        {/* ── §03 · 為什麼 Founders 27 是 NT$ 2,700 · Stripe Atlas pattern ─── */}
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
          <ol className="space-y-3 mt-6">
            <NumItem n="01">
              <span className="text-bone">0% creator 抽成</span>(BLACK CARD
              creators 5%)· 您未來成為 ZONE 27 contributor · 訂閱者抽成
              100% 全拿 · per /founders benefit #03
            </NumItem>
            <NumItem n="02">
              <span className="text-bone">編號身分 #001-#{FOUNDERS_TOTAL}</span>
              · 動態牆 / 明牌 / 聊天室都顯示 · 是 ID 也是勳章 · per /founders
              benefit #02 + Pokemon TCG 1st Edition SHADOWLESS RUN axiom
            </NumItem>
            <NumItem n="03">
              <span className="text-bone">model 早期 access</span> · 每次 AI
              模型迭代 Founders 27 提前 7 天試用 · per /founders benefit #05
            </NumItem>
            <NumItem n="04">
              <span className="text-bone">實體尊榮招待</span> · 出示 QR 至恆美
              攝影 × 伶 Kopi 旗艦店 · 免費招待一杯冰鎮頂級一品紅茶 · 終身有效
              · per /founders benefit #06
            </NumItem>
            <NumItem n="05">
              <span className="text-bone">BLACK CARD 月卡終身免費</span> ·
              Founders 27 一次性 NT$ 2,700 自動 includes BLACK CARD lifetime ·
              省下 NT$ 299 × ∞ months · per /founders break-even math(9 個月
              損益平衡)
            </NumItem>
            <NumItem n="06">
              <span className="text-bone">永久不漲價</span> · 同 NT$ 2,700 在
              closed state · 不會 reprint 漲價 · 同 Pokemon 1st Edition
              Shadowless 不可重印 mechanic · per /founders/ledger #shadowless-run
            </NumItem>
          </ol>
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
                299/月 · per /faq Q「ZONE 27 接 corporate?」 答 NO。
              </span>
            </li>
          </ul>
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
                including students。」 ZONE 27 採同思維:NT$ 299 是<strong className="text-bone">刻意低</strong>
                · 不是因為我們便宜 · 是因為我們不想要靠您財務不舒服才賺錢。
                Defector $79/yr ≈ NT$ 2,400/年 ≈ NT$ 200/月 · The Athletic
                $79.99/yr ≈ NT$ 210/月 · ZONE 27 NT$ 299 在 NT$ 200-450/月
                indie sports subscription band 中段 sweet spot · per
                /membership/black-card hero 4-cell anchor strip。
              </p>
            </FaqRow>
            <FaqRow q="為什麼 Founders 27 不能升級 BLACK CARD?">
              <p>
                Founders 27(NT$ 2,700 一次性 終身)IS the lifetime BLACK CARD ·
                already includes 全部 BLACK CARD unlocks 終身 · 不需要再付 NT$
                299/月。 換言之 · Founders 27 = lifetime BLACK CARD + 6 額外
                benefits(per §03 list)。 您持 Founders 27 永遠不需要訂閱 BLACK
                CARD · 「升級」 不存在 · 因為您已經在 top tier 終身。
              </p>
            </FaqRow>
            <FaqRow q="14 天退款怎麼算?">
              <p>
                從 confirmation email 那天起算 14 個自然日內 · 寄信
                tim@zone27.tw · 主旨「REFUND · ZONE27-#NNN」 · 48 hr 內 Tim
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
                到 NT$ 299/月 · 不會被強制 migration · 修改需 30 天前 /changelog
                公告 · per /audit S05 PRE-COMMIT pattern。
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
              BLACK CARD NT$ 299/月 →
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
