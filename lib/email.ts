"use server";

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

import { SUPPORT_EMAIL, BRAND_NAME } from "@/lib/brand-constants";
import { redactEmail } from "@/lib/redact-email";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_ADDRESS = `${BRAND_NAME} <onboarding@resend.dev>`;
// R162 W2 · Agent M #5 · REPLY_TO now via canonical SUPPORT_EMAIL constant
// (lib/brand-constants.ts)· brand domain switch flips 1 env var instead of
// hunt-and-replace across 19+ mailto sites · prep for support@zone27.tw alias。
const REPLY_TO = SUPPORT_EMAIL;

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
      `[ZONE27 · EMAIL · SKIP] RESEND_API_KEY not set · waitlist email skipped for ${redactEmail(to)}`
    );
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const pos = String(queuePos).padStart(3, "0");
  // Greeting: use provided name if any, else first part of email (pre-@)
  const greeting = name ?? to.split("@")[0];
  // Round 24 subject reframe(post-Round-21 OPEN · Round-23 Nav「會員」)·
  // 原 subject 「ZONE 27 等候名單 · 您是 #N · NT$ 2,700 終身」隱含
  // 「訂閱者是想付錢的人」 · OPEN 訂閱者讀到會困惑「我又沒要付錢」。
  // 新 framing dual-purpose · 跟 WaitlistForm kicker 對齊。
  const subject = `✓ ZONE 27 · 您是 #${pos} · 免費訂閱 + GOLD 預售`;

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
      // 🔒 R224:不記 Resend errorBody —— 4xx 驗證錯誤的 body 會回吐收件人 email,
      // 把上面 redactEmail(to) 的遮蔽又洩回去(違 /privacy「0 email 進 log」承諾)。
      // 對齊站上 Tim-facing 寄信函式(SUBMISSION / FOUNDERS 通知)早就只記 http、不記 body 的房規
      // (defense parity · 同類入口不留不對稱弱點)。 回傳也改通用碼,不外吐上游 body。
      console.error(
        `[ZONE27 · EMAIL · ERROR] http=${response.status} to=${redactEmail(to)}`
      );
      return { ok: false, error: `resend_http_${response.status}` };
    }

    const data = (await response.json()) as { id?: string };
    const id = data.id ?? "unknown";
    console.log(
      `[ZONE27 · EMAIL · SENT] to=${redactEmail(to)} queue=#${pos} id=${id} ts=${new Date().toISOString()}`
    );
    return { ok: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ZONE27 · EMAIL · ERROR] uncaught to=${redactEmail(to)} err=${message}`);
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
<p style="margin:0 0 32px 0;font-family:${mono};color:#8A93A8;font-size:10px;letter-spacing:4px;text-transform:uppercase;">OPEN + GOLD PRE-LAUNCH</p>

<!-- Queue position headline -->
<p style="margin:0;color:#F5F2EA;font-size:14px;letter-spacing:0.5px;">您已預留位置 ·</p>
<p style="margin:6px 0 0 0;font-family:${mono};color:#D4AF37;font-size:64px;line-height:1;letter-spacing:-1px;font-weight:300;">#${pos}</p>
<p style="margin:6px 0 0 0;color:#8A93A8;font-size:13px;">等候名單第 ${queuePos} 位早到</p>

<hr style="border:0;border-top:1px solid #1E2A47;margin:28px 0;">

<!-- Tim's note -->
<p style="margin:0 0 16px 0;color:#F5F2EA;font-size:15px;line-height:1.6;">Hi ${escapeHtml(greeting)},</p>
<p style="margin:0 0 16px 0;color:#8A93A8;font-size:14px;line-height:1.7;">我是 Tim · ZONE 27 創辦人。您剛剛在 zone27-web.vercel.app/founders 留下 email · 預留了 GOLD 預售名單中的位置。<br><span style="color:#F5F2EA;">會員不限量 · 你養的是一個不靠明牌、不抽下注活下去的引擎 · 第 ${queuePos} 位早到。</span></p>

<p style="margin:24px 0 12px 0;color:#F5F2EA;font-size:14px;letter-spacing:0.5px;">接下來幾件事:</p>
<ul style="margin:0 0 24px 0;padding-left:22px;color:#8A93A8;font-size:14px;line-height:1.8;">
<li>付款系統 <span style="color:#F5F2EA;">payment infra 就緒後</span>啟動(milestone-triggered · 手工銀行轉帳 + TapPay)</li>
<li>正式開放預訂時 · 您會收到 <span style="color:#D4AF37;">24 小時優先取得連結</span></li>
<li><span style="color:#F5F2EA;">NT$ 2,700</span> / 365 天 · 每年 1/1 續訂 · 價格永不調漲</li>
<li>GOLD 賣的是身分與支持 · 不是功能 —— 引擎、準度、徽章全免費 · 會員不限量、沒有編號</li>
</ul>

<p style="margin:0 0 16px 0;color:#8A93A8;font-size:14px;line-height:1.7;">我不寄行銷信 · 下一封信只在 Q3 預訂正式啟動時寄。任何問題直接 <span style="color:#D4AF37;">reply 此 email</span> · 我每天看至少 2 次。</p>

<p style="margin:32px 0 0 0;color:#F5F2EA;font-size:14px;">Tim</p>
<p style="margin:4px 0 0 0;font-family:${mono};color:#8A93A8;font-size:11px;letter-spacing:2px;">ZONE 27 創辦人 · CPBL 球迷 27 年</p>

<hr style="border:0;border-top:1px solid #1E2A47;margin:32px 0 20px 0;">

<!-- Footer trust line -->
<p style="margin:0 0 6px 0;font-family:${mono};color:#8A93A8;font-size:10px;letter-spacing:3px;text-align:center;">FUNDED BY GOLD · NO VC · NO ADS · NO TRACKERS</p>
<p style="margin:0;color:#8A93A8;font-size:11px;text-align:center;line-height:1.7;"><a href="https://zone27-web.vercel.app" style="color:#D4AF37;text-decoration:none;">zone27-web.vercel.app</a></p>
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
  return `ZONE 27 · 免費訂閱 + GOLD 預售名單

