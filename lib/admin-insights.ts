// ── ZONE 27 · 創辦人第一方洞察(admin-only · 純函式聚合)──────────────────────────
// Tim 問「裝什麼工具收集大數據、知道客群」· 解法不是裝監視型追蹤(那破站上「不追蹤你」鐵律),
// 是挖**自己的押注帳本**(get_ladder_entries · 已公開署名)算聚合訊號。 0 第三方、0 PII、0 像素。
//
// 🔴 鐵律:
//   · 只算「分布 / 比率 / 不重複人數」· 絕不逐人 profiling(即使資料是 Tim 自己的)。
//   · k-匿名:任何切片人數 < K_ANON 一律回 "<5",不顯精確值(落實「聚合不逐人」)。
//   · 北極星用 distinct「人」(author_code)· 不是裸量筆數;筆數只當量級註腳。
//   · 永不算 PnL / 連勝 / 勝率榜 / sportsbook KPI(那是賭場的尺 = 我們刻意拒絕的)。
//   · 流量(訪客數 / 來源)這支**算不出來**(帳本沒有訪客資料)· 頁面誠實說「要 Cloudflare/Plausible」。
// 純函式 deterministic(吃 rows + nowMs)· 好測 · 同 aggregateIdentity 守則。
// ─────────────────────────────────────────────────────

import type { LadderRow } from "@/lib/ladder-rows";
import { taipeiDayOf } from "@/lib/predictions";
import {
  getMatchById,
  getFinalizedMatches,
  getEngineFavorite,
} from "@/lib/matches";
import { getMlbLockedMatches } from "@/lib/mlb-matches";
import { getLockedSoccerById } from "@/lib/soccer/locked";

/** k-匿名門檻:切片人數 < 此 → 顯示 "<5"(不洩漏小樣本可被反推的個體)。 同群眾線 CROWD_LINE_MIN。 */
export const K_ANON = 5;

const DAY_MS = 24 * 3600 * 1000;

type Sport = "cpbl" | "mlb" | "soccer" | "market";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** match_id → 運動 + 是否玩法(大小分/讓分)· 同 pulse / ladder 的分流規則。 */
function classify(matchId: string): { sport: Sport; isProp: boolean } {
  const isProp = matchId.includes("~");
  let sport: Sport;
  if (matchId.startsWith("fd-")) sport = "soccer";
  else if (matchId.startsWith("mkt-")) sport = "market";
  else if (matchId.startsWith("mlb-")) sport = "mlb";
  else sport = "cpbl";
  return { sport, isProp };
}

/** 一筆去重後的押注(同一人同一場號只留最近一筆 · rows 已 desc → first-seen 最新)。 */
type Lock = {
  code: string;
  matchId: string;
  pick: "home" | "away" | "draw";
  ts: number; // epoch ms
  day: string | null; // 台北日 YYYY-MM-DD
  hasRationale: boolean;
  sport: Sport;
  isProp: boolean;
};

