@AGENTS.md

# ZONE 27 · Project Strategy Notes

## 📋 Owner Pending Actions

**Active owner-side checklist lives in `TODO.md`** at the repo root.

When the user invokes generic actions like "guide me through registration",
"幫我跑 TODO", "現在來做註冊的事", or returns from a break — open
`TODO.md` first to find what they're waiting to do, and resume from there.

Current pending (as of 2026-05-20 DAY 2 collapse):

✅ ① Supabase signup — **DONE** · RLS-locked + 2 SECURITY DEFINER 函式 · Tokyo region
⏳ ② Resend signup (5 min) → unlocks confirmation emails
⏳ ③ Brand domain purchase (after name decision · zone27.tw / .app / .cc / .io)
⏳ ④ Footer chip bump v0.27 → v0.28 (Tim 拍板 milestone)
⏳ ⑤ CPBL screenshots ongoing → Tim 截圖 + Claude ingest(已 ship 第一場 2026-05-21 統一 vs 富邦)
⏳ ⑥ Optional · 截圖 cpbl 球員 profile 右滑顯示 K/BB 真實值 → 升級 estimate 為真實數據



## 🚫 SEO / Discoverability — FREEZE UNTIL LAUNCH READY

**Owner directive (2026-05-19, Tim):**

> SEO + Google Search Console + sitemap + robots + Analytics 放最後,
> 等網站完整準備上架之後再來處理。

**戰略邏輯:** 目前處於 stealth mode。所有「讓 Google 找得到」的動作
全部凍結。等到網站完整準備好(真實 CPBL 數據、真實會員、真實付款 /
名單)再一次性引爆 SEO blitz,讓品牌以完整姿態被全世界看到,而不是
半成品。

### ❌ 在「launch ready」之前,絕對不要加:

- `app/sitemap.ts` / `sitemap.xml`
- `app/robots.ts` / `robots.txt`
- `@vercel/analytics` 套件
- `@vercel/speed-insights` 套件
- Google Tag Manager / Google Analytics 4
- Search Console 驗證 meta tag
- Schema.org JSON-LD 結構化資料
- 任何「主動向搜尋引擎宣告存在」的動作

### ✅ 可以保留的(對 launch 前的私下分享也有用):

- 每頁的 `<metadata>` title / description(瀏覽器分頁、私下分享 OG)
- `app/opengraph-image.tsx`(社群分享預覽卡)
- `app/icon.tsx`(瀏覽器分頁 favicon)
- robots meta tag 預設(Next.js 預設不會阻擋,但也不主動 ping)

### 🎯 何時可以解封?

當以下全部 ✓ 才開始 SEO blitz:

- [ ] Supabase 後端就緒(登入、Founders 27 等候名單實際儲存)
- [ ] 真實 CPBL 賽程爬蟲每日運轉
- [ ] 付款機制或明確的等候名單收集流程
- [ ] 所有 BETA 標籤已升級或合理化
- [ ] 品牌資產定版(完整 logo、brand guide、社群帳號)

---

## 💰 預算紀律 v2 — 三級分類(2026-05-19 v2 更新)

**Owner directive update (2026-05-19, Tim):**

> 如果只是要註冊或者花一點錢,這些我都可以接受!花大錢,目前生不出來。

**戰略邏輯:** ZONE 27 預算規則從「全凍結」改為**三級分類**。
小錢可以、註冊可以,但「大錢」依然 OFF。

### 🟢 TIER 1 · 可以主動建議 + 主動執行(註冊免費 / 必要小成本)

- **Supabase 註冊**(free tier 完全夠用,需 Tim 動 5 分鐘建帳號)
- **Vercel KV / Upstash Redis** 免費 tier(10K commands/day)
- **Resend 註冊**(free tier 100 emails/day · 給 waitlist 寄通知信夠用)
- **Plausible Analytics**($9/mo · 解封 SEO 時再啟用)
- **Cloudflare 免費 plan**(DNS + 基本 CDN)
- **品牌網域註冊**(.com / .tw ~NT$300-500/年 · Tim 已表態這算「小錢可接受」)
- **GitHub Copilot** 個人版($10/mo · 如果 Tim 想加速自己改程式碼)

### 🟡 TIER 2 · 需明確同意才執行(中等成本 · 通常按交易收費)

