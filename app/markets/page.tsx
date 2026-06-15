import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import MarketCard from "@/components/MarketCard";
import { getOpenMarkets, getSettledMarkets } from "@/lib/markets";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /markets · 開盤 · 群眾預測市場(R239)──────────────────────────────
// 引擎只覆蓋部分賽事;這裡是「任何一場都能開」的群眾盤(Tim 截圖任一場 → 開一張卡)。
// 所有登入會員賽前鎖一手 + 留理由 + 看群眾共識 + 賽後對帳。 0 盤口 / 0 對賭 / 0 引擎線。
// 全 reuse(MarketCard → SoccerBetStrip + MatchSegment · match_id-keyed · 0 migration)。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "開盤 · 群眾預測市場",
  description:
    "引擎沒覆蓋的任一場,也能賽前鎖一手。 ZONE 27 群眾盤:賽前鎖死、看群眾共識、賽後逐場對帳 —— 不秀盤口、不對賭、連輸的都掛。",
  path: "/markets",
});

// 群眾共識 / 誰鎖了 隨押注更新 · 5 分鐘 ISR(押注卡本身是 client 島 · 即時)。
export const revalidate = 300;

export default function MarketsPage() {
  const open = getOpenMarkets();
  const settled = getSettledMarkets();
  const has = open.length > 0 || settled.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 開盤 · 群眾預測市場
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
            引擎沒覆蓋的場 ·{" "}
            <span className="text-gold">群眾自己開盤</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            我們的引擎只算部分賽事。 但你想押的場很多 —— 任何一場,都能在這裡賽前鎖一手:
            看群眾共識怎麼站、留一句你為什麼看好、賽後逐場對帳。{" "}
            <span className="text-bone">不秀盤口、不對賭、連輸的都掛。</span>
          </p>
          <p className="mt-3 font-mono text-mute/55 text-[11px] tracking-[0.15em] leading-relaxed">
            ▸ 群眾盤 · 無引擎線(引擎沒覆蓋這些場)· 押了不可改 · 賽前鎖定以提交時間為證。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {has ? (
          <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16 space-y-6">
            {open.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
            {settled.length > 0 && (
              <>
                <p className="font-mono text-mute/60 text-[10px] tracking-[0.35em] pt-4">
                  已結束 · 賽後對帳
                </p>
                {settled.map((m) => (
                  <MarketCard key={m.id} market={m} />
                ))}
              </>
            )}
          </section>
        ) : (
          <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16">
            <div className="border border-line/60 bg-slate/30 p-6 text-center">
              <p className="text-bone text-sm font-light leading-relaxed">
                目前<span className="text-gold">沒有開盤中的群眾盤</span>。
              </p>
              <p className="mt-1.5 text-mute/80 text-[12px] leading-relaxed">
                有想押的場?寫信告訴站長,我們就開一張(我們不每天開、只開值得押的)。
              </p>
            </div>
          </section>
        )}

        <RelatedReading currentPath="/markets" />
      </main>

      <Footer />
    </div>
  );
}
