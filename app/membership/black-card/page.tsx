import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";

export const metadata: Metadata = {
  title: "BLACK CARD · CPBL Season Pass · NT$ 1,500/season explicit",
  description:
    "ZONE 27 BLACK CARD CPBL Season Pass · NT$ 1,500 per CPBL season(March-November · 240 場 + 季後賽 = NT$ 6/場)· ✓ LIVE 季票手動 ECPay 個人方案 · email Tim 啟動 · 5% 創作者抽成 · 14 天無條件退款 · 6 unlocks · R81 pivot 自 NT$ 299/月 auto · 0 subscription auto-renewal forever per /integrity rule #13 · 同 統一獅 47-game season package + NBA 88% season ticket renewal + Defector 85% explicit-renewal + Pinboard $25 一次性 pattern · 玩運彩+報馬仔 結構性無法 ship 同 page。",
};

// ── ZONE 27 · /membership/black-card ───────────────────
// Round 31 W-X3 · Tim 「能 fluently 看 BLACK CARD 長相」 enabler 之前
// 不存在 BLACK CARD dedicated UI preview · 只在 /membership 4-tier
// ladder 中 1 張 card 帶過。
//
// Round 42 W-C · LIVE state transition · per [[feedback-no-waiting-rule]]:
//   - mailto:tatayngiti@gmail.com 月卡手動 ECPay 真實 flow LIVE
//   - "PRE-LAUNCH · UI MOCKUP" framing 全 strip(per Agent J R43 dogfood
//     verify · narrative 殘留 must sweep · brand IP「不可 LIVE badge ↔
//     mockup narrative 共存」)
//
// brand IP fits:
//   - 倒置 SaaS · manual ECPay payment vs auto-charge 標準 SaaS
//   - 「方法公開」 延伸:訂閱 flow 公開 · email Tim 不藏 · 跟 /audit pattern 一致
//   - 0 cookie / 0 PII / mailto: native browser · 0 tracking
//
// Wires:
//   - /membership BLACK CARD card 「Q3 通知我 · 先免費註冊」 CTA(已 W-M)
//     可加 「→ 看 BLACK CARD UI preview」 link
//   - /founders 跳到 此 page 做 4-tier cross-comparison
//   - Cmd-K palette 加 entry
// ─────────────────────────────────────────────────────

export const revalidate = 86400;

// R76 W-A · Agent A R75 SHIP 7 deferred · OutputArtifactSwitcher · FanGraphs
// output-not-input pattern · re-write 6 unlocks from noun-list titles to
// verb-first action sentences · Linear what's new pattern + Stripe Atlas
// 6-deliverable analog。 Visitor reads 您可以做什麼 not 您拿到什麼 abstract。
// Same count-fix sweep:array 一直是 6 entries · header + OG card 之前寫
// 「5 unlocks」 self-falsifiable count drift · per Agent B audit pattern ·
// 此 ship 同時 fix count drift to「6 unlocks」 across header + OG card +
// /pricing/why §02。 Per Tim「客戶 = audience」 + brand IP「方法公開」 延伸到
// output-not-input grammar(視覺從 abstract noun-list 升 verb-first action)。
const UNLOCKS = [
  {
    icon: "🤖",
    title: "您可以跑 v0.3 + v0.4 engine variants",
    body: "BLACK CARD 解鎖 v0.3「Pitcher + Park Factor + 隊伍平均 wOBA」(LIVE DEV PREVIEW · production ship 待 N≥30 sample)+ v0.4「Bayesian Model Averaging ensemble」(PLANNED · v0.3 production ship 後)· FREE TIER 仍 access v0.2 Pitcher-Only Monte Carlo。 每個 engine publish methodology + DIVERGED + ESTIMATION DISCLOSURE per-engine · brand-pure 不靠 secret moat。 完整 lineup table 見 /methodology Section 04。",
  },
  {
    icon: "💬",
    title: "您可以在 /matches/[gameId] 賽事頁發言 + 分享預測",
    body: "BLACK CARD 之上會員可在 /matches/[gameId] 頁面發言 / 推薦 / 分享預測。 球迷 grammar 「明牌」 native 詞 · 不導向莊家 · 不抽下注佣金(per /membership #pick-vs-bet)。",
  },
  {
    icon: "💵",
    title: "您 publish 內容 ZONE 27 只抽 5%",
    body: "BLACK CARD 訂閱者自己 publish 內容 · ZONE 27 抽 5%(vs Taiwan LINE 老師 / 投顧老師生態 30-50% 業界共識是降維打擊)。 Founders 27 永遠 0% 創作者抽成。",
  },
  {
    icon: "🗳️",
    title: "您每月 vote · 您的票決定下個 ship",
    body: "Tim 每月 publish 「下個月想 ship 什麼」 3 個 options · BLACK CARD 訂閱者 vote · 結果公開。 IKEA Effect(您 voting → 您的引擎)+ brand IP「方法公開」延伸到 product roadmap。",
  },
  {
    icon: "📓",
    title: "您每週讀 Tim 工程筆記 full 版",
    body: "Tim 每週寫 1 篇「本週寫什麼 / 為什麼這樣寫 / 下週要 ship 什麼」 · 公開版 truncated 在 /now · BLACK CARD 拿 full 版 · Stratechery 模式。 目前所有 take 是 Tim 親手寫 · 不是模板 · 不是 AI rephrase · /now journal 記錄每次寫作時長 commit metadata。",
  },
  {
    icon: "🔓",
    title: "您 read-only 進 Founders 27 LINE 群",
    body: "Founders 27 創始會員 LINE 群 read-only access · BLACK CARD 可看 7 forged founders 互動 + Tim 親自答 · 真實 founders Q3 onboard 後 active。 不可發言 · 不可邀人 · 不可截圖外流(per /audit S05 PRE-COMMIT)。",
  },
];

