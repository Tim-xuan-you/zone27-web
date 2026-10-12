import { wsPage, wsText } from "./acorn-sheet";
import { WS } from "./draw";
import { DOT_LEVELS, dotFigure, dotFigureSvg, dotGrid, dotLevel, type DotSheet } from "./dots";
import { ruleBox } from "./guess-sheet";
import { zyLine } from "./zhuyin";

/**
 * 照著點點畫的 A4（候選，還沒上網站）：左邊點陣上有圖，右邊空的點陣照著畫。
 * 沒有答案頁：左邊就是答案。
 */

const r2 = (n: number) => Math.round(n * 100) / 100;
const SANS = "'Noto Sans TC', 'Noto Sans TC Fallback', sans-serif";

function header(level: number): string {
  const L = dotLevel(level);
  const tag = "運筆・照著畫";
  const tagW = tag.length * 3.3 + 6;
  let g = `<rect x="14" y="10.5" width="${r2(tagW)}" height="6" rx="3" fill="${WS.azure}"/>`;
  g += wsText(14 + tagW / 2, 13.5, 3.3, tag, { fill: "#FFFFFF", weight: 700, anchor: "middle" });
  const t = zyLine("照著點點畫", 14, 25.5, 10.5);
  g += t.svg;
  let x = 14 + t.width + 5;
  const a = zyLine("第", x, 26.5, 5);
  g += a.svg;
  x += a.width - 0.6;
  g += wsText(x, 26.5, 6, String(level), { fill: WS.azure, weight: 800 });
  x += 4.6;
  const b = zyLine("關", x, 26.5, 5);
  g += b.svg;
  x += b.width + 1;
  for (let k = 0; k < 3; k++) {
    g += `<text x="${r2(x)}" y="26.5" font-size="4.6" font-family="${SANS}" fill="${k < L.stars ? WS.orange : "#E3E1DD"}" dominant-baseline="central">★</text>`;
    x += 4.4;
  }
  for (const [label, y] of [["名字", 20], ["日期", 29]] as const) {
    const z = zyLine(label, 143, y, 4.6);
    g += z.svg + `<line x1="${r2(143 + z.width + 1)}" y1="${y + 2.6}" x2="196" y2="${y + 2.6}" stroke="${WS.iron}" stroke-width="0.35"/>`;
  }
  g += `<line x1="14" y1="33.5" x2="196" y2="33.5" stroke="${WS.azure}" stroke-width="0.7"/>`;
  return g;
}

/** 一題：左邊有圖的點陣、箭頭、右邊空的點陣 */
function pair(name: string, grid: number, x: number, y: number, size: number): string {
  const f = dotFigure(name, grid);
  const gap = size / (grid - 1);
  const r = grid === 3 ? 1.4 : grid === 4 ? 1.25 : 1.1;
  let g = dotGrid(grid, x, y, gap, r) + dotFigureSvg(f, x, y, gap, WS.azure, grid === 5 ? 1.2 : 1.4);
  const ax = x + size + 7, ay = y + size / 2;
  g += `<path d="M ${r2(ax)} ${r2(ay)} L ${r2(ax + 6)} ${r2(ay)} M ${r2(ax + 4)} ${r2(ay - 2)} L ${r2(ax + 6)} ${r2(ay)} L ${r2(ax + 4)} ${r2(ay + 2)}" fill="none" stroke="${WS.orange}" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += dotGrid(grid, x + size + 20, y, gap, r);
  return g;
}

export function dotsSheetPage(s: DotSheet): string {
  const L = dotLevel(s.level);
  // 例子：3×3 的三角形，右邊畫好一半（淡的）
  let ex = zyLine("像這樣", 160, 41.5, 3.6).svg;
  const eg = 7;
  ex += dotGrid(3, 150, 50, eg, 0.9) + dotFigureSvg(dotFigure("三角形", 3), 150, 50, eg, WS.azure, 1) ;
  ex += `<path d="M 168 57 L 173 57 M 171.5 55.5 L 173 57 L 171.5 58.5" fill="none" stroke="${WS.orange}" stroke-width="0.8" stroke-linecap="round"/>`;
  ex += dotGrid(3, 178, 50, eg, 0.9) + dotFigureSvg(dotFigure("三角形", 3), 178, 50, eg, "#9AA3AD", 1);
  let g = header(s.level) + ruleBox(["左邊有一個圖。", "右邊的點點，畫一個一樣的。"], ex, 6);

  // 題目：3×3、4×4 兩欄，5×5 一欄（兩欄會超出紙的邊）
  const size = L.grid === 3 ? 28 : L.grid === 4 ? 30 : 36;
  const pairW = size * 2 + 20;
  const cols = L.grid === 5 ? 1 : 2, rows = Math.ceil(L.per / cols);
  const top = 80, bottom = 250;
  const rowH = (bottom - top) / rows;
  const colX = cols === 1 ? [105 - pairW / 2] : [105 - 4 - pairW, 105 + 4];
  s.figures.forEach((name, i) => {
    const c = i % cols, rI = Math.floor(i / cols);
    const x = colX[c], y = top + rI * rowH + (rowH - size) / 2 - 2;
    // 題號放在點陣左上角的外面，不要壓到第一個點
    g += `<rect x="${r2(x - 9)}" y="${r2(y - 9)}" width="6.4" height="6.4" rx="1.6" fill="${WS.azure}"/>` + wsText(x - 5.8, y - 5.8, 4.2, String(i + 1), { fill: "#FFFFFF", weight: 800, anchor: "middle" });
    g += pair(name, L.grid, x, y, size);
  });

  g += `<rect x="14" y="256" width="182" height="29" rx="3" fill="${WS.paper}" stroke="${WS.tan}" stroke-width="0.5"/>`;
  g += wsText(18, 260.8, 3.6, "家長看這裡", { fill: WS.taupe, weight: 700 });
  [
    `這張在練：眼睛看到的位置，手畫到一樣的地方。${L.what}。`,
    "開始前可以說：「先找第一個點在哪裡，再看線往哪邊走。」",
    "畫歪了沒關係，點對了就算。一條線一條線畫，不用一筆畫完。",
    `太難就印前一關，太簡單就印下一關（這是第 ${s.level} 關，一共 ${DOT_LEVELS.length} 關）。`,
  ].forEach((l, k) => { g += wsText(18, 266.2 + k * 4.7, 3.05, l); });
  g += wsText(183.5, 283.2, 2.5, `第 ${s.level} 關第 ${s.n} 張`, { fill: WS.taupe, anchor: "middle" });
  g += wsText(183.5, 286.8, 2.4, "zone27.com.tw", { fill: WS.taupe, anchor: "middle" });
  return wsPage(g);
}
