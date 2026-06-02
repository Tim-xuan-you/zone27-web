import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniMatchCard from "@/components/MiniMatchCard";
import { createPageMetadata } from "@/lib/page-og";
import {
  getMatchPhase,
  getCalibration,
  getTodayAndFutureMatches,
  getFinalizedMatches,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";

export const metadata = createPageMetadata({
  title: "今日 CPBL 賽事板",
  description:
    "今日中華職棒比賽列表 · AI 勝率模型每天 15:00 鎖定 · 點進任一場看引擎開盤線 + 完整 10,000 次模擬與重播 · 不接受下注。",
  ogTitle: "今日 CPBL 賽事板 · ZONE 27",
  ogDescription:
    "今日 CPBL 比賽列表 · 勝率模型 15:00 鎖定 · 10,000 次模擬 · 引擎開盤線 · 不接受下注",
  path: "/matches",
});

// ── ISR · Re-render daily so the today/archived state stays honest.
export const revalidate = 86400; // 24 hours

export default function MatchesPage() {
  // Round 10: filter to today + future only.
  // Past matches with finalResult become RECEIPTS · they live on
  // /track-record + permalink /matches/[gameId] · not in this list.
  // This is the "daily refresh" UX visitors expect from a sport page.
  const upcomingMatches = getTodayAndFutureMatches();
  const allReceipts = getFinalizedMatches();
  const recentReceipts = allReceipts.slice(0, 3); // 有賽事時 · 下方輔助 strip
  // 休賽日主看板 fallback · 同首頁:沒有可押賽事時,看板改放引擎最近 6 場
  // 賽後收據(✓/✕ 都掛)而非空盒子 · 看板永不空白。
  const offSeasonReceipts =
    upcomingMatches.length === 0 ? allReceipts.slice(0, 6) : [];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

      <main id="main">

      {/* ── HEADER ──────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-10">
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
            今日賽事板 · {upcomingMatches[0]?.league ?? "CPBL"}
          </p>
          {upcomingMatches[0] && (
            <PhaseChip
              phase={getMatchPhase(upcomingMatches[0])}
              calibration={getCalibration(upcomingMatches[0])}
            />
          )}
          <Link
            href="/track-record"
            className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30 text-gold/70 hover:border-gold hover:text-gold transition-colors"
            title="所有有最終結果的比賽公開戰績"
          >
            公開戰績 →
          </Link>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            {upcomingMatches[0]?.date ?? "今日無覆蓋場次"}
          </h1>
          <p className="font-mono text-mute text-xs tracking-[0.25em]">
            {upcomingMatches.length} 場引擎覆蓋 · AI 模型 15:00 鎖定
          </p>
        </div>
        <p className="mt-3 font-mono text-mute text-[10px] tracking-[0.25em]">
          引擎只覆蓋親手 ingest 過的場次(per /coverage philosophy)· 賽後過期卡會自動移到 /track-record receipt ledger
        </p>
        <div className="mt-6 w-full h-px bg-line/60" />
      </section>

      {/* ── MATCH GRID ──────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
        {upcomingMatches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingMatches.map((m) => (
              <MiniMatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : offSeasonReceipts.length > 0 ? (
          /* 休賽日 · 看板永不空白 → 引擎最近戰績收據(同首頁 fallback) */
          <>
            <p className="text-mute text-sm leading-relaxed mb-6 max-w-2xl">
              今日無 CPBL 場次 · 現在沒有可押的賽事。 這是引擎最近{" "}
              {offSeasonReceipts.length} 場的公開判決 —{" "}
              <span className="text-gold">✓ 言中</span> 跟{" "}
              <span className="text-loss">✕ 落空</span>{" "}
              一樣掛上來,從不藏。
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {offSeasonReceipts.map((m) => (
                <MiniMatchCard key={m.id} match={m} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-slate/40 border border-line/60 p-10 sm:p-12 text-center">
            <p className="font-mono text-mute text-xs tracking-[0.25em] mb-4">
              今日 CPBL · 無引擎覆蓋場次
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-8">
              今日無 CPBL 場次 · 改為檢視過去的公開戰績:
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

      {/* ── RECENT RECEIPTS · brand IP signal ──
          When there's an upcoming match, also show 1-3 past receipts
          as "engine track record" signal. Brand-IP: 引擎 + 收據 visible
          together is the conversion lever. */}
      {upcomingMatches.length > 0 && recentReceipts.length > 0 && (
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-16">
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
            <p
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em]"
            >
              / RECENT RECEIPTS · 引擎過去戰績
            </p>
            <Link
              href="/track-record"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
            >
              完整 ledger →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentReceipts.map((m) => (
              <MiniMatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* ── MLB CTA(即時資料) ───────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
        <Link
          href="/matches/mlb"
          className="block bg-slate/40 border border-win/30 hover:border-win/70 transition-colors p-6 sm:p-8 group"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-baseline gap-2 mb-2 font-mono text-[10px] tracking-[0.35em]">
                <span className="text-win">MLB · 即時資料</span>
                <span className="px-1.5 py-0.5 border border-win/40 text-win">
                  LIVE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight">
                想看美國職棒今日全部賽程?
              </h3>
              <p className="text-mute text-sm mt-2 max-w-xl">
                資料直接來自 MLB 官方 Stats API,每 10 分鐘更新。
                ~15 場比賽含戰績、開賽時間(台北時區)、即時比分。
              </p>
            </div>
            <span className="font-mono text-win text-xs tracking-[0.3em] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
              今日 MLB 賽程 →
            </span>
          </div>
        </Link>
      </section>

      {/* ── CPBL 投手排行 CTA · Baseball Savant Custom Leaderboards pattern ── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
        <Link
          href="/cpbl-pitchers"
          className="block bg-slate/40 border border-gold/30 hover:border-gold/70 transition-colors p-6 sm:p-8 group"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-baseline gap-2 mb-2 font-mono text-[10px] tracking-[0.35em]">
                <span className="text-gold">CPBL 投手排行 · NEW</span>
                <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
                  FREE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight">
                K/9 · BB/9 · HR/9 · WHIP · ERA · IP · 1 鍵排序
              </h3>
              <p className="text-mute text-sm mt-2 max-w-xl">
                Baseball Savant Custom Leaderboards pattern · URL 可分享
                · LINE 轉傳直接看相同排序。 資料來自 stats.cpbl.com.tw 公開
                box score · 0 付費 API。
              </p>
            </div>
            <span className="font-mono text-gold text-xs tracking-[0.3em] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
              排行 + 解釋 →
            </span>
          </div>
        </Link>
      </section>

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
        title="今晚開賽 · 預測已公開鎖定"
      >
        TODAY · 今晚開賽
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
