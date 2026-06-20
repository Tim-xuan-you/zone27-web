import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import StatTerm from "@/components/StatTerm";
import ReadingProgress from "@/components/ReadingProgress";
import { matches, getFinalizedMatches } from "@/lib/matches";
import {
  COMMIT_SHA,
  DEPLOYED_AT,
  PRODUCT_VERSION,
} from "@/lib/build-meta";
import { createPageMetadata } from "@/lib/page-og";

// R159 W1.L1 · Agent L CRITICAL · backfill createPageMetadata · 之前 root
// openGraph slogan「We Don't Guess. We Compute.」 leak over custom /audit OG card
// on share platforms。 per Anthropic transparency hub canonical spine。
export const metadata: Metadata = createPageMetadata({
  title: "Model Report · ZONE 27 Engine Audit",
  description:
    "完整公開的 model report · 5 sections · 模型描述、使用的輸入、引擎範圍、環境衝擊、揭露哲學。零行銷語言。",
  path: "/audit",
});

// ── ZONE 27 · /audit — Model Report ───────────────────
// Inspired by Anthropic's Transparency Hub model card structure.
// This is the page hardcore founders screenshot to friends —
// pure facts, monospace, no gradients, no marketing voice.
//
// Distinct from /methodology:
//   - /methodology = HOW the engine works (engineering paper)
//   - /audit       = WHAT we claim, WHAT we don't claim, WHEN
//
// Six required sections (research-backed Anthropic spine):
//   01 Model description
//   02 Inputs we use
//   03 Inputs we deliberately exclude
//   04 Benchmark performance
//   05 Known failure modes
//   06 Last calibration run
// ─────────────────────────────────────────────────────

const LAST_REVIEWED = "2026-05-21";
const ENGINE_VERSION = "v0.2 · Real At-Bat";

