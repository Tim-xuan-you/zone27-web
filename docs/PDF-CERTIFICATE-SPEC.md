# Founders 27 · PDF Certificate · Design Spec

> Founders 27 PDF 證書的完整設計規格 + 心理學 rationale。
>
> 證書不是 receipt · 是 **physical anchor for Endowment Effect + Heirloom artifact for lifetime ownership**。每位 #001-#270 收到屬於他的 PDF 證書 · 印出來可掛牆 · 拍照可分享 · 是 ZONE 27 brand IP 物理產出。
>
> 寫於 2026-05-21 · per agent-driven research(Patek allocation pattern · Hermès Birkin allocation · Endowment Effect Thaler 1980 · Pratfall Effect Aronson 1966)

---

## 🎯 Brand Goal · 為什麼這張 PDF 重要

### 三層心理學作用

1. **Endowment Effect**(Thaler 1980)
   訪客剛剛擁有「#00X 編號」這個 abstract identity。PDF 證書讓它**變成 physical thing-with-your-number-on-it**。大腦立刻 register「我擁有這個」 → 未來任何 churn 動機都會被 loss aversion 卡住。

2. **Heirloom Anchor**
   不只是 endowment · 是 **lifetime artifact**。可印出來 / 可掛牆 / 可拍照分享給朋友 / 未來實體 founders gathering 可帶上場。Patek 收藏家把 paper certificate 跟錶一樣鎖保險箱 — 那不是過度 · 那是 ritual。

3. **Patek Serialization Identity**
   每錶不只有編號 · 編號是 prominent · 視覺主角。一張 PDF 證書中央寫 `#008` 比寫「ZONE 27 founder」訊息更強 — 因為 specificity 比 group identity trigger ownership 更直接。

### 三層 brand IP 對齊

- **「方法公開」** — 證書底部含 GitHub commit hash · 任何時刻可 audit
- **Costly Signaling** — Tim 手寫簽名(掃描成 PNG)= 真實人手痕跡 · 不是 typed font
- **Pratfall Effect** — 故意留一個微 imperfection · 不完美才真實(下方詳述)

---

## 📐 Design Specifications · 視覺元素表

### A4 縱向 · 210mm × 297mm · 300 DPI 印刷品質

