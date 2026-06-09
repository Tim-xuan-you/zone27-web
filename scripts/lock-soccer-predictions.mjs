#!/usr/bin/env node
// ── ZONE 27 · 足球引擎開盤線「賽前鎖定」script ──────────────────────────
// 鏡 MLB 的 lock-mlb-predictions.mjs。 站上 lib/soccer/football-data.ts 會即時算引擎開盤
// (Dixon-Coles + 自建 Elo),但「即時算」會隨賽程/戰績更新而漂 → 不能直接進戰績(賽後可能
// 偷改 = 不誠實)。 這支補上唯一缺的那塊:把「還沒開踢」場次的引擎開盤鎖進 lib/soccer-locked.json
// + 記 lockedAt。 git commit 本身 = 公開的「賽前鎖定」證據。 賽後由 grade-soccer-locked.mjs 對
// 「鎖定的那組機率」評 proved / diverged(三向 · 含輸照掛)。
//
// 🔴 零 drift 命門:本 script 跟站上 import **同一份** lib/soccer/*-core.mjs 純數學(predict-core
//   / engine-core / elo-core / teams-data)→ 鎖進 JSON 的數字 == 站上顯示的數字。 絕不自己另抄公式。
//
// 每 3h 跑一次(GitHub Action cron)· idempotent:已鎖過的 matchId 不重鎖(鎖定 = 改不了的帳本)。
// 0 auth(只用 football-data.org 中立公開賽程)· 0 付費 · 絕不抓盤口。
// 缺 FOOTBALL_DATA_API_TOKEN → 乾淨跳過(graceful · exit 0 · 不寫假資料)。
// ─────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { toDisplayPercents } from "../lib/soccer/engine-core.mjs";
import {
  computeCompetitionPredictions,
  toScheduledInput,
  toResultInput,
  isLockable,
  enginePickOf,
} from "../lib/soccer/predict-core.mjs";
import {
  ACTIVE_COMPETITIONS,
  getCompetition,
} from "../lib/soccer/competitions.mjs";
import { getNationalZh } from "../lib/soccer/teams-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCK_FILE = join(HERE, "..", "lib", "soccer-locked.json");
const BASE = "https://api.football-data.org/v4";
// 只留最近 N 筆(避免檔案無限長大 · 夠戰績/校準顯示)。
const MAX_KEEP = 800;
// 鎖「未來 N 天內開踢」的場 = 接近開賽才鎖(同 MLB「今天+明天」精神)。 Tim:提前太多天鎖
// 沒意義(賽前還有傷兵/陣容變化),開賽前再鎖即可 → 收到 2 天(每 3h 一跑 · 場進窗就鎖)。
const LOCK_HORIZON_DAYS = 2;

function getToken() {
  return process.env.FOOTBALL_DATA_API_TOKEN ?? "";
}

/** 打 football-data · 遇 429 讀重置秒數等一輪重試一次 · 其餘錯往上丟。 */
async function fetchFd(url, token) {
  const res = await fetch(url, { headers: { "X-Auth-Token": token } });
  if (res.status === 429) {
    const reset = Number(
      res.headers.get("X-RequestCounter-Reset") ||
        res.headers.get("X-Requests-Available-Minute") ||
        60,
    );
    const waitMs = (Number.isFinite(reset) ? reset : 60) * 1000 + 1000;
    console.error(`[lock-soccer] 429 rate-limited · wait ${Math.round(waitMs / 1000)}s`);
    await new Promise((r) => setTimeout(r, waitMs));
    const retry = await fetch(url, { headers: { "X-Auth-Token": token } });
    if (!retry.ok) throw new Error(`fetch ${url} → ${retry.status}`);
    return retry.json();
  }
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.json();
}

/** 抓某競賽某狀態的比賽 · graceful 回空。 */
async function fetchMatches(code, status, token) {
  try {
    const data = await fetchFd(
      `${BASE}/competitions/${code}/matches?status=${status}`,
      token,
    );
    return Array.isArray(data?.matches) ? data.matches : [];
  } catch (e) {
    console.error(`[lock-soccer] ${code} ${status} failed:`, e.message);
    return [];
  }
}

/** 顯示名(provenance):國家隊→中文(teams-data 有);俱樂部中文字典是 .ts、Node 拿不到
 *  → fallback 英文 seed(UI 端 displayName 才會補俱樂部中文 · JSON 存英文不影響展示)。 */
function displayName(t) {
  return getNationalZh(t?.name ?? "") ?? t?.shortName ?? t?.tla ?? t?.name ?? "?";
}

