// ── ZONE 27 · MLB Stats API integration ───────────────
// 接 MLB 官方公開 API(https://statsapi.mlb.com),0 元、無需註冊、
// 完全公開可用。每 10 分鐘 revalidate,Vercel 自動 CDN 快取。
//
// 這是第一個「真實即時資料」的整合 — 從此 ZONE 27 不只跑虛擬模擬,
// 也提供當日 MLB 全部 ~15 場比賽的對戰資訊。
// ─────────────────────────────────────────────────────

const MLB_API = "https://statsapi.mlb.com/api/v1";
const REVALIDATE_SECONDS = 600; // 10 minutes

// ── Public shape used across pages ────────────────────
export type MlbGame = {
  gamePk: number;
  /** Original UTC start time (ISO 8601) */
  startUTC: string;
  /** Taipei-local display time ("19:35") */
  startTaipei: string;
  /** Taipei-local date display ("2026 · 05 · 20") */
  dateTaipei: string;
  /** "Preview" | "Live" | "Final" | (raw) */
  state: "preview" | "live" | "final" | "other";
  /** Human-readable raw status (e.g. "Scheduled", "In Progress (T7)", "Final") */
  statusDetail: string;
  home: MlbTeamSide;
  away: MlbTeamSide;
  venue: string;
  /** Pre-built URL into /lab/custom with the two probable pitchers' stats
   *  pre-filled (or null if no probable pitchers announced yet). */
  simulateUrl: string | null;
  /** R48 W-A · Engine pick win% on HOME team · 0-100 · deterministic Log5
   *  style formula from K/9 BB/9 HR/9 · brand IP「LIVE re-compute · NOT
   *  pre-game lock-in」 vs CPBL discipline · disclosed in /audit + /coverage。
   *  null when either pitcher missing stats(─ from MLB API)。 */
  engineWinHomePct: number | null;
  /** R48 W-A · Final score from MLB API linescore hydrate · only when
   *  state === "final" · null otherwise · home/away runs at end of game。 */
  finalScore: { home: number; away: number } | null;
  /** R194 · 即時比分 + 局數(只在 state==="live")· linescore 每 10 分鐘 ISR
   *  抓一次官方值 · 誠實標「約 10 分鐘前 · 不逐球跳動」(我們不做賭場式秒跳)。
   *  與引擎 prediction 完全分離:引擎仍賽前鎖、賽後對帳;這只是「現在發生什麼」·
   *  不是判決、不進 /track-record。 之前被「賽後 finalResult only」過度套用而丟掉。 */
  live: { home: number; away: number; inning: number; half: string } | null;
  /** R48 W-A · Verdict computed from engine pick vs actual outcome ·
   *  only when state === "final" + engineWinHomePct + finalScore · 「proved」
   *  = engine pick matches winner · 「diverged」 = miss · 「tie」 = tie game。
   *  NOT aggregated to /track-record(brand IP integrity preserved · per
   *  /audit S05 PRE-COMMIT「pre-game lock-in」 axiom)。 */
  verdict: "proved" | "diverged" | "tie" | null;
};

export type MlbTeamSide = {
  /** MLB team ID (stable, used for hydration later) */
  id: number;
  /** Original English name (e.g. "Los Angeles Dodgers") */
  enName: string;
  /** Chinese display name (custom map below) */
  zhName: string;
  /** Three-letter abbreviation (e.g. "LAD") */
  abbr: string;
  /** Season record at game time */
  wins: number;
  losses: number;
  /** Probable starting pitcher (null if not announced yet) */
  probablePitcher: MlbPitcher | null;
};

export type MlbPitcher = {
  id: number;
  fullName: string;
  /** Strikeouts per 9 innings — string from API e.g. "10.23" */
  k9: string;
  /** Walks per 9 — e.g. "2.25" */
  bb9: string;
  /** Home runs per 9 — e.g. "0.41" */
  hr9: string;
  /** ERA — e.g. "0.82" */
  era: string;
};

