/**
 * CSV 跟網站讀的 JSON 有沒有對上。
 *
 * 2026-09-27 出的事：唯美味吮掌雞胸肉的連結貼進 data/dog-wet-food.csv 了，
 * 但匯入那一步因為賣場名字對不上（RBB 登記的名字跟 CSV 寫的不一樣）整批拒絕寫入。
 * 匯入其實有報錯，只是被我接指令的方式濾掉了。結果網站上那一罐沒有連結，
 * /go/ 找不到就把讀者轉回首頁，建置照樣過、照樣上線，沒有任何檢查發現。
 *
 * 所以這一支做一件事：每個類目的 CSV，每一款寫了幾家賣場，跟 JSON 裡的數量比一遍。
 * 對不上就擋 build，並告訴你是哪幾款、要跑哪一支匯入。
 *
 * 用法：build 之後自動跑（postbuild）
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CATEGORIES } from "../lib/categories";
import { MAX_MERCHANTS } from "../lib/types";

const ROOT = resolve(import.meta.dirname, "..");

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
    else if (c !== "\r") cur += c;
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

const problems: string[] = [];
const seenCsv = new Set<string>();
let checked = 0;

for (const cat of CATEGORIES) {
  if (seenCsv.has(cat.csv)) continue;
  seenCsv.add(cat.csv);
  const csvPath = resolve(ROOT, cat.csv);
  const jsonPath = csvPath.replace(/\.csv$/, ".json");
  if (!existsSync(csvPath) || !existsSync(jsonPath)) continue;
  const table = parseCsv(readFileSync(csvPath, "utf8").replace(/^﻿/, ""));
  const head = table[0];
  const idCol = head.indexOf("id");
  const labelCols = Array.from({ length: MAX_MERCHANTS }, (_, i) => head.indexOf(`m${i + 1}Label`)).filter((i) => i >= 0);
  const json = JSON.parse(readFileSync(jsonPath, "utf8")) as { products: { id: string; price: { merchants: unknown[] } }[] };
  const byId = new Map(json.products.map((p) => [p.id, p]));
  for (const r of table.slice(1)) {
    const id = r[idCol];
    if (!id) continue;
    const inCsv = labelCols.filter((i) => (r[i] ?? "").trim()).length;
    const p = byId.get(id);
    checked++;
    if (!p) { problems.push(`${cat.csv} · ${id}：CSV 有這一款，JSON 沒有`); continue; }
    if (p.price.merchants.length !== inCsv) {
      problems.push(`${cat.csv} · ${id}：CSV 寫了 ${inCsv} 家賣場，JSON 只有 ${p.price.merchants.length} 家`);
    }
  }
}

if (problems.length) {
  console.error(`\n✗ CSV 跟網站讀的 JSON 對不上（${problems.length} 處）。CSV 改了但匯入沒寫進去，讀者會點到轉回首頁的按鈕：\n`);
  for (const p of problems) console.error("  " + p);
  console.error(`\n跑 npm run data:import（貓砂、零食是 import-litter、import-treat），看它報什麼錯，修好再 build。\n`);
  process.exit(1);
}
console.log(`✓ CSV 跟 JSON 對得上：${checked} 款，每一款的賣場數都一樣`);
