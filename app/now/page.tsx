import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";

export const metadata: Metadata = {
  title: "Now · 現在 — ZONE 27 craft journal",
  description:
    "ZONE 27 此刻在做什麼 · 此週 ship 了什麼 · 此週發現的瑕疵 · 此週還沒解決的。Linear-style /now 頁。/changelog 是過去 · /roadmap 是未來 · 這頁是當下。沒有 weekly schedule promise — 有東西可以說的時候才更新。",
};

// ── ZONE 27 · /now ─────────────────────────────────────
// Round 28 Wave 4 · Agent A pattern #3. Linear "/now" + Derek Sivers
// /now movement (2,000+ indie sites). The craft journal in present
// tense — what's literally happening right now in the codebase.
//
// Distinct from existing time-axis trio:
//   /changelog = past (git source of truth · immutable)
//   /now       = present (this week's fragmentary craft)
//   /roadmap   = future (locked commitments + explicit no)
//
// Brand axiom: "方法公開 · 品味私藏" — the /now page is the WHERE the
// method-public actually happens at human cadence. Pratfall-compatible:
// "本週還沒解決的" section is always non-empty (per [[feedback_zone27_
// pratfall_brand_ip]] — publish-weakness sections are permanent).
//
// Cadence: "when something earns the update" not weekly schedule
// (per choice to defer Wave 2D Stratechery cadence-promise · brand IP
// "不打擾就是禮物" applies to maintainer commitment too).
// ─────────────────────────────────────────────────────

const LAST_UPDATED = "2026-05-21";
const CYCLE = "Round 28-29 · 2026-05-21 evening · 同日 10+ waves";

