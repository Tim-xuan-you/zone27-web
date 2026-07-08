// ── ZONE 27 · MLB → Match 轉接器(MLB 全套 first-class)──────────
// R198 · Tim「MLB 全套 · Polymarket go」· 把即時 API 的 MlbGame 轉成跟 CPBL
// 同型的 Match,讓 MLB 直接複用整條管線:市場卡(MiniMatchCard · 隊徽/開盤線/
// 押注)+ 詳情頁(/matches/[gameId])+ 押注/分析(submit_prediction by match_id)。
//
// 誠信核心:引擎線一律用「賽前鎖定值」(lib/mlb-locked.json · GitHub Action 賽前鎖、
// 留時間戳)· 不用賽後即時重算(那會變「賽後假裝賽前就猜中」= 報馬仔挑窗)。 沒鎖定
// 線的場不上盤(不裸開沒對帳基礎的盤)。 id 用 "mlb-{gamePk}" · league "MLB"。
// ─────────────────────────────────────────────────────

import type { Match, TeamSide } from "@/lib/matches";
import {
  getMatchStartIso,
  getTodayMatches,
  getTodayTaipei,
  getMatchPhase,
  getMatchDateIso,
  parseHHMM,
} from "@/lib/matches";
import {
  fetchRelevantMlb,
  teamZh,
  toTaipeiTime,
  type MlbGame,
  type MlbTeamSide,
} from "@/lib/mlb";
import mlbLocked from "@/lib/mlb-locked.json";
import { deriveMlbTopScores } from "@/lib/mlb-scores";

// gamePk → 賽前鎖定的引擎主隊勝率%
function lockedByPk(): Map<number, number> {
  const m = new Map<number, number>();
  for (const p of (mlbLocked.predictions ?? []) as {
    gamePk?: number;
    engineWinHomePct?: number;
  }[]) {
    if (typeof p.gamePk === "number" && typeof p.engineWinHomePct === "number") {
      m.set(p.gamePk, p.engineWinHomePct);
    }
  }
  return m;
}

function weekdayZh(iso: string): string {
  return new Intl.DateTimeFormat("zh-Hant", {
    timeZone: "Asia/Taipei",
    weekday: "long",
  }).format(new Date(iso));
}

function mlbSide(t: MlbTeamSide, winRate: number): TeamSide {
  const p = t.probablePitcher;
  return {
    name: t.zhName,
    en: t.abbr,
    pitcher: {
      name: p?.fullName ?? "未定",
      era: p?.era ?? "—",
      k9: p?.k9 ?? "—",
      whip: "—", // MLB API 不直接給 WHIP · 不裝(reasoning/StatPercentileBar 都 graceful 處理「—」)
      bb9: p?.bb9 ?? "—",
      hr9: p?.hr9 ?? "—",
    },
    recent: [], // MLB API 不給近 5 場 W/L · 留空(reasoning 本就不吃 recent · 卡片也不顯示)
    winRate,
  };
}

export function mlbGameToMatch(g: MlbGame, lockedPct: number): Match {
  const homePct = Math.round(lockedPct);
  const awayPct = 100 - homePct;
  const home = mlbSide(g.home, homePct);
  const away = mlbSide(g.away, awayPct);
  const finalResult: Match["finalResult"] = g.finalScore
    ? {
        homeScore: g.finalScore.home,
        awayScore: g.finalScore.away,
        winner:
          g.finalScore.home > g.finalScore.away
            ? "home"
            : g.finalScore.away > g.finalScore.home
              ? "away"
              : "tie",
        ingestedAt: g.startUTC,
      }
    : undefined;
  return {
    id: `mlb-${g.gamePk}`,
    league: "MLB",
    date: `${g.dateTaipei}  ·  ${weekdayZh(g.startUTC)}`,
    startTime: g.startTaipei,
    venue: g.venue,
    home,
    away,
    // R228 · 由鎖定勝率 + 兩隊先發 ERA 推導最可能比分(投手未定 → 回空 · 詳情頁該段自動隱藏)。
    topScores: deriveMlbTopScores(homePct, home.pitcher.era, away.pitcher.era),
    aiConfidence: Math.max(homePct, awayPct),
    finalResult,
  };
}

// 抓「對台灣此刻有意義」的 MLB 場(昨天+今天)· 轉成 Match · 只留有引擎線的。
export async function getMlbAsMatches(): Promise<Match[]> {
  const games = await fetchRelevantMlb();
  const locked = lockedByPk();
  const out: Match[] = [];
  for (const g of games) {
    const pct = locked.get(g.gamePk) ?? g.engineWinHomePct;
    if (pct == null) continue; // 沒引擎線不上盤(誠實)
    out.push(mlbGameToMatch(g, pct));
  }
  return out;
}

