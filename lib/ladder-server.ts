// ── ZONE 27 · 海選天梯(跨用戶準度榜)· server-side compute ───────────────
// migration 0022 的 get_ladder_entries(撈所有人的押注 + 公開署名)→ 這裡按永久碼分組,
// 每人套 aggregateIdentity 算準度/贏不贏引擎(賽果與引擎開盤線在程式碼裡,不在 DB),
// 排名後套門檻渲染。 跟 /u/[code] 公開檔同一套口徑(含輸、先鎖後結、平手不計)。
//
// 🔴 紅線(別把護城河燒成玩運彩):
//   · 0 用戶不上空榜 —— 合格用戶 < LADDER_MIN_USERS → show=false,/ladder 維持「王座上只有
//     機器」優雅空榜(一兩個人的榜不是榜,也會暴露單一用戶)。
//   · 排名按「贏過引擎的幅度(alpha over baseline)」+ 樣本厚度,**不是**裸勝率 / 連勝 /
//     盈虧那種虛榮榜(那是對手的死穴 · calibration-tiers 紅線明列 win-rate ranking = 品牌自殺)。
//   · 含輸照算(proved/decided · diverged 進分母)· 平手不進對照 · 先鎖後結(開賽後下注不計,
//     由 aggregateIdentity 內部處理)。
//
// 用無 cookie 的 stateless anon client(同 lib/profile-server.ts)→ /ladder 維持可快取 ISR、
// 讀的是「全站的榜」而非把目前登入者混進來。 任何 error / 未套 0022 → 回空榜(graceful)。
// ─────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  aggregateIdentity,
  taipeiDayOf,
  type UserPredictionsMap,
  type IdentityMatch,
} from "@/lib/predictions";
import { RECKONING_STAR_MIN } from "@/lib/reckoning-star";
import {
  getFinalizedMatches,
  getMatchStartIso,
  getEngineFavorite,
  getCalibration,
  getCurrentTaipeiMonthKey,
} from "@/lib/matches";
import { getMlbLockedMatches } from "@/lib/mlb-matches";
import { getResolvedSoccerEngine } from "@/lib/soccer/engine-settle";
import { fetchLadderRows } from "@/lib/ladder-rows";
import { baseballPropIdMatches } from "@/lib/baseball-totals";

// 新秀門檻:押滿 10 場「已分勝負」(同 /ladder 第 1 階「押滿 10 場就上榜」)· 不到 10 不上榜。
const LADDER_MIN_GRADED = 10;
// 0 用戶不上空榜:合格用戶 < 此數 → 不渲染榜(維持「王座上只有機器」)。 等真的有一小群人才亮。
const LADDER_MIN_USERS = 3;
// 榜長上限(早期防爆 · 之後要分頁再說)。
const LADDER_MAX_ROWS = 100;
// 神準手/神諭(贏過引擎)的最低樣本 · 10 場/一晚手氣不算頂 —— 對齊 /u 對帳之星(≥30 含輸贏過引擎)·
// 同一個「贏過機器」成就、同一把尺。 ⚠️ R241 honest:完整「月度升降」(每月一階上限 / 本月必須贏才升
// / 掉階歷史)需另存月度快照(migration)· 尚未實作。 本檔目前是「即時累積快照」:隨賽果更新即上下、
// 守不住就掉階(米其林式可被收回),但沒有月度節奏與一階上限。
const LADDER_SHARP_MIN = RECKONING_STAR_MIN; // 同對帳之星門檻 · 單一真相 lib/reckoning-star(免漂移)

