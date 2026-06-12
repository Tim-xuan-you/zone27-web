// ── ZONE 27 · 足球引擎「站上即時對帳」(不等 GitHub cron)──────────────────────
// 問題:足球賽後結算原本只靠 soccer-engine.yml(GitHub Action · 每 3h)寫回 soccer-locked.json。
//   但 GitHub 排程 cron 不可靠(常被延遲數小時 / 高負載時整批丟掉)→ 世界盃夜一場踢完、
//   引擎公開帳本卻凍在「未對帳」好幾小時 = 同一頁自打臉(像極了輸了就裝死的明牌站)。
//
// 解(本檔):鏡 CPBL「載入時對帳」+ 足球用戶押注 getSoccerLedgerResults 的「live 疊永久」模式 ——
//   站上 render 時就用「當初鎖定的三向機率 vs 90 分鐘正規賽終場」即時評,不等 Action commit。
//   · 已持久化 verdict 的場 → 原樣(永久者勝 · 賽後落出 live 窗也不縮水)。
//   · verdict 還 null 但已踢完(live 結果窗有終場)→ gradeLockedVerdict 即時評(同 grade script
//     同源 · 零 drift · cron 之後補寫的 verdict 會跟這個一致)。
//   GitHub Action 仍留著當「持久化 + 鎖定快照 committer」· 本檔只補「終場到入帳之間」的顯示空窗。
//
// 速率/韌性:0 API 當沒有「踢完卻沒對帳」的場(常見);需要時打 getRecentSoccerResults
//   (1h ISR · 全站共用快取 · 遠低於 10/min)· 缺 token / live 窗無該場 → 維持 pending(graceful)。
//   server-only(getRecentSoccerResults 讀 Vercel env token + fetch)。
// ─────────────────────────────────────────────────────

import { getRecentSoccerResults } from "./football-data";
import {
  getLockedSoccerPredictions,
  type LockedSoccerPrediction,
} from "./locked";
import { gradeLockedVerdict } from "./predict-core.mjs";

// on-read 結算的代理時戳 = 開賽 + 110 分(≈ 終場)· 僅給排序 / 顯示用。
// 持久化的場用它自己真正的 gradedAt(永久者勝),不會走到這。
const FULLTIME_MS = 110 * 60 * 1000;

/**
 * 站上即時對帳後的鎖定盤(verdict / outcome / finalScore 補齊)。
 * 已持久化者原樣;已踢完但還沒持久化者用 live 終場即時評;尚未踢完 / live 窗無 → 維持 pending。
 */
export async function resolveLockedSoccer(): Promise<LockedSoccerPrediction[]> {
  const locked = getLockedSoccerPredictions();
  const nowMs = Date.now();
  // 只有「已開踢(可能踢完)卻還沒對帳」的場才需要打 live API 補對帳。
  const needsLive = locked.some((p) => {
    if (p.verdict !== null) return false;
    const t = Date.parse(p.kickoffISO ?? "");
    return !Number.isNaN(t) && t < nowMs;
  });
  if (!needsLive) return locked; // 沒有待補的 → 0 API

  const live = await getRecentSoccerResults();
  if (live.length === 0) return locked; // 缺 token / 空窗 → graceful 原樣
  const byId = new Map(live.map((r) => [r.matchId, r] as const));

  return locked.map((p) => {
    if (p.verdict !== null) return p; // 永久者勝(已持久化)
    const r = byId.get(p.matchId);
    if (!r) return p; // live 窗沒這場(還沒踢完 / 已掉出)→ 維持 pending
    // 同 grade script 同源:當初鎖定的三向機率 vs 90 分鐘正規賽終場(regulationScore 已在 r 內)。
    const { outcome, verdict } = gradeLockedVerdict(
      p.homeWin,
      p.draw,
      p.awayWin,
      r.homeGoals,
      r.awayGoals,
    );
    const t = Date.parse(p.kickoffISO ?? "");
    const settledIso = Number.isNaN(t)
      ? r.kickoffISO || p.kickoffISO
      : new Date(t + FULLTIME_MS).toISOString();
    return {
      ...p,
      finalScore: { home: r.homeGoals, away: r.awayGoals },
      outcome,
      verdict,
      gradedAt: settledIso, // on-read 代理時戳(排序 / 顯示;cron 之後會用真 gradedAt 蓋掉)
    };
  });
}

export type ResolvedSoccerEngine = {
  /** verdict 已在站上即時補齊的鎖定盤 */
  predictions: LockedSoccerPrediction[];
  /** 還沒開踢(改不了的賽前盤) */
  notKicked: number;
  /** 已開踢但 live 窗還沒回終場(真·短暫待對帳)*/
  awaitingGrade: number;
};

/**
 * SoccerEngineRecord 用:即時對帳後的盤 + 「未開賽 / 開踢後待對帳」分流(時鐘讀在 lib · 不在元件)。
 * on-read 補完後,awaitingGrade 只剩「踢完但 live 窗暫時沒回終場」的真空窗(通常 0)。
 */
export async function getResolvedSoccerEngine(): Promise<ResolvedSoccerEngine> {
  const predictions = await resolveLockedSoccer();
  const nowMs = Date.now();
  let notKicked = 0;
  let awaitingGrade = 0;
  for (const p of predictions) {
    if (p.verdict !== null) continue;
    const t = Date.parse(p.kickoffISO ?? "");
    if (Number.isNaN(t) || t > nowMs) notKicked += 1;
    else awaitingGrade += 1;
  }
  return { predictions, notKicked, awaitingGrade };
}
