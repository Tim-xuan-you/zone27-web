import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getTrackRecordStats } from "@/lib/matches";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /engines · 認識我們的兩顆引擎 ────────────────────────────────
// Tim「直接把兩種引擎寫出來、為它們專門做一頁」。 定位 = 坦白書,不是戰績吹牛:
// 大方寫出方法的名字 + 怎麼算 + 為什麼選 + 它也會錯、所以逐場對帳。 國小生看得懂。
// 🔴 紅線(逐條對過):無「神準/最準/比莊家準」· 無付費=更準(引擎人人免費)·
//    無 GitHub/開源/原始碼字眼 · 不指名對手 · 不掛盤口賠率 · 暗金無紅綠 emoji。
// 這頁是 /methodology(深技術版)的白話前門;深想看的人從這裡點進去。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "我們用什麼算的 · 三套引擎",
  description:
    "別人說「我家 AI 神準」卻不說怎麼算的。 ZONE 27 把方法的名字、怎麼運作、會錯幾成全部寫給你看:棒球用逐打席蒙地卡羅模擬、足球用 Dixon-Coles 雙變量卜瓦松、網球用表面校正 Elo。 最被尊重的標準方法,不是神準 —— 因為沒有神準這種事。",
  ogTitle: "我們用什麼幫你算誰會贏 · 三套引擎攤在桌上",
  ogDescription:
    "棒球:逐打席蒙地卡羅 · 足球:Dixon-Coles · 網球:表面校正 Elo · 最被尊重的標準方法,不是神準 · 每場賽前鎖死、賽後對帳、連沒中的都掛",
  path: "/engines",
  type: "article",
});

export const revalidate = 3600;

export default function EnginesPage() {
  const tr = getTrackRecordStats();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-16 sm:pt-20 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 我們的引擎
          </p>
          <h1 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1.12]">
            我們用什麼<span className="text-gold">幫你算誰會贏</span>
          </h1>
          <div className="zone27-rule max-w-[300px] mt-7 mb-7" aria-hidden="true" />
          <p className="text-mute text-base sm:text-lg leading-relaxed max-w-2xl">
            別人說「我家 AI 神準」,然後不告訴你怎麼算的。 我們相反 ——{" "}
            <span className="text-bone">
              方法的名字、怎麼運作、會錯幾成,全部寫給你看。
            </span>
          </p>
        </section>

        {/* ── 三套引擎(一運動一套標準方法)─────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-2 grid gap-5 sm:grid-cols-2">
          <EngineCard
            sport="棒球"
            name="逐打席蒙地卡羅模擬"
            how="把整場球在電腦裡,用「每個打席會發生什麼」的真實機率,從第一局打到第九局 —— 打一萬次。 哪一隊贏比較多次,那個比例就是我們給你的勝率。"
            why="棒球本來就是一個打席一個打席組成的。 用打席機率去模擬,最貼近真實、也最透明 —— 你能按下按鈕,親眼看它在電腦裡打那一萬場。 沒有黑箱、沒有玄學。"
            ctaHref="/lab"
            ctaLabel="去實驗室看它跑 →"
          />
          <EngineCard
            sport="足球"
            name="Dixon-Coles 雙變量卜瓦松"
            how="用兩隊的「進攻力、防守力」,算出各自大概會進幾球,再推出主隊贏 / 平手 / 客隊贏的機率。"
            why="足球進球少、平手多,這套數學是全世界足球分析的底層方法,公認最適合足球。"
            ctaHref="/soccer"
            ctaLabel="看足球開盤 →"
          />
          <EngineCard
            sport="網球 · 新"
            name="表面校正 Elo"
            how="把每位球員的世界排名換算成實力分,加上草地 / 紅土的表面校正,再用標準 Elo 邏輯算出兩人各自的勝率。"
            why="Elo 是網球分析最通用、最透明的底層方法(FiveThirtyEight、Tennis Abstract 都用這套)。 我們用排名換算當起點,隨真實賽果一場一場磨 —— 溫網開打,賽果正在逐場對帳建置中。"
            ctaHref="/tennis"
            ctaLabel="看網球開盤 →"
          />
        </section>

        {/* ── 坦白核心(這頁的靈魂)─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6 py-1">
            <p className="text-bone text-lg sm:text-xl font-light leading-relaxed">
              這三套都不是我們關起門發明的神祕 AI —— 是各自運動裡
              <span className="text-gold">最被尊重、最標準、也最透明</span>的方法。
            </p>
            <p className="mt-4 text-mute leading-relaxed">
              但它們<span className="text-bone">照樣會錯</span>。 連全世界最強的引擎,單場棒球也只到大約{" "}
              <span className="text-bone">5 成 7</span>,足球更低。 任何說自己「神準」的,數學上都在騙你。
            </p>
            <p className="mt-4 text-mute leading-relaxed">
              (網球會<span className="text-bone">看起來準很多</span> —— 那不是我們變天才,是網球
              <span className="text-bone">本來就好預測</span>(一個人控制每一球、磨平運氣)。 所以網球我們
              更要看<span className="text-gold">校準</span>,不是準度。)
            </p>
            <p className="mt-4 text-mute leading-relaxed">
              所以我們做一件別人不敢做的事:
              <span className="text-bone">每一場賽前鎖死、賽後逐場對帳 —— 中的、沒中的,都掛出來。</span>
            </p>
          </div>

          {/* 活證據:不是嘴上說透明,直接掛真戰績(含沒中的)*/}
          {tr.total > 0 && (
            <Link
              href="/track-record"
              className="mt-7 inline-flex items-baseline gap-2.5 sm:gap-3 font-mono tabular flex-wrap hover:opacity-80 transition-opacity"
              aria-label={`引擎公開戰績 · ${tr.total} 場已對帳 · 命中 ${tr.proved} · 沒中 ${tr.diverged}`}
            >
              <span className="text-mute text-[10px] tracking-[0.3em]">引擎戰績</span>
              <span className="text-bone text-sm">
                <strong className="text-gold">{tr.total}</strong> 場
              </span>
              <span className="text-gold text-sm">✓{tr.proved}</span>
              <span className="text-loss/85 text-sm">✕{tr.diverged}</span>
              <span className="text-mute text-[9px] tracking-[0.2em]">連沒中的也掛 →</span>
            </Link>
          )}
        </section>

        {/* ── 深一層 + 自己測 ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] tracking-[0.3em]">
            <Link href="/methodology" className="text-gold/80 hover:text-gold transition-colors">
              想看更深的技術說明 →
            </Link>
            <Link href="/calibration" className="text-mute hover:text-gold transition-colors">
              看引擎到底準不準 →
            </Link>
            <Link href="/calibration/test" className="text-mute hover:text-gold transition-colors">
              先測你自己多準 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── 單顆引擎卡 ─────────────────────────────────────────
function EngineCard({
  sport,
  name,
  how,
  why,
  ctaHref,
  ctaLabel,
}: {
  sport: string;
  name: string;
  how: string;
  why: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <article className="bg-slate/40 border border-line/60 p-5 sm:p-6 flex flex-col">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2">{sport}</p>
      <h2 className="text-xl sm:text-2xl text-bone font-light tracking-tight leading-snug mb-4">
        {name}
      </h2>
      <p className="text-mute text-sm leading-relaxed mb-4">
        <span className="text-bone/80">怎麼算:</span>
        {how}
      </p>
      <p className="text-mute text-sm leading-relaxed mb-5">
        <span className="text-bone/80">為什麼用它:</span>
        {why}
      </p>
      <Link
        href={ctaHref}
        className="mt-auto font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
      >
        {ctaLabel}
      </Link>
    </article>
  );
}
