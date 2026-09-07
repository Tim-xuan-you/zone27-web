import type {
  Constraint, Cut, Merchant, Product, Situation, Verdict,
} from "./types";

/**
 * 排除引擎。
 *
 * 這是整個網站的核心，而它的重點不是「挑出最好的」，
 * 是「說清楚為什麼刪掉其他的」。
 *
 * 兩條鐵律：
 *   1. 排序演算法不得讀取 merchant.commission。永遠不行。
 *      揭露頁另外算，那是稽核用途。
 *   2. 每一款被刪掉，都必須歸因到「一條」規則，而且是第一條擋下它的。
 *      這樣裁決過程的數字才會加得起來，使用者才信。
 */

/** 單一約束的判定。回傳 true 代表「通過」，false 代表「被這條刪掉」。 */
function passes(p: Product, c: Constraint): boolean {
  switch (c.kind) {
    case "excludeProtein":
      return !p.spec.proteinSources.includes(c.value);
    case "minProtein":
      return p.spec.protein >= c.value;
    case "maxCarb":
      return p.spec.carb <= c.value;
    case "maxPhosphorus":
      return p.spec.phosphorus <= c.value;
    case "lifeStage":
      return p.spec.lifeStage.includes(c.value) || p.spec.lifeStage.includes("all");
    case "bodySize":
      return p.spec.bodySize.includes(c.value);
    case "singleSourceOnly":
      return p.spec.singleSource;
    case "grainFreeOnly":
      return p.spec.grainFree;
    case "inStock":
      return !p.discontinued;
    case "maxMonthly":
      return cheapest(p) <= c.value;
  }
}

/** 最低價通路的售價。 */
export function cheapest(p: Product): number {
  return Math.min(...p.price.merchants.map((m) => m.amount));
}

/** 指定錨點角色的通路。找不到就退回第一個。 */
export function anchorOf(p: Product, role: "safe" | "value") {
  return p.price.merchants.find((m) => m.anchor === role) ?? p.price.merchants[0];
}

/**
 * 跑一次裁決。
 * 約束按傳入順序套用 —— 順序會直接變成畫面上「怎麼刪的」那一段，
 * 所以呼叫端要把最重要、最切身的規則放前面（通常是過敏原）。
 */
export function adjudicate(pool: Product[], situation: Situation): Verdict {
  const startCount = pool.length;
  const cuts: Cut[] = [];
  let alive = pool;

  for (const c of situation.constraints) {
    const kept: Product[] = [];
    const dropped: Product[] = [];

    for (const p of alive) {
      (passes(p, c) ? kept : dropped).push(p);
    }

    // 沒刪到任何東西的規則不佔畫面。使用者只想看真的有作用的那幾條。
    if (dropped.length > 0) {
      cuts.push({
        count: dropped.length,
        why: c.label,
        tag: c.tag,
        ids: dropped.map((p) => p.id),
      });
    }
    alive = kept;
  }

  const { pick, reason } = choose(alive, situation);

  return { startCount, cuts, survivors: alive, pick, pickReason: reason };
}

/**
 * 從存活者裡挑一款推薦。
 *
 * 評分只看四件事，佣金不在裡面：
 *   1. 單一蛋白源（過敏排查時能鎖定變因）
 *   2. 營養組成落在建議區間
 *   3. Omega-3 高（皮毛/關節）
 *   4. 使用者回報的適口性
 */
function choose(alive: Product[], situation: Situation): { pick: Product | null; reason: string } {
  if (alive.length === 0) {
    return { pick: null, reason: "" };
  }

  const scored = alive
    .map((p) => ({ p, s: score(p, situation) }))
    .sort((a, b) => b.s - a.s);

  const pick = scored[0].p;
  return { pick, reason: explain(pick, alive, situation) };
}

function score(p: Product, situation: Situation): number {
  let s = 0;

  // 有過敏疑慮時，單一蛋白源的價值最高 —— 它讓飼主下次能排查出兇手
  if (p.spec.singleSource) s += situation.avoid.length > 0 ? 30 : 12;

  // 碳水越低越好。台灣市售乾糧多在 25–50%，所以拿 45 當基準往下算，
  // 上限 12 分避免極端高蛋白配方光靠這一項就輾壓其他所有考量。
  s += Math.min(12, Math.max(0, (45 - p.spec.carb) / 2));

  // Omega-3
  s += Math.min(12, p.spec.omega3 * 8);

  // 適口性：用回報比例扣分。樣本太少的不扣（避免 3 人回報就定生死）
  if (p.reports.total >= 30) {
    s -= (p.reports.palatability / p.reports.total) * 40;
    s -= (p.reports.looseStool / p.reports.total) * 25;
  }

  // 處方飼料需獸醫指示，不主動推
  if (p.spec.prescription) s -= 20;

  return s;
}

