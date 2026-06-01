import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import CopyLinkButton from "@/components/CopyLinkButton";
import CredentialStack from "@/components/CredentialStack";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";
import { getWaitlistCount } from "@/lib/waitlist-stats";
import { createPageMetadata } from "@/lib/page-og";

// ── /founders · R181 大幅瘦身(Tim canary 3:頁面太長 + 內部策略/學術理由/
// founder 私下懷疑印在台前 = 劇本外洩,全砍)。 砍除:Pokemon 經濟學類比 ·
// FOUNDER DOUBT + Aronson 1966 + Costly Signaling 後設說明 · Defector $690K
// + Patek Generations 商業類比 · 5 個 anchor 元件(PreTransferReceipt /
// NonComparableAnchor / MultiYearAnchor / GenerationsLine / VsRowFold)·
// 3 段重複「引擎免費」reframe 收成 1 段 · 修投票權矛盾。 留:報價 + 表單 +
// 一段親筆 founder voice + 價值對照 + 權益 + 定價 + FAQ。
export const metadata: Metadata = createPageMetadata({
  title: "Founders 27 · NT$ 2,700 / 365 天 · 前 270 拿創始編號",
  description:
    "ZONE 27 創始會員 · NT$ 2,700/365 天 · 會員不限量 · 前 270 拿永久創始編號 · 每年 1/1 加入 / 續訂 · Tim 親手 onboard 前 270 · 創作者抽傭 5%。",
  path: "/founders",
});

export const revalidate = 3600;

// 「NT$ 2,700 不會給您」· 跟 LINE 老師 / 報馬仔生態的差別,誠實列在買點旁。
const DOLLAR_DIDNT_BUY: { what: string; why: string }[] = [
  {
    what: "明牌 / 內幕消息",
    why: "ZONE 27 不接受下注 · 不出彩金 · 沒有「老師明牌」可以給。",
  },
  {
    what: "保證賺錢",
    why: "我們公開機率,不承諾你下注賺錢。引擎是工具,不是投資建議。",
  },
  {
    what: "終身買斷",
    why: "Founders 27 是 365 天,每年 1/1 主動續訂(0 自動扣款)。誠實講:這是年度會員,不是一次付清。",
  },
  {
    what: "私人 LINE / DM",
    why: "Tim 親手回 email,但不開個人 DM。全 270 同等對待。",
  },
];

const benefits = [
  {
    no: "01",
    zh: "365 天會員資格",
    en: "365-DAY ACCESS",
    body: "NT$ 2,700/365 天 · 每年 1/1 可優先續訂。BLACK CARD 的功能全包含在內,不另收。",
  },
  {
    no: "02",
    zh: "鑲金編號徽章",
    en: "NUMBERED BADGE · #001-#270",
    body: "前 270 名拿永久創始編號,在天梯、留言、分析署名旁都會顯示。是身分,也是勳章。",
  },
  {
    no: "03",
    zh: "創作者低抽成",
    en: "5% PLATFORM FEE",
    body: "如果你也賣分析,Founders 27 平台只抽 5%(你拿 95%,BLACK CARD 是 10%)。",
  },
  {
    no: "04",
    zh: "AI 模型優先試用",
    en: "PRIORITY PREVIEW",
    body: "每次引擎迭代,創始會員提前 7 天試用。",
  },
  {
    no: "05",
    zh: "BOTTOM 27 共生",
    en: "ECOSYSTEM CROSS-PASS",
    body: "未來 BOTTOM 27 棒球手遊上線,自動空投創始限定球員卡。",
  },
  {
    no: "06",
    zh: "實體尊榮招待",
    en: "PREMIUM HOSPITALITY",
    body: "出示創始會員 QR,至恆美攝影 × 伶 Kopi 旗艦店免費招待一杯頂級一品紅茶。",
  },
];

