/**
 * 把網站用的三種字型從 Google Fonts 抓下來，放進自己的專案。
 *
 * 為什麼：以前用 next/font/google，每次建置都要從 Google 下載 228 個字型檔（共 11MB）。
 * 只要其中一個沒抓到，整個建置就失敗：2026-09 本機失敗三次、Vercel 部署失敗一次
 * （錯誤是「next/font/google queries have exactly one entry」、noto_sans_tc module not found）。
 * 現在字型檔跟著程式碼一起存在 public/fonts/，建置完全不用連 Google。
 *
 * 為什麼不用 next/font/local：中文字型很大，Google 把它切成一百多塊，每一塊標好涵蓋哪些字
 * （unicode-range），瀏覽器只下載頁面上用得到的那幾塊。next/font/local 不支援這種切法，
 * 改用它的話每位讀者都要下載好幾 MB 的完整字型。所以這裡保留 Google 的切法，只是檔案改成自己放。
 *
 * 什麼時候要重跑：要加字重、換字型的時候。改下面的 FAMILIES，跑 `node scripts/fonts-selfhost.mjs`，
 * 會重寫 public/fonts/、app/fonts.css、app/fonts-preload.json。平常建置不用跑。
 */
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "fonts");

// 跟以前 app/layout.tsx 的 next/font/google 設定一樣：字重、CSS 變數名稱都沒變
const FAMILIES = [
  { key: "sans", name: "Noto Sans TC", query: "Noto+Sans+TC:wght@400;500;700", variable: "--font-sans" },
  { key: "serif", name: "Noto Serif TC", query: "Noto+Serif+TC:wght@600;700;900", variable: "--font-serif" },
  { key: "mono", name: "IBM Plex Mono", query: "IBM+Plex+Mono:wght@400;500;600", variable: "--font-mono" },
  /*
   * 2026-10-01 學習單用的楷書：芫荽（Iansui，ButTaiwan 做的，SIL Open Font License，可以商用、可以嵌進 PDF）。
   * 照教育部標準字形調過，有注音符號和聲調符號，孩子在學校看到的字長得一樣。
   * 只有學習單用得到，所以不預先載入（不然每一頁都多下載一塊）
   */
  { key: "kai", name: "Iansui", query: "Iansui", variable: "--font-kai", preload: false },
];

/*
 * 後備字型：字型還沒下載完的時候，先用 Arial／Times New Roman 頂著，
 * 但把大小、行高調到跟真正的字型差不多，字型載好換過去時版面才不會跳。
 * 數字照抄 next/font 當初算出來的（2026-09-27 從建置產出的 CSS 讀的），字型沒換就不用動。
 */
const FALLBACK = {
  sans: "src: local(Arial); ascent-override: 110.73%; descent-override: 27.49%; line-gap-override: 0.0%; size-adjust: 104.76%;",
  serif: "src: local(Times New Roman); ascent-override: 95.04%; descent-override: 23.62%; line-gap-override: 0.0%; size-adjust: 121.11%;",
  mono: "src: local(Arial); ascent-override: 76.16%; descent-override: 20.43%; line-gap-override: 0.0%; size-adjust: 134.59%;",
  // 楷書還沒載好之前，先用電腦裡的標楷體（Windows 叫 DFKai-SB，Mac 叫 BiauKai）
  kai: "src: local(DFKai-SB), local(BiauKai);",
};

// Google 看瀏覽器給檔案格式，要假裝是新版 Chrome 才會給 woff2
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function get(url, as = "text") {
  for (let i = 1; i <= 4; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return as === "text" ? await r.text() : Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i === 4) throw new Error(`${url} 抓了四次都失敗：${e.message}`);
      await new Promise((ok) => setTimeout(ok, 800 * i));
    }
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const css = [];
const preload = [];
let files = 0, bytes = 0;

for (const f of FAMILIES) {
  const src = await get(`https://fonts.googleapis.com/css2?family=${f.query}&display=swap`);
  // 拉丁、西里爾這些塊前面有一行註解（/* latin */），中文那一百多塊沒有。拉丁字母那一塊要預先載入
  const blocks = [...src.matchAll(/(?:\/\*\s*([^*]+?)\s*\*\/\s*)?@font-face\s*\{([^}]*)\}/g)];
  const local = new Map(); // Google 網址 → 我們的檔名（同一個可變字型檔，好幾個字重共用）
  css.push(`/* ${f.name} */`);
  for (const [, label, body] of blocks) {
    const url = body.match(/url\((https:[^)]+)\)/)[1];
    if (!local.has(url)) {
      const buf = await get(url, "buffer");
      const name = `${f.key}-${createHash("sha1").update(buf).digest("hex").slice(0, 12)}.woff2`;
      writeFileSync(join(OUT, name), buf);
      local.set(url, name);
      files++; bytes += buf.length;
      if (label === "latin" && f.preload !== false) preload.push(`/fonts/${name}`);
    }
    const weight = body.match(/font-weight:\s*(\d+)/)[1];
    const range = body.match(/unicode-range:\s*([^;]+);/)[1];
    css.push(`@font-face { font-family: "${f.name}"; font-style: normal; font-weight: ${weight}; font-display: swap; src: url(/fonts/${local.get(url)}) format("woff2"); unicode-range: ${range}; }`);
  }
  css.push(`@font-face { font-family: "${f.name} Fallback"; ${FALLBACK[f.key]} }`, "");
}

const head = `/*
 * 自動產生，不要手改。要換字型或字重，改 scripts/fonts-selfhost.mjs 再跑一次。
 * 字型檔在 public/fonts/，建置時不連 Google（2026-09-27 起，原因寫在那支程式最上面）。
 */
`;
const vars = `
/* 以前是 next/font 在 <html> 上掛 class 給這三個變數，名稱照舊，其他地方都不用改。
   沒放在 @layer 裡，所以會蓋過 Tailwind 在 theme 層預設的同名變數 */
:root {
${FAMILIES.map((f) => `  ${f.variable}: "${f.name}", "${f.name} Fallback";`).join("\n")}
}
`;
writeFileSync(join(ROOT, "app", "fonts.css"), head + css.join("\n") + vars);
writeFileSync(join(ROOT, "app", "fonts-preload.json"), JSON.stringify(preload, null, 2) + "\n");

const n = readdirSync(OUT).length;
console.log(`${files} 個字型檔（${(bytes / 1024 / 1024).toFixed(1)} MB）寫進 public/fonts/，資料夾裡共 ${n} 個`);
console.log(`預先載入 ${preload.length} 個：${preload.join("、")}`);
