// ── ZONE 27 · 站內結算收件匣 · 純函式核心 ──────────────────────────────────
// 「#1 大工程 = 結算通知 / 回訪觸發」的不卡網域、不卡 migration 那半(R230 roadmap #1)。
//
// 關鍵洞見:結算事件 = (你的押注) × (賽果),兩者都已經在站上 on-read 算得出來
//   → 收件匣**零 migration**(Tim 不用貼任何 SQL)、且天生跟「結算顯示永不靠 cron · 一律
//   on-read」鐵律一致。 不需要 notifications 表 —— 因為結算是「可推導的」純函式,不是
//   需要儲存的外部事件(留言/被追蹤才需要表)。
//
// 這支只做純計算(deterministic · 好測):server 端(lib/settlement-data.ts)把跨運動的
//   原始輸入收齊 → 這裡 grade 成「新到舊、含輸照收、標出哪些是『你不在時才結算的』」。
//
// 🔴 紅線(同回訪卡 · ReturnedWhileAwayCard):
//   · 含輸:命中(✓)跟落空(✕)同權重 —— 落空才是重點(會刪輸單的老師絕不敢上這個)。
//   · 平靜對帳語氣,不是賭場:無 PnL、無紅綠、無 confetti、無「你錯過了」。
//   · 先鎖後結:開賽後才押的不計入(同 isLatePick · 防賽後補登)。
//   · 首訪(無 last_seen 基準)→ 沒有「新」(newCount=0)· 只記基準,不發空頭通知。
// ─────────────────────────────────────────────────────

import { taipeiDayOf, isLatePick } from "@/lib/predictions";

export type SettlementSport = "baseball" | "soccer";

/**
 * 玩法押注(大小分 / 讓分)的顯示資訊。 缺(undefined)= 一般「誰贏」場 → 用隊名顯示(原行為)。
 * 設計依據(Polymarket / 運彩 My Bets 研究 · 把「線」烤進選擇字串):一注大小分跟一注「誰贏」
 * 用同一個列模板並排 —— 只是這一邊的顯示名變成「看大 8.5」而不是隊名。 outcomeName 已結算才有。
 * href:玩法沒有自己的單場收據(/receipts/{id}~bou 會 404)→ 連回父場(同 sport 的既有可達頁)。
 */
export type MarketInfo = {
  /** 玩法標籤,例:「大小分」「讓分」(顯示在運動標旁) */
  label: string;
  /** 你押那一邊的顯示名(線烤進去),例:「看大 8.5」「看小 8.5」「味全龍 −0.5」 */
  pickName: string;
  /** 結果顯示名(已結算才有),例:「收大 · 總分 13」 */
  outcomeName?: string;
  /** 這一列連到哪(玩法連回父場 · 永遠可達) */
  href: string;
};

/** server 收齊的跨運動原始輸入(sport-agnostic)· 餵進 buildInbox 純 grade。 */
export type RawSettlement = {
  matchId: string;
  sport: SettlementSport;
  /** 顯示用主隊名(中文) */
  home: string;
  /** 顯示用客隊名(中文) */
  away: string;
  /** 你押的那一邊(棒球只有 home/away · 足球三向含 draw) */
  myPick: "home" | "away" | "draw";
  /** 玩法資訊(大小分 / 讓分)· 缺 = 一般「誰贏」場(用隊名) */
  market?: MarketInfo;
  /** 你押注的時戳(先鎖後結過濾用) */
  pickTs: string;
  /** 開賽 ISO(先鎖後結過濾 + 跨運動排序鍵) */
  startISO: string;
  /** 結算結果(null = 還沒結算 / 平手不進對照 → 不成一筆) */
  finalWinner: "home" | "away" | "draw" | null;
  /** 引擎當初鎖定看好的邊(賽前線 argmax)· null = 引擎沒選邊(50/50 真銅板局 / 未鎖) */
  engineFav: "home" | "away" | "draw" | null;
  /** 結算時刻來源:棒球用 finalResult.ingestedAt(CPBL 台北日字串 / MLB full ISO)·
   *  足球用 gradedAt(真 gradedAt 或 on-read 代理 kickoff+110min · 皆 full ISO)。
   *  判「你不在時才結算的」用:有 'T' → 當 full ISO 比瞬間;否則收斂成台北日比。 */
  settledRaw: string | null;
};

