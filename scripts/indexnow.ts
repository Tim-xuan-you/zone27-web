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
import { allPaths } from "../lib/slugs";

const HOST = "zone27.com.tw";
const BASE = `https://${HOST}`;

const STATIC = [
  "/", "/dog-food", "/how-we-choose", "/ask",
  "/dog-food/hidden-chicken", "/dog-food/grain-free",
  "/dog-food/elimination-diet", "/dog-food/how-much",
];

async function main() {
  const only = process.argv.slice(2).filter((a) => a.startsWith("/"));
  const paths = only.length
    ? only
    : [...STATIC, ...allPaths().map((s) => "/dog-food/" + s.join("/"))];
  const urlList = paths.map((p) => BASE + p);

  // 先確認金鑰檔在線上 —— 沒有的話 Bing 會拒絕，白送一趟
  const keyUrl = `${BASE}/${INDEXNOW_KEY}.txt`;
  const keyRes = await fetch(keyUrl);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== INDEXNOW_KEY) {
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
