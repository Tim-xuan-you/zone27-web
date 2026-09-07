import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /go/ 是分潤跳轉，不該被索引也不該傳遞權重
        disallow: ["/go/", "/api/"],
      },
    ],
    sitemap: "https://zone27.com.tw/sitemap.xml",
  };
}
