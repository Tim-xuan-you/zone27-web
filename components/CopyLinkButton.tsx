"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Client-side feature detection helpers · React 19 idiomatic.
// useSyncExternalStore handles SSR / hydration correctly: server
// always sees `false`, client snapshot reflects real navigator state
// at hydration time. No setState-in-effect warning.
function subscribeNoop() {
  return () => {};
}
function getShareApiSnapshot(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
function getShareApiServerSnapshot(): boolean {
  return false;
}

// ── ZONE 27 · Copy/Share Link Button ───────────────────
// Indie-stealth distribution lever. Since SEO is frozen and social
// is frozen, the only growth channel is private-DM share. Make the
// URL itself the share unit (Pieter Levels pattern) and make the
// SHARE act friction-minimal.
//
// Platform-adaptive behavior:
//   - Mobile (Web Share API supported): clicking opens the OS
//     share sheet directly — user picks LINE / Messages / etc.
//     and the URL is auto-inserted. Zero copy-paste steps.
//   - Desktop (Web Share API not available): fall back to clipboard
//     copy. User pastes manually.
//
// Brand-consistent style: mono 11px uppercase, line border, gold hover.
//
// Channel attribution (NOT individual tracking):
//   If `refTag` is provided, the shared URL gets `?ref=<refTag>`
//   appended. When the next visitor lands on the page and fills the
//   WaitlistForm, the DB stores `source = <refTag>`. Aggregated
//   across many shares, this tells Tim WHICH share channels actually
//   convert — without identifying any individual.
// ─────────────────────────────────────────────────────

type CopyLinkButtonProps = {
  // Optional channel-attribution tag appended as ?ref=<refTag>.
  // Pass something like "reserve-001" or "audit-share".
  refTag?: string;
};

type Phase = "idle" | "done";

export default function CopyLinkButton({ refTag }: CopyLinkButtonProps = {}) {
  const [phase, setPhase] = useState<Phase>("idle");
  // R166 W1 · Agent Q bug audit LOW #4 · async race guard for 2s "done→idle"
  // timer · prevents setState on unmounted component if visitor navigates away
  // within the 2s window。
  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const scheduleIdle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) setPhase("idle");
    }, 2000);
  };
  // Web Share API detected via useSyncExternalStore — React 19
  // idiomatic for browser-feature detection without setState-in-effect.
  const hasShareApi = useSyncExternalStore(
    subscribeNoop,
    getShareApiSnapshot,
    getShareApiServerSnapshot,
  );

  function buildUrl(): string {
    if (typeof window === "undefined") return "";
    const base = window.location.href;
    if (!refTag) return base;
    try {
      const u = new URL(base);
      u.searchParams.set("ref", refTag);
      return u.toString();
    } catch {
      return base;
    }
  }

  async function handleShare() {
    const url = buildUrl();
    if (!url) return;

    // Try Web Share API first (mobile-friendly · one tap to LINE / iMessage)
    if (hasShareApi && navigator.share) {
      try {
        await navigator.share({
          title: "ZONE 27",
          text: "不靠直覺,只看演算法 · A QUANTITATIVE SPORTS INTELLIGENCE CLUB",
          url,
        });
        setPhase("done");
        scheduleIdle();
        return;
      } catch (e) {
        // User cancelled — don't fall back, just stay idle
        if (e instanceof Error && e.name === "AbortError") return;
        // Real failure — fall through to clipboard
      }
    }

    // Clipboard fallback (desktop · or browsers without share API)
    try {
      await navigator.clipboard.writeText(url);
      setPhase("done");
      scheduleIdle();
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  const isDone = phase === "done";
  const idleLabel = hasShareApi ? "Share" : "Copy Link";
  const doneLabel = hasShareApi ? "Shared" : "Copied";
  const idleIcon = "⌁";
  const doneIcon = "✓";
  const ariaLabel = isDone
    ? hasShareApi
      ? "Link shared"
      : "Link copied to clipboard"
    : hasShareApi
      ? "Share this page via LINE / Messages / other"
      : "Copy this page link to clipboard";

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-2 px-4 py-2 border border-line/60 hover:border-gold/60 text-mute hover:text-gold transition-colors font-mono text-[11px] tracking-[0.25em] uppercase"
    >
      <span aria-hidden="true">{isDone ? doneIcon : idleIcon}</span>
      <span lang="en">{isDone ? doneLabel : idleLabel}</span>
    </button>
  );
}
