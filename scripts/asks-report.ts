/**
 * 大家在裁決器問了什麼：從試算表拉回來，整理成「下一步要改什麼」。
 *
 * 用法：npm run asks:report
 * 需要 .env.local 裡的 ASKS_KEY（讀取密碼，跟 Apps Script 裡的 KEY 同一串），
 * 網址在 lib/asks.ts 的 ASKS_URL。
 *
 * 看的順序就是要改的順序：
 *   1. 讀不懂的句子 → 補詞彙（lib/parse.ts）
 *   2. 提到了、但我們沒收的商品 → 下一批要讀的
 *   3. 點最多的組合 → 那個組合的答案要最先檢查對不對
 *   4. 推薦最多次的商品 → 它的連結最不能斷
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ASKS_URL } from "../lib/asks";

const ROOT = resolve(import.meta.dirname, "..");
const env = Object.fromEntries(
  readFileSync(resolve(ROOT, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

if (!ASKS_URL) {
  console.log("lib/asks.ts 的 ASKS_URL 還是空的：試算表還沒接上，沒有資料可以看。");
  process.exit(0);
}
if (!env.ASKS_KEY) {
  console.log(".env.local 裡沒有 ASKS_KEY，讀不到試算表。");
  process.exit(1);
}

async function main() {
const res = await fetch(`${ASKS_URL}?key=${encodeURIComponent(env.ASKS_KEY)}&n=20000`);
const raw = await res.text();
let rows: unknown[][];
try { rows = JSON.parse(raw); } catch { console.log("試算表回的不是資料：", raw.slice(0, 200)); process.exit(1); }

// 第一列是標題：時間、頁面、狗貓、乾濕、點了什麼、打了什麼、讀不讀得懂、推薦、提到的商品、來源、場次
const data = rows.slice(1).map((r) => ({
  t: String(r[0]), page: String(r[1]), sp: String(r[2]), fm: String(r[3]),
  picks: String(r[4]), text: String(r[5]), empty: String(r[6]) === "讀不懂",
  top: String(r[7]), mentions: String(r[8]), src: String(r[9]), sid: String(r[10]),
}));

const count = <T,>(xs: T[]) => {
  const m = new Map<T, number>();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};
const show = (title: string, list: [string, number][], max = 15) => {
  console.log(`\n${title}`);
  if (list.length === 0) { console.log("  （還沒有）"); return; }
  for (const [k, n] of list.slice(0, max)) console.log(`  ${String(n).padStart(4)}  ${k}`);
};

console.log(`共 ${data.length} 筆，${new Set(data.map((d) => d.sid)).size} 次打開頁面`);
console.log(`最早 ${data[0]?.t ?? "-"}　最新 ${data.at(-1)?.t ?? "-"}`);

show("1. 讀不懂的句子（補進 lib/parse.ts）", count(data.filter((d) => d.empty).map((d) => d.text)), 50);
show("2. 句子裡提到的商品（沒收的要去讀）", count(data.flatMap((d) => d.mentions ? d.mentions.split("、") : [])));
show("   自己打的字（扣掉按鈕的字）", count(data.map((d) => d.text).filter((x) => x && !x.startsWith("（"))), 30);
show("3. 點最多的組合", count(data.filter((d) => d.picks).map((d) => `${d.sp === "cat" ? "貓" : "狗"}${d.fm === "wet" ? "罐頭" : "飼料"}｜${d.picks}`)));
show("4. 推薦最多次的商品（這幾款的連結最不能斷）", count(data.map((d) => d.top).filter(Boolean)));
show("   怎麼問的", count(data.map((d) => ({ chip: "點按鈕", type: "打字", answer: "點常見情況", link: "朋友的連結" } as Record<string, string>)[d.src] ?? d.src)));
show("   從哪一頁", count(data.map((d) => d.page)));
}

main();
