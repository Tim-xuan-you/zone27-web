"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ── ZONE 27 · Global G-mode Keyboard Shortcuts ──────────
// R62 W-C · Bloomberg/power-user agent Ship #1(S effort)· Linear/GitHub-style
// two-stroke「g then X」 jump shortcuts。 Power-user retention amplifier ·
// repeat-visitor 不必開 Cmd-K · 直接 g+m / g+t / g+l jump。 Bloomberg-grade
// muscle memory for hardcore CPBL fans returning daily。
//
// R69 W-F · Agent A SHIP 6 · RaycastJumpHint · ONE-SHOT first-ever-visit
// discovery toast「Press G then M · jump anywhere」 · 8-second session
// activity gate(Arc browser pattern · don't teach bouncing visitors)·
// localStorage zone27_shortcut_hint_seen_v1(10th key chronologically · last_visit_v1 R70 W-B = 11th · /audit S06 disclose)·
// 5s auto-dismiss · ONE shot per device lifetime。 不是 push notification ·
// 不是 modal · 不是 onboarding wizard · 是 inline gold flash discoverability。

const SHORTCUT_HINT_STORAGE_KEY = "zone27_shortcut_hint_seen_v1";
const HINT_DELAY_MS = 8_000;
const HINT_DURATION_MS = 5_000;
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
//   g x → /audit(X for compleX audit · /transparency R164 collapsed to /audit canonical hub)
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
  x: "/audit",
};

const RESET_MS = 1500;

// R75 W-C · Agent A R70 SHIP 6 deferred · D-key density toggle · power-user
// single-stroke shortcut · NOT g-mode prefix · NOT localStorage persistence
// (避免 12th key risk · per R70 W-B 11-key cap discipline)· toggle resets on
// page reload · power-user opt-in only · 同 Linear single-key shortcut grammar
// + Notion 「c」 create + Bloomberg power-user muscle memory。
// CSS rule [data-density="condensed"] in app/globals.css。
const DENSITY_KEY = "d";

export default function GlobalShortcuts() {
  const router = useRouter();
  const armedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  // R70 W-F · Agent B audit F4 fix · dismissTimerRef for proper cleanup ·
  // 之前 5s auto-dismiss setTimeout 沒被 captured · unmount during 8-13s
  // 窗口 → memory leak + React warning · 此 ref 允許 cleanup function 完整
  // clearTimeout 雙計時器。
  const dismissTimerRef = useRef<number | null>(null);
  // Visual flash to confirm shortcut received(brief gold flash · CSS-only)
  const [flash, setFlash] = useState<string | null>(null);
  // R69 W-F · ONE-shot RaycastJumpHint state · 5s auto-dismiss · 8s session gate
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    // R69 W-F · ONE-shot RaycastJumpHint · Arc browser「don't teach bouncing
    // visitors」 pattern · only show on first-ever visit AFTER 8s session
    // activity · localStorage one-shot guard · zero push permission · zero
    // tracking · zero re-show after dismiss。
    if (typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem(SHORTCUT_HINT_STORAGE_KEY);
      if (seen === "1") return; // already shown once · respect ONE-shot
    } catch {
      return; // localStorage disabled · silently skip · 不 push
    }

    const showTimer = window.setTimeout(() => {
      setHintVisible(true);
      // Mark as seen immediately on display · 不等 dismiss · ONE shot 嚴格
      try {
        window.localStorage.setItem(SHORTCUT_HINT_STORAGE_KEY, "1");
      } catch {
        /* swallow · still display this session */
      }
      // R70 W-F · Agent B audit F4 fix · capture dismiss timer into ref ·
      // unmount during 5s window 不 leak · cleanup function 兩 timer 都
      // clearTimeout。
      dismissTimerRef.current = window.setTimeout(
        () => setHintVisible(false),
        HINT_DURATION_MS,
      );
    }, HINT_DELAY_MS);

    return () => {
      window.clearTimeout(showTimer);
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, []);

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
          // R70 W-F · Agent B audit F4 fix · force-hide RaycastJumpHint if
          // visible · power user just learned g+key works · re-showing hint
          // mid-navigation 是 confusing · cancel pending dismiss timer too。
          setHintVisible(false);
          if (dismissTimerRef.current !== null) {
            window.clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = null;
          }
          router.push(path);
          return;
        }
        // Unknown follow-up · reset and let key propagate normally
        clearArmed();
        return;
      }

      // R75 W-C · Power-user density toggle · single 「d」 press · armedRef
      // already false at this point(g+d would've resolved in armed block above
      // and clearArmed because d is not in SHORTCUTS map)· 直接 toggle
      // [data-density="condensed"] on documentElement · CSS responds via
      // [data-density] selectors in globals.css · 0 localStorage · session-only。
      if (key === DENSITY_KEY) {
        e.preventDefault();
        const root = document.documentElement;
        const current = root.dataset.density;
        if (current === "condensed") {
          delete root.dataset.density;
          setFlash("DENSITY · DEFAULT");
        } else {
          root.dataset.density = "condensed";
          setFlash("DENSITY · CONDENSED");
        }
        window.setTimeout(() => setFlash(null), 1200);
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

  // R69 W-F · ONE-shot RaycastJumpHint · 5s discoverability flash · brand-pure
  // Raycast/Arc/Linear discovery pattern · 不是 modal · 不是 sticky banner ·
  // 是 ambient gold flash in same position as g-mode flash · visitors learn
  // keyboard surface exists · power-users muscle-memory unlocked。
  if (hintVisible && !flash) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 border border-gold/60 bg-ink/95 backdrop-blur-md px-4 py-3 font-mono text-gold text-[11px] tracking-[0.25em] tabular max-w-xs"
      >
        <p className="leading-relaxed">
          ⚡ Power-user tip · 按{" "}
          <kbd className="px-1.5 py-0.5 border border-gold/60 bg-slate/60 text-gold tabular text-[10px] rounded-sm">
            G
          </kbd>{" "}
          再按{" "}
          <kbd className="px-1.5 py-0.5 border border-gold/60 bg-slate/60 text-gold tabular text-[10px] rounded-sm">
            M
          </kbd>{" "}
          jump 任何 page
        </p>
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.2em] mt-1.5">
          ▸ this hint 一次性 · 5 秒自動消失 · 不再顯示
        </p>
      </div>
    );
  }
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
