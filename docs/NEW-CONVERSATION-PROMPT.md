# 📋 New Conversation Prompt · ZONE 27 Session Handoff(R172 W8)

**用途:** 開新對話窗時 copy 此 prompt 整段 paste · 新 Claude 一秒接上 context。

**最後 update:** 2026-05-27 · **R172 W7 handoff** · R164 → R172 = 8 rounds · 60+ commits · 142+ ships

**Token urgency:** Tim 第 47 次同 mandate「現在這個對話窗太燒 TOKEN · 開新對話窗複製過去」 · 必要 handoff token urgency 高。

---

## ⚠️ CRITICAL · R172 BRAND REFRAME · 客群 = 賭徒 · pricing 完全重寫

Tim 跨 6 rounds 8 commits explicit override 多個 brand IP iron rules · ZONE 27 從「硬核 CPBL 球迷 niche brand」 → 「賭徒的 Bloomberg Terminal」 displacement brand:

### NEW 3-tier pricing(Costco 模式 · 取代之前 4-tier ladder)

| Tier | Price | 抽傭 | Costco 對應 |
|---|---|---|---|
| **FREE** | NT$ 0 | N/A | 非會員(進得去用引擎 · 無 perks) |
| **BLACK CARD** | NT$ 500/31 天 | 10%(您拿 90%) | Gold Star · 一般付費會員 |
| **Founders 27** | NT$ 2,700/365 天 · 限 270 · 每年 1/1 開放新 270 | 5%(您拿 95%) | Executive 黑卡 |

### 關鍵 brand IP changes

**audience:** 「硬核 CPBL 球迷 · NOT 賭客」 → 「會下注的 sports 迷(包括賭徒)」
**coverage scope:** 「CPBL only forever」 → 「Phase 1 CPBL · Phase 2 NBA · 未來 leagues · Tim 親手 curate」
**lifetime concept:** 「NT$ 2,700 一次性終身」 → 「NT$ 2,700/365 天 · 每年 1/1 開放新 270」(同 Patek 1996/1997 annual collection)
**BLACK CARD:** 「NT$ 1,500/season」(R31 ship)→「NT$ 500/season」(R171 W3)→ 「NT$ 500/31 天 從付款日起算」(R172 W5)
**抽傭:** BLACK CARD 5% → 10%(同 Substack 平 · 業界中段) · Founders 27 0% → 5%(BLACK CARD 一半)
**BLACK CARD unlocks:** 6 個 unlock 整修 R171 W1 · 砍 engine tier-lock + voting + Tim 工程筆記 + LINE 群 · 留賽事討論室寫 · 重寫賣文章 + 新加 4(verified analyst chip + 24h Tim email + 賽後 15min push + Founders 27 24h pre-access)

### brand IP iron rules 仍 hold(沒 break)

