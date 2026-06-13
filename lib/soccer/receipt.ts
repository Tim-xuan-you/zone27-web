// ── ZONE 27 · 足球單場「戰功收據」資料層 ─────────────────────────────────
// 一場世界盃/聯賽鎖定預測 = 一張賽前鎖死、刪不掉、可截圖外傳的單場收據
// (Topps Now / 戰功碑:你那一手鎖在結果還不存在的時候,賽後攤開命中或落空)。
//
// 🔑 三個階段(賭徒押完當下就想曬「我賽前就鎖了 X」→ 收據賽前就存在,不用等賽後):
//   · locked   = 還沒開踢 · 賽前鎖定中(0 API · 0 secret · 純讀 JSON · 韌性最強)
//   · live     = 已開賽、還沒對帳 · 終場後自動揭曉(引擎不做 live 比分)
//   · settled  = 已 grade · 命中/落空都釘在這、改不了(原本唯一的狀態)
//
// 結果來源(settled):走 resolveLockedSoccer()(engine-settle · on-read 站上即時對帳)——
//   跟「脈動 /pulse」「引擎戰績 /track-record」「per-match segment」用的是同一支解析,故
//   零 drift:同一場比賽,收據顯示 settled 的那一刻,就是脈動顯示 ✓/✕ 的那一刻(不會出現
//   「脈動說對完帳了、收據還掛『待對帳』」的自打臉)。 已持久化(locked.json 寫回 verdict)→
//   原樣用;已踢完未持久化 → 用 live 賽果窗即時評(同 grade script 同源)· 缺 token → graceful。
// 判決一律對「賽前鎖定的那組三向機率」評(守先鎖後結)· 比分走 90 分鐘正規賽(上游已濾延長賽/PK)。
// 收據只在「有賽前鎖定線」時存在:查無鎖定 → null → 頁面 404(沒鎖過的場沒有收據可曬)。
// ─────────────────────────────────────────────────────

import { kickoffTaipei } from "./locked";
import { resolveLockedSoccer } from "./engine-settle";
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
  // on-read 解析(同脈動/引擎戰績)· 已踢完未持久化的場會在這裡即時補上 verdict/finalScore/outcome。
  const locked = (await resolveLockedSoccer()).find((p) => p.matchId === matchId);
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

  // 2. resolveLockedSoccer 已對「已踢完、live 窗有終場」的場即時補了 verdict —— 走到這裡
  //    還沒 settled 的,只剩兩種:還沒開踢(賽前鎖定中)· 或剛踢完但 live 窗暫時沒回終場
  //    (真·短暫待對帳 · 通常 0)。 看開賽了沒分流(時鐘讀在 lib · 收據頁 10 分鐘 ISR · 夠用)。
  const ko = Date.parse(locked.kickoffISO ?? "");
  const kickedOff = !Number.isNaN(ko) && Date.now() >= ko;
  // 開賽了、還沒有賽果 → live 待對帳(誠實:不假裝「賽前鎖定中」掛在已開踢的場上)。
  // 還沒開踢 → 賽前鎖定中(押完當下就能曬的那張)。
  return { ...common, phase: kickedOff ? "live" : "locked" };
}
