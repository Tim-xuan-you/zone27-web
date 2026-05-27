import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";
import EngineStamp from "@/components/EngineStamp";
import ReproducibilityReceipt from "@/components/ReproducibilityReceipt";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "Annual Report · 2026 Year 0",
  description:
    "ZONE 27 第 0 年公開年度報告。 0 訂閱者 · NT$ 0 收入 · 7 forged founders · N=1 engine receipt · 完整 costs · 完整 what-failed list · pre-launch honest state · Defector + Hell Gate + Aftermath radical-transparency pattern · Pratfall + Costly Signaling axiom 同時 fire。",
};

// ── ZONE 27 · /annual/2026 ─────────────────────────────
// Round 33 W-E · Agent A research #2 priority(F2 · Defector + Hell Gate
// + Aftermath annual report pattern · radical transparency = 最強 costly
// signaling form · trust > marketing per agent verdict).
//
// Year 0 honest content(2026 pre-launch state):
//   - 0 paid subscribers(BLACK CARD not launched)
//   - 7 forged founders(placeholder · clearly SYSTEM-TEST labeled)
//   - 263 待認領 Founders 27 spots(NT$ 2,700/365 天 · 每年 1/1 開放新 270 · Patek annual collection 模式)
//   - 1 PROVED receipt(cpbl-260521-01 · 富邦 win @ 60% engine)
//   - NT$ 0 revenue
//   - Costs:Vercel Free + Supabase Free + Resend Free + GitHub Free
//   - Engine v0.2 in development
//
// Brand IP fire(4 axiom 同時):
//   1. Pratfall · 公開 Year 0 empty state(0 subs · 0 rev)
//   2. Costly Signaling · 每年承諾 publish = 不可造假 prove-it-yearly
//   3. Disclosure Philosophy · 延伸 /audit 公開 model → 公開 business
//   4. 倒置 SaaS · 一般 SaaS 隱藏 ARR · ZONE 27 透明 Year 0 NT$ 0
//
// Same canonical pattern as /audit S05 PRE-COMMIT · /track-record DIVERGED ·
// /coverage NEVER · /founders/ledger rejection samples。
//
// Update cadence:每年 5/31 publish · 0 hr Tim writing(Claude auto-generate
// based on actual Supabase metrics + GitHub commit history + Resend
// delivery stats)。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily refresh · Year 0 metrics may shift

const REPORT_YEAR = "2026";
const REPORT_PHASE = "Year 0 · Pre-Launch · Stealth Build";

// Pre-launch state · all metrics honest empty · 不 fake
const METRICS = {
  paidSubscribers: 0,
  waitlistEmails: "pending Supabase migrate", // 等 Resend integration metric
  founders27Claimed: FOUNDERS_CLAIMED, // 7 SYSTEM-TEST forged
  founders27Total: FOUNDERS_TOTAL, // 270
  founders27Remaining: FOUNDERS_REMAINING, // 263
  receiptsProved: 1, // cpbl-260521-01
  receiptsDiverged: 0,
  receiptsTotal: 1,
  revenueNTD: 0,
  costsMonthlyNTD: 0, // Vercel/Supabase/Resend free tiers
  engineVersion: "v0.2",
  engineSampleN: 1,
  commitsToDate: 294, // R61 W-D refresh · git rev-list --count HEAD · /changelog source of truth
};

