/**
 * 長尾頁重複度檢查。
 *
 * 程序化產生 143 個頁面，如果內容只差一個品種名，那就是 Google 眼中的
 * doorway page —— 輕則只索引其中幾頁，重則整站被降權。
 *
 * 量兩個東西：
 *   1. 裁決結果的指紋（刪了什麼、留下什麼、推誰）
 *   2. 加上品種專屬數字之後的完整指紋
 */
import { adjudicate, anchorOf, bagDuration, dailyGrams, pricePerKg, unitOf } from "../lib/engine";
import { catalog, constraintsFor } from "../lib/catalog";
import { allPaths, resolve, situationOf } from "../lib/slugs";

const verdictSig = new Map<string, string[]>();
const fullSig = new Map<string, string[]>();

for (const slug of allPaths()) {
  const p = resolve(slug);
  if (!p) continue;
  const s = situationOf(p);
  s.constraints = constraintsFor(s);
  const v = adjudicate(catalog, s);
  const path = "/" + slug.join("/");

  const vs = [
    v.startCount,
    v.cuts.map((c) => `${c.why}:${c.count}`).join("|"),
    v.survivors.map((x) => x.id).join(","),
    v.pick?.id ?? "-",
  ].join(" / ");
  verdictSig.set(vs, [...(verdictSig.get(vs) ?? []), path]);

  // 品種專屬數字
  let extra = "";
  if (p.kind !== "allergen" && v.pick) {
    const kg = p.breed.kg;
    const g = dailyGrams(kg);
    const a = anchorOf(v.pick, "safe");
    const per = pricePerKg(unitOf(v.pick, a), a.amount);
    const dur = bagDuration(unitOf(v.pick, a), kg);
    extra = ` kg=${kg} g=${g} days=${dur?.days} monthly=${per !== null ? Math.round((g * 30 / 1000) * per) : "-"}`;
  }
  const fs2 = vs + extra;
  fullSig.set(fs2, [...(fullSig.get(fs2) ?? []), path]);
}

function report(name: string, m: Map<string, string[]>) {
  const groups = [...m].sort((a, b) => b[1].length - a[1].length);
  const total = [...m.values()].reduce((n, v) => n + v.length, 0);
  const dup = groups.filter(([, v]) => v.length > 1).reduce((n, [, v]) => n + v.length, 0);
  console.log(`${name}：${total} 頁 → ${groups.length} 種不同內容，重複 ${dup} 頁（${Math.round((dup / total) * 100)}%）`);
  const worst = groups[0];
  if (worst[1].length > 1) {
    console.log(`   最大一組 ${worst[1].length} 頁：${worst[1].slice(0, 5).join("  ")}${worst[1].length > 5 ? " …" : ""}`);
  }
}

report("只看裁決結果", verdictSig);
report("加上品種數字", fullSig);
