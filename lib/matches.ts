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
  // 工程注記:這是 ZONE 27 唯一收錄的 CPBL 比賽。DAY 1 placeholder
  // (cpbl-260519-01/02/03)在 DAY 3 purged — 那 3 場是無真實 ingestion
  // 的 demo · 一旦有真實 ingestion (cpbl-260521-01) 後就變成 coverage
  // 假象,違反 [[zone27-coverage-philosophy]]「cover engine-validated
  // games, NOT all bettable games」。每次 Tim 下次截圖就是這個陣列加
  // 1 行 · 不是 backfill 歷史。
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

/** Parse "HH:MM" → minutes-since-midnight. Returns 0 on malformed input. */
function parseHHMM(t: string): number {
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
 *  Priority order:
 *   1. Today's match (pregame OR live · highest engagement value)
 *   2. Closest future match (pre-game prediction · "next up")
 *   3. Most recent finalized match (receipt mode · shows engine
 *      track record · "yesterday we predicted X · result was Y")
 *   4. Most recent stale-archived (fallback · should rarely happen
 *      since matches with no finalResult become orphan after the date)
 *
 *  Brand reasoning: ZONE 27's soul = engine + receipt. When there's
 *  a live prediction, show it. When there isn't, show the most recent
 *  proof the engine works (a finalized match in receipt mode is
 *  actually a STRONGER conversion signal than an upcoming prediction
 *  — visitors see PROVED/DIVERGED concrete history vs an abstract
 *  probability they can't verify yet). */
export function getFeaturedMatch(): Match | undefined {
  // 1. Today's match
  const today = matches.find((m) => {
    const phase = getMatchPhase(m);
    return phase === "today-pregame" || phase === "today-live";
  });
  if (today) return today;

  // 2. Closest future
  const future = matches
    .filter((m) => getMatchPhase(m) === "future")
    .sort((a, b) => {
      const da = getMatchDateIso(a) ?? "";
      const db = getMatchDateIso(b) ?? "";
      return da.localeCompare(db);
    })[0];
  if (future) return future;

  // 3. Most recent finalized (receipt mode)
  const finalized = getFinalizedMatches();
  if (finalized.length > 0) return finalized[0];

  // 4. Any match (orphan fallback)
  return matches[0];
}
