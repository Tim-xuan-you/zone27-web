/**
 * 連連看（2026-10-09）。點子也是 Tim 家的大班生出的：他畫了蝴蝶、海鷗在左邊，毛毛蟲、魚在右邊，
 * 中間塗黑的小圓點是連線的地方（學書上的格式）。
 *
 * 兩個主題，各自一頁：
 *   誰吃什麼：左邊動物、右邊食物
 *   長大變成什麼：左邊小時候、右邊長大
 *
 * 每一組答案都先查過可靠的資料才收（來源寫在每一組旁邊的註解，頁面上只寫名字、不連過去：memory zone27-no-outbound-links）。
 * 一般人以為的答案跟事實不一樣的（兔子吃紅蘿蔔、猴子吃香蕉），不收那個以為的，收對的，在家長區講清楚。
 * 同一張裡，答案不能有兩個都說得通（兩隻都吃草、兩個都是葉子），出題時擋掉。
 */

export interface MatchItem {
  icon: string;
  /** 圖下面的名字（孩子讀的，會加注音） */
  name: string;
}
export interface MatchPair {
  id: string;
  left: MatchItem;
  right: MatchItem;
  /** 給家長的一句話（學習單「家長看這裡」、答案頁、網頁都用） */
  fact: string;
  /** 同一組的不能放在同一張（例：兩個都是葉子） */
  group?: string;
  /** 比較少人知道的（孑孓、水蠆、食蟻獸），放在後面幾張 */
  hard?: boolean;
  /** 查過的資料，頁面上寫名字（不連過去） */
  source?: string;
}

export type MatchThemeId = "eat" | "grow";
export interface MatchTheme {
  id: MatchThemeId;
  /** 頁面、檔名用 */
  name: string;
  /** 學習單上的副標題（孩子讀的） */
  ask: string;
  /** 規則（孩子讀的，一句一件事） */
  rules: [string, string];
  /** 連到哪裡：答案頁用 */
  verb: string;
  pairs: MatchPair[];
}

const EAT: MatchPair[] = [
  // 臺北市立動物園：大貓熊的主食是竹類，一隻一天吃 20～30 公斤，蔬果只是配餐（園方 2025 年說明、飼育員訪談）
  { id: "panda", left: { icon: "panda", name: "貓熊" }, right: { icon: "bamboo", name: "竹子" }, fact: "貓熊幾乎只吃竹子，台北市立動物園的貓熊一天要吃二、三十公斤。", source: "臺北市立動物園" },
  // 臺北市立動物園：無尾熊吃桉樹（尤加利）葉，園區自己種桉樹林、跟農戶契作
  { id: "koala", left: { icon: "koala", name: "無尾熊" }, right: { icon: "eucalyptus", name: "尤加利葉" }, fact: "無尾熊只吃桉樹（尤加利）的葉子，台北市立動物園自己種了一片桉樹林。", group: "leaf", source: "臺北市立動物園" },
  // 兔子的主食是牧草（磨牙、腸胃需要粗纖維）；紅蘿蔔、蔬果只能少量，吃太多會拉肚子（獸醫、飼養指南、Cofacts 查核回覆）
  { id: "rabbit", left: { icon: "rabbit", name: "兔子" }, right: { icon: "grass", name: "草" }, fact: "兔子主要吃草。紅蘿蔔太甜，只能偶爾吃一點，吃太多會拉肚子。", group: "grass" },
  // 臺北市立動物園：大食蟻獸沒有牙齒，用長舌頭吃螞蟻和白蟻，一天約 3 萬隻
  { id: "anteater", left: { icon: "anteater", name: "食蟻獸" }, right: { icon: "ant", name: "螞蟻" }, fact: "食蟻獸沒有牙齒，用很長的舌頭吃螞蟻和白蟻，一天可以吃好幾萬隻。", hard: true, source: "臺北市立動物園" },
  // 蜜蜂吃花蜜和花粉，蜂蜜是工蜂把花蜜帶回巢裡釀成的（農業部、養蜂常識）
  { id: "bee", left: { icon: "bee", name: "蜜蜂" }, right: { icon: "flower", name: "花蜜" }, fact: "蜜蜂吃花蜜和花粉，蜂蜜就是牠們把花蜜帶回家做成的。" },
  // 孩子出的題：海鷗連魚。海鷗是雜食，常吃魚（鳥類圖鑑）
  { id: "gull", left: { icon: "seagull", name: "海鷗" }, right: { icon: "fish", name: "魚" }, fact: "海鷗住在海邊，會抓水面附近的魚來吃。我家大班生出的題目裡就有這一組。" },
  // 貓頭鷹多在晚上活動，常吃老鼠等小型哺乳類（鳥類圖鑑）
  { id: "owl", left: { icon: "owl", name: "貓頭鷹" }, right: { icon: "mouse", name: "老鼠" }, fact: "貓頭鷹多半晚上出來抓老鼠，在很暗的地方也看得到。" },
  // 青蛙吃昆蟲，用黏舌頭捕捉（科博館、兩棲類圖鑑）
  { id: "frog", left: { icon: "frog", name: "青蛙" }, right: { icon: "fly", name: "蒼蠅" }, fact: "青蛙用黏黏的舌頭抓蒼蠅、蚊子這些小蟲。" },
  // 毛毛蟲（蝶蛾的幼蟲）吃植物的葉子，很多種只吃特定植物
  { id: "caterpillar", left: { icon: "caterpillar", name: "毛毛蟲" }, right: { icon: "leaf", name: "葉子" }, fact: "毛毛蟲吃葉子長大，有的只吃某一種植物的葉子。", group: "leaf" },
];

