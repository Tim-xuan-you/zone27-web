import { wsPage, wsText } from "./acorn-sheet";
import { WS, acornIcon, squirrelIcon } from "./draw";
import { footer, picBox, ruleBox } from "./guess-sheet";
import { matchPair, matchTheme, type MatchPair, type MatchSheet } from "./match";
import { zyLine } from "./zhuyin";

/**
 * 連連看的 A4：題目一頁（給孩子）、答案一頁（給大人，線畫好了，附上每一組的小知識）。
 * 左邊的圖右邊有黑點，右邊的圖左邊有黑點，孩子從黑點畫到黑點（照 Tim 家大班生畫的格式）。
 * 每張圖下面寫名字、加注音：孑孓、水蠆這種孩子沒看過的，看名字也能學到。
 */

const SITE = "https://zone27.com.tw";
export const matchAnswerUrl = (id: string) => `${SITE}/worksheets/match/answer?id=${id}`;
const r2 = (n: number) => Math.round(n * 100) / 100;

/** 置中的一行注音字：zyLine 是從左邊開始畫的，先量寬度再往左移一半 */
function zyCenter(text: string, cx: number, y: number, size: number): string {
  const w = zyLine(text, 0, 0, size).width - size * 0.3;
  return zyLine(text, cx - w / 2, y, size).svg;
}

function header(tag: string, ask: string): string {
  const tagW = tag.length * 3.3 + 6;
  let g = `<rect x="14" y="10.5" width="${r2(tagW)}" height="6" rx="3" fill="${WS.azure}"/>`;
  g += wsText(14 + tagW / 2, 13.5, 3.3, tag, { fill: "#FFFFFF", weight: 700, anchor: "middle" });
  const t = zyLine("連連看", 14, 25.5, 10.5);
  g += t.svg + zyLine(ask, 14 + t.width + 3, 26.5, 6.4).svg;
  for (const [label, y] of [["名字", 20], ["日期", 29]] as const) {
    const z = zyLine(label, 143, y, 4.6);
    g += z.svg + `<line x1="${r2(143 + z.width + 1)}" y1="${y + 2.6}" x2="196" y2="${y + 2.6}" stroke="${WS.iron}" stroke-width="0.35"/>`;
  }
  g += `<line x1="14" y1="33.5" x2="196" y2="33.5" stroke="${WS.azure}" stroke-width="0.7"/>`;
  return g;
}

