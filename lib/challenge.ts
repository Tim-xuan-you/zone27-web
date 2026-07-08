import { cache } from "react";
import type { Match } from "@/lib/matches";
import {
  getMatchById,
  getMatchStartIso,
  matchHasStarted,
  getEngineFavorite,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import {
  getTennisMatch,
  drawLine as tennisDrawLine,
  matchStartISO as tennisStartISO,
} from "@/lib/tennis/matches";
import {
  getBadmintonMatch,
  drawLine as badmintonDrawLine,
  matchStartISO as badmintonStartISO,
} from "@/lib/badminton/matches";
import {
  getMmaFight,
  drawLine as mmaDrawLine,
  matchStartISO as mmaStartISO,
} from "@/lib/mma/matches";
import {
  getBasketballGame,
  drawLine as basketballDrawLine,
  matchStartISO as basketballStartISO,
} from "@/lib/basketball/matches";
import { resolveLockedSoccer } from "@/lib/soccer/engine-settle";
import type { LockedSoccerPrediction } from "@/lib/soccer/locked";
import { getClubZh } from "@/lib/soccer/club-names";
import { DUEL_SPORT_LABEL, type DuelSport } from "@/lib/daily-duel";
import {
  getProfileByCode,
  getPredictionsByCode,
  type PublicProfile,
} from "@/lib/profile-server";

// ── ZONE 27 · 戰帖對決 · resolve(server · 單一真相 · 給 /vs 頁 + OG 卡共用)──────────
// 散播命門(2026-06-28 · 真瓶頸是散播不是功能):站上每張「可外傳收據」都是廣播(看我的牌)·
// 廣播只換來一句「讚」就死。 缺的是把分享變成「逼對方回手的戰帖」。 解 = 把今日一戰變一張
// 你會『想』傳給朋友的戰帖:Tim 鎖完一手 → 傳 /vs/<他的碼> → 朋友點開看不到他押誰、得先
// 自己盲押一手、賽後才揭盅誰讀得準。 散播(戰帖是天然的、不像垃圾訊息的邀請)+ 留存(盲押→
// 揭盅→賽後對帳)一個機制全解 · 零紅線(盲押結構上防跟單)· 零 migration(用現成公開 RPC join 同場)。
//
// 這支只做一件事:給一個永久碼,算出「他最近一張還能應戰的戰帖」· /vs 頁與 OG 卡都讀這支
// = 卡片跟頁面永遠同一場(防 DRY 漂移)。
//
// R294 · 六運動版(原 v1 = 棒球型 · 跟今日一戰 R293 同步擴):六運動的押注都能變戰帖。
//   pick 一律用 stored 空間(home/away/draw · a/b 運動已按 A=home/B=away 存)· 名字映射
//   在 model 裡(homeName/awayName)· 賽果語意:棒球平手 / MMA 和局 = push(不計任何一方)·
//   足球和局 = 真第三結果(draw · 押和局算命中)。
// ─────────────────────────────────────────────────────

export type ChallengePhase = "pregame" | "live" | "settled";

/** stored-pick 空間(共享 predictions 表的實際存值)。 */
export type StoredPick = "home" | "away" | "draw";

export type ChallengeMatchModel = {
  sport: DuelSport;
  /** 白話運動別(棒球 / 足球 / 網球 / 羽球 / 格鬥 / 籃球) */
  sportLabel: string;
  id: string;
  /** 聯盟 / 賽事名(CPBL · 世界盃 · 溫網 · UFC …) */
  league: string;
  startISO: string | null;
  /** stored-pick 空間的名字(a/b 運動:home = A、away = B · 同存表規則) */
  homeName: string;
  awayName: string;
  /** Avatar seed(足球/籃球用英文原名 · 顏色穩定;其餘 = 顯示名) */
  homeSeed: string;
  awaySeed: string;
  /** 英文名(MLB 隊徽縮寫用 · 其餘 undefined) */
  homeEn?: string;
  awayEn?: string;
  /** 對決卡顯示順序(籃球客先 · 其餘 home/a 先) */
  leftIsHome: boolean;
  /** 機器已鎖的一手(有選邊才有 · 50/50 不裝有) */
  engine: { name: string; pct: number } | null;
  /** 棒球給 CardBetStrip 的主隊勝率(其餘運動的下注元件不吃引擎線) */
  engineHomePct: number | null;
  /** 足球三向真實線(顯示用 · 其餘 null) */
  soccerPcts: { homeWin: number; draw: number; awayWin: number } | null;
  /** 賽果(stored 空間)· "push" = 棒球平手 / MMA 和局(不計任何一方)· null = 未結算 */
  winner: StoredPick | "push" | null;
};

export type ChallengeResolution = {
  /** 下戰帖的人(公開身分 · 永久碼 · tier 金環)· 一定有(查無碼 → 整支回 null = 404)。 */
  profile: PublicProfile;
  /** 應戰的那一場(解析得到才有)· null = 他還沒下任何一手可應戰的。 */
  match: ChallengeMatchModel | null;
  /** 下戰帖的人在這場押的一手(賽前對訪客封盤 · 揭盅才顯)· match 為 null 時也 null。 */
  challengerPick: StoredPick | null;
  /** 這場現在的階段(賽前可應戰 / 已開賽封盤 / 已賽後對帳)· match 為 null 時也 null。 */
  phase: ChallengePhase | null;
};

function phaseOf(m: ChallengeMatchModel): ChallengePhase {
  if (m.winner !== null) return "settled"; // 結算優先(手動賽果永遠先 · 同全站口徑)
  if (matchHasStarted(m.startISO)) return "live"; // 已開賽 · 封盤
  return "pregame"; // 賽前 · 還能應戰
}

// 用 id 解析成跨運動統一 model · 認不出 / 資料掉出窗 → null(該手不進戰帖池)。
// 🔴 MLB / 足球一律用「載一次的 map」查(caller 建)—— 逐注各自打 getMlbAsMatches /
//   resolveLockedSoccer 會把一個人的整本帳變成 N 輪 live API 掃描(實測 /vs 60 秒 · R294 修)。
function resolveModel(
  matchId: string,
  mlbById: Map<string, Match> | null,
  soccerById: Map<string, LockedSoccerPrediction> | null,
): ChallengeMatchModel | null {
  if (matchId.startsWith("cpbl-") || matchId.startsWith("mlb-")) {
    const m = matchId.startsWith("cpbl-")
      ? (getMatchById(matchId) ?? null)
      : (mlbById?.get(matchId) ?? null);
    if (!m) return null;
    const fav = getEngineFavorite(m);
    const w = m.finalResult?.winner ?? null;
    return {
      sport: "baseball",
      sportLabel: DUEL_SPORT_LABEL.baseball,
      id: matchId,
      league: m.league,
      startISO: getMatchStartIso(m),
      homeName: m.home.name,
      awayName: m.away.name,
      homeSeed: m.home.name,
      awaySeed: m.away.name,
      homeEn: m.home.en,
      awayEn: m.away.en,
      leftIsHome: true,
      engine: fav ? { name: m[fav].name, pct: m[fav].winRate } : null,
      engineHomePct: m.home.winRate,
      soccerPcts: null,
      winner: w === "tie" ? "push" : w,
    };
  }
  if (matchId.startsWith("fd-")) {
    const p = soccerById?.get(matchId);
    if (!p) return null;
    const homeName = getClubZh(p.home) ?? p.home;
    const awayName = getClubZh(p.away) ?? p.away;
    const engine =
      p.enginePick === "home"
        ? { name: homeName, pct: p.homeWinPct }
        : p.enginePick === "away"
          ? { name: awayName, pct: p.awayWinPct }
          : { name: "和局", pct: p.drawPct };
    const winner =
      p.verdict !== null &&
      (p.outcome === "home" || p.outcome === "draw" || p.outcome === "away")
        ? p.outcome
        : null;
    return {
      sport: "soccer",
      sportLabel: DUEL_SPORT_LABEL.soccer,
      id: matchId,
      league: p.competitionName,
      startISO: p.kickoffISO ?? null,
      homeName,
      awayName,
      homeSeed: p.homeSeed,
      awaySeed: p.awaySeed,
      leftIsHome: true,
      engine,
      engineHomePct: null,
      soccerPcts: { homeWin: p.homeWinPct, draw: p.drawPct, awayWin: p.awayWinPct },
      winner,
    };
  }
  if (matchId.startsWith("tn-")) {
    const m = getTennisMatch(matchId);
    if (!m) return null;
    const line = tennisDrawLine(m);
    return {
      sport: "tennis",
      sportLabel: DUEL_SPORT_LABEL.tennis,
      id: matchId,
      league: m.tournament,
      startISO: tennisStartISO(m),
      homeName: m.a.zh,
      awayName: m.b.zh,
      homeSeed: m.a.zh,
      awaySeed: m.b.zh,
      leftIsHome: true,
      engine: line
        ? line.pick === "a"
          ? { name: m.a.zh, pct: line.aWin }
          : { name: m.b.zh, pct: line.bWin }
        : null,
      engineHomePct: null,
      soccerPcts: null,
      winner: m.finalResult
        ? m.finalResult.winner === "a"
          ? "home"
          : "away"
        : null,
    };
  }
  if (matchId.startsWith("bd-")) {
    const m = getBadmintonMatch(matchId);
    if (!m) return null;
    const line = badmintonDrawLine(m);
    return {
      sport: "badminton",
      sportLabel: DUEL_SPORT_LABEL.badminton,
      id: matchId,
      league: m.tournament,
      startISO: badmintonStartISO(m),
      homeName: m.a.zh,
      awayName: m.b.zh,
      homeSeed: m.a.zh,
      awaySeed: m.b.zh,
      leftIsHome: true,
      engine: line
        ? line.pick === "a"
          ? { name: m.a.zh, pct: line.aWin }
          : { name: m.b.zh, pct: line.bWin }
        : null,
      engineHomePct: null,
      soccerPcts: null,
      winner: m.finalResult
        ? m.finalResult.winner === "a"
          ? "home"
          : "away"
        : null,
    };
  }
  if (matchId.startsWith("mma-")) {
    const m = getMmaFight(matchId);
    if (!m) return null;
    const line = mmaDrawLine(m);
    const fr = m.finalResult;
    return {
      sport: "mma",
      sportLabel: DUEL_SPORT_LABEL.mma,
      id: matchId,
      league: m.event,
      startISO: mmaStartISO(m),
      homeName: m.a.zh,
      awayName: m.b.zh,
      homeSeed: m.a.zh,
      awaySeed: m.b.zh,
      leftIsHome: true,
      engine:
        line && line.pick !== null
          ? line.pick === "a"
            ? { name: m.a.zh, pct: line.aWin }
            : { name: m.b.zh, pct: line.bWin }
          : null,
      engineHomePct: null,
      soccerPcts: null,
      // 🔴 MMA 和局 / 無效比賽 = push(同棒球平手 · 不計任何一方)。
      winner: fr ? (fr.draw ? "push" : fr.winner === "a" ? "home" : "away") : null,
    };
  }
  if (matchId.startsWith("bk-")) {
    const g = getBasketballGame(matchId);
    if (!g) return null;
    const line = basketballDrawLine(g);
    return {
      sport: "basketball",
      sportLabel: DUEL_SPORT_LABEL.basketball,
      id: matchId,
      league: g.league,
      startISO: basketballStartISO(g),
      homeName: g.home.zh,
      awayName: g.away.zh,
      homeSeed: g.home.en,
      awaySeed: g.away.en,
      leftIsHome: false, // 籃球慣例:客在前(同看板卡 + 下注鈕順序)
      engine: line
        ? line.pick === "home"
          ? { name: g.home.zh, pct: line.homeWin }
          : { name: g.away.zh, pct: line.awayWin }
        : null,
      engineHomePct: null,
      soccerPcts: null,
      winner: g.finalResult?.winner ?? null, // 籃球無和局 · outcome 本來就是 home/away
    };
  }
  return null; // 認不出的前綴(群眾盤 mkt- 等)不進戰帖池
}

/**
 * 用永久碼算出他「最近一張還能應戰的戰帖」。
 * 查無碼 → null(頁面 404)。 有碼但沒可應戰的手 → match=null(頁面顯示誠實空狀態)。
 *
 * 選場規則:① 指定 ?m=(且他真的押過)優先 ② 否則挑「賽前(可應戰)裡最近鎖的一手」
 * ③ 都已開賽/結算 → 挑最近鎖的一手(當「過去的對決」秀賽果)。
 *
 * React cache():generateMetadata 跟 page body 同一次 render 各叫一次 —— 不包 = 每個
 * /vs 訪問付兩輪 Supabase RPC + 兩輪 MLB/足球 map 重建(同 lib/ladder-rows 先例 · R294)。
 */
export const resolveChallenge = cache(async function resolveChallengeImpl(
  code: string,
  matchIdOverride?: string | null,
): Promise<ChallengeResolution | null> {
  const profile = await getProfileByCode(code);
  if (!profile) return null;

  const empty: ChallengeResolution = {
    profile,
    match: null,
    challengerPick: null,
    phase: null,
  };

  // 六運動的「誰贏」押注全進戰帖池(玩法 ~ 不進:戰帖比的是同一場誰讀得準)·
  // pick 統一收斂到 stored 空間(a/b 運動的桶已轉回 a/b → 這裡轉回存表值)。
  const buckets = await getPredictionsByCode(code);
  const entries: { id: string; pick: StoredPick; ts: string }[] = [];
  for (const [id, v] of Object.entries(buckets.baseball)) {
    if (id.includes("~")) continue;
    if (v.pick === "home" || v.pick === "away")
      entries.push({ id, pick: v.pick, ts: v.ts });
  }
  for (const r of buckets.soccer)
    entries.push({ id: r.matchId, pick: r.pick, ts: r.ts });
  for (const r of buckets.tennis)
    entries.push({ id: r.matchId, pick: r.pick === "a" ? "home" : "away", ts: r.ts });
  for (const r of buckets.badminton)
    entries.push({ id: r.matchId, pick: r.pick === "a" ? "home" : "away", ts: r.ts });
  for (const r of buckets.mma)
    entries.push({ id: r.matchId, pick: r.pick === "a" ? "home" : "away", ts: r.ts });
  for (const r of buckets.basketball)
    entries.push({ id: r.matchId, pick: r.pick, ts: r.ts });
  if (entries.length === 0) return empty;

  // MLB / 足球各載「一次」建 map(live 窗 + locked 永久源;live 優先)—— 絕不逐注打 API。
  let mlbById: Map<string, Match> | null = null;
  if (entries.some((e) => e.id.startsWith("mlb-"))) {
    try {
      mlbById = new Map<string, Match>();
      for (const m of getMlbLockedMatches()) mlbById.set(m.id, m);
      for (const m of await getMlbAsMatches()) mlbById.set(m.id, m); // live 窗優先(後蓋)
    } catch {
      mlbById = new Map(); // MLB 讀壞 → 該手解析不到 · 其餘運動照常(graceful)
    }
  }
  let soccerById: Map<string, LockedSoccerPrediction> | null = null;
  if (entries.some((e) => e.id.startsWith("fd-"))) {
    try {
      soccerById = new Map(
        (await resolveLockedSoccer()).map((p) => [p.matchId, p] as const),
      );
    } catch {
      soccerById = new Map(); // 足球讀壞 → 該手解析不到 · 其餘運動照常(graceful)
    }
  }

  // 解析成統一 model(全 map 查 · 純同步)· 解不到的(資料過舊掉出窗等)丟棄。
  const resolved = entries.flatMap((e) => {
    const model = resolveModel(e.id, mlbById, soccerById);
    return model ? [{ ...e, model }] : [];
  });
  if (resolved.length === 0) return empty;

  // ① 指定 ?m=(且他真的押過該場)優先 —— 讓「就比這場」的精準戰帖連結成立。
  let chosen = matchIdOverride
    ? (resolved.find((r) => r.id === matchIdOverride) ?? null)
    : null;
  // ② 否則挑賽前(可應戰)裡最近鎖的;③ 沒有賽前的 → 全部裡最近鎖的(秀賽果)。
  if (!chosen) {
    const pregame = resolved.filter((r) => phaseOf(r.model) === "pregame");
    const pool = pregame.length > 0 ? pregame : resolved;
    chosen = pool.reduce((a, b) => (a.ts >= b.ts ? a : b));
  }

  return {
    profile,
    match: chosen.model,
    challengerPick: chosen.pick,
    phase: phaseOf(chosen.model),
  };
});
