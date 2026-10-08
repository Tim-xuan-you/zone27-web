/**
 * 注音猜猜看：挑出每一關固定的幾張，寫進 data/worksheets/guess.json。
 * 跟撿松果回家一樣，家長看到的是固定編號的學習單；已經上線的編號不改，只補還沒有的。
 *
 * 用法：npx tsx scripts/worksheets-guess.ts [每關幾張，預設 5]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { GUESS_LEVELS, makeGuessLevel, type GuessSheet } from "../lib/worksheets/guess";

const OUT = resolve(import.meta.dirname, "..", "data/worksheets/guess.json");
const PER = Number(process.argv[2] ?? 5);
type File = { _meta: Record<string, string>; sheets: GuessSheet[] };
const file: File = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { _meta: {}, sheets: [] };
file._meta = {
  note: "注音猜猜看上線的學習單。編號（zhuyin-關-張）上線後不能改：印出去的 QR code 指的就是它。",
  how: "scripts/worksheets-guess.ts 出的；每個詞的注音都對過教育部國語辭典（scripts/worksheets-zhuyin-check.ts）。",
};
for (const L of GUESS_LEVELS) {
  for (const s of makeGuessLevel(L.n, PER, 20261009)) {
    if (file.sheets.some((x) => x.id === s.id)) continue;
    file.sheets.push(s);
    console.log(s.id, s.questions.map((q) => `${q.zh}[${q.options.join("/")}]`).join(" "));
  }
}
file.sheets.sort((a, b) => a.level - b.level || a.n - b.n);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(file) + "\n");
console.log(`寫好 ${file.sheets.length} 張`);
