import { adjudicate, passes } from "./engine";
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

/* ------------------------------------------------------------------ */
/* 該補什麼                                                            */
/*                                                                    */
/* 維護台原本只講「要修什麼」，那是守。但一個人的時間有限，           */
/* 更該知道的是「下一款該進什麼」—— 那是攻。                          */
/*                                                                    */
/* 這件事其實算得出來：把全站每一種組合跑一遍，看哪幾頁只剩兩三款。   */
/* 那些頁面有人搜、有排名，卻給不出像樣的選擇 —— 流量進來了，        */
/* 我們卻沒東西可以推。那就是最該補貨的位置。                          */
/* ------------------------------------------------------------------ */

export interface Gap {
  slug: string[];
  title: string;
  survivors: number;
  /** 越小越急 */
  severity: 0 | 1 | 2;
}

/** 結果太少的頁面。survivors 少於這個數就算薄。 */
export const THIN = 3;

export function gaps(pool: Product[] = catalog): Gap[] {
  const out: Gap[] = [];

  for (const slug of allPaths()) {
    const p = resolve(slug);
    if (!p) continue;

    const situation = situationOf(p);
    situation.constraints = constraintsFor(situation);
    const v = adjudicate(pool, situation);
    if (v.survivors.length >= THIN) continue;

    const zh =
      p.kind === "breed" ? p.breed.zh
      : p.kind === "allergen" ? `不含${p.allergen.zh}`
      : `${p.breed.zh}・避${p.allergen.zh}`;

    out.push({
      slug,
      title: zh,
      survivors: v.survivors.length,
      severity: v.survivors.length === 0 ? 0 : v.survivors.length === 1 ? 1 : 2,
    });
  }

  return out.sort((a, b) => a.severity - b.severity || a.title.localeCompare(b.title));
}

/**
 * 哪個過敏原最缺貨。
 *
 * 「柴犬・避鮭魚」跟「貴賓・避鮭魚」薄，是同一個原因 ——
 * 避鮭魚的選擇本來就少。所以要往上收斂到過敏原層級，
 * 才知道該去補哪一種蛋白源的飼料，而不是一頁一頁看。
 */
export function gapsByAllergen(pool: Product[] = catalog): { zh: string; thin: number; worst: number }[] {
  const acc = new Map<string, { thin: number; worst: number }>();

  for (const g of gaps(pool)) {
    const m = g.title.match(/避(.+)$/) ?? g.title.match(/^不含(.+)$/);
    if (!m) continue;
    const key = m[1];
    const cur = acc.get(key) ?? { thin: 0, worst: 99 };
    acc.set(key, { thin: cur.thin + 1, worst: Math.min(cur.worst, g.survivors) });
  }

  return [...acc].map(([zh, v]) => ({ zh, ...v })).sort((a, b) => b.thin - a.thin);
}

/* ------------------------------------------------------------------ */
/* 刪太少                                                              */
/*                                                                    */
/* 這個站的說服力來自「我們刪掉了什麼」。六款進去刪一款，剩五款 ——   */
/* 那個刪除過程看起來就像在演，因為它確實沒做什麼事。                 */
/*                                                                    */
/* 原因是選品全部同一種：低敏、單一蛋白、無穀。它們互相之間沒有       */
/* 對比，所以任何條件都刪不掉東西。                                    */
/*                                                                    */
/* 也就是說，下一批該補的**不是更多「好的」，是會被刪掉的那些** ——   */
/* 主流雞肉配方、高碳水平價糧、幼犬糧、高齡腎臟配方。                 */
/* 沒有被刪掉的東西，「刪掉」這件事就不值錢。                          */
/* ------------------------------------------------------------------ */

export interface WeakPage {
  slug: string[];
  title: string;
  start: number;
  survivors: number;
  /** 留下來的比例。越高代表這一頁的排除幾乎沒作用 */
  keepRate: number;
}

/** 留超過這個比例，就算「這一頁沒刪到什麼」。 */
export const WEAK_KEEP_RATE = 0.7;

