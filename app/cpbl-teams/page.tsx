import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import { CPBL_TEAMS } from "@/lib/teams";
import {
  cpblPitchers,
  CPBL_PITCHER_FETCH_DATE,
} from "@/lib/cpbl-pitchers";
import {
  cpblAdvanced,
  getCpblAdvancedByAcnt,
  CPBL_ADVANCED_FETCH_DATE,
} from "@/lib/cpbl-advanced";

export const metadata: Metadata = {
  title: "CPBL 6 隊伍 投手 aggregation · ZONE 27",
  description:
    "中華職棒 6 個球團投手 sabermetric 進階指標 aggregation pages · 富邦悍將 + 統一7-ELEVEn獅 + 中信兄弟 + 樂天桃猿 + 味全龍 + 台鋼雄鷹 · 球迷 tribal home base · Trackman radar league-wide aggregate · 資料來自 stats.cpbl.com.tw 公開 box score · 0 付費 API。",
  openGraph: {
    title: "CPBL 6 隊伍 投手 aggregation · ZONE 27",
    description:
      "6 球團投手 percentile aggregation · league Trackman aggregate · 球迷 tribal home base · CPBL only forever",
    type: "article",
    url: "/cpbl-teams",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPBL 6 隊伍 · ZONE 27",
    description: "6 球團 + league Trackman aggregate · 球迷 tribal home base",
  },
  alternates: { canonical: "/cpbl-teams" },
};

export const revalidate = 3600;

