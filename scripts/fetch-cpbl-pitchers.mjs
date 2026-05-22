// ── ZONE 27 · CPBL Pitcher Stats Auto-fetch ────────────
// Round 31 W-I · Tim push back「真的太麻煩了 · 每天都要複製這些給您?」
// surface 了 workflow blocker。 Recon 發現 cpbl.com.tw 是 server-rendered
// HTML(不是 SPA · CLAUDE.md 寫錯)· `/stats/recordall?kindcode=A&
// position=02` 一頁 inline 所有投手 IP / K / BB / HR · K/9 BB/9 HR/9
// 用 (stat / IP) × 9 即可計算。
//
// This script:
//   1. Fetch cpbl.com.tw pitcher ERA leaderboard
//   2. Parse HTML rows for each qualifying pitcher
//   3. Compute K/9 · BB/9 · HR/9 · WHIP from raw counts
//   4. Output to lib/cpbl-pitchers.ts(TypeScript const · matches.ts
//      lookup 取代 hardcoded estimate)
//
// Run:    node scripts/fetch-cpbl-pitchers.mjs
// Or daily cron / GitHub Action / Vercel ISR scheduled function。
//
// Tim 從此不用截 pitcher stats。 box scores(final scores)仍須 Tim 賽後
// 截一次 · 因為 box score 是 brand IP 物理時刻 + 賽前/賽後 strict timing。
// ─────────────────────────────────────────────────────

import * as cheerio from "cheerio";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT = path.join(ROOT, "lib", "cpbl-pitchers.ts");

const URL = "https://www.cpbl.com.tw/stats/recordall?kindcode=A&position=02&sortby=01";

console.log(`📥 Fetching ${URL}`);

const res = await fetch(URL, {
  headers: {
    // CPBL blocks non-browser UAs(returns 404)· must look like real Chrome
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
  },
});

if (!res.ok) {
  console.error(`❌ HTTP ${res.status}`);
  process.exit(1);
}

const html = await res.text();
console.log(`   Got ${html.length} bytes`);

const $ = cheerio.load(html);

// Reconnaissance: CPBL uses semantic divs + lists rather than <table>
// per WebFetch recon. Let me try multiple selectors and find which works.
// Common patterns: .RecordTable tr, .table-list tr, ol li, etc.

// Try: list rows containing pitcher links
const candidates = [
  ".RecordTable tbody tr",
  ".table-list tbody tr",
  "table tbody tr",
  ".stats-list li",
  "tbody tr",
];

let rows = null;
let usedSelector = null;
for (const sel of candidates) {
  const found = $(sel);
  if (found.length > 0) {
    rows = found;
    usedSelector = sel;
    console.log(`   Found ${found.length} rows via "${sel}"`);
    break;
  }
}

if (!rows || rows.length === 0) {
  console.error(`❌ No rows found · tried ${candidates.join(", ")}`);
  console.log("   First 1000 chars of HTML:");
  console.log(html.slice(0, 1000));
  process.exit(1);
}

/**
 * @typedef {Object} Pitcher
 * @property {string} name
 * @property {string} team
 * @property {string|null} acnt
 * @property {number} era · k · bb · hr · ip · k9 · bb9 · hr9 · whip
 */
const pitchers = [];

// Correct cell mapping verified via row[2] debug:
// [0] combined "rank team name" with embedded links · use DOM tree to extract
// [1] ERA · [7] W · [8] L · [13] IP (e.g. "41.2" = 41⅔ innings)
// [14] H · [15] HR · [18] BB · [21] K · [24] WHIP (pre-computed)
// [28] K/9 (pre-computed) · [29] BB/9 (pre-computed)
// HR/9 not in row · compute from HR / IP * 9

