import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  // ── ZONE 27 首頁靈魂 ───────────────────────────────
  // 中信兄弟(主隊) 62%  /  統一獅(客隊) 38%
  // 蒙地卡羅 10,000 次模擬 — AI 量化分析師,不是算命仙
  // ─────────────────────────────────────────────────

  const matchDate = "2026 · 05 · 19  ·  星期二 18:35";
  const home = {
    name: "中信兄弟",
    en: "BROTHERS",
    pitcher: "德保拉",
    era: "2.84",
    winRate: 62,
  };
  const away = {
    name: "統一獅",
    en: "LIONS",
    pitcher: "古林睿煬",
    era: "3.41",
    winRate: 38,
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      {/* ── HERO ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 sm:px-10 pt-24 pb-12 text-center">
        <p className="font-mono text-gold/70 text-xs tracking-[0.4em] mb-8">
          A QUANTITATIVE SPORTS INTELLIGENCE CLUB · EST. 2026
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          不靠直覺,
          <br />
          <span className="text-gold">只看演算法。</span>
        </h1>

        <p className="font-mono text-mute text-sm tracking-[0.3em] mt-8">
          WE DON&apos;T GUESS. WE COMPUTE.
        </p>

        <p className="mt-10 max-w-xl mx-auto text-mute leading-relaxed">
          全台第一個為硬核棒球迷打造的暗黑黃金級數據俱樂部。
          <br />
          蒙地卡羅 AI 模擬器 · 不可篡改的勝率紀錄 · 零手續費的會員制社群。
        </p>
      </section>

      {/* ── HAIRLINE GOLD DIVIDER ──────────────────── */}
      <div className="mx-auto w-32 gold-line mb-16" />

      {/* ── THE SIGNATURE PREDICTION CARD ──────────── */}
      <section className="mx-auto w-full max-w-3xl px-6 sm:px-10 pb-24">
        <div className="bg-slate/70 border border-line/80 glow-soft p-8 sm:p-12">
          {/* Card header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shimmer" />
              <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
                LIVE AI MODEL · CPBL
              </span>
            </div>
            <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
              {matchDate}
            </span>
          </div>

          {/* Team labels + win rates */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* HOME */}
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                HOME
              </p>
              <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
                {home.name}
              </h2>
              <p className="font-mono text-gold/60 text-xs tracking-[0.25em] mt-1">
                {home.en}
              </p>
            </div>
            {/* AWAY */}
            <div className="text-right">
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                AWAY
              </p>
              <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
                {away.name}
              </h2>
              <p className="font-mono text-gold/60 text-xs tracking-[0.25em] mt-1">
                {away.en}
              </p>
            </div>
          </div>

          {/* The signature glow progress bar */}
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-mono text-gold text-3xl sm:text-4xl tabular tracking-tight">
              {home.winRate}
              <span className="text-base text-gold/60 ml-0.5">%</span>
            </span>
            <span className="font-mono text-mute text-3xl sm:text-4xl tabular tracking-tight">
              {away.winRate}
              <span className="text-base text-mute/70 ml-0.5">%</span>
            </span>
          </div>

          {/* The bar itself */}
          <div className="relative h-[3px] bg-line/80 overflow-visible">
            <div
              className="absolute top-0 left-0 h-full bg-gold glow-gold shimmer"
              style={{ width: `${home.winRate}%` }}
            />
            {/* Tick mark at the split */}
            <div
              className="absolute -top-1 h-[11px] w-px bg-gold/80"
              style={{ left: `${home.winRate}%` }}
            />
          </div>

          {/* Methodology line */}
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] mt-5">
            MONTE CARLO · 10,000 SIMULATIONS · TRACKMAN-BASED PRIORS
          </p>

          {/* Pitcher matchup */}
          <div className="mt-10 grid grid-cols-2 gap-6 pt-6 border-t border-line/60">
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                STARTING PITCHER
              </p>
              <p className="text-bone text-lg">{home.pitcher}</p>
              <p className="font-mono text-gold/70 text-xs tabular mt-1">
                ERA · {home.era}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                STARTING PITCHER
              </p>
              <p className="text-bone text-lg">{away.pitcher}</p>
              <p className="font-mono text-gold/70 text-xs tabular mt-1">
                ERA · {away.era}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/matches"
              className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              VIEW ALL TODAY&apos;S BOARD →
            </Link>
          </div>
        </div>

        {/* Tiny note under card */}
        <p className="text-center font-mono text-mute/50 text-[10px] tracking-[0.25em] mt-6">
          AI MODELS PROBABILITY. NOT FORTUNE.
        </p>
      </section>

      {/* ── THREE PILLARS ──────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 py-20 border-t border-line/40">
        <div className="grid sm:grid-cols-3 gap-12">
          <Pillar
            no="01"
            zh="會員制零抽成"
            en="ZERO COMMISSION"
            body="拋開玩運彩 30-50% 的剝奪式抽成。黑金會員月費 NT$ 499,大神賣明牌 100% 全拿。"
          />
          <Pillar
            no="02"
            zh="不可篡改紀錄"
            en="ON-CHAIN TRUTH"
            body="勝率寫死在系統。沒有 LINE 群組的黑箱、沒有刪文截圖,只有殘酷而誠實的數據。"
          />
          <Pillar
            no="03"
            zh="量化視覺化"
            en="WALL-STREET GRADE"
            body="戰力雷達、走勢曲線、模擬偏差復盤 —— 看盤體驗精緻得像高階經紀商的儀表板。"
          />
        </div>
      </section>

      {/* ── FOUNDERS 27 STRIP ──────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          FOUNDERS · 27
        </p>
        <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          僅限 270 位創始會員
        </h3>
        <p className="text-mute mt-4 max-w-md mx-auto leading-relaxed">
          一次性 NT$ 2,700 終身會員資格 · 個人 ID 鑲入 #001 ~ #270 編號徽章
          ·售完永久關閉。
        </p>
        <Link
          href="/founders"
          className="inline-block mt-8 px-10 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          CLAIM YOUR NUMBER →
        </Link>
      </section>

      <Footer />
    </div>
  );
}

function Pillar({
  no,
  zh,
  en,
  body,
}: {
  no: string;
  zh: string;
  en: string;
  body: string;
}) {
  return (
    <div>
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3">
        / {no}
      </p>
      <h4 className="text-xl text-bone font-light tracking-tight mb-1">{zh}</h4>
      <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mb-4">
        {en}
      </p>
      <p className="text-mute text-sm leading-relaxed">{body}</p>
    </div>
  );
}
