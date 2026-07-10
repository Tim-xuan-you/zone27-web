import type { SportResultRow } from "@/lib/predictions";
import { buildIdMatches } from "@/lib/ladder-server";
import { getMlbFinalizedResults } from "@/lib/mlb-matches";
import { tennisResults, tennisEnginePicks } from "@/lib/tennis/matches";
import { badmintonResults, badmintonEnginePicks } from "@/lib/badminton/matches";
import { mmaResults, mmaEnginePicks } from "@/lib/mma/matches";
import { basketballResults, basketballEnginePicks } from "@/lib/basketball/matches";
import { resolveLockedSoccer } from "@/lib/soccer/engine-settle";
import { getSoccerLedgerResults } from "@/lib/soccer/football-data";
import { soccerPropResults } from "@/lib/soccer/props";

// ── ZONE 27 · 跨運動賽果一本帳(R293 · 今日一戰六運動紀錄條的對帳源)────────────────
// server 端組、由 /api/duel-results 供 client 島(DuelRecordStrip)對帳。 口徑鏡天梯
// buildSyncResults(單一真相 lib/ladder-server):
//   · 兩向運動 a/b → home/away(同存表規則 A=home/B=away)
//   · 棒球平手(tie)/ MMA 和局 = 推局 → 不進結果(不算勝負 · 個人紀錄條顯示為 pending)
//   · 足球和局 = 真第三結果(draw 進結果 · 押 draw 算命中)
//   · 棒球大小分玩法(~bou)走 buildIdMatches 的虛擬賽果 · 足球玩法(~ou25/~ah05)走
//     soccerPropResults(getSoccerLedgerResults())—— 同 /u 公開檔的口徑(live ∪ 永久)零漂移
// R295 · enginePick:每列帶「機器賽前鎖的那手」(各運動現成 oracle:engineFav /
//   enginePickOf / *EnginePicks())—— 給機器嘴(lib/machine-voice)算「你 vs 機器」逐場
//   對照。 optional + 逐運動 graceful:缺了嘴退回只講你自己的命中/落空,勝敗對帳不受影響。
//   玩法(~)列不帶(機器嘴只對「誰贏」的對決開口)。 payload 仍零個資 · CDN 可快取。
// 結算顯示鐵律:全部 on-read · 永不「只」靠 cron —— 剛打完、Action 還沒寫回的場由
// live 補強蓋上(MLB getMlbFinalizedResults · 足球 resolveLockedSoccer / ledger · R294 修)。
// 任一運動讀壞 → 少一種賽果(graceful)。
// ─────────────────────────────────────────────────────

export async function buildDuelResults(): Promise<SportResultRow[]> {
  const byId = new Map<string, SportResultRow>();
  const set = (
    id: string,
    winner: "home" | "away" | "draw",
    startISO: string | null,
    enginePick?: "home" | "away" | "draw",
  ) =>
    byId.set(id, {
      id,
      winner,
      startISO: startISO || null,
      ...(enginePick ? { enginePick } : {}),
    });

  // 棒球引擎偏好(CPBL finalized + MLB locked · buildIdMatches 自帶 engineFav)——
  // 給 MLB live 補強列查(那條路的賽果源沒帶引擎線 · 但鎖定過的場這裡都有)。
  const bbFav = new Map<string, "home" | "away">();
  try {
    // 棒球(CPBL finalized + MLB locked · 含 ~bou 玩法虛擬賽果)· 平手不進結果。
    for (const g of buildIdMatches()) {
      if (g.engineFav === "home" || g.engineFav === "away")
        bbFav.set(g.id, g.engineFav);
      if (g.finalWinner === "home" || g.finalWinner === "away")
        set(
          g.id,
          g.finalWinner,
          g.startISO ?? null,
          g.id.includes("~") ? undefined : (g.engineFav ?? undefined),
        );
    }
  } catch {
    /* graceful */
  }
  try {
    // MLB on-read 補強:剛打完、grade Action 還沒寫回 JSON 的場(live 窗)· 後蓋 = live 優先。
    // 沒這層 = /today 紀錄條卡 cron 好幾小時,而首頁「你 vs 引擎」同一手早就掛好(自打臉)。
    for (const r of await getMlbFinalizedResults()) {
      if (r.finalWinner === "home" || r.finalWinner === "away")
        set(r.id, r.finalWinner, r.startISO, bbFav.get(r.id));
    }
  } catch {
    /* graceful */
  }
  try {
    const eng = tennisEnginePicks();
    for (const [id, r] of Object.entries(tennisResults()))
      set(
        id,
        r.outcome === "a" ? "home" : "away",
        r.startISO,
        eng[id] === "a" ? "home" : eng[id] === "b" ? "away" : undefined,
      );
  } catch {
    /* graceful */
  }
  try {
    const eng = badmintonEnginePicks();
    for (const [id, r] of Object.entries(badmintonResults()))
      set(
        id,
        r.outcome === "a" ? "home" : "away",
        r.startISO,
        eng[id] === "a" ? "home" : eng[id] === "b" ? "away" : undefined,
      );
  } catch {
    /* graceful */
  }
  try {
    // 🔴 MMA 和局 = 推局(同棒球平手)→ 不進結果。
    const eng = mmaEnginePicks();
    for (const [id, r] of Object.entries(mmaResults()))
      if (r.outcome !== "draw")
        set(
          id,
          r.outcome === "a" ? "home" : "away",
          r.startISO,
          eng[id] === "a" ? "home" : eng[id] === "b" ? "away" : undefined,
        );
  } catch {
    /* graceful */
  }
  try {
    // 籃球 outcome 本來就是 home/away · 無和局。
    const eng = basketballEnginePicks();
    for (const [id, r] of Object.entries(basketballResults()))
      set(id, r.outcome, r.startISO, eng[id]);
  } catch {
    /* graceful */
  }
  try {
    // 足球三向(draw = 真第三結果)· on-read 補對帳(已開踢未入帳的場打一次 live)·
    // enginePick 就在鎖定列上(可能是 draw:機器真的可以押和局)。
    for (const p of await resolveLockedSoccer()) {
      if (
        p.verdict !== null &&
        (p.outcome === "home" || p.outcome === "draw" || p.outcome === "away")
      )
        set(p.matchId, p.outcome, p.kickoffISO ?? null, p.enginePick ?? undefined);
    }
  } catch {
    /* graceful */
  }
  try {
    // 足球玩法(~ou25 大小 / ~ah05 讓分)· ledger 源(live ∪ 永久 · 永久者勝)= /u 同口徑。
    // 玩法列不帶 enginePick(機器嘴只對「誰贏」開口)。
    for (const [id, r] of Object.entries(
      soccerPropResults(await getSoccerLedgerResults()),
    )) {
      if (r.outcome === "home" || r.outcome === "away")
        set(id, r.outcome, r.kickoffISO ?? null);
    }
  } catch {
    /* graceful */
  }
  return [...byId.values()];
}
