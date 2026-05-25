import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import {
  cpblPitchers,
  CPBL_PITCHER_FETCH_DATE,
  type CpblPitcherStats,
} from "@/lib/cpbl-pitchers";
import { getTeamByName } from "@/lib/teams";
import {
  cpblAdvanced,
  getCpblAdvancedByAcnt,
  type CpblAdvancedStats,
} from "@/lib/cpbl-advanced";

export const metadata: Metadata = {
  title: "CPBL 投手排行 · K/9 · BB/9 · HR/9 · WHIP · ERA · IP",
  description:
    "中華職棒投手 sabermetric 進階指標即時排行。Baseball Savant Custom Leaderboards pattern · URL-shareable 排序 · 6 stat tabs · 每 stat 配 fan-grammar 解釋。資料來自 cpbl.com.tw 公開 box score · 不付費 · 不繞 paywall。",
  openGraph: {
    title: "CPBL 投手排行 · 6 stat tabs · Baseball Savant pattern",
    description:
      "中華職棒投手 sabermetric 進階指標排行 · URL-shareable · 公開資料 · 0 付費 API",
    type: "article",
    url: "/cpbl-pitchers",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPBL 投手排行 · ZONE 27",
    description:
      "K/9 · BB/9 · HR/9 · WHIP · ERA · IP · Baseball Savant pattern · 公開資料",
  },
  alternates: { canonical: "/cpbl-pitchers" },
};

export const revalidate = 3600; // hourly · pitcher data refreshes daily

type StatKey = "k9" | "bb9" | "hr9" | "whip" | "era" | "ip";

const STAT_META: Record<
  StatKey,
  {
    label: string;
    en: string;
    higherIsBetter: boolean;
    decimals: number;
    desc: string;
    range: string;
  }
> = {
  k9: {
    label: "K/9",
    en: "STRIKEOUTS / 9 INNINGS",
    higherIsBetter: true,
    decimals: 2,
    desc: "越高 = 越會三振 · 對應 high-leverage 投手價值 · 反映球速 + 變化球品質 + 投手 stuff。",
    range: "CPBL 平均 ~6.5 · 8+ 是優秀 · 10+ 是 ace。",
  },
  bb9: {
    label: "BB/9",
    en: "WALKS / 9 INNINGS",
    higherIsBetter: false,
    decimals: 2,
    desc: "越低 = 控球越好 · 反映 command + 投球節奏穩定度。 高 BB/9 是壞球率 + 滿球數投球 + 心理壓力 surrogate。",
    range: "CPBL 平均 ~3.5 · 2 以下是 elite control · 5+ 是控球問題。",
  },
  hr9: {
    label: "HR/9",
    en: "HOME RUNS / 9 INNINGS",
    higherIsBetter: false,
    decimals: 2,
    desc: "越低 = 越不被打全壘打 · 反映 stuff 品質 + 球場因素 + 投球角度。 高 HR/9 投手在打者球場(桃園 · 大巨蛋)會被放大。",
    range: "CPBL 平均 ~1.0 · 0.5 以下是 elite · 1.5+ 容易爆。",
  },
  whip: {
    label: "WHIP",
    en: "WALKS + HITS / IP",
    higherIsBetter: false,
    decimals: 2,
    desc: "Walks + Hits per Inning Pitched · 越低 = 越少跑者上壘 · 是 BB/9 + 安打率的合成指標。 經典 sabermetric base stat。",
    range: "CPBL 平均 ~1.30 · 1.10 以下是優秀 · 1.50+ 是危險。",
  },
  era: {
    label: "ERA",
    en: "EARNED RUN AVG",
    higherIsBetter: false,
    decimals: 2,
    desc: "Earned Run Average · 每 9 局自責分。 傳統 surface stat · 但受守備品質 + 球運影響大 · 不如 K/9 + BB/9 純粹反映投手能力。",
    range: "CPBL 平均 ~4.00 · 2.50 以下是 ace · 5.00+ 是調整中。",
  },
  ip: {
    label: "IP",
    en: "INNINGS PITCHED",
    higherIsBetter: true,
    decimals: 1,
    desc: "累計投球局數。 高 IP = 健康 + 教練信任 + 持續上場機會。 反映 workload 承擔能力。 排行有意義需 IP ≥ 20 · 樣本太小會雜訊。",
    range: "先發 50+ 局是 regular · 30 局以下樣本不足。",
  },
};

