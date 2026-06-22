"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AH_LINE, ahMarketId, type AhSide } from "@/lib/soccer/handicap";

// ── ZONE 27 · 足球讓分押注條(主 -0.5 / 客 +0.5)──────────────────────────────
// 跟「誰贏」「大小分」並排的第三個玩法。 主 -0.5 = 主隊要贏才過 · 客 +0.5 = 客隊贏或和都過。
// 引擎已算這條線(±0.5)· 賽前鎖一手、賽後用 90 分鐘終場對帳(主隊贏→主過;平或客贏→客過)。
// 押了不可改(先鎖後結)· 登入才能押 · 開賽鎖手。 純精神預測 · 0 金額。 守暗金:選中上金、其餘 mute。
//
// 🔴 走 ahMarketId(matchId) = `{fd-id}~ah05` → 跟「誰贏」「大小分」各自獨立一筆,被 `~` 隔離守門
//   擋在「誰贏」戰績外(見 lib/soccer/over-under.ts 隔離說明)。 pick 直接 home/away(讓分側=隊)。
// ─────────────────────────────────────────────────────

type State = "loading" | "anon" | "open" | "picked" | "started";

function isAh(v: unknown): v is AhSide {
  return v === "home" || v === "away";
}

export default function HandicapStrip({
  matchId,
  dateISO,
  homeLabel,
  awayLabel,
  homePct,
  awayPct,
  result = null,
  hideIfNoPick = false,
}: {
  matchId: string;
  dateISO: string;
  homeLabel: string;
  awayLabel: string;
  /** 引擎讓分機率(deriveSoccerMarkets handicapLines:[0.5])· 選填(收據 settled 不必再秀) */
  homePct?: number;
  awayPct?: number;
  /** 賽後讓分贏家側 · null = 還沒結算 */
  result?: AhSide | null;
  /** 收據模式:本人沒押這手 → 整塊隱藏(公開收據不留噪音) */
  hideIfNoPick?: boolean;
}) {
  const mkt = ahMarketId(matchId);
  const [state, setState] = useState<State>("loading");
  const [pick, setPick] = useState<AhSide | null>(null);
  const [homeN, setHomeN] = useState(0);
  const [awayN, setAwayN] = useState(0);
  const [saving, setSaving] = useState(false);
  const [, setKickedOff] = useState(false);

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
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: tally } = await supabase.rpc("get_match_prediction_tally", {
          p_match_id: mkt,
        });
        if (!cancelled && Array.isArray(tally) && tally[0]) {
          const r = tally[0] as { home_count?: unknown; away_count?: unknown };
          setHomeN(Number(r.home_count) || 0);
          setAwayN(Number(r.away_count) || 0);
        }
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          if (!cancelled) setState("anon");
          return;
        }
        const { data: mine } = await supabase.rpc("get_my_prediction", {
          p_match_id: mkt,
        });
        const myPick =
          Array.isArray(mine) && mine[0] && isAh((mine[0] as { pick?: unknown }).pick)
            ? ((mine[0] as { pick: AhSide }).pick)
            : null;
        if (cancelled) return;
        if (myPick) {
          setPick(myPick);
          setState("picked");
        } else {
          const t = Date.parse(dateISO);
          setState(!Number.isNaN(t) && t <= Date.now() ? "started" : "open");
        }
      } catch {
        if (!cancelled) setState("anon");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mkt, dateISO]);

  const choose = async (side: AhSide) => {
    if (saving) return;
    const t = Date.parse(dateISO);
    if (!Number.isNaN(t) && t <= Date.now()) {
      setKickedOff(true);
      setState("started");
      return;
    }
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.rpc("submit_prediction", {
        p_match_id: mkt,
        p_pick: side,
      });
      if (!error) {
        setPick(side);
        setState("picked");
        if (side === "home") setHomeN((n) => n + 1);
        else setAwayN((n) => n + 1);
      }
    } catch {
      /* graceful */
    } finally {
      setSaving(false);
    }
  };

  const total = homeN + awayN;
  const SHOW_MIN = 5;
  const homeShare = total > 0 ? Math.round((homeN / total) * 100) : 0;

  const settled = result === "home" || result === "away";
  const youHit = settled && pick !== null ? pick === result : null;
  const sideLabel = (s: AhSide) =>
    s === "home" ? `${homeLabel} -${AH_LINE}` : `${awayLabel} +${AH_LINE}`;

  if (hideIfNoPick && pick === null) return null;

  return (
    <div className="mt-2.5 pt-2.5 border-t border-line/40">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
          / 讓分 {AH_LINE}{settled ? "" : " · 押一手"}
        </p>
        {typeof homePct === "number" && typeof awayPct === "number" ? (
          <p className="font-mono text-mute/45 text-[8px] tracking-[0.3em]">
            引擎 主{homePct}% · 客{awayPct}%
          </p>
        ) : (
          <span />
        )}
      </div>

      {state === "loading" && !settled ? (
        <p className="font-mono text-mute/40 text-[10px] tracking-[0.25em]">…</p>
      ) : settled ? (
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.12em]">
            <span className="text-mute/70">結果 · </span>
            <span className="text-gold">{sideLabel(result)} 過</span>
          </p>
          {pick !== null ? (
            <p className="font-mono text-[11px] tracking-[0.12em]">
              你押{pick === "home" ? "主" : "客"} ·{" "}
              {youHit ? (
                <span className="text-gold">命中 ✓</span>
              ) : (
                <span className="text-loss/85">落空 ✕</span>
              )}
            </p>
          ) : (
            <p className="font-mono text-mute/45 text-[10px] tracking-[0.15em]">你沒押這手</p>
          )}
        </div>
      ) : state === "picked" && pick ? (
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-gold text-[11px] tracking-[0.12em]">
            ✓ 賽前鎖定 · 你押 {sideLabel(pick)}
          </p>
          {total >= SHOW_MIN && (
            <p className="font-mono text-mute/60 text-[10px] tabular tracking-[0.1em]">
              群眾 主{homeShare}% · 客{100 - homeShare}%
            </p>
          )}
        </div>
      ) : state === "anon" ? (
        <Link
          href={`/login?next=${encodeURIComponent("/soccer")}`}
          className="block font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.2em] transition-colors"
        >
          登入(免費)就能賽前鎖讓分 →
        </Link>
      ) : state === "started" ? (
        <p className="font-mono text-mute/50 text-[10px] tracking-[0.15em]">
          已開賽 · 讓分鎖手(待賽後對帳)
        </p>
      ) : (
        <div className="flex gap-1.5">
          <AhBtn label={`${homeLabel} -${AH_LINE}`} sub="主隊要贏" onClick={() => choose("home")} disabled={saving} />
          <AhBtn label={`${awayLabel} +${AH_LINE}`} sub="贏或和都過" onClick={() => choose("away")} disabled={saving} />
        </div>
      )}

      {!settled && state === "open" && total >= SHOW_MIN && (
        <p className="mt-1.5 font-mono text-mute/55 text-[10px] tabular tracking-[0.1em]">
          群眾 主{homeShare}% · 客{100 - homeShare}%（{total} 人）
        </p>
      )}
    </div>
  );
}

function AhBtn({
  label,
  sub,
  onClick,
  disabled,
}: {
  label: string;
  sub: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 flex flex-col items-center gap-0.5 border border-line/60 hover:border-gold/60 hover:bg-gold/5 py-2 transition-colors disabled:opacity-50 min-w-0"
    >
      <span className="font-mono text-bone text-[11px] tracking-[0.1em] truncate max-w-full px-1">{label}</span>
      <span className="font-mono text-mute/50 text-[8px] tracking-[0.1em]">{sub}</span>
    </button>
  );
}
