import { ACORN_EXAMPLE, ACORN_LEVELS, acornHints, acornLevel, sheetPuzzles, type AcornPuzzle, type AcornSheet } from "./acorn";
import { WS, acornIcon, mazeSvg, qrSvg } from "./draw";
import { zyLine } from "./zhuyin";

/**
 * 撿松果回家的 A4 學習單：第 1 頁給孩子寫（兩題），第 2 頁是提示和答案（給大人，要不要印自己選）。
 * 整張是一個 SVG（210 × 297 公釐），螢幕上縮小預覽、印出來剛好一張 A4，兩邊長得一模一樣。
 *
 * 一張紙上有兩種讀者（memory: kids-worksheet-wording）：
 *   孩子讀的（標題、規則、例子、關卡）：照 5、6 歲寫，全部加注音，一句只講一件事
 *   大人讀的（家長看這裡）：寫給大人，但一樣白話；講「孩子」不講「他」
 */

const SITE = "https://zone27.com.tw";
export const acornHintUrl = (id: string) => `${SITE}/worksheets/acorn/hint?id=${id}`;

const SANS = "'Noto Sans TC', 'Noto Sans TC Fallback', sans-serif";
const r2 = (n: number) => Math.round(n * 100) / 100;
const text = (x: number, y: number, size: number, s: string, opt: { fill?: string; weight?: number; anchor?: string } = {}) =>
  `<text x="${r2(x)}" y="${r2(y)}" font-size="${size}" font-family="${SANS}" font-weight="${opt.weight ?? 400}" fill="${opt.fill ?? WS.iron}" dominant-baseline="central"${opt.anchor ? ` text-anchor="${opt.anchor}"` : ""}>${s}</text>`;
const svgPage = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" class="ws-sheet"><rect width="210" height="297" fill="#FFFFFF"/>${body}</svg>`;

/** 第幾關、星星 */
function levelBadge(x: number, y: number, n: number): { svg: string; width: number } {
  const L = acornLevel(n);
  const a = zyLine("第", x, y, 5);
  const numX = x + a.width - 0.6;
  const b = zyLine("關", numX + 4.6, y, 5);
  let cx = numX + 4.6 + b.width + 1;
  let stars = "";
  for (let k = 0; k < 3; k++) {
    stars += `<text x="${r2(cx)}" y="${r2(y)}" font-size="4.6" font-family="${SANS}" fill="${k < L.stars ? WS.orange : "#E3E1DD"}" dominant-baseline="central">★</text>`;
    cx += 4.4;
  }
  return { svg: a.svg + text(numX, y, 6, String(n), { fill: WS.azure, weight: 800 }) + b.svg + stars, width: cx - x };
}

/** 題號（藍色方塊）＋這一題有幾顆松果：孩子走完自己數，夠了就對了 */
function puzzleLabel(x: number, y: number, k: number, count: number): string {
  let g = `<rect x="${r2(x)}" y="${r2(y - 3.2)}" width="6.4" height="6.4" rx="1.6" fill="${WS.azure}"/>`;
  g += text(x + 3.2, y, 4.2, String(k), { fill: "#FFFFFF", weight: 800, anchor: "middle" });
  g += acornIcon(x + 12.5, y + 0.2, 6.2);
  g += text(x + 16.6, y, 5, String(count), { weight: 800 });
  g += zyLine("顆", x + 20.4, y, 5).svg;
  return g;
}

function header(title: string, tag: string, titleSize: number, level?: number): string {
  const tagW = tag.length * 3.3 + 6;
  let g = `<rect x="14" y="10.5" width="${r2(tagW)}" height="6" rx="3" fill="${WS.azure}"/>`;
  g += text(14 + tagW / 2, 13.5, 3.3, tag, { fill: "#FFFFFF", weight: 700, anchor: "middle" });
  const t = zyLine(title, 14, 25.5, titleSize);
  g += t.svg;
  if (level) g += levelBadge(14 + t.width + 5, 26.5, level).svg;
  g += `<line x1="14" y1="33.5" x2="196" y2="33.5" stroke="${WS.azure}" stroke-width="0.7"/>`;
  return g;
}

