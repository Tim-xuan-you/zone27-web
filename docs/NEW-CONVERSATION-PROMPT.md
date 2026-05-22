# 📋 New Conversation Prompt · ZONE 27 Session Handoff

**用途:** 開新對話窗時複製此 prompt 整段 paste · 新 Claude 一秒接上 context。
**最後 update:** 2026-05-22 · Round 37 W-B 收盤 · 22 commits this session

---

## 🔗 Copy 以下 prompt 整段(從「繼續開發」 到最後一行 inclusive)

```
繼續開發 ZONE 27 — 台灣硬核棒球迷的暗黑黃金級量化分析品牌 · displacement mission 對標幹掉玩運彩+報馬仔。

📂 工作目錄:C:\Users\tatay\Desktop\Second\zone27-web
🌐 正式網址:https://zone27-web.vercel.app
📦 GitHub:https://github.com/Tim-xuan-you/zone27-web

【請按以下順序讀完】每份檔都有重要脈絡:

1. CLAUDE.md → 34 visitor-discoverable routes(per Round 37 W-A LIVE NOW sweep ·
              「PRE-LAUNCH · Q3 2026」 全 strip · 都 ✓ LIVE state)+ 三條鐵律 +
              Global components 40+ + 8 字 grammar
2. AGENTS.md → Next.js 16 breaking changes 警告
3. WHILE-YOU-WERE-OUT.md → Round 1 → Round 31 完整 ToC(Round 32-37 在 /now journal)
4. /now journal → Round 33-37 完整 SHIPPED + CYCLE 軌跡
5. KNOWN-ISSUES.md → 已知刻意延後事項
6. TODO.md → Tim pending actions
7. docs/SUPABASE-SETUP.md
8. docs/MANUAL-ONBOARDING.md
9. docs/EMAIL-TEMPLATES.md
10. docs/PDF-CERTIFICATE-SPEC.md
11. docs/FOUNDERS-27-LAUNCH-CHECKLIST.md
12. docs/private/bank-info.md(GITIGNORED · 本機 disk 讀)
13. supabase/migrations/0001_waitlist.sql
14. supabase/migrations/0002_founder_reservations.sql

【MEMORY.md 自動載入 axioms · 不必再讀】重點 18 個 axioms:
  · user_tim · feedback_phone_vs_computer · feedback_persona_invocation
  · zone27_supabase_architecture · zone27_coverage_philosophy
  · zone27_monetization · zone27_disclosure · zone27_musk_methodology
  · zone27_payment_architecture · feedback_auto_push_zone27 · feedback_no_rest_zone27
  · feedback_zone27_homepage_minimalism · feedback_zone27_audience_fans_not_engineers
  · feedback_zone27_mobile_first · feedback_zone27_pratfall_brand_ip
  · feedback_zone27_domain_deferred · project_zone27_jobs_discipline
  · feedback_founder_dogfood_canary(Round 32 W-C 寫死 · founder push back 第 1 次就 trust)
  · feedback_no_waiting_rule(Round 37 W-A 寫死 · 「不等 Q3」 鐵律 · default ship NOW)

【2026-05-22 全日收盤狀態 · Round 28-37 W-B · 22 commits this single session】:

技術:
- 34 visitor-discoverable routes(33 + Round 37 加 /rewards 已在 R35 W-A · 32→33 R33 W-E /annual · 33→34 R35 W-A /rewards)
- ~45 reusable components(R34 W-A ConfidenceStars 全鏈 4 surfaces · R36 W-C PaidTierLockedGrid · R36 W-D AdminTierSwitcher + PreviewModeBanner · R37 W-B VibeCheck)
- lib/ helpers:teams · predictions · cpbl-pitchers(auto-generated)· cpbl-advanced · follows · notes · founder-reservations
- @supabase/ssr installed(cookie-aware Phase 1 auth)
- Supabase Tokyo(RLS-locked · 0001 + 0002 migrations applied)
- Resend production(Round 16)
- Build / Lint / TSC strict 全程綠
- Next.js 16.2.6 + production-ready next.config.ts(R34 W-C · OWASP + image patterns + cache headers)

商業狀態 · Round 37 W-A「不等 Q3」 鐵律後:
- 4-tier membership ladder · 全 LIVE NOW · 不再 PRE-LAUNCH state:
  1. 匿名訪客(免費 · 不留 email)
  2. FREE TIER(免費 · email + password · 5 unlocks LIVE)
  3. BLACK CARD(NT$ 299/月 · 月卡手動續訂 · 個人方案 ECPay · LIVE · 倒置 SaaS 不自動扣款)
  4. Founders 27(NT$ 2,700 一次 · 限 270 · LIVE 申請通道開啟 · email Tim manual review)
- /rewards · 兌換 LIVE 即時(恆美攝影 ecosystem · Tim 親手 fulfill)
- /membership/black-card · LIVE 月卡手動 · 6 unlocks(Engine Lineup + Lens Variety + 賽事討論 + 5% 抽成 + voting + Tim 工程筆記)
- /annual/2026 · Year 0 honest report LIVE
- /founders/ledger · 申請通道 LIVE · email Tim 申請

Engine Lineup(/methodology Section 04 · accuracy progression 軸線):
- v0.2 Pitcher-Only Monte Carlo · LIVE · FREE · N=1 PROVED(cpbl-260521-01)
- v0.3 + Park Factor + 隊伍 wOBA · DEV · 規劃中
- v0.4 Bayesian Model Averaging · PLANNED

Lens Variety(/methodology Section 05 · analytical variety 軸線):
- Win Probability · LIVE · FREE(同 v0.2 engine)
- ✓ Vibe Check · LIVE · R37 W-B(連勝連敗 streak + Tversky/Gilovich 1985 hot hand fallacy disclaimer)
- Park Factor · planned · 4 場館 home advantage
- Pitcher Fatigue · planned · 休息天數 + IP load
- Underdog Tracker · planned · upset 機率
- Bullpen Depth · planned · 牛棚比較
- Matchup History · planned · H2H 趨勢

ZONE 27 brand IP 4 redlines 全守:
- 不顯示賠率 · 不用「LOCK」 vocab · Engine streak only(no user bet streak)· 0 bookmaker affiliate

Pratfall sections 全保留:
- /audit S05 disclosure · /methodology LIMITS · /roadmap BOUNDARIES ·
  /track-record DIVERGED · /founders/ledger rejection samples · /coverage NEVER

F6 「ZONE 27 不做」 declarative-absence list(R33 W-B ship · R37 W-A 加 6th item):
1. 不顯示賠率(no odds)
2. 不賣明牌(no LOCK)
3. 不分潤博彩(no affiliate)
4. 不藏 DIVERGED(no hidden misses)
5. 不追蹤您(0 trackers)
6. 不等 Q3(no waiting · R37 鐵律)

ZONE 27 ↔ 恆美攝影 × 伶 Kopi cross-promotion 真實 LIVE:
- /rewards 兌換實體獎品(底片 / 咖啡 / 沖洗 / 護照代辦折抵)
- Tim 親手 fulfill · 來店免費 / 郵寄 NT$ 100

【Tim 仍 pending 親自動作】:
- ⏳ TONIGHT 22:30+ TPE · 3 場 box score 截圖(cpbl-260522-01/02/03)→ Claude ingest → N=1→N=4
- ⏳ Brand domain · zone27.tw/.app/.cc/.io · Tim-cued only(per [[feedback-zone27-domain-deferred]])
- ⏳ 第一個真實 BLACK CARD 月卡訂閱者來 email Tim → 您手動寄 ECPay 付款連結
- ⏳ 第一個真實 Founders 27 申請者 email Tim → 您 manual review → onboarding(per docs/MANUAL-ONBOARDING.md 4-phase)

【Round 37 pending NOW ships per 鐵律】(Claude default 直接 ship · 不問 Tim keyword):
- Park Factor lens scaffold(用 existing match data · CPBL 4 場館 home advantage 估算)
- Pitcher Fatigue lens(用 existing match data · 休息天數計算 · 不需新 source)
- Engine v0.3 actual code(需 park factor data · 部分可 NOW)
- Supabase migration 0003 SQL file 寫好(Tim 一鍵跑)
- /discuss/[gameId] scaffold mode(BLACK CARD-gated · 24hr decay · client-side stub OK)
- /transparency 5 routes merge(brand-axiom-level · 仍需 Tim explicit OK)

【手機 vs 電腦規則】(per feedback_phone_vs_computer):
Tim 訊息短/casual 時請先問「您現在在電腦前嗎?」再決定 walk-through。

【Persona invocation 規則】(per feedback_persona_invocation):
「以您...專家經驗」 = think-harder lens · ONE sharp call · 不是長 deliverable。
BUT Tim 明確 AFK + 「請盡可能地迭代」 = 多 wave execution。

【Tim 連續 push 同方向 2+ 次】(per feedback_zone27_pratfall_brand_ip):
Canary fire · 我 over-defended · 默認 trust Tim 直覺。
特例:brand-axiom-level changes(刪 routes · 改 redlines · MLM/分潤)仍需 explicit OK。

【自動推送】(per feedback_auto_push_zone27):
Claude 直接 push zone27-web · 不問 Tim · 直到買品牌域名(③ 永遠 Tim-cued only)。

【沒「休息」鐵律】(per feedback_no_rest_zone27):
永遠不說「休息 / 明天 / 晚安 / take a break」。

【「不等 Q3」鐵律】(per feedback_no_waiting_rule · R37 W-A 寫死):
任何現在能做就做 · 不等 · 不 defer · 時間就是金錢。 Default = ship NOW 不問 keyword。
例外只在 brand-axiom-level changes 仍需 Tim explicit。

【Founder dogfood canary】(per feedback_founder_dogfood_canary):
Tim 截圖 / 真實使用發現的 UI bug 永遠優於 agent audit。
UI feature ship 前 verify external dependency end-to-end · 不只 code path compile。

【Critical「不做」 list(brand IP 鐵律 rejected features)】:
- ❌ user-to-user social platform / forum / Discord 群組(R30 W11 axiom)
- ❌ 集點 / 兌換 / 點數系統(engagement farming)
  · EXCEPTION ship · /rewards skill-based fantasy league prize · R35 W-A
  · brand-pure 替代(PROVED 預測 → 實體獎品 · 0 cash · 0 daily login)
- ❌ 儲值 / wallet / 金錢處理(金管會)
- ❌ cash referral / 推薦分潤 cash(觸台灣多層次傳銷管理法 § 29)
  · brand-pure 替代:Witness Referral · Berkshire pattern · 0 cash · queued ship
- ❌ 「X of 270 sold」 live FOMO counter(R31 W-X2 Hermès pivot)
- ❌ 寄生 gambling 平台(玩運彩 · 報馬仔)
- ❌ AdMob 廣告
- ❌ 多步驟 onboarding wizard
- ❌ modal paywall / scroll-lock
- ❌ 「管它準不準包裝」 fake methodology(brand soul redline · R36 explicit)

今天我要做的事:[ 填入任務 · 或留空讓 Claude 接 TODO + 鐵律 default ship NOW ]
```

