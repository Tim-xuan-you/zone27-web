import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";
import EngineStamp from "@/components/EngineStamp";
import ReproducibilityReceipt from "@/components/ReproducibilityReceipt";
import LedgerDeltaChip from "@/components/LedgerDeltaChip";
import TeamPickPanel from "@/components/TeamPickPanel";
import MyTeamTrackRecord, { type MyTeamMatch } from "@/components/MyTeamTrackRecord";
import CalibrationProgressBar from "@/components/CalibrationProgressBar";
import QuietHandoffCard from "@/components/QuietHandoffCard";
import SilentReceiptStream from "@/components/SilentReceiptStream";
import {
  matches,
  getFinalizedMatches,
  getCalibration,
  getEnginePctOnWinner,
  getMatchDateIso,
  getTodayTaipei,
  type Match,
} from "@/lib/matches";

export const metadata: Metadata = {
  title: "公開戰績 · ZONE 27 引擎預測 vs 實際結果",
  description:
    "ZONE 27 引擎所有公開預測的賽後追蹤。PROVED 跟 DIVERGED 等大等亮地列出 — 不刪、不修飾、不過濾。多數運動分析平台選擇藏起這頁;ZONE 27 把它放在 footer 主導航。",
};

// ── ISR · re-render daily so today's match flips to FINAL when
// Tim ingests box score · without full redeploy.
export const revalidate = 86400;

