import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { byId } from "@/lib/catalog";
import { mer } from "@/lib/engine";

/**
 * 副食罐可以當主食嗎。
 *
 * 這是台灣貓奴最常搜的罐頭問題之一，也是罐頭類目最大的坑：
 * 湯很多、看得到整塊肉的罐頭看起來比肉泥罐「天然」，很多人拿來當正餐。
 *
 * 表格裡的數字全部是我們讀過、有來源的那幾款，不引用「一般來說」。
 * 點心的熱量從資料算，改了資料這一頁跟著變。
 */

const TITLE = "副食罐可以當主食嗎";
const PATH = "/cat-wet-food/complementary";

/** 表格：鈣跟牛磺酸。副食兩款、主食三款，全部是 cat-wet-food.csv 裡有來源的 */
const ROWS: { id: string; label: string; side: boolean; ca: string; taurine: string }[] = [
  { id: "cw-11", label: "貪貪 功夫湯罐 南瓜燉鴨湯", side: true, ca: "0.002%", taurine: "沒添加" },
  { id: "cw-12", label: "貪貪 功夫湯罐 蛤蜊鮮魚湯", side: true, ca: "0.004%", taurine: "沒添加" },
  { id: "cw-02", label: "汪喵星球 低敏鴨肉", side: false, ca: "0.29%", taurine: "0.17%" },
  { id: "cw-10", label: "Weruva 唯美味 夏威夷盛宴", side: false, ca: "0.25%", taurine: "0.05%" },
  { id: "cw-03", label: "厚肉肉 營養主食橘罐", side: false, ca: "0.18%", taurine: "0.1%" },
];

// 點心額度：4 公斤結紮成貓一天熱量的一成，跟一罐副食罐比
const DAY = Math.round(mer(4, "adultFixed", "cat"));
const TREAT = Math.round(DAY / 10);
const SIDE = byId("cw-11");
const SIDE_KCAL = SIDE?.spec.kcal ? Math.round((80 / 1000) * SIDE.spec.kcal) : null;

