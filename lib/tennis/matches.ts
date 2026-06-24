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
};

// ⬇️ 真實賽程(從台灣運彩 curate)· 由 lib/tennis/draw-data 注入,保持本檔=純邏輯。
import { TENNIS_DRAW } from "@/lib/tennis/draw-data";
export { TENNIS_DRAW };

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
