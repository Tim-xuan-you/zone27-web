import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SoccerMatchCard from "@/components/SoccerMatchCard";
import { createPageMetadata } from "@/lib/page-og";
import {
  ACTIVE_COMPETITIONS,
  getCompetitionPredictions,
  type SoccerMatchPrediction,
} from "@/lib/soccer/football-data";

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
  const groups = await Promise.all(
    ACTIVE_COMPETITIONS.map(async (code) => ({
      code,
      matches: (await getCompetitionPredictions(code))
        .slice()
        .sort((a, b) => (a.dateISO || "").localeCompare(b.dateISO || "")),
    })),
  );
  const nonEmpty = groups.filter((g) => g.matches.length > 0);
  const total = nonEmpty.reduce((s, g) => s + g.matches.length, 0);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

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
            這不是莊家的盤口 —— 是我們的推演引擎用足球預測的學術標準(每隊預期進球 +
            低比分修正)<span className="text-bone">自己算出來</span>的機率。 賽後一樣
            <span className="text-gold">逐場對帳、連輸都留</span>(足球自動結算即將上線)。 不接受下注。
          </p>
          <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.2em]">
            {total > 0
              ? `引擎覆蓋 ${total} 場 · 世界盃 + 季中聯賽 · 顯示最近賽事 · 台北時區`
              : "賽程資料接通中"}
          </p>
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        {/* ── GROUPS ── */}
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
      </main>

      <Footer />
    </div>
  );
}
