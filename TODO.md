# 📋 ZONE 27 · Owner Pending Actions

> Tim 待動作清單 · 最後更新 2026-05-30(R174 · Polymarket 合法版 pivot 拍板)
> Session R137-R173 = 37 rounds · R163-R164 NUCLEAR DELETE saga(12 routes 砍 · 7188 lines removed · 60+→~48)·
> R171-R172 pricing total redesign(Annual 1/1 270 reset · BLACK CARD NT$ 500/31 天 抽 10% · Founders 27 NT$ 2,700/365 天 抽 5%)·
> R173 site-wide pricing-consistency sweep(half-applied 殘留全清 · 13+ RENDERED surfaces 對齊 canonical)· 三綠 TRUE per R131
> **R174 商業模式 pivot「台灣版 Polymarket 合法版」拍板** · 免費引擎 + 群眾市場 + 創作者賣分析抽傭 + 海選排行榜 ·
> 會員不限量(砍 270 cap · 前 270 拿創始徽章)· 詳見 CLAUDE.md 頂部 PIVOT 段 + memory/project_zone27_polymarket_pivot.md
>
> **歷史 round scroll 在 [/now journal](app/now/page.tsx) + [WHILE-YOU-WERE-OUT.md](WHILE-YOU-WERE-OUT.md)** ·
> 此 TODO.md 只保留 current pending Tim 親手動作 · Apple discipline subtraction-first

---

## ⏳ 仍 pending Tim 親手動作

### ✅ 已解決並驗證(R185 live-test · 2026-06-02)· 押注 + 發表 + 錢包 + 買文章 RPC 全部 LIVE

之前怕的 SQL bug(`submit_prediction` / `submit_creator_post` 的 `created_at` ambiguous →
前端 graceful catch 成假訊息「系統開通中」)**已不存在於 prod**。 R185 自建測試帳號直接打 RPC
(per memory feedback_live_db_rpc_diagnostic)全綠:
- `submit_prediction`(押注)✅ 正常回 prediction_id + created_at · **無 42702 ambiguous**
- `submit_creator_post`(發分析)✅ 正常回 post_id + created_at · **無 42702 ambiguous**
- `get_wallet_balance`(0009)✅ · `get_my_predictions`(0006)✅ · `get_creator_records`(0007)✅
- `get_match_prediction_tally`(群眾市場線)✅ · `buy_creator_post`(0009)✅ 餘額 0 正確回 insufficient(原子扣款沒壞)
- email 確認是關的(signUp 直接拿 session · 註冊不卡)
- ⚠️ 唯一沒跑完 = **成功買一篇付費分析**(買家要有點數;anon key 無法 topup → 需 Tim 用 SQL 加點數給測試帳號才能驗整條買流程)
- 測試殘留(都掛假賽事 `cpbl-rpctest-260602` · 不顯示在任何真實頁 · Tim 想清可在 Studio 刪):2 個 `z27.rpctest.*@example.com` 帳號 + 1 prediction + 1 creator post
- 註:0002 過時別套(指向已刪 /leaderboard)· 0004 沒前端用不必套。

### ⏳ Apply migration 0010 creator_comments(5 分 · Supabase SQL Editor)· 分析回覆串

R185 Tim dogfood 後新增:創作者分析下的「回覆串」對話層(讀者↔作者 · 買家↔賣家 · 作者回覆標「作者」)。
表 + 2 RPC(submit_creator_comment / get_creator_comments)· RLS-locked + SECURITY DEFINER · 同 0004 game_posts 模式。
**跑了才會真的能留言**(現在前端 graceful 顯示空串、不 crash)。 預測(選邊)一場一篇鎖死不動 ·
這只加「不評分的對話層」· 不碰 ✓已驗證準度 章的根基。 檔:supabase/migrations/0010_creator_comments.sql。

### 🔴 今晚(2026-05-30)· 3 場 CPBL 賽後結算 — 唯一 gated-on-Tim

3 場 pre-game 已 ingest(cpbl-260530-01 味全/台鋼 · -02 中信/富邦 · -03 樂天/統一)·
賽後 Tim 截 3 張比分 → Claude 判 PROVED/DIVERGED → 寫進 lib/matches.ts finalResult →
/track-record 結算。**這是今晚唯一需要 Tim 動手的事(其餘 Claude 自己推進)。**

### ② Resend signup(5 min)· unlocks confirmation emails

- ✅ DONE Round 16 production · Gmail Inbox 已驗收
- 仍可能需要重新 verify env vars(production · zone27-web.vercel.app)
- 待 ZONE 27 launch ready 時可考慮升級 plan 或自訂 domain

