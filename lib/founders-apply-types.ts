// ── ZONE 27 · GOLD Application Types + Helpers ───
// R68 W-A · GOLD application form (1 layer deeper than waitlist) ·
// 會員不限量 · 無編號 · Tim 手動 review → 通過寄銀行轉帳資訊 → 手動轉帳。
//
// Split from lib/founders-apply.ts because that file has "use server" ·
// Next.js 16 enforces all exports there must be async server actions ·
// types + non-async helpers MUST live here。 Same architecture pattern as
// R67 W-D lib/waitlist-types.ts split.
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · error taxonomy 公開可 enum ·
//     skeptic 可 audit「ZONE 27 acknowledges N distinct failure modes」
//   - per [[feedback-zone27-pratfall-brand-ip]] · application is NOT
//     auto-approved · «Tim 1-3 business days 內手動 review» 明示 wait time
//   - per [[feedback-zone27-audience-fans-not-engineers]] · application
//     asks「您 CPBL 球迷 N 年」 fan-grammar · NOT engineering form
// ─────────────────────────────────────────────────────

// R69 W-G · Agent B audit F5 fix · removed "rate_limited" from declared
// codes · was unreachable(server action had no rate-limit logic)·
// declaring error code = pre-commit to handle it · Tetlock track-able-
// error discipline says「declare what you actually do」 · re-add when
// migration 0003 ships with Supabase RLS-locked applications table +
// per-IP cooldown rate-limit。 8 codes remaining(all reachable):
export const GOLD_APPLY_ERROR_CODES = [
  "missing_email",
  "invalid_email",
  "missing_name",
  "missing_cpbl_connection",
  "missing_why",
  "why_too_short",
  "why_too_long",
  "server_error",
] as const;

export type FoundersApplyErrorCode =
  (typeof GOLD_APPLY_ERROR_CODES)[number];

export type FoundersApplyResult =
  | { ok: true; applicationId: string }
  | { ok: false; error: FoundersApplyErrorCode };

/** User-facing 中文 message · exhaustive switch · 新 code 加入
 *  GOLD_APPLY_ERROR_CODES auto-typesafe surface · 同 R67 W-D
 *  Tetlock track-able-error pattern。 */
export function getFoundersApplyErrorMessage(
  code: FoundersApplyErrorCode,
): string {
  switch (code) {
    case "missing_email":
      return "請填寫 EMAIL";
    case "invalid_email":
      return "EMAIL 格式不正確";
    case "missing_name":
      return "請填寫稱呼";
    case "missing_cpbl_connection":
      return "請說明您支持的 CPBL 球隊";
    case "missing_why":
      return "請說明為什麼想成為 Founder";
    case "why_too_short":
      return "說明太短 · 請至少 50 字 · Tim 需要 context 做 review 決定";
    case "why_too_long":
      return "說明太長 · 請控制在 600 字內 · 重點 not 長文";
    case "server_error":
      return "系統暫時無法處理 · 請稍後再試 · 或直接 email tatayngiti@gmail.com";
  }
}

/** Application field length constraints · server + client share */
export const GOLD_APPLY_LIMITS = {
  whyMinChars: 50,
  whyMaxChars: 600,
  nameMaxChars: 60,
  cpblConnectionMaxChars: 200,
} as const;
