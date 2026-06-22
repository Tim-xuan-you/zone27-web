// ── ZONE 27 · 活動脈動(中央對帳牆)· server-side ─────────────────────────
// 一面會動的牆:把真實的帳本事件按時間串起來,讓站「有人在、引擎在動」。 R210 設計的
// liveness 核心 —— 等到有真人(R226 Tim 找來 10 個朋友)才建,不空牆。
//
// 兩種真事件(都是已公開的資料 · 0 新 migration):
//   · lock   = 某個會員「賽前鎖定」了一手(押哪邊)· 來源 = 0022 get_ladder_entries
//              (跨用戶公開署名 · 同 /ladder + /u/[code] 口徑)· 連到那人的 /u 公開校準檔。
//   · settle = 引擎結算了一場(命中 / 落空 / 平)· 來源 = 棒球 matches.ts finalResult + getCalibration、
//              足球 soccer-locked.json 的 verdict / gradedAt。
//
// 🔴 紅線(熱鬧但不變賭場):
//   · 只播「鎖定 / 結算」這種真帳本事件 —— 絕不播 PnL / 連勝 / 盈虧 / 排名(那是賭場炫耀)。
//   · 每格連到那人的 /u 公開校準檔(熱鬧靠「被看見的對帳」· 不靠拉霸多巴胺)。
//   · graceful:沒有用戶事件 → 只有引擎事件、永不空(引擎天天在鎖 + 結算)· 0022 未套 / 0 用戶
//     → locks 空、牆仍有引擎結算撐著。 任何 error 都退引擎事件,不崩。
//   · 含輸照播(落空跟命中同權重)· 平手照播(不偷藏)· 不指名對手。
//   · 足球(fd-*)鎖定 + 引擎結算已併入(R227 世界盃夜:朋友集中押足球 · 走 getLockedSoccerById 解
//     隊名 / 看好邊;draw =「看好 和局」· 鎖定/結算都連 /receipts/<id>(三階段都解析得到 · 不死捲動))·
//     引擎沒鎖該場(認不到隊名)→ graceful 跳過。
// ─────────────────────────────────────────────────────

import { fetchLadderRows } from "@/lib/ladder-rows";
import {
  getMatchById,
  getFinalizedMatches,
  getCalibration,
  type Calibration,
} from "@/lib/matches";
import { getLockedSoccerById } from "@/lib/soccer/locked";
import { resolveLockedSoccer } from "@/lib/soccer/engine-settle";
import { getMlbLockedMatches } from "@/lib/mlb-matches";
import { getMarketById } from "@/lib/markets";

export type PulseEvent =
  | {
      kind: "lock";
      ts: number; // epoch ms · 排序用
      whenISO: string;
      handle: string;
      authorCode: string;
      matchId: string;
      teamLabel: string; // 他看好的隊(home/away 對應隊名)
      matchup: string; // 「主隊 vs 客隊」
    }
  | {
      kind: "settle";
      ts: number;
      whenISO: string;
      matchId: string;
      matchup: string;
      verdict: Calibration; // proved | diverged | push
    };

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

