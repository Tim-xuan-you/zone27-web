"use server";

// ── ZONE 27 · Founders 27 Pre-launch Waitlist ──────────
// Server Action that persists waitlist signups to Supabase.
//
// Flow:
//   1. Visitor submits email (+ optional name) → reserveSpot()
//   2. Email is validated client-side here for fast feedback
//   3. We call public.reserve_waitlist_spot() RPC — the SQL function
//      validates again, dedupes by email, and returns the queue position
//   4. The RPC runs as security definer, so anon never touches the table
//      directly — all access goes through this single doorway
//   5. We also console.log to Vercel for defense in depth
// ─────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type WaitlistResult =
  | { ok: true; queuePos: number; alreadyReserved: false }
  | { ok: true; queuePos: number; alreadyReserved: true }
  | { ok: false; error: "missing_email" | "invalid_email" | "server_error" };

export async function reserveSpot(
  _prev: WaitlistResult | null,
  formData: FormData
): Promise<WaitlistResult> {
  const emailRaw = formData.get("email");
  const nameRaw = formData.get("name");
  const refRaw = formData.get("ref");

  if (typeof emailRaw !== "string" || emailRaw.trim().length === 0) {
    return { ok: false, error: "missing_email" };
  }
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email" };
  }
  const name =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : null;

  // Channel attribution: if the visitor arrived via ?ref=<tag> on /founders,
  // record that as the source. Falls back to a generic identifier so the
  // DB always knows the entry came from the form (not a manual insert).
  // Sanitize: only allow [a-z0-9-]{1,40} to prevent injection / abuse.
  const refClean =
    typeof refRaw === "string" && /^[a-z0-9-]{1,40}$/i.test(refRaw)
      ? refRaw.toLowerCase()
      : null;
  const source = refClean ?? "founders-page";

  const { data, error } = await supabase.rpc("reserve_waitlist_spot", {
    p_email: email,
    p_name: name,
    p_source: source,
  });

  if (error) {
    const message = error.message ?? "";
    if (message.includes("missing_email")) {
      return { ok: false, error: "missing_email" };
    }
    if (message.includes("invalid_email")) {
      return { ok: false, error: "invalid_email" };
    }
    console.error(
      `[ZONE27 · WAITLIST · ERROR] email=${email} error=${message} ts=${new Date().toISOString()}`
    );
    return { ok: false, error: "server_error" };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const queuePos = Number(row?.queue_position);
  if (!Number.isFinite(queuePos)) {
    console.error(
      `[ZONE27 · WAITLIST · ERROR] malformed RPC response email=${email} data=${JSON.stringify(
        data
      )} ts=${new Date().toISOString()}`
    );
    return { ok: false, error: "server_error" };
  }

  const alreadyReserved = row?.was_existing === true;

  console.log(
    `[ZONE27 · WAITLIST · ${
      alreadyReserved ? "DUPE" : "NEW"
    }] queue=${queuePos} email=${email} name=${
      name ?? "—"
    } ts=${new Date().toISOString()}`
  );

  if (alreadyReserved) {
    return { ok: true, queuePos, alreadyReserved: true };
  }

  // Purge the /founders ISR cache so the WAITLIST · N · LIVE counter
  // reflects this new signup on the next visit, not 60 seconds later.
  revalidatePath("/founders");

  return { ok: true, queuePos, alreadyReserved: false };
}