// ── Chinese team-name map (most common 30 MLB teams) ──
// Source: 台灣媒體常用譯名 (ESPN.tw / Yahoo 奇摩運動).
const TEAM_ZH: Record<number, { zh: string; abbr: string }> = {
  108: { zh: "洛杉磯天使", abbr: "LAA" },
  109: { zh: "亞利桑那響尾蛇", abbr: "ARI" },
  110: { zh: "巴爾的摩金鶯", abbr: "BAL" },
  111: { zh: "波士頓紅襪", abbr: "BOS" },
  112: { zh: "芝加哥小熊", abbr: "CHC" },
  113: { zh: "辛辛那提紅人", abbr: "CIN" },
  114: { zh: "克里夫蘭守護者", abbr: "CLE" },
  115: { zh: "科羅拉多落磯", abbr: "COL" },
  116: { zh: "底特律老虎", abbr: "DET" },
  117: { zh: "休士頓太空人", abbr: "HOU" },
  118: { zh: "堪薩斯皇家", abbr: "KC" },
  119: { zh: "洛杉磯道奇", abbr: "LAD" },
  120: { zh: "華盛頓國民", abbr: "WSH" },
  121: { zh: "紐約大都會", abbr: "NYM" },
  133: { zh: "運動家", abbr: "ATH" },
  134: { zh: "匹茲堡海盜", abbr: "PIT" },
  135: { zh: "聖地牙哥教士", abbr: "SD" },
  136: { zh: "西雅圖水手", abbr: "SEA" },
  137: { zh: "舊金山巨人", abbr: "SF" },
  138: { zh: "聖路易紅雀", abbr: "STL" },
  139: { zh: "坦帕灣光芒", abbr: "TB" },
  140: { zh: "德州遊騎兵", abbr: "TEX" },
  141: { zh: "多倫多藍鳥", abbr: "TOR" },
  142: { zh: "明尼蘇達雙城", abbr: "MIN" },
  143: { zh: "費城費城人", abbr: "PHI" },
  144: { zh: "亞特蘭大勇士", abbr: "ATL" },
  145: { zh: "芝加哥白襪", abbr: "CHW" },
  146: { zh: "邁阿密馬林魚", abbr: "MIA" },
  147: { zh: "紐約洋基", abbr: "NYY" },
  158: { zh: "密爾瓦基釀酒人", abbr: "MIL" },
};

export function teamZh(id: number, fallbackEn: string) {
  const t = TEAM_ZH[id];
  if (t) return t;
  // Fallback: use English + 3-letter slice
  return { zh: fallbackEn, abbr: fallbackEn.slice(0, 3).toUpperCase() };
}

function classifyState(abstractState: string): MlbGame["state"] {
  const s = (abstractState ?? "").toLowerCase();
  if (s === "preview") return "preview";
  if (s === "live") return "live";
  if (s === "final") return "final";
  return "other";
}

// ── Taipei timezone helpers ──────────────────────────
// MLB is in US — start times are typically late-night Taipei (early morning).
// We display in Taipei time so Taiwanese visitors see "明天上午 09:10" etc.

