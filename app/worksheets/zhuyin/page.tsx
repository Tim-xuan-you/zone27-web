import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { G, R, S, T } from "@/components/styles";
import { GUESS_LEVELS } from "@/lib/worksheets/guess";
import { GUESS_SHEETS, guessSheetsOf } from "@/lib/worksheets/guess-sheets";
import { ASSETS, SHEET_IMG, guessLevelPdf, guessSheetImg } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, guessSeries, TIM } from "@/lib/worksheets/seo";

/**
 * 注音猜猜看：4 關的總覽。接「注音學習單下載」「注音練習單 pdf」「大班注音」這種不分關卡的搜尋。
 *
 * 2026-10-01 點子是 Tim 家的大班生出的：自己畫了一張題目考爸爸，上面寫注音，要猜是什麼東西。
 * 頁面上講這件事（家長最想知道「誰做的、為什麼做」），但不放孩子的字跡、名字（memory: zone27-kids-worksheets）。
 */

const PER = guessSheetsOf(1).length;
const TITLE = `注音學習單 PDF 免費下載：注音猜猜看 ${GUESS_LEVELS.length} 關（大班、小一）`;
const DESC = `看注音猜是什麼東西的注音學習單。大班到小一分 ${GUESS_LEVELS.length} 關、共 ${GUESS_SHEETS.length} 張 A4，每張 6 題，有圈圈看（看注音圈出對的圖）和寫寫看（看圖寫出注音）兩種，PDF 免費下載，附答案。每個詞的注音都對過教育部國語辭典。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/worksheets/zhuyin" },
  openGraph: { title: TITLE, description: DESC, type: "website", images: [{ url: ASSETS.zhuyinOg, width: 1200, height: 630, alt: "注音猜猜看：注音學習單" }] },
  twitter: { card: "summary_large_image", images: [ASSETS.zhuyinOg] },
};

const QA: [string, string][] = [
  ["這是什麼樣的注音學習單？", "一張 6 題，有兩種玩法。圈圈看：左邊是注音，右邊三張圖，圈出對的那一張。寫寫看：左邊是圖，自己在格子裡寫出注音。同一張的題目一樣，可以先圈、再寫。"],
  ["幾歲可以開始？", "認得注音符號就可以開始，大約大班（5 歲）。第 1、2 關給剛學注音的孩子；第 3、4 關有陷阱，三張圖裡有一張只差一個符號、或只差聲調，適合小一。"],
  ["注音會不會跟學校教的不一樣？", "每一個詞的注音都對過教育部《國語辭典簡編本》，輕聲的點寫在最上面、聲調寫在右邊，跟課本的排法一樣。辭典跟大人平常念的不一樣的詞先不收，像「骨頭」辭典寫 ㄍㄨˊ ˙ㄊㄡ，很多大人念 ㄍㄨˇ，放進來只會讓孩子跟學校教的打架。"],
  ["學習單是免費的嗎？可以印給全班嗎？", "免費，可以印給家裡的孩子，也可以印給班上的同學寫。每一張都有 PDF 可以下載。"],
  ["答案在哪裡？", "每一張右下角有 QR code，掃了就是答案。每一關也有一個答案的 PDF。"],
];

export default function Page() {
  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["注音學習單：注音猜猜看", "/worksheets/zhuyin"]]),
        guessSeries(),
        faq(QA),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm }}>
        <Link href="/worksheets" style={{ color: "var(--muted)" }}>學習單</Link>
      </nav>
      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        注音猜猜看<br />
        <span style={{ fontSize: "0.6em", color: "var(--muted)" }}>注音學習單・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        看注音，猜猜是什麼東西。會認注音的圈出對的圖，會寫注音的，換你寫出來。
      </p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 0` }}>
        這一款的點子，是我家大班生出的。有一天自己畫了一張題目考我：上面寫著注音，要我猜是什麼東西（答案是骨頭、貓咪、車子）。我照著做成 {GUESS_LEVELS.length} 關、每關 {PER} 張，一共 {GUESS_SHEETS.length} 張 A4。
      </p>
      <figure style={{ margin: `${G.lg}px 0 0`, maxWidth: 420 }}>
        {/* 首頁也有這張：孩子的手寫題目，不放名字、不放臉（2026-10-01 跟 Tim 講好的規則） */}
        <img
          src="/kids/first-puzzles.jpg"
          alt="大班生自己畫的兩道題目：右邊是注音題，上面寫注音、下面要寫出是什麼東西"
          width={1000}
          height={658}
          loading="lazy"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: R.sm, border: "1px solid var(--line)" }}
        />
        <figcaption style={{ fontSize: T.xs, color: "var(--faint)", marginTop: G.xs }}>我家大班生出的題目，右邊那一題就是注音猜猜看的起點</figcaption>
      </figure>

      <p style={S.lbl}>選關卡</p>
      <div style={{ display: "grid", gap: G.md }}>
        {GUESS_LEVELS.map((L) => {
          const first = guessSheetsOf(L.n)[0];
          return (
            <div key={L.n} style={row}>
              <Link href={`/worksheets/zhuyin/${L.n}`} style={thumb} aria-label={`第 ${L.n} 關`}>
                <img src={guessSheetImg(first.id, "circle")} alt={`注音猜猜看第 ${L.n} 關「${L.name}」：${L.grade}注音學習單`} width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/worksheets/zhuyin/${L.n}`} style={{ color: "inherit", textDecoration: "none" }}>
                  <span style={{ display: "block", fontSize: T.xs, fontWeight: 700, color: "var(--pop)", letterSpacing: ".1em" }}>{"★".repeat(L.stars)}</span>
                  <h2 style={{ margin: `${G.xs}px 0`, fontSize: T.xl, lineHeight: 1.4 }}>第 {L.n} 關：{L.name}</h2>
                </Link>
                <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
                  {L.grade}・{L.age}・{L.what}
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: `${G.xs}px ${G.lg}px`, marginTop: G.sm, fontSize: T.sm }}>
                  <Link href={`/worksheets/zhuyin/${L.n}`} style={go}>看這一關 →</Link>
                  <a href={guessLevelPdf(L.n, "circle")} download={`注音猜猜看_第${L.n}關_圈圈看_${PER}張.pdf`} style={dl}>圈圈看 PDF</a>
                  <a href={guessLevelPdf(L.n, "write")} download={`注音猜猜看_第${L.n}關_寫寫看_${PER}張.pdf`} style={dl}>寫寫看 PDF</a>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p style={S.lbl}>家長常問</p>
      <div style={S.box}>
        {QA.map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <h2 style={qh}>{q}</h2>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: G.xl, fontSize: T.md, lineHeight: 1.9 }}>
        想換個玩法？<Link href="/worksheets/acorn" style={{ color: "var(--accent)", fontWeight: 700 }}>試試迷宮學習單「撿松果回家」→</Link>
      </p>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>題目、圖都是我們自己做的，可以自由印給家裡的孩子、班上的同學寫。每一個詞的注音都用程式拿去跟教育部國語辭典對過一次。</p>
      </footer>
    </main>
  );
}

const row: React.CSSProperties = { ...S.box, display: "flex", gap: G.lg, alignItems: "center" };
const thumb: React.CSSProperties = { display: "block", width: 92, flex: "none", background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, overflow: "hidden" };
const go: React.CSSProperties = { color: "var(--accent)", fontWeight: 700 };
const dl: React.CSSProperties = { color: "var(--muted)", fontWeight: 600 };
const qh: React.CSSProperties = { margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 };
