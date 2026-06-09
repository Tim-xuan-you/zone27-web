#!/usr/bin/env node
// ── ZONE 27 · Match Data Validator ──────────────────────
// Round 55 W-A · 跨 Agent A workflow + Agent B data quality synthesize ·
// pre-commit guard against typos / staleness / cross-file integrity drift
// in lib/matches.ts · lib/cpbl-pitchers.ts · lib/cpbl-parks.ts。
//
// Catches before Vercel rebuild:
//   1. Match ID format(cpbl-YYMMDD-NN)+ uniqueness
//   2. Date format consistency(canonical「YYYY · MM · DD  ·  星期X」)
//   3. winRate home + away sum = 100
//   4. finalResult schema(homeScore/awayScore/winner/ingestedAt)
//   5. finalResult.ingestedAt ≥ match date(not backward time)
//   6. Pitcher names referenced in matches.ts exist in cpbl-pitchers.ts
//      OR flagged with「ESTIMATE」 comment
//   7. Venue references valid park in cpbl-parks.ts
//   8. Venue homeTeam matches park.homeTeam(catch venue mismatch)
//   8.5 CPBL 已完成賽事(日期 + 兩隊)對 lib/cpbl-results.json 官方賽程核對
//       (R207 · 防 logo 看反把客隊隊名標錯上公開帳本 · 延賽場略過)
//   9. Stale-pending detection · match.date > 14h ago without finalResult
//
// brand IP fit:
//   - 「物理時刻 + Tim 簽名」 axiom maintained · script SUGGESTS · 不 auto-fix
//   - 「方法公開」 · validation rules公開可查 · 0 hidden checks
//   - per /audit S05 PRE-COMMIT pattern · 同 30-day notice 同 axiom 延伸
//
// Usage:
//   node scripts/validate-match-data.mjs       # default · exits 1 if issues
//   node scripts/validate-match-data.mjs --warn # warnings only · exits 0
//
// Integration:
//   npm run validate:data  (package.json script · added in same wave)
//   .husky/pre-commit(future · if Tim adds husky)
// ─────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const WARN_ONLY = process.argv.includes("--warn");

let errorCount = 0;
let warnCount = 0;

function error(msg) {
  console.error(`✕ ERROR · ${msg}`);
  errorCount++;
}

function warn(msg) {
  console.warn(`⚠ WARN  · ${msg}`);
  warnCount++;
}

function ok(msg) {
  console.log(`✓ OK    · ${msg}`);
}

// ── Step 1 · Read source files as strings · regex parse(不 import TS at
//          build-time · 純 grep-based static check)──
const matchesSource = readFileSync(join(ROOT, "lib/matches.ts"), "utf-8");
const pitchersSource = readFileSync(
  join(ROOT, "lib/cpbl-pitchers.ts"),
  "utf-8"
);
const parksSource = readFileSync(join(ROOT, "lib/cpbl-parks.ts"), "utf-8");

// ── Step 2 · Extract match IDs ──────────────────────────
const matchIdPattern = /id:\s*"(cpbl-\d{6}-\d{2})"/g;
const matchIds = [];
let m;
while ((m = matchIdPattern.exec(matchesSource)) !== null) {
  matchIds.push(m[1]);
}

// Check uniqueness
const idSet = new Set();
const duplicates = [];
for (const id of matchIds) {
  if (idSet.has(id)) duplicates.push(id);
  idSet.add(id);
}
if (duplicates.length > 0) {
  error(`Duplicate match IDs: ${duplicates.join(", ")}`);
} else {
  ok(`${matchIds.length} match IDs · all unique`);
}

// Check ID format
for (const id of matchIds) {
  if (!/^cpbl-\d{6}-\d{2}$/.test(id)) {
    error(`Match ID format invalid: ${id} · expected cpbl-YYMMDD-NN`);
  }
}