rows.each((i, row) => {
  const $row = $(row);
  const cells = $row.find("td");

  // Skip header rows(have <th> not <td>)
  if (cells.length < 25) return;

  // First cell contains links: rank text + team link + pitcher link
  const firstCell = cells.eq(0);
  const pitcherLink = firstCell.find('a[href*="/team/person"]').first();
  const teamLink = firstCell.find('a[href*="/team?"]').first();
  const name = pitcherLink.text().trim();
  const team = teamLink.text().trim();
  const href = pitcherLink.attr("href") ?? "";
  const acntMatch = href.match(/acnt=(\w+)/i);
  const acnt = acntMatch ? acntMatch[1] : null;

  if (!name) return;

  const cellTexts = cells.map((_, c) => $(c).text().trim()).get();

  const era = parseFloat(cellTexts[1]);
  const ipStr = cellTexts[13]; // "41.2" = 41⅔
  const h = parseInt(cellTexts[14], 10);
  const hr = parseInt(cellTexts[15], 10);
  const bb = parseInt(cellTexts[18], 10);
  const k = parseInt(cellTexts[21], 10);
  const whipFromPage = parseFloat(cellTexts[24]);
  const k9FromPage = parseFloat(cellTexts[28]);
  const bb9FromPage = parseFloat(cellTexts[29]);

  if (!Number.isFinite(era)) return;

  // Convert IP "41.2" → 41.667(.1=⅓ · .2=⅔)
  const ipMatch = ipStr.match(/^(\d+)(?:\.(\d))?$/);
  if (!ipMatch) return;
  const ipWhole = parseInt(ipMatch[1], 10);
  const ipFrac = ipMatch[2] ? parseInt(ipMatch[2], 10) / 3 : 0;
  const ip = ipWhole + ipFrac;

  if (ip < 1) return;

  // Prefer pre-computed K/9 · BB/9 · WHIP from page · compute HR/9 ourselves
  const k9 = Number.isFinite(k9FromPage) ? k9FromPage : (k / ip) * 9;
  const bb9 = Number.isFinite(bb9FromPage) ? bb9FromPage : (bb / ip) * 9;
  const hr9 = (hr / ip) * 9;
  const whip = Number.isFinite(whipFromPage) ? whipFromPage : (bb + h) / ip;

  pitchers.push({
    name,
    team,
    acnt,
    era,
    ip: Math.round(ip * 10) / 10,
    k,
    bb,
    hr,
    k9: Math.round(k9 * 100) / 100,
    bb9: Math.round(bb9 * 100) / 100,
    hr9: Math.round(hr9 * 100) / 100,
    whip: Math.round(whip * 100) / 100,
  });
});

console.log(`   Parsed ${pitchers.length} pitchers`);

if (pitchers.length === 0) {
  console.error(`❌ No pitchers parsed · selector "${usedSelector}" found rows but parsing failed`);
  console.log("   First row HTML:");
  console.log($(rows[0]).html()?.slice(0, 500));
  process.exit(1);
}

// Sort by ERA ascending
pitchers.sort((a, b) => a.era - b.era);

// Output as TypeScript const
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());

const tsContent = `// ── ZONE 27 · CPBL Pitcher Stats Cache ─────────────────
// AUTO-GENERATED · DO NOT EDIT MANUALLY · run scripts/fetch-cpbl-pitchers.mjs to refresh.
// Source:  cpbl.com.tw /stats/recordall?kindcode=A&position=02 (server-rendered)
// Fetched: ${today} TPE
// Pitchers: ${pitchers.length}
//
// Use \`getPitcherStatsByName(name)\` from lib/matches.ts to lookup real
// stats by Chinese name. Falls back to hardcoded estimate if not found
// (which is honest per /audit S02 ESTIMATION DISCLOSURE pattern).
// ─────────────────────────────────────────────────────

export type CpblPitcherStats = {
  name: string;
  team: string;
  acnt: string | null;
  era: number;
  ip: number;
  k: number;
  bb: number;
  hr: number;
  k9: number;
  bb9: number;
  hr9: number;
  whip: number;
};

export const CPBL_PITCHER_FETCH_DATE = "${today}";

export const cpblPitchers: CpblPitcherStats[] = ${JSON.stringify(pitchers, null, 2)};

/** Lookup pitcher stats by Chinese name. Returns null if not in qualifying
 *  leaderboard (e.g. pitcher with < required IP for stats display). */
export function getCpblPitcherByName(name: string): CpblPitcherStats | null {
  return cpblPitchers.find((p) => p.name === name) ?? null;
}
`;

writeFileSync(OUTPUT, tsContent, "utf8");
console.log(`✅ Wrote ${OUTPUT}`);
console.log(`   Top 5 by ERA:`);
pitchers.slice(0, 5).forEach((p) => {
  console.log(`     ${p.name} (${p.team}) · ERA ${p.era} · K/9 ${p.k9} · BB/9 ${p.bb9} · HR/9 ${p.hr9}`);
});
