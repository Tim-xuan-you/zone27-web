import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import {
  HEY_TIM_COUNT,
  HEY_TIM_PENDING_COUNT,
  HEY_TIM_WRONG_THEN_CORRECTED_COUNT,
} from "@/lib/hey-tim-entries";

// ── ZONE 27 · /hey-tim Dynamic OG ──────────────────────
// R80 W-H · Subscriber Q&A ledger share card · Bill James「Hey Bill」
// 15-yr canonical pattern + Defector Funbag + Stratechery Daily Update
// + Tom Tango comments + patio11 reader-reply ethic · 訪客貼到 LINE /
// PTT 看到「您 ask · Tim 親手 reply · APPEND-ONLY · 0 cherry-pick」
// punch line。
//
// Brand IP fire:
//   - Cialdini Reciprocity(1984)· Tim 親手 reply ritual artifact
//   - Aronson Pratfall(1966)· 「wrong-then-corrected」 entries published
//   - Costly Signaling(Spence 1973)· 8th canonical ledger family · 無人能
//     fake 200-entry reply log
//   - audience-fans-not-engineers · CPBL fan-grammar dialogue surface
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Hey Tim · subscriber Q&A ledger · Bill James 15-yr pattern · 您 ask · Tim 親手 reply · APPEND-ONLY · 0 cherry-pick · 0 retroactive delete · 8th canonical append-only ledger family";

export default async function HeyTimOgImage() {
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
            HEY-TIM · BILL JAMES 15-YR PATTERN
          </span>
        </div>

        {/* HEADLINE · ask + reply choreography */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 50,
            marginBottom: 32,
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
            CIALDINI + ARONSON + SPENCE · 8TH LEDGER FAMILY
          </span>
          <span
            style={{
              fontSize: 96,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              display: "flex",
              fontFamily: "Georgia, serif",
            }}
          >
            您 ask
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
              fontFamily: "Georgia, serif",
            }}
          >
            Tim 親手 reply
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

        {/* DATA TABLE · ledger discipline breakdown */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 18,
          }}
        >
          <DataRow
            label="LEDGER ENTRIES"
            value={`${HEY_TIM_COUNT} · APPEND-ONLY`}
          />
          <DataRow
            label="PENDING TIM"
            value={`${HEY_TIM_PENDING_COUNT} · 7-day SLA`}
          />
          <DataRow
            label="WRONG → CORRECTED"
            value={`${HEY_TIM_WRONG_THEN_CORRECTED_COUNT} · Pratfall axis`}
          />
          <DataRow
            label="DISCIPLINE"
            value="0 cherry-pick · 0 retroactive · 0 ghostwritten"
          />
        </div>

        {/* BOTTOM · Bill James lineage + CTA */}
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
            Bill James + Defector + Stratechery + Tom Tango pattern
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            /hey-tim →
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
          fontSize: 13,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: BRAND.bone,
          letterSpacing: "-0.01em",
          fontSize: 18,
          display: "flex",
        }}
      >
        {value}
      </span>
    </div>
  );
}
