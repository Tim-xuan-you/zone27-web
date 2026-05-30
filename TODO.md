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

### ⏳ Phase 2 創作者金流(TIER 2 · 需 Tim 明確同意才動)

創作者賣分析 → 平台抽傭(BLACK 10% / Founders 5%)→ 需要 creator payout 金流
(TapPay 或其他)· 設定費 + 抽成 = TIER 2 cost · 必須 Tim 明示同意。
per [[zone27-polymarket-pivot]] Phase 2。**碰真錢的金流上線前找律師看一次**
(per [[zone27-legal-redline]] · 內容抽傭灰色可做 · 但真錢流動要謹慎)。

### ⏳ Phase 3 討論區 + admin 後台 · 需 Tim 定 admin email

完整討論區(R148 賽事討論室的後續)+ 管理後台 · 需要 ADMIN_EMAIL env var decision(同 M#2)。
文章刪文 governance:用戶只能「申請」刪文 · Tim 准了才刪。

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

- **海選排行榜**(下一個大件)· 新秀→分析師→操盤手→神準手→神諭 · 樣本加權排名(不裸勝率)·
  每月升降 · UserPredictionPicker 已指向 /calibration「即將上線」
- **270-cap 站內 reframe sweep** · 舊頁面仍寫「限量 270 名」/「每年開放新 270」(/founders /roadmap
  /membership 等)→ 改「會員不限量 + 前 270 創始徽章」· 同 R173 pricing-sweep 規格 · 一次掃乾淨不要 half-apply
- **群眾市場線鋪滿卡片**(MiniMatchCard + /matches 已有 · 補其餘 surface)
- **安全 P1** · /admin 伺服器端上鎖(M#2 · 需 ADMIN_EMAIL)· 寄信限流 Upstash(TIER 1)
- **K/BB estimate → 真值**(等 Tim screenshot)

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
