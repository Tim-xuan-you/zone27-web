#!/usr/bin/env node
// ── ZONE 27 · MLB 引擎開盤線「賽前鎖定」script ─────────────
// Tim 2026-06-03:「太慢了!直接把 MLB 接進來,樣本多更好調引擎。」
//
// lib/mlb.ts 早就會即時算 engineWinHomePct + 賽後 grade,但一直「NOT 進
// track record」—— 因為它是 LIVE re-compute、沒有賽前鎖定(賽後可能偷改 =
// 不誠實)。 這支 script 補上唯一缺的那塊:把「還沒開打(Preview)」場次的
// 引擎開盤線鎖進 lib/mlb-locked.json + 記 lockedAt 時間戳。 git commit 本身
// = 公開的「賽前鎖定」證據(同 CPBL lib/matches.ts 的 commit-as-lock 紀律)。
// 賽後由 grade-mlb-locked.mjs 對「鎖定的那個數字」評 proved / diverged →
// 才有資格進引擎 MLB 戰績(跟 CPBL 戰績分開計、清楚標示「累積驗證中」)。
//
// 每天跑一次(GitHub Action cron)· idempotent:已鎖過的 gamePk 不重鎖。
// 0 auth · 0 付費 · 純 MLB Stats API 公開資料。
// ─────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCK_FILE = join(HERE, "..", "lib", "mlb-locked.json");
const MLB_API = "https://statsapi.mlb.com/api/v1";
const UA = { "User-Agent": "ZONE-27/0.27 (+zone27.com.tw)" };
// 上限:只留最近 N 筆(避免檔案無限長大 · 夠 /track-record 顯示 + 校準計算)
const MAX_KEEP = 600;

// 引擎開盤線公式 · 完全照 lib/mlb.ts computeEngineWinHomePct(保持站上一致)。
// baseHome 54(MLB 主場優勢)+ 投手 ERA/K9/HR9 差 · clamp [25,80](不假裝 >80%)。
function computeHomePct(h, a) {
  const hera = parseFloat(h.era), aera = parseFloat(a.era);
  const hk9 = parseFloat(h.k9), ak9 = parseFloat(a.k9);
  const hhr9 = parseFloat(h.hr9), ahr9 = parseFloat(a.hr9);
  if ([hera, aera, hk9, ak9, hhr9, ahr9].some((n) => !Number.isFinite(n)))
    return null;
  const edge = (aera - hera) * 4 + (hk9 - ak9) * 2 + (ahr9 - hhr9) * 6;
  return Math.max(25, Math.min(80, Math.round(54 + edge)));
}

function ymdTaipei(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.json();
}

async function fetchPitcherStats(ids, season) {
  const out = new Map();
  if (ids.length === 0) return out;
  const url = `${MLB_API}/people?personIds=${ids.join(
    ","
  )}&hydrate=stats(group=[pitching],type=[season],season=${season})`;
  const data = await fetchJson(url);
  for (const p of data.people ?? []) {
    const stat = p.stats
      ?.flatMap((s) => s.splits ?? [])
      .find((sp) => sp?.stat)?.stat;
    if (!stat) continue;
    out.set(p.id, {
      fullName: p.fullName,
      era: stat.era ?? "—",
      k9: stat.strikeoutsPer9Inn ?? "—",
      bb9: stat.walksPer9Inn ?? "—",
      hr9: stat.homeRunsPer9 ?? "—",
    });
  }
  return out;
}

