import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";

export const metadata: Metadata = {
  title: "Coverage — 我們覆蓋哪些賽事 · 為什麼不覆蓋全部",
  description:
    "ZONE 27 不覆蓋每一場可下注的比賽,只覆蓋引擎可以誠實計算的比賽。完整公開:作用中的聯盟、追蹤但未啟用的賽事、創始會員可投票請求的賽事、我們永遠不會覆蓋的(博彩平台清單)。",
};

// ── ZONE 27 · /coverage — Coverage Manifesto ───────────
// The fourth trust-artifact page (joining /audit /methodology /privacy).
//
// /audit       = what the model is
// /methodology = how the model works
// /privacy     = what we don't collect
// /coverage    = what we cover, what we don't, and why
//
// Six section spine, mirroring /audit's Anthropic-style structure:
//   01 Coverage Philosophy
//   02 Active Leagues (engine ready)
//   03 Tracked, Not Activated (engine available, sample concerns)
//   04 Requested by Founders (vote-to-activate queue)
//   05 What We'll Never Cover (brand defense — betting platforms)
//   06 Data Sources (open ledger of where data comes from)
// ─────────────────────────────────────────────────────

const LAST_REVIEWED = "2026-05-21";

type StatusKey = "READY" | "HAND_CURATED" | "DEMO" | "AVAILABLE" | "PENDING" | "NEVER";

const STATUS_STYLE: Record<StatusKey, string> = {
  READY:
    "text-gold border-gold/60 bg-gold/5",
  HAND_CURATED:
    "text-gold border-gold/50 bg-gold/5",
  DEMO:
    "text-bone border-bone/60 bg-bone/5",
  AVAILABLE:
    "text-mute border-mute/40 bg-mute/5",
  PENDING:
    "text-mute border-mute/30",
  NEVER:
    "text-loss border-loss/40 bg-loss/5",
};

function StatusBadge({ status, label }: { status: StatusKey; label?: string }) {
  return (
    <span
      lang="en"
      className={`inline-flex items-center px-2 py-0.5 border font-mono text-[10px] tracking-[0.18em] ${STATUS_STYLE[status]}`}
    >
      {label ?? status}
    </span>
  );
}

type LeagueRow = {
  code: string;
  zh: string;
  source: string;
  sampleNote: string;
  status: StatusKey;
  statusLabel?: string;
};

const ACTIVE_LEAGUES: LeagueRow[] = [
  {
    code: "MLB",
    zh: "美國職棒大聯盟",
    source: "statsapi.mlb.com · 官方公開 API",
    sampleNote: "全季 ~2,430 場 · 投手 N 普遍 ≥ 15",
    status: "READY",
  },
  {
    code: "CPBL",
    zh: "中華職棒",
    source: "stats.cpbl.com.tw · 官方公開資料 · 由 Tim 親手讀過每一場 + 寫進引擎",
    sampleNote: "目標 ~240 場/年 · 創辦人親自 curate · 自動化等 Founders 27 滿員後啟動",
    status: "HAND_CURATED",
    statusLabel: "HAND-CURATED",
  },
];

const TRACKED_NOT_ACTIVE: LeagueRow[] = [
  {
    code: "AAA / AA",
    zh: "MLB 高階小聯盟",
    source: "statsapi.mlb.com(同 MLB · 不同 leagueIds)",
    sampleNote: "資料可取 · 但球員流動率高 · 樣本變異大 · 預測誤差會放大",
    status: "AVAILABLE",
    statusLabel: "AVAILABLE · SUPPRESSED",
  },
];

const REQUESTED_QUEUE: LeagueRow[] = [
  {
    code: "NPB",
    zh: "日本職棒",
    source: "npb.jp · Yahoo Japan Sports · TBD pipeline",
    sampleNote: "創始會員可投票優先順序",
    status: "PENDING",
    statusLabel: "NOT YET · ON QUEUE",
  },
  {
    code: "KBO",
    zh: "韓國職棒",
    source: "koreabaseball.com · mykbo.net (community) · TBD pipeline",
    sampleNote: "創始會員可投票優先順序",
    status: "PENDING",
    statusLabel: "NOT YET · ON QUEUE",
  },
  {
    code: "NCAA D1",
    zh: "美國大學一級棒球",
    source: "NCAA stats portal · 公開",
    sampleNote: "球員身分變動極大 · 樣本可信度需逐校評估",
    status: "PENDING",
    statusLabel: "NOT YET · ON QUEUE",
  },
];

