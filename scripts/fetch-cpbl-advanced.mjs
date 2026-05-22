// ── ZONE 27 · CPBL Advanced Stats Auto-fetch ───────────
// Round 31 W-U · Tim「不是說台灣 CPBL 有開放什麼新的進階數據網站?
// 免費的?為何不能使用?」 surface 了之前 W-I 只爬主站(K/BB/HR 基礎
// stats)· 沒爬 stats.cpbl.com.tw(野球革命 + Trackman radar 整合 ·
// 試營運上線)Statcast-grade advanced metrics 大金礦。
//
// Stats available per pitcher individual page(/players/{acnt}):
//   · 加權上壘率(wOBA-against)中職百分位
//   · 三振%(K%) 中職百分位
//   · 揮空%(Whiff%)中職百分位
//   · 強擊球率(Hard-Hit%)中職百分位
//   · 擊球初速 Avg / Max 中職百分位
//   · 球速(Fastball Speed)等
//
// 比 W-I per-9 stats 強的點:
//   · 真實 Trackman radar 追蹤 · 不是手算
//   · Statcast-grade · MLB 同等 sabermetric 定義
//   · 中職百分位(percentile)· 直接套 StatPercentileBar 視覺
//
// Pipeline:
//   1. 讀 lib/cpbl-pitchers.ts(W-I 已 fetch · 含 acnt 欄位)
//   2. For each pitcher with acnt → fetch stats.cpbl.com.tw/players/{acnt}
//   3. 從 JSON-embedded "中職百分位","value":N pattern regex extract
//   4. Output to lib/cpbl-advanced.ts(TypeScript const lookup)
//
// Run: node scripts/fetch-cpbl-advanced.mjs
// Or: npm run fetch-cpbl-advanced
// ─────────────────────────────────────────────────────

import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const INPUT = path.join(ROOT, "lib", "cpbl-pitchers.ts");
const OUTPUT = path.join(ROOT, "lib", "cpbl-advanced.ts");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml",
  "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
};

// Read acnts from cpbl-pitchers.ts(raw text · we parse JSON array out)
console.log(`📥 Reading ${INPUT}`);
const pitchersContent = readFileSync(INPUT, "utf8");
const arrayMatch = pitchersContent.match(/cpblPitchers[^=]*=\s*(\[[\s\S]*?\]);/);
if (!arrayMatch) {
  console.error("❌ Could not parse cpblPitchers array from cpbl-pitchers.ts");
  process.exit(1);
}
const pitchers = JSON.parse(arrayMatch[1]);
console.log(`   Found ${pitchers.length} pitchers in basic stats lookup`);

const withAcnt = pitchers.filter((p) => p.acnt);
console.log(`   ${withAcnt.length} have acnt · will fetch advanced stats`);

// Per pitcher · fetch stats.cpbl.com.tw/players/{acnt} · parse percentile values
const advanced = [];

for (const p of withAcnt) {
  const url = `https://stats.cpbl.com.tw/players/${p.acnt}`;
  console.log(`📥 ${p.name} (${p.acnt}) · fetching...`);

  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      console.log(`   ⚠️  HTTP ${res.status} · skip`);
      continue;
    }
    const html = await res.text();

    // Parse "中職百分位","value":N pattern · context-aware match
    // Each percentile block 在 HTML 內前面有 stat 中文名 · 用 context regex
    const stats = {
      acnt: p.acnt,
      name: p.name,
      team: p.team,
      wobaAgainst: extractPercentile(html, "加權上壘率"),
      kPct: extractPercentile(html, "三振%"),
      bbPct: extractPercentile(html, "保送%"),
      whiffPct: extractPercentile(html, "揮空%"),
      hardHitPct: extractPercentile(html, "強擊球率"),
      exitVeloAvg: extractPercentile(html, "擊球初速 Avg"),
      exitVeloMax: extractPercentile(html, "擊球初速 Max"),
    };

    // Skip if 0 advanced stats found(player has no Trackman data yet)
    const nonNullCount = Object.values(stats).filter(
      (v) => typeof v === "number" && Number.isFinite(v)
    ).length;
    if (nonNullCount === 0) {
      console.log(`   ⚠️  no advanced stats found(no Trackman data yet?)· skip`);
      continue;
    }

    advanced.push(stats);
    console.log(
      `   ✓ wOBA=${stats.wobaAgainst} · K%=${stats.kPct} · 揮空%=${stats.whiffPct} · 強擊球=${stats.hardHitPct}`
    );

    // Polite delay between requests(no hammering)
    await new Promise((r) => setTimeout(r, 500));
  } catch (err) {
    console.log(`   ⚠️  ${err.message} · skip`);
  }
}

