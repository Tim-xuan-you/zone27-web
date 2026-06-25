import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import BadmintonDrawCard from "@/components/BadmintonDrawCard";
import { createPageMetadata } from "@/lib/page-og";
import {
  BADMINTON_DRAW,
  drawCounts,
  gradeBadmintonEngine,
} from "@/lib/badminton/matches";

// ── ZONE 27 · /badminton · 羽球引擎逐場開盤(台灣運彩在賣的場 · v0.1)──────────────────
// 新運動擴張(承棒球 / 足球 / 網球)· CPBL 模式:從台灣運彩看板 curate 真實對戰(名字一字不改)·
// 引擎用「BWF 排名換算實力分」逐場開盤(Elo · 羽球室內無場地差 → 比網球更單純)· 只秀自己機率,
// 絕不爬盤口、絕不顯示賠率。 隔離在 lib/badminton(不碰其他運動)· 0 資料庫改動 · v0.1 純讀不接押注。
//
// 🔴 第一要務 = 誠實框架:羽球熱門贏面高,引擎喊六七成不是神準,是羽球本來就好預測;賣點是校準。
//   第二 = 米其林式克制:認不出 / 排名查不到 → 誠實標,不開假盤。 美國公開賽這輪大半是資格賽,
//   我們只把敢負責的放上桌。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "羽球 · 引擎逐場開盤",
  description:
    "台灣運彩在賣的羽球,我們的引擎用 BWF 排名換算的實力分逐場開出勝率 —— 不是盤口。 羽球熱門贏面天生高,我們賣的是誠實校準不是神準。 認不出的選手(資格賽)誠實標、不開假盤。",
  ogTitle: "羽球 · 引擎逐場開盤 · ZONE 27",
  ogDescription: "運彩在賣的羽球 · 引擎自己算的勝率 · 不是盤口 · 認不出的誠實不開",
  path: "/badminton",
});

// ISR · 1 小時(純讀 curate 資料 · 無外部 fetch · 便宜)。
export const revalidate = 3600;

export default function BadmintonPage() {
  const { shown, lined, listed } = drawCounts();
  const eng = gradeBadmintonEngine();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="badminton" />
      <SportTabs active="badminton" />

      <main id="main">
        {/* ── HEADER ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-8">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">羽球 · 引擎逐場開盤</p>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30">
              v0.1
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            我們<span className="text-gold">自己算</span>的勝率
          </h1>
          <p className="mt-4 text-mute text-sm leading-relaxed max-w-2xl">
            台灣運彩在賣的羽球,我們的引擎用 <span className="text-bone">BWF 排名換算的實力分</span>
            逐場開出勝率。 <span className="text-bone">這不是盤口</span> —— 是我們自己算、敢攤開對帳的數字。
          </p>

          {/* 🔴 誠實框架(本頁第一要務 · 防「看起來準=神準」誤讀) */}
          <div className="mt-5 border-l-2 border-gold/50 pl-4 text-mute text-[13px] sm:text-sm leading-relaxed max-w-2xl">
            <p>
              羽球熱門贏面高,但<span className="text-bone">沒有「神準」這種引擎</span> ——
              全世界最強的賽前模型、連職業盤口,長期單場也只猜對<span className="text-gold">六成出頭</span>,
              跟網球同級、只比棒球高一點點。 我們賣的不是「很準」,是<span className="text-bone">敢公開到底準幾成</span>。{" "}
              <Link
                href="/calibration"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                校準是什麼 →
              </Link>
            </p>
          </div>

          {/* 覆蓋率誠實揭露 + 米其林式克制 */}
          <p className="mt-5 font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed max-w-2xl">
            美國公開賽這一輪 · 運彩列了 <span className="text-bone tabular">{listed}</span> 場
            (男單 8 + 女單 8)· 絕大多數是我們認不出、查不到排名的資格賽選手。 我們只把{" "}
            <span className="text-bone tabular">{shown}</span> 場敢負責的放上桌 ——
            其中 <span className="text-gold tabular">{lined}</span> 場兩位都認得、開得出引擎線,
            其餘是台灣選手對上認不出的對手,<span className="text-bone">誠實標「不開假盤」</span>。
            賭場什麼都敢開,我們只開算得出的。 球員名稱用台灣運彩的。
          </p>
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        {/* ── 真實賽程看板 ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">美國公開賽 · 男單</p>
            <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">
              BWF SUPER 300 · 6/26 · 台北時間
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {BADMINTON_DRAW.map((m) => (
              <BadmintonDrawCard key={m.id} match={m} />
            ))}
          </div>
        </section>

        {/* ── 引擎戰績(誠實 pending · 第一場結算後才長出來)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎公開戰績</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              引擎已賽前開盤 <span className="text-gold tabular">{eng.pending}</span> 場 ——
              還沒有一場結算。 第一場打完就逐場對帳、<span className="text-bone">命中落空都掛、刪不掉</span>,
              跟棒球 / 足球 / 網球<span className="text-bone">分開算</span>(各運動各自一本帳)。
            </p>
          </div>
        </section>

        {/* ── 引擎怎麼算(誠實註腳 + 連 /calibration)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎怎麼算</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              BWF 世界排名換算成實力分 + 標準 Elo —— 純數學、攤得開、可重算。 羽球室內無風、無場地差,
              比網球還單純(一人一個實力分就夠)。 種子排名是
              <span className="text-mute">編輯估計值(非官方數據)</span>,隨真實賽果一場一場更新。
            </p>
            <p className="mt-3 text-mute/70 text-[12px] leading-relaxed">
              引擎只看排名:<span className="text-mute">沒看傷停、臨場狀態</span> —— 那正是你的判斷比
              引擎值錢的地方(所以認不出的我們不硬開)。 我們不接受下注、不顯示盤口、不喊穩贏。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/calibration"
                className="font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
              >
                校準是什麼 · 喊 70% 真的中 70% 嗎 →
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
