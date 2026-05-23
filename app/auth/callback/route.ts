// ── ZONE 27 · /auth/callback ─────────────────────────
// Round 30 Wave 5 · Phase 1 auth · accelerated from Q3 2026 → 2026-05-21 evening。
// R50 W-F · password-only path · /auth/callback 仍 used for email confirmation
// link(Supabase signup verification email)code-for-session exchange。
//
// Email confirmation link in email points to:
//   ${origin}/auth/callback?code=XXX&type=signup
//
// We exchange the code for a session(sets HTTP-only cookies via
// the supabase-ssr server adapter)· then redirect:
//   - Success → /member?welcome=true
//   - Error   → /login?error=<canonical_code>(R61 W-D · 不 leak raw)
//
// No analytics · no UTM tracking · just code-for-session exchange ·
// per /privacy 0-tracker promise。
// ─────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Sanitize `next` redirect param to prevent open-redirect attack。
 *
 * Round 54 W-A · Agent 2 #4 CRITICAL fix · previous string-prefix check 有
 * bypass surface:`/%2F%2F` URL-encoded · `//\attacker.com` backslash
 * variant · null-byte injection 等。 改用 URL parse-based approach · 只允
 * 接受 relative paths · 拒絕 any URL with protocol/host 即使 encoded。
 *
 * Reject:
 *   - Absolute URL(http://attacker.com)including encoded variants
 *   - Protocol-relative(//attacker.com · //%2Fattacker · etc)
 *   - Empty / non-string / null bytes
 *   - URL parse failures
 *
 * Allow:
 *   - Internal relative path(no protocol · no host · starts with /)
 *   - Optional query string + fragment(preserved)
 *
 * Fallback to canonical /member welcome on any invalid input。
 */
function sanitizeNext(raw: string | null): string {
  const fallback = "/member?welcome=true";
  if (!raw || typeof raw !== "string") return fallback;
  // Reject null bytes(some parsers strip pre-validation · we reject explicit)
  if (raw.includes("\0")) return fallback;
  // Must start with single `/` and NOT `//` (catches protocol-relative)
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.startsWith("/\\")) return fallback;

  // Parse-based validation · catches encoded bypasses(%2F%2F → //)
  try {
    // Use dummy origin · only care about whether parser extracts a host
    const parsed = new URL(raw, "https://zone27-internal.invalid");
    // Allowed = parser kept dummy origin(meaning raw was truly relative)
    if (parsed.origin !== "https://zone27-internal.invalid") return fallback;
    // Reconstruct path-only · strip any protocol/host that might have slipped
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeNext(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", url.origin)
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // R61 W-D · 不 leak raw Supabase error to URL · 同 /login
      // friendlyPasswordError R59 W-B fix pattern · whitelist canonical code
      // server-side · log raw for Tim 後台 debug · 訪客 URL 只看 generic。
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error("[auth/callback exchange]", error.message);
      }
      return NextResponse.redirect(
        new URL(`/login?error=exchange_failed`, url.origin)
      );
    }

    // Session cookies set via the ssr adapter setAll callback ·
    // redirect to /member welcome state(or sanitized custom next path)。
    return NextResponse.redirect(new URL(next, url.origin));
  } catch (err) {
    // R61 W-D · 同上 · 不 leak err.message to URL
    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error("[auth/callback catch]", err instanceof Error ? err.message : String(err));
    }
    return NextResponse.redirect(
      new URL(`/login?error=unknown_error`, url.origin)
    );
  }
}
