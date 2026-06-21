import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import CopyLinkButton from "@/components/CopyLinkButton";
import ReadingProgress from "@/components/ReadingProgress";
import StatTerm from "@/components/StatTerm";
import ReproducibilityReceipt from "@/components/ReproducibilityReceipt";
import { matches } from "@/lib/matches";
import { createPageMetadata } from "@/lib/page-og";

// R159 W1.L1 · Agent L CRITICAL · backfill createPageMetadata · 之前 root
// openGraph slogan leak · per Stripe Press technical whitepaper share pattern。
export const metadata: Metadata = createPageMetadata({
  title: "Methodology · The ZONE 27 Engine Whitepaper",
  description:
    "完整論文等級的技術白皮書 · 4 sections · 引擎9 局逐打席引擎、壘上推進物理、10,000 次收斂統計、v0.4 路線圖。零行銷語言。",
  path: "/methodology",
});

export default function MethodologyPage() {
  // Defensive — fall back gracefully if matches.ts is mid-migration.
  const demoMatch = matches[0];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          引擎怎麼算的
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          The ZONE 27
          <br />
          <span className="text-gold">Engine</span>
        </h1>
        <div className="zone27-rule mx-auto max-w-[260px] mt-4" aria-hidden="true" />
        <p className="editorial-dropcap mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          這是 ZONE 27 引擎完整的內部運作說明。
        </p>
        {/* 白話前門:深技術版嚇到人 → 先給「認識兩顆引擎」的國小生版入口(R241)。 */}
        <p className="mt-5 font-mono text-[10px] tracking-[0.3em]">
          <Link
            href="/engines"
            className="text-gold/75 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            想先看白話版?認識我們的兩顆引擎 →
          </Link>
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── ABSTRACT ─────────────────────────────── */}
      <Section no="00" label="摘要" zh="摘要">
        <p>
          ZONE 27 的引擎估算 CPBL 比賽的勝率分布。
          引擎 v0.2 為逐打席對決模型(Real At-Bat),每場虛擬比賽包含
          約 70 個打席,以投手 <StatTerm term="K/9" /> · <StatTerm term="BB/9" />{" "}
          · <StatTerm term="HR/9" />
          {" "}三項進階指標推導 8 種互斥結果的條件機率,
          配合壘上跑者推進物理累計分數。10,000 次採樣的收斂結果,引擎內部
          會穩定在 <Mono>±2%</Mono> 標準差(亂數採樣的天花板)。
        </p>

        <div className="mt-4">
          <ReproducibilityReceipt
            seed={null}
            dataAt="2026-05-22"
            n={10000}
          />
        </div>
        <p className="text-mute/80">
          <strong className="text-bone">這只是「引擎自己的內部一致性」</strong> —
          引擎跟 CPBL 實際比賽結果對不對得上 · 還在累積場數,目前還沒到
          可靠門檻(30 場 · 也就是「樣本還太少」)。賽後收據持續累積在{" "}
          <Link
            href="/track-record"
            className="text-gold underline-offset-4 hover:underline"
          >
            /track-record
          </Link>
          ,PROVED ✓ 與 DIVERGED ✕ 等大列出 · 不藏 miss。
        </p>
      </Section>

      {/* ── 01 THE ENGINE · 高層次流程 ────────────────── */}
      <Section no="01" label="引擎在做什麼" zh="引擎在做什麼">
        <p>v0.2 引擎的執行流程:</p>
        <Pre>
          {`for inning in 1..9:
  for half in [TOP, BOTTOM]:
    outs = 0
    bases = [empty, empty, empty]
    while outs < 3:
      outcome = sample_pa(pitcher_probs)
      bases, runs, new_outs = apply(outcome, bases)
      outs += new_outs
      score += runs

repeat 10,000 times → aggregate
`}
        </Pre>
        <p>
          每場虛擬比賽包含 18 個半局,平均 ~70 個打席。10,000 場 = ~700,000 次亂數採樣,
          全部在你的瀏覽器裡跑,每一幀批次處理 200 場,讓畫面保持順暢。
        </p>
      </Section>

      {/* ── 02 TRY IT · MatchSimulator embed ───────────────── */}
      <Section no="02" label="親手驗證" zh="親手驗證">
        <p>
          以上所有理論,在下方的引擎裡實際執行。
          按 <Mono>RUN 10,000 SIMULATIONS</Mono> 看引擎真實的隨機抽樣與壘上推進,
          再按 <Mono>REPLAY ONE GAME</Mono> 看一場 9 局逐打席的文字直播 ──
          完全在你的瀏覽器裡跑,沒網路也能用,不連任何伺服器。
        </p>
        {demoMatch ? (
          <div className="mt-8">
            <MatchSimulator key={demoMatch.id} match={demoMatch} />
          </div>
        ) : (
          <p className="mt-8 text-mute italic">
            範例賽事資料目前不可用 —請至{" "}
            <Link
              href="/lab/custom"
              className="text-gold underline-offset-4 hover:underline"
            >
              /lab/custom
            </Link>{" "}
            自訂投手測試。
          </p>
        )}
      </Section>


      {/* ── 07 幾句白話補充 ── */}
      <Section no="07" label="幾句白話" zh="幾句白話補充">
        <ol className="space-y-5 text-mute/85 text-[14px] leading-relaxed">
          <li className="border-l-2 border-gold/50 pl-4">
            <strong className="text-bone">引擎的原理:把整場球在電腦裡打一萬次</strong> ·
            每個打席依投手指標擲一次機率、累加成完整 9 局、再重複一萬場 ·
            數哪一隊贏比較多次,就是引擎輸出的勝率。 沒有玄學、沒有黑箱 ·
            完整方法寫在本頁各節 · 任何人可逐步複製驗證。
          </li>
          <li className="border-l-2 border-gold/50 pl-4">
            <strong className="text-bone">為什麼要跑到一萬次</strong> ·
            次數跑得越多,結果越穩定。 跑滿一萬次後,引擎自己每次算出來的勝率
            只會差大約 ±2% · 這就是亂數採樣本身的天花板。
          </li>
          <li className="border-l-2 border-gold/50 pl-4">
            <strong className="text-bone">為什麼門檻是 30 場</strong> ·
            棒球數據要累積到一定場次才會「穩定」。 30 場是我們選的保守下限 ·
            場數還沒到 30 場前 · 我們會主動在戰績頁標明「樣本還太少」。
          </li>
        </ol>
      </Section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          數字就是故事
        </p>
        <h3 className="text-3xl text-bone font-light tracking-tight">
          現在您已知道每個亂數來自哪裡。
        </h3>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/lab"
            className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            完整實驗室 →
          </Link>
          <Link
            href="/membership"
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            加入 BLACK 會員 →
          </Link>
        </div>

        {/* ── Share this whitepaper · private-DM lever ── */}
        <div className="mt-12 pt-8 border-t border-line/40 flex items-center justify-center">
          <CopyLinkButton />
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────

function slugFromMethodologySectionNo(no: string): string {
  return `section-${no.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function Section({
  no,
  label,
  zh,
  children,
}: {
  no: string;
  label: string;
  zh: string;
  children: React.ReactNode;
}) {
  const id = slugFromMethodologySectionNo(no);
  return (
    <section
      id={id}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40 cv-auto scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-2 section-reveal">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {label}
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-8">{zh}</h2>
      <div className="space-y-5 zh-body text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-gold/90 bg-ink/40 px-1.5 py-0.5 text-[0.9em] border border-line/60">
      {children}
    </code>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-ink/40 border border-line/60 p-4 sm:p-5 overflow-x-auto font-mono text-[12px] sm:text-sm text-bone leading-relaxed my-2">
      <code>{children}</code>
    </pre>
  );
}

