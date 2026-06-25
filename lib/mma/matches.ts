import { predictFight, toDisplayPercents, MmaFighterRating } from "@/lib/mma/engine";
import { ratingFromTier, type MmaTier } from "@/lib/mma/rating";

// ── ZONE 27 · UFC / MMA 真實賽卡(台灣運彩在賣的場 · 名字一字不改)──────────────────────
// CPBL / 網球 / 羽球模式:Tim 從台灣運彩看板手 curate 真實對戰(運彩 = 覆蓋目錄,我們只查它賣哪些場 →
// 用自己引擎跑 → 只秀自己機率,絕不爬盤口、絕不顯示賠率)。 選手實力分由「公開戰績 + FightMatrix 風格
// 排名」種子化成戰力等級(誠實估計)→ 引擎算兩向勝率。 隔離在 lib/mma(不碰棒球/足球/網球/羽球)。
//
// 🔴 米其林式克制(MMA 比任何運動都吃重 · 本檔靈魂):不是每場都開盤。 選手認不出 / 資料太薄
//   (新人首戰、臨時換人、obscure 區域選手)→ tier=null,引擎不硬開,誠實標「算不出」。
//   🔴 但 Tim 鐵律(全運動一致):**能上架的卡就要能押** —— 引擎開不開得出線,不影響可不可押
//   (押的是「你看好誰」· 引擎沒選邊 → 那場就沒「你 vs 引擎」對照而已)。 名字一律用運彩的(zh)·
//   id = mma- + 運彩場次編號(可追溯)· 賽果 Tim 賽後手 curate(同 CPBL / 網球 / 羽球 · MMA 暫無自動鏡像)。
// ─────────────────────────────────────────────────────

export type MmaPick = "a" | "b";

export type MmaFighter = {
  /** 運彩顯示名(一字不改) */
  zh: string;
  /** 英文全名(辨識用 · 之後自動結算對帳 key · 認不出 = "?") */
  en: string;
  /** 戰力等級(種子估計)· null = 認不出 / 資料太薄 → 不開盤(誠實「算不出」) */
  tier: MmaTier | null;
};

export type MmaFinalResult = {
  /** 贏的那邊(a / b) */
  winner: MmaPick;
  /** 收場方式(選填 · 例「KO R1」「降伏 R2」「判定」) */
  method?: string;
  /** 結算時戳 ISO */
  settledAt?: string;
  /** 🔴 和局 / 無效比賽(罕見但存在 · 不像網球)· true = 不計任何一方贏(結算層吞,不硬判) */
  draw?: boolean;
};

export type MmaFight = {
  /** mma- + 運彩場次編號 */
  id: string;
  /** 賽事名(運彩) */
  event: string;
  /** 量級 */
  weightClass: string;
  /** 運彩時間字串(台北 · 例「6/27 21:00」) */
  time: string;
  a: MmaFighter;
  b: MmaFighter;
  /** 賽果(Tim 賽後手 curate)· 沒設 = 待結算 */
  finalResult?: MmaFinalResult;
};

// 運彩賽卡列的總場數(誠實揭露覆蓋率用 · UFC 格鬥之夜:Fiziev vs Torres · 巴庫 · 共 12 場)。
export const LISTED_FIGHTS = 12;