const dot = (x: number, y: number) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="2.3" fill="${WS.iron}"/>`;

/** 右上角的例子：小松鼠吃松果／小松鼠長大。用網站的吉祥物，不跟題目裡的任何一組重複 */
function example(theme: MatchSheet["theme"]): string {
  let g = zyLine("像這樣", 152, 41.5, 3.6).svg;
  g += squirrelIcon(150, 57, 15);
  g += dot(160, 57) + dot(176, 57) + `<line x1="160" y1="57" x2="176" y2="57" stroke="${WS.orange}" stroke-width="0.9" stroke-linecap="round"/>`;
  g += theme === "eat" ? acornIcon(186, 57, 15) : squirrelIcon(187, 56, 21);
  return g;
}

const LX = 46, LDOT = 72, RDOT = 138, RX = 164;
/** 題目頁：規則框下面到「家長看這裡」上面。答案頁沒有規則框，往上移、留位置給小知識 */
const AREA = { question: [76, 250], answer: [50, 226] } as const;
function rows(n: number, [top, bottom]: readonly [number, number]) {
  const rowH = (bottom - top) / n;
  const box = n <= 4 ? 27 : 23;
  return { rowH, box, center: (i: number) => top + rowH * i + rowH / 2 - 3.5 };
}

/** 兩欄的圖、名字、黑點；answer 為真時把線畫上 */
function board(s: MatchSheet, answer: boolean): string {
  const n = s.left.length;
  const { box, center } = rows(n, answer ? AREA.answer : AREA.question);
  const label = n <= 4 ? 5.4 : 5;
  let g = "";
  if (answer) {
    s.left.forEach((id, i) => {
      const j = s.right.indexOf(id);
      g += `<line x1="${LDOT}" y1="${r2(center(i))}" x2="${RDOT}" y2="${r2(center(j))}" stroke="${WS.emerald}" stroke-width="1.1" stroke-linecap="round"/>`;
    });
  }
  s.left.forEach((id, i) => {
    const p = matchPair(s.theme, id);
    const cy = center(i);
    g += picBox(p.left.icon, LX, cy, box) + zyCenter(p.left.name, LX, cy + box / 2 + 4.6, label) + dot(LDOT, cy);
  });
  s.right.forEach((id, i) => {
    const p = matchPair(s.theme, id);
    const cy = center(i);
    g += picBox(p.right.icon, RX, cy, box) + zyCenter(p.right.name, RX, cy + box / 2 + 4.6, label) + dot(RDOT, cy);
  });
  return g;
}

/** 家長區先講最讓人意外的（兔子不是吃紅蘿蔔、孑孓是蚊子的寶寶） */
const SURPRISE = ["rabbit", "mosquito", "koala", "anteater", "beetle", "dragonfly", "frog", "silkworm", "panda", "sunflower"];
function topFacts(s: MatchSheet, k: number): MatchPair[] {
  const ps = s.left.map((id) => matchPair(s.theme, id));
  return [...ps].sort((a, b) => (SURPRISE.indexOf(a.id) + 1 || 99) - (SURPRISE.indexOf(b.id) + 1 || 99)).slice(0, k);
}

const CREDIT = "這一款的點子，也是我家大班生出的：蝴蝶連毛毛蟲、海鷗連魚。";

function questionPage(s: MatchSheet): string {
  const T = matchTheme(s.theme);
  let g = header(`連連看・${T.name}`, T.ask) + ruleBox(T.rules, example(s.theme), 6) + board(s, false);
  const lead = s.theme === "eat" ? "這張在練：從圖認出動物，想想牠平常吃什麼。" : "這張在練：有的動物小時候跟長大差很多，先猜猜看再對答案。";
  g += footer([lead, ...topFacts(s, 2).map((p) => p.fact.replace(/我家大班生出的題目裡就有這一組。$/, "")), CREDIT], matchAnswerUrl(s.id), `${T.name}第 ${s.n} 張`);
  return wsPage(g);
}

function answerPage(s: MatchSheet): string {
  const T = matchTheme(s.theme);
  let g = `<rect x="14" y="10.5" width="22" height="6" rx="3" fill="${WS.azure}"/>` + wsText(25, 13.5, 3.3, "給大人看", { fill: "#FFFFFF", weight: 700, anchor: "middle" });
  const t = zyLine("答案", 14, 25.5, 9);
  g += t.svg + wsText(14 + t.width + 3, 26, 4, `連連看・${T.name}第 ${s.n} 張`, { fill: WS.taupe });
  g += `<line x1="14" y1="33.5" x2="196" y2="33.5" stroke="${WS.azure}" stroke-width="0.7"/>`;
  g += wsText(14, 41, 3.5, "綠色的線是答案。每一組的小知識在下面，可以邊對答案邊講給孩子聽。");
  g += board(s, true);
  const facts = s.left.map((id) => matchPair(s.theme, id));
  const h = 9 + facts.length * 5.2;
  g += `<rect x="14" y="${r2(290 - h)}" width="182" height="${r2(h)}" rx="3" fill="${WS.paper}" stroke="${WS.tan}" stroke-width="0.5"/>`;
  g += wsText(18, 290 - h + 4.8, 3.6, "小知識", { fill: WS.taupe, weight: 700 });
  facts.forEach((p, i) => {
    g += wsText(18, 290 - h + 10.4 + i * 5.2, 3.05, `${p.left.name}${T.verb}${p.right.name}：${p.fact}`);
  });
  return wsPage(g);
}

export function matchSheetPages(s: MatchSheet): { page1: string; page2: string } {
  return { page1: questionPage(s), page2: answerPage(s) };
}
