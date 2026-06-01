import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";
import FounderSignOff from "@/components/FounderSignOff";

export const metadata: Metadata = {
  title: "Annual Reports · ZONE 27 每年 5/31 publish · Berkshire 1965-2024 60 年 letter pattern",
  description:
    "ZONE 27 每年 5/31 publish honest annual report · 同 Berkshire Hathaway 1965-2024 60 年 letter archive + Defector Year-Five report + Hell Gate + Aftermath radical-transparency pattern · Year 0 (2026) pre-launch honest empty state · Year 1+ future placeholders 公開 binding · 此 chronological list 本身就是 costly signal · commitment to publish for a decade · per Pratfall axiom + Disclosure Philosophy。",
  openGraph: {
    title: "Annual Reports · ZONE 27 每年 5/31 publish",
    description:
      "每年 5/31 honest annual report · Berkshire 60-year pattern · Year 0 (2026) → Year 9 (2035) chronological",
    type: "article",
    url: "/annual",
  },
  twitter: {
    card: "summary_large_image",
    title: "Annual Reports · ZONE 27 每年 5/31 publish",
    description:
      "Berkshire 60-year letter archive pattern · ZONE 27 commitment to publish honestly for a decade",
  },
  alternates: { canonical: "/annual" },
};

// ── ZONE 27 · /annual index ───────────────────────────
// R116 W1 · per R115 agent「brand-IP-pure social proof」 research Ship 1 ·
// Berkshire Hathaway 1965-2024 60-year letter archive pattern · 同
// berkshirehathaway.com/letters/letters.html 結構:bare chronological year
// list · 每 year link 到該 year report · 未發行 year 顯式 placeholder · NOT
// 「即將推出」 fluff · purely 「2027 letter 預定 2027-05-31 publish」 binding。
//
// Brand IP rationale per agent:
//   - Berkshire 60 年連續 letter = unfakeable costly signal · ZONE 27 從 Year 0
//     開始 publish 此 chronological list 即是「我們承諾每年 publish」 binding
//   - Future placeholders 公開 bind future Tim · same Costly Signaling 機制
//   - Pratfall axiom · Year 0 (2026) IS honest empty state(0 paid · NT$ 0 rev)
//     · 不藏 first-year weakness
//   - per /audit S05 PRE-COMMIT pattern · 同樣 binding rules
//
// 不做 anti-pattern:
//   ✕ NO 「coming soon · stay tuned」 framing · 純 bare placeholder dates
//   ✕ NO 「subscribe to annual report」 CTA(per NoPushManifest)
//   ✕ NO marketing copy 在 placeholder year · only date + status
//
// Convert from redirect → real index page · /annual/2026 仍然 deep linkable ·
// 訪客從 /annual 看到完整 chronological commitment。
// ─────────────────────────────────────────────────────

type AnnualYear = {
  /** Year label e.g. "Year 0" */
  yearLabel: string;
  /** Calendar year e.g. 2026 */
  calendarYear: number;
  /** ISO date when published OR scheduled · YYYY-MM-DD */
  publishDate: string;
  /** Status · published | scheduled */
  status: "published" | "scheduled";
  /** Optional href · null if scheduled */
  href: string | null;
  /** Short subtitle · only for published */
  subtitle?: string;
};

// ZONE 27 commitment: publish annually for at least 10 years · binding。
// 修改此 list 需 30 天 /changelog 公告 · per /audit S05 PRE-COMMIT pattern。
const ANNUAL_REPORTS: AnnualYear[] = [
  {
    yearLabel: "Year 0",
    calendarYear: 2026,
    publishDate: "2026-05-23",
    status: "published",
    href: "/annual/2026",
    subtitle:
      "Year 0 honest empty state · 0 paid customers · NT$ 0 revenue · 4 ingested matches · 1 PROVED receipt · pre-launch radical transparency",
  },
  {
    yearLabel: "Year 1",
    calendarYear: 2027,
    publishDate: "2027-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 2",
    calendarYear: 2028,
    publishDate: "2028-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 3",
    calendarYear: 2029,
    publishDate: "2029-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 4",
    calendarYear: 2030,
    publishDate: "2030-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 5",
    calendarYear: 2031,
    publishDate: "2031-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 6",
    calendarYear: 2032,
    publishDate: "2032-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 7",
    calendarYear: 2033,
    publishDate: "2033-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 8",
    calendarYear: 2034,
    publishDate: "2034-05-31",
    status: "scheduled",
    href: null,
  },
  {
    yearLabel: "Year 9",
    calendarYear: 2035,
    publishDate: "2035-05-31",
    status: "scheduled",
    href: null,
  },
];

