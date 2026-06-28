// ── ZONE 27 · 籃球隊伍淨得分(效率種子分 · 誠實估計)──────────────────────────────
// v0.1 用「真實賽季得失分」種子化每隊的「淨得分」(= 平均每場對上聯盟平均贏/輸幾分)· 餵效率引擎。
// 同其他運動 rating:這是**編輯估計值、不是官方數據**,隨真實賽果一場一場更新(Wave 2)。
//
// 🔴 認不出 / 查不到數據的隊伍 → 不放進來(netRatingOf 回 null = 引擎不硬開、誠實「算不出」)·
//   同羽球「查不到排名不開盤」。 寧缺勿錯:寧可少開幾場,不亂猜一隊強弱去灌假盤。
//
// ⚠️ WNBA 2026 種子 = 從**真實賽季戰績(勝率)**換算的淨得分估計(Wikipedia 2026 賽季標準戰績 ·
//   net ≈ (勝率 − .5) × 36)· 這是「戰績代理」非實際每場得失分 —— Tim 之後截圖標準得失分 → 升級成
//   乾淨的「每場得分−失分」真值(同 CPBL 投手真值覆蓋估計)。 認不出 / 沒戰績的隊不放 → 引擎不開。
// ─────────────────────────────────────────────────────

export type BasketballTeamRating = {
  /** 淨得分(估計)· 平均每場對上聯盟平均的分差 · 正=強、負=弱 · 隨真實賽果更新 */
  net: number;
};

// key = 英文隊名 slug(穩定 · 不隨顯示名變)。 net = 2026 賽季戰績(勝率)換算估計 · 隨賽果更新。
export const TEAM_RATINGS: Record<string, BasketballTeamRating> = {
  "minnesota-lynx": { net: 9 }, // 14-4 .778 · 聯盟最強
  "las-vegas-aces": { net: 8 }, // 13-5 .722
  "new-york-liberty": { net: 5 }, // 12-7 .632
  "golden-state-valkyries": { net: 5 }, // 12-7 .632 · 防守強
  "atlanta-dream": { net: 5 }, // 12-7 .632
  "dallas-wings": { net: 4 }, // 11-7 .611
  "indiana-fever": { net: 3 }, // 11-8 .579
  "washington-mystics": { net: -1 }, // 8-9 .471
  "portland-fire": { net: -3 }, // 8-11 .421
  "chicago-sky": { net: -6 }, // 6-12 .333
  "connecticut-sun": { net: -10 }, // 4-15 .211 · 聯盟最弱
};

/** 隊伍淨得分(估計)· 查不到 → null = 引擎不開盤(誠實「算不出」)。 */
export function netRatingOf(teamKey: string): number | null {
  const r = TEAM_RATINGS[teamKey];
  return r ? r.net : null;
}
