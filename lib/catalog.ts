import dog from "@/data/dog-food.json";
import cat from "@/data/cat-food.json";
import catWet from "@/data/cat-wet-food.json";
import type { Constraint, Form, Product, ProteinSource, Situation, Species } from "./types";
import { formOf, mer, recommendable, stageForAge } from "./engine";
import { MIN_LIVE } from "./categories";

/**
 * 目錄。資料在 repo 裡的 JSON，建置時直接讀 —— 沒有執行期依賴，
 * 所以 generateStaticParams 可以把幾千個決策頁全部靜態生成。
 * 這是「Google 抓得到」的關鍵，不能改成執行期 fetch。
 *
 * catalog 是全部類目加在一起。引擎第一刀按物種、第二刀按乾糧或罐頭分開，所以丟整包進去是安全的；
 * 但「無穀頁說我們收了幾款」這種統計，一定要用 catalogOf 拿單一類目，
 * 不然貓的數字會混進狗的頁面，罐頭的數字會混進乾糧的頁面。
 */
export const catalog = [
  ...(dog.products as unknown as Product[]),
  ...(cat.products as unknown as Product[]),
  ...(catWet.products as unknown as Product[]),
];

/** 單一類目。form 沒給就是乾糧，舊的呼叫不用改 */
export function catalogOf(species: Species, form: Form = "dry"): Product[] {
  return catalog.filter((p) => p.species === species && formOf(p) === form);
}

export function byId(id: string): Product | undefined {
  return catalog.find((p) => p.id === id);
}

/** 這個類目能推薦的有幾款 */
export function liveCount(species: Species, form: Form = "dry"): number {
  return catalogOf(species, form).filter(recommendable).length;
}

/** 類目開張了沒。沒開張的類目，裁決器誠實講還在上架，長尾頁也先不產生。 */
export function isLive(species: Species, form: Form = "dry"): boolean {
  return liveCount(species, form) >= MIN_LIVE;
}

/* ------------------------------------------------------------------ */
/* 物種不同，門檻就不同                                                */
/* ------------------------------------------------------------------ */

/**
 * 高齡從幾歲算。
 *
 * 狗 8 歲，貓 11 歲。貓的「7 歲以上」配方很多，但那是給熟齡成貓的，
 * 美國貓科醫師協會（AAFP）把 11 歲以上才叫高齡。7 到 10 歲的貓吃一般成貓糧沒問題，
 * 不能因為 8 歲就把成貓糧全部刪掉。
 */
export const SENIOR_AGE: Record<Species, number> = { dog: 8, cat: 11 };

/**
 * 粗蛋白下限。只擋明顯不合格的，挑好貨是評分的事。
 *
 * 貓是肉食動物，需要的蛋白質比狗高很多。AAFCO 成貓的最低標準是乾物 26%，
 * 我們拿同一個數字比對包裝上的原物基數值，等於比官方標準再嚴一點點。
 */
const MIN_PROTEIN: Record<Species, number> = { dog: 22, cat: 26 };

/**
 * 碳水上限。
 *
 * 貓在營養學上沒有碳水的最低需求（NRC 2006），市售乾糧卻從 18% 到 40% 都有。
 * 40% 是我們自己訂的線，不是官方標準；畫面上講「我們擋」，不講「專家說」。
 */
const MAX_CARB: Record<Species, number> = { dog: 48, cat: 40 };

const BIRDS: ProteinSource[] = ["chicken", "turkey", "duck"];
const FISH: ProteinSource[] = ["salmon", "whitefish", "fish"];

/**
 * 把使用者情境翻譯成排除規則，並排好順序。
 *
 * 順序就是畫面上「怎麼刪的」那一段，所以最切身的放最前面：
 * 過敏原 → 生命階段 → 體型 → 營養門檻 → 預算 → 供貨
 */
