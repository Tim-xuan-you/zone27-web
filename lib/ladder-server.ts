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
  type UserPredictionsMap,
  type IdentityMatch,
} from "@/lib/predictions";
import {
  getFinalizedMatches,
  getMatchStartIso,
  getEngineFavorite,
  getCurrentTaipeiMonthKey,
} from "@/lib/matches";
import { getMlbLockedMatches } from "@/lib/mlb-matches";

// 新秀門檻:押滿 10 場「已分勝負」(同 /ladder 第 1 階「押滿 10 場就上榜」)· 不到 10 不上榜。
const LADDER_MIN_GRADED = 10;
// 0 用戶不上空榜:合格用戶 < 此數 → 不渲染榜(維持「王座上只有機器」)。 等真的有一小群人才亮。
const LADDER_MIN_USERS = 3;
// 榜長上限(早期防爆 · 之後要分頁再說)。
const LADDER_MAX_ROWS = 100;

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
};

export type LadderBoard = {
  /** 合格用戶 ≥ 門檻才秀榜(否則 /ladder 維持優雅空榜) */
  show: boolean;
  qualifyingUsers: number;
  entries: LadderEntry[];
};

const EMPTY: LadderBoard = { show: false, qualifyingUsers: 0, entries: [] };

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

type RpcRow = {
  author_code?: unknown;
  handle?: unknown;
  match_id?: unknown;
  pick?: unknown;
  created_at?: unknown;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

// 已結算 + 賽前鎖定引擎線的場(CPBL finalized + MLB locked)· 都帶 engineFav · 給跨用戶對帳。
// 只收「鎖定過引擎線」的場 → 沒有未鎖定 MLB 的後見之明問題(同 /member 帳本誠信修)。
function buildIdMatches(): IdentityMatch[] {
  const out: IdentityMatch[] = [];
  for (const m of [...getFinalizedMatches(), ...getMlbLockedMatches()]) {
    out.push({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: getEngineFavorite(m),
      startISO: getMatchStartIso(m),
    });
  }
  return out;
}

// 階級(snapshot · 累積成就)· month.beatEngine 另外當「本月還在贏」訊號顯示(不混進階級)。
function tierOf(
  accuracy: number,
  beatEngine: boolean,
  crowdAvgAccuracy: number,
): number {
  if (beatEngine) return 4; // 神準手:贏過機器
  if (accuracy > crowdAvgAccuracy) return 3; // 操盤手:贏過大家的平均
  if (accuracy > 50) return 2; // 分析師:準度過半
  return 1; // 新秀:上榜但還沒過半
}

export async function getLadderBoard(): Promise<LadderBoard> {
  let rows: RpcRow[];
  try {
    const supabase = anonClient();
    if (!supabase) return EMPTY;
    const { data, error } = await supabase.rpc("get_ladder_entries");
    if (error || !Array.isArray(data)) return EMPTY;
    rows = data as RpcRow[];
  } catch {
    return EMPTY;
  }

  // 按永久碼分組 · 只認棒球(cpbl-*/mlb-* · 排除 fd- 足球:足球準度永遠分開算,同既有規則)。
  const byUser = new Map<string, { handle: string; map: UserPredictionsMap }>();
  for (const r of rows) {
    const code = str(r.author_code);
    const matchId = str(r.match_id);
    if (!code || !matchId || matchId.startsWith("fd-")) continue;
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
  type Computed = LadderEntry & { _sortEdge: number };
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

  if (qualified.length < LADDER_MIN_USERS) {
    return { show: false, qualifyingUsers: qualified.length, entries: [] };
  }

  // 大家的平均命中率(給「操盤手 = 贏過大家平均」那階)。
  const crowdAvg =
    qualified.reduce((s, e) => s + e.accuracyPct, 0) / qualified.length;
  for (const e of qualified) {
    e.tier = tierOf(e.accuracyPct, e.beatEngine, crowdAvg);
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

  const entries: LadderEntry[] = top.map((e, i) => {
    const rank = i + 1;
    // 神諭(王座 · tier 5)= 全站第一、且真的贏過機器。 沒人贏機器 → 王座仍只有機器(不硬封王)。
    const tier = rank === 1 && e.beatEngine ? 5 : e.tier;
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
      supporter: supporterByCode.get(e.authorCode) ?? false,
    };
  });

  return { show: true, qualifyingUsers: qualified.length, entries };
}
