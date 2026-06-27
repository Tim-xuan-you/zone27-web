import type { MetadataRoute } from "next";

// ── ZONE 27 · sitemap.xml ──────────────────────────────────────────────────
// 上線解凍(2026-06-22 · Tim 明確「告訴全世界 · GO」)後補的 SEO 地基之一。
// 隱身期刻意不放(AGENTS.md SEO freeze)· 品牌網域 zone27.com.tw 上線後才開。
//
// 只列「穩定、公開、有內容」的靜態路由(canonical = metadataBase 已是 zone27.com.tw)。
// 刻意不列:
//   · 私密 / 工具頁:/admin(noindex)· /auth/* · /member 及其子頁(登入後儀表板)· /login · /verify
//   · 動態逐筆頁:/matches/[id] · /soccer/[id] · /receipts/[id] · /u/[code] · /calibration/result/[r]
//     —— 這些靠站內連結 + RSS 被發現即可;未來要把已結算賽事/公開檔加進 sitemap 再做 data-driven 版。
// 路由清單對齊「現存 page.tsx」(近期大幅砍頁後的真實狀態 · 別憑舊 route map 補回已刪頁)。
// ─────────────────────────────────────────────────────

const BASE = "https://zone27.com.tw";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const ROUTES: Entry[] = [
  // 首頁 + 即時產品面(常變)
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/matches", priority: 0.9, changeFrequency: "daily" },
  { path: "/matches/mlb", priority: 0.8, changeFrequency: "daily" },
  { path: "/soccer", priority: 0.8, changeFrequency: "daily" },
  { path: "/tennis", priority: 0.8, changeFrequency: "daily" },
  { path: "/badminton", priority: 0.8, changeFrequency: "daily" },
  { path: "/table", priority: 0.7, changeFrequency: "daily" },
  { path: "/pulse", priority: 0.7, changeFrequency: "daily" },
  { path: "/ladder", priority: 0.6, changeFrequency: "daily" },
  { path: "/markets", priority: 0.6, changeFrequency: "daily" },
  // 引擎工具
  { path: "/lab", priority: 0.8, changeFrequency: "weekly" },
  { path: "/lab/custom", priority: 0.6, changeFrequency: "monthly" },
  // 信任 / 戰績(護城河 · 中頻)
  { path: "/track-record", priority: 0.9, changeFrequency: "daily" },
  { path: "/calibration", priority: 0.8, changeFrequency: "weekly" },
  { path: "/calibration/test", priority: 0.8, changeFrequency: "weekly" },
  { path: "/corrections", priority: 0.7, changeFrequency: "monthly" },
  { path: "/audit", priority: 0.8, changeFrequency: "monthly" },
  { path: "/methodology", priority: 0.7, changeFrequency: "monthly" },
  { path: "/how-we-grade", priority: 0.7, changeFrequency: "monthly" },
  { path: "/coverage", priority: 0.6, changeFrequency: "monthly" },
  { path: "/ethics", priority: 0.6, changeFrequency: "monthly" },
  // 認識 / 入門 / 身分
  { path: "/engines", priority: 0.7, changeFrequency: "monthly" },
  { path: "/star", priority: 0.7, changeFrequency: "monthly" },
  { path: "/learn", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/membership", priority: 0.7, changeFrequency: "monthly" },
  { path: "/membership/black-card", priority: 0.6, changeFrequency: "monthly" },
  // 回報問題(每頁 footer 入口 · 任何人可達)
  { path: "/feedback", priority: 0.5, changeFrequency: "yearly" },
  // 法務(低頻)
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
