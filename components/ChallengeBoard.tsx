"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardBetStrip from "@/components/CardBetStrip";
import { getMyPrediction } from "@/lib/predictions-market";
import type { ChallengePhase } from "@/lib/challenge";

// ── ZONE 27 · 戰帖對決盤(receiver · 盲押 → 揭盅 → 賽後對帳)──────────────────
// 朋友點開戰帖落地的核心島。 三段:
//   ① 賽前(pregame):對方那手對你封盤(看不到他押誰)· 你先盲押一手(重用 CardBetStrip 下注流)·
//      你鎖手後才揭盅他押誰 = 結構上防跟單(看不到 → 抄不了)+ 強化校準護城河。 留存鉤子:賽後回來看誰讀贏。
//   ② 已開賽(live):封盤了 · 沒接到就過期 · 指你去今日一戰開自己的戰帖。
//   ③ 賽後(settled):對帳 —— 他押 X / 你押 Y / 誰讀得準(命中金 · 落空 loss 柔紅 · 平 mute · 無紅綠)。
//
// 對方那手是他『公開』的押注(本就掛在 /u/<碼>)→ 傳到 client 無隱私問題;「封盤」是遊戲感
// (你先押才揭),不是密碼學保證 —— 框架誠實寫「你先押,賽後見真章」,不宣稱看不到。
// 你自己那手:client 端讀 getMyPrediction(同 CardBetStrip)· 已押 → 直接揭盅。
// ─────────────────────────────────────────────────────

type Pick = "home" | "away";

