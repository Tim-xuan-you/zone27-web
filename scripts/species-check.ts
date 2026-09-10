/**
 * 物種與醫療停止的驗證。這種 bug 不能靠眼睛看，要有腳本擋。
 *
 * 跑兩次：一次用現在的資料，一次假設所有等連結的都補好了。
 * 第二次是為了貓飼料 —— 它還在上架，現在問什麼都會回「還在上架」，
 * 鐵律看起來永遠不會被違反。等連結一補齊，才是真的考驗。
 * 所以先假裝它開張了，把考驗提前。
 */
import { parse } from "../lib/parse";
import { adjudicate } from "../lib/engine";
import { catalog, constraintsFor } from "../lib/catalog";
import type { Product } from "../lib/types";

const CASES = [
  "12 歲老貓，腎指數偏高，獸醫說要控磷",
  "我家貓咪一直吐毛，該換什麼飼料",
  "喵星人 3 歲，皮膚會癢",
  "英短 3 歲，對雞肉過敏",
  "公貓一直跑砂盆，尿很少",
  "老貓有糖尿病，要換飼料",
  "我家柴犬 5 歲，最近一直抓癢，換過兩種雞肉飼料都沒改善",
  "米克斯 10 歲，腎指數偏高，獸醫說要控磷",
  "拉不拉多，吃了雞肉就會癢，也不能吃羊",
  "貴賓 3 歲，很挑食，一直有淚痕",
  "柯基快 8 歲了，有點胖，最近一直軟便",
  "狗狗有膀胱結石",
];

/** 假設等連結的全部補好了。只在這支檢查裡用，不會寫回任何地方。 */
const opened: Product[] = catalog.map((p) =>
  p.awaitingLink
    ? {
        ...p,
        awaitingLink: false,
        price: {
          ...p.price,
          merchants: [{
            id: "m1", label: "（模擬）", amount: 1000, note: "",
            affiliateUrl: "https://example.com", anchor: "safe" as const, unit: p.price.unit,
          }],
        },
      }
    : p,
);

const MEDICAL = ["腎", "泌尿", "糖尿"];
let fail = 0;

for (const [label, pool] of [["現在的資料", catalog], ["假設連結都補齊", opened]] as const) {
  console.log(`\n######## ${label}`);
  for (const text of CASES) {
    const r = parse(text);
    if (r.empty) { console.log(`\n「${text}」\n  → 讀不出條件`); continue; }
    r.situation.constraints = constraintsFor(r.situation);
    const v = adjudicate(pool as Product[], r.situation);

    console.log(`\n「${text}」`);
    console.log(`  物種 ${r.situation.species}｜症狀 ${r.situation.symptoms.join("、") || "（無）"}`);
    if (v.stop) {
      console.log(`  ⛔ 不回答（${v.stop.kind}）：${v.stop.title}`);
    } else {
      console.log(`  ${v.startCount} 進 → ${v.survivors.length} 留 → 推 ${v.pick?.brand ?? "（無）"} ${v.pick?.name ?? ""}`);
    }

    // 鐵律一：物種不能錯。貓的問題推狗飼料、狗的問題推貓飼料，都是傷害
    if (v.pick && v.pick.species !== r.situation.species) {
      console.error(`  ❌ 嚴重：${r.situation.species} 的問題推了 ${v.pick.species} 的商品`);
      fail++;
    }
    if (v.survivors.some((p) => p.species !== r.situation.species)) {
      console.error(`  ❌ 嚴重：留下來的名單裡混了別的物種`);
      fail++;
    }
    // 鐵律二：腎臟、泌尿道、糖尿病一律不推商品。
    // 飲食跟治療綁在一起，我們的數字是從公開資料整理的，不是廠商保證值。
    if (r.situation.symptoms.some((s) => MEDICAL.some((m) => s.includes(m))) && v.pick) {
      console.error(`  ❌ 嚴重：醫療問題卻推了 ${v.pick.brand}`);
      fail++;
    }
  }
}

console.log(`\n———\n${fail === 0 ? "✓ 兩條鐵律都沒有被違反（現在的資料、連結補齊後，兩種情況都檢查了）" : `❌ ${fail} 項違反`}`);
process.exit(fail === 0 ? 0 : 1);
