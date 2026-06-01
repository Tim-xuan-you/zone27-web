import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniMatchCard from "@/components/MiniMatchCard";
import {
  getTodayAndFutureMatches,
  getFinalizedMatches,
  getTrackRecordStats,
} from "@/lib/matches";

// ── ZONE 27 · Homepage · 市場看板(R175 Polymarket pivot)──────
// Tim 2026-05-30「請變成 Polymarket · 很亂很雜」· per
// memory/project_zone27_polymarket_pivot.md + [[feedback-zone27-homepage-minimalism]]
// subtraction-first。
//
// 翻轉 IA:市場優先,出版其次。 首頁 = 一片市場看板(每場賽事 = 一張市場卡 ·
// 引擎開盤線 + 點進去討論/分析/預測)· 不再是單場 cinematic + 7 條 strip。
// 舊的 HeroLiveCard / TonightReceiptsCard / 各種 localStorage strip 退場
// (元件保留 · 一個 git revert 可回)· brand IP Pratfall(F6 negations · 公開
// 戰績含 DIVERGED)保留但 demote 到看板下方。 引擎 cinematic 仍在 /matches/[gameId]。
// ─────────────────────────────────────────────────────

export const revalidate = 600; // ISR · 賽事 lifecycle transitions

export default function Home() {
  const upcoming = getTodayAndFutureMatches(); // 今晚 + 即將 · asc
  // 休賽日 fallback · 看板永不空白:沒有可押賽事時,改放引擎最近的賽後
  // 收據(✓言中 / ✕落空都掛)· per getFeaturedMatch 哲學「引擎沒在跑時,
  // proof-of-work(收據)勝過空泛的未來預測 = 轉換槓桿」。 首頁 2 場上限
  // (mobile ≤ 3 viewport 鐵律 · 看完整去 /track-record)。
  const recentReceipts =
    upcoming.length === 0 ? getFinalizedMatches().slice(0, 2) : [];
  const tr = getTrackRecordStats();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">
        {/* ── HERO · slim · market-first ─────────────── */}
        <section className="mx-auto max-w-5xl px-6 sm:px-10 pt-12 sm:pt-16 pb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-light leading-[1.08] tracking-tight text-bone">
            不靠直覺,<span className="text-gold">只看演算法。</span>
          </h1>
          <p className="mt-4 sm:mt-5 max-w-xl mx-auto text-mute leading-relaxed text-base sm:text-lg">
            免費跑一萬次 · <span className="text-bone">告訴你誰會贏。</span>
          </p>

          {/* 引擎戰績 · Pratfall「連輸的也掛」· compact · 永遠不刪 */}
          {tr.total > 0 && (
            <Link
              href="/track-record"
              className="mt-5 inline-flex items-baseline gap-3 sm:gap-4 border border-gold/40 bg-slate/30 hover:border-gold/60 transition-colors px-4 py-2.5 font-mono tabular flex-wrap justify-center"
              aria-label={`公開戰績 · ${tr.total} 場已對賬 · 引擎言中 ${tr.proved} · 落空 ${tr.diverged}`}
            >
              <span className="text-gold/90 text-[10px] tracking-[0.3em]">引擎戰績</span>
              <span className="text-bone text-sm">
                <strong className="text-gold">{tr.total}</strong> 場
              </span>
              <span className="text-gold text-sm">✓{tr.proved}</span>
              <span className="text-loss text-sm">✕{tr.diverged}</span>
              <span className="text-mute/60 text-[9px] tracking-[0.2em]">連輸的也掛 →</span>
            </Link>
          )}
        </section>

        {/* ── THE FLOOR · 市場看板 / 賽後收據(休賽日 fallback)──── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14">
          <div className="flex items-baseline justify-between gap-3 mb-5 flex-wrap">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em]"
            >
              {upcoming.length > 0
                ? "/ 市場看板 · 今晚 / 即將"
                : "/ 引擎最近戰績 · 賽後收據"}
            </p>
            <Link
              href={upcoming.length > 0 ? "/matches" : "/track-record"}
              className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
            >
              {upcoming.length > 0 ? "全部賽事 →" : "完整戰績 →"}
            </Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((m) => (
                <MiniMatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : recentReceipts.length > 0 ? (
            <>
              <p className="mb-5 text-mute/85 text-sm leading-relaxed">
                休賽日 · 看引擎最近的判決 ·{" "}
                <span className="text-gold">✓ 中</span> /{" "}
                <span className="text-loss">✕ 沒中</span> 都掛,不藏。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentReceipts.map((m) => (
                  <MiniMatchCard key={m.id} match={m} />
                ))}
              </div>
            </>
          ) : (
            <EmptyFloor />
          )}
        </section>

        {/* ── 三步玩法 · 圖示卡(child-level · 圖取代字)──── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em] mb-6"
          >
            / 三步玩法
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <IconCard href="/matches" title="押一邊" sub="選你看好的隊" icon={<BetIcon />} />
            <IconCard href="/ladder" title="爬天梯" sub="準的往上爬" icon={<LadderIcon />} />
            <IconCard href="/calibration" title="看準度" sub="引擎準不準公開" icon={<TargetIcon />} />
          </div>
        </section>

        {/* ── 信任 chips(✓ 取代一串字)+ founders ───────── */}
        <section className="mx-auto max-w-3xl px-6 sm:px-10 pb-16 text-center border-t border-line/40 pt-10">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <PromiseChip>引擎免費</PromiseChip>
            <PromiseChip>方法公開</PromiseChip>
            <PromiseChip>不藏輸的</PromiseChip>
            <PromiseChip>不追蹤你</PromiseChip>
            <PromiseChip>不自動續扣</PromiseChip>
          </div>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] tracking-[0.3em]">
            <Link href="/audit" className="text-gold/80 hover:text-gold transition-colors">
              完整 audit →
            </Link>
            <span aria-hidden="true" className="text-mute/40">·</span>
            <Link href="/founders" className="text-mute hover:text-gold transition-colors">
              FOUNDERS 27 →
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// 三步玩法的圖示卡 · 圖 + 兩三個字 · 不放句子(child-level glance)
function IconCard({
  href,
  title,
  sub,
  icon,
}: {
  href: string;
  title: string;
  sub: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-center gap-2 p-3 sm:p-5 border border-line/60 bg-slate/30 hover:border-gold/50 hover:bg-slate/40 transition-colors group"
    >
      <span className="text-gold/80 group-hover:text-gold transition-colors">
        {icon}
      </span>
      <span className="text-bone text-sm sm:text-base font-light tracking-tight leading-snug">
        {title}
      </span>
      <span className="text-mute/70 text-[10px] sm:text-xs leading-tight">
        {sub}
      </span>
    </Link>
  );
}

