// ── ZONE 27 · /auth/signout ───────────────────────────
// Round 30 Wave 5 · Phase 1 auth · logout flow。
// Posted from /member「登出」button · clears session cookies via
// Supabase ssr adapter · redirects to / homepage with a flash.
//
// R59 W-B · Agent B Finding #4 · CSRF defense-in-depth 同 /api/submit
// pattern · 防 third-party site 建 hidden form POST 強登出 ZONE 27 visitor。
// Browser sends Origin header on POST · check matches our host。
// ─────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const reqUrl = new URL(request.url);
    const originUrl = new URL(origin);
    return originUrl.host === reqUrl.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  // CSRF defense · same-origin check before any work · per R59 W-B
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "cross_origin_rejected" },
      { status: 403 }
    );
  }
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