// ── 三種會員對照 ───────────────────────────────────────
const TIERS = [
  {
    name: "FREE",
    zh: "自由訪客",
    price: "NT$ 0",
    priceNote: "永久免費",
    highlight: false,
    rows: {
      data: "完整引擎",
      participate: "✓ 押注 + 上天梯",
      fee: "—",
      badge: "—",
      preview: "—",
      hospitality: "—",
      fiveYearTotal: "NT$ 0",
    },
  },
  {
    name: "BLACK CARD",
    zh: "31 天通行",
    price: "NT$ 500",
    priceNote: "每 31 天 · 手動轉帳 · 0 自動續訂",
    highlight: false,
    rows: {
      data: "完整引擎",
      participate: "✓",
      fee: "創作者抽 10%",
      badge: "—",
      preview: "—",
      hospitality: "—",
      fiveYearTotal: "NT$ 30,000",
    },
  },
  {
    name: "FOUNDERS 27",
    zh: "創始會員",
    price: "NT$ 2,700",
    priceNote: "每 365 天 · 會員不限量 · 前 270 拿編號",
    highlight: true,
    rows: {
      data: "完整 + 優先試用",
      participate: "✓",
      fee: "創作者抽 5%",
      badge: "✓ #001-#270",
      preview: "✓ 7 天",
      hospitality: "✓",
      fiveYearTotal: "NT$ 13,500",
    },
  },
] as const;

const COMPARE_ROWS = [
  { key: "data", label: "引擎存取", en: "ENGINE" },
  { key: "participate", label: "押注 + 天梯", en: "PARTICIPATE" },
  { key: "fee", label: "賣分析抽成", en: "CREATOR FEE" },
  { key: "badge", label: "創始編號", en: "BADGE" },
  { key: "preview", label: "模型優先試用", en: "PREVIEW" },
  { key: "hospitality", label: "實體招待", en: "HOSPITALITY" },
  { key: "fiveYearTotal", label: "5 年總額", en: "5-YEAR TOTAL" },
] as const;

