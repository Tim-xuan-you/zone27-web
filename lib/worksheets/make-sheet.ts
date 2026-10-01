import { ACORN_EXAMPLE, type AcornPuzzle } from "./acorn";
import { wsHeader, wsPage, wsText } from "./acorn-sheet";
import { WS, acornIcon, mazeSvg } from "./draw";
import { zyLine } from "./zhuyin";

/**
 * 出題紙：換孩子出題（2026-10-01）。
 *
 * Tim 家的大班生寫完撿松果回家說太簡單，自己畫了題目考爸爸，第二天又出了一張。
 * 讓他開心的不只是解題，還有「我出題、爸爸寫」這件事。所以做兩張：
 *   撿松果回家的出題單：空白地磚、小松鼠、房子都印好，孩子畫牆、畫松果
 *   萬用出題紙：什麼題都能出，答案寫在下面、往後摺起來
 *
 * 孩子讀的字照 5、6 歲寫，全部加注音（memory: kids-worksheet-wording）。
 */

const r2 = (n: number) => Math.round(n * 100) / 100;

/** 出題的人、寫題的人 */
function who(): string {
  let g = "";
  for (const [label, y] of [["出題的人", 19.5], ["寫題的人", 28.5]] as const) {
    const z = zyLine(label, 130, y, 4.4);
    g += z.svg + `<line x1="${r2(130 + z.width + 1)}" y1="${y + 2.6}" x2="196" y2="${y + 2.6}" stroke="${WS.iron}" stroke-width="0.35"/>`;
  }
  return g;
}

function ruleLine(k: number, line: string, y: number, size = 6.2): string {
  return `<circle cx="22" cy="${y}" r="3.1" fill="${WS.orange}"/>` + wsText(22, y + 0.1, 4, String(k), { fill: "#FFFFFF", weight: 800, anchor: "middle" }) + zyLine(line, 27.5, y, size).svg;
}

function parentBox(lines: string[]): string {
  let g = `<rect x="14" y="256" width="182" height="29" rx="3" fill="${WS.paper}" stroke="${WS.tan}" stroke-width="0.5"/>`;
  g += wsText(18, 260.8, 3.6, "家長看這裡", { fill: WS.taupe, weight: 700 });
  lines.forEach((l, k) => { g += wsText(18, 266.2 + k * 4.7, 3.05, l); });
  g += wsText(196, 289.5, 2.4, "zone27.com.tw", { fill: WS.taupe, anchor: "end" });
  return g;
}

/** 空白的松果迷宮：每一格都打通，格子之間畫虛線讓孩子照著畫牆 */
function blankMaze(W: number, H: number, c: number): { svg: string; w: number; h: number } {
  const open: string[] = [];
  for (let i = 0; i < W * H; i++) {
    if (i % W < W - 1) open.push(`${i}-${i + 1}`);
    if (Math.floor(i / W) < H - 1) open.push(`${i}-${i + W}`);
  }
  const p: AcornPuzzle = { W, H, S: 0, E: W * H - 1, open, acorns: [], answer: [], shortestLen: 0 };
  const m = mazeSvg(p, c);
  const ml = c * 1.15, mt = c * 0.2;
  const d: string[] = [];
  for (let x = 1; x < W; x++) d.push(`M ${r2(ml + x * c)} ${r2(mt)} L ${r2(ml + x * c)} ${r2(mt + H * c)}`);
  for (let y = 1; y < H; y++) d.push(`M ${r2(ml)} ${r2(mt + y * c)} L ${r2(ml + W * c)} ${r2(mt + y * c)}`);
  const guides = `<path d="${d.join(" ")}" stroke="#8FA6BC" stroke-width="${r2(c * 0.035)}" stroke-dasharray="${r2(c * 0.09)} ${r2(c * 0.07)}" stroke-linecap="round"/>`;
  return { svg: m.svg + guides, w: m.w, h: m.h };
}

