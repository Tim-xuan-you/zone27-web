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
import { getSoccerEnginePicksAll } from "@/lib/soccer/locked";
import { soccerPropResults } from "@/lib/soccer/props";
import {
  gradeTennisPicks,
  tennisResults,
  tennisEnginePicks,
} from "@/lib/tennis/matches";
import {
  gradeBadmintonPicks,
  badmintonResults,
  badmintonEnginePicks,
} from "@/lib/badminton/matches";
import {
  gradeMmaPicks,
  mmaResults,
  mmaEnginePicks,
} from "@/lib/mma/matches";
import {
  gradeBasketballPicks,
  basketballResults,
  basketballEnginePicks,
} from "@/lib/basketball/matches";
import { buildSettledCards, computeTrophies } from "@/lib/trophies";
import { createPageMetadata } from "@/lib/page-og";
import { normalizeProfileCode } from "@/lib/profile-code";
import {
  normalizeSeasonPeriod,
  filterBaseballByMonth,
  filterSoccerByMonth,
  filterTennisByMonth,
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

  const { baseball, soccer, tennis, badminton, mma, basketball, soccerProps } = await getPredictionsByCode(code);

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
  // 足球玩法(大小分/讓分)也切月 → 併入本月足球戰績(同一本帳)。
  const mSoccerProps = filterSoccerByMonth(soccerProps, period);
  // 網球也切月 → 本月網球戰績(兩向 · 跟棒球 / 足球分開算)。
  const mTennis = filterTennisByMonth(tennis, period);
  // 羽球也切月(filterTennisByMonth 是泛型 {ts}[] · 兩向 · 跟其他運動分開算)· R264。
  const mBadminton = filterTennisByMonth(badminton, period);
  // MMA 也切月(同泛型 {ts}[] · 兩向 · 跟其他運動分開算)· R278。
  const mMma = filterTennisByMonth(mma, period);
  // 籃球也切月(同泛型 {ts}[] · 兩向 · 跟其他運動分開算)· R291。
  const mBasketball = filterTennisByMonth(basketball, period);
  const hasActivity =
    Object.keys(mBaseball).length > 0 ||
    mSoccer.length > 0 ||
    mSoccerProps.length > 0 ||
    mTennis.length > 0 ||
    mBadminton.length > 0 ||
    mMma.length > 0 ||
    mBasketball.length > 0;

  const identity = aggregateIdentity(mBaseball, idMatches, period);

  // 足球本月戰績(三向 + 玩法 · 同 /u/[code] 的讀取 · 只是 picks 切過月)。
  const soccerResults = await getSoccerLedgerResults();
  const soccerEnginePicks = getSoccerEnginePicksAll();
  const resultsMap: Record<string, { outcome: SoccerPick; kickoffISO: string }> = {};
  for (const r of soccerResults) {
    resultsMap[r.matchId] = { outcome: r.outcome, kickoffISO: r.kickoffISO };
  }
  const soccerRecord = gradeSoccerPicks(
    [...mSoccer, ...mSoccerProps],
    { ...resultsMap, ...soccerPropResults(soccerResults) },
    soccerEnginePicks,
  );

  // 本月網球戰績(兩向 · 賽果 + 引擎開盤都是 server-safe 純函式)。
  const tennisRecord = gradeTennisPicks(mTennis, tennisResults(), tennisEnginePicks());
  // 網球 a/b → home/away(A=home/B=away)· 餵 computeTrophies h2h 配對(本月網球戰功卡也進高光)。
  const mTennisHA = mTennis.map((r) => ({
    matchId: r.matchId,
    pick: (r.pick === "a" ? "home" : "away") as "home" | "away",
    ts: r.ts,
  }));
  // 本月羽球戰績 + 戰功卡(同網球)· R264。
  const badmintonRecord = gradeBadmintonPicks(
    mBadminton,
    badmintonResults(),
    badmintonEnginePicks(),
  );
  const mBadmintonHA = mBadminton.map((r) => ({
    matchId: r.matchId,
    pick: (r.pick === "a" ? "home" : "away") as "home" | "away",
    ts: r.ts,
  }));
  // 本月 MMA 戰績 + 戰功卡(同網球 · 和局場無卡自然略過)· R278。
  const mmaRecord = gradeMmaPicks(mMma, mmaResults(), mmaEnginePicks());
  const mMmaHA = mMma.map((r) => ({
    matchId: r.matchId,
    pick: (r.pick === "a" ? "home" : "away") as "home" | "away",
    ts: r.ts,
  }));
  // 本月籃球戰績 + 戰功卡(🔴 pick 本來就是 home/away · 無轉換)· R291。
  const basketballRecord = gradeBasketballPicks(
    mBasketball,
    basketballResults(),
    basketballEnginePicks(),
  );
  // 本月戰功卡 → 挑高光(餵切過月的 picks · 故 trophies 已是本月子集)。 棒球 / 足球玩法不進戰功卡
  // (虛擬場號配不到 settled card → 自然略過)· 網球 / 羽球 / MMA / 籃球 誰贏卡會進。
  const trophies = computeTrophies(
    mBaseball,
    mSoccer,
    buildSettledCards(),
    mSoccerProps,
    mTennisHA,
    mBadmintonHA,
    mMmaHA,
    mBasketball, // 🔴 籃球 pick 本來就是 home/away → 直接餵(無 a/b 轉換)· R291
  );
  const highlights = pickHighlights(trophies);
  // 對帳天數(紀律)含玩法 + 網球 + 羽球 + MMA 那幾天 —— 都是「回來面對帳本」(各自分開算準度,但都算紀律天)。
  const activeDays = monthActiveDays(mBaseball, [
    ...mSoccer,
    ...mSoccerProps,
    ...mTennis,
    ...mBadminton,
    ...mMma,
    ...mBasketball,
  ]);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main" className="flex-1">
        <SeasonRecapView
          profile={profile}
          period={period}
          identity={identity}
          soccer={soccerRecord}
          tennis={tennisRecord}
          badminton={badmintonRecord}
          mma={mmaRecord}
          basketball={basketballRecord}
          highlights={highlights}
          activeDays={activeDays}
          hasActivity={hasActivity}
        />
      </main>
      <Footer />
    </div>
  );
}