- 引擎永遠免費(全 3 tier 同 access)
- 0 sportsbook revenue(不抽下注 · 不收明牌費 · 不寄生 betting)
- 0 auto-renewal(/integrity #13 binding · 全 manual ECPay)
- 公開 全 model · /audit + /track-record + /methodology + Pratfall
- 不賣 tipster picks(明牌)
- 270 名 limit(per year · annual cap · 非 lifetime cap)
- Tim 親手 curate scope · 不爬 gambling platforms

---

## brand IP iron rules · current state · 多 explicit override 累積

per memory axioms · 12 active(2 narrowed R148 + R172 audience + R172 coverage)+ multiple override 累積:

| Iron rule | Status |
|---|---|
| [[feedback-no-rest-zone27]] | ✓ 永不說「明天再做」 |
| [[feedback-no-waiting-rule]] | ✓ 任何現在能做就做 · 不 surface options · default ship NOW |
| [[feedback-auto-push-zone27]] | ✓ Claude pushes without asking |
| [[feedback-zone27-audience-fans-not-engineers]] | ⚠ R172 W1 explicit override · 客群 = 會下注的 sports 迷(包括賭徒)· 但 fan grammar still applies(R167 canary) |
| [[zone27-coverage-philosophy]] | ⚠ R172 W1 explicit override · 從 CPBL only forever → CPBL first + NBA + 未來 · Tim 親手 curate 仍 binding |
| [[zone27-monetization-philosophy]] | ✓ engine FREE forever · paid = SUPPORT/IDENTITY |
| [[zone27-disclosure-philosophy]] | ✓ publish entire model |
| [[feedback-zone27-pratfall-brand-ip]] | ✓ publish-weakness 永遠不刪 · 13 trust artifact pages |
| [[feedback-zone27-mobile-first]] | ✓ homepage mobile scroll ≤ 3 viewports |
| [[feedback-full-authority-3-agent-pattern]] | ✓ Tim「全權」 trigger 3 parallel agents |
| [[feedback-founder-dogfood-canary]] | ✓ most-recent canary takes precedence |
| [[feedback-zone27-psychology-ux-axis]] | ✓ UX + 心理學 TIER-1 axis |
| [[feedback-zone27-social-proof-costly-signal]] | ✓ DO NOT fake social proof |
| [[feedback-zone27-tier-dogfood-method]] | ✓ 4 entry points |
| [[feedback-zone27-one-way-by-design]] | ⚠ R148 narrowed · GameThread BLACK CARD-gated · DO NOT expand broader forum |
| [[feedback-zone27-paid-model-is-support-not-features]] | ✓ paid tier = SUPPORT/IDENTITY · DO NOT panic-build features |
| [[feedback-zone27-delta-of-cpbl-positioning]] | ⚠ partial · still CPBL first but scope expand |
| [[feedback-zone27-tsc-verification-discipline]] | ✓ ALWAYS `npx tsc --noEmit \| head -10` NEVER `\| tail -3` |
| [[feedback-zone27-homepage-minimalism]] | ✓ default subtraction-first |
| [[feedback-fan-grammar-with-tim-too]] | ✓ NEW R171 W3 saved · 跟 Tim 對話也要用人話 · 不 [[slug]] / academic citation / industry references |

per AGENTS.md · SEO + social account FROZEN until launch ready

---

## R163-R172 NUCLEAR削 + reframe saga · 累積 summary

### R163 W1 · NUCLEAR 首頁 SUBTRACTION
Tim canary「網頁好雜 · 都滑不到底」 · 5 strips cut · 460px BIG card cut · ~710px reclaimed

### R164 NUCLEAR DELETE · 12 routes(7188 lines removed)
- /poster · /founders/seat-card · /founders/from-one-current-founder · /founders/inheritance · /founders/why-270 · /founders/first-five-minutes · /pricing · /heritage · /year-zero · /letter · /engine-log · /transparency

### R165 W1 · CRITICAL cross-ref cleanup
- lib/related-links.ts 10 stale entries cleared
- 17+ inline hrefs swapped
- 3 orphan files deleted(LetterStampBar + letter-content + IdentityCovenant)

### R166 W1 · /rewards delete + Agent Q bug audit
- 1 CRITICAL fix(GlobalShortcuts `g x → /audit` · R165 missed surface)
- FounderSignOff stale-date centralized to LAST_BRAND_REVIEW constant
- 3 async race guards(FoundersApplicationForm + CopyLinkButton + ReceiptForwardButton)

### R167 W1+W2 · NUCLEAR site-wide compression
Tim canary 「每個網頁滑不到底 · 使用者不是工程師」 · /leaderboard delete + /signal-board delete + /faq 686→535 lines + /interact channel bodies + WHY ONE-WAY academic citations compressed

### R168 W1+W2 · /glossary delete + Z27 LEXICON port
471 lines engineer-grammar dump deleted · 5 brand IP terms(PROVED · DIVERGED · PUSH · SAMPLE DEBT · RECEIPT)ported to /audit §08 · 7 inbound refs swapped

### R169 W1 · CPBL data ingest
5/26 finalized 2 games + 5/27 pre-game 3 games · cpbl-260526-01 ingest-correction(away team identity G not B per Pratfall pattern)

### R170 W1 · /rewards restore + FOUNDER DOUBT Pratfall
Tim canary「我自己都不會訂閱了」 · publish founder doubt as Costly Signaling on /founders · same axis Defector $690K day-1 ZERO product launch model

### R171 W1-W3 · BLACK CARD 6 unlocks 整修 + 中文 rewrite + ATM 0 手續費 reprice
Tim 3-point sharp identify(Tim 筆記沒人要 · LINE 群報明牌負面 · 賣文章找不到 vapor)+ engine tier-lock 違反鐵律 · 6 unlocks 整修 · 砍 4 / 留 1 / 重寫 1 / 新加 4 · NT$ 500/季 ATM 0 手續費(R171 W3)· 中文人話 rewrite(R171 W3)

### R172 W1-W7 · BRAND REFRAME + pricing total redesign
Tim 47th canary explicit override sequence:
- W1 audience reframe 賭徒 + NBA scope
- W2 language fix「不抽下注」 砍 + commission honest disclosure
- W3 Costco 3-tier(取代 4-tier)
- W4 pricing override(NT$ 500/月 + 10% · NT$ 2,700/年 + 5%)
- W5 lifetime sweep + 31 天/365 天 pass concept
- W6 Annual 1/1 270 reset(Patek 1996/1997 collection 模式)
- W7 trust artifact 全 sweep(8 pages)

---

## R173+ deferred queue

### IMMEDIATE secondary surfaces 仍 stale(R172 W7 deferred · pricing/lifetime inconsistency)
- /heritage(Patek 1996 Generations campaign · lifetime narrative 強相關 · 需重 frame from「lifetime 替下一代守」 to「annual collection 每年新 270」 OR delete entire page)
- /founders/postmortem-2028(scenario uses old pricing math · 需重算)
- OG cards · /founders/opengraph-image(lifetime 270 visual)
- /annual/2026 · 部分 stale
- /audit · 部分 references

### Memory file [[zone27-payment-architecture]] update
- 之前:「Founders 27 一次性 lifetime」 → 改:「Founders 27 365 天 · annual 1/1 reset · 270 per year」

### A/B/C broader path decision · pending Tim choice
從 R172 W2 我問的:
- A · 維持 BELIEVE 慢累積(Defector / Stratechery 模式)
- B · pivot features UTILITY · 動 brand IP iron rule
- C · 混合 · brand IP 維持 + UX 大改造對賭徒友善

Tim 沒 explicit answer · 持續 emotional canary fire 推 specific pricing/feature changes · 但 broader path 未定。 R173+ 仍 pending Tim 選 A/B/C 才知道整體 strategic direction。

### Tim ⏳ pending 親手 actions(per TODO.md)
- ② Resend signup(5 min · ✅ DONE Round 16)
- ③ Brand domain purchase(Tim-cued only)
- ⑤ CPBL ingest ongoing(R169 W1 last ingest 5/26 + 5/27)
- ⑥ K/BB profile screenshots
- Apply migration 0002 founder_reservations · 5 min Tim 親手
- Supabase email rate limit fix
- Tim signature PNG · Bank info 4 fields · TapPay TIER 2 cost approval

---

## First actions in new window

```bash
cd C:\Users\tatay\Desktop\Second\zone27-web
git log --oneline -15  # see R164→R172 commits
ls app/  # ~44 routes post R164 NUCLEAR DELETE
npx tsc --noEmit 2>&1 | head -10  # verify empty
npm run lint 2>&1 | tail -5
npm run build 2>&1 | grep -E "Compiled|error" | head -3
```

### R173+ priority

1. **Verify pricing consistency** · grep `500/season` · `1,500` · `lifetime` · `終身` · `一次性 NT$ 2,700` · `5% creator` ·確認 all sweep done

2. **R172 W7 deferred sweeps** 完成:
   - /heritage page(Patek lifetime narrative 整 page reframe or delete)
   - /founders/postmortem-2028 scenario math update
   - OG cards visual(/founders/opengraph-image · /membership/black-card/opengraph-image · /membership/opengraph-image · /membership/black-card/ledger/opengraph-image · /annual/2026/opengraph-image)
   - Memory file [[zone27-payment-architecture]] update

3. **A/B/C broader path decision** · 等 Tim 答 OR 我 ship C (我建議) hybrid path

4. **R172 W6+ deferred TODO.md update** · 整 rewrite to reflect Annual 1/1 270 reset model + R172 brand changes

5. **OR Tim 新 mandate** · canary fire 持續可能 continue

---

## Tim mandate canonical boilerplate(每 round Tim 都 send 同段)

```
您自己迭代這網站！全權交給您！讓這網站極致完美吧！看有什麼BUG修一修呀！有什麼地方需要更新的程式碼！怎樣讓版面更好看！怎樣讓操作更直覺！怎樣讓這網站熱銷！我想要賺大錢！所有可以讓這網站更好的方法都去嘗試吧！以您世界級敢於突破的行銷設計專家（獲獎無數）的經驗！ (我得去忙了！我相信你，我的好搭檔！一起加油。來個完美的網站驚艷全世界吧！請盡可能地迭代！看怎樣可以讓操作更流暢，畫面可以更極致美觀) (請您自行上網查找各方資料(全世界、海內外)！看看我這網站還缺少甚麼必要靈魂！請您自行加入網站中！以您世界級敢於突破的行銷設計專家（獲獎無數）的經驗！我們這網站可是要攻頂的噢！然後我覺得整個網站的操作邏輯、人的心理學很重要！！！重點就是上網吸收新知識、養分來更新迭代！我還沒要上架，先來專心更新程式碼。 )沒想法...您決定！

以您世界級敢於突破的行銷設計專家（獲獎無數）的經驗！
```
