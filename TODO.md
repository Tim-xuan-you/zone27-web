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

### 🔴🔒 安全修補 · 套 SQL 前先看(2026-06-03 碼審 · 3 洞 · 都還沒上線、還沒被打)

3 路 agent 碼審找到 3 個「上線後可能被攻擊」的洞,已在 repo 修好,但要 Tim 套用才生效:
1. **後台認領漏洞(最嚴重)**:舊 `claim_admin` 是「表空 + 任何登入者」就能認領 admin
   = 上線後任何人註冊帳號、直接打這支 RPC 就能搶走整個後台(加點數 / 改 tier / 撈全
   會員 email / 刪文)。 已改成「只有 founder 本人 email 能認領」· 且忘了設會 fail-closed
   (誰都不能認領)。 ✅ **email 已幫你設成 `tatayngiti@gmail.com`(2026-06-03)** → 直接貼整支
   `0011` 進 Run 即可;之後用這個 email 註冊的帳號去 /admin 按「設為管理員」就能認領後台。
2. **作者代號會撞號**:代號只取 md5 前 4 碼(65536 種)· 約 300 人就有兩人同號 → 戰績/
   準度徽章被混在一起(可被惡意註冊灌號陷害對手)。 已加寬到 8 碼。 不急(200 人前處理就好)·
   但跟下面一起套最省事。
3. **賣文價格沒上限**:前端限 2000 但後端沒夾 · 直接打 API 可塞天價破 UI · 已夾 0–10000。

**Tim 要做(下次開 Supabase SQL Editor 時一次做完)**:把這幾支檔案「各自整支」貼進 SQL
Editor 按 Run(都是 create-or-replace 冪等 · 重套安全):**0004 · 0005 · 0007 · 0008 ·
0010 · 0011**(`0011` 記得先改 email)。 套完 = 代號 8 碼 + 後台只有你能認領 + 賣文價有
上限。 (前端 `getUser` 那筆已直接上線 · 不用你動。)

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