const GROW: MatchPair[] = [
  // 完全變態：卵、幼蟲、蛹、成蟲（國小自然、科博館）
  { id: "butterfly", left: { icon: "caterpillar", name: "毛毛蟲" }, right: { icon: "butterfly", name: "蝴蝶" }, fact: "毛毛蟲會變成蛹，再從蛹裡出來，就是蝴蝶。我家大班生出的題目裡就有這一組。" },
  // 蝌蚪先長後腳、再長前腳，尾巴被吸收，變成青蛙（科博館）
  { id: "frog", left: { icon: "tadpole", name: "蝌蚪" }, right: { icon: "frog", name: "青蛙" }, fact: "蝌蚪先長出後腳、再長前腳，尾巴慢慢不見，就變成青蛙。" },
  { id: "chicken", left: { icon: "chick", name: "小雞" }, right: { icon: "hen", name: "雞" }, fact: "小雞從蛋裡孵出來，身上黃黃的絨毛會慢慢換成羽毛。" },
  // 向日葵種子發芽長成向日葵，幼兒園常見的種植活動（農業部、國小自然）
  { id: "sunflower", left: { icon: "seed", name: "種子" }, right: { icon: "sunflower", name: "向日葵" }, fact: "向日葵的種子種下去，大約兩、三個月就會開花，花的中間又長滿新的種子。" },
  // 雞母蟲是金龜子、獨角仙這類甲蟲的幼蟲，住在土裡吃腐植土；台灣很多孩子養過（農業部林業及自然保育署、昆蟲圖鑑）
  { id: "beetle", left: { icon: "grub", name: "雞母蟲" }, right: { icon: "beetle", name: "獨角仙" }, fact: "雞母蟲是獨角仙這類甲蟲的寶寶，住在土裡，吃腐爛的葉子和木頭長大。", hard: true },
  // 孑孓是蚊子的幼蟲，住在積水裡，經過蛹變成蚊子；清除積水是防蚊最重要的事（疾病管制署病媒蚊資料、各縣市衛生局）
  { id: "mosquito", left: { icon: "wriggler", name: "孑孓" }, right: { icon: "mosquito", name: "蚊子" }, fact: "孑孓是蚊子的寶寶，住在積水裡。把家裡的積水倒掉，蚊子就會變少。", hard: true, source: "衛生局防治病媒蚊的衛教資料" },
  // 家蠶：蠶寶寶吃桑葉，吐絲結繭化蛹，羽化成蠶蛾（科博館養蠶教學）
  { id: "silkworm", left: { icon: "silkworm", name: "蠶寶寶" }, right: { icon: "silkmoth", name: "蠶蛾" }, fact: "蠶寶寶吃桑葉長大，吐絲結繭，最後變成白色的蠶蛾。" },
  // 水蠆是蜻蜓的稚蟲，在水裡生活，爬出水面羽化（科博館、昆蟲圖鑑）
  { id: "dragonfly", left: { icon: "nymph", name: "水蠆" }, right: { icon: "dragonfly", name: "蜻蜓" }, fact: "水蠆是蜻蜓的寶寶，住在水裡，爬到水面上脫一次皮，就變成蜻蜓。", hard: true },
];

