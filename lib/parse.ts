import type { ProteinSource, Situation } from "./types";

/**
 * 人話 → 結構化條件。純規則，不呼叫任何 API。
 *
 * 為什麼不用 LLM：
 *   1. 輸入範圍其實很窄 —— 品種／年齡／症狀／蛋白源／預算，詞彙表有限
 *   2. 零成本、零延遲、離線可跑、不會因為別人的服務掛掉而掛掉
 *   3. 解析結果會以可編輯的 chip 顯示給使用者確認，所以不需要百分之百準
 *   4. 最重要的：這張詞彙表本身就是護城河。
 *      「舔腳」「淚痕」「翻肚」這些台灣飼主的真實講法，
 *      用 LLM 就跳過了累積它的機會。
 *
 * 準確度不足時的升級路徑：解析不出東西才呼叫 LLM 當後援，
 * 成本會降到原本的一成以下。但先把規則做好。
 */

/* ------------------------------------------------------------------ */
/* 詞彙表 —— 這是資產，要持續長大                                       */
/* ------------------------------------------------------------------ */

/** 品種 → 體型。飼主幾乎都會講品種，很少講體重。 */
const BREEDS: Record<string, "small" | "medium" | "large"> = {
  吉娃娃: "small", 博美: "small", 馬爾濟斯: "small", 瑪爾濟斯: "small",
  約克夏: "small", 貴賓: "small", 紅貴賓: "small", 玩具貴賓: "small",
  臘腸: "small", 西施: "small", 比熊: "small", 巴哥: "small",
  雪納瑞: "small", 蝴蝶犬: "small", 迷你雪納瑞: "small",
  柴犬: "medium", 柯基: "medium", 米格魯: "medium", 法鬥: "medium",
  法國鬥牛犬: "medium", 邊境牧羊犬: "medium", 邊牧: "medium",
  可卡: "medium", 沙皮: "medium", 鬆獅: "medium",
  // 同一個品種的多種寫法都要收 —— 飼主不會照字典打字
  黃金獵犬: "large", 黃金: "large", 黃金獵狗: "large",
  拉布拉多: "large", 拉不拉多: "large", 拉拉: "large",
  哈士奇: "large", 秋田: "large", 德國牧羊犬: "large", 狼犬: "large",
  大丹: "large", 聖伯納: "large", 杜賓: "large",
  米克斯: "medium", 混種: "medium", 浪浪: "medium",
};

/** 蛋白源的所有講法。飼主不會寫「chicken」。 */
const PROTEINS: Record<string, ProteinSource> = {
  雞: "chicken", 雞肉: "chicken", 雞胸: "chicken", 去骨雞: "chicken",
  牛: "beef", 牛肉: "beef",
  羊: "lamb", 羊肉: "lamb", 小羊: "lamb",
  鮭魚: "salmon", 鮭: "salmon",
  魚: "whitefish", 白魚: "whitefish", 海魚: "whitefish", 鱈魚: "whitefish",
  鴨: "duck", 鴨肉: "duck",
  火雞: "turkey",
  豬: "pork", 豬肉: "pork",
  鹿: "venison", 鹿肉: "venison",
  昆蟲: "insect", 黑水虻: "insect",
};