export type LadderEntry = {
  rank: number;
  /** 永久碼 · 連到 /u/[code] 公開含輸檔 */
  authorCode: string;
  /** 公開 handle(顯示名 or「球迷 #碼」) */
  handle: string;
  /** 1-5 · 新秀 / 分析師 / 操盤手 / 神準手 / 神諭 */
  tier: number;
  /** 已分勝負場數 = 樣本(含輸) */
  decided: number;
  /** 命中率(含輸 · proved/decided · 0-100) */
  accuracyPct: number;
  /** alpha:你命中率 − 引擎同場命中率(贏過機器幾個百分點 · 無對照 = null) */
  edgeVsEnginePts: number | null;
  /** 全期是否贏過引擎 */
  beatEngine: boolean;
  /** 本月是否還在贏引擎(升階硬條件的「現在還準」訊號) */
  monthBeatEngine: boolean;
  /** 付費支持者(BLACK/GOLD · 0023)· 亮金環 = 身分標記,不是準度 · 永不影響名次 */
  supporter: boolean;
  /** 米其林式月度升降:本月階級 vs「上月底」階級。 on-read 從不可竄改的押注+賽果歷史推導 ·
   *  0 migration。 up=升階 · down=掉階 · same=持平 · new=本月新上榜。 */
  move: "up" | "down" | "same" | "new";
  /** 🔴 R277:這列是「引擎本人」(棒球 / 足球)· 跟用戶同榜競賽、名次隨大家表現上下移動 ·
   *  但它是「要爬過去的尺」不是對手 —— 不連 /u、不算進 qualifyingUsers、永不拿神諭王座(王座留給人)。 */
  isEngine?: boolean;
};

export type LadderBoard = {
  /** 合格用戶 ≥ 門檻才秀榜(否則 /ladder 維持優雅空榜) */
  show: boolean;
  qualifyingUsers: number;
  entries: LadderEntry[];
};

let cached: SupabaseClient | null = null;
function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

// 已結算 + 賽前鎖定引擎線的場(CPBL finalized + MLB locked)· 都帶 engineFav · 給跨用戶對帳。
// 只收「鎖定過引擎線」的場 → 沒有未鎖定 MLB 的後見之明問題(同 /member 帳本誠信修)。
// exported:私人聯盟標準(lib/leagues)重用同一份「棒球榜」對帳基準(CPBL+MLB · 零漂移)。
export function buildIdMatches(): IdentityMatch[] {
  const games = [...getFinalizedMatches(), ...getMlbLockedMatches()];
  const out: IdentityMatch[] = games.map((m) => ({
    id: m.id,
    finalWinner: m.finalResult?.winner ?? null,
    engineFav: getEngineFavorite(m),
    startISO: getMatchStartIso(m),
  }));
  // 玩法併入同一本帳(Tim 2026-06-23):大小分當「虛擬比賽」一起進對帳 + 天梯(同源比賽清單)。
  return [...out, ...baseballPropIdMatches(games)];
}

// 階級(snapshot)· 🔴 R277 Tim 拍板:升降門檻改「勝率 60%」—— 60% 是連我們自己的引擎都還沒
// 穩穩站上的狠線(棒球引擎現在才 53%),撐在 60% 以上 = 真的贏過機器級。 月度升降以「有沒有跨過
// 60%」為核心。 🔴 守舊紅線:仍需夠厚樣本(≥LADDER_SHARP_MIN)才上頂階 —— 60% 的「一晚手氣」不算頂。
function tierOf(accuracy: number, decided: number): number {
  if (accuracy >= 60 && decided >= LADDER_SHARP_MIN) return 4; // 神準手:≥30 場裡守住 60%(贏過機器級)
  if (accuracy >= 55) return 3; // 操盤手:逼近 60% 門檻
  if (accuracy >= 50) return 2; // 分析師:準度過半
  return 1; // 新秀:上榜但還沒過半
}

