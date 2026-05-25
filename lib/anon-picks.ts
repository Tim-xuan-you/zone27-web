// ── ZONE 27 · Anonymous Lens-Pick Loop ──────────────────
// Round 45 W-A · Agent L DEEPEST sharp call ship · per [[feedback-no-
// waiting-rule]]。 「Epistemic gym」 retention loop · localStorage-only ·
// 0 auth · 0 server · 0 PII · 0 tracking · 純 visitor 自己 device。
//
// 「You don't have a personal track record without an opinion. Anonymous
// visitors get a private one — never broadcast, never tied to identity.」
//
// brand IP 物理 codify:
//   - per [[zone27-disclosure-philosophy]] · 此 storage key 公開 in
//     /audit Section 06 LOCAL STORAGE TRANSPARENCY(R45 W-F)
//   - per FUNDED BY FOUNDERS · NO TRACKERS axiom · 0 server-side write
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fans
//     read 「您 picked X · engine picked Y」 fan-grammar value · 不
//     engineer-grammar
//
// Capped 50 entries(reasonable upper bound for a single season · CPBL
// season ~120 games / team · most fans won't pick every game)。 Sorted
// by pickedAt DESC · auto-prune oldest beyond cap。
//
// SSR-safe(typeof window guard)· hydration-safe(client mount flag in
// consuming components via discriminated union pattern from R40 W-G)。
//
// Storage schema versioned · 任何 incompat 修改未來需 bump _v2。
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_anon_picks_v1";
const MAX_ENTRIES = 50;

export type AnonPick = {
  matchId: string;
  pickedSide: "home" | "away";
  pickedAt: number; // Date.now() ms
  /** Engine's pick on this match · captured at pick-time for delta display */
  enginePickedSide: "home" | "away";
  /** Engine's confidence on the favorite at pick-time(0-100)*/
  engineConfidence: number;
  /** Actual match outcome · null until finalized · "tie" rare CPBL extras */
  finalOutcome: "home" | "away" | "tie" | null;
  /** Verdict computed at outcome-update time · null pre-final */
  verdict: "proved" | "diverged" | "push" | null;
};

/** Read all anon picks · SSR-safe · returns [] if no localStorage */
export function readAnonPicks(): AnonPick[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (p): p is AnonPick =>
          typeof p?.matchId === "string" &&
          (p.pickedSide === "home" || p.pickedSide === "away") &&
          typeof p?.pickedAt === "number" &&
          (p.enginePickedSide === "home" || p.enginePickedSide === "away") &&
          typeof p?.engineConfidence === "number"
      )
      .sort((a, b) => b.pickedAt - a.pickedAt)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Add a new pick · dedupes by matchId(allow re-pick · overwrite previous)。
 * Round 54 W-A · Agent 2 #7 fix · return PushResult instead of void · caller
 * can detect quota-exceeded / disabled localStorage · 不再 silent data loss。
 * Also dispatches custom event for in-tab CalibrationTierBadge re-derive。 */
export type PushResult =
  | { ok: true }
  | { ok: false; reason: "ssr" | "quota_exceeded" | "disabled" | "unknown" };

export function pushAnonPick(entry: {
  matchId: string;
  pickedSide: "home" | "away";
  enginePickedSide: "home" | "away";
  engineConfidence: number;
}): PushResult {
  if (typeof window === "undefined") return { ok: false, reason: "ssr" };
  try {
    const existing = readAnonPicks();
    const filtered = existing.filter((p) => p.matchId !== entry.matchId);
    const updated: AnonPick[] = [
      {
        ...entry,
        pickedAt: Date.now(),
        finalOutcome: null,
        verdict: null,
      },
      ...filtered,
    ].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Round 54 W-A · custom event for same-tab CalibrationTierBadge re-derive
    try {
      window.dispatchEvent(new CustomEvent("zone27:anon-picks-changed"));
    } catch {
      /* CustomEvent may fail in old IE polyfill · safe to ignore */
    }
    return { ok: true };
  } catch (err) {
    // Distinguish quota-exceeded vs disabled · DOMException code 22 = quota
    if (
      err instanceof DOMException &&
      (err.code === 22 || err.name === "QuotaExceededError")
    ) {
      return { ok: false, reason: "quota_exceeded" };
    }
    return { ok: false, reason: "disabled" };
  }
}

/** Update a pick with finalOutcome + computed verdict · idempotent。
 * Round 54 W-A · dispatch custom event for same-tab tier badge sync。 */
