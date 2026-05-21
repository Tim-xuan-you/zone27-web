import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";

export const metadata: Metadata = {
  title: "鐵律 · Operating Discipline · Buffett · Musk · Costco",
  description:
    "ZONE 27 從 Buffett 的長期主義 + Musk 的第一原理 + Costco 的會員制與品牌完整性,提煉的 5 個我們不能違反的操作鐵律。三位都不靠秘密賺錢 · 都靠紀律。這頁是我們的 owner's manual。",
};

// ── ZONE 27 · /discipline — Operating Iron Rules ────────
// Inspired by Berkshire Hathaway's "Owner's Manual" (Buffett 1996),
// Costco's published Code of Ethics priority order, and the
// Musk methodology (already canonical in MEMORY).
//
// This page is the operating constitution — not aspirational
// (we don't claim to be Buffett/Musk/Costco), but the 5 rules
// we cannot violate without becoming a different brand.
//
// Voice contract:
//   - Match /audit Section 08 + /manifesto Section V tone
//   - Original quotes from primary sources cited with names
//   - Industry pattern vs ZONE 27 inverse (when applicable)
//   - Closing "WHAT THIS PAGE IS NOT" prevents misreading as
//     aspiration / fanboy / corporate worship
// ─────────────────────────────────────────────────────

const PAGE_VERSION = "v0.28";
const PAGE_DATE = "2026-05-21";

