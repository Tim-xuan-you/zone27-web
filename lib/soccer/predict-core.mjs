// ── ZONE 27 · 足球「開盤管線」共用核心(站上 .ts 與賽前鎖定 script 同源 · 零 drift)──
// getCompetitionPredictions(football-data.ts)裡「拿到比賽資料 → 算實力分 → 開盤」那段
// 純邏輯抽到這裡。 站上(live 重算)與 lock script(賽前鎖定)都 import 這支 = 兩邊跑的
// 是「字面上同一段程式」→ 鎖進 JSON 的數字 == 站上顯示的數字(誠信命門)。
//
// 本檔只做純計算 + 純資料整形(0 fetch · 0 Next API · 0 副作用)。 抓資料(Next ISR
// fetch / Node fetch)各自在呼叫端做,把整形後的陣列餵進來。
// ─────────────────────────────────────────────────────

import { predictSoccer } from "./engine-core.mjs";
import { buildRatings, getRating, gameCounts, MIN_GAMES_FOR_RATING } from "./elo-core.mjs";
import { getRatingByName, SOCCER_RATING_BASELINE } from "./teams-data.mjs";

// 世界盃地主(在自己國家踢 = 真主場)· 對齊 football-data.org 的 team.name 寫法。
const WC_HOSTS = new Set(["united states", "mexico", "canada"]);

/** football-data 隊物件 → Elo/seed key(英文原名 · shortName 優先)。 跟站上完全一致。
 * @param {{ name?:string, shortName?:string, tla?:string } | undefined} t @returns {string} */
export function teamSeed(t) {
  return (t && (t.shortName || t.tla || t.name)) || "?";
}

/**
 * football-data 的一場 raw match → 排程輸入(賽程 · 給開盤)。
 * @param {{ id?:number, utcDate?:string, status?:string, homeTeam?:object, awayTeam?:object }} m
 */
export function toScheduledInput(m) {
  const homeSeed = teamSeed(m.homeTeam);
  const awaySeed = teamSeed(m.awayTeam);
  return {
    id: `fd-${m.id ?? `${homeSeed}-${awaySeed}`}`,
    dateISO: m.utcDate ?? "",
    status: m.status ?? "",
    // 國家隊用 full name 查 seed 實力分 + 判地主(跟站上一致)。
    homeName: m.homeTeam?.name ?? "",
    awayName: m.awayTeam?.name ?? "",
    homeSeed,
    awaySeed,
  };
}

/**
 * football-data 的一場已結束 raw match → Elo 戰績輸入(key 用 seed)。 無比分回 null。
 * @param {{ homeTeam?:object, awayTeam?:object, score?:{ fullTime?:{ home?:number|null, away?:number|null } } }} m
 * @returns {{ home:string, away:string, homeGoals:number, awayGoals:number } | null}
 */
export function toResultInput(m) {
  const hg = m.score?.fullTime?.home;
  const ag = m.score?.fullTime?.away;
  if (typeof hg !== "number" || typeof ag !== "number") return null;
  return { home: teamSeed(m.homeTeam), away: teamSeed(m.awayTeam), homeGoals: hg, awayGoals: ag };
}

/** 終場比分 → 結果。 @param {number} h @param {number} a @returns {"home"|"draw"|"away"} */
export function outcomeFromScore(h, a) {
  return h > a ? "home" : h < a ? "away" : "draw";
}

/**
 * 三向賽後結算(對「鎖定的那組機率」評 · 守先鎖後結 · 含輸照掛)。
 *  · 引擎看好邊(三向 argmax)== 終場結果 → proved
 *  · 偏錯邊 → diverged(✕ 跟 ✓ 一樣進分母)
 *  · 三向剛好同分(measure-zero · 無偏向)→ push(唯一排除)
 *  🔴 和局**永遠不 push** —— 和是真實 1X2 結果,照常評(push 和局 = 偷藏 ~1/4 場)。
 * @param {number} homeWin @param {number} draw @param {number} awayWin
 * @param {number} homeGoals @param {number} awayGoals
 * @returns {{ outcome:"home"|"draw"|"away", verdict:"proved"|"diverged"|"push" }}
 */
export function gradeLockedVerdict(homeWin, draw, awayWin, homeGoals, awayGoals) {
  const outcome = outcomeFromScore(homeGoals, awayGoals);
  const max = Math.max(homeWin, draw, awayWin);
  const atMax = [
    ["home", homeWin],
    ["draw", draw],
    ["away", awayWin],
  ].filter((e) => e[1] === max);
  if (atMax.length > 1) return { outcome, verdict: "push" }; // 三向同分 · 無偏向
  const pick = /** @type {"home"|"draw"|"away"} */ (atMax[0][0]);
  return { outcome, verdict: pick === outcome ? "proved" : "diverged" };
}

