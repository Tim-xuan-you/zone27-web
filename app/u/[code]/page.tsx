import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProfileView from "@/components/ProfileView";
import { getProfileByCode, getPredictionsByCode } from "@/lib/profile-server";
import {
  aggregateIdentity,
  aggregateStreak,
  computeAccuracySeries,
} from "@/lib/predictions";
import { gradeSoccerPicks, type SoccerPick } from "@/lib/soccer/predictions";
import { baseballPropIdMatches } from "@/lib/baseball-totals";
import {
  computeConfidenceCalibration,
  type CalibrationResult,
} from "@/lib/calibration-master";
import {
  getEngineFavorite,
  getMatchStartIso,
  getCurrentTaipeiMonthKey,
  getTodayTaipei,
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
import { createPageMetadata } from "@/lib/page-og";
import { normalizeProfileCode } from "@/lib/profile-code";
import { buildSettledCards, computeTrophies } from "@/lib/trophies";
import { hasMonthActivity, monthLabel } from "@/lib/season-recap";

// ── ZONE 27 · /u/[code] · 公開含輸 Profile(soul-roadmap P0 keystone)────────
// 任何人(免登入)用永久碼看一位會員攤開、刪不掉、含贏含輸的押注帳本。
// 讀「現成」aggregate(同 /member 同一套 aggregateIdentity / aggregateStreak /
// gradeSoccerPicks)· 只是資料來自「那個碼的人」(0019 anon RPC)而非目前登入者。
//
// 快取:revalidate 60s —— 公開分享用的證物,不需 per-request 即時,但要夠新。
// 不用 force-dynamic(避免每次都打 Supabase / football-data)· 也不 prerender
// (無 generateStaticParams · 動態碼 on-demand ISR)。 GRACEFUL:0019 未套 / 查無 → 404。
// ─────────────────────────────────────────────────────

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code: raw } = await params;
  const code = normalizeProfileCode(raw);
  if (!code) return { title: "找不到這個檔案" };
  const profile = await getProfileByCode(code);
  if (!profile) return { title: "找不到這個檔案" };
  const name = profile.displayName || `球迷 #${profile.authorCode}`;
  return createPageMetadata({
    title: `${name} 的公開戰績`,
    description: `${name} 在 ZONE 27 的押注帳本 —— 含贏含輸、賽前鎖定、刪不掉。準度、對帳紀律、榮譽牆,一次看完。`,
    ogDescription: `${name} 的含輸帳本 —— 賽前鎖定、刪不掉。`,
    path: `/u/${code}`,
  });
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = normalizeProfileCode(raw);
  if (!code) notFound();

  const profile = await getProfileByCode(code);
  if (!profile) notFound();

  const { baseball, soccer, tennis, badminton, mma, soccerProps, calibrationPicks } =
    await getPredictionsByCode(code);

  // 棒球校準身分(CPBL + MLB · fd-* 已在 server 分流排除)。
  // ⚠️ MLB 結果用永久鎖定源(getMlbLockedMatches 放最後 → 下游 new Map 同 key『後者勝出』·
  // 永久源蓋過 live)· live 窗只在永久源缺該場時補今日/未鎖定 —— 修「賽果掉出 2 天 live 窗 →
  // 已結算押注倒退回 pending → 公開準度每天亂跳少算」+ 堵「locked 已 grade 但 live 此刻回非 final →
  // null 蓋掉永久 winner」窄反例(對齊 canonical getMlbFinalizedResults 的 JSON-first)。 公開檔案是最會被外傳的面。
  const mlbLive = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbLive, ...getMlbLockedMatches()];
  const idMatches = [
    ...allWithMlb.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: getEngineFavorite(m),
      startISO: getMatchStartIso(m),
    })),
    // 玩法併入同一本帳:大小分當「虛擬比賽」一起進對帳 + 準度歷程(同源比賽清單)。
    ...baseballPropIdMatches(allWithMlb),
  ];
  const currentMonth = getCurrentTaipeiMonthKey();
  const identity = aggregateIdentity(baseball, idMatches, currentMonth);
  // 網球戰績(兩向 · 含輸 · 跟棒球 / 足球分開算)· 賽果 + 引擎開盤都是 server-safe 純函式。
  const tennisRecord = gradeTennisPicks(tennis, tennisResults(), tennisEnginePicks());
  // 網球 a/b → home/away(A=home/B=away)· 餵 computeTrophies h2h 配對。
  const tennisHA = tennis.map((r) => ({
    matchId: r.matchId,
    pick: (r.pick === "a" ? "home" : "away") as "home" | "away",
    ts: r.ts,
  }));
  // 羽球戰績(兩向 · 含輸 · 跟其他運動分開算)· R264。
  const badmintonRecord = gradeBadmintonPicks(
    badminton,
    badmintonResults(),
    badmintonEnginePicks(),
  );
  const badmintonHA = badminton.map((r) => ({
    matchId: r.matchId,
    pick: (r.pick === "a" ? "home" : "away") as "home" | "away",
    ts: r.ts,
  }));
  // MMA 戰績(兩向 · 含輸 · 跟其他運動分開算)· R278。
  const mmaRecord = gradeMmaPicks(mma, mmaResults(), mmaEnginePicks());
  const mmaHA = mma.map((r) => ({
    matchId: r.matchId,
    pick: (r.pick === "a" ? "home" : "away") as "home" | "away",
    ts: r.ts,
  }));
  // 本月賽季回顧入口:有本月押注才連(避免連到空回顧)· R218 · 玩法 / 網球 / 羽球 / MMA 也算「有押」。
  const hasSeasonActivity = hasMonthActivity(
    baseball,
    [...soccer, ...soccerProps, ...tennis, ...badminton, ...mma],
    currentMonth,
  );
  const streak = aggregateStreak(baseball, getTodayTaipei());
  // 準度歷程 sparkline(這份帳本 · 按比賽日累計 · 場數夠多才畫 · 同 /member)。
  const accuracySeries = computeAccuracySeries(baseball, idMatches);

  // 足球戰績(三向 + 玩法 · 含輸 · 含同場 你 vs 引擎)· 公開賽後結果 + 引擎鎖定線(含玩法 · server 讀)。
  const soccerResults = await getSoccerLedgerResults();
  const soccerEnginePicks = getSoccerEnginePicksAll();
  const resultsMap: Record<string, { outcome: SoccerPick; kickoffISO: string }> = {};
  for (const r of soccerResults) {
    resultsMap[r.matchId] = { outcome: r.outcome, kickoffISO: r.kickoffISO };
  }
  // 玩法(大小分/讓分)併入同一本足球戰績:玩法虛擬賽果疊在 resultsMap 上一起餵 gradeSoccerPicks。
  // 🔴 下方校準曲線仍只用 base resultsMap(誰贏)· 不混玩法機率(數學上不能畫同一條校準線)。
  const soccerRecord = gradeSoccerPicks(
    [...soccer, ...soccerProps],
    { ...resultsMap, ...soccerPropResults(soccerResults) },
    soccerEnginePicks,
  );

  // 公開校準曲線(0027 · Metaculus「Checking Our Work」個人公開版):這份帳本「賽前宣告過把握」
  // 的場 × 賽果 → 信心桶 vs 實際命中率。 跨運動同一份賽果(棒球 finalWinner + 足球 outcome +
  // 網球/羽球/UFC a/b→home/away)· 同 /member CalibrationMasterCard 口徑。 0027 未套用 →
  // calibrationPicks 空 → report 空 → 不顯示。
  const calibrationResults: Record<string, CalibrationResult> = {};
  for (const m of idMatches) {
    calibrationResults[m.id] = {
      result: m.finalWinner,
      startISO: m.startISO ?? "",
    };
  }
  for (const [matchId, r] of Object.entries(resultsMap)) {
    calibrationResults[matchId] = { result: r.outcome, startISO: r.kickoffISO };
  }
  // 網球 / 羽球 / UFC 賽果(同天梯 buildSyncResults / tennisHA 的 a/b→home/away · A=home/B=away)·
  // 🔴 MMA 和局(draw)→ "tie" = push(不計分母)。 配合 profile-server 解除 tn-/bd-/mma- 校準排除。
  for (const [id, r] of Object.entries(tennisResults()))
    calibrationResults[id] = { result: r.outcome === "a" ? "home" : "away", startISO: r.startISO ?? "" };
  for (const [id, r] of Object.entries(badmintonResults()))
    calibrationResults[id] = { result: r.outcome === "a" ? "home" : "away", startISO: r.startISO ?? "" };
  for (const [id, r] of Object.entries(mmaResults()))
    calibrationResults[id] = {
      result: r.outcome === "draw" ? "tie" : r.outcome === "a" ? "home" : "away",
      startISO: r.startISO ?? "",
    };
  const calibrationReport = computeConfidenceCalibration(
    calibrationPicks,
    calibrationResults,
  );

  // 戰功卡:這份帳本所有已結算的 call(含輸 · 連單場收據)· server 端配對(picks 來自 0019 RPC)。
  const trophies = computeTrophies(
    baseball,
    soccer,
    buildSettledCards(),
    soccerProps,
    tennisHA,
    badmintonHA,
    mmaHA,
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main" className="flex-1">
        <ProfileView
          profile={profile}
          identity={identity}
          streak={streak}
          soccer={soccerRecord}
          tennis={tennisRecord}
          badminton={badmintonRecord}
          mma={mmaRecord}
          series={accuracySeries}
          trophies={trophies}
          calibration={calibrationReport}
          seasonPeriod={currentMonth}
          seasonLabel={monthLabel(currentMonth)}
          hasSeasonActivity={hasSeasonActivity}
        />
      </main>
      <Footer />
    </div>
  );
}
