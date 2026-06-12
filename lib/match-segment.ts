// ── ZONE 27 · 誰賽前鎖了這場(per-match segment 資料層)──────────────────────
// Strava 的真正留存引擎不是全站總榜,是「segment」—— 只跟「跑過同一段路的人」比。
// 我們的 segment = 「賽前鎖了同一場的人」:這一場有誰賽前押了手、押哪邊,賽後誰押對。
// 走 0022 get_ladder_entries(公開署名 · 同脈動 / 天梯口徑 · React-cached 同頁共用一次 RPC)·
// 同一人同場只取最近一筆 · 0 新 migration · 錯 / 空 → []。
//
// 🔴 紅線:只按「賽後誰押對」排(非 PnL / 人氣 / 粉絲數)· 含輸照掛 · 每格連 /u 公開校準檔。
// ─────────────────────────────────────────────────────

import { fetchLadderRows } from "@/lib/ladder-rows";

export type SegmentLocker = {
  /** 永久碼(公開署名 + 連 /u 校準檔) */
  authorCode: string;
  /** 顯示 handle(顯示名 or「球迷 #碼」) */
  handle: string;
  /** 押的邊(棒球 home/away · 足球三向含 draw) */
  pick: "home" | "away" | "draw";
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * 撈「賽前鎖了這場」的所有人(公開署名 · 已按 created_at desc · 同一人同場取最近一筆)。
 * 純讀公開 ladder(anon · ISR-safe · 不破 SSG)· 0 migration · 任何錯 → []。
 */
export async function getMatchSegment(matchId: string): Promise<SegmentLocker[]> {
  if (!matchId) return [];
  const rows = await fetchLadderRows();
  const out: SegmentLocker[] = [];
  const seen = new Set<string>(); // 同一人同場只算最近一筆(rows 已 desc → first-seen = 最新)
  for (const r of rows) {
    if (str(r.match_id) !== matchId) continue;
    const code = str(r.author_code);
    if (!code || seen.has(code)) continue;
    const pick =
      r.pick === "home" || r.pick === "away" || r.pick === "draw"
        ? r.pick
        : null;
    if (!pick) continue;
    seen.add(code);
    out.push({
      authorCode: code,
      handle: str(r.handle) || `球迷 #${code}`,
      pick,
    });
  }
  return out;
}
