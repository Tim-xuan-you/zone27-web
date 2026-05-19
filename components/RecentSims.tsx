"use client";

import { useEffect, useState } from "react";
import {
  getSimHistory,
  clearSimHistory,
  relativeTime,
  type SimHistoryEntry,
} from "@/lib/sim-history";

// ── ZONE 27 · Recent Sims ──────────────────────────────
// Shows the user's last ~5 completed simulations from localStorage.
//
// Behavior:
// - Initial render is empty (server-side) — hydrates on mount
// - Listens for the "zone27:sim-history-updated" custom event so it
//   updates immediately when a new sim completes elsewhere on the page
// - If history is empty, the entire section is hidden (no broken
//   "no data" state)
// - Each entry is plain text (no link-back yet — kept simple in v0.20)
// ─────────────────────────────────────────────────────

const VISIBLE_LIMIT = 5;

export default function RecentSims() {
  const [history, setHistory] = useState<SimHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(getSimHistory());
    setHydrated(true);

    function refresh() {
      setHistory(getSimHistory());
    }
    window.addEventListener("zone27:sim-history-updated", refresh);
    return () => {
      window.removeEventListener("zone27:sim-history-updated", refresh);
    };
  }, []);

  // Don't render anything until hydrated (avoids hydration mismatch)
  // and don't render if there's no history (empty-state hidden)
  if (!hydrated || history.length === 0) {
    return null;
  }

  const visible = history.slice(0, VISIBLE_LIMIT);

  function handleClear() {
    if (
      typeof window !== "undefined" &&
      window.confirm("Clear all local sim history? This only affects this browser.")
    ) {
      clearSimHistory();
      setHistory([]);
    }
  }

  return (
    <section className="mt-12 pt-10 border-t border-line/40">
      <div className="flex items-baseline justify-between mb-6">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / RECENT SIMS · YOUR LOCAL HISTORY
        </p>
        <button
          onClick={handleClear}
          className="font-mono text-mute/60 hover:text-loss text-[10px] tracking-[0.3em] transition-colors"
        >
          CLEAR
        </button>
      </div>

      <div className="space-y-2">
        {visible.map((entry) => (
          <HistoryRow key={entry.matchId + entry.ranAt} entry={entry} />
        ))}
      </div>

      <p className="font-mono text-mute/40 text-[10px] tracking-[0.25em] mt-6">
        STORED LOCALLY IN YOUR BROWSER · NEVER SENT TO US
      </p>
    </section>
  );
}

function HistoryRow({ entry }: { entry: SimHistoryEntry }) {
  const homeFav = entry.homePct >= entry.awayPct;
  return (
    <div className="bg-slate/30 border border-line/50 hover:border-gold/40 transition-colors px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-bone text-sm truncate flex items-center gap-2">
          {entry.matchupName}
          {entry.isCustom && (
            <span className="font-mono text-[8px] text-gold/70 tracking-[0.25em] border border-gold/40 px-1.5 py-px shrink-0">
              CUSTOM
            </span>
          )}
        </p>
        <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-1">
          {relativeTime(entry.ranAt)} · {entry.totalSims.toLocaleString()} SIMS
        </p>
      </div>

      <div className="flex items-baseline gap-1 font-mono tabular text-sm shrink-0">
        <span className={homeFav ? "text-gold" : "text-mute"}>
          {entry.homePct.toFixed(1)}%
        </span>
        <span className="text-mute/40">/</span>
        <span className={!homeFav ? "text-gold" : "text-mute"}>
          {entry.awayPct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
