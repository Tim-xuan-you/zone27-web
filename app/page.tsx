import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroLiveCard from "@/components/HeroLiveCard";
import { matches } from "@/lib/matches";

export default function Home() {
  // ── ZONE 27 首頁靈魂 ───────────────────────────────
  // Hero card 從 v0.21 起改為 LIVE — 訪客打開首頁的當下,
  // 演算法在他眼前跑出收斂。資料源自 lib/matches.ts。
  //
  // Defense: matches[0] is undefined-safe — if matches.ts is empty
  // (migration in progress), the Hero falls back to a static
  // "engine ready" card instead of crashing.
  // ─────────────────────────────────────────────────
  const featuredMatch = matches[0];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="home" />

      <main id="main">
      {/* ── HERO ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 sm:px-10 pt-24 pb-12 text-center">
        <p
          lang="en"
          className="font-mono text-gold/70 text-xs tracking-[0.4em] mb-8"
        >
          A QUANTITATIVE SPORTS INTELLIGENCE CLUB · EST. 2026
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          不靠直覺,
          <br />
          <span className="text-gold">只看演算法。</span>
        </h1>

        <p
          lang="en"
          className="font-mono text-mute text-sm tracking-[0.3em] mt-8"
        >
          WE DON&apos;T GUESS. WE COMPUTE.
        </p>

        <p className="mt-10 max-w-xl mx-auto text-mute leading-relaxed">
          全台第一個為硬核棒球迷打造的暗黑黃金級數據俱樂部。
          <br />
          蒙地卡羅模擬器 · git 不可篡改紀錄 · 創作者抽成 0%(Founders 27)/ 5%(BLACK CARD)。
        </p>

        {/* Hero CTAs · 5-second-test compliance · visitors get an
            action point immediately after the slogan + description.
            Primary CTA drives to /founders (highest conversion intent);
            secondary lets quant-curious visitors taste the engine first
            (typical for premium founder-led brands · Linear, Stripe,
            Plaid all have dual hero CTAs). */}
        <div className="mt-12 flex flex-wrap gap-3 sm:gap-4 justify-center">
          <Link
            href="/founders"
            className="px-7 sm:px-9 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
          >
            加入創始名冊 →
          </Link>
          <Link
            href="/lab"
            className="px-7 sm:px-9 py-3 border border-gold/50 text-gold text-xs tracking-[0.3em] hover:bg-gold/10 transition-colors"
          >
            親手跑一場引擎 →
          </Link>
        </div>

        {/* Newcomer entry — for visitors who don't yet know what K/9 is.
            Quiet text link · doesn't compete with the 2 primary CTAs ·
            but gives "I'm curious but uninitiated" visitors a non-
            intimidating door. /learn is the 5-min primer page. */}
        <div className="mt-6">
          <Link
            href="/learn"
            className="inline-block font-mono text-mute hover:text-gold text-[10px] sm:text-[11px] tracking-[0.3em] transition-colors"
          >
            沒聽過 Bill James? · 5 分鐘入門 →
          </Link>
        </div>
      </section>

      {/* ── CREDIBILITY STRIP ──────────────────────── */}
      {/* Trust-layer signals before any conversion-layer CTA.
          Research finding: credibility signals placed BEFORE the
          ask raise conversion 20-30%. ZONE 27 has no customer
          logos to show (stealth) — but we can show real data
          provenance + open methodology + reproducibility. */}
      <section
        aria-label="Data sources and methodology"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-2"
      >
        <div className="border-y border-line/40 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 text-center sm:text-left">
            <CredibilityCell
              label="DATA"
              zh="資料來源"
              body={
                <>
                  MLB Stats API · CPBL{" "}
                  <Link
                    href="/coverage"
                    className="text-gold hover:underline"
                  >
                    親手 curate
                  </Link>
                </>
              }
            />
            <CredibilityCell
              label="ENGINE"
              zh="演算法"
              body={
                <>
                  Monte Carlo ×{" "}
                  <span className="text-bone tabular">10,000</span> · 真實打席 · 在您瀏覽器跑
                </>
              }
            />
            <CredibilityCell
              label="METHOD"
              zh="方法論"
              body={
                <>
                  全部公開於{" "}
                  <Link
                    href="/audit"
                    className="text-gold hover:underline"
                  >
                    /audit
                  </Link>
                  {" + "}
                  <Link
                    href="/methodology"
                    className="text-gold hover:underline"
                  >
                    /methodology
                  </Link>
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* ── HAIRLINE GOLD DIVIDER ──────────────────── */}
      <div className="mx-auto w-32 gold-line mt-16 mb-16" />

      {/* ── THE SIGNATURE PREDICTION CARD (LIVE) ───── */}
      <section className="mx-auto w-full max-w-3xl px-6 sm:px-10 pb-24">
        {featuredMatch ? (
          <HeroLiveCard match={featuredMatch} />
        ) : (
          <EmptyHeroCard />
        )}

        {/* Tiny note under card */}
        <p className="text-center font-mono text-mute text-[10px] tracking-[0.25em] mt-6">
          AI 計算的是機率,不是命運
        </p>
      </section>

      {/* ── THREE PILLARS ──────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 py-24 border-t border-line/40">
        <div className="grid sm:grid-cols-3 gap-12">
          <Pillar
            no="01"
            zh="會員制低抽成"
            en="LOW COMMISSION"
            body="運彩 / 報馬仔 30-50% 抽成 · ZONE 27 創始會員 0% / 黑金會員 5%。創作者賣明牌的錢絕大部分回到自己口袋。"
          />
          <Pillar
            no="02"
            zh="不可篡改紀錄"
            en="TRANSPARENT BY DESIGN"
            body="預測一旦寫進 git commits · 永久公開於 GitHub。沒有 LINE 群組刪文 · 沒有截圖造假 · 只有可被任何人 cross-check 的歷史。"
          />
          <Pillar
            no="03"
            zh="即時 Monte Carlo"
            en="LIVE IN-BROWSER ENGINE"
            body="10,000 場模擬 ~2 秒在您 CPU 收斂 · REPLAY 一場 9 局逐打席文字直播 · 引擎 GitHub 全開源。"
          />
        </div>
      </section>

      {/* ── BRAND INVERSION THESIS ───────────────────
          The 4 brand axioms built across 2026-05-20 memory work
          (monetization / disclosure / coverage / musk-methodology)
          were spread across detail pages. Homepage TLDR makes the
          inversion thesis articulable in 5 seconds. Hub-and-spoke
          to each detail page for visitors who want the proof. */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-24 border-t border-line/40">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8 text-center"
        >
          INVERTED BY DESIGN
        </p>
        <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-16 max-w-2xl mx-auto leading-snug">
          每個「我們不做」,
          <br />
          都是「我們是誰」的證明
        </h2>

        <div className="space-y-8 sm:space-y-10">
          <InversionRow
            industry="藏 model weights"
            zone27="完整公開引擎"
            href="/audit"
            hrefLabel="/audit 8 sections"
          />
          <InversionRow
            industry="收 per-use 費用"
            zone27="工具免費,身分付費"
            href="/lab/custom"
            hrefLabel="/lab/custom"
          />
          <InversionRow
            industry="覆蓋全部博彩賽事"
            zone27="引擎能誠實算的才覆蓋"
            href="/coverage"
            hrefLabel="/coverage"
          />
          <InversionRow
            industry="追蹤訪客行為"
            zone27="0 第三方 cookies"
            href="/privacy"
            hrefLabel="/privacy Section 03"
          />
        </div>

        {/* CTA into the long-form canonical version. The 4 rows above
            are the 5-second TLDR · /manifesto is the 5-minute read with
            the full "why we accept the cost" argument. */}
        <div className="mt-14 text-center">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-3 font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.3em] hover:opacity-80 transition-opacity"
          >
            <span>完整宣言 · 5 分鐘讀懂這 4 個倒置</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ── BY THE NUMBERS · proof bento ─────────────
          Stripe + Linear modular bento pattern · research-driven.
          Each tile = concrete number + verifiable source link.
          Converts abstract trust claims into clickable evidence.
          Aligned with /manifesto Section V (公開複製不走的算法)
          + Section I (DISCLOSURE) — every claim has a citation. */}
      <section
        aria-labelledby="proof-numbers-heading"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 py-24 border-t border-line/40"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3 text-center">
          BY THE NUMBERS · 訪客可逐一驗證
        </p>
        <h2
          id="proof-numbers-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-12 max-w-xl mx-auto leading-snug"
        >
          每個數字都連到證據,
          <br className="sm:hidden" />
          不是行銷詞。
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-line/30">
          <ProofTile
            big="270"
            label="Founders 27 限量名額"
            verify="LEADERBOARD"
            href="/leaderboard"
            note="全宇宙 270 個 · 售完永久關閉"
          />
          <ProofTile
            big="10,000"
            label="每次模擬虛擬比賽數"
            verify="LAB · LIVE"
            href="/lab"
            note="在您本機 CPU 跑 · ~2 秒收斂"
            gold
          />
          <ProofTile
            big="8"
            label="Audit 公開 sections"
            verify="MODEL REPORT"
            href="/audit"
            note="假設 · 輸入 · 排除 · 失敗模式全列"
          />
          <ProofTile
            big="27"
            label="進階指標完整解釋"
            verify="GLOSSARY"
            href="/glossary"
            note="K/9 · WHIP · wOBA · BABIP · ..."
          />
          <ProofTile
            big="0"
            label="第三方 trackers 安裝"
            verify="PRIVACY · S03"
            href="/privacy"
            note="無 GA · 無 Pixel · 無 Hotjar · 無 cookies"
            gold
          />
          <ProofTile
            big="MIT"
            label="完整原始碼開源"
            verify="GITHUB"
            href="https://github.com/Tim-xuan-you/zone27-web"
            note="200 行 simulator.ts · 30 分鐘可 fork"
            external
          />
        </div>

        <p className="mt-10 text-center font-mono text-mute text-[10px] tracking-[0.3em] max-w-xl mx-auto leading-relaxed">
          每個 tile 點進去都能驗證 · 沒有「相信我們」這 4 個字
        </p>
      </section>

      {/* ── TRUST STACK · 6 trust artifact pages ────
          The site's full disclosure infrastructure visualized as
          one grid. Visitors see "there are 6 deep documents you
          can read" instead of "there's an about page." Each card
          links to the full artifact. Discoverability + scale signal
          combined.
          Pattern source: Anthropic transparency hub navigation +
          Plausible "Funded by · Owned by" footer stack. */}
      <section
        aria-labelledby="trust-stack-heading"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 py-24 border-t border-line/40"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3 text-center">
          TRUST STACK · 6 DEEP DOCUMENTS
        </p>
        <h2
          id="trust-stack-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4 max-w-xl mx-auto leading-snug"
        >
          這個品牌的<span className="text-gold">每一個主張</span>,
          <br />
          都有一份完整文件當證據。
        </h2>
        <p className="text-center text-mute text-sm mb-14 max-w-xl mx-auto leading-relaxed">
          競爭品牌通常有 1 頁「About」+ 1 頁「Privacy」。
          ZONE 27 有 6 個 trust artifact pages · 累積 40+ sections。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line/30">
          <TrustCard
            no="01"
            href="/manifesto"
            title="倒置宣言"
            subtitle="MANIFESTO"
            sections="6 sections"
            desc="4 個刻意倒置軸線 + 方法公開 · 品味私藏 framing"
          />
          <TrustCard
            no="02"
            href="/audit"
            title="模型報告"
            subtitle="MODEL REPORT"
            sections="8 sections"
            desc="假設 · 輸入 · 排除清單 · 已知失效模式 · 環境衝擊"
            gold
          />
          <TrustCard
            no="03"
            href="/methodology"
            title="技術白皮書"
            subtitle="METHODOLOGY"
            sections="10 sections"
            desc="蒙地卡羅引擎 · PA 機率推導 · 收斂驗證 · 路線圖"
          />
          <TrustCard
            no="04"
            href="/coverage"
            title="覆蓋範圍"
            subtitle="COVERAGE"
            sections="6 sections"
            desc="active / tracked / requested / never · 完整 ledger"
          />
          <TrustCard
            no="05"
            href="/privacy"
            title="隱私政策"
            subtitle="PRIVACY"
            sections="8 sections"
            desc="我們收什麼(5 個欄位) + 不收什麼(7 大項)"
            gold
          />
          <TrustCard
            no="06"
            href="/discipline"
            title="鐵律"
            subtitle="DISCIPLINE"
            sections="5 sections"
            desc="Buffett 信譽 + Musk 第一原理 + Costco 會員制"
          />
        </div>

        <p className="mt-10 text-center font-mono text-mute text-[10px] tracking-[0.3em] max-w-xl mx-auto leading-relaxed">
          每份文件都可以截圖傳給朋友 · 不需要您解釋一個字
        </p>
      </section>

      {/* ── FOUNDERS 27 STRIP ──────────────────────── */}
      <section
        aria-labelledby="founders-strip-heading"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          FOUNDERS · 27
        </p>
        <h2
          id="founders-strip-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight"
        >
          僅限 270 位創始會員
        </h2>
        <p className="text-mute mt-4 max-w-md mx-auto leading-relaxed">
          一次性 NT$ 2,700 終身會員資格 · 個人 ID 鑲入 #001 ~ #270 編號徽章
          · 售完永久關閉。
        </p>
        <Link
          href="/founders"
          className="inline-block mt-8 px-10 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          加入創始名冊 →
        </Link>
      </section>
      </main>

      <Footer />
    </div>
  );
}

