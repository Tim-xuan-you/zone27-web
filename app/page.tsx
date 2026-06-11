import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniMatchCard from "@/components/MiniMatchCard";
import YourRecordStrip from "@/components/YourRecordStrip";
import SoccerRecordCard from "@/components/SoccerRecordCard";
import Avatar from "@/components/Avatar";
import EngineThreeWayBar from "@/components/EngineThreeWayBar";
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
import { getCreatorPostCounts } from "@/lib/creator-posts-server";
import {
  getUpcomingWorldCupMatches,
  hasActiveWorldCup,
  getSoccerFinalizedResults,
  getSoccerEnginePicks,
  kickoffTaipei,
  type LockedSoccerPrediction,
} from "@/lib/soccer/locked";

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

  // ── 跨聯盟「今晚精選」(Polymarket 式策展)──────────────────────
  // 主頁不是賽事目錄(那是玩運彩的賠率牆)· 是「今晚最值得看的幾場 + 你的帳本」。
  // 規則:第一格錨定 CPBL 頭條(自家主場 · 報紙頭版 local-first · 品牌主場不從
  // 首頁消失),其餘按引擎把握度跨聯盟填(離 50% 越遠 = 引擎越敢喊 = 最有看法、
  // 最可被驗證的那幾場 · 可能是 MLB)。 這是「編輯策展(選看哪幾場)」· 跟「動真相
  //(賽果 / 結算)」是兩回事 —— 後者永遠不碰。 上幾種運動主頁形狀都不變 · 只是
  // 選池變大 = 結構天生可擴。
  const byConviction = (a: Match, b: Match) =>
    Math.max(b.home.winRate, b.away.winRate) -
    Math.max(a.home.winRate, a.away.winRate);
  const allUpcoming = [...cpblUpcoming, ...mlbUpcoming].sort(byConviction);
  const HOMEPAGE_CAP = 3; // mobile ≤ 3 viewport 鐵律 · 精選不是全部
  const cpblAnchor = [...cpblUpcoming].sort(byConviction)[0];
  const featured: Match[] = [];
  if (cpblAnchor) featured.push(cpblAnchor); // CPBL 頭條永遠有座位
  for (const m of allUpcoming) {
    if (featured.length >= HOMEPAGE_CAP) break;
    if (!featured.includes(m)) featured.push(m); // 其餘按把握度跨聯盟填(去重)
  }

  // 休賽日 fallback · 看板永不空白:全聯盟都沒可押賽事時 · 改放引擎最近賽後
  // 收據(✓命中 / ✕落空都掛)· proof-of-work 勝過空泛未來預測。
  const recentReceipts = allUpcoming.length === 0 ? finalized.slice(0, 2) : [];

  // 每場分析篇數 · 看板標「N 篇分析」讓用戶一眼看出哪場有大神可跟單(抽傭入口)。
  // 無 cookie anon fetch · 不破首頁 ISR 靜態。
  const analysisCounts = await getCreatorPostCounts();

  // ── 世界盃 rail(四年一次的窗 · 開站當晚把世界盃推到第一屏)──────────────
  // 純靜態(讀 lib/soccer-locked.json · 0 API · ISR-safe)· 引擎已賽前鎖死的場 +
  // 自己算的主/和/客 % 直接秀在首頁 = 賭徒最想要的「show me a pick」即時鉤子。
  // 世界盃結束後 wcActive 自動回 false → rail 自動收起(無需手動 revert)。
  const wcUpcoming = getUpcomingWorldCupMatches(2);
  // 世界盃還沒結束 = 還有任一場鎖定預測未對帳(verdict null)。 賽季全打完、全結算後
  // 自動回 false → rail 自動收起(舊版用 hasWorldCupLocked() 會因「收據永久保留」永遠 true)。
  const wcActive = hasActiveWorldCup();
  // 首頁足球回訪鉤子用的永久結算表(0 API · 讀 bundled locked.json · ISR-safe · 不依賴
  // FOOTBALL_DATA secret)+ 引擎當初鎖的看好邊(給「你 vs 引擎」同場對照)。
  const soccerFinalized = getSoccerFinalizedResults();
  const soccerEnginePicks = getSoccerEnginePicks();

  // 已結算賽事的勝方 · 傳給登入後個人戰績條(client 端用它評分本人押注 · 靜態
  // 資料無隱私問題)。 R198 · 併 MLB 已結算 → 押的 MLB 也計進首頁「你 vs 引擎」。
  // ⚠️ MLB 已結算結果一律用永久版 getMlbFinalizedResults()(讀 mlb-locked.json · 同
  // /ladder)· 不用 mlbAll(只有「昨天+今天」live 窗 → 押過的 MLB 場 2 天後掉出窗會
  // 從『已對帳』倒退回『進行中』· 帳本縮水 · 違反刪不掉的帳本)。
  const matchResults = [
    ...finalized.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      startISO: getMatchStartIso(m),
    })),
    ...(await getMlbFinalizedResults()),
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">
        {/* ── HERO · slim · market-first ─────────────── */}
        <section className="mx-auto max-w-5xl px-6 sm:px-10 pt-12 sm:pt-16 pb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-light leading-[1.08] tracking-tight text-bone">
            不靠直覺,<span className="text-gold">只看演算法。</span>
          </h1>
          {/* R221 第一屏視覺升級(Tim「您決定」· 設計稿先給過 · 一鍵可 revert):訊息一字不改
              (R216 鉤子全保留),只升層次 —— 四段平鋪 → 標語 + 招牌金線 + 一句狠話 + 一行支撐
              (Apple/Linear「一個 beat 然後留白」)。 */}
          {/* 招牌金髮絲線(zone27-rule · 黃金比例刻度)· 標語與情緒鉤子間留一道品牌記號的呼吸。 */}
          <div className="zone27-rule max-w-[300px] mx-auto mt-6 sm:mt-7" aria-hidden="true" />
          {/* 情緒鉤子升成第一屏主角(R216 訊息不動):最不可造假、對手抄不走的一句,放大成第一眼
              的情緒高潮。 行為類別不指名對手(晒單/刪文 · 守不指名鐵律)。 */}
          <p className="mt-7 max-w-xl mx-auto text-bone leading-snug text-xl sm:text-2xl font-light tracking-tight">
            別人贏了晒單、輸了刪文。 <span className="text-gold">我們贏輸都掛</span> —— 賽前鎖死、刪不掉。
          </p>
          {/* 支撐句(合併原本兩段:免費萬次 + 57% 神準)· 降成一行 mute · wall-of-text → 呼吸感。
              57% 誠實王牌仍在(收進支撐句)· 「喊神準的在騙你」打騙子角度保留。 */}
          <p className="mt-4 max-w-xl mx-auto text-mute leading-relaxed text-sm sm:text-base">
            免費跑一萬次告訴你誰會贏。 全世界最強的模型賽前單場也才{" "}
            <span className="text-bone">5 成 7</span> —— 喊「94% 神準」的,數學上在騙你。
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

          {/* 兩條路(R216 · 承 R207 的「點擊要有回饋」+ 解 4 輪討論的 conversion 結論):
              · 主金鈕(實心)= 看開盤 = 產品,世界盃夜導四年一次的主秀(allUpcoming 不含足球 →
                沒這條 wcActive 優先,CPBL/MLB 休賽時大金鈕會略過世界盃、誤導去棒球收據)。
              · 次金框(outline)= 校準練習 = 全站最強 0-登入 aha(消方塊式一拖就撞 57% 牆)·
                從原本角落 11px 小字救上來。 金框明顯次於實心金 → 仍守「一屏一焦點」(主清楚是金鈕)·
                只是把最強鉤子從耳語升成看得見的第二條路。 */}
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

        {/* ── 你 vs 引擎 · 回訪鉤子 · 只在登入且押過才出現 ──
            放在市場看板「之上」· 回訪的會員一進來先看到自己跟引擎誰準
            (= 明天回來的理由)· 不再被 hero CTA 跳過。 沒登入 / 0 押注 →
            自動隱藏 · 看板遞補為第一屏。 R189 改讀 DB(取代死掉的匿名版)。 */}
        <YourRecordStrip variant="home" matchResults={matchResults} />

        {/* ── 你的足球戰績 · 回訪鉤子(只押世界盃的人也有「明天回來看自己 vs 引擎」的理由)──
            棒球(YourRecordStrip)只算 fd-* 以外 · 足球兩本帳分開 · 用永久結算表(0 API ·
            ISR-safe)· 沒押足球 / 未登入 → 自動隱藏(graceful · 不破首頁極簡)。 */}
        {wcActive && (
          <SoccerRecordCard
            results={soccerFinalized}
            enginePicks={soccerEnginePicks}
            wrapperClass="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-2"
          />
        )}

        {/* ── 世界盃 rail · 開站當晚的頭條(四年一次)· 在 CPBL 看板「之上」───
            純靜態鎖定資料(0 API)· 把引擎自己算的主/和/客 % 直接攤在第一屏 ·
            賭徒一眼看到「引擎看好誰」→ 點進去押。 WC 結束自動收起。 */}
        {wcActive && <WorldCupRail upcoming={wcUpcoming} />}

        {/* ── THE FLOOR · 市場看板 / 賽後收據(休賽日 fallback)──── */}
        <section id="floor" className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14 scroll-mt-20">
          <div className="flex items-baseline justify-between gap-3 mb-5 flex-wrap">
            <p
              className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.45em]"
            >
              {allUpcoming.length > 0
                ? "/ 接下來精選"
                : "/ 引擎最近戰績 · 賽後收據"}
            </p>
            <Link
              href={allUpcoming.length > 0 ? "/matches" : "/track-record"}
              className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
            >
              {allUpcoming.length > 0
                ? `接下來全部 ${allUpcoming.length} 場 →`
                : "完整戰績 →"}
            </Link>
          </div>
          {allUpcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((m) => (
                <MiniMatchCard key={m.id} match={m} analysisCount={analysisCounts[m.id] ?? 0} />
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
                  <MiniMatchCard key={m.id} match={m} analysisCount={analysisCounts[m.id] ?? 0} />
                ))}
              </div>
            </>
          ) : (
            <EmptyFloor />
          )}
        </section>

        {/* 非世界盃期間(wcActive=false)· 才退回原本安靜的足球入口卡。 */}
        {!wcActive && (
          <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14">
            <Link
              href="/soccer"
              className="block bg-slate/30 border border-gold/30 hover:border-gold/40 hover:bg-slate/40 transition-colors p-4 sm:p-5 group"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-mono text-gold text-[10px] tracking-[0.35em] mb-1">
                    足球 · 引擎開盤
                  </p>
                  <p className="text-bone text-sm sm:text-base font-light leading-snug">
                    各大聯賽 · 我們<span className="text-gold">自己算</span>的勝 / 平 / 負
                    (不是盤口)· 押一邊試試
                  </p>
                </div>
                <span className="shrink-0 font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.3em]">
                  看足球 →
                </span>
              </div>
            </Link>
          </section>
        )}

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

