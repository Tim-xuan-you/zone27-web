import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";

export const metadata: Metadata = {
  title: "Roadmap · 公開路線圖 · 含品牌鐵律",
  description:
    "ZONE 27 接下來在做什麼 · 在評估什麼 · 不變的品牌鐵律是什麼。公開戰績是過去的記錄;這頁是未來的承諾。沒有「即將推出」的銷售話術,只有 LOCKED / EXPLORING / BRAND BOUNDARIES 三類。",
};

// ── ZONE 27 · /roadmap ───────────────────────────────
// /changelog(past · git source of truth)+ 這頁(future · founder
// promise)= complete disclosure timeline。/audit Section 05
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
        body: "2026-05-21 上線 · 命中跟落空一樣大、一起列出(定義見 /audit §08)· 從一筆都還沒有的誠實空白起跳。第一筆預定今晚收錄。",
        evidenceHref: "/track-record",
        evidenceLabel: "/track-record",
      },
      {
        title: "✓ SHIPPED · Cmd-K 全站快搜 palette",
        body: "2026-05-21 上線 · ⌘K(Mac)/ Ctrl-K(Windows)開啟全站快速搜尋 · 收錄所有公開頁面 · ↑↓ 選擇 · ↵ 開啟 · 手機點右上角 ⌕ 圖示。後台與內部跳轉頁面不收。沒有用第三方搜尋套件 · 不追蹤 · 不留「最近使用」紀錄。",
      },
      {
        title: "CPBL 每日 ingestion 持續累積 ledger",
        body: "Tim 每天把中職官網的賽前資料 + 賽後最終比分整理進系統。目標 90 天內累積到 30 場 · 數字才開始有統計意義。",
        evidenceHref: "/track-record",
        evidenceLabel: "/track-record",
      },
      {
        title: "引擎 v0.2 → v0.3 規劃中",
        body: "增加「球場因素」+「打者個別品質」(以隊伍平均 wOBA 衡量)兩個輸入,讓主、客場勝率不再只看投手三項數據決定。完成後寫進 /methodology。",
        evidenceHref: "/methodology",
        evidenceLabel: "/methodology v0.4 roadmap",
      },
      {
        title: "Resend email confirmation 接 waitlist",
        body: "目前等候名單填表後只存進資料庫,還不會自動回信。接上寄信服務的免費方案(每天 100 封)後,會寄一封親筆確認信。",
        evidenceHref: "/membership",
        evidenceLabel: "/membership 等候表單",
      },
    ],
  },
  {
    quarter: "下一階段 · 2026 Q3(Jul-Sep)",
    items: [
      {
        title: "BLACK 正式預售開啟 · NT$ 500/31 天",
        body: "NT$ 500/31 天 · 會員不限量 · BLACK 會員 · 手動銀行轉帳 · Tim 親手帶每一位入會。",
        evidenceHref: "/membership",
        evidenceLabel: "/membership 完整邏輯",
      },
      {
        title: "BLACK · CPBL Season Pass NT$ 500/31 天 上線(手動轉帳 · 不自動續扣)",
        body: "賣的不是引擎(永遠免費)· 賣的是社群 + 策展 + 支持者身分。NT$ 500/31 天、手動轉帳、永遠不自動扣款(見 /integrity 第 13 條:任何自動扣款永遠不做)。",
        evidenceHref: "/membership/black-card",
        evidenceLabel: "BLACK season pass canonical",
      },
      {
        title: "品牌正式域名上線",
        body: "從現在的測試網址升級到正式品牌網域 zone27.tw / .app / .cc / .io(Tim 拍板)。同時開始做搜尋曝光、把品牌資產定版。",
      },
    ],
  },
];