export type SettlementItem = {
  matchId: string;
  sport: SettlementSport;
  home: string;
  away: string;
  myPick: "home" | "away" | "draw";
  /** 你押的那一邊顯示名(隊名 ·「和局」· 或玩法「看大 8.5」) */
  myPickName: string;
  /** 玩法資訊(大小分 / 讓分)· 缺 = 一般「誰贏」場 */
  market?: MarketInfo;
  /** 你這手對不對 */
  youHit: boolean;
  /** 實際結果顯示名(贏家隊名 ·「和局」· 或玩法「收大 · 總分 13」) */
  outcomeName: string;
  /** 引擎當初看好的邊 · null = 沒選邊 */
  engineFav: "home" | "away" | "draw" | null;
  /** 引擎這手對不對 · null 當 engineFav=null */
  engineHit: boolean | null;
  /** 你贏了、引擎沒看好那邊 = 逆風(贏過機器的證明)· 純從 youHit + engineHit 推 */
  beatEngine: boolean;
  /** 排序鍵(開賽 ISO · 跨運動可比) */
  sortISO: string;
  /** 上次對帳後才結算的 = 新(首訪 / 已對過帳 = false) */
  isNew: boolean;
};

/** 在飛的(已鎖、賽前鎖、還沒結算)· 押完當下就看得到「進行中」,不必等結算才有東西。 */
export type PendingItem = {
  matchId: string;
  sport: SettlementSport;
  home: string;
  away: string;
  /** 你押的那一邊顯示名(隊名 ·「和局」· 或玩法「看大 8.5」) */
  myPickName: string;
  /** 玩法資訊(大小分 / 讓分)· 缺 = 一般「誰贏」場 */
  market?: MarketInfo;
  /** 開賽 ISO · 給「尚未開賽 / 進行中」狀態 + 排序(近→遠) */
  startISO: string;
  /** 你跟引擎同邊?(引擎沒選邊 → false) */
  withEngine: boolean;
};

export type SettlementInbox = {
  /** 全部已結算(先鎖後結後)· 新到舊 */
  items: SettlementItem[];
  /** 其中「你不在時才結算的」場數 = Nav 鈴鐺的數字 */
  newCount: number;
  /** 已結算總場數 */
  total: number;
  /** 已鎖、還沒結算的押注(賽前鎖、非 late · 開賽近→遠)· 讓收件匣在第一手鎖定後就活著 */
  pending: PendingItem[];
};

/**
 * 上次對帳後才結算的? 一律收斂成「台北日」再比(同 computeSettlementDelta 的鐵則)。
 * 🔴 不可對「瞬間」比:settledRaw 跨運動語意不一致 —— CPBL ingestedAt 是台北日字串、
 * MLB ingestedAt 其實是「開賽」UTC 瞬間(≠ 結算時刻)、足球 gradedAt 才是結算瞬間。
 * 拿 MLB 的開賽瞬間去比 last_seen 會漏算(賽中回訪後比開賽晚 → 賽後結算卻判不是新)。
 * 收斂成台北日 → MLB 用開賽日≈結算日(同棒球帳本)· 且 bell 的棒球數字與 /member 回訪卡
 * (computeSettlementDelta · 也收台北日)永遠一致,不會 bell 說 3、卡說 2 的自打臉。
 * taipeiDayOf 同時吃「+08:00」「Z」「純日期」三種輸入。
 */
