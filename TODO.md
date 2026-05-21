# 📋 ZONE 27 · Owner Pending Actions

> Tim 明早回到電腦前要做的事
> 整理於 2026-05-19 晚上(DAY 1)+ 2026-05-20 整日(DAY 2 · 37 commits)
> + 2026-05-21 開盤(DAY 3 · `/track-record` ledger + match lifecycle)
> + 2026-05-21 接續(Round 2 · 4 commits · `/roadmap` + Cmd-K + 50+ files)

---

## 🚀 Round 2 (2026-05-21 同日) · 自主多輪迭代 · 4 commits

**完整 Round 2 scroll:[WHILE-YOU-WERE-OUT.md](WHILE-YOU-WERE-OUT.md)** — Round 2 prepended

**Round 2 ship list(全程 TIER 1 · Tim 完全沒動手):**

- **`/roadmap`** 第 8 個 trust artifact · 3-stage (LOCKED / EXPLORING / EXPLICIT NO) · OG card · /changelog 雙向 CTA
- **`/not-found` K-strikeout 升級** · 4 canonical 入口 · sabermetric notation
- **Cmd-K 全站快搜 palette** · 23 routes 索引 · 5 groups · ⌘K/Ctrl-K 開啟 · 全 a11y(aria-modal · listbox · focus restore)
- **`/audit` live numeric dashboard** · SAMPLE_SIZE 動態化 · BUILD chip(commit + deploy date) · 6-col MetaPair
- **Homepage TRUST STACK 7→8-doc** · grid lg:cols-4 滿 4+4
- **`app/loading.tsx`** · brand-pure suspense skeleton
- **StatTerm 擴展到 /matches/[gameId]** · ERA/K9/WHIP/BB9/HR9 hover tooltip · 4→5 頁
- **8 個 bug fixes** + **5 audit agent IMPORTANT** + OG glyph hardening
- **2 parallel agents 跑過**(bug audit + world-class brand research)

**Round 2 收盤狀態:**
- User-visible routes:**21**(+ /roadmap + /loading)
- Custom OG cards:**15**(+ /roadmap)
- Trust artifact pages:**8**(+ /roadmap)
- Build / Lint / TSC strict 三綠

**您回來建議流程:**
1. `npm run dev` → http://localhost:3000
2. 試 **⌘K / Ctrl-K** 開 palette · 打「track」「roadmap」「founders」感受快搜
3. `/roadmap` · 滑到底看 EXPLICIT NO section(品牌防線)
4. 首頁 TRUST STACK · 看 8 卡 4+4 layout
5. `/audit` BUILD chip(local dev 是「local」· Vercel deploy 後變真實 commit hash)
6. `/matches/cpbl-260521-01` · hover stat labels 看 tooltip
7. **18:35 後**(賽事真的進行中):HeroLiveCard badge 轉 LIVE
8. **22:00 後**(賽事結束):截 cpbl box score → 貼我 → 我 ingest → ledger 第一筆亮起

---

## 🚀 DAY 3 (2026-05-21) 開盤 · 主動推進 ledger + lifecycle

**完整 DAY 3 scroll:[WHILE-YOU-WERE-OUT.md](WHILE-YOU-WERE-OUT.md)** — DAY 3 prepended

**DAY 3 核心 ship(全程 TIER 1 · Tim 完全沒動手 · Claude 自主推進):**

- **新 trust artifact `/track-record`** · Bloomberg-terminal 公開戰績 ledger · PROVED ✓ 跟 DIVERGED ✕ 等大列出 · 從 N=0 honest empty state 起跳 · custom OG card(8→15)
- **Match 5-phase lifecycle**:future / today-pregame / today-live / final / stale-archived(取代舊 2-state stale/future binary)· 解今晚 18:35 開賽後 HeroLiveCard 沒 badge 的 bug
- **Calibration receipt block** · HeroLiveCard + /matches/[gameId] 賽後自動顯示「ENGINE 預測 X% → 實際 N:N · PROVED/DIVERGED」· 等大顯示不藏 miss
- **lib/matches.ts** 加 5 個 helpers · `isMatchDataToday` · `getMatchPhase` · `getCalibration` · `getEnginePctOnWinner` · `getFinalizedMatches` · Match type 加 `finalResult?` optional field
- **Connectors** · homepage TRUST STACK 6→7-doc + grid lg:3→lg:4 · footer DOCS 加「公開戰績」· /audit Section 08 + /manifesto Section I inline link 到 /track-record · related-links 更新
- **版本 invariant 全站對齊** · REPORT v0.27 → v0.28 · LAST_REVIEWED 2026-05-20 → 2026-05-21(/audit · /coverage · /discipline · /manifesto + 4 個對應 OG cards + footer chip + /founders FAQ)
- **`/changelog`** 加 v0.28 milestone entry · git 仍為 source of truth
- **`docs/MANUAL-ONBOARDING.md`** 加 FINAL SCORE INGEST section(3 分鐘賽後流程)

