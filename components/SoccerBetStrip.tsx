"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { matchHasStarted } from "@/lib/matches";
import {
  getMySoccerPrediction,
  getSoccerTally,
  submitSoccerPrediction,
  crowdPercents,
  SOCCER_CROWD_MIN,
  type SoccerPick,
  type SoccerTally,
} from "@/lib/soccer/predictions";

// ── ZONE 27 · 足球三向押注條 ──────────────────────────────
// 主勝 / 和 / 客勝。 押了不可改(先鎖後結)· 登入才能押(R188)· 開賽後鎖手。
// 純精神預測 = 遊戲 · 0 金額。 賽後自動掛準/不準進你的足球準度(跟棒球分開算)。
// 守暗金品牌:選中上金 · 其餘 mute · 無紅綠。
// ─────────────────────────────────────────────────────

type State = "loading" | "anon" | "open" | "picked" | "started";

export default function SoccerBetStrip({
  matchId,
  dateISO,
  homeLabel,
  awayLabel,
}: {
  matchId: string;
  dateISO: string;
  homeLabel: string;
  awayLabel: string;
}) {
  const [state, setState] = useState<State>("loading");
  const [pick, setPick] = useState<SoccerPick | null>(null);
  const [tally, setTally] = useState<SoccerTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [kickedOff, setKickedOff] = useState(false);

  // 開賽瞬間自動鎖手(即使分頁一直開著沒重整)· 只對 24h 內的場設「一次性」timer(不輪詢 ·
  // 省資源)。 已開賽的場走 0ms timer(setState 只在 timer callback 裡 · 不在 render/effect
  // 本體讀時鐘 → 無 purity / 無同步 setState 連鎖)。 >24h 的殭屍分頁由 choose() 點擊時重驗兜底。
  useEffect(() => {
    const t = Date.parse(dateISO);
    if (Number.isNaN(t)) return;
    const ms = t - Date.now();
    if (ms > 24 * 3600 * 1000) return;
    const id = setTimeout(() => setKickedOff(true), Math.max(ms, 0));
    return () => clearTimeout(id);
  }, [dateISO]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // effect 內讀時鐘(house style 同 CardBetStrip)· 蓋掉 0ms timer 還沒 fire 的窗。
      const startedNow = kickedOff || matchHasStarted(dateISO);
      getSoccerTally(matchId).then((t) => {
        if (!cancelled) setTally(t);
      });
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          // 已開賽就不掛「登入就能押」的餌(登入後也押不了 = 釣魚)· 直接顯示封盤。
          setState(startedNow ? "started" : "anon");
          return;
        }
        const mine = await getMySoccerPrediction(matchId);
        if (cancelled) return;
        if (mine) {
          setPick(mine);
          setState("picked");
        } else {
          setState(startedNow ? "started" : "open");
        }
      } catch {
        if (!cancelled) setState(startedNow ? "started" : "anon");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, dateISO, kickedOff]);

  const choose = async (p: SoccerPick) => {
    if (saving) return;
    // 點擊瞬間重驗開賽(殭屍分頁兜底:>24h 沒 timer、或手機分頁喚醒)· server 端
    // 0018 尚無時間閘 → 這裡是先鎖後結的最後一道顯示層防線。
    if (matchHasStarted(dateISO)) {
      setKickedOff(true);
      setState("started");
      return;
    }
    setSaving(true);
    const res = await submitSoccerPrediction(matchId, p);
    if (res.ok) {
      setPick(p);
      setState("picked");
      getSoccerTally(matchId).then(setTally);
    } else if (res.reason === "not_logged_in") {
      setState("anon");
    } else if (res.reason === "already_predicted") {
      const mine = await getMySoccerPrediction(matchId);
      setPick(mine);
      setState("picked");
    }
    setSaving(false);
  };

  return (
    <div className="mt-3 pt-2.5 border-t border-line/40">
      {state === "loading" && (
        <p className="font-mono text-mute/40 text-[9px] tracking-[0.3em]">···</p>
      )}

      {state === "anon" && (
        <Link
          href={`/login?next=${encodeURIComponent("/soccer")}`}
          className="flex items-center justify-between gap-2 group"
        >
          <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em]">
            ▸ 登入就能押這場(免費 · 押了鎖死、賽後對帳)
          </span>
          <span className="font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em] shrink-0">
            登入 →
          </span>
        </Link>
      )}

      {(state === "open" || state === "started") && (
        <>
          <p className="font-mono text-mute/60 text-[9px] tracking-[0.2em] mb-1.5">
            {state === "started" ? "已開賽 · 封盤 · 賽前才收" : "你押哪邊?(押了不可改)"}
          </p>
          <div className="flex items-stretch gap-1.5">
            <BetBtn label={`看好 ${homeLabel.slice(0, 5)}`} disabled={state === "started" || saving} onClick={() => choose("home")} />
            <BetBtn label="和局" disabled={state === "started" || saving} onClick={() => choose("draw")} />
            <BetBtn label={`看好 ${awayLabel.slice(0, 5)}`} disabled={state === "started" || saving} onClick={() => choose("away")} />
          </div>
        </>
      )}

      {/* 押下那一刻 = 全漏斗最高張力(Kahneman peak-end + endowment)· 不再只是一行灰字。
          把它做成「迷你收據」:賽前鎖死、刪不掉、這是你帳本第一筆 → 接往你的戰績。
          守紅線:暗金、無 emoji、無動畫(用既有 enter-fade-up)。 */}
      {state === "picked" && pick && (
        <div className="enter-fade-up border border-gold/40 bg-gold/5 px-3 py-2.5">
          <p className="font-mono text-mute/55 text-[8px] tracking-[0.3em] mb-1">
            ✓ 賽前鎖定 · 刪不掉
          </p>
          <p className="text-gold text-sm sm:text-base font-light tracking-tight leading-none">
            你押了 {pick === "home" ? homeLabel : pick === "away" ? awayLabel : "和局"}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
            <span className="font-mono text-mute/55 text-[9px] tracking-[0.15em]">
              賽後逐場對帳 · 連輸的都留著
            </span>
            <Link
              href="/member"
              className="font-mono text-gold/70 hover:text-gold text-[9px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors shrink-0"
            >
              進你的帳本 →
            </Link>
          </div>
        </div>
      )}

      <CrowdLine tally={tally} homeLabel={homeLabel} awayLabel={awayLabel} />
    </div>
  );
}

function BetBtn({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 px-2 py-1.5 font-mono text-[10px] tracking-[0.1em] border border-line/60 text-mute hover:border-gold/50 hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {label}
    </button>
  );
}

function CrowdLine({
  tally,
  homeLabel,
  awayLabel,
}: {
  tally: SoccerTally | null;
  homeLabel: string;
  awayLabel: string;
}) {
  if (!tally || tally.total === 0) return null;
  if (tally.total < SOCCER_CROWD_MIN) {
    return (
      <p className="mt-2 font-mono text-mute/45 text-[9px] tracking-[0.15em]">
        {tally.total} 人押了 · 滿 {SOCCER_CROWD_MIN} 人才畫群眾市場線
      </p>
    );
  }
  const p = crowdPercents(tally);
  return (
    <p className="mt-2 font-mono text-mute/55 text-[9px] tracking-[0.12em] tabular">
      群眾:{homeLabel.slice(0, 4)} {p.home}% · 和 {p.draw}% ·{" "}
      {awayLabel.slice(0, 4)} {p.away}%{" "}
      <span className="text-mute/40">({tally.total} 人)</span>
    </p>
  );
}
