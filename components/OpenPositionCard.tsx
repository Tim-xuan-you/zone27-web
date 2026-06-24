"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMatchTally,
  CROWD_LINE_MIN,
  type MarketTally,
} from "@/lib/predictions-market";
import Avatar from "@/components/Avatar";
import { getTeamCrest } from "@/lib/identity";

// ── ZONE 27 · Open Position ──────────────────────────────
// The missing middle. Every emotional payoff in ZONE 27 used to land at
// resolution(賽後對帳)or in retrospect(年度報告)· nothing for the bettor
// to FEEL in the hours between locking a pick and the final out — the exact
// window Polymarket / a Bloomberg position / live sport lives in. The data
// model even named a「today-live」 phase and rendered nothing for it.
//
// This card IS that middle:「你手上有一手還沒結算」。 It shows the three
// things that make a held position feel alive — and every one of them is a
// REAL variable we already have, never a fabricated live score(賽果是 Tim
// 賽後手動截圖 ingest · 假裝即時比分會炸掉「方法公開」信任):
//   1. 你押哪邊(你的承諾 · the stake)
//   2. 你 vs 引擎(同邊 = 被背書 · 對面 = 你敢站對面的張力 · per soul research)
//   3. 你 vs 群眾(群眾市場線 · 滿 5 人才畫)
// LIVE 場多一道呼吸的金色細線 · 不是賭場閃爍 · 是「盤還在動」的安靜訊號。
// ─────────────────────────────────────────────────────

export type OpenPositionPhase = "today-pregame" | "today-live" | "future";

export type OpenPosition = {
  matchId: string;
  homeName: string;
  awayName: string;
  startTime: string; // "18:35"
  /** compact date e.g. "06/05" · only shown for future games */
  dateLabel: string;
  myPick: "home" | "away";
  /** 你押的那隊的官方縮寫(getTeamCrest 用 · 隊徽顏色) */
  myTeamEn: string;
  /** 聯盟 "MLB" | "CPBL"(getTeamCrest 用) */
  league: string;
  /** engine's pre-game favorite side */
  engineHomePicked: boolean;
  /** engine's confidence on its favorite (0-100) */
  engineConfidence: number;
  phase: OpenPositionPhase;
  /** 玩法(大小分)· 缺 = 一般「誰贏」場(隊名 + 隊徽 + 引擎線);有 = 用 pickName(線烤進去),
   *  隱藏隊徽 + 引擎勝率線(玩法的引擎大小分線另一條,不混用「誰贏」勝率)。 */
  market?: { label: string; pickName: string };
};

