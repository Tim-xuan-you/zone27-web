import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Changelog — 完整變動歷史 · git 是唯一事實來源",
  description:
    "ZONE 27 不再手工維護 changelog narrative。所有變動公開在 GitHub commits,git log 是唯一事實來源。本頁列出近期里程碑當 reference,點按鈕可直達完整歷史。",
};

// ── ZONE 27 · /changelog — Reduced (Algorithm Step 3 · Simplify) ──
// Was 483 lines of hand-maintained release narrative. Now ~70 lines
// of minimal milestones + a direct link to the authoritative source:
// the GitHub commits page. Maintained by `git log` (zero human effort,
// always accurate). The /audit + /faq + /privacy + /terms + /methodology
// + /founders pages all reference /changelog — that promise stays valid
// because this page exists and points to truth.
// ─────────────────────────────────────────────────────

const GH_COMMITS_URL =
  "https://github.com/Tim-xuan-you/zone27-web/commits/main";

const MILESTONES: { date: string; title: string; detail: string }[] = [
  {
    date: "2026-05-21 · Round 2",
    title: "自主多輪迭代 · /roadmap + Cmd-K palette + /audit live dashboard + StatTerm 擴展",
    detail:
      "Tim 全權交付 · 用「敢於突破設計專家」persona lens · 派 2 個 parallel agent(bug audit + world-class brand research)· 同時手動推進。Round 2 共 4 commits / 50+ files / 1800+ insertions。新 canonical · /roadmap 第 8 個 trust artifact(LOCKED / EXPLORING / EXPLICIT NO 三段 · 「永遠不做」section 對標 Anthropic RSP + Plausible)· /not-found K-strikeout 升級(sabermetric notation)。Cmd-K 全站快搜 palette(23 routes · 5 groups · 完整 a11y · 無 fuse.js / 無 telemetry / 無 recently-used)· /audit live numeric dashboard(SAMPLE_SIZE 動態 + BUILD chip GitHub permalink)· Homepage TRUST STACK 7→8-doc(grid lg:cols-4 滿 4+4)· app/loading.tsx brand-pure skeleton · StatTerm 擴展到 /matches/[gameId] PitcherCard(Baseball Savant 風格 hover tooltip)。13 bug fixes(Phase 1 audit 8 個 + Phase 4 audit 5 個 IMPORTANT)+ OG glyph hardening + 全 repo refs 同步。Build / Lint / TSC strict 三綠。",
  },
  {
    date: "2026-05-21",
    title: "/track-record 公開戰績 ledger + match lifecycle (PRE/LIVE/FINAL) + calibration 收據",
    detail:
      "第 7 個 trust artifact /track-record 上線(Bloomberg-terminal ledger · PROVED ✓ 跟 DIVERGED ✕ 等大列出 · 從 N=0 honest empty state 起跳)· Match lifecycle 完整 5-phase 狀態(future · today-pregame · today-live · final · stale-archived · 取代舊 2-state stale/future binary)· HeroLiveCard + /matches/[gameId] 加 phase-aware badge + 賽後 calibration receipt block(僅當 finalResult ingested · 等大顯示 PROVED 或 DIVERGED)· /track-record OG card(8→15 個 custom OG)· homepage TRUST STACK 6→7-doc + grid lg:3→lg:4 · footer DOCS 加「公開戰績」· /audit Section 08 + /manifesto Section I inline link 到 /track-record · related-links hub-and-spoke 更新 · Match type 加 finalResult optional field + 5 個 helpers(isMatchDataToday · getMatchPhase · getCalibration · getEnginePctOnWinner · getFinalizedMatches)。版本 invariant 全站對齊(REPORT v0.28 · ENGINE v0.2 · LAST_REVIEWED 2026-05-21)。",
  },
  {
    date: "2026-05-20",
    title: "/manifesto 倒置宣言 + /founders 「您不是在買引擎」reframe + audit honesty sweep",
    detail:
      "/manifesto canonical 4-軸長文宣言上線(disclosure · monetization · coverage · privacy 四個倒置論證 + WHO THIS IS FOR + 8th custom OG card)· /founders 加 reframe section 直接回答「引擎免費為什麼還要付錢」· /about Chapter 03 method 步驟對齊 /audit Section 03 排除清單(刪 Trackman + stats.cpbl + 後端引擎 + 換投/代打 over-claim)· /audit Section 08 backlink 到 /manifesto · /audit header 釐清 REPORT v0.27 vs ENGINE v0.2 雙版本 · /lab hero version chip v0.3 → v0.2 honesty · /matches hardcoded date → dynamic · Footer chip 移除「MLB × 引擎合體」stale tagline · /glossary PR / Spin Rate / Pythag / TRACKMAN section 對齊真實狀態。",
  },
  {
    date: "2026-05-19 / 2026-05-20 上半天",
    title: "Supabase 後端上線 + 4 個 brand-axiom memories 鎖入系統",
    detail:
      "RLS-locked waitlist DB + 2 個 SECURITY DEFINER 函式 · channel attribution(?ref= → DB.source)· /coverage 第 4 個 trust artifact · /audit Section 08 disclosure philosophy · /lab/custom 3 軸 brand 壓縮 · 手機 hamburger nav 重設計 · /signal-board FRESHNESS · Footer 動態日期 · brand inversion thesis section 上首頁 · 16 輪 trust-artifact + craft polish 收尾 · ScarcityStrip 全站常駐 · /audit Model Report 8 sections(含 Environmental Impact 領先 98% ML model cards)· 7 個 custom OG cards · WCAG AA 22→0 fails · lang sweep + touch-action manipulation · Related Reading hub-and-spoke。",
  },
  {
    date: "2026-05-18 之前",
    title: "v0.1 - v0.26 · 早期版本",
    detail:
      "從零打造 ZONE 27 品牌系統 · Monte Carlo 引擎 · /lab + /lab/custom · 多次設計迭代 · MLB Stats API 整合 · 詳見 GitHub commits 完整歷史。",
  },
];

