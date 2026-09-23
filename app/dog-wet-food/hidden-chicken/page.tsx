import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import data from "@/data/dog-wet-hidden-chicken.json";
import Checked from "@/components/Checked";
import { catalogOf, shopLink } from "@/lib/catalog";

/**
 * 狗罐頭版的「名字寫別的肉，成分表裡有雞」。
 *
 * 跟貓罐頭那一頁同一套紀律，但要講的事情不同。
 *
 * 貓罐頭的雞是躲在湯裡：雞湯是最便宜又最香的湯底，所以一罐寫鮭魚的，
 * 第一項是雞湯。那是成本問題。
 *
 * 狗罐頭這邊躲的是肉本身，而且躲在「稀有蛋白」的名字後面：
 * 鹿肉罐第二到五項是雞肉、雞心肝、雞軟骨、雞蛋黃；
 * 鱉肉鱉蛋罐第一項是雞肉；燉羊肉罐第一項是雞肉及雞肝。
 *
 * 這件事比貓那邊嚴重，因為買稀有蛋白的人動機不一樣 ——
 * 會去找鹿肉、鱉肉狗罐頭的，有一部分是獸醫叫他做排除飲食的。
 * 那種情況下換過去，兩個月的排查全部白做，而且會得到錯的結論
 * （「連鹿肉都會癢，所以不是食物過敏」）。
 *
 * 一樣的規矩：每一筆記下來源與查核日期（來源不放進畫面、不連出去），
 * 講清楚含雞不是缺點，而且要列出名字跟內容對得上的那一款。
 */

const CASES = data.cases;
const CLEAN = data.clean;
const PATH = "/dog-wet-food/hidden-chicken";
const READ = catalogOf("dog", "wet").length;

const TITLE = "名字寫鹿肉、鱉肉的狗罐頭，第一二項是雞";

