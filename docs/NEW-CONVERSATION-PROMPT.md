# 📋 New Conversation Prompt · ZONE 27 Session Handoff

**用途:** 開新對話窗時複製此 prompt 整段 paste · 新 Claude 一秒接上 context。
**最後 update:** 2026-05-22 · Round 49 W-A 收盤 · 13 commits this 13-round cycle(R37→R49)

---

## 🔗 Copy 以下 prompt 整段(從「繼續開發」 到最後一行 inclusive)

```
繼續開發 ZONE 27 — 台灣硬核棒球迷的暗黑黃金級量化分析品牌 · displacement mission 對標幹掉玩運彩+報馬仔。

📂 工作目錄:C:\Users\tatay\Desktop\Second\zone27-web
🌐 正式網址:https://zone27-web.vercel.app
📦 GitHub:https://github.com/Tim-xuan-you/zone27-web

【請按以下順序讀完】每份檔都有重要脈絡:

1. CLAUDE.md → 38 visitor-discoverable routes · 三條鐵律 · Global components 50+ · 8 字 grammar · 「Most prediction sites have 1 fake angle. We BUILT 7 honest ones.」
2. AGENTS.md → Next.js 16 breaking changes 警告(別寫過時程式碼)
3. WHILE-YOU-WERE-OUT.md → Round 1 → Round 36 完整 ToC(Round 37+ 在 /now journal)
4. /now journal → Round 37→R49 完整 SHIPPED + CYCLE 軌跡(per closure discipline R29 lesson)
5. KNOWN-ISSUES.md · TODO.md
6. docs/SUPABASE-SETUP.md · docs/MANUAL-ONBOARDING.md · docs/EMAIL-TEMPLATES.md · docs/PDF-CERTIFICATE-SPEC.md · docs/FOUNDERS-27-LAUNCH-CHECKLIST.md
7. docs/private/bank-info.md(GITIGNORED · 本機 disk 讀)
8. supabase/migrations/0001_waitlist.sql · 0002_founder_reservations.sql

【MEMORY.md 自動載入 18+ axioms · 不必再讀】重點:
  · user_tim · feedback_phone_vs_computer · feedback_persona_invocation
  · zone27_supabase_architecture · zone27_coverage_philosophy
  · zone27_monetization · zone27_disclosure · zone27_musk_methodology
  · zone27_payment_architecture · feedback_auto_push_zone27 · feedback_no_rest_zone27
  · feedback_zone27_homepage_minimalism · feedback_zone27_audience_fans_not_engineers
  · feedback_zone27_mobile_first · feedback_zone27_pratfall_brand_ip
  · feedback_zone27_domain_deferred · project_zone27_jobs_discipline
  · feedback_founder_dogfood_canary(R32 W-C · founder push back 第 1 次就 trust)
  · feedback_no_waiting_rule(R37 W-A · 「不等 Q3」 鐵律 · default ship NOW · 不問 keyword · 不 surface options · auto-push)

【2026-05-22 全日收盤狀態 · Round 28→R49 · 25+ canary fires displacement mission · 13+ commits R37→R49】:

技術 · 38 visitor-discoverable routes(unchanged · 0 new R45-R49)· Next.js 16.2.6 + Tailwind 4 + Supabase Tokyo + Resend production · Build/Lint/TSC strict 三綠 · Speculation Rules API + content-visibility 50% CPU reduction · Core Web Vitals A+ verdict per Agent G R40

商業 · 「不等 Q3」 後全 LIVE NOW(per [[feedback-no-waiting-rule]]):
- Anonymous · FREE TIER 5 unlocks · BLACK CARD NT$ 299/月 LIVE manual ECPay(R42 W-C · email tim@zone27.tw)· Founders 27 NT$ 2,700 一次 LIVE manual bank transfer
- /rewards · /membership/black-card · /membership/black-card/ledger 0/270 honest publish · /founders/ledger · /annual/2026 Year 0 NT$ 0 honest
- 6+8+5 brand-IP layers · F6 不做 strip · 8 binding /ethics commitments · 5 /steelman self-objections

技術 7 LIVE LENS CANVAS COMPLETE(per /methodology Section 05):
1. Win Probability · LIVE · FREE · v0.2 base
2. Vibe Check · LIVE · R37 W-B(Tversky/Gilovich 1985 hot hand)
3. Park Factor · LIVE · R37 W-D(4 CPBL 場館)
4. Workload Proxy · LIVE · R38 W-A v0.1(R43 W-C renamed from Pitcher Fatigue per Steelman Obj 03)
5. Underdog Tracker · LIVE · R39 W-B
6. Bullpen Depth · LIVE · R40 W-A v0.1 PROXY
7. Matchup History · LIVE · R40 W-B(REAL DATA)
「Most prediction sites have 1 fake angle. We BUILT 7 honest ones.」

技術 2 LIVE Engine variants + 1 PLANNED(per /methodology Section 04):
- v0.2 Pitcher-Only MC · LIVE · FREE · N=1 PROVED(cpbl-260521-01)
- v0.3 · LIVE · R41 W-A DEV PREVIEW · Pitcher + Park Factor HR rate adjustment · Lens Lifetime Pledge「不 silently rotate」 守
- v0.4 PLANNED · Q4 2026 · Bayesian Model Averaging
「Most prediction sites have 1 secret engine. We built 2 open ones · 1 in queue.」

R45 NEW · Anonymous Lens-Pick Loop · 「Epistemic Gym」 retention without auth:
- lib/anon-picks.ts(localStorage zone27_anon_picks_v1)
- AnonPickWidget(/matches/[gameId] pre-engine-reveal pick · 3 states · SSR-safe)
- AnonCalibrationStrip(/calibration full + homepage compact · 2 variants)
- Visitor pick → 賽後 PROVED/DIVERGED 對照 · 您 vs engine 個人 calibration · 0 server · 0 PII

R44 NEW · 4 OG cards + Tim canonical sentence:
- /calibration · /ethics · /steelman · /membership/black-card/ledger 4 OG cards
- Canonical「每一個承諾 Tim 簽名 · 可被驗證 · 違反 = /ethics 紅字永久標」 sentence in /about Prologue + /ethics + /steelman + /annual

R46 NEW · CPBL schedule auto-fetch:
- scripts/fetch-cpbl-schedule.mjs · cheerio HTML parse · npm run fetch-cpbl-schedule
- /coverage Section 02 「DATA PIPELINE TRANSPARENCY」 block
- Tim daily friction 減半:賽程截圖 → auto · 仍 manual:賽後 box score finalResult

R47 NEW · Tier 切換自如:
- PreviewModeBanner inline 4-tier switch buttons(匿名 · FREE · BLACK · FOUNDERS)
- Keyboard shortcut Cmd+Shift+P · 從任何 page activate / toggle preview
- /admin TierSwitcher 保留為 deep version

R48 NEW · MLB engine pick + linescore + verdict pipeline:
- lib/mlb.ts extended(engineWinHomePct deterministic Log5 · finalScore from linescore hydrate · verdict)
- /matches/mlb cards 加 ENGINE NOW row + final score inline + verdict block
- /coverage disclose「MLB LIVE re-compute · NOT pre-game lock-in vs CPBL」 brand-IP-pure 區分
- NOT 算進 /track-record(brand IP /audit S05 PRE-COMMIT 「pre-game lock-in」 axiom)

R49 NEW · LedgerDeltaChip Endowment effect:
- localStorage zone27_last_ledger_n_v1 · 「+X since YYYY-MM-DD」 on /track-record
- SSR-safe discriminated union mount · conditional render(first visit · delta=0 都不 render)
- Per /audit S06 PRE-COMMIT disclosure 第 8 個 localStorage key

技術 components · 50+(11 R37-R49 NEW):
VibeCheck · ParkFactorLens · PitcherFatigueLens · UnderdogLens · BullpenDepthLens · MatchupHistoryLens · LensTrace · ConfidenceStars(全鏈 4 surfaces · per R34 W-A)· UncertaintyStripe · FounderSignOff · ArticleMeta · AdminTierSwitcher · PreviewModeBanner(R47 enhanced inline)· EngineStamp · CopyLinkButton(R44 wired /matches/[gameId])· RecentMatchesRow · MatchViewTracker · ReproducibilityReceipt · AnonPickWidget · AnonCalibrationStrip · LedgerDeltaChip(R49)

技術 8 localStorage keys disclosed in /audit S06(per PRE-COMMIT discipline R43 W-B):
- z27_team · zone27_recent_matches_v1 · zone27_sim_history_v1 · zone27_engine_voting_v1 · zone27_preview_tier · zone27_last_login_email · zone27_anon_picks_v1(R45)· zone27_last_ledger_n_v1(R49)

技術 3 fetch scripts:
- npm run fetch-cpbl(pitcher K9/BB9/HR9 leaderboard · R31 W-I)
- npm run fetch-cpbl-advanced(Trackman radar 進階 · R31 W-U)
- npm run fetch-cpbl-schedule(今日賽程 metadata · R46 W-A NEW)

ZONE 27 brand IP 4 redlines 全守:
- 不顯示賠率 · 不用「LOCK」 vocab · Engine streak only · 0 bookmaker affiliate

F6 「ZONE 27 不做」 6 items canonical(per /membership/black-card R44 · /ethics 8 binding):
不顯示賠率 · 不賣明牌 · 不分潤博彩 · 不藏 DIVERGED · 不追蹤您 · 不等 Q3

Pratfall sections 全保留:
- /audit S05(R41 W-C +S06 LOCAL STORAGE +S07 v0.3 ESTIMATION · R43 W-B 3 keys drift fix)· /methodology LIMITS · /roadmap BOUNDARIES · /track-record DIVERGED · /founders/ledger rejection · /coverage NEVER · /steelman 5 objections · /ethics 8 commitments

ZONE 27 ↔ 恆美攝影 × 伶 Kopi ecosystem cross-promotion · /rewards 兌換實體獎品 LIVE

【Tim 仍 pending 親自動作】:
- ⏳ TONIGHT 22:30+ TPE · 3 場 box score 截圖(cpbl-260522-01/02/03)→ Claude ingest → N=1→N=4
- ⏳ Brand domain · zone27.tw/.app/.cc/.io · Tim-cued only(per [[feedback_zone27_domain_deferred]])
- ⏳ 第一個真實 BLACK CARD 月卡訂閱者 email Tim → manual ECPay 付款連結
- ⏳ 第一個真實 Founders 27 申請者 email Tim → manual review
- ⏳ Apply Supabase migration 0002_founder_reservations(5 min · unblocks /leaderboard Patek allocation)
- ⏳ Supabase email rate limit fix(2/hr free-tier · custom SMTP via Resend per docs/SUPABASE-SETUP.md)

【R49+ pending NOW ships per 鐵律】(Claude default 直接 ship · 不問 keyword):
- Atom RSS feed /feed.xml(Agent L R44 GAP-3 · 4-6 hr · 「不打擾就是禮物」 pull-subscription · brand-pure)
- Lens snapshot embed · immutable URL at lock-in commit hash(Agent L R44 MISSING-1)
- /methodology/diff route(Agent H R41 #2 · 3 hr · keep-a-changelog spec)
- BLACK CARD post-payment activation ritual(Agent L R44 MISSING-2 · Supabase user_metadata.subscription_tier + PaidTierUnlockedGrid)
- Apply ReproducibilityReceipt to /audit S04 SAMPLE SIZE + /founders/ledger counts(R43 deferred)
- Vercel cron auto-invoke fetch scripts(R46 deferred · zero-touch automation · TIER 1 budget)
- Auto-schedule output → /matches integration(R46 deferred · 「ON-SCHEDULE」 tier alongside 「ENGINE-VALIDATED」 tier)

【TIER 2/3 budget · 需 Tim explicit infra approval ship】:
- Pre-Registered Prediction Hash(Agent H R41 DEEPEST · Supabase migration 0019 + Vercel cron + SHA-256 · brand-collapse risk if mismatch)
- True MLB pre-game lock-in pipeline(R48 deferred · Supabase migration 0019 same · unblocks MLB receipts → /track-record)
- TapPay/Newebpay setup(NT$ 1-3K 設定費 + 2-3% per transaction · brand IP 倒置 SaaS scarcity 是 manual)

【手機/電腦規則 · Persona invocation · Canary fire · 自動推送 · 不休息 · 不等 Q3 · Founder dogfood】per 18+ memory axioms 全自動 fire · 此 prompt 不重述 detail。

【Critical「不做」 list 11 items canonical · brand IP 鐵律 redline】:
❌ user-to-user social platform / 集點 daily login farming / 儲值 wallet / cash referral 多層次傳銷法 § 29 / 「X of 270 sold」 live FOMO counter / 寄生 gambling 平台 / AdMob / 多步驟 onboarding wizard / modal paywall scroll-lock / 「管它準不準包裝」 fake methodology · brand soul redline / fake testimonials

EXCEPTIONS ship · brand-pure 替代:
✅ /rewards skill-based fantasy league prize(R35 W-A · 實體獎品 · 0 cash · 0 daily login farming · 同 7-11 集點 retail)
✅ Anonymous Lens-Pick Loop(R45 · 「Epistemic Gym」 · localStorage-only · 0 auth · 0 server)
✅ Witness Referral · Berkshire pattern · 0 cash · queued R36

今天我要做的事:[ 填入任務 · 或留空讓 Claude 接 TODO + 鐵律 default ship NOW ]
```