export default function TrackRecordPage() {
  const finalized = getFinalizedMatches();
  const proved = finalized.filter((m) => getCalibration(m) === "proved").length;
  const diverged = finalized.filter(
    (m) => getCalibration(m) === "diverged"
  ).length;
  const push = finalized.filter((m) => getCalibration(m) === "push").length;
  const decided = proved + diverged;
  const provedPct = decided > 0 ? Math.round((proved / decided) * 100) : null;

  // Matches that ran but never had a final ingested — visible debt.
  // Brand-honest: surface this gap rather than silently skipping it.
  // Uses getTodayTaipei() (Asia/Taipei) — same source-of-truth as
  // every other date comparison in the codebase. Earlier draft used
  // raw UTC slice which drifts up to 8 hours behind Taipei wall
  // clock, causing morning-Taipei renders to misclassify yesterday's
  // unfiled matches.
  const todayTaipei = getTodayTaipei();
  const unfiledArchived = matches.filter((m) => {
    if (m.finalResult) return false;
    const iso = getMatchDateIso(m);
    if (!iso) return false;
    return iso < todayTaipei;
  }).length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-12">
        {/* Round 18 motion polish · section-reveal scroll-driven gold
            hairline draws under the kicker. Native CSS · 0 JS · auto
            prefers-reduced-motion safe via globals.css @media guard. */}
        <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em]"
          >
            / TRACK RECORD · 公開戰績
          </p>
          {/* Round 29 Wave 7 polish · N=0 waiting state gets subtle shimmer +
              gold/60 stronger border · signals「第一筆 pending · 不藏 waiting
              state」 visual continuity with EmptyLedger below。Once N≥1 the
              shimmer drops and border softens(no-longer-waiting · earned state)。 */}
          <span
            lang="en"
            className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
              finalized.length === 0
                ? "border-gold/60 text-gold shimmer glow-gold"
                : "border-gold/40 text-gold/80"
            }`}
            title={
              finalized.length === 0
                ? "這頁從 N=0 開始 · 沒有 cherry-picked 歷史 · 沒有 backdated 入帳 · 第一筆預定今晚收錄"
                : `N=${finalized.length} · ${finalized.length} receipt${finalized.length === 1 ? "" : "s"} ingested · 不刪不修飾`
            }
          >
            {finalized.length === 0 ? "WAITING · N=0" : `START · N=${finalized.length}`}
          </span>
          {/* Round 49 W-A · LedgerDeltaChip · Agent L R44 GAP-2 ship ·
              Endowment effect retention · returning visitor 看「+X since
              date」 客戶端 only · localStorage zone27_last_ledger_n_v1 ·
              0 server · 0 PII · per /audit S06 disclosure。 Only renders
              for non-first visits 同時 delta > 0。 */}
          <LedgerDeltaChip currentN={finalized.length} />
          {/* R80 W-A · /integrity rule #12 + #09 brand chip · CPBL-ONLY-
              FOREVER scope binding(rule 12)+ mandatory-ledger-no-cherry-
              pick discipline binding(rule 9)· 配對 close brand IP loop ·
              visible at top fold · 同 Berkshire Owner's Manual annual letter
              opening line pattern。 */}
          <Link
            href="/integrity"
            className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-loss/40 text-loss/85 hover:border-loss/70 hover:text-loss transition-colors"
            title="/integrity rule 12 + 9 · CPBL ONLY · 0 cherry-pick · 0 retroactive delete · binding"
          >
            CPBL ONLY · 永久 · 0 CHERRY-PICK
          </Link>
        </div>
        <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
          每一場引擎的公開預測 · 賽後實際結果在這
        </h1>
        <p className="mt-6 text-mute leading-relaxed max-w-2xl">
          ZONE 27 引擎賽前在 <Link href="/matches" className="text-gold underline-offset-4 hover:underline">/matches</Link>
          {" "}+ <Link href="/" className="text-gold underline-offset-4 hover:underline">首頁 HeroLiveCard</Link>
          {" "}公開鎖定一個機率分布(N=10K Monte Carlo)。
          賽後 Tim 親手截圖最終比分 → 解析後加進此表 →{" "}
          <span className="text-bone">PROVED ✓ 跟 DIVERGED ✕ 等大等亮列出</span>,
          不藏、不修飾、不重新加權。
        </p>
        {/* Round 51 W-B · Agent 3 missing cross-link #2 fix · 匿名訪客
            在 /track-record 看到 binary PROVED / DIVERGED · 不知道 reliability
            diagram(Brier score · 45° calibration curve)在哪。 全 site 公開
            /calibration page(non-member access)+ /member/calibration
            (logged-in personal mirror)· 此 hero 加 1-line 引導 surface
            兩條 path · per Agent 3 missing #2「anonymous can't reach
            /calibration」 修正不 strict · 因 /calibration 本身公開。 */}
        <p className="mt-3 font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.25em] leading-relaxed">
          想看完整 Brier score + reliability diagram?{" "}
          <Link
            href="/calibration"
            className="text-gold underline-offset-4 hover:underline transition-colors"
          >
            /calibration · 引擎自評 →
          </Link>
          {" "}(匿名可進 · 不需登入)
        </p>
        <div className="mt-6 mb-2">
          <ArticleMeta
            readingMin={3}
            sample={{ current: finalized.length, threshold: 30 }}
          />
        </div>
        {/* Round 31 Wave B · datestamped engine stamp · Vercel + Plausible
            pattern · 公開戰績頁 + build commit permalink = audit trail 一鍵
            可達 · 對齊 brand IP「方法公開·品味私藏」 + /audit BUILD chip。 */}
        <div className="mt-3">
          <EngineStamp />
        </div>

        {/* Round 43 W-A · ReproducibilityReceipt drop-in · /track-record
            count of finalized matches · per IJCAI 2026 standard · git+seed+
            n+dataAt audit trail · component drop-in pattern from R42。 */}
        <div className="mt-3">
          <ReproducibilityReceipt
            compact
            seed={null}
            dataAt="2026-05-22"
            n={finalized.length}
            fileLink="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/matches.ts"
          />
        </div>

        {/* Round 31 Wave N · TeamPick personalization · 「對你(這個富邦
            球迷)說話 · 不對球迷說話」 fan grammar match · per critic-hardening
            agent W-G ONE deepest call · 0 cookie / 0 server / 0 PII /
            純 localStorage z27_team。 */}
        <div className="mt-5 flex items-baseline justify-between flex-wrap gap-3">
          <TeamPickPanel variant="header" />
        </div>

        {/* Round 31 Wave N · personal counter · 您支持的隊 N=X · ✓Y ✕Z
            · 只在 myTeam 已選後 render(client-hydrate) */}
        <MyTeamTrackRecord matches={buildMyTeamMatches(finalized)} />

        <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
          多數運動分析平台選擇藏起這頁 · ZONE 27 把它放在 footer 主導航 · 公開戰績是品牌的物理證據。
        </p>
      </section>

      <div className="mx-auto max-w-5xl w-full px-6 sm:px-10 mb-12">
        <div className="w-full h-px bg-line/60" />
      </div>

      {/* R90 simplification · STAT LITERACY DISCLOSURE box 從 3 段 →
          1 line · 學術 Texas sharpshooter fallacy 教育 cut · 純 honest
          disclaimer + /member/calibration cross-link · 600 → 1 line · 同
          Tim「都是字 · 不必要的資訊」 mandate · brand IP「Pratfall」 守住
          但 visitor cognitive load 大幅 cut · 細節可在 /methodology 深 dive。 */}
      {finalized.length > 0 && finalized.length < 30 && (
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
          <p className="font-mono text-loss/85 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚠ N &lt; 30 · PROVED 數字 surface 方向命中 · NOT 機率校準 ·{" "}
            <Link
              href="/member/calibration"
              className="text-gold hover:underline underline-offset-4"
            >
              /member/calibration reliability diagram
            </Link>{" "}
            等 N≥30 才有統計意義。
          </p>
        </section>
      )}

      {/* ── HEADLINE STATS ───────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-slate/40 border border-line/70 p-6 sm:p-8">
          <LedgerStat label="TOTAL · 已收錄" value={String(finalized.length)} />
          <LedgerStat
            label="PROVED · 引擎言中"
            value={String(proved)}
            tone="gold"
          />
          <LedgerStat
            label="DIVERGED · 引擎落空"
            value={String(diverged)}
            tone="loss"
          />
          <LedgerStat
            label="PROVED RATE · 言中比例"
            value={provedPct === null ? "—" : `${provedPct}%`}
            small={provedPct === null}
            tone={
              provedPct === null
                ? "mute"
                : provedPct >= 60
                ? "gold"
                : provedPct >= 50
                ? "bone"
                : "loss"
            }
          />
        </div>
        <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
          {finalized.length === 0 && (
            <span>
              ⚠ 樣本數 0 · 第一筆 entry 預定今晚 (2026-05-21) cpbl-260521-01
              統一 vs 富邦 賽後收錄 · 請明天回來
            </span>
          )}
          {finalized.length > 0 && finalized.length < 30 && (
            <span>
              ⚠ 樣本數小 · N={finalized.length} · 任何 PROVED rate
              皆受 sample bias 影響大 · 建議至少 N≥30 才有統計意義 · 完整
              calibration 方法見 <Link href="/methodology" className="text-gold hover:underline">/methodology</Link>
            </span>
          )}
          {finalized.length >= 30 && (
            <span>
              N≥30 · sample 進入 statistically meaningful 區間 · 完整
              calibration 方法見 <Link href="/methodology" className="text-gold hover:underline">/methodology</Link>
            </span>
          )}
          {push > 0 && (
            <>
              {" · "}{push} PUSH(平局或 50/50 無 favorite)
            </>
          )}
        </p>
      </section>

      {/* R66 W-B · Agent psychology ship #3 · Goal Gradient effect(Hull 1932 ·
          Kivetz/Urminsky/Zheng 2006)applied to N≥30 statistical-meaningfulness
          threshold。 NEW CalibrationProgressBar mounted ABOVE LEDGER · honest
          progress · 不裝 head-start · transparent statistics literacy · 不
          streak farm · pure pratfall surface that naturally accelerates
          motivation as N approaches 30。 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-4">
        <CalibrationProgressBar totalN={finalized.length} />
      </section>

      {/* ── LEDGER ROWS ──────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
        <p
          lang="en"
          className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-8 section-reveal"
        >
          / LEDGER · NEWEST FIRST · 不刪不修飾
        </p>

        {finalized.length === 0 ? (
          <EmptyLedger />
        ) : finalized.length === 1 ? (
          // Round 29 Wave 5A · First Receipt cinematic. When N=1 the
          // single ledger entry is rendered with elevated treatment ·
          // gold 2px border · "★ FIRST RECEIPT · 29 MORE TO N=30"
          // band · larger verdict visual · slow gold glow. This is
          // designed for tonight's cpbl-260521-01 ingest moment ·
          // the physical brand-IP event of the week.
          // PROVED and DIVERGED get equal visual weight per axiom ·
          // no emoji / no celebration animation that biases toward
          // PROVED outcome.
          <>
            <FirstReceiptHero
              match={finalized[0]}
              totalN={finalized.length}
            />
            {/* R68 W-E · Agent A SHIP 6 · QuietHandoffCard · Bloomberg
                Terminal MSG「send to one user」 pattern · mailto-only
                forces 1-to-1 email medium · 「ONE friend not 1000
                broadcast」 framing · distinct from ReceiptForwardButton
                (Web Share API broadcast)· coexist on same finalized
                match section · Stratechery/FanGraphs Premium/Athletic
                research: 70%+ paid conversion via private email recs。 */}
            <div className="mt-4">
              <QuietHandoffCard match={finalized[0]} />
            </div>
          </>
        ) : (
          // R63 W-B · Pokemon TCG 1st Edition mechanic permanent pinning
          // · per R60 W-B 「CARD 001 / ∞ · REPRINT POLICY 0」 axiom · 「the
          // first card always retains 1st Edition prestige · even at N=100」。
          // Sort by ingestedAt ascending · oldest first ingested = 1st Edition
          // · render pinned FirstReceiptHero ABOVE ledger table · then render
          // ledger of subsequent receipts(excluding the founding card)。
          // Without this · N≥2 transition silently strips 1st Edition prestige
          // = brand IP regression。 此 fix 確保 cpbl-260521-01 永遠 elevated。
          (() => {
            const sortedByIngest = [...finalized].sort((a, b) =>
              (a.finalResult?.ingestedAt ?? "").localeCompare(
                b.finalResult?.ingestedAt ?? ""
              )
            );
            const foundingReceipt = sortedByIngest[0];
            const subsequentReceipts = finalized.filter(
              (m) => m.id !== foundingReceipt?.id
            );
            return (
              <>
                {foundingReceipt && (
                  <div className="mb-10">
                    <FirstReceiptHero
                      match={foundingReceipt}
                      totalN={finalized.length}
                      pinned
                    />
                    {/* R68 W-E · QuietHandoffCard mounted under pinned
                        FirstReceiptHero · same Bloomberg one-to-one
                        pattern · founding receipt is highest-share-
                        intent moment per agent A research。 */}
                    <div className="mt-4">
                      <QuietHandoffCard match={foundingReceipt} />
                    </div>
                  </div>
                )}
                <div className="border border-line/70">
                  {/* Bloomberg-style table header · hidden on mobile (stacked cards below) */}
                  <div
                    className="hidden lg:grid grid-cols-[110px_1fr_120px_140px_110px_50px] gap-3 px-5 py-3 bg-slate/50 border-b border-line/60 font-mono text-mute text-[9px] tracking-[0.3em]"
                    role="row"
                  >
                    <span lang="en">DATE</span>
                    <span lang="en">MATCHUP · ENGINE PREDICTION</span>
                    <span lang="en" className="text-right">FINAL</span>
                    <span lang="en" className="text-right">ENGINE % ON WINNER</span>
                    <span lang="en" className="text-right">VERDICT</span>
                    <span className="sr-only">link</span>
                  </div>
                  {subsequentReceipts.map((m) => (
                    <LedgerRow key={m.id} match={m} />
                  ))}
                </div>
              </>
            );
          })()
        )}

        {unfiledArchived > 0 && (
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚠ {unfiledArchived} 場已結束但未補錄最終比分 · 引擎預測已不可驗證 ·
            維持 ARCHIVED 狀態 · 不會出現在此表(per coverage philosophy:
            {" "}<Link href="/coverage" className="text-gold hover:underline">/coverage</Link>)
          </p>
        )}
      </section>

      {/* R70 W-C · SilentReceiptStream · Agent A R69 SHIP 4 deferred ·
          Pinboard.in archive view paradigm · single-line typographic
          rows · oldest first · ledger paper aesthetic · parallel ARCHIVE
          INDEX axis 對 Bloomberg-grid LedgerRow newest-first view above ·
          building NOW(N=1)means it lives in architecture before sample
          debt closes · same physics-of-time discipline as /founders/ledger
          + /annual/2026 + /founders/from-one-current-founder empty scaffolds。 */}
      <SilentReceiptStream finalizedMatches={finalized} />

      {/* ── METHODOLOGY ──────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
        <p
          lang="en"
          className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-6 section-reveal"
        >
          / HOW WE GRADE
        </p>

        <div className="space-y-6">
          <GradingStep
            no="01"
            title="引擎賽前公開預測"
            body="每場 CPBL 賽前 (與 MLB · 排程公開) 跑 10K Monte Carlo · 輸出主隊勝率 / 客隊勝率 · 公開在 /matches 與首頁 · 鎖定不再改。"
          />
          <GradingStep
            no="02"
            title="favorite = winRate 大於 50%"
            body="引擎指向誰贏 · 純機率比較 · 不引入第二層信心係數(刻意保持 verdict 二元 · 不規避歸類)。"
          />
          <GradingStep
            no="03"
            title="賽後 Tim 親手截圖最終比分"
            body="Tim 在 cpbl.com.tw 或 cpbl 官方 app 截圖最終比分 + 局數 · Claude 解析 → 寫入 match.finalResult。"
          />
          <GradingStep
            no="04"
            title="計算 verdict · 三種"
            body="favorite 贏 → PROVED ✓(gold)· favorite 輸 → DIVERGED ✕(loss color)· 平局或 50/50 → PUSH =(mute)。三者視覺權重相同 · 完全沒有「藏 miss」。"
          />
          <GradingStep
            no="05"
            title="此頁是 single source of truth"
            body="所有 PROVED / DIVERGED 行永遠留在這 · 不刪、不修飾、不重新加權。如果未來規則改變,舊行不重算 — 直接加 changelog 行。"
          />
        </div>

        <p className="mt-8 font-mono text-mute text-[10px] tracking-[0.25em] leading-relaxed">
          完整 Brier score / log loss 後續會接 ·
          目前先用最直觀的 binary verdict 跑 N → 30 sample size(<Link href="/glossary#sample-debt" className="text-gold hover:underline">SAMPLE DEBT</Link> warning until N≥30)。
          完整 calibration 方法論見{" "}
          <Link
            href="/methodology"
            className="text-gold underline-offset-4 hover:underline"
          >
            /methodology
          </Link>
          {" · "}
          PROVED / DIVERGED / PUSH 等 verdict 詞彙定義見{" "}
          <Link
            href="/glossary#z27-lexicon"
            className="text-gold underline-offset-4 hover:underline"
          >
            /glossary Z27 LEXICON
          </Link>
          。
        </p>
      </section>

      {/* ── PHILOSOPHY FOOTER ────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
        <div className="bg-slate/40 border border-gold/30 p-8 text-center">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            FROM /MANIFESTO · SECTION II
          </p>
          <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-3">
            「方法公開 · 品味私藏」
          </p>
          <p
            lang="en"
            className="font-mono text-gold/70 text-sm tracking-[0.25em] mb-6"
          >
            SHOW YOUR WORK · KEEP YOUR SOUL
          </p>
          <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
            這頁的存在 = 方法公開的具體 demonstration。
            DIVERGED 行不會被刪 — 那不是 bug · 是品牌 IP。
          </p>
        </div>
      </section>

      <FounderSignOff>
        <p>
          這個 ledger 從 <strong>N=0</strong> 開始。
          每場 ZONE 27 公開預測過的 CPBL 賽事 · 我會在賽後 24 小時內手動 ingest box score。
        </p>
        <p>
          PROVED 跟 DIVERGED <strong>等大列出</strong> · 連 PUSH 都不藏。
          這是我能給的最物理的承諾 — 不是文案 · 是 git commit。
        </p>
        <p>
          您看到的每一行 · 在 GitHub commit history 裡都有對應的「~XX:XX TPE
          ingest」紀錄 · 沒有後補 · 沒有 backdate。
        </p>
      </FounderSignOff>

      <RelatedReading currentPath="/track-record" />

      {/* ── BACK ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
        <Link
          href="/matches"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
        >
          ← 回到今日賽事板
        </Link>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── Round 31 W-N · buildMyTeamMatches ──────────────────
// Converts finalized Match[] to MyTeamMatch[] · the lighter shape used
// by client-side MyTeamTrackRecord(no need to ship full Match data to
// client · only the fields needed for team filtering + verdict)。
function buildMyTeamMatches(finalized: Match[]): MyTeamMatch[] {
  return finalized.map((m) => {
    const homePicked = m.home.winRate > m.away.winRate;
    const homeWon = m.finalResult
      ? m.finalResult.winner === "home"
        ? true
        : m.finalResult.winner === "away"
        ? false
        : null
      : null;
    return {
      id: m.id,
      homeName: m.home.name,
      awayName: m.away.name,
      homePicked,
      homeWon,
      isFinal: !!m.finalResult,
    };
  });
}

// ── Sub-components ─────────────────────────────────────

function LedgerStat({
  label,
  value,
  tone = "bone",
  small = false,
}: {
  label: string;
  value: string;
  tone?: "bone" | "gold" | "loss" | "mute";
  small?: boolean;
}) {
  const toneColor = {
    bone: "text-bone",
    gold: "text-gold",
    loss: "text-loss",
    mute: "text-mute",
  }[tone];
  return (
    <div>
      <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-2">
        {label}
      </p>
      <p
        className={`font-mono tabular tracking-tight ${
          small ? "text-xl" : "text-2xl sm:text-3xl"
        } ${toneColor}`}
      >
        {value}
      </p>
    </div>
  );
}

function LedgerRow({ match }: { match: Match }) {
  const cal = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);
  const fr = match.finalResult;
  if (!fr || !cal) return null;

  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const dogName = homeFavored ? match.away.name : match.home.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);

  const verdictStyles = {
    proved: "text-gold border-gold",
    diverged: "text-loss border-loss/70",
    push: "text-mute border-mute/60",
  } as const;
  const verdictLabel = {
    proved: "✓ PROVED",
    diverged: "✕ DIVERGED",
    push: "= PUSH",
  } as const;

  const dateIso = getMatchDateIso(match) ?? "—";

  const verdictColor =
    cal === "proved"
      ? "text-gold"
      : cal === "diverged"
      ? "text-loss"
      : "text-mute";

  return (
    <>
      {/* ── DESKTOP · Bloomberg-style table row ── */}
      <div
        role="row"
        className="hidden lg:grid grid-cols-[110px_1fr_120px_140px_110px_50px] gap-3 px-5 py-4 border-b border-line/40 last:border-b-0 hover:bg-slate/40 transition-colors"
      >
        <span className="font-mono text-mute text-xs tabular tracking-[0.05em] self-center">
          {dateIso}
        </span>
        <div className="self-center">
          <p className="text-bone text-sm leading-snug">
            <span className="text-gold">{favoriteName}</span>
            <span className="text-mute mx-1.5 text-xs">favored</span>
            <span className="text-mute text-xs">vs</span>{" "}
            <span className="text-mute">{dogName}</span>
          </p>
          <p className="font-mono text-mute text-[10px] tracking-[0.2em] mt-1 tabular">
            ENGINE · {favoritePct}% / {100 - favoritePct}% · CONF {match.aiConfidence}/100
          </p>
        </div>
        <span className="font-mono text-bone text-base tabular self-center text-right">
          {fr.homeScore}:{fr.awayScore}
          <span className="block text-[9px] text-mute tracking-[0.2em] mt-0.5">
            {fr.winner === "home"
              ? `${match.home.en} W`
              : fr.winner === "away"
              ? `${match.away.en} W`
              : "TIE"}
          </span>
        </span>
        <span
          className={`font-mono tabular text-sm self-center text-right ${verdictColor}`}
        >
          {enginePctOnWinner !== null ? `${enginePctOnWinner}%` : "—"}
        </span>
        <span
          lang="en"
          className={`font-mono text-[10px] tracking-[0.25em] border px-2 py-1 self-center text-center ${verdictStyles[cal]}`}
        >
          {verdictLabel[cal]}
        </span>
        <Link
          href={`/matches/${match.id}`}
          className="self-center text-gold/70 hover:text-gold text-right font-mono text-[10px] tracking-[0.3em]"
          aria-label={`Full breakdown for ${favoriteName} vs ${dogName}`}
        >
          →
        </Link>
      </div>

      {/* ── MOBILE · Stacked card · same info, no horizontal overflow ── */}
      <Link
        href={`/matches/${match.id}`}
        className="lg:hidden block px-5 py-5 border-b border-line/40 last:border-b-0 hover:bg-slate/40 transition-colors"
        aria-label={`Full breakdown for ${favoriteName} vs ${dogName}`}
      >
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <span className="font-mono text-mute text-[10px] tabular tracking-[0.2em]">
            {dateIso}
          </span>
          <span
            lang="en"
            className={`font-mono text-[10px] tracking-[0.25em] border px-2 py-0.5 ${verdictStyles[cal]}`}
          >
            {verdictLabel[cal]}
          </span>
        </div>
        <p className="text-bone text-base leading-snug mb-2">
          <span className="text-gold">{favoriteName}</span>
          <span className="text-mute mx-1.5 text-[11px]">favored</span>
          <span className="text-mute text-[11px]">vs</span>{" "}
          <span className="text-mute">{dogName}</span>
        </p>
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-line/40">
          <div>
            <p className="font-mono text-mute text-[9px] tracking-[0.25em] mb-1">
              ENGINE %
            </p>
            <p className="font-mono text-bone text-sm tabular">
              {favoritePct}% / {100 - favoritePct}%
            </p>
          </div>
          <div>
            <p className="font-mono text-mute text-[9px] tracking-[0.25em] mb-1">
              FINAL
            </p>
            <p className="font-mono text-bone text-sm tabular">
              {fr.homeScore}:{fr.awayScore}
              <span className="block text-[9px] text-mute mt-0.5">
                {fr.winner === "home"
                  ? `${match.home.en} W`
                  : fr.winner === "away"
                  ? `${match.away.en} W`
                  : "TIE"}
              </span>
            </p>
          </div>
          <div>
            <p className="font-mono text-mute text-[9px] tracking-[0.25em] mb-1">
              ON WINNER
            </p>
            <p className={`font-mono text-sm tabular ${verdictColor}`}>
              {enginePctOnWinner !== null ? `${enginePctOnWinner}%` : "—"}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
}

// ── First Receipt Hero · N=1 cinematic ──────────────────
// Round 29 Wave 5A · 為今晚 cpbl-260521-01 ingest 設計的專屬 brand
// 物理時刻。當 finalized.length === 1 時 · 唯一那筆 ledger entry 用
// elevated treatment 顯示:
//   - 2px gold border + soft glow(brand glow-gold class)
//   - 「★ FIRST RECEIPT · 1 OF 270 PROJECTED」kicker band
//   - 大字 team names + engine prediction + actual final score
//   - PROVED/DIVERGED 等大視覺權重(per /audit Section 05 disclosure
//     philosophy · 不藏 miss · 不偏向 PROVED outcome)
//   - 底部 tagline: 「269 more will follow as the engine runs through
//     the CPBL season」 — accumulating-over-time framing(Endowment
//     Effect · per Agent A Pattern #1 lightweight 版)
// 當 N>1 切回正常 ledger 表格(no cinematic for row 2+)。
// R63 W-B · pinned mode added · per Pokemon TCG 1st Edition永久-pinning
// mechanic · when N>=2 the founding receipt(oldest ingested)stays elevated
// ABOVE the ledger table · same anatomy + adapted copy(no "29 MORE TO N=30"
// stale framing once N>=2 · use 「FOUNDING RECEIPT · PERMANENTLY PINNED」
// instead)。 totalN prop allows the「X MORE TO N=30」 countdown to stay
// accurate at every N level until threshold crossed。
function FirstReceiptHero({
  match,
  pinned = false,
  totalN = 1,
}: {
  match: Match;
  pinned?: boolean;
  totalN?: number;
}) {
  const cal = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);
  const fr = match.finalResult;
  if (!fr || !cal) return null;

  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);
  const dateIso = getMatchDateIso(match) ?? "—";

  // R63 W-B · adaptive kicker copy
  // - pinned(N>=2): "FOUNDING RECEIPT · PERMANENTLY PINNED · 1ST EDITION"
  // - not pinned, N<30: "FIRST RECEIPT · NOT YET EVIDENCE · X MORE TO N=30"
  // - not pinned, N>=30: "FIRST RECEIPT · N≥30 THRESHOLD CROSSED"
  const moreToThreshold = Math.max(0, 30 - totalN);
  const kickerText = pinned
    ? "★ FOUNDING RECEIPT · PERMANENTLY PINNED · 1ST EDITION"
    : totalN >= 30
    ? "★ FIRST RECEIPT · N≥30 THRESHOLD CROSSED · STATISTICALLY MEANINGFUL"
    : `★ FIRST RECEIPT · NOT YET EVIDENCE · ${moreToThreshold} MORE TO N=30`;

  const verdictColor = {
    proved: "text-gold",
    diverged: "text-loss",
    push: "text-mute",
  }[cal];
  const verdictBorder = {
    proved: "border-gold",
    diverged: "border-loss/70",
    push: "border-mute/60",
  }[cal];
  const verdictLabel = {
    proved: "✓ PROVED · ENGINE 言中",
    diverged: "✕ DIVERGED · ENGINE 落空",
    push: "= PUSH · 平局或無 favorite",
  }[cal];

  return (
    <article
      aria-label="First receipt · the inaugural ZONE 27 calibration entry"
      className="border-2 border-mute/40 bg-slate/30 enter-fade-up"
    >
      {/* R60 W-B · Pokemon TCG card anatomy header · top-line 「set name + card
          number」 grammar · 同 Pokemon Base Set 1999 Charizard 卡頂端 「Charizard
          120 HP · Stage 2」 hierarchy · 不是 visual skinning(無 yellow border ·
          無 holo foil · 無 emoji)· 是 typographic card grammar transplant ·
          ZONE 27 deep navy + cold gold + bone white + Geist Mono 全保留 ·
          TCG「receipt-of-finite-set」 mental model 通過 N/total notation
          物理 codify。 per agent Pokemon research ship #4 · 同 TCG Protectors
          anatomy guide(card # / set total + rarity + illustrator footer)。 */}
      <div className="border-b border-gold/40 bg-gold/5 px-5 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
        <p
          lang="en"
          className="font-mono text-gold tracking-[0.35em] text-[10px] sm:text-[11px]"
        >
          ZONE 27 ENGINE · v0.2 · RECEIPT 001
        </p>
        <p
          lang="en"
          className="font-mono text-gold/80 tracking-[0.3em] text-[9px] sm:text-[10px] tabular"
        >
          CARD 001 / CPBL SEASON 2026
        </p>
      </div>

      {/* ── KICKER BAND ─────────────────────── */}
      {/* Round 31 Wave G A11+A12 critic-agent patch · 改灰色 · 不慶祝 N=1。
          Stat-literate skeptic 嗆「打一場中一場吹一輩子 = 統計文盲」·
          Pratfall axiom 延伸到 own first receipt:不慶祝 · 直接 surface
          「N=1 ≠ SIGNAL · 27 MORE TO N=30」 · brand IP「方法公開」延伸到
          self-evaluation discipline。 ★ 保留 + 移到 secondary visual weight ·
          shimmer 拿掉 · gold border 降 mute/40 · gold/5 bg 拿掉。 */}
      <div className="border-b border-mute/30 px-5 sm:px-8 py-4 flex items-baseline justify-between flex-wrap gap-3">
        <p
          lang="en"
          className="font-mono text-mute/80 text-[10px] sm:text-xs tracking-[0.4em]"
          title={
            pinned
              ? "Founding receipt 永遠 pinned · Pokemon TCG 1st Edition mechanic · 同 R60 W-B「CARD 001 / ∞」 axiom"
              : "N<30 不是 signal · 校準需要 Brier score · 見 v0.3 roadmap · per /audit S05 + critic-hardening Round 31 W-G"
          }
        >
          {kickerText}
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
          {dateIso} · INGEST
        </p>
      </div>

      {/* ── MATCH SUMMARY ──────────────────────── */}
      <div className="px-5 sm:px-8 pt-7 pb-6">
        <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-3">
          / MATCHUP
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-1">
          <span className="text-gold">{match.home.name}</span>
          <span className="text-mute/60 mx-3 text-base">vs</span>
          <span className="text-mute">{match.away.name}</span>
        </h2>
        <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-1">
          {match.home.en} <span aria-hidden="true" className="text-mute/85">·</span>{" "}
          {match.away.en}
        </p>
      </div>

      {/* ── ENGINE vs ACTUAL GRID ───────────── */}
      <div className="px-5 sm:px-8 pb-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div className="border-l-2 border-gold/30 pl-5 pr-2 py-2">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
            >
              ENGINE PREDICTED · 賽前鎖定
            </p>
            <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
              {favoritePct}
              <span className="text-lg opacity-60 ml-1">%</span>
              <span className="text-mute text-base ml-3">
                {homeFavored ? match.home.en : match.away.en}
              </span>
            </p>
            <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
              FAVORITE · {favoriteName} · CONF {match.aiConfidence ?? 0}/100
            </p>
          </div>
          <div className="border-l-2 border-bone/30 pl-5 pr-2 py-2 sm:text-right sm:border-l-0 sm:border-r-2 sm:pr-5 sm:pl-2">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
            >
              ACTUAL RESULT · 賽後
            </p>
            <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
              {fr.homeScore}:{fr.awayScore}
              <span className="text-mute text-base ml-3">
                {fr.winner === "home"
                  ? `${match.home.en} W`
                  : fr.winner === "away"
                  ? `${match.away.en} W`
                  : "TIE"}
              </span>
            </p>
            <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
              {fr.innings ?? 9} 局 · {fr.ingestedAt} INGEST
            </p>
          </div>
        </div>
      </div>

      {/* ── VERDICT BAND ────────────────────────
          R67 W-B · Peak-End rule(Kahneman 2002)moment · `.enter-
          verdict-reveal` 800ms hold + 480ms cubic-bezier expo reveal ·
          uses MOTION constants from lib/motion.ts(single source)·
          @starting-style modern CSS(no JS · graceful fallback)·
          prefers-reduced-motion guarded · per /audit S05 disclosure
          parity · PROVED 與 DIVERGED 用同 timing 不偏 emotion · 同
          Bloomberg Terminal LAST-number 強調 grammar 不是 victory
          animation。 */}
      <div
        className={`border-t-2 ${verdictBorder} px-5 sm:px-8 py-6 sm:py-7 text-center enter-verdict-reveal`}
      >
        <p
          lang="en"
          className={`font-mono ${verdictColor} text-lg sm:text-2xl tracking-[0.3em] font-medium`}
        >
          {verdictLabel}
        </p>
        {enginePctOnWinner !== null && (
          <p
            className={`font-mono ${verdictColor} text-[11px] sm:text-xs tracking-[0.3em] tabular mt-3 opacity-80`}
          >
            {cal === "proved" && (
              <>
                <span lang="en">ENGINE %{" "}ON WINNER</span> · {enginePctOnWinner}%{" "}
                <span className="text-mute mx-2">→</span>
                <span lang="en">CORRECT FAVORITE</span>
              </>
            )}
            {cal === "diverged" && (
              <>
                <span lang="en">ENGINE %{" "}ON ACTUAL WINNER</span> · 僅{enginePctOnWinner}%{" "}
                <span className="text-mute mx-2">→</span>
                <span lang="en">UNDERDOG WON</span>
              </>
            )}
            {cal === "push" && (
              <>
                <span lang="en">NO FAVORITE 或 TIE</span> · 引擎 verdict 不可驗證
              </>
            )}
          </p>
        )}
      </div>

      {/* ── TAGLINE FOOTER ─────────────────── */}
      {/* R76 W-G · Agent B R76 audit M-1 + M-2 fix · 加 /receipts/{id}
          cross-link · 之前 /track-record 沒 link 回 /receipts/[receiptId]
          · 訪客 lost wayfinding · 5-second self-debunk per Agent B R76 ·
          fix:add /receipts/{id} 「object permalink」 link alongside existing
          /matches/{id} 「full breakdown」 link · brand IP 不藏 wayfinding。 */}
      <div className="border-t border-line/30 px-5 sm:px-8 py-4 bg-navy/40">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed text-center">
          {pinned ? (
            <>
              ▌ <span lang="en">PERMANENTLY PINNED · founding receipt of the
              CPBL 2026 season · 1st Edition mythos preserved at every N</span> ·{" "}
              <Link
                href={`/receipts/${match.id}`}
                className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
              >
                receipt object →
              </Link>
              {" · "}
              <Link
                href={`/matches/${match.id}`}
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                完整 breakdown →
              </Link>
            </>
          ) : (
            <>
              ▌ <span lang="en">269 more will follow as the engine runs through
              the CPBL season</span> · 不刪 · 不修飾 · 不重新加權 ·{" "}
              <Link
                href={`/receipts/${match.id}`}
                className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
              >
                receipt object →
              </Link>
              {" · "}
              <Link
                href={`/matches/${match.id}`}
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                完整 breakdown →
              </Link>
            </>
          )}
        </p>
      </div>
      {/* R60 W-B · Pokemon TCG card footer · bottom-line「N/total + rarity +
          illustrator credit」 grammar · 同 Charizard 4/102 / WOTC 1999 stamp。
          ZONE 27 transplant:CARD # / SEASON · ENGINE VERSION · INGEST date ·
          REPRINT POLICY 0(永不重印 · 同 1st Edition Shadowless mechanic per
          R60 W-A SHADOWLESS RUN section)。 訪客 screenshot share = TCG-style
          card artifact · 同 agent ship #4 「screenshot-shareable」 axiom。 */}
      <div className="border-t border-gold/40 px-5 sm:px-8 py-3 bg-gold/5 flex items-center justify-between flex-wrap gap-2 font-mono text-gold/80 text-[9px] tracking-[0.28em] tabular">
        <span lang="en">CARD 001 / ∞</span>
        <span lang="en">CPBL · 2026 SEASON 1</span>
        <span lang="en">REPRINT POLICY · 0</span>
      </div>
    </article>
  );
}

function EmptyLedger() {
  return (
    <div className="border border-dashed border-gold/30 bg-slate/30 p-12 text-center">
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
      >
        N = 0 · LEDGER EMPTY · BY DESIGN
      </p>
      <h3 className="text-2xl text-bone font-light tracking-tight mb-3">
        第一筆 entry 預定今晚收錄
      </h3>
      <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-8">
        ZONE 27 不 backfill 歷史預測 — 沒有 cherry-picked 過往 ·
        沒有事後找出引擎曾經言中的場次。
        Ledger 從 <span className="text-gold">cpbl-260521-01</span>{" "}
        統一 vs 富邦 開始記錄 · 賽後最終比分 ingest 後第一筆會亮起。
      </p>

      {/* Round 13 cinematic moment · FIRST PITCH → FIRST RECEIPT
          visual journey. Brand-honest timestamp (NO countdown · NO fake
          urgency · these are real wall-clock anchors). 18:35 = game
          start · 22:00+ = Tim's typical post-game ingest window. */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap font-mono text-[10px] tabular tracking-[0.28em]">
        <div className="text-center">
          <p className="text-gold/80">FIRST PITCH</p>
          <p className="text-bone mt-1">18:35 TPE</p>
          <p className="text-mute/60 text-[9px] tracking-[0.2em] mt-0.5">2026-05-21 · 新莊</p>
        </div>
        <span aria-hidden="true" className="text-mute/85 text-base hidden sm:inline">→</span>
        <span aria-hidden="true" className="text-mute/85 text-base sm:hidden">↓</span>
        <div className="text-center">
          <p className="text-gold/80">ENGINE RUN</p>
          <p className="text-bone mt-1">18:30 → 22:00 TPE</p>
          <p className="text-mute/60 text-[9px] tracking-[0.2em] mt-0.5">10K Monte Carlo · 賽前公開鎖定</p>
        </div>
        <span aria-hidden="true" className="text-mute/85 text-base hidden sm:inline">→</span>
        <span aria-hidden="true" className="text-mute/85 text-base sm:hidden">↓</span>
        <div className="text-center">
          <p className="text-gold/80">FIRST RECEIPT</p>
          <p className="text-bone mt-1">22:00+ TPE</p>
          <p className="text-mute/60 text-[9px] tracking-[0.2em] mt-0.5">PROVED ✓ 或 DIVERGED ✕</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link
          href="/matches/cpbl-260521-01"
          className="px-6 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
        >
          看今晚的預測 →
        </Link>
        <Link
          href="/manifesto"
          className="px-6 py-2.5 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
        >
          為什麼這樣做 →
        </Link>
      </div>
    </div>
  );
}

function GradingStep({
  no,
  title,
  body,
}: {
  no: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-5">
      <span className="font-mono text-gold/70 text-sm tabular w-8 pt-1">
        {no}
      </span>
      <div className="flex-1">
        <h4 className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          {title}
        </h4>
        <p className="text-mute text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