const EXPLORING: RoadmapItem[] = [
  {
    title: "引擎 v0.3 · 球場因素 + 打者品質",
    body: "目前引擎假設每隊打者的攻擊力(wOBA)都等於聯盟平均 · 每個球場一視同仁。下一版會把差異算進去。難處:中職球場資料樣本太小、不夠細。",
    evidenceHref: "/audit",
    evidenceLabel: "/audit Section 03 排除清單",
  },
  {
    title: "NPB / KBO 評估",
    body: "MLB(已上)+ 中職(已上)之後 · 日職 / 韓職是順理成章的下一步。但我們的覆蓋原則是「引擎能誠實算的才覆蓋」,所以要先評估資料品質。",
    evidenceHref: "/coverage",
    evidenceLabel: "/coverage philosophy",
  },
  {
    title: "View Transitions API · 頁面切換 morph",
    body: "新版框架原生支援。但這個效果有些瀏覽器還沒開放(約 22% 訪客看不到)· 手機效能也還沒驗證 · 再等 1-2 個月看各家瀏覽器跟上。",
  },
  {
    title: "可以點開、看數字怎麼算出來的互動展示",
    body: "訪客點首頁某個數字(例如「10,000 場模擬」),就能展開看那一萬場是怎麼跑出來的。每個重點數字都能往下點開看細節。這是「方法公開」做到極致的展示。",
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
    body: "ZONE 27 不追蹤訪客足跡 · 不藏引擎內部的算法 · 不藏失敗的預測。這不是技術限制 · 是品牌哲學。寫在 /privacy 第 03 節 + /audit 第 05 節,違反就是品牌信用自殺。",
    evidenceHref: "/privacy",
    evidenceLabel: "/privacy Section 03",
  },
  {
    title: "永遠不接受創投 / 不投放廣告 / 不上市",
    body: "ZONE 27 靠 BLACK 會員費自己撐起來 · 不拿創投。一旦拿了創投,就會被逼著追求「營收每年衝幾十倍」,跟「慢慢長、靠會員自籌」的本質衝突。",
    evidenceHref: "/manifesto",
    evidenceLabel: "/manifesto Section II",
  },
  {
    title: "永遠不覆蓋全部可下注賽事 / 不寄生運彩平台",
    body: "覆蓋原則:只覆蓋引擎能誠實計算的場次。為了搜尋曝光 / 衝流量而上架數百場品質次等的比賽 = 變成運彩平台。從博彩平台抓資料 = 跟博彩綁在一起 = 定位崩潰。",
    evidenceHref: "/coverage",
    evidenceLabel: "/coverage",
  },
  // Round 29 Wave 10B research agent surface · 2026 #1 indie launch
  // playbook(Tom Orbach $50K/72h · 70% revenue in 72 hours · warm
  // 5K+ email list blitz)wrong for ZONE 27 · 升 /now UNRESOLVED ephemeral
  // 為 /roadmap BRAND BOUNDARIES canonical permanent decision。
  {
    title: "永遠不做「對暖名單大聲開賣」的 72 小時衝刺",
    body: "2026 年最紅的獨立產品上線玩法(靠 5,000+ 人的名單在 72 小時內衝 $50K、七成營收集中在頭三天)對 ZONE 27 不適用:(1)我們刻意低調潛行 ·「大聲喧嘩」跟初衷相反 ·(2)死忠棒球迷不在那些科技創業圈 · 72 小時的觸及打不到對的人。對的節奏:6 到 18 個月慢慢累積會員 · /membership 第 1 天跟第 400 天長得一樣 · 不靠倒數催 · 這份慢本身就是篩選的證明。",
  },
];

export default function RoadmapPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

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
          <Link
            href="/track-record"
            className="text-gold underline-offset-4 hover:underline"
          >
            公開戰績
          </Link>
          {" "}是過去的事實 · 這頁是未來的承諾。
          <strong className="text-bone">公開鐵律比含糊承諾更難</strong> —
          所以底下有一個「BRAND BOUNDARIES」section · 跟 LOCKED / EXPLORING 同等視覺權重。
        </p>
        <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
          沒有「即將推出 · 敬請期待」的銷售話術 · 沒有「正在規劃」的模糊承諾 ·
          只有 LOCKED(時程 + 邏輯都已定)· EXPLORING(在研究的)·
          BRAND BOUNDARIES(品牌守則 · 不變的鐵律)。
        </p>
        <div className="mt-6">
          <ArticleMeta readingMin={4} />
        </div>
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
          這些事的時程 · 範圍 · 上線狀態,我們敢承諾。
          每一項都附了證據連結 · 不是空話。
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
          公開寫下的鐵律,就是我們說到做到的證據。
          寫進這一段之後 · 任何違背的舉動,讀者都能拿出來對照 ·
          這等於逼我們自己守紀律 · 讀者也成了品牌的守門人。
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
            「沒有商業機密 · 沒有藏起來的算法 · 沒有偷偷保留的未來計劃。」
          </p>
          <p
            lang="en"
            className="font-mono text-gold/70 text-sm tracking-[0.25em] mb-6"
          >
            FULL DISCLOSURE · PAST · PRESENT · FUTURE
          </p>
          <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
            公開戰績是過去 · 首頁是現在 · /roadmap 是未來。
            三端封閉時間軸 = 訪客可在任意時刻檢驗我們是否守諾。
          </p>
        </div>
      </section>

      <FounderSignOff>
        <p>
          寫公開 roadmap 是<strong>逼自己的承諾機制</strong>。
        </p>
        <p>
          EXPLORING 區塊那幾項都還沒落地 · BRAND BOUNDARIES 區塊那幾項
          是我已經想清楚不做。任何項目 timing 偏差 · 都會留下公開、不可改的紀錄。
        </p>
        <p>
          沒有「即將推出」的銷售話術 · 只有 LOCKED / EXPLORING /
          BRAND BOUNDARIES 三類 · 寫進來等於穿上枷鎖。
        </p>
      </FounderSignOff>

      <RelatedReading currentPath="/roadmap" />

      {/* ── BACK ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
        <Link
          href="/track-record"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
        >
          ← 看過去的事實 · 公開戰績
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
