import type { MetadataRoute } from "next";
import { allPaths } from "@/lib/slugs";

const BASE = "https://zone27.com.tw";

/**
 * 程序化決策頁全部進 sitemap —— 這些長尾頁才是承接搜尋的主力，
 * 首頁只是入口。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/dog-food`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/how-we-choose`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ask`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // 這一頁是自己讀成分表寫出來的，抄不走 —— 權重給到跟索引頁一樣
    { url: `${BASE}/dog-food/hidden-chicken`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // 「狗一天吃多少」是有購買意圖的資訊型查詢，權重給高
    { url: `${BASE}/dog-food/how-much`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dog-food/grain-free`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...allPaths().map((slug) => ({
      url: `${BASE}/dog-food/${slug.join("/")}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      // 品種+過敏原的交集頁意圖最精準，權重給高一點
      priority: slug.length === 2 ? 0.8 : 0.7,
    })),
  ];
}
