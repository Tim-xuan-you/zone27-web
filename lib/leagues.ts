// ── ZONE 27 · 私人預測聯盟(server-side · migration 0029)──────────────────────
// 一個盟 = 「一群永久碼的私密分組」。 排名 / 校準 / 贏不贏引擎全部**重用**公開天梯的計分
// (buildIdMatches + aggregateIdentity · 賽果與引擎開盤線在程式碼裡)→ 盟標準與 /ladder、
// /u/[code] 同一把尺,零漂移。 棒球榜(CPBL+MLB · 兩選一可比)· 足球三選一基準不同 → 不混進
// (同 R235② 紀律 · 排除 fd-)。
//
// 🔴 紅線:排名按「贏過引擎的幅度 + 樣本厚度」· 不是裸勝率 / 連勝 / 盈虧。 含輸照算。
//   未滿 10 場分勝負 → 不排名(provisional「暫不評」· 同 /ladder LADDER_MIN_GRADED)· 防幾場運氣登頂。
//
// 安全/隱私:成員清單只有盟員撈得到(get_league_members member-gated)· RPC 一律 authed。
// GRACEFUL:0029 未套 / RPC 錯 → 回 null / 空 → 頁面顯示「建置中」· 絕不 crash。
// ─────────────────────────────────────────────────────────────

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  aggregateIdentity,
  aggregateStreak,
  type UserPredictionsMap,
} from "@/lib/predictions";
import { buildIdMatches } from "@/lib/ladder-server";
import { getCurrentTaipeiMonthKey, getTodayTaipei } from "@/lib/matches";
import { fetchLadderRows } from "@/lib/ladder-rows";
import { getLeagueLocks, type PulseEvent } from "@/lib/pulse";

/** 盟友最近鎖定一筆(reuse /pulse 的 lock 事件型別 · 只 lock kind)。 */
export type LeagueLock = Extract<PulseEvent, { kind: "lock" }>;

// 排名門檻:押滿 10 場「已分勝負」才上榜(同 /ladder)· 不到 → 暫不評(provisional)。
const LEAGUE_RANK_MIN_GRADED = 10;

export type MyLeague = {
  id: string;
  name: string;
  inviteCode: string;
  memberCount: number;
  isCreator: boolean;
};

export type LeagueMeta = MyLeague;

export type LeagueStanding = {
  /** 名次(1-based · ranked 才有)· provisional 為 null */
  rank: number | null;
  /** 永久碼 · 連 /u/[code] 公開含輸檔 */
  authorCode: string;
  /** 顯示 handle(顯示名 or「球迷 #碼」) */
  handle: string;
  /** 已分勝負場數(含輸 · 樣本) */
  decided: number;
  /** 命中率(含輸 · 0-100 · 無已結算 = null) */
  accuracyPct: number | null;
  /** 你命中率 − 引擎同場命中率(贏過機器幾個百分點 · 無對照 = null) */
  edgeVsEnginePts: number | null;
  /** 全期贏過引擎 */
  beatEngine: boolean;
  /** 本月仍在贏引擎 */
  monthBeatEngine: boolean;
  /** 付費支持者金環(身分標記 · 絕不影響名次) */
  supporter: boolean;
  /** 是不是目前登入者本人 */
  isYou: boolean;
};

export type LeagueStandings = {
  ranked: LeagueStanding[];
  /** 場數不足 10、暫不評的盟員(仍列出 · 自己的盟看得到全員) */
  provisional: LeagueStanding[];
  memberCount: number;
  /** 今天(台北)回來對帳(下了一手)的盟員數 · Duolingo Friend-Streak 式「集體紀律」社會問責 ——
   *  🔴 數的是「回來對帳天數」非連勝/PnL(同 aggregateStreak.activeToday 口徑)· 無催促/無倒數/無羞辱 ·
   *  只是一條平靜的「今天有幾個人回來了」。 元件在盟員 ≥2 時才顯(獨盟顯示無意義)。 */
  reconciledToday: number;
};

type MemberRow = {
  member_code?: unknown;
  handle?: unknown;
  display_name?: unknown;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** 我在哪些盟(含成員數)· null = RPC 不可用(0029 未套 · 頁面顯示建置中)· [] = 還沒加入任何盟。 */
export async function getMyLeagues(): Promise<MyLeague[] | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_leagues");
    if (error || !Array.isArray(data)) return null;
    return data.map((r) => {
      const row = r as Record<string, unknown>;
      return {
        id: str(row.id),
        name: str(row.name),
        inviteCode: str(row.invite_code),
        memberCount: Number(row.member_count) || 0,
        isCreator: row.is_creator === true,
      };
    });
  } catch {
    return null;
  }
}

