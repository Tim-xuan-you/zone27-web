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
import { isBouMarketId, bouLineFromMarketId } from "@/lib/baseball-totals";
import { isSoccerPropMarketId } from "@/lib/soccer/props";
import { OU_LINE, ouResultFromScore, ouSideToPick, isOuMarketId } from "@/lib/soccer/over-under";
import { AH_LINE, ahResultFromScore } from "@/lib/soccer/handicap";
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
  /** 終場比分(棒球得分)· 給大小分玩法卡賽後算大/小 · h2h 卡不需要 · R261 */
  homeScore?: number;
  awayScore?: number;
  /** 玩法(大小分)資訊 · 由 computeTrophies 對「使用者那條線」算出後填 · 缺 = 一般「誰贏」卡 */
  market?: { label: string; pickName: string; outcomeLabel: string };
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
      // 終場得分 → 給大小分玩法卡賽後算大/小(同 baseballPropIdMatches 的線結算)。
      homeScore: m.finalResult?.homeScore,
      awayScore: m.finalResult?.awayScore,
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
      // 終場進球 → 給足球大小分/讓分玩法卡賽後算(同棒球得分)。 R262
      homeScore: r.homeGoals,
      awayScore: r.awayGoals,
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
  soccerProps: SoccerPickRow[] = [],
): Trophy[] {
  const byId = new Map(settled.map((c) => [c.id, c]));
  const out: Trophy[] = [];

  for (const [matchId, entry] of Object.entries(baseball)) {
    const pick = entry.pick;
    if (pick !== "home" && pick !== "away") continue; // 棒球只認 home/away

    // ── 大小分玩法(~bou)· R261:解父場卡 + 凍在場號的線 → 賽後算大/小 → 一張玩法戰功卡。 ──
    //   父場卡帶終場得分(homeScore/awayScore)· 看大=home / 看小=away(同 bouSideToPick)。
    if (isBouMarketId(matchId)) {
      const parent = byId.get(matchId.split("~")[0]);
      const line = bouLineFromMarketId(matchId);
      if (
        !parent ||
        line === null ||
        typeof parent.homeScore !== "number" ||
        typeof parent.awayScore !== "number"
      ) {
        continue;
      }
      if (isLatePick(entry.ts, parent.startISO)) continue;
      const total = parent.homeScore + parent.awayScore;
      const overWon = total > line;
      const hit = pick === (overWon ? "home" : "away");
      out.push({
        card: {
          ...parent,
          id: matchId, // 玩法場號 = 唯一 key(父場卡 id 是誰贏場,不能撞)
          market: {
            label: "大小分",
            pickName: `${pick === "home" ? "看大" : "看小"} ${line}`,
            outcomeLabel: `收${overWon ? "大" : "小"} · 總分 ${total}`,
          },
        },
        pick,
        ts: entry.ts,
        hit,
        upset: false, // 玩法的「逆風」需引擎那條線 · 收件匣已標 · 圖卡先不誤標
      });
      continue;
    }

    // ── 一般「誰贏」(h2h)──
    const card = byId.get(matchId);
    if (!card) continue;
    if (isLatePick(entry.ts, card.startISO)) continue;
    const hit = pick === card.result;
    out.push({
      card,
      pick,
      ts: entry.ts,
      hit,
      upset: hit && card.engineFav !== null && pick !== card.engineFav,
    });
  }

  // 同一場只取一張卡:棒球側 getPredictionsByCode/getMyPredictionsClient 已去重(一場一 key)·
  // 足球 picks 是陣列、若 DB「一場一押」唯一約束某天失守會出現同 matchId 兩列 → 這裡用 seen 去重
  // (RPC 已 created_at desc → first-seen 即最新)· 防 TrophyGrid 重複 React key。 世界盃今晚足球首次大量寫入。
  const seenSoccer = new Set<string>();
  for (const row of soccer) {
    if (seenSoccer.has(row.matchId)) continue;
    seenSoccer.add(row.matchId);
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

  // ── 足球玩法(大小分 ~ou25 / 讓分 ~ah05)· R262:同棒球大小分 → 一張玩法戰功卡(固定線 2.5 / 0.5)。 ──
  const seenSoccerProp = new Set<string>();
  for (const row of soccerProps) {
    if (seenSoccerProp.has(row.matchId)) continue;
    seenSoccerProp.add(row.matchId);
    if (!isSoccerPropMarketId(row.matchId)) continue;
    if (row.pick !== "home" && row.pick !== "away") continue;
    const parent = byId.get(row.matchId.split("~")[0]);
    if (
      !parent ||
      typeof parent.homeScore !== "number" ||
      typeof parent.awayScore !== "number"
    ) {
      continue;
    }
    const t = Date.parse(row.ts);
    const k = Date.parse(parent.startISO);
    if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) continue; // 先鎖後結 late 剔除
    const isOu = isOuMarketId(row.matchId);
    let result: "home" | "away";
    let pickName: string;
    let outcomeLabel: string;
    if (isOu) {
      result = ouSideToPick(ouResultFromScore(parent.homeScore, parent.awayScore));
      pickName = `${row.pick === "home" ? "看大" : "看小"} ${OU_LINE}`;
      outcomeLabel = `收${result === "home" ? "大" : "小"} · 共 ${parent.homeScore + parent.awayScore} 球`;
    } else {
      result = ahResultFromScore(parent.homeScore, parent.awayScore);
      pickName =
        row.pick === "home" ? `${parent.home} −${AH_LINE}` : `${parent.away} +${AH_LINE}`;
      outcomeLabel = `${result === "home" ? parent.home : parent.away} 收讓分`;
    }
    out.push({
      card: {
        ...parent,
        id: row.matchId,
        market: { label: isOu ? "大小分" : "讓分", pickName, outcomeLabel },
      },
      pick: row.pick,
      ts: row.ts,
      hit: row.pick === result,
      upset: false,
    });
  }

  // 最近結算的排前面(賽事日新→舊)
  out.sort((a, b) => (b.card.startISO || "").localeCompare(a.card.startISO || ""));
  return out;
}
