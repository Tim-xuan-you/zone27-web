import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import SoccerMatchCard from "@/components/SoccerMatchCard";
import SoccerRecordCard from "@/components/SoccerRecordCard";
import TrackRecordStrip from "@/components/TrackRecordStrip";
import { createPageMetadata } from "@/lib/page-og";
import { getResolvedSoccerEngine } from "@/lib/soccer/engine-settle";
import {
  ACTIVE_COMPETITIONS,
  getCompetitionPredictions,
  getLockedUpcomingPredictions,
  getSoccerLedgerResults,
  type SoccerMatchPrediction,
} from "@/lib/soccer/football-data";
import { getSoccerEnginePicksAll } from "@/lib/soccer/locked";
import { getOpenMarkets } from "@/lib/markets";

export const metadata = createPageMetadata({
  title: "足球 · 引擎開盤",
  description:
    "世界盃 + 各大足球聯賽 · 我們自己的推演引擎算出主勝 / 和 / 客勝機率(Dixon-Coles 學術標準)· 不是盤口 · 賽後逐場對帳 · 不接受下注。",
  ogTitle: "足球 · 引擎開盤 · ZONE 27",
  ogDescription:
    "世界盃 + 各大聯賽 · 引擎自己算的勝/平/負機率 · 不是盤口 · 賽後對帳",
  path: "/soccer",
});

// ISR · 1h(資料層也有 1h 快取 · 雙層遠低於 API 10/min 上限)。
export const revalidate = 3600;

// 每個聯賽只顯示最近 N 場(看板要可掃 · 不是把整季賽程倒出來)。
const PER_GROUP_CAP = 12;

