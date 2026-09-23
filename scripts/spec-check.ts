/**
 * 規格對不對得上。
 *
 * 2026-09-20 出的事：我在候選清單寫「這一頁涵蓋迷你到大型」，
 * 那是我從賣場標題「85g/罐 任選」推論的，沒有驗證。
 * Tim 照著去產大型犬的連結，那一頁其實只有 2-7kg 跟 7-11kg。
 *
 * Tim 說得對：「使用者絕對會因為這樣跑走，因為我們一點都不專業。」
 * 規格寫錯不是小事 —— 潔牙骨買錯尺寸，小狗啃大型犬的骨頭會噎到。
 *
 * 所以這一類錯誤不再靠人眼。分兩級：
 *
 *   擋 build：體重範圍對不上、備註跟賣場規格自己打架
 *             這兩種一定是打錯字，沒有合理的情況
 *
 *   只提醒：  賣場的包裝重量跟我們登記的不一樣
 *             這個可能是對的 —— 同一款商品，不同賣場賣不同容量
 *             （毛孩寵物鋪的干貝 20g、官方商城 25g，兩個都是真的）
 *             但每一筆都要有人看過，所以列出來
 *
 * 用法：npm run spec:check（build 之後自動跑）
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const read = (f: string) => JSON.parse(readFileSync(resolve(ROOT, f), "utf8"));

interface M {
  id: string;
  label: string;
  unit?: string;
  amount: number;
  note?: string;
  dead?: boolean;
  soldOut?: boolean;
}
interface P {
  id: string;
  brand: string;
  name: string;
  spec?: { packG?: number; packSize?: number; packUnit?: string; forKgFrom?: number; forKgTo?: number };
  price: { unit?: string; merchants: M[] };
}

const FILES = [
  "data/dog-food.json", "data/dog-wet-food.json", "data/cat-food.json", "data/cat-wet-food.json",
  "data/cat-litter.json", "data/cat-treat.json", "data/dog-treat.json",
];

/**
 * 「85g」「14g×4」「14g*4」「40 公克」→ 公克總數。
 * 一定要把 ×4 乘回去：一包 14g×4 就是 56 公克，不是 14 公克。
 */
function gramsOf(s: string): { base: number; total: number } | null {
  const hit = s.match(/(\d+(?:\.\d+)?)\s*(?:g|公克|克)\s*(?:[×xX*]\s*(\d+))?/i);
  if (!hit) return null;
  const base = Number(hit[1]);
  return { base, total: base * (hit[2] ? Number(hit[2]) : 1) };
}

/** 「7-11公斤」「2-7 公斤犬」→ [7, 11] */
function kgRangeOf(s: string): [number, number] | null {
  const hit = s.match(/(\d+(?:\.\d+)?)\s*[-–~到]\s*(\d+(?:\.\d+)?)\s*(?:kg|公斤)/i);
  return hit ? [Number(hit[1]), Number(hit[2])] : null;
}

const block: string[] = [];
const warn: string[] = [];

for (const file of FILES) {
  for (const p of read(file).products as P[]) {
    const spec = p.spec ?? {};
    for (const m of p.price.merchants) {
      const where = `${p.id} ${p.brand} ${p.name}｜${m.label}`;
      const unitG = m.unit ? gramsOf(m.unit) : null;
      const noteG = m.note && /規格選/.test(m.note) ? gramsOf(m.note) : null;

      /* 擋：備註寫的「一包幾克」跟賣場那一行的單位不一樣。這一定是打錯字。
         比的是一包的大小，不是整箱 —— 賣場賣 85g×6 而備註寫 85g 是對的。 */
      if (unitG && noteG && unitG.base !== noteG.base) {
        block.push(`${where}\n    賣場那一行是一包 ${unitG.base} 公克，備註的規格卻寫 ${noteG.base} 公克`);
      }

      /* 擋：備註的體重範圍跟品牌標的適用體重不一樣。潔牙骨買錯尺寸會噎到 */
      if (m.note && spec.forKgFrom && spec.forKgTo) {
        const r = kgRangeOf(m.note);
        if (r && (r[0] !== spec.forKgFrom || r[1] !== spec.forKgTo)) {
          block.push(
            `${where}\n    備註的規格寫「${r[0]}-${r[1]} 公斤」，` +
            `這一款標的是 ${spec.forKgFrom}-${spec.forKgTo} 公斤`,
          );
        }
      }

      /* 提醒：賣場的包裝跟我們登記的不一樣。可能是真的，但要有人看過 */
      if (spec.packG && unitG && unitG.total !== spec.packG) {
        warn.push(`${where}\n    賣場賣 ${m.unit}（共 ${unitG.total} 公克），我們登記的一包是 ${spec.packG} 公克`);
      }
      if (spec.packSize && spec.packUnit && m.unit) {
        const hit = m.unit.match(/^(\d+(?:\.\d+)?)\s*(kg|公斤|L|公升)/i);
        if (hit) {
          const u = /kg|公斤/i.test(hit[2]) ? "kg" : "L";
          if (u === spec.packUnit && Number(hit[1]) !== spec.packSize) {
            warn.push(`${where}\n    賣場賣 ${m.unit}，我們登記的一包是 ${spec.packSize}${spec.packUnit}`);
          }
        }
      }
    }
  }
}

if (block.length > 0) {
  console.error(`\n規格自相矛盾，共 ${block.length} 處，沒有合理的情況：\n`);
  console.error(block.map((x) => `  ✕ ${x}`).join("\n\n"));
  console.error(`\n規格寫錯，讀者就會買到錯的東西。先改對再上線。\n`);
  process.exit(1);
}

console.log(`✓ 規格檢查通過：沒有自相矛盾的規格`);
if (warn.length > 0) {
  console.log(`\n  這 ${warn.length} 筆賣場的包裝跟我們登記的不一樣，可能是真的（不同賣場賣不同容量），看一下：\n`);
  console.log(warn.map((x) => `    · ${x}`).join("\n\n"));
  console.log("");
}
