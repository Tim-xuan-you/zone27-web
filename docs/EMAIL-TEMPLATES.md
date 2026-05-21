# Founders 27 · Email Templates · Psychology-Driven

> Tim 親手 onboarding 每位 Founder 的 email template skeleton + 心理學 bias 對照。
>
> **每封 email 80% template + 20% 個人 line** · per psychology framework。
> 完全 template = SaaS 自動寄信 = 殺死 brand IP。
> 完全手寫 = 您 30 分鐘寫不完 = 不 scalable。
> 80/20 = Patek 模式(款式一樣 · 編號 + engraving 個人)。
>
> 寫於 2026-05-21 · per agent-driven research(Spence 1973 · Cialdini 1984 ·
> Aronson 1966 · Patek allocation pattern · Hermès Birkin model)

---

## 🧠 The 4-Phase Psychological Journey

每位 Founder 從申請到入會 · 經過 4 個 phase。每 phase 刻意觸發**一個主導 cognitive bias**。連起來 = championship 級購買儀式。

| Phase | Action | Primary Bias Triggered | Time |
|---|---|---|---|
| **1 · ANTICIPATION** | 訪客填表後 · Tim 故意等 18-26h 才回 | **RECIPROCITY**(Cialdini 1984)| 18-26h after form |
| **2 · FIRST REPLY** | Tim 寄第一封 email · 含 20% 個人 line | **IDENTITY THREAT RESOLUTION** + reciprocity reinforce | 8-10 min Tim time |
| **3 · TRANSFER COMMITMENT** | 訪客匯款 10 分鐘 + 拍截圖回信 | **COSTLY SIGNALING**(Spence 1973)+ **SUNK COST**(Cialdini 1984) | 10 min visitor |
| **4 · FORGE CONFIRMATION** | Tim 收款後 24h 內寄第二封 + PDF 證書 | **ENDOWMENT EFFECT**(Thaler 1980)+ **HEIRLOOM ANCHOR** | 5 min Tim time |

**Total Tim time per founder: ~7 min**(原本 docs/MANUAL-ONBOARDING.md 估 12-15 min · template 化後減半 · brand IP 不減)。

---

## ⚠️ Phase 1 · ANTICIPATION(18-26h wait)

### 您不寄任何 email

- 普通 SaaS:訪客填表 → instant auto-reply「Welcome! 您的訂閱已啟用」
- ZONE 27:訪客填表 → **完全 silent 18-26 小時** · 然後 Tim 親自回

### Why · psychology rationale

訪客填完表單後 · 大腦 anticipation 系統啟動。如果 instant reply 來了:
- 大腦處理為「**這 system 是 automated**」 = template machine = 不重要
- Reciprocity 系統**不啟動**(您沒花時間在我身上)

如果 18-26h silence 後 Tim 親自回:
- 大腦處理為「**這個人花了一整天讀我的資料 + 想清楚**」 = real human investment
- Reciprocity 系統**啟動** = 完成匯款的概率大幅提升

### 為什麼是 18-26h not 24h not 48h

- < 18h:visitor 還在 anticipation peak · 不夠重 weight 您的時間
- 18-26h:visitor 已過 anticipation peak · 但還沒 abandonment(2 個工作半天 + 一個傍晚的 think time)
- > 26h:risk abandonment(visitor 以為您沒看到 / 已關門)

**Counter-pattern:** 不要設定 instant auto-reply 之類「我們收到您的申請了!」safety message。**The wait IS the product**(Patek allocation · Hermès Birkin 同 pattern)。

### Operational detail

- Supabase webhook 設定 → Tim Gmail Inbox notification(您即時知道)
- 但 visitor 完全感覺不到 webhook fire(沒 email · 沒簡訊 · 純 silence)
- Tim 隔天起床 / 中午 / 傍晚找一個固定 slot 處理當天 funnel(suggest: 每天 22:00 處理前一天 18:00-22:00 申請 = 自然 22-28h delay)

---

## 📨 Phase 2 · FIRST REPLY(Tim 親手寫 · 80% template + 20% personal)

### Template Skeleton(80% 部分 · 可 copy-paste)

