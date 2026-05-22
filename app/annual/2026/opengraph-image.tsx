import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
} from "@/lib/founders-stats";

// ── ZONE 27 · /annual/2026 Dynamic OG ──────────────────
// Round 34 W-B · 補 R33 W-E ship gap · /annual/2026 missing OG card 是
// shareability gap · per Tim「驚艷全世界吧」 directive · trust artifact
// 必須 shareable。
//
// 當 visitor 把 https://zone27-web.vercel.app/annual/2026 貼到 LINE/FB ·
// 顯示「Year 0 Annual Report · 0 paid · NT$ 0 rev · radical transparency」
// snapshot · 不是通用品牌卡 · 是 brand IP statement in image form。
//
// 設計原則:
//   - Year 0 pre-launch state · 數字老實顯示 0 / 0 / NT$ 0
//   - 4 axiom chips:Pratfall · Costly Signaling · Disclosure · 倒置 SaaS
//   - 反向 marketing punchline:「Most SaaS hide their ARR. We publish
//     Year 0 NT$ 0.」 同 /track-record「hide misses」 + /founders/ledger
//     「publish rejections」 inversion pattern。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · Annual Report 2026 Year 0 · 0 paid subs · NT$ 0 revenue · honest pre-launch state · 4 brand IP axiom 同時 fire";

export default async function AnnualReportOgImage() {
  const forged = FOUNDERS_CLAIMED;
  const total = FOUNDERS_TOTAL;

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
        {/* ── TOP ROW · brand + path ─────────────────── */}
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
            / ANNUAL / 2026
          </span>
        </div>

        {/* ── PRE-LAUNCH BADGE ─────────────────────── */}
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
            YEAR 0 · PRE-LAUNCH · HONEST EMPTY STATE
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
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
            ANNUAL REPORT
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
            年度公開報告
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
            0 訂閱者 · NT$ 0 收入 · 6 項 what-failed · 4 項 2027 binding commitment
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
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

        {/* ── STATS · 4-col equal weight ────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
          }}
        >
          <StatBlock n="0" label="PAID SUBS" tone="loss" />
          <StatBlock n="0" label="REVENUE NT$" tone="loss" />
          <StatBlock n={`${forged}/${total}`} label="FORGED · LIMIT" tone="gold" />
          <StatBlock n="1" label="PROVED ✓ · N=" tone="bone" />
        </div>

        {/* ── BOTTOM · differentiator punchline ──────── */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
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
            Most SaaS hide their ARR. We publish Year 0 NT$ 0.
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
            /annual/2026 →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function StatBlock({
  n,
  label,
  tone,
}: {
  n: string;
  label: string;
  tone: "loss" | "gold" | "bone";
}) {
  const color =
    tone === "loss"
      ? BRAND.loss
      : tone === "gold"
      ? BRAND.gold
      : BRAND.bone;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          color,
          fontSize: 78,
          fontWeight: 300,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          display: "flex",
        }}
      >
        {n}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 12,
          letterSpacing: "0.22em",
          textAlign: "center",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