### ③ Brand domain purchase · Tim-cued only

per [[feedback_zone27_domain_deferred]] · 不主動 push · 只在 Tim 明確說「域名 X」 才動 ·
模糊指令跳過 domain · stealth unfreeze 不算同意。

候選名稱:zone27.tw / zone27.app / zone27.cc / zone27.io · Tim 拍板。

### ⑤ CPBL ingest ongoing · Tim 截圖 + Claude ingest

- ✅ DONE 第一場 2026-05-21 cpbl-260521-01 統一 2:6 富邦 · ENGINE PROVED ✓
- 後續 receipts 依 Tim 截圖節奏 ingest · /track-record N 增長
- per [[zone27-coverage-philosophy]] CPBL first(R172 起可 phased expand)

### ⑥ Optional · K/BB profile screenshot

升級 estimate K/9 BB/9 為真實值 · 不急 · 等 Tim 想做時截圖 cpbl 球員 profile。

### ⏳ Phase 2 創作者市場 · 手動銀行轉帳(Tim 2026-05-30 拍板啟動)

Tim 拍板:創作者「發文賣分析 · 平台抽傭(BLACK 10% / Founders 5%)」現在啟動 ·
但走**手動銀行轉帳**(不接 TapPay 自動 · 省 TIER 2 成本 · 同 0 auto-renewal 哲學)。
**待 Tim 提供:收款銀行帳戶資訊**(私下給 · 不進公開 GitHub repo · 同會員轉帳的私下寄送模式)。
⚠️ **碰真錢上線前找律師看一次**(per [[zone27-legal-redline]] · 內容抽傭灰色可做 · 真錢流動要謹慎)。
下一步 build:創作者發文介面(每篇掛海選天梯名次 + 自動對帳準度)+ 購買=手動轉帳指引 +
Tim 確認入帳後解鎖內容 + 抽傭計算。per [[zone27-polymarket-pivot]] Phase 2。

### ⏳ Phase 3 討論區 + admin 後台 · 需 Tim 定 admin email

