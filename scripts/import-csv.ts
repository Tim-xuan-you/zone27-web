/**
 * CSV → dog-food.json
 *
 * 為什麼要這個：真正的瓶頸不是程式，是那 200 款商品資料。
 * 而建資料的人（員工）不該去手改 JSON —— 少一個逗號整個站就掛。
 *
 * 流程：
 *   1. 員工在 Google Sheet 填資料（欄位照 data/_template.csv）
 *   2. 下載成 CSV，存成 data/dog-food.csv
 *   3. npm run data:import
 *   4. 有錯它會用中文告訴你第幾列哪一欄不對，而且一列都不會寫進去
 *
 * 驗證是刻意嚴格的。寫錯一款飼料的過敏原，賠掉的是這個站唯一的資產。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { todayTW } from "../lib/date";

const SRC = resolve("data/dog-food.csv");
const OUT = resolve("data/dog-food.json");

const PROTEINS = ["chicken", "beef", "lamb", "salmon", "whitefish", "duck", "turkey", "pork", "venison", "insect", "poultry"];
const STAGES = ["puppy", "adult", "senior", "all"];
const SIZES = ["small", "medium", "large"];

type Row = Record<string, string>;
const errors: string[] = [];

function fail(line: number, col: string, msg: string) {
  errors.push(`第 ${line} 列 · ${col}：${msg}`);
}

/** 逗號分隔，支援雙引號包住的欄位（描述裡有逗號時會用到）。 */
function parseCsv(text: string): Row[] {
  /*
   * 編碼防呆。
   *
   * Excel 在 Windows 上存 CSV 預設會用 Big5，讀進來變成一堆 �。
   * 如果不擋，中文會全部變亂碼寫進網站 —— 而且是靜靜地壞掉，
   * 因為數字欄位都還是對的，驗證全過。
   */
  if (text.includes("�")) {
    console.error("\n✗ 這個檔案不是 UTF-8，中文會變亂碼。\n");
    console.error("  如果你是用 Excel 編輯的：");
    console.error("    另存新檔 → 檔案類型選「CSV UTF-8 (逗號分隔)」");
    console.error("    不要選只寫「CSV (逗號分隔)」的那個\n");
    console.error("  更省事的做法：改用 Google Sheet 編輯，");
    console.error("  下載時選「逗號分隔值檔案 (.csv)」，編碼不會出問題。\n");
    process.exit(1);
  }

  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error("CSV 至少要有標題列和一列資料");

  const head = splitLine(lines[0]);
  return lines.slice(1).map((l) => {
    const cells = splitLine(l);
    const row: Row = {};
    head.forEach((h, i) => (row[h.trim()] = (cells[i] ?? "").trim()));
    return row;
  });
}

function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      out.push(cur); cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function num(row: Row, key: string, line: number, opts: { min?: number; max?: number } = {}): number {
  const raw = row[key];
  if (raw === undefined || raw === "") { fail(line, key, "沒填"); return 0; }
  const n = Number(raw);
  if (Number.isNaN(n)) { fail(line, key, `「${raw}」不是數字`); return 0; }
  if (opts.min !== undefined && n < opts.min) fail(line, key, `${n} 太小（最少 ${opts.min}）`);
  if (opts.max !== undefined && n > opts.max) fail(line, key, `${n} 太大（最多 ${opts.max}）`);
  return n;
}

function yn(row: Row, key: string, line: number): boolean {
  const v = (row[key] ?? "").toUpperCase();
  if (v === "Y" || v === "TRUE" || v === "1") return true;
  if (v === "N" || v === "FALSE" || v === "0" || v === "") return false;
  fail(line, key, `「${row[key]}」看不懂，請填 Y 或 N`);
  return false;
}

function list(row: Row, key: string, line: number, allowed: string[]): string[] {
  const raw = row[key] ?? "";
  if (!raw) { fail(line, key, "沒填"); return []; }
  const items = raw.split(/[|,、]/).map((s) => s.trim()).filter(Boolean);
  for (const it of items) {
    if (!allowed.includes(it)) {
      fail(line, key, `「${it}」不在允許清單內。可用：${allowed.join(" / ")}`);
    }
  }
  return items;
}

