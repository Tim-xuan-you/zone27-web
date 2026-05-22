import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";
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
        <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
          多數運動分析平台選擇藏起這頁;ZONE 27 把它放在 footer 主導航 ·
          因為公開戰績是品牌 IP 的物理證據(per{" "}
          <Link
            href="/manifesto"
            className="text-gold underline-offset-4 hover:underline"
          >
            /manifesto Section II
          </Link>
          {" / "}
          <Link
            href="/discipline"
            className="text-gold underline-offset-4 hover:underline"
          >
            /discipline Section 01
          </Link>
          )。
        </p>
      </section>

      <div className="mx-auto max-w-5xl w-full px-6 sm:px-10 mb-12">
        <div className="w-full h-px bg-line/60" />
      </div>

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
          // gold 2px border · "★ FIRST RECEIPT · 1 OF 270 PROJECTED"
          // band · larger verdict visual · slow gold glow. This is
          // designed for tonight's cpbl-260521-01 ingest moment ·
          // the physical brand-IP event of the week.
          // PROVED and DIVERGED get equal visual weight per axiom ·
          // no emoji / no celebration animation that biases toward
          // PROVED outcome.
          <FirstReceiptHero match={finalized[0]} />
        ) : (
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
            {finalized.map((m) => (
              <LedgerRow key={m.id} match={m} />
            ))}
          </div>
        )}

        {unfiledArchived > 0 && (
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚠ {unfiledArchived} 場已結束但未補錄最終比分 · 引擎預測已不可驗證 ·
            維持 ARCHIVED 狀態 · 不會出現在此表(per coverage philosophy:
            {" "}<Link href="/coverage" className="text-gold hover:underline">/coverage</Link>)
          </p>
        )}
      </section>

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
function FirstReceiptHero({ match }: { match: Match }) {
  const cal = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);
  const fr = match.finalResult;
  if (!fr || !cal) return null;

  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);
  const dateIso = getMatchDateIso(match) ?? "—";

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
      className="border-2 border-gold/70 glow-soft bg-slate/30 enter-fade-up"
    >
      {/* ── KICKER BAND ─────────────────────── */}
      <div className="border-b border-gold/40 bg-gold/5 px-5 sm:px-8 py-4 flex items-baseline justify-between flex-wrap gap-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] sm:text-xs tracking-[0.4em] shimmer"
          title="這是 ZONE 27 公開戰績 ledger 的第一筆 · 物理時刻 · 不會重來"
        >
          ★ FIRST RECEIPT · 1 OF 270 PROJECTED
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
          {match.home.en} <span className="text-mute/40">·</span>{" "}
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

      {/* ── VERDICT BAND ──────────────────────── */}
      <div
        className={`border-t-2 ${verdictBorder} px-5 sm:px-8 py-6 sm:py-7 text-center`}
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
      <div className="border-t border-line/30 px-5 sm:px-8 py-4 bg-navy/40">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed text-center">
          ▌ <span lang="en">269 more will follow as the engine runs through
          the CPBL season</span> · 不刪 · 不修飾 · 不重新加權 ·{" "}
          <Link
            href={`/matches/${match.id}`}
            className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
          >
            完整 breakdown →
          </Link>
        </p>
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
        <span aria-hidden="true" className="text-mute/40 text-base hidden sm:inline">→</span>
        <span aria-hidden="true" className="text-mute/40 text-base sm:hidden">↓</span>
        <div className="text-center">
          <p className="text-gold/80">ENGINE RUN</p>
          <p className="text-bone mt-1">18:30 → 22:00 TPE</p>
          <p className="text-mute/60 text-[9px] tracking-[0.2em] mt-0.5">10K Monte Carlo · 賽前公開鎖定</p>
        </div>
        <span aria-hidden="true" className="text-mute/40 text-base hidden sm:inline">→</span>
        <span aria-hidden="true" className="text-mute/40 text-base sm:hidden">↓</span>
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
