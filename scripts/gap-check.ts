/** 缺口盤點。單獨跑一次看數字，正式呈現在 /status 上。 */
import { gaps, gapsByAllergen, weakPages, overallCutRate } from "../lib/impact";

const r = overallCutRate();
console.log(`全站 ${r.pages} 頁，平均留下 ${Math.round(r.avgKeep * 100)}%（刪掉 ${Math.round((1 - r.avgKeep) * 100)}%）\n`);

const g = gaps();
console.log(`選擇太少的頁面（少於 3 款）：${g.length}`);
for (const x of g.slice(0, 10)) console.log(`   ${x.title} → ${x.survivors} 款`);

const w = weakPages();
console.log(`\n刪太少的頁面（留超過 70%）：${w.length} / ${r.pages}`);
for (const x of w.slice(0, 8)) console.log(`   ${x.title} → ${x.start} 進 ${x.survivors} 留（${Math.round(x.keepRate * 100)}%）`);

import { ruleAudit } from "../lib/impact";
console.log(`\n規則稽核（現有選品裡刪得掉幾款）：`);
for (const r of ruleAudit()) {
  const mark = r.catches === 0 ? " ← 這條規則目前是空的" : "";
  console.log(`   ${String(r.catches).padStart(2)} 款  ${r.rule}${mark}`);
  if (r.catches === 0) console.log(`          要補：${r.need}`);
}
