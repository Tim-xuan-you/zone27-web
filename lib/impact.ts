import { adjudicate } from "./engine";
import { catalog, constraintsFor } from "./catalog";
import { allPaths, resolve, type PageKind } from "./slugs";
import type { Product, Situation } from "./types";

/**
 * 哪幾款其實在撐這個網站。
 *
 * ------------------------------------------------------------------
 * 這是為了「一個人管不完幾百款」寫的。
 * ------------------------------------------------------------------
 *
 * 事實是：裁決器一次只給一個答案 + 幾個備選。所以商品一多，
 * 絕大多數的款根本不會出現在任何人的畫面上 ——
 * **那些款的價格複不複查，沒有人會知道，也沒有人會受影響。**
 *
 * 所以維護不該平均分配。把每一款跑過全站每一種組合，數它：
 *   · 當過幾次「買這個」   → 這是真正在賺錢、也真正會出錯的那幾款
 *   · 進過幾次備選清單     → 有人看得到，但不是主打
 *   · 一次都沒活下來       → 先放著，等它有機會被推薦再說
 *
 * 這個數字讓「今天要處理什麼」從一份清單變成一份**排序過的**清單。
 * 一百款裡真正天天要顧的，通常不到三十款。
 */

function situationOf(p: PageKind): Situation {
  const breed = p.kind === "allergen" ? undefined : p.breed;
  const allergen = p.kind === "breed" ? undefined : p.allergen;
  return {
    species: "dog",
    breed: breed?.zh,
    ageYears: 3,
    avoid: allergen ? [allergen.protein] : [],
    symptoms: [],
    constraints: [],
  };
}

export interface Impact {
  /** 當過幾次「買這個」 */
  picks: number;
  /** 出現在幾個頁面的結果裡（含當主答案） */
  appears: number;
  /** 全站總頁數，給前端算比例 */
  totalPages: number;
  tier: "主力" | "會被看到" | "目前沒機會";
}

/**
 * 跑完全站每一個決策組合，統計每一款的曝光。
 *
 * 149 個組合 × 幾款商品，是純記憶體運算，建置時跑一次就好 ——
 * 不值得為它建快取，那只會多一個會過期的東西。
 */
export function impactMap(pool: Product[] = catalog): Map<string, Impact> {
  const paths = allPaths();
  const picks = new Map<string, number>();
  const appears = new Map<string, number>();

  for (const slug of paths) {
    const p = resolve(slug);
    if (!p) continue;

    const situation = situationOf(p);
    situation.constraints = constraintsFor(situation);
    const v = adjudicate(pool, situation);

    if (v.pick) picks.set(v.pick.id, (picks.get(v.pick.id) ?? 0) + 1);
    for (const s of v.survivors) {
      appears.set(s.id, (appears.get(s.id) ?? 0) + 1);
    }
  }

  const out = new Map<string, Impact>();
  for (const prod of pool) {
    const pk = picks.get(prod.id) ?? 0;
    const ap = appears.get(prod.id) ?? 0;
    out.set(prod.id, {
      picks: pk,
      appears: ap,
      totalPages: paths.length,
      tier: pk > 0 ? "主力" : ap > 0 ? "會被看到" : "目前沒機會",
    });
  }
  return out;
}

/** 維護優先度：主力最高。同一級再看多久沒複查。 */
export const TIER_WEIGHT: Record<Impact["tier"], number> = {
  主力: 0,
  會被看到: 1,
  目前沒機會: 2,
};
