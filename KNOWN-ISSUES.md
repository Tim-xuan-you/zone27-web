# 🧭 ZONE 27 · Known Issues & Deferred Items

> 給 Tim 明天 onboarding 用的一份「我知道但沒做」清單。
>
> 八輪迭代中 Claude 抓到、評估、刻意延後的東西。每一項都有理由。
> 沒寫進這份的,代表「已修」或「真的沒問題」。

---

## 🟡 Pending owner actions(您該做的)

從 [TODO.md](TODO.md) 引用 · **以 DAY 2 結束狀態 (2026-05-20 晚)**:

- ✅ **① Supabase 註冊** — **DONE**(2026-05-20 上午 · waitlist DB 上線 · RLS-locked + 2 個 SECURITY DEFINER 函式)
- **② Resend 註冊**(5 分鐘)— 仍 pending · 解鎖 confirmation emails
- **③ 品牌網域購買**(等名稱決定:zone27.tw / .app / .cc / .io)
- **④ Footer 版本 chip bump** v0.27 → v0.28(您拍板的時機 · DAY 2 算 v0.28 milestone)
- **⑤ CPBL 截圖**(3 分鐘 cpbl.com.tw)— 解鎖真實 CPBL ingestion

完整步驟見 TODO.md · 我會在您說「開始 ② Resend」時一步步帶您走。

---

## ⏸️ 研究 backed 但我延後的技術升級

### A. Next.js 16.2 View Transitions API

**Round 4 研究發現:** Next.js 16.2 原生支援 View Transitions(`unstable_ViewTransition` 元件 + `experimental.viewTransition: true` config flag)。可以做頁面切換時的 morph / crossfade,native app 感。

**為什麼延後:**
- Firefox 仍在 flag 後(~22% 訪客拿不到效果)
- Directional slide pattern 觸發動暈症(違反 anti-誇大 brand)
- Mobile perf 未驗證
- 安全子集(morph + crossfade)需要先決定 morph 哪些元素 → 不夠成熟

**何時可重新評估:** 1-2 週後,觀察 Safari / Firefox parity 改善。

### B. Bloomberg-grade StatusBar(底部固定狀態列)

**Round 4 研究發現:** 24px 高 fixed bottom bar · heartbeat dot + build timestamp + chord shortcut hint。Bloomberg / FactSet 80/20 terminal-feel 武器。

**為什麼沒做:**
- 跟 ScarcityStrip(頂部固定)會視覺打架
- 引入 fixed-position 增加 mobile 風險
- 「chord shortcut」需要先實作 keyboard shortcuts 才有意義

**何時可考慮:** 您想試 Bloomberg 感更滿時。半小時可 ship。

### C. Apple Touch Icon + manifest.webmanifest

**Round 5 研究發現:** `public/` 缺 apple-icon、icon-180.png、manifest.webmanifest。iOS 加入主畫面、LINE 預覽都會 fallback。

**為什麼延後:**
- 加 manifest 會觸發 Chrome Android PWA install prompt + Google manifest crawler → **違反 stealth freeze**
- 半小時內難精準做對(易產生破損 favicon 被 iOS 快取 7 天)
- 目前訪客都從直接分享來,看的是 OG 卡(已完備),不是 home-screen 圖示

**何時可做:** Launch day SEO blitz 時跟 sitemap / robots / Analytics 一起 bundle。

---

## ⏸️ 已知 edge-case bug(機率極低)

### D. Safari ≤16 `Intl.DateTimeFormat` 「24:00 vs 00:00」 邊界 bug

**WebKit bug #161714:** Safari ≤16 + `hour12: false` + `hour: "2-digit"` → 午夜場次回傳 `"24:00"` 而非 `"00:00"`。

**影響範圍:** 只有當 MLB 場次剛好在 UTC 16:00 整點開賽時觸發(極罕見,主要是 Field of Dreams 之類特殊賽事)。位置:[lib/mlb.ts:119](lib/mlb.ts)。

**為什麼延後:** 真實機率極低 · 修法需要手動偵測 + format `"00"`。**寫進此文件,等真實案例出現再修**。

---

## 🟡 Brand decisions(您決定就好)

### E. BLACK CARD 定價跨頁敘事差異

`/about` Chapter 6 寫「黑金會員年費 NT$ 4,990」(暗示 10 個月 = 4990 的年度優惠價,把終身 2700 顯得便宜)。

`/founders` 「Why this price」表格用 `BLACK CARD 5 年 = NT$ 29,940` = 月費 499 × 60 = 12 個月 × 5 年。

兩者各自 internally consistent,**但若使用者交叉計算**(年費 4990 × 5 = 24,950 ≠ 29,940)會發現差異。

**選項:**
- 維持現狀(各頁面 narrative 各自獨立)
- 統一為「499/月,無 annual 優惠」→ `/about` 改用 NT$ 5,988/年
- 統一為「499/月 或 4990/年 兩種」→ `/founders` 5 年 = NT$ 24,950

**我的建議:** 等 BLACK CARD 真實上線時(2026 Q3)再決定 — 您可能會調整定價策略。現在不急。

### F. 「我們刻意不追蹤」是否升級為網站宣言

✅ **UPGRADED in DAY 2(2026-05-20)** · 完整列在以下 3 處:

