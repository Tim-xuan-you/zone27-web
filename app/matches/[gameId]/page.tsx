import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import EngineGate from "@/components/EngineGate";
import StatPercentileBar from "@/components/StatPercentileBar";
import MarketSplitBar from "@/components/MarketSplitBar";
import CreatorAnalysis from "@/components/CreatorAnalysis";
import UserPredictionPicker from "@/components/UserPredictionPicker";
import ReceiptForwardButton from "@/components/ReceiptForwardButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import SettlementResolution from "@/components/SettlementResolution";
import TonightMatchRail from "@/components/TonightMatchRail";
import {
  getMatchById,
  getAllMatchIds,
  getMatchPhase,
  getCalibration,
  getEnginePctOnWinner,
  getEngineFavorite,
  getMatchStartIso,
  getTodayMatches,
  getFinalizedMatches,
  type Match,
  type MatchPhase,
  type Calibration,
} from "@/lib/matches";
import { getEngineConviction } from "@/lib/conviction";
import { getEngineReasoning, type EngineReasoning } from "@/lib/reasoning";
import { teamIdentity } from "@/lib/identity";
import { getMlbMatchById } from "@/lib/mlb-matches";

// ── ZONE 27 · /matches/[gameId] · 市場頁(R175 Polymarket pivot)──
// Tim 2026-05-30「資訊多到爆炸 · 划不到底 · 該刪就刪 · 變成 Polymarket」·
// per memory/project_zone27_polymarket_pivot.md + [[feedback-zone27-homepage-minimalism]]。
//
// 從 1286 行 · 20 段 · 7 lens widget 砍成一張乾淨的市場頁:
//   隊伍 → 引擎開盤線 + 進場(群眾線)→ 賽後結果 → 討論 → 投手(精簡)→ 比分 → 自己跑。
// 砍掉:7 LENS CANVAS · ENGINE TRACE · narrative essay · team panel · follow/
//   note/founders CTA · how-we-compute · recent form · coin-flip strip · related
//   reading。 元件全保留(其他頁可能用)· 一個 git revert 可回。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // 24h ISR

