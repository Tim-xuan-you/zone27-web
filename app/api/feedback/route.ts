// ── ZONE 27 · /api/feedback · 任何人(含匿名訪客)回報問題 / bug → 寄給 Tim ──────
// 🔴 不需登入 —— 這是重點:連沒註冊的訪客都能輕易回報(降到最低摩擦)。
// 🔴 不存資料庫(同 /privacy「0 server-side archive」)· 只 email 給站長。
// 防濫用(無 auth gate 的代償):same-origin(擋外部 bot 直打)+ honeypot 隱藏欄
//   + 長度上限。 KV rate-limit 暫不做(10 人量級 + 上述足夠 · 之後可加)。
// graceful:Resend 沒設 → sendFeedbackNotification 回 ok:false · 前端顯示直接寄信的後備。
// ─────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { sendFeedbackNotification } from "@/lib/email";

const MAX_MSG = 2000;
const MIN_MSG = 4;
const MAX_CONTACT = 120;
const MAX_PATH = 300;

// 同 /api/submit:同源才放行(CSRF / 外部 bot defense-in-depth)。
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "cross_origin_rejected" },
      { status: 403 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
  const p = payload as Record<string, unknown>;

  // honeypot:真人看不到的隱藏欄 · 有填 = bot → 假裝成功、悄悄丟掉(不給 bot 失敗訊號)。
  if (typeof p.website === "string" && p.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const message =
    typeof p.message === "string" ? p.message.trim().slice(0, MAX_MSG) : "";
  if (message.length < MIN_MSG) {
    return NextResponse.json({ ok: false, error: "too_short" }, { status: 400 });
  }
  const contact =
    typeof p.contact === "string" && p.contact.trim()
      ? p.contact.trim().slice(0, MAX_CONTACT)
      : null;
  const path =
    typeof p.path === "string" && p.path.trim()
      ? p.path.trim().slice(0, MAX_PATH)
      : null;

  const result = await sendFeedbackNotification({ message, contact, path });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