// ── 米其林式月度升降 · 「某個月之前」每人會落在哪一階 ──────────────────────
// 跑同一套 qualify → 大家平均 → tierOf → 排名定神諭 的管線,只是吃「過濾過的 idMatches」
// (只留比賽日在 monthKey 之前的場)→ 回傳 code → 階級(1-5)= 那個人「上月底」的位置。
// 純函式、on-read、0 migration —— 完全從不可竄改的押注 ts + 賽果歷史推導,不存任何月度快照。
function tiersAsOf(
  byUser: Map<string, { handle: string; map: UserPredictionsMap }>,
  idMatches: IdentityMatch[],
  monthKey: string,
): Map<string, number> {
  const out = new Map<string, number>();
  type Q = {
    code: string;
    tier: number;
    accuracyPct: number;
    beatEngine: boolean;
    decided: number;
    sortEdge: number;
  };
  const qualified: Q[] = [];
  for (const [code, u] of byUser) {
    const id = aggregateIdentity(u.map, idMatches, monthKey);
    if (id.decided < LADDER_MIN_GRADED || id.accuracy === null) continue;
    qualified.push({
      code,
      tier: 1,
      accuracyPct: id.accuracy,
      beatEngine: id.beatEngine === true,
      decided: id.decided,
      sortEdge: id.edgeVsEnginePts ?? -999,
    });
  }
  if (qualified.length === 0) return out;
  for (const e of qualified) {
    e.tier = tierOf(e.accuracyPct, e.decided);
  }
  qualified.sort(
    (a, b) =>
      b.sortEdge - a.sortEdge ||
      b.decided - a.decided ||
      b.accuracyPct - a.accuracyPct,
  );
  qualified.forEach((e, i) => {
    const tier =
      i === 0 && e.beatEngine && e.decided >= LADDER_SHARP_MIN ? 5 : e.tier;
    out.set(e.code, tier);
  });
  return out;
}

