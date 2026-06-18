import Link from "next/link";
import {
  GOLD_SLA_COMMITMENT,
  GOLD_SLA_STATE,
  isPreLaunchSlaState,
} from "@/lib/founder-sla";

// ── ZONE 27 · Tim Response SLA ──────────────────────────
// R72 W-B · Agent A R72 SHIP 6 · Patek dealer「personal call」 promise +
// Stripe Atlas application response SLA + Linear 2019 invite-only response
// time pattern。 Inline chip immediately above /founders/apply submit
// button · bridge between R68 W-G PreTransferReceipt 5-step choreography
// (「what happens AFTER you click」)and submit-button friction point
// (「what Tim physically commits to · NOW」)。
//
// Taiwan users distrust automated「thank you we'll be in touch」 boilerplate
// (cultural default per taiwan.md creator economy report)· making the SLA
// visible monetizes Tim's personal handwritten reply。
//
// Pre-launch state honest empty(per [[feedback-zone27-pratfall-brand-ip]])·
// post-Founder-#001 onboard Tim updates lib/founder-sla.ts numerical state ·
// 4-cell mini-stack lights up with real numbers。
//
// brand IP fit:
//   - per [[feedback-founder-dogfood-canary]] · Tim capacity disclosed
//   - per [[zone27-disclosure-philosophy]] · 拒絕標準在 /founders/apply
//     的 RefusalLedgerHint(#refusals)· 不再連已刪的 /founders/ledger
//   - per /audit S05 PRE-COMMIT · SLA commitment binding · 30-day notice
//   - per Patek dealer model · 「I will personally call you」 inverted
//     to「Tim will personally email you」 1-3 days · 不外包 axiom
// ─────────────────────────────────────────────────────

export default function TimResponseSLA() {
  const state = GOLD_SLA_STATE;
  const isPreLaunch = isPreLaunchSlaState(state);

  return (
    <aside
      aria-label="Tim Response SLA · Patek dealer personal call promise · 1-3 business days · solo founder no outsourcing"
      className="mb-6 border-l-2 border-gold/60 bg-slate/30 px-4 sm:px-5 py-3 sm:py-3.5"
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.35em]"
        >
          ⚓ TIM RESPONSE SLA · PATEK DEALER PROMISE
        </p>
        <p
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          /audit · 事前公開承諾
        </p>
      </div>
      <p className="text-bone text-sm sm:text-base leading-relaxed mb-3">
        <strong className="text-gold tabular tracking-tight">
          {GOLD_SLA_COMMITMENT}
        </strong>
        {" "}· 「I will personally email you」 1-3 business days · 0 cron ·
        0 外包 · 0 auto-responder · per /audit S05 PRE-COMMIT 30-day notice
        if SLA breaks。
      </p>

      {/* ── 4-cell mini-stack · pre-launch honest empty or post-launch live ── */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-line/30">
        <div className="flex items-baseline justify-between gap-2">
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            LAST REPLY
          </span>
          <span
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.22em] tabular"
          >
            {state.lastReplyDate ?? "TBD · 第一筆 application"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            AVG REPLY
          </span>
          <span
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.22em] tabular"
          >
            {state.avgReplyHours !== null
              ? `${state.avgReplyHours}h`
              : "TBD · 等真實 sample"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            QUEUE
          </span>
          <span
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.22em] tabular"
          >
            {state.queueDepth !== null
              ? `${state.queueDepth} 件`
              : "TBD · pre-launch"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            REFUSALS
          </span>
          <span
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.22em] tabular"
          >
            {state.publishedRefusalCount !== null ? (
              <>{state.publishedRefusalCount} 件 published</>
            ) : (
              <>見下方 § 拒絕標準</>
            )}
          </span>
        </div>
      </div>

      <p className="font-mono text-mute/70 text-[10px] tracking-[0.22em] leading-relaxed mt-3">
        {/* 拒絕標準在同一頁的 RefusalLedgerHint(id="refusals")· 同頁 anchor · 不再
            連已刪的 /founders/ledger。 */}
        ⚓ 拒絕標準申請前先公開在下方{" "}
        <Link
          href="#refusals"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
        >
          § 拒絕標準
        </Link>{" "}
        · 不藏婉拒理由 · Tim 親手回信說明原因 ·{" "}
        {isPreLaunch
          ? "上線前 · 等第一筆真實申請啟動數字"
          : "每週 Tim 親手更新"}
        。
      </p>
    </aside>
  );
}
