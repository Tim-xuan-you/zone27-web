import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /letter Dynamic OG ───────────────────────
// R79 W-C · Singular voice artifact share card · DHH HEY World
// + Berkshire annual letter + Bret Victor replace-in-place +
// Maciej Cegłowski Pinboard blog pattern · 訪客貼到 LINE / PTT
// 看到「Tim 親手 letter · 不是 blog · 不是 newsletter · 0 push」
// 直接 punch line。
//
// Brand IP fire:
//   - Disclosure(singular voice IS disclosure axis)
//   - Pratfall(vulnerable + brief + edited-in-place)
//   - audience-fans-not-engineers(Tim 親手 voice speaks fan-grammar)
//   - reader-pulls-not-pushed(no email · no comment thread · no
//     share button)
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · The Letter · Tim 親手 voice · DHH HEY World pattern · NO email · NO push · NO comment thread · reader pulls";

export default async function LetterOgImage() {
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
            THE LETTER · MAY 2026
          </span>
        </div>

        {/* HEADLINE · 信 character + 親手 framing */}
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
            SINGULAR VOICE · EDITED IN PLACE
          </span>
          <span
            style={{
              fontSize: 110,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              display: "flex",
              fontFamily: "Georgia, serif",
            }}
          >
            Tim 親手
          </span>
          <span
            style={{
              fontSize: 110,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginTop: 6,
              display: "flex",
              fontFamily: "Georgia, serif",
            }}
          >
            一封信
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

        {/* 4 ABSENCE CHIPS · pull-not-push grammar */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 14,
            letterSpacing: "0.22em",
          }}
        >
          <AbsenceChip label="NO EMAIL" />
          <AbsenceChip label="NO PUSH" />
          <AbsenceChip label="NO COMMENT" />
          <AbsenceChip label="NO SUBSCRIBE" />
        </div>

        {/* BOTTOM · pattern lineage punchline */}
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
            DHH HEY World · Berkshire letter · Pinboard blog
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            READER PULLS · /letter →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function AbsenceChip({ label }: { label: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.4)",
        padding: "6px 14px",
        display: "flex",
        gap: 10,
        alignItems: "baseline",
        background: "rgba(212,175,55,0.04)",
      }}
    >
      <span
        style={{
          color: "rgba(212,175,55,0.7)",
          fontSize: 11,
          display: "flex",
        }}
      >
        ✕
      </span>
      <span style={{ color: BRAND.bone, display: "flex" }}>{label}</span>
    </div>
  );
}