// ── 跨聯盟「今日賽事」(CPBL + MLB)─────────────────────────────────────
// getTodayMatches() 只看 CPBL 靜態陣列 → 跨聯盟後 Nav「今日 N」計數 + 詳情頁「換一場」
// 側欄 rail 會漏掉今天的 MLB 場(MLB 台灣早上開賽)。 這支把今天的 MLB(賽前/進行中/今日剛
// 結束)併進來,讓計數與 rail 都涵蓋兩聯盟。 async(MLB 走 ISR 快取的 API)· 呼叫端皆 server。
// 放在 mlb-matches.ts(本來就依賴 matches.ts · 單向不循環)。
export async function getTodayMatchesAllLeagues(): Promise<Match[]> {
  const today = getTodayTaipei();
  const cpbl = getTodayMatches();
  let mlb: Match[] = [];
  try {
    mlb = (await getMlbAsMatches()).filter((m) => {
      const phase = getMatchPhase(m);
      if (phase === "today-pregame" || phase === "today-live") return true;
      return phase === "final" && getMatchDateIso(m) === today;
    });
  } catch {
    mlb = []; // graceful · MLB API 失敗不影響 CPBL 計數
  }
  return [...cpbl, ...mlb].sort(
    (a, b) => parseHHMM(a.startTime) - parseHHMM(b.startTime),
  );
}

// ── MLB 詳情頁永久化(R201 碼審 · 修「買過/回過的 MLB 場 2 天後點進去 404」)──────
// getMlbAsMatches 只抓「昨天+今天」live 窗 → settled 的 MLB 場掉出窗 → 詳情頁 notFound
// → /member「你的東西」「重看/回到那串」連到死路 = 打臉「永久找得回」+ R198 MLB first-class。
// 修法:從 mlb-locked.json 重建已封存場的完整 Match(同 getMlbFinalizedResults 的 JSON 永久
// 結果思路 · 但這裡重建整個 Match 給詳情頁渲染)。 locked.json 存了隊 id/英文名/投手/數據/
// 引擎線/finalScore/gameDate = 足以重建跟 live 同形的 Match(venue 缺 → "—" · 純展示)。
type LockedPrediction = {
  gamePk?: number;
  gameDate?: string;
  homeId?: number;
  homeEn?: string;
  awayId?: number;
  awayEn?: string;
  homePitcher?: string;
  awayPitcher?: string;
  homeStats?: { era?: string; k9?: string; bb9?: string; hr9?: string };
  awayStats?: { era?: string; k9?: string; bb9?: string; hr9?: string };
  engineWinHomePct?: number;
  finalScore?: { home?: number; away?: number };
};

function lockedSide(
  zhName: string,
  abbr: string,
  pitcherName: string | undefined,
  stats: LockedPrediction["homeStats"],
  winRate: number
): TeamSide {
  return {
    name: zhName,
    en: abbr,
    pitcher: {
      name: pitcherName || "未定",
      era: stats?.era ?? "—",
      k9: stats?.k9 ?? "—",
      whip: "—",
      bb9: stats?.bb9 ?? "—",
      hr9: stats?.hr9 ?? "—",
    },
    recent: [],
    winRate,
  };
}

function lockedToMatch(p: LockedPrediction): Match | null {
  if (
    typeof p.gamePk !== "number" ||
    typeof p.engineWinHomePct !== "number" ||
    typeof p.gameDate !== "string" ||
    typeof p.homeId !== "number" ||
    typeof p.awayId !== "number"
  ) {
    return null;
  }
  const homePct = Math.round(p.engineWinHomePct);
  const awayPct = 100 - homePct;
  const home = teamZh(p.homeId, p.homeEn ?? "");
  const away = teamZh(p.awayId, p.awayEn ?? "");
  const tp = toTaipeiTime(p.gameDate);
  const finalResult: Match["finalResult"] =
    p.finalScore &&
    typeof p.finalScore.home === "number" &&
    typeof p.finalScore.away === "number"
      ? {
          homeScore: p.finalScore.home,
          awayScore: p.finalScore.away,
          winner:
            p.finalScore.home > p.finalScore.away
              ? "home"
              : p.finalScore.away > p.finalScore.home
                ? "away"
                : "tie",
          ingestedAt: p.gameDate,
        }
      : undefined;
  const homeSide = lockedSide(home.zh, home.abbr, p.homePitcher, p.homeStats, homePct);
  const awaySide = lockedSide(away.zh, away.abbr, p.awayPitcher, p.awayStats, awayPct);
  return {
    id: `mlb-${p.gamePk}`,
    league: "MLB",
    date: `${tp.date}  ·  ${weekdayZh(p.gameDate)}`,
    startTime: tp.time,
    venue: "—",
    home: homeSide,
    away: awaySide,
    // R228 · 同 live 路徑 · 由鎖定勝率 + 兩隊先發 ERA 推導最可能比分(永久重建場也有 · 同源一致)。
    topScores: deriveMlbTopScores(homePct, homeSide.pitcher.era, awaySide.pitcher.era),
    aiConfidence: Math.max(homePct, awayPct),
    finalResult,
  };
}

