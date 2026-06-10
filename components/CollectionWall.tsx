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

export default function CollectionWall({ settled }: { settled: SettledCard[] }) {
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
    return (
      <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
        <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          你的戰功卡牆,還是空的。
        </p>
        <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
          押一手、賽前鎖死 —— 那一場結算後,你鎖死的這手就變成第一張
          <span className="text-bone">刪不掉、改不了</span>的戰功卡。 含輸照收,因為
          <span className="text-gold">敢留輸的</span>,本身就是別人偽造不了的東西。
        </p>
        <Link
          href="/matches"
          className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
        >
          去押第一手 →
        </Link>
      </div>
    );
  }

  return <TrophyGrid trophies={trophies} />;
}
