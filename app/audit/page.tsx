import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import StatTerm from "@/components/StatTerm";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";
import ReproducibilityReceipt from "@/components/ReproducibilityReceipt";
import LocalStorageReceipt from "@/components/LocalStorageReceipt";
import { matches, getFinalizedMatches, getTrackRecordStats } from "@/lib/matches";
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
  // 同 /track-record 讀的那支函式 —— /audit 的 PROVED/DIVERGED 數字跟公開戰績逐字同源,
  // 物理上不可能各說各話(這頁的整個命門就是「數字不會漂移」)。
  const trackStats = getTrackRecordStats();
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
              引擎能算什麼 · 不能算什麼 · 為什麼公開全部。
            </p>

            <dl className="grid grid-cols-3 gap-x-6 gap-y-4 font-mono text-[11px] tracking-[0.05em]">
              <MetaPair label="LAST REVIEWED" value={LAST_REVIEWED} />
              <MetaPair label="ENGINE" value={ENGINE_VERSION} />
              <MetaPair label="SAMPLE SIZE" value={sampleSize} />
            </dl>
            <div className="mt-6">
              <ArticleMeta
                readingMin={8}
                sample={{ current: finalizedCount, threshold: 30 }}
              />
            </div>
          </header>

          {/* Hindenburg-style top-of-doc position disclosure · mirror to /methodology。 */}
          <aside
            id="disclosure"
            aria-labelledby="audit-disclosure-heading"
            className="mt-8 mb-12 border border-line/60 bg-slate/30 p-5 sm:p-6"
          >
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span
                id="audit-disclosure-heading"
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em]"
              >
                / DISCLOSURE · WHO WROTE THIS
              </span>
              <span
                lang="en"
                className="font-mono text-mute/60 text-[9px] tracking-[0.3em]"
              >
                LAST UPDATED · 2026-05-23
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-mute/85 text-[12px] sm:text-[13px] leading-relaxed">
              <li className="font-mono tabular">
                <span className="text-mute/60">EQUITY</span>{" "}
                <span className="text-bone">100% TIM solo</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">SPONSORS</span>{" "}
                <span className="text-bone">0</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">ADS</span>{" "}
                <span className="text-bone">0 · AdMob permanently banned</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">TRACKERS</span>{" "}
                <span className="text-bone">0 · 見 /privacy</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">RECEIPTS</span>{" "}
                <span className="text-bone">
                  N={trackStats.total} · {trackStats.proved} PROVED ·{" "}
                  <span className={trackStats.diverged > 0 ? "text-loss" : ""}>
                    {trackStats.diverged} DIVERGED
                  </span>
                </span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">BLACK</span>{" "}
                <span className="text-bone">0 paid subscribers</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">REVENUE</span>{" "}
                <span className="text-bone">NT$ 0 · Year 0 honest empty</span>
              </li>
            </ul>
            <p className="mt-3 text-mute/65 text-[11px] leading-relaxed border-t border-line/40 pt-3">
              完整年度透明報表 · 每年 5/31 publish commitment(同此頁的事前承諾原則)·
              違反就是品牌信用崩盤(見{" "}
              <Link
                href="/ethics"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /ethics
              </Link>
              )。 第 05 節「為什麼全部公開」解釋我們為什麼把這些攤出來 ·
              方法完整公開 · 不留秘密。
            </p>
            {/* R161 W1.O3 · Agent O Gap 3 · lateral cross-link to sibling
                disclosure surfaces · /audit 是 trust artifact hub but star-graph
                hub-spoke 過載 · 加 lateral mesh-graph edges to /integrity(22
                binding rules canonical R109)+ /steelman(5 strongest objections
                self-exposure)· per NN/g 2026 hub-and-spoke internal-linking
                research · spokes cross-link reduces /audit single-point load。 */}
            <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
              ⚓ 我們綁死的 22 條規矩 →{" "}
              <Link
                href="/integrity"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /integrity
              </Link>{" "}
              · 對自己最狠的 5 個質疑(自己先講)→{" "}
              <Link
                href="/steelman"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /steelman
              </Link>
            </p>
            {/* R129 W1 · DELTA-of-CPBL positioning cross-link · per R126 NEW
                [[feedback-zone27-delta-of-cpbl-positioning]] memory SOP「DO
                surface this positioning on /audit + /heritage as canonical」 ·
                /heritage 已 R127 W2 surface 完整 section · /audit 補 inline
                cross-link · 不改 8-fact disclosure 結構(避免 count drift in
                FromOneSolo:108 + NonComparableAnchor:147 兩處 8-fact reference)
                · 純 closing-line 1-sentence link · multi-surface placement =
                brand IP consistency。 */}
            <p className="mt-2 text-mute/65 text-[11px] leading-relaxed">
              ⚓ 定位 · ZONE 27 是亞洲棒球數據分析空了 17 年的位子裡第一個進場的。
              完整來龍去脈 + 日本 DELTA 撐了 14 年的前例 + 台灣 Rebas 對照 +
              CPBL 2025 市場規模算法,見{" "}
              <Link
                href="/about"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /about
              </Link>
              。
            </p>
          </aside>

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
            <P className="text-mute/70">
              想看完整技術說明(引擎怎麼搭、每打席機率怎麼推、壘間怎麼跑、為什麼跑一萬次就穩)?
              請見{" "}
              <Link
                href="/methodology"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology
              </Link>
              。本頁是精簡的 model report,/methodology 是完整技術論文。
            </P>
            <P className="text-mute/70">
              本報告涵蓋 v0.2 主引擎。 v0.3(加了球場因素對全壘打率的修正)已經是
              開發預覽版 · v0.4(把 v0.2、v0.3 兩版結果加權混合)排在 2026 第四季。
              完整 3 個引擎版本(v0.2 → v0.3 → v0.4)的進程 · 每版改了什麼 · 見{" "}
              <Link
                href="/methodology"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology Section 04 ENGINE LINEUP
              </Link>
              {" "}+ entire v0.2 → v0.3 delta 見{" "}
              <Link
                href="/methodology/diff"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology/diff
              </Link>
              。
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
              <p className="text-mute/70 text-xs leading-relaxed mt-3">
                這個 caveat 是 disclosure philosophy 的物理產出 ·
                /audit Section 05 解釋為什麼把弱點貼在門口而不是藏起來。
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

          {/* ── 04 ENVIRONMENTAL IMPACT ──────────────────
              Round 7: renumbered 05 → 04 after Round 7 consolidation
              merged S03 + S04 into ONE Section 03 ENGINE SCOPE.
              Inspired by Hugging Face model card template's
              Environmental Impact section. 98% of model cards on HF
              skip this field. ZONE 27's "no backend" architecture means
              we can disclose it honestly and end up ahead of Anthropic
              + OpenAI on this dimension. */}
          <ReportSection no="04" label="ENVIRONMENTAL IMPACT">
            <P>
              ZONE 27 引擎完全在你的瀏覽器裡跑,
              <strong className="text-bone">不連任何伺服器、也沒有用機房訓練模型</strong>。
              下表是跑一次 10,000 場模擬的環境足跡估算:
            </P>

            <DataTable>
              <DataRow
                label="HARDWARE TYPE"
                value="使用者裝置"
                note="M1 / Intel i5 以上 · 一般筆電/手機"
              />
              <DataRow
                label="COMPUTE REGION"
                value="client-side"
                note="使用者所在瀏覽器 · 無雲端"
              />
              <DataRow
                label="HOURS USED"
                value="~0.0005 hr / sim"
                note="10,000 次模擬約 1.5 - 2.0 秒"
              />
              <DataRow
                label="CLOUD PROVIDER"
                value="無"
                note="引擎不呼叫後端 · Vercel 只 serve 靜態 HTML/JS"
              />
              <DataRow
                label="CARBON EMITTED"
                value="< 0.1 g CO₂e / sim"
                note="估算 · 依裝置 TDP × 電網碳強度(MLCO2 calculator)"
              />
            </DataTable>

            <P className="text-mute/70">
              依據{" "}
              <ExtLink href="https://mlco2.github.io/impact#compute">
                MLCO2 Impact Calculator
              </ExtLink>{" "}
              方法(Lacoste et al. 2019)粗估。引擎的「無後端」架構選擇,
              讓 ZONE 27 在這一項上領先 98% 的 AI 模型說明書
              (包括 Anthropic 與 OpenAI · 這兩家都沒公開自家碳排數據)。
            </P>

            <div className="mt-4">
              <ReproducibilityReceipt
                seed={null}
                dataAt="2026-05-22"
                n={10000}
              />
            </div>
          </ReportSection>

          {/* ── 05 DISCLOSURE PHILOSOPHY · canonical brand-IP anchor ── */}
          <ReportSection no="05" label="DISCLOSURE PHILOSOPHY">
            <P>
              為什麼我們把整份 model report 公開到這個程度?
              <strong className="text-bone"> 因為我們沒有商業機密。</strong>
            </P>

            <DataTable>
              <DataRow
                label="OUR MATH"
                value="機率 + 一萬次模擬"
                note="每打席算機率 · 在電腦裡跑一萬次數誰贏 · 高中數學等級 · 方法全公開"
              />
              <DataRow
                label="OUR INPUTS"
                value="K/9 · BB/9 · HR/9"
                note="Baseball Reference / MLB Stats API · 任何人可查"
              />
              <DataRow
                label="OUR ENGINE"
                value="方法完整公開"
                note="JavaScript 寫的 · 邏輯全攤在 /methodology"
              />
              <DataRow
                label="OUR MOAT"
                value="信任,不是算法"
                note="您能驗證 → 您才有理由信"
              />
            </DataTable>

            <P>
              OpenAI 藏模型參數 · Anthropic 藏訓練資料 · Google 藏調校手法 —
              他們的生意靠藏演算法,
              <strong className="text-bone">一不藏對手馬上複製,幾十億的研發就白做了</strong>。
            </P>
            <P>
              <strong className="text-bone">ZONE 27 是 AI 公司的倒影</strong> —
              我們賣身分(BLACK),
              引擎是免費送的工具,本來就沒有可藏的價值。
              硬藏算法 = 假裝有秘密 = 對訪客撒謊 = 品牌信用自殺。
            </P>
            <P className="text-mute/70">
              這份報告本身,就是
              「您憑什麼信任 ZONE 27?」的具體回答。
              您可以一行一行驗證 — 任何說「我們有黑盒 AI,你看不到」的對手,剛好證明他們跟我們是反的。
            </P>
            <P className="text-mute/70">
              <strong className="text-bone">物理證據在</strong>{" "}
              <Link href="/track-record" className="text-gold hover:underline">
                /track-record
              </Link>
              {" "}— 每場引擎公開預測賽後實際結果(
              <Link href="#proved" className="text-gold underline-offset-4 hover:underline">PROVED</Link>
              {" "}✓ /{" "}
              <Link href="#diverged" className="text-gold underline-offset-4 hover:underline">DIVERGED</Link>
              {" "}✕)等大列出 ·
              不刪、不修飾、不過濾。揭露哲學 = 文字理論;公開戰績 = 文字理論的物理產出。
            </P>

            {/* Round 31 Wave G A10 critic patch · pre-commit DIVERGED handling
                rule。 Critic agent surface:「N=1 還 100% 命中 · 你 SHOW 個屁
                error?」 修法:先 commit handling rule 在 miss 還沒發生時 ·
                signal 最強。 brand IP「Pratfall」延伸到 procedural pre-commitment。 */}
            <div className="mt-6 p-5 sm:p-7 border border-loss/30 bg-loss/5">
              <p
                lang="en"
                className="font-mono text-loss text-[10px] tracking-[0.35em] mb-3"
              >
                ⚓ PRE-COMMIT · DIVERGED 的處理規則(失準前就先寫好)
              </p>
              <p className="text-mute text-sm leading-relaxed mb-3">
                這條規則在引擎第一次失準前就先寫好 —— 不等出包了才回頭
                定義什麼叫「失準」、該怎麼處理。 規則:
              </p>
              <ul className="space-y-2 text-mute text-sm leading-relaxed list-disc pl-6">
                <li>每一筆 DIVERGED 出現當日 · 該場收據自動出現
                  在 <Link href="/" className="text-gold hover:underline underline-offset-4">首頁</Link>
                  · 不撤、不藏、不在 7 天內被新的蓋掉</li>
                <li>/track-record ledger 編號不重排 · DIVERGED entry 跟
                  PROVED entry 共用同 sort order(time-based)</li>
                <li>每筆 DIVERGED 都永久留在{" "}
                  <Link href="/track-record" className="text-gold hover:underline underline-offset-4">公開戰績</Link>
                  · 標賽前機率與賽後實際結果 · 任何人可逐場核對</li>
                <li>不開「為什麼 diverged 解釋」excuse paragraph — 留空 ·
                  讓數字自己說話</li>
              </ul>

              {/* R138 W7 · Singularity Effect amplifier · Agent C R138 Runner-up 1 ·
                  Schelling 1968「The Life You Save May Be Your Own」 + Small/Loewenstein/
                  Slovic 2007「Sympathy and callousness: The impact of deliberative
                  thought on donations to identifiable and statistical victims」
                  (Org Behav Hum Decis Process 102:143-153)· Pratfall amplification
                  via named first-miss slot · 抽象「第一筆」 → identifiable「THE
                  FIRST MISS」 named entity · psychology mechanism · identifiable
                  victim donations rise 2x vs statistical victims · 此 slot 是
                  訪客 emotional commitment 到 verify ZONE 27 publish-failure 承諾
                  · per [[feedback-zone27-pratfall-brand-ip]] axiom 強化 + per
                  [[feedback-zone27-psychology-ux-axis]] academic citation 守。 */}
              <div className="mt-5 pt-5 border-t border-loss/20">
                <p
                  lang="en"
                  className="font-mono text-loss/85 text-[9px] tracking-[0.3em] mb-2"
                >
                  RULE FOLLOWED · 規則已生效
                </p>
                <p className="text-mute text-sm leading-relaxed">
                  引擎已經失準過。 截至目前{" "}
                  <span className="font-mono text-bone bg-loss/10 px-2 py-0.5 border-b border-loss/40">
                    N={trackStats.total} · {trackStats.diverged} 筆 DIVERGED
                  </span>{" "}
                  —— 一筆都沒藏、沒撤、沒在 7 天內被新的蓋掉,全部按上面這條規則攤在{" "}
                  <Link href="/track-record" className="text-gold hover:underline underline-offset-4">
                    公開戰績
                  </Link>
                  。 規則寫在前、失準在後、照做不誤 —— 這就是「敢攤輸」跟「嘴上喊敢」唯一的差別。
                </p>
                <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed mt-3">
                  每一筆 DIVERGED 都按同一條規則處理 · 永遠不刪。
                </p>
              </div>
              <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed mt-3">
                本規則適用 engine v0.X 全部版本 · 修改需至少 30 天前公告 ·
                收進{" "}
                <Link
                  href="/corrections"
                  className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
                >
                  我們搞砸過的事
                </Link>
                。 先講好規則 · 比事後找理由解釋更可信。
              </p>
            </div>

            {/* R140 W6 · cross-link to /founders/postmortem-2028 sibling
                Pratfall surface · per Agent C R140 TOP placement「sibling to
                PRE-COMMIT」 · 6th Pratfall surface 平行 PRE-COMMIT 預期 first
                DIVERGED · Postmortem 預期 5 種 project-level death scenarios ·
                Klein 1998 + HBR 2007 prospective hindsight · brand IP「不藏
                未來可能 die 方式」 axiom 物理 codify。 */}
            <div className="mt-4 p-4 sm:p-5 border border-loss/30 bg-loss/[0.03]">
              <p
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.35em] mb-2"
              >
                ⚓ 我們可能怎麼失敗 · 自己先講
              </p>
              <p className="text-mute text-sm leading-relaxed">
                上面那條規則處理引擎第一筆失手 · 但整個 ZONE 27 本身也可能做不
                下去。 我們把對自己最狠的質疑、可能失敗的情境公開在{" "}
                <Link
                  href="/steelman"
                  className="text-loss/90 hover:text-loss underline-offset-4 hover:underline"
                >
                  /steelman
                </Link>
                。 願意先公開「自己可能怎麼死」這件事 · 明牌站不會做。
              </p>
            </div>
            <P className="text-mute/70">
              完整論證見{" "}
              <Link href="/manifesto" className="text-gold hover:underline">
                /manifesto
              </Link>{" "}
              · DISCLOSURE 只是 4 個倒置之一,其他 3 個(賺錢方式 · 覆蓋範圍 · 隱私)同樣公開。
            </P>
          </ReportSection>

          {/* ── 06 LOCAL STORAGE TRANSPARENCY · client-side state disclosure ── */}
          <ReportSection no="06" label="LOCAL STORAGE TRANSPARENCY">
            <P>
              ZONE 27 把資料存在你自己的瀏覽器裡 ·{" "}
              <strong className="text-bone">0 追蹤 cookie · 0 寫到我們伺服器 · 0 個資外傳</strong>
              (維持登入用的 cookie 是例外,下面會明講)。
              打開瀏覽器的開發者工具看本機儲存
              · 你看到的項目跟下表一模一樣 · 我們不藏。
            </P>
            <P className="text-mute/80">
              <strong className="text-bone">登入用的 cookie 說明</strong>:
              登入後系統會在本站設 2 個 cookie
              (一個登入憑證、一個用來續期)· 用來讓你保持登入狀態 ·
              登出就刪。 不追蹤 · 不送第三方 ·
              不建個資清單(只存一段你看不懂的登入憑證)。 你可以打開
              瀏覽器的開發者工具自己查。
            </P>

            <LocalStorageReceipt variant="audit" />

            <P className="text-mute/70 mt-3">
              <strong className="text-bone">⚓ 我們修正過的紀錄</strong> ·
              這張表剛上線時 6 個項目有 3 個寫錯 · 1 個是憑空捏造的 · 1 個漏掉 ·
              自己用站時發現、立刻改正 · 不藏錯 · 公開記在這裡。
              這件事也收進{" "}
              <Link href="/corrections" className="text-gold underline-offset-4 hover:underline">
                我們搞砸過的事
              </Link>
              (集中認錯頁)。
            </P>
            <P className="text-mute/70">
              <strong className="text-bone">不存在本機的</strong>:你寫的比賽筆記
              是登入後存在帳號裡、同步到伺服器 ·
              不在本機 · 此表不列(不藏 · 不假裝)。
              你追蹤的比賽同樣存在帳號裡,不在本機。
            </P>

            <P className="text-mute/70 mt-4">
              要清除這些本機資料完全是你的選擇:在瀏覽器的開發者工具裡
              按「Clear」 · 或用瀏覽器的「清除網站資料」 一鍵清掉全部 ZONE 27
              的本機資料。 我們{" "}
              <strong className="text-bone">不會</strong>{" "}
              在你清掉之後偷偷再寫回去 · 不會在伺服器留備份 · 不會用
              追蹤技術還原 — 因為我們從頭到尾就沒在伺服器留過你的資料。
            </P>

            <P className="text-mute/70">
              修改這份本機資料的公開規則需 30 天前公告 ·
              同 /audit Section 05 事先公開的承諾 · 每加一個新的本機資料項目時
              此表都必須同步更新 · 對不上 = 品牌自殺。
            </P>
          </ReportSection>

          {/* ── 07 ENGINE v0.3 ESTIMATION DISCLOSURE · per engine version disclose ── */}
          <ReportSection no="07" label="ENGINE v0.3 ESTIMATION DISCLOSURE">
            <P>
              第 2 號引擎 v0.3 已經是開發預覽版(之後會在
              /lab 開放讓你自選試用)。 v0.3 = v0.2 主引擎 + 球場因素對全壘打率的
              修正 · 估算方法公開如下:
            </P>

            <DataTable>
              <DataRow
                label="v0.3 基礎"
                value="完全沿用 v0.2"
                note="K/9 + BB/9 + HR/9 + 打席機率 100% 沿用同一顆引擎 · 每一版永久保留"
              />
              <DataRow
                label="v0.3 新增 · 球場因素"
                value="HR rate × (1 + Δ/9.5 × 0.5)"
                note="保守敏感度 0.5 · 估計值 · 用 4 個主場的得分環境推算 · v0.4 會拆得更細"
              />
              <DataRow
                label="v0.3 還沒做"
                value="場內球安打率 · 外野尺寸 · 風阻"
                note="v0.3 只調全壘打率 · v0.4 會再加場內球安打率、外野距離、天氣"
              />
              <DataRow
                label="v0.3 特殊情況"
                value="球場不明 → 退回 v0.2"
                note="球場不在那 4 個主場資料裡時 · 就老實退回 v0.2 · 不假裝有資料"
              />
            </DataTable>

            <P className="text-mute/70 mt-4">
              v0.3 的賽前預測會跟 v0.2 一起記在{" "}
              <Link href="/track-record" className="text-gold hover:underline">
                /track-record
              </Link>{" "}
              · 每一筆都標清楚是哪一版引擎算的 · 等每一版各滿 30 場已對帳的比賽
              後{" "}
              <Link href="/calibration" className="text-gold hover:underline">
                /calibration
              </Link>{" "}
              會公開 v0.2 跟 v0.3 的實際準度對照 · 才決定要不要把 v0.3 設成預設
              (我們答應過:
              <strong className="text-bone">每一版永久保留、不會偷偷換掉</strong>)。
            </P>

            <P className="text-mute/70">
              引擎 v0.3 方法完整公開於{" "}
              <Link
                href="/methodology/diff"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology/diff
              </Link>
              {" "}· 逐行 diff 攤出 v0.2 → v0.3 改了什麼
              · 30 分鐘理解 · 見 /methodology Section 04 ENGINE LINEUP。
            </P>
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

            <p className="mt-12 font-mono text-mute text-[10px] tracking-[0.25em]">
              本頁堅持零行銷語言原則
            </p>

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

        <FounderSignOff>
          <p>
            我把整個引擎攤在這裡 · 不是因為它完美 ·
            是因為我相信<strong>公開錯誤比藏起來更值得</strong>。
          </p>
          <p>
            上面 ESTIMATION DISCLOSURE 那一段 · 是寫程式時跟自己拉鋸出來的
            「我們現在做不到什麼」清單 · 寫進來反而踏實。
          </p>
          <p>
            您比我更懂的話 · 歡迎寫信告訴我哪裡該修。
          </p>
        </FounderSignOff>

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

function DataTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full text-sm font-mono border-collapse my-2">
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
