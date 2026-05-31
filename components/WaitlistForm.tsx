"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { reserveSpot } from "@/lib/waitlist";
import {
  getWaitlistErrorMessage,
  type WaitlistResult,
} from "@/lib/waitlist-types";
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
      // Round 18 motion polish (Agent A #5 · @starting-style) · success
      // card fade-ups 320ms when form submits · peak commitment moment
      // (Cialdini & Trope 1976) deserves a cinematic settle · not pop-in.
      <div className="bg-slate/70 border border-gold/60 glow-soft p-10 text-center enter-fade-up">
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
          當 payment infra 就緒 + 付款系統正式開放(milestone-triggered · 不綁日期),
          我們會優先通知您。 您的位置已被保留。
        </p>
        <p className="font-mono text-mute text-[11px] sm:text-[12px] tracking-[0.3em] mt-8">
          目前不收費 · 不綁定 · 隨時可退出
        </p>

        {/* Round 11 · ONE BIG THING fix: post-submit was dead-end.
            Round 12 conversion-funnel audit refined the hub ordering.
            Commitment-consistency peaks within seconds of submit
            (Cialdini & Trope 1976) — the FIRST ask must be the
            highest-leverage one. For a stealth-mode no-ads brand,
            that's the share-the-wall act (each signup must produce
            2-3 referrals to compound waitlist growth).

            Round 12 order:
            1. SHARE (PROMOTED · primary grid · gold-filled card) ·
               peak-moment referral capture
            2. /matches/cpbl-260521-01 (still primary · receipt promise)
            3. /lab (DEMOTED to tertiary footnote · engagement-not-
               acquisition action) */}
        <div className="mt-10 pt-6 border-t border-line/40 space-y-4">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2">
            您可以接著做的事
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {/* SHARE card (PRIMARY · gold-filled · highest-leverage) */}
            <div className="border border-gold/50 bg-gold/5 p-4 text-left">
              <p
                lang="en"
                className="font-mono text-gold text-[9px] tracking-[0.3em] mb-1"
              >
                / SHARE
              </p>
              <p className="text-bone text-sm leading-snug mb-3">
                傳給 27 位真懂的人 →
              </p>
              <CopyLinkButton refTag={`reserve-${pos}`} />
            </div>
            {/* TONIGHT card (still primary · receipt-promise route) */}
            <Link
              href="/matches/cpbl-260521-01"
              className="block border border-line/60 hover:border-gold/40 p-4 group transition-colors text-left"
            >
              <p
                lang="en"
                className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1"
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
          </div>

          {/* /lab demoted to tertiary footnote text link */}
          <div className="pt-4 border-t border-line/40 text-center">
            <Link
              href="/lab"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
            >
              或在 /lab 親手跑一場 10,000 場模擬 →
            </Link>
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
        {/* Round 24 stale-ref fix(post-Round-21 FREE TIER · Round-23 Nav
            "會員")· kicker 從「創始會員 · 預售等候名單」改成 dual-purpose
            framing · 訪客現在 1 個動作填表 = 自動進入 2 個 tier:免費
            訂閱層(永久)+ Founders 27 預售名單(前 270 拿創始編號 · 開放時優
            先)。原 kicker 把表單框成「只有想當創始會員才填」· bounce
            掉真正只想留 email 的訪客 · 跟下方 Round 21 FREE TIER
            clarifier 邏輯衝突。 */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          ZONE 27 訂閱 · 免費 + Founders 27 預售
        </p>
        {showLiveCount && (
          <p
            role="status"
            aria-live="polite"
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.3em] flex items-center gap-2"
            aria-label={
              waitlistCount === 0
                ? "Waitlist is empty · be the first in line"
                : waitlistCount < 30
                ? `${waitlistCount} people earlier than you · you would be queue position ${waitlistCount + 1}`
                : `Live waitlist count: ${waitlistCount} readers`
            }
          >
            <span
              className="w-1 h-1 rounded-full bg-gold/80 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(212, 175, 55, 0.6)" }}
              aria-hidden="true"
            />
            {/* Round 12 funnel-audit: small absolute N reads as anti-
                social-proof ("only 7 care"). Reframe sub-30 as queue
                position — "X earlier · you would be #N+1" triggers loss
                aversion (Cialdini Ch.4 · Robinson 2003). At N≥30 absolute
                count starts working as social proof on its own. */}
            <span className="tabular">
              {waitlistCount === 0
                ? "WAITLIST · BE THE FIRST IN LINE"
                : waitlistCount < 30
                ? `${waitlistCount} EARLY · YOU'D BE #${String(waitlistCount + 1).padStart(3, "0")}`
                : `WAITLIST · ${waitlistCount} · LIVE`}
            </span>
          </p>
        )}
      </div>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
        留下 email · 加入 ZONE 27
      </h3>
      <p className="text-mute text-sm mb-8 leading-relaxed">
        1 個動作 · 同時加入:
        <span className="text-bone font-medium">
          {" "}免費訂閱層(永久免費)
        </span>
        {" "}+{" "}
        <span className="text-bone font-medium">
          Founders 27 預售名單
        </span>
        (開放時優先取得購買權)。
        <br />
        <span className="text-bone font-medium">
          不收費、不綁定、隨時可退出。
        </span>{" "}
        升級或永遠停在免費層 — 任時您決定。
      </p>

      {/* R142 W4 · a11y fix · WCAG 1.3.1 + 4.1.2 · 之前 implicit wrapping
          <label> + 內 <span> label · 沒 explicit htmlFor + id pairing · screen
          reader 可能 announce 全 <label> 內容(含 helper text)· 加 id +
          htmlFor explicit pair · 同 WCAG accessible-name-and-role-value
          industry pattern · Apple/Material/Polaris 共識。 */}
      {/* Email field */}
      <label htmlFor="waitlist-email" className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          EMAIL · 必填
        </span>
        <input
          id="waitlist-email"
          type="email"
          name="email"
          required
          aria-required="true"
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
      </label>

      {/* Name field (optional) */}
      <label htmlFor="waitlist-name" className="block mb-8">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          稱呼 · 選填
        </span>
        <input
          id="waitlist-name"
          type="text"
          name="name"
          placeholder="Tim"
          autoComplete="given-name"
          className="w-full bg-ink/60 border border-line/70 focus-visible:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/70 font-mono text-sm"
        />
      </label>

      <SubmitButton />

      {/* Inline error · role="alert" + aria-live for screen readers
          to announce submission failure immediately. Without these,
          a blind user submitting an invalid email would see no feedback
          (the visual text never makes it to assistive tech). Caught by
          3rd-pass audit · WCAG 2.1 SC 4.1.3 Status Messages compliance. */}
      {/* R67 W-D · error 訊息 via getWaitlistErrorMessage(single source
          of truth in lib/waitlist-types.ts · R68 W-D audit fix from R67
          stale ref to lib/waitlist.ts)· 替代 inline ternary cascade ·
          新 error code 加入 WAITLIST_ERROR_CODES auto-typesafe surface ·
          consumer 不需要 silently 落到 default branch · Tetlock track-
          able-error discipline 物理 codify。 */}
      <div role="alert" aria-live="polite" aria-atomic="true" className="min-h-[1rem]">
        {state && !state.ok && (
          <p className="mt-4 font-mono text-loss text-xs sm:text-sm tracking-[0.2em] text-center">
            {getWaitlistErrorMessage(state.error)}
          </p>
        )}
      </div>

      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-6 text-center">
        我們永遠不會分享您的 email · 隨時可退出
      </p>
    </form>
  );
}
