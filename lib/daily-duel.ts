import type { Match } from "@/lib/matches";
import { getMatchPhase, getEngineFavorite, getMatchStartIso } from "@/lib/matches";
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

// ── ZONE 27 · 今日一戰 · 你 vs 機器(每日對決選題)─────────────────────────────────
// 留存命門(Tim 2026-06-27「玩一天就沒再來」):球賽賽果慢、不規律 → 押完之後「明天」沒有
// 任何事等用戶回來,產品變成「想到才開的工具」而非「每天得回來的習慣」。 Wordle/Duolingo/Strava
// 的共同解:一天一個小動作 + 隔天見真章 + 一條看得見的連續紀錄。 ZONE 27 有別人抄不走的版本 ——
// 一台「賽前公開下注、而且會輸」的誠實機器,讓人每天正面挑戰它一次。
//
// 這支只做一件事:從「還能賽前鎖死的場」裡,挑出唯一的「今日一戰」。 0 新增 Tim 負擔
// (自動從既有開盤的賽事挑)· 純函式 · deterministic · on-read。
//
// R293 · 六運動版(原 v1 = 棒球型):棒球沒得對決的日子,對決落到籃球/足球/羽球/網球/格鬥 ——
//   連續應戰的儀式不再跟著棒球休賽日一起斷。 各運動沿用自己的下注元件(pick 語意不同:足球三向、
//   網羽格鬥 a/b、籃球主客)· 對決卡只負責選題 + 顯示機器那手。
//   口徑:棒球維持「台北今天 + 還沒開賽」(自家主場當日制 · 行為不變);其他運動用「接下來 24h
//   還沒開打」(同今日看點:世界盃 03:00 對台灣賭徒就是「今晚的場」)。
// 🔴 紅線:挑「機器有偏好(非 50/50)」的場 —— 沒有機器的一手就沒有「你 vs 機器」。 不挑賠率、
//   不挑盤口、不挑「最容易中」的場灌水(挑的是機器最敢喊的一手 = 最有看頭的對決,不是最好賺)。
// ─────────────────────────────────────────────────────

export type DuelSport =
  | "baseball"
  | "soccer"
  | "tennis"
  | "badminton"
  | "mma"
  | "basketball";

/** 白話運動別(對決卡徽章 · 同今日看點詞彙)。 */
export const DUEL_SPORT_LABEL: Record<DuelSport, string> = {
  baseball: "棒球",
  soccer: "足球",
  tennis: "網球",
  badminton: "羽球",
  mma: "格鬥",
  basketball: "籃球",
};

type DuelBase = {
  /** 全站賽事 id(cpbl-/mlb-/fd-/tn-/bd-/mma-/bk- 前綴慣例) */
  id: string;
  /** 聯盟 / 賽事名(CPBL · 世界盃 · 溫網 · UFC …) */
  league: string;
  startISO: string;
};

/** 今日一戰(discriminated union · /today 按 sport 掛各運動自己的下注元件)。 */
export type TodayDuel =
  | (DuelBase & { sport: "baseball"; match: Match })
  | (DuelBase & {
      sport: "soccer";
      homeName: string;
      awayName: string;
      /** 隊徽 seed(英文原名 · 顏色穩定 · Tim:隊徽維持英文) */
      homeSeed: string;
      awaySeed: string;
      /** 三向真實線(顯示一律用三向 · 絕不 render 重歸一數字) */
      pcts: { homeWin: number; draw: number; awayWin: number };
      pick: "home" | "draw" | "away";
    })
  | (DuelBase & {
      sport: "tennis" | "badminton" | "mma";
      aName: string;
      bName: string;
      line: { aWin: number; bWin: number; pick: "a" | "b" };
    })
  | (DuelBase & {
      sport: "basketball";
      homeName: string;
      awayName: string;
      /** 隊徽 seed(英文隊名 · 顏色穩定) */
      homeSeed: string;
      awaySeed: string;
      line: { homeWin: number; awayWin: number; pick: "home" | "away" };
    });

// 主場優先序:CPBL(自家主場 local-first)> MLB > NPB。 同級內挑機器最敢喊的一手(conviction)。
const LEAGUE_PRIORITY: Record<string, number> = { CPBL: 0, MLB: 1, NPB: 2 };
// 棒球之後的運動優先序(R293 · Tim 可重排):籃球(NBA 台灣熱度)> 足球 > 羽球(台灣主場優勢)
// > 網球 > 格鬥(引擎 v0.1 最平 + 賽果手動 curate 最慢 → 排最後)。
const SPORT_PRIORITY: Record<Exclude<DuelSport, "baseball">, number> = {
  basketball: 3,
  soccer: 4,
  badminton: 5,
  tennis: 6,
  mma: 7,
};

