import { edgeKey, type AcornPuzzle } from "./acorn";

/**
 * 數字松果（2026-10-09）：撿松果回家的迷宮，松果上多了數字，房子上也有一個數字。
 * 規則：撿到的松果，數字加起來要剛好等於房子上的數字；每個格子只能走一次。走過松果的格子就算撿到。
 *
 * 跟撿松果回家不一樣的地方：不用每一顆都撿，要自己挑。題目一樣用程式出、一樣只有一個答案：
 * 把起點到房子的每一條路都走一遍、算一次總和，剛好等於房子數字的只能有一條。
 *
 * 關卡照孩子學加法的順序（大班 10 以內，小一下學期 20 以內進位），不照年齡硬分：
 *   1 撿兩顆，6 以內   2 10 以內   3 連加三個數，10 以內   4 20 以內，要進位
 */

export interface NumberLevel {
  n: number;
  W: number;
  H: number;
  /** 迷宮裡放幾顆松果 */
  acorns: number;
  /** 松果上的數字範圍 */
  vMin: number;
  vMax: number;
  /** 答案要撿幾顆 */
  pickMin: number;
  pickMax: number;
  /** 房子上的數字範圍 */
  tMin: number;
  tMax: number;
  braid: number;
  /** 起點到房子至少有幾條路（太少就沒得選） */
  minRoutes: number;
  stars: 1 | 2 | 3;
  cell: number;
  name: string;
  /** 一句話說這一關在練什麼 */
  what: string;
  age: string;
  grade: string;
}

export const NUMBER_LEVELS: NumberLevel[] = [
  { n: 1, W: 4, H: 4, acorns: 4, vMin: 1, vMax: 3, pickMin: 2, pickMax: 2, tMin: 3, tMax: 6, braid: 3, minRoutes: 4, stars: 1, cell: 17, name: "6 以內", what: "撿兩顆松果，加起來 6 以內", age: "5 歲", grade: "大班" },
  { n: 2, W: 5, H: 5, acorns: 5, vMin: 1, vMax: 6, pickMin: 2, pickMax: 3, tMin: 5, tMax: 10, braid: 5, minRoutes: 8, stars: 1, cell: 14.5, name: "10 以內", what: "加起來 10 以內，要先想好撿哪幾顆", age: "5～6 歲", grade: "大班" },
  { n: 3, W: 5, H: 5, acorns: 6, vMin: 1, vMax: 5, pickMin: 3, pickMax: 3, tMin: 6, tMax: 10, braid: 6, minRoutes: 10, stars: 2, cell: 14.5, name: "連加三個數", what: "撿三顆松果，三個數連加，10 以內", age: "6 歲", grade: "大班、小一" },
  { n: 4, W: 6, H: 6, acorns: 7, vMin: 2, vMax: 9, pickMin: 3, pickMax: 4, tMin: 11, tMax: 20, braid: 8, minRoutes: 12, stars: 3, cell: 12.3, name: "20 以內進位", what: "加起來超過 10，要進位，20 以內", age: "6～7 歲", grade: "小一" },
];
export const numberLevel = (n: number): NumberLevel => NUMBER_LEVELS[Math.min(Math.max(Math.round(n) || 1, 1), NUMBER_LEVELS.length) - 1];

export interface NumberPuzzle extends AcornPuzzle {
  /** 每一顆松果上的數字：values[k] 是 acorns[k] 的數字 */
  values: number[];
  target: number;
  /** 答案撿到的松果（照走的順序） */
  picked: number[];
  /** 起點到房子一共有幾條路 */
  routes: number;
}

