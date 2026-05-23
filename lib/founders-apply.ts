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

// R69 W-G · Agent B audit F4 fix · sanitize CRLF/tab from name + email +
// applicationId to prevent email header injection(Subject line CRLF→BCC
// 第三方 attacker pattern)· defense-in-depth even if Resend sanitizes
// internally · brand IP「任何缺陷被攻擊」 axiom 物理 codify。
function stripControlChars(s: string): string {
  return s.replace(/[\r\n\t]/g, " ");
}

export async function submitFoundersApplication(
  _prev: FoundersApplyResult | null,
  formData: FormData,
): Promise<FoundersApplyResult> {
  // R69 W-G · Agent B audit F5 fix · wrap entire post-validation block in
  // try/catch · server_error code now reachable when Resend / runtime throws ·
  // Tetlock「declare what you actually do」 discipline。 Tim's Gmail flood
  // protection deferred to migration 0003 rate-limit · rate_limited code
  // already removed from FOUNDERS_APPLY_ERROR_CODES per F5 part 2。
  try {
    const emailRaw = formData.get("email");
    const nameRaw = formData.get("name");
    const cpblConnectionRaw = formData.get("cpbl_connection");
    const whyRaw = formData.get("why_zone27");

    // Validate email
    if (typeof emailRaw !== "string" || emailRaw.trim().length === 0) {
      return { ok: false, error: "missing_email" };
    }
    // Strip control chars BEFORE regex test · defense-in-depth
    const email = stripControlChars(emailRaw.trim().toLowerCase());
    if (!EMAIL_RE.test(email)) {
      return { ok: false, error: "invalid_email" };
    }

    // Validate name · strip control chars · cap length
    if (typeof nameRaw !== "string" || nameRaw.trim().length === 0) {
      return { ok: false, error: "missing_name" };
    }
    const name = stripControlChars(nameRaw.trim()).slice(
      0,
      FOUNDERS_APPLY_LIMITS.nameMaxChars,
    );

    // Validate cpbl connection · R70 W-G Agent B audit F9 fix · strip
    // ONLY tab + carriage-return + null chars · keep \n newlines since
    // body content may include multi-line CPBL fan history。 Previously
    // missed sanitization · escapeHtml in lib/email.ts handled XSS but
    // defense-in-depth gap closed here。
    if (
      typeof cpblConnectionRaw !== "string" ||
      cpblConnectionRaw.trim().length === 0
    ) {
      return { ok: false, error: "missing_cpbl_connection" };
    }
    const cpblConnection = cpblConnectionRaw
      .trim()
      .replace(/[\r\t\0]/g, "")
      .slice(0, FOUNDERS_APPLY_LIMITS.cpblConnectionMaxChars);

    // Validate why · R70 W-G Agent B audit F9 fix · same \r/\t/\0 sanitization ·
    // keep \n internal newlines as body content
    if (typeof whyRaw !== "string" || whyRaw.trim().length === 0) {
      return { ok: false, error: "missing_why" };
    }
    const why = whyRaw.trim().replace(/[\r\t\0]/g, "");
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

    // R69 W-G · Agent B audit F9 fix · redact name + email in Vercel logs ·
    // /privacy Section 02B disclosure aligned · 主要 audit trail 在 Tim
    // Gmail inbox · Vercel logs 只記 applicationId + email domain · 不
    // 完整 PII。 anyone with Vercel access only sees domain · 不 full identity。
    const emailDomain = email.split("@")[1] ?? "unknown";
    const namePreview = name.length > 0 ? `${name.slice(0, 1)}***` : "";
    console.log(
      `[ZONE27 · FOUNDERS_APPLY · NEW] id=${applicationId} email_domain=${emailDomain} name_prefix=${namePreview} why_len=${why.length} ts=${now.toISOString()}`,
    );

    // Send 2 emails parallel · don't block on either · graceful degradation
    // per existing lib/email.ts pattern · if RESEND_API_KEY missing both
    // log warnings but application still succeeds
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
        `[ZONE27 · FOUNDERS_APPLY · VISITOR_EMAIL_FAILED] id=${applicationId} domain=${emailDomain} reason=${visitorEmailResult.error}`,
      );
    }
    if (!timEmailResult.ok) {
      console.warn(
        `[ZONE27 · FOUNDERS_APPLY · TIM_EMAIL_FAILED] id=${applicationId} reason=${timEmailResult.error}`,
      );
    }

    return { ok: true, applicationId };
  } catch (err) {
    // R69 W-G · Agent B audit F5 fix · server_error code now reachable ·
    // any Resend timeout / network error / runtime exception caught here ·
    // visitor sees friendly inline error per WaitlistForm pattern · 不 leak
    // raw exception to client per /audit S05 disclosure pattern。
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[ZONE27 · FOUNDERS_APPLY · ERROR] uncaught err=${message} ts=${new Date().toISOString()}`,
    );
    return { ok: false, error: "server_error" };
  }
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
