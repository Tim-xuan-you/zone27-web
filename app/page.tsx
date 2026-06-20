import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniMatchCard from "@/components/MiniMatchCard";
import YourRecordStrip from "@/components/YourRecordStrip";
import SoccerRecordCard from "@/components/SoccerRecordCard";
import Avatar from "@/components/Avatar";
import EngineThreeWayBar from "@/components/EngineThreeWayBar";
import HomepagePulseStrip from "@/components/HomepagePulseStrip";
import HomepageTableStrip from "@/components/HomepageTableStrip";
import { getNationalCode } from "@/lib/soccer/teams";
import {
  getTodayAndFutureMatches,
  getFinalizedMatches,
  getTrackRecordStats,
  getMatchStartIso,
  getMatchPhase,
  type Match,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbFinalizedResults } from "@/lib/mlb-matches";
import { getMatchHeat, heatDisplayFor } from "@/lib/match-heat";
import { getPulseSummary } from "@/lib/pulse";
import { getTableCalls } from "@/lib/table-picks";
import {
  getUpcomingWorldCupMatches,
  hasActiveWorldCup,
  getSoccerFinalizedResults,
  getSoccerEnginePicks,
  kickoffTaipei,
  type LockedSoccerPrediction,
} from "@/lib/soccer/locked";

// ── ZONE 27 · Homepage · 一屏一焦點(R249 Defector 收乾淨)──────────
// Tim「Defector go · 任何網站都比我們簡潔 · 我們有夠亂」(對手把預測鎖牆收費 ·
// 我們相反)· per [[feedback-zone27-homepage-minimalism]] subtraction-first。
//
// 前門只留一個主角:一句頭條(贏輸都掛、賽前鎖死=對手抄不走的那句)+ 一張會說話
// 的「今晚一手」pick 卡(WC 頭條 / 跨聯盟把握度最高 / 休賽日最近判決)+ 兩條路。
// 舊「市場看板 3 卡 + 世界盃 rail box + 足球入口卡」全收進「看全部 →」(賽事板仍在
// /matches、/soccer · 深度頁仍在 Nav)。 資料層 0 改動(全部真資料 · graceful 隱藏)。
// 一張卡會說話,勝過一面搶眼的牆。
// ─────────────────────────────────────────────────────

export const revalidate = 600; // ISR · 賽事 lifecycle transitions

