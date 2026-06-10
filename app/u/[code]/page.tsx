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
import {
  getEngineFavorite,
  getMatchStartIso,
  getCurrentTaipeiMonthKey,
  getTodayTaipei,
  matches as allMatches,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { getSoccerLedgerResults } from "@/lib/soccer/football-data";
import { getSoccerEnginePicks } from "@/lib/soccer/locked";
import { createPageMetadata } from "@/lib/page-og";
import { normalizeProfileCode } from "@/lib/profile-code";
import { buildSettledCards, computeTrophies } from "@/lib/trophies";

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

  const { baseball, soccer } = await getPredictionsByCode(code);

  // 棒球校準身分(CPBL + MLB · fd-* 已在 server 分流排除)。
  // ⚠️ MLB 結果用永久鎖定源(getMlbLockedMatches · 放最前 · find 取第一筆)· live 窗只補
  // 還沒鎖定/今日的場 —— 修「MLB 賽果掉出 2 天 live 窗 → 已結算押注倒退回 pending → 公開
  // 準度數字每天亂跳、且嚴重少算」(同首頁/天梯永久帳本修法 · 公開檔案是最會被外傳的面)。
  const mlbLive = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...getMlbLockedMatches(), ...mlbLive];
  const idMatches = allWithMlb.map((m) => ({
    id: m.id,
    finalWinner: m.finalResult?.winner ?? null,
    engineFav: getEngineFavorite(m),
    startISO: getMatchStartIso(m),
  }));
  const identity = aggregateIdentity(baseball, idMatches, getCurrentTaipeiMonthKey());
  const streak = aggregateStreak(baseball, getTodayTaipei());
  // 準度歷程 sparkline(這份帳本 · 按比賽日累計 · 場數夠多才畫 · 同 /member)。
  const accuracySeries = computeAccuracySeries(baseball, idMatches);

  // 足球戰績(三向 · 含輸 · 含同場 你 vs 引擎)· 公開賽後結果 + 引擎鎖定線(server 讀)。
  const soccerResults = await getSoccerLedgerResults();
  const soccerEnginePicks = getSoccerEnginePicks();
  const resultsMap: Record<string, { outcome: SoccerPick; kickoffISO: string }> = {};
  for (const r of soccerResults) {
    resultsMap[r.matchId] = { outcome: r.outcome, kickoffISO: r.kickoffISO };
  }
  const soccerRecord = gradeSoccerPicks(soccer, resultsMap, soccerEnginePicks);

  // 戰功卡:這份帳本所有已結算的 call(含輸 · 連單場收據)· server 端配對(picks 來自 0019 RPC)。
  const trophies = computeTrophies(baseball, soccer, buildSettledCards());

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main" className="flex-1">
        <ProfileView
          profile={profile}
          identity={identity}
          streak={streak}
          soccer={soccerRecord}
          series={accuracySeries}
          trophies={trophies}
        />
      </main>
      <Footer />
    </div>
  );
}
