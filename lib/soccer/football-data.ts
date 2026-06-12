// ── ZONE 27 · football-data.org 接線(免費足球賽程/戰績資料層)─────────
// 「每天全聯賽自動上」的資料來源 = football-data.org 免費方案(12 大競賽 ·
// 賽程+戰績+積分 · 10 req/min)。 我們**只拿中性的賽程/比分**(絕不拿盤口)。
//
// 管線:抓某競賽「已結束的比賽」→ 自建 Elo 算實力分 → 抓「未來賽程」→ 引擎開盤。
//   ⚠️ 開盤那段純邏輯已抽到 lib/soccer/predict-core.mjs(computeCompetitionPredictions)·
//   站上(本檔)與賽前鎖定 script 共用同一份 → 站上顯示的數字 == 鎖進 JSON 的數字(誠信)。
//   實力分不夠的隊老實標「覆蓋建置中」不硬開假盤(MIN_GAMES_FOR_RATING 把關)。
//
// 速率紀律:Next fetch `revalidate` 快取 → 同一份資料一小時內只打一次 API,
//   全站共用快取 = 遠低於 10/min 上限。
// GRACEFUL:沒設 FOOTBALL_DATA_API_TOKEN → 一律回空 · 不 crash、不顯示假資料。
//
// 賽前鎖定盤一旦存在(lib/soccer-locked.json · GitHub Action 寫),卡片就「顯示鎖定線」
//   (用鎖定的實力分重現 predictSoccer)而非 live 重算 → 跟賽後對帳同一個數字(同 MLB
//   「引擎線一律用賽前鎖定值」)。 未鎖的場(或 JSON 空)仍走 live 重算。
// ─────────────────────────────────────────────────────

import { predictSoccer, predictFromGoals, type SoccerPrediction } from "./engine";
import {
  computeCompetitionPredictions,
  toScheduledInput,
  toResultInput,
  regulationScore,
} from "./predict-core.mjs";
import { getNationalZh } from "./teams";
import { getClubZh } from "./club-names";
import {
  getLockedSoccerById,
  getLockedSoccerPredictions,
  getSoccerFinalizedResults,
} from "./locked";
import {
  SOCCER_COMPETITIONS as SOCCER_COMPETITIONS_CORE,
  ACTIVE_COMPETITIONS as ACTIVE_COMPETITIONS_CORE,
} from "./competitions.mjs";

const BASE = "https://api.football-data.org/v4";
const REVALIDATE_SECONDS = 3600; // 1h ISR · 遠低於 10/min

export type SoccerCompetition = {
  code: string;
  name: string;
  en: string;
  isNationalTeam: boolean;
};

/** 免費方案涵蓋的 12 個競賽(資料在 competitions.mjs · 站上 + lock script 共用)。 */
export const SOCCER_COMPETITIONS: readonly SoccerCompetition[] = SOCCER_COMPETITIONS_CORE;

/** football-data.org 競賽代號(免費 12 賽 · 與 competitions.mjs 同步)。 */
export type SoccerCompetitionCode =
  | "WC" | "EC" | "CL" | "PL" | "PD" | "BL1"
  | "SA" | "FL1" | "DED" | "PPL" | "ELC" | "BSA";

// 目前「正在跑、值得展示」的競賽(rate-limit 紀律 · 隨季節擴充:8 月歐洲開季再加 PL/PD/...)。
export const ACTIVE_COMPETITIONS = ACTIVE_COMPETITIONS_CORE as SoccerCompetitionCode[];

type FdTeam = { name?: string; shortName?: string; tla?: string };
type FdGoals = { home?: number | null; away?: number | null };
type FdMatch = {
  id?: number;
  utcDate?: string;
  status?: string;
  homeTeam?: FdTeam;
  awayTeam?: FdTeam;
  // duration/regularTime:淘汰賽延長賽/PK 時 fullTime 是「最終」含加時進球 ·
  // 90 分鐘真比分在 regularTime(結算一律走 regulationScore · 90 分鐘 1X2)。
  score?: { duration?: string; fullTime?: FdGoals; regularTime?: FdGoals };
};

// 顯示名:國家隊→中文(對齊台灣運彩)· 俱樂部→中文(盡力版)· 都查不到 fallback 英文。
function displayName(t: FdTeam | undefined): string {
  if (!t) return "?";
  return (
    getNationalZh(t.name ?? "") ??
    getClubZh(t.shortName ?? "") ??
    getClubZh(t.name ?? "") ??
    t.shortName ??
    t.tla ??
    t.name ??
    "?"
  );
}

function getToken(): string {
  return process.env.FOOTBALL_DATA_API_TOKEN ?? "";
}

// 未開踢的賽程要同時抓 SCHEDULED + TIMED:時間一旦確定,football-data 會把 status 從
// SCHEDULED 翻成 TIMED(世界盃 6/08 全部已是 TIMED)→ 只抓 SCHEDULED 會整個聯賽看不到。
const UPCOMING_STATUS = "SCHEDULED,TIMED";

