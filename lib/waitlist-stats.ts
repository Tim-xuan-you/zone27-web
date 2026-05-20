// ── ZONE 27 · Waitlist aggregate stats ─────────────────
// Server-side helper for the "WAITLIST · N · LIVE" indicator
// shown above WaitlistForm on /founders.
//
// Uses the get_waitlist_count() RPC which only returns COUNT(*) — no
// emails, no names, no PII. Even with the publishable key, that's all
// anon can ever see. Per the /privacy promise.
//
// Returns -1 on failure so the UI can gracefully hide the indicator
// rather than showing "0" when actually the DB was unreachable.
// ─────────────────────────────────────────────────────

import { supabase } from "@/lib/supabase";

export async function getWaitlistCount(): Promise<number> {
  const { data, error } = await supabase.rpc("get_waitlist_count");

  if (error) {
    console.error(
      `[ZONE27 · WAITLIST · COUNT ERROR] ${error.message} ts=${new Date().toISOString()}`
    );
    return -1;
  }

  const count = Number(data);
  if (!Number.isFinite(count) || count < 0) return -1;
  return count;
}