- **TapPay / Newebpay / 綠界**(支付閘道 · 設定費 NT$1-3K + 抽 2-3% 每筆)
- **Stripe**(設定免費但每筆 3.4% + NT$10)
- **付費 Vercel Pro**($20/mo · 目前 Hobby 完全夠用,不需升級)
- **Supabase Pro**($25/mo · 等 waitlist 突破 50K 才需要)
- **Postmark / SendGrid 付費版**(MAU 突破 free tier 才需)

### 🔴 TIER 3 · 永遠先問再說(大錢)

- **Sportradar / Stats Perform / Pinnacle**(體育資料 API · 年費 NT$200K+)
- **公司登記 / 商業執照**(NT$10K+ 與會計持續成本)
- **付費律師審查 Privacy / Terms**(NT$50K+)
- **付費品牌設計師 / 攝影 / 影片**(NT$30K-300K+)
- **付費廣告投放**(任何 ad spend)
- **任何單筆超過 NT$ 3,000 的 SaaS 訂閱**

### 🎯 解封觸發

- **TIER 1**:Claude 在「您決定」這種模糊指令下**可以主動建議**並 walk Tim through 註冊步驟,但**最後執行還是要 Tim 動手**(畢竟是他的帳號)。
- **TIER 2**:遇到時 Claude **必須明確列出費用** + **問 Tim「這個錢您現在能花嗎?」** · 不假設同意。
- **TIER 3**:Claude **絕對不主動建議**。遇到 Tim 提到時,先列出**所有 free / TIER 1 替代方案**,確認他真的要花大錢才動。

### 📊 目前已上線的 TIER 0(完全免費)資源

- ✅ Vercel Hobby(部署)
- ✅ GitHub 個人(原始碼)
- ✅ MLB Stats API(資料)
- ✅ Vercel logs(臨時 waitlist)
- ✅ localStorage(sim history)
- ⏳ Supabase(待 Tim 註冊後接入 — v0.28 建議)

---

## 🚫 社群帳號 / 上線推廣文 — FREEZE UNTIL TIM SAYS GO

**Owner directive (2026-05-19, Tim):**

> 起品牌社群帳號 + 寫上線文(IG / Threads / X)也是放到最後!
> 我需要時會跟您說。請記得!

**戰略邏輯:** 不要在 stealth mode 期間自作主張幫 Tim「先卡個 IG 帳號」
或起草上線公告。社群第一印象只有一次,Tim 會決定何時、用什麼語氣、
從哪個平台引爆。

### ❌ Claude 絕對不要主動做的事:

- 提議「我幫你寫一篇 IG / Threads / FB / X 上線文吧?」
- 草擬任何「ZONE 27 正式上線!」風格的社群貼文
- 建議申請 / 註冊 @zone27 / @zone27tw / 任何品牌社群帳號
- 為 ZONE 27 撰寫「品牌故事」社群發文模板
- 在網站中加入「Follow us on Instagram / Threads / X」連結
- 為 ZONE 27 設計社群頭像 / 封面 / 卡片
- 規劃「launch day campaign 倒數時程」
- 引導使用 anthropic-skills:battle9th-fb-writer 等社群文案技能來推 ZONE 27

### ✅ 可以主動做的事:

- 維持 `opengraph-image.tsx`(供 Tim 私下傳網址時用)
- 在 `/founders` 等頁面加 waitlist 表單(這是被動,訪客上門才動作)
- 維護品牌資產(logo、配色)以便 Tim 將來自己用

### 🎯 何時可以解封?

當 Tim **明確說出**以下其中一句才能動作:

- 「幫我寫上線文」/ 「幫我發 IG / Threads」
- 「現在可以開社群帳號了」
- 「啟動社群行銷」
- 或任何包含「現在 / 開始 / 啟動 / 上線」+「社群 / IG / 發文 / 推廣」
  的明確指示

**模糊指令(例如「您決定下一步」)不算解封。** 遇到模糊指令時,
請繼續從產品 / 後端 / 內容深度方向尋找下一步。

---

## 📐 品牌 / 設計鐵律(由 Tim 拍板)

- **配色:** 深藏青 `#0F1A2E` × 冷金 `#D4AF37` × 骨白 `#F5F2EA`
- **字型:** Geist Sans(內文) + Geist Mono(數字/標籤)
- **語氣:** 量化分析師,不是博彩公司。永遠談「機率」而非「鐵口直斷」
- **Slogan:** 「不靠直覺,只看演算法」/「We Don't Guess. We Compute.」
- **禁止:** AdMob、宮廟風配色、閃爍 Banner、紅綠對比、可愛圖案

