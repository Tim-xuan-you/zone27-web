// ── ZONE 27 · CPBL Pitcher Stats Cache ─────────────────
// AUTO-GENERATED · DO NOT EDIT MANUALLY · run scripts/fetch-cpbl-pitchers.mjs to refresh.
// Source:  cpbl.com.tw /stats/recordall?kindcode=A&position=02 (server-rendered)
// Fetched: 2026-05-22 TPE
// Pitchers: 15
//
// Use `getPitcherStatsByName(name)` from lib/matches.ts to lookup real
// stats by Chinese name. Falls back to hardcoded estimate if not found
// (which is honest per /audit S02 ESTIMATION DISCLOSURE pattern).
// ─────────────────────────────────────────────────────

export type CpblPitcherStats = {
  name: string;
  team: string;
  acnt: string | null;
  era: number;
  ip: number;
  k: number;
  bb: number;
  hr: number;
  k9: number;
  bb9: number;
  hr9: number;
  whip: number;
};

export const CPBL_PITCHER_FETCH_DATE = "2026-05-22";

export const cpblPitchers: CpblPitcherStats[] = [
  {
    "name": "蔣銲",
    "team": "味全龍",
    "acnt": "0000007779",
    "era": 1.49,
    "ip": 36.3,
    "k": 38,
    "bb": 14,
    "hr": 2,
    "k9": 9.41,
    "bb9": 3.47,
    "hr9": 0.5,
    "whip": 1.05
  },
  {
    "name": "江承諺",
    "team": "台鋼雄鷹",
    "acnt": "0000002679",
    "era": 1.51,
    "ip": 41.7,
    "k": 16,
    "bb": 11,
    "hr": 1,
    "k9": 3.46,
    "bb9": 2.38,
    "hr9": 0.22,
    "whip": 1.1
  },
  {
    "name": "布雷克",
    "team": "統一7-ELEVEn獅",
    "acnt": "0000005731",
    "era": 1.65,
    "ip": 43.7,
    "k": 21,
    "bb": 4,
    "hr": 2,
    "k9": 4.33,
    "bb9": 0.82,
    "hr9": 0.41,
    "whip": 0.98
  },
  {
    "name": "魔力藍",
    "team": "富邦悍將",
    "acnt": "0000006749",
    "era": 1.88,
    "ip": 43,
    "k": 33,
    "bb": 13,
    "hr": 1,
    "k9": 6.91,
    "bb9": 2.72,
    "hr9": 0.21,
    "whip": 1.07
  },
  {
    "name": "李東洺",
    "team": "富邦悍將",
    "acnt": "0000006739",
    "era": 2.13,
    "ip": 38,
    "k": 22,
    "bb": 12,
    "hr": 1,
    "k9": 5.21,
    "bb9": 2.84,
    "hr9": 0.24,
    "whip": 1.29
  },
  {
    "name": "勝騎士",
    "team": "中信兄弟",
    "acnt": "0000005604",
    "era": 2.44,
    "ip": 48,
    "k": 40,
    "bb": 2,
    "hr": 3,
    "k9": 7.5,
    "bb9": 0.38,
    "hr9": 0.56,
    "whip": 0.9
  },
  {
    "name": "獅帝芬",
    "team": "統一7-ELEVEn獅",
    "acnt": "0000007597",
    "era": 2.45,
    "ip": 47.7,
    "k": 35,
    "bb": 15,
    "hr": 1,
    "k9": 6.61,
    "bb9": 2.83,
    "hr9": 0.19,
    "whip": 1.22
  },
  {
    "name": "梅賽鍶",
    "team": "味全龍",
    "acnt": "0000006555",
    "era": 2.5,
    "ip": 39.7,
    "k": 24,
    "bb": 8,
    "hr": 2,
    "k9": 5.45,
    "bb9": 1.82,
    "hr9": 0.45,
    "whip": 1.24
  },
  {
    "name": "鋼龍",
    "team": "味全龍",
    "acnt": "0000006497",
    "era": 2.63,
    "ip": 41,
    "k": 38,
    "bb": 9,
    "hr": 4,
    "k9": 8.34,
    "bb9": 1.98,
    "hr9": 0.88,
    "whip": 1.05
  },
  {
    "name": "伍鐸",
    "team": "味全龍",
    "acnt": "0000000762",
    "era": 2.89,
    "ip": 37.3,
    "k": 12,
    "bb": 10,
    "hr": 3,
    "k9": 2.89,
    "bb9": 2.41,
    "hr9": 0.72,
    "whip": 1.26
  },
  {
    "name": "黃子鵬",
    "team": "台鋼雄鷹",
    "acnt": "0000002274",
    "era": 2.96,
    "ip": 54.7,
    "k": 20,
    "bb": 10,
    "hr": 2,
    "k9": 3.29,
    "bb9": 1.65,
    "hr9": 0.33,
    "whip": 1.12
  },
  {
    "name": "羅戈",
    "team": "中信兄弟",
    "acnt": "0000005151",
    "era": 3,
    "ip": 48,
    "k": 51,
    "bb": 14,
    "hr": 2,
    "k9": 9.56,
    "bb9": 2.63,
    "hr9": 0.38,
    "whip": 1.1
  },
  {
    "name": "艾菩樂",
    "team": "樂天桃猿",
    "acnt": "0000006906",
    "era": 3.48,
    "ip": 44,
    "k": 28,
    "bb": 8,
    "hr": 7,
    "k9": 5.73,
    "bb9": 1.64,
    "hr9": 1.43,
    "whip": 1.07
  },
  {
    "name": "魔爾曼",
    "team": "樂天桃猿",
    "acnt": "0000007790",
    "era": 3.91,
    "ip": 46,
    "k": 40,
    "bb": 17,
    "hr": 1,
    "k9": 7.83,
    "bb9": 3.33,
    "hr9": 0.2,
    "whip": 1.26
  },
  {
    "name": "後勁",
    "team": "台鋼雄鷹",
    "acnt": "0000006507",
    "era": 4.15,
    "ip": 39,
    "k": 32,
    "bb": 16,
    "hr": 0,
    "k9": 7.38,
    "bb9": 3.69,
    "hr9": 0,
    "whip": 1.13
  }
];

/** Lookup pitcher stats by Chinese name. Returns null if not in qualifying
 *  leaderboard (e.g. pitcher with < required IP for stats display). */
export function getCpblPitcherByName(name: string): CpblPitcherStats | null {
  return cpblPitchers.find((p) => p.name === name) ?? null;
}
