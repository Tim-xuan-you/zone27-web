import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import MiniMatchCard from "@/components/MiniMatchCard";
import MatchBoardFilter from "@/components/MatchBoardFilter";
import { createPageMetadata } from "@/lib/page-og";
import {
  getMatchPhase,
  getCalibration,
  getTodayAndFutureMatches,
  getFinalizedMatches,
  getMatchStartIso,
  type Match,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";
import { getMlbAsMatches } from "@/lib/mlb-matches";
import { getCreatorPostCounts } from "@/lib/creator-posts-server";

export const metadata = createPageMetadata({
  title: "今日賽事板 · CPBL + MLB",
  description:
    "今日中職 + MLB 比賽列表 · AI 勝率模型賽前鎖定開盤線 · 點進任一場看引擎開盤線 + 完整模擬與重播 · 不接受下注。",
  ogTitle: "今日賽事板 · CPBL + MLB · ZONE 27",
  ogDescription:
    "今日中職 + MLB 比賽列表 · 勝率模型賽前鎖定 · 引擎開盤線 · 不接受下注",
  path: "/matches",
});

// ── ISR · Re-render daily so the today/archived state stays honest.
export const revalidate = 86400; // 24 hours

export default async function MatchesPage() {
  // Round 10: filter to today + future only.
  // Past matches with finalResult become RECEIPTS · they live on
  // /track-record + permalink /matches/[gameId] · not in this list.
  // This is the "daily refresh" UX visitors expect from a sport page.
  // 統一排序鍵:完整台北 instant(date+time)· 修「6/5↔6/6 穿插」(原本 CPBL 只比日期、
  // MLB 只比 HH:MM 時間字串忽略日期)。 各組內各自 sort,渲染時固定 CPBL→MLB(權重排序
  // 護核心 · 絕不 concat 後全域 time-sort = 會把 15 場清晨 MLB 排到 CPBL 前面埋掉核心)。
  const byStart = (a: Match, b: Match) =>
    (getMatchStartIso(a) ?? "").localeCompare(getMatchStartIso(b) ?? "");
  const cpblSorted = getTodayAndFutureMatches().slice().sort(byStart);
  // R198 · MLB 全套 first-class · 同一套引擎 · 板上只放未結算(可押)· 已結束的在 /matches/mlb。
  const mlbSorted = (await getMlbAsMatches())
    .filter((m) => !m.finalResult)
    .sort(byStart);
  const hasUpcoming = cpblSorted.length > 0 || mlbSorted.length > 0;
  // 休賽日 fallback · 兩聯盟都沒可押場時,看板改放引擎最近 6 場收據(✓/✕ 都掛)· 看板永不空白。
  const offSeasonReceipts = !hasUpcoming ? getFinalizedMatches().slice(0, 6) : [];
  // 每場分析篇數 · 看板標「N 篇分析」(跟單入口)· 無 cookie · 不破 ISR。
  const analysisCounts = await getCreatorPostCounts();
  // header 顯示:CPBL 為主,CPBL 空時退 MLB(不讓「今日無覆蓋」跟下方 MLB 場矛盾)。
  const boardDate = cpblSorted[0]?.date ?? mlbSorted[0]?.date ?? "今日無覆蓋場次";
  const headMatch = cpblSorted[0] ?? mlbSorted[0];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />
      <SportTabs active="baseball" />

      <main id="main">

      {/* ── HEADER ──────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-10">
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
            今日賽事板
          </p>
          {headMatch && (
            <PhaseChip
              phase={getMatchPhase(headMatch)}
              calibration={getCalibration(headMatch)}
            />
          )}
          <Link
            href="/track-record"
            className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30 text-gold/70 hover:border-gold hover:text-gold transition-colors"
            title="所有有最終結果的比賽公開戰績"
          >
            公開戰績 →
          </Link>
          {/* 足球切換已移到上方 SportTabs(棒球 | 足球)· 不再雙頭重複 */}
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            {boardDate}
          </h1>
          <p className="font-mono text-mute text-xs tracking-[0.25em]">
            {cpblSorted.length + mlbSorted.length} 場引擎覆蓋 · 開賽前鎖定
          </p>
        </div>
        <p className="mt-3 font-mono text-mute text-[10px] tracking-[0.25em]">
          只收老闆親自確認過的場次 · 比完的會自動移到公開戰績
        </p>
        <div className="mt-6 w-full h-px bg-line/60" />
      </section>

      {/* ── MATCH GRID ──────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
        {hasUpcoming ? (
          /* 一個看板 · league 篩選 chip(預設 CPBL 護核心)· 按完整開賽時間排 ·
             CPBL→MLB 權重排序 · 戰績歸 /track-record(header 已有連結)。 */
          <MatchBoardFilter
            cpbl={cpblSorted}
            mlb={mlbSorted}
            analysisCounts={analysisCounts}
          />
        ) : offSeasonReceipts.length > 0 ? (
          /* 休賽日 · 看板永不空白 → 引擎最近戰績收據(同首頁 fallback) */
          <>
            <p className="text-mute text-sm leading-relaxed mb-6 max-w-2xl">
              現在沒有可押的賽事。 這是引擎最近{" "}
              {offSeasonReceipts.length} 場的公開判決 —{" "}
              <span className="text-gold">✓ 命中</span> 跟{" "}
              <span className="text-loss">✕ 落空</span>{" "}
              一樣掛上來,從不藏。
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {offSeasonReceipts.map((m) => (
                <MiniMatchCard key={m.id} match={m} analysisCount={analysisCounts[m.id] ?? 0} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-slate/40 border border-line/60 p-10 sm:p-12 text-center">
            <p className="font-mono text-mute text-xs tracking-[0.25em] mb-4">
              今日無引擎覆蓋場次
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-8">
              現在沒有可押的賽事 · 改為檢視過去的公開戰績:
            </p>
            <Link
              href="/track-record"
              className="inline-block px-6 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              看 /track-record 公開戰績 →
            </Link>
          </div>
        )}
      </section>

      {/* ── MLB fallback 入口 · 只在上面看板沒有 MLB 場時顯示(避免同頁兩個 /matches/mlb)──
          R202 · 旁邊原本的「CPBL 投手排行」入口已移除:該頁是手動跑 script 抓的靜態
          快照(凍在 fetch 當天 · solo 不會持續重抓 → 一張會發霉的旁支表 = 反「敢對帳」訊號)。
          引擎仍吃投手資料(lib/cpbl-pitchers.ts · getPitcherStatsByName)· 只是不再有公開排行頁 ·
          真正的證明在賽事頁(引擎實際用的投手 K/9 BB/9 就秀在那)。 */}
      {mlbSorted.length === 0 && (
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          <Link
            href="/matches/mlb"
            className="block max-w-md bg-slate/30 border border-line/60 hover:border-gold/50 hover:bg-slate/40 transition-colors p-4 sm:p-5 group"
          >
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
              <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
                MLB · 即時資料
              </span>
              <span className="font-mono text-mute/60 text-[9px] tracking-[0.2em]">
                每 10 分更新
              </span>
            </div>
            <p className="text-bone text-sm leading-snug">
              美國職棒今日全部賽程 · 戰績 · 台北時區開賽時間 ·{" "}
              <span className="text-gold/80 group-hover:text-gold">看賽程 →</span>
            </p>
          </Link>
        </section>
      )}

      </main>

      <Footer />
    </div>
  );
}

// ── PhaseChip ─────────────────────────────────────────
// Shared chip used at page-header (large) and per-card (compact). Same
// 5-phase logic as HeroLiveCard's PhaseBadge — just sized for context.

function PhaseChip({
  phase,
  calibration,
  compact = false,
}: {
  phase: MatchPhase | null;
  calibration: Calibration | null;
  compact?: boolean;
}) {
  if (!phase) return null;
  const baseSize = compact
    ? "text-[8px] tracking-[0.25em] px-1 py-0.5"
    : "text-[9px] tracking-[0.3em] px-1.5 py-0.5";

  if (phase === "final" && calibration) {
    const styles = {
      proved: "border-gold text-gold",
      diverged: "border-loss/70 text-loss",
      push: "border-mute/60 text-mute",
    } as const;
    const labels = {
      proved: "✓ PROVED",
      diverged: "✕ DIVERGED",
      push: "= PUSH",
    } as const;
    return (
      <span
        lang="en"
        className={`font-mono ${baseSize} border ${styles[calibration]}`}
        title="賽後實際結果"
      >
        {labels[calibration]}
      </span>
    );
  }

  if (phase === "today-pregame") {
    return (
      <span
        className={`font-mono ${baseSize} border border-gold text-gold shimmer`}
        title="今日即將開賽 · 預測已公開鎖定"
      >
        TODAY · 即將開賽
      </span>
    );
  }

  if (phase === "today-live") {
    return (
      <span
        className={`font-mono ${baseSize} border border-gold text-gold`}
        title="賽事進行中 · 引擎預測已無法再改"
      >
        LIVE · 賽事中
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        lang="en"
        className={`font-mono ${baseSize} border border-gold/60 text-gold`}
        title="尚未開打 · pre-game preview"
      >
        PREVIEW
      </span>
    );
  }

  return (
    <span
      className={`font-mono ${baseSize} border border-mute/60 text-mute`}
      title="已結束 · 未補錄收據"
    >
      ARCHIVED · 無收據
    </span>
  );
}
