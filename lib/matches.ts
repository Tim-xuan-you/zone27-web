// ── ZONE 27 · Shared Match Data ────────────────────────
// 今日 CPBL 賽事 — placeholder until founder hand-curates real data.
// 未來會 transition 到 Supabase + 手工 ingestion(per
// [[zone27-coverage-philosophy]]: hand-curated by founder · NOT
// scraped from gambling platforms). The TypeScript interface
// below stays stable across both states — only the data source
// swaps. See docs/MANUAL-ONBOARDING.md for the future CPBL daily
// ingestion flow.

export type PitcherStats = {
  name: string;
  era: string;     // 防禦率
  k9: string;      // 每九局三振
  whip: string;    // 每局被上壘
  bb9: string;     // 每九局保送
  hr9: string;     // 每九局被全壘打
};

export type TeamSide = {
  name: string;
  en: string;
  pitcher: PitcherStats;
  recent: ("W" | "L")[];   // 近 5 場
  winRate: number;          // 0-100 AI 模擬勝率
};

export type ScoreBucket = {
  score: string;            // "4:3"
  probability: number;      // 0-100
};

export type Match = {
  id: string;
  league: "CPBL" | "MLB" | "NPB" | "NBA";
  date: string;             // "2026 · 05 · 19  ·  星期二"
  startTime: string;        // "18:35"
  venue: string;
  home: TeamSide;
  away: TeamSide;
  topScores: ScoreBucket[]; // AI 模擬的常見終局比分(top 5)
  aiConfidence: number;     // 0-100 模型對自己預測的信心
};

export const matches: Match[] = [
  // ── 2026-05-21 · 第一筆來自 cpbl.com.tw 真實截圖的 CPBL 資料 ──
  // 來源:Tim 截圖 cpbl.com.tw 一軍賽程 2026/05/21 比賽 #112
  //
  // 真實數據(從 screenshot 直接抓):
  //   · ERA  · 郭俊麟 4.98 · 李東洛 2.61
  //   · HR/9 · 郭俊麟 0.42(1 HR / 21.2 局 × 9)· 李東洛 0.29(1 HR / 31 局 × 9)
  //   · 場地 新莊 · 18:35 · 攝氏 28-30 度
  //
  // Estimated(CPBL stats.cpbl.com.tw 沒在投手 profile 公開 K/BB:
  //   · K/9   · 郭俊麟 ~7.0(146 km/h 球速 + 中等 ERA 推估)
  //              · 李東洛 ~8.5(150 km/h 球速 + 低 ERA 推估)
  //   · BB/9  · 郭俊麟 ~3.5(聯盟均值)· 李東洛 ~2.5(低 ERA 推估好控)
  //   · WHIP  · 推估自 K/9 + BB/9 + 被打擊率
  //   · recent 5 · CPBL 球隊近 5 場戰績 Tim 下次截圖時補
  //
  // 工程注記:這是 ZONE 27 第一筆真實 CPBL ingestion · 之前 3 場
  // (cpbl-260519-01/02/03)是 placeholder demo。當 Tim 下次給更
  // 完整 screenshot(K/BB scroll-right + 球隊近 5 場)· 升級此資料 +
  // 移除 estimate badge。
  {
    id: "cpbl-260521-01",
    league: "CPBL",
    date: "2026 · 05 · 21  ·  星期四",
    startTime: "18:35",
    venue: "新莊棒球場",
    home: {
      name: "富邦悍將",
      en: "GUARDIANS",
      pitcher: {
        name: "李東洛",
        era: "2.61",
        k9: "8.5",      // estimate
        whip: "1.30",   // estimate
        bb9: "2.5",     // estimate
        hr9: "0.29",    // 真實 · 1 HR / 31 局 × 9
      },
      recent: ["W", "W", "W", "L", "W"],  // estimate · 標 placeholder
      winRate: 60,
    },
    away: {
      name: "統一7-ELEVEn獅",
      en: "LIONS",
      pitcher: {
        name: "郭俊麟",
        era: "4.98",
        k9: "7.0",      // estimate
        whip: "1.42",   // estimate
        bb9: "3.5",     // estimate
        hr9: "0.42",    // 真實 · 1 HR / 21.2 局 × 9
      },
      recent: ["L", "L", "W", "L", "W"],  // estimate · 標 placeholder
      winRate: 40,
    },
    topScores: [
      { score: "3 : 4", probability: 16.8 },
      { score: "2 : 3", probability: 13.2 },
      { score: "3 : 5", probability: 11.1 },
      { score: "4 : 5", probability: 9.7 },
      { score: "2 : 4", probability: 9.2 },
    ],
    aiConfidence: 65,
  },
  {
    id: "cpbl-260519-01",
    league: "CPBL",
    date: "2026 · 05 · 19  ·  星期二",
    startTime: "18:35",
    venue: "台中洲際棒球場",
    home: {
      name: "中信兄弟",
      en: "BROTHERS",
      pitcher: {
        name: "德保拉",
        era: "2.84",
        k9: "9.2",
        whip: "1.08",
        bb9: "2.1",
        hr9: "0.7",
      },
      recent: ["W", "W", "L", "W", "L"],
      winRate: 62,
    },
    away: {
      name: "統一獅",
      en: "LIONS",
      pitcher: {
        name: "古林睿煬",
        era: "3.41",
        k9: "8.1",
        whip: "1.24",
        bb9: "2.8",
        hr9: "0.9",
      },
      recent: ["L", "W", "W", "L", "W"],
      winRate: 38,
    },
    topScores: [
      { score: "4 : 3", probability: 18.2 },
      { score: "5 : 3", probability: 14.7 },
      { score: "3 : 2", probability: 12.1 },
      { score: "5 : 4", probability: 9.8 },
      { score: "4 : 2", probability: 8.5 },
    ],
    aiConfidence: 71,
  },
  {
    id: "cpbl-260519-02",
    league: "CPBL",
    date: "2026 · 05 · 19  ·  星期二",
    startTime: "18:35",
    venue: "新莊棒球場",
    home: {
      name: "富邦悍將",
      en: "GUARDIANS",
      pitcher: {
        name: "羅戈",
        era: "3.92",
        k9: "7.8",
        whip: "1.31",
        bb9: "3.0",
        hr9: "1.1",
      },
      recent: ["L", "L", "W", "L", "W"],
      winRate: 47,
    },
    away: {
      name: "樂天桃猿",
      en: "MONKEYS",
      pitcher: {
        name: "魔神樂",
        era: "2.61",
        k9: "10.4",
        whip: "0.98",
        bb9: "1.9",
        hr9: "0.6",
      },
      recent: ["W", "W", "W", "L", "W"],
      winRate: 53,
    },
    topScores: [
      { score: "3 : 4", probability: 16.4 },
      { score: "2 : 3", probability: 13.7 },
      { score: "4 : 5", probability: 11.2 },
      { score: "3 : 5", probability: 10.5 },
      { score: "2 : 4", probability: 9.1 },
    ],
    aiConfidence: 58,
  },
  {
    id: "cpbl-260519-03",
    league: "CPBL",
    date: "2026 · 05 · 19  ·  星期二",
    startTime: "18:35",
    venue: "天母棒球場",
    home: {
      name: "台鋼雄鷹",
      en: "HAWKS",
      pitcher: {
        name: "賈斯汀",
        era: "4.08",
        k9: "7.2",
        whip: "1.38",
        bb9: "3.3",
        hr9: "1.2",
      },
      recent: ["L", "W", "L", "L", "W"],
      winRate: 41,
    },
    away: {
      name: "味全龍",
      en: "DRAGONS",
      pitcher: {
        name: "伍鐸",
        era: "3.05",
        k9: "8.7",
        whip: "1.15",
        bb9: "2.4",
        hr9: "0.8",
      },
      recent: ["W", "L", "W", "W", "W"],
      winRate: 59,
    },
    topScores: [
      { score: "2 : 4", probability: 17.1 },
      { score: "3 : 5", probability: 13.9 },
      { score: "3 : 4", probability: 12.4 },
      { score: "2 : 3", probability: 10.7 },
      { score: "4 : 5", probability: 8.8 },
    ],
    aiConfidence: 64,
  },
];

