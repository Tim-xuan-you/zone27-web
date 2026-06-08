// ── ZONE 27 · 引擎為什麼這樣看(Per-game Reasoning + Blind Spots)──
// 2026-06-04 · 全球研究「缺的靈魂 #2」(Bill James「Hey Bill」+ Nate Silver
// steelman + Metaculus 量化理由)synthesize。
//
// 全站都在「告訴」訪客一個數字,缺的是「為什麼」+「我們哪裡可能看走眼」。
// 對手(明牌站 / 報馬仔)永遠不會公布「我的方法看不到什麼」—— 一誠實就露餡。
// 我們把它當賣點 surface:這層自我拆解 = 結構性學不來的 costly signal。
//
// 三段(Bill James 多軸 + Silver「什麼情況我們會錯」):
//   ① 看到什麼 —— 逐項拆開引擎吃的輸入,含方向(可能互相拉扯 → 誠實呈現張力)
//   ② 哪裡可能看走眼 —— 結構性盲點(每場都誠實列 · 對齊 /audit S02 估算揭露:天氣等不建模)
//   ③ 什麼情況我們會錯 —— steelman 自己的錯,綁回 5 成 7 天花板(conviction-aware)
//
// 純衍生 · 只吃既有真實資料(投手 ERA / BB9 = 自動覆蓋的真值 · 主場 = 結構事實)·
// 0 新資料 · 不 vapor · plain words(不 render 學術詞)。
//   ⚠️ 刻意不用 recent[](資料模型標 placeholder · 不 render 假數據 = 誠實紅線)。
// ─────────────────────────────────────────────────────

import type { Match } from "@/lib/matches";
import { getEngineFavorite } from "@/lib/matches";
import { getEngineConviction } from "@/lib/conviction";

export type ReasonLean = "home" | "away" | "even";

export type ReasonFactor = {
  label: string; // 短籤 · 「先發投手壓制力」
  detail: string; // 一句白話 · 含方向(偏某隊 / 打平)
  lean: ReasonLean; // 視覺 accent · even = 不上金
};

export type EngineReasoning = {
  factors: ReasonFactor[]; // ① 看到什麼
  blindSpots: string; // ② 哪裡可能看走眼(結構性)
  wrongWhen: string; // ③ 什麼情況我們會錯(steelman · conviction-aware)
};

function pf(s: string): number | null {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * 從一場 Match 衍生引擎推理。 純讀既有真實欄位(投手 ERA / BB9 + 主場),
 * 任一投手數值缺 / 非數字 → 該因子略過(graceful · 不硬編)。
 */
export function getEngineReasoning(m: Match): EngineReasoning {
  const { home, away } = m;
  const factors: ReasonFactor[] = [];

  // ── 因子 1 · 先發投手壓制力 · ERA(越低越好)──
  const hEra = pf(home.pitcher.era);
  const aEra = pf(away.pitcher.era);
  if (hEra !== null && aEra !== null) {
    const gap = Math.abs(hEra - aEra);
    const lean: ReasonLean = gap < 0.3 ? "even" : hEra < aEra ? "home" : "away";
    if (lean === "even") {
      factors.push({
        label: "先發投手壓制力",
        detail: `兩隊先發防禦率咬得很近(${home.pitcher.name} ${home.pitcher.era} · ${away.pitcher.name} ${away.pitcher.era})—— 壓制力上難分高下。`,
        lean,
      });
    } else {
      const better = hEra < aEra ? home : away;
      const worse = hEra < aEra ? away : home;
      const decisive = gap >= 0.8 ? "明顯" : "略";
      factors.push({
        label: "先發投手壓制力",
        detail: `${better.pitcher.name} 防禦率 ${better.pitcher.era},比${worse.pitcher.name}的 ${worse.pitcher.era} ${decisive}低 —— 這項偏${better.name}。`,
        lean,
      });
    }
  }

  // ── 因子 2 · 先發投手控球 · BB/9(越低越好)──
  const hBb = pf(home.pitcher.bb9);
  const aBb = pf(away.pitcher.bb9);
  if (hBb !== null && aBb !== null) {
    const gap = Math.abs(hBb - aBb);
    const lean: ReasonLean = gap < 0.5 ? "even" : hBb < aBb ? "home" : "away";
    if (lean === "even") {
      factors.push({
        label: "先發投手控球",
        detail: "兩隊先發的保送都壓得住 —— 控球這項打平。",
        lean,
      });
    } else {
      const better = hBb < aBb ? home : away;
      factors.push({
        label: "先發投手控球",
        detail: `${better.pitcher.name} 每九局只送 ${better.pitcher.bb9} 次保送,控球更穩 —— 這項偏${better.name}。`,
        lean,
      });
    }
  }

  // ── 因子 3 · 主場優勢 · 結構性(每場都成立)──
  factors.push({
    label: "主場優勢",
    detail: `${home.name}在自家球場出賽 —— 主場大約值 2 到 3 個百分點,這項偏主隊。`,
    lean: "home",
  });

  // ── ② 哪裡可能看走眼 · 結構性盲點(對齊 /audit S02:天氣等一律不硬算)──
  const blindSpots =
    "開盤線只吃幾樣:兩隊戰績、主場、先發投手的數據。 " +
    "看不到的:這場牛棚怎麼調、有沒有臨時傷兵、天氣與場地、打線當天手感、教練臨場調度。 " +
    "這些我們一律不硬算 —— 寧可承認看不到,也不假裝算得到。";

  // ── ③ 什麼情況我們會錯 · steelman 自己(綁回 5 成 7 天花板)──
  const favPct = Math.max(home.winRate, away.winRate);
  const conviction = getEngineConviction(favPct);
  const fav = getEngineFavorite(m);
  const favName =
    fav === "home" ? home.name : fav === "away" ? away.name : "某一邊";
  let tail: string;
  if (conviction.tier === "tossup") {
    tail =
      "更何況這場接近銅板局,連引擎都只敢說五五波 —— 猜錯一半是正常的,不是失常。";
  } else if (conviction.tier === "strong") {
    tail = `就算引擎重壓${favName},賽前最強的模型單場也只到大約 5 成 7 —— 爆冷永遠可能。`;
  } else {
    tail =
      "賽前最強的模型單場也只到大約 5 成 7 —— 看走眼是這行的常態,我們照單全收、賽後對帳給你看。";
  }
  const wrongWhen = "先發投手前幾局就被打爆、或後援守不住,這條線會立刻崩。 " + tail;

  return { factors, blindSpots, wrongWhen };
}