const SHIPPED_THIS_CYCLE: { title: string; body: string; href?: string }[] = [
  // ── Round 29 Wave 10 ships(2026-05-21 evening · agent-research-driven)──
  {
    title: "[R29 W10C] /founders 「THIS ISN'T A CHECKOUT」 handshake framing",
    body: "Agent 研究 Pattern #3 · Spence 1973 signaling + Cialdini commitment + 2026 luxury-friction-design:「不解釋 friction 而道歉 → 解釋 friction 為什麼是 the product itself」。短簽名 Tim note 在 /founders「您不是在買引擎」section 後加:「銀行匯款 not Apple Pay · 是刻意的 · 這不是 checkout · 是 handshake · Apple Pay 一秒鐘的 commitment 跟 10 分鐘手工匯款的 commitment 不是同一個東西 · 我們選後者 · 因為它 filter 的是對的人」。Costly Signaling 從 operational detail 升 brand statement。",
    href: "/founders",
  },
  {
    title: "[R29 W10C] HeroLiveCard tertiary CTA Patek specificity",
    body: "Agent 研究 Pattern #1 · Lead Alchemists + BowTied Life 2026 conversion research:specific unit number 比 aggregate「263 / 270 remaining」conversion lift。原本「想成為 263/270 位之一?」改「想成為 #008?」 — identity stamp 取代 scarcity pressure。Title attribute 保留 aggregate context 給 hover · /founders /leaderboard 仍可看 remaining count。",
    href: "/",
  },
  {
    title: "[R29 W10A] HeroLiveCard today-live PhaseBadge shimmer",
    body: "1-line polish fix · today-pregame badge 有 shimmer · today-live badge 沒有(反直覺 · LIVE 應該比 PREGAME 視覺強度更高)。Tonight 18:35-22:00 cpbl-260521-01 game window · LIVE badge 現在會 subtle 脈動 · brand「engine is alive during the game」visual signal · 22:00+ Tim ingest 後 phase 自動切換 final · shimmer 停 · 物理時刻 visual transition 更明顯。",
  },
  // ── Round 29 Wave 9 ship ──
  {
    title: "[R29 W9] ArticleMeta consistency across 5 long-form trust docs",
    body: "Round 28 Wave 2C 加 ArticleMeta 到 7 trust docs · Wave 9 補完剩 5 個 long-form:/manifesto(14 min)· /discipline(14 min)· /about(8 min)· /learn(5 min)· /privacy(6 min)。12 trust artifact pages 全帶 reading-time chip · 跟原有 visual rhythm 統一 · 不是「加新東西」 · 是「補上應該已經有的」consistency closure。",
  },
  // ── Round 29 Wave 8 ship ──
  {
    title: "[R29 W8] Production audit fixes(1 agent + self-audit · 4 bugs caught)",
    body: "派 Explore agent 深度 audit Round 28-29 ships · 17 items · 15 clean · 2 🟡 MEDIUM · 「safe to ship tonight 🎯」。Ship 4 fixes:(1) /admin waitlistCount === -1 graceful fallback(原本顯示「-1 個 email」現在顯示「—」+「Supabase RPC 暫時不可達」)·(2) /faq#mlm anchor self-found broken(QAEntry 沒 id 屬性 · 加 anchorId prop)·(3) FirstReceiptHero defensive aiConfidence ?? 0 ·(4) RoadmapVotingPanel ▲▼ tap targets 36px → 40px(Apple HIG)。",
  },
  // ── Round 29 Wave 7 ship ──
  {
    title: "[R29 W7] Self-audit · bug fix + visible polish + docs backfill",
    body: "13 commits 後真實 self-audit。Bug fix:RoadmapVotingPanel 初次 hydration 觸發 false-positive「✓ saved local」flash · 加 hydrated flag 只在 hydration done 後 persist。Polish:/track-record HERO badge 「START · N=0」 → conditional「WAITING · N=0」 with shimmer + glow-gold + 強 border · 視覺 continuity with EmptyLedger「waiting 第一筆」framing · N≥1 後切回正常 earned state。Docs backfill:WHILE-YOU-WERE-OUT.md Wave 4-6 detail + TODO.md drift。",
  },
  // ── Round 29 Wave 6 ship(2026-05-21 evening · post-Wave-5)──
  {
    title: "[R29 W6] /lab Run Differential Histogram · score-level uncertainty",
    body: "解 Round 28 UNRESOLVED「MatchSimulator N=10K Uncertainty Stripe 太窄」。10K trials 自帶 distribution · 從 scoreCounts 拉 7-bucket histogram(主場 7+/4-6/1-3 · TIE · 客場 1-3/4-6/7+)· 0 額外 compute。Bank of England fan-chart + Baseball Savant EV distribution 結合。視覺上 winRate stripe 是 narrow dot · run differential histogram 是 wide curve · 兩者並存完整 uncertainty story。",
    href: "/lab",
  },
  // ── Round 29 Wave 5 ships ──
  {
    title: "[R29 W5A] /track-record N=1 First Receipt cinematic",
    body: "為今晚 22:00+ Tim ingest 第一場 CPBL cpbl-260521-01 設計的 brand 物理時刻。N=0 → N=1 transition 自動 fire 專屬 FirstReceiptHero(2px gold border + soft glow + entry animation · 「★ FIRST RECEIPT · 1 OF 270 PROJECTED」shimmer band · 大字 ENGINE PREDICTED vs ACTUAL · 等大 PROVED/DIVERGED/PUSH verdict)。N>1 自動切回正常 Bloomberg ledger。",
    href: "/track-record",
  },
  {
    title: "[R29 W5B] /member drag-rank IKEA voting",
    body: "Linear/PostHog 2025-2026 從 thumb-up 轉 drag-rank pattern。/member Section 03 改 ▲▼ arrow buttons swap-with-neighbor(mobile-safe · 不需 drag-drop dep)· localStorage 持久 · 「因為 ___」textarea 280 字 · ranked prioritization 比 binary vote 心理投資高(IKEA Effect cranked)。",
    href: "/member",
  },
  {
    title: "[R29 W5C] /member memory resurfacing strip",
    body: "Day One「On This Day」accumulating-over-time framing 的 lightweight 版。只在 history.length > 0 才 render · 顯示「YOU'VE ACCUMULATED · 您已累積 N 場 over D 天」 · Endowment Effect 真正 trigger 是「我擁有 X」不是「我會失去 X」。Strava Annual Best Efforts + GitHub contribution graph 同邏輯。",
    href: "/member",
  },
  // ── Round 29 Wave 4 ships ──
  {
    title: "[R29 W4] /member 2026 research-driven patterns (Agent A #2/#3/#4)",
    body: "Pattern #2 Context Metadata Strip(Atlassian + Vercel + MIT Tech Review April 2026)· Pratfall + Costly Signaling · 「資料位置 · localStorage · 上次寫入 · 我們看不到 · 0 cookies · 0 GA · 0 pixel」visible-presence trust signal。Pattern #3 Differentiated Empty State(NN/g 2026 guidelines)· first-time visitor vs filtered-zero 不同 copy · 不放 marketing。Pattern #4「近況 · 引擎」3-dated-lines micro-rail(Stratechery Plus + Patreon Jun-26 + GitHub release-info)· 純 dated facts · 不是 gamification。",
    href: "/member",
  },
  // ── Round 29 Wave 1-2 ships(earlier same day)──
  {
    title: "[R29 W2] /member NEW · FREE TIER 會員儀表板 PUBLIC PREVIEW",
    body: "Tim 直擊「會員他們自己的頁面又在哪裡?多以心理學角度去出發。」答案 = 4 cognitive bias 同時 fire 的 preview · ψ Endowment Effect(用 visitor 自己 localStorage sim history 當 preview data)· ψ IKEA Effect(投票引擎下一步)· ψ Loss Aversion(個人 calibration record)· ψ Collection(您自己的 trophy)。不假裝 functionality 已存在 · launch timeline 公開(Phase 1 Q3 auth · Phase 2 Q3+ TapPay · Phase 3 Q4+ CMS)。",
    href: "/member",
  },
  {
    title: "[R29] /admin NEW · Tim's ops dashboard preview · noindex",
    body: "Tim 直擊「我要如何管理會員?操作介面在哪裡?」答案 = Stage 1 是 Supabase Studio 直接登入(已 ready · 連結在頁面)· Stage 2 自家 /admin 還沒寫(trigger = waitlist > 100 人)· Stage 3 Plausible analytics 三條件 trigger(月活 > 1000 · BLACK CARD 上線 · Tim 要做產品決策)。Live KPI 顯示真實 numbers · mockup 顯示 Stage 2 dashboard 會長怎樣。",
    href: "/admin",
  },
  {
    title: "[R29] MLM 結構防線 · 主動 surface「我們不是傳銷」",
    body: "Tim 問「安麗 / 老鼠會有可以學的嗎?」Synthesis:MLM 心理學機制 (tribal identity · personal mentorship · status ladder) ZONE 27 已有等效(不同結構)· MLM 經濟結構(downline 抽佣 · referral bonus · quota · 庫存) ZONE 27 完全反向已寫死。/manifesto Section II 加 6-row ✕ MLM 對照清單 + /faq 加新 Q&A。Pratfall + Costly Signaling pattern · 主動 distance 比 reactive clarify 強。",
    href: "/manifesto",
  },
  // ── Round 28 ships(2026-05-21 PM-evening · same day earlier)──
  {
    title: "[R28] Uncertainty Stripe · 2026 canonical visual moat",
    body: "10K Monte Carlo 給的是分布,不只 point estimate。新增 hairline gradient band 在 HeroLiveCard + MatchSimulator 顯示 50% (深) / 90% (淺) binomial confidence interval。Bank of England fan-chart convention 套到 baseball forecast。",
    href: "/",
  },
  {
    title: "Pratfall surface · K/9 · BB/9 ESTIMATION 揭露",
    body: "lib/matches.ts 註解一直老實標 K/9 · BB/9 是從球速 + ERA 反推的估值,但 /audit Section 02 沒主動 surface。「埋著=自我入罪」改為「主動標=courageous disclosure」 — 加 ESTIMATION DISCLOSURE block in /audit。",
    href: "/audit",
  },
  {
    title: "/methodology ±2% honest reframe",
    body: "舊文「10,000 次採樣的收斂結果通常與歷史鎖定 AI 預測落在 ±2% 內」reads as accuracy claim,實際是 convergence noise。reframe 為「引擎內部一致性」+ 明示「對 CPBL 實際比賽的 calibration 還沒夠樣本(N ≥ 30 · SAMPLE DEBT)」+ link 到 /track-record。",
    href: "/methodology",
  },
  {
    title: "5 個 trust doc founder sign-off",
    body: "/audit · /methodology · /coverage · /track-record · /roadmap 加 3 行 first-person「我」段落 + signed TIM · FOUNDER · 2026-05-21。patio11 / DHH / Ben Thompson pattern — institutional voice → personal commitment。",
  },
  {
    title: "Z27 LEXICON SAMPLE DEBT 從 text 升 UI primitive",
    body: "ArticleMeta component · reading-time chip + N= SAMPLE DEBT chip(threshold 30 · Bill James 慣例)。N < 30 顯示 loss color + 「SAMPLE DEBT X BEFORE STATISTICAL」 · N ≥ 30 顯示 bone + 「STATISTICALLY MEANINGFUL」。",
  },
  {
    title: "/about Chapter 07 OPERATIONS · 5-row mono grid",
    body: "Industry insider 反覆問「solo or team?」/about Chapter 05 說「我不是學者」但沒 surface solo-as-discipline。新 OPERATIONS table:MAINTAINER · BUILD CADENCE · RESPONSE TIME · SCORE INGEST · FOUNDER ONBOARDING — 把 solo founder framed 為 commitment 不是 limitation。",
    href: "/about",
  },
  {
    title: "Conversion on-ramps · HeroLiveCard + /lab",
    body: "(1) 「蒙地卡羅」現在是 /learn 入口連結(休閒球迷 5-min primer on-ramp)·(2)「不接受下注」加入 methodology line 排除 gambling-card grammar 誤判 ·(3) /track-record 賽後收據連結永久 above-the-fold(skeptic proof path 不再 gated by finalResult)·(4) /lab post-sim 加 TRUST LOOP 2-card row → /track-record + /founders。",
  },
];