您已預留位置 · 第 ${queuePos} 位
#${pos}

Hi ${greeting},

我是 Tim · ZONE 27 創辦人。您剛剛在 zone27-web.vercel.app/founders 留下 email · 預留了 GOLD 預售名單中的位置。

會員不限量 · 你養的是一個不靠明牌、不抽下注活下去的引擎 · 第 ${queuePos} 位早到。

接下來:
- 付款系統 payment infra 就緒後啟動(milestone-triggered · 手工銀行轉帳 + TapPay)
- 正式開放預訂時 · 您會收到 24 小時優先取得連結
- NT$ 2,700 / 365 天 · 每年 1/1 續訂 · 價格永不調漲
- GOLD 賣的是身分與支持 · 不是功能 —— 引擎、準度、徽章全免費 · 會員不限量

我不寄行銷信 · 下一封信只在 Q3 預訂正式啟動時寄。
任何問題直接 reply · 我每天看至少 2 次。

Tim
ZONE 27 創辦人 · CPBL 球迷 27 年

──
FUNDED BY GOLD · NO VC · NO ADS · NO TRACKERS
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

// ── R68 W-B · GOLD Application Received (visitor confirmation) ──
// Sent immediately after /founders/apply form submit · brand-tone HTML +
// plain-text · explicit「1-3 business days 內 Tim 手動 review」 wait time
// per Pratfall axiom honesty。 Re-uses Resend infrastructure · graceful
// degradation if RESEND_API_KEY missing。

type FoundersApplicationReceivedArgs = {
  to: string;
  name: string;
  applicationId: string;
};