// 跨用戶「賽前鎖定」事件 · 走 0022 get_ladder_entries(已按 created_at desc)→ 取最近的。
// 棒球(cpbl-*/mlb-* · matchById)+ 足球(fd-* · getLockedSoccerById · 三向含和局)· 認不到隊名 → 跳過。
// codes(選填)· 傳入時只留「這群永久碼」的鎖定 = 私人聯盟的盟友活動(同口徑、同隊名解析 · DRY)。
async function getRecentLocks(
  limit: number,
  codes?: Set<string>,
): Promise<PulseEvent[]> {
  // 全站押注列 · 走共用的 fetchLadderRows(React cache 去重 → 跟同頁熱度共用同一次 RPC · 不重複全表掃)。
  const rows = await fetchLadderRows();

  const soccerById = getLockedSoccerById(); // fd-* → 隊名 / 看好邊(世界盃夜命門)· 一次建好
  // mlb-* → Match(同 /ladder 的 getMlbLockedMatches 口徑 · 0 fetch · 讀打包好的鎖定盤)· 一次建好。
  // 之前非足球 id 一律走 getMatchById(只認 CPBL)→ MLB 鎖定被靜默丟掉、不上牆也不計首頁人數。
  const mlbById = new Map(getMlbLockedMatches().map((m) => [m.id, m] as const));
  const out: PulseEvent[] = [];
  const seen = new Set<string>(); // 同一人同一場只播最近一筆(同 ladder/profile first-seen)
  for (const r of rows) {
    const code = str(r.author_code);
    const matchId = str(r.match_id);
    if (matchId.includes("~")) continue; // 🔴 玩法押注(大小分等)不上「誰贏」活動脈動
    const isSoccer = matchId.startsWith("fd-");
    const isMarket = matchId.startsWith("mkt-"); // 群眾盤(/markets · 引擎沒覆蓋的場)· 三向同足球
    // 棒球兩向(home/away)· 足球 + 群眾盤三向(home/draw/away)。
    const pick =
      r.pick === "home" || r.pick === "away"
        ? r.pick
        : (isSoccer || isMarket) && r.pick === "draw"
          ? "draw"
          : null;
    const whenISO = str(r.created_at);
    if (!code || !matchId || !pick || !whenISO) continue;
    if (codes && !codes.has(code)) continue; // 聯盟視圖:只留盟員的鎖定
    const key = `${code}|${matchId}`;
    if (seen.has(key)) continue;
    const ts = Date.parse(whenISO);
    if (Number.isNaN(ts)) continue;

    let teamLabel: string;
    let matchup: string;
    if (isSoccer) {
      const s = soccerById.get(matchId);
      if (!s) continue; // 引擎沒鎖這場(認不到隊名)→ 跳過(graceful · 同棒球 matchById miss)
      teamLabel = pick === "home" ? s.home : pick === "away" ? s.away : "和局";
      matchup = `${s.home} vs ${s.away}`;
    } else if (isMarket) {
      // 群眾盤(/markets)· 從策展名單解隊名 · 三向(和局)· 認不到(舊/已撤)→ 跳過。
      const mk = getMarketById(matchId);
      if (!mk) continue;
      teamLabel = pick === "home" ? mk.home : pick === "away" ? mk.away : "和局";
      matchup = `${mk.home} vs ${mk.away}`;
    } else {
      const m = getMatchById(matchId) ?? mlbById.get(matchId);
      if (!m) continue; // CPBL + MLB 都認不到(舊資料 / 未鎖定)→ 跳過
      teamLabel = pick === "home" ? m.home.name : m.away.name;
      matchup = `${m.home.name} vs ${m.away.name}`;
    }

    seen.add(key);
    out.push({
      kind: "lock",
      ts,
      whenISO,
      handle: str(r.handle) || `球迷 #${code}`,
      authorCode: code,
      matchId,
      teamLabel,
      matchup,
    });
    if (out.length >= limit) break;
  }
  return out;
}

// 引擎結算事件 · 棒球已結算場(含輸 · 平照播)· ts = ingestedAt(賽果入帳時間)。
function getRecentSettlements(limit: number): PulseEvent[] {
  const out: PulseEvent[] = [];
  for (const m of getFinalizedMatches()) {
    const verdict = getCalibration(m);
    const fr = m.finalResult;
    if (!verdict || !fr) continue;
    const ts = Date.parse(fr.ingestedAt);
    if (Number.isNaN(ts)) continue;
    out.push({
      kind: "settle",
      ts,
      whenISO: fr.ingestedAt,
      matchId: m.id,
      matchup: `${m.home.name} vs ${m.away.name}`,
      verdict,
    });
    if (out.length >= limit) break;
  }
  return out;
}

// 足球引擎結算事件 · 已對帳(verdict 非 null)的鎖定場(含輸 · 平照播)· ts = gradedAt。
// 世界盃夜引擎也在逐場對帳足球 → 牆上不只棒球結算。 按 gradedAt 由新到舊取前 limit 筆。
// ⚠️ 走 resolveLockedSoccer(站上即時對帳)而非生 JSON —— 終場一進 live 窗(~1h)牆就亮,
//    不等 GitHub cron commit(常延遲數小時)· 世界盃夜「踢完就上牆」是命脈。
async function getRecentSoccerSettlements(limit: number): Promise<PulseEvent[]> {
  const all: PulseEvent[] = [];
  for (const p of await resolveLockedSoccer()) {
    if (!p.verdict) continue;
    // 牆上時戳/排序用「約終場 = 開賽 + 110 分」(固定值)· 不用 gradedAt —— on-read 與 cron
    // 之後補寫的 gradedAt 不同,用它排序會在 cron commit 那刻跳位;改用開賽時間既穩定、
    // 又比「cron 剛好幾點跑」更符合直覺(按比賽踢完的先後排)。
    const kt = Date.parse(p.kickoffISO ?? "");
    if (Number.isNaN(kt)) continue;
    const ts = kt + 110 * 60 * 1000; // 排序用「約終場」(開賽 + 110 分)
    all.push({
      kind: "settle",
      ts,
      // 顯示日期用「開賽日」而非開賽+110 —— 深夜場(~23:00 台北)+110 會跨午夜顯示成隔天。
      whenISO: p.kickoffISO ?? new Date(ts).toISOString(),
      matchId: p.matchId,
      matchup: `${p.home} vs ${p.away}`,
      verdict: p.verdict, // proved | diverged | push(非 null · 同棒球口徑)
    });
  }
  return all.sort((a, b) => b.ts - a.ts).slice(0, limit);
}

