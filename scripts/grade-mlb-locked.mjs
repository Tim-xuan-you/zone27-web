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
const UA = { "User-Agent": "ZONE-27/0.27 (+zone27.com.tw)" };

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

// 兩個 YYYY-MM-DD 差幾天(絕對值)· 解析不了 → null。
function dayDiff(a, b) {
  const ta = Date.parse(`${a}T00:00:00Z`);
  const tb = Date.parse(`${b}T00:00:00Z`);
  if (Number.isNaN(ta) || Number.isNaN(tb)) return null;
  return Math.abs(ta - tb) / 86400000;
}

// YYYY-MM-DD 位移 N 天 · 解析不了 → null。
function shiftYmd(ymd, days) {
  const t = Date.parse(`${ymd}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return new Date(t + days * 86400000).toISOString().slice(0, 10);
}

// ── 延賽/改期補查(R296)──────────────────────────────
// 主迴圈按「鎖定當天」查 schedule → 改期場(MLB 同 gamePk 換 officialDate)在舊日期上
// 永遠等不到 Final = 永久 pending(實例:823613 6/22 鎖 → 6/24 補打完 10:3,三週沒人結)。
// 這段對「鎖定日已過 ≥36h 仍沒結果」的場逐 gamePk 直查 live feed:
//   · officialDate 距鎖定日 ≤1 天(當天完賽 / 隔天補完)→ 照常對鎖定值評(同一場球)。
//   · 改期 ≥2 天 → 停審退回(verdict "void" + postponedTo):鎖的線是對「那天那兩位先發」
//     開的,改期後先發重排 · 舊線不描述新場 → 不進任何分母(同運彩「先發異動退注」慣例 ·
//     誠實:不拿六月的線去評八月的比賽)。 比分照存(finalScore)—— 用戶押「誰贏」不綁
//     先發,個人帳本照結;只有引擎的線停審。
//   · 改期但還沒打 → 先記 postponedTo + void(前台可標「延賽」);打完後這裡會補寫比分。
async function sweepRescheduled(store) {
  const now = Date.now();
  const todayYmd = new Date(now).toISOString().slice(0, 10);
  const stragglers = (store.predictions ?? []).filter((p) => {
    const started = Date.parse(p.gameDate ?? "");
    const stale = !Number.isNaN(started) && now - started > 36 * 3600 * 1000;
    // 已知改到未來的場(postponedTo 還沒到)不用每天白打 feed —— 補賽日起才恢復追
    //(UTC vs 美東差最多提早一天恢復 · 無害)。 整季延賽會累積,這行擋掉線性長大的日常請求。
    if (p.postponedTo && p.postponedTo > todayYmd) return false;
    // void 但還沒有比分的改期場也持續追(補 finalScore 給個人帳本結算用)。
    return stale && (p.verdict === null || (p.verdict === "void" && !p.finalScore));
  });
  let graded = 0;
  let voided = 0;
  for (const p of stragglers) {
    let feed;
    try {
      feed = await fetchJson(
        `https://statsapi.mlb.com/api/v1.1/game/${p.gamePk}/feed/live`
      );
    } catch (e) {
      console.error(`[grade] feed ${p.gamePk} failed:`, e.message);
      continue;
    }
    const official = feed?.gameData?.datetime?.officialDate;
    const state = feed?.gameData?.status?.abstractGameState;
    // 「鎖定日」以 scheduleDate 為準;缺的話退 gameDate(UTC ISO)—— 但美東晚場的 UTC
    // 日期常比 officialDate(美國當地日)大一天,直接切字串會把「延一天」誤算成 moved=2
    // 而錯誤停審 → 同時比對 slice 與 slice−1 天,取最小位移(寧可少停審、不錯殺有效線)。
    const sliced = (p.gameDate ?? "").slice(0, 10);
    const lockedDays = p.scheduleDate
      ? [p.scheduleDate]
      : [sliced, shiftYmd(sliced, -1)].filter(Boolean);
    const moved = official
      ? Math.min(
          ...lockedDays.map((d) => dayDiff(official, d)).filter((x) => x !== null),
          Infinity
        )
      : null;

    if (Number.isFinite(moved) && moved >= 2) {
      p.postponedTo = official;
      if (p.verdict === null) {
        p.verdict = "void"; // 停審退回 · 不進分母
        p.gradedAt = new Date().toISOString();
        voided++;
      }
    }
    if (state !== "Final") continue;
    const ls = feed?.liveData?.linescore?.teams;
    const h = ls?.home?.runs;
    const a = ls?.away?.runs;
    if (typeof h !== "number" || typeof a !== "number") continue;
    p.finalScore = { home: h, away: a };
    if (p.verdict === null) {
      // 沒改期(≤1 天)· 照常對鎖定值評。
      p.verdict = gradeVerdict(p.engineWinHomePct, h, a);
      p.gradedAt = new Date().toISOString();
      graded++;
    }
  }
  return { graded, voided };
}

async function main() {
  if (!existsSync(LOCK_FILE)) {
    console.log("[grade] no lock file · nothing to do");
    return;
  }
  const store = JSON.parse(readFileSync(LOCK_FILE, "utf8"));
  const pending = (store.predictions ?? []).filter((p) => p.verdict === null);
  // 🔴 0 pending 也不能提前 return:延賽補查(sweepRescheduled)還要幫「void 但還沒有
  // 比分」的改期場補 finalScore(個人帳本靠它結算)· byDate 空迴圈本來就是 no-op。

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

  // 延賽/改期補查(schedule 查不到的 stale 場逐 gamePk 直查 · 見上方註解)。
  const swept = await sweepRescheduled(store);

  writeFileSync(LOCK_FILE, JSON.stringify(store, null, 2) + "\n");
  const decided = store.predictions.filter(
    (p) => p.verdict === "proved" || p.verdict === "diverged"
  );
  const proved = decided.filter((p) => p.verdict === "proved").length;
  console.log(
    `✓ MLB grade · +${graded + swept.graded} newly graded · +${
      swept.voided
    } postponed-void · record so far ${proved}-${
      decided.length - proved
    } (${decided.length} decided · ${
      store.predictions.filter((p) => p.verdict === "push").length
    } push · ${
      store.predictions.filter((p) => p.verdict === "void").length
    } void)`
  );
}

main().catch((e) => {
  console.error("[grade-mlb] fatal:", e);
  process.exit(1);
});