const FAQS = [
  {
    q: "現在可以訂 CPBL Season Pass 嗎?",
    a: "✓ 可以 · LIVE 季票手動 ECPay 個人方案 · email tatayngiti@gmail.com 我 24 小時內寄 ECPay 付款連結 · NT$ 1,500 per CPBL season(March-November · 240 場 + 季後賽 ≈ NT$ 6/場)。 0 auto-renewal · 每季 explicit click + manual transfer · per /integrity rule #13(R81 加 · 永遠不 subscription auto-renewal binding · ECPay/TapPay/Stripe 自動扣款全 refused forever)。",
  },
  {
    q: "為什麼是 season pass 不是月訂閱?(R81 pivot)",
    a: "綠界沒定期定額 = brand opportunity NOT 限制。 Recurly 2025 data 年訂閱 churn 比月訂閱低 51% · NBA Warriors season ticket renewal 99.5% · ChartMogul 4.78M-customer data NRR 年訂閱比月訂閱高 10-20pp · Defector Year-5 公開 85% explicit-renewal · Pinboard 17-year solo $25 一次性。 我們 R81 pivot 自 NT$ 299/月 auto(R31 W-X3 ship · R81 retired)· 同 indie premium niche + 統一獅 47-game season package CPBL fan-grammar 軸線對齊。 per /integrity rule #13 binding 永久 lock 此 decision · 0 auto-renewal infrastructure ever(取代之前「Q4 2026+ TapPay auto-charge plan」 false promise · per /audit S05 PRE-COMMIT 30-day /changelog notice protocol)。",
  },
  {
    q: "如何 renew 下一季?",
    a: "Manual ECPay 季票 · 不續訂下季就停 · 不需 cancel button · 季末(11 月 CPBL season 結束時)email 提醒 · 您回 email「下季 renew」即可付下季款。 14 天 cool-off · 跨季沒付不退已過季款。 同 統一獅 季票 refund only ≥7 天 pre-opener with 10% fee 軸線。",
  },
  {
    q: "14 天無條件退款?",
    a: "首次訂購 14 天內 100% 退款 · 不問理由(per 台灣消保法 § 19 distance-selling 雙倍 7-day cooling-off 主動延伸)。 第二季 onwards 您每季主動 commit · 不適用 cooling-off · 但可以 mid-season email Tim 商量。",
  },
  {
    q: "信用卡資料安全?",
    a: "0 信用卡資訊在 ZONE 27 server。 透過 payment gateway(綠界 ECPay 個人方案 · 信用卡 / Apple Pay / ATM / 超商代碼 全 OK)token 處理。 我們 store user_metadata.season_pass_id 不存卡號 · 0 auto-renewal infrastructure ever per rule #13 binding。",
  },
  {
    q: "為什麼要付費?",
    a: "您完全可以不付 · FREE TIER 5 unlocks 已涵蓋 80% 核心功能。 BLACK CARD Season Pass 是想 support engine iteration + 加入 voting 流程 + 拿 Tim 工程筆記 full 版的會員。 brand IP 不催 · 不 dark pattern · 不藏 cancel button · 0 auto-renewal · 每季 explicit 您主動 click 才付下季。",
  },
];

