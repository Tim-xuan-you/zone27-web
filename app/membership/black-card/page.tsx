import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";
import { createPageMetadata } from "@/lib/page-og";

// R159 W1.L1 · Agent L CRITICAL · backfill createPageMetadata + truncate
// description from 348 chars(over Twitter 200-char cap · Slack 200-char
// readable weight)to ~140 chars · key info preserved · ECPay LIVE + 0
// auto-renewal + 6 unlocks。
export const metadata: Metadata = createPageMetadata({
  title: "BLACK CARD · CPBL Season Pass · NT$ 500/31 天",
  description:
    "ZONE 27 BLACK CARD CPBL Season Pass · NT$ 500 / 31 天 · ✓ LIVE 季票手動 ECPay · 10% 創作者抽成 · 14 天退款 · 6 unlocks · 0 auto-renewal forever per /integrity rule #13。",
  path: "/membership/black-card",
});

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
// R171 W1 · 6 unlocks 整修 · Tim 39th canary feedback:
//   - 砍 ① engine tier-lock(violates [[zone27-monetization-philosophy]] iron rule
//     「engine FREE forever」 · /integrity §02B W-01「引擎 output 對所有 tier 物理相同」)
//   - 砍 ④ engine voting(vapor · 沒 ship UI · 您「在哪?」 sharp 點出)
//   - 砍 ⑤ Tim 工程筆記(您「沒人要」 sharp identify · engineer-grammar 不是 fan-grammar)
//   - 砍 ⑥ LINE 群(您「報明牌負面 association」 sharp identify)
//   - 留 ② 賽事討論室寫(R148 narrowed scope · LIVE PRE-LAUNCH)
//   - 重寫 ③ publish 文章 · author public ledger + 14-day refund · NO performance-pay
//   - 新加 4 · verified analyst chip + 24h Tim email + 15min receipt push + Founders 27 pre-access
// 全 brand-pure 不破鐵律 · 0 vapor (LIVE / PRE-LAUNCH explicit status)
// R171 W2 · Tim 40th canary「全部看不懂 · 寫中文」 · 把英文 / 技術詞全換中文人話
// per [[feedback-fan-grammar-with-tim-too]] · per R167 canary「使用者不是工程師」
const UNLOCKS = [
  {
    icon: "💬",
    title: "每場比賽 · 您可以發一篇預測或觀察(限 200 字 · Tim 看完才上)",
    body: "BLACK CARD 訂閱者可在每場 CPBL 比賽頁發一篇 · 限 200 字 · Tim 親手看完才上線 · 不導向莊家 · 不抽下注佣金 · 不報明牌。 賽後 24 小時後關閉討論。 ⏳ 等付款系統上線後開放。",
  },
  {
    icon: "💵",
    title: "您寫整篇分析文章來賣 · 您拿 90% · Tim 抽 10%",
    body: "BLACK CARD 訂閱者可以寫整篇預測文章來賣 · 讀者買多少 · 您拿 90% · Tim 抽 10%(同 Substack 10% 平 · 業界中段 · OnlyFans 20% · YouTube 45% · ZONE 27 lower 50%)。 每位作者公開自己的歷史紀錄(預測準幾場 / 失準幾場 · 同 /track-record 公開方式)· 讀者買文章前可看作者真實準確度 · 不準的作者自然沒人買 · 純市場機制。 讀者買了 14 天內不喜歡可以退錢 · 您不賠 · Tim 從自己 10% 抽成裡墊。 跟玩運彩高手分潤完全不一樣 · 我們不獎勵「賭預測準度」 · 只獎勵「寫好文章」。 ⏳ 等寫文章功能上線後開放。",
  },
  {
    icon: "✓",
    title: "您 unlock「✓ 驗證準確度」 標章 · 預測 10 場以上 · 準 6 場以上自動",
    body: "BLACK CARD 訂閱者的預測紀錄累積 · 達到「預測 10 場以上 · 準 6 場以上(60%)」 · 自動 unlock「✓ 驗證準確度」 標章 · 公開顯示在您的 profile + 文章作者欄。 純誠實標章 · 不是排行榜 · 不是抽傭 · 不是「高手」 包裝。 ⏳ 等 profile 功能上線後開放。",
  },
  {
    icon: "⚡",
    title: "您寫信給 Tim · 24 小時內親手回(免費會員 7 天)",
    body: "BLACK CARD 訂閱者寫 email 給 tatayngiti@gmail.com · Tim 親手 24 小時內回覆(免費會員是 7 天內回 · 寫在 /ethics 第 5 條)· 不外包客服 · 不批次回覆 · 不模板 · Tim 親自輸入每一個字。 ✓ 現在已可用(24 小時 SLA 已啟用)。",
  },
  {
    icon: "📡",
    title: "比賽結束 15 分鐘內 · 您收到引擎結果通知(免費會員 24 小時)",
    body: "BLACK CARD 訂閱者比賽結束 15 分鐘內收到通知:這場引擎預測準了還是失準了 + 該場 PROVED / DIVERGED + 引擎勝率對比實際結果 snapshot。 免費會員 24 小時後才收到。 ⏳ 等通知系統上線後開放。",
  },
  {
    icon: "🎫",
    title: "每年 1/1 Founders 27 新 270 開放時 · 您享 24h pre-access",
    body: "Founders 27(NT$ 2,700/365 天 · 每年 1/1 開放新 270 名 · 同 Patek 1996/1997 annual collection)· BLACK CARD 訂閱者享每年 1/1 24h 優先購買 window · 早 24 小時 access。 ⏳ 等付款系統上線後開放。",
  },
];

