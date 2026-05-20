import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /signal-board Dynamic OG ──────────────────
// /signal-board is the daily quantitative digest page —
// gets shared as "today's analysis." Distinct visual:
// Bloomberg-style daily brief card with tier counts +
// data freshness chip. Pattern echoes /audit OG's
// terminal aesthetic but framed as DAILY BRIEF, not
// MODEL REPORT.
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Signal Board · Daily Quantitative Brief";

export default async function SignalBoardOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.12), transparent 60%)",
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
            DAILY QUANT BRIEF
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
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
            每日量化早報
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
            SIGNAL
          </span>
          <span
            style={{
              fontSize: 96,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginTop: 4,
              display: "flex",
            }}
          >
            BOARD
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 32,
            marginBottom: 22,
          }}
        />

        {/* Tier breakdown row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TierStat n="1" label="HIGH CONFIDENCE" gold />
          <TierStat n="1" label="MODERATE" />
          <TierStat n="1" label="NEUTRAL / FADE" />
          <TierStat n="3" label="TOTAL MATCHES" />
        </div>

        {/* Bottom · punchline */}
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
            Bloomberg-style 每日量化研究早報 · 一個畫面決定看哪場
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
            /signal-board →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function TierStat({
  n,
  label,
  gold = false,
}: {
  n: string;
  label: string;
  gold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
      }}
    >
      <span
        style={{
          color: gold ? BRAND.gold : BRAND.bone,
          fontSize: 56,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          display: "flex",
        }}
      >
        {n}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 11,
          letterSpacing: "0.22em",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
