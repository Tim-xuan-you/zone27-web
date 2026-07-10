"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardBetStrip from "@/components/CardBetStrip";
import SoccerBetStrip from "@/components/SoccerBetStrip";
import TennisBetStrip from "@/components/TennisBetStrip";
import BadmintonBetStrip from "@/components/BadmintonBetStrip";
import MmaBetStrip from "@/components/MmaBetStrip";
import BasketballBetStrip from "@/components/BasketballBetStrip";
import { getMyStoredPick } from "@/lib/predictions-market";
import { machineVoice } from "@/lib/machine-voice";
import type { ChallengePhase, StoredPick } from "@/lib/challenge";
import type { DuelSport } from "@/lib/daily-duel";

// ── ZONE 27 · 戰帖對決盤(receiver · 盲押 → 揭盅 → 賽後對帳)──────────────────
// 朋友點開戰帖落地的核心島。 三段:
//   ① 賽前(pregame):對方那手對你封盤(看不到他押誰)· 你先盲押一手(重用該運動自己的下注流)·
//      你鎖手後才揭盅他押誰 = 結構上防跟單(看不到 → 抄不了)+ 強化校準護城河。 留存鉤子:賽後回來看誰讀贏。
//   ② 已開賽(live):封盤了 · 沒接到就過期 · 指你去今日一戰開自己的戰帖。
//   ③ 賽後(settled):對帳 —— 他押 X / 你押 Y / 誰讀得準(命中金 · 落空 loss 柔紅 · 平 mute · 無紅綠)。
//
// R294 · 六運動版:pick 一律 stored 空間(home/away/draw · a/b 運動 home=A/away=B)· 名字映射
// server 端已收斂(homeName/awayName)· 下注掛各運動自己的元件 · onLock 把該運動原生 pick 轉回
// stored 空間。 賽果語意:push = 棒球平手/MMA 和局(不比)· draw = 足球真和局(押和局算命中)。
//
// 對方那手是他『公開』的押注(本就掛在 /u/<碼>)→ 傳到 client 無隱私問題;「封盤」是遊戲感
// (你先押才揭),不是密碼學保證 —— 框架誠實寫「你先押,賽後見真章」,不宣稱看不到。
// 你自己那手:client 端讀 getMyStoredPick(跨運動同一支 RPC)· 已押 → 直接揭盅。
// ─────────────────────────────────────────────────────

