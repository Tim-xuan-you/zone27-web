import raw from "@/data/dog-food.json";
import type { Constraint, Product, Situation } from "./types";

/**
 * 目錄。資料在 repo 裡的 JSON，建置時直接讀 —— 沒有執行期依賴，
 * 所以 generateStaticParams 可以把幾千個決策頁全部靜態生成。
 * 這是「Google 抓得到」的關鍵，不能改成執行期 fetch。
 */
export const catalog = raw.products as unknown as Product[];

export function byId(id: string): Product | undefined {
  return catalog.find((p) => p.id === id);
}

/**
 * 把使用者情境翻譯成排除規則，並排好順序。
 *
 * 順序就是畫面上「怎麼刪的」那一段，所以最切身的放最前面：
 * 過敏原 → 生命階段 → 體型 → 營養門檻 → 預算 → 供貨
 */
export function constraintsFor(s: Situation): Constraint[] {
  const cs: Constraint[] = [];

  for (const protein of s.avoid) {
    cs.push({
      kind: "excludeProtein",
      value: protein,
      label: ["chicken", "turkey", "duck"].includes(protein)
        ? `含${zh(protein)}，或只寫「禽肉」沒指明是哪一種`
        : `主蛋白源含${zh(protein)}`,
      tag: "你標記的過敏原",
    });
  }

  if (s.ageYears !== undefined) {
    const stage = s.ageYears < 1 ? "puppy" : s.ageYears >= 8 ? "senior" : "adult";
    cs.push({
      kind: "lifeStage",
      value: stage,
      label: `不適用${stageZh(stage)}`,
      tag: "年齡不符",
    });
  }

  /*
   * 門檻是照真實市售商品訂的，不是理想值。
   *
   * 用示範資料訂的舊門檻（蛋白 26% / 碳水 25%）在真實資料上直接爆掉 ——
   * Natural Balance 和 Go! 的低敏系列都是粗蛋白 24%、碳水約 45%，
   * 兩款都會被刷掉，而它們正是低敏族群最常買的東西。
   *
   * 台灣市售乾糧的實際分佈：
   *   粗蛋白 22–38%（高蛋白無穀配方才到 30% 以上）
   *   碳水   25–50%（號稱無穀但用馬鈴薯/木薯的，碳水一樣高）
   *
   * 所以門檻只用來擋「明顯不合格」的，不是拿來挑好貨。
   * 挑好貨是評分函式的事（碳水越低加越多分），排除只擋離譜的。
   */
  cs.push({
    kind: "minProtein",
    value: 22,
    label: "粗蛋白低於 22%",
    tag: "營養門檻",
  });

  cs.push({
    kind: "maxCarb",
    value: 48,
    label: "碳水高於 48%",
    tag: "營養門檻",
  });

  if (s.budgetMonthly !== undefined) {
    cs.push({
      kind: "maxMonthly",
      value: s.budgetMonthly,
      label: `超出每月 ${s.budgetMonthly} 元預算`,
      tag: "預算",
    });
  }

  cs.push({
    kind: "inStock",
    label: "已停產或長期缺貨",
    tag: "通路查無",
  });

  return cs;
}

const ZH: Record<string, string> = {
  poultry: "未指明的禽肉",
  chicken: "雞肉", beef: "牛肉", lamb: "羊肉", salmon: "鮭魚",
  whitefish: "白魚", duck: "鴨肉", turkey: "火雞", pork: "豬肉",
  venison: "鹿肉", insect: "昆蟲蛋白",
};
const zh = (k: string) => ZH[k] ?? k;

const STAGE_ZH: Record<string, string> = {
  puppy: "幼犬", adult: "成犬", senior: "高齡犬",
};
const stageZh = (k: string) => STAGE_ZH[k] ?? k;
