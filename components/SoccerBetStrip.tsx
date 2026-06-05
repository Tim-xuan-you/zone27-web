"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
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

  const started =
    kickedOff ||
    (() => {
      const t = Date.parse(dateISO);
      return !Number.isNaN(t) && Date.now() >= t;
    })();

  // 開賽瞬間自動鎖手(即使分頁一直開著沒重整)· 只對 24h 內的場設「一次性」timer(不輪詢 · 省資源)。
  useEffect(() => {
    const t = Date.parse(dateISO);
    if (Number.isNaN(t)) return;
    const ms = t - Date.now();
    if (ms <= 0) {
      setKickedOff(true);
      return;
    }
    if (ms > 24 * 3600 * 1000) return;
    const id = setTimeout(() => setKickedOff(true), ms);
    return () => clearTimeout(id);
  }, [dateISO]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
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
          setState("anon");
          return;
        }
        const mine = await getMySoccerPrediction(matchId);
        if (cancelled) return;
        if (mine) {
          setPick(mine);
          setState("picked");
        } else {
          setState(started ? "started" : "open");
        }
      } catch {
        if (!cancelled) setState("anon");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, started]);

  const choose = async (p: SoccerPick) => {
    if (saving) return;
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
            {state === "started" ? "已開賽 · 押注已鎖" : "你押哪邊?(押了不可改)"}
          </p>
          <div className="flex items-stretch gap-1.5">
            <BetBtn label={`看好 ${homeLabel.slice(0, 5)}`} disabled={state === "started" || saving} onClick={() => choose("home")} />
            <BetBtn label="和局" disabled={state === "started" || saving} onClick={() => choose("draw")} />
            <BetBtn label={`看好 ${awayLabel.slice(0, 5)}`} disabled={state === "started" || saving} onClick={() => choose("away")} />
          </div>
        </>
      )}

      {state === "picked" && pick && (
        <p className="font-mono text-gold text-[10px] tracking-[0.2em]">
          ✓ 你押了{" "}
          <span className="text-gold">
            {pick === "home" ? homeLabel : pick === "away" ? awayLabel : "和局"}
          </span>{" "}
          <span className="text-mute/60">· 押了鎖死 · 賽後逐場對帳(足球結算建置中)</span>
        </p>
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