/** 抓某競賽某狀態的比賽 · 空陣列 on 缺 token / 錯誤(graceful · ISR 快取)。
 *  429(跟 GitHub Action 共用同一顆 token 撞 10 req/min)→ 等 2s 重試一次:
 *  別讓「空板」被快取住一小時 —— 世界盃日空板比慢 2 秒貴太多。
 *  ⚠️ 重試的 headers 必須跟第一發不同:Next 在同一個 render pass 對「同 URL +
 *  同 options」的 GET 做 request memoization(不分狀態碼),原樣重打只會拿回
 *  記憶化的同一個 429 —— headers 是 cache key 的一部分,加一個差異才真的上網路。 */
async function fetchMatches(code: string, status: string): Promise<FdMatch[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const url = `${BASE}/competitions/${code}/matches?status=${status}`;
    let res = await fetch(url, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000));
      res = await fetch(url, {
        headers: { "X-Auth-Token": token, "x-z27-retry": "1" },
        next: { revalidate: REVALIDATE_SECONDS },
      });
    }
    if (!res.ok) return [];
    const data = (await res.json()) as { matches?: FdMatch[] };
    return Array.isArray(data.matches) ? data.matches : [];
  } catch {
    return [];
  }
}

// 賽後結果(公開 · 給「你的足球戰績」對帳用 · ISR 可快取 · 不含 user 資料)。
export type SoccerResult = {
  /** fd-{id} · 對齊押注 match_id */
  matchId: string;
  outcome: "home" | "draw" | "away";
  homeGoals: number;
  awayGoals: number;
  /** 開賽 UTC ISO · 給「先鎖後結」過濾(開賽後才下的不算) */
  kickoffISO: string;
};

/** ACTIVE_COMPETITIONS 已結束的比賽結果(公開 · live 窗)· 給賽後對帳。 缺 token / 錯 → 空陣列。
 *  ⚠️ 這是「live 窗」(API 只回近期)→ 舊場會掉出 → 個人帳本請改用 getSoccerLedgerResults
 *  (疊上永久鎖定結果 getSoccerFinalizedResults · 永久者勝 · 不縮水)。 */
export async function getRecentSoccerResults(): Promise<SoccerResult[]> {
  const out: SoccerResult[] = [];
  for (const code of ACTIVE_COMPETITIONS) {
    // FINISHED + AWARDED(棄賽判定也有官方結果 · 不讓押注永遠掛「進行中」)。
    const finished = await fetchMatches(code, "FINISHED,AWARDED");
    for (const m of finished) {
      // 90 分鐘 1X2(regulationScore)· 淘汰賽 fullTime 含延長賽/PK 進球,
      // 直接用會把「90 分鐘押和」判成輸(跟引擎帳本同一把尺 · 同源 helper)。
      const reg = regulationScore(m.score);
      if (!reg || !m.id) continue;
      const { home: h, away: a } = reg;
      out.push({
        matchId: `fd-${m.id}`,
        outcome: h > a ? "home" : h < a ? "away" : "draw",
        homeGoals: h,
        awayGoals: a,
        kickoffISO: m.utcDate ?? "",
      });
    }
  }
  return out;
}

export type SoccerMatchPrediction = {
  id: string;
  competitionCode: string;
  competitionName: string;
  /** 開賽 UTC ISO */
  dateISO: string;
  /** 顯示名(中文 · 對齊台灣運彩 · 查不到 fallback 英文) */
  home: string;
  away: string;
  /** 英文原名 · 給隊徽 seed(顏色穩定 · Tim:隊徽維持英文) */
  homeSeed: string;
  awaySeed: string;
  /** null = 覆蓋建置中(其中一隊戰績不足 · 不硬開假盤) */
  prediction: SoccerPrediction | null;
  /** 此場的引擎開盤是否已「賽前鎖定」(true = 顯示的是鎖定線,改不了) */
  locked: boolean;
  /** 鎖定時間 ISO(封印戳:賽前就寫死的證據)· 未鎖為 null */
  lockedAt: string | null;
};

/**
 * 一個競賽的未來賽程 + 我們引擎的開盤(走共用 predict-core · 與賽前鎖定 script 同源)。
 * 已鎖定的場顯示「賽前鎖定線」(用鎖定實力分重現 predictSoccer · 同賽後對帳數字);
 * 未鎖的場走 live 重算。 缺 token / 0 比賽 → 空陣列(graceful)。
 */