/** 中央活動脈動 · 用戶鎖定(棒球+足球)+ 引擎結算(棒球+足球)交織 · 最新在前 ·
 *  graceful(永不空:引擎事件兜底)。 */
export async function getActivityPulse(limit = 24): Promise<PulseEvent[]> {
  const [locks, settles, soccerSettles] = await Promise.all([
    getRecentLocks(limit),
    Promise.resolve(getRecentSettlements(limit)),
    getRecentSoccerSettlements(limit),
  ]);
  return [...locks, ...settles, ...soccerSettles]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit);
}

/** 私人聯盟活動 · 只取「這群盟員永久碼」最近的賽前鎖定(棒球+足球 · 同 /pulse 隊名解析、含和局)。
 *  reuse getRecentLocks + fetchLadderRows(React cache → 跟聯盟天梯同一次 RPC · 0 額外讀)·
 *  只回 lock 事件(結算是引擎的事、不分盟)· codes 為空 → []。 任何錯 → []。 */
export async function getLeagueLocks(
  codes: Set<string>,
  limit = 8,
): Promise<PulseEvent[]> {
  if (codes.size === 0) return [];
  try {
    return await getRecentLocks(limit, codes);
  } catch {
    return [];
  }
}

// ── 首頁活動脈動精華(會動的前門訊號)──────────────────────────────────────
// 最近有幾個「不重複的人」賽前鎖定 + 最新一手 + 幾顆頭像。 給首頁一塊低調的 liveness 訊號
// (訪客 / 朋友分享的連結一打開,就感覺「有人在、牆在動」)· 整塊連到 /pulse 完整牆。
// 🔴 守紅線:不重複人數 < HOMEPAGE_PULSE_MIN → 回空(首頁元件據此整塊隱藏 · 不曝光單一用戶、
//   不假裝人潮)· 只數真實公開鎖定(同 /pulse)· 無 PnL / 連勝 / 排名 · graceful(0 用戶 / 錯誤
//   → 空、首頁不破)。
export const HOMEPAGE_PULSE_MIN = 3; // 至少 3 個不重複的人才上首頁(一兩個人不算「牆在動」)

export type PulseSummary = {
  /** 最近不重複的賽前鎖定人數(< HOMEPAGE_PULSE_MIN 時回 0 = 首頁不顯示) */
  lockerCount: number;
  /** 最近不重複押注者(最新在前 · 給首頁頭像列 · 最多 maxAvatars 顆)·
   *  帶 handle 讓頭像字符 = 顯示名首字(同一人到哪都同一張臉 · 同 /pulse 牆)。 */
  avatars: { code: string; handle: string }[];
  /** 最新一手(滾動的「牆在動」鉤子)· 0 鎖定 → null */
  latest: { handle: string; teamLabel: string } | null;
};

const EMPTY_SUMMARY: PulseSummary = { lockerCount: 0, avatars: [], latest: null };

export async function getPulseSummary(
  scanLimit = 80,
  maxAvatars = 5,
): Promise<PulseSummary> {
  const locks = await getRecentLocks(scanLimit); // 全是 lock 事件 · created_at desc(最新在前)
  const seen = new Set<string>();
  const avatars: PulseSummary["avatars"] = [];
  let latest: PulseSummary["latest"] = null;
  for (const e of locks) {
    if (e.kind !== "lock") continue;
    if (!latest) latest = { handle: e.handle, teamLabel: e.teamLabel }; // 第一筆 = 最新
    if (seen.has(e.authorCode)) continue;
    seen.add(e.authorCode);
    if (avatars.length < maxAvatars) avatars.push({ code: e.authorCode, handle: e.handle });
  }
  if (seen.size < HOMEPAGE_PULSE_MIN) return EMPTY_SUMMARY; // 不到門檻 → 首頁整塊隱藏
  return { lockerCount: seen.size, avatars, latest };
}
