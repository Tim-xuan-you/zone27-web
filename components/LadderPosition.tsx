"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { readAnonPicks, computeAnonStats } from "@/lib/anon-picks";

// ── ZONE 27 · 天梯 · 你現在的位置 ───────────────────────────
// /ladder 原本是純說明 brochure(沒有「你在哪」)。 設計審計:會員從
// /member「看你排第幾 →」點過來,卻看不到自己 = 斷掉的承諾迴路。 這塊補上
// 「你現在的位置」,把死路 brochure 變成有個人進度的目標梯度(goal-gradient):
//   · 訪客(這台裝置押過)→ 本地進度條 + 還差幾場上新秀 + 登入上公開天梯
//   · 已登入 → 誠實導回儀表板看 server 戰績進度(不在這裡重算)
//   · 全新訪客 / 0 picks → 不顯示(下方 brochure 自己接冷啟動 · 不佔空間)
// 門檻 10 場同 /member(stats.total >= 10)。 押完即時更新(同
// AnonCalibrationStrip 的 zone27:anon-picks-changed 訂閱)。
// ─────────────────────────────────────────────────────

const ROOKIE_MIN = 10;

type State =
  | { mode: "loading" }
  | { mode: "member" }
  | { mode: "anon"; total: number; proved: number; diverged: number };

export default function LadderPosition() {
  const [state, setState] = useState<State>({ mode: "loading" });

  useEffect(() => {
    let cancelled = false;
    let isAnon = false;
    const loadAnon = () => {
      const s = computeAnonStats(readAnonPicks());
      if (!cancelled)
        setState({
          mode: "anon",
          total: s.total,
          proved: s.proved,
          diverged: s.diverged,
        });
    };
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          setState({ mode: "member" });
          return;
        }
        isAnon = true;
        loadAnon();
      } catch {
        isAnon = true;
        loadAnon();
      }
    })();
    const onChange = () => {
      if (isAnon) loadAnon();
    };
    window.addEventListener("zone27:anon-picks-changed", onChange);
    return () => {
      cancelled = true;
      window.removeEventListener("zone27:anon-picks-changed", onChange);
    };
  }, []);

  if (state.mode === "loading") return null;

  if (state.mode === "member") {
    return (
      <Link
        href="/member"
        className="block mb-10 border border-gold/40 bg-slate/30 hover:bg-slate/40 hover:border-gold/60 transition-colors p-4 sm:p-5 group"
      >
        <p className="font-mono text-gold/90 text-[10px] tracking-[0.3em] mb-1.5">
          你現在的位置
        </p>
        <p className="text-bone text-sm leading-relaxed">
          天梯虛位以待 —— 還沒有人上榜。 你押滿{" "}
          <span className="text-gold tabular">{ROOKIE_MIN}</span> 場就是第一個新秀。{" "}
          <span className="text-gold/80 group-hover:text-gold">
            在儀表板看你的準度進度 →
          </span>
        </p>
      </Link>
    );
  }

  // anon · 0 picks → 不顯示
  if (state.total === 0) return null;
  const decided = state.proved + state.diverged;
  const toRookie = Math.max(0, ROOKIE_MIN - state.total);
  const pct = Math.min(100, Math.round((state.total / ROOKIE_MIN) * 100));

  return (
    <div className="mb-10 border border-gold/40 bg-slate/30 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-mono text-gold/90 text-[10px] tracking-[0.3em]">
          你現在的位置 · 這台裝置
        </p>
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em]">
          押了 <span className="text-bone tabular">{state.total}</span> 場
          {decided > 0 && (
            <>
              {" "}
              · <span className="text-gold tabular">✓{state.proved}</span>{" "}
              <span className="text-loss/85 tabular">✕{state.diverged}</span>
            </>
          )}
        </p>
      </div>
      {/* 進度條 · 離新秀還差幾場(門檻 10 同 /member)*/}
      <div className="relative h-1.5 rounded-full bg-line/50 overflow-hidden mb-2">
        <div className="h-full bg-gold/80" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-bone text-sm leading-relaxed">
        {toRookie > 0 ? (
          <>
            還差 <span className="text-gold tabular">{toRookie}</span> 場 · 你就上
            <span className="text-gold">「新秀」</span>。
          </>
        ) : (
          <>
            你已達<span className="text-gold">新秀</span>門檻 ——
            登入把戰績存成公開天梯名次。
          </>
        )}
      </p>
      <Link
        href="/login?next=/ladder"
        className="mt-2 inline-block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
      >
        登入 → 上公開天梯、跨裝置累積 ▸
      </Link>
    </div>
  );
}
