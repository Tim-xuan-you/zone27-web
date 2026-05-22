import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /transparency Dynamic OG ─────────────────
// Round 51 W-D · audit aggregator OG card · Anthropic pattern · 訪客
// 貼到 LINE / Discord 看到「我們整份 audit 一頁可見」 punch line · 不
// 散落在「learn more」 secondary。
//
// Brand IP fire:
//   - Disclosure(canonical · 6 sections 全 self-exposure)
//   - Pratfall(主動暴露 LIMITS + DIVERGED + NEVER)
//   - Costly Signaling(transparency 升 first-class destination)
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Transparency · 完整 audit 一頁可見 · 6 sections · LIMITS · NEVER · DIVERGED · COMMITMENTS · DATA SOURCES · AUDIT TRAIL";

export default async function TransparencyOgImage() {
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
            TRANSPARENCY · MAY 2026
          </span>
        </div>

        {/* HEADLINE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 60,
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
            COMPLETE AUDIT · ONE PAGE
          </span>
          <span
            style={{
              fontSize: 100,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            完整 audit
          </span>
          <span
            style={{
              fontSize: 100,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginTop: 6,
              display: "flex",
            }}
          >
            一頁可見
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginBottom: 24,
          }}
        />

        {/* 6 SECTION CHIPS */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 14,
            letterSpacing: "0.22em",
          }}
        >
          <SectionChip n="01" label="LIMITS" />
          <SectionChip n="02" label="NEVER" />
          <SectionChip n="03" label="DIVERGED" />
          <SectionChip n="04" label="COMMITMENTS" />
          <SectionChip n="05" label="DATA SOURCES" />
          <SectionChip n="06" label="AUDIT TRAIL" />
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
            8 trust artifacts · 1 navigable destination
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            NOT AFTERTHOUGHT · PRODUCT
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function SectionChip({ n, label }: { n: string; label: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.4)",
        padding: "6px 14px",
        display: "flex",
        gap: 10,
        alignItems: "baseline",
        background: "rgba(212,175,55,0.04)",
      }}
    >
      <span style={{ color: "rgba(212,175,55,0.7)", fontSize: 11, display: "flex" }}>
        / {n}
      </span>
      <span style={{ color: BRAND.bone, display: "flex" }}>{label}</span>
    </div>
  );
}
