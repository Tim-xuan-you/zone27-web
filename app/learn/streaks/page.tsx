import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleMeta from "@/components/ArticleMeta";
import FounderSignOff from "@/components/FounderSignOff";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "為什麼連勝會騙你 — 誠實讀一個機率(一)",
  description:
    "一張連勝截圖什麼都證明不了。 一個銅板也能連 7 次正面、一個真的會看球的引擎照樣會連輸 4 場。 短期的連勝與 ROI 是運氣的回聲,不是準度的證明。 那要看什麼?校準、樣本、含輸的帳本——不是連勝截圖。",
  ogTitle: "為什麼連勝會騙你 · 誠實讀一個機率",
  ogDescription:
    "銅板也能連 7 次正面 · 57% 的引擎照樣連輸 4 場 · 連勝與短期 ROI 是運氣的回聲 · 看校準與含輸帳本,別看截圖",
  path: "/learn/streaks",
});

// ── ZONE 27 · /learn/streaks — 機率識讀庫 第一篇 ───────────────────────────────
// Pinnacle 護城河打法:把「怎麼誠實讀一個機率」做成常青庫,免費教。 第一篇挑最反「賣明牌」
// 的一塊 —— 連勝騙局 / 變異數。 報馬仔的整個生意建在「曬連勝截圖」上;這篇用機率把那張截圖
// 拆掉(銅板也能連 7、好引擎照樣連輸),再導向我們真正在量的東西:校準 + 樣本 + 含輸帳本。
// 用我們自己真實的已結算單(台鋼 53% 那場輸)當例子 —— 教育本身就是 disclosure。
//
// 🔴 訪客語氣:白話、不賣弄、不引用學者、不丟術語。 含輸誠實。 不指名對手(用「賣明牌的 /
// 曬連勝的」行為類別)。 每段收尾接一個下一步,不留死路。
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

// 真實已結算單的小證物框(把抽象的「變異數」釘在我們自己一筆輸上)。
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

