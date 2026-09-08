/**
 * 引擎煙霧測試。跑 `npm run engine:smoke`。
 *
 * 這不是單元測試，是「把裁決過程印出來給人看」——
 * 因為這個引擎的產出本身就是要給人讀的，數字加不加得起來一眼就知道。
 */
import { adjudicate, anchorOf, auditCommission, cheapest, commissionLine } from "../lib/engine";
import { catalog, constraintsFor } from "../lib/catalog";
import type { Situation } from "../lib/types";

const scenarios: { title: string; situation: Situation }[] = [
  {
    title: "柴犬 5 歲，一直抓癢，換過兩種雞肉飼料都沒改善",
    situation: {
      species: "dog", breed: "柴犬", ageYears: 5, weightKg: 10,
      avoid: ["chicken"], symptoms: ["皮膚搔癢"], constraints: [],
    },
  },
  {
    title: "米克斯 3 歲，對雞肉和羊肉都過敏，每月預算 1200",
    situation: {
      species: "dog", breed: "米克斯", ageYears: 3, weightKg: 15,
      avoid: ["chicken", "lamb"], symptoms: [], budgetMonthly: 1200, constraints: [],
    },
  },
];

for (const { title, situation } of scenarios) {
  situation.constraints = constraintsFor(situation);
  const v = adjudicate(catalog, situation);

  console.log("\n" + "═".repeat(64));
  console.log("情境：" + title);
  console.log("═".repeat(64));
  console.log(`\n  ${v.startCount} 款進入裁決`);

  let running = v.startCount;
  for (const c of v.cuts) {
    running -= c.count;
    console.log(`  − ${String(c.count).padStart(2)}  ${c.why.padEnd(22, "　")} ← ${c.tag}`);
  }
  console.log(`  ${"─".repeat(52)}`);
  console.log(`  ${v.survivors.length} 款留下` + (running === v.survivors.length ? "  ✓ 數字對得起來" : `  ✗ 對不起來（算出 ${running}）`));

  if (v.pick) {
    const safe = anchorOf(v.pick, "safe");
    const value = anchorOf(v.pick, "value");
    console.log(`\n  推薦：${v.pick.brand}｜${v.pick.name}`);
    console.log(`  理由：${v.pickReason}`);
    console.log(`  最穩：${safe.label} $${safe.amount}　最省：${value.label} $${value.amount}`);
    console.log(`  紅線：${v.pick.dealbreaker}`);

    const audit = auditCommission(v)!;
    console.log(`\n  ── 佣金稽核（排序演算法讀不到這一段）──`);
    for (const r of audit.rows) {
      console.log(`  ${r.isPick ? "→" : " "} ${r.label.padEnd(24, "　")} ${r.commission}%`);
    }
    console.log("  " + commissionLine(audit).text);
  } else {
    console.log("\n  ⚠ 全被刪光 —— 需要放寬條件或走 LINE 降落傘");
  }

  console.log(`\n  其餘留下：`);
  for (const p of v.survivors.filter((p) => p.id !== v.pick?.id)) {
    console.log(`    ${p.brand}｜${p.name}  $${cheapest(p)}`);
  }
}
console.log();
