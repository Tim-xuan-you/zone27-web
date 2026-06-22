import type { MetadataRoute } from "next";

// ── ZONE 27 · robots.txt ───────────────────────────────────────────────────
// 上線解凍(2026-06-22 · Tim「告訴全世界 · GO」)後補。 隱身期刻意不放(AGENTS.md)。
// 開放索引全站內容,只擋:後台 / API / 認證 / 登入後私人儀表板(那些不是給搜尋引擎的內容)。
// sitemap + host 用品牌網域 zone27.com.tw(canonical · 舊 vercel.app 為備用不主動索引)。
// ─────────────────────────────────────────────────────

const BASE = "https://zone27.com.tw";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 私密 / 工具路徑(非公開內容)· 不浪費爬蟲預算、不外曝私人面。
      disallow: ["/admin", "/api/", "/auth/", "/member", "/login", "/verify"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
