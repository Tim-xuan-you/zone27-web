import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { G, S, T } from "@/components/styles";
import { CONTACT } from "@/lib/contact";
import { breadcrumb, graph, ORG_ID, TIM } from "@/lib/worksheets/seo";

/**
 * 關於我們（2026-10-01）。
 *
 * Tim 同意用「爸爸」的身分出現：署名只用 Tim，不放全名；孩子不放名字、臉、學校，一律「我家大班生」，
 * 升上小一就改「我家小一生」。語氣像在班級群組跟其他家長聊天，不像公司介紹。
 *
 * /about 以前是舊體育站的網址，middleware 回 410。2026-10-01 從那份清單拿掉，重新用。
 */

export const metadata: Metadata = {
  title: "關於我們：一個大班生的爸爸做的學習單",
  description: "ZONE 27 的學習單是一個大班生的爸爸做的。題目全部自己出，每一題都確認只有一個答案，說明都有注音，每一張都先給自己的孩子寫過。",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["關於我們", "/about"]]),
        { "@type": "AboutPage", url: "https://zone27.com.tw/about", name: "關於我們", about: { "@id": ORG_ID }, mainEntity: TIM },
      ) }} />
      <SiteHeader current="about" />
      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.xl}px` }}>關於我們</h1>

      <div style={body}>
        <p>
          我是 Tim，家裡有一個大班生。他很愛益智題，可是三個月前寫一本益智書，很多題不會，卡住就整題放棄。這幾天再寫，九成都會了，剩下那一成還是會放棄。
        </p>
        <p>
          我想做的，是讓孩子卡住的時候有台階可以下：先給一點提示，他自己接著畫；太難就退一關，寫順了再往上。所以這裡的學習單都分關卡，提示一次只給一段。
        </p>
      </div>

      <p style={S.lbl}>這些學習單怎麼做的</p>
      <div style={S.box}>
        {[
          ["題目全部自己出", "不拿評量卷、益智書來改。玩法是大家都能用的規則，題目、圖都是我們自己做的。"],
          ["每一題只有一個答案", "題目出完，用程式把所有走法都算過一遍，有兩種走法就重出。"],
          ["字跟課本一樣", "用芫荽字型，照教育部標準字形調整過，說明的每一個字都加注音。"],
          ["孩子先寫過", "每一款玩法上線前，都先給我家孩子寫過。他問「每一格是什麼？」，格子就改畫成一塊一塊的地磚；他說太簡單，那種順著邊走就撿完的題目就全部換掉。"],
        ].map(([t, d], i) => (
          <div key={t} style={{ marginTop: i ? G.lg : 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: T.md }}>{t}</p>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{d}</p>
          </div>
        ))}
      </div>

      <p style={S.lbl}>發現錯的地方</p>
      <div style={body}>
        <p>
          注音標錯、題目有兩個答案、哪一關太難，都寫信跟我說：<a href={`mailto:${CONTACT.email}`} style={{ color: "var(--accent)", fontWeight: 700 }}>{CONTACT.email}</a>。收到會改。
        </p>
        <p style={{ color: "var(--muted)" }}>
          這個網站以前在比較狗貓飼料、充電器，那些頁面還在，頁尾找得到。之後的時間會花在學習單上。
        </p>
      </div>

      <p style={{ marginTop: G.xxl }}>
        <Link href="/worksheets" style={{ color: "var(--accent)", fontWeight: 700, fontSize: T.lg }}>去看學習單 →</Link>
      </p>
    </main>
  );
}

const body: React.CSSProperties = { fontSize: T.lg, lineHeight: 2 };