export function toTaipeiTime(isoUtc: string): { time: string; date: string } {
  const d = new Date(isoUtc);
  // Use Intl.DateTimeFormat with Taipei TZ
  const time = new Intl.DateTimeFormat("zh-Hant", {
    timeZone: "Asia/Taipei",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  const dateRaw = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d); // "2026-05-20"
  const [y, m, day] = dateRaw.split("-");
  return { time, date: `${y} · ${m} · ${day}` };
}

/** Returns YYYY-MM-DD for "today" in Taipei TZ — used as the schedule query. */
function todayTaipeiYmd(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// ── Public fetch ──────────────────────────────────────

/**
 * Fetch today's MLB regular-season schedule (Taipei TZ).
 * Cached for 10 minutes via Next.js fetch revalidate.
 */
export async function fetchTodayMlb(): Promise<MlbGame[]> {
  const dateYmd = todayTaipeiYmd();
  return fetchMlbForDate(dateYmd);
}

/** YYYY-MM-DD 位移 N 天(UTC 算 · 純字串進出 · 給跨日合併用)。 */
function ymdPlusDays(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dt);
}

/**
 * R194 · 抓「對台灣此刻有意義」的 MLB 場次 = 昨天 + 今天(台北日期)兩天合併 ·
 * dedupe by gamePk。 修時區漏洞:台北中午正在打的美國夜場,MLB 歸在美國日期
 * (= 台北昨天)· 只抓台北 today 會漏掉所有「現在進行中」的比賽(Tim 看到一排
 * 「即將開打」的根因)。 兩天足以涵蓋 live + 最近結束 + 今晚即將。
 */
export async function fetchRelevantMlb(): Promise<MlbGame[]> {
  const today = todayTaipeiYmd();
  const yesterday = ymdPlusDays(today, -1);
  const [y, t] = await Promise.all([
    fetchMlbForDate(yesterday),
    fetchMlbForDate(today),
  ]);
  const byPk = new Map<number, MlbGame>();
  for (const g of [...y, ...t]) byPk.set(g.gamePk, g);
  return [...byPk.values()];
}

/**
 * Fetch MLB schedule for a specific YYYY-MM-DD with probable pitchers + stats.
 *
 * Strategy:
 *   1. Schedule call with hydrate=probablePitcher → game shells + pitcher IDs
 *   2. Collect unique pitcher IDs across all games
 *   3. Single batched call to /people?personIds=A,B,C&hydrate=stats(...)
 *      pulls every pitcher's season K/9 · BB/9 · HR/9 in one HTTP request
 *   4. Map back into game objects
 *
 * Total HTTP requests per ISR refresh: 2 (regardless of how many games).
 */
export async function fetchMlbForDate(dateYmd: string): Promise<MlbGame[]> {
  // R48 W-A · 加 linescore hydrate to get final scores for status=Final games ·
  // same response · 0 extra HTTP call · brand-pure since MLB API native support。
  const scheduleUrl = `${MLB_API}/schedule?sportId=1&date=${dateYmd}&hydrate=probablePitcher,linescore`;
  try {
    const res = await fetch(scheduleUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "ZONE-27/0.27 (+zone27-web.vercel.app)" },
    });
    if (!res.ok) {
      console.error(`[ZONE27 · MLB] schedule fetch failed status=${res.status}`);
      return [];
    }
    const data = (await res.json()) as MlbScheduleResponse;
    const dates = data.dates ?? [];
    const rawGames = dates.flatMap((d) => d.games ?? []);

    // Collect all unique probable-pitcher IDs across both sides of every game
    const pitcherIds = new Set<number>();
    for (const g of rawGames) {
      const h = g.teams.home.probablePitcher?.id;
      const a = g.teams.away.probablePitcher?.id;
      if (h) pitcherIds.add(h);
      if (a) pitcherIds.add(a);
    }

    // Batch fetch all pitcher season stats
    const pitcherStats = await fetchPitcherStatsBatch(
      [...pitcherIds],
      dateYmd
    );

    return rawGames.map((g) => mapGame(g, pitcherStats));
  } catch (err) {
    console.error("[ZONE27 · MLB] fetch threw", err);
    return [];
  }
}

/**
 * Single batched fetch for many pitchers' season stats.
 * Returns a Map<pitcherId, MlbPitcher (stats portion)>.
 */
async function fetchPitcherStatsBatch(
  ids: number[],
  dateYmd: string
): Promise<Map<number, MlbPitcher>> {
  const out = new Map<number, MlbPitcher>();
  if (ids.length === 0) return out;

  // MLB people endpoint accepts comma-separated personIds
  const season = dateYmd.slice(0, 4);
  const url = `${MLB_API}/people?personIds=${ids.join(
    ","
  )}&hydrate=stats(group=[pitching],type=[season],season=${season})`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "ZONE-27/0.27 (+zone27-web.vercel.app)" },
    });
    if (!res.ok) {
      console.error(`[ZONE27 · MLB] people fetch failed status=${res.status}`);
      return out;
    }
    const data = (await res.json()) as MlbPeopleResponse;
    for (const p of data.people ?? []) {
      const seasonStat = p.stats
        ?.flatMap((s) => s.splits ?? [])
        .find((sp) => sp?.stat);
      const stat = seasonStat?.stat;
      if (!stat) continue;
      out.set(p.id, {
        id: p.id,
        fullName: p.fullName,
        k9: stat.strikeoutsPer9Inn ?? "—",
        bb9: stat.walksPer9Inn ?? "—",
        hr9: stat.homeRunsPer9 ?? "—",
        era: stat.era ?? "—",
      });
    }
  } catch (err) {
    console.error("[ZONE27 · MLB] people fetch threw", err);
  }
  return out;
}

/**
 * Build a deep link to /lab/custom with both probable pitchers' stats
 * pre-filled. Returns null if either side has no probable pitcher.
 *
 * URL shape matches lib/lab/custom's useSearchParams reader (v0.18).
 */
function buildSimulateUrl(home: MlbTeamSide, away: MlbTeamSide): string | null {
  const hp = home.probablePitcher;
  const ap = away.probablePitcher;
  if (!hp || !ap) return null;
  // Only build URL if we actually have numeric stats (the "—" fallback
  // means the pitcher hasn't pitched this season — skip them)
  if (
    hp.k9 === "—" ||
    hp.bb9 === "—" ||
    hp.hr9 === "—" ||
    ap.k9 === "—" ||
    ap.bb9 === "—" ||
    ap.hr9 === "—"
  ) {
    return null;
  }
  const params = new URLSearchParams({
    h_name: hp.fullName,
    h_k9: hp.k9,
    h_bb9: hp.bb9,
    h_hr9: hp.hr9,
    a_name: ap.fullName,
    a_k9: ap.k9,
    a_bb9: ap.bb9,
    a_hr9: ap.hr9,
  });
  return `/lab/custom?${params.toString()}`;
}