/** 單一盟 meta(member-gated)· null = 非盟員 / 不存在 / RPC 不可用。 */
export async function getLeague(leagueId: string): Promise<LeagueMeta | null> {
  if (!leagueId) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_league", {
      p_league_id: leagueId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const row = data[0] as Record<string, unknown>;
    return {
      id: str(row.id),
      name: str(row.name),
      inviteCode: str(row.invite_code),
      memberCount: Number(row.member_count) || 0,
      isCreator: row.is_creator === true,
    };
  } catch {
    return null;
  }
}

/** 用邀請碼預覽(加入前)· null = 找不到 / RPC 不可用。 */
export async function getLeagueByCode(code: string): Promise<{
  id: string;
  name: string;
  memberCount: number;
  alreadyMember: boolean;
} | null> {
  const c = code.trim();
  if (!c) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_league_by_code", {
      p_invite_code: c,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const row = data[0] as Record<string, unknown>;
    return {
      id: str(row.id),
      name: str(row.name),
      memberCount: Number(row.member_count) || 0,
      alreadyMember: row.already_member === true,
    };
  } catch {
    return null;
  }
}

/**
 * 一個盟的天梯(棒球 CPBL+MLB · 重用 aggregateIdentity)。 viewerCode = 目前登入者的永久碼
 * (標 isYou · 頁面已算好傳入)。 非盟員 / 不存在 / RPC 不可用 → null(頁面顯示對應狀態)。
 */