function rngOf(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
const neighbors = (W: number, H: number, i: number): number[] => {
  const x = i % W, y = Math.floor(i / W), r: number[] = [];
  if (x > 0) r.push(i - 1);
  if (x < W - 1) r.push(i + 1);
  if (y > 0) r.push(i - W);
  if (y < H - 1) r.push(i + W);
  return r;
};

/**
 * 起點到房子的每一條路（每格只走一次），回傳每一條的路線和總和。超過 cap 條就放棄（太開放的迷宮孩子也算不完）。
 */
export function allRoutes(W: number, H: number, open: Set<string>, S: number, E: number, value: Map<number, number>, cap = 200000): { path: number[]; sum: number }[] | null {
  const out: { path: number[]; sum: number }[] = [];
  const vis = new Uint8Array(W * H);
  const path = [S];
  vis[S] = 1;
  let sum = value.get(S) ?? 0;
  let over = false;
  const walk = (cur: number) => {
    if (over) return;
    if (cur === E) {
      out.push({ path: [...path], sum });
      if (out.length > cap) over = true;
      return;
    }
    for (const j of neighbors(W, H, cur)) {
      if (vis[j] || !open.has(edgeKey(cur, j))) continue;
      vis[j] = 1; path.push(j); sum += value.get(j) ?? 0;
      walk(j);
      sum -= value.get(j) ?? 0; path.pop(); vis[j] = 0;
      if (over) return;
    }
  };
  walk(S);
  return over ? null : out;
}

/** 出一題。同一個 level、seed 永遠出同一題 */
export function makeNumber(levelN: number, seed: number): NumberPuzzle {
  const L = numberLevel(levelN);
  const { W, H } = L;
  const N = W * H, S = 0, E = N - 1;
  for (let tries = 0; tries < 3000; tries++) {
    const rng = rngOf(seed * 7919 + tries + L.n * 104729 + 31337);
    // 1. 完整的迷宮，再拆幾面牆，讓路有很多條可以選
    const open = new Set<string>();
    const seen = new Uint8Array(N);
    const stack = [S];
    seen[S] = 1;
    while (stack.length) {
      const i = stack[stack.length - 1];
      const nx = shuffle(neighbors(W, H, i).filter((j) => !seen[j]), rng);
      if (!nx.length) { stack.pop(); continue; }
      open.add(edgeKey(i, nx[0])); seen[nx[0]] = 1; stack.push(nx[0]);
    }
    const closed: string[] = [];
    for (let i = 0; i < N; i++) for (const j of neighbors(W, H, i)) if (i < j && !open.has(edgeKey(i, j))) closed.push(edgeKey(i, j));
    shuffle(closed, rng).slice(0, L.braid).forEach((e) => open.add(e));
    // 2. 放松果（起點、終點和起點旁邊不放），寫上數字
    const cells = shuffle(Array.from({ length: N }, (_, i) => i).filter((i) => i !== S && i !== E && !neighbors(W, H, S).includes(i)), rng);
    const acorns = cells.slice(0, L.acorns);
    const values = acorns.map(() => L.vMin + Math.floor(rng() * (L.vMax - L.vMin + 1)));
    const value = new Map(acorns.map((a, k) => [a, values[k]]));
    // 3. 每一條路都走一遍
    const routes = allRoutes(W, H, open, S, E, value);
    if (!routes || routes.length < L.minRoutes) continue;
    // 4. 找「只有一條路剛好湊得到」的數字當房子上的數字
    const bySum = new Map<number, { path: number[]; sum: number }[]>();
    for (const r of routes) bySum.set(r.sum, [...(bySum.get(r.sum) ?? []), r]);
    const shortest = routes.reduce((a, b) => (b.path.length < a.path.length ? b : a));
    const cand = [...bySum.entries()].filter(([t, rs]) => {
      if (rs.length !== 1 || t < L.tMin || t > L.tMax) return false;
      const k = rs[0].path.filter((c) => value.has(c)).length;
      // 要撿的顆數在範圍內；最近的那條路湊不到（不然不用想）
      return k >= L.pickMin && k <= L.pickMax && shortest.sum !== t;
    });
    if (!cand.length) continue;
    // 差一點就湊到的路越多，越要動腦：挑「總和差 1、2 的路最多」的那個數字
    const near = (t: number) => routes.filter((r) => Math.abs(r.sum - t) <= 2 && r.sum !== t).length;
    cand.sort((a, b) => near(b[0]) - near(a[0]));
    const [target, [ans]] = cand[0];
    // 5. 不能有被牆整個圍起來、走不進去的格子
    const reach = new Uint8Array(N);
    const q = [S];
    reach[S] = 1;
    while (q.length) { const i = q.pop()!; for (const j of neighbors(W, H, i)) if (open.has(edgeKey(i, j)) && !reach[j]) { reach[j] = 1; q.push(j); } }
    if (reach.some((r) => !r)) continue;
    const order = acorns.map((a, k) => [a, values[k]] as const).sort((x, y) => x[0] - y[0]);
    return {
      W, H, S, E,
      open: [...open],
      acorns: order.map((o) => o[0]),
      values: order.map((o) => o[1]),
      target,
      answer: ans.path,
      picked: ans.path.filter((c) => value.has(c)),
      shortestLen: shortest.path.length,
      routes: routes.length,
    };
  }
  throw new Error(`數字松果第 ${levelN} 關，號碼 ${seed} 出不了題`);
}

/** 檢查一題：路數、只有一條剛好湊到（上線前、build 後都可以再驗一次） */
export function checkNumber(p: NumberPuzzle): string | null {
  const value = new Map(p.acorns.map((a, k) => [a, p.values[k]]));
  const routes = allRoutes(p.W, p.H, new Set(p.open), p.S, p.E, value);
  if (!routes) return "路太多，算不完";
  const hit = routes.filter((r) => r.sum === p.target);
  if (hit.length !== 1) return `剛好湊到 ${p.target} 的路有 ${hit.length} 條`;
  if (hit[0].path.join() !== p.answer.join()) return "答案跟算出來的不一樣";
  return null;
}

/** 答案的算式：3 + 4 = 7 */
export const numberEquation = (p: NumberPuzzle): string =>
  `${p.picked.map((c) => p.values[p.acorns.indexOf(c)]).join(" + ")} = ${p.target}`;

/** 上線的一張：固定編號，一張兩題 */
export interface NumberSheet {
  /** number-2-3：第 2 關第 3 張。上線後編號不能改（QR code 指的就是它） */
  id: string;
  level: number;
  n: number;
  puzzles: [NumberPuzzle, NumberPuzzle];
  tested?: string;
}

/** 右上角的例子：3×3，松果 2 和 3，房子 5（跟撿松果回家的例子同一個迷宮） */
export const NUMBER_EXAMPLE: NumberPuzzle = {
  W: 3, H: 3, S: 0, E: 8,
  open: ["0-1", "1-2", "2-5", "4-5", "3-4", "3-6", "6-7", "7-8", "1-4"],
  acorns: [2, 6],
  values: [2, 3],
  target: 5,
  answer: [0, 1, 2, 5, 4, 3, 6, 7, 8],
  picked: [2, 6],
  shortestLen: 5,
  routes: 0,
};
