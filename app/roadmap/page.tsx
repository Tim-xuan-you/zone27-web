import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";

export const metadata: Metadata = {
  title: "Roadmap · 公開路線圖 · 含品牌鐵律",
  description:
    "ZONE 27 接下來在做什麼 · 在評估什麼 · 不變的品牌鐵律是什麼。/changelog 是過去的記錄;這頁是未來的承諾。沒有「即將推出」的銷售話術,只有 LOCKED / EXPLORING / BRAND BOUNDARIES 三類。",
};

// ── ZONE 27 · /roadmap ───────────────────────────────
// /changelog(past · git source of truth)+ 這頁(future · founder
// promise)= complete disclosure timeline。/audit Section 08
// 揭露哲學要求「過去 · 現在 · 未來」都不藏 — /roadmap 是「未來」
// 那塊拼圖。
//
// 三類 framing 抄自 Anthropic Responsible Scaling Policy:
//   LOCKED · 確定要做的(時程 + 邏輯都已定)
//   EXPLORING · 在研究的(可能會做 · 可能不做 · 不承諾時程)
//   EXPLICIT NO · 永遠不做的(品牌 IP 防線)
//
// 「永遠不做」section 是 brand IP genius —— 公開說 NO 比公開
// 說 YES 更難。對標 Anthropic 拒絕做某些 AI capability +
// Plausible 拒絕做某些 tracking + HEY 拒絕做某些 SaaS pattern。
// ─────────────────────────────────────────────────────

const LAST_REVIEWED = "2026-05-21";

type RoadmapStatus = "locked" | "exploring" | "no";

type RoadmapItem = {
  title: string;
  body: string;
  evidenceHref?: string;
  evidenceLabel?: string;
};

const LOCKED: { quarter: string; items: RoadmapItem[] }[] = [
  {
    quarter: "現在 · 2026 Q2(May-Jun)· 部分已 SHIPPED",
    items: [
      {
        title: "✓ SHIPPED · /track-record 公開戰績 ledger",
        body: "2026-05-21 上線 · Bloomberg-terminal aesthetic · PROVED 跟 DIVERGED(定義見 /glossary Z27 LEXICON)等大列出 · 從 N=0 honest empty state 起跳。第一筆預定今晚收錄。",
        evidenceHref: "/track-record",
        evidenceLabel: "/track-record",
      },
      {
        title: "✓ SHIPPED · Cmd-K 全站快搜 palette",
        body: "2026-05-21 上線 · 24 routes 索引化 · ⌘K (Mac) / Ctrl-K (Win) 開啟 · ↑↓ 導航 · ↵ 開啟 · mobile ⌕ icon trigger (Round 12)。無 fuse.js 無 telemetry 無 recently-used (per disclosure philosophy)。",
      },
      {
        title: "CPBL 每日 ingestion 持續累積 ledger",
        body: "Tim 每天截圖 cpbl.com.tw 賽前資料 + 賽後最終比分 → Claude 解析 → 寫入 finalResult。目標 90 天內 N≥30 場 · 進入 statistical-meaningful 區間。",
        evidenceHref: "/track-record",
        evidenceLabel: "/track-record",
      },
      {
        title: "引擎 v0.2 → v0.3 規劃中",
        body: "增加「球場因素」(park factor)+「打者個別品質」(平均隊伍 wOBA)兩個輸入,讓 home/away winRate 不再純粹由投手三項指標決定。完成後寫入 /methodology。",
        evidenceHref: "/methodology",
        evidenceLabel: "/methodology v0.4 roadmap",
      },
      {
        title: "Resend email confirmation 接 waitlist",
        body: "目前 waitlist 填表後僅寫入 Supabase 無自動回信。接 Resend 免費 tier(100 mails/day)後送 personal confirmation。",
        evidenceHref: "/founders",
        evidenceLabel: "/founders 等候表單",
      },
    ],
  },
  {
    quarter: "下一階段 · 2026 Q3(Jul-Sep)",
    items: [
      {
        title: "Founders 27 正式預售開啟",
        body: "NT$ 2,700 一次性 · 限量 270 名 · 手工銀行轉帳 · Tim 親手 onboarding 每一位。預期 5.4 個月 break-even。流程細節已寫進 docs/MANUAL-ONBOARDING.md。",
        evidenceHref: "/founders",
        evidenceLabel: "/founders 完整邏輯",
      },
      {
        title: "BLACK CARD 月費 NT$ 499 上線(TapPay 訂閱)",
        body: "賣的不是引擎(永遠免費)· 賣的是社群 + 策展 + 創作者 take。對標 Stratechery / The Athletic / Bankless Premium / TradingView Pro。",
        evidenceHref: "/founders",
        evidenceLabel: "BLACK CARD reframe",
      },
      {
        title: "品牌正式域名上線",
        body: "從 zone27-web.vercel.app 升級到 zone27.tw / .app / .cc / .io(Tim 拍板)。同時解凍 SEO / Search Console / 真實品牌資產定版。",
      },
    ],
  },
];

