import { dailyGrams, bagDuration, mer } from "../lib/engine";
for (const kg of [3, 5, 10, 25, 35]) {
  console.log(`${kg} 公斤成犬 → ${Math.round(mer(kg))} 大卡／天 → 約 ${dailyGrams(kg)} 克`);
}
console.log("");
for (const u of ["2kg", "6kg", "11.4kg"]) {
  console.log(`10 公斤的狗，${u} 那包 → ${JSON.stringify(bagDuration(u, 10))}`);
}