export function getMatchById(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function getAllMatchIds(): string[] {
  return matches.map((m) => m.id);
}

// ── Staleness detection ───────────────────────────────
// CPBL match data is hardcoded above (transitional · pre-Supabase).
// SSG pages bake at build time and don't auto-refresh unless we
// export `revalidate`. These helpers let pages show a "DATA · ARCHIVED"
// badge when the static data has aged past today (Taipei TZ).
//
// Runs on the server during render — re-evaluated on each ISR refresh.
// ─────────────────────────────────────────────────────

/** YYYY-MM-DD in Asia/Taipei timezone. Stable across server / edge / Node. */
export function getTodayTaipei(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

/** Extract the YYYY-MM-DD portion from match.date format
 *  ("2026 · 05 · 19  ·  星期二" → "2026-05-19").
 *  Returns null if the format doesn't match. */
export function getMatchDateIso(match: Match): string | null {
  const parts = match.date.split("·").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 3) return null;
  const [y, m, d] = parts;
  if (!/^\d{4}$/.test(y)) return null;
  if (!/^\d{1,2}$/.test(m)) return null;
  if (!/^\d{1,2}$/.test(d)) return null;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

/** True when the match's date is in the PAST relative to Taipei today.
 *  Used to render a "DATA · ARCHIVED" badge — predictions can be
 *  evaluated against actual outcome. */
export function isMatchDataStale(match: Match | undefined): boolean {
  if (!match) return false;
  const matchDate = getMatchDateIso(match);
  if (!matchDate) return false;
  return matchDate < getTodayTaipei();
}

/** True when the match's date is in the FUTURE relative to Taipei today.
 *  Used to render a "DATA · PREVIEW" badge — predictions are forward-
 *  looking, no outcome yet to compare against. Distinct from stale
 *  (past) data — these are two different visitor mental models. */
export function isMatchDataFuture(match: Match | undefined): boolean {
  if (!match) return false;
  const matchDate = getMatchDateIso(match);
  if (!matchDate) return false;
  return matchDate > getTodayTaipei();
}
