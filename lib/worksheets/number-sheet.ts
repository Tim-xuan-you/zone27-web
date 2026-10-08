import { wsPage, wsText } from "./acorn-sheet";
import { WS, mazeSvg, qrSvg } from "./draw";
import { NUMBER_EXAMPLE, NUMBER_LEVELS, numberEquation, numberLevel, type NumberPuzzle, type NumberSheet } from "./number";
import { zyLine } from "./zhuyin";

/**
 * 數字松果的 A4：第 1 頁給孩子寫（兩題），第 2 頁是答案和算式（給大人）。
 * 版面跟撿松果回家一樣（同一個迷宮、同一隻小松鼠），孩子一看就知道怎麼玩，多了數字。
 */

const SITE = "https://zone27.com.tw";
export const numberAnswerUrl = (id: string) => `${SITE}/worksheets/number/answer?id=${id}`;
const r2 = (n: number) => Math.round(n * 100) / 100;
const SANS = "'Noto Sans TC', 'Noto Sans TC Fallback', sans-serif";

function header(tag: string, title: string, level?: number): string {
  const tagW = tag.length * 3.3 + 6;
  let g = `<rect x="14" y="10.5" width="${r2(tagW)}" height="6" rx="3" fill="${WS.azure}"/>`;
  g += wsText(14 + tagW / 2, 13.5, 3.3, tag, { fill: "#FFFFFF", weight: 700, anchor: "middle" });
  const t = zyLine(title, 14, 25.5, level ? 10.5 : 9);
  g += t.svg;
  if (level) {
    const L = numberLevel(level);
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
  }
  g += `<line x1="14" y1="33.5" x2="196" y2="33.5" stroke="${WS.azure}" stroke-width="0.7"/>`;
  return g;
}

const numBox = (x: number, y: number, k: number) =>
  `<rect x="${r2(x)}" y="${r2(y - 3.2)}" width="6.4" height="6.4" rx="1.6" fill="${WS.azure}"/>` + wsText(x + 3.2, y, 4.2, String(k), { fill: "#FFFFFF", weight: 800, anchor: "middle" });
const opts = (p: NumberPuzzle) => ({ values: p.values, target: p.target });

/** 第 1 頁：給孩子寫 */
function page1(s: NumberSheet): string {
  const L = numberLevel(s.level);
  let g = header("數學・加法迷宮", "數字松果", s.level);
  // 規則：一句一件事（memory: kids-worksheet-wording）
  g += `<rect x="14" y="37" width="182" height="33" rx="3" fill="${WS.lilac}"/>`;
  ([["撿到的松果，數字加起來。", 44.5], ["要剛好等於房子上的數字。", 54], ["每個格子只能走一次。", 63.5]] as const).forEach(([line, y], k) => {
    g += `<circle cx="22" cy="${y}" r="3.1" fill="${WS.orange}"/>` + wsText(22, y + 0.1, 4, String(k + 1), { fill: "#FFFFFF", weight: 800, anchor: "middle" });
    g += zyLine(line, 27.5, y, 5.6).svg;
  });
  // 右邊的例子：同一個 3×3，腳印走過 2 和 3，房子 5
  const ex = mazeSvg(NUMBER_EXAMPLE, 7, { path: NUMBER_EXAMPLE.answer, paws: true, ...opts(NUMBER_EXAMPLE) });
  const exX = 196.5 - ex.w;
  const capW = zyLine("像這樣", 0, 0, 3.6).width;
  g += zyLine("像這樣", exX + ex.w / 2 - capW / 2, 41.5, 3.6).svg;
  g += `<g transform="translate(${r2(exX)} 44.6)">${ex.svg}</g>`;
  g += wsText(exX - 2, 57, 4.4, "2 + 3 = 5", { weight: 800, anchor: "end", fill: WS.orange });

  const mazes = s.puzzles.map((p) => mazeSvg(p, L.cell, opts(p)));
  const top = 73, bottom = 253;
  const blocks = mazes.map((m) => 8 + m.h);
  const gap = (bottom - top - blocks[0] - blocks[1]) / 3;
  let y = top + gap;
  mazes.forEach((m, k) => {
    g += numBox(14, y + 3.2, k + 1);
    g += `<g transform="translate(${r2((210 - m.w) / 2)} ${r2(y + 8)})">${m.svg}</g>`;
    y += blocks[k] + gap;
  });

  g += `<rect x="14" y="256" width="152" height="29" rx="3" fill="${WS.paper}" stroke="${WS.tan}" stroke-width="0.5"/>`;
  g += wsText(18, 260.8, 3.6, "家長看這裡", { fill: WS.taupe, weight: 700 });
  [
    `這張在練：${L.what}。不用每一顆都撿，要自己挑。`,
    "開始前可以說：「房子上寫幾，就要撿到加起來剛好是幾，走過松果就算撿到。」",
    "卡住了先問：「最近的那條路加起來是多少？要多撿一顆，還是少撿一顆？」",
    `太難就印前一關，太簡單就印下一關（這是第 ${s.level} 關，一共 ${NUMBER_LEVELS.length} 關）。`,
  ].forEach((l, k) => { g += wsText(18, 266.2 + k * 4.7, 3.05, l); });
  g += qrSvg(numberAnswerUrl(s.id), 172.5, 255, 22);
  g += wsText(183.5, 279.4, 2.7, "掃這裡看答案", { weight: 700, anchor: "middle" });
  g += wsText(183.5, 283.2, 2.5, `第 ${s.level} 關第 ${s.n} 張`, { fill: WS.taupe, anchor: "middle" });
  g += wsText(183.5, 286.8, 2.4, "zone27.com.tw", { fill: WS.taupe, anchor: "middle" });
  return wsPage(g);
}

/** 第 2 頁：答案（給大人） */
function page2(s: NumberSheet): string {
  const L = numberLevel(s.level);
  let g = header("給大人看", "答案");
  g += wsText(14, 40.5, 3.5, "綠色的線是答案，旁邊是要撿的松果和算式。剛好湊到房子數字的路，每一題都只有這一條。");
  g += wsText(14, 46, 3.5, "卡住的時候，可以先只說要撿哪幾顆，路線讓孩子自己找。", { fill: WS.taupe });
  const c = Math.min(L.cell, 104 / (L.H + 0.55));
  let y = 54;
  s.puzzles.forEach((p, k) => {
    const m = mazeSvg(p, c, { path: p.answer, ...opts(p) });
    g += numBox(14, y + 3.2, k + 1);
    g += `<g transform="translate(22 ${r2(y + 4)})">${m.svg}</g>`;
    const tx = 22 + m.w + 8, ty = y + 4 + m.h / 2;
    g += zyLine("要撿的松果", tx, ty - 9, 4.4).svg;
    g += wsText(tx, ty, 7, numberEquation(p), { weight: 800, fill: WS.emerald });
    g += wsText(tx, ty + 9, 3.3, `一共有 ${p.routes} 條路，只有這一條剛好是 ${p.target}。`, { fill: WS.taupe });
    y += 4 + m.h + 10;
  });
  return wsPage(g);
}

export function numberSheetPages(s: NumberSheet): { page1: string; page2: string } {
  return { page1: page1(s), page2: page2(s) };
}
