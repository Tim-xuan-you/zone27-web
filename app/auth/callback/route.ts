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

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/member?welcome=true";

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
    // redirect to /member welcome state。
    return NextResponse.redirect(new URL(next, url.origin));
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "unknown_error";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(msg)}`, url.origin)
    );
  }
}