/** 撿松果回家的出題單 */
export function acornMakerPage(): string {
  let g = wsHeader("換你出題", "出題紙・撿松果回家", 10.5);
  g += who();
  g += `<rect x="14" y="37" width="182" height="33" rx="3" fill="${WS.lilac}"/>`;
  g += ruleLine(1, "在虛線上畫牆。", 44.5);
  g += ruleLine(2, "在格子裡畫松果。", 54);
  g += ruleLine(3, "自己先走走看，再給別人寫。", 63.5);
  // 右邊：像這樣（一題做好的，有牆、有松果，沒有答案）
  const ex = mazeSvg(ACORN_EXAMPLE, 7);
  const exX = 196.5 - ex.w;
  const cap = zyLine("像這樣", 0, 0, 3.6).width;
  g += zyLine("像這樣", exX + ex.w / 2 - cap / 2, 41.5, 3.6).svg;
  g += `<g transform="translate(${r2(exX)} 44.6)">${ex.svg}</g>`;

  const mazes = [blankMaze(4, 4, 16), blankMaze(5, 5, 14)];
  const top = 74, bottom = 252;
  const gap = (bottom - top - mazes.reduce((a, m) => a + m.h + 8, 0)) / 3;
  let y = top + gap;
  mazes.forEach((m, k) => {
    g += `<rect x="14" y="${r2(y)}" width="6.4" height="6.4" rx="1.6" fill="${WS.azure}"/>` + wsText(17.2, y + 3.3, 4.2, String(k + 1), { fill: "#FFFFFF", weight: 800, anchor: "middle" });
    g += `<g transform="translate(${r2((210 - m.w) / 2)} ${r2(y + 8)})">${m.svg}</g>`;
    y += m.h + 8 + gap;
  });

  g += parentBox([
    "這張在練：出題要先想好答案，再想怎麼讓別人想不到，比寫題更要動腦。",
    "畫完先問：「從小松鼠走到房子，你的題目只有一條路嗎？」讓孩子自己走一次。",
    "寫題的人卡住了，就請出題的人當小老師，講他的路要怎麼走。",
    "松果也可以換成別的東西：貝殼、星星、糖果，讓孩子自己編故事。",
  ]);
  return wsPage(g);
}

/** 萬用出題紙：什麼題都能出 */
export function freeMakerPage(): string {
  let g = wsHeader("換你出題", "出題紙・什麼題都可以", 10.5);
  g += who();
  // 題目
  g += `<rect x="14" y="38" width="182" height="160" rx="4" fill="#FFFFFF" stroke="${WS.azure}" stroke-width="0.6"/>`;
  g += zyLine("題目", 19, 45, 5.2).svg;
  // 摺線：答案寫在下面，往後摺
  g += zyLine("答案寫在下面，再往後摺，不能偷看。", 27, 207, 5.2).svg;
  g += `<path d="M 17 203 q 3 4 0 8" fill="none" stroke="${WS.orange}" stroke-width="0.8" stroke-linecap="round"/><path d="M 15.4 210 L 17 211.6 L 18.8 210.2" fill="none" stroke="${WS.orange}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += `<line x1="8" y1="215" x2="202" y2="215" stroke="${WS.taupe}" stroke-width="0.4" stroke-dasharray="2.2 1.6"/>`;
  g += wsText(196, 212, 2.6, "沿著虛線往後摺", { fill: WS.taupe, anchor: "end" });
  // 答案
  g += `<rect x="14" y="219" width="182" height="33" rx="4" fill="#FFFFFF" stroke="${WS.tan}" stroke-width="0.6"/>`;
  g += zyLine("答案", 19, 226, 5.2).svg;
  g += acornIcon(190, 227, 6.5);

  g += parentBox([
    "孩子想出什麼題都可以：迷宮、連連看、猜謎、算數。我家大班生第一次就出了迷宮和注音題。",
    "寫題的人寫完，打開下面的答案一起對。出題的人當小老師，講為什麼。",
    "想不出來也沒關係，先從改一題寫過的題目開始，例如多畫一顆松果、多一面牆。",
    "爸媽也可以出一題給孩子寫，寫完再換孩子出，輪流當老師。",
  ]);
  return wsPage(g);
}
