import type { Metadata } from "next";
import Link from "next/link";
import Calc from "@/components/Calc";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { CAT_MER_FACTORS, FRESH_DAYS, KCAL_PER_KG, dailyGrams, mer, type Stage } from "@/lib/engine";

/**
 * 貓一天要吃多少飼料。
 *
 * 跟狗那一頁用同一套算式、同一個計算機元件，只是係數換成貓的。
 * 貓這一頁多講三件事，都是狗那邊不太會遇到的：
 *   1. 結紮成貓的係數只有 1.2，照狗的習慣餵一定會胖
 *   2. 一隻貓吃得很少，大包裝很容易放超過 45 天
 *   3. 很多人乾濕混餵，乾飼料要把濕食的熱量扣掉
 */

const EX_KG = 4;
const EX_KCAL = Math.round(mer(EX_KG, "adultFixed", "cat"));
const EX_LOW = Math.round((EX_KCAL / 4200) * 1000);
const EX_HIGH = Math.round((EX_KCAL / 3300) * 1000);
const EX_G = dailyGrams(EX_KG, "adultFixed", "cat");
/** 一隻 4 公斤的貓，幾公斤的包裝會超過保鮮期限 */
const MAX_BAG = Math.floor((EX_G * FRESH_DAYS) / 100) / 10;

