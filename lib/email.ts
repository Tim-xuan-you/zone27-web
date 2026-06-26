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
// Email sender address: defaults to `onboarding@resend.dev` (Resend's
// pre-verified shared free-tier domain — ⚠️ only delivers to Tim's OWN
// inbox, NOT to members). 🔑 To reach MEMBERS, set the `EMAIL_FROM` env var
// (e.g. `ZONE 27 <noreply@zone27.com.tw>`) AFTER verifying zone27.com.tw as a
// sending domain in Resend → Domains. One env var flips every email in this
// file from the sandbox to the real member-deliverable domain — no code deploy,
// no hunt-and-replace (mirrors REPLY_TO via SUPPORT_EMAIL). Fallback keeps the
// sandbox so nothing breaks before the domain is verified.
//
// Visual design: brand-aligned dark-navy + cold-gold + Geist Mono
// (fallback to system fonts since email clients don't load web fonts).
// Plain-text fallback for screen readers and plain-text-only clients.
// ─────────────────────────────────────────────────────

import { SUPPORT_EMAIL, BRAND_NAME } from "@/lib/brand-constants";
import { redactEmail } from "@/lib/redact-email";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// 🔑 一個 env var 翻整批信:設了 EMAIL_FROM(=已在 Resend 驗證的 zone27.com.tw 寄件地址)
// → 站上所有信都從真網域寄、會員收得到;沒設 → 退回 sandbox(只到 Tim 自己信箱 · 現況不破)。
const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? `${BRAND_NAME} <onboarding@resend.dev>`;
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
<p style="margin:0 0 16px 0;color:#8A93A8;font-size:14px;line-height:1.7;">我是 Tim · ZONE 27 創辦人。您剛剛在 zone27.com.tw/founders 留下 email · 預留了 GOLD 預售名單中的位置。<br><span style="color:#F5F2EA;">會員不限量 · 你養的是一個不靠明牌、不抽下注活下去的引擎 · 第 ${queuePos} 位早到。</span></p>

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
<p style="margin:0;color:#8A93A8;font-size:11px;text-align:center;line-height:1.7;"><a href="https://zone27.com.tw" style="color:#D4AF37;text-decoration:none;">zone27.com.tw</a></p>
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

我是 Tim · ZONE 27 創辦人。您剛剛在 zone27.com.tw/founders 留下 email · 預留了 GOLD 預售名單中的位置。

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
https://zone27.com.tw

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

// ── 回報 / bug · 任何人(含匿名訪客)都能告知問題 → 寄給 Tim ─────────────────
// /feedback 頁 + /api/feedback(anonymous-OK · 連沒註冊的人都能回報)。 跟上面共用
// Resend infra。 reporter 可匿名(contact 選填 · 留 email/LINE 才能回覆)。
// 🔴 不存資料庫(同 /privacy「0 server-side archive」)· 只 email。
// 🔴 不 log 內文 / 聯絡方式(可能含 PII)· 失敗只記 http status、不讀 Resend body(R224 房規)。

type FeedbackEmailArgs = {
  message: string;
  contact: string | null; // 選填 · 怎麼回覆(email / LINE)
  path: string | null; // 在哪一頁發現的(referrer)
};

export async function sendFeedbackNotification({
  message,
  contact,
  path,
}: FeedbackEmailArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[ZONE27 · FEEDBACK · SKIP] RESEND_API_KEY not set · feedback email skipped"
    );
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const safeMsg = escapeHtml(message).replace(/\n/g, "<br>");
  const safeContact = contact ? escapeHtml(contact) : "(匿名 · 未留聯絡方式)";
  const safePath = path ? escapeHtml(path) : "(未提供)";
  // contact 看起來像 email → 設成 reply_to(Tim 點 reply 直接回報告者);否則回 Tim 自己。
  const replyTo =
    contact && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) ? contact : REPLY_TO;
  const subject = `[ZONE 27 · 回報] ${message.slice(0, 50)}`;

  const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0F1A2E;color:#F5F2EA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#0F1A2E;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;background:#131F38;border:1px solid #D4AF37;">
<tr><td style="padding:32px;">
<p style="margin:0 0 6px 0;font-family:'SF Mono',monospace;color:#D4AF37;font-size:11px;letter-spacing:4px;">/ ZONE 27 · 回報</p>
<p style="margin:0 0 24px 0;font-family:'SF Mono',monospace;color:#8A93A8;font-size:10px;letter-spacing:3px;">使用者回報的問題 / bug</p>
<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">內容</p>
<div style="color:#F5F2EA;font-size:15px;line-height:1.7;border-left:2px solid #D4AF37;padding-left:14px;margin-bottom:20px;">${safeMsg}</div>
<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">怎麼回覆</p>
<p style="margin:0 0 20px 0;color:#F5F2EA;font-size:14px;font-family:'SF Mono',monospace;">${safeContact}</p>
<p style="margin:0 0 6px 0;color:#8A93A8;font-size:12px;">在哪一頁發現的</p>
<p style="margin:0;color:#F5F2EA;font-size:13px;font-family:'SF Mono',monospace;">${safePath}</p>
<hr style="border:0;border-top:1px solid #1E2A47;margin:24px 0;">
<p style="margin:0;color:#8A93A8;font-size:11px;line-height:1.6;">修好的記在 /corrections。 若上方有留 email · 點 reply 直接回他。</p>
</td></tr></table></td></tr></table></body></html>`;

  const text = `ZONE 27 · 回報 / bug

內容:
${message}

怎麼回覆: ${contact ?? "(匿名)"}
在哪一頁: ${path ?? "(未提供)"}

──
修好的記在 /corrections。`;

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
        reply_to: replyTo,
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) {
      // 🔒 只記 http status · 不讀/不回 Resend body(同 R224 防洩房規)。
      console.error(`[ZONE27 · FEEDBACK · ERROR] http=${response.status}`);
      return { ok: false, error: `resend_http_${response.status}` };
    }
    const data = (await response.json()) as { id?: string };
    const id = data.id ?? "unknown";
    console.log(`[ZONE27 · FEEDBACK · SENT] id=${id}`);
    return { ok: true, id };
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    console.error(`[ZONE27 · FEEDBACK · ERROR] uncaught err=${m}`);
    return { ok: false, error: m };
  }
}