| Element | Spec | Psychology Rationale |
|---|---|---|
| **背景** | 深藏青 #0F1A2E full bleed | 跟網站 brand 配色 1:1 對齊 · 不同 brand 風 = 違和 |
| **頂部裝飾**(60mm 高) | 冷金 #D4AF37 horizontal 1px hairline · 中央 Z27 monogram(`Z` + `27` mono · 24pt) | Brand identity 立刻 register · 跟 OG card + favicon 視覺一致 |
| **大標題**(中央偏上) | `ZONE 27 FOUNDER`(英文 mono · 18pt · 冷金 letter-spacing 0.4em) | 「FOUNDER」字眼觸發 status identity · 不是「Member」 |
| **編號**(視覺主角 · 70mm 高) | `#008`(中央 · gold metallic gradient · 96pt mono tabular) | **Patek 視覺核心** · 編號是主角 · 不是裝飾 |
| **持有人姓名**(編號下方 24mm) | `{Founder Name}`(serif 字體 · 24pt · 骨白 #F5F2EA · italic for handwritten feel) | Identity threat resolution · 看到自己名字立刻 register 為「我的」 |
| **認領日期 + 時間**(精準到秒 · 12pt) | `Forged 2026-05-22 14:23:47 TPE`(mono · text-mute) | Specificity 鎖死「這一秒鐘是我的」 |
| **Tim 手寫簽名**(PNG 蓋上 · 80mm 寬) | Tim 掃描的真實簽名 · 帶筆觸不規則 · 冷金 over-print | **真實人手** · mirror neuron 觸發 reciprocity |
| **承諾文字**(簽名旁 · 11pt) | `Tim · Founder · 親手 forged · ZONE 27` | 證明 forge 是人手 · 不是 print farm |
| **底部 audit trail**(8pt · text-mute · 5 行) | `git commit · {SHA}`<br>`engine · v0.2 · Real At-Bat`<br>`payment · manual bank transfer · 24h verified`<br>`series · 1 of 270 · forever closed at #270`<br>`zone27-web.vercel.app/leaderboard/{padded N}` | **「方法公開」brand IP 物理產出** · 任何時刻可 audit · 不藏 |
| **Pratfall imperfection**(隱藏元素) | **故意手寫一個元素**(例如 forged date 用 Tim 手寫風格 font · 跟其他印刷字對比) | Pratfall Effect · 微缺陷 = 真實感 · 完美無瑕反而 register 為 template |

### 配色 reference(brand axiom 同 zone27-web)

```
深藏青(背景):    #0F1A2E
冷金(主強調):    #D4AF37
冷金 soft(hover): #C8A634
骨白(文字):      #F5F2EA
text-mute(次):  #8A93A8(opacity 60% 在 navy 上)
gold metallic:   linear-gradient(135deg, #D4AF37, #F4D77A, #D4AF37)
```

---

## 🔢 Variable Fields(per founder · 6 fields)

只有這 6 個 field 變 · 其他元素全部 identical:

| Field | Format | Example |
|---|---|---|
| **Founder Number** | `#001` to `#270`(zero-padded · uppercase) | `#008` |
| **Founder Name** | 對方填的稱呼 · 沒填用 email 前 8 字元 | `文哲` or `tatayngiti` |
| **Forge Date** | ISO date | `2026-05-22` |
| **Forge Time** | TPE 24h time to second | `14:23:47 TPE` |
| **Git Commit SHA** | forge 那次 commit 的 short SHA | `a3f4b2c` |
| **Leaderboard URL slug** | `reserve-{padded N}` | `reserve-008` |

### Trigger 邏輯(per Founder)

```
state = pending_payment  → Supabase row 存在但 no certificate
                         ↓
Tim confirm 收款         → Supabase state → forged + forge_at
                         ↓
Tim 跑 cert generation   → fills 6 fields · generates PDF
                         ↓
Tim email 附件寄出       → founder 收到 + LINE 群 + perks code
```

---

## 🎨 Static Elements(brand-consistent · 永遠不變)

- Z27 monogram(頂部)
- Background gradient
- Header gold hairline
- Series label「FIRST 270 · FOREVER」
- Engine version line
- Footer 5-row audit trail framework
- Tim signature PNG(掃描一次 · 永久用)
- 「Forever closed at #270」承諾 line

### Z27 monogram 建議

```
   ╱─Z─╲
  │ 27 │
   ╲───╱
```
或更簡潔:

```
Z·27
```

(等 Tim 找 designer 定稿 · 此處 spec only · 不限定具體 logo)

---

## 🛠️ Implementation Options · 3 條路

### Option A · Canva(您自己做 · 推薦 first 5 個 founders)

**時間:** 30 分鐘 first template · 之後每位 2-3 分鐘 fill fields
**成本:** NT$ 0(Canva free tier · 不裝 ZONE 27 brand asset)
**Pros:** Tim 自己 control · 無 dependency
**Cons:** Tim 手動 fill 6 fields per founder · 不 scalable to #100+

**Workflow:**
1. Canva 建一個 A4 template 用上方 spec
2. Tim 簽名 → 手機拍照 → 去背 → 上傳 Canva
3. Z27 monogram → Canva 內 vector 或上傳 PNG
4. Save as「ZONE 27 Founder Certificate Master」
5. Per founder · duplicate · fill 6 fields · export PDF

### Option B · 委託 designer 做 master + Canva 套版(推薦 #1-#30)

**時間:** Designer 6-10 hr → master file + 5 variants for testing
**成本:** NT$ 5,000-15,000 · 一次性
**Pros:** Brand quality 提升一個 tier · 可掛牆無違和
**Cons:** TIER 2 budget · 需 Tim 同意

**建議 designer brief:**
- 提供本 spec doc + brand axiom doc(/manifesto · /audit)
- 要求 deliverable:Figma master + 6 個 variable field 標明 · 可導出 PDF
- 風格 reference:Patek warranty certificate · Hermès orange box · 春池玻璃 packaging · 江振誠 RAW menu

### Option C · HTML → PDF 自動生成 script(推薦 #30+ · scale 後)

**時間:** Claude 1-2 hr 寫 script · 之後 0 hand-work per founder
**成本:** NT$ 0(本機 generation)· 或 Vercel 函式 NT$ 0(免費 tier)
**Pros:** Fully automated · Tim 1 click 出證書 · scale 到 #270 完全可控
**Cons:** Visual 比 Canva / designer 版本稍簡單(HTML/CSS 限制)

**Workflow:**
1. Claude 寫 `scripts/generate-cert.html`(template + 6 variable fields)
2. Tim 1 click: 「generate cert for #008」 → 自動 fill + open browser print preview
3. Print to PDF → 寄附件

**何時切換 Option C:** Tim 處理過 5-10 founder 後 · 確認 80/20 framework 有效 · 此時 scale 化 Option C 寫死。

---

## 🎭 The Pratfall Imperfection · 故意的微瑕疵

⚠️ **重要 · 不要做到 perfectly polished**

Pratfall Effect(Aronson 1966):**微缺陷 = 真實感 = 信任倍增**。完美無瑕的 PDF 反而會 register 為「template machine 自動生成」 = scam check 啟動。

### 必須有 ONE 微瑕疵 · 4 選 1:

#### A · 手寫日期(不用 typed font)

Tim 簽名 + 手寫 forge date(`14:23:47 TPE 2026-05-22`)· 跟其他印刷字對比 = 真實人手 marker。

#### B · 簽名筆觸不規則(不要修圖修平整)

Tim 掃描簽名後 **故意不去毛邊 / 不增強對比**。粗糙 = 真實。Patek 警官手寫筆觸是賣點 · 不是 bug。

#### C · 編號用「typewriter ribbon」風格(微對位錯一點)

`#008` 編號故意不是 perfectly centered · 而是 typewriter ribbon 印的微 misalignment(1-2px 偏移)。模擬人手蓋章。

#### D · 底部 audit trail 故意「打字機跳行」 vibe

5 行 audit trail 字距故意 slightly inconsistent · 不是 robotic perfect line spacing · 模擬真實打字機 / 老式報表機 vibe。

### 為什麼這 work

普通 SaaS 寄出的 PDF certificate 都是 perfect polish · Adobe Illustrator 渲染。**這個 perfect polish 是 dead giveaway**:

- 大腦 visual cortex 處理為「machine generated」
- Scam check 啟動
- Reciprocity 不啟動
- Endowment Effect 削弱

**One deliberate imperfection** = 強烈 human marker = 整張 PDF 突然 feel real。Patek 賣的不是金屬 · 是匠人指紋。ZONE 27 PDF 同 logic。

---

## 📦 File Specs · 輸出規格

| Spec | Value |
|---|---|
| **Format** | PDF(也可 PNG/JPG backup) |
| **Size** | A4 縱向(210mm × 297mm) |
| **Resolution** | 300 DPI(印刷品質) |
| **Color profile** | sRGB(螢幕)+ CMYK 版本(列印 backup) |
| **File naming** | `zone27-founder-cert-{padded N}.pdf` · 例如 `zone27-founder-cert-008.pdf` |
| **File size target** | < 2 MB · 含 Tim signature PNG |
| **Storage** | Tim 本地 + Vercel `/public/certs/` backup(noindex)or cloud storage |

### 證書 dual-version 建議

- **screen.pdf** · 給 founder 在線看 / 截圖分享(72 DPI · sRGB)
- **print.pdf** · 給 founder 列印掛牆(300 DPI · CMYK)

可一次性生成 both · Tim 寄 email 只附 screen.pdf · footer 加一行「想列印請回信我寄 print.pdf 版」(把 print 變成 secondary engagement opportunity)。

---

## 🚫 Anti-patterns · 永遠不要做

### ❌ 用 Stripe / Square 自帶的 receipt PDF

**為什麼 wrong:** Marketing-tool branding 痕跡。違反 brand IP「ZONE 27 不寄馬虎 PDF」。

### ❌ 加 ZONE 27 social media handle / website CTA

**為什麼 wrong:** Stealth axiom · 沒社群帳號。網址只在底部 audit trail 出現(functional · not marketing CTA)。

### ❌ 加「Welcome to our family!」/「Congratulations!」 marketing copy

**為什麼 wrong:** Marketing email visual grammar · 不是 craft-letter。Patek 證書沒寫「Congrats on your purchase!」 · 純粹記載編號 + 認證。

### ❌ 用花俏字體(楷體 / 行書 / fancy serif)

**為什麼 wrong:** ZONE 27 brand 是 Geist Mono + 骨白冷金 · 不是宮廟風。字體一致 = brand 一致。

### ❌ QR code 連到 social media 或 marketing 頁面

**為什麼 wrong:** 同上 marketing 痕跡。如果加 QR code · 只連到 `/leaderboard/reserve-{padded N}` (audit purpose · brand-internal)。

### ❌ Watermark「DRAFT」/「SAMPLE」

**為什麼 wrong:** 每張都是 final · 不是 draft 流程。

### ❌ 過度修圖 Tim 簽名(去毛邊 / 提高對比 / 換顏色)

**為什麼 wrong:** 殺死 Pratfall imperfection。原汁原味 scan = real human marker。

---

## 🔗 Cross-references

- [docs/EMAIL-TEMPLATES.md](EMAIL-TEMPLATES.md) — Founders 27 onboarding email skeleton + psychology
- [docs/MANUAL-ONBOARDING.md](MANUAL-ONBOARDING.md) — 完整 onboarding 5-step flow
- /audit Section 02 ESTIMATION DISCLOSURE · 同 brand IP「公開不完美」邏輯
- /manifesto Section II MONETIZATION · 為什麼倒置 SaaS 預設
- Memory [[zone27-payment-architecture]] · manual bank transfer rationale
- Memory [[feedback_zone27_pratfall_brand_ip]] · Pratfall + Costly Signaling axiom

---

## Versioning

- v0.1 · 2026-05-21 · 初稿 · 完整 design spec + psychology rationale + 3 implementation options + Pratfall imperfection
- 寫於 Tim「以心理學角度去出發?」問題後 · per persona invocation「以您...專家經驗」

未來迭代:Tim 找 designer 或自己用 Canva 出第一版後 · 標哪些元素 founder feedback 強 / 弱 · 真實 iterate spec。