function Pillar({
  no,
  zh,
  en,
  body,
}: {
  no: string;
  zh: string;
  en: string;
  body: string;
}) {
  return (
    <div>
      <p
        lang="en"
        className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3"
      >
        / {no}
      </p>
      <h4 className="text-xl text-bone font-light tracking-tight mb-1">{zh}</h4>
      <p
        lang="en"
        className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mb-4"
      >
        {en}
      </p>
      <p className="text-mute text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function InversionRow({
  industry,
  zone27,
  href,
  hrefLabel,
}: {
  industry: string;
  zone27: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-8 items-baseline">
      <div>
        <p
          lang="en"
          className="font-mono text-mute/60 text-[9px] sm:text-[10px] tracking-[0.3em] mb-2"
        >
          INDUSTRY
        </p>
        <p className="text-mute text-sm sm:text-base leading-snug line-through decoration-mute/40">
          {industry}
        </p>
      </div>
      <div>
        <p
          lang="en"
          className="font-mono text-gold/80 text-[9px] sm:text-[10px] tracking-[0.3em] mb-2"
        >
          ZONE 27
        </p>
        <p className="text-bone text-sm sm:text-base leading-snug">
          {zone27}
        </p>
        <Link
          href={href}
          className="inline-block mt-1 font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.2em] transition-colors"
        >
          {hrefLabel} →
        </Link>
      </div>
    </div>
  );
}

