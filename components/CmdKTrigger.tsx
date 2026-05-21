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

export default function CmdKTrigger({ className = "" }: { className?: string }) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // navigator.platform is deprecated but still the only sync way to
    // detect macOS reliably in 2026 · userAgentData is async + behind
    // a flag in Firefox. Acceptable since this is purely cosmetic.
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || ""));
    }
  }, []);

  const open = () => {
    document.dispatchEvent(new CustomEvent("zone27:open-palette"));
  };

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
