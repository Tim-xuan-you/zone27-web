import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import YourRecordStrip from "@/components/YourRecordStrip";
import SportToggle from "@/components/SportToggle";
import LadderBoard from "@/components/LadderBoard";
import LadderClimbCTA from "@/components/LadderClimbCTA";
import { getFinalizedMatches, getMatchStartIso } from "@/lib/matches";
import { getMlbFinalizedResults } from "@/lib/mlb-matches";
import { getLadderBoard } from "@/lib/ladder-server";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "天梯 · 從新秀爬到神諭",
  description:
    "ZONE 27 準度天梯。 從新秀爬到神諭 · 證明你比機器準。 每個月爬一階 · 輸了會掉 · 靠的是真實準度,不是錢。",
  path: "/ladder",
});

// ── /ladder · R187 砍乾淨(Tim:超級複雜超級長 · 國中生要看得懂)──────
// 從 ~540 行(三個聲音卡 / 王座戰績卡 / 5 條規則 / FounderSignOff / 雙 CTA)
// 砍成 3 段:這是什麼 → 5 階怎麼爬 → 去押。 每階一句白話 · 不囉嗦。
// ─────────────────────────────────────────────────────
export const revalidate = 3600; // 海選榜每小時更新一次(賽果結算後不必等一天才反映)

// 5 階 · 由低到高 · 每階一句國中生看得懂的話
const TIERS = [
  { n: 1, zh: "新秀", en: "ROOKIE", one: "押滿 10 場 · 就上榜。" },
  { n: 2, zh: "分析師", en: "ANALYST", one: "命中率過半(50%)—— 證明你不是純猜的。" },
  { n: 3, zh: "操盤手", en: "TRADER", one: "命中率逼近門檻(55%)。" },
  { n: 4, zh: "神準手", en: "SHARP", one: "在 ≥30 場裡 · 命中率守住 60% —— 連引擎都還沒站上。" },
  { n: 5, zh: "神諭", en: "ORACLE", one: "全站第一 + 守住 60% · 把機器拉下王座。 這是王座(只留給人)。" },
];

