import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import AcornPicker from "@/components/worksheets/AcornPicker";
import { G, S, T } from "@/components/styles";
import { ACORN_LEVELS, acornLevel } from "@/lib/worksheets/acorn";
import { acornSheetsOf } from "@/lib/worksheets/acorn-sheets";
import { levelAnswersPdf, levelOg, levelPdf, sheetPdf } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, levelResource, TIM } from "@/lib/worksheets/seo";

/**
 * 撿松果回家的某一關（2026-10-09：每一關自己一個網址）。
 *
 * 家長搜的是「大班迷宮學習單」「中班學習單下載」「幼兒迷宮 pdf」：
 * 年級、迷宮、下載、PDF。所以每一關一頁，標題直接寫適合哪個年級、可以下載 PDF，
 * 頁面上的介紹也照這一關的資料寫（格子多大、幾顆松果、比上一關難在哪），每一頁都不一樣。
 */

export const dynamicParams = false;
export function generateStaticParams() {
  return ACORN_LEVELS.map((L) => ({ level: String(L.n) }));
}

type P = { params: Promise<{ level: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const n = Number((await params).level);
  const L = acornLevel(n);
  const title = `${L.grade}迷宮學習單 第 ${n} 關 PDF 免費下載（${L.age}）｜撿松果回家`;
  const description = `幼兒迷宮學習單第 ${n} 關：${L.W}×${L.H} 的格子，每題 ${L.acMin}～${L.acMax} 顆松果。5 張 A4，可以一張一張下載 PDF，也可以整關一起下載，附提示和答案。說明都有注音，每一題都只有一個答案。`;
  return {
    title,
    description,
    alternates: { canonical: `/worksheets/acorn/${n}` },
    openGraph: { title, description, type: "website", images: [{ url: levelOg(n), width: 1200, height: 630, alt: `撿松果回家第 ${n} 關，${L.grade}迷宮學習單` }] },
    twitter: { card: "summary_large_image", images: [levelOg(n)] },
  };
}

/** 這一關比上一關難在哪：照資料講，不用形容詞 */
function harder(n: number): string {
  const L = acornLevel(n);
  if (n === 1) return `第一次寫的從這一關開始：${L.W}×${L.H} 的格子、每題 ${L.acMin}～${L.acMax} 顆松果，先熟悉「每一顆都要撿、每個格子只走一次」。`;
  const P = acornLevel(n - 1);
  const parts: string[] = [];
  if (L.W > P.W) parts.push(`格子從 ${P.W}×${P.H} 變成 ${L.W}×${L.H}`);
  if (L.acMax > P.acMax) parts.push(`松果多了，每題 ${L.acMin}～${L.acMax} 顆`);
  if (L.missMin > P.missMin) parts.push(`直接走最近的路，至少會漏掉 ${L.missMin} 顆`);
  if (L.minLen > P.minLen) parts.push(`答案至少要走 ${L.minLen} 格`);
  return `比第 ${n - 1} 關難的地方：${parts.join("，")}。`;
}

export default async function Page({ params }: P) {
  const n = Number((await params).level);
  if (!ACORN_LEVELS.some((L) => L.n === n)) notFound();
  const L = acornLevel(n);
  const sheets = acornSheetsOf(n);
  const prev = n > 1 ? acornLevel(n - 1) : null;
  const next = n < ACORN_LEVELS.length ? acornLevel(n + 1) : null;

  const qa: [string, string][] = [
    [`第 ${n} 關適合幾歲？`, `大約 ${L.age}（${L.grade}）。看孩子寫得順不順比看年紀準：一張兩題寫起來很輕鬆，就往下一關；卡住、想放棄，就退一關。`],
    ["可以下載 PDF 嗎？", `可以。每一張都有自己的 PDF，也可以整關 ${sheets.length} 張一個 PDF 下載。手機下載後可以傳到 LINE，或拿去超商列印。`],
    ["有答案嗎？", "有。每一張右下角的 QR code 掃了會看到提示，一次只開一段；最後一段是答案。整關的提示和答案也有一個 PDF。"],
    ["孩子卡住怎麼辦？", "先問：「哪一顆松果最難拿到？先想想怎麼走過去。」還是不會，再掃 QR code 看第一段提示，看完讓孩子接著自己畫。"],
  ];

  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["幼兒迷宮：撿松果回家", "/worksheets/acorn"], [`第 ${n} 關`, `/worksheets/acorn/${n}`]]),
        levelResource(n),
        faq(qa),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm, color: "var(--muted)" }}>
        <Link href="/worksheets" style={crumb}>學習單</Link> › <Link href="/worksheets/acorn" style={crumb}>撿松果回家</Link> › 第 {n} 關
      </nav>
      <h1 style={{ fontSize: "clamp(26px,5.5vw,38px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        撿松果回家 第 {n} 關<br />
        <span style={{ fontSize: "0.62em", color: "var(--muted)" }}>{L.grade}迷宮學習單・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        幫小松鼠撿完每一顆松果再回家，每個格子只能走一次。第 {n} 關是 {L.W}×{L.H} 的格子，每題 {L.acMin}～{L.acMax} 顆松果，大約 {L.age}。
        {"★".repeat(L.stars)}
      </p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 ${G.lg}px` }}>{harder(n)}</p>

      <AcornPicker level={n} />

      <p style={S.lbl}>這一關的檔案</p>
      <ul style={files}>
        {sheets.map((s) => (
          <li key={s.id}><a href={sheetPdf(s.id)} style={fileLink}>第 {n} 關第 {s.n} 張（PDF）</a></li>
        ))}
        <li><a href={levelPdf(n)} style={fileLink}>第 {n} 關 {sheets.length} 張一起（PDF）</a></li>
        <li><a href={levelAnswersPdf(n)} style={fileLink}>第 {n} 關的提示和答案（PDF，給大人）</a></li>
      </ul>

      <p style={S.lbl}>家長看這裡</p>
      <div style={S.box}>
        {qa.map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <h2 style={qh}>{q}</h2>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>

      <nav aria-label="其他關卡" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: G.md, marginTop: G.xl }}>
        {prev ? <Link href={`/worksheets/acorn/${prev.n}`} style={step}>← 第 {prev.n} 關（{prev.grade}）</Link> : <span />}
        {next ? <Link href={`/worksheets/acorn/${next.n}`} style={step}>第 {next.n} 關（{next.grade}）→</Link> : <Link href="/worksheets/make" style={step}>全部寫完了？換孩子出題 →</Link>}
      </nav>
    </main>
  );
}

const crumb: React.CSSProperties = { color: "var(--muted)" };
const files: React.CSSProperties = { margin: 0, padding: `0 0 0 ${G.lg}px`, fontSize: T.md, lineHeight: 2 };
const fileLink: React.CSSProperties = { color: "var(--accent)" };
const qh: React.CSSProperties = { margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 };
const step: React.CSSProperties = { color: "var(--accent)", fontWeight: 700, fontSize: T.md };