/** 一句話講清楚為什麼是它。避免形容詞，只講可查證的事實。 */
function explain(pick: Product, alive: Product[], situation: Situation): string {
  const bits: string[] = [];

  if (pick.spec.singleSource) {
    const others = alive.filter((p) => p.spec.singleSource).length;
    bits.push(others === 1
      ? `${alive.length} 款裡只有它是單一蛋白源`
      : "單一蛋白源，下次要排查過敏原比較容易");
  }
  if (situation.avoid.length > 0) {
    bits.push(`避開${situation.avoid.map(zhProtein).join("、")}`);
  }
  if (pick.spec.carb <= 25) {
    bits.push(`碳水 ${pick.spec.carb}% 在建議範圍`);
  }
  return bits.join("、") + "。";
}

const PROTEIN_ZH: Record<string, string> = {
  chicken: "雞肉", beef: "牛肉", lamb: "羊肉", salmon: "鮭魚",
  whitefish: "白魚", duck: "鴨肉", turkey: "火雞", pork: "豬肉",
  venison: "鹿肉", insect: "昆蟲蛋白",
};

export function zhProtein(k: string): string {
  return PROTEIN_ZH[k] ?? k;
}

/* ------------------------------------------------------------------ */
/* 佣金稽核 —— 只給揭露頁用，排序永遠碰不到                              */
/* ------------------------------------------------------------------ */

export interface CommissionAudit {
  rows: { label: string; commission: number; isPick: boolean }[];
  highest: number;
  pickRate: number;
  /**
   * 推薦的那款是不是佣金最高的。
   * 只剩一款時沒有比較基礎 —— 它同時是最高也是最低，
   * 這時回 null，前端要顯示「本次只有一款符合，無從比較」而不是紅字警告。
   */
  pickIsHighest: boolean | null;
}

export function auditCommission(verdict: Verdict): CommissionAudit | null {
  if (!verdict.pick) return null;

  const rows = verdict.survivors.map((p) => ({
    label: `${p.brand}｜${p.name}`,
    commission: Math.max(...p.price.merchants.map((m) => m.commission)),
    isPick: p.id === verdict.pick!.id,
  }));

  const highest = Math.max(...rows.map((r) => r.commission));
  const pickRate = rows.find((r) => r.isPick)!.commission;
  const comparable = rows.length > 1 && new Set(rows.map((r) => r.commission)).size > 1;

  return {
    rows,
    highest,
    pickRate,
    pickIsHighest: comparable ? pickRate === highest : null,
  };
}

/* ------------------------------------------------------------------ */
/* 每公斤單價                                                          */
/*                                                                    */
/* 蝦皮的規格單位很亂 —— 2kg、4.5磅、3.5kg、24磅混在一起，            */
/* 使用者根本沒辦法比。這是決策工具該做、而商品頁不會做的事。          */
/* ------------------------------------------------------------------ */

/** 從 unit 字串抓出公斤數。認得 kg / 公斤 / 磅 / lb / g。抓不到回 null。 */
export function kgOf(unit: string): number | null {
  const s = unit.replace(/\s/g, "");

  // 先抓磅 —— 「4.5磅(約2kg)」這種寫法要以磅為準，括號裡是給人看的
  const lb = s.match(/(\d+(?:\.\d+)?)\s*(?:磅|lbs?|LB)/i);
  if (lb) return +(parseFloat(lb[1]) * 0.45359237).toFixed(3);

  const kg = s.match(/(\d+(?:\.\d+)?)\s*(?:kg|KG|公斤|Kg)/);
  if (kg) return parseFloat(kg[1]);

  const g = s.match(/(\d+(?:\.\d+)?)\s*(?:g|G|公克|克)(?![a-zA-Z])/);
  if (g) return parseFloat(g[1]) / 1000;

  return null;
}

