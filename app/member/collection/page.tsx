import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CollectionWall, { type TonightGame } from "@/components/CollectionWall";
import OpenPositionsPanel from "@/components/OpenPositionsPanel";
import type { OpenPosition } from "@/components/OpenPositionCard";
import { getUser } from "@/lib/supabase/server";
import { buildSettledCards } from "@/lib/trophies";
import { getMyPredictionsMap } from "@/lib/predictions-server";
import { buildOpenPositions } from "@/lib/open-positions";
import { matches as allMatches, getMatchPhase, type Match } from "@/lib/matches";
import { getMlbAsMatches } from "@/lib/mlb-matches";

// ── ZONE 27 · /member/collection · 個人戰功卡收藏牆 ─────────────────────
// 會員看自己「所有已結算的 call」的畫廊 —— 一場結算 = 一張刪不掉的戰功卡(含輸照收)。
//
// 🔴 命門修(2026-06-24 · founder dogfood「永遠空的?」):戰功卡只在「結算後」誕生
//   (computeTrophies 只收已結算)→ 用戶鎖了一手、比賽還沒打完前,這頁一直空 = 做了動作
//   卻沒回饋 = 看起來像產品死了。 解:**頁面在鎖定當下就活過來** —— server 端算「你的未結算
//   押注」(buildOpenPositions · 全真資料)render 在戰功卡上方,結算時自然翻面成永久卡。
//   全新(0 鎖 0 卡)用戶才看空狀態,而空狀態給「誠實養成期話術 + 今晚真實可押」on-ramp。
//   0 migration · 1 個真人就成立(收的是自己的眼光,不碰「0 用戶不上空榜」紅線)。
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "你的戰功卡收藏",
  description: "你所有賽前鎖死、改不了的 call —— 命中與落空都收著。收的是自己的眼光,不是中獎彩券。",
};

export default async function CollectionPage() {
  const user = await getUser();
  // 已結算賽事資訊(永久來源 · 0 API · 含名字/隊徽/引擎看好邊)· 共用 lib/trophies。
  const settled = buildSettledCards();

  // 你的未結算押注(賽前鎖、還沒結算)+ 今晚真實可押(on-ramp)· 只在登入時算。
  let openPositions: OpenPosition[] = [];
  let tonight: TonightGame[] = [];
  let hasAnyPicks = false;
  if (user) {
    const predictionsMap = await getMyPredictionsMap();
    // 押過任何一手(含已結算的大小分)→ 別對他喊「去押第一手」· 玩法卡還沒進收藏畫廊,
    // 但他的對帳都在收件匣 · 空狀態改成導去收件匣(不是死路 / 不裝新手)。 R261
    hasAnyPicks = Object.keys(predictionsMap).length > 0;
    // MLB live 窗(graceful:API 掛了退空 → 退回 CPBL · 不讓頁 500)。
    let mlbLive: Match[] = [];
    try {
      mlbLive = await getMlbAsMatches();
    } catch {
      mlbLive = [];
    }
    const allWithMlb = [...allMatches, ...mlbLive];
    openPositions = buildOpenPositions(predictionsMap, allWithMlb);
    const heldIds = new Set(openPositions.map((p) => p.matchId));
    // 今晚還沒押、賽前可鎖的場(把唯一能讓這頁不空的動作搬到這頁本身 · 真賽程真入口 · 取前 3)。
    tonight = allWithMlb
      .filter((m) => !heldIds.has(m.id) && getMatchPhase(m) === "today-pregame")
      .slice(0, 3)
      .map((m) => ({
        id: m.id,
        home: m.home.name,
        away: m.away.name,
        startTime: m.startTime,
        league: m.league,
      }));
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main" className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-12 pb-24">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 戰功卡 · 你的收藏
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
          你鎖死的每一手,<span className="text-gold">都在這。</span>
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-10 max-w-xl">
          每押一手、賽前鎖死,賽後結算就變一張卡 —— 命中、落空,都收著。 改不了、刪不掉,
          收的是<span className="text-bone">你自己的眼光</span>,不是中獎彩券。
          押了引擎沒看好那邊、你卻對了的,叫<span className="text-gold">逆風</span> —— 那是贏過機器的證明。
        </p>

        {user ? (
          <>
            {/* 你的未結算押注 · 鎖定當下就活著(結算時翻面成下方戰功卡)· 0 鎖時自動隱藏(graceful)。 */}
            <OpenPositionsPanel positions={openPositions} />
            <CollectionWall
              settled={settled}
              hasPending={openPositions.length > 0}
              hasAnyPicks={hasAnyPicks}
              tonight={tonight}
            />
          </>
        ) : (
          <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
            <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
              這是你的私人收藏。
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
              登入(免費)後,你押過、賽前鎖死的每一手都會收進這面牆 —— 含輸照收。
            </p>
            <Link
              href={`/login?next=${encodeURIComponent("/member/collection")}`}
              className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              免費登入 →
            </Link>
          </div>
        )}

        <p className="mt-12 pt-6 border-t border-line/40">
          <Link
            href="/member"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
          >
            ← 回你的儀表板
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
