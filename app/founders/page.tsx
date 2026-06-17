import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import CopyLinkButton from "@/components/CopyLinkButton";
import CredentialStack from "@/components/CredentialStack";
import { getWaitlistCount } from "@/lib/waitlist-stats";
import { createPageMetadata } from "@/lib/page-og";

// ── /founders · R187 · 拿掉「創始 270 名冊」(per Tim「太複雜 · 刪掉吧」)──
// 砍掉:NEXT IS #008 倒數 · GOLD 會員 · 鑲金編號 unlock · #001–#270 ·
// 分配帳本連結 · founders-stats(GOLD_TOTAL/NEXT/formatBadge)依賴。
// GOLD 改框成「最高階年度會員」· 稀有感用身分+全站最低抽成承載,不用數字。
// /founders/ledger 已改成 redirect · FoundingMemberLedger / ScarcityStrip 已刪。
// ⚠ 站上其他散落的「270 / 創始編號」文字提及(faq/terms/privacy/annual 等)
//   留下一輪文字 sweep。
// ─────────────────────────────────────────────────────
export const metadata: Metadata = createPageMetadata({
  title: "GOLD · 最高階年度會員 · NT$ 2,700 / 365 天",
  description:
    "ZONE 27 最高階年度會員 · NT$ 2,700/365 天 · 引擎永遠免費 —— GOLD 賣的不是工具,是養著它、戴上最高階身分。 你的建議 Tim 親手讀 · 每年 1/1 加入 / 續訂 · 親手 onboard。",
  path: "/founders",
});

export const revalidate = 3600;

// 你拿到什麼 · 5 個權益 · 一行一個
// 🔴 R245:拿掉舊版「✓ 驗證準度徽章」當 GOLD 解鎖 —— /u/[code]/badge 對任何碼 0 tier-gate
//   產生、CreatorAnalysis 的「✓ 已驗證準度」章是 ≥10 場結算自動賺來的,跟付費無關。 列成
//   GOLD 權益 = 暗示「付錢才驗證準度」,踩「付費≠比較準·準是免費的」紅線。 改放進下方
//   WONT_BUY 誠實 coda,正面講「準度標章靠戰績賺、不靠付費」。
const UNLOCKS = [
  "365 天會員資格 · BLACK 的金環 + 會員房間都包含",
  "最高階支持者金環 · 養活開放引擎最深的一群",
  "你的建議 Tim 親手讀 —— 覆蓋哪些聯賽、引擎怎麼改,聽得到你的聲音",
  "BOTTOM 27 棒球手遊上線 · GOLD 限定球員卡空投",
  "恆美攝影 × 伶 Kopi 旗艦店 · 一品紅茶招待",
];

// 誠實列在買點旁 · NT$ 2,700 不會給你(一行一個)
const WONT_BUY = [
  ["更準 / 花錢買到的「準度」", "準是免費的 —— 含輸命中率、驗證準度標章靠你公開的戰績賺,不靠付費解鎖"],
  ["明牌 / 內幕", "不接受下注 · 不出彩金 · 沒有「老師明牌」可給"],
  ["保證賺錢", "我們公開機率 · 不承諾你下注賺錢"],
  ["終身買斷", "365 天 · 每年 1/1 主動續訂 · 不自動扣款"],
  ["私人 DM", "Tim 親手回 email · 但全體會員同等對待"],
];