const DISCOVERED_THIS_CYCLE: { title: string; body: string }[] = [
  // ── Round 29 discoveries ──
  {
    title: "[R29] ZONE 27 surface pattern 跟 MLM 視覺重疊 · disambiguation 從沒主動 surface",
    body: "「限量 270 + 終身 + Tim 親手 onboard + LINE 群 + 實體聚會」這幾個 visual cue 在 Taiwan 語境下會被聯想到 MLM/安麗式「限量早期合夥人」框架。雖然結構完全相反(無 downline / 無 quota / 無 referral)· 但 disambiguation 之前埋在 /founders + /audit + /manifesto 多處 · 沒任何一處主動 surface = 真實 brand 防線缺口。Pratfall + Costly Signaling 補上(本 cycle Wave 1)。",
  },
  {
    title: "[R29] Tim 直擊:「會員他們自己的頁面在哪裡?」 = 真實 product gap",
    body: "網站到 Round 28 為止是 brand 層 + trust artifacts + waitlist capture · member functions 是下一層 · 還沒蓋。訪客看 4-tier ladder 會以為一切已 functional · 是 overpromise + underbuilt gap。/member preview 設計 with 4 cognitive bias driven sections · Pratfall surface 工程現狀(本 cycle Wave 2)。",
  },
  {
    title: "[R29] CLAUDE.md 我自己 introduce 的 v0.28 → v0.29 drift",
    body: "Round 28 Wave 5 docs sync 時我把 CLAUDE.md route table 寫成「v0.29」但其他全站(Footer · /audit · /manifesto · /discipline · /coverage · /founders FAQ · signal-board)還是 v0.28 · v0.29 應該等 Tim 拍板 milestone。Wave 3 修正:CLAUDE.md 回 v0.28 + 加「等 Tim 拍板」註解。Lesson:版本 bump 是 brand decision · 不是 docs sync 的副作用。",
  },
  // ── Round 28 discoveries ──
  {
    title: "[R28] /founders FROM THE FOUNDER 引用跟 /about Chapter 05 完全重複",
    body: "「ZONE 27 是我給這群人 —— 包括我自己 —— 的一封情書」這句話 verbatim 出現在兩頁。Skeptic 看到會覺得 scripted,不是 honest。改為 Chapter 05 另一句更具體的「台灣的棒球資訊產業卻長期停留在『直覺說書人』的階段」+ Bloomberg analog。",
  },
  {
    title: "CommandPalette + comment 寫「24 routes / 23-row」實際 25",
    body: "Post-Round-25 (/membership 新增) drift。Round 26.2 修了 related-links.ts 但 CommandPalette 跟 command-palette-data.ts 註解漏更新。本 round Wave 1C 修齊。",
  },
  {
    title: "Agent B 把 glossary 算成 32 stats · 實際 27 industry + 5 Z27 LEXICON",
    body: "Bug audit agent 誤算 batting 為 15(實際 10)誤判 metadata「27 種棒球進階數據」是 drift。實際 industryTotal = 10+10+7 = 27 ✓ + 5 Z27 LEXICON = 32 total。「27」brand-number is integer-perfect by design。Agent 報告需要 fact-check。",
  },
];

