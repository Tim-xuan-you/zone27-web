// ── ZONE 27 · 足球「開盤管線」共用核心(站上 .ts 與賽前鎖定 script 同源 · 零 drift)──
// getCompetitionPredictions(football-data.ts)裡「拿到比賽資料 → 算實力分 → 開盤」那段
// 純邏輯抽到這裡。 站上(live 重算)與 lock script(賽前鎖定)都 import 這支 = 兩邊跑的
// 是「字面上同一段程式」→ 鎖進 JSON 的數字 == 站上顯示的數字(誠信命門)。
//
// 本檔只做純計算 + 純資料整形(0 fetch · 0 Next API · 0 副作用)。 抓資料(Next ISR
// fetch / Node fetch)各自在呼叫端做,把整形後的陣列餵進來。
// ─────────────────────────────────────────────────────

import { predictSoccer, predictFromGoals } from "./engine-core.mjs";
import { gameCounts, MIN_GAMES_FOR_RATING } from "./elo-core.mjs";
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
 * 90 分鐘比分(我們開的線 = 90 分鐘 1X2 · 全管線結算的唯一比分來源)。
 * ⚠️ football-data v4 的 `score.fullTime` 是「最終」比分 —— 淘汰賽踢到延長賽/PK 時,
 * 延長賽進球(甚至 PK 進球)全被加總進去(實測 PSG-Arsenal 90 分鐘 1-1 · PK 4-3 →
 * fullTime 回 5-4)。 90 分鐘真比分在 duration !== 'REGULAR' 時存於 `score.regularTime`。
 * 直接用 fullTime 結算會把「90 分鐘和局」判成輸、把幽靈比分寫進永不刪帳本。
 * duration 缺(= 正規)或 'REGULAR' → fullTime;否則只認 regularTime(缺就回 null
 * 不結算 —— 寧可晚對帳,不寫可能錯的比分)。
 * @param {{ duration?:string, fullTime?:{ home?:number|null, away?:number|null }, regularTime?:{ home?:number|null, away?:number|null } } | undefined | null} score
 * @returns {{ home:number, away:number } | null}
 */
export function regulationScore(score) {
  if (!score) return null;
  const src =
    !score.duration || score.duration === "REGULAR"
      ? score.fullTime
      : score.regularTime;
  const h = src?.home;
  const a = src?.away;
  if (typeof h !== "number" || typeof a !== "number") return null;
  return { home: h, away: a };
}

/**
 * football-data 的一場已結束 raw match → Elo 戰績輸入(key 用 seed)。 無比分回 null。
 * 比分走 regulationScore(90 分鐘)· 不讓延長賽/PK 進球污染實力分。
 * @param {{ homeTeam?:object, awayTeam?:object, score?:{ duration?:string, fullTime?:{ home?:number|null, away?:number|null }, regularTime?:{ home?:number|null, away?:number|null } } }} m
 * @returns {{ home:string, away:string, homeGoals:number, awayGoals:number } | null}
 */
