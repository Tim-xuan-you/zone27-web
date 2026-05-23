import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import UnscheduledLetterChip from "@/components/UnscheduledLetterChip";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "Changelog — 完整變動歷史 · git 是唯一事實來源",
  description:
    "ZONE 27 不再手工維護 changelog narrative · 所有變動公開在 GitHub commits · git log 是唯一事實來源 · 本頁列出近期里程碑當 reference · 點按鈕可直達完整歷史。",
  ogTitle: "Changelog · git 是唯一事實來源 · ZONE 27",
  ogDescription:
    "76+ rounds 物理證據 · 所有變動公開 · git log 唯一事實 · 不手工維護 narrative",
  path: "/changelog",
});

// ── ZONE 27 · /changelog — Reduced (Algorithm Step 3 · Simplify) ──
// Was 483 lines of hand-maintained release narrative. Now ~70 lines
// of minimal milestones + a direct link to the authoritative source:
// the GitHub commits page. Maintained by `git log` (zero human effort,
// always accurate). The /audit + /faq + /privacy + /terms + /methodology
// + /founders pages all reference /changelog — that promise stays valid
// because this page exists and points to truth.
// ─────────────────────────────────────────────────────

const GH_COMMITS_URL =
  "https://github.com/Tim-xuan-you/zone27-web/commits/main";