const UNRESOLVED: { title: string; body: string }[] = [
  // ── Round 29 Wave 10B agent anti-pattern flag ──
  {
    title: "[R29 W10] 「Launch loudly to warm list」playbook · permanently wrong for ZONE 27",
    body: "Agent 主動 flag · 2026 #1 indie launch playbook(Tom Orbach $50K/72h · 70% revenue in 72 hours · warm 5K+ email list blitz)wrong for ZONE 27:(1) stealth axiom forbid「loud」half ·(2) audience axiom(hardcore baseball fans 不在 IndieHackers Twitter crowd)。Right shape:slow trickle to #270 over 6-18 months · /founders 第 1 天跟第 400 天看起來一樣 · just a different number · slowness IS the curation proof。寫入 brand permanent decision · 將來如果想 launch-blitz 先回看這條。",
  },
  // ── Round 29 new unresolved ──
  {
    title: "[R29] FREE TIER auth + cloud sync · Phase 1 Q3 2026 target",
    body: "Supabase magic link auth 接入 · /member 變 auth-gated · visitor localStorage sim history sync 到 cloud。技術上免費(Supabase free tier 涵蓋) · 但是 build · 不是 copy。Round 30+ 啟動候選之一 · 等 Tim 明示「啟動 auth」trigger。",
  },
  {
    title: "[R29] BLACK CARD TapPay 訂閱 · Phase 2 Q3+ target · TIER 2 budget",
    body: "TapPay 訂閱通道需 setup fee NT$ 1-3K + 每筆 2-3% 抽佣 = TIER 2 預算 · 必須明確 Tim 同意才執行(per 預算紀律 v2)。Tim 尚未明示。BLACK CARD 月費功能(發文 / 推薦賽事 / 5% 創作者抽成)全部 gate 在此後面。",
  },
  {
    title: "[R29] Founders 27 仍框 framing「preorder/waitlist」· 其實可以「現在開」",
    body: "Founders 27 不需要 system(銀行轉帳手工 onboard · per docs/MANUAL-ONBOARDING)· 可以今天就第一個會員入帳。但目前 /founders 仍是 waitlist 框架(收 email · 等開賣通知)。Round 30+ 可考慮 reframe 為「現在 actively accepting reservations · Tim 親手 confirm」。Brand decision · 等 Tim 拍板「我準備好接第一筆轉帳」。",
  },
  // ── Round 28 still-unresolved ──
  // (「MatchSimulator N=10K Uncertainty Stripe 太窄」 已 Wave 6 RESOLVED ·
  // 新加 Run Differential Histogram 暴露 score-level distribution · 已從
  // UNRESOLVED 移除 · entry 在上方 SHIPPED [R29 W6])
  {
    title: "/now 本身沒 weekly schedule promise",
    body: "Stratechery 的 cadence-promise pattern(每週五 18:00 TPE)會 commit Tim 到 weekly workload · brand IP「不打擾就是禮物」可能不喜歡 schedule-driven。決定 defer 給 Tim brand 拍板。此頁 cadence = 「有東西可以說的時候才更新」。",
  },
  {
    title: "Persona 4 P4.1 · /leaderboard authentication banner 沒做",
    body: "Skeptic 看 NEXT IS #008 會問「#001-#007 是誰?prove they exist」。/leaderboard 目前 hardcoded array · 沒 GitHub commit history audit trail。Round 29+ 可考慮加 banner: 「認領日為真實 bank-transfer 到帳日 · 規則寫在 supabase/migrations/0001」。",
  },
  {
    title: "Wave 2B Bilingual EN ghost-line typography density",
    body: "M+ HK pattern · 每個 section header 有 Chinese + EN ghost line。Section/ReportSection components 已有 EN label · 但 sub-headers + inline 仍是 30% in place。需要系統性 pass · Round 29+ 評估 ROI。",
  },
];