function merchant(row: Row, n: number, line: number) {
  const p = `m${n}`;
  if (!row[`${p}Label`]) return null;

  const url = row[`${p}Url`] ?? "";
  if (!/^https?:\/\//.test(url)) fail(line, `${p}Url`, "不是有效的網址（要用 http:// 或 https:// 開頭）");
  if (url.includes("PLACEHOLDER")) {
    console.warn(`  ⚠ 第 ${line} 列 ${p}Url 還是佔位連結，上線前要換成真的分潤連結`);
  }

  return {
    id: "m" + n,
    label: row[`${p}Label`],
    // 大包裝當「最省」時規格不同，沒填就沿用整列的 unit
    ...(row[`${p}Unit`] ? { unit: row[`${p}Unit`] } : {}),
    amount: num(row, `${p}Amount`, line, { min: 1 }),
    note: row[`${p}Note`] ?? "",
    affiliateUrl: url,
    anchor: (n === 1 ? "safe" : "value") as "safe" | "value",
    // 連結死掉不是刪掉那一列 —— 刪掉就沒有紀錄，下次又會重新收一次同一家。
    // 標記起來，引擎跳過，資料還在。
    ...(/^(1|true|yes|y|是|死)$/i.test((row[`${p}Dead`] ?? "").trim()) ? { dead: true } : {}),
  };
}

/* ---------------------------------------------------------------- */

if (!existsSync(SRC)) {
  console.error(`\n找不到 ${SRC}`);
  console.error(`\n請把 Google Sheet 下載成 CSV，存成 data/dog-food.csv`);
  console.error(`欄位格式看 data/_template.csv\n`);
  process.exit(1);
}

const rows = parseCsv(readFileSync(SRC, "utf8"));
const seen = new Set<string>();

const products = rows.map((row, i) => {
  const line = i + 2; // 標題列算第 1 列

  if (!row.id) fail(line, "id", "沒填");
  if (seen.has(row.id)) fail(line, "id", `「${row.id}」重複了`);
  seen.add(row.id);

  if (!row.dealbreaker) {
    fail(line, "dealbreaker", "沒填 —— 每一款都必須有一句「不要買，如果⋯」，這是產品的核心");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.checkedAt ?? "")) {
    fail(line, "checkedAt", `「${row.checkedAt}」格式要像 2026-09-05`);
  }

  // m1..m4。規則上一款一個規格就好，但賣家把尺寸拆成獨立商品時會用到。
  const merchants = [1, 2, 3, 4].map((n) => merchant(row, n, line)).filter(Boolean);
  const isRef = yn(row, "referenceOnly", line);
  const isAwait = yn(row, "awaitingLink", line);
  // 對照款的工作是被刪掉；待補連結的是還沒拿到連結。兩種都可以沒有通路。
  if (merchants.length === 0 && !isRef && !isAwait) {
    fail(line, "m1Label", "至少要有一個通路（對照款填 referenceOnly=1，等連結的填 awaitingLink=1）");
  }
  if (merchants.length > 0 && isAwait) {
    fail(line, "awaitingLink", "已經有通路了，把 awaitingLink 清空");
  }
  // 沒有台灣上架頁的證據，就不准進採購清單 —— 這條擋的是「讓人白跑一趟」
  if (isAwait && !row.twSource) {
    fail(line, "twSource", "要放進待補清單，必須先指出一個台灣通路實際上架這個 SKU 的頁面網址");
  }

  return {
    id: row.id,
    species: "dog",
    brand: row.brand,
    name: row.name,
    spec: {
      protein: num(row, "protein", line, { min: 0, max: 100 }),
      fat: num(row, "fat", line, { min: 0, max: 100 }),
      carb: num(row, "carb", line, { min: 0, max: 100 }),
      omega3: num(row, "omega3", line, { min: 0, max: 20 }),
      // 0 = 查不到。允許留白，但引擎會把它當成「不通過磷上限」。
      phosphorus: row.phosphorus ? num(row, "phosphorus", line, { min: 0, max: 10 }) : 0,
      proteinSources: list(row, "proteinSources", line, PROTEINS),
      singleSource: yn(row, "singleSource", line),
      ...(row.pulses ? { pulses: row.pulses as "high" | "none" | "unknown" } : {}),
      grainFree: yn(row, "grainFree", line),
      lifeStage: list(row, "lifeStage", line, STAGES),
      bodySize: list(row, "bodySize", line, SIZES),
      prescription: yn(row, "prescription", line),
    },
    reports: {
      total: num(row, "reportsTotal", line, { min: 0 }),
      palatability: num(row, "reportsPalatability", line, { min: 0 }),
      looseStool: num(row, "reportsLooseStool", line, { min: 0 }),
    },
    price: { unit: row.unit, checkedAt: row.checkedAt, merchants },
    dealbreaker: row.dealbreaker,
    ...(row.knownIssues ? { knownIssues: row.knownIssues } : {}),
    ...(yn(row, "discontinued", line) ? { discontinued: true } : {}),
    ...(isRef ? { referenceOnly: true } : {}),
    ...(isAwait ? { awaitingLink: true } : {}),
    ...(row.searchAs ? { searchAs: row.searchAs } : {}),
    ...(row.twSource ? { twSource: row.twSource } : {}),
  };
});

