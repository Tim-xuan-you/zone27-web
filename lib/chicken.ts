import type { ChickenStatus, ProteinSource } from "./types";

/**
 * 有沒有雞：全站的招牌。
 *
 * 2026-09-13 Tim：「網站要有自己的特色，讓喜歡的人很容易跟親朋好友介紹。」
 * 我們最有辨識度的東西就是這個：名字沒寫雞的，將近一半成分表裡有雞。
 * 以前只在查藏雞頁看得到，現在每一款商品、每一張推薦卡、每一張分享卡都掛同一個標章，
 * 截圖傳出去，一眼就認得是這個網站。
 *
 * 這一支不讀任何檔案，網頁端也能用。判定在匯入時做好寫進商品資料（Product.chicken）。
 */

/** 標章上的字和顏色 */
export const STAMP: Record<ChickenStatus, { zh: string; fg: string; bg: string }> = {
  hidden: { zh: "藏雞", fg: "var(--cut)", bg: "var(--cut-soft)" },
  chicken: { zh: "有雞", fg: "var(--muted)", bg: "var(--sunken)" },
  fat: { zh: "有雞油", fg: "var(--warn)", bg: "var(--warn-soft)" },
  unsure: { zh: "沒寫清楚", fg: "var(--warn)", bg: "var(--warn-soft)" },
  clean: { zh: "沒有雞", fg: "var(--keep)", bg: "var(--keep-soft)" },
};

/** 標章旁邊那一句 */
export const STAMP_LINE: Record<ChickenStatus, string> = {
  hidden: "名字沒寫雞，成分表裡有雞。對雞過敏的，這包等於沒換。",
  chicken: "名字就寫了有雞。",
  fat: "肉沒有雞，但油脂用的是雞脂肪。一般對雞過敏多半是對雞肉的蛋白質，非常敏感的還是避開。",
  unsure: "成分表只寫「禽肉」或「動物蛋白」，沒講是哪一種。對雞過敏的不要賭。",
  clean: "成分表裡找不到雞。",
};

/** 名字上有沒有寫雞。「火雞」不算雞 */
export const NAME_HAS_CHICKEN = /(?<!火)雞/;

/**
 * 判定。
 * caseText：逐項核對的內容（找到什麼、結論），用來抓「油脂用雞脂肪」這種肉的來源看不出來的
 */
export function chickenStatusOf(name: string, sources: ProteinSource[], caseText = ""): ChickenStatus {
  if (sources.includes("chicken")) return NAME_HAS_CHICKEN.test(name) ? "chicken" : "hidden";
  if (sources.includes("poultry") || sources.includes("animal")) return "unsure";
  if (/雞(脂|油)/.test(caseText)) return "fat";
  return "clean";
}

/** 名字上寫的肉。「火雞」不算雞 */
const NAME_MEATS: [RegExp, string][] = [
  [NAME_HAS_CHICKEN, "雞"], [/火雞/, "火雞"], [/鴨/, "鴨"], [/鵪鶉/, "鵪鶉"], [/鮭/, "鮭魚"], [/鮪/, "鮪魚"],
  [/鯖/, "鯖魚"], [/鱒/, "鱒魚"], [/鱈/, "鱈魚"], [/(海魚|白魚|鮮魚|六種魚|漁獲|魚)/, "魚"], [/羊/, "羊"], [/牛/, "牛"], [/鹿/, "鹿"], [/豬/, "豬"],
  [/禽/, "禽肉"],
];

export function nameMeatsOf(name: string): string {
  const hit = NAME_MEATS.filter(([re]) => re.test(name)).map(([, zh]) => zh);
  // 「鮭魚」「鮪魚」已經講了是魚，不用再多一個「魚」
  const out = hit.filter((m) => !(m === "魚" && hit.some((x) => x.endsWith("魚") && x !== "魚")));
  return [...new Set(out)].join("、");
}
