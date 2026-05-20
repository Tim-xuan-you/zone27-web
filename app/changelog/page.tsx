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
    date: "2026-05-20",
    title: "Supabase 後端上線 + 4 個 brand-axiom memories 鎖入系統",
    detail:
      "RLS-locked waitlist DB + 2 個 SECURITY DEFINER 函式 · channel attribution(?ref= → DB.source)· /coverage 第 4 個 trust artifact · /audit Section 08 disclosure philosophy · /lab/custom 3 軸 brand 壓縮 · 手機 hamburger nav · /signal-board FRESHNESS · Footer 動態日期 · Musk 方法論成為操作系統。",
  },
  {
    date: "2026-05-19",
    title: "v0.27 · 16 輪 trust-artifact + craft polish 收尾",
    detail:
      "ScarcityStrip 全站常駐 · /audit Model Report 7 sections(含 Environmental Impact 領先 98% ML model cards)· 7 個 custom OG cards · WCAG AA 22→0 fails · lang sweep + touch-action manipulation · Related Reading hub-and-spoke · 詳見 WHILE-YOU-WERE-OUT.md 完整 round 1-16 紀錄。",
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
            <a
              href={GH_COMMITS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 border border-gold text-gold hover:bg-gold hover:text-navy transition-colors font-mono text-[11px] tracking-[0.3em]"
            >
              <span lang="en">VIEW ALL COMMITS ON GITHUB →</span>
            </a>
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
