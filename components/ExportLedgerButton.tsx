"use client";

import { useState } from "react";
import { getMyPredictionsClient } from "@/lib/predictions-market";
import { getMySoccerPicks } from "@/lib/soccer/predictions";

// ── ZONE 27 · 匯出你的帳本(soul R209 · 資產可攜 = 對手做不到的信任)──────────
// 對手(報明牌/玩運彩)結構上能刪你的歷史、改漂亮的戰績;我們不能 —— 而且你隨時
// 把整本含輸帳本(賽前鎖定的 pick + 時間戳,改不了)匯成 JSON 帶走。 Substack
// 「你的資料是你的」信任訊號的本地版。 純前端 · 0 後端 · 0 PII broadcast(只你自己
// 的押注)· 失敗 graceful(空帳本也能匯出空殼 · 不 crash)。
//
// 🔴 守線:匯出的是「你自己」的押注帳本(刪不掉、賽前鎖死的真值)· 暗金無 emoji ·
//   member 介面極簡 → 做成一行安靜動作,不做大卡推銷。
// ─────────────────────────────────────────────────────

export default function ExportLedgerButton() {
  const [busy, setBusy] = useState(false);

  const exportLedger = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const [baseballMap, soccerPicks] = await Promise.all([
        getMyPredictionsClient(),
        getMySoccerPicks(),
      ]);
      const payload = {
        source: "ZONE 27",
        note: "你的押注帳本 · 賽前鎖定、賽後對帳、改不了。 結果可從公開賽果重新驗證。",
        baseball: Object.entries(baseballMap).map(([matchId, p]) => ({
          matchId,
          pick: p.pick,
          lockedAt: p.ts,
        })),
        soccer: soccerPicks.map((p) => ({
          matchId: p.matchId,
          pick: p.pick,
          lockedAt: p.ts,
        })),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zone27-ledger.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* graceful · 匯出是 nice-to-have · 失敗不影響其他 */
    }
    setBusy(false);
  };

  return (
    <p className="mt-6 text-center font-mono text-mute/50 text-[10px] tracking-[0.2em] leading-relaxed">
      你的帳本是你的 · 賽前鎖死、改不了 ·{" "}
      <button
        type="button"
        onClick={exportLedger}
        disabled={busy}
        className="text-gold/70 hover:text-gold underline-offset-4 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "匯出中…" : "匯出 JSON →"}
      </button>
    </p>
  );
}
