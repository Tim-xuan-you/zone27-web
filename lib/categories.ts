import type { Form, Species } from "./types";

/**
 * 類目登記表。
 *
 * 導覽列、首頁的類目卡、sitemap、匯入程式、維護台，全部從這一份讀。
 * 加新類目的時候，改這裡加一筆，其他地方跟著長出來。
 * 散在各頁各寫一份的話，一定有一頁會忘記改 —— 狗飼料時代踩過太多次了。
 *
 * 類目不等於物種：貓有乾糧也有主食罐。所以一個類目是「物種 + 形態」。
 * 同一個物種有兩個以上的類目時，導覽列先分狗、貓，再進去分類目 ——
 * 類目會一直加，導覽列不能跟著一直變長。
 */

export type CategorySlug = "dog-food" | "cat-food" | "cat-wet-food";

export interface Category {
  slug: CategorySlug;
  species: Species;
  form: Form;
  /** 「狗飼料」「貓主食罐」 */
  zh: string;
  /** 放在動物頁裡的短名：「乾糧」「主食罐」 */
  short: string;
  /** 「狗」 */
  animal: string;
  /** 商品編號的前綴：df-01、cf-01、cw-01。paste 靠這個判斷要寫進哪一份 CSV */
  idPrefix: string;
  /** 蝦皮 Sub id 第二格。只收英數字 */
  subId: string;
  csv: string;
  json: string;
  /** 首頁卡片上那一句 */
  pitch: string;
  /** 還在上架時，裁決器「先看我們讀過的」那一句 */
  soonNote: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "dog-food",
    species: "dog",
    form: "dry",
    zh: "狗飼料",
    short: "飼料",
    animal: "狗",
    idPrefix: "df",
    subId: "dogfood",
    csv: "data/dog-food.csv",
    json: "data/dog-food.json",
    pitch: "過敏、軟便、變胖、幼犬老犬，先刪掉不適合的。",
    soonNote: "讀完的那幾款先整理在下面這頁，每一款什麼時候不要買都寫了。",
  },
  {
    slug: "cat-food",
    species: "cat",
    form: "dry",
    zh: "貓飼料",
    short: "乾糧",
    animal: "貓",
    idPrefix: "cf",
    subId: "catfood",
    csv: "data/cat-food.csv",
    json: "data/cat-food.json",
    pitch: "寫著鮭魚、鴨肉、火雞的，成分表前幾項常常就有雞。我們一款一款讀過。",
    soonNote: "讀完的那幾款先整理在下面這頁，哪些名字寫鮭魚、鴨肉，成分表裡卻有雞，都標出來了。",
  },
  {
    slug: "cat-wet-food",
    species: "cat",
    form: "wet",
    zh: "貓主食罐",
    short: "主食罐",
    animal: "貓",
    idPrefix: "cw",
    subId: "catwet",
    csv: "data/cat-wet-food.csv",
    json: "data/cat-wet-food.json",
    pitch: "先分主食罐跟副食罐，再看第一項是不是雞湯。魚口味的罐頭，很多是用雞湯煮的。",
    soonNote: "讀完的那幾款先整理在下面這頁，哪些是副食罐、哪些名字寫魚卻用雞湯煮，都標出來了。",
  },
];

export const categoryOf = (species: Species, form: Form = "dry"): Category =>
  CATEGORIES.find((c) => c.species === species && c.form === form) ??
  CATEGORIES.find((c) => c.species === species) ??
  CATEGORIES[0];

export const categoriesOf = (species: Species): Category[] =>
  CATEGORIES.filter((c) => c.species === species);

export const categoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug);

export const categoryOfId = (productId: string): Category | undefined =>
  CATEGORIES.find((c) => productId.startsWith(c.idPrefix + "-"));

/* ------------------------------------------------------------------ */
/* 動物                                                                */
/* ------------------------------------------------------------------ */

export const ANIMALS: { species: Species; zh: string }[] = [
  { species: "dog", zh: "狗" },
  { species: "cat", zh: "貓" },
];

/**
 * 導覽列上「狗」「貓」要連到哪。
 *
 * 只有一個類目就直接進那個類目，不要多一層只有一張卡片的頁面。
 * 兩個以上才進動物頁（/cat），在那裡選乾糧還是主食罐。
 * 狗哪天有了第二個類目，要記得加 app/dog/page.tsx（照 app/cat/page.tsx 寫）。
 */
export const animalHref = (species: Species): string => {
  const cs = categoriesOf(species);
  return cs.length > 1 ? `/${species}` : `/${cs[0].slug}`;
};

/**
 * 可以推薦的款數到這個數字，類目才算正式開張。
 *
 * 少於這個數，任何一條規則一刪就見底，裁決器會變成「都不合適」產生器。
 * 那比「還在準備」更傷信任。所以沒到之前，裁決器誠實講還在上架，
 * 長尾頁也先不產生（產生出來只會是一堆空頁，Google 會記得）。
 */
export const MIN_LIVE = 5;
