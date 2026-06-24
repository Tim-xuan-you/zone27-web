// ── ZONE 27 · 你的未結算押注(open positions)· 共用建構器 ──────────────────────
// 「the missing middle」:押下去到打完之間那段。 以前只有 /member 用它;現在 /member/collection
// 的空狀態也要它 —— 戰功卡只在「結算後」誕生(computeTrophies 只收已結算),但用戶一鎖一手,
// 系統裡就有一個真實、不可改、本人簽下的物件。 那張卡不該等結算才出現,該在鎖定當下就以
// 「進行中」形態誕生,結算時再翻面成永久戰功卡 → 頁面從第一手起就活著,不是從第一次結算才活著。
//
// 🔴 全真資料(本人真鎖的 pick × 真賽程),不造假 —— 結算時自然翻成 ✓/✕(含輸照收)。
// server-safe 純函式(getMatchPhase 讀 Date.now → 呼叫頁需是 dynamic;/member 與 collection 皆是)。
// 從 app/member/page.tsx 抽出(單一真相 · 兩頁同源不漂移)。
// ─────────────────────────────────────────────────────

import { getMatchPhase, type Match } from "@/lib/matches";
import type { UserPredictionsMap } from "@/lib/predictions";
import type { OpenPosition } from "@/components/OpenPositionCard";
import { isBouMarketId, bouLineFromMarketId } from "@/lib/baseball-totals";

/** 卡片緊湊日期 "2026 · 06 · 05 · 星期X" → "06/05"(未來場才顯)。 */
export function compactDate(dateStr: string): string {
  const parts = dateStr.split("·").map((s) => s.trim());
  return parts.length >= 3 && parts[1] && parts[2]
    ? `${parts[1]}/${parts[2]}`
    : "";
}

/** 持倉排序:進行中 → 今晚待開 → 未來(最急的在最上面)。 */
export function phaseRank(phase: OpenPosition["phase"]): number {
  return phase === "today-live" ? 0 : phase === "today-pregame" ? 1 : 2;
}

/**
 * 你的未結算押注(賽前鎖、還沒結算的場)· 本人 picks × 賽事清單推導(0 migration)。
 * 只收 today-live / today-pregame / future(未結算)· home/away(predictions 表只存這兩個)。
 * 賽後該場 phase 變 final/archived → 自動離開此清單 → 進戰功卡(computeTrophies)。
 * 棒球(CPBL/MLB)· 傳哪些比賽就只處理哪些(各頁用自己的 allWithMlb)。
 */
export function buildOpenPositions(
  predictionsMap: UserPredictionsMap,
  matches: Match[],
): OpenPosition[] {
  const byId = new Map(matches.map((m) => [m.id, m] as const));
  const out: OpenPosition[] = [];

  // ── 一般「誰贏」(h2h)· 場號 = 賽事 id ──────────────────────────────────────
  for (const m of matches) {
    const entry = predictionsMap[m.id];
    // table 只存 home/away · 但 map 型別保留舊的 "skip" · skip 不是一手持倉
    if (!entry || (entry.pick !== "home" && entry.pick !== "away")) continue;
    const phase = getMatchPhase(m);
    if (phase !== "today-live" && phase !== "today-pregame" && phase !== "future") {
      continue;
    }
    out.push({
      matchId: m.id,
      homeName: m.home.name,
      awayName: m.away.name,
      startTime: m.startTime,
      dateLabel: compactDate(m.date),
      myPick: entry.pick,
      myTeamEn: entry.pick === "home" ? m.home.en : m.away.en,
      league: m.league,
      engineHomePicked: m.home.winRate >= m.away.winRate,
      engineConfidence: Math.max(m.home.winRate, m.away.winRate),
      phase,
    });
  }

  // ── 大小分玩法(~bou)· R260:掃 prop 場號 → 解父場(剝後綴)→ 父場未結算才當「在飛的」。 ──
  //   以前 buildOpenPositions 只比對 predictionsMap[m.id](誰贏場號)→ 大小分押注場號是
  //   `{id}~bou{線}`、永遠對不到 → 大小分玩家的這頁全空(founder dogfood 真痛點)。
  for (const [id, entry] of Object.entries(predictionsMap)) {
    if (!isBouMarketId(id)) continue;
    if (entry.pick !== "home" && entry.pick !== "away") continue;
    const parentId = id.split("~")[0];
    const m = byId.get(parentId);
    if (!m) continue;
    const phase = getMatchPhase(m);
    if (phase !== "today-live" && phase !== "today-pregame" && phase !== "future") {
      continue;
    }
    const line = bouLineFromMarketId(id);
    if (line === null) continue;
    out.push({
      matchId: id,
      homeName: m.home.name,
      awayName: m.away.name,
      startTime: m.startTime,
      dateLabel: compactDate(m.date),
      myPick: entry.pick,
      myTeamEn: "", // 玩法不掛隊徽(看大/看小不是一隊)
      league: m.league,
      engineHomePicked: false, // 玩法隱藏「誰贏」引擎勝率線(卡片用 market 旗標判斷)
      engineConfidence: 0,
      phase,
      market: {
        label: "大小分",
        pickName: `${entry.pick === "home" ? "看大" : "看小"} ${line}`,
      },
    });
  }

  return out.sort((a, b) => phaseRank(a.phase) - phaseRank(b.phase));
}
