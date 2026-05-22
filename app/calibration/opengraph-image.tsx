import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /calibration Dynamic OG ────────────────────
// Round 44 W-A · Agent K-discovered OG-card gap fix · R39 W-A shipped
// /calibration page without OG card · per [[zone27-disclosure-philosophy]]
// OG cards = private-DM lever for trust-artifact sharing。
//
// /calibration 是 FiveThirtyEight「Checking Our Work」 pattern · Brier
// score + reliability diagram · 玩運彩+報馬仔 結構性無法 publish ·
// 此 OG card 必須 surface 此 displacement narrative when shared on
// LINE/FB/Discord。
//
// 設計原則(per /audit + /track-record + /annual OG pattern):
//   - Distinct from sales OG cards · 不是 marketing
//   - 像 trading terminal snapshot · 不像行銷海報
//   - 數字主角(Brier + N + coin-flip baseline)
//   - 一行 punchline 底部 displacement narrative。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Checking Our Work · Engine self-grading + Brier score";

export default async function CalibrationOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.10), transparent 60%)",
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
            CHECKING OUR WORK · BRIER
          </span>
        </div>

        {/* HEADLINE */}
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
            ENGINE SELF-GRADING
          </span>
          <span
            style={{
              fontSize: 76,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            說 70% · 實際贏多少?
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 40,
            marginBottom: 28,
          }}
        />

        {/* DATA ROW · Brier baseline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            marginTop: 8,
          }}
        >
          <BrierBox label="ENGINE v0.2" value="—" sub="N=0 · WAITING" gold />
          <BrierBox label="COIN-FLIP BASELINE" value="0.250" sub="0 info · perfect null" />
          <BrierBox label="PERFECT FORECAST" value="0.000" sub="impossible boundary" />
        </div>

        {/* BOTTOM · differentiator */}
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
              letterSpacing: "0.04em",
              display: "flex",
              maxWidth: 720,
            }}
          >
            Tipster sites can&apos;t publish this page. We can. We do.
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
            /calibration →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function BrierBox({
  label,
  value,
  sub,
  gold = false,
}: {
  label: string;
  value: string;
  sub: string;
  gold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        flex: 1,
        padding: 24,
        border: gold
          ? "1px solid rgba(212,175,55,0.6)"
          : "1px solid rgba(138,147,168,0.3)",
        background: gold ? "rgba(212,175,55,0.06)" : "rgba(245,242,234,0.02)",
      }}
    >
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          letterSpacing: "0.22em",
          fontSize: 12,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: gold ? BRAND.gold : BRAND.bone,
          fontSize: 52,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          display: "flex",
        }}
      >
        {value}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.5)",
          fontSize: 11,
          letterSpacing: "0.18em",
          display: "flex",
        }}
      >
        {sub}
      </span>
    </div>
  );
}