export default function AuditPage() {
  // Live counts — these refresh on every build / ISR revalidate.
  // Replaces hardcoded "n = 3 · CPBL 2026-05" with the actual matches
  // array length. Brand-honest: the number on this page IS the same
  // number /track-record reads · they can't drift.
  const ingestedCount = matches.length;
  const finalizedCount = getFinalizedMatches().length;
  const sampleSize =
    finalizedCount === 0
      ? `n = 0 · ${ingestedCount} ingested · 等第一筆收錄`
      : `n = ${finalizedCount} · ${ingestedCount} ingested · CPBL 2026-05-21 起`;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          {/* ── PRINT-ONLY ATTRIBUTION BAND ─────────────
              Visible only when Cmd+P. Stamps the printout with
              source URL + print date so the artifact survives as
              a snapshot. Bloomberg/Reuters/internal-report pattern. */}
          <div
            lang="en"
            className="print-only mb-6 pb-3 border-b border-line/60 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            <div className="flex justify-between gap-4">
              <span>ZONE 27 — MODEL REPORT {PRODUCT_VERSION}</span>
              <span>
                PRINTED · zone27-web.vercel.app/audit
              </span>
            </div>
          </div>

          {/* ── HEADER ──────────────────────────────── */}
          <header className="pb-10 border-b border-line/60">
            <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.45em]"
              >
                MODEL REPORT
              </p>
              <p
                lang="en"
                className="font-mono text-mute text-[10px] tracking-[0.35em] tabular"
              >
                REPORT {PRODUCT_VERSION}
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-3">
              ZONE 27 Engine
            </h1>
            <div className="zone27-rule max-w-[260px] mb-6" aria-hidden="true" />
            <p className="editorial-dropcap text-mute text-base leading-relaxed mb-8 max-w-2xl">
              引擎能算什麼 · 不能算什麼。
            </p>

            <dl className="grid grid-cols-3 gap-x-6 gap-y-4 font-mono text-[11px] tracking-[0.05em]">
              <MetaPair label="LAST REVIEWED" value={LAST_REVIEWED} />
              <MetaPair label="ENGINE" value={ENGINE_VERSION} />
              <MetaPair label="SAMPLE SIZE" value={sampleSize} />
            </dl>
          </header>

          {/* ── 01 MODEL DESCRIPTION ────────────────── */}
          <ReportSection no="01" label="MODEL DESCRIPTION">
            <P>
              ZONE 27 的引擎是逐打席對決模型,用於估算棒球比賽
              的勝率分布。每場虛擬比賽模擬 9 局共 ~70 個獨立打席,每個打席依
              投手 <StatTerm term="K/9" /> · <StatTerm term="BB/9" /> ·{" "}
              <StatTerm term="HR/9" /> 推
              導 8 種互斥結果(<Code>K · BB · HR · 1B · 2B · 3B · GO · FO</Code>)
              的條件機率,滾亂數選一個,執行壘上推進物理累計分數。
            </P>
            <P>
              引擎完全在你的瀏覽器裡跑,不連任何伺服器,沒網路也能算。完整方法公開於{" "}
              <Link
                href="/methodology"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology
              </Link>
              ,每一個機率推導、簡化假設與已知限制都寫清楚。
            </P>
          </ReportSection>

          {/* ── 02 INPUTS WE USE ─────────────────────── */}
          <ReportSection no="02" label="INPUTS WE USE">
            <P>下列輸入會直接影響模型輸出:</P>
            <List>
              <Item label="K/9">
                先發投手每 9 局三振率 · 推導每打席被三振的條件機率
              </Item>
              <Item label="BB/9">
                先發投手每 9 局保送率 · 推導每打席保送的條件機率
              </Item>
              <Item label="HR/9">
                先發投手每 9 局被全壘打數 · 推導每打席被打 HR 的條件機率
              </Item>
              <Item label="場次身分">
                主場 / 客場 (用於 9 局上下半分配,不含主場優勢加成)
              </Item>
              <Item label="基準常數">
                每 9 局期望打席數 = 38 · CPBL 過去 10 年平均
              </Item>
              <Item label="BABIP 拆分">
                場內球 65% 出局 / 35% 安打 · CPBL 聯盟均值
              </Item>
              <Item label="壘間推進規則">
                寫死的條件機率 (1B: 60%/20% · 2B: 50% · 3B: 100%)
              </Item>
            </List>
            {/* Round 28 · Agent C P3.2 Pratfall surface · K/9 · BB/9 是估算的事實
                從 lib/matches.ts 註解(GitHub 公開可見)主動 surface 到 /audit ·
                埋著=自我入罪 · 主動標=courageous disclosure。Pratfall axiom
                applied correctly = it BECOMES the trust artifact. */}
            <div className="mt-6 border border-loss/30 bg-loss/5 p-5 sm:p-6">
              <p
                lang="en"
                className="font-mono text-loss text-[10px] tracking-[0.4em] mb-3"
              >
                ▲ ESTIMATION DISCLOSURE
              </p>
              <p className="text-mute text-sm leading-relaxed">
                CPBL 官網 cpbl.com.tw 不公開投手每打席等級的 K/9 · BB/9 ·
                HR/9 真實數字。 ZONE 27 用球速 + ERA + 聯盟平均反推出估計值 · 每位
                投手是怎麼估出來的都明白標出 · 不藏。 此外也會自動抓
                cpbl.com.tw 官網的 K/9 BB/9 HR/9 排行 · 16+ 達標
                投手已自動疊上官方真實數字。
              </p>
            </div>

            {/* R91 simplification · ADVANCED INPUTS Trackman box compressed
                from 3 paragraphs(~35 lines)to 1 paragraph(~10 lines)·
                brand IP signal 守住(Trackman 整合 + GitHub attribution +
                stats.cpbl source cite)· engineering 細節 cut 70% per Tim
               「都是字」 mandate · 同 R90 /track-record STAT LITERACY axis。 */}
            <div className="mt-6 border border-gold/40 bg-gold/5 p-5 sm:p-6">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
              >
                ✦ ADVANCED INPUTS · TRACKMAN RADAR 整合
              </p>
              <p className="text-mute text-sm leading-relaxed">
                整合{" "}
                <ExtLink href="https://stats.cpbl.com.tw/">
                  stats.cpbl.com.tw
                </ExtLink>
                {" "}CPBL 進階數據(Trackman radar)· wOBA-against · K% · 揮空% ·
                強擊球% · 擊球初速 Avg/Max · CPBL 內部 percentile。 資料直接取自
                官方 · 不假裝自己 collect Trackman data。
              </p>
            </div>
            <P className="text-mute/70">
              所有資料來源與引用見{" "}
              <Link href="/methodology" className="text-gold hover:underline">
                /methodology
              </Link>{" "}
              第 03 節 WHAT&apos;S NEXT。
            </P>
          </ReportSection>

          {/* ── 03 ENGINE SCOPE (Round 7 · agent-validated consolidation) ──
              Was: TWO sections (S03 ENGINE SCOPE BOUNDARIES + S04 WHEN
              TO QUESTION OUR OUTPUT) totaling 17 items across 2 lists.
              Round 7 fact-check agent confirmed: 0 of 5 cited premium
              brands publish structured limitation pages (Stratechery /
              37signals / Plausible / Apple / Berkshire all FALSE on
              fact-check). 27 items across 3 site pages = "taxonomy-as-
              decoration · not signal" per agent verdict.
              Consolidated to 5 items in prose form · brand-IP "publish
              everything" preserved via GitHub link + DISCLOSURE
              PHILOSOPHY Section 05 (renumbered from 06).
              Removed S04 entirely · removed shareablequote referencing
              「刻意排除的 10 個輸入」 since that number is no longer
              prominent. Renumbered subsequent sections. */}
          <ReportSection no="03" label="ENGINE SCOPE">
            <P>
              引擎 v0.2 涵蓋投手三項基礎指標(<StatTerm term="K/9" /> · <StatTerm term="BB/9" /> · <StatTerm term="HR/9" />)
              推導每打席結果。範圍外的事項 — 訪客可在判讀時加上自己直觀調整:
            </P>
            <List>
              <Item label="打者個別品質">
                所有打者假設為聯盟平均 · 強打線 vs 二軍同樣對待
                (這個 gap 最大 · 可能低估真實勝率差距 15-25 pp)
              </Item>
              <Item label="球場因素">
                台中洲際(打者球場)與天母(投手球場)使用相同機率
              </Item>
              <Item label="投手疲勞 + 牛棚切換">
                假設先發投滿 9 局 · CPBL 實際平均 5.8 局 · 第 9 局 K 率與第 1 局相同
              </Item>
              <Item label="守備差異 + 場地天氣">
                BABIP 假設聯盟均值 · 強守備隊伍可降低 ~2-3 pp · 極端天氣未建模
              </Item>
              <Item label="打席獨立假設">
                每個打席視為獨立事件 · clutch / momentum / 代打換投決策未建模
              </Item>
            </List>
            <P className="text-mute/70">
              完整方法公開於{" "}
              <Link
                href="/methodology"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology
              </Link>
              {" · "}任何 simplification 都寫得清清楚楚。
              當預測明顯偏離時,逐場結果會出現在{" "}
              <Link
                href="/track-record"
                className="text-gold underline-offset-4 hover:underline"
              >
                公開戰績
              </Link>
              ,對應變數會寫進下一次引擎迭代。
            </P>

            {/* ── 足球引擎 v0.1 揭露(2026-06-10 世界盃前夜補)──────────
                第二顆引擎進站的第一個結算週不能黑箱:公式、實力分來源、地主
                規則、結算的尺全攤開(同棒球等級)。 站上各處只有一行「公式公開」
                沒有內容 = disclosure 缺口 · 這段是 canonical。 */}
            <div className="mt-10 pt-8 border-t border-line/40">
              <P>
                <strong className="text-bone">足球引擎 v0.1(Dixon-Coles)</strong>
                —— 2026 世界盃起用 · 跟棒球同一個揭露標準:
              </P>
              <List>
                <Item label="怎麼開盤">
                  兩隊「國際實力分」差距 + 主場優勢 → 換算兩邊預期進球 →
                  Dixon-Coles 比分機率表(對 0-0 / 1-0 / 0-1 / 1-1
                  這類低比分做修正)→ 加總成 主勝 / 和 / 客勝 三向機率
                </Item>
                <Item label="大小球 / 讓球 / 兩隊進球">
                  賽事卡上這三個賭徒熟悉的玩法機率,是把「算主勝 / 和 / 客勝」的
                  同一張比分機率表換個角度再讀一次(大小球 = 加總總進球那條線兩側 ·
                  讓球 = 加總比分差那條線兩側 · 兩隊進球 = 加總雙方都進球的格子)·
                  跟卡片上的三向 % 同源、零 drift。 老實說:這是我們引擎自己算的機率,
                  <strong className="text-bone">不是莊家盤口、不轉賠率、也不是叫你押哪邊</strong>
                  —— 數字我們算,你自己判斷
                </Item>
                <Item label="實力分是哪來的">
                  48 隊的分數是創辦人手工錨定的近似值(量級對齊公開的國際 Elo
                  排名 · 非即時、非官方)。 老實說:這套近似值的強弱差距壓得比真實
                  榜單窄 · 大熱門可能被我們系統性低開 —— 校準圖會照實畫出這件事 ·
                  之後由創辦人對照賽果手動修(每次改動都公開記錄)
                </Item>
                <Item label="主場規則">
                  世界盃是中立場 —— 只有被列為主隊的地主(美國 / 墨西哥 / 加拿大)
                  拿主場加成,其餘全部中立 0。 老實說:這是看「列名主隊是不是地主」·
                  不是看比賽實際在哪國場館踢 —— 小組賽地主都在本國踢、大致吻合,
                  到了淘汰賽主客只是籤表位置,這個近似會有誤差
                </Item>
                <Item label="對帳的尺">
                  一律算 90 分鐘正規賽 1X2 · 淘汰賽的延長賽 / PK 晉級不影響
                  這條線 · 和局是真實結果照常評(永不 push · 藏和局 = 偷藏約
                  1/4 的場次)
                </Item>
                <Item label="沒建模的">
                  陣容 / 傷兵 / 近期狀態 / 天氣 · 全部沒看 —— 引擎只看實力分
                  與地主 · 你判讀時自己加上去
                </Item>
              </List>
              <P className="text-mute/70">
                完整方法公開於{" "}
                <Link
                  href="/methodology"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /methodology
                </Link>
                {" · "}賽前鎖定的每一場(含機率、實力分、鎖定時間戳)都在{" "}
                <Link
                  href="/track-record"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  公開戰績
                </Link>
                {" · "}任何人可逐場核對。
              </P>
            </div>
          </ReportSection>

          {/* ── 08 Z27 LEXICON · R168 W1 port from deleted /glossary · 5 brand
              IP terms used across site · anchor targets for /audit#proved /
              /audit#diverged / /audit#sample-debt / /audit#z27-lexicon。 */}
          <ReportSection no="08" label="Z27 LEXICON">
            <P>
              5 個 ZONE 27 自己的用語 · 在公開戰績、首頁、賽事頁、/audit 各處出現 ·
              完整定義在這裡。
            </P>
            <dl className="mt-6 space-y-5">
              <div id="proved" className="border-l-2 border-gold/60 pl-4 scroll-mt-20">
                <dt className="font-mono text-gold text-[10px] tracking-[0.35em] mb-1">
                  PROVED · 引擎命中
                </dt>
                <dd className="text-mute text-sm leading-relaxed">
                  賽前引擎指向的 favorite(winRate &gt; 50%)在實際比賽中獲勝 · gold ✓
                  記入 <Link href="/track-record" className="text-gold underline-offset-4 hover:underline">/track-record</Link> ledger · 視覺權重等同 DIVERGED · 不過濾。
                </dd>
              </div>
              <div id="diverged" className="border-l-2 border-loss/60 pl-4 scroll-mt-20">
                <dt className="font-mono text-loss text-[10px] tracking-[0.35em] mb-1">
                  DIVERGED · 引擎落空
                </dt>
                <dd className="text-mute text-sm leading-relaxed">
                  賽前 favorite 在實際比賽中輸了 · loss ✕ 等大等亮列入 ledger · 永遠不刪 ·
                  「方法公開」 的物理證據。
                </dd>
              </div>
              <div className="border-l-2 border-line/60 pl-4">
                <dt className="font-mono text-mute text-[10px] tracking-[0.35em] mb-1">
                  PUSH · 平手或無 favorite
                </dt>
                <dd className="text-mute text-sm leading-relaxed">
                  罕見 · 兩種:(a) 實際平局 ·(b) 引擎輸出 50/50 · verdict 二元之外的第三狀態。
                </dd>
              </div>
              <div id="sample-debt" className="border-l-2 border-loss/40 pl-4 scroll-mt-20">
                <dt className="font-mono text-loss/85 text-[10px] tracking-[0.35em] mb-1">
                  樣本還太少 · 場數不夠
                </dt>
                <dd className="text-mute text-sm leading-relaxed">
                  場數 &lt; 30 時 · 中獎率容易被運氣放大 · /track-record 會顯示
                  「樣本還太少」直到累積到 30 場。 進階數據社群的老規矩 · 我們不掩飾。
                </dd>
              </div>
              <div className="border-l-2 border-gold/40 pl-4">
                <dt className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-1">
                  RECEIPT · 引擎收據
                </dt>
                <dd className="text-mute text-sm leading-relaxed">
                  賽後 Tim 親手截圖、把最終比分輸進去 · 公開戰績就多一行 ·
                  全程 Tim 一個人手動 · 不自動化。
                </dd>
              </div>
            </dl>
          </ReportSection>

          {/* ── FOOTER NOTE ───────────────────────── */}
          <footer className="pt-12 mt-12 border-t border-line/60">
            <p className="font-mono text-mute text-[11px] tracking-[0.25em] mb-6">
              VERIFY THIS REPORT
            </p>
            <ul className="space-y-3 text-sm text-mute leading-relaxed">
              <li>
                ▸ 親手跑一場:{" "}
                <Link href="/lab" className="text-gold hover:underline">
                  /lab
                </Link>{" "}
                — 在您的瀏覽器內執行 10,000 場模擬
              </li>
              <li>
                ▸ 自訂任意投手對戰:{" "}
                <Link href="/lab/custom" className="text-gold hover:underline">
                  /lab/custom
                </Link>
              </li>
              <li>
                ▸ 完整方法論(含參考文獻):{" "}
                <Link href="/methodology" className="text-gold hover:underline">
                  /methodology
                </Link>
              </li>
              <li>
                ▸ 逐場戰績與結果:{" "}
                <Link href="/track-record" className="text-gold hover:underline">
                  公開戰績
                </Link>
              </li>
            </ul>

            {/* Build provenance · Round 4 moved from header MetaPair
                (where it was loud) to here (quiet · only die-hards
                find it). Engineers can click through to the exact
                commit that built this page. */}
            <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.2em] tabular">
              BUILD ·{" "}
              <span className="text-mute/80">
                {COMMIT_SHA} · {DEPLOYED_AT}
              </span>
            </p>

            {/* ── Share this report · private-DM lever ──
                Indie-stealth growth pattern: make the URL itself the share
                unit. Zero tracking · zero referrer instrumentation. */}
            <div className="mt-10 flex items-center justify-center">
              <CopyLinkButton />
            </div>
          </footer>
        </article>

        <RelatedReading currentPath="/audit" />
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function MetaPair({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-mute/70 mb-1 tracking-[0.25em]">{label}</dt>
      <dd className="text-bone tabular">{value}</dd>
    </div>
  );
}

function slugFromAuditSectionNo(no: string): string {
  return `section-${no.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function ReportSection({
  no,
  label,
  children,
}: {
  no: string;
  label: string;
  children: React.ReactNode;
}) {
  const id = slugFromAuditSectionNo(no);
  return (
    <section
      id={id}
      className="pt-12 pb-2 mt-12 border-t border-line/40 cv-auto scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-6 section-reveal">
        <span className="font-mono text-gold/70 text-[11px] tabular tracking-[0.3em]">
          {no}
        </span>
        <h2 className="font-mono text-bone text-[11px] tracking-[0.3em]">
          {label}
        </h2>
      </div>
      <div className="space-y-5 zh-body text-mute text-base leading-relaxed max-w-2xl">
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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-gold/90 bg-ink/40 px-1.5 py-0.5 text-[0.9em] border border-line/60">
      {children}
    </code>
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
      <span className="font-mono text-gold/70 text-[11px] tracking-[0.15em] shrink-0 sm:w-44 sm:max-w-44">
        {label}
      </span>
      <span className="text-mute leading-relaxed flex-1">{children}</span>
    </li>
  );
}

