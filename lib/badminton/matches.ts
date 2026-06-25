import {
  predictBadminton,
  toDisplayPercents,
  enginePickOf,
} from "@/lib/badminton/engine";
import { ratingFromRank } from "@/lib/badminton/rating";

// ── ZONE 27 · 羽球真實賽程(台灣運彩在賣的場 · 名字一字不改)──────────────────────────
// CPBL / 網球模式:Tim 從台灣運彩看板手 curate 真實對戰(運彩 = 覆蓋目錄,我們只查它賣哪些場 →
// 用自己引擎跑 → 只秀自己機率,絕不爬盤口、絕不顯示賠率)。 球員實力分由現時 BWF 世界排名換算
// (lib/badminton/rating · 誠實估計)→ 引擎算兩向勝率。 隔離在 lib/badminton(不碰棒球 / 足球 /
// 網球)· v0.1 純讀、不接押注(新運動的帳本隔離另開一波做,寧可慢、不污染既有戰績)。
//
// 🔴 米其林式克制(本檔靈魂 · 同網球):不是每場都開盤。 球員認不出 / 排名查不到(信心 low)→
//   不硬開,誠實標「覆蓋建置中」。 賭場什麼都敢開,我們只開算得出的。 美國公開賽這一輪運彩賣的場
//   絕大多數是我們認不出的資格賽選手 —— 我們只把「敢負責」的場放上桌,其餘不上,也不假裝會算。
//   名字一律用運彩的(zh)· id = bd- + 運彩場次編號(可追溯)。
// ─────────────────────────────────────────────────────

export type BadmintonConfidence = "high" | "medium" | "low";

/** 男單 / 女單(羽球無和局、兩向 · 同網球 atp/wta 的角色)。 */
export type BadmintonTour = "ms" | "ws";

export type BadmintonDrawPlayer = {
  /** 運彩顯示名(一字不改) */
  zh: string;
  /** 英文名(辨識用 · 認不出 = "?") */
  en: string;
  /** 現時 BWF 世界排名(估計種子分來源)· null = 查不到 → 不開盤 */
  rank: number | null;
  confidence: BadmintonConfidence;
};

export type BadmintonPick = "a" | "b";

export type BadmintonFinalResult = {
  /** 贏的那邊(a / b) */
  winner: BadmintonPick;
  /** 比分字串(選填 · 例 "21-18 21-15") */
  score?: string;
  /** 結算時戳 ISO */
  settledAt?: string;
  /** 退賽 / walkover(贏家=晉級方 · 顯示誠實標「退賽」) */
  retired?: boolean;
};

export type BadmintonMatch = {
  /** bd- + 運彩場次編號 */
  id: string;
  tour: BadmintonTour;
  /** 運彩賽事名 */
  tournament: string;
  /** 運彩時間字串(台北 · 例「6/26 08:00」) */
  time: string;
  /** 進行中(現場)· 引擎只做賽前不追 live → 不開盤 */
  live?: boolean;
  /** 不開盤時的誠實說明(取代通用「覆蓋建置中」文案) */
  note?: string;
  a: BadmintonDrawPlayer;
  b: BadmintonDrawPlayer;
  /** 賽果(Tim 賽後手 curate · 同 CPBL / 網球)· 沒設 = 待結算 */
  finalResult?: BadmintonFinalResult;
};

// 運彩看板誠實揭露用:這一輪運彩實際列的場數(美國公開賽男單 8 / 女單 8 · 截圖標頭「(8)」)。
// 我們只把「敢負責」的挑上桌(下方 DRAW)· 兩個數字一比 = 覆蓋率誠實攤開。
export const LISTED_MS = 8;
export const LISTED_WS = 8;

// ⬇️ 真實賽程(從台灣運彩 curate · 2026-06-26 美國公開賽 BWF Super 300)。
//   v0.1 只放男單我們挑得出的場:1 場兩位都認得 → 開引擎線;2 場台灣選手對上認不出的資格賽 →
//   誠實標「不硬開」。 女單 8 場目前無一位我們有把握辨識 → 這版先不上(寧缺勿錯)。
//   🔴 種子排名 = 編輯估計(BWF 公開排名 + 近況)· 不是官方數據 · 隨真實賽果更新(同網球種子分)。
export const BADMINTON_DRAW: BadmintonMatch[] = [
  {
    id: "bd-2546",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/26 08:00",
    a: { zh: "基達姆比", en: "Kidambi Srikanth", rank: 20, confidence: "high" },
    b: { zh: "李梓嘉", en: "Lee Zii Jia", rank: 7, confidence: "high" },
  },
  {
    id: "bd-2541",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/26 06:30",
    note: "周天成是世界前段的台灣一哥,但對手是我們認不出、查不到排名的資格賽選手 —— 寧可不開,也不開假盤。",
    a: { zh: "羅納克.喬漢", en: "?", rank: null, confidence: "low" },
    b: { zh: "周天成", en: "Chou Tien-chen", rank: 12, confidence: "high" },
  },
  {
    id: "bd-2540",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/26 06:20",
    note: "蘇力揚是台灣選手,但對手我們認不出、查不到排名 —— 不硬開假盤。",
    a: { zh: "柳泰斌", en: "?", rank: null, confidence: "low" },
    b: { zh: "蘇力揚", en: "Su Li-yang", rank: 65, confidence: "medium" },
  },
];

/** 查一場(bd- 場次編號)。 */
export function getBadmintonMatch(id: string): BadmintonMatch | undefined {
  return BADMINTON_DRAW.find((m) => m.id === id);
}

/** 這場能不能誠實開盤? 非 live + 兩人都有 rank + 信心都非 low。 */
export function lineable(m: BadmintonMatch): boolean {
  return (
    !m.live &&
    m.a.rank != null &&
    m.b.rank != null &&
    m.a.confidence !== "low" &&
    m.b.confidence !== "low"
  );
}

export type DrawLine = { aWin: number; bWin: number; pick: BadmintonPick };

/** 引擎兩向勝率(整數 · 相加 100)· 走 engine.ts 同一套(零 drift)· 不可開盤 → null。 */
export function drawLine(m: BadmintonMatch): DrawLine | null {
  if (!lineable(m)) return null;
  const pred = predictBadminton(
    { overall: ratingFromRank(m.a.rank as number) },
    { overall: ratingFromRank(m.b.rank as number) },
  );
  const d = toDisplayPercents(pred);
  return { aWin: d.aWin, bWin: d.bWin, pick: enginePickOf(pred) };
}

/** 看板統計:挑上桌的場數 / 引擎開盤場數(誠實揭露覆蓋率)。 */
export function drawCounts(): { shown: number; lined: number; listed: number } {
  const shown = BADMINTON_DRAW.length;
  const lined = BADMINTON_DRAW.filter(lineable).length;
  return { shown, lined, listed: LISTED_MS + LISTED_WS };
}

export type BadmintonEngineRecord = {
  /** 已結算且引擎當初有開盤的場 */
  n: number;
  hits: number;
  misses: number;
  rate: number | null;
  /** 引擎有開盤、但賽果還沒 curate(待對帳) */
  pending: number;
};

/** 引擎公開戰績(含輸 · 賽前開盤 vs 賽後賽果)· 純函式 · 賽果空 → 全 pending(誠實 N=0)。 */
export function gradeBadmintonEngine(): BadmintonEngineRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  for (const m of BADMINTON_DRAW) {
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
