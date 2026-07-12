// ── ZONE 27 · 網球賽果自動配對(server-safe · 純函式)──────────────────────────
// lib/tennis-results.json(ESPN 官方鏡像 · scripts/fetch-tennis-results.mjs · GitHub Action 每 3h)
// → 用 draw 的「兩位球員英文名 + 賽事 + 開賽日」對帳,回該場賽果(a/b 視角 + 比分)。 對不到 → null。
//
// 🔴 帳本誠實鐵律(同 CPBL resolveCpblResult):
//   · 手動 finalResult 永遠優先(這支只補「沒手動結果」的場 · 見 matches.ts augment)。
//   · 必須「兩位英文名都對上 **且** 賽事對上(別名)」才算配對 —— 防同兩人在別的賽事撞名(45% 球員
//     對在鏡像裡出現超過一次:同兩人可能溫網一場、哈勒一場、贏家還相反)→ 不加賽事閘=結錯贏家。
//   · 還有開賽日 → 再加 ±窗口(防跨年同賽事同對戰再戰)。 同賽事候選贏家不一致 → 不猜(null)。
//   · 對不到一律退手動 pending(寧缺勿錯)· display 仍是運彩中文名(zh)· 只用英文名 en 當對帳 key。
//   · 純函式 · 0 I/O(JSON 靜態 import · 同 cpbl-results.json)· 進得了 server component。
// ─────────────────────────────────────────────────────

import mirror from "@/lib/tennis-results.json";

// 兩向(同 matches.ts 的 TennisPick)· 在此 local 宣告,避免跟 matches.ts 互 import 成環
// (matches.ts 要 import 本檔的 matchTennisResult 來 augment TENNIS_DRAW)。
type TennisPick = "a" | "b";

type MirrorGame = {
  tour: string;
  tournament: string;
  grouping: string;
  date: string; // YYYY-MM-DD
  winnerName: string;
  loserName: string;
  score: string;
  retired?: boolean;
};

const GAMES: MirrorGame[] = ((mirror as { games?: MirrorGame[] }).games ?? []).filter(
  (g) => g && typeof g.winnerName === "string" && typeof g.loserName === "string",
);

// 對帳正規化:去重音 / 標點 / 大小寫(同 fetch script 的 norm · 兩邊一致才配得上)。
// R296 · 再去世代後綴(Jr./Sr./II–IV):ESPN 鏡像寫「Martin Damm」、運彩/籤表寫
// 「Martin Damm Jr.」→ 同一人配不上 = 賽果明明在鏡像裡卻永遠 pending(tn-0629-2017 實例)。
// 兩邊名字都過同一支 norm,所以只改這裡就一致;賽事閘 + 日期窗仍擋同名父子撞場。
function norm(s: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // 去重音(combining diacritical marks U+0300–U+036F)
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\b\.?/g, "") // 世代後綴不是名字(只在字界 · 不動 junior 等實字)
    .replace(/[^a-z0-9]/g, "");
}

// 預先用「無序球員對」索引 → 該對戰的**所有**鏡像場(不只最新 · 要靠賽事/日期再篩 · 不能先丟掉)。
const byPair = new Map<string, MirrorGame[]>();
for (const g of GAMES) {
  const a = norm(g.winnerName);
  const b = norm(g.loserName);
  if (!a || !b || a === b) continue;
  const key = [a, b].sort().join("|");
  const arr = byPair.get(key);
  if (arr) arr.push(g);
  else byPair.set(key, [g]);
}

// 運彩賽事中文名 → ESPN 鏡像英文名關鍵字(鏡像 tournament 含任一關鍵字才算同賽事)。
// 🔴 沒對應別名的賽事 → 一律不認(寧缺勿錯 · 新賽事先在這加一行,否則該賽事的場維持手動 pending)。
const TOURNAMENT_ALIASES: { zh: string; en: string[] }[] = [
  { zh: "伊斯特本", en: ["eastbourne"] },
  { zh: "溫布頓", en: ["wimbledon"] },
  { zh: "馬約卡", en: ["mallorca"] },
  { zh: "巴特洪堡", en: ["bad homburg", "homburg"] },
  { zh: "普羅夫迪夫", en: ["plovdiv"] },
];
function tournamentMatches(drawZh: string, mirrorEn: string): boolean {
  const alias = TOURNAMENT_ALIASES.find((a) => (drawZh ?? "").includes(a.zh));
  if (!alias) return false;
  const en = (mirrorEn ?? "").toLowerCase();
  return alias.en.some((k) => en.includes(k));
}

const DATE_WINDOW_DAYS = 5; // 開賽日 ±5 天內才算同一場(吸收時區 + 多日賽事 · 擋跨年同賽事再戰)。
function dayOf(iso: string | null | undefined): string {
  return typeof iso === "string" ? iso.slice(0, 10) : "";
}
function withinWindow(mirrorDate: string, expectedDay: string): boolean {
  if (!expectedDay) return true; // 開賽日不可解析(運彩相對時間)→ 不卡日期、只靠賽事閘
  const a = Date.parse(`${mirrorDate}T00:00:00Z`);
  const b = Date.parse(`${expectedDay}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return true;
  return Math.abs(a - b) <= DATE_WINDOW_DAYS * 86400000;
}

export type TennisAutoResult = { winner: TennisPick; score: string; retired: boolean };

/**
 * 用 draw 兩位球員英文名 + 賽事中文名(+ 選填開賽日)對 ESPN 鏡像 → 賽果(a/b 視角)。
 * 必須「兩名都對 + 賽事對(別名)+ 開賽日在窗口」· 同賽事候選贏家不一致 → null。 對不到 → null。
 * deterministic 純函式(不用 Date.now · 只比傳入的開賽日 vs 鏡像日)。
 */
export function matchTennisResult(
  aEn: string,
  bEn: string,
  tournamentZh: string,
  expectedISO?: string | null,
): TennisAutoResult | null {
  const a = norm(aEn);
  const b = norm(bEn);
  if (!a || !b || a === b) return null;
  const all = byPair.get([a, b].sort().join("|"));
  if (!all || all.length === 0) return null;
  const expDay = dayOf(expectedISO);
  // 賽事閘 + 開賽日窗口:只認「這個賽事、這個時間」的賽果(擋跨賽事 / 跨年撞名)。
  const cands = all.filter(
    (g) => tournamentMatches(tournamentZh, g.tournament) && withinWindow(g.date, expDay),
  );
  if (cands.length === 0) return null; // 這賽事這時間對不到 → 退手動 pending(那場可能還沒打完)
  // 同對戰同賽事窗口多筆(ATP/WTA 重複 fetch · 或極少同賽事再戰)→ 贏家必須一致,否則不猜。
  const winners = new Set(cands.map((g) => norm(g.winnerName)));
  if (winners.size > 1) return null;
  const g = cands.reduce((mx, x) => (x.date > mx.date ? x : mx), cands[0]); // 取最新代表(內容一致)
  const w = norm(g.winnerName);
  const winner: TennisPick | null = w === a ? "a" : w === b ? "b" : null;
  if (!winner) return null;
  return { winner, score: g.score, retired: !!g.retired };
}

/** 鏡像場數(debug / 揭露用)。 */
export function tennisMirrorCount(): number {
  return GAMES.length;
}
