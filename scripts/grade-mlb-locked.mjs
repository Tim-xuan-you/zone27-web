#!/usr/bin/env node
// ── ZONE 27 · MLB 鎖定預測「賽後結算」script ───────────────
// 配 lock-mlb-predictions.mjs。 讀 lib/mlb-locked.json,把已經打完(Final)
// 但還沒結算的鎖定預測,對「當初鎖定的那個 engineWinHomePct」評定:
//   · home 贏 + 引擎賽前偏 home(>50) → proved
//   · away 贏 + 引擎賽前偏 away(<50) → proved
//   · 偏錯邊 → diverged
//   · 平手 或 引擎剛好 50(無偏向)→ push(不計入分母)
// 一律對「鎖定值」評,不重算(守先鎖後結 · 防賽後偷改)。 idempotent:已評過
// 的(verdict 非 null)跳過。 每天跑(GitHub Action)· 0 auth · MLB 公開 API。
// ─────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCK_FILE = join(HERE, "..", "lib", "mlb-locked.json");
const MLB_API = "https://statsapi.mlb.com/api/v1";
const UA = { "User-Agent": "ZONE-27/0.27 (+zone27-web.vercel.app)" };

async function fetchJson(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.json();
}

function gradeVerdict(homePct, homeRuns, awayRuns) {
  if (homeRuns === awayRuns) return "push"; // 平手 · 不計
  if (homePct === 50) return "push"; // 引擎無偏向 · 不算方向
  const homeWon = homeRuns > awayRuns;
  const engineFavoredHome = homePct > 50;
  return homeWon === engineFavoredHome ? "proved" : "diverged";
}

async function main() {
  if (!existsSync(LOCK_FILE)) {
    console.log("[grade] no lock file · nothing to do");
    return;
  }
  const store = JSON.parse(readFileSync(LOCK_FILE, "utf8"));
  const pending = (store.predictions ?? []).filter((p) => p.verdict === null);
  if (pending.length === 0) {
    console.log("[grade] 0 ungraded · nothing to do");
    return;
  }

  // 依 scheduleDate 分組,一天一個 schedule call(含 linescore 拿 final 比分)
  const byDate = new Map();
  for (const p of pending) {
    const d = p.scheduleDate ?? (p.gameDate ?? "").slice(0, 10);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d).push(p);
  }

  let graded = 0;
  for (const [date, preds] of byDate) {
    let sched;
    try {
      sched = await fetchJson(
        `${MLB_API}/schedule?sportId=1&date=${date}&hydrate=linescore`
      );
    } catch (e) {
      console.error(`[grade] schedule ${date} failed:`, e.message);
      continue;
    }
    const games = (sched.dates ?? []).flatMap((d) => d.games ?? []);
    const byPk = new Map(games.map((g) => [g.gamePk, g]));

    for (const p of preds) {
      const g = byPk.get(p.gamePk);
      if (!g) continue;
      if (g.status?.abstractGameState !== "Final") continue;
      const homeRuns =
        g.linescore?.teams?.home?.runs ?? g.teams?.home?.score ?? null;
      const awayRuns =
        g.linescore?.teams?.away?.runs ?? g.teams?.away?.score ?? null;
      if (homeRuns === null || awayRuns === null) continue;
      p.finalScore = { home: homeRuns, away: awayRuns };
      p.verdict = gradeVerdict(p.engineWinHomePct, homeRuns, awayRuns);
      p.gradedAt = new Date().toISOString();
      graded++;
    }
  }

  writeFileSync(LOCK_FILE, JSON.stringify(store, null, 2) + "\n");
  const decided = store.predictions.filter(
    (p) => p.verdict === "proved" || p.verdict === "diverged"
  );
  const proved = decided.filter((p) => p.verdict === "proved").length;
  console.log(
    `✓ MLB grade · +${graded} newly graded · record so far ${proved}-${
      decided.length - proved
    } (${decided.length} decided · ${
      store.predictions.filter((p) => p.verdict === "push").length
    } push)`
  );
}

main().catch((e) => {
  console.error("[grade-mlb] fatal:", e);
  process.exit(1);
});