export const metadata: Metadata = {
  title: TITLE,
  description:
    `${data._meta.tally}逐筆核對台灣通路的中文標示，附查核日期。`,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, type: "article" },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "狗罐頭寫鹿肉口味，就代表沒有雞肉嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `不代表。${data._meta.tally}商品名上的肉是口味標籤，不是成分清單。要確認只能翻到背面，看成分表的前五項。`,
        },
      },
      {
        "@type": "Question",
        name: "獸醫叫我做排除飲食，買鹿肉或鱉肉的狗主食罐可以嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "要先看成分表。我們讀到的鹿肉主食罐，第二到第五項是雞肉、雞心肝、雞軟骨、雞蛋黃；鱉肉鱉蛋主食罐的第一項是雞肉。排除飲食期間換到這種罐頭，等於沒換，而且會讓你得到錯的結論。實際要不要做排除飲食、做多久，跟你的獸醫確認。",
        },
      },
      {
        "@type": "Question",
        name: "雞肝、雞油、雞心算不算雞肉？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "雞肝和雞心算，那是雞的肉和內臟，蛋白質一樣。雞油是脂肪，蛋白質很少，一般對雞過敏的狗多半沒事，但非常敏感的還是避開。",
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

      <SiteHeader current="dog-wet-food" />

      <h1 style={{ fontSize: "clamp(27px,5.4vw,38px)", lineHeight: 1.42, margin: "0 0 18px" }}>
        名字寫鹿肉、鱉肉的狗罐頭，<br />第一二項是雞
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 10px", maxWidth: "42ch" }}>
        獸醫說換稀有蛋白試試看，於是你買了鹿肉罐。兩個月後狗還在抓，你以為不是食物的問題...先把罐頭翻到背面。
      </p>
      <p style={{ color: "var(--faint)", fontSize: 12.5, margin: "0 0 8px" }}>
        {CASES.length} 款逐筆核對 · 最後查核 {data._meta.checkedAt}
      </p>

      <p style={S.lbl}>我們讀到的</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.9, fontWeight: 700 }}>
          {data._meta.tally}
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          {data._meta.why}
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          得到的結論還會是錯的：
          <b style={{ color: "var(--ink)" }}>「連鹿肉都會癢，所以不是食物過敏」</b>
          ，然後就不查了。實際上從頭到尾牠吃的都是雞。
        </p>
      </div>

      <p style={S.lbl}>自己看的話，看三個地方</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 8 }}>
          <b>前五項。</b>狗罐頭的成分表比乾糧短，稀有蛋白如果是真的主角，會排在最前面而且後面不會跟著別種肉。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>內臟那幾項。</b>雞心肝、雞軟骨、雞蛋黃、雞油，這些都不會寫在正面。它們是雞。
        </li>
        <li>
          <b>「肉類及其副產品」這種字。</b>括號裡有寫哪幾種算好的，沒寫就等於不能排除，要查過敏原的話先避開。
        </li>
      </ol>

      <p style={S.lbl}>逐筆核對</p>
      {CASES.map((c) => (
        <article key={c.id} style={card}>
          <span style={S.brand}>{c.brand}</span>
          <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 20, lineHeight: 1.45, margin: "2px 0 12px" }}>
            {c.name}
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--muted)" }}>{c.impression}</p>

          <p style={found}>成分表寫的是</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 18, fontSize: 15.5, lineHeight: 1.9 }}>
            {c.found.map((f, i) => <li key={i}>{f}</li>)}
          </ul>

          <p style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, lineHeight: 1.75 }}>{c.verdict}</p>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>{c.why}</p>

          <Checked
            checkedAt={c.checkedAt} sources={c.sources}
            productId={(c as { productId?: string }).productId}
            path={PATH} item={`${c.id} ${c.brand} ${c.name}`}
          />
        </article>
      ))}

      <p style={S.lbl}>名字跟內容對得上的，長這樣</p>
      <div style={box}>
        <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.9 }}>
          我們讀的 {READ} 款裡，整張成分表真的找不到雞的只有這一款：
        </p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 15.5, lineHeight: 1.95 }}>
          {CLEAN.map((g) => {
            // 只連我們自己的購買連結；還沒有連結的就不放
            const buy = shopLink((g as { productId?: string }).productId);
            return (
              <li key={g.name}>
                <b>{g.brand} {g.name}</b>：{g.found}
                {buy && (
                  <a href={buy} rel="nofollow sponsored" style={{ color: "var(--accent)", fontSize: 12.5, marginLeft: 6 }}>
                    去賣場看成分表 →
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.9, color: "var(--muted)" }}>
          要做排除飲食的話，可選的範圍比你想的窄很多。
        </p>
      </div>

      <p style={S.lbl}>這不代表這幾款不好</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          含雞肉本身不是缺點，一隻不對雞過敏的狗吃了完全沒問題。
          <b>我們在講的是名字跟內容物對不上這件事</b>，只有在查過敏原的時候它才重要。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          發現寫錯或資料過期，直接跟我們說，我們會改並且標日期。配方會改版，以你手上那一罐的標示為準。
        </p>
      </div>

      <p style={S.lbl}>那要買什麼</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>點一下年紀和狀況，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15.5, color: "var(--muted)", lineHeight: 1.8 }}>
            像是點「成犬」再點「對雞過敏」，不用打字。
          </p>
        </div>
        <Link style={S.btn} href="/dog-wet-food">去狗主食罐</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/dog-wet-food" style={S.relLink}>我們讀過的狗主食罐</Link>
        <Link href="/dog-wet-food/how-much" style={S.relLink}>狗一天要吃幾罐</Link>
        <Link href="/dog-food/elimination-diet" style={S.relLink}>排除飲食怎麼做</Link>
        <Link href="/dog-food/hidden-chicken" style={S.relLink}>乾糧版：主打低敏，成分表裡還是有雞</Link>
        <Link href="/cat-wet-food/hidden-chicken" style={S.relLink}>貓罐頭版：寫著鮭魚、鴨肉的，很多是雞湯煮的</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          成分資料取自台灣通路的中文標示，每一筆都寫了查核日期。
          配方會改版，以你手上那一罐的標示為準。
        </p>
      </footer>
    </main>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};

const card: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "22px 22px 18px",
  marginBottom: 16,
};

const found: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 12.5, fontWeight: 600, letterSpacing: ".12em",
  textTransform: "uppercase", color: "var(--faint)", margin: "0 0 8px",
};
