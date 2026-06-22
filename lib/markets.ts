// ── ZONE 27 · 開盤 · 群眾預測市場(R239 · Tim 截圖任一場 → 馬上開一張卡)──────────────
// 我們的引擎只覆蓋部分賽事(CPBL / MLB / 世界盃等)。 但賭徒想押的場很多 —— 任何一場,
// Tim 截圖一張(用 台灣運彩 的「目錄」當參考:它賣哪些場),我就在這裡開一張「群眾盤」:
// 所有登入會員都能賽前鎖一手(主勝/和/客勝)+ 留一句為什麼 + 看群眾共識線 + 賽後對帳。
//
// 🔴 命門紅線:
//   · **絕不秀盤口/賠率**。 台灣運彩是「覆蓋目錄」不是「內容來源」—— 我們只拿它當「有哪些場」
//     的參考,卡上只放我們自己的東西(群眾共識 % + 誰押了 + 理由),0 盤口、0 莊家賠率。
//   · **這是群眾盤,不是引擎盤**:引擎沒覆蓋 = 卡上沒有「引擎機率/引擎開盤線」(明寫「無引擎線」)·
//     不混進引擎公開戰績 / 校準(match_id 用 `mkt-` 前綴 → 不被當 cpbl/mlb/fd 的引擎場)。
//   · **0 金額 · 0 對賭 · 押了不可改**(同 0003 法律邊界 · 純精神預測 = 遊戲)· 賽後逐場對帳、連輸都留。
//   · **賽前鎖定以公開提交時間為證**(同分析師看法 · commit 時間戳 = 開賽前鐵證)· 絕不 back-date。
//
// 為什麼 0 migration:用戶鎖手走既有 submit_prediction(match_id 是純 text · 無 allowlist)·
//   群眾共識走 get_match_prediction_tally · 「誰鎖了+理由」走 get_ladder_entries(getMatchSegment)·
//   全部 by match_id · 對任意 `mkt-*` 場直接成立。 本檔只負責「定義有哪些場 + 賽後賽果」。
//
// curate = Tim 截圖 → 給「聯盟 + 兩隊 + 開賽時間(+ 哪邊主場)」→ Claude 加一筆 commit(卡上線)。
//   賽後 Tim 給比分/結果 → Claude 填 result + settledAt(卡標 ✓ 結果)。 永不刪。
// ─────────────────────────────────────────────────────

export type MarketResult = "home" | "draw" | "away";

export type AdHocMarket = {
  /** `mkt-*`(不可與 cpbl/mlb/fd 撞 · 才不會污染引擎戰績/校準) */
  id: string;
  /** 顯示用運動標(足球 / 籃球 / …) */
  sport: string;
  /** 聯盟/賽事名(顯示用 · 例「冰島超級聯賽」) */
  league: string;
  home: string;
  away: string;
  /** 開賽(ISO · 含時區)· 賽前鎖定閘 + 顯示用 */
  kickoffISO: string;
  /** 賽果(Tim 賽後 relays → 填)· null/缺 = 尚未結算 */
  result?: MarketResult | null;
  /** 結算日(result 有值才填) */
  settledAt?: string;
};

// 🔴 從 Tim 的截圖開盤。 home/away 若一時無法從截圖判定 → 先以最合理讀法放、報告請 Tim 確認,
//    開賽前隨時可一字翻面(賽前鎖定的場、結算前改 home/away 無誠實問題;賽果出來前確認即可)。
export const MARKETS: AdHocMarket[] = [
  {
    // 台灣運彩 #1007 · 冰島超級聯賽 · 6/16 02:00(台北)· Tim 確認:阿克雷里(AKU)主、弗拉姆(FRR)客。
    id: "mkt-isl-260616-fram-akureyri",
    sport: "足球",
    league: "冰島超級聯賽",
    home: "阿克雷里",
    away: "弗拉姆",
    kickoffISO: "2026-06-16T02:00:00+08:00",
    // 賽果(Tim relays · 官方核對):阿克雷里 3 : 4 弗拉姆 → 客隊弗拉姆 90 分鐘正規賽取勝 = away。
    result: "away",
    settledAt: "2026-06-22",
  },
];

/** 開盤中(尚未結算)· 按開賽時間近→遠。 */
export function getOpenMarkets(): AdHocMarket[] {
  return MARKETS.filter((m) => !m.result).sort((a, b) =>
    a.kickoffISO.localeCompare(b.kickoffISO),
  );
}

/** 已結算(賽果已填)· 最近結算的在前。 */
export function getSettledMarkets(): AdHocMarket[] {
  return MARKETS.filter((m) => !!m.result).sort((a, b) =>
    (b.settledAt ?? b.kickoffISO).localeCompare(a.settledAt ?? a.kickoffISO),
  );
}

export function getMarketById(id: string): AdHocMarket | null {
  return MARKETS.find((m) => m.id === id) ?? null;
}
