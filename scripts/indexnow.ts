/**
 * 通知 Bing（以及 Yandex、Naver、Seznam）網站上的頁面有更新。
 *
 * 用法：
 *   npm run seo:indexnow            通知全部頁面
 *   npm run seo:indexnow -- /dog-food/hidden-chicken   只通知指定的頁
 *
 * 這是網站主人通知搜尋引擎「我自己的公開頁面在這裡」，
 * 性質跟在 Google Search Console 提交 sitemap 一樣 —— 不是爬別人的東西。
 *
 * 為什麼要做：ChatGPT 的網路搜尋用 Bing 的索引。
 * Google 沒有這種即時通道，只能等；Bing 有，就該用。
 */
import { INDEXNOW_KEY } from "../lib/indexnow";
import sitemap from "../app/sitemap";

const HOST = "zone27.com.tw";
const BASE = `https://${HOST}`;

// 網址清單直接跟 sitemap 拿，只有一份。以前這裡手寫一份，開了貓飼料之後就漏了貓的頁面
const ALL = sitemap().map((e) => new URL(e.url).pathname);

async function main() {
  const only = process.argv.slice(2).filter((a) => a.startsWith("/"));
  const paths = only.length
    ? only
    : ALL;
  const urlList = paths.map((p) => BASE + p);

  // 先確認金鑰檔在線上 —— 沒有的話 Bing 會拒絕，白送一趟
  const keyUrl = `${BASE}/${INDEXNOW_KEY}.txt`;
  const keyRes = await fetch(keyUrl);
  const keyBody = (await keyRes.text()).trim();
  /*
   * Vercel 的防火牆有時候會對這台電腦發出的程式請求丟「確認你是人」（403 + x-vercel-mitigated）。
   * 2026-09-13 一個下午輪詢太多次就被擋了，但讀者用瀏覽器看完全正常。
   * 那不代表金鑰檔不在：Bing 是從它自己的伺服器來抓。這種情況照送，其他的 403、404 才停
   */
  const challenged = keyRes.status === 403 && keyRes.headers.get("x-vercel-mitigated") !== null;
  if (challenged) {
    console.warn(`\n這台電腦被 Vercel 防火牆要求驗證（${keyUrl} → 403 challenge），略過金鑰檢查，照樣通知。`);
  } else if (!keyRes.ok || keyBody !== INDEXNOW_KEY) {
    console.error(`\n金鑰檔還沒上線（${keyUrl} → ${keyRes.status}）。等部署完成再跑。\n`);
    process.exit(1);
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: keyUrl, urlList }),
  });

  // 200 = 收到並處理；202 = 收到、金鑰待驗證。兩個都算成功。
  const ok = res.status === 200 || res.status === 202;
  console.log(`\n${ok ? "✓" : "✗"} IndexNow 回應 ${res.status}，通知了 ${urlList.length} 個網址`);
  if (!ok) {
    console.error(await res.text());
    process.exit(1);
  }
  console.log(`  Bing、Yandex、Naver、Seznam 會陸續來爬。`);
  console.log(`  Bing 的狀況可以在 Bing Webmaster Tools 看。\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
