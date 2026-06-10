// ── ZONE 27 · 戰功卡(共用邏輯)─────────────────────────────────────────
// 一場已結算的 call = 一張刪不掉的戰功卡。 兩處共用同一套算法 + 同一張卡:
//   · /member/collection(本人 · client session 端讀自己 picks)
//   · /u/[code](公開檔案 · server 端從 0019 RPC 讀那個碼的 picks)
// 純資料整形(0 I/O 在 computeTrophies)· buildSettledCards 只讀 bundled 靜態檔(0 API)。
//
// 🔴 紅線:含輸照收(✓✕同重量)· 收自己 call 非球員 · 只讀展示物非 NFT · 先鎖後結
//   late-pick 剔除 ·「逆風」= 押了引擎沒看好邊卻對了(贏過機器=眼光,非連勝)。
// ─────────────────────────────────────────────────────

import {
  getFinalizedMatches,
  getMatchStartIso,
  getEngineFavorite,
} from "@/lib/matches";
import { getMlbLockedMatches } from "@/lib/mlb-matches";
import { getSoccerFinalizedResults, getLockedSoccerById } from "@/lib/soccer/locked";
import { getTeamCrest } from "@/lib/identity";
import { getNationalCode } from "@/lib/soccer/teams";
import { isLatePick, type UserPredictionsMap } from "@/lib/predictions";
import type { SoccerPickRow } from "@/lib/soccer/predictions";

export type SettledCard = {
  /** matchId(cpbl-* / mlb-* / fd-*)· 連到既有 /receipts/[receiptId] */
  id: string;
  sport: "baseball" | "soccer";
  /** 聯賽 / 賽事顯示標(CPBL / MLB / 世界盃) */
  tag: string;
  home: string;
  away: string;
  homeGlyph?: string;
  homeColor?: string;
  awayGlyph?: string;
  awayColor?: string;
  /** 賽後真實結果 · 棒球 home/away/tie · 足球 home/draw/away */
  result: "home" | "away" | "draw" | "tie";
  /** 開賽 ISO · 先鎖後結 late-pick 剔除 */
  startISO: string;
  /** 賽事日(台北 MM/DD) */
  dateLabel: string;
  /** 引擎當初看好邊 · 給「逆風」徽章 */
  engineFav: "home" | "away" | "draw" | null;
};

export type Trophy = {
  card: SettledCard;
  pick: "home" | "away" | "draw";
  ts: string;
  hit: boolean;
  /** 贏過引擎:押了引擎沒看好邊且命中 */
  upset: boolean;
};

// UTC ISO → 台北 MM/DD(deterministic UTC+8)。
function taipeiMMDD(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const d = new Date(t + 8 * 3600 * 1000);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** ISO 鎖定時戳 → 「6月12日 03:00」(台北 · deterministic timeZone)。 */
export function fmtLockTaipei(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  try {
    return new Intl.DateTimeFormat("zh-Hant", {
      timeZone: "Asia/Taipei",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(t));
  } catch {
    return "";
  }
}

/**
 * 所有「已結算賽事」的展示資訊(永久來源 · 0 API · CPBL + MLB + 足球)。
 * 含名字 / 隊徽 / 結果 / 引擎看好邊 —— 給戰功卡配對顯示。
 */
export function buildSettledCards(): SettledCard[] {
  const out: SettledCard[] = [];

  // 棒球(CPBL 已結算 + MLB 永久鎖定已結算)
  const baseball = [
    ...getFinalizedMatches(),
    ...getMlbLockedMatches().filter((m) => m.finalResult),
  ];
  for (const m of baseball) {
    const winner = m.finalResult?.winner;
    if (winner !== "home" && winner !== "away" && winner !== "tie") continue;
    const hc = getTeamCrest(m.home.name, m.home.en, m.league);
    const ac = getTeamCrest(m.away.name, m.away.en, m.league);
    const startISO = getMatchStartIso(m) ?? "";
    out.push({
      id: m.id,
      sport: "baseball",
      tag: m.league,
      home: m.home.name,
      away: m.away.name,
      homeGlyph: hc?.glyph,
      homeColor: hc?.color,
      awayGlyph: ac?.glyph,
      awayColor: ac?.color,
      result: winner,
      startISO,
      dateLabel: taipeiMMDD(startISO),
      engineFav: getEngineFavorite(m),
    });
  }

  // 足球(永久鎖定結算 · 讀 bundled locked.json · 0 API · 不依賴 secret)
  const lockedById = getLockedSoccerById();
  for (const r of getSoccerFinalizedResults()) {
    const lk = lockedById.get(r.matchId);
    if (!lk) continue;
    out.push({
      id: r.matchId,
      sport: "soccer",
      tag: lk.competitionName,
      home: lk.home,
      away: lk.away,
      homeGlyph: getNationalCode(lk.homeSeed) ?? undefined,
      awayGlyph: getNationalCode(lk.awaySeed) ?? undefined,
      result: r.outcome,
      startISO: r.kickoffISO,
      dateLabel: taipeiMMDD(r.kickoffISO),
      engineFav: lk.enginePick,
    });
  }

  return out;
}

/**
 * 把一份 picks(棒球 map + 足球陣列)對 settled 賽事配對成戰功卡。
 * 只收「已結算 + 賽前鎖定(非 late-pick)」的場 · 含輸照收。 deterministic · 純函式。
 */
export function computeTrophies(
  baseball: UserPredictionsMap,
  soccer: SoccerPickRow[],
  settled: SettledCard[],
): Trophy[] {
  const byId = new Map(settled.map((c) => [c.id, c]));
  const out: Trophy[] = [];

  for (const [matchId, entry] of Object.entries(baseball)) {
    const card = byId.get(matchId);
    if (!card) continue;
    if (isLatePick(entry.ts, card.startISO)) continue;
    const pick = entry.pick;
    if (pick !== "home" && pick !== "away") continue; // 棒球只認 home/away
    const hit = pick === card.result;
    out.push({
      card,
      pick,
      ts: entry.ts,
      hit,
      upset: hit && card.engineFav !== null && pick !== card.engineFav,
    });
  }

  for (const row of soccer) {
    const card = byId.get(row.matchId);
    if (!card) continue;
    const t = Date.parse(row.ts);
    const k = Date.parse(card.startISO);
    if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) continue; // late-pick 剔除
    const hit = row.pick === card.result;
    out.push({
      card,
      pick: row.pick,
      ts: row.ts,
      hit,
      upset: hit && card.engineFav !== null && row.pick !== card.engineFav,
    });
  }

  // 最近結算的排前面(賽事日新→舊)
  out.sort((a, b) => (b.card.startISO || "").localeCompare(a.card.startISO || ""));
  return out;
}
