/**
 * 解析器煙霧測試。跑 `npm run parse:smoke`。
 * 目的是看「零成本的規則解析，到底夠不夠用」。
 */
import { parse } from "../lib/parse";
import { adjudicate } from "../lib/engine";
import { catalog, constraintsFor } from "../lib/catalog";

const inputs = [
  "我家柴犬 5 歲，最近一直抓癢，換過兩種雞肉飼料都沒改善",
  "12歲老貓，腎指數偏高，獸醫說要控磷",
  "米克斯幼犬 4 個月，18公斤預估成犬，預算一個月 1500",
  "紅貴賓三歲，對牛肉過敏，一直有淚痕",
  "黃金獵犬 7 歲 32公斤，軟便好幾週了，預算 2000 以內",
  "拉不拉多，吃了雞肉就會癢，也不能吃羊",
  "我的狗狗最近怪怪的",           // 幾乎沒資訊
  "aaa",                          // 完全沒資訊
];

let ok = 0;
for (const raw of inputs) {
  const { situation, chips, empty } = parse(raw);
  console.log("\n" + "─".repeat(62));
  console.log("輸入：" + raw);

  if (empty) {
    console.log("  ⚠ 讀不到任何條件 → 前端要引導補問，或走 LINE 降落傘");
    continue;
  }
  ok++;

  console.log("  讀到：" + chips.map((c) => (c.kind === "avoid" ? "✕" : "") + c.label).join("　"));

  situation.constraints = constraintsFor(situation);
  const v = adjudicate(catalog, situation);
  const cutTotal = v.cuts.reduce((s, c) => s + c.count, 0);
  const consistent = v.startCount - cutTotal === v.survivors.length;

  console.log(
    `  裁決：${v.startCount} → ${v.survivors.length} 款` +
    (consistent ? "" : "  ✗ 數字對不起來") +
    (v.pick ? `　推薦 ${v.pick.brand}｜${v.pick.name}` : "　（全數排除）")
  );
}

console.log("\n" + "═".repeat(62));
console.log(`${ok} / ${inputs.length} 句解析出可用條件（最後兩句本來就該讀不到）`);
console.log("零 API 呼叫 · 零成本 · 零延遲\n");