export default async function SoccerPage() {
  // 只打 ACTIVE_COMPETITIONS(rate-limit 紀律)· 各自 graceful → 缺 token/錯誤回空。
  // 韌性兜底來源(0 API · 純讀打包的賽前鎖定檔)· 某聯賽 live 整片空時退這個 → 板不變空白。
  const lockedUpcoming = getLockedUpcomingPredictions();
  const groups = await Promise.all(
    ACTIVE_COMPETITIONS.map(async (code) => {
      const live = (await getCompetitionPredictions(code))
        .slice()
        .sort((a, b) => (a.dateISO || "").localeCompare(b.dateISO || ""));
      // live 有就用 live(已含鎖定 overlay + 未鎖的 live 場 · 不雙渲染)· live 空(API 斷/token
      // 失效)才退同聯賽的賽前鎖定場 —— 世界盃夜板絕不因一次 API 抽風變整片空白。
      const matches =
        live.length > 0
          ? live
          : lockedUpcoming.filter((p) => p.competitionCode === code);
      return { code, matches };
    }),
  );
  // 快開打的排前面:各 group 內已按時間 asc,再用「group 內最早一場」排 group ——
  // 下一個開打的聯賽排最上(Tim:賽事應依時間排序、快開打的排前面)。
  const nonEmpty = groups
    .filter((g) => g.matches.length > 0)
    .sort((a, b) =>
      (a.matches[0].dateISO || "").localeCompare(b.matches[0].dateISO || ""),
    );
  const total = nonEmpty.reduce((s, g) => s + g.matches.length, 0);
  // 賽後結果(永久鎖定結果 ∪ live 公開 · 永久者勝 = 帳本不縮水)· 給「你的足球戰績」對帳。
  const soccerResults = await getSoccerLedgerResults();
  // 引擎當初鎖定的看好邊(含玩法 · 給「你 vs 引擎」同場對照 · 玩法已併入同一本足球戰績)。
  const enginePicks = getSoccerEnginePicksAll();

  // R234 · 足球引擎公開戰績摘要(板頂證物條)· 同 SoccerEngineRecord 口徑(verdict proved/diverged)·
  // resolveLockedSoccer 的 live fetch 走 1h ISR 共用快取 → 與下方 SoccerEngineRecord 不重複打 API。
  const { predictions: engPreds, notKicked, awaitingGrade } =
    await getResolvedSoccerEngine();
  const soccerHits = engPreds.filter((p) => p.verdict === "proved").length;
  const soccerMisses = engPreds.filter((p) => p.verdict === "diverged").length;

  // R240 · 群眾盤入口(/markets)· 引擎沒覆蓋的聯賽也能押 · 有開盤中才顯示。
  const openMarketCount = getOpenMarkets().length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="soccer" />
      <SportTabs active="soccer" />

      <main id="main">
        {/* ── HEADER ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-8">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">足球 · 引擎開盤</p>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30">
              v0.1
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            我們<span className="text-gold">自己算</span>的勝 / 平 / 負
          </h1>
          <p className="mt-4 text-mute text-sm leading-relaxed max-w-2xl">
            不是莊家的盤口 —— 是我們的引擎<span className="text-bone">自己算出來</span>的勝 / 平 / 負。 <span className="text-bone">敢喊穩贏的都在騙你</span>;我們賽前鎖死、賽後逐場對帳、連輸都留。{" "}
            <Link href="/engines#soccer" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
              怎麼算、會錯幾成 →
            </Link>
          </p>
          {/* 傷兵盲點 = 誠實揭露 + costly signal(頁面層講一次 · 不塞每張卡 = 守卡片「不重複盲點清單」紀律)。
              把「引擎沒看傷停」翻成「你的判斷比引擎值錢」的入口:這正是賭徒該下手反向押的地方。 */}
          <p className="mt-3 border-l-2 border-gold/50 pl-4 text-mute text-[13px] sm:text-sm leading-relaxed max-w-2xl">
            引擎只看實力分,<span className="text-bone">沒看傷停 / 輪換 / 臨場陣容</span> —— 那是<span className="text-gold">你的判斷比引擎值錢</span>的地方。
          </p>
          <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.2em]">
            {total > 0
              ? `引擎覆蓋 ${total} 場 · 世界盃 + 季中聯賽 · 顯示最近賽事 · 台北時區`
              : "賽程資料接通中"}
          </p>
          {/* 世界盃日誠實說明:板只列「未開賽」· 開賽中的場會從板上消失 ~2h
              (不是 bug 是設計:引擎不做 live · 終場後逐場對帳)· 先講免猜。
              不寫「自動」:引擎公開帳本要等 secret 落地才會跑(避免承諾系統還沒做到的事)。 */}
          {total > 0 && (
            <p className="mt-1.5 font-mono text-mute/45 text-[9px] tracking-[0.18em]">
              開賽中的場次不掛板上 · 終場後逐場對帳(這裡只列未開賽的場)
            </p>
          )}
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        {/* ── GROUPS · 賽事看板優先(Tim:賽事擺最前面 · 依時間排序 · 戰績條移到下方)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          {nonEmpty.length > 0 ? (
            <div className="space-y-10">
              {nonEmpty.map((g) => {
                const shown = g.matches.slice(0, PER_GROUP_CAP);
                return (
                  <div key={g.code}>
                    <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                      <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
                        {g.matches[0].competitionName}
                      </p>
                      {g.matches.length > PER_GROUP_CAP && (
                        <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">
                          顯示最近 {PER_GROUP_CAP} 場 · 本季共 {g.matches.length} 場
                        </span>
                      )}
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {shown.map((m: SoccerMatchPrediction) => (
                        <SoccerMatchCard key={m.id} match={m} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate/40 border border-line/60 p-10 sm:p-12 text-center">
              <p className="font-mono text-mute text-xs tracking-[0.25em] mb-4">足球賽程接通中</p>
              <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-8">
                引擎已就緒 · 正在接上賽程資料來源。 先去看棒球的引擎開盤與公開戰績:
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/matches"
                  className="inline-block px-6 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
                >
                  今日賽事板 →
                </Link>
                <Link
                  href="/track-record"
                  className="inline-block px-6 py-3 border border-line/60 text-mute text-xs tracking-[0.3em] hover:border-gold hover:text-gold transition-colors"
                >
                  公開戰績 →
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── 群眾盤入口(R240)· 引擎沒覆蓋的聯賽也能押 · 有開盤中才顯示 ──────── */}
        {openMarketCount > 0 && (
          <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
            <Link
              href="/markets"
              className="flex items-baseline justify-between gap-3 border border-line/60 bg-slate/30 px-4 py-3 hover:border-gold/40 hover:bg-slate/40 transition-colors group"
            >
              <span className="text-mute text-sm leading-snug">
                引擎沒覆蓋的聯賽?<span className="text-bone">{openMarketCount} 場群眾盤開盤中</span> · 任何一場都能賽前鎖一手、看群眾共識
              </span>
              <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
                開盤 →
              </span>
            </Link>
          </section>
        )}

        {/* ── 引擎公開戰績條 + 你的足球戰績(移到賽事看板下方 · 賽事擺前面)──
            證物仍在第一屏可掃範圍(賽事卡通常一兩屏內)· 但「先看今晚有哪些場」優先於「先看戰績」。 */}
        <TrackRecordStrip
          hits={soccerHits}
          misses={soccerMisses}
          pending={notKicked + awaitingGrade}
          href="/track-record#soccer"
          caption="足球三選一(主 / 和 / 客)· 和局最難喊,我們連喊不出的和局都老實算自己落空 → 命中率天生比棒球低,真正的尺是校準。"
        />
        <SoccerRecordCard
          results={soccerResults}
          enginePicks={enginePicks}
          wrapperClass="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8"
        />

        {/* R263 · 引擎完整逐場戰績(SoccerEngineRecord)= /track-record#soccer 的同一個元件 ·
            賽事板不再重複整段帳本(那是「protesting too much」)· 板上只留上方一行 glance 條
            → /track-record#soccer 看完整。 全站三本帳:一個家(/track-record)· 各板一行 chip。 */}
      </main>

      <Footer />
    </div>
  );
}
