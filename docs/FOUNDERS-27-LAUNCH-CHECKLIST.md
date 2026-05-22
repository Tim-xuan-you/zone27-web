# Founders 27 · Launch Checklist · Tim 個人 ready 清單

> Tim 接第一筆 NT$ 2,700 銀行轉帳前需要完成的 5 項 prerequisites · 每項拆成具體 sub-steps + 預估時間 + 完成標準。
>
> 您可以一項一項 check off · 全部 ready 後跟 Claude 說「啟動 Founders 27 reframe」· 我 15 分鐘內把 /founders + WaitlistForm + /membership 從「preorder 等候名單」reframe 為「actively accepting 現正接受申請」。
>
> 寫於 2026-05-21 · per Tim 「為何需要我?」problem statement。

---

## 🎯 為什麼需要這份 checklist

Tim 問「為何需要我?」surface 了一個真實 gap:目前網站說「Founders 27 預售中 · 留 email」 · 但其實 docs/MANUAL-ONBOARDING.md 5-step flow 已寫好 · **缺的只是 Tim 那一端 5 個 operational prerequisites**。每完成一項 = 距離真實接 transfer 更近一步。

⚠️ **不 ready 就 reframe = brand 信用自殺**(訪客匯款 → 您 3 天沒回 = 死)。所以一項一項做 · 不急。

---

## ✅ Prerequisite 1 · Banking info ready

### 為什麼重要

訪客匯款要看到實際帳號 · 不能是「未來給您」。第一封 onboarding email 必須含真實帳號(per docs/EMAIL-TEMPLATES.md Phase 2 template skeleton)。

### Sub-steps

1.1. **決定收款銀行**
   - 推薦:玉山銀行(instant settle · 您手機可即時看到入帳)
   - 或:中信 / 國泰 / 永豐(網路銀行 + 即時推播 都 OK)
   - 不推薦:郵局 / 中華郵政(到帳通知慢)

1.2. **開帳號 or 用現有**
   - 您有現有個人活存帳號嗎? → 用現有(0 setup)
   - 沒有 / 想分開 → 開新帳號(到分行辦 · 30 分鐘 · NT$ 0 開戶費)

1.3. **確認 4 個 fields 全有:**
   - ✅ 銀行名 + 銀行代碼(玉山 = 808)
   - ✅ 分行 + 分行代碼
   - ✅ 戶名(您身分證上的全名 · 跟 Founders 27 personal email 寄件人對齊)
   - ✅ 帳號(完整 · 通常 14 位數)

1.4. **手機開啟「即時入帳推播」**(很重要 · 觸發 Supabase webhook → onboarding 22-26h 計時)
   - 玉山行動銀行:設定 → 訊息設定 → 入帳推播 開啟
   - 中信:同上 path
   - 沒開推播 = 您要每天主動 check 帳戶 = 不 scalable

### 預估時間

- 用現有帳號:0 分鐘
- 開新帳號:30 分鐘 + 銀行排隊時間

### 完成標準

✅ 您可一行寫出:`銀行 · 分行 · 戶名 · 帳號` · 並打開手機就看到入帳推播啟用。

---

## ✅ Prerequisite 2 · Gmail / 通知系統設定

### 為什麼重要

Supabase webhook(visitor 填表) → Tim Gmail Inbox(即時通知) → Tim 22:00 處理當天 funnel。沒這條鏈 = 您不知道有人 申請了。

### Sub-steps

2.1. **確認 Gmail address**
   - 您現在用的:`tatayngiti@gmail.com`(per Round 16 Resend production 設定)
   - 確認 ZONE 27 brand 用這個還是另開一個專門 email?
   - 建議:**用現有** · 0 setup · founder personal touch 強(visitor 知道 Tim 用自己的 Gmail)

2.2. **設定 Gmail filter for ZONE 27 founder applications**
   - Gmail → Settings → Filters and Blocked Addresses → Create new filter
   - From: `noreply@supabase.co` OR webhook 寄件人(看 Supabase 設定)
   - Subject contains: `[ZONE 27 · NEW FOUNDER PENDING]`
   - Action: Apply label 「ZONE 27 Founders」+ Star + Never send to Spam

