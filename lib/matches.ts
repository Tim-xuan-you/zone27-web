// ── ZONE 27 · Shared Match Data ────────────────────────
// 今日 CPBL 賽事(2026/05/19)
// 未來這層會被 Supabase + CPBL 爬蟲取代,介面保持不變。

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
