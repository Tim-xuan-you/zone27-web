import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import CopyLinkButton from "@/components/CopyLinkButton";
import { FOUNDERS_TOTAL, formatBadge } from "@/lib/founders-stats";
import { getWaitlistCount } from "@/lib/waitlist-stats";

export const metadata: Metadata = {
  title: "Founders 27 · NT$ 2,700 終身會員 · 限量 270 名",
  description:
    "ZONE 27 創始會員資格 · 一次付清 NT$ 2,700,終身免費 · 270 名額滿即永久關閉,不會有第二批 · 5.4 個月達損益平衡,之後每年省下 NT$ 5,988。",
};

// Re-fetch waitlist count every 60 seconds (ISR). Visitors see a number
// that's never older than ~1 minute without the page becoming dynamic.
export const revalidate = 60;

const benefits = [
  {
    no: "01",
    zh: "終身會員資格",
    en: "LIFETIME ACCESS",
    body: "一次性 NT$ 2,700,永久解鎖未來所有功能。BLACK CARD 月費 NT$ 499 對您完全免費,終身。",
  },
  {
    no: "02",
    zh: "鑲金編號徽章",
    en: "NUMBERED BADGE · #001-#270",
    body: "個人 ID 永久鑲入創始編號徽章,在動態牆、明牌、聊天室都會顯示。是身分,也是勳章。",
  },
  {
    no: "03",
    zh: "創作者零抽成",
    en: "0% PLATFORM FEE",
    body: "如果您也是預測創作者,賣明牌 100% 全拿。一般黑金會員平台仍抽 5% — 您完全不抽。",
  },
  {
    no: "04",
    zh: "BOTTOM 27 共生",
    en: "ECOSYSTEM CROSS-PASS",
    body: "未來 BOTTOM 27 棒球手遊上線,自動空投創始限定球員卡、稀有球場代幣、終身贊助商徽章。",
  },
  {
    no: "05",
    zh: "AI 模型優先試用",
    en: "PRIORITY PREVIEW",
    body: "每一次 AI 模型迭代(打席矩陣升級、新球種變數)創始會員提前 7 天試用,並可投票決定下一步迭代方向。",
  },
  {
    no: "06",
    zh: "實體尊榮招待",
    en: "PREMIUM HOSPITALITY",
    body: "出示創始會員 QR Code 至恆美攝影 × 伶 Kopi 旗艦店,免費招待一杯冰鎮頂級一品紅茶。終身有效。",
  },
];

// ── Tier comparison data — single source for the comparison table
// Tier definitions live in CLAUDE.md (商業模式定錨).
const TIERS = [
  {
    name: "FREE",
    zh: "自由訪客",
    price: "NT$ 0",
    priceNote: "永久免費",
    highlight: false,
    rows: {
      data: "基本(可看)",
      participate: "—",
      fee: "—",
      badge: "—",
      bottom27: "—",
      preview: "—",
      hospitality: "—",
      cap: "無限",
    },
  },
  {
    name: "BLACK CARD",
    zh: "黑金月費",
    price: "NT$ 499",
    priceNote: "每月 · 預計 2026 Q3 上線",
    highlight: false,
    rows: {
      data: "完整",
      participate: "✓",
      fee: "創作者抽 5%",
      badge: "—",
      bottom27: "—",
      preview: "—",
      hospitality: "—",
      cap: "無限",
    },
  },
  {
    name: "FOUNDERS 27",
    zh: "創始會員",
    price: "NT$ 2,700",
    priceNote: "一次性 · 終身 · 不再開放",
    highlight: true,
    rows: {
      data: "完整 + 優先試用",
      participate: "✓",
      fee: "創作者抽 0%",
      badge: "✓ #001-#270",
      bottom27: "✓",
      preview: "✓ 7 天",
      hospitality: "✓",
      cap: "270 · 永遠關閉",
    },
  },
] as const;

const COMPARE_ROWS = [
  { key: "data", label: "數據存取", en: "DATA" },
  { key: "participate", label: "參與預測", en: "PARTICIPATE" },
  { key: "fee", label: "創作者抽成", en: "CREATOR FEE" },
  { key: "badge", label: "編號徽章", en: "BADGE" },
  { key: "bottom27", label: "BOTTOM 27 空投", en: "AIRDROP" },
  { key: "preview", label: "AI 模型優先試用", en: "MODEL PREVIEW" },
  { key: "hospitality", label: "實體招待", en: "HOSPITALITY" },
  { key: "cap", label: "名額", en: "CAP" },
] as const;

