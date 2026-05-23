"use client";

// ── ZONE 27 · Founders 27 Application Form ──────────────
// R69 W-G · Agent B audit F8 fix · success state focus management ·
// WCAG 2.4.3 Focus Order + 4.1.3 Status Messages · 訪客 submit 後
// focus 自動移到 success container · role="status" + aria-live · 不
// 失去 keyboard / screen reader context。
// R68 W-A · Patek Philippe-style application form · 1 layer deeper than
// /founders WaitlistForm · for visitors who actually want one of 270
// founding seats(#008-#270 · #001-#007 are Tim's system-test placeholders
// per /founders/ledger)。
//
// 4 fields:
//   1. email · required
//   2. name · required(real name preferred · Tim manual review needs)
//   3. cpbl_connection · required(which CPBL team you follow + how long)
//   4. why_zone27 · required(50-600 chars · why you want to be a Founder)
//
// Submit flow:
//   - Server action submitFoundersApplication(in lib/founders-apply.ts)
//   - Sends 2 Resend emails(visitor confirmation + Tim's Gmail review)
//   - Returns ok:true with applicationId(timestamp-derived)
//   - Success state shows applicationId + 1-3 day wait honesty
//
// Brand IP fit:
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL connection
//     field asks「您 CPBL 球迷 N 年 + 哪隊」 fan-grammar
//   - per [[feedback-zone27-pratfall-brand-ip]] · explicit「1-3 business
//     days 內 Tim 手動 review」 wait time · NOT 「instant approval」
//   - per /founders/ledger 5-step allocation rules · pre-committed process
//   - per [[zone27-disclosure-philosophy]] · all 4 fields rationale 解釋
//     for each → skeptic can audit「what we ask」 = exact review needs
//   - per R67 W-D Tetlock track-able-error · exhaustive error message
//     helper(no silent fall-through)
//
// 不做 anti-pattern:
//   ✕ no "Founders 27 投票權" / "private LINE group access" promises
//   ✕ no "instant approval" / "guaranteed slot" framing
//   ✕ no captcha / no Cloudflare Turnstile(rate-limited via Supabase
//     when migration applies · MVP relies on Tim manual review filter)
//   ✕ no marketing copy bait("您是最棒的!")· brand-pure honesty only
// ─────────────────────────────────────────────────────

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { submitFoundersApplication } from "@/lib/founders-apply";
import {
  getFoundersApplyErrorMessage,
  FOUNDERS_APPLY_LIMITS,
  type FoundersApplyResult,
} from "@/lib/founders-apply-types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-4 text-xs tracking-[0.3em] transition-colors font-medium ${
        pending
          ? "bg-gold/30 text-navy/70 cursor-not-allowed"
          : "bg-gold text-navy hover:bg-gold-soft"
      }`}
    >
      {pending ? "▸ 正在提交申請 ..." : "提交申請 · TIM 1-3 日內 REVIEW →"}
    </button>
  );
}

export default function FoundersApplicationForm() {
  const [state, formAction] = useActionState<
    FoundersApplyResult | null,
    FormData
  >(submitFoundersApplication, null);
  const successRef = useRef<HTMLDivElement>(null);

  // R69 W-G · Agent B audit F8 fix · move focus to success container
  // when submission succeeds · keyboard + SR users not orphaned。
  useEffect(() => {
    if (state?.ok) {
      successRef.current?.focus();
    }
  }, [state?.ok]);

  // ── Success state ────────────────────────────────────
  if (state?.ok) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="bg-slate/70 border border-gold/60 glow-soft p-10 enter-fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4 text-center">
          ✓ 申請已收到 · APPLICATION RECEIVED
        </p>
        <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3 text-center">
          您的 Application ID
        </h3>
        <p className="font-mono text-gold tabular text-2xl sm:text-3xl tracking-tight my-6 font-light text-center break-all px-4">
          {state.applicationId}
        </p>
        <p className="text-mute text-sm max-w-md mx-auto leading-relaxed text-center mb-6">
          請保留此編號做後續參考。 您應該已經收到一封 confirmation
          email(主旨開頭「✓ ZONE 27 · Founders 27 申請已收到」)·
          沒收到請檢查 spam folder 或 reply tim@zone27.tw。
        </p>

        <div className="mt-8 pt-6 border-t border-line/40">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4 text-center">
            接下來的流程
          </p>
          <ol className="space-y-3 text-mute text-sm leading-relaxed max-w-md mx-auto">
            <li>
              <span className="font-mono text-bone tabular mr-2">01</span>{" "}
              <strong className="text-bone">1-3 business days</strong>{" "}
              內 · Tim 親手 review 您的申請
            </li>
            <li>
              <span className="font-mono text-bone tabular mr-2">02</span>{" "}
              通過 → Tim email 您銀行轉帳資訊 +{" "}
              <strong className="text-bone">24 小時 window</strong>{" "}
              完成轉帳
            </li>
            <li>
              <span className="font-mono text-bone tabular mr-2">03</span>{" "}
              未通過 → Tim email 解釋原因 · per{" "}
              <Link
                href="/founders/ledger"
                className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
              >
                /founders/ledger 5-step allocation rules
              </Link>
            </li>
            <li>
              <span className="font-mono text-bone tabular mr-2">04</span>{" "}
              轉帳完成 → 您 Founder ID{" "}
              <span className="text-bone font-mono">#008-#270</span> 鎖定 ·
              永久 lifetime access · NT$ 2,700 永不調漲
            </li>
          </ol>
        </div>

        <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-8 text-center">
          想取消申請?reply CANCEL · Tim 手動移除 · 不用 click track link
        </p>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────
  return (
    <form
      action={formAction}
      className="bg-slate/70 border border-gold/40 glow-soft p-8 sm:p-10"
    >
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        FOUNDERS 27 · PATEK ALLOCATION FORM
      </p>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
        申請 Founders 27 創始席位
      </h3>
      <p className="text-mute text-sm mb-8 leading-relaxed">
        Tim 親手 review 每一份申請 · 1-3 business days · per{" "}
        <Link
          href="/founders/ledger"
          className="text-gold underline-offset-4 hover:underline"
        >
          /founders/ledger
        </Link>{" "}
        5-step allocation rules。{" "}
        <strong className="text-bone">
          這不是註冊表單 · 是 Patek-style application
        </strong>{" "}
        · 通過後您才會收到付款方式。
      </p>

      {/* Email */}
      <label className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          EMAIL · 必填
        </span>
        <input
          type="email"
          name="email"
          required
          aria-required="true"
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
      </label>

      {/* Name */}
      <label className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          稱呼 · 必填 · 真名 OK · 球迷暱稱也 OK
        </span>
        <input
          type="text"
          name="name"
          required
          aria-required="true"
          placeholder="Tim · 或 球迷暱稱"
          autoComplete="nickname"
          maxLength={FOUNDERS_APPLY_LIMITS.nameMaxChars}
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
      </label>

      {/* CPBL Connection */}
      <label className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          您與 CPBL 的關係 · 必填
        </span>
        <input
          type="text"
          name="cpbl_connection"
          required
          aria-required="true"
          placeholder="例:統一獅球迷 15 年 · 從興農牛時代開始看"
          maxLength={FOUNDERS_APPLY_LIMITS.cpblConnectionMaxChars}
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
        <span className="block mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
          ⚓ 哪一隊 · 球迷多久 · 任何 CPBL 細節都可以 · 我看的不是
          credential · 是 fan-grammar authentic
        </span>
      </label>

      {/* Why ZONE 27 */}
      <label className="block mb-6">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          為什麼想成為 FOUNDER · 必填 · {FOUNDERS_APPLY_LIMITS.whyMinChars}-
          {FOUNDERS_APPLY_LIMITS.whyMaxChars} 字
        </span>
        <textarea
          name="why_zone27"
          required
          aria-required="true"
          rows={6}
          placeholder="您 ZONE 27 哪一頁讓您決定要申請的?(/audit · /methodology · /track-record · /founders/ledger 等)為什麼這頁 hit?Tim 不要 marketing 答案 · 要您真實 reasoning 邏輯。"
          minLength={FOUNDERS_APPLY_LIMITS.whyMinChars}
          maxLength={FOUNDERS_APPLY_LIMITS.whyMaxChars}
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm leading-relaxed resize-y"
        />
        <span className="block mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
          ⚓ Tim 看的不是長度 · 是 specificity。 一句「我喜歡你們的
          /audit Section 05」 比 500 字 generic「I love sabermetrics」 高
          10 倍 weight。
        </span>
      </label>

      <SubmitButton />

      {/* Inline error · role="alert" + aria-live for screen readers · same
          R56 W-A WCAG 2.1 SC 4.1.3 Status Messages compliance pattern as
          WaitlistForm · plus R67 W-D Tetlock exhaustive helper */}
      <div
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        className="min-h-[1rem]"
      >
        {state && !state.ok && (
          <p className="mt-4 font-mono text-loss text-xs sm:text-sm tracking-[0.2em] text-center">
            {getFoundersApplyErrorMessage(state.error)}
          </p>
        )}
      </div>

      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-6 text-center leading-relaxed">
        提交此 form 不代表您已付款 · 您只是進 Tim manual review queue ·
        通過後您會收到銀行資訊 + 24h transfer window
      </p>
    </form>
  );
}
