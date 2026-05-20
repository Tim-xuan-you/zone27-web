// ── ZONE 27 · Founders 27 — single source of truth ────
// Founders state used everywhere: /leaderboard wall, /founders sales
// page, OG cards, ScarcityStrip site-wide counter.
//
// 為保護隱私,只公布編號與認領日,絕不公布身分。
//
// Status: still hardcoded by design. The 7 founders below are
// placeholder until Tim manually onboards real Founders 27 members
// (per [[zone27-payment-architecture]] memory · manual bank
// transfer · ~Q3 2026 launch). At that point, build a
// `public.founders` Supabase table parallel to `waitlist`, and
// migrate this file to read its `claimedFounders` from a
// SECURITY DEFINER aggregate function (mirror of get_waitlist_count
// pattern in supabase/migrations/0001_waitlist.sql). Every consumer
// of this file imports the derived constants, so the migration
// stays a one-file change.
//
// Note: waitlist DB was migrated to Supabase on 2026-05-20
// (see [[zone27-supabase-architecture]]). The founders table is
// a separate piece of work tied to payment-system launch.
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
