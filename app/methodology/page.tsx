import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import LongReadHandoff from "@/components/LongReadHandoff";
import ArticleMeta from "@/components/ArticleMeta";
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
          TECHNICAL WHITEPAPER · v0.2 · MAY 2026
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          The ZONE 27
          <br />
          <span className="text-gold">Engine</span>
        </h1>
        <div className="zone27-rule mx-auto max-w-[260px] mt-4" aria-hidden="true" />
        <p className="editorial-dropcap mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          我們不寫公關稿,只寫技術筆記。
          這是 ZONE 27引擎完整的內部運作說明。
        </p>
        <div className="mt-8 flex justify-center">
          <ArticleMeta readingMin={6} />
        </div>
      </section>

      {/* Hindenburg-style top-of-doc position disclosure · brand IP「方法公開」。 */}
      <aside
        id="disclosure"
        aria-labelledby="disclosure-heading"
        className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-8"
      >
        <div className="border border-line/60 bg-slate/30 p-5 sm:p-6">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <span
              id="disclosure-heading"
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em]"
            >
              / DISCLOSURE · WHO WROTE THIS
            </span>
            <span
              lang="en"
              className="font-mono text-mute/60 text-[9px] tracking-[0.3em]"
            >
              LAST UPDATED · 2026-05-23
            </span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-mute/85 text-[12px] sm:text-[13px] leading-relaxed">
            <li className="font-mono tabular">
              <span className="text-mute/60">EQUITY</span>{" "}
              <span className="text-bone">100% TIM solo</span>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">SPONSORS</span>{" "}
              <span className="text-bone">0</span>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">ADS</span>{" "}
              <span className="text-bone">0 · AdMob permanently banned</span>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">TRACKERS</span>{" "}
              <span className="text-bone">0 · per /privacy</span>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">ENGINE</span>{" "}
              <span className="text-bone">v0.2 LOCKED</span>{" "}
              <span className="text-mute/70">→ </span>
              <Link
                href="/methodology/diff"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                v0.3 diff
              </Link>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">RECEIPTS</span>{" "}
              <span className="text-bone">N=1 · 1 PROVED · 0 DIVERGED</span>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">GOLD</span>{" "}
              <span className="text-bone">7 SYSTEM-TEST · 0 real</span>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">BLACK</span>{" "}
              <span className="text-bone">0 paid subscribers</span>
            </li>
          </ul>
          <p className="mt-3 text-mute/65 text-[11px] leading-relaxed border-t border-line/40 pt-3">
            完整年度透明報表 · 每年 5/31 publish commitment(同 /audit 的事前承諾原則)·
            違反 = brand 信用 collapse(per{" "}
            <Link
              href="/ethics"
              className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
            >
              /ethics
            </Link>
            )。 此頁 inline footnotes 在文末 §05 FOOTNOTES。
          </p>
        </div>
      </aside>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── ABSTRACT ─────────────────────────────── */}
      <Section no="00" label="ABSTRACT" zh="摘要">
        <p>
          ZONE 27 的引擎
          <FootnoteRef n={1} />
          {" "}估算 CPBL 比賽的勝率分布。
          引擎 v0.2 為逐打席對決模型(Real At-Bat),每場虛擬比賽包含
          約 70 個打席,以投手 <StatTerm term="K/9" /> · <StatTerm term="BB/9" />{" "}
          · <StatTerm term="HR/9" />
          <FootnoteRef n={2} />
          {" "}三項進階指標推導 8 種互斥結果的條件機率,
          配合壘上跑者推進物理累計分數。10,000 次採樣的收斂結果,引擎內部
          會穩定在 <Mono>±2%</Mono> 標準差
          <FootnoteRef n={3} />
          (亂數採樣的天花板)。
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
          可靠門檻(30 場 · 也就是「樣本還太少」
          <FootnoteRef n={4} />
          )。賽後收據持續累積在{" "}
          <Link
            href="/track-record"
            className="text-gold underline-offset-4 hover:underline"
          >
            /track-record
          </Link>
          ,PROVED ✓ 與 DIVERGED ✕ 等大列出 · 不藏 miss。
        </p>
        <p>
          本白皮書解釋這個引擎的每一個內部決策、簡化假設、與已知限制 ——
          每一步推導都寫在下面各節,不藏一行邏輯。
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

      {/* ── 03 WHAT'S NEXT · 路線圖 + 參考 ──────────── */}
      <Section no="03" label="WHAT'S NEXT" zh="路線圖 + 出處">
        <p>
          未來引擎版本(v0.3 加球場因素 + 打者品質 · v0.4 球場細節 · v0.5 牛棚切換)
          的計畫已公開在
          <Link href="/roadmap" className="text-gold underline-offset-4 hover:underline mx-1">
            /roadmap
          </Link>
          · 含 LOCKED / EXPLORING / BRAND BOUNDARIES 三段。
          每次升級都會反映在
          <Link
            href="/track-record"
            className="text-gold underline-offset-4 hover:underline mx-1"
          >
            公開戰績
          </Link>
          · 變動公開可審。
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
          。引擎方法 100% 公開於本頁與
          <Link
            href="/methodology/diff"
            className="text-gold underline-offset-4 hover:underline mx-1"
          >
            /methodology/diff
          </Link>
          。
        </p>
      </Section>

      {/* ── 04 ENGINE LINEUP · 3 變體 · 版本進程(全免費) ── */}
      <Section no="04" label="ENGINE LINEUP" zh="3 個版本 · 全免費">
        <p>
          引擎不是 1 個 black box · 是 <strong className="text-bone">3 個可審
          model variant</strong> · 每個 publish 完整 methodology + publish
          DIVERGED per-engine + publish ESTIMATION DISCLOSURE per-engine。
          訂閱 tier 解鎖 progression · 同 FanGraphs Steamer/ZiPS/ATC +
          Baseball Prospectus PECOTA tier 結構 · brand-pure 不靠 secret moat。
        </p>

        {/* Pokemon TCG SET release narrative · 工程術語升 collectible signal。 */}
        <p className="mt-4 text-mute/85 leading-relaxed">
          <strong className="text-bone">v0.2 是 BASE SET</strong> · 七 lens
          canvas + 投手主導逐打席模型 · ZONE 27 的奠基引擎。{" "}
          <strong className="text-bone">v0.3 是 EXPANSION 1</strong> · 加 Park
          Factor · 把 4 個 CPBL 場館的 dimension delta 寫進 HR sensitivity。{" "}
          <strong className="text-bone">v0.4 是 EXPANSION 2</strong> · Bayesian
          Model Averaging · v0.2 vs v0.3 之間的投票機制。 這不是 silent 替換 ·
          是 set release · 每個 set 永久 viewable per Lens Lifetime Pledge ·
          完整 diff 在{" "}
          <Link href="/methodology/diff" className="text-gold underline-offset-4 hover:underline">
            /methodology/diff
          </Link>
          。
        </p>

        <div className="mt-6 bg-slate/40 border border-line/70 overflow-hidden">
          <table className="w-full font-mono text-[11px] sm:text-xs tabular">
            <thead>
              <tr className="border-b border-line/60 bg-slate/60">
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  ENGINE
                </th>
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  STATUS
                </th>
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  METHOD
                </th>
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  TIER
                </th>
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  TRACK RECORD
                </th>
              </tr>
            </thead>
            <tbody>
              <EngineRow
                engine="v0.2"
                statusLabel="BASE SET · ✓ LIVE"
                statusTone="gold"
                method="逐打席機率模型 · K/9 + BB/9 + HR/9"
                tier="FREE"
                tierTone="bone"
                record="N=1 (cpbl-260521-01)"
              />
              <EngineRow
                engine="v0.3"
                statusLabel="EXPANSION 1 · ✓ LIVE · DEV PREVIEW"
                statusTone="gold"
                method="+ Park Factor HR rate adjustment(v0.3.0)· wOBA 留 v0.3.1"
                tier="FREE"
                tierTone="bone"
                record="每個引擎 N=0 · v0.2 vs v0.3 準度差距等 30 場後才比"
              />
              <EngineRow
                engine="v0.4"
                statusLabel="EXPANSION 2 · PLANNED · Q4 2026"
                statusTone="loss"
                method="Bayesian Model Averaging across v0.2 + v0.3 votes"
                tier="FREE"
                tierTone="bone"
                record="TBD · Q4 launch"
              />
            </tbody>
          </table>
        </div>

        <p className="mt-6">
          <strong className="text-bone">每 engine brand-pure 設計原則(全 ✓):</strong>
        </p>
        <ul className="space-y-2 mt-3 text-mute">
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">publish entire methodology(每版引擎方法全攤在 /methodology · per /audit S05 disclosure-philosophy)</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">publish DIVERGED per-engine in <Link href="/track-record" className="text-gold underline-offset-4 hover:underline">/track-record</Link>(separate bucket · 同等大不藏 miss)</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">publish ESTIMATION DISCLOSURE per-engine in <Link href="/audit" className="text-gold underline-offset-4 hover:underline">/audit S02</Link>(separate row · 同 v0.2 estimate 公開模式)</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">30-day notice 提前公告 for any rule modification(同 /audit S05 PRE-COMMIT pattern)</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">每個 engine 都 0 藏私 · 0「自研理論包裝」 ·「方法公開」原則延伸到每個 engine 變體</span>
          </li>
        </ul>

        <blockquote className="mt-8 border-l-2 border-gold pl-6 py-3">
          <p className="text-bone text-lg sm:text-xl font-light tracking-tight leading-snug">
            Most prediction sites have 1 secret engine.<br />
            <span className="text-gold">We built 2 open ones · 1 in queue.</span>
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            v0.2 base + v0.3 Park Factor · 各自方法全攤在 /methodology
            可 audit · v0.4 Bayesian ensemble 排程中。 訂閱解鎖 progression
            是 commercial · methodology 永遠不靠 secret · 每個 lens 永久
            viewable 不 silently rotate。
          </p>
        </blockquote>

        <div className="mt-8 border border-line/70 bg-slate/40 p-5 sm:p-6">
          <p
            lang="en"
            className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-3"
          >
            DEEPER · ENGINE DIFF
          </p>
          <p className="text-bone text-base sm:text-lg leading-snug mb-3">
            不止 claim「我們有 2 個 engine」。
            <br />
            <Link
              href="/methodology/diff"
              className="text-gold underline-offset-4 hover:underline"
            >
              v0.2 → v0.3 entire delta →
            </Link>
          </p>
          <p className="text-mute/85 text-sm leading-relaxed">
            14 個 constants unchanged · 1 個 new(HR_PARK_SENSITIVITY = 0.5)·
            5 行 logic delta · 6 件 v0.3 不修正 · 4 場館 worked example。
          </p>
        </div>
      </Section>

      {/* ── 05 LENS VARIETY · multi-angle analytical variants ── */}
      <Section no="05" label="LENS VARIETY" zh="多 angle 分析 · variety 軸線">
        <p>
          Section 04 是「accuracy progression」 軸線。 本 Section 是
          「<strong className="text-bone">analytical variety</strong>」 軸線
          · 同 v0.2 base · 不問「誰會贏」 · 問「哪些 factor 影響」 · 純 data
          visualizer · 0 prediction accuracy promise。
        </p>

        <p className="mt-4 text-mute/85 leading-relaxed">
          這不是「越準的工具」· 是「越多角度的工具」· 每 1-2 個月 ship 1 個
          new lens · 讓你能從更多面向看同一場比賽。
        </p>

        <p className="mt-6">
          <strong className="text-bone">7 candidate lenses(roadmap exploration):</strong>
        </p>

        <div className="mt-3 bg-slate/40 border border-line/70 overflow-hidden">
          <table className="w-full font-mono text-[11px] sm:text-xs tabular">
            <thead>
              <tr className="border-b border-line/60 bg-slate/60">
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  LENS
                </th>
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  ANGLE
                </th>
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  STATUS
                </th>
                <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                  TIER
                </th>
              </tr>
            </thead>
            <tbody>
              <LensRow
                lens="Win Probability"
                angle="預測 home/away win % · 同 Section 04 v0.2 engine"
                status="LIVE"
                statusTone="gold"
                tier="FREE"
                tierTone="bone"
              />
              <LensRow
                lens="Vibe Check"
                angle="連勝 / 連敗 streak · 提醒你別被「手感正熱」的錯覺帶著走"
                status="✓ LIVE"
                statusTone="gold"
                tier="FREE"
                tierTone="bone"
              />
              <LensRow
                lens="Park Factor"
                angle="4 場館 home advantage 比較 · 哪場有利投/打"
                status="✓ LIVE"
                statusTone="gold"
                tier="FREE"
                tierTone="bone"
              />
              <LensRow
                lens="Workload Proxy"
                angle="WHIP + BB9 + K9 command stability proxy(v0.1)· v0.2 = rest_days + IP load real fatigue"
                status="✓ LIVE · v0.1"
                statusTone="gold"
                tier="FREE"
                tierTone="bone"
              />
              <LensRow
                lens="Underdog Tracker"
                angle="upset probability + dominance gap · 黑馬機率 lens · 0 contrarian play"
                status="✓ LIVE"
                statusTone="gold"
                tier="FREE"
                tierTone="bone"
              />
              <LensRow
                lens="Bullpen Depth"
                angle="team recent W-L derive late-inning resilience proxy(v0.1)· v0.2 = bullpen ERA + IP usage"
                status="✓ LIVE · v0.1 PROXY"
                statusTone="gold"
                tier="FREE"
                tierTone="bone"
              />
              <LensRow
                lens="Matchup History"
                angle="此 matchup 過去 H2H + 趨勢 · real data · educational at N<10"
                status="✓ LIVE"
                statusTone="gold"
                tier="FREE"
                tierTone="bone"
              />
            </tbody>
          </table>
        </div>

        <p className="mt-6">
          <strong className="text-bone">每 lens brand-pure 設計原則(同 Section 04 standard 延伸):</strong>
        </p>
        <ul className="space-y-2 mt-3 text-mute">
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">純 data viz / analyzer · 不假 prediction accuracy promise · 公開 source code per-lens(simulator-vibecheck.ts · simulator-parkfactor.ts 等)</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">每 lens 「為什麼這個 angle 重要」 educational explainer · 不止 viz · 是棒球數據教學</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">下一個做哪個 lens · 你的建議 Tim 親手讀、親手拍板(/member/submit 直接寄到他信箱)</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">每 1-2 個月 ship 1 個新 lens · 上線就對所有人免費 · 不分免費或付費</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">BLACK / GOLD 不解鎖任何 lens —— 付費是養著它們永遠對所有人免費(身分,不是功能)</span>
          </li>
        </ul>

        <blockquote className="mt-8 border-l-2 border-gold pl-6 py-3">
          <p className="text-bone text-lg sm:text-xl font-light tracking-tight leading-snug">
            Most prediction sites have 1 fake angle.<br />
            <span className="text-gold">We built 7 honest ones.</span>
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            7 LIVE angles · Win Probability + Vibe Check + Park Factor +
            Workload Proxy + Underdog + Bullpen Depth + Matchup History ·
            各自公開方法。 下一個做哪個 lens · Tim 親手讀你寄來的建議、
            親手拍板。
          </p>
        </blockquote>
      </Section>

      {/* ── 06 · ENGINE DRY DOCK · DHH HEY single-state-per-row pattern ── */}
      <Section no="06" label="ENGINE DRY DOCK" zh="引擎此刻在做什麼 · DRY DOCK">
        <p>
          每個 engine variant 的當下狀態 single-row · 不藏「coming soon」 ·
          不放「Q3 roadmap promises」 · 是{" "}
          <strong className="text-bone">factual single-state per row</strong>。
          想看引擎現在在做什麼 · 看{" "}
          <Link href="/methodology/diff" className="text-gold underline-offset-4 hover:underline">
            /methodology/diff
          </Link>{" "}+{" "}
          <Link href="/roadmap" className="text-gold underline-offset-4 hover:underline">
            /roadmap
          </Link>
          。
        </p>

        <ol className="space-y-3 mt-6 list-none p-0">
          {/* ── 01 · CURRENT BUILD ───────────────── */}
          <li className="border border-gold/40 bg-slate/30 px-5 py-4">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
              <p
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.35em]"
              >
                01 · CURRENT BUILD
              </p>
              <span
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.3em] px-2 py-0.5 border border-gold/60 bg-gold/10"
              >
                ✓ LIVE
              </span>
            </div>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              <strong className="text-bone">v0.2 BASE</strong> · 逐打席引擎 · 100% client-side · 您 browser 跑 10K simulations · 詳見{" "}
              <Link
                href="/methodology/diff"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology/diff
              </Link>{" "}
              entire v0.2 spec。
            </p>
          </li>

          {/* ── 02 · EXPANSION 1 · v0.3 · PARK FACTOR ─────── */}
          <li className="border border-gold/30 bg-slate/20 px-5 py-4">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
              <p
                lang="en"
                className="font-mono text-gold/70 text-[10px] tracking-[0.35em]"
              >
                02 · EXPANSION 1 · v0.3 · PARK FACTOR
              </p>
              <span
                lang="en"
                className="font-mono text-mute/80 text-[10px] tracking-[0.3em] px-2 py-0.5 border border-mute/50 bg-slate/40"
              >
                ◌ READY · PROD DEFERRED
              </span>
            </div>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              <strong className="text-bone">PARK FACTOR(HR_PARK_SENSITIVITY = 0.5)</strong>
              {" "}· 4 CPBL 場館已 calibrated(新莊 ×0.9842 / 桃園 ×1.0316 /
              大巨蛋 ×1.0105 / 澄清湖 ×1.0158)· code 已 ship to{" "}
              <Link
                href="/methodology/diff"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology/diff
              </Link>
              {" "}目前是開發預覽 · 等滿 30 場才會正式啟用 · 會先公告、不偷偷切換。
            </p>
          </li>

          {/* ── 03 · EXPANSION 2 · v0.4 · BAYESIAN MIX ────── */}
          <li className="border border-gold/30 bg-slate/20 px-5 py-4">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
              <p
                lang="en"
                className="font-mono text-gold/70 text-[10px] tracking-[0.35em]"
              >
                03 · EXPANSION 2 · v0.4 · BAYESIAN MIX
              </p>
              <span
                lang="en"
                className="font-mono text-mute/80 text-[10px] tracking-[0.3em] px-2 py-0.5 border border-mute/50 bg-slate/40"
              >
                ◌ SPEC LOCKED · IMPLEMENTATION PENDING
              </span>
            </div>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              <strong className="text-bone">BAYESIAN MODEL AVERAGING</strong>{" "}
              · Pitcher × Park Factor × Batter wOBA · spec locked in{" "}
              <Link
                href="/methodology/diff"
                className="text-gold underline-offset-4 hover:underline"
              >
                /methodology/diff
              </Link>{" "}
              v0.4 PRE-COMMIT block · implementation 等 v0.3 production ship
              + N≥30 baseline · timing milestone-triggered 不綁日期。
            </p>
          </li>

          {/* ── 04 · NEXT SHIP CANDIDATE ───────────── */}
          <li className="border border-gold/20 bg-slate/10 px-5 py-4">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
              <p
                lang="en"
                className="font-mono text-mute/70 text-[10px] tracking-[0.35em]"
              >
                04 · NEXT SHIP CANDIDATE
              </p>
              <span
                lang="en"
                className="font-mono text-mute/60 text-[10px] tracking-[0.3em] px-2 py-0.5 border border-mute/30 bg-slate/30"
              >
                ◌ NOT YET COMMITTED
              </span>
            </div>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              下一個要做什麼還沒拍板 · 不是預先承諾的清單。 已經 ship 的東西
              會反映在{" "}
              <Link
                href="/track-record"
                className="text-gold underline-offset-4 hover:underline"
              >
                公開戰績
              </Link>
              · 長期方向看{" "}
              <Link
                href="/roadmap"
                className="text-gold underline-offset-4 hover:underline"
              >
                /roadmap
              </Link>
              。
            </p>
          </li>
        </ol>

      </Section>

      {/* LENS LIFETIME PLEDGE · BINDING brand IP commitment · Patek「service since 1839」 inverse pattern。 */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-t border-line/40">
        <div className="border border-gold/40 bg-slate/40 p-6 sm:p-8 glow-soft">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            LENS LIFETIME PLEDGE · BINDING
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-5 leading-tight">
            每個 ship 過的 lens · 永遠看得到
          </h2>
          <p className="text-mute leading-relaxed text-base mb-4">
            SaaS 標準是 model 衰退時 silently rotate / 偷偷換掉 · 訪客不會
            知道。 ZONE 27 倒置:每個 ship 過的 engine 變體 / 每個 ship 過的
            analytical lens · 永遠在 production 看得到。 我們不{" "}
            <span className="text-loss/80">silently retire</span> ·
            我們{" "}<span className="text-gold">deprecate + version</span>。
          </p>
          <p className="text-mute leading-relaxed text-base mb-4">
            <span className="text-bone">ZONE 27「自 v0.1 起每個 lens 永久看得到」</span>。
            每一版引擎、每一版準度變化 · 都永久查得到 ·
            賽果攤在公開戰績。 賣明牌的站輸了就刪文 · 我們是保留版本 + 永久留下記錄。
          </p>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ 修改此 pledge 需 30 天前公告 · 同 /audit S05
            PRE-COMMIT pattern。
          </p>
        </div>
      </section>

      {/* ── 07 FOOTNOTES · Hindenburg-style inline-cited evidence ── */}
      <Section no="07" label="FOOTNOTES" zh="出處與引用">
        <p className="text-mute/85 text-[14px]">
          每一個 inline 主張(ABSTRACT 內 <FootnoteRef n={1} inline />–
          <FootnoteRef n={4} inline />)在此編號 · 點開可看對應的原始出處 ·
          你不用相信「我們說的」 · 自己對照我們引用的來源即可。
        </p>
        <ol className="space-y-5 text-mute/85 text-[13px] sm:text-[14px] leading-relaxed mt-6">
          <li id="footnote-1" className="border-l-2 border-gold/50 pl-4">
            <p>
              <span className="font-mono text-gold tabular tracking-[0.18em] mr-2">
                [1]
              </span>
              <strong className="text-bone">引擎的原理:把整場球在電腦裡打一萬次</strong> ·
              每個打席依投手指標擲一次機率、累加成完整 9 局、再重複一萬場 ·
              數哪一隊贏比較多次,就是引擎輸出的勝率。 沒有玄學、沒有黑箱 ·
              完整方法寫在本頁各節 · 任何人可逐步複製驗證。
            </p>
            <p className="mt-1 text-mute/65 text-[12px] font-mono">
              ▸{" "}
              <a
                href="https://en.wikipedia.org/wiki/Monte_Carlo_method"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                這個技術的學術原理 · 維基百科
              </a>
              <br />▸{" "}
              <a
                href="https://library.fangraphs.com/principles/run-expectancy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                library.fangraphs.com/principles/run-expectancy
              </a>
            </p>
          </li>
          <li id="footnote-2" className="border-l-2 border-gold/50 pl-4">
            <p>
              <span className="font-mono text-gold tabular tracking-[0.18em] mr-2">
                [2]
              </span>
              <strong className="text-bone">K/9 · BB/9 · HR/9</strong> · 投手
              per-9-inning rate stats · 標準進階數據 · Pete
              Palmer / John Thorn <em>The Hidden Game of Baseball</em>{" "}
              (1984)定義原型 · FanGraphs Glossary 為現代 canonical reference。
            </p>
            <p className="mt-1 text-mute/65 text-[12px] font-mono">
              ▸{" "}
              <a
                href="https://library.fangraphs.com/principles/glossary/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                library.fangraphs.com/principles/glossary
              </a>
              <br />▸{" "}
              <a
                href="https://library.fangraphs.com/pitching/rate-stats/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                library.fangraphs.com/pitching/rate-stats
              </a>
            </p>
          </li>
          <li id="footnote-3" className="border-l-2 border-gold/50 pl-4">
            <p>
              <span className="font-mono text-gold tabular tracking-[0.18em] mr-2">
                [3]
              </span>
              <strong className="text-bone">±2% 標準差(亂數採樣的天花板)</strong>
              {" "}· 10,000 次 Bernoulli trial 標準誤 = √(p(1-p)/n) · 對 p=0.5
              (max variance)時 ~0.005 = ±0.5% · 我們 round 到 ±2% 是為「不
              過度宣稱精度」(實際 internal consistency 嚴於此)· 中心極限
              定理(Central Limit Theorem)為理論基礎。
            </p>
            <p className="mt-1 text-mute/65 text-[12px] font-mono">
              ▸{" "}
              <a
                href="https://en.wikipedia.org/wiki/Central_limit_theorem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                en.wikipedia.org/wiki/Central_limit_theorem
              </a>
            </p>
          </li>
          <li id="footnote-4" className="border-l-2 border-gold/50 pl-4">
            <p>
              <span className="font-mono text-gold tabular tracking-[0.18em] mr-2">
                [4]
              </span>
              <strong className="text-bone">為什麼門檻是 30 場</strong> ·
              棒球數據要累積到一定場次才會「穩定」· 進階數據社群長年研究各項
              數據各自的穩定點 · 30 場是我們選的跨項目保守下限。 場數還沒到
              30 場前 · 我們會主動在戰績頁標明「樣本還太少」。
            </p>
            <p className="mt-1 text-mute/65 text-[12px] font-mono">
              ▸{" "}
              <a
                href="https://blogs.fangraphs.com/it-just-aint-real-baseball-stat-reliability-and-the-six-month-sample/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                blogs.fangraphs.com · Russell Carleton stat reliability
              </a>
              <br />▸{" "}
              <a
                href="https://en.wikipedia.org/wiki/Sample_size_determination"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                en.wikipedia.org/wiki/Sample_size_determination
              </a>
            </p>
          </li>
        </ol>
        <p className="mt-6 text-mute/65 text-[12px] leading-relaxed border-t border-line/40 pt-4">
          ▸ 發現 broken link / 過期 URL / 更好的 primary source · 寫信到{" "}
          <a
            href="mailto:tatayngiti@gmail.com"
            className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
          >
            tatayngiti@gmail.com
          </a>
          {" "}· 我們不藏出處 · 歡迎你指正。
        </p>
      </Section>

      <LongReadHandoff
        readingMin={6}
        nextHref="/methodology/diff"
        nextLabel="v0.2 → v0.3 entire delta · 14 unchanged + 1 new constant"
      />

      <FounderSignOff>
        <p>
          這份白皮書沒有打算讓所有人讀完。寫給的對象是
          <strong>真的想搞懂引擎怎麼算的朋友</strong>。
        </p>
        <p>
          上面寫的每一步都是引擎真正在做的事 · 不是 marketing pseudo-code ·
          您比我更懂的話 · 歡迎寫信告訴我哪裡該修。
        </p>
        <p>
          ABSTRACT 裡的 ±2% 是引擎內部一致性 · 不是 calibration accuracy ·
          這個區別寫死了再改一遍 · 不藏。
        </p>
      </FounderSignOff>

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
            加入 GOLD 會員 →
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

function FootnoteRef({ n, inline = false }: { n: number; inline?: boolean }) {
  if (inline) {
    return (
      <span className="font-mono text-gold/80 tabular tracking-[0.15em] mx-1">
        [{n}]
      </span>
    );
  }
  return (
    <sup className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.1em] ml-0.5">
      <a
        href={`#footnote-${n}`}
        aria-label={`跳至 footnote ${n}`}
        className="underline-offset-2 hover:underline"
      >
        [{n}]
      </a>
    </sup>
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

function EngineRow({
  engine,
  statusLabel,
  statusTone,
  method,
  tier,
  tierTone,
  record,
}: {
  engine: string;
  statusLabel: string;
  statusTone: "gold" | "loss";
  method: string;
  tier: string;
  tierTone: "gold" | "bone";
  record: string;
}) {
  const statusClass = statusTone === "gold" ? "text-gold" : "text-loss/80";
  const tierClass = tierTone === "gold" ? "text-gold" : "text-bone";
  return (
    <tr className="border-b border-line/40">
      <td className="px-3 py-3 text-bone font-mono tabular tracking-tight">
        {engine}
      </td>
      <td className={`px-3 py-3 ${statusClass} font-mono text-[10px] tracking-[0.2em]`}>
        {statusLabel}
      </td>
      <td className="px-3 py-3 text-mute leading-snug">
        {method}
      </td>
      <td className={`px-3 py-3 ${tierClass} font-mono text-[10px] tracking-[0.2em]`}>
        {tier}
      </td>
      <td className="px-3 py-3 text-mute font-mono text-[10px] tracking-[0.2em] tabular">
        {record}
      </td>
    </tr>
  );
}

function LensRow({
  lens,
  angle,
  status,
  statusTone,
  tier,
  tierTone,
}: {
  lens: string;
  angle: string;
  status: string;
  statusTone: "gold" | "loss";
  tier: string;
  tierTone: "gold" | "bone";
}) {
  const statusClass = statusTone === "gold" ? "text-gold" : "text-loss/80";
  const tierClass = tierTone === "gold" ? "text-gold" : "text-bone";
  return (
    <tr className="border-b border-line/40">
      <td className="px-3 py-3 text-bone font-mono tabular tracking-tight">
        {lens}
      </td>
      <td className="px-3 py-3 text-mute leading-snug">
        {angle}
      </td>
      <td className={`px-3 py-3 ${statusClass} font-mono text-[10px] tracking-[0.2em] whitespace-nowrap`}>
        {status}
      </td>
      <td className={`px-3 py-3 ${tierClass} font-mono text-[10px] tracking-[0.2em] whitespace-nowrap`}>
        {tier}
      </td>
    </tr>
  );
}
