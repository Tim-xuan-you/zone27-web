"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyCreatorPost } from "@/lib/creator-posts";

// ── ZONE 27 · 你的分析 · 創作者後台 ─────────────────────────
// 2026-06-05 · Tim dogfood:「會員介面看不到我發了哪些文章/幾勝幾敗/有人回嗎」。
// 付費會員(創作者)登入後該看得到自己的內容後台 —— 這是創作者經濟那條腿的命脈。
//
// v1 用既有 RPC:對每場 getMyCreatorPost(match_id)(client · 平行)收集我的分析 ·
// 賽後對 finalResult 自動評準/不準 = 創作者命中率(賴不掉 · 贏報馬仔的地方)。
// 每篇連到該場 #say(回覆/討論串在那)。 GRACEFUL:沒發過 → 不顯示(底部已有「去發一篇」)。
//
// ⏳ 規模化要換一支 get_my_creator_posts RPC(一次回我的文 + 各篇 reply_count +
//   buyer_count · 取代 N 次 per-match 呼叫)· 見 TODO 創作者後台項。
// ─────────────────────────────────────────────────────

type MatchLite = {
  id: string;
  homeName: string;
  awayName: string;
  finalWinner: "home" | "away" | "tie" | null;
  dateLabel: string;
};

type MyPost = MatchLite & { pick: "home" | "away"; title: string };

export default function MyCreatorPanel({ matches }: { matches: MatchLite[] }) {
  const [posts, setPosts] = useState<MyPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        matches.map(async (m) => {
          const p = await getMyCreatorPost(m.id);
          return p ? ({ ...m, pick: p.pick, title: p.title } as MyPost) : null;
        }),
      );
      if (!cancelled) {
        setPosts(results.filter((x): x is MyPost => x !== null));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matches]);

  // 抓取中 / 沒發過 → 不佔空間(底部「去發一篇」接手)
  if (!posts || posts.length === 0) return null;

  const decided = posts.filter((p) => p.finalWinner && p.finalWinner !== "tie");
  const hits = decided.filter((p) => p.pick === p.finalWinner).length;
  const rate = decided.length > 0 ? Math.round((hits / decided.length) * 100) : null;

  return (
    <section className="mt-8">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        你的分析 · 創作者後台
      </p>
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-6">
        <p className="text-bone text-sm sm:text-base leading-relaxed">
          你發了 <span className="font-mono text-gold tabular">{posts.length}</span> 篇分析
          {decided.length > 0 && (
            <>
              {" "}· 命中{" "}
              <span className="font-mono text-gold tabular">✓{hits}</span>
              <span className="text-mute/60"> / {decided.length}</span>
              {rate !== null && (
                <>
                  {" "}· <span className="text-gold tabular">{rate}%</span>
                </>
              )}
            </>
          )}
        </p>
        <p className="mt-1 mb-4 font-mono text-mute/60 text-[10px] tracking-[0.2em] leading-relaxed">
          賽後自動掛準度 · 選邊鎖死賴不掉 —— 這就是你贏收費明牌的地方。
        </p>
        <div className="flex flex-col border-t border-line/40">
          {posts.map((p) => {
            const myTeam = p.pick === "home" ? p.homeName : p.awayName;
            const verdict =
              p.finalWinner && p.finalWinner !== "tie"
                ? p.pick === p.finalWinner
                  ? "proved"
                  : "diverged"
                : null;
            return (
              <Link
                key={p.id}
                href={`/matches/${p.id}#say`}
                className="flex items-baseline justify-between gap-3 py-2.5 border-b border-line/40 last:border-b-0 group"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                    {p.title || `${p.homeName} vs ${p.awayName}`}
                  </span>
                  <span className="block font-mono text-mute/60 text-[10px] tracking-[0.15em] mt-0.5">
                    {p.dateLabel} · 押 {myTeam}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-right">
                  {verdict === "proved" ? (
                    <span className="text-gold">✓ 中</span>
                  ) : verdict === "diverged" ? (
                    <span className="text-loss/85">✕ 沒中</span>
                  ) : (
                    <span className="text-mute/60">待開</span>
                  )}
                  <span className="text-gold/50 group-hover:text-gold ml-2 transition-colors">
                    看回覆 →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