export async function sendFoundersApplicationReceived({
  to,
  name,
  applicationId,
}: FoundersApplicationReceivedArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[ZONE27 · GOLD_APPLY_EMAIL · SKIP] RESEND_API_KEY not set · email skipped for ${redactEmail(to)}`,
    );
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const safeName = escapeHtml(name);
  const safeId = escapeHtml(applicationId);
  const subject = `✓ ZONE 27 · GOLD 申請已收到 · ${applicationId}`;
  const mono = `'SF Mono', 'Menlo', 'Consolas', monospace`;
  const sans = `'Helvetica Neue', 'Helvetica', Arial, sans-serif`;

  const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ZONE 27 · GOLD 申請已收到</title></head>
<body style="margin:0;padding:0;background:#0F1A2E;color:#F5F2EA;font-family:${sans};">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#0F1A2E;">
<tr><td align="center" style="padding:48px 16px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px;background:#131F38;border:1px solid #1E2A47;">
<tr><td style="padding:40px 32px;">

<p style="margin:0 0 6px 0;font-family:${mono};color:#D4AF37;font-size:11px;letter-spacing:5px;text-transform:uppercase;">ZONE · 27 · GOLD</p>
<p style="margin:0 0 32px 0;font-family:${mono};color:#8A93A8;font-size:10px;letter-spacing:4px;text-transform:uppercase;">APPLICATION RECEIVED · MANUAL REVIEW QUEUE</p>

<p style="margin:0;color:#F5F2EA;font-size:14px;letter-spacing:0.5px;">您的申請已收到 ·</p>
<p style="margin:6px 0 0 0;font-family:${mono};color:#D4AF37;font-size:24px;line-height:1.2;letter-spacing:0;font-weight:300;">${safeId}</p>
<p style="margin:6px 0 0 0;color:#8A93A8;font-size:13px;">Application ID · 請保留此編號做後續參考</p>

<hr style="border:0;border-top:1px solid #1E2A47;margin:28px 0;">

<p style="margin:0 0 16px 0;color:#F5F2EA;font-size:15px;line-height:1.6;">Hi ${safeName},</p>
<p style="margin:0 0 16px 0;color:#8A93A8;font-size:14px;line-height:1.7;">您剛剛在 <a href="https://zone27-web.vercel.app/founders/apply" style="color:#D4AF37;text-decoration:none;">zone27-web.vercel.app/founders/apply</a> 提交了 GOLD 申請。<br><span style="color:#F5F2EA;">這封信只是 receipt confirmation</span> · 您還沒被批准。</p>

<p style="margin:24px 0 12px 0;color:#F5F2EA;font-size:14px;letter-spacing:0.5px;">接下來的流程:</p>
<ol style="margin:0 0 24px 0;padding-left:22px;color:#8A93A8;font-size:14px;line-height:1.8;">
<li><span style="color:#F5F2EA;">1-3 business days</span> 內 · Tim 親手 review 您的申請</li>
<li>通過 → Tim email 您銀行轉帳資訊 + <span style="color:#D4AF37;">您 24 小時 window</span> 完成轉帳</li>
<li>未通過 → Tim 也會親手 email 跟你說明原因 · 不是罐頭式的「未通過」</li>
<li>轉帳完成 → 您的 GOLD 會員資格開通 · 365 天 access · 每年 1/1 續訂價永不調漲</li>
</ol>

<p style="margin:0 0 16px 0;color:#8A93A8;font-size:14px;line-height:1.7;">我不寄行銷信 · 下一封信只在 Tim review 完之後寄(approval / rejection / clarifying question)。 任何問題直接 <span style="color:#D4AF37;">reply 此 email</span> · 我每天看至少 2 次。</p>

<p style="margin:32px 0 0 0;color:#F5F2EA;font-size:14px;">Tim</p>
<p style="margin:4px 0 0 0;font-family:${mono};color:#8A93A8;font-size:11px;letter-spacing:2px;">ZONE 27 創辦人 · CPBL 球迷 27 年</p>

<hr style="border:0;border-top:1px solid #1E2A47;margin:32px 0 20px 0;">

<p style="margin:0 0 6px 0;font-family:${mono};color:#8A93A8;font-size:10px;letter-spacing:3px;text-align:center;">FUNDED BY GOLD · NO VC · NO ADS · NO TRACKERS</p>
<p style="margin:0;color:#8A93A8;font-size:11px;text-align:center;line-height:1.7;"><a href="https://zone27-web.vercel.app" style="color:#D4AF37;text-decoration:none;">zone27-web.vercel.app</a></p>
<p style="margin:14px 0 0 0;color:#8A93A8;font-size:11px;text-align:center;line-height:1.7;">想取消申請?reply CANCEL · 我手動移除 · 不用 click track link</p>

</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `ZONE 27 · GOLD 申請已收到

Application ID: ${applicationId}

Hi ${name},

您剛剛在 zone27-web.vercel.app/founders/apply 提交了 GOLD 申請。
這封信只是 receipt confirmation · 您還沒被批准。

接下來的流程:
1. 1-3 business days 內 · Tim 親手 review 您的申請
2. 通過 → Tim email 您銀行轉帳資訊 + 您 24 小時 window 完成轉帳
3. 未通過 → Tim 也會親手 email 跟你說明原因 · 不是罐頭式的「未通過」
4. 轉帳完成 → 您的 GOLD 會員資格開通 · 365 天 access · 每年 1/1 續訂價永不調漲

我不寄行銷信 · 下一封信只在 Tim review 完之後寄。
任何問題直接 reply · 我每天看至少 2 次。

Tim
ZONE 27 創辦人 · CPBL 球迷 27 年

──
FUNDED BY GOLD · NO VC · NO ADS · NO TRACKERS
https://zone27-web.vercel.app

想取消申請?reply CANCEL 即可
`;

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
      // 🔒 R224:不記 Resend errorBody(4xx body 會回吐收件人 email · 違 /privacy「0 email 進 log」)·
      // 對齊 Tim-facing 寄信函式只記 http 的房規(defense parity)· 回傳改通用碼不外吐上游 body。
      console.error(
        `[ZONE27 · GOLD_APPLY_EMAIL · ERROR] http=${response.status} to=${redactEmail(to)}`,
      );
      return {
        ok: false,
        error: `resend_http_${response.status}`,
      };
    }
    const data = (await response.json()) as { id?: string };
    const id = data.id ?? "unknown";
    console.log(
      `[ZONE27 · GOLD_APPLY_EMAIL · SENT] to=${redactEmail(to)} app=${applicationId} id=${id}`,
    );
    return { ok: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[ZONE27 · GOLD_APPLY_EMAIL · ERROR] uncaught to=${redactEmail(to)} err=${message}`,
    );
    return { ok: false, error: message };
  }
}

