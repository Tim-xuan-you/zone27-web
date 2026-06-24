"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  bouMarketId,
  bouLineFromMarketId,
  isBouMarketId,
  bouResultFromScore,
} from "@/lib/baseball-totals";

// ── ZONE 27 · 棒球大小分押注條(看大 / 看小 · 引擎挑的公平線)──────────────────────
// 跟「誰贏」並排的玩法。 看大 = 總分 > 線 · 看小 = 總分 < 線。 引擎用全季真實得分基準 +
// 兩隊先發品質,每場挑「最接近五五波」的 .5 線(deriveBaseballTotal)· 賽後用終場總分對帳。
// 押了不可改(先鎖後結)· 登入才能押 · 開賽鎖手。 純精神預測 · 0 金額。 守暗金:選中上金、其餘 mute。
//
// 🔴 走 bouMarketId(matchId, line) = `{cpbl-id}~bou{線×10}` → 跟「誰贏」「大小分線值」各自獨立一筆,
//   被 `~` 隔離守門擋在「誰贏」戰績外(predictions-server/-market/profile-server/pulse/settlement-data)。
//   線編進場號 = 凍線,賽後對「當初那條線」結算。 over=home / under=away(塞既有 home/away · 0 migration)。
//
// 🔴 賽前 vs 賽後是兩種模式:
//   · 賽前(傳 line)→ 用引擎當下挑的那條線開押注按鈕、查群眾共識 + 本人這手。
//   · 賽後收據(傳 finalScore · 不傳 line)→ **不重算引擎線**:賽季得分基線會隨賽程位移,賽後重算
//     deriveBaseballTotal 可能跳到另一條線 → 查不到用戶當初押的場號 →「顯示沒押過的線 / 整條消失」。
//     改成:讀本人 picks、找這場的 ~bou 那手、用 bouLineFromMarketId 解出**凍在場號裡的線**、再用
//     終場總分對「那條線」結算(bouResultFromScore)。 永久帳本本來就對每條候選線各記一筆,不受影響;
//     這支只修「賽後收據顯示」這層。
// ─────────────────────────────────────────────────────

type State = "loading" | "anon" | "open" | "picked" | "started";

// 大小分押注存的是 home(看大)/ away(看小)· 跟「誰贏」一樣塞既有 home/away 欄(0 migration)。
function isBou(v: unknown): v is "home" | "away" {
  return v === "home" || v === "away";
}

export default function BaseballOverUnderStrip({
  matchId,
  dateISO,
  line,
  overPct,
  underPct,
  finalScore = null,
  hideIfNoPick = false,
}: {
  matchId: string;
  dateISO: string | null;
  /** 引擎挑的那條線(7.5 / 8.5 …)· 凍進場號 · 賽前押注模式必傳;賽後收據模式不傳(改解凍線)。 */
  line?: number;
  /** 引擎大/小機率 · 選填(收據 settled 不必再秀) */
  overPct?: number;
  underPct?: number;
  /** 賽後終場比分(本人押的那條線 = 解凍出來的 · 不靠引擎重算)· null = 賽前押注模式 */
  finalScore?: { home: number; away: number } | null;
  /** 收據模式:本人沒押這手 → 整塊隱藏 */
  hideIfNoPick?: boolean;
}) {
  const settledMode = finalScore !== null;
  return settledMode ? (
    <SettledReceipt
      matchId={matchId}
      finalScore={finalScore}
      hideIfNoPick={hideIfNoPick}
    />
  ) : (
    <PregameStrip
      matchId={matchId}
      dateISO={dateISO}
      line={line ?? 0}
      overPct={overPct}
      underPct={underPct}
    />
  );
}

// ── 賽後收據:解出用戶凍在場號裡的線 + 終場總分結算(免賽季基線位移 drift)──────────────
function SettledReceipt({
  matchId,
  finalScore,
  hideIfNoPick,
}: {
  matchId: string;
  finalScore: { home: number; away: number };
  hideIfNoPick: boolean;
}) {
  const [ready, setReady] = useState(false);
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  const [resolvedLine, setResolvedLine] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          if (!cancelled) setReady(true);
          return;
        }
        // 讀本人全部 picks,找「這場」的大小分那手(get_my_predictions 已 created_at desc → 取最近一筆)。
        const { data: mine } = await supabase.rpc("get_my_predictions");
        if (cancelled) return;
        if (Array.isArray(mine)) {
          for (const row of mine as { match_id?: unknown; pick?: unknown }[]) {
            const id = typeof row.match_id === "string" ? row.match_id : "";
            if (!isBouMarketId(id)) continue;
            // 同一場:`{matchId}~bou…` 去後綴 == matchId(基礎場號不含 `~`)。
            const tilde = id.lastIndexOf("~");
            if (tilde <= 0 || id.slice(0, tilde) !== matchId) continue;
            const l = bouLineFromMarketId(id);
            if (l === null || !isBou(row.pick)) continue;
            setResolvedLine(l);
            setPick(row.pick);
            break; // 一場一注(該線唯一)· 取第一筆(最近)
          }
        }
      } catch {
        /* graceful */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  // 還在抓 / 沒押這手 → 隱藏(收據是本人證物 · 沒押就不顯,避免閃 + 不秀重算的引擎線)。
  if (!ready || pick === null || resolvedLine === null) {
    if (hideIfNoPick) return null;
    if (!ready) {
      return (
        <div className="mt-2.5 pt-2.5 border-t border-line/40">
          <p className="font-mono text-mute/40 text-[10px] tracking-[0.25em]">…</p>
        </div>
      );
    }
    return null;
  }

  const result = bouResultFromScore(finalScore.home, finalScore.away, resolvedLine);
  const resultPick = result === "over" ? "home" : "away";
  const youHit = pick === resultPick;
  const sideLabel = (p: "home" | "away") => (p === "home" ? "看大" : "看小");

  return (
    <div className="mt-2.5 pt-2.5 border-t border-line/40">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
          / 大小分 {resolvedLine}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.12em]">
          <span className="text-mute/70">結果 · </span>
          <span className="text-gold">{result === "over" ? "大" : "小"} 過</span>
        </p>
        <p className="font-mono text-[11px] tracking-[0.12em]">
          你{sideLabel(pick)} ·{" "}
          {youHit ? (
            <span className="text-gold">命中 ✓</span>
          ) : (
            <span className="text-loss/85">落空 ✕</span>
          )}
        </p>
      </div>
    </div>
  );
}

// ── 賽前押注(引擎當下那條線 · 看大/看小 · 群眾共識)──────────────────────────────
function PregameStrip({
  matchId,
  dateISO,
  line,
  overPct,
  underPct,
}: {
  matchId: string;
  dateISO: string | null;
  line: number;
  overPct?: number;
  underPct?: number;
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
  const sideLabel = (p: "home" | "away") => (p === "home" ? "看大" : "看小");

  return (
    <div className="mt-2.5 pt-2.5 border-t border-line/40">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
          / 大小分 {line} · 押一手
        </p>
        {typeof overPct === "number" && typeof underPct === "number" ? (
          <p className="font-mono text-mute/45 text-[8px] tracking-[0.3em]">
            引擎 大{overPct}% · 小{underPct}%
          </p>
        ) : (
          <span />
        )}
      </div>

      {state === "loading" ? (
        <p className="font-mono text-mute/40 text-[10px] tracking-[0.25em]">…</p>
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

      {state === "open" && total >= SHOW_MIN && (
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