export default async function Home() {
  const cpblUpcoming = getTodayAndFutureMatches(); // 今晚 + 即將 · asc
  const finalized = getFinalizedMatches();
  const tr = getTrackRecordStats();

  // MLB:一次抓 · 同時供「今晚可押」+「個人戰績評分」(避免重複 fetch live API)。
  const mlbAll = await getMlbAsMatches();
  const mlbUpcoming = mlbAll.filter((m) => {
    const ph = getMatchPhase(m);
    return ph === "today-pregame" || ph === "today-live" || ph === "future";
  });

  // ── 跨聯盟「今晚一手」(Polymarket 式策展 · 但只挑一張)──────────────────
  // 第一格錨定 CPBL 頭條(自家主場 local-first),其餘按引擎把握度跨聯盟填(離 50%
  // 越遠 = 引擎越敢喊)。 編輯策展(選看哪場)· 跟動真相(賽果)是兩回事 —— 後者永不碰。
  const byConviction = (a: Match, b: Match) =>
    Math.max(b.home.winRate, b.away.winRate) -
    Math.max(a.home.winRate, a.away.winRate);
  const allUpcoming = [...cpblUpcoming, ...mlbUpcoming].sort(byConviction);
  const HOMEPAGE_CAP = 3;
  const cpblAnchor = [...cpblUpcoming].sort(byConviction)[0];
  const featured: Match[] = [];
  if (cpblAnchor) featured.push(cpblAnchor); // CPBL 頭條永遠有座位
  for (const m of allUpcoming) {
    if (featured.length >= HOMEPAGE_CAP) break;
    if (!featured.includes(m)) featured.push(m);
  }

  // 休賽日 fallback · 前門永不空白:全聯盟都沒可押賽事時 · 改放引擎最近賽後判決
  //(✓命中 / ✕落空都掛)· proof-of-work 勝過空泛未來預測。
  const recentReceipts = allUpcoming.length === 0 ? finalized.slice(0, 2) : [];

  // 每場熱度(鎖定人數 + 分析篇數)· 無 cookie anon · 不破首頁 ISR · 0 migration。
  const matchHeat = await getMatchHeat();
  const featuredHeat = heatDisplayFor(matchHeat, featured.map((m) => m.id));

  // ── 活動脈動精華(會動的前門)· 最近 N 人賽前鎖定 + 最新一手 ────────────────
  const pulseSummary = await getPulseSummary();

  // ── 今晚這桌(誠實收據)· 真人賽前鎖的任意一注 + 賽後對帳成績(含落空)──────────
  const tableSummary = getTableCalls();

  // ── 世界盃(四年一次的窗)· 引擎已賽前鎖死的場 ──────────────
  const wcUpcoming = getUpcomingWorldCupMatches(2);
  const wcActive = hasActiveWorldCup();
  const soccerFinalized = getSoccerFinalizedResults();
  const soccerEnginePicks = getSoccerEnginePicks();

  // 已結算賽事的勝方 · 傳給登入後個人戰績條(client 端評分本人押注 · 靜態資料無隱私問題)。
  const matchResults = [
    ...finalized.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      startISO: getMatchStartIso(m),
    })),
    ...(await getMlbFinalizedResults()),
  ];

  // ── 今晚的一手 · 單一主角 ─────────────────────────────────────────
  // WC 頭條 → 跨聯盟把握度最高 → 休賽日最近判決。 其餘收進「看全部 →」。
  const showCpblLink = wcActive && cpblUpcoming.length > 0;
  const heroPick: {
    label: string;
    allHref: string;
    allText: string;
    card: ReactNode;
    caption: string;
  } | null = (() => {
    if (wcActive && wcUpcoming.length > 0) {
      return {
        label: "/ 今晚頭條 · 世界盃 · 引擎已賽前鎖死",
        allHref: "/soccer",
        allText: "看世界盃全部 →",
        card: <WorldCupRailCard m={wcUpcoming[0]} />,
        caption: "賽前鎖死、賽後逐場對帳 · 不是盤口 · 連輸的都留著。",
      };
    }
    const topUpcoming = featured[0];
    if (topUpcoming) {
      return {
        label: "/ 今晚這場 · 引擎開的盤",
        allHref: "/matches",
        allText: `看接下來 ${allUpcoming.length} 場 →`,
        card: (
          <MiniMatchCard
            match={topUpcoming}
            analysisCount={matchHeat[topUpcoming.id]?.analyses ?? 0}
            heat={featuredHeat[topUpcoming.id]}
          />
        ),
        caption: "賽前鎖死、賽後對帳 · 連輸的也掛,刪不掉。",
      };
    }
    const topReceipt = recentReceipts[0];
    if (topReceipt) {
      return {
        label: "/ 引擎最近的判決",
        allHref: "/track-record",
        allText: "看完整戰績 →",
        card: (
          <MiniMatchCard
            match={topReceipt}
            analysisCount={matchHeat[topReceipt.id]?.analyses ?? 0}
          />
        ),
        caption: "休賽日 · ✓ 中 / ✕ 沒中 都掛,不藏。",
      };
    }
    return null;
  })();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">
        {/* ── HERO · 一句頭條(Defector 式單一主標)─────────────── */}
        <section className="mx-auto max-w-5xl px-6 sm:px-10 pt-12 sm:pt-16 pb-8 text-center">
          {/* AI 放上前門(Tim 要)· 但走 honest AI:名分=「AI 勝率引擎」緊接「公開準度」=
              在被「AI 神準」洗到麻木的市場,唯一敢公開 AI 到底準幾成的那個。 */}
          <p className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em] mb-6">
            AI 勝率引擎 · 公開準度
          </p>
          {/* 單一頭條:把最不可造假、對手抄不走的一句當第一屏唯一主標(不再雙標題)。
              行為類別不指名對手(晒單 / 刪文)。 */}
          <h1 className="text-3xl sm:text-5xl font-light leading-[1.14] tracking-tight text-bone max-w-2xl mx-auto">
            別人贏了晒單,輸了刪文。
            <br />
            <span className="text-gold">我們贏輸都掛 —— 賽前鎖死,刪不掉。</span>
          </h1>
          {/* 招牌金髮絲線(zone27-rule)· 一道品牌記號的呼吸。 */}
          <div className="zone27-rule max-w-[300px] mx-auto mt-7" aria-hidden="true" />
          {/* 支撐句:57% 誠實王牌 · 一行 mute · 打「喊神準=騙你」角度。 */}
          <p className="mt-7 max-w-xl mx-auto text-mute leading-relaxed text-sm sm:text-base">
            免費讓 AI 跑一萬次告訴你誰會贏。 連全世界最強的 AI,賽前單場也才{" "}
            <span className="text-bone">5 成 7</span> —— 喊「94% 神準」的,數學上在騙你。
          </p>
          {/* 引擎戰績 · Pratfall「連輸的也掛」· 一行安靜的 proof(不是按鈕)· 永遠不刪。 */}
          {tr.total > 0 && (
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
              <span className="text-mute text-[9px] tracking-[0.2em]">連輸的也掛 →</span>
            </Link>
          )}

          {/* 兩條路:主金鈕=看開盤(產品 · WC 夜導四年一次主秀)· 次金框=校準練習
              (全站最強 0-登入 aha)。 一屏一焦點(主清楚是金鈕)。 */}
          <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href={wcActive ? "/soccer" : allUpcoming.length > 0 ? "/matches" : "/track-record"}
              className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-xs sm:text-sm tracking-[0.25em] px-6 py-3 hover:bg-gold-soft transition-colors"
            >
              {wcActive
                ? "看世界盃 · 引擎開盤 →"
                : allUpcoming.length > 0
                  ? "看今晚誰會贏 →"
                  : "看引擎最近戰績 →"}
            </Link>
            <Link
              href="/calibration/test"
              className="inline-flex items-center gap-2 border border-gold/45 text-gold font-mono text-xs sm:text-sm tracking-[0.2em] px-6 py-3 hover:border-gold hover:bg-gold/5 transition-colors"
            >
              先測你自己多準 · 30 秒 →
            </Link>
          </div>
        </section>

        {/* ── 今晚的一手 · 單一主角卡(取代舊看板 3 卡 + WC rail box + 足球入口卡)──
            只秀今晚最值得看的「一張」引擎已鎖死的 pick · 其餘收進「看全部 →」。 */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12">
          {heroPick ? (
            <>
              <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
                <p className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em]">
                  {heroPick.label}
                </p>
                <span className="flex items-baseline gap-3 font-mono text-[10px] tracking-[0.3em]">
                  <Link
                    href={heroPick.allHref}
                    className="text-mute/70 hover:text-gold transition-colors"
                  >
                    {heroPick.allText}
                  </Link>
                  {showCpblLink && (
                    <Link
                      href="/matches"
                      className="text-mute/70 hover:text-gold transition-colors"
                    >
                      · CPBL 今晚 →
                    </Link>
                  )}
                </span>
              </div>
              {heroPick.card}
              <p className="mt-3 text-mute/80 text-xs sm:text-sm leading-relaxed text-center">
                {heroPick.caption}
              </p>
            </>
          ) : (
            <EmptyFloor />
          )}
        </section>

        {/* ── 今晚這桌條 · 真人鎖的任意一注 + 賽後誠實對帳(含落空)→ /table ──
            前門頭條「贏輸都掛」的真人實證 · 空桌 → 自動隱藏(graceful)。 */}
        <HomepageTableStrip summary={tableSummary} />

        {/* ── 活動脈動條 · 會動的前門 · 最近 N 人賽前鎖定 → /pulse ──
            不到門檻 / 0 用戶 → 自動隱藏(graceful · 守首頁極簡)。 */}
        <HomepagePulseStrip summary={pulseSummary} />

        {/* ── 你 vs 引擎 · 回訪鉤子 · 只在登入且押過才出現(否則自動隱藏)── */}
        <YourRecordStrip variant="home" matchResults={matchResults} />

        {/* ── 你的足球戰績 · 回訪鉤子 · 沒押足球 / 未登入 → 自動隱藏 ── */}
        {wcActive && (
          <SoccerRecordCard
            results={soccerFinalized}
            enginePicks={soccerEnginePicks}
            wrapperClass="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-2"
          />
        )}

        {/* ── 三步玩法 · 圖示卡(child-level · 圖取代字)──── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em] mb-6">
            / 三步玩法
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <IconCard href="/matches" title="押一邊" sub="選你看好的隊" icon={<BetIcon />} />
            <IconCard href="/ladder" title="爬天梯" sub="準的往上爬" icon={<LadderIcon />} />
            <IconCard href="/calibration" title="看準度" sub="引擎準不準公開" icon={<TargetIcon />} />
          </div>
        </section>

        {/* ── 信任 chips(✓ 取代一串字)+ 深度頁 ───────── */}
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
            <Link href="/membership" className="text-mute hover:text-gold transition-colors">
              撐著它的人 →
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// 世界盃單場（首頁一手卡）· 隊徽 + 隊名 + 三向 % + favored 上金 + 三段條。
// 點擊帶 #m-{matchId} 錨點 → 落地到 /soccer 該場那張卡。
function WorldCupRailCard({ m }: { m: LockedSoccerPrediction }) {
  const ko = kickoffTaipei(m.kickoffISO);
  const homeGold = m.enginePick === "home";
  const drawGold = m.enginePick === "draw";
  const awayGold = m.enginePick === "away";
  const favoredLabel =
    m.enginePick === "home" ? m.home : m.enginePick === "away" ? m.away : "和局";
  return (
    <Link
      href={`/soccer#m-${m.matchId}`}
      className="block bg-slate/40 border border-line/60 hover:border-gold/40 transition-colors p-4 group"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-gold/70 text-[9px] tracking-[0.3em]">世界盃</span>
        <span className="font-mono text-mute text-[9px] tracking-[0.25em] tabular shrink-0">
          {ko} <span className="text-mute/50">TPE</span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="flex items-center gap-2 min-w-0">
          <Avatar seed={m.homeSeed} glyph={getNationalCode(m.homeSeed) ?? undefined} size={22} />
          <span className="text-bone text-base font-light tracking-tight truncate">{m.home}</span>
        </span>
        <span className="font-mono text-mute/50 text-[10px] shrink-0">vs</span>
        <span className="flex items-center gap-2 min-w-0 justify-end">
          <span className="text-bone text-base font-light tracking-tight truncate text-right">
            {m.away}
          </span>
          <Avatar seed={m.awaySeed} glyph={getNationalCode(m.awaySeed) ?? undefined} size={22} />
        </span>
      </div>
      <div className="flex items-baseline justify-between font-mono tabular mb-1.5">
        <RailPct label="主勝" value={m.homeWinPct} gold={homeGold} align="left" />
        <RailPct label="和" value={m.drawPct} gold={drawGold} align="center" />
        <RailPct label="客勝" value={m.awayWinPct} gold={awayGold} align="right" />
      </div>
      <EngineThreeWayBar
        homePct={m.homeWinPct}
        drawPct={m.drawPct}
        awayPct={m.awayWinPct}
        goldSide={m.enginePick}
      />
      <p className="mt-2.5 font-mono text-mute/70 text-[10px] tracking-[0.1em] group-hover:text-gold/80 transition-colors">
        引擎看好 <span className="text-bone group-hover:text-gold">{favoredLabel}</span> · 押一邊 →
      </p>
    </Link>
  );
}

function RailPct({
  label,
  value,
  gold,
  align,
}: {
  label: string;
  value: number;
  gold: boolean;
  align: "left" | "center" | "right";
}) {
  const alignCls =
    align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center";
  return (
    <span className={`flex flex-col ${alignCls} gap-0.5`}>
      <span className={`text-lg font-light ${gold ? "text-gold" : "text-mute"}`}>
        {value}
        <span className="text-[10px] opacity-60">%</span>
      </span>
      <span className="text-mute/65 text-[9px] tracking-[0.1em]">{label}</span>
    </span>
  );
}

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
      className="flex flex-col items-center text-center gap-2 p-3 sm:p-5 border border-line/60 bg-slate/30 hover:border-gold/40 hover:bg-slate/40 transition-colors group"
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
        目前沒有排定的賽事
      </p>
      <p className="text-mute text-sm max-w-md mx-auto leading-relaxed mb-6">
        休賽日。 往下看引擎最近的公開戰績 · 或自己跑一場模擬。
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
