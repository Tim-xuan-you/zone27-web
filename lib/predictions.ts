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
  matches: {
    id: string;
    finalWinner: "home" | "away" | "tie" | null;
    /** 開賽 instant ISO(Taipei +08:00)· 給「先鎖後結」用 · 缺則 fail-open 照算 */
    startISO?: string | null;
  }[]
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
    const m = matches.find((x) => x.id === matchId);
    // 先鎖後結 · 防賽後補登:已結算的場 · 押注時間戳必須早於開賽才算數。 開賽後/
    // 賽後才下的押注一律不計入(防刷準度、刷天梯 = 站上最常被攻擊的點)· 缺開賽
    // 時間或時間戳則 fail-open 照算(不誤殺正當押注)。 ⚠ 這是顯示層防線;server
    // 端 RPC 應一併拒收開賽後押注(belt-and-suspenders · 見 TODO 安全項)。
    if (m && m.finalWinner !== null && isLatePick(pred.ts, m.startISO)) {
      continue; // 整筆略過 · 不進 total / proved / diverged / pending
    }
    total++;
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

/** 押注時間戳是否「開賽後/賽後」才下(= 不該算數)· 缺資料 fail-open 回 false。
 *  Date.parse 對固定字串 deterministic · 不造成 hydration mismatch。 */
function isLatePick(ts: string, startISO: string | null | undefined): boolean {
  if (!startISO || !ts) return false;
  const t = Date.parse(ts);
  const start = Date.parse(startISO);
  if (Number.isNaN(t) || Number.isNaN(start)) return false;
  return t >= start;
}

// ── 個人校準身分(soul-roadmap #1 · 「有帳本的玩運彩」脊椎)─────────
// R189 已確立:二元押注(home/away)畫不出 45° 校準曲線(要有機率預測才有)·
// 所以個人「可靠度」不是校準曲線 · 而是三方命中率對照:你 vs 亂猜(50%)vs
// 引擎(同一批你押過的已結算場)。 全部含輸(不可造假)· 不誇大(滿軸 0-100 ·
// 不放大小差距 = 不捏造精確度 per engine-strategy §4)。
//
// 兩個誠實分(soul-roadmap):
//   1. 對比亂猜:你的準度 − 50(Metaculus baseline · 1 人就成立)。
//   2. 本月你 vs 引擎:當月你押的已結算場 · 你命中 vs 引擎命中 = R188 升階閘門
//      「當月贏過引擎」的實作(同 /ladder 硬條件)。
//
// 公平對照(apples-to-apples):引擎命中率只算「你押過、且引擎當時有看好一邊」
// 的同一批場(50/50 真銅板局引擎沒選邊 · 不灌水 · 同 /calibration 排除 ≤50)。
// 場數相同時用整數命中數直接比(精確)· 否則退回四捨五入準度比(極少數 50/50 場)。
// ─────────────────────────────────────────────────────

/** 評分用的單場輸入:賽果 + 引擎當時看好的一邊(null = 真 50/50 沒選邊)。 */
export type IdentityMatch = {
  id: string;
  finalWinner: "home" | "away" | "tie" | null;
  /** 引擎賽前看好的一邊 · getEngineFavorite() · null = 50/50 不選邊 */
  engineFav: "home" | "away" | null;
  /** 開賽 instant ISO(Taipei +08:00)· 先鎖後結 + 本月分桶用 */
  startISO?: string | null;
};

/** 一方在一批同樣場次上的命中(你 / 引擎共用)。 */
type SideTally = {
  proved: number; // 命中數
  decided: number; // 有效對照場數(分母)
  accuracy: number | null; // round(proved/decided*100) · decided=0 回 null
};

export type CalibrationIdentity = {
  // 你的完整紀錄(含輸 · 同 aggregatePredictionStats)
  total: number;
  proved: number;
  diverged: number;
  push: number;
  pending: number;
  decided: number; // proved + diverged
  accuracy: number | null;
  /** 對比亂猜:accuracy − 50 · null = 還沒有結算的場 */
  vsCoinPts: number | null;
  // 引擎在「你押過、且引擎有選邊」的同一批已結算場上的表現
  engine: SideTally;
  /** 你 > 引擎(同場對照)· null = 任一方無有效對照場 */
  beatEngine: boolean | null;
  tiedEngine: boolean;
  /** 你的準度 − 引擎準度(百分點)· null = 無法對照 */
  edgeVsEnginePts: number | null;
  // 本月(升階閘門)· 你 vs 引擎 同一批本月已結算場
  month: {
    key: string; // "2026-06"
    you: SideTally;
    engine: SideTally;
    beatEngine: boolean | null;
    tiedEngine: boolean;
  };
};

