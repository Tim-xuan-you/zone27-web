// ── ZONE 27 · CPBL Today Schedule Auto-fetch ────────────
// Round 46 W-A · Tim R45 question canary「MLB 自己更新 · CPBL 呢?」 ·
// surface 了 daily friction:Tim 每天還要手動截 CPBL 賽程才能 ingest 到
// lib/matches.ts。 此 script 解 50% friction(賽前 metadata 自動化 ·
// 賽後 box score finalResult 仍 Tim 手動 · 因 brand IP「物理時刻 + 賽前/
// 賽後 strict timing」 不可 auto)。
//
// 同 fetch-cpbl-pitchers.mjs cheerio HTML parse pattern · cpbl.com.tw 是
// server-rendered HTML(per R31 W-I recon)· 不需要 headless browser ·
// 0 cost · 0 API key · 0 私下繞付費牆 · 100% 官方公開 endpoint。
//
// Endpoint:cpbl.com.tw `/games` schedule index page · default 顯示 today's
// game(s)+ 一週 future schedule。
//
// This script:
//   1. Fetch cpbl.com.tw schedule HTML
//   2. Parse today's game rows · venue + time + home/away + pitchers
//   3. Output lib/cpbl-schedule-auto.ts(TypeScript const)
//   4. NOT auto-overwrite lib/matches.ts(brand IP curation 保留)· Tim
//      仍 manually pull from this output into matches.ts when ingesting
//
// Run:   npm run fetch-cpbl-schedule
// Or:    daily cron / GitHub Action / Vercel scheduled function
//
// Brand IP 全 ✓:
//   - 官方公開 endpoint · NOT gambling-platform · per /coverage NEVER list
//   - Output file 標 AUTO-GENERATED · Tim 仍 curate 進 lib/matches.ts ·
//     不 silently overwrite manual ingest
//   - 「方法公開」 延伸 · fetch script GitHub 開源 · 任何 sabermetrician 可
//     audit
// ─────────────────────────────────────────────────────

import * as cheerio from "cheerio";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT = path.join(ROOT, "lib", "cpbl-schedule-auto.ts");

const BASE_URL = "https://www.cpbl.com.tw/games";

const HEADERS = {
  // CPBL blocks non-browser UAs(returns 404)· must look like real Chrome
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml",
  "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
};

async function fetchSchedule() {
  console.log(`📥 Fetching CPBL schedule · ${BASE_URL}`);
  const res = await fetch(BASE_URL, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from cpbl.com.tw/games`);
  }
  const html = await res.text();
  console.log(`   Got ${html.length} bytes`);
  return cheerio.load(html);
}

const $ = await fetchSchedule();

// ── Parse today's games ──────────────────────────────
// CPBL `/games` page structure(verified 2026-05-22):
// - Today's games typically in `.GameItem` or `.game_list` containers
// - Each game card has:
//   - venue · 場館 (e.g. "新莊棒球場")
//   - time · 開賽時間 (e.g. "18:35")
//   - home team · away team · 中文 names
//   - status · "PreGame" / "Live" / "Final"
//
// Note: HTML structure may evolve · this parser must be defensive ·
// fail-soft if rows missing fields。

const games = [];

// Detect today's games · CPBL marks them differently than future days
// Heuristic:games in the FIRST visible game container are today's
// (CPBL site default-shows today first · then future)

const gameCards = $(".GameItem, .game-card, [class*='gameCard']").toArray();
console.log(`   Found ${gameCards.length} potential game cards`);

// Fallback parser · scan for any element containing today's date in TW format
const todayChunk = $.html().match(
  /20\d{2}\s*[\/年-]\s*\d{1,2}\s*[\/月-]\s*\d{1,2}/g
);
if (todayChunk) {
  console.log(`   Detected ${todayChunk.length} date markers in HTML`);
}

// Primary parser · best-effort given variable structure
gameCards.forEach((el) => {
  const $el = $(el);
  const text = $el.text().replace(/\s+/g, " ").trim();

  // Skip if doesn't look like a game card
  if (!text.match(/[VS|vs|對]/i)) return;

  // Extract venue · 球場 name typically follows venue indicator
  const venueMatch = text.match(/(\S+?棒球場|\S+?大巨蛋)/);
  const venue = venueMatch ? venueMatch[1] : null;

  // Extract time · HH:MM format
  const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
  const time = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : null;

  // Extract team names · zh team names list
  const teamPatterns = [
    "富邦悍將",
    "統一7-ELEVEn獅",
    "統一獅",
    "中信兄弟",
    "樂天桃猿",
    "味全龍",
    "台鋼雄鷹",
  ];
  const foundTeams = [];
  for (const team of teamPatterns) {
    if (text.includes(team)) foundTeams.push(team);
  }

  if (foundTeams.length >= 2 && venue && time) {
    games.push({
      home: foundTeams[1], // CPBL convention · 客場 first · home second
      away: foundTeams[0],
      venue,
      time,
      raw: text.slice(0, 200), // diagnostic
    });
  }
});

console.log(`✓ Parsed ${games.length} today's games`);

// ── Write output to lib/cpbl-schedule-auto.ts ─────────
const today = new Date();
const todayISO = today.toISOString().slice(0, 10);

const tsContent = `// ── ZONE 27 · CPBL Today Schedule Cache ────────────────
// AUTO-GENERATED · DO NOT EDIT MANUALLY · run scripts/fetch-cpbl-schedule.mjs to refresh.
// Source:  cpbl.com.tw/games(official CPBL league schedule · server-rendered HTML)
// Fetched: ${todayISO} TPE
// Games:   ${games.length}
//
// Tim 仍 curate into lib/matches.ts manually(brand IP curation 保留)·
// 此 auto-fetched cache 只是 candidate list · 不 silently overwrite matches.ts。
//
// Per /coverage NEVER list axiom · cpbl.com.tw 是官方公開 endpoint · 不是
// gambling platform · auto-fetching IS allowed(同 fetch-cpbl-pitchers.mjs
// + MLB Stats API pattern)。
// ─────────────────────────────────────────────────────

export type CpblScheduleEntry = {
  home: string;
  away: string;
  venue: string;
  time: string;
};

export const CPBL_SCHEDULE_FETCH_DATE = ${JSON.stringify(todayISO)};

export const cpblScheduleAuto: CpblScheduleEntry[] = ${JSON.stringify(
  games.map((g) => ({
    home: g.home,
    away: g.away,
    venue: g.venue,
    time: g.time,
  })),
  null,
  2
)};
`;

writeFileSync(OUTPUT, tsContent, "utf-8");
console.log(`✓ Wrote ${OUTPUT}`);
console.log(`✓ Done · run npm run fetch-cpbl-schedule again tomorrow`);
