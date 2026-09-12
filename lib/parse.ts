import type { Form, ProteinSource, Situation, Species } from "./types";

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

/**
 * 貓的品種與台灣人的叫法。
 *
 * 「橘貓」「賓士貓」「三花」嚴格說是毛色不是品種，但台灣飼主就是這樣講的，
 * 讀得出來才知道是在講貓。
 */
const CAT_BREEDS = [
  "英國短毛貓", "英國短毛", "英短", "美國短毛貓", "美國短毛", "美短",
  "布偶貓", "布偶", "緬因貓", "緬因", "波斯貓", "波斯", "暹羅貓", "暹羅",
  "曼赤肯", "短腿貓", "蘇格蘭摺耳貓", "蘇格蘭摺耳", "摺耳貓", "摺耳",
  "俄羅斯藍貓", "俄藍", "金吉拉", "異國短毛貓", "異國短毛", "加菲貓", "加菲",
  "挪威森林貓", "米克斯貓", "橘貓", "虎斑貓", "虎斑", "賓士貓", "三花貓", "三花",
  "浪貓", "黑貓", "白貓",
];

/**
 * 蛋白源的所有講法。飼主不會寫「chicken」。
 *
 * 「魚」單獨出現是指所有魚：說「對魚過敏」的人，不會希望我們留一款鮭魚給他。
 */
const PROTEINS: Record<string, ProteinSource[]> = {
  雞: ["chicken"], 雞肉: ["chicken"], 雞胸: ["chicken"], 去骨雞: ["chicken"],
  牛: ["beef"], 牛肉: ["beef"],
  羊: ["lamb"], 羊肉: ["lamb"], 小羊: ["lamb"],
  鮭魚: ["salmon"], 鮭: ["salmon"],
  白魚: ["whitefish"], 海魚: ["whitefish"], 鱈魚: ["whitefish"],
  鮪魚: ["fish"], 沙丁魚: ["fish"], 鯖魚: ["fish"], 鯡魚: ["fish"],
  魚: ["salmon", "whitefish", "fish"], 魚肉: ["salmon", "whitefish", "fish"],
  鴨: ["duck"], 鴨肉: ["duck"],
  火雞: ["turkey"],
  豬: ["pork"], 豬肉: ["pork"],
  鹿: ["venison"], 鹿肉: ["venison"],
  昆蟲: ["insect"], 黑水虻: ["insect"],
};

/** 症狀 → 正規化標籤。左邊是飼主真的會打的字。 */
const SYMPTOMS: Record<string, string> = {
  /* 皮膚 —— 最常見的入口 */
  抓癢: "皮膚搔癢", 搔癢: "皮膚搔癢", 一直抓: "皮膚搔癢", 抓不停: "皮膚搔癢",
  抓到流血: "皮膚搔癢", 一直在抓: "皮膚搔癢", 狂抓: "皮膚搔癢",
  舔腳: "皮膚搔癢", 啃腳: "皮膚搔癢", 咬腳: "皮膚搔癢", 一直舔: "皮膚搔癢",
  紅疹: "皮膚問題", 起疹: "皮膚問題", 皮膚: "皮膚問題", 濕疹: "皮膚問題",
  紅紅的: "皮膚問題", 長痘: "皮膚問題", 脫屑: "皮膚問題", 皮屑: "皮膚問題",
  下巴粉刺: "皮膚問題", 黑下巴: "皮膚問題",

  /* 毛 */
  掉毛: "毛髮問題", 脫毛: "毛髮問題", 毛沒光澤: "毛髮問題", 毛很乾: "毛髮問題",
  毛變少: "毛髮問題", 毛掉很多: "毛髮問題", 毛毛躁躁: "毛髮問題",
  舔禿: "毛髮問題", 舔到禿: "毛髮問題",

  淚痕: "淚痕", 眼淚很多: "淚痕",

  /* 毛球 —— 貓的日常，要跟「吐」分開，不然每隻吐毛球的貓都被當成腸胃問題 */
  吐毛球: "毛球", 吐毛: "毛球", 毛球: "毛球", 化毛: "毛球",

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

  /* 泌尿道 —— 貓最常見的急症入口，一定要讀得出來 */
  頻尿: "泌尿道", 血尿: "泌尿道", 尿血: "泌尿道", 尿不出來: "泌尿道",
  尿不太出來: "泌尿道", 尿很少: "泌尿道", 一直跑砂盆: "泌尿道", 一直蹲砂盆: "泌尿道",
  泌尿: "泌尿道", 膀胱: "泌尿道", 結石: "泌尿道", 尿道: "泌尿道",

  糖尿: "糖尿病", 血糖: "糖尿病",

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
  /** 完全沒讀到東西 —— 前端要引導或走降落傘 */
  empty: boolean;
  /** 物種是從這句話讀出來的（true），還是用呼叫端給的預設（false） */
  speciesFromText: boolean;
  /** 乾糧／罐頭是從這句話讀出來的 */
  formFromText: boolean;
}

