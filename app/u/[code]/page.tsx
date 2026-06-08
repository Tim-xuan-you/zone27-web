import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProfileView from "@/components/ProfileView";
import { getProfileByCode, getPredictionsByCode } from "@/lib/profile-server";
import { aggregateIdentity, aggregateStreak } from "@/lib/predictions";
import { gradeSoccerPicks, type SoccerPick } from "@/lib/soccer/predictions";
import {
  getEngineFavorite,
  getMatchStartIso,
  getCurrentTaipeiMonthKey,
  getTodayTaipei,
  matches as allMatches,
} from "@/lib/matches";
import { getMlbAsMatches } from "@/lib/mlb-matches";
import { getSoccerLedgerResults } from "@/lib/soccer/football-data";
import { getSoccerEnginePicks } from "@/lib/soccer/locked";
import { createPageMetadata } from "@/lib/page-og";
import { normalizeProfileCode } from "@/lib/profile-code";

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

  // 棒球校準身分(CPBL + MLB · 同 /member 的 allWithMlb · fd-* 已在 server 分流排除)。
  const mlbMatches = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbMatches];
  const identity = aggregateIdentity(
    baseball,
    allWithMlb.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: getEngineFavorite(m),
      startISO: getMatchStartIso(m),
    })),
    getCurrentTaipeiMonthKey(),
  );
  const streak = aggregateStreak(baseball, getTodayTaipei());

  // 足球戰績(三向 · 含輸 · 含同場 你 vs 引擎)· 公開賽後結果 + 引擎鎖定線(server 讀)。
  const soccerResults = await getSoccerLedgerResults();
  const soccerEnginePicks = getSoccerEnginePicks();
  const resultsMap: Record<string, { outcome: SoccerPick; kickoffISO: string }> = {};
  for (const r of soccerResults) {
    resultsMap[r.matchId] = { outcome: r.outcome, kickoffISO: r.kickoffISO };
  }
  const soccerRecord = gradeSoccerPicks(soccer, resultsMap, soccerEnginePicks);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main" className="flex-1">
        <ProfileView
          profile={profile}
          identity={identity}
          streak={streak}
          soccer={soccerRecord}
        />
      </main>
      <Footer />
    </div>
  );
}