const WHAT_FAILED_2026: { item: string; lesson: string }[] = [
  {
    item: "Round 30 W11 · MEMBER SYSTEM MAP block 60 lines",
    lesson: "Tim 第 11 次 canary fire「太多字 · 沒人想看」 · 砍 270 lines · 寫死 axiom「one tense per page · every section must be true right now · 反 future-tense scaffolding」",
  },
  {
    item: "Round 32 W-C · /login SentState path ② TYPE CODE 6 位數 OTP form",
    lesson: "假設 Supabase magic link email template 帶 `{{ .Token }}` · 但預設只帶 `{{ .ConfirmationURL }}` · 訪客看 6 位數 verify form 永遠收不到 code = over-promised UI · 違反 R30 W11 axiom · 砍整套。 Lesson:UI feature 必須 verify end-to-end real data flow · 不只 verify code compiles。",
  },
  {
    item: "Round 32 W-D · Nav「會員 →」 button 從 R23-R25 hardcode /membership",
    lesson: "已登入 user 點下去到 ladder overview 不是個人 dashboard · navigation gap · 修為 auth-aware client island。 founder dogfood canary 比 agent audit 高 quality。",
  },
  {
    item: "Round 32 W-E · 「30-50% 抽成」 narrative cite 玩運彩+報馬仔",
    lesson: "Agent 帶回 IP risk:兩家不公開 disclose 抽成 % · 我們 cite specific platform 是 unverified claim。 改 cite Taiwan LINE 老師 / 投顧老師業界共識 generic。",
  },
  {
    item: "Round 30-31 · BLACK CARD「賣身份不賣 unlock」 framing",
    lesson: "Tim 9+ canary fire「會員爛 · 沒人付費 · 客群要賭博」 · brand IP-rich + business-poor 失衡。 Round 33 pivot to AI baseball engine + 「unlock 真實 functional value」 framing · 重 frame BLACK CARD = newsletter + AI Confidence + thread + Q&A 量身 design for prediction-seeking audience。",
  },
  {
    item: "Founders 27 LAUNCH timeline · 寫 Q3 2026 · 至今 7 forged 仍是 SYSTEM-TEST",
    lesson: "Payment platform (TapPay / 綠界個人版 / 藍新) 還沒拍板 · brand 域名沒買 · 第一筆 real founder 認領延後到 Q3 後。 Pratfall 寫進 /founders/ledger empty scaffold 等通道開啟。",
  },
];

const WHATS_NEXT_2027: { milestone: string; description: string; q: string }[] = [
  {
    milestone: "BLACK CARD 上線",
    description: "NT$ 500/31 天 訂閱 · payment infrastructure(TapPay / 綠界個人版)接入 · weekly AI 引擎 deep-dive + match thread + Tim Q&A 每月。",
    q: "2026 Q3",
  },
  {
    milestone: "Founders 27 第一週 review window",
    description: "申請通道開放 · 第一筆 real founder 認領 · /founders/ledger empty scaffold 變實 weekly review log · 拒絕原因(去 PII)同等 visual 公開。",
    q: "2026 Q3",
  },
  {
    milestone: "Engine v0.3 ship",
    description: "park factor + 打者個別品質 · winRate 不再純粹由投手三項決定 · /methodology 寫進變動 · /track-record N=1 → N=30+ sample debt 解封。",
    q: "2026 Q4",
  },
  {
    milestone: "Annual Report 2027 Year 1 publish",
    description: "第一次有真實 metrics 的 report · 預計 publish 2027/05/31 · 同 commitment device 不可造假 prove-it-yearly。",
    q: "2027 May",
  },
];

