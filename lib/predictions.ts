// ── ZONE 27 · User Predictions ──────────────────────────
// Round 31 W-W1 · Tim「使用者可以自己猜賽事?會記錄勝率?」 brand-IP-pure
// implementation:純精神 prediction(no money · no reward · no points)·
// 延伸 /member/calibration epistemic mirror 從「您 follow 賽事 engine
// calibration drift」 升「您 + engine + actual 三層 calibration mirror」。
//
// Storage:Supabase auth.users.user_metadata.predictions(同 follows
// pattern · 0 DB migration · per W-6 follows infra · per W-9 notes infra)。
// Shape:{ matchId: { pick: "home"|"away"|"skip", ts: ISO } }
//
// Brand IP fits:
//   - Metaculus calibration pattern · 不押錢 · 不兌獎 · 純 epistemic 比準
//   - 「您 vs 引擎 vs 實際」 三方 calibration mirror · brand IP epistemic
//     mirror 延伸 · 不破 W-2B「唯一發布會員自己 calibration drift」 axiom
//   - 0 cookie / 0 tracking / 0 PII broadcast(只您看您自己 prediction)
//   - 0 cash / 0 reward · 不違反 0% creator share 鐵律 · 不違反「不靠
//     秘密賺錢」倒置 SaaS · 不觸發 多層次傳銷 / 賭博監管
//
// Future iteration:
//   - prediction ts validation(only count if predicted < finalResult ingest)
//   - public aggregate「N% 會員猜 home」 social proof(per agent W-V research)
//   - /member/calibration add personal-prediction dots layer
// ─────────────────────────────────────────────────────

export type UserPrediction = {
  /** "home" · "away" · "skip"(skip = 看戲不押) */
  pick: "home" | "away" | "skip";
  /** ISO timestamp · when user wrote prediction · for future cheat detection */
  ts: string;
};

export type UserPredictionsMap = Record<string, UserPrediction>;

/**
 * Read predictions from user_metadata JSONB. Returns empty map if no
 * predictions yet OR if metadata shape mismatched(defensive parse)。
 *
 * Pattern mirrors readFollowsFromMeta · readNotesFromMeta(W-6 · W-9)。
 */
export function readPredictionsFromMeta(
  meta: Record<string, unknown> | null | undefined
): UserPredictionsMap {
  if (!meta) return {};
  const raw = meta.predictions;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: UserPredictionsMap = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== "object") continue;
    const obj = v as Record<string, unknown>;
    const pick = obj.pick;
    const ts = obj.ts;
    if (
      (pick === "home" || pick === "away" || pick === "skip") &&
      typeof ts === "string"
    ) {
      out[k] = { pick, ts };
    }
  }
  return out;
}

/** Calibration verdict for a single prediction · null if no final result yet */
export type PredictionVerdict = "proved" | "diverged" | "push" | null;

/**
 * Compute user prediction verdict against actual finalResult。
 * 「proved」 = user 猜對 winner · 「diverged」 = 猜錯 · 「push」 = 平局/skip
 * Returns null if no match data / no final yet。
 */
export function computeUserVerdict(
  pick: UserPrediction["pick"],
  finalWinner: "home" | "away" | "tie" | null | undefined
): PredictionVerdict {
  if (!finalWinner) return null;
  if (pick === "skip" || finalWinner === "tie") return "push";
  if (pick === finalWinner) return "proved";
  return "diverged";
}

/**
 * Aggregate user prediction stats from map + match list。
 * Used in /member dashboard 顯示「您 predictions 累計 N · ✓Y ✕Z · 您 N%」。
 */
export function aggregatePredictionStats(
  predictions: UserPredictionsMap,
  matches: { id: string; finalWinner: "home" | "away" | "tie" | null }[]
): {
  total: number;
  proved: number;
  diverged: number;
  push: number;
  pending: number;
  accuracy: number | null;
} {
  let total = 0;
  let proved = 0;
  let diverged = 0;
  let push = 0;
  let pending = 0;
  for (const [matchId, pred] of Object.entries(predictions)) {
    total++;
    const m = matches.find((x) => x.id === matchId);
    if (!m || m.finalWinner === null) {
      pending++;
      continue;
    }
    const verdict = computeUserVerdict(pred.pick, m.finalWinner);
    if (verdict === "proved") proved++;
    else if (verdict === "diverged") diverged++;
    else if (verdict === "push") push++;
  }
  const decided = proved + diverged;
  const accuracy = decided > 0 ? Math.round((proved / decided) * 100) : null;
  return { total, proved, diverged, push, pending, accuracy };
}
