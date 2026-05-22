import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";

export const metadata: Metadata = {
  title: "BLACK CARD · LIVE 月卡手動 · ZONE 27",
  description:
    "ZONE 27 BLACK CARD 訂閱會員 · ✓ LIVE 月卡手動 ECPay 個人方案 · NT$ 299/月 · email Tim 啟動 · 5% 創作者抽成 · 14 天無條件退款 · 6 unlocks · 玩運彩+報馬仔 結構性無法 ship 同 page。",
};

// ── ZONE 27 · /membership/black-card ───────────────────
// Round 31 W-X3 · Tim 「能 fluently 看 BLACK CARD 長相」 enabler 之前
// 不存在 BLACK CARD dedicated UI preview · 只在 /membership 4-tier
// ladder 中 1 張 card 帶過。
//
// Round 42 W-C · LIVE state transition · per [[feedback-no-waiting-rule]]:
//   - mailto:tim@zone27.tw 月卡手動 ECPay 真實 flow LIVE
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

const UNLOCKS = [
  // Round 35 W-E · 加 Engine Lineup unlock 為 #1 · brand-pure 3-engine
  // progression 是 BLACK CARD 真正 commercial unlock(per Round 35 W-D
  // /methodology Section 04)· 「Most prediction sites have 1 secret engine ·
  // we have 3 open ones」 displacement mission 物理閉環。
  {
    icon: "🤖",
    title: "Engine Lineup 3 變體 解鎖",
    body: "BLACK CARD 解鎖 v0.3「Pitcher + Park Factor + 隊伍平均 wOBA」(Q3 2026)+ v0.4「Bayesian Model Averaging ensemble」(Q4 2026)· FREE TIER 仍 access v0.2 Pitcher-Only Monte Carlo。 每個 engine publish methodology + DIVERGED + ESTIMATION DISCLOSURE per-engine · brand-pure 不靠 secret moat。 完整 lineup table 見 /methodology Section 04。",
  },
  {
    icon: "💬",
    title: "賽事討論室發言 / 分享預測",
    body: "BLACK CARD 之上會員可在 /matches/[gameId] 頁面發言 / 推薦 / 分享預測。 球迷 grammar 「明牌」 native 詞 · 不導向莊家 · 不抽下注佣金(per /membership #pick-vs-bet)。",
  },
  {
    icon: "💵",
    title: "創作者抽成 5%",
    body: "BLACK CARD 訂閱者自己 publish 內容 · ZONE 27 抽 5%(vs Taiwan LINE 老師 / 投顧老師生態 30-50% 業界共識是降維打擊)。 Founders 27 永遠 0% 創作者抽成。",
  },
  {
    icon: "🗳️",
    title: "每月 voting 影響引擎迭代方向",
    body: "Tim 每月 publish 「下個月想 ship 什麼」 3 個 options · BLACK CARD 訂閱者 vote · 結果公開。 IKEA Effect(您 voting → 您的引擎)+ brand IP「方法公開」延伸到 product roadmap。",
  },
  {
    icon: "📓",
    title: "每週 Tim 工程筆記 full 版",
    body: "Tim 每週寫 1 篇「本週寫什麼 / 為什麼這樣寫 / 下週要 ship 什麼」 · 公開版 truncated 在 /now · BLACK CARD 拿 full 版 · Stratechery 模式。",
  },
  {
    icon: "🔓",
    title: "Founders 27 LINE 群 access",
    body: "Founders 27 創始會員 LINE 群 access(read-only) · BLACK CARD 可看 7 forged founders 互動 + Tim 親自答 · 真實 founders Q3 onboard 後 active。",
  },
];

