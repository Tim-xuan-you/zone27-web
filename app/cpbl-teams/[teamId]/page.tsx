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
  CPBL_TEAMS,
  getTeamById,
  type CpblTeamId,
} from "@/lib/teams";
import {
  cpblPitchers,
  CPBL_PITCHER_FETCH_DATE,
  type CpblPitcherStats,
} from "@/lib/cpbl-pitchers";
import { getCpblAdvancedByAcnt } from "@/lib/cpbl-advanced";

type Props = {
  params: Promise<{ teamId: string }>;
};

export async function generateStaticParams() {
  return CPBL_TEAMS.map((team) => ({ teamId: team.id }));
}

function isTeamId(v: string): v is CpblTeamId {
  return CPBL_TEAMS.some((t) => t.id === v);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamId } = await params;
  if (!isTeamId(teamId)) {
    return { title: "Team Not Found · CPBL · ZONE 27" };
  }
  const team = getTeamById(teamId);
  if (!team) return { title: "Team Not Found · CPBL · ZONE 27" };

  const teamPitchers = cpblPitchers.filter((p) => p.team === team.name);
  return {
    title: `${team.name} 投手 · ${teamPitchers.length} 人 · 進階指標 · CPBL · ZONE 27`,
    description: `${team.name}(${team.en})CPBL 隊伍 ${teamPitchers.length} 位投手進階數據百分位視覺化 · K/9 + BB/9 + HR/9 + WHIP + ERA + IP · 資料來自 stats.cpbl.com.tw 公開 box score · 0 付費 API。`,
    openGraph: {
      title: `${team.name} 投手 · ${teamPitchers.length} 人 · ZONE 27`,
      description: `${team.en} · ${teamPitchers.length} 投手 · 進階數據百分位 · CPBL`,
      type: "article",
      url: `/cpbl-teams/${teamId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${team.name} 投手 · ZONE 27`,
      description: `${team.en} · ${teamPitchers.length} pitchers · 進階數據百分位`,
    },
    alternates: { canonical: `/cpbl-teams/${teamId}` },
  };
}

export const revalidate = 3600; // hourly