// ── Internal mapper ───────────────────────────────────

type RawTeam = {
  team: { id: number; name: string };
  leagueRecord?: { wins?: number; losses?: number };
  probablePitcher?: { id: number; fullName: string };
};

type RawGame = {
  gamePk: number;
  gameDate: string;
  status: { abstractGameState: string; detailedState?: string };
  teams: {
    home: RawTeam & { score?: number };
    away: RawTeam & { score?: number };
  };
  venue: { name: string };
  /** R48 W-A · Hydrated when &hydrate=linescore added · final innings + runs ·
   *  R194 · 加 inningState/isTopInning 供 live 局數顯示(7局上/下) */
  linescore?: {
    currentInning?: number;
    inningState?: string; // "Top" | "Bottom" | "Middle" | "End"
    isTopInning?: boolean;
    teams?: {
      home?: { runs?: number };
      away?: { runs?: number };
    };
  };
};

type MlbScheduleResponse = {
  dates: { date: string; games: RawGame[] }[];
};

type MlbPeopleResponse = {
  people: {
    id: number;
    fullName: string;
    stats?: {
      splits?: {
        stat?: {
          strikeoutsPer9Inn?: string;
          walksPer9Inn?: string;
          homeRunsPer9?: string;
          era?: string;
        };
      }[];
    }[];
  }[];
};

// ── R48 W-A · MLB engine pick computation ─────────────
// Deterministic Log5-style formula from K/9 BB/9 HR/9 ERA · brand IP「方法
// 公開」 延伸:每 game render 都 produces same number from same inputs ·
// 不 silently 變 between fetches(除非 pitcher stats 更新 from MLB API)。
//
// NOT 10K Monte Carlo(那是 CPBL pre-game lock-in pattern · 賽前鎖定不再
// 改 · MLB 此處是 LIVE re-compute · disclosure 必須 explicit)。
//
// Formula(simple Pythagorean-style):
//   baseHome = 54  // MLB home-field advantage baseline ~54%
//   eraDelta = away.era - home.era  // positive = home has better pitcher
//   k9Delta = home.k9 - away.k9     // positive = home K/9 higher
//   hr9Delta = away.hr9 - home.hr9  // positive = home gives up fewer HR
//   pitcherEdge = (eraDelta * 4) + (k9Delta * 2) + (hr9Delta * 6)
//                 // weighting based on /audit S02 INPUTS axiom
//   homeWinPct = clamp(baseHome + pitcherEdge, 25, 80)
//                // 不假 > 80% confidence(any MLB game has ~20% upset baseline)
//
// 引擎 v0.2 同 Bill James log5 family · brand-IP-pure if disclosed in /audit
// + /coverage data pipeline · explicit「不 lock-in · NOT aggregated to
// /track-record」 disclosure。
// ─────────────────────────────────────────────────────
function computeEngineWinHomePct(
  homePitcher: MlbPitcher | null,
  awayPitcher: MlbPitcher | null
): number | null {
  if (!homePitcher || !awayPitcher) return null;
  if (
    homePitcher.k9 === "—" ||
    homePitcher.bb9 === "—" ||
    homePitcher.hr9 === "—" ||
    homePitcher.era === "—" ||
    awayPitcher.k9 === "—" ||
    awayPitcher.bb9 === "—" ||
    awayPitcher.hr9 === "—" ||
    awayPitcher.era === "—"
  ) {
    return null;
  }

  const hera = parseFloat(homePitcher.era);
  const aera = parseFloat(awayPitcher.era);
  const hk9 = parseFloat(homePitcher.k9);
  const ak9 = parseFloat(awayPitcher.k9);
  const hhr9 = parseFloat(homePitcher.hr9);
  const ahr9 = parseFloat(awayPitcher.hr9);

  if (
    !Number.isFinite(hera) ||
    !Number.isFinite(aera) ||
    !Number.isFinite(hk9) ||
    !Number.isFinite(ak9) ||
    !Number.isFinite(hhr9) ||
    !Number.isFinite(ahr9)
  ) {
    return null;
  }

  const baseHome = 54; // MLB home-field advantage baseline
  const eraDelta = aera - hera;
  const k9Delta = hk9 - ak9;
  const hr9Delta = ahr9 - hhr9;

  const pitcherEdge = eraDelta * 4 + k9Delta * 2 + hr9Delta * 6;
  const raw = baseHome + pitcherEdge;
  // Clamp to [25, 80] · 不假裝 > 80% confidence(MLB upset baseline ~20%)
  return Math.max(25, Math.min(80, Math.round(raw)));
}

