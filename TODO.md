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

### ✅🔒 安全修補 · 全部完成(2026-06-03 · Tim 親手套 6 支 SQL + 確認自己是唯一 admin · 門鎖好了)

3 路 agent 碼審找到的 3 個洞,已**全部修好並上線**:
1. **後台認領漏洞(最嚴重)** ✅:claim_admin 綁定 founder email(`tatayngiti@gmail.com`)+ fail-closed ·
   上線後沒人能搶後台。 Tim 已在 /admin 確認**自己是唯一 admin**(看得到全套管理工具 = isAdmin ·
   「把我設為管理員」按鈕已消失 = 早就認領、鎖死了)。
2. **作者代號撞號** ✅:md5 前 4 碼 → 加寬到 8 碼。
3. **賣文價格沒上限** ✅:後端夾 0–10000。

**Tim 已完成(2026-06-03)**:0004 · 0005 · 0007 · 0008 · 0010 · 0011 六支全部套進 Supabase SQL
Editor。 中途 0005 撞 42P13「cannot change return type」(prod 的 get_creator_posts 已是 0008 的
9 欄版 · 0005 想用 6 欄 create-or-replace 蓋回去被擋)→ 已在 0005 檔案加 `drop function if exists
get_creator_posts(text)` 先 drop 再建解掉(讓 0005 永遠可重跑)· 當下也用「先跑一行 drop、再貼
0005」解掉。 + /admin 確認 admin 身分。 前端 getUser 早已上線。 **資安全部 LIVE。**
⚠️ 會員列表有測試殘留帳號(`z27.final.a.*` / `z27.gp.*` / `z27.rpctest.*@example.com` · dogfood 產生 ·
0 點 · 無害)· Tim 想清可在 Supabase Studio 刪 row。

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

### 🔴 重跑修正後的 0010 + 0004(42702 bug · R185 實測抓到)· Supabase SQL Editor

Tim 已套 0010 ✅,但 R185 live-test(自建帳號直接打 RPC)抓到真 bug:**0010 submit_creator_comment
+ 0004 submit_game_post** 的 `returning id, created_at` 撞 RETURNS TABLE 的 out 欄 created_at →
**42702 ambiguous** → 留言 / 賽事討論室發言其實送不出(前端 graceful catch 成假訊息 = R181 同陷阱)。
已在 repo qualify 表名修好(`returning <table>.id, <table>.created_at`)。
⚠️ **Tim 要在 SQL Editor 重跑修正後的這兩支檔**(`create or replace` 冪等 · 重貼整支 0004 + 0010 再 Run 即可)
→ 留言 + 賽事討論室發言才會真的通。
(分析回覆串 = 讀者↔作者 / 買家↔賣家對話層 · 作者回覆標「作者」· 預測選邊一場一篇鎖死不動 · 這只加不評分的對話。)

### 🟢 跑 migration 0011 → /admin 變「點擊後台」(R185 · Tim:不會操作 SQL · 要 WordPress 式)

