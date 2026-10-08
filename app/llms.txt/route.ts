import { catalogOf, isLive, liveCount } from "@/lib/catalog";
import { cansOf, mer, recommendable } from "@/lib/engine";
import { ACORN_LEVELS } from "@/lib/worksheets/acorn";
import { ACORN_SHEETS } from "@/lib/worksheets/acorn-sheets";
import { GUESS_LEVELS } from "@/lib/worksheets/guess";
import { MATCH_THEMES } from "@/lib/worksheets/match";
import { NUMBER_LEVELS } from "@/lib/worksheets/number";

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
  const dogCans = catalogOf("dog", "wet");
  const dogCansUnnamed = dogCans.filter((p) => !/(?<!火)雞/.test(p.name));
  const dogCansHidden = dogCansUnnamed.filter((p) => p.chicken?.status === "hidden");
  const dogCansClean = dogCans.filter((p) => p.chicken?.status === "clean");
  const dogKcal = Math.round(mer(12, "adultFixed", "dog"));
  const dogAsFed = dogCans.map((p) => p.spec.asFed?.protein ?? p.spec.protein);
  const dogDm = dogCans.map((p) => p.spec.protein);
  const dogCansPerDay = dogCans
    .map((p) => { const c = cansOf(p.price.unit); return c && p.spec.kcal ? dogKcal / ((c.g / 1000) * p.spec.kcal) : null; })
    .filter((n): n is number => n !== null);
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

> 免費的益智學習單（2026-10 起的主軸），由一個大班生的爸爸製作。A4 印了就能寫，說明都有注音，答案不用寫國字，
> 卡住了可以掃 QR code 一段一段看提示。網站也保留了早期做的狗貓飼料、充電器、行動電源比較。

## 學習單

免費、A4、可以下載 PDF。適合中班、大班、小一的孩子。作者是一個大班生的爸爸（Tim），每一款玩法上線前都先給自己的孩子寫過。

### 撿松果回家（幼兒迷宮學習單）

- 總覽：${BASE}/worksheets/acorn
- 規則：小松鼠從左上角走到右下角的房子，路上每一顆松果都要撿到，每個格子只能走一次
- 每一題都用程式窮舉所有走法，確認只有一個答案；直接走最短的路一定會漏掉松果，孩子要先規劃路線
- 說明文字全部加注音（字型為芫荽 Iansui，依教育部標準字形調整），答案用畫的，不需要寫國字
- 每一張右下角有 QR code，掃了看提示，提示分三段、一次只開一段，最後才是答案
- 題目全部自行出題，不改編市售評量或益智書
${ACORN_LEVELS.map((L) => `- 第 ${L.n} 關（${L.grade}，${L.age}，${L.W}×${L.H} 格子，每題 ${L.acMin}～${L.acMax} 顆松果）：${BASE}/worksheets/acorn/${L.n}　整關 PDF：${BASE}/worksheets/files/acorn-${L.n}.pdf`).join("\n")}

### 換你出題（出題紙）

- ${BASE}/worksheets/make
- 讓孩子當出題的人：迷宮出題單（空白格子，孩子畫牆、畫松果）、萬用出題紙（答案寫在下面往後摺）
- PDF：${BASE}/worksheets/files/make-acorn.pdf、${BASE}/worksheets/files/make-free.pdf

### 注音猜猜看（注音學習單）

- 總覽：${BASE}/worksheets/zhuyin
- 點子來自作者的大班孩子：自己畫了一張題目考爸爸，上面寫注音，要猜是什麼東西
- 每張 6 題、兩種玩法，題目一樣：圈圈看（左邊注音、右邊三張圖，圈出對的）、寫寫看（看圖，在格子裡寫出注音和聲調）
- 每一個詞的注音都用程式拿去跟教育部《國語辭典簡編本》（沒收的查《重編國語辭典修訂本》）比對；輕聲的點寫在最上面、聲調在右邊，跟課本排法一樣
- 辭典讀音跟一般人常念的不同的詞（例如「骨頭」辭典為 ㄍㄨˊ ˙ㄊㄡ）不收，避免跟學校教的衝突
- 第 3 關的陷阱只差一個符號且聲調相同（星／心、書／豬、火／鎖），第 4 關只差聲調（魚／雨、書／樹、椰子／葉子）
- 圖全部自己畫，每張右下角 QR code 掃了是答案
${GUESS_LEVELS.map((L) => `- 第 ${L.n} 關「${L.name}」（${L.grade}，${L.age}；${L.what}）：${BASE}/worksheets/zhuyin/${L.n}　圈圈看 PDF：${BASE}/worksheets/files/zhuyin-${L.n}-circle.pdf　寫寫看 PDF：${BASE}/worksheets/files/zhuyin-${L.n}-write.pdf`).join("\n")}

### 連連看（誰吃什麼、長大變成什麼）

