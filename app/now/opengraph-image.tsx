import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /now Dynamic OG ──────────────────────────
// Round 28 Wave 4 · Agent A #3. When the /now link is shared,
// preview shows "ZONE 27 此刻在做什麼 · 當下的工藝" + 3-section
// LIVE LABEL chips (SHIPPED · DISCOVERED · UNRESOLVED) — visitor
// understands this is a craft-journal page before clicking, not
// a marketing newsletter signup.
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · /now · 此刻在做什麼 · SHIPPED · DISCOVERED · UNRESOLVED craft journal";

export default async function NowOgImage() {
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
        {/* ── TOP · brand + path ─────────────────── */}
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
            / NOW
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
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
            CRAFT JOURNAL · 現在
          </span>
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
            ZONE 27 此刻在做什麼 ·
          </span>
          <span
            style={{
              fontSize: 56,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 4,
              display: "flex",
              textShadow: "0 0 60px rgba(212,175,55,0.25)",
            }}
          >
            當下的工藝
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 40,
            marginBottom: 32,
          }}
        />

        {/* ── 3-section labels · equal weight ─ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
          }}
        >
          <SectionChip
            label="SHIPPED"
            zh="本週 ship 了什麼"
            tone="full"
          />
          <SectionChip
            label="DISCOVERED"
            zh="本週發現的瑕疵"
            tone="loss"
          />
          <SectionChip
            label="UNRESOLVED"
            zh="本週還沒解決的"
            tone="mute"
          />
        </div>

        {/* ── BOTTOM punchline ──────── */}
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
            }}
          >
            Publishing the present is harder than publishing the future.
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
            /now →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function SectionChip({
  label,
  zh,
  tone,
}: {
  label: string;
  zh: string;
  tone: "full" | "loss" | "mute";
}) {
  const dotColor =
    tone === "full"
      ? BRAND.gold
      : tone === "loss"
      ? "rgba(214,80,80,0.6)"
      : "rgba(138,147,168,0.6)";
  const textColor =
    tone === "full"
      ? BRAND.gold
      : tone === "loss"
      ? "rgba(214,80,80,0.85)"
      : "rgba(138,147,168,0.85)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          background: dotColor,
          display: "flex",
        }}
      />
      <span
        style={{
          color: textColor,
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: "0.15em",
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 14,
          letterSpacing: "0.05em",
          textAlign: "center",
          display: "flex",
        }}
      >
        {zh}
      </span>
    </div>
  );
}