type Candidate = { d: TodayDuel; priority: number; conviction: number };

/** 非棒球口徑:還沒開打、且接下來 24h 內開賽(同今日看點 · 凌晨場 = 今晚的場)。 */
const DUEL_WINDOW_MS = 24 * 60 * 60 * 1000;
function upcoming24(iso: string | null, nowMs: number): iso is string {
  if (!iso) return false;
  const t = Date.parse(iso);
  return !Number.isNaN(t) && t > nowMs && t <= nowMs + DUEL_WINDOW_MS;
}

// ── 六運動 adapter(各自 try-catch · 任一運動壞 → 少一種候選 · 對決照選)──────────

function baseballCandidates(matches: Match[]): Candidate[] {
  const out: Candidate[] = [];
  for (const m of matches) {
    // 今日、還沒開賽(賽前才能誠實鎖一手對著機器)· today-live / final / 延賽都不算「可對決」。
    if (getMatchPhase(m) !== "today-pregame") continue;
    // 機器要有偏好(50/50 銅板局 → 沒有「機器的一手」可挑戰)。
    if (getEngineFavorite(m) === null) continue;
    const startISO = getMatchStartIso(m);
    if (!startISO) continue;
    out.push({
      d: { sport: "baseball", id: m.id, league: m.league, startISO, match: m },
      priority: LEAGUE_PRIORITY[m.league] ?? 9,
      conviction: Math.max(m.home.winRate, m.away.winRate),
    });
  }
  return out;
}

function soccerCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const p of getLockedUpcomingPredictions()) {
    if (!p.prediction) continue; // 覆蓋建置中 · 沒有引擎的線就沒有對決
    if (!upcoming24(p.dateISO, nowMs)) continue;
    const pcts = toDisplayPercents(p.prediction);
    const pick = enginePickOf(p.prediction);
    out.push({
      d: {
        sport: "soccer",
        id: p.id,
        league: p.competitionName,
        startISO: p.dateISO,
        homeName: p.home,
        awayName: p.away,
        homeSeed: p.homeSeed,
        awaySeed: p.awaySeed,
        pcts,
        pick,
      },
      priority: SPORT_PRIORITY.soccer,
      conviction: Math.max(pcts.homeWin, pcts.draw, pcts.awayWin),
    });
  }
  return out;
}

function tennisCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const m of TENNIS_DRAW) {
    const iso = tennisBettable(m);
    if (!upcoming24(iso, nowMs)) continue;
    const line = tennisDrawLine(m);
    if (!line) continue;
    out.push({
      d: {
        sport: "tennis",
        id: m.id,
        league: m.tournament,
        startISO: iso,
        aName: m.a.zh,
        bName: m.b.zh,
        line,
      },
      priority: SPORT_PRIORITY.tennis,
      conviction: Math.max(line.aWin, line.bWin),
    });
  }
  return out;
}

function badmintonCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const m of BADMINTON_DRAW) {
    const iso = badmintonBettable(m);
    if (!upcoming24(iso, nowMs)) continue;
    const line = badmintonDrawLine(m);
    if (!line) continue;
    out.push({
      d: {
        sport: "badminton",
        id: m.id,
        league: m.tournament,
        startISO: iso,
        aName: m.a.zh,
        bName: m.b.zh,
        line,
      },
      priority: SPORT_PRIORITY.badminton,
      conviction: Math.max(line.aWin, line.bWin),
    });
  }
  return out;
}

function mmaCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const m of MMA_CARD) {
    const iso = mmaBettable(m);
    if (!upcoming24(iso, nowMs)) continue;
    const line = mmaDrawLine(m);
    // MMA 同級純銅板(pick=null)= 機器不選邊 → 沒有「機器的一手」可挑戰(同棒球 50/50 濾掉)。
    if (!line || line.pick === null) continue;
    out.push({
      d: {
        sport: "mma",
        id: m.id,
        league: m.event,
        startISO: iso,
        aName: m.a.zh,
        bName: m.b.zh,
        line: { aWin: line.aWin, bWin: line.bWin, pick: line.pick },
      },
      priority: SPORT_PRIORITY.mma,
      conviction: Math.max(line.aWin, line.bWin),
    });
  }
  return out;
}

