// ── ZONE 27 · 站內結算收件匣 · server 端資料收集(跨運動 · 0 migration)──────────
// 把「(你的押注) × (賽果)」這個純函式的兩個輸入,在 server 端 on-read 收齊,餵進
// lib/settlement-inbox.ts 的 buildInbox。 棒球(CPBL + MLB)+ 足球(世界盃等)兩本帳都收。
//
// 押注來源:get_my_predictions RPC 一次拿回「全部」押注(棒球 cpbl-*/mlb- + 足球 fd-*),
//   在這裡按 match_id 開頭分流(同 getMyPredictionsMap / getMySoccerPicks 的分運動規則),
//   省一趟 round-trip。 server client(cookie auth)· anon / 錯 → 空(graceful)。
//
// 賽果來源(全部 on-read · 不靠 cron):
//   · 棒球:matches(CPBL 靜態 finalResult)+ getMlbAsMatches(live)+ getMlbLockedMatches
//     (永久鎖定 · 放最後 → 同 id 後者覆蓋 = 永久者勝 · 同 /member idMatches 的規則)。
//   · 足球:resolveLockedSoccer()(engine-settle · 跟脈動/收據/引擎戰績同一支解析 · 零 drift)。
//
// API route(鈴鐺數字)+ /member/inbox(逐筆列)共用 getMySettlementInbox() = 單一真相。
// 隱含 server-only(import 了 createSupabaseServerClient / getUser = 讀 cookie · 只能 server 端)。
// ─────────────────────────────────────────────────────

import {
  matches as cpblMatches,
  getEngineFavorite,
  getMatchStartIso,
  type Match,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { resolveLockedSoccer } from "@/lib/soccer/engine-settle";
import { createSupabaseServerClient, getUser } from "@/lib/supabase/server";
import { readLastSeenFromMeta } from "@/lib/predictions";
import {
  buildInbox,
  type RawSettlement,
  type SettlementInbox,
} from "@/lib/settlement-inbox";

type ServerPick = { pick: "home" | "away" | "draw"; ts: string };

/** 一趟 RPC → 拆成棒球(home/away)+ 足球(home/draw/away)兩本。 anon / 錯 → 兩本皆空。 */
async function getMyPicksSplit(): Promise<{
  baseball: Map<string, ServerPick>;
  soccer: Map<string, ServerPick>;
}> {
  const baseball = new Map<string, ServerPick>();
  const soccer = new Map<string, ServerPick>();
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return { baseball, soccer };
    for (const row of data as {
      match_id?: unknown;
      pick?: unknown;
      created_at?: unknown;
    }[]) {
      const id = typeof row.match_id === "string" ? row.match_id : "";
      const ts = typeof row.created_at === "string" ? row.created_at : "";
      if (!id || !ts) continue; // ts 缺 → 先鎖後結算不了 → 丟(同棒球/足球既有防禦)
      if (id.includes("~")) continue; // 🔴 玩法押注(大小分等)不進「誰贏」結算收件匣
      if (id.startsWith("fd-")) {
        if (row.pick === "home" || row.pick === "draw" || row.pick === "away") {
          soccer.set(id, { pick: row.pick, ts });
        }
      } else {
        // 棒球表只存 home/away(無 draw / skip)
        if (row.pick === "home" || row.pick === "away") {
          baseball.set(id, { pick: row.pick, ts });
        }
      }
    }
  } catch {
    /* graceful · 收件匣是 nice-to-have · 讀失敗退空 */
  }
  return { baseball, soccer };
}

