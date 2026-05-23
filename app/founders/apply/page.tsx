import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FoundersApplicationForm from "@/components/FoundersApplicationForm";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import { FOUNDERS_TOTAL, FOUNDERS_NEXT } from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "申請 Founders 27 · Patek-style allocation · ZONE 27",
  description:
    "Founders 27 創始席位申請表 · Tim 親手 review 每一份申請 · 1-3 business days · per /founders/ledger 5-step allocation rules · 通過後您才會收到付款方式 · 這不是註冊表單 · 是 Patek-style application。",
};

// ── R68 W-A · Founders 27 Application Page ──────────────
// /founders/apply · 1 layer deeper than /founders WaitlistForm · for
// visitors who want to actually apply for one of 270 founding seats
// (#008-#270 · #001-#007 are Tim's system-test placeholders per
// /founders/ledger)。
//
// Brand IP fit:
//   - per [[zone27-payment-architecture]] · Founders 27 = manual bank
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
              FOUNDERS 27
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">APPLY</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            FOUNDERS 27 · APPLICATION PHASE · PATEK ALLOCATION
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight">
            申請 Founders 27 ·{" "}
            <span className="text-gold">一年 270 個席位</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed text-base sm:text-lg">
            這不是註冊表單 · 是 Patek-style application。{" "}
            <strong className="text-bone">Tim 親手 review 每一份</strong>{" "}
            · 1-3 business days · 通過後您才會收到付款方式(銀行轉帳 + 24
            小時 window)。
          </p>
          <p className="mt-3 font-mono text-mute/85 text-xs tracking-[0.25em]">
            目前 #{String(FOUNDERS_NEXT).padStart(3, "0")} 待認領 · 總額{" "}
            {FOUNDERS_TOTAL} · 永遠不會有第二批(per{" "}
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

        {/* ── PRE-APPLY CONTEXT BLOCK ──────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10">
          <div className="bg-slate/30 border-l-2 border-gold/60 px-5 sm:px-6 py-5">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3">
              ⚓ 申請前請確認 · BEFORE YOU APPLY
            </p>
            <ul className="space-y-2.5 text-mute text-sm leading-relaxed">
              <li>
                ✓ 您讀過{" "}
                <Link
                  href="/founders"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /founders
                </Link>{" "}
                + 6 個「
                <strong className="text-bone">什麼不買到</strong>
                」 limitations 都接受
              </li>
              <li>
                ✓ 您讀過{" "}
                <Link
                  href="/founders/ledger"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /founders/ledger
                </Link>{" "}
                5-step allocation rules · 接受 Tim 可能 reject
              </li>
              <li>
                ✓ 您讀過{" "}
                <Link
                  href="/pricing/why"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /pricing/why
                </Link>{" "}
                · 您 conclude 自己 NT$ 2,700 fits · Tim 不 sell
              </li>
              <li>
                ✓ 您準備好{" "}
                <strong className="text-bone">NT$ 2,700 銀行轉帳</strong> ·
                通過後 24 小時內完成(不收信用卡 · 不收 LINE Pay · 不收
                超商代收)
              </li>
            </ul>
          </div>
        </section>

        {/* ── THE FORM ──────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <FoundersApplicationForm />
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
                解釋原因(non-CPBL · 非 fan-grammar · LINE 老師 affiliation 等)·
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
                公開帳本 · lifetime access · NT$ 2,700 永不調漲
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
            一年 270 個席位 = 我 365 天 ÷ 1.35 = 我親手 review 每一個
            applicant 的物理上限。 我不外包 review · 不 hire intern · 不
            auto-approve 任何 case。
          </p>
          <p>
            您 click submit 那一刻 · 我在台南某家咖啡店或某個夜班會親手讀完
            您的「why ZONE 27」 段落 · 然後決定。
          </p>
        </FounderSignOff>

        {/* ── RELATED READING ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <RelatedReading currentPath="/founders/apply" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
