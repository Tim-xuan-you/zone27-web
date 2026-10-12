/**
 * 照著點點畫（2026-10-12 出的候選，還沒上網站）。
 *
 * 玩法：左邊的點點上有一個圖，右邊一樣的點點是空的，照著畫一個一樣的。
 * 這是那 27 本裡「眼腦手協調點連點」那種玩法。規則是公用的，圖全部自己畫：
 * 每一個圖都是整數格點上的幾條線，有名字（房子、船、火箭），孩子畫完認得出來才有成就感。
 *
 * 關卡照格子大小分：3×3（大班）、4×4、5×5（大班、小一）。
 * 規矩（docs/DESIGN-LOGIC.md 第 10 條）：先印給 Tim 家的孩子玩，他看過才上。
 */

export interface DotFigure {
  name: string;
  /** 幾個點一排（3、4、5） */
  n: number;
  /** 每一條線：一串格點 [x, y]，左上是 [0, 0] */
  lines: [number, number][][];
}

export const DOT_FIGURES: DotFigure[] = [
  // 3×3
  { name: "方形", n: 3, lines: [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]] },
  { name: "三角形", n: 3, lines: [[[0, 2], [1, 0], [2, 2], [0, 2]]] },
  { name: "房子", n: 3, lines: [[[0, 2], [0, 1], [1, 0], [2, 1], [2, 2], [0, 2]]] },
  { name: "箭頭", n: 3, lines: [[[0, 1], [2, 1]], [[1, 0], [2, 1], [1, 2]]] },
  { name: "山", n: 3, lines: [[[0, 2], [1, 0], [2, 2]]] },
  { name: "杯子", n: 3, lines: [[[0, 0], [0, 2], [2, 2], [2, 0]]] },
  { name: "旗子", n: 3, lines: [[[0, 2], [0, 0], [2, 1], [0, 2]]] },
  { name: "閃電", n: 3, lines: [[[0, 0], [2, 0], [0, 2], [2, 2]]] },
  { name: "十字", n: 3, lines: [[[1, 0], [1, 2]], [[0, 1], [2, 1]]] },
  { name: "沙漏", n: 3, lines: [[[0, 0], [2, 0], [0, 2], [2, 2], [0, 0]]] },
  { name: "樓梯", n: 3, lines: [[[0, 2], [0, 1], [1, 1], [1, 0], [2, 0]]] },
  { name: "鑽石", n: 3, lines: [[[1, 0], [2, 1], [1, 2], [0, 1], [1, 0]]] },
  // 4×4
  { name: "船", n: 4, lines: [[[0, 2], [1, 3], [2, 3], [3, 2], [0, 2]], [[1, 2], [1, 0], [3, 1], [1, 1]]] },
  { name: "魚", n: 4, lines: [[[1, 0], [3, 1], [1, 2], [1, 0]], [[0, 0], [1, 1], [0, 2]]] },
  { name: "信封", n: 4, lines: [[[0, 0], [3, 0], [3, 2], [0, 2], [0, 0]], [[0, 0], [1, 1], [2, 1], [3, 0]]] },
  { name: "帳篷", n: 4, lines: [[[0, 3], [2, 0], [3, 3], [0, 3]], [[1, 3], [2, 1], [2, 3]]] },
  { name: "鑰匙", n: 4, lines: [[[0, 1], [1, 0], [2, 1], [1, 2], [0, 1]], [[2, 1], [3, 1], [3, 2]]] },
  { name: "樹", n: 4, lines: [[[1, 0], [3, 2], [2, 2], [3, 3], [0, 3], [1, 2], [0, 2], [1, 0]]] },
  { name: "椅子", n: 4, lines: [[[0, 0], [0, 3]], [[0, 2], [2, 2], [2, 3]]] },
  { name: "蝴蝶結", n: 4, lines: [[[0, 0], [1, 1], [0, 2], [0, 0]], [[3, 0], [2, 1], [3, 2], [3, 0]], [[1, 1], [2, 1]]] },
  { name: "箭頭", n: 4, lines: [[[0, 1], [3, 1]], [[2, 0], [3, 1], [2, 2]], [[0, 1], [0, 2]]] },
  { name: "樓梯", n: 4, lines: [[[0, 3], [0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]]] },
  // 5×5
  { name: "房子", n: 5, lines: [[[0, 4], [0, 2], [2, 0], [4, 2], [4, 4], [0, 4]], [[1, 4], [1, 3], [2, 3], [2, 4]], [[3, 2], [3, 3]]] },
  { name: "船", n: 5, lines: [[[0, 3], [1, 4], [3, 4], [4, 3], [0, 3]], [[2, 3], [2, 0], [4, 2], [2, 2]]] },
  { name: "火箭", n: 5, lines: [[[2, 0], [3, 1], [3, 3], [4, 4], [0, 4], [1, 3], [1, 1], [2, 0]], [[1, 3], [3, 3]]] },
  { name: "樹", n: 5, lines: [[[2, 0], [4, 2], [3, 2], [4, 3], [0, 3], [1, 2], [0, 2], [2, 0]], [[2, 3], [2, 4]]] },
  { name: "魚", n: 5, lines: [[[1, 1], [3, 0], [4, 2], [3, 4], [1, 3], [1, 1]], [[1, 2], [0, 1], [0, 3], [1, 2]]] },
  { name: "杯子", n: 5, lines: [[[0, 0], [0, 4], [3, 4], [3, 0]], [[3, 1], [4, 1], [4, 3], [3, 3]]] },
  { name: "雨傘", n: 5, lines: [[[0, 2], [2, 0], [4, 2], [0, 2]], [[2, 2], [2, 4], [3, 4]]] },
  { name: "蝴蝶結", n: 5, lines: [[[0, 0], [2, 2], [0, 4], [0, 0]], [[4, 0], [2, 2], [4, 4], [4, 0]]] },
  { name: "信封", n: 5, lines: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]], [[0, 0], [2, 2], [4, 0]]] },
  { name: "鑰匙", n: 5, lines: [[[0, 1], [1, 0], [2, 1], [1, 2], [0, 1]], [[2, 1], [4, 1]], [[3, 1], [3, 2]], [[4, 1], [4, 2]]] },
  { name: "樓梯", n: 5, lines: [[[0, 4], [0, 3], [1, 3], [1, 2], [2, 2], [2, 1], [3, 1], [3, 0], [4, 0]]] },
  { name: "兩座山", n: 5, lines: [[[0, 4], [1, 1], [2, 3], [3, 0], [4, 4]]] },
  { name: "鑽石", n: 5, lines: [[[2, 0], [4, 2], [2, 4], [0, 2], [2, 0]], [[0, 2], [4, 2]]] },
  { name: "箭頭", n: 5, lines: [[[0, 2], [4, 2]], [[2, 0], [4, 2], [2, 4]]] },
  { name: "星星", n: 5, lines: [[[2, 0], [3, 4], [0, 1], [4, 1], [1, 4], [2, 0]]] },
  { name: "帳篷", n: 5, lines: [[[0, 4], [2, 0], [4, 4], [0, 4]], [[1, 4], [2, 2], [3, 4]]] },
];

