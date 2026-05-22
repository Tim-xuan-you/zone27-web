# Founders 27 · Manual Onboarding Flow

> Tim 親自接 270 位創始會員的 onboarding checklist。
> 寫於 2026-05-20 · Round 29 Wave 14 (2026-05-21) 加 4-phase psychology framework + cross-ref。

每一位 Founders 27 都由 Tim 親手 confirm。**這不是「省 NT$ 70 transaction fee」的工程選型 · 是「親手 onboard 就是創始體驗的核心」的品牌設計。**

完整架構契約見 memory `[[zone27-payment-architecture]]`。

---

## 🧠 4-Phase Psychological Journey(Round 29 Wave 14 framework)

每位 Founder 從申請到入會 · 經過 4 個 phase · 每 phase 刻意觸發**一個主導 cognitive bias**:

| Phase | Tim Action | Primary Bias |
|---|---|---|
| 1 · ANTICIPATION | 訪客填表後 · Tim 故意等 **18-26h** 才回(NOT instant auto-reply) | RECIPROCITY(Cialdini 1984) |
| 2 · FIRST REPLY | Tim 親手寫 email · 80% template + 20% personal line | IDENTITY THREAT RESOLUTION |
| 3 · TRANSFER | 訪客 10 分鐘手工銀行匯款 + 拍截圖回 | COSTLY SIGNALING(Spence 1973)+ SUNK COST |
| 4 · FORGE | Tim 24h 內確認 + 寄 PDF 證書 + LINE 群邀請 | ENDOWMENT EFFECT + HEIRLOOM ANCHOR |

**Total Tim time per founder: ~10 min**(原本估 12-15 min · 80/20 template 化 + psychology framework 後 · brand IP 不減反強)。

完整 email templates 見 [docs/EMAIL-TEMPLATES.md](EMAIL-TEMPLATES.md) · PDF 證書 design spec 見 [docs/PDF-CERTIFICATE-SPEC.md](PDF-CERTIFICATE-SPEC.md)。

---

## 觸發時機

當 Founders 27 預售正式開放(目前預計 2026 Q3),`/founders` 頁面表單從「加入等候名單」改為「鎖定我的 #號碼」。流程觸發點 = 訪客填表單瞬間。

---

## 流程 · 每位創始會員 12-15 分鐘 Tim 時間

### Step 1 · 訪客填表(0 秒 · 自動)

`/founders` 表單 collect:
- Email(必填)
- 稱呼(選填)
- 通道 source(若有 `?ref=`)

→ Supabase RPC `reserve_founders_spot()`(未來建)→ 寫入 `founders` 表 + state = `pending_payment`。

### Step 2 · Tim 收到 Supabase notification(自動推送 · 但您不立即回)

設定方式(未來建):Supabase webhook → Resend / Vercel notification → Tim 的 Gmail。
Email subject 格式:`[ZONE 27 · NEW FOUNDER PENDING] #00X · {訪客 email}`

⚠️ **重要:您收到通知後 · 不要立即回 email**。

**故意等 18-26 小時才回** · per Phase 1 ANTICIPATION psychology(Cialdini reciprocity)。Visitor 大腦處理為「Tim 花了一整天讀我的資料 + 想清楚才回」 = reciprocity 啟動。Instant reply = template machine 處理 = brand IP 死。

**Suggested workflow:** 每天 22:00 固定處理前一天 18:00-22:00 申請 = 自然 22-28h delay = wait 落在 18-26h sweet spot。

詳細 anticipation phase psychology rationale 見 [docs/EMAIL-TEMPLATES.md](EMAIL-TEMPLATES.md) Phase 1 section。

### Step 3 · Tim 寄 personal onboarding email(8-10 分鐘人工 · 80/20 template)

**80% template + 20% personal line** · 完整 template skeleton + 4 種 personal line trigger pattern(對方填稱呼 / ref / handle / 什麼都沒填)見 [docs/EMAIL-TEMPLATES.md](EMAIL-TEMPLATES.md) Phase 2 section。

**Template:**

