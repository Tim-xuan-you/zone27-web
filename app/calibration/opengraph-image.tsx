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
export const alt = "ZONE 27 · 引擎自評 · 公開我們準不準";

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
            引擎自評 · 公開準不準
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
            引擎準度公開
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

        {/* SUBTITLE · 球迷白話 */}
        <span
          style={{
            fontSize: 26,
            color: "rgba(245,242,234,0.72)",
            letterSpacing: "0.02em",
            lineHeight: 1.5,
            marginTop: 8,
            display: "flex",
            maxWidth: 900,
          }}
        >
          引擎賽前說的成數 · 賽後實際中的成數 · 一張圖攤開讓你看。
        </span>

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
            明牌站不敢做這頁。我們敢,而且做了。
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
            /calibration
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
