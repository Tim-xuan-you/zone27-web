import {
  predictTennis,
  toDisplayPercents,
  enginePickOf,
  type TennisSurface,
} from "@/lib/tennis/engine";
import { ratingFromRank } from "@/lib/tennis/rating";

// ── ZONE 27 · 網球真實賽程(台灣運彩在賣的場 · 名字一字不改)──────────────────────
// CPBL 模式:Tim 從台灣運彩看板手 curate 真實對戰(運彩 = 覆蓋目錄,我們只查它賣哪些場 →
// 用自己引擎跑 → 只秀自己機率,絕不爬盤口、絕不顯示賠率)。 球員實力分由現時世界排名換算
// (lib/tennis/rating · 誠實估計)→ 引擎算兩向勝率。
//
// 🔴 誠實鐵律:不是每場都開盤。 球員認不出 / 排名查不到(信心 low)或進行中(live)→ 不硬開,
//   誠實標「覆蓋建置中」/「進行中」。 賭場什麼都敢開,我們只開算得出的。 名字一律用運彩的。
//   id = 運彩場次編號(可追溯)。 surface 草地 / 紅土照賽會。
// ─────────────────────────────────────────────────────

export type DrawConfidence = "high" | "medium" | "low";

export type TennisDrawPlayer = {
  /** 運彩顯示名(一字不改) */
  zh: string;
  /** 英文名(辨識用 · 認不出 = "?") */
  en: string;
  /** 現時世界排名(估計種子分來源)· null = 查不到 → 不開盤 */
  rank: number | null;
  confidence: DrawConfidence;
};

export type TennisMatch = {
  /** 運彩場次編號 */
  id: string;
  tour: "atp" | "wta";
  /** 運彩賽事名 */
  tournament: string;
  surface: TennisSurface;
  /** 運彩時間字串(台北) */
  time: string;
  /** 進行中(現場)· 引擎只做賽前不追 live → 不開盤 */
  live?: boolean;
  /** 不開盤時的誠實說明(例:剛傷退復出排名失真)· 覆蓋建置中卡顯示此句取代通用文案 */
  note?: string;
  a: TennisDrawPlayer;
  b: TennisDrawPlayer;
  /** 賽果(Tim 賽後手 curate · 同 CPBL)· 驅動引擎/用戶公開戰績 · 沒設 = 待結算 */
  finalResult?: TennisFinalResult;
};

export type TennisFinalResult = {
  /** 贏的那邊(a / b) */
  winner: TennisPick;
  /** 比分字串(選填 · 例 "6-4 7-6") */
  score?: string;
  /** 結算時戳 ISO */
  settledAt?: string;
  /** 退賽 / walkover 決定(自動結算來自 ESPN retired flag)· 贏家=晉級方 · 顯示誠實標「退賽」 */
  retired?: boolean;
};

// 兩向 pick(同 predictions)· 在這裡 re-declare 避免 lib 互相 import 成環(predictions 是 client)。
export type TennisPick = "a" | "b";

// ⬇️ 真實賽程(從台灣運彩 curate)· 由 lib/tennis/draw-data 注入,保持本檔=純邏輯。
import { TENNIS_DRAW as CURATED_DRAW } from "@/lib/tennis/draw-data";
import { matchTennisResult } from "@/lib/tennis/results";

// 運彩時間字串只帶「月/日 時:分」、不帶年 → 賽季年在此定。 換季(2027 溫網等)curate 新賽程時
// bump 這一個值即可。 🔴 必須宣告在下方 TENNIS_DRAW augment 之前 —— augment 在 module load 就呼叫
// matchStartISO(它讀這個值)· const 不 hoist(TDZ)· 放後面會「Cannot access before initialization」。
const TENNIS_SEASON_YEAR = 2026;