// ── 世界盃 rail · 開站當晚頭條 ───────────────────────────────────
// 引擎賽前鎖死的世界盃場 + 自己算的主/和/客 % 直接秀(賭徒要的「給我一個 pick」)。
// 全靜態、無 API、無 client(首頁 ISR 不破)· 暗金、無紅綠、無 emoji。
function WorldCupRail({ upcoming }: { upcoming: LockedSoccerPrediction[] }) {
  return (
    <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-14">
      <div className="border border-gold/40 bg-slate/30 p-5 sm:p-7">
        <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
          <p className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em]">
            / 世界盃 · 引擎已賽前鎖死
          </p>
          <Link
            href="/soccer"
            className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
          >
            看全部 · 押一邊 →
          </Link>
        </div>
        <p className="text-bone text-lg sm:text-2xl font-light tracking-tight leading-snug mb-1">
          四年一次 · <span className="text-gold">引擎自己算</span>的勝 / 平 / 負
        </p>
        <p className="text-mute text-[13px] sm:text-sm leading-relaxed mb-5">
          台北 6/12 凌晨開踢 · 賽前鎖死、賽後逐場對帳 ·{" "}
          <span className="text-mute/70">不是盤口 · 連輸的都留著</span>
        </p>

        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcoming.map((m) => (
              <WorldCupRailCard key={m.matchId} m={m} />
            ))}
          </div>
        ) : (
          <Link
            href="/soccer"
            className="inline-flex items-center gap-2 font-mono text-gold/90 hover:text-gold text-xs tracking-[0.25em] transition-colors"
          >
            世界盃進行中 · 看引擎開盤 →
          </Link>
        )}
      </div>
    </section>
  );
}

// 世界盃單場（首頁 rail）· 隊徽 + 隊名 + 三向 % + favored 上金 + 三段條（同 SoccerMatchCard 語彙）。
// 點擊帶 #m-{matchId} 錨點 → 落地到 /soccer 該場那張卡(不是清單頂端 · 接起「看到 pick → 去押」漏斗）。
function WorldCupRailCard({ m }: { m: LockedSoccerPrediction }) {
  const ko = kickoffTaipei(m.kickoffISO);
  // 上金的邊綁 enginePick(原始機率 argmax)· 不從展示%重算 → 金條/金數字與「引擎看好 X」永遠同源。
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