**Tim 明早回來建議流程:**
1. `npm run dev` → 開 http://localhost:3000 看實際效果
2. 重點看 `/track-record`(空 ledger empty state)· 首頁 TRUST STACK 7-doc · `/matches/cpbl-260521-01` PHASE badge
3. **18:35 後**(賽事真的進行中)看 HeroLiveCard badge 轉 LIVE
4. **22:00 後**(賽事結束)截 cpbl.com.tw 那場 box score → 貼給我 → 我 3 分鐘 ingest finalResult → ledger 第一筆亮起 · PROVED 或 DIVERGED

---

## 🚀 DAY 2 (2026-05-20) 收盤 · 37 commits since /manifesto

**完整 DAY 2 scroll:[WHILE-YOU-WERE-OUT.md](WHILE-YOU-WERE-OUT.md)**(已 prepend DAY 2 區塊)
**已知未做事項:[KNOWN-ISSUES.md](KNOWN-ISSUES.md)** — 給您 onboarding 看「我知道但沒做」清單

**底線:Build ✅ Lint ✅ TSC strict ✅ · 18 routes · 14 custom OG cards · 6 trust artifact pages · WCAG AA 0 fails**

5 輪 audit pass 連續結論 = **PRODUCTION-READY**

**DAY 2 核心 ship:**
- **4 個新 canonical 頁面**:`/manifesto`(6 sections 倒置宣言)· `/learn`(5-min primer)· `/discipline`(Buffett · Musk · Costco 鐵律)· 首頁 BY THE NUMBERS + TRUST STACK
- **`/founders` 兩個 reframe section**:「您不是在買引擎」+「BLACK CARD · 月費賣的是什麼」(回答訪客最深的疑問)
- **13 處 honesty fix**(7 處 Trackman over-claim 全 repo grep-verified purged · 2 處版本 invariant · 2 處首頁 over-claim · 1 處 BLACK CARD mislabel · 1 處 /audit h1)
- **6 個新 OG cards**(/manifesto · /about · /coverage · /privacy · /lab/custom · /faq · /discipline · /signal-board)
- **`<StatTerm>`** Baseball-Savant pattern tooltip(13 stat 字典)
- **WCAG 4.1.3** WaitlistForm a11y fix(role="alert" + aria-live)
- **Footer FUNDED BY FOUNDERS · NO VC · NO ADS · NO TRACKERS** trust line
- **`/manifesto` Section V** SYNTHESIS:**「方法公開 · 品味私藏」**(8 字 framing)

**10 個世界級研究全部 applied:** Linear · Plausible · Anthropic · Baseball Savant · Stripe · Vercel · HEY · Berkshire/Buffett · Costco · Musk · Muji(validation)

**明早您坐到電腦前,建議流程:**
1. `npm run dev` → 開 http://localhost:3000 看實際效果
2. 重點看 `/manifesto`(Section V)· `/learn` · `/discipline` · 首頁 TRUST STACK 6 個 trust 文件集合
3. 翻 [KNOWN-ISSUES.md](KNOWN-ISSUES.md) 知道我刻意沒做什麼 + 為什麼
4. 跟我說「**開始 ② Resend**」啟動 confirmation email 流程
5. 不喜歡任何改動,跟我說我立刻改

---

## 🚀 開新對話窗時 · 複製這段過去就好

**為什麼需要這段:** 新的 Claude 對話沒有累積本對話窗的脈絡。
這段 prompt 讓新 Claude 一秒接上,不必重講歷史。
(個人 MEMORY.md 會自動載入 8 個 brand axiom · 此 prompt 只需點到專案狀態)

