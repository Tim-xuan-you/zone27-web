"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getGamePosts,
  getMyGamePost,
  submitGamePost,
  type GamePost,
} from "@/lib/game-posts";

// ── ZONE 27 · GameThread · 賽事討論室(OPEN)──────────────
// R174 Polymarket pivot · Tim 拍板「打開:免費看 + 天梯名次發言」。
// 從 R148/R152 的 pre-launch mockup(SAMPLE_POSTS + disabled form + BLACK
// CARD 付費牆)升級成 REAL · OPEN discussion · backed by migration 0004
// (game_posts 共享表 + SECURITY DEFINER RPCs)。
//
// 為什麼反轉付費牆(per memory/feedback_zone27_one_way_by_design.md ·
// 2026-05-30 superseded):大眾版 Polymarket 靠網路效應 · 把對話鎖在付費牆
// 後面 = 掐死它。 門檻改成「登入 + 信用(海選天梯名次 /ladder)」· 不是付錢。
// 一個 LINE 老師可以發推薦 · 但他的發言永遠掛著真實天梯名次 = 自帶測謊器。
//
// 守住的線:
//   · 免費看(anon 可讀)· 登入才能發 · 一場一篇 · ≤200 字(server-enforced)
//   · 0 金額 0 金流(純文字 · 真錢在「賣分析」那側)· per legal-redline
//   · Moderation v1 = Tim 用 Supabase Studio 刪 · in-app 刪文 = Phase 3
//
// GRACEFUL: migration 0004 未套用 / anon → 讀到空串 · 發文 error 友善提示 ·
// 不 crash(同 UserPredictionPicker + predictions-market 模式)。
// ─────────────────────────────────────────────────────

const MAX = 200;

type Status = "loading" | "anonymous" | "open" | "posted";

type Props = {
  gameId: string;
};

export default function GameThread({ gameId }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [posts, setPosts] = useState<GamePost[]>([]);
  const [myBody, setMyBody] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Thread is public — load posts regardless of auth (免費看).
      const list = await getGamePosts(gameId);
      if (!cancelled) setPosts(list);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!data.session) {
          setStatus("anonymous");
          return;
        }
        const mine = await getMyGamePost(gameId);
        if (cancelled) return;
        if (mine) {
          setMyBody(mine.body);
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
  }, [gameId]);

  const submit = async () => {
    const body = draft.trim();
    if (!body) return;
    setSaving(true);
    setError(null);
    const res = await submitGamePost(gameId, body);
    if (res.ok) {
      setMyBody(body);
      setStatus("posted");
      setDraft("");
      const list = await getGamePosts(gameId); // refresh to include mine
      setPosts(list);
    } else if (res.reason === "already_posted") {
      const mine = await getMyGamePost(gameId);
      setMyBody(mine?.body ?? body);
      setStatus("posted");
    } else if (res.reason === "not_logged_in") {
      setStatus("anonymous");
    } else if (res.reason === "invalid") {
      setError("留言請 1–200 字。");
    } else {
      setError("發文系統正在開通中 · 請稍後再試(或到 /login 重新登入)。");
    }
    setSaving(false);
  };

  return (
    <section
      aria-label="賽事討論室 · 免費看 · 登入發言"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40"
      data-game-id={gameId}
      id="game-thread"
    >
      {/* ── HEADER ─────────────────────────────────── */}
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <span aria-hidden="true" className="text-2xl text-gold leading-none">
          💬
        </span>
        <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          賽事討論室
        </h2>
        <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold">
          OPEN · 免費看
        </span>
      </div>

      {/* ── STATS BAR ───────────────────────────────── */}
      <div className="flex items-baseline gap-3 mb-6 flex-wrap font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-mute">
        <span className="text-gold">{posts.length} POSTS</span>
        <span className="text-mute/40">·</span>
        <span>免費看 · 登入發言</span>
        <span className="text-mute/40">·</span>
        <span>一場一篇</span>
      </div>

      {/* ── POSTS ──────────────────────────────────── */}
      {posts.length > 0 ? (
        <div className="space-y-3 mb-6">
          {posts.map((p, i) => (
            <PostRow key={`${p.handle}-${i}`} post={p} />
          ))}
        </div>
      ) : (
        <div className="mb-6 p-6 sm:p-8 border border-dashed border-gold/30 bg-slate/30 text-center">
          <p className="text-mute text-sm sm:text-base leading-relaxed">
            還沒有人留言 ·{" "}
            <span className="text-gold">當第一個。</span>
          </p>
          <p className="mt-2 font-mono text-mute/55 text-[10px] tracking-[0.25em]">
            賽前鎖一句你的看法 · 賽後回來看誰說對了。
          </p>
        </div>
      )}

      {/* ── REPLY FORM ─────────────────────────────── */}
      <div className="mt-2 mb-8 p-4 sm:p-5 border border-line/60 bg-slate/30">
        {status === "loading" && (
          <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">
            載入中...
          </p>
        )}

        {status === "anonymous" && (
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              ▸ 免費看,登入就能發言(不必付費)
            </span>
            <Link
              href={`/login?next=${encodeURIComponent(`/matches/${gameId}#game-thread`)}`}
              className="inline-block px-4 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors"
            >
              → 登入後發言
            </Link>
          </div>
        )}

        {status === "open" && (
          <div>
            <label className="block">
              <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
                您的留言 · {MAX} 字以內 · 一場一篇
              </span>
              <textarea
                rows={3}
                value={draft}
                maxLength={MAX}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="賽前鎖一句你的看法 ·（理性討論 · Tim 親手 moderate）"
                className="w-full bg-ink/60 border border-line/70 text-bone px-3 py-2.5 outline-none focus:border-gold/60 placeholder:text-mute/60 font-mono text-sm leading-relaxed transition-colors"
              />
            </label>
            <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
              <span className="font-mono text-mute/55 text-[10px] tracking-[0.25em] tabular">
                {draft.trim().length}/{MAX}
              </span>
              <button
                type="button"
                onClick={submit}
                disabled={saving || draft.trim().length === 0}
                className="px-5 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "送出中..." : "發言"}
              </button>
            </div>
          </div>
        )}

        {status === "posted" && myBody && (
          <div>
            <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-2">
              ✓ 您已留言 · 一場一篇 · 已鎖定
            </p>
            <p className="text-bone/90 text-sm leading-relaxed border-l-2 border-gold/50 pl-4">
              {myBody}
            </p>
          </div>
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

      <p className="font-mono text-mute/50 text-[9px] tracking-[0.25em]">
        免費看 · 登入發言 · 一場一篇 · ≤{MAX} 字
      </p>
    </section>
  );
}

function PostRow({ post: p }: { post: GamePost }) {
  return (
    <article className="p-4 sm:p-5 border border-line/60 bg-slate/30">
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <span className="font-mono text-bone text-[11px] sm:text-xs tracking-[0.2em]">
          {p.handle}
        </span>
        <span className="font-mono text-mute/55 text-[9px] tracking-[0.2em]">
          海選天梯 · /ladder
        </span>
      </div>
      <p className="text-bone/90 text-sm leading-relaxed">{p.body}</p>
    </article>
  );
}
