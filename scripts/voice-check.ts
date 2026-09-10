/**
 * 文案口吻檢查：讀者看得到的字，有沒有 AI 腔、翻譯腔、對岸用語。
 *
 * 規則來自 Tim 2026-09-10 的要求：擺脫翻譯腔、中國大陸慣用語、
 * 過度工整的邏輯框架。程式註解不算，只掃讀者真的會看到的字。
 *
 * 必改的規則一條都不能有，有就 exit 1。
 * 建議改的是「多半是翻譯腔，但有時是正常用法」，要人看過再決定。
 *
 * 用法：npm run voice:check
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const TARGETS = [
  "app", "components",
  "lib/engine.ts", "lib/catalog.ts", "lib/slugs.ts", "lib/impact.ts",
  "lib/og.tsx", "lib/og-longtail.tsx", "lib/reminder.ts", "lib/categories.ts", "lib/parse.ts",
];
const DATA = ["data/dog-food.json", "data/hidden-chicken.json", "data/cat-food.json", "data/cat-hidden-chicken.json"];

/* ---- 規則 ---- */
const RULES: { name: string; re: RegExp; fix: string; hard: boolean }[] = [
  { name: "對岸用語", hard: true,
    re: /視頻|質量|屏幕|激活|軟件|短信|反饋|優化|信息/g,
    fix: "影片／品質／螢幕／啟用／軟體／簡訊／回饋／改善／訊息" },
  { name: "AI 路標與結論詞", hard: true,
    re: /值得注意的是|總的來說|總結來說|總而言之|綜上所述|毋庸置疑|不可否認地|令人驚嘆/g,
    fix: "刪掉，重點講完就結束" },
  { name: "行銷空話", hard: true,
    re: /打造|賦能|深耕|一站式|全方位/g,
    fix: "換成具體在做什麼" },
  { name: "動詞名詞化", hard: true,
    re: /進行(?:一個|一次|評估|分析|比較|檢查|排查)|為您提供|為你提供/g,
    fix: "直接寫動詞：評估、比較、檢查" },
  { name: "「不是…而是」句型", hard: true,
    re: /不是[^，。！？\n]{1,18}而是/g,
    fix: "直接講是什麼" },
  { name: "「與其…不如」句型", hard: true,
    re: /與其[^。！？\n]{1,30}不如/g,
    fix: "直接講要怎麼做" },
  { name: "假真誠開場", hard: true,
    re: /老實說|更有意思的是|相信大家都/g,
    fix: "台灣人比較會說「說真的」，或直接講" },
  { name: "破折號", hard: true,
    re: /——| — /g,
    fix: "改逗號、句號或冒號，能拆就拆成兩句" },
  // 沒有「而」的版本一樣常是翻譯腔，但「體重是典型值，不是標準」這種澄清是正常的
  { name: "「不是X，是Y」句型", hard: false,
    re: /不是[^，。！？\n]{1,14}，是[^，。！？\n]{1,14}/g,
    fix: "修辭用的改成直接講 Y；澄清事實的可以留" },
  { name: "可能是對岸義的「項目」", hard: false,
    re: /項目/g,
    fix: "指 project 的話台灣說「專案」" },
  { name: "全形刪節號", hard: true,
    re: /…/g,
    fix: "改半形 ..." },
];

/* ---- 讀檔、去掉註解 ---- */
function walk(p: string): string[] {
  const abs = join(ROOT, p);
  if (statSync(abs).isFile()) return [abs];
  return readdirSync(abs).flatMap((n) => {
    const full = join(abs, n);
    if (statSync(full).isDirectory()) return walk(relative(ROOT, full));
    return /\.(tsx?|ts)$/.test(n) ? [full] : [];
  });
}

/** 把註解換成等長的空白，行號才對得上 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, pre) => pre + " ".repeat(m.length - pre.length));
}

type Hit = { file: string; line: number; rule: string; text: string; hard: boolean };
const hits: Hit[] = [];
let bangs = 0;

function scan(file: string, text: string) {
  text.split("\n").forEach((ln, i) => {
    // 只看含中文的行，那才是文案
    if (!/[一-鿿]/.test(ln)) return;
    for (const r of RULES) {
      for (const _ of ln.matchAll(r.re)) {
        hits.push({ file, line: i + 1, rule: r.name, text: ln.trim().slice(0, 70), hard: r.hard });
      }
    }
    bangs += (ln.match(/！/g) ?? []).length;
  });
}

for (const t of TARGETS) {
  for (const f of walk(t)) scan(relative(ROOT, f), stripComments(readFileSync(f, "utf8")));
}
for (const d of DATA) scan(d, readFileSync(join(ROOT, d), "utf8"));

/* ---- 報告 ---- */
const hard = hits.filter((h) => h.hard);
const soft = hits.filter((h) => !h.hard);

console.log(`\n必改（${hard.length}）`);
for (const h of hard) console.log(`  ${h.file}:${h.line}  [${h.rule}]  ${h.text}`);

console.log(`\n建議看一下（${soft.length}）`);
for (const h of soft) console.log(`  ${h.file}:${h.line}  [${h.rule}]  ${h.text}`);

// 驚嘆號不擋，但數字要一直看得到：Tim 的規則是「克制」，不是禁止
console.log(`\n全形驚嘆號「！」共 ${bangs} 個`);

process.exit(hard.length ? 1 : 0);