export default function OpenPositionCard({
  position,
}: {
  position: OpenPosition;
}) {
  const {
    matchId,
    homeName,
    awayName,
    startTime,
    dateLabel,
    myPick,
    engineHomePicked,
    engineConfidence,
    phase,
  } = position;

  const [tally, setTally] = useState<MarketTally | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMatchTally(matchId).then((t) => {
      if (!cancelled) setTally(t);
    });
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const isProp = !!position.market;
  // 玩法用 pickName(看大 8.5)· 一般場用隊名 + 隊徽。
  const myTeam = myPick === "home" ? homeName : awayName;
  const pickDisplay = position.market ? position.market.pickName : myTeam;
  const crest = isProp ? null : getTeamCrest(myTeam, position.myTeamEn, position.league);
  const engineTeam = engineHomePicked ? homeName : awayName;
  const withEngine = (myPick === "home") === engineHomePicked;
  const isLive = phase === "today-live";
  // 玩法沒有 /matches/{id}~bou 單場頁 → 連回父場(剝後綴)· 群眾線仍用玩法場號(props 有自己的 tally)。
  const href = isProp ? `/matches/${matchId.split("~")[0]}` : `/matches/${matchId}`;

  // crowd share on MY side(homePct is home's share of decided picks）
  const crowdOnMyPct =
    tally && tally.homePct !== null
      ? myPick === "home"
        ? tally.homePct
        : 100 - tally.homePct
      : null;
  const crowdShown =
    tally && tally.total >= CROWD_LINE_MIN && crowdOnMyPct !== null;

  return (
    <Link
      href={href}
      // gold discipline · 金色邊框留給 LIVE(此刻最該被看見的一手)· 其餘安靜
      className={`block bg-slate/40 border transition-colors ${
        isLive
          ? "border-gold/40 hover:border-gold/60"
          : "border-line/60 hover:border-gold/40"
      }`}
      aria-label={`你的未結算押注 · 你押 ${pickDisplay} · ${
        isLive ? "比賽進行中" : "已鎖定"
      }`}
    >
      {/* LIVE · 呼吸的金色細線(盤還在動 · 安靜不閃爍)· prefers-reduced-motion
          已在 globals.css .shimmer 守住 */}
      {isLive && <div className="h-[2px] bg-gold/70 shimmer" aria-hidden="true" />}

      <div className="p-5 sm:p-6">
        {/* status + matchup */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {isLive ? (
            <span className="font-mono text-[9px] tracking-[0.28em] border border-gold text-gold px-1.5 py-0.5 shimmer">
              進行中
            </span>
          ) : phase === "today-pregame" ? (
            <span className="font-mono text-[9px] tracking-[0.28em] border border-gold/50 text-gold px-1.5 py-0.5 tabular">
              今日 {startTime} 開打
            </span>
          ) : (
            <span className="font-mono text-[9px] tracking-[0.28em] border border-mute/50 text-mute px-1.5 py-0.5 tabular">
              {dateLabel} {startTime}
            </span>
          )}
          <span className="font-mono text-mute/70 text-[10px] tracking-[0.16em] truncate min-w-0">
            {homeName}
            <span className="text-mute/40 mx-1">vs</span>
            {awayName}
          </span>
        </div>

        {/* 你的承諾 · the held stake · 一般場掛隊徽;玩法把線烤進顯示名(看大 8.5)· 不掛隊徽 */}
        <p className="flex items-center gap-2.5 text-bone text-lg sm:text-xl font-light leading-snug">
          {!isProp && (
            <Avatar seed={myTeam} glyph={crest?.glyph} color={crest?.color} size={26} />
          )}
          <span>
            你押 <span className="text-gold">{pickDisplay}</span>
            {position.market && (
              <span className="ml-2 align-middle font-mono text-mute/55 text-[10px] tracking-[0.18em]">
                {position.market.label}
              </span>
            )}
          </span>
        </p>

        {/* 你 vs 引擎 · 同邊被背書 / 對面是張力(玩法的引擎大小分線另一條 · 只在一般場顯示) */}
        {!isProp && (
          <p className="mt-1.5 font-mono text-[11px] tracking-[0.1em] leading-relaxed text-mute">
            {withEngine ? (
              <>
                引擎同邊 · 也看好{" "}
                <span className="text-bone tabular">
                  {engineTeam} {engineConfidence}%
                </span>
              </>
            ) : (
              <>
                你站引擎的對面 · 引擎看好{" "}
                <span className="text-bone tabular">
                  {engineTeam} {engineConfidence}%
                </span>
              </>
            )}
          </p>
        )}

        {/* 你 vs 群眾 · 滿門檻才畫 */}
        {crowdShown && (
          <p className="mt-1 font-mono text-[11px] tracking-[0.1em] text-mute">
            群眾 <span className="text-bone tabular">{crowdOnMyPct}%</span>{" "}
            跟你同邊 · <span className="tabular">{tally!.total}</span> 人在場
          </p>
        )}

        {/* 結算錨點 · 不造假即時 · 只說真話 */}
        <p className="mt-3 font-mono text-mute/55 text-[10px] tracking-[0.16em] leading-relaxed">
          {isLive
            ? "結果未定 · 結算後自動對帳你的準度"
            : "押了改不了 · 賽後自動對帳你的準度"}
        </p>
      </div>
    </Link>
  );
}
