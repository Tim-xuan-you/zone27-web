/**
 * 撿松果回家（學習單第一款，2026-10-01）
 *
 * 規則：從起點走到房子，每一顆松果都要撿到，每一格只能走一次。
 *
 * 題目用程式出，三件事一定要成立：
 *   1. 同一個關卡、同一個號碼，永遠出同一題。印出來的 QR code 帶著這個號碼，掃了才找得回同一張的提示
 *   2. 答案只有一條。每一題出完都用程式把所有走法數一遍，多一條就加松果或加牆，直到剩一條
 *   3. 直接走最近的路會漏掉松果。不然孩子不用想，看到房子就衝過去了
 *
 * 為什麼自己出題：照著書改是改作，侵權（2026-10-01 跟 Tim 講過）。玩法本身是規則，誰都可以用。
 */

export interface AcornLevel {
  /** 第幾關 */
  n: number;
  W: number;
  H: number;
  acMin: number;
  acMax: number;
  /** 拆掉幾面牆，讓路有分岔、繞得回來 */
  braid: number;
  /** 答案至少要走幾格 */
  minLen: number;
  /** 直接走最近的路，至少會漏掉幾顆 */
  missMin: number;
  /** 難度星星（1～3） */
  stars: 1 | 2 | 3;
  /** 印在 A4 上，一格幾公釐（兩題要擠得進一頁） */
  cell: number;
  /** 給家長看的：大概幾歲開始 */
  age: string;
  /** 適合的年級。家長搜尋的時候打的是「大班學習單」「中班迷宮」，不是幾歲（2026-10-09 查 Google 建議字） */
  grade: string;
}

/*
 * 關卡。2026-10-01 本機每關各出 150 題：全部出得來、全部只有一個答案，
 * 最慢的第 6 關一題 26 毫秒，家長手機上按一下就出來。
 */
export const ACORN_LEVELS: AcornLevel[] = [
  { n: 1, W: 4, H: 4, acMin: 3, acMax: 4, braid: 2, minLen: 9, missMin: 1, stars: 1, cell: 17, age: "5 歲", grade: "中班、大班" },
  { n: 2, W: 5, H: 5, acMin: 4, acMax: 5, braid: 4, minLen: 13, missMin: 1, stars: 1, cell: 14.5, age: "5 歲", grade: "大班" },
  { n: 3, W: 5, H: 5, acMin: 5, acMax: 7, braid: 5, minLen: 17, missMin: 2, stars: 2, cell: 14.5, age: "5～6 歲", grade: "大班" },
  { n: 4, W: 6, H: 6, acMin: 6, acMax: 8, braid: 7, minLen: 22, missMin: 2, stars: 2, cell: 12.3, age: "6 歲", grade: "大班、小一" },
  { n: 5, W: 6, H: 6, acMin: 8, acMax: 9, braid: 8, minLen: 26, missMin: 2, stars: 3, cell: 12.3, age: "6～7 歲", grade: "小一" },
  { n: 6, W: 7, H: 7, acMin: 9, acMax: 11, braid: 11, minLen: 33, missMin: 3, stars: 3, cell: 10.6, age: "7 歲以上", grade: "小一、小二" },
];
export const acornLevel = (n: number): AcornLevel => ACORN_LEVELS[Math.min(Math.max(Math.round(n) || 1, 1), ACORN_LEVELS.length) - 1];

export interface AcornPuzzle {
  W: number;
  H: number;
  /** 起點、終點的格子編號（左上、右下） */
  S: number;
  E: number;
  /** 打通的格子之間：「小-大」 */
  open: string[];
  acorns: number[];
  /** 唯一的答案，從起點到終點一格一格 */
  answer: number[];
  shortestLen: number;
}

/* ---------------- 亂數：同一個號碼永遠出一樣的數字 ---------------- */
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

