import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /membership/black-card/ledger Dynamic OG ──
// Round 44 W-A · Agent K-discovered OG-card gap fix · R39 W-G shipped
// /membership/black-card/ledger without OG card · per
// [[zone27-disclosure-philosophy]] OG cards = private-DM lever。
//
// /membership/black-card/ledger 是 Aftermath subscriber goals + Patek
// allocation transparency 合一 · 0 paid sub honest publish · 「您會是第
// 1 位」 inverse-FOMO · 玩運彩+報馬仔 結構性無法 publish(regulatory +
// privacy + churn 暴露)· OG card 必須 surface「empty IS the artifact」
// brand IP when shared。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · BLACK Public Ledger · 0 paid · 您會是第 1 位";

export default async function BlackCardLedgerOgImage() {
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
            BLACK · PUBLIC LEDGER
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
            EMPTY LEDGER · BY DESIGN
          </span>
          <span
            style={{
              fontSize: 96,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
            }}
          >
            0 / 270
          </span>
          <span
            style={{
              fontSize: 26,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 14,
              display: "flex",
            }}
          >
            目前 0 位 BLACK 訂閱者 · 您會是第 1 位 · row 1 永久
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

        {/* DATA ROW · pricing + start state */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontSize: 20,
            color: BRAND.bone,
          }}
        >
          <DataRow label="PRICING" value="NT$ 500 / season · 手動銀行轉帳" />
          <DataRow label="LEDGER STATE" value="0 paid · 0 cancelled · 0 churned" />
          <DataRow label="CHURN POLICY" value="cancel = row state=cancelled · 不刪不藏" />
          <DataRow label="LAUNCHED" value="2026-05-22 · row 1 等您" />
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
            別的訂閱制都藏會員數 · 我們公開:目前 0。
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
            /ledger →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 24,
      }}
    >
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          letterSpacing: "0.2em",
          fontSize: 14,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: BRAND.bone,
          letterSpacing: "-0.01em",
          fontSize: 22,
          display: "flex",
        }}
      >
        {value}
      </span>
    </div>
  );
}