export async function getLeagueStandings(
  leagueId: string,
  viewerCode: string | null,
): Promise<LeagueStandings | null> {
  if (!leagueId) return null;

  // 1) 撈成員(member-gated · 非盟員回 0 列 → 視為無權限)。
  let members: { code: string; handle: string }[];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_league_members", {
      p_league_id: leagueId,
    });
    if (error || !Array.isArray(data)) return null;
    members = (data as MemberRow[])
      .map((m) => ({
        code: str(m.member_code),
        handle: str(m.handle) || `球迷 #${str(m.member_code)}`,
      }))
      .filter((m) => /^[0-9a-f]{8}$/.test(m.code));
  } catch {
    return null;
  }
  if (members.length === 0) return null; // 非盟員 / 空盟(理論上至少有建立者)

  // 2) 撈全站公開押注 → 按永久碼分組(只認棒球 cpbl-*/mlb- · 排除足球 fd-)。
  const rows = await fetchLadderRows();
  const byCode = new Map<string, UserPredictionsMap>();
  for (const r of rows) {
    const code = str(r.author_code);
    const matchId = str(r.match_id);
    if (!code || !matchId || matchId.startsWith("fd-")) continue;
    const pick = r.pick === "home" || r.pick === "away" ? r.pick : null;
    const ts = str(r.created_at);
    if (!pick || !ts) continue;
    let map = byCode.get(code);
    if (!map) {
      map = {};
      byCode.set(code, map);
    }
    // rows 已 created_at desc → first-seen = 最近一筆(同 /ladder、/u/[code] 口徑)。
    if (!(matchId in map)) map[matchId] = { pick, ts };
  }

  // 今天(台北)回來對帳的盟員數(Friend-Streak 式集體紀律問責 · 同 aggregateStreak.activeToday 口徑)·
  // 重用已撈好的 byCode → 0 額外讀。 數「回來對帳天數」非連勝/PnL/盈虧 · 守紅線(streak 哲學)。
  const today = getTodayTaipei();
  const reconciledToday = members.reduce(
    (n, m) =>
      n + (aggregateStreak(byCode.get(m.code) ?? {}, today).activeToday ? 1 : 0),
    0,
  );

  // 3) 每位盟員套 aggregateIdentity(同一把尺)。
  const idMatches = buildIdMatches();
  const monthKey = getCurrentTaipeiMonthKey();

  type Row = LeagueStanding & { _sortEdge: number };
  const all: Row[] = members.map((m) => {
    const id = aggregateIdentity(byCode.get(m.code) ?? {}, idMatches, monthKey);
    return {
      rank: null,
      authorCode: m.code,
      handle: m.handle,
      decided: id.decided,
      accuracyPct: id.accuracy,
      edgeVsEnginePts: id.edgeVsEnginePts,
      beatEngine: id.beatEngine === true,
      monthBeatEngine: id.month.beatEngine === true,
      supporter: false, // 下面對 ranked 逐碼解析 0023 後填
      isYou: viewerCode != null && m.code === viewerCode,
      _sortEdge: id.edgeVsEnginePts ?? -999,
    };
  });

  // 4) 分「已可排名(≥10 場)」與「暫不評(<10)」· 排名按 alpha → 樣本 → 命中率(不是裸勝率)。
  const rankedRows = all
    .filter((r) => r.decided >= LEAGUE_RANK_MIN_GRADED && r.accuracyPct !== null)
    .sort(
      (a, b) =>
        b._sortEdge - a._sortEdge ||
        b.decided - a.decided ||
        (b.accuracyPct ?? 0) - (a.accuracyPct ?? 0),
    );
  const provisionalRows = all
    .filter((r) => !(r.decided >= LEAGUE_RANK_MIN_GRADED && r.accuracyPct !== null))
    .sort((a, b) => b.decided - a.decided);

  // 5) 支持者金環(0023 get_tier_by_code)· 只對「會上榜的人」逐碼解析 · graceful。
  //   🔴 名次永遠只看 alpha(上面排序)· 金環只是「贊助開放引擎」身分標記,絕不參與排名。
  try {
    const supabase = await createSupabaseServerClient();
    await Promise.all(
      rankedRows.map(async (e) => {
        try {
          const { data, error } = await supabase.rpc("get_tier_by_code", {
            p_code: e.authorCode,
          });
          const t = !error && typeof data === "string" ? data : "";
          e.supporter = t === "black" || t === "founder";
        } catch {
          e.supporter = false;
        }
      }),
    );
  } catch {
    // 0023 未套 / 全錯 → 無金環 · 榜照常。
  }

  const ranked: LeagueStanding[] = rankedRows.map((e, i) => ({
    rank: i + 1,
    authorCode: e.authorCode,
    handle: e.handle,
    decided: e.decided,
    accuracyPct: e.accuracyPct,
    edgeVsEnginePts: e.edgeVsEnginePts,
    beatEngine: e.beatEngine,
    monthBeatEngine: e.monthBeatEngine,
    supporter: e.supporter,
    isYou: e.isYou,
  }));
  const provisional: LeagueStanding[] = provisionalRows.map((e) => ({
    rank: null,
    authorCode: e.authorCode,
    handle: e.handle,
    decided: e.decided,
    accuracyPct: e.accuracyPct,
    edgeVsEnginePts: e.edgeVsEnginePts,
    beatEngine: e.beatEngine,
    monthBeatEngine: e.monthBeatEngine,
    supporter: false,
    isYou: e.isYou,
  }));

  return { ranked, provisional, memberCount: members.length, reconciledToday };
}

/**
 * 盟友最近鎖了什麼(私人聯盟活動條 · 解冷啟動)· 朋友剛加盟、還沒有人押滿 10 場時,天梯一片空 ——
 * 這條把「盟員最近的賽前鎖定」串起來,盟一有人動就活(Strava segment「看朋友在練什麼」式)。
 *
 * memberCodes 由 getLeagueStandings 的結果衍生(ranked + provisional 的 authorCode = 全體盟員 ·
 *   不必再打一次 get_league_members)· getLeagueLocks 走 fetchLadderRows(React cache → 跟天梯
 *   同一次 RPC · 0 額外讀)· 棒球+足球都認(世界盃夜朋友押足球也上)· 結算是引擎的事不分盟、不入此條。
 *
 * 🔴 守紅線:只播「鎖定」這種真帳本事件(同 /pulse)· 無 PnL / 連勝 / 排名 · 每筆連那人的 /u 公開檔。
 * GRACEFUL:0029 未套(memberCodes 空)/ 0 鎖定 / 任何錯 → [](元件據此整條隱藏 · 不破頁)。
 */
export async function getLeagueActivity(
  memberCodes: string[],
  limit = 8,
): Promise<LeagueLock[]> {
  if (memberCodes.length === 0) return [];
  try {
    const events = await getLeagueLocks(new Set(memberCodes), limit);
    return events.filter((e): e is LeagueLock => e.kind === "lock");
  } catch {
    return [];
  }
}