function settledSince(settledRaw: string | null, lastSeenISO: string | null): boolean {
  if (!lastSeenISO || !settledRaw) return false;
  const d = taipeiDayOf(settledRaw);
  const ls = taipeiDayOf(lastSeenISO);
  return !!(d && ls && d > ls);
}

function sideName(home: string, away: string, side: "home" | "away" | "draw"): string {
  if (side === "home") return home;
  if (side === "away") return away;
  return "和局";
}

/**
 * 把跨運動原始輸入 grade 成收件匣。 純函式 · deterministic(同 aggregateIdentity 守則)。
 * lastSeenISO = null(首訪)→ 一切都不算「新」(newCount=0)· 但仍回 items(可看,不標新)。
 */
export function buildInbox(
  raws: RawSettlement[],
  lastSeenISO: string | null,
): SettlementInbox {
  const items: SettlementItem[] = [];
  const pending: PendingItem[] = [];
  for (const r of raws) {
    // 先鎖後結:開賽後才押 → 賽後補登,不計入(items 與 pending 都剔除 · 跟帳本同一把尺)。
    if (isLatePick(r.pickTs, r.startISO)) continue;
    if (r.finalWinner === null) {
      // 未結算 → 在飛的(pending)。 平手:已結算但 finalWinner=null,但 settledRaw 有值 →
      // settledRaw===null 才是「真的還沒打完」→ 平手不誤入 pending。
      if (r.settledRaw === null) {
        pending.push({
          matchId: r.matchId,
          sport: r.sport,
          home: r.home,
          away: r.away,
          myPickName: r.market ? r.market.pickName : sideName(r.home, r.away, r.myPick),
          market: r.market,
          startISO: r.startISO,
          withEngine: r.engineFav !== null && r.myPick === r.engineFav,
        });
      }
      continue;
    }

    const youHit = r.myPick === r.finalWinner;
    const engineHit = r.engineFav === null ? null : r.engineFav === r.finalWinner;
    // 逆風:你對、引擎(當初有選邊)看走眼 —— 贏過機器的那種一手。
    const beatEngine = youHit && engineHit === false;

    items.push({
      matchId: r.matchId,
      sport: r.sport,
      home: r.home,
      away: r.away,
      myPick: r.myPick,
      myPickName: r.market ? r.market.pickName : sideName(r.home, r.away, r.myPick),
      market: r.market,
      youHit,
      outcomeName: r.market?.outcomeName ?? sideName(r.home, r.away, r.finalWinner),
      engineFav: r.engineFav,
      engineHit,
      beatEngine,
      sortISO: r.startISO,
      isNew: settledSince(r.settledRaw, lastSeenISO),
    });
  }
  // 新到舊(按開賽「瞬間」降序)。 🔴 不可用字串比:CPBL 的 startISO 帶 +08:00 offset、
  // 足球/MLB 帶 Z(UTC)→ 字典序對混合 offset 會排錯。 一律 Date.parse 成瞬間再比(跨運動正確)。
  items.sort((a, b) => {
    const ta = Date.parse(a.sortISO);
    const tb = Date.parse(b.sortISO);
    const va = Number.isNaN(ta) ? -Infinity : ta; // startISO 缺 → 沉底
    const vb = Number.isNaN(tb) ? -Infinity : tb;
    return vb - va;
  });
  // 在飛的:開賽近→遠(最快要結算的排最上)· 缺 startISO 沉底。 同 items 用瞬間比(混合 offset 正確)。
  pending.sort((a, b) => {
    const ta = Date.parse(a.startISO);
    const tb = Date.parse(b.startISO);
    const va = Number.isNaN(ta) ? Infinity : ta;
    const vb = Number.isNaN(tb) ? Infinity : tb;
    return va - vb;
  });
  const newCount = items.reduce((n, i) => n + (i.isNew ? 1 : 0), 0);
  return { items, newCount, total: items.length, pending };
}