- 總覽：${BASE}/worksheets/match
- 點子來自作者的大班孩子：自己畫了一張連連看（蝴蝶、海鷗連毛毛蟲、魚），中間塗黑的小圓點是連線的地方
- 每一組答案都先查過資料再收；一般人以為的答案跟事實不同的，收事實（例：兔子主要吃草，紅蘿蔔只能偶爾吃）。同一張不會有兩個都說得通的答案
- 每張圖下面有名字和注音（注音對過教育部國語辭典），答案頁附每一組的小知識
${MATCH_THEMES.map((T) => `- ${T.name}：${BASE}/worksheets/match/${T.id}　PDF：${BASE}/worksheets/files/match-${T.id}.pdf
${T.pairs.map((p) => `  - ${p.left.name}${T.verb}${p.right.name}：${p.fact}${p.source ? `（資料：${p.source}）` : ""}`).join("\n")}`).join("\n")}

### 數字松果（加法迷宮數學學習單）

- 總覽：${BASE}/worksheets/number
- 撿松果回家的迷宮加上數字：撿到的松果加起來要剛好等於房子上的數字，每個格子只能走一次，不用每一顆都撿
- 每一題都用程式把起點到房子的每一條路走過一遍、算出總和，剛好等於房子數字的只有一條
- 掃 QR code 先看要撿哪幾顆（路線讓孩子自己找），還是不會再看路線
${NUMBER_LEVELS.map((L) => `- 第 ${L.n} 關「${L.name}」（${L.grade}，${L.age}；${L.what}，${L.W}×${L.H} 格子）：${BASE}/worksheets/number/${L.n}　整關 PDF：${BASE}/worksheets/files/number-${L.n}.pdf`).join("\n")}

## 早期內容：寵物飼料與 3C

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

- 零食的通則是不超過一天總熱量的 10%。一隻 4 公斤已結紮的成貓一天約 200 大卡，零食上限約 20 大卡。
  CIAO 一般肉泥一條 7 大卡，兩條就到上限；綜合營養配方一條 13 大卡。凍乾水分只有 2.5%，每 100 公克 350 到 470 大卡，一天四到六公克就到上限。
  出處：${BASE}/cat-treat

## 可引用的發現：狗罐頭

- 狗罐頭的名字常寫稀有蛋白，成分表前段卻是雞。本站讀的 ${dogCans.length} 款狗主食罐中，名字沒寫雞的有 ${dogCansUnnamed.length} 款，其中 ${dogCansHidden.length} 款成分表裡有雞；
  整張成分表找不到雞的只有 ${dogCansClean.length} 款。例如汪喵星球犬用 Fantastic 95% 鹿肉主食罐第二到五項是雞肉、雞心肝、雞軟骨、雞蛋黃；
  怪獸部落犬2肉主食罐鱉肉鱉蛋第一項是雞肉；汪喵星球熟齡犬銀養主食罐燉羊肉第一項是雞肉及雞肝。做排除飲食時換到這類罐頭等於沒換。
  出處：${BASE}/dog-wet-food/hidden-chicken
- 狗罐頭包裝上的蛋白質不能直接比。本站讀的狗主食罐包裝上的蛋白質從 ${Math.min(...dogAsFed)}% 到 ${Math.max(...dogAsFed)}%，
  扣掉水分後是 ${Math.min(...dogDm)}% 到 ${Math.max(...dogDm)}%，差距大部分來自水分，排名也會翻轉。
  出處：${BASE}/dog-wet-food/protein
- 12 公斤已結紮成犬一天約 ${dogKcal} 大卡，全吃主食罐一天要 ${Math.min(...dogCansPerDay).toFixed(1)} 到 ${Math.max(...dogCansPerDay).toFixed(1)} 罐，看一罐的熱量。
  西莎自然素材餐盒包裝自己標示 5 公斤的狗一天 5 又 1/3 盒；該款粗蛋白不低於 5%，成分表第一項是水。
  出處：${BASE}/dog-wet-food/how-much

## 可引用的發現：充電器

- Apple 寫的：iPhone 18 Pro／Pro Max 約 15 分鐘充到 50%，要 60W 以上、支援可調式電壓供電（AVS）與 USB PD 3.2 的轉接器。規格上沒寫 AVS 的 65W、70W 能充，但不是這個速度。
  出處：${BASE}/charger/iphone-18-pro
- 寫了 AVS 的也要看那一檔幾瓦：KINYO 60W 晶透快充的官方規格，AVS 是 15V 2.67A、20V 2A，最多 40W。
  出處：${BASE}/charger/p/ch-09
- Apple 35W 雙孔同時充 Mac 筆電與 iPhone，每一台最多 17.5W（Apple 支援文件）。三星 65W 三孔三個孔一起插是 35W＋25W＋5W，給 Galaxy S26 Ultra 只到 PPS 45W；S26 Ultra 的超快速充電 3.0 要 PPS 60W（三星官網）。
  出處：${BASE}/charger

