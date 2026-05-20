import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /lab Dynamic OG ──────────────────────────
// 當有人把 https://zone27-web.vercel.app/lab 貼到任何平台,
// 顯示的是「Live AI Lab · 10,000 sims in browser」邀請卡 —
// 直接是一張「點進來會看到很酷的東西」的視覺承諾。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Live AI Laboratory";

export default async function LabOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.16), transparent 60%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212,175,55,0.08), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 70,
          position: "relative",
        }}
      >
        {/* TOP LEFT: brand */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 70,
            display: "flex",
            gap: 14,
          }}
        >
          <span
            style={{
              fontSize: 26,
              color: BRAND.gold,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            ZONE
          </span>
          <span
            style={{
              fontSize: 26,
              color: BRAND.bone,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            27
          </span>
        </div>

        {/* TOP RIGHT: tag */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 70,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.7)",
              letterSpacing: "0.35em",
              display: "flex",
            }}
          >
            LIVE AI LABORATORY
          </span>
          <span
            style={{
              fontSize: 12,
              color: BRAND.gold,
              letterSpacing: "0.3em",
              border: "1px solid rgba(212,175,55,0.4)",
              padding: "2px 6px",
              display: "flex",
            }}
          >
            BETA
          </span>
        </div>

        {/* CENTER: massive number */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 18,
              display: "flex",
            }}
          >
            MONTE CARLO SIMULATIONS
          </div>

          <div
            style={{
              fontSize: 230,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textShadow: "0 0 90px rgba(212,175,55,0.4)",
              display: "flex",
            }}
          >
            10,000
          </div>

          <div
            style={{
              fontSize: 28,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 8,
              display: "flex",
            }}
          >
            IN YOUR BROWSER. UNDER 2 SECONDS.
          </div>

          {/* divider */}
          <div
            style={{
              width: 200,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
              marginTop: 36,
            }}
          />

          <div
            style={{
              fontSize: 22,
              color: "rgba(245,242,234,0.6)",
              letterSpacing: "0.3em",
              marginTop: 28,
              display: "flex",
            }}
          >
            WE DON&apos;T GUESS. WE COMPUTE.
          </div>
        </div>

        {/* BOTTOM: CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 16,
            letterSpacing: "0.3em",
          }}
        >
          <span style={{ color: "rgba(245,242,234,0.55)", display: "flex" }}>
            REAL AT-BAT ENGINE · v0.2
          </span>
          <span
            style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}
          >
            ▶ RUN IT YOURSELF →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
