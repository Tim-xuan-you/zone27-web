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
import { sanitizeNext } from "@/lib/sanitize-next";

// R160 W1 · Agent M CRITICAL security parity · sanitizeNext extracted to
// canonical `lib/sanitize-next.ts` shared with /login(parity-patched here)·
// per [[zone27-disclosure-philosophy]] defense parity axiom · 1 fix per
// attack vector · NO asymmetric weakness。 Original R54 W-A docstring +
// implementation moved verbatim to lib helper · re-imported above。

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
