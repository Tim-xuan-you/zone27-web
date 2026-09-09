import type {
  Constraint, Cut, Merchant, Product, ProteinSource, Situation, Stop, Verdict,
} from "./types";
import { daysBetween, todayTW } from "./date";

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
export function passes(p: Product, c: Constraint): boolean {
  switch (c.kind) {
    case "excludeProtein": {
      if (p.spec.proteinSources.includes(c.value)) return false;
      // 「禽肉副產品」沒指明是哪一種鳥 —— 要避雞、火雞、鴨的人，
      // 這種標示等於無法排除，只能當成有。
      const birds: ProteinSource[] = ["chicken", "turkey", "duck"];
      if (birds.includes(c.value) && p.spec.proteinSources.includes("poultry")) return false;
      return true;
    }
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
/**
 * 還能買的賣場。
 *
 * 連結會爛掉 —— 賣家下架、關店、分潤連結過期。這是這門生意的常態，
 * 不是例外。所以「死掉的賣場」是資料模型的一部分，不是靠人記得去刪。
 */
export function liveMerchants(p: Product): Merchant[] {
  const live = p.price.merchants.filter((m) => !m.dead);
  // 全死了就回原陣列，讓上層自己判斷要不要整款拿掉；
  // 這裡回空陣列會讓一堆 [0] 變成 undefined，反而更難查。
  return live.length > 0 ? live : p.price.merchants;
}

/** 這款還有沒有地方買 */
export function buyable(p: Product): boolean {
  return p.price.merchants.some((m) => !m.dead);
}

/** 能不能真的推出去。對照款永遠不行 —— 它的工作是被刪掉。 */
export function recommendable(p: Product): boolean {
  return !p.referenceOnly && !p.awaitingLink && !p.discontinued && buyable(p);
}

export function anchorOf(p: Product, role: "safe" | "value") {
  const live = liveMerchants(p);
  return live.find((m) => m.anchor === role) ?? live[0];
}

/**
 * 跑一次裁決。
 * 約束按傳入順序套用 —— 順序會直接變成畫面上「怎麼刪的」那一段，
 * 所以呼叫端要把最重要、最切身的規則放前面（通常是過敏原）。
 */
/**
 * 貓不能吃狗飼料。
 *
 * 這不是保守，是生理事實：貓沒辦法自己合成足夠的牛磺酸，
 * 狗飼料裡的含量對貓不夠，長期缺乏會造成擴張性心肌病與視網膜退化。
 *
 * 所以物種不符不是「刪掉幾款」，是整題不回答 ——
 * 一個導購站把狗飼料推給貓主人，那不是資料不足，那是造成傷害。
 */
const SPECIES_ZH = { dog: "狗", cat: "貓" } as const;

function speciesStop(want: Situation["species"]): Stop {
  return {
    kind: "species",
    title: `我們現在只有${SPECIES_ZH[want === "cat" ? "dog" : "cat"]}飼料`,
    body:
      want === "cat"
        ? "而且千萬不要拿狗飼料餵貓。貓沒辦法自己合成足夠的牛磺酸，狗飼料裡的量對貓不夠 —— 長期缺牛磺酸會傷心臟和視力。這不是我們保守，是貓跟狗的營養需求本來就不一樣。"
        : "狗跟貓的需求不一樣，我們不會把貓飼料推給狗。",
    next: `${SPECIES_ZH[want]}的部分我們還在做。在那之前這一題我們幫不上你，抱歉。`,
  };
}

/**
 * 腎臟：獸醫已經給了條件，而我們手上沒有一款符合。
 *
 * 市售腎臟處方飼料的磷大多在 0.2–0.5%（乾物基），早期腎病一般建議
 * 不超過 0.6%；一般成犬糧本來就是 1–2%。我們現在收的十款都在 1.1–1.2%。
 *
 * 這種情況硬推最接近的那一款，是最糟的選擇 —— 它一樣不符合，
 * 而飼主會以為問題解決了。
 */
function renalStop(pool: Product[]): Stop {
  const low = Math.min(...pool.map((p) => p.spec.phosphorus).filter((n) => n > 0));
  return {
    kind: "renal",
    title: "腎指數的飼料要跟著獸醫走，不是我們該賣的",
    body:
      `市售腎臟處方飼料的磷大多在 0.2–0.5%，早期腎病一般建議不超過 0.6%。` +
      `我們手上磷最低的一款是 ${low}% —— 剛好壓在上限，而且那個數字是我們從` +
      `公開資料整理的，不是廠商的保證值。拿它去對付腎指數，風險我們擔不起。`,
    next: "處方飼料要獸醫開，我們不賣也不推。把獸醫給你的磷上限問清楚，照那個數字挑。",
  };
}

/*
 * 讀得懂、但我們沒有資料可以據此判斷的症狀。
 *
 * 挑食要有飼主回報的適口性資料才判斷得了，而我們的 reports 目前全是 0；
 * 淚痕與口腔沒有站得住腳的飲食規則。與其讓 chip 靜靜掛在那裡讓人
 * 以為我們考慮過了，不如直接講我們幫不上這一項。
 */
const NO_DATA_FOR: Record<string, string> = {
  適口性: "挑不挑食我們判斷不了 —— 要有夠多飼主回報才算數，我們現在沒有",
  淚痕: "淚痕跟飼料的關係沒有可靠的定論，我們不會拿它當理由",
  口腔: "潔牙效果我們沒有資料，不假裝有",
};


export function adjudicate(pool: Product[], situation: Situation): Verdict {
  // 物種不符 → 整題不回答。這一刀在所有事情之前。
  const sameSpecies = pool.filter((p) => p.species === situation.species);
  if (sameSpecies.length === 0) {
    return {
      startCount: 0, cuts: [], survivors: [], pick: null, pickReason: "",
      stop: speciesStop(situation.species),
    };
  }
  pool = sameSpecies;

  // 買不到的東西不該進裁決 —— 推薦一個點進去是 404 的連結，
  // 比少推薦一款糟糕得多。這一刀在計數之前先砍，
  // 使用者不需要知道我們有幾款連結壞掉。
  pool = pool.filter((p) => !p.discontinued && (p.referenceOnly || p.awaitingLink || buyable(p)));

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

  /*
   * 最後一刀：對照款。
   *
   * 它們多半在前面就被砍掉了（那正是放它們進來的目的）。
   * 撐到這裡的，代表以這一頁的條件來看它其實合格 —— 那就更該說實話：
   * 合格但我們沒有查證過的購買通路，所以不推。
   */
  const refs = alive.filter((p) => p.referenceOnly || p.awaitingLink || !buyable(p));
  if (refs.length > 0) {
    cuts.push({
      count: refs.length,
      why: "沒有我們查證過的購買通路",
      tag: "通路",
      ids: refs.map((p) => p.id),
    });
    alive = alive.filter((p) => !refs.includes(p));
  }

  /*
   * 腎臟一律停，不是「剛好沒東西可推才停」。
   *
   * 原本寫成 survivors === 0 才停，結果有一款的磷剛好是 0.6 ——
   * 正好卡在門檻上，於是控磷的飼主會被推薦它。那正是要防的事：
   * 我們的磷是從公開資料整理的估值，不是廠商保證值，
   * 拿一個估出來的邊界值去回答腎臟問題，是拿別人的狗去冒險。
   */
  const renal = situation.symptoms.some((s) => s.includes("腎"));
  if (renal) {
    return { startCount, cuts, survivors: [], pick: null, pickReason: "", stop: renalStop(pool) };
  }

  const { pick, reason } = choose(alive, situation);

  const unusedSignals = situation.symptoms
    .map((x) => Object.keys(NO_DATA_FOR).find((k) => x.includes(k)))
    .filter((k): k is string => Boolean(k))
    .map((k) => NO_DATA_FOR[k]);

  return {
    startCount, cuts, survivors: alive, pick, pickReason: reason,
    ...(unusedSignals.length ? { unusedSignals } : {}),
  };
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

/** 症狀正規化後的字串，用 includes 比對比較耐得住新增詞彙 */
const has = (s: Situation, k: string) => s.symptoms.some((x) => x.includes(k));

function score(p: Product, situation: Situation): number {
  let s = 0;

  /*
   * 症狀本來完全沒有進評分函式 —— 使用者打「一直抓癢」「有點胖」「軟便」，
   * 畫面上跳出 chip，但排序跟沒講一模一樣。跟物種那個 bug 是同一類。
   *
   * 加分幅度刻意保守：這幾條是方向性的判斷，不是診斷。
   * 真正該擋的東西用排除規則擋（過敏原、年齡、體型、磷），
   * 這裡只負責在都合格的候選之間排個先後。
   */
  const skin = has(situation, "皮膚") || has(situation, "毛髮");
  const gut = has(situation, "腸胃");
  const weight = has(situation, "體重");

  // 有過敏疑慮時，單一蛋白源的價值最高 —— 它讓飼主下次能排查出兇手。
  // 皮膚症狀就算還沒點名過敏原，走的也是同一套排除飲食邏輯。
  if (p.spec.singleSource) {
    s += situation.avoid.length > 0 ? 30 : skin || gut ? 20 : 12;
  }

  // 皮膚與毛髮：omega-3 是有依據的方向，加權放大一點
  if (skin) s += Math.min(10, p.spec.omega3 * 6);

  // 軟便：脂肪偏高是常見原因之一。超過 18% 開始扣。
  if (gut) s -= Math.max(0, p.spec.fat - 18) * 1.5;

  // 體重控制：碳水與脂肪都要看
  if (weight) {
    s -= Math.max(0, p.spec.carb - 35) * 0.6;
    s -= Math.max(0, p.spec.fat - 15) * 1.2;
  }

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
  poultry: "未指明的禽肉",
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
  lowest: number;
  pickRate: number;
  /**
   * 推薦的那款在佣金排序裡的位置（0 = 最低）。
   * 用來產生一句「在任何情況下都是真的」的說明。
   *
   * 這一段是整個站最不能寫錯的地方：品牌建立在「我們對佣金誠實」上，
   * 如果這句話本身有一次是假的，全站的可信度一起歸零。
   */
  rank: number;
  total: number;
  /** 佣金全部一樣就沒有比較基礎 */
  comparable: boolean;
}

export function auditCommission(verdict: Verdict): CommissionAudit | null {
  if (!verdict.pick) return null;

  const rows = verdict.survivors.map((p) => ({
    label: `${p.brand}｜${p.name}`,
    commission: Math.max(...p.price.merchants.map((m) => m.commission)),
    isPick: p.id === verdict.pick!.id,
  }));

  const rates = rows.map((r) => r.commission);
  const highest = Math.max(...rates);
  const lowest = Math.min(...rates);
  const pickRate = rows.find((r) => r.isPick)!.commission;
  const comparable = new Set(rates).size > 1;

  return {
    rows,
    highest,
    lowest,
    pickRate,
    rank: rates.filter((r) => r < pickRate).length,
    total: rows.length,
    comparable,
  };
}

/**
 * 一句在任何情況下都成立的佣金說明。
 *
 * 之前寫死「賺最少的那個」，但推薦的那款只是「不是最高」，
 * 不見得是最低 —— 那句話在多數情況下是假的。
 */
export function commissionLine(a: CommissionAudit): { text: string; tone: "keep" | "warn" | "muted" } {
  if (!a.comparable) {
    return { text: `本次留下的款式佣金都是 ${a.pickRate}%，沒有比較基礎。`, tone: "muted" };
  }
  if (a.pickRate === a.highest) {
    return {
      text: `⚠️ 本次推薦的剛好是佣金最高的 ${a.pickRate}%。演算法沒有讀佣金，但這種情況我們會另外複查。`,
      tone: "warn",
    };
  }
  if (a.pickRate === a.lowest) {
    return {
      text: `本次佣金從 ${a.lowest}% 到 ${a.highest}%，我們推的這款是 ${a.pickRate}% —— 賺最少的那個。`,
      tone: "keep",
    };
  }
  return {
    text: `本次佣金從 ${a.lowest}% 到 ${a.highest}%。我們推的這款是 ${a.pickRate}%，不是最高的那個（最高 ${a.highest}%）。`,
    tone: "keep",
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
  const sized = liveMerchants(p)
    .map((m) => ({ m, kg: kgOf(unitOf(p, m)), per: pricePerKg(unitOf(p, m), m.amount) }))
    .filter((x) => x.kg !== null && x.per !== null)
    .sort((a, b) => a.kg! - b.kg!);
  const base = sized.length > 1 ? sized[0].per! : null;

  const byLabel = new Map<string, Merchant[]>();
  for (const m of liveMerchants(p)) {
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

/* ------------------------------------------------------------------ */
/* 一天要吃多少                                                        */
/*                                                                    */
/* 原本用「體重 × 2%」。那是網路上流傳的粗估，好記，但高估滿多的 ——   */
/* 一隻 10 公斤的成犬照 2% 算是 200 克，用獸醫的能量公式算大約 165 克。 */
/*                                                                    */
/* 改用標準的 RER / MER：                                              */
/*   RER（靜止能量需求）= 70 × 體重^0.75                               */
/*   MER（維持能量需求）= RER × 生命階段係數                           */
/*                                                                    */
/* 再用乾飼料的熱量密度換成克數。台灣市售乾糧多在 3,300–4,200 kcal/kg，*/
/* 我們取 3,800 當中間值 —— 所以這是估算，不是餵食指示。               */
/* 包裝背面的餵食表比我們準，因為那是照那一包的實際熱量算的。         */
/* ------------------------------------------------------------------ */

/** 乾飼料熱量密度的中間值（kcal/kg）。多數台灣市售乾糧落在 3,300–4,200。 */
export const KCAL_PER_KG = 3800;

/** 生命階段係數。數字取自一般獸醫營養學教材的區間中間值。 */
export const MER_FACTORS = {
  puppyYoung: { factor: 3.0, zh: "幼犬 · 4 個月以下" },
  puppy:      { factor: 2.0, zh: "幼犬 · 4 個月到 1 歲" },
  adultFixed: { factor: 1.6, zh: "成犬 · 已結紮" },
  adultWhole: { factor: 1.8, zh: "成犬 · 未結紮" },
  senior:     { factor: 1.4, zh: "高齡或不太活動" },
  slimming:   { factor: 1.0, zh: "需要減重" },
} as const;

export type Stage = keyof typeof MER_FACTORS;

/** 靜止能量需求（大卡／天） */
export function rer(weightKg: number): number {
  return 70 * Math.pow(weightKg, 0.75);
}

/** 維持能量需求（大卡／天） */
export function mer(weightKg: number, stage: Stage = "adultFixed"): number {
  return rer(weightKg) * MER_FACTORS[stage].factor;
}

/** 一天大約幾克乾飼料 */
export function dailyGrams(weightKg: number, stage: Stage = "adultFixed"): number {
  return Math.round((mer(weightKg, stage) / KCAL_PER_KG) * 1000);
}

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

  const perDay = dailyGrams(weightKg) / 1000;   // 公斤／天
  if (perDay <= 0) return null;
  const days = Math.round(kg / perDay);
  return { days, tooLong: days > FRESH_DAYS };
}

/* ------------------------------------------------------------------ */
/* 換了之後會怎樣                                                      */
/*                                                                    */
/* 這一段是整個站最晚才想通的東西。                                    */
/*                                                                    */
/* 飼主真正的問題從來不是「買哪一包」，是「我換了會怎樣、多久知道      */
/* 有沒有用、沒用怎麼辦」。我們給了答案卻沒給後續，等於把人送到        */
/* 結帳頁就不管了 —— 而他兩個禮拜沒看到改善就會換牌子，然後永遠       */
/* 不會知道其實只是還沒到時間。                                       */
/*                                                                    */
/* 附帶的結果是：講清楚週期，才有理由講包裝大小。皮膚問題的排除        */
/* 飲食法要跑滿 8 週，2kg 的包裝十天就沒了 —— 那不是省錢，是根本      */
/* 測不出東西。這個推論會讓客單價上去，所以更要把算式攤開來：         */
/* 我們同時也會叫人「不要買那個超大包」，因為開封超過 FRESH_DAYS      */
/* 會氧化。兩個方向都講，才不是話術。                                  */
/* ------------------------------------------------------------------ */

export interface Trial {
  /** 要跑多久才看得出來（天） */
  needDays: number;
  /** 給人看的說法，例如「6 到 8 週」 */
  needLabel: string;
  /** 為什麼是這個長度 */
  needWhy: string;
  /** 卡片上那包能撐幾天；沒有體重就是 null */
  anchorDays: number | null;
  /** 更適合跑完週期的規格（同一款、任何賣家），沒有更好的就是 null */
  better: { id: string; unit: string; amount: number; days: number; savingPct: number | null } | null;
  /** 週期比保鮮上限長，一包裝不下，要分兩次買 */
  needsTwoBags: boolean;
}

/** 症狀決定週期。皮膚要等毛髮長，腸胃幾天就知道。 */
export function trialLength(symptoms: string[] | undefined): { days: number; label: string; why: string } {
  const has = (k: string) => (symptoms ?? []).some((s) => s.includes(k));

  if (has("腸胃")) {
    return {
      days: 14,
      label: "1 到 2 週",
      why: "腸胃的反應快。換完糧穩定下來之後，一兩個禮拜就看得出便便有沒有變好。",
    };
  }
  // 淚痕刻意不在這裡。我們在畫面上已經說了「淚痕沒有可靠定論，
  // 不會拿它當理由」—— 那就不能回頭拿它去決定週期。自打嘴巴比不做更糟。
  if (has("皮膚") || has("毛髮")) {
    return {
      days: 56,
      label: "6 到 8 週",
      why: "皮膚跟毛要跟著生長週期走，急不來。獸醫做排除飲食法一般也是抓 8 週 —— 兩個禮拜沒改善很正常，不代表這款沒用。",
    };
  }
  return {
    days: 42,
    label: "至少 6 週",
    why: "換糧的效果不會在幾天內出現。給牠一個完整的週期，你的判斷才有意義。",
  };
}

/**
 * 這包夠不夠你跑完週期。
 *
 * 挑「最接近目標天數、又不超過保鮮上限」的規格。
 * 刻意不看佣金 —— 跟 score() 一樣，這裡讀不到那個欄位。
 */
export function trialPlan(
  p: Product,
  dogKg: number | undefined,
  symptoms: string[] | undefined,
): Trial {
  const need = trialLength(symptoms);
  const anchor = anchorOf(p, "safe");
  const anchorDur = bagDuration(unitOf(p, anchor), dogKg);

  const base: Trial = {
    needDays: need.days,
    needLabel: need.label,
    needWhy: need.why,
    anchorDays: anchorDur?.days ?? null,
    better: null,
    needsTwoBags: need.days > FRESH_DAYS,
  };
  if (!dogKg || !anchorDur) return base;

  // 一包最多只能撐到保鮮上限，超過就是叫人吃壞掉的飼料
  const target = Math.min(need.days, FRESH_DAYS);

  let best: Trial["better"] = null;
  let bestGap = Math.abs(anchorDur.days - target);

  for (const store of storesOf(p)) {
    for (const o of store.options) {
      const d = bagDuration(o.unit, dogKg);
      if (!d || d.days > FRESH_DAYS) continue;
      const gap = Math.abs(d.days - target);
      // 差距要明顯縮小才值得叫人改買別的規格
      if (gap < bestGap - 3) {
        bestGap = gap;
        best = { id: o.id, unit: o.unit, amount: o.amount, days: d.days, savingPct: o.savingPct };
      }
    }
  }

  return { ...base, better: best };
}

/* ------------------------------------------------------------------ */
/* 資料會過期                                                          */
/*                                                                    */
/* 我們不爬電商，所以每個價格都是人工查的 —— 也就是說，每個價格從被    */
/* 寫下來那一刻就開始腐爛。商品會下架、賣家會關店、分潤連結會過期。    */
/*                                                                    */
/* 六款的時候靠記性就好。一百款、三百條連結的時候，靠記性等於沒有制度。 */
/* 所以把「幾天沒複查」變成引擎讀得到的數字，讓它自己降級、自己排出    */
/* 待辦清單 —— 人只要打開一頁，照著上面做。                            */
/* ------------------------------------------------------------------ */

/** 超過這個天數，價格不再拿出來當承諾，只當參考。 */
export const PRICE_FRESH_DAYS = 30;
/** 超過這個天數，這筆資料視為過期，畫面要明講、排序要往後。 */
export const PRICE_STALE_DAYS = 75;

export interface Freshness {
  days: number;
  level: "fresh" | "aging" | "stale";
  /** 給人看的一句話，沒過期就是 null */
  note: string | null;
}

export function freshness(checkedAt: string, today = todayTW()): Freshness {
  const raw = daysBetween(checkedAt, today);
  if (Number.isNaN(raw)) return { days: 9999, level: "stale", note: "沒有查價日期" };

  const days = Math.max(0, raw);
  if (days <= PRICE_FRESH_DAYS) return { days, level: "fresh", note: null };
  if (days <= PRICE_STALE_DAYS) {
    return { days, level: "aging", note: `這個價格是 ${days} 天前查的，點進去以賣場標價為準。` };
  }
  return {
    days,
    level: "stale",
    note: `這個價格已經 ${days} 天沒複查了 —— 我們把它當參考，不當承諾。`,
  };
}

/** 一筆待辦：哪一款、哪一家、幾天沒查、連結在哪 */
export interface MaintenanceRow {
  productId: string;
  brand: string;
  name: string;
  merchantId: string;
  label: string;
  unit: string;
  amount: number;
  affiliateUrl: string;
  checkedAt: string;
  days: number;
  level: Freshness["level"] | "dead";
}

/**
 * 全站的維護待辦，最該處理的排最前面。
 *
 * 排序：死掉的 > 過期的 > 快過期的 > 新的。
 * 這一頁存在的意義只有一個 —— 不用一個一個找。
 */
export function maintenanceRows(pool: Product[], today = todayTW()): MaintenanceRow[] {
  const rows: MaintenanceRow[] = [];

  for (const p of pool) {
    for (const m of p.price.merchants) {
      const f = freshness(p.price.checkedAt, today);
      rows.push({
        productId: p.id,
        brand: p.brand,
        name: p.name,
        merchantId: m.id,
        label: m.label,
        unit: unitOf(p, m),
        amount: m.amount,
        affiliateUrl: m.affiliateUrl,
        checkedAt: p.price.checkedAt,
        days: f.days,
        level: m.dead ? "dead" : f.level,
      });
    }
  }

  const rank = { dead: 0, stale: 1, aging: 2, fresh: 3 } as const;
  return rows.sort((a, b) => rank[a.level] - rank[b.level] || b.days - a.days);
}


/* ------------------------------------------------------------------ */
/* 蝦皮 Sub id                                                         */
/*                                                                    */
/* 蝦皮的辨識參數欄位只收 A-Z 與 0-9，最多 50 字 —— **連字號會被擋**。 */
/* 我們的商品編號是 df-11 這種格式，直接貼過去會跳錯誤。               */
/*                                                                    */
/* 所以轉換規則寫成函式，不要靠人記得手動改：                          */
/*   df-11 → DF11                                                      */
/*                                                                    */
/* 用大寫是因為蝦皮的提示寫「A-Z, 0-9」—— 小寫可能也行，              */
/* 但沒必要為了好看去賭一個會讓人卡住的欄位。                          */
/* ------------------------------------------------------------------ */

/** 商品編號 → 蝦皮 Sub id。只留英數字並轉大寫。 */
export function shopeeSubId(productId: string): string {
  return productId.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 50);
}

/** 類目 Sub id，固定第二格。未來做出國、銀髮才分得開。 */
export const CATEGORY_SUB_ID = "dogfood";
