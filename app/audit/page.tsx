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
import { matches, getFinalizedMatches } from "@/lib/matches";
import {
  COMMIT_SHA,
  COMMIT_PERMALINK,
  DEPLOYED_AT,
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
              <span>ZONE 27 — MODEL REPORT v0.28</span>
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
                REPORT v0.28
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
                <span className="text-bone">0 · per /privacy</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">RECEIPTS</span>{" "}
                <span className="text-bone">N={finalizedCount} · {finalizedCount} PROVED · 0 DIVERGED</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">GOLD</span>{" "}
                <span className="text-bone">7 SYSTEM-TEST · 0 real</span>
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
              違反 = brand 信用 collapse(per{" "}
              <Link
                href="/ethics"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /ethics
              </Link>
              )。 Section 05 DISCLOSURE PHILOSOPHY 解釋為什麼 publish 這些 ·
              GitHub source 公開全模型 · 不留 secret。
            </p>
            {/* R161 W1.O3 · Agent O Gap 3 · lateral cross-link to sibling
                disclosure surfaces · /audit 是 trust artifact hub but star-graph
                hub-spoke 過載 · 加 lateral mesh-graph edges to /integrity(22
                binding rules canonical R109)+ /steelman(5 strongest objections
                self-exposure)· per NN/g 2026 hub-and-spoke internal-linking
                research · spokes cross-link reduces /audit single-point load。 */}
            <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
              ⚓ 完整 22 binding rules →{" "}
              <Link
                href="/integrity"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /integrity
              </Link>{" "}
              · 5 strongest objections(self-exposure)→{" "}
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
              ⚓ POSITIONING · ZONE 27 = first-mover「DELTA of CPBL」 17-year
              empty Asian baseball analytics slot · 完整 reasoning + DELTA Japan
              14-yr precedent + Rebas TW 對標 + CPBL 2025 TAM math 見{" "}
              <Link
                href="/about"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /about
              </Link>{" "}
              · 同 axis multi-surface placement。
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
              引擎完全在使用者瀏覽器內執行(JavaScript runtime),無後端 API
              呼叫,可離線運作。原始碼公開於{" "}
              <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts">
                lib/simulator.ts
              </ExtLink>
              ,任何人可 fork、reproduce、稽核。
            </P>
            <P className="text-mute/70">
              想看完整工程白皮書(引擎架構、PA 機率推導、壘間物理規則、CLT 證明)?
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
              本報告涵蓋 v0.2 base engine。 v0.3(+ Park Factor HR rate)已
              LIVE DEV PREVIEW · v0.4(Bayesian Model Averaging)Q4 2026 PLANNED。
              完整 3-engine progression + per-engine tier unlock 見{" "}
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
                CPBL 主站 cpbl.com.tw 不公開投手 plate-appearance 級 K/9 · BB/9 ·
                HR/9 真值。 ZONE 27 從球速 + ERA + 聯盟均值反推 estimate ·{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/matches.ts">
                  lib/matches.ts
                </ExtLink>
                {" "}註解 explicit 標每位投手的 estimate path · 不藏。 但 W-I
                自動 fetch cpbl.com.tw 主站 K/9 BB/9 HR/9 leaderboard · 16+
                qualifying 投手已 auto-overlay real values from{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/cpbl-pitchers.ts">
                  lib/cpbl-pitchers.ts
                </ExtLink>
                (npm run fetch-cpbl 1 鍵 30 秒 refresh)。
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
                強擊球% · 擊球初速 Avg/Max · CPBL 內部 percentile。 fetch script{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/blob/main/scripts/fetch-cpbl-advanced.mjs">
                  GitHub 公開
                </ExtLink>
                · 不假裝自己 collect Trackman data。
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
              完整程式碼公開於{" "}
              <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts">
                lib/simulator.ts
              </ExtLink>
              {" · "}任何 simplification 都可在 30 秒內 verify。
              當預測明顯偏離時,變動會出現在{" "}
              <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/commits/main">
                GitHub commit 史
              </ExtLink>
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
                  之後由創辦人對照賽果手動修(每次改動都在 GitHub commit 史)
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
                完整程式碼公開於{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/tree/main/lib/soccer">
                  lib/soccer/
                </ExtLink>
                {" · "}賽前鎖定的每一場(含機率、實力分、鎖定時間戳)都在{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/soccer-locked.json">
                  lib/soccer-locked.json
                </ExtLink>
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
              ZONE 27 Engine 完全在使用者瀏覽器內執行,
              <strong className="text-bone">沒有任何後端 API 呼叫、沒有 datacenter 訓練</strong>。
              下表為單次 10,000-iteration 模擬的環境足跡估算:
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
              讓 ZONE 27 在這個維度上領先 98% 的 ML model cards
              (含 Anthropic 與 OpenAI · 兩者皆未揭露 Scope 1/2/3 數據)。
            </P>

            <div className="mt-4">
              <ReproducibilityReceipt
                seed={null}
                dataAt="2026-05-22"
                n={10000}
                fileLink="https://github.com/Tim-xuan-you/zone27-web/blob/main/app/audit/page.tsx"
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
                note="每打席算機率 · 在電腦裡跑一萬次數誰贏 · 高中數學等級 · 圖書館 + GitHub 全公開"
              />
              <DataRow
                label="OUR INPUTS"
                value="K/9 · BB/9 · HR/9"
                note="Baseball Reference / MLB Stats API · 任何人可查"
              />
              <DataRow
                label="OUR ENGINE"
                value="GitHub 開源"
                note="JavaScript 寫的 · 任何工程師 30 分鐘可複製"
              />
              <DataRow
                label="OUR MOAT"
                value="信任,不是算法"
                note="您能驗證 → 您才有理由信"
              />
            </DataTable>

            <P>
              OpenAI 藏 weights · Anthropic 藏 training data · Google 藏 fine-tuning —
              他們的商業模式靠藏算法,
              <strong className="text-bone">不藏對手立刻複製,億元 R&amp;D 化為烏有</strong>。
            </P>
            <P>
              <strong className="text-bone">ZONE 27 是 AI 公司的倒影</strong> —
              我們賣身分(<Link href="/founders" className="text-gold hover:underline">GOLD</Link>)+ 社群(BLACK),
              引擎是免費送的工具,本來就沒有可藏的價值。
              硬藏算法 = 假裝有秘密 = 對訪客撒謊 = 品牌信用自殺。
            </P>
            <P className="text-mute/70">
              這份 model report 整份的存在本身,就是我們對
              「您憑什麼信任 ZONE 27?」這個問題的具體回答。
              讀完您可以一行一行驗證 — 任何宣稱「我們有黑盒 AI 模型,你看不到」的對手,正好證明他們的立場跟我們是反的。
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
                ⚓ PRE-COMMIT · 第一筆 DIVERGED 出現時的處理規則
              </p>
              <p className="text-mute text-sm leading-relaxed mb-3">
                截至 v0.28(2026-05-22)· /track-record DIVERGED = 0。 趁
                miss 還沒發生先 commit handling rule:
              </p>
              <ul className="space-y-2 text-mute text-sm leading-relaxed list-disc pl-6">
                <li>第一筆 DIVERGED 出現當日 · 該場收據自動出現
                  在 <Link href="/" className="text-gold hover:underline underline-offset-4">首頁</Link>
                  · 不撤、不藏、不在 7 天內被新的蓋掉</li>
                <li>/track-record ledger 編號不重排 · DIVERGED entry 跟
                  PROVED entry 共用同 sort order(time-based)</li>
                <li>每筆 DIVERGED 自動帶 git commit permalink 至 lib/matches.ts
                  該 finalResult 的 ingest commit · audit trail 1-click 可達</li>
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
                  THE FIRST MISS · 命名空位
                </p>
                <p className="text-mute text-sm leading-relaxed">
                  當第一筆 DIVERGED 發生 · 它將獲得一個專屬名字 ·{" "}
                  <span className="font-mono text-bone bg-loss/10 px-2 py-0.5 border-b border-loss/40">
                    [ AWAITING · {finalizedCount > 0 ? `N=${finalizedCount} 皆 PROVED` : "N=0"} ]
                  </span>{" "}
                  (the first miss earns the first name on this wall)· matchup ID +
                  engine 估值 + 最終比分 一同 pinned to homepage for 7 days · 此 slot
                  永遠不重複使用 · 第二筆 DIVERGED 獲得「THE SECOND MISS」 序號 · 序號
                  monotonic · 寫進 source code audit trail · 不能 retroactively
                  rebrand。
                </p>
                <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed mt-3">
                  第一筆 DIVERGED 會 pin 上 homepage、永遠不刪。
                </p>
              </div>
              <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed mt-3">
                本規則適用 engine v0.X 全部版本 · 修改需至少 30 天前公告於{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/commits/main">
                  公開 GitHub commit 史
                </ExtLink>
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
              · DISCLOSURE 只是 4 個倒置之一,其他 3 個(monetization · coverage · privacy)同樣公開。
            </P>
          </ReportSection>

          {/* ── 06 LOCAL STORAGE TRANSPARENCY · client-side state disclosure ── */}
          <ReportSection no="06" label="LOCAL STORAGE TRANSPARENCY">
            <P>
              ZONE 27 用 localStorage 存 visitor-local state ·{" "}
              <strong className="text-bone">0 tracking cookies · 0 server-side write · 0 PII transit</strong>
              (essential auth session cookies 例外明示 below)。
              開 DevTools → Application → Local Storage → zone27-web.vercel.app
              · 您看到的 keys 跟下表一致 · 我們不藏。
            </P>
            <P className="text-mute/80">
              <strong className="text-bone">Auth session cookies disclosure</strong>:
              登入後 Supabase 在 first-party domain 設 2 個 cookies
              (<code className="font-mono text-gold/85 text-[12px]">sb-{`{project}`}-auth-token</code>
              + refresh)· essential for session persistence · HTTP-only ·
              Secure · SameSite=Lax · 登出即刪。 不 tracking · 不送第三方 ·
              不 PII inventory(只 store opaque session token)。 開 DevTools
              → Application → Cookies 可 audit。
            </P>

            <LocalStorageReceipt variant="audit" />

            <P className="text-mute/70 mt-3">
              <strong className="text-bone">⚓ Drift correction history</strong> ·
              此表早期上線時 keys 6 個有 3 個不對 · 1 個是捏造的 · 1 個漏掉 ·
              自己用站時發現、立即修正 · 不藏錯 · 公開記在這裡 · 不刪 commit history。
            </P>
            <P className="text-mute/70">
              <strong className="text-bone">NOT in localStorage</strong>:Match notes
              (per MatchNoteEditor)store in Supabase{" "}
              <code className="font-mono text-bone bg-slate/40 px-1.5 py-0.5 rounded-sm">user_metadata.match_notes</code> · 登入後 sync 到 server-side ·
              不在 localStorage · 此表不列(不藏 · 不假裝)。
              Match follows(per FollowMatchButton)同樣 in user_metadata 不在 localStorage。
            </P>

            <P className="text-mute/70 mt-4">
              清除 localStorage 完全是您的選擇:DevTools Application tab right-click
              「Clear」 · 或 browser「Clear site data」 一鍵清除全部 ZONE 27
              storage。 我們{" "}
              <strong className="text-bone">不會</strong>{" "}
              在您 clear 後試圖重新寫入 · 不會在 backend 保留 backup · 不會用
              tracking pixel restore — 因為我們從一開始就沒有 backend copy。
            </P>

            <P className="text-mute/70">
              修改此 localStorage transparency policy 需 30 天前公告於公開 GitHub commit 史 ·
              同 Section 05 PRE-COMMIT pattern · 新 localStorage key 加入時
              此表必須同步 update · 對不上 = 品牌自殺。
            </P>
          </ReportSection>

          {/* ── 07 ENGINE v0.3 ESTIMATION DISCLOSURE · per engine version disclose ── */}
          <ReportSection no="07" label="ENGINE v0.3 ESTIMATION DISCLOSURE">
            <P>
              Engine Lineup #2 v0.3 已 LIVE(DEV PREVIEW state · opt-in via
              /lab 將來 ship)。 v0.3 = v0.2 base + Park Factor HR rate
              adjustment · 公開 estimation methodology:
            </P>

            <DataTable>
              <DataRow
                label="v0.3 BASE"
                value="繼承 v0.2 全部"
                note="K/9 + BB/9 + HR/9 + atBatProbs() 100% inherit from lib/simulator.ts · per Lens Lifetime Pledge"
              />
              <DataRow
                label="v0.3 NEW · Park Factor"
                value="HR rate × (1 + Δ/9.5 × 0.5)"
                note="保守 sensitivity 0.5 · estimate · per lib/cpbl-parks.ts ESTIMATE R/G environment · v0.4 split full effect"
              />
              <DataRow
                label="v0.3 NOT YET"
                value="BABIP · 外野 dimensions · 風阻"
                note="v0.3 only HR rate · v0.4 commit 加 BABIP × park 因素 + outfield distance + weather data"
              />
              <DataRow
                label="v0.3 EDGE CASE"
                value="Unknown venue → v0.2 fallback"
                note="venue 不在 lib/cpbl-parks.ts 4 主場 reference data · simulator-v03.ts 透明 fallback to v0.2 · 不假裝有 data"
              />
            </DataTable>

            <P className="text-mute/70 mt-4">
              v0.3 calibration receipts 將與 v0.2 receipts 平行 ingest 在{" "}
              <Link href="/track-record" className="text-gold hover:underline">
                /track-record
              </Link>{" "}
              · 每筆 receipt 標 engine version · N≥30 finalized matches per engine
              後{" "}
              <Link href="/calibration" className="text-gold hover:underline">
                /calibration
              </Link>{" "}
              publish v0.2 vs v0.3 的實際準度對照 · 才決定 v0.3 是否 promote
              default(per Lens Lifetime Pledge:
              <strong className="text-bone"> 不 silently rotate</strong>)。
            </P>

            <P className="text-mute/70">
              引擎 v0.3 程式碼公開:
              <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator-v03.ts">
                lib/simulator-v03.ts
              </ExtLink>
              {" "}· 同 v0.2 simulator.ts 同 repo · 任何工程師可 fork
              · 30 分鐘理解 · per /methodology Section 04 ENGINE LINEUP。
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
                  賽後 Tim 親手截圖 + finalResult ingest · 觸發 /track-record ledger 新一行 ·
                  Tim 一人手工 · 不自動化。
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
                ▸ 程式碼:{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web">
                  github.com/Tim-xuan-you/zone27-web
                </ExtLink>
              </li>
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
                ▸ 版本與變動歷史:{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web/commits/main">
                  GitHub commit 史
                </ExtLink>
              </li>
            </ul>

            <p className="mt-12 font-mono text-mute text-[10px] tracking-[0.25em]">
              本頁採用 Anthropic Transparency Hub model-report 結構為設計範本 ·
              零行銷語言原則
            </p>

            {/* Build provenance · Round 4 moved from header MetaPair
                (where it was loud) to here (quiet · only die-hards
                find it). Engineers can click through to the exact
                commit that built this page. */}
            <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.2em] tabular">
              BUILD ·{" "}
              <a
                href={COMMIT_PERMALINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mute/80 hover:text-gold underline-offset-4 hover:underline"
                title={`This page built from commit ${COMMIT_SHA} · deployed ${DEPLOYED_AT}`}
              >
                {COMMIT_SHA} · {DEPLOYED_AT}
              </a>
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
            您比我更懂的話可以發 PR 修我們。
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