export default function ChallengeBoard({
  code,
  sport,
  matchId,
  homeName,
  awayName,
  startISO,
  engineHomePct,
  challengerLabel,
  challengerPick,
  winner,
  phase,
  engine,
}: {
  code: string;
  sport: DuelSport;
  matchId: string;
  /** stored-pick 空間名字(a/b 運動:home = A、away = B) */
  homeName: string;
  awayName: string;
  startISO?: string | null;
  /** 棒球給 CardBetStrip 的主隊勝率(其餘運動的下注元件不吃引擎線) */
  engineHomePct?: number;
  challengerLabel: string;
  challengerPick: StoredPick | null;
  /** 賽果(stored 空間)· "push" = 棒球平手 / MMA 和局 · "draw" = 足球真和局 */
  winner: StoredPick | "push" | null;
  phase: ChallengePhase;
  /** 機器那手(stored 空間 · R295 機器嘴)· 只在 settled 開口(賽前/live 克制不加)·
   *  預設無 = 行為完全不變(optional-prop 加法模式 · R294 前例)。 */
  engine?: { name: string; pct: number; pick: StoredPick };
}) {
  const [viewerPick, setViewerPick] = useState<StoredPick | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mine = await getMyStoredPick(matchId);
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

  const nameOf = (p: StoredPick | null) =>
    p === "home" ? homeName : p === "away" ? awayName : p === "draw" ? "和局" : "—";

  // 鎖手成功(server 確認)→ 揭盅對方那手(stored 空間)。
  const lock = (p: StoredPick) => {
    setViewerPick(p);
    setRevealed(true);
  };
  const returnTo = `/vs/${code}?m=${matchId}`;

  // 你的一手:掛該運動自己的既有下注流(未登入→登入餌〔回跳這張戰帖〕· 已押→鎖定卡 · 開打→封盤)·
  // onLock 把各運動原生 pick 轉回 stored 空間(a→home / b→away · 足球/籃球本來就是 stored 值)。
  const betStrip =
    sport === "baseball" ? (
      <CardBetStrip
        matchId={matchId}
        homeName={homeName}
        awayName={awayName}
        startISO={startISO}
        engineHomePct={engineHomePct}
        returnTo={returnTo}
        onLock={lock}
      />
    ) : sport === "soccer" ? (
      <SoccerBetStrip
        matchId={matchId}
        dateISO={startISO ?? ""}
        homeLabel={homeName}
        awayLabel={awayName}
        locked
        returnTo={returnTo}
        onLock={lock}
      />
    ) : sport === "basketball" ? (
      <BasketballBetStrip
        gameId={matchId}
        startISO={startISO ?? ""}
        homeLabel={homeName}
        awayLabel={awayName}
        returnTo={returnTo}
        onLock={lock}
      />
    ) : sport === "tennis" ? (
      <TennisBetStrip
        matchId={matchId}
        startISO={startISO ?? ""}
        aLabel={homeName}
        bLabel={awayName}
        returnTo={returnTo}
        onLock={(p) => lock(p === "a" ? "home" : "away")}
      />
    ) : sport === "badminton" ? (
      <BadmintonBetStrip
        matchId={matchId}
        startISO={startISO ?? ""}
        aLabel={homeName}
        bLabel={awayName}
        returnTo={returnTo}
        onLock={(p) => lock(p === "a" ? "home" : "away")}
      />
    ) : (
      <MmaBetStrip
        matchId={matchId}
        startISO={startISO ?? ""}
        aLabel={homeName}
        bLabel={awayName}
        returnTo={returnTo}
        onLock={(p) => lock(p === "a" ? "home" : "away")}
      />
    );

  // ── ③ 賽後 · 對帳(誰讀得準)─────────────────────────────
  if (phase === "settled") {
    const push = winner === "push";
    const chHit = challengerPick != null && !push && challengerPick === winner;
    const vwHit = viewerPick != null && !push && viewerPick === winner;
    const winnerName =
      winner === "home"
        ? homeName
        : winner === "away"
          ? awayName
          : winner === "draw"
            ? "和局"
            : "平局";
    // 機器嘴(R295):對「自己那手」開口 —— 兩位人類都偏它中(這次不笑而不語)· 你逆風
    // 贏它(認帳)· 三個全偏(照單全收)。 其餘情境保持沉默(寧缺不空嗆)· push 不開口。
    const engineHit = engine != null && !push && engine.pick === winner;
    let machineLine: string | null = null;
    if (engine && !push && viewerPick != null) {
      if (challengerPick != null && !chHit && !vwHit && engineHit)
        machineLine = machineVoice({ kind: "challengeSettled", matchId, outcome: "machineOnly" });
      else if (vwHit && !engineHit)
        machineLine = machineVoice({ kind: "challengeSettled", matchId, outcome: "viewerBeatMachine" });
      else if (challengerPick != null && !chHit && !vwHit && !engineHit)
        machineLine = machineVoice({ kind: "challengeSettled", matchId, outcome: "allMissed" });
    }
    // 誰讀贏(兩邊都有押、且非推局才比)· 否則不下「誰贏」結論(誠實)。
    // 雙偏時「機器笑而不語」只在機器沒開口時保留(它都要開口了還寫笑而不語 = 自相矛盾)。
    let verdictLine: string | null = null;
    if (viewerPick != null && challengerPick != null && !push) {
      if (chHit && !vwHit) verdictLine = `${challengerLabel} 這場讀贏你`;
      else if (vwHit && !chHit) verdictLine = `你這場讀贏 ${challengerLabel}`;
      else if (chHit && vwHit) verdictLine = "這場兩個都讀對 · 平分秋色";
      else
        verdictLine = machineLine
          ? "這場兩個都讀偏了"
          : "這場兩個都讀偏了 · 機器笑而不語";
    }
    // 🔴 峰終時刻的「回敬」鉤子(散播命門 R288/R291 audit #1)· 賽後對帳是雙方最想嗆/雪恥的一刻,
    //   原本只有一條灰字連結 = 迴圈在此斷掉(A→B 應戰→B 贏→死路)。 文案吃對帳結果(贏想嗆 / 輸想雪恥 /
    //   平想加賽),落到今日一戰開一張「換你盲押我」的新戰帖(到那邊鎖一手即自帶分享鈕,把迴圈接回)。
    //   守紅線:數應戰不數連勝、無紅綠、無煙火、輸的框成「雪恥」而非「曬輸」。
    const rematchCta =
      viewerPick == null
        ? "換你開一張自己的戰帖"
        : push
          ? "這場平手 · 再開一張分高下"
          : vwHit && !chHit
            ? "你讀贏了 · 換你盲押我"
            : chHit && !vwHit
              ? "不服?開一張回敬"
              : "再開一張 · 分個高下";
    return (
      <div className="mt-5 border border-line/60 bg-slate/30 p-5">
        <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em] mb-3">
          賽後對帳 · 刪不掉
        </p>
        <p className="text-bone text-base sm:text-lg font-light leading-snug mb-4">
          結果:<span className="text-gold">{winnerName}</span>
          {winner === "home" || winner === "away" ? " 勝" : ""}
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

        {/* 機器嘴(R295):贏了直接記帳 · 輸了認帳 —— 只在贏時開口 = 賣明牌的行為,這裡不做。 */}
        {machineLine && (
          <p className="mt-3 font-mono text-bone/75 text-[11px] tracking-[0.05em] leading-relaxed">
            <span aria-hidden="true" className="text-gold/60">▦</span> 「{machineLine}」
          </p>
        )}

        <div className="mt-5 pt-4 border-t border-gold/15 flex flex-col gap-2.5">
          {/* 回敬:峰終時刻一鍵落今日一戰開新戰帖(到那邊鎖一手即自帶分享鈕 → 把斷掉的迴圈接回)。 */}
          <Link
            href="/today"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-gold/10 border border-gold/45 text-gold hover:bg-gold/15 hover:border-gold font-mono text-[11px] tracking-[0.2em] px-4 py-2.5 transition-colors"
          >
            {rematchCta} →
          </Link>
          <Link
            href={`/u/${code}`}
            className="text-center font-mono text-mute hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
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

      {betStrip}
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