// 買點旁的 6 個常見疑慮 · 前 3 個預設展開,其餘收合。
const INLINE_FAQ = [
  {
    q: "我怎麼知道這不是空殼?",
    a: "原始碼公開在 GitHub(連結在頁尾)。引擎現在就在 /lab 跑得到,你可以親自跑 1 萬次模擬看它收斂。賽後實際結果在 /track-record 公開累積,輸的也掛。",
  },
  {
    q: "現在留 email 就要付錢嗎?",
    a: "不收費、不綁定、隨時退出。留 email = 進入永久免費訂閱層 + Founders 27 預售名單(開放時優先通知)。真正付款是你主動選擇升級的那一刻。付款後 14 天無條件退款。",
  },
  {
    q: "引擎免費,那我付 2,700 買什麼?",
    a: "買身分,不是買工具。引擎你免費無限用。Founders 27 = 365 天會員 + 前 270 的永久創始編號 + 賣分析只抽 5%。是支持這個品牌不靠明牌、不抽下注活下去。",
  },
  {
    q: "手動銀行轉帳怎麼走?",
    a: "(1) 開放後你 email tatayngiti@gmail.com 表達意願;(2) Tim 24h 內回銀行資訊 + 你專屬備註碼;(3) 你匯款,備註寫你的碼;(4) Tim 確認入帳後寄編號 + 邀請。全程 Tim 親手,沒有外包。",
  },
  {
    q: "加入後反悔想退款?",
    a: "付款後 14 天無條件退款,寫信即可,不問原因。退款後你仍保留所有下載過的開源程式碼。",
  },
  {
    q: "可以轉送給朋友嗎?",
    a: "可以。寫信說要把編號轉給誰(對方 email),Tim 24h 內更新並通知新主人。",
  },
] as const;

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
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-10 sm:pt-24 pb-8 sm:pb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-5 sm:mb-8 font-mono text-[9px] sm:text-[10px] tracking-[0.4em]">
            <span className="text-gold">FOUNDERS · 27</span>
            <span className="text-mute/60">·</span>
            <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
              PRE-LAUNCH WAITLIST
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
            NEXT IS{" "}
            <span className="text-gold tabular">{formatBadge(FOUNDERS_NEXT)}</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl text-mute">
              (會員不限量 · 前 {FOUNDERS_TOTAL} 拿創始編號)
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 font-mono text-mute text-sm sm:text-base tabular tracking-[0.2em]">
            NT$ 2,700
            <span className="text-mute/60 mx-2">·</span>
            365 天
            <span className="text-mute/60 mx-2">·</span>
            <Link
              href="/founders/ledger"
              className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
            >
              分配公開帳本 →
            </Link>
          </p>
          <p
            lang="en"
            className="font-mono text-mute text-[10px] sm:text-xs tracking-[0.3em] mt-3"
          >
            NO AUTO-RENEW · 1ST EDITION #001–#270
          </p>

          <p className="mt-5 max-w-md mx-auto text-mute/85 text-xs sm:text-[13px] leading-relaxed">
            前 270 個創始編號,每一個都是 Tim 親手回覆 + 親筆 sign-off。會員永遠不限量可加入,
            但「親手 onboard」這道工,只刻在最初 270 個編號上。發完即止。
          </p>

          <CredentialStack />

          <p className="mt-6 max-w-md mx-auto font-mono text-mute/85 text-xs sm:text-[13px] tracking-[0.15em] leading-relaxed">
            決定前先看{" "}
            <Link
              href="/track-record"
              className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
            >
              /track-record
            </Link>{" "}
            · 引擎在真實 CPBL 的公開戰績,言中跟落空一樣掛。
          </p>

          {/* 一段親筆 founder voice(留這一段,砍掉 FOUNDER DOUBT + checkout 兩段重複) */}
          <div className="mt-7 max-w-xl mx-auto bg-slate/30 border-l-2 border-gold/60 px-5 py-4 text-left">
            <p
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
            >
              DIRECTLY FROM TIM · 親筆
            </p>
            <p className="text-bone text-[14px] sm:text-[15px] leading-relaxed mb-2">
              我寫這個引擎,是因為台灣硬核棒球迷沒有自己的 Bloomberg。玩運彩、報馬仔、LINE 老師
              用「明牌」框架對待你 —— 我們不是。這頁我親手寫,你加入,我親手回。
            </p>
            <p className="text-mute/90 text-[13px] sm:text-[14px] leading-relaxed">
              <strong className="text-bone">你不是在買明牌</strong>。引擎永遠免費,你買的是身分 +
              365 天 access + 賣分析只抽 5%(BLACK CARD 的一半)。
            </p>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mt-3 pt-3 border-t border-line/40">
              — TIM · SOLO FOUNDER · ZONE 27
            </p>
          </div>

          <div className="mt-5 sm:mt-7 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto">
            <BreakEvenCell value="55%" unit="比 BLACK CARD 整年省" en="SAVED" />
            <BreakEvenCell value="2,700" unit="NT$ /365 天" en="YEARLY" gold />
            <BreakEvenCell value="5%" unit="賣分析抽成" en="CREATOR FEE" />
          </div>
          <p className="mt-3 max-w-xl mx-auto text-mute/70 text-xs leading-relaxed text-center">
            留 email = 永久免費訂閱層,launch 後也在。想升級再升級,
            <span className="text-gold"> 我們不催</span>。
          </p>

          <a
            href="#waitlist"
            className="inline-block mt-6 sm:mt-10 font-mono text-gold text-[11px] tracking-[0.4em] hover:text-gold-soft transition-colors"
          >
            ↓ 跳到等候名單
          </a>
        </section>

        {/* ── WAITLIST FORM ──────────────────────── */}
        <section
          id="waitlist"
          className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-8 sm:pb-12 scroll-mt-20"
        >
          <ClientErrorBoundary fallbackLabel="WaitlistForm">
            <WaitlistForm waitlistCount={waitlistCount} refSource={refSource} />
          </ClientErrorBoundary>
        </section>

        {/* ── APPLY CTA ──────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12 sm:pb-16">
          <div className="border-2 border-gold/40 bg-slate/40 p-6 sm:p-8">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
            >
              ⚓ READY TO APPLY · 你已決定?
            </p>
            <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-3">
              直接申請 Founders 27 創始席位
            </h3>
            <p className="text-mute text-sm sm:text-base leading-relaxed mb-5">
              上面留 email 是免費層 + 等候名單,你可以慢慢決定。下面是直接申請表單,
              Tim 親手 review,通過後寄銀行資訊 + 轉帳窗口。
            </p>
            <Link
              href="/founders/apply"
              className="inline-block px-6 py-3 border border-gold text-gold text-xs sm:text-sm tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              申請 Founders 27 → /founders/apply
            </Link>
          </div>
        </section>

        {/* ── 你不是在買引擎(唯一一段 reframe)─────── */}
        <section
          aria-labelledby="not-buying-engine-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
        >
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
            / 你不是在買引擎
          </p>
          <h2
            id="not-buying-engine-heading"
            className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4"
          >
            引擎免費 · 永遠免費。
          </h2>
          <p className="text-mute text-center text-sm sm:text-base mb-14 max-w-xl mx-auto leading-relaxed">
            引擎你任何時候、任何方式都不用付錢。Founders 27 賣的不是工具,是 {FOUNDERS_TOTAL} 個
            fork 不走的位置。
          </p>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="border border-line/60 p-6 sm:p-7 bg-slate/30">
              <p
                lang="en"
                className="font-mono text-mute text-[10px] tracking-[0.3em] mb-5"
              >
                FREE FOREVER · 永遠免費
              </p>
              <ul className="space-y-3 text-mute text-sm leading-relaxed list-none pl-0">
                <NotBuyingItem>跑無限次 1 萬場 Monte Carlo 模擬</NotBuyingItem>
                <NotBuyingItem>押注 + 爬海選天梯</NotBuyingItem>
                <NotBuyingItem>讀完整 model report + methodology</NotBuyingItem>
                <NotBuyingItem>Fork 整個開源 codebase</NotBuyingItem>
              </ul>
              <p className="mt-6 pt-4 border-t border-line/40 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
                引擎跑在你的瀏覽器 · 我們伺服器零運算
              </p>
            </div>

            <div className="border border-gold/40 p-6 sm:p-7 bg-gold/5 glow-soft">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.3em] mb-5"
              >
                NT$ 2,700 · 一年 · 前 270 創始編號
              </p>
              <ul className="space-y-3 text-bone text-sm leading-relaxed list-none pl-0">
                <NotBuyingItem gold>
                  #001–#{FOUNDERS_TOTAL} 永久創始編號(發完即止)
                </NotBuyingItem>
                <NotBuyingItem gold>Tim 親手 onboarding + 親筆簽名</NotBuyingItem>
                <NotBuyingItem gold>賣分析只抽 5%(BLACK CARD 的一半)</NotBuyingItem>
                <NotBuyingItem gold>模型迭代提前 7 天試用</NotBuyingItem>
                <NotBuyingItem gold>恆美 × 伶 Kopi 紅茶招待(台南實體)</NotBuyingItem>
              </ul>
              <p className="mt-6 pt-4 border-t border-gold/30 font-mono text-gold text-[10px] tracking-[0.25em] leading-relaxed">
                Tim 親手 forge 每一位 · 不外包
              </p>
            </div>
          </div>

          <p
            className="mt-12 text-center text-bone text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
            style={{ textWrap: "balance" }}
          >
            工具可以被複製、被 fork、被自己 host。
            <br />
            <span className="text-gold">
              {FOUNDERS_TOTAL} 個編號 · {FOUNDERS_TOTAL} 段第一手關係 · 不能。
            </span>
          </p>
        </section>

        {/* ── 創始六大權益 ───────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20">
          <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4">
            創始六大權益
          </h2>
          <p className="font-mono text-mute text-xs tracking-[0.3em] text-center mb-16">
            THE SIX UNLOCKS
          </p>

          <div className="grid sm:grid-cols-2 auto-rows-fr gap-x-12 gap-y-14">
            {benefits.map((b) => (
              <div key={b.no} className="flex flex-col h-full">
                <p
                  lang="en"
                  className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3"
                >
                  / {b.no}
                </p>
                <h3 className="text-xl text-bone font-light tracking-tight mb-1">
                  {b.zh}
                </h3>
                <p
                  lang="en"
                  className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mb-4"
                >
                  {b.en}
                </p>
                <p className="text-mute text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 三種會員對照 ───────────────────────── */}
        <section
          aria-labelledby="tier-compare-heading"
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
        >
          <h2
            id="tier-compare-heading"
            className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4"
          >
            三種會員,一個選擇
          </h2>
          <p className="font-mono text-mute text-xs tracking-[0.3em] text-center mb-16">
            FREE · BLACK CARD · FOUNDERS 27
          </p>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-x-4 text-sm">
              <div />
              {TIERS.map((t) => (
                <div
                  key={t.name}
                  className={`text-center pb-6 ${
                    t.highlight
                      ? "bg-gold/5 -mx-2 px-2 pt-4 border-x border-gold/30"
                      : ""
                  }`}
                >
                  <p
                    className={`font-mono text-[10px] tracking-[0.3em] mb-2 ${
                      t.highlight ? "text-gold" : "text-mute"
                    }`}
                  >
                    {t.name}
                  </p>
                  <p
                    className={`text-2xl font-light tracking-tight mb-1 tabular ${
                      t.highlight ? "text-gold" : "text-bone"
                    }`}
                  >
                    {t.price}
                  </p>
                  <p className="text-mute text-[11px] leading-tight">
                    {t.priceNote}
                  </p>
                </div>
              ))}

              {COMPARE_ROWS.map((row, idx) => (
                <DesktopRowGroup
                  key={row.key}
                  row={row}
                  isLast={idx === COMPARE_ROWS.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Mobile stacked cards */}
          <div className="lg:hidden space-y-6">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`border p-6 ${
                  t.highlight
                    ? "bg-gold/5 border-gold/50 glow-soft"
                    : "bg-slate/40 border-line/60"
                }`}
              >
                <p
                  className={`font-mono text-[10px] tracking-[0.3em] mb-2 ${
                    t.highlight ? "text-gold" : "text-mute"
                  }`}
                >
                  {t.name}
                </p>
                <p
                  className={`text-3xl font-light tracking-tight mb-1 tabular ${
                    t.highlight ? "text-gold" : "text-bone"
                  }`}
                >
                  {t.price}
                </p>
                <p className="text-mute text-xs leading-tight mb-6">
                  {t.priceNote}
                </p>
                <dl className="space-y-2 text-sm">
                  {COMPARE_ROWS.map((row) => (
                    <div
                      key={row.key}
                      className="flex justify-between gap-3 border-b border-line/30 pb-2"
                    >
                      <dt className="text-mute text-[11px]">{row.label}</dt>
                      <dd
                        className={`text-right text-[11px] font-mono ${
                          t.highlight ? "text-bone" : "text-mute"
                        }`}
                      >
                        {t.rows[row.key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center font-mono text-mute text-[10px] tracking-[0.3em]">
            BLACK CARD 每 31 天手動轉帳 · 0 自動續訂 · FOUNDERS 27 每年 1/1 開放新班,定價不變
          </p>
        </section>

        {/* ── WHY NT$ 2,700(收合)───────────────── */}
        <section
          aria-labelledby="why-price-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
        >
          <details className="group">
            <summary className="cursor-pointer list-none mb-3 hover:opacity-90 transition-opacity">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3 text-center">
                / WHY NT$ 2,700
              </p>
              <h2
                id="why-price-heading"
                className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-2"
              >
                這個數字不是隨便定的{" "}
                <span
                  className="font-mono text-gold/60 text-xl group-open:rotate-45 transition-transform inline-block ml-2"
                  aria-hidden="true"
                >
                  +
                </span>
              </h2>
              <p className="text-mute text-center text-sm max-w-xl mx-auto leading-relaxed">
                點開看推導
              </p>
            </summary>

            <div className="mt-8 bg-slate/60 border border-line/70 p-6 sm:p-10 font-mono text-sm">
              <dl className="space-y-4">
                <CalcRow label="數字源" en="ORIGIN">
                  <span className="text-bone">27 × 100 — 棒球完美比賽的 27 個出局數</span>
                </CalcRow>
                <CalcRow label="5 年對照" en="5-YEAR PARITY">
                  <span className="text-mute">
                    BLACK CARD 5 年:{" "}
                    <span className="text-bone tabular">NT$ 30,000</span>
                    <span className="mx-2 text-mute/50">vs</span>
                    FOUNDERS 27 5 年:{" "}
                    <span className="text-gold tabular">NT$ 13,500</span>
                  </span>
                </CalcRow>
                <CalcRow label="等同每場攤提" en="PER GAME">
                  <span className="text-bone tabular">~ NT$ 11 / 場</span>
                  <span className="text-mute/60 ml-2">(1 年約 240 場計)</span>
                </CalcRow>
                <CalcRow label="創始編號" en="1ST EDITION" isLast>
                  <span className="text-bone">
                    前 {FOUNDERS_TOTAL} 個 · 發完即止 · 會員仍不限量
                  </span>
                </CalcRow>
              </dl>
            </div>

            <p className="mt-10 text-center text-mute text-sm max-w-xl mx-auto leading-relaxed">
              不是優惠期、不是早鳥折扣 — 是這個價格的真實成本,每年 1/1 可優先續訂。
            </p>
          </details>
        </section>

        {/* ── NT$ 2,700 不會給你 ─────────────────── */}
        <section
          aria-labelledby="dollar-didnt-buy-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 sm:py-20 border-t border-line/40"
        >
          <p
            lang="en"
            className="font-mono text-loss/85 text-[10px] tracking-[0.4em] mb-6 text-center"
          >
            ✕ / WHAT NT$ 2,700 DOESN&apos;T BUY
          </p>
          <h2
            id="dollar-didnt-buy-heading"
            className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-10"
          >
            NT$ 2,700 不會給你
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {DOLLAR_DIDNT_BUY.map((item, i) => (
              <div key={i} className="border border-loss/30 bg-slate/30 p-4 sm:p-5">
                <p
                  lang="en"
                  className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2"
                >
                  ✕ {item.what}
                </p>
                <p className="text-mute text-[13px] leading-relaxed">{item.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ(收合)─────────────────────────── */}
        <section
          aria-labelledby="inline-faq-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
        >
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
            / BEFORE YOU JOIN
          </p>
          <h2
            id="inline-faq-heading"
            className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-12"
          >
            你應該問的問題
          </h2>

          <div className="space-y-3">
            {INLINE_FAQ.slice(0, 3).map((item, idx) => (
              <details
                key={`top-${idx}`}
                className="group bg-slate/40 border border-line/60 open:border-gold/40 transition-colors"
              >
                <summary className="cursor-pointer list-none px-6 py-5 flex items-start justify-between gap-4 hover:bg-slate/60 transition-colors">
                  <span className="text-bone text-base leading-snug flex-1">
                    {item.q}
                  </span>
                  <span
                    className="font-mono text-gold/60 text-xs tracking-[0.2em] group-open:rotate-45 transition-transform shrink-0 mt-1"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-1 text-mute text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <details className="mt-4 group">
            <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 border border-line/40 bg-slate/20 hover:bg-slate/40 transition-colors">
              <span className="font-mono text-mute text-[11px] tracking-[0.3em] group-open:text-gold transition-colors">
                + 更多 {INLINE_FAQ.length - 3} 個問題(轉帳 · 退款 · 轉送)
              </span>
              <span
                className="font-mono text-gold/60 text-xs tracking-[0.2em] group-open:rotate-45 transition-transform shrink-0"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="mt-3 space-y-3">
              {INLINE_FAQ.slice(3).map((item, idx) => (
                <details
                  key={`more-${idx}`}
                  className="group/inner bg-slate/40 border border-line/60 open:border-gold/40 transition-colors"
                >
                  <summary className="cursor-pointer list-none px-6 py-5 flex items-start justify-between gap-4 hover:bg-slate/60 transition-colors">
                    <span className="text-bone text-base leading-snug flex-1">
                      {item.q}
                    </span>
                    <span
                      className="font-mono text-gold/60 text-xs tracking-[0.2em] group-open/inner:rotate-45 transition-transform shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-1 text-mute text-sm leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </details>

          <p className="mt-10 text-center font-mono text-mute text-[10px] tracking-[0.3em]">
            完整問答在{" "}
            <Link href="/faq" className="text-gold hover:underline">
              /faq
            </Link>
          </p>
        </section>

        {/* ── FINAL CTA ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            ONE NUMBER. FIRST EDITION.
          </p>
          <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
            前 270 個創始編號發完,1st Edition 永遠關閉。
          </h3>
          <p className="mt-6 text-mute max-w-md mx-auto text-sm leading-relaxed">
            現在加入等候名單,在正式開放預訂時擁有第一順位。
          </p>
          <Link
            href="#waitlist"
            className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
          >
            ↑ 加入等候名單
          </Link>

          <div className="mt-10 pt-8 border-t border-line/40 flex items-center justify-center">
            <CopyLinkButton />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function DesktopRowGroup({
  row,
  isLast,
}: {
  row: (typeof COMPARE_ROWS)[number];
  isLast: boolean;
}) {
  return (
    <>
      <div
        className={`flex flex-col justify-center py-4 ${
          isLast ? "" : "border-b border-line/30"
        }`}
      >
        <p className="text-bone text-sm leading-tight">{row.label}</p>
        <p className="font-mono text-mute text-[9px] tracking-[0.25em] mt-1">
          {row.en}
        </p>
      </div>
      {TIERS.map((t) => (
        <div
          key={t.name}
          className={`flex items-center justify-center text-center py-4 font-mono text-[12px] ${
            isLast ? "" : "border-b border-line/30"
          } ${
            t.highlight
              ? "bg-gold/5 -mx-2 px-2 border-x border-gold/30 text-bone"
              : "text-mute"
          }`}
        >
          {t.rows[row.key]}
        </div>
      ))}
    </>
  );
}

function NotBuyingItem({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-3">
      <span
        aria-hidden="true"
        className={`font-mono text-[10px] tracking-[0.2em] shrink-0 ${
          gold ? "text-gold" : "text-mute/60"
        }`}
      >
        ▸
      </span>
      <span className="flex-1">{children}</span>
    </li>
  );
}

function CalcRow({
  label,
  en,
  children,
  isLast,
}: {
  label: string;
  en: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 ${
        isLast ? "" : "border-b border-line/40 pb-4"
      }`}
    >
      <div className="shrink-0 sm:w-44">
        <p className="text-mute text-[11px]">{label}</p>
        <p className="font-mono text-mute text-[9px] tracking-[0.25em] mt-0.5">
          {en}
        </p>
      </div>
      <div className="text-right flex-1">{children}</div>
    </div>
  );
}

function BreakEvenCell({
  value,
  unit,
  en,
  gold = false,
}: {
  value: string;
  unit: string;
  en: string;
  gold?: boolean;
}) {
  return (
    <div
      className={`text-center p-3 sm:p-4 border ${
        gold ? "border-gold/50 bg-gold/5" : "border-line/60 bg-slate/30"
      }`}
    >
      <p
        className={`font-mono tabular tracking-tight text-2xl sm:text-3xl font-light leading-none ${
          gold ? "text-gold" : "text-bone"
        }`}
      >
        {value}
      </p>
      <p
        className={`text-[10px] sm:text-[11px] tracking-tight leading-tight mt-1.5 ${
          gold ? "text-gold/80" : "text-mute"
        }`}
      >
        {unit}
      </p>
      <p
        lang="en"
        className={`font-mono text-[8px] sm:text-[9px] tracking-[0.2em] leading-tight mt-1 ${
          gold ? "text-gold/60" : "text-mute/60"
        }`}
      >
        {en}
      </p>
    </div>
  );
}
