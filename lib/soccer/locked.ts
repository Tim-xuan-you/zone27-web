// ── ZONE 27 · 足球賽前鎖定盤(讀 lib/soccer-locked.json · 永久戰績來源)──────────
// GitHub Action(soccer-engine.yml)每 3h 跑 lock + grade → 寫 lib/soccer-locked.json
// → commit → Vercel 重佈。 本檔把那份「賽前鎖死、賽後對帳」的盤讀出來給三處用:
//   1. 引擎公開戰績(components/SoccerEngineRecord)
//   2. 永久結果來源(修「賽事掉出 live 窗 → 已結算押注變回 pending → 帳本縮水」的命門)
//   3. 你 vs 引擎(同一批已結算場,引擎當初鎖的 pick 命中率)
// 缺檔 / 空陣列 → 全 graceful 空(同其他面板 · 不 crash · 不顯示假資料)。
// ─────────────────────────────────────────────────────

import soccerLocked from "@/lib/soccer-locked.json";
import type { SoccerResult } from "./football-data";
import type { SoccerPick } from "./predictions";

export type LockedSoccerPrediction = {
  matchId: string;
  competitionCode: string;
  competitionName: string;
  kickoffISO: string;
  status?: string;
  homeSeed: string;
  awaySeed: string;
  home: string;
  away: string;
  /** 餵進引擎的實力分 + 主場優勢(國家隊 · 舊紀錄 overlay 用 predictSoccer 重現) */
  ratingHome: number;
  ratingAway: number;
  homeAdvantage: number;
  /** 餵進比分表的兩邊預期進球 λ(overlay 優先用 predictFromGoals 重現 · 俱樂部攻防模型必需)·
   *  舊紀錄(R203 首批 11 場世界盃)無此欄 → fallback predictSoccer(rating)。 */
  xgHome?: number;
  xgAway?: number;
  /** 鎖定的引擎開盤(raw 0-1 · 給 RPS / 校準)+ 整數展示 + 看好邊 */
  homeWin: number;
  draw: number;
  awayWin: number;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  enginePick: SoccerPick;
  lockedAt: string;
  /** 賽後 grade 填 */
  finalScore: { home: number; away: number } | null;
  outcome: SoccerPick | null;
  verdict: "proved" | "diverged" | "push" | null;
  gradedAt: string | null;
};

/** 全部鎖定預測(原始)。 缺檔 → 空。 */
export function getLockedSoccerPredictions(): LockedSoccerPrediction[] {
  const arr = (soccerLocked as { predictions?: unknown }).predictions;
  return Array.isArray(arr) ? (arr as LockedSoccerPrediction[]) : [];
}

/** matchId → 鎖定預測(站上卡片「顯示賽前鎖定線」overlay 用)。 */
export function getLockedSoccerById(): Map<string, LockedSoccerPrediction> {
  const m = new Map<string, LockedSoccerPrediction>();
  for (const p of getLockedSoccerPredictions()) {
    if (p && typeof p.matchId === "string") m.set(p.matchId, p);
  }
  return m;
}

/**
 * 永久已結算結果(賽後 grade 寫回 finalScore/outcome)· settled 永遠可評,不隨 live 窗掉出去。
 * 給「你的足球戰績」對帳(取代/疊在 getRecentSoccerResults 之上 · 永久者勝)。
 */
export function getSoccerFinalizedResults(): SoccerResult[] {
  const out: SoccerResult[] = [];
  for (const p of getLockedSoccerPredictions()) {
    const o = p.outcome;
    const fs = p.finalScore;
    if ((o !== "home" && o !== "draw" && o !== "away") || !fs) continue;
    if (typeof fs.home !== "number" || typeof fs.away !== "number") continue;
    out.push({
      matchId: p.matchId,
      outcome: o,
      homeGoals: fs.home,
      awayGoals: fs.away,
      kickoffISO: p.kickoffISO ?? "",
    });
  }
  return out;
}

/**
 * verdict null(還沒結算)的鎖定條目,按「開賽了沒」分流。 給 SoccerEngineRecord
 * 把「還沒踢」跟「踢完待對帳」誠實分開標 ——「還沒踢」掛在已踢完的場上 = 當眾說謊
 * (結算每 3h 跑 · 終場到入帳有空窗)。 時鐘讀在 lib(server request/ISR 時間粒度
 * 對這個標籤夠用)· 不在元件 render 內讀(react-hooks/purity)。
 */
export function splitUngradedByKickoff(): {
  notKicked: number;
  awaitingGrade: number;
} {
  let notKicked = 0;
  let awaitingGrade = 0;
  const nowMs = Date.now();
  for (const p of getLockedSoccerPredictions()) {
    if (p.verdict !== null) continue;
    const t = Date.parse(p.kickoffISO ?? "");
    if (Number.isNaN(t) || t > nowMs) notKicked += 1;
    else awaitingGrade += 1;
  }
  return { notKicked, awaitingGrade };
}

/**
 * matchId → 引擎當初鎖定的看好邊(只含有鎖定線的場)。 給「你 vs 引擎」同場對照
 * (只比兩邊都有的場 = apples-to-apples)。
 */
export function getSoccerEnginePicks(): Record<string, SoccerPick> {
  const out: Record<string, SoccerPick> = {};
  for (const p of getLockedSoccerPredictions()) {
    const pick = p.enginePick;
    if (pick === "home" || pick === "draw" || pick === "away") out[p.matchId] = pick;
  }
  return out;
}