**Copy-paste 完整 prompt(v3 · 含 2026-05-20 整日 40+ commit 迭代脈絡):**

```
繼續開發 ZONE 27 — 台灣硬核棒球迷的暗黑黃金級量化分析品牌。

📂 工作目錄:C:\Users\tatay\Desktop\Second\zone27-web
🌐 正式網址:https://zone27-web.vercel.app
📦 GitHub:https://github.com/Tim-xuan-you/zone27-web

【請按以下順序讀完】每份檔都有重要脈絡:

1. CLAUDE.md → 三條鐵律(SEO/社群凍結 + 預算分級 + 品牌/設計鐵律)
2. AGENTS.md → Next.js 16 breaking changes 警告(別寫過時程式碼)
3. WHILE-YOU-WERE-OUT.md → 2026-05-19 晚 16 輪研究 + 迭代紀錄
4. KNOWN-ISSUES.md → 已知但刻意延後的事項(別重新挖)
5. ADMIN-PLAN.md → 會員管理 + 數據三階段策略
6. docs/MANUAL-ONBOARDING.md → Founders 27 手工 onboarding 完整流程
7. supabase/migrations/0001_waitlist.sql → DB schema(RLS-locked + SECURITY DEFINER 函式)
8. TODO.md → 您正在讀這份(代辦事項清單)

【MEMORY.md 自動載入 8 個 brand axiom · 您不必再讀】:
  · user_tim · feedback_phone_vs_computer · feedback_persona_invocation
  · zone27-supabase-architecture · zone27-coverage-philosophy
  · zone27-monetization-philosophy · zone27-disclosure-philosophy
  · zone27-musk-methodology · zone27-payment-architecture
  · feedback_auto_push_zone27 · feedback_no_rest_zone27

【目前技術狀態(2026-05-20 收盤 DAY 2 v4)】:
- **18 user-visible routes** + **14 custom OG cards** · Build/Lint/TSC strict 三綠 · 5 輪 audit pass PRODUCTION-READY
- Supabase Tokyo 上線:waitlist 表 + 2 個 SECURITY DEFINER 函式 + RLS lock-down + Vercel env vars 已設
- **6 個 trust artifact pages**(40+ sections of disclosure):
  /audit(8s)· /methodology(10s)· /coverage(6s)· /privacy(8s)· /manifesto(6s + Section V SYNTHESIS)· /discipline(5s · Buffett+Musk+Costco)
- **5 個新 brand-defining 內容**(全部 DAY 2):
  /manifesto 倒置宣言 · /learn 入門 primer · /discipline 鐵律 · /founders 2 reframes · 首頁 BY THE NUMBERS + TRUST STACK
- **8 字品牌 grammar 寫進品牌 IP:「方法公開 · 品味私藏」(SHOW YOUR WORK · KEEP YOUR SOUL)**
- StatTerm tooltip(Baseball Savant pattern · 13 stat 字典)
- Footer FUNDED BY FOUNDERS · NO VC · NO ADS · NO TRACKERS(Plausible 風格 anti-VC trust line)
- WCAG 4.1.3 Status Messages compliance(WaitlistForm aria-live)
- /founders WaitlistForm 接 DB · WAITLIST · N · LIVE 指示器
- Channel attribution(?ref= → DB source)+ CopyLinkButton 帶 Web Share API
- Trackman over-claim grep-verified purged from 7 places(/about /glossary /methodology /lab/custom /matches[gameId] /methodology REF /lab)
- 版本 invariant 全站對齊(REPORT v0.27 · ENGINE v0.2 · LAST_REVIEWED 2026-05-20)

【商業狀態】:
- Founders 27:NT$ 2,700 一次性 · 限量 270 名 · **手工銀行轉帳(per
  [[zone27-payment-architecture]])** · 5.4 個月 break-even
- 7 位 forged(hardcoded · 待 Q3 2026 manual onboarding 啟動)· 263 名額
- BLACK CARD:NT$ 499/月 · TapPay 訂閱 · 預計 2026 Q3 上線
- 自動 push 政策:Claude 直接 push zone27-web · 不問 Tim · 直到買品牌域名
- 鐵律:Claude **永遠不說「休息 / 明天 / 晚安 / take a break」**

【三條 TIER 預算】:
- TIER 1(免費 + 註冊 + 小錢)→ Claude 可主動推進
- TIER 2(交易費 + 中等月費)→ 必須問 Tim
- TIER 3(NT$3K 以上 / 法律 / 廣告)→ 絕不主動建議

【未完成的 Tim 親自動作】:
- ② Resend 註冊(5 min · 解 confirmation email · 仍 pending)
- CPBL 真實資料 ingestion(3 min 截圖 cpbl.com.tw 給 Claude)
- Footer 版本 chip bump v0.27 → v0.28(Tim 拍板的時機)
- 品牌域名購買(等 Tim 決定名稱:zone27.tw / .app / .cc / .io)

【手機 vs 電腦 規則】:
Tim 可能在電腦前或外面用手機 · 訊息很短/casual 時請先問
「您現在在電腦前嗎?」再決定要不要 walk-through 註冊步驟。

今天我要做的事:[ 這裡填入您今天要的具體任務,或留空讓 Claude 接 TODO ]
```

