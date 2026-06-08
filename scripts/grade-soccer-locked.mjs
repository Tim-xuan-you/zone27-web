#!/usr/bin/env node
// ── ZONE 27 · 足球鎖定預測「賽後結算」script ─────────────────────────────
// 配 lock-soccer-predictions.mjs。 讀 lib/soccer-locked.json,把已經踢完(FINISHED)但還沒
// 結算的鎖定預測,對「當初鎖定的那組三向機率」評定(三向 · 不是棒球兩向):
//   · 引擎看好邊(homeWin/draw/awayWin 三者 argmax)== 終場結果 → proved
//   · 偏錯邊 → diverged(含輸照掛 · ✕ 跟 ✓ 一樣進分母 · 永不刪)
//   · 引擎三向剛好同分(機率上幾乎不可能)→ push(無偏向 · 不計入分母)
//   🔴 和局**永遠不 push**:和是真實的 1X2 結果,要照常評(押 push 和局 = 偷藏 ~1/4 場 = 報馬仔藏輸)。
//
// 一律對「鎖定值」評,不重算(守先鎖後結 · 防賽後偷改)。 用 score.fullTime(正規賽 1X2 ·
// 延長賽/PK 的晉級不影響我們開的是「90 分鐘 1X2」這條線)。 idempotent:已評過(verdict 非 null)跳過。
// 每 3h 跑(GitHub Action)· 0 auth · football-data.org 中立公開比分。
// ─────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { gradeLockedVerdict } from "../lib/soccer/predict-core.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCK_FILE = join(HERE, "..", "lib", "soccer-locked.json");
const BASE = "https://api.football-data.org/v4";

function getToken() {
  return process.env.FOOTBALL_DATA_API_TOKEN ?? "";
}

async function fetchFd(url, token) {
  const res = await fetch(url, { headers: { "X-Auth-Token": token } });
  if (res.status === 429) {
    const reset = Number(
      res.headers.get("X-RequestCounter-Reset") ||
        res.headers.get("X-Requests-Available-Minute") ||
        60,
    );
    const waitMs = (Number.isFinite(reset) ? reset : 60) * 1000 + 1000;
    console.error(`[grade-soccer] 429 rate-limited · wait ${Math.round(waitMs / 1000)}s`);
    await new Promise((r) => setTimeout(r, waitMs));
    const retry = await fetch(url, { headers: { "X-Auth-Token": token } });
    if (!retry.ok) throw new Error(`fetch ${url} → ${retry.status}`);
    return retry.json();
  }
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.json();
}

async function fetchFinished(code, token) {
  try {
    const data = await fetchFd(
      `${BASE}/competitions/${code}/matches?status=FINISHED`,
      token,
    );
    return Array.isArray(data?.matches) ? data.matches : [];
  } catch (e) {
    console.error(`[grade-soccer] ${code} FINISHED failed:`, e.message);
    return [];
  }
}

async function main() {
  if (!existsSync(LOCK_FILE)) {
    console.log("[grade-soccer] no lock file · nothing to do");
    return;
  }
  const token = getToken();
  if (!token) {
    console.log("[grade-soccer] no FOOTBALL_DATA_API_TOKEN · skip(graceful)");
    return;
  }
  const store = JSON.parse(readFileSync(LOCK_FILE, "utf8"));
  const pending = (store.predictions ?? []).filter((p) => p.verdict === null);
  if (pending.length === 0) {
    console.log("[grade-soccer] 0 ungraded · nothing to do");
    return;
  }

  // 依競賽分組,一個競賽抓一次 FINISHED(含 fullTime 比分),再對號入座。
  const byCode = new Map();
  for (const p of pending) {
    const code = p.competitionCode;
    if (!code) continue;
    if (!byCode.has(code)) byCode.set(code, []);
    byCode.get(code).push(p);
  }

  let graded = 0;
  const gradedAt = new Date().toISOString();
  for (const [code, preds] of byCode) {
    const finished = await fetchFinished(code, token);
    const byId = new Map(finished.map((m) => [`fd-${m.id}`, m]));
    for (const p of preds) {
      const m = byId.get(p.matchId);
      if (!m || m.status !== "FINISHED") continue;
      const h = m.score?.fullTime?.home;
      const a = m.score?.fullTime?.away;
      if (typeof h !== "number" || typeof a !== "number") continue;
      p.finalScore = { home: h, away: a };
      const { outcome, verdict } = gradeLockedVerdict(p.homeWin, p.draw, p.awayWin, h, a);
      p.outcome = outcome;
      p.verdict = verdict;
      p.gradedAt = gradedAt;
      graded++;
    }
  }

  writeFileSync(LOCK_FILE, JSON.stringify(store, null, 2) + "\n");
  const decided = store.predictions.filter(
    (p) => p.verdict === "proved" || p.verdict === "diverged",
  );
  const proved = decided.filter((p) => p.verdict === "proved").length;
  const push = store.predictions.filter((p) => p.verdict === "push").length;
  console.log(
    `✓ soccer grade · +${graded} newly graded · record so far ${proved}-${
      decided.length - proved
    } (${decided.length} decided · ${push} push)`,
  );
}

main().catch((e) => {
  console.error("[grade-soccer] fatal:", e);
  process.exit(1);
});
