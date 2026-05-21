"use client";

import { useEffect, useState } from "react";

// ── ZONE 27 · CmdK Trigger Chip ────────────────────────
// Small visible hint that the command palette exists. Both
// clickable (mobile · touch) and a shortcut label (desktop ·
// keyboard). Dispatches the same global event the palette
// listens for — keeps palette state owned by ONE component
// (CommandPalette.tsx) regardless of how it's opened.
//
// Why detect platform: macOS shows ⌘, Windows/Linux shows
// Ctrl. Pure cosmetic — both keys work, but Mac users wonder
// why a Windows-style Ctrl chip appears on their machine.
// ─────────────────────────────────────────────────────

type Props = {
  className?: string;
  /** "chip" = bordered chip with ⌘K + label (desktop nav default).
   *  "icon" = bare ⌕ glyph for mobile nav row (no border, fits inline).
   *  Round 12 funnel-audit: mobile visitors had no way to access the
   *  24-route palette · verification path for skeptics broken. Adding
   *  the icon variant exposes the trigger without crowding mobile nav. */
  variant?: "chip" | "icon";
};

export default function CmdKTrigger({ className = "", variant = "chip" }: Props) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // navigator.platform is deprecated but still the only sync way to
    // detect macOS reliably in 2026 · userAgentData is async + behind
    // a flag in Firefox. Acceptable since this is purely cosmetic.
    // Setting state in useEffect is intentional here — the value
    // genuinely depends on client-only API (navigator) which is
    // undefined during SSR · this is the canonical pattern for
    // platform detection that React 19's strict rule overflags.
    if (typeof navigator !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || ""));
    }
  }, []);

  const open = () => {
    document.dispatchEvent(new CustomEvent("zone27:open-palette"));
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label="Open command palette · 全站快搜"
        title="全站快搜 · 25 個頁面"
        className={`py-2.5 -my-1.5 tracking-[0.18em] inline-flex items-center gap-1 text-mute hover:text-gold transition-colors font-mono text-[14px] leading-none ${className}`}
      >
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">搜尋</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open command palette · ⌘K"
      className={`group inline-flex items-center gap-2 px-2.5 py-1.5 border border-line/60 hover:border-gold/50 hover:bg-slate/40 transition-colors ${className}`}
      title="搜尋 ZONE 27 任一頁面 · 開啟 Cmd-K palette"
    >
      <span
        aria-hidden="true"
        className="font-mono text-mute group-hover:text-gold text-[10px] tracking-[0.2em] transition-colors"
      >
        {isMac ? "⌘" : "Ctrl"} K
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-mute/70 group-hover:text-mute text-[10px] tracking-[0.2em] transition-colors hidden md:inline"
      >
        全站快搜
      </span>
    </button>
  );
}