```
Subject: ZONE 27 創始會員 #00X · 親自確認您的位置

Hi {訪客稱呼 / 訪客 email},

我是 Tim · ZONE 27 創辦人。您剛剛在 https://zone27-web.vercel.app/founders
鎖定了 #00X 號創始席位。270 個座位的第 X 個是您。

跟一般 SaaS 不同 · 我親手對待 270 位創始會員 · 每個 onboarding 由我親自完成。

3 個步驟完成入會:

1. 匯款 NT$ 2,700 到以下帳號:
   銀行:{{BANK_NAME}}
   分行:{{BANK_BRANCH}}
   戶名:{{BANK_HOLDER}}
   帳號:{{BANK_ACCOUNT}}

   備註欄請填:ZONE27-#00X(per docs/EMAIL-TEMPLATES.md reconciliation
   pattern · Round 31 W-H 標準化)

   ☉ 實際 4 欄位 placeholder 替換值 in docs/private/bank-info.md
     (gitignored · public GitHub 看不到 · Tim 本機 + Claude session 讀)

2. 匯款完成後 reply 此 email 告訴我(附匯款截圖更快)
   → 我會在 24 小時內手動 confirm 並把您的 status 從
     pending_payment 改成 forged。

3. Forge 完成後您會收到:
   ▸ PDF 證書(Tim 親簽 + #00X 編號鋼印)
   ▸ BOTTOM 27 早鳥 access code
   ▸ Founders 27 LINE 群組邀請連結
   ▸ 一品紅茶招待 QR code(恆美攝影 × 伶 Kopi 旗艦店)

──

承諾:
✓ 終身免費 · 永不調漲
✓ 0% 創作者抽成(您未來賣明牌 100% 全拿)
✓ AI 模型優先試用(每次模型迭代您先看 7 天)

任何問題請直接 reply。我每天看 email 至少 2 次。

Tim
zone27-web.vercel.app
```

### Step 4 · Tim confirm 收款後 forge(2-3 分鐘 Supabase Studio)

在 Supabase SQL Editor 跑(未來建函式):
```sql
update public.founders 
set state = 'forged', 
    forged_at = now(),
    payment_method = 'manual_bank_transfer'
where id = '{uuid}';
```

→ `/leaderboard` 即時更新(從 8 → 9 forged)→ ScarcityStrip 即時更新 → 你的 dashboard 自動進度。

### Step 5 · Tim 寄第二封 personal email(5 分鐘人工)+ PDF 證書附件

**Phase 4 ENDOWMENT EFFECT trigger.** 24h 內收款確認後寄 · 不要等 7 天。
PDF 證書 design spec 見 [docs/PDF-CERTIFICATE-SPEC.md](PDF-CERTIFICATE-SPEC.md) · email template skeleton 見 [docs/EMAIL-TEMPLATES.md](EMAIL-TEMPLATES.md) Phase 4 section。

**Template:**

```
Subject: ZONE 27 #00X · 您已正式入會 · 證書與 perks 在這

Hi {訪客稱呼},

歡迎 · 您是 ZONE 27 的 #00X 號創始會員 · 270 之牆上的第 X 顆金色 cell。

附件:
1. PDF 證書(請保存 · 未來實體聚會出示用)
2. BOTTOM 27 早鳥 code: {ZONE27-{NNN}}
3. Founders 27 LINE 群組:{邀請連結}
4. 一品紅茶 QR code(JPG 附件,顯示給恆美 × 伶 Kopi 員工即可)

您現在可以:
▸ 看 /leaderboard 找您的 #00X 位置(已亮金)
▸ 邀請朋友透過您的個人推廣連結:
  https://zone27-web.vercel.app/founders?ref=reserve-{padded N}
  (每位來自您 ref 的新報名都會記錄,#270 滿員時的故事就是您寫的)
▸ 加入 Founders 27 LINE 群 · 跟其他創始者直接交流

如果未來有任何感受、需求、不滿、建議 · 請直接 LINE 我:
{Tim LINE ID}

ZONE 27 還在初期 · 您的聲音直接決定我們往哪走。

Tim
```

### Step 6 · Tim 設一個 spreadsheet 或 Supabase view 追蹤(每天 5 分鐘)

最簡單:Supabase Studio 內建 view + filter:
- `state = 'pending_payment'` AND `created_at < now() - interval '48 hours'` → 提醒 Tim 跟進
- `state = 'forged'` → 已完成 · 不再追蹤
- `state = 'cancelled'` → 退費或取消(極少數)

---

## 預估時間投入(Round 29 Wave 14 · 80/20 template 化後 revised)

### Per founder Tim time(80/20 framework)

