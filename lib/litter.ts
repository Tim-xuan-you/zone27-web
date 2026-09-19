import type { Merchant, Price } from "./types";
import { dedupeMerchants } from "./engine";
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
    "植物纖維做的，遇水會散開。一次一小坨、沖之前先讓它泡開。老公寓、化糞池、管徑小的就不要冒險，整盆倒下去一定塞。",
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

/**
 * 這一條連結實際買到多少：「1.25kg×8」是 10 公斤，不是 1.25 公斤。
 *
 * 蝦皮很多貓砂賣場設最低購買量（8 包、6 包），我們照整組登記。
 * 不把「×8」算進去的話，每公斤會算成八倍貴，一個月多少錢也跟著錯。
 */
export function sizeOf(p: LitterProduct, m: Merchant): { total: number; unit: "kg" | "L"; packs: number } | null {
  const raw = (m.unit || p.price.unit || "").replace(/\s/g, "");
  const hit = raw.match(/^(\d+(?:\.\d+)?)(kg|KG|Kg|L|l|公斤|公升)(?:[×xX*](\d+))?/);
  if (hit) {
    const size = parseFloat(hit[1]);
    const unit: "kg" | "L" = /kg|公斤/i.test(hit[2]) ? "kg" : "L";
    const packs = hit[3] ? parseInt(hit[3], 10) : 1;
    return { total: size * packs, unit, packs };
  }
  const { packUnit, packSize } = p.spec;
  return packUnit && packSize ? { total: packSize, unit: packUnit, packs: 1 } : null;
}

/** 一隻貓一個月大概要用多少、多少錢。算不出來回 null，前端就不顯示 */
export function monthlyCost(p: LitterProduct, m: Merchant): { use: number; unit: string; cost: number } | null {
  const s = sizeOf(p, m);
  if (!s) return null;
  const need = MONTHLY_USE[p.spec.material][s.unit];
  if (!need) return null;
  return {
    use: need,
    unit: s.unit === "kg" ? "公斤" : "公升",
    cost: Math.round((m.amount / s.total) * need),
  };
}

/** 一公升或一公斤多少錢（整組的話先除以總量） */
export function unitPriceOf(p: LitterProduct, m: Merchant): { n: number; unit: string } | null {
  const s = sizeOf(p, m);
  if (!s) return null;
  return { n: Math.round(m.amount / s.total), unit: s.unit === "kg" ? "公斤" : "公升" };
}

/** 還買得到的賣場 */
export const liveOf = (p: LitterProduct): Merchant[] =>
  dedupeMerchants(p.price.merchants.filter((m) => !m.dead));
export const buyableLitter = (p: LitterProduct): boolean => liveOf(p).length > 0;

/**
 * 卡片上那一家。
 *
 * 不能照標價挑。貓砂的包裝差太多：一包 7L $249、兩包 5.4kg $399，
 * 標價便宜的那個其實每公斤貴兩成。而且有的賣場最低要買 8 包。
 *
 * 所以照「一個月要花多少」挑 —— 那是讀者真正付出去的錢，
 * 也是公升跟公斤唯一能放在一起比的方式。算不出月花費的（規格看不懂），才退回比標價。
 */
export function anchorLitter(p: LitterProduct): Merchant | undefined {
  const live = liveOf(p);
  if (live.length === 0) return undefined;
  /* 一度改成「不超過最便宜那個三倍」，想避免叫人第一次就搬二十五公斤回家。
     結果是錯的：艾可在一家店六包 $768（一個月 $329），另一家單包 $179（一個月 $460），
     六包被那條規則擋掉之後，整站就變成用 $460 幫艾可排名，
     還會排到比較貴的混合砂後面 —— 多了一個便宜的小包裝，反而讓這款看起來變貴。

     所以回到最單純的那條：一個月最便宜的就是它。
     整箱的價錢會嚇到人是真的，解法是把買法全部列在按鈕下面、
     每一種都標「一個月多多少」，不是偷偷換一個比較貴的答案。 */
  return live.reduce((best, m) => {
    const a = monthlyCost(p, m)?.cost, b = monthlyCost(p, best)?.cost;
    if (a !== undefined && b !== undefined) return a < b ? m : best;
    return m.amount < best.amount ? m : best;
  });
}