// 信任承諾 chip · ✓ + 短詞 · 取代一整串「不…不…不…」
function PromiseChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 border border-gold/25 bg-gold/5 px-2.5 py-1 text-[11px] sm:text-xs tracking-wide text-bone/90">
      <span aria-hidden="true" className="text-gold text-[10px]">
        ✓
      </span>
      {children}
    </span>
  );
}

// ── 乾淨幾何線圖示(非可愛 emoji · 守品牌:量化分析師不是博彩公司)──
function BetIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="12" width="26" height="8" rx="4" />
      <line x1="16" y1="9" x2="16" y2="23" />
    </svg>
  );
}

function LadderIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 27 h6 v-6 h6 v-6 h6 v-6 h4" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="5.5" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EmptyFloor() {
  return (
    <div className="bg-slate/40 border border-line/60 p-8 sm:p-10 text-center">
      <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
        今日沒有排定的 CPBL 賽事
      </p>
      <p className="text-mute text-sm max-w-md mx-auto leading-relaxed mb-6">
        季外或休賽日。 往下看引擎最近的公開戰績 · 或自己跑一場模擬。
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/track-record"
          className="inline-block px-5 py-2 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
        >
          看公開戰績 →
        </Link>
        <Link
          href="/lab/custom"
          className="inline-block px-5 py-2 border border-line/60 text-mute font-mono text-[10px] tracking-[0.3em] hover:text-gold hover:border-gold/40 transition-colors"
        >
          自訂模擬 →
        </Link>
      </div>
    </div>
  );
}
