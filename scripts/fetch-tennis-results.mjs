#!/usr/bin/env node
// ── ZONE 27 · 網球官方賽果自動鏡像 script ────────────────
// 解的痛點:網球賽果一直靠 Tim 手動截圖 + Claude 比對打字。 MLB / 足球 / CPBL 早就 GitHub
// Action 自動結算,網球是唯一還在純手動的。 這支把 ESPN 公開 tennis scoreboard 的「已打完
// 單打」一次抓下來,寫成 lib/tennis-results.json(賽果鏡像)。
//
// 配對 + 算 PROVED/DIVERGED 不在這裡 —— 那留在 lib/tennis/results.ts(用 draw 的英文名 en 比對
// 鏡像 winner/loser · 手動 finalResult 永遠優先 · 對不到一律退手動 = 不毒害帳本)。 這支只負責
// 「忠實鏡像官方比分」。 display 仍是運彩中文名(draw 的 zh);鏡像只用英文名當對帳 key。
//
// 資料來源(2026-06-25 實測 · 0 auth / 0 付費 / 0 secret · 官方公開):
//   GET https://site.api.espn.com/apis/site/v2/sports/tennis/{atp|wta}/scoreboard?dates=YYYYMMDD
//   結構:events[](賽事)→ groupings[](男單/女單/雙打…)→ competitions[](逐場)。
//   只取 grouping = "…Singles" + status.type.completed=true + 兩位 competitor。
//   winner = competitor.winner===true · 名字 = athlete.fullName · 比分 = linescores[].value。
//
// 紅線(守帳本誠實 · 同 CPBL):
//   · fail-soft:抓失敗 → 保留上一版好 json(絕不寫空檔/半截把歷史洗掉)。
//   · 鏡像已 stale(> STALE_DAYS 天)還抓不到 → exit 1 報警(死管線浮上來)· 還新鮮的單次 blip → 容忍。
//   · 只「聯集合併」:已在檔裡的對戰永不刪、只新增 / 更新 · idempotent · 可重複跑。
//   · 只單打(雙打的 athlete 是兩人 · 跟我們單打 draw 對不上 · 直接不收)。
//
// Run:   node scripts/fetch-tennis-results.mjs       (或 GitHub Action 每 3h 跑)
// ─────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "lib", "tennis-results.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const TOURS = ["atp", "wta"];
// 賽事多橫跨約一週 · 抓最近 N 天(scoreboard?dates 回「那天前後在打的賽事 + 該賽事全部已完場」)。
// 多查幾天 union 去重 = 不漏剛結束的賽事。
const WINDOW_DAYS = 6;

function ymd(d) {
  return (
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, "0") +
    String(d.getUTCDate()).padStart(2, "0")
  );
}

async function fetchScoreboard(tour, dateStr) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/tennis/${tour}/scoreboard?dates=${dateStr}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`GET ${tour} ${dateStr} → HTTP ${res.status}`);
  return res.json();
}

function isSinglesGrouping(g) {
  const name = g?.grouping?.displayName ?? g?.displayName ?? "";
  return /singles/i.test(name) && !/doubles/i.test(name);
}

// 從一場 competition 取出一筆賽果 record(已完場單打)· 取不出乾淨資料 → null(略過,不硬寫)。
function toRecord(tour, ev, g, comp) {
  const st = comp?.status?.type;
  if (!st?.completed) return null;
  const cs = comp.competitors ?? [];
  if (cs.length !== 2) return null;
  const wIdx = cs.findIndex((c) => c.winner === true);
  if (wIdx === -1) return null; // 沒有明確贏家(walkover 前 / 資料未定)→ 不收
  const w = cs[wIdx];
  const l = cs[1 - wIdx];
  const winnerName = w.athlete?.fullName ?? w.athlete?.displayName;
  const loserName = l.athlete?.fullName ?? l.athlete?.displayName;
  if (!winnerName || !loserName) return null; // 雙打 / 缺名 → 不收
  // 比分:贏家視角(每盤 winner 局數 - loser 局數)· 缺盤跳過(退賽可能只有一兩盤)。
  const ws = (w.linescores ?? []).map((x) => x.value);
  const ls = (l.linescores ?? []).map((x) => x.value);
  const sets = [];
  for (let i = 0; i < Math.max(ws.length, ls.length); i++) {
    const a = ws[i];
    const b = ls[i];
    if (!Number.isFinite(Number(a)) || !Number.isFinite(Number(b))) continue;
    sets.push(`${a}-${b}`);
  }
  const date = String(comp.date ?? ev.date ?? "").slice(0, 10);
  return {
    tour,
    tournament: ev.name ?? ev.shortName ?? "",
    grouping: g?.grouping?.displayName ?? "Singles",
    date,
    winnerName,
    loserName,
    score: sets.join(" "), // 可能空(極少數無 linescores)· 對帳只靠 winner/loser 名,score 純顯示
    retired: /retire|walkover|w\/o/i.test(st.detail ?? st.description ?? ""),
  };
}

