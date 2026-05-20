"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import {
  simulateGameWithLog,
  outcomeTier,
  type PlayLog,
  type AtBatOutcome,
} from "@/lib/simulator";
import type { PitcherStats } from "@/lib/matches";

// ── ZONE 27 · Lab v0.2 · Replay Mode ───────────────────
// 完成 10,000 次批次模擬後出現的「重播一場虛擬比賽」區塊。
// 每按一次按鈕,就在前端跑一場全新的 simulateGameWithLog(),
// 把 ~70 個打席的 PlayLog 用 setInterval 一條一條動畫呈現,
// 像棒球文字直播一樣。
// ─────────────────────────────────────────────────────

const PLAY_INTERVAL_MS = 110;

type Props = {
  homeName: string;
  homeEn: string;
  homePitcher: PitcherStats;
  awayName: string;
  awayEn: string;
  awayPitcher: PitcherStats;
  /** Change this string when matchup changes to reset replay state. */
  keyId: string;
};

const OUTCOME_VERBS: Record<AtBatOutcome, string> = {
  K: "strikes out",
  BB: "walks",
  HR: "homers — bases cleared",
  "1B": "singles",
  "2B": "doubles",
  "3B": "triples",
  GO: "grounds out",
  FO: "flies out",
};

export default function ReplayBroadcast({
  homeEn,
  homePitcher,
  awayEn,
  awayPitcher,
  keyId,
}: Props) {
  const [log, setLog] = useState<PlayLog[]>([]);
  const [shown, setShown] = useState(0);
  const [final, setFinal] = useState<{ home: number; away: number } | null>(
    null
  );
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ReplayBroadcast lives inside MatchSimulator, which remounts on
  // match change via its parent's `key={match.id}` — that's enough to
  // reset state. No explicit keyId-watching effect needed.
  // Cleanup any in-flight interval on unmount.
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);
  // `keyId` kept in props for backward compat with existing callers
  // and as a documentation hint that this component is matchup-scoped.
  void keyId;

  // Auto-scroll to bottom as new plays come in
  useEffect(() => {
    if (scrollRef.current && shown > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [shown]);

  function startReplay() {
    if (running) return;
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    const { result, log: newLog } = simulateGameWithLog(
      homePitcher,
      awayPitcher
    );
    setLog(newLog);
    setShown(0);
    setFinal(null);
    setRunning(true);

    intervalRef.current = window.setInterval(() => {
      setShown((s) => {
        if (s + 1 >= newLog.length) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setFinal({ home: result.homeRuns, away: result.awayRuns });
          setRunning(false);
          return newLog.length;
        }
        return s + 1;
      });
    }, PLAY_INTERVAL_MS);
  }

  const visible = log.slice(0, shown);
  const lastPlay = visible[visible.length - 1];
  const homeScore = lastPlay?.homeScoreAfter ?? 0;
  const awayScore = lastPlay?.awayScoreAfter ?? 0;
  const inningLabel = lastPlay
    ? `${lastPlay.half === "top" ? "▾ TOP" : "▴ BOT"} ${lastPlay.inning}`
    : "PRE-GAME";

  return (
    <div>
      {/* Header + control */}
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-6">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / 04 · 重播一場比賽
        </p>
        <button
          type="button"
          onClick={startReplay}
          disabled={running}
          className={`px-6 py-2.5 font-mono text-[10px] tracking-[0.3em] transition-colors border ${
            running
              ? "border-gold/40 text-gold/60 cursor-not-allowed"
              : "border-gold text-gold hover:bg-gold hover:text-navy"
          }`}
        >
          {running
            ? "▸ 直播中 ..."
            : log.length === 0
            ? "▶ 重播一場比賽"
            : "▶ 重播另一場"}
        </button>
      </div>

      <p className="text-mute text-sm mb-6 leading-relaxed">
        每按一次按鈕,引擎就會跑一場 <span className="text-gold/80">全新的虛擬比賽</span>
        (約 70 個打席),並以文字直播的形式逐打席播放出來。每一場都不一樣。
      </p>

      {/* Empty state */}
      {log.length === 0 && (
        <div className="bg-slate/40 border border-line/60 p-10 text-center">
          <p className="font-mono text-mute text-xs tracking-[0.25em]">
            按下重播 — 完整 9 局逐打席文字直播
          </p>
        </div>
      )}

      {/* Broadcast view */}
      {log.length > 0 && (
        <div className="bg-slate/70 border border-line/80 glow-soft">
          {/* Scoreboard header */}
          <div className="border-b border-line/70 px-6 py-4 flex items-center justify-between bg-ink/40">
            <div>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                目前
              </p>
              <p className="font-mono text-gold text-lg tracking-[0.2em]">
                {inningLabel}
              </p>
            </div>
            <div className="flex gap-6 sm:gap-10 text-right font-mono tabular">
              <div>
                <p className="text-mute text-[10px] tracking-[0.25em]">{awayEn}</p>
                <p className="text-bone text-3xl sm:text-4xl">{awayScore}</p>
              </div>
              <div>
                <p className="text-mute text-[10px] tracking-[0.25em]">{homeEn}</p>
                <p className="text-bone text-3xl sm:text-4xl">{homeScore}</p>
              </div>
            </div>
          </div>

          {/* Log scroll area */}
          <div
            ref={scrollRef}
            className="max-h-[420px] overflow-y-auto px-5 sm:px-6 py-5 space-y-1 font-mono text-sm"
          >
            {renderPlays(visible, homeEn, awayEn)}
          </div>

          {/* Final score card */}
          {final && (
            <div className="border-t border-gold/40 px-6 py-6 text-center bg-gold/5">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                ✓ 終局 · 9 局結束
              </p>
              <p className="font-mono text-bone text-3xl sm:text-4xl tabular tracking-tight">
                {awayEn}{" "}
                <span className={final.away > final.home ? "text-gold" : ""}>
                  {final.away}
                </span>{" "}
                — <span className={final.home > final.away ? "text-gold" : ""}>
                  {final.home}
                </span>{" "}
                {homeEn}
              </p>
              <p className="text-mute text-xs sm:text-sm mt-4 max-w-md mx-auto leading-relaxed">
                這場比賽剛剛從零生成 ——
                70 多次亂數打席對決決定了每一個出局、上壘與得分。
                <br />
                再按一次,會看到完全不同的劇本。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Render plays grouped by half-inning markers
function renderPlays(
  plays: PlayLog[],
  homeEn: string,
  awayEn: string
): ReactElement[] {
  const out: ReactElement[] = [];
  let lastHalf = "";

  for (let i = 0; i < plays.length; i++) {
    const p = plays[i];
    const halfKey = `${p.inning}-${p.half}`;

    if (halfKey !== lastHalf) {
      const teamLabel = p.battingTeam === "home" ? homeEn : awayEn;
      const symbol = p.half === "top" ? "▾" : "▴";
      const halfLabel = p.half === "top" ? "TOP" : "BOT";
      out.push(
        <div
          key={`h-${halfKey}`}
          className={`pt-3 pb-2 ${i === 0 ? "" : "mt-3 border-t border-line/40"}`}
        >
          <p className="font-mono text-gold tracking-[0.25em] text-[10px]">
            {symbol} {halfLabel} {p.inning} · {teamLabel} BATTING
          </p>
        </div>
      );
      lastHalf = halfKey;
    }

    const tier = outcomeTier(p.outcome);
    const colorClass =
      tier === "homer"
        ? "text-gold font-medium"
        : tier === "extra"
        ? "text-gold/90"
        : tier === "onbase"
        ? "text-gold/70"
        : "text-mute/70";

    const teamLabel = p.battingTeam === "home" ? homeEn : awayEn;
    const verb = OUTCOME_VERBS[p.outcome];

    let line = `  •  ${teamLabel} #${p.batterNum}  ${verb}`;
    if (p.runsScored > 0) {
      line += `  ⇒  ${p.runsScored} R`;
    }

    out.push(
      <p key={`p-${i}`} className={colorClass}>
        {line}
      </p>
    );
  }
  return out;
}
