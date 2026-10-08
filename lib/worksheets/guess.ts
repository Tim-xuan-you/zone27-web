import { WORDS, wordByZh, type Word } from "./words";

/**
 * 注音猜猜看（2026-10-09）。點子是 Tim 家的大班生出的：他畫了一張題目考爸爸，
 * 上面寫 ㄍㄨˇ、ㄇㄠ、ㄔㄜ，下面要寫出是什麼東西（骨頭、貓咪、車子）。
 *
 * 一張 6 題，同一組題目有兩種寫法，家長自己選：
 *   圈圈看：左邊是注音，右邊三張圖，圈出對的（還不太會寫注音的先玩這個）
 *   寫寫看：左邊是圖，右邊的格子寫出注音（照孩子出的題）
 *
 * 關卡照「容易看錯的地方」分，不照年齡：
 *   1 一個字、2 兩個字：三張圖的注音差很多，先熟悉玩法
 *   3 差一點點：只差一個符號、聲調一樣（星／心、書／豬、火／鎖），要一個一個符號看清楚
 *   4 只差聲調：魚／雨、書／樹、椰子／葉子。孩子在學校最常錯的是二聲、三聲
 * 2026-10-09 原本第 3 關有山／傘、牛／鳥、鞋／蝦，其實差了兩個地方（符號和聲調都不一樣），不算「只差一個」，換掉了。
 */

export interface GuessLevel {
  n: number;
  name: string;
  /** 一句話說這一關在練什麼（頁面、學習單都用） */
  what: string;
  age: string;
  grade: string;
  stars: 1 | 2 | 3;
}

export const GUESS_LEVELS: GuessLevel[] = [
  { n: 1, name: "一個字", what: "一個字的東西，三張圖的注音差很多", age: "5 歲", grade: "大班", stars: 1 },
  { n: 2, name: "兩個字", what: "兩個字的東西，輕聲的點也要看到", age: "5～6 歲", grade: "大班", stars: 1 },
  { n: 3, name: "差一點點", what: "只差一個符號：星和心、書和豬、火和鎖", age: "6 歲", grade: "大班、小一", stars: 2 },
  { n: 4, name: "只差聲調", what: "注音一樣、聲調不一樣：魚和雨、書和樹、椰子和葉子", age: "6～7 歲", grade: "小一", stars: 3 },
];
/** 同一張題目兩種玩法 */
export const GUESS_MODES = { circle: "圈圈看", write: "寫寫看" } as const;
export type GuessMode = keyof typeof GUESS_MODES;

export const guessLevel = (n: number): GuessLevel => GUESS_LEVELS[Math.min(Math.max(Math.round(n) || 1, 1), GUESS_LEVELS.length) - 1];

/** 一題：答案、三個選項（圖），答案在第幾個 */
export interface GuessQuestion {
  zh: string;
  options: string[];
  answer: number;
}
export interface GuessSheet {
  /** zhuyin-3-2：第 3 關第 2 張。上線後編號不能改（QR code 指的就是它） */
  id: string;
  level: number;
  n: number;
  questions: GuessQuestion[];
  tested?: string;
}

const ONE = ["貓", "魚", "書", "樹", "花", "星", "山", "牛", "鳥", "狗", "船", "球", "火", "門", "蛋", "豬", "鴨", "心", "床", "糖", "羊", "鎖"];
const TWO = ["車子", "杯子", "蘋果", "香蕉", "西瓜", "太陽", "月亮", "蝴蝶", "椅子", "氣球", "時鐘", "眼鏡", "牙刷", "雨傘", "鞋子", "貓咪", "兔子", "叉子", "椰子", "葉子"];
/** 第 3 關：只差一個符號（換一個、或多一個），聲調一樣 */
export const NEAR_PAIRS: [string, string][] = [["星", "心"], ["船", "床"], ["狗", "鼓"], ["牛", "球"], ["書", "豬"], ["鴨", "蝦"], ["羊", "糖"], ["火", "鎖"], ["車子", "叉子"]];
/** 第 4 關：符號一樣，只差聲調 */
export const TONE_PAIRS: [string, string][] = [["魚", "雨"], ["書", "樹"], ["湯", "糖"], ["鴨", "牙"], ["豬", "竹"], ["花", "畫"], ["椰子", "葉子"]];

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
const shuffle = <T,>(arr: T[], rng: () => number): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/** 第一個注音符號（拿掉輕聲的點） */
const head = (w: Word) => w.zy[0].replace("˙", "")[0];
/** 兩個詞的圖會不會一樣（貓／貓咪、傘／雨傘、鞋／鞋子） */
const sameIcon = (a: string, b: string) => wordByZh(a).icon === wordByZh(b).icon;