2.3. **設 Supabase webhook**(this is the actual code work)
   - 您不需要動程式 · 我可以幫您 set up(待您 OK 後)
   - Webhook 邏輯:waitlist 表 INSERT → 寄 email 到 `tatayngiti@gmail.com` with subject `[ZONE 27 · NEW FOUNDER PENDING] #00X · {visitor email}`
   - 用 Resend(已 production · per Round 16)寄

2.4. **測試**(Tim + Claude 一起做)
   - 我用 test email 填表 → 您 30 秒內收到 Gmail Inbox notification?
   - 若有 = pass。若沒 = 我 debug。

### 預估時間

- Filter 設定:5 分鐘(您 in Gmail)
- Supabase webhook setup:30 分鐘(Claude 幫您 setup · 您 0 動作但需 confirm)
- 測試:10 分鐘

### 完成標準

✅ 您填一個 test email · Gmail 30 秒內 ping · 看到 `[ZONE 27 · NEW FOUNDER PENDING] #001` subject。

---

## ✅ Prerequisite 3 · Tim signature PNG · **DONE 2026-05-22(Round 31 W-H)**

### 狀態

✅ **`public/tim-signature.png` 已 ship**(600×981 · 透明背景 + 黑色拉滿)

Processing pipeline:`scripts/process-signature.mjs`(jimp 1.6.1)
- 白底(R/G/B > 200)→ alpha 0 透明
- 灰階 anti-alias zone → graduated alpha(保筆觸柔邊)
- 黑色筆觸(brightness < 80)→ 強制 #000000 純黑
- autocrop + resize 600px wide(Lanczos)

未來 Tim 想換簽名 · 重 paste 原圖到 `public/tim-signature-raw.png` → `node scripts/process-signature.mjs` 一鍵重 process。

### 為什麼重要

PDF 證書要 Tim 真實簽名(per docs/PDF-CERTIFICATE-SPEC.md · Pratfall imperfection)。**typed font 簽名 = template = 殺 brand IP**。一次性掃描 · 永久使用 270 次。

### Sub-steps(原版 · 已執行)

3.1. **拿一張白紙(A4)+ 黑色簽字筆 / 鋼筆**
   - 不用太大 · 5cm × 2cm 的簽名空間就夠
   - 黑色為主 · 之後可在 photoshop / Canva 換成冷金 #D4AF37

3.2. **簽 3 次**
   - 第 1 次:正常速度 · 您平常的簽名
   - 第 2 次:稍慢 · 筆觸更清楚
   - 第 3 次:稍快 · 自然 vibe
   - 選最自然的那次(不一定是最漂亮的 — Pratfall imperfection 是 feature)

3.3. **手機拍照(自然光下 · 對齊不偏斜)**

