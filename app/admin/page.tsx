import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import { matches, getFinalizedMatches } from "@/lib/matches";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";
import { getWaitlistCount } from "@/lib/waitlist-stats";
import { getSession } from "@/lib/supabase/server";
import AdminTierSwitcher from "@/components/AdminTierSwitcher";
import TierFeatureMatrix from "@/components/TierFeatureMatrix";
import AdminConsole from "@/components/AdminConsole";

export const metadata: Metadata = {
  title: "Admin · Tim's ZONE 27 ops dashboard preview",
  description:
    "ZONE 27 admin dashboard preview · Tim 親自看後台是這個樣子(規劃中 · Stage 2)· 目前 Stage 1 = Supabase Studio 直接登入。本頁面公開但 noindex · 是 ops mockup 不是真實 admin。",
  // Round 29 Wave 2 · noindex to keep this out of any future SEO crawl ·
  // public preview only · not for visitor traffic.
  robots: {
    index: false,
    follow: false,
  },
};

// Re-fetch live numbers every 60s.
export const revalidate = 60;

// ── ZONE 27 · /admin ───────────────────────────────────
// Round 29 Wave 2 · Tim 直擊:「我要如何管理會員?操作介面在哪裡?」
//
// 目前真實的 ops 狀態:
//   Stage 1 · Supabase Studio 直接登入(supabase.com 點您的 project)
//            看 waitlist 表 · 排序篩選匯出 · SQL Editor 跑簡單 query
//   Stage 2 · 自家 /admin 後台(ADMIN-PLAN.md 已 design · 還沒寫)
//   Stage 3 · Plausible cookieless analytics(三條件 trigger 後 · 還早)
//
// 這個 /admin 頁面是 Stage 2 mockup · 顯示 dashboard WILL look like 但
// 還沒 auth-gated · 還沒接真實 admin queries · 完全是 preview。
//
// noindex 因為:
//   - 不是公開內容 · 是 ops surface
//   - 但放公開資料夾 OK · 訪客看到也只是看到「ops mockup」
//   - 對齊 ZONE 27 disclosure philosophy:連 admin 後台都公開設計
//
// Pratfall: 顯示真實 numbers(waitlist count · founders state · ingest queue)
// 從 live data 拉 · 但沒 admin actions(刪除 / 改 state 等)· 純預覽。
// ─────────────────────────────────────────────────────

