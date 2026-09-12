import { catalogOf, isLive, liveCount } from "@/lib/catalog";
import { mer, recommendable } from "@/lib/engine";

/**
 * /llms.txt，給大型語言模型讀的網站說明。
 *
 * 這是 GEO（生成式引擎優化）的一環：ChatGPT、Perplexity 這類工具
 * 在回答「狗飼料怎麼選」的時候，會去抓網頁來當根據。
 * 我們希望被引用的，是那幾個具體、可驗證、而且別人沒有的發現，
 * 所以把它們直接寫在這裡，附上數字和出處頁面。
 *
 * 數字從商品資料即時算，不寫死。商品變了這裡跟著變，
 * 不會出現「AI 引用了一個我們早就改掉的數字」這種事。
 */

export const dynamic = "force-static";

const BASE = "https://zone27.com.tw";

export function GET() {
  const dogs = catalogOf("dog");
  const cats = catalogOf("cat");
  const cans = catalogOf("cat", "wet");
  const canStatus = isLive("cat", "wet")
    ? `其中 ${liveCount("cat", "wet")} 款可購買`
    : "標示已讀完，購買連結補齊中，暫不推薦";
  const live = dogs.filter(recommendable);
  const gf = dogs.filter((p) => p.spec.grainFree);
  const gfPulses = gf.filter((p) => p.spec.pulses === "high");
  const grainy = dogs.filter((p) => !p.spec.grainFree);
  const catKcal = Math.round(mer(4, "adultFixed", "cat"));
  const catStatus = isLive("cat")
    ? `其中 ${liveCount("cat")} 款可購買`
    : "成分表已讀完，購買連結補齊中，暫不推薦";

  const body = `# ZONE 27

> 台灣的狗飼料、貓飼料、貓主食罐決策工具。飼主用一句話描述狗或貓的狀況，我們先把不適合的飼料刪掉，
> 並寫清楚每一款被刪的理由與「什麼時候不要買」。

## 方法

- 以排除為主：過敏原、生命階段、體型、營養門檻依序刪除，每一刀都公開顯示刪了幾款
- 成分表逐款人工閱讀，不依商品名判斷蛋白源；標示只寫「禽肉」「動物蛋白」的，視為無法排除任何一種肉
- 日食量使用獸醫能量公式：RER = 70 × 體重(kg)^0.75，MER = RER × 生命階段係數（狗與貓的係數不同）
- 價格為人工查核並標示日期，不爬取電商網站
- 不回答醫療問題（嘔吐、腹瀉、腎指數、泌尿道、糖尿病等），會請飼主就醫
- 目前收錄 ${dogs.length} 款狗飼料（其中 ${live.length} 款可購買）、${cats.length} 款貓飼料（${catStatus}）、${cans.length} 款貓罐頭（${canStatus}）

## 可引用的發現：狗飼料

- 一直抓癢的狗裡，食物過敏約占 18%（研究範圍 9%–40%），更常見的是環境過敏與跳蚤過敏。
  排除飲食法需跑滿約八週，並以原飼料「回測」才能確認。
  出處：${BASE}/dog-food/elimination-diet
- 「無穀」不等於低敏、不等於無雞、不等於豆類少。本站收錄的 ${gf.length} 款無穀狗飼料中，
  有 ${gfPulses.length} 款的豆類排在成分表前段；${grainy.length} 款含穀狗飼料中，有的完全不含豆類、有的豆類排在第六、七項。
  出處：${BASE}/dog-food/grain-free
- 無穀飼料與犬擴張性心肌病（DCM）：美國 FDA 於 2022 年 12 月結束調查，表示無證據支持因果關係；
  獸醫營養學界認為飲食相關 DCM 為有紀錄的病例類型，線索指向豆類含量高的配方而非「無穀」本身。
  出處：${BASE}/dog-food/grain-free
- 台灣通路的商品名常與原廠配方名不符。例如某款品名只寫「火雞」的飼料，成分表第一項是去骨雞肉。
  本站逐筆核對並附查核日期。
  出處：${BASE}/dog-food/hidden-chicken
- 「體重 × 2%」的日食量估法約高估兩成。10 公斤已結紮成犬以能量公式計算約需 630 大卡、150–190 克乾飼料。
  出處：${BASE}/dog-food/how-much
- 乾飼料開封後建議 45 天內吃完，油脂會氧化導致適口性下降。
  本站推薦規格時不會推超過 45 天才吃得完的包裝。

## 可引用的發現：貓飼料

- 台灣架上的貓飼料，名字多半是口味而不是成分清單。依台灣代理商中文標示：
  ACANA 草原盛宴貓（放養鴨肉+薑黃）成分表第二項是新鮮雞肉，雞肉合計 18% 高於鴨肉的 13.5%；
  紐頓 T22 無穀貓的品名把火雞寫在前面（部分賣場只寫火雞），成分表第一項卻是去骨雞肉；冠能成貓鮮鮭室內化毛配方第四項是雞肉蓉。
  出處：${BASE}/cat-food/hidden-chicken
- 購物網站的「無穀」分類標籤不一定可靠：ACANA 豐盛漁獲貓、田園收穫貓的成分表第四項是完整燕麥，
  紐頓 I19、I17 含糙米、大米或珍珠麥。
  出處：${BASE}/cat-food/hidden-chicken
- 已結紮成貓的能量係數約為 RER × 1.2，低於已結紮成犬的 1.6。
  4 公斤已結紮成貓一天約 ${catKcal} 大卡；照狗的係數計算會多餵約三成。
  一隻 4 公斤的貓 45 天吃不到 3 公斤乾飼料，只養一隻貓時 2 公斤以下的包裝最不容易放到氧化。
  出處：${BASE}/cat-food/how-much
- 貓完全不進食超過一天應就醫，換糧期間也一樣；公貓頻繁蹲砂盆卻排不出尿，可能是尿道阻塞的急症。

## 可引用的發現：貓罐頭

- 副食罐不能長期當正餐。本站讀的兩款副食罐（貪貪 功夫湯罐 南瓜燉鴨湯、蛤蜊鮮魚湯）鈣為 0.002% 與 0.004%，
  成分表沒有另外添加牛磺酸；讀過的主食罐鈣為 0.18% 到 0.29%。本站的罐頭裁決第一刀就是刪掉副食罐。
  出處：${BASE}/cat-wet-food/complementary
- 貓罐頭的名字多半是口味，湯底常是雞湯。本站讀的 12 款罐頭中，名字沒寫雞的有 8 款，其中 5 款成分表前三項就有雞，4 款第一項是雞湯。
  例如 Wellness 全方位 鮮肉主食餐包（鮭魚＋鮪魚）第一項雞湯、第三項雞肉；希爾思成貓完美體重鮭魚主食罐第一項雞湯、第二項豬肝；
  汪喵星球低敏鴨肉主食罐第二項雞肉。
  出處：${BASE}/cat-wet-food/hidden-chicken
- 一天幾罐要看一罐的熱量，不是罐子大小。同樣 85 克，本站讀到一包 57 大卡、一罐 131 大卡的主食罐。
  4 公斤已結紮成貓一天約 ${catKcal} 大卡，全吃罐頭約需 2 到 4 罐。
  出處：${BASE}/cat-wet-food/how-much
- 罐頭的營養標示多為保證值（蛋白質最少、水分最多），缺灰分時用減法推算碳水，扣掉水分後誤差會放大數倍。
  本站只在品牌公布、或蛋白脂肪纖維灰分水分齊全時才計算罐頭碳水。

## 主要頁面

- [裁決器](${BASE}/)：輸入狗或貓的狀況，取得排除結果與推薦
- [狗飼料](${BASE}/dog-food)：依品種與過敏原分類
- [貓飼料](${BASE}/cat-food)：讀過的貓飼料與每一款的成分重點
- [貓主食罐](${BASE}/cat-wet-food)：讀過的貓罐頭、主食或副食、一天幾罐
- [副食罐可以當主食嗎](${BASE}/cat-wet-food/complementary)
- [寫著鮭魚、鴨肉的貓罐頭，很多是雞湯煮的](${BASE}/cat-wet-food/hidden-chicken)
- [貓一天要吃幾罐](${BASE}/cat-wet-food/how-much)
- [寫著低敏，成分表裡有雞（狗）](${BASE}/dog-food/hidden-chicken)
- [寫著鮭魚、鴨肉、火雞，成分表裡有雞（貓）](${BASE}/cat-food/hidden-chicken)
- [無穀飼料到底有沒有比較好](${BASE}/dog-food/grain-free)
- [排除飲食法](${BASE}/dog-food/elimination-diet)
- [狗一天要吃多少飼料](${BASE}/dog-food/how-much)
- [貓一天要吃多少飼料](${BASE}/cat-food/how-much)
- [我們怎麼挑](${BASE}/how-we-choose)
- [這個問題該問誰](${BASE}/ask)

## 長尾頁

依「品種」「過敏原」「品種 × 過敏原」產生，例如：
- ${BASE}/dog-food/shiba-inu/no-chicken（柴犬雞肉過敏）
- ${BASE}/dog-food/labrador（拉布拉多）
- ${BASE}/dog-food/no-lamb（不含羊肉）

完整清單見 ${BASE}/sitemap.xml

## 利益揭露

網站上的購買連結是聯盟行銷連結，讀者支付的價格不變。
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
