// ── ZONE 27 · Atom Feed Items ───────────────────────────
// Round 51 W-E · Atom RSS feed source · hand-curated ship cycle entries
// 給 hardcore fan RSS reader audience subscribe。 訪客 1 micro-action
// 把 zone27-web.vercel.app/feed.xml 加進 Feedly / NetNewsWire / Reeder
// 等 RSS reader · 之後 Tim ship 新 round 自動 surface · 不靠 email · 0
// tracking · 0 push notification · 0 cookie。
//
// Brand IP fire:
//   - Audience-fans-not-engineers · hardcore fan demographic uses RSS
//     (FanGraphs / Baseball-Reference 老牌 fan 都有 RSS feed)
//   - Disclosure(canonical)· publish ship cycle 變 syndicatable format
//   - 0 tracking · RSS poll 是 client-initiated · 0 server-side tracking
//   - Anti-email-dependency · 訪客不需 give email 即可 stay updated
//
// 不是 full /now SHIPPED_THIS_CYCLE history dump · 是 most-recent
// cycle 的 curated ship list(R50 + R51)· keep feed actionable not
// archive。 Tim ship 新 round 時手動 update 此 array · 同 Tim 親手 ingest
// CPBL box score axiom · 1-step manual curation · brand-pure 物理時刻。
// ─────────────────────────────────────────────────────

export type FeedEntry = {
  /** Stable Atom entry id · derived from slug · never changes after publish */
  id: string;
  /** Entry title · 同 /now SHIPPED title pattern */
  title: string;
  /** Short summary · 1-2 sentences · displayed in RSS reader list */
  summary: string;
  /** Full content body · 1-2 paragraphs · expanded view */
  content: string;
  /** Permalink path · 訪客 click feed entry 跳此 page */
  href: string;
  /** ISO date · YYYY-MM-DD format · published date */
  updated: string;
};

/**
 * Feed metadata。 Updated date = most recent entry date · used as feed-level
 * <updated> tag。 Self-link = canonical /feed.xml URL · used as feed atom:id。
 */
export const FEED_META = {
  title: "ZONE 27 · Craft Journal",
  subtitle: "硬核棒球迷量化分析品牌 · ship cycle updates · brand-pure transparency",
  link: "https://zone27-web.vercel.app/",
  selfLink: "https://zone27-web.vercel.app/feed.xml",
  authorName: "Tim",
  // R72 W-D · Agent B audit F03 fix · authorEmail sweep · R71 W-E F03
  // 8-file sweep missed this · public RSS feed exposed dead domain ·
  // visitors clicking mailto from Feedly/Reeder get bounce · brand IP
  // 「Tim 親手 onboard」 promise fail。 tatayngiti@gmail.com aspirational
  // future tim@zone27.tw post-domain-launch swap-back per /audit S05。
  authorEmail: "tatayngiti@gmail.com",
  language: "zh-TW",
  // R238 · R237② · Atom <rights> 只需版權聲明 · 拿掉「MIT / source code」
  // 開源招牌(站上任何訪客面不再 feature 開源 · RSS reader 也是訪客面)。
  rights: "© 2026 ZONE 27",
} as const;

/**
 * Atom feed entries · hand-curated · most-recent ship cycle first。
 * 每 R50+ ship 後 prepend new entry · 同 /now SHIPPED_THIS_CYCLE pattern。
 */