export const revalidate = 86400;

export default function AnnualIndex() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">ANNUAL REPORTS</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / ANNUAL REPORTS · 每年 5/31 publish
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold shimmer"
              title="ZONE 27 commitment to publish annually for at least 10 years · binding · per Berkshire 60-year pattern"
            >
              10 YEAR COMMITMENT
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight max-w-2xl">
            10 年連續 publish · <span className="text-gold">Tim 簽名</span> ·
            不間斷
          </h1>
          <div className="zone27-rule max-w-[260px] mt-5" aria-hidden="true" />
          <p className="mt-6 text-mute text-base leading-relaxed max-w-xl">
            Berkshire Hathaway 1965-2024 60 年 letter archive 對標 · ZONE 27
            從 Year 0(2026)開始公開承諾 · 每年 5/31 publish honest annual
            report · {ANNUAL_REPORTS.length} 年 binding commitment · 修改此
            list 需 30 天 /changelog 公告 · per /audit S05 PRE-COMMIT。
          </p>
          <p className="mt-4 max-w-xl border-l-2 border-gold/60 pl-4 text-bone text-sm sm:text-base leading-relaxed font-light">
            這份 chronological list 本身就是 costly signal:
            <strong className="text-gold"> future placeholders</strong> 公開
            bind future Tim。 同 Berkshire 從 1965 起 60 年沒漏一年 · Defector
            從 Year 1 起 5 年沒漏一年 · ZONE 27 從 Year 0 起 binding 10 年。
            <span className="block mt-3 text-mute text-sm">
              這條 commitment 本身比 marketing 強。 公開 「即將每年 publish」 比
              「我們很厲害」 更難 fake — 因為時間會 verify。
            </span>
          </p>
          <div className="mt-5">
            <ArticleMeta readingMin={2} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── CHRONOLOGICAL ANNUAL LIST · Berkshire pattern ──
            10 rows · Year 0 published · Year 1-9 scheduled placeholders · 每
            row 顯示 date + status + subtitle if available · published year
            link 到 /annual/{calendarYear} · scheduled year 不 clickable but
            顯式 binding date。 */}
        <section
          aria-labelledby="annual-list-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16"
        >
          <h2
            id="annual-list-heading"
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-6"
          >
            / CHRONOLOGICAL · 10 YEAR LEDGER
          </h2>
          <ul className="space-y-2">
            {ANNUAL_REPORTS.map((report) => {
              const isPublished = report.status === "published";
              const content = (
                <div
                  className={`grid grid-cols-[5rem_1fr_auto] sm:grid-cols-[7rem_1fr_auto] gap-3 sm:gap-5 items-baseline border ${
                    isPublished
                      ? "border-gold/40 bg-slate/30 hover:border-gold/70"
                      : "border-line/40 bg-slate/10"
                  } px-4 sm:px-5 py-3 sm:py-4 transition-colors`}
                >
                  <span
                    lang="en"
                    className={`font-mono text-[10px] tracking-[0.25em] tabular ${
                      isPublished ? "text-gold/85" : "text-mute/60"
                    }`}
                  >
                    {report.yearLabel}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`font-mono text-base sm:text-lg tabular tracking-tight ${
                        isPublished ? "text-bone" : "text-mute/60"
                      }`}
                    >
                      {report.calendarYear}
                    </p>
                    {report.subtitle && (
                      <p className="hidden sm:block font-mono text-mute/70 text-[10px] tracking-[0.18em] mt-1 leading-snug">
                        {report.subtitle}
                      </p>
                    )}
                  </div>
                  <span
                    lang="en"
                    className={`font-mono text-[9px] tracking-[0.3em] tabular ${
                      isPublished ? "text-gold" : "text-mute/50"
                    }`}
                  >
                    {isPublished ? (
                      <>
                        ✓ PUBLISHED · {report.publishDate}
                        <span className="hidden sm:inline ml-1">→</span>
                      </>
                    ) : (
                      <>
                        · SCHEDULED · {report.publishDate}
                      </>
                    )}
                  </span>
                </div>
              );
              if (isPublished && report.href) {
                return (
                  <li key={report.calendarYear}>
                    <Link
                      href={report.href}
                      aria-label={`${report.yearLabel} · ${report.calendarYear} annual report · published ${report.publishDate}`}
                      className="block group"
                    >
                      {content}
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={report.calendarYear}
                  aria-label={`${report.yearLabel} · ${report.calendarYear} scheduled to publish ${report.publishDate} · binding commitment · 未發行`}
                >
                  {content}
                </li>
              );
            })}
          </ul>
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ 此 10-year ledger 不可降(per /audit S05 PRE-COMMIT)·
            extending past Year 9(2035)需公開 binding 加 longer list ·
            shortening 違反 brand axiom。 If Tim 退場 · publishing 義務由社群承接 ·
            succession 細節見 /founders/postmortem-2028。
          </p>
        </section>

        {/* ── WHY THIS LIST EXISTS · meta-explanation ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / META · WHY THIS LIST EXISTS
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight max-w-2xl leading-tight mb-6">
            未發行年份本身就是 costly signal
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              多數 SaaS / publisher 只在 published year 之後才 surface annual
              report archive。 ZONE 27 反向:從 Year 0 開始公開 future
              placeholders · 因為「即將連續 publish 10 年」 比「我們很厲害」
              更難 fake。
            </p>
            <p>
              <strong className="text-bone">Berkshire 1965-2024</strong>:
              60 年 letter archive 沒漏一年。 Tim 從 2026 開始 commit 10 年 ·
              binding · 公開 dated placeholder · 未來 Tim 不能 quietly skip。
            </p>
            <p>
              <strong className="text-bone">Defector 2020-2025</strong>:
              5 年連續 annual report · 都 publish 含 financials · 不藏 misses ·
              ZONE 27 同 pattern · Year 0 已 publish empty state(0 paid · NT$ 0
              rev)· 之後 Year 1+ 不可降標。
            </p>
            <p className="font-mono text-mute/80 text-sm tracking-[0.18em] leading-relaxed">
              per agent locked-preview research(R115 fresh angle):
              「Brand-IP-PURE social proof = unfakeable structural commitment」 ·
              此 list 是 ZONE 27 的 Berkshire archive 第一塊基石。
            </p>
          </div>
        </section>

        {/* ── CROSS-LINK · related trust artifacts ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-10">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / RELATED · 其他 binding 公開 commitments
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link
              href="/integrity"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                / INTEGRITY
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors mb-1">
                22 binding 永遠不變
              </p>
              <p className="text-mute text-[12px] leading-relaxed">
                Berkshire 1996 Owner&apos;s Manual pattern · 22 binding rules ·
                每條 30 天 /changelog 公告 才能修
              </p>
            </Link>
            <Link
              href="/ethics"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                / ETHICS
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors mb-1">
                9 binding NOT-DO commitments
              </p>
              <p className="text-mute text-[12px] leading-relaxed">
                Stratechery About transplant · 違反任一 = /ethics 紅字永久標
              </p>
            </Link>
            <Link
              href="/audit"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                / AUDIT S05
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors mb-1">
                Disclosure Philosophy + PRE-COMMIT
              </p>
              <p className="text-mute text-[12px] leading-relaxed">
                此 list 修改的 brand-IP-binding rules · 30 天前 /changelog 公告
                + 個別 rule signature
              </p>
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這份 10-year ledger 從 Year 0 開始公開 future binding commitments ·
            是 ZONE 27 對自己最 expensive 的公開承諾。 Year 0
            (2026) 已 publish honest empty state 不藏 · Year 1-9 (2027-2035)
            是 future placeholders 公開 bind future Tim。
          </p>
          <p>
            Berkshire Hathaway 60 年 letter archive + Defector 5 年 annual
            report + Hell Gate + Aftermath radical-transparency pattern · ZONE
            27 採同樣 axis。 玩運彩+報馬仔 結構性無法 ship 同樣 page · 因為
            他們業務 model 需要 reset narrative every season。 ZONE 27 不
            reset · 不 cherry-pick · 只 append。
          </p>
          <p>
            修改此 list(刪除 year row · 縮短 commitment · 改 publish date)
            需 30 天前 /changelog 公告 + 個別 rule signature per /integrity
            modification protocol · 同 22 binding rules + 9 ethics commitments
            pattern。 不可 silent edit · 不可 retroactive 刪。
          </p>
        </FounderSignOff>
      </main>

      <Footer />
    </div>
  );
}
