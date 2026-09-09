/** 生命階段對食量的影響。有了幼犬糧之後這件事才會被看見。 */
import { dailyGrams, bagDuration, MER_FACTORS, type Stage } from "../lib/engine";

const kg = 10;
console.log(`一隻 ${kg} 公斤的狗，一天吃幾克：\n`);
for (const s of Object.keys(MER_FACTORS) as Stage[]) {
  const g = dailyGrams(kg, s);
  const d = bagDuration("6kg", kg, s);
  console.log(`  ${MER_FACTORS[s].zh.padEnd(14, "　")} ${String(g).padStart(4)} 克／天　6kg 那包約 ${d?.days} 天`);
}
