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
 * 它會改 data/dog-food.csv 的 m1～m4 欄位、把查價日期更新成今天，
 * 然後自動跑一次匯入。商品本身的規格（蛋白質、成分那些）不歸它管 ——
 * 那是另外一件事，我來查。
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { todayTW } from "../lib/date";

const ROOT = resolve(import.meta.dirname, "..");
const PASTE = resolve(ROOT, "data/paste.txt");
const CSV = resolve(ROOT, "data/dog-food.csv");

const TEMPLATE = `# 一行一個賣場。第一行 = 卡片上主要的那個賣場。
#
# 欄位順序不拘，用 tab、兩個以上空白、或 | 分開都可以：
#   商品編號   賣場名稱   規格   價格   分潤連結   佣金%
#
# 同一個商品的第二行開始，商品編號可以不用再寫。
# 井字號開頭的行會被忽略，可以拿來寫筆記。
#
# 例：
# df-01  獅子王寵物（蝦皮優選）  2kg    1200  https://s.shopee.tw/xxxx  9%
#        獅子王寵物（蝦皮優選）  6kg    2640  https://s.shopee.tw/xxxx  9%
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
  commission: number;
  line: number;
}

const RE_ID = /^(df-\d+)$/i;
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

  let productId = "", label = "", unit = "", url = "";
  let amount: number | null = null, commission: number | null = null;
  const rest: string[] = [];

  for (const p of parts) {
    if (!productId && RE_ID.test(p)) { productId = p.toLowerCase(); continue; }
    if (!url && RE_URL.test(p)) { url = p; continue; }
    if (!unit && RE_UNIT.test(p)) { unit = p.replace(/\s+/g, ""); continue; }
    if (commission === null && RE_PCT.test(p)) { commission = parseFloat(p); continue; }
    if (amount === null && RE_MONEY.test(p)) { amount = Number(p.replace(/[$,]/g, "")); continue; }
    rest.push(p);
  }

  // 佣金沒寫 % 的時候：剩下的數字裡挑一個小的當佣金
  if (commission === null) {
    const i = rest.findIndex((r) => /^\d+(\.\d+)?$/.test(r) && Number(r) <= 30);
    if (i >= 0) { commission = Number(rest[i]); rest.splice(i, 1); }
  }
  label = rest.join(" ").trim();

  if (!productId) productId = carryId;
  if (!productId) return { error: "找不到商品編號（像 df-01），而且上一行也沒有可以沿用的" };
  if (!url) return { error: "找不到分潤連結（要 http 開頭）" };
  if (!unit) return { error: "找不到規格（像 2kg、4.5磅）" };
  if (amount === null) return { error: "找不到價格" };
  if (!label) return { error: "找不到賣場名稱" };
  if (commission === null) return { error: "找不到佣金（寫 9 或 9% 都可以）" };

  return { productId, label, unit, amount, url, commission, line };
}

/* ---------------------------------------------------------------- */

function main() {
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

  /* ---- 寫回 CSV ---- */
  let csv = readFileSync(CSV, "utf8");
  const hadBom = csv.charCodeAt(0) === 0xfeff;
  if (hadBom) csv = csv.slice(1);

  const table = parseCsv(csv);
  const head = table[0];
  const idCol = head.indexOf("id");
  if (idCol < 0) { console.error("\ndata/dog-food.csv 找不到 id 欄位\n"); process.exit(1); }

  const col = (name: string) => {
    const i = head.indexOf(name);
    if (i < 0) { console.error(`\ndata/dog-food.csv 缺少欄位 ${name}\n`); process.exit(1); }
    return i;
  };

  const today = todayTW();
  const checkedCol = head.indexOf("checkedAt");
  const touched: string[] = [];
  const missing: string[] = [];

  for (const [id, list] of byProduct) {
    const r = table.find((row, i) => i > 0 && row[idCol] === id);
    if (!r) { missing.push(id); continue; }

    for (let n = 1; n <= 4; n++) {
      const m = list[n - 1];
      r[col(`m${n}Label`)] = m ? m.label : "";
      r[col(`m${n}Unit`)] = m ? m.unit : "";
      r[col(`m${n}Amount`)] = m ? String(m.amount) : "";
      r[col(`m${n}Url`)] = m ? m.url : "";
      r[col(`m${n}Commission`)] = m ? String(m.commission) : "";
      r[col(`m${n}Dead`)] = "";
      // note 不動 —— 那是人寫的（隔日到貨、超商限兩包），程式不該蓋掉
    }
    if (checkedCol >= 0) r[checkedCol] = today;
    touched.push(`${id}（${list.length} 家）`);
  }

  if (missing.length) {
    console.error(`\n這幾個商品編號在 data/dog-food.csv 裡找不到：${missing.join("、")}`);
    console.error(`商品本身要先建立（規格、成分、不要買的條件那些），才能掛賣場。`);
    console.error(`沒有動到任何檔案。\n`);
    process.exit(1);
  }

  const out = table.map((r) => r.map(escape).join(",")).join("\r\n") + "\r\n";
  writeFileSync(CSV, "﻿" + out, "utf8");

  console.log(`\n更新了 ${touched.length} 款：${touched.join("、")}`);
  console.log(`查價日期一併改成 ${today}\n`);

  /* ---- 直接接著跑匯入，少一個步驟 ---- */
  console.log(`接著跑匯入 ——\n`);
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  execFileSync(npx, ["tsx", "scripts/import-csv.ts"], { cwd: ROOT, stdio: "inherit" });
}

main();