const MILESTONES: { date: string; title: string; detail: string }[] = [
  // R68 W-D Audit F3 fix · R52-R67 backfilled per /audit S06 PRE-COMMIT
  // 30-day disclosure clause(此頁 cross-referenced from /audit · /faq ·
  // /privacy · /terms · /methodology · /founders · 必須 sync per 「方法
  // 公開」 axiom · stale-at-R51 was self-falsifiable vs commit history)。
  {
    date: "2026-05-23 · Round 59-67 (5-day sprint · 28+ waves)",
    title: "8 full-authority invocations + R67 code-focused deferred · /founders/apply MVP + 4 R66 deferred ships · 0 brand redline",
    detail:
      "Tim 8 full-authority mandate fires across R59-R66 + 1 留空 default-ship NOW R67 · 28+ waves consolidated。 R59-R64 · 6 full-authority invocations spawn 3-agent parallel pattern(visual / codebase / strategic + niche subscription / pricing-page-craft / Asian sports / Bloomberg power-user / Pokemon TCG lens / behavioral psychology)· Hindenburg DISCLOSURE block on /methodology + /audit + /transparency · ReceiptForwardButton(R62 W-B Stratechery + Defector + Athletic forwarding pattern · 0 tracking)· GlobalShortcuts g-mode 13 jump shortcuts(Linear/GitHub grammar)· FirstReceiptHero pinned mode + adaptive kicker(Pokemon TCG 1st Edition mechanical extension)· CredentialStack 3-block(Cameron Grove + Travis Sawchik indie analyst portfolio)· Taiwan-native payment trust 4-point block + Pratfall「what your NT$ 2,700 didn't buy」 6-item · /terms Section 4B REFUND POLICY per Taiwan 消保法 § 19 + /privacy Section 6B PDPA · NEW /pricing/why MVP(5 brand-pure patterns + 5 anti-patterns avoided)· 41 visitor-discoverable routes(40→41)。 R65 · 7th invocation QA regression audit on R59-R64 28-wave drift(13 findings · 4 critical + 9 medium)+ broken citation chain close(/faq refund + corporate entries · ConfidenceStars S08→S05 · 9 Q3 sweep gaps R62 W-A missed)。 R66 · 8th invocation behavioral psychology + Next.js 16 code modernization · error.tsx `reset` → `unstable_retry` API migration + NEW global-error.tsx 220 lines root-layout boundary + 3 NEW files psychology synthesize(lib/motion.ts animation constants single-source · lib/consent.ts DEFAULT_CONSENT 5-key pre-commit guardrail Default Bias Thaler 2003 · components/CalibrationProgressBar.tsx Goal Gradient Kivetz 2006)。 R67 · code-focused R66 deferred queue ship · 4 ships from R66 psychology agent + closure · NEW components/LensFocusVote.tsx(Cialdini commitment-consistency 6-lens pre-canvas pre-commit widget · 9th localStorage key zone27_lens_focus_votes_v1 · /audit S06 9th key disclosed)· `.enter-verdict-reveal` CSS(Peak-End rule Kahneman 2002 · 800ms hold + 480ms cubic-bezier expo · uses R66 MOTION single-source)· NEW lib/last-shipped.ts + NEW components/CadencePulseChip.tsx(Zajonc 1968 Mere Exposure REFRAMED per /now「無 weekly schedule promise」 brand IP collision · 「LAST SHIPPED + 不承諾節奏」 honest chip)· NEW lib/waitlist-types.ts(types split from「use server」 + WAITLIST_ERROR_CODES const-array template-literal-derived type + getWaitlistErrorMessage exhaustive switch helper · Tetlock track-able-error discipline)。",
  },
  {
    date: "2026-05-22 · Round 52-58(execution-mode + brand IP rolling polish · 12+ waves)",
    title: "R52 high-ticket conversion · R53 epistemic badges · R54 Cold Gold Hairline · R55 Tim workflow + formatNT · R56 adversarial · R57+R58 cv-auto perf",
    detail:
      "R52 · 5 waves · /founders inline FAQ 3→10 Qs + 8 字 grammar amplified to /about + buy-line conversion polish。 R53 · 1 wave · lib/calibration-tiers.ts + components/CalibrationTierBadge.tsx · 7-tier ladder per Tetlock Superforecaster pattern · NOT hit-rate ranking。 R54 · 3 waves · security + editorial drop-cap + Cold Gold Hairline signature visual moat across 5 hero pages · CSS globals。 R55 · 3 waves · scripts/validate-match-data.mjs pre-commit data integrity guard · lib/format.ts formatNT() canonical NT$ helper · /membership tier anchor flip Founders 27 highlight + tier stacking。 R56 · 2 waves · 4 critical adversarial attack vectors closed · NavLoginCTA CLS fix · /founders 9× ratio frame + /about manifesto solo-voice · 10-Q inline FAQ。 R57 · 1 wave · execution mode · no new agents · MIT license disclosure on /ethics S02B · cv-auto utility classes。 R58 · 1 wave · cv-auto on /methodology + /audit + /privacy · 19 sections content-visibility:auto perf primitive。",
  },
  {
    date: "2026-05-22 · Round 50 + 51(world-class sprint)",
    title: "11 W consolidated · UX IA overhaul + brand IP strengthening + bugs/a11y/perf · 26+ canary fire 全處理",
    detail:
      "Tim 26+ canary fire 連續 surface 真實 UX root cause + 「全權交給您 · 極致完美」 mandate · 連發 11 waves:Round 50 W-A → W-F(/methodology/diff entire v0.2 → v0.3 delta · 4 LOGIN entries Apple/Stripe nav IA · Homepage funnel invert Hick's deeper · Nav 三軸線 visual hierarchy「TONIGHT N」 dynamic chip · Footer F-pattern reorder PRODUCT first · /login password-only)+ Round 51 W-A → W-E(3 critical bugs login resend/error msg/submit safety · 7 funnel + cross-link fixes lab dead-end/audit S04 cross-link/track-record→calibration/lab Tim signatures · 5 brand strengthening + WCAG AA contrast/ethics+steelman conversion CTAs/about mailto · /transparency aggregator route Anthropic pattern · Atom RSS /feed.xml + ReproducibilityReceipt /audit S04)。 行銷設計專家 sharp insights:Round 22「conversion = gold pill」 visual primitive 延伸到 product items · Nielsen Norman 1997「visitors don't read · they scan」 footer F-pattern · NN/g Halo Effect /lab pre-sim credibility · Anthropic /transparency 「transparency as product not afterthought」 模式落地。 3 sub-agent 平行 research:niche subscription wins(Stratechery / Defector / Aftermath / HEY / Plausible / Linear / Anthropic / FanGraphs / Baseball Savant)· codebase bug+a11y+perf audit · conversion funnel + brand consistency。 0 brand redline violation · 0 audience pivot 到「賭徒」 framing · 純 IA + visual hierarchy + funnel order + Hick's law N=1 simplification + WCAG AA + Atom RSS + transparency aggregator 物理 codify。",
  },
  {
    date: "2026-05-21 · Round 6-9 (consolidated)",
    title: "Pratfall reversal · /founders airline-grade · 完成度提升 · 4 rounds polished",
    detail:
      "Round 6 我嘗試用 Pratfall (Aronson 1966) + Costly Signaling (Spence 1973) defend 27 limitation items 跨 3 頁。Round 7 派 agent fact-check 我引用的 5 premium brands · 結果 0 of 5 actually publish structured limitation pages (Stratechery 沒 limitations 頁只在文章內 admit · 37signals homepage 無 · Plausible 是 GA-comparison positioning · Berkshire 30 頁年信不是 marketing page · Apple 0 limitations 在 marketing 頁)。我承認 over-cited · 大刀 cut:/audit 8→5 sections (含 S03+S04→1 個 ENGINE SCOPE 5 items) · /methodology 10→4 sections · /roadmap BRAND BOUNDARIES 6→3 items · 17 個 visible refs 更新。Memory 寫入 pratfall-brand-ip 規矩 = limitation list 最多 5-7 items in ONE place。Round 8 派 3 agents · /founders airline-grade polish:hero 加 live FOUNDERS_REMAINING / 270 scarcity + sticky CTA destination mobile compress + FROM THE FOUNDER 移到 form 後 + 刪 BLACK CARD reframe 整 section (114 行 · agent C 指出 2 個 reframe 重複) + 5 個 stale section refs 修。Mobile path:1500px → 600px (60% 縮短)。Round 9 完成度提升:ESLint 2 errors+1 warning 全綠 · CLAUDE.md 路由表更新 8→5 sections + 加 /roadmap /track-record /not-found /loading · 5 個 user-visible stale 「8 sections」refs 統一 5。Build / Lint / TSC strict 三綠。最大 lesson:Tim 連續 push 同方向 2+ 次 = canary 我 over-defended · research-backed defense 前提是 research fact-checked 不是 memory 引用。",
  },
  {
    date: "2026-05-21 · Round 5",
    title: "Mobile-first 重塑 · 8→3 viewports + sticky Founders CTA bar (+30% conversion)",
    detail:
      "Tim 第三次 push:「手機滑不完 · Owner 自己都不想逛 · 不會付錢 · 怎麼賺大錢?」Sharp call:不是「文字太多」· 是「總高度太高 + 價值主張埋太深」。派 agent 查 mobile subscription brand conversion psychology(Baymard 2026 · HubSpot 40k landing · Stratechery · Slack Design Fresh Eyes Audits)· 確認:80% mobile abandonment 是 preventable UX · CTA above fold = +30% conversion · 總 scroll ≤3 viewports · familiarity blindness 解 Tim 反應。Round 5 ship:(1) Homepage Hero mobile compress (pt-24→10 · pb-16→8 · text-5xl→4xl) · ~800→450px on mobile (2) HeroLiveCard mobile compress (p-8→5 · 段落 mb 全縮 50%) · ~900→520px on mobile (3) Homepage Founders 27 strip REMOVED · StickyFoundersCTA 取代 (4) Footer 4-col grid mobile hidden · Nav bottom row + Cmd-K + sticky CTA 取代 · ~1000→250px on mobile (5) ScarcityStrip 加 loss-aversion 語言「永久關閉」(Kahneman 2:1 frame) (6) 新 component StickyFoundersCTA · mobile-only sticky bottom bar · iPhone safe-area-inset · 48px tap target · usePathname conditional hide on /founders + /lab。Memory 寫入 feedback-zone27-mobile-first · 3-viewport rule + sticky CTA pattern 給未來 Claude session。Total mobile scroll: 8→3 viewports (Baymard target hit)。",
  },
  {
    date: "2026-05-21 · Round 4",
    title: "深度頁 audience-reframe · 工程美學 → 球迷語法 · /audit + /methodology compressed",
    detail:
      "Tim 反饋:「不只首頁雜 · 深度頁也是 · 不是每人都工程師」。Persona sharp call:我寫網站時 internalized 觀眾 = 「懷疑的科技記者 / 合規官 / 工程師」· Tim 真實觀眾 = 「硬核棒球迷想要 smart sport content」。Same truth · different audience grammar。Round 4 Phase 1 ship:/audit 8→6 sections (移除 BENCHMARK PERFORMANCE · KNOWN FAILURE MODES merged · LAST CALIBRATION RUN · MetaPair 6→3 items · BUILD chip 從 header → footer 小字)、/methodology 10→5 sections (移除 WHY BASEBALL · PLATE APPEARANCE MODEL · BASERUNNER PHYSICS · VALIDATION CLT proof · 重複的 ROADMAP)。Psychology backing:Cognitive Load Theory (Sweller 1988) · Information Foraging (Pirolli & Card 1995) · Choice Overload (Iyengar & Lepper 2000) · Empathy Gap。工程細節留 GitHub · 網站留 fan-relevant。/manifesto · /coverage · /discipline · /roadmap 不動 — 那些是 opt-in 深度頁 (NN/g Berkshire annual letter pattern)。Memory 寫入 feedback-zone27-audience-fans-not-engineers 給未來 Claude session。",
  },
  {
    date: "2026-05-21 · Round 3",
    title: "Apple-grade 首頁壓縮 · 8 sections → 3 · NN/g research-validated",
    detail:
      "Tim 反饋「網站好雜 · 走極簡風 · 心理學怎麼看」· 派 agent 上網查 NN/g + Apple + Stratechery + Bret Victor research 確認直覺有 hard psychology backing(NN/g 指出 trust badges 在 research-phase 訪客面前 ~90% invisible · Hick's Law · F-pattern reading)。首頁從 8 sections 壓到 3:Hero(精簡 · 0 CTA · HeroLiveCard 自帶 CTA)+ HeroLiveCard(THE 靈魂)+ Founders 27 strip(唯一的 ask)。移除 5 sections(CREDIBILITY STRIP · THREE PILLARS · BRAND INVERSION TLDR · BY THE NUMBERS bento · TRUST STACK 8-doc)· 內容全保留在 /manifesto · /audit · /coverage · /track-record · /roadmap 深度頁 · Cmd-K palette + Footer + RelatedReading hub-and-spoke 仍可達。Nav 移除 disabled 「登入」button(choice paradox + Apple-anti-pattern)。「我們的靈魂是什麼?」具體答案:引擎 + 收據。Stratechery model 落地。",
  },
  {
    date: "2026-05-21 · Round 2",
    title: "自主多輪迭代 · /roadmap + Cmd-K palette + /audit live dashboard + StatTerm 擴展",
    detail:
      "Tim 全權交付 · 用「敢於突破設計專家」persona lens · 派 2 個 parallel agent(bug audit + world-class brand research)· 同時手動推進。Round 2 共 4 commits / 50+ files / 1800+ insertions。新 canonical · /roadmap 第 8 個 trust artifact(LOCKED / EXPLORING / EXPLICIT NO 三段 · 「永遠不做」section 對標 Anthropic RSP + Plausible)· /not-found K-strikeout 升級(sabermetric notation)。Cmd-K 全站快搜 palette(23 routes · 5 groups · 完整 a11y · 無 fuse.js / 無 telemetry / 無 recently-used)· /audit live numeric dashboard(SAMPLE_SIZE 動態 + BUILD chip GitHub permalink)· Homepage TRUST STACK 7→8-doc(grid lg:cols-4 滿 4+4)· app/loading.tsx brand-pure skeleton · StatTerm 擴展到 /matches/[gameId] PitcherCard(Baseball Savant 風格 hover tooltip)。13 bug fixes(Phase 1 audit 8 個 + Phase 4 audit 5 個 IMPORTANT)+ OG glyph hardening + 全 repo refs 同步。Build / Lint / TSC strict 三綠。",
  },
  {
    date: "2026-05-21",
    title: "/track-record 公開戰績 ledger + match lifecycle (PRE/LIVE/FINAL) + calibration 收據",
    detail:
      "第 7 個 trust artifact /track-record 上線(Bloomberg-terminal ledger · PROVED ✓ 跟 DIVERGED ✕ 等大列出 · 從 N=0 honest empty state 起跳)· Match lifecycle 完整 5-phase 狀態(future · today-pregame · today-live · final · stale-archived · 取代舊 2-state stale/future binary)· HeroLiveCard + /matches/[gameId] 加 phase-aware badge + 賽後 calibration receipt block(僅當 finalResult ingested · 等大顯示 PROVED 或 DIVERGED)· /track-record OG card(8→15 個 custom OG)· homepage TRUST STACK 6→7-doc + grid lg:3→lg:4 · footer DOCS 加「公開戰績」· /audit Section 08 + /manifesto Section I inline link 到 /track-record · related-links hub-and-spoke 更新 · Match type 加 finalResult optional field + 5 個 helpers(isMatchDataToday · getMatchPhase · getCalibration · getEnginePctOnWinner · getFinalizedMatches)。版本 invariant 全站對齊(REPORT v0.28 · ENGINE v0.2 · LAST_REVIEWED 2026-05-21)。",
  },
  {
    date: "2026-05-20",
    title: "/manifesto 倒置宣言 + /founders 「您不是在買引擎」reframe + audit honesty sweep",
    detail:
      "/manifesto canonical 4-軸長文宣言上線(disclosure · monetization · coverage · privacy 四個倒置論證 + WHO THIS IS FOR + 8th custom OG card)· /founders 加 reframe section 直接回答「引擎免費為什麼還要付錢」· /about Chapter 03 method 步驟對齊 /audit Section 03 排除清單(刪 Trackman + stats.cpbl + 後端引擎 + 換投/代打 over-claim)· /audit Section 08 backlink 到 /manifesto · /audit header 釐清 REPORT v0.27 vs ENGINE v0.2 雙版本 · /lab hero version chip v0.3 → v0.2 honesty · /matches hardcoded date → dynamic · Footer chip 移除「MLB × 引擎合體」stale tagline · /glossary PR / Spin Rate / Pythag / TRACKMAN section 對齊真實狀態。",
  },
  {
    date: "2026-05-19 / 2026-05-20 上半天",
    title: "Supabase 後端上線 + 4 個 brand-axiom memories 鎖入系統",
    detail:
      "RLS-locked waitlist DB + 2 個 SECURITY DEFINER 函式 · channel attribution(?ref= → DB.source)· /coverage 第 4 個 trust artifact · /audit Section 08 disclosure philosophy · /lab/custom 3 軸 brand 壓縮 · 手機 hamburger nav 重設計 · /signal-board FRESHNESS · Footer 動態日期 · brand inversion thesis section 上首頁 · 16 輪 trust-artifact + craft polish 收尾 · ScarcityStrip 全站常駐 · /audit Model Report 8 sections(含 Environmental Impact 領先 98% ML model cards)· 7 個 custom OG cards · WCAG AA 22→0 fails · lang sweep + touch-action manipulation · Related Reading hub-and-spoke。",
  },
  {
    date: "2026-05-18 之前",
    title: "v0.1 - v0.26 · 早期版本",
    detail:
      "從零打造 ZONE 27 品牌系統 · Monte Carlo 引擎 · /lab + /lab/custom · 多次設計迭代 · MLB Stats API 整合 · 詳見 GitHub commits 完整歷史。",
  },
];