/** 把 raw ladder rows 清成去重的有效押注(防呆每一欄 · 同一人同一場號去重)。 */
function dedupeLocks(rows: LadderRow[]): {
  locks: Lock[];
  rationaleAvail: boolean;
} {
  const out: Lock[] = [];
  const seen = new Set<string>();
  let rationaleAvail = false; // 0026 未套 → rationale 欄不存在 → 全 false
  for (const r of rows) {
    const code = str(r.author_code);
    const matchId = str(r.match_id);
    const whenISO = str(r.created_at);
    const pick =
      r.pick === "home" || r.pick === "away" || r.pick === "draw"
        ? r.pick
        : null;
    if (!code || !matchId || !pick || !whenISO) continue;
    const ts = Date.parse(whenISO);
    if (Number.isNaN(ts)) continue;
    const key = `${code}|${matchId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    // rationale:0026 套用後才有此欄;非空才算「寫了理由」。
    const rationale = typeof r.rationale === "string" ? r.rationale.trim() : "";
    if ("rationale" in r && r.rationale !== undefined) rationaleAvail = true;
    const { sport, isProp } = classify(matchId);
    out.push({
      code,
      matchId,
      pick,
      ts,
      day: taipeiDayOf(whenISO),
      hasRationale: rationale.length > 0,
      sport,
      isProp,
    });
  }
  return { locks: out, rationaleAvail };
}

/** 「人數」k-匿名包裝:< K_ANON → null(UI 顯示 "<5")· 否則回真數。 */
export type KCount = number | null;
// 0 顯示「0」(沒有個體可被反推 · 且「<5」會誤導成「有 1-4 個」)· 1–4 → null("<5")· 5+ → 真數。
function kCount(n: number): KCount {
  if (n === 0) return 0;
  return n < K_ANON ? null : n;
}

// ── 賽果 / 引擎邊查詢(給誠實護欄 + 群眾 vs 引擎)──────────────────────────
type Settled = {
  winner: "home" | "away" | "draw"; // 已結算的贏家邊(平手棒球不進 → 不收)
  engineFav: "home" | "away" | "draw" | null; // 引擎賽前看好邊(50/50 → null)
};
/** 已結算的「誰贏」場 → 贏家邊 + 引擎看好邊(棒球 CPBL+MLB + 足球)· 未結算/玩法 → 無。 */
function buildSettledIndex(): Map<string, Settled> {
  const idx = new Map<string, Settled>();
  // 棒球(CPBL finalized + MLB locked)· getMatchById 認 CPBL · mlbById 認 MLB。
  const mlbById = new Map(getMlbLockedMatches().map((m) => [m.id, m] as const));
  const addBaseball = (m: ReturnType<typeof getMatchById>) => {
    if (!m || !m.finalResult) return;
    const w = m.finalResult.winner;
    if (w !== "home" && w !== "away") return; // 平手不進對照(同校準)
    idx.set(m.id, { winner: w, engineFav: getEngineFavorite(m) });
  };
  for (const m of getFinalizedMatches()) addBaseball(m); // 🔴 CPBL 已結算(主力運動 · 別漏)
  for (const m of mlbById.values()) addBaseball(m); // MLB 永久鎖定已結算
  // 足球:鎖定盤已對帳(outcome + verdict)· enginePick 當引擎看好邊。
  for (const p of getLockedSoccerById().values()) {
    if (p.outcome !== "home" && p.outcome !== "away" && p.outcome !== "draw") continue;
    idx.set(p.matchId, {
      winner: p.outcome,
      engineFav:
        p.enginePick === "home" || p.enginePick === "away" || p.enginePick === "draw"
          ? p.enginePick
          : null,
    });
  }
  return idx;
}

/** matchId → 顯示用對戰標(最熱的場用)· 認不到回 null。 */
function matchupLabel(matchId: string): string | null {
  const mlbById = new Map(getMlbLockedMatches().map((m) => [m.id, m] as const));
  const m = getMatchById(matchId) ?? mlbById.get(matchId);
  if (m) return `${m.home.name} vs ${m.away.name}`;
  const s = getLockedSoccerById().get(matchId);
  if (s) return `${s.home} vs ${s.away}`;
  return null;
}

// ── 輸出型別 ────────────────────────────────────────────
export type AdminInsights = {
  // ① 北極星
  wauPeople: number; // 近 7 天有鎖的不重複人數
  wauLocks: number; // 近 7 天鎖定筆數(量級註腳)
  totalPeople: number; // 全期不重複押注人數
  totalLocks: number; // 全期去重押注筆數
  // ② 回訪頻率(每人不同「對帳日」天數 → 分桶人數)
  retention: { oneDay: KCount; twoToThree: KCount; fourPlus: KCount };
  // ③ 投入度長尾(每人押不重複場數 → 分桶人數)
  engagement: { b1: KCount; b2to5: KCount; b6to10: KCount; b10plus: KCount };
  // ④ 誠實護欄
  honesty: {
    settled: number; // 已結算的「誰贏」用戶押注數
    hits: number;
    misses: number;
    lossRate: number | null; // 落空占比(永不刪 → 真實含輸率 · 0-100)
    rationaleRate: number | null; // 寫理由率 0-100(rationaleAvail=false → null)
    rationaleAvail: boolean;
  };
  // ⑤ 群眾 vs 引擎(同場 ≥K 人才算 · 樣本薄 → null pending)
  crowdVsEngine: {
    matches: number; // 納入對照的場數
    sameSide: number; // 群眾多數與引擎同邊的場數
    crowdHits: number;
    engineHits: number;
    crowdAcc: number | null; // 0-100
    engineAcc: number | null;
  } | null;
  // ⑥ 內容供給(運動占比 + 玩法占比 + 最熱的場)
  supply: {
    bySport: { sport: Sport; label: string; locks: number; pct: number }[];
    whoWins: number;
    props: number;
    hotMatches: { label: string; count: KCount }[];
  };
  // ⑦ 新面孔(近 4 週每週第一次出現的不重複人數)
  newFacesByWeek: { weekStart: string; count: KCount }[];
  // ⑧ 每日脈搏(近 30 天每日鎖定筆數)
  dailyPulse: { day: string; count: number }[];
};

const SPORT_LABEL: Record<Sport, string> = {
  cpbl: "CPBL 棒球",
  mlb: "MLB",
  soccer: "足球",
  market: "群眾盤",
};

/**
 * 從全站押注列算創辦人洞察。 nowMs = 現在(server component 傳 Date.now())· deterministic。
 */
export function computeAdminInsights(
  rows: LadderRow[],
  nowMs: number = Date.now(),
): AdminInsights {
  const { locks, rationaleAvail } = dedupeLocks(rows);
  const sevenAgo = nowMs - 7 * DAY_MS;
  const thirtyAgo = nowMs - 30 * DAY_MS;

  // ① 北極星
  const wauCodes = new Set<string>();
  let wauLocks = 0;
  const allCodes = new Set<string>();
  for (const l of locks) {
    allCodes.add(l.code);
    if (l.ts >= sevenAgo) {
      wauCodes.add(l.code);
      wauLocks += 1;
    }
  }

  // 每人:不同對帳日 set + 不同場號 set + 最早 ts
  const byUser = new Map<
    string,
    { days: Set<string>; matches: Set<string>; firstTs: number }
  >();
  for (const l of locks) {
    let u = byUser.get(l.code);
    if (!u) {
      u = { days: new Set(), matches: new Set(), firstTs: l.ts };
      byUser.set(l.code, u);
    }
    if (l.day) u.days.add(l.day);
    u.matches.add(l.matchId);
    if (l.ts < u.firstTs) u.firstTs = l.ts;
  }

  // ② 回訪頻率(對帳天數分桶)
  let r1 = 0,
    r23 = 0,
    r4 = 0;
  // ③ 投入度(場數分桶)
  let e1 = 0,
    e25 = 0,
    e610 = 0,
    e10 = 0;
  for (const u of byUser.values()) {
    const d = u.days.size;
    if (d <= 1) r1 += 1;
    else if (d <= 3) r23 += 1;
    else r4 += 1;
    const mc = u.matches.size;
    if (mc <= 1) e1 += 1;
    else if (mc <= 5) e25 += 1;
    else if (mc <= 10) e610 += 1;
    else e10 += 1;
  }

  // ④ 誠實護欄(已結算「誰贏」用戶押注:中/落空 + 寫理由率)
  const settledIdx = buildSettledIndex();
  let settled = 0,
    hits = 0,
    rationaleN = 0;
  for (const l of locks) {
    if (l.hasRationale) rationaleN += 1;
    if (l.isProp) continue; // 玩法不進「誰贏」對照
    const s = settledIdx.get(l.matchId);
    if (!s) continue;
    settled += 1;
    if (l.pick === s.winner) hits += 1;
  }

  // ⑤ 群眾 vs 引擎(每場 ≥K 人 · 群眾多數 vs 引擎邊 vs 賽果)
  type Tally = { home: number; away: number; draw: number };
  const perMatch = new Map<string, Tally>();
  for (const l of locks) {
    if (l.isProp) continue;
    if (!settledIdx.has(l.matchId)) continue; // 只看已結算可對的場
    let t = perMatch.get(l.matchId);
    if (!t) {
      t = { home: 0, away: 0, draw: 0 };
      perMatch.set(l.matchId, t);
    }
    t[l.pick] += 1;
  }
  let cveMatches = 0,
    sameSide = 0,
    crowdHits = 0,
    engineHits = 0;
  for (const [matchId, t] of perMatch) {
    const total = t.home + t.away + t.draw;
    if (total < K_ANON) continue; // 小樣本不算(防小群假裝群眾共識)
    const s = settledIdx.get(matchId)!;
    // 群眾多數邊(平手 tally → 跳過,不硬選)
    const max = Math.max(t.home, t.away, t.draw);
    const leaders = (["home", "away", "draw"] as const).filter((k) => t[k] === max);
    if (leaders.length !== 1) continue;
    const crowdSide = leaders[0];
    cveMatches += 1;
    if (s.engineFav && crowdSide === s.engineFav) sameSide += 1;
    if (crowdSide === s.winner) crowdHits += 1;
    if (s.engineFav && s.engineFav === s.winner) engineHits += 1;
  }
  const crowdVsEngine =
    cveMatches === 0
      ? null
      : {
          matches: cveMatches,
          sameSide,
          crowdHits,
          engineHits,
          crowdAcc: Math.round((crowdHits / cveMatches) * 100),
          engineAcc: Math.round((engineHits / cveMatches) * 100),
        };

  // ⑥ 內容供給(運動占比 + 玩法占比 + 最熱的場)
  const sportCount: Record<Sport, number> = { cpbl: 0, mlb: 0, soccer: 0, market: 0 };
  let whoWins = 0,
    props = 0;
  const matchCount = new Map<string, { count: number; codes: Set<string> }>();
  for (const l of locks) {
    sportCount[l.sport] += 1;
    if (l.isProp) props += 1;
    else whoWins += 1;
    let mc = matchCount.get(l.matchId);
    if (!mc) {
      mc = { count: 0, codes: new Set() };
      matchCount.set(l.matchId, mc);
    }
    mc.count += 1;
    mc.codes.add(l.code);
  }
  const totalLocks = locks.length;
  const bySport = (["cpbl", "mlb", "soccer", "market"] as Sport[])
    .map((sport) => ({
      sport,
      label: SPORT_LABEL[sport],
      locks: sportCount[sport],
      pct: totalLocks > 0 ? Math.round((sportCount[sport] / totalLocks) * 100) : 0,
    }))
    .filter((s) => s.locks > 0)
    .sort((a, b) => b.locks - a.locks);
  const hotMatches = [...matchCount.entries()]
    .map(([matchId, v]) => ({
      label: matchupLabel(matchId) ?? matchId,
      count: kCount(v.codes.size), // 用「不重複人數」做 k-匿名(< 5 顯示 "<5")
      raw: v.count,
    }))
    .sort((a, b) => b.raw - a.raw)
    .slice(0, 6)
    .map(({ label, count }) => ({ label, count }));

  // ⑦ 新面孔(近 4 週每週第一次出現的人)· 週起點對齊 7 天窗(以 now 回推)
  const weeks: { weekStart: string; count: KCount }[] = [];
  for (let w = 3; w >= 0; w--) {
    const start = nowMs - (w + 1) * 7 * DAY_MS;
    const end = nowMs - w * 7 * DAY_MS;
    let n = 0;
    for (const u of byUser.values()) {
      if (u.firstTs >= start && u.firstTs < end) n += 1;
    }
    const d = taipeiDayOf(new Date(start).toISOString());
    weeks.push({ weekStart: d ?? "", count: kCount(n) });
  }

  // ⑧ 每日脈搏(近 30 天每日鎖定筆數 · 連續日填 0)
  const dayCount = new Map<string, number>();
  for (const l of locks) {
    if (l.ts < thirtyAgo) continue;
    if (!l.day) continue;
    dayCount.set(l.day, (dayCount.get(l.day) ?? 0) + 1);
  }
  const dailyPulse: { day: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = taipeiDayOf(new Date(nowMs - i * DAY_MS).toISOString());
    if (!d) continue;
    dailyPulse.push({ day: d, count: dayCount.get(d) ?? 0 });
  }

  return {
    wauPeople: wauCodes.size,
    wauLocks,
    totalPeople: allCodes.size,
    totalLocks,
    retention: { oneDay: kCount(r1), twoToThree: kCount(r23), fourPlus: kCount(r4) },
    engagement: {
      b1: kCount(e1),
      b2to5: kCount(e25),
      b6to10: kCount(e610),
      b10plus: kCount(e10),
    },
    honesty: {
      settled,
      hits,
      misses: settled - hits,
      lossRate: settled > 0 ? Math.round(((settled - hits) / settled) * 100) : null,
      rationaleRate:
        rationaleAvail && totalLocks > 0
          ? Math.round((rationaleN / totalLocks) * 100)
          : null,
      rationaleAvail,
    },
    crowdVsEngine,
    supply: { bySport, whoWins, props, hotMatches },
    newFacesByWeek: weeks,
    dailyPulse,
  };
}