export default function StreaksPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-7">
            誠實讀一個機率 · 第一篇
          </p>
          <h1 className="text-4xl sm:text-5xl font-light leading-[1.12] tracking-tight text-bone">
            連勝,是最會騙人的
            <br />
            <span className="text-gold">那個數字</span>。
          </h1>
          <p className="mt-6 text-mute text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            一張「8 連紅」的截圖,看起來像實力。 但機率會告訴你:
            那張截圖,其實什麼都沒證明。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        {/* ── 1 · 銅板也能連 7 次正面 ─────────────────── */}
        <Section no="01" zh="一個銅板,也能連 7 次正面">
          <p>
            丟一個公平的銅板,連續 7 次都是正面的機率,大概是{" "}
            <strong className="text-bone">128 分之 1</strong>。 聽起來很罕見對吧?
          </p>
          <p>
            可是——如果有<strong className="text-bone">一千個人</strong>同時在丟銅板,
            那「連 7 次正面」這件事,平均會發生在{" "}
            <strong className="text-gold">七、八個人</strong>身上。 他們什麼本事都沒有,
            純粹是運氣站在那一邊。
          </p>
          <p>
            賣明牌的世界就是這座銅板工廠。 幾百個帳號同時在喊,
            <strong className="text-bone">每天一定有人正在連勝</strong>——然後他把那張截圖貼出來,
            說這是實力。 你看不到的是另外幾百個連輸、然後默默刪檔的帳號。
          </p>
          <p>
            <strong className="text-gold">這叫倖存者偏差</strong>:你只看得到活下來的那張截圖,
            看不到底下那一堆屍體。
          </p>
        </Section>

        {/* ── 2 · 真的會看球的引擎,照樣會連輸 ──────────── */}
        <Section no="02" zh="一個真的會看球的引擎,照樣會連輸 4 場">
          <p>
            這裡有個更反直覺的事實:
            <strong className="text-bone">就算一個引擎是真的準,它還是會常常連輸。</strong>
          </p>
          <p>
            假設一個引擎每一場真的有 <strong className="text-gold">57%</strong> 會說對
            (這已經接近全世界的天花板了)。 就算這麼準,它連輸 4 場的機率,
            在一季裡也會發生<strong className="text-bone">好幾次</strong>。 連輸不代表它壞了——
            那只是<strong className="text-gold">變異數</strong>,是機率本來就長這樣。
          </p>
          <LedgerAside>
            6/12,我們的引擎賽前看好台鋼贏(53%)。 結果台鋼被完封 0:1 輸了。
            這一筆我們標成「落空」,刪不掉、照掛在帳本上。 但 53% 的意思本來就是
            「會輸的那 47% 也會發生」——一場輸,證明不了引擎壞,就像一場贏也證明不了它神。
            <Link
              href="/track-record"
              className="ml-1 text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
            >
              整本含輸帳本 →
            </Link>
          </LedgerAside>
          <p>
            所以反過來也成立:有人連贏 8 場,<strong className="text-bone">不代表他準</strong>;
            我們的引擎某週連輸,<strong className="text-bone">也不代表它笨</strong>。
            單看一段連勝或連輸,你什麼都判斷不出來。
          </p>
        </Section>

        {/* ── 3 · ROI 也會騙你 ───────────────────────── */}
        <Section no="03" zh="「賺多少」也會騙你 — ROI 是運氣的回聲">
          <p>
            那不看連勝,看「報酬率」總行了吧? 短期內,
            <strong className="text-bone">一樣不行</strong>。
          </p>
          <p>
            短期的 ROI(投資報酬率)更會放大運氣。 幾筆剛好壓中的大冷門,
            就能把一個其實在賠錢的人,粉飾成「月賺 30%」。 反過來,一個真的有實力的人,
            也可能因為幾場倒楣,短期帳面難看。
          </p>
          <p>
            <strong className="text-gold">短期的賺賠,是運氣的回聲,不是實力的聲音。</strong>{" "}
            要等到<strong className="text-bone">夠多場</strong>之後,運氣的雜訊才會慢慢退掉、
            真正的實力才浮出來。 而「夠多」通常比你想的多得多。
          </p>
        </Section>

        {/* ── 4 · 那要看什麼? ────────────────────────── */}
        <Section no="04" zh="那到底要看什麼?">
          <p>
            連勝會騙、ROI 會騙——那一個誠實的人,該拿什麼證明自己?
            三件事,全部都得是<strong className="text-bone">含輸</strong>的:
          </p>
          <p>
            <strong className="text-gold">一、校準。</strong>{" "}
            不是「贏幾場」,是「<strong className="text-bone">說的把握準不準</strong>」——
            一個人說 8 成把握的那些場,後來是不是真的中了 8 成?
            這比連勝難太多了,也騙不了人。
            <Link
              href="/calibration"
              className="ml-1 text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
            >
              看校準是怎麼量的 →
            </Link>
          </p>
          <p>
            <strong className="text-gold">二、樣本。</strong>{" "}
            10 場的準不準是運氣,100 場才開始算數。 任何沒掛「打了幾場」的準度數字,
            都該被當成沒說。
          </p>
          <p>
            <strong className="text-gold">三、含輸的帳本。</strong>{" "}
            最關鍵的一條:他<strong className="text-bone">敢不敢把輸的也攤出來</strong>?
            賣明牌的靠的就是「贏了曬、輸了刪」。 一個賽前就鎖死、贏輸都留著、改不掉的帳本——
            那才是連勝截圖永遠給不了的東西。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/track-record"
              className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              看我們含輸的公開帳本 →
            </Link>
            <Link
              href="/lab"
              className="inline-block px-5 py-2.5 border border-line/60 text-mute hover:text-gold hover:border-gold/60 font-mono text-[10px] tracking-[0.3em] transition-colors"
            >
              親手跑一場引擎 →
            </Link>
          </div>
        </Section>

        {/* ── 收尾 ─────────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p className="text-mute text-[15px] leading-relaxed">
            下次有人拿一張連勝截圖跟你說他很準,你已經知道怎麼拆它了:
            <span className="text-bone">問他輸的那些在哪。</span>{" "}
            截圖會說謊,含輸的帳本不會。
          </p>
        </section>

        <FounderSignOff signedAt="2026-06-13">
          <p>
            我做這個引擎不是為了曬連勝——它會連輸,我也照掛。 我能給你的不是「神準」,
            是一本贏輸都不刪、賽前就鎖死的帳本,讓你自己驗。 這篇,是把驗的方法也一起公開。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/learn/streaks" />
      </main>

      <Footer />
    </div>
  );
}