const FAQS = [
  {
    q: "現在可以訂嗎?",
    a: "✓ 可以 · LIVE 31-day pass 手動 ECPay 個人方案 · email tatayngiti@gmail.com 我 24 小時內寄 ECPay 付款連結 · NT$ 500 從付款日起算 31 天。 NT$ 500 剛好在台灣跨行轉帳免手續費上限以下 · 您付款 0 額外成本。 0 auto-renewal · 每 31 天結束您主動再付才續 · per /integrity 第 13 條。",
  },
  {
    q: "為什麼是 31 天 · 不是 calendar 月?",
    a: "從您付款日起算 31 天 = 您付多少天就用多少天 · 不會因為 Feb 28 天/Mar 31 天 calendar 邊界吃虧。 同 SaaS pro-rata pattern · 透明 + fair。",
  },
  {
    q: "如何 renew 下一個 31 天?",
    a: "Manual ECPay · 不續就停 · 不需 cancel button · 第 28 天 email 提醒 · 您回 email「續訂」 我寄 ECPay link · 您付款後從新付款日起算 31 天。 14 天 cool-off only 首次訂閱 · 後續續訂沒 cool-off · 但 mid-period 可 email Tim 商量。",
  },
  {
    q: "14 天無條件退款?",
    a: "首次訂購 14 天內 100% 退款 · 不問理由(per 台灣消保法 § 19 distance-selling 雙倍 7-day cooling-off 主動延伸)。 後續續訂您每次主動 commit · 不適用 cooling-off。 換 email 重複 trial = 永久 ban per /ethics。",
  },
  {
    q: "信用卡資料安全?",
    a: "0 信用卡資訊在 ZONE 27 server。 透過 payment gateway(綠界 ECPay 個人方案 · 信用卡 / Apple Pay / ATM / 超商代碼 全 OK)token 處理。 我們 store user_metadata.season_pass_id 不存卡號 · 0 auto-renewal infrastructure ever per rule #13 binding。",
  },
  {
    q: "為什麼要付費?",
    a: "您完全可以不付 · FREE TIER 已涵蓋 engine + data + trust artifacts 100%(brand IP 鐵律「引擎永遠免費」)。 BLACK CARD 是想 support Tim build + 拿 6 個 unlock(賽事討論室寫 / 賣文章 您拿 90% / verified analyst chip / 24h Tim email priority / 賽後 15min receipt push / Founders 27 24h pre-access)的會員。 brand IP 不催 · 不 dark pattern · 不藏 cancel button · 0 auto-renewal · 每 31 天結束您主動 click 才付下個 31 天。 14-day refund 100% no-questions(per /terms §4B)。",
  },
];

// R109 W3 · Agent conversion audit finding · single-source mailto · 之前
// 同 page 230+377 兩處 hard-code 同 700-char encoded URL · 任何 future copy
// edit = 2-place change 高 mismatch risk · 違反 R76 W-A self-falsifiable
// count-drift discipline · 現在 const 從 1 source render · 改字 = 改 1 處。
const BLACK_CARD_MAILTO_HREF =
  "mailto:tatayngiti@gmail.com?subject=BLACK%20CARD%20CPBL%20Season%20Pass%20-%20NT%24%201%2C500%2Fseason&body=Tim%20%E5%A5%BD%2C%0A%0A%E6%88%91%E6%83%B3%E8%A8%82%E9%96%B1%20BLACK%20CARD%20CPBL%20Season%20Pass%20%E2%80%A2%20NT%24%201%2C500%20per%20CPBL%20season(March-November)%E3%80%82%0A%0A%E8%AB%8B%E5%AF%84%E6%88%91%20ECPay%20%E5%80%8B%E4%BA%BA%E6%96%B9%E6%A1%88%E4%BB%98%E6%AC%BE%E9%80%A3%E7%B5%90%E3%80%82%0A%0A%E5%B7%B2%E7%9F%A5%E6%82%89%200%20auto-renewal%20%E2%80%A2%20%E6%AF%8F%E5%AD%A3%20explicit%20click%20%2B%20manual%20transfer%20%E2%80%A2%2014%20%E5%A4%A9%E7%84%A1%E6%A2%9D%E4%BB%B6%E9%80%80%E6%AC%BE%E3%80%82%0A%0A%E8%AC%9D%E8%AC%9D%E3%80%82";

