"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TrophyGrid from "@/components/TrophyGrid";
import { getMyPredictionsClient } from "@/lib/predictions-market";
import { getMySoccerPicks } from "@/lib/soccer/predictions";
import { computeTrophies, type SettledCard, type Trophy } from "@/lib/trophies";

// ── ZONE 27 · 戰功卡收藏牆(本人 · /member/collection)──────────────────────
// 薄 client 殼:server 備齊 settled(buildSettledCards · 0 API)· 這裡 session 端讀本人
// picks → computeTrophies 配對 → TrophyGrid 展示(與公開檔案共用同一張卡)。
// 沒已結算 / 未登入 → graceful 空狀態 CTA。 紅線/卡視覺見 lib/trophies + TrophyGrid。
// ─────────────────────────────────────────────────────

/** 今晚真實可押的場(空狀態 on-ramp 用 · 真賽程真入口 · server 端從 buildOpenPositions 同源算)。 */
export type TonightGame = {
  id: string;
  home: string;
  away: string;
  startTime: string;
  league: string;
};

export default function CollectionWall({
  settled,
  hasPending = false,
  tonight = [],
}: {
  settled: SettledCard[];
  /** 上方「你的未結算押注」區有沒有東西(有 → 軟化空文案:卡正在生,不說「空」)。 */
  hasPending?: boolean;
  /** 今晚還沒押、賽前可鎖的場(把第一個真實動作搬到空頁上 · 0 場 → 退回單純 CTA)。 */
  tonight?: TonightGame[];
}) {
  const [ready, setReady] = useState(false);
  const [trophies, setTrophies] = useState<Trophy[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [bb, sc] = await Promise.all([
        getMyPredictionsClient(), // 棒球(已排除 fd-*)
        getMySoccerPicks(), // 足球(fd-*)
      ]);
      if (!alive) return;
      setTrophies(computeTrophies(bb, sc, settled));
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [settled]);

  if (!ready) {
    return (
      <p className="font-mono text-mute/40 text-[10px] tracking-[0.3em]">··· 載入你的收藏</p>
    );
  }

  if (trophies.length === 0) {
    // ── 有鎖、還沒結算 → 卡正在生(上方 OpenPositionsPanel 已顯示在路上的手)· 不說「空」。 ──
    if (hasPending) {
      return (
        <div className="mt-6 border border-line/60 bg-slate/30 p-6 sm:p-8 text-center">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-2">
            / 第一張卡 · 正在生
          </p>
          <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
            你的卡已經在路上了。
          </p>
          <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
            上面那幾手已經<span className="text-bone">鎖死、改不了</span> —— 等第一場打完結算,
            就翻成你第一張刪不掉的戰功卡。 含輸照收,因為<span className="text-gold">敢留輸的</span>,別人偽造不了。
          </p>
        </div>
      );
    }

    // ── 全新(0 鎖 0 卡)→ 誠實養成期話術(把「慢」講成偽造不了的證明)+ 今晚真實可押 on-ramp。 ──
    return (
      <div className="mt-6 border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
        <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          戰功卡,在比賽結算後誕生。
        </p>
        <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
          鎖一手 → 等那場打完 → 自動長出一張<span className="text-bone">刪不掉、改不了</span>的卡,
          贏輸都收。 這需要幾天 —— 這個<span className="text-gold">慢</span>,正是別人偽造不了的原因。
        </p>

        {tonight.length > 0 ? (
          <div className="max-w-md mx-auto text-left">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2 text-center">
              今晚可鎖一手 ↓
            </p>
            <div className="border border-line/60 bg-navy/30">
              {tonight.map((g) => (
                <Link
                  key={g.id}
                  href={`/matches/${g.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line/40 last:border-b-0 hover:bg-gold/5 transition-colors group"
                >
                  <span className="min-w-0 text-bone text-sm leading-snug truncate">
                    {g.home} <span className="text-mute/50">vs</span> {g.away}
                  </span>
                  <span className="shrink-0 font-mono text-mute/70 text-[10px] tracking-[0.15em] tabular">
                    {g.startTime}
                    <span className="text-gold/50 group-hover:text-gold ml-2 transition-colors">鎖 →</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            href="/matches"
            className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
          >
            去押第一手 →
          </Link>
        )}
      </div>
    );
  }

  return <TrophyGrid trophies={trophies} />;
}
