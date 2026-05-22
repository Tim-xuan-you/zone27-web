// ── ZONE 27 · /auth/callback ─────────────────────────
// Round 30 Wave 5 · Phase 1 magic link auth · accelerated from
// Q3 2026 → 2026-05-21 evening。
//
// Magic link in email points to:
//   ${origin}/auth/callback?code=XXX&type=magiclink
//
// We exchange the code for a session(sets HTTP-only cookies via
// the supabase-ssr server adapter)· then redirect:
//   - Success → /member?welcome=true
//   - Error   → /login?error=<reason>
//
// No analytics · no UTM tracking · just code-for-session exchange ·
// per /privacy 0-tracker promise。
// ─────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Sanitize `next` redirect param to prevent open-redirect attack
 * (per Round 31 W-Q code audit agent CRITICAL finding).
 *
 * Reject:
 *   - Absolute URL(http://attacker.com)
 *   - Protocol-relative(//attacker.com)
 *   - Empty / non-string
 *
 * Allow:
 *   - Internal path starting with single `/`
 *   - Optional query string + fragment
 *
 * Fallback to canonical /member welcome on any invalid input.
 */
function sanitizeNext(raw: string | null): string {
  const fallback = "/member?welcome=true";
  if (!raw || typeof raw !== "string") return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.startsWith("/\\")) return fallback;
  return raw;
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
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message || "exchange_failed")}`,
          url.origin
        )
      );
    }

    // Session cookies set via the ssr adapter setAll callback ·
    // redirect to /member welcome state(or sanitized custom next path)。
    return NextResponse.redirect(new URL(next, url.origin));
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "unknown_error";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(msg)}`, url.origin)
    );
  }
}
