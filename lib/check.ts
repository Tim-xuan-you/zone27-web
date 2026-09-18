import type { Product, ProteinSource } from "./types";
import { catalog, catalogOf, constraintsFor } from "./catalog";
import { adjudicate, anchorOf, formOf, pricePerKg, recommendable, unitOf } from "./engine";
import { categoryOf } from "./categories";
import { meatsFrom, meatsOf, productHref } from "./labels";
import { chickenStatusOf, nameMeatsOf, NAME_HAS_CHICKEN } from "./chicken";
import extra from "../data/check-extra.json";

/**
 * 「你家那包有沒有藏雞」的資料。
 *
 * 2026-09-13 Tim：「我們網站好像沒什麼獨有特色。」
 * 有，只是藏在文章裡：讀過的 42 款，名字沒寫雞的 26 款裡，9 款成分表裡有雞，3 款只寫「禽肉」「動物蛋白」。
 * （2026-09-13 再加 16 款只讀成分表的常見款，數字一律由 checkStats 算，這裡不再改）
 * 這一頁把它做成一個查得到的工具：打名字，馬上知道有沒有雞、第幾項、要換的話換哪一包。
 *
 * 有沒有雞的判定和證據，匯入時就寫進商品資料（Product.chicken，見 lib/chicken.ts），
 * 這裡只負責排成一頁，順便算「要換的話換哪一包」。
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
  /** 商品頁。只讀了成分表的那幾款（data/check-extra.json）沒有商品頁 */
  href?: string;
  /** 搜尋用的別名：「皇家 室內貓 IN27」「希寶 Sheba」。大家留言丟的名字不會照包裝全名打 */
  alias?: string;
  /** 能買才有：/go/ 的通路 id */
  buyId?: string;
  /** 有雞的：同一類不含雞、能買的幾款 */
  alts?: { id: string; brand: string; name: string; href: string; per: number | null }[];
}

export function statusOf(p: Product): CheckStatus {
  return p.chicken?.status ?? chickenStatusOf(p.name, p.spec.proteinSources);
}

function perKgOf(p: Product): number | null {
  const m = anchorOf(p, "safe");
  return m ? pricePerKg(unitOf(p, m), m.amount) : null;
}

/**
 * 幼貓專用的，替代的也要幼貓吃得了；老貓專用的同理。成犬成貓、全齡的不帶年紀
 * （2026-09-13：皇家 K36 幼貓下面原本會列成貓才能吃的）
 */
function ageFor(species: "dog" | "cat", stage?: string[]): number | undefined {
  if (!stage || stage.length !== 1) return undefined;
  if (stage[0] === "puppy") return 0.5;
  if (stage[0] === "senior") return species === "cat" ? 12 : 9;
  return undefined;
}

/**
 * 同一類、完全不含雞、能買的替代款。
 *
 * 排序：同一個牌子的排最前面，再來是裁決器的答案，其他照每公斤。
 *
 * 2026-09-18：紐頓 T22 有雞，同一個牌子的 T24 沒有。對正在餵 T22 的人來說，
 * 換 T24 是阻力最小的一步 —— 一樣的牌子、一樣的顆粒大小、貓通常肯吃，
 * 雖然它每公斤比第一饗宴貴。照價錢排的話 T24 會被擠出前三名，那一換就斷了。
 */