/** 引擎看好哪個結果(argmax · tie-break 主>和>客 · 跟卡片顯示同邏輯)。
 * @param {import("./engine-core.mjs").SoccerPrediction} pred @returns {"home"|"draw"|"away"} */
export function enginePickOf(pred) {
  const max = Math.max(pred.homeWin, pred.draw, pred.awayWin);
  if (pred.homeWin === max) return "home";
  if (pred.draw === max) return "draw";
  return "away";
}

/**
 * 一場是否「還沒開踢、可以鎖」:status 是 SCHEDULED/TIMED 且開賽時間在未來(留 5 分鐘緩衝)。
 * 不只信 status(開賽前後 status 會延遲幾分鐘)→ 同時看 utcDate。
 * @param {{ status?:string, utcDate?:string }} m @param {number} nowMs
 */
export function isLockable(m, nowMs) {
  if (m.status !== "SCHEDULED" && m.status !== "TIMED") return false;
  const ko = Date.parse(m.utcDate ?? "");
  if (Number.isNaN(ko)) return false;
  return ko >= nowMs + 5 * 60 * 1000;
}

/**
 * @typedef {Object} CorePrediction
 * @property {string} id                fd-{id}
 * @property {string} dateISO           開賽 UTC ISO
 * @property {string} status
 * @property {string} homeSeed
 * @property {string} awaySeed
 * @property {number} ratingHome        餵進引擎的主隊實力分(provenance · 給鎖定後重現)
 * @property {number} ratingAway
 * @property {number} homeAdvantage     這場用的主場優勢(35 地主 / 0 中立 / 60 俱樂部)
 * @property {(import("./engine-core.mjs").SoccerPrediction|null)} prediction  null=覆蓋建置中
 */

/**
 * 一個競賽的未來賽程 → 我們引擎的開盤(含餵進去的實力分 + 主場優勢,給賽前鎖定重現)。
 *  - 國家隊賽事(世界盃):用 teams seed 實力分;兩隊都查不到 → null(不硬開假盤)。
 *    地主(美/墨/加)主場優勢 35,其餘中立 0。
 *  - 俱樂部聯賽:自建 Elo(從本季已結束比賽算)· 兩隊場數都 ≥ MIN_GAMES 才開,否則 null。
 *    主場優勢 60。
 * 跟舊 getCompetitionPredictions 行為逐位一致(已用 ground-truth 向量驗證)。
 *
 * @param {{ code:string, isNationalTeam:boolean }} comp
 * @param {Array<{home:string,away:string,homeGoals:number,awayGoals:number}>} finishedResults  key=seed
 * @param {Array<ReturnType<typeof toScheduledInput>>} scheduled
 * @returns {CorePrediction[]}
 */
export function computeCompetitionPredictions(comp, finishedResults, scheduled) {
  if (comp.isNationalTeam) {
    return scheduled.map((m) => {
      const rawH = getRatingByName(m.homeName || m.homeSeed);
      const rawA = getRatingByName(m.awayName || m.awaySeed);
      const isHost = comp.code === "WC" && WC_HOSTS.has((m.homeName || "").toLowerCase());
      const ratingHome = rawH ?? SOCCER_RATING_BASELINE;
      const ratingAway = rawA ?? SOCCER_RATING_BASELINE;
      const homeAdvantage = isHost ? 35 : 0;
      const prediction =
        rawH === null && rawA === null
          ? null
          : predictSoccer(ratingHome, ratingAway, { homeAdvantage });
      return {
        id: m.id,
        dateISO: m.dateISO,
        status: m.status,
        homeSeed: m.homeSeed,
        awaySeed: m.awaySeed,
        ratingHome,
        ratingAway,
        homeAdvantage,
        prediction,
      };
    });
  }

  const ratings = buildRatings(finishedResults);
  const counts = gameCounts(finishedResults);
  const homeAdvantage = 60;
  return scheduled.map((m) => {
    const enough =
      (counts[m.homeSeed] ?? 0) >= MIN_GAMES_FOR_RATING &&
      (counts[m.awaySeed] ?? 0) >= MIN_GAMES_FOR_RATING;
    const ratingHome = getRating(ratings, m.homeSeed);
    const ratingAway = getRating(ratings, m.awaySeed);
    return {
      id: m.id,
      dateISO: m.dateISO,
      status: m.status,
      homeSeed: m.homeSeed,
      awaySeed: m.awaySeed,
      ratingHome,
      ratingAway,
      homeAdvantage,
      prediction: enough ? predictSoccer(ratingHome, ratingAway, { homeAdvantage }) : null,
    };
  });
}