/*
 * 乾糧還是罐頭。
 *
 * 「肉泥」刻意不收：台灣講肉泥多半是指啾嚕那種條狀零食，不是正餐。
 * 「飼料」也不收：「換過兩種雞肉飼料」講的是過去吃什麼，不是現在要找什麼。
 */
const WET_WORDS = ["主食罐", "副食罐", "罐頭", "罐罐", "濕食", "濕糧", "餐包"];
const DRY_WORDS = ["乾糧", "乾飼料", "乾乾"];

/** 句子裡講了罐頭就是罐頭，講了乾糧就是乾糧；兩個都講（乾濕混餵）就交給畫面上的選擇 */
export function detectForm(t: string): Form | undefined {
  const wet = WET_WORDS.some((w) => t.includes(w));
  const dry = DRY_WORDS.some((w) => t.includes(w));
  if (wet && !dry) return "wet";
  if (dry && !wet) return "dry";
  return undefined;
}

/**
 * 從這句話判斷是狗還是貓。讀不出來回 undefined，交給畫面上的選擇。
 *
 * 兩個都講到的時候（「家裡有狗也有貓，貓一直吐」），看哪一個被提到比較多次，
 * 一樣多才看誰先出現。不完美，但這種句子很少，而且畫面上的切換鈕隨時可以改。
 */
export function detectSpecies(t: string): Species | undefined {
  const catWords = ["貓", "喵", "主子", "砂盆", ...CAT_BREEDS];
  // 米克斯貓也叫米克斯，不能拿來判斷是狗
  const dogWords = ["狗", "犬", "汪", ...Object.keys(BREEDS).filter((b) => b !== "米克斯" && b !== "混種")];
  const cat = hits(t, catWords);
  const dog = hits(t, dogWords);
  if (cat.count === 0 && dog.count === 0) return undefined;
  if (cat.count !== dog.count) return cat.count > dog.count ? "cat" : "dog";
  return cat.first < dog.first ? "cat" : "dog";
}

/** 這些詞在句子裡出現幾次、最早在哪。長的先比，比到的字蓋掉，「英短」不會又被「貓」多算一次。 */
function hits(t: string, words: string[]): { count: number; first: number } {
  let work = t, count = 0, first = Infinity;
  for (const w of [...words].sort((a, z) => z.length - a.length)) {
    let idx = work.indexOf(w);
    while (idx !== -1) {
      count++;
      first = Math.min(first, idx);
      work = work.slice(0, idx) + "＿".repeat(w.length) + work.slice(idx + w.length);
      idx = work.indexOf(w);
    }
  }
  return { count, first };
}

export function parse(text: string, fallback: Species = "dog", fallbackForm: Form = "dry"): ParseResult {
  const t = text.replace(/\s+/g, "");
  const chips: ParseResult["chips"] = [];

  /*
   * 物種。
   *
   * 句子裡讀得出來就照句子；讀不出來用畫面上選的那一個（預設狗）。
   * 從句子讀出來的才掛 chip —— 使用者自己選的，再掛一次是噪音。
   */
  const said = detectSpecies(t);
  const species: Species = said ?? fallback;

  /* 品種 —— 長的先比，「迷你雪納瑞」不要被「雪納瑞」搶走 */
  let breed: string | undefined;
  let bodySize: "small" | "medium" | "large" | undefined;
  if (species === "cat") {
    for (const b of [...CAT_BREEDS].sort((a, z) => z.length - a.length)) {
      if (t.includes(b)) {
        breed = b;
        chips.push({ label: `品種 · ${b}`, kind: "info", source: b });
        break;
      }
    }
  } else {
    for (const b of Object.keys(BREEDS).sort((a, z) => z.length - a.length)) {
      if (t.includes(b)) {
        breed = b;
        bodySize = BREEDS[b];
        chips.push({ label: `品種 · ${b}`, kind: "info", source: b });
        break;
      }
    }
  }

  // 講了品種就知道是什麼動物，不用再掛一顆「物種」。沒講品種才掛，讓他看得到我們是怎麼判斷的。
  if (said && !breed) {
    chips.unshift({ label: `物種 · ${species === "cat" ? "貓" : "狗"}`, kind: "info", source: said });
  }

  /* 乾糧還是罐頭。一樣是句子裡讀得出來才掛 chip */
  const formSaid = detectForm(t);
  const form: Form = formSaid ?? fallbackForm;
  if (formSaid) {
    chips.push({ label: `要找 · ${formSaid === "wet" ? "罐頭" : "乾糧"}`, kind: "info", source: formSaid });
  }

  /* 年齡 */
  const ageYears = parseAge(t, species);
  if (ageYears !== undefined) {
    chips.push({
      label: ageYears < 1 ? `年齡 · ${species === "cat" ? "幼貓" : "幼犬"}` : `年齡 · ${ageYears} 歲`,
      kind: "info",
      source: "年齡",
    });
  }

  /* 體重 */
  const wm = t.match(/(\d+(?:\.\d+)?)\s*(?:公斤|kg|KG|Kg)/);
  const weightKg = wm ? parseFloat(wm[1]) : undefined;
  if (weightKg) chips.push({ label: `體重 · ${weightKg}kg`, kind: "info", source: "體重" });

  /*
   * 症狀。長的詞先比，比到的字就蓋掉：
   * 「牙結石」不能讓「結石」再比一次（那會變成泌尿道，整題停掉），
   * 「吐毛球」裡的「吐」也不算腸胃問題。
   */
  const symptoms: string[] = [];
  let work = t;
  for (const k of Object.keys(SYMPTOMS).sort((a, z) => z.length - a.length)) {
    if (!work.includes(k)) continue;
    const v = SYMPTOMS[k];
    if (!symptoms.includes(v)) {
      symptoms.push(v);
      chips.push({ label: v, kind: "info", source: k });
    }
    work = work.split(k).join("＿".repeat(k.length));
  }

  /* 要避開的蛋白源 —— 兩種訊號 */
  const avoid = detectAvoid(t, symptoms.length > 0);
  for (const label of avoidLabels(avoid)) {
    chips.push({ label: `排除 · ${label}`, kind: "avoid", source: "過敏" });
  }

  /* 預算 */
  const budgetMonthly = parseBudget(t);
  if (budgetMonthly) {
    chips.push({ label: `每月預算 ${budgetMonthly}`, kind: "info", source: "預算" });
  }

  return {
    situation: { species, form, breed, bodySize, ageYears, weightKg, avoid, symptoms, budgetMonthly, constraints: [] },
    chips,
    // 只講了「罐頭」兩個字，沒有任何條件可以用，一樣當作讀不出東西
    empty: chips.filter((c) => c.source !== "wet" && c.source !== "dry").length === 0,
    speciesFromText: said !== undefined,
    formFromText: formSaid !== undefined,
  };
}

