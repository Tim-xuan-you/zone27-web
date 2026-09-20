/**
 * 貓零食 CSV → JSON。
 *
 * 跟貓砂同一個作法：規格自己一套，賣場那一段（m1～m16）跟飼料一樣，
 * 所以 data:paste 貼連結不用改。
 *
 * 用法：npm run treat:import
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAX_MERCHANTS } from "../lib/types";
import type { Merchant } from "../lib/types";

/* 在這裡自己列一份，不從 lib/treat.ts 讀：那支會讀這支產生的 JSON */
const FORMS = ["puree", "freezeDried", "stick", "biscuit", "dental"] as const;
const PROTEINS = [
  "chicken", "beef", "lamb", "salmon", "whitefish", "fish", "duck", "turkey",
  "pork", "venison", "insect", "poultry", "animal",
];

const ROOT = resolve(import.meta.dirname, "..");
/* 貓零食、狗零食同一套欄位、同一套算法，所以同一支匯入 */
const FILES = [
  { species: "cat", csv: "data/cat-treat.csv", json: "data/cat-treat.json", zh: "貓零食" },
  { species: "dog", csv: "data/dog-treat.csv", json: "data/dog-treat.json", zh: "狗零食" },
];

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

for (const file of FILES) {
const rows = parseCsv(readFileSync(resolve(ROOT, file.csv), "utf8"));

const products = rows.map((r, i) => {
  const line = i + 2;
  const need = (k: string) => {
    if (!r[k]) errors.push(`第 ${line} 列 · ${k}：不能空白`);
    return r[k];
  };
  const form = need("form");
  if (form && !FORMS.includes(form as (typeof FORMS)[number])) {
    errors.push(`第 ${line} 列 · form：「${form}」不是認得的型態（${FORMS.join("、")}）`);
  }
  const proteins = (r.proteins || "").split("|").filter(Boolean);
  for (const p of proteins) if (!PROTEINS.includes(p)) errors.push(`第 ${line} 列 · proteins：「${p}」不認得`);
  if (proteins.length === 0) errors.push(`第 ${line} 列 · proteins：至少要寫一種肉`);

  const num = (k: string) => (r[k] ? Number(r[k]) : undefined);
  const kcalPer = num("kcalPer");
  const kcalPer100g = num("kcalPer100g");
  if (!kcalPer && !kcalPer100g) {
    // 熱量沒公布不是錯，但要知道「一天幾條」算不出來，畫面上會誠實寫
    console.warn(`  提醒：第 ${line} 列（${r.id}）沒有熱量，算不出一天可以給幾條`);
  }

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
    species: r.species || file.species,
    brand: need("brand"),
    name: need("name"),
    checkedAt: r.checkedAt,
    ...(r.note ? { note: r.note } : {}),
    ...(r.searchAs ? { searchAs: r.searchAs } : {}),
    spec: {
      form,
      ...(kcalPer ? { kcalPer } : {}),
      ...(kcalPer100g ? { kcalPer100g } : {}),
      ...(r.unitZh ? { unitZh: r.unitZh } : {}),
      ...(num("piecesPerPack") ? { piecesPerPack: num("piecesPerPack") } : {}),
      ...(num("packG") ? { packG: num("packG") } : {}),
      ...(num("moisture") !== undefined ? { moisture: num("moisture") } : {}),
      ...(num("protein") !== undefined ? { protein: num("protein") } : {}),
      proteins,
      ...(r.additives ? { additives: r.additives } : {}),
      completeFood: r.completeFood === "1",
      ...(num("forKgFrom") ? { forKgFrom: num("forKgFrom") } : {}),
      ...(num("forKgTo") ? { forKgTo: num("forKgTo") } : {}),
      ...(num("brandPerDay") ? { brandPerDay: num("brandPerDay") } : {}),
    },
    price: {
      unit: r.packG ? `${r.packG}g` : "",
      checkedAt: r.checkedAt,
      merchants,
    },
  };
});

if (errors.length) {
  console.error(`\n${file.zh}資料有問題，沒有寫入：\n`);
  console.error(errors.join("\n"));
  process.exit(1);
}

writeFileSync(resolve(ROOT, file.json), JSON.stringify({ products }, null, 2) + "\n", "utf8");
const live = products.filter((p) => p.price.merchants.some((m) => !m.dead && !m.soldOut)).length;
console.log(`✓ ${file.zh} ${products.length} 款寫入 ${file.json}（${live} 款有連結）`);
}