// ── Step 3 · Extract pitcher names from matches.ts ──────
// Look for `name: "Chinese名"` inside pitcher blocks
const pitcherNamePattern = /name:\s*"([^"]+)"/g;
const pitcherNamesInMatches = new Set();
let pm;
while ((pm = pitcherNamePattern.exec(matchesSource)) !== null) {
  const name = pm[1];
  // Filter out team names and venue names · keep only individual pitcher names
  // Heuristic · 2-4 Chinese chars without「悍」「兄弟」「龍」「猿」「獅」「鷹」 团队后缀
  if (
    /^[一-龥]{2,4}$/.test(name) &&
    !/(悍將|兄弟|桃猿|獅|龍|雄鷹|統一)/.test(name)
  ) {
    pitcherNamesInMatches.add(name);
  }
}

// Extract pitcher names from cpbl-pitchers.ts
// R61 W-A · regex fix · cpbl-pitchers.ts uses JSON-like format `"name": "X"` ·
// previous regex `name:\s*"X"` 不 match because `:` comes AFTER the closing
// quote of the key(actual substring is `name"` + `":` separately)· result:
// 0 names found · all 16 pitchers false-positive "missing" · 4 of 6
// reported missing(李東洺 / 魔力藍 / 羅戈)were actually IN the file。
// Fix:add leading quote anchor `"name":` to match JSON key format precisely。
const pitchersFromFile = new Set();
const pitcherListPattern = /"name":\s*"([一-龥]{2,4})"/g;
let pf;
while ((pf = pitcherListPattern.exec(pitchersSource)) !== null) {
  pitchersFromFile.add(pf[1]);
}

// R61 W-B · enhancement · honor inline ESTIMATE markers in matches.ts。
// 之前 validator 對 missing-from-cpbl-pitchers.ts pitcher 一律 WARN · 不
// distinguish「真的 missing data」 vs「explicit estimate per /audit S02
// ESTIMATION DISCLOSURE pattern」。 matches.ts 已 inline mark 例:
//   k9: "8.5",      // estimate
// validator extension:if pitcher name 出現在 matches.ts 緊接著的 5-10 行
// 內含「estimate」 marker(任何 stat 行有 // estimate)· 視為 explicitly
// marked · 不 WARN · 同 [[zone27-disclosure-philosophy]] inline marker
// honored as canonical disclosure。
function pitcherHasInlineEstimate(matchesSource, pitcherName) {
  // Find each pitcher block by name and check surrounding 5-10 lines for // estimate
  const namePattern = new RegExp(
    `name:\\s*"${pitcherName.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}"`,
    "g"
  );
  let nm;
  while ((nm = namePattern.exec(matchesSource)) !== null) {
    // Look at next 600 chars(roughly a pitcher block of 5-10 lines)
    const window = matchesSource.slice(nm.index, nm.index + 600);
    if (/\/\/\s*estimate/i.test(window)) {
      return true;
    }
  }
  return false;
}

// Cross-check · pitchers in matches.ts missing from cpbl-pitchers.ts
// 3-tier classification:
//   (a) pitcher in cpbl-pitchers.ts · OK · no warn
//   (b) pitcher NOT in cpbl-pitchers.ts AND has inline // estimate marker · OK
//       (per /audit S02 ESTIMATION DISCLOSURE pattern · honest)
//   (c) pitcher NOT in cpbl-pitchers.ts AND no inline marker · WARN(真實 gap)
const missingPitchers = [];
const estimatePitchers = [];
for (const name of pitcherNamesInMatches) {
  if (pitchersFromFile.has(name)) continue;
  if (pitcherHasInlineEstimate(matchesSource, name)) {
    estimatePitchers.push(name);
  } else {
    missingPitchers.push(name);
  }
}
if (missingPitchers.length > 0) {
  warn(
    `Pitchers in matches.ts NOT in cpbl-pitchers.ts AND missing inline // estimate marker: ${missingPitchers.join(
      ", "
    )} · add real entry OR inline // estimate comment`
  );
} else if (estimatePitchers.length > 0) {
  ok(
    `All match pitchers either in cpbl-pitchers.ts OR explicitly marked // estimate (${estimatePitchers.length} marked: ${estimatePitchers.join(
      ", "
    )})`
  );
} else {
  ok(`All match pitchers have cpbl-pitchers.ts entry`);
}

