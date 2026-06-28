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
  // ── 2026-06-28 美國公開賽 R3(週日清晨台北 · Tim 運彩截圖 curate · 照運彩名字原封不動)──
  //   R3 對手仍多認不出 / 查不到排名 → 誠實不硬開引擎線(照樣可押)· 女單首度上架(同樣不硬開)。
  {
    id: "bd-2510",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/28 05:05",
    note: "基達姆比認得(排名 20),但沖本優大我們查不到可靠排名 —— 不硬開假盤,照樣可押。",
    a: { zh: "沖本優大", en: "Yudai Okimoto", rank: null, confidence: "low" },
    b: { zh: "基達姆比", en: "Kidambi Srikanth", rank: 20, confidence: "high" },
    // 基達姆比 2-1 擊敗沖本優大晉級(引擎未開盤 · 沖本優大查不到排名 · 用戶押注照對帳)。
    finalResult: { winner: "b", score: "22-20 15-21 21-19", settledAt: "2026-06-28" },
  },
  {
    id: "bd-2511",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/28 05:55",
    note: "蘇力揚是台灣選手,但對手喬漢我們查不到可靠排名 —— 不硬開假盤,照樣可押。",
    a: { zh: "蘇力揚", en: "Su Li-yang", rank: 65, confidence: "medium" },
    b: { zh: "羅納克.喬漢", en: "Rounak Chouhan", rank: null, confidence: "low" },
    // 蘇力揚 2-0 擊敗喬漢晉級(引擎未開盤 · 喬漢查不到排名 · 用戶押注照對帳)。
    finalResult: { winner: "a", score: "21-17 21-19", settledAt: "2026-06-28" },
  },
  {
    id: "bd-2508",
    tour: "ws",
    tournament: "美國公開賽 · 女單",
    time: "6/28 03:25",
    note: "女單兩位都是我們查不到可靠排名的國際選手 —— 不硬開假盤,照樣可押。",
    a: { zh: "克里絲托芙森", en: "?", rank: null, confidence: "low" },
    b: { zh: "德維卡.西哈格", en: "?", rank: null, confidence: "low" },
  },
  {
    id: "bd-2509",
    tour: "ws",
    tournament: "美國公開賽 · 女單",
    time: "6/28 03:30",
    note: "女單兩位都是我們查不到可靠排名的國際選手 —— 不硬開假盤,照樣可押。",
    a: { zh: "納爾班托娃", en: "?", rank: null, confidence: "low" },
    b: { zh: "陳瑞秋", en: "?", rank: null, confidence: "low" },
  },
  // ── 2026-06-27 美國公開賽 R2(週六清晨台北 · 蘇力揚 / 喬漢 R1 晉級續戰)──
  //   R2 對手多是我們查不到可靠排名的國際選手 → 誠實不硬開引擎線(照樣可押 · 你的判斷比引擎值錢)。
  //   女單仍無一位有把握辨識 → 不上(同 R1 · 寧缺勿錯)。
  {
    id: "bd-2503",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/27 07:40",
    note: "蘇力揚是台灣選手,但對手楊燦我們查不到可靠排名 —— 不硬開假盤,照樣可押。",
    a: { zh: "蘇力揚", en: "Su Li-yang", rank: 65, confidence: "medium" },
    b: { zh: "楊燦", en: "?", rank: null, confidence: "low" },
    // 蘇力揚 2-0 擊敗楊燦晉級(引擎未開盤 · 認不出楊燦 · 用戶押注照對帳)。
    finalResult: { winner: "a", score: "21-19 21-8", settledAt: "2026-06-27" },
  },
  {
    id: "bd-2500",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/27 06:50",
    note: "兩位都是我們查不到可靠排名的國際選手(喬漢 R1 淘汰周天成)—— 不硬開假盤,照樣可押。",
    a: { zh: "M.西爾伯曼", en: "?", rank: null, confidence: "low" },
    b: { zh: "羅納克.喬漢", en: "?", rank: null, confidence: "low" },
    // 喬漢 2-0 擊敗西爾伯曼晉級(引擎未開盤 · 兩位都認不出 · 用戶押注照對帳)。
    finalResult: { winner: "b", score: "23-21 21-11", settledAt: "2026-06-27" },
  },
  // ── 2026-06-26 美國公開賽 R1(已完場 · 賽後對帳 · Tim 截圖比分手 curate)──
  {
    id: "bd-2546",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/26 08:00",
    a: { zh: "基達姆比", en: "Kidambi Srikanth", rank: 20, confidence: "high" },
    b: { zh: "李梓嘉", en: "Lee Zii Jia", rank: 7, confidence: "high" },
    // 🔴 引擎賽前看好李梓嘉(排名 7 > 20)· 結果基達姆比 2-0 爆冷 → DIVERGED(引擎沒中 · 誠實掛 ·
    //    羽球誠實天花板 ~63%,本就有 1/3 多翻盤空間 · 含輸照算)。 羽球引擎第一場結算。
    finalResult: { winner: "a", score: "21-14 21-13", settledAt: "2026-06-27" },
  },
  {
    id: "bd-2541",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/26 06:30",
    note: "周天成是世界前段的台灣一哥,但對手是我們認不出、查不到排名的資格賽選手 —— 寧可不開,也不開假盤。",
    a: { zh: "羅納克.喬漢", en: "?", rank: null, confidence: "low" },
    b: { zh: "周天成", en: "Chou Tien-chen", rank: 12, confidence: "high" },
    // 周天成 0-2 不敵喬漢(引擎未開盤 · 不進引擎戰績,但用戶押注照對帳)。
    finalResult: { winner: "a", score: "21-17 26-24", settledAt: "2026-06-27" },
  },
  {
    id: "bd-2540",
    tour: "ms",
    tournament: "美國公開賽 · 男單",
    time: "6/26 06:20",
    note: "蘇力揚是台灣選手,但對手我們認不出、查不到排名 —— 不硬開假盤。",
    a: { zh: "柳泰斌", en: "?", rank: null, confidence: "low" },
    b: { zh: "蘇力揚", en: "Su Li-yang", rank: 65, confidence: "medium" },
    // 蘇力揚 2-1 逆轉柳泰斌晉級(引擎未開盤 · 用戶押注照對帳)。
    finalResult: { winner: "b", score: "15-21 21-9 22-20", settledAt: "2026-06-27" },
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

// ── 賽前鎖定押注 + 你的羽球戰績(純函式 · server-safe 單一真相 · 鏡網球)─────────────

// 運彩時間字串只帶「月/日 時:分」、不帶年 → 賽季年在此定(換季 bump 這一個值)。
const BADMINTON_SEASON_YEAR = 2026;

/** 運彩時間字串 → 台北 ISO(可解析的 "M/D HH:MM" 才回 · 相對時間 / 進行中 / 無時戳 → null)。
 *  賽前鎖定的時間閘:只有「有明確未來開賽時戳」的場才開放押注(押了不可改 · 先鎖後結)。 */
export function matchStartISO(m: BadmintonMatch): string | null {
  const mm = m.time.match(/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/);
  if (!mm) return null;
  const [, mo, d, h, mi] = mm;
  const pad = (s: string) => s.padStart(2, "0");
  return `${BADMINTON_SEASON_YEAR}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00+08:00`;
}

/** 這場可不可以「賽前鎖定押注」? 還沒結算 + 有明確開賽時戳(client 端再判未開賽)。
 *  🔴 Tim 鐵律(全運動一致):能上架就能押 —— 引擎開不開得出線,不影響可不可押(認不出的場、
 *  你的判斷比引擎值錢)。 只擋:已結算、無可解析開賽時戳。 */
export function bettable(m: BadmintonMatch): string | null {
  if (m.finalResult) return null;
  return matchStartISO(m);
}

/** 引擎當初看好邊(lineable 場)· 給「你 vs 引擎」對照 + 引擎公開戰績 · id → "a"/"b"。 */
export function badmintonEnginePicks(): Record<string, BadmintonPick> {
  const out: Record<string, BadmintonPick> = {};
  for (const m of BADMINTON_DRAW) {
    const line = drawLine(m);
    if (line) out[m.id] = line.pick;
  }
  return out;
}

/** 已結算賽果(Tim curate 的 finalResult)· id → { outcome, startISO }· 給用戶押注對帳。 */
export function badmintonResults(): Record<
  string,
  { outcome: BadmintonPick; startISO: string }
> {
  const out: Record<string, { outcome: BadmintonPick; startISO: string }> = {};
  for (const m of BADMINTON_DRAW) {
    if (m.finalResult) {
      out[m.id] = {
        outcome: m.finalResult.winner,
        startISO: matchStartISO(m) ?? m.finalResult.settledAt ?? "",
      };
    }
  }
  return out;
}

/** 一筆羽球押注(兩向 a/b · 賽前鎖定時戳)。 */
export type BadmintonPickRow = { matchId: string; pick: BadmintonPick; ts: string };

export type BadmintonRecord = {
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
 * 兩向對帳(A 勝 / B 勝)· **先鎖後結**:押注時間 ≥ 開賽 → 不計入(同棒球 / 足球 / 網球)。
 * 純函式 deterministic。 🔴 含輸:✕ 跟 ✓ 一樣進分母。
 */
export function gradeBadmintonPicks(
  picks: BadmintonPickRow[],
  results: Record<string, { outcome: BadmintonPick; startISO: string }>,
  enginePicks: Record<string, BadmintonPick> = {},
): BadmintonRecord {
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