export const metadata: Metadata = {
  title: "貓一天要吃多少飼料",
  description:
    `用獸醫的能量公式算：一天幾克、這包吃幾天、一個月多少錢。4 公斤已結紮的貓一天約 ${EX_KCAL} 大卡、${EX_LOW} 到 ${EX_HIGH} 克。算式和係數全部寫出來。`,
  alternates: { canonical: "/cat-food/how-much" },
  openGraph: { title: "貓一天要吃多少飼料", type: "article" },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "貓一天要吃多少乾飼料？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `先算熱量再換成克數。RER（靜止能量需求）= 70 × 體重(公斤)的 0.75 次方；MER（維持能量需求）= RER × 生命階段係數（已結紮成貓 1.2、未結紮 1.4、幼貓 2.5、高齡或不太活動約 1.1、減重 0.8）。再除以乾飼料的熱量密度就是克數。以 ${EX_KG} 公斤已結紮成貓為例，約 ${EX_KCAL} 大卡、${EX_LOW} 到 ${EX_HIGH} 克。`,
        },
      },
      {
        "@type": "Question",
        name: "乾飼料跟罐頭混著餵，要怎麼算？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "先算一天的總熱量，再把罐頭或主食餐包的熱量扣掉（包裝背面有寫），剩下的才換成乾飼料的克數。很多貓變胖，是因為乾飼料照原本的量餵，罐頭又另外加。",
        },
      },
      {
        "@type": "Question",
        name: "一包貓飼料開封後可以放多久？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `建議 ${FRESH_DAYS} 天內吃完。一隻 ${EX_KG} 公斤的貓一天大約吃 ${EX_G} 克，${FRESH_DAYS} 天吃不到 ${MAX_BAG} 公斤。只養一隻貓的話，2 公斤以下的包裝最剛好，大包每公斤比較便宜，但吃不完會氧化，貓會越吃越不愛吃。`,
        },
      },
    ],
  };

  const stages = Object.keys(CAT_MER_FACTORS) as Stage[];

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <SiteHeader current="cat-food" />

      <h1 style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 18px" }}>
        貓一天要吃多少飼料
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 32px", maxWidth: "42ch" }}>
        順便算這包吃幾天、一個月多少錢。<b style={{ color: "var(--ink)" }}>算式寫在下面，你可以自己驗。</b>
      </p>

      <Calc species="cat" />

      <p style={S.lbl}>貓跟狗差在哪</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          算式一樣，<b>係數差很多</b>。已結紮的成犬乘 1.6，已結紮的成貓只乘 1.2。
          同樣 4 公斤，照狗的係數算會多餵三成，一年下來就是一隻圓滾滾的貓。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          台灣的家貓大多結紮、大多住室內，活動量本來就小。
          包裝背面的餵食表通常是給一般成貓的，結紮的貓照表餵，多半會偏多。
        </p>
      </div>

      <p style={S.lbl}>我們怎麼算的</p>
      <div style={box}>
        <div style={formula} className="mono">
          RER = 70 × 體重<sup>0.75</sup><br />
          MER = RER × 生命階段係數<br />
          一天克數 = MER ÷ 熱量密度
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
          RER 是靜止能量需求，MER 是維持能量需求，狗跟貓用同一條公式。
          熱量密度取 {KCAL_PER_KG.toLocaleString()} 大卡／公斤當中間值，貓乾糧實際上從 3,400 到 4,400 都有。
          我們讀過的那幾款有公布熱量的，推薦時會照那一款自己的熱量算。
        </p>
      </div>

      <p style={S.lbl}>係數</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 320, borderCollapse: "collapse", fontSize: 15 }}>
          <tbody>
            {stages.map((k) => (
              <tr key={k} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: "11px 12px 11px 0" }}>{CAT_MER_FACTORS[k].zh}</td>
                <td style={{ padding: "11px 0", textAlign: "right", fontWeight: 700 }} className="mono">
                  × {CAT_MER_FACTORS[k].factor.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
        成貓、幼貓、減重這幾格取自世界小動物獸醫協會（WSAVA）的建議，高齡那一格是我們取的中間值。
        高齡貓的差異很大，有的越老越瘦反而要吃多一點，真的要精準就問你的獸醫。
      </p>

      <p style={S.lbl}>乾濕混餵的話</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          上面算的是<b>全部熱量都從乾飼料來</b>。有餵罐頭或主食餐包的，
          先把那部分的熱量從總量扣掉（包裝背面有寫），剩下的才換成乾飼料。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          很多貓變胖是這樣來的：乾飼料照原本的量，罐頭另外加，等於一天多吃一餐。
        </p>
      </div>

      <p style={S.lbl}>算完之後最該注意的一件事</p>
      <div style={{ ...box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          <b>一隻貓吃得很少，大包裝很容易放超過 {FRESH_DAYS} 天。</b>
          {EX_KG} 公斤的貓一天大約 {EX_G} 克，{FRESH_DAYS} 天吃不到 {MAX_BAG} 公斤。
          5.4 公斤那種大包，一隻貓要吃快三個月。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          開封後的乾飼料油脂會氧化，放久了貓會越來越不愛吃，很多人以為是牠挑嘴，其實只是放太久了。
          只養一隻的話，2 公斤以下的包裝最剛好。
        </p>
      </div>

      <p style={S.lbl}>誠實的邊界</p>
      <ul style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li><b>包裝背面的餵食表比我們準</b>，那是照那一包的實際熱量算的；只是記得結紮的貓要往下修。</li>
        <li>真正的依據是<b>體態</b>：從上面看得出腰身、摸得到肋骨但不明顯。照數字餵卻越來越胖，相信你的眼睛。</li>
        <li>貓減重要慢，一個禮拜掉超過體重的 2% 就太快了，會傷肝。要減重先問獸醫。</li>
        <li>貓完全不吃東西超過一天，不要等，直接看醫生。</li>
        <li>懷孕、哺乳、生病、手術後，都不適用這個算式。</li>
      </ul>

      <p style={S.lbl}>那要買哪一款</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把貓的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            我們會用剛剛同一個算式，告訴你哪個規格吃得完。
          </p>
        </div>
        <Link style={S.btn} href="/cat-food">去貓飼料</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/cat-food/hidden-chicken" style={S.relLink}>寫著鮭魚、鴨肉、火雞，成分表裡有雞</Link>
        <Link href="/cat-food" style={S.relLink}>我們讀過的貓飼料</Link>
        <Link href="/dog-food/how-much" style={S.relLink}>狗一天吃多少</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          這一頁的算式跟商品卡上的「這包大約吃 N 天」是同一個函式，不會給你兩種答案。
          估算不是餵食指示，牠的體態和你的獸醫才是依據。
        </p>
      </footer>
    </main>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};

const formula: React.CSSProperties = {
  background: "var(--sunken)", border: "1px solid var(--line)",
  borderRadius: 10, padding: "16px 18px",
  fontSize: 14, lineHeight: 2.1,
};
