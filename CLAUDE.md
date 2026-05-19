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