## 可引用的發現：行動電源

- 小米行動電源 10000 22.5W Lite 的官方規格：電池 37Wh（10000mAh），額定容量 5500mAh（5V/3A），轉換率 74%。包裝大字的 mAh 是電池本身，手機拿到的是 5V 的額定容量。
  出處：${BASE}/power-bank/p/pb-02
- 寫 22.5W 的，iPhone 不一定拿得到 22.5W：小米那幾顆的 22.5W 是 10V⎓2.25A，不是 USB PD；USB PD 最高 9V⎓2.23A（20W）。
  出處：${BASE}/power-bank
- Anker Nano 10000mAh 45W（A1638）官網：自帶線或 USB-C 孔單獨最高 45W，線和孔一起用總共 22.5W（線 15W、孔 7.5W）。
  出處：${BASE}/power-bank/p/pb-04
- 民航局：鋰電池小於 100 瓦特小時可攜帶上機，100 到 160 瓦特小時要航空公司同意（最多 2 個），只能手提不能託運；2026 年 4 月 8 日起每人最多 2 個行動電源，飛行途中不能使用、也不能充電。
  出處：${BASE}/power-bank

## 主要頁面

- [首頁](${BASE}/)：先選要買的東西（狗、貓、充電器），進去後點狀況或裝置取得結果
- [行動電源怎麼選](${BASE}/power-bank)：點你的手機，照官方規格算每一顆行動電源插上去拿到幾瓦；列出包裝寫的 mAh、背面寫手機拿得到的額定容量、能不能帶上飛機（Wh）
- [充電器怎麼選](${BASE}/charger)：點你要充的 iPhone、iPad、MacBook、Galaxy，照官方規格算每一顆充電器插上去各拿到幾瓦
- [iPhone 18 Pro 要哪一顆充電器才會最快](${BASE}/charger/iphone-18-pro)
- [你家那包飼料有沒有藏雞](${BASE}/check)：讀過的每一款狗飼料、狗罐頭、貓飼料、貓罐頭，標出名字沒寫雞、成分表裡有雞的是哪幾款，以及成分表第幾項是雞
- [狗飼料](${BASE}/dog-food)：依品種與過敏原分類
- [貓飼料](${BASE}/cat-food)：讀過的貓飼料與每一款的成分重點
- [狗主食罐](${BASE}/dog-wet-food)：讀過的狗罐頭，名字寫鹿肉、鱉肉但成分表有雞的標出來，一罐幾大卡、一天幾罐
- [第一次養狗，先買這幾樣](${BASE}/dog/first-time)：幼犬吃哪一包、照體重一天吃多少、零食要不要給，還有新手最常買錯的三件事（第一包太大、潔牙骨當點心、以為一罐就是一餐）
- [第一次養貓，先買這幾樣](${BASE}/cat/first-time)：幼貓吃哪一包、貓砂選哪一種、零食要不要給，每一樣直接給一個答案，還有新手最常買錯的三件事
- [貓主食罐](${BASE}/cat-wet-food)：讀過的貓罐頭、主食或副食、一天幾罐
- [貓砂](${BASE}/cat-litter)：照材質判斷能不能沖馬桶、一個月大約多少錢
- [哪些貓砂真的可以沖馬桶](${BASE}/cat-litter/flush)：豆腐砂與稻殼砂適量可沖；礦砂、沸石、水晶不溶於水；木屑砂遇水散開但體積變大容易卡管線；混合砂要看裡面有沒有礦砂
- [貓零食一天可以給幾條](${BASE}/cat-treat)：照熱量算出每一款的每日上限，零食不超過一天熱量的 10%
- [副食罐可以當主食嗎](${BASE}/cat-wet-food/complementary)
- [寫著鮭魚、鴨肉的貓罐頭，很多是雞湯煮的](${BASE}/cat-wet-food/hidden-chicken)
- [貓一天要吃幾罐](${BASE}/cat-wet-food/how-much)
- [寫著低敏，成分表裡有雞（狗）](${BASE}/dog-food/hidden-chicken)
- [寫著鮭魚、鴨肉、火雞，成分表裡有雞（貓）](${BASE}/cat-food/hidden-chicken)
- [無穀飼料到底有沒有比較好](${BASE}/dog-food/grain-free)
- [排除飲食法](${BASE}/dog-food/elimination-diet)
- [狗零食一支佔一天額度的幾成](${BASE}/dog-treat)：Greenies 自己公布一支 25 到 142 大卡，一支常常就吃掉一整天的零食額度
- [狗吃主食罐一天要幾罐](${BASE}/dog-food/cans)：照體重算一天的熱量，除以一罐幾大卡；附乾糧的對照價
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
