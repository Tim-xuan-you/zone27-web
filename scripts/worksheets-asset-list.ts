/**
 * 學習單要產生哪些檔案：scripts/worksheets-assets.ts（產生）和 worksheets-assets-check.ts（build 後比對）共用這一份。
 * 新的學習單加在這裡，兩邊就一起有了。
 */
import { ACORN_LEVELS, acornLevel } from "../lib/worksheets/acorn";
import { acornSheetPages } from "../lib/worksheets/acorn-sheet";
import { ACORN_SHEETS, acornSheetsOf } from "../lib/worksheets/acorn-sheets";
import { GUESS_LEVELS } from "../lib/worksheets/guess";
import { guessSheetPages } from "../lib/worksheets/guess-sheet";
import { GUESS_SHEETS, guessSheetsOf } from "../lib/worksheets/guess-sheets";
import { acornMakerPage, freeMakerPage } from "../lib/worksheets/make-sheet";

export type AssetJob =
  | { file: string; kind: "pdf"; svgs: string[] }
  | { file: string; kind: "img"; svgs: [string] }
  | { file: string; kind: "og"; svgs: [string]; kicker: string; title: string; sub: string };

export function assetJobs(): AssetJob[] {
  const jobs: AssetJob[] = [];
  const pdf = (file: string, svgs: string[]) => jobs.push({ file, kind: "pdf", svgs });
  const img = (file: string, svg: string) => jobs.push({ file, kind: "img", svgs: [svg] });
  const og = (file: string, svg: string, kicker: string, title: string, sub: string) => jobs.push({ file, kind: "og", svgs: [svg], kicker, title, sub });

  /* 撿松果回家：每一張題目 PDF、預覽圖；每一關 5 張一個 PDF、提示和答案、分享圖 */
  for (const s of ACORN_SHEETS) {
    const { page1 } = acornSheetPages(s);
    pdf(`${s.id}.pdf`, [page1]);
    img(`${s.id}.webp`, page1);
  }
  for (const L of ACORN_LEVELS) {
    const sheets = acornSheetsOf(L.n).map((s) => acornSheetPages(s));
    const p1 = sheets.map((x) => x.page1);
    pdf(`acorn-${L.n}.pdf`, p1);
    pdf(`acorn-${L.n}-answers.pdf`, sheets.map((x) => x.page2));
    const lv = acornLevel(L.n);
    og(`acorn-${L.n}-og.jpg`, p1[0], `第 ${L.n} 關・${lv.grade}`, "撿松果回家<br>迷宮學習單", `${lv.W}×${lv.H} 格子，5 張 PDF 免費下載`);
  }

  /* 出題紙 */
  const maker = acornMakerPage(), free = freeMakerPage();
  pdf("make-acorn.pdf", [maker]);
  pdf("make-free.pdf", [free]);
  img("make-acorn.webp", maker);
  img("make-free.webp", free);
  og("make-og.jpg", maker, "出題紙・PDF 免費下載", "換你出題", "孩子畫牆、畫松果，出題給大人寫");

  /* 注音猜猜看：每一張有圈圈看、寫寫看兩種，各自一個 PDF、預覽圖；每一關一個 PDF（同一種玩法）、答案、分享圖 */
  for (const s of GUESS_SHEETS) {
    const p = guessSheetPages(s);
    for (const mode of ["circle", "write"] as const) {
      pdf(`${s.id}-${mode}.pdf`, [p[mode]]);
      img(`${s.id}-${mode}.webp`, p[mode]);
    }
  }
  for (const L of GUESS_LEVELS) {
    const sheets = guessSheetsOf(L.n).map((s) => guessSheetPages(s));
    pdf(`zhuyin-${L.n}-circle.pdf`, sheets.map((x) => x.circle));
    pdf(`zhuyin-${L.n}-write.pdf`, sheets.map((x) => x.write));
    pdf(`zhuyin-${L.n}-answers.pdf`, sheets.map((x) => x.answer));
    og(`zhuyin-${L.n}-og.jpg`, sheets[0].circle, `第 ${L.n} 關・${L.grade}`, `注音猜猜看<br>${L.name}`, `${L.what}，PDF 免費下載`);
  }

  /* 各系列、學習單首頁的分享圖 */
  const first = acornSheetPages(ACORN_SHEETS[0]).page1;
  og("acorn-og.jpg", first, "免費下載・A4 PDF", "幼兒迷宮學習單<br>撿松果回家", "中班到小一，6 個關卡、30 張");
  og("zhuyin-og.jpg", guessSheetPages(GUESS_SHEETS[0]).circle, "免費下載・A4 PDF", "注音學習單<br>注音猜猜看", `大班到小一，${GUESS_LEVELS.length} 個關卡，圈圈看、寫寫看`);
  og("worksheets-og.jpg", first, "免費・A4・印了就能寫", "陪孩子動腦的<br>益智學習單", "說明都有注音，不用寫國字，卡住了有提示");
  return jobs;
}