export default function BlackCardPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* R161 W1.O · Agent O · canonical breadcrumb · HOME / MEMBERSHIP /
            BLACK CARD · 之前 /membership/black-card 2-level deep 無 breadcrumb
            upward path · 訪客 Footer / Cmd-K landing 無 parent /membership
            visible trail · per /founders/apply R68 canonical pattern。 */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link href="/membership" className="hover:text-gold transition-colors">
              MEMBERSHIP
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">BLACK CARD</span>
          </div>
        </section>

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
              title="LIVE NOW · CPBL Season Pass 季票模式 · NT$ 500/31 天 · explicit manual · 0 auto-renewal per /integrity rule #13"
            >
              ✓ LIVE · CPBL Season Pass
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            BLACK CARD ·{" "}
            <span className="text-gold">NT$ 500 / 31 天</span>
          </h1>
          <p className="mt-3 font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.25em] leading-relaxed max-w-2xl">
            從付款日起算 31 天 · 一般付費會員(Costco Gold Star 模式)·
            ATM 跨行轉帳 NT$ 500 以下免手續費 · 0 auto-renewal · 每 31 天結束
            您主動 click 才付下一個 31 天
          </p>

          {/* R111 W3 · inverse-paywall single-line · per agent locked-preview
              research「unique opportunity from engine FREE forever」 ·
              Spence 1973 costly signaling pure form · 中和「why am I paying
              then?」 objection · 每競爭者 lock 產品(Substack lock post ·
              Netflix lock 解析度 · Patreon lock content)· ZONE 27 只 lock
              身份 不 lock 引擎 · 不能 copy 因為他們 burn core revenue。 */}
          <p className="mt-4 max-w-2xl border-l-2 border-gold/60 pl-4 text-bone text-sm sm:text-base leading-relaxed font-light">
            引擎永久免費 · 您付的是
            <strong className="text-gold">身份</strong>。 全壘打率、打席率、
            建議下注尺寸 — 全部 0 paywall · 0 rate limit · 永久 free。
            BLACK CARD 不是付給「資料」 · 是付給「會員 community + voting + Tim 工程筆記」。
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
                  NT$ 2/場
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
            CPBL 季票 · <strong className="text-bone">NT$ 500 / 31 天</strong> ·
            0 auto-renewal · 14 天無條件退款 · 10% 創作者抽成。
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
              href={BLACK_CARD_MAILTO_HREF}
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
              /integrity · /ethics · /audit →
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
            / 訂閱 BLACK CARD · email Tim 啟動季票
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
              CPBL Season Pass(March-November)NT$ 500/31 天 起算。
            </p>
            <div className="border border-gold/30 bg-navy/30 p-4 sm:p-5 mb-4">
              <p
                lang="en"
                className="font-mono text-gold/90 text-[10px] tracking-[0.3em] mb-2"
              >
                EMAIL · ZONE 27 創辦人 Tim
              </p>
              <a
                href={BLACK_CARD_MAILTO_HREF}
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
            BLACK CARD 在 ZONE 27 3-tier 會員 ladder 中位處第 2 階 ·
            上有 Founders 27(限量 270 · NT$ 2,700/365 天 · 抽傭 5%)·
            下有 FREE TIER(永久免費)。 完整對照在 /membership。
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
            BLACK CARD 是 ZONE 27 主要 season-based revenue model · NT$ 500
            per CPBL season(March-November · 240 場 + 季後賽)· 支援 engine
            iteration + 給訂閱者投 voting 影響下個 ship · 拿 Tim 每週工程
            筆記 full 版。 10% 創作者抽成 vs 業界 30-50% 是降維打擊 · per
            /membership #pick-vs-bet brand boundary 明確「球迷 share 預測」
            · NOT 博彩。
          </p>
          <p>
            R81 pivot · 自 NT$ 299/月 auto → NT$ 500/31 天 explicit · per
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
