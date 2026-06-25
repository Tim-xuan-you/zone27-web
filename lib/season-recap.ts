// ── ZONE 27 · 賽季回顧(月度 · 純 derive · soul「故事」層)──────────────────
// /u/[code]/season/[YYYY-MM] 的資料層。 Spotify-Wrapped 式「你這個月怎麼樣」——
// 但誠實版:含輸照算、含一筆失手、紀律 = 回來對帳幾天(不是連勝)。
//
// 🔴 與公開檔 /u/[code] 的分工:profile = 全期「證物」(整本帳攤開);recap = 單月
//   「故事」(高光 + 一個誠實失手 + 紀律天數)。 不復活刻意砍掉的 /annual。
// 🔴 全部 reuse 既有 derive(aggregateIdentity / gradeSoccerPicks / computeTrophies)·
//   這支只做「按月切片 + 挑高光」· 不另寫任何聚合邏輯(單一真相 · 含輸照算)。
//
// 月份歸屬 = 押注「鎖定當天」的台北月(taipeiDayOf(ts) 前 7 碼)· 不是賽果結算月 ——
// 「你這個月鎖了哪些手」是你掌控的那天,語意乾淨(同 streak 用下注日的理由)。
// ─────────────────────────────────────────────────────

import { taipeiDayOf, type UserPredictionsMap } from "@/lib/predictions";
import type { SoccerPickRow } from "@/lib/soccer/predictions";
import type { Trophy } from "@/lib/trophies";

/** 合法月份格式:YYYY-MM(01–12)。 */
export const SEASON_PERIOD_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

/** 正規化路由參數成合法月份 · 不合法回 null(頁面 404)。 decode + trim。 */
export function normalizeSeasonPeriod(
  raw: string | null | undefined,
): string | null {
  let p = "";
  try {
    p = decodeURIComponent(raw ?? "");
  } catch {
    p = raw ?? "";
  }
  p = p.trim();
  return SEASON_PERIOD_RE.test(p) ? p : null;
}

/** ts 的台北月「YYYY-MM」· 不可解析 → null。 */
export function taipeiMonthOf(ts: string | null | undefined): string | null {
  const d = taipeiDayOf(ts);
  return d ? d.slice(0, 7) : null;
}

/** 棒球 picks 切到「鎖定於 period 台北月」的子集。 */
export function filterBaseballByMonth(
  map: UserPredictionsMap,
  period: string,
): UserPredictionsMap {
  const out: UserPredictionsMap = {};
  for (const [id, p] of Object.entries(map)) {
    if (taipeiMonthOf(p.ts) === period) out[id] = p;
  }
  return out;
}

/** 足球 picks 切到 period 台北月的子集。 */
export function filterSoccerByMonth(
  rows: SoccerPickRow[],
  period: string,
): SoccerPickRow[] {
  return rows.filter((r) => taipeiMonthOf(r.ts) === period);
}

/** 網球(或任何帶 ts 的 picks)切到 period 台北月的子集。 泛型保留原列型別。 */
export function filterTennisByMonth<T extends { ts: string }>(
  rows: T[],
  period: string,
): T[] {
  return rows.filter((r) => taipeiMonthOf(r.ts) === period);
}

/** 這個月有沒有任何押注(給「要不要顯示本月回顧入口」判斷 · 避免連到空回顧)。
 *  第二個參數只讀 ts → 放寬成 { ts }[],可一次塞足球 + 玩法 + 網球(跨運動都算「有押」)。 */
export function hasMonthActivity(
  baseball: UserPredictionsMap,
  others: { ts: string }[],
  period: string,
): boolean {
  for (const p of Object.values(baseball)) {
    if (taipeiMonthOf(p.ts) === period) return true;
  }
  return others.some((r) => taipeiMonthOf(r.ts) === period);
}

/** 這個月回來對帳的不同台北日數(紀律 · 只算本月已切片的 picks · 含贏含輸)。
 *  傳入「已按月切片」的 picks → 直接數不同台北日。 第二個參數放寬成 { ts }[](足球 + 玩法 + 網球)。 */
export function monthActiveDays(
  baseball: UserPredictionsMap,
  others: { ts: string }[],
): number {
  const days = new Set<string>();
  for (const p of Object.values(baseball)) {
    const d = taipeiDayOf(p.ts);
    if (d) days.add(d);
  }
  for (const r of others) {
    const d = taipeiDayOf(r.ts);
    if (d) days.add(d);
  }
  return days.size;
}

export type SeasonHighlights = {
  /** 最漂亮一手:逆風贏引擎優先 · 否則任一命中 · 最近賽事日(trophies 已新→舊排)· null = 本月無命中 */
  best: Trophy | null;
  /** 誠實一筆:本月一個失手(Pratfall · 報馬仔刪這個 · 我們留著)· null = 本月全中/無結算 */
  miss: Trophy | null;
};

/**
 * 從「本月已切片」的戰功卡挑高光。 trophies 必須已是本月子集(computeTrophies 餵的是
 * 切過月的 picks)· 故這裡不再過濾月份 · 只挑最佳一手 + 一筆誠實失手。
 * trophies 已按賽事日新→舊排(computeTrophies)· 取 [0] = 最近。
 */
export function pickHighlights(trophies: Trophy[]): SeasonHighlights {
  const best =
    trophies.find((t) => t.upset) ?? trophies.find((t) => t.hit) ?? null;
  const miss = trophies.find((t) => !t.hit) ?? null;
  return { best, miss };
}

/** "2026-06" → "2026 年 6 月"(顯示用 · 非法字串原樣回傳 graceful)。 */
export function monthLabel(period: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(period);
  if (!m) return period;
  return `${m[1]} 年 ${Number(m[2])} 月`;
}