export async function getCompetitionPredictions(
  code: SoccerCompetitionCode,
): Promise<SoccerMatchPrediction[]> {
  const comp = SOCCER_COMPETITIONS.find((c) => c.code === code);
  if (!comp) return [];
  const compName = comp.name;

  const scheduledRaw = await fetchMatches(code, UPCOMING_STATUS);
  // 國家隊賽事內沒有歷史戰績可算 Elo → 不抓 FINISHED(走 teams seed)。 俱樂部才抓。
  const finishedRaw = comp.isNationalTeam ? [] : await fetchMatches(code, "FINISHED");

  const scheduledInputs = scheduledRaw.map(toScheduledInput);
  const finishedResults = finishedRaw
    .map(toResultInput)
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const core = computeCompetitionPredictions(
    { code: comp.code, isNationalTeam: comp.isNationalTeam },
    finishedResults,
    scheduledInputs,
  );

  const lockedById = getLockedSoccerById();

  // core 與 scheduledRaw 一一對應(同序、同長)→ index 取原始隊物件補中文顯示名。
  return core.map((c, i) => {
    const raw = scheduledRaw[i];
    const locked = lockedById.get(c.id);
    // 已鎖定 → 重現鎖定線(顯示=賽後對帳同一個數字 · 改不了)。 優先用鎖定的預期進球 λ
    // (俱樂部攻防 + 國家隊新鎖皆存 xg);舊紀錄(首批世界盃)無 xg → fallback 實力分。
    const prediction = locked
      ? typeof locked.xgHome === "number" && typeof locked.xgAway === "number"
        ? predictFromGoals(locked.xgHome, locked.xgAway)
        : predictSoccer(locked.ratingHome, locked.ratingAway, {
            homeAdvantage: locked.homeAdvantage,
          })
      : c.prediction;
    return {
      id: c.id,
      competitionCode: code,
      competitionName: compName,
      dateISO: c.dateISO,
      home: displayName(raw?.homeTeam),
      away: displayName(raw?.awayTeam),
      homeSeed: c.homeSeed,
      awaySeed: c.awaySeed,
      prediction,
      locked: Boolean(locked),
      lockedAt: locked?.lockedAt ?? null,
    };
  });
}

/**
 * 韌性 fallback:把「賽前鎖定檔」(lib/soccer-locked.json)裡還沒開踢的鎖定場直接當可押卡渲染。
 * 給 /soccer 在 live API 斷線 / token 失效(getCompetitionPredictions 整片回空)時兜底 —— 板不變空白。
 *   · 0 API · 0 secret(純讀打包進 build 的 JSON · 不依賴 FOOTBALL_DATA_API_TOKEN)。
 *   · 只回未開踢、未結算的場(已開踢/已結算不能押 · 同站上「板只列未開賽」誠實規則)。
 *   · 引擎線用鎖定的預期進球 λ 重現(predictFromGoals · 同站上 overlay)→ 跟賽後對帳同一個數字(零 drift)。
 * 時鐘讀在 lib(/soccer 1h ISR · 開賽分流粒度夠用)· 不在元件 render 內讀(react-hooks/purity)。
 */
export function getLockedUpcomingPredictions(): SoccerMatchPrediction[] {
  const nowMs = Date.now();
  return getLockedSoccerPredictions()
    .filter((p) => {
      const t = Date.parse(p.kickoffISO ?? "");
      return !Number.isNaN(t) && t > nowMs && p.verdict === null;
    })
    .sort((a, b) => (a.kickoffISO || "").localeCompare(b.kickoffISO || ""))
    .map((p) => ({
      id: p.matchId,
      competitionCode: p.competitionCode,
      competitionName: p.competitionName,
      dateISO: p.kickoffISO,
      // 國家隊鎖定時已存中文;俱樂部存英文 → 盡力升中文(查不到留原樣 · 同 displayName 精神)。
      home: getClubZh(p.home) ?? p.home,
      away: getClubZh(p.away) ?? p.away,
      homeSeed: p.homeSeed,
      awaySeed: p.awaySeed,
      prediction:
        typeof p.xgHome === "number" && typeof p.xgAway === "number"
          ? predictFromGoals(p.xgHome, p.xgAway)
          : predictSoccer(p.ratingHome, p.ratingAway, { homeAdvantage: p.homeAdvantage }),
      locked: true,
      lockedAt: p.lockedAt ?? null,
    }));
}

/**
 * 單場足球完整預測(/soccer/[matchId] 詳情頁用 · R228 足球補到 CPBL 同級)· 先查賽前鎖定
 * (0 API · 打包檔)· 再退 live 各 active 聯賽(已 1h 快取)· 查無 → null(詳情頁 notFound)。
 */
export async function getSoccerMatchById(
  id: string,
): Promise<SoccerMatchPrediction | null> {
  const locked = getLockedUpcomingPredictions().find((p) => p.id === id);
  if (locked) return locked;
  for (const code of ACTIVE_COMPETITIONS) {
    const m = (await getCompetitionPredictions(code)).find((p) => p.id === id);
    if (m) return m;
  }
  return null;
}

/**
 * 個人帳本用的「結果來源」:永久鎖定結果(getSoccerFinalizedResults · settled 永不掉)
 * 疊在 live 窗(getRecentSoccerResults)之上,key 撞 → 永久者勝。 修「賽事掉出 live 窗 →
 * 已結算押注變回 pending → 帳本縮水」的命門(同 MLB 永久結果修復)。
 */
export async function getSoccerLedgerResults(): Promise<SoccerResult[]> {
  const live = await getRecentSoccerResults();
  const permanent = getSoccerFinalizedResults();
  const byId = new Map<string, SoccerResult>();
  for (const r of live) byId.set(r.matchId, r);
  for (const r of permanent) byId.set(r.matchId, r); // 永久者勝
  return [...byId.values()];
}
