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
import { getMlbAsMatches } from "@/lib/mlb-matches";

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

export default async function MatchesPage() {
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
  // R198 · MLB 全套 first-class(Tim「MLB 全套 · Polymarket go」)· 同一套引擎 ·
  // 轉接 lib/mlb-matches(賽前鎖定線 · 誠信純正)· 板上只放未結算(可押)·
  // 已結束的在 /matches/mlb + 各自詳情頁。 同 CPBL 一條押注/分析管線。
  const mlbBoard = (await getMlbAsMatches())
    .filter((m) => !m.finalResult)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

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
              <span className="text-gold">✓ 命中</span> 跟{" "}
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

      {/* ── MLB 市場 · 同一套引擎 first-class(R198 · Polymarket go)──
          MLB 跟 CPBL 同型卡(隊徽 + 賽前鎖定開盤線 + 一鍵押 + 點進完整詳情)·
          引擎線用賽前鎖定值(誠信)· 賽後對帳同 CPBL。 */}
      {mlbBoard.length > 0 && (
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-10">
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-3">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
              / MLB · 美國職棒 · 即時開盤
            </p>
            <Link
              href="/matches/mlb"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
            >
              全部 MLB 賽程 + 戰績 →
            </Link>
          </div>
          <p className="text-mute/80 text-sm leading-relaxed mb-6 max-w-2xl">
            棒球就是棒球 —— MLB 跟 CPBL <span className="text-bone">同一套引擎</span>:
            一樣賽前鎖定開盤線、一鍵押、賽後對帳、落空照掛。
          </p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mlbBoard.map((m) => (
              <MiniMatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* ── 其他工具 · 精簡兩欄 ───────────────────
          原本是兩張 hero 重量大卡(MLB + CPBL 投手)· 把市場頁拉長近兩倍 ·
          且 MLB 那張用綠框(border-win)= 違反「不紅綠對比」品牌鐵律。 降成兩個
          compact slim link(全 gold/mute · 不搶主看板)· 該有的入口都還在。 */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/matches/mlb"
            className="block bg-slate/30 border border-line/60 hover:border-gold/50 hover:bg-slate/40 transition-colors p-4 sm:p-5 group"
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
          <Link
            href="/cpbl-pitchers"
            className="block bg-slate/30 border border-line/60 hover:border-gold/50 hover:bg-slate/40 transition-colors p-4 sm:p-5 group"
          >
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
              <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
                CPBL 投手排行
              </span>
              <span className="font-mono text-mute/60 text-[9px] tracking-[0.2em]">
                FREE
              </span>
            </div>
            <p className="text-bone text-sm leading-snug">
              K/9 · BB/9 · HR/9 · WHIP · 1 鍵排序 · URL 可分享 ·{" "}
              <span className="text-gold/80 group-hover:text-gold">看排行 →</span>
            </p>
          </Link>
        </div>
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
