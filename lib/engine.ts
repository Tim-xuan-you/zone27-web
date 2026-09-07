import type {
  Constraint, Cut, Product, Situation, Verdict,
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

  // 碳水低於建議上限，每低 1% 加分，但設上限避免極端配方獨大
  s += Math.min(10, Math.max(0, 25 - p.spec.carb));

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
