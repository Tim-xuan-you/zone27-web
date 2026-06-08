#!/usr/bin/env node
// ── ZONE 27 · 足球引擎核心「零 drift」驗收(parity guard)──────────────────
// 站上 .ts 與賽前鎖定 script 共用 lib/soccer/*-core.mjs 純數學。 鎖定是「永久、改不了」
// 的 → 一個錯的數字就永久髒掉帳本。 這支把核心的輸出釘死在重構前用「目前的 .ts 引擎」
// 跑出來的 golden 值(byte-identical)· 任何一格漂掉就 exit 1。 跑:node scripts/verify-soccer-core.mjs
// (CI 在動到 lib/soccer/** 時跑;本機重構/調參後也跑。)
// ─────────────────────────────────────────────────────

import { predictSoccer, toDisplayPercents } from "../lib/soccer/engine-core.mjs";
import { buildRatings, getRating, gameCounts, MIN_GAMES_FOR_RATING } from "../lib/soccer/elo-core.mjs";
import { getRatingByName, SOCCER_RATING_BASELINE } from "../lib/soccer/teams-data.mjs";
import {
  computeCompetitionPredictions,
  enginePickOf,
  gradeLockedVerdict,
  isLockable,
  outcomeFromScore,
  teamSeed,
  toScheduledInput,
  toResultInput,
} from "../lib/soccer/predict-core.mjs";