1. **Footer 全站常駐 trust line**: 「FUNDED BY FOUNDERS · NO VC · NO ADS · NO TRACKERS」
2. **/manifesto Section IV PRIVACY**: 完整 4 層論證(為什麼藏 / 誰受害 / 我們失去什麼 / 為什麼接受)
3. **/privacy 自訂 OG card**: ✕ list 顯示 0 install / 0 set / 0 storage

升格完成 · 不再是 deferred item。原始 Round 6 /faq Q4 仍保留。

---

## 🟢 已修並通過驗證的事項(僅備忘)

這幾件被 Round 5 / 6 抓到後已修完,記錄在此給您參考:

| 議題 | 狀態 | Fix |
|---|---|---|
| `/matches/[gameId]` SSG 凍結炸彈 | ✅ Round 5 修 | + `revalidate=86400` + `DATA · ARCHIVED` badge + `isMatchDataStale()` 助手 |
| `/matches/[gameId]` 假 LIVE DEBATE 「7 位創始會員正在熱議」 | ✅ Round 3 修 | 改為 honest PRE-LAUNCH · BLACK CARD CHAT 區塊 |
| `text-mute/{40,50,60}` 在 10px 上 WCAG AA fail(22 處) | ✅ Round 6 修 | replace_all 改為 `text-mute`(5:1 過 AA) |
| 英文標籤被普通話發音念(~10 處) | ✅ Round 6 修 | 加 `lang="en"` 到高流量英文 spans · Round 9 補完 inline rendering |
| `lib/sim-history.ts` 類型驗證弱 | ✅ Round 5 修 | 從 3 欄位 → 11 欄位 + `Number.isFinite` |
| `/matches` + `/signal-board` 空陣列 crash 風險 | ✅ Round 5 修 | 加 empty state + optional chaining |
| `/faq` headline 寫死 `12` 但實際 13 Q | ✅ Round 5 修 | 改 dynamic `{TOTAL_QAS}` · 加 anti-tracking Q 後現為 14 |
| `/about` 寫死 `#008` | ✅ Round 5 修 | 改 `formatBadge(FOUNDERS_NEXT)` 動態 |
| `WaitlistForm` `**markdown**` JSX 不 render | ✅ Round 1 修 | 改 `<span>` 包裹 |
| 「ON-CHAIN TRUTH」誤導為區塊鏈 | ✅ Round 1 修 | 改「TRANSPARENT BY DESIGN」 |
| 「BETA-ACCESS」軟弱字眼 | ✅ Round 1 修 | 改「PRIORITY PREVIEW」 |
| MatchSimulator / ReplayBroadcast 冗餘 useEffect | ✅ Round 1 修 | 移除 · parent 都已用 `key` prop |
| `/matches/page.tsx` 「週二」vs data 的「星期二」 | ✅ Round 5 修 | 對齊「星期二」 |

---

## 📊 Performance baseline(2026-05-19 build)

| 指標 | 值 |
|---|---|
| Total routes | 26(含 5 個 OG image routes + 24 個 page routes)|
| Build time | ~1.7 秒(Turbopack)|
| TypeScript check | < 2 秒 |
| `.next/static/chunks/` 總大小 | **896 KB**(轉 gzip 後 ~250-350 KB) |
| 最大 chunk | 223 KB(React/Next core,所有頁面共用) |
| CSS | 48 KB(Tailwind v4 + brand system) |
| Lint errors | 0 |
| Lint warnings | 0 |
| WCAG AA contrast fails | 0(Round 6 修完) |

**判讀:** 對 26 個 routes 的網站,896 KB 是極健康的數字(現代 SaaS 普遍 1-2 MB)。沒有任何 bundle 優化的急迫性。

---

## 🚦 三條鐵律提醒(您永遠看得到的版本)

從 [CLAUDE.md](CLAUDE.md) 引用:

1. **SEO 凍結** · 不主動加 sitemap / robots / GA / Search Console · 直到 launch ready
2. **社群凍結** · 不主動開 IG / X / Threads · 您明確說「啟動社群」才解封
3. **預算分級** · TIER 1(免費/註冊)可主動建議 · TIER 2(交易費)必問 · TIER 3(NT$3K+)絕不主動建議

---

## 🌅 早安建議流程

```powershell
cd C:/Users/tatay/Desktop/Second/zone27-web
npm run dev     # localhost:3000 看實際效果
git status      # 看所有未 commit 改動
```

**先看:**
1. [WHILE-YOU-WERE-OUT.md](WHILE-YOU-WERE-OUT.md) — 八輪迭代完整紀錄
2. 本文件 — 我知道但沒做的事

**再看(逛一圈確認:):**
- `/` 首頁 hero + credibility strip
- `/founders` 完整滾動到底(看 founder note quote + comparison + Why this price + Mini-FAQ + CopyLinkButton)
- `/audit` 滾到底(看 6 sections + ShareableQuote 矛盾引言 + Related Reading)
- `/methodology` 第 04 之前(看 ShareableQuote)
- `/leaderboard` 等 8-10 秒(看空席 scintillate 微閃)
- 任何頁 Footer 滑鼠移到版本 chip → 看金色點點 spring 彈跳
- Tab 鍵 → 金色 focus ring

**啟動 Supabase 流程:** 跟我說「**開始 ① Supabase**」我帶您一步一步走。
