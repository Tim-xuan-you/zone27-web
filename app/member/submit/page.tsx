"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── ZONE 27 · /member/submit ───────────────────────────
// Round 30 Wave 10 · OPEN「投稿給 Tim 親手 curate」 form。
// Stratechery Guest Post + Tim 1/週 cadence pattern。
//
// Flow:
//   logged in → render form → submit → POST /api/submit → email Tim → ack
//   anonymous → render "/login" prompt
//
// Brand IP:
//   - 沒 public posting(per BLACK Q3+ TapPay axiom)
//   - 純 Tim-curate · 不存資料庫 · 0 server-side archive
//   - 1/週 cadence per /membership Creator Permissions FAQ
// ─────────────────────────────────────────────────────

const MAX_TITLE = 120;
const MAX_BODY = 3000;

type Status =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "ready" }
  | { kind: "submitting" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export default function SubmitPage() {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setStatus(data.session ? { kind: "ready" } : { kind: "anonymous" });
      } catch {
        if (!cancelled) setStatus({ kind: "anonymous" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim().length < 5 || body.trim().length < 30) {
      setStatus({
        kind: "error",
        message: "Title ≥ 5 字 · Body ≥ 30 字",
      });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: data.error || `HTTP ${res.status}`,
        });
        return;
      }
      setStatus({ kind: "sent" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "unknown_error";
      setStatus({ kind: "error", message });
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-20 pb-8">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4"
          >
            / SUBMIT · 投稿給 Tim · 1/週 curate
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
            您寫 · <span className="text-gold">Tim curate</span> · 1 週 1 篇
          </h1>
          <p className="mt-5 text-mute text-sm sm:text-base leading-relaxed">
            Stratechery Guest Post pattern · 免費投稿 · 0 抽成 · 沒 public 自動 post ·
            純 Tim 親手 curate(防的是收費明牌那一套)。 不過稿的 reply 您
            reason · 不藏。 1 週 1 篇 cadence。
          </p>
        </section>

        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16">
          {status.kind === "loading" ? (
            <p className="font-mono text-mute text-[10px] tracking-[0.25em]">
              ● 載入中
            </p>
          ) : status.kind === "anonymous" ? (
            <div className="bg-slate/40 border border-gold/40 p-6 sm:p-8">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
              >
                / LOGIN REQUIRED
              </p>
              <p className="text-mute text-sm leading-relaxed mb-5">
                投稿需要 OPEN 會員身份(防 anon spam)· Email + 密碼
                1 分鐘註冊 → 回此頁。
              </p>
              <Link
                href="/login?next=/member/submit"
                className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                → /login · Email + 密碼 註冊
              </Link>
            </div>
          ) : status.kind === "sent" ? (
            <div className="bg-gold/5 border border-gold/60 glow-soft p-6 sm:p-8 text-center">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3 shimmer"
              >
                ✓ SENT · 寄到 Tim 信箱
              </p>
              <h2 className="text-2xl text-bone font-light tracking-tight mb-3">
                收到 · 24 小時內 review
              </h2>
              <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
                Tim 親手讀完 reply。 不過 = reply 您 reason · 不藏。 1/週 cadence。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/member"
                  className="px-6 py-2.5 border border-gold text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
                >
                  → 回 /member
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-slate/40 border border-gold/40 p-6 sm:p-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-2"
                >
                  TITLE · 標題({title.length}/{MAX_TITLE})
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value.slice(0, MAX_TITLE))
                  }
                  placeholder="例:今晚這場賽前分析"
                  className="w-full bg-navy/60 border border-line/70 px-3 py-2 text-bone text-base focus:outline-none focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/30 transition-colors"
                  disabled={status.kind === "submitting"}
                />
              </div>
              <div>
                <label
                  htmlFor="body"
                  className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-2"
                >
                  BODY · 內容({body.length}/{MAX_BODY})
                </label>
                <textarea
                  id="body"
                  required
                  rows={10}
                  value={body}
                  onChange={(e) =>
                    setBody(e.target.value.slice(0, MAX_BODY))
                  }
                  placeholder="您的分析 / 觀察 / 賽事 take · 30 字 ~ 3000 字 · 純文字 · 不接 markdown 不接 link 不接 image · Tim 過稿後手動 publish 時可加 link / image"
                  className="w-full bg-navy/60 border border-line/70 px-3 py-2 text-bone text-sm focus:outline-none focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/30 transition-colors font-mono leading-relaxed resize-y"
                  disabled={status.kind === "submitting"}
                />
              </div>
              <button
                type="submit"
                disabled={
                  status.kind === "submitting" ||
                  title.trim().length < 5 ||
                  body.trim().length < 30
                }
                className="w-full px-6 py-3 bg-gold text-navy font-mono text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.kind === "submitting"
                  ? "● 寄送中 ..."
                  : "→ 寄給 Tim 親手 review"}
              </button>
              {status.kind === "error" && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="font-mono text-loss text-xs tracking-[0.15em] leading-relaxed"
                >
                  ✕ {status.message}
                </p>
              )}
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed pt-3 border-t border-line/40">
                ▸ Tim 1/週 curate · 不過稿 reply reason · 不藏
                <br />
                ▸ 0 server-side archive · 您 submission 只走 Resend → Tim
                Gmail · 不存 DB · per /privacy
                <br />
                ▸ 免費投稿 · 0 抽成 · 創作者只免費公開發 · 賺的是地位不是錢
              </p>
            </form>
          )}
        </section>

        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/member"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回 /member
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