export default function DisciplinePage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          {/* ── PRINT ATTRIBUTION ──────────────────── */}
          <div
            lang="en"
            className="print-only mb-6 pb-3 border-b border-line/60 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            <div className="flex justify-between gap-4">
              <span>ZONE 27 — DISCIPLINE {PAGE_VERSION}</span>
              <span>PRINTED · zone27-web.vercel.app/discipline</span>
            </div>
          </div>

          {/* ── HEADER ─────────────────────────────── */}
          <header className="pb-10 border-b border-line/60">
            <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.45em]"
              >
                OPERATING DISCIPLINE
              </p>
              <p
                lang="en"
                className="font-mono text-mute text-[10px] tracking-[0.35em] tabular"
              >
                {PAGE_VERSION} · {PAGE_DATE}
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-6">
              鐵律
              <span className="block mt-3 font-mono text-gold text-lg sm:text-xl tracking-[0.25em]">
                BUFFETT · MUSK · COSTCO
              </span>
            </h1>
            <p className="text-mute text-base leading-relaxed mb-8 max-w-2xl">
              ZONE 27 不靠秘密賺錢 · 靠紀律。
              這頁是我們的 owner&apos;s manual — 5 個提煉自 Buffett 長期主義 +
              Musk 第一原理 + Costco 會員制的操作鐵律,
              <strong className="text-bone">違反任何一條 · ZONE 27 就不再是 ZONE 27</strong>。
            </p>

            <p
              lang="en"
              className="font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed"
            >
              NOT ASPIRATIONAL · NOT FANBOY · NOT CORPORATE WORSHIP ·
              JUST 5 RULES WE WILL NOT VIOLATE
            </p>
          </header>

          {/* ── 01 BUFFETT ─────────────────────────── */}
          <RuleSection
            no="01"
            label="BUFFETT"
            zh="信譽優於短期"
            quote="It takes 20 years to build a reputation and 5 minutes to ruin it. If you think about that, you&apos;ll do things differently."
            source="— Warren Buffett · Berkshire Hathaway"
          >
            <P>
              Buffett 1983 寫下{" "}
              <ExtLink href="https://www.berkshirehathaway.com/owners.html">
                13 條 Owner-Related Business Principles
              </ExtLink>
              。核心是 4 個字:**長期主義**。
            </P>
            <P>
              「公司是公司,但我們的態度是 partnership」— 他把股東當合夥人,
              不會用會計花招把壞消息粉飾。Berkshire 投資 Coca-Cola 持有
              26 年 · 投資 American Express 持有 30 年。「Our favorite
              holding period is forever」是他最廣為人知的引言。
            </P>

            <Subhead>ZONE 27 應用</Subhead>
            <List>
              <Item label="270 終身席位">
                Founders 27 不是「early bird 折扣」,
                是<strong className="text-bone">一輩子</strong>關係。
                Buffett 的 forever holding 哲學寫進限量結構。
              </Item>
              <Item label="壞消息誠實揭露">
                <Link href="/audit" className="text-gold hover:underline">
                  /audit
                </Link>{" "}
                Section 03 ENGINE SCOPE 列出引擎範圍外的主要事項 · 不藏 ·
                因為「壞消息粉飾 = 信譽歸零」是 Buffett 第一守則。
              </Item>
              <Item label="拒絕短期 KPI">
                沒裝 Google Analytics(per{" "}
                <Link href="/privacy" className="text-gold hover:underline">
                  /privacy
                </Link>
                )· 沒有「上週訪客 +20%」這種誘惑 · 不會為了 quarterly chart 犧牲長期信譽。
              </Item>
              <Item label="拒絕廣告營收">
                AdMob / 寄生博彩平台 = 可以馬上賺錢 · 但<strong className="text-bone">傷信譽</strong>。
                永久封殺(per{" "}
                <Link href="/about" className="text-gold hover:underline">
                  /about
                </Link>{" "}
                Chapter 04)。
              </Item>
            </List>
          </RuleSection>

          {/* ── 02 MUSK ────────────────────────────── */}
          <RuleSection
            no="02"
            label="MUSK"
            zh="第一原理 + 5 步演算法"
            quote="I think it&apos;s important to reason from first principles rather than by analogy."
            source="— Elon Musk · SpaceX · Tesla"
          >
            <P>
              Musk 把製造業濃縮成 5 步驟,每一步順序不能換:
            </P>

            <ol className="space-y-2.5 list-none pl-0">
              <AlgoStep n="1" label="質疑每個需求">
                所有需求都是錯的 · 不論來源多權威 ·
                先假設它沒必要、再證明它必要
              </AlgoStep>
              <AlgoStep n="2" label="刪除可刪的零件 / 流程">
                如果加回 10% · 代表您沒刪夠
              </AlgoStep>
              <AlgoStep n="3" label="簡化">
                只在 1 + 2 之後做 · 不然就是「美化錯的東西」
              </AlgoStep>
              <AlgoStep n="4" label="加速循環時間">
                只在 1 + 2 + 3 之後做
              </AlgoStep>
              <AlgoStep n="5" label="自動化">
                <strong className="text-bone">最後一步</strong>。
                太早自動化 = 自動化錯的東西
              </AlgoStep>
            </ol>

            <P>
              加上 Idiot Index(原料成本 / 最終價格的比率)+
              First Principles(從物理拆解,不從類比推導)。
            </P>

            <Subhead>ZONE 27 應用</Subhead>
            <List>
              <Item label="引擎 v0.2 是 algorithm 產物">
                從 9 種輸入刪到 3 種(K/9 · BB/9 · HR/9)·{" "}
                <Link href="/audit" className="text-gold hover:underline">
                  /audit
                </Link>{" "}
                Section 03 ENGINE SCOPE 是 Step 2「刪除」的證據。
              </Item>
              <Item label="0 後端 server">
                Idiot Index 應用 · 引擎在訪客 CPU 跑 · 我們的 infrastructure cost ≈ 0 ·
                邊際成本 ≈ 0(per{" "}
                <Link href="/audit" className="text-gold hover:underline">
                  /audit
                </Link>{" "}
                Section 04 Environmental Impact)。
              </Item>
              <Item label="從零想 quant baseball 品牌">
                沒有抄 LINE 老師 / 殺手平台模式 · 從零問「what&apos;s a quant baseball
                community really for」。這就是 First Principles。
              </Item>
              <Item label="270 limited slots = forced focus">
                Musk 為什麼能造火箭?因為他<strong className="text-bone">限制自己</strong>
                只做幾件事。270 個席位 = 我們限制自己只服務這群人 · 不擴張。
              </Item>
            </List>
          </RuleSection>

          {/* ── 03 COSTCO ──────────────────────────── */}
          <RuleSection
            no="03"
            label="COSTCO"
            zh="會員制 + 品牌完整性"
            quote="We&apos;re a company that&apos;s based on our employees and our members. Without those two, we don&apos;t exist."
            source="— Jim Sinegal · Costco Co-Founder"
          >
            <P>
              Costco 把「賣東西的店」變成「會員制俱樂部」 — 同樣的東西,
              不同的商業模式邏輯。世界第三大零售商,
              <strong className="text-bone">幾乎不打廣告</strong>。
            </P>

            <DataTable>
              <DataRow label="會員費(2024)" value="USD $65 / $130" note="Gold Star / Executive" />
              <DataRow label="自設毛利上限" value="14% / 15%" note="品牌貨 / 自有品牌 · 業界普遍 25-50%" />
              <DataRow label="員工平均時薪" value="USD ~$32" note="比 Walmart / Target 高 40% · 流動率業界最低" />
              <DataRow label="廣告預算" value="$0" note="正式廣告 · 靠 word of mouth + 會員續訂" />
              <DataRow label="會員續訂率" value="90% (global)" note="2026 全球平均 · 美國境內 ~93%" />
            </DataTable>

            <Subhead>ZONE 27 應用</Subhead>
            <List>
              <Item label="會員制 > 商品收費">
                引擎 markup = 0%(永遠免費)·
                BLACK CARD 月費 + Founders 27 一次性 = membership revenue ·
                跟 Costco 一樣 — 「賣會員身分,不賣商品本身」。
              </Item>
              <Item label="自設創作者抽成上限">
                Founders 27 創作者 0% · BLACK CARD 5% · vs 業界 30-50%。
                Costco 14% 上限 = 把客戶利益放在毛利之前。
                ZONE 27 同樣邏輯 · 但更狠(0%)。
              </Item>
              <Item label="不打廣告">
                沒 Google Ads · 沒 FB Ads · 沒 retargeting(per{" "}
                <Link href="/privacy" className="text-gold hover:underline">
                  /privacy
                </Link>{" "}
                Section 03)。Costco 靠 word-of-mouth + 高續訂率長 50 年 · ZONE 27 也是。
              </Item>
              <Item label="品味守住類別界線">
                Costco 拒賣某些雜誌(價值觀衝突)· 拒接菸草廣告 ·
                即使有獲利機會。ZONE 27 拒寄生博彩平台 · 拒抓運彩數據 ·
                即使這些是流量入口(per{" "}
                <Link href="/coverage" className="text-gold hover:underline">
                  /coverage
                </Link>{" "}
                NEVER 行)。
              </Item>
            </List>
          </RuleSection>

          {/* ── SHAREABLE PULL-QUOTE ─────────────────── */}
          <blockquote
            className="mt-16 mx-auto max-w-2xl border-l-2 border-gold/60 pl-6 sm:pl-8 py-2 font-light text-bone text-2xl sm:text-3xl leading-snug"
            style={{ textWrap: "balance" }}
          >
            &ldquo;三個世界級品牌 · 三套不同方法 ·{" "}
            <span className="text-gold">同一個共識</span>:
            <span className="block mt-3">
              不靠<span className="text-gold">秘密</span>賺錢 · 靠
              <span className="text-gold">紀律</span>。&rdquo;
            </span>
            <footer className="mt-4 font-mono text-mute text-[10px] tracking-[0.3em] not-italic">
              — ZONE 27 OPERATING DISCIPLINE {PAGE_VERSION}
            </footer>
          </blockquote>

          {/* ── 04 SYNTHESIS ───────────────────────── */}
          <RuleSection
            no="04"
            label="SYNTHESIS"
            zh="三人共同 4 軸"
            quote="The secret to long-term success isn&apos;t a secret at all."
            source="— ZONE 27 synthesis · derived from Buffett · Musk · Costco"
          >
            <P>三個案例三套 playbook · 但 4 個共同軸線高度重疊:</P>

            <SynthRow
              axis="A · 長期 > 短期"
              examples="Buffett 26 年持 Coca-Cola · Musk 10-year SpaceX roadmap · Costco 7 年才漲一次會費"
              z27="270 終身席位 · 不收量化分數 · 拒絕季度 KPI 誘惑"
            />
            <SynthRow
              axis="B · 集中 > 分散"
              examples="Buffett 重押少數標的 · Musk 砍 90% 不必要 · Costco SKU < 4,000 vs Walmart 100K"
              z27="只覆蓋 MLB + 3 CPBL · 不擴張到不能誠實算的賽事"
            />
            <SynthRow
              axis="C · 信任 > 行銷"
              examples="Buffett owner's letter 每年寫實話 · Musk Twitter 透明溝通 · Costco 拒打廣告 90% 續訂"
              z27="/audit 5 sections + /manifesto 4 axioms · 沒 ad spend · footer FUNDED BY FOUNDERS"
            />
            <SynthRow
              axis="D · 守紀律拒絕容易"
              examples="Buffett 拒網路泡沫 · Musk 親手算每零件 cost · Costco 14% 毛利上限自綁"
              z27="拒 LINE 老師模式 · 拒運彩抽佣 · 拒博彩寄生 · 拒 user tracking"
            />

            <P className="text-mute/70">
              我們不是在「假裝是 Buffett」 — 我們在
              <strong className="text-bone">借用同一套紀律邏輯</strong>,
              因為它跨三個產業都成立 = 大概是對的。
            </P>
          </RuleSection>

          {/* ── 05 WHAT THIS PAGE IS NOT ────────────── */}
          <RuleSection
            no="05"
            label="DISCLAIMER"
            zh="這頁不是什麼"
            quote="The most dangerous thing for a brand is to sound like every other brand."
            source="— Operating Discipline · self-check"
          >
            <List>
              <Item label="不是吹捧">
                我們不認為自己是 Buffett / Musk / Costco · 也不假裝有他們的規模或視野。
              </Item>
              <Item label="不是 aspirational">
                這 5 條鐵律是<strong className="text-bone">已執行的</strong>事 · 寫在 /audit /privacy /coverage /about · 不是「願景」。
              </Item>
              <Item label="不是 marketing">
                這頁存在的理由是給未來的 Tim + 未來的 Claude session 留下{" "}
                <strong className="text-bone">非協商的紀律邊界</strong>。
              </Item>
              <Item label="不是不能挑戰">
                如果您看到我們違反任何一條 · 請開{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/issues">
                  GitHub Issue
                </ExtLink>{" "}
                公開指出。違反這 5 條 = ZONE 27 變質。
              </Item>
            </List>
          </RuleSection>

          {/* ── FOOTER · SIGN-OFF ─────────────────────── */}
          <footer className="pt-12 mt-12 border-t border-line/60">
            <p className="font-mono text-mute text-[11px] tracking-[0.25em] mb-6">
              VERIFY THIS DISCIPLINE
            </p>
            <ul className="space-y-3 text-sm text-mute leading-relaxed">
              <li>
                ▸ Buffett 原始 owner&apos;s manual:{" "}
                <ExtLink href="https://www.berkshirehathaway.com/owners.html">
                  berkshirehathaway.com/owners.html
                </ExtLink>
              </li>
              <li>
                ▸ Costco code of ethics:{" "}
                <ExtLink href="https://www.costco.com/code-of-ethics.html">
                  costco.com/code-of-ethics.html
                </ExtLink>
              </li>
              <li>
                ▸ Musk 5-step algorithm:{" "}
                <ExtLink href="https://en.wikipedia.org/wiki/Elon_Musk">
                  Walter Isaacson · Elon Musk biography 2023
                </ExtLink>
              </li>
              <li>
                ▸ ZONE 27 對應的執行頁:{" "}
                <Link href="/audit" className="text-gold hover:underline">
                  /audit
                </Link>{" "}
                ·{" "}
                <Link href="/manifesto" className="text-gold hover:underline">
                  /manifesto
                </Link>{" "}
                ·{" "}
                <Link href="/privacy" className="text-gold hover:underline">
                  /privacy
                </Link>{" "}
                ·{" "}
                <Link href="/coverage" className="text-gold hover:underline">
                  /coverage
                </Link>
              </li>
            </ul>

            <p className="mt-12 font-mono text-mute text-[10px] tracking-[0.25em]">
              本頁採 Buffett 1996 Owner&apos;s Manual + Costco Code of Ethics
              + Musk 5-step algorithm 三套 primary source · 零吹捧語言原則
            </p>

            <div className="mt-10 flex items-center justify-center">
              <CopyLinkButton />
            </div>
          </footer>
        </article>

        <RelatedReading currentPath="/discipline" />
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function RuleSection({
  no,
  label,
  zh,
  quote,
  source,
  children,
}: {
  no: string;
  label: string;
  zh: string;
  quote: string;
  source: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-12 pb-2 mt-12 border-t border-line/40">
      <div className="flex items-baseline gap-4 mb-3 section-reveal">
        <span className="font-mono text-gold/70 text-[11px] tabular tracking-[0.3em]">
          {no}
        </span>
        <h2 className="font-mono text-bone text-[11px] tracking-[0.3em]">
          {label}
        </h2>
      </div>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight mb-6">
        {zh}
      </h3>

      <blockquote className="border-l-2 border-gold/40 pl-5 sm:pl-6 py-1 mb-8 max-w-2xl">
        <p
          lang="en"
          className="text-bone text-base sm:text-lg font-light italic leading-snug mb-2"
        >
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="font-mono text-mute text-[10px] tracking-[0.25em] not-italic">
          {source}
        </footer>
      </blockquote>

      <div className="space-y-5 text-mute text-base leading-relaxed max-w-2xl">
        {children}
      </div>
    </section>
  );
}

function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`leading-relaxed ${className}`}>{children}</p>;
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <p
      lang="en"
      className="font-mono text-gold text-[10px] tracking-[0.4em] mt-8 mb-1"
    >
      {children}
    </p>
  );
}

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2.5 list-none pl-0">{children}</ul>;
}

