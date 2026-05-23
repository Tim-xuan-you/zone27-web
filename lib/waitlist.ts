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
//   5. NEW (2026-05-21): on successful new insert (not dupe), we send a
//      brand-tone confirmation email via Resend · lib/email.ts handles
//      that. Email failure does NOT fail the waitlist signup — visitor
//      still sees queue position, we just log the email failure.
//   6. We also console.log to Vercel for defense in depth
// ─────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import type { WaitlistResult } from "@/lib/waitlist-types";
import { supabase } from "@/lib/supabase";
import { sendWaitlistConfirmation } from "@/lib/email";

// R67 W-D · types + non-async helpers live in lib/waitlist-types.ts
// because "use server" requires all exports here to be async。 R68 W-D
// audit cleanup · WaitlistForm imports getWaitlistErrorMessage + type
// { WaitlistResult } directly from "@/lib/waitlist-types"(NOT via this
// file)· no re-export here · simpler import graph · single doorway for
// types · single doorway for server action(reserveSpot below)。

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  // Sanitize: lowercase + only allow [a-z0-9-]{1,40} to prevent injection / abuse.
  // (Lowercase the input BEFORE regex test, then drop the regex's case-
  // insensitive flag — clearer intent, single source of truth.)
  const refClean =
    typeof refRaw === "string" && /^[a-z0-9-]{1,40}$/.test(refRaw.toLowerCase())
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

  // Send brand-tone confirmation email · Resend free tier · 100/day cap.
  // Awaited (not fire-and-forget) so serverless function doesn't drop
  // the request mid-send · adds ~1-2s to action time · visitor sees
  // "正在預留位置 ..." for that extra moment which is appropriate UX
  // for a "saving + confirming" action. If RESEND_API_KEY missing or
  // Resend API errors out, we log + continue — waitlist insert is the
  // critical action · email is bonus.
  const emailResult = await sendWaitlistConfirmation({
    to: email,
    name,
    queuePos,
  });
  if (!emailResult.ok) {
    console.warn(
      `[ZONE27 · WAITLIST · EMAIL_FAILED] queue=${queuePos} email=${email} reason=${emailResult.error}`
    );
  }

  return { ok: true, queuePos, alreadyReserved: false };
}