async function main() {
  const existing =
    existsSync(LOCK_FILE) &&
    (() => {
      try {
        return JSON.parse(readFileSync(LOCK_FILE, "utf8"));
      } catch {
        return null;
      }
    })();
  const store = existing && Array.isArray(existing.predictions)
    ? existing
    : { predictions: [] };
  const lockedPks = new Set(store.predictions.map((p) => p.gamePk));
  const lockedAt = new Date().toISOString();

  // 鎖「今天 + 明天(台北)」尚未開打的場次(MLB 美國夜場 = 台北凌晨/上午,
  // 跨日 · 抓兩天才不漏)。 已 final / live 的不鎖(只鎖 Preview = 還沒打)。
  const dates = [ymdTaipei(0), ymdTaipei(1)];
  let added = 0;

  for (const date of dates) {
    let sched;
    try {
      sched = await fetchJson(
        `${MLB_API}/schedule?sportId=1&date=${date}&hydrate=probablePitcher`
      );
    } catch (e) {
      console.error(`[lock] schedule ${date} failed:`, e.message);
      continue;
    }
    const games = (sched.dates ?? []).flatMap((d) => d.games ?? []);
    const previews = games.filter(
      (g) => g.status?.abstractGameState === "Preview"
    );
    const pids = new Set();
    for (const g of previews) {
      [
        g.teams?.home?.probablePitcher?.id,
        g.teams?.away?.probablePitcher?.id,
      ].forEach((id) => id && pids.add(id));
    }
    const stats = await fetchPitcherStats([...pids], date.slice(0, 4));

    for (const g of previews) {
      if (lockedPks.has(g.gamePk)) continue;
      const hpId = g.teams?.home?.probablePitcher?.id;
      const apId = g.teams?.away?.probablePitcher?.id;
      if (!hpId || !apId) continue;
      const hs = stats.get(hpId);
      const as = stats.get(apId);
      if (!hs || !as) continue;
      const homePct = computeHomePct(hs, as);
      if (homePct === null) continue; // 某投手尚無本季數據(—)→ 不開盤(誠實)

      store.predictions.push({
        gamePk: g.gamePk,
        gameDate: g.gameDate,
        scheduleDate: date,
        homeId: g.teams.home.team.id,
        homeEn: g.teams.home.team.name,
        homeRecord: `${g.teams.home.leagueRecord?.wins ?? 0}-${
          g.teams.home.leagueRecord?.losses ?? 0
        }`,
        awayId: g.teams.away.team.id,
        awayEn: g.teams.away.team.name,
        awayRecord: `${g.teams.away.leagueRecord?.wins ?? 0}-${
          g.teams.away.leagueRecord?.losses ?? 0
        }`,
        homePitcher: hs.fullName,
        awayPitcher: as.fullName,
        homeStats: { era: hs.era, k9: hs.k9, bb9: hs.bb9, hr9: hs.hr9 },
        awayStats: { era: as.era, k9: as.k9, bb9: as.bb9, hr9: as.hr9 },
        engineWinHomePct: homePct,
        lockedAt,
        finalScore: null, // grade script 填
        verdict: null, // proved / diverged / tie · grade script 填
      });
      lockedPks.add(g.gamePk);
      added++;
    }
  }

  // 🔴 護城河:已評分的收據(verdict 非 null)= 刪不掉的公開帳本,永不丟。
  // 只有「還沒結算的 pending 鎖定」在爆量時才修剪(留最近 MAX_KEEP 筆)· 避免無限長大;
  // 絕不像舊版 slice(-MAX_KEEP) 那樣連最早的『已評分』收據一起從帳本前端刪掉
  //(那正是報馬仔「輸了刪文」· 我們存在就是要取代它)。
  const graded = store.predictions.filter((p) => p.verdict != null);
  const pending = store.predictions.filter((p) => p.verdict == null);
  const keptPending =
    pending.length > MAX_KEEP ? pending.slice(-MAX_KEEP) : pending;
  store.predictions = [...graded, ...keptPending].sort((a, b) =>
    a.gameDate < b.gameDate ? -1 : a.gameDate > b.gameDate ? 1 : 0
  );

  mkdirSync(dirname(LOCK_FILE), { recursive: true });
  writeFileSync(LOCK_FILE, JSON.stringify(store, null, 2) + "\n");
  console.log(
    `✓ MLB lock · +${added} new · total ${store.predictions.length} locked predictions`
  );
}

main().catch((e) => {
  console.error("[lock-mlb] fatal:", e);
  process.exit(1);
});
