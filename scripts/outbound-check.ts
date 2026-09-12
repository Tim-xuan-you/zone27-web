/**
 * 外連檢查：網站上不能有任何一個連結，把讀者送去不是 Tim 分潤的網站。
 *
 * 2026-09-12 Tim 抓到：每一款底下的「我們查的台灣通路頁」連去別家通路，
 * 成分表核對的「你可以自己點進去對」也是。讀者在那裡買，一毛都拿不到。
 * 我們花力氣查證，最後把人送去別人的店。
 *
 * 這支在 npm run build 之後自動跑（postbuild）。有一個不該有的外連，build 就失敗，不會上線。
 * Vercel 上也一樣，所以壞掉的版本不會蓋掉線上那一版。
 *
 * 兩條規則：
 *   1. 產出的每一頁，連結（href、src、action）只要是 http 開頭，網域一定要在白名單裡
 *   2. 我們研究時查過的通路網址（CSV 的 twSource、成分表核對檔裡的 url），
 *      一個都不能出現在產出裡，連打包進 JS 的字串都不行
 *
 * 要連去別的地方，正確的做法是：跟 Tim 要他的分潤連結，走 /go/。
 * 拿不到就不放連結。寧可沒有，也不要連去別家。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, ".next");

/**
 * 白名單。每加一個都要講得出理由。
 *
 * zone27.com.tw       自己
 * shopee.tw           Tim 的分潤連結（讀者頁面走 /go/ 中轉，只有維護台直接列出來給 Tim 對）
 * calendar.google.com 「加到 Google 日曆」：把換糧提醒加進讀者自己的行事曆，不是賣場，讀者不會在那裡買東西
 */
const ALLOW = [/(^|\.)zone27\.com\.tw$/, /(^|\.)shopee\.tw$/, /^calendar\.google\.com$/];

/** 研究時查過、一定不能出現在網站上的網域 */
function forbiddenHosts(): Set<string> {
  const hosts = new Set<string>([
    // 台灣常見的寵物用品通路。以後查資料用到新的一家，也加進來
    "petpetgo.com", "petpark.com.tw", "lovecat.com.tw", "mao.com.tw", "sofydog.com",
    "books.com.tw", "hapet.com.tw", "bownala.com.tw", "petkingdom.com.tw", "meowcamp.com",
    "24h.pchome.com.tw", "momoshop.com.tw", "petmart.com.tw", "petplanet.com.tw",
  ]);
  const add = (u: string) => {
    try { hosts.add(new URL(u).hostname.replace(/^www\./, "")); } catch { /* 不是網址就跳過 */ }
  };
  for (const f of readdirSync(join(ROOT, "data"))) {
    const text = readFileSync(join(ROOT, "data", f), "utf8");
    if (f.endsWith(".csv")) {
      // CSV 裡的 twSource：那是別家通路的上架頁
      for (const m of text.matchAll(/https?:\/\/[^\s,"]+/g)) {
        if (!/shopee\.tw/.test(m[0])) add(m[0]);
      }
    }
    if (f.includes("hidden-chicken") && f.endsWith(".json")) {
      for (const m of text.matchAll(/"url":\s*"([^"]+)"/g)) add(m[1]);
    }
  }
  return hosts;
}

function walk(dir: string, exts: RegExp): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p, exts) : exts.test(n) ? [p] : [];
  });
}

if (!existsSync(join(OUT, "server", "app"))) {
  console.error("找不到 .next/server/app，先跑 npm run build");
  process.exit(1);
}

const pages = walk(join(OUT, "server", "app"), /\.(html|rsc|body)$/);
const scripts = walk(join(OUT, "static"), /\.js$/);
const bad = forbiddenHosts();
const problems: string[] = [];

// 規則一：頁面上的外連
const LINK = [
  /\b(?:href|src|action)="(https?:\/\/[^"]+)"/g,        // HTML
  /"(?:href|src|action)":"(https?:\/\/[^"\\]+)"/g,       // React 的 RSC 資料
];
for (const f of pages) {
  const text = readFileSync(f, "utf8");
  for (const re of LINK) {
    for (const m of text.matchAll(re)) {
      let host = "";
      try { host = new URL(m[1]).hostname; } catch { continue; }
      if (!ALLOW.some((a) => a.test(host))) {
        problems.push(`${relative(OUT, f)}  連到 ${m[1].slice(0, 90)}`);
      }
    }
  }
}

// 規則二：研究用的網址一個都不能出現，連 JS 裡的字串都不行
for (const f of [...pages, ...scripts]) {
  const text = readFileSync(f, "utf8");
  for (const h of bad) {
    if (text.includes(h)) problems.push(`${relative(OUT, f)}  出現研究用的網址 ${h}`);
  }
}

const uniq = [...new Set(problems)];
if (uniq.length) {
  console.error(`\n✗ 有 ${uniq.length} 個不該有的外連。網站只能連去 Tim 的分潤連結（走 /go/）：\n`);
  uniq.slice(0, 40).forEach((p) => console.error("  " + p));
  console.error("\n要連出去，先跟 Tim 要分潤連結。拿不到就不放連結。\n");
  process.exit(1);
}
console.log(`✓ 外連檢查通過：${pages.length} 個頁面檔、${scripts.length} 個 JS，沒有連去別家的網址（擋 ${bad.size} 個研究用網域）`);