const NEVER_COVER: { name: string; reason: string }[] = [
  {
    name: "台灣運彩 article.sportslottery.com.tw",
    reason: "博彩平台 · 抓資料會綁定 ZONE 27 與運彩,違反 /about /faq /privacy 已寫死的定位",
  },
  {
    name: "玩運彩 playsport.cc/forum",
    reason: "Taiwan 最大運彩討論區 · tipster ranking + 牌支戰績 + 「老師」生態 · 跟 ZONE 27 brand IP 結構相反(我們 0 % 創作者抽成 · 不販售明牌 · 不排 tipster)· Round 30 加 · per [[zone27-coverage-philosophy]]「reject gambling-platform scraping」",
  },
  {
    name: "報馬仔 fengyuncai.com",
    reason: "明牌販售平台 · 同上邏輯",
  },
  {
    name: "Sportradar / Stats Perform / Pinnacle 等付費 API",
    reason: "年費 NT$ 200K+ · ZONE 27 是 stealth indie · 永遠不走付費資料封閉路線",
  },
  {
    name: "任何要求登入 / 違反 ToS / 私下繞付費牆的來源",
    reason: "技術可行也不做 · 法律風險 + 品牌風險 + 訊號可信度受質疑",
  },
];

export default function CoveragePage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div
            lang="en"
            className="print-only mb-6 pb-3 border-b border-line/60 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            <div className="flex justify-between gap-4">
              <span>ZONE 27 — COVERAGE LEDGER v0.28</span>
              <span>PRINTED · zone27-web.vercel.app/coverage</span>
            </div>
          </div>

          {/* ── HEADER ──────────────────────────────── */}
          <header className="pb-10 border-b border-line/60">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
            >
              COVERAGE LEDGER
            </p>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-6">
              我們覆蓋哪些賽事 ·{" "}
              <span className="text-mute">為什麼不覆蓋全部</span>
            </h1>

            {/* Round 12 brand-IP amplification (Agent A #5 · Pinnacle
                "Winners Welcome" pattern). One-line audience filter
                crystallizes the 6-section policy below. Pratfall-safe:
                explicitly repelling娛樂下注者 strengthens hardcore-fan
                signal (Aronson 1966 / Spence 1973 costly signaling). */}
            <p className="text-bone text-lg sm:text-xl leading-relaxed mb-6 border-l-2 border-gold/60 pl-5 sm:pl-6 max-w-2xl">
              <strong>ZONE 27 不為娛樂下注者優化。</strong>
              <br />
              <span className="text-mute">
                我們服務的是想看見<span className="text-gold">模型誠實程度</span>的硬核棒球迷。
              </span>
            </p>
            <div className="mb-6">
              <ArticleMeta readingMin={8} />
            </div>

            <p className="text-mute text-base leading-relaxed mb-8 max-w-2xl">
              這頁列出我們覆蓋什麼 · 不覆蓋什麼 · 為什麼。
              ZONE 27 不是「所有可下注賽事的預測 vending machine」 ·
              只覆蓋引擎能誠實計算的比賽。
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 pt-4 font-mono text-[10px] tracking-[0.18em] section-reveal">
              <div>
                <span lang="en" className="text-mute block mb-1">VERSION</span>
                <span className="text-bone tabular">v0.28</span>
              </div>
              <div>
                <span lang="en" className="text-mute block mb-1">ACTIVE LEAGUES</span>
                <span className="text-gold tabular">2</span>
              </div>
              <div>
                <span lang="en" className="text-mute block mb-1">ON QUEUE</span>
                <span className="text-bone tabular">{REQUESTED_QUEUE.length}</span>
              </div>
              <div>
                <span lang="en" className="text-mute block mb-1">LAST REVIEWED</span>
                <span className="text-bone tabular">{LAST_REVIEWED}</span>
              </div>
            </div>
          </header>

          {/* ── 00 NEVER COVER ABOVE-THE-FOLD · Round 38 W-D ─
              Agent C P4 ship · 玩運彩 escapee 最強 60-second proof-of-
              difference 從 section 05 ~80% scroll 移到 above-the-fold ·
              compact NeverCoverChip preview · 完整 5-item NEVER list 仍
              在 deep section 05。 P3 casual visitor + P2 sabermetrician
              + P4 escapee 三 persona 同時 helped。 brand IP「品牌定義 not
              限制」 axiom 物理 visible 在 visitor 進入後第一個 fold。 */}
          <section className="py-10 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-gold/90 text-[10px] tracking-[0.45em] mb-3">
              00 · BRAND BOUNDARY · WHAT WE&apos;LL NEVER COVER
            </p>
            <p className="text-bone text-base sm:text-lg leading-relaxed mb-5 max-w-2xl">
              來自 玩運彩 / 報馬仔 / 殺手平台 / 任何博彩生態 ·{" "}
              <span className="text-gold">我們永遠不接</span>。
              下方是完整 5-item list 的 quick preview · 點 §05 看 reasoning。
            </p>
            <div className="flex gap-2 flex-wrap">
              {NEVER_COVER.map((item, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[10px] tracking-[0.22em] px-2.5 py-1.5 border border-loss/40 bg-loss/5 text-mute"
                >
                  ✕ {item.name.split(" ")[0]}
                </span>
              ))}
            </div>
            <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              <Link href="#never-cover" className="text-gold hover:text-gold-soft transition-colors">
                ↓ 完整 reasoning(§05)
              </Link>
            </p>
          </section>

          {/* ── 01 PHILOSOPHY ─────────────────────────── */}
          <section className="py-12 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4">
              01 COVERAGE PHILOSOPHY
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              覆蓋是策展,不是清單
            </h2>
            <div className="space-y-4 text-mute leading-relaxed">
              <p>
                量化預測模型只有在輸入夠穩定時才能輸出有意義的訊號。
                ZONE 27 引擎需要每位投手最少 N≥10 場樣本、確認的先發陣容、
                以及樣本充足的球場 / 氣象因子。沒有這些,
                Monte Carlo 跑 10,000 次只是把雜訊放大。
              </p>
              <p>
                所以我們不假裝覆蓋一切。當某場比賽的輸入不足,我們直接告訴您
                「<span lang="en" className="font-mono text-bone">ENGINE PENDING · 等待先發資訊</span>」
                或「<span lang="en" className="font-mono text-bone">ENGINE WAIVED · 樣本 n&lt;10</span>」。
                這個「沒覆蓋」本身就是我們的 trust artifact —
                <span className="text-bone"> 我們選擇沉默,而不是製造雜訊</span>。
              </p>
              <p>
                Apple 不做 $99 智慧型手機。Stripe 不接 PayPal 的長尾市場。
                ZONE 27 不覆蓋雜訊賽事。<span className="text-bone">少做,做好。</span>
              </p>
            </div>
          </section>

          {/* ── 02 ACTIVE LEAGUES ─────────────────────── */}
          <section className="py-12 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4">
              02 ACTIVE LEAGUES
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              引擎已就緒,資料流動中
            </h2>
            <LeagueTable rows={ACTIVE_LEAGUES} />

            {/* Round 46 W-B · Agent L R44 question canary fire · Tim 直問
                MLB 是否 auto-fetch · /coverage 應該 honest document MLB
                vs CPBL hybrid data flow · brand IP「方法公開」 延伸到 data
                pipeline layer 本身。 */}
            <div className="mt-8 border border-gold/30 bg-slate/30 p-5 sm:p-7">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
              >
                ⚙ DATA PIPELINE TRANSPARENCY · auto vs manual
              </p>
              <p className="text-mute text-sm leading-relaxed mb-4">
                ZONE 27 不是同一 ingestion 模式 · 兩聯盟各 honest disclose:
              </p>
              <div className="space-y-4 text-sm">
                <div className="border-l-2 border-gold/60 pl-4">
                  <p className="font-mono text-gold/90 text-[10px] tracking-[0.3em] mb-2">
                    MLB · 100% AUTOMATIC ✓
                  </p>
                  <p className="text-mute leading-relaxed">
                    MLB Stats API(<code className="font-mono text-bone bg-slate/40 px-1.5 py-0.5 rounded-sm text-[10px]">statsapi.mlb.com</code>)
                    · 10-min ISR(Vercel auto-cache)· 0 cost · 0 API key ·
                    全部 ~15 daily games · pitchers · K9 BB9 HR9 ERA · venue ·
                    time · 0 founder intervention。
                  </p>
                </div>
                <div className="border-l-2 border-line/60 pl-4">
                  <p className="font-mono text-bone/90 text-[10px] tracking-[0.3em] mb-2">
                    CPBL · HYBRID(50% auto · 50% manual)⚠
                  </p>
                  <p className="text-mute leading-relaxed mb-2">
                    cpbl.com.tw 是 server-rendered HTML 不是 SPA · cheerio
                    parsing pattern works · 3 scripts auto-fetch:
                  </p>
                  <ul className="space-y-1.5 text-mute/85 pl-4 leading-relaxed">
                    <li>▸ <code className="font-mono text-bone bg-slate/40 px-1 rounded-sm text-[10px]">npm run fetch-cpbl</code> · pitcher K9/BB9/HR9 leaderboard auto-parse</li>
                    <li>▸ <code className="font-mono text-bone bg-slate/40 px-1 rounded-sm text-[10px]">npm run fetch-cpbl-advanced</code> · Trackman radar 進階 stats(野球革命)</li>
                    <li>▸ <code className="font-mono text-bone bg-slate/40 px-1 rounded-sm text-[10px]">npm run fetch-cpbl-schedule</code> · 今日賽程 metadata(R46 W-A NEW)</li>
                  </ul>
                  <p className="text-mute/85 leading-relaxed mt-2">
                    剩 1 manual step:<strong className="text-bone">賽後 box score finalResult</strong> ·
                    Tim 22:30+ TPE screenshot ingest · 因 brand IP「物理時刻 +
                    賽前/賽後 strict timing」 不可 auto · 賽後 receipt 真實
                    PROVED/DIVERGED 等大 公開。
                  </p>
                </div>
              </div>
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mt-4">
                ⚓ 為什麼 hybrid · 不全 auto:CPBL 沒 official API(僅 server-
                rendered HTML)· 賽程 + pitcher stats 可 cheerio parse · box
                score finalResult 賽後 timing-critical · Tim 親手 ingest 是
                brand IP physical signature(同 /audit S05 PRE-COMMIT pattern)·
                不可 silently 自動化(若 auto · 可 backdate · 失 trust signal)。
              </p>
            </div>
          </section>

          {/* ── 03 TRACKED, NOT ACTIVE ────────────────── */}
          <section className="py-12 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4">
              03 TRACKED · NOT ACTIVATED
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              引擎可取,但我們選擇先不開
            </h2>
            <p className="text-mute leading-relaxed mb-6">
              這些聯盟我們**取得到資料**,但**選擇不啟用** —
              因為樣本變異大、誤差會放大,違反「不靠直覺,只看演算法」的承諾。
              當資料品質改善或創始會員強烈要求時,我們會評估啟用。
            </p>
            <LeagueTable rows={TRACKED_NOT_ACTIVE} />
          </section>

          {/* ── 04 REQUESTED BY FOUNDERS ──────────────── */}
          <section className="py-12 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4">
              04 REQUESTED · ON QUEUE
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              創始會員投票決定下一個 league
            </h2>
            <p className="text-mute leading-relaxed mb-6">
              這些聯盟在我們的雷達上,但資料管道還沒建。
              <Link
                href="/founders"
                className="text-gold hover:text-gold-soft transition-colors"
              >
                Founders 27 創始會員
              </Link>
              可在每月會議投票決定下個啟用順序。一般會員可以申請,但優先順序由創始會員決定。
            </p>
            <LeagueTable rows={REQUESTED_QUEUE} />
          </section>

          {/* ── 05 NEVER COVER ────────────────────────── */}
          <section id="never-cover" className="py-12 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4">
              05 WHAT WE&apos;LL NEVER COVER
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              不是技術不可,是品牌不為
            </h2>
            <p className="text-mute leading-relaxed mb-6">
              這些來源我們**永遠不會**接入,即使技術可行、即使您要求。
              不是限制,是品牌定義 — 一旦我們的賽事清單等於博彩平台的開盤清單,
              ZONE 27 就和「明牌販售」是同一個生態系。
            </p>

            <div className="space-y-3">
              {NEVER_COVER.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-loss/30 bg-loss/5 font-mono text-[12px]"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <StatusBadge status="NEVER" />
                    <span lang="en" className="text-bone leading-relaxed">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-mute leading-relaxed pl-1">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-mute leading-relaxed mt-8 pt-6 border-t border-line/30">
              如果您想要的是「**全部可下注賽事的勝率清單**」,那是另一個產品,不是 ZONE 27。
              That&apos;s the entire point.
            </p>
          </section>

          {/* ── 06 DATA SOURCES LEDGER ────────────────── */}
          <section className="py-12 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4">
              06 DATA SOURCES · OPEN LEDGER
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              所有資料來源 · 公開可查
            </h2>
            <p className="text-mute leading-relaxed mb-8">
              我們只用**公開可取得**的來源。沒有付費 API。沒有繞付費牆。
              沒有違反 ToS 的爬蟲。沒有未經授權的私人資料庫。
              每一筆預測都可以從以下來源向前追溯。
            </p>

            <div className="border border-line/40 divide-y divide-line/30">
              <SourceRow
                league="MLB"
                source="statsapi.mlb.com"
                license="MLB 公開 API · 商業使用受 MLB ToS 限制 · 我們做的是匿名分析,合規"
                status="READY"
              />
              <SourceRow
                league="MLB Minor"
                source="statsapi.mlb.com (同上 · 不同 leagueIds)"
                license="同 MLB · 我們抑制顯示直到樣本品質夠"
                status="AVAILABLE"
              />
              <SourceRow
                league="CPBL"
                source="stats.cpbl.com.tw"
                license="官方公開展示 · 無 API · 創辦人親手讀每場比賽 → 寫進引擎 · 自動化等規模到時再評估"
                status="HAND_CURATED"
              />
              <SourceRow
                league="NPB"
                source="npb.jp · Yahoo Japan · TBD"
                license="多來源評估中 · 優先選擇官方 + 公開"
                status="PENDING"
              />
              <SourceRow
                league="KBO"
                source="koreabaseball.com · mykbo.net (community)"
                license="官方 + 社群維護資料庫 · 評估中"
                status="PENDING"
              />
              <SourceRow
                league="NCAA"
                source="NCAA stats portal"
                license="公開資料 · 但球員身分變動大 · 樣本可信度需逐校評估"
                status="PENDING"
              />
            </div>
          </section>

          {/* ── FINAL CTA / SHARE ─────────────────────── */}
          <section className="py-12">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4"
            >
              FOR THE READER
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              如果這份覆蓋哲學讓您點頭 · 您是我們在找的人
            </h2>
            <p className="text-mute leading-relaxed mb-8 max-w-2xl">
              ZONE 27 找的不是「想要更多賽事預測」的人 — 那是博彩平台的客戶。
              我們找的是「**寧可少看一場,也不要看雜訊**」的人。如果這聽起來像您,
              <Link href="/founders" className="text-gold hover:text-gold-soft transition-colors">
                {" "}Founders 27 創始名冊{" "}
              </Link>
              還開著。
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/founders"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-navy hover:bg-gold-soft transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                加入創始名冊 →
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-5 py-3 border border-line/60 hover:border-gold/60 text-mute hover:text-gold transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                <span lang="en">VIEW MODEL REPORT</span>
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-line/40">
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-4">
                把這份覆蓋哲學傳給可能在意的朋友 ·{" "}
                <span lang="en">SHARE THE LEDGER</span>
              </p>
              <CopyLinkButton refTag="coverage-share" />
            </div>
          </section>

          <FounderSignOff>
            <p>
              我不覆蓋所有 CPBL 比賽 · 也不打算。
              <strong>引擎能算出有意義數字的</strong>才上 /matches ·
              算不出的就誠實 mark 為 PREVIEW。
            </p>
            <p>
              這個 filter 是我的品味 · 也是 ZONE 27 的牆。
              覆蓋越廣不等於越強 · 倒置 SaaS 預設「全包才贏」。
            </p>
            <p>
              想看哪場我沒覆蓋的 · 您填表單告訴我 · 我會評估能不能誠實算。
            </p>
          </FounderSignOff>

          <RelatedReading currentPath="/coverage" />
        </article>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-component: LeagueTable ─────────────────────────
function LeagueTable({ rows }: { rows: LeagueRow[] }) {
  return (
    <div className="border border-line/40 divide-y divide-line/30">
      {rows.map((row) => (
        <div
          key={row.code}
          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
        >
          <div className="sm:w-32 shrink-0">
            <p lang="en" className="font-mono text-gold text-sm tracking-[0.22em] mb-1">
              {row.code}
            </p>
            <p className="text-mute text-xs">{row.zh}</p>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-bone text-sm leading-relaxed">{row.source}</p>
            <p className="text-mute text-xs leading-relaxed">{row.sampleNote}</p>
          </div>

          <div className="shrink-0">
            <StatusBadge status={row.status} label={row.statusLabel} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sub-component: SourceRow ───────────────────────────
function SourceRow({
  league,
  source,
  license,
  status,
}: {
  league: string;
  source: string;
  license: string;
  status: StatusKey;
}) {
  return (
    <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-3 sm:gap-6 items-start">
      <p
        lang="en"
        className="font-mono text-gold text-[12px] tracking-[0.22em] shrink-0"
      >
        {league}
      </p>
      <div className="space-y-1 min-w-0">
        <p
          lang="en"
          className="font-mono text-bone text-xs break-all leading-relaxed"
        >
          {source}
        </p>
        <p className="text-mute text-xs leading-relaxed">{license}</p>
      </div>
      <div className="shrink-0">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
