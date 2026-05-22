// ── ZONE 27 · CPBL Advanced Stats Cache ────────────────
// AUTO-GENERATED · DO NOT EDIT MANUALLY · run scripts/fetch-cpbl-advanced.mjs to refresh.
// Source:  stats.cpbl.com.tw /players/{acnt}(野球革命 + Trackman radar 整合)
// Fetched: 2026-05-22 TPE
// Pitchers: 12
//
// All values are 中職百分位(0-100 · 100 = elite · 0 = poor)derived
// from Trackman radar tracking data. Statcast-grade advanced metrics
// far superior to the per-9 basic stats in cpbl-pitchers.ts(K/9 etc.).
//
// Use `getCpblAdvancedByAcnt(acnt)` or `getCpblAdvancedByName(name)`
// from PitcherCard / display layer to lookup percentile bars。
// ─────────────────────────────────────────────────────

export type CpblAdvancedStats = {
  acnt: string;
  name: string;
  team: string;
  /** 加權上壘率(wOBA-against)百分位 0-100 · 投手:低 = 好 */
  wobaAgainst: number | null;
  /** 三振%(K%)百分位 · 高 = 好 */
  kPct: number | null;
  /** 保送%(BB%)百分位 · 低 = 好 */
  bbPct: number | null;
  /** 揮空%(Whiff%)百分位 · 高 = 好 */
  whiffPct: number | null;
  /** 強擊球率(Hard-Hit%)百分位 · 投手:低 = 好 */
  hardHitPct: number | null;
  /** 擊球初速 Avg 百分位 · 投手:低 = 好 */
  exitVeloAvg: number | null;
  /** 擊球初速 Max 百分位 · 投手:低 = 好 */
  exitVeloMax: number | null;
};

export const CPBL_ADVANCED_FETCH_DATE = "2026-05-22";

export const cpblAdvanced: CpblAdvancedStats[] = [
  {
    "acnt": "0000007779",
    "name": "蔣銲",
    "team": "味全龍",
    "wobaAgainst": 67,
    "kPct": 89,
    "bbPct": 41,
    "whiffPct": 93,
    "hardHitPct": 75,
    "exitVeloAvg": 54,
    "exitVeloMax": 39
  },
  {
    "acnt": "0000005731",
    "name": "布雷克",
    "team": "統一7-ELEVEn獅",
    "wobaAgainst": 67,
    "kPct": 35,
    "bbPct": 89,
    "whiffPct": 24,
    "hardHitPct": 46,
    "exitVeloAvg": 34,
    "exitVeloMax": 13
  },
  {
    "acnt": "0000006749",
    "name": "魔力藍",
    "team": "富邦悍將",
    "wobaAgainst": 78,
    "kPct": 72,
    "bbPct": 53,
    "whiffPct": 53,
    "hardHitPct": 60,
    "exitVeloAvg": 47,
    "exitVeloMax": 53
  },
  {
    "acnt": "0000006739",
    "name": "李東洺",
    "team": "富邦悍將",
    "wobaAgainst": 61,
    "kPct": 37,
    "bbPct": 58,
    "whiffPct": 22,
    "hardHitPct": 22,
    "exitVeloAvg": 39,
    "exitVeloMax": 45
  },
  {
    "acnt": "0000007597",
    "name": "獅帝芬",
    "team": "統一7-ELEVEn獅",
    "wobaAgainst": 62,
    "kPct": 62,
    "bbPct": 56,
    "whiffPct": 33,
    "hardHitPct": 67,
    "exitVeloAvg": 68,
    "exitVeloMax": 19
  },
  {
    "acnt": "0000006555",
    "name": "梅賽鍶",
    "team": "味全龍",
    "wobaAgainst": 53,
    "kPct": 48,
    "bbPct": 72,
    "whiffPct": 31,
    "hardHitPct": 48,
    "exitVeloAvg": 48,
    "exitVeloMax": 17
  },
  {
    "acnt": "0000000762",
    "name": "伍鐸",
    "team": "味全龍",
    "wobaAgainst": 44,
    "kPct": 10,
    "bbPct": 60,
    "whiffPct": 11,
    "hardHitPct": 21,
    "exitVeloAvg": 42,
    "exitVeloMax": 6
  },
  {
    "acnt": "0000005151",
    "name": "羅戈",
    "team": "中信兄弟",
    "wobaAgainst": 61,
    "kPct": 92,
    "bbPct": 56,
    "whiffPct": 83,
    "hardHitPct": 61,
    "exitVeloAvg": 78,
    "exitVeloMax": 38
  },
  {
    "acnt": "0000006906",
    "name": "艾菩樂",
    "team": "樂天桃猿",
    "wobaAgainst": 45,
    "kPct": 55,
    "bbPct": 78,
    "whiffPct": 37,
    "hardHitPct": 72,
    "exitVeloAvg": 66,
    "exitVeloMax": 1
  },
  {
    "acnt": "0000007790",
    "name": "魔爾曼",
    "team": "樂天桃猿",
    "wobaAgainst": 56,
    "kPct": 78,
    "bbPct": 46,
    "whiffPct": 87,
    "hardHitPct": 34,
    "exitVeloAvg": 58,
    "exitVeloMax": 12
  },
  {
    "acnt": "0000006507",
    "name": "後勁",
    "team": "台鋼雄鷹",
    "wobaAgainst": 68,
    "kPct": 64,
    "bbPct": 55,
    "whiffPct": 93,
    "hardHitPct": 55,
    "exitVeloAvg": 79,
    "exitVeloMax": 55
  },
  {
    "acnt": "0000002345",
    "name": "鄭浩均",
    "team": "中信兄弟",
    "wobaAgainst": 28,
    "kPct": 84,
    "bbPct": 49,
    "whiffPct": 85,
    "hardHitPct": 43,
    "exitVeloAvg": 35,
    "exitVeloMax": 22
  }
];

export function getCpblAdvancedByAcnt(acnt: string): CpblAdvancedStats | null {
  return cpblAdvanced.find((p) => p.acnt === acnt) ?? null;
}

export function getCpblAdvancedByName(name: string): CpblAdvancedStats | null {
  return cpblAdvanced.find((p) => p.name === name) ?? null;
}
