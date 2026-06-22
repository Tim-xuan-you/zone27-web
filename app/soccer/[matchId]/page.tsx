import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import EngineThreeWayBar from "@/components/EngineThreeWayBar";
import SoccerMarketLines from "@/components/SoccerMarketLines";
import OverUnderStrip from "@/components/OverUnderStrip";
import SoccerBetStrip from "@/components/SoccerBetStrip";
import CreatorAnalysis from "@/components/CreatorAnalysis";
import MatchSegment from "@/components/MatchSegment";
import { getSoccerMatchById } from "@/lib/soccer/football-data";
import { toDisplayPercents, enginePickOf, deriveSoccerMarkets } from "@/lib/soccer/engine";
import { getNationalCode } from "@/lib/soccer/teams";
import { getSoccerFinalizedResults, kickoffTaipei } from "@/lib/soccer/locked";
import { getMatchSegment } from "@/lib/match-segment";

// ── ZONE 27 · /soccer/[matchId] · 足球單場詳情頁(R228 · 補到跟 CPBL 同級)─────────────
// 足球本來只有 /soccer 看板卡 + /receipts 收據,沒有「每場一個討論/分析的家」(棒球在
// /matches/[gameId])。 這頁就是足球的那個家 —— 引擎三向線 + 最可能比分 + 玩法視角 + 進場押注
// + 賽前鎖定收據連結 + 最重要的「討論 / 分析」(CreatorAnalysis · 綁戰績 · 跟棒球同一套)。
// on-demand(fd-* · dynamicParams 預設允許)· 0 generateStaticParams · 查無 → 404。
// ─────────────────────────────────────────────────────

export const revalidate = 3600; // 1h ISR(同 /soccer)

