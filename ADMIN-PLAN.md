# 🗂️ ZONE 27 · Admin & Data Plan(會員管理與數據蒐集路線圖)

> 給 Tim 的內部規劃文件 — 不會公開上線。
>
> 回應 2026-05-19 晚上的核心提問:「**我要如何整理管理會員?去哪裡操作觀看?如何收集使用情況?大數據對未來有幫助對吧?**」

---

## 📐 核心原則

**ZONE 27 的品牌資產之一是「不過度追蹤」。**

[/privacy](app/privacy/page.tsx) 第 03 節公開承諾:
- ❌ 沒有 Google Analytics
- ❌ 沒有 Facebook Pixel
- ❌ 沒有第三方追蹤 cookies
- ❌ 沒有 IP 蒐集
- ❌ 沒有瀏覽行為紀錄

這不是「我們還沒裝」,是「我們刻意不裝」。任何 admin / data 決定**必須先過這關**:會不會破壞這個品牌承諾?

研究發現(2026 SaaS landing study + Pravin Kumar): premium 品牌的 trust signal 之一就是 **explicit anti-tracking**。對標:[Hey.com](https://hey.com), [Plausible 自己](https://plausible.io), [DuckDuckGo](https://duckduckgo.com)。

---

## 🪜 三階段路線圖

### Stage 1 · 等候名單期(現在 → 100 人加入 waitlist)

**目標:** 收集等候名單,確保品牌真誠經營而非 vaporware。

**操作介面:**
- **Supabase Studio**(supabase.com 內建管理 UI)
- 您登入 dashboard → 看到 `waitlist` 表格 → 可排序、篩選、匯出 CSV、刪除

**做得到:**
- 看每個 email / 名字(可選)/ 加入時間 / queue position
- 匯出 CSV(寄郵件通知用)
- 用 SQL Editor 跑簡單查詢(「最近 24 小時加入幾個?」)

**做不到(沒必要):**
- 漂亮自家儀表板 → Stage 2 才需要
- 使用行為追蹤 → 還沒有「使用」可追

**成本:** NT$ 0(Supabase free tier · 500MB DB · 50K MAU,我們用不到 0.1%)

**何時觸發 Stage 2:** 等候名單突破 100 人 · 或 Tim 開始想看「轉換漏斗」

---

### Stage 2 · 早期會員期(100 → 1000 人,Founders 27 正式開賣後)

**目標:** Tim 有自家後台(品牌一致 · magic link 登入 · 不必每次 login Supabase)。

**新增工具:**

1. **`/admin` 自家後台**(zone27-web 內新路由,但是 noindex + auth-protected)
   - 用 Supabase Auth(magic link · 寄 email 點連結登入,免密碼)
   - 只允許您預設的 admin email(Tim's email)登入
   - 品牌色(深藏青 × 冷金,跟主站一致)
   - Dashboard 內容:
     - **頂部 KPI 卡片** · 等候名單總數 / Founders 27 已認領 / 過去 7 天新增 / 過去 24 小時新增
     - **漏斗視覺化** · 訪客 → waitlist → 已付款 · 各階段轉換率
     - **最近活動 feed** · 最新 20 個加入名單(編號 + 時間 + 匿名 email)
     - **匯出 CSV 按鈕** · 一鍵全部會員資料
     - **刪除介面** · GDPR 退出請求處理

**做得到:**
- 看儀表板等於看 Bloomberg Terminal 風格的「我的生意進度」
- 每天 1 分鐘巡視
- 不必離開 zone27-web 切到 Supabase
- 移動裝置友善(您手機上隨時可看)

**做不到(刻意不做):**
- 個別使用者行為追蹤(誰跑了幾次 sim、看哪場比賽多)→ 違反 /privacy 承諾
- 使用者面孔識別(誰是誰)→ 純粹匿名

**成本:** NT$ 0(Supabase free tier · 7 個小時建置工時 · Claude 寫程式碼)

**何時觸發 Stage 3:** 月活突破 1000 · 或 Tim 想開始驗證「哪個 feature 最常被用」假設

---

### Stage 3 · 規模化期(1000+ MAU,或想做產品決策)

**目標:** 開始量化決策(哪個 feature 該推、哪個該收掉),但**不犧牲品牌**。

**新增工具(只挑一個,不全加):**

| 候選工具 | 月費 | 隱私評等 | 為什麼選 / 不選 |
|---|---|---|---|
| **Plausible Analytics** | $9/月 | 🟢 最佳 · 零 cookie / 零 PII / 全開源 / 歐盟伺服器 | **首選** · 與 ZONE 27 品牌 100% 對齊 |
| Vercel Analytics(免費 tier) | $0 | 🟢 良好 · 不追蹤 PII | 備案 · 但功能比 Plausible 弱 |
| PostHog | $0 起跳 · 大用量收費 | 🟡 中等 · 預設追蹤 PII,可關 | 不建議 · 預設不友善 |
| Google Analytics 4 | $0 | 🔴 差 · cookie + 跨網域追蹤 | **絕對不裝** · 摧毀品牌 |
| Facebook Pixel | $0 | 🔴 災難 · Meta 監視 | **絕對不裝** |
| Hotjar 熱圖 + 錄影 | $99/月 | 🔴 用戶最反感 | **絕對不裝** |

**Plausible 加進來的 trigger 條件(三個必須全部 ✓):**
- [ ] 月活 > 1000(以下太小,雜訊比訊號多)
- [ ] BLACK CARD 月費已上線(有真實使用者 → 量化才有意義)
- [ ] 您決定要做產品決策(哪個 feature 留,哪個砍)

**裝 Plausible 同步要做:**
1. 更新 `/privacy` 第 03 節 — 把「沒有第三方追蹤」改為「我們用 Plausible 收集匿名彙總資料(零 cookie · 零 PII · 完整資料公開)」
2. 在頁尾加一行「**Analytics: Plausible (cookieless)**」連結到您的公開 Plausible dashboard
3. 公開您的 stats(Plausible 支援 public dashboard,連去就看得到 ZONE 27 流量) — 這個「自誇地公開」是研究指明的 premium trust 武器

**成本:** $9/月(NT$ ~300/月 · TIER 1 ✓)

---

## 🚫 永遠不裝的工具(品牌防線)

| 工具 | 為什麼 |
|---|---|
| Google Analytics 4 | Cookie + Google 全網追蹤 · 直接違反 /privacy 承諾 |
| Facebook Pixel | Meta 監視陷阱 · ZONE 27 品牌**絕對不允許** |
| Hotjar / Lucky Orange / Smartlook | Session recording · 拍下使用者每一個滑鼠移動 · 用戶最反感的形式 |
| Mixpanel / Amplitude(預設配置) | 預設綁定 user identity · 太重 · 違背匿名原則 |
| LinkedIn Insight Tag | LinkedIn 全網追蹤 · 不必要 |
| Pinterest Tag · TikTok Pixel · X Pixel | 我們不上社群 · 也不該追蹤社群來源 |

---

## 📊 大數據真相

媒體把「大數據」浪漫化,但對 ZONE 27 的真實狀況是:

| 數據量 | 名稱 | 工具 | ZONE 27 何時需要? |
|---|---|---|---|
| < 1K 行 | 小數據 | Excel / Google Sheet | 永遠不需要 |
| 1K - 1M 行 | 標準數據 | PostgreSQL(Supabase) | **這就是您要的** |
| 1M - 1B 行 | 中等數據 | BigQuery / Snowflake | 永遠不會到(270 founders + 月活 < 100K) |
| > 1B 行 | 真大數據 | Hadoop / Spark / data lake | 永遠不會到 |

ZONE 27 完整生命週期內最可能的數據規模:
- Founders 27:**270 行**
- BLACK CARD 月費會員:**1K - 10K 行**(樂觀)
- 每日 page views:**100 - 1000**(stealth 結束後)
- 每日 sim runs:**500 - 5000**

**結論:** 「大數據」對 ZONE 27 是**過度工程化**。把 Supabase 用好,十年內都夠。

---

## 🎯 立刻可確定的下一步(按時序)

```
明天早上 (2026-05-20)
  └── ① Supabase 註冊 ← TODO.md 既定第一項
       └── waitlist DB 上線 → Stage 1 自動就緒
            └── ScarcityStrip 換成真實計數(從 lib/founders-stats.ts 接 DB)

未來幾週(視 waitlist 成長)
  └── 接近 100 人時 → 開工建 /admin 自家後台(Stage 2)
       └── 包含:登入 + 5 個儀表板區塊 + 匯出 CSV

未來幾月(視 BLACK CARD 上線進度)
  └── 評估 Plausible(Stage 3 trigger 三條件)
       └── 同步更新 /privacy 揭露 → 自誇地公開儀表板
```

---

## 💬 Tim 應該知道的權衡

| 您想要的 | 我建議的 | 為什麼 |
|---|---|---|
| 「想看每個使用者的足跡」 | 看不到,品牌不允許 | /privacy 承諾 · 違反就毀品牌 |
| 「想知道誰最活躍」 | 匿名彙總可以(Plausible)· 個別使用者不行 | 用 Plausible 看「最熱門頁面」「停留時間」就夠用 |
| 「想 retarget 廣告」 | **絕對不要** | 違背 stealth + 反廣告品牌 |
| 「想用 AI 預測誰會付費」 | 樣本太小,做不到 | 270 founders 太小 · ML 需要至少 10K 級的標籤 |
| 「想做 A/B 測試」 | Stage 3 之後可考慮 · Vercel + Plausible 內建 | 但要小心:測試本身會留下「不一致」的痕跡,可能傷品牌一致性 |

---

## 📌 一個建議您現在就可以決定的事

「ZONE 27 的數據哲學要不要寫進 [/about](app/about/page.tsx) 或 [/privacy](app/privacy/page.tsx)?」

寫進去的話,您把「不追蹤」從**默認**升級為**明示宣言** — 在競爭對手都在追蹤的市場,這是極強的 differentiator。

範例文案(您決定要不要採納):

> **我們不追蹤您的足跡。**
> 我們不裝 Google Analytics、Facebook Pixel、Hotjar 錄影。
> 您在 ZONE 27 跑了幾次 Monte Carlo、看了哪場比賽,只存在您自己的瀏覽器,
> 沒有伺服器副本,我們連數都不數。
> 這不是技術限制,是品牌哲學。

這段如果加到 /about 或 /faq,會變成另一個被 founder 截圖傳給朋友的 trust artifact。

---

**最後一句話:** 您問的不是技術問題,是**品牌哲學**問題。Supabase 是工具,Plausible 是工具,/admin 是工具 — 您真正在問的是「我這個品牌跟使用者的關係該長什麼樣」。我的答案是:**極簡 + 公開 + 自誇**。讓使用者知道您在收什麼(不多),不收什麼(很多),為什麼這樣決定。

— 寫於 2026-05-19 晚上 · 等您回來討論