interface Grid { W: number; H: number; N: number; nb: number[][] }
function makeGrid(W: number, H: number): Grid {
  const N = W * H;
  const nb = Array.from({ length: N }, (_, i) => {
    const x = i % W, y = Math.floor(i / W), r: number[] = [];
    if (x > 0) r.push(i - 1);
    if (x < W - 1) r.push(i + 1);
    if (y > 0) r.push(i - W);
    if (y < H - 1) r.push(i + W);
    return r;
  });
  return { W, H, N, nb };
}
export const edgeKey = (a: number, b: number): string => (a < b ? `${a}-${b}` : `${b}-${a}`);

/** 數解，最多數到 cap 條，回傳找到的走法 */
export function solveAcorn(W: number, H: number, open: Set<string>, S: number, E: number, acorns: number[], cap = 2): number[][] {
  const g = makeGrid(W, H);
  const ac = new Set(acorns);
  const sols: number[][] = [];
  const visited = new Uint8Array(g.N);
  const path = [S];
  visited[S] = 1;
  let got = ac.has(S) ? 1 : 0;
  const nbs = (i: number) => g.nb[i].filter((j) => open.has(edgeKey(i, j)));
  // 剪枝：從現在的位置，經過沒走過的格子，還到得了每一顆沒撿的松果跟終點嗎
  const reachable = (cur: number) => {
    const seen = new Uint8Array(g.N);
    const q = [cur];
    seen[cur] = 1;
    while (q.length) {
      const i = q.pop()!;
      if (i === E && i !== cur) continue; // 終點只能是最後一格
      for (const j of nbs(i)) if (!seen[j] && !visited[j]) { seen[j] = 1; q.push(j); }
    }
    if (!seen[E]) return false;
    for (const a of ac) if (!visited[a] && !seen[a]) return false;
    return true;
  };
  const dfs = (cur: number) => {
    if (sols.length >= cap) return;
    if (cur === E) {
      if (got === ac.size) sols.push([...path]);
      return;
    }
    if (!reachable(cur)) return;
    for (const j of nbs(cur)) {
      if (visited[j]) continue;
      visited[j] = 1; path.push(j);
      const hit = ac.has(j);
      if (hit) got++;
      dfs(j);
      if (hit) got--;
      path.pop(); visited[j] = 0;
      if (sols.length >= cap) return;
    }
  };
  dfs(S);
  return sols;
}

function shortest(g: Grid, open: Set<string>, S: number, E: number): number[] {
  const prev = new Int32Array(g.N).fill(-1);
  const seen = new Uint8Array(g.N);
  const q = [S];
  seen[S] = 1;
  while (q.length) {
    const i = q.shift()!;
    if (i === E) break;
    for (const j of g.nb[i]) if (open.has(edgeKey(i, j)) && !seen[j]) { seen[j] = 1; prev[j] = i; q.push(j); }
  }
  const p: number[] = [];
  for (let i = E; i !== -1; i = prev[i]) p.unshift(i);
  return p;
}

