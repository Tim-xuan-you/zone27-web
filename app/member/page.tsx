import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import MemberDashboardPreview from "@/components/MemberDashboardPreview";
import { getSession } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Member · 您的引擎時間軸 · FREE TIER dashboard preview",
  description:
    "ZONE 27 會員儀表板預覽。您在 /lab 跑過的所有 Monte Carlo · 您 follow 的賽事 calibration record · 您能投票的引擎下一步 — 全部以 4 個 cognitive bias(Endowment Effect / IKEA Effect / Loss Aversion / Collection)為基礎設計。Auth 上線 + cloud sync 在 2026 Q3 規劃。",
};

// ── ZONE 27 · /member ──────────────────────────────────
// Round 29 Wave 2 · Tim 直擊:「會員他們自己的頁面又在哪裡?他們會員
// 頁面能做什麼呢?多以心理學的角度去出發及處理」
//
// 這頁是 FREE TIER 會員儀表板的 PUBLIC PREVIEW · 不是 mock · 不是
// marketing。Visitor 進來看到自己 localStorage 裡的 sim history(已
// 累積資料)當 preview data — Endowment Effect 立刻 fire。沒 auth ·
// 但因為 data 是 visitor 自己的 · 心理連結比看 fake screenshots 強。
//
// 4 個 cognitive bias 同時 fire(per Tim「多以心理學角度」 ask):
//   01 Endowment Effect    · 您的引擎時間軸(localStorage data)
//   02 Loss Aversion       · 您 follow 的賽事 + 個人 calibration record
//   03 IKEA Effect         · 您能投票決定的引擎下一步(/roadmap items)
//   04 Pratfall + Costly Signaling · 誠實 launch timeline (preview vs functional)
//
// Pratfall: 不假裝 functionality already exists · launch timeline 公開
// 寫 (Phase 1 Q3 Supabase auth · Phase 2 Q3+ TapPay · Phase 3 Q4+ CMS)。
// 倒置 SaaS 預設「coming soon · trust me · sign up now」 · 不放空頭支票。
//
// 跟 /membership 分工:
//   /membership = 4-tier ladder 全景 + sales conversion
//   /member     = 個人預覽 + 心理學 product gap surface
// ─────────────────────────────────────────────────────

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  // Round 30 Wave 5 · auth-aware /member。 Session present = 真實註冊
  // 會員 · 顯示 welcome 區塊 + 登出 button · PREVIEW chip 切 AUTHENTICATED。
  // No session = preview mode (existing behavior) · 不假裝 functionality 已存在。
  const session = await getSession();
  const params = await searchParams;
  const justArrived = params.welcome === "true";
  const email = session?.user.email ?? null;

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
              {session
                ? "/ MEMBER · 您的 dashboard"
                : "/ MEMBER · 您的引擎時間軸"}
            </p>
            {session ? (
              <span
                lang="en"
                className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold shimmer"
                title="您已登入 · session 啟用 · Round 30 Wave 5 ship 的 Phase 1 magic link auth"
              >
                ✓ AUTHENTICATED · FREE TIER
              </span>
            ) : (
              <span
                lang="en"
                className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-loss/40 text-loss/80"
                title="本頁尚未 auth-gated · 您是 visitor / preview state · 想正式註冊 → /login"
              >
                PREVIEW · 您尚未登入
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            {session ? (
              <>
                FREE TIER ·{" "}
                <span className="text-gold">您的 dashboard</span>
              </>
            ) : (
              <>
                FREE TIER 會員儀表板 ·{" "}
                <span className="text-gold">預覽版</span>
              </>
            )}
          </h1>
          {session ? (
            <p className="mt-6 text-mute leading-relaxed max-w-2xl">
              歡迎 · 您正式是{" "}
              <span className="font-mono text-gold">{email}</span> ·
              ZONE 27 FREE TIER 會員 · 終身免費 · 永不調漲。
            </p>
          ) : (
            <p className="mt-6 text-mute leading-relaxed max-w-2xl">
              Tim 反覆被問:「會員他們自己的頁面在哪裡?能做什麼?」
              <strong className="text-bone">這頁就是答案的 preview</strong> · 用
              您 localStorage 裡已有的 sim history 當 preview data ·
              不假裝 functionality 已存在。
            </p>
          )}

          {/* ── Round 30 Wave 5 · Welcome flash + logout · only when session ── */}
          {session && (
            <div className="mt-6 bg-gold/5 border border-gold/50 p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
                <p
                  lang="en"
                  className={`font-mono text-gold text-[10px] tracking-[0.4em] ${
                    justArrived ? "shimmer" : ""
                  }`}
                >
                  {justArrived
                    ? "✓ MAGIC LINK · 登入成功"
                    : "✓ SESSION ACTIVE"}
                </p>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="font-mono text-mute hover:text-loss text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                  >
                    登出 →
                  </button>
                </form>
              </div>
              <p className="text-mute/85 text-sm leading-relaxed">
                您的 session 用 HTTP-only cookies 寫進瀏覽器 ·
                {justArrived
                  ? " 剛剛 magic link 點開時設定的 ·"
                  : ""}{" "}
                直到您點「登出」或 cookie 過期。 您 /lab 之前跑過的 sim history
                還在 localStorage · Phase 2 雲端 sync(尚未 ship · per /now
                UNRESOLVED)後會自動 sync 到您 account · 不需手動 migration。
              </p>
            </div>
          )}

          {/* ── Round 30 Wave 5 · CTA to /login if not authenticated ── */}
          {!session && (
            <div className="mt-6 bg-slate/40 border border-gold/40 p-5 sm:p-6">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
              >
                / WANT REAL DASHBOARD?
              </p>
              <p className="text-mute text-sm leading-relaxed mb-4">
                這頁目前是 preview。想<strong className="text-bone">真實註冊
                FREE TIER 會員</strong> · magic link 1 分鐘內收到 · 點開後本頁
                自動變成<strong className="text-bone">您的 dashboard</strong> ·
                Round 30 Wave 5 剛 ship · Phase 1 timeline 從 Q3 加速到 NOW。
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                → /login · magic link 註冊
              </Link>
            </div>
          )}
          <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
            4 個 cognitive bias 同時 fire ·{" "}
            <span lang="en">ENDOWMENT EFFECT</span> · IKEA EFFECT · LOSS AVERSION ·
            COLLECTION。會員 stickiness 不在「功能多」 · 在
            <strong className="text-bone">「data ownership」</strong>
            (per /manifesto Section II)。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={4} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── PSYCHOLOGY-DRIVEN DASHBOARD PREVIEW ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <MemberDashboardPreview />
        </section>

        {/* ── HOW THIS DIFFERS FROM SAAS ───────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-12 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6 text-center"
          >
            / WHY THIS IS NOT TYPICAL SAAS DASHBOARD
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight text-center mb-8">
            倒置 SaaS 預設的會員設計
          </h2>
          <div className="space-y-6 text-mute text-sm sm:text-base leading-relaxed">
            <div className="border-l-2 border-gold/40 pl-5 sm:pl-6">
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2">
                ✕ SaaS 預設:「付費 → 開更多 features」
              </p>
              <p>
                典型 SaaS 用 paywall gate 鎖功能 · 付得起的用 · 付不起的看著流口水。
                會員的 stickiness 來自<strong className="text-bone">不付會失去什麼</strong>。
              </p>
            </div>
            <div className="border-l-2 border-gold pl-5 sm:pl-6 bg-gold/5 py-3 -ml-px">
              <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-2">
                ✓ ZONE 27 反向:「累積 → 您的 data 變您的 trophy」
              </p>
              <p>
                會員的 stickiness 來自<strong className="text-bone">累積</strong>:
                您跑過的 sims · 您 follow 的賽事 · 您的個人 calibration score。
                這些是<strong className="text-bone">您自己的歷史</strong> · 不是
                我們給您的 features。離開帳號 = 失去 history(Loss Aversion)·
                您投票決定的 feature 上線 = 您是共同建造者(IKEA Effect)。
              </p>
            </div>
            <p className="mt-6 text-mute/80 text-sm">
              這個倒置是<strong className="text-bone">brand IP 級別的 commitment</strong>:
              我們承諾會員的 data 是會員的(不是我們的) · 我們承諾 feature
              roadmap 是會員 vote 決定的(不是 product team 決定的)。
              對齊 /manifesto Section I DISCLOSURE + Section II MONETIZATION。
            </p>
          </div>

          {/* ── Round 30 Wave 2 · 3-col concrete brand comparison ──
              Tim 直擊「人家也都有會員系統呀!我們的呢?」+ Apple Store
              login + cart screenshots = 隱含「我們需要 features 跟他們
              一樣多」framing。誠實答案不是 features-arms-race · 是 ZONE 27
              跟 Apple/Spotify/Stratechery 根本不同物種:Apple = 交易史
              ·   Spotify = 消費史 · Stratechery = 訂閱史 · ZONE 27 = 思辨史。
              Brand IP statement · 不是 feature list。 */}
          <div className="mt-12 pt-8 border-t border-line/30">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.35em] mb-4 text-center"
            >
              / WHAT THIS MEANS · 跟其他會員系統比較
            </p>
            <p className="text-mute text-sm sm:text-base mb-8 text-center leading-relaxed max-w-2xl mx-auto">
              Tim 反覆被問:「人家也都有會員系統呀!我們的呢?」誠實答案不是「ZONE 27
              feature 比他們多」 · 是<strong className="text-bone"> ZONE 27 跟其他會員系統根本不同物種</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ComparisonCard
                brand="Apple Store 會員"
                type="COMMERCE · 交易史"
                give="付費 + 訂單史"
                get="下次購買更快 · 收藏 · 退換貨"
                reward="重複購買"
                track="全部購買行為 + 設備指紋"
              />
              <ComparisonCard
                brand="Spotify Premium"
                type="CONSUMPTION · 消費史"
                give="月費 + 收聽行為"
                get="更精準推薦 · skip 無上限"
                reward="重複收聽"
                track="全部播放行為 + 跨平台"
              />
              <ComparisonCard
                brand="ZONE 27 會員"
                type="EPISTEMIC · 思辨史"
                give="email + 您自己跑過的 sim"
                get="您歷史的所有權"
                reward="重複思辨"
                track="0 · 寫進 /privacy"
                highlight
              />
            </div>
            <p className="mt-8 text-mute/85 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              ZONE 27 會員系統 = <strong className="text-bone">epistemic relationship archive</strong>(思辨關係的可信備份)。
              您跑過的 sim 是您過去思辨的物理痕跡 · 累積 = <strong className="text-bone">您自己的 trophy</strong> ·
              不是我們給您的 feature。
            </p>
            <p className="mt-3 text-mute/75 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              我們從來不是 Apple · 我們從來不會是 Apple。
              想知道我們會員系統<strong className="text-bone">技術上</strong>怎麼接 ·
              看 <Link href="/now" className="text-gold underline-offset-4 hover:underline">/now</Link>{" "}
              · 想看 4-tier ladder 價格軸 · 看 <Link href="/membership" className="text-gold underline-offset-4 hover:underline">/membership</Link>。
            </p>

            {/* ── Round 30 Wave 2B · deepest sharp call CTA ──
                Agent research synthesis: 「The dashboard isn't a feature
                stack. It's an epistemic mirror.」 The /member/calibration
                page is where this stance lives as physical artifact ·
                sabermetric reliability diagram(45° line)· 唯一一個高端
                sports 品牌 publish 會員自己 calibration drift 的。 */}
            <div className="mt-10 pt-6 border-t border-gold/30 text-center">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
              >
                / DEEPEST SHARP CALL
              </p>
              <p className="text-bone text-lg sm:text-xl font-light tracking-tight leading-snug mb-3 max-w-xl mx-auto">
                這個 dashboard 不是 feature stack · 是{" "}
                <span className="text-gold">epistemic mirror</span>。
              </p>
              <p className="text-mute/85 text-sm leading-relaxed max-w-xl mx-auto mb-5">
                這個 stance 的物理產出 = sabermetric reliability diagram ·
                45° 線 · 引擎跟現實的可信對照。
              </p>
              <Link
                href="/member/calibration"
                className="inline-block px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
              >
                → /member/calibration · 看 mirror
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHEN AUTH LANDS · NEXT STEPS ─────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-12 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / WHEN AUTH LANDS · 您下一步要做什麼
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            Auth 上線時 · 同 1 個 email 動作就 sync
          </h2>
          <p className="text-mute text-base leading-relaxed mb-8">
            您現在如果加入 FREE TIER · 您留的 email 就是未來會員帳號的 identifier。
            launch 那一天 · 您點 magic link → 您 localStorage 的 sim history 自動同步 ·
            您 follow 的賽事自動轉到 cloud · 不需 migration ·
            不需重新註冊 · 不需「升級」。
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/membership#waitlist"
              className="inline-block px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
            >
              ↓ 加入 FREE TIER ·  保留我的位置
            </Link>
            <Link
              href="/lab"
              className="inline-block px-6 py-3 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
            >
              先跑幾場 · /lab →
            </Link>
          </div>
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.3em] mt-6 leading-relaxed">
            ▸ 您現在在 /lab 跑的 sim · 都會在 auth 上線後 sync 到您的雲端帳號 ·
            不會白跑。
          </p>
        </section>

        <FounderSignOff>
          <p>
            這頁是我給「您頁面在哪?」這個問題的<strong>誠實答案</strong>。
            目前是 preview · 不是 functional · 不假裝。但 4 個心理學原則
            (Endowment · IKEA · Loss Aversion · Collection)已經 wired in design。
          </p>
          <p>
            Auth 上線那一天 · 您在 /lab 跑過的所有 sims · 您 follow 過的賽事 ·
            您看到的 calibration record · 全部都會接得上 · 因為這個 schema 從
            <strong>第一天就是這樣設計的</strong>。
          </p>
          <p>
            我承諾這頁的 launch timeline 寫進 /now · 任何 timing 偏差 ·
            /changelog 看得到 git commit diff。沒有「即將推出 · 敬請期待」 ·
            只有寫死的 phase + 實際的 commit。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/member" />
        {/* sub-component:見檔尾 ComparisonCard */}

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/membership"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← 4-tier ladder 全景 · /membership
            </Link>
            <Link
              href="/now"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              這頁工程現狀 · /now →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// Round 30 Wave 2 · 3-col member-system comparison card.
