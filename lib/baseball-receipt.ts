// ── ZONE 27 · 棒球(CPBL)賽前可外傳收據 資料層 ───────────────────────────
// 鏡足球 R215(lib/soccer/receipt.ts):一場 CPBL 鎖定預測 = 一張賽前鎖死、
// 刪不掉、押完當下就能截圖外傳的單場收據。 收據不再只活在賽後(原本 /receipts/[id]
// 只在 finalResult 才存在 · 賽前一律 404)。
//
// 🔑 兩個賽前階段(賽後的「已結算」由 /receipts 頁原本那條路徑處理,本檔不碰):
//   · locked = 還沒開賽 · 賽前鎖定中(押完當下就能外傳的那張)
//   · live   = 已開賽、還沒對帳(誠實:不在已開打的場掛「還沒開賽」)
//
// 🔴 與足球的關鍵差異 —— 鎖定時戳的誠實:
//   足球的線是 GitHub Action 自動鎖進 soccer-locked.json,有精確的 lockedAt 時戳。
//   棒球的引擎線(winRate + aiConfidence)是 Tim 親手 curate、commit 進 lib/matches.ts ——
//   「鎖定」= 那一筆 git commit,鎖定證明是公開的 GitHub 提交紀錄,沒有逐場的精確時戳欄位。
//   所以這張收據**絕不捏造「鎖定於 HH:MM」**;只誠實標「開賽時間」當對帳死線 + 指向公開
//   GitHub 紀錄當鎖定證明(跟賽後那張收據頁的措辭一致)。 這比足球更保守、不假裝精確。
//
// 範圍:只認 CPBL(matchId 以 "cpbl-" 開頭 · 3 段式 ref)。 MLB 賽前收據需 getMlbMatchById,
//   暫緩(deriveReferenceNumber 對非 cpbl 走 fallback、且 MLB 賽程資料模型不同)。
//   延賽(postponed)→ null(沒打的比賽不發賽前收據)· 已結算(finalResult)→ null(交回原路徑)。
// ─────────────────────────────────────────────────────

import {
  getMatchById,
  getMatchDateIso,
  getMatchStartIso,
  getEngineFavorite,
  matchHasStarted,
  type Match,
} from "@/lib/matches";

/** 收據階段 · 賽前鎖定中 / 已開賽待對帳。 已結算不在此檔(走 /receipts 原本的賽後路徑)。 */
export type BaseballReceiptPhase = "locked" | "live";

export type BaseballReceiptPending = {
  matchId: string;
  /** Patek 式參考編號 · Z27 · CPBL · YYMMDD · NN(與賽後那張收據同源、同字串) */
  ref: string;
  league: string;
  homeName: string;
  homeEn: string;
  awayName: string;
  awayEn: string;
  venue: string;
  /** 引擎開盤偏好哪一邊 · null = 五五波無偏好(不硬塞一邊 · 對齊 getEngineFavorite) */
  favorite: "home" | "away" | null;
  /** 引擎看好那邊的顯示名 · favorite=null 時為 null */
  favoriteName: string | null;
  /** 引擎看好那邊的勝率 %(favorite=null 時 = 兩邊相同那個值) */
  favoritePct: number;
  /** favorite 是不是主隊(顯示用:看好邊放主/客的英文短名) */
  homeFavored: boolean;
  homeWinRate: number;
  awayWinRate: number;
  aiConfidence: number;
  /** 比賽日 ISO(YYYY-MM-DD)· 解析不出 → "—" */
  dateIso: string;
  /** 開賽顯示("06/11 · 18:35" 台北牆鐘 · startTime 本就是台北時間) */
  startDisplay: string;
  /** 開賽 instant ISO(+08:00)· 給「本人這手」島做先鎖後結 late-pick 剔除 · null 可缺 */
  startISO: string | null;
  phase: BaseballReceiptPhase;
};

/**
 * Patek 式參考編號 · Z27 · {LEAGUE} · {YYMMDD} · {NN}(cpbl-YYMMDD-NN 3 段式才套);
 * 其餘聯賽 / 非標準 id 退 fallback「Z27 · {LEAGUE} · {matchId}」。 從 /receipts page.tsx
 * 抽出共用 —— 保證同一場的「賽前」與「賽後」收據顯示**完全相同**的參考編號(信任:外傳給
 * 別人的那串 Z27 編號賽前賽後不變)。 不藏 / 不假裝:reference 就是 match.id 加 Z27 前綴。
 */
export function deriveReferenceNumber(matchId: string, league: string): string {
  const parts = matchId.split("-");
  if (parts.length === 3 && parts[0] === "cpbl") {
    const date = parts[1];
    const seq = parts[2];
    return `Z27 · ${league.toUpperCase()} · ${date} · ${seq}`;
  }
  return `Z27 · ${league.toUpperCase()} · ${matchId}`;
}

/** "2026-06-11" + "18:35" → "06/11 · 18:35"(都是台北牆鐘 · 不做時區換算)。 */
function formatStartDisplay(dateIso: string | null, startTime: string): string {
  const t = /^\d{1,2}:\d{2}$/.test(startTime) ? startTime : "";
  if (!dateIso) return t || "—";
  // dateIso = YYYY-MM-DD
  const mmdd = `${dateIso.slice(5, 7)}/${dateIso.slice(8, 10)}`;
  return t ? `${mmdd} · ${t}` : mmdd;
}

/**
 * 取一場 CPBL 賽前/進行中收據資料。 查無 / 非 CPBL / 已結算 / 延賽 → null
 * (沒有可外傳的賽前收據,頁面 404 維持原行為)。
 */
export function getBaseballPendingReceipt(
  matchId: string,
): BaseballReceiptPending | null {
  // MLB 等其他聯賽暫緩(ref 走 fallback、資料模型不同)· 只認 CPBL。
  if (!matchId.startsWith("cpbl-")) return null;
  const match: Match | undefined = getMatchById(matchId);
  if (!match) return null;
  // 已結算 → 交回 /receipts 原本的賽後路徑(本檔不重複渲染已結算)。
  if (match.finalResult) return null;
  // 延賽(雨備等)→ 沒打的比賽不發賽前收據(誠實:不掛「賽前鎖定中 · 等開賽」在已宣布延賽的場)。
  if (match.postponed) return null;

  const startISO = getMatchStartIso(match);
  // 開賽了沒(收據頁 ISR 10 分鐘 · 階段轉換粒度夠用 · 同足球)。 開賽 = live 待對帳 · 否則 locked。
  const phase: BaseballReceiptPhase = matchHasStarted(startISO) ? "live" : "locked";

  const favorite = getEngineFavorite(match); // "home" | "away" | null(五五波)
  const homeFavored = favorite === "home";
  const favoriteName =
    favorite === "home"
      ? match.home.name
      : favorite === "away"
        ? match.away.name
        : null;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);
  const dateIso = getMatchDateIso(match) ?? "—";

  return {
    matchId,
    ref: deriveReferenceNumber(match.id, match.league),
    league: match.league,
    homeName: match.home.name,
    homeEn: match.home.en,
    awayName: match.away.name,
    awayEn: match.away.en,
    venue: match.venue,
    favorite,
    favoriteName,
    favoritePct,
    homeFavored,
    homeWinRate: match.home.winRate,
    awayWinRate: match.away.winRate,
    aiConfidence: match.aiConfidence,
    dateIso,
    startDisplay: formatStartDisplay(dateIso === "—" ? null : dateIso, match.startTime),
    startISO,
    phase,
  };
}
