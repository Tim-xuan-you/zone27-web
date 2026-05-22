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
        ],
      },
    ];
  },
};

export default nextConfig;
