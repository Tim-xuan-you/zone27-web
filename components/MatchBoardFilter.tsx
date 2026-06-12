"use client";

// ── ZONE 27 · 賽事看板篩選(R201 · Tim「一塊一塊+寫字解釋排版=雜亂」)──────────
// 把原本「CPBL 區塊 → 過去戰績 → MLB 區塊(還寫一段字解釋同一套引擎)」改成
// Apple/Polymarket 式「一個排序好的看板 + league 篩選 chip」。 chip 取代解釋文字:
// 卡片同型(同隊徽/開盤線/押注鈕)= 用戶自己看得出同一套,不必寫字黏合。
//
// 🔴 護核心:預設落在 CPBL(老闆親選的少量核心)· 不讓 15 場清晨 MLB feed 把它埋掉。
//   「全部」view 也固定 CPBL 在 MLB 之上(權重排序 · 非全域時間排)。 排序在 page 端
//   用 getMatchStartIso 完整台北 instant(跨日正確)· 這裡只管顯示維度。
// 🔴 鐵律:label 只給聯盟名(CPBL/MLB)· 不加「老闆親選/即時開盤」那種解釋(meta 層)。
// ─────────────────────────────────────────────────────

import { useState } from "react";
import MiniMatchCard from "@/components/MiniMatchCard";
import type { Match } from "@/lib/matches";
import type { HeatDisplay } from "@/lib/match-heat";

type Filter = "all" | "cpbl" | "mlb";

function Grid({
  matches,
  heat,
}: {
  matches: Match[];
  heat: Record<string, HeatDisplay>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((m) => (
        <MiniMatchCard
          key={m.id}
          match={m}
          analysisCount={heat[m.id]?.analyses ?? 0}
          heat={heat[m.id]}
        />
      ))}
    </div>
  );
}

export default function MatchBoardFilter({
  cpbl,
  mlb,
  heat,
}: {
  cpbl: Match[];
  mlb: Match[];
  /** 每場熱度(鎖定+分析+相對條寬+最熱)· 看板已按熱度排好,這裡只負責顯示 */
  heat: Record<string, HeatDisplay>;
}) {
  const both = cpbl.length > 0 && mlb.length > 0;
  const [filter, setFilter] = useState<Filter>("cpbl");

  // 只有一個聯盟有場 → 直接一個 grid,不顯示 chips/label(最乾淨)
  if (!both) {
    return <Grid matches={cpbl.length > 0 ? cpbl : mlb} heat={heat} />;
  }

  const chips: { k: Filter; label: string }[] = [
    { k: "cpbl", label: "CPBL" },
    { k: "mlb", label: "MLB" },
    { k: "all", label: "全部" },
  ];

  return (
    <div>
      {/* league 篩選 chip · 預設 CPBL · chip 即說明(取代「為什麼放一起」的解釋段) */}
      <div className="flex gap-1.5 mb-7">
        {chips.map((c) => (
          <button
            key={c.k}
            type="button"
            onClick={() => setFilter(c.k)}
            aria-pressed={filter === c.k}
            className={`px-3.5 py-1.5 font-mono text-[10px] tracking-[0.25em] border transition-colors ${
              filter === c.k
                ? "border-gold bg-gold/10 text-gold"
                : "border-line/60 text-mute hover:border-gold/40"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filter === "all" ? (
        // 全部 · 兩組各一行聯盟 label(標籤非解釋)· CPBL 永遠在上(權重排序護核心)
        <div className="space-y-8">
          <div>
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-4">
              CPBL
            </p>
            <Grid matches={cpbl} heat={heat} />
          </div>
          <div>
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-4">
              MLB
            </p>
            <Grid matches={mlb} heat={heat} />
          </div>
        </div>
      ) : (
        // 單一聯盟 · 不需 label(active chip 已說明)
        <Grid matches={filter === "cpbl" ? cpbl : mlb} heat={heat} />
      )}
    </div>
  );
}