export const MATCH_THEMES: MatchTheme[] = [
  { id: "eat", name: "誰吃什麼", ask: "誰吃什麼？", rules: ["每一隻動物吃什麼？", "從黑點畫線連起來。"], verb: "吃", pairs: EAT },
  { id: "grow", name: "長大變成什麼", ask: "長大變成什麼？", rules: ["小寶寶長大會變成誰？", "從黑點畫線連起來。"], verb: "長大變成", pairs: GROW },
];
export const matchTheme = (id: string): MatchTheme => {
  const t = MATCH_THEMES.find((x) => x.id === id);
  if (!t) throw new Error(`沒有「${id}」這個連連看主題`);
  return t;
};

export interface MatchSheet {
  /** match-eat-2：誰吃什麼第 2 張。上線後編號不能改（QR code 指的就是它） */
  id: string;
  theme: MatchThemeId;
  n: number;
  /** 左邊由上到下是哪幾組 */
  left: string[];
  /** 右邊由上到下是哪幾組（打亂過，沒有一組剛好在同一列） */
  right: string[];
  tested?: string;
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
const shuffle = <T,>(arr: T[], rng: () => number): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/**
 * 出一個主題的 count 張。前 3 張每張 4 組（大班），後面每張 5 組（大班、小一），比較少人知道的（hard）只放後面。
 * 每一組輪流出；同一張不能有同 group 的兩組；右邊打亂到沒有一組跟左邊同一列，線一定會交叉。
 */
export function makeMatchTheme(themeId: MatchThemeId, count: number, seed: number): MatchSheet[] {
  const theme = matchTheme(themeId);
  const rng = rngOf(seed * 7919 + (themeId === "eat" ? 1 : 2) * 104729);
  const used = new Map<string, number>();
  const sheets: MatchSheet[] = [];
  for (let n = 1; n <= count; n++) {
    const k = n <= 3 ? 4 : 5;
    const pool = theme.pairs.filter((p) => n > 3 || !p.hard);
    const picked: MatchPair[] = [];
    for (const p of shuffle(pool, rng).sort((a, b) => (used.get(a.id) ?? 0) - (used.get(b.id) ?? 0))) {
      if (picked.length >= k) break;
      if (p.group && picked.some((q) => q.group === p.group)) continue;
      picked.push(p);
    }
    if (picked.length < k) throw new Error(`${theme.name}第 ${n} 張湊不到 ${k} 組`);
    picked.forEach((p) => used.set(p.id, (used.get(p.id) ?? 0) + 1));
    const left = shuffle(picked.map((p) => p.id), rng);
    let right = shuffle(left, rng);
    for (let t = 0; t < 200 && right.some((id, i) => left[i] === id); t++) right = shuffle(left, rng);
    if (right.some((id, i) => left[i] === id)) throw new Error("右邊打不亂");
    sheets.push({ id: `match-${themeId}-${n}`, theme: themeId, n, left, right });
  }
  return sheets;
}

export const matchPair = (theme: MatchThemeId, id: string): MatchPair => {
  const p = matchTheme(theme).pairs.find((x) => x.id === id);
  if (!p) throw new Error(`連連看「${theme}」沒有「${id}」`);
  return p;
};