**最短版**(如果您只想快速接上):

```
繼續 ZONE 27 開發。專案在 C:\Users\tatay\Desktop\Second\zone27-web。
請依序讀 CLAUDE.md → AGENTS.md → WHILE-YOU-WERE-OUT.md → KNOWN-ISSUES.md → TODO.md。
MEMORY.md 自動載入 brand axiom · 不必再讀。
2026-05-20 完成 40+ commit:Supabase 上線、4 brand axiom 落地、手機 UX 大改、
brand inversion section 上線、Web Share API 上 CopyLinkButton。
Build/Lint/TSC strict 三綠。Footer 仍 v0.27 等 Tim bump。
今天我要做:[ 填入任務,或留空讓 Claude 接 TODO ]
```

---

## 🛡️ 已驗證不走的路線(避免新對話窗踩雷)

### ❌ 台灣運彩(article.sportslottery.com.tw)爬蟲
- **技術:** HTML 不含賽事資料,需 headless browser
- **戰略:** 從博彩平台抓資料會綁定 ZONE 27 與博彩,違反 /about /faq 已寫死的定位
- **結論:** 不爬。同邏輯也適用報馬仔(fengyuncai.com)

### ❌ 寄生任何台灣運彩 / 報馬仔 / 殺手平台
- 同上,品牌信譽自殺

### ✅ 可走的真實資料來源
- **MLB Stats API**(已上線)
- **手動 CPBL 示範資料**(已上線 + 已標記)
- **未來 stats.cpbl.com.tw 官方公開資料**(需 headless 或等他們開 API)

---

## 🌅 明早優先 · 共需 ~10 分鐘 · 全部 TIER 1 免費

### ① Supabase 註冊(5 分鐘) · 🔥 最高優先

**為什麼:** 把 Founders 27 等候名單從「躺在 Vercel logs 裡」升級成「真正可查詢、可 export、可寄信」的資料庫。這是 ZONE 27 launch-ready 解封清單的第一個 blocker。

**完全免費** — Supabase free tier 給 500MB 資料庫 + 50K 月活,我們的 270 個創始會員放在裡面只佔不到 0.1%。

**操作步驟:**

1. 打開 https://supabase.com
2. 右上角點 **「Start your project」**
3. 跳出登入選項 → 選 **「Continue with GitHub」**(用您現有的 Tim-xuan-you 帳號)
4. 進入後選 **「New project」**
5. 填入:
   - **Organization**:預設(您個人 org)
   - **Project Name**:`zone27` 或 `zone27-prod`
   - **Database password**:點 **「Generate a password」**(自動生成,我們不需要)
   - **Region**:**Tokyo (ap-northeast-1)** 或 **Singapore (ap-southeast-1)**(離台灣最近)
   - **Pricing Plan**:確認是 **Free**
6. 點 **「Create new project」** → 等 ~1 分鐘 provision

**Provision 完成後:**

1. 左邊側欄點 **「Project Settings」**(齒輪 icon)
2. 點 **「Data API」** 或 **「API」**
3. 您會看到兩個值:

```
Project URL          https://xxxxxxxxxxxxxxxxxxxx.supabase.co
anon public key      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(很長)
```

**回來給 Claude 的東西:**

直接貼到對話框:
```
URL: https://xxxxxxx.supabase.co
ANON_KEY: eyJhbGc...
```

✅ **anon public key 是設計給前端公開用的,貼這裡完全安全。**
❌ 但 `service_role` key 絕對不要貼(Claude 也不需要)。

