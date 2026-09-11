/**
 * 連結健檢。
 *
 * ------------------------------------------------------------------
 * 這支腳本只在自己的電腦上跑，不放進網站、不排程在伺服器上。
 * ------------------------------------------------------------------
 *
 * 為什麼要分這麼清楚：
 *
 * 我們的規矩是不爬電商 —— 爬蝦皮違反條款，會賠掉整個分潤帳號，
 * 而那是目前唯一的收入來源。這支腳本做的事跟爬蟲不一樣：
 *
 *   · 它只問「這條連結還通不通」，看 HTTP 狀態碼和最後落在哪個網址
 *   · 它不讀商品頁的內容，不抓價格、不抓庫存、不抓評價、不存 HTML
 *   · 一條連結一次請求，中間停一秒，等於你自己用手點一遍
 *   · 從你家的電腦發，不是從網站的伺服器發
 *
 * 換句話說：這是「檢查自己的連結有沒有壞」，不是「去別人家搬資料」。
 * 界線就在這裡，不要越過去。想知道價格變多少，還是自己開網頁看。
 *
 * 用法：
 *   npm run links:check
 *
 * 結果會寫到 data/link-health.json，並且在畫面上直接印出
 * 「哪幾條要處理」。要把一條標成死的，去對應的 CSV（df- 在 dog-food.csv、cf- 在 cat-food.csv）那一列的
 * mN_dead 欄位填 1，再跑 npm run data:import。
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { CATEGORIES } from "../lib/categories";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "data/link-health.json");

/** 每條之間停多久（毫秒）。慢一點沒關係，這不是趕時間的事。 */
const DELAY_MS = 1200;
const TIMEOUT_MS = 15000;

interface Row {
  productId: string;
  brand: string;
  name: string;
  merchantId: string;
  label: string;
  url: string;
  status: number | null;
  finalUrl: string | null;
  verdict: "ok" | "redirected-home" | "not-found" | "unreachable";
  note: string;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 落到首頁或搜尋頁 = 原本那個商品沒了。
 * 蝦皮的短網址在商品下架之後，通常不是回 404，而是把你丟到首頁 ——
 * 只看狀態碼會全部顯示 200，那就漏掉了真正的問題。
 */
function landedOnHome(finalUrl: string): boolean {
  try {
    const u = new URL(finalUrl);
    const path = u.pathname.replace(/\/+$/, "");
    if (path === "" || path === "/") return true;
    if (/^\/(search|find|mall)$/.test(path)) return true;
    return false;
  } catch {
    return false;
  }
}

async function check(url: string): Promise<Pick<Row, "status" | "finalUrl" | "verdict" | "note">> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        // 老實表明身分。不假裝成瀏覽器 —— 我們沒有要躲任何人。
        "user-agent": "zone27-linkcheck/1.0 (+https://zone27.com.tw; 自家連結健檢)",
      },
    });
    const finalUrl = res.url || url;

    if (res.status === 404 || res.status === 410) {
      return { status: res.status, finalUrl, verdict: "not-found", note: "商品頁不存在了" };
    }
    if (res.ok && landedOnHome(finalUrl)) {
      return {
        status: res.status,
        finalUrl,
        verdict: "redirected-home",
        note: "被丟到首頁或搜尋頁 —— 通常代表商品已下架",
      };
    }
    if (!res.ok) {
      return { status: res.status, finalUrl, verdict: "unreachable", note: `回應 ${res.status}` };
    }
    return { status: res.status, finalUrl, verdict: "ok", note: "" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { status: null, finalUrl: null, verdict: "unreachable", note: msg.slice(0, 120) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  // 每個類目的 JSON 都要查，貓的連結壞了一樣要知道
  type P = {
    id: string; brand: string; name: string;
    price: { merchants: { id: string; label: string; affiliateUrl: string; dead?: boolean }[] };
  };
  const products: P[] = CATEGORIES
    .map((c) => resolve(ROOT, c.json))
    .filter((path) => existsSync(path))
    .flatMap((path) => (JSON.parse(readFileSync(path, "utf8")) as { products: P[] }).products);

  const targets = products.flatMap((p) =>
    p.price.merchants
      .filter((m) => !m.dead) // 已經標死的不用再問
      .map((m) => ({
        productId: p.id, brand: p.brand, name: p.name,
        merchantId: m.id, label: m.label, url: m.affiliateUrl,
      })),
  );

  console.log(`要檢查 ${targets.length} 條連結，每條之間停 ${DELAY_MS / 1000} 秒。`);
  console.log(`預估 ${Math.ceil((targets.length * DELAY_MS) / 1000 / 60)} 分鐘。\n`);

  const rows: Row[] = [];
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    const r = await check(t.url);
    rows.push({ ...t, ...r });

    const mark = r.verdict === "ok" ? "  ok" : "  ⚠ ";
    console.log(`${mark} [${i + 1}/${targets.length}] ${t.brand}｜${t.label}${r.verdict === "ok" ? "" : ` —— ${r.note}`}`);

    if (i < targets.length - 1) await sleep(DELAY_MS);
  }

  const bad = rows.filter((r) => r.verdict !== "ok");
  writeFileSync(
    OUT,
    JSON.stringify(
      { checkedAt: new Date().toISOString().slice(0, 10), total: rows.length, bad: bad.length, rows },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  console.log(`\n———\n檢查完 ${rows.length} 條，有問題的 ${bad.length} 條。`);
  if (bad.length > 0) {
    console.log("\n要處理的：");
    for (const b of bad) {
      console.log(`  · ${b.brand}｜${b.name}`);
      console.log(`    ${b.label} — ${b.note}`);
      console.log(`    ${b.url}`);
    }
    console.log(
      "\n確認真的下架了，就去對應的 CSV（df- 在 dog-food.csv、cf- 在 cat-food.csv）把那一列的 mN_dead 填 1，" +
        "再跑 npm run data:import。引擎會自動跳過，不用改程式。",
    );
  }
  console.log(`\n明細寫在 ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