async function gather() {
  const out = new Map(); // key → record(後者覆蓋 · 同場只留一筆)
  const now = new Date();
  let anyOk = false;
  for (const tour of TOURS) {
    for (let i = 0; i < WINDOW_DAYS; i++) {
      const d = new Date(now.getTime() - i * 86400000);
      let j;
      try {
        j = await fetchScoreboard(tour, ymd(d));
        anyOk = true;
      } catch {
        continue; // 單天/單 tour 失敗不致命 · 其他天/tour 補
      }
      for (const ev of j.events ?? []) {
        for (const g of ev.groupings ?? []) {
          if (!isSinglesGrouping(g)) continue;
          for (const comp of g.competitions ?? []) {
            const rec = toRecord(tour, ev, g, comp);
            if (!rec) continue;
            const key = `${rec.tour}|${rec.tournament}|${norm(rec.winnerName)}|${norm(rec.loserName)}`;
            out.set(key, rec);
          }
        }
      }
    }
  }
  if (!anyOk) throw new Error("all ESPN scoreboard fetches failed");
  return [...out.values()];
}

// 對帳用正規化(同 lib/tennis/results.ts · 去重音 / 標點 / 大小寫)· 防同名不同寫法重複。
function norm(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // 去重音(combining diacritical marks)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const STALE_DAYS = 8; // 網球賽事間歇(非每天)· 比 CPBL 寬,避免賽事空窗誤報。

function mirrorStaleDays() {
  try {
    if (!existsSync(OUT)) return Infinity;
    const prev = JSON.parse(readFileSync(OUT, "utf8"));
    const games = prev.games ?? [];
    if (games.length === 0) return Infinity;
    const latest = games.reduce((mx, g) => (g.date > mx ? g.date : mx), "");
    if (!latest) return Infinity;
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    const ms = Date.parse(`${today}T00:00:00Z`) - Date.parse(`${latest}T00:00:00Z`);
    return Number.isFinite(ms) ? ms / 86400000 : Infinity;
  } catch {
    return 0;
  }
}

async function main() {
  let games;
  try {
    games = await gather();
  } catch (e) {
    const stale = mirrorStaleDays();
    if (stale > STALE_DAYS) {
      console.error(
        `[tennis-results] fetch failed AND mirror is ${stale.toFixed(1)}d stale (> ${STALE_DAYS}d) — failing loud (exit 1): ${e.message}`,
      );
      process.exit(1);
    }
    console.error(
      `[tennis-results] fetch failed (mirror still fresh ${stale.toFixed(1)}d · tolerating blip · keeping existing json): ${e.message}`,
    );
    return;
  }

  if (games.length === 0) {
    console.error("[tennis-results] 0 finished singles parsed (off-tournament?) · keeping existing json");
    return;
  }

  // 聯集合併:已在檔裡的對戰永不刪、新賽果覆蓋(賽果一旦 final 不變;退賽更正照吃)。
  const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { games: [] };
  const keyOf = (g) => `${g.tour}|${g.tournament}|${norm(g.winnerName)}|${norm(g.loserName)}`;
  const byKey = new Map();
  for (const g of prev.games ?? []) byKey.set(keyOf(g), g);
  let added = 0;
  for (const g of games) {
    if (!byKey.has(keyOf(g))) added++;
    byKey.set(keyOf(g), g);
  }
  const merged = [...byKey.values()].sort((a, b) =>
    a.date === b.date ? keyOf(a).localeCompare(keyOf(b)) : a.date.localeCompare(b.date),
  );

  // 內容沒變就不重寫(避免每跑都推一筆純時間戳 commit · 同 CPBL)。
  if (JSON.stringify(merged) === JSON.stringify(prev.games ?? [])) {
    console.log(`✓ tennis results · ${merged.length} finished singles · no change`);
    return;
  }

  writeFileSync(
    OUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "site.api.espn.com tennis scoreboard (atp+wta singles · official · public · 0 auth)",
        count: merged.length,
        games: merged,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`✓ tennis results · ${merged.length} finished singles (+${added} new) → lib/tennis-results.json`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[tennis-results] fatal:", e);
    process.exit(1);
  });
