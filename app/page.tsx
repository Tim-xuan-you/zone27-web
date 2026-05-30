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
  const receipts = getFinalizedMatches().slice(0, 6); // 最近結算 · newest first
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
          <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-mute leading-relaxed text-sm sm:text-base">
            台灣 CPBL 預測市場 · 引擎免費跑 1 萬次給你看 · 群眾一起押 · 準的爬上天梯。{" "}
            <span className="text-bone">不藏結果 · 不抽下注 · 不收明牌費。</span>
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

        {/* ── THE FLOOR · 市場看板(每場 = 一張市場卡)──── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14">
          <div className="flex items-baseline justify-between gap-3 mb-5 flex-wrap">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em]"
            >
              / 市場看板 · 今晚 / 即將
            </p>
            <Link
              href="/matches"
              className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
            >
              全部賽事 →
            </Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((m) => (
                <MiniMatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <EmptyFloor />
          )}
        </section>

        {/* ── 最近結算 · receipts(PROVED vs DIVERGED 等大)── */}
        {receipts.length > 0 && (
          <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14 border-t border-line/40 pt-12">
            <div className="flex items-baseline justify-between gap-3 mb-5 flex-wrap">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em]"
              >
                / 最近結算 · PROVED vs DIVERGED
              </p>
              <Link
                href="/track-record"
                className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
              >
                完整戰績 →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts.map((m) => (
                <MiniMatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        )}

        {/* ── 怎麼玩 · 引擎免費 · 你來較勁 ──────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em] mb-5"
          >
            / 怎麼玩 · 引擎免費 · 你來較勁
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PlayCard
              href="/ladder"
              tag="海選天梯"
              body="誰最準 · 從新秀爬到神諭 · 樣本加權排名。"
              live
            />
            <PlayCard
              href="/matches"
              tag="賽事討論室"
              body="每場開放討論 · 免費看 · 登入發言 · 掛你的天梯名次。"
              live
            />
            <PlayCard
              href="/calibration"
              tag="引擎自評"
              body="引擎準不準 · 公開打分 · 連 over-confidence 都列。"
              live
            />
            <PlayCard
              href="/membership"
              tag="創作者分析"
              body="高手發文賣分析 · 每篇掛天梯名次 · 平台抽 5-10%。即將上線。"
            />
          </div>
        </section>

        {/* ── F6 negations(Pratfall · 永遠不刪)+ founders + 靈魂 ── */}
        <section className="mx-auto max-w-3xl px-6 sm:px-10 pb-16 text-center border-t border-line/40 pt-10">
          <p className="font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.18em] leading-relaxed">
            <span className="text-bone">不藏 DIVERGED</span>
            <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
            <span className="text-bone">不抽下注分成</span>
            <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
            <Link
              href="/learn#why-not-gambling"
              className="text-bone underline decoration-mute/40 underline-offset-4 hover:decoration-gold hover:text-gold transition-colors"
            >
              不分潤博彩
            </Link>
            <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
            <span className="text-bone">不追蹤您</span>
            <span aria-hidden="true" className="text-mute/50 mx-2">·</span>
            <span className="text-gold">不自動續扣</span>
          </p>
          <p className="mt-5 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em]">
            <Link href="/audit" className="text-gold/80 hover:text-gold transition-colors">
              完整 audit →
            </Link>
            <span aria-hidden="true" className="text-mute/40">·</span>
            <Link href="/founders" className="text-mute hover:text-gold transition-colors">
              FOUNDERS 27 · NT$ 2,700/年 →
            </Link>
          </p>
          <p className="mt-5 font-mono text-mute/60 text-[9px] tracking-[0.3em]">
            —{" "}
            <Link href="/about" className="hover:text-gold transition-colors">
              TIM · CPBL 球迷 27 年
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function PlayCard({
  href,
  tag,
  body,
  live,
}: {
  href: string;
  tag: string;
  body: string;
  live?: boolean;
}) {
  return (
    <Link
      href={href}
      className="block p-4 sm:p-5 border border-line/60 bg-slate/30 hover:border-gold/50 hover:bg-slate/40 transition-colors group"
    >
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="text-bone text-base font-light tracking-tight group-hover:text-gold transition-colors">
          {tag}
        </span>
        <span
          className={`font-mono text-[8px] tracking-[0.25em] px-1.5 py-0.5 border ${
            live ? "border-gold/50 text-gold" : "border-mute/40 text-mute/70"
          }`}
        >
          {live ? "LIVE" : "即將"}
        </span>
      </div>
      <p className="text-mute text-xs sm:text-sm leading-relaxed">{body}</p>
    </Link>
  );
}

function EmptyFloor() {
  return (
    <div className="bg-slate/40 border border-line/60 p-10 text-center">
      <p lang="en" className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-4">
        ENGINE READY · NO MATCHES LOADED
      </p>
      <p className="text-mute text-sm max-w-md mx-auto leading-relaxed">
        目前沒有排定的賽事(季外或資料更新中)。 引擎隨時可在自訂模式跑模擬。
      </p>
      <Link
        href="/lab/custom"
        className="inline-block mt-6 font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
      >
        進入自訂實驗室 →
      </Link>
    </div>
  );
}
