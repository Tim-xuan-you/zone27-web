import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import { Tri } from "@/lib/og-marks";

// ── ZONE 27 · /methodology/diff Dynamic OG ─────────────
// Round 50 W-A · 接 /methodology OG paper-style framing 但 axis 改
// 「v0.2 → v0.3 DIFF」 而非 single version。 訪客貼到 LINE / Discord
// 看到的是「我們公開整份引擎 delta · 不是 marketing」 punch。
//
// Brand IP 同時 fire:
//   - Disclosure Philosophy · OG layer 暴露 14 unchanged + 1 new
//   - Pratfall · OG layer 暴露 6 件 v0.3 不修正
//   - Method Public · v0.2 vs v0.3 column 並列 · 不藏 evolutionary detail
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Engine Diff v0.2 → v0.3 · 14 unchanged · 1 new · 6 not-fixed";

export default async function MethodologyDiffOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.10), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* TOP ROW · brand + label */}
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
            ENGINE DIFF · MAY 2026
          </span>
        </div>

        {/* HEADLINE · v0.2 → v0.3 paper-style */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
            marginBottom: 36,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 14,
              display: "flex",
            }}
          >
            THE ZONE 27 ENGINE · DELTA
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <span
              style={{
                fontSize: 110,
                color: BRAND.bone,
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                display: "flex",
              }}
            >
              v0.2
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <Tri size={42} color={BRAND.gold} opacity={0.5} />
            </span>
            <span
              style={{
                fontSize: 110,
                color: BRAND.gold,
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                display: "flex",
              }}
            >
              v0.3
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginBottom: 28,
          }}
        />

        {/* DATA TABLE · diff fact rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 20,
          }}
        >
          <PaperRow label="CONSTANTS UNCHANGED" value="14" />
          <PaperRow label="CONSTANTS NEW" value="1 · HR_PARK_SENSITIVITY 0.5" />
          <PaperRow label="LINES OF DELTA LOGIC" value="5" />
          <PaperRow label="LIMITATIONS DISCLOSED" value="6 not-fixed" />
        </div>

        {/* BOTTOM · CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 16,
            letterSpacing: "0.3em",
          }}
        >
          <span style={{ color: "rgba(245,242,234,0.6)", display: "flex" }}>
            7 sections · code diff · worked example · pre-commit
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            DIFF · NOT MARKETING
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function PaperRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 24,
      }}
    >
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          letterSpacing: "0.2em",
          fontSize: 14,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: BRAND.bone,
          letterSpacing: "-0.01em",
          fontSize: 22,
          display: "flex",
        }}
      >
        {value}
      </span>
    </div>
  );
}