## 🏛️ 商業模式定錨

- **Free Tier:** 看得到基本數據,不能參與
- **BLACK CARD:** NT$ 299 / 月 — 黑金訂閱會員,5% 創作者抽成(Round 33 reprice 499→299 per agent NT$ 200-450/月 benchmark band sweet spot · Netflix Premium NT$ 390 comparable)
- **FOUNDERS 27:** NT$ 2,700 一次性 / 限量 270 名 / 終身 / 創作者 0% 抽成
- **拒絕:** 廣告營收(AdMob 永久封殺),只走 Premium Sponsor

## 🤝 生態系連動

ZONE 27 與 **BOTTOM 27**(Tim 的棒球手遊)是雙生品牌:

- 數字「27」共用(本壘最後一個出局數 / 完美比賽)
- 視覺系統共用(深藏青 + 冷金)
- 創始會員可獲得 BOTTOM 27 獨家虛擬資產
- 未來 BOTTOM 27 內的頂級玩家可被引流到 ZONE 27 預測社群
- 兩者**物理隔離開發**(獨立資料夾、獨立 Claude Code 視窗)

實體面整合恆美攝影 × 伶 Kopi 旗艦店 — 黑金會員出示 QR 享一品紅茶招待。

---

## 🗺️ 當前路由(v0.28 · Round 30 W5-W14 + Round 31-41 · 2026-05-22 · 37 visitor-discoverable · v0.29 等 Tim 拍板 milestone · +/calibration +/membership/black-card/ledger +/ethics · 7 LIVE LENS CANVAS COMPLETE + 2 LIVE Engine variants(v0.2 + v0.3 R41 W-A)+ 1 PLANNED(v0.4 Bayesian)· 「Most prediction sites have 1 fake angle. We BUILT 7 honest ones.」 + 「Most prediction sites have 1 secret engine. We built 2 open ones.」)

