"use server";

// ── ZONE 27 · Founders 27 Pre-launch Waitlist ──────────
// 在我們架好支付系統與正式資料庫之前的中繼方案。
//
// 流程:
//   1. 訪客填 email(+ 可選 name) → reserveSpot()
//   2. 驗證 email 格式
//   3. 把報名資訊寫到 console.log → Vercel 後台 logs 永久保存
//   4. 回傳 queue position 給前端
//
// 友善降級:目前用 module-level counter,冷啟動會重置。
// 升級到 Vercel KV / Upstash Redis 只要把 counter 與 dedup
// 邏輯抽出來 — 介面(reserveSpot 簽名)保持不變。
// ─────────────────────────────────────────────────────

let queueCounter = 0;
const seenEmails = new Set<string>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type WaitlistResult =
  | { ok: true; queuePos: number; alreadyReserved: false }
  | { ok: true; queuePos: number; alreadyReserved: true }
  | { ok: false; error: "missing_email" | "invalid_email" };

export async function reserveSpot(
  _prev: WaitlistResult | null,
  formData: FormData
): Promise<WaitlistResult> {
  const emailRaw = formData.get("email");
  const nameRaw = formData.get("name");

  if (typeof emailRaw !== "string" || emailRaw.trim().length === 0) {
    return { ok: false, error: "missing_email" };
  }
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email" };
  }
  const name =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : null;

  // Already on the list? Be friendly, return the same-ish slot
  // (we can't know their real prior slot in this minimal version)
  if (seenEmails.has(email)) {
    console.log(
      `[ZONE27 · WAITLIST · DUPE] email=${email} ts=${new Date().toISOString()}`
    );
    return { ok: true, queuePos: queueCounter, alreadyReserved: true };
  }

  queueCounter++;
  seenEmails.add(email);

  // This log is the persistence layer for now.
  // Tim can recover all signups from Vercel project → Logs → Filter "ZONE27 · WAITLIST".
  console.log(
    `[ZONE27 · WAITLIST · NEW] queue=${queueCounter} email=${email} name=${
      name ?? "—"
    } ts=${new Date().toISOString()}`
  );

  return { ok: true, queuePos: queueCounter, alreadyReserved: false };
}