// 🎾 網球賽果自動結算(同 CPBL「鏡像 + on-load 配對 + 手動優先」紀律)──────────────────
//   沒有手動 finalResult 的場 → 用 ESPN 官方鏡像(lib/tennis-results.json · 英文名 en 比對)補上賽果。
//   🔴 手動 finalResult 永遠優先(Tim curate 的一字不動)· 對不到一律退手動(維持 pending · 寧缺勿錯)。
//   display 仍是運彩中文名(zh)· 自動結算只用英文名當對帳 key,不碰顯示。 純函式 · server-safe
//   (JSON 靜態 import)。 上線前已驗:對「已手動結算的 27 場」自動配對 27/27 同贏家同比分(零分歧)。
export const TENNIS_DRAW: TennisMatch[] = CURATED_DRAW.map((m) => {
  if (m.finalResult) return m; // 手動優先
  // 賽事 + 開賽日一起傳 → 防同兩人在別賽事 / 別年撞名結錯(matchStartISO 不可解析時只靠賽事閘)。
  const auto = matchTennisResult(m.a.en, m.b.en, m.tournament, matchStartISO(m));
  return auto
    ? {
        ...m,
        finalResult: {
          winner: auto.winner,
          score: auto.score || undefined,
          retired: auto.retired || undefined,
        },
      }
    : m; // 對不到 → 維持原樣(pending)
});

/** 查一場(運彩 tn- 場次編號)· 詳情頁用。 */
export function getTennisMatch(id: string): TennisMatch | undefined {
  return TENNIS_DRAW.find((m) => m.id === id);
}

/** 這場能不能誠實開盤? 非 live + 兩人都有 rank + 信心都非 low。 */
export function lineable(m: TennisMatch): boolean {
  return (
    !m.live &&
    m.a.rank != null &&
    m.b.rank != null &&
    m.a.confidence !== "low" &&
    m.b.confidence !== "low"
  );
}

export type DrawLine = { aWin: number; bWin: number; pick: "a" | "b" };

/** 引擎兩向勝率(整數 · 相加 100)· 走 engine.ts 同一套(零 drift)· 不可開盤 → null。 */
export function drawLine(m: TennisMatch): DrawLine | null {
  if (!lineable(m)) return null;
  const pred = predictTennis(
    { overall: ratingFromRank(m.a.rank as number) },
    { overall: ratingFromRank(m.b.rank as number) },
    m.surface,
  );
  const d = toDisplayPercents(pred);
  return { aWin: d.aWin, bWin: d.bWin, pick: enginePickOf(pred) };
}

export type DrawGroup = {
  tournament: string;
  tour: "atp" | "wta";
  surface: TennisSurface;
  matches: TennisMatch[];
};

/** 依「巡迴賽 + 賽事」分組(保留出現順序)· board 用。 */
export function drawGroups(): DrawGroup[] {
  const map = new Map<string, DrawGroup>();
  for (const m of TENNIS_DRAW) {
    const key = `${m.tour}|${m.tournament}`;
    let g = map.get(key);
    if (!g) {
      g = { tournament: m.tournament, tour: m.tour, surface: m.surface, matches: [] };
      map.set(key, g);
    }
    g.matches.push(m);
  }
  return [...map.values()];
}

/** 看板統計:總場數 / 引擎開盤場數(誠實揭露覆蓋率)。 */
export function drawCounts(): { total: number; lined: number } {
  const total = TENNIS_DRAW.length;
  const lined = TENNIS_DRAW.filter(lineable).length;
  return { total, lined };
}


/** 運彩時間字串 → 台北 ISO(可解析的 "M/D HH:MM" 才回 · 「即將開始 / 現場 / 無時間」→ null)。
 *  賽前鎖定的時間閘:只有「有明確未來開賽時戳」的場才開放押注(押了不可改 · 先鎖後結)。 */
export function matchStartISO(m: TennisMatch): string | null {
  const mm = m.time.match(/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/);
  if (!mm) return null;
  const [, mo, d, h, mi] = mm;
  const pad = (s: string) => s.padStart(2, "0");
  return `${TENNIS_SEASON_YEAR}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00+08:00`;
}

/** 這場可不可以「賽前鎖定押注」? 引擎有開盤 + 有明確開賽時戳(client 端再判未開賽)。 */
export function bettable(m: TennisMatch): string | null {
  if (!lineable(m)) return null;
  return matchStartISO(m);
}

/** 引擎當初看好邊(lineable 場 · 給「你 vs 引擎」對照 + 引擎公開戰績)· id → "a"/"b"。 */
export function tennisEnginePicks(): Record<string, TennisPick> {
  const out: Record<string, TennisPick> = {};
  for (const m of TENNIS_DRAW) {
    const line = drawLine(m);
    if (line) out[m.id] = line.pick;
  }
  return out;
}