const STAT_ORDER: StatKey[] = ["k9", "bb9", "hr9", "whip", "era", "ip"];

// R102 W1 · ADVANCED Trackman view metadata · per /audit S02 ESTIMATION
// DISCLOSURE pattern · 0-100 percentile per CPBL league reference。
type AdvancedStatKey =
  | "wobaAgainst"
  | "kPct"
  | "bbPct"
  | "whiffPct"
  | "hardHitPct"
  | "exitVeloAvg"
  | "exitVeloMax";

const ADVANCED_STAT_META: Record<
  AdvancedStatKey,
  {
    label: string;
    en: string;
    higherIsBetter: boolean;
    desc: string;
    range: string;
  }
> = {
  wobaAgainst: {
    label: "wOBA-A",
    en: "WEIGHTED ON-BASE AGAINST",
    higherIsBetter: false,
    desc: "加權上壘率 · 投手:打者對此投手的加權上壘表現 · 越低 = 越強 · 整合 BB/HBP/1B/2B/3B/HR 加權 · 比 OBP 更精確反映投手 stuff。",
    range: "CPBL 百分位 · 0(elite/被打 ≤ league low）· 100(rebuild/被打 ≥ league high)",
  },
  kPct: {
    label: "K %",
    en: "STRIKEOUT RATE",
    higherIsBetter: true,
    desc: "三振% · 對戰打者中三振的比例 · 越高 = 越會三振 · 反映 stuff + command 雙信號。",
    range: "CPBL 百分位 · 0(rebuild/低 K%)· 100(elite/高 K%)",
  },
  bbPct: {
    label: "BB %",
    en: "WALK RATE",
    higherIsBetter: false,
    desc: "保送% · 對戰打者中保送的比例 · 越低 = 越會控球 · 反映 command + 心理穩定度。",
    range: "CPBL 百分位 · 0(elite/低 BB%)· 100(rebuild/高 BB%)",
  },
  whiffPct: {
    label: "WHIFF %",
    en: "SWING-AND-MISS RATE",
    higherIsBetter: true,
    desc: "揮空率 · 打者揮棒落空的比例 · 越高 = 越能讓打者揮空 · 反映 deceptive stuff(滑球 + 變化球 + 突放速度)。",
    range: "CPBL 百分位 · 0(rebuild/低 Whiff%)· 100(elite/高 Whiff%)",
  },
  hardHitPct: {
    label: "HARD-HIT %",
    en: "EXIT VELO ≥ 95mph",
    higherIsBetter: false,
    desc: "強擊球率 · 被打出 95mph 以上的比例 · 越低 = 越能 induce 弱擊 · 反映投手 contact suppression。",
    range: "CPBL 百分位 · 0(elite/被打弱)· 100(rebuild/被強擊)",
  },
  exitVeloAvg: {
    label: "EV AVG",
    en: "ALLOWED EXIT VELO AVG",
    higherIsBetter: false,
    desc: "允許平均擊球初速 · 越低 = 接觸品質越爛 · 反映投手對打者的壓制力。",
    range: "CPBL 百分位 · 0(elite/被打弱)· 100(rebuild/被打強)",
  },
  exitVeloMax: {
    label: "EV MAX",
    en: "HARDEST HIT ALLOWED",
    higherIsBetter: false,
    desc: "允許最大擊球初速 · 投手被打最爆的單一打席 · 越低 = 即使失誤也不會被打太爛 · 反映 worst-case ceiling。",
    range: "CPBL 百分位 · 0(elite/被打 ceiling 低)· 100(rebuild/被打 ceiling 高)",
  },
};

const ADVANCED_STAT_ORDER: AdvancedStatKey[] = [
  "wobaAgainst",
  "kPct",
  "bbPct",
  "whiffPct",
  "hardHitPct",
  "exitVeloAvg",
  "exitVeloMax",
];

type ViewMode = "basic" | "advanced";

// Derive unique teams from data · sorted alphabetically for stable URL state。
const TEAMS: string[] = Array.from(
  new Set(cpblPitchers.map((p) => p.team))
).sort();

function isStatKey(v: unknown): v is StatKey {
  return typeof v === "string" && (STAT_ORDER as string[]).includes(v);
}

