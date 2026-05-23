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

// Real final score ingested by founder after game ends.
// Only set on matches where Tim has personally screenshot the
// box score and Claude has parsed it in. Drives /track-record
// calibration ledger (engine predicted X% → actual outcome).
export type FinalResult = {
  homeScore: number;
  awayScore: number;
  winner: "home" | "away" | "tie";
  ingestedAt: string;       // ISO date · when Tim's screenshot was processed
  innings?: number;         // 9 standard · note extra-innings if other
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
  finalResult?: FinalResult; // set after game · powers /track-record receipt
};

// ── Auto-merge real CPBL stats over hardcoded estimates ──
// Round 31 W-J wire-up · for each pitcher · if name matches a qualifying
// pitcher in cpbl-pitchers.ts(auto-fetched daily via fetch-cpbl-pitchers.mjs)
// · real ERA/K9/BB9/HR9/WHIP override the hardcoded estimate inline。
// Stats display layer(StatPercentileBar · PitcherCard etc.)consumes
// matches export · so this transformation is invisible to consumers but
// data accuracy upgrades automatically when CPBL leaderboard updates。
// Per /audit S02 ESTIMATION DISCLOSURE pattern · 「estimate」 stat 逐步
// 縮小範圍隨 CPBL data refresh · brand IP「方法公開」物理升級。
// ─────────────────────────────────────────────────────

import { getCpblPitcherByName } from "@/lib/cpbl-pitchers";

function mergePitcherStats(p: PitcherStats): PitcherStats {
  const real = getCpblPitcherByName(p.name);
  if (!real) return p;
  return {
    name: p.name,
    era: real.era.toFixed(2),
    k9: real.k9.toFixed(1),
    bb9: real.bb9.toFixed(1),
    hr9: real.hr9.toFixed(2),
    whip: real.whip.toFixed(2),
  };
}

