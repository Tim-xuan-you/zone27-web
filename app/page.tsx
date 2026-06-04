import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniMatchCard from "@/components/MiniMatchCard";
import YourRecordStrip from "@/components/YourRecordStrip";
import {
  getTodayAndFutureMatches,
  getFinalizedMatches,
  getTrackRecordStats,
  getMatchStartIso,
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
  // 收據(✓命中 / ✕落空都掛)· per getFeaturedMatch 哲學「引擎沒在跑時,
  // proof-of-work(收據)勝過空泛的未來預測 = 轉換槓桿」。 首頁 2 場上限
  // (mobile ≤ 3 viewport 鐵律 · 看完整去 /track-record)。
  const finalized = getFinalizedMatches();
  const recentReceipts = upcoming.length === 0 ? finalized.slice(0, 2) : [];
  const tr = getTrackRecordStats();
  // 已結算賽事的勝方 · 傳給登入後個人戰績條(client 端用它評分本人押注 ·
  // 靜態資料 · 無隱私問題)。 首頁維持 ISR 靜態,戰績條 hydrate 後才填本人資料。
  const matchResults = finalized.map((m) => ({
    id: m.id,
    finalWinner: m.finalResult?.winner ?? null,
    startISO: getMatchStartIso(m),
  }));

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
          {/* 誠實鉤子 = flex(不是道歉)· R195 去暗化(原 text-mute/70 fine-print 讀起來
              像心虛)+ 措辭領頭打騙子 · per 轉換 agent「57% 該以強項領頭、不是耳語」·
              把全世界的天花板掛出來當招牌 = 對手 94% fake-win-rate 的誠實 inverse。 */}
          <p className="mt-3 max-w-xl mx-auto text-mute leading-relaxed text-sm sm:text-base">
            全世界沒有「神準」這回事 —— 連最強的模型,賽前單場也才{" "}
            <span className="text-bone">5 成 7</span>。 喊「94% 神準」的,數學上在騙你。
            我們不喊神準 · 只<span className="text-gold">逐場對帳給你看</span>。
          </p>
          {/* 引擎戰績 · Pratfall「連輸的也掛」· compact · 永遠不刪 */}
          {tr.total > 0 && (
            // 量化品牌:hero 只留一個「按鈕」= 下方金色 CTA。 戰績是 proof 不是
            // 按鈕 · 拿掉 border/bg 框 · 降成一行安靜的 mono · 數字仍金(訊號)·
            // ✓/✕ 維持品牌收據色(揭露對等 · 不偏袒 PROVED)。
            <Link
              href="/track-record"
              className="mt-5 inline-flex items-baseline gap-2.5 sm:gap-3 font-mono tabular flex-wrap justify-center hover:opacity-80 transition-opacity"
              aria-label={`公開戰績 · ${tr.total} 場已對賬 · 引擎命中 ${tr.proved} · 落空 ${tr.diverged}`}
            >
              <span className="text-mute text-[10px] tracking-[0.3em]">引擎戰績</span>
              <span className="text-bone text-sm">
                <strong className="text-gold">{tr.total}</strong> 場
              </span>
              <span className="text-gold text-sm">✓{tr.proved}</span>
              <span className="text-loss/85 text-sm">✕{tr.diverged}</span>
              <span className="text-mute/60 text-[9px] tracking-[0.2em]">連輸的也掛 →</span>
            </Link>
          )}

          {/* 主 CTA · hero 唯一實心金鈕(C2:解兩個競爭 CTA · gold discipline 一屏一焦點)*/}
          <div className="mt-7">
            <a
              href="#floor"
              className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-xs sm:text-sm tracking-[0.25em] px-6 py-3 hover:bg-gold-soft transition-colors"
            >
              {upcoming.length > 0 ? "↓ 看今晚誰會贏" : "↓ 看引擎最近戰績"}
            </a>
          </div>
          {/* 校準遊戲 = 安靜次要文字鏈(降為次要 · 不跟主金鈕搶)· 仍是最強 0-登入 hook:
              先別下注、先測你自己 → 把 57% 從 claim 變訪客自己發現的 aha。 */}
          <div className="mt-3">
            <Link
              href="/calibration/test"
              className="font-mono text-mute/70 hover:text-gold text-[11px] tracking-[0.18em] underline-offset-4 hover:underline transition-colors"
            >
              還不信?先測你自己有多準 →
            </Link>
          </div>
        </section>

        {/* ── 你 vs 引擎 · 回訪鉤子 · 只在登入且押過才出現 ──
            放在市場看板「之上」· 回訪的會員一進來先看到自己跟引擎誰準
            (= 明天回來的理由)· 不再被 hero CTA 跳過。 沒登入 / 0 押注 →
            自動隱藏 · 看板遞補為第一屏。 R189 改讀 DB(取代死掉的匿名版)。 */}
        <YourRecordStrip variant="home" matchResults={matchResults} />

        {/* ── THE FLOOR · 市場看板 / 賽後收據(休賽日 fallback)──── */}
        <section id="floor" className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14 scroll-mt-20">
          <div className="flex items-baseline justify-between gap-3 mb-5 flex-wrap">
            <p
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
            <PromiseChip href="/methodology">方法公開</PromiseChip>
            <PromiseChip href="/track-record">不藏輸的</PromiseChip>
            <PromiseChip>不追蹤你</PromiseChip>
            <PromiseChip>不自動續扣</PromiseChip>
          </div>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] tracking-[0.3em]">
            <Link href="/audit" className="text-gold/80 hover:text-gold transition-colors">
              完整 audit →
            </Link>
            <span aria-hidden="true" className="text-mute/40">·</span>
            <Link href="/founders" className="text-mute hover:text-gold transition-colors">
              GOLD →
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
function PromiseChip({ children, href }: { children: ReactNode; href?: string }) {
  // V1 gold discipline(轉換 agent)· 5 個金框金底 chip 讓金色失焦 → 降成灰框 ·
  // 只留 ✓ 是金(訊號)· 把焦點還給主金鈕 + 金色戰績數字。
  const base =
    "inline-flex items-center gap-1 border border-line/60 px-2.5 py-1 text-[11px] sm:text-xs tracking-wide text-bone/85";
  const inner = (
    <>
      <span aria-hidden="true" className="text-gold text-[10px]">
        ✓
      </span>
      {children}
      {href && (
        <span aria-hidden="true" className="text-gold/50 text-[9px] ml-0.5">
          →
        </span>
      )}
    </>
  );
  // 可點的承諾 = 點下去直接攤證據(方法公開→白皮書 · 不藏輸的→公開戰績)·
  // costly signal:別人的「保證」是空話 · 我們的承諾按一下就見真章。
  return href ? (
    <Link
      href={href}
      className={`${base} hover:border-gold/50 hover:bg-gold/10 transition-colors`}
    >
      {inner}
    </Link>
  ) : (
    <span className={base}>{inner}</span>
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
