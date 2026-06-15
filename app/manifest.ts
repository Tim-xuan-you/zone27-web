import type { MetadataRoute } from "next";

// ── ZONE 27 · Web App Manifest ─────────────────────────
// R238 · 補完「已上線的 web-push」最後一塊。 沒有 manifest →
// iOS 無法「加入主畫面」→ standalone 模式不啟動 → Apple 只對
// 已安裝的 web app 送 Web Push(iOS 16.4+)→ iPhone 使用者
// 連「結算提醒」的訂閱開關都看不到(PushManager 在一般 Safari
// 分頁不存在 · isPushSupported() 回 false · PushToggle 直接隱藏)。
// 加上 display:standalone 的 manifest 後 · iPhone 可安裝 →
// 收得到賽後結算推播。 Android / 桌面也升級成可安裝 PWA。
//
// 🔴 這不是 SEO 動作(非 sitemap/robots/JSON-LD/analytics)· 是
//    client 端「安裝 / 佈景」描述符 · 不違反 stealth SEO 凍結。
// 圖示重用既有路由:/icon(64)· /apple-icon(180·iOS 主畫面實際用
//    這顆 apple-touch-icon)· /icon-512.png(Android 安裝 / 啟動畫面)。
// ─────────────────────────────────────────────────────

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ZONE 27 — 不靠直覺,只看演算法",
    short_name: "ZONE 27",
    description:
      "為硬核運動迷打造的暗黑黃金級數據終端 · 引擎自己算勝率 · 賽前鎖定、賽後逐場對帳,連輸的都留著。",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1A2E",
    theme_color: "#0F1A2E",
    lang: "zh-Hant",
    dir: "ltr",
    categories: ["sports"],
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