export default function CpblTeamsIndexPage() {
  // Sort teams by pitcher count desc(largest roster first · same-count
  // teams maintain CPBL_TEAMS canonical order)。 R107 W1 · 每隊 trackmanCount
  // 加入 card chip · 為 league coverage gap signal 鋪路。
  const teamsWithCount = CPBL_TEAMS.map((team) => {
    const teamPitchers = cpblPitchers.filter((p) => p.team === team.name);
    const trackmanCount = teamPitchers.filter((p) =>
      p.acnt ? getCpblAdvancedByAcnt(p.acnt) !== null : false
    ).length;
    return {
      ...team,
      pitcherCount: teamPitchers.length,
      trackmanCount,
    };
  });
  const totalPitchers = teamsWithCount.reduce(
    (sum, t) => sum + t.pitcherCount,
    0
  );

  // R107 W1 · League-wide Trackman aggregate · parent-index canonical view ·
  // 同 R100 milestone team-level percentile strip pattern 但 scope expand
  // 到 entire 6-team league · coverage gap honest disclosure(X of N tracked
  // · Y of 6 teams have ≥1)per [[zone27-disclosure-philosophy]]。
  const teamsWithTrackman = teamsWithCount.filter((t) => t.trackmanCount > 0)
    .length;
  const leagueTrackmanAggregate =
    cpblAdvanced.length > 0
      ? {
          count: cpblAdvanced.length,
          avgKPct: Math.round(
            cpblAdvanced
              .filter((p) => p.kPct !== null)
              .reduce((sum, p) => sum + (p.kPct ?? 0), 0) /
              Math.max(1, cpblAdvanced.filter((p) => p.kPct !== null).length)
          ),
          avgWhiffPct: Math.round(
            cpblAdvanced
              .filter((p) => p.whiffPct !== null)
              .reduce((sum, p) => sum + (p.whiffPct ?? 0), 0) /
              Math.max(
                1,
                cpblAdvanced.filter((p) => p.whiffPct !== null).length
              )
          ),
          avgWobaAgainst: Math.round(
            cpblAdvanced
              .filter((p) => p.wobaAgainst !== null)
              .reduce((sum, p) => sum + (p.wobaAgainst ?? 0), 0) /
              Math.max(
                1,
                cpblAdvanced.filter((p) => p.wobaAgainst !== null).length
              )
          ),
        }
      : null;

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
            <span className="text-gold">CPBL 6 隊伍</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8 relative">
          <p
            lang="en"
            className="absolute top-10 right-6 sm:right-10 font-mono text-mute/60 text-[9px] tracking-[0.3em] tabular hidden sm:block"
          >
            DATA · {CPBL_PITCHER_FETCH_DATE} TPE · 6 teams · N={totalPitchers}
          </p>
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-5">
            CPBL TEAM AGGREGATION · ZONE 27
          </p>
          <h1 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
            CPBL 6 隊伍 ·{" "}
            <span className="text-gold">投手 aggregation</span>
          </h1>
          <div className="zone27-rule max-w-[260px] mt-5" aria-hidden="true" />
          <p className="mt-6 text-mute text-sm sm:text-base leading-relaxed max-w-xl">
            每個 CPBL 球團 dedicated 隊伍頁 · 球團 logo color brand identity +
            team aggregate stats(AVG K/9 + AVG BB/9 + AVG ERA + TOTAL IP)+
            隊內投手 percentile visualization。 球迷 tribal home base · 統一獅
            fan / 中信兄弟 fan / etc 各自 dedicated page。
          </p>
          <div className="mt-5">
            <ArticleMeta readingMin={2} />
          </div>
        </section>

        {/* ── LEAGUE TRACKMAN AGGREGATE STRIP ─────────
            R107 W1 · 12 Trackman-tracked pitchers across 6 teams · 3-cell
            percentile aggregate(AVG K% + WHIFF% + wOBA-A)mirror R100
            team-level pattern · parent-index level league coverage stat ·
            coverage gap honest disclosure per Disclosure axiom。 */}
        {leagueTrackmanAggregate && (
          <section
            aria-labelledby="league-trackman-aggregate-heading"
            className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10"
          >
            <h2
              id="league-trackman-aggregate-heading"
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
            >
              ↘ LEAGUE TRACKMAN AGGREGATE · {leagueTrackmanAggregate.count} of{" "}
              {totalPitchers} pitchers · {teamsWithTrackman} of 6 teams
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <LeagueTrackmanCell
                label="LEAGUE AVG K %"
                en="STRIKEOUT RATE"
                percentile={leagueTrackmanAggregate.avgKPct}
                higherBetter={true}
              />
              <LeagueTrackmanCell
                label="LEAGUE AVG WHIFF %"
                en="SWING-AND-MISS"
                percentile={leagueTrackmanAggregate.avgWhiffPct}
                higherBetter={true}
              />
              <LeagueTrackmanCell
                label="LEAGUE AVG wOBA-A"
                en="WEIGHTED OBP"
                percentile={leagueTrackmanAggregate.avgWobaAgainst}
                higherBetter={false}
              />
            </div>
            <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
              ⚓ Trackman radar 7-metric Statcast-grade · fetched{" "}
              {CPBL_ADVANCED_FETCH_DATE} TPE · league coverage{" "}
              {Math.round(
                (leagueTrackmanAggregate.count / Math.max(1, totalPitchers)) *
                  100
              )}
              % · 6-{teamsWithTrackman}={6 - teamsWithTrackman} 隊 0 tracked
              pitchers(per Disclosure axiom 不藏)
            </p>
          </section>
        )}

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── 6 TEAM CARD GRID ────────────────────── */}
        <section
          aria-label="CPBL 6 球團"
          className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {teamsWithCount.map((team) => (
              <Link
                key={team.id}
                href={`/cpbl-teams/${team.id}`}
                className="border border-line/60 bg-slate/20 hover:border-gold/60 hover:bg-slate/40 transition-colors p-5 sm:p-6 group"
              >
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <span
                    lang="en"
                    className="font-mono text-2xl font-bold tracking-tight"
                    style={{ color: team.hexAccent }}
                    aria-hidden="true"
                  >
                    {team.initial}
                  </span>
                  <span
                    lang="en"
                    className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular"
                  >
                    {team.pitcherCount} 投手
                  </span>
                </div>
                <h2 className="text-bone text-xl font-light tracking-tight mb-1 group-hover:text-gold transition-colors">
                  {team.name}
                </h2>
                <p
                  lang="en"
                  className="font-mono text-[10px] tracking-[0.25em] mb-3"
                  style={{ color: `${team.hexAccent}aa` }}
                >
                  {team.en}
                </p>
                <div
                  className="h-[2px] w-full"
                  style={{ backgroundColor: team.hexAccent, opacity: 0.5 }}
                  aria-hidden="true"
                />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
                    → percentile + aggregate
                  </p>
                  {team.trackmanCount > 0 ? (
                    <span
                      lang="en"
                      className="font-mono text-gold/85 text-[9px] tracking-[0.3em] tabular px-1.5 py-0.5 border border-gold/40 bg-gold/5"
                      title={`${team.trackmanCount} of ${team.pitcherCount} pitchers have Trackman radar 7-metric advanced data`}
                    >
                      ✓ {team.trackmanCount} TRACKMAN
                    </span>
                  ) : (
                    <span
                      lang="en"
                      className="font-mono text-mute/50 text-[9px] tracking-[0.3em] tabular"
                      title="0 pitchers with Trackman radar data · per Disclosure axiom 不藏"
                    >
                      0 TRACKMAN
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CROSS-LINK · leaderboard + player profiles ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-10">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / ALSO IN CPBL PITCHER FAMILY
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/cpbl-pitchers"
              className="border border-line/60 bg-slate/30 hover:border-gold/60 p-4 transition-colors group"
            >
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
              >
                / CPBL-PITCHERS
              </p>
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors mb-1">
                完整 {totalPitchers} 投手排行 · 6 stat tabs · URL-shareable
              </p>
              <p className="text-mute text-[12px] leading-relaxed">
                Baseball Savant Custom Leaderboards pattern · K/9 + BB/9 + HR/9
                + WHIP + ERA + IP · LINE 轉傳直接看相同排序
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
              <p className="text-bone text-sm leading-snug group-hover:text-gold transition-colors mb-1">
                這些指標怎麼餵進引擎 · 程式碼公開
              </p>
              <p className="text-mute text-[12px] leading-relaxed">
                lib/simulator.ts · 蒙地卡羅 Monte Carlo · GitHub MIT licensed
              </p>
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這份 CPBL 6 隊伍 index 是 Baseball Savant + FanGraphs team navigation
            的入口。 6 球團 dedicated pages · 每個球團 brand color + team
            aggregate + 隊內投手 stacked percentile · 球迷 tribal home base。
          </p>
          <p>
            R107 W1 加 league-wide Trackman aggregate strip · {cpblAdvanced.length}{" "}
            位 trackman radar 7-metric tracked pitchers across {teamsWithTrackman}{" "}
            of 6 teams · 同 R100 milestone team-level pattern · 但 scope expand
            到 parent-index level · coverage gap 不藏(per Disclosure axiom · 6
            -{teamsWithTrackman}={6 - teamsWithTrackman} 隊目前 0 tracked)。
          </p>
          <p>
            CPBL only · 永遠 only · per /integrity rule 12。 不爬 MLB 球團 ·
            不接付費 API · 純 stats.cpbl.com.tw 公開 box score derived ·
            球團 logo color 來自 lib/teams.ts canonical(per Tim 2026-05-22
            W-L logo legend correction)。
          </p>
        </FounderSignOff>
      </main>

      <Footer />
    </div>
  );
}

// ── LeagueTrackmanCell · parent-index 3-cell percentile aggregate ──
// R107 W1 · mirror /cpbl-teams/[teamId] TrackmanAggregateCell pattern
// 但 scope expand 到 league · 6-team 全部 trackman pitchers averaged。
function LeagueTrackmanCell({
  label,
  en,
  percentile,
  higherBetter,
}: {
  label: string;
  en: string;
  percentile: number;
  higherBetter: boolean;
}) {
  const strength = higherBetter ? percentile : 100 - percentile;
  const tier: "elite" | "mid" | "rebuild" =
    strength >= 70 ? "elite" : strength >= 30 ? "mid" : "rebuild";
  const tierClass =
    tier === "elite"
      ? "text-gold"
      : tier === "mid"
      ? "text-bone/85"
      : "text-mute";
  const tierLabel =
    tier === "elite" ? "ELITE" : tier === "mid" ? "MID" : "REBUILD";
  return (
    <div
      className="border border-gold/30 bg-slate/30 px-3 sm:px-4 py-3 text-center"
      title={`${label}(${en})· league avg 百分位 ${percentile}/100 · ${higherBetter ? "高 = 強" : "低 = 強"} · ${tierLabel}`}
    >
      <p
        lang="en"
        className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-1"
      >
        {label}
      </p>
      <p
        className={`font-mono tabular text-xl sm:text-2xl font-light ${tierClass}`}
      >
        {percentile}
      </p>
      <p className="stat-caption font-mono text-mute/60 text-[8px] tracking-[0.2em] mt-0.5">
        {tierLabel}
      </p>
    </div>
  );
}
