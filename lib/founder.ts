import { normalizeProfileCode } from "@/lib/profile-code";

// ── ZONE 27 · 創辦人帳本(R238 · Michelin 記分板第一塊)──────────────
// FOUNDER_AUTHOR_CODE = Tim 的永久碼(z27_author_code = md5(uid) 前 8 碼 · hex)·
// 也就是 /u/[code] 那個 URL 裡的碼。 設在 Vercel 環境變數(非機密 —— 它本來就是
// 公開的 /u 碼 —— 但放 env 讓 Tim 自己設、不寫進 repo,同銀行帳號 / VAPID pattern)。
//
// 預設 = "a7178cb4"(Tim 的永久碼 · 非機密 · 本來就是公開 /u 連結)→ 不必設 env 即生效。
// 想換創辦人帳號 → 改這裡的預設、或設 Vercel env FOUNDER_AUTHOR_CODE(env 優先)。
// 拿碼:登入 → /member →「你的公開檔案 →」· 那個 /u/XXXXXXXX 的 XXXXXXXX 就是。
// ─────────────────────────────────────────────────────

export const FOUNDER_AUTHOR_CODE: string =
  normalizeProfileCode(process.env.FOUNDER_AUTHOR_CODE ?? "a7178cb4") ?? "";

/** 這個永久碼是不是創辦人(Tim)的?未設 env → 一律 false。 */
export function isFounderCode(code: string | null | undefined): boolean {
  if (!FOUNDER_AUTHOR_CODE) return false;
  return normalizeProfileCode(code) === FOUNDER_AUTHOR_CODE;
}
