import { ImageResponse } from "next/og";

// ── ZONE 27 · Apple Touch Icon ─────────────────────────
// R79 W-B · favicon void close · iOS Safari + LINE iOS +
// iMessage + Threads + Slack mobile fetch apple-touch-icon
// (180×180) when rendering share previews on Apple devices。
//
// Without this file · iOS share previews fall back to the 64×64
// favicon · pixelated rendering on iPhone share sheets。
//
// Pattern parallels app/icon.tsx but at 180×180 with more
// breathing room around the Z monogram · brand-pure square。
//
// Brand IP fire:
//   - same axis as app/icon.tsx · navy + gold + "27" subscript
//   - distinct from OG cards(those are 1200×630 · this is
//     180×180 square icon · iOS home-screen + share sheet)
// ─────────────────────────────────────────────────────

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F1A2E",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,0.18), transparent 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4AF37",
          fontSize: 120,
          fontWeight: 600,
          letterSpacing: -5,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        Z
        <span
          style={{
            position: "absolute",
            bottom: 22,
            right: 22,
            fontSize: 32,
            color: "#F5F2EA",
            fontWeight: 500,
            letterSpacing: 0,
            display: "flex",
          }}
        >
          27
        </span>
      </div>
    ),
    { ...size }
  );
}
