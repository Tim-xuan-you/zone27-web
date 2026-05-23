"use server";

// ── ZONE 27 · Founders 27 Application Server Action ─────
// R68 W-A · Patek Philippe-style application form · 1 layer deeper than
// waitlist email signup · for visitors who actually want one of 270
// founding seats(#008-#270 · #001-#007 are Tim's system-test placeholders
// per /founders/ledger)。
//
// MVP architecture(無 Supabase migration 0003 yet · ships NOW per
// [[feedback-no-waiting-rule]]):
//   1. Form submit → validate fields server-side
//   2. console.log structured event(Vercel logs = audit trail backstop)
//   3. Send 2 Resend emails parallel:
//      a. sendFoundersApplicationReceived → visitor confirms received
//      b. sendFoundersApplicationNotification → Tim's Gmail inbox = primary
//         audit trail + manual review queue
//   4. Return ok:true with applicationId(timestamp-derived · sufficient
//      for visitor reference in follow-up email)
//
// Future: when Tim applies supabase/migrations/0003_founders_applications.sql
// (DRAFT in repo · NOT yet applied)· extend this action to also write
// row · audit trail upgrades from email-inbox to Supabase RLS-locked
// table。 No breaking change to consumer。
//
// Brand IP fit:
//   - per [[feedback-no-waiting-rule]] · ships NOW · 不等 Supabase migration
//     · 不 surface options · email-only MVP works
//   - per [[zone27-payment-architecture]] · Founders 27 = manual bank
//     transfer · application is the PRE-REQUISITE step before Tim emails
//     bank details · brand-IP-pure
//   - per [[feedback-zone27-pratfall-brand-ip]] · application explicitly
//     says「1-3 business days 內 manual review」 · not「instant approval」
//     · honest about Tim being single point of approval
//   - per /founders/ledger 5-step allocation rules · pre-committed process
// ─────────────────────────────────────────────────────

import {
  sendFoundersApplicationReceived,
  sendFoundersApplicationNotification,
} from "@/lib/email";
import {
  FOUNDERS_APPLY_LIMITS,
  type FoundersApplyResult,
} from "@/lib/founders-apply-types";

export type { FoundersApplyResult, FoundersApplyErrorCode } from "@/lib/founders-apply-types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitFoundersApplication(
  _prev: FoundersApplyResult | null,
  formData: FormData,
): Promise<FoundersApplyResult> {
  const emailRaw = formData.get("email");
  const nameRaw = formData.get("name");
  const cpblConnectionRaw = formData.get("cpbl_connection");
  const whyRaw = formData.get("why_zone27");

  // Validate email
  if (typeof emailRaw !== "string" || emailRaw.trim().length === 0) {
    return { ok: false, error: "missing_email" };
  }
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email" };
  }

  // Validate name
  if (typeof nameRaw !== "string" || nameRaw.trim().length === 0) {
    return { ok: false, error: "missing_name" };
  }
  const name = nameRaw.trim().slice(0, FOUNDERS_APPLY_LIMITS.nameMaxChars);

  // Validate cpbl connection
  if (
    typeof cpblConnectionRaw !== "string" ||
    cpblConnectionRaw.trim().length === 0
  ) {
    return { ok: false, error: "missing_cpbl_connection" };
  }
  const cpblConnection = cpblConnectionRaw
    .trim()
    .slice(0, FOUNDERS_APPLY_LIMITS.cpblConnectionMaxChars);

  // Validate why
  if (typeof whyRaw !== "string" || whyRaw.trim().length === 0) {
    return { ok: false, error: "missing_why" };
  }
  const why = whyRaw.trim();
  if (why.length < FOUNDERS_APPLY_LIMITS.whyMinChars) {
    return { ok: false, error: "why_too_short" };
  }
  if (why.length > FOUNDERS_APPLY_LIMITS.whyMaxChars) {
    return { ok: false, error: "why_too_long" };
  }

  // Generate application ID(timestamp-derived · sortable · unique-enough
  // for MVP without Supabase row · format: fa-YYYYMMDD-HHMMSS-XXXX where
  // XXXX is last 4 of email hash · 同 ZONE 27 cpbl-260521-01 grammar)
  const now = new Date();
  const yyyymmdd =
    now.getUTCFullYear().toString() +
    String(now.getUTCMonth() + 1).padStart(2, "0") +
    String(now.getUTCDate()).padStart(2, "0");
  const hhmmss =
    String(now.getUTCHours()).padStart(2, "0") +
    String(now.getUTCMinutes()).padStart(2, "0") +
    String(now.getUTCSeconds()).padStart(2, "0");
  const emailHashSuffix = simpleHash(email).slice(-4);
  const applicationId = `fa-${yyyymmdd}-${hhmmss}-${emailHashSuffix}`;

  // Audit trail · Vercel logs primary source · skeptic can verify
  // application count via log search if needed pre-Supabase
  console.log(
    `[ZONE27 · FOUNDERS_APPLY · NEW] id=${applicationId} email=${email} name="${name}" cpbl="${cpblConnection.slice(0, 40)}" why_len=${why.length} ts=${now.toISOString()}`,
  );

  // Send 2 emails parallel · don't block on either · graceful degradation
  // per existing lib/email.ts pattern · if RESEND_API_KEY missing both
  // log warnings + return ok:false but application still succeeds
  const [visitorEmailResult, timEmailResult] = await Promise.all([
    sendFoundersApplicationReceived({
      to: email,
      name,
      applicationId,
    }),
    sendFoundersApplicationNotification({
      applicantEmail: email,
      applicantName: name,
      cpblConnection,
      why,
      applicationId,
    }),
  ]);

  if (!visitorEmailResult.ok) {
    console.warn(
      `[ZONE27 · FOUNDERS_APPLY · VISITOR_EMAIL_FAILED] id=${applicationId} email=${email} reason=${visitorEmailResult.error}`,
    );
  }
  if (!timEmailResult.ok) {
    console.warn(
      `[ZONE27 · FOUNDERS_APPLY · TIM_EMAIL_FAILED] id=${applicationId} reason=${timEmailResult.error}`,
    );
  }

  return { ok: true, applicationId };
}

// Tiny stable hash for email suffix · not crypto-secure · just for
// applicationId uniqueness within same-second submissions · sufficient
// for MVP scale。 Same algo as Java String.hashCode + abs。
function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36).padStart(4, "0");
}
