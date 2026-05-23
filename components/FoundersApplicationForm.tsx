"use client";

// ── ZONE 27 · Founders 27 Application Form ──────────────
// R69 W-G · Agent B audit F8 fix · success state focus management ·
// WCAG 2.4.3 Focus Order + 4.1.3 Status Messages · 訪客 submit 後
// focus 自動移到 success container · role="status" + aria-live · 不
// 失去 keyboard / screen reader context。
//
// R71 W-B · Agent A R70 SHIP 3 deferred · DraftSaveLink · Patek-dealer
// 「save your wishlist」 + Apple Pro hardware「save configuration」 +
// Wayback Machine plaintext-URL state pattern。 Mobile abandonment
// recovery for the 4-7 minute「why_zone27」 textarea writing time ·
// per Baymard 2025: 4+ field forms with 100+ char text areas have
// ~68% mobile abandonment if interrupted · draft-save recovers 15-25%。
//
// Architecture:
//   - 0 server storage · 0 Supabase · 0 PII transit
//   - Draft encoded base64-UTF8 into mailto: body URL
//   - Visitor's own email holds draft state(Apple Mail / Gmail / etc)
//   - Resume link → /founders/apply?draft={base64} → useEffect hydrate
//   - No retention · no PII inventory · no /audit S06 storage key needed
//
// Brand IP fit per Agent A R70 SHIP 3:
//   - per [[zone27-disclosure-philosophy]] · plaintext URL · visitor
//     can audit draft content before mailing
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「we know you're on
//     phone and might leave」 explicit acknowledgment
//   - per 不打擾就是禮物 · NO email follow-up · NO nag · visitor's
//     mailbox = state holder
//
// 不做 anti-pattern:
//   ✕ NO「save to your account」 server-side draft(0 Supabase migration)
//   ✕ NO「reminder email every 24h」 push CTA
//   ✕ NO「abandoned cart」 retargeting email(redline)
//   ✕ NO localStorage draft auto-save(per /privacy 11-key cap discipline)
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

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { submitFoundersApplication } from "@/lib/founders-apply";
import {
  getFoundersApplyErrorMessage,
  FOUNDERS_APPLY_LIMITS,
  type FoundersApplyResult,
} from "@/lib/founders-apply-types";
import TimResponseSLA from "@/components/TimResponseSLA";

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

// R71 W-B · base64-UTF8 helpers for DraftSaveLink · TextEncoder/Decoder
// modern API · safe for Chinese characters(unlike naive btoa which only
// handles Latin-1)· 0 dep · 0 lib · pure browser primitives。
function encodeDraft(obj: Record<string, string>): string {
  if (typeof window === "undefined") return "";
  try {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let binStr = "";
    for (let i = 0; i < bytes.length; i++) binStr += String.fromCharCode(bytes[i]);
    return window.btoa(binStr);
  } catch {
    return "";
  }
}

function decodeDraft(b64: string): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const binStr = window.atob(b64);
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return null;
    // Validate all values are strings · defense-in-depth against malformed
    // resume URLs from attacker(no exec via stored XSS · just hydration source)
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v !== "string") continue;
      out[k] = v.slice(0, 2000); // hard cap to prevent huge URLs
    }
    return out;
  } catch {
    return null;
  }
}