const FAQS = [
  {
    q: "現在可以訂閱嗎?",
    a: "✓ 可以 · LIVE 月卡手動 ECPay 個人方案 · email tim@zone27.tw 我 24 小時內寄 ECPay 付款連結 · 首月起算。 自動扣款 infrastructure 留 Q4 2026+(per 倒置 SaaS · manual 是 brand IP scarcity)。",
  },
  {
    q: "如何取消訂閱?",
    a: "Manual ECPay 月卡 · 不續訂下月就停 · 不需 cancel button · email 提醒 在每月扣款前 3 天送出 · 您回 email「不續訂」即可。 已扣本月不退(per 一般 SaaS · 14 天無條件退款首次訂閱例外)。",
  },
  {
    q: "14 天無條件退款?",
    a: "首次訂閱 14 天內 100% 退款 · 不問理由。 此後每月新扣款不適用(因為您每月選擇繼續或取消)。",
  },
  {
    q: "信用卡資料安全?",
    a: "0 信用卡資訊在 ZONE 27 server。 透過 payment gateway(綠界 / 藍新 / TapPay 之一 · Q3 上線前 Tim 拍板選哪個)token 處理。 我們 store user_metadata.subscription_id 不存卡號。",
  },
  {
    q: "為什麼要付費?",
    a: "您完全可以不付 · FREE TIER 5 unlocks 已涵蓋 80% 核心功能。 BLACK CARD 是想 support engine iteration + 加入 voting 流程 + 拿 Tim 工程筆記 full 版的會員。 brand IP 不催 · 不 dark pattern · 不藏 cancel button。",
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
              title="LIVE NOW · 月卡手動續訂模式 · 個人方案 NT$ 299/月 · 倒置 SaaS axiom · 不自動扣款"
            >
              ✓ LIVE · 月卡手動
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            BLACK CARD ·{" "}
            <span className="text-gold">NT$ 299 / 月</span>
          </h1>
          {/* R59 W-B · Agent C Ship #3 · price anchor strip · 4-cell honest
              comparison · NT$ 200-450/月 benchmark band 從 CLAUDE.md
              「商業模式定錨」 memory 升 visitor 眼前 · Loss Aversion(Kahneman
              1979)+ Contrast Principle(Cialdini)· 之前 NT$ 299 floats
              with no contrast · 訪客 default 認為 expensive。 4 cells:
              Defector(獨立 sports media · Agent A Year-5 annual report cited)
              · Netflix Premium(universal media anchor)· 健身房月卡(visceral
              台北/台中市場 anchor)· BLACK CARD(highlighted gold)。 brand
              IP per [[zone27-audience-fans-not-engineers]] · 「方法公開 ·
              品味私藏」 不依賴 hidden price discrimination · 公開 anchor。 */}
          <div className="mt-4 sm:mt-5 max-w-2xl">
            <p
              lang="en"
              className="font-mono text-mute/55 text-[9px] tracking-[0.3em] mb-2"
            >
              ↘ MARKET ANCHOR · NT$ 200-450/月 SWEET SPOT BAND
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
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
              <div className="border border-line/40 bg-slate/20 p-2 sm:p-3 text-center">
                <p
                  lang="en"
                  className="font-mono text-mute/70 text-[9px] tracking-[0.22em] mb-1"
                >
                  GYM 月卡
                </p>
                <p className="font-mono text-mute text-[11px] sm:text-xs tabular tracking-tight">
                  NT$ 1,500+/月
                </p>
              </div>
              <div className="border border-gold/60 bg-gold/5 p-2 sm:p-3 text-center glow-soft">
                <p
                  lang="en"
                  className="font-mono text-gold text-[9px] tracking-[0.22em] mb-1"
                >
                  BLACK CARD
                </p>
                <p className="font-mono text-gold text-[11px] sm:text-xs tabular tracking-tight">
                  NT$ 299/月
                </p>
              </div>
            </div>
            <p className="mt-2 font-mono text-mute/60 text-[9px] sm:text-[10px] tracking-[0.2em] leading-relaxed">
              中段 sweet spot · 不 luxury · 不 commodity · 同 indie sports
              subscription band 物理對齊
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
              /audit S08 公開全模型
            </Link>
            <span className="mx-2 text-mute/40">·</span>
            <span className="text-gold/85">14-DAY</span> 退款保證
          </p>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            ZONE 27 訂閱會員 · <strong className="text-bone">月卡手動續訂</strong>
            模式 · NT$ 299 月卡 visitor 每月主動付 1 次 · <strong className="text-bone">
            不自動扣款</strong> · 14 天無條件退款 · 5% 創作者抽成
            (vs Taiwan LINE 老師 / 投顧老師生態 30-50% 是降維打擊)。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            <strong className="text-bone">brand IP 倒置 SaaS · 不靠 dark pattern
            自動扣款</strong> · 每月主動付 = stronger commitment 信號 · high-intent
            retention · 同 HEY / Costco yearly / 7-11 月卡 model · industry
            validated。 第 5 個 declarative absence(同 F6 不顯示賠率 / 不賣明牌 /
            不分潤博彩 / 不藏 DIVERGED / 不追蹤您 / <strong className="text-gold">
            不等 Q3</strong>)。
          </p>
          <p className="mt-4 font-mono text-gold/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
            ✓ LIVE NOW · 個人方案綠界(ECPay)收款 · 信用卡 + Apple Pay + ATM +
            超商代碼 全 OK · email Tim 啟動您 BLACK CARD 月卡
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={4} />
          </div>
          <div className="mt-3">
            <EngineStamp />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:tim@zone27.tw?subject=BLACK%20CARD%20%E8%A8%82%E9%96%B1%20-%20NT%24%20299%2F%E6%9C%88&body=Tim%20%E5%A5%BD%2C%0A%0A%E6%88%91%E6%83%B3%E8%A8%82%E9%96%B1%20BLACK%20CARD%20%E6%9C%88%E5%8D%A1%20%E2%80%A2%20NT%24%20299%2F%E6%9C%88%E3%80%82%0A%0A%E8%AB%8B%E5%AF%84%E6%88%91%20ECPay%20%E5%80%8B%E4%BA%BA%E6%96%B9%E6%A1%88%E4%BB%98%E6%AC%BE%E9%80%A3%E7%B5%90%E3%80%82%0A%0A%E8%AC%9D%E8%AC%9D%E3%80%82"
              className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              ✓ EMAIL TIM · 啟動 BLACK CARD 月卡
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

        {/* ── 5 UNLOCKS ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 5 UNLOCKS · 您拿什麼
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

        {/* ── R39 W-D · Agent D #2 · 404 Media 「FREE FOREVER vs ADDED」 2-col disclosure ─
            「Almost every story is free」 framing 倒置入 ZONE 27 brand IP ·
            告訴 visitor 您不需付的東西比需付的多 · 解 first-time-payer
            第一恐懼「他們之後會 paywall 全部」。 brand IP「Engine FREE forever」
            從 implicit 升 explicit visible at purchase path。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / FREE FOREVER · 您不需付的東西 · vs · BLACK CARD 加上的
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            BLACK CARD <span className="text-gold">加上 6 件</span> · 不拿掉任何 free 內容
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="border border-line/60 bg-slate/30 p-5">
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-3"
              >
                FREE FOREVER · 不需付費
              </p>
              <ul className="space-y-2 text-mute text-sm leading-relaxed">
                <li>▸ 引擎 v0.2 Win Probability + 10K Monte Carlo</li>
                <li>▸ /matches all CPBL 賽事 · all 5 lenses(Vibe Check + Park Factor + Pitcher Fatigue + Underdog + LensTrace)</li>
                <li>▸ /track-record + /calibration 引擎自評 + Brier score</li>
                <li>▸ /audit + /methodology + /coverage 全部 trust docs</li>
                <li>▸ /lab + /lab/custom 自訂任意投手對戰</li>
                <li>▸ /signal-board + /matches/mlb MLB 資料</li>
                <li>▸ FREE TIER 5 unlocks(Follow + Note + Submit + Calibration mirror + Predictions)</li>
                <li>▸ /annual/2026 Year 0 honest report</li>
              </ul>
            </div>
            <div className="border border-gold/50 bg-slate/50 p-5 glow-soft">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.3em] mb-3"
              >
                BLACK CARD · 加上的 6 件
              </p>
              <ul className="space-y-2 text-bone text-sm leading-relaxed">
                <li>▸ Engine Lineup v0.3 + v0.4 解鎖(Q3 Q4 ship)</li>
                <li>▸ Lens Variety 7 candidates 完整解鎖(目前 5 LIVE · 2 planned)</li>
                <li>▸ 賽事 24hr 討論室 access(Round 31 planned)</li>
                <li>▸ 5% creator 抽成(per /membership)</li>
                <li>▸ 每月 voting · 決定 engine + lens 下一個 ship</li>
                <li>▸ Tim 工程筆記 full(deprecation notes · DIVERGED 學習 · pre-launch)</li>
              </ul>
            </div>
          </div>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ 我們<strong className="text-bone">永遠不會</strong> paywall 任何
            目前 free 的內容 · per /audit S05 PRE-COMMIT pattern · 修改需 30
            天 /changelog 公告 · brand IP「Engine FREE forever」 物理 codify。
          </p>
        </section>

        {/* ── R39 W-E · Agent D #5 · Aftermath「F6 IS THE PRODUCT」 reframe ─
            F6 不做 list 從 brand statement 升 value-stack item ·
            「您 NT$ 299 也在為這 6 件「永遠不做」 付費」 · negation IS
            the product · displacement payload 物理 codify。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / NEGATION IS THE PRODUCT · 您也在為這 6 件「永遠不做」付費
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            您的 NT$ 299 買 6 unlocks · 同時買 <span className="text-gold">6 件永遠不做</span>
          </h2>
          <p className="text-mute leading-relaxed mb-6">
            訂閱費 funds 不止 features · 也 funds 結構性約束。 玩運彩+報馬仔
            收的錢 funds 他們 do 您不想要的事(賠率推銷 + cash referral
            + 失敗週次刪文)。 ZONE 27 收的錢 funds 我們 <strong>NOT do</strong>{" "}
            這些事:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              "不顯示賠率",
              "不賣明牌",
              "不分潤博彩",
              "不藏 DIVERGED",
              "不追蹤您",
              "不等 Q3",
            ].map((item) => (
              <div
                key={item}
                className="border border-gold/40 bg-slate/40 p-3 font-mono text-bone text-[11px] tracking-[0.2em] text-center"
              >
                ✕ {item}
              </div>
            ))}
          </div>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
            Aronson 1966 + Spence 1973 costly signaling · negation 是 brand
            moat · 公開定價 funds 拒絕的東西 · 比 funds 功能 更 informative。
          </p>
        </section>

        {/* ── R39 W-F · Agent D #3 · Stratechery「Subscriber Compact」 3-line ─
            Ben Thompson 「不賣 paid opinions · 不持 covered cos individual
            stocks · 不 consulting」 3-point ethics on subscription path ·
            ZONE 27 transplant 同 pattern · 3 commitment signed Tim
            「不賣引擎給 bookmakers · 0 ads ever · 公開年度收支 + sub count」。 */}
        {/* ── R42 W-D · F3.1 MAJOR FIX · Agent I dogfood canary
            Subscriber Compact 3-line lived here as subset of /ethics 8 ·
            skeptic 看到兩 page 內容 partial overlap 會 ask「why 3 here vs
            8 there?」 · 改 1-line link · /ethics 是 canonical · 不 duplicate
            partial wording from /ethics · single source of truth。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / TIM 的 8 binding commitments · /ethics
          </p>
          <Link
            href="/ethics"
            className="block border border-gold/40 bg-slate/40 p-5 sm:p-6 hover:bg-slate/50 hover:border-gold/60 transition-colors group glow-soft"
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
              <p
                lang="en"
                className="font-mono text-gold/90 text-[10px] tracking-[0.35em]"
              >
                ↗ 8 BINDING NOT-DO COMMITMENTS · SIGNED TIM
              </p>
              <span
                lang="en"
                className="font-mono text-gold text-[9px] tracking-[0.3em]"
              >
                CANONICAL · /ethics
              </span>
            </div>
            <p className="text-bone text-base sm:text-lg leading-relaxed group-hover:text-gold transition-colors">
              訂閱前 · 您應該知道 ZONE 27 永遠不做的{" "}
              <span className="text-gold">8 件事</span> ·
              玩運彩+報馬仔 結構性 violate 6/8 · ship 等於商業自殺 ·
              ZONE 27 ship 等於 displacement narrative 物理閉環。
            </p>
            <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.25em] group-hover:text-mute transition-colors">
              5 DISPLACEMENT + 2 SUBSCRIBER PROTECT + 1 BRAND · 30-day
              pre-commit binding · 修改需 /changelog 公告 →
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
              ✓ LIVE NOW · 月卡手動 · 個人方案 ECPay
            </p>
            <p className="text-bone text-lg sm:text-xl leading-relaxed mb-4 text-center">
              寄 email 給 Tim · 24 小時內收到您的{" "}
              <span className="text-gold">ECPay 個人方案付款連結</span> ·
              首月起算。
            </p>
            <div className="border border-gold/30 bg-navy/30 p-4 sm:p-5 mb-4">
              <p
                lang="en"
                className="font-mono text-gold/90 text-[10px] tracking-[0.3em] mb-2"
              >
                EMAIL · ZONE 27 創辦人 Tim
              </p>
              <a
                href="mailto:tim@zone27.tw?subject=BLACK%20CARD%20%E8%A8%82%E9%96%B1%20-%20NT%24%20299%2F%E6%9C%88&body=Tim%20%E5%A5%BD%2C%0A%0A%E6%88%91%E6%83%B3%E8%A8%82%E9%96%B1%20BLACK%20CARD%20%E6%9C%88%E5%8D%A1%20%E2%80%A2%20NT%24%20299%2F%E6%9C%88%E3%80%82%0A%0A%E8%AB%8B%E5%AF%84%E6%88%91%20ECPay%20%E5%80%8B%E4%BA%BA%E6%96%B9%E6%A1%88%E4%BB%98%E6%AC%BE%E9%80%A3%E7%B5%90%E3%80%82%0A%0A%E8%AC%9D%E8%AC%9D%E3%80%82"
                className="block text-center text-bone hover:text-gold text-base sm:text-lg tabular tracking-wide transition-colors underline-offset-4 hover:underline break-all"
              >
                tim@zone27.tw
              </a>
              <p className="mt-3 font-mono text-mute/70 text-[9px] tracking-[0.25em] text-center">
                點上面連結會開啟您的 email app · subject + body 預填好
              </p>
            </div>
            <ul className="space-y-2 text-mute text-sm leading-relaxed">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>付款方式:ECPay 個人方案 · 信用卡 / 銀行轉帳 / 超商繳費</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>首月起算 · 每月手動續訂 · 不自動扣款(per 倒置 SaaS 軸線)</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>首月 14 天無條件退款 · 隨時可取消 · 每月扣款前 3 天 email 提醒</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>每筆訂閱真實上 <Link href="/membership/black-card/ledger" className="text-gold hover:underline underline-offset-4">/membership/black-card/ledger</Link> public ledger · row 1 永久</span>
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
            / FAQ · 5 個常問
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
            BLACK CARD 是 ZONE 27 主要 recurring revenue model · NT$ 299/月 ·
            支援 engine iteration + 給訂閱者投 voting 影響下個 ship · 拿 Tim
            每週工程筆記 full 版。 5% 創作者抽成 vs 業界 30-50% 是降維打擊 ·
            per /membership #pick-vs-bet brand boundary 明確「球迷 share 預測」
            · NOT 博彩。
          </p>
          <p>
            這頁 ✓ LIVE 月卡手動 ECPay 個人方案(per R42 W-C · Agent I dogfood
            fix)· email tim@zone27.tw 我 24 小時內寄 ECPay 付款連結 · 自動扣款
            infrastructure 留 Q4 2026+(per 倒置 SaaS · manual 是 brand IP
            scarcity 不是 missing feature)。 不催 · 不 dark pattern · 不藏
            cancel button(monthly manual 本身就不需要 cancel button · 不續訂
            下月就停)。 brand IP「不靠秘密賺錢 · 靠紀律」 延伸到訂閱模式。
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
