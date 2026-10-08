/**
 * 數字松果：每一關出很多候選，挑出固定的 5 張（一張兩題），寫進 data/worksheets/number.json。
 * 跟撿松果回家一樣：家長看到的是固定編號的學習單；已經上線的編號不改，只補還沒有的。
 *
 * 怎麼挑：
 *   每一題都再驗一次只有一條路剛好湊到（checkNumber）
 *   「差一點就湊到」的路越多、答案比最近的路長越多，越要動腦，分數越高；太簡單、太難的兩頭不要，挑中間
 *   同一關房子上的數字、算式盡量不要重複，同一張兩題的數字一定不一樣
 *   一關裡照分數排，第 1 張最簡單
 *
 * 用法：npx tsx scripts/worksheets-number.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { NUMBER_LEVELS, allRoutes, checkNumber, makeNumber, numberEquation, type NumberPuzzle, type NumberSheet } from "../lib/worksheets/number";

const OUT = resolve(import.meta.dirname, "..", "data/worksheets/number.json");
const PER = 5;
type File = { _meta: Record<string, string>; sheets: NumberSheet[] };
const file: File = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { _meta: {}, sheets: [] };
file._meta = {
  note: "數字松果上線的學習單。編號（number-關-張）上線後不能改：印出去的 QR code 指的就是它。",
  how: "scripts/worksheets-number.ts 出的；每一題都把起點到房子的每一條路走過一遍，剛好湊到房子數字的只有一條。",
};

function score(p: NumberPuzzle): number {
  const value = new Map(p.acorns.map((a, k) => [a, p.values[k]]));
  const routes = allRoutes(p.W, p.H, new Set(p.open), p.S, p.E, value)!;
  const near = routes.filter((r) => r.sum !== p.target && Math.abs(r.sum - p.target) <= 2).length;
  return near + 2 * (p.answer.length - p.shortestLen) + p.picked.length;
}

for (const L of NUMBER_LEVELS) {
  if (file.sheets.some((s) => s.level === L.n)) { console.log(`第 ${L.n} 關已經有了，不動`); continue; }
  const cands: { p: NumberPuzzle; s: number }[] = [];
  for (let seed = 1; seed <= 400; seed++) {
    const p = makeNumber(L.n, seed);
    if (checkNumber(p)) continue;
    // 起點旁邊那條直線就湊到的、答案太短的，不要
    if (p.answer.length < L.W + L.H + 1) continue;
    cands.push({ p, s: score(p) });
  }
  cands.sort((a, b) => a.s - b.s);
  const band = cands.slice(Math.floor(cands.length * 0.4), Math.floor(cands.length * 0.85));
  // 房子上的數字輪流用：先用沒用過的
  const used = new Map<number, number>();
  const picked: { p: NumberPuzzle; s: number }[] = [];
  // 同一個算式（第 1 關只有 1～3 兩兩相加，算式本來就不多）先不重複，不夠再允許用第二次
  const seen = new Map<string, number>();
  for (let round = 0; picked.length < PER * 2 && round < 5; round++) {
    for (const c of band) {
      if (picked.length >= PER * 2) break;
      if (picked.includes(c) || (used.get(c.p.target) ?? 0) > round) continue;
      const eq = numberEquation(c.p);
      if ((seen.get(eq) ?? 0) > round) continue;
      picked.push(c); seen.set(eq, (seen.get(eq) ?? 0) + 1);
      used.set(c.p.target, (used.get(c.p.target) ?? 0) + 1);
    }
  }
  if (picked.length < PER * 2) throw new Error(`第 ${L.n} 關挑不到 ${PER * 2} 題`);
  picked.sort((a, b) => a.s - b.s);
  // 一張兩題：簡單的配簡單的；同一張兩題房子數字不同
  for (let n = 1; n <= PER; n++) {
    let a = picked[(n - 1) * 2], b = picked[(n - 1) * 2 + 1];
    if (a.p.target === b.p.target) {
      const k = picked.findIndex((x, i) => i > n * 2 - 1 && x.p.target !== a.p.target);
      if (k > 0) { [picked[n * 2 - 1], picked[k]] = [picked[k], picked[n * 2 - 1]]; b = picked[n * 2 - 1]; }
    }
    file.sheets.push({ id: `number-${L.n}-${n}`, level: L.n, n, puzzles: [a.p, b.p] });
    console.log(`number-${L.n}-${n}`, numberEquation(a.p), "｜", numberEquation(b.p), `（分數 ${a.s}、${b.s}）`);
  }
}
file.sheets.sort((a, b) => a.level - b.level || a.n - b.n);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(file) + "\n");
console.log(`寫好 ${file.sheets.length} 張`);