function makeTally(proved: number, decided: number): SideTally {
  return {
    proved,
    decided,
    accuracy: decided > 0 ? Math.round((proved / decided) * 100) : null,
  };
}

/** 你 vs 引擎裁決(同一批場)· 場數相同用整數命中數比(精確)· 否則用準度比。 */
function judgeVsEngine(
  you: SideTally,
  engine: SideTally
): { beat: boolean | null; tied: boolean } {
  if (you.decided === 0 || engine.decided === 0) return { beat: null, tied: false };
  if (you.decided === engine.decided) {
    return { beat: you.proved > engine.proved, tied: you.proved === engine.proved };
  }
  const ya = you.accuracy ?? 0;
  const ea = engine.accuracy ?? 0;
  return { beat: ya > ea, tied: ya === ea };
}

/**
 * 從本人押注 map + 賽果(含引擎選邊)算出完整「個人校準身分」。
 * currentMonthKey = getCurrentTaipeiMonthKey()(由 caller 傳入 · 維持本函式純粹）。
 *
 * 基礎計數(total/proved/diverged/push/pending/accuracy)與 aggregatePredictionStats
 * 完全一致(同一份先鎖後結守則)· 只是多算了引擎同場對照 + 本月分桶。
 */
export function aggregateIdentity(
  predictions: UserPredictionsMap,
  matches: IdentityMatch[],
  currentMonthKey: string
): CalibrationIdentity {
  const byId = new Map(matches.map((m) => [m.id, m]));

  let total = 0;
  let proved = 0;
  let diverged = 0;
  let push = 0;
  let pending = 0;

  // 同場對照累積(全期 + 本月)· 引擎只在 engineFav !== null 的場上算
  let youProvedAll = 0;
  let youDecidedAll = 0;
  let engProvedAll = 0;
  let engDecidedAll = 0;
  let youProvedMo = 0;
  let youDecidedMo = 0;
  let engProvedMo = 0;
  let engDecidedMo = 0;

  for (const [matchId, pred] of Object.entries(predictions)) {
    const m = byId.get(matchId);
    // 先鎖後結:已結算場 · 開賽後/賽後才下的押注整筆不計(防刷準度/刷天梯)。
    if (m && m.finalWinner !== null && isLatePick(pred.ts, m.startISO)) continue;

    total++;
    if (!m || m.finalWinner === null) {
      pending++;
      continue;
    }

    const verdict = computeUserVerdict(pred.pick, m.finalWinner);
    if (verdict === "proved") proved++;
    else if (verdict === "diverged") diverged++;
    else if (verdict === "push") push++;

    // 同場對照只看真正分出勝負的場(winner = home/away · 平局/skip 不進對照)
    if (m.finalWinner === "tie" || pred.pick === "skip") continue;
    const inMonth =
      typeof m.startISO === "string" && m.startISO.slice(0, 7) === currentMonthKey;

    // 你(分母 = 你所有分勝負的已結算押注場)
    youDecidedAll++;
    if (verdict === "proved") youProvedAll++;
    if (inMonth) {
      youDecidedMo++;
      if (verdict === "proved") youProvedMo++;
    }

    // 引擎(同一場 · 但只在引擎有選邊時計入它的分母)
    if (m.engineFav !== null) {
      engDecidedAll++;
      if (m.engineFav === m.finalWinner) engProvedAll++;
      if (inMonth) {
        engDecidedMo++;
        if (m.engineFav === m.finalWinner) engProvedMo++;
      }
    }
  }

  const decided = proved + diverged;
  const accuracy = decided > 0 ? Math.round((proved / decided) * 100) : null;

  const engineAll = makeTally(engProvedAll, engDecidedAll);
  const youAll = makeTally(youProvedAll, youDecidedAll);
  const vsEngineAll = judgeVsEngine(youAll, engineAll);
  const edgeVsEnginePts =
    youAll.accuracy !== null && engineAll.accuracy !== null
      ? youAll.accuracy - engineAll.accuracy
      : null;

  const youMo = makeTally(youProvedMo, youDecidedMo);
  const engineMo = makeTally(engProvedMo, engDecidedMo);
  const vsEngineMo = judgeVsEngine(youMo, engineMo);

  return {
    total,
    proved,
    diverged,
    push,
    pending,
    decided,
    accuracy,
    vsCoinPts: accuracy !== null ? accuracy - 50 : null,
    engine: engineAll,
    beatEngine: vsEngineAll.beat,
    tiedEngine: vsEngineAll.tied,
    edgeVsEnginePts,
    month: {
      key: currentMonthKey,
      you: youMo,
      engine: engineMo,
      beatEngine: vsEngineMo.beat,
      tiedEngine: vsEngineMo.tied,
    },
  };
}
