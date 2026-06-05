// ── ZONE 27 · football-data.org 接線(免費足球賽程/戰績資料層)─────────
// 「每天全聯賽自動上」的資料來源 = football-data.org 免費方案(12 大競賽 ·
// 賽程+戰績+積分 · 10 req/min)。 我們**只拿中性的賽程/比分**(絕不拿盤口)。
//
// 管線:抓某競賽「已結束的比賽」→ 自建 Elo 算實力分 → 抓「未來賽程」→ 引擎開盤。
//   實力分不夠的隊老實標「覆蓋建置中」不硬開假盤(MIN_GAMES_FOR_RATING 把關)。
//
// 速率紀律:Next fetch `revalidate` 快取 → 同一份資料一小時內只打一次 API,
//   全站共用快取 = 遠低於 10/min 上限(daniel 提醒看標頭控流量 · 快取直接根治)。
// GRACEFUL:沒設 FOOTBALL_DATA_API_TOKEN(例如還沒接 Vercel env)→ 一律回空 ·
//   不 crash、不顯示假資料(同其他 graceful 元件)。 0 cookie · 不破 ISR。
//
// ⚠️ 國家隊賽事(世界盃/歐國盃)在「該競賽內」沒有歷史戰績可算 Elo → 走 teams.ts
//   的國際排名 seed(下一步接;本檔先把已驗證的「俱樂部聯賽」路徑做穩)。
// ─────────────────────────────────────────────────────

import {
  buildRatings,
  gameCounts,
  getRating,
  MIN_GAMES_FOR_RATING,
} from "./elo";
import { predictSoccer, type SoccerPrediction } from "./engine";

const BASE = "https://api.football-data.org/v4";
const REVALIDATE_SECONDS = 3600; // 1h ISR · 遠低於 10/min

/** 免費方案涵蓋的 12 個競賽(code 對應 football-data.org · 中文展示名)。 */
export const SOCCER_COMPETITIONS = [
  { code: "WC", name: "世界盃", en: "World Cup", isNationalTeam: true },
  { code: "EC", name: "歐國盃", en: "Euro", isNationalTeam: true },
  { code: "CL", name: "歐冠", en: "Champions League", isNationalTeam: false },
  { code: "PL", name: "英超", en: "Premier League", isNationalTeam: false },
  { code: "PD", name: "西甲", en: "La Liga", isNationalTeam: false },
  { code: "BL1", name: "德甲", en: "Bundesliga", isNationalTeam: false },
  { code: "SA", name: "義甲", en: "Serie A", isNationalTeam: false },
  { code: "FL1", name: "法甲", en: "Ligue 1", isNationalTeam: false },
  { code: "DED", name: "荷甲", en: "Eredivisie", isNationalTeam: false },
  { code: "PPL", name: "葡超", en: "Primeira Liga", isNationalTeam: false },
  { code: "ELC", name: "英冠", en: "Championship", isNationalTeam: false },
  { code: "BSA", name: "巴西甲", en: "Brazil Série A", isNationalTeam: false },
] as const;

export type SoccerCompetitionCode = (typeof SOCCER_COMPETITIONS)[number]["code"];

type FdTeam = { name?: string; shortName?: string; tla?: string };
type FdMatch = {
  id?: number;
  utcDate?: string;
  status?: string;
  homeTeam?: FdTeam;
  awayTeam?: FdTeam;
  score?: { fullTime?: { home?: number | null; away?: number | null } };
};

function teamName(t: FdTeam | undefined): string {
  return t?.shortName || t?.tla || t?.name || "?";
}

function getToken(): string {
  return process.env.FOOTBALL_DATA_API_TOKEN ?? "";
}

/** 抓某競賽某狀態的比賽 · 空陣列 on 缺 token / 錯誤(graceful · ISR 快取)。 */
async function fetchMatches(
  code: string,
  status: "FINISHED" | "SCHEDULED",
): Promise<FdMatch[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(
      `${BASE}/competitions/${code}/matches?status=${status}`,
      {
        headers: { "X-Auth-Token": token },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { matches?: FdMatch[] };
    return Array.isArray(data.matches) ? data.matches : [];
  } catch {
    return [];
  }
}

export type SoccerMatchPrediction = {
  id: string;
  competitionCode: string;
  competitionName: string;
  /** 開賽 UTC ISO */
  dateISO: string;
  home: string;
  away: string;
  /** null = 覆蓋建置中(其中一隊戰績不足 · 不硬開假盤) */
  prediction: SoccerPrediction | null;
};

/**
 * 一個競賽的未來賽程 + 我們引擎的開盤。
 * 俱樂部聯賽:自建 Elo(從本季已結束比賽算)。 0 比賽/缺 token → 空陣列。
 * （國家隊競賽的 seed-rating 路徑下一步接 · 見檔頭。）
 */
export async function getCompetitionPredictions(
  code: SoccerCompetitionCode,
): Promise<SoccerMatchPrediction[]> {
  const comp = SOCCER_COMPETITIONS.find((c) => c.code === code);
  const compName = comp?.name ?? code;

  const finished = await fetchMatches(code, "FINISHED");
  const results = finished
    .map((m) => ({
      home: teamName(m.homeTeam),
      away: teamName(m.awayTeam),
      homeGoals: m.score?.fullTime?.home,
      awayGoals: m.score?.fullTime?.away,
    }))
    .filter(
      (r): r is { home: string; away: string; homeGoals: number; awayGoals: number } =>
        typeof r.homeGoals === "number" && typeof r.awayGoals === "number",
    );

  const ratings = buildRatings(results);
  const counts = gameCounts(results);

  const scheduled = await fetchMatches(code, "SCHEDULED");
  return scheduled.map((m) => {
    const home = teamName(m.homeTeam);
    const away = teamName(m.awayTeam);
    const enough =
      (counts[home] ?? 0) >= MIN_GAMES_FOR_RATING &&
      (counts[away] ?? 0) >= MIN_GAMES_FOR_RATING;
    return {
      id: `fd-${m.id ?? `${home}-${away}`}`,
      competitionCode: code,
      competitionName: compName,
      dateISO: m.utcDate ?? "",
      home,
      away,
      prediction: enough
        ? predictSoccer(getRating(ratings, home), getRating(ratings, away), {
            homeAdvantage: 60,
          })
        : null,
    };
  });
}
