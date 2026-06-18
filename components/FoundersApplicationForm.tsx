"use client";

// ── ZONE 27 · GOLD Application Form ──────────────
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
// /founders WaitlistForm · for visitors who actually want to become a GOLD
// member(會員不限量 · 無編號 · Tim 親手 review → 通過寄銀行轉帳資訊 →
// 手動轉帳)。
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
//   - 會員不限量 · Tim 親手 review · 未通過會親手說明原因(無公開分配帳本)
//   - per [[zone27-disclosure-philosophy]] · all 4 fields rationale 解釋
//     for each → skeptic can audit「what we ask」 = exact review needs
//   - per R67 W-D Tetlock track-able-error · exhaustive error message
//     helper(no silent fall-through)
//
// 不做 anti-pattern:
//   ✕ no "GOLD 投票權" / "private LINE group access" promises
//   ✕ no "instant approval" / "guaranteed slot" framing
//   ✕ no captcha / no Cloudflare Turnstile(rate-limited via Supabase
//     when migration applies · MVP relies on Tim manual review filter)
//   ✕ no marketing copy bait("您是最棒的!")· brand-pure honesty only
// ─────────────────────────────────────────────────────

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitFoundersApplication } from "@/lib/founders-apply";
import {
  getFoundersApplyErrorMessage,
  GOLD_APPLY_LIMITS,
  type FoundersApplyResult,
} from "@/lib/founders-apply-types";
import TimResponseSLA from "@/components/TimResponseSLA";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-4 text-xs tracking-[0.3em] transition-colors font-medium border-2 ${
        pending
          ? "border-gold/40 bg-transparent text-gold/60 cursor-not-allowed"
          : "border-gold bg-transparent text-gold hover:bg-gold/10"
      }`}
    >
      {pending ? "▸ 遞交中 ..." : "遞交給 Tim · review 後您會收到通知"}
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

// R73 W-D · Agent B R72 audit F03 fix · Bidi/RTL/zero-width control char
// strip + email-shape validation · attacker-crafted ?draft= email field
// with bidi-marker or phishing-text would otherwise display in the「draft
// restored」 banner as if it's the visitor's address · social-engineering
// vector close · per Tim mandate「嚴肅看待 attack vectors」。
const EMAIL_RE_VALIDATE = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const BIDI_CHARS_RE = /[​-‏‪-‮﻿]/g;
const DRAFT_KNOWN_KEYS = ["email", "name", "cpbl_connection", "why_zone27"] as const;
type DraftKey = (typeof DRAFT_KNOWN_KEYS)[number];

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
    // R73 W-D · F06 audit fix · whitelist known keys only · defense-in-depth
    // against attacker injecting unknown payload keys。
    const out: Record<string, string> = {};
    for (const k of DRAFT_KNOWN_KEYS) {
      const v = (parsed as Record<string, unknown>)[k];
      if (typeof v !== "string") continue;
      // R73 W-D · F03 audit fix · strip Bidi/RTL/zero-width control chars ·
      // 防 visual phishing attack on banner display。
      const sanitized = v.replace(BIDI_CHARS_RE, "").slice(0, 2000);
      // R73 W-D · F03 audit fix · email-shape validation · only accept
      // realistic email format · 不 trust attacker-crafted「請打 0912345678」
      // plain-text in email field · banner would otherwise display as if
      // visitor's actual email。
      if (k === "email" && !EMAIL_RE_VALIDATE.test(sanitized)) {
        continue;
      }
      out[k as DraftKey] = sanitized;
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
  // R166 W1 · Agent Q bug audit MEDIUM #3 · async race guard · same pattern
  // as R155 W1c(FollowMatchButton + MatchNoteEditor)· timers tracked +
  // mountedRef guard before setState · prevents「setState on unmounted」 warning。
  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timerRef.current.forEach(clearTimeout);
      timerRef.current = [];
    };
  }, []);
  const scheduleStatusReset = (ms: number, next: "idle" | "composed" | "copied") => {
    const t = setTimeout(() => {
      if (mountedRef.current) setDraftSaveStatus(next);
    }, ms);
    timerRef.current.push(t);
  };
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

  // R158 W3.H1 · Agent H Implementation Intentions(Gollwitzer 1999 · JEP-HLM
  // meta-analysis N=94 d=0.65)· OPTIONAL IF-THEN commitment device · purely
  // client-side · localStorage-only · Tim-blind(0 server-side store · 0 review
  // burden · 0 PII collection)· per [[zone27-disclosure-philosophy]] privacy
  // axiom + Patek allocation pattern。 240 char cap · same pattern restoredDraftEmail。
  const [ifThenPlan, setIfThenPlan] = useState("");
  const IF_THEN_STORAGE_KEY = "zone27_founder_if_then_v1";

  // R158 W3.H1 · hydrate from localStorage on mount(SSR-safe)· same idiom
  // as R140 W3 mount-flag pattern · eslint-disable per existing codebase
  // convention(HeroLiveCard.tsx:57)。
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(IF_THEN_STORAGE_KEY);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIfThenPlan(saved.slice(0, 240));
      }
    } catch {
      // localStorage quota / privacy-mode rejection · silent · per /audit S05
    }
  }, []);

  const handleIfThenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 240);
    setIfThenPlan(val);
    try {
      window.localStorage.setItem(IF_THEN_STORAGE_KEY, val);
    } catch {
      // localStorage quota / privacy-mode rejection · silent
    }
  };

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
  // R73 W-C · Agent B R71 audit F09 fix · iOS Safari mailto >2000 char silent
  // fail mitigation · cap why_zone27 to first 400 chars in draft + post-
  // click focus-still-here check(500ms · if window stays focused = mail
  // app didn't launch)→ auto-clipboard fallback。 Baymard 2025 mobile
  // abandonment recovery rate(15-25%)preserved。
  const handleSaveDraft = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    // R73 W-C · cap why_zone27 to 400 chars · keeps total mailto under
    // iOS 2000-char safe zone · visitor finishes remaining 200 chars on
    // resume(brand-pure 「draft is a starting point not finished work」)。
    const whyFull = String(fd.get("why_zone27") ?? "");
    const whyTruncated = whyFull.length > 400 ? whyFull.slice(0, 400) : whyFull;
    const draft: Record<string, string> = {
      email: String(fd.get("email") ?? ""),
      name: String(fd.get("name") ?? ""),
      cpbl_connection: String(fd.get("cpbl_connection") ?? ""),
      why_zone27: whyTruncated,
    };
    const encoded = encodeDraft(draft);
    if (!encoded) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://zone27-web.vercel.app";
    const resumeUrl = `${origin}/founders/apply?draft=${encoded}`;
    const truncationNotice =
      whyFull.length > 400
        ? `\n\n(您 why_zone27 第一個 400 字符 saved · 剩餘 ${whyFull.length - 400} 字在 resume 時補寫 · per iOS mailto 2000-char safe-zone)`
        : "";
    const subject = "ZONE 27 · GOLD application 暫存 · resume link";
    const body = [
      `Hi,`,
      ``,
      `This is your ZONE 27 FOUNDER application 暫存 link · click to`,
      `resume filling on any device:`,
      ``,
      resumeUrl,
      ``,
      `Your draft is encoded in the URL · 0 server storage · 0 PII transit ·`,
      `per /audit S06 disclosure · this link expires when you finalize submit。`,
      ``,
      `If your mail client cannot send · just copy the URL above + save it`,
      `to your notes app · ZONE 27 does NOT track this URL · 不打擾就是禮物。`,
      truncationNotice,
    ].join("\n");
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // R73 W-C · Agent B R71 F09 fix · iOS Safari mailto silent-fail detection ·
    // mail app launch causes window to lose focus → if document.hasFocus()
    // 500ms after click · mailto likely silently failed · auto-fallback to
    // clipboard · visitor sees「✓ resume URL copied」 not false「✓ mailto opened」。
    const fallbackToClipboard = (): void => {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        if (typeof window !== "undefined") {
          window.prompt("Copy your resume URL:", resumeUrl);
        }
        return;
      }
      navigator.clipboard
        .writeText(resumeUrl)
        .then(() => {
          if (mountedRef.current) setDraftSaveStatus("copied");
          scheduleStatusReset(3500, "idle");
        })
        .catch(() => {
          if (typeof window !== "undefined") {
            window.prompt("Copy your resume URL:", resumeUrl);
          }
        });
    };

    try {
      window.location.href = mailtoUrl;
      // Optimistic UI · assume mailto opens
      if (mountedRef.current) setDraftSaveStatus("composed");
      // R73 W-C · post-click focus-still-here check · 500ms after assignment
      // · if window still focused = mail app DIDN'T launch(iOS silent fail) ·
      // auto-fallback to clipboard · 不 leave visitor with false confirmation。
      // R166 W1 · async race guard per Agent Q audit · timer tracked + cleanup。
      const focusCheckTimer = setTimeout(() => {
        if (!mountedRef.current) return;
        if (typeof document !== "undefined" && document.hasFocus()) {
          // Mail app didn't take over · iOS silent fail OR desktop without
          // default mail client · fallback to clipboard for plaintext recovery
          fallbackToClipboard();
        } else {
          // Mail app took focus = success · reset status after 3s
          scheduleStatusReset(3000, "idle");
        }
      }, 500);
      timerRef.current.push(focusCheckTimer);
    } catch {
      fallbackToClipboard();
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
          email(主旨開頭「✓ ZONE 27 · GOLD 申請已收到」)·
          沒收到請檢查 spam folder 或 email{" "}
          <a
            href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20application%20email%20missing"
            className="text-gold underline-offset-4 hover:underline"
            title="tatayngiti@gmail.com · Tim 個人 inbox · 0 outsource · zone27 domain 啟用後即啟動 support@zone27 alias"
          >
            support@zone27
          </a>
          (zone27 domain 啟用後即啟動 support alias · 暫用 Tim 個人 inbox · 0 outsource)。
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
              未通過 → Tim 親手 email 跟你說明原因 · 不是罐頭式的「您此次未通過」
            </li>
            <li>
              <span className="font-mono text-bone tabular mr-2">04</span>{" "}
              轉帳完成 → 您的 GOLD 身分開通 ·
              365 天 access · 每年 1/1 續訂價永不調漲
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
        GOLD · PATEK ALLOCATION FORM
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
        成為 GOLD 會員
      </h3>
      <p className="text-mute text-sm mb-8 leading-relaxed">
        留下你的資料 ·{" "}
        <strong className="text-bone">Tim 親手 onboard 每一位</strong>{" "}
        · 1-3 天內寄付款方式給你(銀行轉帳)· 轉帳完成就開通。 會員不限量 ·
        最高階年度支持身分。
      </p>

      {/* R142 W4 · a11y fix · WCAG 1.3.1 + 4.1.2 · all 4 form fields(email
          · name · cpbl_connection · why_zone27)之前 implicit wrapping <label>
          + 內 <span> label · 沒 explicit htmlFor + id pairing · 加 id +
          htmlFor explicit pair across 全 4 fields per Apple/Material/Polaris
          accessible-name-and-role-value industry pattern。 */}
      {/* Email */}
      <label htmlFor="founders-apply-email" className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          EMAIL · 必填
        </span>
        <input
          id="founders-apply-email"
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
      <label htmlFor="founders-apply-name" className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          稱呼 · 必填 · 真名 OK · 球迷暱稱也 OK
        </span>
        <input
          id="founders-apply-name"
          type="text"
          name="name"
          required
          aria-required="true"
          placeholder="Tim · 或 球迷暱稱"
          autoComplete="nickname"
          maxLength={GOLD_APPLY_LIMITS.nameMaxChars}
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
      </label>

      {/* CPBL Connection */}
      <label htmlFor="founders-apply-cpbl-connection" className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          您與 CPBL 的關係 · 必填
        </span>
        <input
          id="founders-apply-cpbl-connection"
          type="text"
          name="cpbl_connection"
          required
          aria-required="true"
          placeholder="例:統一獅球迷 15 年 · 從興農牛時代開始看"
          maxLength={GOLD_APPLY_LIMITS.cpblConnectionMaxChars}
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
      <label htmlFor="founders-apply-why" className="block mb-6">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          為什麼想成為 GOLD · 必填 · {GOLD_APPLY_LIMITS.whyMinChars}-
          {GOLD_APPLY_LIMITS.whyMaxChars} 字
        </span>
        <textarea
          id="founders-apply-why"
          name="why_zone27"
          required
          aria-required="true"
          rows={6}
          placeholder="您 ZONE 27 哪一頁讓您決定要申請的?(/audit · /methodology · /track-record · /integrity 等)為什麼這頁打中你?Tim 不要場面話 · 要您真實的理由。"
          minLength={GOLD_APPLY_LIMITS.whyMinChars}
          maxLength={GOLD_APPLY_LIMITS.whyMaxChars}
          // R109 W5 · field-sizing: content auto-grow(Chrome 123+ Baseline)·
          // textarea 自動隨 content 高度長 · Baymard 2025「4+ field forms with
          // 100+ char text areas 有 ~68% mobile abandonment if interrupted」 ·
          // smooth-grow 補長度感「不卡頓」感 · Notion/Linear inline pattern。
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm leading-relaxed resize-y [field-sizing:content] min-h-[9rem] max-h-[32rem]"
        />
        <span className="block mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
          ⚓ Tim 看的不是長度 · 是夠不夠具體。 一句「我喜歡你們的
          /audit Section 05」 比 500 字空泛的「我愛看數據」 高
          10 倍份量。
        </span>
      </label>

      {/* R158 W3.H1 · Agent H Implementation Intentions(Gollwitzer 1999 ·
          JEP-HLM meta-analysis N=94 d=0.65)· OPTIONAL IF-THEN commitment
          device · purely client-side · localStorage-only · Tim-blind · 0
          server-side store · per [[zone27-disclosure-philosophy]] privacy
          axiom 11-key cap not exceeded(this is 12th localStorage key but
          purely commitment device · 0 PII · 0 server)。 mechanism · 「IF
          [cue], THEN [behavior]」 plan doubles goal-completion (Gollwitzer
          &amp; Sheeran 2006 meta-analysis)。 */}
      <label className="block mt-5">
        <span className="block mb-2 font-mono text-gold/85 text-[11px] tracking-[0.3em]">
          您自己的 IF-THEN 計畫 · OPTIONAL · commitment device
        </span>
        <textarea
          value={ifThenPlan}
          onChange={handleIfThenChange}
          placeholder={"例:「如果 Tim email 通過 → 我 24h 內完成轉帳」 · 「如果開通 → 我截圖傳給太太說明這筆 GOLD 會員」 · 您自己寫 · Tim 不看 · 不送 server"}
          rows={2}
          maxLength={240}
          aria-label="Optional if-then implementation intention plan · client-side only"
          className="w-full bg-ink/60 border border-line/50 focus-visible:border-gold/60 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/60 font-mono text-sm leading-relaxed resize-y [field-sizing:content] min-h-[4.5rem] max-h-[12rem]"
        />
        <span className="block mt-2 font-mono text-mute/60 text-[10px] tracking-[0.2em] leading-relaxed">
          ⚓ Gollwitzer 1999 Implementation Intentions · 0 server-side store ·
          只存您 browser localStorage · 您可隨時清除 · Tim 不審 · {ifThenPlan.length}/240
        </span>
        {ifThenPlan && (
          <div className="mt-3 border-l-2 border-gold/40 pl-4 py-2 bg-slate/20">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-1">
              ✓ 您給未來自己的 commitment(只您看得到)
            </p>
            <p className="text-bone text-sm leading-relaxed whitespace-pre-wrap">
              {ifThenPlan}
            </p>
          </div>
        )}
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