/** 出一題。同一個 level、seed 永遠出同一題 */
export function makeAcorn(levelN: number, seed: number): AcornPuzzle {
  const L = acornLevel(levelN);
  const { W, H } = L;
  for (let tries = 0; tries < 4000; tries++) {
    const rng = rngOf(seed * 7919 + tries + L.n * 104729);
    const g = makeGrid(W, H);
    const S = 0, E = g.N - 1;
    // 1. 先做一個完整的迷宮（任兩格之間只有一條路）
    const open = new Set<string>();
    const seen = new Uint8Array(g.N);
    const stack = [S];
    seen[S] = 1;
    while (stack.length) {
      const i = stack[stack.length - 1];
      const nx = shuffle(g.nb[i].filter((j) => !seen[j]), rng);
      if (!nx.length) { stack.pop(); continue; }
      const j = nx[0];
      open.add(edgeKey(i, j)); seen[j] = 1; stack.push(j);
    }
    // 2. 拆掉幾面牆，讓路有分岔、繞得回來（這樣「每一顆都要撿到」才有意義）
    const closed: string[] = [];
    for (let i = 0; i < g.N; i++) for (const j of g.nb[i]) if (i < j && !open.has(edgeKey(i, j))) closed.push(edgeKey(i, j));
    shuffle(closed, rng).slice(0, L.braid).forEach((e) => open.add(e));
    // 3. 找一條夠長的路當答案
    // 放在物件裡：閉包裡改的值，TypeScript 才不會以為它一直是 null
    const found: { p: number[] | null } = { p: null };
    let budget = 60000;
    const vis = new Uint8Array(g.N);
    const path = [S];
    vis[S] = 1;
    const walk = (cur: number) => {
      if (found.p || budget-- <= 0) return;
      if (cur === E) { if (path.length >= L.minLen) found.p = [...path]; return; }
      for (const j of shuffle(g.nb[cur].filter((k) => open.has(edgeKey(cur, k)) && !vis[k]), rng)) {
        vis[j] = 1; path.push(j);
        walk(j);
        path.pop(); vis[j] = 0;
        if (found.p) return;
      }
    };
    walk(S);
    if (!found.p) continue;
    const answer = found.p;
    const answerEdges = new Set(answer.slice(1).map((c, k) => edgeKey(answer[k], c)));
    // 4. 放松果，直到答案只剩這一條
    const inner = answer.slice(2, -1); // 起點旁邊那格不放，太簡單
    const acorns = shuffle([...inner], rng).slice(0, L.acMin - 1);
    let ok = false;
    for (let step = 0; step < 40; step++) {
      const sols = solveAcorn(W, H, open, S, E, acorns, 2);
      const other = sols.find((s) => s.join() !== answer.join());
      if (!other) { ok = sols.length === 1; break; }
      const otherSet = new Set(other);
      const miss = inner.filter((c) => !otherSet.has(c) && !acorns.includes(c));
      if (miss.length && acorns.length < L.acMax) {
        acorns.push(miss[Math.floor(rng() * miss.length)]);
      } else {
        // 松果放滿了，就在另一條路上加一面牆（不碰答案那條）
        const cand = other.slice(1).map((c, k) => edgeKey(other[k], c)).filter((e) => !answerEdges.has(e));
        if (!cand.length) break;
        open.delete(cand[Math.floor(rng() * cand.length)]);
      }
    }
    if (!ok || acorns.length < L.acMin || acorns.length > L.acMax) continue;
    // 5. 直接走最近的路要會漏掉松果，才需要動腦
    const sp = shortest(g, open, S, E);
    if (sp.length >= answer.length || acorns.filter((a) => !sp.includes(a)).length < L.missMin) continue;
    // 6. 不能有被牆整個圍起來、走不進去的格子
    const reach = new Uint8Array(g.N);
    const q = [S];
    reach[S] = 1;
    while (q.length) { const i = q.pop()!; for (const j of g.nb[i]) if (open.has(edgeKey(i, j)) && !reach[j]) { reach[j] = 1; q.push(j); } }
    if (reach.some((r) => !r)) continue;
    return { W, H, S, E, open: [...open], acorns: [...acorns].sort((a, b) => a - b), answer, shortestLen: sp.length };
  }
  throw new Error(`撿松果回家第 ${levelN} 關，號碼 ${seed} 出不了題`);
}

/** 三段提示：前三步、走到一半、只剩最後三步 */
export function acornHints(p: AcornPuzzle): number[][] {
  const L = p.answer.length;
  return [p.answer.slice(0, 3), p.answer.slice(0, Math.round(L * 0.5)), p.answer.slice(0, L - 3)];
}

/** 一張學習單兩題，號碼從這張的號碼推出來 */
export const sheetPuzzles = (level: number, seed: number): [AcornPuzzle, AcornPuzzle] => [
  makeAcorn(level, seed * 2 + 1),
  makeAcorn(level, seed * 2 + 2),
];

/** 新的一張：六位數，網址上好看、也好唸 */
export const newSeed = (): number => 100000 + Math.floor(Math.random() * 900000);