export default function AnnualReport2026Page() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="about" />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / ANNUAL REPORT · {REPORT_YEAR}
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-loss/40 text-loss/80 shimmer"
              title="Year 0 · Pre-launch state · 所有 metrics honest empty · 不 fake numbers"
            >
              YEAR 0 · PRE-LAUNCH
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            年度公開報告 · {REPORT_YEAR}
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            {REPORT_PHASE}。 0 訂閱者 · NT$ 0 收入 · 7 SYSTEM-TEST forged
            founders · 1 PROVED receipt(N=1)· engine v0.2。 所有 metrics
            honest empty · Defector / Hell Gate / Aftermath radical-transparency
            pattern。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            一般 SaaS 隱藏 ARR · ZONE 27 公開 Year 0 NT$ 0。 一般 startup
            隱藏 what-failed · 我們列 6 項今年砍掉的 ship。 一般品牌等到 Year 1
            有 metric 才 publish · 我們從 Year 0 就承諾 every 5/31 publish ·
            commitment device 不可造假。
          </p>

          {/* Round 44 W-C · Agent K DEEPEST canonical sentence · 4th of 4
              key pages 統一 brand IP moat sentence · 同 /about Prologue ·
              /ethics hero · /steelman hero。 */}
          <p className="mt-6 text-bone text-base sm:text-lg leading-relaxed border-l-4 border-gold pl-5 py-2 max-w-2xl">
            <strong>每一個承諾 Tim 簽名 · 可被驗證 · 違反任何一條 = <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">/ethics</Link> 紅字
            永久標 · 不可刪</strong> · 包括此 page 每年 5/31 publish 的承諾 · 同
            binding · 違反 = brand 信用 collapse · 不分 success or failure。
          </p>

          <div className="mt-6 mb-2">
            <ArticleMeta readingMin={5} sample={{ current: METRICS.engineSampleN, threshold: 30 }} />
          </div>
          <div className="mt-3">
            <EngineStamp />
          </div>
        </section>

        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-12">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* ── BUSINESS METRICS ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            / BUSINESS METRICS · 商業數字
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate/40 border border-line/70 p-5 sm:p-7">
            <MetricBlock
              label="PAID SUBS · 付費"
              value={String(METRICS.paidSubscribers)}
              tone="loss"
              note="0 · BLACK CARD 未上線"
            />
            <MetricBlock
              label="REVENUE NT$ · 收入"
              value={String(METRICS.revenueNTD)}
              tone="loss"
              note="0 · pre-launch"
            />
            <MetricBlock
              label="COSTS NT$ · 月成本"
              value={String(METRICS.costsMonthlyNTD)}
              tone="bone"
              note="Vercel / Supabase / Resend / GitHub 全 free tier"
            />
            <MetricBlock
              label="FOUNDERS 27 · 已認領"
              value={`${METRICS.founders27Claimed} / ${METRICS.founders27Total}`}
              tone="gold"
              note="7 SYSTEM-TEST forged · 263 待認領"
            />
            <MetricBlock
              label="ENGINE RECEIPTS · 戰績"
              value={`${METRICS.receiptsProved} ✓ / ${METRICS.receiptsDiverged} ✕`}
              tone="bone"
              note={`N=${METRICS.receiptsTotal} · SAMPLE DEBT 未解(threshold 30)`}
            />
            <MetricBlock
              label="COMMITS · 開源 git history"
              value={`${METRICS.commitsToDate}+`}
              tone="mute"
              note="可 audit · github.com/Tim-xuan-you/zone27-web"
            />
          </div>
          <p className="mt-5 font-mono text-loss/80 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚠ PRE-LAUNCH · Founders 27 付費相關 metrics = 0。 BLACK CARD LIVE
            manual ECPay(per R81 pivot)· Founders 27 payment infrastructure
            (manual bank transfer)· brand 域名未買 · milestone-triggered ship。
          </p>

          {/* Round 44 W-B · ReproducibilityReceipt drop-in · /annual/2026
              METRICS block · per IJCAI 2026 standard · git+seed+n+dataAt
              audit trail per published Year 0 number。 */}
          <div className="mt-5">
            <ReproducibilityReceipt
              seed={null}
              dataAt="2026-05-22"
              n={METRICS.receiptsTotal}
              fileLink="https://github.com/Tim-xuan-you/zone27-web/blob/main/app/annual/2026/page.tsx"
            />
          </div>
        </section>

        {/* ── WHAT FAILED · canonical Pratfall ──────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / WHAT FAILED · 今年砍掉的 ship + lesson
          </p>
          <p className="text-mute leading-relaxed mb-8 max-w-2xl">
            一般 startup annual report 隱藏 what-failed。 我們列 6 項
            today 砍掉的 ship + lesson 寫死 axiom。 Aronson 1966 + Spence
            1973 costly signaling 背書:公開弱點反向強化 trust。
          </p>
          <ol className="space-y-6">
            {WHAT_FAILED_2026.map((entry, i) => (
              <FailedItemRow
                key={entry.item}
                no={String(i + 1).padStart(2, "0")}
                item={entry.item}
                lesson={entry.lesson}
              />
            ))}
          </ol>
        </section>

        {/* ── WHAT'S NEXT 2027 · roadmap commitment ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / WHAT&apos;S NEXT · 2027 milestone commitment
          </p>
          <div className="space-y-5">
            {WHATS_NEXT_2027.map((entry) => (
              <NextMilestoneRow
                key={entry.milestone}
                milestone={entry.milestone}
                description={entry.description}
                quarter={entry.q}
              />
            ))}
          </div>
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ▸ 此 list 是 commitment device · 修改需 30 天前
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline mx-1">
              /changelog
            </Link>
            公告(同 /audit S05 PRE-COMMIT pattern)。
          </p>
        </section>

        {/* ── WHY THIS REPORT EXISTS ──────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <blockquote className="border-l-2 border-gold pl-6 sm:pl-8 py-3">
            <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-4">
              一般 SaaS Year 0 不公開 · 我們公開 Year 0 NT$ 0。
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              Defector 把 cooperative 結構 + worker-owned 公開 · Hell Gate
              「百萬美元」 文寫死 · Aftermath subscriber-goals page 公開承諾。
              ZONE 27 從 Year 0 就 publish · 每年 5/31 update · 0 hr Tim
              writing(Claude auto-generate based on Supabase metrics + GitHub
              commits + Resend deliveries)。 Commitment device 不可造假
              prove-it-yearly · 同 /audit S05 PRE-COMMIT pattern。
            </p>
          </blockquote>
        </section>

        <FounderSignOff>
          <p>
            這頁今天是 <strong>Year 0 empty scaffold</strong> · 6 項 what-failed
            是真實 ship history · 4 項 what&apos;s next 是 binding commitment(修改
            需 30 天前 /changelog 公告)。 0 paid subs + NT$ 0 rev 是 honest
            pre-launch reality · 不 fake numbers 不 vanity metric。
          </p>
          <p>
            Year 1 report 預計 2027/05/31 publish · 第一次有真實 BLACK CARD
            subscriber count + revenue + churn + Year 1 PROVED/DIVERGED N
            count · Year 0 → Year 1 transition 公開全程。 我們從 Year 0
            就承諾 every 5/31 publish · 這個 commitment device 本身就是 brand
            IP 物理產出。
          </p>
          <p>
            這個 page 的存在 brand IP 是 statement:<strong>一般 SaaS 隱藏
            ARR · ZONE 27 從 Year 0 就 publish · 因為我們的 moat 是 trust
            不是 algorithm</strong>。 同 /audit S05 + /track-record + /coverage
            NEVER + /founders/ledger rejection samples 同邏輯 · radical
            transparency 是 brand 鐵律。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/annual/2026" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/audit"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← Model Report · /audit
            </Link>
            <Link
              href="/founders/ledger"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              Open Allocation Ledger · /founders/ledger →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function MetricBlock({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: string;
  tone: "bone" | "gold" | "mute" | "loss";
  note: string;
}) {
  const toneClass = {
    bone: "text-bone",
    gold: "text-gold",
    mute: "text-mute",
    loss: "text-loss/80",
  }[tone];
  return (
    <div>
      <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-2">
        {label}
      </p>
      <p
        className={`font-mono ${toneClass} tabular text-2xl sm:text-3xl font-light tracking-tight mb-2`}
      >
        {value}
      </p>
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.22em] leading-relaxed">
        {note}
      </p>
    </div>
  );
}

function FailedItemRow({
  no,
  item,
  lesson,
}: {
  no: string;
  item: string;
  lesson: string;
}) {
  return (
    <li className="flex gap-5">
      <span className="font-mono text-loss/70 text-sm tabular w-8 pt-1">
        {no}
      </span>
      <div className="flex-1">
        <h4 className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          {item}
        </h4>
        <p className="text-mute text-sm leading-relaxed">
          <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em] mr-2">
            LESSON
          </span>
          {lesson}
        </p>
      </div>
    </li>
  );
}

function NextMilestoneRow({
  milestone,
  description,
  quarter,
}: {
  milestone: string;
  description: string;
  quarter: string;
}) {
  return (
    <article className="bg-slate/40 border border-line/60 p-5 sm:p-6">
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-3">
        <h3 className="text-bone text-base sm:text-lg font-light tracking-tight">
          {milestone}
        </h3>
        <span
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.3em] tabular border border-gold/40 px-2 py-0.5"
        >
          {quarter}
        </span>
      </div>
      <p className="text-mute text-sm leading-relaxed">{description}</p>
    </article>
  );
}
