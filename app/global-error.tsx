"use client";

import { useEffect } from "react";

// ── ZONE 27 · Root Layout Error Boundary ──────────────
// R66 W-A · Next.js 16 best practice · NEW · 之前 app/error.tsx 只
// wraps route segments(loading.js · not-found.js · page.js · nested
// layouts)· 不 wraps root layout(app/layout.tsx)。 If root layout
// crashes(rare but possible · e.g. Geist font load failure · speculation-
// rules script JSON.stringify exception)· without global-error.tsx
// visitor 看到 Next.js default red-screen blank · brand IP collapse。
//
// Per node_modules/next/dist/docs/01-app/03-api-reference/03-file-
// conventions/error.md spec:
//   - Must define own <html> and <body>(replaces root layout)
//   - Client Component required(error boundaries 必須)
//   - NO metadata export(use React <title> instead)
//   - unstable_retry(NOT reset · Next.js 16 API migration)
//
// Design rationale:
//   - Self-contained inline styles(no globals.css available · root
//     layout that loads it just crashed)
//   - Inline navy + gold colors(can't import @/lib/brand)
//   - Match app/error.tsx brand language for consistency
//   - No external dep · no Link from next/link(SSR-safe pure HTML)
//
// 同 brand IP「方法公開」 延伸到 error states · 「even at catastrophic
// failure · ZONE 27 still looks like ZONE 27」 axiom。
// ─────────────────────────────────────────────────────

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[ZONE27 · GLOBAL-ERROR]", error);
  }, [error]);

  return (
    <html lang="zh-Hant">
      <head>
        <title>系統出局 · ZONE 27</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F1A2E" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.08), transparent 60%), #0F1A2E",
          color: "#F5F2EA",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          fontFeatureSettings: '"cv11", "ss01", "ss03"',
        }}
      >
        {/* Brand */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              color: "#D4AF37",
              fontSize: "1.125rem",
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            ZONE
          </span>
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              color: "#F5F2EA",
              fontSize: "1.125rem",
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            27
          </span>
        </div>

        {/* Center content */}
        <div style={{ textAlign: "center", maxWidth: "640px" }}>
          <p
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              color: "rgba(212,175,55,0.7)",
              fontSize: "0.625rem",
              letterSpacing: "0.45em",
              margin: "0 0 2rem 0",
            }}
          >
            ROOT LAYOUT FAULT · CATASTROPHIC ERROR
          </p>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              color: "#F5F2EA",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            系統<span style={{ color: "#D4AF37" }}>出局</span>。
          </h1>

          <p
            style={{
              marginTop: "1.5rem",
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              color: "#8A93A8",
              fontSize: "0.875rem",
              letterSpacing: "0.3em",
            }}
          >
            EVEN THE ROOT LAYOUT STRUCK OUT.
          </p>

          <p
            style={{
              marginTop: "2rem",
              color: "#8A93A8",
              lineHeight: 1.6,
              maxWidth: "28rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            這是 root layout 層級的錯誤(font 載入失敗 / script 例外 / cookie
            handler 崩潰 等罕見原因)· error.tsx 沒 catch 到 · global-error.tsx
            接住您。 您可以重試,或回到首頁手動 reload。
          </p>

          {error.digest && (
            <p
              style={{
                marginTop: "1.5rem",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                color: "#8A93A8",
                fontSize: "0.625rem",
                letterSpacing: "0.25em",
              }}
            >
              DIGEST · {error.digest}
            </p>
          )}

          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                padding: "0.75rem 2rem",
                background: "#D4AF37",
                color: "#0F1A2E",
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                fontFamily:
                  "ui-monospace, SFMono-Regular, monospace",
              }}
            >
              ▶ 再試一次
            </button>
            {/* Hard <a> 故意 not next/link · global-error.tsx replaces root
                layout · Link from next/link relies on router context that
                lives INSIDE layout · using Link here may not work in catastrophic
                root-layout failure scenario · hard navigation safer fallback。 */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "0.75rem 2rem",
                color: "#D4AF37",
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                border: "1px solid rgba(212,175,55,0.4)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                fontFamily:
                  "ui-monospace, SFMono-Regular, monospace",
              }}
            >
              回首頁
            </a>
          </div>

          <p
            style={{
              marginTop: "4rem",
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              color: "#8A93A8",
              fontSize: "0.625rem",
              letterSpacing: "0.3em",
            }}
          >
            EVEN MONTE CARLO HAS BAD INNINGS.
          </p>
        </div>
      </body>
    </html>
  );
}
