// ── ZONE 27 · /auth/signout ───────────────────────────
// Round 30 Wave 5 · Phase 1 auth · logout flow。
// Posted from /member「登出」button · clears session cookies via
// Supabase ssr adapter · redirects to / homepage with a flash.
// ─────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Best-effort signout · even on error redirect home
  }
  return NextResponse.redirect(new URL("/?signedout=1", url.origin), {
    status: 303,
  });
}
