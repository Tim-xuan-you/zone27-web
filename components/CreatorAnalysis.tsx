"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getCreatorPosts,
  getMyCreatorPost,
  submitCreatorPost,
  type CreatorPost,
} from "@/lib/creator-posts";
import {
  readTier,
  isPaid,
  creatorFeePct,
  creatorTakePct,
  type MemberTier,
} from "@/lib/tier";

// ── ZONE 27 · CreatorAnalysis · 創作者賣分析(migration 0005)──────
// Tim 2026-05-30 報馬仔/明燈 screenshot · 要:發文 + 推薦賽事(選邊)+ 寫分析 +
// (Phase 2)賣文章 · 賽後自動評勝敗。 ZONE 27 版 = 押的邊賽前鎖、賽後自動掛
// 準/不準、刪不掉 = 賴不掉的戰績(報馬仔輸了刪文 · 這裡刪不掉)。
//
// v1:免費分析 + 選邊 + 賽後自動 grade(對本場 finalWinner)。
// Phase 2:賣文章(price + 手動銀行轉帳購買)· 跨場戰績滾進海選天梯。
// GRACEFUL:migration 0005 未套用 / anon → 空狀態 · 不 crash。
// ─────────────────────────────────────────────────────

const T_MAX = 80;
const B_MAX = 2000;

type Status = "loading" | "anonymous" | "open" | "posted";

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  finalWinner?: "home" | "away" | "tie" | null;
};

export default function CreatorAnalysis({
  matchId,
  homeName,
  awayName,
  finalWinner,
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  const [priceNtd, setPriceNtd] = useState(0); // 0 = 免費發 · >0 = 付費賣(付費會員專屬)
  const [tier, setTier] = useState<MemberTier>("free");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await getCreatorPosts(matchId);
      if (!cancelled) setPosts(list);
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          setStatus("anonymous");
          return;
        }
        setTier(readTier(user.user_metadata));
        const my = await getMyCreatorPost(matchId);
        if (cancelled) return;
        if (my) {
          setStatus("posted");
        } else {
          setStatus("open");
        }
      } catch {
        if (!cancelled) setStatus("anonymous");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const submit = async () => {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b || !pick) return;
    setSaving(true);
    setError(null);
    const res = await submitCreatorPost(matchId, t, b, pick, isPaid(tier) ? priceNtd : 0);
    if (res.ok) {
      setStatus("posted");
      setTitle("");
      setBody("");
      setPick(null);
      const list = await getCreatorPosts(matchId);
      setPosts(list);
    } else if (res.reason === "already_posted") {
      setStatus("posted");
    } else if (res.reason === "not_logged_in") {
      setStatus("anonymous");
    } else if (res.reason === "invalid") {
      setError("標題 ≤80 字、內容 ≤2000 字,並選一邊。");
    } else {
      setError("發表系統正在開通中 · 請稍後再試。");
    }
    setSaving(false);
  };

  return (
    <section
      aria-label="創作者分析 · 發表分析 · 選邊 · 賽後自動評準度"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8"
      id="creator-analysis"
    >
      <div className="flex items-baseline gap-3 mb-4 flex-wrap">
        <p className="font-mono text-gold text-[9px] tracking-[0.4em]">/ 看法 · 分析</p>
        <span className="font-mono text-mute/55 text-[9px] tracking-[0.25em]">
          {posts.length} 篇 · 選一邊 · 賽後自動評準度
        </span>
      </div>

      {/* posts */}
      {posts.length > 0 ? (
        <div className="space-y-3 mb-6">
          {posts.map((p, i) => (
            <PostCard
              key={`${p.handle}-${i}`}
              post={p}
              homeName={homeName}
              awayName={awayName}
              finalWinner={finalWinner}
            />
          ))}
        </div>
      ) : (
        <p className="mb-6 font-mono text-mute/55 text-[11px] tracking-[0.2em]">
          還沒有人發表分析 · 當第一個。
        </p>
      )}

      {/* compose */}
      <div className="p-4 sm:p-5 border border-line/60 bg-slate/30">
        {status === "loading" && (
          <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">載入中...</p>
        )}

        {status === "anonymous" && (
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              ▸ 登入就能發表你的分析(免費)
            </span>
            <Link
              href={`/login?next=${encodeURIComponent(`/matches/${matchId}#creator-analysis`)}`}
              className="inline-block px-4 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors"
            >
              → 登入後發表
            </Link>
          </div>
        )}

        {status === "open" && (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              maxLength={T_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="一句話標題 · 例「今晚壓主隊,投手差很多」"
              className="w-full bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 placeholder:text-mute/60 font-mono text-sm transition-colors"
            />
            <textarea
              rows={4}
              value={body}
              maxLength={B_MAX}
              onChange={(e) => setBody(e.target.value)}
              placeholder="你的看法 / 分析"
              className="w-full bg-ink/60 border border-line/70 text-bone px-3 py-2.5 outline-none focus:border-gold/60 placeholder:text-mute/60 font-mono text-sm leading-relaxed transition-colors"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em]">推薦:</span>
              <PickBtn label={`押 ${homeName.slice(0, 5)}`} active={pick === "home"} onClick={() => setPick("home")} />
              <PickBtn label={`押 ${awayName.slice(0, 5)}`} active={pick === "away"} onClick={() => setPick("away")} />
            </div>
            {/* R179 · 賣分析 = 付費會員優越(後端 price_ntd ready · migration 0005)·
                付費 tier 可標價賣 · 免費只免費發 + 看到升級理由 · 引擎仍永遠免費不 gate */}
            {isPaid(tier) ? (
              <div className="flex items-center gap-2 flex-wrap border-t border-line/40 pt-3">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">標價賣</span>
                <span className="font-mono text-mute/70 text-[11px]">NT$</span>
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={priceNtd || ""}
                  onChange={(e) =>
                    setPriceNtd(Math.max(0, Math.min(9999, Math.round(Number(e.target.value) || 0))))
                  }
                  placeholder="0"
                  aria-label="分析售價 NT$ · 0 為免費"
                  className="w-20 bg-ink/60 border border-line/70 text-bone px-2 py-1 outline-none focus:border-gold/60 font-mono text-sm tabular transition-colors"
                />
                <span className="font-mono text-mute/55 text-[9px] tracking-[0.12em] leading-snug">
                  {priceNtd > 0
                    ? `你拿 NT$ ${Math.round((priceNtd * creatorTakePct(tier)) / 100)} · 平台抽 ${creatorFeePct(tier)}%`
                    : `0 = 免費分享 · 設個價就能賣(你拿 ${creatorTakePct(tier)}%)`}
                </span>
              </div>
            ) : (
              <p className="border-t border-line/40 pt-3 font-mono text-mute/60 text-[10px] tracking-[0.12em] leading-relaxed">
                💡 這篇免費發。 想<span className="text-gold/80">標價賣分析賺錢</span>(你拿 90–95% · 平台抽 5–10%)?{" "}
                <Link
                  href="/membership"
                  className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
                >
                  升級付費會員 →
                </Link>
              </p>
            )}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-mono text-mute/55 text-[10px] tracking-[0.2em] tabular">
                {title.trim().length}/{T_MAX} · {body.trim().length}/{B_MAX}
              </span>
              <button
                type="button"
                onClick={submit}
                disabled={saving || !title.trim() || !body.trim() || !pick}
                className="px-5 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "送出中..." : "發表分析"}
              </button>
            </div>
          </div>
        )}

        {status === "posted" && (
          <p className="font-mono text-gold text-[10px] tracking-[0.3em]">
            ✓ 您已發表本場分析 · 一場一篇 · 賽後自動評準度
          </p>
        )}

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="font-mono text-loss text-[10px] tracking-[0.25em] mt-3"
          >
            ⚠ {error}
          </p>
        )}
      </div>
    </section>
  );
}

