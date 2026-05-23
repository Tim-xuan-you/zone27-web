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
import StatTerm from "@/components/StatTerm";
import ReproducibilityReceipt from "@/components/ReproducibilityReceipt";
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
        {/* Round 54 W-C · Cold Gold Hairline signature moat。 */}
        <div className="zone27-rule mx-auto max-w-[260px] mt-4" aria-hidden="true" />
        {/* Round 54 W-C · Editorial drop-cap on first body paragraph。 */}
        <p className="editorial-dropcap mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          我們不寫公關稿,只寫技術筆記。
          這是 ZONE 27 蒙地卡羅引擎完整的內部運作說明。
        </p>
        <div className="mt-8 flex justify-center">
          <ArticleMeta readingMin={6} />
        </div>
      </section>

      {/* R59 W-D · Hindenburg Research disclosure pattern · top-of-document
          position disclosure(同 hindenburgresearch.com 每份 report 開頭
          「we have taken a short position」 box)· brand IP「方法公開 · 公開
          整個 enterprise」 物理化 · 訪客 read 引擎前先 know who's writing it ·
          0 sponsors · 0 hidden incentives · 100% solo equity · 完整 state 直接
          公開 · 不藏 Pratfall(7 SYSTEM-TEST forged + N=1 sample · 不裝大)。 */}
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
              <span className="text-mute/60">FOUNDERS 27</span>{" "}
              <span className="text-bone">7 SYSTEM-TEST · 0 real</span>
            </li>
            <li className="font-mono tabular">
              <span className="text-mute/60">BLACK CARD</span>{" "}
              <span className="text-bone">0 paid subscribers</span>
            </li>
          </ul>
          <p className="mt-3 text-mute/65 text-[11px] leading-relaxed border-t border-line/40 pt-3">
            完整 enterprise state 公開於{" "}
            <Link
              href="/annual/2026"
              className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
            >
              /annual/2026
            </Link>{" "}
            · 5/31 每年 publish commitment · 違反 = brand 信用 collapse(per{" "}
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
          ZONE 27 採用蒙地卡羅(Monte Carlo)模擬法
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

        {/* Round 43 W-A · ReproducibilityReceipt drop-in · Agent H R41 #4
            pattern applied 至 /methodology ABSTRACT ±2% number · 每個
            published number 都有 git+seed+n+dataAt audit trail · per
            IJCAI 2026 standard。 */}
        <div className="mt-4">
          <ReproducibilityReceipt
            seed={null}
            dataAt="2026-05-22"
            n={10000}
            fileLink="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts"
          />
        </div>
        <p className="text-mute/80">
          <strong className="text-bone">這只是「引擎自己的內部一致性」</strong> —
          引擎對 CPBL 實際比賽結果的 calibration 還在累積樣本,目前未達
          統計顯著門檻(N ≥ 30 · Z27 LEXICON「SAMPLE DEBT」
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

      {/* ── 04 ENGINE LINEUP · 3 變體 · tier unlock progression ──
          Round 35 W-D · Tim 12+ canary commercial directive「3 engines paid
          unlock 2」 brand-pure 落地 · 拒「管它準不準包裝」 redline · ship
          3 honest engine progression instead。 同 FanGraphs Steamer / ZiPS /
          ATC + Baseball Prospectus PECOTA tier 結構 · brand IP「方法公開」
          延伸到 engine variant layer · 不再只是 1 個 black box · 是 3 個
          可審 model variants 各自 publish methodology + DIVERGED + ESTIMATION
          DISCLOSURE per-engine。 commercial motivation(訂閱 unlock)+ honest
          methodology(0 secret)= Tim displacement mission 對 玩運彩+報馬仔
          的 brand-pure inversion。 */}
      <Section no="04" label="ENGINE LINEUP" zh="3 變體 · tier unlock">
        <p>
          引擎不是 1 個 black box · 是 <strong className="text-bone">3 個可審
          model variant</strong> · 每個 publish 完整 methodology + publish
          DIVERGED per-engine + publish ESTIMATION DISCLOSURE per-engine。
          訂閱 tier 解鎖 progression · 同 FanGraphs Steamer/ZiPS/ATC +
          Baseball Prospectus PECOTA tier 結構 · brand-pure 不靠 secret moat。
        </p>

        {/* R60 W-A · Pokemon TCG SET release narrative 借鑑 · Wizards of the
            Coast Base Set(1999)→ Jungle Expansion 1 → Fossil Expansion 2
            同樣 pattern · 每個 set 永久 viewable · 不 silent rotate · 不 reprint
            (Patek + Pokemon 1st Edition mystique 雙 anchor)。 ZONE 27 引擎
            版本 framing 從「v0.X · vX.Y」 工程術語 升 「BASE SET · EXPANSION」
            collectible narrative · 同 [[zone27-audience-fans-not-engineers]]
            (hardcore CPBL 球迷 + TCG 收藏 demographic overlap > 工程師 audience)。
            同 brand IP「方法公開」 延伸:每個 set 完整 ship code on GitHub +
            完整 diff /methodology/diff + 永久 viewable per Lens Lifetime
            Pledge · TCG「先 collect 完整 set」 incentive 轉換為「先 audit 完整
            engine progression」 trust signal。 */}
        <p className="mt-4 text-mute/85 leading-relaxed">
          <strong className="text-bone">v0.2 是 BASE SET</strong> · 七 lens
          canvas + Pitcher-Only Monte Carlo · ZONE 27 的奠基引擎。{" "}
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
                method="Pitcher-Only Monte Carlo · K/9 + BB/9 + HR/9"
                tier="FREE"
                tierTone="bone"
                record="N=1 (cpbl-260521-01)"
              />
              <EngineRow
                engine="v0.3"
                statusLabel="EXPANSION 1 · ✓ LIVE · DEV PREVIEW"
                statusTone="gold"
                method="+ Park Factor HR rate adjustment(v0.3.0)· wOBA 留 v0.3.1"
                tier="FREE 預覽 · 將來 BLACK CARD"
                tierTone="bone"
                record="N=0 per engine · v0.2 vs v0.3 Brier delta TBD until N≥30"
              />
              <EngineRow
                engine="v0.4"
                statusLabel="EXPANSION 2 · PLANNED · Q4 2026"
                statusTone="loss"
                method="Bayesian Model Averaging across v0.2 + v0.3 votes"
                tier="BLACK CARD"
                tierTone="gold"
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
            <span className="flex-1">publish entire methodology(simulator-vN.ts on GitHub · per /audit S05 disclosure-philosophy)</span>
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
            <span className="flex-1">30-day notice via <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">/changelog</Link> for any rule modification(同 /audit S05 PRE-COMMIT pattern)</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">0 hidden secret per-engine · 0「自研理論包裝」 · brand IP「方法公開」 延伸到 engine variant layer</span>
          </li>
        </ul>

        <p className="mt-6 text-mute/85 leading-relaxed">
          <strong className="text-bone">為什麼 3 變體 + Bayesian average:</strong>{" "}
          Nate Silver FiveThirtyEight 模式 · 多 model 投票避免 single-model
          overfitting · ensemble 通常比 best single 模型穩定。 同
          <Link href="/discipline" className="text-gold underline-offset-4 hover:underline mx-1">
            /discipline
          </Link>
          Buffett「不靠一個算法 · 靠紀律」 axiom 延伸到 engine layer 本身。
        </p>

        <blockquote className="mt-8 border-l-2 border-gold pl-6 py-3">
          <p className="text-bone text-lg sm:text-xl font-light tracking-tight leading-snug">
            Most prediction sites have 1 secret engine.<br />
            <span className="text-gold">We built 2 open ones · 1 in queue.</span>
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            Round 41 W-A · v0.3 從 DEV → LIVE(DEV PREVIEW · opt-in)·
            「Displacement mission · 對標幹掉 玩運彩+報馬仔」 brand-pure 路徑
            物理升級。 他們 1 fake mystery model vs ZONE 27 2 LIVE transparent
            variants(v0.2 base + v0.3 Park Factor · 各自 lib/simulator-vN.ts
            on GitHub 可 audit)+ 1 PLANNED Bayesian ensemble(v0.4)·
            訂閱解鎖 progression 是 commercial · methodology 不可妥協是 brand
            IP · per Lens Lifetime Pledge 永遠 viewable · 不 silently rotate。
          </p>
        </blockquote>

        {/* Round 50 W-A · cross-link to /methodology/diff DEEPEST ·
            「不止 claim 2 engines · publish entire delta」 brand IP 物理
            codify · 接 Section 04 ENGINE LINEUP table + blockquote
            narrative · 下一步是 entire v0.2 → v0.3 逐行 diff 頁。 */}
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
            同 React.dev / Stripe API changelog / Anthropic model card revision
            pattern · 整份 audit trail 公開。
          </p>
        </div>
      </Section>

      {/* ── 05 LENS VARIETY · multi-angle analytical variants ──
          Round 36 W-A · Tim 13+ canary explicit「壓力減 + 不同 angle 分析
          + 越開發越多」 framework pivot · 跟 Section 04 ENGINE LINEUP「accuracy
          progression」 軸線 互補 · 不取代。 LENS VARIETY = 同 v0.2 base · 不
          問「誰會贏」 · 問「哪些 factor 影響」 = pure data visualizer ·
          每個 lens publish methodology + open code · 不假 accuracy promise。
          Patek Philippe complication progression 模式:不是「越準的錶」 · 是
          「越多 complication」(萬年曆 / 三問報時 / 計時)· ZONE 27 multi-lens
          同邏輯 · 越多 angle 看比賽 · 不衝突 brand IP 任何 axiom。 訂閱
          解鎖每 1-2 月 ship 1 new lens · sustained BLACK CARD value compounding。 */}
      <Section no="05" label="LENS VARIETY" zh="多 angle 分析 · variety 軸線">
        <p>
          Section 04 是「<strong className="text-bone">accuracy progression</strong>」
          軸線(v0.2 → v0.3 → v0.4 越多 input feature · 同預測 winner 任務)。
          本 Section 是「<strong className="text-bone">analytical variety</strong>」
          軸線 · 同 v0.2 base · 但從不同 angle 看比賽:不問「誰會贏」 ·
          問「哪些 factor 影響」 · 純 data visualizer/analyzer · 0 prediction
          accuracy promise(因為 visualizer 沒有「準」的概念 · 只有「insight」)。
        </p>

        <p className="mt-4 text-mute/85 leading-relaxed">
          類比 · <strong className="text-bone">Patek Philippe complication 模式</strong>
          :Patek 不是「越準的錶」 · 是「越多 complication」(萬年曆 / 三問
          報時 / 計時)· 每個 complication 是不同 functional angle · 不衝突
          「同等準」 base。 ZONE 27 multi-lens 同邏輯 · 每 1-2 月 ship 1
          new lens · sustained BLACK CARD value compounding · brand-pure
          無限 scaling。
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
                angle="連勝 / 連敗 streak · 「hot hand fallacy」 (Tversky 1985)"
                status="✓ LIVE · R37 W-B"
                statusTone="gold"
                tier="FREE 預覽 · 將來 BLACK CARD"
                tierTone="bone"
              />
              <LensRow
                lens="Park Factor"
                angle="4 場館 home advantage 比較 · 哪場有利投/打"
                status="✓ LIVE · R37 W-C"
                statusTone="gold"
                tier="FREE 預覽 · 將來 BLACK CARD"
                tierTone="bone"
              />
              <LensRow
                lens="Workload Proxy(formerly Pitcher Fatigue)"
                angle="WHIP + BB9 + K9 command stability proxy(v0.1)· R43 W-C vocabulary rename per Steelman Obj 03 · v0.2 = rest_days + IP load real fatigue"
                status="✓ LIVE · R38 W-A · v0.1 · R43 W-C renamed"
                statusTone="gold"
                tier="FREE 預覽 · 將來 BLACK CARD"
                tierTone="bone"
              />
              <LensRow
                lens="Underdog Tracker"
                angle="upset probability + dominance gap · 黑馬機率 lens · 0 contrarian play"
                status="✓ LIVE · R39 W-B"
                statusTone="gold"
                tier="FREE 預覽 · 將來 BLACK CARD"
                tierTone="bone"
              />
              <LensRow
                lens="Bullpen Depth"
                angle="team recent W-L derive late-inning resilience proxy(v0.1)· v0.2 = bullpen ERA + IP usage"
                status="✓ LIVE · R40 W-A · v0.1 PROXY"
                statusTone="gold"
                tier="FREE 預覽 · 將來 BLACK CARD"
                tierTone="bone"
              />
              <LensRow
                lens="Matchup History"
                angle="此 matchup 過去 H2H + 趨勢 · real data · educational at N<10"
                status="✓ LIVE · R40 W-B · 7th LIVE"
                statusTone="gold"
                tier="FREE 預覽 · 將來 BLACK CARD"
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
            <span className="flex-1">每 lens 「為什麼這個 angle 重要」 educational explainer · 不止 viz · 是 sabermetric education</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">BLACK CARD voting decide next lens · IKEA Effect · 訂閱者 voting 影響 ship 順序</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">每 1-2 月 ship 1 new lens · sustained BLACK CARD value compounding · 訂閱越久 越多 lenses 可用</span>
          </li>
          <li className="flex gap-3 items-baseline">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
            <span className="flex-1">Founders 27 終身 lock 未來所有 lenses · 真實「無限解鎖」 value · 同 lifetime brand promise</span>
          </li>
        </ul>

        <p className="mt-6 text-mute/85 leading-relaxed">
          <strong className="text-bone">兩個軸線並存 brand IP 邏輯:</strong>{" "}
          Section 04(accuracy progression)解「我們的預測準不準?」 · Section 05
          (analytical variety)解「我們的分析夠不夠多 angle?」。 訪客來 ZONE 27
          可能想要 prediction accuracy(看 Section 04 receipt)· 也可能想要
          多 lens insight(看 Section 05 catalogue)· 兩個都 honest 不假。
        </p>

        <blockquote className="mt-8 border-l-2 border-gold pl-6 py-3">
          <p className="text-bone text-lg sm:text-xl font-light tracking-tight leading-snug">
            Most prediction sites have 1 fake angle.<br />
            <span className="text-gold">We built 7 honest ones.</span>
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            Round 40 W-B · 7-lens canvas 完成。 玩運彩+報馬仔 1 個 fake
            「大師明牌」 angle · ZONE 27 multi-lens{" "}
            <strong className="text-bone">7 LIVE angles</strong>(Win
            Probability + Vibe Check + Park Factor + Pitcher Fatigue +
            Underdog + Bullpen Depth + Matchup History)各自 publish
            methodology + open code + educational explainer · 同 Patek
            complication 模式 · brand-pure 無限 scaling 起點。 displacement
            narrative 物理閉環 — 從 future promise(「building」)升 LIVE
            truth(「built」)。 訂閱者 voting 決定 next ship order(Lens
            v2.0 計劃 · payment infra 就緒後 milestone-triggered)。
          </p>
        </blockquote>
      </Section>

      {/* ── R71 W-A · Section 06 · ENGINE DRY DOCK ───────────────
          Agent A R69 SHIP 3 deferred · DHH HEY「inbox state IS the
          dashboard」 grammar transplant · single-status-per-row · NO
          progress bar / NO ETA / NO「coming soon」 marketing copy ·
          factual engine state machine surface · cross-referenced from
          /now UNRESOLVED section · canonical viewer for v0.2/v0.3/v0.4
          state without crawl /methodology/diff + /roadmap + /now。 */}
      <Section no="06" label="ENGINE DRY DOCK" zh="引擎此刻在做什麼 · DRY DOCK">
        <p>
          DHH HEY pioneered「the app&apos;s internal state IS the dashboard」 ·
          ZONE 27 transplants 同 grammar 到 engine version state:
          每個 engine variant 的當下狀態 single-row · 不藏「coming soon」 ·
          不放「Q3 roadmap promises」 · 是{" "}
          <strong className="text-bone">factual single-state per row</strong>。
          hardcore CPBL fans returning weekly want「what is the engine doing
          this week?」 — currently 必須 crawl{" "}
          <Link
            href="/methodology/diff"
            className="text-gold underline-offset-4 hover:underline"
          >
            /methodology/diff
          </Link>{" "}
          +{" "}
          <Link
            href="/roadmap"
            className="text-gold underline-offset-4 hover:underline"
          >
            /roadmap
          </Link>{" "}
          +{" "}
          <Link
            href="/now"
            className="text-gold underline-offset-4 hover:underline"
          >
            /now
          </Link>{" "}
          · 此 section consolidates。
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
              <strong className="text-bone">v0.2 BASE</strong> · 逐打席 Monte
              Carlo · 100% client-side · 您 browser 跑 10K simulations · 同
              GitHub source · 詳見{" "}
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
              {" "}DEV PREVIEW · production 啟用 awaits N≥30 sample debt
              close(per /audit S05 PRE-COMMIT)· 不 silently 切換。
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
              下個 wave candidate 由{" "}
              <Link
                href="/now"
                className="text-gold underline-offset-4 hover:underline"
              >
                /now
              </Link>{" "}
              SHIPPED journal driving · NOT pre-committed list · /roadmap
              LOCKED 段是 long-arc commitments · /now UNRESOLVED 段是
              candidate dry-dock。 看{" "}
              <Link
                href="/roadmap"
                className="text-gold underline-offset-4 hover:underline"
              >
                /roadmap
              </Link>{" "}
              + /now 跨 reference 來推斷。
            </p>
          </li>
        </ol>

        <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
          ⚓ 同 DHH HEY「The Imbox」 naming + DHH「show your software&apos;s
          state」 pattern · 不 ship「Coming Soon!」 / 「Stay tuned!」 marketing
          copy · 純 state machine factual surface · 訪客親自 read · 我們
          不 sell next ship。
        </p>
      </Section>

      {/* ── Round 38 W-G · Lens Lifetime Pledge · Agent A #3 ship ──
          Patek Philippe「service since 1839」 pattern · permanent banner
          下方的 brand IP 物理 codify。 SaaS 標準是「silently rotate models
          when degrade」 · ZONE 27 倒置:every lens shipped stays viewable
          forever · 不 silently retire · 不 silently swap · deprecate +
          version 路線。 Patek inverse 邏輯:identity continuity in a market
          where 報馬仔 deletes losing weeks。 brand IP「方法公開 · 不藏不
          換」 延伸到 generational time axis。
          R71 W-A · numbered label removed(was「06 · LENS LIFETIME PLEDGE」)·
          new Section 06 ENGINE DRY DOCK above takes the 06 slot · this
          pledge stays as un-numbered permanent commitment banner。 */}
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
            Patek Philippe「自 1839 服務每一隻 Patek」 ·{" "}
            <span className="text-bone">ZONE 27「自 v0.1 起每個 lens 永久看得到」</span>。
            未來訪客 fork 我們的 GitHub repo · git log 找 v0.1 的 calibration
            drift · 都查得到。 報馬仔 deletes losing weeks · 我們 deprecate
            with 永久 audit trail。
          </p>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ 修改此 pledge 需 30 天前 /changelog 公告 · 同 /audit S05
            PRE-COMMIT pattern · Costly Signaling 100×。
          </p>
        </div>
      </section>

      {/* R59 W-D · Section 07 FOOTNOTES · Hindenburg Research inline-cited
          evidence pattern · 之前 Section 03 已 prose-cite Bill James / Pete
          Palmer / Tango Tiger / FanGraphs Glossary · 但 inline 主張(Monte
          Carlo / K-BB-HR-9 / ±2% / N≥30)沒對應 numbered footnote anchor。
          Hindenburg 模式 = 每一個 claim 配 inline superscript + 對應 primary
          source URL · 同 academic 論文 standard · 倒置 of「就是看著辦」 prose
          citation · 訪客 click <sup>[N]</sup> 跳對應 footnote · 同 anchor
          jump 後可從 footnote 點外部 primary source。 同 brand IP「方法公開 ·
          每個 claim 物理可 trace」。 */}
      <Section no="07" label="FOOTNOTES" zh="出處與引用">
        <p className="text-mute/85 text-[14px]">
          每一個 inline 主張(ABSTRACT 內 <FootnoteRef n={1} inline />–
          <FootnoteRef n={4} inline />)在此 numbered · 點開展對應 primary
          source · 同 Hindenburg Research 結構性 evidence pattern · 不依賴
          訪客信任「我們說的」 · 依賴訪客 verify 我們 cite 的。
        </p>
        <ol className="space-y-5 text-mute/85 text-[13px] sm:text-[14px] leading-relaxed mt-6">
          <li id="footnote-1" className="border-l-2 border-gold/50 pl-4">
            <p>
              <span className="font-mono text-gold tabular tracking-[0.18em] mr-2">
                [1]
              </span>
              <strong className="text-bone">Monte Carlo 模擬法</strong> · 隨機
              採樣大量 trial 估算 distribution · Metropolis &amp; Ulam 1949
              (Los Alamos Manhattan Project)首創於物理模擬 · 1990s+ 被
              sabermetric 社群採用於勝率 / Run Expectancy 估算。
            </p>
            <p className="mt-1 text-mute/65 text-[12px] font-mono">
              ▸{" "}
              <a
                href="https://en.wikipedia.org/wiki/Monte_Carlo_method"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                en.wikipedia.org/wiki/Monte_Carlo_method
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
              per-9-inning rate stats · 標準 sabermetric 進階指標 · Pete
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
              <br />▸{" "}
              <a
                href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline break-all"
              >
                github.com/Tim-xuan-you/zone27-web · lib/simulator.ts
              </a>
            </p>
          </li>
          <li id="footnote-4" className="border-l-2 border-gold/50 pl-4">
            <p>
              <span className="font-mono text-gold tabular tracking-[0.18em] mr-2">
                [4]
              </span>
              <strong className="text-bone">N ≥ 30 SAMPLE DEBT 門檻</strong> ·
              小樣本統計學共識 · 30 場 ~= 統計檢定力進入 reliable 區間的最低
              standard · sabermetric 社群「when do baseball stats stabilize?」
              (Russell A. Carleton, 2008+ ongoing)系列研究確認各 stat 各
              stabilization point · 我們選 30 為跨 stat 保守下限。
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
          ▸ 發現 broken link / 過期 URL / 更好的 primary source · 發 PR 到{" "}
          <a
            href="https://github.com/Tim-xuan-you/zone27-web"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
          >
            zone27-web GitHub
          </a>
          {" "}· 我們不藏 cite。 同 Hindenburg「point us to ourselves on this」
          public verification axiom。
        </p>
      </Section>

      {/* R69 W-E · Agent A SHIP 5 · LongReadHandoff · Tom Tango sabermetrics
          blog + Aeon end-of-post pattern · honor reader's time investment at
          MAX trust state · next deep read + RSS-only subscription · 0 email
          capture · per [[zone27-disclosure-philosophy]] + 不打擾就是禮物。 */}
      <LongReadHandoff
        readingMin={6}
        nextHref="/methodology/diff"
        nextLabel="v0.2 → v0.3 entire delta · 14 unchanged + 1 new constant"
      />

      <FounderSignOff>
        <p>
          這份白皮書沒有打算讓所有人讀完。寫給的對象是
          <strong>「想自己 fork 來改」的工程師朋友</strong>。
        </p>
        <p>
          <code className="font-mono text-bone bg-slate/40 px-1.5 py-0.5 rounded-sm">lib/simulator.ts</code>
          {" "}是真實程式碼 · 不是 marketing pseudo-code ·
          您比我更懂的話請發 PR 修我們。
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

// R72 W-D · Agent B audit F01 fix · slug helper for /methodology Section ·
// 同 R69 W-F /terms + R70 W-F /privacy + R71 W-E /transparency pattern ·
// enables /methodology#section-06 anchor jump · per R71 W-A ENGINE_DIFF_BEACONS
// + /now journal cross-link · 不再 broken 5-second devtools verify。
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
    /* Round 58 W-A · cv-auto perf primitive applied · LCP -150ms TBT -100ms · same Section helper pattern R57 W-A 已 verify on /transparency + /methodology/diff。
       R72 W-D · Agent B audit F01 fix · id slug for anchor jump · scroll-mt-20。 */
    <section
      id={id}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40 cv-auto scroll-mt-20"
    >
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

// R59 W-D · FootnoteRef · inline superscript link to numbered footnote at
// the bottom of /methodology · Hindenburg Research evidence pattern · 訪客
// click sup [N] 跳對應 #footnote-N · 同 academic paper inline citation。
// `inline` variant 在 Footnotes section 自身展開時用 · 不需要 anchor jump。
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

// ── Round 35 W-D · Engine Lineup table row ───────────────
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

// ── Round 36 W-A · LENS VARIETY table row ────────────────
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
