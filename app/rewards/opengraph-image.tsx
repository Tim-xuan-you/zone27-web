import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /rewards Dynamic OG ──────────────────────
// Round 35 W-B · Tim 11+ canary「集點兌換」 ecosystem play · OG card 完整
// shareability。 當 visitor 把 /rewards 貼到 LINE/FB · 顯示「PROVED →
// 實體獎品」 snapshot · 4 catalogue items 條列 · brand IP「skill-based
// fantasy league prize」 in image form。
//
// 設計原則:
//   - PRE-LAUNCH · Q4 2026 badge 顯眼
//   - 4 catalogue 條列(底片 / 咖啡 / 沖洗 / 護照代辦)
//   - 反向 marketing punchline:「Most prediction sites pay you in cash.
//     We pay you in 底片.」 brand-pure inversion · ecosystem play visible
//     in image form
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · /rewards · PROVED 預測兌換實體獎品 · 底片 / 伶 Kopi 咖啡 / 沖洗 / 護照代辦折抵 · 恆美攝影 ecosystem · 0 cash · 0 referral · brand-pure";

export default async function RewardsOgImage() {
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
        {/* TOP ROW · brand + path */}
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
            / REWARDS · PROVE-IT
          </span>
        </div>

        {/* PRE-LAUNCH badge */}
        <div style={{ display: "flex", marginTop: 30 }}>
          <span
            style={{
              fontSize: 13,
              color: BRAND.loss,
              letterSpacing: "0.4em",
              padding: "6px 14px",
              border: `1px solid ${BRAND.loss}`,
              display: "flex",
            }}
          >
            PRE-LAUNCH · Q4 2026 · CATALOGUE READY
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 56,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            PROVED → 實體獎品
          </span>
          <span
            style={{
              fontSize: 20,
              color: "rgba(245,242,234,0.65)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              marginTop: 12,
              display: "flex",
            }}
          >
            skill-based fantasy league prize · 0 cash · 0 referral · 0 訂閱
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 28,
            marginBottom: 22,
          }}
        />

        {/* Catalogue 4 items inline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <CatalogueRow points="20" item="底片 1 卷 · Kodak / Fuji / Ilford" />
          <CatalogueRow points="10" item="底片沖洗服務 1 卷 · 135 / 120" />
          <CatalogueRow points="15" item="護照證件代辦折抵 · NT$ 200" />
          <CatalogueRow points="5" item="伶 Kopi 咖啡 1 杯 · 義式 / 手沖" />
        </div>

        {/* Bottom · differentiator punchline */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
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
            }}
          >
            Most prediction sites pay you in cash. We pay you in 底片.
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
            /rewards →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-component ──────────────────────────────────────

function CatalogueRow({ points, item }: { points: string; item: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
      <span
        style={{
          color: BRAND.gold,
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          display: "flex",
          width: 60,
        }}
      >
        {points}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 12,
          letterSpacing: "0.2em",
          display: "flex",
          width: 60,
        }}
      >
        PROVED
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.85)",
          fontSize: 17,
          letterSpacing: "0.03em",
          display: "flex",
        }}
      >
        {item}
      </span>
    </div>
  );
}