// ── R68 W-B · GOLD Application Notification (Tim's inbox) ──
// Sent to Tim's Gmail simultaneous with visitor confirmation · primary
// audit trail backstop pre-Supabase migration 0003 · review queue source
// of truth · reply 直接 → applicant · forward 給自己手動 transfer to
// approved bank-wire flow。 Same pattern as sendSubmissionNotification。

type FoundersApplicationNotificationArgs = {
  applicantEmail: string;
  applicantName: string;
  cpblConnection: string;
  why: string;
  applicationId: string;
};

export async function sendFoundersApplicationNotification({
  applicantEmail,
  applicantName,
  cpblConnection,
  why,
  applicationId,
}: FoundersApplicationNotificationArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[ZONE27 · GOLD_APPLY_NOTIFY · SKIP] RESEND_API_KEY not set · notification skipped for ${applicationId}`,
    );
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const subject = `[ZONE 27 · GOLD_APPLY] ${applicationId} · ${applicantName} · ${applicantEmail}`;
  const safeName = escapeHtml(applicantName);
  const safeEmail = escapeHtml(applicantEmail);
  const safeCpbl = escapeHtml(cpblConnection).replace(/\n/g, "<br>");
  const safeWhy = escapeHtml(why).replace(/\n/g, "<br>");
  const safeId = escapeHtml(applicationId);

  const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0F1A2E;color:#F5F2EA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#0F1A2E;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:680px;background:#131F38;border:2px solid #D4AF37;">
<tr><td style="padding:32px;">

<p style="margin:0 0 6px 0;font-family:'SF Mono',monospace;color:#D4AF37;font-size:11px;letter-spacing:4px;">/ ZONE 27 · GOLD_APPLY</p>
<p style="margin:0 0 24px 0;font-family:'SF Mono',monospace;color:#8A93A8;font-size:10px;letter-spacing:3px;">REVIEW QUEUE · MANUAL APPROVAL · 1-3 BUSINESS DAYS</p>

<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">Application ID</p>
<p style="margin:0 0 20px 0;color:#D4AF37;font-size:16px;font-family:'SF Mono',monospace;">${safeId}</p>

<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">From</p>
<p style="margin:0 0 20px 0;color:#F5F2EA;font-size:14px;"><strong>${safeName}</strong> &lt;${safeEmail}&gt;</p>

<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">CPBL CONNECTION</p>
<div style="margin:0 0 20px 0;color:#F5F2EA;font-size:14px;line-height:1.7;border-left:2px solid #D4AF37;padding-left:14px;">${safeCpbl}</div>

<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">WHY ZONE 27</p>
<div style="color:#F5F2EA;font-size:14px;line-height:1.7;border-left:2px solid #D4AF37;padding-left:14px;">${safeWhy}</div>

<hr style="border:0;border-top:1px solid #1E2A47;margin:28px 0;">

<p style="margin:0 0 12px 0;color:#F5F2EA;font-size:13px;letter-spacing:0.5px;">Tim · 申請審核 checklist:</p>
<ol style="margin:0 0 12px 0;padding-left:22px;color:#8A93A8;font-size:13px;line-height:1.8;">
<li>真名 or 暱稱?(都 OK · 只是先知道)</li>
<li>CPBL 球迷訊號真實?(球隊 + 年份 + 細節)</li>
<li>「Why ZONE 27」 是球迷不是工程師?</li>
<li>紅旗?(收費明牌老師 / 投顧 / 賭博中介)</li>
<li>適合 → 寄銀行轉帳資訊 24h window;不適合 → 親手 email 說明婉拒原因</li>
</ol>

<p style="margin:0;color:#8A93A8;font-size:11px;line-height:1.6;">Reply 此 email 直接給 applicant · 或 forward 給自己 / 加進 manual review spreadsheet · 通過後寄銀行資訊 24h window 完成。</p>

</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `ZONE 27 · GOLD_APPLY
REVIEW QUEUE · MANUAL APPROVAL · 1-3 BUSINESS DAYS

Application ID: ${applicationId}

From: ${applicantName} <${applicantEmail}>

CPBL CONNECTION:
${cpblConnection}

WHY ZONE 27:
${why}

──
Tim · 申請審核 checklist:
1. 真名 or 暱稱?(都 OK)
2. CPBL 球迷訊號真實?
3. 「Why ZONE 27」 是球迷不是工程師?
4. 紅旗?(收費明牌老師 / 投顧 / 賭博中介)
5. 適合 → 寄銀行轉帳資訊 24h window;不適合 → 親手 email 說明婉拒原因

Reply 此 email 直接給 applicant · 通過後寄銀行資訊 24h window 完成。`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [REPLY_TO], // Tim's Gmail
        reply_to: applicantEmail, // Reply directly to applicant
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[ZONE27 · GOLD_APPLY_NOTIFY · ERROR] http=${response.status} app=${applicationId}`,
      );
      return {
        ok: false,
        error: `HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
      };
    }
    const data = (await response.json()) as { id?: string };
    const id = data.id ?? "unknown";
    console.log(
      `[ZONE27 · GOLD_APPLY_NOTIFY · SENT] app=${applicationId} id=${id}`,
    );
    return { ok: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[ZONE27 · GOLD_APPLY_NOTIFY · ERROR] uncaught app=${applicationId} err=${message}`,
    );
    return { ok: false, error: message };
  }
}

