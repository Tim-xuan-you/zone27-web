import Link from "next/link";
import CategoryCards from "@/components/CategoryCards";
import Decider from "@/components/Decider";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { ANIMALS, categoriesOf } from "@/lib/categories";

const ENTITY = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://zone27.com.tw/#org",
      name: "ZONE 27",
      url: "https://zone27.com.tw",
      description: "台灣的狗飼料、貓飼料、貓主食罐決策工具。先刪掉不適合的，並寫清楚每一款什麼時候不要買。",
      logo: "https://zone27.com.tw/opengraph-image",
    },
    {
      "@type": "WebSite",
      "@id": "https://zone27.com.tw/#site",
      name: "ZONE 27",
      url: "https://zone27.com.tw",
      inLanguage: "zh-TW",
      publisher: { "@id": "https://zone27.com.tw/#org" },
    },
  ],
};

/**
 * 首頁。
 *
 * 版面的順序照一個人進來時腦子裡的順序排：
 *   1. 我家的狗／貓怎麼了 → 輸入框就在第一屏，不用先選類目
 *   2. 還沒想好要問什麼 → 往下看有哪些類目、每個類目現在的狀態
 *   3. 想先確認這個站可不可信 → 我們自己讀成分表的那幾篇
 *
 * 類目照動物分兩排：狗一排、貓一排。類目變多的時候，
 * 讀者先找自己養的那一種，不用在六張卡片裡找。
 */
export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ENTITY) }}
      />
      <SiteHeader />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        你家的毛孩怎麼了？<br />用講的就好
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "40ch" }}>
        光是低敏飼料，市面上就上百款。你把狀況講完，我們先幫你
        <span style={{ color: "var(--cut)", fontWeight: 700 }}>刪掉</span>
        不適合的，剩下的才給你看。
      </p>

      <Decider />

      <p style={{ ...S.lbl, marginTop: 56 }}>或是從類目進去</p>
      {ANIMALS.map((a) => (
        <section key={a.species} style={{ marginBottom: 18 }}>
          <h2 style={animalHead}>{a.zh}</h2>
          <CategoryCards cats={categoriesOf(a.species)} />
        </section>
      ))}

      <p style={S.lbl}>我們自己讀成分表</p>
      <div style={grid}>
        <Link href="/dog-food/hidden-chicken" style={feature}>
          <span style={kicker}>狗飼料</span>
          <h2 style={featureTitle}>寫著低敏，成分表裡有雞</h2>
          <p style={featureBody}>
            換了三種「低敏」飼料狗還是抓，很多時候是那三包裡面都有雞。
            逐筆核對，附查核日期，也包含我們自己在推的那一款。
          </p>
        </Link>
        <Link href="/cat-food/hidden-chicken" style={feature}>
          <span style={kicker}>貓飼料</span>
          <h2 style={featureTitle}>寫著鮭魚、鴨肉、火雞，成分表裡有雞</h2>
          <p style={featureBody}>
            貓飼料的名字幾乎都是口味。我們讀了台灣代理商的中文標示，
            有一款叫鴨肉的，雞加起來比鴨還多。
          </p>
        </Link>
        <Link href="/cat-wet-food/hidden-chicken" style={feature}>
          <span style={kicker}>貓主食罐</span>
          <h2 style={featureTitle}>寫著鮭魚、鴨肉的罐頭，很多是雞湯煮的</h2>
          <p style={featureBody}>
            名字沒寫雞的 8 款罐頭，5 款成分表前三項就有雞，4 款第一項就是雞湯。
          </p>
        </Link>
        <Link href="/cat-wet-food/complementary" style={feature}>
          <span style={kicker}>貓主食罐</span>
          <h2 style={featureTitle}>副食罐可以當主食嗎</h2>
          <p style={featureBody}>
            湯很多、看得到整塊肉的那種，有不少是副食罐。我們讀的兩款副食罐，鈣是 0.002% 和 0.004%，主食罐是 0.18% 到 0.29%。
          </p>
        </Link>
      </div>

      <p style={S.lbl}>先算一下</p>
      <div style={S.relRow}>
        <Link href="/dog-food/how-much" style={S.relLink}>狗一天吃多少</Link>
        <Link href="/cat-food/how-much" style={S.relLink}>貓一天吃多少</Link>
        <Link href="/cat-wet-food/how-much" style={S.relLink}>貓一天吃幾罐</Link>
        <Link href="/dog-food/grain-free" style={S.relLink}>無穀好不好</Link>
        <Link href="/dog-food/elimination-diet" style={S.relLink}>排除飲食法</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          價格為人工複查，每張卡片都標了查價日期。點進賣場請以當下標價為準。
        </p>
        <p style={{ margin: "8px 0 0" }}>
          本站透過購買連結取得分潤，這不影響推薦排序，<Link href="/how-we-choose" style={{ color: "var(--muted)" }}>規則寫在這裡</Link>。
        </p>
      </footer>
    </main>
  );
}

const grid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14,
};
const animalHead: React.CSSProperties = {
  margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "var(--muted)",
};
const feature: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
  textDecoration: "none", color: "inherit",
};
const kicker: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 600,
  letterSpacing: ".14em", color: "var(--faint)",
};
const featureTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif), serif", fontSize: 19, margin: "6px 0 8px", lineHeight: 1.5,
};
const featureBody: React.CSSProperties = {
  margin: 0, fontSize: 14.5, color: "var(--muted)", lineHeight: 1.85,
};
