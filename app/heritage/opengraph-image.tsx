import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /heritage Dynamic OG ─────────────────────
// R79 W-E · Pre-Cast Inheritance Artifact share card · Patek
// Philippe 1996「Generations」 + Belk 1988 Extended Self +
// Weinstein & Deutschberger 1963 altercasting · 訪客貼到 LINE
// / PTT 看到「您不會買 ZONE 27 · 您只是替下一個 CPBL 球迷
// 世代守著它」 altercasting punch line。
//
// Brand IP fire:
//   - altercasting(pre-cast non-buyers into the role)
//   - Pratfall(self-selection filter at end of page)
//   - 倒置 SaaS(engine FREE forever · identity PAID)
//   - audience-fans-not-engineers(CPBL fan generational grammar)
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Heritage · 您不會買 ZONE 27 · 您只是替下一個 CPBL 球迷世代守著它 · Patek 1996 Generations + Belk 1988 Extended Self altercasting";

export default async function HeritageOgImage() {
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
            HERITAGE · GENERATIONS
          </span>
        </div>

        {/* HEADLINE · 您不會買 · 替下一代守 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 50,
            marginBottom: 28,
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
            PATEK 1996 · BELK 1988 EXTENDED SELF
          </span>
          <span
            style={{
              fontSize: 64,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            您不會買 ZONE 27。
          </span>
          <span
            style={{
              fontSize: 64,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginTop: 12,
              display: "flex",
            }}
          >
            您只是替下一代守著它。
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

        {/* 4 BELK MECHANISMS · Extended Self framework */}
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
          <BelkChip n="1" label="APPROPRIATION" />
          <BelkChip n="2" label="CURATION" />
          <BelkChip n="3" label="BEQUEATHAL" />
          <BelkChip n="4" label="NO-CONTAMINATION" />
        </div>

        {/* BOTTOM · altercasting + CTA */}
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
            altercasting · pre-cast not push
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            /heritage →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function BelkChip({ n, label }: { n: string; label: string }) {
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
