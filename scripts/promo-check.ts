/**
 * 活動檢查：讀者看得到的字裡，不能有賣家隨時會改的活動、贈品、運費、出貨速度。
 *
 * 2026-09-13 Tim 抓到 T22 的白喵小舖底下寫著「滿 999 送 vita 罐頭」：
 * 「這種東西都不要寫出來。哪一天商家沒辦活動了怎麼辦？請全站掃描，未來也別再犯。」
 *
 * 顯示那一層已經會擋（lib/notes.ts 的 readerNotes），這支是第二道：
 * build 完掃產出的每一頁，把 script、style、標籤拿掉，只看讀者真的會讀到的字。
 * 有一句漏網的，build 就失敗，不會上線。跟外連檢查一樣接在 postbuild。
 *
 * 規則寫得比 readerNotes 窄：這裡掃的是整頁的文章，「送醫」「出貨和庫存要問賣場」
 * 這種正常的句子不能誤擋。只抓一看就是賣場活動的寫法。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, ".next");

const PROMO: [RegExp, string][] = [
  [/滿\s*\$?\s*\d[\d,]*\s*元?\s*(送|免運|折|贈)/, "滿額送／滿額免運"],
  [/免運無限次|宅配滿|免運門檻|免運券/, "免運"],
  [/折價券|可折抵|現折|優惠券|折扣碼/, "折價券"],
  [/隔日到|當日到|前下單|24\s*小時出貨|工作日出貨|工作日內出貨|備貨/, "出貨速度"],
  [/送.{0,6}(罐頭|肉泥|抓板|零食|玩具|試吃包|小禮|贈品)/, "贈品"],
  [/買一送一|加購價|限時|特價|檔期|下殺|新客首購|首購組|新客專屬/, "限時活動"],
  [/鑑賞期|天鑑賞|正品保障|安心退/, "平台保障"],
  [/兩包組更便宜|組合更便宜/, "要跟著價錢變的話"],
];

function walk(dir: string, exts: RegExp): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p, exts) : exts.test(n) ? [p] : [];
  });
}

/** 讀者看得到的字：拿掉 script（React 的資料也在裡面，那不會顯示）、style、標籤 */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

if (!existsSync(join(OUT, "server", "app"))) {
  console.error("找不到 .next/server/app，先跑 npm run build");
  process.exit(1);
}

const files = walk(join(OUT, "server", "app"), /\.(html|body)$/);
const problems: string[] = [];
for (const f of files) {
  const raw = readFileSync(f, "utf8");
  const text = f.endsWith(".html") ? visibleText(raw) : raw;
  for (const [re, kind] of PROMO) {
    const m = text.match(re);
    if (!m || m.index === undefined) continue;
    const at = m.index;
    problems.push(`${relative(OUT, f)}  [${kind}] …${text.slice(Math.max(0, at - 20), at + 30).trim()}…`);
  }
}

if (problems.length) {
  console.error(`\n✗ 有 ${problems.length} 處寫了會過期的活動、運費或出貨速度。這些賣家隨時會改，不能寫給讀者看：\n`);
  problems.slice(0, 40).forEach((p) => console.error("  " + p));
  console.error("\n資料裡可以留著（比價要用），顯示的地方要經過 lib/notes.ts 的 readerNotes。\n");
  process.exit(1);
}
console.log(`✓ 活動檢查通過：${files.length} 個頁面，讀者看得到的字裡沒有活動、贈品、運費、出貨速度`);
