"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ── ZONE 27 · Global G-mode Keyboard Shortcuts ──────────
// R62 W-C · Bloomberg/power-user agent Ship #1(S effort)· Linear/GitHub-style
// two-stroke「g then X」 jump shortcuts。 Power-user retention amplifier ·
// repeat-visitor 不必開 Cmd-K · 直接 g+m / g+t / g+l jump。 Bloomberg-grade
// muscle memory for hardcore CPBL fans returning daily。
//
// SHORTCUT TABLE(reset 1500ms after 「g」 pressed):
//   g h → / (home)
//   g m → /matches
//   g t → /track-record
//   g l → /lab
//   g f → /founders
//   g a → /audit
//   g c → /calibration
//   g r → /roadmap
//   g p → /methodology(P for Paper/whitepaper)
//   g s → /steelman(S for Steelman)
//   g e → /ethics(E for Ethics)
//   g x → /transparency(X for compleX audit)
//   g n → /now(N for Now)
//   g ? → toggle Cmd-K palette(shortcut help · 同 CommandPalette 顯示 all routes)
//
// SOURCE: Linear https://linear.app/changelog/2021-03-25-keyboard-shortcuts-help
//         GitHub G-mode https://docs.github.com/en/get-started/accessibility/keyboard-shortcuts
//
// SAFETY:
//   - Skip when target is INPUT / TEXTAREA / SELECT / contenteditable
//   - Skip when any modifier(Cmd/Ctrl/Alt)is pressed(don't hijack Cmd+T etc)
//   - 1500ms timeout window after 「g」 · resets if user idle
//
// Brand IP fit:
//   - Power-user retention(per [[feedback-zone27-audience-fans-not-engineers]]
//     fan-not-engineer audience · but hardcore fans 多數 used Linear/GitHub/
//     Bloomberg at work · same keyboard grammar)
//   - 0 tracking · 0 telemetry · 0 personalization(per /privacy)
//   - Invisible by default · 訪客 不必知道 · power-users discover via Cmd-K hint
//
// MOUNTED in app/layout.tsx sibling to CommandPalette。
// ─────────────────────────────────────────────────────

const SHORTCUTS: Record<string, string> = {
  h: "/",
  m: "/matches",
  t: "/track-record",
  l: "/lab",
  f: "/founders",
  a: "/audit",
  c: "/calibration",
  r: "/roadmap",
  p: "/methodology",
  s: "/steelman",
  e: "/ethics",
  x: "/transparency",
  n: "/now",
};

const RESET_MS = 1500;

export default function GlobalShortcuts() {
  const router = useRouter();
  const armedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  // Visual flash to confirm shortcut received(brief gold flash · CSS-only)
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    function isInputTarget(target: EventTarget | null): boolean {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    }

    function clearArmed() {
      armedRef.current = false;
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      // Skip if any modifier · don't hijack Cmd+T / Ctrl+T browser shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) {
        clearArmed();
        return;
      }
      // Skip if target is form input
      if (isInputTarget(e.target)) {
        clearArmed();
        return;
      }

      const key = e.key.toLowerCase();

      if (armedRef.current) {
        // Second stroke · resolve
        if (key === "?" || key === "/") {
          // g+? or g+/ · toggle Cmd-K palette(shortcut help)
          e.preventDefault();
          clearArmed();
          document.dispatchEvent(new CustomEvent("zone27:open-palette"));
          return;
        }
        const path = SHORTCUTS[key];
        if (path) {
          e.preventDefault();
          clearArmed();
          setFlash(`g+${key.toUpperCase()} → ${path}`);
          window.setTimeout(() => setFlash(null), 1200);
          router.push(path);
          return;
        }
        // Unknown follow-up · reset and let key propagate normally
        clearArmed();
        return;
      }

      // First stroke · arm if key is plain 「g」
      if (key === "g") {
        armedRef.current = true;
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          armedRef.current = false;
          timeoutRef.current = null;
        }, RESET_MS);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [router]);

  if (!flash) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 border border-gold/60 bg-ink/90 backdrop-blur-md px-4 py-2 font-mono text-gold text-[11px] tracking-[0.25em] tabular shimmer"
    >
      ⌁ {flash}
    </div>
  );
}
