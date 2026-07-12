import type { Match } from "@/lib/matches";
import {
  getMatchPhase,
  getMatchStartIso,
  getEngineFavorite,
  getTodayTaipei,
} from "@/lib/matches";
import { getLockedUpcomingPredictions } from "@/lib/soccer/football-data";
import { toDisplayPercents, enginePickOf } from "@/lib/soccer/engine";
import {
  TENNIS_DRAW,
  bettable as tennisBettable,
  drawLine as tennisDrawLine,
} from "@/lib/tennis/matches";
import {
  BADMINTON_DRAW,
  bettable as badmintonBettable,
  drawLine as badmintonDrawLine,
} from "@/lib/badminton/matches";
import {
  MMA_CARD,
  bettable as mmaBettable,
  drawLine as mmaDrawLine,
} from "@/lib/mma/matches";
import {
  BASKETBALL_GAMES,
  bettable as basketballBettable,
  drawLine as basketballDrawLine,
} from "@/lib/basketball/matches";
import {
  getEngineConviction,
  threeWayHeadToHeadPct,
  threeWaySecondPct,
} from "@/lib/conviction";
import type { MatchHeat } from "@/lib/match-heat";

// ── ZONE 27 · 今日看點(推薦今天盯哪場)─────────────────────────────────────────
// 玄学重導的真材料版延續(同 R289 操盤風格):Tim 要的「溫度」不用塔羅星座,用引擎和帳本
// 裡本來就有的戲劇性 —— 哪場最有人(真鎖定)、哪場機器最敢喊(真開盤線)、哪場連引擎都
// 難分(真銅板局)。 一天最多三場、每場一句白話為什麼值得盯。
//
// 這支只做「讀 + 挑 + 一句理由」:純選題 · deterministic · on-read · 0 migration ·
// 0 Tim 負擔(自動從六運動既有開盤挑)。 不接下注元件(各運動有自己的 bet strip)——
// 看點是「導你去那張桌」,押注發生在各運動自己的頁。
//
// 🔴 紅線(照全站既有拍板):
//   · 編輯策展(選看哪場)≠ 動真相(賽果)—— 只做前者(app/page.tsx 首頁策展同款授權)。
//   · 描述張力、不保證輸贏:絕不寫「最佳推薦 · 押這邊」「必勝」(lib/simulator.ts 守線)。
//   · 訊號分級 reuse lib/conviction 單一真相(勢均力敵/推演看好/推演重壓)· 不另發明分級。
//   · 熱度只認真帳本活動(lib/match-heat:鎖定+分析)· 不按 PnL/連勝/粉絲。
//   · 冷清就少列、全空就整節不渲染(不攤空牆、不假裝熱鬧)。
// ─────────────────────────────────────────────────────

export type WatchReasonKind = "hot" | "strong" | "tossup";

export type WatchPoint = {
  /** 全站賽事 id(cpbl-/mlb-/fd-/tn-/bd-/mma-/bk- 前綴慣例) */
  id: string;
  /** 白話運動別(棒球/足球/網球/羽球/格鬥/籃球) */
  sport: string;
  /** 聯盟 / 賽事名(CPBL · 世界盃 · 溫網 …) */
  league: string;
  /** 對戰(各運動沿用自家看板順序:籃球客在前 · 其餘主/a 在前) */
  matchup: string;
  startISO: string;
  /** 台北開賽時間 白話標(「今天 19:05」·「明天 03:00」—— 凌晨世界盃對台灣賭徒就是「今晚的場」) */
  startLabel: string;
  /** 引擎這場的真實線(順序對齊 matchup):兩向「58 / 42」· 足球「主 40 · 和 32 · 客 28」 */
  line: string;
  /** 這場所在的桌(棒球單場頁 / 足球收據頁 / 網羽單場頁 / MMA·籃球看板錨點) */
  href: string;
  reason: {
    kind: WatchReasonKind;
    /** 徽章短籤(全站定型詞彙:最熱 / 推演重壓 / 勢均力敵) */
    badge: string;
    /** 一句白話為什麼值得盯(全部從真數字生成 · 描述張力不保證輸贏) */
    detail: string;
  };
};