export function weakPages(pool: Product[] = catalog): WeakPage[] {
  const out: WeakPage[] = [];

  for (const slug of allPaths()) {
    const p = resolve(slug);
    if (!p) continue;

    const situation = situationOf(p);
    situation.constraints = constraintsFor(situation);
    const v = adjudicate(pool, situation);
    if (v.startCount === 0) continue;

    const keepRate = v.survivors.length / v.startCount;
    if (keepRate < WEAK_KEEP_RATE) continue;

    const zh =
      p.kind === "breed" ? p.breed.zh
      : p.kind === "allergen" ? `不含${p.allergen.zh}`
      : `${p.breed.zh}・避${p.allergen.zh}`;

    out.push({ slug, title: zh, start: v.startCount, survivors: v.survivors.length, keepRate });
  }

  return out.sort((a, b) => b.keepRate - a.keepRate);
}

/** 全站平均刪掉幾成 —— 一個數字看出裁決器有沒有在做事。 */
export function overallCutRate(pool: Product[] = catalog): { pages: number; avgKeep: number } {
  let sum = 0, n = 0;
  for (const slug of allPaths()) {
    const p = resolve(slug);
    if (!p) continue;
    const situation = situationOf(p);
    situation.constraints = constraintsFor(situation);
    const v = adjudicate(pool, situation);
    if (v.startCount === 0) continue;
    sum += v.survivors.length / v.startCount;
    n++;
  }
  return { pages: n, avgKeep: n ? sum / n : 0 };
}

/* ------------------------------------------------------------------ */
/* 規則稽核                                                            */
/*                                                                    */
/* 一條從來沒刪掉任何東西的規則，等於不存在 —— 而使用者看到的          */
/* 「怎麼刪的」就會是一張空表。                                        */
/*                                                                    */
/* 這張稽核表回答的是：每一條規則，在現有選品裡刪得掉幾款？           */
/* 全部是 0 的那幾條，代表**選品缺了那條規則本來要擋的東西**。         */
/* 那就是下一批該補的方向 —— 不是更多「好的」，是會被刪掉的那些。     */
/* ------------------------------------------------------------------ */

export interface RuleRow {
  rule: string;
  /** 這條規則在現有選品裡刪得掉幾款 */
  catches: number;
  /** 補什麼進來這條規則才有作用 */
  need: string;
}

/**
 * 每條規則在現有選品裡刪得掉幾款。
 *
 * 舊版是一張手寫的陣列 —— 結果它列了「體型不符」這條，
 * 而裁決器當時根本沒有實作那條規則。**一張會說謊的稽核表比沒有更糟。**
 *
 * 現在改成從 constraintsFor() 產生：先組一個會觸發所有規則的情境
 * （小型成犬、避雞、腎臟、有預算），拿到真正的規則清單，再一條一條
 * 去數它刪得掉幾款。規則沒實作，這張表就不會有那一行。
 */
export function ruleAudit(pool: Product[] = catalog): RuleRow[] {
  const probe: Situation = {
    species: "dog",
    breed: "柴犬",
    bodySize: "small",
    ageYears: 3,
    avoid: ["chicken"],
    symptoms: ["腎臟"],
    budgetMonthly: 3000,
    constraints: [],
  };
  probe.constraints = constraintsFor(probe);

  return probe.constraints
    .map((c) => ({
      rule: c.label,
      catches: pool.filter((p) => !passes(p, c)).length,
      need: NEED[c.kind] ?? "補一款會被這條規則擋下來的商品",
    }))
    .sort((a, b) => a.catches - b.catches);
}

/** 某條規則刪不到任何東西時，要補什麼進來它才有作用 */
const NEED: Record<string, string> = {
  excludeProtein: "主流雞肉配方（低敏族群最常誤買的那種）",
  lifeStage: "成犬專用或幼犬專用配方（現在多數標 all，這一刀砍不到東西）",
  bodySize: "大型犬專用配方（顆粒大、熱量密度不同）",
  minProtein: "平價高碳水糧（超市那種）",
  maxCarb: "平價高碳水糧，碳水要真的超過 48%",
  maxPhosphorus: "低磷配方 —— 目前十款都是 1.1–1.2%，控磷的人一款都選不到",
  maxMonthly: "更貴的款，不然預算這一刀永遠砍不到",
  inStock: "（這條是保險絲，平常本來就該是 0）",
};
