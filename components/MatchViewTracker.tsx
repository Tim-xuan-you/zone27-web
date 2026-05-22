"use client";

// ── ZONE 27 · Match View Tracker ────────────────────────
// Round 40 W-G · Agent F #5 ship · client component fires once on mount ·
// pushes current match to localStorage recent-matches list · 0 cookies ·
// 0 server-side write · 0 PII ·純 visitor 自己 device。
//
// Mounted by /matches/[gameId] page as side-effect only · no UI render。
// per [[zone27-disclosure-philosophy]] · /audit 公開 此 mechanism +
// storage key。
// ─────────────────────────────────────────────────────

import { useEffect } from "react";
import { pushRecentMatch } from "@/lib/recent-matches";

type Props = {
  gameId: string;
  title: string;
};

export default function MatchViewTracker({ gameId, title }: Props) {
  useEffect(() => {
    pushRecentMatch({ gameId, title });
  }, [gameId, title]);

  return null;
}
