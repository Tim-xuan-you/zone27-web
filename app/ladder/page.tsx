import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import YourRecordStrip from "@/components/YourRecordStrip";
import { getFinalizedMatches } from "@/lib/matches";
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
export const revalidate = 86400;

// 5 階 · 由低到高 · 每階一句國中生看得懂的話
const TIERS = [
  { n: 1, zh: "新秀", en: "ROOKIE", one: "押滿 10 場 · 就上榜。" },
  { n: 2, zh: "分析師", en: "ANALYST", one: "準度過一半 —— 證明你不是純猜的。" },
  { n: 3, zh: "操盤手", en: "TRADER", one: "比「大家的平均」還準。" },
  { n: 4, zh: "神準手", en: "SHARP", one: "比「機器」還準。" },
  { n: 5, zh: "神諭", en: "ORACLE", one: "機器、大家都贏 · 全站最強。 這是王座。" },
];

export default function LadderPage() {
  // 已結算賽事勝方 · 傳給「你現在的位置」戰績條(client 端評分本人押注)。
  // /ladder 維持 ISR 靜態 · 戰績條 hydrate 後才填本人進度。
  const matchResults = getFinalizedMatches().map((m) => ({
    id: m.id,
    finalWinner: m.finalResult?.winner ?? null,
  }));

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
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-10">
          證明你比機器準。 別的地方只能跟「大家」比 —— 這裡你還能
          <span className="text-bone">跟一台公開的機器正面比準度</span>。
        </p>

        {/* 你現在的位置(登入且押過才顯示 · 把死路 brochure 變個人目標梯度)·
            R189 改讀 DB(取代死掉的匿名版 LadderPosition)*/}
        <YourRecordStrip variant="ladder" matchResults={matchResults} />

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

        {/* ── 升階硬條件 · Tim 拍板(2026-06-03)─────────────────
            每往上爬一階,那個月都得贏過引擎。 累積場數夠了還不算 —— 你得證明你
            「現在」還在贏機器。 這是玩運彩那種自封高手結構上給不了的東西。
            品牌調和:這不是「比誰勝率高」的虛榮榜(= 對手死穴 · calibration-tiers
            紅線明列 win-rate ranking 為品牌自殺)· 而是「你得贏過免費引擎」的硬門檻
            = alpha over baseline · 守紀律不靠一晚手氣。 鐵則放在機械規則之上。 */}
        <div className="mt-8 border-l-2 border-gold/60 bg-gold/[0.05] pl-4 py-3">
          <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-1.5">
            升階硬條件
          </p>
          <p className="text-bone text-sm sm:text-base leading-relaxed">
            每往上爬一階,<span className="text-gold">那個月你都得贏過引擎</span> ——
            累積場數夠了還不算,你得證明你「現在」還在贏機器。
          </p>
          <p className="mt-1.5 text-mute text-sm leading-relaxed">
            別處的「高手」是自己說的;這裡的高手,是<span className="text-bone">打贏那台公開機器</span>才配。 贏不過引擎,這個月就升不上去。
          </p>
        </div>

        {/* ── 機械規則 ──────────────────────── */}
        <p className="mt-6 text-bone text-sm sm:text-base leading-relaxed">
          每個月結算一次 · <span className="text-gold">一個月最多往上爬一階</span> ·
          退步就會掉階。 想爬到神諭,至少要連續好幾個月都夠準 —— 一晚手氣,升不上去。
        </p>
        <p className="mt-2 font-mono text-mute/60 text-[11px] tracking-[0.15em] leading-relaxed">
          靠的是真實準度 · 不是付費、不是年資、不是運氣。
        </p>

        {/* ── 王座狀態 + 去押 ──────────────────── */}
        <div className="mt-10 border-t border-line/40 pt-8">
          <p className="text-bone text-base leading-relaxed mb-1">
            現在 · 王座上只有機器。
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            第一個贏過它的人類,還沒出現。 換你了。
          </p>
          <Link
            href="/matches"
            className="inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            去押第一注 →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