export const FEED_ENTRIES: FeedEntry[] = [
  {
    id: "r51-w-d-transparency-aggregator",
    title: "[R51 W-D] /transparency aggregator route · Anthropic 模式",
    summary:
      "Audit aggregator route NEW · 6 sections 統一 surface LIMITS / NEVER / DIVERGED / commitments / data sources / audit trail · transparency 升 first-class navigable destination。 R164 collapsed into /audit canonical hub per Apple discipline。",
    content:
      "Agent 1 world-class niche subscription audit synthesize · Anthropic /transparency pattern · 把分散在 8 個 trust artifact pages 的 transparency content 聚合一個 navigable destination · 升 first-class brand axis · 不再是 footer link / about page bottom 隱藏。 6 sections + custom OG card + wired CommandPalette / Footer DOCS column 1 / RelatedReading · 訪客 1-click 從 homepage 到完整 audit 摘要 · 再 deep-dive 對應 artifact。 Brand IP triple-fire(Disclosure + Pratfall + Costly Signaling)同時 ship。 R164 W-DELETE · collapsed into /audit canonical hub per Apple discipline + Tim canary fire「網站沒救了 · 頁面多到一個離譜」。",
    href: "/audit",
    updated: "2026-05-22",
  },
  {
    id: "r51-w-c-trust-conversion-loops",
    title: "[R51 W-C] Trust artifact conversion close · /ethics + /steelman + WCAG AA",
    summary:
      "5 brand strengthening · /ethics + /steelman 加 conversion CTA at page end · /about Ch07 mailto:tim@zone27.tw accountability · Homepage F6 strip + Footer WCAG AA contrast fix。",
    content:
      "Agent 3 conversion funnel audit synthesize · trust pages 讀完訪客是 strongest warm-up state · 必須 trust loop close to GOLD / BLACK entry · 不 dump 到 navigation 即跑路。 加 explicit conversion sections + 2 primary CTA chip。 同時 WCAG AA contrast fix · homepage F6 declarative strip dividers 加 aria-hidden + text-mute/60 → text-mute (5.6:1 AA pass) · Footer FUNDED row text-mute/70 → text-mute/85。",
    href: "/ethics",
    updated: "2026-05-22",
  },
  {
    id: "r51-w-b-funnel-cross-links",
    title: "[R51 W-B] 7 funnel + cross-link fixes · Agent 3 conversion audit synthesize",
    summary:
      "/lab empty state ship 3-card grid(WHITEPAPER + TRACK RECORD + POWER USER)· /lab pre-sim credibility anchor · /audit S01 加 v0.3 v0.4 engine cross-link · /steelman → /annual/2026 · /track-record → /calibration anonymous note · /lab + /lab/custom Tim signature。",
    content:
      "Agent 3 critical findings:訪客 cold land /lab 沒比賽 = dead-end power-user form。 修 ship 3-card grid 對應 audience entry(理論派 → /methodology · skeptic → /track-record · hardcore fan → /lab/custom)。 + pre-sim credibility anchor「✓ 公開戰績 PROVED / DIVERGED 等大列出 →」 · NN/g Halo Effect 訪客 trust threshold 降低。",
    href: "/lab",
    updated: "2026-05-22",
  },
  {
    id: "r51-w-a-critical-bug-fixes",
    title: "[R51 W-A] 3 critical bug fixes · Agent 2 audit synthesize",
    summary:
      "/login handleResend 砍 signInWithOtp 改 supabase.auth.resend canonical API · friendlyPasswordError 砍 stale「忘記密碼」 references 改 mailto:tim@zone27.tw · /api/submit session email strict validation 砍 anonymous@unknown 假 fallback。",
    content:
      "Agent 2 bug + a11y + perf audit synthesize · ship 3 critical TIER-0 fixes。 R50 W-F 砍 magic link mode 後 handleResend 仍 wired to UI 但 logic 錯(call signInWithOtp 不是 resend confirmation)· 修為 supabase.auth.resend({ type: 'signup' })。 friendlyPasswordError 提到「忘記密碼」 button 已 R50 W-F 移除 · ghost text 指向不存在 UI · 修為 mailto:tim@zone27.tw real recovery channel。 /api/submit 「anonymous@unknown」 fallback 違反 PII inventory · 修為 strict validation + 401 reject。",
    href: "/login",
    updated: "2026-05-22",
  },
  {
    id: "r50-w-f-login-password-only",
    title: "[R50 W-F] /login password-only · 砍 magic link mode toggle",
    summary:
      "Tim 27+ canary 「2 個都存在好困擾」 · Hick's Law 教科書 case · founder dogfood signal trump abstract axiom · /login -130 / +68 行 · 淨砍 62 行複雜度。",
    content:
      "Tim founder dogfood signal · 5+ time canary fire 拒 magic link(per R30 W14 lesson)· trust。 砍 AuthMode type · 砍 mode state · 砍 submitMagicLink function · 砍 SubmitState magic_link_sent variant · 砍 mode toggle button · simplify handleSubmit / handleResend / SentState 整套。 /login 變單一 form · 4 layer 視覺(email · password · submit · 3-line hint)。 「忘記密碼」 future case 走獨立 /reset page · 不再 inline toggle modes。",
    href: "/login",
    updated: "2026-05-22",
  },
  {
    id: "r50-w-e-footer-f-pattern",
    title: "[R50 W-E] Footer F-pattern reorder · PRODUCT 升 column 1 · /matches 補洞",
    summary:
      "Nielsen Norman 1997 canonical · Footer column 順序 ENTRY-BRAND-DOCS-ENGINE → PRODUCT-DOCS-ENTRY-BRAND · ENGINE rename「賽事 · 引擎」 · 加「今日 CPBL 賽事」 +「MLB · 即時資料」 兩 product entries。",
    content:
      "Tim 26+ canary「點出來的頁面都是無關緊要的」 第 4 連 surface · footer 0 個 賽事 entries · 修。 訪客 scroll 到 footer F-pattern desktop 第一眼看到 PRODUCT entries · 第二 DOCS · 第三 ENTRY · 第四 BRAND。 對 fan filter-in:product first 順序通順 · 對 賭徒 filter-out:DOCS column 2 trust artifacts 第二眼 surface 自然 signal。",
    href: "/",
    updated: "2026-05-22",
  },
  {
    id: "r50-w-d-nav-hierarchy",
    title: "[R50 W-D] Nav 三軸線 visual hierarchy · 「賽事 TONIGHT N」 dynamic chip",
    summary:
      "Round 22 「conversion = gold pill」 visual primitive 延伸到 product items · 「賽事」 加 dynamic「TONIGHT N」 chip from getTodayMatches() · 訪客 1 微秒 parse path 不必逐字 read。",
    content:
      "Tim 26+ canary 第 3 連 surface · 5 nav items 視覺等重 mute text = O(N) cognitive 而非 O(1) visual scanning。 修 4-axis hierarchy:conversion = gold pill / product = mono + dynamic chip / identity = pure mute / auth = pure mute / power user = icon。 「TONIGHT N」 dynamic chip server-side getTodayMatches() · 80% 球季時間 visible · 20% off day collapse plain · 不是 FOMO counter(賽事天天有 · 非稀缺)。",
    href: "/",
    updated: "2026-05-22",
  },
  {
    id: "r50-w-c-homepage-funnel-invert",
    title: "[R50 W-C] Homepage funnel invert · prediction-first per Hick's Law deeper",
    summary:
      "Hero 順序 slogan → 「不做」 list → prediction 改為 slogan → prediction → 「不做」 list。 fan filter-in 第一步看到 product · 不是 brand declaration。",
    content:
      "Tim 26+ canary「點出來的頁面都是無關緊要的」 第 2 連 surface · 真實 funnel-order bug · 不是 brand pivot(賭徒 framing reject)· 是 first-touch ordering 違反 Hick's Law deeper formulation。 訪客 first-touch 必須是 PRIMARY product moment · 不是 brand differentiation declaration。 純 JSX 重 order · 0 brand redline violation · 「不做」 list 仍 first-fold below(scroll 1-2 viewport 即見)· 對 fan 通順 · 對 賭徒 filter-out 維持。",
    href: "/",
    updated: "2026-05-22",
  },
  {
    id: "r50-w-b-login-entries",
    title: "[R50 W-B] 4 LOGIN entry · Apple/Stripe navigation IA fix",
    summary:
      "Round 3 disabled login button 移除後 9 個月 lag bug · R30 W5 /login LIVE 後沒人 re-add Nav entry。 修:Nav desktop + Nav mobile + Footer ENTRY + Mobile sticky bar secondary 4 處 LOGIN entries 物理 codify。",
    content:
      "Tim 26+ canary fire「進入會員系統不是很簡單嗎? 不就是輸入帳號密碼進入? 為何這麼簡單的事情, 我們網站辦不到?」 · root cause 不是 brand · 是 IA。 訪客 Cmd-K 找「login」 OK · 但輕度 user 不知 Cmd-K · 必須 Nav 右上「Sign in」 button 永久 visible(Apple / Stripe / Linear / Vercel 標準)。 新 NavLoginCTA auth-aware client island · anonymous 顯「登入」 · logged-in 隱藏。 + Footer ENTRY group + Mobile sticky bar secondary chip 同步 ship。",
    href: "/login",
    updated: "2026-05-22",
  },
  {
    id: "r50-w-a-methodology-diff",
    title: "[R50 W-A] /methodology/diff · v0.2 → v0.3 entire delta · brand IP triple-fire",
    summary:
      "「Most prediction sites have 1 secret engine. We built 2 open ones.」 不止 claim 2 engines · ship 整份 v0.2 → v0.3 delta · 同 React.dev release notes / Stripe API changelog / Anthropic model card revision pattern。",
    content:
      "Tim 留空指令 → 鐵律 default ship NOW · 接 R50+ TODO 第 1 條。 7 sections:14 unchanged constants + 1 new(HR_PARK_SENSITIVITY = 0.5)+ 5 行 logic delta + 4 場館 worked example(新莊 ×0.9842 / 桃園 ×1.0316 / 大巨蛋 ×1.0105 / 澄清湖 ×1.0158)+ 6 件 v0.3 不修正 Pratfall list(BABIP / dimensions / weather / batter splits / DH / N≥30)+ v0.4 PRE-COMMIT + Lens Lifetime Pledge anchor。 brand IP triple-fire 同時 fire:Disclosure(publish entire delta)+ Pratfall(主動列 6 件 not-fixed)+ Costly Signaling(賣明牌的站結構性無法 ship 同頁)。 第 9 layer displacement moat vs 賣明牌的生意。",
    href: "/methodology/diff",
    updated: "2026-05-22",
  },
];
