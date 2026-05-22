// ── ZONE 27 · CPBL Teams ────────────────────────────────
// Round 31 W-N · Tim 矯正 logo legend(W-L)後 canonical team data
// reference。 6 CPBL teams 配 logo initial + brand color + Chinese/EN name。
// 用於 TeamPickPanel(我看 ___) + display layer highlighting。

export type CpblTeamId =
  | "guardians"
  | "lions"
  | "brothers"
  | "monkeys"
  | "dragons"
  | "hawks";

export type CpblTeam = {
  id: CpblTeamId;
  name: string; // 中文 full name
  short: string; // 中文 short(for inline display)
  en: string; // English short
  initial: string; // logo letter(B / LL / R / G / W / T)
  color: string; // brand color descriptor(顏色 + accent)
  hexAccent: string; // approximated hex for inline display
};

// per Tim 2026-05-22 W-L logo legend correction
export const CPBL_TEAMS: CpblTeam[] = [
  {
    id: "guardians",
    name: "富邦悍將",
    short: "富邦",
    en: "GUARDIANS",
    initial: "G",
    color: "blue",
    hexAccent: "#1E3A8A", // 富邦藍
  },
  {
    id: "lions",
    name: "統一7-ELEVEn獅",
    short: "統一獅",
    en: "U-LIONS",
    initial: "LL",
    color: "orange",
    hexAccent: "#EA580C", // 統一橘
  },
  {
    id: "brothers",
    name: "中信兄弟",
    short: "兄弟",
    en: "BROTHERS",
    initial: "B",
    color: "yellow",
    hexAccent: "#FBBF24", // 兄弟黃
  },
  {
    id: "monkeys",
    name: "樂天桃猿",
    short: "樂天",
    en: "MONKEYS",
    initial: "R",
    color: "red",
    hexAccent: "#DC2626", // 樂天紅
  },
  {
    id: "dragons",
    name: "味全龍",
    short: "味全",
    en: "DRAGONS",
    initial: "W",
    color: "red",
    hexAccent: "#B91C1C", // 味全紅(較暗)
  },
  {
    id: "hawks",
    name: "台鋼雄鷹",
    short: "台鋼",
    en: "TSG-HAWKS",
    initial: "T",
    color: "green",
    hexAccent: "#15803D", // 台鋼綠
  },
];

const LOCAL_STORAGE_KEY = "z27_team";

/** Read myTeam from localStorage · returns null if not set or invalid */
export function getMyTeam(): CpblTeamId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    if (CPBL_TEAMS.some((t) => t.id === raw)) return raw as CpblTeamId;
    return null;
  } catch {
    return null;
  }
}

/** Write myTeam to localStorage · pass null to clear */
export function setMyTeam(team: CpblTeamId | null): void {
  if (typeof window === "undefined") return;
  try {
    if (team === null) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, team);
    }
  } catch {
    // ignore localStorage quota errors
  }
}

/** Lookup team by ID · returns null if not found */
export function getTeamById(id: CpblTeamId | null | undefined): CpblTeam | null {
  if (!id) return null;
  return CPBL_TEAMS.find((t) => t.id === id) ?? null;
}

/** Lookup team by Chinese name(matches `name` or `short`)*/
export function getTeamByName(name: string): CpblTeam | null {
  return CPBL_TEAMS.find((t) => t.name === name || t.short === name) ?? null;
}