/** 從 mlb-locked.json 重建的「已封存」MLB 場(同步 · 不打 API)· 永久可達。
 *  給詳情頁 fallback + /member 隊名 lookup 補齊用(live 窗掉出去的舊場)。
 *  模組級 memo(R294 實測 ~120ms/次 · 444 場逐場建 Intl formatter + 比分表):
 *  mlb-locked.json 是 build 時靜態 import、部署前不會變 → 每個 process 重建一次就夠,
 *  天梯/脈動/戰帖/今日一戰各 hot path 不再各付一次(且鎖檔隨賽季線性長大)。 */
let lockedMatchesMemo: Match[] | null = null;
export function getMlbLockedMatches(): Match[] {
  if (lockedMatchesMemo) return lockedMatchesMemo;
  const out: Match[] = [];
  for (const p of (mlbLocked.predictions ?? []) as LockedPrediction[]) {
    const m = lockedToMatch(p);
    if (m) out.push(m);
  }
  lockedMatchesMemo = out;
  return out;
}

// 單場查(詳情頁用)· id = "mlb-{gamePk}" → 對應的 Match(找不到回 null)。
// live 窗(昨+今)優先;掉出窗的 settled 場走 locked.json 永久重建(不再 404)。
export async function getMlbMatchById(id: string): Promise<Match | null> {
  if (!id.startsWith("mlb-")) return null;
  const live = (await getMlbAsMatches()).find((m) => m.id === id);
  if (live) return live;
  return getMlbLockedMatches().find((m) => m.id === id) ?? null;
}

// MLB 已結算場的結果(給個人準度評分用 · 同 CPBL getFinalizedMatches 的 shape)·
// 讓「押 MLB」也計進你 vs 引擎的命中率(aggregatePredictionStats / YourRecordStrip)。
//
// 🔒 永久戰績修復(R200 碼審):結果一律先讀 lib/mlb-locked.json 的 finalScore
// (grade:mlb GitHub Action 賽後寫回 · 永久存)· 不再只靠即時 API 的「昨天+今天」窗 ——
// 否則 settled 的 MLB 押注 2 天後從 API 窗掉出去 → 重新被當 pending → 命中/落空從你的
// 帳本消失、準度分母縮水 = 違反「刪不掉的帳本」。 JSON 永久結果為主 + live API 只補剛
// 打完還沒 grade 到的場(graceful:API 失敗也不影響永久結果)。 對齊 CPBL 永久戰績。
type LockedFinal = {
  gamePk?: number;
  gameDate?: string;
  finalScore?: { home?: number; away?: number };
};
export async function getMlbFinalizedResults(): Promise<
  { id: string; finalWinner: "home" | "away" | "tie" | null; startISO: string | null }[]
> {
  const byId = new Map<
    string,
    { id: string; finalWinner: "home" | "away" | "tie" | null; startISO: string | null }
  >();
  // 1 · 永久結果(mlb-locked.json · 賽後 Action 寫回 finalScore)· settled 永遠可評
  for (const p of (mlbLocked.predictions ?? []) as LockedFinal[]) {
    const h = p.finalScore?.home;
    const a = p.finalScore?.away;
    if (typeof p.gamePk !== "number" || typeof h !== "number" || typeof a !== "number") continue;
    byId.set(`mlb-${p.gamePk}`, {
      id: `mlb-${p.gamePk}`,
      finalWinner: h > a ? "home" : a > h ? "away" : "tie",
      startISO: typeof p.gameDate === "string" ? p.gameDate : null,
    });
  }
  // 2 · 補剛打完、JSON 還沒 grade 到的場(live API · 失敗不破永久結果)
  try {
    const live = await getMlbAsMatches();
    for (const m of live) {
      if (!m.finalResult || byId.has(m.id)) continue; // JSON 永久結果優先
      byId.set(m.id, {
        id: m.id,
        finalWinner: m.finalResult.winner,
        startISO: getMatchStartIso(m),
      });
    }
  } catch {
    // 永久結果(JSON)已足夠 · live 補強失敗不影響帳本
  }
  return [...byId.values()];
}
