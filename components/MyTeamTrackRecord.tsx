"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";
import { getMyTeam, getTeamById, getTeamByName } from "@/lib/teams";

// ── ZONE 27 · My Team Track Record ──────────────────────
// Round 31 W-N · 對你(這個富邦球迷)說話 · 不對「球迷」說話
//
// 接收 server-rendered finalized matches list · client-side filter by
// myTeam(localStorage) · 算 N · proved · diverged for that team · display
// personalized counter「您支持的 {team} 引擎 N=X · ✓Y ✕Z」。
//
// SSR-safe:hydrate 前 render 空(無球隊選擇 = 不顯示)· client mount 後
// 讀 localStorage · 套用。 避免 hydration mismatch via mounted flag。
// ─────────────────────────────────────────────────────

export type MyTeamMatch = {
  id: string;
  homeName: string;
  awayName: string;
  homePicked: boolean; // engine pre-game pick(home > away)
  homeWon: boolean | null; // null if no final / tie
  isFinal: boolean;
};

type Props = {
  matches: MyTeamMatch[];
};

export default function MyTeamTrackRecord({ matches }: Props) {
  // R162 W1 · useMounted canonical hook · separated from storage listener
  const mounted = useMounted();
  const [, refresh] = useState(0);

  useEffect(() => {
    // Listen for storage events (other tabs / cross-component team changes)
    const onStorage = () => refresh((x) => x + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!mounted) return null;

  const myTeamId = getMyTeam();
  if (!myTeamId) return null; // No personalization unless team selected
  const myTeam = getTeamById(myTeamId);
  if (!myTeam) return null;

  // Filter finalized matches involving my team
  const myMatches = matches.filter(
    (m) => m.isFinal && (matchesTeam(m.homeName, myTeam.name) || matchesTeam(m.awayName, myTeam.name))
  );
  const n = myMatches.length;

  let proved = 0;
  let diverged = 0;
  for (const m of myMatches) {
    if (m.homeWon === null) continue;
    const myTeamIsHome = matchesTeam(m.homeName, myTeam.name);
    const enginePickedMyTeam =
      (myTeamIsHome && m.homePicked) || (!myTeamIsHome && !m.homePicked);
    const myTeamWon = (myTeamIsHome && m.homeWon) || (!myTeamIsHome && !m.homeWon);
    if (enginePickedMyTeam === myTeamWon) proved++;
    else diverged++;
  }

  return (
    <div className="mt-5 bg-slate/40 border border-gold/40 p-5 sm:p-6">
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
      >
        / YOUR TEAM · 您支持 {myTeam.short}
      </p>
      {n === 0 ? (
        <p className="text-mute text-sm leading-relaxed">
          引擎還沒 finalize 過任何 <strong className="text-bone">{myTeam.name}</strong> 的場次。
          您支持的隊本週 covered:看{" "}
          <Link
            href="/coverage"
            className="text-gold underline-offset-4 hover:underline"
          >
            /coverage
          </Link>
          {" "}決定哪些場進 engine。
        </p>
      ) : (
        <>
          <p className="text-bone text-sm sm:text-base leading-relaxed mb-2">
            引擎針對 <strong className="text-gold">{myTeam.name}</strong> 已 finalize{" "}
            <span className="font-mono text-gold tabular">N = {n}</span> 場 ·{" "}
            <span className="text-gold/90">✓{proved} PROVED</span> /{" "}
            <span className="text-loss/80">✕{diverged} DIVERGED</span>
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            「您支持的隊 · 引擎這場猜對了 / 猜錯了」 personal calibration · per
            critic-hardening agent W-G ONE deepest call · 不對其他球迷 broadcast
            · 純您 own personal narrative。
          </p>
        </>
      )}
    </div>
  );
}

function matchesTeam(matchTeamName: string, myTeamFullName: string): boolean {
  if (!matchTeamName) return false;
  const t = getTeamByName(matchTeamName);
  if (!t) return false;
  return t.name === myTeamFullName;
}
