#!/usr/bin/env node
// ── ZONE 27 · 足球鎖定預測「賽後結算」script ─────────────────────────────
// 配 lock-soccer-predictions.mjs。 讀 lib/soccer-locked.json,把已經踢完(FINISHED)但還沒
// 結算的鎖定預測,對「當初鎖定的那組三向機率」評定(三向 · 不是棒球兩向):
//   · 引擎看好邊(homeWin/draw/awayWin 三者 argmax)== 終場結果 → proved
//   · 偏錯邊 → diverged(含輸照掛 · ✕ 跟 ✓ 一樣進分母 · 永不刪)
//   · 引擎三向剛好同分(機率上幾乎不可能)→ push(無偏向 · 不計入分母)
//   🔴 和局**永遠不 push**:和是真實的 1X2 結果,要照常評(押 push 和局 = 偷藏 ~1/4 場 = 報馬仔藏輸)。
//
// 一律對「鎖定值」評,不重算(守先鎖後結 · 防賽後偷改)。 比分走 regulationScore(90 分鐘
// 1X2):⚠️ v4 的 score.fullTime 是「最終」比分 —— 延長賽/PK 進球全被加總(90 分鐘 1-1 ·
// PK 4-3 → fullTime 回 5-4),90 分鐘真比分在 duration!=='REGULAR' 時存於 score.regularTime。
// 我們開的線是 90 分鐘 1X2 → 淘汰賽的延長賽/PK 晉級不影響對帳。 idempotent:已評過跳過。
// AWARDED(棄賽判定)也結算(有官方結果就不留殭屍 pending)。
// 每 3h 跑(GitHub Action)· 0 auth · football-data.org 中立公開比分。
// ─────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { gradeLockedVerdict, regulationScore } from "../lib/soccer/predict-core.mjs";

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
    // 🔴 只查 FINISHED —— football-data v4 沒有 AWARDED 這個 status(v2 才有)· 混進去整條
    // query 會 400 → 永遠回 []（這是足球 cron 結算從沒寫回 verdict 的真因）。 棄賽/walkover
    // 在 v4 也掛 FINISHED,單 FINISHED 已涵蓋。
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
  const store = JSON.parse(readFileSync(LOCK_FILE, "utf8"));
  const pending = (store.predictions ?? []).filter((p) => p.verdict === null);
  if (!token) {
    // 死管線不准沉默:已有「踢完卻沒對帳」的場 = 公開帳本正在當眾過期 →
    // exit 1 讓 Action 變紅(GitHub 會寄失敗通知)。 賽季開打前(沒有過期場)仍 graceful。
    const overdue = pending.filter((p) => {
      const t = Date.parse(p.kickoffISO ?? "");
      return !Number.isNaN(t) && t < Date.now();
    }).length;
    if (overdue > 0) {
      console.error(
        `[grade-soccer] 🔴 ${overdue} 場已開踢/踢完但沒有 FOOTBALL_DATA_API_TOKEN · 公開帳本正在過期。\n` +
          `  修法(2 分鐘):GitHub repo → Settings → Secrets and variables → Actions →\n` +
          `  New repository secret → Name: FOOTBALL_DATA_API_TOKEN · Value: 跟 Vercel env 同一把 token。`,
      );
      process.exit(1);
    }
    console.log("[grade-soccer] no FOOTBALL_DATA_API_TOKEN · skip(graceful · 尚無踢完待對帳的場)");
    return;
  }
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
      if (!m || (m.status !== "FINISHED" && m.status !== "AWARDED")) continue;
      // 90 分鐘 1X2(regulationScore)· 不是 fullTime(那會把延長賽/PK 進球算進來)。
      const reg = regulationScore(m.score);
      if (!reg) {
        // 已 FINISHED/AWARDED 卻取不到正規賽比分(理論上 v4 一定有 regularTime)→
        // 別無聲跳過讓它永久掛 pending · 響亮告警(下一輪會重試,料補回就自動結算)。
        console.error(
          `[grade-soccer] ⚠ ${p.matchId} 已 ${m.status} 但取不到正規賽比分(duration=${m.score?.duration ?? "?"})· 暫不結算 · 下輪重試`,
        );
        continue;
      }
      const { home: h, away: a } = reg;
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
