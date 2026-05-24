import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /pricing/why Dynamic OG ──────────────────
// R79 W-G · Pricing rationale share card · Defector inverse-
// disclosure + FanGraphs output-not-input + Stripe Atlas 6-
// deliverable + Stratechery single-sentence FAQ + Pratfall
// pattern · 訪客貼到 LINE / PTT 看到「為什麼 NT$ 2,700 ·
// 不是 sales call · 不是 enterprise contact form」 punchline。
//
// Brand IP fire:
//   - Pratfall(unique「沒做什麼」 section)
//   - Costly Signaling(output-not-input forces real numbers)
//   - Disclosure(inverse-disclosure who we're not beholden to)
//   - 倒置 SaaS(NT$ 1,500/season vs NT$ 2,700 一次性)
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Pricing Why · NT$ 1,500/season vs NT$ 2,700 一次性 · 一頁說清楚 · 不藏在 FAQ · 不靠 sales call · 不靠 enterprise contact form";

export default async function PricingWhyOgImage() {
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
            PRICING / WHY · 一頁說清楚
          </span>
        </div>

        {/* HEADLINE · pricing two anchors side by side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            marginBottom: 24,
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
            DEFECTOR + FANGRAPHS + STRIPE ATLAS PATTERN
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 36,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 80,
                  color: BRAND.bone,
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                NT$ 1,500
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(245,242,234,0.5)",
                  letterSpacing: "0.25em",
                  display: "flex",
                }}
              >
                BLACK CARD · 每季
              </span>
            </div>
            <span
              style={{
                fontSize: 40,
                color: "rgba(212,175,55,0.4)",
                fontWeight: 300,
                display: "flex",
              }}
            >
              ·
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 80,
                  color: BRAND.gold,
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  textShadow: "0 0 80px rgba(212,175,55,0.3)",
                  display: "flex",
                }}
              >
                NT$ 2,700
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(212,175,55,0.7)",
                  letterSpacing: "0.25em",
                  display: "flex",
                }}
              >
                FOUNDERS 27 · 一次性
              </span>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 24,
            marginBottom: 24,
          }}
        />

        {/* 5 ANTI-PATTERN CHIPS · 「沒做什麼」 list */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 12,
            letterSpacing: "0.18em",
          }}
        >
          <AntiChip label="NO RECOMMENDED BADGE" />
          <AntiChip label="NO 4-COL MATRIX" />
          <AntiChip label="NO USAGE CALCULATOR" />
          <AntiChip label="NO COUNTDOWN" />
          <AntiChip label="NO 30-DAY SEAL" />
        </div>

        {/* BOTTOM · framing + CTA */}
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
            不藏在 FAQ · 不靠 sales call · 一頁全公開
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            /pricing/why →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function AntiChip({ label }: { label: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.4)",
        padding: "5px 12px",
        display: "flex",
        gap: 8,
        alignItems: "baseline",
        background: "rgba(212,175,55,0.04)",
      }}
    >
      <span
        style={{
          color: "rgba(212,175,55,0.7)",
          fontSize: 10,
          display: "flex",
        }}
      >
        ✕
      </span>
      <span style={{ color: BRAND.bone, display: "flex" }}>{label}</span>
    </div>
  );
}
