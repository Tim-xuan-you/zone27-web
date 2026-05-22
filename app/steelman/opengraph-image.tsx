import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /steelman Dynamic OG ───────────────────────
// Round 44 W-A · Agent K-discovered OG-card gap fix · R42 W-A shipped
// /steelman without OG card · per [[zone27-disclosure-philosophy]] OG
// cards = private-DM lever。
//
// /steelman 是 adversarial collaboration pattern 倒置「自己當銷售」 ·
// 5 strongest objections self-published + honest concessions · 玩運彩+報
// 馬仔 永遠 ship 不出來(他們 steelman = obituary)· OG card 必須 surface
// adversarial-collab differentiation。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Steelman · 5 strongest objections self-published";

export default async function SteelmanOgImage() {
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
        {/* TOP ROW */}
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
            STEELMAN · ADVERSARIAL COLLAB
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
            5 STRONGEST OBJECTIONS
          </span>
          <span
            style={{
              fontSize: 80,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            反 ZONE 27 最強論證
          </span>
          <span
            style={{
              fontSize: 22,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 14,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            ZONE 27 自己 publish · 我們先寫了 · 5 honest concessions · 0 dismissals
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

        {/* OBJECTION TITLES · 3-row layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 15,
            color: BRAND.bone,
          }}
        >
          <ObjRow num="01" title="Bayesian ensembles 在 12-team CPBL 過擬合" />
          <ObjRow num="02" title="Park factors 4 場館 estimate 是 noise" />
          <ObjRow num="03" title="Workload Proxy 命名 = marketing dressed engineering" />
          <ObjRow num="04" title="「方法公開」 是 commodity · 不是 differentiation" />
          <ObjRow num="05" title="Pre-launch transparency 是 Pratfall 還是 spinning?" />
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
            Tipsters can&apos;t write their own steelman. Their steelman = obituary.
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
            /steelman →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function ObjRow({ num, title }: { num: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 18,
      }}
    >
      <span
        style={{
          color: "rgba(232,69,69,0.7)",
          fontSize: 14,
          letterSpacing: "0.3em",
          minWidth: 40,
          display: "flex",
        }}
      >
        ✕ {num}
      </span>
      <span
        style={{
          color: BRAND.bone,
          fontSize: 17,
          letterSpacing: "-0.01em",
          display: "flex",
        }}
      >
        {title}
      </span>
    </div>
  );
}