/** 收齊跨運動原始輸入(賽果 on-read)。 picks 兩本都空 → 不打賽果 API,直接回空。 */
async function gatherRaws(
  baseball: Map<string, ServerPick>,
  soccer: Map<string, ServerPick>,
): Promise<RawSettlement[]> {
  const raws: RawSettlement[] = [];

  // ── 棒球:CPBL + MLB(live)+ MLB(locked 永久)· 同 id 後者覆蓋 = 永久者勝 ──
  if (baseball.size > 0) {
    // getMlbAsMatches 會 fetch MLB API · 自己不吞錯(graceful 包裝在 getTodayMatchesAllLeagues)。
    // 這裡直接呼叫 → 必須自己 try/catch:MLB API 掛了也只丟掉 live 窗(退回 CPBL + 永久鎖定),
    // 不能讓整個收件匣頁 500(inbox 頁直接 await getMySettlementInbox · 沒上層 catch)。
    let mlbLive: Match[] = [];
    try {
      mlbLive = await getMlbAsMatches();
    } catch {
      mlbLive = []; // graceful · 同 getTodayMatchesAllLeagues 的 MLB 失敗退空
    }
    const mlbLocked = getMlbLockedMatches();
    const lockedMlbIds = new Set(mlbLocked.map((m) => m.id));
    const byId = new Map<string, Match>();
    for (const m of [...cpblMatches, ...mlbLive, ...mlbLocked]) byId.set(m.id, m);
    for (const [id, p] of baseball) {
      const m = byId.get(id);
      if (!m) continue;
      const fr = m.finalResult;
      // 平手(tie)不進對照(同 computeSettlementDelta)· finalWinner=null → buildInbox 略過。
      const finalWinner =
        fr && (fr.winner === "home" || fr.winner === "away") ? fr.winner : null;
      // 未鎖定的 MLB 已結束場:引擎線是賽後即時重算 → 拿來當「賽前看好誰」=灌引擎水。
      // 排除出你 vs 引擎(engineFav=null · 同 /member idMatches 規則)· 你自己這手照算。
      const isUnlockedMlb = id.startsWith("mlb-") && !lockedMlbIds.has(id);
      raws.push({
        matchId: id,
        sport: "baseball",
        home: m.home.name,
        away: m.away.name,
        myPick: p.pick,
        pickTs: p.ts,
        startISO: getMatchStartIso(m) ?? "",
        finalWinner,
        engineFav: isUnlockedMlb ? null : getEngineFavorite(m),
        settledRaw: fr?.ingestedAt ?? null,
      });
    }
  }

  // ── 足球:resolveLockedSoccer(engine-settle · 同脈動/收據同源 · on-read 即時對帳)──
  if (soccer.size > 0) {
    const resolved = await resolveLockedSoccer();
    const byMatch = new Map(resolved.map((p) => [p.matchId, p]));
    for (const [id, p] of soccer) {
      const lp = byMatch.get(id);
      if (!lp) continue; // 沒這場鎖定盤(非引擎覆蓋場 → 無隊名可顯示)→ graceful 略過
      const settled =
        lp.verdict !== null &&
        (lp.outcome === "home" || lp.outcome === "draw" || lp.outcome === "away");
      raws.push({
        matchId: id,
        sport: "soccer",
        home: lp.home,
        away: lp.away,
        myPick: p.pick,
        pickTs: p.ts,
        startISO: lp.kickoffISO ?? "",
        finalWinner: settled ? lp.outcome : null,
        engineFav: lp.enginePick ?? null,
        // gradedAt = 真結算時戳 or on-read 代理(kickoff+110min)· 皆 full ISO。
        settledRaw: lp.gradedAt ?? null,
      });
    }
  }

  return raws;
}

/**
 * 本人的結算收件匣(跨運動 · on-read)。 未登入 → null(API/頁面退空狀態)。
 * 兩本押注皆空 → 空收件匣(0 API · graceful)。
 */
export async function getMySettlementInbox(): Promise<SettlementInbox | null> {
  // getUser() re-validates JWT(同 /member · trust-critical 不可用可偽造的 getSession)。
  const user = await getUser();
  if (!user) return null;
  const meta = (user.user_metadata ?? null) as Record<string, unknown> | null;
  const lastSeen = readLastSeenFromMeta(meta);

  const { baseball, soccer } = await getMyPicksSplit();
  if (baseball.size === 0 && soccer.size === 0) {
    return { items: [], newCount: 0, total: 0, pending: [] };
  }
  try {
    const raws = await gatherRaws(baseball, soccer);
    return buildInbox(raws, lastSeen);
  } catch {
    // 防護網:inbox 頁直接 await 這支、沒有上層 catch · 任何賽果來源意外丟錯都退空狀態,不 500。
    return { items: [], newCount: 0, total: 0, pending: [] };
  }
}
