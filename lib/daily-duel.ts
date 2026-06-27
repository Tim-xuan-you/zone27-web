import type { Match } from "@/lib/matches";
import { getMatchPhase, getEngineFavorite, getMatchStartIso } from "@/lib/matches";

// ── ZONE 27 · 今日一戰 · 你 vs 機器(每日對決選題)─────────────────────────────────
// 留存命門(Tim 2026-06-27「玩一天就沒再來」):球賽賽果慢、不規律 → 押完之後「明天」沒有
// 任何事等用戶回來,產品變成「想到才開的工具」而非「每天得回來的習慣」。 Wordle/Duolingo/Strava
// 的共同解:一天一個小動作 + 隔天見真章 + 一條看得見的連續紀錄。 ZONE 27 有別人抄不走的版本 ——
// 一台「賽前公開下注、而且會輸」的誠實機器,讓人每天正面挑戰它一次。
//
// 這支只做一件事:從「今天還能賽前鎖死的場」裡,挑出唯一的「今日一戰」。 0 新增 Tim 負擔
// (自動從既有開盤的賽事挑)· 純函式 · deterministic · on-read。
//
// 🔴 v1 範圍 = 棒球型賽事(CPBL + MLB · home/away 兩向 · 重用既有 CardBetStrip 下注流)。
//   足球(三向)/ 網球 / 羽球 / UFC 各有自己的下注元件,之後再擴(選題函式已留 league 優先序)。
// 🔴 紅線:挑「機器有偏好(非 50/50)」的場 —— 沒有機器的一手就沒有「你 vs 機器」。 不挑賠率、
//   不挑盤口、不挑「最容易中」的場灌水(挑的是機器最敢喊的一手 = 最有看頭的對決,不是最好賺)。
// ─────────────────────────────────────────────────────

// 主場優先序:CPBL(自家主場 local-first)> MLB > 其餘。 同級內挑機器最敢喊的一手(conviction)。
const LEAGUE_PRIORITY: Record<string, number> = { CPBL: 0, MLB: 1, NPB: 2, NBA: 3 };

function conviction(m: Match): number {
  return Math.max(m.home.winRate, m.away.winRate);
}

/** 從一批棒球型賽事裡挑出「今日一戰」· 沒有可賽前鎖死的場 → null(休賽 / 都開打了)。 */
export function selectTodayDuel(matches: Match[]): Match | null {
  const candidates = matches.filter((m) => {
    // 今日、還沒開賽(賽前才能誠實鎖一手對著機器)· today-live / final / 延賽都不算「可對決」。
    if (getMatchPhase(m) !== "today-pregame") return false;
    // 機器要有偏好(50/50 銅板局 → 沒有「機器的一手」可挑戰)。
    if (getEngineFavorite(m) === null) return false;
    return true;
  });
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const lp = (LEAGUE_PRIORITY[a.league] ?? 9) - (LEAGUE_PRIORITY[b.league] ?? 9);
    if (lp !== 0) return lp; // 主場聯盟先
    const cv = conviction(b) - conviction(a);
    if (cv !== 0) return cv; // 機器最敢喊的一手先(最有看頭的對決)
    const sa = getMatchStartIso(a) ?? "";
    const sb = getMatchStartIso(b) ?? "";
    if (sa !== sb) return sa.localeCompare(sb); // 同把握度 → 先開賽的先
    return a.id.localeCompare(b.id); // 完全 deterministic 收尾
  });
  return candidates[0];
}

/** 機器在這場已鎖死的一手(給對決卡顯示「機器已鎖 X N%」)· 平手不該到這(選題已濾掉)。 */
export function duelEngineSide(
  m: Match,
): { side: "home" | "away"; name: string; pct: number } | null {
  const fav = getEngineFavorite(m);
  if (fav === null) return null;
  return fav === "home"
    ? { side: "home", name: m.home.name, pct: m.home.winRate }
    : { side: "away", name: m.away.name, pct: m.away.winRate };
}
