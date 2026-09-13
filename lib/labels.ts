import type { Product, ProteinSource } from "./types";
import { anchorOf, formOf, pricePerKg, unitOf } from "./engine";
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
  return meatsFrom(p.spec.proteinSources);
}

/** 查藏雞頁只讀了成分表的那些款，沒有完整的商品資料，直接給肉的清單 */
export function meatsFrom(sources: ProteinSource[]): string {
  return [...new Set(sources.map((k) => MEAT[k] ?? k))].join("、");
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
 * 這一款適合誰。全部從規格和價格算出來，沒有一句是形容詞。
 *
 * 以前卡片上只有「什麼時候不要買」，那是信任的來源，但只講缺點，
 * 讀者看完知道不要買什麼，還是不知道這一包是給誰的。
 * 兩邊都講（雙面訊息）比只講優點可信，也比只講缺點好下決定。
 * 最多三點，挑最有區別的。
 */
export function fitFor(p: Product): string[] {
  const out: string[] = [];
  const src = p.spec.proteinSources;
  const cat = p.species === "cat";
  const wet = formOf(p) === "wet";
  if (!src.includes("chicken") && !src.includes("poultry") && !src.includes("animal")) out.push("想避開雞肉");
  if (p.spec.singleSource) out.push(`要排查過敏原（肉只有${meatsOf(p)}一種）`);
  const s = p.spec.lifeStage;
  if (s.length === 1 && s[0] === "puppy") out.push(cat ? "幼貓" : "幼犬");
  if (s.length === 1 && s[0] === "senior") out.push(cat ? "老貓" : "高齡犬");
  if (!cat && p.spec.bodySize.length === 1 && p.spec.bodySize[0] === "small") out.push("小型犬");
  if (!wet && p.spec.kcal && p.spec.kcal < 3500) out.push("容易胖的（熱量偏低）");
  if (wet && p.spec.kcal && p.spec.kcal < 800) out.push("要控制體重（一罐熱量低）");
  if (!wet && p.spec.carb <= 22) out.push(`想吃低碳水（碳水 ${p.spec.carb}%）`);
  const m = anchorOf(p, "safe");
  const per = m && !wet ? pricePerKg(unitOf(p, m), m.amount) : null;
  if (per && per <= 450) out.push(`預算有限（每公斤 ${per} 元）`);
  return out.slice(0, 3);
}

/** 購買連結是哪個平台，按鈕上講「去蝦皮看」比講賣家名字好懂 */
export function platformOf(url: string): string | null {
  return /(^|\.)shopee\.tw/.test((() => { try { return new URL(url).hostname; } catch { return ""; } })()) ? "蝦皮" : null;
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
