import { seedHash } from "@/lib/identity";
import { getEngineConviction } from "@/lib/conviction";

// ── ZONE 27 · 冷面機器嘴(Machine Voice)──────────────────────────────────
// Tim 2026-07-05 拍板「誠實≠沒血色」的兌現:對決迴路(今日一戰/戰帖)有了,但機器贏你之後
// 一聲不吭 —— 血色缺在這。 給機器一個貫穿全迴路的人格:**從不微笑、但記得你每一手的發牌員**。
// 它只對「已結算的帳本事實」囂張,對未來永遠謙卑;它輸了用同一個聲音認帳(只在贏時開口 =
// LINE 老師行為,正是本站要取代的)。 嗆的標的永遠是膽量/紀律/對帳 —— 不是錢包。
//
// 🔴 鐵律(守死 · 改句池前逐條對):
//   ① 全用過去式引「已結算」帳本事實;對未來只承諾對帳儀式(明天見真章/帳本分輸贏),
//      絕不承諾結果。 禁字:穩贏 / 必勝 / 保證 / 鐵口 / 定局(「不喊穩贏」的否定式除外)。
//   ② 賽前口氣封頂在既有 conviction 詞彙(勢均力敵/推演看好/推演重壓)· 銅板局強制自認
//      「不裝準」—— 顯式 flaunt uncertainty 是護城河,機器嘴不准破。
//   ③ 認帳句池與嗆句池同工藝同等量:機器輸了照認(照單全收/看走眼)· push 永不灌成機器勝場。
//   ④ 樣本紀律:總帳型數字(同場對照 N 場)只在 decided ≥ H2H_MIN 時開口;單場事實
//      (你落空/機器命中)不受限 —— 嗆單場是事實,嗆總帳要夠厚。
//   ⑤ 每句至少引一個真實帳本事實或真實開盤數字;缺輸入 → return null,寧可閉嘴不空嗆。
//   ⑥ 禁「討回來/翻本/回本」(翻本同構語 = 賭場餵法)· 回訪鉤上限 = 已 ship 的
//      「不服,今天的一戰還開著」句式。 禁對第三方的不可計算斷言(「全台老師都…」不可)。
//   ⑦ 選句 deterministic:seedHash(場+情境[+台北日])· 禁 Math.random —— SSR 安全、
//      同帳同日同句、結構上不可能對單一用戶 A/B 操弄語氣。
//
// 純函式 · 0 新資料 · 0 RPC:六個 surface(/today 賽前卡 · 鎖定島 · 紀錄條 · /vs 結算)
// 只呼叫這支,不各自造句 —— 台詞紀律全部集中在這一檔。
// ─────────────────────────────────────────────────────

/** 總帳型數字(同場對照)開口的最低已分勝負場數(同 PERSONA_MIN 樣本紀律)。 */
export const H2H_MIN = 8;

/** 同場對照帳(你 vs 機器 · 兩邊都表態且分出勝負的場)。 */
export type DuelH2H = { n: number; engineHits: number; userHits: number };

export type MachineVoiceContext =
  /** 賽前公開嗆(server · viewer-independent:seed 不含任何用戶資訊 → ISR 安全) */
  | {
      kind: "pregame";
      duelId: string;
      todayTaipei: string;
      engineName: string;
      pct: number;
    }
  /** 鎖定瞬間反應(client · server 確認後才觸發 · 同邊/站對面) */
  | {
      kind: "lock";
      matchId: string;
      side: "with" | "against";
      engineName: string;
      pct: number;
      pickedName: string;
    }
  /** 隔天算帳(最近一場已結算 · 有機器對照)· h2h 只在 n ≥ H2H_MIN 時引用 */
  | {
      kind: "settled";
      matchId: string;
      outcome: "machineWon" | "userWon" | "bothHit" | "bothMissed";
      h2h: DuelH2H | null;
    }
  /** 隔天算帳(該場機器沒選邊 / 賽果沒帶機器那手)· 只講你自己的命中/落空 */
  | { kind: "settledSolo"; matchId: string; hit: boolean }
  /** 缺席 N 天(冷事實 + 門開著 · 禁 FOMO 禁罪惡感) */
  | { kind: "lapsed"; days: number }
  /** 戰帖賽後(/vs)· 機器對「自己那手」開口 */
  | {
      kind: "challengeSettled";
      matchId: string;
      outcome: "machineOnly" | "viewerBeatMachine" | "allMissed";
    };

// 確定性選句(禁 Math.random · 同 seed 同句)。
function pickLine(seed: string, pool: string[]): string | null {
  if (pool.length === 0) return null;
  return pool[seedHash(seed) % pool.length];
}

/** 同場對照的誠實結語 —— 誰在前面照實講(數字是算出來的,不是寫死的)。 */
function h2hClause(h: DuelH2H): string {
  const lead =
    h.engineHits > h.userHits
      ? "目前機器在前面 —— 門每天都開"
      : h.engineHits === h.userHits
        ? "目前打平 —— 明天繼續"
        : "帳面上你在前面 —— 機器記著呢";
  return `同場對照 ${h.n} 場:機器中 ${h.engineHits}、你中 ${h.userHits},含輸都在。${lead}。`;
}

