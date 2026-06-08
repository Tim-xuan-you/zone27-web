// ── ZONE 27 · 永久碼驗證(單一真相)──────────────────────────
// /u/[code] 公開檔案的碼 = 永久碼(z27_author_code = md5(uid) 前 8 碼 · hex)。
// 路由頁與 OG 卡共用同一支正規化/驗證 → 兩邊行為一致(防 DRY 漂移)。
// ─────────────────────────────────────────────────────

/** 永久碼格式:8 碼小寫 hex。 */
export const PROFILE_CODE_RE = /^[0-9a-f]{8}$/;

/**
 * 把路由參數正規化成合法永久碼,不合法回 null。
 * decode(容錯)+ trim + 轉小寫 + 8-hex 驗證。
 */
export function normalizeProfileCode(raw: string | null | undefined): string | null {
  let c = "";
  try {
    c = decodeURIComponent(raw ?? "");
  } catch {
    c = raw ?? "";
  }
  c = c.trim().toLowerCase();
  return PROFILE_CODE_RE.test(c) ? c : null;
}

/** 字串是否為合法永久碼(給「要不要連到 /u/[code]」判斷用)。 */
export function isProfileCode(s: string | null | undefined): boolean {
  return typeof s === "string" && PROFILE_CODE_RE.test(s.trim().toLowerCase());
}
