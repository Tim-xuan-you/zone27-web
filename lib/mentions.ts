import type { Product, Species } from "./types";
import { catalog } from "./catalog";
import { litters } from "./litter";
import { treats } from "./treat";

/**
 * 這句話裡提到了哪一款。
 *
 * 台灣飼主最常問的其實是「我家現在吃 XX，好不好？」，不是「幫我挑一款」。
 * 以前打「紐頓 T22」進裁決器，只會得到「讀不出條件」（2026-09-13 Tim：怎麼搜都搜不到）。
 *
 * 做法刻意保守，寧可找不到，也不要亂對：
 *   1. 一定要先對到品牌（紐頓、Nutram、希爾思、歐睿健、渴望…）或型號（T22、A30+11）
 *      「雞肉」「成貓」這種字每一句描述狀況的話都會有，不能單獨拿來對
 *   2. 對到品牌之後，再看品名裡的字（羊肉、六種鮮魚、高齡活力…）縮小範圍
 *   3. 句子裡講了是貓還是狗，就只留那一種
 */

const norm = (s: string) => s.toLowerCase().replace(/[\s'’!！]/g, "");

/** 品牌可能的叫法：「ORIJEN 歐睿健（原渴望）」→ orijen、歐睿健、原渴望、渴望 */
function brandKeys(p: Product): string[] {
  const keys = new Set<string>();
  for (const t of p.brand.split(/[\s（）()]+/).filter(Boolean)) {
    const k = norm(t);
    if (k.length < 2) continue;
    keys.add(k);
    // 「原渴望」「法國皇家」這種，讀者多半只打後半
    if (/^原./.test(t) && t.length >= 3) keys.add(norm(t.slice(1)));
    if (/^法國./.test(t)) keys.add(norm(t.slice(2)));
  }
  return [...keys];
}

/** 型號：T22、T27、A30+11、A30+11W */
function codes(p: Product): string[] {
  return (p.name.match(/[A-Z]\d{1,3}(?:\+\d{1,2}W?)?/g) ?? []).map(norm);
}

/** 品名裡的兩個字一組：「美膚羊肉+蘋果」→ 美膚、膚羊、羊肉、蘋果… 句子裡有對到幾組 */
function lineScore(p: Product, t: string): number {
  const grams = new Set<string>();
  for (const tok of p.name.split(/[\s＋+（）()、，,]+/)) {
    const cjk = tok.replace(/[^一-鿿]/g, "");
    for (let i = 0; i + 2 <= cjk.length; i++) grams.add(cjk.slice(i, i + 2));
  }
  return [...grams].filter((g) => t.includes(g)).length;
}

export function mentionedProducts(text: string, species?: Species): Product[] {
  const t = norm(text);
  if (!t) return [];
  let hits = catalog
    .map((p) => {
      const code = Math.max(0, ...codes(p).filter((k) => t.includes(k)).map((k) => k.length));
      return { p, brand: brandKeys(p).some((k) => t.includes(k)), code, line: lineScore(p, t) };
    })
    .filter((h) => h.code > 0 || h.brand);
  if (hits.length === 0) return [];

  // 講了貓或狗，就只留那一種（對不到的話就不濾，免得打錯切換鈕就什麼都沒有）
  if (species && hits.some((h) => h.p.species === species)) hits = hits.filter((h) => h.p.species === species);
  // 有型號就只看型號對得最長的：「A30+11W」不要連「A30+11」一起帶出來
  const longest = Math.max(...hits.map((h) => h.code));
  if (longest > 0) hits = hits.filter((h) => h.code === longest);
  // 品名的字對得最多的那幾款
  const best = Math.max(...hits.map((h) => h.line));
  return hits.filter((h) => h.line === best).map((h) => h.p).slice(0, 4);
}

/* ------------------------------------------------------------------ */
/* 貓砂、零食也要搜得到                                                 */
/*                                                                    */
/* 2026-09-20 Tim 在裁決器打「啾嚕肉泥」，得到「這句話我們讀不出條件」。 */
/* 那當下網站上有三款啾嚕肉泥，全部有購買連結。                          */
/*                                                                    */
/* 原因是上面那支只搜 catalog（飼料那三個類目）。貓砂、貓零食、狗零食     */
/* 各有自己的資料檔，一個都沒進來。類目越加越多，這個前門就越破。         */
/*                                                                    */
/* 這一段不做裁決 —— 那幾個類目有自己的規則。它只做一件事：              */
/* 我們有這一款，帶你去那一頁。                                          */
/* ------------------------------------------------------------------ */

export interface OtherHit {
  id: string;
  brand: string;
  name: string;
  href: string;
  /** 畫面上那一句「這是貓砂」「這是貓零食」 */
  kindZh: string;
}

interface Simple {
  id: string;
  brand: string;
  name: string;
  species?: Species;
}

function keysOf(s: Simple): string[] {
  const keys = new Set<string>();
  for (const t of s.brand.split(/[\s（）()]+/).filter(Boolean)) {
    const k = norm(t);
    if (k.length < 2) continue;
    keys.add(k);
    // 三個字以上的中文牌子，讀者通常只打前兩個：汪喵星球 → 汪喵、防御工事 → 防御
    if (/^[一-鿿]{3,}$/.test(t)) keys.add(norm(t.slice(0, 2)));
  }
  return [...keys];
}

function lineScoreOf(name: string, t: string): number {
  const grams = new Set<string>();
  for (const tok of name.split(/[\s＋+（）()、，,]+/)) {
    const cjk = tok.replace(/[^一-鿿]/g, "");
    for (let i = 0; i + 2 <= cjk.length; i++) grams.add(cjk.slice(i, i + 2));
  }
  return [...grams].filter((g) => t.includes(g)).length;
}

/** 貓砂、貓零食、狗零食裡有沒有提到的那一款 */
export function mentionedOthers(text: string, species?: Species): OtherHit[] {
  const t = norm(text);
  if (!t) return [];

  const pool: { s: Simple; href: string; kindZh: string }[] = [
    ...litters.map((p) => ({
      s: { id: p.id, brand: p.brand, name: p.name, species: "cat" as Species },
      href: `/cat-litter/p/${p.id}`,
      kindZh: "貓砂",
    })),
    ...treats.map((p) => ({
      s: { id: p.id, brand: p.brand, name: p.name, species: p.species },
      href: p.species === "dog" ? `/dog-treat/p/${p.id}` : `/cat-treat/p/${p.id}`,
      kindZh: p.species === "dog" ? "狗零食" : "貓零食",
    })),
  ];

  let hits = pool
    .map((x) => ({ ...x, brand: keysOf(x.s).some((k) => t.includes(k)), line: lineScoreOf(x.s.name, t) }))
    // 品名對到兩組字以上也算：「太空小零嘴」這種名字，讀者常常不打牌子
    .filter((h) => h.brand || h.line >= 2);
  if (hits.length === 0) return [];

  if (species && hits.some((h) => h.s.species === species)) hits = hits.filter((h) => h.s.species === species);
  /* 有對到牌子就只看那幾款。
     不然打「臭味滾豆腐砂」會因為「豆腐砂」三個字，把別家的豆腐砂一起帶出來，
     真正的臭味滾反而被擠掉 —— 那比沒搜到還糟。 */
  if (hits.some((h) => h.brand)) hits = hits.filter((h) => h.brand);
  const best = Math.max(...hits.map((h) => h.line));
  return hits
    .filter((h) => h.line === best)
    .slice(0, 4)
    .map((h) => ({ id: h.s.id, brand: h.s.brand, name: h.s.name, href: h.href, kindZh: h.kindZh }));
}
