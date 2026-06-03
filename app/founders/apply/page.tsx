import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FoundersApplicationForm from "@/components/FoundersApplicationForm";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import FromOneSolo from "@/components/FromOneSolo";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import RefusalLedgerHint from "@/components/RefusalLedgerHint";
import { FOUNDERS_TOTAL, FOUNDERS_NEXT } from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "申請 FOUNDER · Patek-style allocation",
  description:
    "FOUNDER 創始席位申請表 · Tim 親手 review 每一份申請 · 1-3 business days · per /founders/ledger 5-step allocation rules · 通過後您才會收到付款方式 · 這不是註冊表單 · 是 Patek-style application。",
  // R69 W-G · Agent B audit F11 fix · explicit openGraph re-using /founders
  // OG card · NEW-CONVERSATION-PROMPT advertised 「29 custom OG cards」 ·
  // highest-conversion R68 W-A page was sharing with global fallback OG ·
  // 此 fix 對齊 /founders parent OG until dedicated card ships R70+。
  openGraph: {
    title: "申請 FOUNDER · Patek-style allocation",
    description:
      "Tim 親手 review 1-3 days · 通過後收到付款方式(銀行轉帳 + 24h window)· per /founders/ledger 5-step allocation rules。",
    images: ["/founders/opengraph-image"],
  },
};

// ── R68 W-A · FOUNDER Application Page ──────────────
// /founders/apply · 1 layer deeper than /founders WaitlistForm · for
// visitors who want to actually apply for one of 270 founding seats
// (#008-#270 · #001-#007 are Tim's system-test placeholders per
// /founders/ledger)。
//
// Brand IP fit:
//   - per [[zone27-payment-architecture]] · FOUNDER = manual bank
//     transfer · this form is the PRE-REQUISITE before Tim sends bank
//     details · NOT a payment form itself
//   - per [[feedback-zone27-pratfall-brand-ip]] · 明示「1-3 days 內 manual
//     review」 · 明示「未通過會解釋原因」 · 同 /founders/ledger 5-step rules
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 不問「sabermetric
//     experience」 · 只問 fan-grammar CPBL connection
//   - per [[feedback-no-waiting-rule]] · ships NOW without Supabase
//     migration 0003 · email-only audit trail backstop pre-migration
// ─────────────────────────────────────────────────────

