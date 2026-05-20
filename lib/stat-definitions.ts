// ── ZONE 27 · Stat Definitions ──────────────────────────
// Inline glossary content for the `<StatTerm>` tooltip component.
// Single source · keeps /glossary page and inline tooltips in sync.
//
// Research basis: Baseball Savant places "[▸ Definition](...)" links
// adjacent to every advanced metric. We adopt the spirit (definition
// at point of use) but go further — full inline reveal on hover/focus,
// no nav round-trip. Improves comprehension for visitors who aren't
// fluent in advanced metrics, without cluttering the page for those
// who are.
//
// IDs (slug field) align with /glossary anchor patterns so the
// "讀完整定義 →" link inside each tooltip deep-jumps into the
// glossary at the right entry.
// ─────────────────────────────────────────────────────

export type StatDefinition = {
  /** Display abbreviation, e.g. "K/9" */
  abbr: string;
  /** English full name */
  en: string;
  /** Chinese translation */
  zh: string;
  /** Short definition (1-2 sentences, max ~140 chars) shown inline */
  def: string;
  /** League / elite benchmark line */
  bench?: string;
  /** /glossary anchor slug (e.g. "k-9" → /glossary#k-9) */
  slug: string;
};

export const STAT_DEFINITIONS: Record<string, StatDefinition> = {
  "K/9": {
    abbr: "K/9",
    en: "Strikeouts per 9 Innings",
    zh: "每九局三振率",
    def: "投手 9 局能拿下多少三振。直接反映壓制力,是 ZONE 27 引擎的核心參數之一。",
    bench: "League: ~8.5 · Elite: >10.0",
    slug: "k-9",
  },
  "BB/9": {
    abbr: "BB/9",
    en: "Walks per 9 Innings",
    zh: "每九局保送率",
    def: "投手 9 局送出多少四壞球。低 = 控球好 · 高 = 容易爆炸。",
    bench: "League: ~3.0 · Elite: <2.0",
    slug: "bb-9",
  },
  "HR/9": {
    abbr: "HR/9",
    en: "Home Runs per 9 Innings",
    zh: "每九局被全壘打數",
    def: "投手 9 局被打多少 HR。壘上有人時被掃,影響爆炸性失分。",
    bench: "League: ~1.0 · Elite: <0.7",
    slug: "hr-9",
  },
  ERA: {
    abbr: "ERA",
    en: "Earned Run Average",
    zh: "防禦率",
    def: "投手每 9 局所失自責分。最古老的投手指標 · 受守備與運氣影響大。",
    bench: "League: ~4.30 · Elite: <3.00",
    slug: "era",
  },
  WHIP: {
    abbr: "WHIP",
    en: "Walks + Hits per Inning Pitched",
    zh: "每局獲准上壘",
    def: "投手每局讓多少打者上壘(被安打 + 保送)。比 ERA 更純粹反映控制力。",
    bench: "League: ~1.30 · Elite: <1.05",
    slug: "whip",
  },
  FIP: {
    abbr: "FIP",
    en: "Fielding Independent Pitching",
    zh: "投手獨立防禦率",
    def: "只看投手能控制的事:K · BB · HR。把守備與運氣從 ERA 中剝離。",
    bench: "League: ~4.30 · Elite: <3.20",
    slug: "fip",
  },
  OBP: {
    abbr: "OBP",
    en: "On-Base Percentage",
    zh: "上壘率",
    def: "(安打+保送+觸身) ÷ 打席。Moneyball 翻身靠的指標。",
    bench: "League: ~.330 · Elite: >.380",
    slug: "obp",
  },
  SLG: {
    abbr: "SLG",
    en: "Slugging Percentage",
    zh: "長打率",
    def: "壘打數 ÷ 打數。反映打者的火力。HR = 4 壘打數。",
    bench: "League: ~.420 · Elite: >.500",
    slug: "slg",
  },
  OPS: {
    abbr: "OPS",
    en: "On-Base Plus Slugging",
    zh: "上壘加長打率",
    def: "OBP + SLG · 早期 Sabermetrics 革命指標,一個數字反映打者整體價值。",
    bench: "League: ~.750 · Elite: >.900",
    slug: "ops",
  },
  wOBA: {
    abbr: "wOBA",
    en: "Weighted On-Base Average",
    zh: "加權上壘率",
    def: "給保送、單打、二壘安打、HR 各自不同權重 · OPS 的進化版。",
    bench: "League: ~.320 · Elite: >.380",
    slug: "woba",
  },
  "wRC+": {
    abbr: "wRC+",
    en: "Weighted Runs Created Plus",
    zh: "加權創造分數+",
    def: "把 wOBA 換算成「比聯盟平均多創造多少分」並標準化(100 = 平均)。",
    bench: "Average: 100 · Elite: >140",
    slug: "wrc",
  },
  BABIP: {
    abbr: "BABIP",
    en: "Batting Average on Balls in Play",
    zh: "場內安打率",
    def: "排除 HR 與三振後,球被打進場內變成安打的比率。極端值代表運氣成分。",
    bench: "League: ~.300 · 異常: <.250 或 >.350",
    slug: "babip",
  },
  WAR: {
    abbr: "WAR",
    en: "Wins Above Replacement",
    zh: "球員綜合價值",
    def: "如果用板凳替補取代這個球員 · 球隊一年會少贏幾場。終極比較尺。",
    bench: "Starter: ~2 · All-Star: >4 · MVP: >7",
    slug: "war",
  },
};

/**
 * Safe lookup that returns null if the term isn't in the dictionary.
 * Use in `<StatTerm>` to gracefully degrade for unknown terms.
 */
export function getStatDefinition(term: string): StatDefinition | null {
  return STAT_DEFINITIONS[term] ?? null;
}