/*
 * 同一商品頁多口味的偵測。
 *
 * 蝦皮的分享連結指向整個商品頁，不是特定規格 —— 賣家把鹿肉/火雞/鮭魚
 * 放同一頁，兩款拿到同一條連結是必然，不是填錯。
 *
 * 所以不擋。改成印出來提醒，前端會在「前往」按鈕旁警告使用者自己
 * 選對規格 —— 那才是風險真正發生的地方。
 */
const urlOwners = new Map<string, string[]>();
for (const p of products) {
  // 同一款的大小包本來就共用連結，那不算多口味 —— 只看有幾「款」共用
  for (const url of new Set(p.price.merchants.map((m) => m!.affiliateUrl))) {
    const list = urlOwners.get(url) ?? [];
    list.push(p.id + "（" + p.spec.proteinSources.join("+") + "）");
    urlOwners.set(url, list);
  }
}
const shared = [...urlOwners].filter(([, o]) => o.length > 1);
if (shared.length) {
  console.log("\n  同一商品頁多口味（前端會提醒使用者選規格）：");
  for (const [, owners] of shared) console.log('    ' + owners.join(' · '));
}

/* 跨列的合理性檢查 —— 單列看不出來的問題 */
products.forEach((p, i) => {
  const line = i + 2;
  if (p.spec.singleSource && p.spec.proteinSources.length > 1) {
    fail(line, "singleSource", `標了單一蛋白源，但 proteinSources 填了 ${p.spec.proteinSources.length} 種`);
  }
  if (p.reports.palatability > p.reports.total || p.reports.looseStool > p.reports.total) {
    fail(line, "reports", "回報人數比總回報數還多");
  }
  const sum = p.spec.protein + p.spec.fat + p.spec.carb;
  if (sum > 100) fail(line, "protein/fat/carb", `加起來 ${sum}% 超過 100%`);
});

if (errors.length) {
  console.error(`\n✗ 有 ${errors.length} 個問題，一列都沒有寫入：\n`);
  errors.forEach((e) => console.error("  " + e));
  console.error(`\n改完再跑一次 npm run data:import\n`);
  process.exit(1);
}

const json = {
  _meta: {
    category: "dog-food",
    note: "由 data/dog-food.csv 產生，不要直接改這個檔。改 CSV 之後跑 npm run data:import。",
    generatedAt: todayTW(),
    count: products.length,
    pricePolicy: "人工複查，不爬蟲。checkedAt 誠實顯示於前端。",
  },
  products,
};

writeFileSync(OUT, JSON.stringify(json, null, 2) + "\n", "utf8");
console.log(`\n✓ ${products.length} 款寫入 data/dog-food.json`);

/* ---------------------------------------------------------------- */
/* 價格快照 —— 每次匯入追加一筆                                       */
/*                                                                    */
/* 價格史是唯一抄不走的護城河（別人一週能複製規格庫，但複製不了三年份   */
/* 的波動），而且晚一天開始就永遠少一天。所以在只有 8 筆示範資料、      */
/* 一個使用者都沒有的現在就先記。                                      */
/* ---------------------------------------------------------------- */

const HIST = resolve("data/price-history.json");
const hist = JSON.parse(readFileSync(HIST, "utf8"));
const today = todayTW();

const snapshot = {
  d: today,
  p: Object.fromEntries(
    products
      .filter((p) => p.price.merchants.length > 0)
      .map((p) => [p.id, Math.min(...p.price.merchants.map((m) => m!.amount))])
  ),
};

const idx = hist.snapshots.findIndex((s: { d: string }) => s.d === today);
if (idx >= 0) {
  hist.snapshots[idx] = snapshot;      // 同一天重跑就覆蓋，不要留兩筆
  console.log(`  價格快照 ${today} 已更新（共 ${hist.snapshots.length} 天）`);
} else {
  hist.snapshots.push(snapshot);
  console.log(`  價格快照 ${today} 已追加（共 ${hist.snapshots.length} 天）`);
}

hist.snapshots.sort((a: { d: string }, b: { d: string }) => a.d.localeCompare(b.d));
writeFileSync(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");

if (hist.snapshots.length < 7) {
  console.log(`  （滿 7 天之後，網站才會開始顯示「現在該不該買」）`);
}
console.log(`\n  記得跑 npm run build 確認頁面生得出來\n`);
