/**
 * 用貼的新增／更新賣場資料。
 *
 * ------------------------------------------------------------------
 * 這支存在的理由：Excel 那一步是整條流程裡最花時間、最容易出錯的地方。
 * ------------------------------------------------------------------
 *
 * 五十個欄位的試算表，要找到 m3Url 在第幾欄、對齊哪一列，
 * 一款商品要花好幾分鐘，還會存錯編碼變亂碼。商品到一百款的時候，
 * 那不是慢，是根本做不下去。
 *
 * 所以改成：在蝦皮那邊複製，貼成一行，剩下的交給程式認。
 * 欄位順序不拘、分隔符不拘 —— 網址、規格、價格、佣金都有各自的長相，
 * 認得出來就好。認不出來的它會直接告訴你哪一行有問題。
 *
 * 用法：
 *   1. 把資料貼進 data/paste.txt
 *   2. npm run data:paste
 *
 * 它會改對應 CSV 的 m1～m4 欄位（df- 開頭寫進 dog-food.csv、cf- 開頭寫進 cat-food.csv），
 * 把查價日期更新成今天，
 * 然後自動跑一次匯入。商品本身的規格（蛋白質、成分那些）不歸它管 ——
 * 那是另外一件事，我來查。
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { todayTW } from "../lib/date";
import { categoryOfId } from "../lib/categories";

const ROOT = resolve(import.meta.dirname, "..");
const PASTE = resolve(ROOT, "data/paste.txt");

const TEMPLATE = `# 一行一個賣場。第一行 = 卡片上主要的那個賣場。
#
# 欄位順序不拘，用 tab、兩個以上空白、或 | 分開都可以：
#   商品編號   賣場名稱   規格   價格   分潤連結   【備註】
#
# 佣金不用填 —— 我們不記那個數字（費率天天在跳，存下來隔天就是錯的）。
# 貼上來的行帶著 9% 也沒關係，程式會自己忽略。
#
# 同一個商品的第二行開始，商品編號可以不用再寫。
# 井字號開頭的行會被忽略，可以拿來寫筆記。
#
# 例：
# df-01  獅子王寵物（蝦皮優選）  2kg    1200  https://s.shopee.tw/xxxx  【超商限兩包】
#        獅子王寵物（蝦皮優選）  6kg    2640  https://s.shopee.tw/xxxx  【超商限一包】
`;

/* ---------------------------------------------------------------- */
/* CSV                                                              */
/* ---------------------------------------------------------------- */

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
    else if (c !== "\r") cur += c;
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