function PostCard({
  post: p,
  homeName,
  awayName,
  finalWinner,
}: {
  post: CreatorPost;
  homeName: string;
  awayName: string;
  finalWinner?: "home" | "away" | "tie" | null;
}) {
  const pickName = p.pick === "home" ? homeName : awayName;
  const graded = finalWinner && finalWinner !== "tie";
  const correct = graded && p.pick === finalWinner;

  return (
    <article className="p-4 sm:p-5 border border-line/60 bg-slate/30">
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-bone text-[11px] tracking-[0.2em]">{p.handle}</span>
          <span className="font-mono text-gold/80 text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/40">
            推薦 {pickName.slice(0, 5)}
          </span>
        </span>
        {graded && (
          <span
            className={`font-mono text-[10px] tracking-[0.2em] px-1.5 py-0.5 border ${
              correct ? "border-gold text-gold" : "border-loss/70 text-loss"
            }`}
          >
            {correct ? "✓ 準" : "✕ 不準"}
          </span>
        )}
      </div>
      <h4 className="text-bone text-base font-light tracking-tight mb-1.5">{p.title}</h4>
      {p.priceNtd > 0 ? (
        <div className="mt-2 border border-gold/30 bg-gold/5 px-3 py-3">
          <p className="font-mono text-gold/90 text-[11px] tracking-[0.2em] mb-1">
            🔒 付費分析 · NT$ {p.priceNtd}
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.12em] leading-relaxed">
            標題 + 推薦邊免費看 · 完整分析購買後解鎖。 賽後一樣自動掛準度(賣家賴不掉)。{" "}
            <span className="text-mute/50">手動轉帳購買即將開放。</span>
          </p>
        </div>
      ) : (
        <p className="text-bone/85 text-sm leading-relaxed whitespace-pre-wrap">{p.body}</p>
      )}
    </article>
  );
}

function PickBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] border transition-colors ${
        active
          ? "border-gold bg-gold/10 text-gold"
          : "border-line/60 text-mute hover:border-gold/40"
      }`}
    >
      {label}
    </button>
  );
}
