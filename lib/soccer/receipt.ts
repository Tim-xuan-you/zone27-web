// ── ZONE 27 · 足球單場「戰功收據」資料層 ─────────────────────────────────
// 一場世界盃/聯賽鎖定預測 + 賽後結果 = 一張賽前鎖死、刪不掉、可截圖外傳的單場收據
// (Topps Now / 戰功碑:你那一手鎖在結果還不存在的時候,賽後攤開命中或落空)。
//
// 🔑 不靠 GitHub secret:結果來源優先用已 grade 的 locked.finalScore(sync · 無 API);
//    沒 grade 就拉 live 賽果窗(getSoccerLedgerResults · Vercel env token)現場算判決 →
//    世界盃比賽一打完今晚就有收據,不用等 Action 跑。
// 判決一律對「賽前鎖定的那組三向機率」評(守先鎖後結)· 比分走 90 分鐘正規賽(上游已濾延長賽/PK)。
// 收據只在「賽後」存在(同棒球):查無鎖定 / 還沒踢完 → null → 頁面 404。
// ─────────────────────────────────────────────────────

import { getLockedSoccerById, kickoffTaipei } from "./locked";
import { getSoccerLedgerResults } from "./football-data";
import { gradeLockedVerdict } from "./predict-core.mjs";
import type { SoccerPick } from "./predictions";

export type SoccerReceipt = {
  matchId: string;
  competitionName: string;
  home: string;
  away: string;
  homeSeed: string;
  awaySeed: string;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  /** 引擎賽前看好的一邊(三向 argmax) */
  enginePick: SoccerPick;
  /** 引擎看好那邊的顯示名(home/away 隊名 or「和局」) */
  favoredLabel: string;
  /** 引擎看好那邊的機率 % */
  favoredPct: number;
  /** 90 分鐘終場比分 */
  finalHome: number;
  finalAway: number;
  /** 實際結果(主勝/和/客勝) */
  outcome: SoccerPick;
  verdict: "proved" | "diverged" | "push";
  /** 賽前鎖定時間(台北 MM/DD HH:mm) */
  lockedAtTPE: string;
  /** 開賽時間(台北 MM/DD HH:mm) */
  kickoffTPE: string;
  /** 開賽 UTC ISO(給「本人這手」島做先鎖後結 late-pick 剔除) */
  kickoffISO: string;
};

/** 取一場足球收據資料(fd-* · 賽後才有)。 查無鎖定 / 還沒踢完 → null。 */
export async function getSoccerReceipt(
  matchId: string,
): Promise<SoccerReceipt | null> {
  if (!matchId.startsWith("fd-")) return null;
  const locked = getLockedSoccerById().get(matchId);
  if (!locked) return null;

  let finalHome: number;
  let finalAway: number;
  let verdict: "proved" | "diverged" | "push";
  let outcome: SoccerPick;

  // 已 grade(locked.json 寫回 finalScore + verdict)→ 直接用(sync · 不打 API)。
  if (
    locked.verdict &&
    locked.finalScore &&
    typeof locked.finalScore.home === "number" &&
    typeof locked.finalScore.away === "number" &&
    (locked.outcome === "home" ||
      locked.outcome === "draw" ||
      locked.outcome === "away")
  ) {
    finalHome = locked.finalScore.home;
    finalAway = locked.finalScore.away;
    verdict = locked.verdict;
    outcome = locked.outcome;
  } else {
    // 還沒 grade → 拉 live 賽果窗現場算(不靠 GitHub secret)。 還沒踢完 → null。
    const results = await getSoccerLedgerResults();
    const r = results.find((x) => x.matchId === matchId);
    if (!r) return null;
    finalHome = r.homeGoals;
    finalAway = r.awayGoals;
    outcome = r.outcome;
    const g = gradeLockedVerdict(
      locked.homeWin,
      locked.draw,
      locked.awayWin,
      finalHome,
      finalAway,
    );
    verdict = g.verdict;
  }

  const favoredLabel =
    locked.enginePick === "home"
      ? locked.home
      : locked.enginePick === "away"
        ? locked.away
        : "和局";
  const favoredPct =
    locked.enginePick === "home"
      ? locked.homeWinPct
      : locked.enginePick === "away"
        ? locked.awayWinPct
        : locked.drawPct;

  return {
    matchId,
    competitionName: locked.competitionName,
    home: locked.home,
    away: locked.away,
    homeSeed: locked.homeSeed,
    awaySeed: locked.awaySeed,
    homeWinPct: locked.homeWinPct,
    drawPct: locked.drawPct,
    awayWinPct: locked.awayWinPct,
    enginePick: locked.enginePick,
    favoredLabel,
    favoredPct,
    finalHome,
    finalAway,
    outcome,
    verdict,
    lockedAtTPE: kickoffTaipei(locked.lockedAt),
    kickoffTPE: kickoffTaipei(locked.kickoffISO),
    kickoffISO: locked.kickoffISO ?? "",
  };
}