type Params = Promise<{ matchId: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { matchId } = await params;
  const m = await getSoccerMatchById(matchId);
  if (!m) return { title: "Match not found" };
  const p = m.prediction;
  const favLine = p
    ? `引擎自己算的勝 / 平 / 負(${m.competitionName})`
    : `引擎覆蓋建置中`;
  // 分享卡描述帶上引擎那條線(有覆蓋才帶數字)= Polymarket「分享市場本身」。
  let ogDescription: string;
  if (p) {
    const d = toDisplayPercents(p);
    const pick = enginePickOf(p);
    const fav = pick === "home" ? m.home : pick === "away" ? m.away : "和局";
    ogDescription = `引擎賽前鎖定:${m.home} ${d.homeWin}% · 和 ${d.draw}% · ${m.away} ${d.awayWin}% · 看好 ${fav} · 不是盤口、賽後對帳。`;
  } else {
    ogDescription = "引擎覆蓋建置中 · 算得出才開盤 · 不是盤口、賽後對帳。";
  }
  const ogTitle = `${m.home} vs ${m.away} · 足球引擎開盤`;
  return {
    // 標題不含「· ZONE 27」· root layout template(%s · ZONE 27)會補一次(原本手寫會疊兩次)。
    title: ogTitle,
    description: `${m.home} vs ${m.away} · ${favLine} · 不是盤口 · 賽前鎖死、賽後逐場對帳 · 含贏含輸、改不了。`,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      // R159 教訓:page 自宣告 openGraph → Next shallow merge 會丟掉 root 的 locale/siteName · 明寫補回。
      locale: "zh_TW",
      siteName: "ZONE 27",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default async function SoccerMatchPage({ params }: { params: Params }) {
  const { matchId } = await params;
  const m = await getSoccerMatchById(matchId);
  if (!m) notFound();

  const pred = m.prediction;
  const ko = kickoffTaipei(m.dateISO);
  const d = pred ? toDisplayPercents(pred) : null;
  const pick = pred ? enginePickOf(pred) : null;
  const homeGold = pick === "home";
  const awayGold = pick === "away";
  const favoredLabel =
    pick === "home" ? m.home : pick === "away" ? m.away : "和局";

  // CreatorAnalysis 徽章評分要全站已結算賽果(賽果在 app 端 · 不在 DB)· 足球 draw → "tie"。
  const settled = getSoccerFinalizedResults();
  const finalResults: Record<string, "home" | "away" | "tie"> = {};
  const matchStarts: Record<string, string> = {};
  for (const r of settled) {
    finalResults[r.matchId] = r.outcome === "draw" ? "tie" : r.outcome;
    matchStarts[r.matchId] = r.kickoffISO;
  }
  const thisFinal = finalResults[m.id] ?? null;

  // R230 · 誰賽前鎖了這場(per-match segment · 足球版)· 走公開 ladder · 0 migration。
  // ⚠️ 足球詳情頁只 reachable 未開踢的場(getSoccerMatchById 不回已踢完場 · 已結算的看
  //   /receipts)→ 這裡是「賽前:誰鎖了這場」名單(無 ✓/✕ · winner 留 null)= 社會證明 +
  //   發現可追的高手。 賽後「誰押對」的足球版屬未來 follow-up(需詳情頁認已結算場)。
  const segment = await getMatchSegment(m.id);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="soccer" />

      <main id="main">
        {/* ── BREADCRUMB ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-8">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">HOME</Link>
            <span className="text-mute/60">/</span>
            <Link href="/soccer" className="hover:text-gold transition-colors">足球</Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">{m.competitionName}</span>
          </div>
        </section>

        {/* ── HERO · 兩隊 ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-6 font-mono text-gold text-[10px] tracking-[0.3em]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
            <span className="tabular">{ko} <span className="text-mute/60">TPE</span></span>
            {m.locked && (
              <span className="border border-gold/50 text-gold/90 px-1.5 py-0.5 text-[9px] tracking-[0.25em]">
                賽前鎖定
              </span>
            )}
          </div>
          <h1 className="sr-only">{m.home} vs {m.away} · {m.competitionName}</h1>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            <div>
              <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1.5">主 HOME</p>
              <span className="flex items-center gap-2.5">
                <Avatar seed={m.homeSeed} glyph={getNationalCode(m.homeSeed) ?? undefined} size={30} />
                <span className={`text-2xl sm:text-3xl font-light tracking-tight leading-[1.05] ${homeGold ? "text-gold" : "text-bone/80"}`}>
                  {m.home}
                </span>
              </span>
            </div>
            <p className="font-mono text-gold/70 text-base tracking-[0.2em]">VS</p>
            <div className="text-right">
              <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1.5">客 AWAY</p>
              <span className="flex items-center gap-2.5 justify-end">
                <span className={`text-2xl sm:text-3xl font-light tracking-tight leading-[1.05] ${awayGold ? "text-gold" : "text-bone/80"}`}>
                  {m.away}
                </span>
                <Avatar seed={m.awaySeed} glyph={getNationalCode(m.awaySeed) ?? undefined} size={30} />
              </span>
            </div>
          </div>
        </section>

        {/* ── 引擎三向開盤線 + 最可能比分 + 玩法視角 ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8">
          {pred && d ? (
            <div className="bg-slate/60 border border-line/70 p-6 sm:p-8">
              <p className="font-mono text-gold/80 text-[9px] tracking-[0.35em] mb-4">
                引擎開盤線 · 自己算的勝 / 平 / 負(不是盤口)
              </p>
              <div className="flex items-baseline justify-between mb-3 font-mono tabular">
                <ThreeWayNum label={m.home} value={d.homeWin} gold={homeGold} align="left" />
                <ThreeWayNum label="和局" value={d.draw} gold={pick === "draw"} align="center" />
                <ThreeWayNum label={m.away} value={d.awayWin} gold={awayGold} align="right" />
              </div>
              <EngineThreeWayBar homePct={d.homeWin} drawPct={d.draw} awayPct={d.awayWin} goldSide={enginePickOf(pred)} />
              <p className="mt-3 font-mono text-mute/75 text-[11px] tracking-[0.1em]">
                引擎看好 <span className="text-bone">{favoredLabel}</span> · 預期進球{" "}
                <span className="text-bone tabular">{pred.xgHome.toFixed(1)}–{pred.xgAway.toFixed(1)}</span>
              </p>

              {/* 最可能比分 TOP 5(Dixon-Coles 比分表 · 同 CPBL/MLB 詳情頁的「最可能比分」)*/}
              {pred.topScores.length > 0 && (
                <div className="mt-6 border-t border-line/40 pt-5">
                  <p className="font-mono text-mute text-[9px] tracking-[0.4em] mb-3">/ 最可能比分 · TOP 5</p>
                  <div className="space-y-2.5">
                    {pred.topScores.slice(0, 5).map((s, i) => (
                      <ScoreRow key={`${s.home}-${s.away}`} rank={i + 1} home={s.home} away={s.away} pct={s.p * 100} />
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-mute/45 text-[9px] tracking-[0.12em] leading-relaxed">
                    由引擎的雙變量卜瓦松(Dixon-Coles)比分表算 · 跟上面勝 / 平 / 負同源、零落差 · 90 分鐘正規賽。
                  </p>
                </div>
              )}

              {/* 賭徒熟悉的玩法視角(大小球 / 讓球 / 兩隊進球)· 從同一張比分表推 · 零盤口 */}
              <div className="mt-5">
                <SoccerMarketLines prediction={pred} />
              </div>
            </div>
          ) : (
            <div className="bg-slate/40 border border-line/60 p-6 text-center">
              <p className="text-mute text-sm leading-relaxed">
                覆蓋建置中 · 這個聯賽的戰績還不夠讓引擎誠實開盤。 賭場什麼都敢開,我們只開算得出的。
              </p>
            </div>
          )}

          {/* 進場押注(三向 · 登入才能押 · 押了不可改 · 賽後對帳)*/}
          <SoccerBetStrip matchId={m.id} dateISO={m.dateISO} homeLabel={m.home} awayLabel={m.away} locked={m.locked} />

          {/* 大小分 2.5 押注(看大 / 看小)· 跟「誰贏」分開記、不污染戰績 */}
          {pred &&
            (() => {
              const ou = deriveSoccerMarkets(pred.xgHome, pred.xgAway, {
                totalLines: [2.5],
              }).totals[0];
              return ou ? (
                <OverUnderStrip
                  matchId={m.id}
                  dateISO={m.dateISO}
                  overPct={ou.overPct}
                  underPct={ou.underPct}
                />
              ) : null;
            })()}

          {/* 結算規格(賭徒最怕模糊結算)· 90 分鐘 1X2 · 延長賽 / PK 不算 */}
          <p className="mt-4 font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed">
            ▸ 結算:football-data.org 中立公開比分 · 只認 90 分鐘正規賽 1X2(延長賽 / PK 不算)· 賽前鎖定的線改不了。
          </p>

          {/* 賽前鎖定的場 → 可外傳的單場收據(賽前鎖死、賽後對帳)*/}
          {m.locked && (
            <div className="mt-3 flex justify-end">
              <Link
                href={`/receipts/${m.id}`}
                className="inline-flex items-center gap-2 font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.25em] border border-gold/40 hover:border-gold/70 hover:bg-gold/10 px-3 py-1.5 transition-colors"
              >
                ▸ 看 / 外傳這場的賽前收據 →
              </Link>
            </div>
          )}
        </section>

        {/* ── 誰賽前鎖了這場(per-match segment · 足球版 · 三向含和局)· 賽後逐人對帳誰押對 ──
            沒人鎖 → 整塊隱藏(graceful)· 走公開 ladder · 每格連 /u 公開校準檔。 */}
        <MatchSegment lockers={segment} homeName={m.home} awayName={m.away} />

        {/* ── 討論 / 分析(R228 足球補上 · 跟棒球同一套 · 綁戰績非匿名論壇)──
            id="creator-analysis" = 登入回跳錨點(CreatorAnalysis 內 login next 已 sport-aware)*/}
        <div id="creator-analysis" className="scroll-mt-24">
          <CreatorAnalysis
            matchId={m.id}
            homeName={m.home}
            awayName={m.away}
            finalWinner={thisFinal}
            startISO={m.dateISO}
            finalResults={finalResults}
            matchStarts={matchStarts}
          />
        </div>

        {/* ── back ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center pt-4">
          <Link href="/soccer" className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors">
            ← 回足球看板
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ThreeWayNum({
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
  const alignCls = align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center";
  return (
    <span className={`flex flex-col ${alignCls} gap-0.5 min-w-0`}>
      <span className={`text-3xl sm:text-4xl font-light ${gold ? "text-gold" : "text-mute"}`}>
        {value}
        <span className="text-base opacity-60">%</span>
      </span>
      <span className="text-mute/65 text-[10px] tracking-[0.1em] truncate max-w-[7rem]">
        {label.length > 6 ? label.slice(0, 6) : label}
      </span>
    </span>
  );
}

function ScoreRow({
  rank,
  home,
  away,
  pct,
}: {
  rank: number;
  home: number;
  away: number;
  pct: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-mute text-[10px] tracking-[0.3em] w-8">
        / {String(rank).padStart(2, "0")}
      </span>
      <span className="font-mono tabular text-base w-14 text-bone">
        {home} <span className="text-mute/50">:</span> {away}
      </span>
      <div className="flex-1 relative h-[2px] bg-line/80">
        <div className="absolute top-0 left-0 h-full bg-gold/80" style={{ width: `${Math.min(100, (pct / 20) * 100)}%` }} />
      </div>
      <span className="font-mono text-gold tabular text-sm w-14 text-right">{pct.toFixed(1)}%</span>
    </div>
  );
}