完整討論區(R148 賽事討論室的後續)+ 管理後台 · 需要 ADMIN_EMAIL env var decision(同 M#2)。
文章刪文 governance:用戶只能「申請」刪文 · Tim 准了才刪。

### ✅ Apply migration 0004 game_posts · DONE(2026-05-30 Tim 親手套用 · Success)

賽事討論室 backend 已上線 zone27-prod · 真的能發文了。 game_posts 表 + 3 RPCs
(submit_game_post · get_game_posts anon-read · get_my_game_post)live。
Moderation v1 = Tim 用 Supabase Studio 刪 row(in-app 刪文 = Phase 3 · 需 admin email)。

### ⏳ Apply migration 0002 founder_reservations(5 分 Supabase Studio)

unblocks FounderPickForm Patek allocation 預訂功能。
⚠️ 2026-05-30:270 cap 已砍 → 「前 270 創始徽章」機制可能要重想(不再是搶有限席位 ·
而是前 270 名自動拿編號徽章)· 套 0002 前先確認新 model · per [[zone27-polymarket-pivot]]。

### ⏳ Supabase email rate limit fix

2/hr free-tier 卡 · disable confirmation OR custom SMTP via Resend · per
[docs/SUPABASE-SETUP.md](docs/SUPABASE-SETUP.md) · unblocks 真實會員規模化註冊。
(亦對應 pivot 安全 P1:寄信限流 Upstash · Claude 可先備 code · Upstash 註冊是 TIER 1。)

### ⏳ Tim signature PNG(10 分)+ Bank info 4 fields(5 分)

Founders 27 + BLACK CARD launch prerequisite(R172 後兩個 tier 都走銀行轉帳)·
等 Tim 拍板 launch milestone。

### ⏳ BLACK CARD 收款 infra · manual ATM 轉帳確認流程

R172 pivot · BLACK CARD 從 TapPay 自動訂閱改成 manual ATM / 跨行轉帳(per /integrity
#13 · 0 auto-renewal forever)· 不再需要 TapPay 訂閱 code。未來規模化可加「轉帳確認
上傳 + 自動比對」工具(NOT auto-charge · 不違反 #13)· TapPay 保留給未來一次性商品
(merch / 課程 / 創作者 payout)· 屆時才是 TIER 2 cost · 需 Tim 明示同意。

---

## 🤖 Claude 自己推進(不 gated-on-Tim · per [[feedback-no-waiting-rule]])

R174 pivot build queue · Claude 可主動 ship(三綠 + auto-push):

- ✅ **R185 fan-grammar 大掃除 + 動線 + 減法(2026-06-02 · push b938d49 · net −2605 行 · 三綠)**· Tim 全權 mandate · 4 路 agent(全球研究 / 碼審 / 動線 / 資料檔清掃)synthesize:
  - **看準度全線白話化(🔴 最優先)**:`/calibration`(砍整段 Brier 分數區)+ `/member/calibration` + 等級徽章 + 樣本進度條 + 分級資料 + OG 卡 · 全清 Brier / Tetlock / Murphy / reliability diagram / SAMPLE DEBT / Pratfall / axiom 學術詞 → 球迷白話、留實質誠實(「引擎說幾成 vs 實際中幾成」)
  - **全站黑話清掃**:延伸閱讀(~38 標題)+ 命令面板(11 標籤)+ OG 分享卡(清 Aronson / Cialdini / Spence 引用 + HeroLiveCard / UserPredictionPicker 元件名外洩)+ ArticleMeta 樣本 chip · sabermetric → 進階數據
  - **動線**:CardBetStrip 押完不再斷線(加「登入 → 存永久戰績」峰終鉤子)· /member 賣分析入口改直接指到能發文的賽事頁(原誤導去定價頁)
  - **減法**:刪 12 孤兒檔(9 元件 + 3 lib · 驗證無 import)
  - 🧭 研究 agent 找到的「缺的靈魂」= 公開、可驗證的準度本身就是產品(不是功能堆疊)· 已部分落地(白話化讓誠實看得懂)· 下一步可做「創作者已驗證準度徽章」(Substack Bestseller 式 · 不可造假 · 掛在作者名旁)
  - 🌐 **全運動願景對齊(Tim MLB 頁 + 運彩 8 運動選單 dogfood · 同 session 追加 · push 72f49df + e73956b)**:MLB 頁去黑話牆(/INTEGRITY RULE #12 辯護書牆 → 一句自信話)+ 改路線圖框架 · **/integrity 綁定鐵律 #12** 從「永久只做 CPBL · MLB 跟風是雜訊」**reframe** 成「沒驗證夠準不開盤 + 擴張提前公告絕不偷加」(永久守的是**品質閘門**不是只做 CPBL)· 站內 9 處「CPBL only forever / 永遠 only」掃成 phased · **/coverage 新增「全運動路線圖」section**(8 運動:棒球亮、其餘 7 研發中)· 詳見 [[zone27-coverage-philosophy]] R185 amplify
  - ⚠️ **rule #12 是「永久不會變」鐵律的改動** · 按 Tim 自己的 30 天公告紀律,可能要補一則 /changelog · wording 也可由 Tim 調
  - ⏳ 還沒做(下個窗):**/founders Apple 式砍乾淨(880 行 · 對標 /membership)** · **live-test 押注/錢包/買文章 RPC**(用 anon key 自建帳號打 RPC)· (可選)創作者「已驗證準度」徽章(研究 agent 的 missing-soul · Substack Bestseller 式)
- ✅ **R180 攻頂 session(2026-06-01 · 5 commit · full build 綠)**· Tim 全權 mandate · 3 路 agent(全球研究/碼審計/心理動線)
  synthesize → multi-wave ship:
  - **減法**:刪 21 個孤兒檔(-3395 行 · 7-Lens canvas 全退場 + follow/note/orphan lib)· 直擊「檔案多到離譜」
  - **接通押注電線**(三路 agent 一致 #1):/member + /rewards 改讀 0006 RPC(新 lib/predictions-server.ts)· 修「押完斷線」·
    ⚠️ 只剩 Tim 套 0006 即點亮(見上方 🟡 項)
  - **看板永不空白**:首頁 + /matches 休賽日 fallback → 引擎最近戰績收據(休賽日不再空盒子 · costly signal 擺正中)
  - **冷啟動鉤子**:CardBetStrip N=0「第一手是你的」· **峰終付費**:猜中時接到「寫成分析 →」創作迴路(非逼付費)
  - **修矛盾**:/rewards LIVE↔PRE-LAUNCH · UserPredictionPicker stale 變相賭博註解 · /rewards 死連結 /leaderboard→/ladder
- ✅ **海選天梯 /ladder**(已 ship · 新秀→神諭 · 樣本加權 · 引擎/群眾/你三聲音對照)· UserPredictionPicker 已指向 /ladder
- ✅ **賽事討論室 OPEN**(已 ship · 免費看 + 登入發言 · 不付費 · migration 0004 待 Tim 套用 · GameThread + HomepagePreview reframe)
- ✅ **270-cap 站內 reframe sweep**(DONE 2026-05-31)· 26 檔 + 首頁 ·「限量 270 席/2026 班售完關閉/每年新 270」→
  「會員不限量 + 前 270 創始編號(1st Edition · 發完即止 · 271+ 仍完整會員無編號)」· /discipline 紀律論述 + /manifesto 反 MLM
  + /founders 銷售敘事全重寫 · 三綠 + push · grep 確認 0 殘留(now journal 歷史保留)
- ✅ **首頁砍最近結算 + 市場卡機率講人話**(DONE · Tim「超雜」+ 研究 agent #1)·「63%」→「引擎看好 X · 一萬次模擬贏 N 次」
- ✅ **止血 3 矛盾 + dev CSP fix + 清 1054 行 dead code**(DONE)· 黑卡 mailto 1500→500 / login magic-link 文案 / 創作者訊息誠實化
  + CSP dev 加 unsafe-eval(Fast Refresh 修復)+ 刪 7 orphan 元件(R175 pivot 後無 import)
- ✅ **Polymarket 化 wave 2**(DONE 2026-05-31)· 首頁 + /matches 全卡一鍵押(新 CardBetStrip · 押注 4 步→1 步)·
  賽事頁開盤線假標籤修(「引擎機率·10K MONTE CARLO」其實是估算 → 改「引擎開盤線·賽前鎖定」)+ 收斂成一個主盤
  (下方自己跑模擬重定位成「驗算工具」· 解掉 Tim 截圖的「43% vs 37.9% 兩數字打架」)· 市場頁去募資條
  (ScarcityStrip 退出 /matches · ⚠️ **本地 dev cache 詭異一直 stale 沒 verify 成功 · git source 確認對 · 新窗用 fresh
  環境 confirm production /matches 頂部無「7/270 創始編號」· 若還在則 Nav active 條件需重查**)
- ✅ **R179 賣分析付費優越 + tier 系統**(DONE)· 關鍵:賣分析後端早 ready(creator_posts price_ntd 欄位 + submit RPC
  接受 p_price · migration 0005)· 只缺 UI。 新 lib/tier.ts(user_metadata.tier='black'|'founder' · 付費手動轉帳 Tim
  在 Supabase 手動標 · 0 auto-charge per #13)· CreatorAnalysis 付費會員可標價賣(顯示你拿 90-95%/平台抽 5-10%)·
  免費只免費發 + 升級 CTA · PostCard 付費分析鎖(標題+推薦邊公開·完整購買解鎖)。 ⏳ 完整購買(買家付錢→後端解鎖 body)
  = Phase 2(需 Tim 收款帳戶 + 後端 body gate RPC)
- 🟡 **押注 → 個人準度迴路接通(前端已接線 · R180)· 只剩 Tim 套 migration 0006**(retention 命脈 · 三路 agent 一致 #1)·
  Claude 已 ship 前端接線:新 `lib/predictions-server.ts`(getMyPredictionsMap · server-side 呼叫 0006 RPC →
  轉 UserPredictionsMap)· /member + /rewards 改讀新表(不再讀死掉的 user_metadata)· GRACEFUL(0006 未套用 →
  回空不 crash)。 **⚠️ 剩 Tim 唯一動作:在 Supabase Studio 套用 `0006_my_predictions.sql`** → 押完斷線徹底修復、
  球迷回儀表板看得到自己累積準度。(套用前畫面正常顯示空狀態 · 套用後自動點亮。)
- **群眾市場線鋪滿卡片**(MiniMatchCard + /matches 已有 · 補其餘 surface)
- **安全 P1** · /admin 伺服器端上鎖(M#2 · 需 ADMIN_EMAIL)· 寄信限流 Upstash(TIER 1)
- **K/BB estimate → 真值**(等 Tim screenshot)
- **小 deferred**(不急)· /rewards route 跟 CLAUDE.md 文件對不上(該砍或更新文件)· 黑卡舊價殘留在幾個程式註解
  (非 rendered)· 首頁手機 sticky CTA 要不要改產品導向(「跑一場模擬」)· MemberHomeHero null guard

---

## 🪒 R163-R164 NUCLEAR DELETE saga · R165 cross-ref cleanup

per Tim 2 escalating canary fires:
- R163「網頁好雜 · 都滑不到底 · 沒人要看的東西 · 請刪除 · 請以心理學角度出發」
- R164「網站沒救了 · 頁面多到一個離譜 · 多參考 Apple · 寫越多越沒人要看」

**Default mode 改 subtraction first not addition first** · per [[feedback-zone27-homepage-minimalism]]。

**12 routes deleted(R164)· Pratfall iron rule pages 100% preserved(13 trust artifacts)**:
- ❌ /poster · /founders/seat-card · /founders/from-one-current-founder
- ❌ /founders/inheritance · /founders/why-270 · /founders/first-five-minutes
- ❌ /pricing · /heritage · /year-zero · /letter · /engine-log · /transparency
- ✓ /audit · /methodology · /track-record · /roadmap · /steelman · /integrity ·
  /founders/postmortem-2028 · /ethics · /coverage · /methodology/diff ·
  /founders/ledger · /founders/apply · /interact · /annual/2026 全 LIVE

**R165 cross-ref cleanup(此 commit 886e42c)**:
- lib/related-links.ts 10 stale entries + 4 sibling refs cleaned
- 17+ page/component inline hrefs swapped per redirect mapping
- 3 orphan files deleted(LetterStampBar · letter-content · IdentityCovenant)
- CLAUDE.md route inventory v0.28 → v0.29 · /now journal R162-R165 entries 補

---

## 📋 R166+ deferred queue

### ✅ Tim「準的送積分 + 高手分潤」 → 2026-05-30 已成核心 pivot(R162 提案 · R174 拍板)

⚠️ R162 曾把「準的送積分 / 高手分潤」REJECT 成違反 brand IP — **已被 Tim 2026-05-30 明確 override**。
這正是現在的 Polymarket 合法版 pivot 核心(群眾市場 + 創作者抽傭 + 海選排行榜)·
per [[zone27-polymarket-pivot]]。當時的「0 commission redline」誤把**內容**抽傭當**賭注**抽傭;
真紅線只有真錢對賭 per [[zone27-legal-redline]]。
- ✅ 已 ship:AnonPickWidget · R148 GameThread · /member/calibration · 群眾市場(migration 0003)
- ▶ 進行中:海選排行榜 · 創作者市場(Phase 2)

### Other deferred items

- M#2 /admin gate(需 ADMIN_EMAIL env var decision)· pivot 安全 P1
- M#3 user_metadata client-write defensive bounds
- M#4 CSP nonce strategy(90 min focused refactor risk)
- N#1 DocumentSection extraction(11 pages · -250 LOC · medium effort)
- N#2 UserMetaPanel · N#3 ExtLink centralization · N#5 NowEntry array extraction
- F#1 CommandPalette dialog+Popover migration(6x deferred · existing works)
- E#2 GameThread reorder(R148 saga preservation)
- 19 mailto sites incremental migration(M#5 SUPPORT_EMAIL foundation laid R162)

---

## 🚫 三條鐵律(永遠遵守)

詳見 [CLAUDE.md](CLAUDE.md):

- **SEO 解凍條件**:不主動加 sitemap / robots / Google Analytics / Search Console
  直到 launch ready 全 ✓
- **社群帳號 / 上線推廣文 解凍條件**:需 Tim 明確說出「啟動社群」「現在發 IG」
  「幫我寫上線文」等指令 · 模糊指令「您決定」不解封
- **預算紀律 v2**:
  - 🟢 TIER 1(免費 + 註冊 + 小錢)→ Claude 可主動建議 + walk-through
  - 🟡 TIER 2(交易費 + 中等月費)→ 必須明確問 Tim 才執行
  - 🔴 TIER 3(NT$3K 以上單筆 / 法律 / 廣告)→ Claude 絕對不主動建議

---

## 📞 模糊指令處理

- 「您決定下一步」 / 「您決定」 / 留空 task → per [[feedback-no-waiting-rule]]
  default ship NOW · 不問 keyword · 不 surface options · 接 R174 pivot build queue
  OR Tim 新 mandate · 三綠 maintained per R131 throughout
- 「全權 + 上網查資料 + 攻頂」 → per [[feedback-full-authority-3-agent-pattern]]
  spawn 3 parallel agents synthesize · multi-wave ship · 但 R163-R164 lesson ·
  subtraction-bias agents not addition-bias · default 改 subtraction first

---

## 🛡️ 已驗證不走的路線

per audit trail · 避免新對話窗踩雷:

- ❌ 台灣運彩 / 報馬仔 / 殺手平台 寄生(品牌信譽自殺)· 但 displacement-target 仍是這些
- ❌ 廣告營收(AdMob 永久封殺 per /integrity rule 13)
- ❌ 抽**下注**分成(真錢對賭抽傭)· 永遠不 ship = 唯一法律紅線 per [[zone27-legal-redline]]
  - ✅ 但**內容/創作者**抽傭(BLACK 10% / Founders 5%)是核心 model · 不是紅線
    (舊「commission 任何形式 永遠不 ship」字樣 stale · 指的應是賭注抽傭)
- ✓ MLB Stats API + 手動 CPBL ingest + 未來 stats.cpbl.com.tw 官方公開資料
