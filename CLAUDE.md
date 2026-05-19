@AGENTS.md

# ZONE 27 · Project Strategy Notes

## 🚫 SEO / Discoverability — FREEZE UNTIL LAUNCH READY

**Owner directive (2026-05-19, Tim):**

> SEO + Google Search Console + sitemap + robots + Analytics 放最後,
> 等網站完整準備上架之後再來處理。

**戰略邏輯:** 目前處於 stealth mode。所有「讓 Google 找得到」的動作
全部凍結。等到網站完整準備好(真實 CPBL 數據、真實會員、真實付款 /
名單)再一次性引爆 SEO blitz,讓品牌以完整姿態被全世界看到,而不是
半成品。

### ❌ 在「launch ready」之前,絕對不要加:

- `app/sitemap.ts` / `sitemap.xml`
- `app/robots.ts` / `robots.txt`
- `@vercel/analytics` 套件
- `@vercel/speed-insights` 套件
- Google Tag Manager / Google Analytics 4
- Search Console 驗證 meta tag
- Schema.org JSON-LD 結構化資料
- 任何「主動向搜尋引擎宣告存在」的動作

### ✅ 可以保留的(對 launch 前的私下分享也有用):

- 每頁的 `<metadata>` title / description(瀏覽器分頁、私下分享 OG)
- `app/opengraph-image.tsx`(社群分享預覽卡)
- `app/icon.tsx`(瀏覽器分頁 favicon)
- robots meta tag 預設(Next.js 預設不會阻擋,但也不主動 ping)

### 🎯 何時可以解封?

當以下全部 ✓ 才開始 SEO blitz:

- [ ] Supabase 後端就緒(登入、Founders 27 等候名單實際儲存)
- [ ] 真實 CPBL 賽程爬蟲每日運轉
- [ ] 付款機制或明確的等候名單收集流程
- [ ] 所有 BETA 標籤已升級或合理化
- [ ] 品牌資產定版(完整 logo、brand guide、社群帳號)

---

## 🚫 社群帳號 / 上線推廣文 — FREEZE UNTIL TIM SAYS GO

**Owner directive (2026-05-19, Tim):**

> 起品牌社群帳號 + 寫上線文(IG / Threads / X)也是放到最後!
> 我需要時會跟您說。請記得!

**戰略邏輯:** 不要在 stealth mode 期間自作主張幫 Tim「先卡個 IG 帳號」
或起草上線公告。社群第一印象只有一次,Tim 會決定何時、用什麼語氣、
從哪個平台引爆。

### ❌ Claude 絕對不要主動做的事:

- 提議「我幫你寫一篇 IG / Threads / FB / X 上線文吧?」
- 草擬任何「ZONE 27 正式上線!」風格的社群貼文
- 建議申請 / 註冊 @zone27 / @zone27tw / 任何品牌社群帳號
- 為 ZONE 27 撰寫「品牌故事」社群發文模板
- 在網站中加入「Follow us on Instagram / Threads / X」連結
- 為 ZONE 27 設計社群頭像 / 封面 / 卡片
- 規劃「launch day campaign 倒數時程」
- 引導使用 anthropic-skills:battle9th-fb-writer 等社群文案技能來推 ZONE 27

### ✅ 可以主動做的事:

- 維持 `opengraph-image.tsx`(供 Tim 私下傳網址時用)
- 在 `/founders` 等頁面加 waitlist 表單(這是被動,訪客上門才動作)
- 維護品牌資產(logo、配色)以便 Tim 將來自己用

### 🎯 何時可以解封?

當 Tim **明確說出**以下其中一句才能動作:

- 「幫我寫上線文」/ 「幫我發 IG / Threads」
- 「現在可以開社群帳號了」
- 「啟動社群行銷」
- 或任何包含「現在 / 開始 / 啟動 / 上線」+「社群 / IG / 發文 / 推廣」
  的明確指示

**模糊指令(例如「您決定下一步」)不算解封。** 遇到模糊指令時,
請繼續從產品 / 後端 / 內容深度方向尋找下一步。

---

## 📐 品牌 / 設計鐵律(由 Tim 拍板)

- **配色:** 深藏青 `#0F1A2E` × 冷金 `#D4AF37` × 骨白 `#F5F2EA`
- **字型:** Geist Sans(內文) + Geist Mono(數字/標籤)
- **語氣:** 量化分析師,不是博彩公司。永遠談「機率」而非「鐵口直斷」
- **Slogan:** 「不靠直覺,只看演算法」/「We Don't Guess. We Compute.」
- **禁止:** AdMob、宮廟風配色、閃爍 Banner、紅綠對比、可愛圖案

## 🏛️ 商業模式定錨

- **Free Tier:** 看得到基本數據,不能參與
- **BLACK CARD:** NT$ 499 / 月 — 黑金會員,大神賣明牌平台 5% 抽成
- **FOUNDERS 27:** NT$ 2,700 一次性 / 限量 270 名 / 終身 / 創作者 0% 抽成
- **拒絕:** 廣告營收(AdMob 永久封殺),只走 Premium Sponsor

## 🤝 生態系連動

ZONE 27 與 **BOTTOM 27**(Tim 的棒球手遊)是雙生品牌:

- 數字「27」共用(本壘最後一個出局數 / 完美比賽)
- 視覺系統共用(深藏青 + 冷金)
- 創始會員可獲得 BOTTOM 27 獨家虛擬資產
- 未來 BOTTOM 27 內的頂級玩家可被引流到 ZONE 27 預測社群
- 兩者**物理隔離開發**(獨立資料夾、獨立 Claude Code 視窗)

實體面整合恆美攝影 × 伶 Kopi 旗艦店 — 黑金會員出示 QR 享一品紅茶招待。

---

## 🗺️ 當前路由(v0.5)

```
/                        首頁
/matches                 賽事列表
/matches/[gameId]        SSG 詳情頁(目前 3 場 CPBL)
/lab                     ★ 即時 Monte Carlo 模擬器(BETA)
/leaderboard             THE 27 WALL · 270 創始席位視覺化
/founders                Founders 27 銷售頁
/about                   六章節品牌方法論
/icon                    Z27 monogram favicon
/opengraph-image         動態社群分享預覽卡
```

## 📦 技術棧

- Next.js 16.2.6 (App Router + Turbopack)
- TypeScript 5
- Tailwind CSS 4(於 `globals.css` 用 `@theme inline`,**沒有** `tailwind.config.js`)
- Geist Sans + Geist Mono(`next/font/google`)
- Vercel(部署) · GitHub(原始碼)
- 後端: 尚未接入(計畫採用 Supabase 或 Vercel Postgres)
