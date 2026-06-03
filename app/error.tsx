"use client";

import { useEffect } from "react";
import Link from "next/link";

// ── ZONE 27 · Branded Route Error Boundary ────────────
// 客製錯誤頁面。當任何 runtime error 冒出於 route segment 內,訪客
// 看到的不再是 Next.js 預設的紅字 stacktrace,而是符合 ZONE 27 黑金
// 品牌語言的優雅錯誤訊息 + 一鍵重試。
//
// R66 W-A · Next.js 16 API migration · `reset` → `unstable_retry`
// (per node_modules/next/dist/docs/01-app/03-api-reference/03-file-
// conventions/error.md current spec)。 Old `reset` may break in
// Next.js 17 · 主動 migrate。 NEW: app/global-error.tsx 同 wave 加
// for root layout error coverage(error.tsx 不 wrap root layout)。
//
// 注意:error.tsx 是 client component 強制需求,且這頁不能引用
// Nav / Footer 等 server components(會把整棵樹拉壞)。
// ─────────────────────────────────────────────────────

export default function RouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  // Log to console in dev so we don't lose the stack
  useEffect(() => {
    console.error("[ZONE27 · ROUTE-ERROR]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-10 py-16"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.08), transparent 60%), #0F1A2E",
        color: "#F5F2EA",
      }}
    >
      {/* Brand */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-mono text-gold text-lg tracking-[0.22em] font-medium group-hover:opacity-80">
            ZONE
          </span>
          <span className="font-mono text-bone text-lg tracking-[0.22em] font-medium group-hover:opacity-80">
            27
          </span>
        </Link>
      </div>

      <div className="text-center max-w-2xl">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.45em] mb-8">
          ERROR · MODEL FAULT
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl text-bone font-light tracking-tight leading-tight">
          系統<span className="text-gold">出局</span>。
        </h1>

        <p className="mt-6 font-mono text-mute text-sm tracking-[0.3em]">
          OUR MODEL JUST STRUCK OUT SWINGING.
        </p>

        <p className="mt-8 text-mute leading-relaxed max-w-md mx-auto">
          剛剛發生了一個我們沒預料到的錯誤。
          您可以重試這個動作,或回到首頁重新開始。
        </p>

        {/* Tiny error digest for debugging if Vercel includes it */}
        {error.digest && (
          <p className="mt-6 font-mono text-mute text-[10px] tracking-[0.25em]">
            DIGEST · {error.digest}
          </p>
        )}

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
          >
            ▶ 再試一次
          </button>
          <Link
            href="/"
            className="px-8 py-3 border border-gold/40 text-gold text-xs tracking-[0.3em] hover:bg-gold/10 transition-colors"
          >
            回首頁
          </Link>
        </div>

        <p className="mt-16 font-mono text-mute text-[10px] tracking-[0.3em]">
          EVEN THE BEST ENGINE HAS BAD INNINGS.
        </p>
      </div>
    </div>
  );
}
