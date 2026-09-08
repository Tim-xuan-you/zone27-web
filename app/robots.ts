import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /go/ 是分潤跳轉，不該被索引也不該傳遞權重
        // /status 是維護台，只給自己人看
        disallow: ["/go/", "/api/", "/status"],
      },
    ],
    sitemap: "https://zone27.com.tw/sitemap.xml",
  };
}