export function generateStaticParams() {
  return getAllMatchIds().map((gameId) => ({ gameId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>;
}): Promise<Metadata> {
  const { gameId } = await params;
  const match =
    getMatchById(gameId) ??
    (gameId.startsWith("mlb-") ? await getMlbMatchById(gameId) : null) ??
    undefined;
  if (!match) return { title: "Match not found" };
  // MLB 引擎是 Log5 公式(非逐打席 10K sim)· description 別誤掛「自己跑 10K」
  const simNote =
    match.league === "MLB" ? "" : " · 站內可自己跑 10K 逐打席模擬";
  return {
    title: `${match.home.name} vs ${match.away.name} · ${match.league}`,
    description: `引擎開盤線 · 賽前鎖定 — ${match.home.name} ${match.home.winRate}% / ${match.away.name} ${match.away.winRate}%${simNote}。${match.home.pitcher.name} vs ${match.away.pitcher.name}。`,
  };
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  // R198 · MLB 全套:詳情頁也吃 "mlb-{gamePk}"(轉接 lib/mlb-matches · async lookup)。
  // CPBL 走 static getMatchById(SSG)· MLB 動態 ISR(dynamicParams 預設開)。
  const match =
    getMatchById(gameId) ??
    (gameId.startsWith("mlb-") ? await getMlbMatchById(gameId) : null);
  if (!match) notFound();

  const m = match as Match;
  // 統一 favorite 判定(平手 null = 兩邊都不上金)· 解掉散落的 `>=` / `>` 不一致
  const fav = getEngineFavorite(m);
  const homeFavored = fav === "home";
  const awayFavored = fav === "away";
  const phase = getMatchPhase(m);
  const calibration = getCalibration(m);
  const enginePctOnWinner = getEnginePctOnWinner(m);
  const startISO = getMatchStartIso(m);
  // 引擎信心溫度 · 同卡片同一套中文詞(勢均力敵/看好/重壓)· 取代英文 SIGNAL 條
  // (解兩套信心系統打架 + 英文黑話漏到 hero)· 純從開盤線 favorite % 衍生 · 不另立 aiConfidence 第二尺
  const conviction = getEngineConviction(Math.max(m.home.winRate, m.away.winRate));
  // 隊色 · 給「最可能比分」標頭 + 比分數字上色(解「3:2 誰是誰」歧義)
  const homeColor = teamIdentity(m.home.name)?.color ?? "#D4AF37";
  const awayColor = teamIdentity(m.away.name)?.color ?? "#8AA0C4";

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

      <main id="main">
        {/* ── breadcrumb ─────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-8">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link href="/matches" className="hover:text-gold transition-colors">
              市場
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">{m.league}</span>
          </div>
        </section>

        {/* ── HERO · teams ───────────────────────────── */}
        <section
          style={{ viewTransitionName: `match-${m.id}` } as React.CSSProperties}
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-6 pb-4"
        >
          <div className="flex items-center gap-2 mb-6 flex-wrap font-mono text-gold text-[10px] tracking-[0.3em]">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-gold ${
                phase === "today-pregame" || phase === "today-live" ? "shimmer" : ""
              }`}
              aria-hidden="true"
            />
            <span>
              {m.date} · {m.startTime}
            </span>
            <PhaseBadgeLg phase={phase} calibration={calibration} />
          </div>
          <h1 className="sr-only">
            {m.home.name} vs {m.away.name} · {m.date} · {m.venue}
          </h1>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            <div>
              <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">主 HOME</p>
              <h2
                className={`text-2xl sm:text-4xl font-light tracking-tight leading-[1] ${
                  homeFavored ? "text-gold" : "text-bone/70"
                }`}
              >
                {m.home.name}
              </h2>
              <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mt-1.5">
                {m.home.en}
              </p>
            </div>
            <p className="font-mono text-gold/70 text-lg tracking-[0.2em]">VS</p>
            <div className="text-right">
              <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">客 AWAY</p>
              <h2
                className={`text-2xl sm:text-4xl font-light tracking-tight leading-[1] ${
                  awayFavored ? "text-gold" : "text-bone/70"
                }`}
              >
                {m.away.name}
              </h2>
              <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mt-1.5">
                {m.away.en}
              </p>
            </div>
          </div>
          <p className="mt-5 font-mono text-mute text-[10px] tracking-[0.3em] text-center">
            {m.venue}
          </p>
        </section>

        {/* ── THE MARKET · 引擎開盤線 + 進場 ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8">
          <div className="bg-slate/60 border border-line/70 p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <span className="font-mono text-gold/80 text-[9px] tracking-[0.35em]">
                引擎開盤線 · 賽前鎖定
              </span>
              {/* 信心溫度 · 勢均力敵=金(主打誠實不確定 · 同卡片)· 看好/重壓=mute */}
              <span
                className={`font-mono text-[9px] tracking-[0.3em] whitespace-nowrap ${
                  conviction.tier === "tossup" ? "text-gold" : "text-mute/70"
                }`}
              >
                {conviction.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span
                className={`font-mono tabular tracking-tight ${
                  homeFavored ? "text-gold" : "text-mute"
                } text-5xl sm:text-6xl font-light`}
              >
                {m.home.winRate}
                <span className="text-xl opacity-60 ml-0.5">%</span>
              </span>
              <span
                className={`font-mono tabular tracking-tight ${
                  awayFavored ? "text-gold" : "text-mute"
                } text-5xl sm:text-6xl font-light`}
              >
                {m.away.winRate}
                <span className="text-xl opacity-60 ml-0.5">%</span>
              </span>
            </div>
            <MarketSplitBar
              homePct={m.home.winRate}
              awayPct={m.away.winRate}
              goldSide={fav}
              variant="engine"
              ariaLabel={`引擎開盤線 · ${m.home.en} ${m.home.winRate}% / ${m.away.en} ${m.away.winRate}%`}
            />
            <p className="mt-2 text-center font-mono text-mute/55 text-[8px] tracking-[0.3em]">
              引擎開盤線 · ENGINE LINE
            </p>
          </div>

          {/* R176 · 開盤線 vs 即時模擬 落差 framing · Tim 5/31 screenshot canary:
              同頁兩個勝率(開盤鎖定 estimate vs 下方逐打席 10K)= 信任 bug。
              假標籤「10K MONTE CARLO」已從開盤線移除(它是賽前估算 · 不是模擬)。
              落差 framed 成 Pratfall:兩種算法都公開 · 不挑好看的講。 */}
          {m.league === "MLB" ? (
            <p className="mt-3 text-center text-mute/70 text-[11px] sm:text-xs leading-relaxed">
              上面是<span className="text-bone">賽前鎖定的開盤線</span>(主場優勢 + 先發投手 ERA / K9 / HR9)·
              留時間戳、改不了 · 賽後對真實比分結算 · <span className="text-bone">跟 CPBL 同一套引擎</span>。
            </p>
          ) : (
            <p className="mt-3 text-center text-mute/70 text-[11px] sm:text-xs leading-relaxed">
              上面是賽前鎖定的<span className="text-bone">開盤線</span>(戰績 · 主場 · 投手的快攻估算)。
              想深究?往下可以自己跑<span className="text-bone">逐打席 10K 深算</span>驗證 ——
              多數站只給一個數字假裝確定,<span className="text-bone">我們兩種都免費攤開</span>。
            </p>
          )}

          {/* 進場預測 · 群眾線 + 你的一手 */}
          <UserPredictionPicker
            matchId={m.id}
            homeName={m.home.name}
            awayName={m.away.name}
            engineFavorite={fav}
            finalWinner={m.finalResult?.winner ?? null}
            startISO={startISO}
          />

          {/* 這題怎麼算贏 · 預測市場第一信任機制(賭徒最怕模糊結算)· soul-roadmap #4
              升級成 Kalshi 式結算規格表:具名官方來源 + 開賽前鎖定時間戳 + 不可改對帳
              + 爭議裁定 · 全程 mute 不上金(守 gold discipline · 焦點留給上方開盤線)。 */}
          <SettlementResolution league={m.league} startISO={startISO} />

          <div className="mt-3 flex justify-end">
            <CopyLinkButton refTag={`match-${m.id}`} />
          </div>
        </section>

        {/* ── 引擎為什麼這樣看 · 每場推理 + 盲點 ──────────
            全球研究「缺的靈魂 #2」(Bill James 多軸 + Silver steelman)·
            對手永遠不公布「我的方法看不到什麼」· 自我拆解 = 結構性學不來的 costly signal。
            純衍生既有真實資料(投手 ERA/BB9 + 主場)· 0 vapor · 見 lib/reasoning.ts。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8">
          <p className="font-mono text-mute text-[9px] tracking-[0.4em] mb-5">
            / 引擎為什麼這樣看
          </p>
          <EngineReasoningBlock reasoning={getEngineReasoning(m)} />
          {/* 信任迴路:每場推理都承認「只到約 5 成 7」· 把這句謙虛綁回 aggregate 證據
              (= claim + receipt)。 只在未結算場顯示 —— 已結算場下方就是收據本身 = 證據。 */}
          {!m.finalResult && (
            <Link
              href="/calibration"
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
            >
              引擎到底準不準?看公開校準 →
            </Link>
          )}
        </section>

        {/* ── RECEIPT · 賽後結果(only when final)─────── */}
        {m.finalResult && calibration && (
          <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8">
            <div
              className={`bg-slate/60 border p-6 sm:p-8 ${
                calibration === "proved"
                  ? "border-gold/60"
                  : calibration === "diverged"
                  ? "border-loss/50"
                  : "border-line/70"
              }`}
            >
              <p className="font-mono text-gold text-[9px] tracking-[0.35em] mb-4">
                賽後結果 · ENGINE RECEIPT
              </p>
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">引擎賽前</p>
                  <p className="font-mono text-bone text-3xl tabular font-light">
                    {Math.max(m.home.winRate, m.away.winRate)}%
                  </p>
                  <p className="font-mono text-gold/70 text-[10px] mt-1">
                    {homeFavored ? m.home.name : m.away.name} W
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">實際比分</p>
                  <p className="font-mono text-bone text-3xl tabular font-light">
                    {m.finalResult.homeScore}:{m.finalResult.awayScore}
                  </p>
                  <p className="font-mono text-gold/70 text-[10px] mt-1">
                    {m.finalResult.winner === "home"
                      ? m.home.name + " W"
                      : m.finalResult.winner === "away"
                      ? m.away.name + " W"
                      : "TIE"}
                  </p>
                </div>
              </div>
              <div className="border-t border-line/50 pt-5">
                <CalibrationVerdictLg
                  calibration={calibration}
                  enginePctOnWinner={enginePctOnWinner}
                />
                <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                  <Link
                    href="/track-record"
                    className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
                  >
                    完整戰績 →
                  </Link>
                  <ReceiptForwardButton match={m} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 看法 · 分析(唯一發言區:留看法/寫分析 + 選邊 + 賽後自動評準度)──
            id="say" = 峰終錨點 · UserPredictionPicker 猜中時的「寫成分析 →」連到這 */}
        <div id="say" className="scroll-mt-24">
          <CreatorAnalysis
            matchId={m.id}
            homeName={m.home.name}
            awayName={m.away.name}
            finalWinner={m.finalResult?.winner ?? null}
            startISO={startISO}
            finalResults={Object.fromEntries(
              getFinalizedMatches().map((fm) => [
                fm.id,
                fm.finalResult!.winner,
              ])
            )}
            matchStarts={Object.fromEntries(
              getFinalizedMatches().map((fm) => [
                fm.id,
                getMatchStartIso(fm) ?? "",
              ])
            )}
          />
        </div>

        {/* ── PITCHER MATCHUP · 精簡 ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8">
          <p className="font-mono text-mute text-[9px] tracking-[0.4em] mb-3">/ 先發投手</p>
          {/* 給非數據迷的圖例 · 解掉「金條到底是好是壞」的方向歧義(設計審計:
              ERA/BB/HR 越低越好、K 越高越好 · 視覺統一成金色端=強)*/}
          <p className="font-mono text-mute/55 text-[9px] tracking-[0.12em] mb-5 leading-relaxed">
            每條<span className="text-gold/80">金色端 = 該項聯盟頂尖</span> · 金點越靠金色 · 該投手該項越強。
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <PitcherCard side="HOME" team={m.home.name} pitcher={m.home.pitcher} />
            <PitcherCard side="AWAY" team={m.away.name} pitcher={m.away.pitcher} />
          </div>
        </section>

        {/* ── SCORE DISTRIBUTION · top 5 · MLB 引擎是 Log5 公式無比分分佈 → 略過 ── */}
        {m.topScores.length > 0 && (
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8">
          <p className="font-mono text-mute text-[9px] tracking-[0.4em] mb-2">
            / 最可能比分 · TOP 5
          </p>
          {/* 標頭:比分以 主 : 客 排列 · 兩隊各上隊色 → 解「3:2 誰是誰」歧義(Tim dogfood)*/}
          <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-1.5 flex-wrap">
            <span style={{ color: homeColor }}>{m.home.name}</span>
            <span className="text-mute/50">:</span>
            <span style={{ color: awayColor }}>{m.away.name}</span>
            <span className="text-mute/45 ml-1 text-[9px] tracking-[0.2em]">主 : 客</span>
          </p>
          <div className="space-y-2.5">
            {m.topScores.map((s, i) => (
              <ScoreRow
                key={s.score}
                rank={i + 1}
                score={s.score}
                pct={s.probability}
                homeColor={homeColor}
                awayColor={awayColor}
              />
            ))}
          </div>
        </section>
        )}

        {/* ── RUN IT YOURSELF · 自己跑引擎(收進 disclosure)──
            設計審計 P1:同頁兩個勝率(上方開盤線 + 這裡 10K 模擬另一個數字)= 球迷的
            「為什麼有兩個 63%?」困惑。 收進「點開才跑」的進階面板 → 95% 訪客只看到
            一個乾淨開盤線;想自己驗算的 skeptic 一鍵展開即得(costly-signal proof 保留)。
            模擬器本來就是「按 RUN 才跑」· 收起 0 CPU 成本。
            R198 · MLB 引擎是 Log5 公式(非逐打席 10K)→ MLB 略過此段。 */}
        {m.league !== "MLB" && (
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-8">
          <details className="group">
            <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center gap-2 font-mono text-gold/80 hover:text-gold text-[11px] sm:text-xs tracking-[0.3em] transition-colors">
              <span className="text-gold/60 transition-transform group-open:rotate-90">
                ▸
              </span>
              自己跑 10K 逐打席模擬 · 進階驗算
            </summary>
            <p className="text-mute text-sm leading-relaxed mt-4 mb-6 max-w-xl">
              上面的開盤線不用信我們 · 在你瀏覽器裡親手跑 10,000 次逐打席模擬 ·
              這是更細的另一套算法(數字會跟開盤線有點出入)· 你親手看引擎憑什麼開這個盤。{" "}
              <span className="text-bone">這是驗算工具 · 不是第二個官方盤口</span>。
            </p>
            <EngineGate next={`/matches/${m.id}`}>
              <MatchSimulator key={m.id} match={m} />
            </EngineGate>
          </details>
        </section>
        )}

        {/* ── back ───────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/matches"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回市場看板
          </Link>
        </section>
      </main>

      {(phase === "today-pregame" || phase === "today-live") && (
        <TonightMatchRail
          currentMatchId={m.id}
          matches={getTodayMatches().map((tm) => ({
            id: tm.id,
            homeName: tm.home.name,
            awayName: tm.away.name,
            homeWinRate: tm.home.winRate,
            awayWinRate: tm.away.winRate,
            startTime: tm.startTime,
          }))}
        />
      )}

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function EngineReasoningBlock({ reasoning }: { reasoning: EngineReasoning }) {
  return (
    <div className="space-y-5">
      {/* ① 看到什麼 · 逐項(含方向 · 偏某隊 = 金色左框 · 打平 = 灰)*/}
      <div className="space-y-3">
        {reasoning.factors.map((f) => (
          <div
            key={f.label}
            className={`pl-3 border-l-2 ${
              f.lean === "even" ? "border-line/50" : "border-gold/40"
            }`}
          >
            <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-0.5">
              {f.label}
            </p>
            <p className="text-bone/85 text-[13px] sm:text-sm leading-relaxed">
              {f.detail}
            </p>
          </div>
        ))}
      </div>

      {/* ②③ 誠實層 · 盲點 + 什麼情況會錯(moat · 對手學不來)·
          收進一個低調框 · 跟上方推理視覺分層 = 後設的自我拆解 */}
      <div className="bg-slate/30 border border-line/60 px-4 py-3.5 space-y-3">
        <div>
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1">
            哪裡可能看走眼
          </p>
          <p className="text-mute/85 text-[12px] sm:text-[13px] leading-relaxed">
            {reasoning.blindSpots}
          </p>
        </div>
        <div className="border-t border-line/40 pt-3">
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1">
            什麼情況我們會錯
          </p>
          <p className="text-mute/85 text-[12px] sm:text-[13px] leading-relaxed">
            {reasoning.wrongWhen}
          </p>
        </div>
      </div>
    </div>
  );
}

function PitcherCard({
  side,
  team,
  pitcher,
}: {
  side: "HOME" | "AWAY";
  team: string;
  pitcher: Match["home"]["pitcher"];
}) {
  const p = pitcher;
  return (
    <div className="bg-slate/60 border border-line/70 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-gold/70 text-[9px] tracking-[0.3em]">{side}</span>
        <span className="text-mute text-xs">{team}</span>
      </div>
      <h3 className="text-xl text-bone font-light tracking-tight mb-4">{p.name}</h3>
      <div className="space-y-0.5">
        <StatPercentileBar stat="ERA" value={p.era} />
        <StatPercentileBar stat="K/9" value={p.k9} />
        <StatPercentileBar stat="BB/9" value={p.bb9} />
        <StatPercentileBar stat="HR/9" value={p.hr9} />
      </div>
    </div>
  );
}

function ScoreRow({
  rank,
  score,
  pct,
  homeColor,
  awayColor,
}: {
  rank: number;
  score: string;
  pct: number;
  homeColor: string;
  awayColor: string;
}) {
  // 比分格式 "3 : 2" = 主 : 客 · 拆開各上隊色(解歧義)
  const [hRaw, aRaw] = score.split(":");
  const h = (hRaw ?? "").trim();
  const a = (aRaw ?? "").trim();
  const hn = parseInt(h, 10);
  const an = parseInt(a, 10);
  // 比分條依「誰贏這比分」上隊色(主勝=主色 · 客勝=客色 · 平=金)= 迷你勝負分佈
  const barColor = hn > an ? homeColor : an > hn ? awayColor : "#D4AF37";
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-mute text-[10px] tracking-[0.3em] w-8">
        / {String(rank).padStart(2, "0")}
      </span>
      <span className="font-mono tabular text-base w-16">
        <span style={{ color: homeColor }}>{h}</span>
        <span className="text-mute/50"> : </span>
        <span style={{ color: awayColor }}>{a}</span>
      </span>
      <div className="flex-1 relative h-[2px] bg-line/80">
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${Math.min(100, (pct / 20) * 100)}%`,
            background: barColor,
          }}
        />
      </div>
      <span className="font-mono text-gold tabular text-sm w-14 text-right">
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

function PhaseBadgeLg({
  phase,
  calibration,
}: {
  phase: MatchPhase | null;
  calibration: Calibration | null;
}) {
  if (!phase) return null;

  if (phase === "final" && calibration) {
    const styles = {
      proved: "border-gold text-gold",
      diverged: "border-loss/70 text-loss",
      push: "border-mute/60 text-mute",
    } as const;
    const labels = {
      proved: "✓ PROVED · 引擎命中",
      diverged: "✕ DIVERGED · 引擎落空",
      push: "= PUSH · 平局",
    } as const;
    return (
      <span
        className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ml-1 ${styles[calibration]}`}
      >
        {labels[calibration]}
      </span>
    );
  }

  if (phase === "today-pregame") {
    return (
      <span
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold text-gold ml-1 shimmer"
      >
        TODAY · 今晚開賽
      </span>
    );
  }

  if (phase === "today-live") {
    return (
      <span
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold text-gold ml-1"
      >
        LIVE · 進行中
      </span>
    );
  }

  if (phase === "future") {
    return (
      <span
        className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold ml-1"
      >
        PREVIEW · 預覽
      </span>
    );
  }

  return (
    <span
      lang="en"
      className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-mute/60 text-mute ml-1"
    >
      ARCHIVED
    </span>
  );
}

function CalibrationVerdictLg({
  calibration,
  enginePctOnWinner,
}: {
  calibration: Calibration;
  enginePctOnWinner: number | null;
}) {
  const styles = {
    proved: "text-gold border-gold",
    diverged: "text-loss border-loss/70",
    push: "text-mute border-mute/60",
  } as const;
  const headlines = {
    proved: "✓ ENGINE PROVED",
    diverged: "✕ ENGINE DIVERGED",
    push: "= PUSH",
  } as const;
  const subtexts = {
    proved: "引擎方向命中 · 賽前公開的預測對上實際贏家",
    diverged: "引擎方向落空 · 賽前預測與實際贏家相反 · 不修飾照掛",
    push: "平局或 50/50 預測 · 無方向可驗證",
  } as const;
  return (
    <div className="flex items-start gap-4 flex-wrap">
      <span
        lang="en"
        className={`font-mono text-sm tracking-[0.3em] px-3 py-2 border ${styles[calibration]}`}
      >
        {headlines[calibration]}
        {enginePctOnWinner !== null && calibration === "proved" && (
          <span className="ml-2 opacity-70 text-xs">({enginePctOnWinner}%→W)</span>
        )}
        {enginePctOnWinner !== null && calibration === "diverged" && (
          <span className="ml-2 opacity-70 text-xs">(僅 {enginePctOnWinner}%→W)</span>
        )}
      </span>
      <p className="text-mute text-sm leading-relaxed flex-1 max-w-md mt-1">
        {subtexts[calibration]}
      </p>
    </div>
  );
}