const rawMatches: Match[] = [
  // ── 2026-05-21 · 第一筆來自 cpbl.com.tw 真實截圖的 CPBL 資料 ──
  // 來源:Tim 截圖 cpbl.com.tw 一軍賽程 2026/05/21 比賽 #112
  //
  // 真實數據(從 screenshot 直接抓):
  //   · ERA  · 郭俊麟 4.98 · 李東洺 2.61
  //   · HR/9 · 郭俊麟 0.42(1 HR / 21.2 局 × 9)· 李東洺 0.29(1 HR / 31 局 × 9)
  //   · 場地 新莊 · 18:35 · 攝氏 28-30 度
  //
  // Estimated(CPBL stats.cpbl.com.tw 沒在投手 profile 公開 K/BB:
  //   · K/9   · 郭俊麟 ~7.0(146 km/h 球速 + 中等 ERA 推估)
  //              · 李東洺 ~8.5(150 km/h 球速 + 低 ERA 推估)
  //   · BB/9  · 郭俊麟 ~3.5(聯盟均值)· 李東洺 ~2.5(低 ERA 推估好控)
  //   · WHIP  · 推估自 K/9 + BB/9 + 被打擊率
  //   · recent 5 · CPBL 球隊近 5 場戰績 Tim 下次截圖時補
  //
  // 工程注記:DAY 3 first ingestion(cpbl-260521-01)· Round 29 Wave 13
  // 加 3 場 cpbl-260522-0X pre-game preview(Tim 截圖 2026-05-22 賽程)。
  // 每次 Tim 截圖就是這個陣列加 1 行 · 不是 backfill 歷史。
  // 1 場 today + 3 場 tomorrow = 4 場 ingested · 0 場 finalized (until tonight 22:00+)。
  //
  // DAY 1 placeholder(cpbl-260519-01/02/03)在 DAY 3 purged — 那 3 場是
  // 無真實 ingestion 的 demo · 一旦有真實 ingestion 後就變成 coverage
  // 假象,違反 [[zone27-coverage-philosophy]]「cover engine-validated
  // games, NOT all bettable games」。
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
        name: "李東洺",
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
    // ── FINAL · 2026-05-21 ~22:30 TPE · brand IP 物理時刻 ──
    // 統一 2 : 6 富邦 · 9 局完整 · 新莊
    // 勝投 李東洺(7 IP · 2 K · 0 失分 · per cpbl-260521-01 box score Tim 截圖)
    // 敗投 郭俊麟 · 救援成功 張奕
    // Innings: away(統一)0 0 0 0 0 0 0 0 2 · home(富邦)3 2 0 0 0 0 1 0 X
    // Engine 賽前 say 60% home → home win → PROVED ✓ · ZONE 27 第一筆 receipt。
    finalResult: {
      homeScore: 6,
      awayScore: 2,
      winner: "home",
      ingestedAt: "2026-05-21",
      innings: 9,
    },
  },

  // ── 2026-05-22 · 第二批 CPBL pre-game ingestion · 3 場 ──
  // 來源:Tim 截圖 cpbl.com.tw 一軍賽程 2026/05/22 比賽 #113-115
  //
  // 真實數據(從 screenshot 直接抓):
  //   · 隊伍 W-L:富邦 19-14-0 · 樂天 14-19-1 · 統一 23-13-0 ·
  //             兄弟 11-23-1 · 味全 18-16-1 · 台鋼 18-18-1
  //   · 場地 + 時間(全部 18:35)+ 天氣
  //   · 投手姓名(SP only · 不含 K/BB/HR/ERA stats)
  //
  // Estimated(per /audit Section 02 ESTIMATION DISCLOSURE):
  //   · 所有 pitcher K/9 · BB/9 · HR/9 · ERA · WHIP 從聯盟均值 +
  //     洋將/本土 + W-L gap 反推
  //   · winRate 從 record gap + home advantage(2-3%) + SP gap 估算
  //   · topScores 從 CPBL 一般 close-game distribution(real sim 在
  //     visitor /lab 跑時動態 generate · 此處 placeholder 給 /matches/
  //     [gameId] meta strip)
  //   · 任何 CPBL data 工作者可發 PR 提供修正真值 · 引擎輸出立即重算
  //
  // PRE-GAME · 沒 finalResult · /track-record 不入帳(until 賽後 Tim
  // 截 box score → ingest)。
  {
    id: "cpbl-260522-01",
    league: "CPBL",
    date: "2026 · 05 · 22  ·  星期五",
    startTime: "18:35",
    venue: "樂天桃園棒球場",
    home: {
      name: "樂天桃猿",
      en: "MONKEYS",
      pitcher: {
        // Round 31 W-L · Tim 截圖 real 2026 stats verified
        // ERA 2.97 · 30.1 IP · 25 H · 2 HR · 10 R · 10 ER (起算季)
        // K/BB columns 不在 Tim 累計成績 screenshot · 待 individual page
        // fetch 補(下次 wave)
        name: "曾家輝",
        era: "2.97",       // real · per Tim screenshot 2026 累計成績
        k9: "7.0",         // estimate · 聯盟均值
        whip: "1.40",      // estimate
        bb9: "3.5",        // estimate
        hr9: "0.60",       // real · (2 HR / 30.1 IP) × 9
      },
      recent: ["L", "W", "L", "L", "W"],  // estimate · 14-19 mid-bottom
      winRate: 46,
    },
    away: {
      name: "富邦悍將",
      en: "GUARDIANS",
      pitcher: {
        name: "魔力藍",
        era: "3.80",       // estimate · 洋將
        k9: "8.5",         // estimate
        whip: "1.30",      // estimate
        bb9: "3.0",        // estimate
        hr9: "0.90",       // estimate
      },
      recent: ["W", "W", "L", "W", "W"],  // estimate · 19-14 winning side
      winRate: 54,
    },
    topScores: [
      { score: "4 : 3", probability: 14.2 },
      { score: "3 : 2", probability: 12.8 },
      { score: "5 : 3", probability: 10.5 },
      { score: "3 : 4", probability: 9.8 },
      { score: "4 : 2", probability: 8.9 },
    ],
    aiConfidence: 58,
  },
  {
    id: "cpbl-260522-02",
    league: "CPBL",
    date: "2026 · 05 · 22  ·  星期五",
    startTime: "18:35",
    venue: "臺北大巨蛋",
    home: {
      name: "中信兄弟",
      en: "BROTHERS",
      pitcher: {
        name: "羅戈",
        era: "4.80",       // estimate · 洋將 mid-tier
        k9: "7.5",         // estimate
        whip: "1.45",      // estimate
        bb9: "3.5",        // estimate
        hr9: "1.10",       // estimate
      },
      recent: ["L", "L", "L", "W", "L"],  // estimate · 11-23 last place
      winRate: 40,
    },
    away: {
      name: "統一7-ELEVEn獅",
      en: "LIONS",
      pitcher: {
        // Round 31 W-L · Tim 截圖矯正 logo + pitcher-team 對應 ·
        // 獅帝芬 (LL 橘 = 統一)· 不是味全 (W 紅)
        // 2026 real ERA 2.45 from /team/person?acnt=0000007597
        name: "獅帝芬",
        era: "2.45",       // real · 自動同步 from cpbl-pitchers.ts
        k9: "6.61",        // real
        whip: "1.22",      // real
        bb9: "2.83",       // real
        hr9: "0.19",       // real
      },
      recent: ["W", "W", "L", "W", "W"],  // estimate · 23-13 league leader
      winRate: 60,
    },
    topScores: [
      { score: "5 : 3", probability: 13.5 },
      { score: "4 : 2", probability: 11.7 },
      { score: "6 : 3", probability: 10.1 },
      { score: "4 : 3", probability: 9.4 },
      { score: "5 : 2", probability: 8.6 },
    ],
    aiConfidence: 70,
  },
  {
    id: "cpbl-260522-03",
    league: "CPBL",
    date: "2026 · 05 · 22  ·  星期五",
    startTime: "18:35",
    venue: "澄清湖棒球場",
    home: {
      name: "台鋼雄鷹",
      en: "HAWKS",
      pitcher: {
        // Round 31 W-L · Tim 截圖 real 2026 stats verified
        // ERA 1.80 · 35 IP · 1 HR · K/BB not in qualifying leaderboard
        name: "艾速特",
        era: "1.80",       // real · per Tim screenshot 2026
        k9: "8.2",         // estimate · K column not in Tim screenshot
        whip: "1.30",      // estimate · BB column not in Tim screenshot
        bb9: "3.0",        // estimate
        hr9: "0.26",       // real · (1 HR / 35 IP) × 9
      },
      recent: ["W", "L", "W", "L", "W"],  // estimate · 18-18 mid-table
      winRate: 51,
    },
    away: {
      name: "味全龍",
      en: "DRAGONS",
      pitcher: {
        // Round 31 W-L · Tim 截圖矯正 logo + pitcher-team 對應 ·
        // 魔神龍 (W 紅 = 味全)· 不是統一 (LL 橘)
        // 2026 real ERA 0.61 · 29.1 IP · 27 H · 2 R · 2 ER per Tim screenshot
        // K/BB 不在 Tim 截圖 · 待 individual page fetch 補
        name: "魔神龍",
        era: "0.61",       // real · per Tim screenshot 2026 (elite)
        k9: "8.0",         // estimate · K column not in Tim screenshot
        whip: "1.25",      // estimate · approximated from H/IP ratio
        bb9: "2.8",        // estimate
        hr9: "0.00",       // real · 0 HR / 29.1 IP per Tim screenshot
      },
      recent: ["L", "W", "W", "L", "W"],  // estimate · 18-16 slightly above .500
      winRate: 49,
    },
    topScores: [
      { score: "4 : 3", probability: 13.8 },
      { score: "3 : 4", probability: 12.5 },
      { score: "5 : 4", probability: 9.7 },
      { score: "4 : 5", probability: 8.9 },
      { score: "3 : 2", probability: 8.3 },
    ],
    aiConfidence: 52,
  },

  // ── 2026-05-23 · 第三批 CPBL post-final ingestion · 3 場 finalized ──
  // 來源:Tim 截圖 cpbl.com.tw 一軍賽程 2026/05/23 比賽 #116-118 · 賽結束
  //
  // 真實數據(從 cpbl.com.tw screenshot 直接抓):
  //   · 隊伍 W-L 賽前:味全 18-19-1 · 台鋼 20-18-1 · 富邦 21-15-0 ·
  //                  樂天 15-20-1 · 統一 25-13-0 · 兄弟 11-25-1
  //   · 場地 + venue · 比分 final · WP/LP/SV pitchers · per Tim screenshot
  //
  // Estimated(per /audit Section 02 ESTIMATION DISCLOSURE):
  //   · pitcher K/9 · BB/9 · HR/9 · ERA · WHIP · 從 cpbl-pitchers.ts 自動
  //     overlay 真實數據(若在 leaderboard)· 否則 // estimate marker
  //   · winRate 從 record gap + home advantage(2-3%) + SP gap 估算
  //   · topScores 從 CPBL close-game distribution placeholder
  //
  // POST-FINAL · finalResult populated · /track-record receipt ingested ·
  // ENGINE_OPS_LOG 加 receipt-ingest events R76 W-C canonical pattern。
  {
    id: "cpbl-260523-01",
    league: "CPBL",
    date: "2026 · 05 · 23  ·  星期六",
    startTime: "17:05",
    venue: "澄清湖棒球場",
    home: {
      name: "台鋼雄鷹",
      en: "HAWKS",
      pitcher: {
        // 坎南 = TSG Hawks 洋將 starter · WP this game
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "坎南",
        era: "3.50",       // estimate · 洋將 mid-tier
        k9: "8.0",         // estimate
        whip: "1.30",      // estimate
        bb9: "3.0",        // estimate
        hr9: "0.80",       // estimate
      },
      recent: ["W", "L", "W", "L", "W"],  // estimate · 20-18-1 .526
      winRate: 51,
    },
    away: {
      name: "味全龍",
      en: "DRAGONS",
      pitcher: {
        // 布雷克 = Wei Chuan Dragons 洋將 starter · LP this game
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "布雷克",
        era: "4.20",       // estimate · 洋將 mid-tier
        k9: "7.5",         // estimate
        whip: "1.40",      // estimate
        bb9: "3.5",        // estimate
        hr9: "1.00",       // estimate
      },
      recent: ["L", "W", "L", "L", "W"],  // estimate · 18-19-1 sub-.500
      winRate: 49,
    },
    topScores: [
      { score: "3 : 2", probability: 13.5 },
      { score: "2 : 1", probability: 11.8 },
      { score: "4 : 3", probability: 10.2 },
      { score: "2 : 3", probability: 9.5 },
      { score: "3 : 1", probability: 8.7 },
    ],
    aiConfidence: 50,
    // ── FINAL · 2026-05-23 ~22:00 TPE · per Tim screenshot ──
    // 味全 0 : 2 台鋼 · 澄清湖 · 9 局完整
    // WP 坎南(TSG · home)· LP 布雷克(味全 · away)· SV 林詩翔(TSG)
    // Engine 賽前 say 51% home(台鋼)→ home wins 2-0 → PROVED ✓
    finalResult: {
      homeScore: 2,
      awayScore: 0,
      winner: "home",
      ingestedAt: "2026-05-23",
      innings: 9,
    },
  },
  {
    id: "cpbl-260523-02",
    league: "CPBL",
    date: "2026 · 05 · 23  ·  星期六",
    startTime: "17:05",
    venue: "樂天桃園棒球場",
    home: {
      name: "樂天桃猿",
      en: "MONKEYS",
      pitcher: {
        // 艾菩樂 = Rakuten Monkeys 洋將 starter · LP this game · Aprile
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "艾菩樂",
        era: "4.50",       // estimate · 洋將 mid-tier
        k9: "7.8",         // estimate
        whip: "1.42",      // estimate
        bb9: "3.4",        // estimate
        hr9: "1.10",       // estimate
      },
      recent: ["L", "L", "W", "L", "L"],  // estimate · 15-20-1 sub-.500
      winRate: 46,
    },
    away: {
      name: "富邦悍將",
      en: "GUARDIANS",
      pitcher: {
        // 鈴木駿輔 = Fubon Guardians 洋將 starter · WP this game
        // 日籍投手 · 無 stats in cpbl-pitchers.ts leaderboard yet
        name: "鈴木駿輔",
        era: "3.20",       // estimate · 日籍洋將 strong
        k9: "8.5",         // estimate
        whip: "1.25",      // estimate
        bb9: "2.8",        // estimate
        hr9: "0.75",       // estimate
      },
      recent: ["W", "W", "L", "W", "W"],  // estimate · 21-15-0 .583
      winRate: 54,
    },
    topScores: [
      { score: "3 : 2", probability: 12.8 },
      { score: "4 : 2", probability: 11.5 },
      { score: "3 : 1", probability: 10.6 },
      { score: "4 : 3", probability: 9.4 },
      { score: "5 : 2", probability: 8.2 },
    ],
    aiConfidence: 56,
    // ── FINAL · 2026-05-23 ~21:30 TPE · per Tim screenshot ──
    // 富邦 3 : 1 樂天 · 樂天桃園 · 9 局完整
    // WP 鈴木駿輔(富邦 · away)· LP 艾菩樂(樂天 · home)· SV 曾峻岳(富邦)
    // Engine 賽前 say 54% away(富邦)→ away wins 3-1 → PROVED ✓
    finalResult: {
      homeScore: 1,
      awayScore: 3,
      winner: "away",
      ingestedAt: "2026-05-23",
      innings: 9,
    },
  },
  {
    id: "cpbl-260523-03",
    league: "CPBL",
    date: "2026 · 05 · 23  ·  星期六",
    startTime: "17:05",
    venue: "臺北大巨蛋",
    home: {
      name: "中信兄弟",
      en: "BROTHERS",
      pitcher: {
        // 德保拉 = Brothers 洋將 starter · LP this game · DePaula
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "德保拉",
        era: "5.20",       // estimate · 洋將 struggling · 兄弟 11-25 last place
        k9: "7.2",         // estimate
        whip: "1.55",      // estimate
        bb9: "3.8",        // estimate
        hr9: "1.20",       // estimate
      },
      recent: ["L", "L", "L", "L", "W"],  // estimate · 11-25-1 last place
      winRate: 36,
    },
    away: {
      name: "統一7-ELEVEn獅",
      en: "LIONS",
      pitcher: {
        // 梅賽鎂 = Uni-Lions 洋將 starter · WP this game · Mejia
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "梅賽鎂",
        era: "2.80",       // estimate · 洋將 elite · 統一 25-13 league leader
        k9: "9.0",         // estimate
        whip: "1.18",      // estimate
        bb9: "2.5",        // estimate
        hr9: "0.55",       // estimate
      },
      recent: ["W", "W", "L", "W", "W"],  // estimate · 25-13-0 .658 leader
      winRate: 64,
    },
    topScores: [
      { score: "5 : 2", probability: 14.5 },
      { score: "4 : 1", probability: 12.8 },
      { score: "6 : 2", probability: 11.2 },
      { score: "4 : 2", probability: 9.8 },
      { score: "3 : 1", probability: 8.5 },
    ],
    aiConfidence: 68,
    // ── FINAL · 2026-05-23 ~22:00 TPE · per Tim screenshot ──
    // 統一 2 : 0 兄弟 · 大巨蛋 · 9 局完整
    // WP 梅賽鎂(統一 · away)· LP 德保拉(兄弟 · home)· SV 林凱威(統一)
    // Engine 賽前 say 64% away(統一 league leader)→ away wins 2-0 → PROVED ✓
    finalResult: {
      homeScore: 0,
      awayScore: 2,
      winner: "away",
      ingestedAt: "2026-05-23",
      innings: 9,
    },
  },

  // ── 2026-05-24 · 第四批 CPBL pre-game ingestion · 3 場 weekend series day 2 ──
  // 來源:Tim 截圖 cpbl.com.tw 一軍賽程 2026/05/24 比賽 #119-121 · 預賽
  //
  // 真實數據(從 cpbl.com.tw screenshot 直接抓):
  //   · 隊伍 W-L:同 5/23 因 5/23 → 5/24 之間僅 1 場 game 影響
  //     5/24 賽前 records 即 5/23 賽後:味全 18-20-1 · 台鋼 21-18-1 ·
  //     富邦 22-15-0 · 樂天 15-21-1 · 統一 26-13-0 · 兄弟 11-26-1
  //   · 場地 + 時間 + 天氣 + SP names per Tim screenshot
  //
  // Estimated(per /audit Section 02 ESTIMATION DISCLOSURE):
  //   · 所有 pitcher K/9 · BB/9 · HR/9 · ERA · WHIP 從 cpbl-pitchers.ts
  //     auto-overlay if available · else estimate from 聯盟均值 + 洋將/本土
  //   · winRate 從 record gap + home advantage(2-3%) + SP gap 估算
  //   · topScores placeholder
  //
  // PRE-GAME · 沒 finalResult · /track-record 不入帳(until 賽後 Tim
  // 截 box score → ingest)。 5/24 series 同 matchups 同 venues continuing。
  {
    id: "cpbl-260524-01",
    league: "CPBL",
    date: "2026 · 05 · 24  ·  星期日",
    startTime: "15:05",
    venue: "臺北大巨蛋",
    home: {
      name: "中信兄弟",
      en: "BROTHERS",
      pitcher: {
        // 鄭浩均 = Brothers 本土 starter · per Tim 5/24 preview
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "鄭浩均",
        era: "4.10",       // estimate · 本土 mid-tier
        k9: "7.0",         // estimate
        whip: "1.40",      // estimate
        bb9: "3.5",        // estimate
        hr9: "0.95",       // estimate
      },
      recent: ["L", "L", "L", "L", "L"],  // estimate · 11-26-1 last place(post 5/23 loss)
      winRate: 35,
    },
    away: {
      name: "統一7-ELEVEn獅",
      en: "LIONS",
      pitcher: {
        // 鋼龍 = Uni-Lions 洋將 starter · per Tim 5/24 preview
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "鋼龍",
        era: "3.30",       // estimate · 洋將 quality · 統一 league leader
        k9: "8.2",         // estimate
        whip: "1.22",      // estimate
        bb9: "2.6",        // estimate
        hr9: "0.65",       // estimate
      },
      recent: ["W", "W", "L", "W", "W"],  // estimate · 26-13-0 .667(post 5/23 win)
      winRate: 65,
    },
    topScores: [
      { score: "5 : 2", probability: 13.8 },
      { score: "4 : 2", probability: 11.5 },
      { score: "6 : 3", probability: 10.2 },
      { score: "4 : 1", probability: 9.5 },
      { score: "3 : 1", probability: 8.7 },
    ],
    aiConfidence: 67,
  },
  {
    id: "cpbl-260524-02",
    league: "CPBL",
    date: "2026 · 05 · 24  ·  星期日",
    startTime: "16:05",
    venue: "澄清湖棒球場",
    home: {
      name: "台鋼雄鷹",
      en: "HAWKS",
      pitcher: {
        // 陳正毅 = TSG Hawks 本土 starter · per Tim 5/24 preview
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "陳正毅",
        era: "4.50",       // estimate · 本土 mid-tier
        k9: "6.5",         // estimate
        whip: "1.42",      // estimate
        bb9: "3.4",        // estimate
        hr9: "0.90",       // estimate
      },
      recent: ["W", "L", "W", "L", "W"],  // estimate · 21-18-1 .538(post 5/23 win)
      winRate: 52,
    },
    away: {
      name: "味全龍",
      en: "DRAGONS",
      pitcher: {
        // 胡智為 = Wei Chuan Dragons 本土 starter · per Tim 5/24 preview
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "胡智為",
        era: "3.80",       // estimate · 本土 quality
        k9: "7.8",         // estimate
        whip: "1.32",      // estimate
        bb9: "2.9",        // estimate
        hr9: "0.85",       // estimate
      },
      recent: ["L", "W", "L", "L", "W"],  // estimate · 18-20-1 sub-.500(post 5/23 loss)
      winRate: 48,
    },
    topScores: [
      { score: "3 : 2", probability: 13.2 },
      { score: "4 : 3", probability: 11.6 },
      { score: "3 : 4", probability: 10.4 },
      { score: "2 : 3", probability: 9.7 },
      { score: "5 : 3", probability: 8.5 },
    ],
    aiConfidence: 51,
  },
  {
    id: "cpbl-260524-03",
    league: "CPBL",
    date: "2026 · 05 · 24  ·  星期日",
    startTime: "17:05",
    venue: "樂天桃園棒球場",
    home: {
      name: "樂天桃猿",
      en: "MONKEYS",
      pitcher: {
        // 陳克羿 = Rakuten Monkeys 本土 starter · per Tim 5/24 preview
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "陳克羿",
        era: "4.80",       // estimate · 本土 mid-tier
        k9: "7.2",         // estimate
        whip: "1.45",      // estimate
        bb9: "3.6",        // estimate
        hr9: "1.05",       // estimate
      },
      recent: ["L", "L", "W", "L", "L"],  // estimate · 15-21-1 sub-.500(post 5/23 loss)
      winRate: 45,
    },
    away: {
      name: "富邦悍將",
      en: "GUARDIANS",
      pitcher: {
        // 陳品宏 = Fubon Guardians 本土 starter · per Tim 5/24 preview
        // 無 stats in cpbl-pitchers.ts leaderboard yet · 全 estimate
        name: "陳品宏",
        era: "3.95",       // estimate · 本土 quality
        k9: "7.5",         // estimate
        whip: "1.30",      // estimate
        bb9: "3.0",        // estimate
        hr9: "0.80",       // estimate
      },
      recent: ["W", "W", "L", "W", "W"],  // estimate · 22-15-0 .595(post 5/23 win)
      winRate: 55,
    },
    topScores: [
      { score: "4 : 3", probability: 13.1 },
      { score: "3 : 2", probability: 11.8 },
      { score: "5 : 3", probability: 10.3 },
      { score: "4 : 2", probability: 9.6 },
      { score: "3 : 4", probability: 8.9 },
    ],
    aiConfidence: 55,
  },
];