/** 洗牌之後照用過的次數排（sort 是穩定的），用得少的先挑：同一關幾張不要一直出同樣的題，同一張的干擾圖也不要一直是同一個 */
const leastUsed = <T,>(arr: T[], used: Map<string, number>, key: (t: T) => string, rng: () => number): T[] =>
  shuffle(arr, rng).sort((x, y) => (used.get(key(x)) ?? 0) - (used.get(key(y)) ?? 0));
const bump = (used: Map<string, number>, k: string) => used.set(k, (used.get(k) ?? 0) + 1);

/** 從 pool 挑 k 個干擾的：跟答案、彼此的圖都不一樣，第一個注音符號也跟答案不一樣（一眼看得出不是） */
function distractors(target: string, pool: string[], k: number, rng: () => number, used: Map<string, number>): string[] {
  const t = wordByZh(target);
  const out: string[] = [];
  for (const c of leastUsed(pool, used, (z) => z, rng)) {
    if (out.length >= k) break;
    if (c === target || sameIcon(c, target) || out.some((o) => sameIcon(o, c))) continue;
    if (head(wordByZh(c)) === head(t)) continue;
    out.push(c);
    bump(used, c);
  }
  if (out.length < k) throw new Error(`「${target}」挑不到 ${k} 個干擾的圖`);
  return out;
}

/** 出一關的 count 張：每張 6 題，答案不重複；同一關裡每個詞（第 3、4 關是每一對）輪流出，不會有的一直出、有的沒出到 */
export function makeGuessLevel(level: number, count: number, seed: number): GuessSheet[] {
  const rng = rngOf(seed * 7919 + level * 104729);
  const targetUse = new Map<string, number>();
  const sheets: GuessSheet[] = [];
  for (let n = 1; n <= count; n++) {
    let targets: { zh: string; partner?: string }[];
    if (level <= 2) {
      targets = leastUsed(level === 1 ? ONE : TWO, targetUse, (z) => z, rng).slice(0, 6).map((zh) => ({ zh }));
    } else {
      const pairs = level === 3 ? NEAR_PAIRS : TONE_PAIRS;
      targets = leastUsed(pairs, targetUse, ([a, b]) => a + "+" + b, rng).slice(0, 6).map(([a, b]) => {
        bump(targetUse, a + "+" + b);
        // 一對裡面，之前比較少當答案的那個當答案
        const ua = targetUse.get(a) ?? 0, ub = targetUse.get(b) ?? 0;
        return (ua === ub ? rng() < 0.5 : ua < ub) ? { zh: a, partner: b } : { zh: b, partner: a };
      });
    }
    targets.forEach((t) => bump(targetUse, t.zh));
    targets = shuffle(targets, rng);
    // 答案在第 1、2、3 個各兩題，孩子猜不到規律
    const slots = shuffle([0, 0, 1, 1, 2, 2], rng);
    // 這一張其他題的答案，少拿來當干擾的圖：同樣的圖在一張裡一直出現，孩子會亂掉
    const dUse = new Map<string, number>(targets.map((t) => [t.zh, 1]));
    const questions = targets.map(({ zh, partner }, i) => {
      const pool = wordByZh(zh).zy.length === 1 ? ONE : TWO;
      // 第 3、4 關：一個是很像的那一個，一個是一看就不一樣的
      const others = partner
        ? [partner, ...distractors(zh, pool.filter((p) => p !== partner && !sameIcon(p, partner)), 1, rng, dUse)]
        : distractors(zh, pool, 2, rng, dUse);
      const options = shuffle(others, rng);
      options.splice(slots[i], 0, zh);
      return { zh, options, answer: slots[i] };
    });
    sheets.push({ id: `zhuyin-${level}-${n}`, level, n, questions });
  }
  return sheets;
}

export { WORDS };