function isAdvancedStatKey(v: unknown): v is AdvancedStatKey {
  return (
    typeof v === "string" && (ADVANCED_STAT_ORDER as string[]).includes(v)
  );
}

function isTeam(v: unknown): v is string {
  return typeof v === "string" && TEAMS.includes(v);
}

function isViewMode(v: unknown): v is ViewMode {
  return v === "basic" || v === "advanced";
}

function sortPitchers(
  pitchers: CpblPitcherStats[],
  stat: StatKey
): CpblPitcherStats[] {
  const meta = STAT_META[stat];
  return [...pitchers].sort((a, b) => {
    const av = a[stat];
    const bv = b[stat];
    return meta.higherIsBetter ? bv - av : av - bv;
  });
}

// R102 W1 · sort advanced stats with null-safe handling · null pushed to end。
function sortAdvanced(
  rows: { pitcher: CpblPitcherStats; advanced: CpblAdvancedStats }[],
  stat: AdvancedStatKey
): { pitcher: CpblPitcherStats; advanced: CpblAdvancedStats }[] {
  const meta = ADVANCED_STAT_META[stat];
  return [...rows].sort((a, b) => {
    const av = a.advanced[stat];
    const bv = b.advanced[stat];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    return meta.higherIsBetter ? bv - av : av - bv;
  });
}