// Brand-IP focused · NOT a feature-arms-race。 Each card surfaces 4 axes:
// give/get/reward/track。 Highlight version(ZONE 27)gold-bordered with
// 0 tracking visible as gold cell · 對齊 Footer「FUNDED BY FOUNDERS · NO
// GA · NO PIXEL」inversion brand line。
function ComparisonCard({
  brand,
  type,
  give,
  get,
  reward,
  track,
  highlight = false,
}: {
  brand: string;
  type: string;
  give: string;
  get: string;
  reward: string;
  track: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 border flex flex-col h-full ${
        highlight
          ? "border-gold/60 bg-gold/5 glow-soft"
          : "border-line/50 bg-slate/30"
      }`}
    >
      <p
        lang="en"
        className={`font-mono text-[9px] tracking-[0.25em] mb-2 ${
          highlight ? "text-gold" : "text-mute/70"
        }`}
      >
        {type}
      </p>
      <h3
        className={`text-base sm:text-lg font-light tracking-tight mb-4 ${
          highlight ? "text-gold" : "text-bone"
        }`}
      >
        {brand}
      </h3>
      <dl className="space-y-3 text-xs sm:text-sm">
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            您給他們
          </dt>
          <dd className="text-bone/90 leading-snug">{give}</dd>
        </div>
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            他們給您
          </dt>
          <dd className="text-bone/90 leading-snug">{get}</dd>
        </div>
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            獎勵您的
          </dt>
          <dd className="text-bone/90 leading-snug">{reward}</dd>
        </div>
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            追蹤您的
          </dt>
          <dd
            className={`leading-snug ${highlight ? "text-gold" : "text-bone/90"}`}
          >
            {track}
          </dd>
        </div>
      </dl>
    </div>
  );
}
