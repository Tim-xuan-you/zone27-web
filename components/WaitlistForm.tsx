"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { reserveSpot, type WaitlistResult } from "@/lib/waitlist";
import CopyLinkButton from "@/components/CopyLinkButton";

// ── Submit button — disables while pending, shows spinner ───
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
      {pending ? "▸ 正在預留位置 ..." : "立即預留我的位置 →"}
    </button>
  );
}

// ── Main form ──────────────────────────────────────────
type WaitlistFormProps = {
  // Aggregate waitlist count fetched server-side. -1 means the DB call
  // failed; in that case we hide the indicator entirely rather than
  // showing a misleading "0".
  waitlistCount?: number;
  // Channel-attribution tag captured from URL ?ref=… on /founders.
  // Stored in DB as `source` so Tim's future admin view can group by
  // share channel. Falls back to a default if not provided.
  refSource?: string;
};

export default function WaitlistForm({
  waitlistCount = -1,
  refSource,
}: WaitlistFormProps) {
  const [state, formAction] = useActionState<WaitlistResult | null, FormData>(
    reserveSpot,
    null
  );
  const showLiveCount = Number.isFinite(waitlistCount) && waitlistCount >= 0;

  // ── Success state ────────────────────────────────────
  if (state?.ok) {
    const pos = String(state.queuePos).padStart(3, "0");
    return (
      <div className="bg-slate/70 border border-gold/60 glow-soft p-10 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          {state.alreadyReserved ? "✓ 您已在等候名單上" : "✓ 預留成功"}
        </p>
        <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
          您在等候名單上的位置
        </h3>
        <p className="font-mono text-gold tabular text-6xl sm:text-7xl tracking-tight my-6 font-light">
          # {pos}
        </p>
        <p className="text-mute text-sm max-w-sm mx-auto leading-relaxed">
          當付款系統正式開放(預計 Q3 2026),我們會優先通知您。
          您的位置已被保留。
        </p>
        <p className="font-mono text-mute text-[11px] sm:text-[12px] tracking-[0.3em] mt-8">
          目前不收費 · 不綁定 · 隨時可退出
        </p>

        {/* Round 11 · ONE BIG THING fix:
            Post-submit was dead-end with only CopyLinkButton.
            Visitor in peak commitment-consistency state (Cialdini)
            deserves 3 CTAs · not 1. Per Round 11 agent finding:
            "highest-trust moment in funnel" → was dead-end → now hub.

            Order intentional:
            1. /matches/cpbl-260521-01 · fulfill credibility promise the
               brand was built on (see today's engine prediction)
            2. /lab · engagement lever (deepen into engine demo)
            3. CopyLinkButton · tertiary share-the-wall (commitment-
               consistency · "the next ask after waitlist") */}
        <div className="mt-10 pt-6 border-t border-line/40 space-y-4">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2">
            您可以接著做的事
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/matches/cpbl-260521-01"
              className="block border border-gold/40 hover:border-gold p-4 group transition-colors text-left"
            >
              <p
                lang="en"
                className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-1"
              >
                / TONIGHT
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                看今晚引擎預測這場 →
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.2em] mt-1 tabular">
                統一 vs 富邦 · 18:35 新莊
              </p>
            </Link>
            <Link
              href="/lab"
              className="block border border-line/60 hover:border-gold/40 p-4 group transition-colors text-left"
            >
              <p
                lang="en"
                className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1"
              >
                / ENGINE
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                在 /lab 親手跑一場 →
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.2em] mt-1">
                10,000 場 Monte Carlo · 在您瀏覽器
              </p>
            </Link>
          </div>

          {/* Tertiary: share-the-wall (was the only action · now footnote) */}
          <div className="pt-4 border-t border-line/40">
            <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-3 text-center">
              或把這扇門傳給朋友 ·
              <span lang="en"> SHARE THE WALL</span>
            </p>
            <CopyLinkButton refTag={`reserve-${pos}`} />
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────
  return (
    <form
      action={formAction}
      className="bg-slate/70 border border-gold/40 glow-soft p-8 sm:p-10"
    >
      {/* Hidden channel-attribution tag. Captures ?ref= from URL so the
          DB knows which share channel produced this signup. */}
      {refSource && <input type="hidden" name="ref" value={refSource} />}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          創始會員 · 預售等候名單
        </p>
        {showLiveCount && (
          <p
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.3em] flex items-center gap-2"
            aria-label={`Live waitlist count: ${waitlistCount} readers`}
          >
            <span
              className="w-1 h-1 rounded-full bg-gold/80 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(212, 175, 55, 0.6)" }}
              aria-hidden="true"
            />
            <span className="tabular">
              WAITLIST · {waitlistCount} · LIVE
            </span>
          </p>
        )}
      </div>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
        留下 email,保留您的位置
      </h3>
      <p className="text-mute text-sm mb-8 leading-relaxed">
        付款系統尚未開放。先進入等候名單,我們會在正式開放預訂時 email 您。
        <span className="text-bone font-medium">
          {" "}不收費、不綁定、隨時可退出。
        </span>
      </p>

      {/* Email field */}
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
          className="w-full bg-ink/60 border border-line/70 focus:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
      </label>

      {/* Name field (optional) */}
      <label className="block mb-8">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          稱呼 · 選填
        </span>
        <input
          type="text"
          name="name"
          placeholder="Tim"
          autoComplete="given-name"
          className="w-full bg-ink/60 border border-line/70 focus:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
      </label>

      <SubmitButton />

      {/* Inline error · role="alert" + aria-live for screen readers
          to announce submission failure immediately. Without these,
          a blind user submitting an invalid email would see no feedback
          (the visual text never makes it to assistive tech). Caught by
          3rd-pass audit · WCAG 2.1 SC 4.1.3 Status Messages compliance. */}
      <div role="alert" aria-live="polite" aria-atomic="true" className="min-h-[1rem]">
        {state && !state.ok && (
          <p className="mt-4 font-mono text-loss text-xs sm:text-sm tracking-[0.2em] text-center">
            {state.error === "missing_email"
              ? "請填寫 EMAIL"
              : state.error === "invalid_email"
              ? "EMAIL 格式不正確"
              : "系統暫時無法處理 · 請稍後再試"}
          </p>
        )}
      </div>

      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-6 text-center">
        我們永遠不會分享您的 email · 隨時可退出
      </p>
    </form>
  );
}
