"use server";

import { FOUNDERS_TOTAL } from "@/lib/founders-stats";

// ── ZONE 27 · Email sender · Resend REST API direct ────
// Brand IP "no unnecessary deps" — uses fetch instead of the `resend`
// npm package. Single dependency-free function. Free tier 100/day.
//
// Failure mode: if RESEND_API_KEY isn't set (e.g. local dev without
// `.env.local` populated, or production missing the env var), this
// returns ok:false and logs a WARN — it does NOT throw. The waitlist
// signup still succeeds and the visitor still sees their queue position.
// This is intentional: confirmation email is bonus, not blocker.
//
// Email sender address: `onboarding@resend.dev` (Resend's pre-verified
// shared domain for free tier). Switches to `tim@zone27.tw` (or similar)
// after Tim purchases the brand domain (TODO ③).
//
// Visual design: brand-aligned dark-navy + cold-gold + Geist Mono
// (fallback to system fonts since email clients don't load web fonts).
// Plain-text fallback for screen readers and plain-text-only clients.
// ─────────────────────────────────────────────────────

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_ADDRESS = "ZONE 27 <onboarding@resend.dev>";
// Tim's real inbox · reply UNSUBSCRIBE 與一般訪客回信都落這。
// When brand domain (zone27.tw) ships · switch FROM to tim@zone27.tw
// for stronger sender identity; REPLY_TO can stay personal Gmail or
// follow.
const REPLY_TO = "tatayngiti@gmail.com";

export type EmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

type WaitlistEmailArgs = {
  to: string;
  name: string | null;
  queuePos: number;
};