function mapGame(
  g: RawGame,
  pitcherStats: Map<number, MlbPitcher>
): MlbGame {
  const taipei = toTaipeiTime(g.gameDate);
  const home = makeSide(g.teams.home, pitcherStats);
  const away = makeSide(g.teams.away, pitcherStats);
  const state = classifyState(g.status.abstractGameState);
  const engineWinHomePct = computeEngineWinHomePct(
    home.probablePitcher,
    away.probablePitcher
  );

  // R48 W-A · Extract finalScore from linescore hydrate when state=Final ·
  // MLB API returns home.score + away.score on linescore teams · null for
  // non-final games(state=Preview / Live · 不 surface partial scores · 因
  // brand IP「賽後 finalResult only」 same axiom as CPBL)。
  let finalScore: MlbGame["finalScore"] = null;
  if (state === "final") {
    const homeRuns =
      g.linescore?.teams?.home?.runs ?? g.teams.home.score ?? null;
    const awayRuns =
      g.linescore?.teams?.away?.runs ?? g.teams.away.score ?? null;
    if (homeRuns !== null && awayRuns !== null) {
      finalScore = { home: homeRuns, away: awayRuns };
    }
  }

  // R194 · 即時比分(進行中)· 救回被丟掉的 live linescore · 與引擎判決分離 ·
  // 誠實標 live game state(不是預測、不秒跳)= Polymarket「數字會動」誠實版。
  let live: MlbGame["live"] = null;
  if (state === "live") {
    const hr = g.linescore?.teams?.home?.runs ?? g.teams.home.score;
    const ar = g.linescore?.teams?.away?.runs ?? g.teams.away.score;
    const inning = g.linescore?.currentInning;
    if (hr !== undefined && ar !== undefined && inning !== undefined) {
      const st = (g.linescore?.inningState ?? "").toLowerCase();
      const half =
        g.linescore?.isTopInning === true || st.startsWith("top")
          ? "上"
          : st.startsWith("bot")
          ? "下"
          : st.startsWith("mid")
          ? "中"
          : st.startsWith("end")
          ? ""
          : "";
      live = { home: hr, away: ar, inning, half };
    }
  }

  // R48 W-A · Verdict computed only when state=Final + both engine pick
  // exists + finalScore exists · 「proved」 = engine pick matches actual
  // winner · 「diverged」 = miss · 「tie」 = rare MLB tie。
  let verdict: MlbGame["verdict"] = null;
  if (state === "final" && engineWinHomePct !== null && finalScore !== null) {
    if (finalScore.home === finalScore.away) {
      verdict = "tie";
    } else {
      const homeWon = finalScore.home > finalScore.away;
      const engineFavoredHome = engineWinHomePct > 50;
      verdict = homeWon === engineFavoredHome ? "proved" : "diverged";
    }
  }

  return {
    gamePk: g.gamePk,
    startUTC: g.gameDate,
    startTaipei: taipei.time,
    dateTaipei: taipei.date,
    state,
    statusDetail: g.status.detailedState ?? g.status.abstractGameState,
    home,
    away,
    venue: g.venue?.name ?? "—",
    simulateUrl: buildSimulateUrl(home, away),
    engineWinHomePct,
    finalScore,
    live,
    verdict,
  };
}

function makeSide(
  t: RawTeam,
  pitcherStats: Map<number, MlbPitcher>
): MlbTeamSide {
  const zh = teamZh(t.team.id, t.team.name);
  let probablePitcher: MlbPitcher | null = null;
  if (t.probablePitcher?.id) {
    // Prefer stats-enriched version from batch lookup; fall back to bare name
    probablePitcher =
      pitcherStats.get(t.probablePitcher.id) ?? {
        id: t.probablePitcher.id,
        fullName: t.probablePitcher.fullName,
        k9: "—",
        bb9: "—",
        hr9: "—",
        era: "—",
      };
  }
  return {
    id: t.team.id,
    enName: t.team.name,
    zhName: zh.zh,
    abbr: zh.abbr,
    wins: t.leagueRecord?.wins ?? 0,
    losses: t.leagueRecord?.losses ?? 0,
    probablePitcher,
  };
}
