import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /privacy Dynamic OG ───────────────────────
// Distinct artifact: a list of what we DON'T collect.
// Inversion of the standard "privacy policy" OG that lists
// what gets collected — ours lists what's explicitly absent.
// Aligns with /manifesto Section IV PRIVACY axiom + Plausible
// "anti-surveillance" positioning research finding.
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Privacy · 我們刻意不收集的東西";

export default async function PrivacyOgImage() {
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
            PRIVACY · BY DESIGN
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
            marginBottom: 30,
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
            WHAT WE DELIBERATELY DON&apos;T COLLECT
          </span>
          <span
            style={{
              fontSize: 64,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            我們刻意
            <span style={{ color: BRAND.gold, marginLeft: 8 }}>不收集</span>
          </span>
        </div>

        {/* Don't-collect list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 19,
          }}
        >
          <NotCollected label="Google Analytics" en="0 install" />
          <NotCollected label="Facebook Pixel" en="0 install" />
          <NotCollected label="Hotjar / 行為錄影" en="0 install" />
          <NotCollected label="IP 地址 · 訪客指紋" en="0 storage" />
          <NotCollected label="第三方廣告 cookies" en="0 set" />
        </div>

        {/* Bottom */}
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
            這不是技術限制 · 是品牌哲學
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
            /privacy →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function NotCollected({ label, en }: { label: string; en: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 18,
        paddingBottom: 4,
        borderBottom: "1px solid rgba(212,175,55,0.10)",
      }}
    >
      <span
        style={{
          color: BRAND.loss,
          fontSize: 22,
          fontWeight: 700,
          minWidth: 30,
          letterSpacing: "0em",
          display: "flex",
        }}
      >
        ×
      </span>
      <span
        style={{
          color: BRAND.bone,
          fontSize: 20,
          letterSpacing: "-0.01em",
          flex: 1,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.4)",
          fontSize: 13,
          letterSpacing: "0.25em",
          display: "flex",
        }}
      >
        {en}
      </span>
    </div>
  );
}
