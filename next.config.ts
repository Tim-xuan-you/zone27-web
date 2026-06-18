import type { NextConfig } from "next";

// ── ZONE 27 · Next.js 16 Config ────────────────────────
// Round 34 W-C · Agent B audit Finding #5 ship · 從 empty stub 升
// production-ready config · performance + security headers + image
// optimization · 0 visual change · brand-pure production-readiness。
//
// Sections:
//   1. Image optimization · future MLB API images
//   2. Security headers · CSP-lite + X-Frame-Options + Referrer-Policy
//   3. OG image cache headers · /opengraph-image immutable 24h(per
//      Agent B Finding #12 · Vercel CPU saving)
//
// 不開 experimental.reactCompiler 因 Next.js 16.2.6 仍 unstable · Tim
// 直 explicit OK 後再開(per Agent B suggestion · 但需 brand-axiom-level
// decision)。
// ─────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  // Image optimization · whitelist 未來 MLB / CPBL image sources。
  // Currently 0 next/image usage(homepage 用 inline SVG / CSS gradients)
  // 但 future MLB API headshot / CPBL team logo 接入需要 remote patterns。
  images: {
    remotePatterns: [
      // MLB Stats API headshot CDN(future · Round 35+ when MLB images
      // surface in /matches/mlb · currently text-only)
      {
        protocol: "https",
        hostname: "midfield.mlbstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.mlbstatic.com",
        pathname: "/**",
      },
      // CPBL stats site image CDN(future · per stats.cpbl.com.tw integration)
      {
        protocol: "https",
        hostname: "stats.cpbl.com.tw",
        pathname: "/**",
      },
    ],
  },

  // ── 收合已刪的內部 voice / 重複頁(R199 Tim canary「極簡 · 砍多餘」)──
  // 這些頁是「創辦人寫爽的長文 / 重複 git」· 沒人從頭看 · 已從 Cmd-K + footer 移除。
  // 內容不是消失 —— 精華併進保留的頁(身分→/about · 路線→/roadmap · 方法→/methodology)。
  // redirect 讓任何舊連結 / 書籤不 404 · permanent:false(可逆 · 反正 stealth 無 SEO)。
  async redirects() {
    const base = [
      { source: "/annual", destination: "/about", permanent: false },
      { source: "/annual/2026", destination: "/about", permanent: false },
      { source: "/founders/postmortem-2028", destination: "/founders", permanent: false },
      { source: "/hey-tim", destination: "/faq", permanent: false },
      { source: "/now", destination: "/roadmap", permanent: false },
      { source: "/changelog", destination: "/roadmap", permanent: false },
      // /founders/ledger · R187 270 名額帳本已收掉(會員不限量)· 舊連結 / 已寄出的信不 404。
      { source: "/founders/ledger", destination: "/founders", permanent: false },
    ];
    // /tim → 創辦人公開帳本 /u/[他的永久碼](R238 · Michelin 記分板捷徑)。
    // 乾淨的路由層 307(無 1 秒 meta-refresh)· FOUNDER_AUTHOR_CODE(Vercel env · build 時讀)
    // 設好 + 8-hex 才加;未設 → 不加 → app/tim/page.tsx 接手退 /track-record(graceful)。
    const fc = (process.env.FOUNDER_AUTHOR_CODE ?? "a7178cb4").trim().toLowerCase();
    if (/^[0-9a-f]{8}$/.test(fc)) {
      base.push({ source: "/tim", destination: `/u/${fc}`, permanent: false });
    }
    return base;
  },

  // Security headers · production-ready defense baseline。
  // 對應 Agent B Finding #5 + CSP-lite defense vs OWASP top 10。
  async headers() {
    return [
      {
        // OG image cache · Agent B Finding #12 · Vercel CPU 節省 +
        // social crawler 不 trigger re-render
        source: "/:path*/opengraph-image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
      {
        // 可攜憑證徽章圖快取(/u/[code]/badge)· 同 OG · 貼到處被大量爬時不重燒 Vercel CPU。
        // 24h immutable 的「舊」沒問題:徽章只是鉤子,憑證 live 真相在點進去的 /u 頁。
        source: "/:path*/badge",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
      {
        // Global security headers · defense-in-depth
        source: "/:path*",
        headers: [
          {
            // X-Frame-Options · prevent clickjacking
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // X-Content-Type-Options · prevent MIME sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Referrer-Policy · privacy first(0 tracking axiom)
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Permissions-Policy · disable features we never use
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            // Strict-Transport-Security · enforce HTTPS for 1 year +
            // preload + includeSubDomains · per OWASP SecHeaders 2026
            // canonical · Vercel sets this by default but explicit
            // belt-and-suspenders per R96 W1 audit defense-in-depth。
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            // Content-Security-Policy · per R96 W1 agent OBSERVATION 5
            // low-priority recommendation · brand IP「0 tracking · 0
            // third-party scripts · 0 ads」 已是 naturally restrictive。
            // 'unsafe-inline' kept for Next.js inline RSC + speculation
            // rules JSON in layout.tsx + Tailwind 4 inline styles · 不
            // 強行 nonce strategy(risk of breaking Next.js 16 streaming
            // partial-prerender)。 connect-src whitelist Supabase ·
            // img-src whitelist MLB/CPBL CDN per remotePatterns above。
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // dev 需要 'unsafe-eval'(Turbopack Fast Refresh + React dev
              // debugging)· production 維持嚴格(React prod 不用 eval · 安全不變)。
              `script-src 'self' 'unsafe-inline'${
                process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
              }`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://midfield.mlbstatic.com https://img.mlbstatic.com https://stats.cpbl.com.tw",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            // Cross-Origin-Opener-Policy · process isolation · prevents
            // window.opener leakage · brand IP 「0 tracking」 axiom 延伸。
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