/** 已結算賽果(Tim curate 的 finalResult)· id → { outcome, startISO }· 給用戶押注對帳。 */
export function tennisResults(): Record<string, { outcome: TennisPick; startISO: string }> {
  const out: Record<string, { outcome: TennisPick; startISO: string }> = {};
  for (const m of TENNIS_DRAW) {
    if (m.finalResult) {
      out[m.id] = {
        outcome: m.finalResult.winner,
        startISO: matchStartISO(m) ?? m.finalResult.settledAt ?? "",
      };
    }
  }
  return out;
}

export type TennisEngineRecord = {
  /** 已結算且引擎當初有開盤的場 */
  n: number;
  hits: number; // PROVED
  misses: number; // DIVERGED
  rate: number | null;
  /** 引擎有開盤、但賽果還沒 curate(待對帳) */
  pending: number;
};

/** 引擎公開戰績(含輸 · 賽前開盤 vs 賽後賽果)· 純函式 · 賽果空 → 全 pending(誠實 N=0)。 */
export function gradeTennisEngine(): TennisEngineRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  for (const m of TENNIS_DRAW) {
    const line = drawLine(m);
    if (!line) continue; // 沒開盤的場不進引擎戰績
    if (!m.finalResult) {
      pending += 1;
      continue;
    }
    n += 1;
    if (line.pick === m.finalResult.winner) hits += 1;
  }
  return {
    n,
    hits,
    misses: n - hits,
    rate: n > 0 ? Math.round((hits / n) * 100) : null,
    pending,
  };
}

// ── 你的網球戰績(純函式 · server-safe 單一真相)──────────────────────────────
// 從 lib/tennis/predictions 搬上來(那支 import 了 browser client → 不能進 server component)。
// predictions.ts 仍 re-export 給既有 client 卡用 —— 一份算法兩處共用,零 drift。
// 用在:TennisRecordCard(client · /member + /tennis 本人)+ ProfileView(server · /u 公開檔)。

/** 一筆網球押注(兩向 a/b · 賽前鎖定時戳)。 */
export type TennisPickRow = { matchId: string; pick: TennisPick; ts: string };

export type TennisRecord = {
  /** 已結算場數(先鎖後結 · 不含 pending) */
  n: number;
  hits: number;
  misses: number;
  rate: number | null;
  /** 還沒結算 */
  pending: number;
  /** 開賽後才押 · 誠實剔除(看得見) */
  late: number;
  // ── 你 vs 引擎(同批已結算、且引擎當初有開盤的場)──
  vsN: number;
  vsYouHits: number;
  vsEngineHits: number;
  vsYouRate: number | null;
  vsEngineRate: number | null;
};

/**
 * 兩向對帳(A 勝 / B 勝)· **先鎖後結**:押注時間 ≥ 開賽 → 不計入(同棒球 / 足球)。
 * results:{ [matchId]: { outcome, startISO } }(= tennisResults())· enginePicks:matchId → 引擎當初看好邊
 * (= tennisEnginePicks())。 純函式 deterministic。 🔴 含輸:✕ 跟 ✓ 一樣進分母。
 */
export function gradeTennisPicks(
  picks: TennisPickRow[],
  results: Record<string, { outcome: TennisPick; startISO: string }>,
  enginePicks: Record<string, TennisPick> = {},
): TennisRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  let late = 0;
  let vsN = 0;
  let vsYouHits = 0;
  let vsEngineHits = 0;
  for (const p of picks) {
    const r = results[p.matchId];
    if (!r) {
      pending += 1;
      continue;
    }
    const t = Date.parse(p.ts);
    const k = Date.parse(r.startISO);
    if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) {
      late += 1;
      continue;
    }
    n += 1;
    const youHit = p.pick === r.outcome;
    if (youHit) hits += 1;
    const ePick = enginePicks[p.matchId];
    if (ePick === "a" || ePick === "b") {
      vsN += 1;
      if (youHit) vsYouHits += 1;
      if (ePick === r.outcome) vsEngineHits += 1;
    }
  }
  return {
    n,
    hits,
    misses: n - hits,
    rate: n > 0 ? Math.round((hits / n) * 100) : null,
    pending,
    late,
    vsN,
    vsYouHits,
    vsEngineHits,
    vsYouRate: vsN > 0 ? Math.round((vsYouHits / vsN) * 100) : null,
    vsEngineRate: vsN > 0 ? Math.round((vsEngineHits / vsN) * 100) : null,
  };
}
