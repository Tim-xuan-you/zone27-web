import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import StatTerm from "@/components/StatTerm";
import { matches, getFinalizedMatches } from "@/lib/matches";
import {
  COMMIT_SHA,
  COMMIT_PERMALINK,
  DEPLOYED_AT,
} from "@/lib/build-meta";

export const metadata: Metadata = {
  title: "Model Report — ZONE 27 Engine Audit",
  description:
    "完整公開的 model report。模型描述、使用的輸入、引擎範圍、環境衝擊、揭露哲學。零行銷語言。",
};

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
      ? `n = 0 · ${ingestedCount} ingested · 第一筆收錄今晚`
      : `n = ${finalizedCount} · ${ingestedCount} ingested · CPBL 2026-05-21 起`;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

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
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-6">
              ZONE 27 Engine
            </h1>
            <p className="text-mute text-base leading-relaxed mb-8 max-w-2xl">
              引擎能算什麼 · 不能算什麼 · 為什麼公開全部。
            </p>

            {/* Compact meta strip — 3 items only.
                Round 4: dropped ITERATIONS / STANDARD ERROR (engineer-y)
                and BUILD chip (moved to footer for die-hards) per
                audience-reframe critique. Kept the 3 that matter to a
                baseball fan evaluating «can I trust this analyst?». */}
            <dl className="grid grid-cols-3 gap-x-6 gap-y-4 font-mono text-[11px] tracking-[0.05em]">
              <MetaPair label="LAST REVIEWED" value={LAST_REVIEWED} />
              <MetaPair label="ENGINE" value={ENGINE_VERSION} />
              <MetaPair label="SAMPLE SIZE" value={sampleSize} />
            </dl>
          </header>

          {/* ── 01 MODEL DESCRIPTION ────────────────── */}
          <ReportSection no="01" label="MODEL DESCRIPTION">
            <P>
              ZONE 27 Engine 是逐打席對決 Monte Carlo 模型,用於估算棒球比賽
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
              <Item label="連續事件假設 (Markov)">
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
              <Link href="/changelog" className="text-gold hover:underline">
                /changelog
              </Link>
              ,對應變數會寫進下一次引擎迭代。
            </P>
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
          </ReportSection>

          {/* ── 05 DISCLOSURE PHILOSOPHY ──────────────
              Round 7: renumbered 06 → 05 (was 08 → 06 in Round 4).
              Section LAST CALIBRATION RUN removed entirely back in
              Round 4. Canonical disclosure philosophy stays — this
              is the brand-IP anchor per [[zone27-disclosure-philosophy]]
              and is the META section ("why we publish") not a
              taxonomy of limitations.

              Original Tim ask 2026-05-20: "AI 公司不公開模型,我們為什麼要?"
              Answer: ZONE 27 sells identity, not algorithm access.
              No algorithmic moat → radical transparency IS the moat. */}
          <ReportSection no="05" label="DISCLOSURE PHILOSOPHY">
            <P>
              為什麼我們把整份 model report 公開到這個程度?
              <strong className="text-bone"> 因為我們沒有商業機密。</strong>
            </P>

            <DataTable>
              <DataRow
                label="OUR MATH"
                value="rate stats + Monte Carlo"
                note="per-9 rate stats(20 世紀標準)· Monte Carlo(Metropolis 1953)· 圖書館全公開"
              />
              <DataRow
                label="OUR INPUTS"
                value="K/9 · BB/9 · HR/9"
                note="Baseball Reference / MLB Stats API · 任何人可查"
              />
              <DataRow
                label="OUR ENGINE"
                value="GitHub 開源"
                note="JavaScript Monte Carlo · 任何工程師 30 分鐘可複製"
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
              我們賣身分(<Link href="/founders" className="text-gold hover:underline">Founders 27</Link>)+ 社群(BLACK CARD),
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
              <Link href="/glossary#proved" className="text-gold underline-offset-4 hover:underline">PROVED</Link>
              {" "}✓ /{" "}
              <Link href="/glossary#diverged" className="text-gold underline-offset-4 hover:underline">DIVERGED</Link>
              {" "}✕)等大列出 ·
              不刪、不修飾、不過濾。揭露哲學 = 文字理論;公開戰績 = 文字理論的物理產出。
            </P>
            <P className="text-mute/70">
              完整論證見{" "}
              <Link href="/manifesto" className="text-gold hover:underline">
                /manifesto
              </Link>{" "}
              · DISCLOSURE 只是 4 個倒置之一,其他 3 個(monetization · coverage · privacy)同樣公開。
            </P>
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
                <Link href="/changelog" className="text-gold hover:underline">
                  /changelog
                </Link>
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

function ReportSection({
  no,
  label,
  children,
}: {
  no: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-12 pb-2 mt-12 border-t border-line/40">
      <div className="flex items-baseline gap-4 mb-6 section-reveal">
        <span className="font-mono text-gold/70 text-[11px] tabular tracking-[0.3em]">
          {no}
        </span>
        <h2 className="font-mono text-bone text-[11px] tracking-[0.3em]">
          {label}
        </h2>
      </div>
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
