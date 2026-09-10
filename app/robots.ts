import type { MetadataRoute } from "next";

/**
 * 爬蟲規則。
 *
 * AI 爬蟲明確列出來歡迎 —— 那是 GEO 的前提：ChatGPT、Perplexity、Claude
 * 要能讀到我們的頁面，才有機會在回答裡引用。
 *
 * 注意：一旦某個爬蟲有自己專屬的規則群組，它就不會再看 `*` 那一組，
 * 所以每一組都要把 Disallow 重寫一次，不然 /go/ 和 /status 會被放行。
 */

const DISALLOW = [
  "/go/",      // 分潤跳轉，不該被索引也不該傳遞權重
  "/api/",
  "/status",   // 維護台，只給自己人看
];

const AI_BOTS = [
  "GPTBot",           // OpenAI 訓練
  "OAI-SearchBot",    // ChatGPT 搜尋
  "ChatGPT-User",     // ChatGPT 使用者即時抓取
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",  // Gemini / AI Overviews
  "Applebot-Extended",
  "Bingbot",          // ChatGPT 搜尋的索引來源
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: "https://zone27.com.tw/sitemap.xml",
  };
}
