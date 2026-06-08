"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getMySoccerPicks,
  gradeSoccerPicks,
  type SoccerPick,
  type SoccerRecord,
} from "@/lib/soccer/predictions";
import type { SoccerResult } from "@/lib/soccer/football-data";

// ── ZONE 27 · 你的足球戰績(含輸 · 跟棒球分開算 · 含「你 vs 引擎」同場對照)──────
// 押注 → 賽後自動對帳 → 你的足球準度。 三向(主勝/和/客勝)· 先鎖後結 · 含輸刪不掉。
// results 由 server(永久鎖定結果 ∪ live 公開資料 · 永久者勝 = 帳本不縮水)傳入 ·
// enginePicks 是引擎當初鎖定的看好邊(server 從 soccer-locked.json 讀)· 本人 picks 用
// session client 端讀 → 不破 /soccer 的 ISR。 沒押 / 未登入 → 整張自動隱藏(graceful)。
// 🔴 跟棒球兩本帳分開:本卡只讀 fd-* · 棒球 getMyPredictionsMap 已排除 fd-*。
// ─────────────────────────────────────────────────────

export default function SoccerRecordCard({
  results,
  enginePicks = {},
  wrapperClass = "",
}: {
  results: SoccerResult[];
  /** matchId → 引擎當初鎖定的看好邊(給「你 vs 引擎」同場對照) */
  enginePicks?: Record<string, SoccerPick>;
  /** 外層定位/寬度由各頁給:/soccer = max-w-6xl section · /member = mt-6 */
  wrapperClass?: string;
}) {
  const [record, setRecord] = useState<SoccerRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled || !user) return;
        const picks = await getMySoccerPicks();
        if (cancelled) return;
        const map: Record<string, { outcome: SoccerResult["outcome"]; kickoffISO: string }> = {};
        for (const r of results) map[r.matchId] = { outcome: r.outcome, kickoffISO: r.kickoffISO };
        setRecord(gradeSoccerPicks(picks, map, enginePicks));
      } catch {
        /* graceful */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [results, enginePicks]);

  // 沒押任何足球(或未登入)→ 隱藏
  if (!record || (record.n === 0 && record.pending === 0)) return null;

  const { n, hits, misses, rate, pending, vsN, vsYouHits, vsEngineHits } = record;

  return (
    <div className={wrapperClass}>
      <div className="bg-slate/40 border border-gold/30 p-4 sm:p-5">
        <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-2">
          你的足球戰績 · 含輸
        </p>
        {n > 0 ? (
          <p className="text-bone text-lg sm:text-xl font-light tracking-tight">
            <span className="text-gold tabular">{rate}%</span> 準 ·{" "}
            <span className="text-gold tabular">✓{hits}</span>{" "}
            <span className="text-loss tabular">✕{misses}</span>
            <span className="text-mute/60 text-sm"> · {n} 場已結算</span>
            {pending > 0 && (
              <span className="text-mute/50 text-sm"> · {pending} 場進行中</span>
            )}
          </p>
        ) : (
          <p className="text-bone text-base font-light leading-snug">
            你押了 <span className="text-gold tabular">{pending}</span> 場 ·
            <span className="text-mute/70"> 都還沒結算 —— 賽後自動掛準 / 不準,連輸的都留著</span>
          </p>
        )}

        {/* 你 vs 引擎(同一批已結算、且引擎當初有鎖定線的場 · 公平對照)。 */}
        {vsN > 0 && (
          <p className="mt-2.5 pt-2.5 border-t border-line/40 font-mono text-[12px] tracking-[0.04em] text-mute/80">
            同 <span className="text-bone tabular">{vsN}</span> 場 你 vs 引擎:
            <span className="text-bone"> 你 ✓{vsYouHits}</span> ·
            <span className="text-bone"> 引擎 ✓{vsEngineHits}</span>
            <span className="text-mute/55">
              {" "}
              · {vsYouHits > vsEngineHits ? "你領先 · 看得住就上天梯" : vsYouHits < vsEngineHits ? "引擎暫時領先 · 慢慢追" : "打平 · 同一條起跑線"}
            </span>
          </p>
        )}

        <p className="mt-2 font-mono text-mute/45 text-[9px] tracking-[0.12em] leading-snug">
          三向對帳(主勝 / 和 / 客勝)· 賽前鎖死、賽後自動結算 · 跟你的棒球準度分開算。
        </p>
      </div>
    </div>
  );
}