| Phase | Tim 時間 | Visitor 時間 |
|---|---|---|
| 1 · ANTICIPATION wait | 0 min(silent · 您不寄信) | 18-26h wait |
| 2 · FIRST REPLY(80% template + 20% personal) | 5-6 min | < 1 min(讀) |
| 3 · TRANSFER(visitor 行動) | 0 min | 10 min(匯款) |
| 4 · FORGE CONFIRMATION + PDF 證書 | 4-5 min | < 1 min(讀) |
| Supabase state update | 1-2 min | 0 |
| **總計 per founder Tim time** | **~10-12 min** | **~30 min total** |

### 270 founders 全 lifecycle

| 項目 | 時間 |
|---|---|
| **每 founder ~10-12 min × 270** | **~45-54 hours total** |
| 分佈在 6-18 個月(slow trickle)| 每月 ~3-6 hours |
| 等於每週 ~45-90 分鐘 | **完全可控** |

(原本 docs 估 12-15 min per founder × 270 = 60-70 hr · 加上 PDF 證書 / LINE 群 / Supabase = 90-100 hr。
Round 29 Wave 14 80/20 framework 後 = 45-54 hr · **不到一半時間 · brand IP 反而強化** because psychology framework 真正被 framework 化。)

---

## 為什麼這比 NT$ 21,600 自動化 fee 更值得

每位 #00X 收到 founder personal email 一輩子記得這天 · 永遠是 ZONE 27 的 evangelist。**這個情感連結 lifetime value 估算遠高於 NT$ 80 處理費**。

普通 SaaS 思維:省 fee。
ZONE 27 思維:每個創始者跟 Tim 的 first-name-basis 聯繫是核心 deliverable。

---

## 升級時機

當這些訊號出現時 · 評估部分自動化:

- **>50% 訪客抱怨手工流程太慢** → 升級銀行 instant settle 通道(玉山/中信都有)
- **多位海外創始者出現** → 加 Wise / Stripe 跨境通道(只 enable 跨境,本地依然手工)
- **Tim 投入時間 > 100 小時** → 考慮 TapPay 但保留 manual fallback option

但 BLACK CARD 月費上線就**必須** TapPay(訂閱規模化 ≠ Founders 27 一次性)。

---

## 緊急聯絡 · 異常處理

| 異常情境 | 處理 |
|---|---|
| 訪客匯款但忘填備註 | Email 問匯款時間 / 金額 / 末四碼 · cross-ref 銀行 transaction |
| 訪客匯錯金額(<NT$ 2,700) | Email 補匯差額 |
| 訪客匯多了 | Email 詢問:退多匯款 OR 預付下次 BLACK CARD 月費(對方選) |
| 訪客 48h 沒匯款 | 寄第二封 reminder + 7 天截止 |
| 訪客 7 天沒匯款 | state → `cancelled` · 釋出 #號碼給下一位 waitlist |
| 訪客匯款後反悔 | 7 天 cooling-off · 全額退費(包含轉帳手續費) |

---

## Tim 在 Tim-Xuan-You's Org 內的 dashboard view

當 /admin Stage 2 後台建好時 · Tim 看到的:

```
[Today 2026-XX-XX · ZONE 27 founder dashboard]
─────────────────────────────────────────────
Forged: 47 / 270 · 17.4% complete · Next #048
Pending payment: 3
  ▸ #048 · alice@example.com · waiting 6h
  ▸ #049 · bob@example.com · waiting 18h ⚠
  ▸ #050 · carol@example.com · waiting 41h ⚠⚠

Recent forges (last 7 days):
  ▸ #047 · david@... · 2026-XX-XX
  ▸ #046 · eve@... · 2026-XX-XX
  ...

Channel attribution (top 5):
  ▸ reserve-001: 12 forges
  ▸ reserve-007: 9 forges
  ▸ direct: 18 forges
  ▸ ...
```

---

---

## ⚡ FINAL SCORE INGEST · 賽後 3 分鐘流程(2026-05-21 新增)

當 ZONE 27 公開預測的 CPBL 賽事結束後 · Tim 用以下流程把最終比分寫入 `match.finalResult` · `/track-record` 公開戰績 ledger 自動長一行。

### 為什麼這個流程重要

`/track-record` 是 ZONE 27 第 7 個 trust artifact · 也是 4 個倒置(disclosure)的物理產出。空著或舊資料 = 整個 brand IP 失重。每場比賽結束後 24 小時內 ingest 是 Tim 親自完成的 daily ritual。

### 觸發時機

