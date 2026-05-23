// ── ZONE 27 · Waitlist Types + Helpers ──────────────────
// R67 W-D · split out from lib/waitlist.ts because that file is
// "use server" · Next.js 16 enforces all exports there must be async
// (server actions)。 Types + non-async helpers MUST live here so they
// can be imported from BOTH client(WaitlistForm.tsx)+ server
// (lib/waitlist.ts itself)without conflating the bundle。
//
// Single source of truth for error codes · derived as template-literal
// union from const-array · runtime iterability for future Sentry
// mapping + compile-time exhaustiveness check across consumers。
// ─────────────────────────────────────────────────────

export const WAITLIST_ERROR_CODES = [
  "missing_email",
  "invalid_email",
  "server_error",
] as const;

export type WaitlistErrorCode = (typeof WAITLIST_ERROR_CODES)[number];

export type WaitlistResult =
  | { ok: true; queuePos: number; alreadyReserved: false }
  | { ok: true; queuePos: number; alreadyReserved: true }
  | { ok: false; error: WaitlistErrorCode };

/** User-facing 中文 message · single source of truth · consumer SHOULD
 *  use this helper instead of inline ternary cascade · ensures new codes
 *  added to WAITLIST_ERROR_CODES auto-surface as TS error here(consumer
 *  swap from string literal switch → helper invocation is the migration
 *  per Tetlock discipline)。 Exhaustive switch · TS will flag any code
 *  added to WAITLIST_ERROR_CODES that's not handled here。 */
export function getWaitlistErrorMessage(code: WaitlistErrorCode): string {
  switch (code) {
    case "missing_email":
      return "請填寫 EMAIL";
    case "invalid_email":
      return "EMAIL 格式不正確";
    case "server_error":
      return "系統暫時無法處理 · 請稍後再試";
  }
}
