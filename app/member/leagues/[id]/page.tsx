import Link from "next/link";
import type { Metadata } from "next";
import { createHash } from "crypto";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getUser } from "@/lib/supabase/server";
import { getLeague, getLeagueStandings, getLeagueActivity } from "@/lib/leagues";
import LeagueStandingsView from "@/components/LeagueStandings";
import LeagueActivity from "@/components/LeagueActivity";
import LeagueInviteShare from "@/components/LeagueInviteShare";
import LeagueLeaveButton from "@/components/LeagueLeaveButton";

export const metadata: Metadata = {
  title: "聯盟天梯",
  description: "你的私人預測聯盟 · 整季比誰最會讀球 · 公開含輸帳本 + 校準。",
};

// ── ZONE 27 · /member/leagues/[id] · 一個盟的天梯(R236)──────────────────────
// authed + member-gated(getLeague 非盟員回 null)· 重用 /ladder 計分篩成盟員。 0029 未套 → null
// → 顯示「建置中」· 絕不 crash。
// ─────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />
      <main
        id="main"
        className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-10 pb-24"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

function NotInLeague() {
  return (
    <Shell>
      <section className="py-16 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 私人預測聯盟
        </p>
        <h1 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight">
          看不到這個盟
        </h1>
        <p className="mt-4 text-mute text-sm leading-relaxed max-w-sm mx-auto">
          你不在這個聯盟,或它不存在 / 功能建置中。 用邀請碼加入,或回去看你的盟。
        </p>
        <Link
          href="/member/leagues"
          className="mt-7 inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
        >
          回我的盟 →
        </Link>
      </section>
    </Shell>
  );
}

export default async function LeagueStandingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) {
    return (
      <Shell>
        <section className="py-20 text-center">
          <h1 className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
            登入看<span className="text-gold">這個盟</span>
          </h1>
          <p className="mt-4 text-mute text-sm leading-relaxed">
            私人聯盟只有盟員看得到 · 登入後就能看天梯。 終身免費。
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(`/member/leagues/${id}`)}`}
            className="mt-7 inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            登入 / 註冊 →
          </Link>
        </section>
      </Shell>
    );
  }

  const viewerCode = createHash("md5").update(user.id).digest("hex").slice(0, 8);
  const meta = await getLeague(id);
  if (!meta) return <NotInLeague />;

  const standings = await getLeagueStandings(id, viewerCode);

  // 盟友活動條(解冷啟動)· 盟員碼直接從天梯結果衍生(ranked + provisional = 全體盟員)·
  // 不必再打一次 get_league_members · getLeagueActivity 走 React-cache 的 fetchLadderRows
  // (跟天梯同一次 RPC · 0 額外讀)。 0029 未套 / 無盟員鎖定 → [] → 元件整條隱藏(graceful)。
  const memberCodes = standings
    ? [...standings.ranked, ...standings.provisional].map((s) => s.authorCode)
    : [];
  const activity = await getLeagueActivity(memberCodes);

  return (
    <Shell>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <Link
          href="/member/leagues"
          className="font-mono text-mute/55 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
        >
          ← 我的盟
        </Link>
        <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">
          {meta.memberCount} 人{meta.isCreator ? " · 你建的" : ""}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-5">
        {meta.name}
      </h1>

      <div className="mb-6">
        <LeagueInviteShare inviteCode={meta.inviteCode} leagueName={meta.name} />
      </div>

      {/* 盟友最近鎖了什麼(R239 · 解冷啟動)· 朋友剛加盟、天梯還沒長出來時,這條讓盟活起來 ——
          跟下方「整季排名」是不同軸(這是「現在有人在動」)· 無人鎖定時整條隱藏。 */}
      <LeagueActivity events={activity} viewerCode={viewerCode} />

      {standings ? (
        <LeagueStandingsView standings={standings} />
      ) : (
        <div className="border border-line/60 bg-slate/30 p-5 text-center">
          <p className="text-bone text-sm font-light leading-relaxed">
            天梯<span className="text-gold">建置中</span>。
          </p>
          <p className="mt-1.5 text-mute/80 text-[12px] leading-relaxed">
            後台資料表套用後即開通。
          </p>
        </div>
      )}

      <div className="mt-10 pt-5 border-t border-line/40 flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/matches"
          className="font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
        >
          去押今晚的場 →
        </Link>
        <LeagueLeaveButton leagueId={meta.id} />
      </div>
    </Shell>
  );
}
