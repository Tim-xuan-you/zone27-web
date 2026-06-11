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

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getMatchById,
  getFinalizedMatches,
  getCalibration,
  type Calibration,
} from "@/lib/matches";
import {
  getLockedSoccerById,
  getLockedSoccerPredictions,
} from "@/lib/soccer/locked";

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

// stateless anon client(同 lib/ladder-server.ts · 讀「全站」資料 · 不混登入者 · ISR-safe)。
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

// 跨用戶「賽前鎖定」事件 · 走 0022 get_ladder_entries(已按 created_at desc)→ 取最近的。
// 棒球(cpbl-*/mlb-* · matchById)+ 足球(fd-* · getLockedSoccerById · 三向含和局)· 認不到隊名 → 跳過。
async function getRecentLocks(limit: number): Promise<PulseEvent[]> {
  let rows: {
    author_code?: unknown;
    handle?: unknown;
    match_id?: unknown;
    pick?: unknown;
    created_at?: unknown;
  }[];
  try {
    const supabase = anonClient();
    if (!supabase) return [];
    const { data, error } = await supabase.rpc("get_ladder_entries");
    if (error || !Array.isArray(data)) return [];
    rows = data;
  } catch {
    return [];
  }

  const soccerById = getLockedSoccerById(); // fd-* → 隊名 / 看好邊(世界盃夜命門)· 一次建好
  const out: PulseEvent[] = [];
  const seen = new Set<string>(); // 同一人同一場只播最近一筆(同 ladder/profile first-seen)
  for (const r of rows) {
    const code = str(r.author_code);
    const matchId = str(r.match_id);
    const isSoccer = matchId.startsWith("fd-");
    // 棒球兩向(home/away)· 足球三向(home/draw/away)。
    const pick =
      r.pick === "home" || r.pick === "away"
        ? r.pick
        : isSoccer && r.pick === "draw"
          ? "draw"
          : null;
    const whenISO = str(r.created_at);
    if (!code || !matchId || !pick || !whenISO) continue;
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
    } else {
      const m = getMatchById(matchId);
      if (!m) continue; // 認不到的場(舊資料)跳過
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
function getRecentSoccerSettlements(limit: number): PulseEvent[] {
  const all: PulseEvent[] = [];
  for (const p of getLockedSoccerPredictions()) {
    if (!p.verdict || !p.gradedAt) continue;
    const ts = Date.parse(p.gradedAt);
    if (Number.isNaN(ts)) continue;
    all.push({
      kind: "settle",
      ts,
      whenISO: p.gradedAt,
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
    Promise.resolve(getRecentSoccerSettlements(limit)),
  ]);
  return [...locks, ...settles, ...soccerSettles]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit);
}
