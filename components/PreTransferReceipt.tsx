import Link from "next/link";

// ── ZONE 27 · Pre-Transfer Receipt ──────────────────────
// R68 W-G · Agent A SHIP 3 · upgrade of R63 W-B 4-point trust block ·
// per taiwan.md trust-at-transfer creator-economy report · Patek SEA
// authentication ledger + MUJI Asia gift-card transfer + Books Kinokuniya
// HK special-order receipt pattern。 Asian premium markets converge on
// showing the human workflow BEFORE checkout because cultural default is
// suspicion of automated wire transfers · NOT「secure checkout」 badges。
//
// 3-row receipt grammar(not testimonials · not badges):
//   ROW 1 · 您將收到 · WHAT YOU WILL RECEIVE
//     concrete bullets: 24h email + handwritten ledger row + PDF certificate
//   ROW 2 · Tim 親手 5-step choreography · CHOREOGRAPHY
//     numbered list visible BEFORE form
//   ROW 3 · 如果出錯了 · FAILURE MODES + 14-day refund mailto
//     NOT a trust seal · explicit failure-mode acknowledgment(Pratfall)
//
// Brand IP fit:
//   - [[zone27-disclosure-philosophy]] · transaction-layer disclosure
//   - [[feedback-zone27-pratfall-brand-ip]] · ROW 3 surfaces failure
//   - [[zone27-payment-architecture]] · 手動轉帳 INTENTIONAL framing
//   - Taiwanese trust-at-moment-of-transfer structural blocker close
//   - NOT fake trust seals · NOT social proof testimonials
//
// Used: /founders above &lt;WaitlistForm /&gt;(replaces R63 W-B 4-point block)·
// future: /founders/apply same context after submit success state · 同
// pattern。
// ─────────────────────────────────────────────────────

export default function PreTransferReceipt() {
  return (
    <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-5 sm:pb-6">
      <div className="border border-gold/40 bg-gold/5">
        <header className="border-b border-gold/30 px-5 sm:px-6 py-3 flex items-baseline justify-between flex-wrap gap-2">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em]"
          >
            / PAYMENT TRUST · 您 click 之後會發生什麼
          </p>
          <p
            lang="en"
            className="font-mono text-gold/70 text-[9px] tracking-[0.3em]"
          >
            R68 W-G · TAIWAN.MD STRUCTURAL CLOSE
          </p>
        </header>

        {/* ── ROW 1 · WHAT YOU WILL RECEIVE ───────── */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-line/40">
          <p className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3">
            ▸ 01 · 您將收到 · WHAT YOU WILL RECEIVE
          </p>
          <ul className="space-y-2.5 text-mute text-[12px] sm:text-[13px] leading-relaxed">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5"
              >
                a
              </span>
              <span>
                <strong className="text-bone">24h Tim email</strong> · 銀行
                轉帳資訊 + ZONE27-#NNN 您專屬 memo code · 通過後第一封信
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5"
              >
                b
              </span>
              <span>
                <strong className="text-bone">7 天內手寫 ledger row</strong>
                {" "}· 您 ID + 您姓名(or 您指定 handle)寫入{" "}
                <Link
                  href="/founders/ledger"
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  /founders/ledger
                </Link>{" "}
                public allocation ledger · Tim 手寫每週 update
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5"
              >
                c
              </span>
              <span>
                <strong className="text-bone">3-piece welcome kit PDF</strong>
                {" "}· certificate(build SHA stamp + Tim signature)+
                methodology snapshot(您 buy-date engine version PDF · 永久
                immutable receipt of what was promised)+ receipt index(您
                buy-date /track-record 戰績 timestamp)
              </span>
            </li>
          </ul>
        </div>

        {/* ── ROW 2 · TIM'S 5-STEP CHOREOGRAPHY ─── */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-line/40">
          <p className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3">
            ▸ 02 · TIM 親手 5 個動作 · CHOREOGRAPHY
          </p>
          <ol className="space-y-2.5 text-mute text-[12px] sm:text-[13px] leading-relaxed">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5 tracking-[0.15em] w-6"
              >
                01
              </span>
              <span>
                Tim 開您 application(Gmail inbox · 1-3 business days)
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5 tracking-[0.15em] w-6"
              >
                02
              </span>
              <span>
                Tim 依{" "}
                <Link
                  href="/founders/ledger"
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  /founders/ledger
                </Link>{" "}
                5-step rules 親手 review(real name · CPBL signal · brand fit · red flags · slot allocate)
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5 tracking-[0.15em] w-6"
              >
                03
              </span>
              <span>
                通過 → Tim email 銀行資訊 + ZONE27-#NNN memo code · 24h window
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5 tracking-[0.15em] w-6"
              >
                04
              </span>
              <span>
                Tim 驗證 wire 到帳(銀行 push notification · 0 自動 cron · Tim 親眼確認)
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-gold/70 shrink-0 font-mono text-[10px] tabular mt-0.5 tracking-[0.15em] w-6"
              >
                05
              </span>
              <span>
                Tim ship welcome kit PDF + 手寫 ledger row · 您 Founder ID
                永久 locked
              </span>
            </li>
          </ol>
          <p className="mt-3 pt-3 border-t border-line/30 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ▸ <strong className="text-bone">0 信用卡資料 ever touch ZONE 27</strong>{" "}
            · 銀行轉帳 visitor↔ 銀行直接 · 0 Stripe / 0 TapPay / 0 ECPay vault
            · <strong className="text-bone">手動是 INTENTIONAL</strong> · 不是
            「沒能力上 Stripe」 · 是 brand IP「倒置 SaaS · 稀缺手工」
          </p>
        </div>

        {/* ── ROW 3 · IF SOMETHING BREAKS ─────────── */}
        <div className="px-5 sm:px-6 py-4 sm:py-5">
          <p className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3">
            ▸ 03 · 如果出錯了 · WHEN THINGS BREAK
          </p>
          <ul className="space-y-2.5 text-mute text-[12px] sm:text-[13px] leading-relaxed">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-loss/80 shrink-0 font-mono mt-0.5"
              >
                ✕
              </span>
              <span>
                Email 沒到 → check spam folder · 寄{" "}
                <a
                  href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20application%20email%20missing"
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  tatayngiti@gmail.com
                </a>{" "}
                · Tim 24h 回信
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-loss/80 shrink-0 font-mono mt-0.5"
              >
                ✕
              </span>
              <span>
                轉帳金額錯了 → 沒事 · Tim 親眼確認 · 多退少補 · 0 frozen
                in payment-gateway hell
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-loss/80 shrink-0 font-mono mt-0.5"
              >
                ✕
              </span>
              <span>
                您後悔了 → 14 天無條件退款 · 寄{" "}
                <a
                  href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%2014-day%20refund%20request"
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  tatayngiti@gmail.com
                </a>{" "}
                即退 · 不問原因 · 不挽留 · per{" "}
                <Link
                  href="/terms#section-4b"
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  /terms § 4B
                </Link>{" "}
                Taiwan 消保法 § 19 双倍法定下限
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-loss/80 shrink-0 font-mono mt-0.5"
              >
                ✕
              </span>
              <span>
                Tim 失蹤了 → 看{" "}
                <Link
                  href="/ethics"
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  /ethics
                </Link>{" "}
                BUS_FACTOR section · 您資料在 Supabase Tokyo + 您 PDF
                certificate 本機 · 0 vendor lock-in
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
