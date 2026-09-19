/**
 * 版面一致性檢查。
 *
 * 2026-09-19 Tim 問：「我們的網站會很雜、很亂？有美感、質感？」
 *
 * 憑感覺答沒有意義，所以量給他看。量出來的結果是：
 * 字級有十六種、圓角有十種。單看每一頁都整齊，放在一起就是好幾套系統。
 *
 * 原因不是沒有設計系統，是 components/styles.ts 裡的 T / G 以前沒有 export，
 * 新頁面拿不到，只好在檔尾自己抄一份數字。拿不到的東西沒有人會用。
 *
 * 這支只報告，不擋 build。數字要看得到才會有人去降它。
 *
 * 用法：npm run ui:check
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { T, R } from "../components/styles";

const ROOT = resolve(import.meta.dirname, "..");
const DIRS = ["app", "components"].map((d) => join(ROOT, d));

/** 字級只有這幾階。16、22、28 是標題用的，也收進來 */
const FONT_OK = new Set<number>(Object.values(T));
/* 0 / 2 / 3 是 logo 那顆小方塊跟分隔線，不是卡片圓角 */
const RADIUS_OK = new Set<number>([...Object.values(R), 0, 2, 3]);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}

const files = DIRS.flatMap(walk).filter((f) => !f.endsWith("styles.ts"));

const fontHits = new Map<number, number>();
const radiusHits = new Map<number, number>();
const perFile = new Map<string, number>();

for (const f of files) {
  const src = readFileSync(f, "utf8");
  let off = 0;
  for (const m of src.matchAll(/fontSize: *([\d.]+)\b/g)) {
    const n = Number(m[1]);
    if (!FONT_OK.has(n)) { fontHits.set(n, (fontHits.get(n) ?? 0) + 1); off++; }
  }
  for (const m of src.matchAll(/borderRadius: *([\d.]+)\b/g)) {
    const n = Number(m[1]);
    if (!RADIUS_OK.has(n)) { radiusHits.set(n, (radiusHits.get(n) ?? 0) + 1); off++; }
  }
  if (off > 0) perFile.set(relative(ROOT, f), off);
}

const sortNum = (m: Map<number, number>) => [...m].sort((a, b) => b[1] - a[1]);
const total = [...perFile.values()].reduce((a, b) => a + b, 0);

console.log(`\n字級只用這幾階：${[...FONT_OK].sort((a, b) => a - b).join("、")}`);
console.log(`圓角只用這三階：${[...RADIUS_OK].sort((a, b) => a - b).join("、")}\n`);

if (total === 0) {
  console.log("✓ 全站都照著字級與圓角的階走。\n");
} else {
  console.log(`照階走以外的用法共 ${total} 處\n`);
  if (fontHits.size) {
    console.log("  字級：");
    for (const [n, c] of sortNum(fontHits)) console.log(`    ${String(n).padStart(5)}  ${c} 處`);
  }
  if (radiusHits.size) {
    console.log("  圓角：");
    for (const [n, c] of sortNum(radiusHits)) console.log(`    ${String(n).padStart(5)}  ${c} 處`);
  }
  console.log("\n  最多的檔案：");
  for (const [f, c] of [...perFile].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.log(`    ${String(c).padStart(4)}  ${f}`);
  }
  console.log("\n  新頁面從 components/styles.ts 拿 S / T / G / R，不要自己寫數字。\n");
}
