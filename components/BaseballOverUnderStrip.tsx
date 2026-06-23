"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { bouMarketId, type BouSide } from "@/lib/baseball-totals";

// ── ZONE 27 · 棒球大小分押注條(看大 / 看小 · 引擎挑的公平線)──────────────────────
// 跟「誰贏」並排的玩法。 看大 = 總分 > 線 · 看小 = 總分 < 線。 引擎用全季真實得分基準 +
// 兩隊先發品質,每場挑「最接近五五波」的 .5 線(deriveBaseballTotal)· 賽後用終場總分對帳。
// 押了不可改(先鎖後結)· 登入才能押 · 開賽鎖手。 純精神預測 · 0 金額。 守暗金:選中上金、其餘 mute。
//
// 🔴 走 bouMarketId(matchId, line) = `{cpbl-id}~bou{線×10}` → 跟「誰贏」「大小分線值」各自獨立一筆,
//   被 `~` 隔離守門擋在「誰贏」戰績外(predictions-server/-market/profile-server/pulse/settlement-data)。
//   線編進場號 = 凍線,賽後對「當初那條線」結算。 over=home / under=away(塞既有 home/away · 0 migration)。
// ─────────────────────────────────────────────────────

type State = "loading" | "anon" | "open" | "picked" | "started";

function isBou(v: unknown): v is BouSide {
  return v === "home" || v === "away"; // home=看大 · away=看小(submit 存的是 home/away)
}

export default function BaseballOverUnderStrip({
  matchId,
  dateISO,
  line,
  overPct,
  underPct,
  result = null,
  hideIfNoPick = false,
}: {
  matchId: string;
  dateISO: string | null;
  /** 引擎挑的那條線(7.5 / 8.5 …)· 凍進場號 */
  line: number;
  /** 引擎大/小機率 · 選填(收據 settled 不必再秀) */
  overPct?: number;
  underPct?: number;
  /** 賽後贏家側 · "over" / "under" · null = 還沒結算 */
  result?: BouSide | null;
  /** 收據模式:本人沒押這手 → 整塊隱藏 */
  hideIfNoPick?: boolean;
}) {
  const mkt = bouMarketId(matchId, line);
  const [state, setState] = useState<State>("loading");
  // 存的是 home(看大)/ away(看小)
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  const [overN, setOverN] = useState(0);
  const [underN, setUnderN] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = Date.parse(dateISO ?? "");
    if (Number.isNaN(t)) return;
    const ms = t - Date.now();
    if (ms > 24 * 3600 * 1000) return;
    const id = setTimeout(
      () => setState((s) => (s === "open" ? "started" : s)),
      Math.max(ms, 0),
    );
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
          setOverN(Number(r.home_count) || 0);
          setUnderN(Number(r.away_count) || 0);
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
          Array.isArray(mine) && mine[0] && isBou((mine[0] as { pick?: unknown }).pick)
            ? ((mine[0] as { pick: "home" | "away" }).pick)
            : null;
        if (cancelled) return;
        if (myPick) {
          setPick(myPick);
          setState("picked");
        } else {
          const t = Date.parse(dateISO ?? "");
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

  const choose = async (side: "home" | "away") => {
    if (saving) return;
    const t = Date.parse(dateISO ?? "");
    if (!Number.isNaN(t) && t <= Date.now()) {
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
        if (side === "home") setOverN((n) => n + 1);
        else setUnderN((n) => n + 1);
      }
    } catch {
      /* graceful */
    } finally {
      setSaving(false);
    }
  };

  const total = overN + underN;
  const SHOW_MIN = 5;
  const overShare = total > 0 ? Math.round((overN / total) * 100) : 0;

  const settled = result === "over" || result === "under";
  // result "over"=home 過 · "under"=away 過 · pick home=看大 · away=看小
  const resultPick = result === "over" ? "home" : result === "under" ? "away" : null;
  const youHit = settled && pick !== null ? pick === resultPick : null;
  const sideLabel = (p: "home" | "away") => (p === "home" ? "看大" : "看小");

  if (hideIfNoPick && pick === null) return null;

  return (
    <div className="mt-2.5 pt-2.5 border-t border-line/40">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
          / 大小分 {line}{settled ? "" : " · 押一手"}
        </p>
        {typeof overPct === "number" && typeof underPct === "number" ? (
          <p className="font-mono text-mute/45 text-[8px] tracking-[0.3em]">
            引擎 大{overPct}% · 小{underPct}%
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
            <span className="text-gold">{result === "over" ? "大" : "小"} 過</span>
          </p>
          {pick !== null ? (
            <p className="font-mono text-[11px] tracking-[0.12em]">
              你{sideLabel(pick)} ·{" "}
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
            ✓ 賽前鎖定 · 你押 {sideLabel(pick)} {line}
          </p>
          {total >= SHOW_MIN && (
            <p className="font-mono text-mute/60 text-[10px] tabular tracking-[0.1em]">
              群眾 大{overShare}% · 小{100 - overShare}%
            </p>
          )}
        </div>
      ) : state === "anon" ? (
        <Link
          href={`/login?next=${encodeURIComponent("/matches")}`}
          className="block font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.2em] transition-colors"
        >
          登入(免費)就能賽前鎖大小分 →
        </Link>
      ) : state === "started" ? (
        <p className="font-mono text-mute/50 text-[10px] tracking-[0.15em]">
          已開賽 · 大小分鎖手(待賽後對帳)
        </p>
      ) : (
        <div className="flex gap-1.5">
          <BouBtn label={`看大 ${line} 以上`} onClick={() => choose("home")} disabled={saving} />
          <BouBtn label={`看小 ${line} 以下`} onClick={() => choose("away")} disabled={saving} />
        </div>
      )}

      {!settled && state === "open" && total >= SHOW_MIN && (
        <p className="mt-1.5 font-mono text-mute/55 text-[10px] tabular tracking-[0.1em]">
          群眾 大{overShare}% · 小{100 - overShare}%（{total} 人）
        </p>
      )}
    </div>
  );
}

function BouBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 flex items-center justify-center border border-line/60 hover:border-gold/60 hover:bg-gold/5 py-2 transition-colors disabled:opacity-50 min-w-0"
    >
      <span className="font-mono text-bone text-[11px] tracking-[0.1em] truncate max-w-full px-1">{label}</span>
    </button>
  );
}