export interface DotLevel {
  n: number;
  grid: number;
  /** 一張幾題 */
  per: number;
  name: string;
  what: string;
  age: string;
  grade: string;
  stars: 1 | 2 | 3;
}
export const DOT_LEVELS: DotLevel[] = [
  { n: 1, grid: 3, per: 6, name: "三個點", what: "3×3 的點點，先找起點，再看往哪邊", age: "4～5 歲", grade: "中班、大班", stars: 1 },
  { n: 2, grid: 4, per: 6, name: "四個點", what: "4×4 的點點，有斜線，要數往右幾個、往下幾個", age: "5～6 歲", grade: "大班", stars: 2 },
  { n: 3, grid: 5, per: 4, name: "五個點", what: "5×5 的點點，線比較多，一條一條畫", age: "6 歲", grade: "大班、小一", stars: 3 },
];
export const dotLevel = (n: number): DotLevel => DOT_LEVELS[Math.min(Math.max(Math.round(n) || 1, 1), DOT_LEVELS.length) - 1];

/** 一張：固定編號，固定幾個圖（名字對 DOT_FIGURES） */
export interface DotSheet {
  id: string;
  level: number;
  n: number;
  figures: string[];
  tested?: string;
}

/** 畫一個點陣：(x, y) 是左上角那個點，gap 是點跟點的距離 */
export function dotGrid(grid: number, x: number, y: number, gap: number, r = 1.1, color = "#3E4348"): string {
  let g = "";
  for (let i = 0; i < grid; i++) for (let j = 0; j < grid; j++) g += `<circle cx="${(x + i * gap).toFixed(2)}" cy="${(y + j * gap).toFixed(2)}" r="${r}" fill="${color}"/>`;
  return g;
}

/** 把圖畫在點陣上 */
export function dotFigureSvg(f: DotFigure, x: number, y: number, gap: number, color = "#1E88E5", width = 1.3): string {
  return f.lines.map((line) => `<polyline points="${line.map(([a, b]) => `${(x + a * gap).toFixed(2)},${(y + b * gap).toFixed(2)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
}

export const dotFigure = (name: string, grid: number): DotFigure => {
  const f = DOT_FIGURES.find((x) => x.name === name && x.n === grid);
  if (!f) throw new Error(`沒有 ${grid}×${grid} 的「${name}」`);
  return f;
};
