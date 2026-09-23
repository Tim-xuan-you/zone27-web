import type { Metadata } from "next";
import Checker from "@/components/Checker";
import Share from "@/components/Share";
import SiteHeader from "@/components/SiteHeader";
import { checkItems, checkStats } from "@/lib/check";

/**
 * 你家那包飼料，有沒有藏雞？
 *
 * 全站最有辨識度的東西：我們一款一款讀成分表，名字沒寫雞的有將近一半有雞。
 * 以前這件事分散在三篇文章裡，讀者要自己讀完才知道；這一頁讓他打名字就查到自己那一包。
 * 查到有雞的，直接給同一類完全不含雞的幾款。查不到的，一鍵寄給我們，我們去讀。
 */

const items = checkItems();
const st = checkStats(items);

/*
 * 給搜尋引擎、AI 搜尋讀的問答：「XX 有雞嗎？」
 * 有人在 Bing、ChatGPT 問某一包有沒有雞，答案直接是這一頁的這一款
 */
const ANSWER = {
  hidden: "有。名字沒寫雞，但成分表裡有雞。",
  chicken: "有，名字就寫了。",
  fat: "肉沒有雞，但油脂用的是雞脂肪。",
  unsure: "說不準：成分表只寫「禽肉」或「動物蛋白」，沒講是哪一種。",
  clean: "沒有，成分表裡找不到雞。",
} as const;
const FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((x) => ({
    "@type": "Question",
    name: `${x.brand} ${x.name} 有雞嗎？`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${ANSWER[x.status]}成分表裡的肉：${x.meats}。${x.found ? x.found.join("；") + "。" : ""}`,
    },
  })),
};

export const metadata: Metadata = {
  title: "你家那包飼料有沒有藏雞",
  description:
    `我們一款一款讀過 ${st.total} 款狗飼料、狗罐頭、貓飼料、貓罐頭的成分表。名字沒寫雞的 ${st.unnamed} 款裡，` +
    `${st.hidden} 款成分表裡有雞，${st.unsure} 款只寫「禽肉」「動物蛋白」。打名字就查得到你家那一包。`,
  alternates: { canonical: "/check" },
};

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ) }} />
      <SiteHeader />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        你家那包飼料，<br />有沒有藏雞？
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 8px", maxWidth: "42ch" }}>
        名字寫鮭魚、鴨肉、牛肉的，不一定沒有雞。我們讀過的 {st.total} 款裡，名字沒寫雞的有 {st.unnamed} 款，
        其中 <b style={{ color: "var(--cut)" }}>{st.hidden} 款成分表裡有雞</b>，另外 {st.unsure} 款只寫「禽肉」或「動物蛋白」，沒講是哪一種。
      </p>
      <p style={{ color: "var(--faint)", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px" }}>
        打名字查，點開看是成分表第幾項。
      </p>

      <Checker items={items} />

      <div style={{ marginTop: 32 }}>
        <Share path="/check" text="你家那包飼料有沒有藏雞？打名字就查得到：" label="把這頁傳給朋友" />
      </div>

      <p style={{ marginTop: 28, fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9 }}>
        成分照台灣代理商的中文標示和品牌官網。配方會改版，以你手上那一包的包裝為準。
        我們只讀了這 {st.total} 款，沒列出來的不代表沒有雞。
      </p>
    </main>
  );
}
