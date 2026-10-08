/**
 * 注音猜猜看的每一個詞，拿去教育部《國語辭典簡編本》對注音。
 *
 * 搜尋那個詞，搜尋結果的表格裡每一列有「詞」和「注音」，找標題剛好是那個詞的列，跟 lib/worksheets/words.ts 比。
 * 對不上的、辭典有兩種以上讀音的（像「雨」有 ㄩˇ 和 ㄩˋ），全部列出來，要人看過才能用。
 * 只打搜尋頁，一個詞一次，每次停一秒多：2026-10-09 一個一個打開條目頁，打了十幾次就被擋了。
 *
 * 用法：npx tsx scripts/worksheets-zhuyin-check.ts
 */
import { MATCH_THEMES } from "../lib/worksheets/match";
import { WORDS } from "../lib/worksheets/words";
import { PHRASES, ZHUYIN } from "../lib/worksheets/zhuyin";

/*
 * 學習單上給孩子讀的詞（規則、標題、欄位）。詞裡的讀音常常跟單字不一樣（2026-10-09 抓到「名字」是 ˙ㄗ、「個」是 ˙ㄍㄜ）。
 * 新的學習單用到新的詞，加進來一起查。辭典查不到的（像「撿到」是兩個字湊起來的），就照單字的讀音。
 */
const SHEET_PHRASES = [
  "名字", "日期", "格子", "松果", "松鼠", "回家", "這樣", "提示", "答案", "出題", "題目", "虛線", "自己", "別人", "下面", "往後", "注音", "左邊",
  // 連連看：圖下面的名字、規則裡的詞
  ...MATCH_THEMES.flatMap((t) => t.pairs.flatMap((p) => [p.left.name, p.right.name])),
  "東西", "什麼", "長大", "變成", "動物", "食物", "黑點", "寶寶", "連連看", "一條", "一隻", "誰", "起來", "連起來", "長大", "寶寶", "數字", "剛好", "等於", "房子", "加起來",
];
/** 學習單上的詞辭典有兩種讀音、我們看過確定用哪一個的：寫原因 */
const PHRASE_OK: Record<string, string> = {
  東西: "辭典第一個是「東邊和西邊」；學習單上是「物品」的意思，讀 ˙ㄒㄧ",
};
const oursOf = (w: string) => PHRASES[w]?.join(" ") ?? [...w].map((c) => ZHUYIN[c] ?? "？").join(" ");

const BASE = "https://dict.concised.moe.edu.tw";
/** 簡編本沒收的詞（車子、貓咪），再查重編本 */
const REVISED = "https://dict.revised.moe.edu.tw";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 搜尋結果每一列：詞、注音（輕聲寫在前面：˙ㄗ）、有沒有標「(一)(二)」 */
function rows(html: string): { title: string; zy: string; multi: boolean }[] {
  const out: { title: string; zy: string; multi: boolean }[] = [];
  for (const m of html.matchAll(/<tr data-link='dictView[^']*'[^>]*>([\s\S]*?)<\/tr>/g)) {
    const tds = [...m[1].matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/g)];
    if (tds.length < 3) continue;
    const title = tds[1][2].replace(/<[^>]+>/g, "").trim();
    const zy = [...tds[2][2].matchAll(/<phon>([\s\S]*?)<\/phon>/g)]
      .map((p) => p[1].replace(/<sup>([\s\S]*?)<\/sup>/g, "$1").replace(/<[^>]+>/g, "").replace(/\s+/g, ""))
      .join(" ");
    out.push({ title, zy, multi: /data-pre/.test(tds[2][1]) });
  }
  return out;
}

type Hit = { title: string; zy: string; multi: boolean };

/** 重編本的表格長得不一樣：注音在 <td class=ph> 的 <code> 裡 */
function revisedRows(html: string): Hit[] {
  const out: Hit[] = [];
  for (const m of html.matchAll(/<tr data-link='dictView[^']*'[^>]*>([\s\S]*?)<\/tr>/g)) {
    const tds = [...m[1].matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/g)];
    if (tds.length < 3) continue;
    const title = tds[1][2].replace(/<[^>]+>/g, "").trim();
    const zy = [...tds[2][2].matchAll(/<code>([\s\S]*?)<\/code>/g)].map((p) => p[1].replace(/<[^>]+>/g, "").replace(/\s+/g, "")).join(" ");
    out.push({ title, zy, multi: /data-pre/.test(tds[2][1]) });
  }
  return out;
}

/** 查一本辭典：一個結果會直接轉到條目頁（要帶同一個 session 的 cookie），多個結果讀表格 */
async function lookup(base: string, word: string, parse: (html: string) => Hit[]): Promise<Hit[]> {
  const res = await fetch(`${base}/search.jsp?md=1&word=${encodeURIComponent(word)}`, { headers: { "User-Agent": UA }, redirect: "manual" });
  if (res.status === 302 && res.headers.get("location")) {
    const cookie = (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
    const page = await (await fetch(new URL(res.headers.get("location")!, base), { headers: { "User-Agent": UA, Cookie: cookie } })).text();
    const m = page.match(/content="字詞:([^,]+),注音:([^,]+),/);
    return m && m[1] === word ? [{ title: m[1], zy: m[2].replace(/[　\s]+/g, " ").trim(), multi: false }] : [];
  }
  return parse(await res.text()).filter((r) => r.title === word);
}

async function main() {
  const seen = new Set<string>();
  let bad = 0;
  const all = [...WORDS, ...SHEET_PHRASES.map((zh) => ({ icon: "", zh, zy: oursOf(zh).split(" "), multiOk: PHRASE_OK[zh] as string | undefined }))];
  for (const w of all) {
    if (seen.has(w.zh)) continue;
    seen.add(w.zh);
    const ours = w.zy.join(" ");
    let hits = await lookup(BASE, w.zh, rows);
    let from = "簡編本";
    if (!hits.length) { await sleep(1300); hits = await lookup(REVISED, w.zh, revisedRows); from = "重編本"; }
    // 學習單上的詞辭典查不到（自己湊的），就不算錯
    if (!hits.length && SHEET_PHRASES.includes(w.zh)) { console.log(`  ・ ${w.zh}　辭典沒有這個詞，照單字讀音`); await sleep(1300); continue; }
    // 多音字看過的（multiOk），我們用的讀音在辭典裡有就算對，不一定要排第一個
    const ok = hits.length > 0 && (hits[0].zy === ours || (!!w.multiOk && hits.some((h) => h.zy === ours)));
    const multi = (hits.length > 1 || hits.some((h) => h.multi)) && !w.multiOk;
    if (!ok || multi) bad++;
    console.log(`${ok && !multi ? "  ✓" : ok ? "  ？" : "  ✗"} ${w.zh}　我們：${ours}　辭典（${from}）：${hits.map((h) => h.zy).join(" ／ ") || "查不到"}${w.multiOk ? `　（多音，看過：${w.multiOk}）` : ""}${multi ? "　（兩種以上讀音，第一個是我們用的才打？）" : ""}`);
    await sleep(1300);
  }
  console.log(bad ? `\n${bad} 個要看一下（✗ 對不上、？ 多音字要人判斷）` : "\n全部對得上");
  process.exit(bad ? 1 : 0);
}
main();