```
Subject: ZONE 27 · #00X · 親自確認您的位置

Hi {訪客稱呼 / Email handle},

我是 Tim · ZONE 27 創辦人。

[20% PERSONAL LINE 1 — 必須引用對方絕對不可能 fake 的細節 · 見下方 4 種 trigger pattern]

[20% PERSONAL LINE 2 — 同上]

您昨晚 {申請時間} 鎖定了 #00X 號創始席位 · 270 個座位的第 X 個是您。
跟一般 SaaS 不同 · 我親手對待每一位 Founder · 每個 onboarding 由我親自完成。

──

3 個步驟完成入會:

1. 匯款 NT$ 2,700 到以下帳號:
   銀行:{Tim 的銀行}
   分行:{分行}
   戶名:{Tim 全名}
   帳號:{帳號}

   備註欄請填:ZONE 27 · #00X · {您的 email 前 8 字元}

2. 匯款完成後 reply 此 email 告訴我(附匯款截圖更快)
   → 我會在 24 小時內手動 confirm 並把您的 status 從
     pending_payment 改成 forged

3. Forge 完成後您會收到:
   ▸ PDF 證書(我親簽 + #00X 編號 metallic 蓋印)
   ▸ BOTTOM 27 早鳥 access code
   ▸ Founders 27 LINE 群組邀請連結
   ▸ 一品紅茶招待 QR code(恆美 × 伶 Kopi 旗艦店)

──

承諾:
✓ 終身免費 · 永不調漲
✓ 0% 創作者抽成(您未來賣明牌 100% 全拿)
✓ AI 模型優先試用(每次模型迭代您先看 7 天)

──

關於匯款方式 · 我想說明:

我選銀行匯款 not Apple Pay · 是刻意的。您花 10 分鐘走完這個流程 ·
跟 Apple Pay 一秒鐘 commitment 不是同一件事。這 10 分鐘 = 您加入
Founders 27 的第一個 ritual · 也是過濾的開關。

任何問題請直接 reply 此 email。我每天看 email 至少 2 次。

Tim
ZONE 27 創辦人
zone27-web.vercel.app
```

### 20% PERSONAL LINE · 4 種 Trigger Pattern

每位 Founder 一定 fall into ONE 以下 4 種 · Tim 寫 1-2 句對應 line:

#### Trigger A · 對方填了「稱呼」欄位

```
看到您填稱呼「{稱呼}」· {對該名字的 specific 觀察 / 連結}
```

範例:
- 填「文哲」:「我國中同學名字 · 您不是那位吧?(笑)」
- 填「球迷阿傑」:「直白 · 我喜歡 · 我自己 GitHub 留的也叫『Tim』而已」
- 填「黑潮 27」:「您把 27 寫進稱呼 · 我猜您是真懂這個數字的人」

#### Trigger B · 對方從 ?ref= channel 來

```
您從 {ref source} 進來 · {對該 channel 的 specific reference}
```

範例:
- ref=reserve-007: 「那是 #007 founder 的個人推薦連結 · 他大概此刻也在看這封信」
- ref=twitter: 「您是從 Twitter 來的 · ZONE 27 沒有 Twitter 帳號(per /roadmap BRAND BOUNDARIES) · 您是哪位轉的?」
- ref=hand-shared: 「您是別人手動分享連結來的 · 不是廣告找到我們的(因為我們不投廣告)· 那位是誰我很好奇」

#### Trigger C · 對方 email handle 暗示身份

```
Email 看到您是 {推測 from handle} · {對該身份的 specific 連結}
```

範例:
- handle 含「lions」: 「您是統一獅球迷吧 · 今晚 cpbl-260521-01 我們算 60% 富邦勝 · 您應該很難受」
- handle 含「sabermetrics」: 「您 handle 直接寫 sabermetrics · 比我們網站還 hardcore · 您寫的什麼?」
- handle 是真名: 「直接用真名 · 不藏 · 我尊敬」

#### Trigger D · 對方什麼都沒填(only email)

```
您只留 email · {重新框 silence as feature}
```

範例:
- 「您沒留稱呼也沒留 channel · 我喜歡這種低調的 fan。今晚 22:00 我會在 /track-record 為您 ingest 第 N 場 receipt · 您是看著 ledger 一筆筆長大的第 X 個。」
- 「您一個字都沒多填 · ZONE 27 的「不必要欄位都選填」設計就是為您這種人。」

### Why · psychology rationale(Personal Line 部分)

