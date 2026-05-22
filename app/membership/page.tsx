import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import RelatedReading from "@/components/RelatedReading";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";
import { getWaitlistCount } from "@/lib/waitlist-stats";

export const metadata: Metadata = {
  title: "ZONE 27 會員制 · 4 層 ladder · 匿名 / 免費 / BLACK CARD / Founders 27",
  description:
    "ZONE 27 4-tier membership ladder · 從匿名免費到 NT$ 2,700 終身 · 任時自由升級或永遠停在當前層 · 我們不催。創作者發文與推薦賽事的權限對照亦在此頁。",
};

// R40 perf agent finding · /membership pulls from static lib/founders-
// stats.ts not live API · 60s ISR overhead 不必要 · 3600s(1hr)fallback
// cache only · git push 觸發 redeploy on data change · 同 /founders pattern。
export const revalidate = 3600;

// ── ZONE 27 · /membership — 4-Tier Ladder Overview ──────
// Tim 直擊:「我就只看到加入創始會員的頁面 · 哪裡可以加入一般會員?」
// Round 21-24 在 /founders 加 FREE TIER 內容 · Round 23 把 Nav 改
// 「會員」 · 但 /founders 視覺上仍 95% 是 Founders 27 scarcity sales。
// 一般會員需要獨立頁面入口。
//
// 本頁分工 · 跟 /founders 形成互補:
//   /membership = ladder 全景 · 4 個 tier 平等視覺權重 · 從免費到 NT$ 2,700
//   /founders   = Founders 27 deep dive · 270 限量 · NT$ 2,700 終身銷售頁
//
// Nav「會員」pill → /membership(inclusive 入口)
// Mobile sticky CTA + 首頁 pill → /founders(paid-focused conversion)
// 兩條路徑各自服務不同 stage 的訪客 · 無衝突。
// ─────────────────────────────────────────────────────

type Tier = {
  name: string;
  en: string;
  price: string;
  priceNote: string;
  desc: string;
  perks: string[];
  cta: { label: string; href: string } | null;
  highlight: boolean;
};

const TIERS: Tier[] = [
  {
    name: "匿名訪客",
    en: "ANONYMOUS",
    price: "NT$ 0",
    priceNote: "不留 email",
    desc: "您現在就是這層。全引擎可跑 · 全 trust artifact 公開。我們不知道您是誰 · 也不追蹤您。",
    perks: [
      "/lab 跑 10K Monte Carlo 無限次",
      "/track-record + /audit + /methodology 全可讀",
      "GitHub 開源可 fork",
      "完全匿名 · 0 trackers",
    ],
    cta: null,
    highlight: false,
  },
  {
    name: "免費訂閱",
    en: "FREE TIER",
    price: "NT$ 0",
    priceNote: "留 email · 永久免費",
    desc: "1 個動作 · 加入 ZONE 27 通知圈。模型重要迭代第一波知道 · Founders 27 預售開放時優先取得購買權。Stratechery / Plausible / Substack 同 model。",
    perks: [
      "模型重要迭代通知",
      "/track-record 重大 entry 提醒(N=30 統計門檻等)",
      "Founders 27 預售開放時優先通知",
      "不寄行銷信 · 不轉售 · 隨時 reply UNSUBSCRIBE 退出",
    ],
    cta: { label: "→ 立即免費註冊 · 30 秒", href: "/login" },
    highlight: true,
  },
  {
    name: "BLACK CARD",
    en: "BLACK CARD",
    price: "NT$ 299",
    priceNote: "每月 · 預計 2026 Q3 開放",
    desc: "黑金訂閱會員。可發文 · 可推薦賽事 · 創作者抽成 5%(vs 業界 LINE 老師平台 30-50% 是降維打擊)。",
    perks: [
      "可在賽事頁討論室發言 / 分享預測(球迷 grammar 「明牌」 · 不導向莊家 · 見 #pick-vs-bet)",
      "創作者抽成 5%",
      "每月 voting 影響引擎迭代方向",
      "Founders 27 LINE 群 access",
      "每週 Tim 工程筆記 full 版",
    ],
    cta: { label: "→ 看 BLACK CARD UI preview", href: "/membership/black-card" },
    highlight: false,
  },
  {
    name: "Founders 27",
    en: "FOUNDERS 27",
    price: "NT$ 2,700",
    priceNote: "一次 · 終身 · 限量 270",
    desc: "創始終身會員。270 個編號 · 永遠關閉 · 不再開放。BLACK CARD 全 access + 創作者抽成 0%(終身)+ 編號 #001-#270 鑲入身分。",
    perks: [
      "BLACK CARD 全 access · 終身免費",
      "創作者抽成 0%(永遠 · vs BLACK CARD 5%)",
      "編號 #001-#270 永久 identity",
      "模型迭代提前 7 天試用 + voting",
      "BOTTOM 27 早鳥獨家虛擬資產",
      "恆美 × 伶 Kopi 紅茶招待 QR(台南)",
    ],
    cta: { label: "→ Founders 27 詳情頁", href: "/founders" },
    highlight: false,
  },
];

