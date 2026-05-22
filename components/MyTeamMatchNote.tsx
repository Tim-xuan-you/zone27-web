"use client";

import { useEffect, useState } from "react";
import { getMyTeam, getTeamById, getTeamByName } from "@/lib/teams";

// ── ZONE 27 · My Team Match Note ────────────────────────
// Round 31 W-N · 在 /matches/[gameId] hero 顯示「您支持的 X 在這場是
// favorite / underdog」 personal narrative · 對你說話 · 不對球迷說話。
//
// SSR-safe via mounted flag。
// ─────────────────────────────────────────────────────

type Props = {
  homeName: string;
  awayName: string;
  homeWinRate: number;
  awayWinRate: number;
  finalWinner?: "home" | "away" | "tie" | null;
};

export default function MyTeamMatchNote({
  homeName,
  awayName,
  homeWinRate,
  awayWinRate,
  finalWinner,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR-safe hydration · canonical pattern · React 19 strict overflags
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const myTeamId = getMyTeam();
  if (!myTeamId) return null;
  const myTeam = getTeamById(myTeamId);
  if (!myTeam) return null;

  const homeTeam = getTeamByName(homeName);
  const awayTeam = getTeamByName(awayName);
  const myTeamIsHome = homeTeam?.id === myTeam.id;
  const myTeamIsAway = awayTeam?.id === myTeam.id;

  if (!myTeamIsHome && !myTeamIsAway) {
    // My team not in this match
    return (
      <div className="mt-4 bg-slate/30 border border-mute/30 px-4 py-3">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
          您支持的 <span className="text-mute">{myTeam.short}</span> · 這場沒上 · 純看戲
        </p>
      </div>
    );
  }

  const myTeamRate = myTeamIsHome ? homeWinRate : awayWinRate;
  const isFavorite = myTeamRate >= 50;
  const result = finalWinner
    ? finalWinner === "tie"
      ? "TIE"
      : (myTeamIsHome ? "home" : "away") === finalWinner
      ? "WIN"
      : "LOSS"
    : null;

  const verdictColor = result === "WIN" ? "text-gold" : result === "LOSS" ? "text-loss" : "text-bone";

  return (
    <div className="mt-4 bg-gold/5 border border-gold/40 px-4 py-3">
      <p className="font-mono text-gold text-[10px] tracking-[0.35em] mb-1">
        ★ 您支持 {myTeam.short} · 引擎為您算這場
      </p>
      <p className="text-bone text-sm sm:text-base leading-relaxed">
        引擎賽前 say{" "}
        <span className="font-mono text-gold tabular">{myTeamRate}%</span> ·{" "}
        <strong className={isFavorite ? "text-gold" : "text-loss/80"}>
          {isFavorite ? "favorite" : "underdog"}
        </strong>
        {result && (
          <>
            {" · "}
            賽後{" "}
            <strong className={verdictColor}>
              {result === "WIN" ? "您的隊贏" : result === "LOSS" ? "您的隊輸" : "平局"}
            </strong>
          </>
        )}
      </p>
    </div>
  );
}
