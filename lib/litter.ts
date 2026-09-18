import type { Merchant, Price } from "./types";
import litter from "../data/cat-litter.json";

/**
 * 貓砂。
 *
 * 飼料那套 Spec（蛋白、脂肪、碳水）在這裡一格都用不上，所以型別另開。
 * 共用的是商品／賣場／價格那一層：Merchant、/go 跳轉、連結管理、維護台。
 *
 * 這個類目要回答的問題跟飼料不一樣。飼料問「牠能不能吃」，
 * 貓砂問「你家裝得下嗎、你要怎麼丟、一個月多少錢」。
 */

export type LitterMaterial =
  | "tofu"           // 豆腐砂（黃豆渣、豌豆纖維）
  | "cassava"        // 木薯砂（樹薯澱粉，也是植物纖維）
  | "mixed-plant"    // 混合砂，但成分都是植物（稻殼＋豆腐這種）
  | "mixed-mineral"  // 混合砂，裡面有礦砂
  | "mineral"        // 礦砂（膨潤土）
  | "wood"           // 木屑砂、松木砂
  | "paper"          // 紙砂
  | "zeolite"        // 沸石砂
  | "crystal";       // 水晶砂（矽膠）

export const MATERIAL_ZH: Record<LitterMaterial, string> = {
  tofu: "豆腐砂",
  cassava: "木薯砂",
  "mixed-plant": "混合砂（全植物）",
  "mixed-mineral": "混合砂（含礦砂）",
  mineral: "礦砂",
  wood: "木屑砂",
  paper: "紙砂",
  zeolite: "沸石砂",
  crystal: "水晶砂",
};

export type Flushable = "limited" | "no";

export interface LitterSpec {
  material: LitterMaterial;
  clumping: boolean;
  /** 我們的判定 */
  flushable: Flushable;
  /** 賣場或包裝上寫的（yes／no／空白＝沒寫） */
  flushClaim?: "yes" | "no";
  dust?: "low" | "medium" | "high";
  scented?: boolean;
  grain?: "fine" | "medium" | "coarse";
  deodorizer?: string;
  /** 一包多少：kg 或 L */
  packUnit?: "kg" | "L";
  packSize?: number;
  tracking?: "low" | "medium" | "high";
}

export interface LitterProduct {
  id: string;
  brand: string;
  name: string;
  spec: LitterSpec;
  note?: string;
  searchAs?: string;
  checkedAt: string;
  price: Price;
}

export const litters = litter.products as unknown as LitterProduct[];
export const litterById = (id: string): LitterProduct | undefined => litters.find((p) => p.id === id);

/* ------------------------------------------------------------------ */
/* 沖馬桶：這個類目的招牌判定                                            */
/*                                                                    */
/* 「可沖馬桶」是貓砂文案上最常見、也最容易害人的一句話。               */
/* 判準不是品牌說了算，是材質遇水會怎樣：                               */
/*   植物纖維（豆腐、稻殼、紙）遇水會散開，量少可以沖                   */
/*   木屑遇水也是散開，但體積變大、比重輕，容易在管線堆積               */
/*   礦砂（膨潤土）遇水是結成一團，而且不溶於水                        */
/*   沸石、水晶是礦物，更不用說                                        */
/*                                                                    */
/* 所以我們只給兩種答案：limited（適量可以，有條件）跟 no。            */
/* 沒有 yes —— 台灣老公寓的管線和化糞池，沒有一款貓砂可以無條件亂沖。   */
/* ------------------------------------------------------------------ */

export const FLUSH: Record<Flushable, { zh: string; fg: string; bg: string }> = {
  limited: { zh: "適量可沖", fg: "var(--warn)", bg: "var(--warn-soft)" },
  no: { zh: "不能沖", fg: "var(--cut)", bg: "var(--cut-soft)" },
};

export const FLUSH_LINE: Record<Flushable, string> = {
  limited:
    "植物纖維做的，遇水會散開。一次一小坨、沖之前先讓它泡開，老公寓、化糞池、香港式舊管線就不要冒險。整盆倒下去一定塞。",
  no: "遇水不會散開，沖下去就是在管線裡堆積。這一款只能包起來丟垃圾。",
};

/** 包裝寫可沖、實際只能適量或不能沖的，就是這個類目的「藏雞」 */
export function flushGap(p: LitterProduct): string | null {
  const { flushClaim, flushable } = p.spec;
  if (flushClaim === "yes" && flushable === "no") return "包裝寫可以沖，但這個材質沖下去不會散開。";
  if (flushClaim === "yes" && flushable === "limited") return "包裝寫可以沖，實際上是「一次一點點才可以」。";
  return null;
}

/* ------------------------------------------------------------------ */
/* 一個月多少錢                                                        */
/*                                                                    */
/* 這是貓砂唯一有意義的比較方式，因為量法根本不同：                     */
/* 礦砂論公斤、豆腐砂論公升，一包 $200 和一包 $400 完全看不出誰貴。     */
/*                                                                    */
/* 用量沒有官方標準，所以用各材質的常見用量推估，而且一定要講出來       */
/* 是推估的。寧可講「大約」，也不要給一個看起來很準的假數字。           */
/* ------------------------------------------------------------------ */

/** 一隻貓一個月大約用掉多少（公升或公斤），照材質。來源：台灣通路與品牌的建議用量整理 */
const MONTHLY_USE: Record<LitterMaterial, { kg?: number; L?: number }> = {
  tofu: { L: 18, kg: 7 },
  cassava: { L: 18, kg: 7 },
  "mixed-plant": { L: 18, kg: 7 },
  "mixed-mineral": { L: 14, kg: 8 },
  mineral: { kg: 9, L: 10 },
  wood: { kg: 6, L: 12 },
  paper: { L: 14, kg: 5 },
  zeolite: { L: 6, kg: 4 },
  crystal: { L: 8, kg: 3 },
};

/** 一隻貓一個月大概要幾包、多少錢。算不出來回 null，前端就不顯示 */
export function monthlyCost(p: LitterProduct, m: Merchant): { packs: number; cost: number } | null {
  const { packUnit, packSize, material } = p.spec;
  if (!packUnit || !packSize) return null;
  const need = MONTHLY_USE[material][packUnit];
  if (!need) return null;
  const packs = need / packSize;
  return { packs: Math.round(packs * 10) / 10, cost: Math.round(m.amount * packs) };
}

/** 一公升或一公斤多少錢 */
export function unitPriceOf(p: LitterProduct, m: Merchant): { n: number; unit: string } | null {
  const { packUnit, packSize } = p.spec;
  if (!packUnit || !packSize) return null;
  return { n: Math.round(m.amount / packSize), unit: packUnit === "kg" ? "公斤" : "公升" };
}

/** 還買得到的賣場 */
export const liveOf = (p: LitterProduct): Merchant[] => p.price.merchants.filter((m) => !m.dead);
export const buyableLitter = (p: LitterProduct): boolean => liveOf(p).length > 0;

/** 卡片上那一家：最便宜的（同一個類目裡包裝大小差很多，所以比每公升／每公斤） */
export function anchorLitter(p: LitterProduct): Merchant | undefined {
  const live = liveOf(p);
  if (live.length === 0) return undefined;
  return live.reduce((best, m) => (m.amount < best.amount ? m : best));
}