// ── Round 30 Wave 10 · Submit-to-Tim notification ─────
// OPEN 投稿 path · per /membership Creator Permissions FAQ
// 「OPEN 投稿 · Tim 親手 curate · 1 篇 / 週」。 Member 在 /member/submit
// 填 title + body · 此 function 寄給 Tim 的 Gmail。 Tim 在收件匣審 · 過則
// Tim 親手 curate。 沒 public posting · 沒抽成(R238 收掉)·
// 純 Tim-curate model · 同 Stratechery Guest Post pattern。
//
// 跟 sendWaitlistConfirmation 共用 Resend infra · 不重複 setup。

type SubmissionEmailArgs = {
  memberEmail: string;
  title: string;
  body: string;
};

export async function sendSubmissionNotification({
  memberEmail,
  title,
  body,
}: SubmissionEmailArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[ZONE27 · SUBMISSION · SKIP] RESEND_API_KEY not set · submission email skipped from ${redactEmail(memberEmail)}`
    );
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const subject = `[ZONE 27 · SUBMISSION] ${title.slice(0, 60)} · from ${memberEmail}`;
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body).replace(/\n/g, "<br>");
  const safeMember = escapeHtml(memberEmail);

  const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0F1A2E;color:#F5F2EA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#0F1A2E;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;background:#131F38;border:1px solid #D4AF37;">
<tr><td style="padding:32px;">
<p style="margin:0 0 6px 0;font-family:'SF Mono',monospace;color:#D4AF37;font-size:11px;letter-spacing:4px;">/ ZONE 27 · SUBMISSION</p>
<p style="margin:0 0 24px 0;font-family:'SF Mono',monospace;color:#8A93A8;font-size:10px;letter-spacing:3px;">OPEN 投稿 · Tim curate 1/週</p>
<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">From</p>
<p style="margin:0 0 20px 0;color:#F5F2EA;font-size:14px;font-family:'SF Mono',monospace;">${safeMember}</p>
<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">Title</p>
<p style="margin:0 0 20px 0;color:#F5F2EA;font-size:20px;line-height:1.4;">${safeTitle}</p>
<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">Body</p>
<div style="color:#F5F2EA;font-size:14px;line-height:1.7;border-left:2px solid #D4AF37;padding-left:14px;">${safeBody}</div>
<hr style="border:0;border-top:1px solid #1E2A47;margin:28px 0;">
<p style="margin:0;color:#8A93A8;font-size:11px;line-height:1.6;">Reply to 此 email 直接給 member · 或 forward 給自己 curate · Tim 1/週 cadence。</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `ZONE 27 · SUBMISSION
OPEN 投稿 · Tim curate 1/週

From: ${memberEmail}
Title: ${title}

Body:
${body}

──
Reply 此 email 直接給 member · 或 forward 給自己 curate。`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [REPLY_TO], // Tim 自己收
        reply_to: memberEmail, // 點 reply 直接回給 member
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[ZONE27 · SUBMISSION · ERROR] http=${response.status} from=${redactEmail(memberEmail)}`
      );
      return {
        ok: false,
        error: `HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
      };
    }
    const data = (await response.json()) as { id?: string };
    const id = data.id ?? "unknown";
    console.log(
      `[ZONE27 · SUBMISSION · SENT] from=${redactEmail(memberEmail)} title="${title.slice(0, 40)}" id=${id}`
    );
    return { ok: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[ZONE27 · SUBMISSION · ERROR] uncaught from=${redactEmail(memberEmail)} err=${message}`
    );
    return { ok: false, error: message };
  }
}