/**
 * 判斷要排除哪些蛋白源。
 *
 * 明確訊號：「對雞肉過敏」「不能吃牛」
 * 間接訊號：「換過兩種雞肉飼料都沒改善」+ 有皮膚症狀
 *           → 這是台灣飼主最常見的講法，而且它其實是很強的線索：
 *             他已經自己做過一輪排除法了。
 *
 * 長的詞先比，比到的字就蓋掉，「鮭魚」才不會又被當成「魚」。
 */
function detectAvoid(t: string, hasSymptom: boolean): ProteinSource[] {
  const found = new Set<ProteinSource>();
  const keys = Object.keys(PROTEINS).sort((a, z) => z.length - a.length);

  const explicit = /過敏|不能吃|不吃|會癢|忌口|avoid/;
  const triedAndFailed = /換過|試過|吃過|都沒(改善|用|效)|沒有改善|還是(一樣|會)/;

  let work = t;
  for (const k of keys) {
    let idx = work.indexOf(k);
    while (idx !== -1) {
      // 只看該蛋白源前後 12 字，避免整句話裡任一個「過敏」都算到頭上
      const around = t.slice(Math.max(0, idx - 12), idx + k.length + 12);

      if (explicit.test(around) || (hasSymptom && triedAndFailed.test(t))) {
        // 有症狀 + 講了「換過都沒改善」→ 他提到的那個蛋白源就是嫌疑犯
        for (const p of PROTEINS[k]) found.add(p);
      }
      work = work.slice(0, idx) + "＿".repeat(k.length) + work.slice(idx + k.length);
      idx = work.indexOf(k);
    }
  }
  return [...found];
}

/** chip 上的字。三種魚都在就只講「魚」，不要冒出「白魚」「其他魚類」。 */
function avoidLabels(avoid: ProteinSource[]): string[] {
  const fish: ProteinSource[] = ["salmon", "whitefish", "fish"];
  const allFish = fish.every((f) => avoid.includes(f));
  const out = avoid.filter((a) => !(allFish && fish.includes(a))).map(zhProtein);
  return allFish ? ["魚", ...out] : out;
}

function parseAge(t: string, species: Species): number | undefined {
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
  if (/幼犬|幼貓|小狗|奶狗|奶貓|小貓/.test(t)) return 0.5;
  // 「老貓」要落在貓的高齡線（11 歲）之後，不然會被當成成貓
  if (/老狗|老貓|高齡|年紀大/.test(t)) return species === "cat" ? 12 : 10;
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
  poultry: "未指明的禽肉", animal: "未指明的動物蛋白",
  chicken: "雞肉", beef: "牛肉", lamb: "羊肉", salmon: "鮭魚",
  whitefish: "白魚", fish: "魚", duck: "鴨肉", turkey: "火雞", pork: "豬肉",
  venison: "鹿肉", insect: "昆蟲蛋白",
};
function zhProtein(k: string) { return ZH[k] ?? k; }