高單價買家(NT$ 2,700 lifetime)大腦會自動跑「**這是不是詐騙?**」threat-check。普通 template email **無法 disable** 這個 check。

**1-2 句 specific personal line(必須引用對方絕對不可能 fake 的細節)** = real human marker。大腦的 scam check **碰到 specific 細節 → 立刻關閉**。腦力從「is this real?」釋放到「what happens next」。

這是 **conversion 心理學最高槓桿**的瞬間 · 任何 template 化都會殺死它。

### 寫 personal line 的時間估算

- 看訪客資料 + 想 1-2 句 specific reference: **2-3 minute**
- 寫進 email · 校對 · 寄出: **2-3 minute**
- **總計 Phase 2 Tim time: ~5-6 minutes per founder**

---

## 💰 Phase 3 · TRANSFER COMMITMENT(visitor 行動 · Tim 不寄 email)

訪客花 10 分鐘做銀行轉帳 + 拍匯款截圖 + reply 您的 email。

### Why · psychology rationale

10 分鐘手工 = **Spence 1973 signaling theory 核心**:
- 願意花 10 分鐘 = 自我證明 commitment level
- Apple Pay 一秒鐘的人 = filtered out(brand 想要的)
- 10 分鐘投入 = 大腦 sunk-cost 鎖死了 · 退會的痛感 × 10

**同時觸發 IKEA Effect**(他自己手工輸入資料 + 操作 ATM / 銀行 app) = 「我自己 build 了這個 commitment」 → value perceived 飆升。

### Tim 在這 phase 不寄 email · 等他 reply

⚠️ **不要 chase 他**。不寄「您匯款了嗎?」追蹤信。
這是他的 commitment 過程 · 您 chase = 破壞 ritual。

如果 48h 沒回 reply → 寄 ONE reminder(neutral · 不催):

```
Subject: ZONE 27 · #00X · 您的位置還幫您留著

Hi {稱呼},

#00X 還幫您留著。如果改變主意了 · 直接 reply UNSUBSCRIBE 就好 · 沒任何懲罰。
如果只是還在思考 · 慢慢來 · 不急。

Tim
```

7 天後仍沒回 → 自動釋出 #00X 給下一位 waitlist。

---

## 🏛️ Phase 4 · FORGE CONFIRMATION(Tim 親手寫 · template + 證書)

訪客匯款完成 → Tim 收到 bank notification → Tim Supabase 改 state pending_payment → forged → Tim 寄第二封 email + PDF 證書。

### Template Skeleton

```
Subject: ZONE 27 · #00X · 您已正式入會 · 證書與 perks 在這

Hi {稱呼},

歡迎 · 您是 ZONE 27 的 #00X 號創始會員 · 270 之牆上的第 X 顆金色 cell。

[1 句 personal observation about their transfer · 可選]
[例如:「您備註填得很精準 · 匯款額分毫不差 · 我看到的當下就知道您是 detail-oriented 那種球迷」]

附件:
1. PDF 證書(請存 · 未來實體聚會出示用 · 也可掛牆)
2. BOTTOM 27 早鳥 code: ZONE27-{padded N}
3. Founders 27 LINE 群組:{邀請連結}
4. 一品紅茶 QR code(JPG 附件 · 顯示給恆美 × 伶 Kopi 員工即可)

──

您現在可以:
▸ 看 /leaderboard 找您的 #00X 位置(已亮金)
▸ 邀請朋友透過您的個人推薦連結:
  https://zone27-web.vercel.app/founders?ref=reserve-{padded N}
  (每位來自您 ref 的新報名都會記錄 · #270 滿員時的故事就是您寫的)
▸ 加入 Founders 27 LINE 群 · 跟其他創始者直接交流

──

承諾(再寫一次 · 因為這次您是 owner 了):

#00X 是您的 · 永遠是您的。
我永遠不會 issue #271 · 也永遠不會 re-issue #00X。
如果未來有任何感受、需求、不滿、建議 · 請直接 LINE 我:{Tim LINE ID}

ZONE 27 還在初期 · 您的聲音直接決定我們往哪走。

Tim
```

### Why · psychology rationale(Phase 4)

