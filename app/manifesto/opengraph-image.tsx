import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import { PRODUCT_VERSION } from "@/lib/build-meta";

// ── ZONE 27 · /manifesto Dynamic OG ─────────────────────
// When someone shares https://zone27-web.vercel.app/manifesto in LINE
// / FB / Discord, they don't get the generic brand card — they get a
// dedicated artifact showing the 4 inversion pairs laid out cleanly.
//
// Design principles:
//   - Echo /audit OG's Bloomberg-grade restraint
//   - The grid of 4 INDUSTRY ❌ × ZONE 27 ✓ rows IS the visual proof
//   - Big "倒置宣言" headline (Chinese punches harder for the target audience)
//   - English subtitle anchors universally
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 倒置宣言 · The Four Inversions";

export default async function ManifestoOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,55,0.14), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* ── TOP ROW · brand + label ───────────────── */}
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
            MANIFESTO · {PRODUCT_VERSION}
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 30,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 12,
              display: "flex",
            }}
          >
            INVERTED BY DESIGN
          </span>
          <span
            style={{
              fontSize: 88,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            倒置宣言
          </span>
          <span
            style={{
              fontSize: 22,
              color: BRAND.gold,
              fontWeight: 400,
              letterSpacing: "0.18em",
              marginTop: 12,
              display: "flex",
            }}
          >
            THE FOUR INVERSIONS
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginBottom: 24,
          }}
        />

        {/* ── 2x2 layout · the 4 axioms (flex · next/og does not support grid) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <AxiomCell
              roman="I"
              label="DISCLOSURE"
              zh="完整公開引擎"
              industry="行業:藏 weights"
            />
            <AxiomCell
              roman="II"
              label="MONETIZATION"
              zh="工具免費,身分付費"
              industry="行業:per-use 計費"
            />
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <AxiomCell
              roman="III"
              label="COVERAGE"
              zh="能誠實算的才覆蓋"
              industry="行業:覆蓋全部博彩"
            />
            <AxiomCell
              roman="IV"
              label="PRIVACY"
              zh="零第三方追蹤"
              industry="行業:GA + Pixel + Hotjar"
            />
          </div>
        </div>

        {/* ── BOTTOM · differentiator punchline ──────── */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(245,242,234,0.6)",
              letterSpacing: "0.02em",
              display: "flex",
            }}
          >
            每個「我們不做」,都是「我們是誰」的證明
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
            /manifesto
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function AxiomCell({
  roman,
  label,
  zh,
  industry,
}: {
  roman: string;
  label: string;
  zh: string;
  industry: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "16px 18px",
        border: "1px solid rgba(212,175,55,0.18)",
        background: "rgba(15,26,46,0.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            color: "rgba(212,175,55,0.7)",
            fontSize: 13,
            letterSpacing: "0.25em",
            fontWeight: 500,
            display: "flex",
          }}
        >
          {roman}
        </span>
        <span
          style={{
            color: BRAND.gold,
            fontSize: 10,
            letterSpacing: "0.25em",
            display: "flex",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          color: BRAND.bone,
          fontSize: 22,
          letterSpacing: "-0.01em",
          fontWeight: 400,
          marginBottom: 4,
          display: "flex",
        }}
      >
        {zh}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.4)",
          fontSize: 11,
          letterSpacing: "0.05em",
          textDecoration: "line-through",
          display: "flex",
        }}
      >
        {industry}
      </span>
    </div>
  );
}