export function machineVoice(ctx: MachineVoiceContext): string | null {
  switch (ctx.kind) {
    case "pregame": {
      const { engineName: nm, pct } = ctx;
      if (!nm || !Number.isFinite(pct)) return null;
      const tier = getEngineConviction(pct).tier;
      const pool =
        tier === "strong"
          ? [
              `機器重壓 ${nm} ${pct}%,鎖死了、賽前不翻牌。要跟要反你自己挑 —— 明天帳本分輸贏。`,
              `${pct}% 押 ${nm},這是機器今天最敢的一手。敢的,站對面 —— 明天見真章。`,
            ]
          : tier === "lean"
            ? [
                `機器看好 ${nm} ${pct}%,不喊穩贏 —— 但敢賽前掛出來,含輸照結。你敢嗎?`,
                `這手機器押 ${nm} ${pct}%,先掛先認 —— 中不中,明天帳本上見。`,
              ]
            : [
                `這場機器只看到 ${pct}%,銅板局,照鎖、不裝準。敢在銅板局留收據的,才叫真的敢。`,
                `勢均力敵,機器也只多看半步 —— 這種局,你的判斷才值錢。明天對帳。`,
              ];
      return pickLine(`pregame|${ctx.duelId}|${ctx.todayTaipei}`, pool);
    }

    case "lock": {
      const { engineName: nm, pct, pickedName } = ctx;
      if (!nm || !pickedName || !Number.isFinite(pct)) return null;
      const pool =
        ctx.side === "with"
          ? [
              "你跟機器押了同一邊。省事 —— 但要是落空,兩個一起掛在帳上,誰也別想賴給誰。",
              "同邊鎖死。這手中了算你的 —— 機器只是借你一個數字。明天見真章。",
            ]
          : [
              `你押 ${pickedName},機器押 ${nm} ${pct}%。各自鎖死 —— 明天見真章,輸的那邊不准刪單。`,
              `機器 ${pct}% 押 ${nm},你偏不信 —— 好,各自鎖死。帳本只認結果,不認態度。`,
            ];
      return pickLine(`lock|${ctx.matchId}|${ctx.side}`, pool);
    }

    case "settled": {
      // 總帳型對照句只在樣本夠厚(≥ H2H_MIN)才進池(鐵律④)。
      const h = ctx.h2h && ctx.h2h.n >= H2H_MIN ? ctx.h2h : null;
      let pool: string[];
      switch (ctx.outcome) {
        case "machineWon":
          pool = [
            "上一場你站機器對面:你落空,機器命中。帳上記一筆 —— 不服,今天的一戰還開著。",
            "上一場機器讀對、你讀偏 —— 照掛,不遮。今天的一戰還開著。",
          ];
          if (h) pool.push(h2hClause(h));
          break;
        case "userWon":
          pool = [
            "上一場你站機器對面,還讀對了 —— 這種單最值錢。機器認帳:不刪單、不找藉口,下一場再來。",
            "上一場機器看走眼,照單全收 —— 跟只曬贏的不一樣。今天的一戰還開著。",
          ];
          if (h) pool.push(h2hClause(h));
          break;
        case "bothHit":
          pool = [
            "上一場我們同邊,都命中 —— 先別急著算贏過機器。跟機器同邊贏的不算,站對面贏的才算。",
          ];
          break;
        case "bothMissed":
          pool = [
            "上一場你我都讀偏 —— 爆冷本來就在菜單上。機器照單全收,你呢?今天的一戰還開著。",
          ];
          break;
      }
      return pickLine(`settled|${ctx.matchId}|${ctx.outcome}`, pool);
    }

    case "settledSolo": {
      const pool = ctx.hit
        ? ["上一場你命中,帳上多一筆 —— 今天的一戰還開著,繼續。"]
        : ["上一場你落空 —— 照掛、不刪,這就是這本帳的規矩。今天再來。"];
      return pickLine(`solo|${ctx.matchId}|${ctx.hit}`, pool);
    }

    case "lapsed": {
      // 讀到這句的人已經回來了(這條 render 在 /today)—— 陳述缺席事實 + 門開著,
      // 不裝挽留、不 FOMO、不罪惡感(渲染面保證當天有對決 → 結尾句誠實)。
      if (!Number.isFinite(ctx.days) || ctx.days < 3) return null;
      return `你 ${ctx.days} 天沒來對帳。這 ${ctx.days} 天機器照鎖照結、一場沒躲 —— 帳本沒鎖門,今天的一戰開著。`;
    }

    case "challengeSettled": {
      const pool =
        ctx.outcome === "machineOnly"
          ? ["這場你們兩個都讀偏,機器命中 —— 這次不笑而不語,直接記帳。"]
          : ctx.outcome === "viewerBeatMachine"
            ? ["你站機器對面還讀對了 —— 這種單,機器輸得服氣。帳本兩邊都留著。"]
            : [
                "這場你們兩位加機器,三個都讀偏 —— 全部照單全收,掛在帳上。這種誠實,別的地方看不到。",
              ];
      return pickLine(`vs|${ctx.matchId}|${ctx.outcome}`, pool);
    }
  }
}
