import type { ProteinSource, Situation, Species } from "./types";

/**
 * 程序化決策頁的網址字典。
 *
 * 這些頁是承接長尾搜尋的主力 ——「柴犬 飼料 推薦」「狗 雞肉過敏 飼料」
 * 這類查詢的量，加起來遠大於任何一個大詞。
 *
 * 網址用英文 slug（穩定、不會被百分比編碼弄髒），
 * 頁面內容全中文（那才是 Google 和 AI 讀的東西）。
 *
 * 狗跟貓各一套。網址前綴不同（/dog-food、/cat-food），
 * 所以 no-chicken 這種 slug 可以兩邊都有，不會撞。
 */

export interface BreedEntry {
  slug: string;
  zh: string;
  /** 同一品種的其他寫法，出現在頁面內文幫助命中搜尋 */
  alias: string[];
  /** 只有狗有。貓的體型差距小，市面上也幾乎沒有體型專用的貓糧 */
  size?: "small" | "medium" | "large";
  /**
   * 典型成年體重（公斤）。
   *
   * 加這一欄是為了讓每個品種頁至少帶一組**只屬於它自己的真實數字** ——
   * 一天幾克、這包吃幾天、一個月多少錢。
   *
   * 原本只用 small/medium/large 三個桶，結果馬爾濟斯、博美、約克夏
   * 三頁的內容一模一樣，那在 Google 眼中就是 doorway page。
   *
   * 數字取各品種普遍公布的體重範圍中間值，台灣常見的體型為準
   * （貴賓、臘腸、雪納瑞多為迷你型）。標成「典型」不是「應該」——
   * 真正的依據是體態。
   */
  kg: number;
}

export const BREEDS: BreedEntry[] = [
  { slug: "shiba-inu",   zh: "柴犬",     alias: ["柴柴"],           size: "medium", kg: 10 },
  { slug: "corgi",       zh: "柯基",     alias: ["威爾斯柯基"],     size: "medium", kg: 12 },
  { slug: "poodle",      zh: "貴賓",     alias: ["紅貴賓", "泰迪"], size: "small",  kg: 5 },
  { slug: "maltese",     zh: "馬爾濟斯", alias: ["瑪爾濟斯"],       size: "small",  kg: 3 },
  { slug: "pomeranian",  zh: "博美",     alias: [],                 size: "small",  kg: 3 },
  { slug: "chihuahua",   zh: "吉娃娃",   alias: [],                 size: "small",  kg: 2.5 },
  { slug: "schnauzer",   zh: "雪納瑞",   alias: ["迷你雪納瑞"],     size: "small",  kg: 7 },
  { slug: "dachshund",   zh: "臘腸",     alias: ["臘腸狗"],         size: "small",  kg: 5 },
  { slug: "bichon",      zh: "比熊",     alias: [],                 size: "small",  kg: 6 },
  { slug: "shih-tzu",    zh: "西施",     alias: [],                 size: "small",  kg: 6 },
  { slug: "yorkshire",   zh: "約克夏",   alias: [],                 size: "small",  kg: 3 },
  { slug: "pug",         zh: "巴哥",     alias: ["八哥"],           size: "small",  kg: 7 },
  { slug: "beagle",      zh: "米格魯",   alias: [],                 size: "medium", kg: 11 },
  { slug: "french-bulldog", zh: "法鬥",  alias: ["法國鬥牛犬"],     size: "medium", kg: 11 },
  { slug: "border-collie",  zh: "邊境牧羊犬", alias: ["邊牧"],      size: "medium", kg: 17 },
  { slug: "cocker",      zh: "可卡",     alias: ["可卡犬"],         size: "medium", kg: 13 },
  { slug: "mixed",       zh: "米克斯",   alias: ["混種", "浪浪"],   size: "medium", kg: 12 },
  { slug: "golden",      zh: "黃金獵犬", alias: ["黃金"],           size: "large",  kg: 30 },
  { slug: "labrador",    zh: "拉布拉多", alias: ["拉不拉多", "拉拉"], size: "large", kg: 30 },
  { slug: "husky",       zh: "哈士奇",   alias: [],                 size: "large",  kg: 22 },
  { slug: "akita",       zh: "秋田",     alias: ["秋田犬"],         size: "large",  kg: 38 },
  { slug: "german-shepherd", zh: "德國牧羊犬", alias: ["狼犬"],     size: "large",  kg: 32 },
  { slug: "doberman",    zh: "杜賓",     alias: [],                 size: "large",  kg: 36 },
];

