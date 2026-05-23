import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import { ENGINE_OPS_LOG_COUNT } from "@/lib/engine-log-entries";

// ── ZONE 27 · /engine-log Dynamic OG ───────────────────
// R79 W-H · Engine Operations Log share card · Stripe Status 2012
// (Amber Feng week-1 hire)+ Cloudflare Nov 2025 postmortem +
// Tailscale changelog dated-entries pattern · 訪客貼到 LINE /
// PTT 看到「engine alive · someone on it · APPEND-ONLY」 punch
// line。
//
// Brand IP fire:
//   - Disclosure(operational artifact transparency)
//   - Pratfall(dated log includes corrections + staleness · 不藏)
//   - Costly Signaling(APPEND-ONLY = public bond)
//   - 同 R76 W-C lib/engine-log-entries.ts canonical append-only
//     family pattern(6th of 7 ledger family)
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Engine Operations Log · Stripe Status 2012 pattern · dated APPEND-ONLY log of every engine re-run · receipt correction · input-staleness · methodology update · 「engine alive · someone on it」";

export default async function EngineLogOgImage() {
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
            ENGINE-LOG · APPEND-ONLY
          </span>
        </div>

        {/* HEADLINE · engine-alive framing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
            marginBottom: 36,
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
            STRIPE STATUS 2012 PATTERN
          </span>
          <span
            style={{
              fontSize: 100,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            engine alive
          </span>
          <span
            style={{
              fontSize: 100,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginTop: 6,
              display: "flex",
            }}
          >
            someone on it
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginBottom: 28,
          }}
        />

        {/* 7 EVENT TYPE CHIPS · operational log surface */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 12,
            letterSpacing: "0.2em",
          }}
        >
          <EventChip label="ENGINE-LAUNCH" />
          <EventChip label="ENGINE-EVOLUTION" />
          <EventChip label="RECEIPT-INGEST" />
          <EventChip label="RECEIPT-CORRECTION" />
          <EventChip label="INPUT-STALENESS" />
          <EventChip label="METHODOLOGY-UPDATE" />
          <EventChip label="OPS-LOG-META" />
        </div>

        {/* BOTTOM · entry count + CTA */}
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
            {ENGINE_OPS_LOG_COUNT} entries · APPEND-ONLY per /audit S05
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            /engine-log →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function EventChip({ label }: { label: string }) {
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
      <span style={{ color: BRAND.bone, display: "flex" }}>{label}</span>
    </div>
  );
}