// ⬇️ 真實賽卡(從台灣運彩 curate · 2026-06-27 UFC Fight Night: Fiziev vs Torres · 巴庫)。
//   選手身分 + 戰力等級由 12-agent 上網研究查證(Tapology/UFC.com/Sherdog)· 認不出/首戰太薄 → tier null。
//   🔴 種子等級 = 編輯估計(公開戰績 + 排名換算)· 不是官方數據 · 隨真實賽果更新(同網球/羽球種子分)。
export const MMA_CARD: MmaFight[] = [
  // ── 主賽(共主賽 + 主賽事)──
  { id: "mma-962", event: "UFC 格鬥之夜 · 巴庫", weightClass: "輕量級", time: "6/28 01:40",
    a: { zh: "曼紐爾.托雷斯", en: "Manuel Torres", tier: "ranked" },
    b: { zh: "拉斐爾.菲茲耶夫", en: "Rafael Fiziev", tier: "ranked" } },
  { id: "mma-961", event: "UFC 格鬥之夜 · 巴庫", weightClass: "中量級", time: "6/28 01:20",
    a: { zh: "米歇爾.佩雷拉", en: "Michel Pereira", tier: "ranked" },
    b: { zh: "S.馬戈梅多夫", en: "Shara Magomedov", tier: "ranked" } },
  { id: "mma-960", event: "UFC 格鬥之夜 · 巴庫", weightClass: "輕量級", time: "6/28 01:00",
    a: { zh: "馬修斯.卡米洛", en: "Matheus Camilo", tier: "roster" },
    b: { zh: "納齊姆.薩德霍夫", en: "Nazim Sadykhov", tier: "gatekeeper" } },
  { id: "mma-959", event: "UFC 格鬥之夜 · 巴庫", weightClass: "蠅量級", time: "6/28 00:40",
    a: { zh: "查爾斯.強森", en: "Charles Johnson", tier: "gatekeeper" },
    b: { zh: "A.阿爾馬巴耶夫", en: "Asu Almabayev", tier: "ranked" } },
  { id: "mma-958", event: "UFC 格鬥之夜 · 巴庫", weightClass: "中量級", time: "6/28 00:20",
    a: { zh: "布魯諾.費雷拉", en: "Brunno Ferreira", tier: "gatekeeper" },
    b: { zh: "I.阿里斯克魯斯", en: "Ikram Aliskerov", tier: "ranked" } },
  { id: "mma-957", event: "UFC 格鬥之夜 · 巴庫", weightClass: "中量級", time: "6/28 00:00",
    a: { zh: "M.奧列克謝丘克", en: "Michal Oleksiejczuk", tier: "gatekeeper" },
    b: { zh: "阿布斯.馬戈梅多夫", en: "Abus Magomedov", tier: "gatekeeper" } },
  // ── 前段賽 ──
  { id: "mma-955", event: "UFC 格鬥之夜 · 巴庫", weightClass: "次中量級", time: "6/27 23:00",
    a: { zh: "艾瑞克.諾蘭", en: "Eric Nolan", tier: "roster" },
    b: { zh: "法爾曼.哈薩諾夫", en: "Farman Hasanov", tier: "roster" } },
  { id: "mma-953", event: "UFC 格鬥之夜 · 巴庫", weightClass: "中量級", time: "6/27 22:20",
    a: { zh: "A.普利亞耶夫", en: "Andrey Pulyaev", tier: "roster" },
    b: { zh: "N.魯茲博耶夫", en: "Nursulton Ruziboev", tier: "gatekeeper" } },
  { id: "mma-952", event: "UFC 格鬥之夜 · 巴庫", weightClass: "羽量級", time: "6/27 22:00",
    a: { zh: "哈維爾.賈耶斯", en: "Javier Reyes", tier: "roster" },
    b: { zh: "卡恩.奧夫利", en: "Kaan Ofli", tier: "roster" } },
  { id: "mma-951", event: "UFC 格鬥之夜 · 巴庫", weightClass: "次中量級", time: "6/27 21:40",
    a: { zh: "西奧多.貝爾格倫", en: "Theodor Berggren", tier: null }, // 首戰替補 · 資料太薄 → 算不出(可押無引擎線)
    b: { zh: "丹尼爾.唐谷科", en: "Daniil Donchenko", tier: "roster" } },
  { id: "mma-950", event: "UFC 格鬥之夜 · 巴庫", weightClass: "雛量級", time: "6/27 21:20",
    a: { zh: "吉恩.松本", en: "Jean Matsumoto", tier: "roster" },
    b: { zh: "貝克.阿爾馬汗", en: "Bekzat Almakhan", tier: "roster" } },
  { id: "mma-956", event: "UFC 格鬥之夜 · 巴庫", weightClass: "次中量級", time: "6/27 21:00",
    a: { zh: "傑佛遜.納西門托", en: "Jefferson Nascimento", tier: "roster" },
    b: { zh: "T.阿卜杜拉茲科夫", en: "Tahir Abdullayev", tier: "gatekeeper" } },
];

/** 查一場(mma- 場次編號)。 */
export function getMmaFight(id: string): MmaFight | undefined {
  return MMA_CARD.find((m) => m.id === id);
}

function ratingOf(f: MmaFighter): MmaFighterRating | null {
  return f.tier ? { overall: ratingFromTier(f.tier) } : null;
}

/** 這場能不能誠實開盤? 兩位都有戰力等級(認得出)。 */
export function lineable(m: MmaFight): boolean {
  return m.a.tier !== null && m.b.tier !== null;
}

export type DrawLine = { aWin: number; bWin: number; pick: MmaPick | null };

/** 引擎兩向勝率(整數 · 相加 100)· 走 engine.ts 同一套(零 drift)· 不可開盤 → null。
 *  🔴 pick=null = 同等級「純銅板、引擎沒選邊」(MMA 半數場是這樣 · 誠實,不硬選邊灌進戰績)。 */
export function drawLine(m: MmaFight): DrawLine | null {
  const ra = ratingOf(m.a);
  const rb = ratingOf(m.b);
  if (!ra || !rb) return null;
  const pred = predictFight(ra, rb);
  const d = toDisplayPercents(pred);
  const pick: MmaPick | null =
    pred.aWin === pred.bWin ? null : pred.aWin > pred.bWin ? "a" : "b";
  return { aWin: d.aWin, bWin: d.bWin, pick };
}

/** 看板統計:總場數 / 引擎開盤場數 / 有傾向場數(誠實揭露覆蓋率 + 「半數是銅板」)。 */
export function drawCounts(): { shown: number; lined: number; leaned: number; listed: number } {
  let lined = 0;
  let leaned = 0;
  for (const m of MMA_CARD) {
    const line = drawLine(m);
    if (line) {
      lined += 1;
      if (line.pick !== null) leaned += 1;
    }
  }
  return { shown: MMA_CARD.length, lined, leaned, listed: LISTED_FIGHTS };
}

