/**
 * 連連看：挑出每個主題固定的幾張，寫進 data/worksheets/match.json。
 * 跟其他學習單一樣，家長看到的是固定編號的學習單；已經上線的編號不改，只補還沒有的。
 *
 * 用法：npx tsx scripts/worksheets-match.ts [每個主題幾張，預設 5]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { MATCH_THEMES, makeMatchTheme, type MatchSheet } from "../lib/worksheets/match";

const OUT = resolve(import.meta.dirname, "..", "data/worksheets/match.json");
const PER = Number(process.argv[2] ?? 5);
type File = { _meta: Record<string, string>; sheets: MatchSheet[] };
const file: File = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { _meta: {}, sheets: [] };
file._meta = {
  note: "連連看上線的學習單。編號（match-主題-張）上線後不能改：印出去的 QR code 指的就是它。",
  how: "scripts/worksheets-match.ts 出的；每一組答案的來源寫在 lib/worksheets/match.ts。",
};
for (const T of MATCH_THEMES) {
  for (const s of makeMatchTheme(T.id, PER, 20261009)) {
    if (file.sheets.some((x) => x.id === s.id)) continue;
    file.sheets.push(s);
    console.log(s.id, s.left.join("/"), "→", s.right.join("/"));
  }
}
file.sheets.sort((a, b) => a.theme.localeCompare(b.theme) || a.n - b.n);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(file) + "\n");
console.log(`寫好 ${file.sheets.length} 張`);
