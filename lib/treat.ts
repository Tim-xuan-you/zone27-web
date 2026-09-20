import type { Merchant, Price, ProteinSource, Species } from "./types";
import { dedupeMerchants, mer } from "./engine";
import treat from "../data/cat-treat.json";
import dogTreat from "../data/dog-treat.json";

/**
 * 貓零食。
 *
 * 這個類目只回答一個問題：**這包零食，一天可以給幾條。**
 *
 * 包裝上不會寫。獸醫的通則是零食不超過一天熱量的 10%，
 * 一隻 4 公斤的成貓一天大約 200 大卡，零食上限就是 20 大卡。
 * CIAO 一般肉泥一條 7 大卡，兩條就到頂；綜合營養配方一條 13 大卡，一條半就滿了。
 *
 * 很多人一天給五六條，還在問貓為什麼胖。這就是這個類目存在的理由。
 */

export type TreatForm = "puree" | "freezeDried" | "stick" | "biscuit" | "dental";

export const FORM_ZH: Record<TreatForm, string> = {
  puree: "肉泥",
  freezeDried: "凍乾",
  stick: "肉條",
  biscuit: "餅乾",
  dental: "潔牙骨",
};

export interface TreatSpec {
  form: TreatForm;
  /** 一條、一顆幾大卡。有公布才填 */
  kcalPer?: number;
  /** 每 100 克幾大卡。凍乾論克賣，用這個 */
  kcalPer100g?: number;
  /** 條、顆、片 */
  unitZh?: string;
  /** 一包幾條 */
  piecesPerPack?: number;
  /** 一包幾克 */
  packG?: number;
  /** 水分 %。肉泥的關鍵數字 */
  moisture?: number;
  protein?: number;
  proteins: ProteinSource[];
  /** 增稠劑、調味料、色素這些，照標示原文列 */
  additives?: string;
  /** 綜合營養食／完整均衡，可以當主食 */
  completeFood: boolean;
  /** 品牌自己標的適用體重（公斤）。潔牙骨一定會標，肉泥不一定 */
  forKgFrom?: number;
  forKgTo?: number;
  /** 品牌自己寫的一天幾支 */
  brandPerDay?: number;
}

export interface TreatProduct {
  id: string;
  species: Species;
  brand: string;
  brand2?: string;
  name: string;
  spec: TreatSpec;
  note?: string;
  searchAs?: string;
  checkedAt: string;
  price: Price;
}

/**
 * 貓零食跟狗零食共用同一套算法（10% 規則），所以放同一個陣列，用 species 分。
 * 分開寫兩份 lib 只會讓兩邊的公式慢慢走鐘。
 */
export const treats = [
  ...(treat.products as unknown as TreatProduct[]),
  ...(dogTreat.products as unknown as TreatProduct[]),
];
export const treatsOf = (species: Species): TreatProduct[] => treats.filter((p) => p.species === species);
export const treatById = (id: string): TreatProduct | undefined => treats.find((p) => p.id === id);

/* ------------------------------------------------------------------ */
/* 一天可以給幾條                                                       */
/* ------------------------------------------------------------------ */

/**
 * 沒講體重就照這個算，而且畫面上一定要講出來。
 * 貓 4 公斤（台灣米克斯的中位），狗 12 公斤（中型米克斯）。
 */
export const DEFAULT_KG: Record<Species, number> = { cat: 4, dog: 12 };
/** 舊名字，貓那幾頁還在用 */
export const DEFAULT_CAT_KG = DEFAULT_KG.cat;

/** 一天總共可以吃幾大卡 */
export const dailyKcal = (kg: number, species: Species = "cat"): number =>
  Math.round(mer(kg, "adultFixed", species));

/**
 * 零食一天的上限：總熱量的 10%。
 *
 * 這是獸醫營養學的通則（10% rule）：零食超過一成，主食的營養比例就被稀釋了。
 * 我們把它寫死成 10%，不讓讀者調 —— 可以調的數字就不是建議，是藉口。
 */
export const treatKcalCap = (kg: number, species: Species = "cat"): number =>
  Math.round(dailyKcal(kg, species) * 0.1);

export interface DailyLimit {
  /** 幾條、幾顆。整數 —— 沒有人會撕四成條肉泥給貓 */
  pieces?: number;
  /** 幾公克 */
  grams?: number;
  unitZh: string;
  /** 這個上限等於幾大卡 */
  kcal: number;
  /** 畫面上講的那一句：「3 條」「6 公克」「不到 1 條」 */
  label: string;
}

/**
 * 一天最多能給多少。算不出來（沒公布熱量）回 null，畫面上就誠實說沒公布。
 *
 * 論條賣的一律無條件捨去。24 大卡除以一條 7 大卡是 3.4 條，
 * 但沒有人會撕零點四條肉泥，寫 3.4 只會讓人四捨五入成 4 條，反而超標。
 * 不到一條的就說不到一條，不要寫 0。
 */