---

### ② Resend 註冊(5 分鐘) · 高優先

**為什麼:** 讓 waitlist 表單送出後**自動寄一封確認信給訪客**。
這是「真實在收名單」的最後一塊拼圖 — 訪客填完 email 收到信,才會相信您真的在做事。

**完全免費** — Resend free tier 每天 100 封,我們現在距離爆掉還很遠。

**操作步驟:**

1. 打開 https://resend.com
2. 右上角 **「Sign Up」** → 選 **「Continue with GitHub」**(或 email 註冊)
3. 進入後左邊側欄點 **「API Keys」**
4. 點 **「Create API Key」**
5. 填:
   - **Name**:`zone27-prod`
   - **Permission**:選 **「Sending access」**(只能寄信,不能讀資料)
   - **Domain**:**「All Domains」**(我們之後可以加 zone27.tw)
6. 點 **「Add」** → **立刻複製顯示的 API Key**(只會顯示一次)

**回來給 Claude 的東西:**

```
RESEND_API_KEY: re_xxxxxxxxxxxxxxx...
```

---

## ⏳ 之後再做(優先序低 · 不急)

### ③ 買正式品牌網域(NT$ 300-500/年) · 中優先

**為什麼:** 從 `zone27-web.vercel.app` 升級到 `zone27.tw` / `zone27.app` 之類專屬網域 — 品牌正式感 + SEO 強化。

**但有前提:** 需先決定品牌正式網域名稱。可選:
- `zone27.tw` — TW 版,本地市場感
- `zone27.app` — 國際版,科技感
- `zone27.cc` — 短而潮
- `zone27.io` — 矽谷感
- (或其他)

**操作步驟:**(等您決定名字後再看)

1. 推薦的註冊商:
   - **Cloudflare Registrar**(成本價,不灌水)
   - **Porkbun**(便宜)
   - **Namecheap**(常見)
2. 註冊完成後到 Vercel:Settings → Domains → Add → 輸入您的網域
3. Vercel 會給您 DNS 設定,您回註冊商套用

**回來給 Claude:** 告訴我新網域,我幫您更新 `lib/metadataBase` 與所有相關設定。

---

### ④ GitHub Copilot 訂閱($10/月) · 低優先 · 完全可選

**為什麼:** 讓您自己改程式碼時有 AI 自動補完。如果您未來想自己改改文案或微調,有 Copilot 會快很多。

**但您現在不需要** — 因為您有我(Claude Code),目前所有改動都我做。

**有興趣再做就好:** https://github.com/features/copilot

---

## 🚫 三條鐵律提醒(我永遠遵守)

從 CLAUDE.md 抄到這裡,讓您隨時看得到:

### 🚫 SEO 解凍條件
不主動加 sitemap / robots / Google Analytics / Search Console,直到下列全 ✓:
- [ ] Supabase 後端就緒(← 明天 ① 解鎖)
- [ ] 真實 CPBL 賽程爬蟲每日運轉
- [ ] 付款機制或明確等候名單流程(← 明天 ① + ② 解鎖)
- [ ] 所有 BETA 標籤合理化
- [ ] 品牌資產定版(可能含網域 ←③)

### 🚫 社群帳號 / 上線推廣文 解凍條件
需 Tim **明確說出**「啟動社群」「現在發 IG」「幫我寫上線文」等指令。**模糊指令「您決定」不解封。**

### 💰 預算紀律 v2
- 🟢 TIER 1(免費 + 註冊 + 小錢)→ Claude 可主動建議 + walk-through
- 🟡 TIER 2(交易費 + 中等月費)→ 必須明確問 Tim 才執行
- 🔴 TIER 3(NT$3K 以上單筆 / 法律 / 廣告)→ Claude 絕對不主動建議

---

## 🌙 今晚先去休息吧

ZONE 27 v0.27 已經完成度極高:
- ✅ 24 個 routes 全綠燈
- ✅ MLB 真實資料 × Lab 引擎合體
- ✅ 自動部署 6 連成功
- ✅ 三條凍結令永久寫入

**明早您回來時,告訴我您準備好做 ① Supabase 註冊,我就一步一步陪您走。**

或者只說「**幫我跑 TODO**」,我會自動找到這份檔案接續工作。
