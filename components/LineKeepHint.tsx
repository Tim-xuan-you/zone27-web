"use client";

import { useEffect, useState } from "react";

// ── ZONE 27 · LINE Keep Hint ───────────────────────────
// R77 W-B · Agent A R76 SHIP E · LINE Official Account Taiwan opt-in pattern
// + WhatsApp Channels no-push grammar · 長按 → 加到 LINE Keep · 不需加好友 ·
// Asian fan-grammar mobile micro-pattern · uses platform-native long-press
// behavior · ZONE 27 not LINE OA · 不收 friend-add · 不發 push · 純 hint。
//
// The mechanic:
//   - LINE OA Taiwan opt-in requires friend-add gesture · ZONE 27 doesn't
//     have OA · doesn't WANT OA · doesn't WANT friend-add
//   - But Taiwan mobile users habitually long-press text/images to save to
//     LINE Keep(personal note-taking · not chat · not share)
//   - 此 hint surface 「ZONE 27 page → 長按 → LINE Keep」 IS available
//     WITHOUT ZONE 27 having OA · 不需加好友 · 0 push · 0 friend-add
//
// Session-only dismissal(NOT localStorage):
//   - Per R70 W-B 11-key cap discipline · 不加 12th localStorage key
//   - Per /audit S06 11-key inventory · adding 12th 需 /changelog 30-day
//     notice + LocalStorageReceipt update + ENGINE_OPS_LOG entry
//   - sessionStorage 是 brand-pure 替代 · same dismiss UX · 0 PII · resets
//     on tab close
//
// Brand IP fit:
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     audience uses LINE Keep daily · 此 hint speaks fan-grammar instantly
//   - per [[zone27-disclosure-philosophy]] · publish the「long-press
//     gesture works」 affordance · 不藏 mobile UX
//   - per /privacy 0-tracker · session-only dismiss · 不 store
//     visitor identity · 不 push reminder
//   - per Pratfall axiom · explicitly「不需加好友」 publishes that ZONE 27
//     does NOT have LINE OA · NOT push channel · subscribers OWN arrival
//
// 不做 anti-pattern:
//   ✕ NO LINE OA friend-add CTA(per /audit S06 + NoPushManifest R73 W-D)
//   ✕ NO「subscribe to LINE notifications」 (per 11-NEVER #5 + #6)
//   ✕ NO sticky / always-shown chip(dismissable + session-only)
//   ✕ NO localStorage(per 11-key cap discipline)
//   ✕ NO push permission ask(per NoPushManifest 12 deliberate absences)
//
// Mobile-only render(touch device + non-desktop UA · per [[feedback-
// zone27-mobile-first]] 3-viewport rule · desktop users 不需 LINE Keep hint
// since they have other native save mechanisms)。
//
// Placement(per Agent A R76 SHIP E spec):
//   - /receipts/[receiptId] BELOW receipt content · subtle 1-line text
//   - /year-zero(future R77 W-C ship)CLOSE before FounderSignOff
//
// Inspiration sources(per Agent A R76 SHIP E spec):
//   - LINE Official Account Taiwan opt-in pattern(blog.omnichat.ai)
//   - WhatsApp Channels no-push grammar(infludata.com analysis)
//   - Apple Card mobile onboarding minimalism(no friend-add · no push)
// ─────────────────────────────────────────────────────

const DISMISS_SESSION_KEY = "zone27_line_keep_hint_dismissed";

export default function LineKeepHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // SSR-safe + mobile-only render
    if (typeof window === "undefined") return;

    // Check sessionStorage(NOT localStorage · per 11-key cap discipline)
    try {
      const dismissed = window.sessionStorage.getItem(DISMISS_SESSION_KEY);
      if (dismissed === "1") return;
    } catch {
      // sessionStorage disabled · still show hint(graceful · per /privacy
      // 0-tracker promise · 不 fall back to localStorage)
    }

    // Mobile detection · matchMedia pointer:coarse OR hover:none
    const isMobile =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (!isMobile) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(DISMISS_SESSION_KEY, "1");
    } catch {
      // sessionStorage disabled · still dismiss this render · 不 fallback
    }
  };

  if (!visible) return null;

  return (
    <aside
      role="status"
      aria-label="Mobile hint · long-press to save to LINE Keep · no friend-add required"
      className="mt-4 border-l-2 border-gold/50 bg-slate/30 pl-4 pr-3 py-2 flex items-baseline justify-between gap-3 flex-wrap"
    >
      <p className="font-mono text-mute/85 text-[11px] tracking-[0.22em] leading-relaxed flex-1">
        <span className="text-gold/85 mr-1.5" aria-hidden="true">▸</span>
        長按 → 加到 LINE Keep · 不需加好友 · 不需 push permission
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss LINE Keep hint"
        className="font-mono text-mute/60 hover:text-loss text-[10px] tracking-[0.22em] underline-offset-2 hover:underline transition-colors shrink-0"
      >
        ✕ dismiss
      </button>
    </aside>
  );
}