export default function BlackCardPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / BLACK CARD · 訂閱會員
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold shimmer"
              title="LIVE NOW · CPBL Season Pass 季票模式 · NT$ 1,500/season · explicit manual · 0 auto-renewal per /integrity rule #13"
            >
              ✓ LIVE · CPBL Season Pass
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            BLACK CARD ·{" "}
            <span className="text-gold">≈ NT$ 6 / 場</span>
          </h1>
          <p className="mt-3 font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.25em] leading-relaxed max-w-2xl">
            CPBL 季票 NT$ 1,500/season · March-November(240 場 + 季後賽)·
            一顆 7-11 御飯糰的價格 · 看一場 CPBL · 0 auto-renewal · 每季
            explicit click + manual transfer
          </p>
          {/* MARKET ANCHOR · 4-cell honest comparison · per-game framing。 */}
          <div className="mt-4 sm:mt-5 max-w-2xl">
            <p
              lang="en"
              className="font-mono text-mute/55 text-[9px] tracking-[0.3em] mb-2"
            >
              ↘ 1 場 CPBL 看球的價格 · 4-cell ANCHOR
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="border border-line/40 bg-slate/20 p-2 sm:p-3 text-center">
                <p
                  lang="en"
                  className="font-mono text-mute/70 text-[9px] tracking-[0.22em] mb-1"
                >
                  DEFECTOR
                </p>
                <p className="font-mono text-mute text-[11px] sm:text-xs tabular tracking-tight">
                  NT$ ~200/月
                </p>
              </div>
              <div className="border border-line/40 bg-slate/20 p-2 sm:p-3 text-center">
                <p
                  lang="en"
                  className="font-mono text-mute/70 text-[9px] tracking-[0.22em] mb-1"
                >
                  NETFLIX PREMIUM
                </p>
                <p className="font-mono text-mute text-[11px] sm:text-xs tabular tracking-tight">
                  NT$ 390/月
                </p>
              </div>
              <div className="border border-gold/60 bg-gold/5 p-2 sm:p-3 text-center glow-soft">
                <p
                  lang="en"
                  className="font-mono text-gold text-[9px] tracking-[0.22em] mb-1"
                >
                  BLACK CARD
                </p>
                <p className="font-mono text-gold text-[12px] sm:text-sm tabular tracking-tight">
                  NT$ 6/場
                </p>
                <p className="font-mono text-mute/60 text-[8px] tracking-[0.15em] mt-0.5">
                  240 場 + 季後賽
                </p>
              </div>
            </div>
            <p className="mt-2 font-mono text-mute/60 text-[9px] sm:text-[10px] tracking-[0.2em] leading-relaxed">
              中段 sweet spot · 不 luxury · 不 commodity · 同 indie sports
              subscription band 物理對齊 · CPBL season-aligned 同 統一獅 47-game
              package + NBA 88% season ticket renewal pattern
            </p>
          </div>
          {/* Round 55 W-B · Agent C #4 fix · trust-signal line ABOVE price
              block · Plausible pricing-page pattern · 不是 fake testimonial
              · 是 factual brand metric · 訪客 buy moment 直接看到 brand
              IP 物理 codify · 不需 scroll 到 /audit 才知。 */}
          <p
            lang="en"
            className="mt-5 font-mono text-mute/85 text-[10px] sm:text-[11px] tracking-[0.3em] leading-relaxed max-w-2xl"
          >
            <span className="text-gold/85">v0.2</span> ENGINE
            <span className="mx-2 text-mute/40">·</span>
            <span className="text-gold/85">100%</span> OPEN AUDIT
            <span className="mx-2 text-mute/40">·</span>
            <Link
              href="/audit"
              className="text-mute hover:text-gold transition-colors underline-offset-4 hover:underline"
            >
              /audit S05 公開全模型
            </Link>
            <span className="mx-2 text-mute/40">·</span>
            <span className="text-gold/85">14-DAY</span> 退款保證
          </p>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            CPBL 季票 · <strong className="text-bone">NT$ 1,500 / season</strong> ·
            0 auto-renewal · 14 天無條件退款 · 5% 創作者抽成。
          </p>
          <p className="mt-4 font-mono text-gold/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
            ✓ LIVE NOW · 個人方案綠界(ECPay)收款 · 信用卡 + Apple Pay + ATM +
            超商代碼 全 OK · email Tim 啟動您 BLACK CARD CPBL Season Pass
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={4} />
          </div>
          <div className="mt-3">
            <EngineStamp />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:tatayngiti@gmail.com?subject=BLACK%20CARD%20CPBL%20Season%20Pass%20-%20NT%24%201%2C500%2Fseason&body=Tim%20%E5%A5%BD%2C%0A%0A%E6%88%91%E6%83%B3%E8%A8%82%E9%96%B1%20BLACK%20CARD%20CPBL%20Season%20Pass%20%E2%80%A2%20NT%24%201%2C500%20per%20CPBL%20season(March-November)%E3%80%82%0A%0A%E8%AB%8B%E5%AF%84%E6%88%91%20ECPay%20%E5%80%8B%E4%BA%BA%E6%96%B9%E6%A1%88%E4%BB%98%E6%AC%BE%E9%80%A3%E7%B5%90%E3%80%82%0A%0A%E5%B7%B2%E7%9F%A5%E6%82%89%200%20auto-renewal%20%E2%80%A2%20%E6%AF%8F%E5%AD%A3%20explicit%20click%20%2B%20manual%20transfer%20%E2%80%A2%2014%20%E5%A4%A9%E7%84%A1%E6%A2%9D%E4%BB%B6%E9%80%80%E6%AC%BE%E3%80%82%0A%0A%E8%AC%9D%E8%AC%9D%E3%80%82"
              className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              ✓ EMAIL TIM · 啟動 BLACK CARD CPBL Season Pass
            </a>
            <Link
              href="/membership"
              className="inline-block px-5 py-2.5 border border-gold/40 text-gold hover:bg-gold/5 font-mono text-xs tracking-[0.3em] transition-colors"
            >
              ← 看 4-tier 全 ladder
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-12">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* ── R39 W-H · Public Ledger cross-link · Agent D DEEPEST sibling ─
            /membership/black-card/ledger 公開 0 paid subscriber 真實狀態 ·
            inverse-FOMO 「您會是第 1 位」 brand IP 物理 visible at main
            BLACK CARD page · structurally non-copyable by tipsters。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <Link
            href="/membership/black-card/ledger"
            className="block border border-gold/40 bg-slate/40 p-5 sm:p-6 hover:bg-slate/50 hover:border-gold/60 transition-colors group"
          >
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
              <p
                lang="en"
                className="font-mono text-gold/90 text-[10px] tracking-[0.35em]"
              >
                ↗ PUBLIC LEDGER · 訂閱者帳本
              </p>
              <span
                lang="en"
                className="font-mono text-gold text-[9px] tracking-[0.3em] shimmer"
              >
                N=0 · WAITING · 您會是第 1 位
              </span>
            </div>
            <p className="text-bone text-base leading-relaxed group-hover:text-gold transition-colors">
              目前 <span className="text-gold">0</span> 位 BLACK CARD 訂閱者 ·
              第 1 位的 handle 永久顯示在 ledger row 1 · 同 Founders 27 allocation
              pattern · structurally non-copyable by 玩運彩+報馬仔(regulatory +
              privacy + churn 暴露)。
            </p>
            <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.25em] group-hover:text-mute transition-colors">
              5 PRE-COMMIT rules · 修改需 30 天 /changelog 公告 →
            </p>
          </Link>
        </section>

        {/* ── R76 W-A · 6 UNLOCKS · Agent A R75 SHIP 7 OutputArtifactSwitcher
            · FanGraphs output-not-input pattern · 您可以做什麼 not 您拿到什麼
            abstract · count drift fix(之前 header「5 UNLOCKS」 但 array 有 6
            entries since R35 W-E · self-falsifiable per Agent B audit pattern
            · 此 ship 同時 sweep header + OG card + /pricing/why §02 to 6)。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 6 UNLOCKS · 您可以做什麼
          </p>
          <div className="space-y-6">
            {UNLOCKS.map((u) => (
              <article
                key={u.title}
                className="bg-slate/40 border border-line/60 p-5 sm:p-6"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    aria-hidden="true"
                    className="text-2xl text-gold/90 leading-none"
                  >
                    {u.icon}
                  </span>
                  <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight">
                    {u.title}
                  </h3>
                </div>
                <p className="text-mute text-sm leading-relaxed">{u.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* R82 simplification · 3 brand-IP sections compressed to 1 small
            cross-link card · per Tim 「太多多餘 · 沒人想知道」 founder-
            dogfood-canary fire · FREE FOREVER + NEGATION IS PRODUCT +
            8 commitments sections 全 cut · 本 page 從 633 行 → ~350 行 ·
            brand IP commitments 仍 visible in /audit + /integrity +
            /ethics canonical pages · 但 sales page 不再 hijack。 per
            pratfall-brand-ip · 不 delete brand IP · 只 move 到 secondary
            page · sales-page-as-Apple-product-page pattern。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <Link
            href="/integrity"
            className="block border border-gold/40 bg-slate/40 p-5 hover:bg-slate/50 hover:border-gold/60 transition-colors group"
          >
            <p className="text-bone text-base leading-relaxed group-hover:text-gold transition-colors">
              訂閱前 · 您應該知道 ZONE 27 <span className="text-gold">永遠不會變的 22 件事</span>
              (13 redlines + 9 commitments)· per /integrity Berkshire 1996
              Owner&rsquo;s Manual pattern · 公開 binding bond。
            </p>
            <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.3em] group-hover:text-mute transition-colors">
              /integrity · /ethics · /audit · /transparency →
            </p>
          </Link>
        </section>

        {/* ── R42 W-C · F4.1 CRITICAL FIX · Agent I dogfood canary
            LIVE 月卡手動 badge contradicted with PAYMENT FLOW MOCKUP
            disabled form. Resolved per Pratfall axiom · 不可 「badge over-
            claim · form admits otherwise」 同時 ship · 同一 page mismatched
            signal = brand IP violation。 Ripped out disabled mockup form ·
            replaced with honest EMAIL TIM flow that matches LIVE badge.
            Visitor 看到 LIVE badge 就應該 看到 actionable LIVE path 不是
            disabled form (Pratfall + Costly Signaling discipline). */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 訂閱 BLACK CARD · email Tim 啟動月卡
          </p>
          <div className="bg-slate/40 border border-gold/40 p-6 sm:p-8 glow-soft">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.35em] mb-4 text-center"
            >
              ✓ LIVE NOW · CPBL Season Pass · 季票手動 · 個人方案 ECPay
            </p>
            <p className="text-bone text-lg sm:text-xl leading-relaxed mb-4 text-center">
              寄 email 給 Tim · 24 小時內收到您的{" "}
              <span className="text-gold">ECPay 個人方案付款連結</span> ·
              CPBL Season Pass(March-November)NT$ 1,500/season 起算。
            </p>
            <div className="border border-gold/30 bg-navy/30 p-4 sm:p-5 mb-4">
              <p
                lang="en"
                className="font-mono text-gold/90 text-[10px] tracking-[0.3em] mb-2"
              >
                EMAIL · ZONE 27 創辦人 Tim
              </p>
              <a
                href="mailto:tatayngiti@gmail.com?subject=BLACK%20CARD%20CPBL%20Season%20Pass%20-%20NT%24%201%2C500%2Fseason&body=Tim%20%E5%A5%BD%2C%0A%0A%E6%88%91%E6%83%B3%E8%A8%82%E9%96%B1%20BLACK%20CARD%20CPBL%20Season%20Pass%20%E2%80%A2%20NT%24%201%2C500%20per%20CPBL%20season(March-November)%E3%80%82%0A%0A%E8%AB%8B%E5%AF%84%E6%88%91%20ECPay%20%E5%80%8B%E4%BA%BA%E6%96%B9%E6%A1%88%E4%BB%98%E6%AC%BE%E9%80%A3%E7%B5%90%E3%80%82%0A%0A%E5%B7%B2%E7%9F%A5%E6%82%89%200%20auto-renewal%20%E2%80%A2%20%E6%AF%8F%E5%AD%A3%20explicit%20click%20%2B%20manual%20transfer%20%E2%80%A2%2014%20%E5%A4%A9%E7%84%A1%E6%A2%9D%E4%BB%B6%E9%80%80%E6%AC%BE%E3%80%82%0A%0A%E8%AC%9D%E8%AC%9D%E3%80%82"
                className="block text-center text-bone hover:text-gold text-base sm:text-lg tabular tracking-wide transition-colors underline-offset-4 hover:underline break-all"
              >
                tatayngiti@gmail.com
              </a>
              <p className="mt-3 font-mono text-mute/70 text-[9px] tracking-[0.25em] text-center">
                點上面連結會開啟您的 email app · subject + body 預填好
              </p>
            </div>
            <ul className="space-y-2 text-mute text-sm leading-relaxed">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>ECPay 個人方案 · 信用卡 / 銀行轉帳 / 超商繳費</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>0 auto-renewal · 季末 email 提醒下季 renew · 您回 OK 才付</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>首次 14 天無條件退款 · 您上 <Link href="/membership/black-card/ledger" className="text-gold hover:underline underline-offset-4">public ledger</Link> row 1</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / FAQ · 6 個常問
          </p>
          <div className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.q} className="border-l-2 border-gold/30 pl-5 sm:pl-6">
                <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
                  Q · {f.q}
                </p>
                <p className="text-mute text-sm leading-relaxed">A · {f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CROSS LINK · 4-TIER LADDER ────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12 text-center">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4"
          >
            / 4-TIER LADDER
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6 max-w-xl mx-auto">
            BLACK CARD 在 ZONE 27 4-tier 會員 ladder 中位處第 3 階 ·
            上有 Founders 27(限量 270 終身)· 下有 FREE TIER(永久免費)。
            完整對照在 /membership。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/membership"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /membership 4-tier ladder
            </Link>
            <Link
              href="/founders"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              Founders 27 詳情 →
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            BLACK CARD 是 ZONE 27 主要 season-based revenue model · NT$ 1,500
            per CPBL season(March-November · 240 場 + 季後賽)· 支援 engine
            iteration + 給訂閱者投 voting 影響下個 ship · 拿 Tim 每週工程
            筆記 full 版。 5% 創作者抽成 vs 業界 30-50% 是降維打擊 · per
            /membership #pick-vs-bet brand boundary 明確「球迷 share 預測」
            · NOT 博彩。
          </p>
          <p>
            R81 pivot · 自 NT$ 299/月 auto → NT$ 1,500/season explicit · per
            /integrity rule #13(R81 加 · 永遠不 subscription auto-renewal
            binding)· 綠界沒定期定額 = brand opportunity NOT 限制。 NBA
            Warriors 99.5% / 統一獅 47-game / Defector 85% explicit-renewal
            / Pinboard 一次性 4 indie premium niche references validate this
            pivot · Recurly 2025 data 年訂閱 churn 比月訂閱低 51%。
          </p>
          <p>
            這頁 ✓ LIVE 季票手動 ECPay 個人方案 · email tatayngiti@gmail.com
            我 24 小時內寄 ECPay 付款連結 · 0 auto-renewal infrastructure ever
            per rule #13 binding · manual 是 brand IP discipline 不是 missing
            feature。 不催 · 不 dark pattern · 不藏 cancel button(season-
            based manual 本身就不需要 cancel button · 不續訂下季就停 · 0 reminder
            spam)。 brand IP「不靠秘密賺錢 · 靠紀律」 延伸到訂閱模式 · scope
            + discipline + renewal 三軸 close brand IP loop。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/membership/black-card" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/membership"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回 4-tier ladder /membership
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