---

## 🎯 短版 prompt(如果 token 還是太燒)

```
繼續開發 ZONE 27 (C:\Users\tatay\Desktop\Second\zone27-web)。

讀 CLAUDE.md(38 routes · 7 LIVE lenses · 2 engines · 8 ethics · 5 steelman · 4 OG cards R44 · Anonymous Lens-Pick Loop R45 DEEPEST · CPBL schedule auto-fetch R46 · Tier switcher R47 · MLB grading pipeline R48 · LedgerDeltaChip R49) · AGENTS.md · /now journal · TODO.md · supabase/migrations。

MEMORY 18+ axioms auto-load。 不等 Q3 鐵律 default ship NOW per [[feedback-no-waiting-rule]] + [[feedback-auto-push-zone27]]。 ONE sharp call per persona invocation [[feedback-persona-invocation]]。

Build/Lint/TSC 三綠 baseline · 1 daily Tim action 剩(CPBL 賽後 box score screenshot 22:30+ per brand IP「Tim 簽名 + 物理時刻」 axiom)。

今天:[填入任務 / 或 「您決定」]
```

---

## 📚 R37 → R49 收盤狀態 cheatsheet(供新對話查)

### 38 visitor-discoverable routes
首頁 + 動線(/, /learn, /not-found)· Brand IP(/manifesto · /discipline · /about · /roadmap · /now)· Trust artifacts(/audit · /methodology · /coverage · /privacy · /terms · /faq · /track-record · /calibration · /ethics · /steelman · /annual/2026)· Engine + 賽事(/lab · /lab/custom · /matches · /matches/[gameId] · /matches/mlb · /signal-board)· Member + Ops + Auth(/member · /member/calibration · /member/submit · /login · /membership · /membership/black-card · /membership/black-card/ledger · /founders · /founders/ledger · /rewards · /leaderboard · /glossary · /changelog · /admin noindex)