3.4. **去背 → 透明 PNG**
   - 方法 A · 上 [remove.bg](https://www.remove.bg/zh)(免費 · 5 秒)
   - 方法 B · 用 Canva「移除背景」功能
   - 結果:`tim-signature.png` 透明背景 · 200-400 px 寬

3.5. **儲存到您 cloud + 提供給 Claude**
   - 您留 1 份在 Google Drive / iCloud
   - 給 Claude 1 份(可貼在對話框 or upload)· Claude 把它 commit 到 `public/tim-signature.png`(或私存)

### 預估時間

- 簽 3 次 + 拍照:5 分鐘
- 去背 + 儲存:5 分鐘
- **總計:10 分鐘 · 一次性**

### 完成標準

✅ 您手上有一份 `tim-signature.png` · 透明背景 · 看起來像您真的簽過。

---

## ✅ Prerequisite 4 · PDF 證書 master 版

### 為什麼重要

每位 Founder 收到 PDF 證書 · 觸發 Endowment Effect + Heirloom Anchor(per docs/PDF-CERTIFICATE-SPEC.md)· 是 brand IP 物理產出。沒 master 版 · 每位都從零做 = 不 scalable。

### Sub-steps

4.1. **打開 Canva(免費帳號 OK)**
   - canva.com → Create design → Custom size → A4(210mm × 297mm)

4.2. **依 docs/PDF-CERTIFICATE-SPEC.md 9 elements 排版**
   - 背景:深藏青 #0F1A2E(Canva: 添加 → 元素 → 矩形 → 填色)
   - 頂部:冷金 horizontal hairline + Z27 monogram(typed `Z·27`)
   - 中央:大字「#008」(96pt mono · 冷金 metallic 漸層)
   - 中央偏下:Founder name(serif 24pt 骨白)
   - 簽名區:上傳您的 tim-signature.png(80mm 寬)
   - 底部:5-row audit trail(mono 8pt text-mute)

4.3. **6 variable fields 標明**(用 Canva 文字方塊 placeholder):
   - `{FOUNDER_NUMBER}` → `#001` etc.
   - `{FOUNDER_NAME}` → 對方稱呼
   - `{FORGE_DATE}` → `2026-XX-XX`
   - `{FORGE_TIME}` → `HH:MM:SS TPE`
   - `{COMMIT_SHA}` → `abc1234`
   - `{LEADERBOARD_SLUG}` → `reserve-001`

4.4. **加 ONE deliberate Pratfall imperfection**(4 選 1):
   - A · 手寫日期 font(Caveat / Homemade Apple)
   - B · 簽名筆觸不修圖 · 原汁原味 scan
   - C · 編號故意微 misalignment(1-2px 偏移)
   - D · 底部 audit trail 字距 slightly inconsistent

   推薦:**B · 簽名不修圖**(最省事 · 最 real)

4.5. **儲存為 template**
   - Canva: File → Save as template「ZONE 27 Founder Cert MASTER」
   - Per founder 操作:Duplicate → 填 6 fields → Export PDF(2-3 分鐘)

### 預估時間

- 第一版 master:30-60 分鐘(您慢慢調)
- 之後 per founder:2-3 分鐘 fill + export

### 完成標準

✅ Canva 裡有「ZONE 27 Founder Cert MASTER」template · 您 duplicate 一份 · fill #001 + 您自己稱呼 · export 出來像下方 mock-up 描述的樣子:

```
┌─────────────────────────────────────────────────┐
│ ZONE·27          [thin gold hairline]           │
│                                                  │
│              ZONE 27 FOUNDER                     │
│                                                  │
│                                                  │
│                  #008                            │
│                                                  │
│                                                  │
│              文哲(or your name)                  │
│             Forged 2026-05-22                    │
│             14:23:47 TPE                         │
│                                                  │
│         [Tim signature handwritten]              │
│         Tim · Founder · 親手 forged              │
│                                                  │
│   git commit · a3f4b2c                           │
│   engine · v0.2 · Real At-Bat                    │
│   payment · manual bank transfer · 24h verified  │
│   series · 1 of 270 · forever closed at #270     │
│   zone27-web.vercel.app/leaderboard/reserve-008  │
└─────────────────────────────────────────────────┘
```

---

## ✅ Prerequisite 5 · 22:00 固定 slot · 心理準備

### 為什麼重要

Per docs/EMAIL-TEMPLATES.md Phase 1 ANTICIPATION:**故意等 18-26h 才回 first email**。不是隨機 random · 是 systematic ritual。每天固定時間處理 = scalable 到 #270。

### Sub-steps

5.1. **選一個您每天可以 commit 的固定 slot**
   - 推薦:22:00(每天晚上)· 處理前一天 18:00-22:00 申請 = 自然 22-28h delay · 落在 18-26h sweet spot
   - 或:09:00 早上 · 處理前一晚 09:00-翌晨 09:00 申請(24h 整)
   - 不推薦:午餐時段 / 工作時間段(被打斷 · email quality 下降)

5.2. **設手機 alarm / Google Calendar event**
   - 名稱:「ZONE 27 Founder Funnel」
   - 重複:每天
   - 時間:22:00(或您選的 slot)

5.3. **準備這個 slot 的「工作環境」**
   - 電腦旁邊放手機(看 Gmail notification + Supabase)
   - 開好 Canva tab(per founder generate cert)
   - 開好 Gmail tab(寄 email)
   - 推薦泡杯咖啡 / 茶 · 5-10 min 寧靜時間

5.4. **心理 commitment**
   - Per founder 約 7-10 分鐘(80/20 framework)
   - 第 1 個 founder 可能 15 分鐘(熟悉 flow)
   - 之後 5-7 分鐘 stable
   - 每週 0-5 founders 處理(初期)· 您 slot 每天 0-30 分鐘

### 預估時間

- 設 alarm:1 分鐘
- 環境準備:5 分鐘(一次性 · 之後 reuse)
- 每天 commit:0-30 分鐘 depending on funnel volume

### 完成標準

✅ 您今晚 22:00 alarm 響時 · 您知道要做什麼(處理當天 founder funnel)· 不會感到 unprepared。

---

## 📊 全 5 項 prerequisites 時間總和

| Prereq | First-time setup | Per-founder ongoing |
|---|---|---|
| 1 · Banking | 0-30 min | 0 (即時推播自動) |
| 2 · Gmail / webhook | 45 min(我幫您 setup webhook · 您只動 filter 5 min) | 0 (filter auto-apply) |
| 3 · Tim signature PNG | 10 min · 一次性永久 | 0 |
| 4 · PDF 證書 master(Canva) | 30-60 min · 一次性 | 2-3 min per founder |
| 5 · 22:00 slot 心理準備 | 5 min(設 alarm + 環境)| 7-10 min × N founders |
| **Total first-time** | **~1.5-2.5 hour** 一次性 | - |
| **Total per founder ongoing** | - | **~10 min** |

**Per founder ongoing 10 min × 270 = 45 hours over 6-18 months**(slow trickle · per /roadmap BRAND BOUNDARIES「永遠不做 launch-blitz」)= 每週 ~45-90 min · 完全可控。

---

## 🚦 Status tracker · Tim 自己 check

當您完成每項 · 直接告訴 Claude · 我會在這個 doc commit 加 ✅ marker。

| Status | Prereq | Last check |
|---|---|---|
| ⏳ | 1 · Banking info ready | not yet |
| ⏳ | 2 · Gmail / webhook | not yet |
| ⏳ | 3 · Tim signature PNG | not yet |
| ⏳ | 4 · PDF 證書 master | not yet |
| ⏳ | 5 · 22:00 slot | not yet |

### Trigger 條件

✅ 全 5 項 ready → 跟 Claude 說「啟動 Founders 27 reframe」 → 我 15 分鐘內把 /founders + WaitlistForm + /membership 從「preorder 等候名單」reframe 為「actively accepting 現正接受申請」 + 加上實際帳號 info。

⚠️ **未全 ready 就 reframe = brand 信用自殺**。不急。逐項做。

---

## 🔗 Cross-references

- [docs/EMAIL-TEMPLATES.md](EMAIL-TEMPLATES.md) — Founders 27 onboarding email skeleton + psychology
- [docs/PDF-CERTIFICATE-SPEC.md](PDF-CERTIFICATE-SPEC.md) — PDF 證書 design spec
- [docs/MANUAL-ONBOARDING.md](MANUAL-ONBOARDING.md) — 完整 onboarding 5-step flow
- Memory [[zone27-payment-architecture]] · manual bank transfer rationale
- Memory [[feedback_zone27_pratfall_brand_ip]] · Pratfall + Costly Signaling axiom
- /roadmap BRAND BOUNDARIES · 永遠不做 launch-blitz · slow-trickle 軸

---

## Versioning

- v0.1 · 2026-05-21 · 初稿 · 5 prerequisites × sub-steps × 預估時間 · per Tim「為何需要我?」problem statement

未來迭代:Tim 完成每項時 update status tracker。完成全部後 · 此 doc 移到「completed launch-prep」歷史 reference · 不再 active。
