// ── ZONE 27 · Recent-Viewed Matches(localStorage) ──────
// Round 40 W-G · Agent F #5 ship · per [[feedback-no-waiting-rule]]。
//
// localStorage-only memory of recently viewed match pages · 0 cookies ·
// 0 server-side state · 0 PII · 0 tracking · 純 visitor 自己的 device。
//
// Brand IP 物理 codify:
//   - per [[zone27-disclosure-philosophy]] · /audit 公開 storage key 給
//     skeptic 看「我們存什麼 · 不存什麼」
//   - per FUNDED BY FOUNDERS · NO TRACKERS axiom · 此 mechanism 對齊
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 球迷常從
//     WhatsApp/LINE share link 跳到 single match · 無 nav memory · 此
//     recall scaffold 把 WhatsApp landers 升 multi-game readers
//
// 對標 Day One On This Day + Strava activity log + GitHub contribution
// pattern · 都是 localStorage / device-local data ownership framing 不是
// engagement extraction。
//
// Capped 10 entries · sorted by timestamp DESC · auto-prune older entries。
// SSR-safe(typeof window guard)· hydration-safe(client-only mount)。
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_recent_matches_v1";
const MAX_ENTRIES = 10;

export type RecentMatch = {
  gameId: string;
  title: string; // e.g. "富邦悍將 vs 統一7-ELEVEn獅"
  viewedAt: number; // Date.now() ms
};

/** Read recent matches list · SSR-safe · returns [] if no localStorage */
export function readRecentMatches(): RecentMatch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (m): m is RecentMatch =>
          typeof m?.gameId === "string" &&
          typeof m?.title === "string" &&
          typeof m?.viewedAt === "number"
      )
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Add a match to recent list · dedupes by gameId · auto-prunes oldest */
export function pushRecentMatch(entry: Omit<RecentMatch, "viewedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readRecentMatches();
    const filtered = existing.filter((m) => m.gameId !== entry.gameId);
    const updated: RecentMatch[] = [
      { ...entry, viewedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* swallow · localStorage quota or disabled */
  }
}

/** Clear recent list · used by /audit「您可以清除您的本地記憶」 link */
export function clearRecentMatches(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* swallow */
  }
}

/** Format viewedAt timestamp as relative · client-only */
export function formatRelativeTime(viewedAt: number): string {
  const diff = Date.now() - viewedAt;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "剛剛";
  if (minutes < 60) return `${minutes} 分鐘前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小時前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return `${Math.floor(days / 7)} 週前`;
}

/** Storage key for /audit transparency disclosure */
export const RECENT_MATCHES_STORAGE_KEY = STORAGE_KEY;