export const metadata: Metadata = {
  title: TITLE,
  description:
    "偶爾一餐沒關係，天天當正餐不行。我們讀的兩款副食罐，鈣是 0.002% 和 0.004%，主食罐是 0.18% 到 0.29%。怎麼分辨主食罐和副食罐、副食罐一天可以給多少，都寫在這裡。",
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
        name: "副食罐可以當主食嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "偶爾一餐沒關係，天天當正餐不行。副食罐沒有把鈣、牛磺酸、維生素補到一隻貓一天需要的量。我們讀的兩款副食罐，鈣是 0.002% 和 0.004%，主食罐是 0.18% 到 0.29%，差了幾十倍。",
        },
      },
      {
        "@type": "Question",
        name: "怎麼分辨主食罐跟副食罐？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "看包裝或賣場標題：寫「主食罐」「完整營養」「complete and balanced」，日本進口的寫「総合栄養食」，就是主食。寫「副食」「點心」「一般食」「complementary」的是副食。都沒寫的，看成分表後段有沒有一長串維生素、礦物質和牛磺酸。",
        },
      },
      {
        "@type": "Question",
        name: "副食罐一天可以給多少？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `點心加起來不要超過一天熱量的一成。一隻 4 公斤、已結紮的成貓一天大約 ${DAY} 大卡，點心額度大約 ${TREAT} 大卡。${SIDE_KCAL ? `一罐 80 克的湯罐大約 ${SIDE_KCAL} 大卡，分兩天給剛好。` : ""}`,
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

      <SiteHeader current="cat-wet-food" />

      <h1 style={{ fontSize: "clamp(27px,5.4vw,38px)", lineHeight: 1.42, margin: "0 0 18px" }}>
        {TITLE}
      </h1>
      <p style={{ fontSize: 19, lineHeight: 1.8, margin: "0 0 10px", fontWeight: 700 }}>
        偶爾一餐沒關係。天天當正餐，不行。
      </p>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 8px", maxWidth: "42ch" }}>
        湯很多、看得到整塊肉的罐頭，看起來比肉泥罐天然，有不少人拿來當正餐。先翻到背面確認是主食還是副食。
      </p>

      <p style={S.lbl}>差在哪</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          <b>主食罐的營養是補齊的</b>，一隻貓只吃它也夠。
          <b>副食罐是點心</b>，好吃、水分多，但鈣、牛磺酸、維生素沒有補到一隻貓一天要的量。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.95, color: "var(--muted)" }}>
          貓自己合成的牛磺酸不夠，一定要從食物補，長期缺會傷心臟和視力。
          鈣也一樣，只吃肉跟湯的話鈣會嚴重不足，幼貓正在長骨頭的時候最明顯。
        </p>
      </div>

      <p style={S.lbl}>我們讀到的數字</p>
      {/* 手機上四欄會擠出畫面：主食副食收進名字那一格，右邊只放兩個數字 */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
        <thead>
          <tr style={{ color: "var(--faint)", fontSize: 12.5, textAlign: "left" }}>
            <th style={th}>罐頭</th>
            <th style={{ ...th, textAlign: "right" }}>鈣</th>
            <th style={{ ...th, textAlign: "right", paddingRight: 0 }}>牛磺酸</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
            const p = byId(r.id);
            return (
              <tr key={r.id} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={td}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: r.side ? "var(--cut)" : "var(--keep)" }}>
                    {r.side ? "副食罐" : "主食罐"}
                  </span>
                  {p?.twSource
                    ? <a href={p.twSource} target="_blank" rel="noopener nofollow" style={{ color: "inherit" }}>{r.label} ↗</a>
                    : r.label}
                </td>
                <td style={{ ...td, textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }} className="mono">{r.ca}</td>
                <td style={{ ...td, textAlign: "right", paddingRight: 0, whiteSpace: "nowrap" }} className="mono">{r.taurine}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ margin: "12px 0 0", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.9 }}>
        數字照包裝標示，點名字可以看我們查的那一頁。「沒添加」是指成分表裡沒有牛磺酸這一項，
        魚跟肉本身還是有一點，只是沒有特別補。
      </p>

      <p style={S.lbl}>怎麼分辨</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 8 }}>
          <b>寫「主食罐」「完整營養」「complete and balanced」的，是主食。</b>
          日本進口的看「総合栄養食」這幾個字。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>寫「副食」「點心」「一般食」「complementary」的，是副食。</b>
          台灣賣場的標題常常直接寫（貓主食罐）（貓副食罐），也可以看那個。
        </li>
        <li>
          <b>都沒寫的，看成分表後段。</b>主食罐通常有一長串維生素、礦物質、牛磺酸；
          副食罐常常只有肉、湯、一兩樣蔬菜就結束了。
        </li>
      </ol>

      <p style={S.lbl}>副食罐怎麼用才對</p>
      <div style={box}>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15.5, lineHeight: 1.95 }}>
          <li>當點心、當獎勵。</li>
          <li>拌一點在乾糧或主食罐上，挑嘴的貓比較願意吃。</li>
          <li>不愛喝水的貓，湯罐是補水的好幫手。</li>
        </ul>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.95 }}>
          份量抓<b>一天熱量的一成</b>。一隻 4 公斤、已結紮的成貓一天大約 {DAY} 大卡，點心額度大約 {TREAT} 大卡。
          {SIDE_KCAL && <>一罐 80 克的湯罐大約 {SIDE_KCAL} 大卡，<b>分兩天給剛好</b>。</>}
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.9, color: "var(--muted)" }}>
          給了副食罐，正餐就要跟著少一點。很多貓變胖是這樣來的：正餐照舊，點心另外加。
        </p>
      </div>

      <p style={S.lbl}>那主食罐要買哪一款</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把貓的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            裁決器第一刀就是把副食罐刪掉，剩下的才照你家貓的狀況挑。
          </p>
        </div>
        <Link style={S.btn} href="/cat-wet-food">去貓主食罐</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/cat-wet-food" style={S.relLink}>我們讀過的貓主食罐</Link>
        <Link href="/cat-wet-food/hidden-chicken" style={S.relLink}>寫著鮭魚、鴨肉的罐頭，很多是雞湯煮的</Link>
        <Link href="/cat-wet-food/how-much" style={S.relLink}>貓一天吃幾罐</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          我們不是獸醫。上面講的是一般的餵食原則，不是診斷。
          懷孕、哺乳、生病中的貓，吃什麼先問你的獸醫。
        </p>
      </footer>
    </main>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};
const th: React.CSSProperties = { padding: "0 10px 8px 0", fontWeight: 600 };
const td: React.CSSProperties = { padding: "11px 10px 11px 0", lineHeight: 1.6 };