export async function sendWaitlistConfirmation({
  to,
  name,
  queuePos,
}: WaitlistEmailArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  // Graceful degradation if key missing — waitlist insert already
  // succeeded, just log + return without throwing.
  if (!apiKey) {
    console.warn(
      `[ZONE27 · EMAIL · SKIP] RESEND_API_KEY not set · waitlist email skipped for ${to}`
    );
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const pos = String(queuePos).padStart(3, "0");
  // Greeting: use provided name if any, else first part of email (pre-@)
  const greeting = name ?? to.split("@")[0];
  // Round 24 subject reframe(post-Round-21 FREE TIER · Round-23 Nav「會員」)·
  // 原 subject 「ZONE 27 等候名單 · 您是 #N · NT$ 2,700 終身」隱含
  // 「訂閱者是想付錢的人」 · FREE TIER 訂閱者讀到會困惑「我又沒要付錢」。
  // 新 framing dual-purpose · 跟 WaitlistForm kicker 對齊。
  const subject = `✓ ZONE 27 · 您是 #${pos} · 免費訂閱 + Founders 27 預售`;

  const html = buildHtmlBody({ greeting, queuePos, pos });
  const text = buildTextBody({ greeting, queuePos, pos });

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[ZONE27 · EMAIL · ERROR] http=${response.status} to=${to} body=${errorBody}`
      );
      return { ok: false, error: `HTTP ${response.status}: ${errorBody.slice(0, 200)}` };
    }

    const data = (await response.json()) as { id?: string };
    const id = data.id ?? "unknown";
    console.log(
      `[ZONE27 · EMAIL · SENT] to=${to} queue=#${pos} id=${id} ts=${new Date().toISOString()}`
    );
    return { ok: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ZONE27 · EMAIL · ERROR] uncaught to=${to} err=${message}`);
    return { ok: false, error: message };
  }
}

// ── Email body builders ────────────────────────────────

function buildHtmlBody({
  greeting,
  queuePos,
  pos,
}: {
  greeting: string;
  queuePos: number;
  pos: string;
}): string {
  // System mono fallback chain since email clients don't load Geist.
  const mono = `'SF Mono', 'Menlo', 'Consolas', monospace`;
  const sans = `'Helvetica Neue', 'Helvetica', Arial, sans-serif`;

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ZONE 27 · 等候名單 #${pos}</title>
</head>
<body style="margin:0;padding:0;background:#0F1A2E;color:#F5F2EA;font-family:${sans};">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#0F1A2E;">
<tr><td align="center" style="padding:48px 16px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px;background:#131F38;border:1px solid #1E2A47;">
<tr><td style="padding:40px 32px;">

<!-- Brand kicker · Round 24 dual-purpose framing -->
<p style="margin:0 0 6px 0;font-family:${mono};color:#D4AF37;font-size:11px;letter-spacing:5px;text-transform:uppercase;">ZONE · 27</p>
<p style="margin:0 0 32px 0;font-family:${mono};color:#8A93A8;font-size:10px;letter-spacing:4px;text-transform:uppercase;">FREE TIER + FOUNDERS 27 PRE-LAUNCH</p>

<!-- Queue position headline -->
<p style="margin:0;color:#F5F2EA;font-size:14px;letter-spacing:0.5px;">您已預留位置 ·</p>
<p style="margin:6px 0 0 0;font-family:${mono};color:#D4AF37;font-size:64px;line-height:1;letter-spacing:-1px;font-weight:300;">#${pos}</p>
<p style="margin:6px 0 0 0;color:#8A93A8;font-size:13px;">等候名單第 ${queuePos} 位早到</p>

<hr style="border:0;border-top:1px solid #1E2A47;margin:28px 0;">

<!-- Tim's note -->
<p style="margin:0 0 16px 0;color:#F5F2EA;font-size:15px;line-height:1.6;">Hi ${escapeHtml(greeting)},</p>
<p style="margin:0 0 16px 0;color:#8A93A8;font-size:14px;line-height:1.7;">我是 Tim · ZONE 27 創辦人。您剛剛在 zone27-web.vercel.app/founders 留下 email · 預留了 Founders 27 預售名單中的位置。<br><span style="color:#F5F2EA;">${FOUNDERS_TOTAL} 個席位 · 您是第 ${queuePos} 位早到。</span></p>

<p style="margin:24px 0 12px 0;color:#F5F2EA;font-size:14px;letter-spacing:0.5px;">接下來幾件事:</p>
<ul style="margin:0 0 24px 0;padding-left:22px;color:#8A93A8;font-size:14px;line-height:1.8;">
<li>付款系統預計 <span style="color:#F5F2EA;">2026 Q3</span> 啟動(手工銀行轉帳 + TapPay)</li>
<li>正式開放預訂時 · 您會收到 <span style="color:#D4AF37;">24 小時優先取得連結</span></li>
<li><span style="color:#F5F2EA;">NT$ 2,700</span> 一次性 · 終身免費 · 永不調漲</li>
<li>0% 創作者抽成 · 編號 <span style="color:#F5F2EA;font-family:${mono};">#${pos}</span>(目前序位 · 正式開放時依付款順序確定)</li>
</ul>

<p style="margin:0 0 16px 0;color:#8A93A8;font-size:14px;line-height:1.7;">我不寄行銷信 · 下一封信只在 Q3 預訂正式啟動時寄。任何問題直接 <span style="color:#D4AF37;">reply 此 email</span> · 我每天看至少 2 次。</p>

<p style="margin:32px 0 0 0;color:#F5F2EA;font-size:14px;">Tim</p>
<p style="margin:4px 0 0 0;font-family:${mono};color:#8A93A8;font-size:11px;letter-spacing:2px;">ZONE 27 創辦人 · CPBL 球迷 27 年</p>

<hr style="border:0;border-top:1px solid #1E2A47;margin:32px 0 20px 0;">

<!-- Footer trust line -->
<p style="margin:0 0 6px 0;font-family:${mono};color:#8A93A8;font-size:10px;letter-spacing:3px;text-align:center;">FUNDED BY FOUNDERS · NO VC · NO ADS · NO TRACKERS</p>
<p style="margin:0;color:#8A93A8;font-size:11px;text-align:center;line-height:1.7;"><a href="https://zone27-web.vercel.app" style="color:#D4AF37;text-decoration:none;">zone27-web.vercel.app</a> · <a href="https://github.com/Tim-xuan-you/zone27-web" style="color:#D4AF37;text-decoration:none;">github 開源</a></p>
<p style="margin:14px 0 0 0;color:#8A93A8;font-size:11px;text-align:center;line-height:1.7;">想退出?reply UNSUBSCRIBE · 我手動移除您 · 不用 click track link</p>

</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildTextBody({
  greeting,
  queuePos,
  pos,
}: {
  greeting: string;
  queuePos: number;
  pos: string;
}): string {
  return `ZONE 27 · 免費訂閱 + Founders 27 預售名單

您已預留位置 · 第 ${queuePos} 位
#${pos}

Hi ${greeting},

我是 Tim · ZONE 27 創辦人。您剛剛在 zone27-web.vercel.app/founders 留下 email · 預留了 Founders 27 預售名單中的位置。

${FOUNDERS_TOTAL} 個席位 · 您是第 ${queuePos} 位早到。

接下來:
- 付款系統預計 2026 Q3 啟動(手工銀行轉帳 + TapPay)
- 正式開放預訂時 · 您會收到 24 小時優先取得連結
- NT$ 2,700 一次性 · 終身免費 · 永不調漲
- 0% 創作者抽成 · 編號 #${pos} 目前序位

我不寄行銷信 · 下一封信只在 Q3 預訂正式啟動時寄。
任何問題直接 reply · 我每天看至少 2 次。

Tim
ZONE 27 創辦人 · CPBL 球迷 27 年

──
FUNDED BY FOUNDERS · NO VC · NO ADS · NO TRACKERS
https://zone27-web.vercel.app

想退出?reply UNSUBSCRIBE 即可
`;
}

// Escape user-provided name for HTML embedding (defense against accidental
// HTML injection if visitor types `<script>` etc. as their name).
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
