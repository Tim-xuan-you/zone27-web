import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /integrity Dynamic OG ────────────────────
// R79 W-F · Owner's Manual at Year 0 share card · Berkshire
// Hathaway 1996 Owner's Manual pattern · 13 redlines + 9 ethics
// = 22 永久 binding rules · 訪客貼到 LINE / PTT 看到「22 條永久
// 不會變的 · public bond not implicit」 punchline。
//
// Brand IP fire:
//   - Disclosure(canonical proof page consolidates scattered)
//   - Costly Signaling(publish 22 binding 100× per Spence 1973)
//   - Pratfall(13 redlines = 公開不做的事)
//   - audience-fans-not-engineers(Berkshire grammar pattern-match)
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Integrity · 22 永久不會變的 · Berkshire 1996 Owner's Manual at Year 0 · 13 redlines + 9 ethics commitments = public bond not implicit · R80 加 rule 12 引擎驗證夠準才開盤 scope + rule 09 mandatory-ledger discipline + R81 加 rule 13 永遠不 subscription auto-renewal · scope + discipline + renewal 三軸 close brand IP loop";

export default async function IntegrityOgImage() {
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
            INTEGRITY · YEAR 0
          </span>
        </div>

        {/* HEADLINE · 19 numeral hero */}
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
            OWNER&apos;S MANUAL · BERKSHIRE 1996 PATTERN
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 28,
            }}
          >
            <span
              style={{
                fontSize: 180,
                color: BRAND.gold,
                fontWeight: 300,
                letterSpacing: "-0.06em",
                lineHeight: 1,
                textShadow: "0 0 80px rgba(212,175,55,0.3)",
                display: "flex",
              }}
            >
              22
            </span>
            <span
              style={{
                fontSize: 60,
                color: BRAND.bone,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ display: "flex" }}>永久</span>
              <span style={{ display: "flex" }}>不會變的</span>
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 36,
            marginBottom: 28,
          }}
        />

        {/* DATA TABLE · 13 redlines + 9 commitments breakdown */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 20,
          }}
        >
          <PaperRow label="REDLINES · 永遠不做" value="13" />
          <PaperRow label="ETHICS COMMITMENTS · 永遠會做" value="9" />
          <PaperRow label="MODIFICATION NOTICE PERIOD" value="30 days · GitHub" />
        </div>

        {/* BOTTOM · public-bond punchline */}
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
            public bond not implicit · dated · Tim signature
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            /integrity →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function PaperRow({ label, value }: { label: string; value: string }) {
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