**Endowment Effect**(Thaler 1980)在這刻啟動:
- 訪客剛剛擁有了具體的東西(#00X 編號 + PDF 證書 + LINE 群 access)
- 大腦立刻 register「我擁有這個」 → 未來任何 churn 動機都會被 loss aversion 卡住

**Heirloom Anchor**(physical 證書):
- 印出來 / 掛牆 / 拍照分享 = 持續觸發 endowment
- 證書 = lifetime artifact · 不像 email 會 archive

**Tribal Inclusion**(LINE 群邀請):
- 加入後立刻看到其他 founders 對話
- 大腦處理為「我現在是這 group 一員」 → social identity 形成

**Reciprocity Renewal**(再寫一次承諾):
- 您主動 reaffirm 終身免費 / 0% 抽成 / 優先試用
- 訪客大腦 register 為「Tim 再次 commit 給我」 → reciprocity 第二次啟動

---

## 🚫 Common Mistakes to Avoid(請永遠不要犯)

### ❌ Instant auto-reply「我們收到您的申請」

**為什麼 wrong:** 殺死 Phase 1 Reciprocity bias。Visitor 大腦處理為「automated system」 = template machine = 不重要。

### ❌ Personal line 是 generic 稱讚(「謝謝您支持」/「您是我們珍貴的 member」)

**為什麼 wrong:** Generic 稱讚 = template 化 marker = scam check 不會關閉。Specific reference to fact-only-they-could-know 才有效。

### ❌ Email subject 用 emoji 或 「!!!」

**為什麼 wrong:** Marketing email visual grammar · ZONE 27 是 craft-letter · 不是 marketing。Patek 不用 emoji 寫信給 client。

### ❌ Pitch 升級 BLACK CARD / Founders 27 perks 在 Phase 2

**為什麼 wrong:** Phase 2 是 reciprocity-building · 不是 selling。已經 selling 過了(/founders page · ScarcityStrip · HeroLiveCard)。再 pitch = 破壞 personal relationship framing。

### ❌ 用 marketing automation tool(Mailchimp / ConvertKit / 等)

**為什麼 wrong:** 這些 tool 帶 tracking pixel + 「Powered by X」footer + 設計痕跡 = 違反 /privacy 0-tracker axiom + 破壞「Tim 親手寫」signal。

**Use:** Tim 自己的 Gmail · 純文字或極簡 HTML · 不帶任何 marketing footer。

### ❌ 寫得太長(超過 600 字)

**為什麼 wrong:** Patek 收件人讀的是 ritual · 不是說明書。300-500 字最佳 · 留白讓 reader 自己腦補意義。

### ❌ Forge confirmation email 等 7 天才寄

**為什麼 wrong:** Phase 4 Endowment Effect 需要在「commitment 後即時」 fire。24h 內必須寄 · 不然 ownership 感覺淡掉。

---

## 📊 Email 時間 Budget per Founder

| Phase | Tim Time | Visitor Time |
|---|---|---|
| 1 · ANTICIPATION wait | 0 min (silent) | 18-26h wait |
| 2 · First reply | 5-6 min | < 1 min(讀) |
| 3 · Transfer | 0 min (visitor 行動) | 10 min(匯款) |
| 4 · Forge confirmation | 4-5 min | < 1 min(讀) |
| **Total per founder** | **~10 min** | **~30 min(含 wait)** |

270 founders × 10 min = **45 hours total** spread over 6-18 months = 約每週 30-60 min。完全可控。

---

## 🔗 Cross-references

- [docs/MANUAL-ONBOARDING.md](MANUAL-ONBOARDING.md) — 完整 onboarding flow + ops detail
- [docs/PDF-CERTIFICATE-SPEC.md](PDF-CERTIFICATE-SPEC.md) — PDF 證書 design spec
- /audit Section 02 ESTIMATION DISCLOSURE — 同 brand IP「公開不完美」邏輯
- /manifesto Section II MONETIZATION — 為什麼倒置 SaaS 預設
- Memory [[zone27-payment-architecture]] — manual bank transfer rationale
- Memory [[feedback_zone27_pratfall_brand_ip]] — Pratfall + Costly Signaling axiom

---

## Versioning

- v0.1 · 2026-05-21 · 初稿 · 4-phase psychology framework + 4 trigger patterns + common mistakes
- 寫於 Tim「以心理學角度去出發?」問題後 · per persona invocation「以您...專家經驗」

未來迭代:當 Tim 收到實際 founder reply 後 · 標記哪些 personal line 效果好 · 哪些不夠 specific · 用真實 data 回 iterate template。