CPBL 一軍賽事每天 6 場 · 全部 ~18:30 開賽 · 21:30-22:30 結束。Tim 在賽後最簡單 ritual:看到某場結束 → 開 cpbl.com.tw 那場 box score → 截 1 張圖 → 貼給 Claude。

### Step 1 · Tim 截圖 box score(30 秒)

在 cpbl.com.tw 或 CPBL 官方 app 找到剛結束的那場 → 看「即時比分」頁面 → 截一張包含以下資訊的圖:
- 兩隊最終得分
- 比賽局數(9 局 / 延長賽幾局)
- 比賽日期確認(2026-05-21)

### Step 2 · Tim 貼給 Claude(30 秒)

直接貼到對話框,加一句:「ingest 賽後比分,gameId 是 `cpbl-260521-01`」(把 gameId 換成那場的真實 id)。

### Step 3 · Claude 解析並寫入 lib/matches.ts(1-2 分鐘)

Claude 從截圖讀出:
- `homeScore` / `awayScore`(從 box score 直接抓)
- `winner`: `"home"` | `"away"` | `"tie"`(誰多就誰贏)
- `ingestedAt`: 今天 ISO date(e.g. `"2026-05-21"`)
- `innings`(預設 9 · 延長賽寫實際局數)

然後在 lib/matches.ts 該場 Match 物件加上 `finalResult` field:

```ts
finalResult: {
  homeScore: 5,
  awayScore: 4,
  winner: "home",
  ingestedAt: "2026-05-21",
  innings: 9,
},
```

### Step 4 · Claude build + commit + push(1-2 分鐘)

自動三步:
1. `npm run build` 確保 TypeScript 沒抱怨
2. `git commit -m "🎯 FINAL ingest · cpbl-260521-01 · 5:4 HOME WIN · ENGINE PROVED ✓"` (按結果 PROVED 或 DIVERGED)
3. `git push origin main`(per feedback_auto_push_zone27 不問 Tim)

### Step 5 · 自動效果(0 動作)

- `/track-record` 頁面新增 1 行 · PROVED ✓ 或 DIVERGED ✕
- `/matches/[gameId]` 加上「/ 00 · ENGINE RECEIPT」block
- HeroLiveCard 卡片右上 badge 從「LIVE · 賽事進行中」變成「✓ PROVED」或「✕ DIVERGED」
- ScarcityStrip / Footer / 任何 stats display 自動 reflect 新 sample
- ISR 24h 內全站更新(實際上 build 一發 deploy 立即 fresh)

### 異常處理

| 情境 | 處理 |
|---|---|
| Tim 截圖比賽尚未結束(延長賽) | 等比賽真的完了再截 · 不寫 partial result |
| 比分截圖跟 cpbl 官網有差 | 以 cpbl.com.tw 官方為準 · Tim 截 cpbl 官方頁面那張 |
| 某場 ZONE 27 沒做預測但 Tim 想記錄 | 不要 · /track-record 只記錄引擎公開預測過的比賽(per coverage philosophy) |
| 引擎預測結果為「dead tie 50/50」(極罕見) | winner 設那場真實贏家 · calibration 自動算 PUSH |
| 延長賽結束 12 局 5:4 home | `innings: 12` 寫進 finalResult |

### 不要做的事

- ❌ 賽後修改引擎預測 winRate(那會違反「賽前鎖定」的承諾)
- ❌ 賽後給某場「補一個 BLACK CARD 才有的深度分析」(那是 SaaS 邏輯 · ZONE 27 倒置)
- ❌ Backfill 歷史比賽(已結束、未公開預測過的 · 不能事後加進 ledger)
- ❌ 刪除 DIVERGED 行(那是 brand suicide · /track-record 的存在就是公開 miss)

### 升級時機

當 CPBL 每天 6 場全 ingest 變成負擔(估 ~10 min/天)· 評估:
- **Cron + cpbl 官方 RSS** · 如果他們開放(目前沒)
- **Tim 一日批次 ingest** · 隔天早上批次處理前一天 6 場(降低 daily churn)
- **Founders 27 投票 daily「需要追哪場」** · 訂閱者選擇 · 不全 ingest

但即使 partial ingest · 任何已 ingest 的場次都不能刪、不能改 — 那是 /track-record 的 core invariant。

---

最後更新:2026-05-21 · 由 Claude(以 Tim-xuan-you 身分) 寫入。
未來 Tim 親自修訂時直接編輯本文件。
