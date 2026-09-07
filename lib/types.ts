/**
 * ZONE 27 · 決策引擎型別
 *
 * 設計原則：
 * 1. 規格（spec）是靜態的，幾年不變 → 存在 repo 的 JSON，建置時直接讀
 * 2. 價格是易變的，但我們「不爬」→ 人工複查 + 誠實顯示 checkedAt 時間戳
 * 3. 引擎的輸出不只是「留下誰」，更重要的是「為什麼刪掉別人」
 */

/** 蛋白質來源。過敏排除的主要依據。 */
export type ProteinSource =
  | "chicken" | "beef" | "lamb" | "salmon" | "whitefish"
  | "duck" | "turkey" | "pork" | "venison" | "insect";

export type LifeStage = "puppy" | "adult" | "senior" | "all";
export type BodySize = "small" | "medium" | "large";
export type Species = "dog" | "cat";

/** 商品規格。這一層是引擎判斷的依據，全部要可比較。 */
export interface Spec {
  /** 粗蛋白 % */
  protein: number;
  /** 粗脂肪 % */
  fat: number;
  /** 碳水化合物 %（建議 < 25） */
  carb: number;
  /** Omega-3 %。皮毛與關節相關。 */
  omega3: number;
  /** 磷 %。腎臟問題的關鍵指標。 */
  phosphorus: number;
  proteinSources: ProteinSource[];
  /** 單一蛋白源 = 過敏排查時最容易鎖定變因 */
  singleSource: boolean;
  grainFree: boolean;
  lifeStage: LifeStage[];
  bodySize: BodySize[];
  /** 處方飼料需獸醫指示，引擎必須另外標記 */
  prescription: boolean;
}

/** 使用者回報。護城河 L2：這些數字爬不到，只能累積。 */
export interface Reports {
  /** 有效回報總數 */
  total: number;
  /** 反映適口性差的人數 */
  palatability: number;
  /** 反映軟便的人數 */
  looseStool: number;
}

/** 一個通路的售價與分潤連結。批次一次性產生，寫死在資料裡。 */
export interface Merchant {
  id: string;
  /** 顯示名稱，例如「官方旗艦館」 */
  label: string;
  amount: number;
  /** 給使用者看的差異，例如「15 天鑑賞」「4,200 則好評」 */
  note: string;
  /** 分潤連結。永遠不直接吐給前端，走 /go/ 端點。 */
  affiliateUrl: string;
  /** 佣金 %。只用於揭露頁與稽核，排序演算法禁止讀取。 */
  commission: number;
  /** 錨點角色：安心 / 省錢 */
  anchor: "safe" | "value";
  /**
   * 這個通路賣的規格。沒填就沿用 price.unit。
   * 大包裝當「最省」時規格不同（4.5磅 vs 24磅），每公斤要各算各的。
   */
  unit?: string;
}

export interface Price {
  unit: string;
  /** 人工複查日期 YYYY-MM-DD。誠實顯示，不假裝即時。 */
  checkedAt: string;
  merchants: Merchant[];
}

export interface Product {
  id: string;
  species: Species;
  brand: string;
  name: string;
  spec: Spec;
  reports: Reports;
  price: Price;
  /** 這款的絕對紅線。卡片上最醒目的那一行。 */
  dealbreaker: string;
  /** 停產或長期缺貨 → 引擎直接排除 */
  discontinued?: boolean;
}

/* ------------------------------------------------------------------ */
/* 約束                                                                */
/* ------------------------------------------------------------------ */

/**
 * 一條約束 = 一條排除規則。
 * label 是給人看的（會出現在裁決過程），tag 是那條規則的來源。
 */
export type Constraint =
  | { kind: "excludeProtein"; value: ProteinSource; label: string; tag: string }
  | { kind: "minProtein"; value: number; label: string; tag: string }
  | { kind: "maxCarb"; value: number; label: string; tag: string }
  | { kind: "maxPhosphorus"; value: number; label: string; tag: string }
  | { kind: "lifeStage"; value: LifeStage; label: string; tag: string }
  | { kind: "bodySize"; value: BodySize; label: string; tag: string }
  | { kind: "singleSourceOnly"; label: string; tag: string }
  | { kind: "grainFreeOnly"; label: string; tag: string }
  | { kind: "inStock"; label: string; tag: string }
  | { kind: "maxMonthly"; value: number; label: string; tag: string };

/** 使用者的情境。自然語言入口會翻譯成這個。 */
export interface Situation {
  species: Species;
  /** 顯示用，例如「柴犬」 */
  breed?: string;
  ageYears?: number;
  weightKg?: number;
  /** 已經標記為過敏或想避開的蛋白源 */
  avoid: ProteinSource[];
  /** 使用者自己講的症狀，原文保留 */
  symptoms: string[];
  budgetMonthly?: number;
  constraints: Constraint[];
}

/* ------------------------------------------------------------------ */
/* 裁決結果                                                            */
/* ------------------------------------------------------------------ */

/** 一次排除。這是產品的靈魂 —— 使用者看的是這個，不是留下來那幾款。 */
export interface Cut {
  /** 這條規則刪掉幾款 */
  count: number;
  /** 給人看的理由，例如「主蛋白源含雞肉」 */
  why: string;
  /** 這條規則的來源，例如「你標記的過敏原」 */
  tag: string;
  /** 被刪掉的商品 id，供稽核與「為什麼沒有 X」查詢 */
  ids: string[];
}

export interface Verdict {
  /** 進入裁決的總數 */
  startCount: number;
  /** 依序套用的排除，順序即畫面上的順序 */
  cuts: Cut[];
  survivors: Product[];
  /** 引擎推薦的那一款。可能為 null（全被刪光）。 */
  pick: Product | null;
  /** 為什麼是它 —— 一句話，給人看的 */
  pickReason: string;
}
