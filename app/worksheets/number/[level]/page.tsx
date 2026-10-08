import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import NumberPicker from "@/components/worksheets/NumberPicker";
import { G, S, T } from "@/components/styles";
import { NUMBER_LEVELS, numberLevel } from "@/lib/worksheets/number";
import { numberSheetsOf } from "@/lib/worksheets/number-sheets";
import { numberAnswersPdf, numberLevelOg, numberLevelPdf, sheetPdf } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, numberLevelResource, TIM } from "@/lib/worksheets/seo";
import { OG_BASE } from "@/lib/og-base";

/**
 * 數字松果的某一關。家長搜「大班數學學習單」「10以內加法 學習單」「20以內進位加法」：年級＋範圍＋學習單／PDF。
 * 標題就照這樣寫，每一關一頁。
 */

export const dynamicParams = false;
export function generateStaticParams() {
  return NUMBER_LEVELS.map((L) => ({ level: String(L.n) }));
}

type P = { params: Promise<{ level: string }> };

/** 家長搜的叫法 */
const KEYWORD: Record<number, string> = { 1: "6 以內加法", 2: "10 以內加法", 3: "10 以內連加", 4: "20 以內進位加法" };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const n = Number((await params).level);
  const L = numberLevel(n);
  const count = numberSheetsOf(n).length;
  const title = `${L.grade}數學學習單 第 ${n} 關：${KEYWORD[n]}迷宮 PDF 免費下載｜數字松果`;
  const description = `數字松果第 ${n} 關「${L.name}」：${L.what}。${L.W}×${L.H} 的迷宮，撿到的松果加起來要剛好等於房子上的數字。${count} 張 A4、每張 2 題，PDF 免費下載，附答案和算式。每一題都只有一條路剛好湊得到。`;
  return {
    title,
    description,
    alternates: { canonical: `/worksheets/number/${n}` },
    openGraph: { ...OG_BASE, title, description, type: "website", images: [{ url: numberLevelOg(n), width: 1200, height: 630, alt: `數字松果第 ${n} 關，${L.grade}數學學習單` }] },
    twitter: { card: "summary_large_image", images: [numberLevelOg(n)] },
  };
}

export default async function Page({ params }: P) {
  const n = Number((await params).level);
  if (!NUMBER_LEVELS.some((L) => L.n === n)) notFound();
  const L = numberLevel(n);
  const sheets = numberSheetsOf(n);
  const prev = n > 1 ? numberLevel(n - 1) : null;
  const next = n < NUMBER_LEVELS.length ? numberLevel(n + 1) : null;

  const qa: [string, string][] = [
    [`第 ${n} 關適合幾歲？`, `大約 ${L.age}（${L.grade}）。看孩子算得順不順比看年紀準：兩題都很快算出來，就往下一關；加法還不熟，就退一關。`],
    ["每一顆松果都要撿嗎？", "不用，這是跟撿松果回家不一樣的地方：要自己挑，撿到的加起來剛好等於房子上的數字。走過松果的格子就算撿到，不要的松果要繞開。"],
    ["答案只有一個嗎？", "是。每一題都用程式把起點到房子的每一條路走過一遍、算出總和，剛好等於房子數字的只有一條。"],
    ["可以下載 PDF 嗎？", `可以。每一張都有自己的 PDF，也可以整關 ${sheets.length} 張一個 PDF 下載。手機下載後可以傳到 LINE，或拿去超商列印。`],
    ["孩子卡住怎麼辦？", "先算最近的那條路加起來是多少：比房子的數字大就要少撿，比較小就要多撿。還是不會，掃右下角的 QR code，先看要撿哪幾顆，路線讓孩子自己找。"],
  ];

  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["數學學習單：數字松果", "/worksheets/number"], [`第 ${n} 關`, `/worksheets/number/${n}`]]),
        numberLevelResource(n),
        faq(qa),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm, color: "var(--muted)" }}>
        <Link href="/worksheets" style={crumb}>學習單</Link> › <Link href="/worksheets/number" style={crumb}>數字松果</Link> › 第 {n} 關
      </nav>
      <h1 style={{ fontSize: "clamp(26px,5.5vw,38px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        數字松果<br />第 {n} 關：{L.name}<br />
        <span style={{ fontSize: "0.62em", color: "var(--muted)" }}>{L.grade}數學學習單・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        撿到的松果，數字加起來要剛好等於房子上的數字。第 {n} 關{L.what}，{L.W}×{L.H} 的格子。
        <span style={{ color: "var(--pop)", letterSpacing: ".1em" }}> {"★".repeat(L.stars)}</span>
      </p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 ${G.lg}px` }}>
        {sheets.length} 張 A4，每張 2 題，大約 {L.age}。不用每一顆都撿，要自己挑。
      </p>

      <NumberPicker level={n} />

      <p style={S.lbl}>這一關的檔案</p>
      <ul style={files}>
        {sheets.map((s) => (
          <li key={s.id}><a href={sheetPdf(s.id)} style={fileLink}>第 {n} 關第 {s.n} 張（PDF）</a></li>
        ))}
        <li><a href={numberLevelPdf(n)} style={fileLink}>第 {n} 關 {sheets.length} 張一起（PDF）</a></li>
        <li><a href={numberAnswersPdf(n)} style={fileLink}>第 {n} 關的答案和算式（PDF，給大人）</a></li>
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
        {prev ? <Link href={`/worksheets/number/${prev.n}`} style={step}>← 第 {prev.n} 關：{prev.name}</Link> : <Link href="/worksheets/acorn/1" style={step}>← 先玩沒有數字的：撿松果回家</Link>}
        {next ? <Link href={`/worksheets/number/${next.n}`} style={step}>第 {next.n} 關：{next.name} →</Link> : <Link href="/worksheets/make" style={step}>全部寫完了？換孩子出題 →</Link>}
      </nav>
    </main>
  );
}

const crumb: React.CSSProperties = { color: "var(--muted)" };
const files: React.CSSProperties = { margin: 0, padding: `0 0 0 ${G.lg}px`, fontSize: T.md, lineHeight: 2 };
const fileLink: React.CSSProperties = { color: "var(--accent)" };
const qh: React.CSSProperties = { margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 };
const step: React.CSSProperties = { color: "var(--accent)", fontWeight: 700, fontSize: T.md };