function EmptyHeroCard() {
  return (
    <div className="bg-slate/40 border border-line/60 p-10 sm:p-14 text-center">
      <p
        lang="en"
        className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-8"
      >
        ENGINE READY · NO MATCHES LOADED
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
        範例賽事尚未排定
      </h2>
      <p className="mt-6 text-mute text-sm max-w-md mx-auto leading-relaxed">
        資料寫入中(可能是季外或資料遷移)。引擎已就緒,可在自訂模式自由跑模擬。
      </p>
      <Link
        href="/lab/custom"
        className="inline-block mt-8 font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
      >
        進入自訂實驗室 →
      </Link>
    </div>
  );
}

function CredibilityCell({
  label,
  zh,
  body,
}: {
  label: string;
  zh: string;
  body: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-gold text-[9px] tracking-[0.4em] mb-1">
        {label}
      </p>
      <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-2">
        {zh}
      </p>
      <p className="text-mute text-xs sm:text-sm leading-relaxed">{body}</p>
    </div>
  );
}

// Card component for the "TRUST STACK" grid · linkable to each
// of the 6 canonical trust artifact pages. Subtly different
// from ProofTile (which shows numbers, not document references).
function TrustCard({
  no,
  href,
  title,
  subtitle,
  sections,
  desc,
  gold = false,
}: {
  no: string;
  href: string;
  title: string;
  subtitle: string;
  sections: string;
  desc: string;
  gold?: boolean;
}) {
  return (
    <Link
      href={href}
      className="block bg-navy p-6 sm:p-7 group transition-colors hover:bg-slate/40"
    >
      <div className="flex items-baseline justify-between mb-4">
        <span
          className={`font-mono tabular text-[10px] tracking-[0.3em] ${
            gold ? "text-gold" : "text-mute"
          }`}
        >
          / {no}
        </span>
        <span
          lang="en"
          className={`font-mono text-[9px] tracking-[0.25em] ${
            gold ? "text-gold/70" : "text-mute/60"
          }`}
        >
          {sections}
        </span>
      </div>
      <h3
        className={`text-2xl font-light tracking-tight mb-1 ${
          gold ? "text-gold" : "text-bone"
        } group-hover:text-gold transition-colors`}
      >
        {title}
      </h3>
      <p
        lang="en"
        className="font-mono text-mute text-[10px] tracking-[0.3em] mb-4 group-hover:text-gold/80 transition-colors"
      >
        {subtitle}
      </p>
      <p className="text-mute text-sm leading-relaxed mb-4 group-hover:text-bone transition-colors">
        {desc}
      </p>
      <p
        className={`font-mono text-[10px] tracking-[0.3em] ${
          gold ? "text-gold" : "text-mute/70"
        } group-hover:text-gold transition-colors`}
      >
        讀完整文件 →
      </p>
    </Link>
  );
}

