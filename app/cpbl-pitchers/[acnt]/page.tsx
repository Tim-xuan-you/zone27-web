import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import StatPercentileBar from "@/components/StatPercentileBar";
import {
  cpblPitchers,
  CPBL_PITCHER_FETCH_DATE,
} from "@/lib/cpbl-pitchers";
import {
  getCpblAdvancedByAcnt,
  CPBL_ADVANCED_FETCH_DATE,
} from "@/lib/cpbl-advanced";

type Props = {
  params: Promise<{ acnt: string }>;
};

export async function generateStaticParams() {
  return cpblPitchers
    .filter((p): p is typeof p & { acnt: string } => p.acnt !== null)
    .map((p) => ({ acnt: p.acnt }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { acnt } = await params;
  const pitcher = cpblPitchers.find((p) => p.acnt === acnt);
  if (!pitcher) {
    return {
      title: "Pitcher Not Found · CPBL · ZONE 27",
    };
  }
  return {
    title: `${pitcher.name} · ${pitcher.team} · 進階指標 · CPBL · ZONE 27`,
    description: `${pitcher.name}(${pitcher.team})· CPBL 進階指標 percentile · K/9 ${pitcher.k9} · BB/9 ${pitcher.bb9} · HR/9 ${pitcher.hr9} · WHIP ${pitcher.whip} · ERA ${pitcher.era} · IP ${pitcher.ip} · 資料來自 stats.cpbl.com.tw 公開 · 0 付費 API。`,
    openGraph: {
      title: `${pitcher.name} · ${pitcher.team} · ZONE 27`,
      description: `K/9 ${pitcher.k9} · BB/9 ${pitcher.bb9} · ERA ${pitcher.era} · WHIP ${pitcher.whip} · ${pitcher.ip} IP · CPBL`,
      type: "article",
      url: `/cpbl-pitchers/${acnt}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pitcher.name} · ${pitcher.team} · ZONE 27`,
      description: `K/9 ${pitcher.k9} · BB/9 ${pitcher.bb9} · ERA ${pitcher.era} · WHIP ${pitcher.whip}`,
    },
    alternates: { canonical: `/cpbl-pitchers/${acnt}` },
  };
}

export const revalidate = 3600; // hourly · pitcher data refreshes daily

export default async function PitcherProfilePage({ params }: Props) {
  const { acnt } = await params;
  const pitcher = cpblPitchers.find((p) => p.acnt === acnt);
  if (!pitcher) {
    notFound();
  }
  // Trackman radar advanced stats(R99 W1 integration · lib/cpbl-advanced.ts
  // existing data · 0 new infrastructure · 12 pitchers covered · null if not
  // tracked yet · honest empty-state per Disclosure axiom)。
  const advanced = pitcher.acnt ? getCpblAdvancedByAcnt(pitcher.acnt) : null;

  // League-relative rank · sorted by K/9 default。
  const sortedByK9 = [...cpblPitchers].sort((a, b) => b.k9 - a.k9);
  const k9Rank = sortedByK9.findIndex((p) => p.acnt === acnt) + 1;
  const k9Total = cpblPitchers.length;

  // Sample-size honest disclosure。
  const sampleHealth: "robust" | "moderate" | "small" =
    pitcher.ip >= 50 ? "robust" : pitcher.ip >= 20 ? "moderate" : "small";
  const sampleLabel = {
    robust: "✓ 樣本足(N ≥ 50 IP)· 排行有統計意義",
    moderate: "⚠ 樣本中(20 ≤ N < 50 IP)· 方向參考 · 統計意義有限",
    small: "⚠ 樣本小(N < 20 IP)· 噪音放大 · 不建議單一指標下結論",
  }[sampleHealth];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/cpbl-pitchers"
              className="hover:text-gold transition-colors"
            >
              CPBL 投手排行
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">{pitcher.name}</span>
          </div>
        </section>

        {/* ── HERO · pitcher identity ─────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8 relative">
          {/* The Pudding issue-numbering DATA stamp · cite-able snapshot。 */}
          <p
            lang="en"
            className="absolute top-10 right-6 sm:right-10 font-mono text-mute/60 text-[9px] tracking-[0.3em] tabular hidden sm:block"
          >
            DATA · {CPBL_PITCHER_FETCH_DATE} TPE · ACNT {acnt}
          </p>
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-5">
            CPBL PITCHER PROFILE · ZONE 27
          </p>
          <h1 className="text-4xl sm:text-6xl text-bone font-light tracking-tight leading-[1.05] mb-3">
            {pitcher.name}
          </h1>
          <p className="font-mono text-gold text-sm sm:text-base tracking-[0.25em]">
            {pitcher.team}
          </p>
          <div className="zone27-rule max-w-[260px] mt-5" aria-hidden="true" />
          <p className="mt-6 text-mute text-sm sm:text-base leading-relaxed max-w-xl">
            league-relative percentile · CPBL{" "}
            <span className="text-bone tabular">{k9Total}</span> 投手中{" "}
            <span className="text-gold tabular">#{String(k9Rank).padStart(2, "0")}</span>{" "}
            (依 K/9 排序)。 5 個 sabermetric 進階指標的 percentile bar 視覺化 ·
            基於 Baseball Savant 配色語言。
          </p>
          <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ {sampleLabel}
          </p>
          <div className="mt-5">
            <ArticleMeta readingMin={2} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── PERCENTILE BAR STACK ─────────────────── */}
        <section
          aria-labelledby="percentile-stack-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
          >
            / 5-STAT PERCENTILE STACK · BASEBALL SAVANT PATTERN
          </p>
          <h2
            id="percentile-stack-heading"
            className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-snug"
          >
            5 個指標 · CPBL league range 上的位置
          </h2>
          <div className="bg-slate/30 border border-line/60 px-4 sm:px-6 py-5 sm:py-6 space-y-1">
            <StatPercentileBar stat="ERA" value={pitcher.era.toFixed(2)} />
            <StatPercentileBar stat="K/9" value={pitcher.k9.toFixed(2)} />
            <StatPercentileBar stat="WHIP" value={pitcher.whip.toFixed(2)} />
            <StatPercentileBar stat="BB/9" value={pitcher.bb9.toFixed(2)} />
            <StatPercentileBar stat="HR/9" value={pitcher.hr9.toFixed(2)} />
          </div>
          <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ Reference range 來自 CPBL 2024 公開資料 derived(per /audit S02
            ESTIMATION DISCLOSURE)· 任何 CPBL 數據工作者可發 PR 修正 ranges
            ·{" "}
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/blob/main/components/StatPercentileBar.tsx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
            >
              GitHub source
            </a>
          </p>
        </section>

        {/* ── ADVANCED TRACKMAN PERCENTILE STACK · R99 W1 integration ── */}
        {advanced ? (
          <section
            aria-labelledby="advanced-stack-heading"
            className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10 border-t border-line/40 pt-10"
          >
            <p
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
            >
              / ADVANCED · TRACKMAN RADAR · stats.cpbl + 野球革命
            </p>
            <h2
              id="advanced-stack-heading"
              className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3 leading-snug"
            >
              7 個 Statcast-grade 進階指標
            </h2>
            <p className="text-mute text-sm sm:text-base leading-relaxed mb-6">
              中職百分位 0-100(100 = elite vs CPBL league)· Trackman radar
              tracking · 比 K/9 / BB/9 / HR/9 per-9 rate stats 高一層 ·{" "}
              <strong className="text-bone">wOBA-against</strong> · K% ·
              BB% · Whiff% · Hard-Hit% · Exit Velo Avg/Max。
            </p>
            <div className="bg-slate/30 border border-line/60 px-4 sm:px-6 py-5 sm:py-6 space-y-2 font-mono">
              <AdvancedPercentileRow
                label="wOBA AGAINST"
                en="WEIGHTED ON-BASE"
                percentile={advanced.wobaAgainst}
                higherBetter={false}
              />
              <AdvancedPercentileRow
                label="K %"
                en="STRIKEOUT RATE"
                percentile={advanced.kPct}
                higherBetter={true}
              />
              <AdvancedPercentileRow
                label="BB %"
                en="WALK RATE"
                percentile={advanced.bbPct}
                higherBetter={false}
              />
              <AdvancedPercentileRow
                label="WHIFF %"
                en="SWING-AND-MISS"
                percentile={advanced.whiffPct}
                higherBetter={true}
              />
              <AdvancedPercentileRow
                label="HARD-HIT %"
                en="EXIT VELO ≥ 95mph"
                percentile={advanced.hardHitPct}
                higherBetter={false}
              />
              <AdvancedPercentileRow
                label="EXIT VELO AVG"
                en="ALLOWED CONTACT"
                percentile={advanced.exitVeloAvg}
                higherBetter={false}
              />
              <AdvancedPercentileRow
                label="EXIT VELO MAX"
                en="HARDEST HIT ALLOWED"
                percentile={advanced.exitVeloMax}
                higherBetter={false}
              />
            </div>
            <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
              ⚓ Data · {CPBL_ADVANCED_FETCH_DATE} TPE · Trackman radar 整合
              stats.cpbl.com.tw · 不假裝自己 collect Trackman data · fetch
              script 公開 GitHub
            </p>
          </section>
        ) : (
          <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10 border-t border-line/40 pt-10">
            <p
              lang="en"
              className="font-mono text-mute/70 text-[10px] tracking-[0.4em] mb-3"
            >
              / ADVANCED · TRACKMAN RADAR · 此投手尚未 tracked
            </p>
            <p className="text-mute text-sm leading-relaxed">
              {pitcher.name} 暫時不在 Trackman radar 進階指標 cache(目前 12
              位主要投手)· 等下次{" "}
              <code className="font-mono text-bone bg-slate/40 px-1.5 py-0.5 rounded-sm text-[12px]">
                npm run fetch-cpbl-advanced
              </code>{" "}
              auto-update · 此 honest empty state per Disclosure axiom · 不藏
              · 不假裝。
            </p>
          </section>
        )}

        {/* ── RAW COUNT STATS · supplementary table ──── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10 border-t border-line/40 pt-10">
          <p
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.4em] mb-4"
          >
            / RAW COUNTS · 累計指標(non-percentile)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <RawStatCell label="IP" en="INNINGS" value={pitcher.ip.toFixed(1)} />
            <RawStatCell label="K" en="STRIKEOUTS" value={String(pitcher.k)} />
            <RawStatCell label="BB" en="WALKS" value={String(pitcher.bb)} />
            <RawStatCell label="HR" en="HR ALLOWED" value={String(pitcher.hr)} />
          </div>
        </section>

        {/* ── CROSS-LINK ROW ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-10">
          <div className="grid sm:grid-cols-3 gap-3">
            <Link
              href="/cpbl-pitchers"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                ← LEADERBOARD
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                完整 16 投手排行 · 6 stat tabs
              </p>
            </Link>
            <Link
              href="/lab"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                / LAB
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                跑 1 萬次模擬 · 看 {pitcher.name} 對任何 matchup
              </p>
            </Link>
            <Link
              href="/matches"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                / MATCHES
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                {pitcher.name} 今日是否先發?
              </p>
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這份 player profile 是 ZONE 27 Baseball Savant transplant 的第 2 步
            ·{" "}
            <Link
              href="/cpbl-pitchers"
              className="text-gold underline-offset-4 hover:underline"
            >
              /cpbl-pitchers
            </Link>{" "}
            排行的 drill-down。 同 FanGraphs/Savant 模式:排行 → 球員頁 →
            percentile bar → 看 strength + weakness。
          </p>
          <p>
            5-bar visualization 用品牌色(冷金 elite · 骨白 mid · mute rebuild)·
            非 Savant 原版 red→blue gradient · 同 Disclosure Philosophy axiom:
            reference range 公開可 audited · GitHub source 上看 components/StatPercentileBar.tsx。
          </p>
          <p>
            尚未 ship:last-5-starts strip · pitch-mix percentile · 對 left/right
            打者 split · per /coverage 02 ACTIVE LEAGUES · 等 CPBL pipeline
            自動化(Trackman 進階 stats already 部分 fetched)後再 expand。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/cpbl-pitchers" />
      </main>

      <Footer />
    </div>
  );
}

// ── AdvancedPercentileRow · Baseball Savant style horizontal percentile bar ─
function AdvancedPercentileRow({
  label,
  en,
  percentile,
  higherBetter,
}: {
  label: string;
  en: string;
  percentile: number | null;
  higherBetter: boolean;
}) {
  if (percentile === null) {
    return (
      <div className="grid grid-cols-[5.5rem_1fr_3rem] sm:grid-cols-[7rem_1fr_3rem] items-center gap-3 py-1.5 text-[11px] sm:text-xs">
        <span className="text-mute/70 tracking-[0.2em]">{label}</span>
        <span className="text-mute/50 italic">— 未 tracked</span>
        <span className="text-mute/40 text-right">—</span>
      </div>
    );
  }
  // Strength tier color · higherBetter aware。
  const strength = higherBetter ? percentile : 100 - percentile;
  const tier: "elite" | "mid" | "rebuild" =
    strength >= 70 ? "elite" : strength >= 30 ? "mid" : "rebuild";
  const tierLabel =
    tier === "elite" ? "ELITE" : tier === "mid" ? "MID" : "REBUILD";
  const tierClass =
    tier === "elite"
      ? "text-gold"
      : tier === "mid"
      ? "text-bone/85"
      : "text-mute";
  return (
    <div
      className="grid grid-cols-[5.5rem_1fr_3rem] sm:grid-cols-[7rem_1fr_3rem] items-center gap-3 py-1.5 text-[11px] sm:text-xs"
      title={`${label}(${en})· 百分位 ${percentile}/100 · ${higherBetter ? "高 = 強" : "低 = 強"} · per CPBL league reference`}
    >
      <span className="text-mute tracking-[0.2em] leading-snug">
        {label}
        <span className="block text-mute/50 text-[9px] tracking-[0.18em] mt-0.5">
          {en}
        </span>
      </span>
      <div
        className="relative h-[6px] bg-line/40 rounded-sm overflow-visible"
        role="img"
        aria-label={`${label} 百分位 ${percentile} · ${
          higherBetter ? "高 = 強" : "低 = 強"
        } · ${tierLabel}`}
      >
        <div
          className="absolute inset-0 rounded-sm opacity-40"
          style={{
            background: higherBetter
              ? "linear-gradient(to right, rgba(138, 147, 168, 0.4), rgba(245, 242, 234, 0.5), rgba(212, 175, 55, 0.6))"
              : "linear-gradient(to right, rgba(212, 175, 55, 0.6), rgba(245, 242, 234, 0.5), rgba(138, 147, 168, 0.4))",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-sm"
          style={{
            left: `${percentile}%`,
            backgroundColor:
              tier === "elite"
                ? "#D4AF37"
                : tier === "mid"
                ? "#F5F2EA"
                : "#8A93A8",
            boxShadow:
              tier === "elite" ? "0 0 6px rgba(212, 175, 55, 0.5)" : "none",
          }}
        />
      </div>
      <span
        className={`stat-caption tracking-[0.18em] text-right tabular ${tierClass}`}
      >
        {tierLabel}
      </span>
    </div>
  );
}

// ── RawStatCell sub-component ────────────────────────────
function RawStatCell({
  label,
  en,
  value,
}: {
  label: string;
  en: string;
  value: string;
}) {
  return (
    <div className="border border-line/40 bg-slate/20 px-3 sm:px-4 py-3 sm:py-4 text-center">
      <p
        lang="en"
        className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1"
      >
        {en}
      </p>
      <p className="font-mono text-bone tabular text-2xl sm:text-3xl font-light">
        {value}
      </p>
      <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-1">
        {label}
      </p>
    </div>
  );
}
