// ── ZONE 27 · 氣勢反轉偵測(現實親手打臉「跟氣勢押」)· server-side ──────────────
// 從官方賽果鏡像(lib/cpbl-results.json · 同 matches.ts 那份 · GitHub Action 每 3h 更新)
// 自動撈出最近一組「同兩隊、隔幾天、贏家完全換邊」的戲劇性反轉,當成 /calibration 的活證物。
//
// 為什麼這頁需要它:/calibration 用文字講「沒有神準引擎 · 57% 天花板 · 別跟氣勢」——
// 這支把抽象論點換成一筆真資料(昨天 9:0、今天 0:7,同兩隊)。 概念同 R222 白話判決:
// 把校準護城河從統計層降到「一眼就懂」。
//
// 🔴 誠實紅線(命門):這證物**不主張我們預測到了**任何結果 —— 只說「昨天的比分對今天
//   幾乎沒有預測力」。 純官方賽果、0 引擎宣稱、0 cherry-pick(規則固定、自動取最近最戲劇的
//   一組 · 沒有就整塊不顯示)· 平手不算反轉。 任何「我們早就知道」式宣稱都會毀掉 disclosure。
//
// 純讀打包好的 JSON(0 fetch / 0 DB / 0 migration)· 同步可在 server component 直接呼叫。
// ─────────────────────────────────────────────────────

import cpblAutoResults from "./cpbl-results.json";

// 官方賽果原始列(穩定隊碼 · 同 matches.ts 的 CpblAutoGame)。
type RawGame = {
  date: string; // YYYY-MM-DD(官方賽程日)
  homeCode: string;
  homeScore: number;
  awayCode: string;
  awayScore: number;
  result: "home" | "away" | "tie";
  endedAt: string;
};

// 隊碼 → 站上短隊名(同站內慣例 · 用碼比對串字穩 · 不靠官方全名變體)。
const SHORT: Record<string, string> = {
  AJL011: "樂天",
  ACN011: "中信",
  ADD011: "統一",
  AKP011: "台鋼",
  AAA011: "味全",
  AEO011: "富邦",
};

// 一場(對固定 A/B 兩隊的視角 · 給卡片用固定欄位,讓金色「贏家」在兩列之間看得出換邊)。
export type ReversalLeg = {
  date: string; // YYYY-MM-DD
  monthDay: string; // "M/D"
  aScore: number; // teamA 這場得分
  bScore: number; // teamB 這場得分
  winner: "A" | "B";
};

export type MomentumReversal = {
  teamA: string; // 較早那場的贏家(固定左欄)
  teamB: string; // 另一隊(固定右欄)
  daysApart: number;
  later: ReversalLeg; // 較近(卡片放上面)
  earlier: ReversalLeg; // 較早(放下面)
};

const MAX_DAYS = 3; // 兩場相隔 ≤ 3 天(同一段連續對戰才算「氣勢」)
const MIN_COMBINED = 8; // 合計分差 ≥ 8 才夠戲劇(排掉膠著互換 · 守證物份量)
const RECENT_DAYS = 24; // 較近那場要在「資料最新日」往前 24 天內(保持「最近」感)

function md(iso: string): string {
  const p = iso.split("-");
  return p.length === 3 ? `${Number(p[1])}/${Number(p[2])}` : iso;
}
function dayDiff(a: string, b: string): number {
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (Number.isNaN(da) || Number.isNaN(db)) return Number.POSITIVE_INFINITY;
  return Math.round(Math.abs(db - da) / 86400000);
}

/** 最近一組戲劇性「氣勢反轉」· 找不到符合門檻的 → null(卡片整塊隱藏 · graceful)。 */
export function getLatestMomentumReversal(): MomentumReversal | null {
  const raw = ((cpblAutoResults as { games?: RawGame[] }).games ?? []) as RawGame[];

  // 標準化:只取分出勝負、隊碼認得、比分有效的場 → {贏碼, 輸碼, 贏分, 輸分, 分差, 配對 key}。
  type G = {
    date: string;
    winCode: string;
    loseCode: string;
    winScore: number;
    loseScore: number;
    margin: number;
    pair: string; // sorted(homeCode,awayCode) · 吃掉主客方向
  };
  const games: G[] = [];
  let maxDate = "";
  for (const x of raw) {
    if (x.result !== "home" && x.result !== "away") continue; // 平手不算反轉
    if (!SHORT[x.homeCode] || !SHORT[x.awayCode]) continue;
    if (!Number.isFinite(x.homeScore) || !Number.isFinite(x.awayScore)) continue;
    const homeWon = x.result === "home";
    const winScore = homeWon ? x.homeScore : x.awayScore;
    const loseScore = homeWon ? x.awayScore : x.homeScore;
    if (winScore < loseScore) continue; // 防呆(result 與比分矛盾 → skip)
    games.push({
      date: x.date,
      winCode: homeWon ? x.homeCode : x.awayCode,
      loseCode: homeWon ? x.awayCode : x.homeCode,
      winScore,
      loseScore,
      margin: winScore - loseScore,
      pair: [x.homeCode, x.awayCode].sort().join("|"),
    });
    if (x.date > maxDate) maxDate = x.date;
  }
  if (!maxDate) return null;

  const byPair = new Map<string, G[]>();
  for (const g of games) {
    const arr = byPair.get(g.pair);
    if (arr) arr.push(g);
    else byPair.set(g.pair, [g]);
  }

  // 在每對隊伍內找「相隔 ≤ MAX_DAYS、贏家換邊、合計分差 ≥ MIN_COMBINED」的兩場 ·
  // 取「較近那場最新」優先(同日取合計分差大的)。
  let best: { earlier: G; later: G; daysApart: number; combined: number } | null =
    null;
  for (const arr of byPair.values()) {
    arr.sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i];
        const b = arr[j]; // a 早 · b 晚
        const gap = dayDiff(a.date, b.date);
        if (gap > MAX_DAYS) continue;
        if (a.winCode === b.winCode) continue; // 要「換邊贏」才是反轉
        const combined = a.margin + b.margin;
        if (combined < MIN_COMBINED) continue;
        if (dayDiff(b.date, maxDate) > RECENT_DAYS) continue; // 較近那場要夠新
        if (
          !best ||
          b.date > best.later.date ||
          (b.date === best.later.date && combined > best.combined)
        ) {
          best = { earlier: a, later: b, daysApart: gap, combined };
        }
      }
    }
  }
  if (!best) return null;

  // 固定 A/B:teamA = 較早那場的贏家(左欄)· teamB = 另一隊(右欄)。 反轉 → 較近那場 teamB 贏。
  const { earlier, later, daysApart } = best;
  const teamA = SHORT[earlier.winCode];
  const teamB = SHORT[earlier.loseCode];
  return {
    teamA,
    teamB,
    daysApart,
    // 較早:teamA 贏(aScore = 贏分)
    earlier: {
      date: earlier.date,
      monthDay: md(earlier.date),
      aScore: earlier.winScore,
      bScore: earlier.loseScore,
      winner: "A",
    },
    // 較近:teamB 贏(換邊)→ teamA 這場拿輸分、teamB 拿贏分
    later: {
      date: later.date,
      monthDay: md(later.date),
      aScore: later.loseScore,
      bScore: later.winScore,
      winner: "B",
    },
  };
}
