import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// /cpbl-pitchers OG · Baseball Savant Custom Leaderboards pattern
// · 6 stat tabs · URL-shareable · LINE/PTT 轉傳直接看相同排序。

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · CPBL 投手排行 · 6 stat tabs";

export default async function CpblPitchersOgImage() {
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
            CPBL PITCHER LEADERBOARD
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
            FREE
          </span>
        </div>

        {/* CENTER: 6 stat tabs */}
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
              marginBottom: 22,
              display: "flex",
            }}
          >
            6 SABERMETRIC STATS · 1-TAP SORT
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 800,
            }}
          >
            {["K/9", "BB/9", "HR/9", "WHIP", "ERA", "IP"].map((s) => (
              <div
                key={s}
                style={{
                  fontSize: 56,
                  color: BRAND.gold,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  padding: "12px 22px",
                  border: "1px solid rgba(212,175,55,0.4)",
                  borderRadius: 0,
                  display: "flex",
                  fontFamily: "monospace",
                }}
              >
                {s}
              </div>
            ))}
          </div>

          <div
            style={{
              width: 240,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
              marginTop: 40,
            }}
          />

          <div
            style={{
              fontSize: 26,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "0.05em",
              marginTop: 28,
              display: "flex",
            }}
          >
            URL-SHAREABLE · LINE 轉傳 = 相同排序
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
            BASEBALL SAVANT PATTERN · CPBL FIRST
          </span>
          <span
            style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}
          >
            ▶ SORT IT YOURSELF →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
