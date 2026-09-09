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
  "貴賓 3 歲，很挑食，一直有淚痕",
  "柯基快 8 歲了，有點胖，最近一直軟便",
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
  // 鐵律：腎臟的問題一律不推商品。
  // 我們的磷是從公開資料整理的估值，不是廠商保證值 ——
  // 拿估出來的邊界值回答腎臟問題，是拿別人的狗去冒險。
  if (r.situation.symptoms.some((s) => s.includes("腎")) && v.pick) {
    console.error(`  ❌ 嚴重：腎臟問題卻推了 ${v.pick.brand}（磷 ${v.pick.spec.phosphorus}%）`);
    fail++;
  }
}

console.log(`\n———\n${fail === 0 ? "✓ 兩條鐵律都沒有被違反" : `❌ ${fail} 項違反`}`);
process.exit(fail === 0 ? 0 : 1);
