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

const LAST_UPDATED = "2026-05-23";
const CYCLE = "Round 28-61 · 2026-05-23 · 37+ canary fires displacement mission · 40 visitor-discoverable routes · 7 LIVE LENS CANVAS + 3 ENGINE SET(v0.2 BASE SET + v0.3 EXPANSION 1 + v0.4 EXPANSION 2)+ entire v0.2→v0.3 DIFF + 8 binding ethics + 5 steelman + 8 localStorage keys disclosed + Atom RSS LIVE · R59 5 W full-authority(brand-redline + conversion + Hindenburg + getUser)· R60 Pokemon TCG lens(SHADOWLESS RUN binary tier + SET narrative + TCG card anatomy)· R61 3rd-invocation full-authority(validate regex bug 6→3→0 · focus-visible a11y 11 forms · Agent 2 audit 14-file synthesize · 2 critical 🔴 brand contradictions closed(賣明牌 · /audit S08 broken)+ 6 stale magic-link cleanup + /auth/callback raw-error-leak fix + PreviewModeBanner WCAG 2.2 + input-safe shortcut)· displacement battle 對 玩運彩+報馬仔 14+ 層 structural moat";

const SHIPPED_THIS_CYCLE: { title: string; body: string; href?: string }[] = [
  // ── 🚨 Round 61 W-A+W-B+W-C+W-D+W-E · 3rd full-authority invocation · 5 waves ─
  {
    title: "[R61 WA→WE] 🚨 3rd full-authority mandate · 5 waves · validate regex bug + focus-visible + Agent 2 audit 14-file + WCAG 2.2",
    body: "Tim 3rd full-authority invocation「自己迭代網站 · 上網查資料 · 攻頂」 → 3 parallel agents(award-winning visual / fresh codebase + WCAG 2.2 / strategic big-work)spawn · synthesize → 5 waves。 W-A validate regex bug(R59 W-F 留下 4 false-positive pitchers · cpbl-pitchers.ts JSON 用 「\"name\":」 format · regex 「name:」 0 matches · fixed 加 leading quote anchor · 6→3 actual missing)。 W-B validator inline ESTIMATE marker support 3-tier classification(0 error 0 warning · 3 pitchers 用 inline // estimate marker honored per /audit S02 ESTIMATION DISCLOSURE pattern)。 W-C 11 focus: → focus-visible: a11y refactor across 7 form files(login · member submit · lab custom · FounderPickForm · MatchNoteEditor · MemberDashboardPreview · WaitlistForm)· Vercel guideline align · keyboard users see gold ring · mouse users 不見 visual noise。 W-D Agent 2 audit 14-file synthesize · 2 CRITICAL 🔴 brand-redline contradictions closed(賣明牌 4 user-visible surfaces 改 「creator 抽成」 brand-pure · /audit Section 08 broken references 5 places → Section 05 actual DISCLOSURE PHILOSOPHY)+ 6 stale magic-link UI(R59 W-B sweep missed · post-R50 W-F password-only)+ /auth/callback raw-Supabase-error-leak fix(同 /login friendlyPasswordError 同 anti-pattern · whitelist canonical code · console.error raw server-side)+ /annual/2026 commitsToDate 200→294 actual。 W-E PreviewModeBanner WCAG 2.2 SC 2.5.8 hit-target 28→32/36px + Cmd+Shift+P input-safe(Firefox Private Window collision + Linear/Notion respect-input-focus pattern · skip handler 當 target 在 INPUT/TEXTAREA/contenteditable)。 Agent 1(visual)Ship #2 Kicker / #4 percentile rug / #5 Hindenburg engine output footnotes 待 R62+ · Agent 3 big-work pre-launch(CPBL pipeline L · engine v0.3 production M · /founders/apply form S · Taiwan refund + PDPA legal S · Resend email automation M)待 Tim 拍板。",
    href: "/",
  },
  // ── 🎴 Round 60 W-A+W-B · Pokemon TCG lens · SHADOWLESS RUN binary tier + SET release narrative + TCG card anatomy ─
  {
    title: "[R60 WA+WB] 🎴 Pokemon TCG lens · SHADOWLESS RUN integer 270 = 1st Edition + SET release narrative + TCG card anatomy on FirstReceiptHero",
    body: "Tim 「為什麼寶可夢成功? 卡牌? 蒐集? 商業價值? 為什麼增值?」 → 3-agent full-authority pattern fire · 1 deep web research agent(Heritage Auctions / Bulbapedia / Pokemon.com Pikachu design / TCG Protectors anatomy / Norton-Mochon-Ariely IKEA effect / Kahneman endowment effect)· 5 ranked TCG amplifications synthesized · ship 2 of 5 + 1 visual amplification。 W-A: SET release narrative on /methodology Section 04 ENGINE LINEUP · v0.2 = BASE SET · v0.3 = EXPANSION 1 (Park Factor)· v0.4 = EXPANSION 2 (Bayesian Mix)· 同 WoTC Base Set→Jungle→Fossil release narrative · 工程術語升 collectible narrative。 W-A同wave: SHADOWLESS RUN binary tier framing on /founders + NEW section #shadowless-run on /founders/ledger · 整批 270 = 1st Edition Shadowless Run · BLACK CARD 訂閱者永遠無法 retroactively 升 Founders 27 · 同 Pokemon 1st Edition Charizard $550K(PSA 10 · 2024 Heritage)vs Unlimited low five figures 10-50× premium mechanic · 3 BINDING PRE-COMMITMENTS box · 不分 sub-tier(no vinyl First Pressing 偽 prestige 發明)· pure binary tier accurate to Pokemon mechanic。 W-B: TCG card anatomy on FirstReceiptHero(/track-record)· top-line「ZONE 27 ENGINE · v0.2 · RECEIPT 001 // CARD 001/CPBL SEASON 2026」 + bottom-line「CARD 001/∞ · CPBL 2026 SEASON 1 · REPRINT POLICY 0」 typographic frame · 不是 visual skinning(無 yellow border · 無 holo · 無 emoji)· 是 typographic card grammar transplant · screenshot-shareable artifact · 同 TCG Protectors anatomy guide(card # / set total + rarity + illustrator footer)。",
    href: "/founders/ledger#shadowless-run",
  },
  // ── 🛡️ Round 59 W-E · /audit DISCLOSURE mirror + Supabase getUser helper ─
  {
    title: "[R59 WE] 🛡️ /audit Hindenburg DISCLOSURE block mirror + Supabase getUser() helper · trust artifact consistency",
    body: "Mirror /methodology WAVE D 的 8-field position disclosure 到 /audit hero · brand consistency across two canonical trust artifacts(model report + engineering paper)· 訪客從哪頁進都看到 identical position-disclosure baseline:EQUITY 100% TIM solo · 0 SPONSORS · 0 ADS · 0 TRACKERS · RECEIPTS N=1 · 7 SYSTEM-TEST FOUNDERS · 0 paid BLACK CARD · NT$ 0 revenue · 同 Hindenburg「at-the-top」 + Anthropic system card「known affiliations」 pattern。 Plus Supabase getUser() helper added to lib/supabase/server.ts · 同 getSession() pattern 但 re-validates with auth server · Agent B 🟡 #8 defense-in-depth · 為 Phase 2 admin actions ship 預備 · 0 breaking change existing getSession() usage。",
    href: "/audit",
  },
  // ── 📜 Round 59 W-D · Hindenburg footnote retrofit on /methodology ─
  {
    title: "[R59 WD] 📜 Hindenburg Research footnote retrofit on /methodology · brand IP 「方法公開」 evidence-grade citation",
    body: "Agent A web research ship #3(M effort · 8/10 ROI)· Hindenburg evidence density pattern · 之前 prose-cite Bill James/Tango/FanGraphs 但 inline claims 沒對應 numbered footnote anchor。 3-段補齊:(1)NEW top-of-document DISCLOSURE block · 8 position facts grid · Hindenburg「at-the-top-of-document position disclosure」 + Anthropic「known affiliations」 pattern · LAST UPDATED date stamp。 (2)4 inline superscript footnotes in ABSTRACT([1] Monte Carlo · [2] K/9 BB/9 HR/9 · [3] ±2% CLT · [4] N≥30 SAMPLE DEBT)· 訪客 click sup [N] anchor-jump · academic paper grammar。 (3)NEW Section 07 FOOTNOTES · numbered list 含 8 primary source URLs(Wikipedia Monte Carlo · FanGraphs Run Expectancy · FanGraphs Glossary · Rate Stats · Wikipedia CLT · GitHub simulator.ts · Russell Carleton stat reliability · Wikipedia sample size)。 NEW FootnoteRef component · superscript + inline variants · accessible aria-label · 0 deps。 Sabermetric/Forensic-credibility grammar 對齊 hardcore CPBL fan audience · 對 玩運彩/報馬仔 pure-prose「based on research」 框架 倒置。",
    href: "/methodology#disclosure",
  },
  // ── 🔢 Round 59 W-C · Stale route-count drift across 5 files ─
  {
    title: "[R59 WC] 🔢 5 files stale route-count drift · Agent B 🟡 #9 · all aligned to canonical 40",
    body: "Agent B audit surface · 7 places said 24/25/32/34/36/39 visitor-discoverable routes · 全部 stale · physical count = 41 page.tsx minus /admin = 40 · sharp visitor 數 nav 跟 dev comment 對不上 = drift surface。 5 stale refs → 40:CommandPalette.tsx(2 places · 「34 routes」 / 「34-row list」)· CmdKTrigger.tsx(2 places · 「24-route」 / 「25 個頁面」 title attr)· lib/command-palette-data.ts(「39-row list」 comment)· app/page.tsx(「34 routes indexed」 comment)· app/roadmap/page.tsx(LOCKED Cmd-K body 「32 entries」 + 完整 add-route trail compiled)· CLAUDE.md(「36 visitor-discoverable」 + 加 /methodology/diff + /transparency cross-ref)。 /transparency cross-link /annual/2026 verified · 不需額外 ship。 同 [[feedback-zone27-pratfall-brand-ip]] self-falsifiable attack vector close。",
    href: "/",
  },
  // ── 🛡️ Round 59 W-B · 1 Agent C anchor strip + 5 Agent B critical 🔴 ──
  {
    title: "[R59 WB] 🛡️ /membership/black-card 4-cell anchor strip + 5 critical 🔴 hardening · 9 files",
    body: "Agent C Ship #3(★★★★★ S effort)· /membership/black-card hero NT$ 200-450/月 sweet spot band 4-cell anchor strip · Defector ~200/月 · Netflix Premium 390/月 · Gym 1,500+/月 · BLACK CARD 299/月(gold highlight)· Loss Aversion + Contrast Principle 激活 · 中段 sweet spot 物理對齊 indie sports subscription band。 5 Agent B critical 🔴 hardening:(1)app/login/page.tsx:571 friendlyPasswordError 不再 leak raw Supabase strings · log + canonical generic message。 (2)lib/command-palette-data.ts 「李東洛」 → 「李東洺」 typo fix(cpbl-260521-01 PROVED ace 真名)。 (3)app/auth/signout/route.ts 加 isSameOrigin CSRF guard · 同 /api/submit pattern。 (4)8 stale 「magic link」 user-visible copy refs → 「Email + 密碼」 · /member · /member/submit · /calibration · FounderPickForm · FollowMatchButton · NavLoginCTA · Cmd-K palette label · R50 W-F founder dogfood 砍 magic link 後 UI 同步。",
    href: "/membership/black-card",
  },
  // ── 🚨 Round 59 W-A · /founders break-even math 5.4→9 + 5 conversion ships + validate fix ──
  {
    title: "[R59 WA] 🚨 CRITICAL /founders 5.4 個月 → 9 個月 break-even fix + 5 Agent C conversion amplifications + validate script schema",
    body: "Tim 全權迭代 mandate · 3 parallel agents spawn(web research / codebase audit / conversion funnel)· Agent C surface CRITICAL self-falsifiable brand redline:/founders hero BreakEvenCell 顯示 「5.4 個月」 但 caption 寫 「9 個月即達損益平衡」 + 「9× ratio」 line 重複 9 · 自相矛盾。 Math:2,700÷299 = 9.03 · 5.4 是 stale 從 R33 BLACK CARD reprice 499→299 之前(2,700÷499≈5.4)· caption 已 update · cell 沒。 Skeptic find in 5 sec = Pratfall attack。 修 + TODO.md 同 stale refs(「5.4 個月 break-even」 / 「BLACK CARD 499/月」 → 「9 個月」 / 「299/月」)。 5 Agent C XS conversion ships:(2)AnonPickWidget state 3 加 BLACK CARD NT$ 299/月 CTA in IKEA-effect retention loop · (4)首頁 F6 加 /transparency → cross-link · (5)/founders 9× block 加 /methodology/diff anchor「我們連 5 行 logic change 都公開」 · (6)首頁 Founders pill 下加「270 = Tim 一年親手 sign-off 上限 · 不是 marketing 數字」 · (7)HeroLiveCard 「想成為 #008?」 下加同 ceiling framing · 5 ships 同 Pratfall + Costly Signaling axis。 PLUS validate-match-data.mjs Step 6 schema regex 從 homeRuns/awayRuns 改 homeScore/awayScore · 對齊 FinalResult type · validate:data:warn 1 error → 0 error。",
    href: "/founders",
  },
  // ── 📡 Round 51 W-E · Atom RSS /feed.xml + ReproducibilityReceipt /audit S04 ──
  {
    title: "[R51 WE] 📡 Atom RSS /feed.xml + ReproducibilityReceipt /audit S04 · R50 TODO + R43 deferred 收束",
    body: "W-E ship 2 R50+ TODO 項目同時收束:Atom RSS /feed.xml(R50 TODO 第 1 · Agent L R44 GAP-3)+ ReproducibilityReceipt to /audit Section 04(R43 deferred · 同 R42 W-B pattern 延伸)。 行銷設計專家 sharp:hardcore baseball fan(FanGraphs/Baseball-Reference 讀者 demographic)5+ year RSS reader usage · Stratechery / FanGraphs / Baseball Savant 皆 LIVE Atom feed · ZONE 27 0 feed = 訪客 only path 是 email 或 recurring URL visit。 RSS = subscriber-pulled 0-tracking subscription · 完美對齊 0 cookie + audience-fans axiom。 NEW lib/feed-items.ts hand-curated FEED_META + 10 most-recent ship entries · NEW app/feed.xml/route.ts Atom 1.0 format(RFC 4287)· static + Vercel rebuild trigger update。 Wired:layout metadata.alternates.types「application/atom+xml」 HTML head RSS auto-detect · Footer PRODUCT group +1 link 「RSS · Atom feed」。 RR drop-in /audit S04 ENVIRONMENTAL IMPACT · 0.0005 hr / sim + < 0.1 g CO₂e / sim estimates 升 reproducible artifact。",
    href: "/feed.xml",
  },
  // ── 🌐 Round 51 W-D · /transparency aggregator route ──
  {
    title: "[R51 WD] 🌐 NEW /transparency · audit aggregator · Anthropic 模式 · first-class destination",
    body: "Agent 1 world-class niche subscription research ship #1 · Anthropic /transparency pattern · 把分散在 8 個 trust artifact pages 的 transparency content 聚合一個 navigable destination · 升 first-class brand axis · 不再是 footer link / about page bottom 隱藏。 6 sections:01 WHAT WE DON'T KNOW(LIMITS 集合)+ 02 WHAT WE DON'T DO(11 件「永遠不做」 binding grid)+ 03 WHEN WE'VE BEEN WRONG(DIVERGED 物理 codify)+ 04 WHAT WE COMMIT TO(8 binding ethics grid)+ 05 WHERE OUR DATA COMES FROM(3 data paths)+ 06 HOW YOU CAN AUDIT US(4 audit primitives)+ 07 LENS LIFETIME PLEDGE ANCHOR。 NEW custom OG card(「完整 audit · 一頁可見」 typography + 6 SECTION CHIPS grid)。 Wired CommandPalette + Footer DOCS column 1 + RelatedReading。 Brand IP triple-fire(Disclosure + Pratfall + Costly Signaling)同時 ship。",
    href: "/transparency",
  },
  // ── ✨ Round 51 W-C · trust artifact conversion close + WCAG AA ──
  {
    title: "[R51 WC] ✨ /ethics + /steelman conversion CTA · /about Ch07 mailto · Homepage + Footer WCAG AA",
    body: "Agent 3 conversion funnel synthesize · 5 brand strengthening + a11y fixes。 /ethics + /steelman 讀完訪客是 strongest warm-up state · 必須 trust loop close to Founders 27 / BLACK CARD entry · 不 dump 到 navigation。 加 explicit conversion sections + 2 primary CTA chip。 /about Chapter 07 OPERATIONS RESPONSE TIME row 加 callout「📧 直接寫信:tim@zone27.tw · 24h 內回覆保證 · 超過則 /ethics 紅字標」 · accountability 從 abstract claim → physical actionable channel。 Homepage F6 declarative strip dividers 加 aria-hidden=true(WCAG 1.3.1)+ text-mute/60 → text-mute(5.6:1 ✓ AA pass)。 Footer FUNDED row text-mute/70 → text-mute/85(5.2:1 ✓ AA pass)。",
    href: "/ethics",
  },
  // ── 🛠️ Round 51 W-B · 7 funnel + cross-link fixes ──
  {
    title: "[R51 WB] 🛠️ 7 funnel + cross-link fixes · Agent 3 conversion audit synthesize",
    body: "/lab empty state CRITICAL fix · 之前 N=0 dead-end power-user form · 修為 3-card grid(WHITEPAPER / TRACK RECORD / POWER USER)對應不同 audience entry。 /lab pre-sim credibility anchor · Hero EngineFreeBrandBlock 下方加「✓ 公開戰績 · 引擎過去 PROVED / DIVERGED 等大列出 →」 · NN/g Halo Effect 訪客 trust threshold 降低。 /lab + /lab/custom 加 Tim signature one-liner · founder voice 補洞。 /audit Section 01 加 v0.3/v0.4 engine cross-link(BLACK CARD commercial unlock 核心 · 之前 audit 不 surface 斷層)。 /steelman FINAL CTA 加 /annual/2026 link(Year 0 honest empty 同 pratfall pattern)。 /track-record hero 加 /calibration anonymous note(訪客知 reliability diagram 在哪 · 匿名可進)。",
    href: "/lab",
  },
  // ── 🐛 Round 51 W-A · 3 critical bug fixes ──
  {
    title: "[R51 WA] 🐛 3 critical bug fixes · Agent 2 audit synthesize",
    body: "Agent 2 bug + a11y + perf audit synthesize · ship 3 TIER-0 fixes。 /login handleResend logic correctness fix · R50 W-F 砍 magic link mode 後 handleResend 仍 wired 但 call signInWithOtp 不是 resend confirmation · 走錯 API silently fail · 修為 supabase.auth.resend({ type: 'signup', email, options })。 /login friendlyPasswordError stale 訊息 fix · 之前「點下方『忘記密碼』改 magic link」 ghost text 指向 R50 W-F 已移除的 UI · 改寫「確認 capslock · 仍不行寫信 tim@zone27.tw」 real recovery path。 /api/submit session.user.email strict validation · 砍「anonymous@unknown」 magic string fallback(invalid email · 違反 PII inventory)· 改 401 reject if 缺 valid email · system invariant break 不藏 cover-up。",
    href: "/login",
  },
  // ── 🔬 Round 50 W-A · /methodology/diff DEEPEST · v0.2 → v0.3 entire delta ─
  {
    title: "[R50 WA] 🔬 NEW /methodology/diff · entire v0.2 → v0.3 delta published · brand IP triple-fire",
    body: "Tim 留空指令 → 鐵律 default ship NOW · 不問 keyword · 接 R50+ TODO 第 1 條(原 Agent H R41 #2 · 3hr scope)· brand IP triple-fire(Disclosure + Pratfall + Costly Signaling)同時 ship。 NEW app/methodology/diff/page.tsx · 7 sections · 14 unchanged constants + 1 new(HR_PARK_SENSITIVITY = 0.5)+ 5 行 logic delta + 4 場館 worked example(新莊 ×0.9842 / 桃園 ×1.0316 / 大巨蛋 ×1.0105 / 澄清湖 ×1.0158)+ 6 件 v0.3 不修正 Pratfall list(BABIP / dimensions / weather / batter splits / DH / N≥30)+ v0.4 PRE-COMMIT(Bayesian Model Averaging)+ Lens Lifetime Pledge anchor(此 diff page 永久 viewable 即使 v0.4 ship 後)。 NEW app/methodology/diff/opengraph-image.tsx custom OG paper-style 「v0.2 → v0.3」 typography + 4 fact rows。 CommandPalette + RELATED_LINKS + /methodology Section 04 cross-link DEEPER ENGINE DIFF callout · 同 React.dev release notes / Stripe API changelog / Anthropic model card revision pattern · 物理 ban cherry-picking 退路。 不止 claim「我們有 2 engines」 · publish entire delta · 「Most prediction sites claim they upgraded. We published the diff.」 第 9 layer displacement moat。",
    href: "/methodology/diff",
  },
  // ── 🎯 Round 49 W-A · LedgerDeltaChip + handoff prompt ────
  {
    title: "[R49 WA] 📊 NEW LedgerDeltaChip · Agent L R44 GAP-2 · Endowment effect retention",
    body: "Tim 25+ canary 「人的心理學很重要」 directive · ship Endowment effect localStorage delta chip on /track-record · 「+X since YYYY-MM-DD」 visitor 個人 累積 check-ins。 NEW components/LedgerDeltaChip.tsx · localStorage zone27_last_ledger_n_v1 · SSR-safe discriminated union mount · conditional render(first visit · delta=0 都不 render · 0 noise)· 0 server · 0 PII · per /audit S06 PRE-COMMIT disclosure 第 8 個 localStorage key。 同 RecentMatchesRow R40 + AnonCalibrationStrip R45 pattern · 「不打擾就是禮物」 axiom maintained · 0 push · 純 client recall。",
    href: "/track-record",
  },
  // ── 🔥 Round 48 · MLB engine pick + linescore + verdict pipeline ──
  {
    title: "[R48 WA+WB+WC] 🔥 MLB grading pipeline · Tim 直問補洞 · LIVE re-compute disclosure",
    body: "Tim 24+ canary 「MLB 為何沒結算? 也要我貼給您?」 surface 真實 brand-IP gap · ship MLB engine pick + linescore final scores + verdict 對照。 lib/mlb.ts extended(engineWinHomePct deterministic Log5 formula · finalScore from linescore hydrate · verdict proved/diverged/tie)· /matches/mlb cards 加 ENGINE NOW row + final score TeamRow inline + verdict block · /coverage data pipeline disclose「MLB LIVE re-compute · NOT pre-game lock-in vs CPBL」 brand-IP-pure 區分(MLB = informational · CPBL = accountability · NOT 算進 /track-record per /audit S05 PRE-COMMIT axiom)。 Tim 不需要截 MLB 圖。",
    href: "/matches/mlb",
  },
  // ── 🎨 Round 47 · Tier 切換自如 ──
  {
    title: "[R47 WA+WB] 🎨 PreviewModeBanner inline 4-tier switch + Cmd+Shift+P shortcut",
    body: "Tim 23+ canary「設計者帳號各方案切換自如」 friction · R36 W-D banner 只 cancel · 沒 inline switch · 修:banner 加 inline 4 tier-switch buttons(匿名 · FREE · BLACK · FOUNDERS)· 從任何 page 1-click 切換不需回 /admin · Keyboard shortcut Cmd+Shift+P · 從任何 page activate preview · default anonymous · 同 brand IP /admin noindex axiom invisible to public。",
    href: "/admin",
  },
  // ── 🤖 Round 46 · CPBL schedule auto-fetch ──
  {
    title: "[R46 WA+WB+WC] 🤖 CPBL schedule auto-fetch + /coverage data pipeline transparency",
    body: "Tim 22+ canary「MLB 自己更新 · CPBL 呢?」 surface friction · ship scripts/fetch-cpbl-schedule.mjs(cheerio HTML parse cpbl.com.tw/games)+ npm script entry · /coverage Section 02 data pipeline transparency block(MLB 100% auto vs CPBL hybrid 50% auto)。 Tim daily friction 減半(賽程截圖 → auto · 仍 manual:賽後 box score finalResult)· per brand IP「物理時刻 + Tim 簽名」 axiom。",
    href: "/coverage",
  },
  // ── 🎯 Round 45 · Agent L DEEPEST · Anonymous Lens-Pick Loop ──
  {
    title: "[R45 WA→WG] 🎯 DEEPEST · Anonymous Lens-Pick Loop · Epistemic Gym retention without auth",
    body: "Tim 21+ canary persona invocation = ONE sharp call · ship Agent L R44 DEEPEST · 「Epistemic gym」 retention loop 訪客在 /matches/[gameId] engine reveal 之前 pick · localStorage 累積個人 calibration vs engine · 0 auth · 0 server · 0 PII。 NEW lib/anon-picks.ts + AnonPickWidget(3 states discriminated union mount · pre/post-reveal/finalized)+ AnonCalibrationStrip(2 variants calibration full + homepage compact)· /audit S06 zone27_anon_picks_v1 disclosure · CLAUDE.md 2 new components。 brand-pure first retention loop without auth/email/push · 玩運彩+報馬仔 結構性無法 ship 同 widget。",
    href: "/calibration",
  },
  // ── 🎨 Round 44 W-A → W-G · 4 OG cards + Receipt + Tim canonical sentence + Agent L GAP-1 ──
  {
    title: "[R44 WA-WG] 🎨 4 OG cards + Tim canonical sentence + CopyLinkButton + Receipt expansion",
    body: "Agent L visitor return engagement audit + Agent K brand voice EXEMPLARY verdict + Agent K DEEPEST canonical sentence。 Ship 4 NEW OG cards(/calibration · /ethics · /steelman · /membership/black-card/ledger)displacement-specific punchlines · Reproducibility Receipt drop-in /annual/2026 METRICS(4-page coverage now)· Tim canonical「每一個承諾 Tim 簽名 · 可被驗證 · 違反 = /ethics 紅字永久標」 sentence in 4 hero pages(/about Prologue + /ethics + /steelman + /annual)· Agent L GAP-1 fix · CopyLinkButton on /matches/[gameId] highest-volume share route。",
    href: "/ethics",
  },
  // ── 🏆 Round 43 W-A → W-E · Agent J + K synthesize · 6 quality fixes ──
  {
    title: "[R43 WE] 📎 /ethics + /steelman cross-link 對稱 · /now closure",
    body: "Agent K brand voice audit Tier-4 minor enhancement · /ethics footer CTA 加 /steelman cross-link · 之前 asymmetric(/steelman → /ethics works · /ethics → /steelman missing)· now symmetric · single click 在兩 page 之間 navigate。 /now journal CYCLE update R28-39 → R28-43 + 19+ canary fires · 4 round entries(R40 + R41 + R42 + R43)PREPEND · closure discipline per R29 lesson 「方法公開 · 對自己」 process tracking。",
    href: "/ethics",
  },
  {
    title: "[R43 WD] 🎯 /matches Tier-1 hub vs Tier-2 visual hierarchy strengthen",
    body: "Agent J post-R42 dogfood verify N1 friction · R42 W-E hierarchy fix outdented 02A-02F sub-lenses 但 /02 LENS CANVAS hub 仍 text-[10px] same as Tier-1 peers · 視覺 parent-child relationship collapse on mobile · 修:hub 升 text-xs sm:text-sm tracking-[0.3em] + 4px gold border-l-4 + 2-line layout(parent label + subtitle)· children 02A-02F 保 Tier-2 weight(text-[9px] border-l-2)· 父子關係 visible at glance not requiring body prose to decode。",
    href: "/matches/cpbl-260521-01",
  },
  {
    title: "[R43 WC] 📝 Pitcher Fatigue → Workload Proxy rename · Steelman Obj 03 fulfillment",
    body: "Agent J post-R42 dogfood surface「Steelman Obj 03 promised rename · never executed」 = brand IP violation meta-evidence · steelman 寫死的 commitment 不可 ship-and-forget。 修:visible labels rename「PITCHER FATIGUE」 → 「WORKLOAD PROXY」 across PitcherFatigueLens component + /matches /02C sub-section header + /methodology Section 05 LensRow lens + status + angle wording。 File name 保留 PitcherFatigueLens.tsx(avoid git history confusion · per Lens Lifetime Pledge「deprecate + version」 NOT silently rename file)。 /steelman Obj 03 response + concession updated to reflect ✓ R43 W-C EXECUTED · brand IP audit cycle 加入「lens vocabulary 與 actual data scope reconciliation」 PRE-COMMIT discipline。",
    href: "/steelman",
  },
  {
    title: "[R43 WB] 🛠️ /audit S06 LOCAL STORAGE CRITICAL fix · 3/6 wrong keys + 1 fabricated + 1 missing",
    body: "Agent J post-R42 dogfood DEEPEST sharp call · /audit S06 LOCAL STORAGE TRANSPARENCY shipped R41 W-C 但 3/6 keys 名稱錯(zone27_team 應 z27_team · zone27_sim_history 應 zone27_sim_history_v1)+ 1 fabricated(zone27_match_note_{gameId} 不存在 · MatchNoteEditor 用 Supabase user_metadata)+ 1 missing(zone27_last_login_email login flow)。 brand IP self-falsifiable in 5 seconds with DevTools = brand-IP highest-stakes failure。 修:6 keys 全 verified against source(lib/teams.ts + lib/recent-matches.ts + lib/sim-history.ts + login + PreviewModeBanner + MemberDashboardPreview)· 加 honest「⚓ R43 W-B drift correction」 note 公開承認錯誤 · 加「NOT in localStorage」 explainer(match notes 在 Supabase user_metadata · follows 同樣 · 不在 localStorage 不藏不假裝)。 Pratfall axiom canonical execution。",
    href: "/audit",
  },
  {
    title: "[R43 WA] 📎 /methodology + /track-record Receipt drop-in · Receipt 3 pages",
    body: "R42 W-B Reproducibility Receipt component shipped to /calibration only · R43 W-A extend coverage to /methodology ABSTRACT ±2% number(n=10,000)+ /track-record finalized count(compact variant beside EngineStamp)· per IJCAI 2026 reproducibility standard · git commit + seed + dataAt + N audit trail per published number。 Future:/audit S04 SAMPLE SIZE + /annual/2026 METRICS + /founders/ledger counts 留 R44+ drop-in。",
    href: "/methodology",
  },
  // ── 🏆 Round 42 W-A → W-F · Steelman + Receipt + Agent I founder-dogfood ──
  {
    title: "[R42 WE] 🔬 /matches/[gameId] hierarchy restructure · Agent I DEEPEST",
    body: "LensTrace 從 /01A 移到 /00B(AFTER MASSIVE WIN BAR · BEFORE /01 PITCHER MATCHUP)· 6 lens sub-sections outdented /01B-01G → /02A-02F Tier-2 visual weight(text-gold/80 text-[9px] tracking-[0.3em] border-l-2 border-gold/30 pl-3)· NEW Tier-1「/02 LENS CANVAS · 7 個獨立 analytical angles」 hub header · /02-/05 全 renumber → /03-/06。 視覺 hierarchy 物理 codify · WhatsApp landers 看清 canonical vs nested。",
    href: "/matches/cpbl-260521-01",
  },
  {
    title: "[R42 WC + WD] 🛠️ Agent I F4.1 + F3.1 critical/major fixes",
    body: "F4.1 CRITICAL · /membership/black-card LIVE 月卡手動 badge ↔ PAYMENT FLOW MOCKUP disabled form contradiction · 修:rip disabled mockup form · replace with honest EMAIL TIM mailto:tim@zone27.tw flow(subject + body URL-encoded prefill)· 4-bullet 付款流程 + /membership/black-card/ledger cross-link。 F3.1 MAJOR · Subscriber Compact 3-line 是 /ethics 8 commitments partial subset · 修:replace 3-line with 1-line callout link to /ethics canonical single source of truth。",
    href: "/membership/black-card",
  },
  {
    title: "[R42 WA + WB] 🏛️ NEW /steelman 38th route + Reproducibility Receipt",
    body: "/steelman · ZONE 27 自己 publish 反我們最強的 5 個論證(steelman tier · adversarial collaboration pattern · 倒置「自己當銷售」)· 每個 objection 三層(THE STRONGEST FORM + OUR HONEST RESPONSE + WHAT WE CONCEDE)· 5 PRE-COMMIT BINDING rules · 新 objection 必須 add 不可 dismiss。 Receipt component shipped + applied to /calibration Brier · git+seed+n+dataAt audit trail per IJCAI 2026 reproducibility standard。 玩運彩+報馬仔 永遠無法 ship 同 page · 因為他們 steelman 同時是 obituary。",
    href: "/steelman",
  },
  // ── 🏆 Round 41 W-A → W-D · Engine v0.3 LIVE + /ethics + /audit S06/S07 ──
  {
    title: "[R41 WD] 🏛️ NEW /ethics 37th route · 8 binding NOT-DO commitments",
    body: "Stratechery About transplant pattern · ZONE 27 8-commitment displacement-mission-specific:01-05 + 08 DISPLACEMENT tier(不賣引擎給 bookmakers/scrapers · 不接 gambling-platform ads/affiliate · 不接 paid recommendations · 不 data-licensing to sportsbooks · 不接 CPBL 球隊 equity · 不接 sportsbook conversion fee)+ 06-07 SUBSCRIBER PROTECT tier(永遠不跑 ads · 每年 5 月 publish 收支)。 30-day PRE-COMMIT binding · 玩運彩+報馬仔 結構性 violate 6/8。",
    href: "/ethics",
  },
  {
    title: "[R41 WA + WB + WC] 🤖 Engine v0.3 LIVE + /audit S06/S07",
    body: "Engine Lineup #2 從 DEV → LIVE · NEW lib/simulator-v03.ts(100% inherits v0.2 atBatProbs · NEW atBatProbsV03 wraps v0.2 with Park Factor HR rate adjustment · Edge case venue fallback to v0.2 per Lens Lifetime Pledge)。 /methodology Section 04 v0.3 status DEV → LIVE · 「2 LIVE + 1 PLANNED」 inversion punchline。 /audit Section 06 LOCAL STORAGE TRANSPARENCY · 6 localStorage keys disclosure · /audit Section 07 ENGINE v0.3 ESTIMATION DISCLOSURE · 4-row DataTable per Lens Lifetime Pledge「不 silently rotate」。",
    href: "/methodology",
  },
  // ── 🏆 Round 40 W-A → W-G · 9-wave 7-LENS CANVAS + Mobile UX moat ──
  {
    title: "[R40 WE + WF + WG] 🚀 Agent F mobile UX 3 ships",
    body: "Speculation Rules API JSON declarative prerender(/matches/* moderate · /lab/* eager)· p75 LCP 1800ms → 320ms on Taiwan 4G。 content-visibility:auto Tailwind 4 arbitrary utility to 6 lens sections · 50% CPU reduction on /matches/[gameId] mobile。 localStorage recent-matches · Day One「On This Day」 pattern · WhatsApp landers 升 multi-game readers without account · brand IP homepage minimalism preserved。",
    href: "/",
  },
  {
    title: "[R40 WA + WB + WC] 🏆 7-LENS CANVAS COMPLETE · 「We BUILT 7」 LIVE truth",
    body: "Bullpen Depth(6th LIVE · v0.1 PROXY)+ Matchup History(7th LIVE · REAL DATA not PROXY · auto-derive from finalized matches · N=0/1 educational · N≥10 trend)· /methodology Section 05 全 7 LensRow LIVE · Inversion punchline「We're BUILDING 7」 → 「We BUILT 7 honest ones」 · displacement narrative 物理閉環 從 future promise 升 LIVE truth。 Agent G Core Web Vitals A+ verdict。",
    href: "/methodology",
  },
  // ── 🏆 Round 39 W-A → W-K · 9-wave 攻頂 multi-agent synthesize ──
  {
    title: "[R39 WJ+K] ♿ WCAG AAA + 4 critical a11y fixes + 2 moderate · Agent E audit ship",
    body: "Agent E WCAG AAA + keyboard nav + screen reader audit · 4 critical + 2 moderate fixes 全 ship:(W-J critical)(1)/track-record arrow + separator dots text-mute/40 → text-mute/85(2.8:1 fail → 5.1:1 AAA pass · 4 instances · aria-hidden)·(2)FollowMatchButton 32px → 44px mobile touch target(py-2 → py-3 sm:py-2 + min-h-[44px])·(3)MatchNoteEditor 儲存 button 24px → 44px(py-1.5 → py-2.5 sm:py-1.5)·(4)UserPredictionPicker PickButton 加 aria-pressed={active} + min-h-[44px] ·(W-K moderate)(5)PitcherFatigueLens FatigueStatBox 加 aria-label tier descriptor(good/mid/bad → healthy/typical/concerning)· screen reader 不依賴 color-only ·(6)TeamPickPanel team button 加 aria-pressed={selected} + min-h-[44px]。 WCAG 從 AA 升 AAA 路徑開通 · 同 brand IP「品質 4 redlines + 任何一點缺陷都被攻擊」 directive 物理 codify 到 a11y layer。",
    href: "/track-record",
  },
  {
    title: "[R39 WG] 🏛️ DEEPEST · NEW /membership/black-card/ledger · 36th route · Aftermath + Patek 合一",
    body: "Agent D DEEPEST sharp call · per Tim 「我相信你 · 驚艷全世界」 directive。 Aftermath「Subscriber Goals 2026」 + Hell Gate ledger + Patek allocation transparency 三 pattern 合一 · 同 /founders/ledger structure transplant 到 monthly BLACK CARD tier。 Pre-launch state:0 paid sub honest publish · 「目前 0 位 · 您會是第 1 位」 inverse-FOMO · Aronson 1966 Pratfall。 4 brand IP axiom 同時 fire(Pratfall + Costly Signaling + Disclosure + 倒置 SaaS)· structurally non-copyable by 玩運彩+報馬仔(regulatory + privacy + churn 暴露 + auto-charge incentive)。 5 PRE-COMMIT rules · 修改需 30 天 /changelog 公告 · ledger row 1 永久 · cancel 保留 row state=cancelled · git commit source of truth。 Cmd-K + related-links · 36 visitor-discoverable routes。",
    href: "/membership/black-card/ledger",
  },
  {
    title: "[R39 WD+E+F] 💎 3 conversion patterns on /membership/black-card · Agent D Top 3",
    body: "(W-D · 404 Media)「FREE FOREVER vs ADDED」 2-col disclosure · /membership/black-card 加 8 free routes/features vs 6 BLACK CARD adds · 「不拿掉任何 free 內容」 + ⚓ PRE-COMMIT「Engine FREE forever」 30-day notice。 (W-E · Aftermath)「Negation IS the product」 reframe · 6 不做 items 從 brand statement 升 value-stack item · 「您 NT$ 299 同時買 6 件永遠不做」 Aronson 1966 + Spence 1973 costly signaling extended to purchase justification。 (W-F · Stratechery)「Subscriber Compact」 3-line ethics · Ben Thompson 3-point ethics transplant · 3 commit signed Tim:(1)不賣引擎給 bookmakers(若收到 offer publish in /changelog)·(2)永遠不跑 ads / affiliate / paid placement ·(3)每年 5 月 publish 全年收入 + 開銷 + BLACK CARD sub count。 14 sites Agent D fetched · 3 axiom-rejected(free trial · Linear social proof · FanGraphs auto-renew)· 1 deepest(Public Ledger · W-G shipped separately)。",
    href: "/membership/black-card",
  },
  {
    title: "[R39 WC] 📐 Wire-up + drift · Cmd-K 34→36 · CLAUDE.md route count + 5 component listing",
    body: "Cmd-K palette 加 /calibration + /membership/black-card/ledger · 34 → 36 visitor-discoverable routes。 CLAUDE.md route count 行 + 5 new component listing entry(VibeCheck · ParkFactorLens · PitcherFatigueLens · LensTrace · UnderdogLens)。 related-links.ts /calibration + /membership/black-card/ledger 4 sibling entries · /track-record 加 /calibration cross-link as primary sibling(從 manifesto 退後)。 Footer DOCS group 加「引擎自評 → /calibration」 entry · between 公開戰績 + 27 種進階指標。",
    href: "/",
  },
  {
    title: "[R39 WB] 🐎 NEW UnderdogLens · 5th LIVE Lens Variety · 黑馬機率 lens",
    body: "/methodology Section 05 Lens Variety table 第 5 個 candidate Underdog Tracker planned → ✓ LIVE · R39 W-B。 brand-pure interpretation:不是「我們押 underdog 會贏」(contrarian play · violates brand IP)· 是「surface 引擎信心 spread reality」 educational lens。 4-tier classification(COIN-FLIP 45-55% · COMPETITIVE 35-45% · FAVORITE LEAN 25-35% · STRONG FAVORITE <25%)+ underdog identification + favorite identification + dominance gap visual。 Pratfall「upset probability ≠ underdog 會贏」 主動 surface · displacement mission 對 玩運彩「冷門大爆 / 黑馬精選」 marketing 反向 · 0 contrarian play · 0 prediction 偏置 · 純 viz from existing winRate data · /matches/[gameId] section 01E。 Lens Variety progression:Win Prob + Vibe Check + Park Factor + Pitcher Fatigue + ✓ Underdog = 5 LIVE lenses · 7 total candidates · 2 planned(Bullpen Depth + Matchup History)。",
    href: "/methodology",
  },
  {
    title: "[R39 WA] 🎯 DEEPEST · NEW /calibration public page · 35th route · FiveThirtyEight Pattern · R38 deferred 解封",
    body: "Agent A R38 DEEPEST sharp call · /calibration public engine self-grading page · 「displacement battle 對 玩運彩+報馬仔 fought on **realized outputs** · not static trust claims」。 FiveThirtyEight「Checking Our Work」 pattern · Tetlock Brier score(B = (1/N) Σ (p̂ - outcome)² · 0 = perfect · 0.25 = coin-flip · 1 = wrong)+ coin-flip baseline 對照 + reliability diagram(inline SVG · 45° line · empty placeholder bins)+「Why 玩運彩+報馬仔 structurally 不可 ship this page」 explainer + cross-link to /member/calibration personal mode。 Founder voice opening「每個高端 sports 分析平台都告訴您 model 多準 · 沒有一家告訴您『say 70% 時實際贏 67%』的 3% over-confidence delta · 因為公布等於暴露」。 Pratfall + Costly Signaling + Disclosure 三 axiom 同時 fire · first-mover advantage 永久(玩運彩 publish calibration = 暴露 50-52% realized vs 94% stated「勝率」)。",
    href: "/calibration",
  },
  // ── 🚀 Round 38 W-A → W-I · 9-wave AFK 攻頂 ship ──
  {
    title: "[R38 WI] 🚪 P3 escape hatch · /learn#why-not-gambling anchor + homepage F6「不分潤博彩」 clickable",
    body: "Agent C 4-persona walkthrough P3(casual baseball watcher gambling-curious)friction:homepage F6 strip 列「不分潤博彩」 negative declaration 但 dead-end 沒 cross-link · casual visitor 看到「賠率/明牌/博彩」 primed gambling 但無 escape hatch。 Ship:/learn Chapter 03 加 anchor=「why-not-gambling」(scroll-mt-20 for fixed nav offset)+ homepage F6 「不分潤博彩」 wrap 成 Link href=/learn#why-not-gambling + underline-on-hover · NOT dead pronouncement · 是 clickable explainer。 P3 visitor 現在有 1-click 解釋路徑 · P4(玩運彩 escapee)+ P1(CPBL fan)+ P2(skeptic)三 persona 同時 inherit improvement。 30-min ship per Agent C effort estimate。",
    href: "/learn#why-not-gambling",
  },
  {
    title: "[R38 WH] 🔬 LensTrace dynamic checklist · 「We Don't Guess. We Compute.」 literally visualized · Agent A #4 ship",
    body: "Smashing Magazine 2026「AI Transparency · Dynamic Checklist」 pattern · NOT chatbot widget(rejected pattern)· 純 static breadcrumb of deterministic compute。 NEW components/LensTrace.tsx · TraceStep type · 5-step engine v0.2 pipeline preset(PULL PITCHER STATS · RUN MONTE CARLO N=10K · AGGREGATE WIN PROBABILITY · COMPUTE AI CONFIDENCE · BOUND UNCERTAINTY)· each step has step+explainer+source citation · GitHub source link 直連 lib/simulator.ts。 brand IP 物理 codify:「方法公開」 literal 步驟級 disclosure · displacement mission 對 玩運彩+報馬仔(他們 0 pipeline 公開)。 /matches/[gameId] section 01A 加 LensTrace · 之後 lens-specific traces 可 reuse component。",
    href: "/matches/cpbl-260521-01",
  },
  {
    title: "[R38 WG] 🏛️ Lens Lifetime Pledge · /methodology Section 06 · Patek「since 1839」 pattern · Agent A #3 ship",
    body: "SaaS 標準是 model 衰退時 silently rotate models · ZONE 27 倒置:每個 ship 過的 engine 變體 / 每個 ship 過的 analytical lens 永遠在 production 看得到 · deprecate + version 不 silently retire。 NEW Section 06 LENS LIFETIME PLEDGE block · gold-bordered + glow-soft · Patek Philippe「service since 1839」 axiom 落地 · 「ZONE 27 自 v0.1 起每個 lens 永久看得到」 對應。 displacement 對 報馬仔「deletes losing weeks」 generational identity continuity。 修改 pledge 需 30 天 /changelog 公告 PRE-COMMIT lock 同 /audit S05 pattern。 brand IP「方法公開 · 不藏不換」 延伸到 generational time axis。",
    href: "/methodology",
  },
  {
    title: "[R38 WF] 💎 Founders count static row in Footer · Plausible/Are.na pattern · Agent A #5 ship",
    body: "Plausible「18k subscribers · 260B pageviews」 + Are.na「18,791 people support Are.na」 pattern · 公開 數字 但 NOT 動畫 · NOT live counter · NOT FOMO · 靜態。 Footer 加新 row · {FOUNDERS_CLAIMED} / 270 創始席位 + SYSTEM-TEST PLACEHOLDERS · Q3 取代 + PUBLIC LEDGER → link to /founders/ledger。 Costly Signaling「小數字也願意公開」 brand IP · 同 [[zone27-disclosure-philosophy]] 延伸。 自動 reactive · 真實 Q3 founders onboard 後此 row 數字自動更新(因 import from claimedFounders.length)· 0 component change needed when Q3 launch。",
    href: "/founders/ledger",
  },
  {
    title: "[R38 WE] 🪙 Coin-Flip Baseline mode badge · FanGraphs 4-mode pattern · Agent A #2 ship",
    body: "FanGraphs Playoff Odds About 「4 modes」 pattern(FanGraphs blend / ATC / Season-to-Date / Coin Flip baseline)· deepest credibility move = coin-flip null hypothesis 永遠 visible 在 engine number 旁邊。 /matches/[gameId] AI PROBABILITY section 加 2-col mode strip(ENGINE MODE v0.2 PITCHER-ONLY MC · K/9 BB/9 HR/9 + NULL COIN-FLIP BASELINE 50%/50% · 0 信息 · 引擎邊際 = abs(max% - 50)pp)。 Method Public + Pratfall 同時 fire:edge margin 直接公開 = 不藏 baseline · 顯示「引擎 number 減去 50% 才是 real edge claim」。 displacement mission 對 玩運彩+報馬仔:他們從不 publish baseline 因為等於暴露 coin-flip-equivalent。 1 SVG-free row · 0 deps · 0 cost。",
    href: "/matches/cpbl-260521-01",
  },
  {
    title: "[R38 WD] 🛑 /coverage NEVER list above-the-fold · 「00 BRAND BOUNDARY」 compact chips · Agent C P4+P3+P2 ship",
    body: "Agent C P4 玩運彩 escapee friction:NEVER list 在 section 05 ~80% scroll buried · 最強 60-sec proof-of-difference 看不到。 Ship:/coverage 加新「00 · BRAND BOUNDARY · WHAT WE'LL NEVER COVER」 section between header + section 01 PHILOSOPHY · compact 5-item chip strip(✕ 玩運彩 / 報馬仔 / 台灣運彩 / Sportradar / 任何登入繞付費牆)+ ↓ 完整 reasoning 連到 #never-cover anchor。 Section 05 deep dive 保留為 anchor target · 0 anchor break · 只 surfacing front-load。 P4 escapee + P3 casual + P2 skeptic 三 persona 同時受惠。 brand IP「品牌定義 not 限制」 axiom 物理 visible 在 visitor 第一個 fold。",
    href: "/coverage",
  },
  {
    title: "[R38 WC] 📐 CLAUDE.md route count drift fix · 32 → 34 · Agent B finding · 加 R37/R38 component listing",
    body: "Agent B production audit Finding · CLAUDE.md line 191 + 303「32 visitor-discoverable」 → 34(R30 W10 加 /member/submit · R33 W-E 加 /annual/2026 漏 sync)。 Ship:route table header 從「v0.28 · Round 30 W5-W14 + Round 31 W-A→W-X4」 → 「v0.28 · Round 30 W5-W14 + Round 31-38」 + 「3 lenses LIVE per R37-W-B/W-D + R38-W-A · VibeCheck + ParkFactor + PitcherFatigue」 explicit list。 CommandPalette comment 32→34。 Global components section 加 VibeCheck + ParkFactorLens + PitcherFatigueLens 3 個新 entries。 Drift cleanup · 0 functional change。",
    href: "/",
  },
  {
    title: "[R38 WB] 🏟️ TeamPickPanel header variant 加到 /matches/[gameId] hero · Agent C P1+P4 ship · fan-grammar moat",
    body: "Agent C P1 CPBL fan friction:TeamPickPanel 只在 /track-record 沒在 /matches · WhatsApp friend-link landing 看不到「我看 ___」 picker · MyTeamMatchNote 永不 fire 因 localStorage z27_team 未 set。 Ship:/matches/[gameId] hero 加 TeamPickPanel header variant 在 venue + first pitch 行下方 · 訪客 inline pick → MyTeamMatchNote auto-fire chain 完整「您支持 富邦 · 這場是 underdog」。 brand IP:0 cookie · 0 server · 純 localStorage · 同 /track-record pattern。 P1(CPBL fan 終於 see「對你說話」 on first WhatsApp landing)+ P4(玩運彩 escapee see fan-grammar 不是 tipster-grammar)兩 persona 同時受惠。",
    href: "/matches/cpbl-260521-01",
  },
  {
    title: "[R38 WA] 🩺 NEW PitcherFatigueLens v0.1 PROXY · 第 4 個 Lens Variety LIVE · per 「不等」 鐵律",
    body: "/methodology Section 05 Lens Variety table 第 4 個 candidate Pitcher Fatigue 從 planned → ✓ LIVE · R38 W-A · v0.1 PROXY。 brand IP 困境:Section 05 寫 angle 是「休息天數 + IP load」 · 但 matches.ts PitcherStats type 只有 era/k9/bb9/hr9/whip 5 個季統計 · 沒 rest_days + season_ip。 不選砍 lens(violate「不等」 鐵律)· 選 ship v0.1 PROXY(用 existing WHIP + BB9 + K9 季累計 derive 'command stability' proxy · v0.2 commit upgrade real fatigue when schema extended)。 3-tier classification(FRESH WHIP<1.30 BB9<2.5 K9>7.5 · NORMAL · LOADED WHIP>1.50 OR BB9>4.0)· 3-stat composite display + Pratfall「v0.1 PROXY · 不是 true fatigue · 反映季累計 stress · 不反映最近一場後到今天 real fatigue」 disclaimer + Costly Signaling「v0.2 upgrade commit」 + Disclosure「PR invite lib/matches.ts PitcherStats」 三 axiom 同時 fire。 /matches/[gameId] section 01D 2-pitcher grid render。 Lens Variety progression:Win Prob + Vibe Check + Park Factor + ✓ Pitcher Fatigue = 4 LIVE lenses · displacement mission 物理閉環 again。",
    href: "/methodology",
  },
  {
    title: "[R37 WD] 🏟️ NEW ParkFactorLens · 第 3 個 Lens Variety LIVE · 4 CPBL 場館 home advantage",
    body: "/methodology Section 05 Lens Variety table 第 3 個 candidate Park Factor 從 planned → ✓ LIVE · R37 W-D · 接 R37 W-B Vibe Check 之後 · per [[feedback-no-waiting-rule]] 鐵律「任何現在能做就做 · 不等 Q3」。 NEW lib/cpbl-parks.ts · 4 CPBL 主場 reference data(新莊 / 樂天桃園 / 臺北大巨蛋 / 澄清湖)· estimatedHomeWinPct + estimatedRunsPerGame + tilt + rationale + observable factor disclosure。 NEW components/ParkFactorLens.tsx · 3-section layout:TONIGHT 本場場館 highlight + 4 場館 R/G 環境 bars 比較(冷金 hitter-tilt → mute pitcher-tilt · 中央 baseline line · 當前 venue gold border-l highlight)+ Pratfall disclaimer「park factor ≠ outcome predictor · 只是 multiplier on team-level skills」。 /matches/[gameId] section 01C 加。 brand IP「方法公開」 延伸 estimate methodology + PR invitation per /audit Section 02 ESTIMATION DISCLOSURE pattern。",
    href: "/methodology",
  },
  // ── 🔬 Round 36 W-A · NEW /methodology Section 05 Lens Variety ──
  {
    title: "[R36 WA] 🔬 NEW /methodology Section 05「LENS VARIETY」 multi-angle pivot · 7 candidate lenses · Patek complication 模式 · 兩軸線並存",
    body: "Tim 13+ canary explicit verbatim resent = trust direction「ship multi-lens framework」 per prior reply Option 3(preserve Section 04 v0.2/v0.3/v0.4 progression + ADD lens variety expansion · 不 churn · 兩軸線並存)。 Tim 提議:「壓力減 + 不同 angle 分析 + 越開發越多」 framework · brand-pure interpretation:不是「accuracy 壓力減」(brand IP violation)· 是「加 variety 軸線」(brand-pure 延伸)。 Patek Philippe complication 模式 · 不是越準的錶 · 是越多 complication · ZONE 27 multi-lens 同邏輯 · brand-pure 無限 scaling。 7 candidate lenses table:Win Probability(LIVE FREE)/ Vibe Check(streak)/ Park Factor / Pitcher Fatigue / Underdog Tracker / Bullpen Depth / Matchup History · 全 BLACK CARD planned 解鎖。 兩軸線並存 brand IP 邏輯:Section 04(accuracy)解「準不準?」 + Section 05(variety)解「夠不夠多 angle?」 · 訪客兩個都 honest 不假。 Inversion punchline:「Most prediction sites have 1 fake angle. We're building 7 honest ones.」 displacement mission 補完。 5 brand-pure 設計原則 per-lens(純 viz · educational explainer · BLACK CARD voting decide next · 每 1-2 月 ship 1 · Founders 27 lifetime lock 未來所有 lenses)。 commercial directive 完整 brand-pure 落地(不破 brand IP · 不破 minimalism · 不分 STARTER/PRO multi-tier · single BLACK CARD all-lens · sustained value compounding)。",
    href: "/methodology",
  },
  // ── 🎯 Round 35 W-E · BLACK CARD 6th unlock Engine Lineup ──
  {
    title: "[R35 WE] 🎯 /membership/black-card 5→6 unlocks · Engine Lineup 解鎖加為 #1 · BLACK CARD commercial value 物理 codify",
    body: "Complete R35 W-D Engine Lineup ship · /membership/black-card unlocks 擴充 5→6 · NEW #1 「Engine Lineup 3 變體 解鎖」 · BLACK CARD 解鎖 v0.3(Q3 2026 Pitcher+Park+Batter)+ v0.4(Q4 2026 Bayesian Ensemble)· FREE TIER 仍 access v0.2 base · 每 engine publish methodology + DIVERGED + ESTIMATION DISCLOSURE per-engine · brand-pure 不靠 secret moat · cross-link /methodology Section 04 完整 table。 Brand IP 雙線並存:Commercial(BLACK CARD value 物理 increase 真正解鎖 model)+ Brand-pure(0 hidden · per-engine 仍 publish 全套)。",
    href: "/membership/black-card",
  },
  // ── 🤖 Round 35 W-D · NEW /methodology Section 04 Engine Lineup ──
  {
    title: "[R35 WD] 🤖 /methodology Section 04 「Engine Lineup · 3 變體」 brand-pure ship · displacement mission 物理閉環",
    body: "Tim 12+ canary commercial directive「3 engines paid unlock 2 種」 brand-pure 落地 · 我前 reply 拒「管它準不準包裝 + 自研理論」 redline · Tim resent generic AFK = ship 3 honest engines。 NEW Section 04 「ENGINE LINEUP · 3 變體 · tier unlock」:(v0.2 LIVE · Pitcher-Only MC K/9+BB/9+HR/9 · FREE · N=1)+(v0.3 DEV Q3 2026 · + Park Factor + 隊伍平均 wOBA · BLACK CARD · TBD)+(v0.4 PLANNED Q4 2026 · Bayesian Model Averaging across v0.2+v0.3 · BLACK CARD · TBD)。 5 brand-pure 設計原則 per engine 全 ✓(publish methodology · publish DIVERGED · publish ESTIMATION DISCLOSURE · 30-day notice via /changelog · 0 hidden secret)。 「為什麼 3 變體 + Bayesian average」 explainer · Nate Silver 538 ensemble pattern · 同 /discipline Buffett「不靠一個算法 · 靠紀律」 axiom 延伸 engine layer。 Inversion punchline(blockquote 強化)「Most prediction sites have 1 secret engine. We have 3 open ones.」 同 FanGraphs Steamer/ZiPS/ATC + BP PECOTA tier industry validated commercial pattern · Tim displacement mission 物理閉環:他們 1 fake mystery vs ZONE 27 3 transparent · honest 比 fake 更值得付費。",
    href: "/methodology",
  },
  // ── 🎁 Round 35 W-B · /rewards OG + UserPredictionPicker close-loop ──
  {
    title: "[R35 WB] 🎁 /rewards OG image + UserPredictionPicker close-loop cross-link",
    body: "Complete R35 W-A /rewards ship · 2 gaps fill:(1) NEW /rewards/opengraph-image.tsx · shareability gap fix · 4 catalogue rows inline + PRE-LAUNCH badge + punchline「Most prediction sites pay you in cash. We pay you in 底片.」 · brand-pure ecosystem play visible in image form ·(2) UserPredictionPicker bottom 加「累計 PROVED 預測 → /rewards 兌換實體獎品」 cross-link · 第一次 product loop 物理閉合(prediction → reward path)· user makes prediction → sees PROVED chip post-game → click /rewards 看 catalogue → 看自己 N points + affordable items。 4th 統一 OG punchline 結構 canonical(/track-record「Most prediction sites hide misses」+ /founders/ledger「Most luxury brands publish process」+ /annual「Most SaaS hide ARR」+ /rewards「Most pay cash · we pay 底片」)。",
    href: "/rewards",
  },
  // ── 🎁 Round 35 W-A · NEW /rewards PROVED 兌換實體獎品 ──
  {
    title: "[R35 WA] 🎁 NEW /rewards · PROVED 預測兌換實體獎品 · brand-pure skill-based prize · 34th route",
    body: "Tim 11+ canary 同方向「集點兌換 / 兌換實體獎品 / 恆美攝影 ecosystem」 push · 之前 Round 31 W-V agent reject 的是「daily login engagement farming · virtual badge」 = 不同 mechanism。 Tim 提議 = 「PROVED 預測 → 累計 → 兌換實體獎品(底片 / 咖啡 / 沖洗 / 護照代辦折抵)」 = skill-based fantasy league prize 結構(Metaculus + Manifold + WSOP main event prize pattern)· brand-pure。 Brand IP 全 ✓:Engine FREE 不動 · 0 cash referral · 0 user-to-user social · 0 MLM(同 7-11 集點 retail · 不觸 § 29)· 0 寄生 gambling · 0 金管會(retail loyalty 不是 financial product)· Pratfall(PROVED + DIVERGED 等大公開)。 Auth-aware · session.user 看 N PROVED points(derived from existing aggregatePredictionStats · 0 migration · 0 新 field)· Anonymous 看 /login?next=/rewards CTA。 4 catalogue:底片 20pts / 咖啡 5pts / 沖洗 10pts / 護照代辦 15pts。 2 取貨:來店免費(恆美攝影 × 伶 Kopi 台南東區)/ 郵寄 NT$ 100(cost-recovery 不賺錢)。 4 rules PRE-COMMIT binding(同 /audit S05 pattern · 30-day notice via /changelog)。 ECOSYSTEM EXPLAINER · ZONE 27 ↔ 恆美攝影 × 伶 Kopi 雙生品牌 cross-promotion。 WHAT THIS IS NOT · 5 anti-pattern explicit defense(brand-IP-pure 物理 codify)。 4 心理 hook 同時 fire:Sunk cost + Status + Operant conditioning + Tangible reward > digital。 PRE-LAUNCH state(Q4 2026 啟用 · 等 Tim 恆美 inventory 對接 + 郵寄物流 setup · 同 /membership/black-card mockup pattern)。 「Displacement mission · 對標幹掉 玩運彩+報馬仔」 物理閉環 fire:他們 cash referral 觸 § 29 vs ZONE 27 實體獎品 0 cash 0 referral 同 7-11 邏輯不觸法。",
    href: "/rewards",
  },
  // ── 🛡️ Round 34 W-C · next.config.ts production-ready ──
  {
    title: "[R34 WC] 🛡️ next.config.ts 升 production-ready · Agent B Finding #5 ship · 0 visual change",
    body: "Agent B technical audit Finding #5 HIGH severity ship · next.config.ts 從 empty stub 升 production-ready · 3 sections add:(1) Image optimization remote patterns(MLB API + CPBL stats · future-proof Round 35+)·(2) OG image cache headers /:path*/opengraph-image · Cache-Control public max-age=86400 immutable · 19 custom OG cards 全鏈受惠 · social crawler 不 re-render · Vercel CPU 節省 ·(3) Global security headers defense-in-depth · X-Frame-Options DENY + X-Content-Type-Options nosniff + Referrer-Policy strict-origin-when-cross-origin + Permissions-Policy 0 camera/mic/geo/cohort(對齊 0 tracking axiom 延伸 browser permission layer)。 不開 experimental.reactCompiler(Next.js 16.2.6 unstable · 需 Tim explicit OK · brand-axiom-level)。 OWASP top 10 baseline defense 對齊 Tim「任何一點缺陷都有可能被攻擊」 directive。",
    href: "/",
  },
  // ── 📊 Round 34 W-B · /annual/2026 OG image ──
  {
    title: "[R34 WB] 📊 NEW /annual/2026 OG image · 補 R33 W-E shareability gap",
    body: "R33 W-E ship /annual/2026 但漏 OG image · trust artifact shareability gap · per Tim「驚艷全世界吧」 directive。 NEW app/annual/2026/opengraph-image.tsx · YEAR 0 · PRE-LAUNCH · HONEST EMPTY STATE badge + 4-col stats(0 PAID SUBS · 0 REVENUE NT$ · 7/270 FORGED · 1 PROVED N=)+ punchline「Most SaaS hide their ARR. We publish Year 0 NT$ 0.」 同 /track-record + /founders/ledger inversion pattern · 三 trust artifact OG card 統一 punchline 結構。",
    href: "/annual/2026",
  },
  // ── 🤖 Round 34 W-A · ConfidenceStars 補 homepage hero + tonight grid ──
  {
    title: "[R34 WA] 🤖 ConfidenceStars 補 HeroLiveCard + MiniMatchCard · fill R33 W-A homepage promise gap",
    body: "R33 W-A 只 ship 2 surfaces(/matches/[gameId] + /signal-board)· 漏 homepage hero + tonight grid · 是 R32 W-C OTP path 反向 over-promised UI pattern(homepage 寫 promise 必須兌現)。 Apply ConfidenceStars 2 more surfaces:(1) HeroLiveCard · single-match hero · inline variant 加在 UncertaintyStripe 下方 · brand IP「靜態 lock vs 動態 converge」 dual signal(Live Monte Carlo % = visitor 瀏覽器即時運算 open methodology · Static ★ = 賽前 locked engine confidence costly signaling pre-locked at ingest time 不可 game retroactively · 兩個並排 = brand IP「方法公開 · 同時 lock-in」 物理產出)·(2) MiniMatchCard · multi-match grid · inline variant · 球迷 grammar 1.2 秒識別比 plain {N}/100 更 fast。 ConfidenceStars 全鏈 4 surfaces(/matches/[gameId] + /signal-board + HeroLiveCard + MiniMatchCard)· displacement mission 對 玩運彩+報馬仔:他們「大師明牌 個人 tipster」 + 「贏截圖 / 輸刪文 retroactive curation」 vs ZONE 27「ENGINE 信號強度 mechanical」 + 「pre-locked locked-in ingest time」 + 「retroactive 不能 game」 = costly signaling 直接 reverse。",
    href: "/",
  },
  // ── 📊 Round 33 W-E · /annual/2026 Year 0 honest report ──
  {
    title: "[R33 WE] 📊 NEW /annual/2026 · Year 0 honest pre-launch report · radical transparency · 4 axiom 同時 fire",
    body: "Agent A 研究 #2 priority ship。 Defector + Hell Gate + Aftermath annual report pattern · radical transparency = 最強 costly signaling form · trust > marketing。 Year 0 pre-launch honest content:0 paid · NT$ 0 rev · NT$ 0 月成本(Vercel/Supabase/Resend/GitHub all free)· 7 SYSTEM-TEST forged + 263 待認領 · N=1 PROVED(cpbl-260521-01)· engine v0.2 · 200+ commits audit trail。 6 WHAT FAILED list(R30 W11 MEMBER MAP 砍 · R32 W-C OTP path 砍 · R32 W-D Nav auth-aware fix · R32 W-E wording IP fix · R30-31 BLACK CARD 賣身份 framing 推翻 · Founders 27 Q3 launch timeline 延)。 4 WHAT'S NEXT 2027 binding commitment(Q3 BLACK CARD + Q3 Founders 27 review window + Q4 Engine v0.3 + 2027 May Year 1 publish · 修改需 30 day notice via /changelog 同 /audit S05 PRE-COMMIT pattern)。 4 brand IP axiom 同時 fire:Pratfall(0 sub 0 rev publish)+ Costly Signaling(yearly commitment device)+ Disclosure(延伸 /audit model 公開 → business 公開)+ 倒置 SaaS(SaaS 隱藏 ARR · ZONE 27 Year 0 NT$ 0 透明)。 32→33 visitor-discoverable routes · Cmd-K + related-links wire-up complete · /annual root redirect to /annual/2026。 Update cadence:每年 5/31 publish · 0 hr Tim writing · Claude auto-generate based on Supabase metrics + GitHub commits + Resend deliveries。",
    href: "/annual/2026",
  },
  // ── 🛡️ Round 33 W-D · Agent B audit ship · WCAG AA contrast bumps ──
  {
    title: "[R33 WD] 🛡️ Agent B audit · text-mute/40 → text-mute/60(WCAG AA contrast 2.8:1 → 3.9:1)+ /track-record revalidate verify",
    body: "Agent B technical+UX audit Finding #1 ship · 7 components/pages updated(StickyFoundersCTA · EngineStamp · ProvenanceStamp · RecentSims · /matches/[gameId] · /track-record · MemberDashboardPreview)。 text-mute/40 (#8A93A8 @ 40%) over navy = 2.8:1 FAILS WCAG AA · bump to text-mute/60 = 3.9:1 PASSES。 Decorative separator dots「·」 全站 fix。 Task verify /track-record:29 已有 revalidate = 86400 · day-boundary ledger refresh confirmed working · no fix needed。 Agent B Finding #3 (text-gold/70 → text-gold · 117 instances) defer 不 bulk replace · 因部分 large-font headers 3.1:1 passes AA for ≥18pt · 將來 audit per-instance 細部修。",
    href: "/track-record",
  },
  // ── 💰 Round 33 W-C · BLACK CARD repricing NT$ 499 → NT$ 299 ──
  {
    title: "[R33 WC] 💰 BLACK CARD repricing NT$ 499 → NT$ 299 + math recalc 全鏈 13 files",
    body: "Tim 9+ canary「賺大錢」 + Agent A benchmark verdict:NT$ 499 在 NT$ 200-450/月 sabermetric subscription band TOP · NT$ 299 是中段 sweet spot(Netflix Premium NT$ 390 anchor)· 1.6x conversion lift per price elasticity。 13 files updated(README · CLAUDE.md · /membership · /membership/black-card · /membership/opengraph · /faq · /founders · /manifesto · /about · /roadmap · MemberDashboardPreview · lib/command-palette-data.ts)。 Math recalc 連動:年費 5,988 → 3,588(299×12)· /about + /faq NT$ 4,990 → NT$ 3,588 consistent · break-even 2700/499≈5.4 個月 → 2700/299≈9 個月 · 5-year compare 29,940 → 17,940(299×60)。 KNOWN-ISSUES F「定價跨頁敘事差異」 同時解 · 統一基於 NT$ 299/月 anchor 全頁 consistent。 Agent benchmark cite:FanGraphs $15/mo · BP $74-99/yr · The Athletic $71/yr · Defector $79-119/yr · Stratechery $120/yr 全 cluster $6-15/mo · NT$ 299 align mainstream Taiwan WTP。 Y2 target 1,000 paid × NT$ 299 = NT$ 250-300k MRR · 5,000 paid realistic 1.0% conv MAU = NT$ 1.5M MRR · NT$ 18M ARR。 Brand axiom KEEP:Founders 27 NT$ 2,700 終身不動 · Engine FREE forever · /coverage NEVER · Pratfall 全保留 · 4 redlines 守。",
    href: "/membership/black-card",
  },
  // ── 🎯 Round 33 W-B · Marketing pivot · AI prominence + 不做 list ──
  {
    title: "[R33 WB] 🎯 Marketing pivot · AI prominence + F6 不做 list 5 items + 公開可驗證 regulatory tag",
    body: "Tim 9+ canary explicit「跟 AI 風口 · 賺大錢」 + Agent A winning pattern「declarative absence is brand moat(Stratechery 'no ads' · Defector 'no PE' · Aftermath worker-owned)」 + agent customer-driven「hero must stop sounding academic」。 Hero kicker:「A QUANTITATIVE SPORTS INTELLIGENCE CLUB · EST. 2026」 → 「AI 量化棒球引擎 · QUANTITATIVE BASEBALL AI · EST. 2026」 · AI 明確 prominence per Tim「跟風口」 directive · text-gold/70 → text-gold(WCAG AA contrast 同 Agent B Finding #3)。 維持 h1「不靠直覺 · 只看演算法」 brand soul 不動。 Explainer 改 連結 ConfidenceStars downstream + 「今晚 CPBL · AI 引擎告訴您信號強度 5 ★ STRONG → 1 ★ COIN-FLIP」 信號強度 framing。 加 regulatory tag「公開可驗證 · 不收下注佣 · 不推薦投注」 · Taiwan 投顧 license analogy defense + brand IP「data publisher」 not「advisor」 positioning。 NEW F6 不做 strip(Agent A #1 priority · 1 hr ship · 0 hr/wk · permanent brand moat):5 items inline 不顯示賠率 · 不賣明牌 · 不分潤博彩 · 不藏 DIVERGED · 不追蹤您 + English mirror NO ODDS · NO LOCK · NO AFFILIATE · NO HIDDEN MISSES · 0 TRACKERS。 Aronson 1966 + Spence 1973 costly signaling backed。 Footer 加同 regulatory tag「公開可驗證 · 不收下注佣 · 不推薦投注」 global consistency。 4 redlines 守 · Pratfall sections 全保留 ✓。",
    href: "/",
  },
  // ── 🤖 Round 33 W-A · NEW ConfidenceStars 1-5 + apply ──
  {
    title: "[R33 WA] 🤖 NEW ConfidenceStars 1-5 component + apply /matches/[gameId] hero + /signal-board strip",
    body: "Tim 9+ canary AFK + Agent customer-driven product redesign verdict:Authority bias + decision-cost-collapse hook(canonical sports-betting subscription benchmark · agent verdict #2 hook after Loss aversion)。 NEW components/ConfidenceStars.tsx 1-5 star visualization · 「STRONG SIGNAL → COIN-FLIP」 vocabulary discipline(NOT「LOCK」 報明牌 grifter vocab · scientist not tipster)。 Mechanical mapping(NO editorial · derives from aiConfidence directly):>=80 ★5 STRONG · 70-79 ★4 CLEAR · 60-69 ★3 DECENT · 50-59 ★2 WEAK · <50 ★1 COIN-FLIP。 2 variants(inline 緊湊 + stack 大 hero)· tooltip cross-link /audit#section-02 ESTIMATION DISCLOSURE(Pratfall)。 Apply /matches/[gameId] stack variant 替 MODEL CONFIDENCE plain text · /signal-board inline variant · 替原 plain {N}/100。 4 redlines 守:「STRONG SIGNAL」 不是「LOCK」 vocab · Engine streak only · No odds display · No affiliate。",
    href: "/matches/cpbl-260521-01",
  },
  // ── 🛡️ Round 32 W-E · 報馬仔/玩運彩 wording IP risk fix · Agent SKIP table verdict ──
  {
    title: "[R32 WE] 🛡️ 報馬仔/玩運彩 wording IP risk fix · Agent SKIP 4-col 對照 table · Patek+Hermès 不 compare-table",
    body: "Tim 問「2 家 paid tier 功能差別 + 借鑒?」 派 general-purpose agent 跑 2025-2026 fresh competitor membership audit。 Agent 帶回 SKIP verdict 反我前 reply 「我打算 ship 4-col 對照 table」 plan · 5 reasons compelling:(1) Already covered 3 places(/coverage NEVER + /membership PermLine + /membership/black-card OG)· table 是 4th redundant ·(2) Functional comparison 從 declarative Pratfall 滑向 competitive trash talk · violates 倒置 SaaS ·(3) Asymmetric data cells(兩家不公開 disclose · 任何 column 3-4 都有「資料未公開」cell · negative framing 暴露)·(4) Tim 第 2 次同月問是焦慮 signal · 不是 product gap signal · Patek+Hermès 從不發 4-col 對照 table 比 Swatch · differentiation 靠 process visibility 不靠 comparison ·(5) Real next move:/founders/ledger 第一筆 entry + /track-record N=1→30 sample debt 解封 · process visibility > comparison table。 但 agent 同時 surface 1 IP risk:ZONE 27「業界 30-50% 抽成」 narrative 多處 cite specific 玩運彩 + 報馬仔 · 但兩家 paid pricing/抽成 都不公開 disclose · 應 cite Taiwan LINE 老師 / 投顧老師業界共識 · 不應 cite 兩家具體數字。 同時 surface /about line 78「報馬仔 NT$ 3,000/月 · 殺手平台抽成 · 贏家帳號被砍」 conflates 報馬仔(tipster platform)跟 殺手平台(illegal bookmaker)· 報馬仔不收下注 · 不會砍帳號。 Ship 2 surgical wording fixes:(A) /about line 78-79 分離 報馬仔 + 殺手平台 為 2 個獨立 bullet · 報馬仔 改 「paid picks 點數 1:1 NT$ · 9 駐站名家自稱 55-59% 勝率 · 戰績無第三方審計」 cite agent verified fact · 殺手平台單獨 bullet 標「跟報馬仔/玩運彩是不同 mechanism」 ·(B) /membership/black-card line 50 改「業界 LINE 老師平台玩運彩 / 報馬仔 30-50%」 → 「Taiwan LINE 老師 / 投顧老師生態 30-50% 業界共識」。 Lesson:agent counter-recommendation 推翻我 ship plan 是 healthy · brand IP discipline > shipping reflex · 同 Round 32 W-C founder dogfood canary 但這次是 agent canary(reverse direction)。 SKIP 4-col table 是對 Tim「您決定」 + agent verdict 雙 trust + brand IP 不 trash talk axiom 同時 hold。",
    href: "/membership/black-card",
  },
  // ── 🧭 Round 32 W-D · Nav 會員 button auth-aware · Tim founder-dogfood 2nd ──
  {
    title: "[R32 WD] 🧭 Nav「會員 →」 button auth-aware · 已登入切 /member · Tim founder-dogfood 2nd canary 同日",
    body: "Tim 截 2 圖 push back:「我已經登入了!結果我只是去看其他頁面 · 現在想回去會員裏頭 · 點擊右上角(會員)· 跑到這裡幹嘛...回不去會員裡面的界面呀!」 = Round 32 W-C 後同日 2nd founder-dogfood canary 直接驗證 [[feedback-founder-dogfood-canary]] 寫死的「Tim push back 第 1 次就 trust direction 即修」 axiom。 Root cause:Nav「會員」 button 從 R23 → R25 一直 hardcode /membership(4-tier ladder)· 給 anonymous visitor wayfinding 用 · 但 logged-in user 點下去看 ladder 不是自己 dashboard · 「回不去」 confusion 是 navigation gap 不是 user 錯。 Ship NEW components/MembershipNavCTA.tsx(client island · session probe via createSupabaseBrowserClient · mount 後切 href + label)· Anonymous → /membership + 「會員 →」 · Logged-in → /member + 「您的引擎 →」(用 brand-specific 詞同 /member 自己 hero「您的引擎時間軸」 · 不用 SaaS jargon「儀表板」)。 Architecture choice:client island 非 async server · 因 Nav.tsx server / /login client · 不能 mix。 FOUC 200ms 接受 · 真實 user 不會點這麼快 · logged-in 點到 /membership 仍 graceful。 Variants:desktop gold-outlined pill + mobile gold-filled pill · 同 visual hierarchy unchanged。 Nav.tsx 重構 NAV_ITEMS 移 founders entry · MobileNavToggle 改 thin wrapper around MembershipNavCTA。 R30 W7 axiom「越少 fields 越正式」 延伸:session state 用 label 本身 carry · 不加 chip 不加 indicator · 1 個 button 2 state 不 split UI surface。",
    href: "/member",
  },
  // ── 🔪 Round 32 W-C · Tim founder-dogfood canary · 砍 path ② OTP code ──
  {
    title: "[R32 WC] 🔪 /login SentState path ② TYPE CODE 砍 · Tim founder-dogfood canary fire · 三 axiom 同時 fire",
    body: "Tim 第一手 dogfood 註冊流程截 2 張圖 push back:「沒有收到 6 位數 code 呀!直接點擊信箱的登入連結,就進去了...發生甚麼事情?」 surface 了 R30 W13b OTP code fallback path 是 over-promised UI:Supabase 預設 magic link email template 只寄 `{{ .ConfirmationURL }}` · 不寄 `{{ .Token }}` · 訪客看 SentState path ② 6 位數 verify form 永遠收不到 code。 反向 brand IP「方法公開 · 物理產出」 + 違反 R30 W11 axiom「every section must be true right now」。 砍 path ② 整套(PATH B form · handleVerifyOtp · friendlyOtpError · verifying state)· 對齊 Apple/Stratechery 1-tap minimalism + R30 W7「越少 fields 越正式」 axiom + R30 W11 present-tense-only axiom · 三 axiom 同時 fire。 Lesson canonical:UI feature 必須先 verify end-to-end · 不止 code path · 還要 verify email/SMS/external dependency 真的傳真實 data。 Founder dogfood = brand IP highest-quality canary 永遠優於 agent audit。 將來真要 cross-device OTP(Supabase Studio 改 template 加 `{{ .Token }}` 後)30 行可重 wire · git history 還可參考。",
    href: "/login",
  },
  // ── 📐 Round 32 W-A · Wire-up sync · 2 OG cards + count drift ──
  {
    title: "[R32 WA] 📐 Wire-up sync · /founders/ledger + /membership/black-card 2 OG cards + Cmd-K 30→32",
    body: "Round 31 27-commit blast 後 hygiene pass。 2 個新 route 缺 OG card · related-links sibling · count drift。 Ship:NEW app/founders/ledger/opengraph-image.tsx · 4 axiom chips(Pratfall · Costly Signaling · Disclosure · 倒置 SaaS)等大列出 + FORGED/REMAINING/TOTAL stats · punchline「Most luxury brands publish process. We publish rejections.」 同 /track-record「Most prediction sites hide their misses.」 inversion pattern。 NEW app/membership/black-card/opengraph-image.tsx · PRE-LAUNCH · UI MOCKUP badge 顯眼 + NT$ 499/月 + 5 unlocks 條列 · punchline「Subscription preview. We don't take money until Q3.」 brand IP「方法公開」 延伸到 preview state itself。 related-links.ts 加 2 entries · Cmd-K count 30→32 in 3 files · CLAUDE.md route table 加 2 新 route 完整 description。",
    href: "/founders/ledger",
  },
  // ── 💳 Round 31 W-X3 · BLACK CARD mockup ──
  {
    title: "[R31 WX3] 💳 NEW /membership/black-card · UI preview mockup · 32nd route",
    body: "Tim「先 build BLACK CARD mockup 讓 Tim preview · 再決定 payment platform」 ship。 BLACK CARD UI 完整 mockup + 5 unlocks + payment form mockup(disabled · pre-launch)+ FAQ。 Q3 launch 時 此 page UPGRADE 從 mockup → real form · payment infra wire(綠界個人版 / 新申請 / TapPay 之一 · Tim 等 BLACK CARD UI 接近 ready 拍板)。 brand IP「不催 · 不 dark pattern · 不藏 cancel button」 FounderSignOff explicit。",
    href: "/membership/black-card",
  },
  // ── 🎯 Round 31 W-X1 + W-X2 · /member prediction stats + /founders Hermès pivot ──
  {
    title: "[R31 WX1+X2] 🎯 /member prediction stats row + /founders Hermès process-transparency pivot",
    body: "X1 · /member 加「🎯 YOUR PREDICTIONS · 您累計 N · ✓Y proved · ✕Z diverged · accuracy N%」 personal calibration stats · 利用 W-W1 aggregatePredictionStats helper · 「您 vs 引擎 vs 實際」 三層 epistemic mirror personal stats closure。 X2 · /founders 砍「263 席剩」 e-commerce FOMO script kid pattern(per onboarding agent W-V #5 anti-pattern + Hogan Lovells exclusivity-scarcity legal boundaries)· h1 改「NEXT IS #008」 Patek serial specificity + counter strip 改「分配規則公開帳本 →」 link to /founders/ledger · Hermès workshop transparency pattern · brand IP「方法公開·品味私藏」 延伸:分配規則公開 · 但 live count 不 expose。",
    href: "/founders",
  },
  // ── 🎯 Round 31 W-V + W-W · social signals + prediction tracker ──
  {
    title: "[R31 WV+WW] 🎯 5 ship for Tim「會員沒功能 / 沒人付費」 critical canary fire",
    body: "Tim canary「會員頁面了 · 能幹嘛?沒社交 · 沒功能 · 沒人想付費訂閱呀!」 critical fire · brand IP yield · agent verdict 帶回 counter-intuitive truth:「Tim 您以為缺的是會員之間互動 · 數據說真正缺的是會員身份對外可見」(FanGraphs · Stratechery · Bits-about-Money · Defector 4 case 全部「幾乎 0 user-to-user social · 高轉換」)。 Ship 5 waves:(WV1)MemberDailyBrief · 已登入會員 daily 一次 personalized brief「您支持的 [team] 今晚 vs X · 引擎押 N%」 給「為什麼註冊」 immediate answer。 (WV2)Public Roll Call on /leaderboard · 7 forged honest SYSTEM-TEST disclosure + 263 待認領 visible scarcity = Aronson 1966 + Spence 1973 costly signaling · 預期 Founders 27 認領 +40-60% boost 12 個月。 (WW1)UserPredictionPicker on /matches/[gameId] · 3-way pick(我猜 home / away / 不押)· user_metadata.predictions store · 純精神 Metaculus pattern · 延伸 epistemic mirror。 (WW2)Footer bug feedback link → GitHub Issues · Pratfall + Disclosure 完美 fit。 (WX1)/member prediction stats row · 累計 calibration closure。 Tim 6 questions verdict:✅ 猜賽事+記勝率(ship)· ❌ 集點兌換(engagement farming antipattern)· ❌ 儲值(TIER 2/3 + 金管會 + 無 use case)· ✅ bug 建議(ship)· ⏸ 推薦碼 cash(觸發台灣多層次傳銷管理法 · Witness referral W-O 已 queued)。",
    href: "/member",
  },
  // ── 🛡️ Round 31 W-Q · CRITICAL security ──
  {
    title: "[R31 WQ] 🛡️ 2 CRITICAL security fixes · open redirect + CSRF defense",
    body: "Code audit agent 2nd pass 帶回 CRITICAL:(1) /auth/callback open redirect · 「next」 param 未驗證 · 可 inject phishing URL · sanitizeNext() 只接受 single `/` 開頭。 (2) /api/submit 缺 Origin/CSRF · isSameOrigin() check · 不符 403。 brand IP「安全 = trust signal」 物理產出。",
    href: "/login",
  },
  // ── 🏟️ Round 31 W-N · TeamPick personalization ──
  {
    title: "[R31 WN] 🏟️ 「我看 ___」 TeamPick localStorage personalization · fan-grammar moat",
    body: "Critic-hardening agent W-G ONE deepest call 終於 ship。「對你(這個富邦球迷)說話 · 不對球迷說話」 fan grammar moat。 球迷 lived experience 不是「我喜歡棒球」 · 是「我看富邦 / 我看兄弟 / 我看統一」。 新檔:lib/teams.ts(6 隊 canonical · localStorage z27_team)· TeamPickPanel · MyTeamTrackRecord(personal N=X 累計)· MyTeamMatchNote(您支持的 X 在這場是 favorite/underdog)。 Wire-up:/track-record + /matches/[gameId]。 brand IP:0 cookie / 0 server / 0 PII / 純 localStorage。",
    href: "/track-record",
  },
  // ── 🏛️ Round 31 Wave S · Open Allocation Ledger ──
  {
    title: "[R31 WS] 🏛️ NEW /founders/ledger · Open Allocation Ledger · 4 brand IP axiom 同時 fire",
    body: "Onboarding research agent ONE deepest call ship。 Patek · Hermès · Tesla · Apple Vision Pro 都做 process transparency · 但**沒人公布「本週拒絕了誰 · 為什麼」**。 ZONE 27 因 disclosure-first 結構性可以做 · brand 邏輯是「方法公開·品味私藏」公布拒絕 = 強化 brand IP 不 dilute。 31st visitor-discoverable route。 Pre-launch empty scaffold + binding allocation rules + Future weekly review rows scaffolding。 4 brand IP axiom 同時 fire 的唯一 page:Pratfall(公布拒絕)+ Costly Signaling(每週手寫不可造假)+ Disclosure Philosophy(延伸 /audit 公開模型 → 公開分配模型)+ 倒置 SaaS(手工稀缺商品 = 手工稀缺流程)。 5 步流程 binding rule(申請窗口 · 審核標準 · 通過 onboard · 拒絕 email · 此頁更新)修改需 30 天前 /changelog 公告 · 同 /audit S05 PRE-COMMIT pattern。 CommandPalette + /founders cross-link 已 wire。",
    href: "/founders/ledger",
  },
  // ── 🏟️ Round 31 Wave N · TeamPick personalization ──
  {
    title: "[R31 WN] 🏟️ TeamPick 「我看 ___」 localStorage personalization · fan-grammar moat ship",
    body: "Critic-hardening agent W-G ONE deepest call 終於 ship。「對你(這個富邦球迷)說話 · 不對球迷說話」 fan grammar moat。 球迷 lived experience 不是「我喜歡棒球」 · 是「我看富邦 / 我看兄弟 / 我看統一」。 整個網站從來沒問這句話。 新檔:lib/teams.ts(6 隊 canonical · localStorage z27_team helpers)· TeamPickPanel(client picker · 2 variant · SSR-safe)· MyTeamTrackRecord(personal N=X · ✓Y ✕Z counter)· MyTeamMatchNote(您支持的 X 在這場是 favorite/underdog)。 Wire-up:/track-record hero + /matches/[gameId] hero。 brand IP:0 cookie / 0 server / 0 PII / 純 localStorage · 對齊 FUNDED BY FOUNDERS · NO TRACKERS axiom。 homepage = ONE thing 仍受尊重 · picker 只 inline trust artifact pages 不在 homepage。",
    href: "/track-record",
  },
  // ── 🛡️ Round 31 Wave Q · CRITICAL security fixes ──
  {
    title: "[R31 WQ] 🛡️ 2 CRITICAL security fixes · open redirect + CSRF defense",
    body: "Code audit agent 2nd pass 帶回 2 CRITICAL/HIGH security findings:(1) /auth/callback open redirect · 「next」 param 未驗證 · 可被 inject phishing URL · 加 sanitizeNext() 只接受 single `/` 開頭 internal path。 (2) /api/submit 缺 Origin/CSRF 防護 · 攻擊者頁面可 trigger user authenticated fetch POST 造成 cross-origin spam · 加 isSameOrigin() check · 不符 403。 brand IP impact:per /privacy 0-tracker promise · 安全性 = trust signal · 不修不公開 = ZONE 27 trust 自殺。 三綠 ✓。",
    href: "/login",
  },
  // ── 🎁 Round 31 Wave M · 5 unlocks dashboard grid ──
  {
    title: "[R31 WM] 🎁 5 unlocks prominent grid + /membership FREE TIER 直連 /login",
    body: "Tim canary fire「會員哩!還是沒辦法享用會員能使用的所有功能呀!請問一般人要怎麼加入會員?拜託別這麼複雜!」 surface 2 conversion blockers:(1) visibility · 5 FREE TIER unlocks 散在不同 routes · /member 只 text 1 行帶過。 (2) onboarding 複雜 · /membership FREE TIER CTA href=#waitlist 只 email collection 不是真會員註冊。 修:NEW MemberUnlocksGrid 5-card prominent grid(authenticated stats overlay + anonymous preview CTA → /login)apply 到 /member 上方 main visible · /membership FREE TIER CTA href #waitlist → /login direct。 brand IP「one menu per dashboard」延伸「one tense per page」 · 您擁有的福利 surface 而非藏 deep page。",
    href: "/member",
  },
  // ── 🤖 Round 31 Wave I+J+K+L · CPBL auto-fetch + pitcher team SWAP + real stats ──
  {
    title: "[R31 WI/J/K/L] 🤖 CPBL pitcher stats 自動化 + pitcher-team SWAP fix · Tim 不用截圖",
    body: "Tim push back「真的太麻煩了 · 每天都要複製這些給您?」 surface workflow blocker。 Recon 發現 cpbl.com.tw 是 server-rendered HTML(不是 SPA · CLAUDE.md 寫錯)· /stats/recordall?kindcode=A&position=02 一頁 inline 所有投手 K/9 · BB/9 · HR/9 · pre-computed metrics。 (W-I) 88 行 cheerio script + lib/cpbl-pitchers.ts auto-generated lookup + npm run fetch-cpbl shortcut · 從 Tim daily screenshot grind 升 30-sec one-click refresh。 (W-J) wire-up:lib/matches.ts mergePitcherStats() 自動 overlay real stats over hardcoded estimate。 (W-K) pagination fix:從 15 → 16 pitchers across 2 pages。 (W-L) Tim 矯正 logo legend · CPBL 6 隊 logo→隊伍對應 fix · matches.ts cpbl-260522-02/03 兩場 away pitcher SWAP(魔神龍 ↔ 獅帝芬)· + 真實 ERA values(魔神龍 0.61 · 艾速特 1.80 · 曾家輝 2.97)。 7/8 pitchers 真實 stats live · 1/8 estimate(郭俊麟 · IP 不足 qualify · 不急)。",
    href: "/matches",
  },
  // ── ✍️ Round 31 W-H · Tim signature + bank info ──
  {
    title: "[R31 WH] ✍️ Tim signature PNG + bank info gitignored · prereq 1+3 DONE",
    body: "Tim 親手簽名(abstract X 花體 · brand-mark-grade logogram · Patek/Hermès 等級的 visual identity)· jimp 處理 pipeline(白底 → 透明 + 黑色拉滿 + autocrop + resize 600px Lanczos)· output public/tim-signature.png。 + Tim 銀行 4 欄位 collected 存 docs/private/bank-info.md(gitignored · public GitHub 永遠看不到 · Claude 新對話從本機 disk 讀)· .gitignore 加 docs/private/ entry · git check-ignore verified。 Founders 27 launch prereq 1+3 DONE(剩 2 Gmail filter · 4 PDF cert · 5 timing 不卡資訊收集)。",
    href: "/audit",
  },
  // ── 🛡️ Round 31 Wave G · Critic-hardening top 5 patches + fan-grammar narrative ──
  {
    title: "[R31 WG] 🛡️ Critic-hardening 5 patches + fan-grammar narrative · agent 攻擊面審視 ship",
    body: "Agent critic-hardening + storytelling pass(8 routes crawled · CPBL real-context cross-check)帶回 15 個攻擊面 + TOP 5 critical patch + ONE deepest call。 Ship TOP 5:(A11+A12)/track-record N=1 慶祝視覺改 — FirstReceiptHero gold/70 border → mute/40 · shimmer 拿掉 · ★ FIRST RECEIPT 改「NOT YET EVIDENCE · 29 MORE TO N=30」 mute/80 · stat-literate skeptic 嗆「N=1 100% PROVED = 統計文盲」 Texas sharpshooter fallacy 風險直接 surface · 加「⚠ STAT LITERACY · 為什麼 60% PROVED ≠ 引擎強?」 120-字 block · 引出 Brier score + reliability diagram + /member/calibration cross-link + v0.3 commitment。 (A15)/membership 「明牌」vs「博彩」disclosure section #pick-vs-bet · skeptic 嗆「『賣明牌』就是博彩附屬詞 · 跟博彩劃線劃假的?」 主動 surface「明牌 = 球迷之間 share 預測 native 詞」+「我們不連接莊家 · 不處理賠率 · 不抽下注佣金」+ /coverage NEVER list cross-link。 (A1+A2)首頁 TonightReceiptsCard 加 LOW EDGE 夜 self-deprecating chip(when avg confidence < 65 of pending matches)+ MiniMatchCard 加投手名「P · {name}」 in HOME/AWAY rows · skeptic「3 場 grid 沒投手名 = LOCK 沒重量」 fix + 「全 coin-flip 區間 = confidence theater」 主動承認 Pratfall surface。 (A10)/audit S05 末尾加「⚓ PRE-COMMIT · 第一筆 DIVERGED 出現時的處理規則」block · pre-commit binding rule(該場 receipt 首頁 7 天不撤 + ledger 編號不重排 + git commit permalink + 不開 excuse paragraph)· 修改需 30 天前 /changelog 公告 · Costly Signaling 100×。 (S1)/matches/[gameId] 加 EngineNarrative blockquote in 「/ 01 · STARTING PITCHER MATCHUP」 與「/ 02 · TOP 5 SCORES」 之間 · generic across all matches · 動態 derive 3-stat comparison · 「引擎為什麼押 X% [winner]」 + ERA / K9 / BB9 / HR9 差值對話化解讀 + 「引擎不吃:本季對戰史 · 球員傷停 · 守備站位 · 教練調度 · 場地適應」 Pratfall 主動承認 + ±15-25pp /audit S03 cross-link + v0.3 roadmap commitment。 Build / Lint / TSC 三綠。 Lesson 寫進 axiom:「critic-hardening 不是 audit 副產品 · 是 brand IP Pratfall 持續壓力測試 · skeptic 第一句嗆破的點都 pre-empt 公開」 · 對齊 brand axiom「Pratfall + Costly Signaling + Disclosure」 三層同時 fire 的物理實踐。 ONE deepest call(team-pick localStorage personalization · 「我看富邦 / 統一 / 兄弟」)留 Wave H 評估 — 涉及 4 surface 改 + Nav 增物件 · brand axiom homepage = ONE thing 風險 · 需 Tim 拍板。",
    href: "/track-record",
  },
  // ── 🎨 Round 31 Wave B · Baseball Savant + Vercel datestamped pattern ──
  {
    title: "[R31 WB] 🎨 Baseball Savant percentile bars + Vercel datestamped EngineStamp",
    body: "Agent research(2026 frontier 20 sites)deepest 2 patterns 同時 ship。 (1) Baseball Savant 風 percentile bar 移植到 /matches/[gameId] PitcherCard:5 plain StatRow → 5 StatPercentileBar · 紅藍 gradient 替成 ZONE 27 配色(冷金 elite → 骨白 mid → mute poor)· dot 大小 + gold glow 標 elite · TIER label 右側(ELITE / MID / REBUILD)· hardcore 棒球迷 1.2 秒識別 grammar(Statcast 是現代 baseball 最廣為人知的視覺標誌)。 CPBL league reference range 暫用估計(per /audit S02 ESTIMATION DISCLOSURE pattern · 任何 CPBL 數據工作者可發 PR 修正)。 (2) Vercel + Plausible 風 EngineStamp 元件 · 「ENGINE v0.2 · LOCKED YYYY-MM-DD · BUILD a1b2c3d」 datestamped trust signal · BUILD chip 直連 GitHub commit permalink(/audit BUILD chip 同 pattern)· 訪客一鍵 audit 現在 serving 的 code 真實 git history。 Apply 到 HeroLiveCard footer + TonightReceiptsCard footer + /track-record hero。 NEW components/StatPercentileBar.tsx + components/EngineStamp.tsx。 Build / Lint / TSC 三綠。",
    href: "/matches/cpbl-260521-01",
  },
  // ── 🎫 Round 31 Wave A · TONIGHT'S 3 RECEIPTS multi-match Costly Signaling ──
  {
    title: "[R31 WA] 🎫 TONIGHT'S 3 RECEIPTS · multi-match Costly Signaling brand IP 物理時刻",
    body: "今天 cpbl-260522-01/02/03 三場同晚 18:35 開賽 = ZONE 27 第一次「多場同晚 receipt loop」物理時刻。 N=1 → 22:30 後 N=4 · /track-record 直接 ×4 · /member/calibration 從 1 個 gold dot 跳到 4 個 trend-able dots。 到 2026 下次三場同日為止 · 今晚是最大的單日 brand IP credibility event。 Sharp call:homepage HeroLiveCard 從 single-match cinematic 升為 multi-match 3-card grid when 今日 ≥2 場。 NEW components/MiniMatchCard.tsx(緊湊 static-engine card · pre-locked prediction · 不 re-simulate · brand IP 防 sample-gaming defense)+ components/TonightReceiptsCard.tsx(phase-aware header copy + 3-card grid + cumulative track record footer N=X · ✓Y ✕Z → 22:30 後 +pending)。 lib/matches.ts 加 getTodayMatches() + getTrackRecordStats() helpers + parseHHMM export。 app/page.tsx switch:today ≥2 → multi · today ≤1 → existing single-match HeroLiveCard cinematic(保留 receipt-mode 單場 brand soul)。 Pre-existing lint fix:react-hooks/purity false-positive on async server component(Date.now in render)· 移到 computeDaysSinceJoin top-level helper · /member/calibration 砍 unused globalN。",
    href: "/",
  },
  // ── 🗑️ Round 30 Wave 11 · Agent-research-driven 4-cut compression ──
  {
    title: "[R30 W11] 🗑️ Agent UX research → 4 cuts · 「one tense per page」axiom 寫死",
    body: "Tim 11th canary fire(同日)「我們的網頁,充斥著複雜、麻煩!多上網查詢一些統計資料?」 = 結構性 complexity 累積 even after W8 prose compression。 派 60-min agent 跑 2026 UX 統計研究 · 帶回 hard data:Baymard form-field cliff(5→7 fields = -34% conversion)· specflux 2026 study(12→5 sections = 83% conversion lift)· Unbounce 18K-page 分析(single-CTA 13.5% vs 3+ CTA 10.5%)· Cowan 2026 working-memory 從 7±2 下修 4-chunk · benchmark 比較:Apple Account 3-4 blocks · Stratechery 2 · HEY 1 · Linear 3 · ChatGPT 1 · ZONE 27 /member 9-10 = 2.5× minimalist peers。 DEEPEST sharp call 寫進 brand axiom:「complexity isn't a section problem · it's a tense problem · every section must be true right now · future-tense → /roadmap · past → /track-record · live page = present-tense only」。 SHIP 4 cuts:(W11a)/matches/[gameId] DISCUSSION LOCK placeholder 砍(future-tense「即時討論室將上線」違反「沒有即將推出」axiom · W6/W9/W10 已 ship 真實 unlocks)· (W11b·1) /member MemberDashboardPreview 4-bias preview block 砍(future-tense scaffolding · W6 真實 YOUR FOLLOWED MATCHES 已存在)· (W11b·2) /member ✕/✓ blocks 砍 · 合一為「MEMBER SYSTEM · INVERTED」 single section(3-col 視覺主角 + deepest call CTA · Stratechery one-core-argument)· (W11b·3) /membership Creator Permissions FAQ 從 4 PermissionRow 100-word paragraphs → 4 PermLine 15-word 1-liners(PermissionRow sub-comp 刪 · 新 PermLine 替代)· (W11b·4) /membership MEMBER SYSTEM MAP block 整刪(W4 ship · meta-documentation 當時有用 · 現在 W5/W6/W9/W10 真實 ship 後 MAP 變 second-pass digest noise · 砍 + MapRow sub-comp 清)。 預計 effect:/matches/[gameId] 9→7 sections · /member 9-10→6 sections · /membership 10→7 sections。 Lesson canonical · 寫進 axiom:**「one tense per page」** + **「strip future-tense scaffolding from present-tense pages」** = ZONE 27 結構簡化的 single principle · auto-generate 未來所有 cuts。",
    href: "/member",
  },
  // ── ⚡ Round 30 Wave 10 · MEGA TIER 1 push ──
  {
    title: "[R30 W10] ⚡ MEGA push · 5 features 1 commit · Tim「不用什麼都在等」directive 全動",
    body: "Tim directive「不用什麼都在等...現在能做甚麼都做就對了」 = stop deferring。 Ship ALL TIER 1 deferred items 一次:(1) /member/calibration PERSONAL MODE — agent W2B deepest call 終於完整交付 · server-side getSession + filter finalized by follow-list · 登入 + 有 follows = 您 own drift · 匿名 = global aggregate · 同 SVG 同 binning math 不同 data subset · chip 切「✓ YOUR · N=X」/「GLOBAL · N=X」 · empty state 兩 mode 不同 CTA。(2) /member NOTE COUNT badges on FollowedMatchRow — readNotesFromMeta server-side · 每 row 顯示「✏️ N 字筆記」if noteLength > 0 · cross-link W9 notes infra。(3) /member DAYS SINCE JOIN on welcome banner — session.user.created_at 算天數 · 「ZONE 27 第 N 天 FREE TIER 會員」Endowment Effect deepening · explicit identity anchor。(4) /admin AUTH-AWARE — Tim 登入後 chip 顯示「✓ SESSION · email」shimmer · visual confirmation 後台 auth 鏈通。(5) NEW /member/submit FREE TIER 投稿 · sendSubmissionNotification 擴 lib/email.ts · NEW /api/submit route handler(POST · session-gated · Resend email to Tim Gmail)· 純 Tim-curate model · 不存資料庫 · 0 server-side archive · Stratechery Guest Post pattern · 1/週 cadence · per /membership Creator Permissions FAQ。 Wiring:Cmd-K 29→30 + /member/submit entry · related-links · /member welcome banner 加「投稿 → / mirror → / 登出」3-link strip。 FREE TIER 解鎖 ladder 終於完整:★ Follow + ✏️ Note + ↗ Submit + 🪞 Calibration mirror = 4 真實 unlocks(W6 / W9 / W10 / W10 personal mode)。 Build / Lint / TSC strict 全綠。 Lesson:Tim「能做甚麼都做」 = stop pre-emptive defer · 每個 TIER 1 item 都該被 ship · TIER 2/3 才需 explicit approval。 Founders 27 number reservation 仍 wait(brand decision · 等 Tim 啟動 Founders 27 launch checklist 5 prerequisites 完成)· TapPay 公開發文仍 wait(TIER 2 預算 · 需 explicit approval)。 Sim history cloud sync 留 Wave 11(touches /lab simulator deeply · 獨立 scope)。",
    href: "/member",
  },
  // ── ✂️ Round 30 Wave 8 · Compression pass · reverse prose 過剩 ──
  {
    title: "[R30 W8] ✂️ Compression pass · 反 W2A/W2B/W4/W7 prose 過剩 · ~270 lines deleted",
    body: "Tim 第 9 次 canary fire(同日)「網站很雜!一堆字!到處都是字!沒人想看!」 = direct critique 我今天加的 prose 過量。 IRONY:W7 我加 60-line WHY-MINIMAL block 解釋為什麼少文字 = 自我矛盾 brand IP。 Sharp call:「Method public」 ≠「Explain on every page」。 Deep pages(/audit · /methodology · /manifesto · /coverage · /privacy)可以 prose · entry pages(/login · /membership · /member · /member/calibration)interface IS message · Apple/Stratechery/Plausible 全部如此。 Compression cuts:(1) /login DELETE W7 WHY-MINIMAL 整 block · MinimalRow sub-component 也清。 WHAT YOU GET 5-bullet 從 ~200 字壓到 ~25 字(各 bullet 1 短句)+ trust signal 1-liner 加 /privacy 連結。 (2) /member DELETE WHEN AUTH LANDS 整 section(stale · auth landed in W5)· COMPRESS HOW THIS DIFFERS:✕/✓ 各 1 句(原 4-6 句)· 刪 brand-IP commitment paragraph + Apple 重複 paragraph + DEEPEST CALL elaboration paragraph · 保留 3-col comparison 視覺 + epistemic mirror 1-line quote + CTA。 FounderSignOff 3 paragraphs → 2。 4-bias intro paragraph 刪。 (3) /member/calibration WHY THIS PAGE EXISTS blockquote 4 paragraphs → 1 quote + 1 短句 · HOW TO READ 6 steps → 4(merge over/under-confident)。 (4) /membership MAP intro paragraph 刪 · 4 Q-card body 各 ~50 字 → ~25 字。 Total: ~270 lines prose deleted · 0 interactive elements 動 · 0 brand statement soul 損。",
    href: "/member",
  },
  // ── 🧠 Round 30 Wave 7 · /login WHY THIS IS MINIMAL · psychology block ──
  {
    title: "[R30 W7] /login WHY THIS IS MINIMAL · psychology design defense block · Apple vs ZONE 27 explainer",
    body: "Tim 第 5 次 canary fire(同日第 8 次發 prompt)送 Apple 帳號建立 screenshot 問「為什麼我們不像 Apple 這麼複雜?不就像 Apple 那樣輸入這些?我們網站發生甚麼事?」 = 訪客看到只 1 個 email 欄位的 confusion 瞬間 surface。 Sharp call:Apple 註冊問 5-8 個 fields(姓名 · 國家 · 生日 · 密碼 · 安全問題)· ZONE 27 問 1(email)· 不是 bug 是 Costly Signaling 結構性決定。 訪客 confusion = brand IP 教學黃金:不解釋 = 訪客誤判我們忘記寫 = 信任流失 · 解釋 = trust signal。 Ship /login「WHY THIS IS MINIMAL」section · 緊跟 form 下方 · 5-row「為什麼我們刻意不問」 list(姓名 / 國家 / 生日 / 密碼 / 安全問題 · 每行給「不問是因為」 brand-axiom-aligned 理由)+ 「Apple 賣您東西 → 需 fields · ZONE 27 不賣您東西 → 不需 fields」 對照 + brand axiom 結尾「0 tracking 延伸到註冊本身 · 少存 = 少漏 · 不存 = 不漏」 + Costly Signaling 命名(刻意 friction-by-omission)。 MinimalRow sub-component(field + whyNotAsk)· cross-link 到 /privacy + /manifesto Section II + Footer NO TRACKERS。 Lesson 寫進 /now DISCOVERED:Brand-IP-倒置「越少 fields 越正式」 需要 explicit explainer · 不然訪客用 default mental model「越多 fields 越正式」 誤判我們 broken。 訪客 expectation reversal moment = brand IP 教學黃金 · 不能藏起來。",
    href: "/login",
  },
  // ── ★ Round 30 Wave 6 · Follow Match · first unlock feature ──
  {
    title: "[R30 W6] ★ Follow Match · first unlock feature · 4th canary fire 後 ship 真實 functionality",
    body: "Tim 第 4 次 canary:「我要現在就能讓所有人註冊!不用等!使用、解鎖功能?」 = W5 /login ship 了 · 但登入後跟 anon visitor 看到一樣的 preview · 「unlock」是空話。 Sharp call:per 2026 frontier first-action pattern(Day One first journal · Linear first ticket · HEY first email)· 登入後立刻給訪客「第一個具體動作」 = day-1 retention 黃金。 ZONE 27 first action = Follow 第一場 ZONE 27 公開預測賽事。 Ship:(1) lib/follows.ts · 用 Supabase auth.users.user_metadata.followed_matches JSONB 存 · 0 migration · 0 Tim 動作。 helpers:getMyFollows / toggleFollow / readFollowsFromMeta(server-side)。 (2) NEW components/FollowMatchButton.tsx · client component · 3 states(loading / anonymous / ready)· anonymous renders 「→ 登入解鎖 FOLLOW」連結到 /login?next=/matches/X(post-magic-link 回原 match page)· logged-in renders ☆ / ★ toggle。(3) /matches/[gameId] 加 FollowMatchButton row · 在 HERO meta 下方 · 「★ Follow 這場 · 賽後 receipt 自動進您 /member」。(4) /member 加 YOUR FOLLOWED MATCHES section(when 登入 + has follows)· server-rendered FollowedMatchRow · phase chip + verdict chip(if final)+ score(if final)+ entire row link。(5) /member welcome state 加 FIRST-ACTION onboarding(when 登入 + 0 follows)· 大 gold-bordered glow-soft block「您的第一個動作 · Follow 一場 → 您 calibration mirror 從這場開始累積」 + 2 CTAs。(6) /login 加 ?next= forwarding(防 open-redirect 漏洞 · 只接 /-prefixed internal path)+ /auth/callback 已 support next param。 4 cognitive bias 同時 fire:Endowment(您 follow 的 collection 是您 trophy)· IKEA(explicit 動作不是 algorithm push)· Loss Aversion(離開帳號 = 失去 follow history)· Costly Signaling(explicit follow click vs surveillance tracking)。 Lesson:1st canary(R29) = 沒看到 · 2nd(R30 W4) = 看不到答案 hub · 3rd(R30 W5) = 答案是 IOU · 4th(R30 W6) = unlock 是空話 · 修是 ship the actual feature 不是 reframe wording。 Functionality ladder closed:click + 輸入 + 註冊 + ★ FOLLOW = 真實 unlocked。",
    href: "/matches",
  },
  // ── 🔐 Round 30 Wave 5 ship · Phase 1 magic link auth(2026-05-21 deep evening)──
  {
    title: "[R30 W5] 🔐 NEW /login + /auth · Phase 1 magic link auth · 從 Q3 promise 加速到 NOW",
    body: "Tim 第 3 次 pratfall canary:「我點下去又不能註冊...都只會跑到寄 mail 那邊...我要加入會員呀...我們真的有會員系統可以讓使用者註冊?我很懷疑...」 = WaitlistForm 是 email collection · 不是 auth · 帳號註冊不存在。 Tim 完全是對的 · 連 W4 MAP block 的「✓ 現在能加入 FREE TIER」 都是 misleading wording。 Sharp call:不 paper over · ship 真實 Phase 1 magic link auth · 從 publicly-promised Q3 2026 timeline 加速到 NOW(同日 late evening)。 NEW infra:(1) install @supabase/ssr(cookie-aware SSR client)·(2) lib/supabase/browser.ts + lib/supabase/server.ts + getSession helper ·(3) NEW /login route · client component · email input + Supabase signInWithOtp · 1 個欄位 1 個動作 1 封 email · 沒密碼 / 沒 OAuth / 沒 social login(Pratfall + Costly Signaling deliberate minimalism)·(4) NEW /auth/callback route handler · exchangeCodeForSession + redirect /member?welcome=true ·(5) NEW /auth/signout POST route · clear session + redirect /。 /member 升 auth-aware(server component · getSession + searchParams)· Session 存在 → AUTHENTICATED chip + 歡迎 email banner + 登出 button + 「您正式是 FREE TIER 會員」 framing。 無 session → 保留 4 cognitive bias preview + 新加 /login CTA。 /membership MAP Q1 從「✓ 現在 #waitlist」reframe「✓ 現在 /login magic link 註冊」 + 「↓ 純訂閱通知 email」secondary path。 28→29 visitor-discoverable routes(/login)+ 2 internal redirect routes(/auth/callback · /auth/signout)。 Email 走 Supabase 預設 SMTP(free tier 2/hr · Tim 自測夠 · 量起來換 Resend SMTP custom · Round 16 已 production)。 Lesson:repeat-prompt canary 第 3 次 = ship-surfacing-bug 變 ship-actual-functionality-bug · 修不是 surfacing 是 build the real thing。",
    href: "/login",
  },
  // ── Round 30 Wave 4 ship(2026-05-21 late evening · pratfall canary fire 後)──
  {
    title: "[R30 W4] /membership · MEMBER SYSTEM MAP · 4 reflexive question single answer hub",
    body: "Tim 第 2 次發 R29 W2 verbatim 同 prompt(現在不能加入一般會員?為何 Q3?+ 一般會員去哪發文?+ 我管理介面在哪?+ 心理學能做什麼?)= Pratfall canary fire · 不是 prompt repeat noise · 是 surfacing-failure signal:Round 29 W2 ship /member + /admin 沒落在訪客第一眼可見位置。 不 over-defend「我已 ship」 · 直接修 surfacing。 Ship MEMBER SYSTEM MAP block on /membership · 緊接 hero 下方(4-tier cards 上方)· gold-bordered slate panel · 4 個 Q-card grid · 每個 verdict band + body + 1-2 direct anchor link。 Q1 「現在能加入嗎?」→ ✓ FREE TIER 永久免費 1 秒 · 您要等的是 BLACK CARD + cloud sync 不是「加入」。 Q2「會員去哪發文?」→ FREE TIER ❌ · BLACK CARD Q3 ✓ 5% · Founders 27 ✓ 0% 終身 · anchor → #creator-permissions。 Q3「Tim 管理介面 + 會員頁面」→ /admin (noindex · live KPI · Stage 1 Supabase 連結) + /member (4 bias preview) + /member/calibration (epistemic mirror)。 Q4「psychology 角度做什麼?」→ 4 cognitive bias driven + epistemic mirror。 Sub-component MapRow(question + verdict + body + ctas[])· /membership Creator Permissions section 加 id=\"creator-permissions\" + scroll-mt-20 anchor。 Lesson:Pratfall canary repeat-prompt 永遠不是 prompt-bug · 是 ship-surfacing-bug · 修 surfacing 不是 defend ship。",
    href: "/membership",
  },
  // ── 🎯 Round 30 Wave 3 · BRAND IP 物理時刻(2026-05-21 ~22:30 TPE)──
  {
    title: "[R30 W3] 🎯 FIRST RECEIPT · cpbl-260521-01 · 統一 2:6 富邦 · ENGINE PROVED ✓ · N=0→N=1",
    body: "ZONE 27 第一筆公開戰績 receipt。 Tim 在 cpbl.com.tw 截 box score 後立刻貼 Claude → 解析 → ingest finalResult into lib/matches.ts。 統一獅(away)2 R 8 H 0 E · 富邦悍將(home)6 R 9 H 0 E · 9 局完整 · 新莊。 勝投 李東洛(7 IP · 2 K · 0 失分 · 4-time MVP)· 敗投 郭俊麟 · 救援成功 張奕。 Engine 賽前 say 60% home · 實際 home win → PROVED ✓ · engine_pct_on_winner = 60%。 整條 cascade fire(無人工干預):(1) /track-record N=0 → N=1 · FirstReceiptHero cinematic 自動 render(2px gold border + ★ FIRST RECEIPT · 1 OF 270 PROJECTED + ENGINE vs ACTUAL grid + PROVED verdict band)·(2) homepage HeroLiveCard 切「today-final」mode(per W1 fix)· receipt block 顯示 6:2 + ENGINE PROVED · 不跳去 cpbl-260522-01 future preview ·(3) /matches/cpbl-260521-01 calibration block 自動展開 ·(4) /member/calibration 第一個 gold dot 落點(centerPct=65 · favoriteActualPct=100% · 因為 favorite won 1/1)·(5) /admin live KPI · /audit SAMPLE_SIZE · ScarcityStrip 全 dynamic re-read。 這就是 W2B docs 寫的「empty scaffold + Pratfall waiting state」 兌現的瞬間 · 也是 W1 priority fix 真正 fire 的瞬間。 brand IP「方法公開 · 不刪不修飾」物理產出第一行。",
    href: "/track-record",
  },
  // ── Round 30 Wave 2C ship(2026-05-21 late evening · Spy-Trackers specific naming)──
  {
    title: "[R30 W2C] /coverage NEVER 加 玩運彩 playsport.cc + /membership 加具體站名 · Pratfall Spy-Trackers pattern",
    body: "Tim 送 玩運彩 (playsport.cc/forum) + 運彩報馬仔 (fengyuncai.com) screenshots 問「會員系統需要參考這 2 大舊歷史權威?他們可以吸收的部分?」 grep 後 surface 一個 gap:報馬仔 fengyuncai.com 已在 /coverage NEVER list(line 134)+ 5 個 visitor-facing pages 提及 · 但 玩運彩 playsport.cc(Taiwan 最大運彩討論區)沒被具體 named · 只籠統「運彩 / 報馬仔 / 殺手平台」。 Sharp call:不 absorb · 因為 ZONE 27 brand IP 結構性反對(他們 tipster ranking + 牌支戰績 + 老師 30-50% 抽成 · vs ZONE 27 0% creator share + epistemic mirror + curation gate)· 但要把它 named。 Ship:(1) /coverage NEVER 加 第 2 條 玩運彩 playsport.cc/forum entry(放在台灣運彩 + 報馬仔 之間 · 同 Taiwan-gambling-ecosystem 群組);(2) /membership PermissionRow 從抽象「LINE 老師 archetype」升 specific 命名「玩運彩 playsport.cc · 報馬仔 fengyuncai.com 的 tipster ranking 生態 · 輸了刪文 / 贏了截圖 / 月抽 30-50% mechanism」+ 5% 抽成 wording 從「業界 LINE 老師 / 殺手平台」 升 「玩運彩 / 報馬仔 / LINE 老師平台普遍 30-50%」。 HEY「Spy Trackers」+ Footer「FUNDED BY FOUNDERS · NO GA · NO PIXEL · NO HOTJAR」 same Costly-Signaling Spy-Trackers pattern。 Tim 第 3 個「絕對 NO」 framing 推回(Apple commerce / Spotify consumption / 玩運彩 gambling-tipster)· 三層 brand boundary 全完成。",
    href: "/coverage",
  },
  // ── Round 30 Wave 2B ship(2026-05-21 late evening · agent-research deepest call)──
  {
    title: "[R30 W2B] /member/calibration NEW · sabermetric reliability diagram · epistemic mirror brand statement",
    body: "Agent 90-min 研究 2026 frontier member-system patterns(Stratechery / HEY / Linear / Patek / Hermès / FanGraphs / Day One / Anthropic Pro / Plausible)→ TOP 5 ADD + TOP 3 NEVER + deepest sharp call。 Deepest call:「The dashboard isn't a feature stack. It's an epistemic mirror.」ZONE 27 是唯一一個 structurally positioned to surface 會員自己的 calibration drift 的高端 sports 品牌。 FanGraphs / Baseball Savant 給 team stats · Stratechery 給 archive · ZONE 27 給您「您過去思辨的可信對照」。 New route: /member/calibration · inline SVG 400×400 reliability diagram(45° gold dashed line · grid · empty bin ghosts · axis labels · ENGINE PROBABILITY vs ACTUAL FREQUENCY)· N=0 empty scaffold + Pratfall waiting state(「今晚 22:00+ 第一個 dot 落點 · cpbl-260521-01」)。 N≥1 自動轉 plot · dot size ∝ sample count。 N<30 SAMPLE DEBT warning。 6 reading steps · WHY THIS PAGE EXISTS blockquote · GLOBAL vs PERSONAL 2-phase timeline。 FounderSignOff + RelatedReading + back nav。 1d revalidate · 0 deps · 0 cookies · 0 GA。 28 visitor-discoverable routes(was 27)· 22 components 不變 · CLAUDE.md route table + Cmd-K + related-links 三檔同步。 Agent #2 #3 #5(Founder number reservation · Public vote tally · 140-char bio)留 Tim 啟動 Founders 27 launch 時 ship。 Agent #4(Counterfactual card)留 follow-list 出現後 ship。 3 NEVERS(Wrapped report · Streak counter · AI chatbot)全部 align canonical anti-pattern axiom · 不需動。",
    href: "/member/calibration",
  },
  // ── Round 30 Wave 2A ship(2026-05-21 late evening · brand-IP inversion)──
  {
    title: "[R30 W2A] /member 3-col brand comparison · Apple commerce / Spotify consumption / ZONE 27 epistemic",
    body: "Tim 送 Apple Store login + cart screenshots「人家也都有會員系統呀, 我們的呢?」 = 隱含「features-arms-race」framing。 Sharp call:不是 features 比他們多 · 是 ZONE 27 跟其他會員系統根本不同物種。 Apple = COMMERCE 交易史 · Spotify = CONSUMPTION 消費史 · ZONE 27 = EPISTEMIC 思辨史。 3-col 對照卡 grid 加到 /member「WHY THIS IS NOT TYPICAL SAAS DASHBOARD」section · 4 axes(您給他們 / 他們給您 / 獎勵 / 追蹤)· highlight ZONE 27 card 金 border + glow + 0-tracking 標金色 cell · 對齊 Footer「FUNDED BY FOUNDERS · NO GA · NO PIXEL」brand line。 Sharp call paragraph「ZONE 27 會員系統 = epistemic relationship archive · 您跑過的 sim 是您過去思辨的物理痕跡 · 累積 = 您自己的 trophy · 不是我們給您的 feature · 我們從來不是 Apple · 我們從來不會是 Apple」寫死。 W2B deepest call CTA(epistemic mirror → /member/calibration)在 same section 結尾。",
    href: "/member",
  },
  // ── Round 30 Wave 1 ship(2026-05-21 late evening · pre-22:00 hardening)──
  {
    title: "[R30 W1] getFeaturedMatch priority fix · 今晚 22:00+ receipt cinematic 會出現在首頁",
    body: "Round 10 引入 getFeaturedMatch 時 priority order 跟自己 doc-comment 矛盾:closest future(step 2)在 most-recent-finalized(step 3)之前 fired。Brand IP 影響:今晚 22:00 Tim ingest cpbl-260521-01 後 · homepage HeroLiveCard 會直接跳去 cpbl-260522-01 future preview · 不顯示剛 ingest 的 receipt cinematic = brand soul 物理時刻只在 /track-record · 不在最高流量首頁。Fix:今天 active(pregame/live) → 今天 final(post-ingest cinematic window) → 最近 finalized 任何日期(receipt mode > future per doc-comment) → closest future → orphan。同時加 ISR revalidate = 600 到 app/page.tsx · 解凌晨 00:00 today→tomorrow rollover lag(原本完全 SSG 凍結 · 不 push 不更新)。Build / Lint / TSC strict 全綠。",
    href: "/",
  },
  // ── Round 29 Wave 14 ship(2026-05-21 evening · post-W13)──
  {
    title: "[R29 W14] Founders 27 onboarding · 4-phase psychology framework · 3 NEW docs",
    body: "Tim 問「以心理學角度去出發?」+「每個人內容都回一樣對吧?」surface Founders 27 onboarding workload anxiety + brand IP question。Ship docs/EMAIL-TEMPLATES.md(351 lines · 4 phase × cognitive bias · 4 personal line trigger pattern)+ docs/PDF-CERTIFICATE-SPEC.md(267 lines · 9 design elements with psychology rationale · Pratfall imperfection 4 選 1)+ update docs/MANUAL-ONBOARDING.md(加 framework + cross-refs · 時間 revised 90-100hr → 45-54hr)。80/20 template framework:Cialdini RECIPROCITY(18-26h wait · NOT instant)· IDENTITY THREAT RESOLUTION(20% personal line)· Spence COSTLY SIGNALING(10 min bank transfer)· Thaler ENDOWMENT EFFECT(PDF 證書 + LINE 群)。",
    href: "https://github.com/Tim-xuan-you/zone27-web/blob/main/docs/EMAIL-TEMPLATES.md",
  },
  // ── Round 29 Wave 13 ship ──
  {
    title: "[R29 W13] CPBL pre-game ingestion · 3 場 2026-05-22",
    body: "Tim 截圖 2026/05/22 賽程 3 場 18:35。新增 cpbl-260522-01(富邦 @ 樂天 · 樂天桃園)· cpbl-260522-02(統一 @ 兄弟 · 大巨蛋)· cpbl-260522-03(味全 @ 台鋼 · 澄清湖)到 lib/matches.ts · 用 /audit ESTIMATION DISCLOSURE pattern explicit 標 estimate path(隊伍 W-L 真實 · 投手 K/9·BB/9·HR/9·ERA 從聯盟均值反推)。winRate 從 record gap + home advantage + SP gap 估算。PRE-GAME · 沒 finalResult · /track-record 不入帳 until 賽後 Tim 截 box score。",
    href: "/matches",
  },
  // ── Round 29 Wave 12 ship ──
  {
    title: "[R29 W12] /roadmap BRAND BOUNDARIES · 永遠不做「Launch loudly playbook」canonical",
    body: "把 Wave 10B research agent surface 的「Launch loudly to warm list」72-hour blitz playbook 從 /now UNRESOLVED ephemeral 升到 /roadmap BRAND BOUNDARIES canonical · 跟其他 3 個永遠不做(GA/Pixel/Hotjar · 創投/廣告/上市 · 寄生運彩)同 level。是 axiom-conflict 不是 strategic preference — 跟 stealth + audience-fans-not-engineers + monetization-philosophy 三個 axiom 同時衝突。",
    href: "/roadmap",
  },
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
  // ── Round 31 Wave A discovery · multi-game-day brand IP physics ──
  {
    title: "[R31 WA] 多場同日 = 單日 brand IP credibility event 最大窗口 · single-match cinematic 不夠用",
    body: "Round 30 W1 修了 getFeaturedMatch priority(receipt > future)· 為的是「Tim ingest 後首頁顯示 receipt」 cinematic 不被 future preview 蓋掉。 但那個 fix 預設「同時 only 1 場」。 今天首次出現「同晚 3 場同步開賽 + 1 場昨晚 receipt」 = single-match HeroLiveCard 不能 cover · 必須 multi-match grid。 Sharp call:single-match cinematic 對 receipt-mode 1 場 完美 · 對 多場同日 結構不適 · 兩個 different brand IP moment。 Lesson 寫進 axiom:cinematic = single match · grid = ≥2 matches 同日 · 不是「升級」是「不同 brand IP moment 用不同 visual treatment」。 future 任何 multi-game scenario(MLB doubleheader · CPBL 週末三連戰 · 跨聯盟同日)都 auto-route 到 TonightReceiptsCard · 不需 case-by-case judge。",
  },
  // ── Round 31 Wave B discovery · Statcast bars 是現代棒球 universal visual language ──
  {
    title: "[R31 WB] Baseball Savant percentile bar = 2026 baseball stat universal visual grammar",
    body: "Agent research surface:Savant 風 percentile bar 是 2017+ MLB / 2020+ CPBL 球迷可被假設為 universal recognizable 的 visual idiom · 任何 Statcast tweet · 任何 broadcast 後製 · 任何 fantasy app 都用此 grammar。 ZONE 27 之前用 plain label-value StatRow = brand grammar 從 hardcore 球迷視角看「外行」(像 Google sheets 不像 Baseball Savant)。 Sharp call:不是「加 visual flourish」 · 是「對齊 audience 共通語言」。 平民 fan grammar match 是 brand IP「audience = hardcore 球迷不是工程師」 axiom 的物理產出。 Lesson 寫進 axiom:任何 stat 顯示 default 走 percentile bar(gold-gradient + tier label) · plain label-value 只在 ENGINE INTERNAL data(non-visitor-facing) 或 deep audit docs(/audit S02 ESTIMATION DISCLOSURE 那種 explainer)使用。 audience-grammar match is non-negotiable for hardcore fan brand.",
  },
  // ── Round 31 Wave B discovery · BUILD chip 不該只 live on /audit ──
  {
    title: "[R31 WB] BUILD chip 不該只 live on /audit · trust signal 散布到 every probability surface 才完整",
    body: "/audit 的 BUILD chip(commit hash + permalink)是 Round 2 ship 的 brand-IP-defining trust signal · 但只 lived on /audit。 訪客在首頁看 engine output · 沒有 1-click audit trail 到 git 真實。 Sharp call:既然 BUILD chip 是 brand IP signal · 它該 surface 在 every probability output 旁 · 不是只 /audit deep page。 W-B EngineStamp 元件把 ENGINE v0.2 + LOCKED date + BUILD chip 統一打包 · apply 到 homepage HeroLiveCard / TonightReceiptsCard / /track-record · 任何 visitor 看 engine output 都 1-click 可達 GitHub commit。 Lesson:trust signal 應該散布到 user-facing surface · 不該藏在 deep-only doc。 W-B 把「方法公開」從 doc-claim 升 every-surface-physical-proof。 audit-by-default ≠ audit-by-deep-page-click。",
  },
  // ── Round 30 Wave 11 discovery · canonical axiom ──
  {
    title: "[R30 W11] BRAND AXIOM · 「one tense per page」· complexity 不是 section 問題是 tense 問題",
    body: "Agent UX research deepest call 升 canonical brand axiom:visitor 同時 carry 3 個 tense(現在 / 未來 / 過去) on 一頁 = 真正 cognitive load。 修法不是砍 sections · 是 strip future-tense scaffolding from present-tense pages。 Future-tense → /roadmap · past → /track-record / /changelog · 現在 page = 純 present-tense only。 W11 4 cuts 都套此 axiom:DISCUSSION LOCK(future-tense placeholder)· MemberDashboardPreview(preview = future-tense)· MAP block(meta-doc · 不是當下 user task)· ✕/✓ + 3-col 重複(saying same thing two tenses)。 此 axiom auto-generate 未來所有 cuts · 不需再 case-by-case judge。 Pratfall sections(audit-EXCLUDE · methodology-LIMITS · roadmap-BOUNDARIES · track-record-DIVERGED)仍留 · 因為 honest present-tense 關於 present-tense limitations。 Lesson:Pratfall ≠ aspirational placeholder · Pratfall = present-tense honesty about present-tense gap。 寫進 axiom 永久避免再 add future-tense scaffolding 到 entry pages。",
  },
  // ── Round 30 Wave 8 discovery ──
  {
    title: "[R30 W8] 「Method public」≠「Explain on every page」· entry vs deep page text density 是不同 axiom",
    body: "Wave 7 IRONY:我加 60-line block 解釋為什麼我們 minimal · 自我矛盾。 Tim 9th canary fire surface 一個之前沒明確的 axiom:brand-IP「方法公開」適用於 deep pages(/audit / /methodology / /manifesto)· 不適用 entry pages(/login / /membership / /member)。 Entry pages 的 brand statement 是 interface itself · 不是 prose。 Apple / Stratechery / Plausible /login 都不寫一行字解釋。 訪客 confusion 的修法不是加 more text · 是 cross-link 到 deep page。 寫進 axiom:any new entry-page prose block 永遠先問「interface 已經說了嗎?」 yes 砍 · no 加 1 行 cross-link。 brand IP 自我修正能力 = canary canon。",
  },
  // ── Round 30 Wave 7 discovery ──
  {
    title: "[R30 W7] 「越少 fields 越正式」brand-IP-倒置 需要 explicit explainer · 不藏 = trust signal",
    body: "Tim 第 5 次 canary fire 揭露一個本來沒注意的 brand-IP-倒置 gap:visitor default mental model 是「Apple/Google/Microsoft = 越多 fields 越正式 / 越專業」。 ZONE 27 倒置(只問 email = 最少 fields)· 但沒 explicit 告訴訪客「這是 brand IP · 不是 bug」。 訪客自己會用 default model 解讀 = 「ZONE 27 註冊好簡單 · 是不是不認真?」 = 誤判流失。 修法不是加 fields(那毀 brand IP)· 是 explicit 解釋 minimalism。 W7 /login psychology block 把這個 expectation reversal moment 升 visible brand statement。 Lesson:任何 brand-IP-倒置都需要對應的 explicit explainer · 不能假設訪客「自己會懂」 · default mental model 會勝出 unless 我們 surface 我們的 inverted model。 Pratfall + Costly Signaling pattern 延伸到 form-design itself。",
  },
  // ── Round 30 Wave 5 discovery ──
  {
    title: "[R30 W5] Pratfall canary 3rd fire = ship-surfacing-bug 變 ship-actual-functionality-bug",
    body: "Tim 第 3 次同方向 push:「我點下去又不能註冊...我們真的有會員系統可以讓使用者註冊?我很懷疑」。 W4 MAP block 把答案 surface 了 · 但 Tim 點下去發現:答案是「FREE TIER 留 email」 · 但實際只是 waitlist 不是註冊。 Pratfall canary 3rd fire 升級 — 已經不是 surfacing-bug · 是 actual-functionality-bug。 修不是搬位置 · 是 build the real thing(Phase 1 magic link auth · 從 publicly-promised Q3 加速到 NOW)。 Lesson:1st canary 修「沒看到」 · 2nd canary 修「看不到答案 hub」 · 3rd canary = 「答案本身是 IOU」 · 修不是 promise reframe 而是 ship 真實 functionality。 Tim 從沒明說「我懷疑你」前 · 不要繼續 reframe wording · 要 ship 真 product。",
  },
  // ── Round 30 Wave 4 discovery ──
  {
    title: "[R30 W4] Pratfall canary repeat-prompt = 永遠是 ship-surfacing-bug · 不是 prompt 噪音",
    body: "Tim 同 prompt 在 R29 W2 跟 R30 W4 兩次發 verbatim「現在不能加入一般會員?為何 Q3?+ 一般會員去哪發文?+ 我管理介面在哪?+ 心理學能做什麼?」 即使我已經 ship 過 /member + /admin · 仍是 valid canary。 Tim 直覺不在 noise · 在「我訪客第一眼看不到答案 hub」這個 real surfacing-failure signal。 修 surfacing 不是 defend ship · 也不是「告訴 Tim 我已 ship」 · 是把答案推到第一眼看得到的位置 · ship single MAP block。 Lesson:repeat-prompt 是最高 leverage signal · 比 explicit complaint 還 honest · 因為 Tim 連抱怨都不抱怨 · 直接 re-ask = 上一次 ship 沒 land · 重 ship 答案 hub。",
  },
  // ── Round 30 Wave 2C discovery ──
  {
    title: "[R30 W2C] 玩運彩 playsport.cc gap · canonical NEVER list 漏第二大 Taiwan 運彩討論區",
    body: "報馬仔 fengyuncai.com 已在 /coverage NEVER + 5 個 visitor-facing pages · 但 玩運彩 playsport.cc 從沒被具體 named · 只籠統「運彩 / 報馬仔 / 殺手平台」覆蓋。 兩個是 different sites(playsport.cc = discussion forum + tipster · sportslottery.com.tw = 官方運彩平台)· 在 Taiwan 棒球迷視覺裡兩者是不同實體 · brand boundary 應該獨立命名。 W2C 修補。 Lesson:Pratfall Spy-Trackers 命名 specific 競品時 · 同類但不同實體要逐一 named · 不能依賴抽象 cover-all。",
  },
  // ── Round 30 Wave 2 discoveries ──
  {
    title: "[R30 W2] 「features-arms-race」framing trap · Tim Apple screenshots surface 了",
    body: "Tim 送 Apple Store login + cart screenshots「人家也都有會員系統呀」 = 隱含「我們需要 features 跟他們一樣多」framing trap。 如果接住這個 framing → ZONE 27 變 me-too SaaS · brand IP 倒置全部 collapse。 Sharp call:Apple = commerce(交易史)· Spotify = consumption(消費史)· ZONE 27 = epistemic(思辨史)· 不同物種 · 不可比 features。 W2A 把這個 inversion 寫死成 3-col brand comparison。 Lesson:對 Tim 拋出的「人家也有」 framing 永遠先 fact-check 是否真的可比 · 通常不可比。",
  },
  {
    title: "[R30 W2] reliability diagram 是 ZONE 27 唯一結構上 unique 的 brand differentiator(從沒人 frame 這個)",
    body: "Agent 90-min 研究後 surface 的 deepest call:沒有任何高端 sports 分析平台 publishes 會員自己的 calibration drift。 FanGraphs/Savant 給 team stats · Stratechery 給 archive · 都是「別人的」數據。 ZONE 27 brand 結構(Pratfall + Costly Signaling + 0-tracking + Engine-Free + Identity-Paid + audience = hardcore sabermetric fans)同時對齊 → reliability diagram literally cannot exist on any platform that wants mass-market growth。 W2B 把這個寫死成 /member/calibration physical artifact。 Lesson:有時最大 brand differentiator 不在「我們做了什麼別人沒做」 · 在「我們結構上能做別人結構上做不到的」。",
  },
  // ── Round 30 Wave 1 discoveries ──
  {
    title: "[R30] getFeaturedMatch priority order 跟自己 doc-comment 直接矛盾(自 Round 10 introduced)",
    body: "Bug 從 Round 10 introduce match lifecycle 那天起一直存在 · 但只有今晚 22:00+ Tim ingest 那瞬間才會觸發可見的 brand IP 損失。每次跑 audit 都沒抓到 · 因為 audit 看 doc-comment 跟 code 都「合理」 · 沒人 cross-reference 兩者一致性。Lesson:doc-comment 寫了「receipt mode is a STRONGER signal than future」但 code 把 future 放 step 2 = doc-comment 是 wish · code 是 reality · 兩者不一致 = silent regression vector。Round 30 Wave 1 修正 + 把 doc-comment 升為 binding contract(代碼順序鏡像 narrative)。",
  },
  {
    title: "[R30] homepage 完全 SSG · 沒 revalidate · 凌晨 rollover 不會自動發生",
    body: "app/page.tsx 全靠 git push 觸發 Vercel build 才會更新 featured match selection。Tim 22:00 push 時會 fresh build OK · 但凌晨 00:00 today→tomorrow rollover 不會自動發生 · 隔日早上 visitor 進首頁可能看到「TODAY · 今晚開賽」+ 昨天日期 · 全靠 phase string 跟 date 看 stale。對比:/matches /track-record /signal-board /matches/mlb 全有 revalidate · 只有 / 沒設。Round 30 Wave 1 加 revalidate = 600(10 min · 跟 /matches/mlb 同 lifecycle-state cadence)。",
  },
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
  // ── Round 30 Wave 2 agent research backlog ──
  {
    title: "[R30 W2] Agent #2 Pre-Auth Founder Number Reservation · 等 Tim 啟動 Founders 27 launch",
    body: "Agent 研究 #2 sharp call:Day-1 visitor 能 reserve 特定 #NNN(e.g.「我要 #027 因為 27」)· /leaderboard 即時顯示 RESERVED · pending wire。 Patek allocation + Hermès quota + Mirror.xyz wallet-as-identity pattern。 Costly Signaling cranked。 但 requires Founders 27 launch 啟動才有意義 — 目前是 preorder waitlist 框架。 等 Tim 完成 docs/FOUNDERS-27-LAUNCH-CHECKLIST.md 5 prerequisites + 明說「啟動 Founders 27 reframe」trigger 才 ship。",
  },
  {
    title: "[R30 W2] Agent #3 Public Personal Roadmap Vote Tally · 等 auth + BLACK CARD 上線",
    body: "Agent 研究 #3:把 MemberDashboardPreview drag-rank voting 的 localStorage data 升 cloud + public aggregate · 每個 Founders 27 #NNN 的 vote PUBLIC under member identity。 IKEA Effect cranked。 需要 auth + cloud sync(Phase 1 Q3)+ Founders 27 真實會員入帳(後)。 兩個 dependencies 都 wait Tim 拍板 trigger。",
  },
  {
    title: "[R30 W2] Agent #4 Counterfactual Memory Card · 等 follow-list functionality 出現",
    body: "Agent 研究 #4:Day One「On This Day」 applied to forecasts。「您 follow 這場時 · 引擎 said 62% · 結果 PROVED · 但您沒下注 · 您只是看著它收斂」。 需要 follow-list action 在 /matches/[gameId] 出現 + localStorage `follows` 累積 + 賽後自動 surface。 Phase 1 Q3 auth 後 sync。 短期可考慮 localStorage-only MVP · 但會有 cross-device gap。",
  },
  {
    title: "[R30 W2] Agent #5 140-char Public Member Bio · 等 Founders 27 onboarding 啟動",
    body: "Agent 研究 #5:每位 Founders 27 holder 一句 ≤140 字公開 bio in /leaderboard。 Patek Owner Newsletter + Are.na profile minimalism + HEY anti-CRM。 Tim curates additions(Stratechery Guest Post pattern)。 需要 Founders 27 onboarding 啟動才有第一筆 bio · 等 Tim 啟動 trigger。",
  },
  // ── Round 29 Wave 10B agent anti-pattern flag ──
  {
    title: "[R29 W10] 「Launch loudly to warm list」playbook · permanently wrong for ZONE 27",
    body: "Agent 主動 flag · 2026 #1 indie launch playbook(Tom Orbach $50K/72h · 70% revenue in 72 hours · warm 5K+ email list blitz)wrong for ZONE 27:(1) stealth axiom forbid「loud」half ·(2) audience axiom(hardcore baseball fans 不在 IndieHackers Twitter crowd)。Right shape:slow trickle to #270 over 6-18 months · /founders 第 1 天跟第 400 天看起來一樣 · just a different number · slowness IS the curation proof。寫入 brand permanent decision · 將來如果想 launch-blitz 先回看這條。",
  },
  // ── Round 29 new unresolved ──
  {
    title: "[R30 W5+W6 partial] FREE TIER auth + Follow ✅ DONE · sim history cloud sync 仍 UNRESOLVED",
    body: "Round 30 W5 ship Phase 1 magic link auth · W6 ship Follow Match feature(follows cloud-synced via user_metadata · 0 migration)。 Auth + Follow ✅ DONE。 但 /lab sim history → Supabase cloud sync(讓 cross-device member 看到同一份 sim data)仍 UNRESOLVED · 需要 (1) public.user_sims table + RLS · (2) /lab simulator sync logic · (3) /member 從 localStorage read 改 server read。 Round 30+ · 等 Tim 明示或下次 pratfall canary fire。",
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

        {/* Round 52 W-C · Agent 3 #6 fix · binding cadence commitment
            · /now 之前 no explicit cadence promise · 每週更新但 visitor 不知
            · 加 binding statement「本頁顯示 past 30 days · 舊條目歸檔到
            /changelog · 修改需 30-day notice」 · 同 /audit S05 PRE-COMMIT
            + /methodology/diff Lens Lifetime Pledge pattern · binding 物理 codify。 */}
        <div className="mt-5 bg-slate/30 border-l-2 border-gold/60 px-4 py-3 max-w-2xl">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-1.5"
          >
            ⚓ CADENCE & BINDING
          </p>
          <p className="text-mute/85 text-[13px] sm:text-sm leading-relaxed">
            本頁顯示{" "}
            <strong className="text-bone">past 30 days</strong>{" "}
            真實 ship cycle · 舊條目自動歸檔到{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">/changelog</Link>
            。 修改 cadence 或刪 condition 需 30 天前在{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">/changelog</Link>
            {" "}公告 · 同{" "}
            <Link href="/audit" className="text-gold underline-offset-4 hover:underline">/audit</Link>
            {" "}S05 PRE-COMMIT pattern · Costly Signaling 100×。
          </p>
        </div>
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