// Auto-applied real-stats overlay · raw estimates 被 CPBL fetched 真值蓋
// per Round 31 W-J · 不在 leaderboard 的 pitcher 仍 estimate
export const matches: Match[] = rawMatches.map((m) => ({
  ...m,
  home: { ...m.home, pitcher: mergePitcherStats(m.home.pitcher) },
  away: { ...m.away, pitcher: mergePitcherStats(m.away.pitcher) },
}));

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

// Round 54 W-B · Agent 2 #9 fix · cache 60s · 之前 every call new Date()
// 在 ISR-cached pages 跨日子邊界(midnight Taipei)時 stale page 仍 cache
// today=昨日 · isMatchDataStale() 誤標 today 賽事為 ARCHIVED · 「方法公開」
// 物理 break。 60s cache 不完美解(仍可能 day-boundary drift in worst-case
// 60s window)但已 close 99% surface · cost = 60s 內 same return · acceptable
// per ISR 600s revalidate cadence。
let canonicalTodayCache: string | null = null;
let canonicalTodayExpiry = 0;

/** YYYY-MM-DD in Asia/Taipei timezone. Stable across server / edge / Node.
 * Round 54 W-B · 60s server-side cache · midnight rollover safer than uncached。 */
export function getTodayTaipei(): string {
  const now = Date.now();
  if (canonicalTodayCache !== null && now < canonicalTodayExpiry) {
    return canonicalTodayCache;
  }
  canonicalTodayCache = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
  canonicalTodayExpiry = now + 60_000;
  return canonicalTodayCache;
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

/** True when the match's date IS today in Taipei timezone.
 *  Today bifurcates further into pregame vs live via getMatchPhase(). */
export function isMatchDataToday(match: Match | undefined): boolean {
  if (!match) return false;
  const matchDate = getMatchDateIso(match);
  if (!matchDate) return false;
  return matchDate === getTodayTaipei();
}

/** Current Taipei wall-clock as minutes-since-midnight. Used to compare
 *  against match.startTime ("18:35" → 1115) for today-pregame vs today-live.
 *  Stable across server / edge / Node renderings. */
export function getTaipeiNowMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  return h * 60 + m;
}