export default function NowPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
        <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em]"
          >
            / NOW · 現在
          </p>
          <span
            lang="en"
            className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80"
            title="當前 build cycle · 詳細 ship list 在 /changelog · git source of truth"
          >
            {CYCLE}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
          ZONE 27 此刻在做什麼 ·{" "}
          <span className="text-gold">當下的工藝</span>
        </h1>
        <p className="mt-6 text-mute leading-relaxed max-w-2xl">
          <Link
            href="/changelog"
            className="text-gold underline-offset-4 hover:underline"
          >
            /changelog
          </Link>
          {" "}是過去的事實(git 為 source of truth)·{" "}
          <Link
            href="/roadmap"
            className="text-gold underline-offset-4 hover:underline"
          >
            /roadmap
          </Link>
          {" "}是未來的承諾。
          <strong className="text-bone">這頁是當下</strong> —
          本週引擎在想什麼、發現了什麼、還沒解決什麼。
        </p>
        <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
          沒有 weekly schedule promise · 有東西可以說的時候才更新。
          Linear /now + Derek Sivers /now movement 對標 · 倒置 SaaS
          預設的「scheduled marketing」。
        </p>
        <div className="mt-6">
          <ArticleMeta readingMin={3} />
        </div>
      </section>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── 01 · 本週 ship 了什麼 ─────────────────── */}
      <Section
        no="01"
        en="SHIPPED THIS CYCLE"
        zh="本週 ship 了什麼"
        kicker={`${SHIPPED_THIS_CYCLE.length} 個落地的 commit`}
      >
        <p>
          每一項都有對應的 git commit · 列出來不是 marketing · 是
          accountability log。
        </p>
        <div className="mt-8 space-y-6">
          {SHIPPED_THIS_CYCLE.map((item) => (
            <article
              key={item.title}
              className="border-l-2 border-gold/40 pl-5 sm:pl-6 py-1"
            >
              <h3 className="text-bone text-lg font-light tracking-tight mb-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-gold transition-colors underline-offset-4 hover:underline"
                  >
                    ✓ {item.title}
                  </Link>
                ) : (
                  <span>✓ {item.title}</span>
                )}
              </h3>
              <p className="text-mute text-sm sm:text-base leading-relaxed">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── 02 · 本週發現的瑕疵 ─────────────────────── */}
      <Section
        no="02"
        en="DISCOVERED THIS CYCLE"
        zh="本週發現的瑕疵"
        kicker={`${DISCOVERED_THIS_CYCLE.length} 個被自己 catch 的問題`}
      >
        <p>
          找到並修了 · Pratfall + Costly Signaling · 列出「我們找到的問題」
          比藏起來更值得。
        </p>
        <div className="mt-8 space-y-6">
          {DISCOVERED_THIS_CYCLE.map((item) => (
            <article
              key={item.title}
              className="border-l-2 border-loss/30 pl-5 sm:pl-6 py-1"
            >
              <h3 className="text-bone text-lg font-light tracking-tight mb-2">
                ▲ {item.title}
              </h3>
              <p className="text-mute text-sm sm:text-base leading-relaxed">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── 03 · 本週還沒解決的 ─────────────────────── */}
      <Section
        no="03"
        en="UNRESOLVED THIS CYCLE"
        zh="本週還沒解決的"
        kicker={`${UNRESOLVED.length} 個刻意延後的決定`}
      >
        <p>
          知道但沒做 · 為什麼沒做 · 什麼時候可能做。每一項都有
          axiom-level reason · 不是「忘了」。
        </p>
        <div className="mt-8 space-y-6">
          {UNRESOLVED.map((item) => (
            <article
              key={item.title}
              className="border-l-2 border-mute/30 pl-5 sm:pl-6 py-1"
            >
              <h3 className="text-bone text-lg font-light tracking-tight mb-2">
                ◇ {item.title}
              </h3>
              <p className="text-mute text-sm sm:text-base leading-relaxed">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── 04 · WHERE THIS GOES ─────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40">
        <div className="flex items-baseline gap-4 mb-2 section-reveal">
          <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
            / 04
          </span>
          <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
            WHERE THIS GOES
          </span>
        </div>
        <h2 className="text-3xl text-bone font-light tracking-tight mb-8">
          這個 page 接下來
        </h2>
        <div className="space-y-5 text-mute text-base leading-relaxed">
          <p>
            這頁的維護成本是「想記就記 · 不想就不記」 · 沒有 SLA。
            Tim 一個人在跑 · 不是 marketing team。
            <strong className="text-bone">沒人在「催」這頁更新</strong> ·
            這頁存在的理由是 founder 自己想記。
          </p>
          <p>
            Linear /now 跟 Derek Sivers /now movement 共同的洞察:
            <strong className="text-bone">公開的「現在」比公開「未來」更難</strong> ·
            因為現在 = 未完成 + 未解決 + 還沒有答案。
            敢公開現在 = 敢承認自己在學。
          </p>
          <p>
            下次更新觸發條件:有意義的 ship · 或被自己 catch 的瑕疵 ·
            或想清楚一個之前 unresolved 的決定。沒有 schedule · 沒有
            quota · 沒有「本週必須發」 — 倒置 SaaS 預設的「scheduled
            marketing」。
          </p>
        </div>
        <p className="mt-8 font-mono text-mute/60 text-[10px] tracking-[0.3em] tabular">
          LAST UPDATED · {LAST_UPDATED}
        </p>
      </section>

      <FounderSignOff>
        <p>
          這頁不是部落格 · 不是 marketing newsletter · 不是「成長日誌」。
          <strong>是一份給自己看的 craft log</strong> · 你能讀到只是因為
          ZONE 27 把它放公開資料夾。
        </p>
        <p>
          如果有一週這頁沒更新 · 不代表 ZONE 27 沒在做事 ·
          可能只是<strong>沒有可以說的</strong>。靜默也是一種承諾。
        </p>
        <p>
          這頁的 footer 永遠是 LAST UPDATED 那一天 · 沒有「下次更新時間」。
        </p>
      </FounderSignOff>

      <RelatedReading currentPath="/now" />

      {/* ── BACK ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/changelog"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 過去的事實 · /changelog
          </Link>
          <Link
            href="/roadmap"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            未來的承諾 · /roadmap →
          </Link>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}

function Section({
  no,
  en,
  zh,
  kicker,
  children,
}: {
  no: string;
  en: string;
  zh: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40">
      <div className="flex items-baseline gap-4 mb-2 section-reveal">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {en}
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-2">
        {zh}
      </h2>
      <p className="font-mono text-mute text-xs tracking-[0.25em] mb-8">
        {kicker}
      </p>
      <div className="space-y-5 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}
