/**
 * 學習單要產生哪些檔案：scripts/worksheets-assets.ts（產生）和 worksheets-assets-check.ts（build 後比對）共用這一份。
 * 新的學習單加在這裡，兩邊就一起有了。
 */
import { ACORN_LEVELS, acornLevel } from "../lib/worksheets/acorn";
import { acornSheetPages } from "../lib/worksheets/acorn-sheet";
import { ACORN_SHEETS, acornSheetsOf } from "../lib/worksheets/acorn-sheets";
import { GUESS_LEVELS, GUESS_MODES, guessLevel } from "../lib/worksheets/guess";
import { guessSheetPages } from "../lib/worksheets/guess-sheet";
import { GUESS_SHEETS, guessSheetsOf } from "../lib/worksheets/guess-sheets";
import { acornMakerPage, freeMakerPage } from "../lib/worksheets/make-sheet";
import { assetFingerprint } from "./worksheets-fingerprint";
import { MATCH_THEMES, matchTheme } from "../lib/worksheets/match";
import { NUMBER_LEVELS, numberLevel } from "../lib/worksheets/number";
import { numberSheetPages } from "../lib/worksheets/number-sheet";
import { NUMBER_SHEETS, numberSheetsOf } from "../lib/worksheets/number-sheets";
import { matchSheetPages } from "../lib/worksheets/match-sheet";
import { MATCH_SHEETS, matchSheetsOf } from "../lib/worksheets/match-sheets";

export type AssetJob =
  /** title 是 PDF 的標題（Google 搜尋結果上顯示的那一行），寫清楚是什麼、給幾年級 */
  | { file: string; kind: "pdf"; svgs: string[]; title: string }
  | { file: string; kind: "img"; svgs: [string] }
  | { file: string; kind: "og"; svgs: [string]; kicker: string; title: string; sub: string };

