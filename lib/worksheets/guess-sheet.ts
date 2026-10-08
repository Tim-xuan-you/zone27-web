import { guessLevel, type GuessSheet } from "./guess";
import { wsPage, wsText } from "./acorn-sheet";
import { WS, qrSvg } from "./draw";
import { iconSvg } from "./icons";
import { wordByZh } from "./words";
import { zyBlock, zyLine } from "./zhuyin";

/**
 * 注音猜猜看的 A4：同一張 6 題有三頁
 *   圈圈看（給孩子）：左邊注音、右邊三張圖，圈出對的
 *   寫寫看（給孩子）：左邊圖、右邊格子寫注音（照 Tim 家大班生出的題）
 *   答案（給大人）
 * 孩子讀的字照 5、6 歲寫、全部加注音（memory: kids-worksheet-wording）。
 */

const SITE = "https://zone27.com.tw";
export const guessAnswerUrl = (id: string) => `${SITE}/worksheets/zhuyin/answer?id=${id}`;
const r2 = (n: number) => Math.round(n * 100) / 100;
const SANS = "'Noto Sans TC', 'Noto Sans TC Fallback', sans-serif";

function header(tag: string, level: number): string {
  const L = guessLevel(level);
  const tagW = tag.length * 3.3 + 6;
  let g = `<rect x="14" y="10.5" width="${r2(tagW)}" height="6" rx="3" fill="${WS.azure}"/>`;
  g += wsText(14 + tagW / 2, 13.5, 3.3, tag, { fill: "#FFFFFF", weight: 700, anchor: "middle" });
  const t = zyLine("注音猜猜看", 14, 25.5, 10.5);
  g += t.svg;
  // 第幾關、星星
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

/** 淡紫色的規則框：① ② 兩句（或三句），右邊放例子。連連看也用 */
export function ruleBox(lines: string[], example: string, size = 6.4): string {
  let g = `<rect x="14" y="37" width="182" height="31" rx="3" fill="${WS.lilac}"/>`;
  const ys = lines.length === 2 ? [46, 59] : [44, 52.5, 61];
  lines.forEach((line, k) => {
    g += `<circle cx="22" cy="${ys[k]}" r="3.1" fill="${WS.orange}"/>` + wsText(22, ys[k] + 0.1, 4, String(k + 1), { fill: "#FFFFFF", weight: 800, anchor: "middle" });
    g += zyLine(line, 27.5, ys[k], size).svg;
  });
  return g + example;
}

/** 「家長看這裡」和右下角的 QR code；caption 是 QR 下面的「第幾關第幾張」 */
export function footer(lines: string[], qrUrl: string, caption: string): string {
  let g = `<rect x="14" y="256" width="152" height="29" rx="3" fill="${WS.paper}" stroke="${WS.tan}" stroke-width="0.5"/>`;
  g += wsText(18, 260.8, 3.6, "家長看這裡", { fill: WS.taupe, weight: 700 });
  lines.forEach((l, k) => { g += wsText(18, 266.2 + k * 4.7, 3.05, l); });
  g += qrSvg(qrUrl, 172.5, 255, 22);
  g += wsText(183.5, 279.4, 2.7, "掃這裡看答案", { weight: 700, anchor: "middle" });
  g += wsText(183.5, 283.2, 2.5, caption, { fill: WS.taupe, anchor: "middle" });
  g += wsText(183.5, 286.8, 2.4, "zone27.com.tw", { fill: WS.taupe, anchor: "middle" });
  return g;
}

const numBadge = (y: number, k: number) =>
  `<rect x="14" y="${r2(y - 3.2)}" width="6.4" height="6.4" rx="1.6" fill="${WS.azure}"/>` + wsText(17.2, y + 0.1, 4.2, String(k), { fill: "#FFFFFF", weight: 800, anchor: "middle" });

/** 注音卡：淡紫色的框，裡面一直排的注音 */
function zyCard(zh: string, x: number, cy: number, w: number, h: number, b: number): string {
  const block = zyBlock(wordByZh(zh).zy, x + w / 2, cy, b);
  return `<rect x="${r2(x)}" y="${r2(cy - h / 2)}" width="${r2(w)}" height="${r2(h)}" rx="3" fill="#FFFFFF" stroke="${WS.azure}" stroke-width="0.6"/>` + block.svg;
}

/** 圖框：淡灰色圓角框，孩子在外面畫圈 */
export const picBox = (icon: string, cx: number, cy: number, s: number) =>
  `<rect x="${r2(cx - s / 2)}" y="${r2(cy - s / 2)}" width="${r2(s)}" height="${r2(s)}" rx="3.5" fill="#FFFFFF" stroke="#D5DCE4" stroke-width="0.5"/>` + iconSvg(icon, cx, cy, s * 0.8);

// 第一列離規則框留 4 公釐，最後一列的下緣在 251，離「家長看這裡」5 公釐
const ROW0 = 85, ROWH = 30.6;
const credit = "這一款的點子，是我家大班生出的：自己畫了一張注音題來考爸爸。";

/** 圈圈看 */
function circlePage(s: GuessSheet): string {
  // 右上角的例子：ㄇㄠ → 貓（圈起來）、魚
  let ex = zyLine("像這樣", 160, 41.5, 3.6).svg;
  ex += zyCard("貓", 150, 56, 11, 20, 3.4);
  ex += picBox("cat", 172, 56, 15) + `<ellipse cx="172" cy="56" rx="10" ry="10" fill="none" stroke="${WS.orange}" stroke-width="0.9"/>`;
  ex += picBox("fish", 189, 56, 13);
  let g = header("注音・圈圈看", s.level) + ruleBox(["唸出左邊的注音。", "圈出對的圖。"], ex);
  s.questions.forEach((q, i) => {
    const cy = ROW0 + i * ROWH;
    g += numBadge(cy, i + 1);
    const two = wordByZh(q.zh).zy.length > 1;
    g += zyCard(q.zh, 26, cy, two ? 30 : 20, 25, 6.2);
    q.options.forEach((o, k) => { g += picBox(wordByZh(o).icon, 88 + k * 43, cy, 26); });
  });
  const trap = s.level === 3 ? "這一關有陷阱：有一張圖的注音只差一個符號，一個一個看清楚。" : s.level === 4 ? "這一關有陷阱：有一張圖的注音一樣、只差聲調，唸慢一點再圈。" : "這張在練：一個符號一個符號看清楚，把注音和東西對起來。";
  g += footer([trap, "開始前可以說：「先唸唸看左邊的注音，再找是哪一個。」", "卡住了，就請孩子把三張圖的名字都唸一次，跟左邊比比看。", credit], guessAnswerUrl(s.id), `第 ${s.level} 關第 ${s.n} 張`);
  return wsPage(g);
}

/** 寫注音的格子：每個字一格（左邊三段寫符號、右邊一條寫聲調） */
function writeBoxes(n: number, x: number, cy: number, h = 27): string {
  let g = "";
  const w = h * 0.52, tw = h * 0.22;
  for (let k = 0; k < n; k++) {
    const x0 = x + k * (w + tw + 4);
    g += `<rect x="${r2(x0)}" y="${r2(cy - h / 2)}" width="${r2(w + tw)}" height="${h}" rx="1.5" fill="#FFFFFF" stroke="${WS.iron}" stroke-width="0.45"/>`;
    g += `<line x1="${r2(x0 + w)}" y1="${r2(cy - h / 2)}" x2="${r2(x0 + w)}" y2="${r2(cy + h / 2)}" stroke="${WS.iron}" stroke-width="0.3"/>`;
    for (const f of [1 / 3, 2 / 3]) g += `<line x1="${r2(x0 + 1)}" y1="${r2(cy - h / 2 + h * f)}" x2="${r2(x0 + w - 1)}" y2="${r2(cy - h / 2 + h * f)}" stroke="#B7C3CF" stroke-width="0.3" stroke-dasharray="1 1"/>`;
  }
  return g;
}

/** 寫寫看 */
function writePage(s: GuessSheet): string {
  let ex = zyLine("像這樣", 160, 41.5, 3.6).svg;
  ex += picBox("cat", 157, 56.5, 15);
  ex += writeBoxes(1, 170, 56.5, 20);
  ex += zyBlock(["ㄇㄠ"], 170 + 20 * 0.26, 56.5, 5, "#8A939D").svg;
  let g = header("注音・寫寫看", s.level) + ruleBox(["看圖，說出它的名字。", "在格子裡寫出注音。"], ex);
  s.questions.forEach((q, i) => {
    const cy = ROW0 + i * ROWH;
    g += numBadge(cy, i + 1);
    g += picBox(wordByZh(q.zh).icon, 42, cy, 27);
    g += writeBoxes(wordByZh(q.zh).zy.length, 70, cy);
  });
  g += footer([
    "這張在練：自己唸出東西的名字，寫成注音，聲調也要寫。",
    "寫不出來：先印同一張的「圈圈看」，看過注音再寫一次。",
    "輕聲的點寫在最上面，像「車子」的「子」。聲調寫在右邊那一條。",
    credit,
  ], guessAnswerUrl(s.id), `第 ${s.level} 關第 ${s.n} 張`);
  return wsPage(g);
}

/** 答案（給大人） */
function answerPage(s: GuessSheet): string {
  let g = `<rect x="14" y="10.5" width="22" height="6" rx="3" fill="${WS.azure}"/>` + wsText(25, 13.5, 3.3, "給大人看", { fill: "#FFFFFF", weight: 700, anchor: "middle" });
  const t = zyLine("答案", 14, 25.5, 9);
  g += t.svg;
  g += wsText(14 + t.width + 3, 26, 4, `注音猜猜看・第 ${s.level} 關第 ${s.n} 張`, { fill: WS.taupe });
  g += `<line x1="14" y1="33.5" x2="196" y2="33.5" stroke="${WS.azure}" stroke-width="0.7"/>`;
  g += wsText(14, 40.5, 3.5, "圈圈看：圈第幾張圖。寫寫看：照右邊的注音寫，聲調、輕聲的點都要寫對。");
  s.questions.forEach((q, i) => {
    const cy = 62 + i * 35;
    const w = wordByZh(q.zh);
    g += numBadge(cy, i + 1);
    g += picBox(w.icon, 38, cy, 26);
    g += zyLine(w.zh.split("").map((c, k) => `{${c}|${w.zy[k]}}`).join(""), 58, cy, 11).svg;
    g += zyCard(q.zh, 108, cy, w.zy.length > 1 ? 30 : 20, 28, 6.4);
    g += wsText(150, cy, 4.2, `圈圈看：第 ${q.answer + 1} 張`, { weight: 700 });
  });
  return wsPage(g);
}

export function guessSheetPages(s: GuessSheet): { circle: string; write: string; answer: string } {
  return { circle: circlePage(s), write: writePage(s), answer: answerPage(s) };
}
