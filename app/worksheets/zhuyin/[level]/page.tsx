import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import GuessPicker from "@/components/worksheets/GuessPicker";
import { G, S, T } from "@/components/styles";
import { GUESS_LEVELS, guessLevel } from "@/lib/worksheets/guess";
import { guessSheetsOf } from "@/lib/worksheets/guess-sheets";
import { guessAnswersPdf, guessLevelOg, guessLevelPdf, guessSheetPdf } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, guessLevelResource, TIM } from "@/lib/worksheets/seo";
import { OG_BASE } from "@/lib/og-base";

/**
 * 注音猜猜看的某一關。
 *
 * 家長搜的是「注音學習單下載」「大班注音學習單」「注音練習 pdf」：注音、年級、下載、PDF。
 * 跟撿松果回家一樣，每一關一頁，標題寫年級和 PDF，介紹照這一關的資料寫，每一頁都不一樣。
 */

export const dynamicParams = false;
export function generateStaticParams() {
  return GUESS_LEVELS.map((L) => ({ level: String(L.n) }));
}

type P = { params: Promise<{ level: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const n = Number((await params).level);
  const L = guessLevel(n);
  const count = guessSheetsOf(n).length;
  const title = `${L.grade}注音學習單 第 ${n} 關「${L.name}」PDF 免費下載（${L.age}）｜注音猜猜看`;
  const description = `注音猜猜看第 ${n} 關「${L.name}」，${L.what}。${count} 張 A4，每張 6 題，有圈圈看（看注音圈出對的圖）和寫寫看（看圖寫出注音）兩種，PDF 免費下載，附答案。每個詞的注音都對過教育部國語辭典。`;
  return {
    title,
    description,
    alternates: { canonical: `/worksheets/zhuyin/${n}` },
    openGraph: { ...OG_BASE, title, description, type: "website", images: [{ url: guessLevelOg(n), width: 1200, height: 630, alt: `注音猜猜看第 ${n} 關，${L.grade}注音學習單` }] },
    twitter: { card: "summary_large_image", images: [guessLevelOg(n)] },
  };
}

/** 這一關在練什麼、比上一關難在哪 */
const ABOUT: Record<number, string> = {
  1: "一個字的東西：貓、魚、船、鎖。三張圖的注音第一個符號都不一樣，先熟悉「唸注音、找東西」這個玩法。",
  2: "兩個字的東西：車子、蘋果、眼鏡。比第 1 關多看一個字，「車子」「杯子」的「子」是輕聲，點寫在最上面。",
  3: "三張圖裡，有一張的注音跟答案只差一個符號：星（ㄒㄧㄥ）和心（ㄒㄧㄣ）、書（ㄕㄨ）和豬（ㄓㄨ）、火（ㄏㄨㄛˇ）和鎖（ㄙㄨㄛˇ）。只看第一個符號會圈錯，要每一個都看。",
  4: "三張圖裡，有一張的注音跟答案一模一樣，只差聲調：魚（ㄩˊ）和雨（ㄩˇ）、書（ㄕㄨ）和樹（ㄕㄨˋ）、椰子和葉子。孩子在學校最常錯的就是二聲和三聲，這一關專門練這個。",
};

export default async function Page({ params }: P) {
  const n = Number((await params).level);
  if (!GUESS_LEVELS.some((L) => L.n === n)) notFound();
  const L = guessLevel(n);
  const sheets = guessSheetsOf(n);
  const prev = n > 1 ? guessLevel(n - 1) : null;
  const next = n < GUESS_LEVELS.length ? guessLevel(n + 1) : null;

  const qa: [string, string][] = [
    [`第 ${n} 關適合幾歲？`, `大約 ${L.age}（${L.grade}）。看孩子寫得順不順比看年紀準：一張 6 題幾乎都對，就往下一關；錯一半以上，就退一關，或先玩圈圈看。`],
    ["圈圈看和寫寫看有什麼不一樣？", "題目一樣。圈圈看是看注音、圈出對的圖，還不太會寫注音的先玩這個。寫寫看是看圖、自己寫出注音，聲調也要寫。可以今天圈，隔天再寫同一張。"],
    ["可以下載 PDF 嗎？", `可以。每一張的圈圈看、寫寫看都有自己的 PDF，也可以整關 ${sheets.length} 張一個 PDF 下載。手機下載後可以傳到 LINE，或拿去超商列印。`],
    ["有答案嗎？", "有。每一張右下角的 QR code 掃了就是答案，圈圈看圈第幾張、寫寫看的注音都在上面。整關的答案也有一個 PDF。"],
    ["孩子寫錯了怎麼辦？", "請孩子把那張圖的名字慢慢唸一次，再跟寫的注音一個一個對。聲調錯最常見：唸的時候手跟著聲音往上、往下比，比較容易聽出來。"],
  ];

  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["注音學習單：注音猜猜看", "/worksheets/zhuyin"], [`第 ${n} 關`, `/worksheets/zhuyin/${n}`]]),
        guessLevelResource(n),
        faq(qa),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm, color: "var(--muted)" }}>
        <Link href="/worksheets" style={crumb}>學習單</Link> › <Link href="/worksheets/zhuyin" style={crumb}>注音猜猜看</Link> › 第 {n} 關
      </nav>
      <h1 style={{ fontSize: "clamp(26px,5.5vw,38px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        注音猜猜看<br />第 {n} 關：{L.name}<br />
        <span style={{ fontSize: "0.62em", color: "var(--muted)" }}>{L.grade}注音學習單・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        {ABOUT[n]}
        <span style={{ color: "var(--pop)", letterSpacing: ".1em" }}> {"★".repeat(L.stars)}</span>
      </p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 ${G.lg}px` }}>
        {sheets.length} 張 A4，每張 6 題，大約 {L.age}。同一張有圈圈看、寫寫看兩種玩法，題目一樣。
      </p>

      <GuessPicker level={n} />

      <p style={S.lbl}>這一關的檔案</p>
      <ul style={files}>
        {sheets.map((s) => (
          <li key={s.id}>
            第 {n} 關第 {s.n} 張：<a href={guessSheetPdf(s.id, "circle")} style={fileLink}>圈圈看（PDF）</a>、<a href={guessSheetPdf(s.id, "write")} style={fileLink}>寫寫看（PDF）</a>
          </li>
        ))}
        <li><a href={guessLevelPdf(n, "circle")} style={fileLink}>第 {n} 關圈圈看 {sheets.length} 張一起（PDF）</a></li>
        <li><a href={guessLevelPdf(n, "write")} style={fileLink}>第 {n} 關寫寫看 {sheets.length} 張一起（PDF）</a></li>
        <li><a href={guessAnswersPdf(n)} style={fileLink}>第 {n} 關的答案（PDF，給大人）</a></li>
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
        {prev ? <Link href={`/worksheets/zhuyin/${prev.n}`} style={step}>← 第 {prev.n} 關：{prev.name}</Link> : <span />}
        {next ? <Link href={`/worksheets/zhuyin/${next.n}`} style={step}>第 {next.n} 關：{next.name} →</Link> : <Link href="/worksheets/acorn" style={step}>想換個玩法？試試迷宮學習單 →</Link>}
      </nav>
    </main>
  );
}

const crumb: React.CSSProperties = { color: "var(--muted)" };
const files: React.CSSProperties = { margin: 0, padding: `0 0 0 ${G.lg}px`, fontSize: T.md, lineHeight: 2 };
const fileLink: React.CSSProperties = { color: "var(--accent)" };
const qh: React.CSSProperties = { margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 };
const step: React.CSSProperties = { color: "var(--accent)", fontWeight: 700, fontSize: T.md };
