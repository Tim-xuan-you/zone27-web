import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleMeta from "@/components/ArticleMeta";
import FounderSignOff from "@/components/FounderSignOff";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "10 場的神準,是運氣還沒被攤平 — 誠實讀一個機率(二)",
  description:
    "一個準度數字,只要沒掛『打了幾場』,就跟沒說一樣。 就算完全擲銅板亂猜,10 場中 8 場以上也有約 5% 機率發生。 要可靠分辨『真的會看球』和『純運氣』,場數得是好幾百到上千——而且越往後,要再穩一點點,要補的場數越來越貴。",
  ogTitle: "10 場的神準,是運氣還沒被攤平 · 誠實讀一個機率",
  ogDescription:
    "沒掛場數的準度等於沒說 · 擲銅板 10 場也能中 8 場以上 · 要數百到上千場運氣才被攤平 · 比準度前先看分母",
  path: "/learn/sample-size",
});

// ── ZONE 27 · /learn/sample-size — 機率識讀庫 第二篇 ───────────────────────────────
// 承第一篇(連勝/變異數)。 第一篇拆「短期連勝是運氣」;這篇補上「那要多少場才算數」——
// 樣本量識讀。 報馬仔的招牌是「曬一張連 N 場的截圖」,缺的剛好就是分母。 這篇教讀者養成一個
// 動作:看到任何準度數字先問「打了幾場?」,沒掛場數的當沒說。 這正是 ZONE 27 把 N= 死死掛在
// 每個準度旁的原因。 用我們自己 5/31 一晚三盤全落空當招供 —— 拿自己開刀比罵對手有說服力。
//
// 🔴 訪客語氣:白話、不賣弄、不引用學者、不丟統計術語當主詞(1/√N 翻成「場數變 10 倍晃動只縮 3 倍」)。
// 含輸誠實。 不指名對手。 量級不給假精確(「數百到上千場」不寫死 1000)。 不導向下注策略。
// 數字已逐筆核對:8+/10≈5.5% · 7+/10≈17% · 5/31 三摃為真 · 晃動帶為 1 SE 粗估。
// ─────────────────────────────────────────────────────