export default function ChallengeBoard({
  code,
  matchId,
  homeName,
  awayName,
  startISO,
  engineHomePct,
  challengerLabel,
  challengerPick,
  finalWinner,
  phase,
}: {
  code: string;
  matchId: string;
  homeName: string;
  awayName: string;
  startISO?: string | null;
  engineHomePct?: number;
  challengerLabel: string;
  challengerPick: Pick | null;
  finalWinner: "home" | "away" | "tie" | null;
  phase: ChallengePhase;
}) {
  const [viewerPick, setViewerPick] = useState<Pick | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mine = await getMyPrediction(matchId);
      if (cancelled) return;
      if (mine) {
        setViewerPick(mine);
        setRevealed(true); // 已押過 → 直接揭盅(不再封)
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const nameOf = (p: Pick | null) =>
    p === "home" ? homeName : p === "away" ? awayName : "—";

  // ── ③ 賽後 · 對帳(誰讀得準)─────────────────────────────
  if (phase === "settled") {
    const push = finalWinner === "tie";
    const chHit = challengerPick != null && !push && challengerPick === finalWinner;
    const vwHit = viewerPick != null && !push && viewerPick === finalWinner;
    const winnerName =
      finalWinner === "home" ? homeName : finalWinner === "away" ? awayName : "平局";
    // 誰讀贏(兩邊都有押、且非平手才比)· 否則不下「誰贏」結論(誠實)。
    let verdictLine: string | null = null;
    if (viewerPick != null && challengerPick != null && !push) {
      if (chHit && !vwHit) verdictLine = `${challengerLabel} 這場讀贏你`;
      else if (vwHit && !chHit) verdictLine = `你這場讀贏 ${challengerLabel}`;
      else if (chHit && vwHit) verdictLine = "這場兩個都讀對 · 平分秋色";
      else verdictLine = "這場兩個都讀偏了 · 機器笑而不語";
    }
    return (
      <div className="mt-5 border border-line/60 bg-slate/30 p-5">
        <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em] mb-3">
          賽後對帳 · 刪不掉
        </p>
        <p className="text-bone text-base sm:text-lg font-light leading-snug mb-4">
          結果:<span className="text-gold">{winnerName}</span>
          {!push && (finalWinner === "home" || finalWinner === "away") ? " 勝" : ""}
        </p>

        <div className="flex flex-col gap-2.5">
          <VerdictRow who={challengerLabel} pickName={nameOf(challengerPick)} hit={chHit} push={push} missed={challengerPick != null && !push && !chHit} />
          {viewerPick != null ? (
            <VerdictRow who="你" pickName={nameOf(viewerPick)} hit={vwHit} push={push} missed={!push && !vwHit} />
          ) : (
            <p className="font-mono text-mute/60 text-[11px] tracking-[0.12em]">
              你那天沒接這張戰帖。
            </p>
          )}
        </div>

        {verdictLine && (
          <p className="mt-4 pt-3 border-t border-gold/15 text-bone/90 text-sm font-light leading-relaxed">
            {verdictLine}。
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.2em]">
          <Link
            href="/today"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            換你開一張戰帖 · 今日一戰 →
          </Link>
          <Link
            href={`/u/${code}`}
            className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            看 {challengerLabel} 的公開戰績 →
          </Link>
        </div>
      </div>
    );
  }

  // ── ② 已開賽 · 封盤(沒接到就過期)─────────────────────────
  if (phase === "live") {
    return (
      <div className="mt-5 border border-line/60 bg-slate/30 p-5">
        {revealed && viewerPick != null ? (
          <>
            <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-3">
              已開賽 · 兩手都封盤 · 終場見真章
            </p>
            <RevealRows
              challengerLabel={challengerLabel}
              challengerName={nameOf(challengerPick)}
              viewerName={nameOf(viewerPick)}
            />
            <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.12em] leading-relaxed">
              賽後回來看誰讀得準。
            </p>
          </>
        ) : (
          <>
            <p className="text-bone text-base font-light leading-snug mb-2">
              這場已經開賽 · 戰帖封盤了。
            </p>
            <p className="text-mute text-sm leading-relaxed mb-4">
              賽前才收應戰(先鎖後結 · 開打就封)。 換你站到機器對面、開一張自己的戰帖。
            </p>
            <Link
              href="/today"
              className="inline-block font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              今日一戰 · 你 vs 機器 →
            </Link>
          </>
        )}
      </div>
    );
  }

  // ── ① 賽前 · 盲押(核心)─────────────────────────────────
  return (
    <div className="mt-5 border border-gold/35 bg-slate/30 p-5">
      {revealed ? (
        // 你鎖手後 → 揭盅(他押誰)+ 留存鉤子。
        <>
          <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-3">
            兩手都封了 · 賽後見真章
          </p>
          <RevealRows
            challengerLabel={challengerLabel}
            challengerName={nameOf(challengerPick)}
            viewerName={nameOf(viewerPick)}
          />
          <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.12em] leading-relaxed">
            明天回來看誰讀得準 · 贏輸都記在你刪不掉的帳本上。
          </p>
          <div className="mt-4">
            <Link
              href="/today"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              也去開一張自己的戰帖 →
            </Link>
          </div>
        </>
      ) : (
        // 封盤狀態:不揭對方那手 · 你先盲押(誠實:你先押,賽後見真章 · 不宣稱看不到)。
        <>
          <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-2">
            這是一張戰帖
          </p>
          <p className="text-bone text-sm sm:text-base leading-relaxed mb-1">
            <span className="text-gold">{challengerLabel}</span>{" "}
            賽前就把這場的一手講死了 ——{" "}
            <span className="text-bone">你先押一手,賽後才揭盅誰讀得準</span>。
          </p>
          <p className="text-mute/80 text-xs leading-relaxed">
            看不到他押誰 = 比的是你自己的眼光,不是抄誰的單。
          </p>
        </>
      )}

      {/* 你的一手:重用今日一戰下注流(未登入→登入餌〔回跳這張戰帖〕· 已押→鎖定卡 · 開打→封盤)·
          鎖手成功(server 確認)→ onLock 揭盅對方那手。 */}
      <CardBetStrip
        matchId={matchId}
        homeName={homeName}
        awayName={awayName}
        startISO={startISO}
        engineHomePct={engineHomePct}
        returnTo={`/vs/${code}?m=${matchId}`}
        onLock={(pick) => {
          setViewerPick(pick);
          setRevealed(true);
        }}
      />
    </div>
  );
}

// 揭盅:他押 X · 你押 Y(賽前 / 已開賽都用 · 不下對錯結論 = 賽後才有)。
function RevealRows({
  challengerLabel,
  challengerName,
  viewerName,
}: {
  challengerLabel: string;
  challengerName: string;
  viewerName: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-[0.08em]">
      <span className="text-bone">
        {challengerLabel} 押 <span className="text-gold">{challengerName}</span>
      </span>
      <span className="text-bone">
        你 押 <span className="text-gold">{viewerName}</span>
      </span>
    </div>
  );
}

// 賽後對帳一列 · 命中金 / 落空 loss 柔紅 / 平 mute(守暗金無紅綠)。
function VerdictRow({
  who,
  pickName,
  hit,
  push,
  missed,
}: {
  who: string;
  pickName: string;
  hit: boolean;
  push: boolean;
  missed: boolean;
}) {
  const verdict = push ? "平" : hit ? "命中" : missed ? "落空" : "—";
  const color = hit ? "text-gold" : missed ? "text-loss" : "text-mute";
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-[12px] tracking-[0.08em]">
      <span className="text-bone min-w-0 truncate">
        {who} 押 {pickName}
      </span>
      <span className={`shrink-0 ${color}`}>{verdict}</span>
    </div>
  );
}
