// ── ZONE 27 · Lens Focus Votes ──────────────────────────
// R67 W-A · Agent R66 ship #1 deferred queue · Cialdini & Trope 1976
// commitment-consistency 物理 codify。 訪客在 explore /02 LENS CANVAS
// 之前 1-tap pre-commit「您認為哪個 lens 對今晚這場最 matter?」 ·
// 後 visitor reads through lenses 跟 own commitment 對比 · IKEA-effect
// 延伸到 lens-level engagement(不只 home/away pick · 而是「您 betting
// on which analytical angle decides this game」)。
//
// brand IP 物理 codify:
//   - per [[zone27-disclosure-philosophy]] · storage key 公開 /audit S06
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 球迷自然
//     發言「今晚先看哪邊」 fan-grammar pre-commit · 不是 power-user
//     engineer flag
//   - per [[feedback-no-waiting-rule]] · ship NOW · 0 server / 0 PII
//   - per /audit S06 LOCAL STORAGE TRANSPARENCY pattern · 9th key
//     joining anon-picks family · same versioning grammar
//   - per [[feedback-zone27-pratfall-brand-ip]] · vote 不 reveal「正確
//     答案」 · 不裝 reward system · 純 pre-commit + post-explore self-
//     audit · 倒置 gambling「我猜對了」 dopamine loop
//
// 不做 anti-pattern:
//   ✕ leaderboard / 「X% voters chose park factor」 live feed → 違反
//     11-item 「不做」 list #5「X of 270 sold」 FOMO counter spirit
//   ✕ 「您答對了」 reward animation → fake methodology(brand soul)
//   ✕ cross-match aggregation → 純 per-match local commitment
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_lens_focus_votes_v1";
const MAX_ENTRIES = 50;

// R68 W-D · Audit F7 fix · apply R67 W-D Tetlock track-able-error pattern
// to LensId · derive type from const-array source of truth · adding new
// lens to LENS_IDS auto-widens LensId AND propagates to VALID_LENSES +
// LENS_OPTIONS via single source · 不再 3-place silent drift risk · same
// discipline as WAITLIST_ERROR_CODES。

/** 6 lens IDs · const-array source of truth · matches /02A-/02F in
 *  /matches/[gameId] · stable across future renames(brand IP「lens
 *  vocabulary 與 actual data scope reconciliation」 per R43 W-C steelman
 *  Obj 03 pattern)。 Adding to this array auto-types everything below. */
export const LENS_IDS = [
  "vibe",
  "park",
  "workload",
  "underdog",
  "bullpen",
  "matchup",
] as const;

export type LensId = (typeof LENS_IDS)[number];

export type LensFocusVote = {
  matchId: string;
  votedLens: LensId;
  votedAt: number;
};

export type LensFocusPushResult =
  | { ok: true }
  | { ok: false; reason: "ssr" | "quota_exceeded" | "disabled" | "unknown" };

// Derived from LENS_IDS · 0 manual sync risk · adding to LENS_IDS auto-
// widens this Set without code touch。
const VALID_LENSES: ReadonlySet<LensId> = new Set(LENS_IDS);

/** Read all lens-focus votes · SSR-safe · returns [] if no localStorage */
export function readLensFocusVotes(): LensFocusVote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (v): v is LensFocusVote =>
          typeof v?.matchId === "string" &&
          typeof v?.votedAt === "number" &&
          typeof v?.votedLens === "string" &&
          VALID_LENSES.has(v.votedLens as LensId),
      )
      .sort((a, b) => b.votedAt - a.votedAt)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Add or overwrite vote for a match · dedupes by matchId · idempotent
 *  semantics(re-vote 是 OK · overwrites previous)· per AnonPick R54 W-A
 *  PushResult pattern · 不 silent fail。 */
export function pushLensFocusVote(entry: {
  matchId: string;
  votedLens: LensId;
}): LensFocusPushResult {
  if (typeof window === "undefined") return { ok: false, reason: "ssr" };
  if (!VALID_LENSES.has(entry.votedLens)) {
    return { ok: false, reason: "unknown" };
  }
  try {
    const existing = readLensFocusVotes();
    const filtered = existing.filter((v) => v.matchId !== entry.matchId);
    const updated: LensFocusVote[] = [
      {
        matchId: entry.matchId,
        votedLens: entry.votedLens,
        votedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // R68 W-D · Audit F10 fix · removed dead CustomEvent dispatch · no
    // listener wired(LensFocusVote re-reads on state mount via useEffect ·
    // /calibration page does not yet surface lens-vote stats)· avoid dead
    // code per[[zone27-disclosure-philosophy]] cleanup discipline · if
    // future /calibration ships lens-vote aggregate · re-add dispatch +
    // wire listener together · 不 ship orphan side effect。
    return { ok: true };
  } catch (err) {
    if (
      err instanceof DOMException &&
      (err.code === 22 || err.name === "QuotaExceededError")
    ) {
      return { ok: false, reason: "quota_exceeded" };
    }
    return { ok: false, reason: "disabled" };
  }
}

/** Find current vote on a specific matchId · null if not yet voted */
export function getLensFocusVoteForMatch(
  matchId: string,
): LensFocusVote | null {
  return readLensFocusVotes().find((v) => v.matchId === matchId) ?? null;
}

/** Storage key for /audit S06 disclosure transparency */
export const LENS_FOCUS_VOTES_STORAGE_KEY = STORAGE_KEY;

/** 6 lens display metadata · single source of truth for component +
 *  any future /calibration aggregation surface · stable ordering matches
 *  /matches/[gameId] /02A-/02F section sequence。 */
export const LENS_OPTIONS: ReadonlyArray<{
  id: LensId;
  code: string;
  label: string;
  enLabel: string;
}> = [
  { id: "vibe", code: "02A", label: "氣勢", enLabel: "VIBE CHECK" },
  { id: "park", code: "02B", label: "場館", enLabel: "PARK FACTOR" },
  { id: "workload", code: "02C", label: "投手負荷", enLabel: "WORKLOAD PROXY" },
  { id: "underdog", code: "02D", label: "黑馬機率", enLabel: "UNDERDOG TRACKER" },
  { id: "bullpen", code: "02E", label: "牛棚深度", enLabel: "BULLPEN DEPTH" },
  { id: "matchup", code: "02F", label: "對戰史", enLabel: "MATCHUP HISTORY" },
];