// ── Inline FAQ — top 3 objections, answered here so visitors
// don't have to navigate to /faq to overcome them.
const INLINE_FAQ = [
  {
    q: "我怎麼知道這不是 vaporware?",
    a: "原始碼公開在 GitHub(連結在 footer)。蒙地卡羅引擎已經在 /lab 跑得到,您可以親自跑 10,000 次模擬看收斂過程。版本紀錄在 /changelog 從 v0.1 到 v0.27 都看得到 — 每一個版本都是真的上線。",
  },
  {
    q: "等候名單階段就要付錢嗎?",
    a: "不收費、不綁定、隨時可退出。等候名單只是先記下您的 email,正式開放預訂時優先通知。真正付款的階段預計 2026 Q3 才開始,而且會有 14 天無條件退款保證。",
  },
  {
    q: "這是博彩平台嗎?",
    a: "不是。ZONE 27 計算的是機率分布,從不販售「鐵口直斷」。我們不接受運彩抽成、不寄生報馬仔生態、不買廣告投放。商業模式是會員制(BLACK CARD 月費 + Founders 27 一次性)+ 未來 Premium Sponsor。詳見 /about /faq。",
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
      {/* ── HERO ─────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.4em]">
          <span className="text-gold">FOUNDERS · 27</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            PRE-LAUNCH WAITLIST
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          僅限
          <span className="text-gold mx-3 tabular">{FOUNDERS_TOTAL}</span>
          位
          <br />
          創始會員。
        </h1>

        <p
          lang="en"
          className="font-mono text-mute text-sm tracking-[0.3em] mt-8"
        >
          NT$ 2,700 · ONE-TIME · LIFETIME · NEVER REOPENS
        </p>

        {/* Break-even math line — research-backed LTD trust signal.
            「5.4 個月損益平衡」是 2026 LTD 文案最常被引用的轉換句型。 */}
        <p className="mt-6 max-w-xl mx-auto text-bone text-sm leading-relaxed">
          與 BLACK CARD 月費 NT$ 499 比較,
          <span className="font-mono text-gold tabular mx-1">5.4</span>
          個月即達損益平衡 ·
          之後每年省下{" "}
          <span className="font-mono text-gold tabular">NT$ 5,988</span>
        </p>
        <p
          lang="en"
          className="mt-2 font-mono text-mute text-[10px] tracking-[0.3em]"
        >
          NO AUTO-RENEW · NO HIDDEN FEES · NEVER REOPENS
        </p>

        <p className="mt-10 max-w-xl mx-auto text-mute leading-relaxed">
          這 {FOUNDERS_TOTAL} 個編號將是 ZONE 27 永遠的傳教士。
          <br />
          一次入會,終身免費。售完即永久關閉,不會有第二批。
        </p>
        <p className="mt-4 max-w-xl mx-auto text-mute/70 text-sm leading-relaxed">
          付款系統預計 2026 Q3 開放。先加入等候名單,優先取得購買權。
        </p>
      </section>

      {/* ── FROM THE FOUNDER ──────────────
          Excerpted closing line from /about Chapter 5 (Tim's voice).
          Placement above waitlist form is research-backed (Saaspo 2026 LTD
          founder-letter section pattern). 1px gold/20 border + uppercase
          mono label is the high-trust premium SaaS convention. */}
      <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-10">
        <div className="border border-gold/20 p-6 sm:p-8">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-5"
          >
            FROM THE FOUNDER · 親筆說明
          </p>
          <blockquote className="text-bone text-lg sm:text-xl font-light leading-snug">
            ZONE 27 是我給這群人 —— 包括我自己 —— 的一封情書。
          </blockquote>
          <div className="mt-6 flex items-baseline justify-between gap-4 flex-wrap pt-5 border-t border-line/40">
            <p className="font-mono text-mute text-[10px] tracking-[0.3em]">
              — TIM · FOUNDER · CPBL 球迷 27 年
            </p>
            <Link
              href="/about"
              className="font-mono text-gold/70 text-[10px] tracking-[0.3em] hover:text-gold transition-colors"
            >
              讀完整創辦人筆記 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WAITLIST FORM ───────────────── */}
      <section
        id="waitlist"
        className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-20 scroll-mt-20"
      >
        <WaitlistForm waitlistCount={waitlistCount} refSource={refSource} />
      </section>

      {/* ── BENEFITS GRID ────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20">
        <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4">
          創始六大權益
        </h2>
        <p className="font-mono text-mute text-xs tracking-[0.3em] text-center mb-16">
          THE SIX UNLOCKS
        </p>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-14">
          {benefits.map((b) => (
            <div key={b.no}>
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

      {/* ── TIER COMPARISON ───────────────── */}
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

        {/* Desktop: 4-column comparison grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-x-4 text-sm">
            {/* Header row */}
            <div />
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`text-center pb-6 ${
                  t.highlight ? "bg-gold/5 -mx-2 px-2 pt-4 border-x border-gold/30" : ""
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

            {/* Data rows */}
            {COMPARE_ROWS.map((row, idx) => (
              <DesktopRowGroup
                key={row.key}
                row={row}
                isLast={idx === COMPARE_ROWS.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Mobile: 3 stacked cards */}
        <div className="md:hidden space-y-6">
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
          BLACK CARD 月費為預計上線(2026 Q3),價格可能微調 · FOUNDERS 27 為終身定價,不再變動
        </p>
      </section>

      {/* ── WHY THIS PRICE ─────────────────── */}
      <section
        aria-labelledby="why-price-heading"
        className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
          / WHY NT$ 2,700
        </p>
        <h2
          id="why-price-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4"
        >
          這個數字不是隨便定的。
        </h2>
        <p className="text-mute text-center text-sm mb-12 max-w-xl mx-auto leading-relaxed">
          也不是「先把價格設高、再打七折」的常見手法。
        </p>

        <div className="bg-slate/60 border border-line/70 p-6 sm:p-10 font-mono text-sm">
          <dl className="space-y-4">
            <CalcRow label="數字源" en="ORIGIN">
              <span className="text-bone">
                27 × 100 — 棒球完美比賽的 27 個出局數
              </span>
            </CalcRow>

            <CalcRow label="對標" en="ANCHOR">
              <span className="text-mute">
                BLACK CARD 月費{" "}
                <span className="text-bone tabular">NT$ 499</span> /月
              </span>
            </CalcRow>

            <CalcRow label="5 年訂閱對照" en="5-YEAR PARITY">
              <span className="text-mute">
                BLACK CARD:{" "}
                <span className="text-bone tabular">NT$ 29,940</span>
                <span className="mx-2 text-mute/50">vs</span>
                FOUNDERS 27:{" "}
                <span className="text-gold tabular">NT$ 2,700</span>
              </span>
            </CalcRow>

            <CalcRow label="等同月費攤提" en="EFFECTIVE MO. RATE">
              <span className="text-bone tabular">~ NT$ 45 / 月</span>
              <span className="text-mute/60 ml-2">(以 5 年計)</span>
            </CalcRow>

            <CalcRow label="創作者抽成節省" en="CREATOR FEE">
              <span className="text-mute">
                BLACK CARD 5% <span className="mx-2 text-mute/50">→</span>{" "}
                <span className="text-gold">0%</span>
              </span>
            </CalcRow>

            <CalcRow label="名額" en="CAP" isLast>
              <span className="text-bone">
                {FOUNDERS_TOTAL} 名 · 永遠關閉(沒有第二批)
              </span>
            </CalcRow>
          </dl>
        </div>

        <p className="mt-10 text-center text-mute text-sm max-w-xl mx-auto leading-relaxed">
          一次付完,終身屬於您
          <span className="text-gold tabular mx-1">{FOUNDERS_TOTAL}</span>
          個編號之一。
          <br />
          不是優惠期、不是早鳥折扣 — 是這 270 個位置的真實成本。
        </p>
      </section>

      {/* ── INLINE FAQ (top 3 objections) ────── */}
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
          三個您應該問的問題
        </h2>

        <div className="space-y-3">
          {INLINE_FAQ.map((item, idx) => (
            <details
              key={idx}
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

        <p className="mt-10 text-center font-mono text-mute text-[10px] tracking-[0.3em]">
          完整 12 題詳細問答在{" "}
          <Link href="/faq" className="text-gold hover:underline">
            /faq
          </Link>
        </p>
      </section>

      {/* ── FINAL CTA ────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 text-center border-t border-line/40">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
        >
          ONE NUMBER. ONE LIFETIME.
        </p>
        <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          當 {formatBadge(FOUNDERS_TOTAL)} 被認領,這扇門將永遠關閉。
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
        <Link
          href="/about"
          className="block mt-6 font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
        >
          閱讀完整品牌方法論 →
        </Link>

        {/* ── Share this offer · private-DM lever ── */}
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