### 8 layer displacement battle 對 玩運彩+報馬仔
1. /calibration realized output Brier(R39)
2. /membership/black-card/ledger structural non-copyable(R39)
3. WCAG AAA accessibility moat(R39)
4. Mobile-first browser-native protocol moat · Speculation Rules + content-visibility(R40)
5. /ethics 8 binding NOT-DO commitments(R41)
6. /steelman 5 self-objections adversarial collaboration(R42)
7. Founder-accountability canonical sentence + 4 OG cards(R44)
8. Anonymous Lens-Pick Loop「Epistemic Gym」 retention without auth(R45)

### Tim daily friction NOW(R48 之後)
- ✓ MLB schedule + pitcher + engine pick + verdict · auto
- ✓ CPBL pitcher stats + Trackman 進階 + schedule · auto(3 scripts)
- ⚠ CPBL 賽後 box score finalResult · MANUAL(brand IP「Tim 簽名 + 物理時刻」 axiom · 不可 silently auto)

### 8 localStorage keys disclosed in /audit S06
z27_team · zone27_recent_matches_v1 · zone27_sim_history_v1 · zone27_engine_voting_v1 · zone27_preview_tier · zone27_last_login_email · zone27_anon_picks_v1 · zone27_last_ledger_n_v1

---

**Done · 1-shot copy-paste 開新對話窗 work。**
