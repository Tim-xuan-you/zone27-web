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

// Re-fetch waitlist count every 60s (matches /founders cadence).
export const revalidate = 60;

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
    cta: { label: "↓ 加入 FREE TIER", href: "#waitlist" },
    highlight: true,
  },
  {
    name: "BLACK CARD",
    en: "BLACK CARD",
    price: "NT$ 499",
    priceNote: "每月 · 預計 2026 Q3 開放",
    desc: "黑金訂閱會員。可發文 · 可推薦賽事 · 創作者抽成 5%(vs 業界 LINE 老師平台 30-50% 是降維打擊)。",
    perks: [
      "可在賽事頁討論室發言 / 賣明牌",
      "創作者抽成 5%",
      "每月 voting 影響引擎迭代方向",
      "Founders 27 LINE 群 access",
      "每週 Tim 工程筆記 full 版",
    ],
    cta: { label: "Q3 通知我 → 加入 FREE TIER", href: "#waitlist" },
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

        {/* ── MEMBER SYSTEM MAP · Round 30 Wave 4 ───────
            Tim 第 2 次同 prompt(R29 W2 已 ship /member + /admin · Tim
            訪客第一眼看不到答案聚合)= Pratfall canary fire · 不 over-
            defend「我已 ship」 · 把 4 個 reflexive question 做成 single
            visible MAP block · 放在訪客 hero 下第一眼可見處 · 不用滾。
            Each Q: verdict band + body + direct anchor link · 答案散在
            /membership Creator Permissions / /member / /member/
            calibration / /admin · MAP 是 single source of truth · 不重
            複內容 · 純導航。 Brand pure:gold-bordered slate panel ·
            mono kicker · pratfall-safe(承認 4 個 reflexive Q 反覆被問
            是 brand acknowledgment 不是 noise)。 */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
          <div className="bg-slate/40 border border-gold/40 p-6 sm:p-10">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.45em]"
              >
                / MEMBER SYSTEM MAP · 4 個反覆被問的問題
              </p>
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em]">
                Round 30 W4 · single answer hub
              </p>
            </div>
            <p className="text-mute/80 text-sm leading-relaxed mb-8 max-w-3xl">
              Tim 反覆被訪客 + 自己問:現在能加入嗎?在哪發文?Tim 管理介面在哪?
              心理學角度做什麼?答案散在 4-5 個頁面 · 這個 MAP 是 single
              answer hub · 每個 Q 附 verdict + 直接 anchor。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <MapRow
                question="Q1 · 一般會員現在能加入嗎? 為什麼要等 Q3?"
                verdict="✓ 現在 magic link 註冊 · 不再是 email 預訂"
                verdictTone="gold"
                body="Round 30 W5(2026-05-21)ship Phase 1 magic link auth · 從 Q3 promise 加速到 NOW。 /login 輸入 email · 1 分鐘內收到 magic link · 點開後您 session 啟用 · /member 變您真實 dashboard(不是 preview)· 終身免費 · 永不調漲。 純訂閱通知 email 不要 session 的也可以走老路徑 #waitlist。"
                ctas={[
                  { label: "→ /login · magic link 註冊", href: "/login" },
                  { label: "↓ 純訂閱通知 email", href: "#waitlist" },
                ]}
              />
              <MapRow
                question="Q2 · 會員在哪裡發文 + 推薦賽事?"
                verdict="⏳ BLACK CARD Q3 · Founders 27 預售中"
                verdictTone="bone"
                body="FREE TIER ❌ 無法發文(防 LINE 老師 archetype · 玩運彩 / 報馬仔 生態 manual gate)。 BLACK CARD ✓ 可發文 / 推薦賽事 / 創作者抽成 5% (Q3 2026 開放)。 Founders 27 ✓ 可發文 / 0% 抽成終身 (現在預售中 · 限量 270)。"
                ctas={[
                  { label: "↓ Creator Permissions FAQ", href: "#creator-permissions" },
                ]}
              />
              <MapRow
                question="Q3 · Tim 如何管理會員 · 會員自己頁面在哪?"
                verdict="✓ 都有 · 路徑列在右"
                verdictTone="gold"
                body="Tim ops dashboard: /admin (noindex · Tim 自用 · live KPI · Stage 1 Supabase Studio 連結 + Stage 2 自家後台 mockup)。 會員 individual preview: /member (4 cognitive bias driven · localStorage data 當 preview)。 Calibration mirror: /member/calibration (sabermetric 45° reliability diagram)。"
                ctas={[
                  { label: "→ /member · 會員個人頁", href: "/member" },
                  { label: "→ /admin · Tim ops (noindex)", href: "/admin" },
                ]}
              />
              <MapRow
                question="Q4 · 會員頁面 psychology 角度能做什麼?"
                verdict="✓ 4 cognitive bias + epistemic mirror"
                verdictTone="gold"
                body="Endowment Effect(您的引擎時間軸 · 您自己的 sim history 累積)· IKEA Effect(您 vote 決定引擎下一步 · drag-rank)· Loss Aversion(您 follow 的賽事 + 個人 calibration record)· Collection(您自己的 trophy)。 + epistemic mirror /member/calibration · ZONE 27 唯一發布會員自己 calibration drift 的高端 sports 品牌。"
                ctas={[
                  { label: "→ /member 完整 preview", href: "/member" },
                  { label: "→ /member/calibration · epistemic mirror", href: "/member/calibration" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ── 4-TIER CARDS ───────────────────────── */}
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

        {/* ── 創作者 / 發文 / 推薦賽事 FAQ ─────────── */}
        <section
          id="creator-permissions"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-16 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6 text-center"
          >
            / CREATOR PERMISSIONS · 發文與推薦賽事
          </p>
          <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4">
            一般會員可以發文嗎?
          </h2>
          <p className="text-mute text-center text-sm sm:text-base leading-relaxed mb-12 max-w-xl mx-auto">
            這是 Tim 反覆被問的問題 · 直接回答 · 不繞圈。
          </p>

          <div className="space-y-8">
            <PermissionRow
              tier="匿名訪客 / FREE TIER"
              status="❌ 無法發文"
              detail="可閱讀所有公開內容 + 跑 /lab 引擎 · 但無法在賽事頁討論室發言 / 推薦賽事 / 賣明牌。"
              reason="我們刻意把發文權給付費會員 · 防 LINE 老師 archetype 進來(玩運彩 playsport.cc · 報馬仔 fengyuncai.com 的 tipster ranking 生態 · 「輸了刪文 / 贏了截圖 / 月抽 30-50%」mechanism · 那不是 ZONE 27)。Solo founder 也需要 manual moderation · gate 讓 Tim 可控。"
            />
            <PermissionRow
              tier="BLACK CARD(Q3 2026 開放)"
              status="✅ 可發文 / 5% 抽成"
              detail="在 /matches/[gameId] 賽事討論室發言 · 推薦賽事 · 賣明牌。創作者抽成 5%(vs 玩運彩 / 報馬仔 / LINE 老師平台普遍 30-50% · 5% 是降維打擊)。"
              reason="月費 NT$ 499 = 我們 manual 審帳號的成本 · 也是 brand IP「會員制 = 言論權的 gate」的具體實踐(Costco / Stratechery / Bankless 同邏輯)。"
            />
            <PermissionRow
              tier="Founders 27(預售中 · 限 270)"
              status="✅ 可發文 / 0% 抽成終身"
              detail="BLACK CARD 全權限 + 創作者抽成 0%(永遠)。NT$ 2,700 一次性 · 終身。"
              reason="270 創始者 = ZONE 27 永遠的傳教士 · Tim 親手 onboarding 每位。0% 抽成 = 對「跟我們一起 build 從零」的真實 reward。"
            />
            <PermissionRow
              tier="未來 · FREE TIER 投稿(規劃中)"
              status="⏳ Tim 親手 curate"
              detail="post-Q3-launch 規劃:FREE TIER 訂閱者可投稿文章 / 賽事分析 · Tim 每週親手 curate 1 篇上 /signal-board。不付費可上稿 · 但無創作者抽成(您寫的是「作品」· 不是「商業預測」)。"
              reason="Stratechery Guest Post pattern + Bankless 社群 essay 模式。Tim solo founder 必須 curation rate-limit · 約定 1/週上稿。不承諾時程 · 待 BLACK CARD 啟動後規劃。"
            />
          </div>

          <p className="mt-12 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed text-center">
            完整商業邏輯 + 為什麼倒置 / 4 個 inversion(disclosure · monetization · coverage · privacy)·
            見{" "}
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
              /coverage NEVER COVER list
            </Link>
          </p>
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
            6 大權益 + 5.4 個月 break-even · 完整定價邏輯 · 三層 tier 比較表 · INLINE FAQ。
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
      <p className="text-mute text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
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

// Round 30 Wave 4 · MAP row sub-component。 4 Q-cards used in MEMBER
// SYSTEM MAP block at top of /membership · 每個 question 一張卡 · verdict
// band + body + 1-2 direct anchor link · pratfall-safe(承認被反覆問
// 是 brand acknowledgment 不是 noise)。
function MapRow({
  question,
  verdict,
  verdictTone,
  body,
  ctas,
}: {
  question: string;
  verdict: string;
  verdictTone: "gold" | "bone" | "loss" | "mute";
  body: string;
  ctas: { label: string; href: string }[];
}) {
  const verdictColor = {
    gold: "text-gold",
    bone: "text-bone",
    loss: "text-loss",
    mute: "text-mute",
  }[verdictTone];
  return (
    <div className="border-l-2 border-gold/50 pl-5 sm:pl-6 py-1">
      <p className="font-mono text-bone text-xs sm:text-sm tracking-[0.15em] leading-snug mb-3">
        {question}
      </p>
      <p
        className={`font-mono ${verdictColor} text-sm sm:text-base tracking-[0.1em] mb-3 font-medium`}
      >
        {verdict}
      </p>
      <p className="text-mute text-sm leading-relaxed mb-4">{body}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {ctas.map((cta, i) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={`inline-block font-mono text-[10px] tracking-[0.3em] underline-offset-4 hover:underline ${
              i === 0
                ? "text-gold hover:text-gold-soft"
                : "text-gold/70 hover:text-gold"
            }`}
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PermissionRow({
  tier,
  status,
  detail,
  reason,
}: {
  tier: string;
  status: string;
  detail: string;
  reason: string;
}) {
  return (
    <div className="border-l-2 border-gold/30 pl-5 sm:pl-6 py-1">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-mono text-bone text-[11px] sm:text-xs tracking-[0.25em]">
          {tier}
        </p>
        <p className="font-mono text-gold text-[11px] sm:text-xs tracking-[0.3em]">
          {status}
        </p>
      </div>
      <p className="text-mute text-sm leading-relaxed mb-2">{detail}</p>
      <p className="text-mute/70 text-xs leading-relaxed italic">
        為什麼: {reason}
      </p>
    </div>
  );
}