/** 第 1 頁：給孩子寫 */
function page1(level: number, n: number, hintUrl: string, puzzles: [AcornPuzzle, AcornPuzzle]): string {
  let g = header("撿松果回家", "益智題・路線", 10.5, level);
  // 名字、日期
  for (const [label, y] of [["名字", 20], ["日期", 29]] as const) {
    const z = zyLine(label, 143, y, 4.6);
    g += z.svg + `<line x1="${r2(143 + z.width + 1)}" y1="${y + 2.6}" x2="196" y2="${y + 2.6}" stroke="${WS.iron}" stroke-width="0.35"/>`;
  }
  // 規則：一句只講一件事，說可以怎麼做（2026-10-01 Tim 改過用詞）
  g += `<rect x="14" y="37" width="182" height="33" rx="3" fill="${WS.lilac}"/>`;
  g += zyLine("幫小松鼠回家。", 19, 44.5, 6.4).svg;
  // 2026-10-01 孩子問「每一格是什麼？」：用他自己會講的「格子」（跳格子），格子也畫成一塊一塊的地磚
  for (const [k, line, y] of [[1, "每一顆松果都要撿到。", 54.5], [2, "每個格子只能走一次。", 64]] as const) {
    g += `<circle cx="22" cy="${y}" r="3.1" fill="${WS.orange}"/>` + text(22, y + 0.1, 4, String(k), { fill: "#FFFFFF", weight: 800, anchor: "middle" });
    g += zyLine(line, 27.5, y, 6.4).svg;
  }
  // 右邊：小松鼠這樣走（看一題做好的，規則不用讀也懂）
  // 例子：每走一格留一個腳印，一看就懂「一格一格走，走過的不能再踩」
  const ex = mazeSvg(ACORN_EXAMPLE, 7, { path: ACORN_EXAMPLE.answer, paws: true });
  const exX = 196.5 - ex.w;
  const capW = zyLine("小松鼠這樣走", 0, 0, 3.6).width;
  g += zyLine("小松鼠這樣走", exX + ex.w / 2 - capW / 2, 41.5, 3.6).svg;
  g += `<g transform="translate(${r2(exX)} 44.6)">${ex.svg}</g>`;

  // 兩題，上下平均分配
  const L = acornLevel(level);
  const mazes = puzzles.map((p) => mazeSvg(p, L.cell));
  const top = 73, bottom = 253;
  const blocks = mazes.map((m) => 8 + m.h);
  const gap = (bottom - top - blocks[0] - blocks[1]) / 3;
  let y = top + gap;
  mazes.forEach((m, k) => {
    g += puzzleLabel(14, y + 3.2, k + 1, puzzles[k].acorns.length);
    g += `<g transform="translate(${r2((210 - m.w) / 2)} ${r2(y + 8)})">${m.svg}</g>`;
    y += blocks[k] + gap;
  });

  // 家長看這裡
  g += `<rect x="14" y="256" width="152" height="29" rx="3" fill="${WS.paper}" stroke="${WS.tan}" stroke-width="0.5"/>`;
  g += text(18, 260.8, 3.6, "家長看這裡", { fill: WS.taupe, weight: 700 });
  const lines = [
    "這張在練：先把路線想好再下筆，一邊走一邊記住哪幾顆松果撿過了。",
    "開始前可以說：「像跳格子一樣，一格一格走，走過的格子不能再踩。」",
    "卡住了先問：「哪一顆松果最難拿到？」還是不會，掃右邊的 QR code 看提示。",
    `太難就印前一關，太簡單就印下一關（這是第 ${level} 關，一共 ${ACORN_LEVELS.length} 關）。`,
  ];
  lines.forEach((l, k) => { g += text(18, 266.2 + k * 4.7, 3.05, l); });
  // QR code：掃了看這一張的提示
  g += qrSvg(hintUrl, 172.5, 255, 22);
  g += text(183.5, 279.4, 2.7, "掃這裡看提示", { weight: 700, anchor: "middle" });
  // 編號：老師可以說「今天印第 3 關第 2 張」，大家印到的都一樣
  if (n) g += text(183.5, 283.2, 2.5, `第 ${level} 關第 ${n} 張`, { fill: WS.taupe, anchor: "middle" });
  g += text(183.5, n ? 286.8 : 283.2, 2.4, "zone27.com.tw", { fill: WS.taupe, anchor: "middle" });
  return svgPage(g);
}

/** 第 2 頁：提示和答案（給大人） */
function page2(level: number, puzzles: [AcornPuzzle, AcornPuzzle]): string {
  let g = header("提示和答案", "給大人看", 9);
  g += text(14, 40.5, 3.5, "卡住的時候，一次只給一張提示，讓孩子接著自己畫。三張提示都看過還是不會，再一起看答案。");
  g += text(14, 46, 3.5, "用手機掃第 1 頁右下角的 QR code，也看得到同樣的提示，一次點開一段。", { fill: WS.taupe });
  const L = acornLevel(level);
  const c = Math.min(10.5, 46 / (L.H + 0.55));
  let y = 53;
  puzzles.forEach((p, k) => {
    g += puzzleLabel(14, y + 3.2, k + 1, p.acorns.length);
    const [h1, h2, h3] = acornHints(p);
    const cells: [number[], string, string][] = [
      [h1, WS.orange, "1"], [h2, WS.orange, "2"], [h3, WS.orange, "3"], [p.answer, WS.emerald, ""],
    ];
    cells.forEach(([path, color, n], i) => {
      const m = mazeSvg(p, c, { path, color, side: 1.0, icon: 0.85 });
      const col = i % 2, row = Math.floor(i / 2);
      const cx = col === 0 ? 105 - 46 : 105 + 46;
      const top = y + 8 + row * (m.h + 9);
      g += `<g transform="translate(${r2(cx - m.w / 2)} ${r2(top)})">${m.svg}</g>`;
      const cap = zyLine(n ? "提示" : "答案", 0, 0, 4.2);
      const capW = cap.width + (n ? 3.2 : 0);
      g += zyLine(n ? "提示" : "答案", cx - capW / 2, top + m.h + 3.6, 4.2).svg;
      if (n) g += text(cx - capW / 2 + cap.width - 0.6, top + m.h + 3.6, 4.4, n, { fill: WS.orange, weight: 800 });
    });
    y += 8 + 2 * (mazeSvg(p, c, { side: 1.0 }).h + 9) + 4;
  });
  return svgPage(g);
}

/** 這一張的兩頁（第 2 頁要不要印，由畫面上的勾選決定） */
export function acornSheetPages(sheet: AcornSheet): { page1: string; page2: string } {
  return {
    page1: page1(sheet.level, sheet.n, acornHintUrl(sheet.id), sheet.puzzles),
    page2: page2(sheet.level, sheet.puzzles),
  };
}

/** 2026-10-01 改成固定編號以前印出去的（網址是 ?l=關&s=號碼）。只有 Tim 家印過，留著讓舊的 QR code 還掃得到 */
export function acornLegacyPuzzles(level: number, seed: number): [AcornPuzzle, AcornPuzzle] {
  return sheetPuzzles(level, seed);
}

/* 出題紙（make-sheet.ts）共用同一套標題、文字、頁面 */
export { text as wsText, header as wsHeader, svgPage as wsPage, levelBadge as wsLevelBadge };
