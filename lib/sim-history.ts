// ── ZONE 27 · Local Sim History ────────────────────────
// 純 client-side 儲存於 localStorage,不離開瀏覽器,不違反
// privacy policy 的「不收任何瀏覽行為」承諾。
//
// 用途:讓回訪者看到自己過去跑過的最近模擬,Spotify-style
// 「最近播放」感覺。
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_sim_history_v1";
const MAX_ENTRIES = 10;

export type SimHistoryEntry = {
  /** Stable identifier for the matchup (e.g. cpbl-260519-01 or custom-<hash>) */
  matchId: string;
  /** Display label (e.g. "中信兄弟 vs 統一獅") */
  matchupName: string;
  /** Final convergence: home win % (0-100) */
  homePct: number;
  /** Final convergence: away win % (0-100) */
  awayPct: number;
  /** Convenience: home team display name */
  homeName: string;
  /** Convenience: away team display name */
  awayName: string;
  /** Timestamp (ms since epoch) */
  ranAt: number;
  /** Total simulations run (always 10000 in v0.20) */
  totalSims: number;
  /** Whether this was a /lab/custom run (vs /lab preset or /matches embed) */
  isCustom: boolean;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSimHistory(): SimHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is SimHistoryEntry =>
          typeof e === "object" &&
          e !== null &&
          typeof e.matchId === "string" &&
          typeof e.matchupName === "string" &&
          typeof e.ranAt === "number"
      )
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function saveSimHistory(entry: SimHistoryEntry): SimHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const existing = getSimHistory();
    // Replace any prior entry with the same matchId (treat as "re-run") so
    // the list shows unique matchups by most-recent run.
    const filtered = existing.filter((e) => e.matchId !== entry.matchId);
    const next = [entry, ...filtered].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getSimHistory();
  }
}

export function clearSimHistory(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Returns a Chinese relative-time label ("剛剛", "3 分鐘前", "昨天", "5 天前", "2026/05/12").
 */
export function relativeTime(ts: number, now = Date.now()): string {
  const delta = Math.max(0, now - ts);
  const sec = Math.floor(delta / 1000);
  if (sec < 30) return "剛剛";
  if (sec < 60) return `${sec} 秒前`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} 分鐘前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小時前`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "昨天";
  if (day < 7) return `${day} 天前`;
  // Format as YYYY/MM/DD
  const d = new Date(ts);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(d.getDate()).padStart(2, "0")}`;
}
