import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /ethics Dynamic OG ─────────────────────────
// Round 44 W-A · Agent K-discovered OG-card gap fix · R41 W-D shipped
// /ethics initially 8 binding commitments without OG card(R80 加 #09 →
// 現 9 binding)· per [[zone27-disclosure-philosophy]] OG cards = private-DM lever。
//
// /ethics 是 Stratechery About transplant · 9 binding NOT-DO commitments(R80
// 加 #09 mandatory-ledger discipline)· 玩運彩+報馬仔 violate 7/9 · ship 等於
// 商業自殺 · 此 OG card 必須 surface 此 brand-IP differentiation when shared。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Ethics Policy · 9 binding NOT-DO commitments(R80 加 #09 mandatory-ledger discipline · 配對 /integrity rule #12 引擎驗證夠準才開盤 scope + R81 rule #13 永遠不 subscription auto-renewal · scope + discipline + renewal 三軸 close brand IP loop)";

export default async function EthicsOgImage() {
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
            ETHICS POLICY · BINDING
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
            9 NOT-DO COMMITMENTS
          </span>
          <span
            style={{
              fontSize: 88,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            9 件永遠不做
          </span>
          <span
            style={{
              fontSize: 22,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 14,
              display: "flex",
            }}
          >
            ZONE 27 對訂閱者 · 對行業 · 對自己的 binding commitments
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

        {/* 3 TIER ROW · DISPLACEMENT · SUBSCRIBER · BRAND */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <TierStat n="6" label="DISPLACEMENT" sub="賣明牌的站 違反 6/6" gold />
          <TierStat n="2" label="SUBSCRIBER PROTECT" sub="0 ads · annual rev publish" />
          <TierStat n="1" label="BRAND" sub="never become tipster" />
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
            Paid-pick businesses violate 7/9 of these. Publishing this = business suicide for them.
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
            /ethics →
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
  sub,
  gold = false,
}: {
  n: string;
  label: string;
  sub: string;
  gold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        flex: 1,
        padding: 20,
        border: gold
          ? "1px solid rgba(212,175,55,0.6)"
          : "1px solid rgba(138,147,168,0.3)",
        background: gold ? "rgba(212,175,55,0.06)" : "rgba(245,242,234,0.02)",
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
          color: "rgba(245,242,234,0.7)",
          fontSize: 12,
          letterSpacing: "0.22em",
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.45)",
          fontSize: 10,
          letterSpacing: "0.15em",
          display: "flex",
        }}
      >
        {sub}
      </span>
    </div>
  );
}