---

## 📋 最短版(如果您只想快速接上 · 不需要完整 context)

```
繼續 ZONE 27 開發。 專案在 C:\Users\tatay\Desktop\Second\zone27-web。
請依序讀 CLAUDE.md → AGENTS.md → WHILE-YOU-WERE-OUT.md → /now journal → KNOWN-ISSUES.md → TODO.md。
MEMORY.md 自動載入 18 axioms · 不必再讀。 重點 axiom:[[feedback-no-waiting-rule]] (R37 寫死) +
[[feedback-zone27-pratfall-brand-ip]] + [[feedback-founder-dogfood-canary]] + [[feedback-auto-push-zone27]]。
22 commits 2026-05-22 single session ship(Round 33-37 W-B):ConfidenceStars 全鏈 · marketing pivot · BLACK CARD
299 月卡手動 LIVE · /annual/2026 · /rewards · Engine Lineup + Lens Variety + VibeCheck LIVE · PaidTierLockedGrid ·
AdminTierSwitcher · 「不等 Q3」 鐵律 sweep。 Build/Lint/TSC strict 三綠。
今天我要做:[ 填入任務 · 或留空讓 Claude 接 TODO + 鐵律 ship NOW default ]
```

---

## 🎯 開新對話窗 verify checklist

複製 prompt + 新 Claude 應該立即知:
1. 22 commits Round 33-37 W-B ship 完
2. 「不等 Q3」 鐵律 寫死 memory
3. BLACK CARD 月卡手動 LIVE(個人方案 ECPay)
4. Founders 27 申請通道 LIVE(email Tim)
5. VibeCheck 第 1 個 lens LIVE
6. 4 brand IP redlines 全守 · Pratfall sections 全保留
7. Tonight 22:30+ ingest pending · ONE Tim action
