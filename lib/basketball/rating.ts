// ── ZONE 27 · 籃球隊伍淨得分(效率種子分 · 誠實估計)──────────────────────────────
// v0.1 用「真實賽季得失分」種子化每隊的「淨得分」(= 平均每場對上聯盟平均贏/輸幾分)· 餵效率引擎。
// 同其他運動 rating:這是**編輯估計值、不是官方數據**,隨真實賽果一場一場更新(Wave 2)。
//
// 🔴 認不出 / 查不到數據的隊伍 → 不放進來(netRatingOf 回 null = 引擎不硬開、誠實「算不出」)·
//   同羽球「查不到排名不開盤」。 寧缺勿錯:寧可少開幾場,不亂猜一隊強弱去灌假盤。
//
// ⚠️ WNBA 2026 種子(2026 賽季首月真實戰績 + 攻防效率排名換算 · ESPN/官方公開數據)· Tim 之後
//   截圖標準得失分 → 升級成乾淨的「每場得分−失分」淨值(同 CPBL 投手真值覆蓋估計)。
//   現只放有公開數據可依的隊;其餘 WNBA 隊 + NBA(休季)等 Tim 餵真實得失分再開。
// ─────────────────────────────────────────────────────

export type BasketballTeamRating = {
  /** 淨得分(估計)· 平均每場對上聯盟平均的分差 · 正=強、負=弱 · 隨真實賽果更新 */
  net: number;
};

// key = 英文隊名 slug(穩定 · 不隨顯示名變)。 net = 2026 賽季首月戰績/效率換算估計。
export const TEAM_RATINGS: Record<string, BasketballTeamRating> = {
  "minnesota-lynx": { net: 7 }, // 7-2 · 聯盟第一防守(失分 79.1)
  "atlanta-dream": { net: 6 }, // 6-2 · 防守效率第二(100.0 · 失分 79.7)
  "las-vegas-aces": { net: 4 }, // 6-3 · 客場 6-1
  "golden-state-valkyries": { net: 3 }, // 6-3 · 防守效率 102.0 · 失分 79.3(第二少)
  "new-york-liberty": { net: 2 }, // 6-5 · 攻第5/守第6
  "portland-fire": { net: 1 }, // 6-5
  "toronto-tempo": { net: 0 }, // 5-4 · 進攻效率 110.2(第四)
  "indiana-fever": { net: -1 }, // 4-5 · 進攻最強(91.8)但防守倒數第二(89.0)
  "connecticut-sun": { net: -10 }, // 聯盟最差淨效率(約 −16 · 保守取 −10)
};

/** 隊伍淨得分(估計)· 查不到 → null = 引擎不開盤(誠實「算不出」)。 */
export function netRatingOf(teamKey: string): number | null {
  const r = TEAM_RATINGS[teamKey];
  return r ? r.net : null;
}