Tim 唯一還要碰一次 SQL:套用 `supabase/migrations/0011_admin_console.sql`(app_admins + is_admin() gate +
加點數 / 標付費 / 看會員 / 審文章 的 RPC · 全 server 端 is_admin 把關 · 非 admin 硬打也擋)。
套完 → 去 /admin → 登入你 email → 按「把我設為管理員」(只有第一個人能設 · 立刻設別等)→
**之後管理全是按鈕、再也不用寫 SQL**。 WordPress 式:打 email + 金額 + 按鈕。 碰錢仍你親手按一次確認
(不違反 #13 不自動扣款)。 = 把「SQL playbook」徹底換成真・點擊後台(Tim dogfood「太難不會操作」)。

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

- ✅👤 **R193 創作者後台 v1(2026-06-05 · Tim GOLD dogfood「會員介面看不到我發了哪些文章/幾勝幾敗/有人回嗎/怎麼聯絡站長」)**:
  /member 補:① **MyCreatorPanel「你的分析」**(付費會員 · getMyCreatorPost 逐場撈我的分析 + 賽後自動命中率 + 每篇連到 #say 看回覆 · 沒發過自動隱藏)② **聯絡站長**(mailto SUPPORT_EMAIL = Tim inbox)。 答 dogfood #1 我的文 / #2 參與賽事(押注區已在)/ #3#4 階級(GOLD+天梯進度已在)/ #5 創作者勝敗 / #7 回覆(連到該場討論)/ #8 聯絡。 三綠。
  - ✅ **v2 LIVE(2026-06-05 · migration 0012_creator_dashboard.sql · Tim 已在 zone27-prod 跑 · Success · 買/回數已點亮)**:`get_my_creator_posts()` 一次回我所有文 + 每篇 `buyer_count`(creator_purchases)+ `reply_count`(creator_comments · 排除作者自己 = 別人問的)· auth.uid() gate 只回本人 · 隱私走「只給 N 人『數字』、不露買家身分」預設(Tim 未明確要露名單)。 前端 MyCreatorPanel 已接(**graceful**:0012 未套 → fall back 逐場 getMyCreatorPost、看得到文+命中率;套了 → 點亮每篇買/回數 + 後台總計)。 跑完即答 dogfood #6 誰買 + #7 彙整回覆。 全新 function 名 · create or replace 冪等可重跑(無 42P13)· 欄位全 qualify(無 42702)。 ⚠ 依賴 0005/0008/0010 已套(都套過)。
- ✅🔒 **R192 攻頂迭代 2(2026-06-05 · 3-agent 深審)· 修「先鎖後結」未強制的核心 integrity 洞**:
  - 🔴 **CORE FIX(已修顯示層)**:深審抓到 ——「先鎖後結 · 防賽後補登」是站上最常講的信任宣稱,卻**完全沒強制**:submit_prediction 任何時間都收、grader 從不比對押注時間 vs 開賽 → 天梯/準度可刷(押已開獎的場猜贏方=100% 準)。 目前 latent(公開天梯未上線)但正是 skeptic 第一攻擊點。 **修法**:新 `getMatchStartIso(match)` + `aggregatePredictionStats` 加「押注 created_at 必須 < 開賽 instant 才算數」(開賽後/賽後押注整筆不計;缺時間 fail-open 不誤殺正當押注)· 4 caller(首頁/天梯/member/rewards)全傳 startISO。 → 顯示的準度/天梯現在誠實、刷不動。
  - 🔴 **待 Tim 做(belt-and-suspenders · server 端 · 非急)**:submit_prediction RPC 也該拒收開賽後押注。 需把賽程開賽時間寫進 DB(現只在 lib/matches.ts)= 加 `match_locks` 表 + ingest 時寫 + RPC 檢查。 顯示層已防 · 但**公開天梯/創作者準度徽章上線前要補**。
  - ✅ **agent 認證乾淨**:auth getUser / wallet 原子性 / admin gate / RPC 報錯 / XSS / hydration / 死連結 / a11y / open-redirect 全查過 = clean(地基紮實)。
- ✅✅✅ **R191 攻頂迭代(2026-06-04 · 6 commit 全三綠 · 6803bb4→2a37a25 · auto-push)· Tim「全權上網查/找缺的靈魂/修bug/極致美觀直覺/熱銷」· 3 並行 agent(碼審 / 全球研究 / 設計轉換)synthesize**:
  - **06-04 ingest**(d7e095a):結算 06-03 三場全 PROVED(統一/味全/台鋼)+ 新增 #141 富邦vs台鋼 coin-flip · calibration N 16→19 · 板從休賽復活成今晚。
  - **Polymarket 信心溫度**(9b6ea93):勢均力敵盤(favorite ≤53)當主打「連萬象都只敢說 52/48」· lib/conviction.ts + MiniMatchCard。
  - **WAVE 1 真 bug**(dc6ba1b):① MiniMatchCard 假「一萬次模擬·贏N次」拔掉(winRate=賽前鎖定開盤線非模擬 · R176 詳情頁已修這裡漏網 · 守準度護城河)② CardBetStrip RPC 失敗誠實報錯(不再靜默吞=假成功 42702 陷阱)③ TeamPickPanel 廣播 `z27-team-change`(同分頁選隊 MyTeamNextGame/TrackRecord 才即時亮 · 原靠 storage 同分頁不觸發=要重整)④ CreatorAnalysis 拔 🔒💬 真 emoji ⑤ /calibration 改 57% 論證領頭、空校準圖(N<30)退下方當「兌現方式」。
  - **WAVE 2**(da01d41):/ladder winners-welcome 立場(打贏萬象=我們最想看到 · 對比明牌站封贏家/刪輸文 · Pinnacle 誠實版)· CardBetStrip 押後峰終回路「看你 vs 引擎 →」· /admin KPI grid 空格 · /rewards 死標籤「calibration mirror」。
  - **WAVE 3**(2a37a25):nav 狀態 chip(TONIGHT/BETA)金→mute(金保留給轉換 pill · pre-attentive)· 投手條加圖例「金色端=該項聯盟頂尖·越靠金色越強」(操作直覺 · 解方向歧義)。
  - ⚠️ **評估後沒做**:免登入試押(設計 agent P0 · 但 REVERSES R188 註冊閘門 · 不加回匿名押注)· TCG 收據框(agent 想砍 · 刻意品牌裝置 · 留)· TonightReceiptsCard 孤兒檔(agent 提報 · 查證早已不存在=從註解幻覺)。
  - 🧭 **「還有什麼大工程沒做但必要」(Tim 問 · 全球研究 agent 答)**:最缺的不是功能、是 **「結算→評分→排名→顯示」閉環 feedback loop**(每場賽後自動結算每注 · 更新每人 edge-over-engine · 重算天梯 · 刷新即時 calibration)+ **reputation/identity 系統**(一個帶 sample-weighted edge / tier / 公開不可造假戰績卡的 user 物件 · 同時餵天梯+創作者市場賣家認證+討論串署名)。 這兩根脊椎建好 · 其餘(週賽 league 升降級 / 賣家門檻綁天梯 / loss-wall「本月最大誤判」/ 即時部位 P&L)才 snap 上去。 ⚠️ **都需真實用戶才發光 · 同 3-engine 一樣等用戶/資料 · 別 0 用戶時硬建**。 anti-pattern(別碰):簽到 streak 髒化校準 · 正和計分變虛榮榜 · 註冊獎金 · 假精準度。
- 📌 **分潤/推薦制 DECISION(2026-06-05 · Tim 問 · 研究+法律分析拍板)· 等付費會員上線才 build**:
  **能做、合法 —— 但只能單層 + 回饋發點數/會員月(不發現金)。** 法律(查《多層次傳銷管理法》+《公平交易法》§18):單層(只抽你「直接」帶的人 · 下線的下線不抽)= 非多層次傳銷 · 不用向公平會登記 · 合法(同蝦皮/Dropbox/Uber)· 多層=要登記 · 收入靠拉人頭=老鼠會會坐牢。 蝦皮抄一半:抄「單層」+「發站內價值不發現金」(現金=靠近真錢紅線+報稅)。 數據:雙邊回饋(兩邊都拿)比單邊多 2.3x 分享/1.8x 轉換 · 甜蜜點 ~NT$500(BLACK 一個月)。 **建法**:介紹人=朋友「真的付費成會員」才給 BLACK 月/點數(防灌人頭)· 被介紹人=迎賓點數 · 只一層 · 文案「邀同類」非「拉人頭賺錢」(別變傳銷臉)。 ⚠️ 現金版找律師 · 點數/會員月版安全可直接建(綁手動轉帳)· 0 付費會員時無人可推薦 = 等用戶。 詳見 [[zone27-payment-architecture]] R191 段。
- ✅✅✅ **R190 完成 5/6(2026-06-04 · 5 commit 全三綠 · 9253026→12247ae · auto-push)· 詳見下方 R190 entry**:
  1. ✅ **引擎改名 sweep → 萬象**(9253026 · 26 檔 rendered 訪客文字去學術術語 · 信任頁改白話機制+GitHub 開源錨點 · OG 卡/延伸閱讀/Cmd-K/錯誤頁彩蛋 · **程式碼註解+simulator.ts+README 保留 Monte Carlo = 方法公開的 GitHub 層**(刻意不掃)· SSR 13 頁驗證 0 殘留)。
  2. ⏳🔴 **三引擎分層 — DATA-BLOCKED · 別硬做(評估後 defer)**:戰力(Elo)現在只有 ~16 場 CPBL finalized → 從 1500 baseline 幾乎沒動 = 全部 ~50% 無資訊量(看起來像壞掉)· 局勢(Markov)需要**逐打席 play-by-play 轉移資料**,CPBL 不開放、我們只 ingest box score = **無料可做**。 且曝光 3 引擎還要建付費 gating + 對照 UI(大件)。 三條都卡 → 硬做會違反 #12 engine-validated 紅線(= 上 unvalidated 引擎)+ no-vapor。 **正解:等 CPBL ≥50 場(Elo 才有訊號)或改用 MLB API(料更多)· 連同付費對照 UI 一起做一個專窗 · 別現在半做出個全 50% 的假引擎。**
  3. ✅ **球隊勝率推播 forward 半**(3bbe2df · 新 `MyTeamNextGame` 掛 /track-record · 你支持的隊下一場 + 萬象開盤% + 賽後對帳承諾 · pick→下一場→過去戰績完整迴路 · 誠實版手機勝率推播 · 目前 off-day 空狀態,下個 slate ingest 自動點亮)。
  4. ✅ **57% 彈藥內容**(d66d994 · /calibration 加「為什麼沒有神準引擎」· 全球最準賽前模型+Vegas 盤口 ≈57%、理論上限 ~60% · 94% 神準=數學上不可能=話術 · 護城河=敢承認 57%+逐場對帳、不是準度 · plain words · 來源在註解)。
  5. ✅ **MLB 驗證 = CONFIRMED 在跑**(無需改碼):GitHub Action `mlb-engine.yml`(每天 2 次 cron)真的有自動 lock+grade+push(本窗 push 撞到它的 commit 6a0d324 → rebase 整合)· 現況 **25 鎖 / 3 結算**(2 diverged · 1 push · N=2 純雜訊)· `MlbEngineRecord` 讀法正確(decided=proved+diverged · push/tie 排除)· ≥30 decided 才開 MLB = **正確維持關閉**。
  6. ✅ **CLAUDE.md 刷新**(12247ae · 兩個 canonical 定價段 + brand framing 抽傭命名全改 **OPEN/BLACK/GOLD** · 清 Founders 27/BLACK CARD/270 stale · 指向 tier-naming 記憶 · 提醒 tier key 仍 `founder`/URL /founders 不動/「TIM·FOUNDER」簽名保留)。
  - 🧭 **下一窗候選**:① **#2 三引擎專窗**(等資料夠 · Elo 先做 · 連付費對照 UI)② 真實用戶後才發光的增量(可分享 verdict 病毒線 / pick-streak / 賽事卡社群熱度 · 同 R51 結論)③ CLAUDE.md routing-map section 仍有歷史 stale(/leaderboard 已刪等 · 低危 · 有空再掃)。
- ✅ **R189 全窗(2026-06-03 · 1e02127→9126755 共 7 commit · 全三綠 · auto-push)· 品牌淨化到「誠實 Polymarket」**:
  - 清匿名死碼(B3)+ 首頁/天梯讀 DB 戰績條 + 收合兩準度頁(下方原 R189 段)· 然後四輪砍會員系統:
  - **等級改名 OPEN/BLACK/GOLD**(8c9987f→9126755)· 四輪:免費→OPEN 黑卡→BLACK 創始→FOUNDER→**全砍前270編號**→**剝創始/最早支持者故事**→**FOUNDER→GOLD** · 三層純功能 · 地位交給天梯 · ⚠️tier key 仍 `founder`/URL /founders 不動 · ⚠️「TIM·FOUNDER」創辦人簽名保留(別改 GOLD)· 詳見 [[project-zone27-tier-naming]]。
  - **⚠️ 登入後個人視覺(首頁戰績條 / GOLD 頁 / 切換器)未實機 dogfood**(需 Tim 帳號)· 資料路徑沿用已驗證 primitives + 型別過。
- ✅ **R189 · 清匿名死碼 + 登入後戰績條 + 收合兩準度頁(2026-06-03 · 新窗 · 1e02127 / be5778d · 全三綠 · 淨 −1800 行)**· 接續 R188 註冊閘門:
  - **B3 清完**:anon-picks 系統整串刪(AnonCalibrationStrip / CalibrationTierBadge / AnonPickMigrator / LadderPosition / lib/anon-picks / lib/calibration-tiers 共 6 檔)· R188 拿掉免登入押注後沒人再寫 `zone27_anon_picks_v1` = 死碼 · localStorage inventory 同步拔那條(11→10 防 drift)· Cmd-K 拔開發符號關鍵字 AnonPick/UserPrediction。
  - **首頁 + 天梯個人戰績條**:新 `YourRecordStrip`(client 端讀 0006 get_my_predictions · 同 /member 的 aggregatePredictionStats 評分 · 頁面維持 ISR 靜態 hydrate 後填)· 登入且押過才顯示「你 vs 引擎」· 取代死掉的匿名版。⚠️ 登入後實機視覺未 dogfood(需帳號)· 資料路徑全沿用已驗證 primitives。
  - **收合 /member/calibration → /calibration**:那頁個人模式靠已死的「追蹤賽事」(FollowMatchButton 早刪)· 且二元押注畫不出 45° 校準曲線 = 概念上不成立 · 整頁改 redirect · lib/follows.ts 一併刪(唯一 import)· /calibration「另一頁」段落誠實重寫指向 /member · 修 /track-record 撞名連結 + related-links 4 處。
  - ⏳ 殘留 code 註解(predictions.ts / track-record / calibration design comment 提到 /member/calibration)留下輪 sweep(同 R187 慣例 · 不 render)。
  - ⚙️ 踩到 stale-server 假綠陷阱(殺 npm pid 不殺 next 子進程)· 已存 [[feedback-stale-server-false-green]] memory。
- ✅ **R188 後續 · 安全 SQL 套用 + 創作者定價 + 後台扣點(2026-06-03 · 同窗 · 09b837e / 9f91923 / ea6585f)**:
  - **6 支安全 SQL 全套用 + Tim 認領 admin** —— 門鎖死(詳見上方 ✅🔒 紅框)· 套 0005 時撞 42P13「cannot change return type」(prod 已是 0008 9 欄版)· 已在 0005 加 `drop function if exists get_creator_posts(text)` 解掉。
  - **賣文定價(9f91923)**:自填數字 input → 勾選預設 **免費/50/100/200/300/500** · 階級上限 **BLACK≤200 / Founders≤500** · 免費會員只免費發 · 心理學「**價格=證明**(靠刪不掉的 ✓ 已驗證準度撐)· 衝動帶 50–150 · 不玩 99 charm pricing」· DB clamp 留 0–10000 當防溢位後盾(真 500 上限在表單擋 · 不用再碰 SQL)。
  - **後台點數(ea6585f)**:加點卡升級成「**＋加點 / −扣點**」點擊 toggle(非工程師不用記負數 · per 營運動作一律點擊)· 扣點走同支 admin_give_points 負 delta(帳本留痕 · 餘額=加總)。 錢包買文章「扣+解鎖」本就全自動原子(0009 buy_creator_post · advisory lock 防雙扣 · R185 實測)· Tim 唯一手動=入金(儲值)。
- ✅ **R188 註冊閘門 pivot(2026-06-03 · Tim 看玩運彩討論區 app 後拍板 · 3 commit 全三綠 · d473140/abb4496/f8b6851)**· 三條 = 同一策略「有帳本的玩運彩」(匿名老師贏截圖輸刪文是對手弱點):
  - **升階要贏過引擎(d473140)**:/ladder 升階硬條件 · 每往上爬一階那個月必須贏過引擎 · 累積場數夠了還不算。 品牌調和成 alpha-over-baseline 非 win-rate 虛榮榜(calibration-tiers 紅線明列 win-rate ranking = 品牌自殺)。 目前無 enforcement engine · 規則明文化。
  - **押注閘門(abb4496 · net −247)**:押要先登入免費會員 · 拿掉免登入 localStorage 押注 + AnonVerdict + 錯文案「不用註冊·先押著」· 順手修押注按鈕被群眾線網路抓取卡 skeleton(改 getSession 先定狀態)· StickyFoundersCTA 改登入感知前門(不催已是會員的人)。
  - **引擎閘門(f8b6851)**:新 EngineGate wrapper · 跑 10K 模擬要登入 · 套 /lab + /lab/custom + 賽事頁「進階驗算」摺疊 sim。 **看免費 · 動作(押注/跑引擎)要登入。**
  - ⚠️ **REVERSES 舊「免登入試押」冷啟動護城河** · 同窗早上的 AnonPickMigrator(2d6f151)被 supersede(只剩 graceful 處理 legacy)· **別再加回匿名押注/跑引擎** · 詳見 [[project-zone27-registration-gate]] memory。
  - ✅ **B3 已清(R189 · 見上)** · ✅ **首頁登入後個人戰績條已補(R189 · YourRecordStrip 讀 DB)** · ⏳ **討論區 Phase 3**(綁戰績版玩運彩 · 需真實用戶才發光)。
- ✅ **攻頂 round 3(2026-06-03 · 6 commit 全三綠 · 2d6f151→7e4ab23 · 全 pushed main)**· Tim「全權 · 上網查全世界找『缺的靈魂』· 重心理學+操作邏輯+極致美觀+操作直覺 · 別 push 上線/別碰 SEO 社群」· 3 路 agent(操作動線體檢 / 缺的靈魂全球研究 / 視覺工藝+認知負荷)synthesize → 6 波:
  - **修登入留存 CRITICAL bug(2d6f151)**:訪客本地押注(localStorage)登入後從沒被寫進共享預測表 = 全站講 5+ 次的「登入→存成永久戰績/進群眾市場/爬天梯」是空話 · 押 8 手登入後 /member 仍顯示 0 場。 新 `AnonPickMigrator`(layout 全站掛載 · 帶 session 把**尚未結算**的場 submitPrediction 重放 · 冪等 · 移除本地副本 · refresh)· 誠信護欄只遷移未結算場(防賽後補單污染天梯/準度)。
  - **缺的靈魂 OpenPositionCard(c4200d5)**:3 agent 一致最尖 —— 所有情緒高潮都在賽後/年度回顧 · 押下去到打完之間的 live 中段一片空白(資料模型有 today-live 卻沒畫)。「你的未結算押注」放 /member 準度數字之上 · 你 vs 引擎 vs 群眾三方張力 · LIVE 呼吸金線 · **絕不造假即時比分**(賽果仍賽後 ingest)。
  - **craft 減法(e23a890 · net −9)**:首頁戰績降成 proof 行(金色 CTA 變唯一焦點)+「你的戰績」strip 移到看板**之上**(回訪先看到自己)+ /member 升級卡 glow-soft 大卡降成一行(會員介面不推銷 tier)+ 押注卡 .skeleton + 拿掉彈到重複清單的「再選一場」。
  - **270 漂移(ef2887c)**:戰績頁「269 more」錯數字(已 16 收據 · 一季~300 場)改非數字 + 移除 `FOUNDERS_REMAINING===0` gate(會員已不限量 · 防該常數歸零時全站手機主 CTA 無聲消失)。
  - **賽事頁市場層次(441ed2f)**:開盤線說明對齊已收摺的 10K 深算(不再承諾並排)+「這題怎麼算贏」eyebrow gold→mute(開盤線當唯一金色焦點)。
  - **看準度深連(7e4ab23)**:首頁「你的戰績」→ /calibration#your-record(client mount 後補捲 · 實測落點正確)· 直接看自己紀錄不丟到引擎自評頁頂。
  - 🧭 **Deferred**:✅ ① **/calibration IA 已解(R189 · 收合成一頁 · 不再兩頁撞名)** · ② **賽季報告 / 結算時刻 soul**(Agent B #2#3「最強品牌轉移」· 但需真實用戶 N≥10 · 0 用戶時做看不到效果 · 上線後再做)③ PhaseBadge 三份 inline 複本 DRY + ReliabilityDiagram 複本(收合後只剩 /calibration 一份 + 元件內一份 · drift 縮小)+ eyebrow tracking scale 統一(低 · consistency)。
  - ⚙️ **工具備忘**:本專案 tsc 要跑 `node node_modules/typescript/bin/tsc --noEmit`(`npx tsc` 會抓到 global stub exit 0 = 假綠)· Bash cwd 不持久 · 每個指令前 `cd` 錨定 · 已更新 [[feedback-zone27-tsc-verification-discipline]] memory。
- ✅ **MLB 引擎自動盤 pipeline(2026-06-03 · ba90e2e)**· Tim「引擎 16 場太慢 · 接 MLB 衝樣本」·
  lib/mlb.ts 早會即時算 MLB 引擎勝率 + grade,缺的是「賽前鎖定」→ 補齊:`scripts/lock-mlb-predictions.mjs`
  (抓 Preview 場算開盤線寫 `lib/mlb-locked.json` + lockedAt)+ `scripts/grade-mlb-locked.mjs`(賽後對鎖定值評)·
  `.github/workflows/mlb-engine.yml`(每天 2 次自動 lock+grade+commit)· `components/MlbEngineRecord.tsx`
  掛 /matches/mlb(戰績區 · framing 嚴守 #12 品質閘門:「驗證中 · 夠準才開盤 · 跟 CPBL 分開計 · 落空照掛」)。
  種子已鎖 18 場(待結算)。 ⚠️ **Tim 待確認**:repo Settings → Actions 是否啟用(預設開)· main 若有
  branch protection 要放行 bot push。 NPB/KBO 無同級公開 API(暫不做)· MLB 開盤公式同 lib/mlb.ts。
- ✅ **賽事頁 10K 模擬器收進 disclosure(2026-06-03 · 9e2c59f)**· 消「同頁兩個勝率打架」困惑 · 預設只露開盤線。
- ✅ **攻頂 round 2 · 全球研究 + 碼審 + 設計審計(2026-06-03 · 6 commit 全三綠 · cd34794→9c248da)**· Tim「全權 · 上網查全世界 · 攻頂 · 讓網站極致完美 · 重操作邏輯 · 怎樣熱銷 · 認真看 bug」· 3 路 agent(全球成功網站研究 / bug+安全碼審 / 設計+轉換審計)synthesize → 6 波 ship,並用 `next start` prod server 真實截圖驗證視覺:
  - **量化品牌(cd34794)**:ConfidenceStars 五星「★★★★★ STRONG SIGNAL」→ 分段強度條(去報馬仔賣明牌的視覺語彙)· /founders「22 條」對齊 · 群眾線空狀態文案修(原誤導「登入才能押」)· WalletPanel 去 🔥 emoji(違反不放 emoji 鐵律)。
  - **安全前端(424c4c4)**:/member + /api/submit 改用 getUser() 驗身分(不用可偽造的 getSession · 違反 codebase 自己的鐵律)。
  - **賽事卡 craft(f88f586)**:砍冗餘英文隊名 + 收緊節奏 + 字級三階化 + 加「不確定性接縫」(量化簽名筆觸 · UncertaintyStripe 迷你版)· 更 action-first · 加 .claude prod 預覽設定(補 dev 預覽對 SSR 卡 loading 的不可靠)。
  - **天梯個人位置(746c5f5)**:死路 brochure → 「你現在的位置」進度條(離新秀差幾場 + 登入上公開天梯)· 修 /member「看你排第幾」點過來看不到自己的斷裂迴路。
  - **🔒 migration 安全(4aeeca2 · 待 Tim 套 · 見本檔最上方紅框)**:claim_admin 綁 founder email + fail-closed(防上線後任何人搶後台)· 作者代號 4→8 碼(防撞號陷害)· 賣文價後端夾 0–10000。
  - **市場頁減法(9c248da)**:/matches 兩張 hero 大 CTA 卡 → 精簡兩欄 slim link + 拿掉違規綠框。
  - 🧭 **「缺的靈魂」研究結論 + 我的覆核(回答 Tim「什麼大工程沒做」)**:全球研究指三大缺口(① 可分享的收據經濟 ② 設計化的頭 60 秒 ③ 每日習慣 streak)· **但覆核既有碼後 → 地基其實比研究以為的紮實**:免登入試押 ✓(冷啟動護城河 · 設計 agent 也認證 excellent)· 你 vs 引擎 seeding ✓ · 看準度頁 ✓ · 引擎收據分享(純文字 + OG 卡 + 永久連結)✓ · 海選天梯 ✓ · 創作者市場 ✓。 真正剩下的是「隨真實使用量才會發光」的增量:**使用者自己的「你贏引擎」verdict 變可分享(病毒線)· 每日 pick-streak · 賽事卡社群熱度**。 建議在「有真實內容 / 用戶」時、或下一輪專注做(同社群熱度暫緩的邏輯 —— 0 用戶時做這些是看不到效果的投資)。
  - ⏳ **剩餘設計 P2(下輪可做)**:賽事頁把 10K 模擬器收進 `<details>` disclosure(消「同頁兩個勝率打架」的困惑 · 預設只露一個開盤線)· 賽後場改「收據優先」排序(分享連結直接落在 PROVED/DIVERGED 證據,而非死掉的押注框)· 錢包 deep-link(`去儲值`→`/member#wallet`)· globals.css 死碼清理(.scintillate / .engine-settle 等已刪元件殘留)。
- ✅ **心理學 + 操作邏輯打磨(2026-06-03 · 4 commit 全三綠 · 96fd67e→eee159e · 接上窗 marathon)**· Tim「全權攻頂 · 重人的心理學+操作邏輯 · 先更新碼別上線」· 2 路 agent(心理/動線審計 + a11y lang 審計)synthesize · 6 條心理發現全 ship:
  - **W1 冷啟動迴路(96fd67e)**:AnonCalibrationStrip 訂閱 `zone27:anon-picks-changed` → 押完「你的戰績」strip 即時亮(原本要重整才出現 = 押完最熱那刻 endowment 回饋斷)· 首頁 strip 準度 % 滿 3 場結算才報(1 場不喊「你準度 100%」· 對齊 CROWD_LINE_MIN/天梯/看準度紀律)· CardBetStrip 會員押完加「再選一場 →」。
  - **W2 賽事卡 + 峰終(df24360)**:MiniMatchCard「一萬次模擬贏 6300 次」→「一萬次模擬 · 贏 6,300 次」(千分位 + Math.round 防脆裂)· UserPredictionPicker 賽後「押下一場」迴路原本 gate `!finalWinner` 在賽果出爐時消失(峰終斷頭)→ 改賽後也留低門檻「去押下一場」(贏可寫分析也可再押 · 輸不斷頭)。
  - **W3 會員儀表板對等(ee733b8)**:/member「今晚可以押」原本只抓 `getTodayMatches()`(只今天)· 改 `getTodayAndFutureMatches()`(同首頁)· 修「休賽日但明後天有排賽時,登入會員看死路、沒登入的人在首頁卻看得到還能先押」的不對等 bug。
  - **W4 a11y lang(eee159e)**:/matches 列表 PhaseChip + /changelog + /coverage + /track-record 的中英混排 span 拿掉 `lang="en"`(承接上窗 0f21834 賽事詳情頁)。 ⚠️ **發現此 `lang=en`+中文 pattern 是全站等級 ~60 處 / ~25 檔(多是 section header 慣例如「/ §01 · …永遠不做」)· handoff 寫的「少數」嚴重低估** · 本輪只掃高流量市場/信任頁 · 其餘建議獨立一輪 codemod 式統一(屬輕量 a11y · 不急)。
  - ⏳ **未做 · 社群熱度可見(handoff item ① · 賽事卡顯示 N 篇分析 / N 則討論)**:評估後**暫緩**。 理由:① 需新 migration 0012(Tim 已有 0010+0004 重跑、0011 admin 待套 · 不想再加 SQL 負擔)② 0 內容時卡片 gated 顯示不出東西(graceful 但現在看不到)③ 與本輪「打磨既有心理學」較不同調。 **backend 我可隨時備好**(creator_posts + creator_comments 兩表 schema 都查過 · 可寫 column-qualified 的 batch count RPC 避開 42702)· 建議等「有真實內容」或「Tim 想一次清後台」時再做。
- ✅ **攻頂 marathon(2026-06-02 · 11 commit 全三綠 · 4513247→0f21834 · 不含並發窗 e72a504)**· Tim 連發「全權迭代攻頂」· 3-agent 偵察(全球標竿研究 / 碼審計 / 轉換動線)+ founder dogfood synthesize:
  - **信任合約對齊(P0)**:/integrity 三紅線(不做錢包 / 0 社群 / no commission)自打臉已上線功能 → 對齊 legal-redline + 「↻ 已修訂」誠實註記(不偷改)· 同手法 /interact 整頁 one-way 反社群宣言 → 「綁戰績的討論 · 不嘴砲」(9 處 reframe)。
  - **轉換漏斗**:首頁 hero 補主 CTA · 押完接「下一場」迴路 · 手機 sticky CTA 漸進式 ask(新訪客先推免費押注、押過才推 Founders 2700)· /member 準度接天梯排名鉤子。
  - **缺的靈魂(全球研究)**:每場「這題怎麼算贏」結算規則(預測市場第一信任機制)· 啟用孤兒 brand IP RefusalLedgerHint(拒絕標準)到 /founders/apply。
  - **品質**:登入頁全去工程黑話 + SUPPORT_EMAIL 收斂(login + WalletPanel)· 賽事頁/首頁 a11y lang 中英混排修正。
  - **subtraction 勝利(查證後確認「不該動」)**:tier.ts(free 抽傭語意其實合理)· /membership(已是 additive framing)· Nav 天梯入口(踩 Tim「nav 極精簡」canary)· 錢包(核心金流不刪)· 賽事頁雙算法(brand IP)— 全確認健康/刻意,沒亂動。
  - 🧭 **研究結論**:信任層已世界級護城河 · 冷啟動靠 single-player(你 vs 引擎)+ 創始徽章 + 早來稱王(對手靠真錢流動性 = 死穴)= 結構優勢已蓋好 · 缺的「熱度+下一步」已大量補。
  - ⏳ **下一步方向(Tim 明示:還沒上架 · 先專心更新程式碼 · 重「心理學 + 操作邏輯」)**:① 社群熱度可見(賽事卡顯示 N 篇分析 / N 則討論 · 需後端 count RPC migration,Claude 可先備 code)② 視覺 / 心理學 UX 微打磨 ③ a11y lang 全站清掃(306 個 lang=en 篩出少數中英混排)。 待 Tim 扣扳機才做:Supabase 關 email confirm / 上線推廣 / 創作者市場金流。
  - ⚠️ **preview client render 對 SSR 頁不可靠**(/membership 看似卡 loading 但 fetch server HTML 完整健康)· dogfood SSR/loading 頁要 `fetch(url)` 看 server HTML,別信 preview_eval 的 client 畫面。
- ✅ **群眾市場線守樣本紀律(2026-06-02 · push 4513247 · 三綠)**:N=1 不再畫「100% 共識」假 bar(= 報馬仔拿小樣本當大盤的手法 · 跟全站樣本紀律 + 上方開盤線「不假裝確定」自打臉)· 新增 `CROWD_LINE_MIN=5`(lib/predictions-market 單一來源)· 低於門檻只報真實人數 +「滿 5 人才畫群眾市場線」· 賽事頁 CrowdLine + 首頁卡 CardBetStrip 同步 · dogfood 親見 cpbl-260602-01 真實 1 人場驗證三分支(0/1/≥5)。
- ✅ **「下個窗」三項 verify 後其實早完成(2026-06-02)**:① /founders R187 已砍到 244 行(Apple 式 · 對標 /membership)· ② 押注/錢包/買文章 RPC R185 已 live-test · ③ 創作者「已驗證準度」徽章已實作(CreatorAnalysis `AuthorBadge` 三態 + `gradeAuthorRecords` + 0007 RPC · 賽事頁 finalResults 已正確接線)。 ⚠️ **教訓:TODO 會落後實際 · 動工前先 grep/讀碼 verify,別盲信清單。**
- ✅ **R185 fan-grammar 大掃除 + 動線 + 減法(2026-06-02 · push b938d49 · net −2605 行 · 三綠)**· Tim 全權 mandate · 4 路 agent(全球研究 / 碼審 / 動線 / 資料檔清掃)synthesize:
  - **看準度全線白話化(🔴 最優先)**:`/calibration`(砍整段 Brier 分數區)+ `/member/calibration` + 等級徽章 + 樣本進度條 + 分級資料 + OG 卡 · 全清 Brier / Tetlock / Murphy / reliability diagram / SAMPLE DEBT / Pratfall / axiom 學術詞 → 球迷白話、留實質誠實(「引擎說幾成 vs 實際中幾成」)
  - **全站黑話清掃**:延伸閱讀(~38 標題)+ 命令面板(11 標籤)+ OG 分享卡(清 Aronson / Cialdini / Spence 引用 + HeroLiveCard / UserPredictionPicker 元件名外洩)+ ArticleMeta 樣本 chip · sabermetric → 進階數據
  - **動線**:CardBetStrip 押完不再斷線(加「登入 → 存永久戰績」峰終鉤子)· /member 賣分析入口改直接指到能發文的賽事頁(原誤導去定價頁)
  - **減法**:刪 12 孤兒檔(9 元件 + 3 lib · 驗證無 import)
  - 🧭 研究 agent 找到的「缺的靈魂」= 公開、可驗證的準度本身就是產品(不是功能堆疊)· 已部分落地(白話化讓誠實看得懂)· 下一步可做「創作者已驗證準度徽章」(Substack Bestseller 式 · 不可造假 · 掛在作者名旁)
  - 🌐 **全運動願景對齊(Tim MLB 頁 + 運彩 8 運動選單 dogfood · 同 session 追加 · push 72f49df + e73956b)**:MLB 頁去黑話牆(/INTEGRITY RULE #12 辯護書牆 → 一句自信話)+ 改路線圖框架 · **/integrity 綁定鐵律 #12** 從「永久只做 CPBL · MLB 跟風是雜訊」**reframe** 成「沒驗證夠準不開盤 + 擴張提前公告絕不偷加」(永久守的是**品質閘門**不是只做 CPBL)· 站內 9 處「CPBL only forever / 永遠 only」掃成 phased · **/coverage 新增「全運動路線圖」section**(8 運動:棒球亮、其餘 7 研發中)· 詳見 [[zone27-coverage-philosophy]] R185 amplify
  - ⚠️ **rule #12 是「永久不會變」鐵律的改動** · 按 Tim 自己的 30 天公告紀律,可能要補一則 /changelog · wording 也可由 Tim 調
  - ✅ 下個窗三項全部完成(2026-06-02 · 見本 section 頂部 entry):/founders 已砍到 244 行 + 押注/錢包/買文章 RPC live-test + 創作者「已驗證準度」徽章已實作
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
