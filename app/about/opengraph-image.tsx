import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /about Dynamic OG ─────────────────────────
// Distinct from sales / audit OG cards. /about is the brand-story
// page — the OG card should feel like a founder's letter, not a
// product card. Featured element: Tim's pull quote from Chapter 5
// ("ZONE 27 是我給這群人 —— 包括我自己 —— 的一封情書").
// Letter-style typography, attribution line, no data table.
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · About · 一封給硬核棒球迷的情書";

export default async function AboutOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 110%, rgba(212,175,55,0.14), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* TOP · brand mark + section label */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                fontSize: 24,
                color: BRAND.gold,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              ZONE
            </span>
            <span
              style={{
                fontSize: 24,
                color: BRAND.bone,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              27
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,175,55,0.7)",
              letterSpacing: "0.35em",
              display: "flex",
            }}
          >
            ABOUT · OUR MANIFESTO
          </span>
        </div>

        {/* Center · the pull quote, letter-style */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            marginTop: 40,
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: "rgba(212,175,55,0.5)",
              letterSpacing: "0.35em",
              marginBottom: 24,
              display: "flex",
            }}
          >
            ―
          </span>
          <span
            style={{
              fontSize: 56,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              display: "flex",
              fontFamily: "serif",
            }}
          >
            ZONE 27 是我給這群人
          </span>
          <span
            style={{
              fontSize: 56,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              display: "flex",
              fontFamily: "serif",
            }}
          >
            —— <span style={{ color: BRAND.gold, marginLeft: 14, marginRight: 14 }}>包括我自己</span> ——
          </span>
          <span
            style={{
              fontSize: 56,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              display: "flex",
              fontFamily: "serif",
            }}
          >
            的一封情書。
          </span>
        </div>

        {/* Attribution line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 36,
            paddingTop: 18,
            borderTop: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,175,55,0.7)",
              letterSpacing: "0.3em",
              display: "flex",
            }}
          >
            TIM · FOUNDER · CPBL 球迷 27 年
          </span>
          <span
            style={{
              fontSize: 14,
              color: BRAND.gold,
              letterSpacing: "0.3em",
              fontWeight: 500,
              display: "flex",
            }}
          >
            /about · 6 chapters →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
