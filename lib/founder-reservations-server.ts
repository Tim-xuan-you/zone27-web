// ── ZONE 27 · Founder Reservations · SERVER lib ────────
// Round 30 Wave 12 · server-only(uses cookies() from next/headers)。
// 拆出來避免 client bundle SSR import 撞牆。
//
// Used by:
//   - /leaderboard server component(reads reserved numbers for THE 27 WALL)
//   - /member if 需要 SSR-side reservation display
// ─────────────────────────────────────────────────────

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ReservedSlot,
  MyReservation,
  ReservationState,
} from "@/lib/founder-reservations";

/** Server-side: list reserved numbers for /leaderboard public display。
 *  Returns empty array if migration 0002 not yet applied · graceful degrade。 */
export async function getReservedNumbersServer(): Promise<ReservedSlot[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_reserved_numbers");
    if (error) return [];
    if (!Array.isArray(data)) return [];
    return (data as { number: number; state: ReservationState }[]).map(
      (r) => ({ number: r.number, state: r.state })
    );
  } catch {
    return [];
  }
}

/** Server-side: own reservation if any。 Returns null if not logged in
 *  or migration not applied。 */
export async function getMyReservationServer(): Promise<MyReservation | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_reservation");
    if (error) return null;
    if (!Array.isArray(data) || data.length === 0) return null;
    const row = data[0] as {
      number: number;
      state: ReservationState;
      reserved_at: string;
    };
    return {
      number: row.number,
      state: row.state,
      reservedAt: row.reserved_at,
    };
  } catch {
    return null;
  }
}