console.log(`\n✅ Fetched advanced stats for ${advanced.length} pitchers`);

// Output as TypeScript const
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());

const tsContent = `// ── ZONE 27 · CPBL Advanced Stats Cache ────────────────
// AUTO-GENERATED · DO NOT EDIT MANUALLY · run scripts/fetch-cpbl-advanced.mjs to refresh.
// Source:  stats.cpbl.com.tw /players/{acnt}(野球革命 + Trackman radar 整合)
// Fetched: ${today} TPE
// Pitchers: ${advanced.length}
//
// All values are 中職百分位(0-100 · 100 = elite · 0 = poor)derived
// from Trackman radar tracking data. Statcast-grade advanced metrics
// far superior to the per-9 basic stats in cpbl-pitchers.ts(K/9 etc.).
//
// Use \`getCpblAdvancedByAcnt(acnt)\` or \`getCpblAdvancedByName(name)\`
// from PitcherCard / display layer to lookup percentile bars。
// ─────────────────────────────────────────────────────

export type CpblAdvancedStats = {
  acnt: string;
  name: string;
  team: string;
  /** 加權上壘率(wOBA-against)百分位 0-100 · 投手:低 = 好 */
  wobaAgainst: number | null;
  /** 三振%(K%)百分位 · 高 = 好 */
  kPct: number | null;
  /** 保送%(BB%)百分位 · 低 = 好 */
  bbPct: number | null;
  /** 揮空%(Whiff%)百分位 · 高 = 好 */
  whiffPct: number | null;
  /** 強擊球率(Hard-Hit%)百分位 · 投手:低 = 好 */
  hardHitPct: number | null;
  /** 擊球初速 Avg 百分位 · 投手:低 = 好 */
  exitVeloAvg: number | null;
  /** 擊球初速 Max 百分位 · 投手:低 = 好 */
  exitVeloMax: number | null;
};

export const CPBL_ADVANCED_FETCH_DATE = "${today}";

export const cpblAdvanced: CpblAdvancedStats[] = ${JSON.stringify(advanced, null, 2)};

export function getCpblAdvancedByAcnt(acnt: string): CpblAdvancedStats | null {
  return cpblAdvanced.find((p) => p.acnt === acnt) ?? null;
}

export function getCpblAdvancedByName(name: string): CpblAdvancedStats | null {
  return cpblAdvanced.find((p) => p.name === name) ?? null;
}
`;

writeFileSync(OUTPUT, tsContent, "utf8");
console.log(`✅ Wrote ${OUTPUT}`);

// ── helper · regex extract percentile by stat name ─────
function extractPercentile(html, statName) {
  // Pattern: "<statName> 中職百分位","value":<N>
  // %  in 三振% etc 不需 escape · `/u` mode strict 拒絕 unnecessary escape
  // 只 escape regex meta chars(.*+?^${}()|[]\)
  const escaped = statName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`"${escaped}\\s*中職百分位"[^}]*"value":\\s*(\\d+)`, "u");
  const m = html.match(regex);
  if (!m) return null;
  const v = parseInt(m[1], 10);
  return Number.isFinite(v) ? v : null;
}
