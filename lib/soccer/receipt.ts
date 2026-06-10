// ── ZONE 27 · 足球單場「戰功收據」資料層 ─────────────────────────────────
// 一場世界盃/聯賽鎖定預測 = 一張賽前鎖死、刪不掉、可截圖外傳的單場收據
// (Topps Now / 戰功碑:你那一手鎖在結果還不存在的時候,賽後攤開命中或落空)。
//
// 🔑 三個階段(賭徒押完當下就想曬「我賽前就鎖了 X」→ 收據賽前就存在,不用等賽後):
//   · locked   = 還沒開踢 · 賽前鎖定中(0 API · 0 secret · 純讀 JSON · 韌性最強)
//   · live     = 已開賽、還沒對帳 · 終場後自動揭曉(引擎不做 live 比分)
//   · settled  = 已 grade · 命中/落空都釘在這、改不了(原本唯一的狀態)
//
// 結果來源(settled):優先用已 grade 的 locked.finalScore(sync · 無 API);沒 grade 但
//   已開賽就拉 live 賽果窗(getSoccerLedgerResults · Vercel env token)現場算判決 →
//   世界盃比賽一打完今晚就有 settled 收據,不用等 Action 跑。
// 判決一律對「賽前鎖定的那組三向機率」評(守先鎖後結)· 比分走 90 分鐘正規賽(上游已濾延長賽/PK)。
// 收據只在「有賽前鎖定線」時存在:查無鎖定 → null → 頁面 404(沒鎖過的場沒有收據可曬)。
// ─────────────────────────────────────────────────────

import { getLockedSoccerById, kickoffTaipei } from "./locked";
import { getSoccerLedgerResults } from "./football-data";
import { gradeLockedVerdict } from "./predict-core.mjs";
import type { SoccerPick } from "./predictions";

/** 收據階段 · 賽前鎖定中 / 已開賽待對帳 / 已結算。 */
export type SoccerReceiptPhase = "locked" | "live" | "settled";

type SoccerReceiptCommon = {
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
  /** 賽前鎖定時間(台北 MM/DD HH:mm) */
  lockedAtTPE: string;
  /** 開賽時間(台北 MM/DD HH:mm) */
  kickoffTPE: string;
  /** 開賽 UTC ISO(給「本人這手」島做先鎖後結 late-pick 剔除) */
  kickoffISO: string;
};

/** 已結算 · 有真實比分 + 判決。 */
export type SoccerReceiptSettled = SoccerReceiptCommon & {
  phase: "settled";
  /** 90 分鐘終場比分 */
  finalHome: number;
  finalAway: number;
  /** 實際結果(主勝/和/客勝) */
  outcome: SoccerPick;
  verdict: "proved" | "diverged" | "push";
};

/** 還沒結算 · 賽前鎖定中(locked)或已開賽待對帳(live)· 只有引擎鎖定線、沒有結果。 */
export type SoccerReceiptPending = SoccerReceiptCommon & {
  phase: "locked" | "live";
};

export type SoccerReceipt = SoccerReceiptSettled | SoccerReceiptPending;

/**
 * 取一場足球收據資料(fd-*)。 查無鎖定線 → null(沒鎖過的場沒收據)。 有鎖定線就一定有收據:
 *   賽前 = locked 階段(0 API)· 開賽未對帳 = live 階段 · 已 grade / 已有 live 賽果 = settled。
 */
export async function getSoccerReceipt(
  matchId: string,
): Promise<SoccerReceipt | null> {
  if (!matchId.startsWith("fd-")) return null;
  const locked = getLockedSoccerById().get(matchId);
  if (!locked) return null;

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

  const common: SoccerReceiptCommon = {
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
    lockedAtTPE: kickoffTaipei(locked.lockedAt),
    kickoffTPE: kickoffTaipei(locked.kickoffISO),
    kickoffISO: locked.kickoffISO ?? "",
  };

  // 1. 已 grade(locked.json 寫回 finalScore + verdict)→ 直接用(sync · 不打 API)。
  if (
    locked.verdict &&
    locked.finalScore &&
    typeof locked.finalScore.home === "number" &&
    typeof locked.finalScore.away === "number" &&
    (locked.outcome === "home" ||
      locked.outcome === "draw" ||
      locked.outcome === "away")
  ) {
    return {
      ...common,
      phase: "settled",
      finalHome: locked.finalScore.home,
      finalAway: locked.finalScore.away,
      outcome: locked.outcome,
      verdict: locked.verdict,
    };
  }

  // 2. 還沒 grade · 看開賽了沒(時鐘讀在 lib · 收據頁 10 分鐘 ISR · 階段轉換粒度夠用)。
  const ko = Date.parse(locked.kickoffISO ?? "");
  const kickedOff = !Number.isNaN(ko) && Date.now() >= ko;

  if (kickedOff) {
    // 開賽了 → 拉 live 賽果窗現場算判決(剛踢完但 Action 還沒寫回 JSON 也能即時 settled)。
    const results = await getSoccerLedgerResults();
    const r = results.find((x) => x.matchId === matchId);
    if (r) {
      const g = gradeLockedVerdict(
        locked.homeWin,
        locked.draw,
        locked.awayWin,
        r.homeGoals,
        r.awayGoals,
      );
      return {
        ...common,
        phase: "settled",
        finalHome: r.homeGoals,
        finalAway: r.awayGoals,
        outcome: r.outcome,
        verdict: g.verdict,
      };
    }
    // 開賽了、還沒有賽果 → live 待對帳(誠實:不假裝「賽前鎖定中」掛在已開踢的場上)。
    return { ...common, phase: "live" };
  }

  // 3. 還沒開踢 → 賽前鎖定中(0 API · 0 secret · 押完當下就能曬的那張)。
  return { ...common, phase: "locked" };
}
