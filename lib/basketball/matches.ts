import {
  predictBasketball,
  toDisplayPercents,
  enginePickOf,
  type BasketballPick,
} from "@/lib/basketball/engine";
import { netRatingOf } from "@/lib/basketball/rating";

// ── ZONE 27 · 籃球真實賽程(台灣運彩在賣的場 · 名字一字不改)──────────────────────────
// 同 CPBL/足球/網球/羽球/MMA 模式:運彩 = 覆蓋目錄,只查它賣哪些場 → 用自己的效率引擎跑 → 只秀
// 自己機率,絕不爬盤口、絕不顯示賠率。 隔離在 lib/basketball(不碰其他運動)。 v0.1 純讀不接押注
//(同羽球當初:新運動帳本隔離、押注 + personal 五面下一波接,寧可慢、不污染既有戰績/不留幽靈 pending)。
//
// 🔴 米其林克制:認不出 / 查不到隊伍數據(rating.ts 沒有)→ 引擎不硬開,誠實標「算不出」· 照樣是真賽事。
//   主客有別(籃球有主場優勢)→ pick = home/away(同棒球 · 之後接押注直接進共享 predictions 表)。
//   id = bk- + 運彩場次編號(可追溯)· 賽果 Tim 賽後手 curate。 v0.1 = WNBA(NBA 休季,開打前擴)。
// ─────────────────────────────────────────────────────

export type BasketballTeam = {
  /** 運彩顯示名(一字不改) */
  zh: string;
  /** 英文隊名(辨識 + 對帳 key) */
  en: string;
  /** rating.ts 的 slug key(查淨得分 · 查不到 → 引擎不開) */
  key: string;
};

export type BasketballFinalResult = {
  /** 贏的那邊(主 / 客) */
  winner: BasketballPick;
  /** 比分(選填 · 例「88:79」) */
  score?: string;
  /** 結算時戳 */
  settledAt?: string;
};

export type BasketballGame = {
  /** bk- + 運彩場次編號 */
  id: string;
  league: "WNBA" | "NBA";
  /** 運彩賽事名 */
  tournament: string;
  /** 運彩時間字串(台北 · 例「6/29 07:00」) */
  time: string;
  /** 主隊(有主場優勢那邊) */
  home: BasketballTeam;
  /** 客隊 */
  away: BasketballTeam;
  /** 賽果(Tim 賽後手 curate)· 沒設 = 待結算 */
  finalResult?: BasketballFinalResult;
};

// ⬇️ 真實賽程(從台灣運彩 curate · 2026-06-29 WNBA 4 場 · 運彩截圖:上=客、下=主)。
export const BASKETBALL_GAMES: BasketballGame[] = [
  {
    id: "bk-303",
    league: "WNBA",
    tournament: "WNBA",
    time: "6/29 02:00",
    away: { zh: "明尼蘇達山貓", en: "Minnesota Lynx", key: "minnesota-lynx" },
    home: { zh: "達拉斯飛翼", en: "Dallas Wings", key: "dallas-wings" },
  },
  {
    id: "bk-305",
    league: "WNBA",
    tournament: "WNBA",
    time: "6/29 03:00",
    away: { zh: "波特蘭火焰", en: "Portland Fire", key: "portland-fire" },
    home: { zh: "華盛頓神秘", en: "Washington Mystics", key: "washington-mystics" },
  },
  {
    id: "bk-306",
    league: "WNBA",
    tournament: "WNBA",
    time: "6/29 04:00",
    away: { zh: "拉斯維加斯王牌", en: "Las Vegas Aces", key: "las-vegas-aces" },
    home: { zh: "芝加哥天空", en: "Chicago Sky", key: "chicago-sky" },
  },
  {
    id: "bk-307",
    league: "WNBA",
    tournament: "WNBA",
    time: "6/29 07:00",
    away: { zh: "紐約自由", en: "New York Liberty", key: "new-york-liberty" },
    home: { zh: "金州瓦爾基里", en: "Golden State Valkyries", key: "golden-state-valkyries" },
  },
];

/** 查一場(bk- 場次編號)。 */
export function getBasketballGame(id: string): BasketballGame | undefined {
  return BASKETBALL_GAMES.find((g) => g.id === id);
}

/** 這場能不能誠實開盤? 兩隊都查得到淨得分(認得出)。 */
export function lineable(g: BasketballGame): boolean {
  return netRatingOf(g.home.key) !== null && netRatingOf(g.away.key) !== null;
}

export type DrawLine = { homeWin: number; awayWin: number; pick: BasketballPick };

/** 引擎兩向勝率(整數 · 相加 100)· 走 engine.ts 同一套(零 drift)· 不可開盤 → null。 */
export function drawLine(g: BasketballGame): DrawLine | null {
  const h = netRatingOf(g.home.key);
  const a = netRatingOf(g.away.key);
  if (h === null || a === null) return null;
  const pred = predictBasketball(h, a);
  const d = toDisplayPercents(pred);
  return { homeWin: d.homeWin, awayWin: d.awayWin, pick: enginePickOf(pred) };
}

/** 看板統計:總場數 / 引擎開盤場數(誠實揭露覆蓋率)。 */
export function drawCounts(): { shown: number; lined: number } {
  const shown = BASKETBALL_GAMES.length;
  const lined = BASKETBALL_GAMES.filter(lineable).length;
  return { shown, lined };
}

// 運彩時間字串只帶「月/日 時:分」· 賽季年在此定。
const BASKETBALL_SEASON_YEAR = 2026;

/** 運彩時間字串 → 台北 ISO(可解析的 "M/D HH:MM" 才回)· 賽前鎖定時間閘(之後接押注用)。 */
export function matchStartISO(g: BasketballGame): string | null {
  const mm = g.time.match(/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/);
  if (!mm) return null;
  const [, mo, d, h, mi] = mm;
  const pad = (s: string) => s.padStart(2, "0");
  return `${BASKETBALL_SEASON_YEAR}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00+08:00`;
}

/** 引擎當初看好邊(lineable 場)· id → "home"/"away"。 */
export function basketballEnginePicks(): Record<string, BasketballPick> {
  const out: Record<string, BasketballPick> = {};
  for (const g of BASKETBALL_GAMES) {
    const line = drawLine(g);
    if (line) out[g.id] = line.pick;
  }
  return out;
}

export type BasketballEngineRecord = {
  n: number;
  hits: number;
  misses: number;
  rate: number | null;
  pending: number;
};

/** 引擎公開戰績(含輸 · 賽前開盤 vs 賽後賽果)· 純函式 · 賽果空 → 全 pending(誠實 N=0)。 */
export function gradeBasketballEngine(): BasketballEngineRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  for (const g of BASKETBALL_GAMES) {
    const line = drawLine(g);
    if (!line) continue; // 沒開盤的場不進引擎戰績
    if (!g.finalResult) {
      pending += 1;
      continue;
    }
    n += 1;
    if (line.pick === g.finalResult.winner) hits += 1;
  }
  return {
    n,
    hits,
    misses: n - hits,
    rate: n > 0 ? Math.round((hits / n) * 100) : null,
    pending,
  };
}
