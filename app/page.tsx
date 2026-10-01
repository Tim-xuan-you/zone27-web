import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Promises from "@/components/worksheets/Promises";
import { G, R, S, T } from "@/components/styles";
import { acornSheetPages } from "@/lib/worksheets/acorn-sheet";
import { ACORN_SHEETS } from "@/lib/worksheets/acorn-sheets";

const ENTITY = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://zone27.com.tw/#org",
      name: "ZONE 27",
      url: "https://zone27.com.tw",
      description: "免費的益智學習單：A4 印了就能寫，說明都有注音，答案用畫的，卡住了有一段一段的提示。一個大班生的爸爸做的。",
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
 * 首頁（2026-10-01 改版：網站主軸改成孩子的學習單）。
 *
 * 來的人多半是從班級 LINE 群組、Threads 點進來的爸媽、老師，手上拿著手機。
 * 第一屏只要讓他知道三件事：這是什麼（免費、印了就能寫的學習單）、誰做的（一個爸爸，不是公司）、
 * 下一步按哪裡（從第 1 關開始）。
 *
 * 往下是四件我們一定做到的事，再往下是我家大班生出的題目。
 * 那張手寫的題目比任何專業名詞都讓家長相信：這個網站是真的有人陪著孩子在做的。
 *
 * 以前的狗貓飼料、充電器沒有放在這裡，收在頁尾一行（PageReport）。
 */
const FIRST = ACORN_SHEETS[0];
const PREVIEW = acornSheetPages(FIRST).page1;

export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 120px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ENTITY) }} />
      <SiteHeader />

      <section style={hero}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <p style={kicker}>免費・A4・印了就能寫</p>
          <h1 style={{ fontSize: "clamp(32px,7vw,46px)", lineHeight: 1.35, margin: `${G.sm}px 0 ${G.lg}px` }}>
            陪孩子動腦的<br />益智學習單
          </h1>
          <p style={{ color: "var(--muted)", fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
            我是 Tim，家裡有一個大班生。他卡住的地方，我做成一關一關的學習單。說明都有注音，孩子自己讀得懂；答案用畫的，不用寫字。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: G.md, marginTop: G.xl }}>
            <Link href={`/worksheets/acorn?id=${FIRST.id}`} style={cta}>從第 1 關開始</Link>
            <Link href="/worksheets" style={ghost}>看全部學習單</Link>
          </div>
        </div>
        <Link href={`/worksheets/acorn?id=${FIRST.id}`} style={sheet} aria-label="撿松果回家第 1 關第 1 張">
          <span className="ws-svg" style={{ display: "block" }} dangerouslySetInnerHTML={{ __html: PREVIEW }} />
        </Link>
      </section>

      <p style={S.lbl}>每一張都做到的四件事</p>
      <Promises />

      <p style={S.lbl}>他寫完說太簡單，自己出題考我</p>
      <section style={{ ...S.box, display: "flex", flexWrap: "wrap", gap: G.xl, alignItems: "center" }}>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: T.md, lineHeight: 2 }}>
            第一張「撿松果回家」，他先問我：「每一格是什麼？」所以現在的格子，都畫成一塊一塊的地磚。
          </p>
          <p style={{ margin: `${G.md}px 0 0`, fontSize: T.md, lineHeight: 2 }}>
            解完他說太簡單，自己畫了兩題考我：左邊是中班的迷宮，右邊是大班的「看注音猜東西」。下一款學習單「注音猜猜看」，就是照他出的題做的。
          </p>
        </div>
        <figure style={{ margin: 0, flex: "1 1 260px", minWidth: 0 }}>
          {/* 孩子的手寫題目：不放名字、不放臉（2026-10-01 跟 Tim 講好的規則） */}
          <img
            src="/kids/first-puzzles.jpg"
            alt="大班生自己畫的兩道題目：左邊是有三顆松果的迷宮，標中班；右邊是注音題，標大班"
            width={1000}
            height={658}
            loading="lazy"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: R.sm, border: "1px solid var(--line)" }}
          />
          <figcaption style={{ fontSize: T.xs, color: "var(--faint)", marginTop: G.xs }}>我家大班生出的題目</figcaption>
        </figure>
      </section>

      <style>{`.ws-svg svg { width: 100%; height: auto; display: block; }`}</style>
    </main>
  );
}

const hero: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: G.xl };
const kicker: React.CSSProperties = {
  display: "inline-block", margin: 0, fontSize: T.sm, fontWeight: 700, color: "var(--accent)",
  background: "var(--accent-soft)", borderRadius: R.pill, padding: "4px 14px",
};
const cta: React.CSSProperties = { ...S.buy, background: "var(--pop)", color: "var(--pop-ink)" };
const ghost: React.CSSProperties = {
  display: "inline-block", padding: "12px 24px", borderRadius: R.pill, border: "1px solid var(--line)",
  background: "var(--surface)", color: "var(--ink)", fontWeight: 700, fontSize: T.md + 0.5, textDecoration: "none",
};
const sheet: React.CSSProperties = {
  flex: "0 0 auto", width: "min(230px, 46vw)", background: "#fff", borderRadius: R.sm, border: "1px solid var(--line)",
  boxShadow: "var(--sh-lift)", transform: "rotate(2deg)", overflow: "hidden", margin: "0 auto",
};