/** 症狀 → 正規化標籤。左邊是飼主真的會打的字。 */
const SYMPTOMS: Record<string, string> = {
  /* 皮膚 —— 最常見的入口 */
  抓癢: "皮膚搔癢", 搔癢: "皮膚搔癢", 一直抓: "皮膚搔癢", 抓不停: "皮膚搔癢",
  抓到流血: "皮膚搔癢", 一直在抓: "皮膚搔癢", 狂抓: "皮膚搔癢",
  舔腳: "皮膚搔癢", 啃腳: "皮膚搔癢", 咬腳: "皮膚搔癢", 一直舔: "皮膚搔癢",
  紅疹: "皮膚問題", 起疹: "皮膚問題", 皮膚: "皮膚問題", 濕疹: "皮膚問題",
  紅紅的: "皮膚問題", 長痘: "皮膚問題", 脫屑: "皮膚問題", 皮屑: "皮膚問題",

  /* 毛 */
  掉毛: "毛髮問題", 脫毛: "毛髮問題", 毛沒光澤: "毛髮問題", 毛很乾: "毛髮問題",
  毛變少: "毛髮問題", 毛掉很多: "毛髮問題", 毛毛躁躁: "毛髮問題",

  淚痕: "淚痕", 眼淚很多: "淚痕",

  /* 腸胃 —— 台灣人多半講便便不講腹瀉 */
  軟便: "腸胃問題", 拉肚子: "腸胃問題", 腹瀉: "腸胃問題", 大便很軟: "腸胃問題",
  便便很軟: "腸胃問題", 大便不成形: "腸胃問題", 便便不成形: "腸胃問題",
  拉稀: "腸胃問題", 大便有點軟: "腸胃問題",
  脹氣: "腸胃問題", 放屁: "腸胃問題", 嘔吐: "腸胃問題", 吐: "腸胃問題",

  /* 適口性 */
  挑食: "適口性", 不吃: "適口性", 不愛吃: "適口性", 吃很少: "適口性",
  挑嘴: "適口性", 吃兩口: "適口性", 聞一聞就走: "適口性", 不賞臉: "適口性",

  /* 體重 —— 「有點胖」是最常見的講法，原本讀不出來 */
  太胖: "體重", 過重: "體重", 減肥: "體重", 太瘦: "體重",
  有點胖: "體重", 胖胖: "體重", 圓滾滾: "體重", 肉肉的: "體重",
  過胖: "體重", 體重過重: "體重", 要控制體重: "體重", 瘦不下來: "體重",

  腎: "腎臟", 腎指數: "腎臟", 控磷: "腎臟",
  口臭: "口腔", 牙結石: "口腔", 牙齒黃: "口腔",
};

const CN_NUM: Record<string, number> = {
  零: 0, 一: 1, 兩: 2, 二: 2, 三: 3, 四: 4, 五: 5,
  六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
};

/* ------------------------------------------------------------------ */
/* 解析                                                                */
/* ------------------------------------------------------------------ */

export interface ParseResult {
  situation: Situation;
  /** 解析到的每一項，給前端做成可編輯的 chip */
  chips: { label: string; kind: "info" | "avoid"; source: string }[];
  /** 完全沒讀到東西 —— 前端要引導或走 LINE 降落傘 */
  empty: boolean;
}

export function parse(text: string): ParseResult {
  const t = text.replace(/\s+/g, "");
  const chips: ParseResult["chips"] = [];

  /*
   * 物種。預設狗 —— 目前只有狗飼料。
   *
   * 只有明確講到貓才標 chip：狗是預設值，每次都掛一個「物種 · 狗」是噪音；
   * 但講了貓一定要顯示出來，因為接下來我們會整題不回答，
   * 使用者必須看得到我們是因為讀到「貓」才停的。
   */
  const species: "dog" | "cat" = /貓|喵/.test(t) ? "cat" : "dog";
  if (species === "cat") {
    chips.push({ label: "物種 · 貓", kind: "info", source: "貓" });
  }

  /* 品種 —— 長的先比，「迷你雪納瑞」不要被「雪納瑞」搶走 */
  let breed: string | undefined;
  let bodySize: "small" | "medium" | "large" | undefined;
  for (const b of Object.keys(BREEDS).sort((a, z) => z.length - a.length)) {
    if (t.includes(b)) {
      breed = b;
      bodySize = BREEDS[b];
      chips.push({ label: `品種 · ${b}`, kind: "info", source: b });
      break;
    }
  }

  /* 年齡 */
  const ageYears = parseAge(t);
  if (ageYears !== undefined) {
    chips.push({
      label: ageYears < 1 ? `年齡 · 幼犬` : `年齡 · ${ageYears} 歲`,
      kind: "info",
      source: "年齡",
    });
  }

  /* 體重 */
  const wm = t.match(/(\d+(?:\.\d+)?)\s*(?:公斤|kg|KG|Kg)/);
  const weightKg = wm ? parseFloat(wm[1]) : undefined;
  if (weightKg) chips.push({ label: `體重 · ${weightKg}kg`, kind: "info", source: "體重" });

  /* 症狀 */
  const symptoms: string[] = [];
  for (const [k, v] of Object.entries(SYMPTOMS)) {
    if (t.includes(k) && !symptoms.includes(v)) {
      symptoms.push(v);
      chips.push({ label: v, kind: "info", source: k });
    }
  }

  /* 要避開的蛋白源 —— 兩種訊號 */
  const avoid = detectAvoid(t, symptoms.length > 0);
  for (const a of avoid) {
    chips.push({ label: `排除 · ${zhProtein(a)}`, kind: "avoid", source: "過敏" });
  }

  /* 預算 */
  const budgetMonthly = parseBudget(t);
  if (budgetMonthly) {
    chips.push({ label: `每月預算 ${budgetMonthly}`, kind: "info", source: "預算" });
  }

  return {
    situation: { species, breed, bodySize, ageYears, weightKg, avoid, symptoms, budgetMonthly, constraints: [] },
    chips,
    empty: chips.length === 0,
  };
}