async function main() {
  const token = getToken();
  if (!token) {
    console.log("[lock-soccer] no FOOTBALL_DATA_API_TOKEN · skip(graceful)");
    return;
  }

  const existing =
    existsSync(LOCK_FILE) &&
    (() => {
      try {
        const s = JSON.parse(readFileSync(LOCK_FILE, "utf8"));
        return s && Array.isArray(s.predictions) ? s : null;
      } catch {
        return null;
      }
    })();
  const store = existing || { predictions: [] };
  const lockedIds = new Set(store.predictions.map((p) => p.matchId));
  const lockedAt = new Date().toISOString();
  const now = Date.now();
  const horizonMs = now + LOCK_HORIZON_DAYS * 24 * 3600 * 1000;
  let added = 0;

  for (const code of ACTIVE_COMPETITIONS) {
    const comp = getCompetition(code);
    if (!comp) continue;

    const scheduledRaw = await fetchMatches(code, "SCHEDULED,TIMED", token);
    // 還沒開踢(status + utcDate 未來,留 5 分鐘緩衝)且在未來 N 天窗內。
    const lockable = scheduledRaw.filter((m) => {
      if (!isLockable(m, now)) return false;
      const ko = Date.parse(m.utcDate ?? "");
      return !Number.isNaN(ko) && ko <= horizonMs;
    });
    if (lockable.length === 0) continue;

    // 俱樂部要本季已結束比賽算 Elo;國家隊走 teams seed(賽事內無歷史)。
    const finishedRaw = comp.isNationalTeam
      ? []
      : await fetchMatches(code, "FINISHED", token);

    const scheduledInputs = lockable.map(toScheduledInput);
    const finishedResults = finishedRaw.map(toResultInput).filter(Boolean);
    const core = computeCompetitionPredictions(
      { code: comp.code, isNationalTeam: comp.isNationalTeam },
      finishedResults,
      scheduledInputs,
    );

    core.forEach((c, i) => {
      if (lockedIds.has(c.id)) return; // 已鎖 · 永不覆蓋
      if (!c.prediction) return; // 覆蓋建置中(實力分不足)· 不鎖假盤
      const raw = lockable[i];
      const pred = c.prediction;
      const disp = toDisplayPercents(pred);
      store.predictions.push({
        matchId: c.id,
        competitionCode: comp.code,
        competitionName: comp.name,
        kickoffISO: c.dateISO,
        status: c.status,
        homeSeed: c.homeSeed,
        awaySeed: c.awaySeed,
        home: displayName(raw?.homeTeam),
        away: displayName(raw?.awayTeam),
        // provenance(給站上「顯示鎖定線」重現 predictSoccer · 零 drift)
        ratingHome: c.ratingHome,
        ratingAway: c.ratingAway,
        homeAdvantage: c.homeAdvantage,
        // 餵進比分表的兩邊預期進球 λ(overlay 用 predictFromGoals 重現鎖定線 · 俱樂部/國家隊共用)
        xgHome: pred.xgHome,
        xgAway: pred.xgAway,
        // 鎖定的引擎開盤:raw 0-1(給 RPS/校準)+ 整數展示 + 看好邊
        homeWin: pred.homeWin,
        draw: pred.draw,
        awayWin: pred.awayWin,
        homeWinPct: disp.homeWin,
        drawPct: disp.draw,
        awayWinPct: disp.awayWin,
        enginePick: enginePickOf(pred),
        lockedAt,
        // 賽後 grade-soccer-locked.mjs 填:
        finalScore: null,
        outcome: null,
        verdict: null,
        gradedAt: null,
      });
      lockedIds.add(c.id);
      added++;
    });
  }

  // 🔴 護城河:已評分的收據(verdict 非 null)= 刪不掉的公開帳本,永不丟。
  // 只有「還沒結算的 pending 鎖定」在爆量時才修剪(留最近 MAX_KEEP 筆)· 避免無限長大;
  // 絕不像舊版 slice(-MAX_KEEP) 那樣連最早的『已評分』收據一起從帳本前端刪掉
  //(那正是報馬仔「輸了刪文」· 我們存在就是要取代它)。 鏡 lock-mlb-predictions.mjs 同款護城河。
  const graded = store.predictions.filter((p) => p.verdict != null);
  const pending = store.predictions.filter((p) => p.verdict == null);
  const keptPending =
    pending.length > MAX_KEEP ? pending.slice(-MAX_KEEP) : pending;
  store.predictions = [...graded, ...keptPending].sort((a, b) =>
    (a.kickoffISO ?? "") < (b.kickoffISO ?? "")
      ? -1
      : (a.kickoffISO ?? "") > (b.kickoffISO ?? "")
        ? 1
        : 0,
  );

  mkdirSync(dirname(LOCK_FILE), { recursive: true });
  writeFileSync(LOCK_FILE, JSON.stringify(store, null, 2) + "\n");
  console.log(
    `✓ soccer lock · +${added} new · total ${store.predictions.length} locked predictions`,
  );
}

main().catch((e) => {
  console.error("[lock-soccer] fatal:", e);
  process.exit(1);
});
