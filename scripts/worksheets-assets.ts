/**
 * 學習單的 PDF、預覽圖、分享圖：用本機的 Edge 輸出，放進 public/worksheets/。
 *
 * 2026-10-09 為什麼要做：查 Google 搜尋框的建議字，家長打的幾乎都帶「下載」「pdf」
 * （幼兒迷宮pdf、大班學習單下載、注音學習單下載）。他們要的是一個檔案：
 *   手機直接下載、傳到 LINE、拿去超商印，比從列印視窗「存成 PDF」簡單太多
 *   PDF 本身 Google 也會收，搜「幼兒迷宮 pdf」有機會直接找到這個檔案
 * 預覽圖（WebP）給 Google 圖片搜尋，也讓頁面不用塞五張完整的 SVG，載入快很多。
 *
 * Vercel 上沒有瀏覽器，沒辦法在建置的時候產生，所以在本機產生、跟程式碼一起提交。
 * 學習單長相一改（字、版面、題目），一定要重跑這支：manifest 記了每一張的指紋，
 * build 後的 scripts/worksheets-assets-check.ts 會比對，舊的檔案沒更新就擋下來。
 *
 * 用法：npx tsx scripts/worksheets-assets.ts（要先能連網，字型從 Google Fonts 載）
 */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { ACORN_LEVELS, acornLevel } from "../lib/worksheets/acorn";
