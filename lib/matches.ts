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
    // ── FINAL · 2026-05-21 ~22:30 TPE · brand IP 物理時刻 ──
    // 統一 2 : 6 富邦 · 9 局完整 · 新莊
    // 勝投 李東洛(7 IP · 2 K · 0 失分 · 4-time MVP)
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
        name: "曾家輝",
        era: "4.50",       // estimate · 本土 mid-tier
        k9: "7.0",         // estimate · 聯盟均值
        whip: "1.40",      // estimate
        bb9: "3.5",        // estimate
        hr9: "1.20",       // estimate
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
        name: "魔神龍",
        era: "3.50",       // estimate · 洋將 strong
        k9: "8.0",         // estimate
        whip: "1.25",      // estimate
        bb9: "2.8",        // estimate
        hr9: "0.85",       // estimate
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
        name: "艾速特",
        era: "3.95",       // estimate · 洋將
        k9: "8.2",         // estimate
        whip: "1.30",      // estimate
        bb9: "3.0",        // estimate
        hr9: "0.95",       // estimate
      },
      recent: ["W", "L", "W", "L", "W"],  // estimate · 18-18 mid-table
      winRate: 51,
    },
    away: {
      name: "味全龍",
      en: "DRAGONS",
      pitcher: {
        name: "獅帝芬",
        era: "4.10",       // estimate · 洋將
        k9: "7.8",         // estimate
        whip: "1.35",      // estimate
        bb9: "3.2",        // estimate
        hr9: "1.00",       // estimate
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

  // 5. Any match (orphan fallback)
  return matches[0];
}
