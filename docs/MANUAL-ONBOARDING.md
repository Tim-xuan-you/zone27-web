# Founders 27 · Manual Onboarding Flow

> Tim 親自接 270 位創始會員的 onboarding checklist。
> 寫於 2026-05-20。

每一位 Founders 27 都由 Tim 親手 confirm。**這不是「省 NT$ 70 transaction fee」的工程選型,是「親手 onboard 就是創始體驗的核心」的品牌設計。**

完整架構契約見 memory `[[zone27-payment-architecture]]`。

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

### Step 2 · Tim 收到 Supabase notification(自動推送)

設定方式(未來建):Supabase webhook → Resend / Vercel notification → Tim 的 Gmail。
Email subject 格式:`[ZONE 27 · NEW FOUNDER PENDING] #00X · {訪客 email}`

### Step 3 · Tim 寄 personal onboarding email(8-10 分鐘人工)

**Template:**

```
Subject: ZONE 27 創始會員 #00X · 親自確認您的位置

Hi {訪客稱呼 / 訪客 email},

我是 Tim · ZONE 27 創辦人。您剛剛在 https://zone27-web.vercel.app/founders
鎖定了 #00X 號創始席位。270 個座位的第 X 個是您。

跟一般 SaaS 不同 · 我親手對待 270 位創始會員 · 每個 onboarding 由我親自完成。

3 個步驟完成入會:

1. 匯款 NT$ 2,700 到以下帳號:
   銀行:{Tim 的銀行}
   分行:{分行}
   戶名:{Tim 全名}
   帳號:{帳號}

   備註欄請填:ZONE 27 · #00X · {您的 email 前 8 字元}

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

### Step 5 · Tim 寄第二封 personal email(5 分鐘人工)

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

## 預估時間投入

| 階段 | 每位創始者 | 270 位總計 |
|---|---|---|
| Email confirm + send | 12-15 分鐘 | ~60-70 小時 |
| Supabase update | 2-3 分鐘 | ~10 小時 |
| 證書生成(template 化) | 1-2 分鐘 | ~5 小時 |
| LINE 群成員管理 | 偶爾 5 分鐘 | ~20 小時 |
| **總計** | **~20 分鐘/位** | **~90-100 小時(3-6 月分散)** |

90-100 小時 · 散佈在 Q3 2026 - Q4 2026 約半年內 · 每月 ~15-17 小時(每週 4 小時)= **完全可控**。

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

最後更新:2026-05-20 · 由 Claude(以 Tim-xuan-you 身分) 寫入。
未來 Tim 親自修訂時直接編輯本文件。
