"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";
import { getMyTeam, getTeamById, getTeamByName } from "@/lib/teams";

// ── ZONE 27 · My Team Next Game ─────────────────────────
// 2026-06-04 · 球隊勝率推播(engine-strategy memory #5)。 對齊 TeamPickPanel
// + MyTeamTrackRecord 的「對你這個球迷說話」personalization · 0 cookie /
// 0 server / 0 PII · 純 localStorage z27_team(同既有兩件)。
//
// 缺的那一半:MyTeamTrackRecord 只攤「過去」(✓proved ✕diverged)· 這件補
// 「未來」—— 你支持的隊下一場 + 萬象開盤勝率 % + 賽後自動對帳承諾(該承諾由
// 下方 MyTeamTrackRecord 真的兌現 · 不是 vapor)。
//   = 手機那種「你的球隊今天幾 %」冷數字推播的誠實版(它不回來認帳 · 我們回來)。
//
// SSR-safe:mounted 前 render null(避免 hydration mismatch · 同 MyTeamTrackRecord)。
// ─────────────────────────────────────────────────────

export type MyTeamUpcoming = {
  id: string;
  date: string;
  startTime: string;
  venue: string;
  homeName: string;
  awayName: string;
  homeWinRate: number;
  awayWinRate: number;
};

type Props = {
  matches: MyTeamUpcoming[]; // upcoming · 已 asc 排序(最近的在前)
};

export default function MyTeamNextGame({ matches }: Props) {
  const mounted = useMounted();
  const [, refresh] = useState(0);

  useEffect(() => {
    // 跨分頁(storage)+ 同分頁改隊(TeamPickPanel 廣播 z27-team-change)都即時刷新。
    // storage 事件不在寫入的同一分頁觸發,所以同分頁選隊要靠自訂事件,否則本卡不會出現。
    const bump = () => refresh((x) => x + 1);
    window.addEventListener("storage", bump);
    window.addEventListener("z27-team-change", bump);
    return () => {
      window.removeEventListener("storage", bump);
      window.removeEventListener("z27-team-change", bump);
    };
  }, []);

  if (!mounted) return null;

  const myTeamId = getMyTeam();
  if (!myTeamId) return null; // 沒選隊 = 不顯示(上方 TeamPickPanel 負責邀請選隊)
  const myTeam = getTeamById(myTeamId);
  if (!myTeam) return null;

  // matches 已 asc 排序 → 第一個含我的隊的場 = 下一場
  const next = matches.find(
    (m) =>
      teamMatches(m.homeName, myTeam.name) ||
      teamMatches(m.awayName, myTeam.name)
  );

  if (!next) {
    return (
      <div className="mt-5 bg-slate/30 border border-line/60 p-5 sm:p-6">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2"
        >
          / YOUR TEAM · 下一場
        </p>
        <p className="text-mute text-sm leading-relaxed">
          目前還沒有 <strong className="text-bone">{myTeam.name}</strong>{" "}
          的場次排進引擎。 哪些場進引擎看{" "}
          <Link
            href="/coverage"
            className="text-gold underline-offset-4 hover:underline"
          >
            /coverage
          </Link>
          。
        </p>
      </div>
    );
  }

  const myIsHome = teamMatches(next.homeName, myTeam.name);
  const myWinRate = Math.round(myIsHome ? next.homeWinRate : next.awayWinRate);
  const oppWinRate = 100 - myWinRate;
  const oppName = myIsHome ? next.awayName : next.homeName;
  const oppTeam = getTeamByName(oppName);
  const oppShort = oppTeam ? oppTeam.short : oppName;

  return (
    <div className="mt-5 bg-slate/40 border border-gold/40 p-5 sm:p-6">
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
      >
        / YOUR TEAM · 下一場
      </p>

      {/* matchup */}
      <p className="text-bone text-base sm:text-lg leading-relaxed">
        你支持的 <strong className="text-gold">{myTeam.short}</strong> 下一場 ·
        對 <strong>{oppShort}</strong>
      </p>
      <p className="mt-1 font-mono text-mute/65 text-[10px] tracking-[0.18em]">
        {next.date} · {next.startTime} · {next.venue}
      </p>

      {/* engine open line */}
      <div className="mt-4 flex items-end gap-4 flex-wrap">
        <div>
          <p className="font-mono text-mute/55 text-[9px] tracking-[0.3em] mb-1">
            萬象引擎開盤
          </p>
          <p className="text-bone leading-none">
            <span className="text-gold text-4xl sm:text-5xl font-light tabular">
              {myWinRate}
            </span>
            <span className="text-gold text-xl font-light">%</span>
            <span className="text-mute/70 text-sm ml-2">看好 {myTeam.short}</span>
          </p>
        </div>
        <p className="font-mono text-mute/55 text-[10px] tracking-[0.18em] pb-1.5">
          {oppShort} {oppWinRate}%
        </p>
      </div>
      {/* two-tone open-line bar */}
      <div
        className="mt-3 h-1.5 w-full bg-slate/60 overflow-hidden flex"
        aria-hidden="true"
      >
        <div className="h-full bg-gold/80" style={{ width: `${myWinRate}%` }} />
        <div className="h-full bg-mute/30" style={{ width: `${oppWinRate}%` }} />
      </div>

      {/* honesty hook + reconcile promise(真的由下方 MyTeamTrackRecord 兌現) */}
      <p className="mt-4 text-mute text-sm leading-relaxed">
        手機上那種「你的球隊今天幾 %」的勝率 · 給你一個冷數字就沒了 ·
        <strong className="text-bone">不會回來告訴你它到底準不準</strong>。
        我們會 —— 這場打完 · 萬象猜對了沒 · 自動記進你下面的戰績 · 不刪、不藏。
      </p>

      <div className="mt-4">
        <Link
          href={`/matches/${next.id}`}
          className="inline-block px-5 py-2 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
        >
          → 看萬象怎麼算這場
        </Link>
      </div>
    </div>
  );
}

function teamMatches(matchTeamName: string, myTeamFullName: string): boolean {
  if (!matchTeamName) return false;
  const t = getTeamByName(matchTeamName);
  if (!t) return false;
  return t.name === myTeamFullName;
}