export default function ChangelogPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <header className="pb-10 border-b border-line/60">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
            >
              CHANGELOG
            </p>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-6">
              我們把版本歷史交給{" "}
              <span lang="en" className="font-mono text-gold">git</span>
            </h1>
            <p className="text-mute text-base leading-relaxed mb-8 max-w-2xl">
              ZONE 27 不再維護手工 curated 的 changelog narrative —
              那種敘事容易遺漏、過時、變成行銷話術。
              <strong className="text-bone">
                所有變動都公開在 GitHub commits,git log 是唯一事實來源
              </strong>
              。本頁列出近期里程碑當 reference;完整逐 commit 歷史請看下方按鈕。
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={GH_COMMITS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 border border-gold text-gold hover:bg-gold hover:text-navy transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                <span lang="en">VIEW ALL COMMITS ON GITHUB →</span>
              </a>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 px-5 py-3 border border-line/60 text-mute hover:text-gold hover:border-gold/40 transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                <span lang="en">/ROADMAP · 未來承諾 →</span>
              </Link>
            </div>
          </header>

          <section className="py-12">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.45em] mb-6"
            >
              RECENT MILESTONES
            </p>
            <div className="space-y-8">
              {MILESTONES.map((m) => (
                <div
                  key={m.date}
                  className="pb-6 border-b border-line/40 last:border-b-0"
                >
                  <p
                    lang="en"
                    className="font-mono text-gold text-sm tracking-[0.2em] tabular mb-3"
                  >
                    {m.date}
                  </p>
                  <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-3 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-mute text-sm leading-relaxed">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 border-t border-line/40 text-center">
            <p className="text-mute text-sm leading-relaxed max-w-xl mx-auto">
              這頁刻意保持精簡(從原本 483 行 → 70 行) —
              因為我們相信
              <strong className="text-bone">git log 比任何手寫敘事更新更快、更不會撒謊</strong>。
              每個頁面 Footer 點版本 chip 也可以直達 commits。
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
