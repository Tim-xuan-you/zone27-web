// ── ZONE 27 · Founder Reservations · BROWSER lib ───────
// Round 30 Wave 12 · 2026-05-22 · Patek allocation pattern。
//
// 跟 0002 migration 對應的 BROWSER TypeScript wrappers · 用於 client
// components(FounderPickForm)。 Server-side reads live in
// lib/founder-reservations-server.ts(避免 next/headers SSR import 撞 client
// bundle)。
//
// 設計 same pattern as lib/follows.ts:
//   - Browser client via createSupabaseBrowserClient
//   - Errors thrown · component catches + displays in aria-live
//   - Migration not applied yet → calls fail · component graceful degrade
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type ReservationState = "pending" | "confirmed" | "cancelled";

export type ReservedSlot = {
  number: number;
  state: ReservationState;
};

export type MyReservation = {
  number: number;
  state: ReservationState;
  reservedAt: string;
};

export async function reserveFounderNumber(
  number: number
): Promise<{ id: string; number: number; state: ReservationState }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("reserve_founder_number", {
    p_number: number,
  });
  if (error) {
    throw new Error(error.message || "reservation_failed");
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") {
    throw new Error("reservation_returned_empty");
  }
  return {
    id: (row as { reservation_id: string }).reservation_id,
    number: (row as { number: number }).number,
    state: (row as { state: ReservationState }).state,
  };
}

export async function cancelMyReservation(): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("cancel_my_reservation");
  if (error) {
    throw new Error(error.message || "cancel_failed");
  }
}

export async function getMyReservationBrowser(): Promise<MyReservation | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("get_my_reservation");
  if (error) {
    return null;
  }
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
}
