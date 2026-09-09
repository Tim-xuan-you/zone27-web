/** 物種與醫療停止的驗證。這種 bug 不能靠眼睛看，要有腳本擋。 */
import { parse } from "../lib/parse";
import { adjudicate } from "../lib/engine";
import { catalog, constraintsFor } from "../lib/catalog";

const CASES = [
  "12 歲老貓，腎指數偏高，獸醫說要控磷",
  "我家貓咪一直吐毛，該換什麼飼料",
  "喵星人 3 歲，皮膚會癢",
  "我家柴犬 5 歲，最近一直抓癢，換過兩種雞肉飼料都沒改善",
  "米克斯 10 歲，腎指數偏高，獸醫說要控磷",
  "拉不拉多，吃了雞肉就會癢，也不能吃羊",
];

let fail = 0;
for (const text of CASES) {
  const r = parse(text);
  if (r.empty) { console.log(`\n「${text}」\n  → 讀不出條件`); continue; }
  r.situation.constraints = constraintsFor(r.situation);
  const v = adjudicate(catalog, r.situation);

  console.log(`\n「${text}」`);
  console.log(`  物種 ${r.situation.species}｜症狀 ${r.situation.symptoms.join("、") || "（無）"}`);
  if (v.stop) {
    console.log(`  ⛔ 不回答（${v.stop.kind}）：${v.stop.title}`);
  } else {
    console.log(`  ${v.startCount} 進 → ${v.survivors.length} 留 → 推 ${v.pick?.brand ?? "（無）"}`);
    if (v.notice) console.log(`  ⚠ 前提：${v.notice.slice(0, 30)}…`);
  }

  // 鐵律：貓的問題絕對不能推出狗商品
  if (r.situation.species === "cat" && v.pick) {
    console.error(`  ❌ 嚴重：貓的問題推了 ${v.pick.species} 的商品`);
    fail++;
  }
  // 鐵律：控磷的問題，推出來的東西磷一定要達標
  if (r.situation.symptoms.some((s) => s.includes("腎")) && v.pick && v.pick.spec.phosphorus > 0.6) {
    console.error(`  ❌ 嚴重：控磷卻推了磷 ${v.pick.spec.phosphorus}% 的商品`);
    fail++;
  }
}

console.log(`\n———\n${fail === 0 ? "✓ 兩條鐵律都沒有被違反" : `❌ ${fail} 項違反`}`);
process.exit(fail === 0 ? 0 : 1);