import { acornSheetPages } from "../lib/worksheets/acorn-sheet";
import { ACORN_SHEETS, acornSheetsOf } from "../lib/worksheets/acorn-sheets";
import { acornMakerPage, freeMakerPage } from "../lib/worksheets/make-sheet";
import { ASSET_DIR } from "../lib/worksheets/assets";
import { assetFingerprint } from "./worksheets-fingerprint";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "public", ASSET_DIR);
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9701;

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Iansui&family=Noto+Sans+TC:wght@400;700;800&display=block" rel="stylesheet">`;
const A4_CSS = `@page{size:A4;margin:0} html,body{margin:0;background:#fff} .p{width:210mm;height:297mm;overflow:hidden;break-after:page} .p:last-child{break-after:auto} .p svg{width:210mm;height:297mm;display:block}`;
const a4Html = (pages: string[]) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${A4_CSS}</style></head><body>${pages.map((p) => `<div class="p">${p}</div>`).join("")}</body></html>`;

/* ---------------- 開一個沒有介面的 Edge，用 DevTools 協定操作 ---------------- */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "ws-edge-"))}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
let ws!: WebSocket;
let seq = 0;
const pending = new Map<number, (m: { result?: Record<string, unknown> }) => void>();
async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
      const page = list.find((t) => t.type === "page");
      if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); break; }
    } catch { /* Edge 還沒起來 */ }
    await sleep(250);
  }
  await new Promise((r) => ws.addEventListener("open", r));
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(String(e.data));
    if (m.id && pending.has(m.id)) { pending.get(m.id)!(m); pending.delete(m.id); }
  });
}
const send = (method: string, params: Record<string, unknown> = {}) =>
  new Promise<{ result?: Record<string, unknown> }>((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });

const tmp = mkdtempSync(join(tmpdir(), "ws-html-"));
let n = 0;
async function open(html: string, w: number, h: number, dpr = 1) {
  const f = join(tmp, `p${++n}.html`);
  writeFileSync(f, html);
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: dpr, mobile: false });
  await send("Page.navigate", { url: pathToFileURL(f).href });
  await sleep(700);
  await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => 1)", awaitPromise: true });
  await sleep(200);
}
async function pdf(html: string, file: string) {
  await open(html, 794, 1123);
  const r = await send("Page.printToPDF", { preferCSSPageSize: true, printBackground: true });
  writeFileSync(join(OUT, file), Buffer.from(String(r.result!.data), "base64"));
}
async function shot(html: string, file: string, w: number, h: number, format: "webp" | "jpeg", dpr = 1) {
  await open(html, w, h, dpr);
  const r = await send("Page.captureScreenshot", { format, quality: 82, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
  writeFileSync(join(OUT, file), Buffer.from(String(r.result!.data), "base64"));
}

/* ---------------- 分享圖：左邊字、右邊斜放一張學習單 ---------------- */
function ogHtml(kicker: string, title: string, sub: string, sheetSvg: string) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#F7F9FC;font-family:'Noto Sans TC',sans-serif;color:#262B31}
.wrap{display:flex;height:630px;align-items:center;padding:0 0 0 72px;box-sizing:border-box}
.txt{flex:1;padding-right:24px}
.k{display:inline-block;font-weight:800;font-size:26px;color:#1A6FBF;background:#E6F1FB;border-radius:999px;padding:6px 20px}
.t{font-family:Iansui,serif;font-size:66px;line-height:1.25;margin:22px 0 18px}
.s{font-size:28px;color:#565E68;line-height:1.5}
.site{margin-top:28px;font-size:24px;font-weight:700;color:#E8781A}
.sheet{width:400px;margin-right:70px;transform:rotate(3deg);box-shadow:0 20px 50px -20px rgba(30,45,70,.45);border-radius:8px;overflow:hidden;background:#fff}
.sheet svg{width:400px;height:auto;display:block}
</style></head><body><div class="wrap"><div class="txt"><div class="k">${kicker}</div><div class="t">${title}</div><div class="s">${sub}</div><div class="site">zone27.com.tw</div></div><div class="sheet">${sheetSvg}</div></div></body></html>`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  await connect();
  const manifest: Record<string, string> = {};
  const done = (file: string, svgs: string[]) => { manifest[file] = assetFingerprint(svgs); console.log("  ", file); };

  // 每一張：題目 PDF、預覽圖
  for (const s of ACORN_SHEETS) {
    const { page1 } = acornSheetPages(s);
    await pdf(a4Html([page1]), `${s.id}.pdf`); done(`${s.id}.pdf`, [page1]);
    await shot(a4Html([page1]), `${s.id}.webp`, 794, 1123, "webp", 1.2); done(`${s.id}.webp`, [page1]);
  }
  // 每一關：5 張題目一個 PDF、5 張提示和答案一個 PDF、分享圖
  for (const L of ACORN_LEVELS) {
    const sheets = acornSheetsOf(L.n).map((s) => acornSheetPages(s));
    const p1 = sheets.map((x) => x.page1), p2 = sheets.map((x) => x.page2);
    await pdf(a4Html(p1), `acorn-${L.n}.pdf`); done(`acorn-${L.n}.pdf`, p1);
    await pdf(a4Html(p2), `acorn-${L.n}-answers.pdf`); done(`acorn-${L.n}-answers.pdf`, p2);
    const lv = acornLevel(L.n);
    await shot(ogHtml(`第 ${L.n} 關・${lv.grade}`, "撿松果回家<br>迷宮學習單", `${lv.W}×${lv.H} 格子，5 張 PDF 免費下載`, p1[0]), `acorn-${L.n}-og.jpg`, 1200, 630, "jpeg");
    done(`acorn-${L.n}-og.jpg`, [p1[0]]);
  }
  // 出題紙
  const maker = acornMakerPage(), free = freeMakerPage();
  await pdf(a4Html([maker]), "make-acorn.pdf"); done("make-acorn.pdf", [maker]);
  await pdf(a4Html([free]), "make-free.pdf"); done("make-free.pdf", [free]);
  await shot(a4Html([maker]), "make-acorn.webp", 794, 1123, "webp", 1.2); done("make-acorn.webp", [maker]);
  await shot(a4Html([free]), "make-free.webp", 794, 1123, "webp", 1.2); done("make-free.webp", [free]);
  await shot(ogHtml("出題紙・PDF 免費下載", "換你出題", "孩子畫牆、畫松果，出題給大人寫", maker), "make-og.jpg", 1200, 630, "jpeg"); done("make-og.jpg", [maker]);
  // 撿松果回家、學習單首頁的分享圖
  const first = acornSheetPages(ACORN_SHEETS[0]).page1;
  await shot(ogHtml("免費下載・A4 PDF", "幼兒迷宮學習單<br>撿松果回家", "中班到小一，6 個關卡、30 張", first), "acorn-og.jpg", 1200, 630, "jpeg"); done("acorn-og.jpg", [first]);
  await shot(ogHtml("免費・A4・印了就能寫", "陪孩子動腦的<br>益智學習單", "說明都有注音，答案用畫的，卡住了有提示", first), "worksheets-og.jpg", 1200, 630, "jpeg"); done("worksheets-og.jpg", [first]);

  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
  console.log(`\n寫好 ${Object.keys(manifest).length} 個檔案到 public/${ASSET_DIR}/`);
  await closeEdge();
}

/*
 * 關 Edge 要請它自己關（Browser.close），它會連底下的分頁、GPU 程序一起收掉。
 * 2026-10-09 之前的截圖程式只 kill 最上層那一個，底下的程序全部留著，
 * 一週累積了 659 個、吃掉 57 GB 記憶體，整台電腦慢到連 tsc 都跑不動。
 */
async function closeEdge() {
  try { await Promise.race([send("Browser.close"), sleep(3000)]); } catch { /* 已經關了 */ }
  try { ws.close(); } catch { /* 沒連上 */ }
  if (edge.pid) spawn("taskkill", ["/PID", String(edge.pid), "/T", "/F"], { stdio: "ignore" });
}
main().catch(async (e) => { console.error(e); await closeEdge(); process.exit(1); });
