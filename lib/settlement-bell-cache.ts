// ── ZONE 27 · Nav 結算鈴鐺的 client 端快取(單一真相 · 防 key 漂移)──────────────
// SettlementBell 讀、MarkInboxSeen / ReturnedWhileAwayCard 寫 —— 三處共用同一個 key + helper,
// 不再各自硬寫字串(R231 稽核抓到:對過帳的兩個面只有一個清快取 → 徽章殘留自打臉)。
//
// client-only(用 window.sessionStorage / Date.now)· 只在 client 元件的 effect / handler 內呼叫。
// sessionStorage 短快取(90s)→ SPA 連續換頁不重打 /api/settlements。
// ─────────────────────────────────────────────────────

export const SETTLEMENT_BELL_CACHE_KEY = "zone27_settle_unread_v1";
const TTL_MS = 90 * 1000;

type Cached = { count: number; at: number };

/** 快取新鮮(90s 內)→ 回數字;過期 / 無 / 壞 → null(呼叫端去打 API)。 */
export function readBellCache(): number | null {
  try {
    const raw = window.sessionStorage.getItem(SETTLEMENT_BELL_CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cached;
    if (typeof c.count !== "number" || typeof c.at !== "number") return null;
    if (Date.now() - c.at > TTL_MS) return null;
    return c.count;
  } catch {
    return null;
  }
}

export function writeBellCache(count: number): void {
  try {
    window.sessionStorage.setItem(
      SETTLEMENT_BELL_CACHE_KEY,
      JSON.stringify({ count, at: Date.now() }),
    );
  } catch {
    /* private mode / quota · 不影響功能 */
  }
}

/** 對過帳了 / 登出 → 徽章當下歸零(寫 count:0 · 不用等 TTL 過)。 */
export function markBellSeen(): void {
  writeBellCache(0);
}