/**
 * 貓的品種。體重取各品種普遍公布範圍的中間值，公母平均。
 * 米克斯放第一個：台灣的貓大多是米克斯，那一頁的量最大。
 */
export const CAT_BREEDS: BreedEntry[] = [
  { slug: "mixed",              zh: "米克斯貓",     alias: ["米克斯", "浪貓", "橘貓", "虎斑", "賓士貓", "三花"], kg: 4.5 },
  { slug: "british-shorthair",  zh: "英國短毛貓",   alias: ["英短"],               kg: 5.5 },
  { slug: "american-shorthair", zh: "美國短毛貓",   alias: ["美短"],               kg: 5 },
  { slug: "ragdoll",            zh: "布偶貓",       alias: ["布偶"],               kg: 6 },
  { slug: "maine-coon",         zh: "緬因貓",       alias: ["緬因"],               kg: 7 },
  { slug: "persian",            zh: "波斯貓",       alias: ["金吉拉"],             kg: 4.5 },
  { slug: "exotic-shorthair",   zh: "異國短毛貓",   alias: ["加菲貓", "加菲"],     kg: 5 },
  { slug: "siamese",            zh: "暹羅貓",       alias: ["暹羅"],               kg: 4 },
  { slug: "scottish-fold",      zh: "蘇格蘭摺耳貓", alias: ["摺耳貓", "摺耳"],     kg: 4.5 },
  { slug: "munchkin",           zh: "曼赤肯",       alias: ["短腿貓"],             kg: 3.5 },
  { slug: "russian-blue",       zh: "俄羅斯藍貓",   alias: ["俄藍"],               kg: 4.5 },
  { slug: "norwegian-forest",   zh: "挪威森林貓",   alias: [],                     kg: 6 },
];

export interface AllergenEntry {
  /** 網址用 no-chicken 這種形式，語意直接 */
  slug: string;
  protein: ProteinSource;
  /** 同一頁要一起避開的，例如「魚」= fish + salmon + whitefish */
  also?: ProteinSource[];
  zh: string;
}

export const ALLERGENS: AllergenEntry[] = [
  { slug: "no-chicken", protein: "chicken", zh: "雞肉" },
  { slug: "no-beef",    protein: "beef",    zh: "牛肉" },
  { slug: "no-lamb",    protein: "lamb",    zh: "羊肉" },
  { slug: "no-salmon",  protein: "salmon",  zh: "鮭魚" },
  { slug: "no-duck",    protein: "duck",    zh: "鴨肉" },
];

/**
 * 貓的過敏原頁。只做刪得到東西的：
 * 我們收的貓飼料沒有牛肉跟羊肉，「不含牛肉的貓飼料」會是一頁全部留下的空話。
 */
export const CAT_ALLERGENS: AllergenEntry[] = [
  { slug: "no-chicken", protein: "chicken", zh: "雞肉" },
  { slug: "no-fish",    protein: "fish", also: ["salmon", "whitefish"], zh: "魚" },
];

const BREEDS_OF: Record<Species, BreedEntry[]> = { dog: BREEDS, cat: CAT_BREEDS };
const ALLERGENS_OF: Record<Species, AllergenEntry[]> = { dog: ALLERGENS, cat: CAT_ALLERGENS };

export const breedsOf = (sp: Species) => BREEDS_OF[sp];
export const allergensOf = (sp: Species) => ALLERGENS_OF[sp];

export const breedBySlug = (s: string, sp: Species = "dog") => BREEDS_OF[sp].find((b) => b.slug === s);
export const allergenBySlug = (s: string, sp: Species = "dog") => ALLERGENS_OF[sp].find((a) => a.slug === s);

/* ------------------------------------------------------------------ */

