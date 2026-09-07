import type { MetadataRoute } from "next";

/**
 * 目前只有首頁。程序化決策頁（/pet/dog-food/柴犬/5歲/避雞肉 這種）
 * 會在資料建置完成後大量加入 —— 那才是承接長尾搜尋的主力。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zone27.com.tw",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
