/**
 * 貓砂 CSV → JSON。
 *
 * 飼料那支 import-csv.ts 驗的是蛋白質、脂肪、生命階段，貓砂一個都用不到，
 * 所以另外寫一支。共用的只有賣場那一段（m1～m16），寫法跟飼料完全一樣，
 * 所以 data:paste 那支不用改也能貼貓砂的連結。
 *
 * 用法：npm run litter:import
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAX_MERCHANTS } from "../lib/types";
import type { Merchant } from "../lib/types";
/* 材質清單在這裡自己列一份：lib/litter.ts 會讀 data/cat-litter.json，
   而那個檔正是這支腳本產生的，互相讀會變成先有雞還是先有蛋 */
const MATERIALS = ["tofu", "cassava", "mixed-plant", "mixed-mineral", "mineral", "wood", "paper", "zeolite", "crystal"] as const;
type LitterMaterial = (typeof MATERIALS)[number];

const ROOT = resolve(import.meta.dirname, "..");
const CSV = resolve(ROOT, "data/cat-litter.csv");
const JSON_OUT = resolve(ROOT, "data/cat-litter.json");

function parseCsv(text: string): Record<string, string>[] {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
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
  const head = rows[0];
  return rows.slice(1).filter((r) => r[0]).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const errors: string[] = [];
const rows = parseCsv(readFileSync(CSV, "utf8"));

const products = rows.map((r, i) => {
  const line = i + 2;
  const need = (k: string) => {
    if (!r[k]) errors.push(`第 ${line} 列 · ${k}：不能空白`);
    return r[k];
  };
  const material = need("material") as LitterMaterial;
  if (material && !MATERIALS.includes(material)) errors.push(`第 ${line} 列 · material：「${material}」不是認得的材質`);
  const flushable = need("flushable");
  if (flushable && !["limited", "no"].includes(flushable)) {
    errors.push(`第 ${line} 列 · flushable：只能是 limited 或 no。沒有 yes —— 沒有一款貓砂可以無條件亂沖`);
  }
  const packSize = r.packSize ? Number(r.packSize) : undefined;
  if (r.packSize && !(packSize! > 0)) errors.push(`第 ${line} 列 · packSize：不是數字`);
  if (r.packSize && !r.packUnit) errors.push(`第 ${line} 列 · packUnit：有寫一包多少，就要寫單位（kg 或 L）`);

  const merchants: Merchant[] = [];
  for (let n = 1; n <= MAX_MERCHANTS; n++) {
    const label = r[`m${n}Label`];
    if (!label) continue;
    merchants.push({
      id: `m${n}`,
      label,
      unit: r[`m${n}Unit`] || undefined,
      amount: Number(r[`m${n}Amount`] || 0),
      note: r[`m${n}Note`] || "",
      affiliateUrl: r[`m${n}Url`] || "",
      anchor: merchants.length === 0 ? "safe" : "value",
      ...(r[`m${n}Dead`] === "1" ? { dead: true } : {}),
      ...(r[`m${n}Dead`] === "sold" ? { soldOut: true } : {}),
      ...(r[`m${n}Checked`] ? { checkedAt: r[`m${n}Checked`] } : {}),
    } as Merchant);
  }

  return {
    id: need("id"),
    brand: need("brand"),
    name: need("name"),
    checkedAt: r.checkedAt,
    ...(r.note ? { note: r.note } : {}),
    ...(r.searchAs ? { searchAs: r.searchAs } : {}),
    spec: {
      material,
      clumping: r.clumping === "1",
      flushable,
      ...(r.flushClaim ? { flushClaim: r.flushClaim } : {}),
      ...(r.dust ? { dust: r.dust } : {}),
      ...(r.scented ? { scented: r.scented === "1" } : {}),
      ...(r.grain ? { grain: r.grain } : {}),
      ...(r.deodorizer ? { deodorizer: r.deodorizer } : {}),
      ...(r.packUnit ? { packUnit: r.packUnit } : {}),
      ...(packSize ? { packSize } : {}),
      ...(r.tracking ? { tracking: r.tracking } : {}),
    },
    price: { unit: r.packSize ? `${r.packSize}${r.packUnit}` : "", checkedAt: r.checkedAt, merchants },
  };
});

if (errors.length) {
  console.error(`\n貓砂資料有問題，沒有寫入：\n`);
  console.error(errors.join("\n"));
  process.exit(1);
}

writeFileSync(JSON_OUT, JSON.stringify({ products }, null, 2) + "\n", "utf8");
const live = products.filter((p) => p.price.merchants.some((m) => !m.dead && !m.soldOut)).length;
console.log(`\n✓ 貓砂 ${products.length} 款寫入 data/cat-litter.json（${live} 款有連結）\n`);