```
首頁 + 動線
/                        首頁 · 3 sections (Round 3 Apple-style: Hero + HeroLiveCard + Founders strip)
                         · Round 5 mobile 3-viewport · Round 8 sticky CTA via StickyFoundersCTA
                         · Round 28 HeroLiveCard 加 UncertaintyStripe + 蒙地卡羅 /learn 連結
                         + 「不接受下注」defang + 賽後收據 /track-record permanent link
/learn                   5 分鐘入門 primer · 給沒聽過 Bill James 的人(3 chapters)
                         · Round 28 Chapter 03 footer 改 /about → /membership(P2.3)
/not-found               K-strikeout 404 · sabermetric notation

Brand IP(canonical · opt-in 深度)
/manifesto               倒置宣言 · 6 sections + Section V SYNTHESIS「方法公開·品味私藏」
/discipline              鐵律 · Buffett + Musk + Costco + Jobs 四人共識(Round 17 加 Jobs)
/about                   七章節品牌方法論 · Round 28 加 Chapter 07 OPERATIONS(MAINTAINER · BUILD CADENCE
                         · RESPONSE TIME · SCORE INGEST · FOUNDER ONBOARDING)
/roadmap                 公開路線圖 · LOCKED / EXPLORING / BRAND BOUNDARIES
                         · Round 28 加 ArticleMeta + FounderSignOff
/now                     **NEW Round 28** · Linear-style craft journal · 3 sections(SHIPPED ·
                         DISCOVERED · UNRESOLVED)· 完整時間軸三角:/changelog 過去 + /now 現在
                         + /roadmap 未來 · 沒有 weekly schedule promise

Trust artifacts(全部 Round 28 加 FounderSignOff)
/audit                   Model Report · 5 sections · Section 05 Disclosure Philosophy canonical
                         · Round 28 Section 02 加 ESTIMATION DISCLOSURE block(K/9·BB/9 estimate
                         surface 從 lib/matches.ts 註解到 /audit · Pratfall surface)
/methodology             技術白皮書 · 4 sections · Round 28 ABSTRACT ±2% 改寫為「引擎內部一致性」+
                         明示 N≥30 SAMPLE DEBT 還沒解 · 加 ArticleMeta 6 min + FounderSignOff
/coverage                覆蓋範圍 · 6 sections + NEVER list · ArticleMeta 8 min + FounderSignOff
/privacy                 隱私政策 · 8 sections(含 anti-tracking inventory)
/terms                   服務條款
/faq                     honest answers(動態計數)
/track-record            公開戰績 ledger · PROVED + DIVERGED 等大 · N=0 honest empty state
                         · Round 28 加 ArticleMeta N= SAMPLE DEBT live chip + FounderSignOff

Engine + 賽事(只 1 場真實 cpbl-260521-01 · per Day 3 placeholder purge)
/lab                     即時 Monte Carlo 模擬器(逐打席模型 v0.2)· Round 28 加 post-sim
                         TRUST LOOP 2-card row(/track-record + /founders)
/lab/custom              自訂任意投手對戰
/matches                 今日賽事板(CPBL)
/matches/[gameId]        SSG 詳情 · cpbl-260521-01 統一 vs 富邦 2026-05-21 18:35 新莊
/matches/mlb             MLB 即時資料(每 10 分鐘 ISR)
/signal-board            每日量化早報
/leaderboard             THE 27 WALL · 270 創始席位視覺化
/founders                Founders 27 銷售頁 · Round 28 FROM THE FOUNDER 引用 dedupe(原本跟
                         /about Chapter 05 重複 · 改為 Chapter 05 不同句「直覺說書人」+ Bloomberg analog)
                         · Round 31 W-X2 Hermès counter pivot(砍 e-commerce FOMO live counter)
/founders/ledger         **NEW Round 31 W-S** · Open Allocation Ledger · 4 brand IP axiom 同時 fire
                         (Pratfall + Costly Signaling + Disclosure Philosophy + 倒置 SaaS)·
                         每週手寫 update · 公布拒絕原因 sample(去 PII)· 公布通過率 · 公布規則 ·
                         其他 luxury 品牌(Patek · Hermès · Tesla)做 process transparency 但
                         沒人公布拒絕 · ZONE 27 因 disclosure-first 結構性可以做 · pre-launch
                         empty scaffold + 5-step allocation rules pre-committed · ArticleMeta 3min
                         + FounderSignOff · Round 32 W-A custom OG card(4 axiom chips)
/membership              4-tier ladder 總覽(Round 25 NEW · Round 27 Footer + Cmd-K 全鏈)
                         · Round 30 W4 MEMBER SYSTEM MAP + Round 30 W11 cuts(MAP + 4-paragraph
                         Creator Permissions → PermLine 1-liners · 10→7 sections)
/membership/black-card   **NEW Round 31 W-X3** · BLACK CARD 訂閱會員 UI preview · NT$ 299/月(Round 33 reprice from 499)·
                         5 unlocks(賽事發言 / 創作者抽成 5% / 每月 voting / Tim 工程筆記 full /
                         Founders 27 LINE 群 access)· payment flow MOCKUP(disabled · 2026 Q3
                         上線)· 5 FAQ · ArticleMeta 4min + FounderSignOff · Round 32 W-A custom
                         OG card(PRE-LAUNCH badge + 5 unlocks)
/glossary                27 industry stats(10+10+7)+ 5 Z27 LEXICON = 32 entries(Round 13 加 lexicon)
/changelog               精簡版本紀錄 · GitHub commits 為 source of truth

Member + Ops + Auth(Round 29-30)
/member                  **Round 29 → Round 30 W5 auth-aware** · 動態 ƒ(cookies)·
                         Session 存在 = 真實 FREE TIER 會員 dashboard(歡迎 banner +
                         登出 button + AUTHENTICATED chip)· 無 session = 4 sections
                         psychology-driven preview + /login CTA · Pratfall surface
                         工程現狀 · launch timeline 公開(Phase 1 ✅ DONE R30 W5 ·
                         Phase 2 Q3+ TapPay · Phase 3 Q4+ CMS)· Round 30 Wave 2A
                         加 3-col Apple/Spotify/ZONE 27 brand comparison + epistemic
                         mirror CTA
/member/calibration      **NEW Round 30 W2B + W10 personal mode** · agent-research
                         deepest call · sabermetric reliability diagram(45° line)·
                         ZONE 27 是唯一發布會員自己 calibration drift 的高端 sports
                         品牌 · Pratfall + Costly Signaling axiom 同時 fire ·
                         Round 30 W10 加 server-side personal mode(filter finalized
                         by user follows)· chip 切 ✓ YOUR · N=X / GLOBAL · N=X ·
                         現在 N=1(cpbl-260521-01 PROVED · 第一個 gold dot 落點 65
                         bin)· inline SVG 0 deps · 1d revalidate
/member/submit           **NEW Round 30 W10** · FREE TIER 投稿 · session-gated form ·
                         title + body · POST /api/submit · sendSubmissionNotification
                         via Resend → Tim Gmail · 0 server-side archive · pure Tim-
                         curate model · 1/週 cadence · Stratechery Guest Post pattern
/login                   **NEW Round 30 W5** · Phase 1 magic link auth · Tim Pratfall
                         canary 3rd fire 之後從 Q3 promise 加速到 NOW · /login email
                         入口 + Supabase signInWithOtp · 沒密碼 / 沒 OAuth / 沒 social
                         login · 1 個欄位 1 個動作 1 封 email · client component
/auth/callback           **NEW Round 30 W5 · internal redirect** · 收 magic link
                         ?code= → exchangeCodeForSession → 設 HTTP-only cookies →
                         redirect /member?welcome=true · 失敗 redirect /login?error=...
                         · 不在 Cmd-K · 純技術路徑
/auth/signout            **NEW Round 30 W5 · internal redirect** · POST 路徑 · /member
                         登出 button submit 過來 · clear session cookies + redirect
                         / · 不在 Cmd-K
/admin                   **Round 29 · noindex** · Tim's ops dashboard preview ·
                         live KPI numbers(waitlist · founders state · ingest queue)·
                         Stage 1 reality(Supabase Studio 連結)+ Stage 2 mockup ·
                         不出現在 Cmd-K · 對齊 noindex 框架

OG + favicon + chrome
/icon                    Z27 monogram favicon
/opengraph-image         全站 fallback OG card
/[18 routes]/opengraph-image  18 個 custom OG cards(Round 29 加 /member · /admin 無 OG · 因 noindex)
/loading.tsx             Brand-pure suspense skeleton(Round 2)
```