const EXPLORING: RoadmapItem[] = [
  {
    title: "引擎 v0.3 · 球場因素 + 打者品質",
    body: "目前引擎假設打者隊伍 wOBA 都是 league average · 球場一視同仁。下一版納入。挑戰:小樣本 CPBL 球場數據不夠精細。",
    evidenceHref: "/audit",
    evidenceLabel: "/audit Section 03 排除清單",
  },
  {
    title: "NPB / KBO 評估",
    body: "MLB(已上)+ CPBL(已上)後 · NPB / KBO 是邏輯延伸。但 coverage philosophy 要求「引擎能誠實算的才覆蓋」,所以要先評估資料品質。",
    evidenceHref: "/coverage",
    evidenceLabel: "/coverage philosophy",
  },
  {
    title: "View Transitions API · 頁面切換 morph",
    body: "Next.js 16.2 原生支援。但 Firefox 仍在 flag 後(~22% 訪客拿不到效果)· Mobile perf 未驗證 · 再等 1-2 個月看 Safari/Firefox parity 改善。",
  },
  {
    title: "「Up and Down the Ladder of Abstraction」式 interactive number demo",
    body: "Bret Victor pattern — 訪客點首頁某個數字(例如「10,000 場模擬」),展開看那 10K 場是怎麼跑出來的。每個重點數字都能 drill down。Brand IP 「方法公開」的極致 demonstration。",
  },
];

const EXPLICIT_NO: RoadmapItem[] = [
  // Round 7 agent-validated cut: was 6 items · now 3 most fundamental.
  // Dropped items merged into the 3 surviving ones thematically:
  //   - "不寄生運彩平台" subset of "不覆蓋全部可下注賽事"(coverage)
  //   - "不藏 model weights / failed predictions" subset of "不裝 GA/Pixel"
  //     trust commitment + /audit S05 DISCLOSURE PHILOSOPHY canonical
  //   - "不做 marketing fluff" general principle · enforced by code-level
  //     grep · not a brand-IP commitment per se · move to project culture
  {
    title: "永遠不裝 Google Analytics / Facebook Pixel / Hotjar 錄影",
    body: "ZONE 27 不追蹤訪客足跡 · 不藏 model weights · 不藏失敗預測。這不是技術限制 · 是品牌哲學。寫在 /privacy 第 03 節 + /audit Section 05,違反即品牌信用自殺。",
    evidenceHref: "/privacy",
    evidenceLabel: "/privacy Section 03",
  },
  {
    title: "永遠不接受創投 / 不投放廣告 / 不上市",
    body: "ZONE 27 用 270 位 Founders × NT$ 2,700 自籌資金啟動 · BLACK CARD 月費維持運轉。創投錢進來後會被估值倒推「ARR 50x 線性增長」邏輯,跟 270 人封閉俱樂部本質衝突。",
    evidenceHref: "/manifesto",
    evidenceLabel: "/manifesto Section II",
  },
  {
    title: "永遠不覆蓋全部可下注賽事 / 不寄生運彩平台",
    body: "Coverage philosophy:只覆蓋引擎能誠實計算的場次。為 SEO / 流量上線數百場品質次等賽事 = 變運彩平台。從博彩平台抓資料 = 跟博彩綁定 = 定位崩潰。",
    evidenceHref: "/coverage",
    evidenceLabel: "/coverage",
  },
];