/** 每公斤多少錢。算不出來回 null，前端就不顯示 —— 寧可不講也不要講錯。 */
export function pricePerKg(unit: string, amount: number): number | null {
  const kg = kgOf(unit);
  if (!kg || kg <= 0) return null;
  return Math.round(amount / kg);
}


/* ------------------------------------------------------------------ */
/* 同一商品頁多口味                                                     */
/*                                                                    */
/* 蝦皮的分享連結指向整個商品頁，不是特定規格 —— 賣家把鹿肉/火雞/鮭魚   */
/* 放同一頁，連結就一定一樣，這無法避免。                               */
/*                                                                    */
/* 所以不擋，改成在使用者要點的那一刻警告他自己選對規格。               */
/* ------------------------------------------------------------------ */

/** 這批商品裡，哪些網址被多款共用。 */
export function sharedListings(pool: Product[]): Set<string> {
  const count = new Map<string, number>();
  for (const p of pool) {
    for (const u of new Set(p.price.merchants.map((m) => m.affiliateUrl))) {
      count.set(u, (count.get(u) ?? 0) + 1);
    }
  }
  return new Set([...count].filter(([, n]) => n > 1).map(([u]) => u));
}

/** 某個通路實際賣的規格。大包裝會覆寫。 */
export function unitOf(p: Product, m: Merchant): string {
  return m.unit ?? p.price.unit;
}

/* ------------------------------------------------------------------ */
/* 賣場分組                                                            */
/*                                                                    */
/* 蝦皮一個商品頁裝多個規格（2kg / 6kg / 11.4kg），連結是同一條。      */
/* 所以畫面不該擺兩個「前往」按鈕假裝是兩個賣場 —— 事實是一個賣場、   */
/* 多個規格、進去自己選。畫面就該長成事實的樣子。                      */
/* ------------------------------------------------------------------ */

export interface StoreOption {
  unit: string;
  amount: number;
  perKg: number | null;
  /**
   * 相對於這款最貴的那個規格，每公斤差幾 %。
   * 正數＝比較省，負數＝反而更貴（大包不一定划算，這才是要講的）。
   */
  savingPct: number | null;
  note: string;
}

export interface Store {
  /** 走 /go/ 用的通路 id */
  id: string;
  label: string;
  affiliateUrl: string;
  commission: number;
  options: StoreOption[];
}

/** 把一款商品的通路按「同一個連結」歸成賣場。 */
export function storesOf(p: Product): Store[] {
  const byUrl = new Map<string, Merchant[]>();
  for (const m of p.price.merchants) {
    byUrl.set(m.affiliateUrl, [...(byUrl.get(m.affiliateUrl) ?? []), m]);
  }

  /*
   * 省幅的基準要跨賣場算，不能只在同一個區塊裡比。
   *
   * 賣家設定方式不一致：有人把 6磅/22磅 放同一個商品頁（同網址），
   * 有人拆成兩個商品（不同網址）。後者如果只在區塊內比，
   * 每個區塊都只有一個規格 → 永遠算不出省幅。
   */
  const allKg = p.price.merchants
    .map((m) => pricePerKg(unitOf(p, m), m.amount))
    .filter((k): k is number => k !== null);
  // 用「入門包」當基準，不是用最貴的 —— 使用者是拿最小包去比大包划不划算
  const entry = p.price.merchants
    .map((m) => ({ kg: kgOf(unitOf(p, m)), per: pricePerKg(unitOf(p, m), m.amount) }))
    .filter((x) => x.kg !== null && x.per !== null)
    .sort((a, b) => a.kg! - b.kg!)[0];
  const base = allKg.length > 1 && entry ? entry.per! : null;

  return [...byUrl.values()].map((ms) => {
    const withKg = ms.map((m) => ({
      m,
      unit: unitOf(p, m),
      perKg: pricePerKg(unitOf(p, m), m.amount),
    }));

    return {
      id: ms[0].id,
      label: ms[0].label,
      affiliateUrl: ms[0].affiliateUrl,
      commission: Math.max(...ms.map((m) => m.commission)),
      options: withKg
        .sort((a, b) => a.m.amount - b.m.amount)
        .map((x) => ({
          unit: x.unit,
          amount: x.m.amount,
          perKg: x.perKg,
          savingPct:
            base !== null && x.perKg !== null && x.perKg !== base
              ? Math.round((1 - x.perKg / base) * 100)
              : null,
          note: x.m.note,
        })),
    };
  });
}