function Section({
  no,
  zh,
  children,
}: {
  no: string;
  zh: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">
        {no}
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-5">
        {zh}
      </h2>
      <div className="space-y-4 text-mute text-[15px] sm:text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

// 真實已結算單的小證物框(把抽象的「樣本太少」釘在我們自己一晚三摃上)。
function LedgerAside({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 border-l-2 border-gold/40 bg-slate/30 pl-4 py-3">
      <p className="font-mono text-gold/60 text-[9px] tracking-[0.3em] mb-1.5">
        / 我們自己的帳本
      </p>
      <p className="text-bone/90 text-[14px] leading-relaxed">{children}</p>
    </div>
  );
}

export default function SampleSizePage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-7">
            誠實讀一個機率 · 第二篇
          </p>
          <h1 className="text-4xl sm:text-5xl font-light leading-[1.12] tracking-tight text-bone">
            10 場全中的「神準」,
            <br />
            多半是<span className="text-gold">運氣還沒被攤平</span>。
          </h1>
          <p className="mt-6 text-mute text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            一個準度數字,只要沒掛「打了幾場」,就跟沒說一樣。
            這篇講的,是那個被所有截圖藏起來的分母。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        {/* ── 1 · 連十場神準,純運氣就做得到 ─────────────── */}
        <Section no="01" zh="那張「連十場神準」的截圖,擲銅板就做得到">
          <p>
            想像體育課,全班 30 個人,每人擲 5 次銅板,比誰擲出最多正面。
            下課前一定有個同學興奮舉手:「我 5 次中 4 次欸!」
            他沒有特異功能 —— 只是<strong className="text-bone">人夠多,總會有人剛好走運</strong>。
          </p>
          <p>
            數字也站在他那邊。 就算一個人完全是擲銅板亂猜(真實命中率 50%),
            他猜 10 場、中 8 場以上的機率大約是 <strong className="text-gold">5%~6%</strong> ·
            中 7 場以上更有 <strong className="text-gold">約 17%</strong>。 所以一群人裡,
            <strong className="text-bone">總會冒出幾個看起來「超準」的</strong> —— 那不是本事,是人多。
          </p>
          <p>
            賣明牌的世界,就是放大版的體育課。 幾百個帳號同時在喊,
            每天一定有人正在連勝;他把那張截圖貼出來,說這是實力。
            你看不到的,是另外幾百個連摃、然後默默刪檔的帳號。
          </p>
          <p>
            <strong className="text-gold">你只看得到活下來的那張截圖</strong>,
            看不到底下那一堆屍體。 第一篇講的就是這個;這篇要問的是下一步 ——
            <strong className="text-bone">那到底要看幾場,才知道誰是真有本事?</strong>
          </p>
        </Section>

        {/* ── 2 · 沒掛場數的準度,等於沒說 ──────────────── */}
        <Section no="02" zh="沒掛「打了幾場」的準度,等於沒說">
          <p>
            養成一個動作:看到任何準度數字,
            <strong className="text-bone">先找它的分母 —— 打了幾場?</strong>
          </p>
          <p>
            兩個人都報準度給你:一個說「我命中 <strong className="text-gold">85%</strong>」,
            打了 <strong className="text-bone">10 場</strong>;一個說「我命中{" "}
            <strong className="text-gold">56%</strong>」,打了{" "}
            <strong className="text-bone">600 場</strong>。 直覺會選 85% 那個 ——
            但其實<strong className="text-bone">後者才更值得信</strong>。 85% 那個,
            十場裡的運氣還沒退掉,數字隨時會垮;56% 那個,是運氣被磨掉之後,還站得住的真實水準。
          </p>
          <p>
            為什麼場數少數字就不能當真? 因為它會<strong className="text-gold">劇烈晃動</strong>。
            假設一個人真實水準就是擲銅板 50%:他打 10 場時,帳面數字可以在 50% 上下
            <strong className="text-bone">亂飄到 ±15 個百分點都不奇怪</strong>;
            要打到 100 場,才會收斂到大約 ±5 個百分點;1000 場,才收到 ±2 以內。
          </p>
          <p>
            場數越少,你看到的那個漂亮數字,
            <strong className="text-bone">越可能只是它「剛好飄到」的位置</strong> —— 不是它真正的高度。
          </p>
        </Section>

        {/* ── 3 · 要多少場才算數 ───────────────────────── */}
        <Section no="03" zh="要多少場才算數?誠實的量級是「好幾百到上千」">
          <p>
            這裡有個殘酷的事實:<strong className="text-bone">真本事和擲銅板的差距,其實很小。</strong>
            全世界最強的運動模型,賽前單場勝率的天花板大約也只到{" "}
            <strong className="text-gold">5 成 7</strong> —— 因為棒球本來就有一半是運氣。
          </p>
          <p>
            差距越小,就越難分辨。 想可靠地分清楚「<strong className="text-bone">真的有 55% 本事</strong>」
            和「<strong className="text-bone">其實只是擲銅板 50%</strong>」,需要的場數量級,大約是
            <strong className="text-gold">好幾百場,保守看要到上千場</strong>。 不是十場、二十場。
            (這是量級,不是精確刻度 —— 你想分辨的差距越小、要的把握越高,需要的場數就越多。)
          </p>
          <LedgerAside>
            就拿我們自己開刀:2026-05-31 那一晚,引擎賽前三盤全看走眼 —— 看好味全(54%)、
            富邦(57%)、台鋼(57%),結果三場全落空,<strong className="text-bone">一晚 0 中 3</strong>。
            如果你只看這一晚,你會以為這引擎爛透了。 但這正是「三場太少」的活教材:
            一晚的成績被運氣主宰,要很多很多場之後,真實水準才看得出來。 這三筆都標「落空」,
            刪不掉、照掛。
            <Link
              href="/track-record"
              className="ml-1 text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
            >
              連同押對的整本帳 →
            </Link>
          </LedgerAside>
          <p>
            所以「賽季才打到一半」的時候,任何準度數字都還在劇烈晃動。
            一個誠實的人,這時候會說「<strong className="text-bone">現在場數還太少,看不準</strong>」——
            而不是趁數字剛好漂亮,喊自己很神。
          </p>
        </Section>

        {/* ── 4 · 運氣怎麼被攤平 · 越往後越貴 ──────────── */}
        <Section no="04" zh="運氣是怎麼被攤平的:越往後,越貴">
          <p>
            最後一個反直覺的點:運氣會被場數攤平,
            但它<strong className="text-bone">退得越來越慢</strong>。
          </p>
          <p>
            場數從 10 場變成 100 場(多了 10 倍),數字的晃動只縮小大約{" "}
            <strong className="text-gold">3 倍</strong>。 想把晃動再砍到十分之一?
            場數得變成<strong className="text-bone">100 倍</strong>(從 10 場到 1000 場)。
            也就是說,<strong className="text-bone">後面每多擠出一點準度,要付出的場數越來越貴。</strong>
          </p>
          <p>
            這就是為什麼「再打幾場應該就穩了」是錯覺 ——
            前面那幾十場退掉的是大塊運氣,後面要再穩一點點,得用成倍的場數去換。
            沒有捷徑,只能讓它一直打下去。
          </p>
          <p>
            所以 ZONE 27 把<strong className="text-gold">場數(打了幾場)死死掛在每一個準度數字旁邊</strong>。
            不是裝專業 —— 是因為一個沒有分母的命中率,根本不能信。
            我們的帳本好壞全留、賽前就鎖死、事後改不了,你看到的命中率旁邊,
            永遠跟著它累積了多少場;那才是能拿來判斷的東西。
            那種「連 10 場神準」的截圖,缺的剛好就是這個分母。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/track-record"
              className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              看我們含輸的公開帳本 →
            </Link>
            <Link
              href="/calibration"
              className="inline-block px-5 py-2.5 border border-line/60 text-mute hover:text-gold hover:border-gold/60 font-mono text-[10px] tracking-[0.3em] transition-colors"
            >
              引擎準不準 · 公開校準 →
            </Link>
          </div>
        </Section>

        {/* ── 收尾 ─────────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p className="text-mute text-[15px] leading-relaxed">
            下次有人拿準度數字跟你說他很準,你已經知道第二個問題怎麼問了:
            <span className="text-bone">「這是打了幾場的數字?」</span>{" "}
            沒有分母的神準,先當它沒說過。
          </p>
        </section>

        <FounderSignOff signedAt="2026-06-14">
          <p>
            我自己的引擎,一個晚上三盤全摃過 —— 我照掛在帳本上,沒刪。
            因為我知道幾場根本看不出什麼,要很多場、好壞全留,那個命中率才開始算數。
            所以我把場數釘在每個數字旁邊;這篇,是把為什麼也一起說清楚。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/learn/sample-size" />
      </main>

      <Footer />
    </div>
  );
}