export function toResultInput(m) {
  const reg = regulationScore(m.score);
  if (!reg) return null;
  return { home: teamSeed(m.homeTeam), away: teamSeed(m.awayTeam), homeGoals: reg.home, awayGoals: reg.away };
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

// ── 俱樂部攻防模型(取代「單一 Elo + 固定總進球 2.6」· 標準足球量化做法)─────────
// 舊法:每隊一個 Elo、每場固定平均 2.6 球,只挪「誰進」→ 實力接近的聯賽全擠在 ~40%、
// 最可能比分永遠 1-1。 新法:從本季戰績算每隊「攻擊力 × 防守力」,λ = 聯賽平均 × 我攻 ×
// 對方防守 × 主客加成 → 進球總數會隨對戰變(強攻碰弱守開大比分/大勝率、龜縮對龜縮開低比分)。
const STRENGTH_SHRINK_GAMES = 5; // 小樣本往聯賽平均收縮的偽計數(場數少不被一兩場屠殺洗成怪物)
const HOME_GOAL_MULT = 1.15; // 主場進球加成
const AWAY_GOAL_MULT = 0.95; // 客場略減

/**
 * 從本季已結束比賽算每隊攻擊力 / 防守力(相對聯賽平均 · 1.0 = 平均 · >1 攻強/防漏)。
 * 小樣本往 1.0 收縮(weight = games/(games+K))= 誠實(沒踢幾場別裝神準)。
 * @param {Array<{home:string,away:string,homeGoals:number,awayGoals:number}>} results
 * @returns {{ mu:number, byTeam: Record<string,{att:number,def:number,games:number}> }}
 */
export function computeTeamStrengths(results) {
  let totalGoals = 0;
  let matchCount = 0;
  /** @type {Record<string,{scored:number,conceded:number,games:number}>} */
  const acc = {};
  const bump = (t) => (acc[t] ??= { scored: 0, conceded: 0, games: 0 });
  for (const r of results) {
    totalGoals += r.homeGoals + r.awayGoals;
    matchCount += 1;
    const h = bump(r.home);
    const a = bump(r.away);
    h.scored += r.homeGoals;
    h.conceded += r.awayGoals;
    h.games += 1;
    a.scored += r.awayGoals;
    a.conceded += r.homeGoals;
    a.games += 1;
  }
  const mu = matchCount > 0 ? totalGoals / (2 * matchCount) : 1.3; // 聯賽平均:每隊每場進球
  /** @type {Record<string,{att:number,def:number,games:number}>} */
  const byTeam = {};
  for (const t of Object.keys(acc)) {
    const s = acc[t];
    const rawAtt = s.games > 0 ? s.scored / s.games / mu : 1;
    const rawDef = s.games > 0 ? s.conceded / s.games / mu : 1;
    const w = s.games / (s.games + STRENGTH_SHRINK_GAMES);
    byTeam[t] = { att: 1 + w * (rawAtt - 1), def: 1 + w * (rawDef - 1), games: s.games };
  }
  return { mu, byTeam };
}

/**
 * 一場俱樂部對戰兩邊的預期進球 λ = 聯賽平均 × 我方攻擊 × 對方防守 × 主/客加成。
 * @param {ReturnType<typeof computeTeamStrengths>} strengths @param {string} home @param {string} away
 * @returns {{ xgHome:number, xgAway:number }}
 */
export function clubLambdas(strengths, home, away) {
  const { mu, byTeam } = strengths;
  const h = byTeam[home] ?? { att: 1, def: 1, games: 0 };
  const a = byTeam[away] ?? { att: 1, def: 1, games: 0 };
  return {
    xgHome: mu * h.att * a.def * HOME_GOAL_MULT,
    xgAway: mu * a.att * h.def * AWAY_GOAL_MULT,
  };
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

  // 俱樂部:攻防模型(每隊攻擊力 × 防守力 → λ → Dixon-Coles 比分表)。 進球數隨對戰變
  // = 強弱懸殊開大勝率/大比分、勢均開低比分。 戰績不足的隊仍用 MIN_GAMES 把關不硬開。
  const counts = gameCounts(finishedResults);
  const strengths = computeTeamStrengths(finishedResults);
  return scheduled.map((m) => {
    const enough =
      (counts[m.homeSeed] ?? 0) >= MIN_GAMES_FOR_RATING &&
      (counts[m.awaySeed] ?? 0) >= MIN_GAMES_FOR_RATING;
    const { xgHome, xgAway } = clubLambdas(strengths, m.homeSeed, m.awaySeed);
    return {
      id: m.id,
      dateISO: m.dateISO,
      status: m.status,
      homeSeed: m.homeSeed,
      awaySeed: m.awaySeed,
      // 俱樂部改用攻防 λ 開盤(非 Elo)→ rating 欄位留 0;overlay 用存下的 xg 重現(見 lock script)。
      ratingHome: 0,
      ratingAway: 0,
      homeAdvantage: 0,
      prediction: enough ? predictFromGoals(xgHome, xgAway) : null,
    };
  });
}
