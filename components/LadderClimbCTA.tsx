"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMyPredictionsClient } from "@/lib/predictions-market";
import { aggregatePredictionStats } from "@/lib/predictions";

// ── ZONE 27 · 天梯底部「王座狀態 + 去押」CTA · 認得本人 ────────────────────────
// founder dogfood(2026-06-24):「我已經押注過了,還一直叫我『去押第一注』?」= 認人失敗。
// 一個靈魂是「你的戰績刪不掉」的產品,對一個有戰績的人喊「去押第一注」= 自打臉。
//
// 為什麼 client island:/ladder 是 ISR 靜態快取(server 端讀登入態會把某人的資料快取給所有人)。
// 同 YourRecordStrip 漸進增強:頁面維持靜態、SSR 出「全新訪客」預設文案,hydrate 後才依本人
// 真實進度改寫(押了幾場 → 還差幾場上榜 / 已達門檻等榜亮)。 初始 render 跟 SSR 一致 = 無 hydration 衝突。
//
// 心理學(Tim 要的角度):① 認人(承認你押過,不喊「第一注」)② 目標漸進/賦予進度(把「還差 X 場」
// 寫進按鈕,每押一手肉眼更近)③ 0 用戶空榜的誠實閘門 → 翻成「揪人一起點亮」的社交鉤,不是 near-miss 陷阱。
// 🔴 守鐵律:不造假榜、不誇「就快了」、門檻講真數字、含贏含輸。
// ─────────────────────────────────────────────────────

const ROOKIE_MIN = 10; // 上「新秀」門檻 · 同 YourRecordStrip / /member

type MatchResult = {
  id: string;
  finalWinner: "home" | "away" | "tie" | null;
  startISO?: string | null;
};

export default function LadderClimbCTA({
  boardShown,
  matchResults,
}: {
  /** 跨用戶海選榜是否已點亮(server 端 getLadderBoard().show) */
  boardShown: boolean;
  /** 已結算賽事勝方(靜態)· 前端評分本人押注 · 同 YourRecordStrip */
  matchResults: MatchResult[];
}) {
  const [stats, setStats] = useState<ReturnType<
    typeof aggregatePredictionStats
  > | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        if (cancelled || !data.user) return; // 未登入 → 維持預設「全新」文案
        const map = await getMyPredictionsClient();
        if (cancelled) return;
        setStats(aggregatePredictionStats(map, matchResults));
      } catch {
        /* graceful · 維持預設 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchResults]);

  const total = stats?.total ?? 0;
  const hasBet = total > 0;
  const toRookie = Math.max(0, ROOKIE_MIN - total);

  const cta = (label: string, href: string) => (
    <Link
      href={href}
      className="inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
    >
      {label}
    </Link>
  );

  // ── 榜已點亮 ───────────────────────────────────────
  if (boardShown) {
    return (
      <div className="mt-10 border-t border-line/40 pt-8">
        <p className="text-bone text-base leading-relaxed mb-1">
          榜上有人了 —— 換你擠上去。
        </p>
        <p className="text-mute text-sm leading-relaxed mb-6">
          {hasBet ? (
            <>
              你已經對帳 <span className="text-bone tabular">{total}</span> 場 ·{" "}
              {toRookie > 0
                ? `再 ${toRookie} 場就上得了榜`
                : "夠格了 · 那個月贏過引擎就排得上"}
              。 含贏含輸、刪不掉。
            </>
          ) : (
            <>押滿 10 場、那個月還贏過引擎,你也會出現在上面。 含贏含輸、刪不掉。</>
          )}
        </p>
        {cta("去押 · 擠上榜 →", "/matches")}
      </div>
    );
  }

  // ── 榜還沒亮 · 全新訪客 / 未登入(預設 · 也是 SSR 出的版本)──────────
  if (!hasBet) {
    return (
      <div className="mt-10 border-t border-line/40 pt-8">
        <p className="text-bone text-base leading-relaxed mb-1">
          現在 · 王座上只有機器。
        </p>
        <p className="text-mute text-sm leading-relaxed mb-6">
          第一個贏過它的人類,還沒出現。 換你了。
        </p>
        {cta("去押第一注 →", "/matches")}
      </div>
    );
  }

  // ── 榜還沒亮 · 你押過、還沒到門檻 → 認人 + 目標漸進 ──────────────
  if (toRookie > 0) {
    return (
      <div className="mt-10 border-t border-line/40 pt-8">
        <p className="text-bone text-base leading-relaxed mb-1">
          王座上只有機器 —— 但你已經在路上了。
        </p>
        <p className="text-mute text-sm leading-relaxed mb-6">
          你押了 <span className="text-bone tabular">{total}</span> 場 ·
          對帳滿 10 場就正式上榜,跟這台機器當眾比準度。 還差{" "}
          <span className="text-gold tabular">{toRookie}</span> 場。
        </p>
        {cta(`去押 · 還差 ${toRookie} 場上榜 →`, "/matches")}
      </div>
    );
  }

  // ── 榜還沒亮 · 你已達門檻、但合格的人還不夠 → 誠實閘門翻成揪人 ──────
  return (
    <div className="mt-10 border-t border-line/40 pt-8">
      <p className="text-bone text-base leading-relaxed mb-1">
        你押滿門檻了 —— 但天梯還沒亮。
      </p>
      <p className="text-mute text-sm leading-relaxed mb-6">
        公開天梯要等夠多人都對帳滿 10 場才亮(一兩個人的榜不是榜)。
        把你的<span className="text-bone">含輸戰績</span>丟給朋友、揪他來對帳 ——
        人湊齊,榜就活,你就有對手。
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {cta("看你的戰績 · 揪人來 →", "/member")}
        <Link
          href="/matches"
          className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
        >
          先去守住你的準度 ▸
        </Link>
      </div>
    </div>
  );
}