export default async function TeamPage({ params }: Props) {
  const { teamId } = await params;
  if (!isTeamId(teamId)) {
    notFound();
  }
  const team = getTeamById(teamId);
  if (!team) {
    notFound();
  }

  // All pitchers from this team · sorted by K/9 desc (best stuff first)。
  const teamPitchers = cpblPitchers
    .filter((p) => p.team === team.name)
    .sort((a, b) => b.k9 - a.k9);

  // Team aggregate stats · league context anchor。
  const aggregate =
    teamPitchers.length > 0
      ? {
          avgK9: (
            teamPitchers.reduce((sum, p) => sum + p.k9, 0) /
            teamPitchers.length
          ).toFixed(2),
          avgBb9: (
            teamPitchers.reduce((sum, p) => sum + p.bb9, 0) /
            teamPitchers.length
          ).toFixed(2),
          avgEra: (
            teamPitchers.reduce((sum, p) => sum + p.era, 0) /
            teamPitchers.length
          ).toFixed(2),
          totalIp: teamPitchers
            .reduce((sum, p) => sum + p.ip, 0)
            .toFixed(1),
        }
      : null;

  // R100 W1 · Team-level Trackman aggregate · derived from cpbl-advanced ·
  // 顯示「球團 N 位 trackman 進階指標投手 + 平均 K% + 平均 wOBA-against 百分位」 ·
  // 補 percentile depth · honest empty-state when 0 trackman pitchers。
  const trackmanPitchers = teamPitchers
    .map((p) =>
      p.acnt ? { pitcher: p, advanced: getCpblAdvancedByAcnt(p.acnt) } : null
    )
    .filter(
      (entry): entry is { pitcher: CpblPitcherStats; advanced: NonNullable<ReturnType<typeof getCpblAdvancedByAcnt>> } =>
        entry !== null && entry.advanced !== null
    );

  const trackmanAggregate =
    trackmanPitchers.length > 0
      ? {
          count: trackmanPitchers.length,
          avgKPct: Math.round(
            trackmanPitchers
              .filter((e) => e.advanced.kPct !== null)
              .reduce((sum, e) => sum + (e.advanced.kPct ?? 0), 0) /
              Math.max(
                1,
                trackmanPitchers.filter((e) => e.advanced.kPct !== null).length
              )
          ),
          avgWobaAgainst: Math.round(
            trackmanPitchers
              .filter((e) => e.advanced.wobaAgainst !== null)
              .reduce((sum, e) => sum + (e.advanced.wobaAgainst ?? 0), 0) /
              Math.max(
                1,
                trackmanPitchers.filter((e) => e.advanced.wobaAgainst !== null)
                  .length
              )
          ),
          avgWhiffPct: Math.round(
            trackmanPitchers
              .filter((e) => e.advanced.whiffPct !== null)
              .reduce((sum, e) => sum + (e.advanced.whiffPct ?? 0), 0) /
              Math.max(
                1,
                trackmanPitchers.filter((e) => e.advanced.whiffPct !== null)
                  .length
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
            <Link
              href="/cpbl-pitchers"
              className="hover:text-gold transition-colors"
            >
              CPBL 投手排行
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">{team.short}</span>
          </div>
        </section>

        {/* ── HERO · team identity with brand accent ── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-10 pb-8 relative">
          <p
            lang="en"
            className="absolute top-10 right-6 sm:right-10 font-mono text-mute/60 text-[9px] tracking-[0.3em] tabular hidden sm:block"
          >
            DATA · {CPBL_PITCHER_FETCH_DATE} TPE · N={teamPitchers.length}
          </p>
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-5">
            CPBL TEAM PROFILE · ZONE 27
          </p>
          <div className="flex items-baseline gap-4 sm:gap-6 mb-3 flex-wrap">
            <h1 className="text-4xl sm:text-6xl text-bone font-light tracking-tight leading-[1.05]">
              {team.name}
            </h1>
            <span
              lang="en"
              className="font-mono text-xl sm:text-2xl tracking-[0.2em] tabular"
              style={{ color: team.hexAccent }}
            >
              {team.en}
            </span>
          </div>
          <div
            className="h-[2px] max-w-[260px] mt-2"
            style={{ backgroundColor: team.hexAccent, opacity: 0.6 }}
            aria-hidden="true"
          />

          {aggregate && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-3xl">
              <AggregateCell label="AVG K/9" value={aggregate.avgK9} />
              <AggregateCell label="AVG BB/9" value={aggregate.avgBb9} />
              <AggregateCell label="AVG ERA" value={aggregate.avgEra} />
              <AggregateCell label="TOTAL IP" value={aggregate.totalIp} />
            </div>
          )}

          {/* R100 W1 · Team-level Trackman aggregate · 12 pitchers across
              league have advanced metrics · this team's avg percentile vs
              league reference · honest count if 0。 */}
          {trackmanAggregate && (
            <div className="mt-4 max-w-3xl">
              <p
                lang="en"
                className="font-mono text-gold/85 text-[9px] tracking-[0.3em] mb-2"
              >
                ↘ TRACKMAN AGGREGATE · {trackmanAggregate.count} of{" "}
                {teamPitchers.length} pitchers tracked
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <TrackmanAggregateCell
                  label="AVG K %"
                  en="STRIKEOUT RATE"
                  percentile={trackmanAggregate.avgKPct}
                  higherBetter={true}
                />
                <TrackmanAggregateCell
                  label="AVG WHIFF %"
                  en="SWING-AND-MISS"
                  percentile={trackmanAggregate.avgWhiffPct}
                  higherBetter={true}
                />
                <TrackmanAggregateCell
                  label="AVG wOBA-A"
                  en="WEIGHTED OBP"
                  percentile={trackmanAggregate.avgWobaAgainst}
                  higherBetter={false}
                />
              </div>
            </div>
          )}

          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ Team aggregate from {teamPitchers.length} 投手 · {team.name}{" "}
            (database fetched {CPBL_PITCHER_FETCH_DATE} TPE)· 排序依 K/9 desc
            {trackmanAggregate
              ? ` · Trackman percentile aggregate from ${trackmanAggregate.count} tracked pitchers`
              : " · Trackman advanced metrics 暫 0 tracked in 此 team(per Disclosure axiom 不藏)"}
          </p>
          <div className="mt-5">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── PITCHERS · stacked profile cards ───────── */}
        <section
          aria-labelledby="pitchers-list-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10"
        >
          <h2
            id="pitchers-list-heading"
            className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6"
          >
            {team.short} 投手 · {teamPitchers.length} 人
          </h2>

          {teamPitchers.length === 0 ? (
            <p className="text-mute leading-relaxed">
              此隊伍目前 0 位投手 in lib/cpbl-pitchers.ts cache · 等下次{" "}
              <code className="font-mono text-bone bg-slate/40 px-1.5 py-0.5 rounded-sm text-[12px]">
                npm run fetch-cpbl-pitchers
              </code>{" "}
              auto-update。
            </p>
          ) : (
            <div className="space-y-5">
              {teamPitchers.map((pitcher, idx) => (
                <PitcherCard
                  key={pitcher.acnt ?? pitcher.name}
                  pitcher={pitcher}
                  rank={idx + 1}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── CROSS-LINK · other 5 teams ───────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-10">
          <p
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.4em] mb-4"
          >
            / OTHER CPBL TEAMS · cross-navigate
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CPBL_TEAMS.filter((t) => t.id !== team.id).map((otherTeam) => (
              <Link
                key={otherTeam.id}
                href={`/cpbl-teams/${otherTeam.id}`}
                className="border border-line/60 bg-slate/30 hover:border-gold/60 p-3 sm:p-4 transition-colors group flex items-center gap-3"
              >
                <span
                  className="font-mono text-sm font-bold tracking-tight shrink-0"
                  style={{ color: otherTeam.hexAccent }}
                  aria-hidden="true"
                >
                  {otherTeam.initial}
                </span>
                <span className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                  {otherTeam.short}
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-5 font-mono text-mute text-[10px] tracking-[0.3em] text-center">
            ← 完整 16 投手排行 ·{" "}
            <Link
              href="/cpbl-pitchers"
              className="text-gold underline-offset-4 hover:underline"
            >
              /cpbl-pitchers
            </Link>
          </p>
        </section>

        <FounderSignOff>
          <p>
            這份{team.name}({team.en})隊伍頁是 ZONE 27 Baseball Savant +
            FanGraphs team page 借鑑的第 3 步 · /cpbl-pitchers 排行 +
            /cpbl-pitchers/[acnt] 球員 profile + 此 /cpbl-teams/[teamId] 隊伍
            aggregation · CPBL fan tribal home base。
          </p>
          <p>
            目前先做 CPBL · 其他運動逐步上(各配自己的引擎)·
            不接付費 API · 純 stats.cpbl.com.tw 公開 box score derived。
            隊伍 logo color({team.hexAccent})從 lib/teams.ts canonical
            single-source 對齊。
          </p>
          <p>
            尚未 ship · 球隊近 30 天連勝 streak · 球隊 wOBA against splits ·
            球隊 home/away record · 等 CPBL pipeline 完整自動化後 expand。
            base 隊伍頁永遠 FREE · 不 paywall · 不 email gate · per /integrity
            「engine FREE forever」 binding。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/cpbl-pitchers" />
      </main>

      <Footer />
    </div>
  );
}

// ── PitcherCard · embedded profile with percentile stack ──
function PitcherCard({
  pitcher,
  rank,
}: {
  pitcher: CpblPitcherStats;
  rank: number;
}) {
  // R99 W2 · Trackman radar discoverability badge · visible signal that
  // clicking name leads to deeper 7-metric Statcast-grade stack per R99 W1
  // /cpbl-pitchers/[acnt] integration · per Disclosure axiom 不藏。
  const hasAdvanced = pitcher.acnt
    ? getCpblAdvancedByAcnt(pitcher.acnt) !== null
    : false;

  return (
    <article className="border border-line/60 bg-slate/20 px-4 sm:px-6 py-5 sm:py-6">
      <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            lang="en"
            className="font-mono text-mute/60 text-[10px] tracking-[0.25em] tabular"
          >
            #{String(rank).padStart(2, "0")}
          </span>
          {pitcher.acnt ? (
            <Link
              href={`/cpbl-pitchers/${pitcher.acnt}`}
              className="text-bone text-lg sm:text-xl font-normal tracking-tight hover:text-gold underline-offset-4 hover:underline transition-colors"
              aria-label={`${pitcher.name} 球員頁${hasAdvanced ? "(含 Trackman radar 進階指標)" : ""}`}
            >
              {pitcher.name}
            </Link>
          ) : (
            <span className="text-bone text-lg sm:text-xl font-normal tracking-tight">
              {pitcher.name}
            </span>
          )}
          {hasAdvanced && (
            <span
              lang="en"
              className="font-mono text-gold/85 text-[9px] tracking-[0.3em] tabular px-1.5 py-0.5 border border-gold/40 bg-gold/5"
              title="Trackman radar 整合 · 7 Statcast-grade advanced metrics available · click name to see"
            >
              ✓ TRACKMAN
            </span>
          )}
        </div>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[10px] tracking-[0.25em] tabular"
        >
          {pitcher.ip.toFixed(1)} IP · {pitcher.k} K · {pitcher.bb} BB
        </span>
      </div>

      {/* Compact 5-bar stack(reuse R96 W2 StatPercentileBar)*/}
      <div className="space-y-0.5">
        <StatPercentileBar stat="ERA" value={pitcher.era.toFixed(2)} />
        <StatPercentileBar stat="K/9" value={pitcher.k9.toFixed(2)} />
        <StatPercentileBar stat="BB/9" value={pitcher.bb9.toFixed(2)} />
        <StatPercentileBar stat="WHIP" value={pitcher.whip.toFixed(2)} />
        <StatPercentileBar stat="HR/9" value={pitcher.hr9.toFixed(2)} />
      </div>
    </article>
  );
}

// ── AggregateCell · 4-cell team aggregate stat ──
function AggregateCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line/40 bg-slate/20 px-3 sm:px-4 py-3 text-center">
      <p
        lang="en"
        className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1"
      >
        {label}
      </p>
      <p className="font-mono text-bone tabular text-xl sm:text-2xl font-light">
        {value}
      </p>
    </div>
  );
}

// ── TrackmanAggregateCell · team-level percentile aggregate ──
function TrackmanAggregateCell({
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
      title={`${label}(${en})· team avg 百分位 ${percentile}/100 · ${higherBetter ? "高 = 強" : "低 = 強"} · ${tierLabel}`}
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