export async function getLadderBoard(): Promise<LadderBoard> {
  // R258 · 走 lib/ladder-rows 的 React 快取列(同一次 render 與首頁脈動/熱度共用「一次」RPC,
  //  不重複全表掃 get_ladder_entries)· 任何錯 → [](graceful · 下面 qualified<門檻 自然回空榜)。
  const rows = await fetchLadderRows();

  // 按永久碼分組 · 只認棒球(cpbl-*/mlb-* · 排除 fd- 足球:足球準度永遠分開算,同既有規則)。
  const byUser = new Map<string, { handle: string; map: UserPredictionsMap }>();
  for (const r of rows) {
    const code = str(r.author_code);
    const matchId = str(r.match_id);
    // R259:只認棒球 cpbl-*/mlb-*(allowlist)· 排除足球 fd- / 群眾盤 mkt- / 網球 tn-(各自分開算)。
    // 舊「擋 fd-」blocklist 會讓 tn-/mkt- 灌進棒球天梯分母 → 改 allowlist 一次堵死。
    if (!code || !matchId || !(matchId.startsWith("cpbl-") || matchId.startsWith("mlb-"))) continue;
    const pick = r.pick === "home" || r.pick === "away" ? r.pick : null;
    const ts = str(r.created_at);
    if (!pick || !ts) continue;
    let u = byUser.get(code);
    if (!u) {
      u = { handle: str(r.handle) || `球迷 #${code}`, map: {} };
      byUser.set(code, u);
    }
    // 同碼者(碰撞)或同場多列:rows 已按 created_at desc → first-seen = 最近一筆。
    // 與 0019 公開檔 get_predictions_by_code「first-seen 取最新」同向 → 榜跟它連到的
    // /u/[code] 對同一個(碰撞)碼算出同一份戰績(不會榜上一個數、點進去另一個數)。
    if (!(matchId in u.map)) u.map[matchId] = { pick, ts };
  }

  const idMatches = buildIdMatches();
  const monthKey = getCurrentTaipeiMonthKey();

  // 每人算準度身分 → 取合格者(≥10 已分勝負)。
  // move 在最後組 entries 時才算(跟上月底比)· 中間 Computed 不帶 move。
  type Computed = Omit<LadderEntry, "move"> & { _sortEdge: number };
  const qualified: Computed[] = [];
  for (const [code, u] of byUser) {
    const id = aggregateIdentity(u.map, idMatches, monthKey);
    if (id.decided < LADDER_MIN_GRADED || id.accuracy === null) continue;
    qualified.push({
      rank: 0,
      authorCode: code,
      handle: u.handle,
      tier: 1, // 佔位 · 下面知道 crowd 平均才定
      decided: id.decided,
      accuracyPct: id.accuracy,
      edgeVsEnginePts: id.edgeVsEnginePts,
      beatEngine: id.beatEngine === true, // boolean | null → boolean(null = 無對照 = 沒贏)
      monthBeatEngine: id.month.beatEngine === true,
      supporter: false, // 佔位 · 下面對 top 切片逐碼解析 0023 後填(只解析上榜的 ≤100 人)
      _sortEdge: id.edgeVsEnginePts ?? -999, // 無引擎對照 → 排最後
    });
  }

  // R277:1-2 個合格用戶 → 不上榜(會暴露單一用戶 · 守隱私紅線)。 0 用戶 → 兩台引擎獨佔榜當「尺」
  //   (冷啟動 · 無人可暴露 · 機器在最上、等第一個爬上來的人)。 ≥3 用戶 → 正常上榜(用戶 + 引擎)。
  if (qualified.length > 0 && qualified.length < LADDER_MIN_USERS) {
    return { show: false, qualifyingUsers: qualified.length, entries: [] };
  }

  for (const e of qualified) {
    e.tier = tierOf(e.accuracyPct, e.decided);
  }

  // 排名:贏過引擎的幅度(alpha)優先 · 再樣本厚 · 再命中率 —— 不是裸勝率/連勝/盈虧虛榮榜。
  qualified.sort(
    (a, b) =>
      b._sortEdge - a._sortEdge ||
      b.decided - a.decided ||
      b.accuracyPct - a.accuracyPct,
  );

  const top = qualified.slice(0, LADDER_MAX_ROWS);

  // 付費支持者金環(0023 get_tier_by_code)· 逐碼解析(榜 ≤100 列 · 走 ISR 快取 · 早期榜很小)。
  // 🔴 名次永遠只看 alpha(上面的排序)· 金環只是「贊助開放引擎」的身分標記,絕不參與排名。
  // graceful:0023 未套 / RPC 錯 / 非付費 → false(不顯示金環 · 榜照常渲染)。
  const supporterByCode = new Map<string, boolean>();
  const supa = anonClient(); // 回快取的 stateless anon client(同上)
  if (supa) {
    await Promise.all(
      top.map(async (e) => {
        try {
          const { data, error } = await supa.rpc("get_tier_by_code", {
            p_code: e.authorCode,
          });
          const t = !error && typeof data === "string" ? data : "";
          supporterByCode.set(e.authorCode, t === "black" || t === "founder");
        } catch {
          supporterByCode.set(e.authorCode, false);
        }
      }),
    );
  }

  // 米其林式月度升降:跟「上月底」比。 上月底每人會落在哪一階 = 用「比賽日在本月之前」的場
  // (從歷史推導 · 0 migration)。 砍掉 startISO 解不出台北日的場(graceful · 不誤入上月桶)。
  const prevMonthMatches = idMatches.filter((m) => {
    const d = taipeiDayOf(m.startISO ?? null);
    return d !== null && d.slice(0, 7) < monthKey;
  });
  const lastMonthTier = tiersAsOf(byUser, prevMonthMatches, monthKey);

  // ── R277 · 兩台引擎本人上榜當「尺」(同 /track-record 口徑)· 0 結算不掛空尺 ──────────────
  const finalizedBaseball = [...getFinalizedMatches(), ...getMlbLockedMatches()];
  const bProved = finalizedBaseball.filter((m) => getCalibration(m) === "proved").length;
  const bDecided =
    bProved + finalizedBaseball.filter((m) => getCalibration(m) === "diverged").length;
  let sProved = 0;
  let sDecided = 0;
  try {
    const soccerEng = await getResolvedSoccerEngine();
    for (const p of soccerEng.predictions) {
      if (p.verdict === "proved") {
        sProved += 1;
        sDecided += 1;
      } else if (p.verdict === "diverged") {
        sDecided += 1;
      }
    }
  } catch {
    /* 足球引擎讀失敗 → 不掛足球尺(graceful) */
  }
  const engineRows = [
    { code: "engine-baseball", handle: "ZONE 27 引擎 · 棒球", proved: bProved, decided: bDecided },
    { code: "engine-soccer", handle: "ZONE 27 引擎 · 足球", proved: sProved, decided: sDecided },
  ].filter((g) => g.decided > 0);

  type Ranked = LadderEntry & { _sortEdge: number };
  // 用戶列(各自階級 + 月度升降 · 神諭王座最後在合併排名後才定)。
  const userRanked: Ranked[] = top.map((e) => {
    const prev = lastMonthTier.get(e.authorCode);
    const move: LadderEntry["move"] =
      prev === undefined ? "new" : e.tier > prev ? "up" : e.tier < prev ? "down" : "same";
    return {
      rank: 0,
      authorCode: e.authorCode,
      handle: e.handle,
      tier: e.tier,
      decided: e.decided,
      accuracyPct: e.accuracyPct,
      edgeVsEnginePts: e.edgeVsEnginePts,
      beatEngine: e.beatEngine,
      monthBeatEngine: e.monthBeatEngine,
      supporter: supporterByCode.get(e.authorCode) ?? false,
      move,
      isEngine: false,
      _sortEdge: e._sortEdge,
    };
  });
  // 引擎列:alpha=0(它就是那條線)→ 名次自然落在「贏它的人 / 輸它的人」之間 · 隨大家表現上下移動。
  const engineRanked: Ranked[] = engineRows.map((g) => {
    const acc = Math.round((g.proved / g.decided) * 100);
    return {
      rank: 0,
      authorCode: g.code,
      handle: g.handle,
      tier: tierOf(acc, g.decided),
      decided: g.decided,
      accuracyPct: acc,
      edgeVsEnginePts: 0,
      beatEngine: false,
      monthBeatEngine: false,
      supporter: false,
      move: "same",
      isEngine: true,
      _sortEdge: 0,
    };
  });

  // 合併排名:贏過引擎的幅度(alpha)優先(引擎落在 0 線)· 再樣本厚 · 再命中率 —— 不是裸勝率虛榮榜。
  const merged = [...userRanked, ...engineRanked].sort(
    (a, b) =>
      b._sortEdge - a._sortEdge || b.decided - a.decided || b.accuracyPct - a.accuracyPct,
  );

  const entries: LadderEntry[] = merged.map((e, i) => {
    const rank = i + 1;
    // 神諭王座(tier 5)= 全站第一、是人(非引擎)、且 ≥60% + 夠厚樣本。 🔴 引擎永不拿王座 ——
    // 王座留給把機器拉下來的人;沒人達標 → 機器或許在最上,但那不叫神諭(王座空著)。
    const tier =
      rank === 1 && !e.isEngine && e.accuracyPct >= 60 && e.decided >= LADDER_SHARP_MIN
        ? 5
        : e.tier;
    return {
      rank,
      authorCode: e.authorCode,
      handle: e.handle,
      tier,
      decided: e.decided,
      accuracyPct: e.accuracyPct,
      edgeVsEnginePts: e.edgeVsEnginePts,
      beatEngine: e.beatEngine,
      monthBeatEngine: e.monthBeatEngine,
      supporter: e.supporter,
      move: e.move,
      isEngine: e.isEngine,
    };
  });

  return { show: entries.length > 0, qualifyingUsers: qualified.length, entries };
}
