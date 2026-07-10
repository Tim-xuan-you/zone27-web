"use client";

import { useState } from "react";
import CardBetStrip from "@/components/CardBetStrip";
import SoccerBetStrip from "@/components/SoccerBetStrip";
import TennisBetStrip from "@/components/TennisBetStrip";
import BadmintonBetStrip from "@/components/BadmintonBetStrip";
import MmaBetStrip from "@/components/MmaBetStrip";
import BasketballBetStrip from "@/components/BasketballBetStrip";
import { machineVoice } from "@/lib/machine-voice";
import type { DuelSport } from "@/lib/daily-duel";

// ── ZONE 27 · 今日一戰 · 鎖定反應島(機器嘴 · R295)────────────────────────────
// 你在 /today 鎖下一手的瞬間(server 確認後 · onLock),機器立刻回一句 —— 同邊/站對面
// 語氣不同(lib/machine-voice 單一真相 · 這裡不造句)。 原本 /today 的六運動 strip switch
// 直接掛在 server 頁上,onLock(function prop)過不去 server→client 邊界 → switch 搬進
// 這個島(鏡 ChallengeBoard 接線 · 六 strip 內部零改動 · R294 optional-prop 加法模式)。
//
// 只在「剛鎖那一刻」開口:onLock 只在 fresh lock 的 server 確認後觸發(reload 已鎖的人
// 不再放同一句 —— 隔天的算帳交給 DuelRecordStrip 的機器嘴)。 未登入/沒鎖 → 純 strip。
// ─────────────────────────────────────────────────────

export type DuelVoiceModel = {
  sport: DuelSport;
  matchId: string;
  startISO: string;
  /** 顯示名(native 空間:網羽格 = A/B 選手 · 其餘 = 主/客) */
  homeName: string;
  awayName: string;
  /** 機器那手(native pick 空間:棒/籃 home|away · 足 home|draw|away · 網羽格 a|b) */
  enginePick: string;
  engineName: string;
  enginePct: number;
  /** 棒球:CardBetStrip 的引擎對照線 */
  engineHomePct?: number;
};

export default function DuelVoiceBoard({ duel }: { duel: DuelVoiceModel }) {
  const [reaction, setReaction] = useState<string | null>(null);

  // 鎖手成功(server 確認)→ 機器開口(native pick 空間直接比對 · 不硬轉)。
  const lock = (pick: string, pickedName: string) => {
    setReaction(
      machineVoice({
        kind: "lock",
        matchId: duel.matchId,
        side: pick === duel.enginePick ? "with" : "against",
        engineName: duel.engineName,
        pct: duel.enginePct,
        pickedName,
      }),
    );
  };
  const nameOfAb = (p: "a" | "b") => (p === "a" ? duel.homeName : duel.awayName);

  const strip =
    duel.sport === "baseball" ? (
      <CardBetStrip
        matchId={duel.matchId}
        homeName={duel.homeName}
        awayName={duel.awayName}
        startISO={duel.startISO}
        engineHomePct={duel.engineHomePct}
        returnTo="/today"
        challenge
        onLock={(p) => lock(p, p === "home" ? duel.homeName : duel.awayName)}
      />
    ) : duel.sport === "soccer" ? (
      <SoccerBetStrip
        matchId={duel.matchId}
        dateISO={duel.startISO}
        homeLabel={duel.homeName}
        awayLabel={duel.awayName}
        locked
        returnTo="/today"
        challenge
        onLock={(p) =>
          lock(p, p === "home" ? duel.homeName : p === "away" ? duel.awayName : "和局")
        }
      />
    ) : duel.sport === "basketball" ? (
      <BasketballBetStrip
        gameId={duel.matchId}
        startISO={duel.startISO}
        homeLabel={duel.homeName}
        awayLabel={duel.awayName}
        returnTo="/today"
        challenge
        onLock={(p) => lock(p, p === "home" ? duel.homeName : duel.awayName)}
      />
    ) : duel.sport === "tennis" ? (
      <TennisBetStrip
        matchId={duel.matchId}
        startISO={duel.startISO}
        aLabel={duel.homeName}
        bLabel={duel.awayName}
        returnTo="/today"
        challenge
        onLock={(p) => lock(p, nameOfAb(p))}
      />
    ) : duel.sport === "badminton" ? (
      <BadmintonBetStrip
        matchId={duel.matchId}
        startISO={duel.startISO}
        aLabel={duel.homeName}
        bLabel={duel.awayName}
        returnTo="/today"
        challenge
        onLock={(p) => lock(p, nameOfAb(p))}
      />
    ) : (
      <MmaBetStrip
        matchId={duel.matchId}
        startISO={duel.startISO}
        aLabel={duel.homeName}
        bLabel={duel.awayName}
        returnTo="/today"
        challenge
        onLock={(p) => lock(p, nameOfAb(p))}
      />
    );

  return (
    <>
      {strip}
      {reaction && (
        <p className="mt-3 font-mono text-bone/75 text-[11px] tracking-[0.05em] leading-relaxed">
          <span aria-hidden="true" className="text-gold/60">▦</span>{" "}
          「{reaction}」
        </p>
      )}
    </>
  );
}
