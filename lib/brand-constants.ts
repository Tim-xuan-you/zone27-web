// ── ZONE 27 · Brand Constants canonical source ────────
// R162 W2 · Agent M #5 · single source of truth for brand-level
// constants that propagate across 19+ mailto sites · transactional
// emails · footer · etc.
//
// 之前 tatayngiti@gmail.com hard-coded across 19+ files · domain
// switch(support@zone27.tw / zone27.app / zone27.io 啟用)時
// 要 hunt-and-replace 19+ sites · error-prone · single-string
// credential leak risk。
//
// 此 module 提供 single source · 未來 domain switch = 1 env var
// flip + 1 file update · 沒 sprawl 風險。
//
// Strategy:per CLAUDE.md TIER 1 budget · brand domain 註冊 ~NT$ 300-500/yr
// Tim 已表態 small money OK · 待 Tim 拍板 domain name 後 set
// NEXT_PUBLIC_SUPPORT_EMAIL env var on Vercel · 此檔 fallback
// 仍 tatayngiti@gmail.com 永遠可用。
//
// Migration plan(future incremental):
//   1. R162 · NEW lib/brand-constants.ts + update lib/email.ts only(this commit)
//   2. R163+ · refactor mailto sites incrementally to import SUPPORT_EMAIL
//   3. Tim 拍板 domain · set NEXT_PUBLIC_SUPPORT_EMAIL → support@zone27.x
//   4. mailto display text 統一(FoundersApplicationForm R156 W1.8 already
//      uses「support@zone27」 display + tatayngiti@gmail.com mailto destination)
// ─────────────────────────────────────────────────────

/**
 * Canonical support email · Tim 個人 inbox · 0 outsource。
 *
 * Override via `NEXT_PUBLIC_SUPPORT_EMAIL` env var when brand domain
 * ships(e.g. `support@zone27.tw`)· fallback to Tim 個人 Gmail。
 *
 * 同 Patek allocation pattern · solo founder model · 1 inbox 處理 all。
 */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "tatayngiti@gmail.com";

/**
 * Brand siteName · used in OG cards + email signatures + footer。
 */
export const BRAND_NAME = "ZONE 27";

/**
 * Brand tagline · 8-字 grammar 物理 codify · per /manifesto Section V。
 */
export const BRAND_TAGLINE = "不靠直覺,只看演算法";

/**
 * Brand locale · zh_TW canonical per Taiwanese CPBL fan audience。
 */
export const BRAND_LOCALE = "zh_TW";

/**
 * Latest brand-level review date · single source for FounderSignOff
 * default `signedAt` prop · per [[feedback-zone27-pratfall-brand-ip]]
 * stale-date prevention discipline。
 *
 * R166 W1 · introduced after Agent Q bug audit MEDIUM #2 finding ·
 * 30+ trust pages use &lt;FounderSignOff&gt; default · before R166 stuck
 * at "2026-05-21" hardcoded · Tim mandate「程式碼總有 bug · 嚴肅
 * 看待」 fulfilled via central source。
 *
 * Update protocol · bump on any cross-cutting brand review · NOT per
 * page edit(per-page edits should pass explicit signedAt to override)。
 */
export const LAST_BRAND_REVIEW = "2026-05-27";