function Item({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-baseline gap-3 sm:gap-4 text-sm sm:text-base">
      <span className="font-mono text-gold/70 text-[11px] tracking-[0.15em] shrink-0 sm:w-40 sm:max-w-40">
        {label}
      </span>
      <span className="text-mute leading-relaxed flex-1">{children}</span>
    </li>
  );
}

function AlgoStep({
  n,
  label,
  children,
}: {
  n: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-baseline gap-3 sm:gap-4">
      <span className="font-mono text-gold tabular text-base shrink-0">
        {n}.
      </span>
      <span className="flex-1">
        <strong className="text-bone">{label}</strong>
        <span className="block text-mute text-sm leading-relaxed mt-1">
          {children}
        </span>
      </span>
    </li>
  );
}

function DataTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full text-sm font-mono border-collapse my-4">
      <tbody>{children}</tbody>
    </table>
  );
}

function DataRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <tr className="border-b border-line/30">
      <td className="py-3 pr-4 text-mute text-[11px] tracking-[0.15em] w-1/3 align-top">
        {label}
      </td>
      <td className="py-3 pr-4 text-bone tabular align-top">{value}</td>
      <td className="py-3 text-mute/70 text-[11px] tracking-[0.1em] align-top">
        {note}
      </td>
    </tr>
  );
}

function SynthRow({
  axis,
  examples,
  z27,
}: {
  axis: string;
  examples: string;
  z27: string;
}) {
  return (
    <div className="border-b border-line/40 py-4">
      <p className="font-mono text-gold text-[11px] tracking-[0.25em] mb-2">
        {axis}
      </p>
      <p className="text-mute text-sm leading-relaxed mb-1">
        <span className="font-mono text-mute/60 text-[10px] tracking-[0.2em] mr-2">
          三人:
        </span>
        {examples}
      </p>
      <p className="text-bone text-sm leading-relaxed">
        <span className="font-mono text-gold/80 text-[10px] tracking-[0.2em] mr-2">
          ZONE 27:
        </span>
        {z27}
      </p>
    </div>
  );
}
