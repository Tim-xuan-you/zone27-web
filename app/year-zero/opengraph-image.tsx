import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /year-zero Dynamic OG ────────────────────
// R79 W-D · First Annual Letter share card · Defector Year-Five
// applied at Year-Zero · long-form single-page essay reads-like-
// narrative-NOT-brochure · 訪客貼到 LINE / PTT 看到「第一封年信 ·
// 不 paywall · 不 email-gate · 5 sections」 punchline。
//
// Brand IP fire:
//   - Defector worker-owner annual report 85% renew driver
//   - Pratfall(§03 DON'T KNOW always non-empty)
//   - Disclosure(SHIPPED + REFUSED 兩 column 並列)
//   - reader-pulls(同 /letter · no email-gate)
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Year Zero · 第一封年信 · Defector Year-Five pattern at Year-Zero · SHIPPED + REFUSED + DON'T KNOW + YEAR ONE + THANK YOU";

export default async function YearZeroOgImage() {
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
            ANNUAL · YEAR ZERO
          </span>
        </div>

        {/* HEADLINE · Year Zero numeral */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 12,
              display: "flex",
            }}
          >
            FIRST ANNUAL LETTER
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 28,
            }}
          >
            <span
              style={{
                fontSize: 130,
                color: BRAND.bone,
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                display: "flex",
              }}
            >
              YEAR
            </span>
            <span
              style={{
                fontSize: 180,
                color: BRAND.gold,
                fontWeight: 300,
                letterSpacing: "-0.06em",
                lineHeight: 1,
                textShadow: "0 0 80px rgba(212,175,55,0.3)",
                display: "flex",
              }}
            >
              0
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
            marginTop: 36,
            marginBottom: 24,
          }}
        />

        {/* 5 SECTION CHIPS · narrative spine */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            letterSpacing: "0.22em",
          }}
        >
          <NarrativeChip n="01" label="SHIPPED" />
          <NarrativeChip n="02" label="REFUSED" />
          <NarrativeChip n="03" label="DON'T KNOW" />
          <NarrativeChip n="04" label="YEAR ONE" />
          <NarrativeChip n="05" label="THANK YOU" />
        </div>

        {/* BOTTOM · Defector lineage + CTA */}
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
            Defector Year-Five at Year-Zero · 不 paywall
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            /year-zero →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function NarrativeChip({ n, label }: { n: string; label: string }) {
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
      <span
        style={{
          color: "rgba(212,175,55,0.7)",
          fontSize: 11,
          display: "flex",
        }}
      >
        / {n}
      </span>
      <span style={{ color: BRAND.bone, display: "flex" }}>{label}</span>
    </div>
  );
}