/** 內部候選:favTwoWayPct = 兩向口徑的 favorite %(給 conviction 挑場用)。
 *  足球三向 → 主客成對重歸一(內部排序專用 · 顯示一律用真實三向線,絕不 render 重歸一數字)。 */
type Candidate = {
  id: string;
  sport: string;
  league: string;
  matchup: string;
  startISO: string;
  href: string;
  favTwoWayPct: number;
  /** 引擎看好邊的顯示名 · null = 引擎有開線但不選邊(MMA 同級 / 棒球正 50) */
  favName: string | null;
  line: string;
};

const TPE_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" });
const TPE_TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Taipei",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function taipeiDateOf(iso: string): string | null {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : TPE_DATE.format(t);
}

function taipeiTimeOf(iso: string): string {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? "" : TPE_TIME.format(t);
}

/** 看點視窗 = 接下來 24 小時(同首頁「今晚+即將」口徑)。 台灣賭徒的「今晚」包含凌晨場
 *  (世界盃 03:00 開踢 = 今晚的主秀)—— 切死「台北當日」會把晚上瀏覽的人最想盯的場切掉。 */
const WATCH_WINDOW_MS = 24 * 60 * 60 * 1000;

/** 還沒開打、且在接下來 24 小時內開賽的場才進候選池(對六運動各自的判斷式收口)。 */
function isUpcomingWithinWindow(iso: string | null, nowMs: number): iso is string {
  if (!iso) return false;
  const t = Date.parse(iso);
  return !Number.isNaN(t) && t > nowMs && t <= nowMs + WATCH_WINDOW_MS;
}

// ── 六運動 adapter(各自 try-catch · 任一運動壞 → 少一種候選,整節不倒)──────────

function baseballCandidates(matches: Match[], nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const m of matches) {
    // 今晚賽前 + 明天內即開的未來場(同首頁「今晚+即將」)· 已開打/已結算/延賽都不收
    const phase = getMatchPhase(m);
    if (phase !== "today-pregame" && phase !== "future") continue;
    const startISO = getMatchStartIso(m);
    if (!isUpcomingWithinWindow(startISO, nowMs)) continue;
    const fav = getEngineFavorite(m);
    out.push({
      id: m.id,
      sport: "棒球",
      league: m.league,
      matchup: `${m.home.name} vs ${m.away.name}`,
      startISO,
      href: `/matches/${m.id}`,
      favTwoWayPct: fav ? m[fav].winRate : 50,
      favName: fav ? m[fav].name : null,
      line: `${m.home.winRate} / ${m.away.winRate}`,
    });
  }
  return out;
}

function soccerCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const p of getLockedUpcomingPredictions()) {
    if (!p.prediction) continue; // 覆蓋建置中 · 沒有引擎的線就沒有看點可講
    if (!isUpcomingWithinWindow(p.dateISO, nowMs)) continue;
    const pcts = toDisplayPercents(p.prediction);
    const pick = enginePickOf(p.prediction);
    // 三向→兩向換算走全站唯一那把尺(lib/conviction threeWayHeadToHeadPct · pick vs 次高)。
    // 舊版在這裡自己發明「主 vs 客」換算 = 漏掉和局常是次高 → 同一場在看點被捧成重壓、
    // 在對決卡卻是銅板局(R296 碼審抓的雙尺漂移)。
    const pickPct =
      pick === "home" ? pcts.homeWin : pick === "away" ? pcts.awayWin : pcts.draw;
    out.push({
      id: p.id,
      sport: "足球",
      league: p.competitionName,
      matchup: `${p.home} vs ${p.away}`,
      startISO: p.dateISO,
      href: `/receipts/${p.id}`,
      favTwoWayPct: Math.round(
        threeWayHeadToHeadPct(pickPct, threeWaySecondPct(pickPct, pcts)),
      ),
      favName: pick === "home" ? p.home : pick === "away" ? p.away : "和局",
      line: `主 ${pcts.homeWin} · 和 ${pcts.draw} · 客 ${pcts.awayWin}`,
    });
  }
  return out;
}

function tennisCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const m of TENNIS_DRAW) {
    const iso = tennisBettable(m);
    if (!isUpcomingWithinWindow(iso, nowMs)) continue;
    const line = tennisDrawLine(m);
    if (!line) continue;
    out.push({
      id: m.id,
      sport: "網球",
      league: m.tournament,
      matchup: `${m.a.zh} vs ${m.b.zh}`,
      startISO: iso,
      href: `/tennis/${m.id}`,
      favTwoWayPct: Math.max(line.aWin, line.bWin),
      favName: line.pick === "a" ? m.a.zh : m.b.zh,
      line: `${line.aWin} / ${line.bWin}`,
    });
  }
  return out;
}

function badmintonCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const m of BADMINTON_DRAW) {
    const iso = badmintonBettable(m);
    if (!isUpcomingWithinWindow(iso, nowMs)) continue;
    const line = badmintonDrawLine(m);
    if (!line) continue;
    out.push({
      id: m.id,
      sport: "羽球",
      league: m.tournament,
      matchup: `${m.a.zh} vs ${m.b.zh}`,
      startISO: iso,
      href: `/badminton/${m.id}`,
      favTwoWayPct: Math.max(line.aWin, line.bWin),
      favName: line.pick === "a" ? m.a.zh : m.b.zh,
      line: `${line.aWin} / ${line.bWin}`,
    });
  }
  return out;
}

function mmaCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const m of MMA_CARD) {
    const iso = mmaBettable(m);
    if (!isUpcomingWithinWindow(iso, nowMs)) continue;
    const line = mmaDrawLine(m);
    if (!line) continue; // 認不出 → 不開盤 → 沒有看點可講
    out.push({
      id: m.id,
      sport: "格鬥",
      league: m.event,
      matchup: `${m.a.zh} vs ${m.b.zh}`,
      startISO: iso,
      href: `/mma#m-${m.id}`,
      favTwoWayPct: Math.max(line.aWin, line.bWin),
      // pick=null = 同級純銅板(引擎有開線但不選邊)—— 正是最誠實的「勢均力敵」候選
      favName: line.pick === null ? null : line.pick === "a" ? m.a.zh : m.b.zh,
      line: `${line.aWin} / ${line.bWin}`,
    });
  }
  return out;
}

function basketballCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const g of BASKETBALL_GAMES) {
    const iso = basketballBettable(g);
    if (!isUpcomingWithinWindow(iso, nowMs)) continue;
    const line = basketballDrawLine(g);
    if (!line) continue;
    out.push({
      id: g.id,
      sport: "籃球",
      league: g.league,
      // 籃球慣例:客在前(同看板卡 + 脈動)· line 順序跟著對齊
      matchup: `${g.away.zh} vs ${g.home.zh}`,
      startISO: iso,
      href: `/basketball#b-${g.id}`,
      favTwoWayPct: Math.max(line.homeWin, line.awayWin),
      favName: line.pick === "home" ? g.home.zh : g.away.zh,
      line: `${line.awayWin} / ${line.homeWin}`,
    });
  }
  return out;
}

// ── 選題 ─────────────────────────────────────────────

/** 深比較器:先給定的主鍵 → 早開賽 → id(完全 deterministic 收尾 · 同 daily-duel)。 */
function pickBest(
  cands: Candidate[],
  primary: (a: Candidate, b: Candidate) => number,
): Candidate | null {
  if (cands.length === 0) return null;
  return [...cands].sort((a, b) => {
    const p = primary(a, b);
    if (p !== 0) return p;
    if (a.startISO !== b.startISO) return a.startISO.localeCompare(b.startISO);
    return a.id.localeCompare(b.id);
  })[0];
}

/**
 * 從六運動「接下來 24 小時內開賽、引擎有真實開盤線」的場裡挑最多 3 個看點:
 *   ① 最熱(真人活動:鎖定+分析 · score≥5 才算 · 同 match-heat「不假裝熱鬧」門檻)
 *   ② 推演重壓(機器今天最敢喊的一手 · conviction strong)
 *   ③ 勢均力敵(連引擎都難分的銅板局 · conviction tossup —— 不確定性本身就是戲)
 * 同一場只佔一格 · excludeId 給 /today 把「今日一戰」那場排除(它已經是主秀)。
 */