## ⚙️ Global components(Round 2/5/12/28/30/31)

- `<CommandPalette />` · 全站 ⌘K/Ctrl-K palette · **36 visitor-discoverable routes** 索引(R30 W10 加 /member/submit · R33 W-E 加 /annual/2026 · R31 W-S 加 /founders/ledger · W-X3 加 /membership/black-card · R39 加 /calibration + /membership/black-card/ledger 後 · /admin · /auth/* 不在 palette)(layout.tsx)
- `<VibeCheck />` (Round 37 W-B · components/) · streak descriptive lens · Tversky/Gilovich 1985 hot hand fallacy disclaimer · /matches/[gameId] section 01B
- `<ParkFactorLens />` (Round 37 W-D · components/) · 4 CPBL 場館 home advantage visualizer · lib/cpbl-parks.ts reference data · ESTIMATE methodology + PR invitation · /matches/[gameId] section 01C
- `<PitcherFatigueLens />` (Round 38 W-A · components/) · v0.1 PROXY · WHIP + BB9 + K9 季累計 derive command stability · v0.2 commit to rest_days + season_ip ingestion · /matches/[gameId] section 01D
- `<LensTrace />` (Round 38 W-H · components/) · Smashing Magazine 2026 「AI Transparency · Dynamic Checklist」 pattern · 5-step deterministic pipeline trace · ENGINE_V02_TRACE_STEPS preset · NOT chatbot widget · /matches/[gameId] section 01A
- `<UnderdogLens />` (Round 39 W-B · components/) · 黑馬機率 lens · upset probability + dominance gap · 0 contrarian play · 0 prediction 偏置 · 純 viz from existing winRate data · /matches/[gameId] section 01E
- `<BullpenDepthLens />` (Round 40 W-A · components/) · v0.1 PROXY · team recent W-L derive late-inning resilience proxy · v0.2 commit to bullpen ERA + IP usage + last 7d ingestion · /matches/[gameId] section 01F
- `<MatchupHistoryLens />` (Round 40 W-B · components/) · 7th LIVE Lens Variety · real H2H from finalized matches.ts · N=0/1 educational lens · N≥10 真實 trend · /matches/[gameId] section 01G · 7-LENS CANVAS COMPLETE
- `<CmdKTrigger />` · 雙 variant:
  - `variant="chip"` (default) · Nav 右上方 ⌘K 提示按鈕(desktop)
  - `variant="icon"` (Round 12) · Nav mobile 2nd row 右側 ⌕ 圖示(palette 全站可達)
- `<StickyFoundersCTA />` · 行動版 sticky bottom CTA bar · 全頁顯示(**除 /founders + /lab/custom · Round 12 fix:/lab 復原 sticky · /lab/custom 仍隱藏因有 power-user form**)
- `<ProvenanceStamp />` (Round 12) · ENGINE v0.2 · BUILD {SHA} · MATCH {id} citation footer · 自動加在 MatchSimulator 內 → 用於 /lab + /lab/custom + /matches/[gameId] · Patek/Bloomberg/academic citation pattern
- `<UncertaintyStripe />` (Round 28) · Binomial CI gradient bar · 50% (dark) + 90% (light) 在 win-probability % 下方 · HeroLiveCard + MatchSimulator · Bank of England fan-chart convention · 2026 canonical visual moat for quantitative analytics brand
- `<FounderSignOff />` (Round 28) · 3-sentence first-person paragraph + signed `— TIM · FOUNDER · {date}` · 5 trust docs(/audit · /methodology · /coverage · /track-record · /roadmap)+ /now · patio11/DHH pattern
- `<ArticleMeta />` (Round 28) · Reading-time chip + optional N= SAMPLE DEBT chip(Z27 LEXICON UI primitive · threshold 30 Bill James 慣例)· /methodology · /coverage · /roadmap · /track-record · /now · /member · /admin
- `<MemberDashboardPreview />` (Round 29) · client component · 把 visitor localStorage sim history 用「您的引擎時間軸」 framing 顯示(Endowment Effect)· 4 sections · 4 cognitive bias driven · 用於 /member · SSR-safe mount flag pattern
- `<FollowMatchButton />` (Round 30 W6) · client · 3 states(loading / anonymous / ready)· 用 Supabase auth.users.user_metadata.followed_matches JSONB 存 · 0 migration · /matches/[gameId] + /member 整鏈
- `<MatchNoteEditor />` (Round 30 W9) · client · 私人 match note(280字)· 也用 user_metadata · /matches/[gameId] logged-in only
- `<FounderPickForm />` (Round 30 W12) · client · Founders 27 Patek allocation pattern · 選 #008-#270 → public RESERVED · 等 Tim apply migration 0002
- `<MiniMatchCard />` (Round 31 W-A) · compact static-engine card · pre-locked prediction · 不 re-simulate · brand IP 防 sample-gaming
- `<TonightReceiptsCard />` (Round 31 W-A) · phase-aware multi-match grid · header + 3 MiniMatchCards + cumulative track record footer · 當日 ≥2 場 替代 HeroLiveCard
- `<StatPercentileBar />` (Round 31 W-B) · Baseball Savant 風 gradient bar · 冷金 → 骨白 → mute · TIER label · 5 stat presets · CPBL league reference range
- `<EngineStamp />` (Round 31 W-B) · Vercel + Plausible datestamped trust signal · ENGINE v0.2 · LOCKED {date} · BUILD {sha} · BUILD chip 直連 GitHub commit

## 📦 技術棧

- Next.js 16.2.6 (App Router + Turbopack)
- TypeScript 5 (strict mode)
- Tailwind CSS 4(於 `globals.css` 用 `@theme inline`,**沒有** `tailwind.config.js`)
- Geist Sans + Geist Mono(`next/font/google`)
- Vercel(部署) · GitHub(原始碼)
- 後端: **Supabase Tokyo (ap-northeast-1)** · waitlist 表 RLS-locked + 2 個 SECURITY DEFINER 函式(reserve_waitlist_spot + get_waitlist_count) · NEXT_PUBLIC_SUPABASE_URL + ANON_KEY 在 Vercel env vars
- MLB 資料:MLB Stats API(免費官方)· 每 10 分鐘 ISR
- CPBL 資料:**Tim 手動截圖 + Claude 解析 ingest**(暫定 path C · cpbl.com.tw 是 Vue SPA · 沒有 public API)
- 引擎 v0.2:逐打席 Monte Carlo · client-side(訪客瀏覽器內跑 10K sims · ~2 秒收斂)

## 🎯 8 字品牌 grammar(寫進 /manifesto Section V)

> **「方法公開 · 品味私藏」**
> **SHOW YOUR WORK · KEEP YOUR SOUL**

> **「不靠秘密賺錢 · 靠紀律」**(/discipline · Buffett + Musk + Costco 共識)
