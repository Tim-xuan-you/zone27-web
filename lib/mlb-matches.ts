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
import { getMatchStartIso } from "@/lib/matches";
import { fetchRelevantMlb, type MlbGame, type MlbTeamSide } from "@/lib/mlb";
import mlbLocked from "@/lib/mlb-locked.json";

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
    home: mlbSide(g.home, homePct),
    away: mlbSide(g.away, awayPct),
    topScores: [], // MLB 引擎是 Log5 公式非逐打席模擬 · 無比分分佈(詳情頁該段自動略過)
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

// 單場查(詳情頁用)· id = "mlb-{gamePk}" → 對應的 Match(找不到回 null)。
export async function getMlbMatchById(id: string): Promise<Match | null> {
  if (!id.startsWith("mlb-")) return null;
  const all = await getMlbAsMatches();
  return all.find((m) => m.id === id) ?? null;
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