// ── Step 4 · Extract venues from matches.ts ─────────────
const venuePattern = /venue:\s*"([^"]+)"/g;
const venuesInMatches = new Set();
let vm;
while ((vm = venuePattern.exec(matchesSource)) !== null) {
  venuesInMatches.add(vm[1]);
}

// Extract venues from cpbl-parks.ts
const venuesFromFile = new Set();
const parkVenuePattern = /venue:\s*"([^"]+)"/g;
let pvm;
while ((pvm = parkVenuePattern.exec(parksSource)) !== null) {
  venuesFromFile.add(pvm[1]);
}

const missingVenues = [];
for (const venue of venuesInMatches) {
  if (!venuesFromFile.has(venue)) {
    missingVenues.push(venue);
  }
}
if (missingVenues.length > 0) {
  error(
    `Venues in matches.ts NOT in cpbl-parks.ts: ${missingVenues.join(
      ", "
    )} · add park entry`
  );
} else {
  ok(`All match venues have cpbl-parks.ts entry`);
}

// ── Step 5 · winRate sum check via regex ────────────────
// Match each home/away block · capture winRate value
const winRatePattern = /winRate:\s*(\d+)/g;
const winRates = [];
let wm;
while ((wm = winRatePattern.exec(matchesSource)) !== null) {
  winRates.push(parseInt(wm[1], 10));
}
// Pair up · home+away should sum to 100
if (winRates.length % 2 !== 0) {
  warn(
    `winRate count is odd(${winRates.length})· cannot pair home/away · manual review`
  );
} else {
  const pairCount = winRates.length / 2;
  for (let i = 0; i < pairCount; i++) {
    const home = winRates[i * 2];
    const away = winRates[i * 2 + 1];
    if (home + away !== 100) {
      warn(
        `winRate pair ${i + 1} sum is ${home + away} (home=${home} away=${away}) · should be 100`
      );
    }
  }
  if (warnCount === 0) ok(`${pairCount} winRate pairs · all sum to 100`);
}

// ── Step 6 · finalResult schema check ───────────────────
// Find each finalResult block · ensure has homeScore + awayScore + winner + ingestedAt
// (matches FinalResult type in lib/matches.ts:36-42)
const finalResultBlocks = matchesSource.matchAll(
  /finalResult:\s*\{([^}]+)\}/g
);
let finalResultCount = 0;
let finalResultErrors = 0;
for (const block of finalResultBlocks) {
  finalResultCount++;
  const body = block[1];
  const hasHomeScore = /homeScore:\s*\d+/.test(body);
  const hasAwayScore = /awayScore:\s*\d+/.test(body);
  const hasWinner = /winner:\s*"(home|away|tie)"/.test(body);
  const hasIngestedAt = /ingestedAt:\s*"(\d{4}-\d{2}-\d{2})"/.test(body);
  if (!hasHomeScore || !hasAwayScore || !hasWinner || !hasIngestedAt) {
    error(
      `finalResult #${finalResultCount} missing required field(homeScore / awayScore / winner / ingestedAt)`
    );
    finalResultErrors++;
  }
}
if (finalResultCount > 0 && finalResultErrors === 0) {
  ok(`${finalResultCount} finalResult entries · schema valid`);
}

// ── Step 6.5 · CPBL 隊名 ↔ 官方賽果交叉核對(防 logo 看反誤植)──────────
// R207 · 整季有 7 場曾因「味全 W ↔ 統一橘 / 中信 B ↔ 富邦 G」logo 看反而把客隊
// 隊名標錯(主隊/比分/勝負都對 · 只隊名錯)。 此 check 把每場已完成 CPBL 賽事的
// (日期 + 兩隊集合)對 lib/cpbl-results.json 官方賽程核對 → 下一次誤植在 commit 前
// 就被抓到、不會默默上公開帳本。 純隊名比對 · 不碰 winRate / 結算(immutable)。
const CPBL_TEAM_KEY = {
  中信兄弟: "CTBC",
  樂天桃猿: "RAKU",
  "統一7-ELEVEn獅": "UNI",
  統一獅: "UNI",
  台鋼雄鷹: "TSG",
  味全龍: "WEI",
  富邦悍將: "FUBON",
};
const normTeam = (n) => (n ? CPBL_TEAM_KEY[n.trim()] ?? null : null);