export default function RoadmapPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-12">
        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em]"
          >
            / ROADMAP · 公開路線圖
          </p>
          <span
            lang="en"
            className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80"
          >
            LAST REVIEWED · {LAST_REVIEWED}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
          接下來在做什麼 · 在評估什麼 · <span className="text-gold">不變的鐵律是什麼</span>
        </h1>
        <p className="mt-6 text-mute leading-relaxed max-w-2xl">
          <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
            /changelog
          </Link>
          {" "}是過去的事實(git 為 source of truth)· 這頁是未來的承諾。
          <strong className="text-bone">公開鐵律比含糊承諾更難</strong> —
          所以底下有一個「BRAND BOUNDARIES」section · 跟 LOCKED / EXPLORING 同等視覺權重。
        </p>
        <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
          沒有「即將推出 · 敬請期待」的銷售話術 · 沒有「正在規劃」的模糊承諾 ·
          只有 LOCKED(時程 + 邏輯都已定)· EXPLORING(在研究的)·
          BRAND BOUNDARIES(品牌守則 · 不變的鐵律)。對標 Anthropic Responsible
          Scaling Policy + Plausible「principled boundaries」。
        </p>
      </section>

      <div className="mx-auto max-w-5xl w-full px-6 sm:px-10 mb-12">
        <div className="w-full h-px bg-line/60" />
      </div>

      {/* ── LOCKED ────────────────────────────────── */}
      <section
        aria-labelledby="locked-heading"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16"
      >
        {/* Round 18 motion polish · section-reveal scroll-driven CSS
            animation extends /audit + /coverage + /manifesto pattern. */}
        <p
          lang="en"
          id="locked-heading"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2 section-reveal"
        >
          / 01 · LOCKED
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4">
          時程 + 邏輯都已定
        </h2>
        <p className="text-mute text-sm mb-12 max-w-xl">
          我們認可以對這些事的時程 · 範圍 · 上線狀態做承諾。
          每一項都有對應的 evidence link · 不是 vapor。
        </p>

        <div className="space-y-12">
          {LOCKED.map((bucket) => (
            <div key={bucket.quarter}>
              <p
                lang="en"
                className="font-mono text-gold/70 text-[11px] tracking-[0.35em] mb-6 pb-3 border-b border-line/40"
              >
                {bucket.quarter}
              </p>
              <div className="space-y-8">
                {bucket.items.map((item) => (
                  <RoadmapRow status="locked" key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl w-full px-6 sm:px-10 mb-12">
        <div className="w-full h-px bg-line/40" />
      </div>

      {/* ── EXPLORING ─────────────────────────────── */}
      <section
        aria-labelledby="exploring-heading"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16"
      >
        <p
          lang="en"
          id="exploring-heading"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2 section-reveal"
        >
          / 02 · EXPLORING
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4">
          在研究的 · <span className="text-mute">可能 NO</span>
        </h2>
        <p className="text-mute text-sm mb-12 max-w-xl">
          我們有興趣但還沒確認是否會做的事。沒有時程 · 沒有承諾 ·
          研究中發現不該做就會搬到 BRAND BOUNDARIES,有信心就搬到 LOCKED。
        </p>

        <div className="space-y-8">
          {EXPLORING.map((item) => (
            <RoadmapRow status="exploring" key={item.title} item={item} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl w-full px-6 sm:px-10 mb-12">
        <div className="w-full h-px bg-line/40" />
      </div>

      {/* ── BRAND BOUNDARIES · 不變的鐵律 ───────────
          Round 6 surgical reframe: was "EXPLICIT NO · 永遠不做".
          Same content (Buffett/Plausible/Anthropic-style boundary
          commitments backed by Pratfall + Costly Signaling research).
          Neutral framing as "boundaries we hold" instead of explicit
          negation — same forcing-function value, dignified tone. */}
      <section
        aria-labelledby="explicit-no-heading"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20"
      >
        <p
          lang="en"
          id="explicit-no-heading"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2 section-reveal"
        >
          / 03 · BRAND BOUNDARIES · 不變的鐵律
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4">
          這頁的最重要 section
        </h2>
        <p className="text-mute text-sm mb-12 max-w-xl">
          公開承諾的鐵律是品牌 IP 的物理證據。
          這 section 寫進去後 · 任何相反操作都會被讀者拿出來對照 ·
          所以這也是「強制紀律」機制 · 讀者也是品牌守護者。
        </p>

        <div className="space-y-8">
          {EXPLICIT_NO.map((item) => (
            <RoadmapRow status="no" key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* ── PHILOSOPHY ──────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
        <div className="bg-slate/40 border border-gold/30 p-8 text-center">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            FROM /AUDIT · SECTION 05
          </p>
          <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-3">
            「沒有商業機密 · 沒有 closed weights · 沒有未來計劃藏起來。」
          </p>
          <p
            lang="en"
            className="font-mono text-gold/70 text-sm tracking-[0.25em] mb-6"
          >
            FULL DISCLOSURE · PAST · PRESENT · FUTURE
          </p>
          <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
            /changelog 是過去 · 首頁是現在 · /roadmap 是未來。
            三端封閉時間軸 = 訪客可在任意時刻檢驗我們是否守諾。
          </p>
        </div>
      </section>

      <RelatedReading currentPath="/roadmap" />

      {/* ── BACK ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
        <Link
          href="/changelog"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
        >
          ← 看過去的事實 · /changelog
        </Link>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────

function RoadmapRow({
  status,
  item,
}: {
  status: RoadmapStatus;
  item: RoadmapItem;
}) {
  const dotColor =
    status === "locked"
      ? "bg-gold glow-gold"
      : status === "exploring"
      ? "bg-gold/40"
      : "bg-mute/40";
  const titleColor =
    status === "locked"
      ? "text-bone"
      : status === "exploring"
      ? "text-bone/90"
      : "text-mute line-through decoration-mute/40";

  return (
    <article className="flex gap-5">
      <span
        aria-hidden="true"
        className={`flex-shrink-0 mt-2 w-2 h-2 rounded-full ${dotColor}`}
      />
      <div className="flex-1 min-w-0">
        <h3
          className={`text-lg sm:text-xl font-light tracking-tight mb-2 ${titleColor}`}
        >
          {item.title}
        </h3>
        <p className="text-mute text-sm leading-relaxed mb-2">{item.body}</p>
        {item.evidenceHref && item.evidenceLabel && (
          <Link
            href={item.evidenceHref}
            className="inline-block font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline"
          >
            ▸ {item.evidenceLabel}
          </Link>
        )}
      </div>
    </article>
  );
}