const TIER_BORDER = {
  highlight: "border-gold/50 bg-gold/5",
  normal: "border-line/60 bg-slate/30",
} as const;

export default async function MembershipPage({
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
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8"
          >
            / MEMBERSHIP · ZONE 27 · 4-TIER LADDER
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
            ZONE 27 <span className="text-gold">會員制</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-mute text-base leading-relaxed">
            4 層 ladder · 從匿名免費到 NT$ 2,700 終身 ·
            <span className="text-bone"> 任時自由升級</span>
            {" · "}
            <span className="text-gold">永遠停在當前層也可以 · 我們不催</span>。
          </p>
          <p className="mt-4 max-w-2xl mx-auto font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ANONYMOUS · FREE TIER · BLACK CARD · FOUNDERS 27
            <span className="block mt-1">
              Stratechery / Plausible / Substack 同 4-tier model · 已寫死在{" "}
              <Link
                href="/manifesto"
                className="text-gold underline-offset-4 hover:underline"
              >
                /manifesto Section II MONETIZATION
              </Link>
            </span>
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── Round 30 Wave 11b · DELETED MEMBER SYSTEM MAP ──
            Agent deepest call「every section must be true right now」+
            Merge #2 logic:MAP block(W4)was answer hub when /admin /member
            /member/calibration /member/submit 都還沒 真實 ship。 現在 W5
            /login · W6 follow · W9 note · W10 submit + personal mirror 全部
            shipped real flows · MAP 變 meta-documentation noise · 砍。
            Conversion path 仍清晰:visitor 看 4-tier cards 直接點 · 不需
            second-pass MAP digest。 */}

        {/* ── 4-TIER CARDS · 唯一 hero 後第一個 conversion 元件 ── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {TIERS.map((t) => (
              <TierCard key={t.en} tier={t} />
            ))}
          </div>
          <p className="mt-8 text-center font-mono text-mute/70 text-[10px] tracking-[0.3em]">
            FREE TIER + Founders 27 預售 = 同 1 個 email 動作(下方表單)
          </p>
        </section>

        {/* ── WAITLIST FORM(也是 FREE TIER 入口) ── */}
        <section
          id="waitlist"
          className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12 sm:pb-16 scroll-mt-20"
        >
          <WaitlistForm waitlistCount={waitlistCount} refSource={refSource} />
        </section>

        {/* ── Creator Permissions · Wave 11b COMPRESSED ──
            Agent Cut #3:edge-case copy on top-of-funnel page · 砍 4 PermissionRow
            的 100+ word paragraph 各 · 變 4-line compact table · 同 info 1/5
            字數。 H2 + 「Tim 反覆被問」 intro 刪。 完整 inversion logic 連回
            /manifesto + /coverage。 */}
        <section
          id="creator-permissions"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6 text-center"
          >
            / CREATOR PERMISSIONS · 一般會員可以發文嗎?
          </p>
          <div className="space-y-2 font-mono text-sm leading-relaxed max-w-2xl mx-auto">
            <PermLine
              tier="匿名 / FREE TIER"
              status="❌"
              detail="無法發文 · 防 LINE 老師(玩運彩 / 報馬仔 生態)"
            />
            <PermLine
              tier="BLACK CARD · Q3+"
              status="✅ 5%"
              detail="可發文 / 推薦 · 5% 抽成(業界 30-50% 降維)"
            />
            <PermLine
              tier="Founders 27 · 預售中"
              status="✅ 0%"
              detail="BLACK CARD 全權限 + 0% 抽成終身"
            />
            <PermLine
              tier="FREE TIER 投稿"
              status="⏳"
              detail="Tim curate 1/週(/member/submit · W10 已 ship)"
            />
          </div>
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed text-center">
            完整 4 個 inversion 邏輯見{" "}
            <Link
              href="/manifesto"
              className="text-gold underline-offset-4 hover:underline"
            >
              /manifesto
            </Link>
            {" · "}
            <Link
              href="/coverage"
              className="text-gold underline-offset-4 hover:underline"
            >
              /coverage NEVER list
            </Link>
          </p>
        </section>

        {/* ── 「明牌」vs「博彩」disclosure · Round 31 Wave G A15 critic patch ──
            Critic agent surface:「『賣明牌』本身就是博彩附屬詞 · 你又說不接受
            下注 — 創作者賣明牌賣給誰?不就是賭客?那你跟博彩劃線劃假的?」
            主動 surface 這個 brand 一致性裂縫 · 不藏 = 不能被一句拆穿。 */}
        <section
          id="pick-vs-bet"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6 text-center"
          >
            / 「明牌」vs 「博彩」 · BRAND BOUNDARY
          </p>
          <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-5 text-center max-w-2xl mx-auto">
            為什麼 BLACK CARD perks 出現「明牌」這個詞 · 我們仍跟博彩劃線?
          </h3>
          <div className="space-y-4 text-mute text-sm leading-relaxed max-w-2xl mx-auto">
            <p>
              <strong className="text-bone">「明牌」</strong>在 CPBL 球迷 LINE 群 · Dcard ·
              玩運彩 forum 是<strong className="text-bone">球迷之間 share 預測</strong>的
              native 詞 — 「我覺得今晚富邦 60%」這種對話。 ZONE 27 沿用此詞因為
              audience 用此詞 · 不另造新詞。
            </p>
            <p>
              我們<strong className="text-bone">不</strong>連接莊家 · <strong className="text-bone">不</strong>
              處理賠率 · <strong className="text-bone">不</strong>抽下注佣金。 BLACK CARD 5% / Founders 27 0%
              抽的是<strong className="text-bone">會員之間預測訂閱費</strong>,不是賭客下注佣金。
            </p>
            <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
              對齊 brand IP「不接受下注 · 跟博彩劃線」+ /coverage NEVER list
              (玩運彩 · 報馬仔 · LINE 老師平台都在 NEVER 上)。 完整 inversion 邏輯見{" "}
              <Link href="/manifesto" className="text-gold hover:underline underline-offset-4">
                /manifesto
              </Link>
              {" · "}
              <Link href="/coverage" className="text-gold hover:underline underline-offset-4">
                /coverage
              </Link>
              。
            </p>
          </div>
        </section>

        {/* ── FOUNDERS 27 DEEP DIVE CROSS-LINK ──── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12 text-center">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / FOUNDERS 27 · DEEP DIVE
          </p>
          <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4">
            想看 Founders 27 完整銷售頁?
          </h3>
          <p className="text-mute text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            <span className="font-mono text-gold tabular">{FOUNDERS_REMAINING}</span>{" "}
            席剩 · 共 {FOUNDERS_TOTAL} 名 · NEXT IS{" "}
            <span className="font-mono text-gold tabular">{formatBadge(FOUNDERS_NEXT)}</span>。
            6 大權益 + 9 個月 break-even · 完整定價邏輯 · 三層 tier 比較表 · INLINE FAQ。
          </p>
          <Link
            href="/founders"
            className="inline-block px-10 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            → Founders 27 詳情頁
          </Link>
        </section>

        <RelatedReading currentPath="/membership" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回首頁
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function TierCard({ tier }: { tier: Tier }) {
  const border = tier.highlight ? TIER_BORDER.highlight : TIER_BORDER.normal;
  const priceColor = tier.highlight ? "text-gold" : "text-bone";
  const nameColor = tier.highlight ? "text-gold" : "text-bone";

  return (
    <div
      className={`p-5 sm:p-6 border ${border} flex flex-col h-full ${
        tier.highlight ? "glow-soft" : ""
      }`}
    >
      <p
        lang="en"
        className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1"
      >
        / {tier.en}
      </p>
      <h3
        className={`text-lg sm:text-xl font-light tracking-tight mb-3 ${nameColor}`}
      >
        {tier.name}
      </h3>
      <p
        className={`font-mono tabular text-xl sm:text-2xl font-light leading-none mb-1 ${priceColor}`}
      >
        {tier.price}
      </p>
      <p className="font-mono text-mute text-[10px] tracking-[0.2em] mb-4">
        {tier.priceNote}
      </p>
      {/* Round 52 W-A · Agent 2 #2 fix · 4-tier card desc text-xs sm:text-sm
          無 height constraint · 414px viewport 字數差異(40-60 chars 各 tier)
          造成 vertical rhythm 不齊 · 撞 perks list · 修 min-h-[4.5rem] 確保
          所有 tier card desc 同高 · perks list 對齊 baseline。 */}
      <p className="text-mute text-xs sm:text-sm leading-relaxed mb-4 flex-grow min-h-[4.5rem]">
        {tier.desc}
      </p>
      <ul className="space-y-1.5 mb-5 text-xs leading-relaxed list-none pl-0">
        {tier.perks.map((perk, i) => (
          <li key={i} className="flex items-baseline gap-2">
            <span
              aria-hidden="true"
              className={`font-mono text-[9px] tracking-[0.2em] shrink-0 ${
                tier.highlight ? "text-gold" : "text-mute/60"
              }`}
            >
              ▸
            </span>
            <span className="flex-1 text-mute/90">{perk}</span>
          </li>
        ))}
      </ul>
      {tier.cta && (
        <Link
          href={tier.cta.href}
          className={`mt-auto inline-block text-center px-4 py-2.5 font-mono text-[10px] tracking-[0.3em] transition-colors ${
            tier.highlight
              ? "bg-gold text-navy hover:bg-gold-soft"
              : "border border-gold/40 text-gold hover:bg-gold/5 hover:border-gold/70"
          }`}
        >
          {tier.cta.label}
        </Link>
      )}
      {!tier.cta && (
        <p className="mt-auto text-center font-mono text-mute/60 text-[10px] tracking-[0.3em] py-2.5">
          您現在就是這層
        </p>
      )}
    </div>
  );
}

// Round 30 Wave 11b · PermLine · compact replacement for PermissionRow ·
// 3-col grid · tier label + status chip + 1-line detail · 4-paragraph
// PermissionRow 砍到 1-line PermLine。
function PermLine({
  tier,
  status,
  detail,
}: {
  tier: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="grid grid-cols-[auto_auto_1fr] gap-3 sm:gap-4 items-baseline border-l-2 border-gold/30 pl-4 py-1.5">
      <span className="text-bone text-[11px] sm:text-xs tracking-[0.15em] whitespace-nowrap">
        {tier}
      </span>
      <span className="text-gold text-[11px] sm:text-xs tracking-[0.2em] tabular whitespace-nowrap">
        {status}
      </span>
      <span className="text-mute text-xs sm:text-sm leading-snug">
        {detail}
      </span>
    </div>
  );
}