export default function ChangelogPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <header className="pb-10 border-b border-line/60">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
            >
              CHANGELOG
            </p>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-6">
              我們把版本歷史交給{" "}
              <span lang="en" className="font-mono text-gold">git</span>
            </h1>
            <p className="text-mute text-base leading-relaxed mb-8 max-w-2xl">
              ZONE 27 不再維護手工 curated 的 changelog narrative —
              那種敘事容易遺漏、過時、變成行銷話術。
              <strong className="text-bone">
                所有變動都公開在 GitHub commits,git log 是唯一事實來源
              </strong>
              。本頁列出近期里程碑當 reference;完整逐 commit 歷史請看下方按鈕。
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={GH_COMMITS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 border border-gold text-gold hover:bg-gold hover:text-navy transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                <span lang="en">VIEW ALL COMMITS ON GITHUB →</span>
              </a>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 px-5 py-3 border border-line/60 text-mute hover:text-gold hover:border-gold/40 transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                <span lang="en">/ROADMAP · 未來承諾 →</span>
              </Link>
            </div>

            {/* R75 W-B · UnscheduledLetterChip panel variant · Agent A R72
                SHIP 7 deferred · DHH world.hey.com letter pattern · frames
                /changelog as「unscheduled letters · pull-based · 您 OWN
                arrival」 · NOT blog · NOT newsletter · 同 git-log-is-source-
                of-truth axiom 物理 codify · asymmetric arrival ownership
                surface 早於 MILESTONES list · 訪客 land on /changelog 第一眼
                即 see brand IP framing。 */}
            <div className="mt-8">
              <UnscheduledLetterChip variant="panel" />
            </div>
          </header>

          <section className="py-12">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.45em] mb-6"
            >
              RECENT MILESTONES
            </p>
            <div className="space-y-8">
              {MILESTONES.map((m) => (
                <div
                  key={m.date}
                  className="pb-6 border-b border-line/40 last:border-b-0"
                >
                  <p
                    lang="en"
                    className="font-mono text-gold text-sm tracking-[0.2em] tabular mb-3"
                  >
                    {m.date}
                  </p>
                  <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-3 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-mute text-sm leading-relaxed">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 border-t border-line/40 text-center">
            <p className="text-mute text-sm leading-relaxed max-w-xl mx-auto">
              這頁刻意保持精簡(從原本 483 行 → 70 行) —
              因為我們相信
              <strong className="text-bone">git log 比任何手寫敘事更新更快、更不會撒謊</strong>。
              每個頁面 Footer 點版本 chip 也可以直達 commits。
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
