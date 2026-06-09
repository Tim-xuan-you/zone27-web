"use client";

import { useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { SettlementDelta } from "@/lib/predictions";

// ── ZONE 27 ·「你不在時結算了 N 場」回訪卡(soul-roadmap R208 #5 · 單人回訪鉤)──────
// 兩件事:(1) 永遠在掛載時把 last_seen 更新成現在(寫 user_metadata · 同 DisplayNameSetting
// 的 updateUser pattern · 0 migration);(2) 若 server 算出「上次造訪後有新結算」就秀一張
// 平靜的卡。 server 讀「舊」的 last_seen 算 delta → 這裡才寫「新」的 → 下次進來基準才更新。
//
// 🔴 紅線:
//   · 平靜紀律語氣(交易員日誌)· 絕不賭場「快回來!別錯過!」· 用陳述句、無驚嘆號、無催促 CTA。
//   · 含輸照數 —— 引擎贏你也照講(engineWon 跟 youWon 同權重)。
//   · graceful:delta=null(首訪 / 0 新結算)→ 不顯示卡(但仍寫 last_seen)。
//   · 低調 mute · 不上金 hero(這是「順手對帳」不是慶祝)。
// ─────────────────────────────────────────────────────

export default function ReturnedWhileAwayCard({
  delta,
}: {
  delta: SettlementDelta | null;
}) {
  const wrote = useRef(false);

  // 掛載時把 last_seen 更新為現在(只寫一次)· 失敗靜默(下次再寫)。
  useEffect(() => {
    if (wrote.current) return;
    wrote.current = true;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.updateUser({
          data: { last_seen_member: new Date().toISOString() },
        });
      } catch {
        /* graceful · 回訪卡是 nice-to-have · 寫失敗不影響其他 */
      }
    })();
  }, []);

  // 首訪 / 沒有新結算 → 只記時戳,不顯示卡。
  if (!delta || delta.total === 0) return null;

  const { total, youWon, vsEngineN, youWonVs, engineWon } = delta;

  return (
    <section className="mt-6 border border-line/60 bg-slate/30 p-5 sm:p-6">
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.35em] mb-2">
        / 你不在的時候
      </p>
      <p className="text-bone text-base sm:text-lg leading-relaxed">
        你上次離開後,
        <span className="font-mono text-gold tabular mx-1">{total}</span>
        場你押過的賽事結算了 ·{" "}
        <span className="font-mono text-gold tabular">✓{youWon}</span> 中 ·{" "}
        <span className="font-mono text-loss/85 tabular">✕{total - youWon}</span> 沒中
      </p>
      {vsEngineN > 0 && (
        <p className="mt-2 font-mono text-mute/80 text-[12px] tracking-[0.04em] leading-relaxed">
          其中 <span className="text-bone tabular">{vsEngineN}</span> 場有引擎對照:
          <span className="text-bone"> 你 ✓{youWonVs}</span> ·
          <span className="text-bone"> 引擎 ✓{engineWon}</span>
          <span className="text-mute/55">
            {" · "}
            {youWonVs > engineWon
              ? "這幾場你領先"
              : youWonVs < engineWon
                ? "這幾場引擎領先"
                : "這幾場打平"}
          </span>
        </p>
      )}
      <p className="mt-2.5 font-mono text-mute/45 text-[9px] tracking-[0.12em] leading-snug">
        賽前鎖死、賽後自動對帳 · 贏的輸的都留著、改不了。
      </p>
    </section>
  );
}