export default async function FoundersPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const refSource = typeof params.ref === "string" ? params.ref : undefined;
  const waitlistCount = await getWaitlistCount();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── HERO ───────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 sm:pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-5 sm:mb-7 font-mono text-[9px] sm:text-[10px] tracking-[0.4em]">
            <span className="text-gold">GOLD · 27</span>
            <span className="text-mute/60">·</span>
            <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
              PRE-LAUNCH WAITLIST
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
            GOLD
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl text-mute">
              最高階年度會員
            </span>
          </h1>

          <p className="mt-5 font-mono text-mute text-sm sm:text-base tabular tracking-[0.2em]">
            NT$ 2,700
            <span className="text-mute/60 mx-2">·</span>
            365 天
            <span className="text-mute/60 mx-2">·</span>
            <span className="text-bone">NO AUTO-RENEW</span>
          </p>
          <p className="mt-2 text-mute/70 text-xs sm:text-[13px] leading-relaxed">
            最高階<span className="text-gold">年度身分</span> · 等同每場 ~NT$ 11 · 比 BLACK 整年省 55%
          </p>

          {/* 一段親筆 founder voice */}
          <div className="mt-7 max-w-xl mx-auto bg-slate/30 border-l-2 border-gold/60 px-5 py-4 text-left">
            <p className="text-bone text-[14px] sm:text-[15px] leading-relaxed">
              我寫這個引擎,是因為台灣硬核棒球迷沒有自己的 Bloomberg。引擎永遠免費 ——
              GOLD 賣的不是工具,是一個不靠明牌、不抽下注活下去的品牌的
              <strong className="text-bone">最高階席位</strong>:Tim 親手 onboard、你的建議他親手讀、養活這個免費引擎最深的那一群。
            </p>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mt-3 pt-3 border-t border-line/40">
              — TIM · SOLO FOUNDER · ZONE 27
            </p>
          </div>

          <CredentialStack />

          <a
            href="#waitlist"
            className="inline-block mt-8 font-mono text-gold text-[11px] tracking-[0.4em] hover:text-gold-soft transition-colors"
          >
            ↓ 加入等候名單
          </a>
        </section>

        {/* ── WAITLIST FORM(id 必須保留 · /login 深連結)──── */}
        <section
          id="waitlist"
          className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-8 scroll-mt-20"
        >
          <ClientErrorBoundary fallbackLabel="WaitlistForm">
            <WaitlistForm waitlistCount={waitlistCount} refSource={refSource} />
          </ClientErrorBoundary>
        </section>

        {/* ── 已決定 → 直接申請 ──────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16">
          <Link
            href="/founders/apply"
            className="flex items-center justify-between gap-4 border border-gold/40 bg-slate/40 hover:bg-slate/60 hover:border-gold/60 px-6 py-5 transition-colors group"
          >
            <span className="min-w-0">
              <span className="block text-bone text-base sm:text-lg font-light tracking-tight">
                已決定?直接申請最高階席位 →
              </span>
              <span className="block text-mute text-xs sm:text-sm mt-1 leading-relaxed">
                Tim 親手 review · 通過後寄銀行資訊 + 轉帳窗口
              </span>
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-gold text-lg group-hover:translate-x-1 transition-transform"
            >
              →
            </span>
          </Link>
        </section>

        {/* ── 你拿到什麼 · 不會拿到什麼 ───────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-16">
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight text-center mb-2">
            NT$ 2,700 · 一年 · 你拿到什麼
          </h2>
          <p className="text-mute text-center text-sm mb-10 max-w-lg mx-auto leading-relaxed">
            引擎本來就免費。下面這些,是只有最高階會員才有的東西。
          </p>

          <ul className="max-w-xl mx-auto space-y-3 list-none pl-0 mb-12">
            {UNLOCKS.map((u, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-gold text-[11px] shrink-0"
                >
                  ✓
                </span>
                <span className="text-bone/90 text-sm leading-relaxed">{u}</span>
              </li>
            ))}
          </ul>

          {/* 不會給你(誠實 coda)*/}
          <div className="max-w-xl mx-auto border border-loss/30 bg-slate/30 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-loss/85 text-[10px] tracking-[0.35em] mb-4"
            >
              ✕ NT$ 2,700 不會給你
            </p>
            <ul className="space-y-2.5 list-none pl-0">
              {WONT_BUY.map(([what, why], i) => (
                <li key={i} className="text-[13px] leading-relaxed">
                  <span className="text-bone">{what}</span>
                  <span className="text-mute/60 mx-2">—</span>
                  <span className="text-mute">{why}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 還想知道 · 連結深度頁(問答 push 到 /faq)──── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-16">
          <div className="grid sm:grid-cols-2 gap-3">
            <DepthLink href="/membership" label="比較三種會員" en="OPEN · BLACK · GOLD" />
            <DepthLink href="/track-record" label="引擎公開戰績" en="命中跟落空一樣掛" />
            <DepthLink href="/integrity" label="永遠不變的事" en="22 條永遠不變" />
            <DepthLink href="/faq" label="完整問答" en="現在留 email 要付錢嗎?引擎免費那我付什麼?" />
          </div>

          <div className="mt-12 pt-8 border-t border-line/40 flex items-center justify-center">
            <CopyLinkButton />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function DepthLink({
  href,
  label,
  en,
}: {
  href: string;
  label: string;
  en: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 border border-line/60 bg-slate/20 hover:border-gold/40 hover:bg-slate/40 px-5 py-4 group transition-colors"
    >
      <span className="min-w-0">
        <span className="block text-bone text-sm group-hover:text-gold transition-colors">
          {label}
        </span>
        <span
          lang="en"
          className="block font-mono text-mute/70 text-[10px] tracking-[0.2em] mt-0.5"
        >
          {en}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 font-mono text-gold/60 text-sm group-hover:translate-x-0.5 transition-transform"
      >
        →
      </span>
    </Link>
  );
}
