/**
 * 學習單的 PDF、預覽圖、分享圖放在哪裡（scripts/worksheets-assets.ts 在本機產生，跟程式碼一起提交）。
 * 頁面只拿網址，不碰檔案。
 */
import type { GuessMode } from "./guess";

export const ASSET_DIR = "worksheets/files";
const at = (f: string) => `/${ASSET_DIR}/${f}`;

/** 一張的題目 PDF（1 頁） */
export const sheetPdf = (id: string) => at(`${id}.pdf`);
/** 一張的預覽圖（WebP，給頁面和 Google 圖片搜尋） */
export const sheetImg = (id: string) => at(`${id}.webp`);
/** 一關 5 張題目一個 PDF */
export const levelPdf = (level: number) => at(`acorn-${level}.pdf`);
/** 一關 5 張的提示和答案 */
export const levelAnswersPdf = (level: number) => at(`acorn-${level}-answers.pdf`);
export const levelOg = (level: number) => at(`acorn-${level}-og.jpg`);
/** 注音猜猜看：每一張有圈圈看、寫寫看兩種，各自一個 PDF、預覽圖 */
export const guessSheetPdf = (id: string, m: GuessMode) => at(`${id}-${m}.pdf`);
export const guessSheetImg = (id: string, m: GuessMode) => at(`${id}-${m}.webp`);
/** 一關幾張一個 PDF（同一種玩法） */
export const guessLevelPdf = (level: number, m: GuessMode) => at(`zhuyin-${level}-${m}.pdf`);
export const guessAnswersPdf = (level: number) => at(`zhuyin-${level}-answers.pdf`);
export const guessLevelOg = (level: number) => at(`zhuyin-${level}-og.jpg`);
/** 連連看：每一張的 PDF、預覽圖跟撿松果一樣用 sheetPdf(id)、sheetImg(id)；一個主題幾張一個 PDF */
export const matchThemePdf = (theme: string) => at(`match-${theme}.pdf`);
export const matchAnswersPdf = (theme: string) => at(`match-${theme}-answers.pdf`);
export const matchOg = (theme: string) => at(`match-${theme}-og.jpg`);
export const ASSETS = {
  matchOg: at("match-og.jpg"),
  zhuyinOg: at("zhuyin-og.jpg"),
  acornOg: at("acorn-og.jpg"),
  worksheetsOg: at("worksheets-og.jpg"),
  makeOg: at("make-og.jpg"),
  makeAcornPdf: at("make-acorn.pdf"),
  makeFreePdf: at("make-free.pdf"),
  makeAcornImg: at("make-acorn.webp"),
  makeFreeImg: at("make-free.webp"),
};
/** 預覽圖的實際尺寸（794×1123 的 1.2 倍），img 要寫寬高，版面才不會跳 */
export const SHEET_IMG = { w: 953, h: 1348 };
