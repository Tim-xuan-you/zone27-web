import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroLiveCard from "@/components/HeroLiveCard";
import { matches } from "@/lib/matches";

export default function Home() {
  // ── ZONE 27 首頁靈魂 ───────────────────────────────
  // Hero card 從 v0.21 起改為 LIVE — 訪客打開首頁的當下,
  // 演算法在他眼前跑出收斂。資料源自 lib/matches.ts。
  //
  // Defense: matches[0] is undefined-safe — if matches.ts is empty
  // (migration in progress), the Hero falls back to a static
  // "engine ready" card instead of crashing.
  // ─────────────────────────────────────────────────
  const featuredMatch = matches[0];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">
      {/* ── HERO ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 sm:px-10 pt-24 pb-12 text-center">
        <p
          lang="en"
          className="font-mono text-gold/70 text-xs tracking-[0.4em] mb-8"
        >
          A QUANTITATIVE SPORTS INTELLIGENCE CLUB · EST. 2026
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          不靠直覺,
          <br />
          <span className="text-gold">只看演算法。</span>
        </h1>

        <p
          lang="en"
          className="font-mono text-mute text-sm tracking-[0.3em] mt-8"
        >
          WE DON&apos;T GUESS. WE COMPUTE.
        </p>

        <p className="mt-10 max-w-xl mx-auto text-mute leading-relaxed">
          全台第一個為硬核棒球迷打造的暗黑黃金級數據俱樂部。
          <br />
          蒙地卡羅 AI 模擬器 · 不可篡改的勝率紀錄 · 零手續費的會員制社群。
        </p>
      </section>

      {/* ── CREDIBILITY STRIP ──────────────────────── */}
      {/* Trust-layer signals before any conversion-layer CTA.
          Research finding: credibility signals placed BEFORE the
          ask raise conversion 20-30%. ZONE 27 has no customer
          logos to show (stealth) — but we can show real data
          provenance + open methodology + reproducibility. */}
      <section
        aria-label="Data sources and methodology"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-2"
      >
        <div className="border-y border-line/40 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 text-center sm:text-left">
            <CredibilityCell
              label="DATA"
              zh="資料來源"
              body="MLB Stats API · CPBL 公開賽程"
            />
            <CredibilityCell
              label="ENGINE"
              zh="演算法"
              body={
                <>
                  Monte Carlo ×{" "}
                  <span className="text-bone tabular">10,000</span> · 真實打席引擎
                </>
              }
            />
            <CredibilityCell
              label="METHOD"
              zh="方法論"
              body={
                <>
                  完整公開於{" "}
                  <Link
                    href="/methodology"
                    className="text-gold hover:underline"
                  >
                    /methodology
                  </Link>
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* ── HAIRLINE GOLD DIVIDER ──────────────────── */}
      <div className="mx-auto w-32 gold-line mt-16 mb-16" />

      {/* ── THE SIGNATURE PREDICTION CARD (LIVE) ───── */}
      <section className="mx-auto w-full max-w-3xl px-6 sm:px-10 pb-24">
        {featuredMatch ? (
          <HeroLiveCard match={featuredMatch} />
        ) : (
          <EmptyHeroCard />
        )}

        {/* Tiny note under card */}
        <p className="text-center font-mono text-mute text-[10px] tracking-[0.25em] mt-6">
          AI 計算的是機率,不是命運
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
            en="TRANSPARENT BY DESIGN"
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
          加入創始名冊 →
        </Link>
      </section>
      </main>

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
      <p
        lang="en"
        className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3"
      >
        / {no}
      </p>
      <h4 className="text-xl text-bone font-light tracking-tight mb-1">{zh}</h4>
      <p
        lang="en"
        className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mb-4"
      >
        {en}
      </p>
      <p className="text-mute text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function EmptyHeroCard() {
  return (
    <div className="bg-slate/40 border border-line/60 p-10 sm:p-14 text-center">
      <p
        lang="en"
        className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-8"
      >
        ENGINE READY · NO MATCHES LOADED
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
        範例賽事尚未排定
      </h2>
      <p className="mt-6 text-mute text-sm max-w-md mx-auto leading-relaxed">
        資料寫入中(可能是季外或資料遷移)。引擎已就緒,可在自訂模式自由跑模擬。
      </p>
      <Link
        href="/lab/custom"
        className="inline-block mt-8 font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
      >
        進入自訂實驗室 →
      </Link>
    </div>
  );
}

function CredibilityCell({
  label,
  zh,
  body,
}: {
  label: string;
  zh: string;
  body: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-gold text-[9px] tracking-[0.4em] mb-1">
        {label}
      </p>
      <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-2">
        {zh}
      </p>
      <p className="text-mute text-xs sm:text-sm leading-relaxed">{body}</p>
    </div>
  );
}