/**
 * 判斷要排除哪些蛋白源。
 *
 * 明確訊號：「對雞肉過敏」「不能吃牛」
 * 間接訊號：「換過兩種雞肉飼料都沒改善」+ 有皮膚症狀
 *           → 這是台灣飼主最常見的講法，而且它其實是很強的線索：
 *             他已經自己做過一輪排除法了。
 */
function detectAvoid(t: string, hasSymptom: boolean): ProteinSource[] {
  const found = new Set<ProteinSource>();
  const keys = Object.keys(PROTEINS).sort((a, z) => z.length - a.length);

  const explicit = /過敏|不能吃|不吃|會癢|忌口|avoid/;
  const triedAndFailed = /換過|試過|吃過|都沒(改善|用|效)|沒有改善|還是(一樣|會)/;

  for (const k of keys) {
    const idx = t.indexOf(k);
    if (idx === -1) continue;

    // 只看該蛋白源前後 12 字，避免整句話裡任一個「過敏」都算到頭上
    const around = t.slice(Math.max(0, idx - 12), idx + k.length + 12);

    if (explicit.test(around)) {
      found.add(PROTEINS[k]);
    } else if (hasSymptom && triedAndFailed.test(t)) {
      // 有症狀 + 講了「換過都沒改善」→ 他提到的那個蛋白源就是嫌疑犯
      found.add(PROTEINS[k]);
    }
  }
  return [...found];
}

function parseAge(t: string): number | undefined {
  // 月齡優先 —— 「4 個月」是幼犬，不能當成 4 歲
  const mo = t.match(/(\d+)\s*個?月(?!.*歲)/) ?? t.match(/([零一兩二三四五六七八九十]+)\s*個月/);
  if (mo) {
    const n = /\d/.test(mo[1]) ? parseInt(mo[1], 10) : cnNum(mo[1]);
    if (n && n <= 24) return +(n / 12).toFixed(2);
  }
  const yr = t.match(/(\d+)\s*歲/) ?? t.match(/([零一兩二三四五六七八九十]+)\s*歲/);
  if (yr) {
    const n = /\d/.test(yr[1]) ? parseInt(yr[1], 10) : cnNum(yr[1]);
    if (n) return n;
  }
  if (/幼犬|幼貓|小狗|奶狗|奶貓/.test(t)) return 0.5;
  if (/老狗|老貓|高齡|年紀大/.test(t)) return 10;
  return undefined;
}

function parseBudget(t: string): number | undefined {
  const m =
    t.match(/預算[^0-9]{0,6}(\d{3,6})/) ??
    t.match(/一個月[^0-9]{0,6}(\d{3,6})/) ??
    t.match(/(\d{3,6})\s*(?:元|塊)(?:以內|以下|左右)/);
  return m ? parseInt(m[1], 10) : undefined;
}

/** 「一千五」「兩千」這類講法。只處理常見的幾種，不做完整中文數字剖析。 */
function cnNum(s: string): number {
  if (s.length === 1) return CN_NUM[s] ?? 0;
  if (s.startsWith("十")) return 10 + (CN_NUM[s[1]] ?? 0);
  if (s.includes("十")) {
    const [a, b] = s.split("十");
    return (CN_NUM[a] ?? 1) * 10 + (CN_NUM[b] ?? 0);
  }
  return CN_NUM[s] ?? 0;
}

const ZH: Record<string, string> = {
  poultry: "未指明的禽肉",
  chicken: "雞肉", beef: "牛肉", lamb: "羊肉", salmon: "鮭魚",
  whitefish: "白魚", duck: "鴨肉", turkey: "火雞", pork: "豬肉",
  venison: "鹿肉", insect: "昆蟲蛋白",
};
function zhProtein(k: string) { return ZH[k] ?? k; }
