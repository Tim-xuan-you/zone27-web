// ── ZONE 27 · /api/submit · FREE TIER 投稿 endpoint ────
// Round 30 Wave 10 · per /membership Creator Permissions FAQ
// 「FREE TIER 投稿 · Tim 親手 curate · 1 篇 / 週」。
//
// Flow:
//   1. /member/submit form POST title + body
//   2. Server validates session(only logged-in members can submit)
//   3. Title/body capped + escaped(防 abuse / XSS)
//   4. sendSubmissionNotification 寄給 Tim Gmail via Resend
//   5. Return JSON ok / error
//
// Brand IP:
//   - 沒 public posting(per BLACK CARD Q3+ TapPay axiom)
//   - 純 Tim-curate flow · Stratechery Guest Post pattern
//   - 不存資料庫 · 只 email · 0 server-side archive(per /privacy)
// ─────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendSubmissionNotification } from "@/lib/email";

const MAX_TITLE_LEN = 120;
const MAX_BODY_LEN = 3000;

/**
 * Same-origin POST check · per Round 31 W-Q code audit agent HIGH finding。
 * Reject cross-origin POSTs(CSRF defense-in-depth on top of session check)。
 * Browser sends Origin header on POST · check it matches our host。
 */
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
  // CSRF defense · same-origin check before any work
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "cross_origin_rejected" },
      { status: 403 }
    );
  }

  // Require authenticated session(防 anon spam)
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "not_logged_in" },
      { status: 401 }
    );
  }

  // Parse JSON body
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  const p = payload as Record<string, unknown>;
  const title =
    typeof p.title === "string" ? p.title.trim().slice(0, MAX_TITLE_LEN) : "";
  const body =
    typeof p.body === "string" ? p.body.trim().slice(0, MAX_BODY_LEN) : "";
  if (!title || !body) {
    return NextResponse.json(
      { ok: false, error: "missing_title_or_body" },
      { status: 400 }
    );
  }
  if (title.length < 5 || body.length < 30) {
    return NextResponse.json(
      { ok: false, error: "too_short" },
      { status: 400 }
    );
  }

  const memberEmail = session.user.email ?? "anonymous@unknown";

  const result = await sendSubmissionNotification({
    memberEmail,
    title,
    body,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