/** 右上角「小松鼠這樣走」的例子：3×3，兩顆松果 */
export const ACORN_EXAMPLE: AcornPuzzle = {
  W: 3, H: 3, S: 0, E: 8,
  open: ["0-1", "1-2", "2-5", "4-5", "3-4", "3-6", "6-7", "7-8", "1-4"],
  acorns: [2, 6],
  answer: [0, 1, 2, 5, 4, 3, 6, 7, 8],
  shortestLen: 5,
};

/* ------------------------------------------------------------------ */
/* 挑題：程式出很多題，只留好的（2026-10-01）                           */
/*                                                                    */
/* Tim 的決定：家長看到的是固定編號的那幾張，不是隨機。程式退到後台出候選， */
/* 這裡幫每一題打分數、把「太平」的濾掉，scripts/worksheets-acorn.ts      */
/* 照分數挑，Tim 看過總覽、孩子試寫過才上線。                            */
/* ------------------------------------------------------------------ */

export interface AcornStats {
  len: number;
  acorns: number;
  /** 答案轉了幾個彎 */
  turns: number;
  /** 答案經過幾個岔路口（要做決定的地方） */
  branches: number;
  /** 直接走最近的路會漏掉幾顆 */
  missed: number;
  /** 答案裡同一段直線上最多連著幾顆松果 */
  straightRun: number;
  /** 松果有幾顆貼著外牆 */
  onEdge: number;
  /** 難度分數：越高越要動腦 */
  score: number;
  /** 太平了，不要用 */
  dull: boolean;
}

export function acornStats(p: AcornPuzzle): AcornStats {
  const { W, H } = p;
  const open = new Set(p.open);
  const deg = (i: number) => {
    const x = i % W, y = Math.floor(i / W);
    let d = 0;
    if (x > 0 && open.has(edgeKey(i, i - 1))) d++;
    if (x < W - 1 && open.has(edgeKey(i, i + 1))) d++;
    if (y > 0 && open.has(edgeKey(i, i - W))) d++;
    if (y < H - 1 && open.has(edgeKey(i, i + W))) d++;
    return d;
  };
  const a = p.answer;
  const dir = (k: number) => a[k + 1] - a[k];
  let turns = 0;
  for (let k = 1; k < a.length - 1; k++) if (dir(k) !== dir(k - 1)) turns++;
  const branches = a.slice(0, -1).filter((c) => deg(c) >= 3).length;
  const g = makeGrid(W, H);
  const sp = shortest(g, open, p.S, p.E);
  const missed = p.acorns.filter((x) => !sp.includes(x)).length;
  // 同一段直線（方向不變）上連著幾顆松果
  const ac = new Set(p.acorns);
  let straightRun = 0;
  let k = 0;
  while (k < a.length) {
    let j = k;
    while (j + 1 < a.length && (j === k || dir(j) === dir(j - 1))) j++;
    straightRun = Math.max(straightRun, a.slice(k, j + 1).filter((c) => ac.has(c)).length);
    k = j === k ? k + 1 : j;
  }
  const onEdge = p.acorns.filter((c) => { const x = c % W, y = Math.floor(c / W); return x === 0 || y === 0 || x === W - 1 || y === H - 1; }).length;
  const score = turns + 2 * branches + 2 * missed;
  // 一直線上連著三顆，或松果幾乎都貼著牆：順著邊走就撿完了（Tim 家孩子幾秒就解完的那一題）
  const dull = straightRun >= 3 || onEdge / p.acorns.length > 0.6;
  return { len: a.length, acorns: p.acorns.length, turns, branches, missed, straightRun, onEdge, score, dull };
}

/** 上線的一張：固定編號、固定題目 */
export interface AcornSheet {
  /** acorn-3-2：第 3 關第 2 張。編號一旦上線就不能改，印出去的 QR code 指的就是它 */
  id: string;
  level: number;
  n: number;
  puzzles: [AcornPuzzle, AcornPuzzle];
  /** 哪一天給孩子試寫過（沒寫過就是空的，頁面不會說寫過） */
  tested?: string;
}