const escape = (v: string) => (/[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);

/* ---------------------------------------------------------------- */
/* 一行貼上的東西，拆成欄位                                          */
/* ---------------------------------------------------------------- */

interface Row {
  productId: string;
  label: string;
  unit: string;
  amount: number;
  url: string;
  /** 蝦皮的規格名本來就寫成【超商限兩包】，直接沿用那個寫法當備註 */
  note: string;
  line: number;
}

// df- 狗飼料、cf- 貓飼料。新類目的前綴加在 lib/categories，這裡跟著改
const RE_ID = /^((?:df|cf)-\d+)$/i;
const RE_URL = /^https?:\/\/\S+$/i;
const RE_UNIT = /^\d+(?:\.\d+)?\s*(?:kg|g|公斤|公克|磅|lb|lbs|oz)$/i;
const RE_PCT = /^\d+(?:\.\d+)?\s*%$/;
const RE_MONEY = /^\$?\d[\d,]*$/;

function splitLine(raw: string): string[] {
  return raw.split(/\t+|\s*\|\s*|\s{2,}/).map((s) => s.trim()).filter(Boolean);
}

function parseLine(raw: string, line: number, carryId: string): Row | { error: string } {
  const parts = splitLine(raw);
  if (parts.length < 3) return { error: "欄位太少，至少要有賣場、規格、價格、連結" };

  let productId = "", label = "", unit = "", url = "", note = "";
  let amount: number | null = null;
  const rest: string[] = [];

  for (const p of parts) {
    // 【超商限兩包】這種直接當備註，不要混進賣場名稱
    const bracket = p.match(/^【(.+)】$/);
    if (bracket) { note = note ? note + " · " + bracket[1] : bracket[1]; continue; }
    if (!productId && RE_ID.test(p)) { productId = p.toLowerCase(); continue; }
    if (!url && RE_URL.test(p)) { url = p; continue; }
    if (!unit && RE_UNIT.test(p)) { unit = p.replace(/\s+/g, ""); continue; }
    // 佣金我們不記了（費率天天在跳，存下來隔天就是錯的），
    // 但貼上來的行常常帶著它 —— 認出來丟掉，不要混進賣場名稱
    if (RE_PCT.test(p)) continue;
    if (amount === null && RE_MONEY.test(p)) { amount = Number(p.replace(/[$,]/g, "")); continue; }
    rest.push(p);
  }

  // 佣金沒寫 % 的時候：剩下的數字裡挑一個小的當佣金
  // 沒寫 % 的裸數字多半也是佣金，一併丟掉
  {
    const i = rest.findIndex((r) => /^\d+(\.\d+)?$/.test(r) && Number(r) <= 30);
    if (i >= 0) rest.splice(i, 1);
  }
  label = rest.join(" ").trim();

  if (!productId) productId = carryId;
  if (!productId) return { error: "找不到商品編號（像 df-01 或 cf-01），而且上一行也沒有可以沿用的" };
  if (!url) return { error: "找不到分潤連結（要 http 開頭）" };
  if (!unit) return { error: "找不到規格（像 2kg、4.5磅）" };
  if (amount === null) return { error: "找不到價格" };
  if (!label) return { error: "找不到賣場名稱" };
  // 搭贈品的賣場在這裡就擋掉，不要等匯入才報錯 ——
  // 價格裡包著贈品，每公斤就算不準，而那是我們整個站的說服力來源
  if (/送|贈|買一送/.test(label + unit + note)) {
    return { error: "這家搭贈品（出現「送」或「贈」）。價格裡包著別的東西，每公斤算不準 —— 換一家乾淨定價的" };
  }

  return { productId, label, unit, amount, url, note, line };
}

/* ---------------------------------------------------------------- */

async function main() {
  if (!existsSync(PASTE)) {
    writeFileSync(PASTE, TEMPLATE, "utf8");
    console.log(`\n幫你建好了 data/paste.txt，裡面有格式說明。`);
    console.log(`把資料貼進去，再跑一次 npm run data:paste\n`);
    return;
  }

  const text = readFileSync(PASTE, "utf8").replace(/^﻿/, "");
  const lines = text.split(/\r?\n/);

  const rows: Row[] = [];
  const errors: string[] = [];
  let carryId = "";

  lines.forEach((raw, i) => {
    const t = raw.trim();
    if (!t || t.startsWith("#")) return;
    const r = parseLine(t, i + 1, carryId);
    if ("error" in r) {
      errors.push(`  第 ${i + 1} 行：${r.error}\n    ${t}`);
      return;
    }
    carryId = r.productId;
    rows.push(r);
  });

  if (errors.length) {
    console.error(`\n這幾行看不懂，先修好再跑一次：\n`);
    console.error(errors.join("\n\n"));
    console.error(`\n沒有動到任何檔案。\n`);
    process.exit(1);
  }
  if (rows.length === 0) {
    console.log(`\ndata/paste.txt 裡沒有資料（井字號開頭的行不算）。\n`);
    return;
  }

  /* ---- 依商品分組，超過四家就擋下來 ---- */
  const byProduct = new Map<string, Row[]>();
  for (const r of rows) byProduct.set(r.productId, [...(byProduct.get(r.productId) ?? []), r]);

  for (const [id, list] of byProduct) {
    if (list.length > 4) {
      console.error(`\n${id} 有 ${list.length} 家賣場，欄位只到 m4。`);
      console.error(`而且賣場越多維護成本越高 —— 建議一款留一到兩家就好。\n`);
      process.exit(1);
    }
  }

  /* ---- 寫回 CSV：編號前綴決定是哪一份（df- 狗、cf- 貓） ---- */
  const today = todayTW();
  const touched: string[] = [];
  const missing: string[] = [];

  const byFile = new Map<string, [string, Row[]][]>();
  for (const [id, list] of byProduct) {
    const cat = categoryOfId(id);
    if (!cat) { missing.push(id); continue; }
    byFile.set(cat.csv, [...(byFile.get(cat.csv) ?? []), [id, list]]);
  }

  // 先全部改在記憶體裡，確定每一筆都找得到才寫檔
  const outputs: [string, string][] = [];
  for (const [file, entries] of byFile) {
    const path = resolve(ROOT, file);
    let csv = readFileSync(path, "utf8");
    if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1);

    const table = parseCsv(csv);
    const head = table[0];
    const idCol = head.indexOf("id");
    if (idCol < 0) { console.error(`\n${file} 找不到 id 欄位\n`); process.exit(1); }

    const col = (name: string) => {
      const i = head.indexOf(name);
      if (i < 0) { console.error(`\n${file} 缺少欄位 ${name}\n`); process.exit(1); }
      return i;
    };
    const checkedCol = head.indexOf("checkedAt");
    const awaitCol = head.indexOf("awaitingLink");

    for (const [id, list] of entries) {
      const r = table.find((row, i) => i > 0 && row[idCol] === id);
      if (!r) { missing.push(id); continue; }

      for (let n = 1; n <= 4; n++) {
        const m = list[n - 1];
        r[col(`m${n}Label`)] = m ? m.label : "";
        r[col(`m${n}Unit`)] = m ? m.unit : "";
        r[col(`m${n}Amount`)] = m ? String(m.amount) : "";
        r[col(`m${n}Url`)] = m ? m.url : "";
        r[col(`m${n}Dead`)] = "";
        // 貼上那一行有寫【】才覆蓋備註；沒寫就保留原本的人工備註
        if (m && m.note) r[col(`m${n}Note`)] = m.note;
        else if (!m) r[col(`m${n}Note`)] = "";
      }
      if (checkedCol >= 0) r[checkedCol] = today;
      // 連結來了，就不再是「等連結」的狀態
      if (awaitCol >= 0) r[awaitCol] = "";
      touched.push(`${id}（${list.length} 家）`);
    }
    outputs.push([path, table.map((r) => r.map(escape).join(",")).join("\r\n") + "\r\n"]);
  }

  if (missing.length) {
    console.error(`\n這幾個商品編號找不到：${missing.join("、")}`);
    console.error(`df- 開頭的在 data/dog-food.csv，cf- 開頭的在 data/cat-food.csv。`);
    console.error(`商品本身要先建立（規格、成分、不要買的條件那些），才能掛賣場。`);
    console.error(`沒有動到任何檔案。\n`);
    process.exit(1);
  }

  for (const [path, out] of outputs) writeFileSync(path, "\uFEFF" + out, "utf8");

  console.log(`\n更新了 ${touched.length} 款：${touched.join("、")}`);
  console.log(`查價日期一併改成 ${today}\n`);

  /* ---- 直接接著跑匯入，少一個步驟 ---- */
  console.log(`接著跑匯入 ——\n`);
  // 原本 spawn npx，Windows 上 npx.cmd 叫不起來（ENOENT），
  // 而 shell:true 會噴 Node 的棄用警告。匯入腳本本來就是 top-level 執行，
  // 直接 import 進來跑最乾淨。
  await import("./import-csv");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
