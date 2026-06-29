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
import { taipeiDayOf, type IdentityMatch } from "@/lib/predictions";
import { RECKONING_STAR_MIN } from "@/lib/reckoning-star";
import {
  getFinalizedMatches,
  getMatchStartIso,
  getEngineFavorite,
  getCalibration,
  getCurrentTaipeiMonthKey,
} from "@/lib/matches";
import { getMlbLockedMatches } from "@/lib/mlb-matches";
import { getResolvedSoccerEngine, resolveLockedSoccer } from "@/lib/soccer/engine-settle";
import { fetchLadderRows } from "@/lib/ladder-rows";
import { baseballPropIdMatches } from "@/lib/baseball-totals";
import { tennisResults } from "@/lib/tennis/matches";
import { badmintonResults } from "@/lib/badminton/matches";
import { mmaResults } from "@/lib/mma/matches";
import { basketballResults } from "@/lib/basketball/matches";

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

// ── R277 · 合併天梯:所有運動算一本帳 ──────────────────────────────────────────
// 每筆賽果正規化成 {winner, day, startISO}(兩向運動 a/b → home/away · 同存表規則 A=home/B=away)·
// 用戶跨運動的押注全餵進同一支 gradeRecord → 合併命中率。 排名按勝率(Tim R277:純 60% 門檻)·
// 引擎當一般用戶一起排一起升降。 月度升降:用「上月底之前的場」重算一次合併階級比對。 0 migration。
type NormResult = { winner: "home" | "away" | "draw"; day: string | null; startISO: string | null };
type PickMap = Record<string, { pick: "home" | "away" | "draw"; ts: string }>;

function twoWay(o: "a" | "b"): "home" | "away" {
  return o === "a" ? "home" : "away";
}

/** 同步可得的賽果(棒球含大小分玩法 + 網球 + 羽球 + UFC)· 足球走非同步另疊。 */
function buildSyncResults(): Map<string, NormResult> {
  const m = new Map<string, NormResult>();
  for (const g of buildIdMatches()) {
    // 平手(tie)不計任何一方 → 不進結果(同 aggregateIdentity · 含輸但不含平手)。
    if (g.finalWinner === "home" || g.finalWinner === "away")
      m.set(g.id, { winner: g.finalWinner, day: taipeiDayOf(g.startISO ?? null), startISO: g.startISO ?? null });
  }
  for (const [id, r] of Object.entries(tennisResults()))
    m.set(id, { winner: twoWay(r.outcome), day: taipeiDayOf(r.startISO), startISO: r.startISO || null });
  for (const [id, r] of Object.entries(badmintonResults()))
    m.set(id, { winner: twoWay(r.outcome), day: taipeiDayOf(r.startISO), startISO: r.startISO || null });
  // 🔴 MMA 和局(outcome="draw")= push:同棒球平手,不計任何一方 → 不進合併天梯結果
  //   (不算命中也不算落空 · 不影響升降 · 個人戰績卡才顯示「= N 平」)。
  for (const [id, r] of Object.entries(mmaResults()))
    if (r.outcome !== "draw")
      m.set(id, { winner: twoWay(r.outcome), day: taipeiDayOf(r.startISO), startISO: r.startISO || null });
  // 🔴 籃球 outcome 本來就是 home/away(無 twoWay 轉換)· 籃球無和局 → 無 draw 過濾。 R291
  for (const [id, r] of Object.entries(basketballResults()))
    m.set(id, { winner: r.outcome, day: taipeiDayOf(r.startISO), startISO: r.startISO || null });
  return m;
}

/** 一個人某段時間的「所有運動合併」戰績 · beforeMonth = 只算該月之前(上月底快照)· 先鎖後結 · 含輸。 */
function gradeRecord(
  map: PickMap,
  results: Map<string, NormResult>,
  beforeMonth?: string,
): { decided: number; hits: number } {
  let decided = 0;
  let hits = 0;
  for (const id in map) {
    const r = results.get(id);
    if (!r) continue;
    if (beforeMonth && (r.day === null || r.day.slice(0, 7) >= beforeMonth)) continue;
    const p = map[id];
    if (r.startISO) {
      const t = Date.parse(p.ts);
      const k = Date.parse(r.startISO);
      if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) continue; // 開賽後才下 → 不計
    }
    decided += 1;
    if (p.pick === r.winner) hits += 1;
  }
  return { decided, hits };
}