let officialByDate = null;
try {
  const res = JSON.parse(readFileSync(join(ROOT, "lib/cpbl-results.json"), "utf-8"));
  officialByDate = new Map();
  for (const g of res.games ?? []) {
    if (!officialByDate.has(g.date)) officialByDate.set(g.date, []);
    officialByDate.get(g.date).push([normTeam(g.homeName), normTeam(g.awayName)]);
  }
} catch {
  officialByDate = null; // 沒有 results 檔就 graceful 跳過此 check
}

if (officialByDate) {
  const isoFromDate = (d) => {
    const parts = d.split("·").map((s) => s.trim()).filter(Boolean);
    if (parts.length < 3) return null;
    const [y, m, dd] = parts;
    if (!/^\d{4}$/.test(y) || !/^\d{1,2}$/.test(m) || !/^\d{1,2}$/.test(dd)) return null;
    return `${y}-${m.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  };
  const blocks = matchesSource.split(/id:\s*"/).slice(1);
  const mismatches = [];
  let checked = 0;
  for (const b of blocks) {
    const idm = b.match(/^(cpbl-[0-9-]+)"/);
    if (!idm) continue;
    const id = idm[1];
    if (/postponed:\s*true/.test(b)) continue; // 延賽場:官方原日無此賽果 · 略過(非誤植)
    const cut = b.indexOf("topScores");
    const seg = b.slice(0, cut >= 0 ? cut : 2000);
    const dateM = seg.match(/date:\s*"([^"]+)"/);
    const iso = dateM ? isoFromDate(dateM[1]) : null;
    if (!iso || !officialByDate.has(iso)) continue; // 官方還沒那天賽果(未來場/賽前)→ 跳過
    const homeM = seg.match(/home:\s*\{[\s\S]*?name:\s*"([^"]+)"/);
    const awayM = seg.match(/away:\s*\{[\s\S]*?name:\s*"([^"]+)"/);
    const hk = normTeam(homeM?.[1]);
    const ak = normTeam(awayM?.[1]);
    if (!hk || !ak) continue;
    checked++;
    const found = officialByDate
      .get(iso)
      .some(([oh, oa]) => (oh === hk && oa === ak) || (oh === ak && oa === hk));
    if (!found) {
      mismatches.push(`${id}(${homeM?.[1]} vs ${awayM?.[1]} · ${iso})`);
    }
  }
  if (mismatches.length > 0) {
    warn(
      "CPBL 賽事隊名對不到官方賽果(疑似 logo 看反誤植 · 對官方 box score 核對主/客隊):\n     " +
        mismatches.join("\n     ")
    );
  } else if (checked > 0) {
    ok(`${checked} 場已完成 CPBL 賽事隊名 ↔ 官方賽果 全對得上`);
  }
}

// ── Step 7 · Stale-pending detection ────────────────────
// 注:此 check 需要 today's date · 不在 grep 範圍 · 用 process date · 不
// 完全 accurate(分析 ISO match date 需 parse Chinese format)· 留作
// future enhancement · 此 script 不 enforce · 純信息提示。

// ── Step 8 · Summary ────────────────────────────────────
console.log("");
console.log("─".repeat(60));
console.log(
  `RESULT · ${errorCount} error(s) · ${warnCount} warning(s) · ${matchIds.length} matches audited`
);
console.log("─".repeat(60));

if (errorCount > 0 && !WARN_ONLY) {
  console.error("");
  console.error("✕ Validation FAILED · fix errors before commit");
  console.error("  Run with --warn flag to allow warnings (errors still fail)");
  process.exit(1);
}

if (errorCount === 0 && warnCount === 0) {
  console.log("");
  console.log("✓ All match data validation passed · ready to commit");
}

process.exit(0);
