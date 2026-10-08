import { ACORN_LEVELS, acornLevel, type AcornLevel } from "./acorn";
import { acornSheetsOf } from "./acorn-sheets";
import { guessAnswersPdf, guessLevelOg, guessLevelPdf, guessSheetImg, guessSheetPdf, levelAnswersPdf, levelOg, levelPdf, sheetImg, sheetPdf } from "./assets";
import { GUESS_LEVELS, guessLevel } from "./guess";
import { guessSheetsOf } from "./guess-sheets";

/**
 * 學習單的結構化資料（schema.org JSON-LD）：給 Google 和 AI 看的「這一頁是什麼」。
 *
 * 2026-10-09 Tim：SEO、GEO 最優先。學習單這種東西，搜尋引擎跟 AI 要知道的是：
 * 免費的、給幾歲、是 PDF 學習單、誰做的、檔案在哪。寫進 LearningResource，
 * AI 回答「有沒有免費的大班迷宮學習單」的時候，才拿得到一整組可以引用的事實。
 *
 * 只寫看得到、做得到的事：頁面上沒寫的不放進來（Google 的規定，也是我們的規矩）。
 */

export const SITE = "https://zone27.com.tw";
export const ORG_ID = `${SITE}/#org`;
export const TIM_ID = `${SITE}/about#tim`;

export const TIM = {
  "@type": "Person",
  "@id": TIM_ID,
  name: "Tim",
  description: "一個大班生的爸爸。孩子卡住的地方，做成一關一關的學習單。",
  url: `${SITE}/about`,
};

/** 每一關適合的年齡（schema.org 的 typicalAgeRange 格式） */
export const ageRange = (L: AcornLevel): string => (L.n <= 3 ? "5-6" : L.n <= 5 ? "6-7" : "7-8");

export function breadcrumb(items: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE}${path}` })),
  };
}

export function faq(qa: [string, string][]) {
  return {
    "@type": "FAQPage",
    mainEntity: qa.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

const common = {
  inLanguage: "zh-Hant-TW",
  isAccessibleForFree: true,
  learningResourceType: "學習單",
  educationalUse: "在家、在班上練習",
  teaches: "照規則先規劃路線再下筆",
  author: { "@id": TIM_ID },
  publisher: { "@id": ORG_ID },
};

/** 一關：5 張學習單、整關 PDF、提示和答案 */
export function levelResource(n: number) {
  const L = acornLevel(n);
  const url = `${SITE}/worksheets/acorn/${n}`;
  return {
    "@type": "LearningResource",
    "@id": `${url}#level`,
    name: `撿松果回家 第 ${n} 關（${L.grade}迷宮學習單）`,
    description: `${L.W}×${L.H} 的迷宮，每題 ${L.acMin}～${L.acMax} 顆松果，每一顆都要撿到、每個格子只能走一次。5 張 A4 學習單，每張 2 題，說明都有注音，每一題都只有一個答案。`,
    url,
    image: `${SITE}${levelOg(n)}`,
    educationalLevel: L.grade,
    typicalAgeRange: ageRange(L),
    ...common,
    encoding: [
      { "@type": "MediaObject", name: `第 ${n} 關 5 張題目`, contentUrl: `${SITE}${levelPdf(n)}`, encodingFormat: "application/pdf" },
      { "@type": "MediaObject", name: `第 ${n} 關提示和答案`, contentUrl: `${SITE}${levelAnswersPdf(n)}`, encodingFormat: "application/pdf" },
    ],
    hasPart: acornSheetsOf(n).map((s) => ({
      "@type": "LearningResource",
      name: `撿松果回家 第 ${n} 關第 ${s.n} 張`,
      url: `${url}?n=${s.n}`,
      image: `${SITE}${sheetImg(s.id)}`,
      typicalAgeRange: ageRange(L),
      ...common,
      encoding: { "@type": "MediaObject", contentUrl: `${SITE}${sheetPdf(s.id)}`, encodingFormat: "application/pdf" },
    })),
  };
}

/** 撿松果回家整組：6 關 */
export function acornSeries() {
  return {
    "@type": "ItemList",
    name: "撿松果回家：幼兒迷宮學習單",
    numberOfItems: ACORN_LEVELS.length,
    itemListElement: ACORN_LEVELS.map((L, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/worksheets/acorn/${L.n}`,
      name: `第 ${L.n} 關（${L.grade}，${L.W}×${L.H}）`,
    })),
  };
}

/** 注音猜猜看每一關的年齡 */
export const guessAgeRange = (n: number): string => (n <= 2 ? "5-6" : "6-7");

/** 注音猜猜看一關：幾張學習單，兩種玩法各一個 PDF、答案 */
export function guessLevelResource(n: number) {
  const L = guessLevel(n);
  const url = `${SITE}/worksheets/zhuyin/${n}`;
  const sheets = guessSheetsOf(n);
  const zy = { ...common, teaches: "看注音認出是什麼東西，再自己寫出注音（符號和聲調）" };
  return {
    "@type": "LearningResource",
    "@id": `${url}#level`,
    name: `注音猜猜看 第 ${n} 關：${L.name}（${L.grade}注音學習單）`,
    description: `${L.what}。${sheets.length} 張 A4，每張 6 題，有圈圈看（看注音圈出對的圖）和寫寫看（看圖寫出注音）兩種，題目一樣。每個詞的注音都對過教育部國語辭典。`,
    url,
    image: `${SITE}${guessLevelOg(n)}`,
    educationalLevel: L.grade,
    typicalAgeRange: guessAgeRange(n),
    ...zy,
    encoding: [
      { "@type": "MediaObject", name: `第 ${n} 關圈圈看 ${sheets.length} 張`, contentUrl: `${SITE}${guessLevelPdf(n, "circle")}`, encodingFormat: "application/pdf" },
      { "@type": "MediaObject", name: `第 ${n} 關寫寫看 ${sheets.length} 張`, contentUrl: `${SITE}${guessLevelPdf(n, "write")}`, encodingFormat: "application/pdf" },
      { "@type": "MediaObject", name: `第 ${n} 關答案`, contentUrl: `${SITE}${guessAnswersPdf(n)}`, encodingFormat: "application/pdf" },
    ],
    hasPart: sheets.map((s) => ({
      "@type": "LearningResource",
      name: `注音猜猜看 第 ${n} 關第 ${s.n} 張`,
      url: `${url}?n=${s.n}`,
      image: `${SITE}${guessSheetImg(s.id, "circle")}`,
      typicalAgeRange: guessAgeRange(n),
      ...zy,
      encoding: [
        { "@type": "MediaObject", name: "圈圈看", contentUrl: `${SITE}${guessSheetPdf(s.id, "circle")}`, encodingFormat: "application/pdf" },
        { "@type": "MediaObject", name: "寫寫看", contentUrl: `${SITE}${guessSheetPdf(s.id, "write")}`, encodingFormat: "application/pdf" },
      ],
    })),
  };
}

export function guessSeries() {
  return {
    "@type": "ItemList",
    name: "注音猜猜看：注音學習單",
    numberOfItems: GUESS_LEVELS.length,
    itemListElement: GUESS_LEVELS.map((L, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/worksheets/zhuyin/${L.n}`,
      name: `第 ${L.n} 關：${L.name}（${L.grade}）`,
    })),
  };
}

/** 包成一個 <script type="application/ld+json"> 的內容 */
export const graph = (...nodes: object[]) => JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
