"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  OU_LINE,
  ouMarketId,
  ouSideToPick,
  pickToOuSide,
  type OuSide,
} from "@/lib/soccer/over-under";

// ── ZONE 27 · 足球大小分押注條(看大 / 看小 · 2.5)──────────────────────────────
// 跟「誰贏」三向條(SoccerBetStrip)並排的玩法押注。 引擎已算大小分機率(上方 SoccerMarketLines
// 顯示)· 這裡讓會員「賽前鎖一手」· 賽後用 90 分鐘總分對帳。
// 押了不可改(先鎖後結)· 登入才能押 · 開賽後鎖手。 純精神預測 · 0 金額。 守暗金品牌:選中上金、
// 其餘 mute · 命中 ✓ 金 / 落空 ✕ loss 同權重(含輸照掛)。
//
// 🔴 走帶後綴的場號 ouMarketId(matchId)= `{fd-id}~ou25` → 跟「誰贏」押注完全分開兩筆,
//   不污染你的「誰贏」戰績/校準(見 lib/soccer/over-under.ts 隔離說明)。
// ─────────────────────────────────────────────────────

type State = "loading" | "anon" | "open" | "picked" | "started";

export default function OverUnderStrip({
  matchId,
  dateISO,
  overPct,
  underPct,
  result = null,
  hideIfNoPick = false,
}: {
  matchId: string;
  dateISO: string;
  /** 引擎大小分機率(deriveSoccerMarkets 算好)· 顯示用 · 選填(收據 settled 模式不必再秀引擎線) */
  overPct?: number;
  underPct?: number;
  /** 賽後結果(server 端從終場總分算好)· null = 還沒結算 */
  result?: OuSide | null;
  /** 收據模式:本人沒押這手大小分 → 整塊隱藏(同 SoccerUserReceiptPick · 公開收據不留噪音) */
  hideIfNoPick?: boolean;
}) {
  const mkt = ouMarketId(matchId);
  const [state, setState] = useState<State>("loading");
  const [pick, setPick] = useState<OuSide | null>(null);
  const [over, setOver] = useState(0);
  const [under, setUnder] = useState(0);
  const [saving, setSaving] = useState(false);

  // 開賽瞬間自動鎖手(一次性 timer · 不輪詢)。
  useEffect(() => {
    const t = Date.parse(dateISO);
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
        // 群眾共識(anon 可讀)· over=home_count · under=away_count(二選一映射)。
        const { data: tally } = await supabase.rpc("get_match_prediction_tally", {
          p_match_id: mkt,
        });
        if (!cancelled && Array.isArray(tally) && tally[0]) {
          const r = tally[0] as { home_count?: unknown; away_count?: unknown };
          setOver(Number(r.home_count) || 0);
          setUnder(Number(r.away_count) || 0);
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
          Array.isArray(mine) && mine[0]
            ? pickToOuSide((mine[0] as { pick?: unknown }).pick)
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

  const choose = async (side: OuSide) => {
    if (saving) return;
    // 點擊時重驗開賽(防殭屍分頁)。
    const t = Date.parse(dateISO);
    if (!Number.isNaN(t) && t <= Date.now()) {
      setState("started");
      return;
    }
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.rpc("submit_prediction", {
        p_match_id: mkt,
        p_pick: ouSideToPick(side),
      });
      if (!error) {
        setPick(side);
        setState("picked");
        if (side === "over") setOver((n) => n + 1);
        else setUnder((n) => n + 1);
      }
    } catch {
      /* graceful · 維持原狀 */
    } finally {
      setSaving(false);
    }
  };

  const total = over + under;
  const SHOW_MIN = 5; // 同 SOCCER_CROWD_MIN · 低於此只報人數不畫比例(防小樣本假裝大盤)
  const overShare = total > 0 ? Math.round((over / total) * 100) : 0;

  // 結果 + 你那手對不對(result 有值才算 · 開賽後才押的這支不在 picked 狀態顯示「命中」誤導,
  // 因為 picked 只在賽前設;這裡單純比 pick vs result)。
  const settled = result === "over" || result === "under";
  const youHit = settled && pick !== null ? pick === result : null;

  // 收據模式:本人沒押這手 → 隱藏(loading 也先隱藏避免閃 · 同 SoccerUserReceiptPick graceful)。
  if (hideIfNoPick && pick === null) return null;

  return (
    <div className="mt-2.5 pt-2.5 border-t border-line/40">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
          / 大小分 {OU_LINE}{settled ? "" : " · 押一手"}
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
        // ── 載入中(避免 anon 短暫閃出按鈕)──
        <p className="font-mono text-mute/40 text-[10px] tracking-[0.25em]">…</p>
      ) : settled ? (
        // ── 賽後:結果 + 你那手 ──
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.12em]">
            <span className="text-mute/70">結果 · </span>
            <span className="text-gold">{result === "over" ? "大" : "小"}</span>
            <span className="text-mute/55"> （{OU_LINE} 線）</span>
          </p>
          {pick !== null ? (
            <p className="font-mono text-[11px] tracking-[0.12em]">
              你押{pick === "over" ? "大" : "小"} ·{" "}
              {youHit ? (
                <span className="text-gold">命中 ✓</span>
              ) : (
                <span className="text-loss/85">落空 ✕</span>
              )}
            </p>
          ) : (
            <p className="font-mono text-mute/45 text-[10px] tracking-[0.15em]">
              你沒押這手
            </p>
          )}
        </div>
      ) : state === "picked" && pick ? (
        // ── 已賽前鎖定 ──
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-gold text-[11px] tracking-[0.12em]">
            ✓ 賽前鎖定 · 你押{pick === "over" ? "大" : "小"}
          </p>
          {total >= SHOW_MIN && (
            <p className="font-mono text-mute/60 text-[10px] tabular tracking-[0.1em]">
              群眾 大{overShare}% · 小{100 - overShare}%
            </p>
          )}
        </div>
      ) : state === "anon" ? (
        // ── 未登入 ──
        <Link
          href={`/login?next=${encodeURIComponent("/soccer")}`}
          className="block font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.2em] transition-colors"
        >
          登入(免費)就能賽前鎖大小分 →
        </Link>
      ) : state === "started" ? (
        // ── 開賽後沒押到 ──
        <p className="font-mono text-mute/50 text-[10px] tracking-[0.15em]">
          已開賽 · 大小分鎖手(待賽後對帳)
        </p>
      ) : (
        // ── 可押(賽前)──
        <div className="flex gap-1.5">
          <OuBtn label="看大" sub={`${OU_LINE} 以上`} onClick={() => choose("over")} disabled={saving} />
          <OuBtn label="看小" sub={`${OU_LINE} 以下`} onClick={() => choose("under")} disabled={saving} />
        </div>
      )}

      {/* 開賽前 + 已有人押 → 顯示群眾共識(可押狀態也看得到風向)*/}
      {!settled && state === "open" && total >= SHOW_MIN && (
        <p className="mt-1.5 font-mono text-mute/55 text-[10px] tabular tracking-[0.1em]">
          群眾 大{overShare}% · 小{100 - overShare}%（{total} 人）
        </p>
      )}
    </div>
  );
}

function OuBtn({
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
      className="flex-1 flex flex-col items-center gap-0.5 border border-line/60 hover:border-gold/60 hover:bg-gold/5 py-2 transition-colors disabled:opacity-50"
    >
      <span className="font-mono text-bone text-[12px] tracking-[0.15em]">{label}</span>
      <span className="font-mono text-mute/50 text-[8px] tracking-[0.1em]">{sub}</span>
    </button>
  );
}