export default function FoundersApplyPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link href="/founders" className="hover:text-gold transition-colors">
              FOUNDER
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">APPLY</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            FOUNDER · APPLICATION PHASE · PATEK ALLOCATION
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight">
            申請 FOUNDER ·{" "}
            <span className="text-gold">前 270 個創始編號</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed text-base sm:text-lg">
            這不是註冊表單 · 是 Patek-style application。{" "}
            <strong className="text-bone">Tim 親手 review 每一份</strong>{" "}
            · 1-3 business days · 通過後您才會收到付款方式(銀行轉帳 + 24
            小時 window)。
          </p>
          <p className="mt-3 font-mono text-mute/85 text-xs tracking-[0.25em]">
            目前 #{String(FOUNDERS_NEXT).padStart(3, "0")} 待領 · 創始編號共{" "}
            {FOUNDERS_TOTAL} 個 · 1st Edition 發完即止 · 會員仍不限量(per{" "}
            <Link
              href="/audit"
              className="text-gold underline-offset-4 hover:underline"
            >
              /audit S05 PRE-COMMIT
            </Link>
            )
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={4} />
          </div>
        </section>

        {/* ── R72 W-A · FromOneSolo · Agent A R72 SHIP 3 ──
            patio11 Kalzumeus → Tarsnap + Pieter Levels nomadlist + Justin
            Jackson MegaMaker first-100-users origin pattern。 ZONE 27
            structurally cannot use social proof(LINE 老師 audience pattern-
            match risk · brand-redline #11 fake testimonials)· must EXPLICITLY
            invert no-social-proof weakness into the offer。 4 honest deltas
            published BEFORE form · per /founders/from-one-current-founder
            R69 W-B empty scaffold parallel axis · per /audit S05 PRE-COMMIT
            permanent disclosure(stays here even after #270 fills)。 */}
        <FromOneSolo />

        {/* ── R70 W-E · PreApplyChecklistMobile · Agent A R70 SHIP 5 ──
            Stripe Atlas-style 1-screen mobile checklist BEFORE form ·
            replaces inline 4-bullet text block with NumItemGhost-pattern
            ghost-numeral checklist · each row tap = anchor jump to
            relevant artifact · self-qualifying friction surface · solo
            founder physics「-15 min email back-and-forth per applicant」 ·
            per Stripe Atlas + Patek dealer pre-qualification + Apple Card
            self-screen pattern。 brand IP triple-fire(Pratfall + Disclosure
            + Tetlock-honest「您 conclude · 我們不 sell」)。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10">
          <p className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-5">
            ⚓ 申請前請確認 4 件事 · BEFORE YOU APPLY · self-qualify
          </p>
          <ol className="border border-line/50 bg-slate/20">
            <li className="relative py-3 sm:py-4 px-4 sm:px-5 pl-16 sm:pl-20 border-b border-line/30">
              <span
                aria-hidden="true"
                className="absolute left-3 sm:left-4 top-1 sm:top-2 font-mono text-gold/22 text-5xl sm:text-6xl tabular leading-none pointer-events-none select-none"
              >
                01
              </span>
              <span className="block text-mute text-sm sm:text-base leading-relaxed">
                <strong className="text-bone">您讀過 11-item NOT-DO list</strong>{" "}
                + 接受 ZONE 27 永遠不做的事 ·{" "}
                <Link
                  href="/audit#section-02"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /audit §02
                </Link>
              </span>
            </li>
            <li className="relative py-3 sm:py-4 px-4 sm:px-5 pl-16 sm:pl-20 border-b border-line/30">
              <span
                aria-hidden="true"
                className="absolute left-3 sm:left-4 top-1 sm:top-2 font-mono text-gold/22 text-5xl sm:text-6xl tabular leading-none pointer-events-none select-none"
              >
                02
              </span>
              <span className="block text-mute text-sm sm:text-base leading-relaxed">
                <strong className="text-bone">您看過 /track-record</strong>{" "}
                真實 N=1 receipt · 接受 N&lt;30 不是 evidence 的事實 ·{" "}
                <Link
                  href="/track-record"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /track-record
                </Link>
              </span>
            </li>
            <li className="relative py-3 sm:py-4 px-4 sm:px-5 pl-16 sm:pl-20 border-b border-line/30">
              <span
                aria-hidden="true"
                className="absolute left-3 sm:left-4 top-1 sm:top-2 font-mono text-gold/22 text-5xl sm:text-6xl tabular leading-none pointer-events-none select-none"
              >
                03
              </span>
              <span className="block text-mute text-sm sm:text-base leading-relaxed">
                <strong className="text-bone">您理解 14 天退款流程</strong>{" "}
                + Taiwan 消保法 § 19 双倍法定下限 ·{" "}
                <Link
                  href="/terms#section-4b"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /terms §4B
                </Link>
              </span>
            </li>
            <li className="relative py-3 sm:py-4 px-4 sm:px-5 pl-16 sm:pl-20">
              <span
                aria-hidden="true"
                className="absolute left-3 sm:left-4 top-1 sm:top-2 font-mono text-gold/22 text-5xl sm:text-6xl tabular leading-none pointer-events-none select-none"
              >
                04
              </span>
              <span className="block text-mute text-sm sm:text-base leading-relaxed">
                <strong className="text-bone">您接受 1-3 天 Tim 親手 review</strong>{" "}
                + 可能 reject + NT$ 2,700 銀行轉帳 24h window ·{" "}
                <Link
                  href="/founders/ledger"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /founders/ledger
                </Link>
              </span>
            </li>
          </ol>
          <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed text-center">
            ⚓ 4 行讀完 · 您自己 conclude · 我們不 sell · Stripe Atlas + Patek
            dealer pre-qualification 同 pattern
          </p>
        </section>

        {/* ── THE FORM ──────────────────────────────── */}
        {/* R74 W-E · ClientErrorBoundary wrap · per R73 W-A pattern · 4th
            risk-bearing client component wrap(after AnonPickWidget +
            LensFocusVote + DailyReturnRail)· FoundersApplicationForm has
            highest crash surface area(localStorage encode/decode + URL
            param parsing + mailto + clipboard + form state hydrate + useRef
            + useEffect side-effects)· per [[zone27-disclosure-philosophy]]
            「不藏 broken state」 axiom · component crash 不 take down whole
            /founders/apply page · retry button + brand-pure fallback。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <ClientErrorBoundary fallbackLabel="FoundersApplicationForm">
            <FoundersApplicationForm />
          </ClientErrorBoundary>
        </section>

        {/* R156 W3.D5 · Craig Mod「I trust you」 hardship clause · per Agent D
            R156 research · craigmod.com/membership/ stewardship register +
            Are.na editorial「On Pricing」 hardship carve-out · 1-paragraph
            add · converts price wall from gatekeeping to stewardship · per
            [[zone27-monetization-philosophy]] identity-tier-as-SUPPORT axiom
            · brand IP iron rule preserved · 0 new component · pure copy。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/40 pl-5 sm:pl-6 py-3">
            <p className="text-mute leading-relaxed text-sm sm:text-base zh-body">
              <span className="text-bone font-medium">如果 NT$ 2,700 對您 genuinely out of reach</span>{" "}
              · email{" "}
              <a
                href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20Founders%2027%20%C2%B7%20hardship%20inquiry"
                className="text-gold underline-offset-4 hover:underline"
              >
                Tim
              </a>
              {" "}
              · 我們一起想辦法 · 不要默默跳過申請。
              您走到這頁 = 您是死忠 CPBL 球迷 · 我相信您。
            </p>
          </div>
        </section>

        {/* ── POST-APPLY EXPECTATION SETTING ───────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <div className="border border-line/40 bg-slate/20 p-6 sm:p-8">
            <p className="font-mono text-gold text-[10px] tracking-[0.35em] mb-4">
              ⚓ 透明預期 · WHAT HAPPENS NEXT
            </p>
            <ol className="space-y-3 text-mute text-sm leading-relaxed">
              <li>
                <span className="font-mono text-bone tabular mr-2">01</span>
                <strong className="text-bone">即刻</strong> · 您收到 receipt
                confirmation email(Application ID 開頭 fa-YYYYMMDD-...)
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">02</span>
                <strong className="text-bone">1-3 business days</strong> ·
                Tim 親手 review · 根據{" "}
                <Link
                  href="/founders/ledger"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  5-step rules
                </Link>{" "}
                通過 / 不通過 / clarifying question
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">03A</span>
                <strong className="text-bone">通過</strong> · Tim email 銀行
                資訊 + 您 ZONE27-#NNN memo code · 您 24h 內完成 NT$ 2,700 wire
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">03B</span>
                <strong className="text-bone">不通過</strong> · Tim email
                解釋原因(non-CPBL · 非 fan-grammar · 明牌生意 affiliation 等)·
                您可選 30 天後重新申請
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">04</span>
                <strong className="text-bone">轉帳完成</strong> · Tim 7 天內
                ship 3-piece welcome kit:certificate + methodology snapshot
                PDF + receipt index · 您 Founder ID 永久鎖定
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">05</span>
                <strong className="text-bone">永久</strong> · 您 ID 列入{" "}
                <Link
                  href="/founders/ledger"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /founders/ledger
                </Link>{" "}
                公開帳本 · 365 天訂閱 · NT$ 2,700 永不調漲 · 會員不限量 · 前 270 拿編號
              </li>
            </ol>
          </div>
        </section>

        {/* ── FOUNDER SIGN-OFF ─────────────────────── */}
        <FounderSignOff signedAt="2026-05-23">
          <p>
            這個 form 是 <strong>Patek-style</strong> 而不是 Stripe-style。
            因為 ZONE 27 不是 SaaS · 是稀缺手工 product。
          </p>
          <p>
            前 270 個創始編號 = 我親手 review 每一個 applicant 的階段 · 365 天 ÷ 1.35
            是我一年親手 onboard 的節奏。 我不外包 review · 不 hire intern · 不
            auto-approve 任何 case。 創始編號發完後 FOUNDER 仍不限量開放 · 但
            #001–#270 這批是我一個一個親手讀完「why」才發出去的。
          </p>
          <p>
            您 click submit 那一刻 · 我在台南某家咖啡店或某個夜班會親手讀完
            您的「why ZONE 27」 段落 · 然後決定。
          </p>
        </FounderSignOff>

        {/* ── 拒絕標準 · 申請前先公開(brand IP:對手不敢做的 disclosure · R187 啟用孤兒元件)── */}
        <RefusalLedgerHint />

        {/* ── RELATED READING ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <RelatedReading currentPath="/founders/apply" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