export function dailyLimit(p: TreatProduct, kg: number = DEFAULT_KG[p.species]): DailyLimit | null {
  const cap = treatKcalCap(kg, p.species);
  const { kcalPer, kcalPer100g, unitZh } = p.spec;
  if (kcalPer) {
    const u = unitZh ?? "條";
    const exact = cap / kcalPer;
    const pieces = Math.floor(exact);
    return { pieces, unitZh: u, kcal: cap, label: pieces >= 1 ? `${pieces} ${u}` : `不到 1 ${u}` };
  }
  if (kcalPer100g) {
    const grams = Math.round((cap / kcalPer100g) * 100);
    return { grams, unitZh: "公克", kcal: cap, label: `${grams} 公克` };
  }
  return null;
}

/** 一包可以給幾天。照上面那個上限算，不照小數，講出來的數字要跟畫面一致 */
export function packDays(p: TreatProduct, kg: number = DEFAULT_KG[p.species]): number | null {
  const limit = dailyLimit(p, kg);
  if (!limit) return null;
  if (limit.pieces && limit.pieces >= 1 && p.spec.piecesPerPack) {
    return Math.max(1, Math.round(p.spec.piecesPerPack / limit.pieces));
  }
  if (limit.grams && p.spec.packG) return Math.max(1, Math.round(p.spec.packG / limit.grams));
  return null;
}

/** 一般肉泥跟綜合營養配方的落差：同一個牌子，後者一條的熱量快兩倍 */
export function pureeSpread(): { plain: TreatProduct; complete: TreatProduct } | null {
  const cats = treatsOf("cat");
  const plain = cats.find((p) => p.spec.form === "puree" && !p.spec.completeFood && p.spec.kcalPer);
  const complete = cats.find((p) => p.spec.form === "puree" && p.spec.completeFood && p.spec.kcalPer);
  return plain && complete ? { plain, complete } : null;
}

/** 還買得到的賣場 */
export const liveOf = (p: TreatProduct): Merchant[] =>
  dedupeMerchants(p.price.merchants.filter((m) => !m.dead));
export const buyableTreat = (p: TreatProduct): boolean => liveOf(p).length > 0;

/** 卡片上那一家：最便宜的 */
export function anchorTreat(p: TreatProduct): Merchant | undefined {
  const live = liveOf(p);
  if (live.length === 0) return undefined;
  return live.reduce((best, m) => (m.amount < best.amount ? m : best));
}

/**
 * 天天給到上限，一個月多少錢。
 *
 * 這是這個類目真正會讓人停下來的那個數字。
 * CIAO 一條 $11，一天可以給 3 條 —— 聽起來很便宜，
 * 乘上三十天是一千塊，比很多人家的貓一個月的飼料錢還高。
 *
 * 講清楚是「天天給到上限」的價，不是建議。多數人不會天天給滿。
 */
export function monthlyAtCap(p: TreatProduct, m: Merchant, kg: number = DEFAULT_KG[p.species]): number | null {
  const limit = dailyLimit(p, kg);
  if (!limit) return null;
  if (limit.pieces && limit.pieces >= 1 && p.spec.piecesPerPack) {
    return Math.round(limit.pieces * (m.amount / p.spec.piecesPerPack) * 30);
  }
  if (limit.grams && p.spec.packG) {
    return Math.round(limit.grams * (m.amount / p.spec.packG) * 30);
  }
  return null;
}

/** 名字寫魚、成分有雞的那種（跟飼料的藏雞同一件事） */
export function hiddenChicken(p: TreatProduct): boolean {
  return p.spec.proteins.includes("chicken") && !/(?<!火)雞/.test(p.name);
}

/* ------------------------------------------------------------------ */
/* 狗零食問的是另一個問題                                               */
/*                                                                    */
/* 貓零食問「一天可以給幾條」，因為肉泥一條七大卡，給得完。             */
/* 狗的潔牙骨不一樣：品牌自己就寫「一天一支」，一支八十八大卡，         */
/* 問題不是能給幾支，是那一支已經佔掉多少。                             */
/* ------------------------------------------------------------------ */

/**
 * 一支佔一天零食額度的百分之幾。
 *
 * 超過 100 就代表光那一支就吃完整天的額度，還超出去。
 * Greenies 自己在包裝上寫「每餵一支，把正餐扣掉 88 大卡」，
 * 所以品牌是知道的。知道的人只有品牌跟我們。
 */
export function budgetShare(p: TreatProduct, kg: number): number | null {
  const kcal = p.spec.kcalPer;
  if (!kcal) return null;
  const cap = treatKcalCap(kg, p.species);
  if (cap <= 0) return null;
  return Math.round((kcal / cap) * 100);
}

/** 照品牌自己標的體重下限算 —— 那是最輕、額度最小的那隻狗，也是最容易超標的 */
export function shareAtLowEnd(p: TreatProduct): { kg: number; share: number } | null {
  const kg = p.spec.forKgFrom;
  if (!kg) return null;
  const share = budgetShare(p, kg);
  return share === null ? null : { kg, share };
}
