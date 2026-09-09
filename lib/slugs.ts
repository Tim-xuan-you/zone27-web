import type { ProteinSource } from "./types";

/**
 * 程序化決策頁的網址字典。
 *
 * 這些頁是承接長尾搜尋的主力 ——「柴犬 飼料 推薦」「狗 雞肉過敏 飼料」
 * 這類查詢的量，加起來遠大於任何一個大詞。
 *
 * 網址用英文 slug（穩定、不會被百分比編碼弄髒），
 * 頁面內容全中文（那才是 Google 和 AI 讀的東西）。
 */

export interface BreedEntry {
  slug: string;
  zh: string;
  /** 同一品種的其他寫法，出現在頁面內文幫助命中搜尋 */
  alias: string[];
  size: "small" | "medium" | "large";
}

export const BREEDS: BreedEntry[] = [
  { slug: "shiba-inu",   zh: "柴犬",     alias: ["柴柴"],           size: "medium" },
  { slug: "corgi",       zh: "柯基",     alias: ["威爾斯柯基"],     size: "medium" },
  { slug: "poodle",      zh: "貴賓",     alias: ["紅貴賓", "泰迪"], size: "small"  },
  { slug: "maltese",     zh: "馬爾濟斯", alias: ["瑪爾濟斯"],       size: "small"  },
  { slug: "pomeranian",  zh: "博美",     alias: [],                 size: "small"  },
  { slug: "chihuahua",   zh: "吉娃娃",   alias: [],                 size: "small"  },
  { slug: "schnauzer",   zh: "雪納瑞",   alias: ["迷你雪納瑞"],     size: "small"  },
  { slug: "dachshund",   zh: "臘腸",     alias: ["臘腸狗"],         size: "small"  },
  { slug: "bichon",      zh: "比熊",     alias: [],                 size: "small"  },
  { slug: "shih-tzu",    zh: "西施",     alias: [],                 size: "small"  },
  { slug: "yorkshire",   zh: "約克夏",   alias: [],                 size: "small"  },
  { slug: "pug",         zh: "巴哥",     alias: ["八哥"],           size: "small"  },
  { slug: "beagle",      zh: "米格魯",   alias: [],                 size: "medium" },
  { slug: "french-bulldog", zh: "法鬥",  alias: ["法國鬥牛犬"],     size: "medium" },
  { slug: "border-collie",  zh: "邊境牧羊犬", alias: ["邊牧"],      size: "medium" },
  { slug: "cocker",      zh: "可卡",     alias: ["可卡犬"],         size: "medium" },
  { slug: "mixed",       zh: "米克斯",   alias: ["混種", "浪浪"],   size: "medium" },
  { slug: "golden",      zh: "黃金獵犬", alias: ["黃金"],           size: "large"  },
  { slug: "labrador",    zh: "拉布拉多", alias: ["拉不拉多", "拉拉"], size: "large" },
  { slug: "husky",       zh: "哈士奇",   alias: [],                 size: "large"  },
  { slug: "akita",       zh: "秋田",     alias: ["秋田犬"],         size: "large"  },
  { slug: "german-shepherd", zh: "德國牧羊犬", alias: ["狼犬"],     size: "large"  },
  { slug: "doberman",    zh: "杜賓",     alias: [],                 size: "large"  },
];

export interface AllergenEntry {
  /** 網址用 no-chicken 這種形式，語意直接 */
  slug: string;
  protein: ProteinSource;
  zh: string;
}

export const ALLERGENS: AllergenEntry[] = [
  { slug: "no-chicken", protein: "chicken", zh: "雞肉" },
  { slug: "no-beef",    protein: "beef",    zh: "牛肉" },
  { slug: "no-lamb",    protein: "lamb",    zh: "羊肉" },
  { slug: "no-salmon",  protein: "salmon",  zh: "鮭魚" },
  { slug: "no-duck",    protein: "duck",    zh: "鴨肉" },
];

export const breedBySlug = (s: string) => BREEDS.find((b) => b.slug === s);
export const allergenBySlug = (s: string) => ALLERGENS.find((a) => a.slug === s);

/* ------------------------------------------------------------------ */

export type PageKind =
  | { kind: "breed";   breed: BreedEntry }
  | { kind: "allergen"; allergen: AllergenEntry }
  | { kind: "both";    breed: BreedEntry; allergen: AllergenEntry };

/** 把網址片段解析成頁面類型。不合法的組合回 null → 404。 */
export function resolve(slug: string[]): PageKind | null {
  if (slug.length === 1) {
    const b = breedBySlug(slug[0]);
    if (b) return { kind: "breed", breed: b };
    const a = allergenBySlug(slug[0]);
    if (a) return { kind: "allergen", allergen: a };
    return null;
  }
  if (slug.length === 2) {
    const b = breedBySlug(slug[0]);
    const a = allergenBySlug(slug[1]);
    if (b && a) return { kind: "both", breed: b, allergen: a };
  }
  return null;
}

/** 所有要靜態生成的路徑。目前 23 + 5 + 115 = 143 頁。 */
export function allPaths(): string[][] {
  const out: string[][] = [];
  for (const b of BREEDS) out.push([b.slug]);
  for (const a of ALLERGENS) out.push([a.slug]);
  for (const b of BREEDS) for (const a of ALLERGENS) out.push([b.slug, a.slug]);
  return out;
}

/** 頁面標題。寫成使用者真的會打進 Google 的樣子。 */
export function titleOf(p: PageKind): string {
  switch (p.kind) {
    case "breed":    return `${p.breed.zh}飼料怎麼選`;
    case "allergen": return `不含${p.allergen.zh}的狗飼料`;
    case "both":     return `${p.breed.zh}${p.allergen.zh}過敏，飼料怎麼選`;
  }
}

export function descriptionOf(p: PageKind, kept: number, cut: number): string {
  switch (p.kind) {
    case "breed":
      return `我們從資料庫裡刪掉 ${cut} 款不適合${p.breed.zh}的飼料，剩下 ${kept} 款，並寫清楚每一款的排除理由，以及什麼時候不要買。`;
    case "allergen":
      return `避開${p.allergen.zh}的狗飼料。刪掉 ${cut} 款含${p.allergen.zh}或營養不達標的，剩下 ${kept} 款。每款都寫清楚什麼時候不要買。`;
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