export default async function AdminPage() {
  // Round 30 Wave 10 · auth-aware /admin · Tim 自己 login 後 page 顯示
  // 他的 session info(email + 加入天數)· anonymous visitor 看 noindex
  // preview。 不是 admin gate(任何 logged-in user 都看得到)· 只是給
  // Tim visual confirmation 他 auth 鏈通了。 真正的 admin actions
  // gate 是 Stage 2 後台 · 還沒 ship。
  const session = await getSession();
  const waitlistCount = await getWaitlistCount();
  const finalizedCount = getFinalizedMatches().length;
  const ingestedCount = matches.length;
  const pendingIngest = matches.filter((m) => !m.finalResult).length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / ADMIN · Tim&apos;s OPS DASHBOARD
            </p>
            <span
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80"
              title="只有你看得到 · 沒上 Google"
            >
              只有你看得到
            </span>
            {session && (
              <span
                lang="en"
                className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold shimmer"
                title={`您 logged in as ${session.user.email}`}
              >
                ✓ SESSION · {session.user.email}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            Tim 的 <span className="text-gold">ZONE 27 ops 後台</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            這是你的管理台。 管理會員、管理大家發的文章 ——
            <strong className="text-bone">全部在 Supabase 做</strong>,下面是一步一步的操作手冊
            (每個動作都有現成指令,直接複製貼上就好)。
          </p>
          <p className="mt-4 text-mute/80 text-sm leading-relaxed max-w-2xl">
            為什麼不做「一鍵按鈕」後台?因為碰錢的動作<strong className="text-bone">故意手動 + 留痕</strong>
            (你的鐵律 #13:不自動扣款)· 一個人經營的階段不過度造後台。 下面的數字是即時的,動作走 Supabase。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 管理台 · 點按鈕(R185 · Tim:不會操作 SQL · 要 WordPress 式)· AdminConsole + migration 0011 ── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
            / 管理台 · 點按鈕就行
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
            你的管理台
          </h2>
          <p className="text-mute/85 text-sm leading-relaxed mb-6 max-w-2xl">
            像 WordPress 後台一樣 —— 打 email、打金額、按按鈕,全程不用寫任何指令。
            碰錢的動作要你親手按一次確認(你的鐵律「不自動扣款」)· 不是限制,是紀律。
          </p>

          <AdminConsole />

          <p className="mt-6 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed max-w-2xl">
            ▸ 第一次用:登入你的 email → 按「把我設為管理員」(只有第一個人能設,設完鎖死)→ 之後全是按鈕。
            這些管理「動作」都有上鎖(只有你能執行 · 別人硬打也被擋)· 整頁上鎖是待辦(但別人本來就看不到會員 email)。
          </p>
        </section>

        {/* R60 W-C · Designer Quick Reference · Tim 第 3 次 canary fire 同問題
            「設計者要怎麼切換查看 / 要登入嗎 / 哪個帳號」 · founder dogfood
            permanent FAQ block · 一進 /admin 就看到 3 個答案。 brand IP「方法
            公開 · 品味私藏」 延伸到 designer tool ergonomics · per [[feedback-
            founder-dogfood-canary]] 「founder push back 第 1 次就 trust 即修」 ·
            第 3 次 explicit physical surface 必須立即修。 同 /admin noindex
            invisible to public + 只 Tim 看得到 axiom 保留。 */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
          <div className="bg-slate/30 border border-gold/50 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em] mb-4"
            >
              / DESIGNER QUICK REFERENCE · 設計者 3 個常問
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="border-l-2 border-gold/50 pl-4">
                <p
                  lang="en"
                  className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2"
                >
                  Q · 要登入嗎?
                </p>
                <p className="text-bone text-[13px] sm:text-sm leading-relaxed">
                  <strong className="text-gold">不需要</strong>。 tier preview
                  是純 localStorage 不碰 auth · 不寫 server · 不影響真實
                  session。 您是匿名訪客也 OK · 已登入也 OK。
                </p>
              </div>
              <div className="border-l-2 border-gold/50 pl-4">
                <p
                  lang="en"
                  className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2"
                >
                  Q · 怎麼從任何頁面切?
                </p>
                <p className="text-bone text-[13px] sm:text-sm leading-relaxed">
                  按{" "}
                  <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
                    Cmd+Shift+P
                  </kbd>
                  (Mac)或{" "}
                  <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
                    Ctrl+Shift+P
                  </kbd>
                  (Win)= 任何頁面 banner 立即跳出 · 4 tier 一鍵切。 banner 在
                  全站 sticky top。
                </p>
              </div>
              <div className="border-l-2 border-gold/50 pl-4">
                <p
                  lang="en"
                  className="font-mono text-mute text-[10px] tracking-[0.3em] mb-2"
                >
                  Q · 要哪個帳號?
                </p>
                <p className="text-bone text-[13px] sm:text-sm leading-relaxed">
                  Tier preview <strong className="text-gold">不需要任何
                  帳號</strong>。 若要測「真實 auth state」(實際 Email + 密碼
                  flow / Supabase session cookie)再用 /login · 隨便 email + 密碼 註冊
                  測試帳號(Resend free tier 100/day)。
                </p>
              </div>
            </div>
            <p className="mt-5 pt-4 border-t border-line/40 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
              ▸ Tier preview = 純視覺切換(client-side localStorage)·
              real auth = 真實 Supabase session(server-side cookie)· 兩個
              系統獨立 · 您可同時 active · banner 顯示 preview tier · Nav 顯示
              real auth state。
            </p>
          </div>
        </section>

        {/* ── Round 36 W-D · TIER SWITCHER · founder dev tool ────
            Tim 14+ canary fire question:「我這個設計者 · 我要怎麼樣可以
            在各個付費程度裡面 · 隨意切換看各個功能有沒有到位?」 brilliant
            founder dogfood requirement · ship 4-tier preview switcher。
            localStorage-based · sticky banner 全 site 顯示 · click 切 +
            reload · banner click cancel 回真實 session。 Phase 1 MVP
            client-side visual preview · Phase 2 升 cookie-based 讓 server
            tier-aware components 也 honor preview tier。 */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
          <AdminTierSwitcher />
        </section>

        {/* ── R111 W1 · NEW TierFeatureMatrix · 4 tiers 並列 feature
            comparison per Tim 2026-05-25 critique「切換都沒動作 · 看不到變化」
            + 「最高階有哪些功能 · 最低階也顯現出來 · 誘惑他們花錢」 ·
            13 features × 4 tiers grid · 每個 cell ✓ UNLOCKED / 🔒 LOCKED /
            — N/A · click tier header 立即切換 preview tier + 同 PreviewModeBanner
            sync via custom storage event · Tim 一頁可比對 4 tier 差別 ·
            不需 4 個 login account · per agent research Substack/Patreon/
            GitHub locked-preview pattern。 */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
          <TierFeatureMatrix />
        </section>

        {/* ── KPI ROW (live numbers · no actions) ──── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4"
          >
            / 01 · KPI · LIVE NUMBERS
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <KpiCard
              label="WAITLIST"
              zh="等候名單"
              value={waitlistCount === -1 ? "—" : waitlistCount}
              hint={
                waitlistCount === -1
                  ? "Supabase RPC 暫時不可達 · 請開 Supabase Studio 確認"
                  : waitlistCount === 0
                  ? "尚無人加入 · 第一個就會是 #001"
                  : `${waitlistCount} 個 email · Supabase Tokyo`
              }
            />
            <KpiCard
              label="FOUNDERS"
              zh="創始席位"
              value={`${FOUNDERS_CLAIMED} / ${FOUNDERS_TOTAL}`}
              hint={`剩 ${FOUNDERS_REMAINING} · NEXT IS ${formatBadge(FOUNDERS_NEXT)}`}
            />
            <KpiCard
              label="MATCHES"
              zh="ingest 過的賽事"
              value={ingestedCount}
              hint={`${finalizedCount} 場已 finalize · ${pendingIngest} 場 pending`}
            />
            <KpiCard
              label="ENGINE"
              zh="引擎版本"
              value="v0.2"
              hint="Real At-Bat · 待 v0.3 park factor + 隊伍 wOBA"
            />
          </div>
        </section>

        {/* ── 不裝什麼(analytics 紀律)─────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16 pt-12 border-t border-line/40">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
            / 不裝什麼 · 數據追蹤紀律
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            還早 · 不裝
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              Stage 3 = Plausible Analytics($9/月 · cookieless · 零 PII)。
              <strong className="text-bone">三條件全部 ✓ 才啟用</strong>:
            </p>
            <ul className="space-y-2 text-sm border-l-2 border-mute/30 pl-5 sm:pl-6 list-none">
              <li>▸ 月活 &gt; 1000(目前 stealth · 還沒)</li>
              <li>▸ BLACK CARD 月費已上線(目前還沒)</li>
              <li>▸ 你決定要做產品決策(哪個 feature 留 · 哪個砍)</li>
            </ul>
            <p className="text-mute/70 text-sm">
              <strong className="text-bone">永遠不裝的:</strong> Google Analytics 4 ·
              Facebook Pixel · Hotjar 熱圖錄影 · LinkedIn Insight Tag · TikTok Pixel。
              這些違反 <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">/privacy</Link>{" "}
              承諾 · 永久 blocked(per /manifesto Section IV PRIVACY)。
            </p>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁是給<strong>你自己</strong>看的 — 不是給訪客看的。但放公開資料夾 OK ·
            因為 ZONE 27 disclosure philosophy 連 admin 後台都公開設計(see also
            ADMIN-PLAN.md 在 GitHub)。
          </p>
          <p>
            目前你 90% 的 admin work 是 git commit + Supabase Studio + 親手寫 email。
            這完全合理 · founder solo 階段沒道理 over-engineer dashboard ·
            <strong>Stage 2 寫程式的時機是 waitlist 突破 100 人</strong> · 不是現在。
          </p>
          <p>
            如果有一天你看 admin metric 比看 git commit history 多 · 那是品牌走偏的信號。
            這頁存在的部分意義 = 提醒這件事(per /discipline Buffett「track record」)。
          </p>
        </FounderSignOff>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/member"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← 會員端 preview · /member
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────

function KpiCard({
  label,
  zh,
  value,
  hint,
}: {
  label: string;
  zh: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="p-4 sm:p-5 border border-gold/30 bg-slate/30">
      <p
        lang="en"
        className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-1"
      >
        {label}
      </p>
      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mb-3">
        {zh}
      </p>
      <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light leading-none mb-2">
        {value}
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
        {hint}
      </p>
    </div>
  );
}

