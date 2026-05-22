"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyTeam, getTeamById, getTeamByName } from "@/lib/teams";

// ── ZONE 27 · Member Daily Brief ────────────────────────
// Round 31 W-V · Tim canary fire「會員頁面了 · 能幹嘛?沒社交 · 沒功能
// · 為什麼付費訂閱」 critical fire · 必須 ship 「為什麼註冊」 immediate
// answer。
//
// Brand IP yield(per [[feedback_zone27_pratfall_brand_ip]] · Tim 2+
// canary 同方向 = 我 over-defended · 修不是 reframe · 是 ship 真實
// daily value loop):
//
// 純 derived data(no DB · no Tim manual write):
//   - 今晚 ZONE 27 公開預測幾場
//   - 您支持的隊(z27_team localStorage · per W-N)有沒上場
//   - 您隊是 favorite / underdog · 引擎 say N%
//   - 22:30 後 verdict 進 /member/calibration mirror
//
// 兩 mode:
//   - 已選隊 + 您隊今晚有場:personalized「您支持的 [team] 今晚...」
//   - 已選隊 + 您隊今晚沒場:「您支持的 [team] 今晚沒上 · 看全聯盟」
//   - 未選隊:「今晚 N 場 · select 您的隊讓 brief personalize → ↓」
//
// 給 logged-in FREE TIER member 「daily reason to come back」 · 不需付費
// · brand-IP-pure · 直接 surface 「會員 own personal narrative」 value。
// ─────────────────────────────────────────────────────

export type DailyMatchSummary = {
  id: string;
  homeName: string;
  awayName: string;
  homeWinRate: number;
  awayWinRate: number;
  startTime: string;
  venue: string;
  isFinal: boolean;
};

type Props = {
  todayMatches: DailyMatchSummary[];
};

export default function MemberDailyBrief({ todayMatches }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-6" aria-hidden="true">
        <p className="font-mono text-mute/50 text-[10px] tracking-[0.4em]">
          / DAILY BRIEF · 載入中...
        </p>
      </div>
    );
  }

  if (todayMatches.length === 0) {
    return (
      <div className="bg-slate/40 border border-line/60 p-5 sm:p-6">
        <p
          lang="en"
          className="font-mono text-mute text-[10px] tracking-[0.4em] mb-3"
        >
          / DAILY BRIEF · 今日無公開預測
        </p>
        <p className="text-mute text-sm leading-relaxed">
          ZONE 27 引擎今天沒 cover 任何場(休賽日 / 季外 / 等 Tim 截 cpbl 賽程)。
          您 follow 過的賽事 verdict 在{" "}
          <Link
            href="/member/calibration"
            className="text-gold hover:underline underline-offset-4"
          >
            /member/calibration
          </Link>{" "}
          mirror · 公開戰績在{" "}
          <Link
            href="/track-record"
            className="text-gold hover:underline underline-offset-4"
          >
            /track-record
          </Link>。
        </p>
      </div>
    );
  }

  const myTeamId = getMyTeam();
  const myTeam = getTeamById(myTeamId);

  // Match where myTeam is playing(home or away)
  const myMatch = myTeam
    ? todayMatches.find(
        (m) =>
          getTeamByName(m.homeName)?.id === myTeam.id ||
          getTeamByName(m.awayName)?.id === myTeam.id
      )
    : null;

  // Mode A · myTeam selected AND playing today
  if (myMatch && myTeam) {
    const myTeamIsHome = getTeamByName(myMatch.homeName)?.id === myTeam.id;
    const myTeamRate = myTeamIsHome
      ? myMatch.homeWinRate
      : myMatch.awayWinRate;
    const oppName = myTeamIsHome ? myMatch.awayName : myMatch.homeName;
    const isFavorite = myTeamRate >= 50;
    return (
      <div className="bg-gold/5 border-2 border-gold/60 glow-soft p-5 sm:p-6">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em] mb-3"
        >
          ★ DAILY BRIEF · 您支持的 {myTeam.short} 今晚
        </p>
        <h3 className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-3">
          {myTeam.short}{" "}
          <span className="text-mute/60">vs</span>{" "}
          {oppName.replace(myTeam.name, "")}{" "}
          <span className="text-mute text-base">· {myMatch.startTime} · {myMatch.venue.replace("棒球場", "")}</span>
        </h3>
        <p className="text-bone text-base sm:text-lg leading-relaxed mb-4">
          引擎賽前 say 您隊{" "}
          <span className="font-mono text-gold tabular text-xl">{myTeamRate}%</span>
          {" · "}
          <strong className={isFavorite ? "text-gold" : "text-loss/80"}>
            {isFavorite ? "favorite" : "underdog"}
          </strong>
          {" · "}
          {isFavorite
            ? "引擎押您隊 · 22:30 後驗"
            : "引擎不押您隊 · 22:30 後看 underdog 反勝率"}
        </p>
        <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed mb-4">
          ▸ 賽後 verdict(PROVED ✓ / DIVERGED ✕)自動進您{" "}
          <Link
            href="/member/calibration"
            className="text-gold hover:underline underline-offset-4"
          >
            /member/calibration
          </Link>
          {" "}個人 mirror · 您 personal N=X 累計 +1
        </p>
        <Link
          href={`/matches/${myMatch.id}`}
          className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          → 看引擎完整分析 · 點 ★ Follow
        </Link>
      </div>
    );
  }

  // Mode B · myTeam selected but NOT playing today
  if (myTeam) {
    return (
      <div className="bg-slate/40 border border-line/60 p-5 sm:p-6">
        <p
          lang="en"
          className="font-mono text-mute text-[10px] tracking-[0.4em] mb-3"
        >
          / DAILY BRIEF · 您支持的 {myTeam.short} 今晚沒上
        </p>
        <p className="text-bone text-sm sm:text-base leading-relaxed mb-3">
          今晚 ZONE 27 公開預測{" "}
          <span className="font-mono text-gold tabular">{todayMatches.length}</span>{" "}
          場 · {myTeam.short} 不在 · 您可以看全聯盟 receipts 或 follow 中性場。
        </p>
        <Link
          href="/"
          className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
        >
          → 看今晚 {todayMatches.length} 場 TONIGHT RECEIPTS
        </Link>
      </div>
    );
  }

  // Mode C · no team selected
  return (
    <div className="bg-slate/40 border border-gold/30 p-5 sm:p-6">
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
      >
        / DAILY BRIEF · 今晚 {todayMatches.length} 場引擎已 LOCKED
      </p>
      <p className="text-bone text-sm sm:text-base leading-relaxed mb-3">
        選您支持的隊 · brief 自動 personalize 「您隊今晚 vs X · 引擎押 N%」
        每日值得回來看。 0 cookie · 0 server · 0 PII · 純您 browser
        localStorage。
      </p>
      <Link
        href="/track-record"
        className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
      >
        → 去 /track-record 選您的隊
      </Link>
    </div>
  );
}
