// ── ZONE 27 · 足球競賽設定(共用純 JS · 站上 + 賽前鎖定 script 同一份)──────────
// 哪些競賽免費可拿、哪些「正在跑值得展示」(ACTIVE)· 站上 football-data.ts 與 lock/grade
// script 都 import 這支 = 兩邊鎖/展示的競賽集合一致(不會站上開了 script 沒鎖)。
// ─────────────────────────────────────────────────────

/**
 * @typedef {Object} SoccerCompetition
 * @property {string} code            football-data.org 競賽代號
 * @property {string} name            中文展示名
 * @property {string} en              英文名
 * @property {boolean} isNationalTeam 國家隊賽事(走 teams seed)· 否=俱樂部(自建 Elo)
 */

/** 免費方案涵蓋的 12 個競賽。 @type {SoccerCompetition[]} */
export const SOCCER_COMPETITIONS = [
  { code: "WC", name: "世界盃", en: "World Cup", isNationalTeam: true },
  { code: "EC", name: "歐國盃", en: "Euro", isNationalTeam: true },
  { code: "CL", name: "歐冠", en: "Champions League", isNationalTeam: false },
  { code: "PL", name: "英超", en: "Premier League", isNationalTeam: false },
  { code: "PD", name: "西甲", en: "La Liga", isNationalTeam: false },
  { code: "BL1", name: "德甲", en: "Bundesliga", isNationalTeam: false },
  { code: "SA", name: "義甲", en: "Serie A", isNationalTeam: false },
  { code: "FL1", name: "法甲", en: "Ligue 1", isNationalTeam: false },
  { code: "DED", name: "荷甲", en: "Eredivisie", isNationalTeam: false },
  { code: "PPL", name: "葡超", en: "Primeira Liga", isNationalTeam: false },
  { code: "ELC", name: "英冠", en: "Championship", isNationalTeam: false },
  { code: "BSA", name: "巴西甲", en: "Brazil Série A", isNationalTeam: false },
];

// 目前「正在跑、值得展示 + 鎖定」的競賽(rate-limit 紀律)。 隨季節擴充:8 月歐洲開季再加。
// 2026-06:世界盃(6/11 開踢)+ 巴西甲(季中,已驗證有真實資料)。
/** @type {string[]} */
export const ACTIVE_COMPETITIONS = ["WC", "BSA"];

/** @param {string} code @returns {SoccerCompetition | undefined} */
export function getCompetition(code) {
  return SOCCER_COMPETITIONS.find((c) => c.code === code);
}
