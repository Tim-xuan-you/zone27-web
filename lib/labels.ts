import type { Product, ProteinSource } from "./types";
import { formOf } from "./engine";
import { categoryOf } from "./categories";

/**
 * 商品的幾個「給人看的說法」：肉、年齡、網址。
 * 商品頁、類目頁、裁決器的「你提到的」都用這一份，說法才會一致。
 */

const MEAT: Record<ProteinSource, string> = {
  chicken: "雞", turkey: "火雞", duck: "鴨", salmon: "鮭魚",
  // 白魚、其他魚在程式裡分開，是為了過敏排除算得準；給人看的時候都叫「魚」，跟成分表的寫法對得上
  whitefish: "魚", fish: "魚", beef: "牛", lamb: "羊", pork: "豬", venison: "鹿", insect: "昆蟲",
  poultry: "禽肉（沒寫哪種）", animal: "沒寫來源的肉或蛋白",
};

/** 「雞、火雞」 */
export function meatsOf(p: Product): string {
  return [...new Set(p.spec.proteinSources.map((k) => MEAT[k] ?? k))].join("、");
}

/** 「成犬」「幼貓專用」「7 歲以上成貓」 */
export function stageOf(p: Product): string {
  const s = p.spec.lifeStage;
  const cat = p.species === "cat";
  if (s.includes("all")) return cat ? "成貓幼貓都能吃" : "幼犬到老犬都能吃";
  if (s.length === 1 && s[0] === "puppy") return cat ? "幼貓專用" : "幼犬專用";
  if (s.length === 1 && s[0] === "senior") return cat ? "老貓專用" : "高齡犬專用";
  if (s.includes("senior") && s.includes("adult")) return cat ? "7 歲以上成貓" : "成犬、高齡犬";
  return cat ? "成貓" : "成犬";
}

/**
 * 商品頁的網址：/cat-food/p/cf-09。
 *
 * 用商品編號不用品名：品名會改（台灣通路常改名），編號不會，
 * 網址一變，搜尋引擎累積的東西就歸零。品名放在標題和 H1 就夠了。
 */
export function productHref(p: Pick<Product, "id" | "species" | "form">): string {
  return `/${categoryOf(p.species, formOf(p as Product)).slug}/p/${p.id}`;
}
