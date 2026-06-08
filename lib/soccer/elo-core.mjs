// ── ZONE 27 · 足球實力分系統(自建 Elo)核心(共用純 JS · 同 engine-core.mjs 理由)──
// 站上 elo.ts 與賽前鎖定 script 都 import 這支 = 自建 Elo 算出的實力分保證一致(零 drift)。
// 方法 = World Football Elo 式(含主場 + 大勝加權)· 餵歷史戰績 → 長出每隊實力分。
// 純函式、0 外部依賴。
// ─────────────────────────────────────────────────────

/**
 * @typedef {Object} SoccerEloResult
 * @property {string} home  主隊代號/ID
 * @property {string} away  客隊代號/ID
 * @property {number} homeGoals
 * @property {number} awayGoals
 */

/**
 * @typedef {Object} EloOptions
 * @property {number} [k]              基礎 K 係數(一場最多移動多少分)。 預設 24。
 * @property {number} [homeAdvantage]  主場優勢(中立場 0)。 預設 60。
 * @property {number} [baseline]       沒見過的隊的起始分。 預設 1500。
 */

/** @type {Required<EloOptions>} */
const ELO_DEFAULTS = { k: 24, homeAdvantage: 60, baseline: 1500 };

/** A 對 B 的「預期得分」(0-1 · Elo 標準邏輯函數)。 @param {number} eloA @param {number} eloB */
function expectedScore(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/** 大勝加權(World Football Elo 式)。 @param {number} goalDiff */
function movMultiplier(goalDiff) {
  const g = Math.abs(goalDiff);
  if (g <= 1) return 1;
  if (g === 2) return 1.5;
  return (11 + g) / 8;
}

/**
 * 用一場結果更新兩隊的分數。 zero-sum:主隊加多少、客隊就扣多少。
 * @param {number} eloHome @param {number} eloAway @param {number} homeGoals @param {number} awayGoals
 * @param {EloOptions} [opts]
 * @returns {{ home: number, away: number }}
 */
export function updateOne(eloHome, eloAway, homeGoals, awayGoals, opts = {}) {
  const { k, homeAdvantage } = { ...ELO_DEFAULTS, ...opts };
  const expHome = expectedScore(eloHome + homeAdvantage, eloAway);
  const resultHome = homeGoals > awayGoals ? 1 : homeGoals === awayGoals ? 0.5 : 0;
  const mult = movMultiplier(homeGoals - awayGoals);
  const delta = k * mult * (resultHome - expHome);
  return { home: eloHome + delta, away: eloAway - delta };
}

/**
 * 餵一串「依時間排序」的歷史戰績 → 算出每支隊伍當前的實力分。
 * 沒見過的隊從 baseline 起算 · 純 deterministic。
 * @param {SoccerEloResult[]} results
 * @param {EloOptions} [opts]
 * @returns {Record<string, number>}
 */
export function buildRatings(results, opts = {}) {
  const { baseline } = { ...ELO_DEFAULTS, ...opts };
  /** @type {Record<string, number>} */
  const ratings = {};
  /** @param {string} t */
  const get = (t) => ratings[t] ?? baseline;
  for (const r of results) {
    const u = updateOne(get(r.home), get(r.away), r.homeGoals, r.awayGoals, opts);
    ratings[r.home] = u.home;
    ratings[r.away] = u.away;
  }
  return ratings;
}

/** 查一支隊的實力分 · 沒見過回 baseline。
 * @param {Record<string, number>} ratings @param {string} team @param {number} [baseline] */
export function getRating(ratings, team, baseline = ELO_DEFAULTS.baseline) {
  return ratings[team] ?? baseline;
}

/**
 * 一支隊伍要算進「可誠實預測」門檻的最少場數(同棒球 Elo 誠實鐵律 · 足球門檻較低)。
 * @type {number}
 */
export const MIN_GAMES_FOR_RATING = 8;

/** 算每支隊出現過幾場(配 MIN_GAMES_FOR_RATING 過濾資料不足的隊)。
 * @param {SoccerEloResult[]} results @returns {Record<string, number>} */
export function gameCounts(results) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const r of results) {
    counts[r.home] = (counts[r.home] ?? 0) + 1;
    counts[r.away] = (counts[r.away] ?? 0) + 1;
  }
  return counts;
}
