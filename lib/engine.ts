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
  /** 走 /go/ 用的通路 id */
  id: string;
  unit: string;
  amount: number;
  perKg: number | null;
  /**
   * 相對於這款最小包，每公斤差幾 %。
   * 正數＝比較省，負數＝反而更貴（大包不一定划算，這才是要講的）。
   */
  savingPct: number | null;
  note: string;
  affiliateUrl: string;
}

export interface Store {
  label: string;
  commission: number;
  options: StoreOption[];
  /**
   * 所有規格共用一條連結（賣家放同一個商品頁）→ 標題放一個按鈕就好。
   * 各自獨立（賣家把尺寸拆成不同商品）→ 每一行各給一個按鈕。
   */
  singleUrl: string | null;
}

/**
 * 把一款商品的通路按「賣家」歸組。
 *
 * 賣家設定方式不一致：有人把 2kg/6kg/11.4kg 放同一個商品頁，
 * 有人把每個尺寸拆成獨立商品。畫面要兩種都長得對 ——
 * 同一家就一個標題，連結相同就一個按鈕，不同就每行一個。
 */
export function storesOf(p: Product): Store[] {
  // 省幅基準用「最小包」—— 使用者是拿入門包去比大包划不划算
  const sized = p.price.merchants
    .map((m) => ({ m, kg: kgOf(unitOf(p, m)), per: pricePerKg(unitOf(p, m), m.amount) }))
    .filter((x) => x.kg !== null && x.per !== null)
    .sort((a, b) => a.kg! - b.kg!);
  const base = sized.length > 1 ? sized[0].per! : null;

  const byLabel = new Map<string, Merchant[]>();
  for (const m of p.price.merchants) {
    byLabel.set(m.label, [...(byLabel.get(m.label) ?? []), m]);
  }

  return [...byLabel].map(([label, ms]) => {
    const urls = new Set(ms.map((m) => m.affiliateUrl));
    const options = ms
      .map((m) => {
        const unit = unitOf(p, m);
        const perKg = pricePerKg(unit, m.amount);
        return {
          id: m.id,
          unit,
          amount: m.amount,
          perKg,
          savingPct:
            base !== null && perKg !== null && perKg !== base
              ? Math.round((1 - perKg / base) * 100)
              : null,
          note: m.note,
          affiliateUrl: m.affiliateUrl,
        };
      })
      .sort((a, b) => a.amount - b.amount);

    return {
      label,
      commission: Math.max(...ms.map((m) => m.commission)),
      options,
      singleUrl: urls.size === 1 ? [...urls][0] : null,
    };
  });
}

/* ------------------------------------------------------------------ */
/* 這包吃得完嗎                                                        */
/*                                                                    */
/* 大包每公斤便宜，但不是對每隻狗都好 —— 開封後的乾飼料油脂會氧化，   */
/* 放太久狗會越來越不愛吃，而飼主通常會誤以為是「這牌子不好」。       */
/*                                                                    */
/* 所以在「省 X%」旁邊一定要有這個。同樣一個大包，既講便宜多少，      */
/* 也講會不會放到壞 —— 這是決策工具跟推銷的分界線。                   */
/* ------------------------------------------------------------------ */

/** 成犬乾飼料的日食量粗估：體重的 2%。幼犬更多，高齡更少，這裡取中間值。 */
const DAILY_RATIO = 0.02;

/** 開封後建議用完的天數。超過就開始有氧化與適口性下降的問題。 */
export const FRESH_DAYS = 45;

export interface Duration {
  days: number;
  /** 超過建議期限，前端要提醒 */
  tooLong: boolean;
}

/**
 * 這包大概能吃幾天。體重不知道就回 null —— 猜一個數字比不講更糟。
 */
export function bagDuration(unit: string, weightKg: number | undefined): Duration | null {
  if (!weightKg || weightKg <= 0) return null;
  const kg = kgOf(unit);
  if (!kg) return null;

  const days = Math.round(kg / (weightKg * DAILY_RATIO));
  return { days, tooLong: days > FRESH_DAYS };
}
