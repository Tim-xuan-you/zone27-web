"use client";

import { useEffect, useState } from "react";
import {
  getMyBasketballPicks,
  gradeBasketballPicks,
  type BasketballPick,
  type BasketballRecord,
  type BasketballResult,
} from "@/lib/basketball/predictions";

// ── ZONE 27 · 你的籃球戰績(client · 含輸 · 跟其他運動分開算)──────────────────────────
// 讀登入者自己的籃球押注(bk-*)· 用賽果 + 引擎當初開盤對帳。 含贏含輸 · 先鎖後結。
// anon / 沒押任何籃球 → 不顯示(graceful)。 賽果還沒 curate → 誠實標「待結算」。
// 🔴 籃球無和局(延長賽分勝負)→ 無 push 欄(同網球/羽球 · 永遠分勝負)。
// ─────────────────────────────────────────────────────

export default function BasketballRecordCard({
  results,
  enginePicks,
  wrapperClass = "",
}: {
  results: Record<string, BasketballResult>;
  enginePicks: Record<string, BasketballPick>;
  wrapperClass?: string;
}) {
  const [rec, setRec] = useState<BasketballRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyBasketballPicks().then((picks) => {
      if (cancelled) return;
      setRec(gradeBasketballPicks(picks, results, enginePicks));
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [results, enginePicks]);

  if (!loaded || !rec) return null;
  if (rec.n === 0 && rec.pending === 0 && rec.late === 0) return null;

  return (
    <section className={wrapperClass}>
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-6">
        <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-2">
          你的籃球戰績 · 含輸
        </p>
        {rec.n > 0 ? (
          <p className="text-bone text-lg sm:text-xl font-light tracking-tight">
            <span className="text-gold tabular">{rec.rate}%</span> 準 ·{" "}
            <span className="text-gold tabular">✓{rec.hits}</span>{" "}
            <span className="text-loss tabular">✕{rec.misses}</span>
            <span className="text-mute/60 text-sm"> · {rec.n} 場已結算</span>
            {rec.pending > 0 && (
              <span className="text-mute/50 text-sm"> · {rec.pending} 場待結算</span>
            )}
          </p>
        ) : (
          <p className="text-bone text-base font-light leading-snug">
            押了 <span className="text-gold tabular">{rec.pending}</span> 場 ·
            <span className="text-mute/70"> 都還沒結算 —— 賽後自動掛準 / 不準,連輸的也留著</span>
          </p>
        )}

        {rec.late > 0 && (
          <p className="mt-2 font-mono text-mute/55 text-[10px] tracking-[0.12em] leading-snug">
            {rec.late} 場開賽後才押 · 不計入戰績(先鎖後結 · 開賽前押的才算數)
          </p>
        )}

        {rec.vsN > 0 && (
          <p className="mt-2.5 pt-2.5 border-t border-line/40 font-mono text-[12px] tracking-[0.04em] text-mute/80">
            同 <span className="text-bone tabular">{rec.vsN}</span> 場 你 vs 引擎:
            <span className="text-bone"> 你 ✓{rec.vsYouHits}</span> ·
            <span className="text-bone"> 引擎 ✓{rec.vsEngineHits}</span>
            <span className="text-mute/55">
              {" "}·{" "}
              {rec.vsYouHits > rec.vsEngineHits
                ? "你領先"
                : rec.vsYouHits < rec.vsEngineHits
                  ? "引擎暫時領先"
                  : "打平"}
            </span>
          </p>
        )}

        <p className="mt-2 font-mono text-mute text-[9px] tracking-[0.12em] leading-snug">
          兩向(誰贏)· 賽前鎖死、賽後對帳 · 跟棒球 / 足球 / 網球 / 羽球 / UFC 準度分開算。
        </p>
      </div>
    </section>
  );
}