export function constraintsFor(s: Situation): Constraint[] {
  const cs: Constraint[] = [];
  const sp = s.species;
  const wet = s.form === "wet";

  /*
   * 罐頭的第一刀：副食罐。
   *
   * 放在過敏原前面，因為它跟這隻貓的狀況無關，是這一罐能不能當飯吃。
   * 副食罐再好吃、肉再多，鈣和牛磺酸沒補齊，當正餐吃久了就是營養不良。
   */
  if (wet) {
    cs.push({
      kind: "completeOnly",
      label: "副食罐，只能當點心，不能當正餐",
      tag: "主食／副食",
    });
  }

  /*
   * 標示沒寫是哪種動物的，先刪。
   *
   * 「水解動物蛋白」可能是任何一種肉，對要避開某種肉的人等於沒標。
   * 單獨一刀、單獨一句理由 —— 混在「含雞肉」那一刀裡，
   * 使用者會以為那款有雞，其實是我們根本不知道它有什麼。
   */
  if (s.avoid.length > 0) {
    cs.push({
      kind: "excludeProtein",
      value: "animal",
      label: "肉的來源沒寫清楚，只寫「動物蛋白」或「肉類」",
      tag: "你標記的過敏原",
    });
  }

  // 三種魚都要避，就合成一刀「含魚」。拆成三刀，畫面上會出現「含白魚」「含其他魚類」這種沒人會講的話。
  const avoidFish = FISH.every((f) => s.avoid.includes(f));
  if (avoidFish) {
    cs.push({
      kind: "excludeProtein",
      value: "fish",
      also: ["salmon", "whitefish"],
      label: "含魚（鮭魚、鱈魚、沙丁魚、鮪魚這些都算）",
      tag: "你標記的過敏原",
    });
  }

  for (const protein of s.avoid) {
    if (avoidFish && FISH.includes(protein)) continue;
    cs.push({
      kind: "excludeProtein",
      value: protein,
      label: BIRDS.includes(protein)
        ? `含${zh(protein)}，或只寫「禽肉」沒指明是哪一種`
        : `主蛋白源含${zh(protein)}`,
      tag: "你標記的過敏原",
    });
  }

  if (s.ageYears !== undefined) {
    const stage = s.ageYears < 1 ? "puppy" : s.ageYears >= SENIOR_AGE[sp] ? "senior" : "adult";
    cs.push({
      kind: "lifeStage",
      value: stage,
      label: `不適用${stageZh(stage, sp)}`,
      tag: "年齡不符",
    });
  }

  /*
   * 門檻是照真實市售商品訂的，不是理想值。
   *
   * 用示範資料訂的舊門檻（蛋白 26% / 碳水 25%）在真實資料上直接爆掉 ——
   * Natural Balance 和 Go! 的低敏系列都是粗蛋白 24%、碳水約 45%，
   * 兩款都會被刷掉，而它們正是低敏族群最常買的東西。
   *
   * 台灣市售狗乾糧的實際分佈：
   *   粗蛋白 22–38%（高蛋白無穀配方才到 30% 以上）
   *   碳水   25–50%（號稱無穀但用馬鈴薯/木薯的，碳水一樣高）
   * 貓乾糧：
   *   粗蛋白 29–42%
   *   碳水   18–40%
   *
   * 所以門檻只用來擋「明顯不合格」的，不是拿來挑好貨。
   * 挑好貨是評分函式的事（碳水越低加越多分），排除只擋離譜的。
   */
  /*
   * 罐頭不跑這兩刀。
   *
   * 標「主食」的罐頭本來就要符合完整營養的標準，蛋白質不會低到要擋。
   * 碳水更麻煩：罐頭的標示多半是保證值，缺一個灰分就算不準，
   * 扣掉八成的水分之後誤差會放大好幾倍。拿算不準的數字去刪東西，比不刪更糟。
   */
  if (!wet) {
    cs.push({
      kind: "minProtein",
      value: MIN_PROTEIN[sp],
      label: `粗蛋白低於 ${MIN_PROTEIN[sp]}%`,
      tag: "營養門檻",
    });

    cs.push({
      kind: "maxCarb",
      value: MAX_CARB[sp],
      label: `碳水高於 ${MAX_CARB[sp]}%`,
      tag: "營養門檻",
    });
  }

  // 體型只對狗有意義。貓的體重差距小，市面上也幾乎沒有體型專用的貓糧。
  if (sp === "dog" && s.bodySize) {
    cs.push({
      kind: "bodySize",
      value: s.bodySize,
      label: `不適用${sizeZh(s.bodySize)}`,
      tag: "體型不符",
    });
  }

  /*
   * 控磷。
   *
   * 這一條原本漏掉了 —— 使用者打「獸醫說要控磷」，畫面上出現「腎臟」的
   * chip，看起來我們聽懂了，但完全沒有任何規則在跑。
   * 那比沒聽懂糟糕得多：他以為我們考慮過了。
   *
   * 門檻取 0.6%（乾物基）。市售腎臟處方飼料多在 0.2–0.5%，
   * 早期腎病一般建議不超過 0.6%，一般成犬糧本來就是 1–2%。
   * 這不是診斷 —— 獸醫給的數字才算，畫面上會這樣寫。
   */
  if (s.symptoms.some((x) => x.includes("腎"))) {
    cs.push({
      kind: "maxPhosphorus",
      value: 0.6,
      label: "磷高於 0.6%",
      tag: "獸醫指示",
    });
  }

  if (s.budgetMonthly !== undefined) {
    if (wet) {
      // 罐頭要先知道一天吃幾罐。沒講體重就用 4 公斤，而且把這個假設寫在理由裡
      const kg = s.weightKg ?? 4;
      cs.push({
        kind: "maxMonthly",
        value: s.budgetMonthly,
        kcalPerDay: mer(kg, stageForAge(s.ageYears, sp), sp),
        label: `全吃罐頭一個月超過 ${s.budgetMonthly} 元${s.weightKg ? "" : "（照 4 公斤的貓算）"}`,
        tag: "預算",
      });
    } else {
      cs.push({
        kind: "maxMonthly",
        value: s.budgetMonthly,
        label: `超出每月 ${s.budgetMonthly} 元預算`,
        tag: "預算",
      });
    }
  }

  cs.push({
    kind: "inStock",
    label: "已停產或長期缺貨",
    tag: "通路查無",
  });

  return cs;
}

const ZH: Record<string, string> = {
  poultry: "未指明的禽肉", animal: "未指明的動物蛋白",
  chicken: "雞肉", beef: "牛肉", lamb: "羊肉", salmon: "鮭魚",
  whitefish: "白魚", fish: "魚", duck: "鴨肉", turkey: "火雞", pork: "豬肉",
  venison: "鹿肉", insect: "昆蟲蛋白",
};
const zh = (k: string) => ZH[k] ?? k;

const STAGE_ZH: Record<Species, Record<string, string>> = {
  dog: { puppy: "幼犬", adult: "成犬", senior: "高齡犬" },
  cat: { puppy: "幼貓", adult: "成貓", senior: "高齡貓" },
};
export const stageZh = (k: string, sp: Species = "dog") => STAGE_ZH[sp][k] ?? k;

const SIZE_ZH: Record<string, string> = {
  small: "小型犬", medium: "中型犬", large: "大型犬",
};
const sizeZh = (k: string) => SIZE_ZH[k] ?? k;
