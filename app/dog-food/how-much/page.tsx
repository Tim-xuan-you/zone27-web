import type { Metadata } from "next";
import Link from "next/link";
import Calc from "@/components/Calc";
import { S } from "@/components/styles";
import { FRESH_DAYS, KCAL_PER_KG, MER_FACTORS } from "@/lib/engine";

/**
 * 狗一天要吃多少飼料。
 *
 * 這一頁存在的理由是流量：「狗一天吃多少」「飼料一個月多少錢」
 * 是台灣飼主真的會搜、而且搜完就有購買意圖的問題。
 *
 * 但它不是隨便一個計算機 —— 它用的是跟商品卡完全同一個函式，
 * 而且把算式攤開來寫。多數計算機不告訴你它怎麼算的，
 * 我們把公式、係數、熱量密度區間全部印在頁面上，
 * 因為那正好是我們唯一能勝過那些網站的地方。
 */

export const metadata: Metadata = {
  title: "狗一天要吃多少飼料",
  description:
    "用獸醫的能量公式算：一天幾克、這包吃幾天、一個月多少錢。算式和係數全部寫出來，你可以自己驗。",
  alternates: { canonical: "/dog-food/how-much" },
  openGraph: { title: "狗一天要吃多少飼料", type: "article" },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "狗一天要吃多少乾飼料？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "先算熱量再換成克數。RER（靜止能量需求）= 70 × 體重(公斤)的 0.75 次方；MER（維持能量需求）= RER × 生命階段係數（已結紮成犬 1.6、未結紮 1.8、幼犬 2 到 3、高齡約 1.4、減重 1.0）。再除以乾飼料的熱量密度（台灣市售多在每公斤 3,300 到 4,200 大卡）就是克數。以 10 公斤已結紮成犬為例，約 630 大卡、150 到 190 克。",
        },
      },
      {
        "@type": "Question",
        name: "「體重乘以 2%」這個算法準嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "好記，但偏高。10 公斤的狗照 2% 算是 200 克，用能量公式算大約 165 克 —— 差了兩成，長期會胖。體重越大差越多，因為代謝率不是跟體重成正比，是跟體重的 0.75 次方成正比。",
        },
      },
      {
        "@type": "Question",
        name: "一包飼料開封後可以放多久？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "建議 45 天內吃完。乾飼料的油脂開封後會氧化，放久了狗會越來越不愛吃，很多人以為是牌子不好，其實是放太久。買之前先算這包你的狗吃幾天，超過 45 天就該買小一點的包裝，就算大包每公斤比較便宜。",
        },
      },
    ],
  };

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 40,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
        <Link href="/dog-food" style={{ fontSize: 12.5, color: "var(--muted)", textDecoration: "none" }}>
          全部狗飼料
        </Link>
      </div>

      <h1 style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 18px" }}>
        狗一天要吃多少飼料
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 32px", maxWidth: "42ch" }}>
        順便算這包吃幾天、一個月多少錢。<b style={{ color: "var(--ink)" }}>算式寫在下面，你可以自己驗。</b>
      </p>

      <Calc />

      <p style={S.lbl}>我們怎麼算的</p>
      <div style={box}>
        <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.95 }}>
          用的是獸醫營養學的標準算法，兩步：
        </p>
        <div style={formula} className="mono">
          RER = 70 × 體重<sup>0.75</sup><br />
          MER = RER × 生命階段係數<br />
          一天克數 = MER ÷ 熱量密度
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
          RER 是靜止能量需求，MER 是維持能量需求。
          代謝率不是跟體重成正比，是跟體重的 0.75 次方成正比 ——
          所以體重翻倍，食量不會翻倍。
        </p>
      </div>

      <p style={S.lbl}>係數</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 320, borderCollapse: "collapse", fontSize: 15 }}>
          <tbody>
            {(Object.keys(MER_FACTORS) as (keyof typeof MER_FACTORS)[]).map((k) => (
              <tr key={k} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: "11px 12px 11px 0" }}>{MER_FACTORS[k].zh}</td>
                <td style={{ padding: "11px 0", textAlign: "right", fontWeight: 700 }} className="mono">
                  × {MER_FACTORS[k].factor.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
        這幾個數字取自一般獸醫營養學教材的區間中間值。工作犬、活動量特別大的狗會更高，
        真的要精準就問你的獸醫。
      </p>

      <p style={S.lbl}>「體重乘以 2%」為什麼不夠好</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          那個算法好記，但<b>偏高</b>。10 公斤的狗照 2% 算是 200 克，
          用能量公式算大約 165 克 —— <b>差了兩成，長期會胖</b>。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          而且體重越大差越多，因為代謝率跟體重不是線性關係。
          小型犬每公斤要吃得比大型犬多，這件事 2% 完全表達不出來。
        </p>
      </div>

      <p style={S.lbl}>算完之後最該注意的一件事</p>
      <div style={{ ...box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          <b>這包你的狗要吃超過 {FRESH_DAYS} 天，就不要買。</b>
          乾飼料開封後油脂會氧化，放久了狗會越來越不愛吃 ——
          很多人以為是「這牌子不好」，其實是放太久。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          大包每公斤比較便宜是真的，但便宜的前提是吃得完。
          這也是為什麼我們在推薦規格的時候，不會推超過 {FRESH_DAYS} 天的那一包，
          就算它每公斤最划算。
        </p>
      </div>

      <p style={S.lbl}>誠實的邊界</p>
      <ul style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li>熱量密度我們取 {KCAL_PER_KG.toLocaleString()} kcal/kg 當中間值。<b>包裝背面的餵食表比我們準</b>，因為那是照那一包的實際熱量算的。</li>
        <li>真正的依據是<b>體態</b>：從上面看得出腰身、摸得到肋骨但不明顯。照數字餵卻越來越胖，相信你的眼睛。</li>
        <li>減重不是少餵一點就好，先問獸醫。餓過頭會出別的問題。</li>
        <li>懷孕、哺乳、生病、手術後，都不適用這個算式。</li>
      </ul>

      <p style={S.lbl}>那要買哪一款</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把狗的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            我們會用剛剛同一個算式，告訴你哪個規格吃得完。
          </p>
        </div>
        <Link style={S.btn} href="/">去裁決器</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/dog-food/hidden-chicken" style={S.relLink}>寫著低敏，成分表裡有雞</Link>
        <Link href="/dog-food" style={S.relLink}>全部狗飼料</Link>
        <Link href="/how-we-choose" style={S.relLink}>我們怎麼挑</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          這一頁的算式跟商品頁上的「這包大約吃 N 天」是同一個函式，不會給你兩種答案。
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