let failures = 0;
/** @param {string} label @param {unknown} got @param {unknown} want */
function eq(label, got, want) {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g === w) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}\n      got  ${g}\n      want ${w}`);
  }
}
/** @param {string} label @param {number} got @param {number} want @param {number} tol */
function approx(label, got, want, tol = 1e-6) {
  if (Math.abs(got - want) <= tol) {
    console.log(`  ✓ ${label} (${got})`);
  } else {
    failures++;
    console.error(`  ✗ ${label}  got ${got}  want ${want} (±${tol})`);
  }
}

console.log("constants");
eq("SOCCER_RATING_BASELINE", SOCCER_RATING_BASELINE, 1700);
eq("MIN_GAMES_FOR_RATING", MIN_GAMES_FOR_RATING, 8);

console.log("getRatingByName(+aliases)");
eq("Argentina", getRatingByName("Argentina"), 1875);
eq("United States", getRatingByName("United States"), 1692);
eq("alias usa", getRatingByName("USA"), 1692);
eq("alias Korea Republic", getRatingByName("Korea Republic"), 1701);
eq("alias türkiye", getRatingByName("türkiye"), 1716);
eq("unknown→null", getRatingByName("Atlantis"), null);

// golden 值 = 重構前「目前 .ts 引擎」跑出來的(node 直接驗過 · 不是記憶裡的舊校準)。
console.log("predictSoccer golden vectors (raw 6dp + display ints)");
/** @param {string} label @param {number} h @param {number} a @param {object} opts
 *  @param {[number,number,number]} rawWant @param {[number,number,number]} dispWant @param {[number,number]} topWant */
function vec(label, h, a, opts, rawWant, dispWant, topWant) {
  const p = predictSoccer(h, a, opts);
  const d = toDisplayPercents(p);
  approx(`${label} homeWin`, Number(p.homeWin.toFixed(6)), rawWant[0], 1e-9);
  approx(`${label} draw`, Number(p.draw.toFixed(6)), rawWant[1], 1e-9);
  approx(`${label} awayWin`, Number(p.awayWin.toFixed(6)), rawWant[2], 1e-9);
  eq(`${label} display`, [d.homeWin, d.draw, d.awayWin], dispWant);
  eq(`${label} top score`, [p.topScores[0].home, p.topScores[0].away], topWant);
  approx(`${label} sums to 1`, p.homeWin + p.draw + p.awayWin, 1, 1e-9);
}
vec("ARG vs RSA ha0", 1875, 1636, { homeAdvantage: 0 }, [0.621102, 0.237629, 0.141269], [62, 24, 14], [1, 0]);
vec("FRA vs ESP ha0", 1852, 1876, { homeAdvantage: 0 }, [0.332958, 0.28351, 0.383533], [33, 28, 39], [1, 1]);
vec("QAT vs SUI ha0", 1620, 1762, { homeAdvantage: 0 }, [0.219357, 0.267053, 0.51359], [22, 27, 51], [1, 1]);
vec("USA vs PAR ha35", 1692, 1660, { homeAdvantage: 35 }, [0.43027, 0.280173, 0.289557], [43, 28, 29], [1, 1]);
vec("baseline ha0", 1700, 1700, { homeAdvantage: 0 }, [0.357999, 0.284003, 0.357999], [36, 28, 36], [1, 1]);
vec("club 1600/1500 ha60", 1600, 1500, { homeAdvantage: 60 }, [0.533697, 0.262594, 0.203709], [53, 26, 21], [1, 1]);

console.log("elo buildRatings golden");
const eloResults = [
  { home: "A", away: "B", homeGoals: 2, awayGoals: 0 },
  { home: "B", away: "C", homeGoals: 1, awayGoals: 1 },
  { home: "C", away: "A", homeGoals: 0, awayGoals: 3 },
  { home: "A", away: "C", homeGoals: 1, awayGoals: 0 },
  { home: "B", away: "A", homeGoals: 0, awayGoals: 2 },
];
const r = buildRatings(eloResults);
approx("rating A", Number(getRating(r, "A").toFixed(6)), 1564.541584, 1e-6);
approx("rating B", Number(getRating(r, "B").toFixed(6)), 1465.694255, 1e-6);
approx("rating C", Number(getRating(r, "C").toFixed(6)), 1469.764161, 1e-6);
eq("gameCounts", gameCounts(eloResults), { A: 4, B: 3, C: 3 });

console.log("predict-core helpers");
eq("teamSeed shortName>tla>name", teamSeed({ name: "Club Atlético", shortName: "Atletico", tla: "ATL" }), "Atletico");
eq("teamSeed tla fallback", teamSeed({ name: "Long Name", tla: "LNG" }), "LNG");
eq("outcomeFromScore 2-1", outcomeFromScore(2, 1), "home");
eq("outcomeFromScore 0-0", outcomeFromScore(0, 0), "draw");
eq("outcomeFromScore 0-2", outcomeFromScore(0, 2), "away");
eq("enginePick argmax home", enginePickOf({ homeWin: 0.5, draw: 0.3, awayWin: 0.2 }), "home");
eq("enginePick argmax draw", enginePickOf({ homeWin: 0.2, draw: 0.5, awayWin: 0.3 }), "draw");
eq("enginePick argmax away", enginePickOf({ homeWin: 0.2, draw: 0.3, awayWin: 0.5 }), "away");

const NOW = Date.parse("2026-06-11T00:00:00Z");
eq("isLockable SCHEDULED future", isLockable({ status: "SCHEDULED", utcDate: "2026-06-11T18:00:00Z" }, NOW), true);
eq("isLockable TIMED future", isLockable({ status: "TIMED", utcDate: "2026-06-11T18:00:00Z" }, NOW), true);
eq("isLockable IN_PLAY", isLockable({ status: "IN_PLAY", utcDate: "2026-06-11T18:00:00Z" }, NOW), false);
eq("isLockable past kickoff", isLockable({ status: "TIMED", utcDate: "2026-06-10T18:00:00Z" }, NOW), false);
eq("isLockable within 5min buffer", isLockable({ status: "TIMED", utcDate: "2026-06-11T00:02:00Z" }, NOW), false);

console.log("computeCompetitionPredictions branches");
// 國家隊:兩隊都查不到 → null(覆蓋建置中,不硬開假盤)
const natUnknown = computeCompetitionPredictions(
  { code: "WC", isNationalTeam: true },
  [],
  [toScheduledInput({ id: 1, utcDate: "2026-06-11T18:00:00Z", status: "TIMED", homeTeam: { name: "Atlantis" }, awayTeam: { name: "Narnia" } })],
);
eq("WC both-unknown → null", natUnknown[0].prediction, null);
// 國家隊:地主美國 → homeAdvantage 35
const natHost = computeCompetitionPredictions(
  { code: "WC", isNationalTeam: true },
  [],
  [toScheduledInput({ id: 2, utcDate: "2026-06-11T18:00:00Z", status: "TIMED", homeTeam: { name: "United States" }, awayTeam: { name: "Paraguay" } })],
);
eq("WC host USA homeAdvantage", natHost[0].homeAdvantage, 35);
eq("WC host USA ratings", [natHost[0].ratingHome, natHost[0].ratingAway], [1692, 1660]);
eq("WC host USA display matches golden", toDisplayPercents(natHost[0].prediction), { homeWin: 43, draw: 28, awayWin: 29 });
// 俱樂部:場數不足 → null
const club = computeCompetitionPredictions(
  { code: "BSA", isNationalTeam: false },
  eloResults, // A:4 B:3 C:3 — 都 < 8
  [toScheduledInput({ id: 3, utcDate: "2026-06-11T18:00:00Z", status: "SCHEDULED", homeTeam: { shortName: "A" }, awayTeam: { shortName: "B" } })],
);
eq("BSA under MIN_GAMES → null", club[0].prediction, null);
eq("BSA homeAdvantage 60", club[0].homeAdvantage, 60);

console.log("gradeLockedVerdict (三向 · 含輸照掛 · 和局永不 push)");
// 引擎看好主(0.5/0.3/0.2)· 主贏 2-1 → proved
eq("pick home, home win → proved", gradeLockedVerdict(0.5, 0.3, 0.2, 2, 1), { outcome: "home", verdict: "proved" });
// 引擎看好主 · 結果是和 → diverged(含輸照掛 · 不 push)
eq("pick home, draw → diverged", gradeLockedVerdict(0.5, 0.3, 0.2, 1, 1), { outcome: "draw", verdict: "diverged" });
// 引擎看好主 · 客贏 → diverged
eq("pick home, away win → diverged", gradeLockedVerdict(0.5, 0.3, 0.2, 0, 2), { outcome: "away", verdict: "diverged" });
// 引擎看好和(0.2/0.5/0.3)· 結果是和 → proved(和也能命中)
eq("pick draw, draw → proved", gradeLockedVerdict(0.2, 0.5, 0.3, 1, 1), { outcome: "draw", verdict: "proved" });
// 引擎看好客(0.2/0.3/0.5)· 客贏 → proved
eq("pick away, away win → proved", gradeLockedVerdict(0.2, 0.3, 0.5, 0, 3), { outcome: "away", verdict: "proved" });
// 和局結果但引擎看好主 → diverged(不能變 push · 否則藏輸)
eq("draw result never pushed", gradeLockedVerdict(0.45, 0.30, 0.25, 0, 0).verdict, "diverged");
// 三向同分(measure-zero)→ push
eq("three-way tie → push", gradeLockedVerdict(0.34, 0.34, 0.34, 2, 0), { outcome: "home", verdict: "push" });

void toResultInput; // (覆蓋用 · 已於 football-data 路徑驗證)

console.log(failures === 0 ? "\n✅ PARITY OK · 核心零 drift" : `\n❌ ${failures} 個不一致`);
process.exit(failures === 0 ? 0 : 1);