function altsFor(p: Pick<Product, "id" | "species" | "brand"> & { form: "dry" | "wet"; stage?: string[] }): CheckItem["alts"] {
  const form = p.form;
  const ageYears = ageFor(p.species, p.stage);
  const s = {
    species: p.species, form, avoid: ["chicken" as const], symptoms: [], constraints: [] as ReturnType<typeof constraintsFor>,
    ...(ageYears !== undefined ? { ageYears } : {}),
  };
  s.constraints = constraintsFor(s);
  const v = adjudicate(catalog, s);
  // 類目還沒開張（罐頭）裁決器不回答，就直接拿同一類能買的
  const pool = v.stop ? catalogOf(p.species, form) : v.survivors;
  const clean = pool.filter((x) => x.id !== p.id && recommendable(x) && statusOf(x) === "clean");
  const brandKey = p.brand.split(/[（(\s]/)[0];
  const sameBrand = clean.filter((x) => brandKey && x.brand.startsWith(brandKey));
  const first = v.pick && clean.some((x) => x.id === v.pick!.id) ? [v.pick] : [];
  const rest = clean
    .filter((x) => x.id !== v.pick?.id && !sameBrand.some((s) => s.id === x.id))
    .sort((a, b) => (perKgOf(a) ?? 1e9) - (perKgOf(b) ?? 1e9));
  const ordered = [...sameBrand, ...first.filter((x) => !sameBrand.some((s) => s.id === x.id)), ...rest];
  return ordered.slice(0, 3).map((x) => ({
    id: x.id, brand: x.brand, name: x.name, href: productHref(x), per: form === "dry" ? perKgOf(x) : null,
  }));
}

export function checkItems(): CheckItem[] {
  const sold = catalog.map((p): CheckItem => {
    const status = statusOf(p);
    const cat = categoryOf(p.species, formOf(p));
    const buy = recommendable(p) ? anchorOf(p, "safe") : undefined;
    return {
      id: p.id, brand: p.brand, name: p.name, species: p.species, cat: cat.zh,
      status, nameMeats: nameMeatsOf(p.name), meats: meatsOf(p),
      ...(p.chicken?.found ? { found: p.chicken.found } : {}),
      ...(p.chicken?.verdict ? { verdict: p.chicken.verdict } : {}),
      href: productHref(p),
      ...(buy ? { buyId: buy.id } : {}),
      ...(status !== "clean" ? { alts: altsFor({ id: p.id, species: p.species, brand: p.brand, form: formOf(p), stage: p.spec.lifeStage }) } : {}),
    };
  });
  return [...sold, ...readOnly()];
}

/*
 * 只讀了成分表的那幾款（data/check-extra.json）。
 *
 * 大家留言丟的是自己家在吃的：皇家、希寶、耐吉斯、優格。這些我們沒有連結，
 * 但讀得到成分表。讀了放上來，有雞的底下一樣給「完全不含雞、我們讀過的」，那幾款是能買的。
 * 沒有商品頁、沒有購買按鈕（我們只連自己的分潤連結）。來源網址（refs）不帶出去。
 */
type Extra = {
  id: string; species: "dog" | "cat"; form: "dry" | "wet"; brand: string; name: string; alias?: string;
  /** 幼年、高齡專用才寫（["puppy"]、["senior"]），替代的照這個年紀挑 */
  stage?: string[];
  proteins: string[]; found: string[]; verdict: string;
};
function readOnly(): CheckItem[] {
  const ids = new Set(catalog.map((p) => p.id));
  return (extra.items as Extra[]).map((x) => {
    // 補成完整商品之後，這裡那一筆要刪掉。忘了刪就在建置時擋下來，同一款不能出現兩次
    if (ids.has(x.id)) throw new Error(`check-extra.json 的 ${x.id} 跟商品資料撞號`);
    const proteins = x.proteins as ProteinSource[];
    const status = chickenStatusOf(x.name, proteins, [x.verdict, ...x.found].join(" "));
    return {
      id: x.id, brand: x.brand, name: x.name, species: x.species, cat: categoryOf(x.species, x.form).zh,
      status, nameMeats: nameMeatsOf(x.name), meats: meatsFrom(proteins),
      found: x.found, verdict: x.verdict,
      ...(x.alias ? { alias: x.alias } : {}),
      ...(status !== "clean" ? { alts: altsFor(x) } : {}),
    };
  });
}

/** 頁首那句話的數字 */
export function checkStats(items: CheckItem[]) {
  const unnamed = items.filter((x) => !NAME_HAS_CHICKEN.test(x.name));
  return {
    total: items.length,
    unnamed: unnamed.length,
    hidden: unnamed.filter((x) => x.status === "hidden").length,
    unsure: unnamed.filter((x) => x.status === "unsure").length,
    clean: items.filter((x) => x.status === "clean").length,
  };
}