// Tile component for the "BY THE NUMBERS" bento grid.
// gap-px on the parent + bg-line/30 creates a 1px hairline divider
// between tiles · standard Stripe/Vercel bento technique.
function ProofTile({
  big,
  label,
  verify,
  href,
  note,
  gold = false,
  external = false,
}: {
  big: string;
  label: string;
  verify: string;
  href: string;
  note: string;
  gold?: boolean;
  external?: boolean;
}) {
  const content = (
    <>
      <p
        className={`font-mono tabular text-5xl sm:text-6xl font-light tracking-tight leading-none mb-3 ${
          gold ? "text-gold" : "text-bone"
        } group-hover:text-gold transition-colors`}
      >
        {big}
      </p>
      <p className="text-mute text-sm leading-snug mb-3 group-hover:text-bone transition-colors">
        {label}
      </p>
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.2em] leading-relaxed mb-4">
        ▸ {note}
      </p>
      <p
        lang="en"
        className={`font-mono text-[9px] tracking-[0.3em] ${
          gold ? "text-gold/80" : "text-mute/70"
        } group-hover:text-gold transition-colors`}
      >
        {verify} →
      </p>
    </>
  );

  const className =
    "block bg-navy p-6 sm:p-8 group transition-colors hover:bg-slate/40";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
