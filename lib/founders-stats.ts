// ── ZONE 27 · Founders 27 — single source of truth ────
// Founders state used everywhere: /leaderboard wall, /founders sales
// page, OG cards, ScarcityStrip site-wide counter.
//
// 為保護隱私,只公布編號與認領日,絕不公布身分。
//
// When Supabase is wired up (per TODO.md ① — owner action item),
// replace `claimedFounders` with a DB query. Every consumer below
// is already importing the derived constants, so the migration is
// a one-file change.
// ─────────────────────────────────────────────────────

export const FOUNDERS_TOTAL = 270;

export type ClaimedFounder = {
  id: number;
  claimedOn: string; // ISO date (YYYY-MM-DD)
};

export const claimedFounders: ClaimedFounder[] = [
  { id: 1, claimedOn: "2026-05-12" },
  { id: 2, claimedOn: "2026-05-13" },
  { id: 3, claimedOn: "2026-05-13" },
  { id: 4, claimedOn: "2026-05-14" },
  { id: 5, claimedOn: "2026-05-16" },
  { id: 6, claimedOn: "2026-05-17" },
  { id: 7, claimedOn: "2026-05-18" },
];

export const FOUNDERS_CLAIMED = claimedFounders.length;
export const FOUNDERS_REMAINING = FOUNDERS_TOTAL - FOUNDERS_CLAIMED;
export const FOUNDERS_NEXT = FOUNDERS_CLAIMED + 1;
export const FOUNDERS_PROGRESS = FOUNDERS_CLAIMED / FOUNDERS_TOTAL;

export function isClaimed(n: number): boolean {
  return claimedFounders.some((f) => f.id === n);
}

export function formatBadge(n: number): string {
  return `#${String(n).padStart(3, "0")}`;
}
