import type { Species } from "./types";

/**
 * 類目登記表。
 *
 * 導覽列、首頁的類目卡、sitemap、匯入程式、維護台，全部從這一份讀。
 * 加第三個類目的時候，改這裡加一筆，其他地方跟著長出來。
 * 散在各頁各寫一份的話，一定有一頁會忘記改 —— 狗飼料時代踩過太多次了。
 */

export type CategorySlug = "dog-food" | "cat-food";

export interface Category {
  slug: CategorySlug;
  species: Species;
  /** 「狗飼料」 */
  zh: string;
  /** 「狗」 */
  animal: string;
  /** 商品編號的前綴：df-01、cf-01。paste 靠這個判斷要寫進哪一份 CSV */
  idPrefix: string;
  /** 蝦皮 Sub id 第二格。只收英數字 */
  subId: string;
  csv: string;
  json: string;
  /** 首頁卡片上那一句 */
  pitch: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "dog-food",
    species: "dog",
    zh: "狗飼料",
    animal: "狗",
    idPrefix: "df",
    subId: "dogfood",
    csv: "data/dog-food.csv",
    json: "data/dog-food.json",
    pitch: "過敏、軟便、變胖、幼犬老犬，先刪掉不適合的。",
  },
  {
    slug: "cat-food",
    species: "cat",
    zh: "貓飼料",
    animal: "貓",
    idPrefix: "cf",
    subId: "catfood",
    csv: "data/cat-food.csv",
    json: "data/cat-food.json",
    pitch: "寫著鮭魚、鴨肉、火雞的，成分表前幾項常常就有雞。我們一款一款讀過。",
  },
];

export const categoryOf = (species: Species): Category =>
  CATEGORIES.find((c) => c.species === species) ?? CATEGORIES[0];

export const categoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug);

export const categoryOfId = (productId: string): Category | undefined =>
  CATEGORIES.find((c) => productId.startsWith(c.idPrefix + "-"));

/**
 * 可以推薦的款數到這個數字，類目才算正式開張。
 *
 * 少於這個數，任何一條規則一刪就見底，裁決器會變成「都不合適」產生器。
 * 那比「還在準備」更傷信任。所以沒到之前，裁決器誠實講還在上架，
 * 長尾頁也先不產生（產生出來只會是一堆空頁，Google 會記得）。
 */
export const MIN_LIVE = 5;