export default async function LadderPage() {
  // 已結算賽事勝方 · 傳給「你現在的位置」戰績條(client 端評分本人押注)。
  // /ladder 維持 ISR 靜態 · 戰績條 hydrate 後才填本人進度。
  // R198 · 併入 MLB 已結算結果 → 押 MLB 也計進個人準度(MLB 全套)。
  const matchResults = [
    ...getFinalizedMatches().map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      startISO: getMatchStartIso(m),
    })),
    ...(await getMlbFinalizedResults()),
  ];

  // 海選天梯榜(跨用戶 · 誰比機器準)· 合格用戶不足 → board.show=false → 自動不渲染
  // (維持「王座上只有機器」優雅空榜 · 0 用戶不上空榜的紅線)。 graceful:未套 0022 / 0 資料 → 空榜。
  const board = await getLadderBoard();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main" className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── 這是什麼 ──────────────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 天梯 · THE LADDER
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
          從新秀,爬到<span className="text-gold">神諭</span>。
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-6">
          證明你比機器準。 別的地方只能跟「大家」比 —— 這裡你還能
          <span className="text-bone">跟一台公開的機器正面比準度</span>。
        </p>

        <div className="border-l-2 border-gold/60 pl-5 py-1 mb-10">
          <p className="text-bone text-base sm:text-lg leading-relaxed">
            你打贏引擎 · 是我們<span className="text-gold">最想看到</span>的事。
          </p>
        </div>

        {/* 海選榜(跨用戶 · 誰比機器準)· 合格用戶不足時自動不出現(維持下方「王座只有機器」)。 */}
        <LadderBoard board={board} />

        {/* 你現在的位置 · 棒球 / 足球 分開算(三本帳不混池)· 同一套天梯規則套兩運動 ·
            等寬切換 = 不凌亂(各占整塊不堆疊)· 足球 0 結算 → 設計過的「即將開始」不是空卡。
            R189 改讀 DB(取代死掉的匿名版 LadderPosition)*/}
        <div className="mb-10">
          <SportToggle
            containerClass="pt-1 pb-5"
            baseball={
              <YourRecordStrip variant="ladder" matchResults={matchResults} />
            }
            soccer={
              <div className="border border-gold/30 bg-slate/40 p-5">
                <span className="inline-block font-mono text-gold/80 text-[9px] tracking-[0.3em] px-2 py-1 border border-gold/40 mb-3">
                  足球天梯 · 世界盃開踢後起算
                </span>
                <p className="text-bone text-base leading-relaxed">
                  足球的賽後對帳,<span className="text-gold">從世界盃第一場打完開始</span>
                  (台北時間 6/12 凌晨開踢)。
                </p>
                <p className="mt-2 text-mute text-sm leading-relaxed">
                  跟棒球<span className="text-bone">分開算</span>(各算各的準度)—— 押滿 10 場、
                  而且那個月贏過足球引擎,才上得了足球天梯。 你押的每一場,結果都會當眾對帳、連輸都掛。
                </p>
              </div>
            }
          />
        </div>

        {/* ── 5 階(神諭在最上面)──────────────── */}
        <div className="flex flex-col gap-2">
          {TIERS.slice()
            .reverse()
            .map((t) => {
              const apex = t.n === 5;
              return (
                <div
                  key={t.n}
                  className={`flex items-center gap-4 p-4 border ${
                    apex
                      ? "border-gold/70 bg-gold/[0.07] glow-soft"
                      : "border-line/60 bg-slate/30"
                  }`}
                >
                  <span
                    className={`font-mono text-2xl tabular font-light w-7 shrink-0 text-center ${
                      apex ? "text-gold" : "text-mute/60"
                    }`}
                  >
                    {t.n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className={`text-lg sm:text-xl font-light tracking-tight ${
                          apex ? "text-gold" : "text-bone"
                        }`}
                      >
                        {t.zh}
                      </span>
                      <span
                        lang="en"
                        className="font-mono text-mute/55 text-[9px] tracking-[0.3em]"
                      >
                        {t.en}
                      </span>
                      {apex && (
                        <span className="font-mono text-gold/80 text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/50">
                          王座
                        </span>
                      )}
                    </p>
                    <p className="text-mute text-sm leading-snug mt-0.5">{t.one}</p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* ── 升階硬條件 ─────────────────── */}
        <div className="mt-8 border-l-2 border-gold/60 bg-gold/[0.05] pl-4 py-3">
          <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-1.5">
            升階硬條件
          </p>
          <p className="text-bone text-sm sm:text-base leading-relaxed">
            坐上神準手 / 神諭,要在 <span className="text-gold">≥30 場</span>的公開對帳裡、命中率
            <span className="text-gold">守在 60% 以上</span> —— 那是連我們自己的引擎現在都還沒穩穩站上的狠線
            (棒球引擎才 53%)。 十場、一晚的手氣不算;<span className="text-gold">每月結算</span>,守不住、階級就掉。
          </p>
          <p className="mt-2 font-mono text-mute/60 text-[11px] leading-relaxed">
            ▸ 兩台免費引擎(蒙地卡羅 / Dixon-Coles)現在就跟你一起在榜上排、一起升降 ·
            所有運動的預測算一起。 你的工作:爬到它上面。
          </p>
        </div>

        {/* ── 王座狀態 + 去押(認得本人 · client island · 不對有戰績的人喊「第一注」)──────
            board.show(跨用戶榜亮沒)是 server 真相 → 當 prop 傳;本人押了幾場是 client 端讀。 */}
        <LadderClimbCTA boardShown={board.show} matchResults={matchResults} />
      </main>

      <Footer />
    </div>
  );
}