export function assetJobs(): AssetJob[] {
  const jobs: AssetJob[] = [];
  const SUFFIX = "｜ZONE 27 免費學習單";
  const pdf = (file: string, svgs: string[], title: string) => jobs.push({ file, kind: "pdf", svgs, title: title + SUFFIX });
  const img = (file: string, svg: string) => jobs.push({ file, kind: "img", svgs: [svg] });
  const og = (file: string, svg: string, kicker: string, title: string, sub: string) => jobs.push({ file, kind: "og", svgs: [svg], kicker, title, sub });

  /* 撿松果回家：每一張題目 PDF、預覽圖；每一關 5 張一個 PDF、提示和答案、分享圖 */
  for (const s of ACORN_SHEETS) {
    const { page1 } = acornSheetPages(s);
    pdf(`${s.id}.pdf`, [page1], `撿松果回家 第 ${s.level} 關第 ${s.n} 張（${acornLevel(s.level).grade}迷宮學習單）`);
    img(`${s.id}.webp`, page1);
  }
  for (const L of ACORN_LEVELS) {
    const sheets = acornSheetsOf(L.n).map((s) => acornSheetPages(s));
    const p1 = sheets.map((x) => x.page1);
    const lv = acornLevel(L.n);
    pdf(`acorn-${L.n}.pdf`, p1, `撿松果回家 第 ${L.n} 關 ${p1.length} 張（${lv.grade}迷宮學習單）`);
    pdf(`acorn-${L.n}-answers.pdf`, sheets.map((x) => x.page2), `撿松果回家 第 ${L.n} 關 提示和答案`);
    og(`acorn-${L.n}-og.jpg`, p1[0], `第 ${L.n} 關・${lv.grade}`, "撿松果回家<br>迷宮學習單", `${lv.W}×${lv.H} 格子，5 張 PDF 免費下載`);
  }

  /* 出題紙 */
  const maker = acornMakerPage(), free = freeMakerPage();
  pdf("make-acorn.pdf", [maker], "換你出題：迷宮出題單（孩子出題給大人寫）");
  pdf("make-free.pdf", [free], "換你出題：萬用出題紙");
  img("make-acorn.webp", maker);
  img("make-free.webp", free);
  og("make-og.jpg", maker, "出題紙・PDF 免費下載", "換你出題", "孩子畫牆、畫松果，出題給大人寫");

  /* 注音猜猜看：每一張有圈圈看、寫寫看兩種，各自一個 PDF、預覽圖；每一關一個 PDF（同一種玩法）、答案、分享圖 */
  for (const s of GUESS_SHEETS) {
    const p = guessSheetPages(s);
    for (const mode of ["circle", "write"] as const) {
      pdf(`${s.id}-${mode}.pdf`, [p[mode]], `注音猜猜看 第 ${s.level} 關第 ${s.n} 張・${GUESS_MODES[mode]}（${guessLevel(s.level).grade}注音學習單）`);
      img(`${s.id}-${mode}.webp`, p[mode]);
    }
  }
  for (const L of GUESS_LEVELS) {
    const sheets = guessSheetsOf(L.n).map((s) => guessSheetPages(s));
    pdf(`zhuyin-${L.n}-circle.pdf`, sheets.map((x) => x.circle), `注音猜猜看 第 ${L.n} 關「${L.name}」圈圈看 ${sheets.length} 張（${L.grade}注音學習單）`);
    pdf(`zhuyin-${L.n}-write.pdf`, sheets.map((x) => x.write), `注音猜猜看 第 ${L.n} 關「${L.name}」寫寫看 ${sheets.length} 張（${L.grade}注音學習單）`);
    pdf(`zhuyin-${L.n}-answers.pdf`, sheets.map((x) => x.answer), `注音猜猜看 第 ${L.n} 關 答案`);
    og(`zhuyin-${L.n}-og.jpg`, sheets[0].circle, `第 ${L.n} 關・${L.grade}`, `注音猜猜看<br>${L.name}`, `${L.what}，PDF 免費下載`);
  }

  /* 連連看：每一張題目 PDF、預覽圖；每個主題幾張一個 PDF、答案、分享圖 */
  for (const s of MATCH_SHEETS) {
    const { page1 } = matchSheetPages(s);
    pdf(`${s.id}.pdf`, [page1], `連連看・${matchTheme(s.theme).name} 第 ${s.n} 張（大班、小一連連看學習單）`);
    img(`${s.id}.webp`, page1);
  }
  for (const T of MATCH_THEMES) {
    const sheets = matchSheetsOf(T.id).map((s) => matchSheetPages(s));
    pdf(`match-${T.id}.pdf`, sheets.map((x) => x.page1), `連連看・${T.name} ${sheets.length} 張（大班、小一連連看學習單）`);
    pdf(`match-${T.id}-answers.pdf`, sheets.map((x) => x.page2), `連連看・${T.name} 答案和小知識`);
    og(`match-${T.id}-og.jpg`, sheets[0].page1, `連連看・${T.name}`, `連連看<br>${T.ask}`, `大班、小一，${sheets.length} 張 PDF 免費下載`);
  }

  /* 數字松果：每一張題目 PDF、預覽圖；每一關 5 張一個 PDF、答案、分享圖 */
  for (const s of NUMBER_SHEETS) {
    const { page1 } = numberSheetPages(s);
    pdf(`${s.id}.pdf`, [page1], `數字松果 第 ${s.level} 關第 ${s.n} 張（${numberLevel(s.level).grade}數學學習單・${numberLevel(s.level).name}加法迷宮）`);
    img(`${s.id}.webp`, page1);
  }
  for (const L of NUMBER_LEVELS) {
    const sheets = numberSheetsOf(L.n).map((s) => numberSheetPages(s));
    pdf(`number-${L.n}.pdf`, sheets.map((x) => x.page1), `數字松果 第 ${L.n} 關 ${sheets.length} 張（${L.grade}數學學習單・${L.name}加法迷宮）`);
    pdf(`number-${L.n}-answers.pdf`, sheets.map((x) => x.page2), `數字松果 第 ${L.n} 關 答案和算式`);
    og(`number-${L.n}-og.jpg`, sheets[0].page1, `第 ${L.n} 關・${L.grade}`, `數字松果<br>${L.name}`, `加法迷宮，${sheets.length} 張 PDF 免費下載`);
  }

  /* 各系列、學習單首頁的分享圖 */
  const first = acornSheetPages(ACORN_SHEETS[0]).page1;
  og("acorn-og.jpg", first, "免費下載・A4 PDF", "幼兒迷宮學習單<br>撿松果回家", "中班到小一，6 個關卡、30 張");
  og("zhuyin-og.jpg", guessSheetPages(GUESS_SHEETS[0]).circle, "免費下載・A4 PDF", "注音學習單<br>注音猜猜看", `大班到小一，${GUESS_LEVELS.length} 個關卡，圈圈看、寫寫看`);
  og("match-og.jpg", matchSheetPages(MATCH_SHEETS[0]).page1, "免費下載・A4 PDF", "幼兒連連看<br>學習單", "誰吃什麼、長大變成什麼，答案都查過");
  og("number-og.jpg", numberSheetPages(NUMBER_SHEETS[0]).page1, "免費下載・A4 PDF", "數學學習單<br>數字松果", "加法迷宮，大班 10 以內到小一 20 以內");
  og("worksheets-og.jpg", first, "免費・A4・印了就能寫", "陪孩子動腦的<br>益智學習單", "說明都有注音，不用寫國字，卡住了有提示");
  return jobs;
}

/** 指紋：學習單內容（SVG）加上 PDF 的標題，任何一個改了就要重產 */
export const jobFingerprint = (j: AssetJob): string => assetFingerprint(j.kind === "pdf" ? [j.title, ...j.svgs] : j.svgs);
