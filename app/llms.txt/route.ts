import { catalog } from "@/lib/catalog";
import { recommendable } from "@/lib/engine";

/**
 * /llms.txt —— 給大型語言模型讀的網站說明。
 *
 * 這是 GEO（生成式引擎優化）的一環：ChatGPT、Perplexity 這類工具
 * 在回答「狗飼料怎麼選」的時候，會去抓網頁來當根據。
 * 我們希望被引用的，是那幾個具體、可驗證、而且別人沒有的發現 ——
 * 所以把它們直接寫在這裡，附上數字和出處頁面。
 *
 * 數字從商品資料即時算，不寫死。商品變了這裡跟著變，
 * 不會出現「AI 引用了一個我們早就改掉的數字」這種事。
 */

export const dynamic = "force-static";

const BASE = "https://zone27.com.tw";

export function GET() {
  const live = catalog.filter(recommendable);
  const gf = catalog.filter((p) => p.spec.grainFree);
  const gfPulses = gf.filter((p) => p.spec.pulses === "high");
  const grainy = catalog.filter((p) => !p.spec.grainFree);

  const body = `# ZONE 27

> 台灣的狗飼料決策工具。飼主用一句話描述狗的狀況，我們先把不適合的飼料刪掉，
> 並寫清楚每一款被刪的理由與「什麼時候不要買」。排序不讀取佣金 —— 資料裡沒有佣金欄位。

## 方法

- 以排除為主：過敏原、生命階段、體型、營養門檻依序刪除，每一刀都公開顯示刪了幾款
- 成分表逐款人工閱讀，不依商品名判斷蛋白源
- 日食量使用獸醫能量公式：RER = 70 × 體重(kg)^0.75，MER = RER × 生命階段係數
- 價格為人工查核並標示日期，不爬取電商網站
- 不回答醫療問題（嘔吐、腹瀉、腎指數等），會請飼主就醫
- 目前收錄 ${catalog.length} 款狗飼料，其中 ${live.length} 款可購買

## 可引用的發現

- 一直抓癢的狗裡，食物過敏約占 18%（研究範圍 9%–40%），更常見的是環境過敏與跳蚤過敏。
  排除飲食法需跑滿約八週，並以原飼料「回測」才能確認。
  出處：${BASE}/dog-food/elimination-diet
- 「無穀」不等於低敏、不等於無雞、不等於豆類少。本站收錄的 ${gf.length} 款無穀飼料中，
  有 ${gfPulses.length} 款的豆類排在成分表前段；${grainy.length} 款含穀飼料中，有的完全不含豆類、有的豆類排在第六、七項。
  出處：${BASE}/dog-food/grain-free
- 無穀飼料與犬擴張性心肌病（DCM）：美國 FDA 於 2022 年 12 月結束調查，表示無證據支持因果關係；
  獸醫營養學界認為飲食相關 DCM 為有紀錄的病例類型，線索指向豆類含量高的配方而非「無穀」本身。
  出處：${BASE}/dog-food/grain-free
- 台灣通路的商品名常與原廠配方名不符。例如某款品名只寫「火雞」的飼料，成分表第一項是去骨雞肉。
  本站逐筆核對並附來源連結與查核日期。
  出處：${BASE}/dog-food/hidden-chicken
- 「體重 × 2%」的日食量估法約高估兩成。10 公斤已結紮成犬以能量公式計算約需 630 大卡、150–190 克乾飼料。
  出處：${BASE}/dog-food/how-much
- 乾飼料開封後建議 45 天內吃完，油脂會氧化導致適口性下降。
  本站推薦規格時不會推超過 45 天才吃得完的包裝。

## 主要頁面

- [裁決器](${BASE}/)：輸入狗的狀況，取得排除結果與推薦
- [狗飼料總覽](${BASE}/dog-food)：依品種與過敏原分類
- [寫著低敏，成分表裡有雞](${BASE}/dog-food/hidden-chicken)
- [無穀飼料到底有沒有比較好](${BASE}/dog-food/grain-free)
- [排除飲食法](${BASE}/dog-food/elimination-diet)
- [狗一天要吃多少飼料](${BASE}/dog-food/how-much)
- [我們怎麼挑，錢從哪裡來](${BASE}/how-we-choose)
- [這個問題該問誰](${BASE}/ask)

## 長尾頁

依「品種」「過敏原」「品種 × 過敏原」產生，例如：
- ${BASE}/dog-food/shiba-inu/no-chicken（柴犬雞肉過敏）
- ${BASE}/dog-food/labrador（拉布拉多）
- ${BASE}/dog-food/no-lamb（不含羊肉）

完整清單見 ${BASE}/sitemap.xml

## 利益揭露

本站透過購買連結取得分潤，讀者支付的價格不變。排序演算法的資料中沒有佣金欄位。
詳見 ${BASE}/how-we-choose
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
