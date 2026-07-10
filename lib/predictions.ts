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
 *  Date.parse 對固定字串 deterministic · 不造成 hydration mismatch。
 *  exported:顯示層(收據本人 pick 戳)也用同一份判定 · 單一真相不另寫。 */
export function isLatePick(ts: string, startISO: string | null | undefined): boolean {
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
    // 本月分桶一律過 taipeiDayOf 收斂台北月再比 —— CPBL startISO 帶 +08:00、MLB 是
    // UTC ISO(...Z),裸 slice(0,7) 會在月初/月末把跨台北月界的 MLB 場分錯月桶,
    // 污染「本月你 vs 引擎」升階閘門的分母(R209 修)。
    const startDay = taipeiDayOf(m.startISO);
    const inMonth = startDay !== null && startDay.slice(0, 7) === currentMonthKey;

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

// ── 每日對帳 streak(soul-roadmap #2 · 「交易員紀律」不是 Candy Crush)──────────
// 你連續幾天回來下注 / 面對自己的帳本(含贏含輸)。 Manifold 證實 streak 撐 retention ·
// 但我們刻意拆掉賭場那套(不發點數、不放動畫、不製造「別斷了!」焦慮)· 只當紀律鏡子。
//
// 🔴 紅線(別把護城河燒掉):
//   - streak ≠ 更準 —— 連續天數不代表勝率(component 文案明講 · 防誤導)。
//   - 不獎勵連續(不發點數/現金/動畫)· 獎勵是身分/紀律本身。
//   - lapsed(斷了)時平靜顯示紀錄,不羞辱、不嚇人、不用「失去 N 天連勝」恐嚇。
//
// ⚙️ 為什麼用「下注日」(ts 的台北日)而不是「比賽日」:賭客賽前數天就 pre-bet ·
//   下注日 ≠ 比賽日。 streak 衡量的是「你哪幾天回來面對帳本」= 由你掌控的下注那天。
//   單一軸 · 連續性按台北日曆日算。 「休賽沒得押」的疑慮用文案中性處理(永不羞辱)+
//   累計天數只增不減承接 —— 而不是用不可靠的歷史排程假裝橋接(MLB 滾動視窗根本沒料)。
// ─────────────────────────────────────────────────────

/** ISO 時間戳 → 台北日「YYYY-MM-DD」· 不可解析回 null。 與 getTodayTaipei 同口徑
 *  (en-CA + Asia/Taipei)· 純伺服器端讀取(get_my_predictions)· 無 hydration 風險。 */
export function taipeiDayOf(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(
    new Date(t)
  );
}

/** 「YYYY-MM-DD」→ 自 epoch 起的整數日序(UTC 午夜為錨 · 只用來算相鄰差 = 1)。
 *  字串本身已是台北日 · 這裡僅作純算術比較 · 不涉時區轉換。 不合法回 NaN。 */
function dayIndex(ymd: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return NaN;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Math.floor(t / 86_400_000);
}

export type DisciplineStreak = {
  /** 目前連續(到今天 · 或押到昨天今天仍可接上)的對帳天數 · 斷了 = 0 */
  current: number;
  /** 史上最長連續對帳天數(個人紀錄 · 只增不減) */
  longest: number;
  /** 累計對帳的不同天數(只增不減 · 無焦慮的主數)· 全期 */
  totalDays: number;
  /** 今天(台北)已對帳 */
  activeToday: boolean;
};

/**
 * 從本人押注 map(完整歷史)算出「對帳紀律 streak」· 連續性按下注日的台北日曆日。
 *
 * @param predictions 本人 picks(get_my_predictions · 含 ts)· 只讀 ts → 參數型別放寬到
 *   「任何帶 ts 的 map」(R293:今日一戰跨運動應戰天數 · 六運動押注日同一條連續紀錄)
 * @param todayTaipei getTodayTaipei()(由 caller 傳入 · 維持本函式純粹/可測)
 *
 * current 採標準 streak 語意:押到今天 → active;押到昨天、今天還沒押 → 仍算 active
 * (你還有今天可接上);最後一押在前天或更早 → current=0(已斷)。 totalDays/longest
 * 只增不減(斷了也不掉)· 承接「休賽沒押」的情況,不靠羞辱。
 */
export function aggregateStreak(
  predictions: Record<string, { ts: string }>,
  todayTaipei: string
): DisciplineStreak {
  // 你押過注的不同台北日(全期 · ts 不可解析的 pick 略過 · graceful)· 升序日序。
  const dayKeys = new Set<string>();
  for (const pred of Object.values(predictions)) {
    const d = taipeiDayOf(pred.ts);
    if (d) dayKeys.add(d);
  }
  const totalDays = dayKeys.size;
  const idxs = Array.from(dayKeys, dayIndex)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);

  if (idxs.length === 0) {
    return { current: 0, longest: 0, totalDays, activeToday: false };
  }

  // longest:相鄰日序差 = 1 的最長連續段。
  let longest = 1;
  let run = 1;
  for (let i = 1; i < idxs.length; i++) {
    run = idxs[i] - idxs[i - 1] === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  // current:最後一個下注日往回數連續段;只有當它是今天或昨天才算 active(否則已斷)。
  // current/active 只看「今天或更早」的下注日 —— 防時鐘偏移/手動 DB 寫入產生的未來日
  // 把今天的連續算成 0(正常 app 寫入 created_at = server now() 不會有未來日 · 純防禦)。
  // longest/totalDays 仍用完整 idxs(未來日仍是合法的終身紀錄 · 只是不該影響「到今天為止」)。
  const todayIdx = dayIndex(todayTaipei);
  const curIdxs = Number.isNaN(todayIdx)
    ? idxs
    : idxs.filter((n) => n <= todayIdx);
  const lastIdx = curIdxs.length > 0 ? curIdxs[curIdxs.length - 1] : NaN;
  const activeToday = !Number.isNaN(todayIdx) && lastIdx === todayIdx;
  let current = 0;
  if (
    !Number.isNaN(todayIdx) &&
    (lastIdx === todayIdx || lastIdx === todayIdx - 1)
  ) {
    current = 1;
    for (let i = curIdxs.length - 1; i > 0; i--) {
      if (curIdxs[i] - curIdxs[i - 1] === 1) current++;
      else break;
    }
  }

  return { current, longest, totalDays, activeToday };
}

// ── 跨運動對帳(R293 · 今日一戰六運動版的紀錄條)───────────────────────────────
// 六運動的押注(存表 pick 一律 home/away/draw:a/b 運動已按 A=home/B=away 存)對上
// 跨運動賽果一本帳(lib/duel-results buildDuelResults · 鏡天梯 buildSyncResults 口徑:
// 平手/MMA 和局不進結果 = 不算勝負)。 先鎖後結同 gradeRecord(開賽後才下 → 整筆不計)。
//
// 🔴 為什麼不放寬 getMyPredictionsClient 的棒球 allowlist:那份 map 餵 /member 校準身分、
//   /u 公開帳本、天梯門檻 —— 放寬會讓非棒球押注灌成幽靈 pending(R259 教訓)。 跨運動
//   紀錄條走自己的 reader(getMySportPicksClient)+ 這支自己的對帳,互不污染。
// ─────────────────────────────────────────────────────

/** 跨運動一場已分勝負的賽果(stored-pick 空間 · draw = 足球真和局)。 */
export type SportResultRow = {
  id: string;
  winner: "home" | "away" | "draw";
  startISO: string | null;
  /** 機器賽前鎖的那手(stored 空間 · 給機器嘴「你 vs 機器」逐場對照)· 缺 = 機器沒選邊 /
   *  來源沒帶(graceful:機器嘴退回只講你自己的命中/落空 · 勝敗對帳口徑不受影響)。 */
  enginePick?: "home" | "away" | "draw";
};

/**
 * 跨運動押注對帳:proved/diverged 對「有結果的場」算(pick === winner)· 沒結果(未結算 /
 * 平手推局不進結果)算 pending 進 total。 先鎖後結:已有結果的場 · 開賽後才下的整筆不計。
 */
export function aggregateSportStats(
  picks: Record<string, { pick: "home" | "away" | "draw"; ts: string }>,
  results: SportResultRow[],
): { total: number; proved: number; diverged: number } {
  const byId = new Map(results.map((r) => [r.id, r]));
  let total = 0;
  let proved = 0;
  let diverged = 0;
  for (const [id, p] of Object.entries(picks)) {
    const r = byId.get(id);
    if (r && isLatePick(p.ts, r.startISO)) continue; // 開賽後補登 · 整筆不計(同 gradeRecord)
    total++;
    if (!r) continue; // pending(未結算 / 平手·和局推局不進結果 = 不算勝負)
    if (p.pick === r.winner) proved++;
    else diverged++;
  }
  return { total, proved, diverged };
}

// ── 準度時間序列(soul-roadmap R208 #2 · 「會動的數字」= 回訪鉤)──────────────
// aggregateIdentity 給的是「現在」的快照(一個準度數字)。 這支給「歷程」——
// 隨著一場一場結算,你的累積命中率怎麼爬/掉。 一條會動的線 = 你下次回來想看的東西。
//
// 🔴 紅線:
//   · 按「比賽日」(startISO)排序累積 · 不是下注日 —— 序列是「場」的順序,不是你哪天押。
//   · 同 aggregateIdentity 的先鎖後結(isLatePick)+ 只算分出勝負的場(平局/skip 不進)。
//   · 不捏造精確度:每個點就是「到這場為止的累積命中率」· 低樣本由 UI 端誠實處理
//     (場太少不連線假裝趨勢)· 本函式只給乾淨的數,不做美化。
// ─────────────────────────────────────────────────────

/** 時間序列上的一個點:到這場(含)為止的累積命中率。 */
export type AccuracyPoint = {
  /** 累積已結算(分出勝負)的場數 = x 軸 */
  n: number;
  /** 到此為止累積命中率 0-100 */
  accuracy: number;
  /** 這場的台北日(YYYY-MM-DD · 給 alt text / tooltip) */
  date: string | null;
};

/**
 * 從本人押注 map + 賽果算出「累積命中率序列」。 與 aggregateIdentity 同一份
 * 先鎖後結守則(isLatePick · 只算 home/away 分勝負的場)· 只是改成「每結算一場
 * 就吐一個累積點」而非聚合。 按比賽開賽時間(startISO)升序累積。
 *
 * 回傳陣列長度 = 你分出勝負的已結算場數(每場一個點 · n 從 1 遞增)。
 * 0 場 → 空陣列(UI 端據此顯示空狀態)。
 */
export function computeAccuracySeries(
  predictions: UserPredictionsMap,
  matches: IdentityMatch[]
): AccuracyPoint[] {
  const byId = new Map(matches.map((m) => [m.id, m]));
  // 你押過、已結算、分出勝負(home/away)、且先鎖後結合法的場 —— 收集後按比賽日排。
  const decidedMatches: { m: IdentityMatch; verdict: PredictionVerdict }[] = [];
  for (const [matchId, pred] of Object.entries(predictions)) {
    const m = byId.get(matchId);
    if (!m || m.finalWinner === null) continue; // 未結算 / 不在清單
    if (isLatePick(pred.ts, m.startISO)) continue; // 開賽後補登 · 不算
    if (m.finalWinner === "tie" || pred.pick === "skip") continue; // 不進對照
    decidedMatches.push({ m, verdict: computeUserVerdict(pred.pick, m.finalWinner) });
  }
  decidedMatches.sort((a, b) =>
    (a.m.startISO ?? "").localeCompare(b.m.startISO ?? "")
  );

  const series: AccuracyPoint[] = [];
  let proved = 0;
  for (let i = 0; i < decidedMatches.length; i++) {
    if (decidedMatches[i].verdict === "proved") proved++;
    const n = i + 1;
    series.push({
      n,
      accuracy: Math.round((proved / n) * 100),
      date: taipeiDayOf(decidedMatches[i].m.startISO),
    });
  }
  return series;
}

// ── 「你不在時結算了 N 場」回訪卡(soul-roadmap R208 #5 · 單人事件驅動回訪鉤)──────
// 進 /member 時比對「上次造訪後」哪些你押的場結算了 + 你 vs 引擎誰猜中。 平靜紀律
// 語氣(交易員日誌)· 絕不賭場「快回來!」· 含輸照數(引擎贏你也照講)。 0 migration:
// last_seen 存 user_metadata(同 display_name/follows pattern)。
//
// 🔴 紅線:
//   · 結算時刻用 finalResult.ingestedAt(賽果入帳日)· 不是開賽時間 —— 防賽前補登。
//   · 含輸:youWon 跟 engineWon 同權重數 · 不只報你贏的。
//   · 首訪(無 last_seen baseline)/ 0 新結算 → 回 null · UI 隱藏卡(不發空頭)。
//   · 先鎖後結:開賽後才押的不算(同 aggregateIdentity)。
// ─────────────────────────────────────────────────────

/** 算回訪 delta 用的單場輸入:同 IdentityMatch + 結算時刻(finalResult.ingestedAt)。
 *  ⚠ ingestedAt 跨運動格式不一致 —— CPBL 是台北日字串("2026-06-04")· MLB 是開賽
 *  instant 的 full ISO UTC("2026-06-09T18:05:00Z")。 故 computeSettlementDelta 一律
 *  過 taipeiDayOf() 收斂成台北日再比(不可裸字串比 · 否則 ISO vs 日期前綴比會錯)。 */
export type SettlementMatch = IdentityMatch & {
  /** finalResult.ingestedAt(賽果入帳時刻 · 可能是台北日或 full ISO)· null = 還沒結算 ·
   *  不計入 delta。 永遠帶這個欄位(caller 一律 `?? null`)· 故非 optional。 */
  settledDay: string | null;
};

export type SettlementDelta = {
  /** 上次造訪後新結算、且你有合法押注、分出勝負的場數 */
  total: number;
  /** 其中你猜中的場數(分母 = total) */
  youWon: number;
  /** 引擎有選邊、納入 you-vs-engine 同場對照的分母(≤ total) */
  vsEngineN: number;
  /** 你在「引擎對照子集」(vsEngineN 場)猜中的場數 · 跟 engineWon 同分母 = 公平比 */
  youWonVs: number;
  /** 引擎在同一子集猜中的場數 */
  engineWon: number;
};

/** 從 user_metadata 讀上次造訪時戳(ISO)· 無 / 壞 → null(= 首訪 · 不顯示卡)。 */
export function readLastSeenFromMeta(
  meta: Record<string, unknown> | null | undefined
): string | null {
  if (!meta) return null;
  const v = meta.last_seen_member;
  return typeof v === "string" && v ? v : null;
}

/**
 * 比對「上次造訪後」新結算的押注場。 lastSeenISO 為 null(首訪)→ 回 null。
 * 沒有任何新結算場 → 回 null(UI 隱藏)。 settledDay(ingestedAt 台北日)> 上次造訪
 * 的台北日 才算「你不在時結算的」。 純函式 deterministic(同 aggregateIdentity 守則)。
 */
export function computeSettlementDelta(
  predictions: UserPredictionsMap,
  matches: SettlementMatch[],
  lastSeenISO: string | null
): SettlementDelta | null {
  if (!lastSeenISO) return null; // 首訪 · 無基準 · 只記時戳不顯示
  const lastSeenDay = taipeiDayOf(lastSeenISO);
  if (!lastSeenDay) return null;
  const byId = new Map(matches.map((m) => [m.id, m]));

  let total = 0;
  let youWon = 0;
  let vsEngineN = 0;
  let youWonVs = 0;
  let engineWon = 0;
  for (const [matchId, pred] of Object.entries(predictions)) {
    const m = byId.get(matchId);
    if (!m || m.finalWinner === null) continue; // 未結算
    // ingestedAt 跨運動格式不一致 → 收斂成台北日再比(CPBL 日期字串 / MLB full ISO 都吃)。
    const settledDay = taipeiDayOf(m.settledDay);
    if (!settledDay || settledDay <= lastSeenDay) continue; // 不是「你不在時」結算的
    if (isLatePick(pred.ts, m.startISO)) continue; // 開賽後補登 · 不算
    if (m.finalWinner === "tie" || pred.pick === "skip") continue; // 不進對照

    total++;
    const youHit = computeUserVerdict(pred.pick, m.finalWinner) === "proved";
    if (youHit) youWon++;
    // 你 vs 引擎只在引擎當時有選邊的場上比(apples-to-apples · 同 aggregateIdentity)。
    if (m.engineFav !== null) {
      vsEngineN++;
      if (youHit) youWonVs++;
      if (m.engineFav === m.finalWinner) engineWon++;
    }
  }

  if (total === 0) return null;
  return { total, youWon, vsEngineN, youWonVs, engineWon };
}