export default async function CpblPitchersPage({
  searchParams,
}: {
  searchParams: Promise<{ stat?: string; team?: string; view?: string }>;
}) {
  const params = await searchParams;
  const view: ViewMode = isViewMode(params.view) ? params.view : "basic";
  const activeTeam: string | null = isTeam(params.team) ? params.team : null;

  // BASIC view · all 16 pitchers + 6 basic stats
  const activeStat: StatKey = isStatKey(params.stat) ? params.stat : "k9";
  const filtered = activeTeam
    ? cpblPitchers.filter((p) => p.team === activeTeam)
    : cpblPitchers;
  const sorted = sortPitchers(filtered, activeStat);
  const meta = STAT_META[activeStat];

  // ADVANCED view · only 12 tracked + 7 Trackman percentiles
  const activeAdvStat: AdvancedStatKey = isAdvancedStatKey(params.stat)
    ? params.stat
    : "kPct";
  // R108 W6 · Agent 1 LOW cleanup · removed unreachable fallback object ·
  // cpblAdvanced + cpblPitchers come from same fetch script · 100% acnt
  // overlap guaranteed · 之前 fallback masked silent data drift。 現在 build
  // fails loudly with clear error message if drift happens(Disclosure axiom
  // 物理 codify on data-integrity layer)。
  const advancedRows = (activeTeam
    ? cpblAdvanced.filter((a) => a.team === activeTeam)
    : cpblAdvanced
  ).map((advanced) => {
    const pitcher = cpblPitchers.find((p) => p.acnt === advanced.acnt);
    if (!pitcher) {
      throw new Error(
        `[/cpbl-pitchers] cpbl-advanced acnt=${advanced.acnt} (${advanced.name}) has no matching cpbl-pitchers entry · run scripts/fetch-cpbl-advanced.mjs to sync`
      );
    }
    return { pitcher, advanced };
  });
  const advancedSorted = sortAdvanced(advancedRows, activeAdvStat);
  const advMeta = ADVANCED_STAT_META[activeAdvStat];

  // Helper · preserve view/team/stat across URL state changes。
  const buildHref = (overrides: {
    stat?: StatKey | AdvancedStatKey;
    team?: string | null;
    view?: ViewMode;
  }) => {
    const sp = new URLSearchParams();
    const nextView = overrides.view ?? view;
    const nextTeam =
      "team" in overrides ? overrides.team : activeTeam;
    // Stat default differs per view(basic = k9 · advanced = kPct)
    const defaultStat = nextView === "advanced" ? "kPct" : "k9";
    const nextStat =
      overrides.stat ?? (nextView === view ? (view === "advanced" ? activeAdvStat : activeStat) : defaultStat);
    if (nextView !== "basic") sp.set("view", nextView);
    if (nextStat !== defaultStat) sp.set("stat", nextStat);
    if (nextTeam) sp.set("team", nextTeam);
    const q = sp.toString();
    return q ? `/cpbl-pitchers?${q}` : "/cpbl-pitchers";
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">CPBL 投手排行</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8 text-center relative">
          {/* The Pudding / Defector issue-numbering pattern · permanent
              cite-able snapshot stamp · top-right Geist Mono · contrasts
              with LINE 老師 who never timestamp。 */}
          <p
            lang="en"
            className="absolute top-10 right-6 sm:right-10 font-mono text-mute/60 text-[9px] tracking-[0.3em] tabular hidden sm:block"
          >
            DATA · {CPBL_PITCHER_FETCH_DATE} TPE · N={cpblPitchers.length}
            {activeTeam ? ` · 篩 ${sorted.length}` : ""}
          </p>
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            CPBL PITCHER LEADERBOARD · ZONE 27
          </p>
          <h1 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
            中華職棒投手{" "}
            <span className="text-gold">進階指標排行</span>
          </h1>
          <div className="zone27-rule mx-auto max-w-[280px] mt-4" aria-hidden="true" />
          <p className="mt-6 text-mute text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            6 個 sabermetric 進階指標 · 1 鍵切換排序 · URL 可分享(LINE
            轉傳直接看同一份排序)。 資料來自{" "}
            <a
              href="https://stats.cpbl.com.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              stats.cpbl.com.tw
            </a>{" "}
            公開 box score · 0 付費 API · 0 繞 paywall。
          </p>
          <div className="mt-6 flex justify-center">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── VIEW MODE TOGGLE · BASIC | ADVANCED · R102 W1 ────── */}
        <section
          aria-label="View mode toggle"
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-3"
        >
          <p
            lang="en"
            className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-3"
          >
            ↘ VIEW MODE · BASIC(per-9 rate · 16 投手)| ADVANCED(Trackman radar · {cpblAdvanced.length} 投手)
          </p>
          {/* R108 W1 · A11y fix · drop role=tablist/role=tab false semantics
              per W3C APG · these are Link navigation not tabpanel switchers
              · use <nav> + aria-current="page" instead per ARIA Authoring
              Practices "Navigation Landmarks" canonical pattern。 */}
          <nav
            aria-label="統計層級切換"
            className="inline-flex border border-line/60 bg-slate/30"
          >
            <Link
              aria-current={view === "basic" ? "page" : undefined}
              href={buildHref({ view: "basic" })}
              scroll={false}
              prefetch
              className={`px-5 py-2 min-h-[40px] inline-flex items-baseline gap-2 font-mono text-xs tracking-[0.25em] transition-colors ${
                view === "basic"
                  ? "bg-gold/15 text-gold"
                  : "text-mute hover:text-gold"
              }`}
            >
              <span className="text-bone tabular">BASIC</span>
              <span
                lang="en"
                className="text-[9px] tracking-[0.25em] text-mute/70"
              >
                per-9
              </span>
            </Link>
            <Link
              aria-current={view === "advanced" ? "page" : undefined}
              href={buildHref({ view: "advanced" })}
              scroll={false}
              prefetch
              className={`px-5 py-2 min-h-[40px] inline-flex items-baseline gap-2 font-mono text-xs tracking-[0.25em] transition-colors border-l border-line/60 ${
                view === "advanced"
                  ? "bg-gold/15 text-gold"
                  : "text-mute hover:text-gold"
              }`}
            >
              <span className="text-bone tabular">ADVANCED</span>
              <span
                lang="en"
                className="text-[9px] tracking-[0.25em] text-mute/70"
              >
                Trackman
              </span>
            </Link>
          </nav>
        </section>

        {/* ── TEAM FILTER CHIPS ────────────────────── */}
        <section
          aria-label="球團篩選"
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-3"
        >
          <p
            lang="en"
            className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-3"
          >
            ↘ FILTER 球團(球迷部落感)· URL 保留 stat + team
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href={buildHref({ team: null })}
              scroll={false}
              prefetch
              className={`px-3 py-1.5 min-h-[36px] inline-flex items-center border font-mono text-[11px] tracking-[0.15em] transition-colors ${
                activeTeam === null
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line/50 bg-slate/20 text-mute hover:border-gold/60 hover:text-gold"
              }`}
              aria-current={activeTeam === null ? "page" : undefined}
            >
              全部
            </Link>
            {TEAMS.map((team) => {
              const isActive = team === activeTeam;
              return (
                <Link
                  key={team}
                  href={buildHref({ team })}
                  scroll={false}
                  prefetch
                  className={`px-3 py-1.5 min-h-[36px] inline-flex items-center border font-mono text-[11px] tracking-[0.15em] transition-colors ${
                    isActive
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-line/50 bg-slate/20 text-mute hover:border-gold/60 hover:text-gold"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {team}
                </Link>
              );
            })}
          </div>
          {/* When team is filtered, surface dedicated team page link · per
              R98 W1 NEW /cpbl-teams/[teamId] aggregation route discoverability。 */}
          {activeTeam && (() => {
            const teamMeta = getTeamByName(activeTeam);
            if (!teamMeta) return null;
            return (
              <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.25em]">
                ↘{" "}
                <Link
                  href={`/cpbl-teams/${teamMeta.id}`}
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  看 {teamMeta.short} 完整隊伍頁 + aggregate stats →
                </Link>
              </p>
            );
          })()}
        </section>

        {/* ── STAT TABS · basic OR advanced based on view mode ──── */}
        <section
          aria-label="排序指標切換"
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-6"
        >
          <p
            lang="en"
            className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-3"
          >
            ↘ TAP 任一指標 · URL 立即 update · LINE-shareable
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {view === "basic" &&
              STAT_ORDER.map((key) => {
                const isActive = key === activeStat;
                const m = STAT_META[key];
                return (
                  <Link
                    key={key}
                    href={buildHref({ stat: key })}
                    scroll={false}
                    prefetch
                    className={`px-4 py-2 min-h-[44px] inline-flex items-baseline gap-2 border font-mono text-xs tracking-[0.2em] transition-colors ${
                      isActive
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-line/60 bg-slate/30 text-mute hover:border-gold/60 hover:text-gold"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="text-bone tabular">{m.label}</span>
                    <span
                      lang="en"
                      className="text-[9px] tracking-[0.25em] text-mute/70"
                    >
                      {m.higherIsBetter ? "↑" : "↓"}
                    </span>
                  </Link>
                );
              })}
            {view === "advanced" &&
              ADVANCED_STAT_ORDER.map((key) => {
                const isActive = key === activeAdvStat;
                const m = ADVANCED_STAT_META[key];
                return (
                  <Link
                    key={key}
                    href={buildHref({ stat: key })}
                    scroll={false}
                    prefetch
                    className={`px-4 py-2 min-h-[44px] inline-flex items-baseline gap-2 border font-mono text-xs tracking-[0.2em] transition-colors ${
                      isActive
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-line/60 bg-slate/30 text-mute hover:border-gold/60 hover:text-gold"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="text-bone tabular">{m.label}</span>
                    <span
                      lang="en"
                      className="text-[9px] tracking-[0.25em] text-mute/70"
                    >
                      {m.higherIsBetter ? "↑" : "↓"}
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* ── ACTIVE STAT EXPLAINER · basic OR advanced ──── */}
        <section
          aria-labelledby="active-stat-heading"
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-8"
        >
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6 py-3">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.35em] mb-1.5"
            >
              {view === "advanced" ? advMeta.en : meta.en}
            </p>
            <h2
              id="active-stat-heading"
              className="text-bone text-xl sm:text-2xl font-light tracking-tight mb-3 leading-snug"
            >
              {view === "advanced" ? advMeta.label : meta.label} ·{" "}
              {(view === "advanced" ? advMeta.higherIsBetter : meta.higherIsBetter)
                ? "越高越好"
                : "越低越好"}
            </h2>
            <p className="text-mute text-sm sm:text-base leading-relaxed mb-2">
              {view === "advanced" ? advMeta.desc : meta.desc}
            </p>
            <p className="font-mono text-mute/70 text-[11px] tracking-[0.2em] leading-relaxed">
              ⚓ {view === "advanced" ? advMeta.range : meta.range}
            </p>
          </div>
        </section>

        {/* ── LEADERBOARD TABLE · BASIC view · W3C APG sortable ── */}
        {view === "basic" && (
        <section
          aria-label={`投手排行表 · 排序依 ${meta.label} · ${meta.higherIsBetter ? "高至低" : "低至高"}`}
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12"
        >
          <div role="status" aria-live="polite" className="sr-only">
            排序依 {meta.label}({meta.en})·
            {meta.higherIsBetter ? "由高至低" : "由低至高"}· 共 {sorted.length} 位投手
          </div>
          <div className="border border-line/60 bg-slate/20 overflow-x-auto">
            <table className="w-full font-mono text-xs sm:text-sm tabular">
              <thead>
                <tr className="border-b border-line/60 bg-slate/50">
                  <th
                    scope="col"
                    className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs sticky left-0 bg-slate/50"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs"
                  >
                    投手
                  </th>
                  <th
                    scope="col"
                    className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs hidden sm:table-cell"
                  >
                    球團
                  </th>
                  {STAT_ORDER.map((key) => {
                    const isActive = key === activeStat;
                    const sortAttr = isActive
                      ? STAT_META[key].higherIsBetter
                        ? "descending"
                        : "ascending"
                      : "none";
                    return (
                      <th
                        key={key}
                        scope="col"
                        aria-sort={sortAttr}
                        className={`text-right tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs ${
                          isActive
                            ? "text-gold bg-gold/10"
                            : "text-mute/70"
                        }`}
                      >
                        {STAT_META[key].label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, idx) => (
                  <tr
                    key={`${p.team}-${p.name}`}
                    className="border-b border-line/30 hover:bg-slate/30 transition-colors"
                  >
                    <td className="text-mute/60 px-3 py-3 sticky left-0 bg-slate/20">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="text-bone px-3 py-3 font-normal">
                      {p.acnt ? (
                        <span className="inline-flex items-baseline gap-1.5 flex-wrap">
                          <Link
                            href={`/cpbl-pitchers/${p.acnt}`}
                            className="hover:text-gold underline-offset-4 hover:underline transition-colors"
                            aria-label={`${p.name} 球員頁 · ${p.team}${getCpblAdvancedByAcnt(p.acnt) ? "(含 Trackman radar)" : ""}`}
                          >
                            {p.name}
                          </Link>
                          {getCpblAdvancedByAcnt(p.acnt) && (
                            <span
                              lang="en"
                              className="font-mono text-gold/75 text-[8px] tracking-[0.25em] tabular px-1 py-0 border border-gold/30 bg-gold/5"
                              title="Trackman radar advanced stats available"
                              aria-hidden="true"
                            >
                              ✓ T
                            </span>
                          )}
                        </span>
                      ) : (
                        p.name
                      )}
                    </td>
                    <td className="text-mute/85 px-3 py-3 hidden sm:table-cell">
                      {p.team}
                    </td>
                    {STAT_ORDER.map((key) => {
                      const isActive = key === activeStat;
                      const value = p[key];
                      const m = STAT_META[key];
                      return (
                        <td
                          key={key}
                          className={`text-right px-3 py-3 ${
                            isActive
                              ? "text-gold font-medium bg-gold/5"
                              : "text-mute"
                          }`}
                        >
                          {value.toFixed(m.decimals)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ N = {sorted.length} 投手 · 資料 fetched {CPBL_PITCHER_FETCH_DATE}{" "}
            · IP &lt; 20 樣本小 · 排行僅供方向參考 · 對個別投手 N≥30 才
            statistical significance 顯著 · per /audit S05 PRE-COMMIT
          </p>
        </section>
        )}

        {/* ── LEADERBOARD TABLE · ADVANCED view · Trackman radar ── */}
        {view === "advanced" && (
        <section
          aria-label={`投手 Trackman 排行 · 排序依 ${advMeta.label} · ${advMeta.higherIsBetter ? "高至低" : "低至高"}`}
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12"
        >
          <div role="status" aria-live="polite" className="sr-only">
            ADVANCED · 排序依 {advMeta.label}({advMeta.en})·
            {advMeta.higherIsBetter ? "由高至低" : "由低至高"}· 共 {advancedSorted.length} 位 Trackman tracked 投手
          </div>
          <div className="border border-line/60 bg-slate/20 overflow-x-auto">
            <table className="w-full font-mono text-xs sm:text-sm tabular">
              <thead>
                <tr className="border-b border-line/60 bg-slate/50">
                  <th scope="col" className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs sticky left-0 bg-slate/50">
                    #
                  </th>
                  <th scope="col" className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs">
                    投手
                  </th>
                  <th scope="col" className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs hidden sm:table-cell">
                    球團
                  </th>
                  {ADVANCED_STAT_ORDER.map((key) => {
                    const isActive = key === activeAdvStat;
                    const sortAttr = isActive
                      ? ADVANCED_STAT_META[key].higherIsBetter
                        ? "descending"
                        : "ascending"
                      : "none";
                    return (
                      <th
                        key={key}
                        scope="col"
                        aria-sort={sortAttr}
                        className={`text-right tracking-[0.2em] px-3 py-3 text-[10px] sm:text-xs ${
                          isActive
                            ? "text-gold bg-gold/10"
                            : "text-mute/70"
                        }`}
                      >
                        {ADVANCED_STAT_META[key].label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {advancedSorted.map((row, idx) => (
                  <tr
                    key={`${row.advanced.team}-${row.advanced.name}`}
                    className="border-b border-line/30 hover:bg-slate/30 transition-colors"
                  >
                    <td className="text-mute/60 px-3 py-3 sticky left-0 bg-slate/20">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="text-bone px-3 py-3 font-normal">
                      <Link
                        href={`/cpbl-pitchers/${row.advanced.acnt}`}
                        className="hover:text-gold underline-offset-4 hover:underline transition-colors"
                        aria-label={`${row.advanced.name} 球員頁 · ${row.advanced.team}(含 Trackman radar)`}
                      >
                        {row.advanced.name}
                      </Link>
                    </td>
                    <td className="text-mute/85 px-3 py-3 hidden sm:table-cell">
                      {row.advanced.team}
                    </td>
                    {ADVANCED_STAT_ORDER.map((key) => {
                      const isActive = key === activeAdvStat;
                      const value = row.advanced[key];
                      return (
                        <td
                          key={key}
                          className={`text-right px-3 py-3 tabular ${
                            isActive
                              ? "text-gold font-medium bg-gold/5"
                              : "text-mute"
                          }`}
                        >
                          {value === null ? "—" : value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ N = {advancedSorted.length} Trackman tracked 投手 · {cpblPitchers.length - advancedSorted.length} 投手 不在此 cache · 百分位 0-100 vs CPBL league · 0 付費 API · 0 繞 paywall · fetch script 公開 GitHub · per /audit S02 ESTIMATION DISCLOSURE
          </p>
        </section>
        )}

        {/* ── FAN-GRAMMAR INTERPRETATION ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / 怎麼讀這份排行
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-5">
            數字不是答案 · 是問題
          </h2>
          <div className="space-y-3 text-mute text-sm sm:text-base leading-relaxed">
            <p>
              ZONE 27 不販售「鐵口直斷」 也不評等「誰是 ace」。 我們 publish
              這份排行讓您自己讀:某投手 K/9 突然 +2 = 球感變好 OR 樣本太小?
              某投手 BB/9 連 3 場上升 = 控球崩 OR 教練調整放球點?
            </p>
            <p>
              這就是 sabermetric 的核心:
              <strong className="text-bone">用數字問更好的問題</strong>,不是
              用數字 mute 觀察。 排行只是入口 · 真正的洞察在 /matches
              引擎模擬 + /track-record 賽後對賬。
            </p>
          </div>
          <div className="mt-7 grid sm:grid-cols-3 gap-3">
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
                今日 CPBL 賽事 + 引擎模擬
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
                自己跑 1 萬次模擬 看任何 matchup
              </p>
            </Link>
            <Link
              href="/methodology"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                / METHODOLOGY
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                這些指標怎麼餵進引擎 · 程式碼公開
              </p>
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這份排行是 ZONE 27 第一個「power-user 互動表格」 · Baseball Savant
            Custom Leaderboards pattern。 6 個指標 · URL 可分享(<code className="font-mono text-bone bg-slate/40 px-1.5 py-0.5 rounded-sm text-[12px]">?stat=k9</code>)·
            LINE 轉傳直接看同一份排序。
          </p>
          <p>
            CPBL only · 永遠 only · per /integrity rule 12。 不爬 MLB 排行 ·
            不接付費 API · 純 cpbl.com.tw 公開 box score。 N 才 16 投手 ·
            等 CPBL pipeline 自動化後會擴到所有投手 + 打者 splits。
          </p>
          <p>
            這份頁面永遠 FREE · 不 paywall · 不 email gate · per /integrity
            「engine FREE forever」 binding。 BLACK CARD 加深的方向 = per-pitcher
            × per-batter probability split(engine 跑出來公開 · 同 base 排行
            一樣全 visible)· 沒有「上面 free 下面 paywall」 dark pattern。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/cpbl-pitchers" />
      </main>

      <Footer />
    </div>
  );
}