// ── 賽前鎖定押注 + 你的 MMA 戰績(純函式 · server-safe 單一真相 · 鏡網球/羽球)──────────

const MMA_SEASON_YEAR = 2026;

/** 運彩時間字串 → 台北 ISO(可解析的 "M/D HH:MM" 才回 · 相對時間 / 無時戳 → null)。 */
export function matchStartISO(m: MmaFight): string | null {
  const mm = m.time.match(/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/);
  if (!mm) return null;
  const [, mo, d, h, mi] = mm;
  const pad = (s: string) => s.padStart(2, "0");
  return `${MMA_SEASON_YEAR}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00+08:00`;
}

/** 這場可不可以「賽前鎖定押注」? 還沒結算 + 有明確開賽時戳(client 端再判未開賽)。
 *  🔴 Tim 鐵律:能上架就能押 —— 引擎開不開得出線不影響可不可押(認不出的場、你的判斷比引擎值錢)。 */
export function bettable(m: MmaFight): string | null {
  if (m.finalResult) return null;
  return matchStartISO(m);
}

/** 引擎當初看好邊(有傾向的 lineable 場)· id → "a"/"b"(銅板場不列)。 */
export function mmaEnginePicks(): Record<string, MmaPick> {
  const out: Record<string, MmaPick> = {};
  for (const m of MMA_CARD) {
    const line = drawLine(m);
    if (line && line.pick) out[m.id] = line.pick;
  }
  return out;
}

/** 已結算賽果(Tim curate 的 finalResult · 和局排除)· id → { outcome, startISO }· 給用戶押注對帳。 */
export function mmaResults(): Record<string, { outcome: MmaPick; startISO: string }> {
  const out: Record<string, { outcome: MmaPick; startISO: string }> = {};
  for (const m of MMA_CARD) {
    const fr = m.finalResult;
    if (fr && !fr.draw) {
      out[m.id] = {
        outcome: fr.winner,
        startISO: matchStartISO(m) ?? fr.settledAt ?? "",
      };
    }
  }
  return out;
}

export type MmaEngineRecord = {
  n: number;
  hits: number;
  misses: number;
  rate: number | null;
  pending: number;
};

/** 引擎公開戰績(含輸 · 賽前開盤 vs 賽後賽果)· 只算「有傾向」的場(銅板不算)· 和局不計。 */
export function gradeMmaEngine(): MmaEngineRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  for (const m of MMA_CARD) {
    const line = drawLine(m);
    if (!line || !line.pick) continue; // 沒開盤 / 純銅板 → 不進引擎戰績
    const fr = m.finalResult;
    if (!fr || fr.draw) {
      if (!fr) pending += 1;
      continue;
    }
    n += 1;
    if (line.pick === fr.winner) hits += 1;
  }
  return {
    n,
    hits,
    misses: n - hits,
    rate: n > 0 ? Math.round((hits / n) * 100) : null,
    pending,
  };
}

/** 一筆 MMA 押注(兩向 a/b · 賽前鎖定時戳)。 */
export type MmaPickRow = { matchId: string; pick: MmaPick; ts: string };

export type MmaRecord = {
  n: number;
  hits: number;
  misses: number;
  rate: number | null;
  pending: number;
  late: number;
  vsN: number;
  vsYouHits: number;
  vsEngineHits: number;
  vsYouRate: number | null;
  vsEngineRate: number | null;
};

/**
 * 兩向對帳(A 勝 / B 勝)· **先鎖後結**:押注時間 ≥ 開賽 → 不計入(同棒球/足球/網球/羽球)。
 * 純函式 deterministic。 🔴 含輸:✕ 跟 ✓ 一樣進分母。 和局(results 不含)→ 該場自然落 pending。
 */
export function gradeMmaPicks(
  picks: MmaPickRow[],
  results: Record<string, { outcome: MmaPick; startISO: string }>,
  enginePicks: Record<string, MmaPick> = {},
): MmaRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  let late = 0;
  let vsN = 0;
  let vsYouHits = 0;
  let vsEngineHits = 0;
  for (const p of picks) {
    const r = results[p.matchId];
    if (!r) {
      pending += 1;
      continue;
    }
    const t = Date.parse(p.ts);
    const k = Date.parse(r.startISO);
    if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) {
      late += 1;
      continue;
    }
    n += 1;
    const youHit = p.pick === r.outcome;
    if (youHit) hits += 1;
    const ePick = enginePicks[p.matchId];
    if (ePick === "a" || ePick === "b") {
      vsN += 1;
      if (youHit) vsYouHits += 1;
      if (ePick === r.outcome) vsEngineHits += 1;
    }
  }
  return {
    n,
    hits,
    misses: n - hits,
    rate: n > 0 ? Math.round((hits / n) * 100) : null,
    pending,
    late,
    vsN,
    vsYouHits,
    vsEngineHits,
    vsYouRate: vsN > 0 ? Math.round((vsYouHits / vsN) * 100) : null,
    vsEngineRate: vsN > 0 ? Math.round((vsEngineHits / vsN) * 100) : null,
  };
}
