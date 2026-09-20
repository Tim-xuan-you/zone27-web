/**
 * 站內連結指到不存在的頁面。
 *
 * 2026-09-20 出的事：狗零食上線之後，狗就有了兩個類目，
 * lib/categories 的 animalHref 自動把導覽列的「狗」從 /dog-food 改成 /dog。
 * 那支函式是對的，錯的是 app/dog/page.tsx 從來沒建 ——
 * 於是全站每一頁的第一個連結都是 404，而且沒有任何一個檢查會發現。
 *
 * 型別檢查抓不到這種錯：href 是字串，字串永遠是合法的字串。
 * build 也不會抱怨，因為 Next.js 不驗證 Link 指到哪裡。
 * 只有人點下去才知道，而點下去的是讀者。
 *
 * 所以這一支做一件事：把原始碼裡所有寫死的站內連結，
 * 跟 app/ 底下實際存在的路由對一遍。對不上就擋 build。
 *
 * 用法：npm run route:check（build 之後自動跑）
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, relative } from "node:path";
import { CATEGORIES, animalHref, ANIMALS } from "../lib/categories";

const ROOT = resolve(import.meta.dirname, "..");
const APP = join(ROOT, "app");

/* ---------------------------------------------------------------- */
/* 實際存在的路由                                                     */
/* ---------------------------------------------------------------- */

/** 一段路徑是不是動態的（[id]、[...slug]） */
const isDynamic = (seg: string) => seg.startsWith("[");
/** 路由群組 (marketing) 不算在網址裡 */
const isGroup = (seg: string) => seg.startsWith("(") && seg.endsWith(")");

const routes: string[] = [];

function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name === "api" || name.startsWith("_")) continue;
    walk(full);
  }
  const files = readdirSync(dir);
  const hasPage = files.some((f) => /^(page|route)\.(tsx|ts)$/.test(f));
  if (!hasPage) return;
  const segs = relative(APP, dir).split(/[\\/]/).filter((s) => s && !isGroup(s));
  routes.push("/" + segs.join("/"));
}
walk(APP);

/** 這條網址有沒有對應的路由。動態段落一律算符合 */
function routeExists(href: string): boolean {
  const want = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return routes.some((r) => {
    const a = r.split("/").filter(Boolean);
    const b = want.split("/").filter(Boolean);
    // [...slug] 可以吃掉後面全部
    const catchAll = a.findIndex((s) => s.startsWith("[..."));
    if (catchAll >= 0) {
      if (b.length < catchAll) return false;
      return a.slice(0, catchAll).every((s, i) => s === b[i]);
    }
    if (a.length !== b.length) return false;
    return a.every((s, i) => isDynamic(s) || s === b[i]);
  });
}

/* ---------------------------------------------------------------- */
/* 原始碼裡寫死的站內連結                                             */
/* ---------------------------------------------------------------- */

const sources: string[] = [];
function collect(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { collect(full); continue; }
    if (/\.(tsx|ts)$/.test(name)) sources.push(full);
  }
}
collect(APP);
collect(join(ROOT, "components"));
collect(join(ROOT, "lib"));

/* href="/..." 和 href={"/..."}。/go/ 是跳轉端點，動態的，不在這裡驗 */
const HREF = /href=(?:"|\{")(\/[^"'`{}\s]*)(?:"|"\})/g;

const bad: string[] = [];
const seen = new Set<string>();

for (const f of sources) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(HREF)) {
    const href = m[1];
    if (href.startsWith("/go/")) continue;
    const key = href + "|" + f;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!routeExists(href)) bad.push(`${relative(ROOT, f)}\n    ${href}`);
  }
}

/* ---------------------------------------------------------------- */
/* 算出來的連結：導覽列的動物頁、類目頁                                */
/*                                                                   */
/* 這一段才是 2026-09-20 那個洞。animalHref 的結果會隨類目數量改變，   */
/* 原始碼裡看不到 "/dog" 這個字串，grep 也找不到。                     */
/* ---------------------------------------------------------------- */

for (const a of ANIMALS) {
  const href = animalHref(a.species);
  if (!routeExists(href)) {
    bad.push(`lib/categories.ts animalHref("${a.species}")\n    ${href}　（${a.zh}有 ${
      CATEGORIES.filter((c) => c.species === a.species).length
    } 個類目，導覽列會連到這裡）`);
  }
}

for (const c of CATEGORIES) {
  if (!routeExists(`/${c.slug}`)) bad.push(`lib/categories.ts\n    /${c.slug}　（${c.zh}登記了但沒有這一頁）`);
}

/* ---------------------------------------------------------------- */

if (bad.length > 0) {
  console.error(`\n有 ${bad.length} 條站內連結指到不存在的頁面：\n`);
  console.error(bad.map((x) => `  ✕ ${x}`).join("\n\n"));
  console.error(`\n讀者點下去就是 404。先建那一頁，或把連結改掉。\n`);
  process.exit(1);
}

console.log(`✓ 路由檢查通過：${routes.length} 個路由，站內連結都指得到`);
