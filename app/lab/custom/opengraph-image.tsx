import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /lab/custom Dynamic OG ────────────────────
// The canonical "engine is open" page per [[zone27-monetization-
// philosophy]] memory. When someone shares this URL, they should
// see a distinctly INTERACTIVE-looking artifact — input fields
// rendered with placeholder pitcher stats, gold accent on the
// "RUN" virtual button. Tells visitor: "you can put numbers in
// and run this yourself · the tool is yours."
//
// Distinct from /lab OG (lab = match-driven · custom = pitcher-
// driven). Distinct from /audit OG (audit = data table).
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Custom Lab · 自訂任意投手對戰";

export default async function LabCustomOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.13), transparent 60%)",
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
            LAB · CUSTOM · ENGINE v0.2
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
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
            INPUT YOUR OWN PITCHERS
          </span>
          <span
            style={{
              fontSize: 68,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            自訂任意投手 ·
          </span>
          <span
            style={{
              fontSize: 68,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 4,
              display: "flex",
            }}
          >
            一鍵跑 10,000 場
          </span>
        </div>

        {/* Input mockup · two pitcher cards */}
        <div
          style={{
            display: "flex",
            gap: 18,
          }}
        >
          <PitcherCard
            label="HOME"
            name="Flamethrower"
            k9="12.0"
            bb9="4.0"
            hr9="0.8"
          />
          <PitcherCard
            label="AWAY"
            name="Contact Pitcher"
            k9="6.0"
            bb9="2.0"
            hr9="1.0"
          />
        </div>

        {/* Run button mockup */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 28,
          }}
        >
          <span
            style={{
              background: BRAND.gold,
              color: BRAND.navy,
              padding: "12px 36px",
              fontSize: 14,
              letterSpacing: "0.3em",
              fontWeight: 500,
              display: "flex",
            }}
          >
            RUN 10,000 SIMULATIONS →
          </span>
        </div>

        {/* Bottom · brand axiom */}
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
            引擎免費 · 永遠免費 · 在您本機 CPU 跑 · 0 backend
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
            /lab/custom →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function PitcherCard({
  label,
  name,
  k9,
  bb9,
  hr9,
}: {
  label: string;
  name: string;
  k9: string;
  bb9: string;
  hr9: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "16px 20px",
        border: "1px solid rgba(212,175,55,0.25)",
        background: "rgba(15,26,46,0.5)",
      }}
    >
      <span
        style={{
          color: "rgba(212,175,55,0.7)",
          fontSize: 10,
          letterSpacing: "0.3em",
          marginBottom: 6,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: BRAND.bone,
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          marginBottom: 14,
          display: "flex",
        }}
      >
        {name}
      </span>
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "baseline",
        }}
      >
        <StatBox label="K/9" value={k9} />
        <StatBox label="BB/9" value={bb9} />
        <StatBox label="HR/9" value={hr9} />
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <span
        style={{
          color: "rgba(212,175,55,0.7)",
          fontSize: 9,
          letterSpacing: "0.2em",
          marginBottom: 2,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: BRAND.gold,
          fontSize: 26,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          display: "flex",
        }}
      >
        {value}
      </span>
    </div>
  );
}
