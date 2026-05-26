// ── ZONE 27 · sanitizeNext canonical helper ────────────
// R160 W1 · Agent M CRITICAL security parity fix · extract from
// app/auth/callback/route.ts to canonical lib · share with /login(R54 W-A
// vulnerability class was patched at /auth/callback but NOT at /login · 缺
// parity · `/%2F%2Fattacker.com` + null-byte + protocol-relative variants
// could bypass /login string-prefix check)。
//
// per [[zone27-disclosure-philosophy]] defense parity axiom · 1 fix per
// attack vector · NO asymmetric weakness across same-class entry points。
//
// References:
//   - OWASP Unvalidated Redirects Cheat Sheet
//   - Next.js Data Security 2026
//   - R54 W-A Agent 2 #4 CRITICAL fix(URL parse-based validation)
// ─────────────────────────────────────────────────────

/**
 * Validate visitor-supplied `?next=` URL parameter for safe internal redirect.
 *
 * Defense layers(in order):
 *   1. Null check
 *   2. Null-byte reject(some parsers strip pre-validation · we reject explicit)
 *   3. Must start with single `/` and NOT `//`(catches protocol-relative)
 *   4. Reject `/\\` backslash-protocol variant
 *   5. Parse-based validation · catches encoded bypasses(`%2F%2F` → `//`)·
 *      reconstruct path-only via URL constructor against dummy origin · if
 *      parser extracts a different host the value is rejected。
 *
 * Fallback to canonical `/member?welcome=true` on any invalid input。
 *
 * @param raw · the raw `?next=` URL parameter value · usually from URLSearchParams.get
 * @returns sanitized internal path safe to redirect to(starts with `/`)
 */
export function sanitizeNext(raw: string | null | undefined): string {
  const fallback = "/member?welcome=true";
  if (!raw || typeof raw !== "string") return fallback;
  // Reject null bytes(some parsers strip pre-validation · we reject explicit)
  if (raw.includes("\0")) return fallback;
  // Must start with single `/` and NOT `//` (catches protocol-relative)
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.startsWith("/\\")) return fallback;

  // Parse-based validation · catches encoded bypasses(%2F%2F → //)
  try {
    // Use dummy origin · only care about whether parser extracts a host
    const parsed = new URL(raw, "https://zone27-internal.invalid");
    // Allowed = parser kept dummy origin(meaning raw was truly relative)
    if (parsed.origin !== "https://zone27-internal.invalid") return fallback;
    // Reconstruct path-only · strip any protocol/host that might have slipped
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}
