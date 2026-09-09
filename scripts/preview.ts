/**
 * 幾個代表性頁面的裁決結果，用來眼睛掃一遍。
 *
 * 情境一律從 lib/slugs.ts 的 situationOf() 來 —— 這支腳本一度自己抄了
 * 一份，於是它顯示的結果跟網站上的不一樣。驗證用的工具跟被驗證的東西
 * 走不同邏輯，那比沒有工具更危險。
 */
import { adjudicate } from "../lib/engine";
import { catalog, constraintsFor } from "../lib/catalog";
import { resolve, situationOf } from "../lib/slugs";

const PAGES = [
  ["shiba-inu"],
  ["shiba-inu", "no-chicken"],
  ["labrador", "no-chicken"],
  ["poodle", "no-lamb"],
];

for (const slug of PAGES) {
  const p = resolve(slug);
  if (!p) { console.log(`\n/${slug.join("/")}  ← 這個網址不存在`); continue; }

  const s = situationOf(p);
  s.constraints = constraintsFor(s);
  const v = adjudicate(catalog, s);

  console.log(`\n/${slug.join("/")}`);
  if (v.stop) { console.log(`  ⛔ ${v.stop.title}`); continue; }
  console.log(`  ${v.startCount} 款進入裁決`);
  for (const c of v.cuts) console.log(`   − ${c.count}  ${c.why}   [${c.tag}]`);
  console.log(`  ${v.survivors.length} 款留下 → 推 ${v.pick?.brand ?? "（無）"}`);
}
