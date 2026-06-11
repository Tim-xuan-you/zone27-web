// ── ZONE 27 · Brand color tokens ──────────────────────
// Mirror of the CSS custom properties in app/globals.css.
//
// Why duplicated? OG images (next/og ImageResponse) generate at
// build time on the Node side — they cannot read browser CSS vars.
// To keep colors in sync, we centralize them here and import from
// every OG card / dynamic-image generator.
//
// If you change a color, change it BOTH in app/globals.css and here.
// (One day we can codegen this from the CSS — for now, manual mirror.)
// ─────────────────────────────────────────────────────

export const BRAND = {
  ink: "#0A0F1C",
  navy: "#0F1A2E",
  slate: "#131F38",
  line: "#1E2A47",
  gold: "#D4AF37",
  goldSoft: "#BFA15A",
  bone: "#F5F2EA",
  mute: "#8A93A8",
  // 勝色(綠)刻意移除 —— 暗金品牌無紅綠對比 · 落空一律用 loss 柔紅(紅線:無紅綠)。
  loss: "#F87171",
} as const;

// Common alpha-channel helpers — for gradients, shadows, overlays.
export const goldRgba = (alpha: number) => `rgba(212, 175, 55, ${alpha})`;
export const boneRgba = (alpha: number) => `rgba(245, 242, 234, ${alpha})`;
export const navyRgba = (alpha: number) => `rgba(15, 26, 46, ${alpha})`;

// OG image canvas — standard 1.91:1 Open Graph ratio.
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

// Standard radial-gradient background used across OG cards.
// Gold halo top + faint gold halo bottom on deep navy.
export const OG_BACKGROUND_IMAGE =
  "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06), transparent 60%)";
