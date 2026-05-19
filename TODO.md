# 📋 ZONE 27 · Owner Pending Actions

> Tim 明早回到電腦前要做的事(整理於 2026-05-19 晚上)
>
> ✨ **今晚不用做任何事** — 您可以休息。整份代辦事項放這裡,等您。

---

## 🌅 明早優先 · 共需 ~10 分鐘 · 全部 TIER 1 免費

### ① Supabase 註冊(5 分鐘) · 🔥 最高優先

**為什麼:** 把 Founders 27 等候名單從「躺在 Vercel logs 裡」升級成「真正可查詢、可 export、可寄信」的資料庫。這是 ZONE 27 launch-ready 解封清單的第一個 blocker。

**完全免費** — Supabase free tier 給 500MB 資料庫 + 50K 月活,我們的 270 個創始會員放在裡面只佔不到 0.1%。

**操作步驟:**

1. 打開 https://supabase.com
2. 右上角點 **「Start your project」**
3. 跳出登入選項 → 選 **「Continue with GitHub」**(用您現有的 Tim-xuan-you 帳號)
4. 進入後選 **「New project」**
5. 填入:
   - **Organization**:預設(您個人 org)
   - **Project Name**:`zone27` 或 `zone27-prod`
   - **Database password**:點 **「Generate a password」**(自動生成,我們不需要)
   - **Region**:**Tokyo (ap-northeast-1)** 或 **Singapore (ap-southeast-1)**(離台灣最近)
   - **Pricing Plan**:確認是 **Free**
6. 點 **「Create new project」** → 等 ~1 分鐘 provision

**Provision 完成後:**

1. 左邊側欄點 **「Project Settings」**(齒輪 icon)
2. 點 **「Data API」** 或 **「API」**
3. 您會看到兩個值:

```
Project URL          https://xxxxxxxxxxxxxxxxxxxx.supabase.co
anon public key      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(很長)
```

**回來給 Claude 的東西:**

直接貼到對話框:
```
URL: https://xxxxxxx.supabase.co
ANON_KEY: eyJhbGc...
```

✅ **anon public key 是設計給前端公開用的,貼這裡完全安全。**
❌ 但 `service_role` key 絕對不要貼(Claude 也不需要)。

---

### ② Resend 註冊(5 分鐘) · 高優先

**為什麼:** 讓 waitlist 表單送出後**自動寄一封確認信給訪客**。
這是「真實在收名單」的最後一塊拼圖 — 訪客填完 email 收到信,才會相信您真的在做事。

**完全免費** — Resend free tier 每天 100 封,我們現在距離爆掉還很遠。

**操作步驟:**

1. 打開 https://resend.com
2. 右上角 **「Sign Up」** → 選 **「Continue with GitHub」**(或 email 註冊)
3. 進入後左邊側欄點 **「API Keys」**
4. 點 **「Create API Key」**
5. 填:
   - **Name**:`zone27-prod`
   - **Permission**:選 **「Sending access」**(只能寄信,不能讀資料)
   - **Domain**:**「All Domains」**(我們之後可以加 zone27.tw)
6. 點 **「Add」** → **立刻複製顯示的 API Key**(只會顯示一次)

**回來給 Claude 的東西:**

```
RESEND_API_KEY: re_xxxxxxxxxxxxxxx...
```

---

## ⏳ 之後再做(優先序低 · 不急)

### ③ 買正式品牌網域(NT$ 300-500/年) · 中優先

**為什麼:** 從 `zone27-web.vercel.app` 升級到 `zone27.tw` / `zone27.app` 之類專屬網域 — 品牌正式感 + SEO 強化。

**但有前提:** 需先決定品牌正式網域名稱。可選:
- `zone27.tw` — TW 版,本地市場感
- `zone27.app` — 國際版,科技感
- `zone27.cc` — 短而潮
- `zone27.io` — 矽谷感
- (或其他)

**操作步驟:**(等您決定名字後再看)

1. 推薦的註冊商:
   - **Cloudflare Registrar**(成本價,不灌水)
   - **Porkbun**(便宜)
   - **Namecheap**(常見)
2. 註冊完成後到 Vercel:Settings → Domains → Add → 輸入您的網域
3. Vercel 會給您 DNS 設定,您回註冊商套用

**回來給 Claude:** 告訴我新網域,我幫您更新 `lib/metadataBase` 與所有相關設定。

---

### ④ GitHub Copilot 訂閱($10/月) · 低優先 · 完全可選

**為什麼:** 讓您自己改程式碼時有 AI 自動補完。如果您未來想自己改改文案或微調,有 Copilot 會快很多。

**但您現在不需要** — 因為您有我(Claude Code),目前所有改動都我做。

**有興趣再做就好:** https://github.com/features/copilot

---

## 🚫 三條鐵律提醒(我永遠遵守)

從 CLAUDE.md 抄到這裡,讓您隨時看得到:

### 🚫 SEO 解凍條件
不主動加 sitemap / robots / Google Analytics / Search Console,直到下列全 ✓:
- [ ] Supabase 後端就緒(← 明天 ① 解鎖)
- [ ] 真實 CPBL 賽程爬蟲每日運轉
- [ ] 付款機制或明確等候名單流程(← 明天 ① + ② 解鎖)
- [ ] 所有 BETA 標籤合理化
- [ ] 品牌資產定版(可能含網域 ←③)

### 🚫 社群帳號 / 上線推廣文 解凍條件
需 Tim **明確說出**「啟動社群」「現在發 IG」「幫我寫上線文」等指令。**模糊指令「您決定」不解封。**

### 💰 預算紀律 v2
- 🟢 TIER 1(免費 + 註冊 + 小錢)→ Claude 可主動建議 + walk-through
- 🟡 TIER 2(交易費 + 中等月費)→ 必須明確問 Tim 才執行
- 🔴 TIER 3(NT$3K 以上單筆 / 法律 / 廣告)→ Claude 絕對不主動建議

---

## 🌙 今晚先去休息吧

ZONE 27 v0.27 已經完成度極高:
- ✅ 24 個 routes 全綠燈
- ✅ MLB 真實資料 × Lab 引擎合體
- ✅ 自動部署 6 連成功
- ✅ 三條凍結令永久寫入

**明早您回來時,告訴我您準備好做 ① Supabase 註冊,我就一步一步陪您走。**

或者只說「**幫我跑 TODO**」,我會自動找到這份檔案接續工作。
