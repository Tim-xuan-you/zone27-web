import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import MmaDrawCard from "@/components/MmaDrawCard";
import MmaRecordCard from "@/components/MmaRecordCard";
import { createPageMetadata } from "@/lib/page-og";
import {
  MMA_CARD,
  drawCounts,
  gradeMmaEngine,
  mmaResults,
  mmaEnginePicks,
} from "@/lib/mma/matches";

// ── ZONE 27 · /mma · UFC 引擎逐場開盤 + 賽前鎖定押注(運彩在賣的場 · v0.1)──────────────────
// 新運動擴張(承棒球/足球/網球/羽球)· 運彩 = 覆蓋目錄,只查它賣哪些場 → 用自己引擎跑 → 只秀
// 自己機率,絕不爬盤口、絕不顯示賠率。 隔離在 lib/mma。 兩向 Elo · 曲線壓平(MMA 變異大、誠實)。
//
// 🔴 第一要務 = 誠實框架:MMA 是全站最難預測的運動 —— 每 3 個大熱門就有 1 個翻盤,連盤口也只
//   ~65%、我們的誠實天花板 ~63%。 那個喊「今晚 85% 鎖定」的人才是你該躲的。 賣的是校準不是鐵口。
// 🔴 第二 = 米其林克制:認不出 / 資料太薄(首戰、臨時替補)→ 引擎不硬開,但你照樣能押(Tim 鐵律:
//   能上架就能押)。 名字一律用運彩的。 賽果 Tim 賽後手 curate。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "UFC · 引擎逐場開盤",
  description:
    "台灣運彩在賣的 UFC,我們的引擎用戰力換算逐場開出勝率 —— 不是盤口。 MMA 是最難預測的運動,每 3 個大熱門就有 1 個翻盤,我們賣的是誠實校準不是神準。 認不出的選手誠實標、不開假盤,但你照樣能押。",
  ogTitle: "UFC · 引擎逐場開盤 · ZONE 27",
  ogDescription: "運彩在賣的 UFC · 引擎自己算的勝率 · 不是盤口 · 最難預測的運動 · 賣校準不賣鐵口",
  path: "/mma",
});

export const revalidate = 3600;

export default function MmaPage() {
  const { shown, lined, leaned, listed } = drawCounts();
  const eng = gradeMmaEngine();
  const results = mmaResults();
  const enginePicks = mmaEnginePicks();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="mma" />
      <SportTabs active="mma" />

      <main id="main">
        {/* ── HEADER ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-8">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">UFC · 引擎逐場開盤</p>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30">
              v0.1
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            我們<span className="text-gold">自己算</span>的勝率
          </h1>
          <p className="mt-4 text-mute text-sm leading-relaxed max-w-2xl">
            UFC 格鬥之夜 · 巴庫(Fiziev vs Torres)· 我們的引擎用
            <span className="text-bone">戰力換算的實力分</span>逐場開出勝率。{" "}
            <span className="text-bone">這不是盤口</span> —— 是我們自己算、敢攤開對帳的數字。
          </p>

          {/* 🔴 誠實框架(本頁第一要務 · MMA 是最難預測的運動 · 防「看起來準=神準」誤讀) */}
          <div className="mt-5 border-l-2 border-gold/50 pl-4 text-mute text-[13px] sm:text-sm leading-relaxed max-w-2xl">
            <p>
              MMA 是<span className="text-bone">全世界最難預測的運動</span> —— 一拳就能 KO,
              每 <span className="text-gold">3 個大熱門就有 1 個翻盤</span>。 連 Vegas 盤口長期也只
              猜對<span className="text-gold">約 2/3</span>,我們的誠實天花板約 <span className="text-gold tabular">63%</span>。
              那個跟你保證「今晚 85% 鎖定」的人,正是你該<span className="text-bone">拔腿就跑</span>的人。{" "}
              <Link href="/calibration" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
                校準是什麼 →
              </Link>
            </p>
          </div>

          {/* 覆蓋率誠實揭露 + 米其林式克制 */}
          <p className="mt-5 font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed max-w-2xl">
            這張卡運彩列了 <span className="text-bone tabular">{listed}</span> 場 ·
            我們全放上桌(<span className="text-bone tabular">{shown}</span> 場)·
            其中 <span className="text-gold tabular">{lined}</span> 場兩位都認得、開得出引擎線
            (有 <span className="text-gold tabular">{leaned}</span> 場引擎有傾向,其餘是同等級的
            <span className="text-bone">純銅板</span>),剩下認不出的選手<span className="text-bone">誠實標「算不出」</span>。
            🔴 不管引擎開不開得出線,<span className="text-bone">你照樣能押</span> —— 你的判斷比引擎值錢。
            選手名稱用台灣運彩的。
          </p>
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        {/* ── 真實賽卡看板(主賽事在上)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">UFC 格鬥之夜 · 巴庫</p>
            <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">
              6/27-6/28 · 台北時間 · 主賽事在最上
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MMA_CARD.map((f) => (
              <MmaDrawCard key={f.id} fight={f} />
            ))}
          </div>
        </section>

        {/* ── 你的 UFC 戰績(登入且押過才顯示 · client island · graceful)── */}
        <MmaRecordCard
          results={results}
          enginePicks={enginePicks}
          wrapperClass="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8"
        />

        {/* ── 引擎戰績(誠實 pending · 第一場結算後才長出來)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎公開戰績</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              引擎已賽前開盤 <span className="text-gold tabular">{eng.pending}</span> 場有傾向的(同等級的
              銅板場不進戰績 —— 我們不把「沒選邊」灌成預測)· 還沒有一場結算。 第一場打完就逐場對帳、
              <span className="text-bone">命中落空都掛、刪不掉</span>,跟其他運動<span className="text-bone">分開算</span>。
            </p>
          </div>
        </section>

        {/* ── 引擎怎麼算(誠實註腳 + 連 /calibration)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎怎麼算</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              戰績 + 排名換算成戰力分 + Elo —— 但 🔴 <span className="text-bone">曲線刻意壓平</span>:MMA 一拳
              就能 KO、變異極大,所以再大的實力差我們也只喊到 ~88-90%、<span className="text-bone">絕不喊 97%</span>
              (連 -400 的重磅大熱門實際也只贏 88-93%)。 把「MMA 是帶傾向的銅板」這個事實寫進數學本身。
            </p>
            <p className="mt-3 text-mute/70 text-[12px] leading-relaxed">
              戰力分是<span className="text-mute">編輯估計值(非官方數據)</span>,隨真實賽果更新。 引擎只看戰力:
              沒看臨場狀態、減重、傷停 —— 那正是你的判斷比引擎值錢的地方。 我們不接受下注、不顯示盤口、不喊穩贏。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/calibration"
                className="font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
              >
                校準是什麼 · 喊 63% 真的中 63% 嗎 →
              </Link>
              <Link
                href="/tennis"
                className="font-mono text-mute/60 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
              >
                看網球引擎開盤 →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