export default function FoundersApplicationForm() {
  const [state, formAction] = useActionState<
    FoundersApplyResult | null,
    FormData
  >(submitFoundersApplication, null);
  const successRef = useRef<HTMLDivElement>(null);
  // R71 W-B · DraftSaveLink form ref · enables read FormData ad-hoc when
  // save-draft clicked · doesn't change form's existing useActionState
  // uncontrolled-input contract。
  const formRef = useRef<HTMLFormElement>(null);
  const [draftSaveStatus, setDraftSaveStatus] = useState<
    "idle" | "composed" | "copied"
  >("idle");
  // R72 W-D · Agent B audit F04 fix · visible「draft restored」 banner ·
  // social-engineering attack vector(attacker-crafted ?draft= link auto-
  // fills visitor's form with attacker email · visitor inattentively submits
  // → Tim emails confirmation to attacker)closed by exposing draft email
  // for re-confirmation。 Visitor see「draft restored · email: X · clear」 ·
  // Gmail draft-restored UX pattern。
  const [restoredDraftEmail, setRestoredDraftEmail] = useState<string | null>(
    null,
  );

  // R69 W-G · Agent B audit F8 fix · move focus to success container
  // when submission succeeds · keyboard + SR users not orphaned。
  useEffect(() => {
    if (state?.ok) {
      successRef.current?.focus();
    }
  }, [state?.ok]);

  // R71 W-B · DraftSaveLink hydration · read ?draft= URL param on mount ·
  // base64-UTF8 decode · pre-populate uncontrolled inputs via DOM API。
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const draftParam = params.get("draft");
    if (!draftParam || !formRef.current) return;
    const decoded = decodeDraft(draftParam);
    if (!decoded) return;
    // Hydrate each known field if present in draft · uncontrolled value set
    const fields = ["email", "name", "cpbl_connection", "why_zone27"] as const;
    for (const f of fields) {
      const el = formRef.current.elements.namedItem(f);
      if (decoded[f] !== undefined && el instanceof HTMLInputElement) {
        el.value = decoded[f];
      } else if (decoded[f] !== undefined && el instanceof HTMLTextAreaElement) {
        el.value = decoded[f];
      }
    }
    // R72 W-D · Agent B audit F04 fix · surface restored email for visitor
    // re-confirmation · 防 attacker-crafted ?draft= social-engineering vector。
    if (typeof decoded.email === "string" && decoded.email.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestoredDraftEmail(decoded.email);
    }
  }, []);

  // R72 W-D · Agent B audit F04 fix · clear restored draft · visitor click
  // ✕ button reset form to empty(clears restored email banner)。
  const handleClearDraft = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setRestoredDraftEmail(null);
    // Also clean URL by removing ?draft= param · per Wayback Machine
    // plaintext-URL state pattern · 不留 attacker URL in browser history。
    if (typeof window !== "undefined" && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("draft");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // R71 W-B · DraftSaveLink composer · reads current form values · base64
  // encodes · builds mailto: with subject + body containing resume URL ·
  // attempts navigator.clipboard.writeText fallback if mailto: fails。
  const handleSaveDraft = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const draft: Record<string, string> = {
      email: String(fd.get("email") ?? ""),
      name: String(fd.get("name") ?? ""),
      cpbl_connection: String(fd.get("cpbl_connection") ?? ""),
      why_zone27: String(fd.get("why_zone27") ?? ""),
    };
    const encoded = encodeDraft(draft);
    if (!encoded) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://zone27-web.vercel.app";
    const resumeUrl = `${origin}/founders/apply?draft=${encoded}`;
    const subject = "ZONE 27 · Founders 27 application 暫存 · resume link";
    const body = [
      `Hi,`,
      ``,
      `This is your ZONE 27 Founders 27 application 暫存 link · click to`,
      `resume filling on any device:`,
      ``,
      resumeUrl,
      ``,
      `Your draft is encoded in the URL · 0 server storage · 0 PII transit ·`,
      `per /audit S06 disclosure · this link expires when you finalize submit。`,
      ``,
      `If your mail client cannot send · just copy the URL above + save it`,
      `to your notes app · ZONE 27 does NOT track this URL · 不打擾就是禮物。`,
    ].join("\n");
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      window.location.href = mailtoUrl;
      setDraftSaveStatus("composed");
      window.setTimeout(() => setDraftSaveStatus("idle"), 3500);
    } catch {
      // Fallback · copy resume URL to clipboard
      navigator.clipboard
        ?.writeText(resumeUrl)
        .then(() => {
          setDraftSaveStatus("copied");
          window.setTimeout(() => setDraftSaveStatus("idle"), 3500);
        })
        .catch(() => {
          window.prompt("Copy your resume URL:", resumeUrl);
        });
    }
  };

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
          沒收到請檢查 spam folder 或 email{" "}
          <a
            href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20application%20email%20missing"
            className="text-gold underline-offset-4 hover:underline"
          >
            tatayngiti@gmail.com
          </a>
          (zone27.tw domain 尚未啟用 · R70 W-G fix from R68 stale ref)。
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
      ref={formRef}
      action={formAction}
      className="bg-slate/70 border border-gold/40 glow-soft p-8 sm:p-10"
    >
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        FOUNDERS 27 · PATEK ALLOCATION FORM
      </p>

      {/* R72 W-D · Agent B audit F04 fix · visible「draft restored」 banner ·
          Gmail draft-restored UX pattern · 防 attacker-crafted ?draft= URL
          social-engineering vector · visitor sees email pre-filled + 「clear
          & start fresh」 button · re-confirmation required before submit。 */}
      {restoredDraftEmail && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 border border-gold/40 bg-gold/5 px-4 py-3 flex items-baseline justify-between gap-3 flex-wrap"
        >
          <p className="font-mono text-mute text-[11px] tracking-[0.22em] leading-relaxed flex-1">
            <span className="text-gold/85 mr-2" aria-hidden="true">✦</span>
            Draft restored from email · email:{" "}
            <strong className="text-bone tabular">{restoredDraftEmail}</strong>
            {" "}· 確認是您的 email 再 submit
          </p>
          <button
            type="button"
            onClick={handleClearDraft}
            aria-label="Clear restored draft and start fresh"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.22em] underline-offset-4 hover:underline transition-colors shrink-0"
          >
            ✕ clear & start fresh
          </button>
        </div>
      )}

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

      {/* R71 W-B · DraftSaveLink · Agent A R70 SHIP 3 · Patek-dealer 「save
          wishlist」 + Apple Pro 「save configuration」 + Wayback Machine
          plaintext-URL state pattern · mobile abandonment recovery for the
          4-7 min why_zone27 writing window · 0 server / 0 PII / 0
          localStorage · visitor's own email holds draft state · click =
          mailto: composed with subject + body containing resume URL。 */}
      <div className="mb-8 -mt-2 flex items-baseline justify-between gap-3 flex-wrap pb-2 border-b border-line/40">
        <p className="font-mono text-mute/60 text-[10px] tracking-[0.22em] leading-relaxed">
          ⚓ 寫到一半要忙別的?暫存到您自己 email · 等等回來填完 ·
          0 server / 0 PII / 0 cookie
        </p>
        <button
          type="button"
          onClick={handleSaveDraft}
          aria-label="Save draft to your own email · resume link in mailto body"
          className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors shrink-0"
        >
          {draftSaveStatus === "composed"
            ? "✓ mailto opened · check 您 email"
            : draftSaveStatus === "copied"
              ? "✓ resume URL copied · paste 您 notes"
              : "暫存 → 寄到我的 email →"}
        </button>
      </div>

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

      {/* R72 W-B · TimResponseSLA · Agent A R72 SHIP 6 · Patek dealer
          personal call promise + Stripe Atlas application response SLA +
          Linear 2019 invite-only pattern · bridge between R68 W-G
          PreTransferReceipt 5-step choreography(what happens AFTER click)
          + submit-button friction(what Tim physically commits to NOW)·
          pre-launch honest empty values · post-Founder-#001 Tim updates
          lib/founder-sla.ts manually weekly · per /audit S05 PRE-COMMIT。 */}
      <TimResponseSLA />

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
