import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import StatTerm from "@/components/StatTerm";
import { matches } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Methodology — The ZONE 27 Engine Whitepaper",
  description:
    "完整論文等級的技術白皮書。蒙地卡羅 9 局逐打席引擎、壘上推進物理、10,000 次收斂統計、v0.4 路線圖。",
};

export default function MethodologyPage() {
  // Defensive — fall back gracefully if matches.ts is mid-migration.
  const demoMatch = matches[0];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          TECHNICAL WHITEPAPER · v0.2 · MAY 2026
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          The ZONE 27
          <br />
          <span className="text-gold">Engine</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          我們不寫公關稿,只寫技術筆記。
          這是 ZONE 27 蒙地卡羅引擎完整的內部運作說明。
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── ABSTRACT ─────────────────────────────── */}
      <Section no="00" label="ABSTRACT" zh="摘要">
        <p>
          ZONE 27 採用蒙地卡羅(Monte Carlo)模擬法估算 CPBL 比賽的勝率分布。
          引擎 v0.2 為逐打席對決模型(Real At-Bat),每場虛擬比賽包含
          約 70 個打席,以投手 <StatTerm term="K/9" /> · <StatTerm term="BB/9" />{" "}
          · <StatTerm term="HR/9" /> 三項進階指標推導 8 種互斥結果的條件機率,
          配合壘上跑者推進物理累計分數。10,000 次採樣的收斂結果通常與歷史鎖定 AI
          預測落在 <Mono>±2%</Mono> 內。
        </p>
        <p>
          本白皮書解釋這個引擎的每一個內部決策、簡化假設、與已知限制。
          所有程式碼皆開源:
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline mx-1"
          >
            lib/simulator.ts
          </a>
          。
        </p>
        <p className="text-mute/80">
          <strong className="text-bone">想要兩分鐘的速覽版?</strong> 完整 model
          report 在{" "}
          <Link
            href="/audit"
            className="text-gold underline-offset-4 hover:underline"
          >
            /audit
          </Link>
          {" "} — 5 個 section · 含引擎範圍說明 + DISCLOSURE PHILOSOPHY。
        </p>
      </Section>

      {/* Round 4 audience-reframe: 5 academic-aesthetic sections removed.
          Removed:
          - 01 WHY BASEBALL (discrete events / Markov / agent-based theory)
          - 03 PLATE APPEARANCE MODEL (clamp + Poisson math)
          - 04 BASERUNNER PHYSICS (推進條件機率 table)
          - 05 VALIDATION (CLT + SE derivation)
          - 08 ROADMAP (duplicate of /roadmap page · point to it instead)
          Kept the 4 fan-relevant sections: ABSTRACT · HOW IT WORKS ·
          LIMITATIONS · TRY IT + compressed REFERENCES. Engineers who
          need the math can read lib/simulator.ts on GitHub (linked in
          ABSTRACT). */}

      {/* ── 01 THE ENGINE · 高層次流程 ────────────────── */}
      <Section no="01" label="HOW IT WORKS" zh="引擎在做什麼">
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
          全部在使用者瀏覽器端的 JavaScript runtime 執行,使用{" "}
          <Mono>requestAnimationFrame</Mono> 批次每幀 200 場以維持 UI 流暢。
        </p>
      </Section>

      {/* Round 4 removed: Section 03 PA MODEL (clamp + rate math) ·
          Section 04 BASERUNNER PHYSICS (推進條件機率 table) ·
          shareablequote with SE formula · Section 05 VALIDATION (CLT
          derivation). All engineering math now lives only in
          lib/simulator.ts. Fans who want the explanation get it in
          Section 01 HOW IT WORKS above (high-level) · engineers go to
          GitHub. */}

      {/* Round 7 (agent fact-check validated):
          Section 02 ENGINE BOUNDARIES (6-item limitations list)
          REMOVED entirely. Same content duplicated /audit Section 03
          ENGINE SCOPE — 27 limitation items across 3 site pages was
          "taxonomy-as-decoration · not signal" per agent verdict.
          Cross-link to /audit Section 03 below instead. Round 4-6
          renumbering history kept in comments where relevant. */}

      {/* ── 02 TRY IT · MatchSimulator embed ───────────────── */}
      <Section no="02" label="TRY IT" zh="親手驗證">
        <p>
          以上所有理論,在下方的引擎裡實際執行。
          按 <Mono>RUN 10,000 SIMULATIONS</Mono> 看真實的 Poisson 採樣與壘上推進物理,
          再按 <Mono>REPLAY ONE GAME</Mono> 看一場 9 局逐打席文字直播 ──
          完全在您的瀏覽器端執行,可離線運作,沒有任何 API 呼叫。
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

      {/* Round 4 removed:
          - Section 08 ROADMAP (duplicate of /roadmap page · was 30+ lines)
          - Section 09 REFERENCES verbose (6 academic books + 3 websites)
          Replaced with compact Section 04 below pointing to /roadmap
          for future work and listing only the most-cited reference. */}

      {/* ── 03 WHAT'S NEXT · 路線圖 + 參考 ────────────
          Round 7: renumbered 04 → 03 after Section 02 ENGINE
          BOUNDARIES deleted (consolidated into /audit Section 03). */}
      <Section no="03" label="WHAT'S NEXT" zh="路線圖 + 出處">
        <p>
          未來引擎版本(v0.3 加球場因素 + 打者品質 · v0.4 球場細節 · v0.5 牛棚切換)
          的計畫已公開在
          <Link href="/roadmap" className="text-gold underline-offset-4 hover:underline mx-1">
            /roadmap
          </Link>
          · 含 LOCKED / EXPLORING / BRAND BOUNDARIES 三段。
          每次升級都出現在
          <Link href="/changelog" className="text-gold underline-offset-4 hover:underline mx-1">
            /changelog
          </Link>
          · 變動 commit message 公開可審。
        </p>
        <p className="text-mute/80 text-sm">
          引擎核心出處:Bill James <em>Baseball Abstract</em> (1985) · Pete Palmer
          {" / "}John Thorn <em>The Hidden Game of Baseball</em> · Tango/Lichtman/Dolphin
          <em>The Book</em> (2007)。
          詞彙參考{" "}
          <a
            href="https://library.fangraphs.com/principles/glossary/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            FanGraphs Glossary
          </a>
          。引擎程式碼 100% 公開於
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline mx-1"
          >
            lib/simulator.ts
          </a>
          。
        </p>
      </Section>

      <RelatedReading currentPath="/methodology" />

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
        >
          THE NUMBERS ARE THE STORY.
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
            href="/founders"
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            加入創始名冊 →
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
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40">
      {/* Round 18 motion polish · section-reveal scroll-driven CSS
          animation draws a soft gold hairline under the kicker as the
          section scrolls into view. Native CSS animation-timeline ·
          0 JS · respects prefers-reduced-motion via @media guard in
          globals.css. Aligned with /audit + /coverage + /manifesto
          sections which already use this pattern. */}
      <div className="flex items-baseline gap-4 mb-2 section-reveal">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {label}
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-8">{zh}</h2>
      <div className="space-y-5 text-mute text-base leading-relaxed">
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
