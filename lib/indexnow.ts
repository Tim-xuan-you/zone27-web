/**
 * IndexNow 金鑰。
 *
 * IndexNow 是 Bing 發起的協定：網站主人發布或更新內容時，主動通知搜尋引擎，
 * 不用等爬蟲慢慢發現。支援的有 Bing、Yandex、Naver、Seznam。
 *
 * 為什麼對我們特別重要：**ChatGPT 的網路搜尋用的是 Bing 的索引**，
 * 而且主要在商業意圖的問題上啟動 ——「狗飼料推薦」正是。
 * 所以做 GEO，Bing 跟 Google 一樣重要，而 Google 沒有這種即時通道。
 *
 * 驗證方式：public/<key>.txt 裡放同一串金鑰，證明我們擁有這個網域。
 */
export const INDEXNOW_KEY = "65ef32fe5965f1f493bc6688dc592e8f";
