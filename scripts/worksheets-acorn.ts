/**
 * 撿松果回家：挑出每一關固定的幾張，寫進 data/worksheets/acorn.json。
 *
 * 2026-10-01 Tim：「我想要大家可以印自己想要的！不要隨機耶！」
 * 所以家長看到的是固定編號的學習單（第 3 關第 2 張永遠是同一張）。
 * 這支程式是出題的工具，不給家長按：
 *   1. 每一關出 600 題候選，每一題都已經驗證過只有一個答案
 *   2. 打分數（轉幾個彎、經過幾個岔路、直接走最近的路漏掉幾顆），把太平的濾掉
 *   3. 挑分數落在中間那一段的 10 題，兩題一張，第 1 題比第 2 題簡單一點
 *   4. 照關卡排好，確定後面的關卡比前面難
 *
 * 已經上線的編號不會被改掉（印出去的 QR code 指的就是那個編號），只會補還沒有的。
 * 要重挑某一張，先把它從 JSON 拿掉、確定還沒有人印過。
 *
 * 用法：npx tsx scripts/worksheets-acorn.ts [每關幾張，預設 5]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { ACORN_LEVELS, acornStats, makeAcorn, solveAcorn, type AcornPuzzle, type AcornSheet } from "../lib/worksheets/acorn";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "data/worksheets/acorn.json");
const PER_LEVEL = Number(process.argv[2] ?? 5);
const CANDIDATES = 600;

type File = { _meta: Record<string, string>; sheets: AcornSheet[] };
const file: File = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, "utf8"))
  : { _meta: {}, sheets: [] };
file._meta = {
  note: "撿松果回家上線的學習單。每一張的編號（acorn-關-張）一旦上線就不能改：印出去的 QR code 指的就是這個編號。",
  how: "scripts/worksheets-acorn.ts 挑的：每關出 600 題候選，濾掉太平的，挑分數在中間那一段的。每一題都驗證過只有一個答案。",
  tested: "tested 是孩子試寫過的日期。沒寫過就空著，網站不會說寫過。",
};

const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const used = new Set(file.sheets.flatMap((s) => s.puzzles.map((p) => p.open.join() + p.acorns.join())));
let prevMedian = -1;

for (const L of ACORN_LEVELS) {
  const have = file.sheets.filter((s) => s.level === L.n);
  const need = PER_LEVEL - have.length;
  const cands: { p: AcornPuzzle; score: number }[] = [];
  for (let seed = 1; seed <= CANDIDATES; seed++) {
    const p = makeAcorn(L.n, 900000 + seed);
    const st = acornStats(p);
    if (st.dull) continue;
    if (used.has(p.open.join() + p.acorns.join())) continue;
    cands.push({ p, score: st.score });
  }
  cands.sort((a, b) => a.score - b.score);
  const scores = cands.map((c) => c.score);
  const m = median(scores);
  console.log(`第 ${L.n} 關：${CANDIDATES} 題候選，濾掉太平的剩 ${cands.length} 題，分數中位數 ${m}（${Math.min(...scores)}～${Math.max(...scores)}）`);
  if (m <= prevMedian) console.log(`  ⚠ 第 ${L.n} 關的中位數沒有比前一關高`);
  prevMedian = m;
  if (need <= 0) { console.log(`  已經有 ${have.length} 張，不動`); continue; }

  // 分數在 40%～75% 那一段：不要最簡單、也不要最難的，同一關的難度才會接近
  const band = cands.slice(Math.floor(cands.length * 0.4), Math.ceil(cands.length * 0.75));
  const step = band.length / (need * 2);
  const picked = Array.from({ length: need * 2 }, (_, i) => band[Math.floor(i * step)]).sort((a, b) => a.score - b.score);
  for (let k = 0; k < need; k++) {
    const n = have.length + k + 1;
    const pair: [AcornPuzzle, AcornPuzzle] = [picked[k].p, picked[k + need].p];
    for (const p of pair) {
      // 再驗一次：只有一個答案
      const sols = solveAcorn(p.W, p.H, new Set(p.open), p.S, p.E, p.acorns, 3);
      if (sols.length !== 1) throw new Error(`第 ${L.n} 關第 ${n} 張有 ${sols.length} 個答案`);
      used.add(p.open.join() + p.acorns.join());
    }
    file.sheets.push({ id: `acorn-${L.n}-${n}`, level: L.n, n, puzzles: pair });
    console.log(`  第 ${n} 張：分數 ${picked[k].score}、${picked[k + need].score}`);
  }
}

file.sheets.sort((a, b) => a.level - b.level || a.n - b.n);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(file) + "\n");
console.log(`\n寫好 ${OUT}：${file.sheets.length} 張`);
