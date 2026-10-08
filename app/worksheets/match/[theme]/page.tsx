import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import MatchPicker from "@/components/worksheets/MatchPicker";
import { G, S, T } from "@/components/styles";
import { MATCH_THEMES, matchTheme, type MatchPair, type MatchThemeId } from "@/lib/worksheets/match";
import { matchSheetsOf } from "@/lib/worksheets/match-sheets";
import { matchAnswersPdf, matchOg, matchThemePdf, sheetPdf } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, matchThemeResource, TIM } from "@/lib/worksheets/seo";
import { OG_BASE } from "@/lib/og-base";

/**
 * 連連看的一個主題（誰吃什麼、長大變成什麼）。
 *
 * 家長、老師搜的是「動物連連看」「連連看學習單」「幼兒連連看 pdf」，也有人直接問「兔子吃什麼」「孑孓長大變成什麼」。
 * 所以每一組答案都寫成一題問答放在頁面上（也進 FAQPage），AI 回答這些問題的時候拿得到一句查過的話。
 */

export const dynamicParams = false;
export function generateStaticParams() {
  return MATCH_THEMES.map((t) => ({ theme: t.id }));
}

type P = { params: Promise<{ theme: string }> };

const META: Record<MatchThemeId, { title: string; kicker: string; intro: string }> = {
  eat: {
    title: "動物連連看學習單：誰吃什麼 PDF 免費下載（大班、小一）",
    kicker: "動物連連看學習單",
    intro: "從黑點畫線，把動物和牠吃的東西連起來。每張圖下面都有名字和注音。有幾組跟大家以為的不一樣：兔子主要吃草，紅蘿蔔只能偶爾吃。",
  },
  grow: {
    title: "長大變成什麼？動物成長連連看學習單 PDF 免費下載（大班、小一）",
    kicker: "動物成長連連看學習單",
    intro: "從黑點畫線，把小時候和長大的樣子連起來。蝌蚪變青蛙大家都知道；孑孓變成蚊子、水蠆變成蜻蜓、雞母蟲變成獨角仙，很多大人也是第一次聽到。",
  },
};

const question = (themeId: MatchThemeId, p: MatchPair) => (themeId === "eat" ? `${p.left.name}吃什麼？` : `${p.left.name}長大會變成什麼？`);
const answer = (themeId: MatchThemeId, p: MatchPair) =>
  `${themeId === "eat" ? `吃${p.right.name}。` : `變成${p.right.name}。`}${p.fact}${p.source ? `（資料：${p.source}）` : ""}`;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const id = (await params).theme as MatchThemeId;
  if (!MATCH_THEMES.some((t) => t.id === id)) return {};
  const M = META[id];
  const count = matchSheetsOf(id).length;
  const description = `${M.intro}${count} 張 A4，每張 4～5 組，PDF 免費下載，附答案和每一組的小知識。`;
  return {
    title: M.title,
    description,
    alternates: { canonical: `/worksheets/match/${id}` },
    openGraph: { ...OG_BASE, title: M.title, description, type: "website", images: [{ url: matchOg(id), width: 1200, height: 630, alt: `連連看：${matchTheme(id).name}` }] },
    twitter: { card: "summary_large_image", images: [matchOg(id)] },
  };
}

export default async function Page({ params }: P) {
  const id = (await params).theme as MatchThemeId;
  if (!MATCH_THEMES.some((t) => t.id === id)) notFound();
  const Th = matchTheme(id);
  const M = META[id];
  const sheets = matchSheetsOf(id);
  const other = MATCH_THEMES.find((t) => t.id !== id)!;

  const qa: [string, string][] = [
    ["適合幾歲？", "前 3 張每張 4 組，大班（5 歲）就可以；後 2 張每張 5 組，多了比較少見的動物，適合小一。圖下面的名字都有注音，認得注音的孩子可以自己讀。"],
    ["可以下載 PDF 嗎？", `可以。每一張都有自己的 PDF，也可以 ${sheets.length} 張一個 PDF 下載。手機下載後可以傳到 LINE，或拿去超商列印。`],
    ["答案在哪裡？", "每一張右下角的 QR code 掃了就是答案。答案頁的線畫好了，下面還有每一組的小知識，可以邊對答案邊講給孩子聽。"],
  ];
  const pairQa: [string, string][] = Th.pairs.map((p) => [question(id, p), answer(id, p)]);

  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["連連看", "/worksheets/match"], [Th.name, `/worksheets/match/${id}`]]),
        matchThemeResource(id),
        faq([...pairQa, ...qa]),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm, color: "var(--muted)" }}>
        <Link href="/worksheets" style={crumb}>學習單</Link> › <Link href="/worksheets/match" style={crumb}>連連看</Link> › {Th.name}
      </nav>
      <h1 style={{ fontSize: "clamp(26px,5.5vw,38px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        連連看<br />{Th.ask}<br />
        <span style={{ fontSize: "0.62em", color: "var(--muted)" }}>{M.kicker}・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>{M.intro}</p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 ${G.lg}px` }}>
        {sheets.length} 張 A4。前 3 張每張 4 組（大班），後 2 張每張 5 組，多了比較少見的（小一）。
      </p>

      <MatchPicker theme={id} />

      <p style={S.lbl}>這個主題的檔案</p>
      <ul style={files}>
        {sheets.map((s) => (
          <li key={s.id}><a href={sheetPdf(s.id)} style={fileLink}>{Th.name}第 {s.n} 張（PDF，{s.left.length} 組）</a></li>
        ))}
        <li><a href={matchThemePdf(id)} style={fileLink}>{Th.name} {sheets.length} 張一起（PDF）</a></li>
        <li><a href={matchAnswersPdf(id)} style={fileLink}>{Th.name}的答案和小知識（PDF，給大人）</a></li>
      </ul>

      <p style={S.lbl}>每一組答案都查過</p>
      <div style={S.box}>
        {pairQa.map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <h2 style={qh}>{q}</h2>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>

      <p style={S.lbl}>家長看這裡</p>
      <div style={S.box}>
        {qa.map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <h2 style={qh}>{q}</h2>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>

      <nav aria-label="其他主題" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: G.md, marginTop: G.xl }}>
        <Link href={`/worksheets/match/${other.id}`} style={step}>另一個主題：{other.name} →</Link>
        <Link href="/worksheets/zhuyin" style={step}>注音猜猜看 →</Link>
      </nav>
    </main>
  );
}

const crumb: React.CSSProperties = { color: "var(--muted)" };
const files: React.CSSProperties = { margin: 0, padding: `0 0 0 ${G.lg}px`, fontSize: T.md, lineHeight: 2 };
const fileLink: React.CSSProperties = { color: "var(--accent)" };
const qh: React.CSSProperties = { margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 };
const step: React.CSSProperties = { color: "var(--accent)", fontWeight: 700, fontSize: T.md };