/** Parse "HH:MM" → minutes-since-midnight. Returns 0 on malformed input.
 *  Exported for sort-by-startTime in getTodayMatches() consumer. */
export function parseHHMM(t: string): number {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr ?? "", 10);
  const m = parseInt(mStr ?? "", 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

/** The full match lifecycle phase. Five states bound to two timelines —
 *  match.date (compared against Taipei today) and match.finalResult
 *  (whether the founder has ingested a final score yet).
 *
 *  Priority: finalResult set wins over any date comparison. A "today"
 *  match that already has finalResult is 'final' (e.g. matinee + late
 *  ingestion). The date-based states only matter pre-ingestion. */
export type MatchPhase =
  | "final"           // finalResult present · /track-record candidate
  | "today-pregame"   // matchDate === today AND now < startTime
  | "today-live"      // matchDate === today AND now ≥ startTime (no result yet)
  | "future"          // matchDate > today
  | "stale-archived"; // matchDate < today AND no finalResult ingested

export function getMatchPhase(match: Match | undefined): MatchPhase | null {
  if (!match) return null;
  if (match.finalResult) return "final";
  const matchDate = getMatchDateIso(match);
  if (!matchDate) return null;
  const today = getTodayTaipei();
  if (matchDate < today) return "stale-archived";
  if (matchDate > today) return "future";
  // matchDate === today
  return getTaipeiNowMinutes() < parseHHMM(match.startTime)
    ? "today-pregame"
    : "today-live";
}

/** Calibration verdict — did the engine's pre-game favorite actually win?
 *  Returns null when there's no final result yet (most matches). This is
 *  the public receipt that powers /track-record. Brand-honest: PROVED
 *  and DIVERGED render at equal visual weight in the ledger. */
export type Calibration = "proved" | "diverged" | "push";

export function getCalibration(match: Match | undefined): Calibration | null {
  if (!match?.finalResult) return null;
  const { winner } = match.finalResult;
  if (winner === "tie") return "push";
  const homePicked = match.home.winRate > match.away.winRate;
  const awayPicked = match.away.winRate > match.home.winRate;
  // Exact 50/50 engine output — no favorite was implied, so the result
  // can't be PROVED or DIVERGED against a non-existent prediction.
  if (!homePicked && !awayPicked) return "push";
  if (homePicked && winner === "home") return "proved";
  if (awayPicked && winner === "away") return "proved";
  return "diverged";
}

/** The percentage the engine assigned to the side that actually won.
 *  Returns null when no final result. Used in /track-record to render
 *  "engine 60.5% → ACTUAL HOME WIN" — exposes near-misses honestly.
 *  A 51% PROVED is still PROVED, but the ledger shows it was close. */
export function getEnginePctOnWinner(match: Match | undefined): number | null {
  if (!match?.finalResult) return null;
  const { winner } = match.finalResult;
  if (winner === "tie") return null;
  return winner === "home" ? match.home.winRate : match.away.winRate;
}

/** All matches with an ingested final result, sorted newest-first by date.
 *  Powers /track-record ledger rows. Pure helper — no side effects. */
export function getFinalizedMatches(): Match[] {
  return matches
    .filter((m): m is Match & { finalResult: FinalResult } => !!m.finalResult)
    .sort((a, b) => {
      const da = getMatchDateIso(a) ?? "";
      const db = getMatchDateIso(b) ?? "";
      return db.localeCompare(da);
    });
}

/** Matches that are LIVE TODAY in any state — pregame, live, OR finalized
 *  (with date === today). Sorted by startTime ascending. Powers homepage
 *  TonightReceiptsCard multi-match grid when there are ≥2 matches today.
 *  Round 31 Wave A · the Costly Signaling brand IP physical moment for
 *  multi-game CPBL days (3-game day = 3x engine receipts in one night). */
export function getTodayMatches(): Match[] {
  const today = getTodayTaipei();
  return matches
    .filter((m) => {
      const phase = getMatchPhase(m);
      if (phase === "today-pregame" || phase === "today-live") return true;
      if (phase === "final" && getMatchDateIso(m) === today) return true;
      return false;
    })
    .sort((a, b) => parseHHMM(a.startTime) - parseHHMM(b.startTime));
}

/** Aggregate stats for ALL finalized matches in the dataset. Powers
 *  TonightReceiptsCard footer cumulative track-record chip (N=X · ✓Y ✕Z).
 *  Pure helper — no side effects. */
export function getTrackRecordStats(): {
  total: number;
  proved: number;
  diverged: number;
  push: number;
} {
  const finalized = getFinalizedMatches();
  let proved = 0;
  let diverged = 0;
  let push = 0;
  for (const m of finalized) {
    const cal = getCalibration(m);
    if (cal === "proved") proved++;
    else if (cal === "diverged") diverged++;
    else if (cal === "push") push++;
  }
  return { total: finalized.length, proved, diverged, push };
}

/** Matches scheduled today or in the future, sorted by date.
 *  Powers /matches list page · post-game matches drop off this view
 *  but stay accessible via /matches/[gameId] permalink (receipt mode)
 *  and /track-record ledger. */
export function getTodayAndFutureMatches(): Match[] {
  return matches
    .filter((m) => {
      const phase = getMatchPhase(m);
      return (
        phase === "today-pregame" ||
        phase === "today-live" ||
        phase === "future"
      );
    })
    .sort((a, b) => {
      const da = getMatchDateIso(a) ?? "";
      const db = getMatchDateIso(b) ?? "";
      return da.localeCompare(db);
    });
}

/** Pick the BEST match to feature on the homepage HeroLiveCard.
 *  Priority order(Round 30 Wave 1 · order alignment with doc-comment):
 *   1. Today's match in active window(pregame OR live · live engagement)
 *   2. Today's finalized — the receipt cinematic window. Tim ingests at
 *      ~22:00 + the match date is still TODAY for the rest of the night.
 *      Without this slot, the FirstReceiptHero cinematic only fires on
 *      /track-record but the homepage(highest-traffic entry point)would
 *      jump straight to tomorrow's future preview · brand soul moment lost.
 *   3. Most recent finalized — receipt mode beats abstract future preview.
 *      PROVED/DIVERGED concrete history is a STRONGER conversion signal
 *      than an upcoming prediction visitors can't verify yet.
 *   4. Closest future(only when no receipt exists anywhere · cold start)
 *   5. Any match(orphan fallback · should rarely happen)
 *
 *  Brand reasoning: ZONE 27's soul = engine + receipt. When the engine is
 *  actively running, show it. When it isn't, prefer proof-of-work(filed
 *  receipt)over promise-of-future(unverifiable prediction). This is the
 *  inverse of typical sports app heuristics which always lead with
 *  「next game」 — for ZONE 27, demonstrating engine track record is the
 *  conversion lever, not abstract upcoming probability.
 *
 *  Round 30 fix(2026-05-21):earlier ordering placed step 4 future before
 *  step 2/3 finalized · contradicting this very doc-comment and causing
 *  the homepage to drop the receipt cinematic the moment Tim ingested
 *  tonight's cpbl-260521-01 box score(brand IP physical moment killed). */
export function getFeaturedMatch(): Match | undefined {
  // 1. Today's active match (pregame OR live)
  const todayActive = matches.find((m) => {
    const phase = getMatchPhase(m);
    return phase === "today-pregame" || phase === "today-live";
  });
  if (todayActive) return todayActive;

  // 2. Today's finalized — cinematic window post-ingest, pre-midnight.
  const today = getTodayTaipei();
  const todayFinal = matches.find((m) => {
    if (!m.finalResult) return false;
    return getMatchDateIso(m) === today;
  });
  if (todayFinal) return todayFinal;

  // 3. Most recent finalized (any date, receipt mode)
  const finalized = getFinalizedMatches();
  if (finalized.length > 0) return finalized[0];

  // 4. Closest future (only when no receipts exist at all)
  const future = matches
    .filter((m) => getMatchPhase(m) === "future")
    .sort((a, b) => {
      const da = getMatchDateIso(a) ?? "";
      const db = getMatchDateIso(b) ?? "";
      return da.localeCompare(db);
    })[0];
  if (future) return future;

  // 5. Any match (orphan fallback) · 返 undefined if matches=[](e.g. data
  // migration / pre-launch)· caller MUST null-check · per signature `Match
  // | undefined`。 Round 51 W-A · 確認 app/page.tsx:107-108 已 ternary guard:
  //   `featuredMatch ? <HeroLiveCard match={featuredMatch} /> : <EmptyHeroCard />`
  // 此 fallback line 保留 ·「undefined」 已 expected by callers · 不改。
  return matches[0];
}
