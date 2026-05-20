# ZONE 27 · zone27-web

> **A QUANTITATIVE SPORTS INTELLIGENCE CLUB · EST. 2026**
> 不靠直覺,只看演算法 — We Don't Guess. We Compute.

全台第一個為硬核棒球迷打造的暗黑黃金級數據俱樂部。蒙地卡羅 AI 模擬器、不可篡改的勝率紀錄、零手續費的會員制預測社群。

**Production:** [zone27-web.vercel.app](https://zone27-web.vercel.app)

---

## 🛠 Tech Stack

- **Next.js 16.2.6** (App Router + Turbopack)
- **React 19.2.4**(含 `useActionState` 等新 hook)
- **TypeScript 5** strict mode
- **Tailwind CSS 4** with `@theme inline`(無 `tailwind.config.js`)
- **Geist Sans + Geist Mono**(via `next/font/google`)
- **Vercel** deploy(GitHub auto-deploy enabled · v0.22+)
- **Data:** MLB Stats API · CPBL 手動 schedule(尚未爬蟲)
- **No analytics, no SEO infra**(stealth mode · 解封條件見 CLAUDE.md)

---

## 🚀 Getting Started

```powershell
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
npx eslint .   # lint check
```

---

## 📁 Project Structure

```
app/
  page.tsx                      # 首頁 + LIVE HeroLiveCard
  matches/[gameId]/page.tsx     # 賽事詳情(SSG 3 場 CPBL 範例)
  matches/mlb/page.tsx          # MLB 即時賽程
  lab/page.tsx                  # 即時 Monte Carlo 模擬器
  lab/custom/page.tsx           # Power user mode · 自訂投手
  leaderboard/page.tsx          # THE 27 WALL · 270 創始席位
  founders/page.tsx             # Founders 27 銷售頁 + 等候名單
  about/page.tsx                # 六章節品牌方法論
  methodology/page.tsx          # 技術深度方法論
  faq/page.tsx                  # 12 題 Q&A
  signal-board/page.tsx         # 每日量化早報
  glossary/page.tsx             # Sabermetrics 詞彙表
  changelog/page.tsx            # 公開版本紀錄
  privacy/page.tsx · terms/page.tsx
  opengraph-image.tsx           # 動態 OG 卡(全站)
  layout.tsx · globals.css

components/
  Nav.tsx · Footer.tsx          # 全站 chrome
  ScarcityStrip.tsx             # 全站 founder seat counter
  HeroLiveCard.tsx              # 首頁即時勝率卡
  MatchSimulator.tsx            # 核心 sim UI(/lab · /matches/[gameId] 共用)
  ReplayBroadcast.tsx           # 9 局逐打席文字直播
  RecentSims.tsx                # localStorage 本地模擬紀錄
  WaitlistForm.tsx              # /founders 等候名單表單

lib/
  brand.ts                      # 品牌色票常數(OG 圖共用)
  founders-stats.ts             # 創始名額單一資料源
  matches.ts                    # 3 場硬編碼 CPBL 比賽 + 型別
  mlb.ts                        # MLB Stats API client
  simulator.ts                  # 蒙地卡羅引擎(at-bat by at-bat)
  sim-history.ts                # localStorage 模擬紀錄 wrapper
  waitlist.ts                   # server action: reserveSpot()
```

---

## 📜 Required Reading(coding 之前先讀)

1. **[CLAUDE.md](CLAUDE.md)** — 三條鐵律(SEO/社群凍結 + 預算分級)+ 品牌設計鐵律 + 商業模式定錨
2. **[AGENTS.md](AGENTS.md)** — Next.js 16 breaking changes 警告
3. **[TODO.md](TODO.md)** — owner 代辦事項清單
4. **[WHILE-YOU-WERE-OUT.md](WHILE-YOU-WERE-OUT.md)** — Claude 在 owner 不在時的迭代紀錄(可隨時刪除)

---

## 🤝 Brand DNA(由 owner Tim 拍板)

- **配色:** 深藏青 `#0F1A2E` × 冷金 `#D4AF37` × 骨白 `#F5F2EA`
- **字型:** Geist Sans(內文) + Geist Mono(數字 / 標籤)
- **語氣:** 量化分析師,不是博彩公司
- **Slogan:** 「不靠直覺,只看演算法」/「We Don't Guess. We Compute.」
- **生態系:** 雙生品牌 BOTTOM 27(棒球手遊)· 實體連動 恆美攝影 × 伶 Kopi 旗艦店

---

## 🏛 Business Model

| Tier | 費用 | 名額 | 創作者抽成 |
|---|---|---|---|
| FREE | NT$ 0 | 無限 | — |
| BLACK CARD | NT$ 499 / 月 | 無限 | 5% |
| **FOUNDERS 27** | **NT$ 2,700 一次性 · 終身** | **270 · 永遠關閉** | **0%** |

拒絕 AdMob 廣告收入,只走 Premium Sponsor。

---

## 📡 Deploy

GitHub `main` push → Vercel auto-deploy(v0.22+ 啟動)。
本地不需要 `vercel` CLI — 直接 `git push` 即可。