export function selectWatchPoints(opts: {
  baseball: Match[];
  heat: Record<string, MatchHeat>;
  excludeId?: string | null;
  nowMs?: number;
}): WatchPoint[] {
  const nowMs = opts.nowMs ?? Date.now();
  const today = getTodayTaipei();

  const collectors: Array<() => Candidate[]> = [
    () => baseballCandidates(opts.baseball, nowMs),
    () => soccerCandidates(nowMs),
    () => tennisCandidates(nowMs),
    () => badmintonCandidates(nowMs),
    () => mmaCandidates(nowMs),
    () => basketballCandidates(nowMs),
  ];
  const pool: Candidate[] = [];
  const seen = new Set<string>();
  for (const collect of collectors) {
    let got: Candidate[] = [];
    try {
      got = collect();
    } catch {
      // 單一運動的資料壞掉 → 少一種候選 · 整節照活(graceful)
    }
    for (const c of got) {
      if (c.id === opts.excludeId || seen.has(c.id)) continue;
      seen.add(c.id);
      pool.push(c);
    }
  }
  if (pool.length === 0) return [];

  const taken = new Set<string>();
  const points: WatchPoint[] = [];

  // ① 最熱:真人已經聚在哪桌(score≥5 同 match-heat 最熱門檻 · 冷清時段這格空著,不硬湊)
  const HOT_MIN_SCORE = 5;
  const hot = pickBest(
    pool.filter((c) => (opts.heat[c.id]?.score ?? 0) >= HOT_MIN_SCORE),
    (a, b) => (opts.heat[b.id]?.score ?? 0) - (opts.heat[a.id]?.score ?? 0),
  );
  if (hot) {
    taken.add(hot.id);
    const h = opts.heat[hot.id];
    points.push({
      ...toPoint(hot, today),
      reason: {
        kind: "hot",
        badge: "最熱",
        detail: `${h?.locks ?? 0} 人已賽前鎖定${
          h?.analyses ? ` · ${h.analyses} 篇賽前分析` : ""
        } —— 今天最有人的一桌`,
      },
    });
  }

  // ② 推演重壓:機器今天最敢喊的一手(要真的有選邊)
  const strong = pickBest(
    pool.filter(
      (c) =>
        !taken.has(c.id) &&
        c.favName !== null &&
        getEngineConviction(c.favTwoWayPct).tier === "strong",
    ),
    (a, b) => b.favTwoWayPct - a.favTwoWayPct,
  );
  if (strong) {
    taken.add(strong.id);
    points.push({
      ...toPoint(strong, today),
      reason: {
        kind: "strong",
        badge: "推演重壓",
        detail: `機器今天最敢的一手 · 看 ${strong.favName} —— 敢喊就敢對帳`,
      },
    });
  }

  // ③ 勢均力敵:連引擎都難分的銅板局(不確定性 = 最大張力 · lib/conviction 檔頭的心理學)
  const tossup = pickBest(
    pool.filter(
      (c) =>
        !taken.has(c.id) && getEngineConviction(c.favTwoWayPct).tier === "tossup",
    ),
    (a, b) =>
      Math.abs(a.favTwoWayPct - 50) - Math.abs(b.favTwoWayPct - 50),
  );
  if (tossup) {
    taken.add(tossup.id);
    points.push({
      ...toPoint(tossup, today),
      reason: {
        kind: "tossup",
        badge: "勢均力敵",
        detail:
          tossup.favName === null
            ? "引擎有開線 · 但不選邊 —— 純銅板局,誰贏都不奇怪"
            : "連引擎都抓不出明顯強弱 —— 銅板局最有戲",
      },
    });
  }

  return points;
}

function toPoint(c: Candidate, today: string): Omit<WatchPoint, "reason"> {
  // 白話開賽標:今天的場「今天 19:05」· 跨日凌晨場「明天 03:00」(同對決卡「今天 HH:MM 開賽」口徑)
  const day = taipeiDateOf(c.startISO) === today ? "今天" : "明天";
  return {
    id: c.id,
    sport: c.sport,
    league: c.league,
    matchup: c.matchup,
    startISO: c.startISO,
    startLabel: `${day} ${taipeiTimeOf(c.startISO)}`,
    line: c.line,
    href: c.href,
  };
}