export function updatePickOutcome(
  matchId: string,
  finalOutcome: "home" | "away" | "tie"
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readAnonPicks();
    const updated = existing.map((p) => {
      if (p.matchId !== matchId) return p;
      const verdict: "proved" | "diverged" | "push" =
        finalOutcome === "tie"
          ? "push"
          : p.pickedSide === finalOutcome
          ? "proved"
          : "diverged";
      return { ...p, finalOutcome, verdict };
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    try {
      window.dispatchEvent(new CustomEvent("zone27:anon-picks-changed"));
    } catch {
      /* safe to ignore */
    }
  } catch {
    /* swallow */
  }
}

/** Find current pick on a specific matchId · null if not yet picked */
export function getAnonPickForMatch(matchId: string): AnonPick | null {
  return readAnonPicks().find((p) => p.matchId === matchId) ?? null;
}

/** Clear all anon picks · used by /audit「您可以清除」 link */
export function clearAnonPicks(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* swallow */
  }
}

/** Aggregate stats from picks · used in AnonCalibrationStrip */
export function computeAnonStats(picks: AnonPick[]): {
  total: number;
  pending: number;
  proved: number;
  diverged: number;
  push: number;
  yourAccuracy: number; // 0-100 · null if 0 finalized
  engineAccuracy: number; // 0-100 · null if 0 finalized · engine 對同 picks 的 accuracy
  delta: number; // your% - engine% · negative = you lost to engine · positive = you beat engine
  yourAccuracyLabel: string; // "—" if 0 finalized · else "%"
  engineAccuracyLabel: string;
} {
  const total = picks.length;
  const finalized = picks.filter((p) => p.verdict !== null);
  const pending = total - finalized.length;
  const proved = finalized.filter((p) => p.verdict === "proved").length;
  const diverged = finalized.filter((p) => p.verdict === "diverged").length;
  const push = finalized.filter((p) => p.verdict === "push").length;

  // Engine accuracy on SAME picks · 計算 engine 在這些 finalized games 的表現
  // (engine picked X · actual was Y · engine PROVED iff X === actual)
  const engineCorrect = finalized.filter(
    (p) => p.finalOutcome === p.enginePickedSide
  ).length;

  const yourAccuracyNum =
    finalized.length === 0 ? 0 : (proved / finalized.length) * 100;
  const engineAccuracyNum =
    finalized.length === 0 ? 0 : (engineCorrect / finalized.length) * 100;
  const delta = yourAccuracyNum - engineAccuracyNum;

  return {
    total,
    pending,
    proved,
    diverged,
    push,
    yourAccuracy: yourAccuracyNum,
    engineAccuracy: engineAccuracyNum,
    delta,
    yourAccuracyLabel:
      finalized.length === 0 ? "—" : `${Math.round(yourAccuracyNum)}%`,
    engineAccuracyLabel:
      finalized.length === 0 ? "—" : `${Math.round(engineAccuracyNum)}%`,
  };
}

/** Storage key for /audit S06 disclosure transparency */
export const ANON_PICKS_STORAGE_KEY = STORAGE_KEY;

// ── R119 W2 · Cialdini & Trope 1976 commitment-consistency surface ───
// Show「您 X 天前 picked」 chip on return visits to a match they picked。
// Agent A R119 SHIP 2 highest-priority finding: existing widget hides
// prior commitment by re-rendering PICKED_PRE_REVEAL header without
// temporal anchor · psychology loop breaks because visitor doesn't see
// their prior commitment when they return · adding the temporal badge
// brings the commitment back into conscious view · same Zajonc Mere
// Exposure reframing pattern as lib/last-shipped.ts formatTimeSince。
//
// Pure client function · pickedAtMs from AnonPick · Asia/Taipei timezone
// implicit via Date.now() comparison(both timestamps wall-clock TPE on
// visitor device · no server involvement)。
// ─────────────────────────────────────────────────────
export function formatPickedSince(pickedAtMs: number, now: number = Date.now()): string {
  const ms = Math.max(0, now - pickedAtMs);
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (minutes < 1) return "剛剛";
  if (minutes < 60) return `${minutes} 分鐘前`;
  if (hours < 24) return `${hours} 小時前`;
  if (days < 7) return days === 1 ? "1 天前" : `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  return `${Math.floor(days / 30)} 個月前`;
}
