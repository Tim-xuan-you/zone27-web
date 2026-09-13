import type { Product } from "./types";
import { catalog, catalogOf, constraintsFor } from "./catalog";
import { adjudicate, anchorOf, formOf, pricePerKg, recommendable, unitOf } from "./engine";
import { categoryOf } from "./categories";
import { meatsOf, productHref } from "./labels";
import dogCases from "@/data/hidden-chicken.json";
import catCases from "@/data/cat-hidden-chicken.json";
import wetCases from "@/data/cat-wet-hidden-chicken.json";

/**
 * 「你家那包有沒有藏雞」的資料。
 *
 * 2026-09-13 Tim：「我們網站好像沒什麼獨有特色。」
 * 有，只是藏在文章裡：讀過的 42 款，名字沒寫雞的 26 款裡，9 款成分表裡有雞，3 款只寫「禽肉」「動物蛋白」。
 * 這一頁把它做成一個查得到的工具：打名字，馬上知道有沒有雞、第幾項、要換的話換哪一包。
 *
 * 核對檔裡的來源網址是別家通路，不能帶到頁面上（見 zone27-no-outbound-links），
 * 所以這裡只挑「查到什麼」「結論」出來，網址一個都不往外傳。
 */

export type CheckStatus = "hidden" | "fat" | "unsure" | "chicken" | "clean";

export interface CheckItem {
  id: string;
  brand: string;
  name: string;
  species: "dog" | "cat";
  cat: string;
  status: CheckStatus;
  /** 名字上看得到的肉 */
  nameMeats: string;
  /** 成分表裡的肉 */
  meats: string;
  found?: string[];
  verdict?: string;
  href: string;
  /** 能買才有：/go/ 的通路 id */
  buyId?: string;
  /** 有雞的：同一類不含雞、能買的幾款 */
  alts?: { id: string; brand: string; name: string; href: string; per: number | null }[];
}

type Case = { productId?: string; found?: string[] | string; verdict?: string; why?: string };
const cases = new Map<string, Case>();
for (const c of [
  ...((dogCases as { cases: Case[] }).cases ?? []),
  ...((catCases as { cases: Case[]; alsoMismatched?: Case[] }).cases ?? []),
  ...((catCases as { alsoMismatched?: Case[] }).alsoMismatched ?? []),
  ...((wetCases as { cases: Case[] }).cases ?? []),
  ...((wetCases as { clean?: Case[] }).clean ?? []),
]) {
  if (c.productId) cases.set(c.productId, c);
}

/** 名字上寫的肉。「火雞」不算雞 */
const NAME_MEATS: [RegExp, string][] = [
  [/(?<!火)雞/, "雞"], [/火雞/, "火雞"], [/鴨/, "鴨"], [/鵪鶉/, "鵪鶉"], [/鮭/, "鮭魚"], [/鮪/, "鮪魚"],
  [/鯖/, "鯖魚"], [/(海魚|白魚|鮮魚|六種魚|漁獲|魚)/, "魚"], [/羊/, "羊"], [/牛/, "牛"], [/鹿/, "鹿"], [/豬/, "豬"],
  [/禽/, "禽肉"],
];

function nameMeatsOf(p: Product): string {
  const hit = NAME_MEATS.filter(([re]) => re.test(p.name)).map(([, zh]) => zh);
  // 「鮭魚」「鮪魚」已經講了是魚，不用再多一個「魚」
  const out = hit.filter((m) => !(m === "魚" && hit.some((x) => x.endsWith("魚") && x !== "魚")));
  return [...new Set(out)].join("、");
}

export function statusOf(p: Product): CheckStatus {
  const src = p.spec.proteinSources;
  if (src.includes("chicken")) return /(?<!火)雞/.test(p.name) ? "chicken" : "hidden";
  if (src.includes("poultry") || src.includes("animal")) return "unsure";
  // 蛋白質沒有雞，但核對時看到油脂用雞脂肪（FirstMate 海魚）
  const c = cases.get(p.id);
  const text = [c?.verdict, ...(Array.isArray(c?.found) ? c!.found : [c?.found ?? ""])].join(" ");
  if (/雞(脂|油)/.test(text)) return "fat";
  return "clean";
}

function perKgOf(p: Product): number | null {
  const m = anchorOf(p, "safe");
  return m ? pricePerKg(unitOf(p, m), m.amount) : null;
}

/** 同一類、完全不含雞、能買的，照「對雞過敏」跑一次裁決，答案排第一，其他照每公斤排 */
function altsFor(p: Product): CheckItem["alts"] {
  const form = formOf(p);
  const s = { species: p.species, form, avoid: ["chicken" as const], symptoms: [], constraints: [] as ReturnType<typeof constraintsFor> };
  s.constraints = constraintsFor(s);
  const v = adjudicate(catalog, s);
  // 類目還沒開張（罐頭）裁決器不回答，就直接拿同一類能買的
  const pool = v.stop ? catalogOf(p.species, form) : v.survivors;
  const clean = pool.filter((x) => x.id !== p.id && recommendable(x) && statusOf(x) === "clean");
  const first = v.pick && clean.some((x) => x.id === v.pick!.id) ? [v.pick] : [];
  const rest = clean.filter((x) => x.id !== v.pick?.id).sort((a, b) => (perKgOf(a) ?? 1e9) - (perKgOf(b) ?? 1e9));
  return [...first, ...rest].slice(0, 3).map((x) => ({
    id: x.id, brand: x.brand, name: x.name, href: productHref(x), per: form === "dry" ? perKgOf(x) : null,
  }));
}

export function checkItems(): CheckItem[] {
  return catalog.map((p) => {
    const status = statusOf(p);
    const c = cases.get(p.id);
    const found = c?.found ? (Array.isArray(c.found) ? c.found : [c.found]) : undefined;
    const cat = categoryOf(p.species, formOf(p));
    const buy = recommendable(p) ? anchorOf(p, "safe") : undefined;
    return {
      id: p.id, brand: p.brand, name: p.name, species: p.species, cat: cat.zh,
      status, nameMeats: nameMeatsOf(p), meats: meatsOf(p),
      ...(found ? { found } : {}),
      ...(c?.verdict || c?.why ? { verdict: [c.verdict, c.why].filter(Boolean).join(" ") } : {}),
      href: productHref(p),
      ...(buy ? { buyId: buy.id } : {}),
      ...(status !== "clean" ? { alts: altsFor(p) } : {}),
    };
  });
}

/** 頁首那句話的數字 */
export function checkStats(items: CheckItem[]) {
  const unnamed = items.filter((x) => !/(?<!火)雞/.test(x.name));
  return {
    total: items.length,
    unnamed: unnamed.length,
    hidden: unnamed.filter((x) => x.status === "hidden").length,
    unsure: unnamed.filter((x) => x.status === "unsure").length,
    clean: items.filter((x) => x.status === "clean").length,
  };
}
