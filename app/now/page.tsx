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

const LAST_UPDATED = "2026-05-22";
const CYCLE = "Round 28-31 · 2026-05-22 · 多 wave 大 push · TONIGHT 3 receipts + Savant bars + critic-hardening + signature + CPBL auto-fetch + 「我看 ___」 personalization + Open Allocation Ledger";

const SHIPPED_THIS_CYCLE: { title: string; body: string; href?: string }[] = [
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
