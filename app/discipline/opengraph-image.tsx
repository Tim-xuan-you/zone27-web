import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /discipline Dynamic OG ────────────────────
// Visual artifact for the "鐵律" page · three philosopher-CEO
// columns (Buffett · Musk · Costco) each with their core
// principle distilled. Bloomberg-style serif title + monospace
// data grid. Distinct from /audit (model report), /manifesto
// (4-axiom grid), and other OG cards.
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 鐵律 · Buffett · Musk · Costco";

export default async function DisciplineOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(212,175,55,0.13), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* TOP */}
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
            OPERATING DISCIPLINE · v0.28
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 26,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 10,
              display: "flex",
            }}
          >
            WE DON&apos;T MAKE MONEY ON SECRETS · WE MAKE IT ON DISCIPLINE
          </span>
          <span
            style={{
              fontSize: 96,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            鐵律
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginBottom: 24,
          }}
        />

        {/* 3-column philosopher grid */}
        <div style={{ display: "flex", gap: 16 }}>
          <PhilColumn
            n="01"
            name="BUFFETT"
            principle="長期主義"
            note="信譽 20 年累積 · 5 分鐘可毀"
          />
          <PhilColumn
            n="02"
            name="MUSK"
            principle="第一原理"
            note="5 步演算法 · 從零拆解"
            highlight
          />
          <PhilColumn
            n="03"
            name="COSTCO"
            principle="會員制"
            note="14% 毛利上限 · 0 廣告"
          />
        </div>

        {/* Bottom punchline */}
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
            違反任何一條 · ZONE 27 就不再是 ZONE 27
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
            /discipline →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function PhilColumn({
  n,
  name,
  principle,
  note,
  highlight = false,
}: {
  n: string;
  name: string;
  principle: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px 22px",
        border: `1px solid ${
          highlight ? "rgba(212,175,55,0.45)" : "rgba(212,175,55,0.18)"
        }`,
        background: highlight ? "rgba(212,175,55,0.05)" : "rgba(15,26,46,0.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            color: "rgba(212,175,55,0.7)",
            fontSize: 11,
            letterSpacing: "0.25em",
            fontWeight: 500,
            display: "flex",
          }}
        >
          {n}
        </span>
        <span
          style={{
            color: BRAND.gold,
            fontSize: 14,
            letterSpacing: "0.25em",
            fontWeight: 500,
            display: "flex",
          }}
        >
          {name}
        </span>
      </div>
      <span
        style={{
          color: BRAND.bone,
          fontSize: 32,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: 12,
          display: "flex",
        }}
      >
        {principle}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.5)",
          fontSize: 12,
          letterSpacing: "0.05em",
          lineHeight: 1.4,
          display: "flex",
        }}
      >
        {note}
      </span>
    </div>
  );
}