export type PageKind =
  | { kind: "breed";   breed: BreedEntry }
  | { kind: "allergen"; allergen: AllergenEntry }
  | { kind: "both";    breed: BreedEntry; allergen: AllergenEntry };

/** 把網址片段解析成頁面類型。不合法的組合回 null → 404。 */
export function resolve(slug: string[], sp: Species = "dog"): PageKind | null {
  if (slug.length === 1) {
    const b = breedBySlug(slug[0], sp);
    if (b) return { kind: "breed", breed: b };
    const a = allergenBySlug(slug[0], sp);
    if (a) return { kind: "allergen", allergen: a };
    return null;
  }
  if (slug.length === 2) {
    const b = breedBySlug(slug[0], sp);
    const a = allergenBySlug(slug[1], sp);
    if (b && a) return { kind: "both", breed: b, allergen: a };
  }
  return null;
}

/** 所有要靜態生成的路徑。狗 23 + 5 + 115 = 143 頁，貓 12 + 2 + 24 = 38 頁。 */
export function allPaths(sp: Species = "dog"): string[][] {
  const out: string[][] = [];
  for (const b of BREEDS_OF[sp]) out.push([b.slug]);
  for (const a of ALLERGENS_OF[sp]) out.push([a.slug]);
  for (const b of BREEDS_OF[sp]) for (const a of ALLERGENS_OF[sp]) out.push([b.slug, a.slug]);
  return out;
}

const ANIMAL: Record<Species, string> = { dog: "狗", cat: "貓" };

/** 頁面標題。寫成使用者真的會打進 Google 的樣子。 */
export function titleOf(p: PageKind, sp: Species = "dog"): string {
  switch (p.kind) {
    case "breed":    return `${p.breed.zh}飼料怎麼選`;
    case "allergen": return `不含${p.allergen.zh}的${ANIMAL[sp]}飼料`;
    case "both":     return `${p.breed.zh}${p.allergen.zh}過敏，飼料怎麼選`;
  }
}

export function descriptionOf(p: PageKind, kept: number, cut: number, sp: Species = "dog"): string {
  switch (p.kind) {
    case "breed":
      return `我們從資料庫裡刪掉 ${cut} 款不適合${p.breed.zh}的飼料，剩下 ${kept} 款，並寫清楚每一款的排除理由，以及什麼時候不要買。`;
    case "allergen":
      return `避開${p.allergen.zh}的${ANIMAL[sp]}飼料。刪掉 ${cut} 款含${p.allergen.zh}或營養不達標的，剩下 ${kept} 款。每款都寫清楚什麼時候不要買。`;
    case "both":
      return `${p.breed.zh}對${p.allergen.zh}過敏該吃什麼？刪掉 ${cut} 款，剩下 ${kept} 款，附排除理由與購買時機建議。`;
  }
}


/**
 * 各體型的典型成犬體重。長尾頁沒有使用者輸入的體重，
 * 用品種推一個代表值來估「這包吃得完嗎」——標示為概估，不假裝精確。
 */
export const TYPICAL_KG: Record<"small" | "medium" | "large", number> = {
  small: 5,
  medium: 12,
  large: 30,
};


/* ------------------------------------------------------------------ */
/* 頁面 → 情境                                                        */
/*                                                                    */
/* 只能有這一份。                                                      */
/*                                                                    */
/* 原本長尾頁和 impact.ts 各抄了一份，兩份都漏了 bodySize ——          */
/* 於是同一個問題在首頁裁決器和長尾頁會跑出不一樣的結果。             */
/* 樣式那邊踩過同樣的坑（Decider 有自己的 S 物件），一次就夠了。      */
/* ------------------------------------------------------------------ */

export function situationOf(p: PageKind, sp: Species = "dog"): Situation {
  const breed = p.kind === "allergen" ? undefined : p.breed;
  const allergen = p.kind === "breed" ? undefined : p.allergen;
  return {
    species: sp,
    breed: breed?.zh,
    bodySize: breed?.size,
    weightKg: breed?.kg,
    ageYears: 3,               // 頁面預設成年；使用者要細分就回裁決器
    avoid: allergen ? [allergen.protein, ...(allergen.also ?? [])] : [],
    symptoms: [],
    constraints: [],
  };
}
