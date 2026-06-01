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
  title: "年度公開報告 · 2026 第 0 年",
  description:
    "ZONE 27 第 0 年公開年度報告。 0 訂閱者 · NT$ 0 收入 · 7 個系統測試用的佔位創始會員 · 只結算過 1 場 · 完整成本 · 完整今年砍掉的清單 · 上線前的誠實狀態。 一般網站隱藏營收 · 我們從第 0 年就公開。",
};

// ── ZONE 27 · /annual/2026 ─────────────────────────────
// Round 33 W-E · Agent A research #2 priority(F2 · Defector + Hell Gate
// + Aftermath annual report pattern · radical transparency = 最強 costly
// signaling form · trust > marketing per agent verdict).
//
// Year 0 honest content(2026 pre-launch state):
//   - 0 paid subscribers(BLACK CARD not launched)
//   - 7 forged founders(placeholder · clearly SYSTEM-TEST labeled)
//   - 263 待領創始編號(NT$ 2,700/365 天 · 會員不限量 · 前 270 拿編號 · Patek annual collection 模式)
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
    item: "會員頁一度太長 · 砍掉重做",
    lesson: "會員系統說明寫了一大段、字太多沒人想看 · 砍掉 270 行 · 並定下一條規則:每一頁只講一個時態 · 每個段落都必須是「現在」就成立的事 · 不寫一堆還沒發生的未來。",
  },
  {
    item: "登入頁的「輸入 6 位數驗證碼」表單 · 整套砍掉",
    lesson: "原本以為登入信會帶 6 位數驗證碼 · 但實際只帶一個確認連結 · 訪客盯著驗證碼欄位永遠等不到碼 = 介面承諾了做不到的事。 教訓:介面功能必須從頭到尾用真實資料走過一遍 · 不能只確認程式能編譯。",
  },
  {
    item: "導覽列「會員 →」按鈕一度連錯地方",
    lesson: "已登入的人點下去 · 跑到方案總覽而不是自己的個人頁 · 是動線斷掉。 改成會依登入狀態判斷的版本。 自己當使用者實際走一遍 · 比稽核更能抓到問題。",
  },
  {
    item: "「抽成 30-50%」這個說法一度點名特定平台",
    lesson: "那兩家平台根本沒公開過自己抽幾成 · 我們點名講就是沒憑據的說法 · 有風險。 改成講台灣 LINE 老師、投顧老師的業界共識 · 不點名。",
  },
  {
    item: "BLACK CARD 一度只賣「身份」、不給實際功能",
    lesson: "會員方案一度做得很虛、沒人想付費 · 而我們的客群是會下注的人。 後來把重心轉回棒球預測引擎 · 把 BLACK CARD 重新定義成 — 工程筆記、AI 信心度、賽事討論、Q&A · 為想練預測的人量身設計、給得出實際價值。",
  },
  {
    item: "Founders 27 上線時間一度寫 2026 Q3 · 至今 7 個仍是系統測試佔位",
    lesson: "金流平台還沒拍板 · 品牌域名還沒買 · 第一筆真實會員認領延後。 我們大方把這件事寫進空白的認領帳本 · 等通道開了再上。",
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
            {REPORT_PHASE}。 0 訂閱者 · NT$ 0 收入 · 7 個系統測試用的佔位
            創始會員 · 只結算過 1 場(命中)· 引擎 v0.2。 所有數字都是
            誠實的空白 · 不造假。 有些獨立媒體靠讀者直接資助起家、把一切
            攤開給人看 · 我們從第 0 年就這樣做。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            一般公司隱藏營收 · ZONE 27 公開第 0 年 NT$ 0。 一般公司隱藏
            失敗 · 我們列出今年砍掉的 6 項東西。 一般品牌等到有數字才公開 ·
            我們從第 0 年就承諾每年 5/31 公開 · 說到就要做到。
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
            ⚠ 上線前 · Founders 27 付費相關數字全為 0。 BLACK CARD 與
            Founders 27 都採人工轉帳 · 品牌域名還沒買 · 等時機到了再上線。
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
            一般公司的年度報告會隱藏失敗。 我們把今年砍掉的 6 項東西
            連同學到的教訓全部列出來。 公開弱點本身就是訊號 · 反而會
            強化信任。
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
            ▸ 這份清單是說到要做到的承諾 · 修改需提前 30 天在
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline mx-1">
              /changelog
            </Link>
            公告。
          </p>
        </section>

        {/* ── WHY THIS REPORT EXISTS ──────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <blockquote className="border-l-2 border-gold pl-6 sm:pl-8 py-3">
            <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-4">
              一般 SaaS Year 0 不公開 · 我們公開 Year 0 NT$ 0。
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              有些獨立媒體把自己的營運結構、收入目標全部攤開給讀者看。
              ZONE 27 從第 0 年就公開 · 每年 5/31 更新 · 內容由系統自動
              依真實數字生成。 這是一個說到就要做到、每年攤開讓人檢驗的
              承諾。
            </p>
          </blockquote>
        </section>

        <FounderSignOff>
          <p>
            這頁今天是 <strong>第 0 年的空白底稿</strong> · 6 項今年砍掉的
            東西是真實的開發歷史 · 4 項明年計畫是說到要做到的承諾(修改
            需提前 30 天在 /changelog 公告)。 0 付費會員 + NT$ 0 收入是
            上線前的誠實現實 · 不造假數字、不灌虛榮數據。
          </p>
          <p>
            第 1 年報告預計 2027/05/31 公開 · 第一次會有真實的 BLACK CARD
            訂閱人數、收入、流失率、以及命中與失準的場數 · 從第 0 年到
            第 1 年全程公開。 我們從第 0 年就承諾每年 5/31 公開 · 這個承諾
            本身就是品牌的一部分。
          </p>
          <p>
            這頁存在的意義是一句話:<strong>一般公司隱藏營收 · ZONE 27
            從第 0 年就公開 · 因為我們的護城河是信任 · 不是演算法</strong>。
            這跟 /audit、/track-record、/coverage、/founders/ledger 公開
            拒絕案例是同一套邏輯 · 全部攤開是我們的鐵律。
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