function basketballCandidates(nowMs: number): Candidate[] {
  const out: Candidate[] = [];
  for (const g of BASKETBALL_GAMES) {
    const iso = basketballBettable(g);
    if (!upcoming24(iso, nowMs)) continue;
    const line = basketballDrawLine(g);
    if (!line) continue;
    out.push({
      d: {
        sport: "basketball",
        id: g.id,
        league: g.league,
        startISO: iso,
        homeName: g.home.zh,
        awayName: g.away.zh,
        homeSeed: g.home.en,
        awaySeed: g.away.en,
        line,
      },
      priority: SPORT_PRIORITY.basketball,
      conviction: Math.max(line.homeWin, line.awayWin),
    });
  }
  return out;
}

/** 從六運動裡挑出唯一的「今日一戰」· 全都沒有可賽前鎖死的場 → null(休賽空窗 / 都開打了)。 */
export function selectTodayDuel(
  baseball: Match[],
  nowMs: number = Date.now(),
): TodayDuel | null {
  const collectors: Array<() => Candidate[]> = [
    () => baseballCandidates(baseball),
    () => soccerCandidates(nowMs),
    () => tennisCandidates(nowMs),
    () => badmintonCandidates(nowMs),
    () => mmaCandidates(nowMs),
    () => basketballCandidates(nowMs),
  ];
  const candidates: Candidate[] = [];
  for (const collect of collectors) {
    try {
      candidates.push(...collect());
    } catch {
      // 單一運動的資料壞掉 → 少一種候選 · 對決照選(graceful · 同今日看點)
    }
  }
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority; // 主場聯盟/運動先
    const cv = b.conviction - a.conviction;
    if (cv !== 0) return cv; // 機器最敢喊的一手先(最有看頭的對決)
    if (a.d.startISO !== b.d.startISO)
      return a.d.startISO.localeCompare(b.d.startISO); // 同把握度 → 先開賽的先
    return a.d.id.localeCompare(b.d.id); // 完全 deterministic 收尾
  });
  return candidates[0].d;
}

/** 機器在這場已鎖死的一手(給對決卡顯示「機器已鎖 X N%」)· 只有棒球可能回 null(平手已濾 · 純防禦)。 */
export function duelEngineSide(d: TodayDuel): { name: string; pct: number } | null {
  switch (d.sport) {
    case "baseball": {
      const fav = getEngineFavorite(d.match);
      if (fav === null) return null;
      return { name: d.match[fav].name, pct: d.match[fav].winRate };
    }
    case "soccer":
      return d.pick === "home"
        ? { name: d.homeName, pct: d.pcts.homeWin }
        : d.pick === "away"
          ? { name: d.awayName, pct: d.pcts.awayWin }
          : { name: "和局", pct: d.pcts.draw };
    case "tennis":
    case "badminton":
    case "mma":
      return d.line.pick === "a"
        ? { name: d.aName, pct: d.line.aWin }
        : { name: d.bName, pct: d.line.bWin };
    case "basketball":
      return d.line.pick === "home"
        ? { name: d.homeName, pct: d.line.homeWin }
        : { name: d.awayName, pct: d.line.awayWin };
  }
}

const TPE_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" });
const TPE_TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Taipei",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** 台北「明天」YYYY-MM-DD(純日曆算術 · 不合法回 null)。 */
function taipeiTomorrow(todayTaipei: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(todayTaipei);
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) + 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** 白話開賽標:「今天 19:05」·「明天 03:00」(凌晨世界盃對台灣賭徒就是今晚的場 · 同看點口徑)。
 *  🔴 只有真的是台北明天才叫「明天」—— 其餘(戰帖規則③會秀已賽畢的過去場 · 提前鎖的未來場)
 *  老實標日期「M/D HH:MM」(對著已打完十天的場喊「明天開賽」= 在誠信招牌上說謊 · R294 修)。 */
export function duelStartLabel(startISO: string, todayTaipei: string): string {
  const t = Date.parse(startISO);
  if (Number.isNaN(t)) return "";
  const day = TPE_DATE.format(t);
  const label =
    day === todayTaipei
      ? "今天"
      : day === taipeiTomorrow(todayTaipei)
        ? "明天"
        : day.replace(/^\d{4}-0?(\d+)-0?(\d+)$/, "$1/$2");
  return `${label} ${TPE_TIME.format(t)}`;
}