export async function getLadderBoard(): Promise<LadderBoard> {
  // R258 · 走 lib/ladder-rows 的 React 快取列(同一次 render 與首頁脈動/熱度共用「一次」RPC,
  //  不重複全表掃 get_ladder_entries)· 任何錯 → [](graceful · 下面 qualified<門檻 自然回空榜)。
  const rows = await fetchLadderRows();

  // ── R277 · 合併天梯:所有運動的押注算一本帳(不再只認棒球)。 按永久碼分組 · 同碼/同場 first-seen 取最新。 ──
  const byUser = new Map<string, { handle: string; map: PickMap }>();
  for (const r of rows) {
    const code = str(r.author_code);
    const matchId = str(r.match_id);
    if (!code || !matchId) continue;
    if (matchId.startsWith("mkt-")) continue; // 群眾盤不是運動押注 · 其餘運動全收(對不到賽果的自然 skip)
    const pick =
      r.pick === "home" || r.pick === "away" || r.pick === "draw" ? r.pick : null;
    const ts = str(r.created_at);
    if (!pick || !ts) continue;
    let u = byUser.get(code);
    if (!u) {
      u = { handle: str(r.handle) || `球迷 #${code}`, map: {} };
      byUser.set(code, u);
    }
    if (!(matchId in u.map)) u.map[matchId] = { pick, ts };
  }

  const monthKey = getCurrentTaipeiMonthKey();
  // 跨運動賽果一本帳(同步運動 + 足球非同步疊上)。
  const results = buildSyncResults();
  try {
    const soccer = await resolveLockedSoccer();
    for (const p of soccer) {
      if (
        p.verdict !== null &&
        (p.outcome === "home" || p.outcome === "draw" || p.outcome === "away")
      ) {
        results.set(p.matchId, {
          winner: p.outcome,
          day: taipeiDayOf(p.kickoffISO ?? null),
          startISO: p.kickoffISO ?? null,
        });
      }
    }
  } catch {
    /* 足球賽果讀失敗 → 不疊足球(graceful · 其餘運動照算) */
  }

  // ── 用戶合併戰績(所有運動算一起 · 含輸 · 先鎖後結)→ 取合格者(≥10 已分勝負)。 ──
  type Q = {
    authorCode: string;
    handle: string;
    decided: number;
    accuracyPct: number;
    tier: number;
    lastTier: number | null; // 上月底階級(null = 上月底沒合格 = 本月新上榜)
  };
  const qualified: Q[] = [];
  for (const [code, u] of byUser) {
    const cur = gradeRecord(u.map, results);
    if (cur.decided < LADDER_MIN_GRADED) continue;
    const acc = Math.round((cur.hits / cur.decided) * 100);
    const last = gradeRecord(u.map, results, monthKey);
    const lastTier =
      last.decided >= LADDER_MIN_GRADED
        ? tierOf(Math.round((last.hits / last.decided) * 100), last.decided)
        : null;
    qualified.push({ authorCode: code, handle: u.handle, decided: cur.decided, accuracyPct: acc, tier: tierOf(acc, cur.decided), lastTier });
  }

  // R277:1-2 個合格用戶 → 不上榜(會暴露單一用戶 · 守隱私)。 0 用戶 → 兩台引擎獨佔榜(冷啟動 ·
  //   機器在榜上等第一個爬上來的人)。 ≥3 用戶 → 正常上榜(用戶 + 引擎一起排)。
  if (qualified.length > 0 && qualified.length < LADDER_MIN_USERS) {
    return { show: false, qualifyingUsers: qualified.length, entries: [] };
  }

  // ── R277 · 兩台引擎當「一般用戶」一起排、一起升降(Tim:引擎也是用戶)· 0 結算不掛 ──────────
  //   名稱用方法名(透明 · 同 /engines):棒球 = 蒙地卡羅、足球 = Dixon-Coles。
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
    /* graceful */
  }
  const engineRows: Q[] = [];
  if (bDecided > 0) {
    const acc = Math.round((bProved / bDecided) * 100);
    engineRows.push({ authorCode: "engine-baseball", handle: "蒙地卡羅引擎", decided: bDecided, accuracyPct: acc, tier: tierOf(acc, bDecided), lastTier: tierOf(acc, bDecided) });
  }
  if (sDecided > 0) {
    const acc = Math.round((sProved / sDecided) * 100);
    engineRows.push({ authorCode: "engine-soccer", handle: "Dixon-Coles 引擎", decided: sDecided, accuracyPct: acc, tier: tierOf(acc, sDecided), lastTier: tierOf(acc, sDecided) });
  }

  // 合併 + 排名:🔴 純命中率(Tim R277:勝率 60% 門檻)· 同率比樣本厚 —— 引擎跟用戶一起排、一起升降。
  const all: Q[] = [...qualified, ...engineRows];
  all.sort((a, b) => b.accuracyPct - a.accuracyPct || b.decided - a.decided);
  const top = all.slice(0, LADDER_MAX_ROWS);

  // 付費金環(只解析用戶碼 · 引擎不解析)· graceful。
  const supporterByCode = new Map<string, boolean>();
  const supa = anonClient();
  if (supa) {
    await Promise.all(
      top
        .filter((e) => !e.authorCode.startsWith("engine-"))
        .map(async (e) => {
          try {
            const { data, error } = await supa.rpc("get_tier_by_code", { p_code: e.authorCode });
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
    const isEngine = e.authorCode.startsWith("engine-");
    // 神諭(tier 5)= 全站第一、是人(非引擎)、≥60% + 夠厚樣本。 🔴 引擎永不拿王座(留給人)。
    const tier =
      rank === 1 && !isEngine && e.accuracyPct >= 60 && e.decided >= LADDER_SHARP_MIN
        ? 5
        : e.tier;
    // 神諭(5)是「本月 rank 1 + ≥60%」的當下加冕,但 lastTier 走 tierOf 最高只到 4(上月底沒有排名脈絡)
    //  → 直接比會讓「連任的衛冕神諭」每次 render 都誤標「▲ 本月升」。 比較時把當下的 5 夾回 4(對齊 tierOf 尺度)。
    const moveTier = tier === 5 ? 4 : tier;
    const move: LadderEntry["move"] = isEngine
      ? "same"
      : e.lastTier === null
        ? "new"
        : moveTier > e.lastTier
          ? "up"
          : moveTier < e.lastTier
            ? "down"
            : "same";
    return {
      rank,
      authorCode: e.authorCode,
      handle: e.handle,
      tier,
      decided: e.decided,
      accuracyPct: e.accuracyPct,
      edgeVsEnginePts: null,
      beatEngine: false,
      monthBeatEngine: false,
      supporter: supporterByCode.get(e.authorCode) ?? false,
      move,
      isEngine,
    };
  });

  return { show: entries.length > 0, qualifyingUsers: qualified.length, entries };
}
