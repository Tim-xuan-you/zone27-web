import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SeasonRecapView from "@/components/SeasonRecapView";
import { getProfileByCode, getPredictionsByCode } from "@/lib/profile-server";
import { aggregateIdentity } from "@/lib/predictions";
import { gradeSoccerPicks, type SoccerPick } from "@/lib/soccer/predictions";
import { baseballPropIdMatches } from "@/lib/baseball-totals";
import {
  getEngineFavorite,
  getMatchStartIso,
  matches as allMatches,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { getSoccerLedgerResults } from "@/lib/soccer/football-data";
import { getSoccerEnginePicks } from "@/lib/soccer/locked";
import { buildSettledCards, computeTrophies } from "@/lib/trophies";
import { createPageMetadata } from "@/lib/page-og";
import { normalizeProfileCode } from "@/lib/profile-code";
import {
  normalizeSeasonPeriod,
  filterBaseballByMonth,
  filterSoccerByMonth,
  monthActiveDays,
  pickHighlights,
  monthLabel,
} from "@/lib/season-recap";

// ── ZONE 27 · /u/[code]/season/[YYYY-MM] · 月度賽季回顧(Spotify-Wrapped 誠實版)──
// 公開檔 /u/[code] 是「整本帳的證物」(全期)· 這裡是「單月的故事」(高光 + 一筆誠實
// 失手 + 紀律天數)。 100% reuse profile 同一套讀取 + derive(aggregateIdentity /
// gradeSoccerPicks / computeTrophies)· 只在餵進去前把 picks 按「鎖定台北月」切片。
//
// 不復活刻意砍掉的 /annual(那是品牌年報索引)· 這是會員自己的、可分享的月度收據。
// 快取:revalidate 60s(同 /u/[code])· 動態碼 + 月份 on-demand ISR。
// GRACEFUL:碼非法 / 月份非法 / 查無 → 404 · 該月無押 → 尊嚴空狀態(非 404)。
// ─────────────────────────────────────────────────────

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; period: string }>;
}): Promise<Metadata> {
  const { code: rawCode, period: rawPeriod } = await params;
  const code = normalizeProfileCode(rawCode);
  const period = normalizeSeasonPeriod(rawPeriod);
  if (!code || !period) return { title: "找不到這份回顧" };
  const profile = await getProfileByCode(code);
  if (!profile) return { title: "找不到這份回顧" };
  const name = profile.displayName || `球迷 #${profile.authorCode}`;
  const label = monthLabel(period);
  return createPageMetadata({
    title: `${name} 的 ${label} 回顧`,
    description: `${name} 在 ZONE 27 ${label} 的賽季回顧 —— 含贏含輸、賽前鎖定、刪不掉。 本月準度、最漂亮一手、一筆誠實失手。`,
    ogDescription: `${name} 的 ${label} 回顧 —— 含輸、賽前鎖定。`,
    path: `/u/${code}/season/${period}`,
  });
}

export default async function SeasonRecapPage({
  params,
}: {
  params: Promise<{ code: string; period: string }>;
}) {
  const { code: rawCode, period: rawPeriod } = await params;
  const code = normalizeProfileCode(rawCode);
  const period = normalizeSeasonPeriod(rawPeriod);
  if (!code || !period) notFound();

  const profile = await getProfileByCode(code);
  if (!profile) notFound();

  const { baseball, soccer } = await getPredictionsByCode(code);

  // 同 /u/[code]:賽果 map(CPBL + MLB live + MLB 永久鎖定 · 永久源放最後蓋過 live)。
  const mlbLive = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbLive, ...getMlbLockedMatches()];
  const idMatches = [
    ...allWithMlb.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: getEngineFavorite(m),
      startISO: getMatchStartIso(m),
    })),
    // 玩法併入同一本帳:大小分當「虛擬比賽」一起進賽季回顧對帳(同源比賽清單)。
    ...baseballPropIdMatches(allWithMlb),
  ];

  // 按「鎖定台北月」切片 → 餵同一套 derive(本月 = 你掌控的下注那天的月)。
  const mBaseball = filterBaseballByMonth(baseball, period);
  const mSoccer = filterSoccerByMonth(soccer, period);
  const hasActivity =
    Object.keys(mBaseball).length > 0 || mSoccer.length > 0;

  const identity = aggregateIdentity(mBaseball, idMatches, period);

  // 足球本月戰績(同 /u/[code] 的讀取 · 只是 picks 切過月)。
  const soccerResults = await getSoccerLedgerResults();
  const soccerEnginePicks = getSoccerEnginePicks();
  const resultsMap: Record<string, { outcome: SoccerPick; kickoffISO: string }> = {};
  for (const r of soccerResults) {
    resultsMap[r.matchId] = { outcome: r.outcome, kickoffISO: r.kickoffISO };
  }
  const soccerRecord = gradeSoccerPicks(mSoccer, resultsMap, soccerEnginePicks);

  // 本月戰功卡 → 挑高光(餵切過月的 picks · 故 trophies 已是本月子集)。
  const trophies = computeTrophies(mBaseball, mSoccer, buildSettledCards());
  const highlights = pickHighlights(trophies);
  const activeDays = monthActiveDays(mBaseball, mSoccer);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main" className="flex-1">
        <SeasonRecapView
          profile={profile}
          period={period}
          identity={identity}
          soccer={soccerRecord}
          highlights={highlights}
          activeDays={activeDays}
          hasActivity={hasActivity}
        />
      </main>
      <Footer />
    </div>
  );
}
